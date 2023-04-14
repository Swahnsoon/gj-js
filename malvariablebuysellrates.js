//=============================================================================
// Maliki's Variable Buy and Sell Rates
// MalVariableBuySellRates.js
// version 1.2a
//=============================================================================
/*:  
 * @plugindesc ver1.2a - Allows developers to set group item buy and sell costs.  
 * @author Maliki79
 *
 * @help Allows developers to set group item buy and sell costs.  
 *
 * To use item group rates, item group tags must be created in your item notetags.
 * <itemGroup: x>
 * with x being the number of the group you wish to add this item to.
 * (This works for items, weapons, and armors)
 *
 * To set group rates, use the Script Call:
 * $gameParty.setShopRates(x, y, z);
 * With x being the group number, y being the buying amount and z being the cost amount.
 * y and z will be a percentage integer.
 * (0 is the group default and cannot be set.)
 *
 * Example: $gameParty.setShopRates(1, 120, 50);
 * This will set all items in group one to be bought from shops at 120% regular cost and sold at 50% regular cost.
 * (You can use any call that will return a number, including variables!)
 * Using a setShopRate call with the same group number will overwrite the older one.
 *
 * You can also set regional buy/sell rates which will be applied to all items.
 * $gameParty.setRegionRate(x, y);
 * With x being the buying rate and y being the selling rate.
 * Note that this setting will after ALL stores the player encounters untill a new region rate is set.
 * Also note that both rates can be active at any time.
 * Group rates are multiplied first, followed by the regional rate.
 *
 * You can reset ALL Shop Rates by using the Script Call:
 * $gameParty.resetShopRates();
 * (You can also use this call if using this Plugin from an old save to initialize it.)
 *
 * When in the Shop Scene, the Names and prices have been given colors to help determine positive and
 * negative rates relative to the player.
 *
 * When buying, the cost of items recieving a discount will appear in green text.
 * Items higher than the regular cost will have that value appear in red.
 * Similarly, when selling, the item name will appear green if the player is getting a good deal selling
 * above the normal selling rate and red if below.
 *
 * The rate considered "normal" can be changed with the script call:
 * $gameParty.setNormalSellRate(x);
 * where x is the rate by which sold items are considered to be normal.
 * (It defaults to 50.)
 *
 * If changed, this rate will NOT return to default when reseting other rates.
 * Because of this, you must make at least one normal sell rate setting call when using this with old saves.
 *
 * Note that if an item's buying price is set to 0, it will NOT show up in the shops list for purchase.
 * Also, if an item's sell price is 0, it will not be sellable to that shop either.
 */

Window_Base.prototype.price = function (item) {
    var price = item.price || 0;
    if (item.meta.itemGroup) {
        price = price * this.setMulti($gameParty._shopNote, item.meta.itemGroup, false) / 100;
    } else {
        price = price * this.setMulti($gameParty._shopNote, 0, false) / 100;
    }
    price = price * $gameParty._regionSellRate / 100;
    if (price < 0) price = 0;
    return Math.floor(price);
};

Window_ShopBuy.prototype.price = function (item) {
    var price = this._price[this._data.indexOf(item)] || 0;
    if (item.meta.itemGroup) {
        price = price * this.setMulti($gameParty._shopNote, item.meta.itemGroup, true) / 100;
    } else {
        price = price * this.setMulti($gameParty._shopNote, 0, true) / 100;
    }
    price = price * $gameParty._regionBuyRate / 100;
    if (price < 0) price = 0;
    return Math.floor(price);
};

Window_ShopSell.prototype.price = function (item) {
    if (item) {
        var price = item.price || 0;
        if (item.meta.itemGroup) {
            price = price * this.setMulti($gameParty._shopNote, item.meta.itemGroup, false) / 100;
        } else {
            price = price * this.setMulti($gameParty._shopNote, 0, false) / 100;
        }
        price = price * $gameParty._regionSellRate / 100;
        if (price < 0) price = 0;
        return Math.floor(price);
    }
};

Window_ShopBuy.prototype.protoPrice = function (item) {
    var price = item.price || 0;

    if (item.meta.itemGroup) {
        price = price * this.setMulti($gameParty._shopNote, item.meta.itemGroup, true) / 100;
    } else {
        price = price * this.setMulti($gameParty._shopNote, 0, true) / 100;
        console.log(item.name, price);
    }
    price = price * $gameParty._regionBuyRate / 100;
    if (price < 0) price = 0;
    return Math.floor(price);
};

Window_ShopSell.prototype.isEnabled = function (item) {
    return item && this.price(item) > 0;
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
        this._data.push(item);
        this._price.push(goods[2] === 0 ? item.price : goods[3]);
        //}
    }, this);
};

var MalShopPartyInit = Game_Party.prototype.initialize
Game_Party.prototype.initialize = function () {
    MalShopPartyInit.call(this);
    this._shopNote = [];
    this._regionBuyRate = 100;
    this._regionSellRate = 50;
    this._normalSellRate = 50;
    this._shopNote.push('<buysell: ' + 0 + ',' + 100 + ',' + 100 + ',>');
};

Game_Party.prototype.setShopRates = function (x, y, z) {
    if (x == 0) return;
    for (var i = 0; i < this._shopNote.length; ++i) {
        if (this._shopNote[i].indexOf('<buysell: ' + x) > -1) {
            this._shopNote[i] = '<buysell: ' + x + ',' + y + ',' + z + ',>';
            return;
        }
    }
    this._shopNote.push('<buysell: ' + x + ',' + y + ',' + z + ',>');
}

