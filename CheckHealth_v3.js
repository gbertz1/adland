//xGbertsx Code v. 1.4
//CHECK HEALTH

setInterval(function() {
    //checkHealthStatus()
	checkHealth()
	regenHealth()
},250); 

//Check Health Status % Start//
var hpLogCounter=0
function checkHealthStatus() {
    if (is_on_cooldown('use_hp') && is_on_cooldown('use_mp') &&
		is_on_cooldown('regen_hp') && is_on_cooldown('regen_mp'))
        current_hp = (character.hp) / character.max_hp;
        current_mp = (character.mp) / character.max_mp;
    if (hpLogCounter == 4)
    {
    log('CHP: %' + (current_hp*100).toFixed(1) + " " + 'CMP: %' + 
		(current_mp*100).toFixed(1));
        hpLogCounter=0;
    }
    else
        hpLogCounter++;
}
//Check Health Status % End\\
//
//Check Health Start
function checkHealth(){
    if(!is_on_cooldown('use_hp') && character.hp / character.max_hp <= .95){
        //log('Used HP Potion');    
        use_skill('use_hp');  
    } else {
        if(!is_on_cooldown('use_mp') && character.mp / character.max_mp <= .95){ 
        //log('Used MP Potion');      
        use_skill('use_mp');           
    }
}
    
} 
//Check Health End\\
//
//Regain Health Start//
function regenHealth(){
    if(!is_on_cooldown('regen_hp') && character.hp / character.max_hp < .99){
        //log('Health regenerated');    
        use_skill('regen_hp');            
    } else {
        if(!is_on_cooldown('regen_mp') && character.mp / character.max_mp < .99){ 
            //log('Mana regenerated');      
            use_skill('regen_mp'); 
        }           
    }
} 
//Regain Health End\\