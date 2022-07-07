import GDSACombatantConfig from "./combatantConfig.js";

export default class GDSACombatTracker extends CombatTracker {

    get template() {

        return "systems/GDSA/templates/ressources/combat-tracker.hbs";
    }

    _onConfigureCombatant(li) {
        
        const combatant = this.viewed.combatants.get(li.data('combatant-id'));

        new GDSACombatantConfig(combatant, {
          top: Math.min(li[0].offsetTop, window.innerHeight - 350),
          left: window.innerWidth - 720,
          width: 400
        }).render(true);
    }

    async getData(options) {

        const data = await super.getData(options);
    
        if (!data.hasCombat) return data;
    
        for (let [i, combatant] of data.combat.turns.entries()) {
          data.turns[i].combatType = combatant.getFlag("GDSA", "combatType")
        }

        return data;
      }
    
    

}