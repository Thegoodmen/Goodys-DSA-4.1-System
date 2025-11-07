export const GDSA = {};

GDSA.attributes = {
    MU: "MU",
    KL: "KL",
    IN: "IN",
    CH: "CH",
    FF: "FF",
    GE: "GE",
    KO: "KO",
    KK: "KK"
}

GDSA.amourPlace = {
    head: "GDSA.armour.head",
    body: "GDSA.armour.body",
    back: "GDSA.armour.back",
    stomach: "GDSA.armour.stomach",
    rightarm: "GDSA.armour.rightarm",
    leftarm: "GDSA.armour.leftarm",
    rightleg: "GDSA.armour.rightleg",
    leftleg: "GDSA.armour.leftleg",
}

GDSA.ritualSkills = {
    gild: "GDSA.ritualSkills.gild",
    scha: "GDSA.ritualSkills.scha",
    alch: "GDSA.ritualSkills.alch",
    kris: "GDSA.ritualSkills.kris",
    hexe: "GDSA.ritualSkills.hexe",
    drui: "GDSA.ritualSkills.drui",
    geod: "GDSA.ritualSkills.geod",
    zibi: "GDSA.ritualSkills.zibi",
    durr: "GDSA.ritualSkills.durr",
    derw: "GDSA.ritualSkills.derw",
    tanz: "GDSA.ritualSkills.tanz",
    bard: "GDSA.ritualSkills.bard",
    gruf: "GDSA.ritualSkills.gruf",
    gban: "GDSA.ritualSkills.gban",
    gbin: "GDSA.ritualSkills.gbin",
    gauf: "GDSA.ritualSkills.gauf",
    petr: "GDSA.ritualSkills.petr"
}

GDSA.schamSkills = {
    gruf: "GDSA.ritualSkills.gruf",
    gban: "GDSA.ritualSkills.gban",
    gbin: "GDSA.ritualSkills.gbin",
    gauf: "GDSA.ritualSkills.gauf"
}

GDSA.schamRitDuration = [
    "Augenblicklich",
    "RkP* KR",
    "RkP* x 10 KR",
    "RkP* SR",
    "RkP* Stunden",
    "RkP* Tage",
    "RkP* Wochen",
    "RkP* Monate",
    "RkP* Jahre",
    "Permanent",
    "Speziell"
]

GDSA.schamTarget = [
    "S",
    "P",
    "P+P",
    "PP",
    "PPP",
    "PPPP",
    "PPPPP",
    "Z",
    "ZZ",
    "ZZZ",
    "ZZZZ",
    "ZZZZZ"
]

GDSA.schamCastDuration = {
    action: "GDSA.rit.action",
    rounds: "GDSA.rit.rounds",
    halfho: "GDSA.rit.halfho",
    hours: "GDSA.rit.hours",
    days: "GDSA.rit.days"
}

GDSA.magicTraits = {
    anti: "GDSA.magicTraits.anti",
    conju: "GDSA.magicTraits.conju",
    attri: "GDSA.magicTraits.attri",
    sugge: "GDSA.magicTraits.sugge",
    form: "GDSA.magicTraits.form",
    ghost: "GDSA.magicTraits.ghost",
    heal: "GDSA.magicTraits.heal",
    forse: "GDSA.magicTraits.forse",
    summ: "GDSA.magicTraits.summ",
    reign: "GDSA.magicTraits.reign",
    illu: "GDSA.magicTraits.illu",
    force: "GDSA.magicTraits.force",
    limbus: "GDSA.magicTraits.limbus",
    meta: "GDSA.magicTraits.meta",
    object: "GDSA.magicTraits.object",
    damage: "GDSA.magicTraits.damage",
    teleke: "GDSA.magicTraits.teleke",
    tempo: "GDSA.magicTraits.tempo",
    soround: "GDSA.magicTraits.soround",
    speak: "GDSA.magicTraits.speak",
    daemo: "GDSA.magicTraits.daemo",
    blak: "GDSA.magicTraits.blak",
    belh: "GDSA.magicTraits.belh",
    char: "GDSA.magicTraits.char",
    loig: "GDSA.magicTraits.lolg",
    thar: "GDSA.magicTraits.thar",
    amaz: "GDSA.magicTraits.amaz",
    bels: "GDSA.magicTraits.bels",
    asfa: "GDSA.magicTraits.asfa",
    tasf: "GDSA.magicTraits.tasf",
    belz: "GDSA.magicTraits.belz",
    agri: "GDSA.magicTraits.agri",
    belk: "GDSA.magicTraits.belk",
    elem: "GDSA.magicTraits.elem",
    feur: "GDSA.magicTraits.feur",
    wass: "GDSA.magicTraits.wass",
    eis: "GDSA.magicTraits.eis",
    humu: "GDSA.magicTraits.humu",
    luft: "GDSA.magicTraits.luft",
    erz: "GDSA.magicTraits.erz"
}

