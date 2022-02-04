//MAIN LOOP

load_code ('HealthStatus');
//load_code ('Kite');
var mobs = "minimush";
var gangup_mob = ["nerfedmummy", "crabx", "boar", "cgoo", "iceroamer", "bbpompom"];
const tank_party = ["Rentaro", "Hibari", "Souji", "Sinonz"]
const merchant_name = tank_party[0];
const farmer_names = [tank_party[1], tank_party[2], tank_party[3]];
const potion_types = ['hpot1', 'mpot1']; // value is stack amount desired
const stack_amt = 1000;
const keep_whitelist = [potion_types[0], potion_types[1], 'tracker'];

setInterval(function(){
    farming();
	followLeader(-50, 50);
	priest_skills();
    self_respawn();
	loot();
	fixAddLog();
    send_items_to_merchant();
    request_merchant();
    //accept_party_invite();
},250); 

//MAIN LOOP


function priest_skills(){
	if(character.ctype == "priest"){
		skillPartyH(); //connected to healparty
		//healparty();
		skillCurse();
		skillDarkb();
		//skillAbsorb();
		//skillPhase();
		//skillRevive();
	}
}


function skillDarkb(){
var manaReserve = 0.5	// Continue to use skill if above manaReserve
	if(manaReserve >= (character.mp / character.max_mp)) return 
	if (character.level >= 70){
	if (!character.s.darkblessing && !is_on_cooldown("darkblessing")){
		set_message("DARKBLESSING"); // Console statement 
		log("Damage increased");  // DARKBLESSING used sucessfully and logged
		use_skill("darkblessing");
		}
	}	
}

function skillCurse(){ // Skill Curse
var manaReserve = 0.7		
var target=get_targeted_monster();
	if(manaReserve >= (character.mp / character.max_mp)) return
	if(is_in_range(target,"curse")&& !is_on_cooldown("curse")){
		set_message("CURSE"); // Console statement 
		log("Cursed " + target.name);
		use_skill("curse");
	}
}	

let last_pheal = 0;
function skillPartyH(){  //Skill Heal Party
for(id in parent.entities){
var current = parent.entities[id];
    if(last_pheal == null || new Date() - last_pheal >= 5000){
	    if(current && current.type == 'character'){
		    if(can_heal(current)) { // Base HP is < 50% of Max HP
    		    set_message("PARTYHEAL"); // Console statement 
			    use_skill("partyheal");  // Heal up Party
                last_pheal = new Date();
			    }
		    }
	    }
    }
}

//Respawn Start
var last_respawn = null;
function self_respawn(){
	if(character.rip){
		if(last_respawn == null || new Date() - last_respawn >= 10000){
		   	respawn();
			last_respawn = new Date();
		} else {
			if(!is_moving(parent.character)) {
                smart_move(mobs);
            }
		}
	}
}
//Respawn End


//HEALING CODE
party = [{name: "Hibari", priority: 0},
         {name: "Sinonz", priority: 0}];
var heal_threshold = 95;
function healparty(){
    var target = null;
    // build a priority list built on % health lost
    if(character.ctype == "priest"){
    for (var x = 0; x < party.length; x++) 
    {
        target = get_player(party[x].name)
        change_target(target);
        if (target)
            party[x].priority = (target.hp * 100) / target.max_hp;
        else
            party[x].prioirty = 0
    }
    
    //lets determine the highest heal priority
    var highest = 0;
    for (var x = 0; x < party.length; x++) 
    {
        if (party[x].priority > party[highest].priority)
            highest = x;
    }
		    if (party[highest].priority < heal_threshold)
    {
        target = get_player(party[highest].name);
		set_message("HEALING");
        log("HEALING HEALING " + party[highest].name);
        heal(target);		
		return;
	        } 
        }
}
//HEALING CODE

// FOLLOW LEADER
function followLeader(xreal, yreal){
    let leader = get_player(tank_party[1]);
        if (leader && !character.moving){
            move(leader.real_x + xreal, leader.real_y - yreal);
    }
}
// FOLLOW LEADER


function getBestTarget(type = mobs) {
    // Return the closest monster already targeting me, if there is one
    const targetingMe = get_nearest_monster({target: character.id, type: type})
    if(targetingMe) return targetingMe
  
    // Return the closest target of the given type
    return get_nearest_monster({type: type})
  }

//ATTACK CODE END
function target_function(){
    var target = get_targeted_monster();
    if(gangup_mob.includes(mobs)){
    	assistLeader();
	}else{ 
        farming();
        }
}
function farming(){
    var target = getBestTarget();
    if (!target){
 		target=get_nearest_monster({no_target: true, path_check: true, type: mobs});
        if(target){
            change_target(target);
        } else {
            set_message("No Monsters");
            if(!is_moving(parent.character)) {
                smart_move({ to: mobs });
            }
        } 
    } else {
        if(distance_to_target(target) > character.range){
            if(!is_moving(parent.character)) {
			var half_x = character.real_x + (target.real_x - character.real_x) / 2;
            var half_y = character.real_y + (target.real_y - character.real_y) / 2;
            move(half_x, half_y);
            }
        } else if (can_attack(target)){
			set_message("ATK " + target.mtype);
            //log("Farming " + target.mtype);
            attack(target);
        }
    }
}
function distance_to_target(target){
    if(target){
        var dist = distance(character,target);
    } else {
        var dist = null;
    }
    return dist;
}
//ATTACK CODE END

