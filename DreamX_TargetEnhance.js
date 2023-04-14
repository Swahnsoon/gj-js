/*:
 * @plugindesc v1.2
 * @author DreamX
 * @help
 * ============================================================================
 * How To Use
 * ============================================================================
 * 
 * ============================================================================
 * Terms Of Use
 * ============================================================================
 * Free to use and modify for commercial and noncommercial games, with credit.
 * ============================================================================
 * Credits
 * ============================================================================
 * DreamX
 */

var Imported = Imported || {};
Imported.DreamX_SwitchTargetType = true;

var DreamX = DreamX || {};
DreamX.SwitchTargetType = DreamX.SwitchTargetType || {};

DreamX.Parameters = PluginManager.parameters('DreamX_SwitchTargetType');
DreamX.Param = DreamX.Param || {};

Window_BattleEnemy.prototype.processCursorMove = function () {
    if (this.isCursorMovable()) {
        var lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.switchTargetType();
        }
        if (Input.isRepeated('left')) {
            this.switchTargetType();
        }
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};
//
Window_BattleEnemy.prototype.switchTargetType = function () {
    if (!this.action().isSpanBothParties() || !this.enemy()) {
        return;
    }

    this._enemyOnly = !this._enemyOnly;
    this._enemies = this.allowedTargets();
    this.autoSelect();
};

Window_BattleEnemy.prototype.maxCols = function () {
    return 1;
};

DreamX.SwitchTargetType.Window_BattleEnemy_allowedTargets = Window_BattleEnemy.prototype.allowedTargets;
Window_BattleEnemy.prototype.allowedTargets = function () {
    var targets = DreamX.SwitchTargetType.Window_BattleEnemy_allowedTargets.call(this);
    var enemyOnly = this._enemyOnly;

    if (this.action() && this.action().isSpanBothParties()) {
        targets = targets.filter(function (target) {
            return enemyOnly ? target.isEnemy() : target.isActor();
        });
    }

    return targets;

};

Window_BattleEnemy.prototype.sortTargets = function () {
    this._enemies.sort(function (a, b) {
        if (a.spritePosY() === b.spritePosY()) {
            return a.spritePosX() - b.spritePosX();
        }
        return a.spritePosY() - b.spritePosY();
    });
    if (this.action())
        this.addExtraSelectTargets();
};

DreamX.SwitchTargetType.Window_BattleEnemy_autoSelect = Window_BattleEnemy.prototype.autoSelect;
Window_BattleEnemy.prototype.autoSelect = function () {
    if (this.action().isSpanBothParties()) {
        if (this.enemy()) {
            this._enemyOnly = this.enemy().isEnemy() ? true : false;
        }

        this._enemies = this.allowedTargets();
    }
    DreamX.SwitchTargetType.Window_BattleEnemy_autoSelect.call(this);
    if (this.action().isSpanBothParties()) {
        this._enemyOnly = this.enemy().isEnemy() ? true : false;
        this._enemies = this.allowedTargets();
    }
};

DreamX.SwitchTargetType.Window_BattleEnemy_refresh = Window_BattleEnemy.prototype.refresh;
Window_BattleEnemy.prototype.refresh = function () {
    if (this.action() && this.action().isSpanBothParties()) {
        if (this.action().isForEnemyOrActor()) {
            this._enemyOnly = true;
        } else if (this.action().isForActorOrEnemy()) {
            this._enemyOnly = false;
        }
        this._enemies = this.allowedTargets();
    }

    DreamX.SwitchTargetType.Window_BattleEnemy_refresh.call(this);
};