GDSA.schamLocation = {
    "-7": "GDSA.ritual.holyPlace",
    "-5": "GDSA.ritual.religPlace",
    "-3": "GDSA.ritual.ritPlace3",
    "-2": "GDSA.ritual.ritPlace2",
    "-1": "GDSA.ritual.ritPlace1",
    "+3": "GDSA.ritual.noPlace",
    "+7": "GDSA.ritual.otherDim"
}

GDSA.schamTime = {
    "-4": "GDSA.ritual.matchingTime",
    "-2": "GDSA.ritual.closeTime",
    "+0": "GDSA.ritual.naturlTime",
    "+2": "GDSA.ritual.missMatchTime",
    "+4": "GDSA.ritual.oppositTime"
}

GDSA.schamNatur = {
    "-2": "GDSA.ritual.matchingNatur",
    "-1": "GDSA.ritual.closeNatur",
    "+0": "GDSA.ritual.naturlNatur",
    "+1": "GDSA.ritual.missMatchNatur",
    "+2": "GDSA.ritual.oppositNatur"
}

GDSA.schamFetisch = {
    "-2": "GDSA.ritual.specialFet",
    "-1": "GDSA.ritual.goodFet",
    "+1": "GDSA.ritual.improveFet",
    "+2": "GDSA.ritual.missingFet"
}

GDSA.schamWear = {
    "-2": "GDSA.ritual.perfectWear",
    "-1": "GDSA.ritual.goodWear",
    "+1": "GDSA.ritual.unfittingWear",
    "+2": "GDSA.ritual.missingWear"
}

GDSA.schamDrug = {
    "-8": "GDSA.ritual.whiteLotus",
    "-7": "GDSA.ritual.whiteYellowLotus",
    "-6": "GDSA.ritual.sneakingDeath",
    "-5": "GDSA.ritual.gandel",
    "-4": "GDSA.ritual.ilmen",
    "-3": "GDSA.ritual.water",
    "-2": "GDSA.ritual.cucumber",
    "-1": "GDSA.ritual.cheriach",
    "+0": "GDSA.ritual.mohacca",
    "+1": "GDSA.ritual.alk",
    "+2": "GDSA.ritual.noDrugs",
}

GDSA.schamHelper = {
    "Wdm": ["Akrobatik", "Tanzen", "Singen", "Musizieren"],
    "Utu": ["Akrobatik", "Tanzen", "Singen", "Musizieren"],
    "Toc": ["Akrobatik", "Tanzen", "Singen", "Musizieren"],
    "Niv": ["Tanzen", "Singen", "Musizieren"],
    "Ork": ["Selbstbeherrschung", "Tanzen"],
    "Gob": ["Malen / Zeichnen", "Gesteinskunde", "Tierkunde", "Stimmen Imitieren"],
    "Gja": ["Wettervorhersage", "Pflanzenkunde", "Tierkunde", "Tanzen"],
    "Fer": ["Zechen", "Tierkunde", "Heilkunde: Gift", "Stimmen Imitieren"],
    "Tzk": ["Tanzen", "Selbstbeherrschung", "Pflanzenkunde", "Gesteinskunde"],
    "Ach": ["Malen / Zeichnen", "Gesteinskunde", "Wildnisleben"]
}

