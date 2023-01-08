import * as Util from "../Util.js";

export async function statCheck(statName, statValue, statMod, actor) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll of a Attribut Check, if the Result is under the Value the the Check is passed       ##
    // ##                                                                                             ##
    // ##    @statName      String of the Statname e.g. "Mut"                                         ##
    // ##    @statValue     Integer of the Value of the Stat e.g. 12                                  ##
    // ##    @statMod       Integer of the Stat Modi from (Dis)Advantages                             ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Return if the Attribut has a Value of 0, meaning its not rollable

    if(statValue == 0) return;

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/stat-check.hbs";

    // Roll 2 Dices 

    let rollResult = await new Roll("1d20", {}).roll({ async: true});
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true});

    // Set up the Total Value of the Attribut Value +/- the Modifier

    let statValueTotal = parseInt(statValue) + parseInt(statMod);

    // Fill the Context for the Chat HTML to fill  

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        statName: statName,
        statValue: statValue,
        adv: statMod,
    };

    // Checks the Result of the Roll, if it needs to be confirmed and there if its a Critt or a Goof
    // and add its then to the Context for the Chat

    templateContext.result = rollResult.total <= statValueTotal ? true : false;
    templateContext.confirm = (rollResult.total == 1 || rollResult.total == 20) ? true : false
    templateContext.critt = (rollResult.total == 1 && rollResult2.total <= statValueTotal) ? true : false;
    templateContext.goof = (rollResult.total == 20 && rollResult2.total > statValueTotal) ? true : false;

    // Sets the Booleans and Values for the Modifikation Indikator in the Chat

    templateContext.modPresent = (statMod != 0) ? true : false;
    templateContext.isAdv = (statMod > 0) ? true : false;
    templateContext.isDis = (statMod < 0) ? true : false;
    templateContext.dis = parseInt(statMod) * (-1);

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let dices = [rollResult.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    if(rollResult.total == 1 || rollResult.total == 20) dices.push(rollResult2.dice[0].values[0]);
    await doXD20XD6Roll(chatModel, dices, []);

    return rollResult.total <= statValueTotal ? true : false;
}

export async function flawCheck(flawName, flawValue, actor) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll of a Flaw Check, if the Result is under the Value the Flaw is triggered             ##
    // ##                                                                                             ##
    // ##    @flawName      String of the Flawname e.g. "Arroganz"                                    ##
    // ##    @flawValue     Integer of the Value of the Flaw e.g. 8                                   ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Return if the Flaw has a Value of 0, meaning its not rollable

    if(flawValue == 0) return;

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/flaw-check.hbs";

    // Roll 2 Dices

    let rollResult = await new Roll("1d20", {}).roll({ async: true });
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true });

    // Check the Result and if a Confirm roll is needed

    let resultFlaw = rollResult.total > flawValue ? true : false;
    let confirm = (rollResult.total == 1 || rollResult.total == 20) ? true : false;

    // Fill the Context for the Chat HTML to fill

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        flawName: flawName,
        flawValue: flawValue,
        confirm: confirm,
        result: resultFlaw
    };

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let dices = [rollResult.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    if(rollResult.total == 1 || rollResult.total == 20) dices.push(rollResult2.dice[0].values[0]);
    await doXD20XD6Roll(chatModel, dices, []);
}

