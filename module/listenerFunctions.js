import * as Dice from "./dice.js";
import * as Util from "../Util.js";
import * as Dialog from "./dialog.js";
import Browser from "../module/apps/compBrowser.js"
import { GDSA } from "./config.js";
import {getTalent, templateData} from "../module/apps/templates.js";
import GDSAItem from "./objects/GDSAItem.js";

export async function onSkillRoll(data, event) {

    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Skill Value and Skill Name from the HTML
    
    let htmlElement = element.closest("tr").querySelector("[class=skillTemp]");
    let statname = htmlElement.dataset.stat;

    // Create Objekt for SkillRoll

    let rollEvent = {
        name: htmlElement.dataset.lbl,
        item: await getTalent(statname),
        actor: actor,
        stat: htmlElement.value,
        skipMenu: !event.shiftKey,
        data: data,
        event: event
    }

    doSkillRoll(rollEvent);
}

export async function doSkillRoll(rollEvent) {

    // Set System and statvalue

    let system = rollEvent.actor.system;
    let statvalue =  parseInt(rollEvent.stat);
    let showname = rollEvent.name;

    // Get Skill Template from Templates

    let skillTemplate = rollEvent.item;
    let skillInfo = skillTemplate.system.tale;

    // Set Stats for Skill Roll

    let statOne = ( system[skillInfo.att1.toUpperCase()].value + system[skillInfo.att1.toUpperCase()].temp );
    let statTwo = ( system[skillInfo.att2.toUpperCase()].value + system[skillInfo.att2.toUpperCase()].temp );
    let statThree = ( system[skillInfo.att3.toUpperCase()].value + system[skillInfo.att3.toUpperCase()].temp );

    // Check if Talentschub is present

    let talentS = rollEvent.actor.system.skill["Talentschub" + rollEvent.item.name];
    let isTalentS = (talentS > 0);

    skillTemplate.isTalentS = isTalentS;

    // Get BE Value / BE Disadvantage in this Roll

    let beDisadvantage = 0;

    if (skillInfo.BECheck) {

        let be = system.gBEArmour;
        let beValue = skillInfo.BE;
        let beType = skillInfo.BEtype;

        if (beType === "x") beDisadvantage = be * beValue;
        if (beType === "-" && be > beValue) beDisadvantage = be - beValue;
        if (beDisadvantage < 0) beDisadvantage = 0;
    }

    // Check if Shift is presst for Skip Dialog

    let checkOptions = false;
    let advantage = 0;
    let disadvantage = 0;
    let useBe = true;
    let usedMHK = 0;
    let used = [];
    let talS = false;
    let talAdv = 0;
    let mirakel = false;
    let isMirakel = false;
    let mirBonus = 0;

    let actor = await rollEvent.actor.sheet.getData();
    skillTemplate.isMHK = actor.system.mhkList.filter(function(item) {return item.talentname.includes(rollEvent.item.name)}).length > 0;
    skillTemplate.MHKMx = Math.round( statvalue / 2 );
    skillTemplate.beDis = beDisadvantage;
    skillTemplate.klerikal = system.klerikal;
    if(skillInfo.type === "lang" || skillInfo.type === "sign" || skillInfo.type === "none") skillTemplate.klerikal = false;

    if(rollEvent.skipMenu) {

        checkOptions = await Dialog.GetSkillCheckOptions(skillTemplate);
            
        advantage = checkOptions.advantage;
        disadvantage = checkOptions.disadvantage;
        useBe = checkOptions.be;
        usedMHK = checkOptions.mhk;
        used = checkOptions.used;
        talS = checkOptions.talS;
        talAdv = parseInt(checkOptions.taladvantage - checkOptions.taldisadvantage);
        mirakel = checkOptions.mirakel;

    }

    if (checkOptions.cancelled) return;

    // Calculate Modifier

    let modif = parseInt(advantage) - parseInt(disadvantage);
    if(useBe) modif = modif - parseInt(beDisadvantage);

    // Check if Talentschub should be rolled

    if (talS) {

        let talSName = "Talentschub: " + rollEvent.item.name;
        let talSone = ( system.MU.value + system.MU.temp );
        let talStwo = ( system.IN.value + system.IN.temp );
        let talSthree = ( system.KO.value + system.KO.temp );

        let talSitem = {system: { tale: {}}};
        talSitem.system.tale.BECheck = false;
        talSitem.system.tale.type = "gift";
        talSitem.img = "icons/magic/symbols/symbol-lightning-bolt.webp";

        let optional1 = {
            template: "systems/GDSA/templates/chat/chatTemplate/skill-Roll.hbs",
            item: talSitem,
            att1: "MU",
            att2: "IN",
            att3: "KO",
            noChat: false,
            used: [],
            mhk: false,
            asp: 0
        };

        let response1 = await Dice.skillCheck(talSName, talentS, talSone, talStwo, talSthree, actor, actor.goofy, talAdv, optional1);
        response1.message.setFlag('gdsa', 'isCollapsable', true);

        if (response1.succ) 
            if (response1.value === 0) modif += 1;
            else modif += response1.value
        else modif -= 3;
    }

    // Check if Mirakel should be rolled

    if (mirakel) {

        let mirakelResponse = await onMirikalRoll(rollEvent.data, rollEvent.event, rollEvent.item.name)

        console.log(mirakelResponse);

        if (mirakelResponse.succ) {

            if (mirakelResponse.value === 0) mirBonus = 6;
            else mirBonus = Math.round((mirakelResponse.value / 2) + 5);
            statvalue += mirBonus;
            isMirakel = true;
        }
    }

    // Add MHK Bonus

    if((usedMHK * 2) > statvalue) usedMHK = (statvalue / 2);
    statvalue += (usedMHK * 2);
    let mhk = usedMHK > 0;
    if(mhk) { used.push(game.i18n.localize("GDSA.chat.skill.mhk") + " (" + usedMHK  + " " + game.i18n.localize("GDSA.itemsheet.asp") + ")")};
    if(isMirakel) { used.push(game.i18n.localize("GDSA.chat.skill.mirakel") + " (- "+ mirBonus + ")")};
    
    // Prepare Optional Roll Data

    let optional = {
        template: "systems/GDSA/templates/chat/chatTemplate/skill-Roll.hbs",
        item: skillTemplate,
        att1: skillInfo.att1.toUpperCase(),
        att2: skillInfo.att2.toUpperCase(),
        att3: skillInfo.att3.toUpperCase(),
        noChat: false,
        used: used,
        mhk: mhk,
        lit: mirakel,
        asp: usedMHK
    };

    // Execute Roll

    let response = await Dice.skillCheck(showname, statvalue, statOne, statTwo, statThree, actor, actor.goofy, modif, optional);
    response.message.setFlag('gdsa', 'isCollapsable', true);
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
    
    // Check Magic Traits

    let powerC = data.magicTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.powerC"))});
    let matrixK = data.magicTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.matrixK"))});
    let animag = data.flaws.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.animag"))});
    let schaus = data.flaws.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.schaus"))});
    let zoezau = data.flaws.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.zoezau"))});
    let powerF = data.objRituals.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.powerfokus"))});
    let searchFing = data.objRituals.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.searchFing"))});
    
    // Check if Shift is presst for Skip Dialog

    let options = event.shiftKey ? false : true;
    let checkOptions = false;
    let checkOptions2 = false;
    let advantage = 0;
    let disadvantage = 0;
    let actions = 0;
    let bonusCost = 0;
    let costMod = 0;
    let doubcast = false;
    let halfcast = 0;
    let achadv = 0;
    let achact = 0;
    let spellValue = 0;
    let spellName = "";
    let variants = [];
    let usedVars = [];
    let usedVar = [];
    let oldAtt3 = null;
    let optAnswer = null;
    let notEnoughAsP = false;
    let noChat = false;
    let usePowerC = false;

    // Preap General

    if(item.system.rep === "none") ui.notifications.warn('Bitte eine Repräsentation im Zauber auswählen!')

    item.hasRep = data.system.Reps[item.system.rep];
    item.hasPowerC = (powerC.length !== 0);

    if (item.system.rep === "dru") item.system.forced = true;
    if (matrixK.length !== 0) item.hasRep = true;

    // Generate Dialog for Modifikations

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
        usePowerC = checkOptions.powerC;
    };

    if (checkOptions.cancelled) return;

    // Set ZfW of Spell

    spellValue = item.system.zfw;
    spellName = dataset.statname;

    let spez = data.system.SpellSpez.filter(function(item) {return item.spellname === spellName});
    let isSpez = false;

    for (let i = 0; i < spez.length; i++) {
        
        let value = spez[i].spezi;

        let modis = checkOptions.used.filter(function(mod) {return mod.includes(value)});
        if (modis.length > 0) isSpez = true;
        
        let vars = item.system.vars;
        let spzVars = vars.filter(function(mod) {return mod.name.includes(value)})[0];
        if (spzVars != null) if (checkOptions.variants[spzVars.id]) isSpez = true;
    
    }

    if (isSpez) spellValue = parseInt(spellValue) + 2;

    // Open extra Dialogs for some Spells

    if (item.name === game.i18n.localize("GDSA.spell.attributo")) {

        item.system.config = CONFIG.GDSA;
        checkOptions2 = await Dialog.GetAttributoOptions(item);

        if (checkOptions2.cancelled) return;

        dataset.stat_three = actor.system[checkOptions2.att].value;
        oldAtt3 = item.system.att3;
        item.system.att3 = checkOptions2.att;
    };

    if (item.name === game.i18n.localize("GDSA.spell.fulmi")) { 
        
        let mod = item.system.vars.filter(function(item) {return item.name == game.i18n.localize("GDSA.spell.fulmiMod2")});
        if (mod.length > 0) if (variants[mod[0].id]) noChat = false; else noChat = true;
    };

    if (item.name === game.i18n.localize("GDSA.spell.zorn")) noChat = true;

    // Open extra Dialog for Ach Casts

    if(item.system.rep === "ach") {

        let stones = data.generals.filter(function(item) {return item.system.type === game.i18n.localize("GDSA.itemsheet.cystal")});

        let modistones = [];

        if (checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.technic"))}).length > 0)
            modistones.push({
                
                type: "GDSA.system.technic",
                stones: stones.filter(function(gem) {return gem.system.cut === "brill"}),
                failMod: "7"
            });

        if (checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.zenTech"))}).length > 0)
            modistones.push({
                
                type: "GDSA.system.zenTech",
                stones: stones.filter(function(gem) {return gem.system.cut === "brill"}),
                failMod: "12"
            });

        if (checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.doppelD"))}).length > 0)
            modistones.push({
                
                type: "GDSA.system.casttime",
                stones: stones.filter(function(gem) {return gem.system.cut === "rosen"}),
                failMod: "0"
            });

        if (checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.halfDur"))}).length > 0)
            modistones.push({
                
                type: "GDSA.system.casttime",
                stones: stones.filter(function(gem) {return gem.system.cut === "rosen"}),
                failMod: checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.halfDur"))})[0].split("+")[1].trim().split(")")[0]
            });        

        if (checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.cost"))}).length > 0)
            modistones.push({
                
                type: "GDSA.system.costen",
                stones: stones.filter(function(gem) {return gem.system.cut === "pende"}),
                failMod: checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.cost"))})[0].split("+")[1].trim().split(")")[0]
            });
        
        if (checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.pRad"))}).length > 0)
            modistones.push({
                
                type: "GDSA.system.reach",
                stones: stones.filter(function(gem) {return gem.system.cut === "tafel"}),
                failMod: checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.pRad"))})[0].split("+")[1].trim().split(")")[0]
            });
        
        if (checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.mRad"))}).length > 0)
            modistones.push({
                
                type: "GDSA.system.reach",
                stones: stones.filter(function(gem) {return gem.system.cut === "tafel"}),
                failMod: checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.mRad"))})[0].split("+")[1].trim().split(")")[0]
            });
        
        if (checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.hDur"))}).length > 0)
            modistones.push({
                    
                type: "GDSA.system.duration",
                stones: stones.filter(function(gem) {return gem.system.cut === "smara"}),
                failMod: checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.hDur"))})[0].split("+")[1].trim().split(")")[0]
            });
        
        
        if (checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.dDur"))}).length > 0)
            modistones.push({
                    
                type: "GDSA.system.duration",
                stones: stones.filter(function(gem) {return gem.system.cut === "smara"}),
                failMod: checkOptions.used.filter(function(mod) {return mod.includes(game.i18n.localize("GDSA.system.dDur"))})[0].split("+")[1].trim().split(")")[0]
            });

        item.modistones = modistones;
        item.modicount = modistones.length;
        item.searchFing = (searchFing.length > 0);

        item.stoneTraits1 = stones.filter(function(gem) {return gem.system.trait === item.system.trait1});
        if (item.system.trait1 === "feur" ||
            item.system.trait1 === "wass" || 
            item.system.trait1 === "humu" || 
            item.system.trait1 === "luft" || 
            item.system.trait1 === "eis" || 
            item.system.trait1 === "erz")  item.stoneTraits1 = item.stoneTraits1.concat(stones.filter(function(gem) {return gem.system.trait === "elem"}));
        if (item.system.trait1 === "blak" ||
            item.system.trait1 === "belh" || 
            item.system.trait1 === "char" || 
            item.system.trait1 === "lolg" || 
            item.system.trait1 === "thar" || 
            item.system.trait1 === "amaz" ||
            item.system.trait1 === "bels" ||
            item.system.trait1 === "asfa" ||
            item.system.trait1 === "tasf" ||
            item.system.trait1 === "belz" ||
            item.system.trait1 === "agri" ||
            item.system.trait1 === "belk")  item.stoneTraits1 = item.stoneTraits1.concat(stones.filter(function(gem) {return gem.system.trait === "daemo"}));

        item.stoneTraits2 = stones.filter(function(gem) {return gem.system.trait === item.system.trait2});
        if (item.system.trait2 === "feur" ||
            item.system.trait2 === "wass" || 
            item.system.trait2 === "humu" || 
            item.system.trait2 === "luft" || 
            item.system.trait2 === "eis" || 
            item.system.trait2 === "erz")   item.stoneTraits2 = item.stoneTraits2.concat(stones.filter(function(gem) {return gem.system.trait === "elem"}));
        if (item.system.trait2 === "blak" ||
            item.system.trait2 === "belh" || 
            item.system.trait2 === "char" || 
            item.system.trait2 === "lolg" || 
            item.system.trait2 === "thar" || 
            item.system.trait2 === "amaz" ||
            item.system.trait2 === "bels" ||
            item.system.trait2 === "asfa" ||
            item.system.trait2 === "tasf" ||
            item.system.trait2 === "belz" ||
            item.system.trait2 === "agri" ||
            item.system.trait2 === "belk")  item.stoneTraits2 = item.stoneTraits2.concat(stones.filter(function(gem) {return gem.system.trait === "daemo"}));

        item.stoneTraits3 = stones.filter(function(gem) {return gem.system.trait === item.system.trait3});
        if (item.system.trait3 === "feur" ||
            item.system.trait3 === "wass" || 
            item.system.trait3 === "humu" || 
            item.system.trait3 === "luft" || 
            item.system.trait3 === "eis" || 
            item.system.trait3 === "erz")  item.stoneTraits3 = item.stoneTraits3.concat(stones.filter(function(gem) {return gem.system.trait === "elem"}));
        if (item.system.trait3 === "blak" ||
            item.system.trait3 === "belh" || 
            item.system.trait3 === "char" || 
            item.system.trait3 === "lolg" || 
            item.system.trait3 === "thar" || 
            item.system.trait3 === "amaz" ||
            item.system.trait3 === "bels" ||
            item.system.trait3 === "asfa" ||
            item.system.trait3 === "tasf" ||
            item.system.trait3 === "belz" ||
            item.system.trait3 === "agri" ||
            item.system.trait3 === "belk")  item.stoneTraits3 = item.stoneTraits3.concat(stones.filter(function(gem) {return gem.system.trait === "daemo"}));

        item.stoneTraits4 = stones.filter(function(gem) {return gem.system.trait === item.system.trait4});
        if (item.system.trait4 === "feur" ||
            item.system.trait4 === "wass" || 
            item.system.trait4 === "humu" || 
            item.system.trait4 === "luft" || 
            item.system.trait4 === "eis" || 
            item.system.trait4 === "erz")  item.stoneTraits4 = item.stoneTraits4.concat(stones.filter(function(gem) {return gem.system.trait === "elem"}));
        if (item.system.trait4 === "blak" ||
            item.system.trait4 === "belh" || 
            item.system.trait4 === "char" || 
            item.system.trait4 === "lolg" || 
            item.system.trait4 === "thar" || 
            item.system.trait4 === "amaz" ||
            item.system.trait4 === "bels" ||
            item.system.trait4 === "asfa" ||
            item.system.trait4 === "tasf" ||
            item.system.trait4 === "belz" ||
            item.system.trait4 === "agri" ||
            item.system.trait4 === "belk")  item.stoneTraits4 = item.stoneTraits4.concat(stones.filter(function(gem) {return gem.system.trait === "daemo"}));

        checkOptions = await Dialog.GetAchazOptions(item);

        if (checkOptions.cancelled) return;
        
        achadv = checkOptions.advantage;
        achact = checkOptions.actions;
    }

    // Calculate Modifier

    let muamount = 0;
    let klamount = 0;
    let chamount = 0;

    if (item.system.att1 === "MU") muamount++;
    if (item.system.att2 === "MU") muamount++;
    if (item.system.att3 === "MU") muamount++;
    if (item.system.att1 === "KL") klamount++;
    if (item.system.att2 === "KL") klamount++;
    if (item.system.att3 === "KL") klamount++;
    if (item.system.att1 === "CH") chamount++;
    if (item.system.att2 === "CH") chamount++;
    if (item.system.att3 === "CH") chamount++;

    if (item.system.rep === "mag") disadvantage = Math.round(disadvantage / 2);
    if (item.system.rep === "mag") if (doubcast) advantage++;
    for (let i = 0; i < item.system.vars.length; i++) if (variants[i]) disadvantage += item.system.vars[i].disad;
    if (item.system.rep === "srl") if (item.system.trait1 === "illu" || item.system.trait2 === "illu" || item.system.trait3 === "illu" || item.system.trait4 === "illu") Math.round(disadvantage / 2);
    
    if (animag.length !== 0 && klamount > 0) disadvantage += (klamount * animag[0].system.value);
    if (schaus.length !== 0 && chamount > 0) disadvantage += (chamount * schaus[0].system.value);
    if (zoezau.length !== 0 && muamount > 0) disadvantage += (muamount * zoezau[0].system.value);

    if (item.name.includes(game.i18n.localize("GDSA.spell.faxi"))) {

        item.system.dices = [];
        for (let i = 0; i < (item.system.zfw - parseInt(disadvantage)); i++) item.system.dices.push((i+1) + "d6");
        checkOptions = await Dialog.GetFaxiOptions(item);

        if (checkOptions.cancelled) return;

        let zone = true;
        let mod = item.system.vars.filter(function(item) {return item.name == game.i18n.localize("GDSA.spell.faxiusMod")});
        if (mod.length > 0) if (variants[mod[0].id]) zone = false;

        optAnswer = await Dice.DMGRollWitoutChat(checkOptions.dice + "d6", actor, 1, zone);
    }

    if (item.name.includes(game.i18n.localize("GDSA.spell.sphaero"))) {
    
        optAnswer = await Dice.DMGRollWitoutChat("5d6", actor, 1, true);
    }

    if (item.name.includes(game.i18n.localize("GDSA.spell.plano"))) {
    
        optAnswer = await Dice.DMGRollWitoutChat("3d6", actor, 1, true);
    }

    let traitString1 = game.i18n.localize("GDSA.magicTraits."+ item.system.trait1).split("(")[0].trim();
    let traitString2 = game.i18n.localize("GDSA.magicTraits."+ item.system.trait2).split("(")[0].trim();
    let traitString3 = game.i18n.localize("GDSA.magicTraits."+ item.system.trait3).split("(")[0].trim();
    let traitString4 = game.i18n.localize("GDSA.magicTraits."+ item.system.trait4).split("(")[0].trim();

    let traitFokG = data.objRituals.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.traitfokus"))});

    let traitFok1 = traitFokG.filter(function(item) {return item.name.includes(game.i18n.localize(traitString1))}).filter(function(item) {return item.system.isActiv});
    let traitFok2 = traitFokG.filter(function(item) {return item.name.includes(game.i18n.localize(traitString2))}).filter(function(item) {return item.system.isActiv});
    let traitFok3 = traitFokG.filter(function(item) {return item.name.includes(game.i18n.localize(traitString3))}).filter(function(item) {return item.system.isActiv});
    let traitFok4 = traitFokG.filter(function(item) {return item.name.includes(game.i18n.localize(traitString4))}).filter(function(item) {return item.system.isActiv});

    if (traitFok1.length > 0 && traitString1 !== "") advantage++;
    if (traitFok2.length > 0 && traitString2 !== "") advantage++;
    if (traitFok3.length > 0 && traitString3 !== "") advantage++;
    if (traitFok4.length > 0 && traitString4 !== "") advantage++;

    advantage += achadv;
    
    let modif = parseInt(advantage) - parseInt(disadvantage);

    // Calculate min. Cost

    let minCost =  item.system.costs;

    if (item.system.diffrentCost) if(item.system.rep === item.system.repAlt) minCost =  item.system.costsAlt;
    for (let i = 0; i < item.system.vars.length; i++) if (variants[i]) if (item.system.vars[i].cost != "") minCost = item.system.vars[i].cost;
 
    minCost = minCost.toLowerCase().replace("w", "d")
    if(minCost.includes("d")) minCost = (await Dice.DMGRollWitoutChat(minCost, actor, 1, true)).total;

    minCost = parseInt(minCost);
    minCost = minCost + parseInt(bonusCost);
    if (item.name.includes(game.i18n.localize("GDSA.spell.faxi"))) minCost = optAnswer.total;
    minCost = Math.round((minCost / 10) * (10 - costMod));
    if (item.system.rep === "ach" && minCost > 1)  Math.round(minCost / 3);
    if (item.system.rep !== "elf" && item.system.rep !== "ach" && item.system.rep !== "sch") if (usePowerC && minCost > 1) minCost--;
    if (powerF.length > 0) minCost--;

    if(minCost > actor.system.AsP.value) notEnoughAsP = true;

    if (item.name.includes(game.i18n.localize("GDSA.spell.faxi")) && item.system.zfw >= 11 && notEnoughAsP) {

        let div = parseInt(minCost) - parseInt(actor.system.AsP.value);
        notEnoughAsP = false;
        optAnswer.total -= div;
        optAnswer.templateContext.totalDMG -= div;
        minCost = actor.system.AsP.value;
    }


    // Calculate Actions

    let action = item.system.zduration;
    for (let i = 0; i < item.system.vars.length; i++) if (variants[i]) if (item.system.vars[i].casttime != null) action = item.system.vars[i].casttime;
    if (item.system.rep !== "elf" && item.system.rep !== "ach" && item.system.rep !== "sch") if (usePowerC) action++;
    if (matrixK.length === 0) action = action + parseInt(actions);
    if (doubcast) action = action * 2;
    if (halfcast > 0) action = Math.round(action / (2 * halfcast));

    for (let i = 0; i < item.system.vars.length; i++) if (variants[i]) usedVar.push(item.system.vars[i].name);

    action += achact;

    // Generate Optional Objekt

    if (animag.length !== 0 && klamount > 0) usedVars.push(klamount + "x " + game.i18n.localize("GDSA.advantage.animag") + " " + animag[0].system.value + " (+ " + (klamount * animag[0].system.value) + ")");
    if (schaus.length !== 0 && chamount > 0) usedVars.push(chamount + "x " + game.i18n.localize("GDSA.advantage.schaus") + " " + schaus[0].system.value + " (+ " + (chamount * schaus[0].system.value) + ")");
    if (zoezau.length !== 0 && muamount > 0) usedVars.push(muamount + "x " + game.i18n.localize("GDSA.advantage.zoezau") + " " + zoezau[0].system.value + " (+ " + (muamount * zoezau[0].system.value) + ")");


    let optional = {
        template: "systems/GDSA/templates/chat/chatTemplate/spell-Cast-Roll.hbs",
        item: item,
        cost: minCost,
        action: action,
        usedVar: usedVar,
        usedVars: usedVars,
        att1: item.system.att1,
        att2: item.system.att2,
        att3: item.system.att3,
        notEnoughAsP: notEnoughAsP,
        noChat: noChat
    };

    optional.vari = (usedVar.length > 0);
    optional.varis = (usedVars.length > 0);

    // Execute Roll

    let spellCheck = await Dice.skillCheck(dataset.statname, spellValue, dataset.stat_one, dataset.stat_two, dataset.stat_three, actor, data.goofy, modif, optional);
    spellCheck.message.setFlag('gdsa', 'isCollapsable', true);

    // Reset Item

    if(oldAtt3 !== null) item.system.att3 = oldAtt3;

    if(!spellCheck.succ) return;

    if (item.name.includes(game.i18n.localize("GDSA.spell.faxi")) && !notEnoughAsP) { 
        const chatModel = Dice.chatData(actor, await renderTemplate(optAnswer.templatePath, optAnswer.templateContext));
        await Dice.doXD20XD6Roll(chatModel, optAnswer.d20, optAnswer.d6);
    }

    if (item.name.includes(game.i18n.localize("GDSA.spell.sphaero")) && !notEnoughAsP) { 
        optAnswer.templateContext.totalDMG +=  Math.round(spellCheck.value / 2);
        const chatModel = Dice.chatData(actor, await renderTemplate(optAnswer.templatePath, optAnswer.templateContext));
        await Dice.doXD20XD6Roll(chatModel, optAnswer.d20, optAnswer.d6);
    }

    if (item.name.includes(game.i18n.localize("GDSA.spell.plano")) && !notEnoughAsP) { 
        optAnswer.templateContext.totalDMG += spellCheck.value;
        const chatModel = Dice.chatData(actor, await renderTemplate(optAnswer.templatePath, optAnswer.templateContext));
        await Dice.doXD20XD6Roll(chatModel, optAnswer.d20, optAnswer.d6);
    }

    if (item.name === game.i18n.localize("GDSA.spell.fulmi")) { 

        let mod2 = item.system.vars.filter(function(item) {return item.name == game.i18n.localize("GDSA.spell.fulmiMod2")});
        if (mod2.length > 0) if (variants[mod2[0].id]) return;

        let tapS = spellCheck.templateContext.tap;
        optAnswer = await Dice.DMGRollWitoutChat("2d6+" + tapS, actor, 1, true);

        minCost = optAnswer.total
        if (item.system.rep === "ach" && minCost > 1)  Math.round(minCost / 3);
        if (item.system.rep !== "elf" && item.system.rep !== "ach" && item.system.rep !== "sch") if (usePowerC && minCost > 1) minCost--;
        if (powerF.length > 0) minCost--;
        
        if(minCost > actor.system.AsP.value) {
            let div = parseInt(minCost) - parseInt(actor.system.AsP.value);
            optAnswer.total -= div;
            optAnswer.templateContext.totalDMG -= div;
            minCost = actor.system.AsP.value;
        }

        spellCheck.templateContext.cost = minCost;

        let mod = item.system.vars.filter(function(item) {return item.name == game.i18n.localize("GDSA.spell.fulmiMod1")});
        if (mod.length > 0) if (variants[mod[0].id]) {

            let temp = Math.round(optAnswer.total / 3);
            optAnswer = await Dice.DMGRollWitoutChat(temp + "d6", actor, 1, true);
        };

        const chatModel1 = Dice.chatData(actor, await renderTemplate(spellCheck.templatePath, spellCheck.templateContext));
        await Dice.doXD20XD6Roll(chatModel1, spellCheck.dices, []);

        const chatModel2 = Dice.chatData(actor, await renderTemplate(optAnswer.templatePath, optAnswer.templateContext));
        await Dice.doXD20XD6Roll(chatModel2, optAnswer.d20, optAnswer.d6);
    }

    if (item.name === game.i18n.localize("GDSA.spell.zorn")) { 

        let tapS = spellCheck.templateContext.tap;
        optAnswer = await Dice.DMGRollWitoutChat("2d6+" + tapS, actor, 1, true);

        minCost = optAnswer.total
        if (item.system.rep === "ach" && minCost > 1)  Math.round(minCost / 3);
        if (item.system.rep !== "elf" && item.system.rep !== "ach" && item.system.rep !== "sch") if (usePowerC && minCost > 1) minCost--;
        if (powerF.length > 0) minCost--;
        
        if(minCost > actor.system.AsP.value) {

            if(item.system.zfw >= 11) {

                let div = parseInt(minCost) - parseInt(actor.system.AsP.value);
                optAnswer.total -= div;
                optAnswer.templateContext.totalDMG -= div;
                minCost = actor.system.AsP.value;

            } else spellCheck.templateContext.notEnoughAsP = true;
        }

        spellCheck.templateContext.cost = minCost;

        if (variants[0]) {

            spellCheck.templateContext.cost = actor.system.AsP.value;
            optAnswer.templateContext.totalDMG = actor.system.AsP.value;
            optAnswer.total = actor.system.AsP.value;
        };


        const chatModel1 = Dice.chatData(actor, await renderTemplate(spellCheck.templatePath, spellCheck.templateContext));
        await Dice.doXD20XD6Roll(chatModel1, spellCheck.dices, []);

        if(spellCheck.templateContext.notEnoughAsP) return;

        const chatModel2 = Dice.chatData(actor, await renderTemplate(optAnswer.templatePath, optAnswer.templateContext));
        await Dice.doXD20XD6Roll(chatModel2, optAnswer.d20, optAnswer.d6);
    }

    if (item.name === game.i18n.localize("GDSA.spell.kulmi")) {

        let mod = item.system.vars.filter(function(item) {return item.name == game.i18n.localize("GDSA.spell.kulmiMod2")});
        if (mod.length > 0) if (!variants[mod[0].id]) {
    
            optAnswer = await Dice.DMGRollWitoutChat("1d20+5", actor, 1, true);
            const chatModel = Dice.chatData(actor, await renderTemplate(optAnswer.templatePath, optAnswer.templateContext));
            await Dice.doXD20XD6Roll(chatModel, optAnswer.d20, optAnswer.d6);

            let mod = item.system.vars.filter(function(item) {return item.name == game.i18n.localize("GDSA.spell.kulmiMod1")});
            if (mod.length > 0) if (variants[mod[0].id]) {

                optAnswer = await Dice.DMGRollWitoutChat("1d20+5", actor, 1, true);
                const chatModel = Dice.chatData(actor, await renderTemplate(optAnswer.templatePath, optAnswer.templateContext));
                await Dice.doXD20XD6Roll(chatModel, optAnswer.d20, optAnswer.d6);
            };
        };
    }
}

export async function onMirikalRoll(data, event, statname = "") {

    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get Dataset from HTML

    let dataset = element.closest(".item").dataset;

    // Get Skill Value from the Actor
    
    let statvalue = system.skill.liturgy;

    // Set Attributes for Roll

    let dieOne = actor.system.MU.value + actor.system.MU.temp;
    let dieTwo = actor.system.IN.value + actor.system.IN.temp;
    let dieThr = actor.system.CH.value + actor.system.CH.temp;

    // Get Name of Skill

    let skill = statname;

    if(skill === "") skill = dataset.name;

    let skillname = "Mirakel: " + skill;

    // Check if Shift is presst for Skip Dialog

    let options = event.shiftKey ? false : true;
    let checkOptions = false;
    let advantage = 0;
    let disadvantage = 0;
    let used = [];

    if(options) {

        checkOptions = await Dialog.GetMirikalOptions();

        advantage = checkOptions.advantage;
        disadvantage = checkOptions.disadvantage;

        used = checkOptions.used;
    }

    // Calculate Modifier

    let modif = advantage - disadvantage;
    let mirModi = system.mirikal.cus[skill];

    if(mirModi === null) mirModi = 0;

    modif -= mirModi;

    // Generate Optional

    let talSitem = {system: { tale: {}}};
    talSitem.system.tale.BECheck = false;
    talSitem.system.tale.type = "holy";
    talSitem.img = "icons/magic/holy/prayer-hands-glowing-yellow.webp";

    let optional = {

        template: "systems/GDSA/templates/chat/chatTemplate/skill-Roll.hbs",
        item: talSitem,
        att1: "MU",
        att2: "IN",
        att3: "CH",
        noChat: false,
        used: used,
        mhk: false,
        asp: 0
    };
    
    // Execute Roll

    let response = await Dice.skillCheck(skillname, statvalue, dieOne, dieTwo, dieThr, actor, data.goofy, modif, optional);
    response.message.setFlag('gdsa', 'isCollapsable', true);

    return response;
}

export async function onWonderRoll(data, event) {

    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Get Skill Value from the Actor
    
    let statvalue = system.skill.liturgy;

    // Get Dataset from HTML

    let dataset = element.closest(".item").dataset;

    // Get Item

    let item = actor.items.get(dataset.itemId);

    // Create Short Name

    item.shortname = item.name.split(" ")[0];
    if(item.name.split(" ").length > 1) item.shortname += " " + item.name.split(" ")[1];
    if(item.shortname.length <= 18 && item.name.split(" ").length > 2 && containsWord(item.shortname, item.name.split(" ")[1])) item.shortname += " " + item.name.split(" ")[2];
    if(item.shortname.length <= 21 && item.name.split(" ").length > 3 && containsWord(item.shortname, item.name.split(" ")[2])) item.shortname += " " + item.name.split(" ")[3];
    if(item.shortname.length <= 21 && item.name.split(" ").length > 4 && containsWord(item.shortname, item.name.split(" ")[3])) item.shortname += " " + item.name.split(" ")[4];
    if(item.shortname.length <= 22 && item.name.split(" ").length > 5 && containsWord(item.shortname, item.name.split(" ")[4])) item.shortname += " " + item.name.split(" ")[5];
    if(item.shortname.slice(-1) === ",") item.shortname = item.shortname.substring(0, item.shortname.length - 1);
    
    // Check if Shift is presst for Skip Dialog

    let options = event.shiftKey ? false : true;
    let checkOptions = false;
    let advantage = 0;
    let disadvantage = 0;
    let used = [];
    let ritdur = false;
    let target = false;
    let reach = false;
    let wdura = false;
    let isAuf = false;


    if (item.system.range !== "faar")
        if(item.system.range === "sigt" && item.system.target.includes("Z")) item.allowReachUpgrade = false;
            else item.allowReachUpgrade = true;

    if(options) {
        
        item.config = GDSA;
        checkOptions = await Dialog.GetWonderOptions(item);

        advantage = checkOptions.advantage;
        disadvantage = checkOptions.disadvantage;

        used = checkOptions.used;

        ritdur = checkOptions.ritdur;
        target = checkOptions.target;
        reach = checkOptions.reach;
        wdura = checkOptions.wdura;
    }

    if (checkOptions.cancelled) return;

    // Calculate Lit Grad

    let grad = parseInt(item.system.grad);
    let action = item.system.ritduaration;
    let acount = item.system.ritshortdura;
    let power = item.system.power;
    let wirkDur = item.system.duration;
    let reachs = item.system.range;
    let targets = item.system.target;
    let reachAdd = "";

    if(power === "") power = false;

    if (ritdur) {

        isAuf = true;
        grad++;
        disadvantage += 2;

        used.push(game.i18n.localize("GDSA.chat.medi.incRit") + " (+ 2)");

        switch (action) {

            case "action":
                
                if ( acount != NaN )
                    acount = parseInt(acount) / 2;
                else
                    acount = 20;
                break;

            case "rounds":
                
                action = "action";
                acount = 20;
                break;

            case "halfho":
                
                action = "rounds";
                break;

            case "hours":
                
                action = "halfho";
                break;

            case "days":
                
                action = "hours";
                acount = "";
                break;
        }
    }

    if (reach) {

        isAuf = true;
        grad++;
        disadvantage += 2;

        used.push(game.i18n.localize("GDSA.chat.medi.incRea") + " (+ 2)");

        if(power !== false) power = GDSA.wonderPower[GDSA.wonderPower.indexOf(power)+1];

        switch (reachs) {

            case "self":

                reachs = "touc";
                if (targets === "G") targets = "P";
                break;

            case "touc":
                
                reachs = "sigt";
                break;

            case "sigt":

                reachs = "faar";
                reachAdd = "(" + (Math.round(parseFloat(statvalue/2))) + " Meilen)"
                break;
        }
    }

    if (target) {

        isAuf = true;
        grad++;
        disadvantage += 2;

        used.push(game.i18n.localize("GDSA.chat.medi.incTar") + " (+ 2)");

        if(power !== false) power = GDSA.wonderPower[GDSA.wonderPower.indexOf(power)+1];

        if (targets === "G") targets = "P";
        if (targets.includes("P")) targets = targets + "P";
        if (targets.includes("Z")) targets = targets + "Z";

    }

    if (wdura) {

        isAuf = true;
        grad++;
        disadvantage += 2;

        used.push(game.i18n.localize("GDSA.chat.medi.incWDu") + " (+ 2)");

        if(power !== false) power = GDSA.wonderPower[GDSA.wonderPower.indexOf(power)+1];

        wirkDur = GDSA.wonderDuration[GDSA.wonderDuration.indexOf(wirkDur)+1];
    
    }

    if (acount != "") acount = acount + " ";

    // Set Karma Kosten

    let minCost = 0;
    let pCost = " KaP";

    switch(grad) {

        case 0:
            minCost = 2;
            advantage += 2;
            break;

        case 1:
            minCost = 5;
            break;

        case 2:
            minCost = 10;
            disadvantage += 2;
            break;

        case 3:
            minCost = 15;
            disadvantage += 4;
            break;

        case 4:
            minCost = 20;
            disadvantage += 6;
            break;

        case 5:
            minCost = 25;
            disadvantage += 8;
            pCost = " KaP davon 1 permanent";
            break;

        case 6:
            minCost = 30;
            disadvantage += 10;
            pCost = " KaP davon 3 permanent";
            break;

        case 7:
            minCost = 35;
            disadvantage += 12;
            pCost = " KaP davon 5 permanent";
            break;

        case 8:
            minCost = 40;
            disadvantage += 14;
            pCost = " KaP davon 7 permanent";
            break;
    }

    if((grad*3) > statvalue && isAuf) { 
        
        ui.notifications.error('Zu viele Aufstufungen verwendet. Grad darf maximal ein Drittel des Liturgiekenntniswert betragen!')
        return;
    }

    // Calculate Modifier

    let modif = parseInt(advantage) - parseInt(disadvantage);

    // Prepare Optional Objekt

    let verb = "";

    if (item.system.verb.Pra) verb += "Pra, ";
    if (item.system.verb.Ron) verb += "Ron, ";
    if (item.system.verb.Phx) verb += "Phx, ";
    if (item.system.verb.Fir) verb += "Fir, ";
    if (item.system.verb.Tra) verb += "Tra, ";
    if (item.system.verb.Ing) verb += "Ing, ";
    if (item.system.verb.Bor) verb += "Bor, ";
    if (item.system.verb.Eff) verb += "Eff, ";
    if (item.system.verb.Hes) verb += "Hes, ";
    if (item.system.verb.Per) verb += "Per, ";
    if (item.system.verb.Rah) verb += "Rah, ";
    if (item.system.verb.Tsa) verb += "Tsa, ";
    if (item.system.verb.Ifi) verb += "Ifi, ";
    if (item.system.verb.Ave) verb += "Avs, ";
    if (item.system.verb.Kor) verb += "Kor, ";
    if (item.system.verb.Nan) verb += "Nan, ";
    if (item.system.verb.Swf) verb += "Swf, ";
    if (item.system.verb.Ang) verb += "Ang, ";
    if (item.system.verb.Tai) verb += "Tai, ";
    if (item.system.verb.Grv) verb += "Grv, ";
    if (item.system.verb.Zsa) verb += "Zsa, ";
    if (item.system.verb.Hsz) verb += "Hsz, ";
    if (item.system.verb.Kam) verb += "Kam, ";
    if (item.system.verb.Nam) verb += "Nam, ";

    if (verb !== "") verb = verb.substring(0, verb.length - 2);

    if (action === "action") action =  game.i18n.localize("GDSA.wonder." + item.system.ritduaration) + " (" + acount + "Aktionen)";
    if (action === "rounds") action =  game.i18n.localize("GDSA.wonder." + item.system.ritduaration) + " (Eine Spielrunde)";
    if (action === "halfho") action =  game.i18n.localize("GDSA.wonder." + item.system.ritduaration) + " (Eine halbe Stunde)";
    if (action === "hours") action =  game.i18n.localize("GDSA.wonder." + item.system.ritduaration) + " (" + acount + "Stunden)";
    if (action === "days") action =  game.i18n.localize("GDSA.wonder." + item.system.ritduaration) + " (" + acount + "Tage)";

    wirkDur = wirkDur.replace("LkP*", "").replace(" x 1", "");
    if(power !== false) power = power.replace("LkP*", "");
    if(power === "") power = true;

    let isSpez = (item.system.duration === "Augenblicklich" || item.system.duration === "Permanent" || item.system.duration === "Speziell");

    let optional = {
        template: "systems/GDSA/templates/chat/chatTemplate/wonder-Cast-Roll.hbs",
        item: item,
        cost: minCost,
        pcost: pCost,
        usedVars: used,
        grad: grad,
        verb: verb,
        action: action,
        wirkDur: wirkDur,
        isSpez: isSpez,
        reach: reachs,
        target: targets,
        reachAdd: reachAdd,
        power: power,
        att1: system.MU.value,
        att2: system.IN.value,
        att3: system.CH.value
    };

    optional.varis = (used.length > 0);

    let dieOne = actor.system.MU.value + actor.system.MU.temp;
    let dieTwo = actor.system.IN.value + actor.system.IN.temp;
    let dieThr = actor.system.CH.value + actor.system.CH.temp;
    
    // Execute Roll

    let wonderCheck = await Dice.skillCheck(item.name, statvalue, dieOne, dieTwo, dieThr, actor, data.goofy, modif, optional);
    wonderCheck.message.setFlag('gdsa', 'isCollapsable', true);
}

export async function onRitualCreation(data, event) {
    
    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Dataset from HTML

    let dataset = element.closest(".item").dataset;

    // Get Item

    let item = actor.items.get(dataset.itemId);

    // Get Skill Value from the HTML
    
    let skill = item.system.creatTalent;
    let actorSkills = actor.sheet.getData().ritualSkills;
    let ritualSkill = actorSkills.filter(function(item) {return item.system.skill == skill});
    if (ritualSkill.length === 0) return;
    let statvalue = actor.sheet.getData().system.skill["rit" + skill];

    // Check if Shift is presst for Skip Dialog

    let options = event.shiftKey ? false : true;
    let checkOptions = false;
    let advantage = 0;
    let disadvantage = 0;

    if(options) {

        checkOptions = await Dialog.GetSkillCheckOptions();
            
        advantage = checkOptions.advantage;
        disadvantage = checkOptions.disadvantage;
    }

    if (checkOptions.cancelled) return;

    // Calculate Modifier

    let modif = (parseInt(advantage) - parseInt(disadvantage)) - item.system.creatDisAd;

    // Calculate Cost

    let minCost =  item.system.creatCost;
 
    minCost = minCost.toLowerCase().replace("w", "d")
    if(minCost.includes("d")) minCost = (await Dice.DMGRollWitoutChat(minCost, actor, 1, true)).total;

    minCost = parseInt(minCost);

    // Prepare Optinals
    
    let statname = item.name;
    let dieOne = actor.system[item.system.activAtt1].value + actor.system[item.system.activAtt1].temp;
    let dieTwo = actor.system[item.system.activAtt2].value + actor.system[item.system.activAtt1].temp;
    let dieThr = actor.system[item.system.activAtt3].value + actor.system[item.system.activAtt1].temp;

    let optional = {
        template: "systems/GDSA/templates/chat/chatTemplate/objrit-Roll.hbs",
        item: item,
        cost: minCost,
        action: 0,
        notEnoughAsP: false,
        noChat: false
    };

    // Execute Roll

    let answer = await Dice.skillCheck(statname, statvalue, dieOne, dieTwo, dieThr, actor, data.goofy, modif, optional);

    if(answer.succ) item.update({ "system.isActiv":  true });
} 

export async function onRitualActivation(data, event) {
    
    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Dataset from HTML

    let dataset = element.closest(".item").dataset;

    // Get Item

    let item = actor.items.get(dataset.itemId);

    // Get Skill Value from the HTML
    
    let skill = item.system.activTalent;
    let actorSkills = actor.sheet.getData().ritualSkills;
    let ritualSkill = actorSkills.filter(function(item) {return item.system.skill == skill});
    if (ritualSkill.length === 0) return;
    let statvalue = actor.sheet.getData().system.skill["rit" + skill];

    // Check if Shift is presst for Skip Dialog

    let options = event.shiftKey ? false : true;
    let checkOptions = false;
    let advantage = 0;
    let disadvantage = 0;

    if(options) {

        checkOptions = await Dialog.GetSkillCheckOptions();
            
        advantage = checkOptions.advantage;
        disadvantage = checkOptions.disadvantage;
    }

    if (checkOptions.cancelled) return;

    // Calculate Modifier

    let modif = (parseInt(advantage) - parseInt(disadvantage)) - item.system.activDisAd;

    // Calculate Cost

    let minCost =  item.system.activCost;
 
    minCost = minCost.toLowerCase().replace("w", "d")
    if(minCost.includes("d")) minCost = (await Dice.DMGRollWitoutChat(minCost, actor, 1, true)).total;

    minCost = parseInt(minCost);

    // Prepare Optinals
    
    let statname = item.name;
    let dieOne = actor.system[item.system.activAtt1].value + actor.system[item.system.activAtt1].temp;
    let dieTwo = actor.system[item.system.activAtt2].value + actor.system[item.system.activAtt1].temp;
    let dieThr = actor.system[item.system.activAtt3].value + actor.system[item.system.activAtt1].temp;

    let optional = {
        template: "systems/GDSA/templates/chat/chatTemplate/objrit-Roll.hbs",
        item: item,
        cost: minCost,
        action: 0,
        notEnoughAsP: false,
        noChat: false,
        activ: true
    };

    // Execute Roll

    await Dice.skillCheck(statname, statvalue, dieOne, dieTwo, dieThr, actor, data.goofy, modif, optional);
}

export async function onStatRoll(data, event) {

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

    // Get Temp Modi

    let tempModi = 0;
    if (stat !== "MR") tempModi = statObjekt.temp;
    let statValue = statObjekt.value;

    // Check if Talentschub is present

    let talentS = system.skill["Kräfteschub [" + stat + "]"];
    let isTalentS = (talentS > 0);

    // Check if Shift is presst for Skip Dialog

    let options = event.shiftKey ? false : true;
    let checkOptions = false;
    let advantage = 0;
    let disadvantage = 0;
    let used = [];
    let talS = false;
    let talAdv = 0;
    let mirakel = false;
    let isMirakel = false;
    let mirBonus = 0;

    let statInfo = {
        name: statname,
        klerikal: system.klerikal,
        isTalentS: isTalentS,
        isMR: (stat === "MR")
    }

    let ironWillI = data.magicTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.ironWillI")});
    let ironWillII = data.magicTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.ironWillII")});

    statInfo.ironWill = (ironWillI.length > 0);

    let thoughtProt = data.magicTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.willProt")});

    statInfo.willProt = (thoughtProt.length > 0);
    
    if(options) {
            
        checkOptions = await Dialog.GetStatCheckOptions(statInfo);
            
        advantage = checkOptions.advantage;
        disadvantage = checkOptions.disadvantage;
        used = checkOptions.used;
        talS = checkOptions.talS;
        talAdv = parseInt(checkOptions.taladvantage - checkOptions.taldisadvantage);
        mirakel = checkOptions.mirakel;

        if (checkOptions.ironWill && ironWillI.length > 0) statValue += 3;
        if (checkOptions.ironWill && ironWillII.length > 0) statValue += 4;
        if (checkOptions.willProt && !checkOptions.ironWill) statValue += 3;
    }

    if (checkOptions.cancelled) return;

    let modif = parseInt(advantage) - parseInt(disadvantage);
    
    // Check if Talentschub should be rolled
    
    if (talS) {
    
        let talSName = "Talentschub: " + statname;
        let talSone = ( system.MU.value + system.MU.temp );
        let talStwo = ( system.IN.value + system.IN.temp );
        let talSthree = ( system.KO.value + system.KO.temp );
        
        let talSitem = {system: { tale: {}}};
        talSitem.system.tale.BECheck = false;
        talSitem.system.tale.type = "gift";
        talSitem.img = "icons/magic/symbols/symbol-lightning-bolt.webp";
        
        let optional1 = {
            template: "systems/GDSA/templates/chat/chatTemplate/skill-Roll.hbs",
            item: talSitem,
            att1: "MU",
            att2: "IN",
            att3: "KO",
            noChat: false,
            used: [],
            mhk: false,
            asp: 0
        };
        
        let response1 = await Dice.skillCheck(talSName, talentS, talSone, talStwo, talSthree, actor, actor.goofy, talAdv, optional1);
        response1.message.setFlag('gdsa', 'isCollapsable', true);
        
        if (response1.succ) 
            if (response1.value === 0) modif += 1;
            else modif += response1.value
        else modif -= 3;
    }
    
    // Check if Mirakel should be rolled
    
    if (mirakel) {
    
        let mirakelResponse = await onMirikalRoll(data, event, statname)
    
        if (mirakelResponse.succ) {
    
            if (mirakelResponse.value === 0) mirBonus = 6;
            else mirBonus = Math.round((mirakelResponse.value / 2) + 2);
            statValue += mirBonus;
            isMirakel = true;
        }
    }

    if(isMirakel) { used.push(game.i18n.localize("GDSA.chat.skill.mirakel") + " (- "+ mirBonus + ")")};

    // Prepare Optional Roll Data

    let optional = {
        noChat: false,
        used: used
    };

    // Execute Roll
    
    let response = await Dice.statCheck(statname, statValue, tempModi, actor, modif, optional);
    response.message.setFlag('gdsa', 'isCollapsable', true);
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

export async function onCritMisMeeleRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    let result = await Dice.CrittMisMeele(actor);

    result.setFlag('gdsa', 'isCollapsable', true);
}

export async function onCritMisRangeRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    let result = await Dice.CrittMisRange(actor);

    result.setFlag('gdsa', 'isCollapsable', true);
}

export async function onFlawRoll(data, event) {

    event.preventDefault();

    // Get Element and Actor

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Dataset from HTML

    let dataset = element.closest(".item").dataset;

    // Execute Roll

    let response = await Dice.flawCheck(dataset.flawname, dataset.flawvalue, actor);
    response.message.setFlag('gdsa', 'isCollapsable', true);
}

export async function onAttackRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Set general Used Indicators
    
    let isPartofCombat = false;   //Indicates if Token/Actor is part of Combat
    let userCombatant = null;     //If True, holds the Combatant Instance of the User
    let attacksLeft = 0;          //If True, holds the Numbers of Attacks left this Round of the Combatant

    let hasTarget = false;        //Indicates if Token/Actor has a Target
    let targetId = "";            //If True, holds the Targets Id
    let targetToken = null;       //If True, holds the Target Token Object
    let targetActor = null;       //If True, holds the Target Actor Object

    let targetCombatant = null;   //If has Target and is in Combat, holds the Combatant Instance of the Target

    let auto = false;             //If has Target and is NonPlayer use Autocombat

    let tpBonus = 0;              //Holds TPKK Bonus and Others
    let atkModi = 0;              //Holds TPKK Atk Mali

    let item;                     //Hold the Weapon Iteam of the Attack
    let answer;                   //Hold the Answer Object after the Roll
    let answer2;                  //Hold the Answer Object after the Roll
    let cacheObject;              //Hold the Cache Object for the Chat

    // Check if there is Combat and Set Combatant and Attacks left if Actor is part of Combat

    if (game.combat) {

        userCombatant = game.combat.getCombatantByActor(data.actor.id);

        if(userCombatant) {

            isPartofCombat = true;
            attacksLeft = userCombatant.getFlag("gdsa", "attacks");
        }
    }

    // Get Target of Attack

    if (game.users.get(game.userId).targets.ids.length) {

        hasTarget = true;
        targetId = game.users.get(game.userId).targets.ids[0];

        if (isPartofCombat) targetCombatant = game.combat.getCombatantByToken(targetId);

        let sceneId = game.users.get(game.userId).viewedScene;

        targetToken = game.scenes.get(sceneId).collections.tokens.get(targetId);
        targetActor = game.actors.get(targetToken.actorId);

        auto = (targetActor.type === "NonPlayer");
    }

    // Set Item if its for Raufen or Ringen

    let itemId = element.closest("tr").dataset.itemId;

    if (itemId === "raufen" || itemId === "ringen" || itemId === "biss" || itemId === "schwanz") {

        if (itemId === "raufen" || itemId === "biss" || itemId === "schwanz")  
            item = { name: "Raufen", skill: "Raufen", img: "icons/skills/melee/unarmed-punch-fist.webp", skillId: "q80TrWRaYyPMuetB", system : { weapon: { "WM-ATK": 0, "type": "Faust"}}};
        else 
            item = { name: "Ringen", skill: "Ringen", img: "icons/skills/melee/unarmed-punch-fist.webp", skillId: "FKwfmO4jlia32EAz", system : { weapon: { "WM-ATK": 0, "type": "Faust"}}};

        let skill = item.skillId;
        let skillItem = {};
        
        for (let i = 0; i < CONFIG.Templates.talents.all.length; i++) 
            if (CONFIG.Templates.talents.all[i]._id === skill) 
                skillItem = CONFIG.Templates.talents.all[i];

        // Get Weapon
        
        let ATKValue = actor.system.skill[item.skill].atk;

        // Calculate TPKK

        let kkUser = (system.KK.value + system.KK.temp);
        let x = kkUser - 10;

        if(x > 0) tpBonus += Math.floor((x / 3));
        if(x < 0) tpBonus += Math.ceil((x / 3));
        if(x < 0) atkModi += Math.ceil((x / 3));

        // Generate DMG String
            
        let dmgString = "1d6+" + tpBonus;
        if (itemId === "biss") dmgString = actor.system.nwbite + "+" + tpBonus;
        if (itemId === "schwanz") dmgString = actor.system.nwtail + "+" + tpBonus;

        // Generate Chat Cache Object and store ID

        cacheObject = {

            dmgString: dmgString,
            multi: 1,
            actor: actor.id,
            combatant: userCombatant,
            targetToken: targetId,
            targetcombatant: targetCombatant,
            item: item,
            skill: skillItem
        };

        // Do ATK Rolls

        answer = await onMeeleAttack(data, actor, item, ATKValue, atkModi, false, auto, cacheObject);

        if(!answer) return false;
        
        answer.result.message.setFlag('gdsa', 'isCollapsable', true);

        attacksLeft--
        if (isPartofCombat) userCombatant.setFlag("gdsa", "attacks", attacksLeft);

    } else {

        // Set Item from ID

        item = actor.items.get(itemId);

        // Get Weapon

        let skill = item.system.weapon.skill;
        let skillItem = {};
        let weapon = item.system.weapon.type;

        let Spezi = data.generalTraits.filter(function(item) {return item.name.includes(weapon)});
        let isSpezi= (Spezi.length > 0) ? true : false;
        
        for (let i = 0; i < CONFIG.Templates.talents.all.length; i++) 
            if (CONFIG.Templates.talents.all[i]._id === skill) 
                skillItem = CONFIG.Templates.talents.all[i];
        
        let ATKValue = actor.system.skill[skillItem.name].atk;

        // Calculate TPKK

        if (item.system.weapon.TPKK) {

            let threshold = item.system.weapon.TPKK.split("/")[0];
            let steps = item.system.weapon.TPKK.split("/")[1];
            let kkUser = (system.KK.value + system.KK.temp);
            let x = kkUser - threshold;

            if(x > 0) tpBonus += Math.floor((x / steps));
            if(x < 0) tpBonus += Math.ceil((x / steps));
            if(x < 0) atkModi += Math.ceil((x / steps));
        };

        // Generate DMG String
            
        let dmgString = item.system.weapon.damage + "+" + tpBonus;

        // Generate Chat Cache Object and store ID

        cacheObject = {

            dmgString: dmgString,
            multi: 1,
            actor: actor.id,
            combatant: userCombatant,
            targetToken: targetId,
            targetcombatant: targetCombatant,
            item: item,
            skill: skillItem
        };

        // Do ATK Rolls

        if(item.system.type == "melee") answer = await onMeeleAttack(data, actor, item, ATKValue, atkModi, isSpezi, auto, cacheObject);
        else answer = await onRangeAttack(actor, ATKValue, atkModi, isSpezi, item, auto, cacheObject);
        
        if(!answer) return false;
        
        answer.result.message.setFlag('gdsa', 'isCollapsable', true);

        attacksLeft--;
        if (isPartofCombat) userCombatant.setFlag("gdsa", "attacks", attacksLeft);
    }

    // If the Attack was Successfull and Target is present go further

    if(!answer.result.result || !hasTarget || targetActor.type !== "NonPlayer") return;

    // If Target is a NPC Actor, let him try to Parry

    if(!targetCombatant && isPartofCombat) {

        targetCombatant = (await game.combat.createEmbeddedDocuments("Combatant", [{ 
            actorId: targetToken.actorId, 
            defeated: false,
            hidden: false,
            flags: { gdsa: { combatType: "Enemy"}},
            sceneId: targetToken.parent.id, 
            tokenId: targetToken.id
        }]))[0];

        game.combat.rollNPC();
    }

    let PAValue = targetToken.actor.system.mainPA;

    if(answer.result.die1 === 1) PAValue = PAValue / 2;
    PAValue = PAValue - answer.finte;

    if(isPartofCombat) {

        if(targetCombatant.flags.gdsa.combatType !== "Enemy") return;

        // Get Parries left by Target

        let parriesLeft = targetCombatant.getFlag("gdsa", "parries");

        // Check if the Target has a Parade left and if so execute Parade
        
        if(parriesLeft > 0) {

            parriesLeft --;
            targetCombatant.setFlag("gdsa", "parries", parriesLeft);
            
            answer2 = await Dice.PACheck(PAValue, 0, targetToken);
        }

    } else answer2 = await Dice.PACheck(PAValue, 0, targetToken);
    
    // If Parry is sucessfull return;

    if(answer2 && answer2.result) return;

    // Do DMG Rolls

    let dmgMulti = answer.multi;
    
    if (answer.result.critt) dmgMulti = dmgMulti * 2;

    let dmg = await Dice.DMGRoll(cacheObject.dmgString, actor, dmgMulti);

    let sp = (dmg.result - targetActor.system.RS);

    if (sp < 0) return;

    let newHP = targetActor.system.LeP.value - sp;

    GDSA.socket.executeAsGM("adjustRessource", targetActor, newHP, "LeP");

    if(isPartofCombat && newHP <= 0) {

        targetToken.toggleActiveEffect( { id: "dead", label: "EFFECT.StatusDead", icon: "icons/svg/skull.svg" }, { overlay: true, active: true });
        targetCombatant.update({ "defeated": true });
    }                                   
}

async function onMeeleAttack(data, actor, item, ATKValue, Modi, isSpezi, auto, cacheObject) {

    let bDMG = 0;
    let mult = 1;
    let used = []; 

    // If Spezialistation is present, raise ATK and add WM

    if(isSpezi) ATKValue++;

    // Get WM from Weapon
    
    let wm = item.system.weapon["WM-ATK"];
    ATKValue += wm;

    // Check for Shild and Apply Shild WM

    for (let i = 0; i < data.equiptShield.length; i++)
        ATKValue += parseInt(data.equiptShield[i].system.weapon["WM-ATK"]);

    // Create Dialog for ATK Options

    item.anatomy = (actor.system.skill.Anatomie >= 10);
    item.butcher = (actor.system.skill.Fleischer >= 10);
    
    let ATKInfo = await Dialog.GetAtkInfo(item);

    if (ATKInfo.cancelled) return false;

    // Add up Modifiers

    if (ATKInfo.used.length > 0) used.push(ATKInfo.used);

    Modi += ATKInfo.advan;
    Modi -= ATKInfo.disad;
    Modi -= ATKInfo.wucht;
    Modi -= ATKInfo.finte;

    if(ATKInfo.wucht > 0 && item.system.weapon.type !== "Faust") used.push(game.i18n.localize("GDSA.chat.skill.wucht") + " (+ " + ATKInfo.wucht + ")");
    if(ATKInfo.wucht > 0 && item.system.weapon.type === "Faust") used.push(game.i18n.localize("GDSA.chat.skill.straight") + " (+ " + ATKInfo.wucht + ")");
    if(ATKInfo.finte > 0 && item.system.weapon.type !== "Faust") used.push(game.i18n.localize("GDSA.chat.skill.finte") + " (+ " + ATKInfo.finte + ")");
    if(ATKInfo.finte > 0 && item.system.weapon.type === "Faust") used.push(game.i18n.localize("GDSA.chat.skill.balancing") + " (+ " + ATKInfo.finte + ")");

    if(ATKInfo.hamme) Modi -= 8;
    if(ATKInfo.sturm) Modi -= 4;
    if(ATKInfo.hamme) used.push(game.i18n.localize("GDSA.chat.skill.hamme") + " (+ 8)");
    if(ATKInfo.sturm) used.push(game.i18n.localize("GDSA.chat.skill.sturm") + " (+ 4)");

    if (actor.system.gBEArmour > 0 && cacheObject.skill.system.tale.BECheck) {
        if (cacheObject.skill.system.tale.BEtype === "x") {

            let be = (actor.system.gBEArmour * cacheObject.skill.system.tale.BE);
            Modi -= be;
            used.push(game.i18n.localize("GDSA.template.BE") + " (+ " + be + ")");

        } else {

            let be = (actor.system.gBEArmour - cacheObject.skill.system.tale.BE);
            if (be > 0) {

                Modi -= be;
                used.push(game.i18n.localize("GDSA.template.BE") + " (+ " + be + ")");
            }
        }
    }

    // Create Result-Objekt

    bDMG = ATKInfo.wucht;
    bDMG += ATKInfo.bonus;
    if(ATKInfo.sturm) bDMG += 4 + Math.round(actor.system.GS.value / 2);
    if(ATKInfo.hamme) mult = 3;

    // Generate Temp Cache

    cacheObject.dmgString = cacheObject.dmgString + "+" + bDMG;
    cacheObject.multi = mult;
    cacheObject.used = used;
    
    let chatId = CONFIG.cache.generateNewId();

    // Do ATK Roll

    let result = await Dice.ATKCheck(ATKValue, Modi, actor, auto, true, chatId, cacheObject);

    if (result.critt) cacheObject.multi = cacheObject.multi * 2;
    
    GDSA.socket.executeForEveryone("sendToMemory", chatId, cacheObject);

    return {

        result: result,
        bonusDMG: bDMG,
        multi: mult,
        finte: ATKInfo.finte
    }
}

async function onRangeAttack(actor, ATKValue, Modi, isSpezi, item, auto, cacheObject) {

    let bDMG = 0;
    let finte = 8;
    let used = []; 

    // If Spezialistation is present, raise ATK

    if(isSpezi) ATKValue += 2;

    // Check Type of Weapon

    if (item.system.weapon.ammu === "none") {
        finte = 4;
    }

    // Create Dialog for ATK Options

    let ATKInfo = await Dialog.GetRangeAtkInfo(item);
    if (ATKInfo.cancelled) return;

    // Check for Aimed Rounds and Distance

    let aimed = parseInt(ATKInfo.aimed);
    let dista = parseInt(ATKInfo.dista);

    // Limit Aimed Rounds to 4 Advantage
    
    if(aimed > 4) aimed = 4;

    // Check for Distanzsense to add 2 Advantage
    
    let entsin = actor._sheet.getData().advantages.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.entsin"))});
    if (entsin.length) Modi += 2;

    // Add up Modifiers
    
    if(dista < 0) used.push(game.i18n.localize("GDSA.chat.skill.dista") + " (+ " + (dista * -1) + ")");
    if(dista > 0) used.push(game.i18n.localize("GDSA.chat.skill.dista") + " (- " + dista + ")");
    if(aimed > 0) used.push(game.i18n.localize("GDSA.chat.skill.aimed") + " (- " + aimed + ")");
    if(ATKInfo.bonus > 0) used.push(game.i18n.localize("GDSA.chat.skill.bonusDMG") + " (+ " + ATKInfo.bonus + ")");
    if(ATKInfo.winds < 0) used.push(game.i18n.localize("GDSA.chat.skill.winds") + " (+ " + (ATKInfo.winds * -1) + ")");
    if(ATKInfo.winds > 0) used.push(game.i18n.localize("GDSA.chat.skill.winds") + " (- " + ATKInfo.winds + ")");
    if(ATKInfo.sight < 0) used.push(game.i18n.localize("GDSA.chat.skill.sights") + " (+ " + (ATKInfo.sight * -1) + ")");
    if(ATKInfo.sight > 0) used.push(game.i18n.localize("GDSA.chat.skill.sights") + " (- " + ATKInfo.sight + ")");
    if(ATKInfo.movem < 0) used.push(game.i18n.localize("GDSA.chat.skill.move") + " (+ " + (ATKInfo.movem * -1) + ")");
    if(ATKInfo.movem > 0) used.push(game.i18n.localize("GDSA.chat.skill.move") + " (- " + ATKInfo.movem + ")");
    if(ATKInfo.hidea < 0) used.push(game.i18n.localize("GDSA.chat.skill.hida") + " (+ " + (ATKInfo.hidea * -1) + ")");
    if(ATKInfo.hidea > 0) used.push(game.i18n.localize("GDSA.chat.skill.hida") + " (- " + ATKInfo.hidea + ")");
    if(ATKInfo.sizeX < 0) used.push(game.i18n.localize("GDSA.chat.skill.size") + " (+ " + (ATKInfo.sizeX * -1) + ")");
    if(ATKInfo.sizeX > 0) used.push(game.i18n.localize("GDSA.chat.skill.size") + " (- " + ATKInfo.sizeX + ")");

    Modi += parseInt(ATKInfo.advan);
    Modi -= parseInt(ATKInfo.disad);
    Modi -= parseInt(ATKInfo.bonus);
    Modi += aimed;
    Modi += parseInt(ATKInfo.winds);
    Modi += parseInt(ATKInfo.sight);
    Modi += parseInt(ATKInfo.movem);
    Modi += dista;
    Modi += parseInt(ATKInfo.hidea);
    Modi += parseInt(ATKInfo.sizeX);
            
    // Create Result-Objekt

    bDMG = parseInt(ATKInfo.bonus);

    switch(dista) {
           
        case 2:
            bDMG += parseInt(item.system.weapon.tp1);
            break;
               
        case 0:
            bDMG += parseInt(item.system.weapon.tp2);
            break;
                
        case -4:
            bDMG += parseInt(item.system.weapon.tp3);
            break;
                
        case -8:
            bDMG += parseInt(item.system.weapon.tp4);
            break;
                
        case -12:
            bDMG += parseInt(item.system.weapon.tp5);
            break;                    
    }

    // Generate Temp Cache

    cacheObject.dmgString = cacheObject.dmgString + "+" + bDMG;
    cacheObject.multi = 1;
    cacheObject.used = used;

    let chatId = CONFIG.cache.generateNewId();
    
    // Do ATK Roll

    let result = await Dice.ATKCheck(ATKValue, Modi, actor, auto, false, chatId, cacheObject);

    if (result.critt) cacheObject.multi = cacheObject.multi * 2;
    
    GDSA.socket.executeForEveryone("sendToMemory", chatId, cacheObject);

    return {
        result: result,
        bonusDMG: bDMG,
        multi: 1,
        finte: finte
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
    attacksLeft = userCombatant.getFlag("gdsa", "attacks");
    attackerparriesLeft = userCombatant.getFlag("gdsa", "parries");}
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
        if(attacksLeft >= 0)userCombatant.setFlag("gdsa", "attacks", attacksLeft)
        else userCombatant.setFlag("gdsa", "parries", attackerparriesLeft)
    }

    // If the Attack was Successfull and Target is present go further

    if(result != true) return;
    if(targetId == null) return;

    // If Target is a NPC Actor, let him try to Parry
    
    if(targetType === "NonPlayer") {

        let PAValue = targetToken.system.mainPA;

        // Get Combatant

        let combatant = game.combats.contents[0].combatants.get(targetCombatantId);
        let parriesLeft = combatant.getFlag("gdsa", "parries");

        // Check if the Target has a Parade left and if so execute Parade

        if(parriesLeft > 0) {

            parriesLeft --;
            combatant.setFlag("gdsa", "parries", parriesLeft);

            let answer2 = await Dice.PACheck(PAValue, 0, targetToken);
    
            // If Parry is sucessfull return;

            if(answer2.result === true) return;
        }

        // Do DMG Rolls
        
        let dmg = await Dice.DMGRoll(dmgString, actor, 1);

        // Set new HP to Target

        let newHP = parseInt(targetToken.system.LeP.value) - parseInt(parseInt(dmg.result) - parseInt(targetToken.system.RS));
        
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

    // Set general Used Indicators
    
    let isPartofCombat = false;   //Indicates if Token/Actor is part of Combat
    let userCombatant = null;     //If True, holds the Combatant Instance of the User
    let parriesLeft = 0;          //If True, holds the Numbers of Parads left this Round of the Combatant

    let defModi = 0;              //Holds TPKK Atk Mali
    let skillItem = {};           //Holds the Item of the Used Skill

    let item;                     //Hold the Weapon Iteam of the Parads
    let answer;                   //Hold the Answer Object after the Roll
    let PAValue;                  //Hold the PA Value of the Weapon

    let cacheObject;              //Hold the Cache Object for the Chat

    // Check if there is Combat and Set Combatant and Attacks left if Actor is part of Combat

    if (game.combat) {

        userCombatant = game.combat.getCombatantByActor(data.actor.id);

        if(userCombatant) {
            isPartofCombat = true;
            parriesLeft = userCombatant.getFlag("gdsa", "parries");
        }
    }

    let itemId = element.closest("tr").dataset.itemId;

    if (itemId === "raufen" || itemId === "ringen" || itemId === "biss" || itemId === "schwanz") {

        if (itemId === "raufen" || itemId === "biss" || itemId === "schwanz")  
            item = { name: "Raufen", skill: "Raufen", img: "icons/skills/melee/unarmed-punch-fist.webp", skillId: "q80TrWRaYyPMuetB", system : { weapon: { "WM-DEF": 0, "type": "Faust"}}};
        else 
            item = { name: "Ringen", skill: "Ringen", img: "icons/skills/melee/unarmed-punch-fist.webp", skillId: "FKwfmO4jlia32EAz", system : { weapon: { "WM-DEF": 0, "type": "Faust"}}};

        let skill = item.skillId;
        
        for (let i = 0; i < CONFIG.Templates.talents.all.length; i++) 
            if (CONFIG.Templates.talents.all[i]._id === skill) 
                skillItem = CONFIG.Templates.talents.all[i];

        // Get Weapon
        
        PAValue = actor.system.skill[item.skill].def;

    } else {

        // Set Item from ID

        item = actor.items.get(itemId);

        // Get Weapon

        let skill = item.system.weapon.skill;
        let weapon = item.system.weapon.type;

        let Spezi = data.generalTraits.filter(function(item) {return item.name.includes(weapon)});
        let isSpezi = (Spezi.length > 0);
        
        for (let i = 0; i < CONFIG.Templates.talents.all.length; i++) 
            if (CONFIG.Templates.talents.all[i]._id === skill) 
                skillItem = CONFIG.Templates.talents.all[i];
        
        PAValue = actor.system.skill[skillItem.name].def;

        PAValue += item.system.weapon["WM-DEF"];
        if(isSpezi) PAValue++;
    }

    // Create Parry Dialog

    let PAInfo = await Dialog.GetSkillCheckOptions(item);
    if (PAInfo.cancelled) return;

    // Calculate Modification

    defModi -=  parseInt(PAInfo.disadvantage);
    defModi += parseInt(PAInfo.advantage);

    // Generate Chat Cache Object and store ID

    cacheObject = {

        actor: actor.id,
        combatant: userCombatant,
        item: item,
        skill: skillItem
    };

    // Do Parry Roll

    answer = await Dice.PACheck(PAValue, defModi, actor, cacheObject);  
    answer.message.setFlag('gdsa', 'isCollapsable', true);

    parriesLeft--;
    if (isPartofCombat) userCombatant.setFlag("gdsa", "parries", parriesLeft);
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

    // Set general Used Indicators
    
    let isPartofCombat = false;   //Indicates if Token/Actor is part of Combat
    let userCombatant = null;     //If True, holds the Combatant Instance of the User
    let parriesLeft = 0;          //If True, holds the Numbers of Parads left this Round of the Combatant

    let defModi = 0;              //Holds TPKK Atk Mali
    let skillItem = {};           //Holds the Item of the Used Skill

    let item;                     //Hold the Weapon Iteam of the Parads
    let answer;                   //Hold the Answer Object after the Roll
    let PAValue;                  //Hold the PA Value of the Weapon

    let cacheObject;              //Hold the Cache Object for the Chat

    // Check if there is Combat and Set Combatant and Attacks left if Actor is part of Combat

    if (game.combat) {

        userCombatant = game.combat.getCombatantByActor(data.actor.id);

        if(userCombatant) {
            isPartofCombat = true;
            parriesLeft = userCombatant.getFlag("gdsa", "parries");
        }
    }

    // Get Shield    
    
    let itemId = element.closest("tr").dataset.itemId;

    item = actor.items.get(itemId);

    let type = item.system.weapon.parType;
    let wm = item.system.weapon["WM-DEF"];

    // Calculate Parry Value

    PAValue = parseInt(system.PABasis.value);
    PAValue += parseInt(wm);
    
    // Do Shield or ParryWeapon Weapon

    let response = {};
    
    if(type === "shild")  response = await getShildPABasis(data, PAValue);
    else  response = await getParryWeaponPABasis(data, wm);

    PAValue = response.PAValue;
    
    // Generate Parry Dialog

    let PAInfo = await Dialog.GetSkillCheckOptions(item);
    if (PAInfo.cancelled) return;

    // Calculate Modificator

    defModi -= parseInt(PAInfo.disadvantage);
    defModi += parseInt(PAInfo.advantage);

    // Generate Chat Cache Object and store ID

    cacheObject = {

        actor: actor.id,
        combatant: userCombatant,
        item: item,
        hWeapon: response.usedWeapon
    };

    // Do Parry Roll

    answer = await Dice.PACheck(PAValue, defModi, actor, cacheObject);  
    answer.message.setFlag('gdsa', 'isCollapsable', true);

    parriesLeft--;
    if (isPartofCombat) userCombatant.setFlag("gdsa", "parries", parriesLeft);
}

export async function getShildPABasis(data, PABasis) {

    // Add Special Combat Trait Modifiers

    let cbtTraits = data.combatTraits;
    let isLefthand = cbtTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.leftHand")})[0];
    let isShildI = cbtTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.schildI")})[0];
    let isShildII = cbtTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.schildII")})[0];
    let isShildIII = cbtTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.schildIII")})[0];

    if(isLefthand != null) PABasis += 1;
    if(isShildI != null) PABasis += 2;
    if(isShildII != null) PABasis += 2;
    if(isShildIII != null) PABasis += 2;

    // Check for hightest Parry

    let equiptMelee = data.equiptMelee;
    let usedValue = { higestParry: 0};
    if(!data.actor) data.actor = data;

    for(const itemM of equiptMelee) {

        let skill = itemM.system.weapon.skill;
        let skillItem = {};

        for (let i = 0; i < CONFIG.Templates.talents.all.length; i++) 
            if (CONFIG.Templates.talents.all[i]._id === skill) 
                skillItem = CONFIG.Templates.talents.all[i];

        let weapon = itemM.system.weapon.type;
        let itemwm = itemM.system.weapon["WM-DEF"];

        let PAValue = data.actor.system.skill[skillItem.name].def;

        PAValue += itemwm;

        let isSpezi = data.generalTraits.filter(function(item) {return item.name.includes(weapon)});
        if(isSpezi.length > 0) PAValue += 1;

        if(PAValue > usedValue.higestParry) usedValue = {
            higestParry: PAValue,
            usedWeapon: itemM,
            usedSkill: skillItem
        };
    }

    // Add the Bonus for High Parry
    
    if(usedValue.higestParry >= 15) PABasis += 1;
    if(usedValue.higestParry >= 18) PABasis += 1;
    if(usedValue.higestParry >= 21) PABasis += 1;

    usedValue.PAValue = PABasis;

    return usedValue;
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
    let usedValue = { higestParry: 0};
    if(!data.actor) data.actor = data;

    for(const itemM of equiptMelee) {

        let skill = itemM.system.weapon.skill;
        let skillItem = {};

        for (let i = 0; i < CONFIG.Templates.talents.all.length; i++) 
            if (CONFIG.Templates.talents.all[i]._id === skill) 
                skillItem = CONFIG.Templates.talents.all[i];

        let weapon = itemM.system.weapon.type;
        let itemwm = itemM.system.weapon["WM-DEF"];

        let PAValue = data.actor.system.skill[skillItem.name].def;

        PAValue += itemwm;

        let isSpezi = data.generalTraits.filter(function(item) {return item.name.includes(weapon)});
        if(isSpezi.length > 0) PAValue += 1;
        
        if(PAValue > usedValue.higestParry) usedValue = {
            higestParry: PAValue,
            usedWeapon: itemM,
            usedSkill: skillItem
        };
    }

    // Add Weapon PA and WM to PA Value
    
    PABasis += usedValue.higestParry;
    PABasis += parseInt(wm);
    usedValue.PAValue = PABasis;

    return usedValue;
}

export async function onDogdeRoll(data, event) {

    event.preventDefault();

    // Get Actor and System
    let actor = data.actor;
    let system = data.system;

    // Get Dogde Value and Name

    let statvalue = system.Dogde;
    let statname = game.i18n.localize("GDSA.charactersheet.dogde");  
    
    // Get Dogde Options

    let checkOptions = false;
    let disadvantage = 0;
    let context = {};

    disadvantage = actor.system.gBEArmour;

    checkOptions = await Dialog.GetDogdeOptions();
    if (checkOptions.cancelled) return;

    disadvantage = checkOptions.disadvantage * -1;

    context = {
        dk: checkOptions.dk,
        directed: checkOptions.directed,
        addCombt: checkOptions.addCombt
    };

    // Execute Dogde Roll

    let answer = await Dice.dogdeCheck(statname, statvalue, disadvantage, actor, context);

    answer.message.setFlag('gdsa', 'isCollapsable', true);
}

export async function onDMGRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    // Set Item if its for Raufen or Ringen

    let itemId = element.closest("tr").dataset.itemId;
    let item;

    if (itemId === "raufen" || itemId === "ringen" || itemId === "biss" || itemId === "schwanz") {
        if (itemId === "raufen" || itemId === "biss" || itemId === "schwanz")  
            item = { name: "Raufen", skill: "Raufen", skillId: "q80TrWRaYyPMuetB", system : { weapon: { "WM-ATK": 0, "type": "Faust", "TPKK": "10/3" }}};
        else 
            item = { name: "Ringen", skill: "Ringen", skillId: "FKwfmO4jlia32EAz", system : { weapon: { "WM-ATK": 0, "type": "Faust", "TPKK": "10/3" }}};
    } else item = this.actor.items.get(itemId);

    // Calculate TPKK

    let tpBonus = 0;

    if (item.system.weapon.TPKK) {

        let threshold = item.system.weapon.TPKK.split("/")[0];
        let steps = item.system.weapon.TPKK.split("/")[1];
        let kkUser = (system.KK.value + system.KK.temp);
        let x = kkUser - threshold;
    
        if(x > 0) tpBonus += Math.floor((x / steps));
        if(x < 0) tpBonus += Math.ceil((x / steps));
    };

    // Create DMG String

    let dmgString = item.system.weapon.damage + "+" + tpBonus;
    if (itemId === "raufen" || itemId === "ringen") dmgString = "1d6+" + tpBonus;
    if (itemId === "biss") dmgString = actor.system.nwbite + "+" + tpBonus;
    if (itemId === "schwanz") dmgString = actor.system.nwtail + "+" + tpBonus;

    // Generate Chat Cache Object and store ID

    let cacheObject = {

        dmgString: dmgString,
        multi: 1,
        actor: actor.id,
        targetToken: "",
        combatant: ""};

    let chatId = CONFIG.cache.set(cacheObject);

    // Execute DMG Roll

    let result = await Dice.DMGRoll(dmgString, actor, 1,chatId);
    result.message.setFlag('gdsa', 'isCollapsable', true);
}

