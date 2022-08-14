import * as Dice from "../dice.js";
import * as Dialog from "../dialog.js";
import * as Util from "../../Util.js";

export default class GDSANonPlayerSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/GDSA/templates/sheets/nonPlayer-sheet.hbs",
            width: 850,
            height: 525,
            resizable: false,
            classes: ["GDSA", "sheet", "nonPlayerSheet"]
        });
    }


}