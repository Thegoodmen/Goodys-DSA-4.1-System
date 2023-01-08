export const GDSA = {};

GDSA.attributes = {
    none: "",
    MU: "MU",
    KL: "KL",
    IN: "IN",
    CH: "CH",
    FF: "FF",
    GE: "GE",
    KO: "KO",
    KK: "KK"
}

GDSA.meleeSkills = {
    none: "",
    bastardsword: "GDSA.meleeskill.bastardsword",
    dagger: "GDSA.meleeskill.dagger",
    rapier: "GDSA.meleeskill.rapier",
    club: "GDSA.meleeskill.club",
    halberd: "GDSA.meleeskill.halberd",
    chainstaff: "GDSA.meleeskill.chainstaff",
    chainweapon: "GDSA.meleeskill.chainweapon",
    lance: "GDSA.meleeskill.lance",
    whip: "GDSA.meleeskill.whip",
    brawl: "GDSA.meleeskill.brawl",
    wrestle: "GDSA.meleeskill.wrestle",
    saber: "GDSA.meleeskill.saber",
    sword: "GDSA.meleeskill.sword",
    spear: "GDSA.meleeskill.spear",
    staff: "GDSA.meleeskill.staff",
    twohandflail: "GDSA.meleeskill.twohandflail",
    twohandclub: "GDSA.meleeskill.twohandclub",
    twohandsword: "GDSA.meleeskill.twohandsword"
}

