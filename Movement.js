//xGbertsx Code v. 1.0 
//FARMING

setInterval(function(){
    loot();
	self_respawn();
    checkHealth();
	movement();    
    followLeader();
    attackmob();	// attack mobs w/o leader
//    assistLeader();	// attack mobs w/o leader
},250); 

//Respawn Start
var last_respawn = null;
function self_respawn(){
	if(character.rip){
		if(last_respawn == null || Date() - last_respawn >= 10000){
		   	respawn();
			last_respawn = new Date();
		}
		return;
	}
}
//Respawn End		


//ATTACK CODE BEGIN
function farming() {
	var target = null;
    if (!target)
    {
        target = getTarget(mobs);
        change_target(target);
    }
        
    // if the target is NOT in range, move closer
    if(!is_in_range(target) && target)
    {
        move(
            character.x+(target.x-character.x)/2,
            character.y+(target.y-character.y)/2
            );
    }
    // or if your in range, attack the target
    else if(can_attack(target) && target.mtype)
    {
        log(target.mtype);
		set_message("Attacking");
        attack(target);
    }
}
//ATTACK CODE END