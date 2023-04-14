/*:
 * @plugindesc v2.50 Time Stamp
 * @author TIKA
 * 
 * @param LogOnStateRemove
 * @default Effect of state has expired on actor.
 * 
 * @param LogMessages
 * @text Log messages?
 * @default true
 * @type boolean
 *
 *  @help
 * ============================================================================
 * Description
 * ============================================================================
 * 
 *  Plugin that allows for setting of multiple ooldown periods on any event 
 *  as well as reseting any and all set cooldowns for any map. 
 * 
 *  When the setCooldown script call is attached to an event, it timestamps 
 *  the said event automatically and every time a player tries to interact 
 *  with the event the plugin checks whether the cooldown period for said event 
 *  has expired. 
 * 
 *  If it has, the player can interact with the event again. 
 * 
 *  If it has not, the player can't interact with the event. 
 * 
 *  When the resetCooldowns script call is called, it resets all the 
 *  previously set cooldowns for a map on which it is called.  
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 * 
 * Available in this plugin is a notetag for states. What this notetag does is 
 * sets how long will the state remain on an actor. 
 * 
 * <TimeStamp: D,H>
 *  D -> Represents duration in days
 *  H -> Represents duration in hours
 * 
 * This duration will also be affected by the user level. The higher lever,
 * the longer the state remains active on the target.
 * 
 * ============================================================================
 * Script calls
 * ============================================================================
 *
 * This plugin has two different script calls: 
 * 
 * TIKA.Timestamp.setCooldown
 * TIKA.Timestamp.resetCooldowns
 * 
 * ============================================================================
 * TIKA.Timestamp.setCooldown script call
 * ============================================================================
 * 
 * TIKA.Timestamp.setCooldown(days cooldown, hours cooldown, event type, interpreter)
 * 
 * where: 
 * 
 * days cooldown 
 * represents the number of days before an event can be re-activated
 * 
 * hours cooldown
 * represents the number of hours before an event can be re-activated
 * 
 * event type
 * represents the type/name of the event
 * 
 * interpreter 
 * game object that contains all the data necessary for the plugin to function. 
 * 
 * ============================================================================
 * TIKA.Timestamp.setCooldown script call example
 * ============================================================================
 * 
 * If we wanted to allow a certain event (steal) to run every 3 days and 14 hours: 
 * 
 * TIKA.Timestamp.setCooldown(3, 14, "steal", this)
 * 
 * ============================================================================
 * TIKA.Timestamp.resetCooldowns script call
 * ============================================================================
 * 
 * TIKA.Timestamp.resetCooldowns()
 * 
 * This script call takes no parameters. 
 * 
 * When called, it will reset all cooldowns for the map on which it is called. 
 * 
 * ============================================================================
 * TIKA.Timestamp.stateAutoRemoval script call
 * ============================================================================
 * TIKA.Timestamp.stateAutoRemoval();
 * 
 * This script call takes no parameters. 
 * 
 * When called, it will check if there are states on the party members whose
 * duration time has expired, and if so, states will be removed.
 * 
 * This scriptcall woul be a good combination with the parallel common event,
 * so that it runs in the background and always checks if some states have
 * expired. 
 * 
 * ============================================================================
 * Logging
 * ============================================================================
 * I have also added a feature for you to log the state removal in the overworls
 * log window.
 * 
 * Default log message has 2 placeholders. One for the actor name, and the other
 * for the state name.
 * 
 *  - state represents state name
 *  - actor represents actor name
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version v1.00
 * Plugin ready for testing and feedback. 
 *
 * Version 2.00
 * New implementation, one script call to rule them all.
 * 
 * Version 2.10
 * Added the type parameter to the script call
 * 
 * Version 2.20
 * Added the resetCooldowns script call
 * 
 * Version 2.30
 * Cooldown expiration bug fixed
 * 
 * Version 2.40
 * Added state duration functionality
 * 
 * Version 2.50
 * Added state removal log message
 */

var TIKA = TIKA || {};
TIKA.Timestamp = TIKA.Timestamp || {};
TIKA.Timestamp.setCooldown;
TIKA.Timestamp.resetCooldowns;

TIKA.Param = TIKA.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_TimeStamp');

TIKA.Param.StateRemovelLog = TIKA.Parameters['LogOnStateRemove'];
TIKA.Timestamp.LogMessages = TIKA.Parameters['LogMessages'];

