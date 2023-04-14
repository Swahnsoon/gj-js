/*:
 * @plugindesc v1.20 Map Transfer
 * @author TIKA
 *
 * @param Common Event List
 * @text List of Common Events
 * @type number[]
 * 
 *  @help
 * This Plugin is owned by Horizon's End and should be credited if used.
 * ============================================================================
 * Description
 * ============================================================================
 * 
 * Plugin that enables (or disables) running a list of common events after the 
 * player transfer event has completed. 
 * 
 * ============================================================================
 * Script calls
 * ============================================================================
 * 
 * This plugin has a single script call: 
 * 
 * TIKA.MapTransfer.runCommonEvents(flag);
 * 
 * where the flag paremeter represents either the value 'enable' or 'disable'. 
 * 
 * ============================================================================
 * TIKA.MapTransfer.runCommonEvents('enable'); 
 * ============================================================================  
 * 
 * If we want to run a list common events (defined by a plugin parameter) after 
 * the player transfer has finished, this is the script call we use. 
 *  
 * This script call will run all common events passed as plugin parameters
 * after the player transfer event has completed. 
 * 
 * ============================================================================
 * TIKA.MapTransfer.runCommonEvents('disable'); 
 * ============================================================================  
 * 
 * If we want to use the normal player transfer functionality, this is the 
 * script call we would use. 
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version v1.00
 * Plugin ready for testing and feedback. 
 *
 * Version v1.10
 * JSON parse bug fixed
 * 
 * Version 1.20
 * Enabled by deafult, persistence
 */

var TIKA = TIKA || {};
TIKA.MapTransfer = TIKA.MapTransfer || {};
TIKA.MapTransfer.runCommonEvents;

(function () {

    // ============================================================================
    //                       Script call
    // ============================================================================

    TIKA.MapTransfer.runCommonEvents = function enableDisableMapTransfer(flag) {

        if (flag === 'enable') {
            $gameSystem._mapTransferEnabled = true;
        }

        if (flag === 'disable') {
            $gameSystem._mapTransferEnabled = false;
        }

    };

    // ============================================================================
    //                       Utility functions
    // ============================================================================

    var pluginParameters = PluginManager.parameters('TIKA_MapTransfer');
    var parsedParams;

    if (pluginParameters["Common Event List"] === "") {
        parsedParams = [];
    } else {
        parsedParams = JSON.parse(pluginParameters['Common Event List']);
    }

    var parsedParamsArray = parseParameters(parsedParams);

    function parseParameters(parsedParams) {

        var parametersArray = [];

        for (var i = 0; i < parsedParams.length; i++) {

            var commonEventId = JSON.parse(parsedParams[i]);
            parametersArray.push(commonEventId);

        }

        return parametersArray;
    }

    // ============================================================================
    //                       Game_System
    // ============================================================================

    var Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        Game_System_initialize.call(this);

        this._mapTransferEnabled = true;

    };

    // ============================================================================
    //                       Game_Interpreter
    // ============================================================================
    var Game_Interpreter_transferPlayer = Game_Interpreter.prototype.command201;
    Game_Interpreter.prototype.command201 = function () {
        var control = Game_Interpreter_transferPlayer.apply(this);

        if ($gameSystem._mapTransferEnabled) {
            for (var i = 0; i < parsedParamsArray.length; i++) {
                $gameTemp.reserveCommonEvent(parsedParamsArray[i]);
            }
        }

        return control;
    };

})();