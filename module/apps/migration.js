import GDSAItem from "../objects/GDSAItem.js";

export async function migrationV1() {

    console.log("Start Migration Skript V1")
    
    SceneNavigation.displayProgressBar({label: "Migration Progress", pct: 0});

    for (let [i, actor] of game.actors.contents.entries()) {

        SceneNavigation.displayProgressBar({label: actor.name, pct: ((i / actors.length) * 100).toFixed(0)});
        
        const updateData = await actorMigrationV1(actor);
        
        if (!foundry.utils.isEmpty(updateData)) {
          
            console.log("Migrating Actor Entity " + actor.name + ".");
            await actor.update(updateData);
        }
    }

    for (let [i, id] of game.items.invalidDocumentIds.entries()) {

        SceneNavigation.displayProgressBar({label: "Invalid IDs", pct: ((i / actors.length) * 100).toFixed(0)});

        let item = game.items.getInvalid(id);

        console.log("Migrating Item Entity " + item.name + ".");
        
        const updateData = await itemMigrationV1(item);

        await GDSAItem.create(updateData);
        
    }
    
    for (let pack of game.packs) {

        const packType = pack.metadata.entity;
        
        if (pack.metadata.package != "world") continue;
        if (!["Actor", "Scene"].includes(packType)) continue;
    
        const wasLocked = pack.locked;
        await pack.configure({ locked: false });
    
        await pack.migrate();
        const documents = await pack.getDocuments();
    
        for (let document of documents) {
          
            let updateData = {};
          
            switch (packType) {
                
                case "Actor":
                    updateData = await actorMigrationV1(document.system);
                    break;
                case "Scene":
                    updateData = await sceneMigrationV1(document.system);
                    break;
            }

            if (foundry.utils.isEmpty(updateData)) continue;
            await document.update(updateData);

            console.log("Migrated " + packType + " entity " + document.name + " in Compendium " + pack.collection);
        }
    
        await pack.configure({ locked: wasLocked });
    }

    SceneNavigation.displayProgressBar({label: "Migration Progress", pct: 100});
    console.log("Finished running World-Migration!")

    game.settings.set('gdsa', 'systemMigrationVersion', game.system.version);
}

