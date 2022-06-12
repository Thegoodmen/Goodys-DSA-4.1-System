import { GDSA } from "./module/config.js";
import GDSAItemSheet from "./module/sheets/GDSAItemSheet.js";

Hooks.once("init", function () {

    console.log("GDSA | Initalizing Goodys DSA 4.1 System");

    CONFIG.GDSA = GDSA;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("GDSA", GDSAItemSheet, { makeDefault: true });
    
});