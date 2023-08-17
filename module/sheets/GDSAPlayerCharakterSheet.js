import * as Util from "../../Util.js";
import * as LsFunction from "../listenerFunctions.js"

export default class GDSAPlayerCharakterSheet extends ActorSheet {

    static get defaultOptions() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##            Returns the General HTML of the Sheet and defines some general Stats             ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        return mergeObject(super.defaultOptions, {

            template: "systems/GDSA/templates/sheets/charakter-sheet.hbs",
            width: 632,
            height: 825,
            resizable: false,
            tabs: [ {navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "mainPage"},
                    {navSelector: ".skill-tabs", contentSelector: ".skill-body", initial: "combatSkills"},
                    {navSelector: ".magic-tabs", contentSelector: ".magic-body", initial: "mgeneral"},
                    {navSelector: ".holy-tabs", contentSelector: ".holy-body", initial: "hgeneral"}],
            classes: ["GDSA", "sheet", "characterSheet"]
        });
    } 

    getData() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ## Creates Basic Datamodel, which is used to fill the HTML together with Handelbars with Data. ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        const baseData = super.getData();

        let sheetData = {

            // Set General Values

            owner: this.actor.isOwner,
            editable: this.isEditable,
            actor: baseData.actor,
            system: baseData.actor.system,
            items: baseData.items,
            config: CONFIG.GDSA,
            isGM: game.user.isGM,

            // Create for each Item Type its own Array

            advantages: Util.getItems(baseData, "advantage", false),
            flaws: Util.getItems(baseData, "flaw", false),           
            generalTraits: Util.getItems(baseData, "generalTrait", false),
            combatTraits: Util.getItems(baseData, "combatTrait", false),
            magicTraits: Util.getItems(baseData, "magicTrait", false),
            objectTraits: Util.getItems(baseData, "objectTrait", false),
            holyTraits: Util.getItems(baseData, "holyTrait", false),
            langs: Util.getItems(baseData, "langu", false),
            signs: Util.getItems(baseData, "signs", false),
            ritualSkills: Util.getItems(baseData, "ritualSkill", false),
            spells: Util.getItems(baseData, "spell", false),
            rituals: Util.getItems(baseData, "ritual", false),
            objRituals:  Util.getItems(baseData, "objektRitual", false),
            wonders: Util.getItems(baseData, "wonder", false),
            generals: Util.getItems(baseData, "generals", false),
            meleeweapons: Util.getItems(baseData, "melee-weapons", false),
            equiptMelee: Util.getItems(baseData, "melee-weapons", true),
            rangeweapons: Util.getItems(baseData, "range-weapons", false),
            equiptRange: Util.getItems(baseData, "range-weapons", true),
            shields: Util.getItems(baseData, "shields", false),
            equiptShield: Util.getItems(baseData, "shields", true),
            armour: Util.getItems(baseData, "armour", false),
            equiptArmour: Util.getItems(baseData, "armour", true),
        };

        // Create one Array with everything that is part of the Inventory

        sheetData.inventar = sheetData.meleeweapons.concat(sheetData.rangeweapons, sheetData.shields, sheetData.armour, sheetData.generals);

        // Calculate some values dependent on Items

        sheetData = this.calculateValues(sheetData);

        return sheetData;
    }

    activateListeners(html) {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##    Set Listener for Buttons and Links with Functions to be executed on action. e.g. Roll    ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        if(this.isEditable) {

            // Set Listener for Char Edits

            html.find(".editFacts").click(LsFunction.editeCharFacts.bind(this, this.getData()));
            html.find(".stat-change").click(LsFunction.editeCharStats.bind(this, this.getData()));
            html.find(".ress-change").click(LsFunction.editeCharRessource.bind(this, this.getData()));

            // Set Listener for Basic Rolls
            
            html.find(".skill-roll").click(LsFunction.onSkillRoll.bind(this, this.getData(), "normal"));
            html.find(".stat-roll").click(LsFunction.onStatRoll.bind(this, this.getData()));
            html.find(".flaw-roll").click(LsFunction.onFlawRoll.bind(this, this.getData()));
            html.find(".attack-roll").click(LsFunction.onAttackRoll.bind(this, this.getData()));
            html.find(".parry-roll").click(LsFunction.onParryRoll.bind(this, this.getData()));
            html.find(".shield-roll").click(LsFunction.onShildRoll.bind(this, this.getData()));
            html.find(".dogde-roll").click(LsFunction.onDogdeRoll.bind(this, this.getData()));
            html.find(".damage-roll").click(LsFunction.onDMGRoll.bind(this, this.getData()));
            html.find(".wonder-roll").click(LsFunction.onSkillRoll.bind(this, this.getData(), "wonder"));
            html.find(".spell-roll").click(LsFunction.onSpellRoll.bind(this, this.getData()));
            html.find(".ritCrea-roll").click(LsFunction.onRitualCreation.bind(this, this.getData()));
            html.find(".ritAkti-roll").click(LsFunction.onRitualActivation.bind(this, this.getData()));

            // Set Listener for Stat Changes

            html.find(".getHeal").click(LsFunction.onStatGain.bind(this, this.getData(), "LeP"));
            html.find(".getAsP").click(LsFunction.onStatGain.bind(this, this.getData(), "AsP"));
            html.find(".getKaP").click(LsFunction.onStatGain.bind(this, this.getData(), "KaP"));
            html.find(".getDMG").click(LsFunction.onStatLoss.bind(this, this.getData(), "LeP"));
            html.find(".lossAsP").click(LsFunction.onStatLoss.bind(this, this.getData(), "AsP"));
            html.find(".lossKaP").click(LsFunction.onStatLoss.bind(this, this.getData(), "KaP"));
            html.find(".stat-plus").click(LsFunction.onAddStat.bind(this, this.getData()));
            html.find(".stat-minus").click(LsFunction.onSubStat.bind(this, this.getData()));
            html.find(".doReg").click(LsFunction.onReg.bind(this, this.getData()));
            html.find(".doMedi").click(LsFunction.onMed.bind(this, this.getData()));
            html.find(".wp").click(LsFunction.onWoundChange.bind(this, this.getData()));
            html.find(".wound").click(LsFunction.onWoundChange.bind(this, this.getData()));

            // Set Listener for Item Events

            if(! this.id.includes("Token")) html.find(".item-create").click(LsFunction.onItemCreate.bind(this, this.getData()));
            if(! this.id.includes("Token")) html.find(".item-edit").click(LsFunction.onItemEdit.bind(this, this.getData()));
            html.find(".item-apply").click(LsFunction.onItemEquip.bind(this, this.getData()));
            html.find(".item-remove").click(LsFunction.onItemRemove.bind(this, this.getData()));
            if(! this.id.includes("Token")) html.find(".invItem").click(LsFunction.onItemOpen.bind(this, this.getData()));
            if(! this.id.includes("Token")) html.find(".invItem3").click(LsFunction.onItemOpen.bind(this, this.getData()));
            if(! this.id.includes("Token")) html.find(".change-money").click(LsFunction.onMoneyChange.bind(this, this.getData()));
            html.find(".toggleHide").click(LsFunction.onHideToggle.bind(this, this.getData()));
            html.find(".spell-add").click(LsFunction.getSpellContextMenu.bind(this, this.getData()));
            html.find(".meleeW-add").click(LsFunction.getMeleeWContextMenu.bind(this, this.getData()));
            html.find(".rangeW-add").click(LsFunction.getRangeWContextMenu.bind(this, this.getData()));
            html.find(".shilds-add").click(LsFunction.getShieldContextMenu.bind(this, this.getData()));
            html.find(".armour-add").click(LsFunction.getArmourContextMenu.bind(this, this.getData()));
            html.find(".objektRitual-add").click(LsFunction.getObjectRitContextMenu.bind(this, this.getData()));
            html.find(".item-delete").click(LsFunction.onItemDelete.bind(this, this.getData()));
            html.find(".ritCheck").change(LsFunction.changeActiveStat.bind(this, this.getData()));
            html.find(".castChange").change(LsFunction.changeCastZfW.bind(this, this.getData()));
            html.find(".test").change(LsFunction.testFunc.bind(this, this.getData()));

            // Set Listener for PDFoundry

            html.find(".openSpell").click(LsFunction.openPDF.bind(this, "Spell"));
            html.find(".openRitual").click(LsFunction.openPDF.bind(this, "Ritual"));
            html.find(".openWonder").click(LsFunction.openPDF.bind(this, "Wonder"));

            // Set Listeners for Navigation

            html.find(".changeTab").click(LsFunction.changeTab.bind(this, this.getData()));

            // Set Listener for Context / Right-Click Menu

            if(! this.id.includes("Token")) new ContextMenu(html, ".item-context", LsFunction.getItemContextMenu());
        }

        super.activateListeners(html);
    }

    _onSortItem(event, itemData) {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##        Overwrite of SortItem Function in order to have Drag n Drop Sorting of Items         ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        const source = this.actor.items.get(itemData._id);

        switch(source.type) {

            case "generals":
            case "melee-weapons":
            case "range-weapons":
            case "shields":
            case "armour":

                const siblings = this.actor.items.filter(i => {
                    return (i.data._id !== source.data._id);
                });

                // Get the drop Target

                const dropTarget = event.target.closest(".item");
                const targetId = dropTarget ? dropTarget.dataset.itemId : null;
                const target = siblings.find(s => s.data._id === targetId);

                // Perform Sort

                const sortUpdates = SortingHelpers.performIntegerSort(source, { target: target, siblings }); 
                const updateData = sortUpdates.map(u => {
                    const update = u.update;
                    update._id = u.target.data._id;
                    return update;
                });

                // Perform Update
                
                return this.actor.updateEmbeddedDocuments("Item", updateData);

            default:
                return super._onSortItem(event, itemData);
        }
    }

    calculateValues(sheetData) {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##    Calculation of Additional Values that are needed for the Sheet generated from Items      ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################
        
        // Check if Magical or Klerikal

        sheetData.system.magical = false;
        sheetData.system.klerikal = false;
        
        let mag1 = sheetData.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.mag1")})[0];
        let mag2 = sheetData.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.mag2")})[0];
        let mag3 = sheetData.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.mag3")})[0];
        let kler = sheetData.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.kler")})[0];

        if(mag1 != null || mag2 != null || mag3 != null) sheetData.system.magical = true;
        if(kler != null) sheetData.system.klerikal = true;
        
        // Calculate Armour Ratings

        let headArmour = 0;
        let bodyArmour = 0;
        let backArmour = 0;
        let stomachArmour = 0;
        let rightarmArmour = 0;
        let leftarmArmour = 0;
        let rightlegArmour = 0;
        let leftlegArmour = 0;
        let gRSArmour = 0;
        let gBEArmour = 0;
        let stars = 0;

        for (const item of sheetData.equiptArmour) {

            let n = 0;
            let m = 1;

            if (item.system.z && parseInt(item.system.star) > 0) m = 2;

            headArmour += parseInt(item.system.head);
            n += (parseInt(item.system.head) * 2);
            bodyArmour += parseInt(item.system.body);
            n += (parseInt(item.system.body) * 4);
            backArmour += parseInt(item.system.back);
            n += (parseInt(item.system.back) * 4);
            stomachArmour += parseInt(item.system.stomach);
            n += (parseInt(item.system.stomach) * 4);
            rightarmArmour += parseInt(item.system.rightarm);
            n += (parseInt(item.system.rightarm) * 1);
            leftarmArmour += parseInt(item.system.leftarm);
            n += (parseInt(item.system.leftarm) * 1);
            rightlegArmour += parseInt(item.system.rightleg);
            n += (parseInt(item.system.rightleg) * 2);
            leftlegArmour += parseInt(item.system.leftleg);
            n += (parseInt(item.system.leftleg) * 2);

            if (item.system.z != true) stars += parseInt(item.system.star);

            gRSArmour += (n / 20);
            gBEArmour += ((n / 20) / m);
        }

        // Add Natural Armor to Ratings

        let natArmourAd = sheetData.advantages.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.natAmour"))});
        let natArmour = 0;
        if ( natArmourAd.length > 0 && natArmourAd[0].system.value > 0) natArmour = natArmourAd[0].system.value;

        // Save Armour Rating in Actor

        sheetData.system.headArmour = headArmour + natArmour;
        sheetData.system.bodyArmour = bodyArmour + natArmour;
        sheetData.system.backArmour = backArmour + natArmour;
        sheetData.system.stomachArmour = stomachArmour + natArmour;
        sheetData.system.rightarmArmour = rightarmArmour + natArmour;
        sheetData.system.leftarmArmour = leftarmArmour + natArmour;
        sheetData.system.rightlegArmour = rightlegArmour + natArmour;
        sheetData.system.leftlegArmour = leftlegArmour + natArmour;
        sheetData.system.gRSArmour = Math.round(gRSArmour) + natArmour;

        // Calculate BE with Trait Modifiers (STEP 1 Armour Profficiany 1)

        let o = 0;

        let checkArmour1 = sheetData.combatTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.armour1") + " (")})[0];
        
        if(checkArmour1 != null) { 
        
            let isrightArmour = sheetData.equiptArmour.filter(function(item) {return item.system.type.includes(checkArmour1.name.split("(")[1].slice(0, -1))});
            if(isrightArmour.length > 0) o = 1;
        }    

        // STEP 2 Armour Profficiany 2 & 3

        let checkArmour2 = sheetData.combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.armour2")})[0];
        let checkArmour3 = sheetData.combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.armour3")})[0];

        if(checkArmour2 != null) o = 1;
        if(checkArmour3 != null) o += 1;

        // Final Amount and also so its not less than 0

        gBEArmour = gBEArmour - stars - o;
        if(gBEArmour < 0) gBEArmour = 0;
        sheetData.system.gBEArmour = Math.round(gBEArmour);

        // Set BE for other Steps
        
        let BE = parseInt(sheetData.system.gBEArmour);

        // Natural Weapon Check

        let natWeapAd = sheetData.advantages.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.natWeapon"))});
        let nWTail = natWeapAd.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.tail"))});
        let nWBite = natWeapAd.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.bite"))});

        sheetData.system.nwtail = false;
        sheetData.system.nwbite = false;

        if ( nWTail.length > 0 ) sheetData.system.nwtail = (nWTail[0].name.split("("))[1].trim().slice(0,-1).replace("w", "d");
        if ( nWBite.length > 0 ) sheetData.system.nwbite = (nWBite[0].name.split("("))[1].trim().slice(0,-1).replace("w", "d");

        // Geschwindigkeit

        let checkFlink = sheetData.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.flink")})[0];
        let checkUnsporty = sheetData.flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.unsporty")})[0];
        let checkSmall = sheetData.flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.small")})[0];
        let checkDwarf = sheetData.flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.dwarf")})[0];
        
        sheetData.system.GS.modi = 0;

        if(checkFlink != null) sheetData.system.GS.modi = checkFlink.system.value;
        if(parseInt(sheetData.system.GE.value) >= 16) sheetData.system.GS.modi += 1;
        if(parseInt(sheetData.system.GE.value) <= 10) sheetData.system.GS.modi -= 1;

        if(checkUnsporty != null) sheetData.system.GS.modi -= 1;
        if(checkSmall != null) sheetData.system.GS.modi -= 1;
        if(checkDwarf != null) sheetData.system.GS.modi -= 2;
        if(checkDwarf != null) sheetData.system.GS.modi -= (BE / 2);
        else sheetData.system.GS.modi -= BE;

        sheetData.system.GS.value = 8 + parseInt(sheetData.system.GS.modi);

        // INI Basis - STEP 1 BE Calculation with Armour Profficiancy III

        let eBE = BE;
        let checkArmour = sheetData.combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.armour3")})[0];
        if(checkArmour != null) eBE = (BE - 2) / 2;
        if(eBE < 0) eBE = 0;

        // Calculate INIBase and Save

        let INIBase = Math.round(((parseInt(sheetData.system.MU.value) + parseInt(sheetData.system.MU.value) + parseInt(sheetData.system.IN.value) + parseInt(sheetData.system.GE.value)) / 5));
        sheetData.system.INIBasis.value = INIBase;
        sheetData.system.INIBasis.modi = 0;

        // Get Weapon / Shield INI Modi

        let weaponModi = 0;
        if(sheetData.equiptMelee != null) for(const item of sheetData.equiptMelee) weaponModi += parseInt(item.system.INI);
        if(sheetData.equiptShields != null) for(const item of sheetData.equiptShields) weaponModi += parseInt(item.system.INI);

        sheetData.system.equipINI = weaponModi;

        // Check for Traits for Ini Calc

        let checkKampfge = sheetData.combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.kampfge")})[0];
        let checkKampfre = sheetData.combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.kampfre")})[0];
        let checkKlingen = sheetData.combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.klingen")})[0];

        if(checkKampfge != null) sheetData.system.INIBasis.modi += 2;
        if(checkKampfre != null) sheetData.system.INIBasis.modi += 4;

        sheetData.system.INIBasis.value = sheetData.system.INIBasis.value + sheetData.system.INIBasis.modi - eBE + sheetData.system.equipINI;

        // Change Dice 

        sheetData.system.INIDice = "1d6";
        if(checkKlingen != null) sheetData.system.INIDice = "2d6";

        // Wundschwelle

        let checkEisern = sheetData.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.iron")})[0];
        let checkGlass = sheetData.flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.glass")})[0];

        sheetData.system.WS = Math.round(parseInt(sheetData.system.KO.value) / 2);

        if(checkEisern != null) sheetData.system.WS += 2;
        if(checkGlass != null) sheetData.system.WS -= 2;

        // Ausweichen
        
        let checkDogde1 = sheetData.combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.dogde1")})[0];
        let checkDogde2 = sheetData.combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.dogde2")})[0];
        let checkDogde3 = sheetData.combatTraits.filter(function(item) {return item.name == game.i18n.localize("GDSA.trait.dogde3")})[0];

        sheetData.system.Dogde = parseInt(sheetData.system.PABasis.value);
        if(checkUnsporty != null) sheetData.system.Dogde -= 1;
        if(checkDogde1 != null) sheetData.system.Dogde += 3;
        if(checkDogde2 != null) sheetData.system.Dogde += 3;
        if(checkDogde3 != null) sheetData.system.Dogde += 3;

        // Talentspezialisierungen Array Generation

        let skillSpez = sheetData.generalTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.talentSp"))});

        let spezObj = [];

        for (const spezi of skillSpez) {

            if(!spezi.name.includes("(")) continue;

            let skillName = spezi.name.split("(")[0].substr(22).slice(0,-1);
            let spezilation = spezi.name.split("(")[1].slice(0, -1);

            const objekt = {
                fullstring: spezi.name,
                talentname: skillName,
                talentshort: Util.getSkillShort(skillName),
                spezi: spezilation
            };

            spezObj.push(objekt);
        }

        let spellSpez = sheetData.generalTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.system.zspezi"))});
        spellSpez = spellSpez.concat(sheetData.magicTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.system.zspezi"))}));

        let spelObj = [];

        for (const spezi of spellSpez) {

            if(!spezi.name.includes("(")) continue;

            let spellName = spezi.name.split("[")[0].substr(21).slice(0,-1).trim();
            let spezilation = spezi.name.split("(")[1].slice(0, -1);

            const objekt = {
                fullstring: spezi.name,
                spellname: spellName,
                spezi: spezilation
            };

            spelObj.push(objekt);
        }

        sheetData.system.SkillSpez = spezObj;
        sheetData.system.SpellSpez = spelObj;

        // Setzen der Repräsentation

        let reps = sheetData.magicTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.reps"))});

        let repObj = {

            mag: false,
            dru: false,
            bor: false,
            srl: false,
            hex: false,
            elf: false,
            sch: false,
            geo: false,
            ach: false
        };

        for (const rep of reps) {

            if(!rep.name.includes(":")) continue;

            let repname = rep.name.split(":")[1].trim();

            switch (repname) {

                case game.i18n.localize("GDSA.rep.mag"):
                    repObj.mag = true;
                    break;
                
                case game.i18n.localize("GDSA.rep.dru"):
                    repObj.dru = true;
                    break;
                
                case game.i18n.localize("GDSA.rep.bor"):
                    repObj.bor = true;
                    break;

                case game.i18n.localize("GDSA.rep.srl"):
                    repObj.srl = true;
                    break;
                    
                case game.i18n.localize("GDSA.rep.hex"):
                    repObj.hex = true;
                    break;
    
                case game.i18n.localize("GDSA.rep.elf"):
                    repObj.elf = true;
                    break;

                case game.i18n.localize("GDSA.rep.sch"):
                    repObj.sch = true;
                    break;
                        
                case game.i18n.localize("GDSA.rep.geo"):
                    repObj.geo = true;
                    break;
        
                case game.i18n.localize("GDSA.rep.ach"):
                    repObj.ach = true;
                    break;
            }
        }

        sheetData.system.Reps = repObj;
        
        // Simple Values / Grapical Values

        sheetData.system.AP.spent = parseInt(sheetData.system.AP.value) - parseInt(sheetData.system.APFree.value);        
        sheetData.system.LeP.prozent = 100 / parseInt(sheetData.system.LeP.max) * parseInt(sheetData.system.LeP.value);        
        sheetData.system.AsP.prozent = 100 / parseInt(sheetData.system.AsP.max) * parseInt(sheetData.system.AsP.value);
        sheetData.system.KaP.prozent = 100 / parseInt(sheetData.system.KaP.max) * parseInt(sheetData.system.KaP.value);

        // Set Basic Values for Rolls

        let checkGoofy = sheetData.flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.goofy")})[0];
        if(checkGoofy != null) sheetData.goofy = true;
        else sheetData.goofy = false;

        // Set Attributes in Lang und Sign 

        for (let i = 0; i < sheetData.langs.length; i++) {

            sheetData.langs[i].system.att1 = sheetData.system.KL.value;
            sheetData.langs[i].system.att2 = sheetData.system.IN.value;
            sheetData.langs[i].system.att3 = sheetData.system.CH.value;
        }

        for (let i = 0; i < sheetData.signs.length; i++) {

            sheetData.signs[i].system.att1 = sheetData.system.KL.value;
            sheetData.signs[i].system.att2 = sheetData.system.IN.value;
            sheetData.signs[i].system.att3 = sheetData.system.CH.value;
        }

        // Sort Lang, Sign, Advantages, Flaws, Spells, general and combat Traits

        sheetData.advantages.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.flaws.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
           
        sheetData.generalTraits.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.combatTraits.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.magicTraits.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.objectTraits.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.holyTraits.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
          
        sheetData.langs.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.signs.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.ritualSkills.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.spells.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
    
        sheetData.rituals.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.objRituals.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
    
        sheetData.wonders.sort(function(a, b){

            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        sheetData.ritualSkills.sort(function(a, b){

            let x = a.system.skill.toLowerCase();
            let y = b.system.skill.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
    
        return sheetData;
    }
}