async function actorMigrationV1(actor) {

    let updateData = {};
    let actorData = actor.system;

    if (actor.type === "PlayerCharakter") {

        for (let h = 0; h < cmbtSkills.length; h++) {
            if (actorData.skill[cmbtSkills[h]] === null) {
                
                let s1 = "system.skill." + cmbtSkills[h];
                updateData[s1] = cmbtTemplate;
            }
        }

        for (let i = 0; i < skillTranslation.length; i++) {
            if ((actorData.skill[skillTranslation[i][1]] === null || actorData.skill[skillTranslation[i][1]] === "" || actorData.skill[skillTranslation[i][1]] === undefined) && actorData.skill[skillTranslation[i][0]] != null) {

                let s1 = "system.skill." + skillTranslation[i][1];
                let s2 = "system.skill." + skillTranslation[i][0];
                updateData[s1] = actorData.skill[skillTranslation[i][0]];
                updateData[s2] = null;
            }       
        }
    }

    const actorItems = actor.items._source;

    for (let j = 0; j < actorItems.length; j++) {

        SceneNavigation.displayProgressBar({label: actor.name + " Items", pct: ((j / actorItems.length) * 100).toFixed(0)});

        let item = actorItems[j];

        if (item.type === "advantage") {

            console.log("Migrate Advantages from old to new Format for " + actor.name + "!");

            let advaValue = item.system.value;

            if (parseInt(advaValue) === 0) advaValue = "";

            await actor.createEmbeddedDocuments("Item", [{ "name": item.name, "type": "Template", "system": { "type": "adva", "trait": { "value": advaValue, "canRoll": false}}}]);
            await actor.deleteEmbeddedDocuments("Item", [item._id]);
        
        } else if (item.type === "flaw") {

            console.log("Migrate Flaw from old to new Format for " + actor.name + "!");

            let flawValue = item.system.value;

            if (parseInt(flawValue) === 0) flawValue = "";

            await actor.createEmbeddedDocuments("Item", [{ "name": item.name, "type": "Template", "system": { "type": "flaw", "trait": { "value": flawValue, "canRoll": true}}}]);
            await actor.deleteEmbeddedDocuments("Item", [item._id]);
        
        } else if (item.type === "giftflaw") {

            console.log("Migrate Gift/Flaw from old to new Format for " + actor.name + "!");

            let flawValue = item.system.value;

            if (parseInt(flawValue) === 0) flawValue = "";

            await actor.createEmbeddedDocuments("Item", [{ "name": item.name, "type": "Template", "system": { "type": "adva", "trait": { "value": flawValue, "canRoll": true}}}]);
            await actor.deleteEmbeddedDocuments("Item", [item._id]);
        
        } else if (item.type === "generals") {

            console.log("Migrate General Item from old to new Format for " + actor.name + "!");

            await actor.createEmbeddedDocuments("Item", [{ 
                
                "name": item.name,
                "img": item.img,
                "type": "Gegenstand",
                "system": { 
                    "type": "item", 
                    "quantity": item.system.quantity,
                    "weight": item.system.weight,
                    "value": item.system.value,
                    "itemType": (item.system.type === "Edelstein") ? "gem" : "item", 
                    "item": {
                        "storage": "bag",
                        "category": item.system.type
                    },
                    "gem": {
                        "trait": item.system.trait,
                        "cut": item.system.cut,
                        "size": item.system.size,
                        "pAsP": item.system.pAsP
                    },                    
                    "tale": {
                        "notes": item.system.description
                    }
                }

            }]);

            await actor.deleteEmbeddedDocuments("Item", [item._id]);
        
        } else if (item.type === "melee-weapons") {

            console.log("Migrate General Item from old to new Format for " + actor.name + "!");

            let skill = "";
            let skillName = "";
    
            for (let i = 0; i < cmbtTranslating.length; i++)
                if (cmbtTranslating[i][0] === item.system.skill) 
                    skillName = cmbtTranslating[i][1];

            if(skillName) skill = CONFIG.Templates.talents.all.filter(function(item) {return item.name === skillName})[0]._id;

            await actor.createEmbeddedDocuments("Item", [{ 
                
                "name": item.name,
                "img": item.img,
                "type": "Gegenstand",
                "system": { 
                    "type": "melee", 
                    "weight": item.system.weight,
                    "value": item.system.value,
                    "weapon": {
                        "length": item.system.length,
                        "type": item.system.type,
                        "skill": skill,
                        "BF-cur": item.system["BF-cur"],
                        "BF-min": item.system["BF-min"],
                        "DK": item.system.DK,
                        "INI": item.system.INI,
                        "WM-ATK": item.system["WM-ATK"],
                        "WM-DEF": item.system["WM-DEF"],
                        "TPKK": item.system.TPKK,
                        "damage": item.system.damage
                    },
                    "item": {
                        "storage": "bag"
                    },                    
                    "tale": {
                        "notes": item.system.description
                    }
                }

            }]);

            await actor.deleteEmbeddedDocuments("Item", [item._id]);
        
        } else if (item.type === "range-weapons") {

            console.log("Migrate General Item from old to new Format for " + actor.name + "!");

            let skill = "";
            let skillName = "";
    
            for (let i = 0; i < cmbtTranslating.length; i++)
                if (cmbtTranslating[i][0] === item.system.skill) 
                    skillName = cmbtTranslating[i][1];

            if(skillName) skill = CONFIG.Templates.talents.all.filter(function(item) {return item.name === skillName})[0]._id;

            await actor.createEmbeddedDocuments("Item", [{ 
            
                "name": item.name,
                "img": item.img,
                "type": "Gegenstand",
                "system": { 
                    "type": "range", 
                    "weight": item.system.weight,
                    "value": item.system.value,
                    "weapon": {
                        "type": item.system.type,
                        "skill": skill,
                        "ammu": "none",
                        "loadActions": item.system.loadActions,
                        "kkpre": 0,
                        "range1": item.system.range.split("/")[0],
                        "range2": item.system.range.split("/")[1],
                        "range3": item.system.range.split("/")[2],
                        "range4": item.system.range.split("/")[3],
                        "range5": item.system.range.split("/")[4],
                        "tp1": item.system.tp.split("/")[0],
                        "tp2": item.system.tp.split("/")[1],
                        "tp3": item.system.tp.split("/")[2],
                        "tp4": item.system.tp.split("/")[3],
                        "tp5": item.system.tp.split("/")[4],
                        "damage": item.system.damage
                    },
                    "item": {
                        "storage": "bag"
                    },                    
                    "tale": {
                        "notes": item.system.description
                    }
                }
            }]);

            await actor.deleteEmbeddedDocuments("Item", [item._id]);
        
        } else if (item.type === "shields") {

            console.log("Migrate General Item from old to new Format for " + actor.name + "!");

            await actor.createEmbeddedDocuments("Item", [{ 
            
                "name": item.name,
                "img": item.img,
                "type": "Gegenstand",
                "system": { 
                    "type": "shild", 
                    "weight": item.system.weight,
                    "value": item.system.value,
                    "weapon": {
                        "type": item.system.type,
                        "parType": "null",
                        "size": "null",
                        "BF-cur": item.system["BF-cur"],
                        "BF-min": item.system["BF-min"],
                        "INI": item.system.INI,
                        "WM-ATK": item.system["WM-ATK"],
                        "WM-DEF": item.system["WM-DEF"],
                    },
                    "item": {
                        "storage": "bag"
                    },                    
                    "tale": {
                        "notes": item.system.description
                    }
                }
            }]);

            await actor.deleteEmbeddedDocuments("Item", [item._id]);
        
        } else if (item.type === "armour") {

            console.log("Migrate General Item from old to new Format for " + actor.name + "!");

            await actor.createEmbeddedDocuments("Item", [{ 
            
                "name": item.name,
                "img": item.img,
                "type": "Gegenstand",
                "system": { 
                    "type": "armour", 
                    "weight": item.system.weight,
                    "value": item.system.value,
                    "armour": {
                        "type": item.system.type,
                        "star": item.system.star,
                        "Z": item.system.Z,
                        "head": item.system.head,
                        "body": item.system.body,
                        "back": item.system.back,
                        "stomach": item.system.stomach,
                        "leftarm": item.system.leftarm,
                        "rightarm": item.system.rightarm,
                        "leftleg": item.system.leftleg,
                        "rightleg": item.system.rightleg,
                        "gRS": 0
                    },
                    "item": {
                        "storage": "bag"
                    },                    
                    "tale": {
                        "notes": item.system.description
                    }
                }
            }]);

            await actor.deleteEmbeddedDocuments("Item", [item._id]);
        
        } else if (item.type === "langu" || item.type === "signs" || item.type === "ritualSkill")
            await actor.deleteEmbeddedDocuments("Item", [item._id]);

        if (actor.type === "PlayerCharakter") {

            if (item.type === "generalTrait") {

                let templateArray = CONFIG.Templates.traits.general;
                let templateItem = templateArray.filter(function(array) {return ( array.name.includes(item.name) || array.system.tale.DE.includes(item.name) || array.system.tale.EN.includes(item.name) )});

                if (templateItem.length != 0) {

                    console.log("Migrate SF from old to new Format (" + item.name + ")");
                    await actor.createEmbeddedDocuments("Item", templateItem);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);

                } else {
                    
                    console.log("Create new SF in the new Format (" + item.name + ")");
                    let newItem = { "name": item.name, "type": "Template", "img": "icons/skills/trades/academics-investigation-puzzles.webp", "system": { "type": "trai", "sf": { "type": "general", "ver": 0 }, "tale": { "DE": item.name, "EN": item.name }}}
                    await actor.createEmbeddedDocuments("Item", [newItem]);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);                
                }

            } else if (item.type === "combatTrait") {

                let templateArray = CONFIG.Templates.traits.combat;
                let templateItem = templateArray.filter(function(array) {return ( array.name === item.name || array.system.tale.DE === item.name || array.system.tale.EN === item.name )});

                if (templateItem.length != 0) {

                    console.log("Migrate SF from old to new Format (" + item.name + ")");
                    await actor.createEmbeddedDocuments("Item", templateItem);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);

                } else {
                    
                    console.log("Create new SF in the new Format (" + item.name + ")");
                    let newItem = { "name": item.name, "type": "Template", "img": "icons/skills/melee/sword-winged-holy-orange.webp", "system": { "type": "trai", "sf": { "type": "combat", "ver": 0 }, "tale": { "DE": item.name, "EN": item.name }}}
                    await actor.createEmbeddedDocuments("Item", [newItem]);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);                
                }

            } else if (item.type === "magicTrait") {

                let templateArray = CONFIG.Templates.traits.magic;
                let templateItem = templateArray.filter(function(array) {return ( array.name === item.name || array.system.tale.DE === item.name || array.system.tale.EN === item.name )});

                if (templateItem.length != 0) {

                    console.log("Migrate SF from old to new Format (" + item.name + ")");
                    await actor.createEmbeddedDocuments("Item", templateItem);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);

                } else {
                    
                    console.log("Create new SF in the new Format (" + item.name + ")");
                    let newItem = { "name": item.name, "type": "Template", "img": "icons/magic/symbols/circled-gem-pink.webp", "system": { "type": "trai", "sf": { "type": "magic", "ver": 0 }, "tale": { "DE": item.name, "EN": item.name }}}
                    await actor.createEmbeddedDocuments("Item", [newItem]);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);                
                }

            } else if (item.type === "objectTrait") {

                let templateArray = CONFIG.Templates.traits.magic;
                let templateItem = templateArray.filter(function(array) {return ( array.name === item.name || array.system.tale.DE === item.name || array.system.tale.EN === item.name )});

                if (templateItem.length != 0) {

                    console.log("Migrate SF from old to new Format (" + item.name + ")");
                    await actor.createEmbeddedDocuments("Item", templateItem);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);

                } else {
                    
                    console.log("Create new SF in the new Format (" + item.name + ")");
                    let newItem = { "name": item.name, "type": "Template", "img": "icons/magic/symbols/circled-gem-pink.webp", "system": { "type": "trai", "sf": { "type": "magic", "ver": 0 }, "tale": { "DE": item.name, "EN": item.name }}}
                    await actor.createEmbeddedDocuments("Item", [newItem]);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);                
                }
            
            } else if (item.type === "holyTrait") {

                let templateArray = CONFIG.Templates.traits.holy;
                let templateItem = templateArray.filter(function(array) {return ( array.name === item.name || array.system.tale.DE === item.name || array.system.tale.EN === item.name )});

                if (templateItem.length != 0) {

                    console.log("Migrate SF from old to new Format (" + item.name + ")");
                    await actor.createEmbeddedDocuments("Item", templateItem);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);

                } else {
                    
                    console.log("Create new SF in the new Format (" + item.name + ")");
                    let newItem = { "name": item.name, "type": "Template", "img": "icons/magic/holy/angel-wings-gray.webp", "system": { "type": "trai", "sf": { "type": "holy", "ver": 0 }, "tale": { "DE": item.name, "EN": item.name }}}
                    await actor.createEmbeddedDocuments("Item", [newItem]);
                    await actor.deleteEmbeddedDocuments("Item", [item._id]);                
                }
            }
        }
    }
    
    return updateData;
}

