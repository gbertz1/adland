//MAIN LOOP
var mobs = "arcticbee";
var gangup_mob = ["nerfedmummy", "crabx", "boar", "cgoo", "iceroamer"]
var tank_party = ["Rentaro", "Hibari", "Souji", "Sinonz"]
var monsterhunt_whitelist = [mobs[0], "bee", "crab", "minimush", "frog", "squigtoad", "snake", "osnake", "rat", "armadillo", "croc", "squig", "spider", "scorpion"]; 
load_code ('HealthStatus');
load_code ('Kite');
setInterval(function(){
    self_respawn();
	monsterhunt();
	skillSupershot();
//	skill3shot();
	followLeader(75, -75);
	loot();
},250); 
//MAIN LOOP

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
                smart_move(mobs);
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

//SUPERSHOT
function skillSupershot(){
var target = null;
    if (!target){
        target = getTarget(mobs);
	}
	if(is_in_range(target,"supershot")&& !is_on_cooldown("supershot")&& character.mp >= 900){
    log(target.name + " Got Supershot");
    use_skill("supershot",target);
	}	
}
//SUPERSHOT

//3 SHOT
function skill3shot(){
var target = null;
    if (!target){
        target = getTarget(mobs);
	}
	if(is_in_range(target,"3shot")&& !is_on_cooldown("3shot")&& character.mp > 800){
    log(target.name + " Got 3 shot");
    use_skill("3shot",target)
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
                if(monsterhunt_whitelist.includes(hunt_type)){
                    mobs = hunt_type;
					target_function();
                        } else {
                    target_function();
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

