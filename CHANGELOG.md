# Version 0.9.6

**Update for Foundry Version 14 - Pre Release 2**
+ Update of the Different Document Types used in the System to Application V2
   - [] Actor Sheets
   - [] Item Sheet

**Additional Features**

+ Added Styling to Standart Chat Messages for a cohirant Experiance
+ Added Hook "gdsa.rollEvent"
+ Added Hook "gdsa.meeleEvent"
+ Added Hook "gdsa.rangeEvent"
+ Added Hook "gdsa.spellCast"
+ Added Hook "gdsa.ritualCast"
+ Added Hook "gdsa.holyCast"
+ Added Hook "gdsa.dogdeEvent"
+ Added Documentation for Hooks (Hooks.md)

**Bugfixes**

+ Adjusted Display of Spell Specialation in Character Sheet (#XXX)
+ Fixed Spelling Error  (#XXX)
+ Fixed Context Menues in regard of the Chat (#XXX)
+ Disabled Language Notifier due to switch to support only German for now (#XXX)
+ Fixed the Regeneration Problem due to missing check for full value (#XXX)
+ Fixed the PDF Pager Integration (#XXX)
+ Fixed double Roll Sound with Dice-so-Nice (#XXX)
+ Added Fix for adjustRessource Function from @STBaf from PR #170
+ Added Fix for missing Variable Error in Spell Casting from @STBaf from PR #170
+ Fixed Blind gm rolls und gm rolls machen das gleiche - also spieler können ergebnisse mit blind gm roll sehen
+ Fixed that the Context Menu is not shown on general Items
+ Fixed the Styling of the Context Menu in Chat Messages
+ Fixed the wrong detection for "Viertelzauberer" that gave the charakters "Unbewusster Viertelzauberer" instead
+ With the Fix above, the Problem with the incurrect amount of AsP disappeared as well
+ Fixed halving the Disadvantes on Mods for MAG and SRL
+ Fixed the Bug that makes the Tooltips invisible

**ToDos for next minor Version**

+ Browser for SF, Advantages etc
+ Reenable Buff Hud 
+ Update missing Merchant Sheets to V2
+ Finish Character Sheet View for Limited Viewport

+ Update Item Sheets to V2 and finish Graphic Rework
+ Add Effects to Effect System => More then a number :D
+ Hinzufügen von Zauberlieder, Zaubezeichen und Runenmagie

---

# Version 0.9.5

**Update for Foundry Version 13 - Pre Release**

In this Update the code is mainly brought forward to support the newest Version of Foundry. The Version 1.0 is pushed back to be Feature Complete.

+ [x] Updated Functions used from the Core Foundry Framework to there new Designations in the Code
+ [x] Updated the Implementation of Custom Seetings Buttons
+ Update of the Different Document Types used in the System to Application V2
   - [] Actor Sheets
   - [] Item Sheet
   - [x] Buff Hud
   - [x] Heldentool Importer
   - [x] GM Screen
   - [x] Compendiums Browser
+ [x] Update Combat System to new Loading Structure
+ [x] Fixed Template of Chat Messages

**Additional Features**

+ After a sucessfull Import, the newly generated Character is opend
+ Added support for the Importer to import "Zauberspezialisierungen" (#165)
+ Added option to Ignore Wounds for there Effects on the character (#113)

**Bugfixes**

+ Bug that "Spätweihe" was not recognized in the Importer (#XXX)
+ Bug that the Importer is not automaticly closed after the Import is finished (#XXX)
+ Bug that the Importer can not Select the SF "Merkmalskenntnis: Dämonisch" (#XXX)
+ Wrong configured Template for Spells (#164)
+ Fixed Bug in relation to Oriantation (#162)
+ Fixed Bug that Combattraker can Jump to rounds (#155)
+ Fixed Bug that Shilds are not considered in InI Calculation (#159)
+ Fixed Bug that Kugelzauber Bindung gets importet as Mandricons Bindung (#XXX)
+ Performance Bug when using the Marcro Bar is fixed (#120)
+ Characters with Natural Weapons can be opend again (#156)
+ Fixed Bug regarding the incomplete import of Rüstungsgewöhnung 1 (#104)
+ Fixed Bug that resulted in wrong Quanities on importing Items with the same Source Item (#144)
+ Fixed Bug when importing Advantages in regrads of "Begabungen" (#163)
+ Fixed Bug that every reload reapplied penalties to AT, PA und FF Base Values (#109)
+ Not able to remove special Combat Option for NPC Actors (#115)