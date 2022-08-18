export default class GDSAActor extends Actor {

    prepareData() {

        super.prepareData();
    }
    
    prepareBaseData() {

    }

    prepareDerivedData() {

        const actorData = this.data;
        const data = actorData.data;

        this._prepareCharacterData(actorData);
    }

    _prepareCharacterData(actorData) {

        if (actorData.type != 'PlayerCharakter') return;
      
        const data = actorData.data;

        this._setCharacterValues(data);
        
        this._setAnsitzjagd(data);
        this._setPirschjagd(data);
        this._setNahrungsuchen(data);
        this._setKraeutersuchen(data);
        this._setWachehalten(data); 
    }

    _setAnsitzjagd(data) {

        data.skill.ansi = 0;

        let wild = parseInt(data.skill.wild);
        let tier = parseInt(data.skill.tier);
        let faer = parseInt(data.skill.faer);
        let sich = parseInt(data.skill.sich);
        
        let armb = parseInt((data.skill.armb.value == null ? 0 : data.skill.armb.value));
        let blas = parseInt((data.skill.blas.value == null ? 0 : data.skill.blas.value));
        let bogn = parseInt((data.skill.bogn.value == null ? 0 : data.skill.bogn.value));
        let disk = parseInt((data.skill.disk.value == null ? 0 : data.skill.disk.value));
        let sleu = parseInt((data.skill.sleu.value == null ? 0 : data.skill.sleu.value));
        let wbei = parseInt((data.skill.wbei.value == null ? 0 : data.skill.wbei.value));
        let wmes = parseInt((data.skill.wmes.value == null ? 0 : data.skill.wmes.value));
        let wspe = parseInt((data.skill.wspe.value == null ? 0 : data.skill.wspe.value));

        let array = [armb,blas,bogn,disk,sleu,wbei,wmes,wspe];
        let ftaw = 0;


        for (var x of array) {
            if(x > ftaw)
                ftaw = x;
        }

        let tempInt = (wild + tier + faer + sich + ftaw) / 5;

        if(tempInt > (wild * 2))
            tempInt = wild * 2;

        if(tempInt > (tier * 2))
            tempInt = tier * 2;

        if(tempInt > (faer * 2))
            tempInt = faer * 2;

        if(tempInt > (sich * 2))
            tempInt = sich * 2;
    
        if(tempInt > (ftaw * 2))
            tempInt = ftaw * 2;

        data.skill.ansi = Math.round(tempInt);  
    }

    _setPirschjagd(data) {

        data.skill.pirs = 0;

        let wild = parseInt(data.skill.wild);
        let tier = parseInt(data.skill.tier);
        let faer = parseInt(data.skill.faer);
        let schl = parseInt(data.skill.schl);
        
        let armb = parseInt((data.skill.armb.value == null ? 0 : data.skill.armb.value));
        let blas = parseInt((data.skill.blas.value == null ? 0 : data.skill.blas.value));
        let bogn = parseInt((data.skill.bogn.value == null ? 0 : data.skill.bogn.value));
        let disk = parseInt((data.skill.disk.value == null ? 0 : data.skill.disk.value));
        let sleu = parseInt((data.skill.sleu.value == null ? 0 : data.skill.sleu.value));
        let wbei = parseInt((data.skill.wbei.value == null ? 0 : data.skill.wbei.value));
        let wmes = parseInt((data.skill.wmes.value == null ? 0 : data.skill.wmes.value));
        let wspe = parseInt((data.skill.wspe.value == null ? 0 : data.skill.wspe.value));

        let array = [armb,blas,bogn,disk,sleu,wbei,wmes,wspe];
        let ftaw = 0;


        for (var x of array) {
            if(x > ftaw)
                ftaw = x;
        }

        let tempInt = (wild + tier + faer + schl + ftaw) / 5;

        if(tempInt > (wild * 2))
            tempInt = wild * 2;

        if(tempInt > (tier * 2))
            tempInt = tier * 2;

        if(tempInt > (faer * 2))
            tempInt = faer * 2;

        if(tempInt > (schl * 2))
            tempInt = schl * 2;
    
        if(tempInt > (ftaw * 2))
            tempInt = ftaw * 2;

        data.skill.pirs = Math.round(tempInt);  
    }

    _setNahrungsuchen(data) {

        data.skill.nahr = 0;

        let sinn = parseInt(data.skill.sinn);
        let wild = parseInt(data.skill.wild);
        let pfla = parseInt(data.skill.pfla);
        let tempInt = (sinn + wild + pfla) / 3;

        if(tempInt > (sinn * 2))
            tempInt = sinn * 2;

        if(tempInt > (wild * 2))
            tempInt = wild * 2;

        if(tempInt > (pfla * 2))
            tempInt = pfla * 2;

        data.skill.nahr = Math.round(tempInt);
    }

    _setKraeutersuchen(data) {

        data.skill.krau = 0;

        let sinn = parseInt(data.skill.sinn);
        let wild = parseInt(data.skill.wild);
        let pfla = parseInt(data.skill.pfla);
        let tempInt = (sinn + wild + pfla) / 3;

        if(tempInt > (sinn * 2))
            tempInt = sinn * 2;

        if(tempInt > (wild * 2))
            tempInt = wild * 2;

        if(tempInt > (pfla * 2))
            tempInt = pfla * 2;

        data.skill.krau = Math.round(tempInt);
    }

    _setWachehalten(data) {

        data.skill.wach = 0;

        let sinn =  parseInt(data.skill.sinn);
        let selbst = parseInt(data.skill.selb);
        let tempInt = (selbst + sinn + sinn) / 3;

        if(tempInt > (sinn * 2))
            tempInt = sinn * 2;

        if(tempInt > (selbst * 2))
            tempInt = selbst * 2;

        data.skill.wach = Math.round(tempInt);
    }

    _setCharacterValues(data) {

        data.GS.value = 8 + parseInt(data.GS.modi);

        data.ATBasis.value = Math.round(((parseInt(data.MU.value) + parseInt(data.GE.value) + parseInt(data.KK.value)) / 5));
        data.PABasis.value = Math.round(((parseInt(data.IN.value) + parseInt(data.GE.value) + parseInt(data.KK.value)) / 5));
        data.FKBasis.value = Math.round(((parseInt(data.IN.value) + parseInt(data.FF.value) + parseInt(data.KK.value)) / 5));

        data.INIBasis.value = Math.round(((parseInt(data.MU.value) + parseInt(data.MU.value) + parseInt(data.IN.value) + parseInt(data.GE.value)) / 5) + parseInt(data.INIBasis.modi));

        data.LeP.max = Math.round(((parseInt(data.KO.value) + parseInt(data.KO.value) + parseInt(data.KK.value)) / 2) + parseInt(data.LePInfo.modi));
        data.AuP.max = Math.round(((parseInt(data.MU.value) + parseInt(data.KO.value) + parseInt(data.GE.value)) / 2) + parseInt(data.AuPInfo.modi));

        if (data.AsPInfo.modi != 0)
            data.AsP.max = Math.round(((parseInt(data.MU.value) + parseInt(data.IN.value) + parseInt(data.CH.value)) / 2) + parseInt(data.AsPInfo.modi));
        else
            data.AsP.max =  0;

        if (data.KaPInfo.modi > 0)
            data.KaP.max = Math.round(parseInt(data.KaPInfo.modi));
        else
            data.KaP.max = 0;

        data.MR.value = Math.round(((parseInt(data.MU.value) + parseInt(data.KL.value) + parseInt(data.KO.value)) / 5) + parseInt(data.MR.modi));

        data.WS =  Math.round(parseInt(data.KO.value) / 2);
        data.Dogde = parseInt(data.PABasis.value);
    }
}