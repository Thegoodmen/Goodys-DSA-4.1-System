import { GDSA } from "./module/config.js";
import GDSAActor from "./module/objects/GDSAActor.js";
import GDSAItem from "./module/objects/GDSAItem.js";
import GDSACombat from "./module/combat/combat.js";
import GDSACombatTracker from "./module/combat/combatTracker.js";
import { _getInitiativeFormula } from "./module/combat/initative.js";
import GDSAItemSheet from "./module/sheets/GDSAItemSheet.js";
import GDSAPlayerCharakterSheet from "./module/sheets/GDSAPlayerCharakterSheet.js";
import GDSALootActorSheet from "./module/sheets/GDSALootActorSheet.js";
import GDSAMerchantSheet from "./module/sheets/GDSAMerchantSheet.js";
import GDSANonPlayerSheet from "./module/sheets/GDSANonPlayerSheet.js";
import * as LsFunction from "./module/listenerFunctions.js";
import MemoryCache from "./module/memory-cache.js";
import GMScreen from "./module/apps/gmScreen.js";
import HeldenImporter from "./module/apps/heldenImport.js";
import * as Migration from "./module/apps/migration.js";
import * as Template from "./module/apps/templates.js";
import * as Dice from "./module/dice.js";

Hooks.once("init", async () => {

    console.log("GDSA | Initalizing Goodys DSA 4.1 System");

    game.gdsa = {
        rollSkillMacro,
        rollStatMacro
    };

    if(!game.modules.get("socketlib")?.active) ui.notifications.warn('SocketLib must be installed and activated to use all Functions of the DSA System.');

    CONFIG.Combat.initiative.formula = "1d6 + @INIBasis.value + @INIBasis.modi";
	Combatant.prototype._getInitiativeFormula = _getInitiativeFormula;
    CONFIG.ChatMessage.template = "./systems/GDSA/templates/ressources/chatMessage.hbs";
    CONFIG.GDSA = GDSA;
    CONFIG.INIT = true;
    CONFIG.Actor.documentClass = GDSAActor;
    CONFIG.Item.documentClass = GDSAItem;
    CONFIG.Combat.documentClass = GDSACombat;
    CONFIG.ui.combat = GDSACombatTracker;
    CONFIG.cache = new MemoryCache();
    CONFIG.fontDefinitions["MasonSerifBold"] = {
        editor: true,
        fonts: [
          {urls: ["systems/GDSA/fonts/mason-serif-bold.otf"]}
        ]
    };
    CONFIG.defaultFontFamily = "MasonSerifBold";

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("GDSA", GDSAItemSheet, { makeDefault: true });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("GDSA", GDSAPlayerCharakterSheet, { makeDefault: true, types: ["PlayerCharakter"] });
    Actors.registerSheet("GDSA", GDSAMerchantSheet, { types: ["LootActor"]});
    Actors.registerSheet("GDSA", GDSALootActorSheet, { types: ["LootActor"]});
    Actors.registerSheet("GDSA", GDSANonPlayerSheet, { types: ["NonPlayer"]});
  
    registerSystemSettings();
    preloadHandlebarsTemplates();
    registerHandelbarsHelpers();  
});

Hooks.once("ready", async () => {

    CONFIG.INIT = false;
    CONFIG.Templates = await Template.templateData();

    if(!game.user.isGM) return;

    const currentVersion = game.settings.get("gdsa", "systemMigrationVersion");
    console.log(currentVersion);
    const NEEDS_MIGRATION_VERSION = 0.01;

    let needsMigration = !currentVersion || isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);

    needsMigration = true;

    if (needsMigration) Migration.migrationV1();

    Hooks.on("hotbarDrop", (bar, data, slot) => createGDSAMacro(data, slot));
});

Hooks.once("renderChatMessage", () => {

    $(document).on('click', '.bntChatParry', function (event) { LsFunction.ownedCharParry(event) });
    $(document).on('click', '.bntChatDogde', function (event) { LsFunction.ownedCharDogde(event) });
    $(document).on('click', '.bntChatDamage', function (event) { LsFunction.executeDMGRoll(event) });
    $(document).on('click', '.bntChatDMG', function (event) { LsFunction.executeHealthLoss(event) });
    $(document).on('click', '.bntCollaps', function (event) { LsFunction.chatCollaps(event)});

});

Hooks.on("renderChatMessage", (message) => {

    LsFunction.updateChatMessagesAfterCreation(message);

});

