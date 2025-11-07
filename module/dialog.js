const global = foundry.applications.handlebars;
const dialog = foundry.applications.api.DialogV2;

export async function GetSkillCheckOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/skill-Roll.hbs", context);

    return _processSkillCheckOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetStatCheckOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/stat-Roll.hbs", context);

    return _processStatCheckOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetDogdeOptions(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/dogde-Roll.hbs", context);

    return _processDogdeOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetMirikalOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/mirikal-Roll.hbs", context);

    return _processMirikalCheckOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetWonderOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/wonder-Cast-Roll.hbs", context);

    return _processWonderCheckOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetSpellOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/spell-Cast-Roll.hbs", context);

    return _processSpellCheckOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetRitualOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/ritual-Cast-Roll.hbs", context);

    return _processNRitualCheckOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetSchamanOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/schaman-Cast-Roll.hbs", context);

    return _processSRitualCheckOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetAttributoOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/spell-attributo.hbs", context);

    return _processAttributoOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetFaxiOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/spell-faxio.hbs", context);

    return _processFaxioOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetAchazOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/spell-achaz.hbs", context);

    return _processAchazOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetMeditationOptions(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/medi-Check-Roll.hbs", context);

    return _processMediCheckOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.roll"},
        modal: true
    }));
}

export async function GetLePLossInfo(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/lep-loss.hbs", context);

    return _processGetDMGOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetAsPLossInfo(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/asp-loss.hbs", context);

    return _processGetDMGOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetKaPLossInfo(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/kap-loss.hbs", context);

    return _processGetDMGOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetLePInfo(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/lep-gain.hbs", context);

    return _processGetHealOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetAsPInfo(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/asp-gain.hbs", context);

    return _processGetHealOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetKaPInfo(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/kap-gain.hbs", context);

    return _processGetHealOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetRegInfo(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/regeneration-Roll.hbs", context);

    return _processGetRegOptions( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetAtkInfo(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/meele-Attack-Roll.hbs", context);

    return _processGetAtkInfo( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetRangeAtkInfo(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/range-Attack-Roll.hbs", context);

    return _processGetRangeAtkInfo( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetMoneyOptions(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/currency-change.hbs", context);

    return _processGetMoneyInfo( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function GetSpellVariantEdit(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/ressources/spellVariant.hbs", context);

    return _processSpellEdit( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

export async function editCharFacts(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/charStats.hbs", context);

    return _processCharFacts( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.system.save"},
        modal: true
    }));
}

export async function editCharNotes(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/charNotes.hbs", context);

    return _processCharNotes( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        position: { width: 475},
        content,
        ok: { label: "GDSA.system.save"},
        modal: true
    }));
}

export async function editCharStats(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/charAttributes.hbs", context);

    return _processCharStats( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.system.save"},
        modal: true
    }));
}

export async function editCharRess(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/charRessources.hbs", context);

    return _processCharRess( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.system.save"},
        modal: true
    }));
}

export async function editItemBook(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/sheets/gegenstand/Gegenstand-item-book-edit.hbs", context);

    return _processItemBook( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.system.save"},
        modal: true
    }));
}

export async function getAdvantage(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/getAdvantage.hbs", context);
    const window = await dialog.input({ window: { title: "GDSA.chat.skill.optionDialog"}, content, ok: { label: "GDSA.chat.skill.do"}, modal: true });
    return _processTempSelection(window);
}

export async function getLangConfirmation(context = {}) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/ressources/getLangConfirmation.hbs", context);

    return await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    });
}

export async function editRitualSkills(context) {

    context.config = CONFIG.GDSA;
    const content = await global.renderTemplate("systems/gdsa/templates/chat/dialog/ritSkill-change.hbs", context);

    return _processEditRitSkill( await dialog.input({
        window: { title: "GDSA.chat.skill.optionDialog"},
        content,
        ok: { label: "GDSA.chat.skill.do"},
        modal: true
    }));
}

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##         Helper Functions that transform the Form Data to Objekts that are returned          ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################


function _processSkillCheckOptions(form) {

    let advantage;
    let disadvantage;
    let taladvantage = 0;
    let taldisadvantage = 0;
    let talS = false;
    let mirakel = false;
    let be = false;
    let beDis = 0;
    let mhk = 0;
    let used = [];
    
    advantage = parseInt(form.advantage !== "" ? form.advantage : 0);
    disadvantage = parseInt(form.disadvantage !== "" ? form.disadvantage : 0);

    if(form.talSadvantage != null) taladvantage = parseInt(form.talSadvantage !== "" ? form.talSadvantage : 0);
    if(form.talSdisadvantage != null) taldisadvantage = parseInt(form.talSdisadvantage !== "" ? form.talSdisadvantage : 0);

    if(form.talentS != null) talS = form.talentS;
    if(form.be != null) be = form.be;
    if(form.be != null) beDis = form.beValue;
    if(form.mhk != null) mhk = form.mhk;
    if(form.mirakel != null) mirakel = form.mirakel;

    if(be && beDis > 0) { used.push(game.i18n.localize("GDSA.template.BE") + "s " + game.i18n.localize("GDSA.itemsheet.disad")  + " (+ " + beDis + ")")};

    return {
       
        advantage: advantage,
        disadvantage: disadvantage,
        taladvantage: taladvantage,
        taldisadvantage: taldisadvantage,
        be: be,
        mhk: mhk,
        used: used,
        talS: talS,
        mirakel: mirakel
    }
}

function _processStatCheckOptions(form) {

    let advantage;
    let disadvantage;
    let taladvantage = 0;
    let taldisadvantage = 0;
    let talS = false;
    let mirakel = false;
    let used = [];
    let ironWill = false;
    let willProt = false;

    advantage = parseInt(form.advantage !== "" ? form.advantage : 0);
    disadvantage = parseInt(form.disadvantage !== "" ? form.disadvantage : 0);

    if(form.talSadvantage != null) taladvantage = parseInt(form.talSadvantage !== "" ? form.talSadvantage : 0);
    if(form.talSdisadvantage != null) taldisadvantage = parseInt(form.talSdisadvantage !== "" ? form.talSdisadvantage : 0);

    if(form.talentS != null) talS = form.talentS;
    if(form.mirakel != null) mirakel = form.mirakel;
    if(form.ironWill != null) ironWill = form.ironWill;
    if(form.willProt != null) willProt = form.willProt;

    return {
       
        advantage: advantage,
        disadvantage: disadvantage,
        taladvantage: taladvantage,
        taldisadvantage: taldisadvantage,
        used: used,
        talS: talS,
        mirakel: mirakel,
        ironWill: ironWill,
        willProt: willProt
    }
}

function _processDogdeOptions(form) {

    let disadvantage = 0;
    let multi = 1;
    let dk = "";
    let directed = false;
    let addCombt = 0;

    disadvantage = parseInt(form.disadvantage !== "" ? form.disadvantage : 0);

    directed = form.directed;
    if(directed) multi = 2;

    disadvantage += (parseInt(form.dk) * multi) + parseInt(form.addCombt);

    switch (form.dk) {
        case "8":
            dk = game.i18n.localize("GDSA.charactersheet.rangeFK");
            break;
        case "4":
            dk = game.i18n.localize("GDSA.charactersheet.rangeH") + " / " + game.i18n.localize("GDSA.charactersheet.rangeWW");
            break;
        case "2":
            dk = game.i18n.localize("GDSA.charactersheet.rangeN");
            break;
        case "1":
            dk = game.i18n.localize("GDSA.charactersheet.rangeS");
            break;
        case "0":
            dk = game.i18n.localize("GDSA.charactersheet.rangeP");
            break;
        default:
            dk = "";
            break;
    }
    console.log(form.dk);
    console.log(dk);

    addCombt = parseInt(form.addCombt) / 2;

    return {

        disadvantage: disadvantage,
        dk: dk,
        directed: directed,
        addCombt: addCombt
    }
}

function _processSpellCheckOptions(form) {

    let advantage;
    let disadvantage;
    let nonDiscountDisadvantage;
    let actions;
    let actionDoub = false;
    let powerC = false;
    let actionHalf = 0;
    let bonusCost = 0;
    let costMod = 0;
    let variants = [];
    let used = [];
    let rep = form.rep;
    let forcedMod = (rep === "dru") ? 2 : 1;
    let costDurDoub = (rep === "eld") ? 4 : 7;

    advantage = parseInt(form.advantage !== "" ? form.advantage : 0);
    disadvantage = parseInt(form.disadvantage !== "" ? form.disadvantage : 0);
    nonDiscountDisadvantage = parseInt(form.disadvantage !== "" ? form.disadvantage : 0);
    actions = 0;

    if(form.tech) { disadvantage = disadvantage + 7; actions = actions + 3; used.push(game.i18n.localize("GDSA.system.technic") + " (+ 7)")};
    if(form.zentech) { disadvantage = disadvantage + 12; actions = actions + 3; used.push(game.i18n.localize("GDSA.system.zenTech") + " (+ 12)")};
    if(form.doubcast) { advantage = advantage + 3; actionDoub = true; used.push(game.i18n.localize("GDSA.system.doppelD") + " (- 3 / - 4)")};
    if(form.powerC != null) if(form.powerC) powerC = true;

    if(form.halfcast > 0) {disadvantage = disadvantage + (form.halfcast * 5); actionHalf = form.halfcast; used.push(form.halfcast + "x " + game.i18n.localize("GDSA.system.halfDur") + " (+ " + (form.halfcast * 5) + ")")};
    if(form.forced > 0) {advantage = advantage + parseInt(form.forced); bonusCost = Math.round((( 2 ** parseInt(form.forced)) / 2) / forcedMod); actions = actions + parseInt(form.forced); used.push(form.forced + "x " + game.i18n.localize("GDSA.system.force") + " (- " + (form.forced) + ")")};
    if(form.costMod > 0) {disadvantage = disadvantage + (form.costMod * 3); actions = actions + parseInt(form.costMod); costMod = parseInt(form.costMod); used.push(form.costMod + "x " + game.i18n.localize("GDSA.system.cost") + " (+ " + (form.costMod * 3) + ")")};
    if(form.preach > 0) {disadvantage = disadvantage + (form.preach * 5); actions = actions + parseInt(form.preach); used.push(form.preach + "x " + game.i18n.localize("GDSA.system.pRad") + " (+ " + (form.preach * 5) + ")")};
    if(form.mreach > 0) {disadvantage = disadvantage + (form.mreach * 3); actions = actions + parseInt(form.mreach); used.push(form.mreach + "x " + game.i18n.localize("GDSA.system.mRad") + " (+ " + (form.mreach * 3) + ")")};
    if(form.halfdura > 0) {disadvantage = disadvantage + (form.halfdura * 3); actions = actions + parseInt(form.halfdura); used.push(form.halfdura + "x " + game.i18n.localize("GDSA.system.hDur") + " (+ " + (form.halfdura * 3) + ")")};
    if(form.doubdura > 0) {disadvantage = disadvantage + (form.doubdura * costDurDoub); actions = actions + parseInt(form.doubdura); used.push(form.doubdura + "x " + game.i18n.localize("GDSA.system.dDur") + " (+ " + (form.doubdura * costDurDoub) + ")")};

    if (form.varCount > 0) {
        for (let i = 0; i < form.varCount; i++) {
            
            let variant = form["var" + i];
            variants.push(variant);
        }
    }

    return {
       
        advantage: advantage,
        disadvantage: disadvantage,
        nonDiscountDisadvantage: nonDiscountDisadvantage,
        actions: actions,
        doubcast: actionDoub,
        halfcast: actionHalf,
        bonusCost: bonusCost,
        costMod: costMod,
        variants: variants,
        used: used,
        powerC: powerC
    }
}

function _processNRitualCheckOptions(form) {

    let advantage;
    let disadvantage;
    let used = [];

    advantage = parseInt(form.advantage !== "" ? form.advantage : 0);
    disadvantage = parseInt(form.disadvantage !== "" ? form.disadvantage : 0);

    return {
        
        advantage: advantage,
        disadvantage: disadvantage,
        used: used
    }
}

function _processSRitualCheckOptions(form) {

    let advantage;
    let disadvantage;
    let used = [];
    let helpers = [];

    advantage = parseInt(form.advantage !== "" ? form.advantage : 0);
    disadvantage = parseInt(form.disadvantage !== "" ? form.disadvantage : 0);

    if(form.disbeliv) { disadvantage += 3; used.push(game.i18n.localize("GDSA.system.disbelive") + " (+ 3)")};
    if(form.holdyday) { advantage += 2; used.push(game.i18n.localize("GDSA.ritual.holyDay") + " (- 2)")};

    if (parseInt(form.place) > 0) disadvantage += parseInt(form.place);
    else advantage += (parseInt(form.place) * (-1))
    if (parseInt(form.place) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.schamLocation[form.place]) + " (" + _formatModifikation(form.place) + ")")

    if (parseInt(form.time) > 0) disadvantage += parseInt(form.time);
    else advantage += (parseInt(form.time) * (-1))
    if (parseInt(form.time) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.schamTime[form.time]) + " (" + _formatModifikation(form.time) + ")")

    if (parseInt(form.naturevent) > 0) disadvantage += parseInt(form.naturevent);
    else advantage += (parseInt(form.naturevent) * (-1))
    if (parseInt(form.naturevent) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.schamNatur[form.naturevent]) + " (" + _formatModifikation(form.naturevent) + ")")

    if (parseInt(form.fetisch) > 0) disadvantage += parseInt(form.fetisch);
    else advantage += (parseInt(form.fetisch) * (-1))
    if (parseInt(form.fetisch) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.schamFetisch[form.fetisch]) + " (" + _formatModifikation(form.fetisch) + ")")

    if (parseInt(form.wear) > 0) disadvantage += parseInt(form.wear);
    else advantage += (parseInt(form.wear) * (-1))
    if (parseInt(form.wear) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.schamWear[form.wear]) + " (" + _formatModifikation(form.wear) + ")")

    if (parseInt(form.drug) > 0) disadvantage += parseInt(form.drug);
    else advantage += (parseInt(form.drug) * (-1))
    if (parseInt(form.drug) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.schamDrug[form.drug]) + " (" + _formatModifikation(form.drug) + ")")

    for (let index = 0; index < (form.helper.split(",").length); index++)
        if(form["helptale" + index]) helpers.push(form["helptype" + index]);

    console.log({
        
        advantage: advantage,
        disadvantage: disadvantage,
        used: used,
        helper: helpers,
        ritdur: form.ritduaration.checked,
        target: form.target.checked,
        reach: form.rangeH.checked,
        wdura: form.duration.checked
    })

    return {
        
        advantage: advantage,
        disadvantage: disadvantage,
        used: used,
        helper: helpers,
        ritdur: form.ritduaration.checked,
        target: form.target.checked,
        reach: form.rangeH.checked,
        wdura: form.duration.checked
    }
}