GDSA.cuts = {
    brill: "GDSA.cuts.brill",
    rosen: "GDSA.cuts.rosen",
    pende: "GDSA.cuts.pende",
    caboc: "GDSA.cuts.caboc",
    tafel: "GDSA.cuts.tafel",
    smara: "GDSA.cuts.smara"
}

GDSA.wonderRange = {
    self: "GDSA.wonder.self",
    touc: "GDSA.wonder.touc",
    sigt: "GDSA.wonder.sigt",
    faar: "GDSA.wonder.faar"
}

GDSA.wonderCastDuration = {
    action: "GDSA.wonder.action",
    rounds: "GDSA.wonder.rounds",
    halfho: "GDSA.wonder.halfho",
    hours: "GDSA.wonder.hours",
    days: "GDSA.wonder.days"
}

GDSA.wonderTarget = [
    "G",
    "P",
    "PP",
    "PPP",
    "PPPP",
    "PPPPP",
    "Z",
    "ZZ",
    "ZZZ",
    "ZZZZ",
    "ZZZZZ"
]

GDSA.wonderPower = [
    "LkP*/2",
    "LkP*/2 + 5",
    "LkP*",
    "LkP* + 5",
    "LkP* + 10",
    "LkP* + 15",
    "LkP* + 20",
    "LkP* + 25",
    "LkP* + 30",
]

GDSA.wonderDuration = [
    "Augenblicklich",
    "LkP* KR",
    "LkP* x 10 KR",
    "LkP* SR",
    "LkP* Stunden",
    "LkP* Tage",
    "LkP* Wochen",
    "LkP* Monate",
    "LkP* Jahre",
    "Permanent",
    "Speziell"
]

GDSA.magicReps = {
    mag: "GDSA.reps.mag",
    dru: "GDSA.reps.dru",
    bor: "GDSA.reps.bor",
    srl: "GDSA.reps.srl",
    hex: "GDSA.reps.hex",
    elf: "GDSA.reps.elf",
    geo: "GDSA.reps.geo",
    ach: "GDSA.reps.ach",
    sch: "GDSA.reps.sch"
}

GDSA.holyReps = {
    pra: "GDSA.holyreps.pra",
    ron: "GDSA.holyreps.ron",
    phx: "GDSA.holyreps.phx",
    fir: "GDSA.holyreps.fir",
    tra: "GDSA.holyreps.tra",
    ing: "GDSA.holyreps.ing",
    bor: "GDSA.holyreps.bor",
    eff: "GDSA.holyreps.eff",
    hes: "GDSA.holyreps.hes",
    per: "GDSA.holyreps.per",
    rah: "GDSA.holyreps.rah",
    tsa: "GDSA.holyreps.tsa",
    ifi: "GDSA.holyreps.ifi",
    ave: "GDSA.holyreps.ave",
    kor: "GDSA.holyreps.kor",
    nan: "GDSA.holyreps.nan",
    swf: "GDSA.holyreps.swf",
    ang: "GDSA.holyreps.ang",
    tai: "GDSA.holyreps.tai",
    grv: "GDSA.holyreps.grv",
    him: "GDSA.holyreps.him",
    zsa: "GDSA.holyreps.zsa",
    hsz: "GDSA.holyreps.hsz",
    kam: "GDSA.holyreps.kam",
    nam: "GDSA.holyreps.nam"
}

GDSA.holyRepo = {
    Pra: "GDSA.holyreps.pra",
    Ron: "GDSA.holyreps.ron",
    Phx: "GDSA.holyreps.phx",
    Fir: "GDSA.holyreps.fir",
    Tra: "GDSA.holyreps.tra",
    Ing: "GDSA.holyreps.ing",
    Bor: "GDSA.holyreps.bor",
    Eff: "GDSA.holyreps.eff",
    Hes: "GDSA.holyreps.hes",
    Per: "GDSA.holyreps.per",
    Rah: "GDSA.holyreps.rah",
    Tsa: "GDSA.holyreps.tsa",
    Ifi: "GDSA.holyreps.ifi",
    Ave: "GDSA.holyreps.ave",
    Kor: "GDSA.holyreps.kor",
    Nan: "GDSA.holyreps.nan",
    Swf: "GDSA.holyreps.swf",
    Ang: "GDSA.holyreps.ang",
    Tai: "GDSA.holyreps.tai",
    Grv: "GDSA.holyreps.grv",
    Him: "GDSA.holyreps.him",
    Zsa: "GDSA.holyreps.zsa",
    Hsz: "GDSA.holyreps.hsz",
    Kam: "GDSA.holyreps.kam",
    Nam: "GDSA.holyreps.nam"
}

