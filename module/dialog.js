export async function GetSkillCheckOptions() {

    const template = "systems/GDSA/templates/chat/skill-check-dialog.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {
            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {
                normal: {
                    label: game.i18n.format("GDSA.chat.skill.roll"),
                    callback: html => resolve(_processSkillCheckOptions(html[0].querySelector("form")))
                },
                cancel: {
                    label: game.i18n.format("GDSA.chat.skill.cancel"),
                    callback: html => resolve({cancelled: true})
                }
            },
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        new Dialog(data, null).render(true);
    });
}

function _processSkillCheckOptions(form) {

    return {

        advantage: parseInt(form.advantage.value),
        disadvantage: parseInt(form.disadvantage.value)}
}

export async function GetDMGInfo() {

    const template = "systems/GDSA/templates/chat/getDMG-dialog.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {

                normal: {
                    label: game.i18n.format("GDSA.chat.skill.do"),
                    callback: html => resolve(_processGetDMGOptions(html[0].querySelector("form")))},
                cancel: {
                    label: game.i18n.format("GDSA.chat.skill.cancel"),
                    callback: html => resolve({cancelled: true})}
            },
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        new Dialog(data, null).render(true);
    });
}

function _processGetDMGOptions(form) {

    return {value: parseInt(form.dmg.value)}
}

export async function GetHealInfo() {

    const template = "systems/GDSA/templates/chat/getHeal-dialog.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {

                normal: {
                    label: game.i18n.format("GDSA.chat.skill.do"),
                    callback: html => resolve(_processGetHealOptions(html[0].querySelector("form")))},
                cancel: {
                    label: game.i18n.format("GDSA.chat.skill.cancel"),
                    callback: html => resolve({cancelled: true})}
            },
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        new Dialog(data, null).render(true);
    });
}

function _processGetHealOptions(form) {

    return {value: parseInt(form.heal.value)}
}

export async function GetRegInfo() {

    const template = "systems/GDSA/templates/chat/doReg-dialog.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {

                normal: {
                    label: game.i18n.format("GDSA.chat.skill.do"),
                    callback: html => resolve(_processGetRegOptions(html[0].querySelector("form")))},
                cancel: {
                    label: game.i18n.format("GDSA.chat.skill.cancel"),
                    callback: html => resolve({cancelled: true})}
            },
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        new Dialog(data, null).render(true);
    });
}

function _processGetRegOptions(form) {

    return {value: parseInt(form.reg.value)}
}

export async function GetAtkInfo() {

    const template = "systems/GDSA/templates/chat/doAtk-dialog.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {

                normal: {
                    label: game.i18n.format("GDSA.chat.skill.do"),
                    callback: html => resolve(_processGetAtkInfo(html[0].querySelector("form")))},
                cancel: {
                    label: game.i18n.format("GDSA.chat.skill.cancel"),
                    callback: html => resolve({cancelled: true})}
            },
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        new Dialog(data, null).render(true);
    });
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

export async function GetRangeAtkInfo() {

    const template = "systems/GDSA/templates/chat/doRangeAtk-dialog.hbs";
    const html = await renderTemplate(template, {});

    return new Promise(resolve => {
        const data = {

            title: game.i18n.format("GDSA.chat.skill.optionDialog"),
            content: html,
            buttons: {

                normal: {
                    label: game.i18n.format("GDSA.chat.skill.do"),
                    callback: html => resolve(_processGetRangeAtkInfo(html[0].querySelector("form")))},
                cancel: {
                    label: game.i18n.format("GDSA.chat.skill.cancel"),
                    callback: html => resolve({cancelled: true})}
            },
            default: "normal",
            closed: () => resolve({cancelled: true})
        };

        new Dialog(data, null).render(true);
    });
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