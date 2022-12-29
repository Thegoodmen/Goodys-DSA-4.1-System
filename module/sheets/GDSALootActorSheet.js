import * as LsFunction from "../listenerFunctions.js"

export default class GDSALootActorSheet extends ActorSheet { 

    static get defaultOptions() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##            Returns the General HTML of the Sheet and defines some general Stats             ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        return mergeObject(super.defaultOptions, {

            template: "systems/GDSA/templates/sheets/lootActor-sheet.hbs",
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
            armour: Util.getItems(baseData, "armour", false)
        };

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

            // Set Listener for Context / Right-Click Menu

            new ContextMenu(html, ".item-context", LsFunction.getItemContextMenu());
        }

        super.activateListeners(html);
    }
}