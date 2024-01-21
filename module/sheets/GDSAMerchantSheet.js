import * as Util from "../../Util.js";
import * as LsFunction from "../listenerFunctions.js"

export default class GDSAMerchantSheet extends ActorSheet { 

    static get defaultOptions() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##            Returns the General HTML of the Sheet and defines some general Stats             ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        return mergeObject(super.defaultOptions, {

            template: "systems/gdsa/templates/sheets/merchant-sheet.hbs",
            width: 632,
            height: 625,
            resizable: false,
            classes: ["GDSA", "sheet", "characterSheet"]
        });
    }

    getData() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ## Creates Basic Datamodel, which is used to fill the HTML together with Handelbars with Data. ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################


        const baseData = super.getData();

        let sheetData = {

            // Set General Values

            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: baseData.actor,
            system: baseData.actor.system,
            items: baseData.items,
            config: CONFIG.GDSA,
            isGM: game.user.isGM,

            // Create for each Item Type its own Array

            generals: Util.getItems(baseData, "generals", false),
            meleeweapons: Util.getItems(baseData, "melee-weapons", false),
            rangeweapons: Util.getItems(baseData, "range-weapons", false),
            shields: Util.getItems(baseData, "shields", false),
            armour: Util.getItems(baseData, "armour", false),
            affiliation: Util.getItems(baseData, "affiliation", false),
        };

        // Create one Array with everything that is part of the Inventory

        sheetData.inventar = sheetData.meleeweapons.concat(sheetData.rangeweapons, sheetData.shields, sheetData.armour, sheetData.generals);

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

        // Public Merchant Roll and buying Items from the Merchant

        html.find(".merch-roll").click(LsFunction.merchRoll.bind(this, this.getData()));
        html.find(".buyItem").click(LsFunction.buyItem.bind(this, this.getData()));


        if(game.user.isGM) {

            // Set Listener for Item Events

            html.find(".item-create").click(LsFunction.onItemCreate.bind(this, this.getData()));
            html.find(".item-edit").click(LsFunction.onItemEdit.bind(this, this.getData()));

            // Change Item Quantities 

            html.find(".addQuant").click(LsFunction.addQuantity.bind(this, this.getData()));
            html.find(".removeQuant").click(LsFunction.removeQuantity.bind(this, this.getData()));

            // Set Listener for Context / Right-Click Menu

            new ContextMenu(html, ".item-context", LsFunction.getItemContextMenu());
        }

        super.activateListeners(html);
    }
}