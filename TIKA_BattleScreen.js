/*:
 * @plugindesc v1.3 Custom battle screen
 * @author TIKA
 *
 * @param Item command description
 * @desc Description for item command on battle screen
 * @default Use an item from you inventory.
 *
 * @param Attack command description
 * @desc Description for attack command on battle screen
 * @default Attack a single foe with an equipped weapon.
 *
 * @param Defend command description
 * @desc Description for defend command on battle screen
 * @default Take a defensive stance to reduce damage received.
 *
 * @param Actor Damage Dealt Variable
 * @desc Variable id in which actor damage output is saved
 * @default 19
 *
 * @param Enemy Damage Dealt Variable
 * @desc Variable id in which enemy damage output is saved
 * @default 19
 *
 * @param CTBIconPlusSize
 * @desc This value is added to the size of CTB icon for entity in turn.
 * @default 10
 *
 * @param xOffset
 * @desc X offset.
 * @default 0
 *
 * @param CTBInitiativeBGColor
 * @desc Color of the backgroung for the inititative in CTB icon.
 * @default 15
 *
 * @param CTBInitiativeFontSizePlus
 * @desc Added to the current font size.
 * @default 0
 *
 * @param Font Size
 * @desc Font size of the Description window.
 * @default 22
 *
 * @param AllTargetsText
 * @desc Text that show in battle when targeting multiple enemies.
 * @default "All"
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * This plugin changes the layout of the actor command window. Actor command
 * window is tied to an actor. If an actor moves command window follows him.
 *
 *  ============================================================================
 * Notetags
 * ============================================================================
 *
 *   <Class Skill Description>
 *    Text
 *    Text
 *   </Class Skill Description>
 *   Sets the skill type description for the class to the specified text.
 *
 *   <Command Equip> - Skill notebox for skills that allow you to change
 *                     equipment during battle
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version v1.3
 * BugFix for enemy CTB icons
 *
 * Version v1.2
 * Vertical ctb.
 * BattleStatus menu redesign
 *
 * Version v1.1
 * Small design changes.
 *
 * Version v1.00
 * Finished plugin!
 *
 *
 */
var Imported = Imported || {};
Imported.TIKA_BattleScreen = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.BattleScreen = TIKA.BattleScreen || {};
TIKA.BS = TIKA.BS || {};
TIKA.BS.Param = TIKA.BS.Param || {};
TIKA.Param = TIKA.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_BattleScreen');


TIKA.BS.Param.ItemCommandDesc = TIKA.Parameters['Item command description'];
TIKA.BS.Param.AttackCommandDesc = TIKA.Parameters['Attack command description'];
TIKA.BS.Param.DefendCommandDesc = TIKA.Parameters['Defend command description'];
TIKA.BS.Param.ActorDamageDealtVar = Number(TIKA.Parameters['Actor Damage Dealt Variable']);
TIKA.BS.Param.EnemyDamageDealtVar = Number(TIKA.Parameters['Enemy Damage Dealt Variable']);
TIKA.BS.Param.DescFontSize = Number(TIKA.Parameters['Font Size']);
TIKA.BS.Param.AllTargetsText = Number(TIKA.Parameters['AllTargetsText']);
TIKA.BS.Param.CurrentCTBIconSize = Number(TIKA.Parameters['CTBIconPlusSize']);
TIKA.BS.Param.xOffset = Number(TIKA.Parameters['xOffset']);
TIKA.BS.Param.CTBInitiativeBGColor = Number(TIKA.Parameters['CTBInitiativeBGColor']);
TIKA.BS.Param.CTBInitiativeFontSizePlus = Number(TIKA.Parameters['CTBInitiativeFontSizePlus']);
TIKA.BS.CurrentCTBIconSize = 0;

