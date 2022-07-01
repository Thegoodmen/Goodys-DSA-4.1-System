import * as Dice from "../dice.js";

export default class GDSAPlayerCharakterSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/GDSA/templates/sheets/charakter-sheet.hbs",
            width: 632,
            height: 825,
            resizable: false,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "mainPage" },
                    {navSelector: ".skill-tabs", contentSelector: ".skill-body", initial: "combatSkills"}],
            classes: ["GDSA", "sheet", "characterSheet"]
        });
    }

    itemContextMenu = [
        
        {
          name: game.i18n.localize("GDSA.system.edit"),
          icon: '<i class="fas fa-edit"></i>',
          callback: element => {
            const item = this.actor.items.get(element.data("item-id"));
            item.sheet.render(true);
          }
        },
        {
          name: game.i18n.localize("GDSA.system.delete"),
          icon: '<i class="fas fa-trash"></i>',
          callback: element => {
            this.actor.deleteEmbeddedDocuments("Item", [element.data("item-id")]);
          }
        }
    ];
    

    getData() {

        const baseData = super.getData();

        let sheetData = {

            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: baseData.actor,
            data: baseData.actor.data.data,
            items: baseData.items,
            config: CONFIG.GDSA,
            isGM: game.user.isGM
        };

        const data = baseData.actor.data.data;

        sheetData.advantages = baseData.items.filter(function(item) {return item.type == "advantage"});
        sheetData.flaws = baseData.items.filter(function(item) {return item.type == "flaw"});
        sheetData.langs = baseData.items.filter(function(item) {return item.type == "langu"});
        sheetData.signs = baseData.items.filter(function(item) {return item.type == "signs"});

        //Sonderfertigkeiten Abfrage bezüglich INI
        data.INIBasis.modi = 4;

        let checkFlink = sheetData.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.flink")})[0];
        if(checkFlink != null) {

            data.GS.modi = checkFlink.data.value;
            data.GS.value = 8 + parseInt(data.GS.modi);
        } else {

            data.GS.modi = 0;
            data.GS.value = 8 + parseInt(data.GS.modi);
        }

        data.AP.spent = parseInt(data.AP.value) - parseInt(data.AP.free);

        return sheetData;
    }

    activateListeners(html) {

        if(this.isEditable) {

            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));

            html.find(".flaw-roll").click(this._onFlawRoll.bind(this));
            html.find(".stat-roll").click(this._onStatRoll.bind(this));
            html.find(".skill-roll").click(this._onSkillRoll.bind(this));

            html.find(".stat-plus").click(this._addStat.bind(this));
            html.find(".stat-minus").click(this._decreaseStat.bind(this));

            new ContextMenu(html, ".item-context", this.itemContextMenu);
        }

        if(this.actor.owner){

        }

        super.activateListeners(html);
    }

    _onItemCreate(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let itemtype = element.dataset.type;
        let name = "GDSA.charactersheet.new" + itemtype;

        let itemData = {

            name: game.i18n.localize(name),
            type: itemtype
        };

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    _onItemEdit(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
    
        item.sheet.render(true);    
    }

    _onFlawRoll(event) {
        
        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;

        let flawvalue = element.closest(".item").dataset.flawvalue;
        let flawname = element.closest(".item").dataset.flawname;

        Dice.flawCheck(flawname, flawvalue, actor);
    }

    async _onStatRoll(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;

        let statType = element.closest(".item").dataset.stattype;
        let statObjekt = actor.data.data[statType];

        let statname = game.i18n.localize("GDSA.charactersheet."+statType);
        let statvalue = statObjekt.value;
        let statmod = statObjekt.temp;        
        
        Dice.statCheck(statname,statvalue, statmod, actor);
    }

    async _onSkillRoll(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;

        let statname = element.closest(".item").dataset.statname;
        let statvalue = element.closest("tr").querySelector("[class=skillTemp]").value;
        let statone = element.closest(".item").dataset.stat_one;
        let stattwo = element.closest(".item").dataset.stat_two;
        let statthree = element.closest(".item").dataset.stat_three;
        let beMod = element.closest(".item").dataset.bemod;
        let check = this.getData().flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.goofy")})[0];
        let options = true;
        let goofy = false;
        let be = actor.data.data.BE;

        if(beMod = 0)
            be = 0;
        else if (beMod > 0)
            be = parseInt(be) * parseInt(beMod);
        else if (beMod < 0)
            be = parseInt(be) + parseInt(beMod);

        if(check != null)
            goofy = true;
        
        if (event.shiftKey)
            options = false;

        Dice.skillCheck(statname, statvalue, statone, stattwo, statthree, be, actor, options, goofy);
    }

    async _addStat(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;

        let statType = element.closest(".item").dataset.stattype;
        
        if (actor.data.data[statType].value >= actor.data.data[statType].max) return;

        actor.data.data[statType].value++;

        this.render();
    }

    async _decreaseStat(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;

        let statType = element.closest(".item").dataset.stattype;
        
        if (statType != "LeP" && actor.data.data[statType].value == 0) return;

        actor.data.data[statType].value--;

        this.render();

    }
}