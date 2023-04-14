/*:
 * @plugindesc Ability to defend or protect a member for an incoming damage (Phys / Mag).
 * @author 

 * 
 * @param Defend State Remove
 * @desc If defender leaves party, remove Defend state from protected party member Default: false
 * @default false
 * 

 * @help
 
 This plugin does not have any plugin commands.

 Requires: YEP_BattleEngineCore

 Note: One actor should have one defend state (Mag / Phys). The actor can
 protect as many as it wants to.

 Note Tags:

 Skill Notebox:
 <DefendPhysical> 
 the current state target would be protected from any physical based attack
 <DefendMagical>
 the current state target would be protected from any magical based attack
 <DisallowDefendAOE>
 the current state target would be protected from any Area of Effect based attack



 State Notebox:

 <Defend>
 This will allow the current state afflicted actor to be protected.

 <CannotProtect> 
 this will disallow a battler from protecting an ally. 
 They can still cast the skill, but they can't protect an ally.

 To use this plugin, you will need to create a skill that will inflict
 the state tagged with <Defend> to an ally. This way, the actor afflicted
 would be flagged as an actor that can be defended. 

 Make sure also that the skill is tagged with the proper note box so
 the flagged state afflicted would be given to that actor.


 */

var parameters = PluginManager.parameters('Defend 2.1');

var paramStateRemove = String(parameters['Defend State Remove']);

(function ($) {
    $.prototype.protector = function () {
        return this._protector;
    };

    $.prototype.protectorType = function () {
        return this._protectionType;
    };

    $.prototype.protectorAllowAoe = function () {
        return this._protectionTypeAoe;
    };


    $.prototype.setProtector = function (protector, type, aoe) {
        this._protector = protector;
        this._protectionType = type;
        this._protectionTypeAoe = aoe;
    };

    $.prototype.clearDefendAction = function () {
        this._protector = undefined;
        this._protectionType = undefined;
        this._protectionTypeAoe = undefined;
    };


    var _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
    $.prototype.eraseState = function (stateId) {
        _Game_BattlerBase_eraseState.call(this, stateId);
        var dataState = $dataStates[stateId];
        if (!dataState.meta.Protect) {
            return;
        }
        this.clearDefendAction();
    };    
} )(Game_BattlerBase);

var _Game_Actor_refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function () {
    _Game_Actor_refresh.call(this);
    if (!eval(paramStateRemove)) {
        return;
    }
    var protector = this.protector();
    if (!protector || !protector.isActor()) {
        return;
    }
    var hasState = this.states().some(function (state) {
        return state.meta.Defend;
    });

    if (!hasState) {
        return;
    }

    if (protector.isActor() && $gameParty.battleMembers().indexOf(protector) === -1) {
        var thisActor = this;
        this.states().forEach(function (state) {
            if (state.meta.Defend) {
                thisActor.removeState(state.id);
            }
        });
    }
};

(function ($) {
    var _Game_Action_itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
    $.prototype.itemEffectAddNormalState = function (target, effect) {
        _Game_Action_itemEffectAddNormalState.call(this, target, effect);
        var dataState = $dataStates[effect.dataId];
        if (!dataState.meta.Defend) {
            return;
        }
        var dataSkill = $dataSkills[this.item().id];
        var defendPhysical = dataSkill.meta.DefendPhysical;
        var defendMagical = dataSkill.meta.DefendMagical;
        var shouldProtect = defendPhysical || defendMagical;
        var protectionType;

        if (!shouldProtect) {
            return;
        }

        if (defendPhysical && defendMagical) {
            protectionType = "all";
        } else if (defendPhysical) {
            protectionType = "physical";
        } else {
            protectionType = "magical";
        }

        var aoe = true;
        if (dataSkill.meta.DisallowDefendAOE) {
            aoe = false;
        }

        target.setProtector(this.subject(), protectionType, aoe);
    };    
} ) (Game_Action);



var _BattleManager_applySubstitute = BattleManager.applySubstitute;
BattleManager.applySubstitute = function (target) {
    var protector = target.protector();
    var correctProtectionType = false;

    if (!target || !target.states()) {
        return _BattleManager_applySubstitute.call(this, target);
    }
    var hasState = target.states().some(function (state) {
        return state.meta.Defend;
    });

    if (!hasState) {
        return _BattleManager_applySubstitute.call(this, target);
    }


    if (protector && this._action.isForOpponent()) {
        switch (target.protectorType()) {
            case "physical":
                correctProtectionType = this._action.isPhysical();
                break;
            case "magical":
                correctProtectionType = this._action.isMagical();
                break;
            case "all":
                correctProtectionType = true;
                break;
        }


        var cannotProtectState = protector.states().some(function (state) {
            return state.meta.CannotDefend;
        });
        
        if (cannotProtectState) {
            correctProtectionType = false;
        }

    }

    // test if protector in party
    if (protector && protector.isActor() && $gameParty.battleMembers().indexOf(protector) === -1) {
        correctProtectionType = false;
        if (eval(paramStateRemove)) {
            target.states().forEach(function (state) {
                if (state.meta.Defend) {
                    target.removeState(state.id);
                }
            });
        }
    }

    if (correctProtectionType) {
        if (this._action.isForAll() || (this._action.isForRandom()
                && this._action.numTargets() > 1)) {
            correctProtectionType = target.protectorAllowAoe();
        }
    }

    if (!protector || !protector.isAlive() || !correctProtectionType) {
        return _BattleManager_applySubstitute.call(this, target);
    }

    this._logWindow.displaySubstitute(protector, target);
    return protector;
};

var soulxregalia_GameBattler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    soulxregalia_GameBattler_onBattleStart.call(this);
    this.clearDefendAction();
};