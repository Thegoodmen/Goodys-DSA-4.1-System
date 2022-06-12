export default class GDSAItemSheet extends ItemSheet {

    get template() {

        return `systems/GDSA/templates/sheets/${this.item.data.type}-sheet.html`
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

        return sheetData;
    }
}