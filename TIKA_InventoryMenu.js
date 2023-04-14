/*:
 * @plugindesc v1.0 Custom inventory menu
 * @author TIKA
 *
 * @param Font Size
 * @text Font size of the Description window.
 * @default 22
 *
 * @param Visible states
 * @text States affecting actor that are visible on actor status menu. If left empty, all the states are visible.
 * @type number[]
 * @default []
 * 
 * @param ---Sort Window---
 * @default
 * 
 * @param AlphabeticalSortName
 * @parent ---Sort Window---
 * @desc Name of the alphabetical sort in the sort window.
 * @default ABC
 * 
 * @param TypeSortName
 * @parent ---Sort Window---
 * @desc Name of the sort by type in the sort window.
 * @default Strategic
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * Custom inventory menu.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 * <Category: Category> - Define item category with this notetag.
 * 
 * Example: <Category: Consumable>
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
Imported.TIKA_InventoryMenu = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.Param = TIKA.Param || {};
TIKA.IM = TIKA.IM || {};
TIKA.IM.Param = TIKA.IM.Param || {};
TIKA.InventoryMenu = TIKA.InventoryMenu || {};
TIKA.Parameters = PluginManager.parameters('TIKA_InventoryMenu');

TIKA.Param.VisibleStates = JSON.parse(TIKA.Parameters['Visible states']);
TIKA.InventoryMenu.Categories = [];
TIKA.IM.Param.DescFontSize = Number(TIKA.Parameters['Font Size']);
TIKA.IM.Param.ABCSort = TIKA.Parameters['AlphabeticalSortName'];
TIKA.IM.Param.TypeSort = TIKA.Parameters['TypeSortName'];

(function () {

    // ============================================================================
    //                       DataManager
    // ============================================================================

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        for (var i = 1; i < $dataItems.length; i++) {
            this.setCategory($dataItems[i]);
        }
        for (var i = 1; i < $dataWeapons.length; i++) {
            this.setCategory($dataWeapons[i]);
        }
        for (var i = 1; i < $dataArmors.length; i++) {
            this.setCategory($dataArmors[i]);
        }

        return true;
    };


    DataManager.setCategory = function (item) {
        var category = item.meta.Category;
        if (item && category) {
            item._category = category.trim();
            if (!TIKA.InventoryMenu.Categories.includes(item._category))
                TIKA.InventoryMenu.Categories.push(item._category);
            item._category = item._category.toLowerCase();
        }
    }

    // ============================================================================
    //                       Window_Description
    // ============================================================================

    function Window_Item() {
        this.initialize.apply(this, arguments);
    }

    Window_Item.prototype = Object.create(Window_Status.prototype);
    Window_Item.prototype.constructor = Window_Item;

    Window_Item.prototype.initialize = function () {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
        this._actor = null;
        this.refresh();
    };

    // ============================================================================
    //                       Scene_Item
    // ============================================================================



    var Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function () {
        Scene_ItemBase.prototype.create.call(this);
        this.createBaseWindow();
        this.createFillerWindow();
        this.createCategoryWindow();
        this.createItemWindow();
        this.createActorWindow();
        this.createSortWindow();
        this.createHelpWindow();
        //On scene initialization set sort type to the one already selected
        this._itemWindow._sortType = this._sortWindow.currentExt();
    };

    Scene_Item.prototype.createFillerWindow = function () {
        this._fillWindow = new Window_Fill();
        this._fillWindow.width = Graphics.boxWidth;
        this.addWindow(this._fillWindow);
        this._baseWindow.addChild(this._fillWindow);
        this._fillWindow.refresh();
    };

    Scene_Item.prototype.createSortWindow = function () {
        this._sortWindow = new Window_Sort();
        this._sortWindow.width = Graphics.boxWidth / 5;
        this._sortWindow.height = this._sortWindow.fittingHeight(1);
        this._sortWindow.x = this._categoryWindow.width;
        this._sortWindow.y = this._fillWindow.height;
        this.addWindow(this._sortWindow);
        this._sortWindow.deactivate();
        this._baseWindow.addChild(this._sortWindow);
        this._sortWindow.refresh();
        this._sortWindow.select(this.actor()._selectedSort || 0);
    };

    Scene_Item.prototype.createActorWindow = function () {
        this._actorWindow = new Window_MenuActor();
        this._actorWindow.y = this._fillWindow.height + this._fillWindow.fittingHeight(1);
        this._actorWindow.x = this._itemWindow.x + this._itemWindow.width;
        this._actorWindow.height = Graphics.boxHeight - this._actorWindow.y;
        this._actorWindow.width = Graphics.boxWidth - this._actorWindow.x;
        this._actorWindow.setHandler('ok', this.onActorOk.bind(this));
        this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
        this.opacity = 255;
        this.addWindow(this._actorWindow);
        this._baseWindow.addChild(this._actorWindow);
        this._actorWindow.refresh();
    };

    Scene_Item.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Description(10);
        this._helpWindow.width = Graphics.boxWidth / 5;
        this._helpWindow.x = Graphics.boxWidth / 3 - this._helpWindow.width / 10;
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._helpWindow.margin = 0;
        this._helpWindow.padding = 5;
        this._helpWindow.openness = 0;
        this.addWindow(this._helpWindow);
        this._baseWindow.addChild(this._helpWindow);
    };

    Scene_Item.prototype.createCategoryWindow = function () {
        this._categoryWindow = new Window_ItemCategory();
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.y = this._fillWindow.height;
        this._categoryWindow.height = Graphics.boxHeight - this._categoryWindow.y;
        this._categoryWindow.width = Graphics.boxWidth / 5;
        this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
        this._baseWindow.addChild(this._categoryWindow);
    };

    Scene_Item.prototype.createItemWindow = function () {
        var wy = this._fillWindow.height + this._categoryWindow.fittingHeight(1);
        var wh = Graphics.boxHeight - wy;
        var wx = this._categoryWindow.x + this._categoryWindow.width;
        var ww = Graphics.boxWidth / 3;
        this._itemWindow = new Window_ItemList(wx, wy, ww, wh);
        this._itemWindow.width = ww;
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
        this._baseWindow.addChild(this._itemWindow);
    };

    Scene_Item.prototype.createBaseWindow = function () {
        this._baseWindow = new Window_Item(0, 0);
        this.addWindow(this._baseWindow);
        this._baseWindow.refresh();
    };

    Scene_Item.prototype.onCategoryOk = function () {
        this._itemWindow.activate();
        this._itemWindow.select(0);
    };

    Scene_Item.prototype.onItemOk = function () {
        if (!this.isEnabled(this.item())) {
            this._itemWindow.activate();
            return;
        }
        this._baseWindow.refresh();
        $gameParty.setLastItem(this.item());
        this.determineItem();
        this._helpWindow.close();
    };

    Scene_Item.prototype.onActorOk = function () {
        if (this.canUse()) {
            this.useItem();
            if (!$gameParty.hasItem(this.item())) {
                this._actorWindow.deselect();
                this._actorWindow.deactivate();
                this._actorWindow.hide();
                this._itemWindow.activate()
                this._itemWindow.selectLast();
            }
        } else {
            SoundManager.playBuzzer();
        }
    };

    Scene_Item.prototype.isEnabled = function (item) {
        if (!item) return false;
        return $gameParty.canUse(item);
    };

    Scene_Item.prototype.onItemCancel = function () {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
        this._helpWindow.close();
    };

    Scene_Item.prototype.showSubWindow = function (window) {
        window.y = this._fillWindow.height;
        window.x = this._itemWindow.x + this._itemWindow.width;
        window.height = Graphics.boxHeight - window.y;
        window.width = Graphics.boxWidth - window.x;
        window.show();
        window.activate();
    };

    Scene_Item.prototype.hideSubWindow = function (window) {
        window.hide();
        window.deactivate();
        this.activateItemWindow();
        this._baseWindow.refresh();
    };

    Scene_Item.prototype.update = function () {
        Scene_Base.prototype.update.call(this);
        if (this._itemWindow.active)
            this._itemWindow._helpWindow.updatePlacement(this._itemWindow.x + 2 * this._itemWindow.padding, this._itemWindow.y + this._itemWindow.padding + this._itemWindow._cursorRect.y, this._itemWindow._cursorRect);

        if (!this._actorWindow.visible) {
            this._sortWindow.width = this._itemWindow.width;
            this._sortWindow.activate();
            this._sortWindow.refresh();
        } else {
            this._sortWindow.deactivate();
        }

        this._fillWindow._category = this._itemWindow._category;
        this._fillWindow.refresh();
    };


    // ============================================================================
    //                       Window_ItemList
    // ============================================================================

    var WIndow_Itemlist_initialize = Window_ItemList.prototype.initialize;
    Window_ItemList.prototype.initialize = function (x, y, width, height) {
        WIndow_Itemlist_initialize.call(this, x, y, width, height);
        this._sortType = 'byName';
    };

    var Window_ItemList_refresh = Window_ItemList.prototype.refresh;
    Window_ItemList.prototype.refresh = function () {
        Window_ItemList_refresh.call(this);
        if (SceneManager._scene instanceof Scene_Item)
            this.updateHelp();
    };

    Window_ItemList.prototype.includes = function (item) {
        switch (this._category) {
            case 'all':
                return $gameParty.allItems().includes(item);
            case 'item':
                return DataManager.isItem(item) && item.itypeId === 1;
            case 'weapon':
                return DataManager.isWeapon(item);
            case 'armor':
                return DataManager.isArmor(item);
            case 'keyItem':
                return DataManager.isItem(item) && item.itypeId === 2;
            default:
                if (item)
                    return item._category === this._category;
                else return false;
        }
    };

    Window_ItemList.prototype.makeItemList = function () {
        this._data = $gameParty.allItems().filter(function (item) {
            return this.includes(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }

        if (SceneManager._scene instanceof Scene_Item)
            this.countAllItems();

        if (this._sortType == 'byName')
            this.sortItemList('name');
        else
            this.sortItemList('id');


    };

    Window_ItemList.prototype.sortItemList = function (sortType) {
        var items = this._data.filter(function (item) { if (item) return item.id < 3000 });
        var restOfItems = this._data.filter(function (item) { if (item) return item.id >= 3000 });
        items.sort(function (a, b) {
            if (!a || !b) return 0;
            if (a[sortType] < b[sortType]) { return -1; }
            if (a[sortType] > b[sortType]) { return 1; }
            return 0;
        });
        var newSortType = sortType == 'id' ? 'basItemid' : sortType;
        restOfItems.sort(function (a, b) {
            if (!a || !b) return 0;
            if (a[newSortType] < b[newSortType]) { return -1; }
            if (a[newSortType] > b[newSortType]) { return 1; }
            return 0;
        });

        this._data = items.concat(restOfItems);
    };

    Window_ItemList.prototype.drawItem = function (index) {
        var item = this._data[index];
        if (item) {
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    var Window_ItemList_drawItemNumber = Window_ItemList.prototype.drawItemNumber;
    Window_ItemList.prototype.drawItemNumber = function (item, dx, dy, dw) {
        if (DataManager.isIndependent(item)) {
            this.drawItemQtyNumber(item, dx, dy, dw);
            return;
        }
        Window_ItemList_drawItemNumber.call(this, item, dx, dy, dw);
    };

    Window_ItemList.prototype.countAllItems = function () {
        var items = this._data;
        for (var i = 0; i < items.length; i++) {
            items[i]._qty = $gameParty.numIndependentItems(this.getBaseItem(items[i]));
        }

        for (var i = 0; i < items.length; i++) {
            if (DataManager.isIndependent(items[i]))
                this.removeDuplicates(i, items[i].baseItemId);
        }

    }

    Window_ItemList.prototype.getBaseItem = function (item) {
        var baseItem = item;
        if (DataManager.isItem(item)) {
            baseItem = $dataItems[item.baseItemId];
        } else if (DataManager.isWeapon(item)) {
            baseItem = $dataWeapons[item.baseItemId];
        } else if (DataManager.isArmor(item)) {
            baseItem = $dataArmors[item.baseItemId];
        }

        return baseItem;
    }

    Window_ItemList.prototype.drawItemQtyNumber = function (item, dx, dy, dw) {
        this.contents.fontSize = Yanfly.Param.ItemQuantitySize;
        this.drawText('\u00d7' + item._qty, dx, dy, dw, 'right');
        this.resetFontSettings();
    };

    Window_ItemList.prototype.removeDuplicates = function (firstOccurence, itemId) {
        for (var i = firstOccurence; i < this._data.length; i++) {
            if (i == firstOccurence) continue;
            if (this._data[i].baseItemId === itemId) {
                this._data.splice(i, 1);
                i--;
            }
        }
    }

    // ============================================================================
    //                       Window_ItemCategory
    // ============================================================================

    Window_ItemCategory.prototype.makeCommandList = function () {
        this.addCommand('All', 'all');
        TIKA.InventoryMenu.Categories.sort();
        for (var i = 0; i < TIKA.InventoryMenu.Categories.length; i++) {
            this.addCommand(TIKA.InventoryMenu.Categories[i], TIKA.InventoryMenu.Categories[i].toLowerCase());
        }
    };

    Window_ItemCategory.prototype.maxCols = function () {
        return 1;
    };

    var Window_ItemCategory_numVisibleRows = Window_ItemCategory.prototype.numVisibleRows;
    Window_ItemCategory.prototype.numVisibleRows = function () {
        if (SceneManager._scene instanceof Scene_Item) return this.numberOfCategories();
        return Window_ItemCategory_numVisibleRows.call(this);
    };

    Window_ItemCategory.prototype.numberOfCategories = function () {
        return TIKA.InventoryMenu.Categories.length + 1;
    };

    // ============================================================================
    //                       Window_MenuActor
    // ============================================================================

    Window_MenuActor.prototype.drawItem = function (index) {
        this.drawItemBackground(index);
        this.drawItemImage(index);
        this.drawItemStatus(index);
    };

    var Window_MenuActor_activate = Window_MenuActor.prototype.activate;
    Window_MenuActor.prototype.activate = function () {
        Window_MenuActor_activate.call(this);
        this.refresh();
    };

    Window_MenuActor.prototype.drawItemImage = function (index) {
        var imageHeight = Window_Base._faceHeight;
        var imageWidth = Window_Base._faceWidth;
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        this.changePaintOpacity(actor.isBattleMember());
        var y = rect.y + rect.height / 2 - imageHeight / 2;
        this.drawActorFace(actor, rect.x, y, imageHeight, imageWidth);
        this.changePaintOpacity(true);
    };

    Window_MenuActor.prototype.drawItemStatus = function (index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        var x = Window_Base._faceWidth + 10;
        var y = rect.y;
        var width = this.width - x - this.textPadding();
        this.drawActorSimpleStatus(actor, x, y, width);
    };

    Window_MenuActor.prototype.drawActorSimpleStatus = function (actor, x, y, width) {
        var lineHeight = this.lineHeight();
        var width2 = Math.min(200, width - 180 - this.textPadding());
        this.drawActorName(actor, this.padding, y);
        this.drawActorHp(actor, x, y + lineHeight, width2);
        this.drawActorMp(actor, x, y + lineHeight * 2, width2);
        this.drawActorIcons(actor, x, y + lineHeight * 5, width);
    };

    Window_MenuActor.prototype.drawActorIcons = function (actor, x, y, width) {
        width = width || this.width - x;
        Window_Base._iconHeight = 32;
        Window_Base._iconWidth = 32;
        var icons = actor.allIcons();
        var counter = 0;
        var iconY = y;
        for (var i = 0; i < icons.length; i++ , counter++) {
            var iconX = x + Window_Base._iconWidth * counter;
            if (iconX > width) {
                iconY -= Window_Base._iconHeight - 2;
                counter = 0;
                iconX = x + Window_Base._iconWidth * counter;
            }
            this.drawIcon(icons[i], iconX, iconY);
        }
    };

    Window_MenuActor.prototype.drawActorHp = function (actor, x, y, width) {
        width = width || 186;
        this.changeTextColor(this.systemColor());
        this.drawText('Health:', x, y, 100);
        this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
            this.hpColor(actor), this.normalColor());
    };

    Window_MenuActor.prototype.drawActorMp = function (actor, x, y, width) {
        width = width || 186;
        this.changeTextColor(this.systemColor());
        this.drawText('Mana:', x, y, 100);
        this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
            this.mpColor(actor), this.normalColor());
    };

    Window_MenuActor.prototype.lineHeight = function () {
        return this.contents.fontSize + this.contents.fontSize / 4;
    };


    // ============================================================================
    //                       Game_BattlerBase
    // ============================================================================

    Game_BattlerBase.prototype.stateIcons = function () {
        return this.states().map(function (state) {
            if (TIKA.Param.VisibleStates.includes(state.id.toString()) || TIKA.Param.VisibleStates.length == 0)
                return state.iconIndex;
        }).filter(function (iconIndex) {
            return iconIndex > 0;
        });
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
        this.y = y;
        this.x = x + rect.x + rect.width;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = y + rect.height - this.height;
        }
        if (this.x + this.width > Graphics.boxWidth) {
            this.x = x - this.width + rect.width;
        }
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
        else if (SceneManager._scene instanceof Scene_Item)
            return TIKA.IM.Param.DescFontSize;
    };

    // ============================================================================
    //                       Window_Sort
    // ============================================================================

    function Window_Sort() {
        this.initialize.apply(this, arguments);
    }

    Window_Sort.prototype = Object.create(Window_HorzCommand.prototype);
    Window_Sort.prototype.constructor = Window_Sort;

    Window_Sort.prototype.makeCommandList = function () {
        this.clearCommandList();
        this.addCommand(TIKA.IM.Param.ABCSort, 'byName', true, 'byName');
        this.addCommand(TIKA.IM.Param.TypeSort, 'strategic', true, 'strategic');
    };

    Window_Sort.prototype.maxCols = function () {
        return 3;
    };

    var Window_Sort_cursorRight = Window_Sort.prototype.cursorRight;
    Window_Sort.prototype.cursorRight = function (wrap) {
        Window_Sort_cursorRight.call(this, wrap);
        var wl = this.parent.parent.parent;
        wl._itemWindow._sortType = this.currentExt();
        wl._itemWindow.refresh();
        wl.actor()._selectedSort = this._index;
    };
    var Window_Sort_cursorLeft = Window_Sort.prototype.cursorLeft;
    Window_Sort.prototype.cursorLeft = function (wrap) {
        Window_Sort_cursorLeft.call(this, wrap);
        var wl = this.parent.parent.parent;
        wl._itemWindow._sortType = this.currentExt();
        wl._itemWindow.refresh();
        wl.actor()._selectedSort = this._index;
    };

    var Window_Sort_processTouch = Window_Sort.prototype.processTouch;
    Window_Sort.prototype.processTouch = function () {
        Window_Sort_processTouch.call(this);
        if (this._touching) {
            var wl = this.parent.parent.parent;
            wl._itemWindow._sortType = this.currentExt();
            wl._itemWindow.refresh();
            wl.actor()._selectedSort = this._index;
        }
    };

    Window_Sort.prototype.drawTitle = function () {
        this.contents.fontSize = 26;
        this.drawText('Sort:', 0, 0, this.width / 3, 'center');
        this.resetFontSettings();
    };

    Window_Sort.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = (index + 1) % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };

    Window_Sort.prototype.drawItem = function (index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    };

    var Window_Sort_refresh = Window_Sort.prototype.refresh;
    Window_Sort.prototype.refresh = function () {
        Window_Sort_refresh.call(this);
        this.drawTitle();
    };


    // ============================================================================
    //                       Window_Fill
    // ============================================================================

    function Window_Fill() {
        this.initialize.apply(this, arguments);
    }

    Window_Fill.prototype = Object.create(Window_Base.prototype);
    Window_Fill.prototype.constructor = Window_Fill;

    Window_Fill.prototype.initialize = function () {
        var width = Graphics.boxWidth;
        var height = this.lineHeight() * 2;
        Window_Base.prototype.initialize.call(this, 0, 0, width, height);
        this.refresh();
    };

    Window_Fill.prototype.refresh = function () {
        this.contents.clear();
        this.contents.fontSize = 28;
        this.drawInventory(0, 0);
        this.drawCategory(Graphics.boxWidth / 5, 0);
        this.drawParty(Graphics.boxWidth / 5 + Graphics.boxWidth / 3, 0);
        this.resetFontSettings();

    };

    Window_Fill.prototype.drawCategory = function (x, y) {
        this.drawText(this._category ? this._category.charAt(0).toUpperCase() + this._category.slice(1) : 'All', x, y, Graphics.boxWidth / 4, 'left');
    };

    Window_Fill.prototype.drawInventory = function (x, y) {
        this.drawText('Inventory', x, y, Graphics.boxWidth / 3, 'left');
    };

    Window_Fill.prototype.lineHeight = function () {
        return 28 + 2 * this.textPadding();
    };

    Window_Fill.prototype.drawParty = function (x, y) {
        var scene = undefined;
        if (this.parent && this.parent.parent) {
            scene = this.parent.parent.parent;
            var actorWindow = scene._actorWindow;
            if (actorWindow)
                this.drawText(actorWindow.active ? 'Party' : '', x, y, Graphics.boxWidth / 3, 'left');
        }
    };

    Window_Fill.prototype.drawText = function (text, x, y, maxWidth, align) {
        this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
    };

})();