function _processMirikalCheckOptions(form) {

    let advantage = 0;
    let disadvantage = 0;
    let used = [];

    advantage = parseInt(form.advantage !== "" ? form.advantage : 0);
    disadvantage = parseInt(form.disadvantage !== "" ? form.disadvantage : 0);

    if(form.lastResort) { advantage += 2; used.push(game.i18n.localize("GDSA.system.lastResort") + " (- 2)")};
    if(form.forcedHoly) { disadvantage += 6; used.push(game.i18n.localize("GDSA.system.magicForced") + " (+ 6)")};
    if(form.disbeliv) { disadvantage += 3; used.push(game.i18n.localize("GDSA.system.disbelive") + " (+ 3)")};
    if(form.demonic) { disadvantage += 7; used.push(game.i18n.localize("GDSA.system.chaospres") + " (+ 7)")};

    if (parseInt(form.motivation) > 0) disadvantage += Math.round((parseInt(form.motivation)) / 2);
        else advantage += Math.round((parseInt(form.motivation) * (-1)) / 2);

    if (parseInt(form.motivation) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.holyMotivation[form.motivation]))
    
    if (parseInt(form.place) > 0) disadvantage += parseInt(form.place);
        else advantage += (parseInt(form.place) * (-1))
    
    if (parseInt(form.place) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.holyPlace[form.place]) + " (" + _formatModifikation(form.place) + ")")

    if (parseInt(form.time) > 0) disadvantage += Math.round((parseInt(form.time)) / 2);
        else advantage += Math.round((parseInt(form.time) * (-1)) / 2);
    
    if (parseInt(form.time) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.holyTime[form.time]) + " (" + (Math.round((parseInt(form.time) * -1) / 2) *  -1) + ")")

    return {

        advantage: advantage,
        disadvantage: disadvantage,
        used: used
    }
}