GDSA.rangeSkills = {
    none: "",
    crossbow: "GDSA.rangeskill.crossbow",
    siegeweapon: "GDSA.rangeskill.siegeweapon",
    blowgun: "GDSA.rangeskill.blowgun",
    bow: "GDSA.rangeskill.bow",
    disk: "GDSA.rangeskill.disk",
    slingshot: "GDSA.rangeskill.slingshot",
    throwingaxe: "GDSA.rangeskill.throwingaxe",
    throwingknife: "GDSA.rangeskill.throwingknife",
    throwingspear: "GDSA.rangeskill.throwingspear"
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

GDSA.meleeSkill = {
    andr: {
        skill: "andr",
        beMod: "-2"
    },
    dolc: {
        skill: "dolc",
        beMod: "-1"
    },
    fech: {
        skill: "fech",
        beMod: "-1"
    },
    hieb: {
        skill: "hieb",
        beMod: "-4"
    },
    infa: {
        skill: "infa",
        beMod: "-3"
    },
    kets: {
        skill: "kets",
        beMod: "-1"
    },
    ketw: {
        skill: "ketw",
        beMod: "-3"
    },
    peit: {
        skill: "peit",
        beMod: "-1"
    },
    rauf: {
        skill: "rauf",
        beMod: "1"
    },
    ring: {
        skill: "ring",
        beMod: "1"
    },
    saeb: {
        skill: "saeb",
        beMod: "-2"
    },
    swer: {
        skill: "swer",
        beMod: "-2"
    },
    sper: {
        skill: "sper",
        beMod: "-3"
    },
    stab: {
        skill: "stab",
        beMod: "-2"
    },
    zfle: {
        skill: "zfle",
        beMod: "-3"
    },
    zhie: {
        skill: "zhie",
        beMod: "-3"
    },
    zswe: {
        skill: "zswe",
        beMod: "-2"
    }
}

GDSA.rangeSkill = {
    armb: {
        skill: "armb",
        beMod: "-5"
    },
    bela: {
        skill: "bela",
        beMod: "0"
    },
    blas: {
        skill: "blas",
        beMod: "-5"
    },
    bogn: {
        skill: "bogn",
        beMod: "-3"
    },
    disk: {
        skill: "disk",
        beMod: "-2"
    },
    lanz: {
        skill: "lanz",
        beMod: "0"
    },
    sleu: {
        skill: "sleu",
        beMod: "-2"
    },
    wbei: {
        skill: "wbei",
        beMod: "-2"
    },
    wmes: {
        skill: "wmes",
        beMod: "-3"
    },
    wspe: {
        skill: "wspe",
        beMod: "-2"
    }
}

GDSA.bodySkill = {
    akro: {
        skill: "akro",
        att1: "MU",
        att2: "GE",
        att3: "KK",
        beMod: "2"
    },
    ath: {
        skill: "ath",
        att1: "GE",
        att2: "KO",
        att3: "KK",
        beMod: "2"
    },
    fly: {
        skill: "fly",
        att1: "MU",
        att2: "IN",
        att3: "GE",
        beMod: "1"
    },
    gauk: {
        skill: "gauk",
        att1: "MU",
        att2: "CH",
        att3: "FF",
        beMod: "2"
    },
    klet: {
        skill: "klet",
        att1: "MU",
        att2: "GE",
        att3: "KK",
        beMod: "2"
    },
    koer: {
        skill: "koer",
        att1: "MU",
        att2: "IN",
        att3: "GE",
        beMod: "2"
    },
    reit: {
        skill: "reit",
        att1: "CH",
        att2: "GE",
        att3: "KK",
        beMod: "-2"
    },
    schl: {
        skill: "schl",
        att1: "MU",
        att2: "IN",
        att3: "GE",
        beMod: "1"
    },
    swim: {
        skill: "swim",
        att1: "GE",
        att2: "KO",
        att3: "KK",
        beMod: "2"
    },
    selb: {
        skill: "selb",
        att1: "MU",
        att2: "KO",
        att3: "KK",
        beMod: "0"
    },
    sich: {
        skill: "sich",
        att1: "MU",
        att2: "IN",
        att3: "GE",
        beMod: "-2"
    },
    sing: {
        skill: "sing",
        att1: "IN",
        att2: "CH",
        att3: "CH",
        beMod: "-3"
    },
    sinn: {
        skill: "sinn",
        att1: "KL",
        att2: "IN",
        att3: "IN",
        beMod: "0"
    },
    ski: {
        skill: "ski",
        att1: "GE",
        att2: "GE",
        att3: "KO",
        beMod: "-2"
    },
    stim: {
        skill: "stim",
        att1: "KL",
        att2: "IN",
        att3: "CH",
        beMod: "-4"
    },
    danc: {
        skill: "danc",
        att1: "CH",
        att2: "GE",
        att3: "GE",
        beMod: "2"
    },
    tasc: {
        skill: "tasc",
        att1: "MU",
        att2: "IN",
        att3: "FF",
        beMod: "2"
    },
    zech: {
        skill: "zech",
        att1: "IN",
        att2: "KO",
        att3: "KK",
        beMod: "0"
    }
}

GDSA.socialSkill = {
    beto: {
        skill: "beto",
        att1: "IN",
        att2: "CH",
        att3: "CH"
    },
    etik: {
        skill: "etik",
        att1: "KL",
        att2: "IN",
        att3: "CH"
    },
    gass: {
        skill: "gass",
        att1: "KL",
        att2: "IN",
        att3: "CH"
    },
    lehr: {
        skill: "lehr",
        att1: "KL",
        att2: "IN",
        att3: "CH"
    },
    mens: {
        skill: "mens",
        att1: "KL",
        att2: "IN",
        att3: "CH"
    },
    acti: {
        skill: "acti",
        att1: "MU",
        att2: "KL",
        att3: "CH"
    },
    writ: {
        skill: "writ",
        att1: "KL",
        att2: "IN",
        att3: "IN"
    },
    clot: {
        skill: "clot",
        att1: "MU",
        att2: "CH",
        att3: "GE"
    },
    uber: {
        skill: "uber",
        att1: "MU",
        att2: "IN",
        att3: "CH"
    },
    zeug: {
        skill: "zeug",
        att1: "KL",
        att2: "IN",
        att3: "CH"
    }
}

GDSA.natureSkill = {
    faer: {
        skill: "faer",
        att1: "KL",
        att2: "IN",
        att3: "KO"
    },
    fall: {
        skill: "fall",
        att1: "KL",
        att2: "FF",
        att3: "KK"
    },
    fess: {
        skill: "fess",
        att1: "FF",
        att2: "GE",
        att3: "KK"
    },
    fisc: {
        skill: "fisc",
        att1: "IN",
        att2: "FF",
        att3: "KK"
    },
    orie: {
        skill: "orie",
        att1: "KL",
        att2: "IN",
        att3: "IN"
    },
    wett: {
        skill: "wett",
        att1: "KL",
        att2: "IN",
        att3: "IN"
    },
    wild: {
        skill: "wild",
        att1: "IN",
        att2: "GE",
        att3: "KO"
    }
}

GDSA.knowledgeSkill = {
    anat: {
        skill: "anat",
        att1: "MU",
        att2: "KL",
        att3: "FF"
    },
    bauk: {
        skill: "bauk",
        att1: "KL",
        att2: "KL",
        att3: "FF"
    },
    buks: {
        skill: "buks",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    geog: {
        skill: "geog",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    gesc: {
        skill: "gesc",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    gest: {
        skill: "gest",
        att1: "KL",
        att2: "IN",
        att3: "FF"
    },
    goet: {
        skill: "goet",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    hera: {
        skill: "hera",
        att1: "KL",
        att2: "KL",
        att3: "FF"
    },
    huet: {
        skill: "huet",
        att1: "KL",
        att2: "IN",
        att3: "KO"
    },
    krie: {
        skill: "krie",
        att1: "MU",
        att2: "KL",
        att3: "CH"
    },
    kryp: {
        skill: "kryp",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    magi: {
        skill: "magi",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    mech: {
        skill: "mech",
        att1: "KL",
        att2: "KL",
        att3: "FF"
    },
    pfla: {
        skill: "pfla",
        att1: "KL",
        att2: "IN",
        att3: "FF"
    },
    phil: {
        skill: "phil",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    calc: {
        skill: "calc",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    rect: {
        skill: "rect",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    sage: {
        skill: "sage",
        att1: "KL",
        att2: "IN",
        att3: "CH"
    },
    shae: {
        skill: "shae",
        att1: "KL",
        att2: "IN",
        att3: "IN"
    },
    spra: {
        skill: "spra",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    staa: {
        skill: "staa",
        att1: "KL",
        att2: "IN",
        att3: "CH"
    },
    ster: {
        skill: "ster",
        att1: "KL",
        att2: "KL",
        att3: "IN"
    },
    tier: {
        skill: "tier",
        att1: "MU",
        att2: "KL",
        att3: "IN"
    }
}

GDSA.craftSkill = {
    abri: {
        skill: "abri",
        att1: "MU",
        att2: "IN",
        att3: "CH"
    },
    acke: {
        skill: "acke",
        att1: "IN",
        att2: "FF",
        att3: "KO"
    },
    alch: {
        skill: "alch",
        att1: "MU",
        att2: "KL",
        att3: "FF"
    },
    berg: {
        skill: "berg",
        att1: "IN",
        att2: "KO",
        att3: "KK"
    },
    boge: {
        skill: "boge",
        att1: "KL",
        att2: "IN",
        att3: "FF"
    },
    boot: {
        skill: "boot",
        att1: "GE",
        att2: "KO",
        att3: "KK"
    },
    brau: {
        skill: "brau",
        att1: "KL",
        att2: "FF",
        att3: "KK"
    },
    druc: {
        skill: "druc",
        att1: "KL",
        att2: "FF",
        att3: "KK"
    },
    fahr: {
        skill: "fahr",
        att1: "IN",
        att2: "CH",
        att3: "FF"
    },
    fals: {
        skill: "fals",
        att1: "MU",
        att2: "CH",
        att3: "FF"
    },
    fein: {
        skill: "fein",
        att1: "KL",
        att2: "FF",
        att3: "FF"
    },
    feue: {
        skill: "feue",
        att1: "KL",
        att2: "FF",
        att3: "FF"
    },
    flei: {
        skill: "flei",
        att1: "MU",
        att2: "IN",
        att3: "KK"
    },
    gerb: {
        skill: "gerb",
        att1: "KL",
        att2: "FF",
        att3: "KO"
    },
    glas: {
        skill: "glas",
        att1: "FF",
        att2: "FF",
        att3: "KO"
    },
    grob: {
        skill: "grob",
        att1: "FF",
        att2: "KO",
        att3: "KK"
    },
    hand: {
        skill: "hand",
        att1: "KL",
        att2: "IN",
        att3: "CH"
    },
    haus: {
        skill: "haus",
        att1: "IN",
        att2: "CH",
        att3: "FF"
    },
    hgif: {
        skill: "hgif",
        att1: "MU",
        att2: "KL",
        att3: "IN"
    },
    hkra: {
        skill: "hkra",
        att1: "MU",
        att2: "KL",
        att3: "CH"
    },
    hsee: {
        skill: "hsee",
        att1: "IN",
        att2: "CH",
        att3: "CH"
    },
    hwun: {
        skill: "hwun",
        att1: "KL",
        att2: "CH",
        att3: "FF"
    },
    holz: {
        skill: "holz",
        att1: "KL",
        att2: "FF",
        att3: "KK"
    },
    inst: {
        skill: "inst",
        att1: "KL",
        att2: "IN",
        att3: "FF"
    },
    kart: {
        skill: "kart",
        att1: "KL",
        att2: "KL",
        att3: "FF"
    },
    koch: {
        skill: "koch",
        att1: "KL",
        att2: "IN",
        att3: "FF"
    },
    kris: {
        skill: "kris",
        att1: "KL",
        att2: "IN",
        att3: "FF"
    },
    lede: {
        skill: "lede",
        att1: "KL",
        att2: "FF",
        att3: "FF"
    },
    male: {
        skill: "male",
        att1: "KL",
        att2: "IN",
        att3: "FF"
    },
    maur: {
        skill: "maur",
        att1: "FF",
        att2: "GE",
        att3: "KK"
    },
    meta: {
        skill: "meta",
        att1: "KL",
        att2: "FF",
        att3: "KK"
    },
    musi: {
        skill: "musi",
        att1: "IN",
        att2: "CH",
        att3: "FF"
    },
    shlo: {
        skill: "shlo",
        att1: "IN",
        att2: "FF",
        att3: "FF"
    },
    shna: {
        skill: "shna",
        att1: "KL",
        att2: "IN",
        att3: "FF"
    },
    shne: {
        skill: "shne",
        att1: "KL",
        att2: "FF",
        att3: "FF"
    },
    seef: {
        skill: "seef",
        att1: "FF",
        att2: "GE",
        att3: "KK"
    },
    seil: {
        skill: "seil",
        att1: "FF",
        att2: "FF",
        att3: "KK"
    },
    stme: {
        skill: "stme",
        att1: "FF",
        att2: "FF",
        att3: "KK"
    },
    stsh: {
        skill: "stsh",
        att1: "IN",
        att2: "FF",
        att3: "FF"
    },
    stel: {
        skill: "stel",
        att1: "KL",
        att2: "FF",
        att3: "KK"
    },
    stof: {
        skill: "stof",
        att1: "KL",
        att2: "FF",
        att3: "KK"
    },
    taet: {
        skill: "taet",
        att1: "IN",
        att2: "FF",
        att3: "FF"
    },
    toep: {
        skill: "toep",
        att1: "KL",
        att2: "FF",
        att3: "FF"
    },
    vieh: {
        skill: "vieh",
        att1: "KL",
        att2: "IN",
        att3: "KK"
    },
    webk: {
        skill: "webk",
        att1: "FF",
        att2: "FF",
        att3: "KK"
    },
    winz: {
        skill: "winz",
        att1: "KL",
        att2: "FF",
        att3: "KK"
    },
    zimm: {
        skill: "zimm",
        att1: "KL",
        att2: "FF",
        att3: "KK"
    }
}

GDSA.giftSkill = {
    empa: {
        skill: "empa",
        att1: "MU",
        att2: "IN",
        att3: "IN"
    },
    gefa: {
        skill: "gefa",
        att1: "KL",
        att2: "IN",
        att3: "IN"
    },
    gera: {
        skill: "gera",
        att1: "IN",
        att2: "CH",
        att3: "KO"
    },
    krae: {
        skill: "krae",
        att1: "MU",
        att2: "IN",
        att3: "KO"
    },
    magg: {
        skill: "magg",
        att1: "MU",
        att2: "IN",
        att3: "IN"
    },
    prop: {
        skill: "prop",
        att1: "IN",
        att2: "IN",
        att3: "CH"
    },
    tale: {
        skill: "tale",
        att1: "MU",
        att2: "IN",
        att3: "KO"
    },
    tiem: {
        skill: "tiem",
        att1: "MU",
        att2: "IN",
        att3: "CH"
    },
    zwer: {
        skill: "zwer",
        att1: "FF",
        att2: "IN",
        att3: "IN"
    }
}
