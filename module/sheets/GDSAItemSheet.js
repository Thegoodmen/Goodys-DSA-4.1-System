import * as LsFunction from "../listenerFunctions.js";
import {templateData} from "../apps/templates.js";

export default class GDSAItemSheet extends ItemSheet {

    static get defaultOptions() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##            Returns the General HTML of the Sheet and defines some general Stats             ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        return mergeObject(super.defaultOptions, {

            width: 466,
            resizable: false,
            tabs: [ {navSelector: ".spell-tabs", contentSelector: ".spell-body", initial: "spellDetails"}],
            classes: ["GDSA", "sheet", "itemSheet"]
        });
    }

    get template() {

        if(this.item.type === "Template") return `systems/GDSA/templates/sheets/${this.item.type}-${this.item.system.type}-sheet.hbs`

        return `systems/GDSA/templates/sheets/${this.item.type}-sheet.hbs`
    }

    async getData() {

        const baseData = super.getData();

        let sheetData = {

            owner: this.item.isOwner,
            editable: this.isEditable,
            item: baseData.item,
            system: baseData.item.system,
            config: CONFIG.GDSA,
            templates: await templateData()
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
            html.find(".addSpellVariants").click(LsFunction.addSpellVariants.bind(this, this.getData()));
            html.find(".editSpellVariants").click(LsFunction.editSpellVariants.bind(this, this.getData()));
            html.find(".deleteSpellVariants").click(LsFunction.deleteSpellVariants.bind(this, this.getData()));
        }

        super.activateListeners(html);
    }
}