import { GDSA } from "../config.js";
import GDSAActor from "../objects/GDSAActor.js";

export default class GDSAHeldenImporter extends FormApplication {

    constructor(options={}) {
        
        super(options);
        this.heroObject = {};
    }


    static get defaultOptions() {

        return mergeObject(super.defaultOptions, {
            classes: ["GDSA", "gmscreen"],
            template: "systems/GDSA/templates/apps/heldenimport.hbs",
            width: 800,
            height: 700,
            title: "Heldentool Importer"
        });
    }

    static Initialize(html) {
        
        html.find('#gdsa-options').append($(
            `<button data-action="heldentool-importer">
                <i class="fas fa-duotone fa-arrow-up-from-bracket"></i> Import Heldentool XML
            </button>`));

        html.find('button[data-action="heldentool-importer"').on("click", _ => new GDSAHeldenImporter().render(true));
    }

    getData() {

        const data = super.getData();

        return data;
    }

    activateListeners(html) {

        html.find("#Heldenimport").change(this.loadHero.bind(this));
        html.find("#bnt1").click(this.createHero.bind(this));

        super.activateListeners(html);
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

        const template = "systems/GDSA/templates/apps/heldenimportMaske.hbs";
        const html = await renderTemplate(template, hero);

        element.closest("form").querySelector("[id=overview1]").innerHTML = html;
        
    }

