/*:
 * @plugindesc v1.0 Custom skill menu
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
 * Custom skill menu.
 *
 * ============================================================================
 * How to use 
 * ============================================================================
 *  Scriptcall to call the job menu: 
 * - Open job menu: TIKA.JobMenu.openSkillMenu();
 * 
 * Additional scriptalls:
 * 
 * - TIKA.SkillMenu.equipSkillOnActor(actorId,skillId,passiveSlot)
 * Scriptcall that will equip skill on an actor.
 * actorId - Actor's ID
 * skillId - Skill's ID that you want to equip on the actor
 * passiveSlot - In case that you are equipping a passive skill you need to specify slot 0-4
 * 
 * - TIKA.SkillMenu.unequipSkillFromActor(actorId,skillId,passiveSlot)
 * Scriptcall that will unequip skill from an actor.
 * actorId - Actor's ID
 * skillId - Skill's ID that you want to unequip
 * passiveSlot - In case that you are unequipping a passive skill you need to specify slot 0-4
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version v1.1
 * Additional scriptalls
 * 
 * Version v1.00
 * Finished plugin!
 *
 *
 */
var Imported = Imported || {};
Imported.TIKA_SkillMenu = true;
var TIKA = TIKA || {};


TIKA.version = 1.01;

TIKA.SkillMenu = TIKA.SkillMenu || {};
TIKA.SM = TIKA.SM || {};
TIKA.SM.Param = TIKA.SM.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_SkillMenu');

TIKA.SM.Param.DescFontSize = Number(TIKA.Parameters['Font Size']);

