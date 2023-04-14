/*:
 * @plugindesc v1.0
 * @author TIKA
 *
 * @param StateCycleTimeout
 * @text State Cycle Timeout(s):
 * @default 1.5
 * 
 * 
 *  @help
 * ============================================================================
 * Description
 * ============================================================================
 *  In order to make this plugin work you will have to have YEP_MainMenuManager
 *  enabled.
 * 
 * ============================================================================
 * Script calls
 * ============================================================================
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version v1.0
 * Completed plugin
 * 
 */

var TIKA = TIKA || {};
TIKA.MainMenu = TIKA.MainMenu || {};
TIKA.MainMenu.Param = TIKA.MainMenu.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_MainMenu');

TIKA.MainMenu.Param.CycleTimeout = Number(TIKA.Parameters['StateCycleTimeout']) * 1000;

TIKA.MainMenu.StateIconNumbers = [0, 0, 0];
TIKA.MainMenu.Start = 0;

(function () {

    // ============================================================================
    //                          Window_MenuCommand
    // ============================================================================

    Window_MenuCommand.prototype.maxCols = function () {
        return 2;
    };

    Window_MenuCommand.prototype.windowWidth = function () {
        return Graphics.boxWidth / 4;
    };


    // ============================================================================
    //                          Scene_Menu
    // ============================================================================

    Scene_Menu.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        TIKA.MainMenu.Start = Date.now();
        if (Moghunter.timeWindow_menu === "true") {
            this.createTimeStatus();
        };
        this.createCommandWindow();
        this.createGoldWindow();
        this.createStatusWindow();
        this.createAbilitiesWindow();
        this.createActorsWindow();
        this.createHelpWindow();
        this.repositionWindows();
    };

    Scene_Menu.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Description(10);
        this._helpWindow.width = Graphics.boxWidth / 5;
        this._helpWindow.x = Graphics.boxWidth / 3 - this._helpWindow.width / 10;
        this._abilitiesWindow.setHelpWindow(this._helpWindow);
        this._helpWindow.margin = 0;
        this._helpWindow.padding = 5;
        this._helpWindow.openness = 0;
        this.addWindow(this._helpWindow);
    };

    var Scene_Menu_createStatusWindow = Scene_Menu.prototype.createStatusWindow;
    Scene_Menu.prototype.createStatusWindow = function () {
        Scene_Menu_createStatusWindow.call(this);
        this._statusWindow.width = Graphics.boxWidth / 4;
        this._statusWindow.height = Graphics.boxHeight - this._goldWindow.height - this._time_status_window.height;
    };

    Scene_Menu.prototype.createAbilitiesWindow = function () {
        var wx = this._commandWindow.width;
        var wy = 0;
        var ww = 240;
        var wh = 240;
        this._abilitiesWindow = new Window_Abilities(wx, wy, ww, wh);
        this._abilitiesWindow.setHandler('ok', this.onItemOk.bind(this));
        this._abilitiesWindow.setHandler('cancel', this.exitAbilities.bind(this));
        this.addWindow(this._abilitiesWindow);
    };

    Scene_Menu.prototype.createActorsWindow = function () {
        this._actorWindow = new Window_MenuActor();
        this._actorWindow.setHandler('ok', this.onActorOk.bind(this));
        this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    };

    var Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.width = Graphics.boxWidth / 4;
        this._commandWindow.refresh();
    };

    Scene_Menu.prototype.repositionWindows = function () {
        this.resizeGoldWindow();
        this._commandWindow.x = 0;
        this._time_status_window.x = Graphics.boxWidth - this._time_status_window.width;
        this._time_status_window.y = Graphics.boxHeight - this._time_status_window.height - this._goldWindow.height;
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this._statusWindow.x = Graphics.boxWidth - this._statusWindow.width;
        //Actor window
        this._actorWindow.x = this._statusWindow.x;
        this._actorWindow.y = this._statusWindow.y;
        this._actorWindow.width = this._statusWindow.width;
        this._actorWindow.height = this._statusWindow.height;
    };

    Scene_Menu.prototype.commandAbilities = function () {
        this._abilitiesWindow.setActor(this.actor());
        this._abilitiesWindow.open();
        this._abilitiesWindow.refresh();
        this._commandWindow.deactivate();
        this._abilitiesWindow.activate();
        this._abilitiesWindow.select(0);
    };

    Scene_Menu.prototype.exitAbilities = function () {
        this._abilitiesWindow.close();
        this._abilitiesWindow.deactivate();
        this._abilitiesWindow._helpWindow.close();
        this._commandWindow.activate();
    };

    Scene_Menu.prototype.onItemOk = function () {
        this.determineItem();
    };

    Scene_Menu.prototype.onActorOk = function () {
        if (this.canUse()) {
            this.useItem();
        } else {
            SoundManager.playBuzzer();
        }
    };

    Scene_Menu.prototype.canUse = function () {
        return this.user().canUse(this.item()) && this.isItemEffectsValid();
    };

    Scene_Menu.prototype.useItem = function () {
        Scene_ItemBase.prototype.useItem.call(this);
        this._abilitiesWindow.redrawCurrentItem();
    };

    Scene_Menu.prototype.playSeForItem = function () {
        SoundManager.playUseItem();
    };

    Scene_Menu.prototype.applyItem = function () {
        var action = new Game_Action(this.user());
        action.setItemObject(this.item());
        this.itemTargetActors().forEach(function (target) {
            for (var i = 0; i < action.numRepeats(); i++) {
                action.apply(target);
            }
        }, this);
        action.applyGlobal();
    };

    Scene_Menu.prototype.checkCommonEvent = function () {
        if ($gameTemp.isCommonEventReserved()) {
            SceneManager.goto(Scene_Map);
        }
    };

    Scene_Menu.prototype.isItemEffectsValid = function () {
        var action = new Game_Action(this.user());
        action.setItemObject(this.item());
        return this.itemTargetActors().some(function (target) {
            return action.testApply(target);
        }, this);
    };

    Scene_Menu.prototype.itemTargetActors = function () {
        var action = new Game_Action(this.user());
        action.setItemObject(this.item());
        if (!action.isForFriend()) {
            return [];
        } else if (action.isForAll()) {
            return $gameParty.members();
        } else {
            return [$gameParty.members()[this._actorWindow.index()]];
        }
    };

    Scene_Menu.prototype.onActorCancel = function () {
        this._statusWindow.refresh();
        this.hideSubWindow(this._actorWindow);
    };

    Scene_Menu.prototype.hideSubWindow = function (window) {
        window.hide();
        window.deactivate();
        this.activateItemWindow();
    };

    Scene_Menu.prototype.determineItem = function () {
        var action = new Game_Action(this.user());
        var item = this.item();
        action.setItemObject(item);
        if (action.isForFriend()) {
            this.showSubWindow(this._actorWindow);
            this._actorWindow.selectForItem(this.item());
        } else {
            this.useItem();
            this.activateItemWindow();
        }
    };

    Scene_Menu.prototype.showSubWindow = function (window) {
        window.show();
        window.activate();
    };

    Scene_Menu.prototype.activateItemWindow = function () {
        this._abilitiesWindow.refresh();
        this._abilitiesWindow.activate();
    };

    Scene_Menu.prototype.user = function () {
        var members = $gameParty.movableMembers();
        var bestActor = members[0];
        var bestPha = 0;
        for (var i = 0; i < members.length; i++) {
            if (members[i].pha > bestPha) {
                bestPha = members[i].pha;
                bestActor = members[i];
            }
        }
        return bestActor;
    };

    Scene_Menu.prototype.item = function () {
        return this._abilitiesWindow.item();
    };

    var Scene_Menu_update = Scene_Menu.prototype.update;
    Scene_Menu.prototype.update = function () {
        Scene_Menu_update.call(this);
        if (Date.now() > TIKA.MainMenu.Start + TIKA.MainMenu.Param.CycleTimeout) {
            if (this._actorWindow.visible)
                this._actorWindow.refresh();
            else
                this._statusWindow.refresh();
        }

        if (this._abilitiesWindow.active) {
            var x = this._abilitiesWindow.x + this._abilitiesWindow.width;
            var y = this._abilitiesWindow.y + this._abilitiesWindow._cursorRect.y;
            this._abilitiesWindow._helpWindow.updatePlacement(x, y, this._abilitiesWindow._cursorRect);
        }
    };


    // ============================================================================
    //                          Window_MenuStatus
    // ============================================================================

    var Window_MenuStatus_refresh = Window_MenuStatus.prototype.refresh;
    Window_MenuStatus.prototype.refresh = function () {
        Window_MenuStatus_refresh.call(this);
        TIKA.MainMenu.Start = Date.now();
    };

    Window_MenuStatus.prototype.numVisibleRows = function () {
        return 3;
    };

    Window_MenuStatus.prototype.windowHeight = function () {
        return Graphics.boxHeight;
    };

    Window_MenuStatus.prototype.numVisibleRows = function () {
        return 3;
    };

    Window_MenuStatus.prototype.standardPadding = function () {
        return 10;
    };

    var Window_MenuStatus_drawCurrentAndMax = Window_MenuStatus.prototype.drawCurrentAndMax;
    Window_MenuStatus.prototype.drawCurrentAndMax = function (current, max, x, y,
        width, color1, color2) {
        if (SceneManager._scene instanceof Scene_Menu) {
            var labelWidth = this.textWidth('HP: ');
            var currValueWidth = this.textWidth(current);
            var slashWidth = this.textWidth('/');
            width = width - this.padding * 4 - this.textPadding() * 2;
            var x1 = x + labelWidth;
            var x2 = x1 + currValueWidth;
            var x3 = x2 + slashWidth;
            this.changeTextColor(color1);
            this.drawText(current, x1, y, width / 2 - (width - x2), 'left');
            this.changeTextColor(color2);
            this.drawText('/', x2, y, slashWidth, 'left');
            this.drawText(max, x3, y, width / 2 - (width - x3), 'left');
        } else {
            Window_MenuStatus_drawCurrentAndMax.call(this, current, max, x, y, width, color1, color2)
        }
    };

    Window_MenuStatus.prototype.drawItemStatus = function (index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        var xpad = Yanfly.Param.WindowPadding + Window_Base._faceWidth;
        var x = rect.x + xpad;
        if (!eval(Yanfly.Param.MenuTpGauge)) {
            var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
        } else {
            var y = rect.y;
        }
        var width = rect.width - x - this.textPadding();
        this.drawActorSimpleStatus(actor, x, y, width);
    };

    Window_MenuStatus.prototype.drawActorSimpleStatus = function (actor, x, y, width) {
        var lineHeight = this.lineHeight();
        var width2 = Math.min(200, width - this.padding * 2);
        y += this.textPadding();
        x -= this.padding;
        this.drawActorName(actor, x, y - lineHeight);
        this.drawActorHp(actor, x, y, width2);
        this.drawActorMp(actor, x, y + lineHeight * 1, width2);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
    };

    Window_MenuStatus.prototype.drawActorIcons = function (actor, x, y, width) {
        width = width || 144;
        var index = actor.index();
        if (!TIKA.MainMenu.StateIconNumbers[index])
            TIKA.MainMenu.StateIconNumbers[index] = 0;
        var icons = actor.allIcons();
        this.drawIcon(icons[TIKA.MainMenu.StateIconNumbers[index]], x, y + 2);
        if (++TIKA.MainMenu.StateIconNumbers[index] >= icons.length) {
            TIKA.MainMenu.StateIconNumbers[index] = 0;
        }
    };

    Window_MenuStatus.prototype.drawActorHp = function (actor, x, y, width) {
        width = width || 186;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA + ':', x, y, 44);
        this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width, this.hpColor(actor), this.normalColor());
    };

    Window_MenuStatus.prototype.drawActorMp = function (actor, x, y, width) {
        width = width || 186;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.mpA + ':', x, y, 44);
        this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width, this.mpColor(actor), this.normalColor());
    };

    Window_MenuStatus.prototype.lineHeight = function () {
        return 28;
    };

    Window_MenuStatus.prototype.selectForItem = function (item) {
        var actor = $gameParty.menuActor();
        var action = new Game_Action(actor);
        action.setItemObject(item);
        this.setCursorFixed(false);
        this.setCursorAll(false);
        if (action.isForUser()) {
            if (DataManager.isSkill(item)) {
                this.setCursorFixed(true);
                this.select(actor.index());
            } else {
                this.selectLast();
            }
        } else if (action.isForAll()) {
            this.setCursorAll(true);
            this.select(0);
        } else {
            this.selectLast();
        }
    };

    // ============================================================================
    //                          Window_Time_Status
    // ============================================================================

    Window_Time_Status.prototype.initialize = function (x, y) {
        this.pm_mode = false;
        if (String(Moghunter.display_pm_mode) === "true") {
            this.pm_mode = true
        };
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth / 4, 228);
        this.contents.fontSize = 20;
        this._window_size = [-500, -500, 0, 0];
        this.refresh();
        this._old_play_time = $gameSystem.playtime();
        this._mode = 0;
    };

    Window_Time_Status.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if ($gameSystem._refresh_window_time) {
            this.refresh();
        }
        if (this.need_fade()) {
            this.opacity -= 15;
        } else {
            this.opacity += 15
        };
        this.contentsOpacity = this.opacity;
        if (this._mode === 0 && this._old_play_time != $gameSystem.playtime()) {
            this.refresh();
            this._old_play_time = $gameSystem.playtime()
        };
    };

    // ============================================================================
    //                          Window_Abilities
    // ============================================================================

    function Window_Abilities() {
        this.initialize.apply(this, arguments);
    }

    Window_Abilities.prototype = Object.create(Window_SkillList.prototype);
    Window_Abilities.prototype.constructor = Window_Abilities;

    Window_Abilities.prototype.initialize = function (x, y, width, height) {
        this._data = [];
        Window_SkillList.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this._stypeId = 0;
        this.opacity = 255;
        this.openness = 0;
    };

    Window_Abilities.prototype.standardPadding = function () {
        return 5;
    };

    Window_Abilities.prototype.drawItem = function (index) {
        var skill = this._data[index];
        if (skill) {
            var costWidth = this.costWidth();
            var rect = this.itemRect(index);
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
            this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    Window_Abilities.prototype.includes = function (item) {
        return $gameParty.canUse(item);
    };

    Window_Abilities.prototype.isEnabled = function (item) {
        if (!item) return false;
        return this._actor && this._actor.canPaySkillCost(item);
    };

    Window_Abilities.prototype.windowHeight = function () {
        return this.fittingHeight(this.numVisibleRows()) > Graphics.boxHeight ? Graphics.boxHeight : this.fittingHeight(this.numVisibleRows());
    };

    Window_Abilities.prototype.numVisibleRows = function () {
        return Math.ceil(this.maxItems() / this.maxCols());
    };

    Window_Abilities.prototype.maxItems = function () {
        return this._data.length;
    };

    var Window_Abilities_refresh = Window_Abilities.prototype.refresh;
    Window_Abilities.prototype.refresh = function () {
        this.height = this.windowHeight();
        Window_Abilities_refresh.call(this);
    }

    Window_Abilities.prototype.itemWidth = function () {
        return Math.floor(this.width - this.padding * 2);
    };

    Window_Abilities.prototype.costWidth = function () {
        return this.textWidth('00000000');
    };

    // ============================================================================
    //                       Window_MenuActor
    // ============================================================================

    var Window_MenuActor_refresh = Window_MenuActor.prototype.refresh;
    Window_MenuActor.prototype.refresh = function () {
        Window_MenuActor_refresh.call(this);
        TIKA.MainMenu.Start = Date.now();
    };

    Window_MenuActor.prototype.numVisibleRows = function () {
        return 3;
    };

    Window_MenuActor.prototype.windowHeight = function () {
        return Graphics.boxHeight;
    };

    Window_MenuActor.prototype.numVisibleRows = function () {
        return 3;
    };

    Window_MenuActor.prototype.standardPadding = function () {
        return 10;
    };

    var Window_MenuActor_drawItemImage = Window_MenuActor.prototype.drawItemImage;
    Window_MenuActor.prototype.drawItemImage = function (index) {
        if (SceneManager._scene instanceof Scene_Menu) {
            var actor = $gameParty.members()[index];
            var rect = this.itemRect(index);
            this.changePaintOpacity(actor.isBattleMember());
            var fw = Window_Base._faceWidth;
            this.drawActorFace(actor, rect.x + 1, rect.y + 1, fw, rect.height - 2);
            this.changePaintOpacity(true);
        } else {
            Window_MenuActor_drawItemImage.call(this, index);
        }
    };

    var Window_MenuActor_drawActorSimpleStatus = Window_MenuActor.prototype.drawActorSimpleStatus;
    Window_MenuActor.prototype.drawActorSimpleStatus = function (actor, x, y, width) {
        if (SceneManager._scene instanceof Scene_Menu) {
            var lineHeight = this.lineHeight();
            var width2 = Math.min(200, width - this.padding * 2);
            y += this.textPadding();
            x -= this.padding;
            this.drawActorName(actor, x, y - lineHeight);
            this.drawActorHp(actor, x, y, width2);
            this.drawActorMp(actor, x, y + lineHeight * 1, width2);
            this.drawActorIcons(actor, x, y + lineHeight * 2);
        } else {
            Window_MenuActor_drawActorSimpleStatus.call(this, actor, x, y, width);
        }
    };

    var Window_MenuActor_drawActorIcons = Window_MenuActor.prototype.drawActorIcons;
    Window_MenuActor.prototype.drawActorIcons = function (actor, x, y, width) {
        if (SceneManager._scene instanceof Scene_Menu) {
            width = width || 144;
            var index = actor.index();
            if (!TIKA.MainMenu.StateIconNumbers[index])
                TIKA.MainMenu.StateIconNumbers[index] = 0;
            var icons = actor.allIcons();
            this.drawIcon(icons[TIKA.MainMenu.StateIconNumbers[index]], x, y + 2);
            if (++TIKA.MainMenu.StateIconNumbers[index] >= icons.length) {
                TIKA.MainMenu.StateIconNumbers[index] = 0;
            }
        } else {
            Window_MenuActor_drawActorIcons.call(this, actor, x, y, width);
        }
    };

    var Window_MenuActor_drawActorHp = Window_MenuActor.prototype.drawActorHp;
    Window_MenuActor.prototype.drawActorHp = function (actor, x, y, width) {
        if (SceneManager._scene instanceof Scene_Menu) {
            width = width || 186;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.hpA + ':', x, y, 44);
            this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width, this.hpColor(actor), this.normalColor());
        } else {
            Window_MenuActor_drawActorHp.call(this, actor, x, y, width);
        }
    };

    var Window_MenuActor_drawActorMp = Window_MenuActor.prototype.drawActorMp;
    Window_MenuActor.prototype.drawActorMp = function (actor, x, y, width) {
        if (SceneManager._scene instanceof Scene_Menu) {
            width = width || 186;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.mpA + ':', x, y, 44);
            this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width, this.mpColor(actor), this.normalColor());
        } else {
            Window_MenuActor_drawActorMp.call(this, actor, x, y, width);
        }
    };

    var Window_MenuActor_lineHeight = Window_MenuActor.prototype.lineHeight;
    Window_MenuActor.prototype.lineHeight = function () {
        if (SceneManager._scene instanceof Scene_Menu)
            return 28;
        else
            return Window_MenuActor_lineHeight.call(this);
    };

    var Window_MenuActor_drawItemStatus = Window_MenuActor.prototype.drawItemStatus;
    Window_MenuActor.prototype.drawItemStatus = function (index) {
        if (SceneManager._scene instanceof Scene_Menu) {
            var actor = $gameParty.members()[index];
            var rect = this.itemRect(index);
            var xpad = Yanfly.Param.WindowPadding + Window_Base._faceWidth;
            var x = rect.x + xpad;
            if (!eval(Yanfly.Param.MenuTpGauge)) {
                var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
            } else {
                var y = rect.y;
            }
            var width = rect.width - x - this.textPadding();
            this.drawActorSimpleStatus(actor, x, y, width);
        } else {
            Window_MenuActor_drawItemStatus.call(this, index);
        }
    };

    // ============================================================================
    //                       Window_Description
    // ============================================================================

    function Window_Description() {
        this.initialize.apply(this, arguments);
    }

    Window_Description.prototype = Object.create(Window_Help.prototype);
    Window_Description.prototype.constructor = Window_Description;


    Window_Description.prototype._refreshBack = function () {
        var m = this._margin;
        var w = this._width - m * 2;
        var h = this._height - m * 2;
        var bitmap = new Bitmap(w, h);
        var rgb = [30, 30, 30];
        var color = "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
        bitmap.fillRect(0, 0, w, h, color);
        this._windowBackSprite.bitmap = bitmap;
        this._windowBackSprite.setFrame(0, 0, w, h);
        this._windowBackSprite.move(m, m);
    };

    Window_Description.prototype.standardBackOpacity = function () {
        return 245;
    };

    Window_Description.prototype.lineHeight = function () {
        return this.getFontSize();
    };

    Window_Description.prototype.standardPadding = function () {
        return this.getFontSize() / 1.5;
    };

    Window_Description.prototype.updatePlacement = function (x, y, rect) {
        if (this._text.replace(/<WordWrap>/g, '').length < 1) {
            this.close();
            return;
        }
        this.open();
        this._refreshBack();
        this.opacity = 255;
        this.backOpacity = this.standardBackOpacity();
        this.padding = this.getFontSize() / 2;
        this.y = y;
        this.x = x;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = y + rect.height - this.height;
        }
        if (this.x + this.width > Graphics.boxWidth) {
            this.x = x - this.width + rect.width;
        }
        this.width = Graphics.boxWidth / 4;
        this.refresh();

    };

    Window_Description.prototype.refresh = function () {
        this.contents.clear();
        this.height = this.fittingHeight(1);
        this.drawTextAutoWrap(this._text, this.textPadding(), 0);
    };

    Window_Description.prototype.drawTextAutoWrap = function (text, x, y) {
        if (!text) {
            return;
        }
        this.contents.fontSize = this.getFontSize();
        var counter = 1;
        var words = text.split(' ');
        let x2 = x;
        let y2 = y;
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word === `<br>`)
                word = '\x1bn';
            else
                word = this.convertEscapeCharacters(words[i]);
            var width = this.textWidth(word + ' ');
            if (word === `\x1bn`) {
                y2 += this.lineHeight();
                x2 = x;
                counter++;
                continue;
            }
            if (x2 + width >= (this.width - this.textPadding() - this.padding)) {
                y2 += this.lineHeight();
                x2 = x;
                counter++;
            }
            this.height = this.fittingHeight(counter);
            this.drawText(word + ' ', x2, y2);
            x2 += width;
        }
        this.resetFontSettings();
    }

    Window_Description.prototype.getFontSize = function () {
        if (SceneManager._scene instanceof Scene_Skill)
            return TIKA.SM.Param.DescFontSize;
        else if (SceneManager._scene instanceof Scene_Battle)
            return TIKA.BS.Param.DescFontSize;
        else if (SceneManager._scene instanceof Scene_Equip)
            return TIKA.EM.Param.DescFontSize;
        else if (SceneManager._scene instanceof Scene_Class)
            return TIKA.JM.Param.DescFontSize;
        else if (SceneManager._scene instanceof Scene_Item)
            return TIKA.IM.Param.DescFontSize;
        else if (SceneManager._scene instanceof Scene_Menu)
            return 20;
    };

    // ============================================================================
    //                       Game_BattlerBase
    // ============================================================================

    var Game_BattlerBase_meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
        if (SceneManager._scene instanceof Scene_Menu)
            return (this.meetsUsableItemConditions(skill) &&
                this.isSkillWtypeOk(skill) &&
                !this.isSkillSealed(skill.id) && !this.isSkillTypeSealed(skill.stypeId));
        else
            return Game_BattlerBase_meetsSkillConditions.call(this, skill);
    };

})();