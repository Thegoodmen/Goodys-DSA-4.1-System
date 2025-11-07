import * as Util from "../../Util.js";
import GDSAActor from "../objects/GDSAActor.js";

const api = foundry.applications.api;

export default class GDSAHeldenImporter extends api.HandlebarsApplicationMixin(api.ApplicationV2) {
    
    constructor(options={}) {
        
        super(options);
        this.heroObject = {};
    }

    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["GDSA", "heldenimporter"],
        actions: {},
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        position: {
            width: 800
        }
    }

    static PARTS = {

        main: { template: "systems/gdsa/templates/apps/heldenimport.hbs" }
    }

    get title() {

        return "Heldentool Importer";
    }

    /** @override */
    _configureRenderOptions(options) {

        super._configureRenderOptions(options);
        options.parts = ["main"];
    }

    /** @override */
    _onRender(context, options) {

        super._onRender(context, options);
        this.element.querySelector("#Heldenimport").addEventListener("change", (e) => this.loadHero(e));
        this.element.querySelector("#bnt1").addEventListener("click", (e) => this.createHero(e));
    }

    /** Custom Functions */
    static Initialize(html) {
        
        html.find('#gdsa-options').append($(
            `<button data-action="heldentool-importer">
                <i class="fas fa-duotone fa-arrow-up-from-bracket"></i>
                Import Heldentool XML
            </button>`));

        html.find('button[data-action="heldentool-importer"').on("click", _ => new GDSAHeldenImporter().render(true));
    }

    async loadHero(event) {
        
        event.preventDefault();

        // Get Element

        let element = event.currentTarget;

        // Reset Fehlerlog

        element.closest("form").querySelector("[id=overview2]").innerHTML = "";

        // Get File 

        const files = [];
        files.push(element.closest("form").querySelector("[id=Heldenimport]").files[0]);

        // Read File and execute
        
        const filePromises = files.map((file) => {
              
            // Return a promise per file
            
            return new Promise((resolve, reject) => {

                const reader1 = new FileReader();
                
                reader1.onload = async () => {
                  
                    try {
            
                        let xmlHeld = reader1.result;
                        
                        // Read XML and generate Hero Object
            
                        let parser = new DOMParser();
                        let xmlDoc = parser.parseFromString(xmlHeld,"text/xml");
                        const response = generateHeroObject(event, xmlDoc.getElementsByTagName("held")[0]);

                        // Resolve the promise with the response value
                        resolve(response);

                    } catch (err) {

                        reject(err);
                    }
                };

                reader1.onerror = (error) => {

                    reject(error);
                };

                reader1.readAsText(file);
            
            });
        });
          
        // Wait for all promises to be resolved

        const fileInfos = await Promise.all(filePromises);

        // Set Heroobject as Global

        const hero = fileInfos[0];
        this.heroObject = hero;

        // Update HTML Boxes

        const template = "systems/gdsa/templates/apps/heldenimportMaske.hbs";
        const html = await foundry.applications.handlebars.renderTemplate(template, hero);

        element.closest("form").querySelector("[id=overview1]").innerHTML = html;
        
    }

    async createHero(event) {

        event.preventDefault();

        const hero = this.heroObject;

        if(Object.keys(hero).length === 0) return;

        let actor = await GDSAActor.create({
            name: "New Test Actor",
            type: "PlayerCharakter",
            img: "systems/gdsa/assets/ui/logo.webp"
        });


        actor.name = hero.name;

        actor.prototypeToken.name = hero.name;
        actor.prototypeToken.actorLink = true;
        actor.prototypeToken.bar1 = {attribute: 'LeP'};
        actor.prototypeToken.bar2 = {attribute: 'AuP'};

        actor.system.CH.value = hero.attributes.ch;
        actor.system.FF.value = hero.attributes.ff;
        actor.system.GE.value = hero.attributes.ge;
        actor.system.IN.value = hero.attributes.in;
        actor.system.KK.value = hero.attributes.kk;
        actor.system.KL.value = hero.attributes.kl;
        actor.system.KO.value = hero.attributes.ko;
        actor.system.MU.value = hero.attributes.mu;

        actor.system.AP.value = hero.stats.ap;
        actor.system.AP.free = hero.stats.apfree;
        actor.system.APFree.value = hero.stats.apfree;
        actor.system.AsPInfo.modi = hero.stats.asp;
        actor.system.AsPInfo.buy = hero.stats.aspBuy;
        actor.system.AuPInfo.modi = hero.stats.aup;
        actor.system.AuPInfo.buy = hero.stats.aupBuy;
        actor.system.KaPInfo.modi = hero.stats.kap;
        actor.system.KaPInfo.buy = hero.stats.kapBuy;
        actor.system.LePInfo.modi = hero.stats.lep;
        actor.system.LePInfo.buy = hero.stats.lepBuy;
        actor.system.MR.modi = hero.stats.mr;
        actor.system.MR.buy = hero.stats.mrBuy;

        actor.system.money.copper = hero.money.copper;
        actor.system.money.gold = hero.money.gold;
        actor.system.money.nickel = hero.money.nickel;
        actor.system.money.silver = hero.money.silver;
        
        actor.system.SO = hero.info.so;
        actor.system.age = hero.info.age;
        actor.system.gender = hero.info.gender;
        actor.system.height = hero.info.hight;
        actor.system.kulture = hero.info.culture;
        actor.system.profession = hero.info.profession;
        actor.system.race = hero.info.race;
        actor.system.weight = hero.info.weight;
        actor.system.skill = hero.skills;

        if ( hero.advantages.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.mag1")}).length > 0 ) actor.system.AsPInfo.modi += 6;
        if ( hero.advantages.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.mag2")}).length > 0 ) actor.system.AsPInfo.modi -= 6;
        if ( hero.advantages.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.mag3")}).length > 0 ) actor.system.AsPInfo.modi -= 12;

        actor.update({ "name": actor.name });
        actor.update({ "prototypeToken": actor.prototypeToken });
        actor.update({ "system": actor.system });

        let spellsArray = await game.packs.get("gdsa.spells").getDocuments();

        for (let i = 0; i < hero.advantages.length; i++)
            await actor.createEmbeddedDocuments("Item", [hero.advantages[i]]);

        for (let i = 0; i < hero.disadvantages.length; i++)
            await actor.createEmbeddedDocuments("Item", [hero.disadvantages[i]]);
    
        for (let i = 0; i < hero.sfGeneral.length; i++)
            await actor.createEmbeddedDocuments("Item", [hero.sfGeneral[i]]);
            
        for (let i = 0; i < hero.wonders.length; i++)
            await actor.createEmbeddedDocuments("Item", [hero.wonders[i]]);
            
        for (let i = 0; i < hero.objectRit.length; i++)
            await actor.createEmbeddedDocuments("Item", [hero.objectRit[i]]);
            
        for (let i = 0; i < hero.rits.length; i++)
            await actor.createEmbeddedDocuments("Item", [hero.rits[i]]);
            
        for (let i = 0; i < hero.items.length; i++)
            await actor.createEmbeddedDocuments("Item", [hero.items[i]]);

        for (let i = 0; i < hero.spells.length; i++) {

            // let finding = spellsArray.filter(function(item) {return hero.spells[i].name.includes(item.name)})
            let finding = spellsArray.filter(function(item) {return hero.spells[i].name === item.name});

            if (finding.length !== 1) {

                if (hero.spells[i].name.includes(" (Agm)")) {
                    
                    finding =  spellsArray.filter(function(item) {return hero.spells[i].name.replace(" (Agm)", "") === item.name})[0];

                    let traits = [finding.system.trait1, finding.system.trait2, finding.system.trait3, finding.system.trait4]

                    let spell = (await actor.createEmbeddedDocuments("Item", [finding]))[0];
                    
                    traits.filter(removeEleValue);
                    traits.filter(removeEleValue);
                    traits.filter(removeEleValue);
                    traits.filter(removeEleValue);
                    
                    traits.push("agri");

                    spell.system.trait1 = (traits.length >= 1) ? traits[0] : "none";
                    spell.system.trait2 = (traits.length >= 2) ? traits[1] : "none";
                    spell.system.trait3 = (traits.length >= 3) ? traits[2] : "none";
                    spell.system.trait4 = (traits.length >= 4) ? traits[3] : "none";
                    spell.system.name = hero.spells[i].name;
                    spell.system.zfw = hero.spells[i].value;
                    spell.system.rep = Util.getRepFromHeldentool(hero.spells[i].rep);

                    spell.update({ "name": hero.spells[i].name });
                    spell.update({ "system": spell.system });

                } else if (hero.spells[i].name.includes(" (obsk.)")) {
                    
                    finding =  spellsArray.filter(function(item) {return hero.spells[i].name.replace(" (obsk.)", "") === item.name})[0];

                    let spell = (await actor.createEmbeddedDocuments("Item", [finding]))[0];

                    spell.system.name = hero.spells[i].name;
                    spell.system.zfw = hero.spells[i].value;
                    spell.system.rep = Util.getRepFromHeldentool(hero.spells[i].rep);

                    spell.update({ "name": hero.spells[i].name });
                    spell.update({ "system": spell.system });              
                
                } else {
                    
                    let spell = {

                        name: hero.spells[i].name,
                        type: "spell",
                        system: {
                            name: hero.spells[i].name,
                            att1: hero.spells[i].probe.replace(" (", "").replace(")", "").split("/")[0],
                            att2: hero.spells[i].probe.replace(" (", "").replace(")", "").split("/")[1],
                            att3: hero.spells[i].probe.replace(" (", "").replace(")", "").split("/")[2],
                            rep: Util.getRepFromHeldentool(hero.spells[i].rep),
                            zfw: hero.spells[i].value,
                            casttime: true,
                            cost: true,
                            costs: "",
                            costsAlt: "",
                            diffrentCost: false,
                            duration: true,
                            forced: true,
                            isMR: false,
                            komp: "",
                            lcdPage: "",
                            loc: "GDSA.system.spell",
                            range: true,
                            repAlt: "",
                            technic: true,
                            trait1: "none",
                            trait2: "none",
                            trait3: "none",
                            trait4: "none",
                            vAch: null,
                            vBor: null,
                            vDru: null,
                            vElf: null,
                            vGeo: null,
                            vHex: null,
                            vMag: null,
                            vSch: null,
                            vSrl: null,
                            vari: {},
                            vars: [],
                            zduration: 0
                        }      
                    }

                    await actor.createEmbeddedDocuments("Item", [spell]);

                } 

            } else {

                let spell = (await actor.createEmbeddedDocuments("Item", finding))[0];

                spell.system.name = hero.spells[i].name;
                spell.system.zfw = hero.spells[i].value;
                spell.system.rep = Util.getRepFromHeldentool(hero.spells[i].rep);

                spell.update({ "name": hero.spells[i].name });
                spell.update({ "system": spell.system });
            }
        }
        
        await delay(2500);

        actor.update({ "system.LeP.value": actor.system.LeP.max });
        actor.update({ "system.AuP.value": actor.system.AuP.max });
        actor.update({ "system.AsP.value": actor.system.AsP.max });
        actor.update({ "system.KaP.value": actor.system.KaP.max });

        if(actor.system.skill.Armbrust.value !== null) actor.update({ "system.skill.Armbrust.atk": (parseInt(actor.system.skill.Armbrust.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.Belagerungswaffen.value !== null) actor.update({ "system.skill.Belagerungswaffen.atk": (parseInt(actor.system.skill.Belagerungswaffen.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.Blasrohr.value !== null) actor.update({ "system.skill.Blasrohr.atk": (parseInt(actor.system.skill.Blasrohr.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.Bogen.value !== null) actor.update({ "system.skill.Bogen.atk": (parseInt(actor.system.skill.Bogen.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.Diskus.value !== null) actor.update({ "system.skill.Diskus.atk": (parseInt(actor.system.skill.Diskus.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.Lanzenreiten.value !== null) actor.update({ "system.skill.Lanzenreiten.atk": (parseInt(actor.system.skill.Lanzenreiten.value) + actor.system.ATBasis.value)});
        if(actor.system.skill.Schleuder.value !== null) actor.update({ "system.skill.Schleuder.atk": (parseInt(actor.system.skill.Schleuder.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.Wurfbeile.value !== null) actor.update({ "system.skill.Wurfbeile.atk": (parseInt(actor.system.skill.Wurfbeile.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.Wurfmesser.value !== null) actor.update({ "system.skill.Wurfmesser.atk": (parseInt(actor.system.skill.Wurfmesser.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.Wurfspeere.value !== null) actor.update({ "system.skill.Wurfspeere.atk": (parseInt(actor.system.skill.Wurfspeere.value) + actor.system.FKBasis.value)});
    
        this.close();
        actor.sheet.render(true);
    }
 
}

function removeEleValue(value, index, arr) {

    if (value === "elem" || value === "feur" || value === "wass" || value === "eis" || value === "humu" || value === "luft" || value === "erz" || value === "none") {

        arr.splice(index, 1);
        return true;
    }

    return false;
}

function generateHeroObject(event, xml) {
    let advantage = [];
    let disadvantage = [];
    let sfGeneral = [];
    let objectRit = [];
    let sfRit = [];
    let holySpell = [];
    let spells = [];
    let items = [];
    let basis = xml.getElementsByTagName("basis")[0];
    let rasse = basis.getElementsByTagName("rasse")[0];
    let eigenArray = xml.getElementsByTagName("eigenschaften")[0].getElementsByTagName("eigenschaft");
    let advantages = xml.getElementsByTagName("vt")[0].getElementsByTagName("vorteil");
    let spezialSkills = xml.getElementsByTagName("sf")[0].getElementsByTagName("sonderfertigkeit");
    let skillArray = xml.getElementsByTagName("talentliste")[0].getElementsByTagName("talent");
    let combatArray = xml.getElementsByTagName("kampf")[0].getElementsByTagName("kampfwerte");
    let spellArray = xml.getElementsByTagName("zauberliste")[0].getElementsByTagName("zauber");
    let itemArray = xml.getElementsByTagName("gegenstände")[0].getElementsByTagName("gegenstand");
    let moneyArray = xml.getElementsByTagName("geldboerse")[0].getElementsByTagName("muenze");


    for (let i = 0; i < advantages.length; i++) {

        const templates = Object.assign({}, CONFIG.Templates);
        let traitName = advantages[i].attributes.name.value;

        if (traitName.includes("Geweiht")) traitName = "Geweiht";

        let advaArray = templates.advantage.all.filter(function(item) {return item.name.includes(traitName)});
        let flawArray = templates.flaw.all.filter(function(item) {return item.name.includes(traitName)});


        if (flawArray.length > 0) {

            let value = 0;
            let nameAddition = "";
            let newFlaw = {};
            
            if (advantages[i].attributes.value !== undefined)
                if (isNaN(advantages[i].attributes.value.value)) 
                    nameAddition = advantages[i].attributes.value.value;
                else value = parseInt(advantages[i].attributes.value.value);

            if (flawArray.length !== 1)
                if (value !== 0)
                    newFlaw = structuredClone(flawArray.filter(function(item) {return item.system.trait.value === value})[0]);
                else if (nameAddition !== "")
                    newFlaw = structuredClone(flawArray.filter(function(item) {return item.name.includes(nameAddition)})[0]);
                else newFlaw = structuredClone(flawArray[0]);
            else newFlaw = structuredClone(flawArray[0]);

            if(advantages[i].children.length === 2) {

                if (traitName === "Paktierer") {

                    newFlaw.name  += " (" + advantages[i].children[0].attributes.value.value + " | " + advantages[i].children[1].attributes.value.value + ")";
                    newFlaw.system.tale.DE += " (" + advantages[i].children[0].attributes.value.value + " | " + advantages[i].children[1].attributes.value.value + ")";
                    newFlaw.system.tale.EN += " (" + advantages[i].children[0].attributes.value.value + " | " + advantages[i].children[1].attributes.value.value + ")";

                } else {

                    newFlaw.name  += " " + advantages[i].children[1].attributes.value.value;
                    newFlaw.system.tale.DE += " " + advantages[i].children[1].attributes.value.value;
                    newFlaw.system.tale.EN += " " + advantages[i].children[1].attributes.value.value;
                    newFlaw.system.tale.DE = newFlaw.system.tale.DE.replace(" (häufiger Auslöser) ", " ").replace(" (seltener Auslöser) ", " ");
                    newFlaw.system.tale.EN = newFlaw.system.tale.EN.replace(" (common Trigger) ", " ").replace(" (uncommen Trigger) ", " ");
                    newFlaw.system.trait.value = parseInt(advantages[i].children[0].attributes.value.value);
                }

            } else if(advantages[i].children.length === 3) {

                newFlaw.name  += " " + advantages[i].children[2].attributes.value.value;
                newFlaw.system.tale.DE += " " + advantages[i].children[2].attributes.value.value;
                newFlaw.system.tale.EN += " " + advantages[i].children[2].attributes.value.value;
                newFlaw.system.tale.DE = newFlaw.system.tale.DE.replace("Schlechte Eigenschaft ", "");
                newFlaw.system.tale.EN = newFlaw.system.tale.EN.replace("Bad Habbit ", "");
                newFlaw.system.trait.value = parseInt(advantages[i].children[1].attributes.value.value);
            }

            if (value !== 0 && flawArray.length === 1) newFlaw.system.trait.value = value;
            if (nameAddition !== "" && flawArray.length === 1) newFlaw.system.tale.DE += " (" + nameAddition + ")";
            if (nameAddition !== "" && flawArray.length === 1) newFlaw.system.tale.EN += " (" + nameAddition + ")";

            if(!newFlaw) console.log(traitName);

            disadvantage.push(newFlaw);

        } else if (advaArray.length > 0) {

            let value = 0;
            let nameAddition = "";
            let newAdv = {};
            
            if (advantages[i].attributes.value !== undefined)
                if (isNaN(advantages[i].attributes.value.value)) 
                    nameAddition = advantages[i].attributes.value.value;
                else value = parseInt(advantages[i].attributes.value.value);

            if (advaArray.length !== 1)
                if (traitName === "Verbindungen")
                    newAdv = structuredClone(advaArray[0]);
                else if (value !== 0)
                    newAdv = structuredClone(advaArray.filter(function(item) {return item.system.trait.value === value})[0]);
                else if (nameAddition !== "")
                    newAdv = structuredClone(advaArray.filter(function(item) {return item.name.includes(nameAddition)})[0]);
                else newAdv = structuredClone(advaArray[0]);
            else newAdv = structuredClone(advaArray[0]);

            if (traitName === "Meisterhandwerk" || traitName === "Immunität gegen Gift" || traitName === "Immunität gegen Krankheiten" || traitName === "Resistenz gegen Gift" || traitName === "Begabung für [Zauber]" || traitName === "Begabung für [Talent]" || traitName === "Begabung für [Ritual]") {

                newAdv = structuredClone(advaArray[0]);
                newAdv.name  += " (" + nameAddition + ")";
                newAdv.system.tale.DE += " (" + nameAddition + ")";
                newAdv.system.tale.EN += " (" + nameAddition + ")";
            }

            if (traitName === "Natürliche Waffen")
                newAdv.name  += " [" + nameAddition + "]";

            if (traitName === "Beseelte Knochenkeule")
                newAdv = structuredClone(advaArray[0]);

            if (value !== 0 && advaArray.length === 1) newAdv.system.trait.value = value;
            if (nameAddition !== "" && advaArray.length === 1) newAdv.system.tale.DE += " (" + nameAddition + ")";
            if (nameAddition !== "" && advaArray.length === 1) newAdv.system.tale.EN += " (" + nameAddition + ")";

            if(!newAdv) console.log(traitName);
            
            advantage.push(newAdv);

        } else event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                "<div class='importError'>Der folgende Vor-/Nachteil wurde nicht gefunden: <br /><b>" + advantages[i].attributes.name.value.trim() + "</b><br /> Nach dem Import muss jener manuell hinzugefügt werden!</div>";
    }

    for (let i = 0; i < spezialSkills.length; i++) {

        const templates = Object.assign({}, CONFIG.Templates);
        let traitName = spezialSkills[i].attributes.name.value;
        
        let traitArray = templates.traits.all.filter(function(item) {return item.name.includes(traitName)});

        
        if (traitArray.length > 0) {

            if (traitArray.length > 1) {

                let traitArray2 = templates.traits.all.filter(function(item) {return item.name === traitName});

                if (traitName === "Meisterschütze" || traitName === "Scharfschütze" || traitName === "Schnellladen")
                    traitArray2 = traitArray.filter(function(item) {return item.name.includes(spezialSkills[i].getElementsByTagName("talent")[0].attributes.name.value)});

                if (traitName === "Kulturkunde") {

                    for (let j = 0; j < spezialSkills[i].getElementsByTagName("kultur").length; j++)
                        sfGeneral.push(traitArray.filter(function(item) {return item.name.includes(spezialSkills[i].getElementsByTagName("kultur")[j].attributes.name.value)})[0]);

                } else if(traitName === "Rüstungsgewöhnung I") {

                    let newSF = structuredClone(traitArray[0]);
                    newSF.system.tale.DE = "Rüstungsgewöhnung I (" + spezialSkills[i].getElementsByTagName("gegenstand")[0].attributes.name.value + ")";
                    newSF.name = "Rüstungsgewöhnung I (" + spezialSkills[i].getElementsByTagName("gegenstand")[0].attributes.name.value + ")";
                    sfGeneral.push(newSF)

                } else if(traitName.slice(-1) === "I") {

                    sfGeneral.push(traitArray[0])

                } else if (traitArray2.length === 1) {
                    
                    sfGeneral.push(traitArray2[0])

                } else {

                    event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
                }

            } else {

                let newItem = structuredClone(traitArray[0]);

                if (traitName === "Berufsgeheimnis") {

                    for (let j = 0; j < spezialSkills[i].getElementsByTagName("auswahl").length; j++) {

                        newItem.system.tale.DE = "Berufsgeheimnis" + " (" +
                            spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[2].attributes.value.value + ") " +
                            spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[0].attributes.value.value + " " +
                            spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[1].attributes.value.value;
                        newItem.name = "Berufsgeheimnis" + " (" +
                            spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[2].attributes.value.value + ") " +
                            spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[0].attributes.value.value + " " +
                            spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[1].attributes.value.value;
                        
                        sfGeneral.push(newItem)
                    }

                } else if (traitName === "Ortskenntnis") {

                    for (let j = 0; j < spezialSkills[i].getElementsByTagName("auswahl").length; j++) {

                        newItem.system.tale.DE = "Ortskenntnis" + " (" +
                            spezialSkills[i].getElementsByTagName("auswahl")[j].attributes.name.value + ")";
                        newItem.name = "Ortskenntnis" + " (" +
                            spezialSkills[i].getElementsByTagName("auswahl")[j].attributes.name.value + ")";
                        
                        sfGeneral.push(newItem)
                    }

                } else sfGeneral.push(newItem)
            }
        
        } else if (traitName.includes("Liturgie")) {

            let ritualArray = templates.liturgy.all.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                holySpell.push(ritualArray[0]);

            } else {

                if (traitName.includes("(")) {

                    let ritualArray2 = templates.liturgy.all.filter(function(item) {return item.name.includes((traitName.split(":")[1].trim()).split("(")[0].trim())});

                    if (ritualArray2.length >= 1) {

                        let grad = ((traitName.split(":")[1].trim()).split("(")[1].trim()).split(")")[0];
                        let gradNum = romanToInt(grad);

                        if (!isNaN(gradNum)) {

                            let ritualArray3 = ritualArray2.filter(function(item) {return item.system.grad === gradNum.toString()});

                            if (ritualArray3.length === 1) {

                                holySpell.push(ritualArray3[0]);
                
                            } else if (ritualArray3.length === 2) {

                                holySpell.push(ritualArray3[0]);
                
                            } else {

                                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                                "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                                + traitName.trim() 
                                + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
                            }

                        } else {

                            let ritualArray3 = templates.liturgy.all.filter(function(item) {return item.name.includes(((traitName.split(":")[1].trim()).split("(")[1].trim()).split(")")[0])});

                            if (ritualArray3.length === 1) {

                                holySpell.push(ritualArray3[0]);
                
                            } else if ((traitName.split(":")[1].trim()).split("(").length > 2) {

                                let grad2 = ((traitName.split(":")[1].trim()).split("(")[2].trim()).split(")")[0];
                                let gradNum2 = romanToInt(grad2);

                                if (!isNaN(gradNum2)) {

                                    let ritualArray4 = ritualArray2.filter(function(item) {return item.system.grad === gradNum2.toString()});
        
                                    if (ritualArray4.length === 1) {
        
                                        holySpell.push(ritualArray4[0]);
                        
                                    } else if (ritualArray4.length === 2) {
        
                                        holySpell.push(ritualArray4[0]);
                        
                                    } else {
        
                                        event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                                        "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                                        + traitName.trim() 
                                        + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
                                    }
        
                                } else { 

                                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                                "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                                + traitName.trim() 
                                + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
                                }

                            } else holySpell.push(ritualArray2[0]);
                        }
                    } else {

                        event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                        "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                        + traitName.trim() 
                        + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
                    }


                } else if (ritualArray.length > 1) {

                    
                    let ritualArray2 = ritualArray.filter(function(item) {return item.name === (traitName.split(":")[1].trim())});

                    holySpell.push(ritualArray2[0]);

                } else {
       
                    event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";

                }
            }   
            
        } else if (traitName.includes("Talentspezialisierung")) {

            let traitArray2 = templates.traits.all.filter(function(item) {return item.name.includes("Talentspezialisierung")});
            let newItem = structuredClone(traitArray2[0]);
                
            newItem.system.tale.DE = spezialSkills[i].attributes.name.value.replace("Fesseln/Entfesseln", "Fesseln / Entfesseln");
            newItem.name = spezialSkills[i].attributes.name.value.replace("Fesseln/Entfesseln", "Fesseln / Entfesseln");

            sfGeneral.push(newItem);     

        } else if (traitName.includes("Gabe des Odûn")) {

            let ritualArray = templates.ritual.durr.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                objectRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }
            
        } else if (traitName.includes("Schlangenring-Zauber")) {

            let ritualArray = templates.ritual.geod.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                objectRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }
            
        } else if (traitName.includes("Schuppenbeutel")) {

            let ritualArray = templates.ritual.kris.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                objectRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }
            
        } else if (traitName.includes("Druidisches Dolchritual")) {

            let ritualArray = templates.ritual.drui.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                objectRit.push(ritualArray[0]);

            } else if (ritualArray.length > 1 && traitName === "Druidisches Dolchritual: Bann") {

                let ritualArray2 = [];

                if (traitName === "Druidisches Dolchritual: Bann") ritualArray2 = templates.ritual.drui.filter(function(item) {return item.name === "Bann des Dolches"});

                if (ritualArray2.length === 1) {

                    objectRit.push(ritualArray2[0]);

                } else {

                    event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                        "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                        + traitName.trim() 
                        + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
                }

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }
            
        } else if (traitName.includes("Keulenritual")) {

            let ritualArray = templates.ritual.schamObj.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length !== 1)
                ritualArray = templates.ritual.schamObj.filter(function(item) {return item.name.includes((traitName.split(":")[1]).trim() + " 1")});

            if (ritualArray.length === 1) {

                objectRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }
            
        } else if (traitName.includes("Stabzauber")) {

            let ritualArray = templates.ritual.gild.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                objectRit.push(ritualArray[0]);

            } else if (ritualArray.length > 1 && (traitName === "Stabzauber: Bindung" || traitName === "Stabzauber: Merkmalsfokus")) {

                let ritualArray2 = [];

                if (traitName === "Stabzauber: Bindung") ritualArray2 = templates.ritual.gild.filter(function(item) {return item.name === "Bindung des Stabes"});
                if (traitName === "Stabzauber: Merkmalsfokus") ritualArray2 = templates.ritual.gild.filter(function(item) {return item.name === "Merkmalsfokus"});

                if (ritualArray2.length === 1) {

                    objectRit.push(ritualArray2[0]);

                } else {

                    event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                        "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                        + traitName.trim() 
                        + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
                }

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }
            
        } else if (traitName.includes("Kugelzauber")) {

            let ritualArray = templates.ritual.joinMag.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                objectRit.push(ritualArray[0]);

            } else if (ritualArray.length > 1) {

                
                let ritualArray2 = [];

                if (traitName === "Kugelzauber: Bindung") {
                    
                    ritualArray2 = templates.ritual.gild.filter(function(item) {return item.name === "Bindung der Kugel"});
                    if (ritualArray2.length === 1) { objectRit.push(ritualArray2[0]); }
                    else {

                        event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                        "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                        + traitName.trim() 
                        + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";

                    }
                
                } else {

                let newItem = ritualArray[0];

                newItem.creatTalent = "";
                newItem.ritualSkills = "";

                objectRit.push(newItem);
                
                }

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }
            
        } else if (traitName.includes("Schalenzauber")) {

            let ritualArray = templates.ritual.joinMag.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                objectRit.push(ritualArray[0]);

            } else if (ritualArray.length > 1) {

                let newItem = ritualArray[0];

                newItem.creatTalent = "";
                newItem.ritualSkills = "";

                objectRit.push(newItem);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }
            
        } else if (traitName === "Apport" || traitName === "Bannschwert") {

            let ritualArray = templates.ritual.joinMag.filter(function(item) {return item.name.includes(traitName)});

            if (ritualArray.length === 1) {

                objectRit.push(ritualArray[0]);

            } else if (ritualArray.length > 1) {

                let newItem = ritualArray[0];

                newItem.creatTalent = "";
                newItem.ritualSkills = "";

                objectRit.push(newItem);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }
            
        } else if (traitName.includes("Ritual")) {
            
            let ritualArray = templates.ritual.all.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else if (ritualArray.length > 1) {

                let newItem = ritualArray[0];

                newItem.creatTalent = "";
                newItem.ritualSkills = "";

                sfRit.push(newItem);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Hexenfluch")) {
            
            let ritualArray = templates.ritual.all.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else if (ritualArray.length > 1) {

                let hexRit = ritualArray.filter(function(item) {return item.name === traitName.split(":")[1].trim()})[0];
                if (hexRit) sfRit.push(hexRit);

            } else {
                
                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Hexenritual")) {
            
            let ritualArray = templates.traits.all.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else if (ritualArray.length > 1) {

                let hexRit = ritualArray.filter(function(item) {return item.name === traitName.split(":")[1].trim()})[0];
                if (hexRit) sfRit.push(hexRit);

            } else {
                
                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Kristallomantisches Ritual")) {
            
            let ritualArray = templates.ritual.all.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Trommelzauber")) {
            
            let ritualArray = templates.ritual.all.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Zaubertanz")) {
            
            let ritualArray = templates.ritual.all.filter(function(item) {return item.name.includes(traitName.split(":")[1].split("(")[0].trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else if (ritualArray.length > 1) {

                let tanzRit = ritualArray.filter(function(item) {return item.name.includes(traitName.split(":")[1].split("(")[0].trim())})[0];
                if (tanzRit) sfRit.push(tanzRit);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Zibilja-Ritual")) {
            
            let ritualArray = templates.ritual.all.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Druidisches Herrschaftsritual")) {
            
            let ritualArray = templates.ritual.all.filter(function(item) {return item.name.includes(traitName.split(":")[1].trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Die Gestalt aus Rauch")) {
            
            let ritualArray = templates.ritual.all.filter(function(item) {return item.name.includes(traitName.trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Kristallkraft bündeln")) {
            
            let ritualArray = templates.ritual.all.filter(function(item) {return item.name.includes(traitName.trim())});

            if (ritualArray.length === 1) {

                sfRit.push(ritualArray[0]);

            } else {

                event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                    "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                    + traitName.trim() 
                    + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
            }

        } else if (traitName.includes("Zauberspezialisierung")) {

            let traitArray2 = templates.traits.all.filter(function(item) {return item.name.includes("Zauberspezialisierung")});
            let newItem = structuredClone(traitArray2[0]);
                
            newItem.system.tale.DE = spezialSkills[i].attributes.name.value;
            newItem.name = spezialSkills[i].attributes.name.value;

            sfGeneral.push(newItem); 

        } else if (traitName.includes("Elfenlied")) {
            // Will follow with Rituals
        } else if (traitName.includes("Zauberzeichen")) {
            // Will follow with Rituals
        } else if (traitName.includes("Runen")) {
            // Will follow with Rituals
        } else {
        
            event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" 
                + traitName.trim() 
                + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";
        }
        
        /*

            if (spezialSkills[i].attributes.name.value.includes("Wahrer Name:")) {
                for (let j = 0; j < spezialSkills[i].getElementsByTagName("auswahl").length; j++)
                    if (spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl").length == 2)
                        sfMagic.push(spezialSkills[i].attributes.name.value + " (Q" +
                                        spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[0].attributes.value.value + " | " +
                                        spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[1].attributes.value.value + ")");
                    else sfMagic.push(spezialSkills[i].attributes.name.value + " (Q" +
                                        spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[0].attributes.value.value + " B" +
                                        spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[1].attributes.value.value + " | " +
                                        spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[2].attributes.value.value + ")");


 
        */
    }

    for (let i = 0; i < spellArray.length; i++) {
        
        spells.push({
            name: spellArray[i].attributes.name.value,
            value: spellArray[i].attributes.value.value,
            rep: spellArray[i].attributes.repraesentation.value,
            probe: spellArray[i].attributes.probe.value
        });

    }
    
    for (let i = 0; i < itemArray.length; i++) {

        const templates = Object.assign({}, CONFIG.Templates);
        let orignalName = itemArray[i].attributes.name.value;

        let toolItemsArray = templates.items.all.filter(function(item) {return item.name.includes(orignalName)})

        if (toolItemsArray.length > 0) {

            if (toolItemsArray.length > 1)
                toolItemsArray = templates.items.all.filter(function(item) {return item.name === orignalName})

            if (toolItemsArray.length === 1 || toolItemsArray.length === 2 && toolItemsArray[0].system.type !== toolItemsArray[1].system.type) {
                for (let item of toolItemsArray) {
                    
                    let newitem = structuredClone(item);
                    newitem.system.quantity = itemArray[i].attributes.anzahl.value;
                    
                    if (itemArray[i].getElementsByTagName("modallgemein")[0] !== undefined) {
                        
                        newitem.name = itemArray[i].getElementsByTagName("modallgemein")[0].getElementsByTagName("name")[0].attributes.value.value;
                        newitem.system.weight = itemArray[i].getElementsByTagName("modallgemein")[0].getElementsByTagName("gewicht")[0].attributes.value.value;
                        newitem.system.value = itemArray[i].getElementsByTagName("modallgemein")[0].getElementsByTagName("preis")[0].attributes.value.value;
                        newitem.system.quantity = parseInt(itemArray[i].attributes.anzahl.value);
                    }
                    if (itemArray[i].getElementsByTagName("Rüstung")[0] !== undefined) {
            
                        if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("kopf")[0] !== undefined) newitem.system.armour.head = 
                            itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("kopf")[0].attributes.value.value;
                        if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("brust")[0] !== undefined) newitem.system.armour.body = 
                            itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("brust")[0].attributes.value.value;
                        if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("ruecken")[0] !== undefined) newitem.system.armour.back = 
                            itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("ruecken")[0].attributes.value.value;
                        if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("bauch")[0] !== undefined) newitem.system.armour.stomach = 
                            itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("bauch")[0].attributes.value.value;
                        if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("rechterarm")[0] !== undefined) newitem.system.armour.rightarm = 
                            itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("rechterarm")[0].attributes.value.value;
                        if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("linkerarm")[0] !== undefined) newitem.system.armour.leftarm = 
                            itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("linkerarm")[0].attributes.value.value;
                        if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("rechtesbein")[0] !== undefined) newitem.system.armour.rightleg = 
                            itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("rechtesbein")[0].attributes.value.value;
                        if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("linkesbein")[0] !== undefined) newitem.system.armour.leftleg = 
                            itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("linkesbein")[0].attributes.value.value;
                        if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("sterne")[0] !== undefined) newitem.system.armour.star = 
                            itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("sterne")[0].attributes.value.value;
                    }
                    if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0] !== undefined) {
            
                        if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0] !== undefined) newitem.system.weapon.damage = 
                            itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.mul.value + "d" +
                            itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.w.value + " + " +
                            itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.sum.value;
                        if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("wm")[0] !== undefined) newitem.system.weapon["WM-ATK"] = 
                            itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("wm")[0].attributes.at.value;
                        if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("wm")[0] !== undefined) newitem.system.weapon["WM-DEF"] = 
                            itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("wm")[0].attributes.pa.value;
                        if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("inimod")[0] !== undefined) newitem.system.weapon.INI = 
                            itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("inimod")[0].attributes.ini.value;
                        if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("bf")[0] !== undefined) newitem.system.weapon["BF-min"] = 
                            itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("bf")[0].attributes.min.value;
                        if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("bf")[0] !== undefined) newitem.system.weapon["BF-cur"] = 
                            itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("bf")[0].attributes.akt.value;
                    }
                    if (itemArray[i].getElementsByTagName("Fernkampfwaffe")[0] !== undefined) {
            
                        if (itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0] !== undefined) newitem.system.weapon.damage = 
                            itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.mul.value + "d" +
                            itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.w.value + " + " +
                            itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.sum.value;
            
                        if (itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0] !== undefined) {
                            newitem.system.weapon.range1 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E0.value;
                            newitem.system.weapon.range2 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E1.value;
                            newitem.system.weapon.range3 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E2.value;
                            newitem.system.weapon.range4 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E3.value;
                            newitem.system.weapon.range5 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E4.value;
                        } 
                        if (itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0] !== undefined) {
                            newitem.system.weapon.tp1 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M0.value;
                            newitem.system.weapon.tp2 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M1.value;
                            newitem.system.weapon.tp3 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M2.value;
                            newitem.system.weapon.tp4 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M3.value;
                            newitem.system.weapon.tp5 = itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M4.value;
                        }
                    }
                    if (itemArray[i].getElementsByTagName("Wesen")[0] !== undefined) continue;
                    items.push(newitem);
                }
            } else event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
                "<div class='importError'>Der folgende Gegenstand konnte nicht zugewiesen werden: <br /><b>" + orignalName + "</b><br /> Nach dem Import muss jener manuell hinzugefügt werden!</div>";
        } else event.srcElement.closest("form").querySelector("[id=overview2]").innerHTML += 
            "<div class='importError'>Der folgende Gegenstand wurde nicht gefunden: <br /><b>" + orignalName + "</b><br /> Nach dem Import muss jener manuell hinzugefügt werden!</div>"; 
    }

    let attPoints = (
        parseInt(getEigenschaftFromNode(getElementByAttribute(eigenArray, "Mut"))) +
        parseInt(getEigenschaftFromNode(getElementByAttribute(eigenArray, "Klugheit"))) +
        parseInt(getEigenschaftFromNode(getElementByAttribute(eigenArray, "Intuition"))) +
        parseInt(getEigenschaftFromNode(getElementByAttribute(eigenArray, "Charisma"))) +
        parseInt(getEigenschaftFromNode(getElementByAttribute(eigenArray, "Fingerfertigkeit"))) +
        parseInt(getEigenschaftFromNode(getElementByAttribute(eigenArray, "Gewandtheit"))) +
        parseInt(getEigenschaftFromNode(getElementByAttribute(eigenArray, "Konstitution"))) +
        parseInt(getEigenschaftFromNode(getElementByAttribute(eigenArray, "Körperkraft")))
    );

    return {

        name: xml.attributes.name.value,

        info : {
            race: rasse.attributes.string.value,
            culture: basis.getElementsByTagName("kultur")[0].attributes.string.value,
            profession: basis.getElementsByTagName("ausbildungen")[0].getElementsByTagName("ausbildung")[0].attributes.string.value,
            gender: basis.getElementsByTagName("geschlecht")[0].attributes.name.value,
            age: rasse.getElementsByTagName("aussehen")[0].attributes.alter.value,
            hight: rasse.getElementsByTagName("groesse")[0].attributes.value.value,
            weight: rasse.getElementsByTagName("groesse")[0].attributes.gewicht.value,
            so: getEigenschaftFromNode(getElementByAttribute(eigenArray, "Sozialstatus")),
        },
        
        attributes : {
            mu: getEigenschaftFromNode(getElementByAttribute(eigenArray, "Mut")), 
            kl: getEigenschaftFromNode(getElementByAttribute(eigenArray, "Klugheit")), 
            in: getEigenschaftFromNode(getElementByAttribute(eigenArray, "Intuition")),
            ch: getEigenschaftFromNode(getElementByAttribute(eigenArray, "Charisma")),
            ff: getEigenschaftFromNode(getElementByAttribute(eigenArray, "Fingerfertigkeit")),
            ge: getEigenschaftFromNode(getElementByAttribute(eigenArray, "Gewandtheit")),
            ko: getEigenschaftFromNode(getElementByAttribute(eigenArray, "Konstitution")),
            kk: getEigenschaftFromNode(getElementByAttribute(eigenArray, "Körperkraft")),
        },
        
        stats : {
            ap: parseInt(xml.getElementsByTagName("basis")[0].getElementsByTagName("abenteuerpunkte")[0].attributes.value.value),
            apfree: parseInt(xml.getElementsByTagName("basis")[0].getElementsByTagName("freieabenteuerpunkte")[0].attributes.value.value),
            gp: parseInt(rasse.getElementsByTagName("aussehen")[0].attributes.gpstart.value),
            lep: getLePMod(getElementByAttribute(eigenArray, "Lebensenergie")),
            lepBuy: parseInt(getElementByAttribute(eigenArray, "Lebensenergie").attributes.value.value),
            aup: getLePMod(getElementByAttribute(eigenArray, "Ausdauer")),
            aupBuy: parseInt(getElementByAttribute(eigenArray, "Ausdauer").attributes.value.value),
            asp: parseInt(getElementByAttribute(eigenArray, "Astralenergie").attributes.mod.value),
            aspBuy: parseInt(getElementByAttribute(eigenArray, "Astralenergie").attributes.value.value),
            kap: parseInt(getElementByAttribute(eigenArray, "Karmaenergie").attributes.mod.value),
            kapBuy: parseInt(getElementByAttribute(eigenArray, "Karmaenergie").attributes.value.value),
            mr: parseInt(getElementByAttribute(eigenArray, "Magieresistenz").attributes.mod.value),
            mrBuy: parseInt(getElementByAttribute(eigenArray, "Magieresistenz").attributes.value.value),
            skills: parseInt(skillArray.length),
            attPoints: attPoints
        },

        advantages: advantage,
        disadvantages: disadvantage,
        sfGeneral: sfGeneral,
        skills: {

            "Anderthalbhänder": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Anderthalbhänder")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Anderthalbhänder")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Anderthalbhänder"))
            },
            "Armbrust": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Armbrust")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Armbrust")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Armbrust"))
            },
            "Belagerungswaffen": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Belagerungswaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Belagerungswaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Belagerungswaffen"))
            },
            "Blasrohr": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Blasrohr")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Blasrohr")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Blasrohr"))
            },
            "Bogen": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Bogen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Bogen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Bogen"))
            },
            "Diskus": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Diskus")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Diskus")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Diskus"))
            },
            "Dolche": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Dolche")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Dolche")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Dolche"))
            },
            "Fechtwaffen": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Fechtwaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Fechtwaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Fechtwaffen"))
            },
            "Hiebwaffen": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Hiebwaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Hiebwaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Hiebwaffen"))
            },
            "Infanteriewaffen": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Infanteriewaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Infanteriewaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Infanteriewaffen"))
            },
            "Kettenstäbe": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Kettenstäbe")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Kettenstäbe")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Kettenstäbe"))
            },
            "Kettenwaffen": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Kettenwaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Kettenwaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Kettenwaffen"))
            },
            "Lanzenreiten": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Lanzenreiten")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Lanzenreiten")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Lanzenreiten"))
            },
            "Peitsche": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Peitsche")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Peitsche")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Peitsche"))
            },
            "Raufen": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Raufen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Raufen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Raufen"))
            },
            "Ringen": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Ringen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Ringen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Ringen"))
            },
            "Säbel": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Säbel")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Säbel")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Säbel"))
            },
            "Schleuder": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Schleuder")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Schleuder")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Schleuder"))
            },
            "Schwerter": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Schwerter")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Schwerter")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Schwerter"))
            },
            "Speere": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Speere")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Speere")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Speere"))
            },
            "Stäbe": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Stäbe")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Stäbe")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Stäbe"))
            },
            "Wurfbeile": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Wurfbeile")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Wurfbeile")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Wurfbeile"))
            },
            "Wurfmesser": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Wurfmesser")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Wurfmesser")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Wurfmesser"))
            },
            "Wurfspeere": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Wurfspeere")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Wurfspeere")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Wurfspeere"))
            },
            "Zweihandflegel": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Zweihandflegel")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Zweihandflegel")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Zweihandflegel"))
            },
            "Zweihand-Hiebwaffen": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Zweihandhiebwaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Zweihandhiebwaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Zweihandhiebwaffen"))
            },
            "Zweihandschwerter / -säbel": {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Zweihandschwerter/-säbel")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Zweihandschwerter/-säbel")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Zweihandschwerter/-säbel"))
            },
            "Akrobatik": getSkillFromNode(getElementByAttribute(skillArray, "Akrobatik")),
            "Athletik": getSkillFromNode(getElementByAttribute(skillArray, "Athletik")),
            "Fliegen": getSkillFromNode(getElementByAttribute(skillArray, "Fliegen")),
            "Gaukeleien": getSkillFromNode(getElementByAttribute(skillArray, "Gaukeleien")),
            "Immanspiel": getSkillFromNode(getElementByAttribute(skillArray, "Immanspiel")),
            "Klettern": getSkillFromNode(getElementByAttribute(skillArray, "Klettern")),
            "Körperbeherrschung": getSkillFromNode(getElementByAttribute(skillArray, "Körperbeherrschung")),
            "Reiten": getSkillFromNode(getElementByAttribute(skillArray, "Reiten")),
            "Schleichen": getSkillFromNode(getElementByAttribute(skillArray, "Schleichen")),
            "Schwimmen": getSkillFromNode(getElementByAttribute(skillArray, "Schwimmen")),
            "Selbstbeherrschung": getSkillFromNode(getElementByAttribute(skillArray, "Selbstbeherrschung")),
            "Sich Verstecken": getSkillFromNode(getElementByAttribute(skillArray, "Sich verstecken")),
            "Singen": getSkillFromNode(getElementByAttribute(skillArray, "Singen")),
            "Sinnenschärfe": getSkillFromNode(getElementByAttribute(skillArray, "Sinnenschärfe")),
            "Skifahren": getSkillFromNode(getElementByAttribute(skillArray, "Skifahren")),
            "Stimmen Imitieren": getSkillFromNode(getElementByAttribute(skillArray, "Stimmen imitieren")),
            "Tanzen": getSkillFromNode(getElementByAttribute(skillArray, "Tanzen")),
            "Taschendiebstahl": getSkillFromNode(getElementByAttribute(skillArray, "Taschendiebstahl")),
            "Zechen": getSkillFromNode(getElementByAttribute(skillArray, "Zechen")),
            "Betören": getSkillFromNode(getElementByAttribute(skillArray, "Betören")),
            "Etikette": getSkillFromNode(getElementByAttribute(skillArray, "Etikette")),
            "Gassenwissen": getSkillFromNode(getElementByAttribute(skillArray, "Gassenwissen")),
            "Lehren": getSkillFromNode(getElementByAttribute(skillArray, "Lehren")),
            "Menschenkenntnis": getSkillFromNode(getElementByAttribute(skillArray, "Menschenkenntnis")),
            "Schauspielerei": getSkillFromNode(getElementByAttribute(skillArray, "Schauspielerei")),
            "Schriftlicher Ausdruck": getSkillFromNode(getElementByAttribute(skillArray, "Schriftlicher Ausdruck")),
            "Sich Verkleiden": getSkillFromNode(getElementByAttribute(skillArray, "Sich verkleiden")),
            "Überreden": getSkillFromNode(getElementByAttribute(skillArray, "Überreden")),
            "Überzeugen": getSkillFromNode(getElementByAttribute(skillArray, "Überzeugen")),
            "Fährtensuchen": getSkillFromNode(getElementByAttribute(skillArray, "Fährtensuchen")),
            "Fallenstellen": getSkillFromNode(getElementByAttribute(skillArray, "Fallen stellen")),
            "Fesseln / Entfesseln": getSkillFromNode(getElementByAttribute(skillArray, "Fesseln/Entfesseln")),
            "Fischen / Angeln": getSkillFromNode(getElementByAttribute(skillArray, "Fischen/Angeln")),
            "Orientierung": getSkillFromNode(getElementByAttribute(skillArray, "Orientierung")),
            "Wettervorhersage": getSkillFromNode(getElementByAttribute(skillArray, "Wettervorhersage")),
            "Wildnisleben": getSkillFromNode(getElementByAttribute(skillArray, "Wildnisleben")),
            "Anatomie": getSkillFromNode(getElementByAttribute(skillArray, "Anatomie")),
            "Baukunst": getSkillFromNode(getElementByAttribute(skillArray, "Baukunst")),
            "Brett- und Kartenspiel": getSkillFromNode(getElementByAttribute(skillArray, "Brett-/Kartenspiel")),
            "Geografie": getSkillFromNode(getElementByAttribute(skillArray, "Geografie")),
            "Geschichtswissen": getSkillFromNode(getElementByAttribute(skillArray, "Geschichtswissen")),
            "Gesteinskunde": getSkillFromNode(getElementByAttribute(skillArray, "Gesteinskunde")),
            "Götter / Kulte": getSkillFromNode(getElementByAttribute(skillArray, "Götter und Kulte")),
            "Heraldik": getSkillFromNode(getElementByAttribute(skillArray, "Heraldik")),
            "Hüttenkunde": getSkillFromNode(getElementByAttribute(skillArray, "Hüttenkunde")),
            "Kriegskunst": getSkillFromNode(getElementByAttribute(skillArray, "Kriegskunst")),
            "Kryptographie": getSkillFromNode(getElementByAttribute(skillArray, "Kryptographie")),
            "Magiekunde": getSkillFromNode(getElementByAttribute(skillArray, "Magiekunde")),
            "Mechanik": getSkillFromNode(getElementByAttribute(skillArray, "Mechanik")),
            "Pflanzenkunde": getSkillFromNode(getElementByAttribute(skillArray, "Pflanzenkunde")),
            "Philosophie": getSkillFromNode(getElementByAttribute(skillArray, "Philosophie")),
            "Rechnen": getSkillFromNode(getElementByAttribute(skillArray, "Rechnen")),
            "Rechtskunde": getSkillFromNode(getElementByAttribute(skillArray, "Rechtskunde")),
            "Sagen / Legenden": getSkillFromNode(getElementByAttribute(skillArray, "Sagen und Legenden")),
            "Schätzen": getSkillFromNode(getElementByAttribute(skillArray, "Schätzen")),
            "Sprachenkunde": getSkillFromNode(getElementByAttribute(skillArray, "Sprachenkunde")),
            "Staatskunst": getSkillFromNode(getElementByAttribute(skillArray, "Staatskunst")),
            "Sternkunde": getSkillFromNode(getElementByAttribute(skillArray, "Sternkunde")),
            "Tierkunde": getSkillFromNode(getElementByAttribute(skillArray, "Tierkunde")),
            "Abrichten": getSkillFromNode(getElementByAttribute(skillArray, "Abrichten")),
            "Ackerbau": getSkillFromNode(getElementByAttribute(skillArray, "Ackerbau")),
            "Alchimie": getSkillFromNode(getElementByAttribute(skillArray, "Alchimie")),
            "Bergbau": getSkillFromNode(getElementByAttribute(skillArray, "Bergbau")),
            "Bogenbau": getSkillFromNode(getElementByAttribute(skillArray, "Bogenbau")),
            "Boote fahren": getSkillFromNode(getElementByAttribute(skillArray, "Boote fahren")),
            "Brauer": getSkillFromNode(getElementByAttribute(skillArray, "Brauer")),
            "Drucker": getSkillFromNode(getElementByAttribute(skillArray, "Drucker")),
            "Fahrzeug lenken": getSkillFromNode(getElementByAttribute(skillArray, "Fahrzeug lenken")),
            "Falschspiel": getSkillFromNode(getElementByAttribute(skillArray, "Falschspiel")),
            "Feinmechanik": getSkillFromNode(getElementByAttribute(skillArray, "Feinmechanik")),
            "Feuersteinbearbeitung": getSkillFromNode(getElementByAttribute(skillArray, "Feuersteinbearbeitung")),
            "Fleischer": getSkillFromNode(getElementByAttribute(skillArray, "Fleischer")),
            "Gerber / Kürschner": getSkillFromNode(getElementByAttribute(skillArray, "Gerber/Kürschner")),
            "Glaskunst": getSkillFromNode(getElementByAttribute(skillArray, "Glaskunst")),
            "Grobschmied": getSkillFromNode(getElementByAttribute(skillArray, "Grobschmied")),
            "Handel": getSkillFromNode(getElementByAttribute(skillArray, "Handel")),
            "Hauswirtschaft": getSkillFromNode(getElementByAttribute(skillArray, "Hauswirtschaft")),
            "Heilkunde: Gift": getSkillFromNode(getElementByAttribute(skillArray, "Heilkunde: Gift")),
            "Heilkunde: Krankheiten": getSkillFromNode(getElementByAttribute(skillArray, "Heilkunde: Krankheiten")),
            "Heilkunde: Seele": getSkillFromNode(getElementByAttribute(skillArray, "Heilkunde: Seele")),
            "Heilkunde: Wunden": getSkillFromNode(getElementByAttribute(skillArray, "Heilkunde: Wunden")),
            "Holzbearbeitung": getSkillFromNode(getElementByAttribute(skillArray, "Holzbearbeitung")),
            "Instrumentenbauer": getSkillFromNode(getElementByAttribute(skillArray, "Instrumentenbauer")),
            "Kartografie": getSkillFromNode(getElementByAttribute(skillArray, "Kartografie")),
            "Kochen": getSkillFromNode(getElementByAttribute(skillArray, "Kochen")),
            "Kristallzucht": getSkillFromNode(getElementByAttribute(skillArray, "Kristallzucht")),
            "Lederarbeiten": getSkillFromNode(getElementByAttribute(skillArray, "Lederarbeiten")),
            "Malen / Zeichnen": getSkillFromNode(getElementByAttribute(skillArray, "Malen/Zeichnen")),
            "Maurer": getSkillFromNode(getElementByAttribute(skillArray, "Maurer")),
            "Metallguss": getSkillFromNode(getElementByAttribute(skillArray, "Metallguss")),
            "Musizieren": getSkillFromNode(getElementByAttribute(skillArray, "Musizieren")),
            "Schlösser knacken": getSkillFromNode(getElementByAttribute(skillArray, "Schlösser knacken")),
            "Schnaps brennen": getSkillFromNode(getElementByAttribute(skillArray, "Schnaps brennen")),
            "Schneidern": getSkillFromNode(getElementByAttribute(skillArray, "Schneidern")),
            "Seefahrt": getSkillFromNode(getElementByAttribute(skillArray, "Seefahrt")),
            "Seiler": getSkillFromNode(getElementByAttribute(skillArray, "Seiler")),
            "Steinmetz": getSkillFromNode(getElementByAttribute(skillArray, "Steinmetz")),
            "Steinschneider / Juwelier": getSkillFromNode(getElementByAttribute(skillArray, "Steinschneider/Juwelier")),
            "Stellmacher": getSkillFromNode(getElementByAttribute(skillArray, "Stellmacher")),
            "Stoffe färben": getSkillFromNode(getElementByAttribute(skillArray, "Stoffe färben")),
            "Tätowieren": getSkillFromNode(getElementByAttribute(skillArray, "Tätowieren")),
            "Töpfern": getSkillFromNode(getElementByAttribute(skillArray, "Töpfern")),
            "Viehzucht": getSkillFromNode(getElementByAttribute(skillArray, "Viehzucht")),
            "Webkunst": getSkillFromNode(getElementByAttribute(skillArray, "Webkunst")),
            "Winzer": getSkillFromNode(getElementByAttribute(skillArray, "Winzer")),
            "Zimmermann": getSkillFromNode(getElementByAttribute(skillArray, "Zimmermann")),
            "Empathie": getSkillFromNode(getElementByAttribute(skillArray, "Empathie")),
            "Gefahreninstinkt": getSkillFromNode(getElementByAttribute(skillArray, "Gefahreninstinkt")),
            "Geräuschhexerei": getSkillFromNode(getElementByAttribute(skillArray, "Geräuschhexerei")),
            "Magiegespühr": getSkillFromNode(getElementByAttribute(skillArray, "Magiegespür")),
            "Prophezeien": getSkillFromNode(getElementByAttribute(skillArray, "Prophezeien")),
            "Tierempathie": getSkillFromNode(getElementByAttributePart(skillArray, "Tierempathie")),
            "Zwergennase": getSkillFromNode(getElementByAttribute(skillArray, "Zwergennase")),
            "ritgild": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Gildenmagie")),
            "ritscha": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Scharlatan")),
            "ritalch": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Alchemist")),
            "ritkris": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Kristallomantie")),
            "rithexe": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Hexe")),
            "ritdrui": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Druide")),
            "ritgeod": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Geode")),
            "ritzibi": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Zibilja")),
            "ritdurr": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Durro-Dûn")),
            "ritderw": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Derwisch")),
            "rittanz": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Zaubertänzer")),
            "ritgruf": getSkillFromNode(getElementByAttribute(skillArray, "Geister rufen")),
            "ritgban": getSkillFromNode(getElementByAttribute(skillArray, "Geister bannen")),
            "ritgbin": getSkillFromNode(getElementByAttribute(skillArray, "Geister binden")),
            "ritgauf": getSkillFromNode(getElementByAttribute(skillArray, "Geister aufnehmen")),
            "ritpetr": getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Petromantie")),
            "TalentschubAbrichten": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Abrichten)")),
            "TalentschubAckerbau": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Ackerbau)")),
            "TalentschubAkrobatik": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Akrobatik)")),
            "TalentschubAlchimie": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Alchimie)")),
            "TalentschubAnatomie": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Anatomie)")),
            "TalentschubAnderthalbhänder": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Anderthalbhänder)")),
            "TalentschubArmbrust": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Armbrust)")),
            "TalentschubAthletik": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Athletik)")),
            "TalentschubBaukunst": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Baukunst)")),
            "TalentschubBelagerungswaffen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Belagerungswaffen)")),
            "TalentschubBergbau": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Bergbau)")),
            "TalentschubBetören": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Betören)")),
            "TalentschubBlasrohr": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Blasrohr)")),
            "TalentschubBogen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Bogen)")),
            "TalentschubBogenbau": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Bogenbau)")),
            "TalentschubBoote fahren": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Boote fahren)")),
            "TalentschubBrauer": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Brauer)")),
            "TalentschubBrett- und Kartenspiel": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Brett-/Kartenspiel)")),
            "TalentschubDiskus": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Diskus)")),
            "TalentschubDolche": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Dolche)")),
            "TalentschubDrucker": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Drucker)")),
            "TalentschubEtikette": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Etikette)")),
            "TalentschubFahrzeug lenken": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Fahrzeug lenken)")),
            "TalentschubFallenstellen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Fallen stellen)")),
            "TalentschubFalschspiel": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Falschspiel)")),
            "TalentschubFechtwaffen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Fechtwaffen)")),
            "TalentschubFeinmechanik": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Feinmechanik)")),
            "TalentschubFesseln / Entfesseln": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Fesseln/Entfesseln)")),
            "TalentschubFeuersteinbearbeitung": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Feuersteinbearbeitung)")),
            "TalentschubFischen / Angeln": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Fischen/Angeln)")),
            "TalentschubFleischer": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Fleischer)")),
            "TalentschubFliegen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Fliegen)")),
            "TalentschubFährtensuchen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Fährtensuchen)")),
            "TalentschubGassenwissen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Gassenwissen)")),
            "TalentschubGaukeleien": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Gaukeleien)")),
            "TalentschubGeografie": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Geografie)")),
            "TalentschubGerber / Kürschner": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Gerber/Kürschner)")),
            "TalentschubGeschichtswissen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Geschichtswissen)")),
            "TalentschubGesteinskunde": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Gesteinskunde)")),
            "TalentschubGlaskunst": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Glaskunst)")),
            "TalentschubGrobschmied": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Grobschmied)")),
            "TalentschubGötter / Kulte": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Götter und Kulte)")),
            "TalentschubHandel": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Handel)")),
            "TalentschubHauswirtschaft": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Hauswirtschaft)")),
            "TalentschubHeilkunde: Gift": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Heilkunde: Gift)")),
            "TalentschubHeilkunde: Krankheiten": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Heilkunde: Krankheiten)")),
            "TalentschubHeilkunde: Seele": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Heilkunde: Seele)")),
            "TalentschubHeilkunde: Wunden": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Heilkunde: Wunden)")),
            "TalentschubHeraldik": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Heraldik)")),
            "TalentschubHiebwaffen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Hiebwaffen)")),
            "TalentschubHolzbearbeitung": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Holzbearbeitung)")),
            "TalentschubHüttenkunde": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Hüttenkunde)")),
            "TalentschubImmanspiel": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Immanspiel)")),
            "TalentschubInfanteriewaffen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Infanteriewaffen)")),
            "TalentschubInstrumentenbauer": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Instrumentenbauer)")),
            "TalentschubKartografie": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Kartografie)")),
            "TalentschubKettenstäbe": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Kettenstäbe)")),
            "TalentschubKettenwaffen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Kettenwaffen)")),
            "TalentschubKlettern": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Klettern)")),
            "TalentschubKochen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Kochen)")),
            "TalentschubKriegskunst": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Kriegskunst)")),
            "TalentschubKristallzucht": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Kristallzucht)")),
            "TalentschubKryptographie": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Kryptographie)")),
            "TalentschubKörperbeherrschung": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Körperbeherrschung)")),
            "TalentschubLanzenreiten": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Lanzenreiten)")),
            "TalentschubLederarbeiten": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Lederarbeiten)")),
            "TalentschubLehren": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Lehren)")),
            "TalentschubMagiekunde": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Magiekunde)")),
            "TalentschubMalen / Zeichnen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Malen/Zeichnen)")),
            "TalentschubMaurer": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Maurer)")),
            "TalentschubMechanik": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Mechanik)")),
            "TalentschubMenschenkenntnis": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Menschenkenntnis)")),
            "TalentschubMetallguss": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Metallguss)")),
            "TalentschubMusizieren": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Musizieren)")),
            "TalentschubOrientierung": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Orientierung)")),
            "TalentschubPeitsche": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Peitsche)")),
            "TalentschubPflanzenkunde": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Pflanzenkunde)")),
            "TalentschubPhilosophie": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Philosophie)")),
            "TalentschubRaufen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Raufen)")),
            "TalentschubRechnen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Rechnen)")),
            "TalentschubRechtskunde": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Rechtskunde)")),
            "TalentschubReiten": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Reiten)")),
            "TalentschubRingen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Ringen)")),
            "TalentschubSagen / Legenden": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Sagen und Legenden)")),
            "TalentschubSchauspielerei": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schauspielerei)")),
            "TalentschubSchleichen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schleichen)")),
            "TalentschubSchleuder": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schleuder)")),
            "TalentschubSchlösser knacken": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schlösser knacken)")),
            "TalentschubSchnaps brennen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schnaps brennen)")),
            "TalentschubSchneidern": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schneidern)")),
            "TalentschubSchriftlicher Ausdruck": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schriftlicher Ausdruck)")),
            "TalentschubSchwerter": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schwerter)")),
            "TalentschubSchwimmen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schwimmen)")),
            "TalentschubSchätzen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Schätzen)")),
            "TalentschubSeefahrt": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Seefahrt)")),
            "TalentschubSeiler": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Seiler)")),
            "TalentschubSelbstbeherrschung": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Selbstbeherrschung)")),
            "TalentschubSich Verkleiden": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Sich verkleiden)")),
            "TalentschubSich Verstecken": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Sich verstecken)")),
            "TalentschubSingen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Singen)")),
            "TalentschubSinnenschärfe": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Sinnenschärfe)")),
            "TalentschubSkifahren": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Skifahren)")),
            "TalentschubSpeere": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Speere)")),
            "TalentschubSprachenkunde": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Sprachenkunde)")),
            "TalentschubStaatskunst": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Staatskunst)")),
            "TalentschubSteinmetz": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Steinmetz)")),
            "TalentschubSteinschneider / Juwelier": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Steinschneider/Juwelier)")),
            "TalentschubStellmacher": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Stellmacher)")),
            "TalentschubSternkunde": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Sternkunde)")),
            "TalentschubStimmen Imitieren": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Stimmen imitieren)")),
            "TalentschubStoffe färben": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Stoffe färben)")),
            "TalentschubStäbe": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Stäbe)")),
            "TalentschubSäbel": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Säbel)")),
            "TalentschubTanzen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Tanzen)")),
            "TalentschubTaschendiebstahl": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Taschendiebstahl)")),
            "TalentschubTierkunde": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Tierkunde)")),
            "TalentschubTätowieren": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Tätowieren)")),
            "TalentschubTöpfern": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Töpfern)")),
            "TalentschubViehzucht": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Viehzucht)")),
            "TalentschubWebkunst": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Webkunst)")),
            "TalentschubWettervorhersage": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Wettervorhersage)")),
            "TalentschubWildnisleben": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Wildnisleben)")),
            "TalentschubWinzer": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Winzer)")),
            "TalentschubWurfbeile": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Wurfbeile)")),
            "TalentschubWurfmesser": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Wurfmesser)")),
            "TalentschubWurfspeere": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Wurfspeere)")),
            "TalentschubZechen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Zechen)")),
            "TalentschubZimmermann": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Zimmermann)")),
            "TalentschubZweihand-Hiebwaffen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Zweihand-Hiebwaffen)")),
            "TalentschubZweihandflegel": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Zweihandflegel)")),
            "TalentschubZweihandschwerter / -säbel": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Zweihandschwerter / -säbel)")),
            "TalentschubÜberreden": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Überreden)")),
            "TalentschubÜberzeugen": getSkillFromNode(getElementByAttribute(skillArray, "Talentschub (Überzeugen)")),
            "Kräfteschub [CH]": getSkillFromNode(getElementByAttribute(skillArray, "Kraftschub (Charisma)")),
            "Kräfteschub [FF]": getSkillFromNode(getElementByAttribute(skillArray, "Kraftschub (Fingerfertigkeit)")),
            "Kräfteschub [GE]": getSkillFromNode(getElementByAttribute(skillArray, "Kraftschub (Gewandtheit)")),
            "Kräfteschub [IN]": getSkillFromNode(getElementByAttribute(skillArray, "Kraftschub (Intuition)")),
            "Kräfteschub [KK]": getSkillFromNode(getElementByAttribute(skillArray, "Kraftschub (Körperkraft)")),
            "Kräfteschub [KL]": getSkillFromNode(getElementByAttribute(skillArray, "Kraftschub (Klugheit)")),
            "Kräfteschub [KO]": getSkillFromNode(getElementByAttribute(skillArray, "Kraftschub (Konstitution)")),
            "Kräfteschub [MU]": getSkillFromNode(getElementByAttribute(skillArray, "Kraftschub (Mut)")),
            "langAlaani": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Alaani")),
            "langAureliani": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Alt-Imperial/Aureliani")),
            "langAltes Kemi": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Altes Kemi")),
            "langAngram": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Angram")),
            "langAsdharia": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Asdharia")),
            "langAtak": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Atak")),
            "langBosparano": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Bosparano")),
            "langDrachisch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Drachisch")),
            "langFerkina": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Ferkina")),
            "langFüchsisch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Füchsisch")),
            "langGarethi": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Garethi")),
            "langGoblinisch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Goblinisch")),
            "langGrolmisch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Grolmisch")),
            "langHjaldingsch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Hjaldingsch")),
            "langIsdira": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Isdira")),
            "langKoboldisch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Koboldisch")),
            "langMahrisch": getSkillFromNode(getElementByAttribute(skillArray, "prachen kennen Mahrisch")),
            "langMohisch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Mohisch")),
            "langMolochisch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Molochisch")),
            "langNeckergesang": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Neckergesang")),
            "langNujuka": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Nujuka")),
            "langOloarkh": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Oloarkh")),
            "langOloghaijan": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Ologhaijan")),
            "langRabensprache": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Rabensprache")),
            "langRissoal": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Rissoal")),
            "langRogolan": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Rogolan")),
            "langRssahh": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Rssahh")),
            "langRuuz": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Ruuz")),
            "langSprache der Blumen": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Sprache der Blumen")),
            "langThorwalsch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Thorwalsch")),
            "langTrollisch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Trollisch")),
            "langTulamidya": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Tulamidya")),
            "langUr-Tulamidya": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Urtulamidya")),
            "langZ'Lit": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Z'Lit")),
            "langZelemja": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Zelemja")),
            "langZhayad": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Zhayad")),
            "langZhulchammaqra": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Zhulchammaqra")),
            "langZyklopäisch": getSkillFromNode(getElementByAttribute(skillArray, "Sprachen kennen Zyklopäisch")),
            "signImperiale Zeichen": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben (Alt-)Imperiale Zeichen")),
            "signAltes Alaani": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Altes Alaani")),
            "signAltes Amulashtra": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Altes Amulashtra")),
            "signAltes Kemi": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Altes Kemi")),
            "signModernes Amulashtra": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Amulashtra")),
            "signAngram": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Angram")),
            "signArkanil": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Arkanil")),
            "signChrmk": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Chrmk")),
            "signChuchas": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Chuchas")),
            "signDrakhard-Zinken": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Drakhard-Zinken")),
            "signDrakned-Glyphen": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Drakned-Glyphen")),
            "signGeheiligte Glyphen von Unau": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Geheiligte Glyphen von Unau")),
            "signGimaril": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Gimaril-Glyphen")),
            "signGjalskisch": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Gjalskisch")),
            "signHjaldingsche Runen": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Hjaldingsche Runen")),
            "signAsdharia": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Isdira/Asdharia")),
            "signIsdira": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Isdira/Asdharia")),
            "signKusliker Zeichen": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Kusliker Zeichen")),
            "signMahrische Glyphen": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Mahrische Glyphen")),
            "signNanduria": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Nanduria")),
            "signRogolan": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Rogolan")),
            "signTrollische Raumbilderschrift": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Trollische Raumbilderschrift")),
            "signTulamidya": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Tulamidya")),
            "signUr-Tulamidya": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Urtulamidya")),
            "signZhayad": getSkillFromNode(getElementByAttribute(skillArray, "Lesen/Schreiben Zhayad")),
            "liturgy": getSkillFromNode(getElementByAttributePart(skillArray, "Liturgiekenntnis"))
        },
        spells : spells,
        wonders : holySpell,
        objectRit: objectRit,
        rits: sfRit,
        items: items,
        money: {
            gold: getMoneyFromNode(getElementByAttribute(moneyArray, "Dukat")),
            silver: getMoneyFromNode(getElementByAttribute(moneyArray, "Silbertaler")),
            copper: getMoneyFromNode(getElementByAttribute(moneyArray, "Heller")),
            nickel: getMoneyFromNode(getElementByAttribute(moneyArray, "Kreuzer"))
        },
    }

}

