import * as Util from "../../Util.js";
import * as LsFunction from "../listenerFunctions.js"
import * as Dialog from "../dialog.js";
import MultiSelect from "../apps/multiselect.js"

export default class GDSAPlayerCharakterSheet extends ActorSheet {

    sheet = {};

    static get defaultOptions() {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##            Returns the General HTML of the Sheet and defines some general Stats             ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        return foundry.utils.mergeObject(super.defaultOptions, {

            //template: "systems/gdsa/templates/sheets/charakter-sheet.hbs",
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

    get template() {

        if(this.object.permission === 1) return "systems/gdsa/templates/sheets/charakter-view.hbs";
        if(this.object.permission === 2) return "systems/gdsa/templates/sheets/charakter-sheet.hbs";
        if(this.object.permission === 3) return "systems/gdsa/templates/sheets/charakter-sheet.hbs";

        return "systems/gdsa/templates/sheets/charakter-sheet.hbs"
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
            template: CONFIG.Templates,
            effects: baseData.effects,

            // Create for each Item Type its own Array

            advantages: Util.getTemplateItems(baseData, "adva"),
            flaws: Util.getTemplateItems(baseData, "flaw"),           
            generalTraits: Util.getTemplateSF(baseData, "general", false),
            combatTraits: Util.getTemplateSF(baseData, "combat", false),
            magicTraits: Util.getTemplateSF(baseData, "magic", false),
            holyTraits: Util.getTemplateSF(baseData, "holy", false),
            ritualSkills: Util.getItems(baseData, "ritualSkill", false),
            spells: Util.getItems(baseData, "spell", false),
            rituals: (Util.getRitual(baseData,"ritual")).concat(Util.getRitual(baseData, "schama")),
            objRituals:  Util.getRitual(baseData,"objrit"),
            wonders: Util.getItems(baseData, "wonder", false),
            generals: Util.getItem(baseData, "item", false),
            meleeweapons: Util.getItem(baseData, "melee", false),
            equiptMelee: Util.getItem(baseData, "melee", true),
            rangeweapons: Util.getItem(baseData, "range", false),
            equiptRange: Util.getItem(baseData, "range", true),
            shields: Util.getItem(baseData, "shild", false),
            equiptShield: Util.getItem(baseData, "shild", true),
            armour: Util.getItem(baseData, "armour", false),
            equiptArmour: Util.getItem(baseData, "armour", true),
            affilPart: Util.getTemplateAffi(baseData, "part"),
            affilPosi: Util.getTemplateAffi(baseData, "posi"),
            affilNega: Util.getTemplateAffi(baseData, "nega")
        };

        // Create one Array with everything that is part of the Inventory

        sheetData.inventar = sheetData.meleeweapons.concat(sheetData.rangeweapons, sheetData.shields, sheetData.armour, sheetData.generals);

        // Calculate some values dependent on Items

        sheetData = this.calculateValues(sheetData);

        this.sheet = sheetData;

        return sheetData;
    }

