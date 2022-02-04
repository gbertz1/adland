//MAIN LOOP
var mobs = "goo";
load_code ('HealthStatus');
//load_code ('Kite');
var gangup_mob = ["nerfedmummy", "crabx", "boar", "cgoo", "iceroamer", "bbpompom"];
var tank_party = ["Rentaro", "Hibari", "Souji", "Sinonz"];
var sell_whitelist = ["helmet", "shoes", "pants", "gloves", "coat", "xmace", "hpamulet", "hpbelt", "ringsj","stinger", "wattire", "xmace", "wbreeches", "wshoes", "wgloves", "wcap", "snowball", "carrotsword", "slimestaff", "glolipop", "spores", "ololipop", "beewings", "gslime", "whiteegg", "xmasshoes", "xmashat", "mittens", "warmscarf", "xmaspants", "rednose", "xmassweater", "snowflakes", "merry", "crabclaw", "cclaw", "sstinger", "carrot",];
setInterval(function(){
    self_respawn()
	loot();
	//followLeader(25, 25);
	healparty();
	target_function();
},250); 
//MAIN LOOP

	sell_items()

//Respawn Start
var last_respawn = null;
function self_respawn(){
	if(character.rip){
		if(last_respawn == null || new Date() - last_respawn >= 10000){
		   	respawn();
			last_respawn = new Date();
		}
		return;
	}
	
}
//Respawn End

function skillPartyH(){  
	for(id in parent.entities){
	var current = parent.entities[id];
	if(current && current.type == 'character'){
		if(can_heal(current)) { 
    		set_message("PARTYHEAL"); // Console statement 
			log("PARTY HEAL");  // Party heal used sucessfully and logged
			use_skill("partyheal");  // Heal up Party
			}
		}
	}
}
/*
function skillCurse(){ // Skill Curse
var manaReserve = 0.7			
var target=get_nearest_monster();
	if(manaReserve >= (character.mp / character.max_mp)) return
		if (!target){
			target = getTarget(farm_mob[0]);  // Change farm_mob to your main target
	}
	if(is_in_range(target,"curse")&& !is_on_cooldown("curse")){
		set_message("CURSE"); // Console statement 
		log("Cursed " + target.name);
		use_skill("curse",target);
	}	
}
*/

//HEALING CODE
party = [{name: "Hibari", priority: 0},
         {name: "Sinonz", priority: 0}];
function healparty(){
var heal_threshold = 95;
    var target = null;
    // build a priority list built on % health lost
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
        log("HEALING HEALING " + party[highest].name);
        heal(target);
		skillPartyH();
	} else {
		 if (!target)
		    target_function();
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

//ATTACK CODE END
function target_function(){
    var target = get_targeted_monster();
    if(gangup_mob.includes(mobs)){
    	assistLeader();
	}else{ 
        farming();
        }
}
function farming() {
    var target = null;
    if (!target){
        target = getTarget(mobs);
        change_target(target);
    } // if the target is NOT in range, move closer
    if(distance_to_target(target) > character.range){
        if(!character.moving){
        var half_x = character.real_x + (target.real_x - character.real_x);
        var half_y = character.real_y + (target.real_y - character.real_y);
    }
    }// or if your in range, attack the target
    else if(can_attack(target))        {
        log("Attacking " + target.mtype);
        set_message("ATTACKING");
		//skillCurse();
        attack(target);
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


/*
//skillCurse
function skillCurse(){
var target = null;
    if (!target){
        target = getTarget(mobs);
	}
	if(is_in_range(target,"curse")&& !is_on_cooldown("curse") && character.mp / character.max_mp >= .95){
    log("Cursed " + target.name);
    use_skill("curse",target);
	}	
}
//skillCurse


//FARMERS INVITES     
if(!character.party){
    if(character.name != tank_party[0]){
        accept_party_invite(tank_party[0]);
    }
}else{
    if(!character.party != tank_party[0]){
        leave_party();
    }
}
//FARMERS INVITES
*/

//SELL ITEMS
function sell_items(){
    for(let i in character.items){
        let slot = character.items[i];
        if(slot != null){
            let item_name = slot.name;
            if(sell_whitelist.includes(item_name)){
                if(!slot.p){
                    sell(i, 9999);
					
                }                
            }
        }
    }
}
//SELL ITEMS

    const merchant_name = ["Rentaro"];
const potion_types = ['hpot1', 'mpot1'];
const keep_whitelist = [potion_types[0], potion_types[1], 'tracker'];
send_items_to_merchant()
function send_items_to_merchant(){

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
        }