GDSA.holyTime = {
    "0": "GDSA.chat.medi.normalDay",
    "-1": "GDSA.chat.medi.monthOfGod",
    "-3": "GDSA.chat.medi.dayOfGod",
    "+7": "GDSA.chat.medi.namelessDays"
}

GDSA.holyPlace = {
    "0" : "GDSA.chat.medi.neutral",
    "-1": "GDSA.chat.medi.diffrentGod",
    "-2": "GDSA.chat.medi.chapel",
    "-3": "GDSA.chat.medi.kathedrial",
    "-4": "GDSA.chat.medi.holyPlace",
    "+3": "GDSA.chat.medi.disbeliverPresent",
    "+7": "GDSA.chat.medi.demonicPlace"
}

GDSA.holyMotivation = {
    "-7": "GDSA.chat.medi.reasonGood3",
    "-5": "GDSA.chat.medi.reasonGood2",
    "-3": "GDSA.chat.medi.reasonGood1",
    "0" : "GDSA.chat.medi.normal",
    "+3": "GDSA.chat.medi.reasonBad1",
    "+5": "GDSA.chat.medi.reasonBad2",
    "+7": "GDSA.chat.medi.reasonBad3"
}

GDSA.holyResulting = {
    "-2": "GDSA.chat.medi.ordert2",
    "-1": "GDSA.chat.medi.ordert1",
    "0" : "GDSA.chat.medi.normal",
    "+3": "GDSA.chat.medi.disrupting1",
    "+5": "GDSA.chat.medi.disrupting2",
    "+7": "GDSA.chat.medi.disrupting3"
}

GDSA.holyHelp = {
    "0" : "GDSA.chat.medi.none",
    "-1": "GDSA.chat.medi.upSix",
    "-2": "GDSA.chat.medi.upTwelth",
    "-3": "GDSA.chat.medi.upSixthy",
    "-5": "GDSA.chat.medi.wayMore"
}

GDSA.holyLast = {
    "+12": "GDSA.chat.medi.oneDay",
    "+8" : "GDSA.chat.medi.twoDays",
    "+4" : "GDSA.chat.medi.week",
    "0"  : "GDSA.chat.medi.month"
}

GDSA.tempTypes = {
    adva: "GDSA.templates.adva",
    flaw: "GDSA.templates.flaw",
    trai: "GDSA.templates.sf",
    tale: "GDSA.templates.tal",
    kult: "GDSA.templates.kult",
    affi: "GDSA.templates.affi",
    npct: "GDSA.templates.npct",
    npcw: "GDSA.templates.npcw",
    effe: "GDSA.templates.effe"
}

GDSA.ritTypes = {
    schama: "GDSA.templates.schamaRit",
    ritual: "GDSA.templates.ritual",
    objrit: "GDSA.templates.objRit"
}

GDSA.merchantType = {
    1: "GDSA.chat.dialog.lvl1",
    2: "GDSA.chat.dialog.lvl2",
    3: "GDSA.chat.dialog.lvl3",
    4: "GDSA.chat.dialog.lvl4",
    5: "GDSA.chat.dialog.lvl5"
}

GDSA.requtype = {
    attribut: "GDSA.templates.attribut",
    talent: "GDSA.templates.tal",
    trait: "GDSA.templates.sf",
    advantage: "GDSA.templates.adva",
    flaw: "GDSA.templates.flaw",
    spell: "GDSA.templates.spell"
}