export async function onZoneRoll(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
    let system = data.system;

    let result = await Dice.HitZone(actor);

    result.setFlag('gdsa', 'isCollapsable', true);
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

    const template = "systems/GDSA/templates/chat/chatTemplate/" + type.toLowerCase() + "-change.hbs";

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
    let NOBonus = parseInt(regDialog.dis) * -1;
    let HPBonus = parseInt(regDialog.lep) + NOBonus;
    let APBonus = parseInt(regDialog.asp) + NOBonus;
    let KABonus = parseInt(regDialog.kap) + NOBonus;
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
    let atLeft = combatant.getFlag("gdsa", "attacks");

    // Set new AT Left Flag for Combatant

    let newATLeft = 0;
    if( toggeldCounter == atLeft) newATLeft = atLeft - 1;
    else newATLeft = toggeldCounter;

    combatant.setFlag("gdsa", "attacks", newATLeft);
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
    let paLeft = combatant.getFlag("gdsa", "parries");

    // Set new AT Left Flag for Combatant

    let newPALeft = 0;
    if( toggeldCounter == paLeft) newPALeft = paLeft - 1;
    else newPALeft = toggeldCounter;

    combatant.setFlag("gdsa", "parries", newPALeft);
}

export async function doOrientation(data, event) {

    event.preventDefault();

    // Get Element

    let element = event.currentTarget;
    
    // Get toggeld Combatant ID

    let combatantId = element.closest(".orient").dataset.id;

    // Get ATs and PAs left from the Combatant

    let combatant = game.combats.contents[0].combatants.get(combatantId);
    let atLeft = combatant.getFlag("gdsa", "attacks");
    let paLeft = combatant.getFlag("gdsa", "parries");

    // Set new AT Left Flag for Combatant

    if (atLeft > 0) atLeft--;
    else if (paLeft > 0) paLeft--
    else return; 

    combatant.setFlag("gdsa", "attacks", atLeft);
    combatant.setFlag("gdsa", "parries", paLeft);

    let newIni = combatant.actor.type == "PlayerCharakter" ? parseInt(combatant.actor.sheet.getData().system.INIBasis.value) : parseInt(combatant.actor.sheet.getData().system.INI.split('+')[1].trim());
    newIni += 6;
    if (combatant.actor.sheet.getData().system.INIDice == "2d6") newIni += 6;

    game.combat.setInitiative(combatantId, newIni)

    let templateContext = {actor: combatant, value: newIni}

    let chatModel = { user: game.user.id, speaker: ChatMessage.getSpeaker({combatant}), content: await renderTemplate("systems/GDSA/templates/chat/chatTemplate/oriantation-Roll.hbs", templateContext)};
    let roll = new Roll("1d20", {});
    let message = await roll.toMessage(chatModel);
}

