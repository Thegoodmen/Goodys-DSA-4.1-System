import * as Util from "../../Util.js";
import * as LsFunction from "../listenerFunctions.js"
import * as Dialog from "../dialog.js";

const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export default class GDSAPlayerCharakterSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

    sheet = {};

    static DEFAULT_OPTIONS = {
        tag: "form",
        classes: ["GDSA", "sheet", "characterSheet"],
        actions: {
            note: this.openNotes,
            effect: this.openEffectList
        },
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        position: {
            width: 640,
            height: 835
        },
        window: {
            controls: [
                { class: "effe-sheet", icon: "fas fa-star", label: "Effects", action: "effect" },
                { class: "note-sheet", icon: "fas fa-sheet-plastic", label: "Notes", action: "note" }
            ]
        }
    }

    static PARTS = {

        osheet: { template: "systems/gdsa/templates/sheets/charakter-sheet.hbs" },
        view: { template: "systems/gdsa/templates/partials/charakter-sheet-view.hbs" }
    }

    get title() {

        return this.actor.name;
    }

    /** @override */
    _configureRenderOptions(options) {
        super._configureRenderOptions(options);
        if(this.options.document.permission === 1) options.parts = ["view"]
        else options.parts = ["osheet"];
    }
    
    /** @override */
    async _prepareContext(options) {
        
        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ## Creates Basic Datamodel, which is used to fill the HTML together with Handelbars with Data. ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################
        
        const baseData = await super._prepareContext(options);

        let context = {
            
            // Set General Values
            owner: baseData.document.isOwner,
            editable: baseData.editable,
            actor: baseData.document,
            system: baseData.document.system,
            items: baseData.document.items,
            config: CONFIG.GDSA,
            isGM: baseData.user.isGM,
            template: CONFIG.Templates,
            effects: baseData.document.effects,
            
            // Create for each Item Type its own Array
            
            advantages: Util.getTemplateItems(baseData.document, "adva"),
            flaws: Util.getTemplateItems(baseData.document, "flaw"),           
            generalTraits: Util.getTemplateSF(baseData.document, "general", false),
            combatTraits: Util.getTemplateSF(baseData.document, "combat", false),
            magicTraits: Util.getTemplateSF(baseData.document, "magic", false),
            holyTraits: Util.getTemplateSF(baseData.document, "holy", false),
            ritualSkills: Util.getItems(baseData.document, "ritualSkill", false),
            spells: Util.getItems(baseData.document, "spell", false),
            rituals: (Util.getRitual(baseData.document,"ritual")).concat(Util.getRitual(baseData.document, "schama")),
            objRituals:  Util.getRitual(baseData.document,"objrit"),
            wonders: Util.getItems(baseData.document, "wonder", false),
            generals: Util.getItem(baseData.document, "item", false),
            meleeweapons: Util.getItem(baseData.document, "melee", false),
            equiptMelee: Util.getItem(baseData.document, "melee", true),
            rangeweapons: Util.getItem(baseData.document, "range", false),
            equiptRange: Util.getItem(baseData.document, "range", true),
            shields: Util.getItem(baseData.document, "shild", false),
            equiptShield: Util.getItem(baseData.document, "shild", true),
            armour: Util.getItem(baseData.document, "armour", false),
            equiptArmour: Util.getItem(baseData.document, "armour", true),
            affilPart: Util.getTemplateAffi(baseData.document, "part"),
            affilPosi: Util.getTemplateAffi(baseData.document, "posi"),
            affilNega: Util.getTemplateAffi(baseData.document, "nega")
        };
        
        // Create one Array with everything that is part of the Inventory
        
        context.inventar = context.meleeweapons.concat(context.rangeweapons, context.shields, context.armour, context.generals);
        
        // Calculate some values dependent on Items
        
        context = this.calculateValues(context);
        
        this.sheet = context;
        
        return context;
    }
    
    /** @override */
    _onRender(context, options) {
        
        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##    Set Listener for Buttons and Links with Functions to be executed on action. e.g. Roll    ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        super._onRender(context, options);
        
        new foundry.applications.ux.Tabs({navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "mainPage"}).bind(this.element);
        new foundry.applications.ux.Tabs({navSelector: ".skill-tabs", contentSelector: ".skill-body", initial: "combatSkills"}).bind(this.element);
        new foundry.applications.ux.Tabs({navSelector: ".magic-tabs", contentSelector: ".magic-body", initial: "mgeneral"}).bind(this.element);
        new foundry.applications.ux.Tabs({navSelector: ".holy-tabs", contentSelector: ".holy-body", initial: "hgeneral"}).bind(this.element);
        
        if(this.isEditable) {

            let sheet = this.sheet;

            // Set Listener for Char Edits

            this.element.querySelectorAll(".editFacts").forEach(action => { action.addEventListener("click", (e) => LsFunction.editCharFacts(sheet, e)) });
            this.element.querySelectorAll(".stat-change").forEach(action => { action.addEventListener("click", (e) => LsFunction.editCharStats(sheet, e)) });
            this.element.querySelectorAll(".ress-change").forEach(action => { action.addEventListener("click", (e) => LsFunction.editCharRessource(sheet, e)) });
            this.element.querySelectorAll(".edit-ritSkill").forEach(action => { action.addEventListener("click",(e) => LsFunction.editRitualSkills(sheet, e)) });

            // Set Listener for Basic Rolls
            
            this.element.querySelectorAll(".skill-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onSkillRoll(sheet, e)) });
            this.element.querySelectorAll(".litSkill-roll").forEach(action => { action.addEventListener("click",(e) => LsFunction.onLitRoll(sheet, e))});
            this.element.querySelectorAll(".stat-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onStatRoll(sheet, e)) });
            this.element.querySelectorAll(".flaw-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onFlawRoll(sheet, e)) });
            this.element.querySelectorAll(".attack-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onAttackRoll(sheet, e)) });
            this.element.querySelectorAll(".parry-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onParryRoll(sheet, e)) });
            this.element.querySelectorAll(".shield-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onShildRoll(sheet, e)) });
            this.element.querySelectorAll(".dogde-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onDogdeRoll(sheet, e)) });
            this.element.querySelectorAll(".zone-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onZoneRoll(sheet, e)) });
            this.element.querySelectorAll(".damage-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onDMGRoll(sheet, e)) });
            this.element.querySelectorAll(".mirRoll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onMirikalRoll(sheet, e)) });
            this.element.querySelectorAll(".wonder-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onWonderRoll(sheet, e)) });
            this.element.querySelectorAll(".spell-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onSpellRoll(sheet, e)) });
            this.element.querySelectorAll(".ritual-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onRitualRoll(sheet, e)) });
            this.element.querySelectorAll(".scham-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onSchamanRoll(sheet, e)) });
            this.element.querySelectorAll(".ritCrea-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onRitualCreation(sheet, e)) });
            this.element.querySelectorAll(".ritAkti-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onRitualActivation(sheet, e)) });
            this.element.querySelectorAll(".m-fail-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onCritMisMeeleRoll(sheet, e)) });
            this.element.querySelectorAll(".r-fail-roll").forEach(action => { action.addEventListener("click", (e) => LsFunction.onCritMisRangeRoll(sheet, e)) });

            // Set Listener for Stat Changes

            this.element.querySelectorAll(".getHeal").forEach(action => { action.addEventListener("click", (e) => LsFunction.onStatGain(sheet, "LeP", e)) });
            this.element.querySelectorAll(".getAsP").forEach(action => { action.addEventListener("click", (e) => LsFunction.onStatGain(sheet, "AsP", e)) });
            this.element.querySelectorAll(".getKaP").forEach(action => { action.addEventListener("click", (e) => LsFunction.onStatGain(sheet, "KaP", e)) });
            this.element.querySelectorAll(".getDMG").forEach(action => { action.addEventListener("click", (e) => LsFunction.onStatLoss(sheet, "LeP", e)) });
            this.element.querySelectorAll(".lossAsP").forEach(action => { action.addEventListener("click", (e) => LsFunction.onStatLoss(sheet, "AsP", e)) });
            this.element.querySelectorAll(".lossKaP").forEach(action => { action.addEventListener("click", (e) => LsFunction.onStatLoss(sheet, "KaP", e)) });
            this.element.querySelectorAll(".stat-plus").forEach(action => { action.addEventListener("click", (e) => LsFunction.onAddStat(sheet, e)) });
            this.element.querySelectorAll(".stat-minus").forEach(action => { action.addEventListener("click", (e) => LsFunction.onSubStat(sheet, e)) });
            this.element.querySelectorAll(".doReg").forEach(action => { action.addEventListener("click", (e) => LsFunction.onReg(sheet, e)) });
            this.element.querySelectorAll(".doMedi").forEach(action => { action.addEventListener("click", (e) => LsFunction.onMed(sheet, e)) });
            this.element.querySelectorAll(".wound").forEach(action => { action.addEventListener("click", (e) => LsFunction.onWoundChange(sheet, e)) });
            this.element.querySelectorAll(".wound").forEach(action => { action.addEventListener("contextmenu", (e) => LsFunction.onWoundChange(sheet, e)) });
            this.element.querySelectorAll(".effectmainBNT").forEach(action => { action.addEventListener("click", (e) => LsFunction.onEffectToggle(sheet, e)) });
            this.element.querySelectorAll(".effectupBNT").forEach(action => { action.addEventListener("click", (e) => LsFunction.onEffectUp(sheet, e)) });
            this.element.querySelectorAll(".effectdownBNT").forEach(action => { action.addEventListener("click", (e) => LsFunction.onEffectDown(sheet, e)) });

            // Set Listener for Item Events

            this.element.querySelectorAll(".item-edit").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemEdit(sheet, e)) });
            this.element.querySelectorAll(".advantage-create").forEach(action => { action.addEventListener("click", (e) => LsFunction.addAdvantage(sheet, e)) });
            this.element.querySelectorAll(".disadvantage-create").forEach(action => { action.addEventListener("click", (e) => LsFunction.addDisadvantage(sheet, e)) });
            this.element.querySelectorAll(".item-apply").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemEquip(sheet, e)) });
            this.element.querySelectorAll(".item-remove").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemRemove(sheet, e)) });
            this.element.querySelectorAll(".toggleHide").forEach(action => { action.addEventListener("click", (e) => LsFunction.onHideToggle(sheet, e)) });
            this.element.querySelectorAll(".spell-add").forEach(action => { action.addEventListener("click", (e) => LsFunction.getSpellContextMenu(sheet, e)) });
            this.element.querySelectorAll(".wonder-add").forEach(action => { action.addEventListener("click", (e) => LsFunction.getWonderContextMenu(sheet, e)) });
            this.element.querySelectorAll(".meleeW-add").forEach(action => { action.addEventListener("click", (e) => LsFunction.getMeleeWContextMenu(sheet, e)) });
            this.element.querySelectorAll(".rangeW-add").forEach(action => { action.addEventListener("click", (e) => LsFunction.getRangeWContextMenu(sheet, e)) });
            this.element.querySelectorAll(".shilds-add").forEach(action => { action.addEventListener("click", (e) => LsFunction.getShieldContextMenu(sheet, e)) });
            this.element.querySelectorAll(".armour-add").forEach(action => { action.addEventListener("click", (e) => LsFunction.getArmourContextMenu(sheet, e)) });
            this.element.querySelectorAll(".ritual-add").forEach(action => { action.addEventListener("click", (e) => LsFunction.getRitContextMenu(sheet, e)) });
            this.element.querySelectorAll(".item-add").forEach(action => { action.addEventListener("click", (e) => LsFunction.getGenItemContextMenu(sheet, e)) });
            this.element.querySelectorAll(".objektRitual-add").forEach(action => { action.addEventListener("click", (e) => LsFunction.getObjectRitContextMenu(sheet, e)) });
            this.element.querySelectorAll(".item-delete").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemDelete(sheet, e)) });

            this.element.querySelectorAll(".ritCheck").forEach(action => { action.addEventListener("change", (e) => LsFunction.changeActiveStat(sheet, e)) });
            this.element.querySelectorAll(".castChange").forEach(action => { action.addEventListener("change", (e) => LsFunction.changeCastZfW(sheet, e)) });

            if(! this.id.includes("Token")) {

                this.element.querySelectorAll(".item-create").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemCreate(sheet, e)) });
                this.element.querySelectorAll(".template-create").forEach(action => { action.addEventListener("click", (e) => LsFunction.onTemplateCreate(sheet, e)) });
                this.element.querySelectorAll(".invItem").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemOpen(sheet, e)) });
                this.element.querySelectorAll(".invItem3").forEach(action => { action.addEventListener("click", (e) => LsFunction.onItemOpen(sheet, e)) });
                this.element.querySelectorAll(".change-money").forEach(action => { action.addEventListener("click", (e) => LsFunction.onMoneyChange(sheet, e)) });
            
                // Set Listener for Context / Right-Click Menu

                new foundry.applications.ux.ContextMenu.implementation(this.element, ".item-context", LsFunction.getItemContextMenu(), {jQuery: false});
            }
            
            // Set Listener for PDFoundry
        
            this.element.querySelectorAll(".openSpell").forEach(action => { action.addEventListener("click", (e) => LsFunction.openPDF.bind("Spell", e)) });
            this.element.querySelectorAll(".openRitual").forEach(action => { action.addEventListener("click", (e) => LsFunction.openPDF.bind("Ritual", e)) });
            this.element.querySelectorAll(".openWonder").forEach(action => { action.addEventListener("click", (e) => LsFunction.openPDF.bind("Wonder", e)) });
        
            // Set Listeners for Navigation
        
            this.element.querySelectorAll(".changeTab").forEach(action => { action.addEventListener("click", (e) => LsFunction.changeTab(sheet, e)) });
            this.element.querySelectorAll(".showSkills").forEach(action => { action.addEventListener("click", (e) => LsFunction.showAllSkills(sheet, e)) });
            this.element.querySelectorAll(".menuSubItem").forEach(action => { action.addEventListener("click", (e) => LsFunction.changeSubTab(sheet, e)) });
        
            // Set Listener on Mirakel Template Change
        
            this.element.querySelectorAll(".applyMirTemp").forEach(action => { action.addEventListener("click", (e) => LsFunction.applyMirTemp(sheet, e)) });
            
            // Set Listener for Active Effects

            this.element.querySelectorAll(".effect-control").forEach(action => { action.addEventListener("click",  (e) => this._onEffectControl(e)) });
        
            // Set Listener for Skill Macrobar Support 
        
            let handler = ev => this._onDragStart(ev);

            // Find all items on the character sheet.
            this.element.querySelectorAll(".skillitem").forEach(action => {

                // Add draggable attribute and dragstart listener.
                action.setAttribute("draggable", true);
                action.addEventListener("dragstart", handler, false);
            });

            this.element.querySelectorAll(".statitem").forEach(action => {

                // Add draggable attribute and dragstart listener.
                action.setAttribute("draggable", true);
                action.addEventListener("dragstart", handler, false);
            });
        };

        let mainTabs = this.actor.getFlag('gdsa', 'primaryTabSelection');
        
        if(mainTabs != null) {

            let tabs = this.element.closest("form").querySelector(".sheet-body");
            let activeTab = tabs.querySelector(".tab.primary.active");
            let destinationTab = tabs.querySelector("#"+mainTabs);
            
            activeTab.classList.remove("active");
            destinationTab.classList.add("active")
            
            let nav = this.element.closest("form").querySelector(".sheet-tabs");
            let activeNav = nav.querySelectorAll(".item.menuMainItem.active");
            let destinationNav = nav.querySelectorAll("#"+mainTabs);

            let sheet =  this.element.closest("form").querySelector(".sheet");
            let sheetMenu = sheet.querySelector(".menuBar");
            if(mainTabs === "characterView") sheetMenu.style.display = "none";
            if(mainTabs === "mainPage") sheetMenu.style.display = "block";
            
            activeNav.forEach(navElement => { navElement.classList.remove("active") });
            destinationNav.forEach(navElement => { navElement.classList.add("active") });
        }

        let skillTabs = this.actor.getFlag('gdsa', 'skillTabSelection');
        
        if(skillTabs != null) {

            let tabs = this.element.closest("form").querySelector(".skill-body");
            let activeTab = tabs.querySelector(".tab.skillsBox.active");
            let destinationTab = tabs.querySelector("#"+skillTabs);
            
            activeTab.classList.remove("active");
            destinationTab.classList.add("active")
            
            let nav = this.element.closest("form").querySelector(".skill-tabs");
            let activeNav = nav.querySelectorAll(".item.menuSubItem.active");
            let destinationNav = nav.querySelectorAll("#"+skillTabs);
            
            activeNav.forEach(navElement => { navElement.classList.remove("active") });
            destinationNav.forEach(navElement => { navElement.classList.add("active") });
        }

        let magicTabs = this.actor.getFlag('gdsa', 'magicTabSelection');
        
        if(magicTabs != null) {

            let tabs = this.element.closest("form").querySelector(".magic-body");
            let activeTab = tabs.querySelector(".tab.magicBox.active");
            let destinationTab = tabs.querySelector("#"+magicTabs);
            
            activeTab.classList.remove("active");
            destinationTab.classList.add("active")
            
            let nav = this.element.closest("form").querySelector(".magic-tabs");
            let activeNav = nav.querySelectorAll(".item.menuSubItem.active");
            let destinationNav = nav.querySelectorAll("#"+magicTabs);
            
            activeNav.forEach(navElement => { navElement.classList.remove("active") });
            destinationNav.forEach(navElement => { navElement.classList.add("active") });
        }

        let holyTabs = this.actor.getFlag('gdsa', 'holyTabSelection');
        
        if(holyTabs != null) {

            let tabs = this.element.closest("form").querySelector(".holy-body");
            let activeTab = tabs.querySelector(".tab.magicBox.active");
            let destinationTab = tabs.querySelector("#"+holyTabs);
            
            activeTab.classList.remove("active");
            destinationTab.classList.add("active")
            
            let nav = this.element.closest("form").querySelector(".holy-tabs");
            let activeNav = nav.querySelectorAll(".item.menuSubItem.active");
            let destinationNav = nav.querySelectorAll("#"+holyTabs);
            
            activeNav.forEach(navElement => { navElement.classList.remove("active") });
            destinationNav.forEach(navElement => { navElement.classList.add("active") });
        }
    }

    /** @override */
    _onSortItem(event, itemData) {

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##        Overwrite of SortItem Function in order to have Drag n Drop Sorting of Items         ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################

        const source = this.actor.items.get(itemData._id);
        console.log("here");
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
    
    /** @override */
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
        
    /** @override */
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

        sheetData.system.ATBasis.value = sheetData.system.ATBasis.base + sheetData.system.ATBasis.tempmodi;
        sheetData.system.PABasis.value = sheetData.system.PABasis.base + sheetData.system.PABasis.tempmodi;
        sheetData.system.FKBasis.value = sheetData.system.FKBasis.base + sheetData.system.FKBasis.tempmodi;
        
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

        if ( nWTail.length > 0 ) sheetData.system.nwtail = (nWTail[0].name.split("("))[1].trim().slice(0,-2).toLowerCase().replace("w", "d");
        if ( nWBite.length > 0 ) sheetData.system.nwbite = (nWBite[0].name.split("("))[1].trim().slice(0,-2).toLowerCase().replace("w", "d");

        // Geschwindigkeit

        let checkFlink = sheetData.advantages.filter(function(item) {return item.name === game.i18n.localize("GDSA.advantage.flink")})[0];
        let checkUnsporty = sheetData.flaws.filter(function(item) {return item.name === game.i18n.localize("GDSA.flaws.unsporty")})[0];
        let checkSmall = sheetData.flaws.filter(function(item) {return item.name === game.i18n.localize("GDSA.flaws.small")})[0];
        let checkDwarf = sheetData.flaws.filter(function(item) {return item.name === game.i18n.localize("GDSA.flaws.dwarf")})[0];
        
        sheetData.system.GS.modi = 0;

        if(checkFlink) sheetData.system.GS.modi = checkFlink.system.trait.value;
        if((parseInt(sheetData.system.GE.value === null ? 0 : sheetData.system.GE.value) + parseInt(sheetData.system.GE.temp === null ? 0 : sheetData.system.GE.temp) + parseInt(sheetData.system.GE.baseAnti)) >= 16) sheetData.system.GS.modi += 1;
        if((parseInt(sheetData.system.GE.value === null ? 0 : sheetData.system.GE.value) + parseInt(sheetData.system.GE.temp === null ? 0 : sheetData.system.GE.temp) + parseInt(sheetData.system.GE.baseAnti)) <= 10) sheetData.system.GS.modi -= 1;

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

        let INIBase = Math.round((( parseInt(sheetData.system.MU.value === null ? 0 : parseInt(sheetData.system.MU.value)) + 
                                    parseInt(sheetData.system.MU.temp === null ? 0 : parseInt(sheetData.system.MU.temp)) + 
                                    parseInt(sheetData.system.MU.baseAnti) + 
                                    parseInt(sheetData.system.MU.value === null ? 0 : parseInt(sheetData.system.MU.value)) + 
                                    parseInt(sheetData.system.MU.temp === null ? 0 : parseInt(sheetData.system.MU.temp)) + 
                                    parseInt(sheetData.system.MU.baseAnti) + 
                                    parseInt(sheetData.system.IN.value === null ? 0 : parseInt(sheetData.system.IN.value)) + 
                                    parseInt(sheetData.system.IN.temp === null ? 0 : parseInt(sheetData.system.IN.temp)) + 
                                    parseInt(sheetData.system.IN.baseAnti) + 
                                    parseInt(sheetData.system.GE.value === null ? 0 : parseInt(sheetData.system.GE.value)) + 
                                    parseInt(sheetData.system.GE.temp === null ? 0 : parseInt(sheetData.system.GE.temp)) +
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

        sheetData.system.iniBaseValue = sheetData.system.INIBasis.value + sheetData.system.INIBasis.modi + sheetData.system.INIBasis.sysModi;
        sheetData.system.INIBasis.value = sheetData.system.INIBasis.value + sheetData.system.INIBasis.modi - eBE + sheetData.system.equipINI + sheetData.system.INIBasis.sysModi;

        // Change Dice 

        sheetData.system.INIDice = "1d6";
        if(checkKlingen) sheetData.system.INIDice = "2d6";

        // Wundschwelle

        let checkEisern = sheetData.advantages.filter(function(item) {return item.name == game.i18n.localize("GDSA.advantage.iron")})[0];
        let checkGlass = sheetData.flaws.filter(function(item) {return item.name == game.i18n.localize("GDSA.flaws.glass")})[0];

        sheetData.system.WS = Math.round((parseInt(sheetData.system.KO.value === null ? 0 : sheetData.system.KO.value) + parseInt(sheetData.system.KO.temp === null ? 0 : sheetData.system.KO.temp))/ 2);

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

    static async openNotes(ev) {
        
        let sheet = this.sheet;
        let newNote = await Dialog.editCharNotes({ "system": { "notes": sheet.system.note}});
        
        sheet.actor.setNote(newNote);
        sheet.system.note = newNote;
    }

    static async openEffectList(event) {

        let tabs = event.srcElement.closest("form").querySelector(".sheet-body");
        let activeTab = tabs.querySelector(".tab.primary.active");
        let destinationTab = tabs.querySelector("#characterEffects");
        
        activeTab.classList.remove("active");
        destinationTab.classList.add("active")
        
        let nav = event.srcElement.closest("form").querySelector(".sheet-tabs");
        let activeNav = nav.querySelectorAll(".item.menuMainItem.active");
        let destinationNav = nav.querySelectorAll("#characterEffects");
        
        activeNav.forEach(navElement => { navElement.classList.remove("active") });
        destinationNav.forEach(navElement => { navElement.classList.add("active") });
        this.actor.setFlag('gdsa', 'primaryTabSelection', "characterEffects");
    }
    
}