// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!
var attack_mode=false
var sell_whitelist = ["helmet", "shoes", "pants", "gloves", "coat", "xmace", "hpamulet", "hpbelt","ringsj","stinger","wattire","xmace", "wbreeches", "wshoes", "wgloves", "snowball", "carrotsword","xmasshoes","xmashat","mittens","warmscarf","whiteegg","xmaspants","rednose","xmassweater","snowflakes","merry"]
var tank_party = ["Rentaro", "Hibari", "Souji", "Sinonz"]
setInterval(function(){
	sell_items()
	loot();
	// Regen_mp
	if (!is_on_cooldown('regen_mp')&& character.max_mp - character.mp > 10){
	use_skill('regen_mp');	
	}

	// Regen_HP
	if (!is_on_cooldown('regen_hp')&& character.max_hp - character.hp > 10){
	use_skill('regen_hp');	
	}	
	
//	fishing();
	
 	merchant_mluck()
	initialize_party()
},250); 


function fishing(){
	if (!is_on_cooldown('fishing')&& character.mp > 1900){
    use_skill('fishing');
	}
}

var luckBlacklist = ['Put', 'Names', 'Here'];	

function merchant_mluck(){
	//searches everyone nearby
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

//SELL ITEMS
function sell_items(){
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
//SELL ITEMS


var eItem = true; //Enable exchanging of items = true, Disable exchanging of items = false
var whitelist = ["mistletoe", "ornament", "armorbox", "weaponbox", "candycane","gem1"]; //whitelist is for the exchanging of items

setInterval(function() {

  //exchanges items in whitelist
  if (eItem) {
    exchangeItem()
  }

}, 6000 / 4); //Loop every 1/4 seconds.

function exchangeItem() {
  for (let i = 0; i < character.items.length; i++) {
    let c = character.items[i];
    if (c) {
      if (c && whitelist.includes(c.name)) {

        exchange(i)
        parent.e_item = i;
      }
    }
  }
}
