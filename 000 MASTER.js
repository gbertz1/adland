// this is for zooming in a bit using the steam client (plz add to game through UI in settings).
//const {webFrame} = require('electron'); 
//webFrame.setZoomFactor(1.25);
load_code ('CodeCostMeter');
load_code ('combine');
load_code ('Bank');
load_code ('Kite');
load_code ('skills');
load_code ('HealthStatus');
// variables defined with const behave like let variables, except they cannot be reassigned
const code_name = 'Test'; // code all characters will run at start
const party_names = ['Rentaro', 'Hibari', 'Souji', 'Sinonz']; // keep merchant first
const merchant_idle = [true, {map: 'main', x: -178, y: -99}];
const potion_types = ['hpot1', 'mpot1']; // value is stack amount desired
const stack_amt = 1000;
const farm_mob = ['rat']; // can refactor to handle multiple monsters
const farm_monster = ['minimush']; // can refactor to handle multiple monsters
const sell_whitelist = ["helmet", "shoes", "pants", "gloves", "coat", "xmace", "hpamulet", "hpbelt", "ringsj","stinger", "wattire", "xmace", "wbreeches", "wshoes", "wgloves", "wcap", "snowball", "carrotsword", "slimestaff", "glolipop", "spores", "ololipop", "beewings", "gslime", "whiteegg", "xmasshoes", "xmashat", "mittens", "warmscarf", "xmaspants", "rednose", "xmassweater", "snowflakes", "merry", "crabclaw", "cclaw", "sstinger", "carrot", "mushroomstaff", "vitscroll",];
const exchange_whitelist = ['armorbox', 'weaponbox'];
const merchant_name = party_names[0];
const farmer_names = [party_names[1], party_names[2], party_names[3]];
const keep_whitelist = [potion_types[0], potion_types[1], 'tracker'];
const monster_hunt_whitelist = [farm_monster[0], "bee", "crab", "minimush", "frog", "squigtoad", "snake", "rat", "armadillo", "croc", "squig", "spider", "scorpion", "porcupine", "goo", "poisio", "tortoise", "stoneworm", "cgoo", "jr", "crabx", "greenjr", "bat", "iceroamer"]; // can refactor to include strings & farm_monster array
const restart_on_engage = true

// run all code only once
setTimeout(function(){
    if(character.name == merchant_name){
        if(restart_on_engage){
            start_farmers(); // merchant starts other 3 farmer characters in same window
        }
        
    }
}, 5000);

// run all code on a loop
setInterval(function(){
    master_global(); // any character uses code
    master_merchant(); // only merchant uses code 
    master_farmers(); // any farmer uses code
    master_ranger(); // only Ranger do MH   
    fixAddLog();
}, 250);

// any character regardless of class runs this code
function master_global(){
    loot();
    handle_party(); // refer to function for details
}


// only run by your merchant character (in my case the one also running other characters in the same window)
function master_merchant(){
    if(character.name == merchant_name){
        if(character.rip){ 
            respawn();
    } else {
        open_close_stand(); // this opens and closes our stand depending on if moving or not
        if(merchant_idle[0]){ // check our const for true or false value
            merchant_handle_location_idle(); // control where merchant hangs out in their downtime
        }
        var potion_seller = get_npc_by_id('fancypots');
        if(character.map == potion_seller.map){ // if we are on the same map as the potion seller
            var distance = distance_to_point(potion_seller.x, potion_seller.y, character.real_x, character.real_y);
            if(distance <= 300){ // if we are close enough to the potion seller
                sell_items(); // refer to function for details
                buy_potions(); // refer to function for details
            }
        }
        exchange_items();
        }
    }
}

// all the farmer characters will run this, but never a merchant
function master_farmers(){
if(character.ctype == "warrior" || character.ctype == "priest"){
    if(character.rip){
        respawn();
    } else {   
        accept_party_invite(merchant_name); // will join the merchants party when the merchant sends an invite
        send_items_to_merchant(); // sends loot and gold to merchant when nearby
        farming(); // attempts to complete monster hunt quests and farm tokens
        request_merchant(); // asks the merchant to deliver potions when low or when low inventory space
        followLeader(-10, 10);
        }
    }
}