async function itemMigrationV1(item) {

    let updateData = {};

    if (item.type === "advantage") {

        console.log("Migrate Item from old to new Format " + item.name + "!");

        let advaValue = item.system.value;

        if (parseInt(advaValue) === 0) advaValue = "";

        updateData = { "name": item.name, "type": "Template", "system": { "type": "adva", "trait": { "value": advaValue, "canRoll": false}}};

        await item.delete();
    
    } else if (item.type === "flaw") {

        console.log("Migrate Item from old to new Format " + item.name + "!");

        let flawValue = item.system.value;

        if (parseInt(flawValue) === 0) flawValue = "";

        updateData = { "name": item.name, "type": "Template", "system": { "type": "flaw", "trait": { "value": flawValue, "canRoll": true}}};

        await item.delete();
    
    } else if (item.type === "giftflaw") {

        console.log("Migrate Item from old to new Format " + item.name + "!");

        let flawValue = item.system.value;

        if (parseInt(flawValue) === 0) flawValue = "";

        updateData = { "name": item.name, "type": "Template", "system": { "type": "adva", "trait": { "value": flawValue, "canRoll": true}}};

        await item.delete();

    } else if (item.type === "generals") {

        console.log("Migrate General Item from old to new Format " + item.name + "!");

        updateData = { 
            
            "name": item.name,
            "img": item.img,
            "type": "Gegenstand",
            "system": { 
                "type": "item", 
                "quantity": item.system.quantity,
                "weight": item.system.weight,
                "value": item.system.value,
                "itemType": (item.system.type === "Edelstein") ? "gem" : "item", 
                "item": {
                    "storage": "bag",
                    "category": item.system.type
                },
                "gem": {
                    "trait": item.system.trait,
                    "cut": item.system.cut,
                    "size": item.system.size,
                    "pAsP": item.system.pAsP
                },                    
                "tale": {
                    "notes": item.system.description
                }
            }

        };

        await item.delete();
    
    } else if (item.type === "melee-weapons") {

        console.log("Migrate General Item from old to new Format " + item.name + "!");

        let skill = "";
        let skillName = "";

        for (let i = 0; i < cmbtTranslating.length; i++)
            if (cmbtTranslating[i][0] === item.system.skill) 
                skillName = cmbtTranslating[i][1];

        if(skillName) skill = CONFIG.Templates.talents.all.filter(function(item) {return item.name === skillName})[0]._id;

        updateData = { 
            
            "name": item.name,
            "img": item.img,
            "type": "Gegenstand",
            "system": { 
                "type": "melee", 
                "weight": item.system.weight,
                "value": item.system.value,
                "weapon": {
                    "length": item.system.length,
                    "type": item.system.type,
                    "skill": skill,
                    "BF-cur": item.system["BF-cur"],
                    "BF-min": item.system["BF-min"],
                    "DK": item.system.DK,
                    "INI": item.system.INI,
                    "WM-ATK": item.system["WM-ATK"],
                    "WM-DEF": item.system["WM-DEF"],
                    "TPKK": item.system.TPKK,
                    "damage": item.system.damage
                },
                "item": {
                    "storage": "bag"
                },                    
                "tale": {
                    "notes": item.system.description
                }
            }

        };

        await item.delete();
    
    } else if (item.type === "range-weapons") {

        console.log("Migrate General Item from old to new Format " + item.name + "!");

        let skill = "";
        let skillName = "";

        for (let i = 0; i < cmbtTranslating.length; i++)
            if (cmbtTranslating[i][0] === item.system.skill) 
                skillName = cmbtTranslating[i][1];

        if(skillName) skill = CONFIG.Templates.talents.all.filter(function(item) {return item.name === skillName})[0]._id;

        updateData = { 
            
            "name": item.name,
            "img": item.img,
            "type": "Gegenstand",
            "system": { 
                "type": "range", 
                "weight": item.system.weight,
                "value": item.system.value,
                "weapon": {
                    "type": item.system.type,
                    "skill": skill,
                    "ammu": "none",
                    "loadActions": item.system.loadActions,
                    "kkpre": 0,
                    "range1": item.system.range.split("/")[0],
                    "range2": item.system.range.split("/")[1],
                    "range3": item.system.range.split("/")[2],
                    "range4": item.system.range.split("/")[3],
                    "range5": item.system.range.split("/")[4],
                    "tp1": item.system.tp.split("/")[0],
                    "tp2": item.system.tp.split("/")[1],
                    "tp3": item.system.tp.split("/")[2],
                    "tp4": item.system.tp.split("/")[3],
                    "tp5": item.system.tp.split("/")[4],
                    "damage": item.system.damage
                },
                "item": {
                    "storage": "bag"
                },                    
                "tale": {
                    "notes": item.system.description
                }
            }

        };

        await item.delete();
    
    } else if (item.type === "shields") {

        console.log("Migrate General Item from old to new Format " + item.name + "!");

        updateData = { 
            
            "name": item.name,
            "img": item.img,
            "type": "Gegenstand",
            "system": { 
                "type": "shild", 
                "weight": item.system.weight,
                "value": item.system.value,
                "weapon": {
                    "type": item.system.type,
                    "parType": "null",
                    "size": "null",
                    "BF-cur": item.system["BF-cur"],
                    "BF-min": item.system["BF-min"],
                    "INI": item.system.INI,
                    "WM-ATK": item.system["WM-ATK"],
                    "WM-DEF": item.system["WM-DEF"],
                },
                "item": {
                    "storage": "bag"
                },                    
                "tale": {
                    "notes": item.system.description
                }
            }
        };

        await item.delete();
    
    } else if (item.type === "armour") {

        console.log("Migrate General Item from old to new Format " + item.name + "!");

        updateData = { 
            
            "name": item.name,
            "img": item.img,
            "type": "Gegenstand",
            "system": { 
                "type": "armour", 
                "weight": item.system.weight,
                "value": item.system.value,
                "armour": {
                    "type": item.system.type,
                    "star": item.system.star,
                    "Z": item.system.Z,
                    "head": item.system.head,
                    "body": item.system.body,
                    "back": item.system.back,
                    "stomach": item.system.stomach,
                    "leftarm": item.system.leftarm,
                    "rightarm": item.system.rightarm,
                    "leftleg": item.system.leftleg,
                    "rightleg": item.system.rightleg,
                    "gRS": 0
                },
                "item": {
                    "storage": "bag"
                },                    
                "tale": {
                    "notes": item.system.description
                }
            }
        };

        await item.delete();
    
    } else if (item.type === "langu" || item.type === "signs" || item.type === "ritualSkill")
        await game.items.delete(item._id);
    
    return updateData;
}

