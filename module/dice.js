import * as Util from "../Util.js";

export async function statCheck(statName, statValue, statMod, actor, modi = 0, optional = {}) {

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

    if(statValue === 0) return;

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/stat-Roll.hbs";

    // Roll 2 Dices 

    let rollResult = await new Roll("1d20", {}).roll({ async: true});
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true});

    // Set up the Total Value of the Attribut Value +/- the Modifier

    let statValueTotal = parseInt(statValue) + parseInt(statMod);

    // Set Advantages or Disadvantage

    let adv = modi;
    let dis = modi * (-1);

    // Fill the Context for the Chat HTML to fill  

    let templateContext = {
        roll: rollResult,
        roll2: rollResult2,
        statName: statName,
        statValue: statValueTotal,
        adv: adv,
        dis: dis,
    };

    // Checks the Result of the Roll, if it needs to be confirmed and there if its a Critt or a Goof
    // and add its then to the Context for the Chat

    templateContext.result = rollResult.total <= (statValueTotal + modi);
    if(rollResult.total === 20) templateContext.result = false;
    templateContext.confirm = (rollResult.total === 1 || rollResult.total === 20);
    templateContext.critt = (rollResult.total === 1 && rollResult2.total <= statValueTotal);
    templateContext.goof = (rollResult.total === 20 && rollResult2.total > statValueTotal);

    // Sets the Booleans and Values for the Modifikation Indikator in the Chat

    templateContext.modPresent = (modi != 0);
    templateContext.isAdv = (modi > 0);
    templateContext.isDis = (modi < 0);
    templateContext.dis = parseInt(modi) * (-1);
    templateContext.used = optional.used;

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let dices = [rollResult.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    if(rollResult.total === 1 || rollResult.total === 20) dices.push(rollResult2.dice[0].values[0]);
    let message = "";
    if (!optional.noChat) message = await doXD20XD6Roll(chatModel, dices, []);

    return {
        succ: rollResult.total <= (statValueTotal + modi),
        value: (statValueTotal + modi) - rollResult.total,
        dices: dices,
        templatePath: templatePath,
        templateContext: templateContext,
        message: message
    };
}

export async function dogdeCheck(statName, statValue, statMod, actor, context = {}) {

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

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/dogde-Roll.hbs";

    // Roll 2 Dices 

    let rollResult1 = await new Roll("1d20", {}).roll({ async: true});
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true});

    // Set up the Total Value of the Attribut Value +/- the Modifier

    let statValueTotal = parseInt(statValue) + parseInt(statMod);
    let modi = statMod;

    // Fill the Context for the Chat HTML to fill  

    let templateContext = {
        roll: rollResult1,
        roll2: rollResult2,
        statName: statName,
        statValue: statValue,
        adv: 0,
        additional: context
    };

    // Checks the Result of the Roll, if it needs to be confirmed and there if its a Critt or a Goof
    // and add its then to the Context for the Chat

    templateContext.result = rollResult1.total <= statValueTotal;
    templateContext.confirm = (rollResult1.total == 1 || rollResult1.total == 20);
    templateContext.critt = (rollResult1.total == 1 && rollResult2.total <= statValueTotal);
    templateContext.goof = (rollResult1.total == 20 && rollResult2.total > statValueTotal);

    // Sets the Booleans and Values for the Modifikation Indikator in the Chat

    templateContext.modPresent = (modi != 0);
    templateContext.isAdv = (modi > 0);
    templateContext.isDis = (modi < 0);
    templateContext.dis = parseInt(modi) * (-1);

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let dices = [rollResult1.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    if(rollResult1.total == 1 || rollResult1.total == 20) dices.push(rollResult2.dice[0].values[0]);
    let message = await doXD20XD6Roll(chatModel, dices, []);

    return {
        result: templateContext.result,
        critt: templateContext.critt,
        die1: rollResult1.total,
        message: message
    };
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

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/flaw-Roll.hbs";

    // Roll 2 Dices

    let rollResult = await new Roll("1d20", {}).roll({ async: true });
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true });

    // Check the Result and if a Confirm roll is needed

    let resultFlaw = (rollResult.total > flawValue);
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
    let message = "";
    message = await doXD20XD6Roll(chatModel, dices, []);

    return {
        succ: rollResult.total > flawValue,
        value: rollResult.total - flawValue,
        dices: dices,
        templatePath: templatePath,
        templateContext: templateContext,
        message: message
    };
}

