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

        let weapons = Util.getItems(this, "simple-weapon",false);
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
        
        // Calculation of META Talents

        this._setAnsitzjagd(actorData);
        this._setPirschjagd(actorData);
        this._setNahrungsuchen(actorData);
        this._setKraeutersuchen(actorData);
        this._setWachehalten(actorData);
    }

    _setAnsitzjagd(data) {

        // Reset the Skill Value

        data.skill.ansi = 0;

        // Retrive the Skills nessesary

        let wild = (data.skill.wild === NaN) ? 0 : parseInt(data.skill.wild);
        let tier = (data.skill.tier === NaN) ? 0 : parseInt(data.skill.tier);
        let faer = (data.skill.faer === NaN) ? 0 : parseInt(data.skill.faer);
        let sich = (data.skill.sich === NaN) ? 0 : parseInt(data.skill.sich);

        // Retrive all Range Weapons Skills
        
        let armb = parseInt((data.skill.armb.value == null ? 0 : data.skill.armb.value));
        let blas = parseInt((data.skill.blas.value == null ? 0 : data.skill.blas.value));
        let bogn = parseInt((data.skill.bogn.value == null ? 0 : data.skill.bogn.value));
        let disk = parseInt((data.skill.disk.value == null ? 0 : data.skill.disk.value));
        let sleu = parseInt((data.skill.sleu.value == null ? 0 : data.skill.sleu.value));
        let wbei = parseInt((data.skill.wbei.value == null ? 0 : data.skill.wbei.value));
        let wmes = parseInt((data.skill.wmes.value == null ? 0 : data.skill.wmes.value));
        let wspe = parseInt((data.skill.wspe.value == null ? 0 : data.skill.wspe.value));

        // Put all Range Skills in an Array and retrive the highest Skill Value

        let ftaw = 0;
        let array = [armb,blas,bogn,disk,sleu,wbei,wmes,wspe];
        for (var x of array) if(x > ftaw) ftaw = x;

        // Calculate the Value and Test against the Rule that the highest Result can be the doubeld rank involved

        let tempInt = (wild + tier + faer + sich + ftaw) / 5;

        if(tempInt > (wild * 2)) tempInt = wild * 2;
        if(tempInt > (tier * 2)) tempInt = tier * 2;
        if(tempInt > (faer * 2)) tempInt = faer * 2;
        if(tempInt > (sich * 2)) tempInt = sich * 2;
        if(tempInt > (ftaw * 2)) tempInt = ftaw * 2;

        // Save the Endresult to the Sheet

        data.skill.ansi = Math.round(tempInt);  
    }

    _setPirschjagd(data) {

        // Reset the Skill Value

        data.skill.pirs = 0;

        // Retrive the Skills nessesary

        let wild = (data.skill.wild === NaN) ? 0 : parseInt(data.skill.wild);
        let tier = (data.skill.tier === NaN) ? 0 : parseInt(data.skill.tier);
        let faer = (data.skill.faer === NaN) ? 0 : parseInt(data.skill.faer);
        let schl = (data.skill.schl === NaN) ? 0 : parseInt(data.skill.schl);

        // Retrive all Range Weapons Skills
        
        let armb = parseInt((data.skill.armb.value == null ? 0 : data.skill.armb.value));
        let blas = parseInt((data.skill.blas.value == null ? 0 : data.skill.blas.value));
        let bogn = parseInt((data.skill.bogn.value == null ? 0 : data.skill.bogn.value));
        let disk = parseInt((data.skill.disk.value == null ? 0 : data.skill.disk.value));
        let sleu = parseInt((data.skill.sleu.value == null ? 0 : data.skill.sleu.value));
        let wbei = parseInt((data.skill.wbei.value == null ? 0 : data.skill.wbei.value));
        let wmes = parseInt((data.skill.wmes.value == null ? 0 : data.skill.wmes.value));
        let wspe = parseInt((data.skill.wspe.value == null ? 0 : data.skill.wspe.value));

        // Put all Range Skills in an Array and retrive the highest Skill Value
        
        let ftaw = 0;
        let array = [armb,blas,bogn,disk,sleu,wbei,wmes,wspe];
        for (var x of array) if(x > ftaw) ftaw = x;

        // Calculate the Value and Test against the Rule that the highest Result can be the doubeld rank involved

        let tempInt = (wild + tier + faer + schl + ftaw) / 5;

        if(tempInt > (wild * 2)) tempInt = wild * 2;
        if(tempInt > (tier * 2)) tempInt = tier * 2;
        if(tempInt > (faer * 2)) tempInt = faer * 2;
        if(tempInt > (schl * 2)) tempInt = schl * 2;
        if(tempInt > (ftaw * 2)) tempInt = ftaw * 2;

        // Save the Endresult to the Sheet

        data.skill.pirs = Math.round(tempInt);  
    }

    _setNahrungsuchen(data) {

        // Reset the Skill Value

        data.skill.nahr = 0;

        // Retrive the Skills nessesary

        let sinn = (data.skill.sinn === NaN) ? 0 : parseInt(data.skill.sinn);
        let wild = (data.skill.wild === NaN) ? 0 : parseInt(data.skill.wild);
        let pfla = (data.skill.pfla === NaN) ? 0 : parseInt(data.skill.pfla);

        // Calculate the Value and Test against the Rule that the highest Result can be the doubeld rank involved

        let tempInt = (sinn + wild + pfla) / 3;

        if(tempInt > (sinn * 2)) tempInt = sinn * 2;
        if(tempInt > (wild * 2)) tempInt = wild * 2;
        if(tempInt > (pfla * 2)) tempInt = pfla * 2;

        // Save the Endresult to the Sheet

        data.skill.nahr = Math.round(tempInt);
    }

    _setKraeutersuchen(data) {

        // Reset the Skill Value

        data.skill.krau = 0;

        // Retrive the Skills nessesary

        let sinn = (data.skill.sinn === NaN) ? 0 : parseInt(data.skill.sinn);
        let wild = (data.skill.wild === NaN) ? 0 : parseInt(data.skill.wild);
        let pfla = (data.skill.pfla === NaN) ? 0 : parseInt(data.skill.pfla);

        // Calculate the Value and Test against the Rule that the highest Result can be the doubeld rank involved

        let tempInt = (sinn + wild + pfla) / 3;

        if(tempInt > (sinn * 2)) tempInt = sinn * 2;
        if(tempInt > (wild * 2)) tempInt = wild * 2;
        if(tempInt > (pfla * 2)) tempInt = pfla * 2;

        // Save the Endresult to the Sheet

        data.skill.krau = Math.round(tempInt);
    }

    _setWachehalten(data) {

        // Reset the Skill Value

        data.skill.wach = 0;

        // Retrive the Skills nessesary

        let sinn = (data.skill.sinn === NaN) ? 0 : parseInt(data.skill.sinn);
        let selbst = (data.skill.selb === NaN) ? 0 : parseInt(data.skill.selb);

        // Calculate the Value and Test against the Rule that the highest Result can be the doubeld rank involved

        let tempInt = (selbst + sinn + sinn) / 3;

        if(tempInt > (sinn * 2)) tempInt = sinn * 2;
        if(tempInt > (selbst * 2)) tempInt = selbst * 2;

        // Save the Endresult to the Sheet

        data.skill.wach = Math.round(tempInt);
    }

    async _setCharacterValues(data) {

        // Calculate AT, PA and FK Base Values and store them in the Actor

        data.ATBasis.value = Math.round(((parseInt(data.MU.value) + parseInt(data.GE.value) + parseInt(data.KK.value)) / 5));
        data.PABasis.value = Math.round(((parseInt(data.IN.value) + parseInt(data.GE.value) + parseInt(data.KK.value)) / 5));
        data.FKBasis.value = Math.round(((parseInt(data.IN.value) + parseInt(data.FF.value) + parseInt(data.KK.value)) / 5));


        // Calculates the LeP, AuP, AsP, KaP and MR maximums Values

        let mtraits = Util.getItems(this, "magicTrait", false);
        let advantages = Util.getItems(this, "advantage", false);
        let flaws = Util.getItems(this, "flaw", false);
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

        data.LeP.max = Math.round(((parseInt(data.KO.value) + parseInt(data.KO.value) + parseInt(data.KK.value)) / 2) + parseInt(data.LePInfo.modi) + parseInt(data.LePInfo.buy));
        if(hole != null) data.LeP.max += hole.system.value;
        if(nile != null) data.LeP.max -= nile.system.value;
        data.AuP.max = Math.round(((parseInt(data.MU.value) + parseInt(data.KO.value) + parseInt(data.GE.value)) / 2) + parseInt(data.AuPInfo.modi) + parseInt(data.AuPInfo.buy));
        if(ausd != null) data.AuP.max += ausd.system.value;

        if (data.AsPInfo.modi != 0) {
            if(gds != null) data.AsP.max = Math.round(((parseInt(data.MU.value) + parseInt(data.IN.value) + parseInt(data.CH.value) + parseInt(data.CH.value)) / 2) + parseInt(data.AsPInfo.modi) + parseInt(data.AsPInfo.buy));
            else data.AsP.max = Math.round(((parseInt(data.MU.value) + parseInt(data.IN.value) + parseInt(data.CH.value)) / 2) + parseInt(data.AsPInfo.modi) + parseInt(data.AsPInfo.buy));
            if(asma != null) data.AsP.max += asma.system.value;
            if(nias != null) data.AsP.max -= nias.system.value;
            if(mag1 != null) data.AsP.max -= 6;
            if(mag2 != null) data.AsP.max += 6;
            if(mag3 != null) data.AsP.max += 12;
        } else data.AsP.max =  0;

        if (data.KaPInfo.modi > 0) data.KaP.max = Math.round(parseInt(data.KaPInfo.modi));
        else data.KaP.max = 0;

        data.MR.value = Math.round(((parseInt(data.MU.value) + parseInt(data.KL.value) + parseInt(data.KO.value)) / 5) + parseInt(data.MR.modi) + parseInt(data.MR.buy));
        if(homr != null) data.MR.value += homr.system.value;
        if(nimr != null) data.MR.value -= nimr.system.value;
        if(mag2 != null) data.MR.value += 1;
        if(mag3 != null) data.MR.value += 2;

        // Set up Number of Attacks in Combat

        let traits = Util.getItems(this, "combatTrait", false);
        this.combatTraits = Util.getItems(this, "combatTrait", false);
        this.equiptMelee = Util.getItems(this, "melee-weapons", true);
        this.generalTraits = Util.getItems(this, "generalTrait", false);
        data.ATCount = 1;
        data.PACount = 1;
        let at1 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.twohanded2")})[0];
        let at2 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.deathleft")})[0];
        let pa1 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.schildII")})[0];
        let pa2 = traits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.parryW2")})[0];

        if(at1 != null || at2 != null ) data.ATCount = 2;
        if(pa1 != null || pa2!= null ) data.PACount = 2;

        // Set highest Parry for automated Combat

        let weapons = Util.getItems(this, "melee-weapons", false);
        let shields = Util.getItems(this, "shields", false);

        data.mainPA = 0;

        for(let weapon of weapons) {

            let skill = weapon.system.skill;
            let weap = weapon.system.type;

            // Calculate PAValue

            let PAValue = Util.getSkillPAValue(this, skill);
            let wm = weapon.system["WM-DEF"];
            PAValue += wm;

            // Has Specilazation ?

            let Spezi = Util.getItems(this, "generalTrait", false).filter(function(item) {return item.name.includes(weap)});
            let isSpezi= (Spezi.length > 0) ? true : false;
            if(isSpezi) PAValue += 1;

            if(PAValue > data.mainPA) data.mainPA = PAValue;
        }

        for(let shield of shields) {

            // Get Shield    

            let item = shield; 
            let type = item.system.heigt;
            let wm = item.system["WM-DEF"];

            // Calculate Parry Value

            let PABasis = parseInt(data.PABasis.value);
            PABasis += parseInt(wm);
            
            // Do Shield or ParryWeapon Weapon

            if(type != game.i18n.localize("GDSA.itemsheet.parryWeapon"))  PABasis = await LSFunction.getShildPABasis(this, PABasis);
            else  PABasis = await LSFunction.getParryWeaponPABasis(this, wm);

            if(PABasis > data.mainPA) data.mainPA = PABasis;
        }

        // Advanced Inventory System

        let itemArray = Util.getItems(this, "generals", false);
        let mainArray = [];
        let mainTypes = {meeleW: true, rangeW: true, shield: true, armour: true};

        for(let item of itemArray) {
            if(mainArray.filter(function(a) {return a.type == item.system.type}).length != 1) {
                
                mainArray.push({
                    type: item.system.type,
                    weight: parseInt(item.system.weight),
                    value: parseInt(item.system.value),
                    item: [item]
                });
                mainTypes[item.system.type] = true;}

            else {

                mainArray.filter(function(a) {return a.type == item.system.type})[0].weight += parseInt(item.system.weight);
                mainArray.filter(function(a) {return a.type == item.system.type})[0].value += parseInt(item.system.value);
                mainArray.filter(function(a) {return a.type == item.system.type})[0].item.push(item);
            }
        }

        data.generalItems = mainArray;
        data.generalItemType = mainTypes;
    }

    setStatData(type, value) {

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
        }
    }

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
}