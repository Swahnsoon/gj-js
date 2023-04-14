/*:
 * @plugindesc v1.0 Main and Secondary Class Skills
 * @author TIKA
 *
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * This plugin allows the player to have all the skills, learned through JP
 * system, available instead of slotting individual skills to be used in
 * battle. Tier 3,4,5 and 6 learned skills are available to the actor
 * regardless of which class he has equipped.
 * The actor can also get bonus skill slots and bonus skills as he levels up.
 * In the bonus slots you can only slot the skills that are marked as
 * bonus skills for that type of class. (notetag for this can be found below)
 *
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *  <Class Type: classType> - this notetag is for class notebox and it defines
 *  what type the class is. You have available the following options: Physical,
 *  Magical and Support.
 *
 *  Example: <Class Type: Magical>
 *
 *  <Bonus Skill: classType, bonusLevel> -  this notetag is for skill notebox and
 *  it defines for which class type this bonus skill is. You have the option of
 *  Physical, Magical and Support, and at which bonus level actor learns this
 *  bonus skill.
 *
 *  Bonus level goes from 1-9.
 *
 *  Example: <Bonus Skill: Magical, 2>
 *
 *  Actor-Bonus levels legend:
 *
 *  Actor lvl | Bonus lvl
 *  =====================
 *        4   |  1
 *        6   |  2
 *        8   |  3
 *       10   |  4
 *       12   |  5
 *       14   |  6
 *       16   |  7
 *       18   |  8
 *       20   |  9
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version v1.0
 * Finished plugin!
 *
 */

