/*:
 * @plugindesc v1.0 Small plugin to unlock all the classes, just for testing
 * @author TIKA
 *
 *
 * @help
 * ============================================================================
 * Scriptcall
 * ============================================================================
 * TIKA.Util.unlockAllClasses(actorId);
 *
 * Example: TIKA.Util.unlockAllClasses(1);
 *
 */

var Imported = Imported || {};
Imported.TIKA_UnlockClasses = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.Util = TIKA.Util || {};

(function () {
    var Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function (actorId) {
        Game_Actor_setup.call(this, actorId);
    };

    Game_Actor.prototype.unlockAllClasses = function () {
        var classes = $dataClasses;
        console.log(classes);
        for (var i = 1; i < 100; i++) {
            if (classes[i].name) {
                if (classes[i].name.contains('#'))
                    continue;
                this.unlockClass(classes[i].id);
            }
        }
    };

    TIKA.Util.unlockAllClasses = function (actorId) {
        $gameActors.actor(actorId).unlockAllClasses();
    };

})();