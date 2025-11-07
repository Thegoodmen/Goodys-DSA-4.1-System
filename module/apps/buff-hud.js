const api = foundry.applications.hud;

export default class BuffHud extends api.HeadsUpDisplayContainer {

    constructor(options) {

        super(options);

        this.selectedEffects = false;

        this.viewed = null;
        this.render(true);
    }

    static DEFAULT_OPTIONS = {
        id: "buff-hud",
        classes: ["GDSA", "buffHUD"],
        actions: {},
        position: {
            width: 0,
            height: 0,
            zIndex: 200 
        }
    }

    /** @override */
    async _renderHTML(_context, _options) {

        const template = "systems/gdsa/templates/apps/buff-hud.hbs";
        const html = await foundry.applications.handlebars.renderTemplate(template, this._prepareContext(_options));
        
        return html;
    }

    /** @override */
    async _prepareContext(options) {

        const baseData = await super._prepareContext();

        let context = {
            
            ownEffects: game.user.character?.effects.contents
        }

        if(this.selectedEffects) context.selEffects = this.selectedEffects.document.actor.effects.contents;

        return context;
    }

    /** Custom Functions */
    setSelectedEffects(effects) {

        this.selectedEffects = effects;
    }  
}