function getElementByAttribute(root, attribut) {

    for (let i = 0; i < root.length; i++) 
        if(root[i].attributes.name.value === attribut)
            return root[i];
}

function getElementByAttributePart(root, attribut) {

    for (let i = 0; i < root.length; i++) 
        if(root[i].attributes.name.value.includes(attribut))
            return root[i];
}

function getEigenschaftFromNode(node) {

    let value = parseInt(node.attributes.value.value);
    let mod = parseInt(node.attributes.mod.value);

    return value + mod;
}

function getSkillFromNode(node) {

    if (node === null) return null;
    if (node === undefined) return null;

    return node.attributes.value.value;
}

function getAtkFromNode(node) {

    if (node === null) return "";
    if (node === undefined) return "";

    return node.getElementsByTagName("attacke")[0].attributes.value.value;
}

function getDefFromNode(node) {

    if (node === null) return "";
    if (node === undefined) return "";

    return node.getElementsByTagName("parade")[0].attributes.value.value;
}

function getMoneyFromNode(node) {

    if (node === null) return 0;
    if (node === undefined) return 0;

    return parseInt(node.attributes.anzahl.value);
}

function getLePMod(node) {

    let mod = parseInt(node.attributes.mod.value);

    if(node.attributes.permanent !== undefined) mod += parseInt(node.attributes.permanent.value);

    return mod;
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

function romanToInt(roman) {
    
    const romanNumerals = {I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000};
    let result = 0;

    for (let i = 0; i < roman.length; i++) {
        const currentSymbol = romanNumerals[roman[i]];
        const nextSymbol = romanNumerals[roman[i + 1]];      
        if (nextSymbol && currentSymbol < nextSymbol) result -= currentSymbol;
        else result += currentSymbol;
    }
    
    return result;
}