(function () {
    var CLASS_COMMAND_SKILL = 0;
    var PASSIVE_SKILL_TIER = 6;
    var USER_COMMAND_SKILL = 3;

    function Window_Skill() {
        this.initialize.apply(this, arguments);
    }

    Window_Skill.prototype = Object.create(Window_Status.prototype);
    Window_Skill.prototype.constructor = Window_Skill;

    Window_Skill.prototype.initialize = function () {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
        this._actor = null;
        this.refresh();
        this.activate();
    };


    Window_Skill.prototype.refresh = function () {
        this.contents.clear();
        if (this._actor) {
            var lineHeight = this.lineHeight();
            this.drawBlock1(6, lineHeight * 0);
            this.drawBlock2(6, lineHeight * 7);
            this.drawBlock3(2 * Graphics.boxWidth / 3, lineHeight * 2);
            this.drawEquipUseSkill(Graphics.boxWidth / 3, 0);
        }
    };


    Window_Skill.prototype.drawBlock1 = function (x, y) {
        this.drawActorFace(this._actor, x, y);
        y += 140;
        var lineHeight = this.lineHeight();
        this.drawText('Name', x, y, 100, 'left');
        this.drawActorName(this._actor, this.width / 6, y);
        this.drawText('Level', x, y + lineHeight, 100, 'left');
        this.drawActorLevel(this._actor, this.width / 6, y + lineHeight);
    };

    Window_Skill.prototype.drawBlock2 = function (x, y) {
        var lineHeight = this.lineHeight() - 4;
        this.drawText('Main', x, y, 100, 'left');
        this.drawText('Secondary', x, y + lineHeight, 100, 'left');
        this.drawText('Command', x, y + lineHeight * 3, 100, 'left');
        this.drawText('Support', x, y + lineHeight * 6, 100, 'left');
        this.drawText('Equipment', x, y + lineHeight * 8, 100, 'left');
        this.drawText('Passive', x, y + + lineHeight * 10, 100, 'left');
    };

    Window_Skill.prototype.drawBlock3 = function (x, y) {
        var st = this._actor.statusMenuCols();
        var width = Graphics.boxWidth / 8;
        this.contents.fontSize = TIKA.EM.Param.MenuFontSize;
        var lineHeight = this.customLineHeight();
        y += this.textPadding();
        this.drawActorMinMaxAttribute('Health:', 'hp', 'mhp', x, y, width);
        this.drawActorMinMaxAttribute('Mana:', 'mp', 'mmp', x, y + lineHeight, width);
        this.drawHorzLine(x, y + lineHeight * 1.75, width * 2);
        y += lineHeight * 0.5;
        this.drawActorAttribute('Armor Class:', 'ac', x, y + lineHeight * 2, width);
        this.drawText('Max Dex:', x, y + lineHeight * 3, width, 'left');
        var maxDexText = "-";
        if(!isNaN(this._actor.maxdex) && this._actor.maxdex >= 0) {
            maxDexText = this._actor.maxdex;
        }
        this.drawText(maxDexText || '-', x + width, y + lineHeight * 3, width, 'left');
        this.drawActorInitiative(x, y + lineHeight * 4, width);
        this.drawActorAttribute('Spell Resistance:', 'resist', x, y + lineHeight * 5, width);
        this.drawActorAttribute('Armor Penalty:', 'acpen', x, y + lineHeight * 6, width);
        this.drawActorAttribute('Attack Roll:', 'bab', x, y + lineHeight * 7, width, true);
        this.drawActorWeaponDamage(x, y + lineHeight * 8, width);
        this.drawActorTotalDamage(x, y + lineHeight * 9, width);
        this.drawActorCriticalRange(x, y + lineHeight * 10, width);
        y += this.lineHeight() * 2.25;
        this.drawHorzLine(x, y + lineHeight * 9.75, width * 2);
        this.drawText('Attribute', x, y + lineHeight * 9, width, 'left');
        this.drawText('Score', x + width, y + lineHeight * 9, width, 'left');
        this.drawText('Modifier', x + width * 2 - this.textWidth('Modifier'), y + lineHeight * 9, width, 'left');
        if (st[1].length != 0) {
            this.drawParameters(x, y + 10 * lineHeight, width + this.textWidth('00'), st[1]);
        }
        if (st[2].length != 0) {
            this.drawParameters(x + width / 3 * 2 + this.textPadding() + this.textWidth('000') / 2, y + 10 * lineHeight, width, st[2], true);
        }
        if (st[3].length != 0) {
            this.drawParameters(x, y + st[1].length * lineHeight + 10 * lineHeight, width + this.textWidth('00'), ['fort', 'will', 'ref'], true);
        }
        this.resetFontSettings();
    };

    Window_Skill.prototype.drawEquipUseSkill = function (x, y) {
        this.drawText('Equip/Use Skills', x, y, Graphics.boxWidth / 3, 'left');
    };

    Window_Skill.prototype.setActor = function (actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    Window_Skill.prototype.drawActorInitiative = function (x, y, width) {
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

    Window_Skill.prototype.drawHorzLine = function (x, y, width, height) {
        var lineY = y + this.customLineHeight() / 2 - 1;
        this.contents.fillRect(x, lineY, width, height || 2, this.lineColor());
    };

    ICF.StatusMenu.drawParamsOldStyle = Window_Status.prototype.drawParameters;
    Window_Skill.prototype.drawParameters = function (x, y, width, ary, foretoken) {
        if ((width == undefined) || (ary == undefined)) {
            ICF.StatusMenu.drawParamsOldStyle.call(this, x, y);
            return;
        }
        var lineHeight = this.customLineHeight();
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

    Window_Skill.prototype.drawActorWeaponDamage = function (x, y, width) {
        this.drawText('Weapon Damage:', x, y, width, 'left');
        var weaponDamage = $gameVariables.value(TIKA.Param.Actor.WeaponDamageVar);
        var modifier = 0;
        var actor = this._actor;
        modifier = actor.bwd + actor.strm;
        this.drawText(weaponDamage + ' + ' + modifier, x + width, y, width, 'left');
    }

    Window_Skill.prototype.drawActorTotalDamage = function (x, y, width) {
        this.drawText('Damage:', x, y, width, 'left');
        this.drawText($gameVariables.value(TIKA.Param.Actor.TotalDamageMinVar) + ' - ' + $gameVariables.value(TIKA.Param.Actor.TotalDamageMaxVar), x + width, y, width, 'left');
    }

    Window_Skill.prototype.drawActorCriticalRange = function (x, y, width) {
        this.drawText('Critical:', x, y, width, 'left');
        this.drawText($gameVariables.value(TIKA.Param.Actor.CritRangeVar) + ' - ' + 20 + ' \u00d7' + $gameVariables.value(TIKA.Param.Actor.CritMultVar), x + width, y, width, 'left');
    }

    Window_Skill.prototype.drawActorAttribute = function (fullName, attrName, x, y, width, foretoken) {
        this.drawText(fullName, x, y, width, 'left');
        var attr = this._actor[attrName];
        if (attr > 0 && foretoken)
            attr = '+' + attr;
        this.drawText(attr, x + width, y, width, 'left');
    }

    Window_Skill.prototype.drawActorMinMaxAttribute = function (fullName, minAttr, maxAttr, x, y, width) {
        this.drawText(fullName, x, y, width, 'left');
        var min = this._actor[minAttr];
        var max = this._actor[maxAttr];
        this.drawText(min + '/' + max, x + width, y, width, 'left');
    }

    Window_Skill.prototype.customLineHeight = function () {
        return this.contents.fontSize + this.contents.fontSize / 6;
    }

    // ============================================================================
    //                    Window_SkillSlots
    // ============================================================================

    Scene_Skill.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        this.createStatusWindow();
        this.createSkillTypeWindow();
        this.createItemWindow();
        this.createActorWindow();
        this.createSkillEquipWindow();
        this.createHelpWindow();
    };

    Scene_Skill.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Description(10);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._skillTypeWindow.setHelpWindow(this._helpWindow);
        this._skillEquipWindow.setHelpWindow(this._helpWindow);
        this._helpWindow.width = Graphics.boxWidth / 5;
        this._helpWindow.x = Graphics.boxWidth / 3 - this._helpWindow.width / 10;
        this._helpWindow.margin = 0;
        this._helpWindow.padding = 5;
        this._helpWindow.openness = 0;
        this._helpWindow.deactivate();
        this.addWindow(this._helpWindow);
        this._statusWindow.addChild(this._helpWindow);
    };

    Scene_Skill.prototype.createSkillEquipWindow = function () {
        var wx = Graphics.boxWidth / 3;
        var wy = this._skillTypeWindow.lineHeight() * 2;
        var ww = Graphics.boxWidth / 3;
        var wh = Graphics.boxHeight - wy;
        this._skillEquipWindow = new Window_SkillEquip(wx, wy, ww, wh);
        this._skillEquipWindow.setListWindow(this._itemWindow);
        this._skillEquipWindow.setHandler('ok', this.onSkillEqOk.bind(this));
        this._skillEquipWindow.setHandler('cancel', this.onSkillEqCancel.bind(this));
        this._skillEquipWindow.hide();
        this._skillEquipWindow.opacity = 0;
        this.addWindow(this._skillEquipWindow);
        this._skillEquipWindow.setActor(this.actor());
        this._statusWindow.addChild(this._skillEquipWindow);
    };

    Scene_Skill.prototype.createItemWindow = function () {
        var wx = Graphics.boxWidth / 3;
        var wy = this._skillTypeWindow.lineHeight() * 2;
        var ww = Graphics.boxWidth / 3;
        var wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._skillTypeWindow.setSkillWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
        this._statusWindow.addChild(this._itemWindow);
        this._itemWindow.refresh();
    };

    Scene_Skill.prototype.createSkillTypeWindow = function () {
        var wy = 7 * 32;
        this._skillTypeWindow = new Window_SkillSlots(150, wy);
        this._skillTypeWindow.setHandler('skill', this.commandSkill.bind(this));
        this._skillTypeWindow.setHandler('skillEq', this.commandEquip.bind(this));
        this._skillTypeWindow.setHandler('cancel', this.popScene.bind(this));
        this._skillTypeWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._skillTypeWindow.setHandler('pageup', this.previousActor.bind(this));
        this.addWindow(this._skillTypeWindow);
        this._statusWindow.addChild(this._skillTypeWindow);
    };


    Scene_Skill.prototype.createStatusWindow = function () {
        this._statusWindow = new Window_Skill(0, 0);
        this.addWindow(this._statusWindow);
    };

    Scene_Skill.prototype.commandEquip = function () {
        this._skillTypeWindow._actor._lastSkillMenuIndex = this._skillTypeWindow._index;
        this._itemWindow.hide();
        this._skillEquipWindow.show();
        this._skillEquipWindow.activate();
        this._skillEquipWindow.select(0);
    };

    Scene_Skill.prototype.onSkillEqOk = function () {
        if (this._skillEquipWindow.item() !== null) {
            var skillId = this._skillEquipWindow.item().id;
        } else {
            var skillId = 0;
        }
        if (!this.actor()._battleSkills.includes(skillId)) {
            SoundManager.playEquip();
            var item = this._skillTypeWindow._list[this._skillTypeWindow._index];
            var slotId = this.getSlotIdForSkill(item);
            var hpRate = this.actor().hp / Math.max(1, this.actor().mhp);
            var mpRate = this.actor().mp / Math.max(1, this.actor().mmp);
            this.actor().equipSkill(skillId, slotId, Number(item.ext), Number(item.passiveSlot));
            this.actor().updateParamModifiersNoCheck();
            var max = this.actor().isDead() ? 0 : 1;
            var hpAmount = Math.max(max, parseInt(this.actor().mhp * hpRate));
            this.actor().setHp(hpAmount);
            this.actor().setMp(parseInt(this.actor().mmp * mpRate));
            this.onSkillEqCancel();
            this._itemWindow.hide();
            this._skillEquipWindow.show();
            this._skillEquipWindow.refresh();
            this._skillEquipWindow._helpWindow.close();
            this._statusWindow.refresh();
            this._itemWindow.refresh();
            this._skillTypeWindow.refresh();
        } else {
            SoundManager.playBuzzer();
            this._skillEquipWindow.activate();
        }
        if (this.actor()._battleSkills.indexOf(0) >= 0)
            this.actor()._battleSkills.splice(this.actor()._battleSkills.indexOf(0), 1);
    };

    Scene_Skill.prototype.getSlotIdForSkill = function (item) {
        var battleSkills = this.actor()._battleSkills;
        for (var i = 0; i < battleSkills.length; i++) {
            if (battleSkills[i]) {
                if ($dataSkills[battleSkills[i]].equipTier == item.ext) {
                    if (item.ext == PASSIVE_SKILL_TIER)
                        return this.getSlotIdForPassiveSkill(item);
                    else if (item.ext == USER_COMMAND_SKILL)
                        return this.getSlotIdForCommandSkill(item);
                    return i;
                }
            }
        }
        this.actor()._battleSkills.push(0);
        return battleSkills.indexOf(0);
    }

    Scene_Skill.prototype.getSlotIdForCommandSkill = function (item) {
        var commandSkills = this.actor()._commandSkills;
        var battleSkills = this.actor()._battleSkills;
        if (!commandSkills[item.passiveSlot]) {
            this.actor()._battleSkills.push(0);
            return this.actor()._battleSkills.indexOf(0);
        } else if (battleSkills.includes(commandSkills[item.passiveSlot].id)) {
            return battleSkills.indexOf(commandSkills[item.passiveSlot].id);
        }
    }

    Scene_Skill.prototype.getSlotIdForPassiveSkill = function (item) {
        var battleSkills = this.actor()._battleSkills;
        var passiveSkills = this.actor()._passiveSkills;

        if (!passiveSkills[item.passiveSlot]) {
            this.actor()._battleSkills.push(0);
            return this.actor()._battleSkills.indexOf(0);
        } else if (battleSkills.includes(passiveSkills[item.passiveSlot].id)) {
            return battleSkills.indexOf(passiveSkills[item.passiveSlot].id);
        }
    }

    var Scene_Skill_onSkillEqCancel = Scene_Skill.prototype.onSkillEqCancel;
    Scene_Skill.prototype.onSkillEqCancel = function () {
        if (Imported.TIKA_SkillMenu) {
            this._skillEquipWindow.deactivate();
            this._skillEquipWindow.deselect();
            this._skillEquipWindow._helpWindow.close();
            this._skillTypeWindow.activate();
            this._skillTypeWindow.selectLast();
        } else {
            Scene_Skill_onSkillEqCancel.call(this);
        }
    };

    Scene_Skill.prototype.onItemOk = function () {
        this.determineItem();
    };

    Scene_Skill.prototype.determineItem = function () {
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

    Scene_Skill.prototype.commandSkill = function () {
        this._itemWindow.select(0);
        this._itemWindow.activate();
        if (this._itemWindow._data.length)
            this._itemWindow.updateHelpWindowPlacement();
    };

    Scene_Skill.prototype.onItemCancel = function () {
        this._itemWindow.deselect();
        this._skillTypeWindow.activate();
        this._helpWindow.close();
    };

    Scene_Skill.prototype.openSkillEquipWindows = function () {
        this._skillEquipWindow.refresh();
        this._skillEquipWindow.activate();
        this._skillEquipWindow.select(0);
        this._skillEquipWindow.show();
        this._itemWindow.hide();
    };

    Scene_Skill.prototype.popScene = function () {
        this._skillTypeWindow._actor._lastSkillMenuIndex = 0;
        SceneManager.pop();
    };

    Scene_Skill.prototype.update = function () {
        Scene_Base.prototype.update.call(this);
        if (this._itemWindow.active) {
            this._itemWindow._helpWindow.updatePlacement(this._itemWindow.x, this._itemWindow.y + this._itemWindow._cursorRect.y, this._itemWindow._cursorRect);
        }
    };

    // ============================================================================
    //                    Game_Actor
    // ============================================================================

    var Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function (actorId) {
        Game_Actor_setup.call(this, actorId);
        this.initSkillSlots();
        this._equippedSkills = [];
    };


    Game_Actor.prototype.initSkillSlots = function () {
        this._supportSkill = null;
        this._equipmentSkill = null;
        this._passiveSkills = [null];
    };

    var Game_Actor_equipSkill = Game_Actor.prototype.equipSkill;
    Game_Actor.prototype.equipSkill = function (skillId, slotId, ext, passiveSlot) {
        var skill = $dataSkills[skillId];
        if (skill && skill.equipTier > 2) {
            if (!ext) return;
        }
        Game_Actor_equipSkill.call(this, skillId, slotId);
        this.attachSkill(skill, ext, passiveSlot);
        this._equippedSkills = JSON.parse(JSON.stringify(this._battleSkills));
        this._passiveStatesRaw = undefined;
        this.setBattleSkillMaxPlus(this._equippedSkills.length);
        this.passiveStatesRaw();
        this.updateParamModifiers();
    };

    Game_Actor.prototype.maxBattleSkills = function () {
        if (this._setMaxBattleSkills !== undefined) return this._setMaxBattleSkills;
        var value = this.actor().startingSkillSlots;
        value += this.currentClass().equipSkillSlots;
        var battleSkillsRaw = this.battleSkillsRaw();
        for (var i = 0; i < battleSkillsRaw.length; ++i) {
            var skill = $dataSkills[battleSkillsRaw[i]];
            if (skill) value += skill.equipSkillSlots;
        }
        var equips = this.equips();
        for (var i = 0; i < equips.length; ++i) {
            var equip = equips[i];
            if (equip) value += equip.equipSkillSlots;
        }
        var states = this.states();
        for (var i = 0; i < states.length; ++i) {
            var state = states[i];
            if (state) value += state.equipSkillSlots;
        }
        value += this.getBattleSkillMaxPlus();
        this._setMaxBattleSkills = value.clamp(1, Yanfly.Param.EBSMaxSlots);
        return this._setMaxBattleSkills;
    };

    var Game_Actor_canEquipSkill = Game_Actor.prototype.canEquipSkill;
    Game_Actor.prototype.canEquipSkill = function (skill) {
        if (Imported.TIKA_SkillMenu) {
            if (this._cachedEquippableBattleSkills === undefined) {
                this.createEquippableBattleSkillsCache();
            }
            if (!this._cachedEquippableBattleSkills.contains(skill.id)) return false;
            if (!skill.equippable) return false;
            if (skill.allEquippable) return true;
            return 2 < skill.equipTier || this.addedSkillTypes().contains(skill.stypeId);
        } else Game_Actor_canEquipSkill.call(this, skill);
    };

    var Game_Actor_passiveStatesRaw = Game_Actor.prototype.passiveStatesRaw;
    Game_Actor.prototype.passiveStatesRaw = function () {
        if (Imported.TIKA_SkillMenu) {
            if (this._passiveStatesRaw !== undefined) return this._passiveStatesRaw;
            var array = Game_BattlerBase.prototype.passiveStatesRaw.call(this);
            array = array.concat(this.getPassiveStateData(this.actor()));
            array = array.concat(this.getPassiveStateData(this.currentClass()));
            for (var i = 0; i < this.equips().length; ++i) {
                var equip = this.equips()[i];
                array = array.concat(this.getPassiveStateData(equip));
            }
            if (this._equippedSkills)
                for (var i = 0; i < this._equippedSkills.length; ++i) {
                    var skill = $dataSkills[this._equippedSkills[i]];
                    array = array.concat(this.getPassiveStateData(skill));
                }
            this._passiveStatesRaw = array.filter(Yanfly.Util.onlyUnique);
            return this._passiveStatesRaw;
        } else
            Game_Actor_passiveStatesRaw.call(this);
    };

    Game_Actor.prototype.attachSkill = function (skill, ext, passiveSlot) {
        if (skill) {
            switch (skill.equipTier) {
                case 3: this._commandSkills[1] = skill; break;
                case 4: this._supportSkill = skill; break;
                case 5: this._equipmentSkill = skill; break;
                case 6: if (passiveSlot >= 0)
                    this._passiveSkills[passiveSlot] = skill;
                else
                    this._passiveSkills[this._passiveSkills.indexOf(null)]
                    break;
            }
        }
        else
            switch (ext) {
                case 3:
                    this._commandSkills[1] = null;
                    break;
                case 4:
                    this._supportSkill = null;
                    break;
                case 5:
                    this._equipmentSkill = null;
                    break;
                case 6:
                    this._passiveSkills[passiveSlot] = null;
                    break;
            }

    };

    Game_Actor.prototype.getBattleSkill = function (skill, ext) {
        for (var i = 0; i < this._battleSkills.length; i++) {
            if ($dataSkills[this._battleSkills[i]])
                if ($dataSkills[this._battleSkills[i]].equipTier == ext && $dataSkills[this._battleSkills[i]].id == skill.id)
                    return $dataSkills[this._battleSkills[i]];
        }
    }



    // ============================================================================
    //                    Window_SkillSlots
    // ============================================================================


    function Window_SkillSlots() {
        this.initialize.apply(this, arguments);
    }

    Window_SkillSlots.prototype = Object.create(Window_SkillType.prototype);
    Window_SkillSlots.prototype.constructor = Window_SkillSlots;

    Window_SkillSlots.prototype.initialize = function (x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this._actor = null;
    };


    Window_SkillSlots.prototype.initialize = function (x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this._actor = null;
        this.opacity = 0;
    };

    Window_SkillSlots.prototype.lineHeight = function (x, y) {
        return 28;
    };

    Window_SkillSlots.prototype.makeCommandList = function () {
        if (this._actor) {
            var skillTypes = this._actor.addedSkillTypes();
            var canChangeSkill = this._actor.actor()._title == 'Player';
            skillTypes.forEach(function (stypeId) {
                var name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, 'skill', canChangeSkill, stypeId, 0, this._actor.currentClass() ? this._actor.currentClass().id : 0);
                if (!this._actor.subclass())
                    this.addCommand(' - ', 'skill', false, '2', 0, this._actor.subclass() ? this._actor.subclass().id : 0);
            }, this);
            var commandSkills = this._actor._commandSkills;
            for (var i = 0; i < commandSkills.length; i++) {
                if (commandSkills[i])
                    if (i == 0)
                        this.addCommand(commandSkills[i].name, 'skillEq', false, '3', i, commandSkills[i].id);
                    else {
                        if (commandSkills[i].id == (commandSkills[0] ? commandSkills[0].id : -1)) {
                            commandSkills[i] = null;
                            this.addCommand('- Empty -', 'skillEq', canChangeSkill, '3', i, 0);
                        }
                        else
                            this.addCommand(commandSkills[i].name, 'skillEq', canChangeSkill, '3', i, commandSkills[i].id);
                    }
                else
                    if (i == 0)
                        this.addCommand('- Empty -', 'skillEq', false, '3', i, 0);
                    else
                        this.addCommand('- Empty -', 'skillEq', canChangeSkill, '3', i, 0);
            }
            this.addCommand(this._actor._supportSkill ? this._actor._supportSkill.name : '- Empty -', 'skillEq', canChangeSkill, '4', 0, this._actor._supportSkill ? this._actor._supportSkill.id : 0);
            this.addCommand(this._actor._equipmentSkill ? this._actor._equipmentSkill.name : '- Empty -', 'skillEq', canChangeSkill, '5', 0, this._actor._equipmentSkill ? this._actor._equipmentSkill.id : 0);
            for (var i = 0; i < this._actor._passiveSkills.length; i++) {
                this.addCommand(this._actor._passiveSkills[i] ? this._actor._passiveSkills[i].name : '- Empty -', 'skillEq', canChangeSkill, '6', i, this._actor._passiveSkills[i] ? this._actor._passiveSkills[i].id : 0);
            }

            this.resetTextColor();
        }
    };

    Window_SkillSlots.prototype.addCommand = function (name, symbol, enabled, ext, passiveSlot, id) {
        if (enabled === undefined) {
            enabled = true;
        }
        if (ext === undefined) {
            ext = null;
        }
        this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext, passiveSlot: passiveSlot, id: id });
    };

    Window_SkillSlots.prototype.drawItem = function (index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    };

    Window_SkillSlots.prototype.itemRectForText = function (index) {
        var rect = this.itemRect(index);
        rect.x += this.textPadding();
        rect.width -= this.textPadding() * 2;
        return rect;
    };

    Window_SkillSlots.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        if (index == 2 || index == 3)
            rect.y += this.lineHeight();
        if (index == 4)
            rect.y += this.lineHeight() * 2;
        if (index == 5)
            rect.y += this.lineHeight() * 3;
        if (index >= 6)
            rect.y += this.lineHeight() * 4;

        return rect;
    };

    Window_SkillSlots.prototype.numVisibleRows = function () {
        return 15;
    };

    var Window_SkillSlots_cursorUp = Window_SkillSlots.prototype.cursorUp;
    Window_SkillSlots.prototype.cursorUp = function () {
        if (this._index - 1 < 0) {
            this.select(this._list.length);
        }
        Window_SkillSlots_cursorUp.call(this);
        this._helpWindow.updatePlacement(this.x, this.y + this._cursorRect.y, this._cursorRect);
        var scene = this.parent.parent.parent;
        if (this._list[this._index].symbol == 'skillEq') {
            scene._itemWindow.hide();
            scene._skillEquipWindow.show();
            scene._skillEquipWindow.refresh();
        } else {
            scene._itemWindow.show();
            scene._itemWindow.setStypeId(scene._skillTypeWindow.currentExt());
            scene._skillEquipWindow.hide();
        }
    };

    var Window_SkillSlots_processTouch = Window_SkillSlots.prototype.processTouch;
    Window_SkillSlots.prototype.processTouch = function () {
        Window_SkillSlots_processTouch.call(this);
        this._helpWindow.updatePlacement(this.x, this.y + this._cursorRect.y, this._cursorRect);
        var scene = this.parent.parent.parent;
        if (this._list[this._index].symbol == 'skillEq') {
            scene._itemWindow.hide();
            scene._skillEquipWindow.show();
            scene._skillEquipWindow.refresh();
        } else {
            scene._itemWindow.show();
            scene._itemWindow.setStypeId(scene._skillTypeWindow.currentExt());
            scene._skillEquipWindow.hide();
        }
    };

    var Window_SkillSlots_cursorDown = Window_SkillSlots.prototype.cursorDown;
    Window_SkillSlots.prototype.cursorDown = function () {
        if (this.index() + 1 >= this._list.length) {
            this.select(0);
        } else {
            Window_SkillSlots_cursorDown.call(this);
        }
        this._helpWindow.updatePlacement(this.x, this.y + this._cursorRect.y, this._cursorRect);
        var scene = this.parent.parent.parent;
        if (this._list[this._index].symbol == 'skillEq') {
            scene._itemWindow.hide();
            scene._skillEquipWindow.show();
            scene._skillEquipWindow.refresh();
        } else {
            scene._itemWindow.show();
            scene._itemWindow.setStypeId(scene._skillTypeWindow.currentExt());
            scene._skillEquipWindow.hide();
        }
    };

    Window_SkillSlots.prototype.selectLast = function () {
        var index = this._actor._lastSkillMenuIndex;
        if (index) {
            this.select(index);
        } else {
            this.select(0);
        }
    };

    Window_SkillSlots.prototype.update = function () {
        Window_Command.prototype.update.call(this);
        var scene = this.parent.parent.parent;
        if (this._helpWindow && this.active) {
            if (this._list[this.index()].symbol === 'skill')
                this._helpWindow.setItem({ description: $dataClasses[this._list[this.index()].id] ? $dataClasses[this._list[this.index()].id]._skillsDescription : '' });
            else
                this._helpWindow.setItem($dataSkills[this._list[this.index()].id]);
            scene._itemWindow.setStypeId(scene._skillTypeWindow.currentExt());
            this._helpWindow.updatePlacement(this.x, this.y + this._cursorRect.y, this._cursorRect);
        }
    };


    // ============================================================================
    //                    Window_SkillSlots
    // ============================================================================

    Window_SkillList.prototype.initialize = function (x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this._stypeId = 0;
        this._data = [];
        this.opacity = 0;
    };

    Window_SkillList.prototype.maxCols = function () {
        return 1;
    };

    var Window_SkillList_cursorUp = Window_SkillList.prototype.cursorUp;
    Window_SkillList.prototype.cursorUp = function () {
        if (this.index() - 1 < 0) {
            this.select(this._data.length - 1);
            this.updateHelpWindowPlacement();
            return;
        }
        Window_SkillList_cursorUp.call(this);
        this.updateHelpWindowPlacement();
    };

    var Window_SkillList_cursorDown = Window_SkillList.prototype.cursorDown;
    Window_SkillList.prototype.cursorDown = function () {
        if (this.index() + 1 >= this._data.length) {
            this.select(0);
            this.updateHelpWindowPlacement();
            return;
        }
        Window_SkillList_cursorDown.call(this);
        this.updateHelpWindowPlacement();
    };

    var Window_SkillList_onTouch = Window_SkillList.prototype.onTouch;
    Window_SkillList.prototype.onTouch = function (triggered) {
        Window_SkillList_onTouch.call(this, triggered);
        this.updateHelpWindowPlacement();
    };

    Window_SkillList.prototype.includes = function (item) {
        return (item && item.stypeId === this._stypeId) && !this.isCommandSkill(item);
    };

    Window_SkillList.prototype.isCommandSkill = function (item) {
        return item.equipTier === 3;
    }

    Window_SkillList.prototype.updateHelpWindowPlacement = function () {
        this.refresh();
        if (this._helpWindow)
            this._helpWindow.updatePlacement(this.x, this.y + this._cursorRect.y, this._cursorRect);
    };


    // ============================================================================
    //                       Window_SkillEquip
    // ============================================================================

    Window_SkillEquip.prototype.isEnabled = function (item) {
        return true;
    };

    Window_SkillEquip.prototype.makeItemList = function () {
        var scene = this.parent.parent.parent;
        if (!scene) return;
        var selectedTier = scene._skillTypeWindow._list[scene._skillTypeWindow._index].ext;
        if (this._actor) {
            var max = Math.floor(this.contentsHeight() / this.lineHeight());
            this._data = this.getSkills().filter(function (item) {
                return selectedTier == item.equipTier && !this.isCommandSkill(item);
            }, this);
            this._data.unshift(null);
            if (this._data.length > max) this._data.push(null);
        } else {
            this._data = [];
        }
    };

    Window_SkillEquip.prototype.isCommandSkill = function (item) {
        if (this._actor._commandSkills[0])
            if (item.id === this._actor._commandSkills[0].id)
                return true;
        return false;
    };

    var Window_SkillEquip_cursorUp = Window_SkillEquip.prototype.cursorUp;
    Window_SkillEquip.prototype.cursorUp = function () {
        if (this.index() - 1 < 0) {
            this.select(this._data.length - 1);
            this.updateHelpWindowPlacement();
            return;
        }
        Window_SkillEquip_cursorUp.call(this);
        this.updateHelpWindowPlacement();
    };
    var Window_SkillEquip_cursorDown = Window_SkillEquip.prototype.cursorDown;
    Window_SkillEquip.prototype.cursorDown = function () {
        if (this.index() + 1 >= this._data.length) {
            this.select(0);
            this.updateHelpWindowPlacement();
            return;
        }
        Window_SkillEquip_cursorDown.call(this);
        this.updateHelpWindowPlacement();
    };
    var Window_SkillEquip_onTouch = Window_SkillEquip.prototype.onTouch;
    Window_SkillEquip.prototype.onTouch = function (triggered) {
        Window_SkillEquip_onTouch.call(this, triggered);
        this.updateHelpWindowPlacement();
    };

    Window_SkillEquip.prototype.updateHelpWindowPlacement = function () {
        this.refresh();
        this._helpWindow.updatePlacement(this.x, this.y + this._cursorRect.y, this._cursorRect);
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
        var scene = this.parent.parent.parent;
        this.y = y + 1.5 * rect.height;
        this.x = x + rect.x + rect.width - this.width + 20;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = y + 0.5 * rect.height - this.height;
        }
        if (this.x + this.width > Graphics.boxWidth) {
            this.x = x - this.width + rect.width;
        }
        if (scene._skillTypeWindow) {
            if (scene._skillTypeWindow.active) {
                this.width = Graphics.boxWidth / 5;
                this.x = x + rect.x;
            } else
                this.width = Graphics.boxWidth / 4;
        } else
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
    };



    // ============================================================================
    //                    TIKA - Utility
    // ============================================================================

    TIKA.SkillMenu.openSkillMenu = function () {
        if (!$gameParty.inBattle()) SceneManager.push(Scene_Skill);
        return true;
    };

    TIKA.SkillMenu.equipSkillOnActor = function (actorId, skillId, passiveSlot) {
        var actor = $gameActors.actor(actorId);
        this.actor = actor;
        var skill = $dataSkills[skillId];
        var item = { ext: skill.equipTier, passiveSlot: passiveSlot || 0 };
        var slotId = this.getSlotIdForSkill(item);
        var hpRate = actor.hp / Math.max(1, actor.mhp);
        var mpRate = actor.mp / Math.max(1, actor.mmp);
        actor.equipSkill(skillId, slotId, item.ext, item.passiveSlot);
        var max = actor.isDead() ? 0 : 1;
        var hpAmount = Math.max(max, parseInt(actor.mhp * hpRate));
        actor.setHp(hpAmount);
        actor.setMp(parseInt(actor.mmp * mpRate));
        if (actor._battleSkills.indexOf(0) >= 0)
            actor._battleSkills.splice(actor._battleSkills.indexOf(0), 1);
    }

    TIKA.SkillMenu.unequipSkillFromActor = function (actorId, skillId, passiveSlot) {
        var actor = $gameActors.actor(actorId);
        this.actor = actor;
        var skill = $dataSkills[skillId];
        var item = { ext: skill.equipTier, passiveSlot: passiveSlot || 0 };
        var slotId = this.getSlotIdForSkill(item);
        var hpRate = actor.hp / Math.max(1, actor.mhp);
        var mpRate = actor.mp / Math.max(1, actor.mmp);
        actor.equipSkill(0, slotId, item.ext, item.passiveSlot);
        var max = actor.isDead() ? 0 : 1;
        var hpAmount = Math.max(max, parseInt(actor.mhp * hpRate));
        actor.setHp(hpAmount);
        actor.setMp(parseInt(actor.mmp * mpRate));
        if (actor._battleSkills.indexOf(0) >= 0)
            actor._battleSkills.splice(actor._battleSkills.indexOf(0), 1);
    }

    TIKA.SkillMenu.getSlotIdForSkill = function (item) {
        var battleSkills = this.actor._battleSkills;
        for (var i = 0; i < battleSkills.length; i++) {
            if (battleSkills[i]) {
                if ($dataSkills[battleSkills[i]].equipTier == item.ext) {
                    if (item.ext == PASSIVE_SKILL_TIER)
                        return this.getSlotIdForPassiveSkill(item);
                    else if (item.ext == USER_COMMAND_SKILL)
                        return this.getSlotIdForCommandSkill(item);
                    return i;
                }
            }
        }
        this.actor._battleSkills.push(0);
        return battleSkills.indexOf(0);
    }

    TIKA.SkillMenu.getSlotIdForCommandSkill = function (item) {
        var commandSkills = this.actor._commandSkills;
        var battleSkills = this.actor._battleSkills;
        if (!commandSkills[item.passiveSlot]) {
            this.actor._battleSkills.push(0);
            return this.actor._battleSkills.indexOf(0);
        } else if (battleSkills.includes(commandSkills[item.passiveSlot].id)) {
            return battleSkills.indexOf(commandSkills[item.passiveSlot].id);
        }
    }

    TIKA.SkillMenu.getSlotIdForPassiveSkill = function (item) {
        var battleSkills = this.actor._battleSkills;
        var passiveSkills = this.actor._passiveSkills;

        if (!passiveSkills[item.passiveSlot]) {
            this.actor._battleSkills.push(0);
            return this.actor._battleSkills.indexOf(0);
        } else if (battleSkills.includes(passiveSkills[item.passiveSlot].id)) {
            return battleSkills.indexOf(passiveSkills[item.passiveSlot].id);
        }
    }

    TIKA.SkillMenu.addClassCommandSkill = function (actor) {
        var commandSkill = Number($dataClasses[actor._classId].meta['Command Skill']);
        actor._commandSkills[CLASS_COMMAND_SKILL] = null;
        if (actor.isLearnedSkill(commandSkill)) {
            actor._classCommandSkill = $dataSkills[commandSkill];
            actor._commandSkills[CLASS_COMMAND_SKILL] = actor._classCommandSkill;
        }
    }

})();
