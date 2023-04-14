/*:
 * @plugindesc v1.05 This plugin allows to add adept and mastery bonuse state to actor according to class JP.
 * @author TIKA
 *
 * @param Default JP
 * @desc If class doesn't have defined Max JP, this value is used instead.
 * @default 1000
 *
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * Plugin allows to add an adept bonus to the actor once the actor
 * achieves half of the possible class JP, and mastery once the actor
 * achieves maximum class JP.
 * Also it allows the player to unlock additional classes upon gaining an adept
 * or mastery bonus. Class unlock requirements are defined by the notetag in
 * the class.
 *
 * ============================================================================
 * How to use
 * ============================================================================
 *
 * In order for this plugin to work, you have to place it below YEP_JobPoints and
 * FoxJPLevels,respectively.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 * You can define which states the actor will get by using notetags outlined
 * below in the class notebox:
 *
 * <Adept Bonus: stateId>
 * <Mastery Bonus: stateId>
 *
 * Define class max JP by using notetag outlined below in the class notebox:
 *
 * <Max JP: maxJp>
 *
 * Define class unlock adept requirements using this notetag:
 *
 * <Class Unlock: className1 bonus, className2 bonus, ...>
 * Example: <Class Unlock: Fighter Mastery, Mage Adept>
 *
 * Scriptcall for reseting JP to 0:
 *
 * TIKA.resetJP(#actorId);
 *
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Timestamp: 26.03.2020 20:44 - Changed reset function to resetJP (capital JP) and added it to description
 *
 * Timestamp: 25.03.2020 22:53 - Added resetJp function that resets jp back to 0 for wanted actor
 *
 * Version 1.05:
 * -Bugfix: fixed bug where total earned JP weren't updated for the subclass.
 *
 * Version 1.04:
 * -Added feature where upon gaining certain mastery bonuses, you unlock aditional
 * classes
 *
 * Version 1.03:
 * -Added feature where upon gaining certain adept bonuses, you unlock aditional
 * classes
 *
 * Version 1.02:
 * - Adept and mastery notetags are now applicable to classes instead of actor,
 *   so that the class dictates adept and mastery bonuses
 * - Actor can have multiple adept and mastery bonuses active at the same time
 *
 * Version 1.01:
 * - Removed Max JP parameter for the plugin, since in this version max jp is
 *   determined by the class.
 * - Added default JP parameter in case that class doesn't have Max JP defined.
 * - BugFix: Fixed a bug where game crashed if actor didn't have adept and
 *   mastery states defined in the notebox.
 * - Adept bonus is now permanent state also.
 *
 * Version 1.00:
 * - Finished plugin!
 *
 */

var Imported = Imported || {};
Imported.TIKA_MasteryAdeptBonus = true;

var TIKA = TIKA || {};

var parameters = PluginManager.parameters('TIKA_MasteryAdeptBonus');
var defaultClassJP = parameters['Default JP'] || 1000;