export async function skillCheck(statName, statValue, statOne, statTwo, statThree, actor, isGoofy, modif) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll of a Skill Check                                                                    ##
    // ##                                                                                             ##
    // ##    @statName      String of the Skillname e.g. "Akrobatik"                                  ##
    // ##    @statValue     Integer of the Value of the Skill e.g. 8                                  ##
    // ##    @statOne       Integer of the Value of the first Attribute linked to the Skill e.g. 12   ##
    // ##    @statTwo       Integer of the Value of the second Attribute linked to the Skill e.g. 12  ##
    // ##    @statThree     Integer of the Value of the third Attribute linked to the Skill e.g. 12   ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##    @isGoofy       Boolean which indikates if the Actor has the Trait goofy e.g. false       ##
    // ##    @modif         Integer of the Modifier, if positiv its an advantage...                   ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/skill-check.hbs";

    // Roll 3 Dices

    let rollResult = await new Roll("1d20", {}).roll({ async: true});
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true});
    let rollResult3 = await new Roll("1d20", {}).roll({ async: true});

    // Define Endvariabels

    let tap = 0;
    let tapMax = 0;
    let resultSkill = true;

    // If the Disadvantage is bigger then the Skill Value, we store the difference for the first Check

    let disAdTemp = (modif < 0 && (parseInt(statValue) + parseInt(modif)) < 0) ? parseInt(statValue) + parseInt(modif) : 0;

    // Check if its a Critt or a Goof

    let rollResultAll = parseInt(rollResult.total) + parseInt(rollResult2.total) + parseInt(rollResult3.total);
    let critt = (parseInt(rollResultAll) - 2 == parseInt(rollResult.total) || parseInt(rollResultAll) - 2 == parseInt(rollResult2.total) || parseInt(rollResultAll) - 2 == parseInt(rollResult3.total)) ? true : false;
    let goof = (parseInt(rollResultAll) - 40 == parseInt(rollResult.total) || parseInt(rollResultAll) - 40 == parseInt(rollResult2.total) || parseInt(rollResultAll) - 40 == parseInt(rollResult3.total)) ? true : false;

    // If the Actor isGoofy than it checks if there are two or more Dices showing a 19 or 20. If that is the Case, the Roll is a Goof automaticly

    if (isGoofy) {
        
        let tempCount = 0;
        if(rollResult.total == 20 || rollResult.total == 19) ++tempCount;
        if(rollResult2.total == 20 || rollResult2.total == 19) ++tempCount;
        if(rollResult3.total == 20 || rollResult3.total == 19) ++tempCount;
        if(tempCount > 1) goof = true;
    }

    // Checks if all three Dices are rolled lower than there respectiv Attributes and sets an Indikator for each Roll

    let res1 = (rollResult.total <= (statOne - disAdTemp)) ? true : false;
    let res2 = (rollResult2.total <= (statTwo - disAdTemp)) ? true : false;
    let res3 = (rollResult3.total <= (statThree - disAdTemp)) ? true : false;

    if(res1 == true && res2 == true && res3 == true) {

        // Adds only the Disadvantage, if present, to the temporary Statvalue

        let tempInt = (modif < 0) ? parseInt(statValue) + parseInt(modif) : parseInt(statValue);

        // Calculatates how much each Dice rolled underneath the Attribute

        let mTaP1 = parseInt(statOne) - parseInt(rollResult.total);
        let mTaP2 = parseInt(statTwo) - parseInt(rollResult2.total);
        let mTaP3 = parseInt(statThree) - parseInt(rollResult3.total);

        // Gets value of the smallest Value

        if (mTaP1 <= mTaP2 && mTaP1 <= mTaP3) tapMax = mTaP1;
        else if (mTaP2 <= mTaP1 && mTaP2 <= mTaP3) tapMax = mTaP2;
        else tapMax = mTaP3;

        // Set the TAP*, the max possible Disadvantage and set the Indicator that the Check is passed

        if (tempInt < 0 && tempInt >= (tapMax * -1)) {
            
            tap = 1;
            tapMax -= tempInt;   
            resultSkill = true;

        } else if (tempInt < 0) {

            tap = (tempInt * (-1)) - tapMax;
            tapMax = 0;
            resultSkill = false;

        } else {

            tap = tempInt;
            tapMax += parseInt(statValue) + parseInt(modif);
            resultSkill = true;
        }

    } else {

        // Adds the Modifier, if present, to the temporary Statvalue

        let tempInt = parseInt(statValue) + modif;

        // Reduce the temporary Statvalue by the value that the Values that Roll was over the Attribute
        
        if (rollResult.total > statOne) tempInt += (parseInt(statOne) - parseInt(rollResult.total));
        if (rollResult2.total > statTwo) tempInt += (parseInt(statTwo) - parseInt(rollResult2.total));
        if (rollResult3.total > statThree) tempInt += (parseInt(statThree) - parseInt(rollResult3.total));

        // Set the TAP*, the max possible Disadvantage and set the Indicator that the Check is passed

        if (tempInt == 0) {

            tap = 1;
            tapMax = 0;
            resultSkill = true;

        } else if (tempInt >= 0) {
            
            tap = (tempInt > statValue) ? statValue : tempInt;
            tapMax = tempInt;
            resultSkill = true;

        } else {

            tap = tempInt * (-1);
            tapMax = 0;
            resultSkill = false;              
        }
    }

    // Makes sure, that there is always at least 1 TaP*

    if(tap == 0) tap =  1;

    // Fill the Context for the Chat HTML to fill

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        roll3: rollResult3,
        statName: statName,
        statValue: statValue,
        modValue: modif,
        adv: modif,
        critt: critt,
        goof: goof,
        result: resultSkill,
        tap: tap,
        tapMax: tapMax
    };

    // Sets the Booleans and Values for the Modifikation Indikator in the Chat

    templateContext.modPresent = (modif != 0) ? true : false;
    templateContext.isAdv = (modif > 0) ? true : false;
    templateContext.isDis = (modif < 0) ? true : false;
    templateContext.dis = parseInt(modif) * (-1);

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation
    
    let dices = [rollResult.dice[0].values[0], rollResult2.dice[0].values[0], rollResult3.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    await doXD20XD6Roll(chatModel, dices, []);
}