GDSA.requatt = {
    MU: "GDSA.charactersheet.MU",
    KL: "GDSA.charactersheet.KL",
    IN: "GDSA.charactersheet.IN",
    CH: "GDSA.charactersheet.CH",
    FF: "GDSA.charactersheet.FF",
    GE: "GDSA.charactersheet.GE",
    KO: "GDSA.charactersheet.KO",
    KK: "GDSA.charactersheet.KK",
    MR: "GDSA.charactersheet.MR",
    INI: "GDSA.charactersheet.INIBasis",
    ATB: "GDSA.charactersheet.ATBasis",
    PAB: "GDSA.charactersheet.PABasis",
    FKB: "GDSA.charactersheet.FKBasis"
}

GDSA.requcon = {
    AND: "GDSA.templates.and",
    OR: "GDSA.templates.or",
    NOT: "GDSA.templates.not"
}

GDSA.sfTypes = {
    general: "GDSA.templates.sfGeneral",
    combat: "GDSA.templates.sfCombat",
    magic: "GDSA.templates.sfMagic",
    holy: "GDSA.templates.sfHoly"
}

GDSA.taleTypes = {
    combat: "GDSA.charactersheet.combatSkills",
    body: "GDSA.charactersheet.bodySkills",
    social: "GDSA.charactersheet.socialSkills",
    nature: "GDSA.charactersheet.natureSkills",
    knowledge: "GDSA.charactersheet.knowledgeSkills",
    lang: "GDSA.charactersheet.langSkills",
    sign: "GDSA.charactersheet.signSkills",
    craft: "GDSA.charactersheet.craftSkils",
    gift: "GDSA.charactersheet.giftSkills",
    meta: "GDSA.charactersheet.metaSkills"
}

GDSA.beType = {
    "-": "-",
    "x": "x"
}

GDSA.taleType = {
    true: "GDSA.charactersheet.baseSkill",
    false: "GDSA.charactersheet.specialSkill"
}

GDSA.taleReqUsa = {
    0:  "",
    10: "ab 10"
}

GDSA.taleAltDis = {
    0:  "",
    5:  "5",
    10: "10",
    15: "15"
}

GDSA.langFam = {
    garethi: "GDSA.template.garethi",
    tulamidya: "GDSA.template.tulamidya",
    thorwalsch: "GDSA.template.thorwalsch",
    elf: "GDSA.template.elf",
    zwerg: "GDSA.template.zwerg",
    ork: "GDSA.template.ork",
    rissoal: "GDSA.template.rissoal",
    alone: "GDSA.template.alone",
    secret: "GDSA.template.secret"
}

GDSA.levelup = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
]

GDSA.cmbttype = {
    meele: "GDSA.charactersheet.meeleSkills",
    range: "GDSA.charactersheet.rangeSkills",
    hand: "GDSA.charactersheet.handSkills"
}

GDSA.cultTypes = {
    twelf: "GDSA.charactersheet.twelf",
    half: "GDSA.charactersheet.half",
    other: "GDSA.charactersheet.other"
}

GDSA.mirDis = {
    0:  "GDSA.charactersheet.mirPlus",
    6:  "GDSA.charactersheet.mirNeut",
    18: "GDSA.charactersheet.mirMinus"
}

GDSA.taleAttributes = {
    mu: "GDSA.charactersheet.sMU",
    kl: "GDSA.charactersheet.sKL",
    in: "GDSA.charactersheet.sIN",
    ch: "GDSA.charactersheet.sCH",
    ff: "GDSA.charactersheet.sFF",
    ge: "GDSA.charactersheet.sGE",
    ko: "GDSA.charactersheet.sKO",
    kk: "GDSA.charactersheet.sKK"
}

GDSA.requCond = {
    requ: "GDSA.template.requ",
    not:  "GDSA.template.notrequ"
}

GDSA.resti = {
    only: "GDSA.itemsheet.only",
    not: "GDSA.itemsheet.not"
}

GDSA.affilation = {
    part: "GDSA.templates.isPart",
    posi: "GDSA.templates.isPosi",
    nega: "GDSA.templates.isNega"
}

GDSA.itemTypes = {
    item: "GDSA.templates.itemGeneral",
    melee: "GDSA.templates.itemMelee",
    range: "GDSA.templates.itemRange",
    armour: "GDSA.templates.itemArmour",
    shild: "GDSA.templates.itemShild"
}

