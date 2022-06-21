import { GDSA } from "./module/config.js";
import GDSActor from "./module/objects/GDSAActor.js";
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
        "systems/GDSA/templates/partials/advantages.hbs"
    ];
    
    return loadTemplates(templatePaths);
};

Hooks.once("init", function () {

    console.log("GDSA | Initalizing Goodys DSA 4.1 System");

    CONFIG.GDSA = GDSA;
    CONFIG.Actor.documentClass = GDSActor;

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
});