export async function doLePReg(actor, HPBonus) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll a LeP Regeneration Check and Return the Amount of regenerated LeP                   ##
    // ##                                                                                             ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##    @HPBonus       Integer of HP Bonus with is applied flat on the Regeneration              ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/hp-reg-check.hbs";

    // Roll 2 Dices

    let rollResult = await new Roll("1d6", {}).roll({ async: true });
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true });

    // Add togehter the D6 Regeneration, with the HPBonus and add 1 Additional point if the Attribut Check passed

    let regtotal = parseInt(rollResult.total) + parseInt(HPBonus);
    if(rollResult2.total <= actor.system.KO.value) regtotal++;

    // Check that the Max Reg Possible is what LeP is actually missing

    let lostLeP = actor.system.LeP.max - actor.system.LeP.value;
    if(lostLeP < regtotal) regtotal = lostLeP;
    if(regtotal < 0) regtotal = 0;

    // Fill the Context for the Chat HTML to fill

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        regtotal: regtotal
    }; 

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    await doXD20XD6Roll(chatModel, [rollResult2.total], [rollResult.total]);   

    // Return the Total Amount of Regenerated LeP Amount

    return regtotal;
}

export async function doAsPReg(actor, APBonus, isMaster) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll a AsP Regeneration Check and Return the Amount of regenerated AsP                   ##
    // ##                                                                                             ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##    @APBonus       Integer of APBonus with is applied flat on the Regeneration               ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/ap-reg-check.hbs";
    
    // Roll 2 Dices

    let rollResult = await new Roll("1d6", {}).roll({ async: true });
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true });

    // Add togehter the D6 Regeneration, with the HPBonus and add 1 Additional point if the Attribut Check passed

    let regtotal = parseInt(rollResult.total) + parseInt(APBonus);
    if(rollResult2.total <= actor.system.IN.value) regtotal++;

    // Check that the Max Reg Possible is what LeP is actually missing

    let lostAsP = actor.system.AsP.max - actor.system.AsP.value;
    if(lostAsP < regtotal) regtotal = lostLeP;
    if(regtotal < 0) regtotal = 0;

    // Fill the Context for the Chat HTML to fill

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        regtotal: regtotal,
        isMaster: isMaster
    }; 

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    await doXD20XD6Roll(chatModel, [rollResult2.total], [rollResult.total]);   

    // Return the Total Amount of Regenerated LeP Amount

    return regtotal;
}

