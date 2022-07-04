export default class GDSAItem extends Item {

    prepareDerivedData() {

        super.prepareDerivedData();

        const itemData = this.data;
        const data = itemData.data;

        data.loc = "GDSA.system." + itemData.type;
    }
}