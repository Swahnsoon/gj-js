/*:
 * @plugindesc v1.4 Custom job menu
 * @author TIKA
 *
 * @param DescSize
 * @text DescriptionWindow font size:
 * @default 22
 * 
 * @param TitleSize
 * @text Title font size:
 * @default 24
 * 
 * @param SubtitleFontSize
 * @text Subtitle font size:
 * @default 20
 * 
 * @param SkillLearnFontSize
 * @text Skilllearn font size:
 * @default 20
 * 
 * @param ClasslistFontSize
 * @text Classlist font size:
 * @default 20
 * 
 * @param SkillTierIcons
 * @desc Icons for Skill Tiers: 1,3,4,5,6 
 * @type number[]
 * @default ["83","83","83","83","83"]
 * 
 * @help
 * ============================================================================
 * Description 
 * ============================================================================
 * Custom job change menu.
 *
 * ============================================================================
 * How to use 
 * ============================================================================
 *  Scriptcall to call the job menu: 
 * - Open job menu: TIKA.JobMenu.openJobMenu();
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version v1.4
 * - Small design changes
 * 
 * Version v1.3
 * - Persistence bugs resolved
 * 
 * Version v1.2
 * - Added description window for skills. 
 * - Sublasses are now listed only if the class has achieved adept or mastery.
 * 
 * Version v1.1
 * Redesigned job change menu.
 * 
 * Version v1.00
 * Finished plugin!
 *
 *
 */
var Imported = Imported || {};
Imported.TIKA_JobChangeMenu = true;
var TIKA = TIKA || {};


TIKA.version = 1.01;

TIKA.JobMenu = TIKA.JobMenu || {};
TIKA.Param = TIKA.Param || {};
TIKA.JM = TIKA.JM || {};
TIKA.JM.Param = TIKA.JM.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_JobChangeMenu');

TIKA.JM.Param.DescFontSize = Number(TIKA.Parameters['DescSize']);
TIKA.JM.Param.TitleFontSize = Number(TIKA.Parameters['TitleSize']);
TIKA.JM.Param.SubTitleFontSize = Number(TIKA.Parameters['SubtitleFontSize']);
TIKA.JM.Param.SkilllearnFontSize = Number(TIKA.Parameters['SkillLearnFontSize']);
TIKA.JM.Param.ClasslistFontSize = Number(TIKA.Parameters['ClasslistFontSize']);
TIKA.JM.Param.SkillTierIcons = JSON.parse(TIKA.Parameters['SkillTierIcons']);
TIKA.JM.FirstSkillGroup = [1, 3];
TIKA.JM.SecondSkillGroup = [4, 5, 6];

