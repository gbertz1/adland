//xGbertsx Code v.1.0\\
//   Merchant Code    \\


//load_code ('upgrade');
load_code ('CodeCostMeter');
load_code ('combine');
load_code ('skills');
load_code ('Bank');
load_code ('HealthStatus');

const tank_party = ["Rentaro", "Hibari", "Souji", "Sinonz"]
const merchant_name = tank_party[0];
const farmer_names = [tank_party[1], tank_party[2], tank_party[3]];
const potion_types = ['hpot1', 'mpot1']; // value is stack amount desired
const stack_amt = 1000;
const merchant_idle = [true, {map: 'main', x: -178, y: -99}];
const sell_whitelist = ["helmet", "shoes", "pants", "gloves", "coat", "xmace", "hpamulet", "hpbelt", "ringsj","stinger", "wattire", "xmace", "wbreeches", "wshoes", "wgloves", "wcap", "snowball", "carrotsword", "slimestaff", "glolipop", "spores", "ololipop", "beewings", "gslime", "whiteegg", "xmasshoes", "xmashat", "mittens", "warmscarf", "xmaspants", "rednose", "xmassweater", "snowflakes", "merry", "crabclaw", "cclaw", "sstinger", "carrot","mushroomstaff","vitscroll"];


//ASYNC FUCNTIONS

//ASYNC FUCNTIONS

setInterval(function(){
    initialize_party();
    fixAddLog();
    master_merchant();
    //move_anywhere();
},250); 

function master_merchant(){
    if(character.name == merchant_name){
        if(character.rip){ 
            respawn();
    } else {
        var potion_seller = get_npc_by_id('fancypots');
        if(character.map == potion_seller.map){ // if we are on the same map as the potion seller
            var distance = distance_to_point(potion_seller.x, potion_seller.y, character.real_x, character.real_y);
            if(distance <= 300){ // if we are close enough to the potion seller
                sell_items(); // refer to function for details
                buy_potions(); // refer to function for details
                }
                if (smart.moving) { return; }
                if(!is_on_cooldown('fishing')) {
                    set_message("Fishin");
                    goFish();
                    returnHome = true;

                }if (!is_on_cooldown('mining')) {
                        set_message("Minin");
                        close_stand();
                        goMine();
                        returnHome = true;
                }else
                if (returnHome)
                open_close_stand(); // this opens and closes our stand depending on if moving or not
                if(merchant_idle[0]){ // check our const for true or false value
                merchant_handle_location_idle(); // control where merchant hangs out in their downtime
                returnHome = false;
                }
            }
        }
    }
}

function move_anywhere(){
    if(smart.moving){
        merchwep()
    }
}

var currentWeapon = character.slots.mainhand;
var MerchWeapSlot = locate_item("fireblade"); // returns slotnum OR -1 if cannot find
function merchwep(){
if (currentWeapon == null || currentWeapon.name != "fireblade" ) {
    //log ("Fishing Rod not equipped");
    if (MerchWeapSlot == -1) {
        //log ("You cant fish without a rod.")
        return;
    }
    else {
        //log("Equipping Fishing Rod");
        equip(MerchWeapSlot);
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

//PARTY LEADER (MERCHANT) INVITES
function initialize_party(){
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




//BUY POTION
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
//BUY POTION

//SELL ITEMS
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
//SELL ITEMS

function distance_to_point(x1, y1, x2, y2){
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

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

//FISH
async function goFish() {
    try {
        //log("goFish()");
        spot = { map: "main", x: -1368, y: -82 };
        currentWeapon = character.slots.mainhand;
        fishingrodSlot = locate_item("rod"); // returns slotnum OR -1 if cannot find
    
    
        if (currentWeapon == null || currentWeapon.name != "rod" ) {
            log ("Fishing Rod not equipped");
            if (fishingrodSlot == -1) {
                log ("You cant fish without a rod.")
                return;
            }
            else {
                log("Equipping Fishing Rod");
                equip(fishingrodSlot);
            }
        }

        if (smart.moving) 
            return;
    
        if (character.x != spot.x && character.y != spot.y) 
        {
            log ("Moving to Fishing Spot")
            await smart_move({map: spot.map, x: spot.x, y: spot.y});
        }
    

        if (character.mp > 120) {
            if (!character.c.fishing) {
                log("Fishin!");
                use_skill('fishing');
            }
        }
    }
    catch (e) {
        console.log ("Error Encountered in goFish()");
        console.error(e)
    }
}
//FISH

//MINE
async function goMine() {
    try {
        spot = { map: 'tunnel', x: 280, y: -95 };
        currentWeapon = character.slots.mainhand.name;
        pickaxeSlot = locate_item("pickaxe"); // returns slotnum OR -1 if cannot find
    
        if (currentWeapon == null || currentWeapon != "pickaxe" || character.slots.mainhand.name == null) {
            log ("Pickaxe not equipped");
            if (pickaxeSlot == -1) {
                log ("You cant mine without a pickaxe.")
                return;
            }
            else
            {
                log("Equipping Pickaxe");
                equip(pickaxeSlot);
            }
        }
    
        if (smart.moving) 
            return;    

        if (character.x != spot.x && character.y != spot.y) {
            log ("Moving to Mining Spot")
            await smart_move({map: spot.map, x: spot.x, y: spot.y});
        }
        
        if (character.mp > 120) {
            if (!character.c.mining) {
                log("Minin!");
                use_skill('mining');
            }
        }
    }
    catch (e) {
        console.log ("Error Encountered in goMine()");
        console.error(e)
    }
}
//MINE


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
