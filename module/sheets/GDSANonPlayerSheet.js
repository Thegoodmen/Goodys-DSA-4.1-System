import * as Dice from "../dice.js";
import * as Dialog from "../dialog.js";
import * as Util from "../../Util.js";

export default class GDSANonPlayerSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/GDSA/templates/sheets/nonPlayer-sheet.hbs",
            width: 850,
            height: 525,
            resizable: false,
            classes: ["GDSA", "sheet", "nonPlayerSheet"]
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
        
        return sheetData;
    }

    activateListeners(html) {

        if(this.isEditable) {


        }

        if(this.actor.isOwner){

        }

        super.activateListeners(html);
    }


}