export async function editCharFacts(data, event) {

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

export async function editCharStats(data, event) {

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

export async function editCharRessource(data, event) {

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

export async function editRitualSkills(data, event) {

    // Set inital Variabels

    let ritalch = data.system.skill.ritalch;
    let ritderw = data.system.skill.ritderw;
    let ritdrui = data.system.skill.ritdrui;
    let ritdurr = data.system.skill.ritdurr;
    let ritgban = data.system.skill.ritgban;
    let ritgruf = data.system.skill.ritgruf;
    let ritgauf = data.system.skill.ritgauf;
    let ritgbin = data.system.skill.ritgbin;
    let ritgeod = data.system.skill.ritgeod;
    let ritgild = data.system.skill.ritgild;
    let rithexe = data.system.skill.rithexe;
    let ritkris = data.system.skill.ritkris;
    let ritpetr = data.system.skill.ritpetr;
    let ritscha = data.system.skill.ritscha;
    let rittanz = data.system.skill.rittanz;
    let ritzibi = data.system.skill.ritzibi;
    let checkOptions = false;

    // Generate Context for the Dialog

    let context = {

        ritalch: ritalch,
        ritderw: ritderw,
        ritdrui: ritdrui,
        ritdurr: ritdurr,
        ritgban: ritgban,
        ritgruf: ritgruf,
        ritgauf: ritgauf,
        ritgbin: ritgbin,
        ritgeod: ritgeod,
        ritgild: ritgild,
        rithexe: rithexe,
        ritkris: ritkris,
        ritpetr: ritpetr,
        ritscha: ritscha,
        rittanz: rittanz,
        ritzibi: ritzibi
    };

    // Create Dialog

    checkOptions = await Dialog.editRitualSkills(context);

    if (checkOptions.cancelled) return;

    // Process Dialog and generate Log Entry

    let timestamp = new Date().toLocaleString();

    let logger = {
        userId: game.userId,
        userName: game.users.get(game.userId).name,
        date: timestamp.split(",")[0],
        time: timestamp.split(",")[1].trim(),
        action: "Changed Char Skills",
        elementType: "RitualSkills",
        elementName: data.actor.name
    };

    data.actor.addLogEntry(logger);
    data.actor.setRitSkills(checkOptions);
    data.actor.render();
}

export async function addAdvantage(data, event) {
    
    event.preventDefault();

    // Get Template Selected by User

    let checkOptions = false;
    let advantage = "";
    let item = {};
    let template = {template: (await templateData()).advantage};

    if(!event.shiftKey) {

        checkOptions = await Dialog.getAdvantage(template);

        advantage = checkOptions.advantage;
    }
    
    if (checkOptions.cancelled) return;

    // Get Item from Templates or Create new One

    if (advantage != "new") {

        item = template.template.all.filter(function(item) {return item._id === advantage})[0];

    } else {
        item = {
            name: game.i18n.localize("GDSA.system.newEntry"),
            img: "icons/sundries/scrolls/scroll-runed-brown-purple.webp",
            type: "Template",
            system: {
                type: "adva",
                tale: {
                    DE: game.i18n.localize("GDSA.system.newEntry"),
                    EN: game.i18n.localize("GDSA.system.newEntry")
                }
            }
        };
    }

    // Create Item in Actor

    return data.actor.createEmbeddedDocuments("Item", [item]);

}

export async function addDisadvantage(data, event) {
    
    event.preventDefault();

    // Get Template Selected by User

    let checkOptions = false;
    let advantage = "";
    let item = {};
    let template = {template: (await templateData()).flaw};

    if(!event.shiftKey) {

        checkOptions = await Dialog.getAdvantage(template);

        advantage = checkOptions.advantage;
    }
    
    if (checkOptions.cancelled) return;

    // Get Item from Templates or Create new One

    if (advantage != "new") {

        item = template.template.all.filter(function(item) {return item._id === advantage})[0];

    } else {
        item = {
            name: game.i18n.localize("GDSA.system.newEntry"),
            img: "icons/environment/traps/spike-skull-white-brown.webp",
            type: "Template",
            system: {
                type: "flaw",
                tale: {
                    DE: game.i18n.localize("GDSA.system.newEntry"),
                    EN: game.i18n.localize("GDSA.system.newEntry")
                }
            }
        };
    }

    // Create Item in Actor

    return data.actor.createEmbeddedDocuments("Item", [item]);
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

    // If General Item

    if (itemtype === "generals") itemData = { 
                
        "name": game.i18n.localize(name),
        "type": "Gegenstand",
        "system": { 

            "type": "item", 
            "quantity": 1,
            "weight": 0,
            "value": 0,
            "itemType": "item", 
            "item": { "storage": "bag"}
        }
    };

    // Create and return new item

    return data.actor.createEmbeddedDocuments("Item", [itemData]);
}

export function onTemplateCreate(data, event) {
    
    event.preventDefault();

    // Get Item Type and Name

    let element = event.currentTarget;
    let itemtype = element.dataset.type;
    let sftype = element.dataset.sf;
    let name = "GDSA.charactersheet.new" + itemtype;

    // Generate new Item

    let itemData = {

        name: game.i18n.localize(name),
        type: "Template",
        system: {
            type: itemtype,
            tale: {
                DE: game.i18n.localize(name),
                EN: game.i18n.localize(name)
            },
            sf: {}
        }
    };

    if (sftype != null) itemData.system.sf.type = sftype;

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

    // If its in a Collection, it gets really complicated

    for (let i = 0; i < game.packs.contents.length; i++) 
        if(game.packs.contents[i].get(itemId) != null) 
            item = game.packs.contents[i].get(itemId)

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

    let state = !actor.system.generalItemType[dataset.type];

    actor.system.generalItemType[dataset.type] = !actor.system.generalItemType[dataset.type] ;
    actor.setInventorySystem(dataset.type, state)

    actor.render();
}    

export async function onMoneyChange(data, event) {

    event.preventDefault();

    // Get Actor and System

    let actor = data.actor;
    let money = data.system.money;

    // Create Dialog

    const template = "systems/GDSA/templates/chat/chatTemplate/currency-change.hbs";
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

export function changeActiveStat(data, event) {

    event.preventDefault();

    // Set inital Variabels

    let element = event.currentTarget;
    let dataset = element.closest(".item").dataset;
    let actor = data.actor;

    // Get Item

    let itemId = dataset.itemId;
    let item = actor.items.get(itemId);

    // Update Item Status

    item.system.isActiv =  item.system.isActiv ? false : true;
    item.update({ "system.isActiv":  item.system.isActiv });

    // Generate Log Entry

    let timestamp = new Date().toLocaleString();
    let status = item.system.isActiv ? " to active" : " to inactiv";

    let logger = {
        userId: game.userId,
        userName: game.users.get(game.userId).name,
        date: timestamp.split(",")[0],
        time: timestamp.split(",")[1].trim(),
        action: "Changed " + item.name + status,
        elementType: "PlayerCharakterSheet",
        elementName: data.actor.name
    };

    actor.addLogEntry(logger);
    actor.render();
}

export function changeCastZfW(data, event) {

    event.preventDefault();

    // Set inital Variabels

    let element = event.currentTarget;
    let dataset = element.closest(".item").dataset;
    let actor = data.actor;

    // Get Item

    let itemId = dataset.itemId;
    let item = actor.items.get(itemId);

    // Update Item Status

    let newValue = event.target.valueAsNumber;
    item.update({ "system.zfw":  newValue });
    actor.render();
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

export function getWonderContextMenu(data, event) {

    let options = event.shiftKey ? false : true;

    if(options) new Browser({},{},"wonder", data.actor._id).render(true);
    else onItemCreate(data, event);
}

export function getMeleeWContextMenu(data, event) {

    let options = event.shiftKey ? false : true;

    if(options) new Browser({},{},"melee-weapons", data.actor._id).render(true);
    else onItemCreate(data, event);
}

export function getRangeWContextMenu(data, event) {

    let options = event.shiftKey ? false : true;

    if(options) new Browser({},{},"range-weapons", data.actor._id).render(true);
    else onItemCreate(data, event);
}

export function getShieldContextMenu(data, event) {

    let options = event.shiftKey ? false : true;

    if(options) new Browser({},{},"shields", data.actor._id).render(true);
    else onItemCreate(data, event);
}

export function getArmourContextMenu(data, event) {

    let options = event.shiftKey ? false : true;

    if(options) new Browser({},{},"armour", data.actor._id).render(true);
    else onItemCreate(data, event);
}

export function getObjectRitContextMenu(data, event) {

    let options = event.shiftKey ? false : true;

    if(options) new Browser({},{},"objektRitual", data.actor._id).render(true);
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

    ui.notifications.warn('This Button is currently not implemented!'); return

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
    parriesLeft = userCombatant.getFlag("gdsa", "parries");}

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
        userCombatant.setFlag("gdsa", "parries", parriesLeft)
    }
    
    // If Parry is sucessfull return;

    if(answer2.result) return;

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
    if(targetOwnership === 3) PAValue = targetToken.system.Dogde;
    else  PAValue = useractor.system.Dogde;
    let dogdename = game.i18n.localize("GDSA.charactersheet.dogde");

    if(game.user.isGM) {
        PAValue = targetToken.system.Dogde;
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
        
    let result = await Dice.DMGRoll(dmgString, actor, multi, chatId);

    result.message.setFlag('gdsa', 'isCollapsable', true);
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

export function changeTab(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;
 
    // Get Destination and Origin
 
    let dataset = element.closest("a").dataset;
    let destination = dataset.destination;
    let origin = dataset.origin;
    let optional = (dataset.optional != null) ? dataset.optional : "";

    // Change MainTab to Destination
    
    data.system.origin = origin;
    data.system.optional = optional;
    actor.sheet._tabs[0].activate(destination);
    data.actor.render();
}

export function containsWord(str, word) {
    
    return str.match(new RegExp("\\b" + word + "\\b")) != null;

}

export async function applyMirTemp(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let element = event.currentTarget;
    let actor = data.actor;

    // Get Template

    let selector = element.closest(".menuLine").querySelector(".SelHelper1");
    let selected = selector.value;

    let template = CONFIG.Templates;
    let cult = template.cults.all.filter(function(item) {return item._id === selected})[0];

    // Update Mirakel Template

    await data.actor.setStatData("mirakelTemp", cult.system.cult);
    actor.render();
}

export function chatCollaps(event) {

    event.preventDefault();

    // Get Element and ChatMessage

    let element = event.currentTarget;
    let message = element.closest(".chat-message");

    // Get Collabseable DIV Box and Bnt Picture
    
    let dBox = message.querySelector("[id=collapsable]");
    let bntImg = message.querySelector("[id=collapsImg]");

    // Toggle Class to Message

    dBox.classList.toggle('collabst');

    // Change Bnt Picture

    bntImg.classList.toggle("fa-chevron-up");
    bntImg.classList.toggle("fa-chevron-down");

    // Hide / Show Additional Infos

    let spanObj =  message.querySelector("[id=additionalInfo]");
    let hidden = spanObj.getAttribute("hidden");
    
    if ( hidden ) spanObj.removeAttribute("hidden");
    else spanObj.setAttribute("hidden", "hidden");

}

export async function showAllSkills(data, event) {

    event.preventDefault();

    // Get Element, Actor and System

    let actor = data.actor;

    // Get Status

    let showAll = actor.system.allSkills;

    // Set toggeld Status

    await data.actor.setStatData("allSkills", !showAll);
    actor.render();
}

export async function noteGMPost(data, event) {

    event.preventDefault();

    // Send Chat Message
    
    let templateContext = {name: data.item.name, value: data.system.tale.notes}
    let chatModel = { user: game.user.id, speaker: null, type: 1, 
        content: await renderTemplate("systems/GDSA/templates/chat/chatTemplate/note-Post.hbs", templateContext)};
    let message = await ChatMessage.create(chatModel);

    message.setFlag('gdsa', 'isCollapsable', true);
}

export async function noteAllPost(data, event) {

    event.preventDefault();

    // Send Chat Message
    
    let templateContext = {name: data.item.name, value: data.system.tale.notes}
    let chatModel = { user: game.user.id, speaker: null, 
        content: await renderTemplate("systems/GDSA/templates/chat/chatTemplate/note-Post.hbs", templateContext)};
    let message = await ChatMessage.create(chatModel);

    message.setFlag('gdsa', 'isCollapsable', true);
}

export async function updateChatMessagesAfterCreation(message) {}

export function testFunc(data,event) {

    event.preventDefault();

    let element = event.currentTarget;

    console.log(game);

    GDSAItem.create({
        "name": "Test",
        "img": "icons/svg/item-bag.svg",
        "type": "Gegenstand",
        "system": { 
            "type": "melee", 
            "weight": 12,
            "value": 1000,
            "weapon": {
                "length": 220,
                "type": "pike",
                "skill": "",
                "BF-cur": 0,
                "BF-min": 0,
                "DK": "N",
                "INI": 1,
                "WM-ATK": 1,
                "WM-DEF": 1,
                "TPKK": "12/4",
                "damage": "1d6+5"
            },
            "item": {
                "storage": "bag"
            },                    
            "tale": {
                "notes": ""
            }
        }
    })

    console.log(event);
    console.log(data);
}