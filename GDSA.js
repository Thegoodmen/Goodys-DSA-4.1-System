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

async function preloadHandlebarsTemplates(){

    const templatePaths = [

        "systems/GDSA/templates/partials/character-sheet-menu.hbs",
        "systems/GDSA/templates/partials/character-sheet-mainPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-skillPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-combatPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-gmPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-magicPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-holyPage.hbs",
        "systems/GDSA/templates/partials/character-sheet-itemPage.hbs",
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

Hooks.once("init", function () {

    console.log("GDSA | Initalizing Goodys DSA 4.1 System");

    CONFIG.Combat.initiative.formula = "1d6 + @INIBasis.value + @INIBasis.modi";
	Combatant.prototype._getInitiativeFormula = _getInitiativeFormula;
    
    CONFIG.GDSA = GDSA;
    CONFIG.Actor.documentClass = GDSAActor;
    CONFIG.Item.documentClass = GDSAItem;
    CONFIG.Combat.documentClass = GDSACombat;
    CONFIG.ui.combat = GDSACombatTracker;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("GDSA", GDSAItemSheet, { makeDefault: true });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("GDSA", GDSAPlayerCharakterSheet, { makeDefault: true, types: ["PlayerCharakter"] });
    Actors.registerSheet("GDSA", GDSAMerchantSheet, { types: ["LootActor"]});
    Actors.registerSheet("GDSA", GDSALootActorSheet, { types: ["LootActor"]});
    Actors.registerSheet("GDSA", GDSANonPlayerSheet, { types: ["NonPlayer"]});

    console.log(
        JournalEntry);
  
    preloadHandlebarsTemplates();

    Handlebars.registerHelper("times", function(n, content) {
        
        let result = "";
        
        for(let i = 0; i < n; i++) {

            result += content.fn(i);
        }

        return result;
    });

    Handlebars.registerHelper("equals", function(v1, v2, options) {
        
        if(v1 === v2)
            return options.fn(this);

        return options.inverse(this);
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

    Handlebars.registerHelper("getData", function(object1, value1) {

        return object1[value1];
    });

    Handlebars.registerHelper("getRitData", function(object1, value1) {
        
        let fullValue = "rit" + value1; 
        return object1[fullValue];
    });

    Handlebars.registerHelper("getDataValue", function(object1, value1) {

        return object1[value1].value;
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

});