import * as Util from "../../Util.js";
import * as LsFunction from "../listenerFunctions.js"

const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export default class GDSALootActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
    
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

        main: { template: "systems/gdsa/templates/sheets/lootActor-sheet.hbs" }
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

            // Create for each Item Type its own Array

            generals: Util.getItems(baseData.document, "generals", false),
            meleeweapons: Util.getItems(baseData.document, "melee-weapons", false),
            rangeweapons: Util.getItems(baseData.document, "range-weapons", false),
            shields: Util.getItems(baseData.document, "shields", false),
            armour: Util.getItems(baseData.document, "armour", false)
        };

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
        
        if(this.isEditable) {

            let sheet = this.sheet;
        
            if(! this.id.includes("Token")) { 
        
                new foundry.applications.ux.ContextMenu.implementation(this.element, ".item-context", LsFunction.getItemContextMenu(), {jQuery: false});
            }
        }
    }
}