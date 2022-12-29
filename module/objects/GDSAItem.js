export default class GDSAItem extends Item {

    prepareDerivedData() {

        super.prepareDerivedData();

        const system = this.system;

        system.loc = "GDSA.system." + this.type;
    }
}