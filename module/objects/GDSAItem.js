export default class GDSAItem extends Item {

    prepareDerivedData() {

        super.prepareDerivedData();

        const system = this.system;

        system.loc = "GDSA.system." + this.type;
    }

    /* -------------------------------------------- */
    /*  Importing and Exporting - Overwrite         */
    /* -------------------------------------------- */

    /**
     * Present a Dialog form to create a new Document of this type.
     * Choose a name and a type from a select menu of types.
     * @param {object} data              Initial data with which to populate the creation form
     * @param {object} [context={}]      Additional context options or dialog positioning options
     * @param {Document|null} [context.parent]   A parent document within which the created Document should belong
     * @param {string|null} [context.pack]       A compendium pack within which the Document should be created
     * @returns {Promise<Document|null>} A Promise which resolves to the created Document, or null if the dialog was
     *                                   closed.
     * @memberof ClientDocumentMixin
     */

    static async createDialog(data={}, {parent=null, pack=null, ...options}={}) {

        // Collect data

        const documentName = this.metadata.name;
        const types = game.documentTypes[documentName].filter(t => t !== CONST.BASE_DOCUMENT_TYPE);
        let collection;

        if (!parent)
          if (pack) collection = game.packs.get(pack);
          else collection = game.collections.get(documentName);


        const folders = collection?._formatFolderSelectOptions() ?? [];
        const label = game.i18n.localize(this.metadata.label);
        const title = game.i18n.localize("GDSA.system.creaNewItem");

        const context = {

            name: game.i18n.localize("GDSA.system.newItem"),

            folder: data.folder,
            folders,
            hasFolders: folders.length >= 1,

            type: data.type || CONFIG[documentName]?.defaultType || types[0],
            types: types.reduce((obj, t) => {
              const label = CONFIG[documentName]?.typeLabels?.[t] ?? t;
              obj[t] = game.i18n.has(label) ? game.i18n.localize(label) : t;
              return obj;
            }, {}),
            hasTypes: types.length > 1
        }

        const html = await renderTemplate("systems/gdsa/templates/ressources/item-create.hbs", context);
  
        return Dialog.prompt({

            title: title,
            content: html,
            label: title,

            callback: html => {
                const form = html[0].querySelector("form");
                const fd = new FormDataExtended(form);
                foundry.utils.mergeObject(data, fd.object, {inplace: true});
                if (!data.folder) delete data.folder;
                if (types.length === 1) data.type = types[0];
                if (!data.name?.trim()) data.name = this.defaultName();
                return this.create(data, {parent, pack, renderSheet: true});
            },
            
            rejectClose: false,
            options
        });
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
}