(function () {

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;
        this.processClassUnlockNotetags();
        return true;
    };

    DataManager.processClassUnlockNotetags = function () {
        var classes = $dataClasses;
        var length = classes.length;
        for (var i = 1; i < length; i++) {
            if (!classes[i].name) continue;
            var classReq = classes[i].meta['Class Unlock'];
            if (classReq) {
                classReq = classReq.split(',');
                for (var r = 0; r < classReq.length; r++) {
                    classReq[r] = classReq[r].trim();
                }
                classes[i]._stateUnlockRequirements = [];
                for (var j = 0; j < classReq.length; j++) {
                    for (var k = 1; k < length; k++) {
                        if (!classes[k].name) continue;
                        if (classReq[j].split(' ')[0].trim() == classes[k].name) {
                            if (classReq[j].split(' ')[1]) {
                                if (classReq[j].split(' ')[1].trim() == 'Adept') {
                                    if (Number(classes[k].meta['Adept Bonus']))
                                        classes[i]._stateUnlockRequirements.push(Number(classes[k].meta['Adept Bonus']));
                                }
                                else if (classReq[j].split(' ')[1].trim() == 'Mastery') {
                                    if (Number(classes[k].meta['Mastery Bonus']))
                                        classes[i]._stateUnlockRequirements.push(Number(classes[k].meta['Mastery Bonus']));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    var Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function (actorId) {
        Game_Actor_setup.call(this, actorId);
        this._adeptBonus = [];
        this._masteryBonus = [];
        this._unlockedStates = [];

//=============================================================================
// Chaucer : add oldUnlockedStates for class unlock checks.
//=============================================================================
        this._oldUnlockedStates = [];
//=============================================================================

        this._jpTotal = JSON.parse(JSON.stringify(this._jp));
    };

    var Game_BattlerBase_clearStates = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function () {
        Game_BattlerBase_clearStates.call(this);
        if (this._jp) {
            this.initMasteryAdeptBonus();
            this.bonusClassUnlock();
            this.restorMasterAdeptBonuses();
        }
    };

    Game_Actor.prototype.restorMasterAdeptBonuses = function () {
        var states = this._unlockedStates;
        for (var i = 0; i < states.length; i++) {
            if (!this.isStateAffected(states[i])) {
                this._states.push(states[i]);
            }
        }
    }

    Game_Actor.prototype.initMasteryAdeptBonus = function () {
        var length = $dataClasses.length;
        for (var i = 1; i < length; i++) {
            if (!$dataClasses[i].name) continue;
            var maxJP = Number($dataClasses[i].meta['Max JP']) || defaultClassJP;
            if (this._jp[i] >= maxJP / 2 && this._jp[i] < maxJP) {
                var stateId = Number($dataClasses[i].meta['Adept Bonus']);
                if (stateId) {
                    if (!$dataClasses[i]._masteryBonus) {
                        $dataClasses[i]._adeptBonus = stateId;
                        if (this._adeptBonus.indexOf(stateId) < 0) {
                            this._adeptBonus.push(stateId);
                        }
                        this._states.push(stateId);
                    }
                }
            }
            else if (this._jp[i] >= maxJP) {
                var stateId = Number($dataClasses[i].meta['Mastery Bonus']);
                if (stateId) {
                    if ($dataClasses[i]._adeptBonus) {
                        var stateIndex = this._adeptBonus.indexOf($dataClasses[i]._adeptBonus);
                        this.removeState($dataClasses[i]._adeptBonus);
                        this._adeptBonus.splice(stateIndex, 1);
                        $dataClasses[i]._adeptBonus;
                    }
                    $dataClasses[i]._masteryBonus = stateId;
                    if (this._masteryBonus.indexOf(stateId) < 0) {
                        this._masteryBonus.push(stateId);
                    }
                    this._states.push(stateId);

                }
            }
        }
    }

    Game_Actor.prototype.gainJp = function (value, classId) {
        value = parseInt(value);
        if (value === NaN) value = 0;
        classId = classId || this.currentClass().id;
        value = Math.floor(value * this.jpRate() + (value != 0 ? this.NParam(TIKA.Param.ActorJPUP) : 0));
        if ($gameParty.inBattle()) {
            this._battleJp = this._battleJp || 0;
            this._battleJp += value;
        }
        this.setJp(this.jp(classId) + value, classId);
        if (classId === this.currentClass().id && this.isSublcassEarnJp()) {
            this.gainJpSubclass(value);
        }

        this.setJpTotal(this.jpTotal(classId) + value, classId);
        this.addMasteryAdeptBonus($dataClasses[classId]);
    };

    Game_Actor.prototype.setJpTotal = function (value, classId) {
        value = parseInt(value);
        if (value === NaN) {
            value = 0;
        }
        classId = classId || this.currentClass().id;
        if (!this._jpTotal) {
            this._jpTotal = {};
        }
        if (!this._jpTotal[classId]) {
            this._jpTotal[classId] = 0;
        }

        this._jpTotal[classId] = Math.max(0, value);
    }

    var Game_Actor_gainJpSubclass = Game_Actor.prototype.gainJpSubclass;
    Game_Actor.prototype.gainJpSubclass = function (value) {
        Game_Actor_gainJpSubclass.call(this, value);
        this.addMasteryAdeptBonus(this.subclass());
    };

    Game_Actor.prototype.addMasteryAdeptBonus = function (actorClass, masteryBonus, adeptBonus) {
        var maxJP = Number(actorClass.meta['Max JP']) || defaultClassJP;
        var jp = this._jpTotal[actorClass.id];
        if (jp >= maxJP / 2 && jp < maxJP)
            this.addAdeptBonus(actorClass, adeptBonus);
        else if (jp >= maxJP)
            this.addMasteryBonus(actorClass, masteryBonus);
    }

    Game_Actor.prototype.addAdeptBonus = function (actorClass, adeptBonus) {
        var stateId = adeptBonus || this.getBonus('Adept Bonus', $dataClasses)[actorClass.id];
        if (stateId) {
            if (!this.isStateAffected(stateId)) {
                if (this._adeptBonus.indexOf(stateId) < 0) {
                    this._adeptBonus.push(stateId);
                    this._unlockedStates.push(stateId);
                }
                this.addNewState(stateId);
                this.bonusClassUnlock();
            }
        }
    }

    Game_Actor.prototype.bonusClassUnlock = function () {
        var count = 0;
        var classes = $dataClasses;
        var length = classes.length;
        for (var i = 1; i < length; i++) {
            if (!classes[i].name) continue;
            var classUnlockReq = classes[i]._stateUnlockRequirements;

//=============================================================================
// Chaucer : ensure adept is read even if mastery is achieved.
//=============================================================================
            const bonuses = this._unlockedStates.concat( this._oldUnlockedStates );
            // var bonuses = this._unlockedStates;
//=============================================================================

            if (classUnlockReq) {
                bonuses.forEach(bonus => {
                    if (classUnlockReq.indexOf(bonus) >= 0) {
                        count++;
                    }
                    if (count > 0 && count == classUnlockReq.length) {
                        this.unlockClass(classes[i].id);
                    }
                });
                count = 0;
            }
        }
    }

    Game_Actor.prototype.addMasteryBonus = function (actorClass, masteryBonus) {
        var adeptStateId = this.getBonus('Adept Bonus', $dataClasses)[actorClass.id];
        var stateId = masteryBonus || this.getBonus('Mastery Bonus', $dataClasses)[actorClass.id];
        if (stateId) {
            if (!this.isStateAffected(stateId)) {
                var stateIndex = this._adeptBonus.indexOf(adeptStateId);
                if (stateIndex >= 0) {
                    this.removeState(adeptStateId);
                    this._adeptBonus.splice(stateIndex, 1);
                }

//=============================================================================
// Chaucer : prevent adding adept bonuses when adding masteries,
// also remove adept bonuses from unlocked states list.
//=============================================================================
                if (this._unlockedStates.indexOf(adeptStateId) >= 0) {
                  var si2 = this._unlockedStates.indexOf( adeptStateId );
                  this._unlockedStates.splice( si2, 1 );
                }
                if ( this._oldUnlockedStates.indexOf( adeptStateId ) < 0 ) {
                  this._oldUnlockedStates.push( adeptStateId );
                }
                // if (this._unlockedStates.indexOf(adeptStateId) < 0) {
                //   this._unlockedStates.push(adeptStateId);
                // }
//=============================================================================

                if (this._masteryBonus.indexOf(stateId) < 0) {
                    this._masteryBonus.push(stateId);
                    this._unlockedStates.push(stateId);
                }
                this.addNewState(stateId);
                this.bonusClassUnlock();
            }
        }
    }

    Game_Actor.prototype.hasAdeptBonus = function (stateId) {
        return this._adeptBonus.indexOf(stateId) > -1;
    }

    Game_Actor.prototype.hasMasteryBonus = function (stateId) {
        return this._masteryBonus.indexOf(stateId) > -1;
    }

    Game_Actor.prototype.getBonus = function (tagName, dataClasses) {
        var noteboxBonuses = [null];
        for (var i = 1; i < dataClasses.length; i++) {
            noteboxBonuses.push(Number(dataClasses[i].meta[tagName]));
        }
        return noteboxBonuses;
    }

    var Game_Actor_die = Game_Actor.prototype.die;
    Game_Actor.prototype.die = function () {
        Game_Actor_die.call(this);
        this.applyAdeptBonuses();
        this.applyMasteryBonuses();
    };

    Game_Actor.prototype.applyAdeptBonuses = function () {
        this._adeptBonus.forEach(state => {
            if (this._states.indexOf(state) < 0) {
                this._states.push(state);
            }
        });
    }

    Game_Actor.prototype.applyMasteryBonuses = function () {
        this._masteryBonus.forEach(state => {
            if (this._states.indexOf(state) < 0) {
                this._states.push(state);
            }
        });
    }

}())
// Resets JP back to 0 for specified actor
TIKA.resetJP = function (actorId) {
    var actor = $gameActors.actor(actorId);
    var length = Object.keys(actor._jp).length;
    for (var i = 1; i < length; i++) {
        actor._jp[i] = 0;
        actor._jpTotal[i] = 0;
    }
}
