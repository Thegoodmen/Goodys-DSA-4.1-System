import * as Dice from "./dice.js";
import * as Util from "../Util.js";
import * as Dialog from "./dialog.js";
import Browser from "../module/apps/compBrowser.js"
import { GDSA } from "./config.js";

export async function onSkillRoll(data, type, event) {

    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get Skill Value from the HTML
    
    let statvalue = 0;
    if(type == "normal") statvalue = element.closest("tr").querySelector("[class=skillTemp]").value;
    else if (type == "wonder") statvalue = system.skill.liturgy

    // Get Dataset from HTML

    let dataset = element.closest(".item").dataset;

    // Get BE Value in this Roll

    let beMod = dataset.bemod;
    let be = system.BE;
    if(beMod > 0) be = be * beMod;
    else if (beMod < 0 && (beMod * -1) > be) be + beMod;
    else be = 0;

    // Get Item

    let item = actor.items.get(dataset.itemId);
    
    // Check if Shift is presst for Skip Dialog

    let options = event.shiftKey ? false : true;
    let checkOptions = false;
    let advantage = 0;
    let disadvantage = 0;

    if(options) {

        if(type == "normal") checkOptions = await Dialog.GetSkillCheckOptions();
        else if (type == "wonder") checkOptions = await Dialog.GetWonderOptions();
        else if (type == "spell") checkOptions = await Dialog.GetSpellOptions(item);
            
        advantage = checkOptions.advantage;
        disadvantage = checkOptions.disadvantage;
    }

    if (checkOptions.cancelled) return;

    // Calculate Modifier

    let modif = parseInt(advantage) - parseInt(disadvantage) - be;

    // Execute Roll

    if(type == "normal") Dice.skillCheck(dataset.statname, statvalue, dataset.stat_one, dataset.stat_two, dataset.stat_three, actor, data.goofy, modif);
    else if (type == "wonder") Dice.skillCheck(dataset.statname, statvalue, system.MU.value, system.IN.value, system.CH.value, actor, data.goofy, modif);
    else if (type == "spell") Dice.skillCheck(dataset.statname, statvalue, dataset.stat_one, dataset.stat_two, dataset.stat_three, actor, data.goofy, modif);
}

export async function onSpellRoll(data, event) {

    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get Dataset from HTML

    let dataset = element.closest(".item").dataset;

    // Get Item

    let item = actor.items.get(dataset.itemId);
    
    // Check if Shift is presst for Skip Dialog

    let options = event.shiftKey ? false : true;
    let checkOptions = false;
    let advantage = 0;
    let disadvantage = 0;
    let actions = 0;
    let bonusCost = 0;
    let costMod = 0;
    let doubcast = false;
    let halfcast = 0;
    let variants = [];
    let usedVars = [];
    let usedVar = [];

    if(options) {

        checkOptions = await Dialog.GetSpellOptions(item);
        
        advantage = checkOptions.advantage;
        disadvantage = checkOptions.disadvantage;
        actions = checkOptions.actions;
        bonusCost = checkOptions.bonusCost;
        costMod = checkOptions.costMod;
        doubcast = checkOptions.doubcast;
        halfcast = checkOptions.halfcast;
        variants = checkOptions.variants;
        usedVars = checkOptions.used;
    }

    if (checkOptions.cancelled) return;

    // Calculate Modifier

    if (item.system.rep == "mag") disadvantage = Math.round(disadvantage / 2);
    if (item.system.rep == "mag") if (doubcast) advantage++;
    for (let i = 0; i < item.system.vars.length; i++) if (variants[i]) disadvantage = disadvantage + item.system.vars[i].disad;
        
    let modif = parseInt(advantage) - parseInt(disadvantage);

    // Calculate min. Cost

    let minCost =  parseInt(item.system.costs);
    for (let i = 0; i < item.system.vars.length; i++) if (variants[i]) if (item.system.vars[i].cost > 0) minCost = item.system.vars[i].cost;

    minCost = minCost + parseInt(bonusCost);
    minCost = Math.round((minCost / 10) * (10 - costMod));

    // Calculate Actions

    let action = item.system.zduration;
    for (let i = 0; i < item.system.vars.length; i++) if (variants[i]) if (item.system.vars[i].casttime != null) action = item.system.vars[i].casttime;
    action = action + parseInt(actions);
    if (doubcast) action = action * 2;
    if (halfcast > 0) action = Math.round(action / (2 * halfcast));

    for (let i = 0; i < item.system.vars.length; i++) if (variants[i]) usedVar.push(item.system.vars[i].name);

    // Generate Optional Objekt

    let optional = {
        template: "systems/GDSA/templates/chat/spell-check.hbs",
        item: item,
        cost: minCost,
        action: action,
        usedVar: usedVar,
        usedVars: usedVars
    };

    optional.vari = (usedVar.length > 0);
    optional.varis = (usedVars.length > 0);

    // Execute Roll

    Dice.skillCheck(dataset.statname, item.system.zfw, dataset.stat_one, dataset.stat_two, dataset.stat_three, actor, data.goofy, modif, optional);
}

export function onStatRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get Stat from HTML

    let stat = element.closest(".item").dataset.stattype;
    let statObjekt = system[stat];

    // Get Stat Name

    let statname = game.i18n.localize("GDSA.charactersheet."+stat);

    // Execute Roll
    
    Dice.statCheck(statname, statObjekt.value, statObjekt.temp, actor);
}

export function onNPCRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Stat from HTML

    let dataset = element.closest(".item").dataset;

    // Get Stat Name and Value

    let statname = dataset.name;
    let value = dataset.value;

    // Execute Roll
    
    Dice.statCheck(statname, value, 0, actor);
}

export function onFlawRoll(data, event) {

    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Dataset from HTML

    let dataset = element.closest(".item").dataset;

    // Execute Roll

    Dice.flawCheck(dataset.flawname, dataset.flawvalue, actor);
}

