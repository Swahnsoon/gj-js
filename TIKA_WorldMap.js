/*:
 * @plugindesc v1.0 World Map
 * @author TIKA
 *
 * @param Location List
 * @text Location List
 * @type struct<Location>[]
 *
 * @param Font Size
 * @text Description Window font size.
 * @default 22
 * 
 * @param Runes Font Size
 * @text Runes Window font size.
 * @default 20
 *
 * @param LocationIDPlaceholder
 * @text Variable that holds Location ID.
 * @default 301
 * 
 * @param TravelEvent
 * @text Traveling common event ID.
 * @default 159
 *
 * @param Rune Stones
 * @text List of item IDs for runes tones.
 * @type number[]
 * @default ["882","883","884","885"]
 * 
 * @param Blink Speed
 * @text Blinking speed of selected location on the map. (1 - slowest)
 * @default 3
 * 
 * @param Starting Location
 * @text Starting location id of the player.
 * @default 101
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * World Map
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * ============================================================================
 * ScriptCalls
 * ============================================================================
 *  Scriptcall to open the world map: TIKA.WorldMap.openWorldMap();
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

/*~struct~Location:
* @param SwitchId
* @type number
*
* @param LocationName
* @type text
*
* @param MapX
* @type number
*
* @param MapY
* @type number
*
* @param LocationType
* @type number
*
* @param LocationId
* @type number
*
* @param LocationDescription
* @type text
*/

var Imported = Imported || {};
Imported.TIKA_WorldMap = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.WM = TIKA.WM || {};
TIKA.WM.Param = TIKA.WM.Param || {};
TIKA.WorldMap = TIKA.WorldMap || {};
TIKA.Parameters = PluginManager.parameters('TIKA_WorldMap');

TIKA.WM.Param.DescFontSize = Number(TIKA.Parameters['Font Size']);
TIKA.WM.Param.RunesFontSize = Number(TIKA.Parameters['Runes Font Size']);
TIKA.WM.Param.LocationIDPlaceholder = Number(TIKA.Parameters['LocationIDPlaceholder']);
TIKA.WM.Param.TravelEvent = Number(TIKA.Parameters['TravelEvent']);
TIKA.WM.Param.RuneStones = JSON.parse(TIKA.Parameters['Rune Stones']);
TIKA.WM.Param.BlinkSpeed = Number(TIKA.Parameters['Blink Speed']);
TIKA.WM.Param.StartingLocation = Number(TIKA.Parameters['Starting Location']);


TIKA.WM.Location = TIKA.WM.Location || {};
TIKA.WM.Location.Animation = false;

TIKA.WM.Param.LocationList = JSON.parse(TIKA.Parameters['Location List']);
for (var i = 0; i < TIKA.WM.Param.LocationList.length; i++) {
    TIKA.WM.Param.LocationList[i] = JSON.parse(TIKA.WM.Param.LocationList[i]);
}

