import { GDSA } from "./module/config.js";
import GDSAItemSheet from "./module/sheets/GDSAItemSheet.js";
import GDSAPlayerCharakterSheet from "./module/sheets/GDSAPlayerCharakterSheet.js";

async function preloadHandlebarsTemplates(){

    const templatePaths = [
        "systems/GDSA/templates/partials/character-sheet-menu.hbs",
    ];
    
    return loadTemplates(templatePaths);
};

Hooks.once("init", function () {

    console.log("GDSA | Initalizing Goodys DSA 4.1 System");

    CONFIG.GDSA = GDSA;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("GDSA", GDSAItemSheet, { makeDefault: true });

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("GDSA", GDSAPlayerCharakterSheet, { makeDefault: true });
  
    preloadHandlebarsTemplates();
});