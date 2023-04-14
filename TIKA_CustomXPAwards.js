/*:
 * @plugindesc v1.1 Custom xp awards for the player
 * @author TIKA
 *
 * @param PlayerXPVariable
 * @desc Game variable in which players xp is stored.
 * @default 18
 * 
 * @param ActorGPUP
 * @desc Actor parameter gpup id.
 * @default 44
 * 
 * @param ActorXPUP
 * @desc Actor parameter xpup id.
 * @default 45
 * 
 * @param ActorJPUP
 * @desc Actor parameter jpup id.
 * @default 45
 * 
 * @param Exp X
 * @desc X coordinate for exp gained
 * @default 220
 * 
 * @param Exp Y
 * @desc Y coordinate for exp gained
 * @default 200
 * 
 * @param JP X
 * @desc X coordinate for JP gained
 * @default 220
 * 
 * @param JP Y
 * @desc Y coordinate for JP gained
 * @default 240
 * 
 * @param Gold X
 * @desc X coordinate for gold gained
 * @default 220
 * 
 * @param Gold Y
 * @desc Y coordinate for gold gained
 * @default 280
 * 
 * @param Loot X
 * @desc X coordinate for loot
 * @default 0
 * 
 * @param Loot Y
 * @desc Y coordinate for loot
 * @default 430
 * 
 * @param Debug
 * @desc Debug Mode
 * @type boolean
 * @default false
 * 
 * @param ExpAwards
 * @text Exp awards per level
 * @type struct<ExpAward>[]
 * 
 * 
 * @help
 * ============================================================================
 * Description 
 * ============================================================================
 * Custom status menu.
 *
 * ============================================================================
 * How to use 
 * ============================================================================
 * Assign notetag to the enemy notebox with the amount of XP awarded by that 
 * enemy, and that is it.
 * 
 * Notetag example:
 * <Exp: 12>
 * 
 * Enemy with this notetag will award 12 exp, to the player, after it's defeated.
 * 
 * <Exp: 7 - 13>
 * 
 * Enemy with this notetag will award amount of exp between 7 and 13, 
 * to the player, after it's defeated.
 * 
 * Adding notetag to the state:
 * <XP RATE: #%>
 * If the actor is affected by that state, bonus XP will be granted to the actor.
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Timestamp: 27.03.2020 16:03 -  Added check for 0 on line 309 to show when XP is 0
 * 
 * Version v1.00
 * Finished plugin!
 *
 *
 */
/*~struct~ExpAward:
*
* @param BaseExp
* @desc Exp awarded to level 1 actor
* @type number
*
* @param ExpDegradation
* @desc Exp degradation with each level of actor
* @type number
*/

var Imported = Imported || {};
Imported.TIKA_CustomXPAwards = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.Param = TIKA.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_CustomXPAwards');

TIKA.Param.playerXpVar = Number(TIKA.Parameters['PlayerXPVariable']);
TIKA.Param.ActorGPUP = Number(TIKA.Parameters['ActorGPUP']);
TIKA.Param.ActorXPUP = Number(TIKA.Parameters['ActorXPUP']);
TIKA.Param.ActorJPUP = Number(TIKA.Parameters['ActorJPUP']);
TIKA.Param.battleResultExpX = Number(TIKA.Parameters['Exp X']);
TIKA.Param.battleResultExpY = Number(TIKA.Parameters['Exp Y']);
TIKA.Param.battleResultJpX = Number(TIKA.Parameters['JP X']);
TIKA.Param.battleResultJpY = Number(TIKA.Parameters['JP Y']);
TIKA.Param.battleResultGoldX = Number(TIKA.Parameters['Gold X']);
TIKA.Param.battleResultGoldY = Number(TIKA.Parameters['Gold Y']);
TIKA.Param.battleResultLootX = Number(TIKA.Parameters['Loot X']);
TIKA.Param.battleResultLootY = Number(TIKA.Parameters['Loot Y']);
TIKA.Param.debug = TIKA.Parameters['Debug'] == 'true';

