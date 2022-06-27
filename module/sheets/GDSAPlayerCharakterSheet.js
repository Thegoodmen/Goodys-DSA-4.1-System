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
            config: CONFIG.GDSA
        };

        sheetData.advantages = baseData.items.filter(function(item) {return item.type == "advantage"});
        sheetData.flaws = baseData.items.filter(function(item) {return item.type == "flaw"});

        sheetData.ATBasis = baseData.data.KL;

        return sheetData;
    }

    activateListeners(html) {

        if(this.isEditable) {

            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));

            html.find(".flaw-roll").click(this._onFlawRoll.bind(this));
            html.find(".stat-roll").click(this._onStatRoll.bind(this));
            html.find(".skill-roll").click(this._onSkillRoll.bind(this));

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

        let statObjekt = actor.data.data.MU;

        //actor.sheet.render(false);

        //console.log(element.closest(".statTemp").value);

        let statname = element.closest(".item").dataset.statname;
        let statvalue = element.closest(".item").dataset.statvalue;
        let statmod = statObjekt.temp; // element.closest(".item").dataset.statmod;
        
        
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
}