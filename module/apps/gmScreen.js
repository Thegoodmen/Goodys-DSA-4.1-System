
export default class GDSAGMScreen extends FormApplication {

    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            classes: ["GDSA", "gmscreen"],
            template: "systems/GDSA/templates/apps/gmscreen.hbs",
            width: 800,
            height: "auto",
            title: "GDSA GM Screen"
        });
    }

    static Initialize(html) {
        
        html.find('#gdsa-options').append($(
            `<button data-action="gm-screen">
                <i class="fas fa-book-open"></i>
                Öffne GM Fenster
            </button>`));

        html.find('button[data-action="gm-screen"').on("click", _ => new GDSAGMScreen().render(true));
    }

    getData() {

        const data = super.getData();

        return data;
    }

    activateListeners(html) {

        super.activateListeners(html);
    }
}
