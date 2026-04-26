import { config } from "../animationConfig.js";

/**
 * 
 * Original Bridge code by Geano from geanos-gdsa-autoanimation-bridge
 * Edited and Integrated in System by Goody
 * 
 */

/**
 * Main handler for GDSA chat messages.
 * Called on createChatMessage hook, only processes messages from the current user.
 */
export async function handleAnimationEvent(item, actorToken, targets) {

    // Check if AA is enabled
    if (game.settings.get("autoanimations", "killAllAnim") === "off") return;

    // Trigger the animation
    triggerAnimation(actorToken, item, targets);
}

/**
 * 
 * Triggers an Automated Animations animation via the public API.
 * 
 */
export async function triggerAnimation(tokenDoc, item, targets) {
    
    if (!window.AutomatedAnimations?.playAnimation)      
        console.log("GDSA | AutomatedAnimations.playAnimation not available - ensure Automated Animations module is installed and enabled");
    
    if (!tokenDoc || !item || !window.AutomatedAnimations?.playAnimation) return;

    if (targets[0] === null || targets[0] === undefined) targets = 0;
    
    if (game.settings.get("gdsa", "animationDebug"))
        console.log("GDSA | Triggering animation:", { token: tokenDoc.name, item: item.name,targets: targets.length });

    let options = {};
    if (targets.length > 0) options.targets = targets;

    try {
        
        AutomatedAnimations.playAnimation(tokenDoc, item, options); 
        
    } catch (err) {
        
        console.error("GDSA | Error triggering animation: ", err);
    }
}

export async function generateAutorecUpdate() {

    const autorecEntries = { aefx: [], aura: [], melee: [], ontoken: [], preset: [], range: [], templatefx: [] };
    const autorec = { aefx: [], aura: [], melee: [], ontoken: [], preset: [], range: [], templatefx: [] };
    
    // Overwrite the current Entries with an empty config to generate the Entries a new
    await AutomatedAnimations.AutorecManager.overwriteMenus( JSON.stringify(autorecEntries), { submitAll: true });
    
    for (let i = 1; i < (Object.keys(config.melee).length +1); i++)
        autorec.melee.push(getMeleeEntryObject(config.melee[i][0], config.melee[i][1], config.melee[i][2], config.melee[i][3], config.melee[i][4], config.melee[i][5], config.melee[i][6]));

    for (let i = 1; i < (Object.keys(config.range).length +1); i++)
        autorec.range.push(getRangeEntryObject(config.range[i][0], config.range[i][1], config.range[i][2], config.range[i][3], config.range[i][4], config.range[i][5], config.range[i][6]));

    for (let i = 1; i < (Object.keys(config.ontoken).length +1); i++)
        autorec.ontoken.push(getOnTokenEntryObject(config.ontoken[i][0], config.ontoken[i][1], config.ontoken[i][2], config.ontoken[i][3], config.ontoken[i][4], config.ontoken[i][5], config.ontoken[i][6], config.ontoken[i][7]));

    for (let i = 1; i < (Object.keys(config.aura).length +1); i++)
        autorec.aura.push(getAuraEntryObject(config.aura[i][0], config.aura[i][1], config.aura[i][2], config.aura[i][3], config.aura[i][4], config.aura[i][5], config.aura[i][6], config.aura[i][7]));

    for (let i = 1; i < (Object.keys(config.templatefx).length +1); i++)
        autorec.templatefx.push(getTemplateEntryObject(config.templatefx[i][0], config.templatefx[i][1], config.templatefx[i][2], config.templatefx[i][3], config.templatefx[i][4], config.templatefx[i][5], config.templatefx[i][6], config.templatefx[i][7]));

    for (const key of Object.keys(autorecEntries))
        autorec[key].map((x) => x.label).forEach(async (x) => { return autorecEntries[key].push(autorec[key].find((e) => e.label === x)); });

    // Adds the current Autorec version into the menu to ensure it will not get wiped
    autorecEntries.version = await game.settings.get("autoanimations", "aaAutorec").version;

    return autorecEntries;
}

