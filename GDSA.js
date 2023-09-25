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

Hooks.once("init", () => {

    console.log("GDSA | Initalizing Goodys DSA 4.1 System");

    if(!game.modules.get("socketlib")?.active) ui.notifications.warn('SocketLib must be installed and activated to use all Functions of the DSA System.');

    CONFIG.Combat.initiative.formula = "1d6 + @INIBasis.value + @INIBasis.modi";
	Combatant.prototype._getInitiativeFormula = _getInitiativeFormula;
    
    CONFIG.GDSA = GDSA;
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
  
    preloadHandlebarsTemplates();
    registerHandelbarsHelpers();  
});

Hooks.once("renderChatMessage", () => {

    $(document).on('click', '.bntChatParry', function (event) { LsFunction.ownedCharParry(event) });
    $(document).on('click', '.bntChatDogde', function (event) { LsFunction.ownedCharDogde(event) });
    $(document).on('click', '.bntChatDamage', function (event) { LsFunction.executeDMGRoll(event) });
    $(document).on('click', '.bntChatDMG', function (event) { LsFunction.executeHealthLoss(event) });
});

Hooks.on("renderSettings", (app, html) => {

    html.find('#settings-game').after($(`<h2>GDSA Einstellungen</h2><div id="gdsa-options"></div>`));

    GMScreen.Initialize(html);

    HeldenImporter.Initialize(html);
});
  

Hooks.once("socketlib.ready", () => {

    GDSA.socket = socketlib.registerSystem("GDSA");
    GDSA.socket.register("adjustRessource", adjustRessource);
    GDSA.socket.register("sendToMemory", sendToMemory);
});

function adjustRessource(target, value, type) {

    target.setStatData(type, value);
}

function sendToMemory(key, object) {

    CONFIG.cache.set(key, object);
}

function preloadHandlebarsTemplates() {

    const templatePaths = [

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
        "systems/GDSA/templates/partials/advantages.hbs",
        "systems/GDSA/templates/partials/lang.hbs"
    ];
    
    return loadTemplates(templatePaths);
};

function registerHandelbarsHelpers() {

    Handlebars.registerHelper("times", function(n, content) {
        
        let result = "";
        
        for(let i = 0; i < n; i++) {

            result += content.fn(i);
        }

        return result;
    });

    Handlebars.registerHelper("equals", function(v1, v2, options) {
        
        if(v1 === v2)
            return true;

        return false;
    });

    Handlebars.registerHelper("concat", function(s1, s2, s3) {

        if(s3 == null) s3 = "";
        return s1 + s2 + s3;
    });

    Handlebars.registerHelper("isGreater", function(p1, p2) {
    
        if(p1 > p2)
            return true;
        return false;
    });

    Handlebars.registerHelper("isEqualORGreater", function(p1, p2) {
    
        if(p1 >= p2)
            return true;
        return false;
    });

    Handlebars.registerHelper("getData", function(object1, value1) {

        return object1[value1];
    });

    Handlebars.registerHelper("getRitData", function(object1, value1) {
        
        let fullValue = "rit" + value1; 
        return object1[fullValue];
    });

    Handlebars.registerHelper("getDataValue", function(object1, value1) {

        return object1[value1]?.value;
    });

    Handlebars.registerHelper("ifOR", function(conditional1, conditional2, options) {
 
        if (conditional1 || conditional2)
          return true;
        return false;
    });

    Handlebars.registerHelper("notEmpty", function(value) {

        if (value == 0 || value == "0")
            return true;
        if (value == null|| value  == "")
            return false;
        return true;
    });

    Handlebars.registerHelper("hasSpez", function(object, value) {

        let isPres = object.filter(function(item) {return item.talentshort.includes(value)})[0];

        if(isPres != null)
            return true;
        
        return false;
    });

    Handlebars.registerHelper("getSpez", function(object, value) {

        let isPres = object.filter(function(item) {return item.talentshort.includes(value)});

        if(isPres.length > 0)
            return isPres;
        
        return null;
    });

    Handlebars.registerHelper("addSpez", function(value) {

        let newValue = parseInt(value) + 2;
        
        return newValue;
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

    Handlebars.registerHelper("doLog", function(value) {

        console.log(value);

        return "";
    });

    Handlebars.registerHelper("getGold", function(value) {

        let gold = value.slice(0, -3);

        return gold;
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
        
        let combatents = data.combats[0].combatants.contents;
        let combatant = combatents.filter(function(cmb) {return cmb._id == id})[0];

        return (combatant.flags.GDSA?.[flag] != undefined) ? combatant.flags.GDSA?.[flag] : "";        
    });

    Handlebars.registerHelper("getColorFromType", function(type) {

        switch (type) {
            case "Enemy":
                return "rgba(255,0,0,0.3)";
        
            case "NPC":
                return "rgba(0,95,255,0.7)";
                    
            case "PC":
                return "rgba(0,255,0,0.3)";
        
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

    Handlebars.registerHelper("formatNumber", function(number) {

        return new Intl.NumberFormat("de-DE").format(parseInt(number))

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

    Handlebars.registerHelper("getMeleeSkill", function(skill) {

        let config = CONFIG.GDSA;

        let output = config.meleeSkills[skill];

        return output;
    });

    Handlebars.registerHelper("getRangeSkill", function(skill) {

        let config = CONFIG.GDSA;

        let output = config.rangeSkills[skill];

        return output;
    });

    Handlebars.registerHelper("combatantAtMax", function(cmbId, Ini) {

        let combatant = game.combats.contents[0].combatants.get(cmbId);
        let type = combatant.actor.type;
        let system = combatant.actor.sheet.getData().system;	
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
}