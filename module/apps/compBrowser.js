const api = foundry.applications.api;

export default class GDSACompBrowser extends api.HandlebarsApplicationMixin(api.ApplicationV2) {

    constructor(object={}, options={}, type="", actor="") {
        
        super(options);
        this.object = object;
        this.type = type;
        this.actor = actor;
        this.itemList = [];

        this.searchString = "";
        this.trait = "";
        this.rep = "";
        this.skill = "";
        this.aPlace = "";
        this.rittSkill = "";
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

    static DEFAULT_OPTIONS = {
        tag: "div",
        classes: ["GDSA", "browser"],
        actions: {},
        form: {
            submitOnChange: false,
            closeOnSubmit: false
        },
        position: {},
        window: {}
    }

    static PARTS = {

        main: { template: "systems/gdsa/templates/apps/compBrowser.hbs" }
    }

    get title() {

        return "Browser";
    }

    /** @override */
    _configureRenderOptions(options) {

        super._configureRenderOptions(options);
        options.parts = ["main"];
    }

    /** @override */
    async _prepareContext(options) {

        let sheetData = { config: CONFIG.GDSA, template: CONFIG.Templates, type: this.type };
        
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

        let itemArray = [];
        let sortedArray = [];
        let selV = [];
        let nonV = true;
        let nonK = true;

        switch (this.type) {

            case "spell":

                itemArray = await game.packs.get("gdsa.spells").getDocuments();

                selV = [this.v0, this.v1, this.v2, this.v3, this.v4, this.v5, this.v6];

                if(!this.v0 && !this.v1 && !this.v2 && !this.v3 && !this.v4 && !this.v5 && !this.v6) nonV = true
                else nonV = false;
                if(!this.kA && !this.kB && !this.kC && !this.kD && !this.kE && !this.kF) nonK = true
                else nonK = false;

                for(let spell of itemArray) {

                    if(this.searchString === null || spell.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(this.trait === "" || this.checkForTrait(spell, this.trait))
                            if(this.rep === "" || this.checkForRep(spell, this.rep))
                                if(nonK || this.checkKomp(spell.system.komp.toUpperCase()))
                                    if(this.rep === "" || nonV)
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

                itemArray = await game.packs.get("gdsa.arsenal").getDocuments();
                
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.type === "Gegenstand" && item.system.type === "melee")
                            if(this.skill === "" || this.checkForSkill(item, this.skill))
                                sortedArray.push(item)
                }

                break;

            case "range-weapons":

                itemArray = await game.packs.get("gdsa.arsenal").getDocuments();
                
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.type === "Gegenstand" && item.system.type === "range")
                            if(this.skill === "" || this.checkForSkill(item, this.skill))
                                sortedArray.push(item)
                }

                break;

            case "shields":

                itemArray = await game.packs.get("gdsa.arsenal").getDocuments();
            
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.type === "Gegenstand" && item.system.type === "shild")
                            sortedArray.push(item)
                }

                break;

            case "armour":

                itemArray = await game.packs.get("gdsa.arsenal").getDocuments();
            
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.type === "Gegenstand" && item.system.type === "armour")
                            if(this.aPlace === "" || this.checkArmourRat(item, this.aPlace))
                                sortedArray.push(item)
                }

                break;

            case "ritual":
                
                itemArray = await game.packs.get("gdsa.rituale").getDocuments();
                
                for(let item of itemArray) {

                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.system.type ===  "schama" || item.system.type ===  "ritual")
                            if(this.rittSkill === "" || this.checkRitualSkill(item, this.rittSkill))
                                sortedArray.push(item)
                }

                break;

            case "objektRitual":
                    
                itemArray = await game.packs.get("gdsa.rituale").getDocuments();
                    
                for(let item of itemArray) {
    
                    if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(item.system.type === "objrit")
                            if(this.rittSkill === "" || this.checkRitualSkill(item, this.rittSkill))
                                sortedArray.push(item)
                }
    
                break;

            case "wonder":
                
                itemArray = await game.packs.get("gdsa.liturgien").getDocuments();

                selV = [false, this.kA, this.kB, this.kC, this.kD, this.kE, this.kF];

                if(!this.kA && !this.kB && !this.kC && !this.kD && !this.kE && !this.kF) nonK = true
                else nonK = false;
                
                for(let wonder of itemArray) {

                    if(this.searchString === null || wonder.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                        if(wonder.type === "wonder")
                            if(selV[wonder.system.grad] || nonK)
                                if(this.rep === "")
                                    sortedArray.push(wonder);
                                else if(this.rep === "pra" && wonder.system.verb.Pra)
                                    sortedArray.push(wonder);
                                else if(this.rep === "ron" && wonder.system.verb.Ron)
                                    sortedArray.push(wonder);
                                else if(this.rep === "phx" && wonder.system.verb.Phx)
                                    sortedArray.push(wonder);
                                else if(this.rep === "fir" && wonder.system.verb.Fir)
                                    sortedArray.push(wonder);
                                else if(this.rep === "tra" && wonder.system.verb.Tra)
                                    sortedArray.push(wonder);
                                else if(this.rep === "ing" && wonder.system.verb.Ing)
                                    sortedArray.push(wonder);
                                else if(this.rep === "bor" && wonder.system.verb.Bor)
                                    sortedArray.push(wonder);
                                else if(this.rep === "eff" && wonder.system.verb.Eff)
                                    sortedArray.push(wonder);
                                else if(this.rep === "hes" && wonder.system.verb.Hes)
                                    sortedArray.push(wonder);
                                else if(this.rep === "per" && wonder.system.verb.Per)
                                    sortedArray.push(wonder);
                                else if(this.rep === "rah" && wonder.system.verb.Rah)
                                    sortedArray.push(wonder);
                                else if(this.rep === "tsa" && wonder.system.verb.Tsa)
                                    sortedArray.push(wonder);
                                else if(this.rep === "ifi" && wonder.system.verb.Ifi)
                                    sortedArray.push(wonder);
                                else if(this.rep === "ave" && wonder.system.verb.Ave)
                                    sortedArray.push(wonder);
                                else if(this.rep === "kor" && wonder.system.verb.Kor)
                                    sortedArray.push(wonder);
                                else if(this.rep === "nan" && wonder.system.verb.Nan)
                                    sortedArray.push(wonder);
                                else if(this.rep === "swf" && wonder.system.verb.Swf)
                                    sortedArray.push(wonder);
                                else if(this.rep === "ang" && wonder.system.verb.Ang)
                                    sortedArray.push(wonder);
                                else if(this.rep === "tai" && wonder.system.verb.Tai)
                                    sortedArray.push(wonder);
                                else if(this.rep === "grv" && wonder.system.verb.Grv)
                                    sortedArray.push(wonder);
                                else if(this.rep === "him" && wonder.system.verb.Him)
                                    sortedArray.push(wonder);
                                else if(this.rep === "zsa" && wonder.system.verb.Zsa)
                                    sortedArray.push(wonder);
                                else if(this.rep === "hsz" && wonder.system.verb.Hsz)
                                    sortedArray.push(wonder);
                                else if(this.rep === "kam" && wonder.system.verb.Kam)
                                    sortedArray.push(wonder);
                                else if(this.rep === "nam" && wonder.system.verb.Nam)
                                    sortedArray.push(wonder);
                }

                break;

            case "genItem":
                    
            itemArray = await game.packs.get("gdsa.arsenal").getDocuments();
                
            for(let item of itemArray) {

                if(this.searchString === null || item.name.toLowerCase().includes(this.searchString.toLowerCase())) 
                    if(item.type === "Gegenstand" && item.system.type === "item")
                        sortedArray.push(item)
            }

            break;
            
            default:
                break;
        }

        sheetData.items = sortedArray.sort((a,b) => { if (a.name === b.name) return a.system.grad < b.system.grad ? -1 : 1; else return b.name > a.name ? -1 : 1});

        this.itemList = sheetData.items;

        return sheetData;
    }
 
    /** @override */
    _onRender(context, options) {

        super._onRender(context, options);
        
        this.element.querySelectorAll(".browserInput").forEach(action => { action.addEventListener("click", (e) => this.objectClicked(e)) });
        this.element.querySelectorAll(".browserMenuInput").forEach(action => { action.addEventListener("change", (e) => this.objectClicked(e)) });
        this.element.querySelectorAll(".item").forEach(action => { action.addEventListener("dblclick", (e) => this.addItem(e)) });
    }

    objectClicked(event) {
        
        let html = event.srcElement.closest(".settings");

        this.searchString = html.querySelector("#menuSearch").value;

        switch (this.type) {
            case "spell":
                this.trait = html.querySelector("#trait").value;
                this.v0 = html.querySelector("#v0").checked;
                this.v1 = html.querySelector("#v1").checked;
                this.v2 = html.querySelector("#v2").checked;
                this.v3 = html.querySelector("#v3").checked;
                this.v4 = html.querySelector("#v4").checked;
                this.v5 = html.querySelector("#v5").checked;
                this.v6 = html.querySelector("#v6").checked;
            case "wonder":
                this.rep = html.querySelector("#rep").value;
                this.kA = html.querySelector("#kA").checked;
                this.kB = html.querySelector("#kB").checked;
                this.kC = html.querySelector("#kC").checked;
                this.kD = html.querySelector("#kD").checked;
                this.kE = html.querySelector("#kE").checked;
                this.kF = html.querySelector("#kF").checked;
                break;
            case "melee-weapons":
            case "range-weapons":
                this.skill = html.querySelector("#skill").value;
                break;
            case "armour":
                this.aPlace = html.querySelector("#place").value;
                break;
            case "objektRitual":
                this.rittSkill = html.querySelector("#skill").value;
                break;
        }

        this.render();
    }

    checkArmourRat(item, place) { return (item.system.armour[place] > 0); }
    
    checkForSkill(item, skill) { return (item.system.weapon.skill === skill); }

    checkRitualSkill(ritObj, rit) { return ritObj.system.creatTalent === rit ? true : false; }

    checkForTrait(spell, trait) { return (spell.system.trait1 === trait || spell.system.trait2 === trait || spell.system.trait3 === trait || spell.system.trait4 === trait); }

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
    
        let id = event.currentTarget.closest(".item").dataset.id;

        switch (this.type) {

            case "spell":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("gdsa.spells").get(id)]);
                ui.notifications.info(game.i18n.localize("GDSA.info.itemSpell"));          
                break;

            case "melee-weapons":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("gdsa.arsenal").get(id)]);
                ui.notifications.info(game.i18n.localize("GDSA.info.itemAdd"));        
                break;

            case "range-weapons":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("gdsa.arsenal").get(id)]);
                ui.notifications.info(game.i18n.localize("GDSA.info.itemAdd"));
                break;

            case "shields":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("gdsa.arsenal").get(id)]);
                ui.notifications.info(game.i18n.localize("GDSA.info.itemAdd"));      
                break;

            case "armour":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("gdsa.arsenal").get(id)]);
                ui.notifications.info(game.i18n.localize("GDSA.info.itemAdd"));
                break;

            case "ritual":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("gdsa.rituale").get(id)]);
                ui.notifications.info(game.i18n.localize("GDSA.info.itemAdd"));
                break;

            case "objektRitual":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("gdsa.rituale").get(id)]);
                ui.notifications.info(game.i18n.localize("GDSA.info.itemRitua"));        
                break;

            case "wonder":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("gdsa.liturgien").get(id)]);
                ui.notifications.info(game.i18n.localize("GDSA.info.itemLitur"));          
                break;

            case "genItem":
                await game.actors.get(this.actor).createEmbeddedDocuments("Item", [game.packs.get("gdsa.arsenal").get(id)]);
                ui.notifications.info(game.i18n.localize("GDSA.info.itemAdd"));
                break;
        }
    }
}