export async function skillCheck(statName, statValue, statOne, statTwo, statThree, actor, isGoofy, modif, optional = {}) {

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
    // ##    @optional      Carries an Opjekt for Additional Information to be displayed in Chat      ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Set up the Path of the Chat HTML
    let templatePath = "systems/GDSA/templates/chat/skill-check.hbs";
    if (Object.keys(optional).length !== 0) templatePath = optional.template;

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

    if (isGoofy) goof = (parseInt(rollResultAll) - 38 >= parseInt(rollResult.total) || parseInt(rollResultAll) - 38 >= parseInt(rollResult2.total) || parseInt(rollResultAll) - 38 >= parseInt(rollResult3.total)) ? true : false;

    // Checks if all three Dices are rolled lower than there respectiv Attributes and sets an Indikator for each Roll

    let res1 = (rollResult.total <= (statOne - disAdTemp)) ? true : false;
    let res2 = (rollResult2.total <= (statTwo - disAdTemp)) ? true : false;
    let res3 = (rollResult3.total <= (statThree - disAdTemp)) ? true : false;

    if(res1 == true && res2 == true && res3 == true) {

        // Adds only the Disadvantage, if present, to the temporary Statvalue

        let tempInt = (parseInt(modif) < 0) ? parseInt(statValue) + parseInt(modif) : parseInt(statValue);

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
            tapMax += tempInt;   
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

        let tempInt = parseInt(statValue) + parseInt(modif);

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
    templateContext = Object.assign(templateContext, optional);

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation
    
    let dices = [rollResult.dice[0].values[0], rollResult2.dice[0].values[0], rollResult3.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    let message = "";
    if (!optional.noChat) message = await doXD20XD6Roll(chatModel, dices, []);

    return {
        succ: resultSkill,
        value: tap,
        dices: dices,
        templatePath: templatePath,
        templateContext: templateContext,
        message: message
    };
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

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/lep-Reg-Roll.hbs";

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

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/asp-Reg-Roll.hbs";
    
    // Roll 2 Dices

    let rollResult = await new Roll("1d6", {}).roll({ async: true });
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true });

    // Add togehter the D6 Regeneration, with the HPBonus and add 1 Additional point if the Attribut Check passed

    let regtotal = parseInt(rollResult.total) + parseInt(APBonus);
    if(rollResult2.total <= actor.system.IN.value) regtotal++;

    // Check that the Max Reg Possible is what LeP is actually missing

    let lostAsP = actor.system.AsP.max - actor.system.AsP.value;
    if(lostAsP < regtotal) regtotal = lostAsP;
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

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/kap-Reg-Roll.hbs";

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

export async function ATKCheck(atk, modi, actor, auto = false, isMeele = true, chatId = "", context = {}) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll a Attack Check and Return if the Attack was successfull or not.                     ##
    // ##                                                                                             ##
    // ##    @atk           Integer of the ATK Stat e.g. "14"                                         ##
    // ##    @modi          Integer of Modifikation that is applied on the Meditation                 ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##    @auto          Indicator if the Attack is handeld via Autmated Combat                    ##
    // ##    @isMeele       Indicator if the Attack is a Meele Attack                                 ##
    // ##    @chatId        The ID of the Chat Context saved in the Memory                            ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Return if the Attribut has a Value of 0, meaning its not rollable

    if(atk === 0) return;

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/attack-Roll.hbs";

    // Roll 2 D20 Dices and 2 D6 Dices

    let rollResult1 = await new Roll("1d20", {}).roll({ async: true});
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true});
    let rollResult3 = await new Roll("2d6", {}).roll({ async: true});

    // Set up the Total Value of the Attribut Value +/- the Modifier
    
    let statValueTotal = parseInt(atk) + parseInt(modi);

    // Fill the Context for the Chat HTML to fill  

    let templateContext = {
        
        actor: actor._id,
        roll: rollResult1,
        roll2: rollResult2,
        ATKValue: atk,
        modPresent: (modi !== 0),
        adv: (parseInt(modi) * (+1)),
        dis: (parseInt(modi) * (-1)),
        isAdv: (modi > 0),
        isDis: (modi < 0),
        auto: auto,
        chatId: chatId,
        additional: context
    };
    
    // Checks the Result of the Roll, if it needs to be confirmed and there if its a Critt or a Goof
    // and add its then to the Context for the Chat
    
    templateContext.result = rollResult1.total <= statValueTotal ? rollResult1.total === 20 ? false : true : false;
    templateContext.confirm = (rollResult1.total === 1 || rollResult1.total === 20);
    templateContext.critt = (rollResult1.total === 1 && rollResult2.total <= statValueTotal);
    templateContext.goof = (rollResult1.total === 20 && rollResult2.total > statValueTotal);
    templateContext.goofed = (isMeele) ? Util.getGoofyMelee(rollResult3.total) : Util.getGoofyFK(rollResult3.total);

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let goofDices = [];
    let dices = [rollResult1.dice[0].values[0]];
    let chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));

    if(rollResult1.total === 1 || rollResult1.total === 20) dices.push(rollResult2.dice[0].values[0]);
    if(rollResult1.total === 20 && rollResult2.total > statValueTotal) goofDices.push(rollResult3.dice[0].values);
    
    let message = await doXD20XD6Roll(chatModel, dices, goofDices);

    // If it was a Goof and combat is running, reduce the Ini accordingly of the actor

    if (game.combat && templateContext.goof && context.combatant)
        game.combat.setInitiative(context.combatant.id, context.combatant.initiative + (isMeele ? Util.getGoofyMeleeIniMod(rollResult3.total) : Util.getGoofyFKIniMod(rollResult3.total)))

    return {
        result: templateContext.result,
        critt: templateContext.critt,
        die1: rollResult1.total,
        message: message
    };
}

