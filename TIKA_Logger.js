/*:
 * @plugindesc v1.2 Battle and world log window..
 * @author TIKA
 * 
 * @param ---Battle Log Window---
 * @default
 * 
 * @param BattleFontSize
 * @text Font size:
 * @default 16
 * @parent ---Battle Log Window---
 * 
 * @param BattleFontName
 * @text Font name:
 * @default GameFont
 * @parent ---Battle Log Window---
 * 
 * @param BattleLinesVisible
 * @text Number of visible lines:
 * @default 10
 * @parent ---Battle Log Window---
 * 
 * @param BattleLogWidth
 * @text Width(%):
 * @default 33
 * @parent ---Battle Log Window---
 * 
 * @param BattleLogEvalChar
 * @text Eval character:
 * @default |
 * @parent ---Battle Log Window---
 * 
 * @param BattleLogOption
 * @text Option name:
 * @default Battle Log
 * @parent ---Battle Log Window---
 * 
 * @param ---Overworld Log Window---
 * @default
 * 
 * @param WorldFontSize
 * @text Font size:
 * @default 16
 * @parent ---Overworld Log Window---
 * 
 * @param WorldFontName
 * @text Font name:
 * @default GameFont
 * @parent ---Overworld Log Window---
 * 
 * @param FadeTimeout
 * @text FadeTimeout(ms):
 * @default 3000
 * @parent ---Overworld Log Window---
 * 
 * @param WorldLinesVisible
 * @text Number of visible lines:
 * @default 35
 * @parent ---Overworld Log Window---
 * 
 * @param OverworldLogWidth
 * @text Width(%):
 * @default 50
 * @parent ---Overworld Log Window---
 * 
 * @param OverworldLogOption
 * @text Option name:
 * @default Overworld Log
 * @parent ---Overworld Log Window---
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * This plugin is a BattleLog as well as the Overworld log.
 * 
 * Default log messages will still show up in this log window, and on top of that
 * you have many options to write in custom messages.
 * 
 * This log window supports all of the MessageCore characters.
 *
 * ============================================================================
 * How to use
 * ============================================================================
 *                           SCRIPT CALLS
 * 
 * TIKA.Logger.log(message) is a global scriptcall. 
 * 
 * message can read all message core codes. But in order for this scriptcall
 * to read MessageCore codes you will have to escape \.
 * 
 * Example:
 * 
 * TIKA.Logger.log('\\c[14]Stewart is a nice guy.') - Not the double backshlash
 * in front of the code for color.
 * 
 * 
 *                      Yanfly ACTION SEQUENCE
 * 
 * It is possible to write custom log messages inside of the Yanflys action 
 * sequence. In any of the notetags of action sequence you can use:
 * 
 *           battle log: text text text
 * 
 * to print the text in the log window at any point during the action sequence.
 * This battle log: will also do evals and read MessageCore codes.
 * 
 * For example: 
 *          - Message Core
 *          battle log: \c[14]Stewart is a nice guy.
 *          battle log: Stewart is \v[25] years old.
 *          
 *          - Evals
 *          battle log: user.name() is a nice guy.
 *          battle log: |user.name()| inflicted |v[19]| damage to |target.name()|
 * 
 * Variables can be reffered to as: \v[20] or v[20], both will work.
 * 
 * Evals will evaluate any javascript code that is enclosed in the character
 * provided as a plugin parameter. In this case above I used | character.
 * 
 *                              ITEMS NOTEBOX
 * 
 * This plugin also allows to log custom messages on item use using this notetag:
 * 
 * <BattleLog> text text text </BattleLog>
 * 
 * Inside of these notetags you can use MessageCore and evals as well.
 * Same as with the action sequence explained above.
 * 
 * NOTE: 
 * <br> - Line breaks does work in any way that you are using logger.
 * 
 * Automatic line break works as well. At any point if width of the
 * log message exceeds width of the window, this plugin will automatically
 * break into a new row. 
 * 
 * If you are using MessageCore color codes, you should end the log message
 * with \c[0], and bringing back default color. In some case color from
 * the previous line in the log window can carry over into the next.
 * 
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version 1.2
 * - State logging
 * 
 * Version 1.1
 * - Bug fixes
 * 
 * Version 1.0
 * - Finished plugin
 * - Bug fixes
 * 
 * Version 0.4
 * - Window size as a parameter
 * - Scrolling of the battle log
 * 
 * Version 0.3
 * - Font name as a parameter
 *
 * Version 0.2
 * -First iteration of the window.
 *
 *
 */

