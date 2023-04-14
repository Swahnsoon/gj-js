/*:
 * @plugindesc v0.5 Initiative system.
 * @author TIKA
 *
 * @param ---Log Messages---
 * @default
 * 
 * @param LogMessages
 * @text Log messages?
 * @default true
 * @type boolean
 * @parent ---Log Messages---
 * 
 * @param RollMessage
 * @text Roll message:
 * @default [u]: Initiative -  [r] + [m] = [t].
 * @parent ---Log Messages---
 * 
 * @param ConflictMessage
 * @text Conflict message:
 * @default [e] rolled the same value of [t]. They will roll again:
 * @parent ---Log Messages---
 * 
 * @param ResolveMessage
 * @text Resolve message:
 * @default [u1] will go before [u2].
 * @parent ---Log Messages---
 * 
 * @param EndMessage
 * @text End message:
 * @default [u] with the highest roll of [hr] goes first.
 * @parent ---Log Messages---
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * This system enables you to change CTB order within each round. Each of the
 * entites rolls dices before each round. Order will be determined by the rolls.
 * Entity with highest roll goes first, entity with lowest goes last.
 *
 * There is a parameter 'init' that will affect this roll. The higher it is,
 * bigger chances entity has to go first.
 * 
 * This system allows you to create custom message for each of the action during
 * inititative roll. There are 4 types of messages:
 * 
 * 1. Normal roll message - Message that shows when entity is rolling dices.
 * 2. Roll conflict message - Message when two entites rolled the same number.
 * 3. Conflict resolve message - Message that shows after conflict has been resolved.
 * 4. Ending message - Message at the end of the initiative roll. 
 * 
 * Placeholders in the message:
 * 
 *  During normal roll:
 * 
 *      [hu] - Entity with highest roll at the end of the roll
 *      [hr] - Highest roll at the end of the roll
 *      [r] - Roll result,result of 1d20 
 *      [m] - Roll modifier (init + dexm)
 *      [t] - Total result of a roll: 1d20 + init + dexm
 *      [u] - Name of the entity that is currently rolling
 * 
 *  During the conflict:
 *      [e] - Name of all entities in conflict(rolled the same 1d20)
 *      
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Notetags for states that tick during the initiative roll:
 * 
 * <Initiative>
 * text
 * text
 * </Initiative>
 * 
 * All of the text inside of these notetags will be evaluated. So all
 * scriptcalls wil be working. You are also allowed to use if else statements
 * inside of these notetags. 
 * Also, you can use values as user.name() or user.target().
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version v0.4
 * - Bug fixes
 * 
 * Version v0.4
 * - New initiative roll logic
 * - Bug on escape fixed
 * - Item logs are now logged afther the formula is ran
 * 
 * Version v0.3
 * - Bugfix
 * 
 * Version v0.2
 * - Small bugfixes
 * - <Inititative> notetag for the state
 * 
 * Version v0.1
 * Finished plugin!
 *
 *
 */

var Imported = Imported || {};
Imported.TIKA_Initiative = true;
var TIKA = TIKA || {};


TIKA.version = 0.5;

TIKA.Param = TIKA.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_Initiative');

TIKA.Param.RollMessage = TIKA.Parameters['RollMessage'];
TIKA.Param.ConflictMessage = TIKA.Parameters['ConflictMessage'];
TIKA.Param.ResolveMessage = TIKA.Parameters['ResolveMessage'];
TIKA.Param.EndMessage = TIKA.Parameters['EndMessage'];
TIKA.Param.LogMessages = TIKA.Parameters['LogMessages'];


