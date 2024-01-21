import * as Util from "../../Util.js";
import * as LsFunction from "../listenerFunctions.js"

export default class GDSANonPlayerSheet extends ActorSheet {

    sheet = {};

    static get defaultOptions() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##            Returns the General HTML of the Sheet and defines some general Stats             ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        return mergeObject(super.defaultOptions, {

            template: "systems/gdsa/templates/sheets/nonPlayer-sheet.hbs",
            width: 632,
            height: "auto",
            resizable: false,
            classes: ["GDSA", "sheet", "npcSheet"]
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

            gifts: Util.getTemplateItems(baseData, "adva").concat(Util.getTemplateItems(baseData, "flaw")),
            talents: Util.getItems(baseData, "talent", false),
            weapons: Util.getItems(baseData, "simple-weapon",false),
            traits: Util.getItems(baseData, "generalTrait",false)
        };

        // Calculate Percent for Ressource Bars in Sheet and if no AsP / KaP grey out

        sheetData.system.pLeP = (100 / sheetData.system.LeP.max) * sheetData.system.LeP.value;
        sheetData.system.pAuP = (100 / sheetData.system.AuP.max) * sheetData.system.AuP.value;
        sheetData.system.pAsP = (100 / sheetData.system.AsP.max) * sheetData.system.AsP.value;
        sheetData.system.pKaP = (100 / sheetData.system.KaP.max) * sheetData.system.KaP.value;

        if(sheetData.system.AsP.max == 0) sheetData.system.pAsP = 0;
        if(sheetData.system.KaP.max == 0) sheetData.system.pKaP = 0;

        this.sheet = sheetData;
        
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

        let sheet = this.sheet;

        // Set Listener for Basic Rolls
        
        html.find(".npc-roll").click(LsFunction.onNPCRoll.bind(this, sheet));
        html.find(".flaw-roll").click(LsFunction.onFlawRoll.bind(this, sheet));
        html.find(".npc-at").click(LsFunction.onNPCAttackRoll.bind(this, sheet));
        html.find(".npc-pa").click(LsFunction.onNPCParryRoll.bind(this, sheet));
        html.find(".npc-dmg").click(LsFunction.onNPCDMGRoll.bind(this, sheet));

        // Set Listener for Item Events

        if(! this.id.includes("Token")) html.find(".item-create").click(LsFunction.onItemCreate.bind(this, sheet));
        if(! this.id.includes("Token")) html.find(".template-create").click(LsFunction.onTemplateCreate.bind(this, sheet));
        if(! this.id.includes("Token")) html.find(".item-edit").click(LsFunction.onItemEdit.bind(this, sheet));
        if(! this.id.includes("Token")) html.find(".item-delete").click(LsFunction.onItemDelete.bind(this, sheet));

        // Set Listener for Context / Right-Click Menu

        if(! this.id.includes("Token")) new ContextMenu(html, ".item-context", LsFunction.getItemContextMenu());

        super.activateListeners(html);
    }


}