export async function doKaPReg(actor, modi) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll a Meditation Check and Return the Amount of regenerated KaP                         ##
    // ##                                                                                             ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##    @modi          Integer of Modifikation that is applied on the Meditation                 ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/medi-check.hbs";

    // Roll 3 Dices
 
    let rollResult = await new Roll("1d20", {}).roll({ async: true});
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true});
    let rollResult3 = await new Roll("1d20", {}).roll({ async: true});
 
    // Define Endvariabels
 
    let tap = 0;
    let tapMax = 0;
    let resultSkill = true;
     
    let statValue = actor.system.skill.liturgy; 
    let statOne = actor.system.MU.value; 
    let statTwo = actor.system.IN.value; 
    let statThree = actor.system.CH.value; 
 
    // If the Disadvantage is bigger then the Skill Value, we store the difference for the first Check
 
    let disAdTemp = (modi < 0 && (parseInt(statValue) + parseInt(modi)) < 0) ? parseInt(statValue) + parseInt(modi) : 0;
 
    // Checks if all three Dices are rolled lower than there respectiv Attributes and sets an Indikator for each Roll
 
    let res1 = (rollResult.total <= (statOne - disAdTemp)) ? true : false;
    let res2 = (rollResult2.total <= (statTwo - disAdTemp)) ? true : false;
    let res3 = (rollResult3.total <= (statThree - disAdTemp)) ? true : false;
 
    if(res1 == true && res2 == true && res3 == true) {
 
        // Adds only the Disadvantage, if present, to the temporary Statvalue
 
        let tempInt = (modi < 0) ? parseInt(statValue) + parseInt(modi) : parseInt(statValue);
 
        // Calculatates how much each Dice rolled underneath the Attribute
 
        let mTaP1 = parseInt(statOne) - parseInt(rollResult.total);
        let mTaP2 = parseInt(statTwo) - parseInt(rollResult2.total);
        let mTaP3 = parseInt(statThree) - parseInt(rollResult3.total);
 
        // Gets value of the smallest Value
 
        if (mTaP1 <= mTaP2 && mTaP1 <= mTaP3) tapMax = mTaP1;
        else if (mTaP2 <= mTaP1 && mTaP2 <= mTaP3) tapMax = mTaP2;
        else tapMax = mTaP3;
 
        // Set the TAP*, the max possible Disadvantage and set the Indicator that the Check is passed
 
        if (tempInt < 0 && tempInt >= (tapMax * -1)) {
             
            tap = 1;
            tapMax -= tempInt;   
            resultSkill = true;
 
        } else if (tempInt < 0) {
 
            tap = (tempInt * (-1)) - tapMax;
            tapMax = 0;
            resultSkill = false;
 
        } else {
 
            tap = tempInt;
            tapMax += parseInt(statValue) + parseInt(modi);
            resultSkill = true;
        }
 
    } else {
 
        // Adds the Modifier, if present, to the temporary Statvalue
 
        let tempInt = parseInt(statValue) + modi;
 
        // Reduce the temporary Statvalue by the value that the Values that Roll was over the Attribute
         
        if (rollResult.total > statOne) tempInt += (parseInt(statOne) - parseInt(rollResult.total));
        if (rollResult2.total > statTwo) tempInt += (parseInt(statTwo) - parseInt(rollResult2.total));
        if (rollResult3.total > statThree) tempInt += (parseInt(statThree) - parseInt(rollResult3.total));
 
        // Set the TAP*, the max possible Disadvantage and set the Indicator that the Check is passed
 
        if (tempInt == 0) {
 
            tap = 1;
            tapMax = 0;
            resultSkill = true;
 
        } else if (tempInt >= 0) {
             
            tap = (tempInt > statValue) ? statValue : tempInt;
            tapMax = tempInt;
            resultSkill = true;
 
        } else {
 
            tap = tempInt * (-1);
            tapMax = 0;
            resultSkill = false;              
        }
    }
 
     // Makes sure, that there is always at least 1 TaP*
 
    if(tap == 0) tap =  1;

    // Check that the Max Reg Possible is what LeP is actually missing

    let lostKaP = actor.system.KaP.max - actor.system.KaP.value;
    if(lostKaP < tap) tap = lostKaP;
    if(tap < 0) tap = 0;

    // Fill the Context for the Chat HTML to fill

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        roll3: rollResult3,
        statValue: statValue,
        modValue: modi,
        adv: modi,
        result: resultSkill,
        tap: tap,
        tapMax: tapMax
    };

    // Sets the Booleans and Values for the Modifikation Indikator in the Chat

    templateContext.modPresent = (modi != 0) ? true : false;
    templateContext.isAdv = (modi > 0) ? true : false;
    templateContext.isDis = (modi < 0) ? true : false;
    templateContext.dis = parseInt(modi) * (-1);

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let dices = [rollResult.dice[0].values[0], rollResult2.dice[0].values[0], rollResult3.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    await doXD20XD6Roll(chatModel, dices, []);

    // Return the Total Amount of Regenerated LeP Amount

    return tap;
}