(function () {

    // ============================================================================
    //                          DataManager
    // ============================================================================


    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        this.processStateCooldownNotetags();

        return true;
    };


    DataManager.processStateCooldownNotetags = function () {
        for (var i = 1; i < $dataStates.length; i++) {
            this.procesStateCooldown($dataStates[i]);
        }
    }

    DataManager.procesStateCooldown = function (obj) {
        var cooldown = {};
        var meta = obj.meta;
        if (!meta || !meta.TimeStamp) return cooldown;
        var timestamp = meta.TimeStamp.split(',');
        cooldown.daysCooldown = Number(timestamp[0]);
        cooldown.hoursCooldown = Number(timestamp[1]);
        obj._timeout = cooldown;
    }

    // ============================================================================
    //                       Game_Battler
    // ============================================================================

    var Game_BattlerBase_initialize = Game_BattlerBase.prototype.initialize;
    Game_BattlerBase.prototype.initialize = function () {
        Game_BattlerBase_initialize.call(this);
        this._statesOnCooldown = [];
    };

    var Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        Game_Battler_addState.call(this, stateId);
        this.setStateTimeout(stateId);
    };

    Game_BattlerBase.prototype.setStateTimeout = function (stateId, user) {
        var state = $dataStates[stateId];
        if (!state._timeout) return;
        if (this._statesOnCooldown.find(state => state.id == stateId))
            this._statesOnCooldown.splice(this._statesOnCooldown.indexOf(state), 1);
        var level = 1;
        if (user && user._level)
            level = user._level;
        var timestamp = getCurrentTimestamp();
        var timeout = {};
        timeout.daysCooldown = state._timeout.daysCooldown;
        timeout.hoursCooldown = state._timeout.hoursCooldown;
        var cooldown = calculateCooldown(timestamp, timeout);
        state._cooldown = cooldown;
        this._statesOnCooldown.push(state);
    }

    Game_BattlerBase.prototype.logStateRemoved = function (state) {
        if (TIKA.Timestamp.LogMessages != 'true') return;
        var text = TIKA.Param.StateRemovelLog;
        text = text.replace('state', state.name);
        text = text.replace('actor', this.name());
        TIKA.Logger.log(text);
    }

    TIKA.Timestamp.stateAutoRemoval = function () {
        $gameParty.members().forEach(member => {
            var states = member._statesOnCooldown;
            states.forEach((state, index) => {
                if (hasCooldownExpired(state._cooldown)) {
                    member.removeState(state.id);
                    states.splice(index, 1);
                    member.logStateRemoved(state);
                }
            })
        })
    }

    // ============================================================================
    //                          Game_Action
    // ============================================================================

    var Game_Action_itemEffectAddAttackState = Game_Action.prototype.itemEffectAddAttackState;
    Game_Action.prototype.itemEffectAddAttackState = function (target, effect) {
        Game_Action_itemEffectAddAttackState.call(this, target, effect);
        var stateId = effect.dataId;
        target.setStateTimeout(stateId, this.subject());
    };

    var Game_Action_itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
    Game_Action.prototype.itemEffectAddNormalState = function (target, effect) {
        Game_Action_itemEffectAddNormalState.call(this, target, effect);
        var stateId = effect.dataId;
        target.setStateTimeout(stateId, this.subject());
    };

    // ============================================================================
    //                       Script calls
    // ============================================================================

    TIKA.Timestamp.setCooldown = function (daysCooldown, hoursCooldown, type, interpreter) {

        var timestamp = getCurrentTimestamp();
        var event = createEvent($gameMap._mapId, interpreter._eventId, daysCooldown, hoursCooldown, type);
        var cooldown = calculateCooldown(timestamp, event);

        if (isCooldownStored(cooldown)) {

            var storedCooldown = findCooldown(cooldown.mapId, cooldown.eventId, cooldown.type);

            if (hasCooldownExpired(storedCooldown)) {

                // if the cooldown times have expired, update them with new ones
                storedCooldown.daysTotal = cooldown.daysTotal;
                storedCooldown.hours = cooldown.hours;
                storedCooldown.days = cooldown.days;
                storedCooldown.month = cooldown.month;
                storedCooldown.year = cooldown.year;

                return true;

            } else {
                return false;
            }

        } else {
            storeCooldown(cooldown);
            return true;
        }

    }

    TIKA.Timestamp.hasCooldownExpired = function (type, interpreter, mapId, eventId) {

        var storedCooldown = findCooldown(mapId || $gameMap._mapId, eventId || interpreter._eventId, type);

        if (!storedCooldown || hasCooldownExpired(storedCooldown)) {
            return true;
        } else {
            return false;
        }
    }

    TIKA.Timestamp.resetCooldowns = function resetCooldowns() {

        var mapId = $gameMap._mapId;
        var arrayLength = $gameSystem._timestampedCooldowns.length;

        for (var i = 0; i <= arrayLength; i++) {

            var cooldown = findCooldownByMapId(mapId);

            if (cooldown) {
                removeCooldown(cooldown);
            }

        }

    }

    // ============================================================================
    //                       Game_System
    // ============================================================================

    var Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        Game_System_initialize.call(this);

        this._timestampedCooldowns = [];

    };

    // ============================================================================
    //                       Utility functions
    // ============================================================================

    function getCurrentTimestamp() {

        var daysTotal = (($gameSystem.month() - 1) * 30) + $gameSystem.day();

        var timestamp = {
            minutes: $gameSystem.minute(),
            hours: $gameSystem.hour(),
            days: $gameSystem.day(),
            daysTotal: daysTotal,
            month: $gameSystem.month(),
            year: $gameSystem.year()
        };

        return timestamp;
    }

    function createEvent(mapId, eventId, daysCooldown, hoursCooldown, type) {

        var event = {
            mapId: mapId,
            eventId: eventId,
            daysCooldown: daysCooldown,
            hoursCooldown: hoursCooldown,
            type: type
        };

        return event;
    }

    function findCooldown(mapId, eventId, type) {

        var cooldown = $gameSystem._timestampedCooldowns.find(function (element) {
            return (element.mapId == mapId && element.eventId == eventId && element.type == type);
        });

        return cooldown;
    }

    function findCooldownByMapId(mapId) {

        var cooldown = $gameSystem._timestampedCooldowns.find(function (element) {
            return (element.mapId == mapId);
        });

        return cooldown;
    }

    function removeCooldown(cooldown) {

        var foundCooldown = findCooldownByMapId(cooldown.mapId);

        if (foundCooldown) {

            var indexToBeRemoved = $gameSystem._timestampedCooldowns.indexOf(foundCooldown);

            if (indexToBeRemoved > -1) {
                $gameSystem._timestampedCooldowns.splice(indexToBeRemoved, 1);
            }

        }

    }

    function isCooldownStored(cooldown) {

        var foundCooldown = findCooldown(cooldown.mapId, cooldown.eventId, cooldown.type);

        if (foundCooldown) {
            return true;
        } else {
            return false;
        }

    }

    function hasCooldownExpired(cooldown) {
        var timestamp = getCurrentTimestamp();

        if (timestamp.year != cooldown.year) {
            timestamp.daysTotal += (12 * 30);
        }

        if ((timestamp.daysTotal >= cooldown.daysTotal) && (timestamp.hours >= cooldown.hours)) {
            if (timestamp.minutes >= 0 && cooldown.minutes >= 0) {
                if (timestamp.minutes > cooldown.minutes) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        } else if (timestamp.daysTotal > cooldown.daysTotal) {
            return true;
        } else if (timestamp.hours != cooldown.hours) {

            if (timestamp.daysTotal > cooldown.daysTotal) {
                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }
    }

    function calculateCooldown(timestamp, event) {

        var cooldownDays = timestamp.days + Number(event.daysCooldown);
        var cooldownHours = timestamp.hours + Number(event.hoursCooldown);
        var cooldownMinutes = timestamp.minutes;


        if (cooldownDays > 30) {
            cooldownDays -= 30;
            timestamp.month += 1;
        }

        if (cooldownHours >= 24) {
            cooldownHours -= 24;
            cooldownDays++;
        }

        var daysTotal = ((timestamp.month - 1) * 30) + cooldownDays;

        var cooldown = {
            minutes: cooldownMinutes,
            hours: cooldownHours,
            days: cooldownDays,
            daysTotal: daysTotal,
            month: timestamp.month,
            year: timestamp.year,
            eventId: Number(event.eventId),
            mapId: Number(event.mapId),
            type: String(event.type)
        };

        return cooldown;

    }

    function storeCooldown(cooldown) {
        $gameSystem._timestampedCooldowns.push(cooldown);
    }

})();