function _processWonderCheckOptions(form) {

    let advantage = 0;
    let disadvantage = 0;
    let used = [];

    advantage = parseInt(form.advantage !== "" ? form.advantage : 0);
    disadvantage = parseInt(form.disadvantage !== "" ? form.disadvantage : 0);

    if(form.lastResort) { advantage += 3; used.push(game.i18n.localize("GDSA.system.lastResort") + " (- 3)")};
    if(form.forcedHoly) { disadvantage += 12; used.push(game.i18n.localize("GDSA.system.magicForced") + " (+ 12)")};
    if(form.disbeliv) { disadvantage += 3; used.push(game.i18n.localize("GDSA.system.disbelive") + " (+ 3)")};
    if(form.demonic) { disadvantage += 7; used.push(game.i18n.localize("GDSA.system.chaospres") + " (+ 7)")};
    if(form.othbreak) { disadvantage += 2; used.push(game.i18n.localize("GDSA.system.eidbrech") + " (+ 2)")};
    if(form.symbolFrev) { disadvantage += 5; used.push(game.i18n.localize("GDSA.system.frevler") + " (+ 5)")};
    if(form.smallPakt) { disadvantage += 2; used.push(game.i18n.localize("GDSA.system.minder") + " (+ 2)")};

    if (parseInt(form.motivation) > 0) disadvantage += parseInt(form.motivation);
        else advantage += (parseInt(form.motivation) * (-1))

    if (parseInt(form.motivation) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.holyMotivation[form.motivation]))
    
    if (parseInt(form.place) > 0) disadvantage += parseInt(form.place);
        else advantage += (parseInt(form.place) * (-1))
    
    if (parseInt(form.place) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.holyPlace[form.place]) + " (" + _formatModifikation(form.place) + ")")

    if (parseInt(form.time) > 0) disadvantage += parseInt(form.time);
        else advantage += (parseInt(form.time) * (-1))
    
    if (parseInt(form.time) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.holyTime[form.time]) + " (" + _formatModifikation(form.time) + ")")

    if (parseInt(form.resulting) > 0) disadvantage += parseInt(form.resulting);
        else advantage += (parseInt(form.resulting) * (-1))
    
    if (parseInt(form.resulting) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.holyResulting[form.resulting]))

    if (parseInt(form.help) > 0) disadvantage += parseInt(form.help);
        else advantage += (parseInt(form.help) * (-1))
    
    if (parseInt(form.help) !== 0) used.push(game.i18n.localize(CONFIG.GDSA.holyHelp[form.help]) + " (" + _formatModifikation(form.help) + ")")

    return {

        advantage: advantage,
        disadvantage: disadvantage,
        used: used,
        ritdur: form.ritduaration,
        target: form.target,
        reach: form.rangeH,
        wdura: form.duration
    }
}

