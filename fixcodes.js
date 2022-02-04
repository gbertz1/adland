setInterval(function(){
if(character.rip){
    setTimeout(function(){
        respawn();
		},20*1000);
    }
},1000/4);


function request_warrior(){
	var get_player = "Hibari"
    var target = get_nearest_monster({no_target: true, path_check: true, type: phoenix});
    if (target){
			var data = {
				message: 'phoenix_here',
				location: {x: character.real_x, y: character.real_y, map: character.map},
				name: character.name,
			};
        send_cm(get_player, data);
    }
}


function on_cm(sender,data){
if(data.message == "phoenix_here"){ // refer to 'request_merchant()' function
	// we need to top off our potions at the potion seller
	if(!smart.moving){
			smart_move(data.location,function(){ 
				
			});
		}farming(t)
	}
}




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