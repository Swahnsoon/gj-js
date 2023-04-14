/*:
 * @plugindesc v1.0 Custom craft menu
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
 * Custom craft menu.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *  
 * <Tool> - Notetag for Armor notebox that you want to show up in the ItemCraft.
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
Imported.TIKA_CraftMenu = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.CraftMenu = TIKA.CraftMenu || {};
TIKA.CM = TIKA.CM || {};
TIKA.CM.Param = TIKA.CM.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_CraftMenu');

TIKA.CM.Param.DescFontSize = Number(TIKA.Parameters['Font Size']);
TIKA.CM.Param.PowerUpColor = Number(TIKA.Parameters['PowerUpColor']);
TIKA.CM.Param.PowerDownColor = Number(TIKA.Parameters['PowerDownColor']);

(function () {

    // ============================================================================
    //                                 DataManager
    // ============================================================================

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        for (var i = 1; i < $dataItems.length; i++) {
            this.addToolCategory($dataItems[i]);
        }
        for (var i = 1; i < $dataWeapons.length; i++) {
            this.addToolCategory($dataWeapons[i]);
        }
        for (var i = 1; i < $dataArmors.length; i++) {
            this.addToolCategory($dataArmors[i]);
        }

        return true;
    };

    DataManager.addToolCategory = function (item) {
        if (!item) return;
        var meta = item.meta;
        if (meta.Tool)
            item.tool = meta.Tool;
    }

    // ============================================================================
    //                    Scene_Synthesis
    // ============================================================================

    Scene_Synthesis.prototype.refreshWindows = function () {
        this._statusWindow.refresh();
        this._listWindow.refresh();
        this._goldWindow.refresh();
        this._ingredientsWindow.refresh(this._listWindow.item());
    };

    Scene_Synthesis.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createCommandWindow();
        this.createBuyCategoryWindow();
        // this.createDummyWindow();
        this.createListWindow();
        this.createGoldWindow();
        this.createStatusWindow();
        this.createIngredientsWindow();
        this.createNumberWindow();
    };

    Scene_Synthesis.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Description(10);
        this._helpWindow.padding = 7;
        this._helpWindow.openness = 0;
        this.addWindow(this._helpWindow);
    };

    Scene_Synthesis.prototype.createDummyWindow = function () {
        var wy = this._commandWindow.y + this._commandWindow.height;
        var wh = Graphics.boxHeight - wy;
        var ww = Graphics.boxWidth / 2;
        this._dummyWindow = new Window_Base(0, wy, ww, wh);
        this.addWindow(this._dummyWindow);
    };

    Scene_Synthesis.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_SynthesisCommand();
        this._commandWindow.y = 0;
        this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
        this._commandWindow.setHandler('cancel', this.onCancelOk.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_Synthesis.prototype.createBuyCategoryWindow = function () {
        this._buyCategoryWindow = new Window_ShopBuyCategory(0, 0, this._commandWindow);
        this._buyCategoryWindow.setHelpWindow(this._helpWindow);
        this._buyCategoryWindow.y = this._commandWindow.y + this._commandWindow.height;
        this._buyCategoryWindow.height = Graphics.boxHeight - this._buyCategoryWindow.y;
        this._buyCategoryWindow.width = this._commandWindow.width;
        this._buyCategoryWindow.deselect();
        this._buyCategoryWindow.deactivate();
        this._buyCategoryWindow.setHandler('ok', this.onBuyCategoryOk.bind(this));
        this._buyCategoryWindow.setHandler('cancel', this.onBuyCategoryCancel.bind(this));
        this.addWindow(this._buyCategoryWindow);
    };

    Scene_Synthesis.prototype.onBuyCategoryOk = function () {
        this._listWindow.activate();
        this._listWindow.select(0);
    };

    Scene_Synthesis.prototype.onBuyCategoryCancel = function () {
        this._commandWindow.activate();
        this._buyCategoryWindow.deselect();
    };

    Scene_Synthesis.prototype.onCancelOk = function () {
        $gameTemp._synthRecipe = undefined;
        this.popScene();
    };

    Scene_Synthesis.prototype.createStatusWindow = function () {
        var wx = this._commandWindow.width;
        var wy = this._goldWindow.height;
        var ww = Graphics.boxWidth / 2 - wx;
        var wh = this._commandWindow.height / 2;
        this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
        this.addWindow(this._statusWindow);
    };

    Scene_Synthesis.prototype.createListWindow = function () {
        this._listWindow = new Window_SynthesisList(this._commandWindow);
        this._listWindow.x = this._commandWindow.width;
        this._listWindow.width = this._listWindow.width - this._listWindow.x;
        this._listWindow.setHandler('ok', this.onListOk.bind(this));
        this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
        this._listWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._listWindow);
    };

    Scene_Synthesis.prototype.createGoldWindow = function () {
        var wx = this._commandWindow.width;
        var wy = 0;
        this._goldWindow = new Window_Gold(wx, wy);
        this._goldWindow.height = this._commandWindow.height / 2;
        this._goldWindow.width = Graphics.boxWidth / 2 - wx;
        this._goldWindow.createContents();
        this._goldWindow.refresh();
        this.addWindow(this._goldWindow);
    };

    Scene_Synthesis.prototype.createIngredientsWindow = function () {
        var wx = this._listWindow.width;
        var wy = this._listWindow.y;
        var ww = Graphics.boxWidth / 4;
        var wh = Graphics.boxHeight - wy - this._goldWindow.height;
        this._ingredientsWindow = new Window_SynthesisIngredients(wx, wy, ww, wh);
        this._listWindow._ingredients = this._ingredientsWindow;
        this._ingredientsWindow.openness = 0;
        this.addWindow(this._ingredientsWindow);
    };

    Scene_Synthesis.prototype.createNumberWindow = function () {
        this._numberWindow = new Window_SynthesisNumber(this._ingredientsWindow);
        this._numberWindow.hide();
        this._numberWindow.setHandler('ok', this.onNumberOk.bind(this));
        this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    };

    Scene_Synthesis.prototype.onCommandOk = function () {
        this._buyCategoryWindow.show();
        this._listWindow.show();
        this._buyCategoryWindow.activate();
        this._buyCategoryWindow.refresh();
        this._buyCategoryWindow.select(0);
    };

    Scene_Synthesis.prototype.onListCancel = function () {
        this._buyCategoryWindow.activate();
        this._listWindow.select(-1);
        this._listWindow.updateHelp();
        this._helpWindow.close();
        this._ingredientsWindow.close();
    };

    Scene_Synthesis.prototype.onListOk = function () {
        this._item = this._listWindow.item();
        this._ingredientsWindow.close();
        this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
        this._statusWindow.setItem(this._item);
    };

    Scene_Synthesis.prototype.onNumberOk = function () {
        this.playSynthesisSound();
        var number = this._numberWindow.number();
        this.doBuy(number);
        this.customSynthEffect(number);
        this.endNumberInput();
        this.refreshWindows();
    };

    Scene_Synthesis.prototype.playSynthesisSound = function () {
        var se = {
            name: this._item.synthSeName,
            volume: this._item.synthSeVol,
            pitch: this._item.synthSePitch,
            pan: this._item.synthSePan
        }
        AudioManager.playSe(se);
    };

    Scene_Synthesis.prototype.doBuy = function (number) {
        var price = number * this._item.synthCost;
        $gameParty.loseGold(price);
        for (var i = 0; i < this._item.synthIngredients.length; ++i) {
            var ingredient = DataManager.getSynthesisIngredient(this._item, i);
            var quantity = DataManager.getSynthesisQuantity(this._item, i);
            quantity *= number;
            if (!ingredient) continue;
            $gameParty.loseItem(ingredient, quantity, false);
        }
        $gameParty.gainItem(this._item, number);
        $gameSystem.addSynth(this._item);
    };

    Scene_Synthesis.prototype.customSynthEffect = function (number) {
        if (!this._item.customSynthEval) return;
        if (this._item.customSynthEval <= 0) return;
        var item = this._item;
        var s = $gameSwitches._data;
        var v = $gameVariables._data;
        var code = this._item.customSynthEval;
        try {
            while (number--) {
                eval(code);
            }
        } catch (e) {
            Yanfly.Util.displayError(e, code, 'CUSTOM SYNTH EFFECT ERROR');
        }
    };

    Scene_Synthesis.prototype.endNumberInput = function () {
        this._numberWindow.hide();
        this._listWindow.activate();
        this._ingredientsWindow.open();
    };

    Scene_Synthesis.prototype.onNumberCancel = function () {
        SoundManager.playCancel();
        this.endNumberInput();
    };

    Scene_Synthesis.prototype.maxBuy = function () {
        return $gameSystem.maxSynthesize(this._item);
    };

    Scene_Synthesis.prototype.buyingPrice = function () {
        return $gameSystem.maxSynthesize(this._item) * this._item.synthCost;
    };

    Scene_Synthesis.prototype.currencyUnit = function () {
        return this._goldWindow.currencyUnit();
    };

    var Scene_Synthesis_update = Scene_Synthesis.prototype.update;
    Scene_Synthesis.prototype.update = function () {
        Scene_Synthesis_update.call(this);
        this._statusWindow._item = this._listWindow.item();
        this._statusWindow.refresh();
        if (this._listWindow.active) {
            this._ingredientsWindow.updatePlacement(this._listWindow._cursorRect.x, this._listWindow.y - this._listWindow.padding, this._listWindow._cursorRect, this._listWindow.item());
            this._helpWindow.updatePlacement(this._listWindow._cursorRect.x, this._listWindow.y - this._listWindow.padding, this._listWindow._cursorRect);
        }
        if (this._numberWindow.active) {
            this._numberWindow.updatePlacement(this._listWindow._cursorRect.x, this._listWindow.y - this._listWindow.padding, this._listWindow._cursorRect);
        }
        if (this._commandWindow.active) {
            this._buyCategoryWindow.refresh();
            if (this._buyCategoryWindow._list.length) {
                this._listWindow._category = this._buyCategoryWindow._list[0].ext;
                this._listWindow.refresh();
            }
        }
        if (this._buyCategoryWindow.active) {
            this._listWindow._category = this._buyCategoryWindow.currentExt();
            this._listWindow.refresh();
        }
    }

    Scene_Synthesis.getAvailableRecipes = function (set, type, list) {
        var length = set.length;
        for (var i = 0; i < length; ++i) {
            var item = set[i];
            if (!item) continue;
            if ((type === 0 && item.recipeItem) || (type === 0 && item.recipeArmor)) {
                this.getAvailableSynthesisItems(item.recipeItem.concat(item.recipeArmor), type, list);
            } else if (type === 1 && item.recipeWeapon) {
                this.getAvailableSynthesisItems(item.recipeWeapon, type, list);
            } else if (type === 2 && item.recipeArmor) {
                this.getAvailableSynthesisItems(item.recipeArmor, type, list);
            }
        }
    };

    Scene_Synthesis.getAvailableSynthesisItems = function (array, type, list) {
        var length = array.length;
        for (var i = 0; i < length; ++i) {
            if (type === 0) var obj = $dataArmors[array[i]] ? $dataArmors[array[i]].tool ? $dataArmors[array[i]] : $dataItems[array[i]] : $dataItems[array[i]];
            if (type === 1) var obj = $dataWeapons[array[i]];
            if (type === 2) var obj = $dataArmors[array[i]] ? $dataArmors[array[i]].tool ? null : $dataArmors[array[i]] : $dataArmors[array[i]];
            this.addSynthesisItem(obj, list);
        }
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
        if (SceneManager._scene instanceof Scene_Synthesis) {
            var x = this.textPadding();
            var y = this.textPadding();
            var width = this.contents.width - this.textPadding() * 2;
            this.contents.clear();
            this.drawText('Player Gold:', x, y, this.width, 'left');
            this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
        } else {
            Window_Gold_refresh.call(this);
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

    Window_Gold.prototype.unitInText = function (unit) {
        switch (unit) {
            case 'G': return 'gold'
        }
    };

    // ============================================================================
    //                    Window_Description
    // ============================================================================

    var Window_Description_updatePlacement = Window_Description.prototype.updatePlacement;
    Window_Description.prototype.updatePlacement = function (x, y, rect) {
        if (SceneManager._scene instanceof Scene_Synthesis) {
            if (this._text.replace(/<WordWrap>/g, '').length < 1) {
                this.close();
                return;
            }
            this.open();
            this._refreshBack();
            this.opacity = 255;
            this.backOpacity = this.standardBackOpacity();
            var scene = this.parent.parent;
            this.y = y + scene._ingredientsWindow.height + scene._ingredientsWindow.padding;
            this.x = x + Graphics.boxWidth / 2;
            if (this.y + this.height > Graphics.boxHeight) {
                this.y = scene._ingredientsWindow.y - this.height;
            }
            this.width = Graphics.boxWidth / 4;
            this.refresh();
        } else
            Window_Description_updatePlacement.call(this, x, y, rect);

    };

    // ============================================================================
    //                    Window_SynthesisList
    // ============================================================================

    Window_SynthesisList.prototype.drawItem = function (index) {
        var item = this._data[index];
        if (!item) return;
        this.resetFontSettings();
        var rect = this.itemRect(index);
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width);
    };

    Window_SynthesisList.prototype.makeItemList = function () {
        this._data = [];
        if (this._commandWindow.currentSymbol() === 'item') {
            this._data = Scene_Synthesis.availableItems();
        } else if (this._commandWindow.currentSymbol() === 'weapon') {
            this._data = Scene_Synthesis.availableWeapons();
        } else if (this._commandWindow.currentSymbol() === 'armor') {
            this._data = Scene_Synthesis.availableArmors();
        }

        this._data = this._data.filter(item => item._buyCategory === this._category);
    };

    // ============================================================================
    //                    Window_SynthesisIngredients
    // ============================================================================

    Window_SynthesisIngredients.prototype.refresh = function (item) {
        this.contents.clear();
        if (!item) return;
        this._item = item;
        this.resetFontSettings();
        this.resetTextColor();
        this.height = this.fittingHeight(item.synthIngredients.length + 1);
        this.drawItemIngredients(item, this.lineHeight());
    };

    Window_SynthesisIngredients.prototype.drawItemIngredients = function (item, wy) {
        var ww = this.contents.width;
        this.changeTextColor(this.systemColor());
        this.drawText('Components', 0, 0, ww, 'left');
        this.changeTextColor(this.normalColor());
        for (var i = 0; i < item.synthIngredients.length; ++i) {
            wy = this.drawItemDetails(i, wy);
            if (wy + this.lineheight > this.contents.height) break;
        }
        this.drawItemSynthCost(item, wy);
    };

    Window_SynthesisIngredients.prototype.updatePlacement = function (x, y, rect, item) {
        this.open();
        this.y = y + 0.5 * rect.height;
        this.x = x + Graphics.boxWidth / 2;
        if (this.y + this.height > Graphics.boxHeight) {
            this.y = y + 0.5 * rect.height - this.height;
        }
        if (this.x + this.width > Graphics.boxWidth) {
            this.x = x - this.width + rect.width;
        }
        this.width = Graphics.boxWidth / 4;
        this.refresh(item);
    };

    Window_SynthesisIngredients.prototype.drawItemName = function (item, x, y, width) {
        if (!item) return;
        if ($gameSystem.hasSynthed(item)) {
            Window_Base.prototype.drawItemName.call(this, item, x, y, width);
            return;
        }
        var text = item.name;
        this.drawText(text, x, y, width);
        this.contents.fontItalic = false;
    };

    // ============================================================================
    //                    Window_SynthesisNumber
    // ============================================================================

    Window_SynthesisNumber.prototype.updatePlacement = function (x, y, rect) {
        this.open();
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

    var Window_SynthesisNumber_refresh = Window_SynthesisNumber.prototype.refresh;
    Window_SynthesisNumber.prototype.refresh = function () {
        this.height = this.fittingHeight(this._item.synthIngredients.length + 1);
        Window_SynthesisNumber_refresh.call(this);
    };

    Window_SynthesisNumber.prototype.drawItemQuantity = function (index, wy) {
        var ingredient = DataManager.getSynthesisIngredient(this._item, index);
        var quantity = DataManager.getSynthesisQuantity(this._item, index);
        var ww = this.contents.width;
        this.contents.fontSize = Yanfly.Param.ISQuantitySize;
        this.changeTextColor(this.normalColor());
        var text = '/' + String(Yanfly.Util.toGroup(quantity));
        this.drawText(text, 0, wy, ww, 'right');
        if ($gameParty.numItems(ingredient) >= quantity) {
            this.changeTextColor(this.powerUpColor());
        } else {
            this.changeTextColor(this.powerDownColor());
        }
        var num = Yanfly.Util.toGroup($gameParty.numItems(ingredient));
        ww -= this.textWidth(text);
        this.drawText(num, 0, wy, ww, 'right');
    }

    Window_SynthesisIngredients.prototype.drawItemQuantity = function (index, wy) {
        var ingredient = DataManager.getSynthesisIngredient(this._item, index);
        var quantity = DataManager.getSynthesisQuantity(this._item, index);
        var ww = this.contents.width;
        this.contents.fontSize = Yanfly.Param.ISQuantitySize;
        this.changeTextColor(this.normalColor());
        var text = '/' + String(Yanfly.Util.toGroup(quantity));
        this.drawText(text, 0, wy, ww, 'right');
        if ($gameParty.numItems(ingredient) >= quantity) {
            this.changeTextColor(this.powerUpColor());
        } else {
            this.changeTextColor(this.powerDownColor());
        }
        var num = Yanfly.Util.toGroup($gameParty.numItems(ingredient));
        ww -= this.textWidth(text);
        this.drawText(num, 0, wy, ww, 'right');
    }

    Window_SynthesisNumber.prototype.drawItemName = function (item, x, y, width) {
        if (!item) return;
        if ($gameSystem.hasSynthed(item)) {
            Window_Base.prototype.drawItemName.call(this, item, x, y, width);
            return;
        }
        var text = item.name;
        this.drawText(text, x, y, width);
        this.contents.fontItalic = false;
    };

    Window_SynthesisNumber.prototype.powerUpColor = function () {
        return this.textColor(TIKA.CM.Param.PowerUpColor);
    };

    Window_SynthesisNumber.prototype.powerDownColor = function () {
        return this.textColor(TIKA.CM.Param.PowerDownColor);
    };

    Window_SynthesisIngredients.prototype.powerUpColor = function () {
        return this.textColor(TIKA.CM.Param.PowerUpColor);
    };

    Window_SynthesisIngredients.prototype.powerDownColor = function () {
        return this.textColor(TIKA.CM.Param.PowerDownColor);
    };

    // ============================================================================
    //                        Window_ShopBuyCategory
    // ============================================================================

    function Window_ShopBuyCategory() {
        this.initialize.apply(this, arguments);
    }

    Window_ShopBuyCategory.prototype = Object.create(Window_MenuCommand.prototype);
    Window_ShopBuyCategory.prototype.constructor = Window_ShopBuyCategory;

    Window_ShopBuyCategory.prototype.initialize = function (x, y, commandWindow) {
        this._commandWindow = commandWindow;
        Window_MenuCommand.prototype.initialize.call(this, x, y);
        this.selectLast();
    };

    Window_ShopBuyCategory.prototype.makeCommandList = function () {
        this.getData();
        var goods = this._data;
        var categories = [];
        for (var i = 0; i < goods.length; i++) {
            var item = goods[i];
            if (item._buyCategory && !categories.contains(item._buyCategory)) {
                categories.push(item._buyCategory);
                var category = item._buyCategory.charAt(0).toUpperCase() + item._buyCategory.slice(1);
                this.addCommand(category, 'item', true, item._buyCategory);
            }
        }
    };

    Window_ShopBuyCategory.prototype.getData = function () {
        this._data = [];
        if (this._commandWindow.currentSymbol() === 'item') {
            this._data = Scene_Synthesis.availableItems();
        } else if (this._commandWindow.currentSymbol() === 'weapon') {
            this._data = Scene_Synthesis.availableWeapons();
        } else if (this._commandWindow.currentSymbol() === 'armor') {
            this._data = Scene_Synthesis.availableArmors();
        }
    };

    Window_ShopBuyCategory.prototype.maxCols = function () {
        return 1;
    };

    // ============================================================================
    //                    Game_Party
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