export async function flawCheck(flawName, flawValue, actor) {

    if(flawValue == 0) return;

    const template = "systems/GDSA/templates/chat/flaw-check.hbs";
    const rollFormula = "1d20";

    let rollData = {};

    let rollResult = await new Roll(rollFormula, rollData).roll({ async: true });
    let rollResult2 = await new Roll(rollFormula, rollData).roll({ async: true });

    let confirm = false;

    if (rollResult.total == 1 || rollResult.total == 20)
        confirm = true;

    let resultFlaw = rollResult.total > flawValue ? true : false;

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        flawName: flawName,
        flawValue: flawValue,
        confirm: confirm,
        result: resultFlaw
      }; 

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        roll: rollResult,
        sound: CONFIG.sounds.dice,
        content: await renderTemplate(template, templateContext)
    };
    
    ChatMessage.create(chatData);  
}

export async function statCheck(statName, statValue, statMod, actor) {

    if(statValue == 0) return;

    const template = "systems/GDSA/templates/chat/stat-check.hbs";
    const rollFormula  = "1d20";
    
    let confirm = false;
    let critt = false;
    let goof = false;
    let modPresent = false;
    let isAdvantage = false;
    let isDisadvantage = false;
    let advantage = 0;
    let disadvantage = 0;

    let rollResult = await new Roll(rollFormula, {}).roll({ async: true});
    let rollResult2 = await new Roll(rollFormula, {}).roll({ async: true});
    let statValueTotal = parseInt(statValue,10) + parseInt(statMod,10);
    let resultStat = rollResult.total <= statValueTotal ? true : false;

    if(statMod > 0) {
        advantage = parseInt(statMod);
        disadvantage = 0;
        isAdvantage = true;
        modPresent = true;

    } else if(statMod < 0) {
        disadvantage = parseInt(statMod) * (-1);
        advantage = 0;
        isDisadvantage = true;
        modPresent = true;
    }

    if (rollResult.total == 1 || rollResult.total == 20)
        confirm = true;

    if(confirm && rollResult.total == 1 && rollResult2.total <= statValueTotal)
        critt = true;

    if(confirm && rollResult.total == 20 && rollResult2.total > statValueTotal)
        goof = true;

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        statName: statName,
        statValue: statValue,
        modPresent: modPresent,
        isAdv: isAdvantage,
        adv: advantage,
        isDis: isDisadvantage,
        dis: disadvantage,
        confirm: confirm,
        critt: critt,
        goof: goof,
        result: resultStat
    };

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({actor}),
        roll: rollResult,
        sound: CONFIG.sounds.dice,
        content: await renderTemplate(template, templateContext)
    };

    ChatMessage.create(chatData);
}

