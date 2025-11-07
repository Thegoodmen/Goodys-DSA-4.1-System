import * as Util from "../../Util.js";
import * as LsFunction from "../listenerFunctions.js"
import MultiSelect from "../apps/multiselect.js"
import * as Dialog from "../dialog.js";

const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export default class GDSANonPlayerSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

    sheet = {};

    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["GDSA", "sheet", "npcSheet"],
        actions: {
            note: this.openNotes
        },
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        position: {
            width: 632,
        },
        window: {
            controls: [
                { class: "note-sheet", icon: "fas fa-sheet-plastic", label: "Notes", action: "note" }
            ]
        }
    }

    static PARTS = {

        main: { template: "systems/gdsa/templates/sheets/nonPlayer-sheet.hbs" }
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

            gifts: Util.getTemplateItems(baseData.document, "adva").concat(Util.getTemplateItems(baseData.document, "flaw")),
            talents: Util.getTemplateItems(baseData.document, "npct", false),
            weapons: Util.getTemplateItems(baseData.document, "npcw",false),
            casts: Util.getItems(baseData.document, "spell", false)
        };

        // Calculate Percent for Ressource Bars in Sheet and if no AsP / KaP grey out

        context.system.pLeP = (100 / context.system.LeP.max) * context.system.LeP.value;
        context.system.pAuP = (100 / context.system.AuP.max) * context.system.AuP.value;
        context.system.pAsP = (100 / context.system.AsP.max) * context.system.AsP.value;
        context.system.pKaP = (100 / context.system.KaP.max) * context.system.KaP.value;

        if(context.system.AsP.max == 0) context.system.pAsP = 0;
        if(context.system.KaP.max == 0) context.system.pKaP = 0;

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

            // Set Listener for Basic Rolls

            this.element.querySelectorAll(".npc-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onNPCRoll(sheet, e)) });
            this.element.querySelectorAll(".flaw-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onFlawRoll(sheet, e)) });
            this.element.querySelectorAll(".npc-at").forEach(action => { action.addEventListener("click", (e) => LsFunction.onNPCAttackRoll(sheet, e)) });
            this.element.querySelectorAll(".npc-pa").forEach(action => { action.addEventListener("click", (e) => LsFunction.onNPCParryRoll(sheet, e)) });
            this.element.querySelectorAll(".npc-dmg").forEach(action => { action.addEventListener("click", (e) => LsFunction.onNPCDMGRoll(sheet, e)) });
        
            if(! this.id.includes("Token")) { 

                // Set Listener for Item Events

                this.element.querySelectorAll(".item-create").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemCreate(sheet, e)) });
                this.element.querySelectorAll(".template-create").forEach(action => { action.addEventListener("click", (e) => LsFunction.onTemplateCreate(sheet, e)) });
                this.element.querySelectorAll(".item-edit").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemEdit(sheet, e)) });
                this.element.querySelectorAll(".item-delete").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemDelete(sheet, e)) });

                // Set Listener for Context / Right-Click Menu
        
                new foundry.applications.ux.ContextMenu.implementation(this.element, ".item-context", LsFunction.getItemContextMenu(), {jQuery: false});
            }

            this.element.querySelectorAll(".data-multi-select").forEach((i, li) => { new MultiSelect(i) });
        }
    }

    static async openNotes(ev) {

        let newNote = await Dialog.editCharNotes({ "system": { "notes": this.sheet.system.note}});

        this.sheet.actor.setNote(newNote);
        this.sheet.system.note = newNote;
    }
}