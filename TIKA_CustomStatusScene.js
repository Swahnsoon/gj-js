/*:
 * @plugindesc v2.5 Custom status menu
 * @author TIKA
 *
 * @param ---PointSystem---
 * @default
 * 
 * @param PointsVariable
 * @parent ---PointSystem---
 * @desc Game variable in which bonus Attribute points are stored.
 * @default 8
 *
 * @param ---Player---
 * @default
 * 
 * @param XPVariable
 * @parent ---Player---
 * @desc Game variable in which players xp is stored.
 * @default 18
 * 
 * @param XPPerPlayerLevel
 * @parent ---Player---
 * @desc XP needed for each level.
 * @default [1000,2000,3000,4000,5000,6000,7000,8000,8000,10000]
 * @type int[]
 * 
 * @param TitleVariable
 * @parent ---Player---
 * @desc Game variable in which players title is stored.
 * @default 135
 * 
 * @param WeaponDamageVariable
 * @parent ---Player---
 * @desc Game variable in which players weapon damage is stored.
 * @default 186
 * 
 * @param TotalDamageMaxVariable
 * @parent ---Player---
 * @desc Game variable in which players weapon damage is stored.
 * @default 185
 * 
 * @param TotalDamageMinVariable
 * @parent ---Player---
 * @desc Game variable in which players weapon damage is stored.
 * @default 184
 * 
 * @param CritRangeVariable
 * @parent ---Player---
 * @desc Game variable in which players weapon damage is stored.
 * @default 183
 * 
 * @param CritMultVariable
 * @parent ---Player---
 * @desc Game variable in which players weapon damage is stored.
 * @default 182
 * 
 * @param KarmaVar
 * @parent ---Player---
 * @desc Game variable in which players karma is stored.
 * @default 242
 * 
 * @param FameVar
 * @parent ---Player---
 * @desc Game variable in which players fame is stored.
 * @default 241
 * 
 * @param StartingPoints
 * @parent ---PointSystem---
 * @desc Starting points actor gets at the beginning of the game.
 * @default 25
 * 
 * @param MaxAttr
 * @parent ---PointSystem---
 * @desc Max value that the attribute can go at the beginning of the game.
 * @default 18
 * 
 * @param MinAttr
 * @parent ---PointSystem---
 * @desc Min value that the attribute can go at the beginning of the game.
 * @default 7
 * 
 * @param BabAffectingState
 * @parent ---Player---
 * @desc Passive state that affects basic attack bonus.
 * @default 418
 * 
 * @param MaxDex
 * @parent ---Player---
 * @desc MaxDex param id.
 * @default 52
 * 
 * @param ConfirmationMessage
 * @desc Message previewd after confirming your point distribution.
 * @default Are you satisfied with points distribution?
 * 
 * @param Skills
 * @desc Actor skills that are shown in the status menu.
 * @default [burg,fish,herb,know,mine,charm,steal,tame,wood]
 * 
 * @param ---Damage Traits---
 * @default
 * 
 * @param DamageTraits
 * @desc Damage traits objects.
 * @parent ---Damage Traits---
 * @type struct<DamageTrait>[]
 * 
 * @param ---City Reputation---
 * @default
 * 
 * @param Cities
 * @desc City reputation objects.
 * @parent ---City Reputation---
 * @type struct<CityReputation>[]
 * 
 * @param ---ACPen effects---
 * @default
 * 
 * @param ACPenSkills
 * @desc Skills affected by acpen.
 * @parent ---ACPen effects---
 * @type text[]
 * 
 * @param AttributeDescription
 * @desc Actors attribute description.
 * @default ["Strength","Dexterity","Constitution","Intelligence","Wisdom","Charisma"]
 * @type text[]
 * 
 * @param ClassDescriptions
 * @desc Class description on point buy window.
 * @type struct<ClassDescription>[]
 * 
 * @help
 * ============================================================================
 * Description 
 * ============================================================================
 * 
 * Custom status menu.
 * 
 * **Attribute Descriptions**
 * 
 * AttributeDescriptions is an array of strings. 
 * Array needs to have 6 elemets(descriptions).
 * Needs to have 6 elements, because of 6 params.
 * ["Strength","Dexterity","Constitution","Intelligence","Wisdom","Charisma"]
 * Each element(description) corresponds to one of the parameters.
 * 
 * 1: Strength parameter description
 * 2: Dexterity parameter description
 * 3: Constitution parameter description
 * 4: Strength parameter description
 * 5: Wisdom parameter description
 * 6: Charisma parameter description
 * 
 * **Class Descriptions**
 * ClassDescriptions is an array of objects.
 * Each object corresponds to one of the classes.
 * 
 * ClassDescription object: 
 * {
 *  ClassId: #id - this is an ID of a class that you want to describe
 *  ClassDescription: text - This is a description of a class
 * }
 * 
 * While running point buy window, when you select different parameters,
 * parameter description on the left will update, and write corresponding
 * description.
 * Window on the right will find the correct description for a class that
 * the actor has currently equipped from the ClassDescriptions array.
 * 
 * All the MessageCore codes will work in these description, as well as <br>.
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 * 
 * 
 * 
 * <MaxDex: #> - This notetag is for an weapon, armor or item notebox.
 * This will add maxdex parameter to the selected item. Example:
 * <MaxDex: 7>
 * 
 * 
 * There are two notetags available that are controlling which states will be
 * shown on the traits window:
 * 
 * <PassiveDisplay> - This notetag is for a state notebox. If this notetag is 
 * present in the state notebox, this state will be shown on the traits window
 * if the actor is affected by it.
 * 
 * <StateResistDisplay> - This notetag is for a state notebox. If this notetag 
 * is present in the state notebox, this state will be shown on the traits 
 * window if the actor is resilient to this state.
 * 
 *
 * ============================================================================
 * Scriptcalls
 * ============================================================================
 * There are 3 scriptcalls available:
 * 
 * - On game start: TIKA.StatusMenu.statusMenuGameStart();
 * - On actor level up: TIKA.StatusMenu.statusMenuLevelUp();
 * - To reset attributes: TIKA.StatusMenu.statusMenuResetPoints();
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Timestamp: 01.07.2020 15:40:
 * Damage display fixed, so that it works for pet and merc.
 * 
 * Timestamp: 25.03.2020 22:16 Changed updateSynergies to update _skillModifiers only when the values are different 
 * 
 * Version v2.5
 * Bug fixes on pet and enemy synergies!
 * 
 * Version v2.4
 * Bug fixes on level up scene!
 * 
 * Version v2.3
 * Bug fixes!
 * 
 * Version v2.2
 * Bug fixes!
 * 
 * Version v2.1
 * Redesignet attribute point buy window
 * 
 * Version v2.0
 * Redesign of the status menu with some additional featurs.
 * 
 * Version v1.00
 * Finished plugin!
 *
 *
 */
/*~struct~DamageTrait:
* @param TraitName
* @desc Full name of the trait.
*
* @param TraitDamageVar
* @desc Variable that stores trait damage
* @type number
*
* @param TraitDisplay
* @desc Variable that stores how the trait damage is displayed
* @type number
*/
/*~struct~CityReputation:
* @param CityName
* @desc Full name of the city.
*
* @param CityReputationVar
* @desc Variable that stores city reputation
* @type number
*/
/*~struct~ClassDescription:
* @param ClassId
* @desc Class ID.
* @type number
*
* @param ClassDescription
* @desc Description of a class.
* @type text
*/

var Imported = Imported || {};
Imported.TIKA_CustomStatusScene = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.Param = TIKA.Param || {};
TIKA.StatusMenu = TIKA.StatusMenu || {};
TIKA.Param.Actor = TIKA.Param.Actor || {};
TIKA.Parameters = PluginManager.parameters('TIKA_CustomStatusScene');

TIKA.Param.PointsVariable = Number(TIKA.Parameters['PointsVariable']);
TIKA.Param.StartingPoints = Number(TIKA.Parameters['StartingPoints']);
TIKA.Param.MaxAttribute = Number(TIKA.Parameters['MaxAttr']);
TIKA.Param.MinAttribute = Number(TIKA.Parameters['MinAttr']);
TIKA.Param.Skills = TIKA.Parameters['Skills'].replace('[', '').replace(']', '').split(",").map(String);
TIKA.Param.AttributeDescriptions = JSON.parse(TIKA.Parameters['AttributeDescription']);
TIKA.Param.StateAffectingBab = Number(TIKA.Parameters['BabAffectingState']);
TIKA.Param.ConfirmationMessage = TIKA.Parameters['ConfirmationMessage'];
TIKA.Param.Actor.XpVar = Number(TIKA.Parameters['XPVariable']);
TIKA.Param.Actor.XpPerLevel = JSON.parse(TIKA.Parameters['XPPerPlayerLevel']);
TIKA.Param.Actor.TitleVar = Number(TIKA.Parameters['TitleVariable']);
TIKA.Param.Actor.WeaponDamageVar = Number(TIKA.Parameters['WeaponDamageVariable']);
TIKA.Param.Actor.TotalDamageMinVar = Number(TIKA.Parameters['TotalDamageMinVariable']);
TIKA.Param.Actor.TotalDamageMaxVar = Number(TIKA.Parameters['TotalDamageMaxVariable']);
TIKA.Param.Actor.CritRangeVar = Number(TIKA.Parameters['CritRangeVariable']);
TIKA.Param.Actor.CritMultVar = Number(TIKA.Parameters['CritMultVariable']);
TIKA.Param.Actor.Karma = Number(TIKA.Parameters['KarmaVar']);
TIKA.Param.Actor.Fame = Number(TIKA.Parameters['FameVar']);
TIKA.Param.Actor.MaxDex = Number(TIKA.Parameters['MaxDex']);
TIKA.StatusMenu.isStartGame = false;
TIKA.StatusMenu.isLevelUp = false;
TIKA.StatusMenu.isResetPoints = false;
TIKA.StatusMenu.pointsReset = false;
TIKA.StatusMenu.startGameTreshold = false;
TIKA.Param.Actor.ACPenSkills = JSON.parse(TIKA.Parameters['ACPenSkills'] || '[]');
TIKA.Param.Traits = JSON.parse(TIKA.Parameters['DamageTraits'] || '[]');
for (var i = 0; i < TIKA.Param.Traits.length; i++) {
    TIKA.Param.Traits[i] = JSON.parse(TIKA.Param.Traits[i]);
    TIKA.Param.Traits[i].TraitDamageVar = Number(TIKA.Param.Traits[i].TraitDamageVar);
    TIKA.Param.Traits[i].TraitDisplay = Number(TIKA.Param.Traits[i].TraitDisplay);
}

TIKA.Param.Cities = JSON.parse(TIKA.Parameters['Cities'] || '[]');
for (var i = 0; i < TIKA.Param.Cities.length; i++) {
    TIKA.Param.Cities[i] = JSON.parse(TIKA.Param.Cities[i]);
    TIKA.Param.Cities[i].CityReputationVar = Number(TIKA.Param.Cities[i].CityReputationVar);
}

TIKA.Param.ClassDescriptions = JSON.parse(TIKA.Parameters['ClassDescriptions'] || '[]');
for (var i = 0; i < TIKA.Param.ClassDescriptions.length; i++) {
    TIKA.Param.ClassDescriptions[i] = JSON.parse(TIKA.Param.ClassDescriptions[i]);
    TIKA.Param.ClassDescriptions[i].ClassId = Number(TIKA.Param.ClassDescriptions[i].ClassId);
}