export async function onAttackRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get the Users Combatant

    let attacksLeft = 0;
    let userCombatant;
    if (game.combats.contents.length > 0) {
    let userCombatantId = game.combats.contents[0].combatants._source.filter(function(cbt) {return cbt.actorId == data.actor.id})[0]._id;
    userCombatant = game.combats.contents[0].combatants.get(userCombatantId);
    attacksLeft = userCombatant.getFlag("GDSA", "attacks");}

    // Set Item if its for Raufen or Ringen

    let itemId = element.closest("tr").dataset.itemId;
    let item;
    if (itemId === "raufen") {

        item = {
            type: "melee-weapons",
            system : {

                skill: "brawl",
                type: "fist",
                TPKK: "10/3",
                damage: "1d6",
                "WM-ATK": 0,
                "WM-DEF": 0
            }
        }

    } else if (itemId === "ringen") {

        item = {
            type: "melee-weapons",
            system : {

                skill: "wrestle",
                type: "fist",
                TPKK: "10/3",
                damage: "1d6",
                "WM-ATK": 0,
                "WM-DEF": 0
            }
        }

    } else item = actor.items.get(itemId);

    // Get Weapon

    let skill = item.system.skill;
    let weapon = item.system.type;
    let Spezi = data.generalTraits.filter(function(item) {return item.name.includes(weapon)});
    let isSpezi= (Spezi.length > 0) ? true : false;
    let ATKValue = Util.getSkillATKValue(actor, skill);
    let answer;

    // Get Target of Attack

    let targetId = "";
    let targetCombatantId = "";
    let targetToken = "";
    let targetType = "";
    let sceneId = "";
    let tokenDoc = "";
    let targetActorID = "";

    if( game.users.get(game.userId).targets.ids.length > 0 && game.combats.contents.length > 0) {

        targetId = game.users.get(game.userId).targets.ids[0];
        targetCombatantId = game.combats.contents[0].combatants._source.filter(function(cbt) {return cbt.tokenId == targetId})[0]._id;


        // Get viewed Scene 

        sceneId = game.users.get(game.userId).viewedScene;

        // Get Type of Target

        tokenDoc = game.scenes.get(sceneId).collections.tokens.get(targetId);

        targetToken = (targetId == null) ?  null :  tokenDoc?._actor;
        targetType = tokenDoc?._actor.type;
        targetActorID = tokenDoc?._actor._id;
    };
    let auto = (targetType == "NonPlayer");

    // Calculate TPKK

    let y = 0;

    if(item.system.TPKK != "" && item.system.TPKK != null) {
                
        console.log(item)
        let tpkkString = item.system.TPKK;
        let tp = tpkkString.split("/")[0];
        let kk = tpkkString.split("/")[1];
    
        let x = system.KK.value - tp;
        y = Math.ceil(x / kk);
        y --;
        if(y < 0) y = 0;
    }

    // Generate DMG String
        
    let dmgString = item.system.damage + "+" + y;

    // Generate Chat Cache Object and store ID

    let cacheObject = {

        dmgString: dmgString,
        multi: 1,
        actor: actor.id,
        targetToken: targetId,
        combatant: targetCombatantId
    };

    // Do ATK Rolls

    if(item.type == "melee-weapons") answer = await onMeeleAttack(data, actor, item, ATKValue, isSpezi, auto, cacheObject);
    else answer = await onRangeAttack(actor, ATKValue, isSpezi, item, auto, cacheObject);

    if (game.combats.contents.length > 0) { 
        attacksLeft--;
        userCombatant.setFlag("GDSA", "attacks", attacksLeft)
    }

    // If the Attack was Successfull and Target is present go further

    if(await answer.result != true) return;
    if(targetId == null) return;


    // If Target is a NPC Actor, let him try to Parry
    
    if(targetType == "NonPlayer") {

        let PAValue = targetToken.system.mainPA;

        // Get Combatant
        
        let combatant = game.combats.contents[0].combatants.get(targetCombatantId);
        let parriesLeft = combatant.getFlag("GDSA", "parries");

        // Check if the Target has a Parade left and if so execute Parade

        if(parriesLeft > 0) {

            parriesLeft --;
            combatant.setFlag("GDSA", "parries", parriesLeft);
            
            let answer2 = await Dice.PACheck(PAValue, 0, targetToken);
    
            // If Parry is sucessfull return;

            if(answer2 == true) return;
        }

        // Calculate TPKK

        let y = 0;

        if(item.system.TPKK == "" && item.system.TPKK != null) {
                    
            console.log(item)
            let tpkkString = item.system.TPKK;
            let tp = tpkkString.split("/")[0];
            let kk = tpkkString.split("/")[1];
        
            let x = system.KK.value - tp;
            y = Math.ceil(x / kk);
            y --;
            if(y < 0) y = 0;
        }

        // Do DMG Rolls
        
        let dmgString2 = item.system.damage + "+" + y + "+" + answer.bonusDMG;
        let dmg = await Dice.DMGRoll(dmgString2, actor, answer.multi);

        let newHP = parseInt(targetToken.system.LeP.value) - parseInt(parseInt(dmg) - parseInt(targetToken.system.RS));

        GDSA.socket.executeAsGM("adjustRessource", game.actors.get(targetActorID), newHP, "LeP")
    }
}

async function onMeeleAttack(data, actor, item, ATKValue, isSpezi, auto, cacheObject) {

    let Modi = 0;
    let bDMG = 0;
    let multi = 1;

    // Get WM from Weapon

    let wm = item.system["WM-ATK"];

    // If Spezialistation is present, raise ATK and add WM

    if(isSpezi) ATKValue += 1;
    ATKValue += wm;

    // Create Dialog for ATK Options
    
    let ATKInfo = await Dialog.GetAtkInfo();
    if (ATKInfo.cancelled) return;

    // Check for Special ATK

    let wucht = ATKInfo.wucht;
    let finte = ATKInfo.finte;
    let hammer = ATKInfo.hamme;
    let sturm = ATKInfo.sturm;

    // Check for Shild and Apply Shild WM

    if(data.equiptShield.length > 0) {
        
        let shildwm = data.equiptShield[0].system["WM-ATK"];
        ATKValue += parseInt(shildwm);
    }

    // Add up Modifiers

    Modi += ATKInfo.advan;
    Modi -= ATKInfo.disad;
    Modi -= wucht;
    Modi -= finte;
    if(hammer) Modi -= 8;
    if(sturm) Modi -= 4;

    // Create Result-Objekt

    bDMG = wucht;
    if(sturm) bDMG += 4 + (Math.round(actor.system.GS.value / 2));
    if(hammer) multi = 3;

    // Generate Temp Cache

    cacheObject.dmgString = cacheObject.dmgString + "+" + bDMG;
    cacheObject.multi = multi;
    let chatId = CONFIG.cache.generateNewId();
    GDSA.socket.executeForEveryone("sendToMemory", chatId, cacheObject);

    // Do ATK Roll

    let result = await Dice.ATKCheck(ATKValue, Modi, actor, auto, true, chatId);

    return {
        result: result,
        bonusDMG: bDMG,
        multi: multi 
    }
}

async function onRangeAttack(actor, ATKValue, isSpezi, item, auto, cacheObject) {

    let Modi = 0;
    let bDMG = 0;
    let multi = 1;

    // If Spezialistation is present, raise ATK

    if(isSpezi) ATKValue += 2;

    // Create Dialog for ATK Options

    let ATKInfo = await Dialog.GetRangeAtkInfo();
    if (ATKInfo.cancelled) return;

    // Check for Bonus-DMG, Aimed Rounds and Distance

    let bonus = parseInt(ATKInfo.bonus);
    let aimed = parseInt(ATKInfo.aimed);
    let dista = parseInt(ATKInfo.dista);

    // Limit Aimed Rounds to 4 Advantage
    
    if(aimed > 4) aimed = 4;

    // Add up Modifiers

    Modi -= parseInt(ATKInfo.disad);
    Modi -= bonus;
    Modi += aimed;
    Modi += parseInt(ATKInfo.winds);
    Modi += parseInt(ATKInfo.sight);
    Modi += parseInt(ATKInfo.movem);
    Modi += dista;
    Modi += parseInt(ATKInfo.hidea);
    Modi += parseInt(ATKInfo.sizeX);
            
    // Create Result-Objekt

    bDMG = bonus;
    switch(dista) {
           
        case 2:
            bDMG += parseInt(item.system.tp.split("/")[0]);
            break;
               
        case 0:
            bDMG += parseInt(item.system.tp.split("/")[1]);
            break;
                
        case -4:
            bDMG += parseInt(item.system.tp.split("/")[2]);
            break;
                
        case -8:
            bDMG += parseInt(item.system.tp.split("/")[3]);
            break;
                
        case -12:
            bDMG += parseInt(item.system.tp.split("/")[4]);
            break;                    
    }

    // Generate Temp Cache

    cacheObject.dmgString = cacheObject.dmgString + "+" + bDMG;
    cacheObject.multi = multi;
    let chatId = CONFIG.cache.generateNewId();
    GDSA.socket.executeForEveryone("sendToMemory", chatId, cacheObject);
    
    // Do ATK Roll

    let result = Dice.ATKCheck(ATKValue, Modi, actor, auto, false, chatId);

    return {
        result: result,
        bonusDMG: bDMG,
        multi: multi 
    }
}

