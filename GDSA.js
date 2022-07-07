import { GDSA } from "./module/config.js";
import GDSAActor from "./module/objects/GDSAActor.js";
import GDSAItem from "./module/objects/GDSAItem.js";
import GDSACombat from "./module/combat/combat.js";
import GDSACombatTracker from "./module/combat/combatTracker.js";
import { _getInitiativeFormula } from "./module/combat/initative.js";
import GDSAItemSheet from "./module/sheets/GDSAItemSheet.js";
import GDSAPlayerCharakterSheet from "./module/sheets/GDSAPlayerCharakterSheet.js";

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
    Actors.registerSheet("GDSA", GDSAPlayerCharakterSheet, { makeDefault: true });
  
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
});