var Imported = Imported || {};
Imported.TIKA_Logger = true;
var TIKA = TIKA || {};
TIKA.Logger = TIKA.Logger || {};
TIKA.Logger.log;

TIKA.version = 1.00;

TIKA.Param = TIKA.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_Logger');
TIKA.Param.World = TIKA.Param.World || {};
TIKA.Param.Battle = TIKA.Param.Battle || {};
TIKA.ActorCommandWindow = TIKA.ActorCommandWindow || {};
TIKA.BattleLog = TIKA.BattleLog || {};
TIKA.BattleLog.Scroll = TIKA.BattleLog.Scroll || {};

// ---------------- Battle Log Window ----------------------
TIKA.Param.Battle.LogFontSize = Number(TIKA.Parameters['BattleFontSize']);
TIKA.Param.Battle.LinesVisible = Number(TIKA.Parameters['BattleLinesVisible']);
TIKA.Param.Battle.LogFontName = TIKA.Parameters['BattleFontName'];
TIKA.Param.Battle.EvalCharacter = TIKA.Parameters['BattleLogEvalChar'];
TIKA.Param.Battle.OptionName = TIKA.Parameters['BattleLogOption'];
TIKA.Param.Battle.Width = Number(TIKA.Parameters['BattleLogWidth']);

// ---------------- World Log Window ----------------------
TIKA.Param.World.LogFontSize = Number(TIKA.Parameters['WorldFontSize']);
TIKA.Param.World.LinesVisible = Number(TIKA.Parameters['WorldLinesVisible']);
TIKA.Param.World.LogFontName = TIKA.Parameters['WorldFontName'];
TIKA.Param.World.OptionName = TIKA.Parameters['OverworldLogOption'];
TIKA.Param.World.Width = Number(TIKA.Parameters['OverworldLogWidth']);
TIKA.Param.FadeTimeout = Number(TIKA.Parameters['FadeTimeout']);

// ---------------- Useful stuff ----------------------
TIKA.Param.FadeOut = false;
TIKA.BattleLog.Scroll.yOrigin = 0;
TIKA.BattleLog.Scroll.threshold = 20;
TIKA.ActorCommandWindow.active = true;