function getMeleeEntryObject(id, label, menu, animation, variant, color, soundFile = "") {

    let menuType = "weapon";
    if (animation === "bite" || animation === "claw") menuType = "creature";

    return {
	
        "id": id,
        "label": label,
        "levels3d": {
            "type": "explosion",
            "data": {
                "color01": "#FFFFFF",
                "color02": "#FFFFFF",
                "spritePath": "modules/levels-3d-preview/assets/particles/dust.png",
                "autoSize": true
            },
            "sound": {
                "enable": false
            },
            "secondary": {
                "enable": false,
                "data": {
                    "color01": "#FFFFFF",
                    "color02": "#FFFFFF",
                    "spritePath": "modules/levels-3d-preview/assets/particles/dust.png",
                    "autoSize": true
                }
            },
            "tokens": {
                "enable": false,
                "source": false,
                "target": false,
                "sourceType": "twirl",
                "sourcePlay": "start",
                "targetType": "shake",
                "targetPlay": "end"
            }
        },
        "macro": {
            "enable": false,
            "playWhen": "0"
        },
        "meleeSwitch": {
            "video": {
                "dbSection": "range",
                "menuType": "weapon",
                "animation": "arrow",
                "variant": "regular",
                "color": "regular"
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "detect": "automatic",
                "range": 2,
                "returning": false,
                "switchType": "off"
            }
        },
        "menu": menu,
        "primary": {
            "video": {
                "dbSection": menu,
                "menuType": menuType,
                "animation": animation,
                "variant": variant,
                "color": color,
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": true,
                "delay": 0,
                "file": soundFile,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.25
            },
            "options": {
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "isWait": false,
                "opacity": 1,
                "playbackRate": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "secondary": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": true,
                "isWait": false,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1.5,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "soundOnly": {
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            }
        },
        "source": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "isWait": true,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "target": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "opacity": 1,
                "persistent": false,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "unbindAlpha": false,
                "unbindVisibility": false,
                "zIndex": 1
            }
        },
        "metaData": {
            "label": label,
            "menu": menu,
            "name": "GDSA Animations",
            "moduleVersion": "1.0.0"
        }
	};
}

function getRangeEntryObject(id, label, menu, animation, variant, color, soundFile = "") {

    let menuType = "spell";
    if (animation === "conduit" || animation === "energybeam" || animation === "energystrand" || animation === "energywall" || animation === "iceshard" || animation === "leaves") menuType = "generic";
    if (animation === "arrow" || animation === "bolt" || animation === "bomb" || animation === "bullet" || animation === "cannonball" || animation === "dagger" || animation === "flask" || animation === "laserblast" || animation === "lasersword" || animation === "missile" || animation === "snipe" || animation === "snowball") menuType = "weapon";
           
    return {
	
        "id": id,
        "label": label,
        "levels3d": {
            "type": "explosion",
            "data": {
                "color01": "#FFFFFF",
                "color02": "#FFFFFF",
                "spritePath": "modules/levels-3d-preview/assets/particles/dust.png",
                "autoSize": true
            },
            "sound": {
                "enable": false
            },
            "secondary": {
                "enable": false,
                "data": {
                    "color01": "#FFFFFF",
                    "color02": "#FFFFFF",
                    "spritePath": "modules/levels-3d-preview/assets/particles/dust.png",
                    "autoSize": true
                }
            },
            "tokens": {
                "enable": false,
                "source": false,
                "target": false,
                "sourceType": "twirl",
                "sourcePlay": "start",
                "targetType": "shake",
                "targetPlay": "end"
            }
        },
        "macro": {
            "enable": false,
            "playWhen": "0"
        },
        "menu": menu,
        "primary": {
            "video": {
                "dbSection": menu,
                "menuType": menuType,
                "animation": animation,
                "variant": variant,
                "color": color,
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": true,
                "delay": 0,
                "file": soundFile,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.25
            },
            "options": {
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "isReturning": false,
                "isWait": false,
                "opacity": 1,
                "playbackRate": 1,
                "onlyX": false,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "secondary": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": true,
                "isWait": false,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1.5,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "soundOnly": {
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            }
        },
        "source": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "isWait": true,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "target": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "opacity": 1,
                "persistent": false,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "unbindAlpha": false,
                "unbindVisibility": false,
                "zIndex": 1
            }
        },
        "metaData": {
            "label": label,
            "menu": menu,
            "name": "GDSA Animations",
            "moduleVersion": "1.0.0"
        }
	};
}

function getOnTokenEntryObject(id, label, menu, menuType, animation, variant, color, soundFile = "") {

    return {

        "id": id,
        "label": label,
        "levels3d": {
            "type": "explosion",
            "data": {
                "color01": "#FFFFFF",
                "color02": "#FFFFFF",
                "spritePath": "modules/levels-3d-preview/assets/particles/dust.png",
                "autoSize": true
            },
            "sound": {
                "enable": false
            },
            "secondary": {
                "enable": false,
                "data": {
                    "color01": "#FFFFFF",
                    "color02": "#FFFFFF",
                    "spritePath": "modules/levels-3d-preview/assets/particles/dust.png",
                    "autoSize": true
                }
            },
            "tokens": {
                "enable": false,
                "source": false,
                "target": false,
                "sourceType": "twirl",
                "sourcePlay": "start",
                "targetType": "shake",
                "targetPlay": "end"
            }
        },
        "macro": {
            "enable": false,
            "playWhen": "0"
        },
        "menu": menu,
        "primary": {
            "video": {
                "dbSection": "static",
                "menuType": menuType,
                "animation": animation,
                "variant": variant,
                "color": color,
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": true,
                "delay": 0,
                "file": soundFile,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.25
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "isWait": false,
                "opacity": 1,
                "persistent": false,
                "playbackRate": 1,
                "playOn": "target",
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "unbindAlpha": false,
                "unbindVisibility": false,
                "zIndex": 1
            }
        },
        "secondary": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": true,
                "isWait": false,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1.5,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "soundOnly": {
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            }
        },
        "source": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "sacredflame",
                "variant": "source",
                "color": "white",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "file": "psfx.class-features.divine-smite.v1.001.caster",
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "isWait": true,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "target": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "opacity": 1,
                "persistent": false,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "unbindAlpha": false,
                "unbindVisibility": false,
                "zIndex": 1
            }
        },
        "metaData": {
            "label": label,
            "menu": menu,
            "name": "GDSA Animations",
            "moduleVersion": "1.0.0"
        }
    };
}