// Only Ranger will run this, but never a merchant
function master_ranger(){
if(character.ctype == "ranger"){	
    if(character.rip){
        respawn();
    } else {       
        accept_party_invite(merchant_name); // will join the merchants party when the merchant sends an invite
        send_items_to_merchant(); // sends loot and gold to merchant when nearby
        handle_farming(); // attempts to complete monster hunt quests and farm tokens
        request_merchant(); // asks the merchant to deliver potions when low or when low inventory space
        }
    }
}

// we take the x and y coordinates of a point, and compare it to another point
// we can then derive the distance between two points
function distance_to_point(x1, y1, x2, y2){
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// we can type the id in and find the location of an NPC anywhere in the game
function get_npc_by_id(name){
    // look through all the maps in the game
    for(i in parent.G.maps){
        let map = G.maps[i]; // this is a single map in the current loop
        let ref = map.ref; // single ref in the current loop
        // we now loop through all the npcs in this specific ref; remember we are looping all game maps
        // for each game map loop, this loop happens, so this is being checked a lot of times
        // this can be more demanding code, when you nest loops within loops
        for(j in ref){
            let data = ref[j]; // this is all the data (+ location info) for this specific ref, in the ref loop
            let id = data.id; // this is finally the unique npc id we are looking for
            if(id == name){ // if the id is equal to the string we specified, 'name'... 
                // we return the location of the noc we specified
                return data;
            }
        }
    } return null; // if nothing is returned, we return null to let us know the npc we specified doesn't exist
}

// run only by the merchant, who delivers potions to the farmers
function buy_potions(){
var hpot_amt = quantity(potion_types[0]);
var mpot_amt = quantity(potion_types[1]);
var stack = 1000;
// if we have enough gold to purchase, and we need at least one potion
if(hpot_amt < 5 || mpot_amt < 5){
    var hpot_buy = stack - hpot_amt;
    var mpot_buy = stack - mpot_amt;
    buy_with_gold(potion_types[0], hpot_buy);
    buy_with_gold(potion_types[1], mpot_buy);
    }
}


// we need the merchant to have their stand opened in order to best sell items and also farm xp
function open_close_stand(){
    if(character.moving){
        // we close the stand with a socket emit
        parent.socket.emit("merchant", { close: 1 });
    } else {
        // we open the stand, and have to use the 'locate_item(name)' function to locate the slot the stand is in
        parent.socket.emit("merchant", { num: locate_item('stand0') });
    }
}

// this is run only once when the code is first initialized, and only by the merchant
function start_farmers(){
    // loop only through our farmer characters
    for(let i in farmer_names){
        let farmer = farmer_names[i]; // define each farmer
        if(farmer){
            // this will start a cahracter based on where we are in the array loop
            // you can add strings for character and code slot names
            parent.start_character_runner(farmer, code_name);
        }
    }


}

// the function the merchant uses to try and create a party
function create_party(){
    // you add a string of the character name you want to invite
    send_party_invite(farmer_names[0]);
    send_party_invite(farmer_names[1]);
    send_party_invite(farmer_names[2]);
}

// farmers will send farmed items to the merchant
function send_items_to_merchant(){
    var merchant = get_player(merchant_name);
    if(merchant != null){ // is the merchant around?
        var distance = distance_to_point(merchant.real_x, merchant.real_y, character.real_x, character.real_y);
        if(distance <= 300){
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
            send_gold_to_merchant(); // refer to function for details
        }
    }
}

// farmers will send excess gold to the merchant
function send_gold_to_merchant(){
    var retain = retain_gold_amount(); // this function allows us to check how much gold i need to keep for potions
    if(character.gold > retain){ // if we have a lot of gold...
        var send_amt = character.gold - retain;
        if(send_amt >= 300000){ // if we have at least 1,000 gold to send...
            // we send it to the merchant
            parent.socket.emit("send",{name:merchant_name,gold:send_amt});
        }
    }
}
 
// the farmers will try to farm normal monsters if they deem the monsters designated in hunting quests too hard
function farm_normally(){
    // if we don't have a monster hunt quest, don't farm normally, go get a quest
    if(character.s.monsterhunt == undefined){
        return; // stop running the function
    } else {
        // if we do have a quest but the monster to kill is not in our whitelist
        if(monster_hunt_whitelist.includes(character.s.monsterhunt.id)){
            return; // stop running the function
        }
    }
    var target = get_targeted_monster(); // if we have a target, define it
    // this checks to make sure any monster around is in our farm_monster array
    // no target means it's safe to assume another player has not aggro'd it, and we get the rewards on kill
    var desired_monster = get_nearest_monster({type:farm_monster[0], no_target: true});
    if(target){ // if we are targeting something...
        // try and kill it!
        attack_monsters(target); // refer to function for details
    } else { // if we are not targeting anything
        if(desired_monster){ // if there is a monster we want to target and kill
            // we target the desired monster
            change_target(desired_monster);
        } else { // if there's nothing around we want to kill...
            if(!smart.moving){ // if not already smart moving...
                // we will try and go find some monsters to kill
                smart_move(farm_monster[0]);
            }
        }
    }
}

function handle_monster_hunts(){
    var npc = get_npc_by_id('monsterhunter'); // refer to function for details
    var npc_location  = {x: npc.x, y: npc.y, map: npc.map};
    // checks to see if we have a monster hunting quest
    if(character.s.monsterhunt == undefined){ // if we do not have a quest
        // go get a quest from daisy
        if(!smart.moving){
            smart_move(npc_location,function(){ 
                // once we have arrived at daisy, we need to interact with her
                setTimeout(function(){
                    // this acts like the game has clicked on her
                    parent.socket.emit("monsterhunt");
                }, 250); // wait 1/4th second after arriving
                setTimeout(function(){
                    // this then acts like we are clicking on "accept quest", and get assigned one
                    parent.socket.emit("monsterhunt");
                }, 500); // wait 1/4th second after first click               
            });
        }
    } else { // if we DO have a monster hunting quest active...
        var server = character.s.monsterhunt.sn; // example: "US III"
        var monster = character.s.monsterhunt.id; // example "mummy"
        var amount = character.s.monsterhunt.c; // example 5
        //var time = character.s.monsterhunt.ms; // example 1768677 milliseconds
        // we check the name and location of the current server we are on
        var current_server = parent.server_region + ' ' + parent.server_identifier;
        // if we can successfully kill the quest monster
        if(monster_hunt_whitelist.includes(monster)){
            // if the server we are on is the same as the one required in the quest
            if(current_server == server){
                // if we still have monsters left to kill
                if(amount > 0){
                    var target = get_targeted_monster();
                    if(target){
                        attack_monsters(target); // refer to function for details
                    } else {
                        // refer to the 'farm_normally()' custom function
                        var desired_monster = get_nearest_monster({type: monster, no_target: true});
                        if(!desired_monster){
                            if(!smart.moving){
                                smart_move(monster);
                            }
                        } else {
                            change_target(desired_monster);
                        }
                    }
                } else { // if we have killed enough to complete the quest
                    // we can turn in the quest
                    if(!smart.moving){
                        smart_move(npc_location,function(){
                            // once we arrive at daisy, we interact with her to turn in the quest
                            setTimeout(function(){
                                parent.socket.emit("monsterhunt");
                            }, 250); // 1/4th second after arriving
                        });
                    }
                }
            }
        }
    }
}



// this tries to kill monsters that the monsterhunter npc assigns quests for.
// useful for getting a tracker and monster token farming
function handle_farming(){
    if(!character.rip){
    // make sure we have quests at all times, and decide if we can complete them
    handle_monster_hunts();
    // too hard to complete quest, farm normally
    farm_normally(); // refer to function for details
    }
}

// custom function to be used multiple times, speaks for itself (search it to see how it's being used)
function attack_monsters(target){
    // if a target has been defined
    if(target){
        var distance = distance_to_point(target.real_x, target.real_y, character.real_x, character.real_y);
        // if we can attack it
        if(distance <= character.range){
            // if we are not in cooldown
            set_message(target.name);
            if(can_attack(target)){
                ranger_skills(); 
                attack(target);
            }
        } else {
            // if we are not within attack range
            if(!character.moving){ // if not already moving
                move(
                    /*
                        this is sort of like the 'distance_to_point(x1, y1, x2, y2)' function,
                        except this one returns the center between two points, not the distance
                    */
                    character.real_x + (target.real_x - character.real_x) / 2,
                    character.real_y + (target.real_y - character.real_y) / 2
                );
            }
        }
    }
}

// retains a set amount of gold for potions, never gives to the merchant
function retain_gold_amount(){
    var hp_gold = parent.G.items[potion_types[0]].g; // price of single health pot
    var mp_gold = parent.G.items[potion_types[1]].g; // price of single mana pot
    var hp_total = hp_gold * stack_amt; // total gold to purchase our stack amount
    var mp_total = mp_gold * stack_amt; // total gold to purchase our stack amount
    var keep_gold = hp_total + mp_total; // costs of both a stack of health pots and a stack of mana pots
    return keep_gold;
}

// a farmer will 'ping' the merchant with some information, and the merchant will be coded to respond
// this one will ask the merchant to bring potions based on three things...
function request_merchant(){
    // 1) how many health pots we have. 2) how mana mana pots we have. 3) how much inventory space we have
    if(quantity(potion_types[0]) < 100 || quantity(potion_types[1]) < 100 || character.esize < 5){
        // if any of those conditions are met, then we need a visit from the merchant
        // we need to give the merchant some information when we ping them.
        var data = {
            message: 'bring_potions',
            location: {x: character.real_x, y: character.real_y, map: character.map},
            hpot: stack_amt - quantity(potion_types[0]), // how many we need
            mpot: stack_amt - quantity(potion_types[1]), // how many we need
            name: character.name,
        };
        // this pings the merchant by name, and the information is defined as a variable 'data'
        send_cm(merchant_name, data);
    }
}

// this will not be run in an interval, it is fully static
// this is the response logic, based on if someone pings you with information
function on_cm(sender,data){
    if(data.message == "bring_potions"){ // refer to 'request_merchant()' function
        var potion_seller = get_npc_by_id('fancypots');
        var potion_seller_location = {x: potion_seller.x, y:potion_seller.y, map:potion_seller.map};
        // we need to top off our potions at the potion seller
        if(!smart.moving){
            smart_move(potion_seller_location,function(){ 
                // once we arrive at the potion seller
                buy_with_gold(potion_types[0], data.hpot); // buy health pots for the farmer
                buy_with_gold(potion_types[1], data.mpot); // buy mana pots for the farmer
                // move to the farmer
                smart_move(data.location,function(){ 
                    // once we arrive at the farmer, we send them potions they asked for
                    send_item(data.name, locate_item(potion_types[0]), data.hpot);
                    send_item(data.name, locate_item(potion_types[1]), data.mpot);
                });
            });
        }
    }
}

// we loop through the inventory to find an item by name.
function locate_item(name){
    for(let i in character.items){
        let slot = character.items[i];
        if(slot != null){
            let item = slot.name;
            if(item == name){
                return i;
            }
        }
    } 
    return null;   
}

// we sell items by looping through the inventory and checking our custom whitelist
function sell_items(){
    for(let i in character.items){
        let slot = character.items[i];
        if(slot != null){
            let name = slot.name;
            if(sell_whitelist.includes(name)){
                parent.sell(i, 9999);
            }
        }
    }
}

// we tell our merchant where to "hang out" when they aren't doing anything
function merchant_handle_location_idle(){
    var location = merchant_idle[1]; // check the variable to see how we tell them where to "idle"
    if(character.map != location.map){
        if(!smart.moving){
            smart_move(location);
        } 
    } else {
        var distance = distance_to_point(location.x, location.y, character.real_x, character.real_y);
        if(distance >= 10){
            if(!smart.moving){
                smart_move(location);
            }
        }
    }
}

// merchant and farmers run logic allowing them to always build a proper party
function handle_party(){
    if(character.name == merchant_name){
        // we check the amount of characters in our party
        // if we haven't got the three farmers in our party (4 ppl total)
        // then we keep trying to create the party
        // merchant only runs this party of the logic
        if(Object.keys(parent.party).length < party_names.length){
            // loop through our party members array
            for(let i in party_names){
                let player = party_names[i]; // define each memeber in the array
                if(player && player != merchant_name){
                    // if the player is not in a party, or if they are but not ours...
                    if(player.party == undefined || (player.party != undefined && player.party != character.name)){
                        // invite them to our party
                        send_party_invite(player);
                    }
                }
            }
        }
    // only farmers run this party of the logic
    } else if(farmer_names.includes(character.name)){
        // if we are not in any party
        if(character.party == null){
            accept_party_invite(merchant_name); // accept invites from our merchant
        } else {
            // if we are in a party, but it's not the merchant's party...
            if(character.party != merchant_name){
                // leave this party to go to the merchant's party
                leave_party();
            }
        }
    }
}

// we can exchange items based on a whitelist array we create
function exchange_items(){
    // loop through our inventory
    for(let i in character.items){
        let item = character.items[i]; // define an item in each slot
        if(item){ // if slot is not empty
            // if the item name is included in our whitelist
            if(exchange_whitelist.includes(item.name)){
                var npc = get_npc_by_id('exchange');
                // we need to decide if we should move to the exchange npc
                if(character.map != npc.map){
                    var distance = null;
                } else {
                    var distance = distance_to_point(npc.x, npc.y, character.real_x, character.real_y);
                }
                // if the distance to the exchange npc is too far
                if(distance == null || (distance != null && distance >= 300)){
                    if(!smart.moving){
                        // we will move to the exchange npc
                        var location = {x: npc.x, y: npc.y, map: npc.map};
                        smart_move(location);
                    }
                } else { // are we close enough to the exchange npc?
                    // if we are, then do an exchange!
                    exchange(i);
                }
            }
        }
    }
}


//ATTACK CODE END
function farming(){
var target = get_nearest_monster();
if(character.ctype == "merchant") return;
if(character.ctype == "ranger") return;
if(character.rip) return;
if (!target){
    target=get_nearest_monster({type: farm_mob});
        if(target){
            change_target(target);
    } else {
        set_message("No Monsters");
        if(!is_moving(parent.character)) {
            smart_move({ to: farm_mob });
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
        set_message(target.mtype);
        warrior_skills();
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

// Reload code on character
setTimeout(function(){
    reloadCharacters();
}, 60000 * 30);
function reloadCharacter(name){
if (name === character.name){
    say("/pure_eval setTimeout(()=>{parent.start_runner()}, 500)");
    parent.stop_runner();
    } else {
    command_character(name, "say(\"/pure_eval setTimeout(()=>{start_runner()}, 500)\")");
    command_character(name, "say(\"/pure_eval stop_runner();\")");
    }
}
function reloadCharacters(){
for(let i = 0; i < party_names.length; i++){
    let name = party_names[i];
    if (name !== character.name && get_active_characters()[name]){
        reloadCharacter(name);
        }    
    } setTimeout(() =>{reloadCharacter(character.name);}, 1000);
}
// Reload code on character

// FOLLOW LEADER
function followLeader(xreal, yreal){
if(character.ctype !== "priest") return
let leader = get_player(party_names[1]);
    if (leader && !character.moving){
        move(leader.real_x + xreal, leader.real_y - yreal);
    }
}
// FOLLOW LEADER


function fixAddLog()
{
    if (parent.addLogFixed) {
        return;
    }

    const oldAddLog = parent.add_log;
    const regex = /killed|gold/;
    parent.add_log = (message, color) => {
        if (typeof message === 'string' && !message.match(regex)) {
            oldAddLog(message, color);
        }
    };

    parent.addLogFixed = true;
}