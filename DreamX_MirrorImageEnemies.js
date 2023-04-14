/*:
 * @plugindesc v1.1
 * @author DreamX
 * 
 * @param Fake State
 * @desc State for when an enemy is an illusion. 
 * @default 
 * 
 * @param Real State
 * @desc State for when an enemy is real. 
 * @default 
 * 
 * @param Switch Animation
 * @desc Animation ID that plays on real enemy when they switch.
 * @default 
 * 
 * @param Counterattack Skill Id
 * @desc Skill id that fake enemies use when attacked with an all enemies attack. 
 * @default 
 * 
 * @help
 * ============================================================================
 * How To Use
 * ============================================================================
 * Requires YEP Battle Engine Core
 * Requires YEP Buffs States Core
 * Make sure to set the parameters
 * 
 * Add this notetag to all wendigo-type enemies
 * <MirrorImage>
 * 
 * It is a good idea to have a state resist to Knockout to the fake state, in 
 * addition to making the Physical and Magical damage for them to be 0% (they 
 * are sp params). A priority of 0 will hide the state from being displayed 
 * to the player. It's also a good idea to have no removal conditions, so it 
 * can't be removed normally.
 * 
 * When a fake enemy is attacked with a skill that is for all enemies, 
 * they will use the skill specified in the parameter.
 * 
 * When a real enemy is attacked, an animation will be played (see parameter) 
 * and they will switch bodies with another enemy. 
 * 
 * The fake state should have this notetag:
<Custom Respond Effect>
if (this.isForOpponent() && this.isForAll()) {
BattleManager.queueForceAction(defender, DreamX.Param.MirrorImageCounterAttackSkillId, -2);
}
</Custom Respond Effect>
 * 
 * The real state should have this notetag:
<Custom Respond Effect>
if (value > 0 && defender.hp > 0 && defender.isAlive()) {
    defender.removeState(DreamX.Param.MirrorImageRealState);
    defender.addState(DreamX.Param.MirrorImageFakeState);
    var enemies = $gameTroop.members().filter(function (member) {
        return member.isStateAffected(DreamX.Param.MirrorImageFakeState) && member !== defender;
    });

    var enemiesLength = enemies.length;
    if (enemiesLength > 0) {
        var oldHealth = defender.hp;
        defender.setHp(defender.mhp);
        defender.startAnimation(DreamX.Param.MirrorImageSwitchAnimId);
        var realEnemyIndex = Math.floor(Math.random() * enemiesLength);
        var newBody = enemies[realEnemyIndex];

        newBody.addState(DreamX.Param.MirrorImageRealState);
        newBody.removeState(DreamX.Param.MirrorImageFakeState);
        newBody.setHp(oldHealth);
    }
}
if (this.isForOpponent() && this.isForAll() && defender.hp > 0 && defender.isAlive()) {
BattleManager.queueForceAction(defender, DreamX.Param.MirrorImageCounterAttackSkillId, -2);
}

if (defender.hp === 0 || defender.isDead()) {
    var enemies = $gameTroop.members().filter(function (member) {
        return member.enemy().meta.MirrorImage;
    });
    enemies.forEach(function (member) {
        member.die();
        member.performCollapse();
        member.refresh();
    });
}
</Custom Respond Effect>

 * ============================================================================
 * Terms Of Use
 * ============================================================================
 * Free to use and modify for commercial and noncommercial games, with credit.
 * ============================================================================
 * Credits
 * ============================================================================
 * DreamX
 */

var Imported = Imported || {};
Imported.DreamX_MirrorImageEnemies = true;

var DreamX = DreamX || {};
DreamX.MirrorImageEnemies = DreamX.MirrorImageEnemies || {};

DreamX.Parameters = PluginManager.parameters('DreamX_MirrorImageEnemies');
DreamX.Param = DreamX.Param || {};

DreamX.Param.MirrorImageFakeState = parseInt(DreamX.Parameters['Fake State']);
DreamX.Param.MirrorImageRealState = parseInt(DreamX.Parameters['Real State']);
DreamX.Param.MirrorImageSwitchAnimId = parseInt(DreamX.Parameters['Switch Animation']);
DreamX.Param.MirrorImageCounterAttackSkillId = parseInt(DreamX.Parameters['Counterattack Skill Id']);

DreamX.MirrorImageEnemies.BattleManager_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function () {
    DreamX.MirrorImageEnemies.BattleManager_startBattle.call(this);
    var enemies = $gameTroop.members().filter(function (member) {
        return member.enemy().meta.MirrorImage;
    });
    var enemiesLength = enemies.length;
    var realEnemyIndex = Math.floor(Math.random() * enemiesLength);

    for (var i = 0; i < enemiesLength; i++) {
        var member = enemies[i];
        if (i !== realEnemyIndex) {
            member.addState(DreamX.Param.MirrorImageFakeState);
        } else {
            member.addState(DreamX.Param.MirrorImageRealState);
        }
    }
};