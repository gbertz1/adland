// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!

var attack_mode=true
var mobs = "arcticbee";
var boss = "phoenix";

setInterval(function(){

	//Loot  
	loot();

	//Heal    
	  if (character.max_hp - character.hp > 1000 ||
	    character.max_mp - character.mp > 500)
		log("used mp/hp potion");
        use_hp_or_mp(); 

	// Regen_mp
	if (!is_on_cooldown('regen_mp')&& character.max_mp - character.mp > 100){
	use_skill('regen_mp');	
	}

	// Regen_HP
	if (!is_on_cooldown('regen_hp')&& character.max_hp - character.hp > 100){
	use_skill('regen_hp');	
	}



//ATTACK CODE BEGIN
    if(!attack_mode || character.rip || is_moving(character)) return;

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
    else if(can_attack(target))
    {
        set_message("Attacking");
        attack(target);
    }
//ATTACK CODE END

//SKILL CODE BEGIN
if(is_in_range(target,"partyheal") && !is_on_cooldown("partyheal") && character.mp > 2000 && tarOftar){
	use_skill("pheal",target);
}

if(is_in_range(target,"curse") && !is_on_cooldown("curse") && character.mp > 1800 && tarOftar){
    log("Cursed " + target.name);
    use_skill("curse",target);
}	

},250); 
// SKILL CODE END

//BOSS CODES
function getNearestBoss(args)
{
    var target=null;
    
    for (i in parent.entities)
    {
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

function getTarget(m)
{
    var target;
    if (!target)
        target = getNearestBoss({ mtype: "phoenix" });
    if (!target)
        target = getNearestBoss({ mtype: "grinch" });
    if (!target)
        target = getNearestBoss({ mtype: "goldenbat" });
    if (!target)
        target = get_nearest_monster({type:m});
    
    return target;
}

//MERCHANT AND PARTY INVITES
setInterval(function() {
function PartyInvite(friends) {
    var count = 0;
    for ( var friend of friends ) {
        var ftarget = get_player(friend);
        if ( !ftarget ) continue;
        console.log("Inviting "+friend);
        setTimeout(function(){Invite(ftarget);}, ++count * 150);
    }
}
function Invite(ftarget) {
    parent.socket.emit('party',{event:'invite',id:ftarget.id});
}
	// Invite friends
	var friends = ['Sinonz','Hirbari'];
	PartyInvite(friends);

	//Merchant 	
	send_gold("Rentaro",character.gold);	

}, 300000); // 5mins
//MERCHANT AND INVITE END


let last_pheal = 0;
function skillPartyH(){  //Skill Heal Party
if(last_pheal == null || new Date() - last_pheal >= 5000){
    if(can_heal("partyheal")) { // Base HP is < 50% of Max HP
        set_message("PARTYHEAL"); // Console statement 
        use_skill("partyheal");  // Heal up Party
        last_pheal = new Date();
        }
    }
}