Hooks.on("renderSettings", (app, html) => {

    html.find('#settings-game').after($(`<h2>GDSA Einstellungen</h2><div id="gdsa-options"></div>`));

    GMScreen.Initialize(html);

    HeldenImporter.Initialize(html);
});
  

Hooks.once("socketlib.ready", () => {

    GDSA.socket = socketlib.registerSystem("gdsa");
    GDSA.socket.register("adjustRessource", adjustRessource);
    GDSA.socket.register("sendToMemory", sendToMemory);
});

function registerSystemSettings() {

    game.settings.register("gdsa", "systemMigrationVersion", {
        config: false,
        scope: "world",
        type: String, 
        default: ""
    })
}

function adjustRessource(target, value, type) { target.setStatData(type, value) };

function sendToMemory(key, object) {

    CONFIG.cache.set(key, object);
}

function preloadHandlebarsTemplates() {

    const templatePaths = [

        "systems/GDSA/templates/partials/character-sheet-advantages.hbs",
        "systems/GDSA/templates/partials/character-sheet-menu.hbs",
        "systems/GDSA/templates/partials/character-sheet-mainPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-skillPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-combatPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-gmPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-magicPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-holyPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-itemPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-traitPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-generaltraitPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-combattraitPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-magictraitPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-objecttraitPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-objektRit.hbs",
        "systems/GDSA/templates/partials/character-sheet-holytraitPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-facts.hbs",
        "systems/GDSA/templates/partials/character-sheet-value1.hbs",
        "systems/GDSA/templates/partials/character-sheet-value2.hbs",
        "systems/GDSA/templates/partials/character-sheet-combatSkills.hbs",
        "systems/GDSA/templates/partials/character-sheet-bodySkills.hbs",
        "systems/GDSA/templates/partials/character-sheet-socialSkills.hbs",
        "systems/GDSA/templates/partials/character-sheet-natureSkills.hbs",
        "systems/GDSA/templates/partials/character-sheet-langSkills.hbs",
        "systems/GDSA/templates/partials/character-sheet-knowledgeSkills.hbs",
        "systems/GDSA/templates/partials/character-sheet-craftSkills.hbs",
        "systems/GDSA/templates/partials/character-sheet-giftSkills.hbs",
        "systems/GDSA/templates/partials/character-sheet-woundChart.hbs",
        "systems/GDSA/templates/partials/character-sheet-magicCast.hbs",
        "systems/GDSA/templates/partials/character-sheet-magicGeneral.hbs",
        "systems/GDSA/templates/partials/character-sheet-magicRitu.hbs",
        "systems/GDSA/templates/partials/character-sheet-holyMirikal.hbs",
        "systems/GDSA/templates/partials/character-sheet-holyGeneral.hbs",
        "systems/GDSA/templates/partials/character-sheet-holyWonder.hbs",
        "systems/GDSA/templates/partials/item-sheet-selectTalents.hbs",
        "systems/GDSA/templates/partials/item-sheet-selectAttributes.hbs",
        "systems/GDSA/templates/partials/item-sheet-selectTraits.hbs"
    ];
    
    return loadTemplates(templatePaths);
};

