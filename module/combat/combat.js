export default class GDSACombat extends Combat {
    
    _sortCombatants(a, b) {

        const iniA = Number.isNumeric(a.initiative) ? a.initiative : -9999;
        const iniB = Number.isNumeric(b.initiative) ? b.initiative : -9999;

        let iniDifference = iniB - iniA;
        if(iniDifference != 0)
            return iniDifference;

        const InIBaseA = a.actor.data.data.INIBasis.value;
        const InIBaseB = b.actor.data.data.INIBasis.value;
        
        let baseDifference = InIBaseB - InIBaseA;
        if(baseDifference != 0)
            return baseDifference;
        
        const IntBaseA = a.actor.data.data.IN.value;
        const IntBaseB = b.actor.data.data.IN.value;

        let inDifference = IntBaseB - IntBaseA;
        if(inDifference != 0)
            return inDifference;
        
        return a.tokenId - b.tokenId;
    }

    _prepareCombatant(c, scene, players, settings = {}) {

        let combatant = super._prepareCombatant(c, scene, players, settings);

        return combatant;
    }

    async startCombat(){

        await this.setupTurns();
        return super.startCombat();
    }

    async rollInitiative(ids, {formula=null, updateTurn=true, messageOptions={}}={}) {

        const template = "systems/GDSA/templates/chat/ini-check.hbs";
        ids = typeof ids === "string" ? [ids] : ids;
        const currentId = this.combatant?.id;
        const updates = [];
        const messages = [];

        for ( let [i, id] of ids.entries() ) {
    
            const combatant = this.combatants.get(id);
            if ( !combatant?.isOwner ) continue;

            const roll = combatant.getInitiativeRoll(formula);
            await roll.evaluate({async: true});
            updates.push({_id: id, initiative: roll.total});   
            let templateContext = {roll: roll};

            let chatData2 = {
                user: game.user.id,
                speaker: ChatMessage.getSpeaker(combatant.actor),
                roll: roll,
                sound: CONFIG.sounds.dice,
                content: await renderTemplate(template, templateContext)
            };
          
            if ( i > 0 ) chatData2.sound = null;

            messages.push(chatData2);
        }

        if ( !updates.length ) return this;
        await this.updateEmbeddedDocuments("Combatant", updates);

        if ( updateTurn && currentId )
          await this.update({turn: this.turns.findIndex(t => t.id === currentId)});

        await ChatMessage.implementation.create(messages);  
        return this;
      }
}