async function sceneMigrationV1(scene) {
    
    const tokens = scene.tokens.map(async token => {
      
        const t = token.toJSON();
  
        if (!t.actorLink) {
            const actor = duplicate(t.actorData);
            actor.type = t.actor?.type;
            const update = await actorMigrationV1(actor);
            mergeObject(t.actorData, update);
        }
      
        return t;
    });
  
    return { tokens };
}

const skillTranslation = [

    ["akro", "Akrobatik"],
    ["ath", "Athletik"],
    ["fly", "Fliegen"],
    ["gauk", "Gaukeleien"],
    ["klet", "Klettern"],
    ["koer", "Körperbeherrschung"],
    ["reit", "Reiten"],
    ["schl", "Schleichen"],
    ["swim", "Schwimmen"],
    ["selb", "Selbstbeherrschung"],
    ["sich", "Sich Verstecken"],
    ["sing", "Singen"],
    ["sinn", "Sinnenschärfe"],
    ["ski", "Skifahren"],
    ["stim", "Stimmen Imitieren"],
    ["danc", "Tanzen"],
    ["tasc", "Taschendiebstahl"],
    ["zech", "Zechen"],
    ["beto", "Betören"],
    ["etik", "Etikette"],
    ["gass", "Gassenwissen"],
    ["lehr", "Lehren"],
    ["mens", "Menschenkenntnis"],
    ["acti", "Schauspielerei"],
    ["writ", "Schriftlicher Ausdruck"],
    ["clot", "Sich Verkleiden"],
    ["uber", "Überreden"],
    ["zeug", "Überzeugen"],
    ["faer", "Fährtensuchen"],
    ["fall", "Fallenstellen"],
    ["fess", "Fesseln / Entfesseln"],
    ["fisc", "Fischen / Angeln"],
    ["orie", "Orientierung"],
    ["wett", "Wettervorhersage"],
    ["wild", "Wildnisleben"],
    ["anat", "Anatomie"],
    ["bauk", "Baukunst"],
    ["buks", "Brett- und Kartenspiel"],
    ["geog", "Geografie"],
    ["gesc", "Geschichtswissen"],
    ["gest", "Gesteinskunde"],
    ["goet", "Götter / Kulte"],
    ["hera", "Heraldik"],
    ["huet", "Hüttenkunde"],
    ["krie", "Kriegskunst"],
    ["kryp", "Kryptographie"],
    ["magi", "Magiekunde"],
    ["mech", "Mechanik"],
    ["pfla", "Pflanzenkunde"],
    ["phil", "Philosophie"],
    ["calc", "Rechnen"],
    ["rect", "Rechtskunde"],
    ["sage", "Sagen / Legenden"],
    ["shae", "Schätzen"],
    ["spra", "Sprachenkunde"],
    ["staa", "Staatskunst"],
    ["ster", "Sternkunde"],
    ["tier", "Tierkunde"],
    ["abri", "Abrichten"],
    ["acke", "Ackerbau"],
    ["alch", "Alchimie"],
    ["berg", "Bergbau"],
    ["boge", "Bogenbau"],
    ["boot", "Boote fahren"],
    ["brau", "Brauer"],
    ["druc", "Drucker"],
    ["fahr", "Fahrzeug lenken"],
    ["fals", "Falschspiel"],
    ["fein", "Feinmechanik"],
    ["feue", "Feuersteinbearbeitung"],
    ["flei", "Fleischer"],
    ["gerb", "Gerber / Kürschner"],
    ["glas", "Glaskunst"],
    ["grob", "Grobschmied"],
    ["hand", "Handel"],
    ["haus", "Hauswirtschaft"],
    ["hgif", "Heilkunde: Gift"],
    ["hkra", "Heilkunde: Krankheiten"],
    ["hsee", "Heilkunde: Seele"],
    ["hwun", "Heilkunde: Wunden"],
    ["holz", "Holzbearbeitung"],
    ["inst", "Instrumentenbauer"],
    ["kart", "Kartografie"],
    ["koch", "Kochen"],
    ["kris", "Kristallzucht"],
    ["lede", "Lederarbeiten"],
    ["male", "Malen / Zeichnen"],
    ["maur", "Maurer"],
    ["meta", "Metallguss"],
    ["musi", "Musizieren"],
    ["shlo", "Schlösser knacken"],
    ["shna", "Schnaps brennen"],
    ["shne", "Schneidern"],
    ["seef", "Seefahrt"],
    ["seil", "Seiler"],
    ["stme", "Steinmetz"],
    ["stsh", "Steinschneider / Juwelier"],
    ["stel", "Stellmacher"],
    ["stof", "Stoffe färben"],
    ["taet", "Tätowieren"],
    ["toep", "Töpfern"],
    ["vieh", "Viehzucht"],
    ["webk", "Webkunst"],
    ["winz", "Winzer"],
    ["zimm", "Zimmermann"],
    ["empa", "Empathie"],
    ["gefa", "Gefahreninstinkt"],
    ["gera", "Geräuschhexerei"],
    ["krae", "Kräfteschub"],
    ["magg", "Magiegespühr"],
    ["prop", "Prophezeien"],
    ["tale", "Talentschub"],
    ["tiem", "Tierempathie"],
    ["zwer", "Zwergennase"],
    ["andr", "Anderthalbhänder"],
    ["armb", "Armbrust"],
    ["bela", "Belagerungswaffen"],
    ["blas", "Blasrohr"],
    ["bogn", "Bogen"],
    ["disk", "Diskus"],
    ["dolc", "Dolche"],
    ["fech", "Fechtwaffen"],
    ["hieb", "Hiebwaffen"],
    ["infa", "Infanteriewaffen"],
    ["kets", "Kettenstäbe"],
    ["ketw", "Kettenwaffen"],
    ["lanz", "Lanzenreiten"],
    ["peit", "Peitsche"],
    ["rauf", "Raufen"],
    ["ring", "Ringen"],
    ["saeb", "Säbel"],
    ["sleu", "Schleuder"],
    ["swer", "Schwerter"],
    ["sper", "Speere"],
    ["stab", "Stäbe"],
    ["wbei", "Wurfbeile"],
    ["wmes", "Wurfmesser"],
    ["wspe", "Wurfspeere"],
    ["zfle", "Zweihandflegel"],
    ["zhie", "Zweihand-Hiebwaffen"],
    ["zswe", "Zweihandschwerter / -säbel"]
]