function registerHandelbarsHelpers() {

    Handlebars.registerHelper("equals", function(v1, v2, options) { return (v1 === v2)});

    Handlebars.registerHelper("contains", function(element, search, options) { return (element.includes(search))});

    Handlebars.registerHelper("concat", function(s1, s2, s3 = "") { return s1 + s2 + s3;});

    Handlebars.registerHelper("isGreater", function(p1, p2) { return (p1 > p2)});

    Handlebars.registerHelper("isEqualORGreater", function(p1, p2) { return (p1 >= p2)});

    Handlebars.registerHelper("getData", function(object1, value1) { if(object1) return object1[value1]; else return null;});

    Handlebars.registerHelper("getDataValue", function(object1, value1) { return object1[value1]?.value;});

    Handlebars.registerHelper("ifOR", function(conditional1, conditional2, options) { return (conditional1 || conditional2)});

    Handlebars.registerHelper("addSpez", function(value) { return parseInt(value) + 2;});

    Handlebars.registerHelper("doLog", function(value) { console.log(value)});

    Handlebars.registerHelper("getGold", function(value) { return value.slice(0, -3)});

    Handlebars.registerHelper("formatNumber", function(number) { return new Intl.NumberFormat("de-DE").format(parseInt(number))});

    Handlebars.registerHelper("toBoolean", function(string) { return (string === "true")});

    Handlebars.registerHelper("metaValue", function(item, data, template) { return calculateMetaSkill(item, data, template)});

    Handlebars.registerHelper("getLocName", function(item) { return item.system.tale[game.settings.get("core", "language").toUpperCase()];});

    Handlebars.registerHelper("getItemtype", function(item) { return game.i18n.localize(CONFIG.GDSA.itemGenType[item])});

    Handlebars.registerHelper("getRitData", function(object1, value1) {
        
        let fullValue = "rit" + value1; 
        return object1[fullValue];
    });

    Handlebars.registerHelper("times", function(n, content) {
        
        let result = "";
        
        for(let i = 0; i < n; i++)
            result += content.fn(i);

        return result;
    });

    Handlebars.registerHelper("notEmpty", function(value) {

        if (value == 0 || value == "0") return true;
        if (value == null|| value  == "") return false;
        return true;
    });

    Handlebars.registerHelper("hasSpez", function(object, value) {

        let isPres = object.filter(function(item) {return item.talentshort.includes(value)})[0];

        if(isPres != null) return true;
        return false;
    });

    Handlebars.registerHelper("getSpez", function(object, value) {

        let isPres = object.filter(function(item) {return item.talentshort.includes(value)});

        if(isPres.length > 0) return isPres;
        return null;
    });

    Handlebars.registerHelper("isUsableVari", function(vari, spellRep) {

        if(vari.resti.length === 0) return true;

        if(vari.resti[0].type === "not") {
            for (let i = 0; i < vari.resti.length; i++) if(vari.resti[i].rep === spellRep) return false;
            return true;
        } else if(vari.resti[0].type === "only") {
            for (let i = 0; i < vari.resti.length; i++) if(vari.resti[i].rep === spellRep) return true;
            return false
        } else return true;
    });

    Handlebars.registerHelper("hasGold", function(value) {
        
        if(parseInt(value) > 999) return true;
        return false;
    });

    Handlebars.registerHelper("getSilver", function(value) {

        let lengt = value.length;
        let silver = value[lengt-3]

        return silver;
    });

    Handlebars.registerHelper("hasSilver", function(value) {

        let lengt = value.length;
        let silver = value[lengt-3]

        if(silver != null && parseInt(silver) != 0) return true;
        return false;
    });

    Handlebars.registerHelper("getCopper", function(value) {

        let lengt = value.length;
        let copper = value[lengt-2]

        return copper;
    });

    Handlebars.registerHelper("hasCopper", function(value) {

        let lengt = value.length;
        let copper = value[lengt-2]

        if(copper != null && parseInt(copper) != 0) return true;
        return false;
    });

    Handlebars.registerHelper("getNickel", function(value) {

        let lengt = value.length;
        let nickel = value[lengt-1]

        return nickel;
    });

    Handlebars.registerHelper("hasNickel", function(value) {

        let lengt = value.length;
        let nickel = value[lengt-1]

        if(nickel != null && parseInt(nickel) != 0) return true;
        return false;
    });

    Handlebars.registerHelper("getTraitCSS", function(value) {

        if(value.includes("Gegner")) return "trait-type";
        if(value.includes("Immunität")) return "trait-immu";
        if(value.includes("Ressistenz")) return "trait-ressi";
        if(value.includes("Empfindlichkeit")) return "trait-vunalb";
        if(value.includes("(")) return "trait-combt";

        return "";
    });

    Handlebars.registerHelper("getFlagFromCTracker", function(data, id, flag) {
        
        let combatant = data.combat.combatants.contents.filter(function(cmb) {return cmb._id === id})[0];

        return combatant.flags.gdsa?.[flag]? combatant.flags.gdsa?.[flag] : "";        
    });

    Handlebars.registerHelper("getColorFromType", function(type) {

        switch (type) {

            case "Enemy":
                return "rgba(255,0,0,0.4)";
        
            case "NPC":
                return "rgba(255,255,0,0.4)";
                    
            case "PC":
                return "rgba(0,95,255,0.4)";
        
            default:
                return "rgba(0,0,0,0.4)";
        }
    });

    Handlebars.registerHelper("getTraits", function(system) {

        let traits = game.i18n.localize("GDSA.magicTraits." + system.trait1);

        if(system.trait2 != "none") traits += " / " + game.i18n.localize("GDSA.magicTraits." + system.trait2);
        if(system.trait3 != "none") traits += " / " + game.i18n.localize("GDSA.magicTraits." + system.trait3);
        if(system.trait4 != "none") traits += " / " + game.i18n.localize("GDSA.magicTraits." + system.trait4);

        return traits
    });

    Handlebars.registerHelper("checkForRegla", function(objekt, string) {

        for (let i = 0; i < objekt.length; i++)
            if(objekt[i].rep == string) return true;

        return false;
    });

    Handlebars.registerHelper("displayRegla", function(objekt) {

        var display = "";

        if(objekt[0].type == "only") display += "Nur in "
        else display += "Nicht in "

        for(let varis of objekt)
            display += game.i18n.localize("GDSA.reps." + varis.rep) + ", ";

        display = display.substring(0, display.length-2);

        return display;
    });

    Handlebars.registerHelper("combatantAtMax", function(cmbId, Ini) {

        let combatant = game.combats.contents[0].combatants.get(cmbId);
        let type = combatant.actor.type;
        let system = combatant.actor.system;	
        let INIBase;

	    INIBase = type == "PlayerCharakter" ? parseInt(system.INIBasis.value) : parseInt(system.INI.split('+')[1].trim());

        let maxIni = INIBase + 6;
        if (system.INIDice == "2d6") maxIni = maxIni + 6;

        if (maxIni == Ini) return false
        else return true
    });

    Handlebars.registerHelper("getRomNum", function(num) {

        if (isNaN(num))
        return "";
        
        var digits = String(+num).split(""),
        
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
        while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        
        return Array(+digits.join("") + 1).join("M") + roman;
    });

    Handlebars.registerHelper("checkWonderRange", function(item) {

        if(item.system.range === "faar") return false;
        if(item.system.target[0] === "Z" && item.system.range === "sigt") return false;
        return true;
    });

    Handlebars.registerHelper("calculateWonder", function(formel, tap) {

        let sum = 0;

        if (formel === true) return tap + " Punkte ( LkP* )";

        if (formel.includes("/2")) sum = Math.round(parseFloat(tap) / 2)
        else sum = parseInt(tap);

        if (formel.includes("+")) sum += parseInt(trim(formel.split("+")[1]))
        return sum + " Punkte ( LkP*" + formel + " )";

    });

    Handlebars.registerHelper("skillName", function(name, data) {

        let langSelection = game.settings.get("core", "language").toUpperCase();
        let allTalents = data.template.talents.all;

        let talent = allTalents.filter(function(item) {return item.name.toLowerCase() == name.toLowerCase()})[0];

        let skillname = talent.system.tale[langSelection];

        return skillname;
    });

    Handlebars.registerHelper("skillAttributs", function(name, data) {

        let allTalents = data.template.talents.all;

        let talent = allTalents.filter(function(item) {return item.name.toLowerCase() == name.toLowerCase()})[0];

        let att1 = game.i18n.localize("GDSA.charactersheet.s" + talent.system.tale.att1.toUpperCase());
        let att2 = game.i18n.localize("GDSA.charactersheet.s" + talent.system.tale.att2.toUpperCase());
        let att3 = game.i18n.localize("GDSA.charactersheet.s" + talent.system.tale.att3.toUpperCase());

        let answer = "(" + att1 + "/" + att2 + "/" + att3 + ")";

        return answer;
    });

    Handlebars.registerHelper("skillBE", function(type, value) {

        let answer = type + " " + value;

        if (type === "x" && value === "1") answer = "";
        return answer;
    });

    Handlebars.registerHelper("hasRomNum", function(name) {

        if (name.split(" ").includes("I")) return true;
        else if (name.split(" ").includes("II")) return true;
        else if (name.split(" ").includes("III")) return true;
        else if (name.split(" ").includes("IV")) return true;
        else if (name.split(" ").includes("V")) return true;
        else if (name.split(" ").includes("VI")) return true;
        else if (name.split(" ").includes("VII")) return true;
        else if (name.split(" ").includes("VIII")) return true;
        else if (name.split(" ").includes("IX")) return true;
        else if (name.split(" ").includes("X")) return true;
        else if (name.split(" ").includes("XI")) return true;
        else if (name.split(" ").includes("XII")) return true;
        else if (name.split(" ").includes("XIII")) return true;
        else if (name.split(" ").includes("XIV")) return true;
        else if (name.split(" ").includes("XV")) return true;
        else return false;

    });

    Handlebars.registerHelper("isSleeping", function(sf, char) {

        let sleeping = false;

        let traitOr = [];

        for (let index = 1; index <= 20; index++) {

            if(sf.system.sf.requ === undefined) continue;

            let attr = sf.system.sf.requ["tale" + index];
            let level = sf.system.sf.requ["level" + index];
            let condition = sf.system.sf.requ["condition" + index];

            switch (sf.system.sf.requ["type" + index]) {

                case "attribut":

                    switch (attr) {
                        case "MR":
                            if (!(char.system.MR.value >= level)) sleeping = true;
                            break;

                        case "INI":
                            if (!(char.system.INIBasis.value >= level)) sleeping = true;
                            break;

                        case "ATB":
                            if (!(char.system.ATBasis.value >= level)) sleeping = true;
                            break;
                        
                        case "PAB":
                            if (!(char.system.PABasis.value >= level)) sleeping = true;
                            break;

                        case "FKB":
                            if (!(char.system.FKBasis.value >= level)) sleeping = true;
                            break;
                    
                        default:
                            if (!((char.system[attr].value + char.system[attr].temp) >= level)) sleeping = true;
                            break;
                    }

                    break;
                
                case "talent":

                    switch (attr) {
                        case "Liturgiekenntnis":
                            if (!(char.system.skill.liturgy >= level)) sleeping = true;
                            break;

                        case "Geister rufen":
                        case "Geister bannen":
                        case "Geister binden":
                        case "Geister aufnehmen":
                        case "none":
                            break;
                    
                        default:
                            if (typeof char.system.skill[attr] === 'object' && char.system.skill[attr] !== null) {
                                if (!(char.system.skill[attr].value >= level)) sleeping = true;
                            } else {
                                if (!(char.system.skill[attr] >= level)) sleeping = true;
                            }
                            break;
                    }

                    break;

                case "spell":

                    let spell = char.spells.filter(function(item) {return item.name.toLowerCase() === attr.toLowerCase()})[0];
                    if (!(spell.system.zfw >= level)) sleeping = true;
                    break;

                case "trait":
                case "advantage":
                case "flaw":

                    let trait = char.items.filter(function(item) {return item.name.toLowerCase().includes(attr.toLowerCase())});

                    switch (condition) {
                        case "AND":
                            if (!(trait.length > 0)) sleeping = true;
                            break;
                        
                        case "NOT":
                            if ((trait.length > 0)) sleeping = true;
                            break;
                        
                        case "OR":
                            traitOr.push((trait.length > 0));
                            break;
                    }
                    break;

                default:
                    break;
            }
            
        }

        if((!(traitOr.some((e) => e))) && traitOr.length > 0) sleeping = true;

        return sleeping;
    });
}


