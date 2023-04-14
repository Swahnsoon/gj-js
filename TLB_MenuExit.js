/*:
 * @plugindesc v1.0 Menu Exit
 * @author Trihan
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
Imported.TLB_MenuExit = true;
var TLB = TLB || {};

TLB.MenuExit = TLB.MenuExit || {};
TLB.MenuExit.version = 1.00;

TLB.MenuExit.Scene_MenuBase_update = Scene_MenuBase.prototype.update;
Scene_MenuBase.prototype.update = function() {
    TLB.MenuExit.Scene_MenuBase_update.call(this);
    if (Input.isLongPressed("cancel")) {
        SceneManager.goto(Scene_Map);
    }
}