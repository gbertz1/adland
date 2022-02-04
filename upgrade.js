// Only items in the whitelists will be upgraded, items not in the list or above the required level are ignored.
//Courtesy of: Mark
var attack_mode=true
var en = true; //Enable Upgrading of items = true, Disable Upgrading of items = false
var emaxlevel = 7; //Max level it will stop upgrading items at if enabled
var whitelist = ['blade','shoes','helmet','cclaw','wcap','quiver','coat','claw','stinger','merry','candycanesword','wattire','wgloves','wshoes','wbreeches','pants1','gloves1','helmet1','coat1','shoes1','cape','gcape','harmor','hgloves','hpants','hhelmet','hboots','pmace','ornamentstaff']; //Add items that you want to be upgraded as they come to your inventory [always add ' ' around item and , after item]
// Upgrading [enhancing] [will only upgrade items that are in your inventory & in the whitelist] //

setInterval(function(){
	if(!is_on_cooldown('use_mp') && character.mp / character.max_mp <= .80){ 
        log('Some mana restored');      
        use_skill('use_mp');   
	}
	// Regen_mp
	if (!is_on_cooldown('regen_mp')&& character.max_mp - character.mp > 100){
	use_skill('regen_mp');	
	}
},250); // Loops every 1/4 seconds.

function massp(){
	if (!character.s.massproductionpp){	
	if (!is_on_cooldown("massproductionpp"))
                    use_skill("massproductionpp");
	}
}
setInterval(function() {

  if (en) {
    upgrade(emaxlevel);
  }

}, 1000 / 4); // Loops every 1/4 seconds.

function upgrade(level) {
  for (let i = 0; i < character.items.length; i++) {
    let c = character.items[i];
    if (c && whitelist.includes(c.name) && c.level < level) {
      let grades = get_grade(c);
      let scrollname;
      if (c.level < grades[0])
        scrollname = 'scroll0';
      else if (c.level < grades[1])
        scrollname = 'scroll1';
      else
        scrollname = 'scroll2';
		massp();
      let [scroll_slot, scroll] = find_item(i => i.name == scrollname);
      if (!scroll) {
        parent.buy(scrollname);
        return;
      }

      parent.socket.emit('upgrade', {
        item_num: i,
        scroll_num: scroll_slot,
        offering_num: null,
        clevel: c.level
      });
      return;
    }
  }
}

function get_grade(item) {
  return parent.G.items[item.name].grades;
}

// Returns the item slot and the item given the slot to start from and a filter.
function find_item(filter) {
  for (let i = 0; i < character.items.length; i++) {
    let item = character.items[i];

    if (item && filter(item))
      return [i, character.items[i]];
  }

  return [-1, null];
}

