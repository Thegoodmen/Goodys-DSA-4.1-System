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
}