export async function skillCheck(statName, statValue, statOne, statTwo, statThree, beMod, actor, askForOptions, isGoofy) {

    let advantage = 0;
    let disadvantage = 0;
    let goofy = false;

    if(askForOptions) {

        let checkOptions = await GetSkillCheckOptions();

        if (checkOptions.cancelled)
            return;

        advantage = checkOptions.advantage;
        disadvantage = checkOptions.disadvantage;
        //goofy = checkOptions.goofy;
    }

    disadvantage = parseInt(disadvantage) + parseInt(beMod);

    const template = "systems/GDSA/templates/chat/skill-check.hbs";
    const rollFormula  = "1d20";

    let rollResult = await new Roll(rollFormula, {}).roll({ async: true});
    let rollResult2 = await new Roll(rollFormula, {}).roll({ async: true});
    let rollResult3 = await new Roll(rollFormula, {}).roll({ async: true});
    let rollResultAll = rollResult.total + rollResult2.total + rollResult3.total;
    let resultSkill = true;
    let modPresent = false;
    let critt = false;
    let goof = false;
    let res1 = false;
    let res2 = false;
    let res3 = false;
    let tap = 0;
    let tapMax = 0;
    let tempInt = parseInt(statValue);
    let isAdvantage = false;
    let isDisadvantage = false;
    let disAdTemp = 0;
    let modif = parseInt(advantage) - parseInt(disadvantage);

    if(modif > 0) {
        advantage = parseInt(modif);
        disadvantage = 0;
        isAdvantage = true;
        modPresent = true;

    } else if(modif < 0) {
        disadvantage = parseInt(modif) * (-1);
        advantage = 0;
        isDisadvantage = true;
        modPresent = true;
        tempInt = parseInt(tempInt) - parseInt(disadvantage);

        if(tempInt < 0)
            disAdTemp = tempInt;
    }

    if (parseInt(rollResultAll) - 2 == parseInt(rollResult.total) || parseInt(rollResultAll) - 2 == parseInt(rollResult2.total) || parseInt(rollResultAll) - 2 == parseInt(rollResult3.total))
        critt = true;

    if (parseInt(rollResultAll) - 40 == parseInt(rollResult.total) || parseInt(rollResultAll) - 40 == parseInt(rollResult2.total) || parseInt(rollResultAll) - 40 == parseInt(rollResult3.total))
        goof = true;

    if (goofy || isGoofy) {
        
        let tempCount = 0;

        if(rollResult.total == 20 || rollResult.total == 19)
            ++tempCount;
        if(rollResult2.total == 20 || rollResult2.total == 19)
            ++tempCount;
        if(rollResult3.total == 20 || rollResult3.total == 19)
            ++tempCount;
        if(tempCount > 1)
            goof = true;
    }

    if (rollResult.total <= (statOne - disAdTemp))
        res1 = true;

    if (rollResult2.total <= (statTwo - disAdTemp))
        res2 = true;

    if (rollResult3.total <= (statThree - disAdTemp))
        res3 = true;

    if(res1 == true && res2 == true && res3 == true) {

        let mTaP1 = parseInt(statOne) - parseInt(rollResult.total);
        let mTaP2 = parseInt(statTwo) - parseInt(rollResult2.total);
        let mTaP3 = parseInt(statThree) - parseInt(rollResult3.total);

        if (mTaP1 <= mTaP2 && mTaP1 <= mTaP3)
            tapMax = mTaP1;

        if (mTaP2 <= mTaP1 && mTaP2 <= mTaP3)
            tapMax = mTaP2;

        if (mTaP3 <= mTaP1 && mTaP3 <= mTaP2)
            tapMax = mTaP3;    

        tapMax = parseInt(tapMax) + parseInt(tempInt) + advantage;
        tap = parseInt(tempInt);
        if (parseInt(tap) <= 0)
            tap = 1;    
        resultSkill = true;
    
    } else {   

        tempInt = parseInt(tempInt) + parseInt(advantage);
        
        if (rollResult.total > statOne)
            tempInt = parseInt(tempInt) + (parseInt(statOne) - parseInt(rollResult.total));

        if (rollResult2.total > statTwo)
            tempInt = parseInt(tempInt) + (parseInt(statTwo) - parseInt(rollResult2.total));

        if (rollResult3.total > statThree)
            tempInt = parseInt(tempInt) + (parseInt(statThree) - parseInt(rollResult3.total));

        if (tempInt > 0) {

            let tempTap = tempInt;
            if(tempInt > parseInt(statValue))
                tempTap = parseInt(statValue);

            resultSkill = true;
            tap =tempTap;
            tapMax = tempInt;

        } else {
            if (tempInt == 0) {

                resultSkill = true;
                tap = 1;
                tapMax = 0;
            } else {

                resultSkill = false;
                tempInt = tempInt * (-1);
                tap = tempInt;
                tapMax = 0;
            }
        }
    }

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        roll3: rollResult3,
        statName: statName,
        statValue: statValue,
        modPresent: modPresent,
        modValue: modif,
        isAdv: isAdvantage,
        adv: advantage,
        isDis: isDisadvantage,
        dis: disadvantage,
        critt: critt,
        goof: goof,
        result: resultSkill,
        tap: tap,
        tapMax: tapMax
    };

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({actor}),
        roll: rollResult,
        sound: CONFIG.sounds.dice,
        content: await renderTemplate(template, templateContext)
    };

    ChatMessage.create(chatData);
}

async function GetSkillCheckOptions() {

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
        disadvantage: parseInt(form.disadvantage.value),
    }
}