export async function onNPCAttackRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Target of Attack

    let targetId = game.users.get(game.userId).targets.ids[0];
    let targetCombatantId = game.combats.contents[0]?.combatants._source.filter(function(cbt) {return cbt.tokenId == targetId})[0]?._id;

    // Get Type of Target

    let targetToken = (targetId == null) ?  null : game.actors.tokens[targetId];
    let targetType = targetToken?.type;
    let auto = (targetType == "NonPlayer");

    // Get Stat Name and Value

    let value = element.closest(".item").dataset.at;
    let dmgString = element.closest(".item").dataset.dmg;

    // Check if in Combat and if ATKs left

    let attacksLeft = 0;
    let attackerparriesLeft = 0;
    let userCombatant;
    let modi = 0;
    if (game.combats.contents.length > 0) {
    let userCombatantId = game.combats.contents[0].combatants._source.filter(function(cbt) {return cbt.actorId == data.actor.id})[0]?._id;
    userCombatant = game.combats.contents[0].combatants.get(userCombatantId);
    attacksLeft = userCombatant.getFlag("GDSA", "attacks");
    attackerparriesLeft = userCombatant.getFlag("GDSA", "parries");}
    if(attacksLeft < 1 && attackerparriesLeft > 0 && game.combats.contents.length > 0) modi = -4;
    if(attacksLeft < 1 && attackerparriesLeft < 1 && game.combats.contents.length > 0) return;

    // Generate Chat Cache Object and store ID

    let cacheObject = {

        dmgString: dmgString,
        multi: 1,
        actor: actor.id,
        targetToken: targetId,
        combatant: targetCombatantId};

    let chatId = CONFIG.cache.generateNewId();
    GDSA.socket.executeForEveryone("sendToMemory", chatId, cacheObject);

    // Execute Roll
    
    let result = await Dice.ATKCheck(value, modi, actor, auto, true, chatId);

    // Remove one Attack from the Possible Attacks this round

    if (game.combats.contents.length > 0) { 
        attacksLeft--;
        attackerparriesLeft --;
        if(attacksLeft >= 0)userCombatant.setFlag("GDSA", "attacks", attacksLeft)
        else userCombatant.setFlag("GDSA", "parries", attackerparriesLeft)
    }

    // If the Attack was Successfull and Target is present go further

    if(result != true) return;
    if(targetId == null) return;

    // If Target is a NPC Actor, let him try to Parry
    
    if(targetType == "NonPlayer") {

        let PAValue = targetToken.system.mainPA;

        // Get Combatant

        let combatant = game.combats.contents[0].combatants.get(targetCombatantId);
        let parriesLeft = combatant.getFlag("GDSA", "parries");

        // Check if the Target has a Parade left and if so execute Parade

        if(parriesLeft > 0) {

            parriesLeft --;
            combatant.setFlag("GDSA", "parries", parriesLeft);

            let answer2 = await Dice.PACheck(PAValue, 0, targetToken);
    
            // If Parry is sucessfull return;

            if(answer2 == true) return;
        }

        // Do DMG Rolls
        
        let dmg = await Dice.DMGRoll(dmgString, actor, 1);

        // Set new HP to Target

        let newHP = parseInt(targetToken.system.LeP.value) - parseInt(parseInt(dmg) - parseInt(targetToken.system.RS));
        
        GDSA.socket.executeAsGM("adjustRessource", targetToken, newHP, "LeP")

        // If HP hits 0 or lower, Toggel defeted and push to Token

        if(newHP > 0) return;

        await combatant.update({defeated: true});
        const token = combatant.token;
        if ( !token ) return;

        // Push the defeated status to the token
    
        const status = CONFIG.statusEffects.find(e => e.id === CONFIG.specialStatusEffects.DEFEATED);
        if ( !status && !token.object ) return;
        const effect = token.actor && status ? status : CONFIG.controlIcons.defeated;
        if ( token.object ) await token.object.toggleEffect(effect, {overlay: true, active: true});
        else await token.toggleActiveEffect(effect, {overlay: true, active: isDefeated});
    }
}

export async function onParryRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get the Users Combatant

    let parriesLeft = 0;
    let userCombatant;
    if (game.combats.contents.length > 0) {
    let userCombatantId = game.combats.contents[0].combatants._source.filter(function(cbt) {return cbt.actorId == data.actor.id})[0]._id;
    userCombatant = game.combats.contents[0].combatants.get(userCombatantId);
    parriesLeft = userCombatant.getFlag("GDSA", "parries");}

    // Set Item if its for Raufen or Ringen

    let itemId = element.closest("tr").dataset.itemId;
    let item;
    if (itemId === "raufen") {
    
        item = {
            type: "melee-weapons",
            system : {
    
                skill: "brawl",
                type: "fist",
                TPKK: "10/3",
                damage: "1d6",
                "WM-ATK": 0,
                "WM-DEF": 0
            }
        }
    
    } else if (itemId === "ringen") {
    
        item = {
            type: "melee-weapons",
            system : {
    
                skill: "wrestle",
                type: "fist",
                TPKK: "10/3",
                damage: "1d6",
                "WM-ATK": 0,
                "WM-DEF": 0
            }
        }
    
    } else item = this.actor.items.get(itemId);

    // Get Weapon

    let skill = item.system.skill;
    let weapon = item.system.type;

    // Calculate PAValue

    let PAValue = Util.getSkillPAValue(actor, skill);
    let wm = item.system["WM-DEF"];
    PAValue += wm;

    // Has Specilazation ?

    let Spezi = data.generalTraits.filter(function(item) {return item.name.includes(weapon)});
    let isSpezi= (Spezi.length > 0) ? true : false;
    if(isSpezi) PAValue += 1;

    // Create Parry Dialog

    let PAInfo = await Dialog.GetSkillCheckOptions();
    if (PAInfo.cancelled) return;

    
    // Calculate Modification

    let Modi = 0;
    Modi -=  parseInt(PAInfo.disadvantage);
    Modi += parseInt(PAInfo.advantage);

    // Do Parry Roll

    Dice.PACheck(PAValue, Modi, actor);

    if (game.combats.contents.length > 0) { 
        if(parriesLeft > 0) parriesLeft--;
        userCombatant.setFlag("GDSA", "parries", parriesLeft)
    }
}

export function onNPCParryRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Stat Value

    let value = element.closest(".item").dataset.pa;

    // Execute Roll
    
    Dice.PACheck(value, 0, actor);
}

export async function onShildRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get the Users Combatant

    let parriesLeft = 0;
    let userCombatant;
    if (game.combats.contents.length > 0) {
    let userCombatantId = game.combats.contents[0].combatants._source.filter(function(cbt) {return cbt.actorId == data.actor.id})[0]._id;
    userCombatant = game.combats.contents[0].combatants.get(userCombatantId);
    parriesLeft = userCombatant.getFlag("GDSA", "parries");}

    // Get Shield    
    
    let itemId = element.closest("tr").dataset.itemId;
    let item = actor.items.get(itemId); 
    let type = item.system.heigt;
    let wm = item.system["WM-DEF"];

    // Calculate Parry Value

    let PABasis = parseInt(system.PABasis.value);
    PABasis += parseInt(wm);
    
    // Do Shield or ParryWeapon Weapon
    
    if(type != game.i18n.localize("GDSA.itemsheet.parryWeapon"))  PABasis = await getShildPABasis(data, PABasis);
    else  PABasis = await getParryWeaponPABasis(data, wm);

    // Generate Parry Dialog

    let PAInfo = await Dialog.GetSkillCheckOptions();
    if (PAInfo.cancelled) return;

    
    // Calculate Modificator

    let Modi = 0;
    Modi -= parseInt(PAInfo.disadvantage);
    Modi += parseInt(PAInfo.advantage);

    // Execute Parry Roll

    Dice.PACheck(PABasis, Modi, actor);

    if (game.combats.contents.length > 0) { 
        if(parriesLeft > 0) parriesLeft--;
        userCombatant.setFlag("GDSA", "parries", parriesLeft)
    }
}

