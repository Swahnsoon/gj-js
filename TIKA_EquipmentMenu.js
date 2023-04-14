/*:
 * @plugindesc v1.1 Custom equipment menu
 * @author TIKA
 *
 * 
 * @param Optimisation Parameters
 * @text Parameters included in the optimisation of equipment.
 *
 * @param Physical
 * @text Parameters for physical optimisation
 * @type text[]
 * @parent Optimisation Parameters
 * @default ["str","bab","dex"]
 *
 * @param Magical
 * @text Parameters for magical optimisation
 * @type text[]
 * @parent Optimisation Parameters
 * @default ["int","wis","mmp"]
 * 
 * @param Defense
 * @text Parameters for defense optimisation
 * @type text[]
 * @parent Optimisation Parameters
 * @default ["ac","con","mhp"]
 * 
 * @param Font Size
 * @text Font size of the Description window.
 * @default 22
 * 
 * @param MenuFontSize
 * @text Menu font size.
 * @default 22
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * Custom equipment menu.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * <Gather> - Notetag for item notebox. This will exclude item from optimize.
 * 
 * <Augment Descritption: AugmentType>
 * Text
 * Text
 * Text
 * </Augment Description>
 * 
 * This notetag will attach custom description for different augment slot types
 * (AugmentType: Weapon, Armor, Earring etc.)
 * 
 * <Damage: #> - Notetag for weapon notebox. Define damage that weapon deals.
 * Example:
 * <Damage: 1d12> 
 * To include this Damage into equipment optimize use: wdmg
 * 
 * Added extra feature to the Augment Attach. You are now able to increase
 * or decrease variable value inside of <Augment Attach: type>, <Augment Detach: type>
 * notetags.
 * 
 * How to use:
 * 
 * Inside of above mentioned notetags put: VARIABLE #: +/-X
 * Example: VARIABLE 20: +3    <--- This will add 3 to the variable 20.
 * Example: VARIABLE 20: -3    <--- This will subtract 3 from the variable 20.
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * 25.01.2013 - Fixed item description and damage modifier
 * 
 * Version v1.1
 * - Added feature that allows you to increase variables inside of augments.
 * 
 * Version v1.00
 * Finished plugin!
 *
 *
 */

var Imported = Imported || {};
Imported.TIKA_EquipmentMenu = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.EquipmentMenu = TIKA.EquipmentMenu || {};
TIKA.EquipmentMenu.isEquipmentMenu = false;
TIKA.Param = TIKA.Param || {};
TIKA.EM = TIKA.EM || {};
TIKA.EM.Param = TIKA.EM.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_EquipmentMenu');

TIKA.Param.PhysicalParams = JSON.parse(TIKA.Parameters['Physical']);
TIKA.Param.MagicalParams = JSON.parse(TIKA.Parameters['Magical']);
TIKA.Param.DefenseParams = JSON.parse(TIKA.Parameters['Defense']);
TIKA.EM.Param.DescFontSize = Number(TIKA.Parameters['Font Size']);
TIKA.EM.Param.MenuFontSize = Number(TIKA.Parameters['MenuFontSize']);
TIKA.EM.Actor = TIKA.EM.Actor || {};


