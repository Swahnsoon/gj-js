/*:
 * @plugindesc v1.0 Direct command skills
 * @author TIKA
 *
 * @param SecondaryMenuSkills
 * @desc Skill that will show in secondary menu.
 * @default []
 * @type int[]
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * This plugin allows you to add two direct command skills to the battle screen.
 * One skill is defined by the equipped class, and the other is selected by
 * the player inside the skill screen.
 * Tier slots for tier 6 skills are increased or decreased as the actor
 * levels up or down.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * <Command Skill: skillId #>
 *                -this tag is for the class notebox and it defines the skill that will
 *                 show on the battle screen regarding the equiped class.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version v1.0
 * Finished plugin!
 *
 *
 */

TIKA.Param = TIKA.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_CommandSkills');
TIKA.Param.SecondaryMenuSkills = TIKA.Parameters['SecondaryMenuSkills'];

(function () {

    var CLASS_COMMAND_SKILL = 0;
    var PASSIVE_SKILLS = 6;

    //=============================================================================
    // Game_Actor
    //=============================================================================

    var Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;
    Game_Actor.prototype.learnSkill = function (skillId) {
        Game_Actor_learnSkill.call(this, skillId);
        this.learnClassCommandSkill(skillId);
    };

    Game_Actor.prototype.learnClassCommandSkill = function (skillId) {
        var commandSkill = Number($dataClasses[this._classId].meta['Command Skill']);
        if (skillId == commandSkill) {
            this._classCommandSkill = $dataSkills[commandSkill];
            this._commandSkills[CLASS_COMMAND_SKILL] = this._classCommandSkill;
            if (!this._battleSkills.includes(commandSkill)) {
                this._battleSkills.push(commandSkill);
            }
        }
    }

    Game_Actor.prototype.addClassCommandSkill = function () {
        var commandSkill = Number($dataClasses[this._classId].meta['Command Skill']);
        this._classCommandSkill = $dataSkills[commandSkill];
        this._commandSkills[CLASS_COMMAND_SKILL] = null;
        if (this.isLearnedSkill(commandSkill)) {
            this._commandSkills[CLASS_COMMAND_SKILL] = this._classCommandSkill;
            if (!this._battleSkills.includes(commandSkill)) {
                this._battleSkills.push(commandSkill);
            }
        }
    }

    var Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function (actorId) {
        Game_Actor_setup.call(this, actorId);
        this._commandSkills = [null, null];
        this.addClassCommandSkill();
    };

    var Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function () {
        Game_Actor_levelUp.call(this);
        this.alterPassiveTierSlots(this._level);
    };

    var Game_Actor_levelDown = Game_Actor.prototype.levelDown;
    Game_Actor.prototype.levelDown = function () {
        Game_Actor_levelDown.call(this);
        this.alterPassiveTierSlots(this._level);
    };

    Game_Actor.prototype.alterPassiveTierSlots = function (level) {
        var passiveTierSlots = 1;
        switch (Number(level)) {
            case 1: case 2: case 3: passiveTierSlots = 1; break;
            case 4: case 5: case 6: passiveTierSlots = 2; break;
            case 7: case 8: case 9: passiveTierSlots = 3; break;
            case 10: case 11: case 12: case 13: passiveTierSlots = 4; break;
            case 14: case 15: case 16: case 17: passiveTierSlots = 5; break;
            case 18: case 19: case 20: passiveTierSlots = 6; break;
        }
        if (level > 20)
            passiveTierSlots = 6;
        Yanfly.Param.ESTierMaximum[PASSIVE_SKILLS] = passiveTierSlots;
    }

    var Game_Actor_changeClass = Game_Actor.prototype.changeClass;
    Game_Actor.prototype.changeClass = function (classId, keepExp) {
        Game_Actor_changeClass.call(this, classId, keepExp);
        this.addClassCommandSkill();
    };

    Game_Actor.prototype.commandSkills = function () {
        var skills = this._commandSkills;
        var outputSkills = [];

        skills.forEach(s => {
            if(s) {
                outputSkills.push($dataSkills[s.id]);
            } else {
                outputSkills.push(null);
            }
        });

        return outputSkills;
    };


    //=============================================================================
    // Window_SkillType
    //=============================================================================

    var Window_SkillType_addCustomCommandBefore = Window_SkillType.prototype.addCustomCommandBefore;
    Window_SkillType.prototype.addCustomCommandBefore = function () {
        Window_SkillType_addCustomCommandBefore.call(this);
        this.addCommand('Command Skills', 'skill', true, 'battleCommand');
    };


    //=============================================================================
    // Window_ActorCommand
    //=============================================================================

    var Window_ActorCommand_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
    Window_ActorCommand.prototype.addSkillCommands = function () {
        Window_ActorCommand_addSkillCommands.call(this);
        this._actor.commandSkills().forEach(function (skill) {
            if (skill)
                this.addCommand(skill.name, 'direct skill', this._actor.canUse(skill), skill.id);
        }, this);
    };

    var Window_ActorCommand_setup = Window_ActorCommand.prototype.setup;
    Window_ActorCommand.prototype.setup = function (actor) {
        this.addClassCommandSkill(actor);
        Window_ActorCommand_setup.call(this, actor);
        this.refresh();
    };

    Window_ActorCommand.prototype.addClassCommandSkill = function (actor) {
        var commandSkill = Number($dataClasses[actor._classId].meta['Command Skill']);
        actor._commandSkills[CLASS_COMMAND_SKILL] = null;
        if (actor.isLearnedSkill(commandSkill)) {
            actor._classCommandSkill = $dataSkills[commandSkill];
            actor._commandSkills[CLASS_COMMAND_SKILL] = actor._classCommandSkill;
        }
    };

    //@[ALIAS]
    var _alias_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function () {
        _alias_Game_System_onAfterLoad.call(this);
        setTimeout(() => {
            try {
                $gameParty.members().forEach(m => m.addClassCommandSkill());
            } catch (error) {
                console.warn(error);
            }
        }, 100);
    };

    //=============================================================================
    // Window_SkillList
    //=============================================================================

    var Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
    Window_SkillList.prototype.makeItemList = function () {
        if (this._actor && this._stypeId === 'battleCommand')
            this._data = this._actor.commandSkills();
        else
            Window_SkillList_makeItemList.call(this);


    };

    Window_SkillList.prototype.isEnabled = function (item) {
        if (this._stypeId === 'battleSkills' && !$gameParty.inBattle()) {
            return this.isBattleSkillEnabled(item);
        } else if (this._stypeId === 'battleCommand' && !$gameParty.inBattle()) {
            return this.isBattleCommandEnabled();
        } else {
            return Yanfly.EBS.Window_SkillList_isEnabled.call(this, item);
        }
    };


    Window_SkillList.prototype.isBattleCommandEnabled = function () {
        return this._index == 1;
    };



    // //=============================================================================
    // // Scene_Battle
    // //=============================================================================

    Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function () {
        Scene_Battle_createActorCommandWindow.call(this);
        this._actorCommandWindow.setHandler('direct skill', this.commandDirectSkill.bind(this));
    };

    Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
    Scene_Battle.prototype.onActorCancel = function () {
        Scene_Battle_onActorCancel.call(this);
        switch (this._actorCommandWindow.currentSymbol()) {
            case 'direct skill': case 'direct item':
                this._actorCommandWindow.activate();
                break;
        }
    };

    Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function () {
        if (this._backTo == 'party_window') {
            this._enemyWindow.hide();
            this._helpWindow.visible = false;
            this._actorCommandWindow.open();
            this._actorCommandWindow.activate();
            this._actorCommandWindow.selectLast();
            this._actorCommandWindow.processCancel();
            return;
        }
        Scene_Battle_onEnemyCancel.call(this);
        switch (this._actorCommandWindow.currentSymbol()) {
            case 'direct skill': case 'direct item':
                this._actorCommandWindow.activate();
                break;
        }
    };

    Scene_Battle.prototype.commandDirectSkill = function () {
        var skillId = this._actorCommandWindow.currentExt();
        BattleManager.inputtingAction().setSkill(skillId);
        this.onSelectAction();
    };

    Scene_Battle.prototype.commandDirectSkillSec = function () {
        var skillId = this._partyCommandWindow.currentExt();
        this._partyCommandWindow.processCancel();
        this._actorCommandWindow.deactivate();
        this._actorCommandWindow.close();
        this._backTo = 'party_window';
        BattleManager.inputtingAction().setSkill(skillId);
        this.onSelectAction();
    };

    Scene_Battle.prototype.commandGuardSec = function () {
        this._partyCommandWindow.processCancel();
        this._actorCommandWindow.deactivate();
        this._actorCommandWindow.close();
        this._backTo = 'party_window';
        BattleManager.inputtingAction().setGuard();
        this.selectNextCommand();
    };


    Scene_Battle.prototype.commandDirectItem = function () {
        var itemId = this._actorCommandWindow.currentExt();
        BattleManager.inputtingAction().setSkill(itemId);
        this.onSelectAction();
    };

    Window_PartyCommand.prototype.addSkillCommands = function () {
        var scene = SceneManager._scene;
        var actor = scene._actorCommandWindow._actor || $gameParty.player();
        var skills = JSON.parse(TIKA.Param.SecondaryMenuSkills);
        skills.forEach(function (skillId) {
            var skill = $dataSkills[skillId];
            this.addCommand(skill.name, 'direct skill', actor.canUse(skill), skill.id);
        }, this);
    };

    Window_PartyCommand.prototype.addGuardCommand = function () {
        var scene = SceneManager._scene;
        this._actor = scene._actorCommandWindow._actor || $gameParty.player();
        this.addCommand(TextManager.guard, 'guard', this._actor.canGuard(), null, '');
        var index = this.findSymbol('guard');
        if (index < 0) return;
        var name = $dataSkills[this._actor.guardSkillId()].commandGuardText;
        this._list[index].name = name;
        this._list[index].description = $dataSkills[this._actor.guardSkillId()].description;
    };


    Game_Actor.prototype.equipSkillStates = function () {
        var array = [];
        var battleSkillsRaw = this.battleSkillsRaw();
        var length = battleSkillsRaw.length;
        for (var s = 0; s < length; ++s) {
            var skill = $dataSkills[battleSkillsRaw[s]];
            if (!skill) continue;
            for (var i = 0; i < skill.equipStates.length; ++i) {
                var state = $dataStates[skill.equipStates[i]];
                if (!state) continue;
                if (array.contains(state)) continue;
                array.push(state);
            }
        }
        this.sortEquipStates(array);
        return array;
    };

    var Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (paramId) {
        var value = Game_Actor_paramPlus.call(this, paramId);
        var battleSkillsRaw = this.battleSkillsRaw();
        for (var i = 0; i < battleSkillsRaw.length; ++i) {
            var skill = $dataSkills[battleSkillsRaw[i]];
            if (!skill) continue;
            value += skill.equipParamBonus[paramId];
        }
        return value;
    };

})();