function _processSpellEdit(form) {

    let resti = [];

    if(form.mag) resti.push({type: form.reglaKind1, rep: "mag"});
    if(form.dru) resti.push({type: form.reglaKind1, rep: "dru"});
    if(form.bor) resti.push({type: form.reglaKind1, rep: "bor"});
    if(form.srl) resti.push({type: form.reglaKind1, rep: "srl"});
    if(form.hex) resti.push({type: form.reglaKind1, rep: "hex"});
    if(form.elf) resti.push({type: form.reglaKind1, rep: "elf"});
    if(form.sch) resti.push({type: form.reglaKind1, rep: "sch"});
    if(form.geo) resti.push({type: form.reglaKind1, rep: "geo"});
    if(form.ach) resti.push({type: form.reglaKind1, rep: "ach"});

    return {
        name: form.name,
        minZfW: parseInt(form.minZ),
        disad: parseInt(form.disad),
        cost: form.cost,
        casttime: form.casttime,
        resti: resti
    }
}

function _processMediCheckOptions(form) {

    return {disadvantage: parseInt(form.time) + parseInt(form.place) + parseInt(form.last)}
}

function _processGetDMGOptions(form) {

    return {value: parseInt(form.dmg !== "" ? form.dmg : 0)}
}

function _processGetHealOptions(form) {

    return {value: parseInt(form.heal !== "" ? form.heal : 0)}
}

