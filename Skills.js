//Works well w/o being in attack
setInterval(function(){
    priest_skills(); // Preist skills
}, 250);

function merchant_skills(){
if(character.ctype == "merchant"){
	merchant_mluck();
	}
}

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

function priest_skills(){
if(character.ctype == "priest"){
	skillPartyH(); //connected to healparty
	healparty();
	skillCurse();
	skillDarkb();
	//skillAbsorb();
	//skillPhase();
	//skillRevive();
	}
}

function ranger_skills(){
if(character.ctype == "ranger"){
	skillSupershot();
	skillHuntersmark();
	skill3shot();
	//skill5shot();
	}
}

function rogue_skills(){
if(character.ctype == "rogue"){
	//skillSmoke();
	//skillMental();
	//skillQstab();
	//skillSwift();
	}
}

function paladin_skills(){
if(character.ctype == "paladin"){
	//skillMshield();
	//skillHeal();
	}
}



//Merchant Luck
var luckBlacklist = ['Put', 'Names', 'Here'];	
function merchant_mluck(){
	//searches everyone nearby
	if (character.level >= 40){
	for(id in parent.entities)
	{
		var current = parent.entities[id];

		//makes sure its a player, not a merchant and not in your blacklist
		if(current && current.type == 'character' && !current.npc && current.ctype != "merchant" && !luckBlacklist.includes(current.name))
		{
			//if they dont already have a boost
			if(!current.s.mluck)
			{
				//if they are in range then boost them
				if(Math.sqrt((character.real_x-current.real_x)*
								 (character.real_x-current.real_x)+
								 (character.real_y-current.real_y)*
								 (character.real_y-current.real_y)) < 320)
				{
					luck(current);
				}
			}
		}
	}	
}
}
var lastluck = new Date(0);
function luck(target){ 
	// Luck only if not on cd (cd is .1sec).
	if((new Date() - lastluck > 100)){
		parent.socket.emit("skill", {name: "mluck", id: target.id});
		log("Lucky " + target.name);
		lastluck = new Date();
	}
	
}
//Merchant Luck

//WARRIOR SKILLS

// Hard Shell
// MP: 480
// LV: 60
// Range: [self use]
// Duration:  8 seconds
// Cooldown:  16 seconds
// Output: [1.5x multiplier dmage] [Pierces_immunity]
// Use: Use everything at your disposal to protect yourself 
//		from physical attacks for a short duration.

function skillHardShell(){
	if (character.level >= 70){
		if(!is_on_cooldown("hardshell") && character.hp / character.max_hp <= .25){ 
		log("HARDSHELL");
		use_skill("hardshell")
		}	
	}
}
// charge
// MP: n/a
// LV: n/a
// Range: [self use]
// Duration:  3.2 seconds
// Cooldown:  40 seconds
// Output: 30 speed
// Use: Gain 30 Speed for a short duration

function skillCharge(){
var manaReserve = 0.8	
if(manaReserve >= (character.mp / character.max_mp)) return // Continue to use skill if above manaReserve
	if(!is_on_cooldown("charge")){ 
		set_message("CHARGE"); // Console statement 
		log("CHARGE");
		use_skill("charge")
	}	
}

// Dash
// MP: 120
// LV: n/a
// Range: 40 pixel coordinates
// Duration:  n/a
// Cooldown:  n/a
// Output: 500 speed
// Use: Push forward, jumping over obstacles, climbing hills, defying physics!",
// Extra:  Using this skill as an escape at low health

let last_dash = 0;
function skillDash(){
if(last_dash == null || new Date() - last_dash >= 10000){
	if(!is_on_cooldown("dash") && character.hp / character.max_hp <= .30){ 
		set_message("DASHED"); // Console statement 
		log("DASHED TO SAFETY");
		use_skill("dash")
		last_dash = new Date();
		}	
	}
}

// War Cry
// MP: 320
// LV: 70
// Range: 600
// Duration: 8 seconds
// Cooldown: 60 seconds
// Output: increase armor,resistance, attack speed, and move speed)
// Use: "Motivate your allies to fight!", 		