(function () {

    // ============================================================================
    //                    DataManager
    // ============================================================================

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        for (var i = 1; i < $dataItems.length; i++) {
            var desc = this.processAugmentDesccriptionNotetags($dataItems[i].note);
            $dataItems[i]._augmentDescriptions = desc;
        }
        for (var i = 1; i < $dataItems.length; i++) {
            this.setParamBonus($dataItems[i]);
        }
        for (var i = 1; i < $dataWeapons.length; i++) {
            this.setParamBonus($dataWeapons[i]);
            this.setDamage($dataWeapons[i]);
        }
        for (var i = 1; i < $dataArmors.length; i++) {
            this.setParamBonus($dataArmors[i]);
        }

        return true;
    };

    DataManager.processAugmentDesccriptionNotetags = function (obj) {
        var description = '';
        var evalMode = 'none';
        var augDescriptions = [];
        var augType = '';
        notedata = this.convertNotedataToArray(obj);
        for (var i = 0; i < notedata.length; i++) {
            var line = notedata[i];
            if (line.match(/<Augment Description: [^\s]+>/i)) {
                evalMode = 'help description';
                augType = line.split(' ')[2].replace('>', '');
                description = '';
            } else if (line.match(/<\/Augment Description>/i)) {
                evalMode = 'none';
                augDescriptions.push({ augType: augType, description: description });
            } else if (evalMode === 'help description') {
                description += line;
            }
        }
        return augDescriptions;
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

    DataManager.setParamBonus = function (item) {
        var bonuses = [];
        if (item) {
            notedata = this.convertNotedataToArray(item.note);
            for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];
                if (line.includes("NPARAMPLUS")) {
                    line = line.replace(/>/g, '');
                    var temp = line.split(' ');
                    bonuses.push({ param: temp[1], value: temp[2] });
                }
            }
        }
        item._paramBonuses = bonuses;
    }

    DataManager.setDamage = function (item) {
        if (item) {
            var meta = item.meta;
            if (meta.Damage) {
                item._dmg = meta.Damage.trim();
            }
        }
    }


    // ============================================================================
    //                    Window_Equip
    // ============================================================================

    function Window_Equip() {
        this.initialize.apply(this, arguments);
    }

    Window_Equip.prototype = Object.create(Window_Status.prototype);
    Window_Equip.prototype.constructor = Window_Equip;

    Window_Equip.prototype.initialize = function () {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
        this._actor = null;
        this.refresh();
    };


    Window_Equip.prototype.refresh = function () {
        this.contents.clear();
        if (this._actor) {
            var lineHeight = this.lineHeight();
            this.drawBlock1(6, lineHeight * 0);
            this.drawBlock2(6, lineHeight * 5);
            this.contents.fontSize = 36;
            this.drawEquipment(Graphics.boxWidth / 4 + this.padding, 0);
            this.drawInventory(5 * Graphics.boxWidth / 7, 0);
            this.resetFontSettings();
        }
    };


    Window_Equip.prototype.drawBlock1 = function (x, y) {
        this.drawActorFace(this._actor, x, y);
    };

    Window_Equip.prototype.drawBlock2 = function (x, y) {
        var st = this._actor.statusMenuCols();
        var width = Graphics.boxWidth / 8;
        this.contents.fontSize = TIKA.EM.Param.MenuFontSize;
        y += this.textPadding();
        this.drawActorMinMaxAttribute('Health:', 'hp', 'mhp', x, y, width);
        this.drawActorMinMaxAttribute('Mana:', 'mp', 'mmp', x, y + this.lineHeight(), width);
        this.drawHorzLine(x, y + this.lineHeight() * 1.75, width * 2);
        y += this.lineHeight() * 0.5;
        this.drawActorAttribute('Armor Class:', 'ac', x, y + this.lineHeight() * 2, width);
        this.drawText('Max Dex:', x, y + this.lineHeight() * 3, width, 'left');
        var maxDexText = "-";
        if(!isNaN(this._actor.maxdex) && this._actor.maxdex >= 0) {
            maxDexText = this._actor.maxdex;
        }
        this.drawText(maxDexText, x + width, y + this.lineHeight() * 3, width, 'left');
        this.drawActorInitiative(x, y + this.lineHeight() * 4, width);
        this.drawActorAttribute('Spell Resistance:', 'resist', x, y + this.lineHeight() * 5, width);
        this.drawActorAttribute('Armor Penalty:', 'acpen', x, y + this.lineHeight() * 6, width);
        this.drawActorAttribute('Attack Roll:', 'bab', x, y + this.lineHeight() * 7, width, true);
        this.drawActorWeaponDamage(x, y + this.lineHeight() * 8, width);
        this.drawActorTotalDamage(x, y + this.lineHeight() * 9, width);
        this.drawActorCriticalRange(x, y + this.lineHeight() * 10, width);
        y += this.lineHeight() * 2.25;
        this.drawHorzLine(x, y + this.lineHeight() * 9.5, width * 2);
        this.drawText('Attribute', x, y + this.lineHeight() * 9, width, 'left');
        this.drawText('Score', x + width, y + this.lineHeight() * 9, width, 'left');
        this.drawText('Modifier', x + width * 2 - this.textWidth('Modifier'), y + this.lineHeight() * 9, width, 'left');
        if (st[1].length != 0) {
            this.drawParameters(x, y + 10 * this.lineHeight(), width + this.textWidth('00'), st[1]);
        }
        if (st[2].length != 0) {
            this.drawParameters(x + width / 3 * 2 + this.textPadding() + this.textWidth('000') / 2, y + 10 * this.lineHeight(), width, st[2], true);
        }
        if (st[3].length != 0) {
            this.drawParameters(x, y + st[1].length * this.lineHeight() + 10 * this.lineHeight(), width + this.textWidth('00'), ['fort', 'will', 'ref'], true);
        }
        this.resetFontSettings();
    };

    Window_Equip.prototype.drawActorWeaponDamage = function (x, y, width) {
        this.drawText('Weapon Damage:', x, y, width, 'left');
        var weaponDamage = $gameVariables.value(TIKA.Param.Actor.WeaponDamageVar);
        var actor = this._actor;
        var mainWeapon = actor.equips()[0];
        if (mainWeapon)
            weaponDamage = actor.equips()[0]._dmg;
        var offhandWeapon = actor.equips()[1];
        if (offhandWeapon)
            var offhandWeaponDamage = actor.equips()[1]._dmg;
        var modifier = actor.strm;
        if (offhandWeapon && offhandWeaponDamage)
            this.drawText(weaponDamage + ' + ' + modifier + ', ' + offhandWeaponDamage + ' + ' + modifier, x + width, y, width, 'left');
        else
            this.drawText(weaponDamage + ' + ' + modifier, x + width, y, width, 'left');
    }

    Window_Equip.prototype.drawActorTotalDamage = function (x, y, width) {
        this.drawText('Damage:', x, y, width, 'left');
        this.drawText($gameVariables.value(TIKA.Param.Actor.TotalDamageMinVar) + ' - ' + $gameVariables.value(TIKA.Param.Actor.TotalDamageMaxVar), x + width, y, width, 'left');
    }

    Window_Equip.prototype.drawActorCriticalRange = function (x, y, width) {
        this.drawText('Critical:', x, y, width, 'left');
        this.drawText($gameVariables.value(TIKA.Param.Actor.CritRangeVar) + ' - ' + 20 + ' \u00d7' + $gameVariables.value(TIKA.Param.Actor.CritMultVar), x + width, y, width, 'left');
    }

    Window_Equip.prototype.drawActorAttribute = function (fullName, attrName, x, y, width, foretoken) {
        this.drawText(fullName, x, y, width, 'left');
        var attr = this._actor[attrName];
        if (attr > 0 && foretoken)
            attr = '+' + attr;
        this.drawText(attr, x + width, y, width, 'left');
    }

    Window_Equip.prototype.drawActorMinMaxAttribute = function (fullName, minAttr, maxAttr, x, y, width) {
        this.drawText(fullName, x, y, width, 'left');
        var min = this._actor[minAttr];
        var max = this._actor[maxAttr];
        this.drawText(min + '/' + max, x + width, y, width, 'left');
    }

    ICF.StatusMenu.drawParamsOldStyle = Window_Status.prototype.drawParameters;
    Window_Equip.prototype.drawParameters = function (x, y, width, ary, foretoken) {
        if ((width == undefined) || (ary == undefined)) {
            ICF.StatusMenu.drawParamsOldStyle.call(this, x, y);
            return;
        }
        var lineHeight = this.lineHeight();
        var y2 = y;
        var actor = this._actor;
        for (var i = 0; i < ary.length; i++) {
            var param = [];
            var gauge = false;
            if (ICF.Param.NParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.NParams.indexOf(ary[i]);
                if (!ICF.Param.NParamsFullName[paramId].contains('Modifier')) {
                    param.push(ICF.Param.NParamsFullName[paramId]);
                    param.push(actor.NParam(paramId));
                } else {
                    param.push('');
                    param.push(actor._NParamPlus[paramId]);
                }
            } else if (ICF.Param.PParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.PParams.indexOf(ary[i]);
                param.push(ICF.Param.PParamsFullName[paramId]);
                if (ICF.Param.PercentageParams.indexOf(ary[i]) > -1) {
                    param.push((actor.PParam(paramId) * 100).toFixed(2) + "%");
                } else {
                    param.push(Math.trunc(actor.PParam(paramId)));
                }
            } else if (ICF.Param.CParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.CParams.indexOf(ary[i]);
                param.push(ICF.Param.CParamsFullName[paramId]);
                param.push(actor.CParamValue(paramId));
                param.push(actor.CParam(paramId));
                param.push(ICF.Param.CParamColor1[paramId]);
                param.push(ICF.Param.CParamColor2[paramId]);
                gauge = true;
            } else if (ICF.Param.CParamsMax.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.CParamsMax.indexOf(ary[i]);
                param.push(ICF.Param.CParamsMaxFullName[paramId]);
                param.push(actor.CParam(paramId));
            } else if (ICF.Param.BParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.BParams.indexOf(ary[i]);
                param.push(TextManager.param(paramId));
                param.push(actor.param(paramId));
            } else if (ICF.Param.XParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.XParams.indexOf(ary[i]);
                param.push(ICF.Param.XParamsFullName[paramId]);
                param.push((actor.xparam(paramId) * 100).toFixed(2) + "%");
            } else if (ICF.Param.SParams.indexOf(ary[i]) > -1) {
                var paramId = ICF.Param.SParams.indexOf(ary[i]);
                param.push(ICF.Param.SParamsFullName[paramId]);
                param.push((actor.sparam(paramId) * 100).toFixed(2) + "%");
            } else if (ary[i].match(/(?:eval)(\d+)/i)) {
                var paramId = ICF.Param.EvalParams[RegExp.$1];
                param.push(paramId[0]);
                param.push(eval(paramId[1]));
            } else if (ary[i].match(/(?:percentage)(\d+)/i)) {
                var paramId = ICF.Param.EvalPercentParams[RegExp.$1];
                param.push(paramId[0]);
                param.push((eval(paramId[1]) * 100).toFixed(2) + "%");
            } else if (ary[i].match(/(?:gauge)(\d+)/i)) {
                var paramId = ICF.Param.EvalGauges[RegExp.$1];
                param.push(paramId[0]);
                param.push(eval(paramId[1]));
                param.push(eval(paramId[2]));
                param.push(paramId[3]);
                param.push(paramId[4]);
                param.push(paramId[5]);
                gauge = true;
            }
            if (gauge) {
                var color1 = isNaN(param[3]) ? param[3] : this.textColor(param[3]);
                var color2 = isNaN(param[4]) ? param[4] : this.textColor(param[4]);
                this.drawGauge(x, y2, width, (param[1] / param[2]).clamp(0.0, 1.0), color1, color2);
                if (param[5]) {
                    this.changeTextColor(this.systemColor());
                    this.drawText(param[0], x, y2, width / 3);
                    this.drawCurrentAndMax(param[1], param[2], x + width / 3 - this.textWidth('HP'), y2,
                        width * 2 / 3 + this.textWidth('HP'), this.normalColor(), this.normalColor());
                } else {
                    this.changeTextColor(this.systemColor());
                    this.drawText(param[0], x, y2, width * 2 / 3);
                    this.resetTextColor();
                    this.drawText(param[1], x + width * 2 / 3, y2, width / 3, 'right');
                }
            } else if (param.length > 0) {
                this.resetTextColor();
                this.drawText(param[0], x, y2, width * 2 / 3);
                if (param[1] > 0 && foretoken)
                    this.drawText('+' + param[1], x + width * 2 / 3, y2, width / 3, 'right');
                else
                    this.drawText(param[1], x + width * 2 / 3, y2, width / 3, 'right');
                this.resetTextColor();
            }
            y2 += lineHeight;
        }
    };

    Window_Equip.prototype.drawEquipment = function (x, y) {
        this.drawHorzLine(x, y + this.lineHeight() / 2 - this.textPadding(), this.textWidth('Equipment'));
        this.drawText('Equipment', x, y, Graphics.boxWidth / 3.5, 'left');
    };

    Window_Equip.prototype.drawInventory = function (x, y) {
        this.drawHorzLine(x, y + this.lineHeight() / 2 - this.textPadding(), this.textWidth('Inventory'));
        this.drawText('Inventory', x, y, Graphics.boxWidth / 2.75, 'left');
    };

    Window_Equip.prototype.drawHorzLine = function (x, y, width, height) {
        var lineY = y + this.lineHeight() / 2 - 1;
        this.contents.fillRect(x, lineY, width, height || 2, this.lineColor());
    };

    Window_Equip.prototype.lineColor = function () {
        return this.normalColor();
    };

    Window_Equip.prototype.setActor = function (actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    Window_Equip.prototype.drawActorInitiative = function (x, y, width) {
        var initiative = 0;
        this.drawText('Initiative:', x, y, width, 'left');
        if (this._actor.maxdex >= 0) {
            if (this._actor.dexm >= this._actor.maxdex)
                initiative = this._actor.maxdex;
            else
                initiative = this._actor.dexm;
        } else {
            initiative = this._actor.dexm;
        }
        initiative += this._actor.init;
        this.drawText(initiative, x + width, y, width, 'left');
    }

    Window_Equip.prototype.setTempActor = function (tempActor) {
        if (this._tempActor !== tempActor) {
            this._tempActor = tempActor;
            this.refresh();
        }
    };

    Window_Equip.prototype.lineHeight = function () {
        return this.contents.fontSize + this.contents.fontSize / 6;
    }

    // ============================================================================
    //                    Scene_Equip
    // ============================================================================


    Scene_Equip.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        TIKA.EquipmentMenu.isEquipmentMenu = true;
        this.createInterpreter();
        this.createEquipWindow();
        this.createCommandWindow();
        this.createSlotWindow();
        this.createItemWindow();
        this.createActionWindow();
        this.createAugmentListWindow();
        this.createEquipAugmentWindow();
        this.createOptimizeWindow();
        this.createHelpWindow();
        this.createInfoWindow();
        this.refreshActor();
        TIKA.EM.Actor = this.actor();
    };

    Scene_Equip.prototype.createInterpreter = function () {
        this._interpreter = new Game_Interpreter();
    };

    Scene_Equip.prototype.createEquipWindow = function () {
        this._statusWindow = new Window_Equip(0, 0);
        this.addWindow(this._statusWindow);
        this._statusWindow.setActor(this.actor());
        this._statusWindow.refresh();
    };

    Scene_Equip.prototype.createOptimizeWindow = function () {
        var wx = Graphics.boxWidth / 4 + this._statusWindow.padding;
        var wy = this._statusWindow.lineHeight() * 2;
        this._optimizeWindow = new Window_Optimize(wx, wy);
        this._optimizeWindow.width = Graphics.boxWidth - wx - (Graphics.boxWidth - 5 * Graphics.boxWidth / 7) + this._statusWindow.padding;
        this.addWindow(this._optimizeWindow);
        this._optimizeWindow.setHandler('optimize', this.commandOptimizeEquipment.bind(this));
        this._optimizeWindow.setHandler('cancel', this.cancelOptimize.bind(this));
        this._optimizeWindow.refresh();
        this._statusWindow.addChild(this._optimizeWindow);
    };

    Scene_Equip.prototype.createEquipAugmentWindow = function () {
        var wx = Graphics.boxWidth / 4 + this._statusWindow.padding;
        var wy = this._statusWindow.lineHeight() * 2;
        this._equipAugmentWindow = new Window_Augment(wx, wy);
        this._equipAugmentWindow.width = Graphics.boxWidth - wx - (Graphics.boxWidth - 5 * Graphics.boxWidth / 7) + this._statusWindow.padding;
        this.addWindow(this._equipAugmentWindow);
        this._equipAugmentWindow.setHandler('equip', this.commandEquip.bind(this));
        this._equipAugmentWindow.setHandler('augment', this.commandAugment.bind(this));
        this._equipAugmentWindow.setHandler('cancel', this.cancelEquipAugment.bind(this));
        this._equipAugmentWindow.refresh();
        this._statusWindow.addChild(this._equipAugmentWindow);
    };

    Scene_Equip.prototype.createCommandWindow = function () {
        var wx = Graphics.boxWidth / 7;
        var wy = 0;
        var ww = Graphics.boxWidth / 8;
        this._commandWindow = new Window_EquipCommand(wx, wy, ww);
        this._commandWindow.width = Graphics.boxWidth / 9;
        this._commandWindow.opacity = 0;
        this._commandWindow.setHandler('equip', this.commandEquipAugment.bind(this));
        this._commandWindow.setHandler('optimize', this.commandOptimize.bind(this));
        this._commandWindow.setHandler('clear', this.commandClear.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._commandWindow.setHandler('pageup', this.previousActor.bind(this));
        this.addWindow(this._commandWindow);
        this._statusWindow.addChild(this._commandWindow);
    };

    Scene_Equip.prototype.createSlotWindow = function () {
        var wx = Graphics.boxWidth / 4 + this._statusWindow.padding;
        var wy = this._statusWindow.lineHeight() * 4;
        var ww = Graphics.boxWidth - wx - (Graphics.boxWidth - 5 * Graphics.boxWidth / 7) + this._statusWindow.padding;
        var wh = Graphics.boxHeight - wy;
        this._slotWindow = new Window_EquipSlot(wx, wy, ww, wh);
        this._slotWindow.opacity = 0;
        this._slotWindow.setStatusWindow(this._statusWindow);
        this._slotWindow.setHandler('ok', this.onSlotOk.bind(this));
        this._slotWindow.setHandler('cancel', this.onSlotCancel.bind(this));
        this.addWindow(this._slotWindow);
        this._statusWindow.addChild(this._slotWindow);
    };

    Scene_Equip.prototype.createItemWindow = function () {
        var wx = 5 * Graphics.boxWidth / 7;
        var wy = this._statusWindow.lineHeight() * 4;
        var ww = Graphics.boxWidth - wx;
        var wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_EquipItem(wx, wy, ww, wh);
        this._itemWindow.opacity = 0;
        this._itemWindow.setStatusWindow(this._statusWindow);
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._slotWindow.setItemWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
        this._statusWindow.addChild(this._itemWindow);
    };

    Scene_Equip.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Description(10);
        this._helpWindow.width = Graphics.boxWidth / 5;
        this._helpWindow.x = Graphics.boxWidth / 3 - this._helpWindow.width / 10;
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._slotWindow.setHelpWindow(this._helpWindow);
        this._augmentListWindow.setHelpWindow(this._helpWindow);
        this._itemActionWindow.setHelpWindow(this._helpWindow);
        this._helpWindow.margin = 0;
        this._helpWindow.padding = 7;
        this._helpWindow.openness = 0;
        this._helpWindow.deactivate();
        this.addWindow(this._helpWindow);
    };

    Scene_Equip.prototype.createInfoWindow = function () {
        var wx = 0;
        var wy = 0;
        var ww = Graphics.boxWidth / 4;
        var wh = Graphics.boxHeight;
        this._infoWindow = new Window_ItemInfo(wx, wy, ww, wh);
        this._infoWindow.hide();
        this._infoWindow.margin = 0;
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._itemWindow.setInfoWindow(this._infoWindow);
        this.addWindow(this._infoWindow);
    };

    Scene_Equip.prototype.popScene = function () {
        TIKA.EquipmentMenu.isEquipmentMenu = false;
        SceneManager.pop();
    };

    Scene_Equip.prototype.onSlotOk = function () {
        if (this._equipAugmentWindow.currentExt() == 1) {
            if (this._infoWindow.visible) {
                this._infoWindow.hide();
                var item = this._slotWindow.item();
                if (item && item.augmentSlots[0]) {
                    this.openAugmentWindow(item);
                    return;
                }
            }
            this._helpWindow.show();
            this._itemWindow._slotId = -1;
            var slotId = this._slotWindow.index();
            Yanfly.Equip.Window_EquipItem_setSlotId.call(this._itemWindow, slotId);
            Yanfly.Equip.Scene_Equip_onSlotOk.call(this);
        } else {
            var item = this._slotWindow.item();
            if (item && item.augmentSlots[0]) {
                this.openAugmentWindow(item);
            } else {
                this._slotWindow.activate();
            }
        }
    };

    Scene_Equip.prototype.openAugmentWindow = function (item) {
        var slotId = this._itemActionWindow.currentExt() || 0;
        this._augmentListWindow.setItem(this.item(), slotId);
        this._augmentListWindow.resizeAndReposition();
        this._itemActionWindow.setItem(item);
        this._slotWindow.deactivate();
        this._helpWindow.show();
        this._slotWindow._helpWindow.close();
        this._itemActionWindow.select(0);
        this._itemActionWindow.activate();
        this._infoWindow.hide();
    };

    Scene_Equip.prototype.refreshActor = function () {
        var actor = this.actor();
        actor.refresh();
        this._statusWindow.setActor(actor);
        this._slotWindow.setActor(actor);
        this._itemWindow.setActor(actor);
        $gameTemp.reserveCommonEvent(17);
        this._interpreter.setupReservedCommonEvent();
        this._interpreter.update();
        this._statusWindow.refresh();
    };

    Scene_Equip.prototype.commandEquipAugment = function () {
        this._equipAugmentWindow.show();
        this._equipAugmentWindow.activate();
        this._equipAugmentWindow.select(0);
    };

    Scene_Equip.prototype.commandEquip = function () {
        this._slotWindow.activate();
        this._slotWindow.select(0);
        this._itemWindow.show();
        this._augmentListWindow.hide();
    };

    Scene_Equip.prototype.commandAugment = function () {
        this._slotWindow.activate();
        this._slotWindow.select(0);
        this._itemWindow.hide();
        var slotId = this._itemActionWindow.currentExt() || 0;
        if (this.item())
            this._augmentListWindow.setItem(this.item(), slotId);
        this._augmentListWindow.resizeAndReposition();
        this._augmentListWindow.deactivate();
        this._augmentListWindow.show();
    };

    Scene_Equip.prototype.createActionWindow = function () {
        var wy = 0;
        this._itemActionWindow = new Window_ItemActionCommand(0, wy);
        this._itemActionWindow.margin = 0;
        this._itemActionWindow.height = Graphics.boxHeight / 3;
        this._itemActionWindow.setHandler('augment', this.onActionAugment.bind(this));
        this._itemActionWindow.setHandler('cancel', this.onActionCancel.bind(this));
        this.addWindow(this._itemActionWindow);
    };

    Scene_Equip.prototype.onActionUse = function () {
        this._itemActionWindow.hide();
        this._itemActionWindow.deactivate();
        $gameParty.setLastItem(this.item());
        this.determineItem();
    };

    Scene_Equip.prototype.onActionCancel = function () {
        this._itemActionWindow.hide();
        this._itemActionWindow.deactivate();
        this._augmentListWindow.deactivate();
        this._infoWindow.hide();
        this._itemWindow.refresh();
        this._slotWindow.activate();
        if (this._equipAugmentWindow.currentExt() == 1) {
            this._augmentListWindow.hide();
            this._itemWindow.show();
        }
    };

    Scene_Equip.prototype.createAugmentListWindow = function () {
        var wx = 5 * Graphics.boxWidth / 7;
        var wy = this._statusWindow.lineHeight() * 4;
        var ww = Graphics.boxWidth - wx;
        var wh = Graphics.boxHeight - wy;
        this._augmentListWindow = new Window_AugmentItemList(wx, wy, ww, wh);
        this._augmentListWindow.opacity = 0;
        this._augmentListWindow.setHelpWindow(this._helpWindow);
        this._augmentListWindow.setHandler('ok', this.onAugmentListOk.bind(this));
        this._augmentListWindow.setHandler('cancel', this.onAugmentListCancel.bind(this));
        this.addWindow(this._augmentListWindow);
        this._statusWindow.addChild(this._augmentListWindow);
    };

    Scene_Equip.prototype.onActionAugment = function () {
        this._itemActionWindow.deactivate();
        this._augmentListWindow.show();
        this._augmentListWindow.activate();
        this._itemWindow.hide();
        var slotId = this._itemActionWindow.currentExt();
        this._augmentListWindow.setItem(this.item(), slotId);
        this._augmentListWindow.select(0);
    };

    Scene_Equip.prototype.onAugmentListOk = function () {
        var effectItem = this._augmentListWindow.item();
        var slotId = this._itemActionWindow.currentExt();
        ItemManager.applyAugmentEffects(this.item(), effectItem, slotId, 1);
        this.actor().updateParamModifiers();
        this.refreshActor();
        this._augmentListWindow.refresh();
        this._augmentListWindow._helpWindow.close();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._itemActionWindow.refresh();
        this._helpWindow.show();
        this.onAugmentListCancel();
    };

    Scene_Equip.prototype.onAugmentListCancel = function () {
        this._augmentListWindow._helpWindow.close();
        this._augmentListWindow.deactivate();
        this._augmentListWindow.deselect();
        this._itemActionWindow.activate();
        this._helpWindow.setItem(this.item());
    };

    Scene_Equip.prototype.commandOptimize = function () {
        this._commandWindow.deactivate();
        this._optimizeWindow.show();
        this._optimizeWindow.activate();
    };

    Scene_Equip.prototype.cancelOptimize = function () {
        this._commandWindow.activate();
        this._optimizeWindow.hide();
        this._optimizeWindow.deactivate();
    };

    Scene_Equip.prototype.cancelEquipAugment = function () {
        this._commandWindow.activate();
        this._equipAugmentWindow.hide();
        this._equipAugmentWindow.deactivate();
    };

    var Scene_Equip_commandOptimize = Scene_Equip.prototype.commandOptimize;
    Scene_Equip.prototype.commandOptimizeEquipment = function () {
        if (Imported.TIKA_EquipmentMenu) {
            $gameTemp._optimizeEquipments = true;
            var hpRate = this.actor().hp / Math.max(1, this.actor().mhp);
            var mpRate = this.actor().mp / Math.max(1, this.actor().mmp);
            SoundManager.playEquip();
            this.actor().optimizeEquipments(this._optimizeWindow.currentExt());
            this._statusWindow.refresh();
            this._slotWindow.refresh();
            this._optimizeWindow.activate();
            $gameTemp._optimizeEquipments = false;
            var max = this.actor().isDead() ? 0 : 1;
            var hpAmount = Math.max(max, parseInt(this.actor().mhp * hpRate));
            this.actor().setHp(hpAmount);
            this.actor().setMp(parseInt(this.actor().mmp * mpRate));
            this.refreshActor();
            this._statusWindow.refresh();
        } else {
            Scene_Equip_commandOptimize.call(this);
        }
    };



    Scene_Equip.prototype.commandClear = function () {
        SoundManager.playEquip();
        this.actor().clearEquipments();
        this.refreshActor();
        this._slotWindow.refresh();
        this._commandWindow.activate();
        this._statusWindow.refresh();
    };

    Scene_Equip.prototype.onSlotCancel = function () {
        if (this._infoWindow.visible) {
            this._infoWindow.hide();
            this._helpWindow.show();
            this._slotWindow.activate();
            this._slotWindow._helpWindow.show();
        } else {
            this._slotWindow.deselect();
            this._slotWindow._helpWindow.close();
            this._equipAugmentWindow.activate();
            this._augmentListWindow.hide();
            this._itemWindow.show()
        }
    };

    Scene_Equip.prototype.onItemOk = function () {
        SoundManager.playEquip();
        this.actor().changeEquip(this._slotWindow.index(), this._itemWindow.item());
        this.refreshActor();
        this._slotWindow.activate();
        this._slotWindow.refresh();
        this._itemWindow.deselect();
        this._itemWindow.refresh();
        this._statusWindow.refresh();
        this._itemWindow._helpWindow.close();
    };

    Scene_Equip.prototype.onItemCancel = function () {
        this._slotWindow.activate();
        this._itemWindow.deselect();
        this._itemWindow._helpWindow.close();
    };

    Scene_Equip.prototype.item = function () {
        return this._slotWindow.item();
    };

    var Scene_Equip_update = Scene_Equip.prototype.update;
    Scene_Equip.prototype.update = function () {
        Scene_Equip_update.call(this);
        this.resizeAndUpdateItemActionWindow();
        this.resizeAndUpdateAugmentListWindow();
        this.resizeAndUpdateSlotWindow();
        if (this.item() && this.item().augmentSlots[0]) {
            var slotId = this._itemActionWindow.currentExt() || 0;
            this._augmentListWindow.setItem(this.item(), slotId);
        }
    };

    Scene_Equip.prototype.resizeAndUpdateItemActionWindow = function () {
        if (this._itemActionWindow.active) {
            this._itemActionWindow.resize();
            this._itemActionWindow.activate();
            this._itemActionWindow.updatePlacement(this._slotWindow.x + this._slotWindow.padding, this._slotWindow.y + this._slotWindow._cursorRect.y + this._slotWindow.padding, this._slotWindow._cursorRect);
            this._itemActionWindow.updateHelp();
            this._itemActionWindow._helpWindow.width = 2 * this._itemActionWindow.width / 3;
            this._itemActionWindow._helpWindow.updatePlacement(this._itemActionWindow.x + this._itemActionWindow.padding * 2, this._itemActionWindow.y + this._itemActionWindow._cursorRect.y, this._itemActionWindow._cursorRect);
        }
    };



    Scene_Equip.prototype.resizeAndUpdateAugmentListWindow = function () {
        if (this._augmentListWindow.active) {
            this._augmentListWindow.resizeAndReposition();
            this._augmentListWindow._helpWindow.width = this._augmentListWindow.width - this._augmentListWindow.padding * 2;
            this._augmentListWindow._helpWindow.updatePlacement(this._augmentListWindow.x + this._augmentListWindow.padding, this._augmentListWindow.y + this._augmentListWindow._cursorRect.y + this._augmentListWindow.textPadding(), this._augmentListWindow._cursorRect);
        }
    };

    Scene_Equip.prototype.resizeAndUpdateSlotWindow = function () {
        if (this._slotWindow.active) {
            this._slotWindow._helpWindow.width = 3 * this._slotWindow.width / 5;
            this._slotWindow._helpWindow.updatePlacement(this._slotWindow.x + this._slotWindow.padding, this._slotWindow.y + this._slotWindow._cursorRect.y + this._slotWindow.textPadding(), this._slotWindow._cursorRect);
            this._slotWindow._helpWindow.refresh();
        }
    };

    Scene_Equip.prototype.onActorChange = function () {
        this.refreshActor();
        this._commandWindow.activate();
        if (this._compareWindow) this._compareWindow.setTempActor(null);
        if (this._infoWindow) this._infoWindow.setItem(null);
    };


    // ============================================================================
    //                    Window_EquipSlot
    // ============================================================================

    Window_EquipSlot.prototype.lineHeight = function () {
        return 28;
    };

    var Window_EquipSlot_cursorRight = Window_EquipSlot.prototype.cursorRight;
    Window_EquipSlot.prototype.cursorRight = function (wrap) {
        Window_EquipSlot_cursorRight.call(this, wrap);
        var scene = this.parent.parent.parent;
        var item = this.item();
        if (item && item.augmentSlots[0]) {
            this._helpWindow.hide();
            scene._infoWindow.setItem(this.item());
            scene._infoWindow.show();
            scene._infoWindow.resize();
            scene._infoWindow.activate();
            scene._infoWindow.updatePlacement(scene._slotWindow.x + scene._slotWindow.padding, scene._slotWindow.y + this._cursorRect.y + scene._slotWindow.padding, this._cursorRect);
        } else {
            this.activate();
        }
    };

    var Window_EquipSlot_cursorLeft = Window_EquipSlot.prototype.cursorLeft;
    Window_EquipSlot.prototype.cursorLeft = function (wrap) {
        Window_EquipSlot_cursorLeft.call(this, wrap);
        var scene = this.parent.parent.parent;
        this._helpWindow.show();
        scene._infoWindow.hide();
        this.activate();
    };

    var Window_EquipSlot_cursorUp = Window_EquipSlot.prototype.cursorUp;
    Window_EquipSlot.prototype.cursorUp = function (wrap) {
        var scene = this.parent.parent.parent;
        if (scene._infoWindow.visible)
            return;
        Window_EquipSlot_cursorUp.call(this, wrap);
    };

    var Window_EquipSlot_cursorDown = Window_EquipSlot.prototype.cursorDown;
    Window_EquipSlot.prototype.cursorDown = function (wrap) {
        var scene = this.parent.parent.parent;
        if (scene._infoWindow.visible && SceneManager._scene instanceof Scene_Equip)
            return;
        Window_EquipSlot_cursorDown.call(this, wrap);
    };

    var Window_EquipSlot_onTouch = Window_EquipSlot.prototype.onTouch;
    Window_EquipSlot.prototype.onTouch = function (triggered) {
        var scene = this.parent.parent.parent;
        if (scene._infoWindow.visible && SceneManager._scene instanceof Scene_Equip)
            return;
        Window_EquipSlot_onTouch.call(this, triggered);
    };

    Window_EquipSlot.prototype.item = function () {
        var item = this._actor._equips[this.index()];
        if (item)
            if (item._dataClass == 'weapon')
                return $dataWeapons[item._itemId];
            else if (item._dataClass == 'armor')
                return $dataArmors[item._itemId];
            else if (item.dataClass == 'item')
                return $dataItems[item._itemId];

        return null;
    };

    Window_EquipSlot.prototype.drawAllItems = function () {
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
    };

    Window_EquipSlot.prototype.drawItem = function (index) {
        if (this._actor) {
            this.contents.fontSize = TIKA.EM.Param.MenuFontSize;
            var rect = this.itemRectForText(index);
            this.changeTextColor(this.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            this.drawText(this.slotName(index), rect.x, rect.y, 138, this.lineHeight());
            this.drawItemName(this._actor.equips()[index], rect.x + 158, rect.y);
            this.drawItemAugments(this._actor.equips()[index], rect.x + 188, rect.y);
            this.changePaintOpacity(true);
            this.resetFontSettings();
        }
    };

    var Window_EquipSlot_drawItemName = Window_EquipSlot.prototype.drawItemName;
    Window_EquipSlot.prototype.drawItemName = function (item, x, y, width) {
        width = width || 312;
        if (item) {
            Window_EquipSlot_drawItemName.call(this, item, x, y, width)
        } else {
            var iconBoxWidth = Window_Base._iconWidth + 4;
            this.changeTextColor(this.textColor(8));
            this.drawText('-None-', x + iconBoxWidth, y, width - iconBoxWidth);
            this.resetTextColor();
        }
    };

    Window_EquipSlot.prototype.drawItemAugments = function (item, x, y) {
        if (item && item.augmentSlots[0]) {
            var numberAugsSlots = item.augmentSlots.length;
            var text = '';
            for (var i = 0; i < numberAugsSlots; i++) {
                if (item.augmentSlotItems) {
                    if (item.augmentSlotItems[i] != 'none')
                        text += '\u25C6';
                    else
                        text += '\u25C7';
                }
                else
                    text += '\u25C7';
            }
            this.contents.fontSize = TIKA.EM.Param.MenuFontSize - 10;
            var width = this.textWidth(text);
            this.drawText(text, x - width, y + this.textPadding() / 2, width, 'right');
            this.resetFontSettings();
        }
    };

    Window_EquipSlot.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        if (index >= this.maxPageItems() - 5) {
            rect.y += this.lineHeight();
        }

        return rect;
    };
    // ============================================================================
    //                    Window_ItemActionCommand
    // ============================================================================
    var Window_ItemActionCommand_makeCommandList = Window_ItemActionCommand.prototype.makeCommandList;
    Window_ItemActionCommand.prototype.makeCommandList = function () {
        if (!this._item) return;
        if (TIKA.EquipmentMenu.isEquipmentMenu) {
            this.addCustomCommandsF();
            this.addCancelCommand();
        } else {
            Window_ItemActionCommand_makeCommandList.call(this);
        }
    };

    Window_ItemActionCommand.prototype.addAugmentSlots = function () {
        ItemManager.checkAugmentSlots(this._item);
        var length = this._item.augmentSlots.length;
        for (var i = 0; i < length; ++i) {
            var enabled = this._item.augmentSlotEnable[i] && !$gameParty.inBattle();
            var fmt = Yanfly.Param.AugmentSlotFmt;
            var slot = this._item.augmentSlots[i];
            var name = this.getAugmentSlotItemName(i);
            var text = fmt.format(slot, name);
            this.addCommand(text, 'augment', enabled, i);
        }
        this.changePaintOpacity(true);
    };

    Window_ItemActionCommand.prototype.updateHelp = function () {
        var text = '';
        var item = this._item;
        if (!item.augmentSlots) { this._helpWindow.setText(text); return; }

        var augmentSlot = item.augmentSlots[this._index];
        var augmentSlotItem = item.augmentSlotItems[this._index];
        if (augmentSlotItem == 'none' || !augmentSlotItem) { this._helpWindow.setText(text); return; };

        var augmentItem = $dataItems[Number(augmentSlotItem.split(' ')[1])];
        var augmentDescriptions = augmentItem._augmentDescriptions;
        for (var i = 0; i < augmentDescriptions.length; i++) {
            if (augmentDescriptions[i].augType == augmentSlot) {
                text = augmentDescriptions[i].description;
                this._helpWindow.setText(text);
                return;
            }
        }

    };

    Window_ItemActionCommand.prototype.updatePlacement = function (x, y, rect) {
        this._refreshBack();
        this.margin = 0;
        this.x = x + rect.width - this.width;
        this.y = y + rect.height;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = y + 0.5 * rect.height - this.height;
        }
        if (this.x + this.width > Graphics.boxWidth) {
            this.x = x - this.width + rect.width;
        }
    };

    Window_ItemActionCommand.prototype.standardBackOpacity = function () {
        return 245;
    };


    Window_ItemActionCommand.prototype._refreshBack = function () {
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

    Window_ItemActionCommand.prototype.resize = function () {
        this.height = (this._item.augmentSlots.length + 1) * this.itemRect().height + 2 * this.padding;
        var list = this._list;
        var largestLength = 0;
        for (var i = 0; i < list.length; i++) {
            if (list[i].name.length > largestLength) {
                largestLength = list[i].name.length;
            }
        }
        this.width = (largestLength - 10) * this.textWidth('0');
        this.refresh();
    };

    Window_ItemActionCommand.prototype.drawItem = function (index) {
        this.contents.fontSize = TIKA.EM.Param.MenuFontSize;
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawTextEx(this.commandName(index), rect.x, rect.y);
        this.resetFontSettings();
    };

    Window_ItemActionCommand.prototype.drawTextEx = function (text, x, y) {
        if (text) {
            var textState = { index: 0, x: x, y: y, left: x };
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

    Window_ItemActionCommand.prototype.itemRectForText = function (index) {
        var rect = this.itemRect(index);
        rect.x += this.textPadding();
        rect.width -= this.textPadding() * 2;
        return rect;
    };



    // ============================================================================
    //                    Window_EquipItem
    // ============================================================================

    Window_EquipItem.prototype.setSlotId = function (slotId) {
        if (this._slotId !== slotId) {
            this._slotId = slotId;
            this.refresh();
            this.resetScroll();
        }
    };

    Window_EquipItem.prototype.makeItemList = function () {
        this._data = $gameParty.allItems().filter(function (item) {
            return this.includes(item);
        }, this);
        this._data.push(null);
    };

    Window_EquipItem.prototype.drawItem = function (index) {
        var item = this._data[index];
        this.contents.fontSize = TIKA.EM.Param.MenuFontSize;
        if (item === null) {
            this.drawRemoveEquip(index);
        } else {
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            var augmentWidth = this.drawItemAugments(item, rect.x, rect.y, rect.width);
            this.contents.fontSize = TIKA.EM.Param.MenuFontSize;
            this.drawItemName(item, rect.x, rect.y, rect.width - augmentWidth - this.padding);
            this.changePaintOpacity(1);
        }
        this.resetFontSettings();
    }

    Window_EquipItem.prototype.drawItemAugments = function (item, x, y, width) {
        if (item && item.augmentSlots[0]) {
            var numberAugsSlots = item.augmentSlots.length;
            var text = '';
            for (var i = 0; i < numberAugsSlots; i++) {
                if (item.augmentSlotItems) {
                    if (item.augmentSlotItems[i] != 'none')
                        text += '\u25C6';
                    else
                        text += '\u25C7';
                }
                else
                    text += '\u25C7';
            }
            this.contents.fontSize = TIKA.EM.Param.MenuFontSize - 10;
            this.drawText(text, x, y + this.textPadding() / 2, width, 'right');
            var textWidth = this.textWidth(text);
            this.resetFontSettings();
            return textWidth;
        }
    };

    Window_EquipItem.prototype.updateHelp = function () {
        Window_ItemList.prototype.updateHelp.call(this);
        if (this._actor && this._statusWindow) {
            var actor = JsonEx.makeDeepCopy(this._actor);
            actor.forceChangeEquip(this._slotId, this.item());
            this._statusWindow.setTempActor(actor);
        }
        this._helpWindow.width = 3 * this.width / 5;
        this._helpWindow.updatePlacement(this.x + this.padding, this.y + this._cursorRect.y, this._cursorRect);
    };

    // ============================================================================
    //                       Window_AugmentItemList
    // ============================================================================
    Window_AugmentItemList.prototype.resizeAndReposition = function () {
        this.x = 5 * Graphics.boxWidth / 7;
        this.y = this.lineHeight() * 4;
        this.height = Graphics.boxHeight - this.y;
        this.width = Graphics.boxWidth - this.x;
        this.refresh();
    };

    Window_AugmentItemList.prototype.maxCols = function () {
        return 1;
    };

    var Window_AugmentItemList_update = Window_AugmentItemList.prototype.update;
    Window_AugmentItemList.prototype.update = function () {
        Window_AugmentItemList_update.call(this);
        if (this._helpWindow && this.active) {
            var item = this._data[this.index()];
            var desc = this.getAugDescription(item);
            if (item) {
                if (item.id >= 3000)
                    item.description = desc;
                else
                    item._description = desc;
                this._helpWindow.setItem(item);
            }
        }
    };

    Window_AugmentItemList.prototype.getAugDescription = function (item) {
        if (!item) return '';
        if (!item._augmentDescriptions) return item.description;
        var scene = this.parent.parent.parent;
        var augType = this._item.augmentSlots[scene._itemActionWindow.index()];
        var augDescs = item._augmentDescriptions;

        for (var i = 0; i < augDescs.length; i++) {
            if (augDescs[i].augType == augType) {
                return augDescs[i].description;
            }
        }
        return item.description;
    };

    Window_AugmentItemList.prototype.setItem = function (item, slotId) {
        if (this._item === item && this._slotId === slotId) return;
        ItemManager.checkAugmentSlots(item);
        this._item = item;
        this._slotId = slotId;
        this.refresh();
    };

    Window_AugmentItemList.prototype.containsType = function (item) {
        if (!this._item) return false;
        if (!this._item.augmentSlots[this._slotId]) return false;
        var type = this._item.augmentSlots[this._slotId].toUpperCase().trim();
        return item.augmentTypes.contains(type);
    };

    var Window_AugmentItemList_drawItem = Window_AugmentItemList.prototype.drawItem;
    Window_AugmentItemList.prototype.drawItem = function (index) {
        this.contents.fontSize = TIKA.EM.Param.MenuFontSize;
        Window_AugmentItemList_drawItem.call(this, index);
        this.resetFontSettings();
    };

    Window_AugmentItemList.prototype.lineHeight = function () {
        return 28;
    }

    Window_AugmentItemList.prototype.itemHeight = function () {
        return this.lineHeight();
    };

    // ============================================================================
    //                       Window_ItemInfo
    // ============================================================================


    Window_ItemInfo.prototype.updatePlacement = function (x, y, rect) {
        this._refreshBack();
        this.x = x + rect.width - this.width;
        this.y = y + rect.height;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = y + 0.5 * rect.height - this.height;
        }
        if (this.x + this.width > Graphics.boxWidth) {
            this.x = x - this.width + rect.width;
        }
    };

    Window_ItemInfo.prototype.resize = function () {
        var scene = this.parent.parent;
        this.height = (this._item.augmentSlots.length + 3) * scene._slotWindow.itemRect().height + 2 * this.padding;
        this.width = Graphics.boxWidth / 4;
        this.refresh();
    };

    Window_ItemInfo.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };

    Window_ItemInfo.prototype.refresh = function () {
        this.contents.clear();
        var dy = 0;
        if (!this._item) return dy;
        this.preInfoEval();
        dy = this.drawPreItemInfo(dy);
        dy = this.drawItemInfo(dy);
        return this.drawItemInfoF(dy);
    };

    Window_ItemInfo.prototype.standardBackOpacity = function () {
        return 245;
    };

    var Window_ItemInfo_refresh = Window_ItemInfo.prototype.refresh;
    Window_ItemInfo.prototype.refresh = function () {
        this.padding = 5;
        this.resetFontSettings();
        Window_ItemInfo_refresh.call(this);
    };

    Window_ItemInfo.prototype.resetFontSettings = function () {
        this.contents.fontSize = TIKA.EM.Param.MenuFontSize;
    };

    Window_ItemInfo.prototype._refreshBack = function () {
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

    // ============================================================================
    //                       Game_Actor
    // ============================================================================

    var Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function (slotId, item) {
        // var preItem = this.getItem(this._equips[slotId]);
        // var augment = ItemManager.removeAugmentVariableEffect(preItem);
        // augment = ItemManager.applyAugmentVariableEffect(item);

        Game_Actor_changeEquip.call(this, slotId, item);
    };

    ItemManager.removeAugmentVariableEffect = function (item, slotId) {
        if (!item) return;
        for (var i = 0; i < item.augmentSlots.length; i++) {
            if (!item.augmentSlotItems) continue;
            if (!item.augmentSlotItems[i]) continue;
            $gameTemp._augmentSetting = 'detach';
            var type = item.augmentSlots[i].toUpperCase().trim();
            var augment = this.augmentInSlot(item, i);
            if (!augment) {
                $gameTemp._augmentSetting = undefined;
                return augment;
            }
            var list = augment.augmentDataDetach[type];
            for (var i = 0; i < list.length; i++) {
                if (!list[i].includes('VARIABLE'))
                    list.splice(i, 1);
            }

            if (list && list.length > 0) {
                this.processAugmentList(item, augment, slotId, list);
            }
        }
        return augment;
    };

    ItemManager.applyAugmentVariableEffect = function (item, slotId) {
        if (!item) return
        for (var i = 0; i < item.augmentSlots.length; i++) {
            if (!item.augmentSlotItems) continue;
            if (!item.augmentSlotItems[i]) continue;
            $gameTemp._augmentSetting = 'attach';
            var type = item.augmentSlots[i].toUpperCase().trim();
            var augment = this.augmentInSlot(item, i);
            if (!augment) {
                $gameTemp._augmentSetting = undefined;
                return augment;
            }
            var list = augment.augmentDataAttach[type];
            for (var i = 0; i < list.length; i++) {
                if (!list[i].includes('VARIABLE'))
                    list.splice(i, 1);
            }
            if (list && list.length > 0) {
                this.processAugmentList(item, augment, slotId, list);
            }
        }
        return augment;
    };

    Game_Actor.prototype.getItem = function (item) {
        switch (item._dataClass) {
            case 'item':
                return $dataItems[item._itemId];
            case 'weapon':
                return $dataWeapons[item._itemId];
            case 'armor':
                return $dataArmors[item._itemId];
        }
    };

    Game_Actor.prototype.optimizeEquipments = function (optimizeType) {
        var maxSlots = this.equipSlots().length;
        this.clearEquipments();
        for (var i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i, optimizeType));
            }
        }
    };

    Game_Actor.prototype.clearEquipments = function () {
        var maxSlots = this.equipSlots().length;
        for (var i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }
        }
    };

    Game_Actor.prototype.bestEquipItem = function (slotId, optimizeType) {
        var etypeId = this.equipSlots()[slotId];
        var optimizeParams = this.getItemOptimizeParams(optimizeType);
        var items = $gameParty.equipItems().filter(function (item) {
            return item.etypeId === etypeId && this.canEquip(item);
        }, this);
        var bestItem = null;
        var bestItems = [];
        for (var j = 0; j < optimizeParams.length; j++) {
            var bestPerformance = -1;
            for (var i = 0; i < items.length; i++) {
                var performance = this.calcEquipItemPerformance(items[i], optimizeParams[j]);
                if (this.isDualWield()) {
                    if (slotId == 1) {
                        if (performance > bestPerformance && !items[i]._isTwoHanded && (this.equips()[0] && ((this.equips()[0]._isTwoHanded && items[i]._isOffHandItem) || !this.equips()[0]._isTwoHanded)) && !items[i]._isMainhand) {
                            bestPerformance = performance;
                            bestItems = [];
                            bestItems.push(items[i]);
                        } else if (performance === bestPerformance) {
                            bestItems.push(items[i]);
                        }
                    } else {
                        if (performance > bestPerformance && ((slotId == 0 && !items[i]._isOffhand) || (slotId != 0))) {
                            bestPerformance = performance;
                            bestItems = [];
                            bestItems.push(items[i]);
                        } else if (performance === bestPerformance) {
                            bestItems.push(items[i]);
                        }
                    }
                } else {
                    if (performance > bestPerformance) {
                        bestPerformance = performance;
                        bestItems = [];
                        bestItems.push(items[i]);
                    } else if (performance === bestPerformance) {
                        bestItems.push(items[i]);
                    }
                }
            }

            if (bestItems.length > 1) {
                items = bestItems;
                bestPerformance = -1;
            } else {
                bestItem = bestItems[0];
                break;
            }
        }

        if (bestItems.length > 1) {
            bestItem = bestItems[0];
        }

        return bestItem;
    };

    Game_Actor.prototype.calcEquipItemPerformance = function (item, param) {
        var itemParams = item._paramBonuses;
        var performance = this.augmentPerformance(item, param);
        if (param == 'wdmg' && item._dmg)
            performance += this.calcDamage(item);

        for (var i = 0; i < itemParams.length; i++) {
            if (itemParams[i].param == param) {
                performance += Number(itemParams[i].value);
            }
        }

        if (item.traits.length)
            performance += this.calcTraitsPerformance(item.traits, param);

        return performance;
    };

    Game_Actor.prototype.calcTraitsPerformance = function (traits, param) {
        var performance = 0;
        for (var i = 0; i < traits.length; i++) {
            if (traits[i].code == 21) {
                if (param == 'mhp') {
                    if (traits[i].dataId == 0) {
                        performance += Math.round((traits[i].value - 1) * this[param])
                    }
                } else if (param == 'mmp') {
                    if (traits[i].dataId == 1) {
                        performance += Math.round((traits[i].value - 1) * this[param])
                    }
                }
            }
        }

        return performance;
    }

    Game_Actor.prototype.augmentPerformance = function (item, param) {
        var augmentSlots = item.augmentSlots;
        if (augmentSlots.length == 0) return 0;
        var performance = 0;
        for (var i = 0; i < augmentSlots.length; i++) {
            if (!item.augmentSlotItems) return 0;
            var augmentItemId = Number(item.augmentSlotItems[i].split(' ')[1]);
            var augmentItem = $dataItems[augmentItemId];
            if (!augmentItem) return 0;
            var augmentItemData = augmentItem.augmentDataAttach[augmentSlots[i].toUpperCase()];
            for (var j = 0; j < augmentItemData.length; j++) {
                var bonus = augmentItemData[j].split(':');
                if (param == bonus[0]) {
                    return Number(bonus[1]);
                }
            }
        }
        return performance;
    };

    Game_Actor.prototype.calcDamage = function (item) {
        var damage = item._dmg;
        if (damage.length > 3)
            damage = damage.replace(/d/g, "");
        else
            damage = damage.replace(/d/g, "0");
        return eval(damage);

    };

    Game_Actor.prototype.getItemOptimizeParams = function (optimizeType) {
        switch (optimizeType) {
            case 1: return TIKA.Param.PhysicalParams;
            case 2: return TIKA.Param.MagicalParams;
            case 3: return TIKA.Param.DefenseParams;
        }
    };


    // ============================================================================
    //                       Window_Optimize
    // ============================================================================

    function Window_Optimize() {
        this.initialize.apply(this, arguments);
    }

    Window_Optimize.prototype = Object.create(Window_Command.prototype);
    Window_Optimize.prototype.constructor = Window_Optimize;

    Window_Optimize.prototype.initialize = function (x, y) {
        this.clearCommandList();
        this.makeCommandList();
        Window_Selectable.prototype.initialize.call(this, x, y, Graphics.boxWidth, Graphics.boxHeight);
        this.width = Graphics.boxWidth / 3;
        this.height = this.itemRect().height + 2 * this.padding;
        this.hide();
        this.opacity = 0;
        this.refresh();
        this.select(0);
    };

    Window_Optimize.prototype.makeCommandList = function () {
        this.addCommand('Physical', 'optimize', true, 1);
        this.addCommand('Magical', 'optimize', true, 2);
        this.addCommand('Defense', 'optimize', true, 3);
    };

    Window_Optimize.prototype.maxCols = function () {
        return 3;
    };

    Window_Optimize.prototype.itemTextAlign = function () {
        return 'center';
    };

    // ============================================================================
    //                       Window_Augment
    // ============================================================================

    function Window_Augment() {
        this.initialize.apply(this, arguments);
    }

    Window_Augment.prototype = Object.create(Window_Command.prototype);
    Window_Augment.prototype.constructor = Window_Augment;

    Window_Augment.prototype.initialize = function (x, y) {
        this.clearCommandList();
        this.makeCommandList();
        Window_Selectable.prototype.initialize.call(this, x, y, Graphics.boxWidth, Graphics.boxHeight);
        this.width = Graphics.boxWidth / 3;
        this.height = this.itemRect().height + 2 * this.padding;
        this.hide();
        this.opacity = 0;
        this.refresh();
        this.select(0);
    };

    Window_Augment.prototype.makeCommandList = function () {
        this.addCommand('Equip', 'equip', true, 1);
        //var isSceneBattle = (SceneManager._scene instanceof Scene_Battle);
        this.addCommand('Augment', 'augment', !$gameParty.inBattle(), 2);
    };

    Window_Augment.prototype.maxCols = function () {
        return 2;
    };

    Window_Augment.prototype.itemTextAlign = function () {
        return 'center';
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

    var Window_Description_setItem = Window_Description.prototype.setItem;
    Window_Description.prototype.setItem = function (item) {
        if (SceneManager._scene instanceof Scene_Equip) {
            if (item) {
                if (item.id >= 3000) {
                    this.setText(item ? item.description : '');
                }
                else
                    this.setText(item ? item._description : '');
            } else {
                this.setText('');
            }
        }
        else {
            Window_Description_setItem.call(this, item);
        }
    };

    Window_Description.prototype.updatePlacement = function (x, y, rect) {
        if (!this._text || this._text.replace(/<WordWrap>/g, '').length < 1) {
            this.close();
            return;
        }
        this.open();
        this._refreshBack();
        this.opacity = 255;
        this.backOpacity = this.standardBackOpacity();
        this.y = y + 1.5 * rect.height;
        this.x = x + rect.width - this.width;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = y + 0.5 * rect.height - this.height;
        }
        if (this.x + this.width > Graphics.boxWidth) {
            this.x = x - this.width + rect.width;
        }
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
    };

    var ItemManager_processAugmentList = ItemManager.processAugmentList;
    ItemManager.processAugmentList = function (item, effectItem, slotId, list) {
        ItemManager_processAugmentList.call(this, item, effectItem, slotId, list);
        this.updateActorModifier();
    };

    var ItemManager_processAugmentEffect = ItemManager.processAugmentEffect;
    ItemManager.processAugmentEffect = function (line, mainItem, effectItem, slot) {

        // VARIABLE #: +/-X
        if (line.match(/(variable*)[ ](\d+):[ ]([\+\-]\d+)/i)) {
            var varId = parseInt(RegExp.$2);
            var value = parseInt(RegExp.$3);
            var code = 'v[' + varId + '] ? v[' + varId + ']+=' + value + ': v[' + varId + ']=' + value;
            return this.processAugmentEval(code, mainItem, effectItem, slot);
        }
        ItemManager_processAugmentEffect.call(this, line, mainItem, effectItem, slot);
    }

    ItemManager.updateActorModifier = function () {
        TIKA.EM.Actor.updateParamModifiers();
    }

    Game_Party.prototype.maxItems = function (item) {
        if (!item) return 1;
        return item.maxItem;
    };

})();