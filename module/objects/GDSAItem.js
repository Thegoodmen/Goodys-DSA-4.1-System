const dialog = foundry.applications.api.DialogV2;

export default class GDSAItem extends Item {

    prepareDerivedData() {

        super.prepareDerivedData();

        const system = this.system;

        system.loc = "GDSA.system." + this.type;

        if(!this.inCompendium && this.type === "Template") {

            switch (this.system.type) {
                case "trai":
                    if (this.system.sf.type === "combat")
                        this.update({ "img": "icons/skills/melee/sword-winged-holy-orange.webp"});
                    else if (this.system.sf.type === "magic")
                        this.update({ "img": "icons/magic/symbols/circled-gem-pink.webp"});
                    else if (this.system.sf.type === "holy")
                        this.update({ "img": "icons/magic/holy/angel-wings-gray.webp"});
                    break;
                case "adva":
                    this.update({ "img": "icons/sundries/scrolls/scroll-runed-brown-purple.webp"});
                    break;
                case "flaw":
                    this.update({ "img": "icons/environment/traps/spike-skull-white-brown.webp"});
                    break;
                case "kult":
                    this.update({ "img": "icons/magic/holy/barrier-shield-winged-blue.webp"});
                    break;
                case "effe":
                    this.update({ "img": "icons/magic/symbols/runes-star-pentagon-magenta.webp"});
                    break;
                case "npct":
                    this.update({ "img": "icons/skills/trades/smithing-smelter-tongs.webp"});
                    break;
                case "npcw":
                    this.update({ "img": "icons/creatures/claws/claw-bear-paw-swipe-red.webp"});
                    break;
                default:
                    break;
            }

            if(system.tale === undefined) system.tale = {};
            system.tale.DE = this.name;
            system.tale.EN = this.name;
        }
    }

    /* -------------------------------------------- */
    /*  Importing and Exporting - Overwrite         */
    /* -------------------------------------------- */

