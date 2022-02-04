//MAIN LOOP
var mobs = "phoenix";
const skilltarget = ["rat", "bee", "crab", "squigtoad", "snake", "armadillo", "croc", "squig", "spider", "porcupine", "goo", "poisio", "tortoise"];
load_code ('HealthStatus');
var gangup_mob = ["nerfedmummy", "crabx", "boar", "cgoo", "iceroamer"]
var tank_party = ["Rentaro", "Hibari", "Souji", "Sinonz"]
var sell_whitelist = ["helmet", "shoes", "pants", "gloves", "coat", "xmace", "hpamulet", "hpbelt", "ringsj","stinger", "wattire", "xmace", "wbreeches", "wshoes", "wgloves", "wcap", "snowball", "carrotsword", "slimestaff", "glolipop", "spores", "ololipop", "beewings", "gslime", "whiteegg", "xmasshoes", "xmashat", "mittens", "warmscarf", "xmaspants", "rednose", "xmassweater", "snowflakes", "merry", "crabclaw", "cclaw", "sstinger", "carrot",];
setInterval(function(){
    loot();
	farming(); // attack mobs w/o leader
	self_respawn();
    //target_function();
	//assistLeader()// attack mobs w/o leader
	
	followLeader(50, -50);
},250); 
	sell_items()
//MAIN LOOP

function ranger_skills(){
	skillHuntersmark();
	skillSupershot();
	//skill3shot();
}


let last_use_3shot = 0;
function skill3shot(){
if(smart.moving) return
	var manaReserve = 0.7			
	var target=get_nearest_monster(target);
    	if(manaReserve >= (character.mp / character.max_mp)) return
    	if(last_use_3shot == null || new Date() - last_use_3shot >= 3000){
    		for(id in parent.entities){
			var entity = parent.entities[id];
        		if(entity.type === "monster" && skilltarget.includes(entity.mtype)){
				//if(entity.level > 3)return;
        		if(is_in_range(entity,"3shot")&& !is_on_cooldown("3shot")){
        			use_skill("3shot",target);
        			last_use_3shot = Date.now();
				}
			}
		}
	}
}


function skillHuntersmark(target){
	var manaReserve = 0.7
	if(smart.moving) return
	if(manaReserve >= (character.mp / character.max_mp)) return
		var target = get_targeted_monster();
		if (target){
		if(is_in_range(target,"huntersmark")&& !is_on_cooldown("huntersmark")){
			log(target.name + " has a Hunters mark");
			use_skill("huntersmark",target);
		}	
	}
}




//SUPERSHOT

//SUPERSHOT
function skillSupershot(target){
	var manaReserve = 0.7
	if(manaReserve >= (character.mp / character.max_mp)) return
	var target = get_targeted_monster();
	if (target){
		if(is_in_range(target,"supershot")&& !is_on_cooldown("supershot")){
		set_message("SUPERSHOT"); // Console statement 
		log(target.name + " was SUPPASHOT");
		use_skill("supershot",target);
		}	
	}
}
//SUPERSHOT



//MERCHANT
setInterval(function() {
send_gold("Rentaro",character.gold);	
}, 300000); // 5mins
//MERCHANT

//ACCEPT PARTY INVITE
setTimeout(initParty, 9000);
function initParty(){
if(name = "Hibari");
accept_party_invite(name);
}
setInterval(function() {
if(name = "Hibari");
accept_party_invite(name);
}, 200000); // 5mins
//ACCEPT PARTY INVITE

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

function farming(t) { 
    if (!t){
        target = get_target(mobs);
        change_target(target);
    } // if the target is NOT in range, move closer
    else {
      change_target(t);
    } // if the target is NOT in range, move closer
    if(distance_to_target(target) > character.range){
        if(!character.moving){
        var half_x = character.real_x + (target.real_x - character.real_x);
        var half_y = character.real_y + (target.real_y - character.real_y);
        move(half_x, half_y);
    }
    }// or if your in range, attack the target
    else if(can_attack(target))        {
        log("Attacking " + target.mtype);
        set_message("ATTACKING");
		ranger_skills();
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

/*
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
*/

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
		return;
	}
	
}
//Respawn End

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

  
phoenixLocations = [
    { "map":"main", x:-1145, y:-4},// mincrab
    { "map":"main", x: -1169, y: 550},  // squig
    { "map":"main", x: -965, y: 1588},  // bigcrab
    { "map":"cave", x: 16, y: -1162}, // Cave of Darkness
    { "map":"main", x: 650, y: 1830}, // armadillo
    { "map":"main", x: 1260, y: -173}, // spider
    { "map":"halloween", x: 5, y: 436}, // Spooky Forest
  ];
  
  
curPhoenix = 0;

async function phoenix_farming(phoenix) {
    try { 
	var target=get_nearest_monster({type: mobs});
    if(target){
        log("Target aquired: " + target.mtype);
        farming(target);
    } else {
        await smart_move({x: phoenixLocations[curPhoenix].x, y: phoenixLocations[curPhoenix].y, map: phoenixLocations[curPhoenix].map}); // mincrab
        }
        if (curPhoenix == 6) {
            curPhoenix = 0;
        } else {
            curPhoenix++
        }
        } 
        
        catch(e) {
        console.error(e)
        }
        setTimeout(async () => { await phoenix_farming() }, 1000)
      }
phoenix_farming()

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