//FIGHT BOSSES BEGIN
function getNearestBoss(args){
    var target=null;
    for (i in parent.entities){
        let entity = parent.entities[i];
        if (entity.dead || entity.type != "monster")
            continue;
        if (args.mtype && entity.mtype != args.mtype) continue;
        let distance = parent.distance(character, entity);
        if (distance < 999999)
            target = entity;
        }
    return target;    
}
function getTarget(m){
    var target;
    if (!target)
        target = getNearestBoss({ mtype: "phoenix" });
    if (!target)
        target = getNearestBoss({ mtype: "grinch" });
    if (!target)
        target = getNearestBoss({ mtype: "goldenbat" });
    if (!target)
		target = getNearestBoss({ mtype: "snowman" });
    if (!target)
		target = getNearestBoss({ mtype: "cutebee" });
    if (!target)
        target = get_nearest_monster({type:m});
    return target;
}
//FIGHT BOSSES END

// ASSIST LEADER CODE BEGIN
function assistLeader(){
    let leader = get_player(tank_party[1]);//Party leader
    let currentTarget = get_target();//Current target and target of leader.
    let leaderTarget = get_target_of(leader);
    let targetTarget = get_target_of(currentTarget);
        if (!currentTarget || currentTarget !== leaderTarget) { //Change the target.
            change_target(leaderTarget);//Current target or other than the leader's.
            currentTarget = get_target();
        }
        if (currentTarget && can_attack(currentTarget) && targetTarget == leader) {
            attack(currentTarget);
            set_message("Attacking: " + currentTarget.mtype);
        }
}
// ASSIST LEADER CODE END


//FARMERS INVITES     
function accept_party_invite(){
if(!character.party){
    if(character.name != tank_party[0]){
        accept_party_invite(tank_party[0]);
    	}
	}
}
//FARMERS INVITES  



// farmers will send farmed items to the merchant
function send_items_to_merchant(){
    var merchant = get_player(merchant_name);
    if(merchant != null){ // is the merchant around?
        var distance = distance_to_point(merchant.real_x, merchant.real_y, character.real_x, character.real_y);
        if(distance <= 300){
            // if we are close to the merchant, so we can send items...
            // we loop through all the items in our inventory
            for(let i in character.items){
                let slot = character.items[i]; // this defines a slot in the loop
                if(slot != null){ // if something is in the slot, and it's not empty
                    let name = slot.name; // we grab the item name
                    if(!keep_whitelist.includes(name)){ // if we don't have the item whitelisted to keep
                        // we sell the item.
                        // i is for the current slot in your loop
                        // 9999 is to sell the max amount of whatever is in the slot
                        send_item(merchant_name, i, 9999);
                    }
                }    
            }
            send_gold_to_merchant(); // refer to function for details
        }
    }
}

// farmers will send excess gold to the merchant
function send_gold_to_merchant(){
    var retain = retain_gold_amount(); // this function allows us to check how much gold i need to keep for potions
    if(character.gold > retain){ // if we have a lot of gold...
        var send_amt = character.gold - retain;
        if(send_amt >= 300000){ // if we have at least 1,000 gold to send...
            // we send it to the merchant
            parent.socket.emit("send",{name:merchant_name,gold:send_amt});
        }
    }
}

// retains a set amount of gold for potions, never gives to the merchant
function retain_gold_amount(){
    var hp_gold = parent.G.items[potion_types[0]].g; // price of single health pot
    var mp_gold = parent.G.items[potion_types[1]].g; // price of single mana pot
    var hp_total = hp_gold * stack_amt; // total gold to purchase our stack amount
    var mp_total = mp_gold * stack_amt; // total gold to purchase our stack amount
    var keep_gold = hp_total + mp_total; // costs of both a stack of health pots and a stack of mana pots
    return keep_gold;
}

// a farmer will 'ping' the merchant with some information, and the merchant will be coded to respond
// this one will ask the merchant to bring potions based on three things...
function request_merchant(){
    // 1) how many health pots we have. 2) how mana mana pots we have. 3) how much inventory space we have
    if(quantity(potion_types[0]) < 100 || quantity(potion_types[1]) < 100 || character.esize < 5){
        // if any of those conditions are met, then we need a visit from the merchant
        // we need to give the merchant some information when we ping them.
        var data = {
            message: 'bring_potions',
            location: {x: character.real_x, y: character.real_y, map: character.map},
            hpot: stack_amt - quantity(potion_types[0]), // how many we need
            mpot: stack_amt - quantity(potion_types[1]), // how many we need
            name: character.name,
        };
        // this pings the merchant by name, and the information is defined as a variable 'data'
        send_cm(merchant_name, data);
    }
}

function fixAddLog()
{
    if (parent.addLogFixed) {
        return;
    }

    const oldAddLog = parent.add_log;
    const regex = /killed|gold/;
    parent.add_log = (message, color) => {
        if (typeof message === 'string' && !message.match(regex)) {
            oldAddLog(message, color);
        }
    };

    parent.addLogFixed = true;
}

// we take the x and y coordinates of a point, and compare it to another point
// we can then derive the distance between two points
function distance_to_point(x1, y1, x2, y2){
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}