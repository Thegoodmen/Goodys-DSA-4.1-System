import * as Dice from "../dice.js";
import * as Dialog from "../dialog.js";
import * as Util from "../../Util.js";

export default class GDSAMerchantSheet extends ActorSheet { 

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/GDSA/templates/sheets/merchant-sheet.hbs",
            width: 632,
            height: 625,
            resizable: false,
            classes: ["GDSA", "sheet", "characterSheet"]
        });
    }

    itemContextMenu = [{

            name: game.i18n.localize("GDSA.system.edit"),
            icon: '<i class="fas fa-edit" />',
            callback: element => {
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }
        },{
            name: game.i18n.localize("GDSA.system.delete"),
            icon: '<i class="fas fa-trash" />',
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

        
        sheetData.generals = baseData.items.filter(function(item) {return item.type == "generals"});
        sheetData.meleeweapons = baseData.items.filter(function(item) {return item.type == "melee-weapons"});
        sheetData.rangeweapons = baseData.items.filter(function(item) {return item.type == "range-weapons"});
        sheetData.shields = baseData.items.filter(function(item) {return item.type == "shields"});
        sheetData.armour = baseData.items.filter(function(item) {return item.type == "armour"});
        sheetData.affiliation = baseData.items.filter(function(item) {return item.type == "affiliation"});

        sheetData.inventar = sheetData.meleeweapons.concat(sheetData.rangeweapons, sheetData.shields, sheetData.armour, sheetData.generals);

        return sheetData;
    }

    activateListeners(html) {

        if(this.isEditable) {

            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));
            html.find(".buyItem").click(this.buyItem.bind(this));
            html.find(".addQuant").click(this.addQuantity.bind(this));
            html.find(".removeQuant").click(this.removeQuantity.bind(this));
            html.find(".merch-roll").click(this.merchRoll.bind(this));

            new ContextMenu(html, ".item-context", this.itemContextMenu);
        }

        if(this.actor.isOwner){

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

    buyItem(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let itemData = this.actor.items.get(itemId).data;

        let hasMoney = 0;
        let gold = game.actors.get(game.user.data.character).data.data.money.gold;
        let silver = game.actors.get(game.user.data.character).data.data.money.silver;
        let copper = game.actors.get(game.user.data.character).data.data.money.copper;
        let nickel = game.actors.get(game.user.data.character).data.data.money.nickel;
        hasMoney = nickel + (copper * 10) + (silver * 100) + (gold * 1000); 

        let price = itemData.data.value;
        let quant = itemData.data.quantity;
        if(price > hasMoney) return;
        if(quant == 0) return;

        let newMoney = parseInt(hasMoney) - parseInt(price);
        let NewGold =  Math.trunc(newMoney/1000);
        let NewSilver = Math.trunc((parseInt(newMoney) - (NewGold *1000)) / 100);
        let NewCopper = Math.trunc((parseInt(newMoney) - (NewGold *1000) - (NewSilver *100)) / 10);
        let NewNickel = Math.trunc((parseInt(newMoney) - (NewGold *1000) - (NewSilver *100) - (NewCopper *10)));

        game.actors.get(game.user.data.character).createEmbeddedDocuments("Item", [itemData]);
        game.actors.get(game.user.data.character).update({ "data.money.gold": NewGold });
        game.actors.get(game.user.data.character).update({ "data.money.silver": NewSilver });
        game.actors.get(game.user.data.character).update({ "data.money.copper": NewCopper });
        game.actors.get(game.user.data.character).update({ "data.money.nickel": NewNickel });

        quant--;
        this.render();
        this.actor.items.get(itemId).update({ "data.quantity": quant });
    }

    addQuantity(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        
        let quant = this.actor.items.get(itemId).data.data.quantity;
        quant++;
        
        this.render();
        this.actor.items.get(itemId).update({ "data.quantity": quant });
    }

    removeQuantity(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        
        let quant = this.actor.items.get(itemId).data.data.quantity;
        quant--;
        
        this.render();
        this.actor.items.get(itemId).update({ "data.quantity": quant });
    }

    merchRoll(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;

        let skill = element.closest(".merch-roll").dataset.skill;
        let statname = ""
        if (skill == "uber") statname = game.i18n.localize("GDSA.charactersheet.uberSkill");
        if (skill == "hand") statname = game.i18n.localize("GDSA.charactersheet.handSkill");

        let skillLvl = actor.data.data.skill;
        let statvalue = 1;
        let statone = 10;
        let stattwo = 10;
        let statthree = 10;

        switch(skillLvl) {

            case "1":
                statvalue = 5;
                statone = 11;
                stattwo = 11;
                statthree = 11;
                break;

            case "2":
                statvalue = 7;
                statone = 12;
                stattwo = 12;
                statthree = 12;
                break;

            case "3":
                statvalue = 12;
                statone = 14;
                stattwo = 14;
                statthree = 14;
                break;

            case "4":
                statvalue = 14;
                statone = 15;
                stattwo = 15;
                statthree = 15;
                break;

            case "5":
                statvalue = 16;
                statone = 16;
                stattwo = 16;
                statthree = 16;
                break;
        }

        let options = true;
        let goofy = false;
        let be = 0;
        
        if (event.shiftKey)
            options = false;

        Dice.skillCheck(statname, statvalue, statone, stattwo, statthree, be, actor, options, goofy);

    }
}