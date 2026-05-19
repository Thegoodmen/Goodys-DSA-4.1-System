import * as Util from "../../Util.js";
import * as LsFunction from "../listenerFunctions.js";
import {templateData} from "../apps/templates.js";
import * as Dialog from "../dialog.js";

const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export default class GDSAItemSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {

    sheet = {};

    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["GDSA", "sheet", "itemSheet"],
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        position: {
            width: 900,
            height: 662
        }
    }

    get template() {

        let itemType = this.item.system.type;

        if(itemType === "none" || itemType === "s") itemType = "";

        if(this.item.type === "Gegenstand" && itemType === "item" && this.item.system.itemType === "book") return `systems/gdsa/templates/sheets/gegenstand/${this.item.type}-${itemType}-book-sheet.hbs`
        if(this.item.type === "Gegenstand") return `systems/gdsa/templates/sheets/gegenstand/${this.item.type}-${itemType}-sheet.hbs`
        if(this.item.type === "objektRitual") return `systems/gdsa/templates/sheets/ritual/${this.item.type}-${itemType}-sheet.hbs`
        return `systems/gdsa/templates/sheets/items/${this.item.type}-sheet.hbs`
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
            item: baseData.document,
            system: baseData.document.system,
            config: CONFIG.GDSA,
            isGM: baseData.user.isGM,
            template: CONFIG.Templates,
            templates: CONFIG.Templates,
            effects: baseData.document.effects,

            // Set GDSAItem specific Values

            selTalents: this.getSelectTalents(),
            selTraits: this.getSelectTraits(),
            selTalentN: this.getSelectTalentsN(),
            setWeaponR: this.getWeaponRange(baseData.document.system),
        };

        // Calculate the Value / Price of the Item 
        
        if(context.system.value > 0) {

            let length = 0;
            let value = context.system.value;

            context.system.gold = 0;
            context.system.silver = value[length-3];
            context.system.copper = value[length-2];
            context.system.nickel = value[length-1];
        }
        
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
        
        new foundry.applications.ux.Tabs({navSelector: ".spell-tabs", contentSelector: ".spell-body", initial: "spellNotes"}).bind(this.element);
        
        if(this.isEditable) {

            //let sheet = this.sheet;

            // Set Listener for Item Events

            //this.element.querySelectorAll(".addSpellVariants").forEach(action => { action.addEventListener("click", (e) => LsFunction.addSpellVariants(sheet, e)) });
            //this.element.querySelectorAll(".editSpellVariants").forEach(action => { action.addEventListener("click", (e) => LsFunction.editSpellVariants(sheet, e)) });
            //this.element.querySelectorAll(".deleteSpellVariants").forEach(action => { action.addEventListener("click", (e) => LsFunction.deleteSpellVariants(sheet, e)) });
            //this.element.querySelectorAll(".editBookItem").forEach(action => { action.addEventListener("click", (e) => LsFunction.editItemBookDetails(sheet, e)) });
            //this.element.querySelectorAll(".openBookItem").forEach(action => { action.addEventListener("click", (e) => LsFunction.openItemPage(sheet, e, 2)) });
            //this.element.querySelectorAll(".openBookNote").forEach(action => { action.addEventListener("click", (e) => LsFunction.openItemPage(sheet, e, 3)) });

            // Set Listener for Active Effects

            //this.element.querySelectorAll(".effect-control").forEach(action => { action.addEventListener("click", (e) => LsFunction._onEffectControl(e)) });
        }

        if(this.element.className.includes("bookItem")) {

            console.log(this)
            //this.element.parent().addClass("bookSection");
            //this.element.parent().parent().addClass("bookItemSheet");
            //this.element.parent().parent().children("header").addClass("bookHeader");
        }
    }

    getSelectTalents() {

        let response = {};

        response["meele"] = "GDSA.charactersheet.-meeleSkills";

        for (const element of CONFIG.Templates.talents.meele) response[element.name] = element.system.tale.DE;

        response["none2"] = "";
        response["range"] = "GDSA.charactersheet.-rangeSkills";

        for (const element of CONFIG.Templates.talents.range) response[element.name] = element.system.tale.DE;

        response["none3"] = "";
        response["none4"] = "GDSA.charactersheet.-bodySkills";

        for (const element of CONFIG.Templates.talents.body) response[element.name] = element.system.tale.DE;

        response["none5"] = "";
        response["none6"] = "GDSA.charactersheet.-socialSkills";

        for (const element of CONFIG.Templates.talents.social) response[element.name] = element.system.tale.DE;

        response["none7"] = "";
        response["none8"] = "GDSA.charactersheet.-natureSkills";

        for (const element of CONFIG.Templates.talents.nature) response[element.name] = element.system.tale.DE;

        response["none9"] = "";
        response["none10"] = "GDSA.charactersheet.-knowledgeSkills";

        for (const element of CONFIG.Templates.talents.knowledge) response[element.name] = element.system.tale.DE;

        response["none11"] = "";
        response["none12"] = "GDSA.charactersheet.-craftSkills";

        for (const element of CONFIG.Templates.talents.craft) response[element.name] = element.system.tale.DE;

        response["none13"] = "";
        response["none14"] = "GDSA.charactersheet.-addSkills";
        response["Liturgiekenntnis"] = "GDSA.charactersheet.wonderskill";
        response["Geister rufen"] = "GDSA.ritualSkills.gruf";
        response["Geister bannen"] = "GDSA.ritualSkills.gban";
        response["Geister binden"] = "GDSA.ritualSkills.gbin";
        response["Geister aufnehmen"] = "GDSA.ritualSkills.gauf";

        return response;
    }

    getSelectTalentsN() {

        let response = {};

        response["meele"] = "GDSA.charactersheet.-meeleSkills";

        for (const element of CONFIG.Templates.talents.meele) response[element.name] = element.system.tale.DE;

        response["none2"] = "";
        response["range"] = "GDSA.charactersheet.-rangeSkills";

        for (const element of CONFIG.Templates.talents.range) response[element.name] = element.system.tale.DE;

        response["none3"] = "";
        response["none4"] = "GDSA.charactersheet.-bodySkills";

        for (const element of CONFIG.Templates.talents.body) response[element.name] = element.system.tale.DE;

        response["none5"] = "";
        response["none6"] = "GDSA.charactersheet.-socialSkills";

        for (const element of CONFIG.Templates.talents.social) response[element.name] = element.system.tale.DE;

        response["none7"] = "";
        response["none8"] = "GDSA.charactersheet.-natureSkills";

        for (const element of CONFIG.Templates.talents.nature) response[element.name] = element.system.tale.DE;

        response["none9"] = "";
        response["none10"] = "GDSA.charactersheet.-knowledgeSkills";

        for (const element of CONFIG.Templates.talents.knowledge) response[element.name] = element.system.tale.DE;

        response["none11"] = "";
        response["none12"] = "GDSA.charactersheet.-craftSkills";

        for (const element of CONFIG.Templates.talents.craft) response[element.name] = element.system.tale.DE;

        return response;
    }

    getSelectTraits() {

        let response = {};

        response["none1"] = "GDSA.templates.-sfGeneral";

        for (const element of CONFIG.Templates.traits.general) response[element.name] = element.system.tale.DE;

        response["none2"] = "";
        response["none3"] = "GDSA.templates.-sfCombat";

        for (const element of CONFIG.Templates.traits.combat) response[element.name] = element.system.tale.DE;

        response["none4"] = "";
        response["none5"] = "GDSA.templates.-sfMagic";

        for (const element of CONFIG.Templates.traits.magic) response[element.name] = element.system.tale.DE;

        response["none6"] = "";
        response["none7"] = "GDSA.templates.-sfHoly";

        for (const element of CONFIG.Templates.traits.holy) response[element.name] = element.system.tale.DE;


        return response;
    }

    getWeaponRange(system) {

        if(this.item.type != "Gegenstand") return {};
        if(this.item.system.type != "range") return {};

        let response = {};

        response["2"]   = game.i18n.localize("GDSA.chat.rangeOpt.till") + " " + system.weapon.range1 + " " + game.i18n.localize("GDSA.chat.rangeOpt.meter");
        response["0"]   = game.i18n.localize("GDSA.chat.rangeOpt.till") + " " + system.weapon.range2 + " " + game.i18n.localize("GDSA.chat.rangeOpt.meter");
        response["-4"]  = game.i18n.localize("GDSA.chat.rangeOpt.till") + " " + system.weapon.range3 + " " + game.i18n.localize("GDSA.chat.rangeOpt.meter");
        response["-8"]  = game.i18n.localize("GDSA.chat.rangeOpt.till") + " " + system.weapon.range4 + " " + game.i18n.localize("GDSA.chat.rangeOpt.meter");
        response["-12"] = game.i18n.localize("GDSA.chat.rangeOpt.till") + " " + system.weapon.range5 + " " + game.i18n.localize("GDSA.chat.rangeOpt.meter");

        return response;
    }
    
    _onEffectControl(event) {

        event.preventDefault();

        const owner = this.item;
        const a = event.currentTarget;
        const li = a.closest("li");
        const effect = li?.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;

        switch (a.dataset.action) {

            case "create":
                console.log(game);
                return owner.createEmbeddedDocuments("ActiveEffect", [{
                label: "New Effect",
                icon: "icons/svg/aura.svg",
                origin: owner.uuid,
                disabled: true
                }]);

            case "edit":
                return effect.sheet.render(true);

            case "delete":
                return effect.delete();
        }
    }
}