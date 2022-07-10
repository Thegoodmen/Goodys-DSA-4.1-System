import * as Dice from "../dice.js";
import * as Dialog from "../dialog.js";
import * as Util from "../../Util.js";

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

    itemContextMenu = [{

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

        sheetData.generalTraits = baseData.items.filter(function(item) {return item.type == "generalTrait"});
        sheetData.combatTraits = baseData.items.filter(function(item) {return item.type == "combatTrait"});

        sheetData.generals = baseData.items.filter(function(item) {return item.type == "generals"});
        sheetData.meleeweapons = baseData.items.filter(function(item) {return item.type == "melee-weapons"});
        sheetData.rangeweapons = baseData.items.filter(function(item) {return item.type == "range-weapons"});
        sheetData.shields = baseData.items.filter(function(item) {return item.type == "shields"});
        sheetData.armour = baseData.items.filter(function(item) {return item.type == "armour"});

        sheetData.equiptMelee = sheetData.meleeweapons.filter(function(item) {return item.data.worn == true});
        sheetData.equiptRange = sheetData.rangeweapons.filter(function(item) {return item.data.worn == true});
        sheetData.equiptShield = sheetData.shields.filter(function(item) {return item.data.worn == true});
        sheetData.equiptArmour = sheetData.armour.filter(function(item) {return item.data.worn == true});

        sheetData.inventar = sheetData.meleeweapons.concat(sheetData.rangeweapons, sheetData.shields, sheetData.shields, sheetData.armour, sheetData.generals);

        sheetData = this.calculateValues(sheetData);

        return sheetData;
    }

    activateListeners(html) {

        if(this.isEditable) {

            html.find(".item-create").click(this._onItemCreate.bind(this));
            html.find(".item-edit").click(this._onItemEdit.bind(this));

            html.find(".flaw-roll").click(this._onFlawRoll.bind(this));
            html.find(".stat-roll").click(this._onStatRoll.bind(this));
            html.find(".skill-roll").click(this._onSkillRoll.bind(this));
            html.find(".dogde-roll").click(this._onDogdeRoll.bind(this));
            html.find(".attack-roll").click(this._onAttackRoll.bind(this));
            html.find(".parry-roll").click(this._onParryRoll.bind(this));
            html.find(".damage-roll").click(this._onDMGRoll.bind(this));

            html.find(".getDMG").click(this.getDMG.bind(this));
            html.find(".getHeal").click(this.getHeal.bind(this));
            html.find(".doReg").click(this.doReg.bind(this));

            html.find(".stat-plus").click(this._addStat.bind(this));
            html.find(".stat-minus").click(this._decreaseStat.bind(this));
            html.find(".invItem").click(this._openItem.bind(this));
            html.find(".item-remove").click(this._onRemoveEquip.bind(this));
            html.find(".item-apply").click(this._onEquipEquip.bind(this));
            html.find(".change-money").click(this._onMoneyChange.bind(this));

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

    _onRemoveEquip(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".invItem").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.data.data.worn = false;
        item.update({ "data.worn": false });
        this.render(); 
    }

    _onEquipEquip(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".invItem").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.data.data.worn = true;
        item.update({ "data.worn": true });
        this.render(); 
    }

    _onFlawRoll(event) {
        
        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;

        let flawvalue = element.closest(".item").dataset.flawvalue;
        let flawname = element.closest(".item").dataset.flawname;

        Dice.flawCheck(flawname, flawvalue, actor);
    }

    _onStatRoll(event) {

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

    _onSkillRoll(event) {

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

    async _onAttackRoll(event) {

        event.preventDefault();

        let actor = this.actor;
        let element = event.currentTarget;
        let itemId = element.closest("tr").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let Modi = 0;

        let skill = item.data.data.skill;
        let weapon = item.data.data.type;

        let ATKValue = Util.getSkillATKValue(actor, skill);

        let isSpezi = this.getData().generalTraits.filter(function(item) {return item.name.includes(weapon)});
        if(isSpezi.length > 0) ATKValue += 1;

        if(item.data.type == "melee-weapons") {
        
            let ATKInfo = await Dialog.GetAtkInfo();
            if (ATKInfo.cancelled) return;
            let advan = ATKInfo.advan;
            let disad = ATKInfo.disad;
            let wucht = ATKInfo.wucht;
            let finte = ATKInfo.finte;
            let hammer = ATKInfo.hamme;
            let sturm = ATKInfo.sturm;

            Modi += advan;
            Modi -= disad;
            Modi -= wucht;
            Modi -= finte;
            if(hammer) Modi -= 8;
            if(sturm) Modi -= 4;

            Dice.ATKCheck(ATKValue, Modi, actor, wucht, finte, hammer, sturm);

        } else {

            let ATKInfo = await Dialog.GetRangeAtkInfo();
            if (ATKInfo.cancelled) return;
            let disad = parseInt(ATKInfo.disad);
            let bonus = parseInt(ATKInfo.bonus);
            let aimed = parseInt(ATKInfo.aimed);
            let winds = parseInt(ATKInfo.winds);
            let sight = parseInt(ATKInfo.sight);
            let movem = parseInt(ATKInfo.movem);
            let dista = parseInt(ATKInfo.dista);
            let hidea = parseInt(ATKInfo.hidea);
            let sizeX = parseInt(ATKInfo.sizeX);
            if(aimed > 4) aimed = 4;

            Modi -= disad;
            Modi -= bonus;
            Modi += aimed;
            Modi += winds;
            Modi += sight;
            Modi += movem;
            Modi += dista;
            Modi += hidea;
            Modi += sizeX;

            Dice.ATKCheck(ATKValue, Modi, actor, bonus, 0, false, false);
        }
    }

    async _onParryRoll(event) {

        event.preventDefault();

        let actor = this.actor;
        let element = event.currentTarget;
        let itemId = element.closest("tr").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let Modi = 0;

        let skill = item.data.data.skill;
        let weapon = item.data.data.type;

        let PAValue = Util.getSkillPAValue(actor, skill);

        let isSpezi = this.getData().generalTraits.filter(function(item) {return item.name.includes(weapon)});
        if(isSpezi.length > 0) PAValue += 1;

        let PAInfo = await Dialog.GetSkillCheckOptions();
        if (PAInfo.cancelled) return;
        let advan = parseInt(PAInfo.advantage);
        let disad = parseInt(PAInfo.disadvantage);

        Modi -= disad;
        Modi += advan;

        Dice.PACheck(PAValue, Modi, actor);
    }

    async _onDMGRoll(event) {

        event.preventDefault();

        let actor = this.actor;
        let element = event.currentTarget;
        let itemId = element.closest("tr").dataset.itemId;
        let item = this.actor.items.get(itemId);

        let dmgString = item.data.data.damage;

        Dice.DMGRoll(dmgString, actor);
    }

    _onDogdeRoll(event) {

        event.preventDefault();

        let actor = this.actor;
        let statvalue = actor.data.data.Dogde;
        let statname = game.i18n.localize("GDSA.charactersheet.dogde");        

        Dice.statCheck(statname,statvalue, 0, actor);
    }

    async getDMG(event) {

        event.preventDefault();
        const template = "systems/GDSA/templates/chat/HPInfo.hbs";

        let DMGInfo = await Dialog.GetDMGInfo();
        let actor = this.actor;
        let data = actor.data.data;

        if (DMGInfo.cancelled) return;
        let DMGValue = DMGInfo.value;

        data.LeP.value -= parseInt(DMGValue);
        this.actor.update({ "data.LeP.value": data.LeP.value });
        this.render();

        let templateContext = {
            actor: actor,
            value: DMGValue,
            heal: false,
            dmg: true}; 
    
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            roll: true,
            content: await renderTemplate(template, templateContext)};
        
        ChatMessage.create(chatData);  
    }

    async getHeal(event) {

        event.preventDefault();
        const template = "systems/GDSA/templates/chat/HPInfo.hbs";

        let HealInfo = await Dialog.GetHealInfo();
        let actor = this.actor;
        let data = actor.data.data;

        if (HealInfo.cancelled) return;
        let HealValue = HealInfo.value;

        if (data.LeP.max < (data.LeP.value + parseInt(HealValue)))
            HealValue = data.LeP.max - data.LeP.value;

        data.LeP.value += parseInt(HealValue);
        this.actor.update({ "data.LeP.value": data.LeP.value });
        this.render();

        let templateContext = {
            actor: actor,
            value: HealValue,
            heal: true,
            dmg: false}; 
    
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            roll: true,
            content: await renderTemplate(template, templateContext)};
        
        ChatMessage.create(chatData);  
    }

    async _onMoneyChange(event) {

        event.preventDefault();
        const template = "systems/GDSA/templates/chat/MoneyInfo.hbs";

        let MonyInfo = await Dialog.GetMoneyOptions();
        if (MonyInfo.cancelled) return;
        let operation = MonyInfo.operation;
        let gold = parseInt(MonyInfo.gold);
        let silver = parseInt(MonyInfo.silver);
        let copper = parseInt(MonyInfo.copper);
        let nikel = parseInt(MonyInfo.nikel);
        let isAdd = false;

        let actor = this.actor;
        let data = actor.data.data;

        if (operation == "add") {
        
            data.money.gold += gold;
            data.money.silver += silver;
            data.money.copper += copper;
            data.money.nickel += nikel;
            isAdd = true;

        } else {
        
            data.money.gold -= gold;
            data.money.silver -= silver;
            data.money.copper -= copper;
            data.money.nickel -= nikel;
            isAdd = false;
        }

        this.actor.update({ "data.money.gold": data.money.gold });
        this.actor.update({ "data.money.silver": data.money.silver });
        this.actor.update({ "data.money.copper": data.money.copper });
        this.actor.update({ "data.money.nickel": data.money.nickel });
        await this.render();
        
        let templateContext = {
            actor: actor,
            add: isAdd,
            gold: gold,
            silver: silver,
            copper: copper,
            nikel: nikel}; 
    
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            roll: true,
            content: await renderTemplate(template, templateContext)};
        
        ChatMessage.create(chatData);  
    }

    async doReg(event) {

        event.preventDefault();

        let regtLeP = 0;
        let regtAsP = 0;
        let regDialog = await Dialog.GetRegInfo();
        if (regDialog.cancelled) return;
        let regModi = parseInt(regDialog.value);

        let HPBonus = 0 + regModi;
        let APBonus = 0 + regModi;
        let magActive = false;
        let actor = this.actor;
        let data = actor.data.data;
        let advantages = actor.items.filter(function(item) {return item.type == "advantage"});
        let flaws = actor.items.filter(function(item) {return item.type == "flaw"});
        let magicTraits = actor.items.filter(function(item) {return item.type == "magicTrait"});
        let statValueKO = data.KO.value;
        let statValueIN = data.IN.value;
        let statValueKL = data.KL.value;

        let checkFastHeal = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.fastHeal")})[0];
        let checkAstralHeal = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.astralHeal")})[0];
        let checkBadReg = flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.badReg")})[0];
        let checkAstralBlock = flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.astralBlock")})[0];
        let checkRegI = magicTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.regI")})[0];
        let checkRegII = magicTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.regII")})[0];
        let checkRegIII = magicTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.regIII")})[0];

        if(checkFastHeal != null) HPBonus += parseInt(checkFastHeal.data.data.value);
        if(checkBadReg != null) HPBonus -= 1;
        if(checkAstralHeal != null) APBonus += parseInt(checkAstralHeal.data.data.value);
        if(checkAstralBlock != null) APBonus -= 1;
        if(checkRegI != null) APBonus += 1;
        if(checkRegII != null) APBonus += 1;
        if(checkRegIII != null) APBonus = (statValueKL / 5) + 3;
        if(checkRegIII != null) magActive = true;

        if(data.LeP.max != data.LeP.value)
            regtLeP = await Dice.doLePReg(actor, HPBonus, statValueKO);
        
        if(data.AsP.max > 0 && data.AsP.max != data.AsP.value)
            regtAsP = await Dice.doAsPReg(actor, APBonus,statValueIN, magActive);

        this.actor.data.data.LeP.value += parseInt(regtLeP);
        this.actor.data.data.AsP.value += parseInt(regtAsP);
        this.actor.update({ "data.LeP.value": data.LeP.value });
        this.actor.update({ "data.AsP.value": data.AsP.value });
        this.render(); 
    }

    async _addStat(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;

        let statType = element.closest(".item").dataset.stattype;
        
        if (actor.data.data[statType].value >= actor.data.data[statType].max) return;

        actor.data.data[statType].value++;
        let valueString = "data." + statType + ".value";
        this.actor.update({ valueString: actor.data.data[statType].value });
        this.render();
    }

    async _decreaseStat(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let actor = this.actor;

        let statType = element.closest(".item").dataset.stattype;
        
        if (statType != "LeP" && actor.data.data[statType].value == 0) return;

        actor.data.data[statType].value--;
        let valueString = "data." + statType + ".value";
        this.actor.update({ valueString: actor.data.data[statType].value });
        this.render();
    }

    _openItem(event) {

        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".invItem").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }

    _onSortItem(event, itemData) {

        const source = this.actor.items.get(itemData._id);

        switch(source.data.type) {

            case "generals":
            case "melee-weapons":
            case "range-weapons":
            case "shields":
            case "armour":

                const siblings = this.actor.items.filter(i => {
                    return (i.data._id !== source.data._id);
                });

                const dropTarget = event.target.closest(".item");
                const targetId = dropTarget ? dropTarget.dataset.itemId : null;
                const target = siblings.find(s => s.data._id === targetId);
                const sortUpdates = SortingHelpers.performIntegerSort(source, { target: target, siblings });
                
                const updateData = sortUpdates.map(u => {
                    const update = u.update;
                    update._id = u.target.data._id;
                    return update;
                });
                
                return this.actor.updateEmbeddedDocuments("Item", updateData);

            default:
                return super._onSortItem(event, itemData);
        }
    }

    calculateValues(sheetData) {
        
        let advantages = sheetData.items.filter(function(item) {return item.type == "advantage"});
        let flaws = sheetData.items.filter(function(item) {return item.type == "flaw"});
        let combatTraits = sheetData.items.filter(function(item) {return item.type == "combatTrait"});

        let BE = parseInt(sheetData.data.BE);

        // Geschwindigkeit

        let checkFlink = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.flink")})[0];
        let checkUnsporty = flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.unsporty")})[0];
        let checkSmall = flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.small")})[0];
        let checkDwarf = flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.dwarf")})[0];
        
        sheetData.data.GS.modi = 0;

        if(checkFlink != null) sheetData.data.GS.modi = checkFlink.data.data.value;
        if(parseInt(sheetData.data.GE.value) >= 16) sheetData.data.GS.modi += 1;
        if(checkUnsporty != null) sheetData.data.GS.modi -= 1;
        if(parseInt(sheetData.data.GE.value) <= 10) sheetData.data.GS.modi -= 1;
        if(checkSmall != null) sheetData.data.GS.modi -= 1;
        if(checkDwarf != null) sheetData.data.GS.modi -= 2;
        if(checkDwarf != null) sheetData.data.GS.modi -= (BE / 2);
        else sheetData.data.GS.modi -= BE;

        sheetData.data.GS.value = 8 + parseInt(sheetData.data.GS.modi);

        // INI Basis

        sheetData.data.INIBasis.value = sheetData.data.INIBasis.value - sheetData.data.INIBasis.modi + BE; // - sheetData.data.equipINI;
        sheetData.data.INIBasis.modi = 0;

        let checkKampfge = combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.kampfge")})[0];
        let checkKampfre = combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.kampfre")})[0];
        let checkKlingen = combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.klingen")})[0];

        if(checkKampfge != null) sheetData.data.INIBasis.modi += 2;
        if(checkKampfre != null) sheetData.data.INIBasis.modi += 4;

        sheetData.data.INIBasis.value = sheetData.data.INIBasis.value + sheetData.data.INIBasis.modi - BE; // + sheetData.data.equipINI;

        sheetData.data.INIDice = "1d6";
        if(checkKlingen != null) sheetData.data.INIDice = "2d6";

        // Wundschwelle

        let checkEisern = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.iron")})[0];
        let checkGlass = flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.glass")})[0];

        sheetData.data.WS = parseInt(sheetData.data.KO.value) / 2;
        if(checkEisern != null) sheetData.data.WS += 2;
        if(checkGlass != null) sheetData.data.WS -= 2;

        // Ausweichen
        
        let checkDogde1 = combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.dogde1")})[0];
        let checkDogde2 = combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.dogde2")})[0];
        let checkDogde3 = combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.dogde3")})[0];

        sheetData.data.Dogde = parseInt(sheetData.data.PABasis.value);
        if(checkUnsporty != null) sheetData.data.Dogde -= 1;
        if(checkDogde1 != null) sheetData.data.Dogde += 3;
        if(checkDogde2 != null) sheetData.data.Dogde += 3;
        if(checkDogde3 != null) sheetData.data.Dogde += 3;
        
        // Simple Values / Grapical Values

        sheetData.data.AP.spent = parseInt(sheetData.data.AP.value) - parseInt(sheetData.data.AP.free);        
        sheetData.data.LeP.prozent = 100 / parseInt(sheetData.data.LeP.max) * parseInt(sheetData.data.LeP.value);

        return sheetData;
    }
}