(function () {

    // ============================================================================
    //                              DataManager
    // ============================================================================

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        this.processStateLogNotetags();

        return true;
    };


    DataManager.processStateLogNotetags = function () {
        for (var i = 1; i < $dataStates.length; i++) {
            if ($dataStates[i].name) {
                $dataStates[i]._initiativeLog = this.processInitiativeLog($dataStates[i]);
            }
        }
    }

    DataManager.processInitiativeLog = function (obj) {
        var initiativeLog = [];
        var evalMode = 'none';
        notedata = this.convertNotedataToArray(obj.note);
        for (var i = 0; i < notedata.length; i++) {
            var line = notedata[i];
            if (line.match(/<Initiative>/i)) {
                evalMode = 'initiative';
            } else if (line.match(/<\/Initiative>/i)) {
                evalMode = 'none';
            } else if (evalMode === 'initiative') {
                initiativeLog.push(line);
            }
        }
        return initiativeLog;
    }

    DataManager.convertNotedataToArray = function (notedata) {
        var comment = '';
        var length = notedata.length;
        for (var i = 0; i < length; ++i) {
            var ev = notedata[i];
            if ([59, 13].contains(ev.charCodeAt(0))) {
                comment += notedata[i] + '\n';
            } else
                comment += notedata[i];
        }
        return comment.split(/[\r\n]+/);
    };

    // ============================================================================
    //                          BattleManager
    // ============================================================================

    var BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        var battlers = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
        battlers = this.initiativeRoll(battlers);
        this.determineOrderOfBattlers(battlers);
        this.ctbTurnOrder();
        BattleManager_startBattle.call(this);
    };

    BattleManager.initiativeRoll = function (battlers) {
        for (var i = 0; i < battlers.length; i++) {
            this.doARoll(battlers[i]);
            if (!battlers[i]._originalRoll)
                battlers[i]._originalRoll = battlers[i]._roll;
        }
        this.sortBattlersByRoll(battlers);
        this.determineSameOrder(battlers);
        return battlers;
    };

    BattleManager.sortBattlersByRoll = function (battlers) {
        battlers.sort(function (a, b) {
            if (a._roll < b._roll) return 1;
            if (a._roll > b._roll) return -1;
            return 0;
        });
    };

    BattleManager.determineOrderOfBattlers = function (battlers) {
        battlers.forEach((battler, index) => {
            battler._order = index + 1;
        })
    };

    BattleManager.determineSameOrder = function (battlers) {
        var duplicates = [];
        for (var i = 0; i < battlers.length;) {
            var origin = battlers[i];
            for (var j = i + 1; j < battlers.length; j++) {
                if (origin._roll == battlers[j]._roll) {
                    if (duplicates.indexOf(origin) < 0)
                        duplicates.push(origin);
                    duplicates.push(battlers[j]);
                }
            }
            if (duplicates.length) {
                this.initiativeConflictText(duplicates);
                var conflict = battlers.splice(i, duplicates.length);
                conflict = this.initiativeRoll(conflict);
                battlers.splice(i, 0, ...conflict);
                i += conflict.length
                duplicates = [];
            } else
                i++;

        }

    };

    BattleManager.initiativeConflictText = function (duplicates) {
        if (TIKA.Param.ConflictMessage.indexOf('[e]') >= 0) {
            var names = '';
            var text = TIKA.Param.ConflictMessage;
            for (var i = 0; i < duplicates.length; i++) {
                if (i < duplicates.length - 2)
                    names += duplicates[i].name() + ', ';
                else if (i == duplicates.length - 2)
                    names += duplicates[i].name() + ' ';
                else if (i == duplicates.length - 1)
                    names += 'and ' + duplicates[i].name();
            }
            text = text.replace('[e]', names);
            text = text.replace('[t]', duplicates[0]._roll);
        }
        if (TIKA.Param.LogMessages == 'true')
            this._logWindow.addText(text);
    }

    BattleManager.doARoll = function (battler) {
        var roll = this.dieRoll(1, 20);
        var init = battler.init || 0;
        var dexm = battler.dexm || 0;
        var modifier = init + dexm;
        battler._roll = roll + modifier;
        var text = TIKA.Param.RollMessage.replace('[u]', battler.name());
        text = text.replace('[r]', roll);
        text = text.replace('[m]', modifier);
        text = text.replace('[t]', battler._roll);
        if (TIKA.Param.LogMessages == 'true')
            this._logWindow.addText(text);
    };

    BattleManager.dieRoll = function (min, max, modifier = 0) {
        return Math.floor(min + Math.random() * max) + modifier;
    }

    BattleManager.findHighestRoll = function (battlers) {
        var highestRoll = battlers[0];
        for (var i = 0; i < battlers.length; i++)
            if (battlers[i]._order > highestRoll._order)
                highestRoll = battlers[i];

        return highestRoll;
    }


    var BattleManage_endCTBAction = BattleManager.endCTBAction;
    BattleManager.endCTBAction = function () {
        BattleManage_endCTBAction.call(this);
        this._subject.endOfTheRow();
        if (this.isRoundOver()) {
            var battlers = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
            this.endOfTurnRegen(battlers);
            this.initiativeRoll(battlers);
            this.determineOrderOfBattlers(battlers);
            this._inititativeConditionals = [true];
            this._blockStarted = false;
            this.updateAffectedStates();
        }
        this.stopAllSelection();
    };

    BattleManager.updateAffectedStates = function () {
        var battlers = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
        for (var i = 0; i < battlers.length; i++) {
            battlers[i].updateStateTurns();
        }
    }

    BattleManager.endOfTurnRegen = function (battlers) {
        for (var i = 0; i < battlers.length; i++) {
            var valueHp = battlers[i].hreg;
            var valueMp = battlers[i].mreg;
            var valueTp = battlers[i].areg;
            battlers[i].gainHp(valueHp);
            battlers[i].gainMp(valueMp);
            battlers[i].gainTp(valueTp);
        }
    }


    BattleManager.initiativeStateLogEval = function (line, target) {
        var length = this._inititativeConditionals.length;
        var previousCondition = this._inititativeConditionals[length - 1];
        var v = $gameVariables._data;
        if (line.match(/IF[ ](.*)/i)) {
            var text = String(RegExp.$1);
            try {
                var evaluated = eval(text);
                this._inititativeConditionals.push(evaluated);
                this._blockStarted = evaluated;
            } catch (e) {
                this._inititativeConditionals.push(false);
                this._blockStarted = false;
            }
        } else if (line.match(/ELSE[ ]IF[ ](.*)/i)) {
            if (previousCondition) {
                this._inititativeConditionals.push(false);
                return false;
            }
            var text = String(RegExp.$1);
            try {
                var evaluated = eval(text);
                this._inititativeConditionals.push(evaluated);
                this._blockStarted = eval(evaluated);
            } catch (e) {
                this._blockStarted = false;
                this._inititativeConditionals.push(false);
            }
        } else if (line.match(/(\b(ELSE)\b)/i) && line.trim().length < 5) {
            if (this._blockStarted) {
                this._inititativeConditionals.push(false);
                return false;
            }
            this._inititativeConditionals.push(true);
        } else if (line.match(/END(.*)/i) && line.trim().length < 4) {
            this._inititativeConditionals.push(true);
            this._blockStarted = false;
        } else {
            if (previousCondition)
                try {
                    eval(line);
                } catch (e) {
                }
        }
    };

    BattleManager.isRoundOver = function () {
        var battlers = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
        for (var i = 0; i < battlers.length; i++) {
            if (battlers[i]._order < 999)
                return false;
        }
        this.clearOriginalRoll(battlers);
        return true;
    };

    BattleManager.clearOriginalRoll = function (battlers) {
        for (var i = 0; i < battlers.length; i++) {
            battlers[i]._originalRoll = 0;
        }
    };


    BattleManager.ctbTurnOrder = function () {
        var battlers = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
        battlers.sort(function (a, b) {
            if (a._order < b._order) return -1;
            if (a._order > b._order) return 1;
            return 0;
        });
        this.redrawCTBIcons();
        return battlers;
    };

    BattleManager.processEscape = function () {
        $gameParty.performEscape();
        SoundManager.playEscape();
        var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
        if ($gamePlayer.isDebugThrough()) success = true;
        if (success) {
            $gameParty.performEscapeSuccess();
            this.displayEscapeSuccessMessage();
            this._escaped = true;
            this.processAbort();
        } else {
            this.displayEscapeFailureMessage();
            this._escapeRatio += this._escapeFailBoost;
            $gameParty.clearActions();
            this._subject.endOfTheRow();
            this.startTurn();
        }
        return success;
    };

    // ============================================================================
    //                          Game_BattlerBase
    // ============================================================================

    Game_BattlerBase.prototype.updateStateTurnTiming = function (timing) {
        if (this.isBypassUpdateTurns()) return;
        var statesRemoved = [];
        this._freeStateTurn = this._freeStateTurn || [];
        for (var i = 0; i < this._states.length; ++i) {
            var stateId = this._states[i];
            var state = $dataStates[stateId];
            if (!state) continue;
            if (state.autoRemovalTiming !== timing) continue;
            if (!this._stateTurns[stateId]) continue;
            if (timing == 2)
                this.logStateMessages(this, state);
            if (this._freeStateTurn.contains(stateId)) {
                var index = this._freeStateTurn.indexOf(stateId);
                this._freeStateTurn.splice(index, 1);
            } else {
                this._stateTurns[stateId] -= 1;
            }
            if (this._stateTurns[stateId] <= 0) statesRemoved.push(stateId);
        }
        for (var i = 0; i < statesRemoved.length; ++i) {
            var stateId = statesRemoved[i];
            this.removeState(stateId);
        }
    };

    Game_BattlerBase.prototype.logStateMessages = function (target, state) {
        if (!state) return;
        if (!state._initiativeLog) return;
        for (var i = 0; i < state._initiativeLog.length; i++) {
            if (state._initiativeLog[i])
                BattleManager.initiativeStateLogEval(state._initiativeLog[i], target);
        }
    };

    // ============================================================================
    //                          Game_Battler
    // ============================================================================

    Game_Battler.prototype.updateCTBStates = function () {
        for (var i = 0; i < this._states.length; ++i) {
            var stateId = this._states[i];
            var state = $dataStates[stateId];
            if (!state) continue;
            if (!this._stateTurns[stateId]) continue;
            if (state.autoRemovalTiming !== 0) {
                this._stateTurns[stateId] = this._stateTurns[stateId] - 1;
                if (this._stateTurns[stateId] <= 0) this.removeState(stateId);
            }
        }
    };

    Game_Battler.prototype.updateCTB = function () {
        if (this.isDead()) return this.resetAllCTB();
        if (!this.canMove()) {
            this.endOfTheRow();
            this.resetAllCTB();
            return;
        }
        if (this.isCTBCharging()) {
            if (!this.currentAction()) this.resetAllCTB();
            if (this.currentAction() && this.currentAction().item() === null) {
                this.resetAllCTB();
            }
        }
        if (this.isCTBCharging()) {
            var value = this.ctbCharge() + this.ctbSpeedTick();
            this.setCTBCharge(value);
        } else if (this.ctbRate() < 1) {
            var value = this.ctbSpeed() + this.ctbSpeedTick();
            this.setCTBSpeed(value);
        }
    };

    Game_Battler.prototype.ctbAlterTurnOrder = function (value) {
        return; // Disabling the functionality of this function
    };

    Game_Battler.prototype.endOfTheRow = function () {
        this._order = 999 + this._order;
        this._originalRoll = '-';
    }

    var Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function () {
        Game_Battler_onBattleEnd.call(this);
        this._originalRoll = 0;
    };

    Game_BattlerBase.prototype.updateStateTicks = function () {
        return; // Disabling the functionality of this function
    };

    //@[ALIAS]
    var _alias_Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function (actorId) {
        var flagAdded = true;
        if(this._actors.contains(actorId)) {
            flagAdded = false;
        }
        _alias_Game_Party_addActor.call(this, actorId);
        if(flagAdded == true) {
            flagAdded = this._actors.contains(actorId);
            if(flagAdded == true) {
                if(SceneManager._scene instanceof Scene_Battle) {
                    setTimeout(() => {
                        try {
                            var battlers = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
                            battlers = BattleManager.initiativeRoll(battlers);
                            BattleManager.determineOrderOfBattlers(battlers);
                            BattleManager.ctbTurnOrder();
                        } catch (e) {
                            console.warn(e);
                        }
                    }, 100);
                }
            }
        }
    };

})();