export async function getShildPABasis(data, PABasis) {

    // Add Special Combat Trait Modifiers

    let cbtTraits = data.combatTraits;
    let isLefthand = cbtTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.leftHand")})[0];
    let isShildI = cbtTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.schildI")})[0];
    let isShildII = cbtTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.schildII")})[0];
    if(isLefthand != null) PABasis += 1;
    if(isShildI != null) PABasis += 2;
    if(isShildII != null) PABasis += 2;

    // Check for hightest Parry

    let equiptMelee = data.equiptMelee;
    let higestParry = 0;
    if(!data.actor) data.actor = data;

    for(const itemM of equiptMelee) {

        let skill = itemM.system.skill;
        let weapon = itemM.system.type;
        let itemwm = itemM.system["WM-DEF"];
        let PAValue = Util.getSkillPAValue(data.actor, skill);

        PAValue += itemwm;

        let isSpezi = data.generalTraits.filter(function(item) {return item.name.includes(weapon)});
        if(isSpezi.length > 0) PAValue += 1;
        if(PAValue > higestParry) higestParry = PAValue;
    }

    // Add the Bonus for High Parry
    
    if(higestParry >= 15) PABasis += 1;
    if(higestParry >= 18) PABasis += 1;
    if(higestParry >= 21) PABasis += 1;

    return PABasis;
}

export async function getParryWeaponPABasis(data, wm) {

    // Add Special Combat Trait Modifiers

    let PABasis = 0;
    let cbtTraits = data.combatTraits;
    let isLefthand = cbtTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.leftHand")})[0];
    let isParryI = cbtTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.parryW1")})[0];
    let isParryII = cbtTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.parryW2")})[0];
    if(isLefthand != null) PABasis -= 4;
    if(isParryI != null) PABasis += 3;
    if(isParryII != null) PABasis += 3;
    
    // Check for highst equipt Meele Parry

    let equiptMelee =  data.equiptMelee;
    let higestParry = 0;

    for(const itemM of equiptMelee) {

        let skill = itemM.system.skill;
        let weapon = itemM.system.type;
        let itemwm = itemM.system["WM-DEF"];
        let PAValue = Util.getSkillPAValue(data, skill);

        PAValue += itemwm;

        let isSpezi = data.generalTraits.filter(function(item) {return item.name.includes(weapon)});
        if(isSpezi.length > 0) PAValue += 1;
        if(PAValue > higestParry) higestParry = PAValue;
    }

    // Add Weapon PA and WM to PA Value
    
    PABasis += higestParry;
    PABasis += parseInt(wm);

    return PABasis;
}

export function onDogdeRoll(data, event) {

    event.preventDefault();

    // Get Actor and System
    let actor = data.actor;
    let system = data.system;

    // Get Dogde Value and Name

    let statvalue = system.Dogde;
    let statname = game.i18n.localize("GDSA.charactersheet.dogde");        

    // Execute Dogde Roll

    Dice.statCheck(statname,statvalue, 0, actor);
}

export function onDMGRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Set Item if its for Raufen or Ringen

    let itemId = element.closest("tr").dataset.itemId;
    let item;
    if (itemId === "raufen") {
    
        item = {
            type: "melee-weapons",
            system : {
    
                skill: "brawl",
                type: "fist",
                TPKK: "10/3",
                damage: "1d6",
                "WM-ATK": 0,
                "WM-DEF": 0
            }
        }
    
    } else if (itemId === "ringen") {
    
        item = {
            type: "melee-weapons",
            system : {
    
                skill: "wrestle",
                type: "fist",
                TPKK: "10/3",
                damage: "1d6",
                "WM-ATK": 0,
                "WM-DEF": 0
            }
        }
    
    } else item = this.actor.items.get(itemId);

    // Calculate TP/KK
    let y = 0;

    if(item.system.TPKK != "" && item.system.TPKK != null) {

        let tpkkString = item.system.TPKK;
        let tp = tpkkString.split("/")[0];
        let kk = tpkkString.split("/")[1];

        let x = system.KK.value - tp;
        y = Math.ceil(x / kk);
        y --;

        if(y < 0) y = 0;
    }

    // Create DMG String

    let dmgString = item.system.damage + "+" + y;

    // Generate Chat Cache Object and store ID

    let cacheObject = {

        dmgString: dmgString,
        multi: 1,
        actor: actor.id,
        targetToken: "",
        combatant: ""};

    let chatId = CONFIG.cache.set(cacheObject);

    // Execute DMG Roll

    Dice.DMGRoll(dmgString, actor, 1,chatId);
}

export function onNPCDMGRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Stat Value

    let value = element.closest(".item").dataset.dmg;

    // Execute Roll
    
    Dice.DMGRoll(value, actor, 1);
}

export async function onStatLoss(data, type, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let actor = data.actor;
    let system = data.system;

    // Set Template

    const template = "systems/GDSA/templates/chat/" + type + "Info.hbs";

    // Create Dialog

    let DialogPath = "Get" + type + "LossInfo";
    let lossInfo = await Dialog[DialogPath]();
    if (lossInfo.cancelled) return;
    let lossValue = lossInfo.value;

    // Update Stats

    system[type].value -= parseInt(lossValue);
    actor.setStatData(type, system[type].value);
    actor.render();

    // Send Chat Message

    let templateContext = {
        actor: actor,
        value: lossValue,
        heal: false,
        dmg: true}; 

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: await renderTemplate(template, templateContext)};
    
    ChatMessage.create(chatData);  
}

export async function onStatGain(data, type, event) {

    event.preventDefault();

    // Get Actor and System

    let actor = data.actor;
    let system = data.system;

    // Set Template

    const template = "systems/GDSA/templates/chat/" + type + "Info.hbs";

    // Create Dialog

    let DialogPath = "Get" + type + "Info";
    let gainInfo = await Dialog[DialogPath]();
    if (gainInfo.cancelled) return;
    let gainValue = gainInfo.value;

    // Update Stats

    system[type].value += parseInt(gainValue);
    actor.setStatData(type, system[type].value);
    actor.render();

    // Send Chat Message

    let templateContext = {
        actor: actor,
        value: gainValue,
        heal: true,
        dmg: false}; 

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: await renderTemplate(template, templateContext)};
    
    ChatMessage.create(chatData);  
}

export function onAddStat(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get Stat Type

    let statType = element.closest(".item").dataset.stattype;

    // Check if Stat is already at Max
    
    if (system[statType].value >= system[statType].max) return;

    // Increase Stat by One

    system[statType].value++;

    // Render and Update Actor

    actor.setStatData(statType, system[statType].value);
    actor.render();
}

export function onSubStat(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get Stat Type

    let statType = element.closest(".item").dataset.stattype;

    // Check if Stat is already at Max

    if (statType != "LeP" && system[statType].value == 0) return;

    // Increase Stat by One

    system[statType].value--;

    // Render and Update Actor

    actor.setStatData(statType, system[statType].value);
    actor.render();
}

export function onWoundChange(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get Zone

    let zone = element.closest(".wound").dataset.zone;

    // Get Woundcount

    let wound = (system.wp[zone] != null) ? system.wp[zone] : 0;
    wound ++;
    if(wound > 3) wound = 0;

    // Update WS Stat and Render

    actor.setWound(zone, wound);
    actor.render();
}

