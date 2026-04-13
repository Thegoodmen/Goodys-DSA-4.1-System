import * as Util from "../../Util.js";
import * as LsFunction from "../listenerFunctions.js"

const api = foundry.applications.api;
const sheets = foundry.applications.sheets;
 
export default class GDSAMerchantSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) { 
    
    sheet = {};

    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["GDSA", "sheet", "characterSheet"],
        actions: {},
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        position: {
            width: 632,
            height: 625
        },
        window: {
            controls: []
        }
    }

    static PARTS = {

        main: { template: "systems/gdsa/templates/sheets/merchant-sheet.hbs" }
    }

    get title() {

        return this.actor.name;
    }

    /** @override */
    _configureRenderOptions(options) {
        super._configureRenderOptions(options);
        options.parts = ["main"];
    }
    
    /** @override */
    async _prepareContext(options) {
        
        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ## Creates Basic Datamodel, which is used to fill the HTML together with Handelbars with Data. ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################
        
        const baseData = await super._prepareContext(options);

        let context = {
            
            // Set General Values
            owner: baseData.document.isOwner,
            editable: baseData.editable,
            actor: baseData.document,
            system: baseData.document.system,
            items: baseData.document.items,
            config: CONFIG.GDSA,
            isGM: baseData.user.isGM,
            template: CONFIG.Templates,
            game: game,

            // Create for each Item Type its own Array

            generals: Util.getItem(baseData.document, "item", false),
            meleeweapons: Util.getItem(baseData.document, "melee", false),
            rangeweapons: Util.getItem(baseData.document, "range", false),
            shields: Util.getItem(baseData.document, "shild", false),
            armour: Util.getItem(baseData.document, "armour", false),
            affiliation: Util.getTemplateItems(baseData.document, "affi", false),
        };

        // Create one Array with everything that is part of the Inventory
    
        context.inventar = context.meleeweapons.concat(context.rangeweapons, context.shields, context.armour, context.generals);

        this.sheet = context;
        
        return context;
    }

    /** @override */
    _onRender(context, options) {
        
        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##    Set Listener for Buttons and Links with Functions to be executed on action. e.g. Roll    ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        super._onRender(context, options);
        
        let sheet = this.sheet;
        
        new foundry.applications.ux.Tabs({navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "mainPage"}).bind(this.element);
        
        this.element.querySelectorAll(".merch-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.merchRoll(sheet, e)) });
        this.element.querySelectorAll(".buyItem").forEach(action => { action.addEventListener("click", (e) => LsFunction.buyItem(sheet, e)) });
        
        if(game.user.isGM) {

            // Set Listener for Item Events

            this.element.querySelectorAll(".item-create").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemCreate(sheet, e)) });
            this.element.querySelectorAll(".item-edit").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemEdit(sheet, e)) });

            // Change Item Quantities 
            
            this.element.querySelectorAll(".addQuant").forEach(action => { action.addEventListener("click", (e) => LsFunction.addQuantity(sheet, e)) });
            this.element.querySelectorAll(".removeQuant").forEach(action => { action.addEventListener("click", (e) => LsFunction.removeQuantity(sheet, e)) });
                            
            // Set Listener for Context / Right-Click Menu
            
            new foundry.applications.ux.ContextMenu.implementation(this.element, ".item-context", LsFunction.getItemContextMenu(), { jQuery: false });
        }
    }
}