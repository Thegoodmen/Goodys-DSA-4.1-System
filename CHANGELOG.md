# Version 0.9.6

**Update for Foundry Version 13 - Pre Release 2**
+ Update of the Different Document Types used in the System to Application V2
   - [] Actor Sheets
   - [] Item Sheet

**Additional Features**

+

**Bugfixes**

+ Adjusted Display of Spell Specialation in Character Sheet (#XXX)
+ Fixed Spelling Error  (#XXX)

**ToDos for next minor Version**

+ Reenable Buff Hud 
+ Bug that makes the Tooltips invisible
+ Update Item Sheets to V2 and finish Graphic Rework
+ Update missing Merchant Sheets to V2
+ Hinzufügen von Zauberlieder, Zaubezeichen und Runenmagie
+ Finish Character Sheet View for Limited Viewport
+ Add Effects to Effect System => More then a number :D
+ Browser for SF, Advantages etc
+ Fix Halbierung der Modis bei MAG
+ Allgemeine Gegenstände wird das Contextmenü nicht angezeigt
+ Blind gm rolls und gm rolls machen das gleiche - also spieler können ergebnisse mit blind gm roll sehen!
+ Als Spieler, funktioniert das Kontextmenü um seine eigenen Nachrichten zu veröffentlichen oder löschen nicht.
+ Beim Import eines Charakterbogens via xml wird der Vorteil [Viertelzauberer] stattdessen als Nachteil [Unbewusster Viertelzauberer] eingepflegt
+ Außerdem scheint der Viertelzauberer selbst nicht die AsP richtig zu beeinflussen (es fehlen 6 AsP  > Modifikator muss manuell auf 0 gesetzt werden)
+ PDFs lassen sich aktuell nicht öffnen

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