(function () {
    //This will override YEP_EquipBattleSkills strating slot number for the actor
    Yanfly.Param.EBSStartSlots = 0;


    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        this.initBonusSlots($dataClasses);
        this.processClassTypeNotetags($dataClasses);
        this.processSkillTypeNotetags($dataSkills);

        return true;
    };

    DataManager.initBonusSlots = function (classes) {
        var bonusSlots = this.createBonusSlotLevels();

        for (var i = 1; i < classes.length; i++) {
            classes[i]._bonusSlotLevels = JSON.parse(JSON.stringify(bonusSlots));
            classes[i]._bonusSlots = 0;
        }
    };

    DataManager.processClassTypeNotetags = function (classes) {
        for (var i = 1; i < classes.length; i++) {
            var classType = classes[i].meta['Class Type'];
            if (classType) {
                classes[i]._classType = classType.trim();
            }
        }
    }

    DataManager.processSkillTypeNotetags = function (skills) {
        for (var i = 1; i < skills.length; i++) {
            var bonusSkill = skills[i].meta['Bonus Skill'];
            if (bonusSkill) {
                bonusSkill = bonusSkill.split(',');
                skills[i]._bonusSkill = {
                    skillType: bonusSkill[0].trim(),
                    level: Number(bonusSkill[1])
                };
            }
        }

    }

    DataManager.createBonusSlotLevels = function () {
        var bonusSlotsLevel = 9;
        var bonusSlots = [];
        for (var i = 0; i < bonusSlotsLevel; i++) {
            if (i == 0) {
                bonusSlots.push({
                    value: i,
                    affected: true
                });
                continue;
            }
            bonusSlots.push({
                value: i,
                affected: false
            });
        }

        return bonusSlots;
    }


    //=============================================================================
    //                                  Game_Actor
    //=============================================================================

    var Game_Actor_initSkills = Game_Actor.prototype.initSkills;
    Game_Actor.prototype.initSkills = function () {
        Game_Actor_initSkills.call(this);
    };



    Game_Actor.prototype.gainBonusSkillSlot = function (level) {
        if (level <= 3) {
            if (this._passiveSkills.length == 1) return;
            this._passiveSkills.push(null);
        } else if (level <= 6) {
            this.actor().equipTierSlot[6] += 1
            if (this._passiveSkills.length == 2) return;
            this._passiveSkills.push(null);
        } else if (level <= 9) {
            this.actor().equipTierSlot[6] += 1
            if (this._passiveSkills.length == 3) return;
            this._passiveSkills.push(null);
        } else if (level <= 15) {
            this.actor().equipTierSlot[6] += 1
            if (this._passiveSkills.length == 4) return;
            this._passiveSkills.push(null);
        } else if (level > 15) {
            this.actor().equipTierSlot[6] += 1
            if (this._passiveSkills.length == 5) return;
            this._passiveSkills.push(null);
        }
    }

    var Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function () {
        Game_Actor_levelUp.call(this);
        this.gainBonusSkillSlot(this._level);
    };


    Game_Actor.prototype.removeBonusSlotsFromClass = function () {
        this.decreaseBattleSkillSlots(this.currentClass()._bonusSlots);
    }

    Game_Actor.prototype.addBonusSlotsFromClass = function () {
        var bonusSkills = 0;
        for (var i = 0; i < this.skills().length; i++) {
            if (this.skills()[i]._bonusSkill)
                bonusSkills++;

        }
        this.increaseBattleSkillSlots(this.currentClass()._bonusSlots - bonusSkills);
    }

    Game_Actor.prototype.skillPlaceholder = function (skill) {
        if (!this._battleSkills.includes(skill)) {
            this.increaseBattleSkillSlots(1);
            if ($dataSkills[skill]._bonusSkill) {
                this._battleSkills.push(0);
            } else
                this._battleSkills.unshift(0);
        }
    };

    Game_Actor.prototype.getBonusSlotLevels = function () {
        return this.currentClass()._bonusSlotLevels;
    };

    Game_Actor.prototype.getBonusSlots = function () {
        return this.currentClass()._bonusSlots;
    };

    var Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;
    Game_Actor.prototype.learnSkill = function (skillId) {
        if (this.canSkillBeEquipped(skillId))
            this.skillPlaceholder(skillId);
        Game_Actor_learnSkill.call(this, skillId);
    };

    Game_Actor.prototype.canSkillBeEquipped = function (skillId) {
        var classSkill = this.currentClass().learnSkills.includes(skillId);
        if (this.subclass())
            var subclassSkill = this.subclass().learnSkills.includes(skillId);
        if (this.isLearnedSkill(this._commandSkills[0]))
            return (classSkill || subclassSkill) && $dataSkills[skillId].equipTier < 4;

        return (classSkill || subclassSkill) && $dataSkills[skillId].equipTier < 3;

    }

    Game_Actor.prototype.skillEquip = function (skillId) {
        if (!this._battleSkills.includes(skillId) && skillId > 0) {
            this._battleSkills.push(skillId);
        }
    };

    Game_Actor.prototype.skillUnEquip = function (skillId) {
        var skill = $dataSkills[skillId];
        if (skill) {
            var tier = skill.equipTier;
            var cur = this.getEquipSkillTierCount(tier);
            var max = this.getEquipSkillTierMax(tier);
            if (cur > max) {
                this._battleSkills.splice(this._battleSkills.indexOf(skillId), 1);
                this.decreaseBattleSkillSlots(1);
            }
        }
    };


    var Game_Actor_changeClass = Game_Actor.prototype.changeClass;
    Game_Actor.prototype.changeClass = function (classId, keepExp) {
        if (this.currentClass().id != classId) {
            this.clearClassSkills(this.currentClass());
            var temp = JSON.parse(JSON.stringify(this._battleSkills));
            Game_Actor_changeClass.call(this, classId, keepExp);
            this._battleSkills = temp;
            this._skills.forEach(skill => {
                if (this.canSkillBeEquipped(skill)) {
                    this.skillEquip(skill);
                }
            });
            this.addClassCommandSkill();
        }
    };

    Game_Actor.prototype.clearClassSkills = function (actorClass) {
        var battleSkills = this._battleSkills;
        for (var i = 0; i < battleSkills.length; i++) {
            if (actorClass.learnSkills.includes(battleSkills[i]) && $dataSkills[battleSkills[i]].equipTier < 4) {
                this._battleSkills.splice(this._battleSkills.indexOf(battleSkills[i]), 1);
                i--;
            }
        }
    };

    var Game_Actor_changeSubClass = Game_Actor.prototype.changeSubclass;
    Game_Actor.prototype.changeSubclass = function (classId) {
        if (this.subclass())
            this.clearClassSkills(this.subclass());
        var temp = JSON.parse(JSON.stringify(this._battleSkills));
        Game_Actor_changeSubClass.call(this, classId);
        this._battleSkills = temp;
        this._skills.forEach(skill => {
            if (this.canSkillBeEquipped(skill)) {
                this.skillEquip(skill);
            }
        });
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
        this._setMaxBattleSkills = value.clamp(0, Yanfly.Param.EBSMaxSlots);
        return this._setMaxBattleSkills;
    };


})();
