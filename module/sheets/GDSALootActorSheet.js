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

    itemContextMenu = [{

            name: game.i18n.localize("GDSA.system.edit"),
            icon: '<i class="fas fa-edit" />',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }
        },{
            name: game.i18n.localize("GDSA.system.delete"),
            icon: '<i class="fas fa-trash" />',
            callback: element => {
                this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")]);
            }
        }
    ]; 

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

    activateListeners(html) {

        if(this.isEditable) {

            new ContextMenu(html, ".item-context", this.itemContextMenu);
        }

        if(this.actor.isOwner){

        }

        super.activateListeners(html);
    }
}