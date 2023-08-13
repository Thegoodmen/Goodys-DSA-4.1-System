import Datastore from "nedb";
import fs from "fs";
import gulp from "gulp";
import logger from "fancy-log";
import mergeStream from "merge-stream";
import path from "path";
import through2 from "through2";

const PACK_DEST = "packs";
const PACK_SRC = "packs/src";
const DB_CACHE = {};

export const clean = cleanPacks;
export const compile = compilePacks;
export const extract = extractPacks;
 
function cleanPackEntry(data, { clearSourceId=true }={}) {

    // Clean out ownership, ids and flags

    if ( data.ownership ) data.ownership = { default: 0 };
    if ( clearSourceId ) delete data.flags?.core?.sourceId;
    delete data.flags?.importSource;
    delete data.flags?.exportSource;
 
    // Remove empty entries in flags

    if ( !data.flags ) data.flags = {};
    Object.entries(data.flags).forEach(([key, contents]) => {
        if ( Object.keys(contents).length === 0 ) delete data.flags[key];
    });

    // Remove mystery-man.svg from Actors

    if ( data.img === "icons/svg/mystery-man.svg" ) {
        data.img = "";
        data.prototypeToken.texture.src = "";
    }

    // Clean Packs and Lables
 
    if ( data.effects ) data.effects.forEach(i => cleanPackEntry(i, { clearSourceId: false }));
    if ( data.items ) data.items.forEach(i => cleanPackEntry(i, { clearSourceId: false }));
    if ( data.system?.description?.value ) data.system.description.value = cleanString(data.system.description.value);
    if ( data.label ) data.label = cleanString(data.label);
    if ( data.name ) data.name = cleanString(data.name);
}

function determineId(data, pack) {
   
    const db_path = path.join(PACK_DEST, `${pack}.db`);

    if ( !DB_CACHE[db_path] ) {
        DB_CACHE[db_path] = new Datastore({ filename: db_path, autoload: true });
        DB_CACHE[db_path].loadDatabase();
    }
   
    const db = DB_CACHE[db_path];
 
    return new Promise((resolve, reject) => {
        db.findOne({ name: data.name }, (err, entry) => {
            if ( entry ) {
                resolve(entry._id);
            } else {
                resolve(db.createNewId());
            }
        });
    });
}

function cleanString(str) {

    return str.replace(/\u2060/gu, "").replace(/[‘’]/gu, "'").replace(/[“”]/gu, '"');
}
 
function cleanPacks() {
   
    const packName = parsedArgs.pack;
    const entryName = parsedArgs.name?.toLowerCase();
    const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true }).filter(file =>
        file.isDirectory() && ( !packName || (packName === file.name) )
    );
 
    const packs = folders.map(folder => {
        logger.info(`Cleaning pack ${folder.name}`);
        return gulp.src(path.join(PACK_SRC, folder.name, "/**/*.json"))
        .pipe(through2.obj(async (file, enc, callback) => {
            const json = JSON.parse(file.contents.toString());
            const name = json.name.toLowerCase();
            if ( entryName && (entryName !== name) ) return callback(null, file);
            cleanPackEntry(json);
            if ( !json._id ) json._id = await determineId(json, folder.name);
            fs.rmSync(file.path, { force: true });
            fs.writeFileSync(file.path, `${JSON.stringify(json, null, 2)}\n`, { mode: 0o664 });
            callback(null, file);
        }));
    });
 
    return mergeStream(packs);
}

function compilePacks() {

    const packName = parsedArgs.pack;

    // Determine which source folders to process
    const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true }).filter(file =>
        file.isDirectory() && ( !packName || (packName === file.name) )
    );
 
    const packs = folders.map(folder => {

        const filePath = path.join(PACK_DEST, `${folder.name}.db`);
        fs.rmSync(filePath, { force: true });
        const db = fs.createWriteStream(filePath, { flags: "a", mode: 0o664 });
        const data = [];

        logger.info(`Compiling pack ${folder.name}`);

        return gulp.src(path.join(PACK_SRC, folder.name, "/**/*.json"))
            .pipe(through2.obj((file, enc, callback) => {
                const json = JSON.parse(file.contents.toString());
                cleanPackEntry(json);
                data.push(json);
                callback(null, file);
            }, callback => {
                data.sort((lhs, rhs) => lhs._id > rhs._id ? 1 : -1);
                data.forEach(entry => db.write(`${JSON.stringify(entry)}\n`));
                callback();
            }));
    });
    
    return mergeStream(packs);
}

function extractPacks() {
   
    const packName = parsedArgs.pack ?? "*";
    const entryName = parsedArgs.name?.toLowerCase();
    const packs = gulp.src(`${PACK_DEST}/**/${packName}.db`)
        .pipe(through2.obj((file, enc, callback) => {
            
            const filename = path.parse(file.path).name;
            const folder = path.join(PACK_SRC, filename);
            if ( !fs.existsSync(folder) ) fs.mkdirSync(folder, { recursive: true, mode: 0o775 });
 
            const db = new Datastore({ filename: file.path, autoload: true });
            db.loadDatabase();
 
            db.find({}, (err, entries) => {
                entries.forEach(entry => {

                    const name = entry.name.toLowerCase();
                    if ( entryName && (entryName !== name) ) return;
                    cleanPackEntry(entry);
                    const output = `${JSON.stringify(entry, null, 2)}\n`;
                    const outputName = name.replace("'", "").replace(/[^a-z0-9]+/gi, " ").trim().replace(/\s+|-{2,}/g, "-");
                    const subfolder = folder;
                    if ( !fs.existsSync(subfolder) ) fs.mkdirSync(subfolder, { recursive: true, mode: 0o775 });
                    fs.writeFileSync(path.join(subfolder, `${outputName}.json`), output, { mode: 0o664 });
                });
            });
 
            logger.info(`Extracting pack ${filename}`);
            callback(null, file);
        }));
 
    return mergeStream(packs);
}