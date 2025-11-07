import { GDSA } from "../config.js";

const api = foundry.applications.api;

export default class GDSAGMScreen extends api.HandlebarsApplicationMixin(api.ApplicationV2) {

    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["GDSA", "gmscreen"],
        actions: {},
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        position: {
            width: 800,
            height: "auto",
        }
    }

    static PARTS = {

        main: { template: "systems/gdsa/templates/apps/gmscreen.hbs" }
    }

    get title() {

        return "GDSA GM Screen";
    }

    /** @override */
    _configureRenderOptions(options) {

        super._configureRenderOptions(options);
        options.parts = ["main"];
    }

    static Initialize(html) {
        
        html.find('#gdsa-options').append($(
            `<button data-action="gm-screen">
                <i class="fas fa-book-open"></i>
                Open GM Window
            </button>`));

        html.find('button[data-action="gm-screen"').on("click", _ => new GDSAGMScreen().render(true));
    }
}