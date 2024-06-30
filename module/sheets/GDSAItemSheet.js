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

        return foundry.utils.mergeObject(super.defaultOptions, {

            width: 466,
            resizable: false,
            tabs: [ {navSelector: ".spell-tabs", contentSelector: ".spell-body", initial: "spellDetails"}],
            classes: ["GDSA", "sheet", "itemSheet"]
        });
    }

    get template() {

        if(this.item.type === "Template") return `systems/gdsa/templates/sheets/template/${this.item.type}-${this.item.system.type}-sheet.hbs`
        if(this.item.type === "Gegenstand") return `systems/gdsa/templates/sheets/gegenstand/${this.item.type}-${this.item.system.type}-sheet.hbs`
        if(this.item.type === "objektRitual") return `systems/gdsa/templates/sheets/ritual/${this.item.type}-${this.item.system.type}-sheet.hbs`

        return `systems/gdsa/templates/sheets/${this.item.type}-sheet.hbs`
    }

    async getData() {

        const baseData = super.getData();

        let sheetData = {

            owner: this.item.isOwner,
            editable: this.isEditable,
            item: baseData.item,
            system: baseData.item.system,
            config: CONFIG.GDSA,
            template: CONFIG.Templates,
            templates: CONFIG.Templates,
            selTalents: this.getSelectTalents(),
            selTraits: this.getSelectTraits(),
            selTalentN: this.getSelectTalentsN(),
            setWeaponR: this.getWeaponRange(baseData.item.system)
        };

        if(sheetData.system.value > 0) {

            let length = 0;
            let value = sheetData.system.value;

            sheetData.system.gold = 0;
            sheetData.system.silver = value[length-3];
            sheetData.system.copper = value[length-2];
            sheetData.system.nickel = value[length-1];
        }

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

        if(this.isEditable) {

            let sheet = this.sheet;

            // Set Listener for Item Events

            html.find(".item-close").click(LsFunction.onItemClose.bind(this));
            html.find(".addSpellVariants").click(LsFunction.addSpellVariants.bind(this, sheet));
            html.find(".editSpellVariants").click(LsFunction.editSpellVariants.bind(this, sheet));
            html.find(".deleteSpellVariants").click(LsFunction.deleteSpellVariants.bind(this,sheet));
            html.find(".note-gm-post").click(LsFunction.noteGMPost.bind(this, sheet));
            html.find(".note-all-post").click(LsFunction.noteAllPost.bind(this, sheet));
        }

        super.activateListeners(html);
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

        let response = {};

        response["2"]   = game.i18n.localize("GDSA.chat.rangeOpt.till") + system.weapon.range1 + game.i18n.localize("GDSA.chat.rangeOpt.meter");
        response["0"]   = game.i18n.localize("GDSA.chat.rangeOpt.till") + system.weapon.range2 + game.i18n.localize("GDSA.chat.rangeOpt.meter");
        response["-4"]  = game.i18n.localize("GDSA.chat.rangeOpt.till") + system.weapon.range3 + game.i18n.localize("GDSA.chat.rangeOpt.meter");
        response["-8"]  = game.i18n.localize("GDSA.chat.rangeOpt.till") + system.weapon.range4 + game.i18n.localize("GDSA.chat.rangeOpt.meter");
        response["-12"] = game.i18n.localize("GDSA.chat.rangeOpt.till") + system.weapon.range5 + game.i18n.localize("GDSA.chat.rangeOpt.meter");

        return response;
    }

}