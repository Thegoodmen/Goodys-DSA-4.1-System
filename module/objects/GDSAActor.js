export default class GDSAActor extends Actor {

    prepareData() {

        // If later something needs to be added preprocessing Data for the Actor

        super.prepareData();
    }

    prepareDerivedData() {

        const actorData = this.system;

        // Add diffrent Handlers for diffrent Actor Subtypes

        if (this.type == 'PlayerCharakter') this._preparePlayerCharacterData(actorData);
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

    _setCharacterValues(data) {

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
}