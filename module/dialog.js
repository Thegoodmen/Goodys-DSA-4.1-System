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



        // #################################################################################################
        // #################################################################################################
        // ##                                                                                             ##
        // ##         Helper Functions that transform the Form Data to Objekts that are returned          ##
        // ##                                                                                             ##
        // #################################################################################################
        // #################################################################################################


function _processSkillCheckOptions(form) {

    return {

        advantage: parseInt(form.advantage.value),
        disadvantage: parseInt(form.disadvantage.value)}
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

function _processMediCheckOptions(form) {

    return {disadvantage: parseInt(form.time.value) + parseInt(form.place.value) + parseInt(form.last.value)}
}

function _processGetDMGOptions(form) {

    return {value: parseInt(form.dmg.value)}
}

function _processGetHealOptions(form) {

    return {value: parseInt(form.heal.value)}
}

function _processGetRegOptions(form) {

    return {value: parseInt(form.reg.value)}
}

function _processGetAtkInfo(form) {

    return {

        advan: parseInt(form.advan.value),
        disad: parseInt(form.disad.value),
        wucht: parseInt(form.wucht.value),
        finte: parseInt(form.finte.value),
        hamme: form.hamme.checked,
        sturm: form.sturm.checked}
}

function _processGetRangeAtkInfo(form) {

    return {

        disad: parseInt(form.disad.value),
        bonus: parseInt(form.bonus.value),
        aimed: parseInt(form.aimed.value),
        winds: parseInt(form.winds.value),
        sight: parseInt(form.sight.value),
        movem: parseInt(form.movem.value),
        dista: parseInt(form.dista.value),
        hidea: parseInt(form.hidea.value),
        sizeX: parseInt(form.sizeX.value)}
}

function _processGetMoneyInfo(form) {

    return {

        operation: form.operation.value,
        gold: parseInt(form.gold.value),
        silver: parseInt(form.silver.value),
        copper: parseInt(form.copper.value),
        nikel: parseInt(form.nikel.value)}
}