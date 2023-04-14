/*:
 * @plugindesc v1.0 Custom shop menu
 * @author TIKA
 *
 * @param Font Size
 * @text Font size of the Description window.
 * @default 22
 *
 * @param PowerUpColor
 * @desc Color of a number when you have enough ingredients.
 * @default 11
 *
 * @param PowerDownColor
 * @desc Color of a number when you don't have enough ingredients.
 * @default 18
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 * Custom shop menu.
 *
 * ============================================================================
 * How to use
 * ============================================================================
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * There is one notetag available for items/armors/weapons.
 *
 * <BuyCategory: category>
 *
 * This notetags sets a category to an item/armor/weapon, and they will show
 * up in the menu underneath that category.
 *
 * In the craft menu these categories will show up as well.
 *
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
Imported.TIKA_ShopMenu = true;
var TIKA = TIKA || {};


TIKA.version = 1.01;

TIKA.ShopMenu = TIKA.ShopMenu || {};
TIKA.ShM = TIKA.ShM || {};
TIKA.ShM.Param = TIKA.ShM.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_ShopMenu');
TIKA.ShM.Param.PowerUpColor = Number(TIKA.Parameters['PowerUpColor']);
TIKA.ShM.Param.PowerDownColor = Number(TIKA.Parameters['PowerDownColor']);

TIKA.ShM.Param.DescFontSize = Number(TIKA.Parameters['Font Size']);

(function () {

    // ============================================================================
    //                          DataManager
    // ============================================================================

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        for (var i = 1; i < $dataItems.length; i++) {
            this.setBuyCategory($dataItems[i]);
        }
        for (var i = 1; i < $dataWeapons.length; i++) {
            this.setBuyCategory($dataWeapons[i]);
        }
        for (var i = 1; i < $dataArmors.length; i++) {
            this.setBuyCategory($dataArmors[i]);
        }

        return true;
    };


    DataManager.setBuyCategory = function (item) {
        var category = item.meta.BuyCategory;
        if (item && category) {
            item._buyCategory = category.trim();
            item._buyCategory = item._buyCategory;
        }
    }

    // ============================================================================
    //                    Scene_Shop
    // ============================================================================

    Scene_Shop.prototype.failSafeGoods = function () {
        if (this._goods === undefined) {
            var goods = $gameTemp._shopGoods;
            var purchaseOnly = $gameTemp._shopPurchaseOnly;
            this.prepare(goods, purchaseOnly);
        }
        $gameTemp.clearShopGoods();
    };

    Scene_Shop.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        //this.createFillWindow();
        this.failSafeGoods();
        this.createHelpWindow();
        this.createCommandWindow();
        this.createDummyWindow();
        this.createNumberWindow();
        this.createBuyWindow();
        this.createBuyCategoryWindow();
        this.createCategoryWindow();
        this.createSellWindow();
        this.createGoldWindow();
        this.createStatusWindow();
        this.createActorWindow();
    };

    Scene_MenuBase.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Description(10);
        this._helpWindow.padding = 7;
        this._helpWindow.openness = 0;
        this.addWindow(this._helpWindow);
    };

    Scene_Shop.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_ShopCommand(0, this._purchaseOnly);
        this._commandWindow.y = 0;
        this.addWindow(this._commandWindow);
        this.setCommandWindowHandlers();
    };

    Scene_Shop.prototype.setCommandWindowHandlers = function () {
        this._commandWindow.setHandler('buy', this.commandBuy.bind(this));
        this._commandWindow.setHandler('sell', this.commandSell.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this._commandWindow.setHandler('equip', this.commandEquip.bind(this));
    };

    Scene_Shop.prototype.createDummyWindow = function () {
        var wy = this._commandWindow.y + this._commandWindow.height;
        var wh = Graphics.boxHeight - wy;
        var ww = Graphics.boxWidth / 2;
        this._dummyWindow = new Window_Base(0, wy, ww, wh);
        this.addWindow(this._dummyWindow);
    };

    Scene_Shop.prototype.createFillWindow = function () {
        var wx = Graphics.boxWidth / 2;
        var wy = 0;
        var wh = Graphics.boxHeight - wy;
        var ww = Graphics.boxWidth - wx;
        this._fillWindow = new Window_Base(wx, wy, ww, wh);
        this.addWindow(this._fillWindow);
    };


    Scene_Shop.prototype.createNumberWindow = function () {
        var wx = Graphics.boxWidth / 2;
        var wy = 0;
        var wh = this._commandWindow.height / 1.5;
        this._numberWindow = new Window_ShopNumber(wx, wy, wh);
        this._numberWindow.width = Graphics.boxHeight / 5;
        this._numberWindow.hide();
        this._numberWindow.setHandler('ok', this.onNumberOk.bind(this));
        this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    };

    Scene_Shop.prototype.createBuyWindow = function () {
        var wy = this._dummyWindow.y;
        var wh = this._dummyWindow.height;
        var wx = this._commandWindow.x + this._commandWindow.width;
        this._buyWindow = new Window_ShopBuy(wx, wy, wh, this._goods);
        this._buyWindow.x = wx;
        this._buyWindow.width = Graphics.boxWidth / 2 - wx;
        this._buyWindow.setHelpWindow(this._helpWindow);
        this._buyWindow.setInfoWindow(this._infoWindow);
        this._buyWindow.hide();
        this._buyWindow.deselect();
        this._buyWindow.setHandler('ok', this.onBuyOk.bind(this));
        this._buyWindow.setHandler('cancel', this.onBuyCancel.bind(this));
        this.addWindow(this._buyWindow);
        this._buyWindow.refresh();
    };

    Scene_Shop.prototype.createCategoryWindow = function () {
        this._categoryWindow = new Window_ShopCategory();
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.y = this._commandWindow.y;
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
        this.addWindow(this._categoryWindow);
    };

    Scene_Shop.prototype.createBuyCategoryWindow = function () {
        this._buyCategoryWindow = new Window_ShopBuyCategory(0, 0, this._goods);
        this._buyCategoryWindow.setHelpWindow(this._helpWindow);
        this._buyCategoryWindow.y = this._commandWindow.y + this._commandWindow.height;
        this._buyCategoryWindow.height = Graphics.boxHeight - this._buyCategoryWindow.y;
        this._buyCategoryWindow.width = this._commandWindow.width;
        this._buyCategoryWindow.hide();
        this._buyCategoryWindow.deactivate();
        this._buyCategoryWindow.setHandler('ok', this.onBuyCategoryOk.bind(this));
        this._buyCategoryWindow.setHandler('cancel', this.onBuyCategoryCancel.bind(this));
        this.addWindow(this._buyCategoryWindow);
    };

    Scene_Shop.prototype.onBuyCategoryOk = function () {
        this.activateBuyWindow();
        this._buyWindow.select(0);
    };

    Scene_Shop.prototype.onBuyCategoryCancel = function () {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._buyCategoryWindow.hide();
        this._buyWindow.hide();
    };

    Scene_Shop.prototype.createSellWindow = function () {
        var wy = this._dummyWindow.y;
        var ww = this._dummyWindow.width;
        var wh = this._dummyWindow.height;
        this._sellWindow = new Window_ShopSell(0, wy, ww, wh);
        this._sellWindow.setHelpWindow(this._helpWindow);
        this._sellWindow.hide();
        this._sellWindow.setInfoWindow(this._infoWindow);
        this._sellWindow.setHandler('ok', this.onSellOk.bind(this));
        this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
        this._categoryWindow.setItemWindow(this._sellWindow);
        this.addWindow(this._sellWindow);
    };

    Scene_Shop.prototype.createGoldWindow = function () {
        var wx = this._commandWindow.width;
        var wy = 0;
        this._goldWindow = new Window_Gold(wx, wy);
        this._goldWindow.height = this._commandWindow.height / 2;
        this._goldWindow.width = Graphics.boxWidth / 2 - wx;
        this._goldWindow.createContents();
        this._goldWindow.refresh();
        this.addWindow(this._goldWindow);
    };

    Scene_Shop.prototype.createStatusWindow = function () {
        var wx = this._commandWindow.width;
        var wy = this._goldWindow.height;
        var ww = Graphics.boxWidth / 2 - wx;
        var wh = this._commandWindow.height / 2;
        this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
        this.addWindow(this._statusWindow);
        this._buyWindow.setStatusWindow(this._statusWindow);
        this._sellWindow.setStatusWindow(this._statusWindow);
    };

    Scene_Shop.prototype.commandBuy = function () {
        this._buysellmode = 1;
        this._dummyWindow.hide();
        this._buyCategoryWindow.show();
        this._buyCategoryWindow.activate();
        this._buyCategoryWindow.select(0);
        this._buyWindow.show();
        this._buyWindow.setMoney(this.money());
        this._buyWindow.refresh();
    };

    Scene_Shop.prototype.onBuyOk = function () {
        this._item = this._buyWindow.item();
        this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
        var currencyUnit = $dataItems[this._item.itemBuyPrices[0]] ? $dataItems[this._item.itemBuyPrices[0]].name : this.currencyUnit();
        this._numberWindow.setCurrencyUnit(currencyUnit);
        this._numberWindow.show();
        this._numberWindow.updatePlacement(this._buyWindow._cursorRect.x, this._buyWindow.y + this._buyWindow._cursorRect.y, this._buyWindow._cursorRect);
        this._numberWindow.activate();
        this._statusWindow.setItem(this._item);
    };

    Scene_Shop.prototype.onBuyCancel = function () {
        this._buyCategoryWindow.activate();
        this._buyWindow.deselect();
        this._statusWindow.setItem(null);
        this._helpWindow.close();
    };

    Scene_Shop.prototype.commandSell = function () {
        this._categoryWindow.show();
        this._categoryWindow.activate();
        this._sellWindow.show();
        this._sellWindow.deselect();
        this._sellWindow.refresh();
        this._buyWindow.hide();
    };

    Scene_Shop.prototype.activateSellWindow = function () {
        this._categoryWindow.show();
        this._sellWindow.refresh();
        this._sellWindow.show();
        this._sellWindow.activate();
    };

    Scene_Shop.prototype.doSell = function (number) {
        this.doSellGold(number);
        this.doSellItem(number);
        if (!Imported.YEP_ItemCore) return;
        if (!DataManager.isIndependent(this._item)) return;
        DataManager.removeIndependentItem(this._item);
        this._statusWindow.refresh();
    };

    Scene_Shop.prototype.doSellGold = function (number) {
        $gameParty.gainGold(number * this.sellingPrice());
    };

    Scene_Shop.prototype.onSellOk = function () {
        this._item = this._sellWindow.item();
        this._categoryWindow.hide();
        this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.updatePlacement(this._sellWindow._cursorRect.x, this._sellWindow.y + this._sellWindow._cursorRect.y, this._sellWindow._cursorRect);
        this._numberWindow.refresh();
        this._numberWindow.activate();
        this._statusWindow.setItem(this._item);
    };

    Scene_Shop.prototype.onSellCancel = function () {
        this._sellWindow.deselect();
        this._categoryWindow.activate();
        this._statusWindow.setItem(null);
        this._helpWindow.close();
    };

    Scene_Shop.prototype.isSelling = function () {
        return this._commandWindow.currentSymbol() === 'sell';
    };

    Scene_Shop.prototype.createActorWindow = function () {
        this._actorWindow = new Window_MenuActor();
        this._actorWindow.setHandler('ok', this.onActorOk.bind(this));
        this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    };

    Scene_Shop.prototype.commandEquip = function () {
        this._actorWindow.activate();
        this._actorWindow.show();
        this._actorWindow.select(0);
    };

    Scene_Shop.prototype.onActorOk = function () {
        this.onActorCommon();
        if (this._commandWindow.currentSymbol() === 'equip') {
            SceneManager.push(Scene_Equip);
        }
    };

    Scene_Shop.prototype.onActorCancel = function () {
        this._actorWindow.hide();
        this._actorWindow.deselect();
        this._commandWindow.activate();
    };

    Scene_Shop.prototype.onActorCommon = function () {
        $gameTemp.registerShopGoods();
        var index = this._actorWindow.index();
        var actor = $gameParty.members()[index];
        $gameParty.setMenuActor(actor);
        SoundManager.playOk();
    };

    var Scene_Shop_sellingPrice = Scene_Shop.prototype.sellingPrice;
    Scene_Shop.prototype.sellingPrice = function () {
        if (this._item && this._item.sellPrice !== undefined) {
            return this._item.sellPrice;
        }
        return Scene_Shop_sellingPrice.call(this);
    };

    var Scene_Shop_maxBuy = Scene_Shop.prototype.maxBuy;
    Scene_Shop.prototype.maxBuy = function () {
        var max = Scene_Shop_maxBuy.call(this);
        if (DataManager.isIndependent(this._item)) {
            var baseItem = DataManager.getBaseItem(this._item);
            var value = $gameParty.numIndependentItems(baseItem);
            max = max - value;
        }
        var price = this.buyingPrice();
        if (price > 0) {
            return Math.min(max, Math.floor(this.money() / price));
        } else {
            return max;
        }
    };

    var Scene_Shop_update = Scene_Shop.prototype.update;
    Scene_Shop.prototype.update = function () {
        Scene_Shop_update.call(this);
        if (this._buyWindow.active) {
            this._helpWindow.updatePlacement(this._buyWindow._cursorRect.x, this._buyWindow.y + this._buyWindow._cursorRect.y, this._buyWindow._cursorRect);
        }
        if (this._sellWindow.active) {
            this._helpWindow.updatePlacement(this._sellWindow._cursorRect.x, this._sellWindow.y + this._sellWindow._cursorRect.y, this._sellWindow._cursorRect);
        }
        if (this._numberWindow.active) {
            if (this._helpWindow.y + this._helpWindow.height > this._numberWindow.y)
                this._helpWindow.y -= 10;
        }
        if (this._buyCategoryWindow.active) {
            this._buyWindow._category = this._buyCategoryWindow.currentExt();
            this._buyWindow.refresh();
        }
    }

    // ============================================================================
    //                    Window_ShopBuy
    // ============================================================================

    Window_ShopBuy.prototype.drawItem = function (index) {
        var item = this._data[index];
        var rect = this.itemRect(index);
        var priceWidth = 96;
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.resetTextColor();
        this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
        if (this.price(item) > this._price[this._data.indexOf(item)]) {
            this.changeTextColor(this.powerDownColor());
        }
        if (this.price(item) < this._price[this._data.indexOf(item)]) {
            this.changeTextColor(this.powerUpColor());
        }
        this.drawBuyPrice(item, rect);
        this.changePaintOpacity(true);
        this.resetFontSettings();
    };

    Window_ShopBuy.prototype.drawItemName = function (item, x, y, width) {
        width = width || 312;
        if (item) {
            this.resetTextColor();
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.drawText(item.name, x + this.textPadding(), y, width);
        }
    };

    Window_Selectable.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };

    Window_ShopBuy.prototype.drawAltCurrency = function (value, unit, wx, wy, ww) {
        var unitText = '';
        if (DataManager.isItem(unit) || DataManager.isWeapon(unit) ||
            DataManager.isArmor(unit)) {
            unitText = unit.name;
        } else if (unit.match(/VARIABLE[ ](\d+)/i)) {
            var name = $dataSystem.variables[parseInt(RegExp.$1)];
            name = name.replace(/\\I\[(\d+)\]/gi, '');
            unitText = name.replace(/<<(.*?)>>/gi, '');
        }
        // Draw Text
        this.contents.fontSize = Yanfly.Param.MCCurrencyFontSize;
        if (unitText !== '') {
            wx = this.width - this.textWidth(Yanfly.Util.toGroup(value) + ' ' + this.unitInText(unitText)) - this.padding * 2 - this.textPadding();
            ww = this.width - wx;
            this.drawText(Yanfly.Util.toGroup(value) + ' ' + this.unitInText(unitText), wx, wy, ww, 'left');
        }
        ww -= this.textWidth(Yanfly.Util.toGroup(value));
        return ww;
    };

    Window_ShopBuy.prototype.standardPadding = function () {
        return 5;
    };

    Window_ShopBuy.prototype.textPadding = function () {
        return 5;
    };

    Window_ShopBuy.prototype.drawCurrencyValue = function (value, unit, wx, wy, ww) {
        this.contents.fontSize = Yanfly.Param.GoldFontSize;
        if (this.usingGoldIcon(unit)) {
            var cx = Window_Base._iconWidth;
        } else {
            var cx = this.textWidth(unit);
        }
        var text = Yanfly.Util.toGroup(value);
        if (this.textWidth(text) > ww - cx) {
            text = Yanfly.Param.GoldOverlap;
        }
        this.drawText(text, wx, wy, ww - cx - 4, 'right');
        if (this.usingGoldIcon(unit)) {
            this.drawIcon(Yanfly.Icon.Gold, wx + ww - Window_Base._iconWidth, wy + 2);
        } else {
            this.changeTextColor(this.systemColor());
            this.drawText(unit, wx, wy, ww, 'right');
        }
        this.resetFontSettings();
    };

    Window_ShopBuy.prototype.unitInText = function (unit) {
        switch (unit) {
            case 'G': return 'gold';
            default: return unit;
        }
    };

    Window_ShopBuy.prototype.powerUpColor = function () {
        return this.textColor(TIKA.ShM.Param.PowerUpColor);
    };

    Window_ShopBuy.prototype.powerDownColor = function () {
        return this.textColor(TIKA.ShM.Param.PowerDownColor);
    };

    Window_ShopBuy.prototype.makeItemList = function () {
        this._data = [];
        this._price = [];
        this._shopGoods.forEach(function (goods) {
            var item = null;
            switch (goods[0]) {
                case 0:
                    item = $dataItems[goods[1]];
                    break;
                case 1:
                    item = $dataWeapons[goods[1]];
                    break;
                case 2:
                    item = $dataArmors[goods[1]];
                    break;
            }
            // if (item && this.protoPrice(item) > 0) {//This is why those augmnts are not in the list.
            if (item && this._category === item._buyCategory) {
                this._data.push(item);
                this._price.push(goods[2] === 0 ? item.price : goods[3]);
            }
            //}
        }, this);
    };


    // ============================================================================
    //                    Window_ShopStatus
    // ============================================================================

    Window_ShopStatus.prototype.refresh = function () {
        this.contents.clear();
        if (this._item) {
            var x = this.textPadding();
            this.drawPossession(x, this.height / 2 - this.lineHeight());
            this.drawEquipped(x, this.height / 2);
        }
    };

    Window_ShopStatus.prototype.drawPossession = function (x, y) {
        var width = this.contents.width - this.textPadding() - x;
        var possessionWidth = this.textWidth('0000');
        if (DataManager.isIndependent(this._item)) {
            var baseItem = DataManager.getBaseItem(this._item);
            var value = $gameParty.numIndependentItems(baseItem);
        } else
            var value = $gameParty.numItems(this._item);
        this.drawText(TextManager.possession, x, y, width - possessionWidth);
        this.drawText(value, x, y, width, 'right');
    };

    Window_ShopStatus.prototype.drawEquipped = function (x, y) {
        var width = this.contents.width - this.textPadding() - x;
        var possessionWidth = this.textWidth('0000');
        if ($gameParty.isAnyMemberEquipped(this._item))
            var value = $gameParty.countEquippedItems(this._item);
        else
            var value = 0;
        this.drawText("Equipped", x, y, width - possessionWidth);
        this.drawText(value, x, y, width, 'right');
    };

    Window_ShopStatus.prototype.standardPadding = function () {
        return 0;
    };

    Window_ShopStatus.prototype.textPadding = function () {
        return 10;
    };

    // ============================================================================
    //                    Window_Gold
    // ============================================================================

    var Window_Gold_refresh = Window_Gold.prototype.refresh;
    Window_Gold.prototype.refresh = function () {
        if (SceneManager._scene instanceof Scene_Shop) {
            var x = this.textPadding();
            var y = this.textPadding() * 2;
            this.contents.clear();
            var ww = this.contents.width - this.textPadding() * 2;
            if (this.isDrawGoldCurrency()) {
                this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, ww);
                ww -= this.getcurrencyGoldWidth(this.value());
                ww -= Yanfly.Param.MCCurrencyPadding;
                this.contents.fontSize = 22;
                this.drawText('Player Gold:', x, y, ww, 'left');
            } else if (this._item) {
                this.drawItemCurrencies(x, ww);
                this.drawText('Player Items:', x, y, ww, 'left');
            }
            this.resetFontSettings();
        } else {
            Window_Gold_refresh.call(this);
        }
    };

    Window_Gold.prototype.drawItemCurrencies = function (wx, ww) {
        var item = this._item;
        var wy = this.textPadding() * 2;
        // Variables
        var currencies = this._buyMode ? item.variableBuyPrices : item.variableSellPrices;
        if (currencies) {
            var length = currencies.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i) {
                    var varId = currencies[i];
                    var value = $gameVariables.value(varId);
                    var unit = 'VARIABLE ' + varId;
                    ww = this.drawAltCurrency(value, unit, wx, wy, ww);
                    ww -= Yanfly.Param.MCCurrencyPadding;
                }
            }
        }
        // Armors
        currencies = this._buyMode ? item.armorBuyPrices : item.armorSellPrices;
        if (currencies) {
            length = currencies.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i) {
                    var costItem = $dataArmors[currencies[i]];
                    var value = $gameParty.numItems(costItem);
                    ww = this.drawAltCurrency(value, costItem, wx, wy, ww);
                    ww -= Yanfly.Param.MCCurrencyPadding;
                }
            }
        }
        // Weapons
        currencies = this._buyMode ? item.weaponBuyPrices : item.weaponSellPrices;
        if (currencies) {
            length = currencies.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i) {
                    var costItem = $dataWeapons[currencies[i]];
                    var value = $gameParty.numItems(costItem);
                    ww = this.drawAltCurrency(value, costItem, wx, wy, ww);
                    ww -= Yanfly.Param.MCCurrencyPadding;
                }
            }
        }
        // Items
        currencies = this._buyMode ? item.itemBuyPrices : item.itemSellPrices;
        if (currencies) {
            length = currencies.length;
            if (length > 0) {
                for (var i = 0; i < length; ++i) {
                    var costItem = $dataItems[currencies[i]];
                    var value = $gameParty.numItems(costItem);
                    ww = this.drawAltCurrency(value, costItem, wx, wy, ww);
                    ww -= Yanfly.Param.MCCurrencyPadding;
                }
            }
        }
    };

    Window_Gold.prototype.drawCurrencyValue = function (value, unit, wx, wy, ww) {
        this.resetTextColor();
        if (this.usingGoldIcon(unit)) {
            var cx = Window_Base._iconWidth;
        } else {
            var cx = this.textWidth(unit);
        }
        var text = Yanfly.Util.toGroup(value);
        if (this.textWidth(text) > ww - cx) {
            text = Yanfly.Param.GoldOverlap;
        }
        var www = this.textWidth(this.unitInText(unit));
        this.drawText(text, 0, wy, this.contentsWidth() - www - this.padding, 'right');
        this.drawText(this.unitInText(unit), wx, wy, ww, 'right');
    };

    Window_Gold.prototype.drawAltCurrency = function (value, unit, wx, wy, ww) {
        var unitText = '';
        if (DataManager.isItem(unit) || DataManager.isWeapon(unit) ||
            DataManager.isArmor(unit)) {
            unitText = unit.name;
        } else if (unit.match(/VARIABLE[ ](\d+)/i)) {
            var name = $dataSystem.variables[parseInt(RegExp.$1)];
            name = name.replace(/\\I\[(\d+)\]/gi, '');
            unitText = name.replace(/<<(.*?)>>/gi, '');
        }
        wx = this.width / 2;
        ww = ww - wx - this.padding;
        // Draw Text
        this.contents.fontSize = 22;
        this.drawText(Yanfly.Util.toGroup(value), wx, wy, ww, 'left');
        if (unitText !== '') {
            wx += this.textWidth(value) + this.textPadding();
            this.drawText(unitText, wx, wy, ww, 'left');
        }
        return ww;
    };

    // ============================================================================
    //                    Window_Description
    // ============================================================================

    var Window_Description_updatePlacement = Window_Description.prototype.updatePlacement;
    Window_Description.prototype.updatePlacement = function (x, y, rect) {
        if (SceneManager._scene instanceof Scene_Shop) {
            if (this._text.replace(/<WordWrap>/g, '').length < 1) {
                this.close();
                return;
            }
            this.open();
            this._refreshBack();
            this.opacity = 255;
            this.backOpacity = this.standardBackOpacity();
            this.y = y + 0.5 * rect.height;
            this.x = x + Graphics.boxWidth / 2;
            if (this.y + this.height > Graphics.boxHeight) {
                this.y = y + 0.5 * rect.height - this.height;
            }
            if (this.x + this.width > Graphics.boxWidth) {
                this.x = x - this.width + rect.width;
            }
            this.width = Graphics.boxWidth / 4;
            this.refresh();
        } else {
            Window_Description_updatePlacement.call(this, x, y, rect);
        }

    };

    // ============================================================================
    //                    Window_ShopNumber
    // ============================================================================

    Window_ShopNumber.prototype.updatePlacement = function (x, y, rect) {
        this.y = y + 0.5 * rect.height;
        this.x = x + Graphics.boxWidth / 2;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = y + 0.5 * rect.height - this.height;
        }
        if (this.x + this.width > Graphics.boxWidth) {
            this.x = x - this.width + rect.width;
        }
        this.width = Graphics.boxWidth / 4;
        this.refresh();
    };

    Window_ShopNumber.prototype.refresh = function () {
        this.contents.clear();
        this.drawColumnTitles();
        this.drawMultiplicationSign();
        this.drawNumber();
        this.drawTotalPrice();
    };

    Window_ShopNumber.prototype.drawColumnTitles = function () {
        this.drawText('Quantity', this.textPadding(), 0, this.textWidth('Quantity'), 'left');
        var width = this.contentsWidth() - this.textPadding();
        this.drawText('Total Cost', width / 2, 0, width / 2, 'center');
    };

    Window_ShopNumber.prototype.drawMultiplicationSign = function () {
        var sign = '\u00d7';
        var width = this.textWidth(sign);
        var x = this.textPadding();
        var y = this.itemY();
        this.resetTextColor();
        this.drawText(sign, x, y, width);
    };

    Window_ShopNumber.prototype.drawNumber = function () {
        var x = this.cursorX();
        var y = this.itemY();
        var width = this.cursorWidth() - this.textPadding();
        this.resetTextColor();
        this.drawText(this._number, x, y, width, 'right');
    };

    Window_ShopNumber.prototype.drawTotalPrice = function () {
        var prices = this._item.itemBuyPrices;
        var width = this.contentsWidth() - this.textPadding();
        if (!prices || !prices.length) {
            var total = this._price * this._number;
            this.drawCurrencyValue(total, this._currencyUnit, 0, this.itemY(), width);
        } else {
            for (var i = 0; i < prices.length; i++) {
                this.height += this.fittingHeight(1) * i;
                var total = this._item.itemBuyPrice[prices[i]] * this._number;
                this.drawCurrencyValue(total, this._currencyUnit, 0, this.itemY() + this.lineHeight() * i, width);
            }
        }
    };

    Window_ShopNumber.prototype.drawCurrencyValue = function (value, unit, wx, wy, ww) {
        this.resetTextColor();
        if (this.usingGoldIcon(unit)) {
            var cx = Window_Base._iconWidth;
        } else {
            var cx = this.textWidth(unit);
        }
        var text = Yanfly.Util.toGroup(value);
        if (this.textWidth(text) > ww - cx) {
            text = Yanfly.Param.GoldOverlap;
        }
        var www = this.textWidth(this.unitInText(unit));
        // this.drawText(text, 0, wy, this.contentsWidth() - www - this.padding, 'right');
        this.drawText(text + ' ' + this.unitInText(unit), ww / 2, wy, ww / 2, 'center');
    };

    Window_ShopNumber.prototype.unitInText = function (unit) {
        switch (unit) {
            case 'G': return 'gold'
            default: return unit;
        }
    };

    Window_ShopNumber.prototype.cursorX = function () {
        return this.textPadding() * 2 + this.textWidth('\u00d7');
    };

    Window_ShopNumber.prototype.itemY = function () {
        return this.lineHeight();
    };

    // ============================================================================
    //                    Window_ShopSell
    // ============================================================================

    Window_ShopSell.prototype.drawItem = function (index) {
        var item = this._data[index];
        var rect = this.itemRect(index);
        if (item) {
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawText(this.sellingPrice(item) + ' gold', rect.x, rect.y, rect.width, 'right');
            this.changePaintOpacity(1);
        }
    };

    Window_ShopSell.prototype.makeItemList = function () {
        this._data = $gameParty.allItems().filter(function (item) {
            return this.includes(item) && this.sellingPrice(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
    };

    // ============================================================================
    //                        Window_ShopBuyCategory
    // ============================================================================

    function Window_ShopBuyCategory() {
        this.initialize.apply(this, arguments);
    }

    Window_ShopBuyCategory.prototype = Object.create(Window_MenuCommand.prototype);
    Window_ShopBuyCategory.prototype.constructor = Window_ShopBuyCategory;

    Window_ShopBuyCategory.prototype.initialize = function (x, y, goods) {
        this._goods = goods;
        Window_MenuCommand.prototype.initialize.call(this, x, y);
        this.selectLast();
    };

    Window_ShopBuyCategory.prototype.makeCommandList = function () {
        var goods = this._goods;
        var categories = [];
        for (var i = 0; i < goods.length; i++) {
            var item = this.getItem(goods[i]);
            if (item._buyCategory && !categories.contains(item._buyCategory)) {
                categories.push(item._buyCategory);
                var category = item._buyCategory.charAt(0).toUpperCase() + item._buyCategory.slice(1);
                this.addCommand(category, 'item', true, item._buyCategory);
            }
        }
    };

    Window_ShopBuyCategory.prototype.getItem = function (goods) {
        switch (goods[0]) {
            case 0: return $dataItems[goods[1]];
            case 1: return $dataWeapons[goods[1]];
            case 2: return $dataArmors[goods[1]];
        }
    };

    Window_ShopBuyCategory.prototype.maxCols = function () {
        return 1;
    };

    // ============================================================================
    //                              Game_Party
    // ============================================================================

    Game_Party.prototype.countEquippedItems = function (item) {
        var number = 0;
        $gameParty.members().forEach(member => {
            if (member.hasBaseItem(item)) {
                number++;
            }
        });

        return number;
    };

})();
