export function getSkillATKValue(actor, skillname) {

    let data = actor.data.data;

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

    let data = actor.data.data;

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
    }
}