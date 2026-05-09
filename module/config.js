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

GDSA.skilling = {
    "a+": {
        "0": 5,
        "1": 1,
        "2": 1,
        "3": 1,
        "4": 2,
        "5": 4,
        "6": 5,
        "7": 6,
        "8": 8,
        "9": 9,
        "10": 11,
        "11": 12,
        "12": 14,
        "13": 15,
        "14": 17,
        "15": 19,
        "16": 20,
        "17": 22,
        "18": 24,
        "19": 25,
        "20": 27,
        "21": 29,
        "22": 31,
        "23": 32,
        "24": 34,
        "25": 36,
        "26": 38,
        "27": 40,
        "28": 42,
        "29": 43,
        "30": 45,
        "31": 48
    },
    "a": {
        "0": 5,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 6,
        "6": 7,
        "7": 8,
        "8": 10,
        "9": 11,
        "10": 13,
        "11": 14,
        "12": 16,
        "13": 17,
        "14": 19,
        "15": 21,
        "16": 22,
        "17": 24,
        "18": 26,
        "19": 27,
        "20": 29,
        "21": 31,
        "22": 33,
        "23": 34,
        "24": 36,
        "25": 38,
        "26": 40,
        "27": 42,
        "28": 44,
        "29": 45,
        "30": 47,
        "31": 50
    },
    "b": {
        "0": 10,
        "1": 2,
        "2": 4,
        "3": 6,
        "4": 8,
        "5": 11,
        "6": 14,
        "7": 17,
        "8": 19,
        "9": 22,
        "10": 25,
        "11": 28,
        "12": 32,
        "13": 35,
        "14": 38,
        "15": 41,
        "16": 45,
        "17": 46,
        "18": 51,
        "19": 55,
        "20": 58,
        "21": 62,
        "22": 65,
        "23": 69,
        "24": 73,
        "25": 76,
        "26": 80,
        "27": 84,
        "28": 87,
        "29": 91,
        "30": 95,
        "31": 100
    },
    "c": {
        "0": 15,
        "1": 2,
        "2": 6,
        "3": 9,
        "4": 13,
        "5": 17,
        "6": 21,
        "7": 25,
        "8": 29,
        "9": 34,
        "10": 38,
        "11": 43,
        "12": 47,
        "13": 51,
        "14": 55,
        "15": 60,
        "16": 65,
        "17": 70,
        "18": 75,
        "19": 80,
        "20": 85,
        "21": 95,
        "22": 100,
        "23": 105,
        "24": 110,
        "25": 115,
        "26": 120,
        "27": 125,
        "28": 130,
        "29": 135,
        "30": 140,
        "31": 150
    },
    "d": {
        "0": 20,
        "1": 3,
        "2": 7,
        "3": 12,
        "4": 17,
        "5": 22,
        "6": 27,
        "7": 33,
        "8": 39,
        "9": 45,
        "10": 50,
        "11": 55,
        "12": 65,
        "13": 70,
        "14": 75,
        "15": 85,
        "16": 90,
        "17": 95,
        "18": 105,
        "19": 110,
        "20": 115,
        "21": 125,
        "22": 130,
        "23": 140,
        "24": 145,
        "25": 150,
        "26": 160,
        "27": 165,
        "28": 170,
        "29": 180,
        "30": 190,
        "31": 200
    },
    "e": {
        "0": 25,
        "1": 4,
        "2": 9,
        "3": 15,
        "4": 21,
        "5": 28,
        "6": 34,
        "7": 41,
        "8": 48,
        "9": 55,
        "10": 65,
        "11": 70,
        "12": 80,
        "13": 85,
        "14": 95,
        "15": 105,
        "16": 110,
        "17": 120,
        "18": 130,
        "19": 135,
        "20": 145,
        "21": 155,
        "22": 165,
        "23": 170,
        "24": 180,
        "25": 190,
        "26": 200,
        "27": 210,
        "28": 220,
        "29": 230,
        "30": 240,
        "31": 250
    },
    "f": {
        "0": 40,
        "1": 6,
        "2": 14,
        "3": 22,
        "4": 32,
        "5": 41,
        "6": 50,
        "7": 60,
        "8": 75,
        "9": 85,
        "10": 95,
        "11": 105,
        "12": 120,
        "13": 130,
        "14": 140,
        "15": 155,
        "16": 165,
        "17": 180,
        "18": 195,
        "19": 210,
        "20": 220,
        "21": 230,
        "22": 250,
        "23": 260,
        "24": 270,
        "25": 290,
        "26": 300,
        "27": 310,
        "28": 330,
        "29": 340,
        "30": 350,
        "31": 375
    },
    "g": {
        "0": 50,
        "1": 8,
        "2": 18,
        "3": 30,
        "4": 42,
        "5": 55,
        "6": 70,
        "7": 85,
        "8": 95,
        "9": 110,
        "10": 125,
        "11": 140,
        "12": 160,
        "13": 175,
        "14": 190,
        "15": 210,
        "16": 220,
        "17": 240,
        "18": 260,
        "19": 270,
        "20": 290,
        "21": 310,
        "22": 330,
        "23": 340,
        "24": 360,
        "25": 380,
        "26": 400,
        "27": 420,
        "28": 440,
        "29": 460,
        "30": 480,
        "31": 500
    },
    "h": {
        "0": 100,
        "1": 16,
        "2": 35,
        "3": 60,
        "4": 85,
        "5": 110,
        "6": 140,
        "7": 165,
        "8": 195,
        "9": 220,
        "10": 250,
        "11": 280,
        "12": 320,
        "13": 350,
        "14": 380,
        "15": 410,
        "16": 450,
        "17": 480,
        "18": 510,
        "19": 550,
        "20": 580,
        "21": 620,
        "22": 650,
        "23": 690,
        "24": 720,
        "25": 760,
        "26": 800,
        "27": 830,
        "28": 870,
        "29": 910,
        "30": 950,
        "31": 1000
    }
}