export async function PACheck(parry, modi, actor, context = {}) {

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

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/parry-Roll.hbs";

    // Roll 2 Dices

    let rollResult1 = await new Roll("1d20", {}).roll({ async: true});
    let rollResult2 = await new Roll("1d20", {}).roll({ async: true});
    let rollResult3 = await new Roll("2d6", {}).roll({ async: true});

    // Set up the Total Value of the Attribut Value +/- the Modifier
    
    let statValueTotal = parseInt(parry) + parseInt(modi);

    // Fill the Context for the Chat HTML to fill  

    let templateContext = {
        actor: actor._id,
        roll: rollResult1,
        roll2: rollResult2,
        PAValue: parry,
        adv: modi,
        additional: context
    };
    
    // Checks the Result of the Roll, if it needs to be confirmed and there if its a Critt or a Goof
    // and add its then to the Context for the Chat
    
    templateContext.result = (rollResult1.total <= statValueTotal);
    templateContext.confirm = (rollResult1.total == 1 || rollResult1.total == 20);
    templateContext.critt = (rollResult1.total == 1 && rollResult2.total <= statValueTotal);
    templateContext.goof = (rollResult1.total == 20 && rollResult2.total > statValueTotal);
    templateContext.goofed = Util.getGoofyMelee(rollResult3.total);
    
    // Sets the Booleans and Values for the Modifikation Indikator in the Chat
    
    templateContext.modPresent = (modi != 0);
    templateContext.isAdv = (modi > 0);
    templateContext.isDis = (modi < 0);
    templateContext.dis = parseInt(modi) * (-1);

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let goofDices = [];
    let dices = [rollResult1.dice[0].values[0]];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    if(rollResult1.total == 1 || rollResult1.total == 20) dices.push(rollResult2.dice[0].values[0]);
    if(rollResult1.total == 20 && rollResult2.total > statValueTotal) goofDices.push(rollResult3.dice[0].values[0]);
    if(rollResult1.total == 20 && rollResult2.total > statValueTotal) goofDices.push(rollResult3.dice[0].values[1]);

    let message = await doXD20XD6Roll(chatModel, dices, goofDices);

    
    // If it was a Goof and combat is running, reduce the Ini accordingly of the actor

    if (game.combat && templateContext.goof && context.combatant)
        game.combat.setInitiative(context.combatant.id, context.combatant.initiative + Util.getGoofyMeleeIniMod(rollResult3.total) );

    return {
        result: templateContext.result,
        critt: templateContext.critt,
        die1: rollResult1.total,
        message: message
    };
}