export async function onReg(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let actor = data.actor;
    let system = data.system;

    // Do Reg Dialog

    let regDialog = await Dialog.GetRegInfo();
    if (regDialog.cancelled) return;
    
    // Set up Variables

    let regtLeP = 0;
    let regtAsP = 0;
    let HPBonus = parseInt(regDialog.lep);
    let APBonus = parseInt(regDialog.asp);
    let KABonus = parseInt(regDialog.kap);
    let magActive = false;
    let statValueKL = system.KL.value;

    // Check Traits and Mofify Bonus

    let checkFastHeal = data.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.fastHeal")})[0];
    let checkAstralHeal = data.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.astralHeal")})[0];
    let checkBadReg = data.flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.badReg")})[0];
    let checkAstralBlock = data.flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.astralBlock")})[0];
    let checkRegI = data.magicTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.regI")})[0];
    let checkRegII = data.magicTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.regII")})[0];
    let checkRegIII = data.magicTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.regIII")})[0];
    if(checkFastHeal != null) HPBonus += parseInt(checkFastHeal.system.value);
    if(checkBadReg != null) HPBonus -= 1;
    if(checkAstralHeal != null) APBonus += parseInt(checkAstralHeal.system.value);
    if(checkAstralBlock != null) APBonus -= 1;
    if(checkRegI != null) APBonus += 1;
    if(checkRegII != null) APBonus += 1;
    if(checkRegIII != null) APBonus = (statValueKL / 5) + 1;
    if(checkRegIII != null) magActive = true;
    if(system.KaP.max > 0 && system.KaP.max != system.KaP.value) KABonus++; else KABonus = 0; 

    // Do Regeneration

    if(system.LeP.max != system.LeP.value)
        regtLeP = await Dice.doLePReg(actor, HPBonus);
    if(system.AsP.max > 0 && system.AsP.max != system.AsP.value)
        regtAsP = await Dice.doAsPReg(actor, APBonus, magActive);

    // Save new Values

    system.LeP.value += parseInt(regtLeP);
    system.AuP.value = system.AuP.max;
    system.AsP.value += parseInt(regtAsP);
    system.KaP.value += parseInt(KABonus);

    actor.setStatData("LeP", system.LeP.value);
    actor.setStatData("AuP", system.AuP.value);
    actor.setStatData("AsP", system.AsP.value);
    actor.setStatData("KaP", system.KaP.value);
    actor.render();
}

export async function onMed(data, event) {

    event.preventDefault();

    // Get Actor and System

    let actor = data.actor;
    let system = data.system;

    // Generate Dialog
    
    let checkOptions = await Dialog.GetMeditationOptions();
    if (checkOptions.cancelled) return;
    let modi = checkOptions.disadvantage * -1;

    // Do Regeneration

    let regtKaP = await Dice.doKaPReg(actor, modi);

    // Save new Values

    system.KaP.value += parseInt(regtKaP);
    
    actor.setStatData("KaP", system.KaP.value);
    actor.render();
}

export function onATCountToggel(data, event) {

    event.preventDefault();

    // Get Element

    let element = event.currentTarget;
    
    // Get toggeld Counter and Combatant ID

    let toggeldCounter = element.closest(".toggelAT").dataset.count;
    let combatantId = element.closest(".toggelAT").dataset.id;

    // Get ATs left from the Combatant

    let combatant = game.combats.contents[0].combatants.get(combatantId);
    let atLeft = combatant.getFlag("GDSA", "attacks");

    // Set new AT Left Flag for Combatant

    let newATLeft = 0;
    if( toggeldCounter == atLeft) newATLeft = atLeft - 1;
    else newATLeft = toggeldCounter;

    combatant.setFlag("GDSA", "attacks", newATLeft);
}

export function onPACountToggel(data, event) {

    event.preventDefault();

    // Get Element

    let element = event.currentTarget;
    
    // Get toggeld Counter and Combatant ID

    let toggeldCounter = element.closest(".toggelPA").dataset.count;
    let combatantId = element.closest(".toggelPA").dataset.id;

    // Get PAs left from the Combatant

    let combatant = game.combats.contents[0].combatants.get(combatantId);
    let paLeft = combatant.getFlag("GDSA", "parries");

    // Set new AT Left Flag for Combatant

    let newPALeft = 0;
    if( toggeldCounter == paLeft) newPALeft = paLeft - 1;
    else newPALeft = toggeldCounter;

    combatant.setFlag("GDSA", "parries", newPALeft);
}

export async function doOrientation(data, event) {

    event.preventDefault();

    // Get Element

    let element = event.currentTarget;
    
    // Get toggeld Combatant ID

    let combatantId = element.closest(".orient").dataset.id;

    // Get ATs and PAs left from the Combatant

    let combatant = game.combats.contents[0].combatants.get(combatantId);
    let atLeft = combatant.getFlag("GDSA", "attacks");
    let paLeft = combatant.getFlag("GDSA", "parries");

    // Set new AT Left Flag for Combatant

    if (atLeft > 0) atLeft--;
    else if (paLeft > 0) paLeft--
    else return; 

    combatant.setFlag("GDSA", "attacks", atLeft);
    combatant.setFlag("GDSA", "parries", paLeft);

    let newIni = combatant.actor.type == "PlayerCharakter" ? parseInt(combatant.actor.sheet.getData().system.INIBasis.value) : parseInt(combatant.actor.sheet.getData().system.INI.split('+')[1].trim());
    newIni = newIni + 6;
    if (combatant.actor.sheet.getData().system.INIDice == "2d6") newIni = newIni + 6;
    let combat = game.combats.contents[0];
    combat.setInitiative(combatantId, newIni)
}

export async function editeCharFacts(data, event) {

    // Set inital Variabels

    let race = data.system.race;
    let culture = data.system.kulture;
    let profession = data.system.profession;
    let gender = data.system.gender;
    let age = data.system.age;
    let size = data.system.height;
    let weight = data.system.weight;
    let social = data.system.SO;
    let checkOptions = false;

    // Generate Context for the Dialog

    let context = {

        name: data.actor.name,
        race: race,
        culture: culture,
        profession: profession,
        gender: gender,
        age: age,
        size: size,
        weight: weight,
        social: social
    };

    // Create Dialog

    checkOptions = await Dialog.editCharFacts(context);

    if (checkOptions.cancelled) return;

    // Process Dialog and generate Log Entry

    let timestamp = new Date().toLocaleString();

    let logger = {
        userId: game.userId,
        userName: game.users.get(game.userId).name,
        date: timestamp.split(",")[0],
        time: timestamp.split(",")[1].trim(),
        action: "Changed Char Info",
        elementType: "PlayerCharakterSheet",
        elementName: data.actor.name
    };

    data.actor.addLogEntry(logger);
    data.actor.setCharData(checkOptions);
    data.actor.render();
}

export async function editeCharStats(data, event) {

    // Set inital Variabels

    let element = event.currentTarget;
    let dataset = element.closest(".item").dataset;
    let stat = dataset.stattype;
    let statName = game.i18n.localize("GDSA.charactersheet." + stat);
    let oldValue = parseInt(data.system[stat].value);
    let checkOptions = false;

    // Generate Context for the Dialog

    let context = {

        name: data.actor.name,
        sname: statName,
        value: oldValue
    };

    // Create Dialog

    checkOptions = await Dialog.editCharStats(context);

    if (checkOptions.cancelled) return;
    if (parseInt(checkOptions.newvalue) === oldValue) return;

    // Process Dialog and generate Log Entry

    let timestamp = new Date().toLocaleString();

    let logger = {
        userId: game.userId,
        userName: game.users.get(game.userId).name,
        date: timestamp.split(",")[0],
        time: timestamp.split(",")[1].trim(),
        action: "Changed " + statName + " (" + oldValue + " => " + checkOptions.newvalue + ")",
        elementType: "PlayerCharakterSheet",
        elementName: data.actor.name
    };

    data.actor.addLogEntry(logger);
    data.actor.setStatData(stat,checkOptions.newvalue);
    data.actor.render();
}

