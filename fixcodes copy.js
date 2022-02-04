function request_warrior(){
    var get_player = "Hibari"
	var monster = "phoenix";
	var desired_monster = get_nearest_monster({type: monster, no_target: true});
		if(desired_monster){
            var data = {
                message: 'phoenix_here',
                location: {x: character.real_x, y: character.real_y, map: character.map},
                name: character.name,
            };
        send_cm(get_player, data);
    }
}
