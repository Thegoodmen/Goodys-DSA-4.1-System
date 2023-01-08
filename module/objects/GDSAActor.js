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

        let wild = parseInt(data.skill.wild);
        let tier = parseInt(data.skill.tier);
        let faer = parseInt(data.skill.faer);
        let sich = parseInt(data.skill.sich);

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

        let wild = parseInt(data.skill.wild);
        let tier = parseInt(data.skill.tier);
        let faer = parseInt(data.skill.faer);
        let schl = parseInt(data.skill.schl);

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

        let sinn = parseInt(data.skill.sinn);
        let wild = parseInt(data.skill.wild);
        let pfla = parseInt(data.skill.pfla);

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

        let sinn = parseInt(data.skill.sinn);
        let wild = parseInt(data.skill.wild);
        let pfla = parseInt(data.skill.pfla);

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

        let sinn =  parseInt(data.skill.sinn);
        let selbst = parseInt(data.skill.selb);

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

        data.LeP.max = Math.round(((parseInt(data.KO.value) + parseInt(data.KO.value) + parseInt(data.KK.value)) / 2) + parseInt(data.LePInfo.modi));
        data.AuP.max = Math.round(((parseInt(data.MU.value) + parseInt(data.KO.value) + parseInt(data.GE.value)) / 2) + parseInt(data.AuPInfo.modi));

        if (data.AsPInfo.modi != 0) data.AsP.max = Math.round(((parseInt(data.MU.value) + parseInt(data.IN.value) + parseInt(data.CH.value)) / 2) + parseInt(data.AsPInfo.modi));
        else data.AsP.max =  0;

        if (data.KaPInfo.modi > 0) data.KaP.max = Math.round(parseInt(data.KaPInfo.modi));
        else data.KaP.max = 0;

        data.MR.value = Math.round(((parseInt(data.MU.value) + parseInt(data.KL.value) + parseInt(data.KO.value)) / 5) + parseInt(data.MR.modi));

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

        if(at1 != null || at2) data.ATCount = 2;
        if(pa1 != null || pa2) data.PACount = 2;

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
        }
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