const cmbtSkills = [

    "Anderthalbhänder",
    "Armbrust",
    "Belagerungswaffen",
    "Blasrohr",
    "Bogen",
    "Diskus",
    "Dolche",
    "Fechtwaffen",
    "Hiebwaffen",
    "Infanteriewaffen",
    "Kettenstäbe",
    "Kettenwaffen",
    "Lanzenreiten",
    "Peitsche",
    "Raufen",
    "Ringen",
    "Säbel",
    "Schleuder",
    "Schwerter",
    "Speere",
    "Stäbe",
    "Wurfbeile",
    "Wurfmesser",
    "Wurfspeere",
    "Zweihandflegel",
    "Zweihand-Hiebwaffen",
    "Zweihandschwerter / -säbel"
]

const cmbtTemplate = {
    value: "",
    atk: "",
    def: ""
}

const cmbtTranslating = [
    ["bastardsword", "Anderthalbhänder"],
    ["dagger", "Dolche"],
    ["rapier", "Fechtwaffen"],
    ["club", "Hiebwaffen"],
    ["halberd", "Infanteriewaffen"],
    ["chainstaff", "Kettenstäbe"],
    ["chainweapon", "Kettenwaffen"],
    ["lance", "Lanzenreiten"],
    ["whip", "Peitsche"],
    ["brawl", "Raufen"],
    ["wrestle", "Ringen"],
    ["saber", "Säbel"],
    ["sword", "Schwerter"],
    ["spear", "Speere"],
    ["staff", "Stäbe"],
    ["twohandflail", "Zweihandflegel"],
    ["twohandclub", "Zweihand-Hiebwaffen"],
    ["twohandsword", "Zweihandschwerter / -säbel"],
    ["crossbow", "Armbrust"],
    ["siegeweapon", "Belagerungswaffen"],
    ["blowgun", "Blasrohr"],
    ["bow", "Bogen"],
    ["disk", "Diskus"],
    ["slingshot", "Schleuder"],
    ["throwingaxe", "Wurfbeile"],
    ["throwingknife", "Wurfmesser"],
    ["throwingspear", "Wurfspeere"]
]