export async function ATKCheck(atk, modi, actor, auto = false, isMeele = true, chatId = "") {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll a Attack Check and Return if the Attack was successfull or not.                     ##
    // ##                                                                                             ##
    // ##    @atk           Integer of the ATK Stat e.g. "14"                                         ##
    // ##    @modi          Integer of Modifikation that is applied on the Meditation                 ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Return if the Attribut has a Value of 0, meaning its not rollable

    if(atk == 0) return;

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/atk-check.hbs";

    // Roll 2 Dices

    let rollResult = await new Roll("1d20", {}).roll({ async: true});
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true});
    let rollResult3 = await new Roll("2d6", {}).roll({ async: true});

    // Set up the Total Value of the Attribut Value +/- the Modifier
    
    let statValueTotal = parseInt(atk) + parseInt(modi);

    // Fill the Context for the Chat HTML to fill  

    let templateContext = {
        actor: actor._id,
        roll: rollResult,
        roll2: rollResult2,
        ATKValue: atk,
        adv: modi,
        auto: auto,
        chatId: chatId
    };
    
    // Checks the Result of the Roll, if it needs to be confirmed and there if its a Critt or a Goof
    // and add its then to the Context for the Chat
    
    templateContext.result = rollResult.total <= statValueTotal ? true : false;
    templateContext.confirm = (rollResult.total == 1 || rollResult.total == 20) ? true : false
    templateContext.critt = (rollResult.total == 1 && rollResult2.total <= statValueTotal) ? true : false;
    templateContext.goof = (rollResult.total == 20 && rollResult2.total > statValueTotal) ? true : false;
    templateContext.goofed = (isMeele) ? Util.getGoofyMelee(rollResult3.total) : Util.getGoofyFK(rollResult3.total);
    
    // Sets the Booleans and Values for the Modifikation Indikator in the Chat
    
    templateContext.modPresent = (modi != 0) ? true : false;
    templateContext.isAdv = (modi > 0) ? true : false;
    templateContext.isDis = (modi < 0) ? true : false;
    templateContext.dis = parseInt(modi) * (-1);

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let goofDices = [];
    let dices = [rollResult.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    if(rollResult.total == 1 || rollResult.total == 20) dices.push(rollResult2.dice[0].values[0]);
    if(rollResult.total == 20 && rollResult2.total > statValueTotal) goofDices.push(rollResult3.dice[0].values[0]);
    if(rollResult.total == 20 && rollResult2.total > statValueTotal) goofDices.push(rollResult3.dice[0].values[1]);
    let status = await doXD20XD6Roll(chatModel, dices, goofDices);

    // If it was a Goof and combat is running, reduce the Ini accordingly of the actor

    if (game.combats.contents.length > 0) {
        let userCombatantId = game.combats.contents[0].combatants._source.filter(function(cbt) {return cbt.actorId == data.actor.id})[0]._id;
        userCombatant = game.combats.contents[0].combatants.get(userCombatantId);
        attacksLeft = userCombatant.getFlag("GDSA", "attacks");
        attackerparriesLeft = userCombatant.getFlag("GDSA", "parries");
    }
    
    // Return if the ATK was successful or not

    return rollResult.total <= statValueTotal ? true : false;
}

export async function PACheck(parry, modi, actor) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll a Parry Check and Return if the Parry was successfull or not.                       ##
    // ##                                                                                             ##
    // ##    @atk           Integer of the PA Stat e.g. "14"                                          ##
    // ##    @modi          Integer of Modifikation that is applied on the Meditation                 ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Return if the Attribut has a Value of 0, meaning its not rollable

    if(parry == 0) return;

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/pa-check.hbs";

    // Roll 2 Dices

    let rollResult = await new Roll("1d20", {}).roll({ async: true});
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true});

    // Set up the Total Value of the Attribut Value +/- the Modifier
    
    let statValueTotal = parseInt(parry) + parseInt(modi);

    // Fill the Context for the Chat HTML to fill  

    let templateContext = {
        actor: actor._id,
        roll: rollResult,
        roll2: rollResult2,
        PAValue: parry,
        adv: modi
    };
    
    // Checks the Result of the Roll, if it needs to be confirmed and there if its a Critt or a Goof
    // and add its then to the Context for the Chat
    
    templateContext.result = rollResult.total <= statValueTotal ? true : false;
    templateContext.confirm = (rollResult.total == 1 || rollResult.total == 20) ? true : false
    templateContext.critt = (rollResult.total == 1 && rollResult2.total <= statValueTotal) ? true : false;
    templateContext.goof = (rollResult.total == 20 && rollResult2.total > statValueTotal) ? true : false;
    
    // Sets the Booleans and Values for the Modifikation Indikator in the Chat
    
    templateContext.modPresent = (modi != 0) ? true : false;
    templateContext.isAdv = (modi > 0) ? true : false;
    templateContext.isDis = (modi < 0) ? true : false;
    templateContext.dis = parseInt(modi) * (-1);

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let dices = [rollResult.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    if(rollResult.total == 1 || rollResult.total == 20) dices.push(rollResult2.dice[0].values[0]);
    await doXD20XD6Roll(chatModel, dices, []);
    
    // Return if the ATK was successful or not

    return rollResult.total <= statValueTotal ? true : false;
}