(function () {

    // ============================================================================
    //                    Window_JobChange
    // ============================================================================

    function Window_JobChange() {
        this.initialize.apply(this, arguments);
    }

    Window_JobChange.prototype = Object.create(Window_Status.prototype);
    Window_JobChange.prototype.constructor = Window_JobChange;

    Window_JobChange.prototype.initialize = function () {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
        this._actor = null;
        this.refresh();

    };


    Window_JobChange.prototype.refresh = function () {
        this.contents.clear();
        if (this._actor) {
            var lineHeight = this.lineHeight();
            this.drawBlock1(6, lineHeight * 0);
            this.drawBlock2(6, lineHeight * 11);
            this.drawAdeptBonus(2 * Graphics.boxWidth / 3, Graphics.boxHeight - 4 * this.lineHeight());
            this.drawMasteryBonus(2 * Graphics.boxWidth / 3, Graphics.boxHeight - 3 * this.lineHeight());
            this.drawClassTitle(Graphics.boxWidth / 3, 0);
            this.drawSkillsTitle(2 * Graphics.boxWidth / 3, 0);
        }
    };

    Window_JobChange.prototype.drawBlock1 = function (x, y) {
        this.drawActorFace(this._actor, x, y);
        y += 140;
        var lineHeight = this.lineHeight();
        this.drawText('Name', x, y, 100, 'left');
        this.drawActorName(this._actor, this.width / 6, y);
        this.drawText('Level', x, y + lineHeight, 100, 'left');
        this.drawActorLevel(this._actor, this.width / 6, y + lineHeight);
        this.drawText('Health:', x, y + lineHeight * 4, 100, 'left');
        this.drawText(this._actor.hp, this.width / 6, y + lineHeight * 4, this.width / 6, 'left');
        this.drawText('Mana:', x, y + lineHeight * 5, 100, 'left');
        this.drawText(this._actor.mp, this.width / 6, y + lineHeight * 5, this.width / 6, 'left');
    };

    Window_JobChange.prototype.drawBlock2 = function (x, y) {
        var st = this._actor.statusMenuCols();
        var width = this.width / 6;
        if (st[3].length != 0) {
            this.drawParameters(x, y, width, st[3]);
        }
    };

    var Window_JobChange_drawParameters = Window_Status.prototype.drawParameters;
    Window_JobChange.prototype.drawParameters = function (x, y, width, ary) {
        if ((width == undefined) || (ary == undefined)) {
            Window_JobChange_drawParameters.call(this, x, y);
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
                param.push(ICF.Param.NParamsFullName[paramId]);
                param.push(actor.NParam(paramId));
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
                    this.drawText(param[0], x, y2, width / 3);
                    this.drawCurrentAndMax(param[1], param[2], x + width / 3 - this.textWidth('HP'), y2,
                        width * 2 / 3 + this.textWidth('HP'), this.normalColor(), this.normalColor());
                } else {
                    this.drawText(param[0], x, y2, width * 2 / 3);
                    this.resetTextColor();
                    this.drawText(param[1], this.width / 6, y2, width / 3, 'left');
                }
            } else if (param.length > 0) {
                this.drawText(param[0], x, y2, width * 2 / 3);
                this.resetTextColor();
                this.drawText(param[1], this.width / 6, y2, width / 3, 'left');
            }
            y2 += lineHeight;
        }
    };

    Window_JobChange.prototype.drawClassTitle = function (x, y) {
        this.contents.fontSize = TIKA.JM.Param.TitleFontSize;
        this.resetTextColor();
        this.drawHorzLine(x, y + this.lineHeight(), this.textWidth('Class'), 2);
        this.drawText('Class', x, y + this.lineHeight(), Graphics.boxWidth / 3, 'left');
        this.contents.fontSize = TIKA.JM.Param.SubTitleFontSize;
        this.drawText('Job Points', x, y + this.lineHeight() * 2.5, Graphics.boxWidth / 3 - 2 * this.padding, 'right');
        this.resetFontSettings();
    };

    Window_JobChange.prototype.drawSkillsTitle = function (x, y) {
        this.contents.fontSize = TIKA.JM.Param.TitleFontSize;
        var scene = this.parent.parent;
        if (scene._itemWindow._data.length > 0 && scene._itemWindow.active && scene._itemWindow._index >= 0) {
            if (!$dataClasses[scene._itemWindow._data[scene._itemWindow._index]]) return;
            var stypeId = $dataClasses[scene._itemWindow._data[scene._itemWindow._index]].traits[0].dataId;
            var name = $dataSystem.skillTypes[stypeId];
            this.drawHorzLine(x, y, this.textWidth(name), 2);
            this.drawText(name, x, y, Graphics.boxWidth / 3, 'left');
            this.contents.fontSize = TIKA.JM.Param.SubTitleFontSize;
            this.drawText('Current JP:  ' + this._actor._jp[scene._itemWindow._data[scene._itemWindow._index]], x, y + this.lineHeight() * 2.5, Graphics.boxWidth / 3 - 2 * this.padding, 'left');
        } else {
            var stypeId = this._actor.currentClass().traits[0].dataId;
            var name = $dataSystem.skillTypes[stypeId];
            this.drawHorzLine(x, y, this.textWidth(name), 2);
            this.drawText(name, x, y, Graphics.boxWidth / 3, 'left');
            this.contents.fontSize = TIKA.JM.Param.SubTitleFontSize;
            this.drawText('Current JP:  ' + this._actor.jp(), x, y + this.lineHeight() * 2.5, Graphics.boxWidth / 3 - 2 * this.padding, 'left');
        }
        this.drawText('JP Cost', x, y + this.lineHeight() * 2.5, Graphics.boxWidth / 3 - 2 * this.padding, 'right');
        this.resetFontSettings();
    };

    Window_JobChange.prototype.drawAdeptBonus = function (x, y) {
        var actorClass = null;
        var scene = this.parent.parent;
        if (scene._itemWindow._data.length > 0 && scene._itemWindow.active) {
            actorClass = $dataClasses[scene._itemWindow._data[scene._itemWindow._index]];
        } else {
            actorClass = this._actor.currentClass();
        }
        if (actorClass) {
            var stateId = Number(actorClass.meta['Adept Bonus']);
            var skill = undefined;
            for (var i = 1; i < $dataSkills.length; i++) {
                if ($dataSkills[i].passiveStates[0] == stateId) {
                    skill = $dataSkills[i];
                    break;
                }
            }
            if (this._actor.isStateAffected(stateId))
                this.changeTextColor(this.textColor(14));
            else
                this.resetTextColor();
            this.drawText('Adept Bonus:', x, y, Graphics.boxWidth / 3, 'left');
            this.drawText(skill ? skill.name : '-', x, y, Graphics.boxWidth / 3 - 2 * this.padding, 'right');
        }
    };

    Window_JobChange.prototype.drawMasteryBonus = function (x, y) {
        var actorClass = null;
        var scene = this.parent.parent;
        if (scene._itemWindow._data.length > 0 && scene._itemWindow.active) {
            actorClass = $dataClasses[scene._itemWindow._data[scene._itemWindow._index]];
        }
        else {
            actorClass = this._actor.currentClass();
        }
        if (actorClass) {
            var stateId = Number(actorClass.meta['Mastery Bonus']);
            var skill = undefined;
            for (var i = 1; i < $dataSkills.length; i++) {
                if ($dataSkills[i].passiveStates[0] == stateId) {
                    skill = $dataSkills[i];
                    break;
                }
            }
            if (this._actor.isStateAffected(stateId))
                this.changeTextColor(this.textColor(14));
            else
                this.resetTextColor();
            this.drawText('Mastery Bonus:', x, y, Graphics.boxWidth / 3, 'left');
            this.drawText(skill ? skill.name : '-', x, y, Graphics.boxWidth / 3 - 2 * this.padding, 'right');
        }
    };

    Window_JobChange.prototype.setActor = function (actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    Window_JobChange.prototype.drawHorzLine = function (x, y, width, height) {
        var lineY = y + this.lineHeight() - this.textPadding();
        this.contents.fillRect(x, lineY, width, height || 2, this.lineColor());
    };

    Window_JobChange.prototype.lineColor = function () {
        return this.normalColor();
    };

    Window_JobChange.prototype.lineHeight = function () {
        return this.contents.fontSize + this.textPadding();
    };

    // ============================================================================
    //                    Scene_Class
    // ============================================================================

    Scene_Class.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createStatusWindow();
        this.createCommandWindow();
        this.createClassesListWindow();
        this.createSkillListWindow();
        this.createTierSelectWindow();
        this.createConfirmWindow();
        this.createClassCommandWindow();
        this.createHelpWindow();
        this.refreshActor();
        this.refreshWindows();
    };

    Scene_Class.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_Command(180, 0);
        this._commandWindow.opacity = 0;
        this._commandWindow.setHandler('class', this.commandBase.bind(this));
        this._commandWindow.setHandler('learnSkill', this.commandSkill.bind(this, 'commandWindow'));
        this._commandWindow.setHandler('equipSkill', this.openSkillMenu.bind(this));
        this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._commandWindow.setHandler('pageup', this.previousActor.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this._statusWindow.addChild(this._commandWindow);
    };

    Scene_Class.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Description(10);
        this._skillLearnWindow.setHelpWindow(this._helpWindow);
        this._helpWindow.width = this._skillLearnWindow.width - this._skillLearnWindow.padding * 2;
        this._helpWindow.x = 2 * Graphics.boxWidth / 3 - this._helpWindow.width / 4;
        this._helpWindow.margin = 0;
        this._helpWindow.padding = 5;
        this._helpWindow.openness = 0;
        this._helpWindow.deactivate();
        this.addWindow(this._helpWindow);
    };

    Scene_Class.prototype.createClassCommandWindow = function () {
        this._classCommandWindow = new Window_ClassSelect();
        var win = this._classCommandWindow;
        win.y = 140 + this._classCommandWindow.lineHeight() * 2;
        win.opacity = 0;
        win._actor = this.actor();
        win.width = win.windowWidth();
        win.height = win.windowHeight();
        win.setHandler('class', this.commandClass.bind(this));
        win.setHandler('subclass', this.commandClass.bind(this));
        win.setHandler('cancel', this.selectMainCommand.bind(this));
        win.setHandler('pagedown', this.nextActor.bind(this));
        win.setHandler('pageup', this.previousActor.bind(this));
        win.refresh();
        win.deselect();
        win.deactivate();
        this._statusWindow.addChild(win);
    };

    Scene_Class.prototype.createStatusWindow = function () {
        this._statusWindow = new Window_JobChange(0, 0);
        this.addWindow(this._statusWindow);
    };

    Scene_Class.prototype.createConfirmWindow = function () {
        this._confirmWindow = new Window_SkillLearnConfirm();
        this._confirmWindow.setHandler('confirm', this.onConfirmOk.bind(this));
        this._confirmWindow.setHandler('cancel', this.onConfirmCancel.bind(this));
        this.addWindow(this._confirmWindow);
    };

    Scene_Class.prototype.createClassesListWindow = function () {
        var wx = Graphics.boxWidth / 3;
        var wy = 4 * this._statusWindow.lineHeight();
        var ww = Graphics.boxWidth / 3;
        var wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_ClassesList(wx, wy, ww, wh);
        this._itemWindow.opacity = 0;
        this._itemWindow.y = 3 * this._itemWindow.lineHeight();
        this._itemWindow.setHandler('ok', this.onClassOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onClassCancel.bind(this));
        this._statusWindow.addChild(this._itemWindow);
        this._itemWindow.refresh();
    };

    Scene_Class.prototype.createSkillListWindow = function () {
        var wx = this._itemWindow.x + this._itemWindow.width;
        var wy = this._itemWindow.y;
        var ww = Graphics.boxWidth / 3;
        var wh = Graphics.boxHeight;
        this._skillLearnWindow = new Window_SkillLearn(wx, wy, ww, wh);
        this._skillLearnWindow.opacity = 0;
        this._skillLearnWindow.setHandler('ok', this.onLearnOk.bind(this));
        this._skillLearnWindow.setHandler('cancel', this.onSkillCancel.bind(this));
        this._statusWindow.addChild(this._skillLearnWindow);
    };

    Scene_Class.prototype.createTierSelectWindow = function () {
        this._tierSelectWindow = new Window_TierSelect();
        this._tierSelectWindow.x = this._itemWindow.x + this._itemWindow.width;
        this._tierSelectWindow.y = this._statusWindow.lineHeight();
        this._tierSelectWindow.opacity = 0;
        this._tierSelectWindow.deselect();
        this._tierSelectWindow.setHandler('ok', this.commandTier.bind(this));
        this._tierSelectWindow.setHandler('cancel', this.onTierCancel.bind(this));
        this._statusWindow.addChild(this._tierSelectWindow);
    };

    Scene_Class.prototype.openSkillMenu = function () {
        SceneManager.push(Scene_Skill);
    };

    Scene_Class.prototype.selectMainCommand = function () {
        this._classCommandWindow.deselect();
        this._classCommandWindow.deactivate();
        this._commandWindow.activate();
    };

    Scene_Class.prototype.onLearnOk = function () {
        this._helpWindow.close();
        var skill = this._skillLearnWindow.item();
        var classId = this._skillLearnWindow.getClass().id;
        this.confirmLearnSkill(skill, classId);
    };

    Scene_Class.prototype.confirmLearnSkill = function (skill, classId) {
        if (Yanfly.Param.SLSConfirmWin) {
            this.startConfirmWindow(skill)
        } else {
            this.processLearnSkill(skill, classId);
        }
    };

    Scene_Class.prototype.startConfirmWindow = function (skill) {
        this._confirmWindow.setData(this._actor, skill);
        this._confirmWindow.open();
        this._confirmWindow.activate();
        this._confirmWindow.select(0);
    };

    Scene_Class.prototype.processLearnSkill = function (skill, classId) {
        this._skillLearnWindow.activate();
        this.actor().learnSkill(skill.id);
        SoundManager.playUseSkill();
        $gameParty.loseGold(skill.learnCostGold);
        $gameParty.processLearnSkillCost(skill);
        if (Imported.YEP_JobPoints) {
            var cost = skill.learnCostJp;
            cost += this.actor().customLearnSkillJpCost(skill);
            this.actor().loseJp(cost, classId);
        }
        this.processLearnCostEval(skill, classId);
        this.actor().refresh();
        this._skillLearnWindow.refresh();
        this._skillLearnWindow.updateHelp();
        this.refreshStatus();
        this._statusWindow._actor.changeClass(classId);
        if (this._goldWindow) this._goldWindow.refresh();
        if (this._itemWindow) this._itemWindow.refresh();
        this.refreshWindows();
    };

    Scene_Class.prototype.processLearnCostEval = function (skill, classId) {
        if (skill.learnCostEval === '') return;
        var a = this.actor();
        var user = this.actor();
        var subject = this.actor();
        var s = $gameSwitches._data;
        var v = $gameVariables._data;
        var code = skill.learnCostEval;
        try {
            eval(code);
        } catch (e) {
            Yanfly.Util.displayError(e, code, 'SKILL LEARN CUSTOM COST ERROR');
        }
    };

    Scene_Class.prototype.refreshStatus = function () {
        var actor = JsonEx.makeDeepCopy(this.actor());
        if (!actor) return;
        var classId = this.actor().currentClass().id;
        var hpRate = actor.hp / actor.mhp;
        var mpRate = actor.mp / Math.max(1, actor.mmp);
        Yanfly.SLS.PreventReleaseItem = true;
        if (Imported.YEP_ClassChangeCore) {
            actor.changeClass(classId, Yanfly.Param.CCCMaintainLv);
        } else {
            actor.changeClass(classId, false);
        }
        var max = actor.isDead() ? 0 : 1;
        var hpAmount = Math.max(max, parseInt(actor.mhp * hpRate));
        actor.setHp(hpAmount);
        actor.setMp(parseInt(actor.mmp * mpRate));
        this._statusWindow.setActor(actor);
        Yanfly.SLS.PreventReleaseItem = false;
    };

    Scene_Class.prototype.onConfirmOk = function () {
        var skill = this._skillLearnWindow.item();
        var classId = this._skillLearnWindow.getClass().id;
        this.processLearnSkill(skill, classId);
        this._skillLearnWindow.updateHelpWindowPlacement();
        this._confirmWindow.close();
    };

    Scene_Class.prototype.onConfirmCancel = function () {
        this._confirmWindow.deactivate();
        this._confirmWindow.close();
        this._skillLearnWindow.activate();
        this._skillLearnWindow.updateHelpWindowPlacement();
    };

    Scene_Class.prototype.refreshActor = function () {
        var actor = this.actor();
        this._statusWindow.setActor(actor);
        this._itemWindow.setActor(actor);
        this._classCommandWindow.setActor(actor);
        this._skillLearnWindow.setActor(actor);
    };

    Scene_Class.prototype.refreshWindows = function () {
        this._itemWindow.refresh();
        this._statusWindow.refresh();
        this._skillLearnWindow.refresh();
        this._classCommandWindow.refresh();
        this._tierSelectWindow.deactivate();
    };

    Scene_Class.prototype.commandClass = function () {
        if (this._itemWindow._data.length > 0) {
            this._itemWindow.activate();
            this._itemWindow.refresh();
            this._itemWindow.selectLast();
            this._tierSelectWindow.deactivate();
            this._skillLearnWindow.setTier(TIKA.JM.FirstSkillGroup);
            this._skillLearnWindow.setClass(this._itemWindow._data[this._itemWindow._index]);
            this._helpWindow.close();
            this.refreshWindows();
        } else {
            this._classCommandWindow.activate();
            this._classCommandWindow.refresh();
            this.refreshWindows();
        }
    };

    Scene_Class.prototype.commandTier = function (origin) {
        if (origin)
            this._origin = origin;
        Window_TierSelect._lastCommandSymbol = this._tierSelectWindow.currentSymbol();
        this._skillLearnWindow.activate();
        this._skillLearnWindow.refresh();
        this._skillLearnWindow.selectLast();
        this._skillLearnWindow.updateHelpWindowPlacement();
    };

    Scene_Class.prototype.commandSkill = function (origin) {
        this._origin = origin;
        this._tierSelectWindow.activate();
        this._tierSelectWindow.select(0);
        this._tierSelectWindow.refresh();
    };

    Scene_Class.prototype.commandBase = function () {
        if (this._classCommandWindow._index < 0) {
            this._classCommandWindow.select(0);
            this._itemWindow.refresh();
        }
        this._classCommandWindow.activate();
        this._classCommandWindow.refresh();
    };

    Scene_Class.prototype.commandLearnSkill = function () {
        if (Yanfly.Param.SLSIntegrate) {
            SceneManager.push(Scene_Skill);
        } else {
            SceneManager.push(Scene_LearnSkill);
        }
    };

    Scene_Class.prototype.onClassOk = function () {
        if (this._classCommandWindow.currentSymbol() === 'class' || !this._classCommandWindow.currentSymbol()) {
            SoundManager.playEquip();
            var classId = this._itemWindow.item();
            var hpRate = this.actor().hp / this.actor().mhp;
            var mpRate = this.actor().mp / Math.max(1, this.actor().mmp);
            this.actor().changeClass(classId, Yanfly.Param.CCCMaintainLv);
            var max = this.actor().isDead() ? 0 : 1;
            var hpAmount = Math.max(max, parseInt(this.actor().mhp * hpRate));
            this.actor().setHp(hpAmount);
            this.actor().setMp(parseInt(this.actor().mmp * mpRate));
            this._skillLearnWindow.setClass(classId);
            this._itemWindow.activate();
            this._statusWindow.setActor(this.actor());
            this.actor().updateParamModifiers();
            this.refreshWindows();
        } else if (this._classCommandWindow.currentSymbol() === 'subclass') {
            this.onSubclassOk();
            this.actor().updateParamModifiers();
        }
    };

    Scene_Class.prototype.onClassCancel = function () {
        if (this._classCommandWindow.currentSymbol() === 'class') {
            this._actor.setLastClassMenuIndex(this._itemWindow._data.indexOf(this._actor.currentClass().id));
        } else {
            if (this._actor.subclass())
                this._actor.setLastSubclassMenuIndex(this._itemWindow._data.indexOf(this._actor.subclass().id));
        }
        this._itemWindow.deselect();
        this._skillLearnWindow.deselect();
        this._skillLearnWindow.setClass(this.actor().currentClass().id)
        this._statusWindow.setActor(this.actor());
        this._classCommandWindow.setActor(this.actor());
        this.refreshWindows();
        this.commandBase();
    };

    Scene_Class.prototype.onSkillCancel = function () {
        this._skillLearnWindow.deselect();
        this._skillLearnWindow._helpWindow.close();
        this._tierSelectWindow.activate();
        this._tierSelectWindow.selectLast();
        this._tierSelectWindow.refresh();
    };

    Scene_Class.prototype.onTierCancel = function () {
        if (this._origin == 'classWindow') {
            this._tierSelectWindow.deselect();
            this.commandClass();
        } else {
            this._tierSelectWindow.deselect();
            this.selectMainCommand();
        }
    };

    Scene_Class.prototype.refreshActorStatus = function () {
        this._realActor = this.actor();
        this.refreshActorClass();
    };

    Scene_Class.prototype.refreshActorClass = function () {
        var actor = JsonEx.makeDeepCopy(this.actor());
        if (!actor) return;
        var classId = this._itemWindow._data[this._itemWindow._index];
        this._classCommandWindow._currentClass = this._actor._currentClass;
        var hpRate = actor.hp / actor.mhp;
        var mpRate = actor.mp / Math.max(1, actor.mmp);
        Yanfly.SLS.PreventReleaseItem = true;
        if (Imported.YEP_ClassChangeCore) {
            if (this._classCommandWindow.currentSymbol() === 'class' || !this._classCommandWindow.currentSymbol())
                actor.changeClass(classId, Yanfly.Param.CCCMaintainLv);
            else
                actor.changeSubclass(classId, Yanfly.Param.CCCMaintainLv);
        } else {
            if (this._classCommandWindow.currentSymbol() === 'class' || !this._classCommandWindow.currentSymbol())
                actor.changeClass(classId, false);
            else
                actor.changeSubclass(classId, false);
        }
        var max = actor.isDead() ? 0 : 1;
        var hpAmount = Math.max(max, parseInt(actor.mhp * hpRate));
        actor.setHp(hpAmount);
        actor.setMp(parseInt(actor.mmp * mpRate));
        this._statusWindow.setActor(actor);
        this._classCommandWindow.setActor(actor)
        Yanfly.SLS.PreventReleaseItem = false;
    }

    var Scene_Class_update = Scene_Class.prototype.update;
    Scene_Class.prototype.update = function () {
        Scene_Class_update.call(this);
        if (this._commandWindow.active)
            this._itemWindow.refresh();
    };

    Scene_Class.prototype.onActorChange = function () {
        this.refreshActor();
        this._commandWindow.activate();
        this._classCommandWindow.deselect();
    };


    // ============================================================================
    //                           Window_ClassesList
    // ============================================================================

    function Window_ClassesList() {
        this.initialize.apply(this, arguments);
    }

    Window_ClassesList.prototype = Object.create(Window_ClassList.prototype);
    Window_ClassesList.prototype.constructor = Window_ClassesList;

    Window_ClassesList.prototype.initialize = function (x, y, width, height) {
        Window_ClassList.prototype.initialize.call(this, x, y, width, height);
        this._skill = null;
    };

    var Window_ClassesList_initialize = Window_ClassesList.prototype.initialize;
    Window_ClassesList.prototype.initialize = function (x, y, width, height) {
        Window_ClassesList_initialize.call(this, x, y, width, height);
        this.margin = 0;
    };

    Window_ClassesList.prototype.activate = function () {
        Window_Base.prototype.activate.call(this);
        this.reselect();
    };

    Window_ClassesList.prototype.cursorRight = function () {
        this.parent.parent.parent._skillLearnWindow.setClass(this.item());
        var scene = this.parent.parent.parent;
        if (scene._classCommandWindow.currentSymbol() == 'class')
            this._actor.setLastClassMenuIndex(this._index);
        else
            this._actor.setLastSubclassMenuIndex(this._index);
        scene._origin = 'classWindow';
        scene._tierSelectWindow.activate();
        scene._tierSelectWindow.select(-1);
        scene._tierSelectWindow.refresh();
        this.deactivate();
    };

    Window_ClassesList.prototype.drawItem = function (index) {
        this.contents.fontSize = TIKA.JM.Param.ClasslistFontSize;
        var item = $dataClasses[this._data[index]];
        if (!item) return;
        var rect = this.itemRect(index);
        this.changePaintOpacity(this.isEnabled(this._data[index]));
        this.drawClassName(item, rect.x + this.textPadding(), rect.y, rect.width);
        var rect = this.itemRectForText(index);
        this.drawClassLevel(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
    };

    var Window_ClassesList_makeItemList = Window_ClassesList.prototype.makeItemList;
    Window_ClassesList.prototype.makeItemList = function () {
        if (this.parent.parent.parent)
            var scene = this.parent.parent.parent;
        if (scene._commandWindow.active || scene._skillLearnWindow.active) {
            Window_ClassesList_makeItemList.call(this);
            this._data.sort(function (a, b) { return a - b });
            return;
        }
        if (scene._classCommandWindow.currentSymbol() == 'subclass') {
            if (this._actor) {
                var data = this._actor.unlockedClasses().slice();
            } else {
                var data = [];
            }
            this._data = [];
            for (var i = 0; i < data.length; ++i) {
                var classId = data[i];
                if ($dataClasses[classId] && !this._data.contains(classId) && this.canBeSubclass($dataClasses[classId])) {
                    this._data.push(classId);
                }
            }
            this._data.sort(function (a, b) { return a - b });
        } else {
            Window_ClassesList_makeItemList.call(this);
        }
    };

    Window_ClassesList.prototype.canBeSubclass = function (item) {
        var actor = this._actor;
        var maxJp = Number(item.meta['Max JP']);

        if (actor._jpTotal[item.id] > maxJp / 2)
            return true;
        else
            return false;
    }

    Window_ClassesList.prototype.drawClassLevel = function (item, x, y, width) {
        this.changeClassNameColor(item);
        var maxJp = Number(item.meta['Max JP']);
        if (this._actor._jpTotal[item.id] >= maxJp)
            var text = 'Mastered';
        else
            var text = this._actor._jp[item.id] + '/' + this._actor._jpTotal[item.id] + ' JP';
        this.drawText(text, x, y, width, 'right');
    }

    Window_ClassesList.prototype.drawClassName = function (item, x, y, width) {
        this.changeClassNameColor(item);
        var text = item.name;
        if (this._actor && item.useNickname) {
            text = this._actor.nickname();
        }
        this.drawText(text, x, y, width);
    };

    Window_ClassesList.prototype.windowHeight = function () {
        return Graphics.boxHeight - 3 * this.lineHeight();
    };
    var Window_ClassesList_cursorUp = Window_ClassesList.prototype.cursorUp;
    Window_ClassesList.prototype.cursorUp = function (wrap) {
        Window_ClassesList_cursorUp.call(this, wrap);
        this.refreshAll();
    };

    Window_ClassesList.prototype.refreshAll = function () {
        var scene = this.parent.parent.parent;
        if (scene) {
            scene.refreshActorStatus();
            scene._skillLearnWindow.setClass(this._data[this._index]);
            scene._classCommandWindow._actor.changeClass(this._data[this._index]);
            scene.refreshWindows();
            scene._classCommandWindow.refresh();
            scene._statusWindow._actor.refresh();
            scene.refreshActorClass();
            scene._tierSelectWindow.deactivate();
        }
        if (scene._classCommandWindow.currentSymbol() == 'class')
            this._actor.setLastClassMenuIndex(this._index);
        else
            this._actor.setLastSubclassMenuIndex(this._index);
    }

    var Window_ClassesList_onTouch = Window_ClassesList.prototype.onTouch;
    Window_ClassesList.prototype.onTouch = function (triggered) {
        Window_ClassesList_onTouch.call(this, triggered);
        this.refreshAll();
    };

    var Window_ClassesList_cursorDown = Window_ClassesList.prototype.cursorDown;
    Window_ClassesList.prototype.cursorDown = function (wrap) {
        Window_ClassesList_cursorDown.call(this, wrap);
        this.refreshAll();
    };

    var Window_ClassesList_selectLast = Window_ClassesList.prototype.selectLast;
    Window_ClassesList.prototype.selectLast = function () {
        var index = -1;
        var scene = this.parent.parent.parent;
        if (scene._classCommandWindow.currentSymbol() == 'class')
            index = this._actor.lastClassMenuIndex();
        else if (scene._classCommandWindow.currentSymbol() == 'subclass')
            index = this._actor.lastSubclassMenuIndex();
        if (index >= 0) {
            this.select(index);
        } else {
            Window_ClassesList_selectLast.call(this);
        }
    };

    Window_ClassesList.prototype.lineHeight = function () {
        return this.contents.fontSize + this.textPadding();
    };

    // ============================================================================
    //                           Window_SkillLearn
    // ============================================================================


    Window_SkillLearn.prototype.initialize = function (x, y, width, height) {
        height = this.windowHeight();
        Window_SkillList.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this._stypeId = 0;
        this._data = [];
        this.margin = 0;
        this._tier = TIKA.JM.FirstSkillGroup;
    };

    Window_SkillLearn.prototype.cursorLeft = function () {
        var scene = this.parent.parent.parent;
        this.deactivate();
        this.deselect();
        scene.commandClass();
    };

    var Window_SkillLearn_cursorUp = Window_SkillLearn.prototype.cursorUp;
    Window_SkillLearn.prototype.cursorUp = function () {
        if (this.index() - 1 < 0) {
            this.select(this._data.length - 1);
            this.updateHelpWindowPlacement();
            return;
        }
        Window_SkillLearn_cursorUp.call(this);
        this.updateHelpWindowPlacement();
    };

    var Window_SkillLearn_cursorDown = Window_SkillLearn.prototype.cursorDown;
    Window_SkillLearn.prototype.cursorDown = function () {
        if (this.index() + 1 >= this._data.length) {
            this.select(0);
            this.updateHelpWindowPlacement();
            return;
        }
        Window_SkillLearn_cursorDown.call(this);
        this.updateHelpWindowPlacement();
    };

    var Window_SkillLearn_onTouch = Window_SkillLearn.prototype.onTouch;
    Window_SkillLearn.prototype.onTouch = function (triggered) {
        Window_SkillLearn_onTouch.call(this, triggered);
        this.updateHelpWindowPlacement();
    };

    Window_SkillLearn.prototype.updateHelpWindowPlacement = function () {
        this._helpWindow.updatePlacement(this.x + this.padding, this.y + this._cursorRect.y + this.padding, this._cursorRect);
    };

    Window_SkillLearn.prototype.drawItemLearned = function (skill, wx, wy, ww) {
        this.contents.fontSize = TIKA.JM.Param.SkilllearnFontSize;
        if (!this._actor.isLearnedSkillRaw(skill.id)) {
            this.drawText(skill.learnCostJp + ' JP', wx + ww / 2, wy, ww / 2, 'right');
            return;
        }
        var text = Yanfly.Param.SLSLearnText;
        this.drawText(text, wx, wy, ww, 'right');
        this.resetFontSettings();
    };

    Window_SkillLearn.prototype.setClass = function (classId) {
        if (this._classId === classId) return;
        this._classId = classId;
        this.makeItemList();
        this.refresh();
    };

    Window_SkillLearn.prototype.setTier = function (tier) {
        if (this._tier === tier) return;
        this._tier = tier;
        this.makeItemList();
        this.refresh();
    };

    Window_SkillLearn.prototype.makeItemList = function () {
        if (this._actor && this.getClass()) {
            this.createSkillLearnData();
        } else {
            this._data = [];
        }
    };

    Window_SkillLearn.prototype.createSkillLearnData = function () {
        this._data = [];
        for (var i = 0; i < this.getClass().learnSkills.length; ++i) {
            var skillId = this.getClass().learnSkills[i];
            var skill = $dataSkills[skillId];
            if (skill && this.includes(skill) && this._tier.contains(skill.equipTier))
                this._data.push(skill);
        }
        this._data = this._data.sort(function (a, b) { return a.id - b.id; });
        this._data = this._data.filter(Yanfly.Util.onlyUnique);
    };

    Window_SkillLearn.prototype.numVisibleRows = function () {
        return 16;
    };

    Window_SkillLearn.prototype.windowHeight = function () {
        return this.fittingHeight(this.numVisibleRows());
    };

    Window_SkillLearn.prototype.windowWidth = function () {
        return Graphics.boxWidth / 3;
    };

    Window_SkillLearn.prototype.drawItem = function (index) {
        this.contents.fontSize = TIKA.JM.Param.SkilllearnFontSize;
        var skill = this._data[index];
        if (!skill) return;
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this._actor.isLearnedSkillRaw(skill.id));
        this.drawItemName(skill, rect.x, rect.y, rect.width);
        this.drawItemLearned(skill, rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
        this.resetFontSettings();
    };

    // ============================================================================
    //              Custom Window_ClassCommand
    // ============================================================================

    function Window_ClassSelect() {
        this.initialize.apply(this, arguments);
    }

    Window_ClassSelect.prototype = Object.create(Window_ClassCommand.prototype);
    Window_ClassSelect.prototype.constructor = Window_ClassSelect;

    Window_ClassSelect.prototype.initialize = function () {
        Window_ClassCommand.prototype.initialize.call(this, 0, 0);
        this.width = this.windowWidth;
    };

    Window_ClassSelect.prototype.windowWidth = function () {
        return Graphics.boxWidth / 3;
    };

    Window_ClassSelect.prototype.numVisibleRows = function () {
        return 2;
    };

    Window_ClassSelect.prototype.windowHeight = function () {
        return this.fittingHeight(this.numVisibleRows());
    };

    Window_ClassSelect.prototype.makeCommandList = function () {
        this.addClassCommand();
    };

    Window_ClassSelect.prototype.drawItem = function (index) {
        var rect = this.itemRectForText(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'left');
        if (this._actor)
            this.drawText(index == 0 ? this._actor.currentClass().name : this._actor.subclass() ? this._actor.subclass().name : ' - ', this.x + this.width / 2, rect.y, this.width / 2, 'left');
    };

    Window_ClassSelect.prototype.textPadding = function () {
        return 5.5;
    };

    Window_ClassSelect.prototype.drawAllItems = function () {
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
    };

    Window_ClassSelect.prototype.refresh = function () {
        if (this.contents) {
            this.contents.clear();
            this.clearCommandList();
            this.makeCommandList();
            this.drawAllItems();
        }
    };

    Window_ClassSelect.prototype.setActor = function (actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    var Window_ClassSelect_cursorUp = Window_ClassSelect.prototype.cursorUp;
    Window_ClassSelect.prototype.cursorUp = function (wrap) {
        Window_ClassSelect_cursorUp.call(this, wrap);
        this.parent.parent.parent._itemWindow.refresh();
    };

    var Window_ClassSelect_cursorDown = Window_ClassSelect.prototype.cursorDown;
    Window_ClassSelect.prototype.cursorDown = function (wrap) {
        Window_ClassSelect_cursorDown.call(this, wrap);
        this.parent.parent.parent._itemWindow.refresh();
    };


    // ============================================================================
    //              Window_TierSelect
    // ============================================================================

    function Window_TierSelect() {
        this.initialize.apply(this, arguments);
    }

    Window_TierSelect.prototype = Object.create(Window_HorzCommand.prototype);
    Window_TierSelect.prototype.constructor = Window_TierSelect;

    Window_TierSelect.prototype.initialize = function () {
        Window_HorzCommand.prototype.initialize.call(this, 0, 30);
        this.width = this.windowWidth();
        this.y = 30;
    };

    Window_TierSelect.prototype.lineHeight = function () {
        return 30;
    };

    Window_TierSelect.prototype.windowWidth = function () {
        return Graphics.boxWidth / 3;
    };

    Window_TierSelect.prototype.numVisibleRows = function () {
        return 1;
    };

    Window_HorzCommand.prototype.maxCols = function () {
        return 2;
    };

    Window_TierSelect.prototype.windowHeight = function () {
        return this.fittingHeight(this.numVisibleRows());
    };

    Window_TierSelect.prototype.makeCommandList = function () {
        this.addCommand("Active", 'tier1', true, TIKA.JM.FirstSkillGroup);
        this.addCommand("Passive", 'tier2', true, TIKA.JM.SecondSkillGroup);
    };

    Window_TierSelect.prototype.isIcon = function (index) {
        return !!Number(this.commandName(index));
    };

    Window_TierSelect.prototype.drawItem = function (index) {
        var rect = this.itemRectForText(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.resetTextColor();
        if (this.isIcon(index))
            this.drawIcon(this.commandName(index), rect.x, rect.y);
        else
            this.drawItemName(this.commandName(index), rect.x, rect.y, rect.width);
    };

    var Window_HorzCommand_itemRectForText = Window_HorzCommand.prototype.itemRectForText;
    Window_TierSelect.prototype.itemRectForText = function (index) {
        if (this.isIcon(index)) {
            var rect = this.itemRect(index);
            return rect;
        } else {
            return Window_HorzCommand_itemRectForText.call(this, index);
        }
    };

    var Window_HorzCommand_itemRect = Window_HorzCommand.prototype.itemRect;
    Window_TierSelect.prototype.itemRect = function (index) {
        if (this.isIcon(index)) {
            var rect = new Rectangle();
            var maxCols = this.maxCols();
            var iconBoxWidth = Window_Base._iconWidth;
            rect.width = iconBoxWidth;
            rect.height = this.itemHeight();
            rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
            rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
            return rect;
        } else {
            return Window_HorzCommand_itemRect.call(this, index);
        }
    };

    Window_TierSelect.prototype.drawItemName = function (name, x, y, width) {
        width = width || 312;
        if (name) {
            this.resetTextColor();
            // this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.drawText(name, x, y, width, 'center');
        }
    };

    var Window_TierSelect_cursorRight = Window_TierSelect.prototype.cursorRight;
    Window_TierSelect.prototype.cursorRight = function (wrap) {
        Window_TierSelect_cursorRight.call(this, wrap);
        var scene = this.parent.parent.parent;
        var ext = scene._tierSelectWindow.currentExt();
        scene._skillLearnWindow.setTier(ext);
    };

    var Window_TierSelect_cursorLeft = Window_TierSelect.prototype.cursorLeft;
    Window_TierSelect.prototype.cursorLeft = function (wrap) {
        Window_TierSelect_cursorLeft.call(this, wrap);
        var scene = this.parent.parent.parent;
        var ext = scene._tierSelectWindow.currentExt();
        scene._skillLearnWindow.setTier(ext);
    };

    Window_TierSelect.prototype.selectLast = function () {
        this.selectSymbol(Window_TierSelect._lastCommandSymbol);
    };

    // ============================================================================
    //                       Game_Actor
    // ============================================================================

    Game_Actor.prototype.lastClassMenuIndex = function () {
        if (this._lastClassMenuIndex)
            return this._lastClassMenuIndex;
        else
            return 0;
    };

    Game_Actor.prototype.setLastClassMenuIndex = function (index) {
        this._lastClassMenuIndex = index;
    };

    Game_Actor.prototype.lastSubclassMenuIndex = function () {
        if (this._lastSubclassMenuIndex)
            return this._lastSubclassMenuIndex;
        else
            return 0;
    };

    Game_Actor.prototype.setLastSubclassMenuIndex = function (index) {
        this._lastSubclassMenuIndex = index;
    };


    // ============================================================================
    //                    TIKA - Utility
    // ============================================================================

    TIKA.JobMenu.openJobMenu = function () {
        if (!$gameParty.inBattle()) SceneManager.push(Scene_Class);
        return true;
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
        this.y = y + rect.height;
        this.x = x;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = y + 0.5 * rect.height - this.height;
        }
    };

    Window_Description.prototype.standardPadding = function () {
        return this.getFontSize() / 1.5;
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
    //                       Window_Command
    // ============================================================================
    var Window_Command_makeCommandList = Window_Command.prototype.makeCommandList;
    Window_Command.prototype.makeCommandList = function () {
        if (SceneManager._scene instanceof Scene_Class) {
            this.addCommand('Change Class', 'class');
            this.addCommand('Learn Skills', 'learnSkill');
            this.addCommand('Equip Skills', 'equipSkill');
        } else {
            Window_Command_makeCommandList.call(this);
        }
    };

    var Window_Command_lineHeight = Window_Command.prototype.lineHeight;
    Window_Command.prototype.lineHeight = function () {
        if (SceneManager._scene instanceof Scene_Class && this)
            return 28;
        else
            return Window_Command_lineHeight.call(this);
    };

})();


