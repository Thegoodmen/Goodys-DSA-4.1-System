export async function GetSkillCheckOptions() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/skill-check-dialog.hbs";
    const html = await renderTemplate(template, {});

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

export async function GetWonderOptions() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/wonder-check-dialog.hbs";
    const html = await renderTemplate(template, {});

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

    const template = "systems/GDSA/templates/chat/spell-check-dialog.hbs";
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

    const template = "systems/GDSA/templates/chat/spell-attributo-dialog.hbs";
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

    const template = "systems/GDSA/templates/chat/spell-faxio-dialog.hbs";
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


export async function GetMeditationOptions() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/medi-check-dialog.hbs";
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

    const template = "systems/GDSA/templates/chat/getDMG-dialog.hbs";
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

    const template = "systems/GDSA/templates/chat/getAsPLoss-dialog.hbs";
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

    const template = "systems/GDSA/templates/chat/getAsP-dialog.hbs";
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

    const template = "systems/GDSA/templates/chat/getKaP-dialog.hbs";
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

    const template = "systems/GDSA/templates/chat/getKaPLoss-dialog.hbs";
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

    const template = "systems/GDSA/templates/chat/getHeal-dialog.hbs";
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

    const template = "systems/GDSA/templates/chat/doReg-dialog.hbs";
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

export async function GetAtkInfo() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/doAtk-dialog.hbs";
    const html = await renderTemplate(template, {});

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

export async function GetRangeAtkInfo() {

    // Create Dialog and show to User

    const template = "systems/GDSA/templates/chat/doRangeAtk-dialog.hbs";
    const html = await renderTemplate(template, {});

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

    const template = "systems/GDSA/templates/chat/money-dialog.hbs";
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

        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##         Helper Functions that transform the Form Data to Objekts that are returned          ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################


function _processSkillCheckOptions(form) {

    return {

        advantage: parseInt(form.advantage.value !== "" ? form.advantage.value : 0),
        disadvantage: parseInt(form.disadvantage.value !== "" ? form.disadvantage.value : 0)
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

function _processWonderCheckOptions(form) {

    let advantage = 0;
    let disadvantage = 0;

    if (parseInt(form.time.value) > 0) disadvantage += parseInt(form.time.value);
        else advantage += (parseInt(form.time.value) * (-1))
    
    if (parseInt(form.place.value) > 0) disadvantage += parseInt(form.place.value);
        else advantage += (parseInt(form.place.value) * (-1))

    if (parseInt(form.motivation.value) > 0) disadvantage += parseInt(form.motivation.value);
        else advantage += (parseInt(form.motivation.value) * (-1))

    if (parseInt(form.motivation.value) > 0) disadvantage += parseInt(form.motivation.value);
        else advantage += (parseInt(form.motivation.value) * (-1))

    if (parseInt(form.help.value) > 0) disadvantage += parseInt(form.help.value);
        else advantage += (parseInt(form.help.value) * (-1))

    return {

        advantage: advantage,
        disadvantage: disadvantage}
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
        lep: parseInt(form.reglep.value !== "" ? form.reglep.value : 0),
        asp: parseInt(form.regasp.value !== "" ? form.regasp.value : 0),
        kap: parseInt(form.regkap.value !== "" ? form.regkap.value : 0)
    }
}

function _processGetAtkInfo(form) {

    return {

        advan: parseInt(form.advan.value !== "" ? form.advan.value : 0),
        disad: parseInt(form.disad.value !== "" ? form.disad.value : 0),
        wucht: parseInt(form.wucht.value !== "" ? form.wucht.value : 0),
        finte: parseInt(form.finte.value !== "" ? form.finte.value : 0),
        hamme: form.hamme.checked,
        sturm: form.sturm.checked}
}

function _processGetRangeAtkInfo(form) {

    return {

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

function _processCharStats(form) { return { newvalue: form.value.value }};
function _processAttributoOptions(form) { return { att: form.att1.value }};
function _processFaxioOptions(form) { return { dice: parseInt(form.dice.value)+1 }};