/* -------------------------------------------- */
/*  General Functions                           */
/* -------------------------------------------- */

/**
 * Calculates the Value of a Meta Skill
 * 
 * @param {Object} item     The Item of the Skill
 * @param {Object} data     The Skill Object of the Actor
 * @param {Object} template The Template Object
 * 
 * @returns {Integer}
 */

function calculateMetaSkill(item, data, template) {

    // Reset the Skill Value

    let skillValue = 0;

    // Check Number of Skills

    let numSkill = 0;
    let skill1 = 0;
    let skill2 = 0;
    let skill3 = 0;
    let skill4 = 0;
    let skill5 = 0;

    if(item.system.tale.meta.tal1 != "none") numSkill++;
    if(item.system.tale.meta.tal2 != "none") numSkill++;
    if(item.system.tale.meta.tal3 != "none") numSkill++;
    if(item.system.tale.meta.tal4 != "none") numSkill++;
    if(item.system.tale.meta.tal5 != "none") numSkill++;

    // Retrive the Skills nessesary

    if(item.system.tale.meta.tal1 != "none") skill1 = (isNaN(parseInt(data[item.system.tale.meta.tal1]))) ? 0 : parseInt(data[item.system.tale.meta.tal1]);
    if(item.system.tale.meta.tal2 != "none") skill2 = (isNaN(parseInt(data[item.system.tale.meta.tal2]))) ? 0 : parseInt(data[item.system.tale.meta.tal2]);
    if(item.system.tale.meta.tal3 != "none") skill3 = (isNaN(parseInt(data[item.system.tale.meta.tal3]))) ? 0 : parseInt(data[item.system.tale.meta.tal3]);
    if(item.system.tale.meta.tal4 != "none") skill4 = (isNaN(parseInt(data[item.system.tale.meta.tal4]))) ? 0 : parseInt(data[item.system.tale.meta.tal4]);
    if(item.system.tale.meta.tal5 != "none") skill5 = (isNaN(parseInt(data[item.system.tale.meta.tal5]))) ? 0 : parseInt(data[item.system.tale.meta.tal5]);

    // Put all Range Skills in an Array and retrive the highest Skill Value

    let rangeTaW = 0;
    let array = template.talents.range;
    for (var skill of array) if(data[skill.name].value > rangeTaW) rangeTaW = data[skill.name].value;

    if(item.system.tale.meta.tal1 === "range") skill1 = rangeTaW;
    if(item.system.tale.meta.tal2 === "range") skill2 = rangeTaW;
    if(item.system.tale.meta.tal3 === "range") skill3 = rangeTaW;
    if(item.system.tale.meta.tal4 === "range") skill4 = rangeTaW;
    if(item.system.tale.meta.tal5 === "range") skill5 = rangeTaW;

    // Calculate the Value and Test against the Rule that the highest Result can be the doubeld rank involved

    skillValue = (skill1 + skill2 + skill3 + skill4 + skill5) / numSkill;

    if(skillValue > (skill1 * 2) && item.system.tale.meta.tal1 != "none") skillValue = skill1 * 2;
    if(skillValue > (skill2 * 2) && item.system.tale.meta.tal2 != "none") skillValue = skill2 * 2;
    if(skillValue > (skill3 * 2) && item.system.tale.meta.tal3 != "none") skillValue = skill3 * 2;
    if(skillValue > (skill4 * 2) && item.system.tale.meta.tal4 != "none") skillValue = skill4 * 2;
    if(skillValue > (skill5 * 2) && item.system.tale.meta.tal5 != "none") skillValue = skill5 * 2;

    // Send Endresult to Sheet

    return Math.round(skillValue);
}

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * 
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * 
 * @returns {Promise}
 */

