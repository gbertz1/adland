var minGold = 5000000;
var maxGold = 6000000;

var bankItems = {
	//ItemID: {bank: banktabID, level: min level, quantity: min quantity}
	ascale: {bank: "items0", level: -1, quantity: 1},
    bfur: {bank: "items0", level: -1, quantity: 1},
    bwing: {bank: "items0", level: -1, quantity: 1},
    candy0: {bank: "items0", level: -1, quantity: 1},
    candy1: {bank: "items0", level: -1, quantity: 1},
    candycane: {bank: "items0", level: -1, quantity: 1},
    cscale: {bank: "items0", level: -1, quantity: 1},
    dexamulet: {bank: "items3", level: 3, quantity: 1},
    dexbelt: {bank: "items2", level: 3, quantity: 1},
    dstones: {bank: "items0", level: -1, quantity: 1},
    essenceoffrost: {bank: "items0", level: -1, quantity: 1},
    gem0: {bank: "items0", level: -1, quantity: 1},
    gem1: {bank: "items0", level: -1, quantity: 1},
    gemfragment: {bank: "items0", level: -1, quantity: 1},
    intamulet: {bank: "items3", level: 3, quantity: 1},
    intbelt: {bank: "items2", level: 3, quantity: 1},
    leather: {bank: "items0", level: -1, quantity: 1},
    lostearring: {bank: "items2", level: 1, quantity: 1},
    lotusf: {bank: "items0", level: -1, quantity: 1},
    mistletoe: {bank: "items0", level: -1, quantity: 1},
    monstertoken: {bank: "items0", level: -1, quantity: 5},
    ornament: {bank: "items0", level: -1, quantity: 1},
    pleather: {bank: "items0", level: -1, quantity: 1},
    poison: {bank: "items0", level: -1, quantity: 1},
    pvptoken: {bank: "items0", level: -1, quantity: 1},
    rattail: {bank: "items0", level: -1, quantity: 1},
    seashell: {bank: "items0", level: -1, quantity: 1},
    smush: {bank: "items0", level: -1, quantity: 1},
    spidersilk: {bank: "items0", level: -1, quantity: 1},
    spidersilk: {bank: "items0", level: -1, quantity: 1},
    snakefang: {bank: "items0", level: -1, quantity: 1},
    stramulet: {bank: "items3", level: 3, quantity: 1},
    strbelt: {bank: "items2", level: 3, quantity: 1},
};

var lastStore;


function needToBank()
{
	if(character.gold > maxGold)
	{
		return true;
	}
	
	for(id in character.items)
	{
		var item = character.items[id];
			
		if(item != null)
		{
			var storeDef = bankItems[item.name]

			if(storeDef != null && (storeDef.level == -1 || item.level == storeDef.level) && (storeDef.quantity == -1 || item.q > storeDef.quantity))
			{
				return true;
			}
		}
	}
}

function storeGold()
{
	if(character.gold > minGold)
	{
		parent.socket.emit("bank", {
			operation: "deposit",
			amount: character.gold - minGold
		});
	}
}

function storeItems()
{
	if(character.map == "bank")
	{
		for(id in character.items)
		{
			var item = character.items[id];
			
			if(item != null)
			{
				var storeDef = bankItems[item.name]

				if(storeDef != null && (storeDef.level == -1 || item.level == storeDef.level))
				{
					parent.socket.emit("bank", {
										operation: "swap",
										inv: id,
										str: -1,
										pack: storeDef.bank
									});
					break;
				}
			}
		}
	}
}

function tryDepositStuff()
{
	if(character.map == "bank")
	{
		if(lastStore == null || new Date() - lastStore > 750)
		{
			
			storeItems();

			if(character.gold > minGold)
			{
				parent.socket.emit("bank", {
					operation: "deposit",
					amount: character.gold - minGold
				});
			}

			lastStore = new Date();
		}
	}
}

/*
setInterval(function () {
    if(character.ctype == "merchant"){
	if(!needToBank())
	{
		//Normal Farming Stuff, must handle return logic here
	}
	else
	{
		if(!smart.moving)
		{
			smart_move("bank");
		}
			
		tryDepositStuff();
	}
}
}, 250);
*/
async function bankLoop() {
    try {
    if(character.ctype == "merchant"){
	if(!needToBank())
	{
		//Normal Farming Stuff, must handle return logic here
	}
	else
	{
		if(!smart.moving)
		{
			smart_move("bank");
		}
			
		tryDepositStuff();
	}
}
}
catch (e) {
	console.log ("Error Encountered in mainLoop()");
	console.error(e)
	}
setTimeout(async () => { mainLoop() }, 250);
}
