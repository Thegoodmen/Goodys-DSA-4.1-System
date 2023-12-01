async function getTalents() {

    let templatesSystem = await game.packs.get("world.templates").getDocuments();
    let templatesWorld = [];
    let templates = templatesWorld.concat(templatesSystem);

    templates = templates.filter(function(item) {return item.type == "Template"});

    let talentArray = templates.filter(function(item) {return item.system.type == "tale"});

    let talents = {

        combat: talentArray.filter(function(item) {return item.system.tale.type === "combat"}),
        meele: talentArray.filter(function(item) {return item.system.tale.cmbttype === "meele" || item.system.tale.cmbttype === "hand"}),
        range: talentArray.filter(function(item) {return item.system.tale.cmbttype === "range"}),
        body: talentArray.filter(function(item) {return item.system.tale.type === "body"}),
        social: talentArray.filter(function(item) {return item.system.tale.type === "social"}),
        nature: talentArray.filter(function(item) {return item.system.tale.type === "nature"}),
        knowledge: talentArray.filter(function(item) {return item.system.tale.type === "knowledge"}),
        lang: talentArray.filter(function(item) {return item.system.tale.type === "lang"}),
        sign: talentArray.filter(function(item) {return item.system.tale.type === "sign"}),
        craft: talentArray.filter(function(item) {return item.system.tale.type === "craft"}),
        gift: talentArray.filter(function(item) {return item.system.tale.type === "gift"}),
        meta: talentArray.filter(function(item) {return item.system.tale.type === "meta"}),
        all: talentArray
    };

    let langSelection = game.settings.get("core", "language").toUpperCase();

    talents.all.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.body.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.social.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.nature.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.lang.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.sign.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.knowledge.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.craft.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.gift.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.meele.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.range.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.combat.sort(function(a, b){
        let x = a.system.tale[langSelection].toLowerCase();
        let y = b.system.tale[langSelection].toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    talents.skillBoost = talents.combat.concat(talents.body, talents.social, talents.nature, talents.knowledge, talents.craft);

    return talents;
}

async function getLiturgies() {

    let templatesSystem = await game.packs.get("gdsa.liturgien").getDocuments();
    let templatesWorld = [];
    let talentArray = templatesWorld.concat(templatesSystem);

    let liturgy = {

        grad6: talentArray.filter(function(item) {return item.system.grad === "6"}),
        grad5: talentArray.filter(function(item) {return item.system.grad === "5"}),
        grad4: talentArray.filter(function(item) {return item.system.grad === "4"}),
        grad3: talentArray.filter(function(item) {return item.system.grad === "3"}),
        grad2: talentArray.filter(function(item) {return item.system.grad === "2"}),
        grad1: talentArray.filter(function(item) {return item.system.grad === "1"}),
        all: talentArray
    };

    liturgy.grad1.sort(function(a, b){
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    liturgy.all.sort(function(a, b){
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    return liturgy;
}

async function getCults() {

    let templatesSystem = await game.packs.get("world.templates").getDocuments();
    let templatesWorld = [];
    let templates = templatesWorld.concat(templatesSystem);

    templates = templates.filter(function(item) {return item.type == "Template"});

    let talentArray = templates.filter(function(item) {return item.system.type == "kult"});

    let cults = {
        all: talentArray
    };

    cults.all.sort(function(a, b){
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });

    return cults;
}

export async function templateData() {

    return {
        
        talents: await getTalents(),
        liturgy: await getLiturgies(),
        cults: await getCults()
    };
}

export async function getTalent(name) {

    let talents = await getTalents();
    let allTalents = talents.all;

    let answer = allTalents.filter(function(item) {return item.name.toLowerCase() == name.toLowerCase()})[0];

    return answer;
}