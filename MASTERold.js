//xGbertsx Code v.1.1\\
//    MASTER CODE     \\

//DATA VALIDATION
var farm_mob = ["arcticbee"];
var tank_party = ["Rentaro", "Hibari", "Souji", "Sinonz"];
var gangup_mob = ["nerfedmummy", "crabx", "boar", "cgoo", "iceroamer"];
var sell_whitelist = ["helmet", "shoes", "pants", "gloves", "coat", "xmace", "hpamulet", "hpbelt", "ringsj","stinger", "wattire", "xmace", "wbreeches", "wshoes", "wgloves", "wcap", "snowball", "carrotsword", "slimestaff", "glolipop", "spores", "beewings", "gslime", "whiteegg", "xmasshoes", "xmashat", "mittens", "warmscarf", "xmaspants", "rednose", "xmassweater", "snowflakes", "merry"];
load_code ('HealthStatus');
load_code ('CodeCostMeter');
load_code ('combine');
/*load_code ('Dmeter');*/
//DATA VALIDATION

//LOAD TANK PARTY
var tank_party = ["Rentaro", "Hibari", "Souji", /*"Sinonz"*/];
if(character.ctype == "merchant"){
    start_character(tank_party[1], "Master");
    start_character(tank_party[2], "Master");
    //start_character(tank_party[3], "HunterQuest");  //HunterQuest or Ranger or Master
}
//LOAD TANK PARTY

//CODE LOAD (NEED TO FIGURE OUT HOW TO LOAD)
load_code ('Kite');
//load_code ('Skills');
//CODE LOAD (NEED TO FIGURE OUT HOW TO LOAD)

//MAIN LOOP FUNCTIONS
setInterval(function()
{
    target_function();
    healparty();
    skillCurse();
    skillHardShell();
    loot();
    self_respawn();
    initialize_party();
//    followLeader(-75, 75);
},250); 
//MAIN LOOP FUNCTIONS

//SUPPLY LOOP 
setInterval(function()
{
    sell_items();
    resupply();
},30000); //30 seconds
//SUPPLY LOOP

//PARTY LEADER (MERCHANT) INVITES
function initialize_party()
{
    if(character.name == tank_party[0]){ //should send invites
    if(Object.keys(parent.party).length < tank_party.length){
        for(let i in tank_party){
            let player = tank_party[i];
            if(player != tank_party[0]){//send invite
                send_party_invite(player);
                }
            }
        }
    }
}
//PARTY LEADER (MERCHANT) INVITES
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

//TARGET CHOICE ASSIST OR FARM
function target_function()
{
    var target = get_targeted_monster();
    if(gangup_mob.includes(farm_mob)){
        assistLeader();
    } else { 
        farming();
        }
}
//TARGET CHOICE ASSIST OR FARM

// FOLLOW LEADER
function followLeader(xreal, yreal)
{
    if(character.ctype == "merchant") return;
    if(character.ctype == "warrior") return;
    let leader = get_player(tank_party[1]);
        if (leader && !character.moving){
            move(leader.real_x + xreal, leader.real_y - yreal);
        }
}
// FOLLOW LEADER

//ATTACK CODE END
function farming()
{
    var target = get_targeted_monster();
    if(character.ctype == "merchant") return;
    if (!target){
         target=get_nearest_monster({no_target: true, path_check: true, type: farm_mob});
        if(target){
            change_target(target);
        } 
    } else {
        if(distance_to_target(target) > character.range){
            if(!is_moving(parent.character)) {
            var half_x = character.real_x + (target.real_x - character.real_x) / 2;
            var half_y = character.real_y + (target.real_y - character.real_y) / 2;
            move(half_x, half_y);
            }
        } else if (can_attack(target)){
			set_message("FARMING");
            log("Farming " + target.mtype);
            attack(target);
        }
    }
}
function distance_to_target(target)
{
    if(target){
    var dist = distance(character,target);
    } else {
        var dist = null;
    }
    return dist;
}
//ATTACK CODE END

//FIGHT BOSSES BEGIN
function getNearestBoss(args)
{
    var target=null;
    if(character.ctype == "merchant") return;
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
        target = getNearestBoss({ mtype: "snowman" });
    if (!target)
        target = get_nearest_monster({type:m});
    return target;
}
//FIGHT BOSSES END

// ASSIST LEADER CODE BEGIN
function assistLeader()
{
    let leader = get_player(tank_party[1]);//Party leader
    let currentTarget = get_target();//Current target and target of leader.
    let leaderTarget = get_target_of(leader);
    let targetTarget = get_target_of(currentTarget);
    if(character.ctype == "merchant") return;
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

function self_respawn()
{
    var last_respawn = null;
    if(character.rip){
        if(last_respawn == null || new Date() - last_respawn >= 10000){
				set_message("DED");
               respawn();
            last_respawn = new Date();
        } else {
            if(!smart.moving){
                smart_move({ to: farm_mob[0] });
            }
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
			set_message("RESUPPLY");	
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
function resup_pots(){
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
            }
}
// POTIONS

//SELL ITEMS
function sell_items(){
if(character.ctype == "merchant"){
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
}
//SELL ITEMS

//HEALING CODE
party = [{name: "Hibari", priority: 0},
         {name: "Sinonz", priority: 0}];
function healparty(){
    var heal_threshold = 90;
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
        log("HEALING HEALING " + party[highest].name);
        heal(target);
	} else {
		 if (!target)
		    target_function();
	        }
        }
}
//HEALING CODE

//Merchant Luck
var luckBlacklist = ['Put', 'Names', 'Here'];	
function merchant_mluck(){
//searches everyone nearby
if(character.ctype == "merchant")
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

//skillCurse
function skillCurse(){
    var target = null;
    if(character.ctype == "priest"){
        if (!target){
            target = getTarget(farm_mob);
        }
        if(is_in_range(target,"curse")&& !is_on_cooldown("curse") && character.mp / character.max_mp >= .95){
        log("Cursed " + target.name);
        use_skill("curse",target);
        }	
    }
}
//skillCurse

//HardShell
function skillHardShell(){
    var target = null;
    if(character.ctype == "priest"){
        if (!target){
            target = getTarget(farm_mob);
        }
        if(is_in_range(target,"hardshell")&& !is_on_cooldown("hardshell") && character.hp / character.max_hp <= .50){
        log("HARDSHELL");
        use_skill("hardshell",target)
        }	
    }
}
//HardShell