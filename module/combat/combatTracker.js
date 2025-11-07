import * as LsFunction from "../listenerFunctions.js"

export default class GDSACombatTracker extends foundry.applications.sidebar.tabs.CombatTracker {

    /** @override */
    static PARTS = {
        header: {
            template: "systems/gdsa/templates/ressources/combat/header.hbs"
        },
        tracker: {
            template: "systems/gdsa/templates/ressources/combat/tracker.hbs"
        },
        footer: {
            template: "systems/gdsa/templates/ressources/combat/footer.hbs"
        }
    };

        /** @override */
    _onRender(context, options) {

        super._onRender(context, options);

        let sheet = this._prepareContext();

        this.element.querySelectorAll(".toggelAT").forEach(action => { action.addEventListener("click", (e) => LsFunction.onATCountToggel(sheet, e)) });
        this.element.querySelectorAll(".toggelPA").forEach(action => { action.addEventListener("click", (e) => LsFunction.onPACountToggel(sheet, e)) });
        this.element.querySelectorAll(".orient").forEach(action => { action.addEventListener("click", (e) => LsFunction.doOrientation(e)) });
    }

    activateListeners(html) {

        super.activateListeners(html);

        html.find(".toggelAT").click(LsFunction.onATCountToggel.bind(this, this.getData()));
        html.find(".toggelPA").click(LsFunction.onPACountToggel.bind(this, this.getData()));
        html.find(".orient").click(LsFunction.doOrientation.bind(this, this.getData()));
    }
}