export async function editeCharRessource(data, event) {

    // Set inital Variabels

    let element = event.currentTarget;
    let dataset = element.closest(".item").dataset;
    let ress = dataset.stattype;
    let ressName = game.i18n.localize("GDSA.charactersheet." + ress);
    let oldModValue = 0;
    let oldBuyValue = 0;
    let checkOptions = false;

    if (ress !== "MR") {
        oldModValue = parseInt(data.system[ress + "Info"].modi);
        oldBuyValue = parseInt(data.system[ress + "Info"].buy);
    } else {
        oldModValue = parseInt(data.system[ress].modi);
        oldBuyValue = parseInt(data.system[ress].buy);
    }

    // Generate Context for the Dialog

    let context = {

        rname: ressName,
        modvalue: oldModValue,
        buyvalue: oldBuyValue
    };

    // Create Dialog

    checkOptions = await Dialog.editCharRess(context);

    if (checkOptions.cancelled) return;
    if (parseInt(checkOptions.newModValue) === oldModValue && parseInt(checkOptions.newBuyValue) === oldBuyValue ) return;

    // Process Dialog and generate Log Entry

    let timestamp = new Date().toLocaleString();

    if (parseInt(checkOptions.newModValue) !== oldModValue) {

        let logger1 = {
            userId: game.userId,
            userName: game.users.get(game.userId).name,
            date: timestamp.split(",")[0],
            time: timestamp.split(",")[1].trim(),
            action: "Changed " + ressName + " Modifikator (" + oldModValue + " => " + checkOptions.newModValue + ")",
            elementType: "PlayerCharakterSheet",
            elementName: data.actor.name
        };

        data.actor.addLogEntry(logger1);
        data.actor.setStatData(ress + "Mod",checkOptions.newModValue);
    }

    if (parseInt(checkOptions.newBuyValue) !== oldBuyValue) {

        let logger2 = {
            userId: game.userId,
            userName: game.users.get(game.userId).name,
            date: timestamp.split(",")[0],
            time: timestamp.split(",")[1].trim(),
            action: "Changed " + ressName + " Buy Modifikator (" + oldBuyValue + " => " + checkOptions.newBuyValue + ")",
            elementType: "PlayerCharakterSheet",
            elementName: data.actor.name
        };

        data.actor.addLogEntry(logger2);
        data.actor.setStatData(ress + "Buy",checkOptions.newBuyValue);
    }

    data.actor.render();
}

export function onItemCreate(data, event) {
    
    event.preventDefault();

    // Get Item Type and Name

    let element = event.currentTarget;
    let itemtype = element.dataset.type;
    let name = "GDSA.charactersheet.new" + itemtype;

    // Generate new Item

    let itemData = {

        name: game.i18n.localize(name),
        type: itemtype
    };

    // Create and return new item

    return data.actor.createEmbeddedDocuments("Item", [itemData]);
}

export function onItemEdit(data, event) {
    
    event.preventDefault();

    // Get Item

    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let item = data.actor.items.get(itemId);

    // Open and Render Item Sheet

    item.sheet.render(true); 
}

export function onItemDelete(data, event) {
    
    event.preventDefault();

    // Get Item

    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let actor = data.actor;

    // Open and Render Item Sheet

    actor.deleteEmbeddedDocuments("Item", [itemId]); 
}

export function onItemEquip(data, event) {

    event.preventDefault();

    // Get Actor and System

    let actor = data.actor;
    let element = event.currentTarget;

    // Get Item

    let itemId = element.closest(".invItem").dataset.itemId;
    let item = actor.items.get(itemId);

    // Update Item Status

    item.system.worn = true;
    item.update({ "data.worn": true });
    actor.render(); 
}

export function onItemRemove(data, event) {

    event.preventDefault();

    // Get Actor and System

    let actor = data.actor;
    let element = event.currentTarget;

    // Get Item

    let itemId = element.closest(".invItem").dataset.itemId;
    let item = actor.items.get(itemId);

    // Update Item Status

    item.system.worn = false;
    item.update({ "data.worn": false });
    actor.render(); 
}

export function onItemOpen(data, event) {

    event.preventDefault();

    // Get Actor and System

    let actor = data.actor;
    let element = event.currentTarget;

    // Get Item

    let itemId = element.closest(".invItem")?.dataset.itemId;
    if(itemId == null) itemId = element.closest(".invItem3").dataset.itemId;
    let item = actor.items.get(itemId);

    // Open and Render Item Sheet

    item.sheet.render(true);
}

export function onItemClose(event) {

    event.preventDefault();

    // Get Actor and System

    let element = event.currentTarget;

    // Get Item

    let itemId = element.closest(".invItem").dataset.itemId;
    let item = game.items.get(itemId);

    // If the Item is part of an Actor it gets more complicated

    if (item == null) item = getItemFromActors(itemId);

    // Close Item Sheet

    item.sheet.close();
}

function getItemFromActors(id) {

    let result = null;

    // For Loop to check all actors in the Foundry Game

    for (let i = 0; i < game.data.actors.length; i++) {

        let actorId = game.data.actors[i]._id;
        let actor = game.actors.get(actorId);
        result = actor.items.get(id);

        // If the Item with the ID is present break the loop and return the result

        if(result != null) return result;
    }

    return result;
}

function getActorFromItem(id) {

    let result = null;

    // For Loop to check all actors in the Foundry Game

    for (let i = 0; i < game.data.actors.length; i++) {

        let actorId = game.data.actors[i]._id;
        let actor = game.actors.get(actorId);
        if(actor.items.get(id) != null) result = actor;

        // If the Item with the ID is present break the loop and return the result

        if(result != null) break;
    }

    return result;
}

export function onHideToggle(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Dataset from HTML

    let dataset = element.closest(".toggleHide").dataset;

    // Toggle Value

    actor.system.generalItemType[dataset.type] = !actor.system.generalItemType[dataset.type] ;
    actor.render();
}

export async function onMoneyChange(data, event) {

    event.preventDefault();

    // Get Actor and System

    let actor = data.actor;
    let money = data.system.money;

    // Create Dialog

    const template = "systems/GDSA/templates/chat/MoneyInfo.hbs";
    let MonyInfo = await Dialog.GetMoneyOptions();
    if (MonyInfo.cancelled) return;

    let gold = parseInt(MonyInfo.gold);
    let silver = parseInt(MonyInfo.silver);
    let copper = parseInt(MonyInfo.copper);
    let nikel = parseInt(MonyInfo.nikel);
    let isAdd = (MonyInfo.operation == "add") ? true : false;

    // Do Operation

    if (isAdd) {
        
        money.gold += gold;
        money.silver += silver;
        money.copper += copper;
        money.nickel += nikel;   

    } else {
        
        money.gold -= gold;
        money.silver -= silver;
        money.copper -= copper;
        money.nickel -= nikel;
    }

    // Update Actor

    actor.update({ "system.money.gold": money.gold });
    actor.update({ "system.money.silver": money.silver });
    actor.update({ "system.money.copper": money.copper });
    actor.update({ "system.money.nickel": money.nickel });
    actor.render();

    // Send Chat Message
        
    let templateContext = {
        actor: actor,
        add: isAdd,
        gold: gold,
        silver: silver,
        copper: copper,
        nikel: nikel
    }; 
    
    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: await renderTemplate(template, templateContext)
    };
        
    ChatMessage.create(chatData);  
}

export function addQuantity(data, event) {
 
    event.preventDefault();

    // Get Item

    let element = event.currentTarget;
    let actor = data.actor;
    let itemId = element.closest(".item").dataset.itemId;
    let item = actor.items.get(itemId);

    // Increase Item Quantity by one
    
    let quant = item.system.quantity++;

    // Update and render the Item in the actor

    item.update({ "data.quantity": quant });    
    actor.sheet.render();
}

export function removeQuantity(data, event) {
 
    event.preventDefault();

    // Get Item

    let element = event.currentTarget;
    let actor = data.actor;
    let itemId = element.closest(".item").dataset.itemId;
    let item = actor.items.get(itemId);

    // Increase Item Quantity by one
    
    let quant = item.system.quantity--;

    // Update and render the Item in the actor

    item.update({ "data.quantity": quant });    
    actor.sheet.render();
}