export async function DMGRoll(formula, actor, multi, chatId = "") {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll a Damage Roll                                                                       ##
    // ##                                                                                             ##
    // ##    @formula       String with the Roll Formular e.g. "1d6 + 5 + 6"                          ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##    @multi         Integer that is Multipling the DMG Result                                 ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Return if the Formular has a Value of 0, meaning its not rollable

    if(formula == 0 || formula == null) return;

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/damage-Roll.hbs";

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
    let message = await doXD20XD6Roll(chatModel, d20, d6);

    return {
        result: total,
        message: message
    };
}

export async function CrittMisMeele(actor) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll and Show the Critt Miss Disadvantage                                                ##
    // ##                                                                                             ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/critMiss-Meele.hbs";

    // Roll 2 Dices

    let rollResult = await new Roll("2d6", {}).roll({ async: true});

    // Fill the Context for the Chat HTML to fill  

    let templateContext = { actor: actor._id};
    
    // Get Disadvantage

    templateContext.goofed = Util.getGoofyMelee(rollResult.total);
    templateContext.roll1 = rollResult.dice[0].values[0];
    templateContext.roll2 = rollResult.dice[0].values[1];

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let goofDices = [];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    goofDices.push(rollResult.dice[0].values[0]);
    goofDices.push(rollResult.dice[0].values[1]);
    let status = await doXD20XD6Roll(chatModel, [], goofDices);

    return status;
}

export async function CrittMisRange(actor) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll and Show the Critt Miss Disadvantage                                                ##
    // ##                                                                                             ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/critMiss-Range.hbs";

    // Roll 2 Dices

    let rollResult = await new Roll("2d6", {}).roll({ async: true});

    // Fill the Context for the Chat HTML to fill  

    let templateContext = { actor: actor._id};
    
    // Get Disadvantage

    templateContext.goofed = Util.getGoofyFK(rollResult.total);
    templateContext.roll1 = rollResult.dice[0].values[0];
    templateContext.roll2 = rollResult.dice[0].values[1];

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let goofDices = [];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    goofDices.push(rollResult.dice[0].values[0]);
    goofDices.push(rollResult.dice[0].values[1]);
    let status = await doXD20XD6Roll(chatModel, [], goofDices);

    return status;
}

export async function HitZone(actor) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll and Show the Hit Zone                                                               ##
    // ##                                                                                             ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/chatTemplate/hitZone-Roll.hbs";

    // Roll 2 Dices

    let rollResult = await new Roll("1d20", {}).roll({ async: true});

    // Fill the Context for the Chat HTML to fill  

    let templateContext = { actor: actor._id};
    
    // Get Disadvantage

    templateContext.goofed = Util.getZone(rollResult.total);
    templateContext.roll1 = rollResult.dice[0].values[0];

    // Create the Chatmodel and sent the Roll to Chat and if Dice so Nice is active queue the Animation

    let goofDices = [];
    const chatModel = chatData(actor, await renderTemplate(templatePath, templateContext));
    goofDices.push(rollResult.dice[0].values[0]);
    let status = await doXD20XD6Roll(chatModel, [], goofDices);

    return status;
}

