export async function GetSkillCheckOptions(skill) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/skill-Roll.hbs";
    const html = await renderTemplate(template, skill);

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processSkillCheckOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetStatCheckOptions(skill) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/stat-Roll.hbs";
    const html = await renderTemplate(template, skill);

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processStatCheckOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetDogdeOptions() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/dogde-Roll.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processDogdeOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetMirikalOptions() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/mirikal-Roll.hbs";
    const html = await renderTemplate(template);

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processMirikalCheckOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetWonderOptions(wonder) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/wonder-Cast-Roll.hbs";
    const html = await renderTemplate(template, wonder);

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processWonderCheckOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetSpellOptions(spell) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/spell-Cast-Roll.hbs";
    const html = await renderTemplate(template, spell);

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processSpellCheckOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetAttributoOptions(spell) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/spell-attributo.hbs";
    const html = await renderTemplate(template, spell);

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processAttributoOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetFaxiOptions(spell) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/spell-faxio.hbs";
    const html = await renderTemplate(template, spell);

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processFaxioOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetAchazOptions(spell) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/spell-achaz.hbs";
    const html = await renderTemplate(template, spell);

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processAchazOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });

}

export async function GetMeditationOptions() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/medi-Check-Roll.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.roll"),
                                callback: html => resolve(_processMediCheckOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetLePLossInfo() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/lep-loss.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetDMGOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetAsPLossInfo() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/asp-loss.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetDMGOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetAsPInfo() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/asp-gain.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetHealOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetKaPInfo() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/kap-gain.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetHealOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetKaPLossInfo() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/kap-loss.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetDMGOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetLePInfo() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/lep-gain.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetHealOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetRegInfo() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/regeneration-Roll.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetRegOptions(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetAtkInfo(item) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/meele-Attack-Roll.hbs";
    const html = await renderTemplate(template, item);

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetAtkInfo(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetRangeAtkInfo(item) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/range-Attack-Roll.hbs";
    const html = await renderTemplate(template, item);

    return new Promise(resolve => {  

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetRangeAtkInfo(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetMoneyOptions() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/dialog/currency-change.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processGetMoneyInfo(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function GetSpellVariantEdit(spell) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/ressources/spellVariant.hbs";
    spell.config = CONFIG.GDSA;
    const html = await renderTemplate(template, spell);

    return new Promise(resolve => {  

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processSpellEdit(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function editCharFacts(context) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/ressources/charStats.hbs";
    context.config = CONFIG.GDSA;
    const html = await renderTemplate(template, context);

    return new Promise(resolve => {  

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processCharFacts(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function editCharStats(context) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/ressources/charAttributes.hbs";
    context.config = CONFIG.GDSA;
    const html = await renderTemplate(template, context);

    return new Promise(resolve => {  

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processCharStats(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function editCharRess(context) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/ressources/charRessources.hbs";
    context.config = CONFIG.GDSA;
    const html = await renderTemplate(template, context);

    return new Promise(resolve => {  

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processCharRess(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
}

export async function getAdvantage(context) {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/sheets/getAdvantage.hbs";
    context.config = CONFIG.GDSA;
    const html = await renderTemplate(template, context);

    return new Promise(resolve => {  

        // Set up Parameters for Dialog

        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                    normal: {
                                label: game.i18n.format("GDSA.chat.skill.do"),
                                callback: html => resolve(_processTempSelection(html[0].querySelector("form")))},
                    cancel: {
                                label: game.i18n.format("GDSA.chat.skill.cancel"),
                                callback: html => resolve({cancelled: true})}},
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        // Generate and Render Dialog

        new Dialog(data, null).render(true);
    });
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

    advantage = parseInt(form.advantage.value !== "" ? form.advantage.value : 0);
    disadvantage = parseInt(form.disadvantage.value !== "" ? form.disadvantage.value : 0);

    if(form.talSadvantage != null) taladvantage = parseInt(form.talSadvantage.value !== "" ? form.talSadvantage.value : 0);
    if(form.talSdisadvantage != null) taldisadvantage = parseInt(form.talSdisadvantage.value !== "" ? form.talSdisadvantage.value : 0);

    if(form.talentS != null) talS = form.talentS.checked;
    if(form.be != null) be = form.be.checked;
    if(form.be != null) beDis = form.beValue.value;
    if(form.mhk != null) mhk = form.mhk.value;
    if(form.mirakel != null) mirakel = form.mirakel.checked;

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

    advantage = parseInt(form.advantage.value !== "" ? form.advantage.value : 0);
    disadvantage = parseInt(form.disadvantage.value !== "" ? form.disadvantage.value : 0);

    if(form.talSadvantage != null) taladvantage = parseInt(form.talSadvantage.value !== "" ? form.talSadvantage.value : 0);
    if(form.talSdisadvantage != null) taldisadvantage = parseInt(form.talSdisadvantage.value !== "" ? form.talSdisadvantage.value : 0);

    if(form.talentS != null) talS = form.talentS.checked;
    if(form.mirakel != null) mirakel = form.mirakel.checked;
    if(form.ironWill != null) ironWill = form.ironWill.checked;
    if(form.willProt != null) willProt = form.willProt.checked;

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

    disadvantage = parseInt(form.disadvantage.value !== "" ? form.disadvantage.value : 0);

    directed = form.directed.checked;
    if(directed) multi = 2;

    disadvantage += (parseInt(form.dk.value) * multi) + parseInt(form.addCombt.value);

    if (form.dk.options[form.dk.selectedIndex].text) dk = form.dk.options[form.dk.selectedIndex].text;
    addCombt = parseInt(form.addCombt.value) / 2;

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
    let actions;

    let actionDoub = false;
    let powerC = false;
    let actionHalf = 0;
    let bonusCost = 0;
    let costMod = 0;
    let variants = [];
    let used = [];
    let rep = form.rep.value;
    let forcedMod = (rep === "dru") ? 2 : 1;
    let costDurDoub = (rep === "eld") ? 4 : 7;

    advantage = parseInt(form.advantage.value !== "" ? form.advantage.value : 0);
    disadvantage = parseInt(form.disadvantage.value !== "" ? form.disadvantage.value : 0);
    actions = 0;

    if(form.tech.checked) { disadvantage = disadvantage + 7; actions = actions + 3; used.push(game.i18n.localize("GDSA.system.technic") + " (+ 7)")};
    if(form.zentech.checked) { disadvantage = disadvantage + 12; actions = actions + 3; used.push(game.i18n.localize("GDSA.system.zenTech") + " (+ 12)")};
    if(form.doubcast.checked) { advantage = advantage + 3; actionDoub = true; used.push(game.i18n.localize("GDSA.system.doppelD") + " (- 3 / - 4)")};
    if(form.powerC != null) if(form.powerC.checked) powerC = true;

    if(form.halfcast.value > 0) {disadvantage = disadvantage + (form.halfcast.value * 5); actionHalf = form.halfcast.value; used.push(form.halfcast.value + "x " + game.i18n.localize("GDSA.system.halfDur") + " (+ " + (form.halfcast.value * 5) + ")")};
    if(form.forced.value > 0) {advantage = advantage + form.forced.value; bonusCost = Math.round((( 2 ** form.forced.value) / 2) / forcedMod); actions = actions + parseInt(form.forced.value); used.push(form.forced.value + "x " + game.i18n.localize("GDSA.system.force") + " (- " + (form.forced.value) + ")")};
    if(form.costMod.value > 0) {disadvantage = disadvantage + (form.costMod.value * 3); actions = actions + parseInt(form.costMod.value); costMod = parseInt(form.costMod.value); used.push(form.costMod.value + "x " + game.i18n.localize("GDSA.system.cost") + " (+ " + (form.costMod.value * 3) + ")")};
    if(form.preach.value > 0) {disadvantage = disadvantage + (form.preach.value * 5); actions = actions + parseInt(form.preach.value); used.push(form.preach.value + "x " + game.i18n.localize("GDSA.system.pRad") + " (+ " + (form.preach.value * 5) + ")")};
    if(form.mreach.value > 0) {disadvantage = disadvantage + (form.mreach.value * 3); actions = actions + parseInt(form.mreach.value); used.push(form.mreach.value + "x " + game.i18n.localize("GDSA.system.mRad") + " (+ " + (form.mreach.value * 3) + ")")};
    if(form.halfdura.value > 0) {disadvantage = disadvantage + (form.halfdura.value * 3); actions = actions + parseInt(form.halfdura.value); used.push(form.halfdura.value + "x " + game.i18n.localize("GDSA.system.hDur") + " (+ " + (form.halfdura.value * 3) + ")")};
    if(form.doubdura.value > 0) {disadvantage = disadvantage + (form.doubdura.value * costDurDoub); actions = actions + parseInt(form.doubdura.value); used.push(form.doubdura.value + "x " + game.i18n.localize("GDSA.system.dDur") + " (+ " + (form.doubdura.value * costDurDoub) + ")")};

    if (form.varCount.value > 0) {
        for (let i = 0; i < form.varCount.value; i++) {
            
            let variant = form["var" + i].checked;
            variants.push(variant);
        }
    }

    return {
       
        advantage: advantage,
        disadvantage: disadvantage,
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

function _processMirikalCheckOptions(form) {

    let advantage = 0;
    let disadvantage = 0;
    let used = [];

    advantage = parseInt(form.advantage.value !== "" ? form.advantage.value : 0);
    disadvantage = parseInt(form.disadvantage.value !== "" ? form.disadvantage.value : 0);

    if(form.lastResort.checked) { advantage += 2; used.push(game.i18n.localize("GDSA.system.lastResort") + " (- 2)")};
    if(form.forcedHoly.checked) { disadvantage += 6; used.push(game.i18n.localize("GDSA.system.magicForced") + " (+ 6)")};
    if(form.disbeliv.checked) { disadvantage += 3; used.push(game.i18n.localize("GDSA.system.disbelive") + " (+ 3)")};
    if(form.demonic.checked) { disadvantage += 7; used.push(game.i18n.localize("GDSA.system.chaospres") + " (+ 7)")};

    if (parseInt(form.motivation.value) > 0) disadvantage += Math.round((parseInt(form.motivation.value)) / 2);
        else advantage += Math.round((parseInt(form.motivation.value) * (-1)) / 2);

    if (parseInt(form.motivation.value) !== 0) used.push(form.motivation.options[form.motivation.selectedIndex].innerHTML)
    
    if (parseInt(form.place.value) > 0) disadvantage += parseInt(form.place.value);
        else advantage += (parseInt(form.place.value) * (-1))
    
    if (parseInt(form.place.value) !== 0) used.push(form.place.options[form.place.selectedIndex].innerHTML + " (" + _formatModifikation(form.place.value) + ")")

    if (parseInt(form.time.value) > 0) disadvantage += Math.round((parseInt(form.time.value)) / 2);
        else advantage += Math.round((parseInt(form.time.value) * (-1)) / 2);
    
    if (parseInt(form.time.value) !== 0) used.push(form.time.options[form.time.selectedIndex].innerHTML + " (" + (Math.round((parseInt(form.time.value) * -1) / 2) *  -1) + ")")

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

    advantage = parseInt(form.advantage.value !== "" ? form.advantage.value : 0);
    disadvantage = parseInt(form.disadvantage.value !== "" ? form.disadvantage.value : 0);

    if(form.lastResort.checked) { advantage += 3; used.push(game.i18n.localize("GDSA.system.lastResort") + " (- 3)")};
    if(form.forcedHoly.checked) { disadvantage += 12; used.push(game.i18n.localize("GDSA.system.magicForced") + " (+ 12)")};
    if(form.disbeliv.checked) { disadvantage += 3; used.push(game.i18n.localize("GDSA.system.disbelive") + " (+ 3)")};
    if(form.demonic.checked) { disadvantage += 7; used.push(game.i18n.localize("GDSA.system.chaospres") + " (+ 7)")};
    if(form.othbreak.checked) { disadvantage += 2; used.push(game.i18n.localize("GDSA.system.eidbrech") + " (+ 2)")};
    if(form.symbolFrev.checked) { disadvantage += 5; used.push(game.i18n.localize("GDSA.system.frevler") + " (+ 5)")};
    if(form.smallPakt.checked) { disadvantage += 2; used.push(game.i18n.localize("GDSA.system.minder") + " (+ 2)")};

    if (parseInt(form.motivation.value) > 0) disadvantage += parseInt(form.motivation.value);
        else advantage += (parseInt(form.motivation.value) * (-1))

    if (parseInt(form.motivation.value) !== 0) used.push(form.motivation.options[form.motivation.selectedIndex].innerHTML)
    
    if (parseInt(form.place.value) > 0) disadvantage += parseInt(form.place.value);
        else advantage += (parseInt(form.place.value) * (-1))
    
    if (parseInt(form.place.value) !== 0) used.push(form.place.options[form.place.selectedIndex].innerHTML + " (" + _formatModifikation(form.place.value) + ")")

    if (parseInt(form.time.value) > 0) disadvantage += parseInt(form.time.value);
        else advantage += (parseInt(form.time.value) * (-1))
    
    if (parseInt(form.time.value) !== 0) used.push(form.time.options[form.time.selectedIndex].innerHTML + " (" + _formatModifikation(form.time.value) + ")")

    if (parseInt(form.resulting.value) > 0) disadvantage += parseInt(form.resulting.value);
        else advantage += (parseInt(form.resulting.value) * (-1))
    
    if (parseInt(form.resulting.value) !== 0) used.push(form.resulting.options[form.resulting.selectedIndex].innerHTML)

    if (parseInt(form.help.value) > 0) disadvantage += parseInt(form.help.value);
        else advantage += (parseInt(form.help.value) * (-1))
    
    if (parseInt(form.help.value) !== 0) used.push(form.help.options[form.help.selectedIndex].innerHTML + " (" + _formatModifikation(form.help.value) + ")")

    return {

        advantage: advantage,
        disadvantage: disadvantage,
        used: used,
        ritdur: form.ritduaration.checked,
        target: form.target.checked,
        reach: form.rangeH.checked,
        wdura: form.duration.checked
    }
}

function _processSpellEdit(form) {

    let resti = [];

    if(form.mag.checked) resti.push({type: form.reglaKind1.value, rep: "mag"});
    if(form.dru.checked) resti.push({type: form.reglaKind1.value, rep: "dru"});
    if(form.bor.checked) resti.push({type: form.reglaKind1.value, rep: "bor"});
    if(form.srl.checked) resti.push({type: form.reglaKind1.value, rep: "srl"});
    if(form.hex.checked) resti.push({type: form.reglaKind1.value, rep: "hex"});
    if(form.elf.checked) resti.push({type: form.reglaKind1.value, rep: "elf"});
    if(form.sch.checked) resti.push({type: form.reglaKind1.value, rep: "sch"});
    if(form.geo.checked) resti.push({type: form.reglaKind1.value, rep: "geo"});
    if(form.ach.checked) resti.push({type: form.reglaKind1.value, rep: "ach"});

    return {
        name: form.name.value,
        minZfW: parseInt(form.minZ.value),
        disad: parseInt(form.disad.value),
        cost: form.cost.value,
        casttime: form.casttime.value,
        resti: resti
    }
}

function _processMediCheckOptions(form) {

    return {disadvantage: parseInt(form.time.value) + parseInt(form.place.value) + parseInt(form.last.value)}
}

function _processGetDMGOptions(form) {

    return {value: parseInt(form.dmg.value !== "" ? form.dmg.value : 0)}
}

function _processGetHealOptions(form) {

    return {value: parseInt(form.heal.value !== "" ? form.heal.value : 0)}
}

function _processGetRegOptions(form) {

    return {
        dis: parseInt(form.disadvantage.value !== "" ? form.disadvantage.value : 0),
        lep: parseInt(form.reglep.value !== "" ? form.reglep.value : 0),
        asp: parseInt(form.regasp.value !== "" ? form.regasp.value : 0),
        kap: parseInt(form.regkap.value !== "" ? form.regkap.value : 0)
    }
}

function _processGetAtkInfo(form) {

    let anat = false;
    let butc = false;
    let hamme = false;
    let sturm = false;
    let used = [];

    if(form.anatomy != null) anat = form.anatomy.checked;
    if(form.butcher != null) butc = form.butcher.checked;
    if(form.hamme != null) hamme = form.hamme.checked;
    if(form.sturm != null) sturm = form.sturm.checked;

    let bDMG = 0;

    if(anat) bDMG++;
    if(anat) used.push(game.i18n.localize("GDSA.chat.skill.anatomy"));
    if(butc) bDMG++;
    if(butc) used.push(game.i18n.localize("GDSA.chat.skill.butcher"));

    return {

        bonus: bDMG,
        advan: parseInt(form.advan.value !== "" ? form.advan.value : 0),
        disad: parseInt(form.disad.value !== "" ? form.disad.value : 0),
        wucht: parseInt(form.wucht.value !== "" ? form.wucht.value : 0),
        finte: parseInt(form.finte.value !== "" ? form.finte.value : 0),
        hamme: hamme,
        sturm: sturm,
        used: used
    }
}

function _processGetRangeAtkInfo(form) {

    return {

        advan: parseInt(form.advan.value !== "" ? form.advan.value : 0),
        disad: parseInt(form.disad.value !== "" ? form.disad.value : 0),
        bonus: parseInt(form.bonus.value !== "" ? form.bonus.value : 0),
        aimed: parseInt(form.aimed.value !== "" ? form.aimed.value : 0),
        winds: parseInt(form.winds.value !== "" ? form.winds.value : 0),
        sight: parseInt(form.sight.value !== "" ? form.sight.value : 0),
        movem: parseInt(form.movem.value !== "" ? form.movem.value : 0),
        dista: parseInt(form.dista.value !== "" ? form.dista.value : 0),
        hidea: parseInt(form.hidea.value !== "" ? form.hidea.value : 0),
        sizeX: parseInt(form.sizeX.value !== "" ? form.sizeX.value : 0)}
}

function _processGetMoneyInfo(form) {

    return {

        operation: form.operation.value,
        gold: parseInt(form.gold.value !== "" ? form.gold.value : 0),
        silver: parseInt(form.silver.value !== "" ? form.silver.value : 0),
        copper: parseInt(form.copper.value !== "" ? form.copper.value : 0),
        nikel: parseInt(form.nikel.value !== "" ? form.nikel.value : 0)}
}

function _processCharFacts(form) {

    return {

        race: form.race.value,
        culture: form.culture.value,
        profession: form.profession.value,
        gender: form.gender.value,
        age: form.age.value,
        size: form.size.value,
        weight: form.weight.value,
        social: form.social.value
    }
}

function _processCharRess(form) {

    return {
        newModValue: form.modValue.value,
        newBuyValue: form.buyValue.value
    }
}

function _processAchazOptions(form) {

    let mod = 0;

    if (form.stoneTrait1 != null) mod += parseInt(form.stoneTrait1.value) - 1;
    if (form.stoneTrait2 != null) mod += parseInt(form.stoneTrait2.value) - 1;
    if (form.stoneTrait3 != null) mod += parseInt(form.stoneTrait3.value) - 1;
    if (form.stoneTrait4 != null) mod += parseInt(form.stoneTrait4.value) - 1;

    if (form.modicount.value > 0)
        for (let i = 0; i == form.modicount.value; i++)
            if (form["modi" + i] != null) mod -= parseInt(form["modi" + i].value);
    
    let usedStones = [];

    if (form.stoneTrait1 != null) usedStones.push(form.stoneTrait1.options[form.stoneTrait1.selectedIndex].innerHTML);
    if (form.stoneTrait2 != null) usedStones.push(form.stoneTrait2.options[form.stoneTrait2.selectedIndex].innerHTML);
    if (form.stoneTrait3 != null) usedStones.push(form.stoneTrait3.options[form.stoneTrait3.selectedIndex].innerHTML);
    if (form.stoneTrait4 != null) usedStones.push(form.stoneTrait4.options[form.stoneTrait4.selectedIndex].innerHTML);
    
    if (form.modicount.value > 0)
        for (let j = 0; j == form.modicount.value; j++)
            if (form["modi" + j] != null) usedStones.push(form["modi" + j].options[form["modi" + j].selectedIndex].innerHTML);

    usedStones = usedStones.filter((value, index, array) => array.indexOf(value) === index);

    let index = usedStones.indexOf(game.i18n.localize("GDSA.spell.noGem"));
    if (index !== -1) usedStones = usedStones.splice(index, 1);

    let actionsPer = form.gemStore.value;
    let actions = 0;

    if (form.such != null) actionsPer = 1;

    actions = actionsPer * usedStones.length;

    if (form.such != null)actions = Math.ceil(actions / form.such.value);

    return {
        advantage: mod,
        actions: actions
    }
}

function _processCharStats(form) { return { newvalue: form.value.value }};
function _processAttributoOptions(form) { return { att: form.att1.value }};
function _processFaxioOptions(form) { return { dice: parseInt(form.dice.value)+1 }};
function _formatModifikation(string) { return string[0] + " " + string.substring(1)};
function _processTempSelection(form) { return { advantage: form.advantages.value}};