export async function DMGRoll(formula, actor, multi, chatId = "") {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll a Damage Roll                                                                       ##
    // ##                                                                                             ##
    // ##    @formula       String with the Roll Formular e.g. "1d6 + 5 + 6"                          ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##    @actor         Integer that is Multipling the DMG Result                                 ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Return if the Formular has a Value of 0, meaning its not rollable

    if(formula == 0 || formula == null) return;

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/dmg-roll.hbs";

    // Roll the Dice and add together the DMG

    let rollResult = await new Roll(formula, {}).roll({ async: true});
    let total = parseInt(rollResult.total) * parseInt(multi);

    // Roll the Dice for the Zone and get the Zone

    let zone = await new Roll("1d20", {}).roll({ async: true});
    let hitZone = Util.getZone(zone.total);

    // Fill the Context for the Chat HTML to fill  

    let templateContext = {
        totalDMG: total,
        roll: rollResult,
        zone: hitZone,
        chatId: chatId
    };

    // Fill the Results to the right Array for Display

    let d20 = zone.dice[0].values;
    let d6 = [];

    if(rollResult.dice[0].faces == 6) d6.push(...rollResult.dice[0].values);
    if(rollResult.dice[0].faces == 20) d20.push(...rollResult.dice[0].values)

    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    await doXD20XD6Roll(chatModel, d20, d6);

    return total;
}

async function doXD20XD6Roll(chatData, result1, result2) {

    // Fill the dices Array with the Dice Models of both Dice Types

    let dice = [];
    for (let index1 = 0; index1 < result1.length; index1++) dice.push(d20Model(result1[index1]));
    for (let index2 = 0; index2 < result2.length; index2++) dice.push(d6Model(result2[index2]));

    // Bild the Data Model with the merged Array

    let data = { throws:[{dice: dice}]};

    // Act depend of the Status of the Module Dice-so-nice in the World to trigger respectivly
    // Also, in Case that there are only 2d20 roll first one and the second after the first to immers the conformation Roll
    // And only post the Chatmessages after all rolls are displayed

    return new Promise(resolve => {
        if(!game.modules.get("dice-so-nice")?.active) {

            chatData.sound = CONFIG.sounds.dice;
            ChatMessage.create(chatData);
            resolve(true)

        } else if (result1.length == 2 && result2.length <= 0) 
            game.dice3d.show({ throws:[{dice: [d20Model(result1[0])]}]}).then(displayed => 
                { game.dice3d.show({ throws:[{dice: [d20Model(result1[1])]}]}).then(displayed => 
                        { ChatMessage.create(chatData); resolve(true)});});
        else if (result1.length == 2 && result2.length == 2) 
            game.dice3d.show({ throws:[{dice: [d20Model(result1[0])]}]}).then(displayed => 
                { game.dice3d.show({ throws:[{dice: [d20Model(result1[1])]}]}).then(displayed => 
                    { game.dice3d.show({ throws:[{dice: [d6Model(result2[0]), d6Model(result2[1])]}]}).then( displayed =>
                        { ChatMessage.create(chatData); resolve(true)});});});
        else game.dice3d.show(data).then(displayed => { ChatMessage.create(chatData); resolve(true)});
    });
}

function d20Model(result) {

    // Create the Dice so Nice Model for D20

    let model = {
        result: result,
        resultLabel: result,
        type: "d20",
        vectors:[],
        options:{}
    };

    return model;
}

function d6Model(result) {

    // Create the Dice so Nice Model for D6

    let model = {
        result: result,
        resultLabel: result,
        type: "d6",
        vectors:[],
        options:{}
    };

    return model;
}

function chatData(actor, template) {

    // Create Chat Data Model

    let data = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({actor}),
        content: template
    };

    return data;
}