export function buyItem(data, event) {

    event.preventDefault();

    // Get Item

    let element = event.currentTarget;
    let actor = data.actor;
    let itemId = element.closest(".item").dataset.itemId;
    let itemData = actor.items.get(itemId).system;

    // Get Money that the Buyer has

    let buyerMoney = 0;
    let buyerData = game.actors.get(game.user.data.character).system;
    buyerMoney += parseInt(buyerData.money.nickel);
    buyerMoney += parseInt(buyerData.money.copper) * 10;
    buyerMoney += parseInt(buyerData.money.silver) * 100;
    buyerMoney += parseInt(buyerData.money.gold) * 1000;

    // Get Price and Quantity of the desiert Item in the Merchant adn return if to expensiv or out of Stock

    if(itemData.value > buyerMoney) return;
    if(itemData.quantity == 0) return;

    // Calculate the new Money that the Buyer has

    let newbuyerMoney = parseInt(buyerMoney) - parseInt(itemData.value);
    let NewGold =  Math.trunc(buyerMoney/1000);
    let NewSilver = Math.trunc((parseInt(buyerMoney) - (NewGold *1000)) / 100);
    let NewCopper = Math.trunc((parseInt(buyerMoney) - (NewGold *1000) - (NewSilver *100)) / 10);
    let NewNickel = Math.trunc((parseInt(buyerMoney) - (NewGold *1000) - (NewSilver *100) - (NewCopper *10)));

    // Update the Buyers Money and create the Item in its Inventory

    game.actors.get(game.user.data.character).createEmbeddedDocuments("Item", [itemData]);
    game.actors.get(game.user.data.character).update({ "system.money.gold": NewGold });
    game.actors.get(game.user.data.character).update({ "system.money.silver": NewSilver });
    game.actors.get(game.user.data.character).update({ "system.money.copper": NewCopper });
    game.actors.get(game.user.data.character).update({ "system.money.nickel": NewNickel });

    // Reduce the Quantity in the Merchant by One and Render

    itemData.quantity--;
    actor.items.get(itemId).update({ "system.quantity": itemData.quantity });
    actor.render();
}

export function merchRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get Statname from Button

    let skill = element.closest(".merch-roll").dataset.skill;
    let statname = ""
    if (skill == "uber") statname = game.i18n.localize("GDSA.charactersheet.uberSkill");
    if (skill == "hand") statname = game.i18n.localize("GDSA.charactersheet.handSkill");

    // Get Skill and Attribute Values due to its Skill-Level

    let skillLvl = actor.system.skill;
    let statvalue = getMerchantStats(skillLvl).statvalue;
    let statone = getMerchantStats(skillLvl).statone;
    let stattwo = getMerchantStats(skillLvl).stattwo;
    let statthree = getMerchantStats(skillLvl).statthree;

    // Execute Roll

    Dice.skillCheck(statname, statvalue, statone,  stattwo, statthree, actor, false, 0)
}

export function addSpellVariants(data, event) {

    let id = data.system.vars != null ? data.system.vars.length : 0;

    let newArray = {
        id: id,
        name: "Neue Variante",
        minZfW: 1,
        disad: 0,
        cost: "0",
        casttime: "0",
        resti: []
    };

    if(data.system.vars != null) data.system.vars.push(newArray);
    else data.system.vars = [newArray];

    data.item.render();
}

export async function editSpellVariants(data, event) {
    
    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;

    // Get Dataset from HTML

    let dataset = element.closest(".variantbox").dataset;
    let id = dataset.id;

    // Generate new Array

    let newArray = [];

    for(let spell of data.system.vars) {

        if(spell.id == id) {
        
            // Display Dialog

            let dialog = await Dialog.GetSpellVariantEdit(spell);
            if (dialog.cancelled) return;

            // Set new Values to Item

            spell.name = dialog.name;
            spell.minZfW = dialog.minZfW;
            spell.disad = dialog.disad;
            spell.cost = dialog.cost;
            spell.casttime = dialog.casttime;
            spell.resti = dialog.resti;
        }

        newArray.push(spell);
    }

    // Update Item with new Data

    data.item.update({ "system.vars": newArray });
    data.item.render();
}

export function deleteSpellVariants(data, event) {
    
    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;

    // Get Dataset from HTML

    let dataset = element.closest(".variantbox").dataset;
    let id = dataset.id;

    // Generate new Array

    let newArray = [];

    for(let spell of data.system.vars) 
        if(spell.id != id) newArray.push(spell);
    
    // Update Item with new Data

    data.item.update({ "system.vars": newArray });
    data.item.render();
}

function getMerchantStats(skillLevel) {

    switch(skillLevel) {

        case "1":
            return { statvalue: 5, statone: 11, stattwo: 11, statthree: 11}

        case "2":
            return { statvalue: 7, statone: 12, stattwo: 12, statthree: 12}

        case "3":
            return { statvalue: 12, statone: 14, stattwo: 14, statthree: 14}

        case "4":
            return { statvalue: 14, statone: 15, stattwo: 15, statthree: 15}

        case "5":
            return { statvalue: 16, statone: 16, stattwo: 16, statthree: 16}
    }
}

export function openPDF(type, event) {

    event.preventDefault();

    // Get Element and Set Vars

    let element = event.currentTarget;
    let pageString = "";
    let code = "";    
    let page = "0";

    // Set Default Values

    switch (type) {

        case "Spell":
            pageString = element.closest(".openSpell").dataset.page;
            code = "LCD";
            break;
        
        case "Ritual":
            pageString = element.closest(".openRitual").dataset.page;
            code = "wdz";
            break;

        case "Wonder":
            pageString = element.closest(".openWonder").dataset.page;
            code = "LLT";
            break;
    }

    // Calculate PageString

    if (pageString != "") {
        if (pageString.split(" ").length > 1) {
            code = pageString.split(" ")[0];
            page = pageString.split(" ")[1];
        } else page = pageString;
    }

    // Parse Page to Int

    page = parseInt(page);
    
    // Open PDF Foundry or create Notification / Warning
    
    if (ui.pdfpager) ui.pdfpager.openPDFByCode(code, { page : page } );
    else ui.notifications.warn('pdfpager must be installed to use source links.');
}

export function getItemContextMenu() {
    
    return [{

            name: game.i18n.localize("GDSA.system.edit"),
            icon: '<i class="fas fa-edit" />',
            callback: element => { getItemFromActors(element.data("item-id")).sheet.render(true);}

        },{

            name: game.i18n.localize("GDSA.system.delete"),
            icon: '<i class="fas fa-trash" />',
            callback: element => { getActorFromItem(element.data("item-id")).deleteEmbeddedDocuments("Item", [element.data("item-id")]);}
    }];
}

export function getSpellContextMenu(data, event) {

    let options = event.shiftKey ? false : true;

    if(options) new Browser({},{},"spell", data.actor._id).render(true);
    else onItemCreate(data, event);
}

export async function ownedCharParry(event) {

    event.preventDefault();

    // Get Element from Chat

    let element = event.currentTarget;

    // Get Chat Context from Memory

    let chatId = element.closest(".item").dataset.chatid;
    let chatContext = CONFIG.cache.get(chatId);
    if(jQuery.isEmptyObject(chatContext)) {ui.notifications.warn('Context was not found in Memory. Please reroll the initial Check.'); return};

    // Save Context in Variabels

    let dmgString = chatContext.dmgString;
    let multi = chatContext.multi;
    let actorId = chatContext.actor;
    let targetTokenId = chatContext.targetToken;

    let useractor = game.users.get(game.userId).character;
    
    let actor = (actorId == "") ?  game.users.get(game.userId).character : game.actors.get(actorId);
    let targetToken = (targetTokenId == "") ?  game.users.get(game.userId).character : game.actors.get(game.scenes.current.tokens.get(targetTokenId).actorId);

    // Get Highest PA Value - If you are the owner of the Token with that  - if not with your own actor

    let PAValue = 0;
    let targetOwnership = targetToken.ownership[game.userId];
    if(targetOwnership == 3) PAValue = targetToken.system.mainPA;
    else  PAValue = useractor.system.mainPA;

    if(game.user.isGM) {
        PAValue = targetToken.system.mainPA;
        useractor = targetToken;
    };

    // Get the Users Combatant

    let parriesLeft = 0;
    let userCombatant;
    if (game.combats.contents.length > 0) {
    let userCombatantId = game.combats.contents[0].combatants._source.filter(function(cbt) {return cbt.actorId == useractor.id})[0]._id;
    userCombatant = game.combats.contents[0].combatants.get(userCombatantId);
    parriesLeft = userCombatant.getFlag("GDSA", "parries");}

    // Generate Parry Dialog

    let PAInfo = await Dialog.GetSkillCheckOptions();
    if (PAInfo.cancelled) return;

    // Calculate Modificator

    let Modi = 0;
    Modi -= parseInt(PAInfo.disadvantage);
    Modi += parseInt(PAInfo.advantage);

    // Execute Parry Roll

    let answer2 = await Dice.PACheck(PAValue, Modi, useractor);

    if (game.combats.contents.length > 0) { 
        if(parriesLeft > 0) parriesLeft--;
        userCombatant.setFlag("GDSA", "parries", parriesLeft)
    }
    
    // If Parry is sucessfull return;

    if(answer2 == true) return;

    // Do DMG Rolls
        
    await Dice.DMGRoll(dmgString, actor, multi, chatId);
}

