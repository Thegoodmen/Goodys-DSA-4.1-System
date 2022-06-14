export class GDSAActor extends Actor {

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

        if (actorData.type !== 'character') return;
      
        const data = actorData.data;
      
      }
}