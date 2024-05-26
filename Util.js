export function getItems(data, type, worn) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##      Helper-Function for filling up the Arrays with specific Types and also Worn Status     ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Filter items of a Type

    let itemArray = data.items.filter(function(item) {return item.type === type})

    if (!worn) return itemArray;

    // If Indicated by worn, filter again for item Status worn

    return itemArray.filter(function(item) {return item.system.worn === true});
}

export function getTemplateItems(data, type) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##      Helper-Function for filling up the Arrays with specific Types and also Worn Status     ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Filter items of a Type

    let tempArray = data.items.filter(function(item) {return item.type === "Template"});
    let itemArray = tempArray.filter(function(item) {return item.system.type === type});

    return itemArray;
}

export function getTemplateAffi(data, type) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##      Helper-Function for filling up the Arrays with specific Types and also Worn Status     ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Filter items of a Type

    let tempArray = data.items.filter(function(item) {return item.type === "Template"});
    let itemArray = tempArray.filter(function(item) {return item.system.type === "affi"});
    let affiArray = itemArray.filter(function(item) {return item.system.affi.type === type});

    return affiArray;
}

export function getTemplateSF(data, type) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##      Helper-Function for filling up the Arrays with specific Types and also Worn Status     ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Filter items of a Type

    let tempArray = data.items.filter(function(item) {return item.type === "Template"});
    let itemArray = tempArray.filter(function(item) {return item.system.type === "trai"});
    let sfArray = itemArray.filter(function(item) {return item.system.sf.type === type})

    return sfArray;
}

export function getItem(data, type, worn) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##      Helper-Function for filling up the Arrays with specific Types and also Worn Status     ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Filter items of a Type

    let tempArray = data.items.filter(function(item) {return item.type === "Gegenstand"});
    let itemArray = tempArray.filter(function(item) {return item.system.type === type});

    if (!worn) return itemArray;

    // If Indicated by worn, filter again for item Status worn

    return itemArray.filter(function(item) {return item.system.worn === true});

}

export function getGoofyMelee(value) {

    switch (value) {
        case 2:
            return "Waffe zerstört";
        case 3:
        case 4:
        case 5:
            return "Sturz";
        case 6:
        case 7:
        case 8:
            return "Stolpern";
        case 9:
        case 10:
            return "Waffe verloren";
        case 11:
            return "Eigentreffer";
        case 12:
            return "Schwerer Eigentreffer";
    }
}

export function getGoofyMeleeIniMod(value) {

    switch (value) {
        case 2:
        case 12:
            return -4;
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return -2;
        case 11:
            return -3;
    }
}

export function getGoofyFK(value) {

    switch (value) {
        case 2:
            return "Waffe zerstört";
        case 3:
            return "Waffe beschädigt";
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return "Fehlschuss";
        case 11:
        case 12:
            return "Kameraden getroffen";
    }
}

export function getGoofyFKIniMod(value) {

    switch (value) {
        case 2:
            return -4;
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return -2;
        case 3:
        case 11:
        case 12:
            return -3;
    }
}

export function getZoneArmour(data, zone) {

    switch (zone) {
        case "Linkes Bein":
            return data.sheet.getData().system.leftlegArmour;
        case "Rechtes Bein":
            return data.sheet.getData().system.rightlegArmour;
        case "Bauch":
            return data.sheet.getData().system.stomachArmour;
        case "Linker Arm":
            return data.sheet.getData().system.leftarmArmour;
        case "Rechter Arm":
            return data.sheet.getData().system.rightarmArmour;
        case "Brust / Rücken":
            return data.sheet.getData().system.bodyArmour;
        case "Kopf":
            return data.sheet.getData().system.headArmour;
        default:
            return data.sheet.getData().system.gRSArmour;
    }
}

export function getSkillName(name) {

    let talents = CONFIG.Templates.talents;
    let allTalents = talents.all;

    let de = allTalents.filter(function(item) {return item.system.tale.DE.toLowerCase() == name.toLowerCase()});
    let en = allTalents.filter(function(item) {return item.system.tale.EN.toLowerCase() == name.toLowerCase()});
    
    if (de.length === 0 && en.length === 0) return "";

    let answer = (de.concat(en))[0].name;

    return answer;
}

export function getZone(value) {

    switch(value){

        case 1:
        case 3:
        case 5:
            return game.i18n.localize("GDSA.zone.leftLeg");

        case 2:
        case 4:
        case 6:
            return game.i18n.localize("GDSA.zone.rightLeg");

        case 7:
        case 8:
            return game.i18n.localize("GDSA.zone.tammy");

        case 9:
        case 11:
        case 13:
            return game.i18n.localize("GDSA.zone.leftArm");

        case 10:
        case 12:
        case 14:
            return game.i18n.localize("GDSA.zone.rightArm");

        case 15:
        case 16:
        case 17:
        case 18:
            return game.i18n.localize("GDSA.zone.breast");

        case 19:
        case 20:
            return game.i18n.localize("GDSA.zone.Head");
    }
}

export function getRepFromHeldentool(value) {

    switch(value) {

        case "Magier":
            return "mag";
        
        case "Druide":
            return "dru";

        case "Elf":
            return "elf";

        case "Geode":
            return "geo";

        case "Achaz":
            return "ach";

        case "Schelm":
            return "sch";

        case "Hexe":
            return "hex";

        case "Borbaradianer":
            return "bor";
        
        case "Scharlatan":
            return "srl";

        default:
            return "none";
    }
}