    /**
     * Present a Dialog form to create a new Document of this type.
     * Choose a name and a type from a select menu of types.
     * @param {object} data                Document creation data
     * @param {DatabaseCreateOperation} [createOptions]  Document creation options.
     * @param {object} [options={}]        Options forwarded to DialogV2.prompt
     * @param {{id: string; name: string}[]} [options.folders] Available folders in which the new Document can be place
     * @param {string[]} [options.types]   A restriction of the selectable sub-types of the Dialog.
     * @param {string} [options.template]  A template to use for the dialog contents instead of the default.
     * @param {object} [options.context]   Additional render context to provide to the template.
     * @param {ApplicationRenderOptions} [renderOptions]  Options to forward to the document sheet's render call.
     * @returns {Promise<Document|null>}   A Promise which resolves to the created Document, or null if the dialog was
     *                                     closed.
     */
    static async createDialog(data={}, createOptions={}, { folders, types, template, context, ...dialogOptions }={}, renderOptions={}) {
      
        const applicationOptions = {
            top: "position", 
            left: "position", 
            width: "position", 
            height: "position", 
            scale: "position", 
            zIndex: "position",
            title: "window", 
            id: "", 
            classes: "", 
            jQuery: ""
        };

        for ( const [k, v] of Object.entries(createOptions) )
            if ( k in applicationOptions ) {
                
                foundry.utils.logCompatibilityWarning("The ClientDocument.createDialog signature has changed. "
                    + "It now accepts database operation options in its second parameter, "
                    + "and options for DialogV2.prompt in its third parameter.", { since: 13, until: 15, once: true });
                
                const dialogOption = applicationOptions[k];
          
                if ( dialogOption ) foundry.utils.setProperty(dialogOptions, `${dialogOption}.${k}`, v);
                else dialogOptions[k] = v;
                    
                delete createOptions[k];
            }


        const {parent, pack} = createOptions;
        const cls = this.implementation;

        // Identify allowed types
        const documentTypes = [];
        const config = CONFIG[this.documentName] ?? {};
        let defaultType = config.defaultType ?? this.schema.fields.type?.getInitialValue();
        let defaultTypeAllowed = false;
        let hasTypes = false;
        
        if ( this.TYPES.length > 1 ) {
            
            if ( types?.length === 0 ) throw new Error("The array of sub-types to restrict to must not be empty");

            // Register supported types
            for ( const type of this.TYPES ) {

                if ( (type === "base") && !this.metadata.baseTypeAllowed ) continue;
                if ( types && !types.includes(type) ) continue;

                let label = config.typeLabels?.[type];
                label = label && game.i18n.has(label) ? _loc(label) : type;
                documentTypes.push({value: type, label});
                if ( type === defaultType ) defaultTypeAllowed = true;
            }

            if ( !documentTypes.length ) throw new Error("No document types were permitted to be created");
            if ( !defaultTypeAllowed ) defaultType = documentTypes[0].value;
            // Sort alphabetically

            documentTypes.sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang));
            hasTypes = true;
        }

        // Identify destination collection
        let collection;
        if ( !parent ) {
            if ( pack ) collection = game.packs.get(pack);
            else collection = game.collections.get(this.documentName);
        }

        // Collect data
        folders ??= collection?._formatFolderSelectOptions() ?? [];
        const label = _loc(this.metadata.label);
        const title = _loc("DOCUMENT.Create", {type: label});
        const type = data.type || defaultType;

        // Render the document creation form
        template ??= "systems/gdsa/templates/ressources/item-create.hbs";
        const html = await foundry.applications.handlebars.renderTemplate(template, {

            folders, hasTypes, type,
            name: data.name || "",
            defaultName: cls.defaultName({type, parent, pack}),
            folder: data.folder,
            hasFolders: folders.length >= 1,
            types: documentTypes,
            typeHint: _loc(config.typeHints?.[type]),
            ...context
        });
        
        const content = document.createElement("div");
        content.innerHTML = html;

        // Render the confirmation dialog window
        return foundry.applications.api.DialogV2.prompt(foundry.utils.mergeObject({
            content,
            window: {title}, // FIXME: double localization
            position: {width: 360},
            render: (event, dialog) => {
            if ( !hasTypes ) return;
            dialog.element.querySelector('[name="type"]').addEventListener("change", e => {
                const type = e.target.value;
                const typeHint = dialog.element.querySelector('[name="type"]')?.closest(".form-group")?.querySelector(".hint");
                if ( typeHint ) typeHint.textContent = _loc(config.typeHints?.[type]);
                const nameInput = dialog.element.querySelector('[name="name"]');
                nameInput.placeholder = cls.defaultName({type, parent, pack});
            });
            },
            ok: {
            label: title, // FIXME: double localization
            callback: async (event, button) => {
                const fd = new foundry.applications.ux.FormDataExtended(button.form);
                foundry.utils.mergeObject(data, fd.object);
                if ( !data.folder ) delete data.folder;
                if ( !data.name?.trim() ) data.name = cls.defaultName({type: data.type, parent, pack});
                const doc = await cls.create(data, { renderSheet: false, ...createOptions });
                renderOptions.renderContext ??= `create${this.documentName}`;
                renderOptions.renderData ??= data;
                doc.sheet.render(true, renderOptions);
                return doc;
            }
            }
        }, dialogOptions));
    }

    setBookItemData(object) {

        // Methode to update Item Data

        this.update({ "name": object.name });
        this.update({ "system.value": object.value });
        this.update({ "system.weight": object.weight });
        this.update({ "system.item.storage": object.storage });
        this.update({ "system.item.category": object.category });
        this.update({ "system.item.quote": object.quote });
        this.update({ "system.item.description": object.description });
        this.update({ "system.item.prerequisits": object.prerequisits });
        this.update({ "system.item.ingame": object.ingame });
        this.update({ "system.item.special": object.special });
        this.update({ "system.type": object.type});
        this.update({ "system.itemType": object.itemType});
        this.update({ "system.item.note": object.note });
    }

    setAffilationType(type) {

        this.update({ "system.affi.type": type});
    }
}