async function createGDSAMacro(data, slot) {

    console.log(data);

    if (data.type === "skill") {

        // Create the macro command

        const command = "game.gdsa.rollSkillMacro(" +  JSON.stringify(data) + ");";

        let macro = game.macros._source.find(m => (m.name === data.name) && (m.command === command));

        if (!macro) macro = await Macro.create({
            name: data.name,
            type: "script",
            img: (await Template.getTalent(data.item)).img,
            command: command,
            flags: { "gdsa.skillMacro": true }
        });

        game.user.assignHotbarMacro(macro, slot);

        return false;

    } else if (data.type === "stat") {

        // Create the macro command

        const command = "game.gdsa.rollStatMacro(" +  JSON.stringify(data) + ");";

        let macro = game.macros._source.find(m => (m.name === data.stat) && (m.command === command));

        if (!macro) macro = await Macro.create({
            name: data.stat,
            type: "script",
            command: command,
            flags: { "gdsa.skillMacro": true }
        });

        game.user.assignHotbarMacro(macro, slot);

        return false;

    } else return
}

/**
 * Makro for Stat Roll
 * 
 * @param {string} itemData
 * 
 * @return {Promise}
 */

async function rollStatMacro(itemData) {

    let actor = game.actors.get(itemData.actorId);
    let system = (await actor.sheet.getData()).system;

    // Get Stat from HTML

    let stat = itemData.stat;
    let statObjekt = system[stat];

    // Get Stat Name

    let statname = game.i18n.localize("GDSA.charactersheet."+stat);

    // Get Temp Modi

    let tempModi = 0;
    if (stat != "MR") tempModi = statObjekt.temp;

    // Execute Roll
    
    return Dice.statCheck(statname, statObjekt.value, tempModi, actor);
}

/**
 * Makro for Skill Roll
 * 
 * @param {string} itemData
 * 
 * @return {Promise}
 */

async function rollSkillMacro(itemData) {

    // Calculate Skill Value 

    let actor = game.actors.get(itemData.actorId);
    let item = await Template.getTalent(itemData.item);
    let skillValue = actor.system.skill[item.name];
    let templates = await Template.templateData();
    if (itemData.isSpez) skillValue += 2;
    if (itemData.isMeta) skillValue = calculateMetaSkill(item, actor.system.skill, templates);

    // Create Objekt for SkillRoll

    let rollEvent = {
        name: itemData.name,
        item: item,
        actor: actor,
        stat: skillValue,
        skipMenu: true
    }

    // Do the Skillroll
    
    return LsFunction.doSkillRoll(rollEvent);
}