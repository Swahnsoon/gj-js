
/*:
 @plugindesc |v2.1| This plugin enables the creation of a code language for your game.
 @author xDGameStudios Engine

 @param ---General---

 @param Languages
 @desc The maximum number of languages for your game.
 DEFAULT: 1
 @default 1

 @param Encode Name
 @desc Applies the language code to the name window.
 DEFAULT: false      YES: true   NO: false
 @default false

 @param Text Color
 @desc Sets the codified text color.
 NOTE: Set the color for each language, separated with comma.
 DEFAULT: 2
 @default 2

 @param ---Numbers---
 @default

 @param Number 1
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Number 2
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Number 3
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Number 4
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Number 5
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Number 6
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Number 7
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Number 8
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Number 9
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Number 0
 @desc The mapping applied for the number in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param ---Letters---
 @default

 @param Letter "A"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "B"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "C"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "D"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "E"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "F"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "G"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "H"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "I"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "J"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "K"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "L"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "M"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "N"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "O"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "P"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "Q"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "R"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "S"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "T"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "U"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "V"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "W"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "X"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "Y"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @param Letter "Z"
 @desc The mapping applied for the letter in the window message.
 NOTE: use comma to separate the different languages.
 @default

 @help
 ========================================================================
 Help
 ========================================================================

 This plugin will implement a coded encrypted language similar to the one
 found in FFX with Al Bhed. You can edit the alpha and numeric mappings,
 as well as configure the color of the encrypted text. For using multiple
 languages separate values with comma "," (NO quotations) and NO spaces.

 Example:

 Parameter: Letter "A"
 Value: e,t,u,g

 Language 1 will encode A --> e
 Language 2 will encode A --> t
 Language 3 will encode A --> u
 Language 4 will encode A --> g


 ========================================================================
 Plugin Commands
 ========================================================================

 CodeLanguage Learn X Y (learns the letter Y of language X).

 CodeLanguage LearnAll X (learns all letters from language X).

 CodeLanguage Forget X Y (forgets the letter Y of language X).

 CodeLanguage LearnAll X (forgets all letters from language X).

 CodeLanguage Enable X (turns coding ON - fot language X).

 CodeLanguage Disable (turns coding OFF).

 ========================================================================
 Updates History
 ========================================================================

 1.0: Initial Release
 2.0: This "huge" update will let you set variables languages and turn
      them on and off as you please.
 2.1: BugFix - Now working with YEP_Message core

 ========================================================================
 */

var Imported = Imported || {};
Imported.XDE_CodeLanguage = true;

var XDE = XDE || {};
XDE.CodeLanguage = XDE.CodeLanguage || {};

