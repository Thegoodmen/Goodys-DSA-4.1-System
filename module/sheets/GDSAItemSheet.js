export default class GDSAItemSheet extends ItemSheet {

    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {

            width: 466,
            height: 415,
            resizable: false,
            classes: ["GDSA", "sheet", "itemSheet"]
        });
    }

    get template() {

        return `systems/GDSA/templates/sheets/${this.item.data.type}-sheet.hbs`
    }

    getData() {

        const baseData = super.getData();

        let sheetData = {

            owner: this.item.isOwner,
            editable: this.isEditable,
            item: baseData.item,
            data: baseData.item.data.data,
            config: CONFIG.GDSA
        };

        if(sheetData.data.value > 0) {

            let length = 0;
            let value = sheetData.data.value;

            sheetData.data.gold = 0;
            sheetData.data.silver = value[length-3];
            sheetData.data.copper = value[length-2];
            sheetData.data.nickel = value[length-1];
        }

        return sheetData;
    }
}