    async createHero(event) {

        event.preventDefault();

        const hero = this.heroObject;

        if(Object.keys(hero).length === 0) return;

        console.log(hero);

        let actor = await GDSAActor.create({
            name: "New Test Actor",
            type: "PlayerCharakter",
            img: "systems/GDSA/templates/img/logo.webp"
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

        for (let i = 0; i < hero.advantages.length; i++)
            actor.createEmbeddedDocuments("Item", [{ "name": hero.advantages[i].name, "type": "advantage", "system": { "value": hero.advantages[i].value } }]);

        for (let i = 0; i < hero.disadvantages.length; i++)
            actor.createEmbeddedDocuments("Item", [{ "name": hero.disadvantages[i].name, "type": "flaw", "system": { "value": hero.disadvantages[i].value } }]);
    
        for (let i = 0; i < hero.sfGeneral.length; i++)
            actor.createEmbeddedDocuments("Item", [{ "name": hero.sfGeneral[i], "type": "generalTrait" }]);

        for (let i = 0; i < hero.sfCombat.length; i++)
            actor.createEmbeddedDocuments("Item", [{ "name": hero.sfCombat[i], "type": "combatTrait" }]);

        for (let i = 0; i < hero.sfMagic.length; i++)
            actor.createEmbeddedDocuments("Item", [{ "name": hero.sfMagic[i], "type": "magicTrait" }]);

        for (let i = 0; i < hero.sfHoly.length; i++)
            actor.createEmbeddedDocuments("Item", [{ "name": hero.sfHoly[i], "type": "holyTrait" }]);

        for (let i = 0; i < hero.lang.length; i++)
            actor.createEmbeddedDocuments("Item", [{ "name": hero.lang[i].name, "type": "langu", "system": { "value": hero.lang[i].value, "komp": hero.lang[i].komplex } }]);

        for (let i = 0; i < hero.sign.length; i++)
            actor.createEmbeddedDocuments("Item", [{ "name": hero.sign[i].name, "type": "signs", "system": { "value": hero.sign[i].value, "komp": hero.sign[i].komplex } }]);
        

        await delay(1000);

        console.log(actor);

        actor.update({ "system.LeP.value": actor.system.LeP.max });
        actor.update({ "system.AuP.value": actor.system.AuP.max });
        actor.update({ "system.AsP.value": actor.system.AsP.max });
        actor.update({ "system.KaP.value": actor.system.KaP.max });

        if(actor.system.skill.armb.value !== null) actor.update({ "system.skill.armb.atk": (parseInt(actor.system.skill.armb.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.bela.value !== null) actor.update({ "system.skill.bela.atk": (parseInt(actor.system.skill.bela.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.blas.value !== null) actor.update({ "system.skill.blas.atk": (parseInt(actor.system.skill.blas.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.bogn.value !== null) actor.update({ "system.skill.bogn.atk": (parseInt(actor.system.skill.bogn.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.disk.value !== null) actor.update({ "system.skill.disk.atk": (parseInt(actor.system.skill.disk.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.lanz.value !== null) actor.update({ "system.skill.lanz.atk": (parseInt(actor.system.skill.lanz.value) + actor.system.ATBasis.value)});
        if(actor.system.skill.sleu.value !== null) actor.update({ "system.skill.sleu.atk": (parseInt(actor.system.skill.sleu.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.wbei.value !== null) actor.update({ "system.skill.wbei.atk": (parseInt(actor.system.skill.wbei.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.wmes.value !== null) actor.update({ "system.skill.wmes.atk": (parseInt(actor.system.skill.wmes.value) + actor.system.FKBasis.value)});
        if(actor.system.skill.wspe.value !== null) actor.update({ "system.skill.wspe.atk": (parseInt(actor.system.skill.wspe.value) + actor.system.FKBasis.value)});
    }
 
}


function generateHeroObject(event, xml) {

    let advantage = [];
    let disadvantage = [];
    let sfGeneral = [];
    let sfCombat = [];
    let sfMagic = [];
    let objectRit = [];
    let sfRit = [];
    let sfHoly = [];
    let holySpell = [];
    let langArray = [];
    let signArray = [];
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
        if (GDSA.advantages.includes(advantages[i].attributes.name.value)){

            let name = advantages[i].attributes.name.value.trim();
            let value = 0;
            
            if (advantages[i].attributes.value !== undefined)
                if (isNaN(advantages[i].attributes.value.value)) 
                    name += (" " + advantages[i].attributes.value.value);
                else value = parseInt(advantages[i].attributes.value.value);
            
            advantage.push({ name: name, value: value});

        } else if (GDSA.disadvantages.includes(advantages[i].attributes.name.value)){

            let name = advantages[i].attributes.name.value.trim();
            let value = 0;
            
            if (advantages[i].attributes.value !== undefined)
                if (isNaN(advantages[i].attributes.value.value)) 
                    name += (" " + advantages[i].attributes.value.value);
                else value = parseInt(advantages[i].attributes.value.value);

            if(advantages[i].children.length === 2) {
                if (name === "Paktierer")
                    name += " (" + advantages[i].children[0].attributes.value.value + " | " + advantages[i].children[1].attributes.value.value + ")"

                else  {

                    name += (" " + advantages[i].children[1].attributes.value.value);
                    name = name.replace(" (häufiger Auslöser) ", " ").replace(" (seltener Auslöser) ", " ");
                    value = parseInt(advantages[i].children[0].attributes.value.value);
                }

            } else if(advantages[i].children.length === 3) {
                name += (" " + advantages[i].children[2].attributes.value.value);
                name = name.replace("Schlechte Eigenschaft ", "");
                value = parseInt(advantages[i].children[1].attributes.value.value);

            }
            
            disadvantage.push({ name: name, value: value});

        } else event.currentTarget.closest("form").querySelector("[id=overview2]").innerHTML += 
                "<div class='importError'>Der folgende Vor-/Nachteil wurde nicht gefunden: <br /><b>" + advantages[i].attributes.name.value.trim() + "</b><br /> Nach dem Import muss jener manuell hinzugefügt werden!</div>";
    }

    for (let i = 0; i < spezialSkills.length; i++) {
        
        if (GDSA.sfgeneral.some( sf => spezialSkills[i].attributes.name.value.includes(sf))) {
            
            if (spezialSkills[i].attributes.name.value === "Berufsgeheimnis")
                for (let j = 0; j < spezialSkills[i].getElementsByTagName("auswahl").length; j++)
                    sfGeneral.push(spezialSkills[i].attributes.name.value + " (" +
                                    spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[0].attributes.value.value + ") " +
                                    spezialSkills[i].getElementsByTagName("auswahl")[j].getElementsByTagName("wahl")[2].attributes.value.value);

            else if (spezialSkills[i].attributes.name.value === "Ortskenntnis")
                for (let j = 0; j < spezialSkills[i].getElementsByTagName("auswahl").length; j++)
                    sfGeneral.push(spezialSkills[i].attributes.name.value + " (" +
                                    spezialSkills[i].getElementsByTagName("auswahl")[j].attributes.name.value + ")");

            else if (spezialSkills[i].attributes.name.value === "Kulturkunde")
                for (let j = 0; j < spezialSkills[i].getElementsByTagName("kultur").length; j++)
                    sfGeneral.push(spezialSkills[i].attributes.name.value + " (" +
                                    spezialSkills[i].getElementsByTagName("kultur")[j].attributes.name.value + ")");

            else if (spezialSkills[i].attributes.name.value.includes("Talentspezialisierung"))
                sfGeneral.push(spezialSkills[i].attributes.name.value)

            else sfGeneral.push(spezialSkills[i].attributes.name.value)

        } else if (GDSA.sfcombat.includes(spezialSkills[i].attributes.name.value)) {
            
            if (spezialSkills[i].attributes.name.value === "Meisterschütze")
                sfCombat.push(spezialSkills[i].attributes.name.value + " (" +
                                spezialSkills[i].getElementsByTagName("talent")[0].attributes.name.value + ")");

            else if (spezialSkills[i].attributes.name.value === "Rüstungsgewöhnung I")
                sfCombat.push(spezialSkills[i].attributes.name.value + " (" +
                                spezialSkills[i].getElementsByTagName("gegenstand")[0].attributes.name.value + ")");

            else if (spezialSkills[i].attributes.name.value === "Scharfschütze")
                sfCombat.push(spezialSkills[i].attributes.name.value + " (" +
                                spezialSkills[i].getElementsByTagName("talent")[0].attributes.name.value + ")");

            else if (spezialSkills[i].attributes.name.value === "Schnellladen")
                sfCombat.push(spezialSkills[i].attributes.name.value + " (" +
                                spezialSkills[i].getElementsByTagName("talent")[0].attributes.name.value + ")");
                            
            else sfCombat.push(spezialSkills[i].attributes.name.value)
        
        } else if (GDSA.sfmagic.some( sf => spezialSkills[i].attributes.name.value.includes(sf))) {

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

            } else sfMagic.push(spezialSkills[i].attributes.name.value)

        } else if (GDSA.sfobject.some( sf => spezialSkills[i].attributes.name.value.includes(sf))) {

            objectRit.push(spezialSkills[i].attributes.name.value)

        } else if (GDSA.sfrit.some( sf => spezialSkills[i].attributes.name.value.includes(sf))) {

            sfRit.push(spezialSkills[i].attributes.name.value)
            
        } else if (GDSA.sfholy.some( sf => spezialSkills[i].attributes.name.value.includes(sf))) {

            sfHoly.push(spezialSkills[i].attributes.name.value)
            
        } else if (spezialSkills[i].attributes.name.value.includes("Liturgie")) {

            holySpell.push(spezialSkills[i].attributes.name.value.replace("Liturgie: ", ""))
            
        } else event.currentTarget.closest("form").querySelector("[id=overview2]").innerHTML += 
        "<div class='importError'>Die folgende Sonderfertigkeit wurde nicht gefunden: <br /><b>" + spezialSkills[i].attributes.name.value.trim() + "</b><br /> Nach dem Import muss jene manuell hinzugefügt werden!</div>";

    }

    for (let i = 0; i < skillArray.length; i++) {
        
        if(skillArray[i].attributes.name.value.includes("Sprachen kennen"))
            langArray.push({ 
                name: skillArray[i].attributes.name.value.replace("Sprachen kennen ", ""),
                value: skillArray[i].attributes.value.value,
                komplex: skillArray[i].attributes.k.value
            });
        
        if(skillArray[i].attributes.name.value.includes("Lesen/Schreiben"))
            signArray.push({ 
                name: skillArray[i].attributes.name.value.replace("Lesen/Schreiben ", ""),
                value: skillArray[i].attributes.value.value,
                komplex: skillArray[i].attributes.k.value
            });
    }

    for (let i = 0; i < spellArray.length; i++) {
        
        spells.push({
            name: spellArray[i].attributes.name.value,
            value: spellArray[i].attributes.value.value,
            rep: spellArray[i].attributes.repraesentation.value
        });

    }
    
    for (let i = 0; i < itemArray.length; i++) {

        let iname = itemArray[i].attributes.name.value;
        let orgit = itemArray[i].attributes.name.value;
        let iamou = itemArray[i].attributes.anzahl.value;
        let iweig = 0;
        let icost = 0;
        let armour = null;
        let meleeW = null;
        let rangeW = null;

        if (itemArray[i].getElementsByTagName("modallgemein")[0] !== undefined) {

            iname = itemArray[i].getElementsByTagName("modallgemein")[0].getElementsByTagName("name")[0].attributes.value.value;
            iweig = itemArray[i].getElementsByTagName("modallgemein")[0].getElementsByTagName("gewicht")[0].attributes.value.value;
            icost = itemArray[i].getElementsByTagName("modallgemein")[0].getElementsByTagName("preis")[0].attributes.value.value;
        }

        if (itemArray[i].getElementsByTagName("Rüstung")[0] !== undefined) {

            armour = {};

            armour.type = itemArray[i].attributes.name.value;

            if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("kopf")[0] !== undefined) armour.head = 
                itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("kopf")[0].attributes.value.value;
            if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("brust")[0] !== undefined) armour.body = 
                itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("brust")[0].attributes.value.value;
            if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("ruecken")[0] !== undefined) armour.back = 
                itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("ruecken")[0].attributes.value.value;
            if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("bauch")[0] !== undefined) armour.stomach = 
                itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("bauch")[0].attributes.value.value;
            if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("rechterarm")[0] !== undefined) armour.rightarm = 
                itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("rechterarm")[0].attributes.value.value;
            if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("linkerarm")[0] !== undefined) armour.leftarm = 
                itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("linkerarm")[0].attributes.value.value;
            if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("rechtesbein")[0] !== undefined) armour.rightleg = 
                itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("rechtesbein")[0].attributes.value.value;
            if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("linkesbein")[0] !== undefined) armour.leftleg = 
                itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("linkesbein")[0].attributes.value.value;
            if (itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("sterne")[0] !== undefined) armour.star = 
                itemArray[i].getElementsByTagName("Rüstung")[0].getElementsByTagName("sterne")[0].attributes.value.value;
        }

        if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0] !== undefined) {

            meleeW = {};

            meleeW.type = itemArray[i].attributes.name.value;

            if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0] !== undefined) meleeW.damage = 
                itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.mul.value + "d" +
                itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.w.value + " + " +
                itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.sum.value;
            if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("wm")[0] !== undefined) meleeW["WM-ATK"] = 
                itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("wm")[0].attributes.at.value;
            if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("wm")[0] !== undefined) meleeW["WM-DEF"] = 
                itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("wm")[0].attributes.pa.value;
            if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("inimod")[0] !== undefined) meleeW.INI = 
                itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("inimod")[0].attributes.ini.value;
            if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("bf")[0] !== undefined) meleeW["BF-min"] = 
                itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("bf")[0].attributes.min.value;
            if (itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("bf")[0] !== undefined) meleeW["BF-cur"] = 
                itemArray[i].getElementsByTagName("Nahkampfwaffe")[0].getElementsByTagName("bf")[0].attributes.akt.value;
        }

        if (itemArray[i].getElementsByTagName("Fernkampfwaffe")[0] !== undefined) {

            rangeW = {};

            rangeW.type = itemArray[i].attributes.name.value;

            if (itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0] !== undefined) rangeW.damage = 
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.mul.value + "d" +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.w.value + " + " +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("trefferpunkte")[0].attributes.sum.value;
            if (itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0] !== undefined) rangeW.range = 
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E0.value + "/" +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E1.value + "/" +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E2.value + "/" +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E3.value + "/" +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("entfernung")[0].attributes.E4.value;
            if (itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0] !== undefined) rangeW.tp = 
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M0.value + "/" +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M1.value + "/" +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M2.value + "/" +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M3.value + "/" +
                itemArray[i].getElementsByTagName("Fernkampfwaffe")[0].getElementsByTagName("tpmod")[0].attributes.M4.value;
        }

        if (itemArray[i].getElementsByTagName("Wesen")[0] !== undefined) continue;

        items.push({
            name: iname,
            amount: iamou,
            weight: iweig,
            cost: icost,
            armour: armour,
            meleeW: meleeW,
            rangeW: rangeW,
            orginal: orgit
        })
        
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
        sfCombat: sfCombat,
        sfMagic: sfMagic,
        sfHoly: sfHoly,
        objectRit: objectRit,
        rits: sfRit,
        skills: {

            andr: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Anderthalbhänder")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Anderthalbhänder")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Anderthalbhänder"))
            },
            armb: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Armbrust")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Armbrust")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Armbrust"))
            },
            bela: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Belagerungswaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Belagerungswaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Belagerungswaffen"))
            },
            blas: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Blasrohr")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Blasrohr")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Blasrohr"))
            },
            bogn: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Bogen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Bogen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Bogen"))
            },
            disk: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Diskus")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Diskus")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Diskus"))
            },
            dolc: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Dolche")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Dolche")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Dolche"))
            },
            fech: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Fechtwaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Fechtwaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Fechtwaffen"))
            },
            hieb: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Hiebwaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Hiebwaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Hiebwaffen"))
            },
            infa: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Infanteriewaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Infanteriewaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Infanteriewaffen"))
            },
            kets: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Kettenstäbe")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Kettenstäbe")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Kettenstäbe"))
            },
            ketw: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Kettenwaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Kettenwaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Kettenwaffen"))
            },
            lanz: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Lanzenreiten")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Lanzenreiten")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Lanzenreiten"))
            },
            peit: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Peitsche")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Peitsche")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Peitsche"))
            },
            rauf: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Raufen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Raufen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Raufen"))
            },
            ring: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Ringen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Ringen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Ringen"))
            },
            saeb: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Säbel")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Säbel")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Säbel"))
            },
            sleu: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Schleuder")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Schleuder")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Schleuder"))
            },
            swer: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Schwerter")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Schwerter")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Schwerter"))
            },
            sper: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Speere")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Speere")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Speere"))
            },
            stab: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Stäbe")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Stäbe")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Stäbe"))
            },
            wbei: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Wurfbeile")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Wurfbeile")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Wurfbeile"))
            },
            wmes: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Wurfmesser")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Wurfmesser")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Wurfmesser"))
            },
            wspe: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Wurfspeere")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Wurfspeere")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Wurfspeere"))
            },
            zfle: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Zweihandflegel")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Zweihandflegel")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Zweihandflegel"))
            },
            zhie: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Zweihand-Hiebwaffen")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Zweihand-Hiebwaffen")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Zweihand-Hiebwaffen"))
            },
            zswe: {
                value: getSkillFromNode(getElementByAttribute(skillArray, "Zweihandschwerter / -säbel")),
                atk: getAtkFromNode(getElementByAttribute(combatArray, "Zweihandschwerter / -säbel")),
                def: getDefFromNode(getElementByAttribute(combatArray, "Zweihandschwerter / -säbel"))
            },
            akro: getSkillFromNode(getElementByAttribute(skillArray, "Akrobatik")),
            ath: getSkillFromNode(getElementByAttribute(skillArray, "Athletik")),
            fly: getSkillFromNode(getElementByAttribute(skillArray, "Fliegen")),
            gau: getSkillFromNode(getElementByAttribute(skillArray, "Gaukeleien")),
            klet: getSkillFromNode(getElementByAttribute(skillArray, "Klettern")),
            koer: getSkillFromNode(getElementByAttribute(skillArray, "Körperbeherrschung")),
            reit: getSkillFromNode(getElementByAttribute(skillArray, "Reiten")),
            schl: getSkillFromNode(getElementByAttribute(skillArray, "Schleichen")),
            swim: getSkillFromNode(getElementByAttribute(skillArray, "Schwimmen")),
            selb: getSkillFromNode(getElementByAttribute(skillArray, "Selbstbeherrschung")),
            sich: getSkillFromNode(getElementByAttribute(skillArray, "Sich verstecken")),
            sing: getSkillFromNode(getElementByAttribute(skillArray, "Singen")),
            sinn: getSkillFromNode(getElementByAttribute(skillArray, "Sinnenschärfe")),
            ski: getSkillFromNode(getElementByAttribute(skillArray, "Skifahren")),
            stim: getSkillFromNode(getElementByAttribute(skillArray, "Stimmen imitieren")),
            danc: getSkillFromNode(getElementByAttribute(skillArray, "Tanzen")),
            tasc: getSkillFromNode(getElementByAttribute(skillArray, "Taschendiebstahl")),
            zech: getSkillFromNode(getElementByAttribute(skillArray, "Zechen")),
            beto: getSkillFromNode(getElementByAttribute(skillArray, "Betören")),
            etik: getSkillFromNode(getElementByAttribute(skillArray, "Etikette")),
            gass: getSkillFromNode(getElementByAttribute(skillArray, "Gassenwissen")),
            lehr: getSkillFromNode(getElementByAttribute(skillArray, "Lehren")),
            mens: getSkillFromNode(getElementByAttribute(skillArray, "Menschenkenntnis")),
            acti: getSkillFromNode(getElementByAttribute(skillArray, "Schauspielerei")),
            writ: getSkillFromNode(getElementByAttribute(skillArray, "Schriftlicher Ausdruck")),
            clot: getSkillFromNode(getElementByAttribute(skillArray, "Sich verkleiden")),
            uber: getSkillFromNode(getElementByAttribute(skillArray, "Überreden")),
            zeug: getSkillFromNode(getElementByAttribute(skillArray, "Überzeugen")),
            faer: getSkillFromNode(getElementByAttribute(skillArray, "Fährtensuchen")),
            fall: getSkillFromNode(getElementByAttribute(skillArray, "Fallen stellen")),
            fess: getSkillFromNode(getElementByAttribute(skillArray, "Fesseln/Entfesseln")),
            fisc: getSkillFromNode(getElementByAttribute(skillArray, "Fischen/Angeln")),
            orie: getSkillFromNode(getElementByAttribute(skillArray, "Orientierung")),
            wett: getSkillFromNode(getElementByAttribute(skillArray, "Wettervorhersage")),
            wild: getSkillFromNode(getElementByAttribute(skillArray, "Wildnisleben")),
            anat: getSkillFromNode(getElementByAttribute(skillArray, "Anatomie")),
            bauk: getSkillFromNode(getElementByAttribute(skillArray, "Baukunst")),
            buks: getSkillFromNode(getElementByAttribute(skillArray, "Brett-/Kartenspiel")),
            geog: getSkillFromNode(getElementByAttribute(skillArray, "Geografie")),
            gesc: getSkillFromNode(getElementByAttribute(skillArray, "Geschichtswissen")),
            gest: getSkillFromNode(getElementByAttribute(skillArray, "Gesteinskunde")),
            goet: getSkillFromNode(getElementByAttribute(skillArray, "Götter und Kulte")),
            hera: getSkillFromNode(getElementByAttribute(skillArray, "Heraldik")),
            huet: getSkillFromNode(getElementByAttribute(skillArray, "Hüttenkunde")),
            krie: getSkillFromNode(getElementByAttribute(skillArray, "Kriegskunst")),
            kryp: getSkillFromNode(getElementByAttribute(skillArray, "Kryptographie")),
            magi: getSkillFromNode(getElementByAttribute(skillArray, "Magiekunde")),
            mech: getSkillFromNode(getElementByAttribute(skillArray, "Mechanik")),
            pfla: getSkillFromNode(getElementByAttribute(skillArray, "Pflanzenkunde")),
            phil: getSkillFromNode(getElementByAttribute(skillArray, "Philosophie")),
            calc: getSkillFromNode(getElementByAttribute(skillArray, "Rechnen")),
            rect: getSkillFromNode(getElementByAttribute(skillArray, "Rechtskunde")),
            sage: getSkillFromNode(getElementByAttribute(skillArray, "Sagen und Legenden")),
            shae: getSkillFromNode(getElementByAttribute(skillArray, "Schätzen")),
            spra: getSkillFromNode(getElementByAttribute(skillArray, "Sprachenkunde")),
            staa: getSkillFromNode(getElementByAttribute(skillArray, "Staatskunst")),
            ster: getSkillFromNode(getElementByAttribute(skillArray, "Sternkunde")),
            tier: getSkillFromNode(getElementByAttribute(skillArray, "Tierkunde")),
            abri: getSkillFromNode(getElementByAttribute(skillArray, "Abrichten")),
            acke: getSkillFromNode(getElementByAttribute(skillArray, "Ackerbau")),
            alch: getSkillFromNode(getElementByAttribute(skillArray, "Alchimie")),
            berg: getSkillFromNode(getElementByAttribute(skillArray, "Bergbau")),
            boge: getSkillFromNode(getElementByAttribute(skillArray, "Bogenbau")),
            boot: getSkillFromNode(getElementByAttribute(skillArray, "Boote fahren")),
            brau: getSkillFromNode(getElementByAttribute(skillArray, "Brauer")),
            druc: getSkillFromNode(getElementByAttribute(skillArray, "Drucker")),
            fahr: getSkillFromNode(getElementByAttribute(skillArray, "Fahrzeug lenken")),
            fals: getSkillFromNode(getElementByAttribute(skillArray, "Falschspiel")),
            fein: getSkillFromNode(getElementByAttribute(skillArray, "Feinmechanik")),
            feue: getSkillFromNode(getElementByAttribute(skillArray, "Feuersteinbearbeitung")),
            flei: getSkillFromNode(getElementByAttribute(skillArray, "Fleischer")),
            gerb: getSkillFromNode(getElementByAttribute(skillArray, "Gerber/Kürschner")),
            glas: getSkillFromNode(getElementByAttribute(skillArray, "Glaskunst")),
            grob: getSkillFromNode(getElementByAttribute(skillArray, "Grobschmied")),
            hand: getSkillFromNode(getElementByAttribute(skillArray, "Handel")),
            haus: getSkillFromNode(getElementByAttribute(skillArray, "Hauswirtschaft")),
            hgif: getSkillFromNode(getElementByAttribute(skillArray, "Heilkunde: Gift")),
            hkra: getSkillFromNode(getElementByAttribute(skillArray, "Heilkunde: Krankheiten")),
            hsee: getSkillFromNode(getElementByAttribute(skillArray, "Heilkunde: Seele")),
            hwun: getSkillFromNode(getElementByAttribute(skillArray, "Heilkunde: Wunden")),
            holz: getSkillFromNode(getElementByAttribute(skillArray, "Holzbearbeitung")),
            inst: getSkillFromNode(getElementByAttribute(skillArray, "Instrumentenbauer")),
            kart: getSkillFromNode(getElementByAttribute(skillArray, "Kartografie")),
            koch: getSkillFromNode(getElementByAttribute(skillArray, "Kochen")),
            kris: getSkillFromNode(getElementByAttribute(skillArray, "Kristallzucht")),
            lede: getSkillFromNode(getElementByAttribute(skillArray, "Lederarbeiten")),
            male: getSkillFromNode(getElementByAttribute(skillArray, "Malen/Zeichnen")),
            maur: getSkillFromNode(getElementByAttribute(skillArray, "Maurer")),
            meta: getSkillFromNode(getElementByAttribute(skillArray, "Metallguss")),
            musi: getSkillFromNode(getElementByAttribute(skillArray, "Musizieren")),
            shlo: getSkillFromNode(getElementByAttribute(skillArray, "Schlösser knacken")),
            shna: getSkillFromNode(getElementByAttribute(skillArray, "Schnaps brennen")),
            shne: getSkillFromNode(getElementByAttribute(skillArray, "Schneidern")),
            seef: getSkillFromNode(getElementByAttribute(skillArray, "Seefahrt")),
            seil: getSkillFromNode(getElementByAttribute(skillArray, "Seiler")),
            stme: getSkillFromNode(getElementByAttribute(skillArray, "Steinmetz")),
            stsh: getSkillFromNode(getElementByAttribute(skillArray, "Steinschneider/Juwelier")),
            stel: getSkillFromNode(getElementByAttribute(skillArray, "Stellmacher")),
            stof: getSkillFromNode(getElementByAttribute(skillArray, "Stoffe färben")),
            taet: getSkillFromNode(getElementByAttribute(skillArray, "Tätowieren")),
            toep: getSkillFromNode(getElementByAttribute(skillArray, "Töpfern")),
            vieh: getSkillFromNode(getElementByAttribute(skillArray, "Viehzucht")),
            webk: getSkillFromNode(getElementByAttribute(skillArray, "Webkunst")),
            winz: getSkillFromNode(getElementByAttribute(skillArray, "Winzer")),
            zimm: getSkillFromNode(getElementByAttribute(skillArray, "Zimmermann")),
            empa: getSkillFromNode(getElementByAttribute(skillArray, "Empathie")),
            gefa: getSkillFromNode(getElementByAttribute(skillArray, "Gefahreninstinkt")),
            gera: getSkillFromNode(getElementByAttribute(skillArray, "Geräuschhexerei")),
            krae: getSkillFromNode(getElementByAttribute(skillArray, "Kräfteschub")),
            magg: getSkillFromNode(getElementByAttribute(skillArray, "Magiegespür")),
            prop: getSkillFromNode(getElementByAttribute(skillArray, "Prophezeien")),
            tale: getSkillFromNode(getElementByAttributePart(skillArray, "Talentschub")),
            tiem: getSkillFromNode(getElementByAttributePart(skillArray, "Tierempathie")),
            zwer: getSkillFromNode(getElementByAttribute(skillArray, "Zwergennase")),
            ritgild: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Gildenmagie")),
            ritscha: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Scharlatan")),
            ritalch: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Alchemist")),
            ritkris: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Kristallomantie")),
            rithexe: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Hexe")),
            ritdrui: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Druide")),
            ritgeod: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Geode")),
            ritzibi: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Zibilja")),
            ritdurr: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Durro-Dûn")),
            ritderw: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Derwisch")),
            rittanz: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Zaubertänzer")),
            ritbard: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Zauberbarde")),
            ritgruf: getSkillFromNode(getElementByAttribute(skillArray, "Geister rufen")),
            ritgban: getSkillFromNode(getElementByAttribute(skillArray, "Geister bannen")),
            ritgbin: getSkillFromNode(getElementByAttribute(skillArray, "Geister binden")),
            ritgauf: getSkillFromNode(getElementByAttribute(skillArray, "Geister aufnehmen")),
            ritpetr: getSkillFromNode(getElementByAttribute(skillArray, "Ritualkenntnis: Petromantie")),
            liturgy: getSkillFromNode(getElementByAttributePart(skillArray, "Liturgiekenntnis"))
        },
        lang : langArray,
        sign : signArray,
        spells : spells,
        wonders : holySpell,
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
