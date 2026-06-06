import GDSAItemSheet from "./GDSAItemSheet.js";

export default class GDSASpellSheet extends GDSAItemSheet {

    /** @override */
    static DEFAULT_OPTIONS = {

        tag: "form",
        classes: ["GDSA", "sheet", "itemSheet"],
        actions: {
            postGM: this.postGM,
            postAll: this.postAll
        },
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        position: {
            width: 935,
            height: 630
        }
    }
    
    /** @override */
    static PARTS = {

        main: { template: "systems/gdsa/templates/sheets/items/spell-sheet.hbs"},
    }

    /** @override */
    get title() {

        return this.item.name;
    }

    /** @override */
    _configureRenderOptions(options) {

        super._configureRenderOptions(options);

        options.parts = ["main"]
    }

    static async postGM() {

        if (this.tempType === "trai") {

            // Send Chat Message
    
            let chatModel = { 

                user: game.user.id, 
                speaker: null, 
                type: 1,
                content: await foundry.applications.handlebars.renderTemplate("systems/gdsa/templates/chat/chatTemplate/sf-Post.hbs", this.item)
            };

            let message = await ChatMessage.create(chatModel);
            
            message.setFlag('gdsa', 'isCollapsable', true);
        }

    }

    static async postAll() {

        if (this.tempType === "trai") {

            // Send Chat Message
    
            let chatModel = { 

                user: game.user.id, 
                speaker: null, 
                content: await foundry.applications.handlebars.renderTemplate("systems/gdsa/templates/chat/chatTemplate/sf-Post.hbs", this.item)
            };

            let message = await ChatMessage.create(chatModel);
            
            message.setFlag('gdsa', 'isCollapsable', true);
        }
    }
}