function skillWarcry(){
var manaReserve = 0.5;	
if (character.level <= 69) return;
	if(manaReserve >= (character.mp / character.max_mp)) return // Continue to use skill if above manaReserve
		if (!character.s.warcry && !is_on_cooldown("warcry")){
			set_message("WAR CRY"); // Console statement 
			log("Teams Power increased");  // WARCRY used sucessfully and logged
			use_skill("warcry");
	}	
}

// Taunt
// MP: 40
// LV: n/a
// Range: 200
// Duration: n/a
// Cooldown: 3 seconds
// Output: Gets aggro
// Use: "Taunts an enemy. Steals aggro from friendly targets."

function skillTaunt(target){
var manaReserve = 0.7;  // You have 70% use skills
if (smart.moving) return
	if(manaReserve >= (character.mp / character.max_mp)) return // Continue to use skill if above manaReserve
	var target=get_nearest_monster({type: mobs}); // fight nearest monster
		if (target){
		if(is_in_range(target,"taunt")&& !is_on_cooldown("taunt")){
			set_message("TAUNT"); // Console statement 
			log("Taunted " + mobs.name);
			use_skill("taunt",target);
		}
	}
}

// Agitate
// MP: 420
// LV: 68
// Range: 320
// Duration: n/a
// Cooldown: 2.2 seconds
// Output: Aggro all
// Use: "Taunts all nearby monsters.",
var last_agitate;
function skillAgitate(){
var manaReserve = 0.7;  // You have 70% use skills
var target=get_nearest_monster(); // fight nearest monster
if (smart.moving) return
if(manaReserve >= (character.mp / character.max_mp)) return // Continue to use skill if above manaReserve
if(last_agitate == null || new Date() - last_agitate >= 2200){
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

// Cleave
// MP: 720
// LV: 52
// Range: 160
// Duration:  n/a
// Cooldown:  1.2 seconds
// Output: Damage multipile enemies
// Use: Swing your axe in a flurry to damage all enemeies nearby

function skillCleave(target){
var manaReserve = 0.7
var target = get_targeted_monster();
if(smart.moving) return
if(manaReserve >= (character.mp / character.max_mp)) return
	if (target){
		if(is_in_range(target,"cleave")&& !is_on_cooldown("cleave")){
			log(target.name + " was Cleaved!");
			use_skill("cleave",target);
		}	
	}
}
//WARRIOR SKILLS



// RANGER SKILLS

// Supershot
// MP: 400
// LV: n/a
// Range: [range_multiplier 3 * character.range]
// Duration:  n/a
// Cooldown:  30 seconds
// Output: [1.5x multiplier dmage] [Pierces_immunity]
// Use: Deals 1.5X instant damage from an incredible distance.

function skillSupershot(target){
var manaReserve = 0.7
var target = get_targeted_monster();
if(smart.moving) return
if(manaReserve >= (character.mp / character.max_mp)) return
	if (target){
		if(is_in_range(target,"supershot")&& !is_on_cooldown("supershot")){
		log(target.name + " was SUPPASHOT");
		use_skill("supershot",target);
		}	
	}
}

// Huntersmark
// MP: 240
// LV: n/a
// Range: [character.range]
// Duration:  10 seconds
// Cooldown:  10 seconds
// Output: Increase damage done by 10%
// Use: Mark an opponent for death, prevent them from 
//		stealthing away and increase damage done by 10%

function skillHuntersmark(target){
var manaReserve = 0.7
var target = get_targeted_monster();
if(smart.moving) return
if(manaReserve >= (character.mp / character.max_mp)) return
	if (target){
		if(is_in_range(target,"huntersmark")&& !is_on_cooldown("huntersmark")){
			log(target.name + " has a Hunters mark");
			use_skill("huntersmark",target);
		}	
	}
}



// 3-Shot
// MP: 300
// LV: 60
// Range: [character.range]
// Duration:  n/a
// Cooldown:  1x of Attack
// Output: Shoot 3 targets @ 0.7x damage
// Use: Hits 3 targets at once! Deals 0.7x damage to each target.

const skilltarget = ["rat", "crab", "squigtoad", "armadillo", "croc", "squig", "poisio", "tortoise"];
let last_use_3shot = 0;
function skill3shot(){
if(smart.moving) return
	var manaReserve = 0.7			
	var target=getBestTarget(target);
		if(target.type == "character")return;
    	if(manaReserve >= (character.mp / character.max_mp)) return
    	if(last_use_3shot == null || new Date() - last_use_3shot >= 2200){
    		for(id in parent.entities){
			var entity = parent.entities[id];
			skilltarget.push(parent.entities[id]);
        		if(entity.type === "monster" && skilltarget.includes(entity.mtype) && entity.level < 3  && entity.mtype != "tinyP"){
        		if(is_in_range(entity,"3shot")&& !is_on_cooldown("3shot")){
        			use_skill("3shot",target);
        			last_use_3shot = Date.now();
				}
			}
		}
	}
}

function getBestTarget(type = farm_monster) {
// Return the closest monster already targeting me, if there is one
const targetingMe = get_nearest_monster({target: character.id, type: type})
	if(targetingMe) return targetingMe

// Return the closest target of the given type
return get_nearest_monster({type: type})
}

// RANGER SKILLS



// PRIEST SKILLS

// Party Heal
// LV: [Lv 0] [Lv 60] [Lv 72] [Lv 80]
// Range: character.range
// MP: 400
// Duration: n/a
// Cooldown: 0.2 seconds
// Output: [Lv0 = 500] [Lv60 = 600] [Lv72 = 720] [Lv80 = 800]
// Use: Heals all party members based on Output
// partyheal and heal were made to be used together for better heal output

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





/*
	// Heal
	// MP: Depends on character.mp_cost
	// Range: character.range
	// LV: n/a
	// Cooldown: attack cool down = 1000/character.frequency
	// Output: based off Heal(attack) output
	// Use: Heal low health party members
	// partyheal and heal were made to be used together for better heal output

function healparty(){  //Skill Heal Party (note: change tank_party to your party name)
	for(id in parent.entities){
	var current = parent.entities[id];
	if(current && current.type == 'character'){
		if (current.hp / current.max_hp <= 0.9){
			if(can_heal(current)) { // Base HP is < 50% of Max HP
    			set_message("PARTYHEAL"); // Console statement 
				heal(current);  // Heal up Party
				}
			}
		}
	}
}
}
*/

// Curse
// MP: 400
// Range: character.range
// LV: n/a
// Duration: 5 seconds
// Cooldown: 5 seconds
// Output: 	Cursed opponents receive 20% more damage, 
//			deal 20% less damage and they slow down by 20
// Use: Heal low health party members

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



// Absorb
// MP: 200
// LV: 55
// Range: 240
// Duration: n/a
// Cooldown: 0.4 seconds
// Output: Takes aggro
// Use: Pulls all targets(aggro) from a friendly character
	
function skillAbsorb(){ // Regular Heal (note: change tank_party to your party name)
	if (character.level >= 55){
	if(!is_on_cooldown("absorb")) { // Base HP is < 40% of Max HP
		set_message("ABSORB"); // Console statement 
		log("Grab aggro from" );  // ABSORB used sucessfully and logged
		use_skill("absorb", get_player("Hibari")); 
		}
	}
}


// Dark Blessing
// MP: 900
// LV: 70
// Range: 600
// Duration: 8 seconds
// Cooldown: 60 seconds
// Output: 25% damage
// Use: Increases damage by 25% for the duration.

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


//HEALING CODE
party = [{name: "Hibari", priority: 0},
         {name: "Sinonz", priority: 0}];
function healparty(){
    var heal_threshold = 80;
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
        heal(target);
	} else {
		 if (!target)
		 master_farmers();
	        }
        }
}
//HEALING CODE

// PRIEST SKILLS 

