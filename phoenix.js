
var mincrab = {x: -1145, y: -4, map: "main"}; // mincrab
var bigcrab = {x: -965, y: 1588, map: "main"}; // bigcrab
var caveofdarkness = {x: 16, y: -1162, map: "cave"}; // Cave of Darkness
var armadillo = {x: 650, y: 1830, map: "main"}; // armadillo
var spider = {x: 1260, y: -173, map: "main"}; // spider
var spookyForest = {x: 5, y: 436, map: "halloween"}; // Spooky Forest
const phoenix = ["mincrab", "bigcrab", "caveofdarkness", "armadillo", "spider", "spookyForest",]

function phoenix_farming(){
    if(!character.rip){
        mincrab();
        caveofdarkness();
        armadillo();
        spider();
        spookyForest();
    }
}

async function phoenix_farming() {
    try {
      // ...
      var target = (true, phoenix);
      if(target = phoenix){
        farming();
        } else {
            await smart_move({x: -1145, y: -4, map: "main"}); // mincrab
            phoenix_farming2();
        } 
    } 
     catch(e) {
      console.error(e)
    }
    setTimeout(async () => { await phoenix_farming() }, 1000)
  }
  phoenix_farming()
  

  phoenixLocations = [
    { "map":"main", x:-1145, y:-4},// mincrab
    { "map":"main", x: -965, y: 1588},  // bigcrab
    { "map":"cave", x: 16, y: -1162}, // Cave of Darkness
    { "map":"main", x: 650, y: 1830}, // armadillo
    { "map":"main", x: 1260, y: -173}, // spider
    { "map":"halloween", x: 5, y: 436}, // Spooky Forest
    ];

    
await smart_move({x: -1145, y: -4, map: "main"}); // mincrab
  farming();
  await smart_move({x: -965, y: 1588, map: "main"}); // bigcrab
  farming();
  await smart_move({x: 16, y: -1162, map: "cave"}); // Cave of Darkness
  farming();
  await smart_move({x: 650, y: 1830, map: "main"}); // armadillo
  farming();
  await smart_move({x: 1260, y: -173, map: "main"}); // spider
  farming();
  await smart_move({x: 5, y: 436, map: "halloween"}); // Spooky Forest



  /*
  var location = merchant_idle[1]; // check the variable to see how we tell them where to "idle"
  if(character.map != location.map){
      if(!smart.moving){
          smart_move(location);
*/


function mincrab(){
	var target = get_targeted_monster();
    if (!target){
 		target=get_nearest_monster({type: mobs});
        if(!smart.moving){
            smart_move({x: -1145, y: -4, map: "main"}); // mincrab
        }
    }
}

function bigcrab(){
	var target = get_targeted_monster();
    if (!target){
 		target=get_nearest_monster({type: mobs});
        if(!smart.moving){
            smart_move({x: -965, y: 1588, map: "main"}); // bigcrab
        }
    }
}


function caveofdarkness(){
	var target = get_targeted_monster();
    if (!target){
 		target=get_nearest_monster({type: mobs});
        if(!smart.moving){
            smart_move({x: 16, y: -1162, map: "cave"}); // Cave of Darkness
        }
    }
}

function armadillo(){
	var target = get_targeted_monster();
    if (!target){
 		target=get_nearest_monster({type: mobs});
        if(!smart.moving){
            smart_move({x: 650, y: 1830, map: "main"}); // armadillo
        }
    }
}        

function spider(){
	var target = get_targeted_monster();
    if (!target){
 		target=get_nearest_monster({type: mobs});
        if(!smart.moving){
            smart_move({x: 1260, y: -173, map: "main"}); // spider
        }
    }
}   

function  spookyForest(){
	var target = get_targeted_monster();
    if (!target){
 		target=get_nearest_monster({type: mobs});
        if(!smart.moving){
            smart_move({x: 5, y: 436, map: "halloween"}); // Spooky Forest
        }
    }
}   


phoenixLocations = [
    { "map":"main", x:-1145, y:-4},// mincrab
    { "map":"main", x: -965, y: 1588},  // bigcrab
    { "map":"cave", x: 16, y: -1162}, // Cave of Darkness
    { "map":"main", x: 650, y: 1830}, // armadillo
    { "map":"main", x: 1260, y: -173}, // spider
    { "map":"halloween", x: 5, y: 436}, // Spooky Forest
  ];
  
  
curPhoenix = 0;

async function phoenix_farming(phoenix) {
    try { 
	var target=get_nearest_monster({type: mobs});
    if(target){
        log("Target aquired: " + target.type);
        farming(target);
    } else {
        await smart_move({x: phoenixLocations[curPhoenix].x, y: phoenixLocations[curPhoenix].y, map: phoenixLocations[curPhoenix].map}); // mincrab
        }
        if (curPhoenix == 5) {
            curPhoenix = 0;
        } else {
            curPhoenix++
        }
        } 
        
        catch(e) {
        console.error(e)
        }
        setTimeout(async () => { await phoenix_farming() }, 1000)
      }
phoenix_farming()