TIKA.Param.ExpAwards = JSON.parse(TIKA.Parameters['ExpAwards']);
for (var i = 0; i < 10; i++) {
    TIKA.Param.ExpAwards[i] = JSON.parse(TIKA.Param.ExpAwards[i]);
    TIKA.Param.ExpAwards[i].BaseExp = Number(TIKA.Param.ExpAwards[i].BaseExp);
    TIKA.Param.ExpAwards[i].ExpDegradation = Number(TIKA.Param.ExpAwards[i].ExpDegradation);

}
TIKA.Param.ExpAwards.unshift(null);
(function () {

    // ============================================================================
    //                              DataManager
    // ============================================================================

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;
        this.processXPNotetags1($dataActors);
        this.processXPNotetags2($dataClasses);
        this.processXPNotetags2($dataWeapons);
        this.processXPNotetags2($dataArmors);
        this.processXPNotetags2($dataStates);


        return true;
    };

    DataManager.processXPNotetags1 = function (group) {
        var note1 = /<(?:XP RATE):[ ](\d+)([%％])>/i;
        var note2 = /<(?:GOLD RATE):[ ](\d+)([%％])>/i;
        for (var n = 1; n < group.length; n++) {
            var obj = group[n];
            var notedata = obj.note.split(/[\r\n]+/);

            obj.xpRate = 1.0;
            obj.goldRate = 1.0;

            for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];
                if (line.match(note1)) {
                    obj.xpRate = parseFloat(RegExp.$1 * 0.01);
                } else if (line.match(note2)) {
                    obj.goldRate = parseFloat(RegExp.$1 * 0.01);

                }
            }
        }
    };

    DataManager.processXPNotetags2 = function (group) {
        var note1 = /<(?:XP RATE):[ ](-?\d+)([%％])>/i;
        var note2 = /<(?:GOLD RATE):[ ](-?\d+)([%％])>/i;
        for (var n = 1; n < group.length; n++) {
            var obj = group[n];
            var notedata = obj.note.split(/[\r\n]+/);

            obj.xpRate = 1.0;
            obj.goldRate = 1.0;
            for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];

                if (line.match(note1)) {
                    obj.xpRate = parseFloat(RegExp.$1 * 0.01);
                } else if (line.match(note2)) {
                    obj.goldRate = parseFloat(RegExp.$1 * 0.01);
                }
            }
        }
    };


    // ============================================================================
    //                              BattleManager
    // ============================================================================

    var BattleManager_getResultData = BattleManager.getResultData;
    BattleManager.getResultData = function () {
        BattleManager_getResultData.call(this);
        $gameTemp._bResult[5] = this._rewards.jp;
    };

    // ============================================================================
    //                              Game_Enemy
    // ============================================================================

    var Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function (enemyId, x, y) {
        Game_Enemy_setup.call(this, enemyId, x, y);
        this.processXpNotetags(enemyId);
    };

    Game_Enemy.prototype.processXpNotetags = function (enemyId) {
        var enemies = $dataEnemies;
        var xpNotetag = enemies[enemyId].meta['Exp'];
        if (xpNotetag) {
            var xp = xpNotetag.split('-');
            if (xp) {
                if (xp.length == 2) {
                    var min = Number(xp[0]);
                    var max = Number(xp[1]);
                    this._xpAward = Math.round(min + Math.random() * (max - min));
                } else if (xp.length == 1) {
                    var value = Number(xp[0]);
                    this._xpAward = value;
                }
            }
        }

    }

    var Game_Enemy_exp = Game_Enemy.prototype.exp;
    Game_Enemy.prototype.exp = function () {
        if (this._xpAward)
            return Math.round(this.calculateXpAward() / $gameParty.members().length);
        else
            return Game_Enemy_exp.call(this);
    };
    //Changes to Level Max Below
    Game_Enemy.prototype.calculateXpAward = function () {
        var xpAward = this._xpAward;
        var baseXpReward = this.calculateBaseXpAward(this._level);
        var actorLevel = $gameParty.player().level;
        var xpDegradation = TIKA.Param.ExpAwards[this._level].ExpDegradation;
        switch (this._level) {
            case 1: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 2: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 3: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 4: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 5: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 6: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 7: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 8: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 9: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 10: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 11: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
            case 12: return baseXpReward - xpDegradation * (Math.max(actorLevel - 3, 0));
        }
    }

    Game_Enemy.prototype.calculateBaseXpAward = function (level) {
        return TIKA.Param.ExpAwards[level].BaseExp;
    }


    // ============================================================================
    //                              BattleResult
    // ============================================================================
    var BattleResult_createObjects = BattleResult.prototype.createObjects;
    BattleResult.prototype.createObjects = function () {
        BattleResult_createObjects.call(this);
        this.createJp();
    };

    BattleResult.prototype.gainEXP = function () {
        var actor = $gameParty.battleMembers()[this._actorIndex];
        if (actor.actor()._title != 'Player') return;
        $gameTemp._bResult[1] = $gameTemp._bResult[1] * actor.xpRate() + actor.NParam(TIKA.Param.ActorXPUP) + $gameParty.player().wism;
        this._actopar = [actor._level, actor.mhp, actor.mmp, actor.atk, actor.def, actor.mat, actor.mdf, actor.agi, actor.luk];
        var lvOld = actor._level;
        $gameVariables.setValue(TIKA.Param.playerXpVar, $gameVariables.value(TIKA.Param.playerXpVar) + $gameTemp._bResult[1]);
        this._actorIndex += 1;
        if (actor._level > lvOld) {
            this._actor = actor;
            this.createLevelSprites();
            SoundManager.playCursor();
        } else {
            this.clearParData();
        };
    };

    BattleResult.prototype.updateExp = function () {
        var actor = $gameParty.battleMembers()[this._actorIndex];
        var xp = Math.floor($gameTemp._bResult[1] * actor.xpRate() + actor.NParam(TIKA.Param.ActorXPUP) + $gameParty.player().wism);
        if (this.pressAnyKey() && $gameTemp._bResult[1] > 0) {
            this._expOld = xp - 1;
        };

        var dif_number = this.update_dif(this._expOld, xp, 15);
        if (this._expOld != dif_number || this._expOld == 0) {
            this._expOld = dif_number;
            this.refresh_number(this._expNumber, this._expOld, this._numbeData, this._expOrg[0], 0)
        };
        //Gets stuck here
        if (this._expOld === xp) {
            this.phaseAniClear();
            this._phase = 2;
            SoundManager.playCursor();
        };
    };

    BattleResult.prototype.updateJp = function () {
        var actor = $gameParty.battleMembers()[this._actorIndex];
        var jp = $gameTemp._bResult[5] * actor.jpRate() + actor.NParam(TIKA.Param.ActorJPUP) + $gameParty.player().intm;
        if (this.pressAnyKey() && $gameTemp._bResult[1] > 0) {
            this._jpOld = jp - 1;
        };
        var dif_number = this.update_dif(this._jpOld, jp, 15);
        if (this._jpOld != dif_number) {
            this._jpOld = dif_number;
            this.refresh_number(this._jpNumber, this._jpOld, this._numbeData, this._goldOrg[0], 0)
        };
        if (this._jpOld === jp) {
            this.phaseAniClear();
            this._phase = 3;
            SoundManager.playCursor();
        };
    };

    BattleResult.prototype.createExp = function () {
        this._expNumber = [];
        this._expOld = 0;
        this._expOrg = [TIKA.Param.battleResultExpX, TIKA.Param.battleResultExpY];
        for (var i = 0; i < 8; i++) {
            this._expNumber[i] = new Sprite(this._number_img1);
            this._expNumber[i].visible = false;
            this._expNumber[i].x = this._expOrg[0];
            this._expNumber[i].y = this._expOrg[1];
            this.addChild(this._expNumber[i]);
        };
    };

    BattleResult.prototype.createGold = function () {
        this._goldNumber = [];
        this._goldNumber = [];
        this._goldOld = 0;
        this._goldOrg = [TIKA.Param.battleResultGoldX, TIKA.Param.battleResultGoldY];
        for (var i = 0; i < 8; i++) {
            this._goldNumber[i] = new Sprite(this._number_img1);
            this._goldNumber[i].visible = false;
            this._goldNumber[i].x = this._goldOrg[0];
            this._goldNumber[i].y = this._goldOrg[1];
            this.addChild(this._goldNumber[i]);
        };
    };

    BattleResult.prototype.createJp = function () {
        this._jpNumber = [];
        this._jpNumber = [];
        this._jpOld = 0;
        this._jpOrg = [TIKA.Param.battleResultJpX, TIKA.Param.battleResultJpY];
        for (var i = 0; i < 8; i++) {
            this._jpNumber[i] = new Sprite(this._number_img1);
            this._jpNumber[i].visible = false;
            this._jpNumber[i].x = this._jpOrg[0];
            this._jpNumber[i].y = this._jpOrg[1];
            this.addChild(this._jpNumber[i]);
        };
    };

    BattleResult.prototype.createTreasures = function () {
        this._treasures = [];
        var x = TIKA.Param.battleResultLootX;
        var y = TIKA.Param.battleResultLootY;
        var s = Graphics.boxWidth - 64;
        var w = (s / 6);
        var h = Window_Base._iconHeight / 2;
        var icoWidth = Window_Base._iconWidth;
        for (var i = 0; i < $gameTemp._bResult[3].length; i++) {
            this._treasures[i] = new Sprite();
            this._treasures[i].opacity = 0;
            this._treasures[i].height = 200;
            this._treasures[i].width = 200;
            if (i % 2 == 0) {
                this._treasures[i].x = x + icoWidth;
                this._treasures[i].y = y + i * h;
            } else {
                this._treasures[i].x = x + w + icoWidth;
                this._treasures[i].y = y + (i - 1) * h;
            }
            this.addIcon(this._treasures[i], $gameTemp._bResult[3][i]);
            this.addChild(this._treasures[i]);
        };
    };

    //==============================
    // * Update Gold
    //==============================
    BattleResult.prototype.updateGold = function () {
        var actor = $gameParty.battleMembers()[this._actorIndex];
        var gold = $gameTemp._bResult[2] * $gameParty.goldRate() + actor.NParam(44);
        if (this.pressAnyKey() && gold > 0) {
            this._goldOld = gold - 1;
        };
        var dif_number = this.update_dif(this._goldOld, gold, 15);
        if (this._goldOld != dif_number) {
            this._goldOld = dif_number;
            this.refresh_number(this._goldNumber, this._goldOld, this._numbeData, this._goldOrg[0], 0)
        };
        if (this._goldOld === gold) {
            BattleManager.gainGold();
            this.phaseAniClear();
            this._phase = 4;
            SoundManager.playCursor();
        };
    };

    //==============================
    // * Update Treasure
    //==============================
    BattleResult.prototype.updateTreasure = function () {
        if (this._treasures.length > 0) {
            for (var i = 0; i < this._treasures.length; i++) {
                this._treasures[i].opacity += 10;
            };
            if (this._treasures[0].opacity >= 255 && this._phaseAnime[0] === 0) {
                this._phaseAnime[0] = 1;
            };
        } else {
            this._phaseAnime[0] = 1;
        };
        if (this._phaseAnime[0] === 1 && this.pressAnyKey()) {
            BattleManager.gainDropItems();
            this.phaseAniClear();
            this._phase = 5;
        };
    };

    //==============================
    // * Update Level
    //==============================
    BattleResult.prototype.updateLevel = function () {
        if (this._layout.opacity > 0) { this.updateFade() };
        if (!this._actor && this._actorIndex >= $gameParty.battleMembers().length) {
            this._phase = 6;
            SoundManager.playCursor();
        } else {
            if (this._actor) {
                this.updateLevelAnimation();
            } else {
                this.gainEXP();
            };
        };
    };

    BattleResult.prototype.update = function () {
        Sprite.prototype.update.call(this);
        if (this._numbeData[0] === -1 && this._number_img1.isReady() && this._number_img2.isReady()) { this.getData() };
        if (this._numbeData[0] === -1) { return };
        if (this._phaseAnime[1] > 0) { this._phaseAnime[1]--; return };
        if (this._playME > 0) { this.updateME() };
        if (TIKA.Param.debug)
            console.log("Phase: ", this._phase);
        switch (this._phase) {
            case 0:
                this.updateStart();
                break;
            case 1:
                this.updateExp();
                break;
            case 2:
                this.updateJp();
                break;
            case 3:
                this.updateGold();
                break;
            case 4:
                this.updateTreasure();
                break;
            case 5:
                this.updateLevel();
                break;
            case 6:
                this.updateEnd();
                break;
        };
    };

    BattleResult.prototype.updateFade = function () {
        this._layout.opacity -= 10;
        for (var i = 0; i < this._expNumber.length; i++) {
            this._expNumber[i].opacity = this._layout.opacity;
        };
        for (var i = 0; i < this._goldNumber.length; i++) {
            this._goldNumber[i].opacity = this._layout.opacity;
        };
        for (var i = 0; i < this._jpNumber.length; i++) {
            this._jpNumber[i].opacity = this._layout.opacity;
        };
        for (var i = 0; i < this._treasures.length; i++) {
            this._treasures[i].opacity = this._layout.opacity;
        };
        if (this._phase === 5 && this._layout.opacity <= 0) {
            $gameTemp._bResult = [false, [], 0, 0, []];
        };
    };

    // ============================================================================
    //                              Game_Actor
    // ============================================================================

    Game_Actor.prototype.xpRate = function () {
        var rate = 1.0;
        rate *= this.actor().xpRate;
        rate *= this.currentClass().xpRate;
        var equips = this.equips();
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item) rate *= item.xpRate;
        }
        var states = this.states();
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            if (state) rate *= state.xpRate;
        }
        return rate;
    };

    Game_Party.prototype.goldRate = function () {
        var rate = 1.0;
        for (var i = 0; i < this._actors.length; i++) {
            var actor = $gameActors.actor(this._actors[i]);
            rate *= actor.actor().goldRate;
            rate *= actor.currentClass().goldRate;
            var equips = actor.equips();
            for (var i = 0; i < equips.length; i++) {
                var item = equips[i];
                if (item) {
                    rate *= item.goldRate;
                }
            }
            var states = actor.states();
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                if (state) {
                    rate *= state.goldRate;
                }
            }
        }
        return rate;
    };

    var Game_Party_gainGold = Game_Party.prototype.gainGold;
    Game_Party.prototype.gainGold = function (amount) {
        amount = amount * this.goldRate() + this.gpup();
        Game_Party_gainGold.call(this, amount);
    };

    Game_Party.prototype.gpup = function () {
        var gpup = 0;
        for (var i = 0; i < this._actors.length; i++) {
            var actor = $gameActors.actor(this._actors[i]);
            gpup += actor.NParam(TIKA.Param.ActorGPUP);
        }

        return gpup;
    };

})();


