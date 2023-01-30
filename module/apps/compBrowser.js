
export default class GDSACompBrowser extends FormApplication {

    constructor(object={}, options={}, type="") {
        
        super(options);
        this.object = object;
        this.form = null;
        this.filepickers = [];
        this.editors = {};
        this.type = type;

        this.searchString = "";
        this.trait = "";
        this.rep = "";
        this.v0 = false;
        this.v1 = false;
        this.v2 = false;
        this.v3 = false;
        this.v4 = false;
        this.v5 = false;
        this.v6 = false;
        this.kA = false;
        this.kB = false;
        this.kC = false;
        this.kD = false;
        this.kE = false;
        this.kF = false;
        this.sFocus = 0;
    }

    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            classes: ["GDSA", "browser"],
            template: "systems/GDSA/templates/apps/compBrowser.hbs",
            width: 800,
            height: "auto",
            title: this.type,
            closeOnSubmit: false
        });
    }

    async getData() {

        const baseData = super.getData();

        let sheetData = {

            // Set General Values

            config: CONFIG.GDSA
        }

        // Keep Selection
        
        sheetData.search = this.searchString;
        sheetData.trait = this.trait;
        sheetData.rep = this.rep;
        sheetData.v0 = this.v0;
        sheetData.v1 = this.v1;
        sheetData.v2 = this.v2;
        sheetData.v3 = this.v3;
        sheetData.v4 = this.v4;
        sheetData.v5 = this.v5;
        sheetData.v6 = this.v6;
        sheetData.kA = this.kA;
        sheetData.kB = this.kB;
        sheetData.kC = this.kC;
        sheetData.kD = this.kD;
        sheetData.kE = this.kE;
        sheetData.kF = this.kF;

        // Fill Browser with Items of definied Type

        let itemArray = [];
        let sortedArray = [];

        switch (this.type) {

            case "spell":
                itemArray = await game.packs.get("world.zauber").getDocuments();
                break;
        
            default:
                break;
        }

        for(let spell of itemArray) {

            if(this.searchString != null && spell.name.toLowerCase().includes(this.searchString.toLowerCase())) sortedArray.push(spell);
        }

        sheetData.items = sortedArray;

        return sheetData;
    }

    activateListeners(html) {

        html.find(".browserInput").click(this.objectClicked.bind(this));
        html.find(".browserMenuInput").change(this.objectClicked.bind(this));
        // html.find(".searchbar").keyup(this.objectSearch.bind(this));

        super.activateListeners(html);
    }

    _updateObject(html) {
        
        this.searchString = html.target[0].value;
        this.trait = html.target[1].value;
        this.rep = html.target[2].value;
        this.v0 = html.target[3].checked;
        this.v1 = html.target[4].checked;
        this.v2 = html.target[5].checked;
        this.v3 = html.target[6].checked;
        this.v4 = html.target[7].checked;
        this.v5 = html.target[8].checked;
        this.v6 = html.target[9].checked;
        this.kA = html.target[10].checked;
        this.kB = html.target[11].checked;
        this.kC = html.target[12].checked;
        this.kD = html.target[13].checked;
        this.kE = html.target[14].checked;
        this.kF = html.target[15].checked;
        
        this.render();
    }

    objectClicked(event) {
        
        this.searchString = event.currentTarget.form[0].value;
        this.trait = event.currentTarget.form[1].value;
        this.rep = event.currentTarget.form[2].value;
        this.v0 = event.currentTarget.form[3].checked;
        this.v1 = event.currentTarget.form[4].checked;
        this.v2 = event.currentTarget.form[5].checked;
        this.v3 = event.currentTarget.form[6].checked;
        this.v4 = event.currentTarget.form[7].checked;
        this.v5 = event.currentTarget.form[8].checked;
        this.v6 = event.currentTarget.form[9].checked;
        this.kA = event.currentTarget.form[10].checked;
        this.kB = event.currentTarget.form[11].checked;
        this.kC = event.currentTarget.form[12].checked;
        this.kD = event.currentTarget.form[13].checked;
        this.kE = event.currentTarget.form[14].checked;
        this.kF = event.currentTarget.form[15].checked;
        
        this.render();

    }

    async objectSearch(event) {

        const sel = event.target.selectionStart;
        const input = document.getElementById('menuSearch');
        
        this.searchString = event.currentTarget.form[0].value;
        this.trait = event.currentTarget.form[1].value;
        this.rep = event.currentTarget.form[2].value;
        this.v0 = event.currentTarget.form[3].checked;
        this.v1 = event.currentTarget.form[4].checked;
        this.v2 = event.currentTarget.form[5].checked;
        this.v3 = event.currentTarget.form[6].checked;
        this.v4 = event.currentTarget.form[7].checked;
        this.v5 = event.currentTarget.form[8].checked;
        this.v6 = event.currentTarget.form[9].checked;
        this.kA = event.currentTarget.form[10].checked;
        this.kB = event.currentTarget.form[11].checked;
        this.kC = event.currentTarget.form[12].checked;
        this.kD = event.currentTarget.form[13].checked;
        this.kE = event.currentTarget.form[14].checked;
        this.kF = event.currentTarget.form[15].checked;
        this.sFocus = sel;
        
        let newDoc = await this.render();
        console.log(document);
        newDoc.element[0].ownerDocument.getElementById('menuSearch').setSelectionRange(2,2);
    }
}