Game_Party.prototype.setNormalSellRate = function (x) {
    this._normalSellRate = x;
}

Game_Party.prototype.resetShopRates = function () {
    this._shopNote = [];
    this._shopNote.push('<buysell: ' + 0 + ',' + 100 + ',' + 100 + ',>');
    this._regionBuyRate = 100;
    this._regionSellRate = this._normalSellRate;
}

Game_Party.prototype.setRegionRate = function (x, y) {
    this._regionBuyRate = x;
    this._regionSellRate = y;
}

Window_ShopBuy.prototype.setMulti = function (note, set, buy) {
    //for buying price
    var num = 100;
    var buy = buy;
    var objele = Number(set);
    var noteread = note;
    for (var i = 0; i < noteread.length; ++i) {
        var notereg = noteread[i].split("<buysell: ");
        var match = notereg[1].split(",");
        var bonuselem = Number(match[0]);
        var bonusvalue1 = Number(match[1]);
        if (isNaN(bonusvalue1)) bonusvalue1 = 100;
        var bonusvalue2 = Number(match[2]);
        if (objele == bonuselem && buy == true) num = bonusvalue1;
    }
    return num;
}

Window_ShopSell.prototype.setMulti = function (note, set, buy) {
    //for selling price
    var num = 100;
    var buy = buy;
    var objele = Number(set);
    var noteread = note;
    for (var i = 0; i < noteread.length; ++i) {
        var notereg = noteread[i].split("<buysell: ");
        var match = notereg[1].split(",");
        var bonuselem = Number(match[0]);
        var bonusvalue1 = Number(match[1]);
        var bonusvalue2 = Number(match[2]);
        if (isNaN(bonusvalue2)) bonusvalue2 = 50;
        if (objele == bonuselem && buy == false) num = bonusvalue2;
    }
    return num;
}

Scene_Shop.prototype.setMulti = function (note, set, buy) {
    //for selling price
    var num = 100;
    var buy = buy;
    var objele = Number(set);
    var noteread = note;
    for (var i = 0; i < noteread.length; ++i) {
        var notereg = noteread[i].split("<buysell: ");
        var match = notereg[1].split(",");
        var bonuselem = Number(match[0]);
        var bonusvalue1 = Number(match[1]);
        var bonusvalue2 = Number(match[2]);
        if (isNaN(bonusvalue2)) bonusvalue2 = 50;
        if (objele == bonuselem && buy == false) num = bonusvalue2;
    }
    return num;
}

Window_Base.prototype.setMulti = function (note, set, buy) {
    //for selling price
    var num = 100;
    var buy = buy;
    var objele = Number(set);
    var noteread = note;
    for (var i = 0; i < noteread.length; ++i) {
        var notereg = noteread[i].split("<buysell: ");
        var match = notereg[1].split(",");
        var bonuselem = Number(match[0]);
        var bonusvalue1 = Number(match[1]);
        var bonusvalue2 = Number(match[2]);
        if (isNaN(bonusvalue2)) bonusvalue2 = 50;
        if (objele == bonuselem && buy == false) num = bonusvalue2;
    }
    return num;
}

Scene_Shop.prototype.sellingPrice = function () {
    if (this._item.meta.itemGroup) {
        return Math.floor(this._item.price * this.setMulti($gameParty._shopNote, this._item.meta.itemGroup, false) / 100 * $gameParty._regionSellRate / 100);
    } else {
        return Math.floor(this._item.price * this.setMulti($gameParty._shopNote, 0, false) / 100 * $gameParty._regionSellRate / 100);
    }
};

Window_Base.prototype.sellingPrice = function (item) {
    if (item.meta.itemGroup) return Math.floor(item.price * this.setMulti($gameParty._shopNote, item.meta.itemGroup, false) / 100 * $gameParty._regionSellRate / 100);
    return Math.floor(item.price * this.setMulti($gameParty._shopNote, 0, false) / 100 * $gameParty._regionSellRate / 100);
};

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
    this.drawText(this.price(item), rect.x + rect.width - priceWidth,
        rect.y, priceWidth, 'right');
    this.changePaintOpacity(true);
};

var MavSceneShopinit = Scene_Shop.prototype.initialize
Scene_Shop.prototype.initialize = function () {
    MavSceneShopinit.call(this);
    this._buysellmode = 0;
};

Window_Base.prototype.drawItemName = function (item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + 2, y + 2);
        if (SceneManager._scene instanceof Scene_Shop) {
            if (SceneManager._scene._buysellmode && SceneManager._scene._buysellmode == 2) {
                if (this.sellingPrice(item) > item.price * $gameParty._normalSellRate / 100) this.changeTextColor(this.powerUpColor());
                if (this.sellingPrice(item) < item.price * $gameParty._normalSellRate / 100) this.changeTextColor(this.powerDownColor());
            }
        }
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        this.resetTextColor();
    }
};

var MalShopBuy = Scene_Shop.prototype.commandBuy;
Scene_Shop.prototype.commandBuy = function () {
    this._buysellmode = 1;
    MalShopBuy.call(this);
};

var MalShopSell = Scene_Shop.prototype.commandSell;
Scene_Shop.prototype.commandSell = function () {
    this._buysellmode = 2;
    MalShopSell.call(this);
};