export async function DMGRollWitoutChat(formula, actor, multi, hasNoZone = false) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##    Roll a Damage Roll                                                                       ##
    // ##                                                                                             ##
    // ##    @formula       String with the Roll Formular e.g. "1d6 + 5 + 6"                          ##
    // ##    @actor         Actor Objekt of the Character rolling the Check                           ##
    // ##    @multi         Integer that is Multipling the DMG Result                                 ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Return if the Formular has a Value of 0, meaning its not rollable

    if(formula == 0 || formula == null) return;

    // Set up the Path of the Chat HTML

    const templatePath = "systems/GDSA/templates/chat/damage-Roll.hbs";

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
        hasNoZone: hasNoZone
    };

    // Fill the Results to the right Array for Display

    let d20 = [];
    let d6 = [];

    if(!hasNoZone) d20.push(zone.dice[0].values);
    if(rollResult.dice[0].faces == 6) d6.push(...rollResult.dice[0].values);
    if(rollResult.dice[0].faces == 20) d20.push(...rollResult.dice[0].values)

    return {
        total: total,
        templatePath: templatePath,
        templateContext: templateContext,
        d20: d20,
        d6: d6
    };
}

export async function doXD20XD6Roll(chatData, result1, result2) {

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
            let m = sendChatMessage(chatData);
            resolve(m)

        } else if (result1.length === 2 && result2.length <= 0) 
            game.dice3d.show({ throws:[{dice: [d20Model(result1[0])]}]}).then(displayed => 
                { game.dice3d.show({ throws:[{dice: [d20Model(result1[1])]}]}).then(displayed => 
                        {let m = sendChatMessage(chatData); resolve(m)});});
        else if (result1.length === 2 && result2.length === 2) 
            game.dice3d.show({ throws:[{dice: [d20Model(result1[0])]}]}).then(displayed => 
                { game.dice3d.show({ throws:[{dice: [d20Model(result1[1])]}]}).then(displayed => 
                    { game.dice3d.show({ throws:[{dice: [d6Model(result2[0]), d6Model(result2[1])]}]}).then( displayed =>
                        {let m = sendChatMessage(chatData); resolve(m)});});});
        else game.dice3d.show(data).then(displayed => {let m = sendChatMessage(chatData); resolve(m)});
    });
}

async function sendChatMessage(chatData) {

    if(!game.modules.get("dice-so-nice")?.active) {

        let r = new Roll("1d20", {});
        let m = await r.toMessage(chatData, {rollMode: chatData.rtype})
        // m.setFlag("core", "canPopout", true);
        return m;

    } else {

        let r = new Roll("1d20", {});
        r.evaluate()
        r.dice[0].results[0].hidden = true;
        let m = await r.toMessage(chatData, {rollMode: chatData.rtype})
        // m.setFlag("core", "canPopout", true);
        return m;
    }

}

export async function doXD20XD6RollWitoutChat(result1, result2) {

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
            resolve(true)

        } else if (result1.length == 2 && result2.length <= 0) 
            game.dice3d.show({ throws:[{dice: [d20Model(result1[0])]}]}).then(displayed => 
                { game.dice3d.show({ throws:[{dice: [d20Model(result1[1])]}]});});
        else if (result1.length == 2 && result2.length == 2) 
            game.dice3d.show({ throws:[{dice: [d20Model(result1[0])]}]}).then(displayed => 
                { game.dice3d.show({ throws:[{dice: [d20Model(result1[1])]}]}).then(displayed => 
                    { game.dice3d.show({ throws:[{dice: [d6Model(result2[0]), d6Model(result2[1])]}]});});});
        else game.dice3d.show(data);
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

export function chatData(actor, template) {


    // Create Chat Data Model

    let data = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({actor}),
        content: template
    };

    // Check Chat Settings

    switch (game.settings.get('core', 'rollMode')) {
        case "selfroll":
            data.whisper = [game.user];
            data.rtype = CONST.DICE_ROLL_MODES.SELF;
            break;
        case "blindroll":
            data.blind = true;
            data.rtype = CONST.DICE_ROLL_MODES.BLIND;
            break;
        case "gmroll":
            data.type = 1;
            break;
        case "publicroll":
        default:
            data.rtype = CONST.DICE_ROLL_MODES.PUBLIC;
            break;
    }

    return data;
}