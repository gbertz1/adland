   //xGbertsx Code v.1.0\\
//   Monster Hunter Quest  \\

//MAIN LOOP
var mobs = "rat";
var gangup_mob = ["nerfedmummy"]
var tank_party = ["Rentaro", "Hibari", "Souji", "Sinonz"]
var monsterhunt_whitelist = ["arcticbee", "bee", "crab", "minimush", "frog", "squigtoad", "snake", "osnake", "rat", "armadillo", "croc", "squig", "spider", "scorpion", "porcupine", "goo", "poisio", "tortoise", "stoneworm", "cgoo", "jr", "crabx", "iceroamer","greenjr","bat","goldenbat"]; 
load_code ('HealthStatus');
load_code ('Kite');
load_code ('CodeCostMeter');
setInterval(function(){
    self_respawn();
	monsterhunt();
	skillSupershot();
	loot();
//	followLeader(75, -75);
},500); 
//MAIN LOOP

//SUPPLY LOOP 
setInterval(function()
{
    resupply();
},30000); //30 seconds
//SUPPLY LOOP

setInterval(function(){
	//skill3shot();
},245); 


// FOLLOW LEADER
function followLeader(xreal, yreal){
    let leader = get_player(tank_party[1]);
        if (leader && !character.moving){
            move(leader.real_x + xreal, leader.real_y - yreal);
    }
}
// FOLLOW LEADER

//TARGET CHOICE ASSIST OR FARM

function target_function(){
    var target = get_targeted_monster();
    if(gangup_mob.includes(mobs)){
    	assistLeader();
	}else{ 
        farming();
        }
}
//TARGET CHOICE ASSIST OR FARM

//ATTACK CODE END
function farming(){
    var target = get_targeted_monster();
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
            log("Farming " + target.mtype);
            attack(target);
        }
    }
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

//SUPERSHOT
function skillSupershot(){
    var targets = get_targeted_monster();
	if(is_in_range(targets,"supershot")&& !is_on_cooldown("supershot")&& targets.hp >= 900){
    log(targets.name + " Got Supershot");
    use_skill("supershot",targets);
	}	
}
//SUPERSHOT

//3 SHOT
function skill3shot(){
    var targets = mobs;
    if(can_attack(targets)&& !is_on_cooldown("3shot")&& reduce_cooldown("3shot",1000)&& character.mp > 1000 && target.length<3)targets.push(parent.entities[id]);{
        log(" Got THREE shot");
        use_skill("3shot",targets);
        }
    }
//3 SHOT

//MONSTER HUNT
function monsterhunt(){
    if(character.ctype != "merchant"){
        var monster_hunter_location = "monsterhunter";
		if(character.s.monsterhunt){
            if(character.s.monsterhunt.c > 0){             
				var hunt_type = character.s.monsterhunt.id;
                if(monsterhunt_whitelist.includes(hunt_type))
				{
                    mobs = hunt_type;
					target_function();
                } else {
					if(!is_moving(parent.character))
					{
					target_function();
					}
				}
            } else {
					if(!is_moving(parent.character)){
				    smart_move(monster_hunter_location,function(){
                        parent.socket.emit('monsterhunt');
                    });
                }
            }
        } else {
				if(!is_moving(parent.character)){
					smart_move(monster_hunter_location,function(){
                    parent.socket.emit('monsterhunt');
                    setTimeout(function(){
                        parent.socket.emit('monsterhunt');
                    }, character.ping * 3);
                });
            }
        }
    }
}
//MONSTER HUNT 

//DIST
function distance_to_target(target){
    if(target){
        var dist = distance(character,target);
    } else {
        var dist = null;
    }
    return dist;
}
//DIST

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

//RESUPPLY
function resupply()
{
    var gold_threshold = 300000;
    var potion_data = ["hpot1", "mpot1"];
    var keep_items_whitelist = ["tracker", potion_data[0], potion_data[1]];
    if(character.ctype != 'merchant'){
    let merchant = get_player(tank_party[0]);
        if(merchant != null) 
        var to_send = character.gold - gold_threshold;        
        if(character.gold > (gold_threshold * 2)){
            if(!smart.moving)
            {
            smart_move({ map: "main" });
            send_gold(tank_party[0], to_send);
            }
            }
            for(let i in character.items){
            let item = character.items[i];
            if(item){
                if(!keep_items_whitelist.includes(item.name)){
                    var slot = locate_item(item.name);                        
                    send_item(tank_party[0], slot, 9999);                        
                    }
                }
            }
        resup_pots();
    }
}
//RESUPPLY

// POTIONS
function resup_pots()
{
var potion_data = ["hpot1", "mpot1"];
var hpot_amt = quantity(potion_data[0]);
var mpot_amt = quantity(potion_data[1]);
var stack_amt = 1000;
if(character.ctype == "merchant") return;
    if(hpot_amt < 5 || mpot_amt < 5)
            {
            var hpot_buy = stack_amt - hpot_amt;
            var mpot_buy = stack_amt - mpot_amt;
            buy_with_gold(potion_data[0], hpot_buy);
            buy_with_gold(potion_data[1], mpot_buy);
            } else {
                set_message("No Monsters");
                if(!is_moving(parent.character)) {
                    smart_move({ to: mobs });
                }
            }
}
// POTIONS

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