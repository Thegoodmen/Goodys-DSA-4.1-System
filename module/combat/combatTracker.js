import GDSACombatantConfig from "./combatantConfig.js";
import * as LsFunction from "../listenerFunctions.js"


export default class GDSACombatTracker extends CombatTracker {

    get template() {

        return "systems/GDSA/templates/ressources/combat-tracker.hbs";
    }

    _onConfigureCombatant(li) {
        
        const combatant = this.viewed.combatants.get(li.data('combatant-id'));

        new GDSACombatantConfig(combatant, {
          top: Math.min(li[0].offsetTop, window.innerHeight - 350),
          left: window.innerWidth - 720,
          width: 400,
          classes: ["GDSA", "sidebar", "cbt"]
        }).render(true);
    }

    activateListeners(html) {

      super.activateListeners(html);

      html.find(".toggelAT").click(LsFunction.onATCountToggel.bind(this, this.getData()));
      html.find(".toggelPA").click(LsFunction.onPACountToggel.bind(this, this.getData()));
    }
}