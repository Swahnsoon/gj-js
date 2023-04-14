/*:
 * @plugindesc v1.0 Small plugin to give users option of positionin their timer.
 * @author TIKA
 * 
 * @param ---Coordinates---
 * @default
 * 
 * @param XCoordinate
 * @parent ---Coordinates---
 * @desc Game variable that determinas X position of the timer.
 * @default none
 * 
 * @param YCoordinate
 * @parent ---Coordinates---
 * @desc Game variable that determinas Y position of the timer.
 * @default none
 * 
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * By default, this plugin will use $gameMap.zoom to determine the position of the timer. 
 * If you want the timer to always show in the right top corner(which is by default),
 * no additional settings needed for this plugin. Works out of the box.
 * 
 * But if you want to position the timer to a specific location then there are
 * two variables to use:
 * 
 * XCoordinate
 * YCoordinate 
 * 
 * By default both of there variables are set to: none, and if you don't need these
 * variables anymore and want to use default positioning or via scriptcall,
 * then these variables have to be set to: none.
 * 
 * In addition to plugin variables, there are two scriptcalls described below.
 * ============================================================================
 * Scriptcalls
 * ============================================================================
 * TIKA.TimerPosition.setPosition(x, y):
 * Calling this will position timer on passed in x and y coordinates.
 * 
 * Example: 
 * TIKA.TimerPosition.setPosition(0, 0) will set the x and y coordinates to 0.
 * 
 * 
 * TIKA.TimerPosition.resetPosition():
 * Calling this will reset position of the timer, meaning it will reset coordinates 
 * set by the setPosition(x, y) scriptall and Positioning will be determined 
 * by next option from the precedence list.
 * 
 * Example:
 * Plugin variables set to:
 * XCoordinate = 100
 * YCoordinate = 100
 * 
 * Timer now shows on x = 100, y = 100
 * 
 * TIKA.TimerPosition.setPosition(250, 250)
 * Timer now shows on x = 250, y = 250
 * 
 * TIKA.TimerPosition.resetPosition()
 * Timer now shows on x = 100, y = 100
 * 
 * ============================================================================
 * Positioning Precedence
 * ============================================================================
 * Positioning Precedence:
 * 1. Coordinates set by the ScriptCall
 * 2. Coordinates set by plugin variables
 * 3. Default position that takes into zoom level in account
 */

var Imported = Imported || {};
Imported.TIKA_TimerPosition = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.TimerPosition = TIKA.TimerPosition || {};
TIKA.Parameters = PluginManager.parameters('TIKA_TimerPosition');

TIKA.TimerPosition.XCoordinate = Math.max(Number(TIKA.Parameters['XCoordinate']), 0);
TIKA.TimerPosition.YCoordinate = Math.max(Number(TIKA.Parameters['YCoordinate']), 0);

(function () {

    Sprite_Timer.prototype.updatePosition = function () {
        if ($gameTimer._coordinates) {
            this.x = Math.min($gameTimer._coordinates.x, (Graphics.width / $gameMap.zoom.x) - this.bitmap.width);
            this.y = Math.min($gameTimer._coordinates.y, Graphics.height - (Graphics.height * $gameMap.zoom.y - Graphics.height) - (this.bitmap.height / 2));
        } else if (!isNaN(TIKA.TimerPosition.XCoordinate) && !isNaN(TIKA.TimerPosition.XCoordinate)) {
            this.x = Math.min(TIKA.TimerPosition.XCoordinate, (Graphics.width / $gameMap.zoom.x) - this.bitmap.width);
            this.y = Math.min(TIKA.TimerPosition.YCoordinate, Graphics.height - (Graphics.height * $gameMap.zoom.y - Graphics.height) - (this.bitmap.height / 2));
        } else {
            this.x = (Graphics.width / $gameMap.zoom.x) - this.bitmap.width;
            this.y = 0;
        }
    };

    TIKA.TimerPosition.setPosition = function (x = 0, y = 0) {
        $gameTimer._coordinates = {
            x: Math.max(x, 0),
            y: Math.max(y, 0)
        }
    };

    TIKA.TimerPosition.resetPosition = function () {
        delete $gameTimer._coordinates;
    };

})();