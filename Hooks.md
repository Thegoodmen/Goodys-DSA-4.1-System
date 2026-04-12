# Hooks of GDSA

**gdsa.rollEvent**
*Triggered whenever an Attack, Parry, Dodge, Spell Casting or Holy Casting Action is triggered. The Hook is cast, right before the Chat Message is initiated and after all Calculation and all User Interaction is done.*

- **Type**
    ENUM {"melee", "range", "spell", "ritual", "holy", "mirikal", "dogde"}
- **Actor**
    Reference to the Actor Document of the Triggering Entity
- **Item**
    Reference to any assotiated Item (eg. weapon, shield, spell, holyspell) if not applicaple then null
- **Target**
    Reference to the current Target of the triggering User if Applicaple otherwise null
- **TokenActor**
    Reference to the Token of the Triggering Entity if Applicaple otherwise null
- **TokenTarget**
    Reference to the current Targetet Token of the triggering User if Applicaple otherwise null
- **OptionalObject**
    JSON Object with all Additional Infos that are sent to Chat Messages


**gdsa.meeleEvent**
*Triggered whenever a Melee Attack is started by any User. The Hook is cast, right before the Chat Message is initiated and after all Calculation and all User Interaction is done.*

- **Actor**
    Reference to the Actor Document of the Triggering Entity
- **Weapon**
    Reference to the Spell used to trigger this Event
- **Target**
    Reference to the current Target of the triggering User if Applicaple otherwise null
- **TokenActor**
    Reference to the Token of the Triggering Entity if Applicaple otherwise null
- **TokenTarget**
    Reference to the current Targetet Token of the triggering User if Applicaple otherwise null
- **OptionalObject**
    JSON Object with all Additional Infos that are sent to Chat Messages


**gdsa.rangeEvent**
*Triggered whenever a Range Attack is started by any User. The Hook is cast, right before the Chat Message is initiated and after all Calculation and all User Interaction is done.*

- **Actor**
    Reference to the Actor Document of the Triggering Entity
- **Range-Weapon**
    Reference to the Spell used to trigger this Event
- **Target**
    Reference to the current Target of the triggering User if Applicaple otherwise null
- **TokenActor**
    Reference to the Token of the Triggering Entity if Applicaple otherwise null
- **TokenTarget**
    Reference to the current Targetet Token of the triggering User if Applicaple otherwise null
- **OptionalObject**
    JSON Object with all Additional Infos that are sent to Chat Messages


**gdsa.spellCast**
*Triggered whenever a Spell is casted by any User. The Hook is cast, right before the Chat Message is initiated and after all Calculation and all User Interaction is done.*

- **Actor**
    Reference to the Actor Document of the Triggering Entity
- **Spell**
    Reference to the Spell used to trigger this Event
- **Target**
    Reference to the current Target of the triggering User if Applicaple otherwise null
- **TokenActor**
    Reference to the Token of the Triggering Entity if Applicaple otherwise null
- **TokenTarget**
    Reference to the current Targetet Token of the triggering User if Applicaple otherwise null
- **OptionalObject**
    JSON Object with all Additional Infos that are sent to Chat Messages


**gdsa.ritualCast**
*Triggered whenever a Ritual or SchamanRitual is casted by any User. The Hook is cast, right before the Chat Message is initiated and after all Calculation and all User Interaction is done.*

- **Actor**
    Reference to the Actor Document of the Triggering Entity
- **Ritual**
    Reference to the Ritual used to trigger this Event
- **Target**
    Reference to the current Target of the triggering User if Applicaple otherwise null
- **TokenActor**
    Reference to the Token of the Triggering Entity if Applicaple otherwise null
- **TokenTarget**
    Reference to the current Targetet Token of the triggering User if Applicaple otherwise null
- **OptionalObject**
    JSON Object with all Additional Infos that are sent to Chat Messages


**gdsa.holyCast**
*Triggered whenever a Ritual or SchamanRitual is casted by any User. The Hook is cast, right before the Chat Message is initiated and after all Calculation and all User Interaction is done.*

- **Actor**
    Reference to the Actor Document of the Triggering Entity
- **Liturgy**
    Reference to the Liturgie used to trigger this Event
- **Target**
    Reference to the current Target of the triggering User if Applicaple otherwise null
- **TokenActor**
    Reference to the Token of the Triggering Entity if Applicaple otherwise null
- **TokenTarget**
    Reference to the current Targetet Token of the triggering User if Applicaple otherwise null
- **OptionalObject**
    JSON Object with all Additional Infos that are sent to Chat Messages
    

**gdsa.mirikalCast**
*Triggered whenever a Mirikal is casted by any User. The Hook is cast, right before the Chat Message is initiated and after all Calculation and all User Interaction is done.*

- **Actor**
    Reference to the Actor Document of the Triggering Entity
- **Target**
    Reference to the current Target of the triggering User if Applicaple otherwise null
- **TokenActor**
    Reference to the Token of the Triggering Entity if Applicaple otherwise null
- **TokenTarget**
    Reference to the current Targetet Token of the triggering User if Applicaple otherwise null
- **OptionalObject**
    JSON Object with all Additional Infos that are sent to Chat Messages


**gdsa.dogdeEvent**
*Triggered whenever a Dogde is attempted by any User. The Hook is cast, right before the Chat Message is initiated and after all Calculation and all User Interaction is done.*

- **Actor**
    Reference to the Actor Document of the Triggering Entity
- **TokenActor**
    Reference to the Token of the Triggering Entity if Applicaple otherwise null
- **OptionalObject**
    JSON Object with all Additional Infos that are sent to Chat Messages