function _processGetRegOptions(form) {

    return {
        dis: parseInt(form.disadvantage !== "" ? form.disadvantage : 0),
        lep: parseInt(form.reglep !== "" ? form.reglep : 0),
        asp: parseInt(form.regasp !== "" ? form.regasp : 0),
        kap: parseInt(form.regkap !== "" ? form.regkap : 0)
    }
}

function _processGetAtkInfo(form) {

    let anat = false;
    let butc = false;
    let hamme = false;
    let sturm = false;
    let used = [];

    if(form.anatomy != null || form.anatomy != undefined) anat = form.anatomy;
    if(form.butcher != null || form.butcher != undefined) butc = form.butcher;
    if(form.hamme != null || form.hamme != undefined) hamme = form.hamme;
    if(form.sturm != null || form.sturm != undefined) sturm = form.sturm;

    let bDMG = 0;

    if(anat) bDMG++;
    if(anat) used.push(game.i18n.localize("GDSA.chat.skill.anatomy"));
    if(butc) bDMG++;
    if(butc) used.push(game.i18n.localize("GDSA.chat.skill.butcher"));

    return {

        bonus: bDMG,
        advan: parseInt(form.advan !== "" ? form.advan : 0),
        disad: parseInt(form.disad !== "" ? form.disad : 0),
        wucht: parseInt(form.wucht !== "" ? form.wucht : 0),
        finte: parseInt(form.finte !== "" ? form.finte : 0),
        hamme: hamme,
        sturm: sturm,
        used: used
    }
}