(function ($) {

    "use strict";

    $.Alias = $.Alias || {};
    $.Params = $.Params || {};

    //=============================================================================
    // Parameter Variables
    //=============================================================================

    var parameters = PluginManager.parameters('XDE_CodeLanguage');

    $.Params.Dictionaries = Number(parameters['Languages'] || 1);
    $.Params.EncodeName = parameters['Encode Name'] === 'true';
    $.Params.Color = parameters['Text Color'].split(',').map(Number);

    $.Params.Language = -1;

    $.Params.Dictionary = {
        1: parameters['Number 1'].split(','), 2: parameters['Number 2'].split(','),
        3: parameters['Number 3'].split(','), 4: parameters['Number 4'].split(','),
        5: parameters['Number 5'].split(','), 6: parameters['Number 6'].split(','),
        7: parameters['Number 7'].split(','), 8: parameters['Number 8'].split(','),
        9: parameters['Number 9'].split(','), 0: parameters['Number 0'].split(','),

        a: parameters['Letter "A"'].toLowerCase().split(','),
        b: parameters['Letter "B"'].toLowerCase().split(','),
        c: parameters['Letter "C"'].toLowerCase().split(','),
        d: parameters['Letter "D"'].toLowerCase().split(','),
        e: parameters['Letter "E"'].toLowerCase().split(','),
        f: parameters['Letter "F"'].toLowerCase().split(','),
        g: parameters['Letter "G"'].toLowerCase().split(','),
        h: parameters['Letter "H"'].toLowerCase().split(','),
        i: parameters['Letter "I"'].toLowerCase().split(','),
        j: parameters['Letter "J"'].toLowerCase().split(','),
        k: parameters['Letter "K"'].toLowerCase().split(','),
        l: parameters['Letter "L"'].toLowerCase().split(','),
        m: parameters['Letter "M"'].toLowerCase().split(','),
        n: parameters['Letter "N"'].toLowerCase().split(','),
        o: parameters['Letter "O"'].toLowerCase().split(','),
        p: parameters['Letter "P"'].toLowerCase().split(','),
        q: parameters['Letter "Q"'].toLowerCase().split(','),
        r: parameters['Letter "R"'].toLowerCase().split(','),
        s: parameters['Letter "S"'].toLowerCase().split(','),
        t: parameters['Letter "T"'].toLowerCase().split(','),
        u: parameters['Letter "U"'].toLowerCase().split(','),
        v: parameters['Letter "V"'].toLowerCase().split(','),
        w: parameters['Letter "W"'].toLowerCase().split(','),
        x: parameters['Letter "X"'].toLowerCase().split(','),
        y: parameters['Letter "Y"'].toLowerCase().split(','),
        z: parameters['Letter "Z"'].toLowerCase().split(',')
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    $.Alias._game_interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        $.Alias._game_interpreter_pluginCommand.call(this, command, args);
        if (command === 'CodeLanguage') {
            var action = args[0].toLowerCase();
            var value;
            var language = Number(args[1] || 1).clamp(1, $gameSystem._dictionary.length);
            switch (action) {
                case 'learn':
                    value = args[2].toLowerCase();
                    $gameSystem.codeLanguageLearn(language, value);
                    break;
                case 'forget':
                    value = args[2].toLowerCase();
                    $gameSystem.codeLanguageForget(language, value);
                    break;
                case 'learnall':
                    $gameSystem.codeLanguageLearnAll(language);
                    break;
                case 'forgetall':
                    $gameSystem.codeLanguageForgetAll(language);
                    break;
                case 'enable':
                    $.Params.Language = language;
                    break;
                case 'disable':
                    $.Params.Language = -1;
                    break;
            }
        }
    };

    //=============================================================================
    // Game_System
    //=============================================================================

    $.Alias._game_system_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        $.Alias._game_system_initialize.call(this);
        this.initCodeLanguage();
    };

    Game_System.prototype.initCodeLanguage = function () {
        this._dictionary = this._dictionary || [];
        for (var i = 0; i < $.Params.Dictionaries; i++) {
            this._dictionary.push([]);
        }
    };

    Game_System.prototype.codeLanguageLearn = function (language, value) {
        var index = this._dictionary[language - 1].indexOf(value);
        if (index === -1) {
            this._dictionary[language - 1].push(value);
        }
    };

    Game_System.prototype.codeLanguageForget = function (language, value) {
        var index = this._dictionary[language - 1].indexOf(value);
        if (index > -1) {
            this._dictionary[language - 1].splice(index, 1);
        }
    };

    Game_System.prototype.codeLanguageLearnAll = function (language) {
        this._dictionary[language - 1] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    };

    Game_System.prototype.codeLanguageForgetAll = function (language) {
        this._dictionary[language - 1] = [];
    };

    //=============================================================================
    // Window_Message
    //=============================================================================

    $.Alias._window_message_processNormalCharacter = Window_Message.prototype.processNormalCharacter;
    Window_Message.prototype.processNormalCharacter = function (textState) {
        var c = textState.text[textState.index++];
        var text;
        var color = this.contents.textColor;
        if ($.Params.Language > 0) {
            var d = $.Params.Dictionary;
            var l = $.Params.Language - 1;
            var id = c.toLowerCase();
            if ($gameSystem._dictionary[l].indexOf(id) === -1 && d[id] && d[id][l] && d[id][l] !== "") {
                text = (id === c) ? d[c][l] : d[id][l].toUpperCase();
            } else {
                this.changeTextColor(this.textColor($.Params.Color));
            }
        }
        if (text) {
            var w = this.textWidth(text);
            this.contents.drawText(text, textState.x, textState.y, w * 2, textState.height);
            textState.x += w;
        } else {
            textState.index--;
            $.Alias._window_message_processNormalCharacter.call(this, textState);
        }
        this.contents.textColor = color;
    };

    //=============================================================================
    // Window_NameBox
    //=============================================================================

    if ($.Params.EncodeName) {
        Window_NameBox.prototype.processNormalCharacter = function (textState) {
            var c = textState.text[textState.index++];
            var color = this.contents.textColor;
            if ($.Params.Language > 0) {
                var d = $.Params.Dictionary;
                var l = $.Params.Language - 1;
                var id = c.toLowerCase();
                if ($gameSystem._dictionary[l].indexOf(id) === -1 && d[id] && d[id][l] && d[id][l] !== "") {
                    c = (id === c) ? d[c][l] : d[id][l].toUpperCase();
                } else {
                    this.changeTextColor(this.textColor($.Params.Color[l]));
                }
            }
            var w = this.textWidth(c);
            this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
            textState.x += w;

            this.contents.textColor = color;
        };
    }


})(XDE.CodeLanguage);