(function () {

    // ============================================================================
    //                          Scene_Map
    // ============================================================================


    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        this.processLogNotetags();

        return true;
    };


    DataManager.processLogNotetags = function () {
        for (var i = 1; i < $dataItems.length; i++) {
            if ($dataItems[i].name) {
                $dataItems[i]._logMessage = this.processLogMessages($dataItems[i]);
            }
        }
        for (var i = 1; i < $dataArmors.length; i++) {
            if ($dataArmors[i].name) {
                $dataArmors[i]._logMessage = this.processLogMessages($dataArmors[i]);
            }
        }
        for (var i = 1; i < $dataWeapons.length; i++) {
            if ($dataWeapons[i].name) {
                $dataWeapons[i]._logMessage = this.processLogMessages($dataWeapons[i]);
            }
        }
    }

    DataManager.processLogMessages = function (obj) {
        var description = '';
        var evalMode = 'none';
        notedata = this.convertNotedataToArray(obj.note);
        for (var i = 0; i < notedata.length; i++) {
            var line = notedata[i];
            if (line.match(/<BattleLog>/i)) {
                evalMode = 'log';
                description = '';
            } else if (line.match(/<\/BattleLog>/i)) {
                evalMode = 'none';
            } else if (evalMode === 'log') {
                description += line + ' ';
            }
        }
        return description;
    }

    // ============================================================================
    //                          Scene_Battle
    // ============================================================================

    var Scene_Battle_createLogWindow = Scene_Battle.prototype.createLogWindow;
    Scene_Battle.prototype.createLogWindow = function () {
        Scene_Battle_createLogWindow.call(this);
        if (!ConfigManager.battleLog) {
            this._logWindow.hide();
        } else {
            this._logWindow.show();
        }
    };

    var Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        Scene_Battle_update.call(this);
        this.isLogWindowClicked();
        this.isCursorMoveTriggered();
        if (TouchInput.isTriggered()) {
            TIKA.BattleLog.Scroll.yOrigin = TouchInput.y;
            TIKA.BattleLog.Scroll.threshold = 20;
        }
    };

    Scene_Battle.prototype.isCursorMoveTriggered = function () {
        if (Input.isRepeated('down') && this._logWindow.active) {
            this._logWindow.cursorDown();
        } else if (Input.isRepeated('up') && this._logWindow.active) {
            this._logWindow.cursorUp();
        }
        if (Input.isRepeated('pagedown')) {
            this._logWindow.cursorDown();
        } else if (Input.isRepeated('pageup')) {
            this._logWindow.cursorUp();
        }
        if (Input.isTriggered('cancel')) {
            TIKA.ActorCommandWindow.active = true;
            this._logWindow.deactivate();
            this._logWindow._scroll = 0;
            this._logWindow.refresh();
        }
    };

    Scene_Battle.prototype.isLogWindowClicked = function () {
        if (this.isTouchLogWindow() && !this._logWindow.active && TouchInput.isTriggered()) {
            this._actorCommandWindow.deactivate();
            TIKA.ActorCommandWindow.active = false;
            this._logWindow.activate();
        } else if (!this.isTouchLogWindow() && TouchInput.isTriggered()) {
            TIKA.ActorCommandWindow.active = true;
            this._logWindow.deactivate();
            this._logWindow._scroll = 0;
            this._logWindow.refresh();
        } else if (this.isHoveringLogWindow() || this._logWindow.active) {
            this._logWindow.processWheel();
        }

    };

    Scene_Battle.prototype.isTouchLogWindow = function () {
        return TouchInput.x > BattleManager._logWindow.x &&
            TouchInput.x < BattleManager._logWindow.x + BattleManager._logWindow.width &&
            TouchInput.y > BattleManager._logWindow.y &&
            TouchInput.y < BattleManager._logWindow.y + BattleManager._logWindow.height;
    };

    Scene_Battle.prototype.isHoveringLogWindow = function () {
        return TouchInput._mouseOverX > BattleManager._logWindow.x &&
            TouchInput._mouseOverX < BattleManager._logWindow.x + BattleManager._logWindow.width &&
            TouchInput._mouseOverY > BattleManager._logWindow.y &&
            TouchInput._mouseOverY < BattleManager._logWindow.y + BattleManager._logWindow.height;
    };

    TouchInput._onMove = function (x, y) {
        this._events.moved = true;
        this._x = x;
        this._y = y;
        if (SceneManager._scene instanceof Scene_Battle) {
            this._onDrag(y);
        }
    };

    TouchInput._onDrag = function (y) {
        if (Math.abs(TIKA.BattleLog.Scroll.yOrigin - y) < 20) TIKA.BattleLog.Scroll.threshold = 20;
        if (Math.abs(TIKA.BattleLog.Scroll.yOrigin - y) < TIKA.BattleLog.Scroll.threshold) return;
        if (y > TIKA.BattleLog.Scroll.yOrigin) {
            BattleManager._logWindow.cursorUp();
            TIKA.BattleLog.Scroll.threshold += BattleManager._logWindow.lineHeight();
        }
        else if (y < TIKA.BattleLog.Scroll.yOrigin) {
            BattleManager._logWindow.cursorDown();
            TIKA.BattleLog.Scroll.threshold += BattleManager._logWindow.lineHeight();
        }
    };

    // ============================================================================
    //                          Scene_Map
    // ============================================================================

    var Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function () {
        this.createLogWindow();
        Scene_Map_createAllWindows.call(this);
    };


    Scene_Map.prototype.createLogWindow = function () {
        if (!$gameMap._logWindow) {
            this._logWindow = new Window_BattleLog();
            $gameMap._logWindow = this._logWindow;
        } else {
            this._logWindow = $gameMap._logWindow;
        }
        this.addWindow(this._logWindow);
        this._logWindow.opacity = 0;
        this._logWindow.width = Graphics.boxWidth;
        this.checkLogVisibility();
    };

    Scene_Map.prototype.checkLogVisibility = function () {
        if (ConfigManager.overworldLog === 'OFF')
            this._logWindow.hide();
        else
            this._logWindow.show();

    };

    var Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        Scene_Map_update.call(this);
        this.initiateFadeOut();
    };

    Scene_Map.prototype.initiateFadeOut = function () {
        if (TIKA.Param.FadeOut && this.logTimeoutExpired() && $gameMap._logWindow.visible) {
            if ($gameMap._logWindow.alpha > 0)
                $gameMap._logWindow.alpha -= 0.01;
            else {
                TIKA.Param.FadeOut = false;
                $gameMap._logWindow._lines = [];
            }
        }
    }

    Scene_Map.prototype.logTimeoutExpired = function () {
        var logWindow = $gameMap._logWindow;
        return logWindow._timeStamp + logWindow._timeout < Date.now();
    };

    // ============================================================================
    //                          Window_BattleLog
    // ============================================================================


    Window_ActorCommand.prototype.setup = function (actor) {
        this._actor = actor;
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.selectLast();
        if (TIKA.ActorCommandWindow.active) {
            this.refresh();
            this.activate();
            this.open();
        }

    };


    var Window_BattleLog_initialize = Window_BattleLog.prototype.initialize;
    Window_BattleLog.prototype.initialize = function () {
        Window_BattleLog_initialize.call(this);
        this.x = 0;
        this.y = Graphics.boxHeight - this.windowHeight();
        this.opacity = 255;
        this._scroll = 0;
    };

    var Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        Game_Action_apply.call(this, target);
        if (this.item()._logMessage && SceneManager._scene instanceof Scene_Battle)
            BattleManager._logWindow.push('addText', BattleManager.parseSequenceBattleLog(this.item()._logMessage.split(TIKA.Param.Battle.EvalCharacter)));
    };

    Window_BattleLog.prototype.windowWidth = function () {
        var percent = Graphics.boxWidth / 100;
        if (SceneManager._scene instanceof Scene_Battle)
            return TIKA.Param.Battle.Width * percent;
        else
            return TIKA.Param.World.Width * percent;
    };

    Window_BattleLog.prototype.windowHeight = function () {
        return this.fittingHeight(this.maxLines());
    };

    Window_BattleLog.prototype.standardPadding = function () {
        return 10;
    };

    Window_BattleLog.prototype.backPaintOpacity = function () {
        return 128;
    };

    Window_BattleLog.prototype.maxLines = function () {
        if (SceneManager._scene instanceof Scene_Map)
            return ConfigManager.overworldLineNumber || TIKA.Param.World.LinesVisible;
        else
            return ConfigManager.battleLineNumber | TIKA.Param.Battle.LinesVisible || TIKA.Param.Battle.LinesVisible;
    };

    Window_BattleLog.prototype.clear = function () {
        this._baseLineStack = [];
        this.refresh();
    };

    Window_BattleLog.prototype.refresh = function () {
        if (SceneManager._scene instanceof Scene_Battle)
            this.refreshBattleLog();
        else if (SceneManager._scene instanceof Scene_Map)
            this.refreshOverworldLog();
    };

    Window_BattleLog.prototype.refreshOverworldLog = function () {
        this.contents.clear();
        this.alpha = 1;
        var length = this._lines.length;
        var start = length - 1;
        var end = 0;
        this.y = Graphics.boxHeight - this.windowHeight();
        if (length > this.maxLines())
            end = Math.abs(length - this.maxLines() - this._scroll);
        for (var i = start, counter = this.maxLines() - 1; counter >= 0 && i >= end; i-- , counter--) {
            this.drawLineText(counter, i);
        }
        this.resetFontSettings();
        if (ConfigManager.overworldLog === 'FADE')
            this.fadeOut();
    };

    Window_BattleLog.prototype.refreshBattleLog = function () {
        this.contents.clear();
        var length = this._lines.length;
        var start = 0;
        if (length > TIKA.Param.Battle.LinesVisible)
            start = length - this.maxLines() - this._scroll;
        for (var i = start, counter = 0; counter < this.maxLines(); i++ , counter++) {
            this.drawLineText(counter, i);
        }
        this.resetFontSettings();
    };

    Window_BattleLog.prototype.fadeOut = function () {
        this._timeout = ConfigManager.overworldFadeTime;
        this._timeStamp = Date.now();
        TIKA.Param.FadeOut = true;
    };

    Window_BattleLog.prototype.lineHeight = function () {
        if (SceneManager._scene instanceof Scene_Battle)
            return TIKA.Param.Battle.LogFontSize + TIKA.Param.Battle.LogFontSize / 4;
        else if (SceneManager._scene instanceof Scene_Map)
            return TIKA.Param.World.LogFontSize + TIKA.Param.World.LogFontSize / 4;

    };

    Window_BattleLog.prototype.drawLineText = function (counter, index) {
        var rect = this.itemRectForText(counter);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.drawTextEx(this._lines[index], rect.x, rect.y, rect);
    };

    Window_BattleLog.prototype.drawTextEx = function (text, x, y) {
        if (text) {
            var textState = {
                index: 0,
                x: x,
                y: y,
                left: x
            };
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

    Window_BattleLog.prototype.addText = function (text) {
        if (SceneManager._scene instanceof Scene_Map && ConfigManager.overworldLog === 'OFF') return;
        if (SceneManager._scene instanceof Scene_Battle && !ConfigManager.battleLog) return;
        if (!text) return;
        text = this.wordwrap(text);
        text = this.convertVariables(text);
        var textArray = stringToArray(text, "<br>");
        for (var i = 0; i < textArray.length; i++) {
            this._lines.push(textArray[i]);
        }
        this._scroll = 0;
        this.refresh();
        this.wait();
    };

    Window_BattleLog.prototype.wordwrap = function (text) {
        var newText = '';
        var textWidth = this.textWidth(newText);
        var ww = this.width - this.padding;
        if (this.textWidth(text) > ww) {
            var arr = text.split(' ');
            for (var i = 0; i < arr.length; i++) {
                textWidth += this.textWidth(arr[i].replace(/\\.\[(\d+)\]/i, '') + ' ');
                if (textWidth > ww) {
                    newText += '<br>' + arr[i] + ' ';
                    textWidth = this.textWidth(arr[i] + ' ');
                } else {
                    newText += arr[i] + ' ';
                }
            }
        }

        return newText || text;
    };

    Window_BattleLog.prototype.convertVariables = function (text) {
        var splitText = text.split(TIKA.Param.Battle.EvalCharacter);
        for (var i = 0; i < splitText.length; i++) {
            if (/\\v\[(\d+)\]/i.test(splitText[i])) {
                splitText[i] = this.convertEscapeCharacters(splitText[i]);
            }
        }
        var newText = '';
        for (var i = 0; i < splitText.length; i++) {
            if (splitText[i] == 'undefined' || !splitText[i]) continue;
            newText += splitText[i];
        }
        return newText;
    };

    Window_BattleLog.prototype.resetFontSettings = function () {
        if (SceneManager._scene instanceof Scene_Battle) {
            this.contents.fontFace = TIKA.Param.Battle.LogFontName || this.standardFontFace();
            this.contents.fontSize = TIKA.Param.Battle.LogFontSize;
        } else if (SceneManager._scene instanceof Scene_Map) {
            this.contents.fontFace = TIKA.Param.World.LogFontName || this.standardFontFace();
            this.contents.fontSize = TIKA.Param.World.LogFontSize;
        }
        this.resetTextColor();
    };

    Window_BattleLog.prototype.calcTextHeight = function (textState, all) {
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

    Window_BattleLog.prototype.cursorDown = function () {
        if (this._lines.length < TIKA.Param.Battle.LinesVisible) return;
        if (this._scroll > 0) {
            this._scroll -= 1;
            this.refresh();
        }
    };

    Window_BattleLog.prototype.cursorUp = function () {
        if (this._lines.length < TIKA.Param.Battle.LinesVisible) return;
        if (this._scroll < Math.abs(this._lines.length - TIKA.Param.Battle.LinesVisible)) {
            this._scroll += 1;
            this.refresh();
        }
    };

    Window_BattleLog.prototype.scrollDown = function () {
        this.cursorDown();
    };

    Window_BattleLog.prototype.scrollUp = function () {
        this.cursorUp();
    };

    Window_BattleLog.prototype.processWheel = function () {
        if (this.isOpen()) {
            var threshold = 20;
            if (TouchInput.wheelY >= threshold) {
                this.scrollDown();
            }
            if (TouchInput.wheelY <= -threshold) {
                this.scrollUp();
            }
        }
    };

    Window_BattleLog.prototype.displayAction = function (subject, item) {
        var numMethods = this._methods.length;
        if (DataManager.isSkill(item)) {
            if (item.message1) {
                var message = item.message1.split('|');
                if (message.length > 1)
                    this.push('addText', message[0] + subject.name() + message[1].format(item.name));
                else
                    this.push('addText', subject.name() + message[0].format(item.name));
            }
            if (item.message2) {
                this.push('addText', item.message2.format(item.name));
            }
        } else {
            this.push('addText', TextManager.useItem.format(subject.name(), item.name));
        }
        if (this._methods.length === numMethods) {
            this.push('wait');
        }
    };

    Window_BattleLog.prototype.displayCurrentState = function (subject) {
        var stateText = subject.mostImportantStateText();
        if (stateText) {
            var message = stateText.split('|');
            if (message.length > 1)
                this.addText(message[0] + subject.name() + message[1]);
            else
                this.addText(subject.name() + stateText);
            this.push('wait');
        }
    };

    Window_BattleLog.prototype.displayAddedStates = function (target) {
        target.result().addedStateObjects().forEach(function (state) {
            var stateMsg = target.isActor() ? state.message1 : state.message2;
            if (state.id === target.deathStateId()) {
                this.push('performCollapse', target);
            }
            if (stateMsg) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                var message = stateMsg.split('|');
                if (message.length > 1)
                    this.addText(message[0] + target.name() + message[1]);
                else
                    this.addText(target.name() + stateMsg);
                this.push('wait');
            }
        }, this);

    };

    Window_BattleLog.prototype.displayRemovedStates = function (target) {
        target.result().removedStateObjects().forEach(function (state) {
            if (state.message4) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                var message = state.message4.split('|');
                if (message.length > 1)
                    this.addText(message[0] + target.name() + message[1]);
                else
                    this.addText(target.name() + state.message4);
            }
        }, this);
    };


    // ============================================================================
    //                              BattleManager
    // ============================================================================

    var BattleManager_processActionSequence = BattleManager.processActionSequence;
    BattleManager.processActionSequence = function (actionName, actionArgs) {
        var value = BattleManager_processActionSequence.call(this, actionName, actionArgs);
        if (!this._logWindow.visible) return value;
        if (actionName.trim() == 'BATTLE LOG')
            for (var i = 0; i < actionArgs.length; i++) {
                var rawText = actionArgs[i].split(TIKA.Param.Battle.EvalCharacter);
                var text = this.parseSequenceBattleLog(rawText);
                this._logWindow.push('addText', text);

            }
        return value;
    }

    BattleManager.parseSequenceBattleLog = function (rawText, index = 0) {
        var text = '';
        var a = this._subject,
            user = this._subject,
            subject = this._subject;
        var b = this._targets[index],
            target = this._targets[index],
            enemy = this._targets[index];
        var targets = this._targets;
        var v = $gameVariables._data;
        for (var j = 0; j < rawText.length; j++) {
            if (!rawText[j]) continue;
            try {
                var evalText = eval(rawText[j]);
                if (!evalText && rawText[j].match(/v\[(\d+)\]/i))
                    evalText = 0;
                if (!evalText) {
                    if (evalText != 0)
                        throw 'No value!'
                }
                text += evalText;
            } catch (error) {
                text += rawText[j];
            }
        }
        return text;
    }

    BattleManager.actionAddState = function (actionName, actionArgs) {
        var targets = this.makeActionTargets(actionArgs[0]);
        if (targets.length < 1) {
            targets = this._targets;
            var temp = [];
            try {
                var target = eval(actionArgs[0]);
                temp.push(target);
            } catch (error) {
                return false;
            }
            targets = temp;
        }
        if (targets.length < 1) return false;
        var show = false;
        for (var i = 0; i < actionArgs.length; ++i) {
            var actionArg = actionArgs[i];
            if (actionArg.toUpperCase() === 'SHOW') show = true;
        }
        if (actionName.match(/(?:ADD_STATE|ADD STATE)[ ](\d+(?:\s*,\s*\d+)*)/i)) {
            var states = JSON.parse('[' + RegExp.$1.match(/\d+/g) + ']');
        } else {
            return true;
        }
        targets.forEach(function (target) {
            for (var i = 0; i < states.length; ++i) {
                stateId = states[i];
                if (stateId === target.deathStateId()) {
                    if (target._prevImmortalState === false) target.forceRemoveImmortal();
                }
                target.addState(stateId);
                if (show) this._logWindow.displayActionResults(this._subject, target);
            }
        }, this);
        return true;
    };

    // ============================================================================
    //                              Window_Options
    // ============================================================================


    var Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function () {
        Window_Options_makeCommandList.call(this);
        this.addLoggerOptions();
    };

    Window_Options.prototype.addLoggerOptions = function () {
        this.addCommand(TIKA.Param.World.OptionName, 'overworldLog');
        this.addCommand('Overworld Log Fade Time', 'overworldFadeTime');
        this.addCommand('Overworld Log Number of Lines', 'overworldLineNumber');
        this.addCommand(TIKA.Param.Battle.OptionName, 'battleLog');
        this.addCommand('Battle Log Number of Lines', 'battleLineNumber');
    };

    // ============================================================================
    //                              ConfigManager
    // ============================================================================
    TIKA.overworldLogOptions = ['FADE', 'ON', 'OFF'];
    ConfigManager.overworldLog = TIKA.overworldLogOptions[0];

    var ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        var config = ConfigManager_makeData.call(this);
        config.battleLog = this.battleLog;
        config.overworldLog = TIKA.overworldLogOptions[0];
        config.overworldLineNumber = this.overworldLineNumber;
        config.battleLineNumber = this.battleLineNumber;
        config.overworldFadeTime = this.overworldFadeTime;
        return config;
    };

    var ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        ConfigManager_applyData.call(this, config);
        this.battleLog = this.readFlag(config, 'battleLog') || 'true';
        this.overworldLog = TIKA.overworldLogOptions[0];
        this.overworldLineNumber = this.overworldLineNumber || TIKA.Param.World.LinesVisible;
        this.battleLineNumber = this.battleLineNumber || TIKA.Param.Battle.LinesVisible;
        this.overworldFadeTime = this.overworldFadeTime || TIKA.Param.FadeTimeout;
    };

    ConfigManager.overworldLog = function (config, name) {
        return config[name];
    };


    // ============================================================================
    //                          Window_Options
    // ============================================================================

    Window_Options.prototype.statusText = function (index) {
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value);
        } else if (this.isOverworldLog(symbol)) {
            return this.overworldStatusText(value);
        } else if (this.isOverworldLogFadeTime(symbol)) {
            return this.overworldLogFadeTime(value);
        } else if (this.isOverworldLineNumber(symbol)) {
            return this.overworldLineNumber(value);
        } else if (this.isBattleLineNumber(symbol)) {
            return this.battleLineNumber(value);
        } else {
            return this.booleanStatusText(value);
        }
    };

    Window_Options.prototype.isOverworldLog = function (symbol) {
        return symbol.contains('overworldLog');
    };

    Window_Options.prototype.overworldStatusText = function (value) {
        return value;
    };

    Window_Options.prototype.isOverworldLineNumber = function (symbol) {
        return symbol.contains('overworldLineNumber');
    };

    Window_Options.prototype.overworldLineNumber = function (value) {
        return value + ' lines';
    };

    Window_Options.prototype.isBattleLineNumber = function (symbol) {
        return symbol.contains('battleLineNumber');
    };

    Window_Options.prototype.battleLineNumber = function (value) {
        return value + ' lines';
    };

    Window_Options.prototype.isOverworldLogFadeTime = function (symbol) {
        return symbol.contains('overworldFadeTime');
    };

    Window_Options.prototype.overworldLogFadeTime = function (value) {
        return Math.floor(value / 1000) + ' sec';
    };

    Window_Options.prototype.cursorRight = function (wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            value += this.volumeOffset();
            value = value.clamp(0, 100);
            this.changeValue(symbol, value);
        } else if (this.isOverworldLog(symbol)) {
            var index = TIKA.overworldLogOptions.indexOf(value);
            if (index < TIKA.overworldLogOptions.length - 1) {
                value = TIKA.overworldLogOptions[++index];
            } else
                value = TIKA.overworldLogOptions[0];
            this.changeValue(symbol, value);
        } else if (this.isOverworldLogFadeTime(symbol)) {
            value += 1000;
            this.changeValue(symbol, value);
        } else if (this.isOverworldLineNumber(symbol)) {
            value += 1;
            this.changeValue(symbol, value);
        } else if (this.isBattleLineNumber(symbol)) {
            value += 1;
            this.changeValue(symbol, value);
        } else {
            this.changeValue(symbol, true);
        }
    };

    Window_Options.prototype.cursorLeft = function (wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            value -= this.volumeOffset();
            value = value.clamp(0, 100);
            this.changeValue(symbol, value);
        } else if (this.isOverworldLog(symbol)) {
            var index = TIKA.overworldLogOptions.indexOf(value);
            if (index > 0) {
                value = TIKA.overworldLogOptions[--index];
            } else
                value = TIKA.overworldLogOptions[TIKA.overworldLogOptions.length - 1];
            this.changeValue(symbol, value);
        } else if (this.isOverworldLogFadeTime(symbol)) {
            if (value > 1000)
                value -= 1000;
            this.changeValue(symbol, value);
        } else if (this.isOverworldLineNumber(symbol)) {
            if (value > 1)
                value -= 1;
            this.changeValue(symbol, value);
        } else if (this.isBattleLineNumber(symbol)) {
            value -= 1;
            this.changeValue(symbol, value);
        } else {
            this.changeValue(symbol, false);
        }
    };

    Window_Options.prototype.processOk = function () {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            value += this.volumeOffset();
            if (value > 100) {
                value = 0;
            }
            value = value.clamp(0, 100);
            this.changeValue(symbol, value);
        } else if (this.isOverworldLog(symbol)) {
            var index = TIKA.overworldLogOptions.indexOf(value);
            if (index < TIKA.overworldLogOptions.length - 1) {
                value = TIKA.overworldLogOptions[++index];
            } else
                value = TIKA.overworldLogOptions[0];
            this.changeValue(symbol, value);
        } else if (this.isOverworldLogFadeTime(symbol)) {
            value += 1000;
            this.changeValue(symbol, value);
        } else if (this.isOverworldLineNumber(symbol)) {
            value += 1;
            this.changeValue(symbol, value);
        } else if (this.isBattleLineNumber(symbol)) {
            value += 1;
            this.changeValue(symbol, value);
        } else {
            this.changeValue(symbol, !value);
        }
    };

    // ============================================================================
    //                          Scene_Save
    // ============================================================================

    //Removing the log window on save to prevent errors from happening
    var Scene_Save_onSavefileOk = Scene_Save.prototype.onSavefileOk;
    Scene_Save.prototype.onSavefileOk = function () {
        if ($gameMap._logWindow)
            delete $gameMap._logWindow;
        Scene_Save_onSavefileOk.call(this);
    };

    // ============================================================================
    //                Scriptcall for logging into the BattleLog
    // ============================================================================

    TIKA.Logger.log = function (message) {
        if (SceneManager._scene instanceof Scene_Map)
            $gameMap._logWindow.addText(message);
        else
            BattleManager._logWindow.push('addText', BattleManager.parseSequenceBattleLog(message.split(TIKA.Param.Battle.EvalCharacter)));

    }

    /* UTILITIES */

    function stringToArray(string, delimeter) {

        var arrayFromString = string.split(delimeter);
        return arrayFromString;

    }

})();