function _processGetRangeAtkInfo(form) {

    return {

        advan: parseInt(form.advan !== "" ? form.advan : 0),
        disad: parseInt(form.disad !== "" ? form.disad : 0),
        bonus: parseInt(form.bonus !== "" ? form.bonus : 0),
        aimed: parseInt(form.aimed !== "" ? form.aimed : 0),
        winds: parseInt(form.winds !== "" ? form.winds : 0),
        sight: parseInt(form.sight !== "" ? form.sight : 0),
        movem: parseInt(form.movem !== "" ? form.movem : 0),
        dista: parseInt(form.dista !== "" ? form.dista : 0),
        hidea: parseInt(form.hidea !== "" ? form.hidea : 0),
        sizeX: parseInt(form.sizeX !== "" ? form.sizeX : 0)}
}

function _processGetMoneyInfo(form) {

    return {

        operation: form.operation,
        gold: parseInt(form.gold !== "" ? form.gold : 0),
        silver: parseInt(form.silver !== "" ? form.silver : 0),
        copper: parseInt(form.copper !== "" ? form.copper : 0),
        nikel: parseInt(form.nikel !== "" ? form.nikel : 0)}
}

function _processCharFacts(form) {

    return {

        race: form.race,
        culture: form.culture,
        profession: form.profession,
        gender: form.gender,
        age: form.age,
        size: form.size,
        weight: form.weight,
        social: form.social
    }
}