export async function ownedCharDogde(event) {

    event.preventDefault();

    // Get Element from Chat

    let element = event.currentTarget;

    // Get Chat Context from Memory

    let chatId = element.closest(".item").dataset.chatid;
    let chatContext = CONFIG.cache.get(chatId);
    if(jQuery.isEmptyObject(chatContext)) {ui.notifications.warn('Context was not found in Memory. Please reroll the initial Check.'); return};

    // Save Context in Variabels

    let dmgString = chatContext.dmgString;
    let multi = chatContext.multi;
    let actorId = chatContext.actor;
    let targetTokenId = chatContext.targetToken;

    let useractor = game.users.get(game.userId).character;
    
    let actor = (actorId == "") ?  game.users.get(game.userId).character : game.actors.get(actorId);
    let targetToken = (targetTokenId == "") ?  game.users.get(game.userId).character : game.actors.get(game.scenes.current.tokens.get(targetTokenId).actorId);

    // Get Dogde Value

    let PAValue = 0;
    let targetOwnership = targetToken.ownership[game.userId];
    if(targetOwnership == 3) PAValue = targetToken.system.Dogde;
    else  PAValue = useractor.system.Dogde;
    let dogdename = game.i18n.localize("GDSA.charactersheet.dogde");

    if(game.user.isGM) {
        PAValue = targetToken.system.mainPA;
        useractor = targetToken;
    };  

    // Generate Parry Dialog

    let PAInfo = await Dialog.GetSkillCheckOptions();
    if (PAInfo.cancelled) return;

    
    // Calculate Modificator

    let Modi = 0;
    Modi -= parseInt(PAInfo.disadvantage);
    Modi += parseInt(PAInfo.advantage);

    // Execute Parry Roll

    let answer2 = await Dice.statCheck(dogdename, PAValue, Modi, useractor);
    
    // If Parry is sucessfull return;

    if(answer2 == true) return;

    // Do DMG Rolls
        
    await Dice.DMGRoll(dmgString, actor, multi, chatId);
}

export async function executeDMGRoll(event) {
    
    event.preventDefault();

    // Get Element from Chat

    let element = event.currentTarget;

    // Get Chat Context from Memory

    let chatId = element.closest(".item").dataset.chatid;
    let chatContext = CONFIG.cache.get(chatId);

    // Save Context in Variabels

    let dmgString = chatContext.dmgString;
    let multi = chatContext.multi;
    let actorId = chatContext.actor;
    let actor = (actorId == "") ?  null : game.actors.get(actorId);

    // Do DMG Rolls
        
    await Dice.DMGRoll(dmgString, actor, multi, chatId);
    console.log(game);
}

export async function executeHealthLoss(event) {
    
    event.preventDefault();

    // Get Element from Chat

    let element = event.currentTarget;

    // Get Chat Context from Memory

    let chatId = element.closest(".iniBox").dataset.chatid;
    let chatContext = CONFIG.cache.get(chatId);
    if(jQuery.isEmptyObject(chatContext)) {ui.notifications.warn('Context was not found in Memory. Please reroll the initial Check.'); return};

    let targetTokenId = chatContext.targetToken;
    let combatantId = chatContext.combatant;
    let useractor = game.users.get(game.userId).character;
    let userCombatant = game.combats.contents[0].combatants.contents.filter(function(combatant) {return combatant.actorId == useractor._id})[0];

    let targetToken = (targetTokenId == "") ? game.users.get(game.userId).character : game.actors.get(game.scenes.current.tokens.get(targetTokenId).actorId);
    let combatant = (combatantId == "") ? userCombatant : game.combats.contents[0].combatants.get(combatantId);
    let targetOwnership = (targetTokenId == "") ?  0 : targetToken.ownership[game.userId];

    if(targetOwnership != 3) targetToken = useractor;

    // Check if Armour is activated and what Button / Modifier was used

    let isArmoured = element.closest(".iniBox").querySelector("[class=armourCheck]").checked;
    let dmgAmmount = element.closest(".iniBox").dataset.dmgvalue;
    let dmgZone = element.closest(".iniBox").dataset.zone;
    let dmgModifier = element.closest(".item").dataset.dmgmodi;

    // Set new HP to Target

    let rs = 0;
    let ws = 8;

    if(targetToken.type == "PlayerCharakter" && isArmoured && dmgModifier != -1) rs = Util.getZoneArmour(targetToken, dmgZone);
    if(targetToken.type == "NonPlayer" && isArmoured && dmgModifier != -1) rs = targetToken.system.RS;
    if(targetToken.type == "PlayerCharakter") ws = targetToken.sheet.getData().system.WS;
    if(targetToken.type == "NonPlayer") ws = targetToken.system.KO / 2;

    let dmgCalc = Math.round(dmgAmmount * dmgModifier);
    let dmgResult = (dmgCalc <= rs) ? 0 : dmgCalc - rs;
    if(dmgCalc < 0) dmgResult = dmgCalc;
    let newHP = parseInt(targetToken.system.LeP.value) - dmgResult;
    GDSA.socket.executeAsGM("adjustRessource", targetToken, newHP, "LeP")

    // Set Wounds if nessesary

    if (dmgModifier != -1) {

        let wounds = 0
        if (dmgResult > ws) wounds ++;
        if (dmgResult > (ws * 2)) wounds ++;
        if (dmgResult > (ws * 3)) wounds ++;

        if(targetToken.type == "PlayerCharakter") targetToken.setWound(dmgZone, wounds);
    }
 
    // If HP hits 0 or lower, Toggel defeted and push to Token
 
    if(newHP > 0) return;
 
    await combatant.update({defeated: true});
    const token = combatant.token;
    if ( !token ) return;
 
    // Push the defeated status to the token
     
    const status = CONFIG.statusEffects.find(e => e.id === CONFIG.specialStatusEffects.DEFEATED);
    if ( !status && !token.object ) return;
    const effect = token.actor && status ? status : CONFIG.controlIcons.defeated;
    if ( token.object ) await token.object.toggleEffect(effect, {overlay: true, active: true});
    else await token.toggleActiveEffect(effect, {overlay: true, active: isDefeated});
}

export function testFunc(event) {

    event.preventDefault();

    let element = event.currentTarget;

    // Get Actor

    let actorId = element.closest(".item").dataset.actor;
    let actor = game.actors.get(actorId);

    let system = actor.system;

    // Get Stat from HTML

    let stat = element.closest(".item").dataset.stattype;
    let statObjekt = system[stat];

    // Get Stat Name

    let statname = game.i18n.localize("GDSA.charactersheet."+stat);

    // Execute Roll
    
    Dice.statCheck(statname, statObjekt.value, statObjekt.temp, actor);
}