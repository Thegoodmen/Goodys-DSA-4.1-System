import * as Util from "../../Util.js";
import * as LSFunction from "../listenerFunctions.js"

export default class GDSAActor extends Actor {



    prepareData() {

        // If later something needs to be added preprocessing Data for the Actor

        super.prepareData();
    }

    prepareDerivedData() {

        const actorData = this.system;

        // Add diffrent Handlers for diffrent Actor Subtypes

        if (this.type == 'PlayerCharakter') this._preparePlayerCharacterData(actorData);
        if (this.type == 'NonPlayer') this._prepareNPCData(actorData);
    }

    _prepareNPCData(actorData) {

        // Set highest Parry for automated Combat

        let weapons = Util.getTemplateItems(this, "npcw",false);
        actorData.mainPA = 0;
        for(let weapon of weapons) if(weapon.system.pa > actorData.mainPA) actorData.mainPA = weapon.system.pa;
        actorData.Dogde = actorData.mainPA;

        // Set the Number of Attacks and Parrys per Round

        let traits = Util.getItems(this, "generalTrait", false);
        actorData.ATCount = 1;
        actorData.PACount = 1;
        let at1 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.twohanded2")})[0];
        let at2 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.deathleft")})[0];
        let pa1 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.schildII")})[0];
        let pa2 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.parryW2")})[0];

        if(at1 != null || at2) actorData.ATCount = 2;
        if(pa1 != null || pa2) actorData.PACount = 2;

        let mat = traits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.mAttacks"))})[0];
        let mpa = traits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.mParrys"))})[0];

        if(mat != null) actorData.ATCount = parseInt(mat.name.charAt(0));
        if(mpa != null) actorData.PACount = parseInt(mpa.name.charAt(0));
    }

    _preparePlayerCharacterData(actorData) {

        // Calculation of Base Stats

        this._setCharacterValues(actorData);
    }