function getAuraEntryObject(id, label, menu, menuType, animation, variant, color, soundFile = "") {

    return {
        "id": id,
        "label": label,
        "macro": {
            "enable": false,
            "playWhen": "0"
        },
        "menu": menu,
        "primary": {
            "video": {
                "dbSection": "static",
                "menuType": menuType,
                "animation": animation,
                "variant": variant,
                "color": color,
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": true,
                "delay": 0,
                "file": soundFile,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.25
            },
            "options": {
                "addTokenWidth": true,
                "alpha": false,
                "alphaMax": 0.5,
                "alphaMin": -0.5,
                "alphaDuration": 1000,
                "breath": false,
                "breathMax": 1.05,
                "breathMin": 0.95,
                "breathDuration": 1000,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isRadius": true,
                "isWait": false,
                "opacity": 1,
                "playbackRate": 1,
                "playOn": "source",
                "size": 3,
                "tint": false,
                "tintColor": "#FFFFFF",
                "tintSaturate": 0,
                "unbindAlpha": false,
                "unbindVisibility": false,
                "zIndex": 1
            }
        },
        "secondary": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": true,
                "isWait": false,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1.5,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "soundOnly": {
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            }
        },
        "source": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "isWait": true,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "target": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "opacity": 1,
                "persistent": false,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "unbindAlpha": false,
                "unbindVisibility": false,
                "zIndex": 1
            }
        },
        "metaData": {
            "label": label,
            "menu": menu,
            "name": "GDSA Animations",
            "moduleVersion": "1.0.0"
        }
    };
}

function getTemplateEntryObject(id, label, menu, menuType, animation, variant, color, soundFile = "") {

    return {
		"id": id,
		"label": label,
		"macro": {
			"enable": false,
			"playWhen": "0"
		},
		"menu": menu,
		"primary": {
			"video": {
				"dbSection": "templatefx",
				"menuType": menuType,
				"animation": animation,
				"variant": variant,
				"color": color,
				"enableCustom": false,
				"customPath": ""
			},
			"sound": {
				"enable": true,
				"delay": 0,
				"file": soundFile,
				"repeat": 1,
				"repeatDelay": 250,
				"startTime": 0,
				"volume": 0.25
			},
            "options": {
                "contrast": 0,
                "delay": 0,
                "elevation": 0,
                "isMasked": true,
                "isWait": false,
                "occlusionAlpha": 0.5,
                "occlusionMode": "3",
                "opacity": 0.5,
                "persistent": true,
                "persistType": "attachtemplate",
                "playbackRate": 1,
                "removeTemplate": false,
                "repeat": 1,
                "repeatDelay": 250,
                "rotate": 0,
                "saturate": 0,
                "scale": "1.5",
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "secondary": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": true,
                "isWait": false,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1.5,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "soundOnly": {
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75
            }
        },
        "source": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75,
                "file": ""
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "isWait": true,
                "opacity": 1,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "zIndex": 1
            }
        },
        "target": {
            "enable": false,
            "video": {
                "dbSection": "static",
                "menuType": "spell",
                "animation": "curewounds",
                "variant": "01",
                "color": "blue",
                "enableCustom": false,
                "customPath": ""
            },
            "sound": {
                "enable": false,
                "delay": 0,
                "repeat": 1,
                "repeatDelay": 250,
                "startTime": 0,
                "volume": 0.75,
                "file": ""
            },
            "options": {
                "addTokenWidth": false,
                "anchor": "0.5",
                "contrast": 0,
                "delay": 0,
                "elevation": 1000,
                "fadeIn": 250,
                "fadeOut": 500,
                "isMasked": false,
                "isRadius": false,
                "opacity": 1,
                "persistent": false,
                "repeat": 1,
                "repeatDelay": 250,
                "saturate": 0,
                "size": 1,
                "tint": false,
                "tintColor": "#FFFFFF",
                "unbindAlpha": false,
                "unbindVisibility": false,
                "zIndex": 1
            }
        },
		"metaData": {
            "label": label,
            "menu": menu,
            "name": "GDSA Animations",
            "moduleVersion": "1.0.0"
        }
	};
}