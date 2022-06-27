export default class GDSAActor extends Actor {

    prepareData() {

        super.prepareData();

        let actorData = this.data;
        let data = actorData.data;

        data.GS.value = 8;

        data.ATBasis = (data.MU.value + data.GE.value + data.KK.value) / 5;
        data.PABasis = (data.IN.value + data.GE.value + data.KK.value) / 5;
        data.FKBasis = (data.IN.value + data.FF.value + data.KK.value) / 5;
        data.INIBasis = (data.MU.value + data.MU.value + data.IN.value + data.GE.value) / 5;

        this._setWachehalten(data);
        
    }
    
    prepareBaseData() {

    }

    prepareDerivedData() {

        const actorData = this.data;
        const data = actorData.data;

        this._prepareCharacterData(actorData);

    }

    _prepareCharacterData(actorData) {

        if (actorData.type != 'character') return;
      
        const data = actorData.data;
      
    }

    _setWachehalten(data) {

        data.skill.wach = 0;

        let sinn =  parseInt(data.skill.sinn);
        let selbst = parseInt(data.skill.selb);
        let tempInt = (selbst + sinn + sinn) / 3;

        if(tempInt > (sinn * 2))
            tempInt = sinn;

        if(tempInt > (selbst * 2))
            tempInt = selbst;

        data.skill.wach = Math.round(tempInt);
    }
}