GDSA.itemGenType = {
    item: "GDSA.templates.itemGeneral",
    gem: "GDSA.itemsheet.cystal",
    herb: "GDSA.templates.herb", 
    important: "GDSA.templates.important", 
    tool: "GDSA.templates.tool", 
    equipment: "GDSA.templates.equipment", 
    ressource: "GDSA.templates.ressource", 
    luxus: "GDSA.templates.luxus", 
    container: "GDSA.templates.container", 
    vehical: "GDSA.templates.vehical",
    book: "GDSA.templates.book"
}

GDSA.itemCurrentcyExchange = {
    add : "GDSA.chat.dialog.add",
    remove : "GDSA.chat.dialog.remove"
}

GDSA.itemStorage = {
    bag: "GDSA.itemsheet.storageBag",
    carriage: "GDSA.itemsheet.storageCarriage",
    away: "GDSA.itemsheet.storageAway"
}

GDSA.parryType = {
    shild: "GDSA.itemsheet.shild",
    parryWeapon: "GDSA.itemsheet.parryWeapons"
}

GDSA.shildSize = {
    small: "GDSA.itemsheet.small",
    big: "GDSA.itemsheet.big",
    veryBig: "GDSA.itemsheet.veryBig"
}

GDSA.arrowType = {
    none: "GDSA.itemsheet.noAmmo",
    stone: "GDSA.itemsheet.stone",
    arrow: "GDSA.itemsheet.arrow",
    bolt: "GDSA.itemsheet.cbolt",
    round: "GDSA.itemsheet.round"
}

GDSA.rangeWinds = {
    "0" : "GDSA.chat.rangeOpt.noWind",
    "-4": "GDSA.chat.rangeOpt.lightWind",
    "-8": "GDSA.chat.rangeOpt.heavyWind"
}

GDSA.rangeSight = {
    "0" : "GDSA.chat.rangeOpt.goodSight",
    "-2": "GDSA.chat.rangeOpt.evening",
    "-4": "GDSA.chat.rangeOpt.moon",
    "-6": "GDSA.chat.rangeOpt.star",
    "-8": "GDSA.chat.rangeOpt.night"
}

GDSA.rangeMovem = {
    "4" : "GDSA.chat.rangeOpt.screwed",
    "2" : "GDSA.chat.rangeOpt.still",
    "0" : "GDSA.chat.rangeOpt.lightMovement",
    "-2": "GDSA.chat.rangeOpt.movement",
    "-4": "GDSA.chat.rangeOpt.fastMovement"
}

GDSA.rangeHidea = {
    "0" : "GDSA.chat.rangeOpt.noHide",
    "-2": "GDSA.chat.rangeOpt.halfHide",
    "-4": "GDSA.chat.rangeOpt.threeQuarterHide"
}

GDSA.rangeSizeX = {
    "-10": "GDSA.chat.rangeOpt.veryTiny",
    "-8" : "GDSA.chat.rangeOpt.tiny",
    "-6" : "GDSA.chat.rangeOpt.verySmall",
    "-4" : "GDSA.chat.rangeOpt.small",
    "-2" : "GDSA.chat.rangeOpt.normal",
    "0"  : "GDSA.chat.rangeOpt.tall",
    "2"  : "GDSA.chat.rangeOpt.veryTall"
}

GDSA.cbtType = {
    NPC: "GDSA.combat.NPC",
    PC: "GDSA.combat.PC",
    Enemy: "GDSA.combat.Enemy"
}