(function () {

    const HP_RECOVER = 3;
    const MP_RECOVER = 4;

    // ============================================================================
    //                    Scene_Battle
    // ============================================================================

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        for (var i = 1; i < $dataClasses.length; i++) {
            var desc = this.processSkillDescNotetags($dataClasses[i].note);
            $dataClasses[i]._skillsDescription = desc;
        }

        for (var i = 1; i < $dataSkills.length; i++) {
            var commandEquip = this.processSkillCommandNotetags($dataSkills[i]);
            if (commandEquip)
                $dataSkills[i].commandEquip = commandEquip;
        }

        return true;
    };

    DataManager.processSkillCommandNotetags = function (obj) {
        notedata = obj.meta;
        if (notedata && notedata['Command Equip'])
            return true;
        return false;
    }

    DataManager.processSkillDescNotetags = function (obj) {
        var description = '';
        var evalMode = 'none';
        notedata = this.convertNotedataToArray(obj);
        for (var i = 0; i < notedata.length; i++) {
            var line = notedata[i];
            if (line.match(/<Class Skill Description>/i)) {
                evalMode = 'help description';
                description = '';
            } else if (line.match(/<\/Class Skill Description>/i)) {
                evalMode = 'none';
            } else if (evalMode === 'help description') {
                description += line + '\n';
            }
        }
        return description;
    }

    DataManager.convertNotedataToArray = function (notedata) {
        var comment = '';
        var length = notedata.length;
        for (var i = 0; i < length; ++i) {
            var ev = notedata[i];
            if ([62, 59, 13].contains(ev.charCodeAt(0))) {
                comment += notedata[i] + '\n';
            } else
                comment += notedata[i];
        }
        return comment.split(/[\r\n]+/);
    };

    // ============================================================================
    //                    Scene_Battle
    // ============================================================================

    var Scene_Battle_updateWindowPositions = Scene_Battle.prototype.updateWindowPositions;
    Scene_Battle.prototype.updateWindowPositions = function () {
        if ($gameTemp._battleEnd) {
            Scene_Battle_updateWindowPositions.call(this);
            this._statusWindow.close();
            this._logWindow.close();
        }
        if (this._actorCommandWindow._actor) {
            this._actorCommandWindow.updatePlacement();
            /*if (this._partyCommandWindow._openness) {
                this._actorCommandWindow.moveRight(this._partyCommandWindow.width);
            }*/
        }

        if (this._partyCommandWindow.active) {
            this._partyCommandWindow.updatePlacement(this._actorCommandWindow);
        }

        if (this._itemWindow.active)
            this._skillWindow._helpWindow.updatePlacement(this._actorCommandWindow.x, this._actorCommandWindow.y, this._actorCommandWindow._cursorRect);
            // this._itemWindow._helpWindow.updatePlacement(this._itemWindow.x, this._itemWindow.y, this._itemWindow._cursorRect);

        this._helpWindow.x = Graphics.boxWidth / 2 - this._helpWindow.width / 2;
        var diff = (this._helpWindow.width - (Math.floor(this._helpWindow.textWidth(this._helpWindow._text)) + this._helpWindow.padding * 2));
        var step = Math.abs(diff / 10);
        if (diff > 0)
            this._helpWindow.width -= step;
        if (diff < 0)
            this._helpWindow.width += step;

    };

    Scene_Battle.prototype.createAllWindows = function () {
        this.createLogWindow();
        this.createStatusWindow();
        this.createActorCommandWindow();
        this.createPartyCommandWindow();
        this.createSkillWindow();
        this.createItemWindow();
        this.createHelpWindow();
        this.createActorWindow();
        this.createEnemyWindow();
        this.createMessageWindow();
        this.createScrollTextWindow();
        this.createInBattleStatusWindows();
    };

    var Scene_Battle_createLogWindow = Scene_Battle.prototype.createLogWindow;
    Scene_Battle.prototype.createLogWindow = function () {
        Scene_Battle_createLogWindow.call(this);
        this._logWindow.setHandler('cancel', this.onLogCancel.bind(this));
    };

    Scene_Battle.prototype.createStatusWindow = function () {
        var ww = Graphics.boxWidth - this._logWindow.width;
        var wh = 140;
        this._statusWindow = new Window_BattleStatus(ww, wh);
        this._statusWindow.x = this._logWindow.width;
        this._statusWindow.y = Graphics.boxHeight - this._statusWindow.height;
        this.addWindow(this._statusWindow);
    }

    var Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function () {
        Scene_Battle_createPartyCommandWindow.call(this);
        this._partyCommandWindow.setHandler('cancel', this.commandFight.bind(this));
        this._partyCommandWindow.setHandler('guard', this.commandGuardSec.bind(this));
        this._partyCommandWindow.setHandler('direct skill', this.commandDirectSkillSec.bind(this));
        this._partyCommandWindow.setHandler('log', this.commandLog.bind(this));
    };


    Scene_Battle.prototype.createActorCommandWindow = function () {
        this._actorCommandWindow = new Window_ActorCommand();
        // this._actorCommandWindow.height = this._actorCommandWindow.fittingHeight(10);
        this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
        this._actorCommandWindow.setHandler('skill', this.commandSkill.bind(this));
        this._actorCommandWindow.setHandler('direct skill', this.commandDirectSkill.bind(this));
        this._actorCommandWindow.setHandler('item', this.commandItem.bind(this));
        this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
        this.addWindow(this._actorCommandWindow);
    };

    var Scene_Battle_createHelpWindow = Scene_Battle.prototype.createHelpWindow;
    Scene_Battle.prototype.createHelpWindow = function () {
        Scene_Battle_createHelpWindow.call(this);
        this._helpWindow.width = 0;
        this._descriptionWindow = new Window_Description(10);
        this._descriptionWindow.width = Graphics.boxWidth / 5;
        this._skillWindow.setHelpWindow(this._descriptionWindow);
        this._actorCommandWindow.setHelpWindow(this._descriptionWindow);
        this._itemWindow.setHelpWindow(this._descriptionWindow);
        this._partyCommandWindow.setHelpWindow(this._descriptionWindow);
        this._descriptionWindow.margin = 0;
        this._descriptionWindow.padding = 5;
        this._descriptionWindow.openness = 0;
        this._descriptionWindow.deactivate();
        this.addWindow(this._descriptionWindow);
    };

    Scene_Battle.prototype.createSkillWindow = function () {
        var wy = 0;
        var wh = Graphics.boxHeight - wy;
        this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);
        this._skillWindow.padding = 5;
        this._skillWindow.height = this._skillWindow.fittingHeight(this._skillWindow.numVisibleRows());
        this._skillWindow.setHandler('ok', this.onSkillOk.bind(this));
        this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
        this.addWindow(this._skillWindow);
    };

    Scene_Battle.prototype.createItemWindow = function () {
        var wy = 0;
        var wh = 5 * this._actorCommandWindow.itemRect(0).height + 2 * this._actorCommandWindow.padding;
        var ww = 290;
        this._itemWindow = new Window_BattleItem(0, wy, ww, wh);
        this._itemWindow.padding = 5;
        this._itemWindow.height = this._itemWindow.fittingHeight(5);
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
    };

    var Scene_Battle_commandFight = Scene_Battle.prototype.commandFight;
    Scene_Battle.prototype.commandFight = function () {
        this._actorCommandWindow._helpWindow.show();
        this._actorCommandWindow._helpWindow.updatePlacement(this._actorCommandWindow.x + this._actorCommandWindow.padding * 2, this._actorCommandWindow.y, this._actorCommandWindow._cursorRect);
        var scene = SceneManager._scene;
        scene._backTo = '';
        Scene_Battle_commandFight.call(this);
    };

    Scene_Battle.prototype.commandAttack = function () {
        BattleManager.inputtingAction().setAttack();
        this.selectEnemySelection();
        this._actorCommandWindow._helpWindow.hide();
    };

    var Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
    Scene_Battle.prototype.onEnemyOk = function () {
        Scene_Battle_onEnemyOk.call(this);
        this._helpWindow.hide();
        var action = BattleManager.inputtingAction();
        if (!action) return;
        if (action._item._dataClass == 'skill') {
            var skill = $dataSkills[action._item._itemId];
            if (skill.commandEquip) {
                SceneManager.push(Scene_Equip);
            }
        }
    };

    Scene_Battle.prototype.commandSkill = function () {
        this._actorCommandWindow.opacity = 230;
        this._actorCommandWindow._helpWindow.hide();
        this._skillWindow.setActor(BattleManager.actor());
        this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
        this._skillWindow.show();
        this._skillWindow.activate();
        this._skillWindow.refresh();
        this._skillWindow._helpWindow.updatePlacement(this._actorCommandWindow.x, this._actorCommandWindow.y, this._actorCommandWindow._cursorRect);
        // this._skillWindow._helpWindow.updatePlacement(this._skillWindow.x, this._skillWindow.y + this._skillWindow._cursorRect.y, this._skillWindow._cursorRect);
    };

    Scene_Battle.prototype.commandGuard = function () {
        BattleManager.inputtingAction().setGuard();
        this.selectNextCommand();
        this._actorCommandWindow._helpWindow.hide();
    };

    Scene_Battle.prototype.commandLog = function () {
        this._partyCommandWindow.deactivate();
        this._logWindow.activate();
        this.__logBeenActivated = true;
    };

    Scene_Battle.prototype.onLogCancel = function () {
        this._logWindow.deactivate();
        // this.changeInputWindow();
        // this._partyCommandWindow.setup();
    };

    //@[ALIAS]
    var _alias_Scene_Battle_commandEscape = Scene_Battle.prototype.commandEscape;
    Scene_Battle.prototype.commandEscape = function () {
        _alias_Scene_Battle_commandEscape.call(this);
        this._descriptionWindow.hide();
        if(this.__logBeenActivated) {
            $gameTemp.__escapeFixInterval = setInterval(() => {
                if(!$gameMessage.isBusy()) {
                    try {
                        this.changeInputWindow();
                        clearInterval($gameTemp.__escapeFixInterval);
                    } catch (e) {
                        clearInterval($gameTemp.__escapeFixInterval);
                    }
                }
            }, 1000);
            this.__logBeenActivated = false;
        }
    };

    //@[ALIAS]
    var _alias_Scene_Battle_stop = Scene_Battle.prototype.stop;
    Scene_Battle.prototype.stop = function () {
        _alias_Scene_Battle_stop.call(this);
        if($gameTemp.__escapeFixInterval)
            clearInterval($gameTemp.__escapeFixInterval);
    };

    Scene_Battle.prototype.changeInputWindow = function () {
        if (BattleManager.isInputting()) {
            if (this._logWindow.active) return;
            if (BattleManager.actor() && !this._partyCommandWindow._openness) {
                this.startActorCommandSelection();
            } else {
                this._partyCommandWindow.setup();
                var lastElement = this._partyCommandWindow._list.length - 1;
                this._partyCommandWindow.select(lastElement);
                // this.startPartyCommandSelection();
            }
        } else {
            this.endCommandSelection();
        }
    };

    Scene_Battle.prototype.commandItem = function () {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
        this._actorCommandWindow._helpWindow.hide();
    };

    Scene_Battle.prototype.selectNextCommand = function () {
        BattleManager.selectNextCommand();
        this.changeInputWindow();
        this._actorCommandWindow._helpWindow.hide();
    };

    var Scene_Battle_selectPreviousCommand = Scene_Battle.prototype.selectPreviousCommand;
    Scene_Battle.prototype.selectPreviousCommand = function () {
        Scene_Battle_selectPreviousCommand.call(this);
        this._actorCommandWindow.open();
        this._actorCommandWindow.deselect();
        this._actorCommandWindow.deactivate();
        this._actorCommandWindow._helpWindow.hide();
    };

    var Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function () {
        Scene_Battle_onEnemyCancel.call(this);
        this._actorCommandWindow._helpWindow.show();
        this._actorCommandWindow._helpWindow.updatePlacement(this._actorCommandWindow.x, this._actorCommandWindow.y, this._actorCommandWindow._cursorRect);
    };

    var Scene_Battle_onSkillCancel = Scene_Battle.prototype.onSkillCancel;
    Scene_Battle.prototype.onSkillCancel = function () {
        Scene_Battle_onSkillCancel.call(this);
        this._actorCommandWindow._helpWindow.show();
        this._actorCommandWindow._helpWindow.updatePlacement(this._actorCommandWindow.x, this._actorCommandWindow.y, this._actorCommandWindow._cursorRect);
    };


    var Scene_Battle_onItemCancel = Scene_Battle.prototype.onItemCancel;
    Scene_Battle.prototype.onItemCancel = function () {
        Scene_Battle_onItemCancel.call(this);
        this._actorCommandWindow._helpWindow.show();
        this._actorCommandWindow._helpWindow.updatePlacement(this._actorCommandWindow.x, this._actorCommandWindow.y, this._actorCommandWindow._cursorRect);
    };

    var BattleManager_selectPreviousCommand =
        BattleManager.selectPreviousCommand;
    BattleManager.selectPreviousCommand = function () {
        if (this.isCTB()) {
            var actorIndex = this._actorIndex;
            var scene = SceneManager._scene;
            this._bypassCtbEndTurn = true;
            scene.startPartyCommandSelection();
            this._bypassCtbEndTurn = undefined;
            this._actorIndex = actorIndex;
        } else {
            BattleManager_selectPreviousCommand.call(this);
        }
    };



    // ============================================================================
    //                    Window_ActorCommand
    // ============================================================================

    var Window_ActorCommand_setup = Window_ActorCommand.prototype.setup;
    Window_ActorCommand.prototype.setup = function (actor) {
        Window_ActorCommand_setup.call(this, actor);
        this.updatePlacement();
        this._helpWindow.updatePlacement(this.x, this.y, this._cursorRect);
    };
    var Window_ActorCommand_activate = Window_ActorCommand.prototype.activate;
    Window_ActorCommand.prototype.activate = function () {
        Window_ActorCommand_activate.call(this);
        this.opacity = 255;
    };

    Window_ActorCommand.prototype.update = function () {
        Window_Command.prototype.update.call(this);
        if (this._helpWindow && this.active) {
            if (this._list[this.index()].symbol === 'skill') {
                var stypeId = this._list[this.index()].ext;
                var classObj = this.findClassWithStypeId(stypeId);
                if (classObj)
                    this._helpWindow.setItem({ description: classObj._skillsDescription });
            }
            else if (this._list[this.index()].symbol === 'direct skill') {
                this._helpWindow.setItem($dataSkills[this._list[this.index()].ext]);
            }
            else
                this._helpWindow.setItem({ description: this._list[this.index()].description });
            this._helpWindow.updatePlacement(this.x, this.y, this._cursorRect);
        }
    };

    Window_ActorCommand.prototype.findClassWithStypeId = function (stypeId) {
        for (var i = 1; i < $dataClasses.length; i++) {
            if (this.classHasStype($dataClasses[i], stypeId))
                return $dataClasses[i];
        }
        return null;
    };

    var Window_ActorCommand_cursorLeft = Window_ActorCommand.prototype.cursorLeft;
    Window_ActorCommand.prototype.cursorLeft = function (wrap) {
        Window_ActorCommand_cursorLeft.call(this, wrap);
        var scene = SceneManager._scene;
        scene._backTo = 'party_window';
        scene.selectPreviousCommand();
        scene._actorCommandWindow._helpWindow.hide();
    };

    Window_ActorCommand.prototype.classHasStype = function (classObj, stypeId) {
        if (!classObj.name.length) return false;
        var SKILL_TYPE_TRAIT = 41;
        var traits = classObj.traits;
        for (var i = 0; i < traits.length; i++) {
            if (traits[i].code == SKILL_TYPE_TRAIT && traits[i].dataId == stypeId)
                return true;
        }
        return false;
    };

    Window_ActorCommand.prototype.item = function () {
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    };

    Window_ActorCommand.prototype.updatePlacement = function () {
        this.x = this._actor.screenX() - this.width - 25;
        this.y = this._actor.screenY() - this._actor.battleSprite()._frame.height;
        if (this.x + this.windowWidth() > Graphics.boxWidth)
            this.x = this._actor.screenX() - this.windowWidth() - this._actor.battleSprite()._frame.width;
        this.height = this.fittingHeight(this._list.length);
        this.refresh();
    };

    Window_ActorCommand.prototype.makeCommandList = function () {
        if (this._actor) {
            this.addAttackCommand();
            this.addSkillCommands();
            this.addItemCommand();
        }
    };

    Window_ActorCommand.prototype.moveRight = function (amount) {
        this.x += amount;
    };

    Window_ActorCommand.prototype.addSkillCommands = function () {
        var skillTypes = this._actor.addedSkillTypes();
        skillTypes.forEach(function (stypeId) {
            var name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, 'skill', true, stypeId);
        }, this);
        this._actor.commandSkills().forEach(function (skill) {
            if (skill) {
                this.addCommand(skill.name, 'direct skill', this._actor.canUse(skill), skill.id);
            }
        }, this);

        Window_ActorCommand.prototype.addAttackCommand = function () {
            this.addCommand(TextManager.attack, 'attack', this._actor.canAttack(), null, '');
            var index = this.findSymbol('attack');
            if (index < 0) return;
            var name = $dataSkills[this._actor.attackSkillId()].commandAttackText;
            this._list[index].name = name;
            this._list[index].description = $dataSkills[this._actor.attackSkillId()].description;
        };

        Window_ActorCommand.prototype.addGuardCommand = function () {
            this.addCommand(TextManager.guard, 'guard', this._actor.canGuard(), null, '');
            var index = this.findSymbol('guard');
            if (index < 0) return;
            var name = $dataSkills[this._actor.guardSkillId()].commandGuardText;
            this._list[index].name = name;
            this._list[index].description = $dataSkills[this._actor.guardSkillId()].description;
        };

        Window_ActorCommand.prototype.addItemCommand = function () {
            this.addCommand(TextManager.item, 'item', true, null, TIKA.BS.Param.ItemCommandDesc);
        };

        Window_ActorCommand.prototype.addCommand = function (name, symbol, enabled, ext, desc) {
            if (enabled === undefined) {
                enabled = true;
            }
            if (ext === undefined) {
                ext = null;
            }
            if (desc === undefined) {
                desc = '';
            }
            this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext, description: desc });
        };
    }

    Window_ActorCommand.prototype.drawItem = function (index) {
        this.contents.fontSize = 20;
        if (this.textWidth(this.commandName(index)) > this.width - 2 * this.padding - 2 * this.textPadding()) {
            this.width = this.textWidth(this.commandName(index)) + 2 * this.padding + 2 * this.textPadding();
        }
        var rect = this.itemRectForText(index);
        var align = 'left';
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x + 2, rect.y, rect.width, align);
        if (index === 0 && this.active) {
            this.contents.fontSize = 12;
            this.drawText('\u2b9c', rect.x - 6.5, rect.y - 5, 30, align);
        }
        this.resetFontSettings();
    };

    Window_ActorCommand.prototype.itemRectForText = function (index) {
        var rect = this.itemRect(index);
        rect.x += this.textPadding();
        return rect;
    };

    Window_ActorCommand.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };


    Window_ActorCommand.prototype.windowWidth = function () {
        return 64;
    };

    Window_ActorCommand.prototype.standardPadding = function () {
        return 5;
    };

    Window_ActorCommand.prototype.textPadding = function () {
        return 8;
    };

    Window_ActorCommand.prototype.lineHeight = function () {
        return 22;
    };

    // ============================================================================
    //                    Window_ActorCommand
    // ============================================================================

    Window_BattleSkill.prototype.updatePlacement = function () {
        var scene = this.parent.parent;
        this.x = scene._actorCommandWindow.x + scene._actorCommandWindow.width;
        this.y = scene._actorCommandWindow.y;
        this.width = Graphics.boxWidth - this.x;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = scene._actorCommandWindow.y + scene._actorCommandWindow._cursorRect.height - this.height;
        }
    };


    Window_BattleSkill.prototype.show = function () {
        this.selectLast();
        this.showHelpWindow();
        this.updatePlacement();
        // this._helpWindow.updatePlacement(this.x, this.y, this._cursorRect);
        this.opacity = 255;
        this.margin = 0;
        Window_SkillList.prototype.show.call(this);
    };

    Window_BattleSkill.prototype.hide = function () {
        this.hideHelpWindow();
        Window_SkillList.prototype.hide.call(this);
    };


    Window_BattleSkill.prototype.makeItemList = function () {
        if (this._actor) {
            this._data = this._actor.skills().filter(function (item) {
                return this.includes(item);
            }, this);
        } else {
            this._data = [];
        }
    };

    Window_BattleSkill.prototype.includes = function (item) {
        return (item && item.stypeId === this._stypeId) && !this.isCommandSkill(item) && this.isBattleSkill(item);
    };

    Window_BattleSkill.prototype.isCommandSkill = function (item) {
        return item.equipTier === 3;
    };

    Window_BattleSkill.prototype.isBattleSkill = function (item) {
        return item.equipTier === 1 || item.equipTier === 2;
    };


    Window_BattleSkill.prototype.numVisibleRows = function () {
        return 5;
    };

    Window_BattleSkill.prototype.drawItem = function (index) {
        var skill = this._data[index];
        if (skill) {
            this.contents.fontSize = 20;
            var costWidth = this.costWidth();
            var rect = this.itemRect(index);
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
            this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
            this.resetFontSettings();
        }
    };
    var Window_BattleSkill_cursorDown = Window_BattleSkill.prototype.cursorDown;
    Window_BattleSkill.prototype.cursorDown = function (wrap) {
        if (this.index() + 1 >= this._data.length) {
            this.select(0);
            // this._helpWindow.updatePlacement(this.x, this.y, this._cursorRect);
            return;
        }
        Window_BattleSkill_cursorDown.call(this, wrap);
    };

    var Window_BattleSkill_cursorUp = Window_BattleSkill.prototype.cursorUp;
    Window_BattleSkill.prototype.cursorUp = function (wrap) {
        if (this.index() - 1 < 0) {
            this.select(this._data.length - 1);
            // this._helpWindow.updatePlacement(this.x, this.y + this._cursorRect.y, this._cursorRect);
            return;
        }
        Window_BattleSkill_cursorUp.call(this, wrap);
    };

    Window_BattleSkill.prototype.standardPadding = function () {
        return 5;
    };

    Window_BattleSkill.prototype.textPadding = function () {
        return 6;
    };

    Window_SkillList.prototype.costWidth = function () {
        return this.textWidth('0000') + Window_Base._iconWidth;
    };

    Window_BattleSkill.prototype.updateHelpWindowPlacement = function () {
        this.refresh();
    };

    // ============================================================================
    //                    Window_ActorCommand
    // ============================================================================
    var Window_PartyCommand_setup = Window_PartyCommand.prototype.setup;
    Window_PartyCommand.prototype.setup = function () {
        Window_PartyCommand_setup.call(this);
        this.x = Graphics.boxWidth / 2 - this.width / 2;
        this.y = Graphics.boxHeight / 2 - this.height / 2;
        if(this._helpWindow)
            this._helpWindow.updatePlacement(this.x, this.y, this._cursorRect);
    };


    // ============================================================================
    //                    Window_BattleStatus
    // ============================================================================.

    Window_BattleStatus.prototype.initialize = function (ww, wh) {
        var width = ww || this.windowWidth();
        var height = wh || this.windowHeight();
        var x = Graphics.boxWidth;
        var y = Graphics.boxHeight;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.openness = 0;
        this.opacity = 0;
        this.padding = 5;
        this.margin = 0;
    };

    Window_BattleStatus.prototype.windowWidth = function () {
        return Graphics.boxWidth;
    };

    Window_BattleStatus.prototype.numVisibleRows = function () {
        return this.rowsPerActor();
    };

    Window_BattleStatus.prototype.standardPadding = function () {
        return 5;
    };

    Window_BattleStatus.prototype.textPadding = function () {
        return 5;
    };

    Window_BattleStatus.prototype.maxCols = function () {
        return 3;
    };

    Window_BattleStatus.prototype.maxItems = function () {
        return $gameParty.battleMembers().length;
    };

    Window_BattleStatus.prototype.refresh = function () {
        this.contents.clear();
        this.drawAllItems();
    };

    Window_BattleStatus.prototype.drawAllItems = function () {
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
    };

    Window_BattleStatus.prototype.drawItem = function (index) {
        var actor = $gameParty.battleMembers()[index];
        this.drawBasicArea(this.basicAreaRect(index), actor);
        this.drawGaugeArea(this.gaugeAreaRect(index), actor);
    };

    Window_BattleStatus.prototype.basicAreaRect = function (index) {
        return this.itemRectForText(index);
    };

    Window_BattleStatus.prototype.rowsPerActor = function () {
        return 6;
    }

    Window_BattleStatus.prototype.itemHeight = function () {
        return this.height - this.padding * 2;
    }

    Window_BattleStatus.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };


    Window_BattleStatus.prototype.drawGaugeAreaWithTp = function (rect, actor) {
        var totalArea = this.gaugeAreaWidth() / this.maxCols() - this.padding * 2 - 5;
        var offset = this.textPadding() * 2 + this.lineHeight() * 3;
        this.contents.fontSize = 16;
        this.drawActorHp(actor, rect.x + offset, rect.y + this.lineHeight() + this.textPadding(), totalArea - offset);
        this.drawActorMp(actor, rect.x + offset, rect.y + this.lineHeight() * 2 + this.textPadding(), totalArea - offset);
        this.drawActorTp(actor, rect.x + offset, rect.y + this.lineHeight() * 3 + this.textPadding(), totalArea - offset);
        this.resetFontSettings();
    };

    Window_BattleStatus.prototype.drawActorHp = function (actor, wx, wy, ww) {
        ww = ww || 186;
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        if (actor.barrierPoints() > 0) {
            ww = this.drawBarrierGauge(actor, wx, wy, ww);
        } else {
            this.drawGauge(wx, wy, ww, actor.hpRate(), color1, color2);
        }
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA, wx, wy - 4, 44);
        var c1 = this.hpColor(actor);
        var c2 = this.normalColor();
        this.drawCurrentAndMax(actor.hp, actor.mhp, wx, wy - 4, ww, c1, c2);
    };

    Window_Base.prototype.drawGauge = function (dx, dy, dw, rate, color1, color2) {
        var color3 = this.gaugeBackColor();
        var fillW = Math.floor(Math.floor(dw * rate).clamp(0, dw));
        var gaugeH = this.gaugeHeight();
        var gaugeY = dy + this.lineHeight() - gaugeH - 2;
        if (eval(Yanfly.Param.GaugeOutline)) {
            color3.paintOpacity = this.translucentOpacity();
            this.contents.fillRect(dx, gaugeY - 1, dw, gaugeH, color3);
            fillW = Math.max(fillW - 2, 0);
            gaugeH -= 2;
            dx += 1;
        } else {
            var fillW = Math.floor(dw * rate);
            var gaugeY = dy + this.lineHeight() - gaugeH - 2;
            this.contents.fillRect(dx, gaugeY, dw, gaugeH, color3);
        }
        this.contents.gradientFillRect(dx, gaugeY, fillW, gaugeH, color1, color2);
    };

    Window_BattleStatus.prototype.drawActorMp = function (actor, x, y, width) {
        width = width || 186;
        var color1 = this.mpGaugeColor1();
        var color2 = this.mpGaugeColor2();
        this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.mpA, x, y - 4, 44);
        this.drawCurrentAndMax(actor.mp, actor.mmp, x, y - 4, width,
            this.mpColor(actor), this.normalColor());
    };

    Window_BattleStatus.prototype.drawActorTp = function (actor, x, y, width) {
        width = width || 96;
        var color1 = this.tpGaugeColor1();
        var color2 = this.tpGaugeColor2();
        this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.tpA, x, y - 4, 44);
        this.changeTextColor(this.tpColor(actor));
        this.drawText(actor.tp, x + width - 64, y - 4, 64, 'right');
    };

    Window_BattleStatus.prototype.gaugeAreaRect = function (index) {
        var rect = this.itemRectForText(index);
        rect.x += rect.width;
        return rect;
    };

    Window_BattleStatus.prototype.lineHeight = function () {
        return 21;
    };

    Window_BattleStatus.prototype.drawItem = function (index) {
        var actor = $gameParty.battleMembers()[index];
        this.drawBasicArea(this.basicAreaRect(index), actor);
        this.drawGaugeArea(this.basicAreaRect(index), actor);
    };

    Window_BattleStatus.prototype.gaugeAreaWidth = function () {
        return this.width - 2 * this.padding;
    };

    Window_BattleStatus.prototype.drawBasicArea = function (rect, actor) {
        this.drawActorFace(actor, rect.x + this.textPadding(), rect.y + this.lineHeight() + this.textPadding());
        this.contents.fontSize = 20;
        this.drawActorName(actor, (rect.x + this.textPadding()), rect.y, this.width);
        this.resetFontSettings();
        this.drawActorIcons(actor, rect.x + 0, rect.y + rect.height - this.lineHeight() * 2 + this.textPadding(), this.width);
    };

    Window_BattleStatus.prototype.drawActorFace = function (actor, x, y, width, height) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    };

    Window_BattleStatus.prototype.drawFace = function (faceName, faceIndex, x, y, width, height) {
        width = width || Window_Base._faceWidth;
        height = height || Window_Base._faceHeight;
        var bitmap = ImageManager.loadFace(faceName);
        var pw = Window_Base._faceWidth;
        var ph = Window_Base._faceHeight;
        var sw = Math.min(width, pw);
        var sh = Math.min(height, ph);
        var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        var sx = faceIndex % 4 * pw + (pw - sw) / 2;
        var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
        var imageWH = 3 * this.lineHeight();
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, imageWH, imageWH);
    };

    // ============================================================================
    //                    Window_BattleItem
    // ============================================================================


    Window_BattleItem.prototype.show = function () {
        this.selectLast();
        this.showHelpWindow();
        this.updatePlacement();
        // this._helpWindow.updatePlacement(this.x, this.y, this._cursorRect);
        this.refresh();
        Window_ItemList.prototype.show.call(this);
    };


    Window_BattleItem.prototype.maxCols = function () {
        return 1;
    };

    Window_BattleItem.prototype.updatePlacement = function () {
        var scene = this.parent.parent;
        this.x = scene._actorCommandWindow.x + scene._actorCommandWindow.width;
        this.y = scene._actorCommandWindow.y;
        this.width = Graphics.boxWidth - this.x;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = scene._actorCommandWindow.y + scene._actorCommandWindow._cursorRect.height - this.height;
        }
    };

    Window_BattleItem.prototype.standardPadding = function () {
        return 5;
    };

    Window_BattleItem.prototype.textPadding = function () {
        return 6;
    };

    Window_BattleItem.prototype.makeItemList = function () {
        this._data = $gameParty.allItems().filter(function (item) {
            return this.includes(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
        this._data.sort(function (a, b) {
            if (!a || !b) return 0;
            if (a.id < b.id) { return -1; }
            if (a.id > b.id) { return 1; }
            return 0;
        })
    };

    Window_BattleItem.prototype.drawItem = function (index) {
        var item = this._data[index];
        if (item) {
            this.contents.fontSize = 20;
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x + this.textPadding(), rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
            this.resetFontSettings();
        }
    };

    Window_BattleItem.prototype.drawItemName = function (item, x, y, width) {
        width = width || 312;
        if (item) {
            this.resetTextColor();
            this.drawText(item.name, x, y, width);
        }
    };

    // ============================================================================
    //                    Window_Description
    // ============================================================================

    function Window_Description() {
        this.initialize.apply(this, arguments);
    }

    Window_Description.prototype = Object.create(Window_Help.prototype);
    Window_Description.prototype.constructor = Window_Description;

    Window_Description.prototype.standardPadding = function () {
        return this.getFontSize() / 1.5;
    };

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

    var Window_Description_updatePlacement = Window_Description.prototype.updatePlacement;
    Window_Description.prototype.updatePlacement = function (x, y, rect) {
        if ($gameParty.inBattle()) {
            if (this._text.replace(/<WordWrap>/g, '').length < 1) {
                this.close();
                return;
            }
            this.show();
            this.open();
            this._refreshBack();
            this.opacity = 255;
            this.backOpacity = this.standardBackOpacity();
            this.padding = this.getFontSize() / 2;
            this.y = y; //+ rect.height + this.padding / 2;
//=============================================================================
// Chaucer : make the description window appear on the left side.
//=============================================================================
            // this.x = x + rect.width;
            this.x = x - this.width;
//=============================================================================
            if (this.y + this.height > Graphics.boxHeight) {
                this.y = y + rect.height - this.height;
            }
            if (this.x + this.width > Graphics.boxWidth) {
                while (this.x + this.width > Graphics.boxWidth)
                    this.x -= 1;
            }
        } else {
            Window_Description_updatePlacement.call(this, x, y, rect);
        }
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
    };

    Window_Description.prototype.lineHeight = function () {
        return 26;
    };

    Window_Description.prototype.getFontSize = function () {
        if (SceneManager._scene instanceof Scene_Skill)
            return TIKA.SM.Param.DescFontSize;
        else if (SceneManager._scene instanceof Scene_Battle)
            return TIKA.BS.Param.DescFontSize;
        else if (SceneManager._scene instanceof Scene_Equip)
            return TIKA.EM.Param.DescFontSize;
        else if (SceneManager._scene instanceof Scene_Class)
            return TIKA.JM.Param.DescFontSize;
    };

    // ============================================================================
    //                    Game_Actor
    // ============================================================================

    Game_Actor.prototype.skills = function () {
        var list = [];
        this._skills.concat(this.addedSkills()).forEach(function (id) {
            if (!list.contains($dataSkills[id])) {
                list.push($dataSkills[id]);
            }
        });
        return list;
    };

    // ============================================================================
    //                    Game_Action
    // ============================================================================

    Game_Action.prototype.addActorDamageDealtToVariable = function (value) {
        if (this.item().damage.type == HP_RECOVER ||
            this.item().damage.type == MP_RECOVER)
            value = (-value);
        $gameVariables.setValue(TIKA.BS.Param.ActorDamageDealtVar, value);
    };

    Game_Action.prototype.addEnemyDamageDealtToVariable = function (value) {
        if (this.item().damage.type == HP_RECOVER ||
            this.item().damage.type == MP_RECOVER)
            value = (-value);
        $gameVariables.setValue(TIKA.BS.Param.EnemyDamageDealtVar, value);
    };

    var Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        if (this.subject().isActor())
            this.addActorDamageDealtToVariable(value);
        else if (this.subject().isEnemy())
            this.addEnemyDamageDealtToVariable(value);
        Game_Action_executeHpDamage.call(this, target, value);

    };

    Game_Action.prototype.itemEffectSpecial = function(target, effect) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        if (target.isActor() && $gameParty.size() === 1) {
            BattleManager.endBattle(1);
            BattleManager.updateBattleEnd();
        } else {
            target.escape();
            this.makeSuccess(target);
        }
    }
};

    // ============================================================================
    //                    Window_CTBIcon
    // ============================================================================
    if (Yanfly.Param.CTBTurnDirection == 'down') {

        Window_CTBIcon.prototype.update = function () {
            Window_Base.prototype.update.call(this);
            this.updateBattler();
            this.updateIconIndex();
            this.updateRedraw();
            this.updateDestinationY();
            this.updateOpacity();
            this.updatePositionX();
            this.updatePositionY();
        };

        Window_CTBIcon.prototype.destinationX = function () {
            var value = this._destinationX - this.standardPadding() * 2;
            if (!this._battler) return value;
            if (this._battler.isSelected()) {
                value -= this.contents.width / 4;
            }
            return value;
        };

        Window_CTBIcon.prototype.updatePositionX = function () {
            if (BattleManager._escaped) return;
            if (this._destinationY !== this.y) {
                var desY = this._destinationY;
                var cap1 = this.destinationX() - (this.contents.width / 2 - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize);
                var cap2 = this.destinationX() + (this.contents.width / 2 - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize);
                var moveAmount = Math.max(1, Math.abs(cap2 - this.x) / 4);
                if (this.y < desY) this.x = Math.max(this.x - moveAmount, cap1);
                if (this.y > desY) this.x = Math.min(this.x + moveAmount, cap2);
            } else if (this.destinationX() !== this.x) {
                var desX = this.destinationX();
                var moveAmount = Math.max(1, Math.abs(desX - this.x) / 4);
                if (this.x < desX) this.x = Math.max(this.x - moveAmount, desX);
                if (this.x > desX) this.x = Math.min(this.x + moveAmount, desX);
            }
        };

        Window_CTBIcon.prototype.updatePositionY = function () {
            if (this._destinationY === undefined) return;
            if (BattleManager._escaped) return;
            var desY = this._destinationY;
            var moveAmount = Math.max(1, Math.abs(desY - this.y) / 4);
            if (this.y > desY) this.y = Math.max(this.y - moveAmount, desY);
            if (this.y < desY) this.y = Math.min(this.y + moveAmount, desY);
        };


        Window_CTBIcon.prototype.updateDestinationRightAlign = function () {
            this._destinationY = this.standardPadding();
            this._destinationX = Graphics.boxWidth;
            var constant = this.destinationXConstant();
            this._destinationX -= TIKA.BS.Param.xOffset;
            this._destinationX -= (constant * 2);
            this._destinationX += 8;
        };

        Window_CTBIcon.prototype.updateDestinationLeftAlign = function () {
            this._destinationY = this.standardPadding();
            this._destinationX = 0;
            var constant = this.destinationXConstant();
            this._destinationX += TIKA.BS.Param.xOffset;
            this._destinationX += 2;
        };

        Window_CTBIcon.prototype.updateDestinationCenterAlign = function () {
            this._destinationY = this.standardPadding();
            this._destinationX = Graphics.boxWidth / 2;
            this._destinationX -= this.standardPadding() * 2;
            var constant = this.destinationXConstant();
            this._destinationX -= constant / 2;
            this._destinationX += 2;
        };

        Window_CTBIcon.prototype.destinationXConstant = function () {
            return this.contents.width + 2 - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
        };

        Window_CTBIcon.prototype.updateDestinationY = function () {
            if (!this._battler) return;
            if (this._battler.isDead()) return;
            if (this._position === 'left') this.updateDestinationLeftAlign();
            if (this._position === 'center') this.updateDestinationCenterAlign();
            if (this._position === 'right') this.updateDestinationRightAlign();
            if (this._direction === 'left') this.updateDestinationGoingLeft();
            if (this._direction === 'down') this.updateDestinationGoingDown();
            if (this._direction === 'right') this.updateDestinationGoingRight();
        };

        Window_CTBIcon.prototype.updateDestinationGoingDown = function (index) {
            this._destinationY = 0;
            var index = BattleManager.ctbTurnOrder().indexOf(this._battler);
            if (index < 0) index = BattleManager.ctbTurnOrder().length + 5;
            var constant = this.destinationYConstant();
            this._destinationY += index * constant;
            if (index !== 0) {
                this._destinationY += constant / 2;
            }
        };

        Window_CTBIcon.prototype.destinationY = function () {
            var value = Yanfly.Param.CTBTurnPosY - this.standardPadding();
            var scene = SceneManager._scene;
            if (scene && scene._helpWindow.visible) {
                value = Math.max(value, scene._helpWindow.height);
            }
            if (!this._battler) return value;
            if (this._battler.isSelected()) {
                value -= this.contents.height / 4;
            }
            return value;
        };


        Window_CTBIcon.prototype.destinationYConstant = function () {
            return this.contents.height + 2 - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
        };


        Window_CTBIcon.prototype.initialize = function (mainSprite) {
            this._mainSprite = mainSprite;
            var width = this.iconWidth() + 8 + this.standardPadding() * 6;
            var height = this.iconHeight() + 8 + this.standardPadding() * 6;
            this._redraw = false;
            this._position = Yanfly.Param.CTBTurnPosX.toLowerCase();
            this._direction = Yanfly.Param.CTBTurnDirection.toLowerCase();
            this._lowerWindows = eval(Yanfly.Param.BECLowerWindows);
            Window_Base.prototype.initialize.call(this, 0, 0, width, height);
            this.opacity = 0;
            this.contentsOpacity = 0;
        };

        Window_CTBIcon.prototype.standardSize = function () {
            return this.iconWidth() + 8 + this.standardPadding() * 2;
        };

        Window_CTBIcon.prototype.updateRedraw = function () {
            if (!this._redraw) return;
            if (!this._image) return;
            if (this._image.width <= 0) return;
            this._redraw = false;
            this.contents.clear();
            var battlers = this.ctbTurnOrder();
            if (battlers.indexOf(this._battler) == 0)
                TIKA.BS.CurrentCTBIconSize = TIKA.BS.Param.CurrentCTBIconSize;
            else
                TIKA.BS.CurrentCTBIconSize = 0;
            this.drawBorder();
            this.drawInitiative();
            if (this._iconIndex > 0) {
                this.drawIcon(this._iconIndex, 4, 4);
            } else if (this._battler.isActor()) {
                this.redrawActorFace();
            } else if (this._battler.isEnemy()) {
                this.redrawEnemy();
            }
            this.redrawLetter();
        };

        Window_CTBIcon.prototype.ctbTurnOrder = function () {
            var battlers = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
            battlers.sort(function (a, b) {
                if (a._order < b._order) return -1;
                if (a._order > b._order) return 1;
                return 0;
            });
            return battlers;
        };

        Window_CTBIcon.prototype.drawBorder = function () {
            var width = (this.contents.width - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize) * 2;
            var height = this.contents.height - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            this.contents.fillRect(0, 0, width, height, this.gaugeBackColor());
            width -= 2;
            height -= 2;
            this.contents.fillRect(1, 1, width, height, this.ctbBorderColor());
            width -= 4;
            height -= 4;
            this.contents.fillRect(3, 3, width, height, this.gaugeBackColor());
            width -= 2;
            height -= 2;
            this.contents.fillRect(4 + width / 2, 4, width / 2, height, this.ctbBackgroundColor());
            this.contents.fillRect(4, 4, width / 2, height, this.textColor(TIKA.BS.Param.CTBInitiativeBGColor));
        };

        Window_CTBIcon.prototype.drawInitiative = function () {
            var width = (this.contents.width - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize) * 2;
            var height = this.contents.height - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            this.contents.fontSize = width / 4 + TIKA.BS.Param.CTBInitiativeFontSizePlus;
            this.drawText(this._battler._originalRoll, 2, height / 2 - this.lineHeight() / 2, width / 2, 'center');
            this.resetFontSettings();
        };

        Window_CTBIcon.prototype.redrawLetter = function () {
            if (!this._battler.isEnemy()) return;
            if (!this._battler._plural) return;
            var letter = this._battler._letter;
            var dw = this.contents.width - 3 - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            var fontSize = dw / 2;
            this.contents.fontSize = fontSize;
            var dy = this.contents.height - fontSize / 2 - this.standardPadding() * 5 + TIKA.BS.CurrentCTBIconSize;
            this.drawText(letter, dw, dy, dw, 'right');
            this.resetFontSettings();
        };

        Window_CTBIcon.prototype.redrawActorFace = function () {
            var width = Window_Base._faceWidth;
            var height = Window_Base._faceHeight;
            var faceIndex = this._battler.faceIndex();
            var bitmap = this._image;
            var pw = Window_Base._faceWidth;
            var ph = Window_Base._faceHeight;
            var sw = Math.min(width, pw);
            var sh = Math.min(height, ph);
            var dx = Math.floor(Math.max(width - pw, 0) / 2);
            var dy = Math.floor(Math.max(height - ph, 0) / 2);
            var sx = faceIndex % 4 * pw + (pw - sw) / 2;
            var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
            var dw = this.contents.width - 4 - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            var dh = this.contents.height - 8 - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            this.contents.blt(bitmap, sx, sy, sw, sh, dx + 4 + dw, dy + 4, dw, dh);
        };

        Window_CTBIcon.prototype.redrawEnemy = function () {
            if (this.isUsingSVBattler()) {
                return this.redrawSVEnemy();
            };
            var bitmap = this._image;
            var sw = bitmap.width;
            var sh = bitmap.height;
            var dw = this.contents.width - 8;
            var dh = this.contents.height - 8;
            var dx = 0;
            var dy = 0;
            if (sw >= sh) {
                var rate = sh / sw;
                dh *= rate;
                dy += this.contents.height - 8 - dh;
            } else {
                var rate = sw / sh;
                dw *= rate;
                dx += Math.floor((this.contents.width - 8 - dw) / 2);
            }
            dw = dw - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            dh = dh - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            this.contents.blt(bitmap, 0, 0, sw, sh, dx + 10 + dw, dy + 4, dw, dh);
        };

        Window_CTBIcon.prototype.redrawSVEnemy = function () {
            var bitmap = this._image;
            var sw = bitmap.width / 9;
            var sh = bitmap.height / 6;
            var dw = this.contents.width - 8 - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            var dh = this.contents.height - 8 - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            var dx = 0;
            var dy = 0;
            if (sw >= sh) {
                var rate = sh / sw;
                dh *= rate;
                dy += this.contents.height - 8 - dh;
            } else {
                var rate = sw / sh;
                dw *= rate;
                dx += Math.floor((this.contents.width - 8 - dw) / 2);
            }
            dy = dy - this.standardPadding() * 4 + TIKA.BS.CurrentCTBIconSize;
            this.contents.blt(bitmap, 0, 0, sw, sh, dx + 10 + dw, dy + 4, dw, dh);
        };


        // ============================================================================
        //                    BattleManager
        // ============================================================================

        BattleManager.redrawCTBIcons = function () {
            var battlers = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
            var max = battlers.length;
            for (var i = 0; i < max; ++i) {
                var member = battlers[i];
                if (!member) continue;
                if (!member.battler()._ctbIcon) continue;
                member.battler()._ctbIcon.forceRedraw();
            }
        };

    }

    // ============================================================================
    //                    Window_Base
    // ============================================================================

    Window_Base.prototype.convertEnemyName = function (text) {
        text = text.replace(/\x1bEN\[(\d+)\]/gi, function () {
            var enemyId = arguments[1];
            if (enemyId <= 0) return '';
            name = $dataEnemies[enemyId].name;
            return name;
        }.bind(this));
        text = text.replace(/\x1bET\[(\d+)\]/gi, function () {
            var index = Math.max(0, arguments[1]);
            var enemy = $gameTroop.allMembers()[index];
            if (enemy) {
                return enemy.name();
            } else {
                return '';
            }
        }.bind(this));
        return text;
    };

    // ============================================================================
    //                      Window_PartyCommand
    // ============================================================================

    Window_PartyCommand.prototype.numVisibleRows = function () {
        return 7;
    };

    Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
    Window_PartyCommand.prototype.makeCommandList = function () {
        this.addSkillCommands();
        this.makeInBattleStatusCommand();
        this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
        this.addCommand('Log', 'log');
    };

    Window_PartyCommand.prototype.update = function () {
        Window_Command.prototype.update.call(this);
        if (this._helpWindow && this.active) {
            if (this._list[this.index()].symbol === 'skill') {
                var stypeId = this._list[this.index()].ext;
                var classObj = this.findClassWithStypeId(stypeId);
                if (classObj)
                    this._helpWindow.setItem({ description: classObj._skillsDescription });
            }
            else if (this._list[this.index()].symbol === 'direct skill') {
                this._helpWindow.setItem($dataSkills[this._list[this.index()].ext]);
            }
            else if (this._list[this.index()].symbol === 'escape') {
                this._helpWindow.setItem({ description: "Attempt to run from battle." });

            } else if (this._list[this.index()].symbol === 'log') {
                this._helpWindow.setItem({ description: "Scroll through the battle log." });
            }
            else if (this._list[this.index()].symbol === 'inBattleStatus') {
                this._helpWindow.setItem({ description: "Inspect attributes and effects." });
            } else
                this._helpWindow.setItem({ description: this._list[this.index()].description });
            this._helpWindow.updatePlacement(this.x, this.y, this._cursorRect);
        }
    };

    Window_PartyCommand.prototype.makeInBattleStatusCommand = function () {
        if (!$gameSystem.isShowInBattleStatus()) return;
        var text = Yanfly.Param.IBSCmdName;
        this.addCommand(text, 'inBattleStatus', true);
    };


    Window_PartyCommand.prototype.drawItem = function (index) {
        this.contents.fontSize = 20;
        if (this.textWidth(this.commandName(index)) > this.width - 2 * this.padding - 2 * this.textPadding()) {
            this.width = this.textWidth(this.commandName(index)) + 2 * this.padding + 2 * this.textPadding();
        }
        var rect = this.itemRectForText(index);
        var align = 'left';
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
        if (index === 0 && this.active) {
            this.contents.fontSize = 12;
            this.drawText('\u2b9e', rect.x + rect.width - 17.5, rect.y - 6.5, 30, align);
        }
        this.resetFontSettings();
    };


    var Window_PartyCommand_cursorRight = Window_PartyCommand.prototype.cursorRight;
    Window_PartyCommand.prototype.cursorRight = function (wrap) {
        Window_PartyCommand_cursorRight.call(this, wrap);
        var scene = SceneManager._scene;
        scene._backTo = '';
        this.processCancel();
        scene._partyCommandWindow._helpWindow.hide();
    };

    Window_PartyCommand.prototype.updatePlacement = function (actorCommandWindow) {
        this.x = actorCommandWindow.x - this.width;
        this.y = actorCommandWindow.y;
        this.height = this.fittingHeight(this._list.length);
        this.refresh();
    };

    Window_PartyCommand.prototype.setup = function () {
        this.clearCommandList();
        this.makeCommandList();
        this.select(0);
        this.activate();
        this.open();
    };

    Window_PartyCommand.prototype.itemRectForText = function (index) {
        var rect = this.itemRect(index);
        rect.x += this.textPadding();
        return rect;
    };

    Window_PartyCommand.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };

    Window_PartyCommand.prototype.windowWidth = function () {
        return 64;
    };

    Window_PartyCommand.prototype.standardPadding = function () {
        return 5;
    };

    Window_PartyCommand.prototype.textPadding = function () {
        return 8;
    };

    Window_PartyCommand.prototype.lineHeight = function () {
        return 26;
    };

    // ============================================================================
    //                    BattleManager
    // ============================================================================

    var BattleManager_selectNextCommand = BattleManager.selectNextCommand;
    BattleManager.selectNextCommand = function () {
        if (this.isCTB()) {
            if (!this.actor()) return this.setCTBPhase();
            this.resetNonPartyActorCTB();
            this._subject = this.actor();
            this.actor().setupCTBCharge();
            if (this.actor().isCTBCharging()) {
                this.actor().requestMotionRefresh();
                this._actorIndex = undefined;
                this.setCTBPhase();
            } else if (this.isValidCTBActorAction()) {
                this.startCTBAction(this.actor());
            } else {
                if (this.actor()) this.ctbSkipTurn();
                $gameParty.requestMotionRefresh();
                this.setCTBPhase();
            }
        } else {
            BattleManager_selectNextCommand.call(this);
        }
    };

    BattleManager.ctbSkipTurn = function () {
        this.actor().clearActions();
        this.actor().setActionState('undecided');
        this.actor().requestMotionRefresh();
        if (!this._bypassCtbEndTurn) this.actor().endTurnAllCTB();
    };

    // ============================================================================
    //                    Window_Help
    // ============================================================================

    Window_Help.prototype.drawBattler = function (battler) {
        var text = battler.name();
        var wx = 0;
        var wy = (this.contents.height - this.lineHeight()) / 2;
        this._text = text;
        var width = this.textWidth(this._text);
        this.drawText(text, wx, wy, width, 'center');
    };

    Window_Help.prototype.drawAllTargets = function () {
        var text = 'All';
        var wx = 0;
        var wy = (this.contents.height - this.lineHeight()) / 2;
        this._text = text;
        var width = this.textWidth(this._text);
        this.drawText(text, wx, wy, width, 'center');
    };

    Window_Help.prototype.drawSelfTarget = function (action) {
        if (action._subjectActorId) {
            var text = $gameActors._data[action._subjectActorId].name();
            var wx = 0;
            var wy = (this.contents.height - this.lineHeight()) / 2;
            this._text = text;
            var width = this.textWidth(this._text);
            this.drawText(text, wx, wy, width, 'center');
        }
    };

    var Window_Help_drawSpecialSelectionText = Window_Help.prototype.drawSpecialSelectionText;
    Window_Help.prototype.drawSpecialSelectionText = function (action) {
        if (action.isForAll()) {
            BattleManager.startAllSelection();
            this.drawAllTargets();
        } else if (action.isForUser()) {
            // BattleManager.startAllSelection();
            this.drawSelfTarget(action);
            Window_Help_drawSpecialSelectionText.call(this, action);
        } else {
            Window_Help_drawSpecialSelectionText.call(this, action);
        }
    };

    Window_Help.prototype.setBattler = function (battler) {
        this.contents.clear();
        this.clear();
        this.resetFontSettings();
        if (!$gameParty.inBattle()) return;
        if (!battler) return;
        var action = BattleManager.inputtingAction();
        if (this.specialSelectionText(action)) {
            this.drawSpecialSelectionText(action);
        } else {
            this.drawBattler(battler);
        }
    };

})();
