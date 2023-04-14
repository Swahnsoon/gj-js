/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_StopMotion.js
// ============================================================================
/*:
@plugindesc v1.1.0 This plugin was commissioned by Pots Talos. <WAY_StopMotion>

@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
--- Actor, Enemy, State:

<Stop Motion: motion stopFrame>

Example:
*    <Stop Motion: victory 3>

==============================================================================
 ■ Terms of Use
==============================================================================
You can use the plugin in commercial and non-commercial products.           
You must credit me as waynee95.
You cannot sell the plugin.                                                 
You can share the plugin online.                                            ↓
You can edit the plugin, but don't remove this header.

==============================================================================
 ■ Contact Information
==============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261
*/

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (typeof WAY === 'undefined') {
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_StopMotion', '1.1.0', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 2.0.0'
    });
}

(function ($) {
    var getNotetag = WAY.Util.getNotetag;


    function loadNotetags(obj) {
        obj._stopMotion = {};
        getNotetag(obj.note, 'Stop Motion', null, function (str) {
            var _str$trim$split = str.trim().split(' '),
                _str$trim$split2 = _slicedToArray(_str$trim$split, 2),
                motionType = _str$trim$split2[0],
                stopFrame = _str$trim$split2[1];

            var motion = Sprite_Actor.MOTIONS[motionType];
            if (motion) {
                var motionIndex = motion.index;
                obj._stopMotion[motionIndex] = Number(stopFrame);
            }
        });
    }

    WAY.EventEmitter.on('load-actor-notetags', loadNotetags);
    WAY.EventEmitter.on('load-state-notetags', loadNotetags);

    //=============================================================================
    // Game_Battler
    //=============================================================================
    Game_Battler.prototype.motionStopIndex = function (motionIndex) {
        return this.states().filter(function (state) {
            return state._stopMotion;
        }).map(function (state) {
            return state._stopMotion;
        }).reduce(function (acc, val) {
            return Object.assign(acc, val);
        }, {})[motionIndex];
    };

    //=============================================================================
    // Game_Actor
    //=============================================================================
    Game_Actor.prototype.motionStopIndex = function (motionIndex) {
        var stopIndex = Game_Battler.prototype.motionStopIndex.call(this, motionIndex);
        return stopIndex || this.actor()._stopMotion[motionIndex];
    };

    //=============================================================================
    // Sprite_Actor
    //=============================================================================
    $.alias.Sprite_Actor_initMembers = Sprite_Actor.prototype.initMembers;
    Sprite_Actor.prototype.initMembers = function () {
        $.alias.Sprite_Actor_initMembers.call(this);
        this._stopFlag = false;
    };

    $.alias.Sprite_Actor_startMotion = Sprite_Actor.prototype.startMotion;
    Sprite_Actor.prototype.startMotion = function (motionType) {
        var newMotion = Sprite_Actor.MOTIONS[motionType];
        if (this._motion !== newMotion) {
            this._stopFlag = false;
        }
        $.alias.Sprite_Actor_startMotion.call(this, motionType);
    };

    $.alias.Sprite_Actor_updateFrame = Sprite_Actor.prototype.updateFrame;
    Sprite_Actor.prototype.updateFrame = function () {
        if (!this._stopFlag) $.alias.Sprite_Actor_updateFrame.call(this);
        var motionStopIndex = this._actor.motionStopIndex(this._motion.index);
        if (this._pattern === motionStopIndex && !this._stopFlag) {
            var motionIndex = this._motion ? this._motion.index : 0;
            var cw = this._mainSprite.bitmap.width / 9;
            var ch = this._mainSprite.bitmap.height / 6;
            var cx = Math.floor(motionIndex / 6) * 3 + motionStopIndex - 1;
            var cy = motionIndex % 6;
            this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
            this._stopFlag = true;
        }
    };

    if (Imported.YEP_X_AnimatedSVEnemies) {

        WAY.EventEmitter.on('load-enemy-notetags', loadNotetags);

        //=============================================================================
        // Game_Enemy
        //=============================================================================
        Game_Enemy.prototype.motionStopIndex = function (motionIndex) {
            var stopIndex = Game_Battler.prototype.motionStopIndex.call(this, motionIndex);
            return stopIndex || this.enemy()._stopMotion[motionIndex];
        };

        //=============================================================================
        // Sprite_Enemy
        //=============================================================================
        $.alias.Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
        Sprite_Enemy.prototype.initMembers = function () {
            $.alias.Sprite_Enemy_initMembers.call(this);
            this._stopFlag = false;
        };

        $.alias.Sprite_Enemy_startMotion = Sprite_Enemy.prototype.startMotion;
        Sprite_Enemy.prototype.startMotion = function (motionType) {
            if (this._svBattlerEnabled) {
                var newMotion = Sprite_Actor.MOTIONS[motionType];
                if (this._motion !== newMotion) {
                    this._stopFlag = false;
                }
            }
            $.alias.Sprite_Enemy_startMotion.call(this, motionType);
        };

        $.alias.Sprite_Enemy_updateFrame = Sprite_Enemy.prototype.updateFrame;
        Sprite_Enemy.prototype.updateFrame = function () {
            if (this._svBattlerEnabled) {
                if (!this._stopFlag) $.alias.Sprite_Enemy_updateFrame.call(this);
                var motionStopIndex = this._actor.motionStopIndex(this._motion.index);
                if (this._pattern === motionStopIndex && !this._stopFlag) {
                    var motionIndex = this._motion ? this._motion.index : 0;
                    var cw = this._mainSprite.bitmap.width / 9;
                    var ch = this._mainSprite.bitmap.height / 6;
                    var cx = Math.floor(motionIndex / 6) * 3 + motionStopIndex - 1;
                    var cy = motionIndex % 6;
                    this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
                    this._stopFlag = true;
                }
            } else {
                $.alias.Sprite_Enemy_updateFrame.call(this);
            }
        };
    }
})(WAYModuleLoader.getModule('WAY_StopMotion'));