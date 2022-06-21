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
        content: await renderTemplate(template, templateContext)
    };
    
    ChatMessage.create(chatData);  
}

export async function statCheck(statName, statValue, statMod, actor) {

    if(statValue == 0) return;

    const template = "systems/GDSA/templates/chat/stat-check.hbs";
    const rollFormula  = "1d20";

    let rollData = {};

    let rollResult = await new Roll(rollFormula, rollData).roll({ async: true});
    let rollResult2 = await new Roll(rollFormula, rollData).roll({ async: true});

    let confirm = false;
    let critt = false;
    let goof = false;
    let modPresent = false;

    let statValueTotal = parseInt(statValue,10) + parseInt(statMod,10);

    let resultStat = rollResult.total <= statValueTotal ? true : false;

    if (statMod > 0)
        modPresent = true;

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
        statMod: statMod,
        modPresent: modPresent,
        confirm: confirm,
        critt: critt,
        goof: goof,
        result: resultStat
    };

    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({actor}),
        roll: rollResult,
        content: await renderTemplate(template, templateContext)
    };

    ChatMessage.create(chatData);
}