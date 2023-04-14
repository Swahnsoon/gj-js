/*:
 * @plugindesc v1.0 DescriptionWindow
 * @author TIKA
 *
 * @param Font Size
 * @text Font size of the Description window.
 * @default 22
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * Custom description/help window.
 *
 * ============================================================================
 * How to use
 * ============================================================================
 *
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version v1.00
 * Finished plugin!
 *
 *
 */

var Imported = Imported || {};
Imported.TIKA_DescriptionWindow = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.DescriptionWindow = TIKA.DescriptionWindow || {};
TIKA.DW = TIKA.DW || {};
TIKA.DW.Param = TIKA.DW.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_DescriptionWindow');

TIKA.DW.Param.DescFontSize = Number(TIKA.Parameters['Font Size']);



// ============================================================================
//                    Window_Description
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

Window_Description.prototype.updatePlacement = function (x, y, rect) {
    if (this._text.replace(/<WordWrap>/g, '').length < 1) {
        this.close();
        return;
    }
    this.open();
    this._refreshBack();
    this.opacity = 255;
    this.backOpacity = this.standardBackOpacity();
    this.y = y + 0.5 * rect.height;
    this.x = x + Graphics.boxWidth / 2;
    if (this.y + this.height > Graphics.boxHeight) {
        this.y = y + 0.5 * rect.height - this.height;
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
        if (x2 + width >= (this.width - this.textPadding() - this.padding * 2)) {
            y2 += this.lineHeight();
            x2 = x;
            counter++;
        }
        this.height = counter * this.lineHeight() + this.padding * 2 + this.textPadding();
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
    else if (SceneManager._scene instanceof Scene_Shop)
        return TIKA.ShM.Param.DescFontSize;
    else if (SceneManager._scene instanceof Scene_Synthesis)
        return TIKA.CM.Param.DescFontSize;
};