export default class BuffHud extends Application {

    constructor(options) {

        super(options);

        this.selectedEffects = false;

        this.viewed = null;
        this.render(true);

    }

    static get defaultOptions() {

        const options = super.defaultOptions;
        options.id = "buff-hud";
        options.template = "systems/gdsa/templates/apps/buff-hud.hbs";
        options.popOut = false;

        return options;

    }

    async getData(options) {
        
        let data = {

            ownEffects: game.user.character?.effects.contents
        }
        
        if(this.selectedEffects) data.selEffects = this.selectedEffects.document.actor.effects.contents;

        return data;
    }

    activateListeners(html) {

        super.activateListeners(html);

    }

    setSelectedEffects(effects) {

        this.selectedEffects = effects;

    }
  
}