(function () {


    var ATTRIBUTE_POINTS = TIKA.Param.PointsVariable;
    var POINTS_DISTRIBUTION = [];
    var POINTS_SPENT = 0;

    // ============================================================================
    //                              DataManager
    // ============================================================================

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        this.processPassiveTraitNotetags();
        this.processStateResistTraitNotetags();

        for (var i = 1; i < $dataItems.length; i++) {
            this.setMaxDex($dataItems[i]);
        }
        for (var i = 1; i < $dataWeapons.length; i++) {
            this.setMaxDex($dataWeapons[i]);
        }
        for (var i = 1; i < $dataArmors.length; i++) {
            this.setMaxDex($dataArmors[i]);
        }
        for (var i = 1; i < $dataActors.length; i++) {
            this.setActorsTitle($dataActors[i]);
        }

        return true;
    };

    DataManager.setMaxDex = function (item) {
        var maxDex = item.meta['MaxDex'];
        if (item && maxDex) {
            item._maxDex = Number(maxDex.trim());
        }
    }

    DataManager.processPassiveTraitNotetags = function () {
        for (var i = 1; i < $dataStates.length; i++) {
            if ($dataStates[i].name) {
                if ($dataStates[i].meta.PassiveDisplay) {
                    $dataStates[i]._passiveDisplay = $dataStates[i].meta.PassiveDisplay;
                }
            }
        }
    }

    DataManager.processStateResistTraitNotetags = function () {
        for (var i = 1; i < $dataStates.length; i++) {
            if ($dataStates[i].name) {
                if ($dataStates[i].meta.StateResistDisplay) {
                    $dataStates[i]._stateResistDisplay = $dataStates[i].meta.StateResistDisplay;
                }
            }
        }
    }

    DataManager.setActorsTitle = function (actor) {
        var title = actor.meta['Title'];
        if (actor && title) {
            actor._title = title.trim();
        }
    }

    // ============================================================================
    //                    Window_Status
    // ============================================================================


    Window_Status.prototype.refresh = function () {
        this.contents.clear();
        if (this._actor) {
            this._actor.refresh();
            var x = this.padding;
            var lineHeight = this.lineHeight();
            this.drawActorBlock1(x, 0);
            x += lineHeight * 7 + x / 2 + Graphics.boxWidth / 8;
            this.drawActorBlock8(x + 150, 0);
            x = this.padding;
            this.drawActorBlock2(x, lineHeight * 5);
            x += lineHeight * 7 + x / 2 + Graphics.boxWidth / 8;
            this.drawActorBlock3(x, lineHeight * 5);
            x = this.padding;
            this.drawActorBlock4(x, lineHeight * 13);
            x += lineHeight * 7 + x / 2 + Graphics.boxWidth / 8;
            this.drawActorBlock5(x, lineHeight * 13);
            this.drawActorBlock6(2.5 * Graphics.boxWidth / 4, 0);
            this.drawActorBlock7(2.5 * Graphics.boxWidth / 4, lineHeight * 13);
        }
    };

    var Window_Status_drawHorzLine = Window_Status.prototype.drawHorzLine;
    Window_Status.prototype.drawHorzLine = function (x, y, width) {
        if (y && width) {
            var lineY = y + this.lineHeight() / 2 - 1;
            this.contents.fillRect(x, lineY, width, 2, this.lineColor());
        } else {
            Window_Status_drawHorzLine.call(this, y);
        }
    };

    Window_Status.prototype.drawActorBlock1 = function (x, y) {
        this.drawActorFace(this._actor, x, y);
        var width = Graphics.boxWidth / 8;
        var lineHeight = this.lineHeight();
        x += lineHeight * 7 + this.padding / 2;
        this.drawActorAttribute('Name:', '_name', x, y, width);
        this.drawActorsTitle(x, y + lineHeight, width);
        this.drawActorAttribute('Level:', 'level', x, y + lineHeight * 2, width);
        this.drawActorsClassAndSubclass(x, y + lineHeight * 3, width);
    };

    Window_Status.prototype.drawActorBlock8 = function (x, y) {
        if (this._actor.actor()._title != 'Player') return;
        var width = Graphics.boxWidth / 8;
        var lineHeight = this.lineHeight();
        this.drawActorExperience(x, y, width);
        this.drawActorNextLevel(x, y + lineHeight, width);
    };

    Window_Status.prototype.drawActorBlock2 = function (x, y) {
        var width = Graphics.boxWidth / 6;
        var lineHeight = this.lineHeight();
        this.drawActorsHealthAndMana(x, y + lineHeight, width);
        this.drawActorAttribute('AC:', 'ac', x, y + lineHeight * 3, width);
        this.drawText('Max Dex:', x, y + lineHeight * 4, width, 'left');
        var maxDexText = "-";
        if(!isNaN(this._actor.maxdex) && this._actor.maxdex >= 1) {
            maxDexText = this._actor.maxdex;
        }
        this.drawText(maxDexText, x + width, y + lineHeight * 4, width, 'left');
        this.drawActorAttribute('Armor Check Penalty:', 'acpen', x, y + lineHeight * 5, width);
        this.drawActorAttribute('Spell Resistance:', 'resist', x, y + lineHeight * 6, width);
    };

    Window_Status.prototype.drawActorBlock3 = function (x, y) {
        var width = Graphics.boxWidth / 6;
        var lineHeight = this.lineHeight();
        this.drawActorAttribute('Attack Roll:', 'bab', x, y + lineHeight, width, true);
        this.drawActorWeaponDamage(x, y + lineHeight * 2, width);
        this.drawActorTotalDamage(x, y + lineHeight * 3, width);
        this.drawActorCriticalRange(x, y + lineHeight * 4, width);
        this.drawActorCriticalMultiplier(x, y + lineHeight * 5, width);
        this.drawActorInitiative(x, y + lineHeight * 6, width);
    };


    Window_Status.prototype.drawActorBlock4 = function (x, y) {
        var st = this._actor.statusMenuCols();
        var width = Graphics.boxWidth / 4;
        var lineHeight = this.lineHeight();
        this.contents.fontSize = 22;
        this.drawText('Attribute', x, y - this.textPadding(), width, 'left');
        this.drawText('Score', x + Graphics.boxWidth / 6 - this.textWidth('0000'), y - this.textPadding(), width, 'left');
        this.drawText('Modifier', x + Graphics.boxWidth / 4 - this.textWidth('0000000'), y - this.textPadding(), width, 'left');
        this.resetFontSettings();
        this.drawHorzLine(x, lineHeight * 13 + this.textPadding() * 3, Graphics.boxWidth / 4);
        width = Graphics.boxWidth / 6.5;
        if (st[1].length != 0) {
            this.drawParameters(x, y + this.lineHeight(), width, st[1]);
        }
        width = Graphics.boxWidth / 4.5;
        if (st[2].length != 0) {
            this.drawParameters(x, y + this.lineHeight(), width, st[2]);
        }
        if (st[3].length != 0) {
            this.drawParameters(x, y + st[1].length * this.lineHeight() + 2 * this.lineHeight(), width, ['fort', 'will', 'ref']);
        }
    };

    Window_Status.prototype.drawActorBlock5 = function (x, y) {
        var st = TIKA.Param.Skills;
        var lineHeight = this.lineHeight();
        var width = this.contentsWidth() / 5 - this.textPadding() * 5;
        this.contents.fontSize = 22;
        this.drawText('Skills', x, y - this.textPadding(), 100, 'left');
        this.drawText('Score', x + width, y - this.textPadding(), 100, 'center');
        this.resetFontSettings();
        this.drawHorzLine(x, y + this.textPadding() * 3, Graphics.boxWidth / 4);
        if (st.length != 0) {
            width = this.contentsWidth() / 4 - this.textPadding() * 5;
            this.drawParameters(x, y + lineHeight, width, st);
        }
    };

    Window_Status.prototype.drawActorBlock6 = function (x, y) {
        var width = Graphics.boxWidth - x - this.padding;
        this.contents.fontSize = 22;
        this.drawText('Damage Traits', x, y - this.textPadding(), this.width, 'left');
        this.resetFontSettings();
        this.drawHorzLine(x, y + this.textPadding() * 3, width);
        if (this._actor == $gameParty.player())
            this.drawTraits(x, y + this.lineHeight(), width);
    };

    Window_Status.prototype.drawActorBlock7 = function (x, y) {
        var width = Graphics.boxWidth - x - this.padding;
        this.contents.fontSize = 22;
        this.drawText('Reputation', x, y - this.textPadding(), this.width, 'left');
        this.resetFontSettings();
        this.drawHorzLine(x, y + this.textPadding() * 3, width);
        if (this._actor != $gameParty.player()) return;
        this.drawText('Karma:', x, y + this.lineHeight(), width, 'left');
        this.drawText($gameVariables.value(TIKA.Param.Actor.Karma), x, y + this.lineHeight(), width / 3, 'right');
        this.drawText('Fame:', x, y + 2 * this.lineHeight(), width, 'left');
        this.drawText($gameVariables.value(TIKA.Param.Actor.Fame), x, y + 2 * this.lineHeight(), width / 3, 'right');
        this.drawHorzLine(x, y + this.lineHeight() * 2 + this.textPadding() * 4, width);
        this.drawCityReputation(x, y + this.lineHeight() * 3 + this.textPadding() * 2, width);
    };

    Window_Status.prototype.drawTraits = function (x, y, width) {
        var traits = TIKA.Param.Traits;
        var counter = 0;
        for (var i = 0; i < traits.length; i++) {
            if ($gameVariables.value(traits[i].TraitDamageVar)) {
                this.drawText(traits[i].TraitName + ':', x, y + counter * this.lineHeight(), width, 'left');
                this.drawText($gameVariables.value(traits[i].TraitDisplay), x, y + counter * this.lineHeight(), width, 'center');
                counter++;
            }
        }
    }

    Window_Status.prototype.drawCityReputation = function (x, y, width) {
        var cities = TIKA.Param.Cities;
        w1 = width / 3;
        var yCount = 0;
        for (var i = 0; i < cities.length; i++) {
            if (i % 2 == 0) {
                yCount = Math.floor(i / 2);
                this.drawText(cities[i].CityName + ':', x, y + yCount * this.lineHeight(), w1, 'left');
                this.drawText($gameVariables.value(cities[i].CityReputationVar), x, y + yCount * this.lineHeight(), w1, 'right');
            } else {
                this.drawText(cities[i].CityName + ':', x + width / 2, y + yCount * this.lineHeight(), w1, 'left');
                this.drawText($gameVariables.value(cities[i].CityReputationVar), x + width / 2, y + yCount * this.lineHeight(), w1, 'right');
            }

        }
    }

    Window_Status.prototype.drawActorsTitle = function (x, y, width) {
        this.drawText('Title:', x, y, width, 'left');
        this.drawText($gameVariables.value(TIKA.Param.Actor.TitleVar), x + width, y, width, 'left');
    };

    Window_Status.prototype.drawActorsClassAndSubclass = function (x, y, width) {
        var lineHeight = this.lineHeight();
        this.drawText('Class:', x, y, width, 'left');
        this.drawText(this._actor.currentClass().name, x + width, y, width, 'left');
        this.drawText('Subclass:', x, y + lineHeight, width, 'left');
        this.drawText(this._actor.subclass() ? this._actor.subclass().name : '-', x + width, y + lineHeight, width, 'left');
    }

    Window_Status.prototype.drawActorsHealthAndMana = function (x, y, width) {
        var lineHeight = this.lineHeight();
        this.drawText('Health:', x, y, width, 'left');
        this.drawText(this._actor.hp + '/' + this._actor.mhp, x + width, y, width, 'left');
        this.drawText('Mana:', x, y + lineHeight, width, 'left');
        this.drawText(this._actor.mp + '/' + this._actor.mmp, x + width, y + lineHeight, width, 'left');
    }

    Window_Status.prototype.drawActorWeaponDamage = function (x, y, width) {
        this.drawText('Weapon Damage:', x, y, width, 'left');
        var weaponDamage = $gameVariables.value(TIKA.Param.Actor.WeaponDamageVar);
        if ($gameParty.merc() && this._actor._actorId === $gameParty.merc()._actorId)
            weaponDamage = $gameVariables.value(197);
        else if ($gameParty.pet() && this._actor._actorId === $gameParty.pet()._actorId)
            weaponDamage = $gameVariables.value(198);
        var modifier = 0;
        var actor = this._actor;
        modifier = actor.bwd + actor.strm;

        this.drawText(weaponDamage + ' + ' + modifier, x + width, y, width, 'left');
    }

    Window_Status.prototype.drawActorTotalDamage = function (x, y, width) {
        this.drawText('Total Damage:', x, y, width, 'left');
        var minDamage = $gameVariables.value(TIKA.Param.Actor.TotalDamageMinVar);
        var maxDamage = $gameVariables.value(TIKA.Param.Actor.TotalDamageMaxVar);
        var totalDamage = $gameVariables.value(TIKA.Param.Actor.WeaponDamageVar);
        if ($gameParty.merc() && this._actor._actorId === $gameParty.merc()._actorId) {
            if (typeof $gameVariables.value(197) === 'string') {
                totalDamage = $gameVariables.value(197).split('d');
                minDamage = Number(totalDamage[0]) + this._actor.strm + this._actor.bwd;
                maxDamage = Number(totalDamage[1]) + this._actor.strm + this._actor.bwd;
            }
        }
        else if ($gameParty.pet() && this._actor._actorId === $gameParty.pet()._actorId) {
            if (typeof $gameVariables.value(198) === 'string') {
                totalDamage = $gameVariables.value(198).split('d');
                minDamage = Number(totalDamage[0]) + this._actor.strm + this._actor.bwd;
                maxDamage = Number(totalDamage[1]) + this._actor.strm + this._actor.bwd;
            }
        }
        this.drawText(minDamage + ' - ' + maxDamage, x + width, y, width, 'left');
    }

    Window_Status.prototype.drawActorCriticalRange = function (x, y, width) {
        this.drawText('Critical Range:', x, y, width, 'left');
        this.drawText(this._actor.critrng + ' - ' + 20, x + width, y, width, 'left');
    }

    Window_Status.prototype.drawActorCriticalMultiplier = function (x, y, width) {
        this.drawText('Critical Multiplier:', x, y, width, 'left');
        this.drawText('\u00d7' + this._actor.critpwr, x + width, y, width, 'left');
    }

    Window_Status.prototype.drawActorInitiative = function (x, y, width) {
        var initiative = 0;
        this.drawText('Initiative:', x, y, width, 'left');
        if (this._actor.maxdex >= 1) {
            if (this._actor.dexm >= this._actor.maxdex)
                initiative = this._actor.maxdex;
            else
                initiative = this._actor.dexm;
        } else {
            initiative = this._actor.dexm;
        }
        initiative += this._actor.init;
        this.drawText(initiative, x + width, y, width, 'left');
    }

    Window_Status.prototype.drawActorAttribute = function (fullName, attrName, x, y, width, foretoken) {
        this.drawText(fullName, x, y, width, 'left');
        var attr = this._actor[attrName];
        if (attr > 0 && foretoken)
            attr = '+ ' + attr;
        this.drawText(attr, x + width, y, width, 'left');
    }

    Window_Status.prototype.drawActorExperience = function (x, y, width) {
        this.drawText('Experience:', x, y, width, 'left');
        this.drawText($gameVariables.value(TIKA.Param.Actor.XpVar), x + width, y, width, 'left');
    }

    Window_Status.prototype.drawActorNextLevel = function (x, y, width) {
        this.drawText('Next level:', x, y, width, 'left');
        this.drawText(TIKA.Param.Actor.XpPerLevel[this._actor._level - 1], x + width, y, width, 'left');
    }

    ICF.StatusMenu.drawParamsOldStyle = Window_Status.prototype.drawParameters;
    Window_Status.prototype.drawParameters = function (x, y, width, ary) {
        if ((width == undefined) || (ary == undefined)) {
            ICF.StatusMenu.drawParamsOldStyle.call(this, x, y);
            return;
        }
        var lineHeight = this.lineHeight();
        var y2 = y;
        var actor = this._actor;
        for (var i = 0; i < ary.length; i++) {
            var param = [];
            var gauge = false;
            if (ICF.Param.NParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.NParams.indexOf(ary[i]);
                if (!ICF.Param.NParamsFullName[paramId].contains('Modifier')) {
                    param.push(ICF.Param.NParamsFullName[paramId]);
                    param.push(actor.NParam(paramId));
                } else {
                    param.push('');
                    param.push(actor._NParamPlus[paramId]);
                }
            } else if (ICF.Param.PParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.PParams.indexOf(ary[i]);
                param.push(ICF.Param.PParamsFullName[paramId]);
                if (ICF.Param.PercentageParams.indexOf(ary[i]) > -1) {
                    param.push((actor.PParam(paramId) * 100).toFixed(2) + "%");
                } else {
                    param.push(Math.trunc(actor.PParam(paramId)));
                }
            } else if (ICF.Param.CParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.CParams.indexOf(ary[i]);
                param.push(ICF.Param.CParamsFullName[paramId]);
                param.push(actor.CParamValue(paramId));
                param.push(actor.CParam(paramId));
                param.push(ICF.Param.CParamColor1[paramId]);
                param.push(ICF.Param.CParamColor2[paramId]);
                gauge = true;
            } else if (ICF.Param.CParamsMax.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.CParamsMax.indexOf(ary[i]);
                param.push(ICF.Param.CParamsMaxFullName[paramId]);
                param.push(actor.CParam(paramId));
            } else if (ICF.Param.BParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.BParams.indexOf(ary[i]);
                param.push(TextManager.param(paramId));
                param.push(actor.param(paramId));
            } else if (ICF.Param.XParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.XParams.indexOf(ary[i]);
                param.push(ICF.Param.XParamsFullName[paramId]);
                param.push((actor.xparam(paramId) * 100).toFixed(2) + "%");
            } else if (ICF.Param.SParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.SParams.indexOf(ary[i]);
                param.push(ICF.Param.SParamsFullName[paramId]);
                param.push((actor.sparam(paramId) * 100).toFixed(2) + "%");
            } else if (ary[i].match(/(?:eval)(\d+)/i)) {
                var paramId = ICF.Param.EvalParams[RegExp.$1];
                param.push(paramId[0]);
                param.push(eval(paramId[1]));
            } else if (ary[i].match(/(?:percentage)(\d+)/i)) {
                var paramId = ICF.Param.EvalPercentParams[RegExp.$1];
                param.push(paramId[0]);
                param.push((eval(paramId[1]) * 100).toFixed(2) + "%");
            } else if (ary[i].match(/(?:gauge)(\d+)/i)) {
                var paramId = ICF.Param.EvalGauges[RegExp.$1];
                param.push(paramId[0]);
                param.push(eval(paramId[1]));
                param.push(eval(paramId[2]));
                param.push(paramId[3]);
                param.push(paramId[4]);
                param.push(paramId[5]);
                gauge = true;
            }
            if (gauge) {
                var color1 = isNaN(param[3]) ? param[3] : this.textColor(param[3]);
                var color2 = isNaN(param[4]) ? param[4] : this.textColor(param[4]);
                this.drawGauge(x, y2, width, (param[1] / param[2]).clamp(0.0, 1.0), color1, color2);
                if (param[5]) {
                    this.changeTextColor(this.systemColor());
                    this.drawText(param[0], x, y2, width / 3);
                    this.drawCurrentAndMax(param[1], param[2], x + width / 3 - this.textWidth('HP'), y2,
                        width * 2 / 3 + this.textWidth('HP'), this.normalColor(), this.normalColor());
                } else {
                    this.changeTextColor(this.systemColor());
                    this.drawText(param[0], x, y2, width * 2 / 3);
                    this.resetTextColor();
                    this.drawText(param[1], x + width * 2 / 3, y2, width / 3, 'right');
                }
            } else if (param.length > 0) {
                this.resetTextColor();
                this.drawText(param[0], x, y2, width * 2 / 3);
                this.drawText(param[1], x + width * 2 / 3, y2, width / 3, 'right');
            }
            y2 += lineHeight;
        }
    };

    Window_Status.prototype.attributeDifference = function (fullName, value) {
        for (var i = 0; i < POINTS_DISTRIBUTION.length; i++) {
            if (fullName == POINTS_DISTRIBUTION[i].fullName)
                return value != POINTS_DISTRIBUTION[i].value;
        }
    }

    var Window_Status_lineHeight = Window_Status.prototype.lineHeight;
    Window_Status.prototype.lineHeight = function () {
        if (SceneManager._scene instanceof Scene_Status)
            return this.contents.fontSize + this.contents.fontSize / 6;
        else
            return Window_Status_lineHeight.call(this);
    }
    // ============================================================================
    //                    Scene_Status
    // ============================================================================

    Scene_Status.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createInterpreter();
        this.createStatusWindow();
        this.refreshActor();
        this.createTraitsWindow();
        this.createPointsWindow();
        this.createAttributeDescription();
        this.createClassDescription();
        this.createSaveWindow();
    };

    Scene_Status.prototype.createInterpreter = function () {
        this._interpreter = new Game_Interpreter();
    };

    var Scene_Status_refreshActor = Scene_Status.prototype.refreshActor;
    Scene_Status.prototype.refreshActor = function () {
        Scene_Status_refreshActor.call(this);
        if ($gameParty.merc() && this._actor._actorId === $gameParty.merc()._actorId) {
            $gameTemp.reserveCommonEvent(95);
        }
        else if ($gameParty.pet() && this._actor._actorId === $gameParty.pet()._actorId) {
            $gameTemp.reserveCommonEvent(96);
        } else {
            $gameTemp.reserveCommonEvent(17);
        }
        this._interpreter.setupReservedCommonEvent();
        this._interpreter.update();
        this._statusWindow.refresh();
    };

    Scene_Status.prototype.createStatusWindow = function () {
        this._statusWindow = new Window_Status();
        this._statusWindow.setHandler('ok', this.switchPage.bind(this));
        this._statusWindow.setHandler('cancel', this.confirmation.bind(this));
        this._statusWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._statusWindow.setHandler('pageup', this.previousActor.bind(this));
        this._statusWindow.reserveFaceImages();
        this._statusWindow.refresh();
        this.addWindow(this._statusWindow);
    };

    Scene_Status.prototype.createTraitsWindow = function () {
        this._traitsWindow = new Window_Traits();
        this._traitsWindow.setHandler('ok', this.switchPage.bind(this));
        this._traitsWindow.setHandler('cancel', this.switchPage.bind(this));
        this._traitsWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._traitsWindow.setHandler('pageup', this.previousActor.bind(this));
        this._traitsWindow.setObject(this.actor());
        this._traitsWindow.refresh();
        this._traitsWindow.hide();
        this.addWindow(this._traitsWindow);
    };

    Scene_Status.prototype.createSaveWindow = function () {
        this._commandWindow = new Window_SaveParams();
        this._commandWindow.setHandler('confirm', this.save.bind(this));
        this._commandWindow.setHandler('back', this.backToStatus.bind(this));
        this._commandWindow.setHandler('reset', this.resetPoints.bind(this));
        this._commandWindow.setHandler('cancel', this.backToStatus.bind(this));
        this._commandWindow.drawMessage();
        this._commandWindow.close();
        this.addWindow(this._commandWindow);
    };

    Scene_Status.prototype.save = function () {
        if (TIKA.StatusMenu.isResetPoints && $gameVariables.value(ATTRIBUTE_POINTS) > 0) {
            TIKA.StatusMenu.isLevelUp = true;
            TIKA.StatusMenu.isStartGame = false;
            SceneManager.goto(Scene_Status);
            TIKA.StatusMenu.startGameTreshold = true;
            this.initPointsDistribution();
        } else {
            TIKA.StatusMenu.isStartGame = false;
            TIKA.StatusMenu.isLevelUp = false;
            TIKA.StatusMenu.isResetPoints = false;
            TIKA.StatusMenu.pointsReset = false;
            TIKA.StatusMenu.startGameTreshold = false;
            POINTS_SPENT = 0;
            this.initPointsDistribution();
            SceneManager.pop();
        }
    };

    Scene_Status.prototype.resetPoints = function () {
        TIKA.StatusMenu.isStartGame = false;
        TIKA.StatusMenu.isLevelUp = false;
        TIKA.StatusMenu.isResetPoints = true;
        TIKA.StatusMenu.pointsReset = false;
        TIKA.StatusMenu.startGameTreshold = false;
        POINTS_SPENT = 0;
        this._pointsWindow._pointsSpent = POINTS_SPENT;
        this._commandWindow.close();
        this.initPointsDistribution();
        this.start();
    };

    Scene_Status.prototype.backToStatus = function () {
        if (POINTS_SPENT <= TIKA.Param.StartingPoints && TIKA.StatusMenu.isStartGame) {
            TIKA.StatusMenu.startGameTreshold = false;
            TIKA.StatusMenu.isStartGame = true;
        }
        this._commandWindow.close();
        this._pointsWindow.activate();
    };

    Scene_Status.prototype.switchPage = function () {
        if (this._statusWindow.visible) {
            this._statusWindow.hide();
            this._traitsWindow.show();
            this._traitsWindow.refresh();
            this._traitsWindow.activate();
        } else if (this._traitsWindow.visible) {
            this._statusWindow.show();
            this._statusWindow.refresh();
            this._traitsWindow.hide();
            this._statusWindow.activate();
        }
    }

    Scene_Status.prototype.confirmation = function () {
        if (TIKA.StatusMenu.isStartGame || TIKA.StatusMenu.isLevelUp || TIKA.StatusMenu.isResetPoints) {
            POINTS_SPENT = this._pointsWindow._pointsSpent;
            if (this.actor().remainingPoints() <= 0) {
                this._pointsWindow.deactivate();
                this._commandWindow.open();
                this._commandWindow.activate();
            } else {
                this._pointsWindow.activate();
            }
        } else {
            SceneManager.pop();
        }
    }

    var Scene_Status_start = Scene_Status.prototype.start;
    Scene_Status.prototype.start = function () {
        if (TIKA.StatusMenu.isResetPoints && !TIKA.StatusMenu.pointsReset) {
            this.actor().resetPoints();
            TIKA.StatusMenu.pointsReset = true;
            this.initPointsDistribution();
            this._pointsWindow.refresh();
            this._pointsWindow.activate();
        }
        Scene_Status_start.call(this);
        if (this._pointsWindow && this._pointsWindow.active) {
            this.attributeDescriptionUpdate();
            this.classDescriptionUpdate();
        }
    };

    Scene_Status.prototype.createPointsWindow = function () {
        if (TIKA.StatusMenu.isStartGame || TIKA.StatusMenu.isLevelUp || TIKA.StatusMenu.isResetPoints) {
            this._statusWindow.hide();
            this._statusWindow.deactivate();
            this._traitsWindow.deactivate();
            var y = 0;
            var x = 0;
            this.initPointsDistribution();
            this._pointsWindow = new Window_Points(x, y);
            this._pointsWindow._actor = this.actor();
            this._pointsWindow.height = 3 * Graphics.boxHeight / 4;
            this._pointsWindow.width = 3 * Graphics.boxWidth / 5;
            this._pointsWindow.x = Graphics.boxWidth / 2 - this._pointsWindow.width / 2;
            this._pointsWindow.y = Graphics.boxHeight / 2 - this._pointsWindow.height / 2 + 50;
            this._pointsWindow.setHandler('cancel', this.confirmation.bind(this));
            this._pointsWindow.setHandler('increase', this.increaseParam.bind(this));
            this._pointsWindow.setHandler('decrease', this.decreaseParam.bind(this));
            this.addWindow(this._pointsWindow);
            this._pointsWindow.refresh();
            this._pointsWindow.activate();
            this._pointsWindow.select(1);
        }
    }

    Scene_Status.prototype.createAttributeDescription = function () {
        if (TIKA.StatusMenu.isStartGame || TIKA.StatusMenu.isLevelUp || TIKA.StatusMenu.isResetPoints) {
            var y = 0;
            var x = 0;
            var wh = 3 * Graphics.boxHeight / 4;
            var ww = this._pointsWindow.x;
            this._attributeDescription = new Window_PointBuyWindowDescription(x, y, ww, wh);
            this._attributeDescription.y = Graphics.boxHeight / 2 - this._pointsWindow.height / 2 + 50;
            this.addWindow(this._attributeDescription);
        }
    }

    Scene_Status.prototype.createClassDescription = function () {
        if (TIKA.StatusMenu.isStartGame || TIKA.StatusMenu.isLevelUp || TIKA.StatusMenu.isResetPoints) {
            var y = 0;
            var x = 0;
            var wh = 3 * Graphics.boxHeight / 4;
            var ww = Graphics.boxWidth - (this._pointsWindow.x + this._pointsWindow.width);
            this._classDescription = new Window_PointBuyWindowDescription(x, y, ww, wh);
            this._classDescription.x = this._pointsWindow.x + this._pointsWindow.width;
            this._classDescription.y = Graphics.boxHeight / 2 - this._pointsWindow.height / 2 + 50;
            this.addWindow(this._classDescription);
        }
    }

    Scene_Status.prototype.initPointsDistribution = function () {
        var stats = this._actor.statusMenuCols()[1];
        POINTS_DISTRIBUTION = [];
        for (var i = 0; i < stats.length; i++) {
            POINTS_DISTRIBUTION.push({ attribute: stats[i], fullName: ICF.Param.NParamsFullName[this._actor.paramIndex(stats[i])], value: this._actor[stats[i]] });
        }
    };

    Scene_Status.prototype.increaseParam = function () {
        this._pointsWindow.activate();
        this._pointsWindow.increaseParam.call(this._pointsWindow);
        this.refreshActor();
    };

    Scene_Status.prototype.decreaseParam = function () {
        this._pointsWindow.activate();
        this._pointsWindow.decreaseParam.call(this._pointsWindow);
        this.refreshActor();
    };

    var Scene_Status_update = Scene_Status.prototype.update;
    Scene_Status.prototype.update = function () {
        Scene_Status_update.call(this);
        if (this._pointsWindow) {
            this.pointWindowLocationUpdate();
        }

    };

    Scene_Status.prototype.pointWindowLocationUpdate = function () {
        if (this._commandWindow.active) {
            if (this._pointsWindow.y < this._commandWindow.height) {
                this._pointsWindow.y += 5;
                this._attributeDescription.y += 5;
                this._classDescription.y += 5;
            }
        } else {
            var y = Graphics.boxHeight / 2 - this._pointsWindow.height / 2;
            if (this._pointsWindow.y > y) {
                this._pointsWindow.y -= 5;
                this._attributeDescription.y -= 5;
                this._classDescription.y -= 5;
            }
        }
    };

    Scene_Status.prototype.attributeDescriptionUpdate = function () {
        var index = Math.floor(this._pointsWindow.index() / 2);
        this._attributeDescription.contents.clear();
        this._attributeDescription.drawTextAutoWrap(TIKA.Param.AttributeDescriptions[index], 0, 0);
    };

    Scene_Status.prototype.classDescriptionUpdate = function () {
        var classId = this.actor().currentClass().id;
        this._classDescription.contents.clear();
        for (var i = 0; i < TIKA.Param.ClassDescriptions.length; i++) {
            if (TIKA.Param.ClassDescriptions[i].ClassId == classId)
                this._classDescription.drawTextAutoWrap(TIKA.Param.ClassDescriptions[i].ClassDescription, 0, 0);
        }
    };

    var Scene_Status_nextActor = Scene_Status.prototype.nextActor;
    Scene_Status.prototype.nextActor = function () {
        Scene_Status_nextActor.call(this);
        this._traitsWindow.setObject(this._actor);
    };

    var Scene_Status_previousActor = Scene_Status.prototype.previousActor;
    Scene_Status.prototype.previousActor = function () {
        Scene_Status_previousActor.call(this);
        this._traitsWindow.setObject(this._actor);
    };


    // ============================================================================
    //              Window_Points
    // ============================================================================


    function Window_Points() {
        this.initialize.apply(this, arguments);
    }

    Window_Points.prototype = Object.create(Window_Command.prototype);
    Window_Points.prototype.constructor = Window_Points;

    Window_Points.prototype.initialize = function (x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this._pointsSpent = POINTS_SPENT;
    };

    Window_Points.prototype.refresh = function () {
        this.clearCommandList();
        this.makeCommandList();
        this.createContents();
        Window_Selectable.prototype.refresh.call(this);
        if (!this._actor) return;
        var x = this.padding;
        this.contents.fontSize = 23;
        var lineHeight = this.lineHeight();
        this.drawActorBlock1(x, 0 - lineHeight);
        this.drawActorBlock2(x + this.width / 2, 0 - lineHeight);
        this.drawActorBlock3(x, lineHeight * 8);
        this.drawActorBlock4(x + this.width / 2, lineHeight * 8);
        this.drawRemainingPoints(x, this.height - this.lineHeight() * 2);
    };

    Window_Points.prototype.standardPadding = function () {
        return 7;
    };

    Window_Points.prototype.lineHeight = function () {
        return 25;
    };

    Window_Points.prototype.numVisibleRows = function () {
        return this.maxItems();
    };

    Window_Points.prototype.maxCols = function () {
        return 2;
    };

    Window_Points.prototype.makeCommandList = function () {
        this.addOriginalCommands();
    };


    Window_Points.prototype.addOriginalCommands = function () {
        var st = TIKA.Param.Actor.attributes;
        for (var i = 0; i < st.length; i++) {
            this.addCommand('\u2190', 'decrease', true, st[i]);
            this.addCommand('\u2192', 'increase', true, st[i]);
        }
    };


    Window_Points.prototype.processOk = function () {
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    };

    Window_Points.prototype.selectLast = function () {
        this.selectSymbol(Window_Points._lastCommandSymbol);
    };

    Window_Points.prototype.increaseParam = function () {
        if (this._pointsSpent >= 25 && !TIKA.StatusMenu.startGameTreshold) {
            if (TIKA.StatusMenu.isResetPoints) {
                POINTS_SPENT = this._pointsSpent;
                this.deactivate();
                this.parent.parent._commandWindow.open();
                this.parent.parent._commandWindow.activate();
                TIKA.StatusMenu.startGameTreshold = true;
                return;
            }
        }
        var attribute = ICF.Param.NParams.indexOf(this._list[this.index()].ext);
        if (TIKA.StatusMenu.isResetPoints && (this._pointsSpent < TIKA.Param.StartingPoints)) {
            TIKA.StatusMenu.isStartGame = true;
        } else if (TIKA.StatusMenu.isResetPoints && (this._pointsSpent >= TIKA.Param.StartingPoints)) {
            TIKA.StatusMenu.isLevelUp = true;
        }
        if (this._actor.canBeIncreased(attribute, this._list[this.index()].ext)) {
            this._actor.increaseParam(this._list[this.index()].ext);
            if (TIKA.StatusMenu.isResetPoints && !TIKA.StatusMenu.startGameTreshold) {
                if (this._pointsSpent + this._actor.getPointsDecrease(this._list[this.index()].ext) > TIKA.Param.StartingPoints) {
                    this._actor.decreaseParam(this._list[this.index()].ext);
                    this.playBuzzerSound();
                    return;
                }
            }
            this._pointsSpent += this._actor.getPointsDecrease(this._list[this.index()].ext);
            this.refresh();
            this.playOkSound();
        } else {
            this.playBuzzerSound();
        }
    };

    Window_Points.prototype.decreaseParam = function () {
        var attribute = ICF.Param.NParams.indexOf(this._list[this.index()].ext);
        if (TIKA.StatusMenu.isResetPoints && (this._pointsSpent < TIKA.Param.StartingPoints)) {
            TIKA.StatusMenu.isStartGame = true;
        } else if (TIKA.StatusMenu.isResetPoints && (this._pointsSpent >= TIKA.Param.StartingPoints)) {
            TIKA.StatusMenu.isLevelUp = true;
        }
        if (this._actor.canBeDecreased(attribute, this._list[this.index()].ext)) {
            this._actor.decreaseParam(this._list[this.index()].ext);
            this._pointsSpent -= this._actor.getPointsIncrease(this._list[this.index()].ext);
            this.refresh();
            this.playOkSound();
        } else this.playBuzzerSound();
        if (this._pointsSpent < 25)
            TIKA.StatusMenu.startGameTreshold = false;
    };


    Window_Points.prototype.drawItem = function (index) {
        var rect = this.itemRectForText(index);
        this.changeTextColor(this.textColor(14));
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y - this.textPadding() / 2, rect.width, 'center');
        this.resetTextColor();
    };

    Window_Points.prototype.textPadding = function () {
        return 3;
    };

    Window_Points.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.textWidth('\u2190');
        rect.height = this.itemHeight();
        rect.x = this.width / 6 + this.padding + this.textPadding();
        if (index % 2 != 0)
            rect.x += 3 * rect.width;
        rect.width += this.padding * 2;
        rect.y = 9 * this.lineHeight() + Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };

    Window_Points.prototype.windowHeight = function () {
        return this.fittingHeight(this.numVisibleRows());
    };

    Window_Points.prototype.maxItems = function () {
        return this._list.length;
    };

    Window_Points.prototype.cursorRight = function () {
        if (this.active) {
            var index = this.index();
            if (index % 2 != 0)
                return;
            this.select(index + 1);
        }
    };

    Window_Points.prototype.cursorLeft = function () {
        if (this.active) {
            var index = this.index();
            if (index % 2 == 0)
                return;
            this.select(index - 1);
        }
    };

    Window_Points.prototype.cursorDown = function () {
        if (this.active) {
            var index = this.index();
            var maxItems = this.maxItems() - 1;
            if (index == maxItems || (index == maxItems - 1))
                this.select(index - maxItems + 1);
            else this.select(index + 2);
            var scene = this.parent.parent;
            scene.attributeDescriptionUpdate();
            scene.classDescriptionUpdate();
        }
    };

    Window_Points.prototype.cursorUp = function () {
        if (this.active) {
            var index = this.index();
            var maxItems = this.maxItems() - 1;
            if (index == 0 || index == 1)
                this.select(index + maxItems - 1);
            else this.select(index - 2);
            var scene = this.parent.parent;
            scene.attributeDescriptionUpdate();
            scene.classDescriptionUpdate();
        }
    };

    Window_Points.prototype.drawActorBlock1 = function (x, y) {
        var width = Graphics.boxWidth / 6;
        var lineHeight = this.lineHeight();
        this.drawActorsHealthAndMana(x, y + lineHeight, width);
        this.drawActorAttribute('AC:', 'ac', x, y + lineHeight * 3, width);
        this.drawText('Max Dex:', x, y + lineHeight * 4, width, 'left');
        var maxDexText = "-";
        if(!isNaN(this._actor.maxdex) && this._actor.maxdex >= 1) {
            maxDexText = this._actor.maxdex;
        }
        this.drawText(maxDexText, x + width, y + lineHeight * 4, width, 'left');
        this.drawActorAttribute('Armor Check Penalty:', 'acpen', x, y + lineHeight * 5, width);
        this.drawActorAttribute('Spell Resistance:', 'resist', x, y + lineHeight * 6, width);
    };

    Window_Points.prototype.drawActorBlock2 = function (x, y) {
        var width = Graphics.boxWidth / 6;
        var lineHeight = this.lineHeight();
        this.drawActorAttribute('Attack Roll:', 'bab', x, y + lineHeight, width, true);
        this.drawActorWeaponDamage(x, y + lineHeight * 2, width);
        this.drawActorTotalDamage(x, y + lineHeight * 3, width);
        this.drawActorCriticalRange(x, y + lineHeight * 4, width);
        this.drawActorCriticalMultiplier(x, y + lineHeight * 5, width);
        this.drawActorInitiative(x, y + lineHeight * 6, width);
    };


    Window_Points.prototype.drawActorBlock3 = function (x, y) {
        var st = this._actor.statusMenuCols();
        var width = Graphics.boxWidth / 4;
        this.contents.fontSize = 22;
        this.drawText('Attribute', x, y - this.textPadding(), width, 'left');
        this.drawText('Score', x + Graphics.boxWidth / 6 - this.textWidth('0000') - this.textPadding(), y - this.textPadding(), width, 'left');
        this.drawText('Modifier', x + Graphics.boxWidth / 4 - this.textWidth('0000000'), y - this.textPadding(), width, 'left');
        this.resetFontSettings();
        this.drawHorzLine(x, y + this.lineHeight() / 2, Graphics.boxWidth / 4);
        width = Graphics.boxWidth / 6.5;
        if (st[1].length != 0) {
            this.drawParameters(x, y + this.lineHeight(), width, st[1]);
        }
        width = Graphics.boxWidth / 4.5;
        if (st[2].length != 0) {
            this.drawParameters(x, y + this.lineHeight(), width, st[2]);
        }
        if (st[3].length != 0) {
            this.drawParameters(x, y + st[1].length * this.lineHeight() + 2 * this.lineHeight(), width, ['fort', 'will', 'ref']);
        }
    };

    Window_Points.prototype.drawActorBlock4 = function (x, y) {
        var st = TIKA.Param.Skills;
        var lineHeight = this.lineHeight();
        var width = this.contentsWidth() / 4;
        this.contents.fontSize = 22;
        this.drawText('Skills', x, y - this.textPadding(), 100, 'left');
        this.drawText('Score', x + width + this.textPadding() * 2, y - this.textPadding(), 100, 'center');
        this.resetFontSettings();
        this.drawHorzLine(x, y + this.lineHeight() / 2, Graphics.boxWidth / 4);
        if (st.length != 0) {
            width = this.contentsWidth() / 3;
            this.drawParameters(x, y + lineHeight, width, st);
        }
    };

    Window_Points.prototype.drawActorWeaponDamage = function (x, y, width) {
        this.drawText('Weapon Damage:', x, y, width, 'left');
        var weaponDamage = $gameVariables.value(TIKA.Param.Actor.WeaponDamageVar);
        if ($gameParty.merc() && this._actor._actorId === $gameParty.merc()._actorId)
            weaponDamage = $gameVariables.value(197);
        else if ($gameParty.pet() && this._actor._actorId === $gameParty.pet()._actorId)
            weaponDamage = $gameVariables.value(198);

        var modifier = 0;
        var actor = this._actor;
        modifier = actor.bwd + actor.strm;
        this.drawText(weaponDamage + ' + ' + modifier, x + width, y, width, 'left');
    }

    Window_Points.prototype.drawActorsHealthAndMana = function (x, y, width) {
        var lineHeight = this.lineHeight();
        this.drawText('Health:', x, y, width, 'left');
        this.drawText(this._actor.hp + '/' + this._actor.mhp, x + width, y, width, 'left');
        this.drawText('Mana:', x, y + lineHeight, width, 'left');
        this.drawText(this._actor.mp + '/' + this._actor.mmp, x + width, y + lineHeight, width, 'left');
    }

    Window_Points.prototype.drawActorTotalDamage = function (x, y, width) {
        this.drawText('Total Damage:', x, y, width, 'left');
        var minDamage = $gameVariables.value(TIKA.Param.Actor.TotalDamageMinVar);
        var maxDamage = $gameVariables.value(TIKA.Param.Actor.TotalDamageMaxVar);
        var totalDamage = $gameVariables.value(TIKA.Param.Actor.WeaponDamageVar);

        var value0;
        var value1;
        var valueS;
        var valueB;

        if ($gameParty.merc() && this._actor._actorId === $gameParty.merc()._actorId) {
            if (typeof $gameVariables.value(197) === 'string') {
                totalDamage = $gameVariables.value(197).split('d');

                value0 = Number(totalDamage[0]);
                if(isNaN(value0)) value0 = 0;
                value1 = Number(totalDamage[1]);
                if(isNaN(value1)) value1 = 0;

                valueS = this._actor.strm;
                if(isNaN(valueS)) valueS = 0;
                valueB = this._actor.bwd;
                if(isNaN(valueB)) valueB = 0;

                minDamage = value0 + valueS + valueB;
                maxDamage = value1 + valueS + valueB;
                if(isNaN(minDamage)) minDamage = 0;
                if(isNaN(maxDamage)) maxDamage = 0;
            }
        }
        else if ($gameParty.pet() && this._actor._actorId === $gameParty.pet()._actorId) {
            if (typeof $gameVariables.value(198) === 'string') {
                totalDamage = $gameVariables.value(198).split('d');
                
                value0 = Number(totalDamage[0]);
                if(isNaN(value0)) value0 = 0;
                value1 = Number(totalDamage[1]);
                if(isNaN(value1)) value1 = 0;

                valueS = this._actor.strm;
                if(isNaN(valueS)) valueS = 0;
                valueB = this._actor.bwd;
                if(isNaN(valueB)) valueB = 0;

                minDamage = value0 + valueS + valueB;
                maxDamage = value1 + valueS + valueB;
                if(isNaN(minDamage)) minDamage = 0;
                if(isNaN(maxDamage)) maxDamage = 0;
            }
        }
        this.drawText(minDamage + ' - ' + maxDamage, x + width, y, width, 'left');
    }

    Window_Points.prototype.drawActorCriticalRange = function (x, y, width) {
        this.drawText('Critical Range:', x, y, width, 'left');
        this.drawText(this._actor.critrng + ' - ' + 20, x + width, y, width, 'left');
    }

    Window_Points.prototype.drawActorCriticalMultiplier = function (x, y, width) {
        this.drawText('Critical Multiplier:', x, y, width, 'left');
        this.drawText('\u00d7' + this._actor.critpwr, x + width, y, width, 'left');
    }

    Window_Points.prototype.drawActorInitiative = function (x, y, width) {
        var initiative = 0;
        this.drawText('Initiative:', x, y, width, 'left');
        if (this._actor.maxdex >= 1) {
            if (this._actor.dexm >= this._actor.maxdex)
                initiative = this._actor.maxdex;
            else
                initiative = this._actor.dexm;
        } else {
            initiative = this._actor.dexm;
        }
        this.drawText(initiative, x + width, y, width, 'left');
    }

    Window_Points.prototype.drawActorAttribute = function (fullName, attrName, x, y, width, foretoken) {
        this.drawText(fullName, x, y, width, 'left');
        var attr = this._actor[attrName];
        if (attr > 0 && foretoken)
            attr = '+ ' + attr;
        this.drawText(attr, x + width, y, width, 'left');
    }


    Window_Points.prototype.drawRemainingPoints = function (x, y) {
        var width = this.width / 4;
        this.contents.fontSize = 24;
        this.drawText('Points Remaining:', x, y, width, 'left');
        this.changeTextColor(this.textColor(14));
        this.drawText($gameVariables.value(ATTRIBUTE_POINTS), x, y, width, 'right');
        this.resetTextColor();
        this.resetFontSettings();

    }

    ICF.StatusMenu.drawParamsOldStyle = Window_Status.prototype.drawParameters;
    Window_Points.prototype.drawParameters = function (x, y, width, ary) {
        if ((width == undefined) || (ary == undefined)) {
            ICF.StatusMenu.drawParamsOldStyle.call(this, x, y);
            return;
        }
        var lineHeight = this.lineHeight();
        var y2 = y;
        var actor = this._actor;
        for (var i = 0; i < ary.length; i++) {
            var param = [];
            var gauge = false;
            if (ICF.Param.NParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.NParams.indexOf(ary[i]);
                if (!ICF.Param.NParamsFullName[paramId].contains('Modifier')) {
                    param.push(ICF.Param.NParamsFullName[paramId]);
                    param.push(actor.NParam(paramId));
                } else {
                    param.push('');
                    param.push(actor._NParamPlus[paramId]);
                }
            } else if (ICF.Param.PParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.PParams.indexOf(ary[i]);
                param.push(ICF.Param.PParamsFullName[paramId]);
                if (ICF.Param.PercentageParams.indexOf(ary[i]) > -1) {
                    param.push((actor.PParam(paramId) * 100).toFixed(2) + "%");
                } else {
                    param.push(Math.trunc(actor.PParam(paramId)));
                }
            } else if (ICF.Param.CParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.CParams.indexOf(ary[i]);
                param.push(ICF.Param.CParamsFullName[paramId]);
                param.push(actor.CParamValue(paramId));
                param.push(actor.CParam(paramId));
                param.push(ICF.Param.CParamColor1[paramId]);
                param.push(ICF.Param.CParamColor2[paramId]);
                gauge = true;
            } else if (ICF.Param.CParamsMax.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.CParamsMax.indexOf(ary[i]);
                param.push(ICF.Param.CParamsMaxFullName[paramId]);
                param.push(actor.CParam(paramId));
            } else if (ICF.Param.BParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.BParams.indexOf(ary[i]);
                param.push(TextManager.param(paramId));
                param.push(actor.param(paramId));
            } else if (ICF.Param.XParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.XParams.indexOf(ary[i]);
                param.push(ICF.Param.XParamsFullName[paramId]);
                param.push((actor.xparam(paramId) * 100).toFixed(2) + "%");
            } else if (ICF.Param.SParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.SParams.indexOf(ary[i]);
                param.push(ICF.Param.SParamsFullName[paramId]);
                param.push((actor.sparam(paramId) * 100).toFixed(2) + "%");
            } else if (ary[i].match(/(?:eval)(\d+)/i)) {
                var paramId = ICF.Param.EvalParams[RegExp.$1];
                param.push(paramId[0]);
                param.push(eval(paramId[1]));
            } else if (ary[i].match(/(?:percentage)(\d+)/i)) {
                var paramId = ICF.Param.EvalPercentParams[RegExp.$1];
                param.push(paramId[0]);
                param.push((eval(paramId[1]) * 100).toFixed(2) + "%");
            } else if (ary[i].match(/(?:gauge)(\d+)/i)) {
                var paramId = ICF.Param.EvalGauges[RegExp.$1];
                param.push(paramId[0]);
                param.push(eval(paramId[1]));
                param.push(eval(paramId[2]));
                param.push(paramId[3]);
                param.push(paramId[4]);
                param.push(paramId[5]);
                gauge = true;
            }
            if (gauge) {
                var color1 = isNaN(param[3]) ? param[3] : this.textColor(param[3]);
                var color2 = isNaN(param[4]) ? param[4] : this.textColor(param[4]);
                this.drawGauge(x, y2, width, (param[1] / param[2]).clamp(0.0, 1.0), color1, color2);
                if (param[5]) {
                    this.changeTextColor(this.systemColor());
                    this.drawText(param[0], x, y2, width / 3);
                    this.drawCurrentAndMax(param[1], param[2], x + width / 3 - this.textWidth('HP'), y2,
                        width * 2 / 3 + this.textWidth('HP'), this.normalColor(), this.normalColor());
                } else {
                    this.changeTextColor(this.systemColor());
                    this.drawText(param[0], x, y2, width * 2 / 3);
                    this.resetTextColor();
                    this.drawText(param[1], x + width * 2 / 3, y2, width / 3, 'right');
                }
            } else if (param.length > 0) {
                this.drawText(param[0], x, y2, width * 2 / 3);
                this.resetTextColor();
                if (this.attributeDifference(param[0], param[1]))
                    this.changeTextColor(this.textColor(14));
                this.drawText(param[1], x + width * 2 / 3, y2, width / 3, 'right');
                this.resetTextColor();
            }
            y2 += lineHeight;
        }
    };

    Window_Points.prototype.attributeDifference = function (fullName, value) {
        for (var i = 0; i < POINTS_DISTRIBUTION.length; i++) {
            if (fullName == POINTS_DISTRIBUTION[i].fullName)
                return value != POINTS_DISTRIBUTION[i].value;
        }
    }

    Window_Points.prototype.drawHorzLine = function (x, y, width) {
        var lineY = y + this.lineHeight() / 2 - 1;
        this.contents.fillRect(x, lineY, width, 2, this.lineColor());
    };

    Window_Points.prototype.lineColor = function () {
        return this.normalColor();
    };



    // ============================================================================
    //              Save param changes or cancel
    // ============================================================================

    function Window_SaveParams() {
        this.initialize.apply(this, arguments);
    }

    Window_SaveParams.prototype = Object.create(Window_Command.prototype);
    Window_SaveParams.prototype.constructor = Window_SaveParams;

    Window_SaveParams.prototype.initialize = function () {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.updatePlacement();
        this.drawMessage();
        this.openness = 0;
        this.deactivate();
    };

    var Window_Command_refresh = Window_Command.prototype.refresh;
    Window_SaveParams.prototype.refresh = function () {
        Window_Command_refresh.call(this);
        this.drawMessage();
    };

    Window_SaveParams.prototype.drawMessage = function () {
        this.drawTextAutoWrap(TIKA.Param.ConfirmationMessage, this.x, this.y);
    };

    Window_SaveParams.prototype.drawTextAutoWrap = function (text, x, y) {
        if (!text) {
            return;
        }
        var words = text.split(' ');
        let x2 = x;
        let y2 = y;
        words.forEach((word) => {
            if (word === `<br>`)
                word = '\n';
            word = this.convertEscapeCharacters(word);
            var width = this.textWidth(word + ' ');
            if (word === `\x1bn`) {
                y2 += this.lineHeight();
                x2 = x;
            }
            if (x2 + width >= (this.width - this.textPadding() - this.padding)) {
                y2 += this.lineHeight();
                x2 = x;
            }
            this.drawText(word + ' ', x2, y2);
            x2 += width;
        })
    }

    Window_SaveParams.prototype.windowWidth = function () {
        return Graphics.boxWidth / 3;
    };

    Window_SaveParams.prototype.windowHeight = function () {
        return this.fittingHeight(Math.min(this.numVisibleRows(), 3));
    };

    Window_SaveParams.prototype.numVisibleRows = function () {
        return 3;
    };

    Window_SaveParams.prototype.updatePlacement = function () {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = 0;
    };

    Window_SaveParams.prototype.makeCommandList = function () {
        this.addCommand('Yes', 'confirm');
        if (TIKA.StatusMenu.isResetPoints)
            this.addCommand('Reset points', 'reset');
        this.addCommand(TextManager.cancel, 'back');
    };

    Window_SaveParams.prototype.drawItem = function (index) {
        var rect = this.itemRectForText(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'center');
    };

    Window_SaveParams.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = 2 * this.lineHeight();
        return rect;
    };

    Window_SaveParams.prototype.maxCols = function () {
        if (TIKA.StatusMenu.isResetPoints)
            return 3;
        else
            return 2;
    };


    // ============================================================================
    //                      Game_Actor
    // ============================================================================

    var Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function (actorId) {
        Game_Actor_setup.call(this, actorId);
        // this.initSkillModifiers();
        TIKA.Param.Actor.attributes = this.statusMenuCols()[1];
        this._totalSpentPoints = 0;
    };

    var Game_Actor_initialize = Game_Actor.prototype.initialize;
    Game_Actor.prototype.initialize = function (actorId) {
        Game_Actor_initialize.call(this, actorId);
        this.initSkillModifiers();
    };

    var Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function (enemyId, x, y) {
        Game_Enemy_setup.call(this, enemyId, x, y);
        this.initSkillModifiers();
        this.updateParamModifiersNoCheck();
    };


    var Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function () {
        Game_Actor_levelUp.call(this);
        if (this._actorId == $gameParty.player()._actorId) {
            var currPoints = $gameVariables.value(ATTRIBUTE_POINTS);
            $gameVariables.setValue(ATTRIBUTE_POINTS, ++currPoints);
        }
    };

    Game_Actor.prototype.resetPoints = function () {
        var st = this.statusMenuCols();
        st = st[1];
        for (var i = 0; i < st.length; i++) {
            var paramId = ICF.Param.NParams.indexOf(st[i]);
            var value = this._NParamPlus[paramId];
            this.addNParam(paramId, -value);
            this.updateParamModifier(paramId);
        }
        if (TIKA.StatusMenu.isResetPoints)
            $gameVariables.setValue(ATTRIBUTE_POINTS, TIKA.Param.StartingPoints + this._level - 1);
        else
            $gameVariables.setValue(ATTRIBUTE_POINTS, this._totalSpentPoints);
        TIKA.StatusMenu.isStartGame = true;
        this._totalSpentPoints = 0;
        this.initSkillModifiers();
        this.refresh();
    };

    Game_Actor.prototype.initSkillModifiers = function () {
        if (this._skillModifiers) return;
        var skills = TIKA.Param.Skills;
        skills = skills.concat(['ac', 'bab', 'fort', 'will', 'ref']);
        var arr = [];
        for (var i = 0; i < skills.length; i++) {
            arr.push({ name: skills[i], value: 0, acpen: 0 });
        }
        this._skillModifiers = arr;
        // Because modifiers will be initiated in the updateSynergies if don't exist
        // So calling this would cause infinte recursion
        // this.updateSynergies(skills, 0);
    }

    Game_Enemy.prototype.initSkillModifiers = function () {
        var skills = ['ac', 'bab', 'fort', 'will', 'ref'];
        var arr = [];
        for (var i = 0; i < skills.length; i++) {
            arr.push({ name: skills[i], value: 0, acpen: 0 });
        }
        this._skillModifiers = arr;
        // Because modifiers will be initiated in the updateSynergies if don't exist
        // So calling this would cause infinte recursion
        // this.updateSynergies(skills, 0);
    }

    Game_BattlerBase.prototype.updateSynergies = function (skills, value) {
        if (!skills) return;
        if (!this._skillModifiers) this.initSkillModifiers();
        for (var i = 0; i < skills.length; i++) {
            var skillName = typeof skills[i] === 'string' ? skills[i] : skills[i].name;
            var paramIndex = this.paramIndex(skillName);
            for (var j = 0; j < this._skillModifiers.length; j++) {
                var originalValue = value;
                if (this._skillModifiers[j].name == skillName) {
                    if (this.maxdex >= 1 && this._skillModifiers[j].name == 'ac') {
                        if (value > this.maxdex)
                            value = this.maxdex;
                    }
                    var acpen = this.checkAcpen(this._skillModifiers[j].name, j);
                    if (this._skillModifiers[j].value != value) {
                        var diff = value - this._skillModifiers[j].value + acpen;
                        this._skillModifiers[j].value = value;
                        this.addNParam(paramIndex, diff);
                    } else {
                        this.setNParam(paramIndex, this._skillModifiers[j].value);
                    }
                }
                //Bringing value back to the original because the value is changed in case of maxdex
                value = originalValue;
            }
        }
        this.refresh();
    }

    Game_BattlerBase.prototype.checkAcpen = function (paramName, index) {
        var acpen = 0;
        if (!TIKA.Param.Actor.ACPenSkills.includes(paramName)) return acpen;
        if (this._skillModifiers[index].acpen != this.NParam(53)) {
            acpen = this.NParam(53) - this._skillModifiers[index].acpen;
            this._skillModifiers[index].acpen = this.NParam(53);
        }
        return acpen;
    }

    Game_BattlerBase.prototype.checkSynergies = function (modifierName, value) {
        switch (modifierName) {
            case 'dexm':
                if (this.isStateAffected(TIKA.Param.StateAffectingBab)) {
                    this.updateSynergies(['burg', 'steal', 'ac', 'ref', 'bab'], value);
                }
                else
                    this.updateSynergies(['burg', 'steal', 'ac', 'ref'], value);
                break;
            case 'wism':
                this.updateSynergies(['fish', 'will'], value);
                break;
            case 'intm':
                this.updateSynergies(['herb', 'know'], value);
                break;
            case 'strm':
                if (!this.isStateAffected(TIKA.Param.StateAffectingBab)) {
                    this.updateSynergies(['mine', 'wood', 'bab'], value);
                }
                else
                    this.updateSynergies(['mine', 'wood'], value);
                break;
            case 'cham':
                this.updateSynergies(['charm', 'tame'], value); break;
            case 'conm':
                this.updateSynergies(['fort'], value);
                break;
        }
    }

    Game_BattlerBase.prototype.paramIndex = function (ext) {
        return ICF.Param.NParams.indexOf(ext);
    }

    Game_BattlerBase.prototype.updateHealth = function (value) {
        if (value >= 0)
            this.setHp(this.hp + value);
    }

    Game_BattlerBase.prototype.updateMana = function (value) {
        if (value >= 0)
            this.setMp(this.mp + value);
    }

    Game_BattlerBase.prototype.setNParam = function (paramId, value) {
        if (!this._NParamPlus) this._NParamPlus = [];
        if (!this._NParamPlus[paramId]) this._NParamPlus[paramId] = 0;
        this._NParamPlus[paramId] = value;
        this.refresh();
    };

    Game_BattlerBase.prototype.addNParamExtra = function(paramId, value) {
        if (!this._NParamPlusExt) this._NParamPlusExt = [];
        if (!this._NParamPlusExt[paramId]) this._NParamPlusExt[paramId] = 0;
        this._NParamPlusExt[paramId] += value;
        this.refresh();
    };

    Game_BattlerBase.prototype.NParamPlusExt = function(paramId) {
        if (!this._NParamPlusExt) this._NParamPlusExt = [];
        if (!this._NParamPlusExt[paramId]) this._NParamPlusExt[paramId] = 0;
        return this._NParamPlusExt[paramId];
    };

    Game_Actor.prototype.increaseParam = function (ext) {
        if (this.remainingPoints() - this.getPointsDecrease(ext) < 0) return;
        var paramId = this.paramIndex(ext);
        if (!this.canBeIncreased(paramId, ext)) return;
        this.addNParam(paramId, 1);
        this._totalSpentPoints -= this.getPointsDecrease(ext);
        this.decreaseAttributePoints(ext);
        this.updateParamModifier(paramId);
        this.refresh();
    }

    Game_Actor.prototype.decreaseParam = function (ext) {
        var paramId = this.paramIndex(ext);
        if (!this.canBeDecreased(paramId, ext)) return;
        this.addNParam(paramId, -1);
        this._totalSpentPoints += this.getPointsIncrease(ext);
        this.increaseAttributePoints(ext);
        this.updateParamModifier(paramId);
        this.refresh();
    }

    Game_BattlerBase.prototype.paramName = function (index) {
        return ICF.Param.NParams[index];
    }

    Game_Actor.prototype.canBeIncreased = function (paramId, ext) {
        if (TIKA.StatusMenu.isStartGame) {
            return this.NParam(paramId) < TIKA.Param.MaxAttribute && (this.remainingPoints() - this.getPointsIncrease(ext)) >= 0;
        } else return (this.remainingPoints() - this.getPointsIncrease(ext)) >= 0;
    }

    Game_Actor.prototype.canBeDecreased = function (paramId, ext) {
        if (!TIKA.StatusMenu.isStartGame) {
            if (this.getAttrValue(ext) > (this.NParam(paramId) - 1))
                return false;
            else
                return true;
        }
        else return this.NParam(paramId) > TIKA.Param.MinAttribute;
    }

    Game_Actor.prototype.getAttrValue = function (attr) {
        for (var i = 0; i < POINTS_DISTRIBUTION.length; i++) {
            if (POINTS_DISTRIBUTION[i].attribute == attr) {
                return POINTS_DISTRIBUTION[i].value;
            }
        }
    }

    Game_Actor.prototype.updateParamModifiers = function () {
        if (this === null) return;
        var st = this.statusMenuCols();
        var params = st[1];
        for (var i = 0; i < params.length; i++) {
            this.updateParamModifier(this.paramIndex(params[i]));
        }
    }

    Game_Actor.prototype.updateParamModifiersNoCheck = function () {
        if (this === null) return;
        var st = this.statusMenuCols();
        var params = st[1];

        for (var i = 0; i < params.length; i++) {
            this.updateParamModifierNoCheck(this.paramIndex(params[i]));
        }
    }

    Game_Enemy.prototype.updateParamModifiersNoCheck = function () {
        var params = ["str", "dex", "con", "int", "wis", "cha"];

        for (var i = 0; i < params.length; i++) {
            this.updateParamModifier(this.paramIndex(params[i]));
        }
    }

    Game_Enemy.prototype.updateParamModifiers = function () {
        var params = ["str", "dex", "con", "int", "wis", "cha"];

        for (var i = 0; i < params.length; i++) {
            this.updateParamModifier(this.paramIndex(params[i]));
        }
    }

    Game_BattlerBase.prototype.updateParamModifier = function (paramId) {
        var attribute = this[this.paramName(paramId)];
        var modifierName = this.paramName(paramId) + 'm';
        var modifierIndex = this.paramIndex(modifierName);
        var modifier = Math.floor((attribute - 10) / 2);
        if (modifier != this.NParam(modifierIndex)) {
            this.setNParam(modifierIndex, modifier);
            this.refresh();
            this.checkSynergies(modifierName, modifier);
        }
    }

    Game_BattlerBase.prototype.updateParamModifierNoCheck = function (paramId) {
        var attribute = this[this.paramName(paramId)];
        var modifierName = this.paramName(paramId) + 'm';
        var modifierIndex = this.paramIndex(modifierName);
        var modifier = Math.floor((attribute - 10) / 2);
        this.setNParam(modifierIndex, modifier);
        this.refresh();
        this.checkSynergies(modifierName, modifier);
    }

    Game_Actor.prototype.remainingPoints = function () {
        return $gameVariables.value(ATTRIBUTE_POINTS);
    }

    Game_Actor.prototype.decreaseAttributePoints = function (param) {
        if (TIKA.StatusMenu.isStartGame)
            $gameVariables.setValue(ATTRIBUTE_POINTS, this.remainingPoints() - this.getPointsDecrease(param));
        else
            $gameVariables.setValue(ATTRIBUTE_POINTS, this.remainingPoints() - 1);
    }

    Game_Actor.prototype.increaseAttributePoints = function (param) {
        if (TIKA.StatusMenu.isStartGame)
            $gameVariables.setValue(ATTRIBUTE_POINTS, this.remainingPoints() + this.getPointsIncrease(param));
        else
            $gameVariables.setValue(ATTRIBUTE_POINTS, this.remainingPoints() + 1);
    }

    Game_Actor.prototype.getPointsIncrease = function (param) {
        var value = this[param];
        if (TIKA.StatusMenu.isStartGame)
            switch (value) {
                case 7: return 2;
                case 8: return 1;
                case 9: return 1;
                case 10: return 1;
                case 11: return 1;
                case 12: return 1;
                case 13: return 2;
                case 14: return 2;
                case 15: return 3;
                case 16: return 3;
                case 17: return 4;
                default:
                    return 0;
            }
        else return 1;
    }

    Game_Actor.prototype.getPointsDecrease = function (param) {
        var value = this[param];
        if (TIKA.StatusMenu.isStartGame)
            switch (value) {
                case 8: return 2;
                case 9: return 1;
                case 10: return 1;
                case 11: return 1;
                case 12: return 1;
                case 13: return 1;
                case 14: return 2;
                case 15: return 2;
                case 16: return 3;
                case 17: return 3;
                case 18: return 4;

                default:
                    return 0;
            }
        else return 1;
    }

    var Game_BattlerBase_addNParam = Game_BattlerBase.prototype.addNParam;
    Game_Actor.prototype.addNParam = function (paramId, value) {
        Game_BattlerBase_addNParam.call(this, paramId, value);
        if (paramId > 2 && paramId < 9 || paramId > 12 && paramId < 19) {
            this.updateParamModifiers();
        }
    };

    var Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function (stateId) {
        Game_BattlerBase_addNewState.call(this, stateId);
        if (stateId === this.deathStateId()) return;
        this.updateParamModifiersNoCheck();
        this.refresh();
    };


    var Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        Game_Battler_addState.call(this, stateId);
        if (this.isStateAddable(stateId)) {
            this.updateParamModifiersNoCheck();
            this.refresh();
        }
    };

    var Game_BattlerBase_addNParam = Game_BattlerBase.prototype.addNParam;
    Game_Enemy.prototype.addNParam = function (paramId, value) {
        Game_BattlerBase_addNParam.call(this, paramId, value);
        if (paramId > 2 && paramId < 9 || paramId > 12 && paramId < 19)
            this.updateParamModifiers();

    };


    var Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function (slotId, item) {
        Game_Actor_changeEquip.call(this, slotId, item);
        if (!$gameParty.inBattle()) {
            this.updateMaxDex();
            this.updateParamModifiers();
        }
    };

    Game_Actor.prototype.updateMaxDex = function () {
        var currentMaxDex = this.updateMaxDexFromEquipment();
        this.maxdex = this.updateMaxDexFromAugments(currentMaxDex);
    };

    Game_Actor.prototype.updateMaxDexFromEquipment = function () {
        var equips = this._equips;
        var maxDex;
        for (var i = 0; i < equips.length; i++) {
            var item = this.item(equips[i]);
            if (!item) continue;
            if (isNaN(maxDex) && item._maxDex >= 1) {
                maxDex = item._maxDex;
            }
            else if (item._maxDex >= 1 && item._maxDex < maxDex) {
                maxDex = item._maxDex;
            }
        }
        this.setNParam(TIKA.Param.Actor.MaxDex, maxDex);
        return maxDex;
    };

    Game_Actor.prototype.updateMaxDexFromAugments = function (currentMaxDex) {
        if (!currentMaxDex) return;
        var equips = this._equips;
        var augments = this.getAllEquippedAugments(equips);
        var maxDex = 0;
        for (var i = 0; i < augments.length; i++) {
            if (!augments[i] || augments[i] == 'none') continue;
            var augment = augments[i].split(' ');
            var item = this.item({ _dataClass: augment[0], _itemId: Number(augment[1]) });
            if (!item) continue;
            if (!maxDex && item._maxDex) {
                maxDex = item._maxDex;
            }
            else if (item._maxDex)
                maxDex += item._maxDex;
        }
        var value = currentMaxDex + maxDex;
        this.setNParam(TIKA.Param.Actor.MaxDex, value);
        return value;
    };

    Game_Actor.prototype.getAllEquippedAugments = function (equips) {
        var allAugments = [];
        for (var i = 0; i < equips.length; i++) {
            var item = this.item(equips[i]);
            if (!item) continue;
            var augments = item.augmentSlotItems;
            allAugments = allAugments.concat(augments);
        }

        return allAugments;
    };

    Game_Actor.prototype.item = function (item) {
        if (item)
            if (item._dataClass == 'weapon')
                return $dataWeapons[item._itemId];
            else if (item._dataClass == 'armor')
                return $dataArmors[item._itemId];
            else if (item._dataClass == 'item')
                return $dataItems[item._itemId];

        return null;
    };

    // ============================================================================
    //                       ItemManager
    // ============================================================================

    var ItemManager_augmentRefreshParty = ItemManager.augmentRefreshParty;
    ItemManager.augmentRefreshParty = function (item) {
        ItemManager_augmentRefreshParty.call(this, item);
        var length = $gameParty.allMembers().length;
        for (var i = 0; i < length; ++i) {
            var member = $gameParty.allMembers()[i];
            if (member && member.equips().contains(item)) {
                var currentMaxDex = member.updateMaxDexFromEquipment();
                member.updateMaxDexFromAugments(currentMaxDex);
                member.refresh();
            }
        }
    };

    // ============================================================================
    //                       Window_Traits
    // ============================================================================

    function Window_Traits() {
        this.initialize.apply(this, arguments);
    }

    Window_Traits.prototype = Object.create(Window_Status.prototype);
    Window_Traits.prototype.constructor = Window_Traits;


    Window_Traits.prototype.windowWidth = function () {
        return Graphics.boxWidth;
    };

    Window_Traits.prototype.windowHeight = function () {
        return Graphics.boxHeight;
    };

    var Window_Traits_refresh = Window_Traits.prototype.refresh;
    Window_Traits.prototype.refresh = function () {
        Window_Traits_refresh.call(this);
        this.drawColumnTitle('State Resistance', 0, 0, Graphics.boxWidth / 4 - this.padding);
        this.drawColumnTitle('Element Resistance', Graphics.boxWidth / 4, 0, Graphics.boxWidth / 4 - this.padding);
        this.drawColumnTitle('Passive Traits', Graphics.boxWidth / 2, 0, Graphics.boxWidth / 2 - this.padding);
        var lineHeight = this.lineHeight();
        this.contents.fontSize = 20;
        this.drawResistance(0, lineHeight, Graphics.boxWidth / 4 - this.padding, { min: 71, max: 93 });
        this.drawResistance(Graphics.boxWidth / 4, lineHeight, Graphics.boxWidth / 4 - this.padding, { min: 58, max: 70 });
        this.drawPassiveTraits(Graphics.boxWidth / 2, lineHeight, Graphics.boxWidth / 2 - this.padding);
        this.resetFontSettings();
    };

    Window_Traits.prototype.setObject = function (obj) {
        if (this._obj != obj)
            this._obj = obj;
    };

    Window_Traits.prototype.getObject = function () {
        return this._obj;
    };

    Window_Traits.prototype.drawColumnTitle = function (text, x, y, width) {
        this.contents.fontSize = 22;
        this.drawText(text, x, y, width, 'left');
        this.resetFontSettings();
        this.drawHorzLine(x, y + this.textPadding() * 3, width);
    };

    Window_Traits.prototype.drawHorzLine = function (x, y, width) {
        var lineY = y + this.lineHeight() / 2 - 1;
        this.contents.fillRect(x, lineY, width, 2, this.lineColor());
    };

    Window_Traits.prototype.drawResistance = function (x, y, width, range) {
        if (!this._obj) return;
        var counter = 0;
        for (let i = range.min; i <= range.max; i++) {
            if (this._obj.NParam(i) != 0) {
                this.drawText(TextManager.param(ICF.Param.NParams[i]), x, y + counter * this.lineHeight(), width, 'left');
                this.drawText(this._obj.NParam(i), x, y + counter * this.lineHeight(), width, 'right');
                counter++;
            }
        }
    };

    Window_Traits.prototype.drawPassiveTraits = function (x, y, width) {
        if (!this._obj) return;
        var states = this._obj._states.concat(this._obj._passiveStatesRaw);
        var traits = this.getAllClassTraits().filter(trait => this.getTraitname(trait.code, trait.dataId));
        var yCount = 0;
        for (var i = 0; i < traits.length; i++) {
            var trait = this.getTraitname(traits[i].code, traits[i].dataId);
            if (i % 2 == 0) {
                yCount = Math.floor(i / 2);
                this.drawPassiveTrait(trait, x, y + yCount * this.lineHeight(), width);
            } else {
                this.drawPassiveTrait(trait, x + width / 2, y + yCount * this.lineHeight(), width);
            }
        }
        for (var j = 0, i = i; j < states.length; j++) {
            var state = $dataStates[states[j]];
            if (state._passiveDisplay)
                if (i % 2 == 0) {
                    yCount = Math.floor(i / 2);
                    this.drawPassiveTrait(state.name, x, y + yCount * this.lineHeight(), width);
                    i++;
                } else {
                    this.drawPassiveTrait(state.name, x + width / 2, y + yCount * this.lineHeight(), width);
                    i++;
                }
        }
    };

    Window_Traits.prototype.getAllClassTraits = function () {
        if (!this._obj._classId) return;
        else {
            return this._obj.currentClass().traits;
        }
    };

    Window_Traits.prototype.drawPassiveTrait = function (name, x, y, width) {
        this.drawText(name, x, y, width / 2, 'left');
    };

    Window_Traits.prototype.getTraitname = function (code, id) {
        switch (code) {
            case 41: return 'Skill Type - ' + $dataSystem.skillTypes[id];
            case 51: return 'Equip Weapon - ' + $dataSystem.weaponTypes[id];
            case 52: return 'Equip Armor - ' + $dataSystem.armorTypes[id];
        }
    };

    Window_Traits.prototype.item = function (item) {
        if (item)
            if (item._dataClass == 'weapon')
                return $dataWeapons[item._itemId];
            else if (item._dataClass == 'armor')
                return $dataArmors[item._itemId];
            else if (item._dataClass == 'item')
                return $dataItems[item._itemId];

        return null;
    };

    // ============================================================================
    //                    SceneManager
    // ============================================================================

    var SceneManager_pop = SceneManager.pop;
    SceneManager.pop = function () {
        $gameParty.setMenuActor($gameParty.members()[0]);
        SceneManager_pop.call(this);
    }

    // ============================================================================
    //                    Game_Party
    // ============================================================================

    var Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function (actorId) {
        Game_Party_addActor.call(this, actorId);
        $gameActors.actor(actorId).updateParamModifiers();
    };

    Game_Party.prototype.pet = function () {
        return this.findMember('Pet');
    };

    Game_Party.prototype.merc = function () {
        return this.findMember('Merc');
    };

    Game_Party.prototype.player = function () {
        return this.findMember('Player');
    };

    Game_Party.prototype.findMember = function (memberTitle) {
        var members = $gameParty.members();
        for (var i = 0; i < members.length; i++) {
            if (members[i].actor()._title == memberTitle) {
                return members[i];
            }
        }
        return undefined;
    };

    // ============================================================================
    //                       Window_PointBuyWindowDescription
    // ============================================================================


    function Window_PointBuyWindowDescription() {
        this.initialize.apply(this, arguments);
    }

    Window_PointBuyWindowDescription.prototype = Object.create(Window_Base.prototype);
    Window_PointBuyWindowDescription.prototype.constructor = Window_PointBuyWindowDescription;

    Window_PointBuyWindowDescription.prototype.drawTextAutoWrap = function (text, x, y) {
        if (!text) {
            return;
        }
        this.contents.fontSize = 20;
        text = text.replace(/ <br> /gi, '<br>');
        this.drawTextEx('<WordWrap>' + text + ' ', x, y);
        this.resetFontSettings();
    }

    Window_PointBuyWindowDescription.prototype.drawTextEx = function (text, x, y) {
        if (text) {
            var textState = { index: 0, x: x, y: y, left: x, text: text };
            textState.text = this.convertEscapeCharacters(text);
            textState.height = this.calcTextHeight(textState, false);
            while (textState.index < textState.text.length) {
                this.processCharacter(textState);
            }
            return textState.x - x;
        } else {
            return 0;
        }
    };

    Window_PointBuyWindowDescription.prototype.calcTextHeight = function (textState, all) {
        var lastFontSize = this.contents.fontSize;
        var textHeight = 0;
        var lines = textState.text.slice(textState.index).split('\n');
        var maxLines = all ? lines.length : 1;

        for (var i = 0; i < maxLines; i++) {
            var maxFontSize = this.contents.fontSize;
            var regExp = /\x1b[\{\}]/g;
            for (; ;) {
                var array = regExp.exec(lines[i]);
                if (array) {
                    if (array[0] === '\x1b{') {
                        this.makeFontBigger();
                    }
                    if (array[0] === '\x1b}') {
                        this.makeFontSmaller();
                    }
                    if (maxFontSize < this.contents.fontSize) {
                        maxFontSize = this.contents.fontSize;
                    }
                } else {
                    break;
                }
            }
            textHeight += maxFontSize + 4;
        }

        this.contents.fontSize = lastFontSize;
        return textHeight;
    };

    Window_PointBuyWindowDescription.prototype.lineHeight = function () {
        return 23;
    };

    // ============================================================================
    //                    TIKA - Utility
    // ============================================================================

    TIKA.StatusMenu.statusMenuGameStart = function () {
        this.isStartGame = true;
        $gameVariables.setValue(ATTRIBUTE_POINTS, TIKA.Param.StartingPoints);
        if (!$gameParty.inBattle()) SceneManager.push(Scene_Status);
        return true;
    };

    TIKA.StatusMenu.statusMenuLevelUp = function () {
        this.isLevelUp = true;
        if (!$gameParty.inBattle()) SceneManager.push(Scene_Status);
        return true;
    };

    TIKA.StatusMenu.statusMenuResetPoints = function () {
        this.isResetPoints = true;
        if (!$gameParty.inBattle()) SceneManager.push(Scene_Status);
        return true;
    };

    TIKA.StatusMenu.updatePlayerModifiers = function () {
        $gameParty.player() && $gameParty.player().updateParamModifiers();
    };


    TIKA.StatusMenu.updateMercModifiers = function () {
        $gameParty.merc() && $gameParty.merc().updateParamModifiers();
    };

    TIKA.StatusMenu.updatePetModifiers = function () {
        $gameParty.pet() && $gameParty.pet().updateParamModifiers();
    };

})();
