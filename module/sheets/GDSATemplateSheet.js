import GDSAItemSheet from "./GDSAItemSheet.js";

export default class GDSATemplateSheet extends GDSAItemSheet {

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
            width: 467,
            height: 630
        }
    }
    
    /** @override */
    static PARTS = {

        none: { template: "systems/gdsa/templates/sheets/template/Template--sheet.hbs"},
        adva: { template: "systems/gdsa/templates/sheets/template/Template-adva-sheet.hbs"},
        affi: { template: "systems/gdsa/templates/sheets/template/Template-affi-sheet.hbs"},
        effe: { template: "systems/gdsa/templates/sheets/template/Template-effe-sheet.hbs"},
        flaw: { template: "systems/gdsa/templates/sheets/template/Template-flaw-sheet.hbs"},
        kult: { template: "systems/gdsa/templates/sheets/template/Template-kult-sheet.hbs"},
        npct: { template: "systems/gdsa/templates/sheets/template/Template-npct-sheet.hbs"},
        npcw: { template: "systems/gdsa/templates/sheets/template/Template-npcw-sheet.hbs"},
        tale: { template: "systems/gdsa/templates/sheets/template/Template-tale-sheet.hbs"},
        trai: { template: "systems/gdsa/templates/sheets/template/Template-trai-sheet.hbs"},
    }

    /** @override */
    get title() {

        return this.item.name;
    }

    /** @override */
    _configureRenderOptions(options) {

        super._configureRenderOptions(options);

        options.parts = [this.tempType]
    }

    get tempType() {

        let itemType = this.item.system.type;

        if(itemType === "s" || itemType === "") itemType = "none";

        return itemType
    }


    static test(ev) {

        console.log(this);
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