    async _setCharacterValues(data) {

        // Calculate AT, PA and FK Base Values and store them in the Actor

        let MU = parseInt(this.isNull(data.MU.value) ? 0 : parseInt(data.MU.value)) + parseInt(this.isNull(data.MU.temp) ? 0 : parseInt(data.MU.temp)) + parseInt(data.MU.baseAnti);
        let KL = parseInt(this.isNull(data.KL.value) ? 0 : parseInt(data.KL.value)) + parseInt(this.isNull(data.KL.temp) ? 0 : parseInt(data.KL.temp)) + parseInt(data.KL.baseAnti);
        let IN = parseInt(this.isNull(data.IN.value) ? 0 : parseInt(data.IN.value)) + parseInt(this.isNull(data.IN.temp) ? 0 : parseInt(data.IN.temp)) + parseInt(data.IN.baseAnti);
        let CH = parseInt(this.isNull(data.CH.value) ? 0 : parseInt(data.CH.value)) + parseInt(this.isNull(data.CH.temp) ? 0 : parseInt(data.CH.temp)) + parseInt(data.CH.baseAnti);
        let FF = parseInt(this.isNull(data.FF.value) ? 0 : parseInt(data.FF.value)) + parseInt(this.isNull(data.FF.temp) ? 0 : parseInt(data.FF.temp)) + parseInt(data.FF.baseAnti);
        let GE = parseInt(this.isNull(data.GE.value) ? 0 : parseInt(data.GE.value)) + parseInt(this.isNull(data.GE.temp) ? 0 : parseInt(data.GE.temp)) + parseInt(data.GE.baseAnti);
        let KO = parseInt(this.isNull(data.KO.value) ? 0 : parseInt(data.KO.value)) + parseInt(this.isNull(data.KO.temp) ? 0 : parseInt(data.KO.temp)) + parseInt(data.KO.baseAnti);
        let KK = parseInt(this.isNull(data.KK.value) ? 0 : parseInt(data.KK.value)) + parseInt(this.isNull(data.KK.temp) ? 0 : parseInt(data.KK.temp)) + parseInt(data.KK.baseAnti);
        
        data.ATBasis.value = Math.round((MU + GE + KK) / 5);
        data.PABasis.value = Math.round((IN + GE + KK) / 5);
        data.FKBasis.value = Math.round((IN + FF + KK) / 5);


        // Calculates the LeP, AuP, AsP, KaP and MR maximums Values

        let mtraits = Util.getTemplateSF(this, "magic", false);
        let advantages = Util.getTemplateItems(this, "adva");
        let flaws = Util.getTemplateItems(this, "flaw");
        let gds = mtraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.starbody")})[0];
        let asma = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.asma")})[0];
        let ausd = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.ausd")})[0];
        let hole = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.hole")})[0];
        let homr = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.homr")})[0];
        let nias = flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.nias")})[0];
        let nile = flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.nile")})[0];
        let nimr = flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.nimr")})[0];
        let mag1 = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.mag1")})[0];
        let mag2 = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.mag2")})[0];
        let mag3 = advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.mag3")})[0];

        data.LeP.max = Math.round(((KO + KO + KK) / 2) + parseInt(data.LePInfo.modi) + parseInt(data.LePInfo.buy));
        if(hole != null) data.LeP.max += hole.system.trait.value;
        if(nile != null) data.LeP.max -= nile.system.trait.value;
        data.AuP.max = Math.round(((MU + KO + GE) / 2) + parseInt(data.AuPInfo.modi) + parseInt(data.AuPInfo.buy));
        if(ausd != null) data.AuP.max += ausd.system.trait.value;

        if (mag1 != null || mag2 != null || mag3 != null) {
            if(gds != null) data.AsP.max = Math.round(((MU + IN + CH + CH) / 2) + parseInt(data.AsPInfo.modi) + parseInt(data.AsPInfo.buy));
            else data.AsP.max = Math.round(((MU + IN + CH) / 2) + parseInt(data.AsPInfo.modi) + parseInt(data.AsPInfo.buy));
            if(asma != null) data.AsP.max += asma.system.trait.value;
            if(nias != null) data.AsP.max -= nias.system.trait.value;
            if(mag1 != null) data.AsP.max -= 6;
            if(mag2 != null) data.AsP.max += 6;
            if(mag3 != null) data.AsP.max += 12;
        } else data.AsP.max =  0;

        if (data.KaPInfo.modi > 0) data.KaP.max = Math.round(parseInt(data.KaPInfo.modi));
        else data.KaP.max = 0;

        data.MRBase = Math.round(((MU + KL + KO) / 5) + parseInt(data.MR.modi) + parseInt(data.MR.buy));
        if(homr != null) data.MR.value += homr.system.trait.value;
        if(nimr != null) data.MR.value -= nimr.system.trait.value;
        if(mag2 != null) data.MR.value += 1;
        if(mag3 != null) data.MR.value += 2;

        // Set up Number of Attacks in Combat

        let traits = Util.getTemplateSF(this, "combat", false);
        this.combatTraits = Util.getTemplateSF(this, "combat", false);
        this.equiptMelee = Util.getItem(this, "melee", true);
        this.generalTraits = Util.getTemplateSF(this, "general", false);
        data.ATCount = 1;
        data.PACount = 1;
        let at1 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.twohanded2")})[0];
        let at2 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.deathleft")})[0];
        let pa1 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.schildII")})[0];
        let pa2 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.parryW2")})[0];

        if(at1 != null || at2 != null ) data.ATCount = 2;
        if(pa1 != null || pa2!= null ) data.PACount = 2;

        // Set highest Parry for automated Combat

        let weapons = Util.getItem(this, "melee", false);
        let shields = Util.getItem(this, "shild", false);

        data.mainPA = 0;

        for(let weapon of weapons) {

            if(CONFIG.INIT) continue;

            let skill = weapon.system.weapon.skill;
            let weap = weapon.system.weapon.type;

            // Calculate PAValue

            let skillItem = {};

            for (let i = 0; i < CONFIG.Templates.talents.all.length; i++) 
                if (CONFIG.Templates.talents.all[i]._id === skill) 
                    skillItem = CONFIG.Templates.talents.all[i];

            let PAValue = 0;
            if(data.skill[skillItem.name])
            PAValue = data.skill[skillItem.name].def;

            let wm = weapon.system.weapon["WM-DEF"];
            PAValue += wm;

            // Has Specilazation ?

            let Spezi = Util.getTemplateSF(this, "general", false).filter(function(item) {return item.name.includes(weap)});
            if(Spezi.length > 0) PAValue += 1;

            if(PAValue > data.mainPA) data.mainPA = PAValue;
        }

        for(let shield of shields) {

            if(CONFIG.INIT) continue;

            // Get Shield    

            let type = shield.system.weapon.parType;
            let wm = shield.system.weapon["WM-DEF"];

            // Calculate Parry Value

            let PABasis = parseInt(data.PABasis.value);
            PABasis += parseInt(wm);
            
            // Do Shield or ParryWeapon Weapon

            if(type === "shild")  PABasis = await LSFunction.getShildPABasis(this, PABasis);
            else  PABasis = await LSFunction.getParryWeaponPABasis(this, wm);

            if(PABasis > data.mainPA) data.mainPA = PABasis;
        }

        // Advanced Inventory System

        let itemArray = Util.getItem(this, "item", false);
        let mainArray = [];
        let mainTypes = {meeleW: true, rangeW: true, shield: true, armour: true};

        mainTypes = Object.assign(mainTypes, data.invState);
          
        // for (const [key, value] of Object.entries(data.invState)) { mainTypes[key] = value; }

        for(let item of itemArray) {

            if(mainArray.filter(function(a) {return a.type === item.system.item.category}).length != 1) {
                
                mainArray.push({
                    type: item.system.item.category,
                    weight: (parseInt(item.system.weight) * parseInt(item.system.quantity)),
                    value: (parseInt(item.system.value) * parseInt(item.system.quantity)),
                    item: [item]
                });

                if (!(item.system.item.category in mainTypes)) mainTypes[item.system.item.category] = true;
            
            } else {

                mainArray.filter(function(a) {return a.type === item.system.item.category})[0].weight += (parseInt(item.system.weight) * parseInt(item.system.quantity));
                mainArray.filter(function(a) {return a.type === item.system.item.category})[0].value += (parseInt(item.system.value) * parseInt(item.system.quantity));
                mainArray.filter(function(a) {return a.type === item.system.item.category})[0].item.push(item);

            }
        }

        data.generalItems = mainArray;
        data.generalItemType = mainTypes;
    }