GDSA.npcSpecialSkills = {
    "cmbt-2atk": "2 Angriffe",
    "cmbt-3atk": "3 Angriffe",
    "cmbt-4atk": "4 Angriffe",
    "cmbt-2par": "2 Paraden",
    "cmbt-3par": "3 Paraden",
    "cmbt-4par": "4 Paraden",
    "manu-ansp": "Anspringen",
    "manu-dopp": "Doppelangriff",
    "manu-flya": "Flugangriff",
    "manu-gezA": "Geziehlter Angriff",
    "manu-ambu": "Hinterhalt",
    "manu-nied": "Niederwerfen",
    "manu-flyd": "Sturzflug",
    "manu-verb": "Verbeißen",
    "size-bigg": "Großer Gegner",
    "size-huge": "Riesiger Gegner",
    "type-flya": "Fliegender Gegner",
    "trai-auss": "Ausfall",
    "trai-bhk1": "Beidhändiger Kampf I",
    "trai-bhk2": "Beidhändiger Kampf II",
    "trai-bind": "Binden",
    "trai-fint": "Finte",
    "trai-form": "Formation",
    "trai-gezi": "Geziehlter Stich",
    "trai-hamm": "Hammerschlag",
    "trai-par1": "Parrierwaffen I",
    "trai-par2": "Parrierwaffen II",
    "trai-shi1": "Schildkampf I",
    "trai-shi2": "Schildkampf II",
    "trai-shi3": "Schildkampf III",
    "trai-stur": "Sturmangriff",
    "trai-wuch": "Wuchtschlag",
    "mtra-alim": "Ausweichen in den Limbus",
    "mtra-krit": "Kritische Konsistenz",
    "mtra-lang": "Langer Arm",
    "mtra-lebr": "Lebensraub",
    "mtra-sch1": "Schreckgestalt I", 
    "mtra-sch2": "Schreckgestalt II", 
    "mtra-par1": "Paraphysikalität I",
    "mtra-par2": "Paraphysikalität II",
    "mtra-prä1": "Präsenz I",
    "mtra-prä2": "Präsenz II",
    "mtra-rass": "Raserei",
    "mtra-reg1": "Regeneration I",
    "mtra-reg2": "Regeneration II",
    "mtra-reg3": "Regeneration III",
    "immu-elem": "Immunität gegen Elementar",
    "immu-gewe": "Immunität gegen Geweihten Schaden",
    "immu-hieb": "Immunität gegen Hiebwaffen",
    "immu-magi": "Immunität gegen Magischen Schaden",
    "immu-stic": "Immunität gegen Stichwaffen",
    "immu-pfeB": "Immunität gegen Pfeile/Bolzen",
    "immu-prof": "Immunität gegen Profanen Schaden",
    "resi-elem": "Resistenz gegen Elementar",
    "resi-gewe": "Resistenz gegen Geweihten Schaden",
    "resi-hieb": "Resistenz gegen Hiebwaffen",
    "resi-magi": "Resistenz gegen Magischen Schaden",
    "resi-stic": "Resistenz gegen Stichwaffen",
    "resi-pfeB": "Resistenz gegen Pfeile/Bolzen",
    "resi-prof": "Resistenz gegen Profanen Schaden",
    "verw-elem": "Verwundbarkeit gegen Elementar",
    "verw-gewe": "Verwundbarkeit gegen Geweihten Schaden",
    "verw-hieb": "Verwundbarkeit gegen Hiebwaffen",
    "verw-magi": "Verwundbarkeit gegen Magischen Schaden",
    "verw-stic": "Verwundbarkeit gegen Stichwaffen",
    "verw-pfeB": "Verwundbarkeit gegen Pfeile/Bolzen",
    "verw-prof": "Verwundbarkeit gegen Profanen Schaden"
}

GDSA.sfgeneral = [
    "Ortskenntnis", 
    "Talentspezialisierung",
    "Berufsgeheimnis",
    "Zauberspezialisierung",
    "Wahrer Name:",
    "Die Gestalt aus Rauch"
]

GDSA.sfobject = [
    "Apport",
    "Bannschwert",
    "Schalenzauber",
    "Kugelzauber",
    "Stabzauber",
    "Keulenritual",
    "Druidisches Dolchritual",
    "Schlangenring-Zauber",
    "Gabe des Odûn",
    "Schuppenbeutel",
    "Kristallpendel",
    "Szepter",
    "Tapasuul",
    "Schlangenszepters"
]

GDSA.sfrit = [
    "Elfenlied",
    "Druidisches Herrschaftsritual",
    "Hexenritual",
    "Ritual",
    "Hexenfluch"
]