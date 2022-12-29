import * as LsFunction from "../listenerFunctions.js"

export default class GDSAItemSheet extends ItemSheet {

    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {

            width: 466,
            resizable: false,
            classes: ["GDSA", "sheet", "itemSheet"]
        });
    }

    get template() {

        return `systems/GDSA/templates/sheets/${this.item.type}-sheet.hbs`
    }

    getData() {

        const baseData = super.getData();

        let sheetData = {

            owner: this.item.isOwner,
            editable: this.isEditable,
            item: baseData.item,
            system: baseData.item.system,
            config: CONFIG.GDSA
        };

        if(sheetData.system.value > 0) {

            let length = 0;
            let value = sheetData.system.value;

            sheetData.system.gold = 0;
            sheetData.system.silver = value[length-3];
            sheetData.system.copper = value[length-2];
            sheetData.system.nickel = value[length-1];
        }

        return sheetData;
    }

    activateListeners(html) {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##    Set Listener for Buttons and Links with Functions to be executed on action. e.g. Roll    ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        if(this.isEditable) {

            // Set Listener for Item Events

            html.find(".item-close").click(LsFunction.onItemClose.bind(this));
        }

        super.activateListeners(html);
    }
}