    async activateListeners(html) {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##    Set Listener for Buttons and Links with Functions to be executed on action. e.g. Roll    ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        if(this.isEditable) {

            let sheet = this.sheet;

            // Set Listener for Char Edits

            html.find(".editFacts").click(LsFunction.editCharFacts.bind(this, sheet));
            html.find(".stat-change").click(LsFunction.editCharStats.bind(this, sheet));
            html.find(".ress-change").click(LsFunction.editCharRessource.bind(this, sheet));
            html.find(".edit-ritSkill").click(LsFunction.editRitualSkills.bind(this, sheet));

            // Set Listener for Basic Rolls
            
            html.find(".skill-roll").click(LsFunction.onSkillRoll.bind(this, sheet));
            html.find(".stat-roll").click(LsFunction.onStatRoll.bind(this, sheet));
            html.find(".flaw-roll").click(LsFunction.onFlawRoll.bind(this, sheet));
            html.find(".attack-roll").click(LsFunction.onAttackRoll.bind(this, sheet));
            html.find(".parry-roll").click(LsFunction.onParryRoll.bind(this, sheet));
            html.find(".shield-roll").click(LsFunction.onShildRoll.bind(this, sheet));
            html.find(".dogde-roll").click(LsFunction.onDogdeRoll.bind(this, sheet));
            html.find(".zone-roll").click(LsFunction.onZoneRoll.bind(this, sheet));
            html.find(".damage-roll").click(LsFunction.onDMGRoll.bind(this, sheet));
            html.find(".mirRoll").click(LsFunction.onMirikalRoll.bind(this, sheet));
            html.find(".wonder-roll").click(LsFunction.onWonderRoll.bind(this, sheet));
            html.find(".spell-roll").click(LsFunction.onSpellRoll.bind(this, sheet));
            html.find(".ritual-roll").click(LsFunction.onRitualRoll.bind(this, sheet));
            html.find(".scham-roll").click(LsFunction.onSchamanRoll.bind(this, sheet));
            html.find(".ritCrea-roll").click(LsFunction.onRitualCreation.bind(this, sheet));
            html.find(".ritAkti-roll").click(LsFunction.onRitualActivation.bind(this, sheet));
            html.find(".m-fail-roll").click(LsFunction.onCritMisMeeleRoll.bind(this, sheet));
            html.find(".r-fail-roll").click(LsFunction.onCritMisRangeRoll.bind(this, sheet));

            // Set Listener for Stat Changes

            html.find(".getHeal").click(LsFunction.onStatGain.bind(this, sheet, "LeP"));
            html.find(".getAsP").click(LsFunction.onStatGain.bind(this, sheet, "AsP"));
            html.find(".getKaP").click(LsFunction.onStatGain.bind(this, sheet, "KaP"));
            html.find(".getDMG").click(LsFunction.onStatLoss.bind(this, sheet, "LeP"));
            html.find(".lossAsP").click(LsFunction.onStatLoss.bind(this, sheet, "AsP"));
            html.find(".lossKaP").click(LsFunction.onStatLoss.bind(this, sheet, "KaP"));
            html.find(".stat-plus").click(LsFunction.onAddStat.bind(this, sheet));
            html.find(".stat-minus").click(LsFunction.onSubStat.bind(this, sheet));
            html.find(".doReg").click(LsFunction.onReg.bind(this, sheet));
            html.find(".doMedi").click(LsFunction.onMed.bind(this, sheet));
            html.find(".wp").click(LsFunction.onWoundChange.bind(this, sheet));
            html.find(".wound").click(LsFunction.onWoundChange.bind(this, sheet));

            // Set Listener for Item Events

            if(! this.id.includes("Token")) html.find(".item-create").click(LsFunction.onItemCreate.bind(this, sheet));
            if(! this.id.includes("Token")) html.find(".template-create").click(LsFunction.onTemplateCreate.bind(this, sheet));
            html.find(".item-edit").click(LsFunction.onItemEdit.bind(this, sheet));
            html.find(".advantage-create").click(LsFunction.addAdvantage.bind(this, sheet));
            html.find(".disadvantage-create").click(LsFunction.addDisadvantage.bind(this, sheet));
            html.find(".item-apply").click(LsFunction.onItemEquip.bind(this, sheet));
            html.find(".item-remove").click(LsFunction.onItemRemove.bind(this, sheet));
            if(! this.id.includes("Token")) html.find(".invItem").click(LsFunction.onItemOpen.bind(this, sheet));
            if(! this.id.includes("Token")) html.find(".invItem3").click(LsFunction.onItemOpen.bind(this, sheet));
            if(! this.id.includes("Token")) html.find(".change-money").click(LsFunction.onMoneyChange.bind(this, sheet));
            html.find(".toggleHide").click(LsFunction.onHideToggle.bind(this, sheet));
            html.find(".spell-add").click(LsFunction.getSpellContextMenu.bind(this, sheet));
            html.find(".wonder-add").click(LsFunction.getWonderContextMenu.bind(this, sheet));
            html.find(".meleeW-add").click(LsFunction.getMeleeWContextMenu.bind(this, sheet));
            html.find(".rangeW-add").click(LsFunction.getRangeWContextMenu.bind(this, sheet));
            html.find(".shilds-add").click(LsFunction.getShieldContextMenu.bind(this, sheet));
            html.find(".armour-add").click(LsFunction.getArmourContextMenu.bind(this, sheet));
            html.find(".objektRitual-add").click(LsFunction.getObjectRitContextMenu.bind(this, sheet));
            html.find(".item-delete").click(LsFunction.onItemDelete.bind(this, sheet));
            html.find(".ritCheck").change(LsFunction.changeActiveStat.bind(this, sheet));
            html.find(".castChange").change(LsFunction.changeCastZfW.bind(this, sheet));
            html.find(".test").click(LsFunction.testFunc.bind(this, sheet));

            // Set Listener for PDFoundry

            html.find(".openSpell").click(LsFunction.openPDF.bind(this, "Spell"));
            html.find(".openRitual").click(LsFunction.openPDF.bind(this, "Ritual"));
            html.find(".openWonder").click(LsFunction.openPDF.bind(this, "Wonder"));

            // Set Listeners for Navigation

            html.find(".changeTab").click(LsFunction.changeTab.bind(this, sheet));
            html.find(".showSkills").click(LsFunction.showAllSkills.bind(this, sheet));

            // Set Listener for Context / Right-Click Menu

            if(! this.id.includes("Token")) new ContextMenu(html, ".item-context", LsFunction.getItemContextMenu());

            // Set Listener on Mirakel Template Change

            html.find(".applyMirTemp").click(LsFunction.applyMirTemp.bind(this, sheet));

            // Set Listener for Skill Macrobar Support 

            let handler = ev => this._onDragStart(ev);

            // Find all items on the character sheet.
            html.find(".skillitem").each((i, li) => {

                // Add draggable attribute and dragstart listener.
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });

            html.find(".statitem").each((i, li) => {

                // Add draggable attribute and dragstart listener.
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });

            // Set Listener for Active Effects

            html.find(".effect-control").click(this._onEffectControl.bind(this));
            html.find(".data-multi-select").each((i, li) => { new MultiSelect(li) });
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
                    return (i._id !== source._id);
                });

                // Get the drop Target

                const dropTarget = event.target.closest(".item");
                const targetId = dropTarget ? dropTarget.dataset.itemId : null;
                const target = siblings.find(s => s._id === targetId);

                // Perform Sort

                const sortUpdates = SortingHelpers.performIntegerSort(source, { target: target, siblings }); 
                const updateData = sortUpdates.map(u => {
                    const update = u.update;
                    update._id = u.target._id;
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
        
        let mag1 = sheetData.advantages.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.mag1")})[0];
        let mag2 = sheetData.advantages.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.mag2")})[0];
        let mag3 = sheetData.advantages.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.mag3")})[0];
        let mag4 = sheetData.advantages.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.mag4")})[0];
        let mag5 = sheetData.flaws.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.mag4")})[0];
        let klr1 = sheetData.holyTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.lit1"))})[0];
        let klr2 = sheetData.advantages.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.kler"))})[0];
        let klr3 = sheetData.holyTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.akul"))})[0];

        if(mag1 || mag2 || mag3 || mag4 || mag5) sheetData.system.magical = true;
        if(klr1 || klr2 || klr3) sheetData.system.klerikal = true;

        sheetData.system.ATBasis.value = sheetData.system.ATBasis.value + sheetData.system.ATBasis.tempmodi;
        sheetData.system.PABasis.value = sheetData.system.PABasis.value + sheetData.system.PABasis.tempmodi;
        sheetData.system.FKBasis.value = sheetData.system.FKBasis.value + sheetData.system.FKBasis.tempmodi;
        
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

            if (item.system.armour.Z && parseInt(item.system.armour.star) > 0) m = 2;

            headArmour += parseInt(item.system.armour.head);
            n += (parseInt(item.system.armour.head) * 2);
            bodyArmour += parseInt(item.system.armour.body);
            n += (parseInt(item.system.armour.body) * 4);
            backArmour += parseInt(item.system.armour.back);
            n += (parseInt(item.system.armour.back) * 4);
            stomachArmour += parseInt(item.system.armour.stomach);
            n += (parseInt(item.system.armour.stomach) * 4);
            rightarmArmour += parseInt(item.system.armour.rightarm);
            n += (parseInt(item.system.armour.rightarm) * 1);
            leftarmArmour += parseInt(item.system.armour.leftarm);
            n += (parseInt(item.system.armour.leftarm) * 1);
            rightlegArmour += parseInt(item.system.armour.rightleg);
            n += (parseInt(item.system.armour.rightleg) * 2);
            leftlegArmour += parseInt(item.system.armour.leftleg);
            n += (parseInt(item.system.armour.leftleg) * 2);

            if (item.system.armour.Z != true) stars += parseInt(item.system.armour.star);

            gRSArmour += (n / 20);
            gBEArmour += ((n / 20) / m);
        }

        // Add Natural Armor to Ratings

        let natArmourAd = sheetData.advantages.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.natAmour"))});
        let natArmour = 0;
        if ( natArmourAd.length > 0 && natArmourAd[0].system.trait.value > 0) natArmour = natArmourAd[0].system.trait.value;

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
        
        if(checkArmour1) { 
        
            let isrightArmour = sheetData.equiptArmour.filter(function(item) {return item.system.armour.type.includes(checkArmour1.name.split("(")[1].slice(0, -1))});
            if(isrightArmour.length > 0) o = 1;
        }    

        // STEP 2 Armour Profficiany 2 & 3

        let checkArmour2 = sheetData.combatTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.armour2")})[0];
        let checkArmour3 = sheetData.combatTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.armour3")})[0];

        if(checkArmour2) o = 1;
        if(checkArmour3) o += 1;

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

        let checkFlink = sheetData.advantages.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.flink")})[0];
        let checkUnsporty = sheetData.flaws.filter(function(item) {return item.name === game.i18n.localize("GDSA.flaws.unsporty")})[0];
        let checkSmall = sheetData.flaws.filter(function(item) {return item.name === game.i18n.localize("GDSA.flaws.small")})[0];
        let checkDwarf = sheetData.flaws.filter(function(item) {return item.name === game.i18n.localize("GDSA.flaws.dwarf")})[0];
        
        sheetData.system.GS.modi = 0;

        if(checkFlink) sheetData.system.GS.modi = checkFlink.system.trait.value;
        if((parseInt(sheetData.system.GE.value) + parseInt(sheetData.system.GE.temp) + parseInt(sheetData.system.GE.baseAnti)) >= 16) sheetData.system.GS.modi += 1;
        if((parseInt(sheetData.system.GE.value) + parseInt(sheetData.system.GE.temp) + parseInt(sheetData.system.GE.baseAnti)) <= 10) sheetData.system.GS.modi -= 1;

        if(checkUnsporty) sheetData.system.GS.modi -= 1;
        if(checkSmall) sheetData.system.GS.modi -= 1;
        if(checkDwarf) sheetData.system.GS.modi -= 2;
        if(checkDwarf) sheetData.system.GS.modi -= (BE / 2);
        else sheetData.system.GS.modi -= BE;

        sheetData.system.GS.value = 8 + parseInt(sheetData.system.GS.modi) + parseInt(sheetData.system.GS.pen);

        // INI Basis - STEP 1 BE Calculation with Armour Profficiancy III

        let eBE = BE;
        let checkArmour = sheetData.combatTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.armour3")})[0];
        if(checkArmour) eBE = (BE - 2) / 2;
        if(eBE < 0) eBE = 0;

        // Calculate INIBase and Save

        let INIBase = Math.round((( parseInt(sheetData.system.MU.value) + 
                                    parseInt(sheetData.system.MU.temp) + 
                                    parseInt(sheetData.system.MU.baseAnti) + 
                                    parseInt(sheetData.system.MU.value) + 
                                    parseInt(sheetData.system.MU.temp) + 
                                    parseInt(sheetData.system.MU.baseAnti) + 
                                    parseInt(sheetData.system.IN.value) + 
                                    parseInt(sheetData.system.IN.temp) + 
                                    parseInt(sheetData.system.IN.baseAnti) + 
                                    parseInt(sheetData.system.GE.value) + 
                                    parseInt(sheetData.system.GE.temp) +
                                    parseInt(sheetData.system.GE.baseAnti)) / 5));
        sheetData.system.INIBasis.value = INIBase + sheetData.system.INIBasis.tempmodi;
        sheetData.system.INIBasis.modi = 0;

        // Get Weapon / Shield INI Modi

        let weaponModi = 0;
        if(sheetData.equiptMelee) for(const item of sheetData.equiptMelee) weaponModi += parseInt(item.system.weapon.INI);
        if(sheetData.equiptShields) for(const item of sheetData.equiptShields) weaponModi += parseInt(item.system.weapon.INI);

        sheetData.system.equipINI = weaponModi;

        // Check for Traits for Ini Calc

        let checkKampfge = sheetData.combatTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.kampfge")})[0];
        let checkKampfre = sheetData.combatTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.kampfre")})[0];
        let checkKlingen = sheetData.combatTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.klingen")})[0];

        if(checkKampfge) sheetData.system.INIBasis.modi += 2;
        if(checkKampfre) sheetData.system.INIBasis.modi += 4;

        sheetData.system.INIBasis.value = sheetData.system.INIBasis.value + sheetData.system.INIBasis.modi - eBE + sheetData.system.equipINI + sheetData.system.INIBasis.sysModi;

        // Change Dice 

        sheetData.system.INIDice = "1d6";
        if(checkKlingen) sheetData.system.INIDice = "2d6";

        // Wundschwelle

        let checkEisern = sheetData.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.iron")})[0];
        let checkGlass = sheetData.flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.glass")})[0];

        sheetData.system.WS = Math.round((parseInt(sheetData.system.KO.value) + parseInt(sheetData.system.KO.temp))/ 2);

        if(checkEisern) sheetData.system.WS += 2;
        if(checkGlass) sheetData.system.WS -= 2;

        // Ausweichen
        
        let checkDogde1 = sheetData.combatTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.dogde1")})[0];
        let checkDogde2 = sheetData.combatTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.dogde2")})[0];
        let checkDogde3 = sheetData.combatTraits.filter(function(item) {return item.name === game.i18n.localize("GDSA.trait.dogde3")})[0];

        sheetData.system.Dogde = parseInt(sheetData.system.PABasis.value);
        if(checkUnsporty) sheetData.system.Dogde -= 1;
        if(checkDogde1) sheetData.system.Dogde += 3;
        if(checkDogde2) sheetData.system.Dogde += 3;
        if(checkDogde3) sheetData.system.Dogde += 3;
        if(checkFlink) sheetData.system.Dogde += checkFlink.system.trait.value;
        sheetData.system.Dogde -= BE;

        // Calculate Dodge Bonus from Acrobatik

        let akro = sheetData.system.skill.Akrobatik;
        if(!(akro >= 0)) akro = 0;
        let akBonus = Math.floor((akro - 9) / 3);
        if(akBonus < 0) akBonus = 0;
        sheetData.system.Dogde += akBonus;

        // Add Modi to MR

        sheetData.system.MR.value = sheetData.system.MRBase + sheetData.system.MR.tempmodi;

        // Talentspezialisierungen Array Generation

        let skillSpez = sheetData.generalTraits.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.trait.talentSp"))});

        let spezObj = [];

        for (const spezi of skillSpez) {

            if(!spezi.name.includes("(")) continue;
            if(CONFIG.INIT) continue;

            let skillName = spezi.name.split("(")[0].substr(22).slice(0,-1);
            let spezilation = spezi.name.split("(")[1].slice(0, -1);

            const objekt = {
                fullstring: spezi.name,
                talentname: skillName,
                talentshort: Util.getSkillName(skillName),
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

        // Setze Meisterhandwerke

        let skillMHK = sheetData.advantages.filter(function(item) {return item.name.includes(game.i18n.localize("GDSA.advantage.mhk"))});

        let mhkObj = [];

        for (const spezi of skillMHK) {

            let skillName = spezi.name.slice(16);

            const objekt = {
                fullstring: spezi.name,
                talentname: skillName
            };

            mhkObj.push(objekt);
        }

        sheetData.system.mhkList = mhkObj;

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

        sheetData.holyTraits.sort(function(a, b){

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

    _onDragStart(event) {

        if(event.srcElement.className != "skillitem" && event.srcElement.className != "statitem") super._onDragStart(event);

        else if(event.srcElement.className === "skillitem") {

            // Get Element and Skill Infos

            let element = event.currentTarget;
            let message = element.closest(".skillitem");
            let isSpez = (message.querySelector("[class=skillTemp]").name === "spezi");
            let isMeta = (message.querySelector("[class=skillTemp]").name === "meta");
            
            // Prepare DragData

            const dragData = {
                type: "skill",
                name: message.querySelector("[class=skillTemp]").dataset.lbl,
                item: message.querySelector("[class=skillTemp]").dataset.stat,
                actorId: message.querySelector("[class=skillTemp]").dataset.actor,
                isSpez: isSpez,
                isMeta: isMeta
            };
    
            // Set data transfer
    
            event.dataTransfer.setData("text/plain", JSON.stringify(dragData));

        } else if(event.srcElement.className === "statitem") {

            // Get Element and Skill Infos

            let element = event.currentTarget;
            let message = element.closest(".statitem");
            
            // Prepare DragData

            const dragData = {
                type: "stat",
                actorId: message.dataset.actor,
                stat: message.dataset.stattype
            };
    
            // Set data transfer
    
            event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
        } 
    }
    
    _onEffectControl(event) {

        event.preventDefault();

        const owner = this.actor;
        const a = event.currentTarget;
        const li = a.closest("li");
        const effect = li?.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;

        switch (a.dataset.action) {

            case "create":
                return owner.createEmbeddedDocuments("ActiveEffect", [{
                label: "New Effect",
                icon: "icons/svg/aura.svg",
                origin: owner.uuid,
                disabled: true
                }]);

            case "edit":
                return effect.sheet.render(true);

            case "delete":
                return effect.delete();
        }
    }

    _getHeaderButtons() {

        const baseData = super._getHeaderButtons();

        let notesBnt = {"class": "note-sheet", "icon": "fas fa-sheet-plastic", "label": "Notes", "onclick":  ev => this.openNotes(ev)};

        let response = [notesBnt].concat(baseData);

        return response;
    }

    async openNotes(ev) {

        let newNote = await Dialog.editCharNotes({ "system": { "notes": this.sheet.system.note}});

        this.sheet.system.note = newNote;
    }
    
}