    async setStatData(type, value) {

        // Methode to update Ressources directly

        switch (type) {

            case "LeP":
                this.update({ "system.LeP.value": value });
                break;

            case "AsP":
                this.update({ "system.AsP.value": value });    
                break;

            case "KaP":
                this.update({ "system.KaP.value": value });        
                break;

            case "AuP":
                this.update({ "system.AuP.value": value });        
                break;

            case "MU":
                this.update({ "system.MU.value": value });        
                break;

            case "KL":
                this.update({ "system.KL.value": value });        
                break;

            case "IN":
                this.update({ "system.IN.value": value });        
                break;

            case "CH":
                this.update({ "system.CH.value": value });        
                break;

            case "FF":
                this.update({ "system.FF.value": value });        
                break;

            case "GE":
                this.update({ "system.GE.value": value });        
                break;

            case "KO":
                this.update({ "system.KO.value": value });        
                break;

            case "KK":
                this.update({ "system.KK.value": value });        
                break;

            case "LePMod":
                this.update({ "system.LePInfo.modi": value });        
                break;

            case "LePBuy":
                this.update({ "system.LePInfo.buy": value });        
                break;

            case "AuPMod":
                this.update({ "system.AuPInfo.modi": value });        
                break;
    
            case "AuPBuy":
                this.update({ "system.AuPInfo.buy": value });        
                break;

            case "AsPMod":
                this.update({ "system.AsPInfo.modi": value });        
                break;
    
            case "AsPBuy":
                this.update({ "system.AsPInfo.buy": value });        
                break;
    
            case "KaPMod":
                this.update({ "system.KaPInfo.modi": value });        
                break;
        
            case "KaPBuy":
                this.update({ "system.KaPInfo.buy": value });        
                break;
    
            case "MRMod":
                this.update({ "system.MR.modi": value });        
                break;
            
            case "MRBuy":
                this.update({ "system.MR.buy": value });        
                break;
            
            case "AP":
                this.update({ "system.AP.value": value });        
                break;
            
            case "APFree":
                this.update({ "system.APFree.value": value });
                break;
            
            case "mirTemp":
                this.update({ "system.mirTemp": value });
                break;

            case "allSkills":
                await this.update({ "system.allSkills": value});
                break;

            case "mirakelTemp":
                await this.update({ "system.mirikal.cus": value});
                break;
        }
    }

