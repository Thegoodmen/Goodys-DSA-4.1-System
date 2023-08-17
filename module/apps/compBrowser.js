
export default class GDSACompBrowser extends FormApplication {

    constructor(object={}, options={}, type="", actor="") {
        
        super(options);
        this.object = object;
        this.form = null;
        this.filepickers = [];
        this.editors = {};
        this.type = type;
        this.actor = actor;
        this.itemList = [];

        this.searchString = "";
        this.trait = "none";
        this.rep = "none";
        this.skill = "none";
        this.aPlace = "none";
        this.rittSkill = "none";
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
            title: "Browser",
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
        sheetData.skill = this.skill;
        sheetData.aPlace = this.aPlace;
        sheetData.rittSkill = this.rittSkill;

        // Fill Browser with Items of definied Type

        let itemArray = [];
        let sortedArray = [];
        let selV = [];
        let nonV = true;
        let nonK = true;

        switch (this.type) {

            case "spell":

                itemArray = await game.packs.get("GDSA.spells").getDocuments();

                selV = [this.v0, this.v1, this.v2, this.v3, this.v4, this.v5, this.v6];

                if(!this.v0 && !this.v1 && !this.v2 && !this.v3 && !this.v4 && !this.v5 && !this.v6) nonV = true
                else nonV = false;
                if(!this.kA && !this.kB && !this.kC && !this.kD && !this.kE && !this.kF) nonK = true
                else nonK = false;

                for(let spell of itemArray) {

                    if(this.searchString === null || spell.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(this.trait === "none" || this.checkForTrait(spell, this.trait))
                            if(this.rep === "none" || this.checkForRep(spell, this.rep))
                                if(nonK || this.checkKomp(spell.system.komp.toUpperCase()))
                                    if(this.rep === "none" || nonV)
                                        sortedArray.push(spell);
                                    else if(this.rep === "mag" && selV[spell.system.vMag])
                                        sortedArray.push(spell);
                                    else if(this.rep === "dru" && selV[spell.system.vDru])
                                        sortedArray.push(spell);
                                    else if(this.rep === "bor" && selV[spell.system.vBor])
                                        sortedArray.push(spell);
                                    else if(this.rep === "srl" && selV[spell.system.vSrl])
                                        sortedArray.push(spell);
                                    else if(this.rep === "hex" && selV[spell.system.vHex])
                                        sortedArray.push(spell);
                                    else if(this.rep === "elf" && selV[spell.system.vElf])
                                        sortedArray.push(spell);
                                    else if(this.rep === "geo" && selV[spell.system.vGeo])
                                        sortedArray.push(spell);
                                    else if(this.rep === "ach" && selV[spell.system.vAch])
                                        sortedArray.push(spell);
                                    else if(this.rep === "sch" && selV[spell.system.vSch])
                                        sortedArray.push(spell);
                }

                break;

            case "melee-weapons":

                itemArray = await game.packs.get("GDSA.arsenal").getDocuments();
                
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.type === "melee-weapons")
                            if(this.skill === "none" || this.checkForSkill(item, this.skill))
                                sortedArray.push(item)
                }

                break;

            case "range-weapons":

                itemArray = await game.packs.get("GDSA.arsenal").getDocuments();
                
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.type === "range-weapons")
                            if(this.skill === "none" || this.checkForSkill(item, this.skill))
                                sortedArray.push(item)
                }

                break;

            case "shields":

                itemArray = await game.packs.get("GDSA.arsenal").getDocuments();
            
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.type === "shields")
                            sortedArray.push(item)
                }

                break;

            case "armour":

                itemArray = await game.packs.get("GDSA.arsenal").getDocuments();
            
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.type === "armour")
                            if(this.aPlace === "none" || this.checkArmourRat(item, this.aPlace))
                                sortedArray.push(item)
                }

                break;

            case "objektRitual":
                
                itemArray = await game.packs.get("GDSA.rituale").getDocuments();
                
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.type === "objektRitual")
                            if(this.rittSkill === "none" || this.checkRitualSkill(item, this.rittSkill))
                                sortedArray.push(item)
                }

                break;
            
            default:
                break;
        }

        sheetData.type = this.type;
        sheetData.items = sortedArray.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        this.itemList = sheetData.items;

        return sheetData;
    }

    activateListeners(html) {

        html.find(".browserInput").click(this.objectClicked.bind(this));
        html.find(".browserMenuInput").change(this.objectClicked.bind(this));
        html.find(".item").dblclick(this.addItem.bind(this));
        super.activateListeners(html);
    }

    _updateObject(html) {
        
        this.searchString = html.target[0].value;

        if ( this.type === "spell"){
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
        }

        if ( this.type === "melee-weapons" || this.type === "range-weapons"){
            this.skill = html.target[1].value;
        }

        if ( this.type === "armour" ) {
            this.aPlace = html.target[1].value;
        }

        if ( this.type === "objektRitual"){
            this.rittSkill = html.target[1].value;
        }

        this.render();
    }

    objectClicked(event) {
        
        this.searchString = event.currentTarget.form[0].value;
        
        if ( this.type === "spell"){
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
        }
        if ( this.type === "melee-weapons" || this.type === "range-weapons"){
            this.skill = event.currentTarget.form[1].value;
        }

        if ( this.type === "armour" ){
            this.aPlace = event.currentTarget.form[1].value;
        }

        if ( this.type === "objektRitual"){
            this.rittSkill = event.currentTarget.form[1].value;
        }

        this.render();

    }

    async objectSearch(event) {

        const sel = event.target.selectionStart;
        const input = document.getElementById('menuSearch');
        
        this.searchString = event.currentTarget.form[0].value;
        if ( this.type === "spell"){
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
        }

        if ( this.type === "melee-weapons" || this.type === "range-weapons"){
            this.skill = event.currentTarget.form[1].value;
        }

        if ( this.type === "armour" ){
            this.aPlace = event.currentTarget.form[1].value;
        }

        if ( this.type === "objektRitual"){
            this.rittSkill = event.currentTarget.form[1].value;
        }

        let newDoc = await this.render();
        newDoc.element[0].ownerDocument.getElementById('menuSearch').setSelectionRange(2,2);
    }

    checkForTrait(spell, trait) {

        if(spell.system.trait1 === trait) return true;
        if(spell.system.trait2 === trait) return true;
        if(spell.system.trait3 === trait) return true;
        if(spell.system.trait4 === trait) return true;        
        
        return false
    }

    checkForSkill(item, skill) {

        if(item.system.skill === skill) return true;      
        
        return false
    }

    checkArmourRat(item, place) {

        if(item.system[place] > 0) return true;      
        
        return false
    }

    checkForRep(spell, rep) {

        switch (rep) {
            case "mag":
                return spell.system.vMag === null ? false : true;
            case "dru":
                return spell.system.vDru === null ? false : true;
            case "bor":
                return spell.system.vBor === null ? false : true;
            case "srl":
                return spell.system.vSrl === null ? false : true;
            case "hex":
                return spell.system.vHex === null ? false : true;
            case "elf":
                return spell.system.vElf === null ? false : true;
            case "geo":
                return spell.system.vGeo === null ? false : true;
            case "ach":
                return spell.system.vAch === null ? false : true;
            case "sch":
                return spell.system.vSch === null ? false : true;
            default:
                return true;
        }
    }

    checkRitualSkill(ritObj, rit) {

        return ritObj.system.creatTalent === rit ? true : false;

    }

    checkKomp(komp) {

        switch (komp) {
            case "A":
                return this.kA;
            case "B":
                return this.kB;
            case "C":
                return this.kC;
            case "D":
                return this.kD;
            case "E":
                return this.kE;
            case "F":
                return this.kF;
            default:
                return false;
        }
    }

    async addItem(event) {    

        // Get Element and Actor

        let element = event.currentTarget;
    
        // Get Dataset from HTML
    
        let dataset = element.closest(".item").dataset;
        let id = dataset.id;

        // Add Item to Actor

        switch (this.type) {

            case "spell":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("GDSA.spells").get(id)]);          
                break;

            case "melee-weapons":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("GDSA.arsenal").get(id)]);        
                break;

            case "range-weapons":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("GDSA.arsenal").get(id)]);        
                break;

            case "shields":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("GDSA.arsenal").get(id)]);        
                break;

            case "armour":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("GDSA.arsenal").get(id)]);        
                break;

            case "objektRitual":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("GDSA.rituale").get(id)]);        
                break;
        }
    }
}
