import * as Template from "./module/apps/templates.js";

export function getItems(data, type, worn) {

    // #################################################################################################
    // #################################################################################################
    // ##                                                                                             ##
    // ##      Helper-Function for filling up the Arrays with specific Types and also Worn Status     ##
    // ##                                                                                             ##
    // #################################################################################################
    // #################################################################################################

    // Filter items of a Type

    let itemArray = data.items.filter(function(item) {return item.type == type})

    if (!worn) return itemArray;

    // If Indicated by worn, filter again for item Status worn

    return itemArray.filter(function(item) {return item.system.worn == true});
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

    let tempArray = data.items.filter(function(item) {return item.type == "Template"});
    let itemArray = tempArray.filter(function(item) {return item.system.type == type});

    return itemArray;
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
            return "Fehlschuß";
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

export function getSkillATKValue(actor, skillname) {

    let data = actor.system;

    switch(skillname){

        case "bastardsword":
            return data.skill.andr.atk;
        
        case "dagger":
            return data.skill.dolc.atk;

        case "rapier":
            return data.skill.fech.atk;
            
        case "club":
            return data.skill.hieb.atk;
           
        case "halberd":
            return data.skill.infa.atk;
            
        case "chainstaff":
            return data.skill.kets.atk;
           
        case "chainweapon":
            return data.skill.ketw.atk;
            
        case "lance":
            return data.skill.lanz.atk;
            
        case "whip":
            return data.skill.peit.atk;
            
        case "brawl":
            return data.skill.rauf.atk;
            
        case "wrestle":
            return data.skill.ring.atk;

        case "saber":
            return data.skill.saeb.atk;
        
        case "sword":
            return data.skill.swer.atk;
        
        case "spear":
            return data.skill.sper.atk;
        
        case "staff":
            return data.skill.stab.atk;
        
        case "twohandflail":
            return data.skill.zfle.atk;
        
        case "twohandclub":
            return data.skill.zhie.atk;
        
        case "twohandsword":
            return data.skill.zswe.atk;
        
        case "crossbow":
            return data.skill.armb.atk;
        
        case "siegeweapon":
            return data.skill.bela.atk;
        
        case "blowgun":
            return data.skill.blas.atk;
        
        case "bow":
            return data.skill.bogn.atk;
        
        case "disk":
            return data.skill.disk.atk;
        
        case "slingshot":
            return data.skill.sleu.atk;
        
        case "throwingaxe":
            return data.skill.wbei.atk;
        
        case "throwingknife":
            return data.skill.wmes.atk;
        
        case "throwingspear":
            return data.skill.wspe.atk;
    }
}

export function getSkillPAValue(actor, skillname) {

    let data = actor?.system;

    switch(skillname){

        case "bastardsword":
            return data.skill.andr.def;
        
        case "dagger":
            return data.skill.dolc.def;

        case "rapier":
            return data.skill.fech.def;
            
        case "club":
            return data.skill.hieb.def;
           
        case "halberd":
            return data.skill.infa.def;
            
        case "chainstaff":
            return data.skill.kets.def;
           
        case "chainweapon":
            return data.skill.ketw.def;
            
        case "lance":
            return data.skill.lanz.def;
            
        case "whip":
            return data.skill.peit.def;
            
        case "brawl":
            return data.skill.rauf.def;
            
        case "wrestle":
            return data.skill.ring.def;

        case "saber":
            return data.skill.saeb.def;
        
        case "sword":
            return data.skill.swer.def;
        
        case "spear":
            return data.skill.sper.def;
        
        case "staff":
            return data.skill.stab.def;
        
        case "twohandflail":
            return data.skill.zfle.def;
        
        case "twohandclub":
            return data.skill.zhie.def;
        
        case "twohandsword":
            return data.skill.zswe.def;
        
        case "crossbow":
            return data.skill.armb.def;
        
        case "siegeweapon":
            return data.skill.bela.def;
        
        case "blowgun":
            return data.skill.blas.def;
        
        case "bow":
            return data.skill.bogn.def;
        
        case "disk":
            return data.skill.disk.def;
        
        case "slingshot":
            return data.skill.sleu.def;
        
        case "throwingaxe":
            return data.skill.wbei.def;
        
        case "throwingknife":
            return data.skill.wmes.def;
        
        case "throwingspear":
            return data.skill.wspe.def;
        
        default:
            return 0;
    }
}

export function getSkillShort(fullName) {

    switch(fullName){

        case game.i18n.localize("GDSA.charactersheet.akroSkill"):
            return "akro";

        case game.i18n.localize("GDSA.charactersheet.athSkill"):
            return "ath";

        case game.i18n.localize("GDSA.charactersheet.flySkill"):
            return "fly";

        case game.i18n.localize("GDSA.charactersheet.gaukSkill"):
            return "gauk";

        case game.i18n.localize("GDSA.charactersheet.kletSkill"):
            return "klet";

        case game.i18n.localize("GDSA.charactersheet.koerSkill"):
            return "koer";

        case game.i18n.localize("GDSA.charactersheet.reitSkill"):
            return "reit";

        case game.i18n.localize("GDSA.charactersheet.schlSkill"):
            return "schl";

        case game.i18n.localize("GDSA.charactersheet.swimSkill"):
            return "swim";

        case game.i18n.localize("GDSA.charactersheet.selbSkill"):
            return "selb";

        case game.i18n.localize("GDSA.charactersheet.sichSkill"):
            return "sich";

        case game.i18n.localize("GDSA.charactersheet.singSkill"):
            return "sing";

        case game.i18n.localize("GDSA.charactersheet.sinnSkill"):
            return "sinn";

        case game.i18n.localize("GDSA.charactersheet.skiSkill"):
            return "ski";

        case game.i18n.localize("GDSA.charactersheet.stimSkill"):
            return "stim";

        case game.i18n.localize("GDSA.charactersheet.dancSkill"):
            return "danc";

        case game.i18n.localize("GDSA.charactersheet.tascSkill"):
            return "tasc";

        case game.i18n.localize("GDSA.charactersheet.zechSkill"):
            return "zech";

        case game.i18n.localize("GDSA.charactersheet.betoSkill"):
            return "beto";

        case game.i18n.localize("GDSA.charactersheet.etikSkill"):
            return "etik";

        case game.i18n.localize("GDSA.charactersheet.gassSkill"):
            return "gass";

        case game.i18n.localize("GDSA.charactersheet.lehrSkill"):
            return "lehr";

        case game.i18n.localize("GDSA.charactersheet.mensSkill"):
            return "mens";

        case game.i18n.localize("GDSA.charactersheet.actiSkill"):
            return "acti";

        case game.i18n.localize("GDSA.charactersheet.writSkill"):
            return "writ";

        case game.i18n.localize("GDSA.charactersheet.clotSkill"):
            return "clot";

        case game.i18n.localize("GDSA.charactersheet.uberSkill"):
            return "uber";

        case game.i18n.localize("GDSA.charactersheet.zeugSkill"):
            return "zeug";

        case game.i18n.localize("GDSA.charactersheet.faerSkill"):
            return "faer";

        case game.i18n.localize("GDSA.charactersheet.fallSkill"):
            return "fall";

        case game.i18n.localize("GDSA.charactersheet.fessSkill"):
            return "fess";

        case game.i18n.localize("GDSA.charactersheet.fiscSkill"):
            return "fisc";

        case game.i18n.localize("GDSA.charactersheet.orieSkill"):
            return "orie";

        case game.i18n.localize("GDSA.charactersheet.wettSkill"):
            return "wett";

        case game.i18n.localize("GDSA.charactersheet.wildSkill"):
            return "wild";

        case game.i18n.localize("GDSA.charactersheet.ansiSkill"):
            return "ansi";

        case game.i18n.localize("GDSA.charactersheet.pirsSkill"):
            return "pirs";

        case game.i18n.localize("GDSA.charactersheet.nahrSkill"):
            return "nahr";

        case game.i18n.localize("GDSA.charactersheet.krauSkill"):
            return "krau";

        case game.i18n.localize("GDSA.charactersheet.wachSkill"):
            return "wach";

        case game.i18n.localize("GDSA.charactersheet.anatSkill"):
            return "anat";

        case game.i18n.localize("GDSA.charactersheet.baukSkill"):
            return "bauk";

        case game.i18n.localize("GDSA.charactersheet.buksSkill"):
            return "buks";

        case game.i18n.localize("GDSA.charactersheet.geogSkill"):
            return "geog";

        case game.i18n.localize("GDSA.charactersheet.gescSkill"):
            return "gesc";

        case game.i18n.localize("GDSA.charactersheet.gestSkill"):
            return "gest";

        case game.i18n.localize("GDSA.charactersheet.goetSkill"):
            return "goet";

        case game.i18n.localize("GDSA.charactersheet.heraSkill"):
            return "hera";

        case game.i18n.localize("GDSA.charactersheet.huetSkill"):
            return "huet";

        case game.i18n.localize("GDSA.charactersheet.krieSkill"):
            return "krie";

        case game.i18n.localize("GDSA.charactersheet.krypSkill"):
            return "kryp";

        case game.i18n.localize("GDSA.charactersheet.magiSkill"):
            return "magi";

        case game.i18n.localize("GDSA.charactersheet.mechSkill"):
            return "mech";

        case game.i18n.localize("GDSA.charactersheet.pflaSkill"):
            return "pfla";

        case game.i18n.localize("GDSA.charactersheet.philSkill"):
            return "phil";

        case game.i18n.localize("GDSA.charactersheet.calcSkill"):
            return "calc";

        case game.i18n.localize("GDSA.charactersheet.rectSkill"):
            return "rect";

        case game.i18n.localize("GDSA.charactersheet.sageSkill"):
            return "sage";

        case game.i18n.localize("GDSA.charactersheet.shaeSkill"):
            return "shae";

        case game.i18n.localize("GDSA.charactersheet.spraSkill"):
            return "spra";

        case game.i18n.localize("GDSA.charactersheet.staaSkill"):
            return "staa";

        case game.i18n.localize("GDSA.charactersheet.sterSkill"):
            return "ster";

        case game.i18n.localize("GDSA.charactersheet.tierSkill"):
            return "tier";

        case game.i18n.localize("GDSA.charactersheet.abriSkill"):
            return "abri";

        case game.i18n.localize("GDSA.charactersheet.ackeSkill"):
            return "acke";

        case game.i18n.localize("GDSA.charactersheet.alchSkill"):
            return "alch";

        case game.i18n.localize("GDSA.charactersheet.bergSkill"):
            return "berg";

        case game.i18n.localize("GDSA.charactersheet.bogeSkill"):
            return "boge";

        case game.i18n.localize("GDSA.charactersheet.bootSkill"):
            return "boot";

        case game.i18n.localize("GDSA.charactersheet.brauSkill"):
            return "brau";

        case game.i18n.localize("GDSA.charactersheet.drucSkill"):
            return "druc";

        case game.i18n.localize("GDSA.charactersheet.fahrSkill"):
            return "fahr";

        case game.i18n.localize("GDSA.charactersheet.falsSkill"):
            return "fals";

        case game.i18n.localize("GDSA.charactersheet.feinSkill"):
            return "fein";

        case game.i18n.localize("GDSA.charactersheet.feueSkill"):
            return "feue";

        case game.i18n.localize("GDSA.charactersheet.fleiSkill"):
            return "flei";

        case game.i18n.localize("GDSA.charactersheet.gerbSkill"):
            return "gerb";

        case game.i18n.localize("GDSA.charactersheet.glasSkill"):
            return "glas";

        case game.i18n.localize("GDSA.charactersheet.grobSkill"):
            return "grob";

        case game.i18n.localize("GDSA.charactersheet.handSkill"):
            return "hand";

        case game.i18n.localize("GDSA.charactersheet.hausSkill"):
            return "haus";

        case game.i18n.localize("GDSA.charactersheet.hgifSkill"):
            return "hgif";

        case game.i18n.localize("GDSA.charactersheet.hkraSkill"):
            return "hkra";

        case game.i18n.localize("GDSA.charactersheet.hseeSkill"):
            return "hsee";

        case game.i18n.localize("GDSA.charactersheet.hwunSkill"):
            return "hwun";

        case game.i18n.localize("GDSA.charactersheet.holzSkill"):
            return "holz";

        case game.i18n.localize("GDSA.charactersheet.instSkill"):
            return "inst";

        case game.i18n.localize("GDSA.charactersheet.kartSkill"):
            return "kart";

        case game.i18n.localize("GDSA.charactersheet.kochSkill"):
            return "koch";

        case game.i18n.localize("GDSA.charactersheet.krisSkill"):
            return "kris";

        case game.i18n.localize("GDSA.charactersheet.ledeSkill"):
            return "lede";

        case game.i18n.localize("GDSA.charactersheet.maleSkill"):
            return "male";

        case game.i18n.localize("GDSA.charactersheet.maurSkill"):
            return "maur";

        case game.i18n.localize("GDSA.charactersheet.metaSkill"):
            return "meta";

        case game.i18n.localize("GDSA.charactersheet.musiSkill"):
            return "musi";

        case game.i18n.localize("GDSA.charactersheet.shloSkill"):
            return "shlo";

        case game.i18n.localize("GDSA.charactersheet.shnaSkill"):
            return "shna";

        case game.i18n.localize("GDSA.charactersheet.shneSkill"):
            return "shne";

        case game.i18n.localize("GDSA.charactersheet.seefSkill"):
            return "seef";

        case game.i18n.localize("GDSA.charactersheet.seilSkill"):
            return "seil";

        case game.i18n.localize("GDSA.charactersheet.stmeSkill"):
            return "stme";

        case game.i18n.localize("GDSA.charactersheet.stshSkill"):
            return "stsh";

        case game.i18n.localize("GDSA.charactersheet.stelSkill"):
            return "stel";

        case game.i18n.localize("GDSA.charactersheet.stofSkill"):
            return "stof";

        case game.i18n.localize("GDSA.charactersheet.taetSkill"):
            return "taet";

        case game.i18n.localize("GDSA.charactersheet.toepSkill"):
            return "toep";

        case game.i18n.localize("GDSA.charactersheet.viehSkill"):
            return "vieh";

        case game.i18n.localize("GDSA.charactersheet.webkSkill"):
            return "webk";

        case game.i18n.localize("GDSA.charactersheet.winzSkill"):
            return "winz";

        case game.i18n.localize("GDSA.charactersheet.zimmSkill"):
            return "zimm";

        case game.i18n.localize("GDSA.charactersheet.empaSkill"):
            return "empa";

        case game.i18n.localize("GDSA.charactersheet.gefaSkill"):
            return "gefa";

        case game.i18n.localize("GDSA.charactersheet.geraSkill"):
            return "gera";

        case game.i18n.localize("GDSA.charactersheet.kraeSkill"):
            return "krae";

        case game.i18n.localize("GDSA.charactersheet.maggSkill"):
            return "magg";

        case game.i18n.localize("GDSA.charactersheet.propSkill"):
            return "prop";

        case game.i18n.localize("GDSA.charactersheet.taleSkill"):
            return "tale";

        case game.i18n.localize("GDSA.charactersheet.tiemSkill"):
            return "tiem";

        case game.i18n.localize("GDSA.charactersheet.zwerSkill"):
            return "zwer";

        default:
            return "unknown"
    }
}

export async function getSkillName(name) {

    let talents = (await Template.templateData()).talents;
    let allTalents = talents.all;

    let de = allTalents.filter(function(item) {return item.system.tale.DE.toLowerCase() == name.toLowerCase()});
    let en = allTalents.filter(function(item) {return item.system.tale.EN.toLowerCase() == name.toLowerCase()});

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