function _processItemBook(forms) {

    let form = forms[0].querySelector("[class=dialogConfig]");

    return {

        name: form.name,
        value: form.value,
        weight: form.weight,
        storage: form.storage,
        category: form.category,
        quote: form.quote,
        description: form.description,
        prerequisits: form.prerequisits,
        ingame: form.ingame,
        special: form.special,
        type: form.type,
        itemType: form.itemType,
        note: form.note
    }
}

function _processCharRess(form) {

    return {
        newModValue: form.modValue,
        newBuyValue: form.buyValue
    }
}

function _processEditRitSkill(form) {

    return {

        ritalch: form.ritalch,
        ritderw: form.ritderw,
        ritdrui: form.ritdrui,
        ritdurr: form.ritdurr,
        ritgban: form.ritgban,
        ritgruf: form.ritgruf,
        ritgauf: form.ritgauf,
        ritgbin: form.ritgbin,
        ritgeod: form.ritgeod,
        ritgild: form.ritgild,
        rithexe: form.rithexe,
        ritkris: form.ritkris,
        ritpetr: form.ritpetr,
        ritscha: form.ritscha,
        rittanz: form.rittanz,
        ritzibi: form.ritzibi
    }
}

function _processAchazOptions(form) {

    let mod = 0;

    if (form.stoneTrait1 != null) mod += parseInt(form.stoneTrait1) - 1;
    if (form.stoneTrait2 != null) mod += parseInt(form.stoneTrait2) - 1;
    if (form.stoneTrait3 != null) mod += parseInt(form.stoneTrait3) - 1;
    if (form.stoneTrait4 != null) mod += parseInt(form.stoneTrait4) - 1;

    if (form.modicount > 0)
        for (let i = 0; i == form.modicount; i++)
            if (form["modi" + i] != null) mod -= parseInt(form["modi" + i]);
    
    let usedStones = [];

    if (form.stoneTrait1 != null) usedStones.push(form.stoneTrait1.options[form.stoneTrait1.selectedIndex].innerHTML);
    if (form.stoneTrait2 != null) usedStones.push(form.stoneTrait2.options[form.stoneTrait2.selectedIndex].innerHTML);
    if (form.stoneTrait3 != null) usedStones.push(form.stoneTrait3.options[form.stoneTrait3.selectedIndex].innerHTML);
    if (form.stoneTrait4 != null) usedStones.push(form.stoneTrait4.options[form.stoneTrait4.selectedIndex].innerHTML);
    
    if (form.modicount > 0)
        for (let j = 0; j == form.modicount; j++)
            if (form["modi" + j] != null) usedStones.push(form["modi" + j].options[form["modi" + j].selectedIndex].innerHTML);

    usedStones = usedStones.filter((value, index, array) => array.indexOf(value) === index);

    let index = usedStones.indexOf(game.i18n.localize("GDSA.spell.noGem"));
    if (index !== -1) usedStones = usedStones.splice(index, 1);

    let actionsPer = form.gemStore;
    let actions = 0;

    if (form.such != null) actionsPer = 1;

    actions = actionsPer * usedStones.length;

    if (form.such != null)actions = Math.ceil(actions / form.such);

    return {
        advantage: mod,
        actions: actions
    }
}

function _processCharStats(form) { return { newvalue: form.value }};
function _processAttributoOptions(form) { return { att: form.att1 }};
function _processFaxioOptions(form) { return { dice: parseInt(form.dice)+1 }};
function _formatModifikation(string) { return string[0] + " " + string.substring(1)};
function _processTempSelection(form) { return { advantage: form.advantages}};
function _processCharNotes(form) { return form.charNotes;}