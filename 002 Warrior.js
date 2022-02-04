//STARTING LINE OF CODE

var mobs = "rat";
var tank_party = ["Rentaro", "Hibari", "Souji", "Sinonz"];
var sell_whitelist = ["helmet", "shoes", "pants", "gloves", "coat", "xmace", "hpamulet", "hpbelt", "ringsj","stinger", "wattire", "xmace", "wbreeches", "wshoes", "wgloves", "wcap", "snowball", "carrotsword", "slimestaff", "glolipop", "spores", "ololipop", "beewings", "gslime", "whiteegg", "xmasshoes", "xmashat", "mittens", "warmscarf", "xmaspants", "rednose", "xmassweater", "snowflakes", "merry", "crabclaw", "cclaw", "sstinger", "carrot",];
load_code ('HealthStatus');
//load_code ('Dmeter');
load_code ('CodeCostMeter');
//load_code ('wKite');

setInterval(function(){
    loot();
    farming();	
	self_respawn()
//	send_merchant_goodies();
},250); 

function warrior_skills(){
if(character.ctype == "warrior"){
	skillHardShell();
	skillCharge();
	skillAgitate();		
	skillDash();
	skillWarcry();
	//skillCleave();
	//skillTaunt();
	}
}

function skillCleave(target){
	var manaReserve = 0.7
	if(smart.moving) return
	if(manaReserve >= (character.mp / character.max_mp)) return
	var target = get_targeted_monster();
	if (target){
		if(is_in_range(target,"cleave")&& !is_on_cooldown("cleave")){
		log(target.name + " was Cleaved!");
		use_skill("cleave",target);
		}	
	}
}

function skillTaunt(target){
	var manaReserve = 0.7;  // You have 70% use skills
	var target=get_nearest_monster({type: mobs}); // fight nearest monster
	if (smart.moving) return
		if(manaReserve >= (character.mp / character.max_mp)) return // Continue to use skill if above manaReserve
		if (target){
		if(is_in_range(target,"taunt")&& !is_on_cooldown("taunt")){
			if (target.s.taunt)return;
			set_message("TAUNT"); // Console statement 
			log("Taunted " + mobs.name);
			use_skill("taunt",target);
		}
	}
}

function skillHardShell(){
	if (character.level >= 60){
		if(!is_on_cooldown("hardshell") && character.hp / character.max_hp <= .25){ 
		log("HARDSHELL");
		use_skill("hardshell")
		}	
	}
}

function skillCharge(){
var manaReserve = 0.8	
if(manaReserve >= (character.mp / character.max_mp)) return 
// Continue to use skill if above manaReserve
if(!is_on_cooldown("charge")){ 
	set_message("CHARGE"); // Console statement 
	log("CHARGE");
	use_skill("charge")
	}	
}


	let last_dash = 0;
	function skillDash(){
		if(Date.now() - last_dash >= 1000) return 
		if(!is_on_cooldown("dash") && character.hp / character.max_hp <= .10){ 
		set_message("DASHED"); // Console statement 
		log("DASHED TO SAFETY");
		use_skill("dash")
		last_dash = Date.now()
		}	
	}


var last_agitate;
function skillAgitate(){
var manaReserve = 0.7;  // You have 70% use skills
var target=get_nearest_monster(); // fight nearest monster
if (smart.moving) return
if(manaReserve >= (character.mp / character.max_mp)) return // Continue to use skill if above manaReserve
if(last_agitate == null || new Date() - last_agitate >= 5000){
	if (character.level >= 68){
		if (target){
			if(is_in_range(target,"agitate")&& !is_on_cooldown("agitate")){
				set_message("AGITATE"); // Console statement 
				log("Agitated " + target.name);
				use_skill("agitate",target);
				last_agitate = new Date();
				}
			}
		}
	}
}

function skillWarcry(){
var manaReserve = 0.5;	
	if (character.level >= 70){
	if(manaReserve >= (character.mp / character.max_mp)) return // Continue to use skill if above manaReserve
	if (!character.s.warcry && !is_on_cooldown("warcry")){
		set_message("WAR CRY"); // Console statement 
		log("Teams Power increased");  // WARCRY used sucessfully and logged
		use_skill("warcry");
		}
	}	
}



	sell_items()

setInterval(function(){
//	call_mercahnt();
},550); //60000 = 1m

setInterval(function(){
//	send_merchant_goodies();
},500); 

//ATTACK CODE END
function farming(){
    var target = get_nearest_monster();
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
			warrior_skills()
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
//

//FIGHT BOSSES BEGIN
function getNearestBoss(args){
    var target=get_targeted_monster;
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
        target = get_nearest_monster({type:m});
    return target;
}
//FIGHT BOSSES END



//Call Merchant for Items and gold (Goes on Farmers)
function call_mercahnt(){
    //check if we have money for the merchant
    if (character.gold > 600000 * 2 && !is_moving("Rentaro"))
    {
        //tell the merchant to come
        send_cm("Rentaro",
		{
            x: character.real_x,
            y: character.real_y,
            map: character.map,
//			items: 
//			{ // items sent to character who made request
//    		'mpot1': 1000,
//    		'hpot1': 1000,
//  			}
        });
        //check if the merchant is here
        if (get_player("Rentaro")){
            
            send_cm("Rentaro", "done");
        };
    };
}
//Call Merchant for Items and gold (Goes on Farmers)


//Send Merchant Items and gold (Goes on Farmers)
var gold_threshold = 600000;
var potion_data = ["hpot1", "mpot1", 1000]
var pot_stack = 1000;
var keep_items_whitelist = ["tracker", potion_data[0], potion_data[2]]
function send_merchant_goodies(){
    if(character.ctype != "merchant"){
        let merchant = get_player(tank_party[0]);
        if(merchant != null){
            //send gold and items
            if(character.gold > gold_threshold * 2){
                send_gold(tank_party[0], gold_threshold);
            }
            for(let i in character.items){
                let item = character.items[i];
                if(item){
                    if(!keep_items_whitelist.includes(item.name)){
                        //send it to merchant if not in whitelist
                        var slot = locate_item(item.name);
                        send_item(tank_party[0], slot, 9999);
                    }
                }
            }
        }
    }
}
//Send Merchant Items and gold (Goes on Farmers)

/*
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

//Respawn Start
var last_respawn = null;
function self_respawn(){
	if(character.rip){
		if(last_respawn == null || new Date() - last_respawn >= 30000){
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