    async hideMenu() { await this.update({ "system.hideMenu": true});}
    async showMenu() { await this.update({ "system.hideMenu": false});}

    setCharData(object) {

        // Methode to update Character Infos

        this.update({ "system.race": object.race });
        this.update({ "system.kulture": object.culture });
        this.update({ "system.profession": object.profession });
        this.update({ "system.gender": object.gender });
        this.update({ "system.age": object.age });
        this.update({ "system.height": object.size });
        this.update({ "system.weight": object.weight });
        this.update({ "system.SO": object.social });        
    }

    updateBuffValue(name, value) {

        let buffpath = "system.buffs." + name;
        this.update({ [buffpath]: value });
    }

    setNote(note) {

        // Methode to update Character Note

        this.update({ "system.note": note});
    }

    setRitSkills(object) {

        // Methode to update Character Ritual Skills

        this.update({ "system.skill.ritalch": object.ritalch });
        this.update({ "system.skill.ritderw": object.ritderw });
        this.update({ "system.skill.ritdrui": object.ritdrui });
        this.update({ "system.skill.ritdurr": object.ritdurr });
        this.update({ "system.skill.ritgban": object.ritgban });
        this.update({ "system.skill.ritgruf": object.ritgruf });
        this.update({ "system.skill.ritgauf": object.ritgauf });
        this.update({ "system.skill.ritgbin": object.ritgbin });
        this.update({ "system.skill.ritgeod": object.ritgeod });
        this.update({ "system.skill.ritgild": object.ritgild });
        this.update({ "system.skill.rithexe": object.rithexe });
        this.update({ "system.skill.ritkris": object.ritkris });
        this.update({ "system.skill.ritpetr": object.ritpetr });
        this.update({ "system.skill.ritscha": object.ritscha });
        this.update({ "system.skill.rittanz": object.rittanz });
        this.update({ "system.skill.ritzibi": object.ritzibi });        
    }

    addLogEntry(Entry) {

        // Add a Log Entry to the Charakter

        let log = this.system.log;
        log.push(Entry);
        this.update({ "system.log": log});
    }

    setWound(zone, wound) {

        // Methode to update Wound Count directly

        switch (zone) {
            case "head":
            case "Kopf":
                this.update({ "system.wp.head": wound});
                break;
            case "chest":
            case "Brust / Rücken":
                this.update({ "system.wp.chest": wound});
                break;
            case "tummy":
            case "Bauch":
                this.update({ "system.wp.tummy": wound});
                break;
            case "lArm":
            case "Linker Arm":
                this.update({ "system.wp.lArm": wound});
                break;
            case "rArm":
            case "Rechter Arm":
                this.update({ "system.wp.rArm": wound});
                break;
            case "lLeg":
            case "Linkes Bein":
                this.update({ "system.wp.lLeg": wound});
                break;
            case "rLeg":
            case "Rechtes Bein":
                this.update({ "system.wp.rLeg": wound});
                break;    
            default:
                this.update({ "system.wp.all": wound});
                break;
        }
    }

    setInventorySystem(type, state) {

        let keyVar = "system.invState." + type;

        this.update({ [keyVar]: state });

    }

    isNull(string) { return (string === null)}
}