(function () {

    // ============================================================================
    //                       DataManager
    // ============================================================================
    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;


        for (var i = 1; i < $dataItems.length; i++) {
            this.setRuneType($dataItems[i]);
        }

        return true;
    };

    DataManager.setRuneType = function (item) {
        if (item.meta.Rune) {
            item._type = item.meta.Rune.trim().toLowerCase();
        }
    }
    var DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        DataManager_setupNewGame.call(this);
        $gameVariables.setValue(TIKA.WM.Param.LocationIDPlaceholder, TIKA.WM.Param.StartingLocation);
    };


    // ============================================================================
    //                       Scene_Menu
    // ============================================================================


    var Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('map', this.commandMap.bind(this));
    };

    Scene_Menu.prototype.commandMap = function () {
        SceneManager.push(Scene_WorldMap);
    };

    // ============================================================================
    //                       Scene_WorldMap
    // ============================================================================

    function Scene_WorldMap() {
        this.initialize.apply(this, arguments);
    }

    Scene_WorldMap.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_WorldMap.prototype.constructor = Scene_WorldMap;

    Scene_WorldMap.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_WorldMap.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createWaypointsWindow();
        this.createLocationListWindow();
        this.createHelpWindow();
        this.createMapWindow();
        this.createRunesWindow();
        this.createMap();
        this.createAllLocations();
        this.createSelectedLocationSymbol();
    };

    Scene_WorldMap.prototype.createWaypointsWindow = function () {
        var wx = 0;
        var wy = 0;
        var ww = 240;
        var wh = Graphics.boxHeight;
        this._waypointsTitle = new Window_Base(wx, wy, ww, wh);
        this._waypointsTitle.height = this._waypointsTitle.fittingHeight(1);
        this.addWindow(this._waypointsTitle);
    };

    Scene_WorldMap.prototype.createLocationListWindow = function () {
        var wy = this._waypointsTitle.height;
        this._locationList = new Window_LocationList(0, wy);
        this._locationList.height = Graphics.boxHeight - this._waypointsTitle.height;
        this._locationList.setHandler('town', this.selectLocation.bind(this));
        this._locationList.setHandler('dungeon', this.selectLocation.bind(this));
        this._locationList.setHandler('campsite', this.selectLocation.bind(this));
        this._locationList.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._locationList);
    };

    Scene_WorldMap.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Help(4);
        this._helpWindow.y = Graphics.boxHeight - this._helpWindow.height;
        this._helpWindow.x = this._locationList.width;
        this._helpWindow.width = Graphics.boxWidth - this._helpWindow.x - 200;
        this._locationList.setHelpWindow(this._helpWindow);
        this.addWindow(this._helpWindow);
    };

    Scene_WorldMap.prototype.createMapWindow = function () {
        var wx = this._locationList.width;
        var wy = 0;
        var ww = Graphics.boxWidth - wx;
        var wh = Graphics.boxHeight - this._helpWindow.height;
        this._mapWindow = new Window_Base(wx, wy, ww, wh);
        this.addWindow(this._mapWindow);
    };

    Scene_WorldMap.prototype.createRunesWindow = function () {
        var wx = this._helpWindow.x + this._helpWindow.width;
        var wy = this._helpWindow.y;
        this._runesWindow = new Window_Runes(wx, wy);
        this._runesWindow.margin = 0;
        this._runesWindow.padding = 1;
        this._runesWindow.width = 200;
        this._runesWindow.setHandler('campsite', this.travel.bind(this));
        this._runesWindow.setHandler('town', this.travel.bind(this));
        this._runesWindow.setHandler('dungeon', this.travel.bind(this));
        this._runesWindow.setHandler('recall', this.travel.bind(this));
        this._runesWindow.setHandler('cancel', this.goBack.bind(this));
        this._runesWindow.height = this._helpWindow.height;
        this._runesWindow.deactivate();
        this._runesWindow.deselect();
        this.addWindow(this._runesWindow);
    };

    Scene_WorldMap.prototype.createMap = function () {
        this.map = new Sprite();
        this.map.bitmap = ImageManager.loadPicture('map');
        var map = this.map;
        var scene = this;
        this.map.bitmap.addLoadListener(function () {
            map.x = scene._mapWindow.x + (scene._mapWindow.width - scene.map.bitmap.width) / 2;
            map.y = scene._mapWindow.y + (scene._mapWindow.height - scene.map.bitmap.height) / 2;
            scene.createAllLocations();
        });
        this.addChild(this.map);
    };

    Scene_WorldMap.prototype.selectLocation = function () {
        this._locationList.deactivate();
        this._runesWindow.activate();
        this._runesWindow.setActor(this.actor());
        this._runesWindow.select(0);
    };

    Scene_WorldMap.prototype.travel = function () {
        var currentLocation = this._locationList.getLocation();
        $gameVariables.setValue(TIKA.WM.Param.LocationIDPlaceholder, Number(currentLocation.LocationId));
        var rune = $dataItems[TIKA.WM.Param.RuneStones[this._runesWindow._index]];
        this.actor().useItem(rune);
        SceneManager.goto(Scene_Map);
        $gameTemp.reserveCommonEvent(TIKA.WM.Param.TravelEvent);
    };

    Scene_WorldMap.prototype.goBack = function () {
        this._runesWindow.deactivate();
        this._runesWindow.deselect();
        this._locationList.activate();
    };

    Scene_WorldMap.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        var currentLocation = TIKA.WM.Param.LocationList[this._locationList.currentExt()];
        if (currentLocation) {
            this._helpWindow.setText(currentLocation.LocationDescription);
            this._locationList.setLocation(currentLocation);
            this._runesWindow.setLocation(currentLocation);
            this._runesWindow.refresh();
            this.createAllLocations();
            this.createCurrentLocationSymbol();
            this.createSelectedLocationSymbol();
            this.highlightLocation();
        }
        this._waypointsTitle.refresh();
    };

    Scene_WorldMap.prototype.createSelectedLocationSymbol = function () {
        var currentLocation = TIKA.WM.Param.LocationList[this._locationList.currentExt()];
        if (!currentLocation) return;
        var symbol = this._locationList.getSymbol(Number(currentLocation.LocationType));
        var mapX = this.map.x + Number(currentLocation.MapX);
        var mapY = this.map.y + Number(currentLocation.MapY);
        if (!this.location)
            this.location = new Sprite();
        this.location.bitmap = ImageManager.loadPicture(symbol + '_on');
        var location = this.location;
        this.location.bitmap.addLoadListener(function () {
            location.x = mapX - location.width / 2;
            location.y = mapY - location.height / 2;
        });
        this.addChild(this.location);
    };

    Scene_WorldMap.prototype.createCurrentLocationSymbol = function () {
        var currentLocation = this.findCurrentLocation();
        if (!currentLocation) return;
        var symbol = this._locationList.getSymbol(Number(currentLocation.LocationType));
        var mapX = this.map.x + Number(currentLocation.MapX);
        var mapY = this.map.y + Number(currentLocation.MapY);
        if (!this.currentLocation)
            this.currentLocation = new Sprite();
        this.currentLocation.bitmap = ImageManager.loadPicture(symbol + '_current');
        var location = this.currentLocation;
        this.currentLocation.bitmap.addLoadListener(function () {
            location.x = mapX - location.width / 2;
            location.y = mapY - location.height / 2;
        });
        this.currentLocation.opacity = 240;
        this.addChild(this.currentLocation);
    };

    Scene_WorldMap.prototype.createAllLocations = function () {
        for (var i = 0; i < TIKA.WM.Param.LocationList.length; i++) {
            var currentLocation = TIKA.WM.Param.LocationList[i];
            if (!currentLocation) return;
            var symbol = this._locationList.getSymbol(Number(currentLocation.LocationType));
            var mapX = this.map.x + Number(currentLocation.MapX);
            var mapY = this.map.y + Number(currentLocation.MapY);
            if (!this['locations' + i])
                this['locations' + i] = new Sprite();
            this['locations' + i].bitmap = ImageManager.loadPicture(symbol);
            var location = this['locations' + i];
            this['locations' + i].bitmap.addLoadListener(function () {
                location.x = mapX - location.width / 2;
                location.y = mapY - location.height / 2;
            });
            this.addChild(this['locations' + i]);
        }
    };

    Scene_WorldMap.prototype.highlightLocation = function () {
        var minOpacity = 200;
        var maxOpacity = 255;
        if (!TIKA.WM.Location.Animation) {
            this.location.opacity -= TIKA.WM.Param.BlinkSpeed;
            if (this.location.opacity <= minOpacity) TIKA.WM.Location.Animation = true;
        } else {
            this.location.opacity += TIKA.WM.Param.BlinkSpeed;
            if (this.location.opacity >= maxOpacity) TIKA.WM.Location.Animation = false;
        }
    };

    Scene_WorldMap.prototype.findCurrentLocation = function () {
        for (var i = 0; i < TIKA.WM.Param.LocationList.length; i++) {
            var currentLocation = TIKA.WM.Param.LocationList[i];
            if (currentLocation.LocationId == $gameVariables.value(TIKA.WM.Param.LocationIDPlaceholder))
                return currentLocation;
        }
    };

    // ============================================================================
    //                       Window_Help
    // ============================================================================

    var Window_Help_refresh = Window_Help.prototype.refresh;
    Window_Help.prototype.refresh = function () {
        if (SceneManager._scene instanceof Scene_WorldMap) {
            this.contents.clear();
            this.contents.fontSize = TIKA.WM.Param.DescFontSize;
            this.drawTextAutoWrap(this._text, this.textPadding(), 0);
            this.resetFontSettings();
        } else {
            Window_Help_refresh.call(this);
        }
    };

    var Window_help_lineHeight = Window_Help.prototype.lineHeight;
    Window_Help.prototype.lineHeight = function () {
        if (SceneManager._scene instanceof Scene_WorldMap)
            return TIKA.WM.Param.DescFontSize;
        else
            return Window_help_lineHeight.call(this);
    };

    var Window_Help_standardPadding = Window_Help.prototype.standardPadding;
    Window_Help.prototype.standardPadding = function () {
        if (SceneManager._scene instanceof Scene_WorldMap)
            return 5;
        else
            return Window_Help_standardPadding.call(this);
    };

    Window_Help.prototype.drawTextAutoWrap = function (text, x, y) {
        if (!text) {
            return;
        }
        this.contents.fontSize = TIKA.WM.Param.DescFontSize;
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
            this.drawText(word + ' ', x2, y2);
            x2 += width;
        }
        this.resetFontSettings();
    }

    // ============================================================================
    //                       Window_LocationList
    // ============================================================================

    function Window_LocationList() {
        this.initialize.apply(this, arguments);
    }

    Window_LocationList.prototype = Object.create(Window_Command.prototype);
    Window_LocationList.prototype.constructor = Window_LocationList;

    Window_LocationList.prototype.makeCommandList = function () {
        var locations = TIKA.WM.Param.LocationList;
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];
            if ($gameSwitches.value(location.SwitchId)) {
                var enabled = $gameVariables.value(TIKA.WM.Param.LocationIDPlaceholder);
                this.addCommand(location.LocationName, this.getSymbol(Number(location.LocationType)), enabled, i);
            }
        }
    };

    Window_LocationList.prototype.getSymbol = function (type) {
        switch (type) {
            case 1: return 'campsite';
            case 2: return 'town';
            case 3: return 'dungeon';
        }
    };

    Window_LocationList.prototype.setLocation = function (location) {
        this._location = location;
    };

    Window_LocationList.prototype.getLocation = function () {
        return this._location;
    };

    // ============================================================================
    //                       Window_Base
    // ============================================================================

    Window_Base.prototype.refresh = function () {
        this.contents.clear();
        this.drawTitle();
    };

    Window_Base.prototype.drawTitle = function () {
        this.contents.fontSize = 24;
        this.drawText('Waypoint Locations', 0, 0, this.width - this.padding * 2, 'center');
        this.resetFontSettings();
    };

    // ============================================================================
    //                       Window_Base
    // ============================================================================


    function Window_Runes() {
        this.initialize.apply(this, arguments);
    }

    Window_Runes.prototype = Object.create(Window_Command.prototype);
    Window_Runes.prototype.constructor = Window_Runes;

    Window_Runes.prototype.makeCommandList = function () {
        var runes = TIKA.WM.Param.RuneStones;
        for (var i = 0; i < runes.length; i++) {
            var rune = $dataItems[runes[i]];
            var symbol = rune._type;
            var enabled = this.isEnabled(rune, symbol);
            this.addCommand(rune.name, symbol, enabled, i);
        }
    };

    Window_Runes.prototype.isEnabled = function (rune, symbol) {
        if (!this.getLocation()) return false;
        if ($gameParty.numItems(rune) === 0) return false;
        if (symbol === this.getRuneType()) return true;
        if (this.getLocationType(Number(this._location.LocationType)) === symbol) return true;
        return false;
    };

    Window_Runes.prototype.getRuneType = function (type) {
        switch (type) {
            case 1: return 'campsite';
            case 2: return 'town';
            case 3: return 'dungeon';
            default: return 'recall';
        }
    };

    Window_Runes.prototype.getLocationType = function (type) {
        switch (type) {
            case 1: return 'campsite';
            case 2: return 'town';
            case 3: return 'dungeon';
        }
    };

    Window_Runes.prototype.setLocation = function (location) {
        this._location = location;
    };

    Window_Runes.prototype.getLocation = function () {
        return this._location;
    };

    Window_Runes.prototype.setActor = function (actor) {
        this._actor = actor;
    };

    Window_Runes.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = 0;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };

    Window_Runes.prototype.itemWidth = function () {
        return Math.floor((this.width - this.padding * 2 + this.spacing()) / this.maxCols() - this.spacing());
    };

    Window_Runes.prototype.spacing = function () {
        return 1;
    };

    Window_Runes.prototype.itemHeight = function () {
        var clientHeight = this.height - this.padding * 2;
        return Math.floor(clientHeight / this.numVisibleRows());
    };

    Window_Runes.prototype.lineHeight = function () {
        return TIKA.WM.Param.RunesFontSize + 2;
    };

    Window_Runes.prototype.itemRectForText = function (index) {
        var rect = this.itemRect(index);
        rect.x += this.textPadding();
        rect.width -= this.textPadding() * 2;
        return rect;
    };

    Window_Runes.prototype.drawAllItems = function () {
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
    };

    Window_Runes.prototype.standardPadding = function () {
        return 0;
    };

    Window_Runes.prototype.drawItem = function (index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.contents.fontSize = TIKA.WM.Param.RunesFontSize;
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
        var numItems = $gameParty.numItems($dataItems[TIKA.WM.Param.RuneStones[index]]);
        this.drawText('\u00d7' + numItems, rect.x, rect.y, rect.width, 'right');
        this.resetFontSettings();
    };

    Window_Runes.prototype.refresh = function () {
        this.clearCommandList();
        this.makeCommandList();
        this.createContents();
        Window_Selectable.prototype.refresh.call(this);
    };

    // ============================================================================
    //                       TIKA_ScriptCalls
    // ============================================================================

    TIKA.WorldMap.openWorldMap = function () {
        if (!$gameParty.inBattle()) SceneManager.push(Scene_WorldMap);
        return true;
    };

})();