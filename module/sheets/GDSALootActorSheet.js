import * as Dice from "../dice.js";
import * as Dialog from "../dialog.js";
import * as Util from "../../Util.js";

export default class GDSALootActorSheet extends ActorSheet { 

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/GDSA/templates/sheets/lootActor-sheet.hbs",
            width: 632,
            height: 625,
            resizable: false,
            classes: ["GDSA", "sheet", "characterSheet"]
        });
    }

    getData() {

        const baseData = super.getData();

        let sheetData = {

            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: baseData.actor,
            data: baseData.actor.data.data,
            items: baseData.items,
            config: CONFIG.GDSA,
            isGM: game.user.isGM
        };

        
        sheetData.generals = baseData.items.filter(function(item) {return item.type == "generals"});
        sheetData.meleeweapons = baseData.items.filter(function(item) {return item.type == "melee-weapons"});
        sheetData.rangeweapons = baseData.items.filter(function(item) {return item.type == "range-weapons"});
        sheetData.shields = baseData.items.filter(function(item) {return item.type == "shields"});
        sheetData.armour = baseData.items.filter(function(item) {return item.type == "armour"});
        
        return sheetData;
    }
}