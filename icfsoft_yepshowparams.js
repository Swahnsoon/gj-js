//=============================================================================
// ICF-Soft Plugins - Patch to show params in Yanfly plugins
// ICFSoft_YEPShowParams.js
//=============================================================================

var Imported = Imported || {};
Imported.ICFSoft_YEPShowParams = true;

var ICF = ICF || {};
ICF.YEPShowParams = ICF.YEPShowParams || {};
ICF.NotetagsProcessor = ICF.NotetagsProcessor || {};

ICF.YEPShowParams.Version = 101; // 1.01

//=============================================================================
 /*:
 * @plugindesc v1.01 This plugin allows you to use ICFSoft Params Core
 * with some Yanfly plugins.
 * @author ICF-Soft [http://icfsoft.blogspot.com.es/]
 *
 * @param General Status Column1
 * @desc Param names that will be shown in status scene in general tab.
 * @default mhp atk def agi 
 *
 * @param General Status Column2
 * @desc Param names that will be shown in status scene in general tab.
 * @default mmp mat mdf luk
 *
 * @param Param Status Column1
 * @desc Param names that will be shown in status scene in params tab.
 * @default atk def mat mdf agi luk
 *
 * @param Param Status Column2
 * @desc Param names that will be shown in status scene in params tab.
 * @default 
 *
 * @param Param Status Column3
 * @desc Param names that will be shown in status scene in params tab.
 * @default 
 *
 * @param Param Status Column4
 * @desc Param names that will be shown in status scene in params tab.
 * @default 
 *
 * @param Equip Column1
 * @desc Param names that will be shown in equip scene.
 * @default mhp mmp atk def mat mdf agi luk
 *
 * @param Equip Column Font Size
 * @desc Font size for params that will be shown in equip scene.
 * @default 28
 *
 * @param Party Column
 * @desc Param names that will be shown in formation scene.
 * @default mhp mmp atk def mat mdf agi luk
 *
 * @param Item Columns
 * @desc Param names that will be shown in item scene.
 * @default mhp mmp atk def mat mdf agi luk
 *
 * @param Shop Item Columns
 * @desc Param names that will be shown in shop scene.
 * @default mhp mmp atk def mat mdf agi luk
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 
 * This plugin allows you to show parameters created with ICFSoft Params Core
 * in some Yanfly plugins.
 * 
 * Actually it works with Yanfly Equip core, Item core, attach augments, Shop
 * menu core, Party system and Status menu core. Must be below all of them.
 * 
 * ============================================================================
 * Incompatibilities
 * ============================================================================
 * 
 * There's no known incompatible plugins yet.
 * 
 * ============================================================================
 * Known isues
 * ============================================================================
 * 
 * Not yet.
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.01:
 * - Added use of ICF-Soft Params Core CParams.
 * - Added option to show params in Row formation menu.
 * - Added option to show params in Status menu panels.
 * - Solved a bug that disallows augments for creatable params.
 * - Solved a bug in Yanfly's attach augments plugin.
 *
 * Version 1.00:
 * - Finished plugin!
 * 
 * ============================================================================
 * 
 * For commercial and non-commercial games.
 * Credit to ICF-Soft.
 * This entire header must be included with plugin.
 * 
 * ============================================================================
*/
//=============================================================================
 /*:es
 * @plugindesc v1.01 Este complemento permite usar los parámetros creados con
 * ICFSoft Params Core en algunos plugins de Yanfly.
 * @author ICF-Soft [http://icfsoft.blogspot.com.es/]
 *
 * @param General Status Column1
 * @desc Parámetros a mostrar en el panel general del menú de estado.
 * @default mhp atk def agi 
 *
 * @param General Status Column2
 * @desc Parámetros a mostrar en el panel general del menú de estado.
 * @default mmp mat mdf luk
 *
 * @param Param Status Column1
 * @desc Parámetros a mostrar en el panel de parámetros del menú de estado.
 * @default atk def mat mdf agi luk
 *
 * @param Param Status Column2
 * @desc Parámetros a mostrar en el panel de parámetros del menú de estado.
 * @default 
 *
 * @param Param Status Column3
 * @desc Parámetros a mostrar en el panel de parámetros del menú de estado.
 * @default 
 *
 * @param Param Status Column4
 * @desc Parámetros a mostrar en el panel de parámetros del menú de estado.
 * @default 
 *
 * @param Equip Column1
 * @desc Parámetros a mostrar en el menú de equipo.
 * @default mhp mmp atk def mat mdf agi luk
 *
 * @param Equip Column Font Size
 * @desc Tamaño de la fuente para los parámetros en el menú de equipo.
 * @default 28
 *
 * @param Party Column
 * @desc Parámetros a mostrar en el menú de formación.
 * @default atk def mat mdf agi luk
 *
 * @param Item Columns
 * @desc Parámetros a mostrar en el menú de objetos.
 * @default mhp mmp atk def mat mdf agi luk
 *
 * @param Shop Item Columns
 * @desc Parámetros a mostrar en la escena de tienda.
 * @default mhp mmp atk def mat mdf agi luk
 *
 * @help
 * ============================================================================
 * Introducción
 * ============================================================================
 * 
 * Este complemento permite mostrar los parámetros creados con ICFSoft Params
 * Core en algunos plugins de Yanfly.
 * 
 * Actualmente funciona con Equip core, Item core, Shop menu core, Attach
 * augments y Status menu core. Debe estar después de todos ellos.
 * 
 * ============================================================================
 * Incompatibilidades
 * ============================================================================
 * 
 * No se conocen complementos que sean incompatibles hasta la fecha.
 * 
 * ============================================================================
 * Problemas conocidos
 * ============================================================================
 * 
 * De momento ninguno.
 * 
 * ============================================================================
 * Historial de versiones
 * ============================================================================
 * 
 * Versión 1.01:
 * - Se ha añadido el uso de los CParams.
 * - Se ha añadido una opción para mostrar parámetros en el menú de formación.
 * - Se han añadido opciones para mostrar parámetros en los paneles del menú
 *   de estado.
 * - Se ha corregido un bug que impedía aplicar mejoras en los diversos
 *   creables parámetros.
 * - Se ha corregido un bug en el plugin attach augments de Yanfly.
 *
 * Versión 1.00:
 * - Complemento terminado.
 * 
 * ============================================================================
 * 
 * Para juegos comerciales y no comerciales.
 * Se debe incluir a ICF-Soft en los créditos.
 * Esta cabecera debe incluirse íntegramente con el plugin.
 * 
 * ============================================================================
*/
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

ICF.Parameters = PluginManager.parameters('ICFSoft_YEPShowParams');
ICF.Param = ICF.Param || {};

ICF.YEPShowParams.eqStatusMenuCol1 = ICF.Parameters['Equip Column1'].toLowerCase().trim().split(/\s+/);
//ICF.YEPShowParams.eqStatusMenuCol2 = ICF.Parameters['Equip Column2'].toLowerCase().trim().split(/\s+/);
ICF.YEPShowParams.eqStatusMenuFont = Number(ICF.Parameters['Equip Column Font Size']);

ICF.YEPShowParams.genStatusMenuCol1 = ICF.Parameters['General Status Column1'].toLowerCase().trim().split(/\s+/);
ICF.YEPShowParams.genStatusMenuCol2 = ICF.Parameters['General Status Column2'].toLowerCase().trim().split(/\s+/);

ICF.YEPShowParams.parStatusMenuCol1 = ICF.Parameters['Param Status Column1'].toLowerCase().trim().split(/\s+/);
ICF.YEPShowParams.parStatusMenuCol2 = ICF.Parameters['Param Status Column2'].toLowerCase().trim().split(/\s+/);
ICF.YEPShowParams.parStatusMenuCol3 = ICF.Parameters['Param Status Column3'].toLowerCase().trim().split(/\s+/);
ICF.YEPShowParams.parStatusMenuCol4 = ICF.Parameters['Param Status Column4'].toLowerCase().trim().split(/\s+/);

ICF.YEPShowParams.itemMenuCol1 = ICF.Parameters['Item Columns'].toLowerCase().trim().split(/\s+/);
ICF.YEPShowParams.shopMenuCol1 = ICF.Parameters['Shop Item Columns'].toLowerCase().trim().split(/\s+/);
ICF.YEPShowParams.partyMenuCol1 = ICF.Parameters['Party Column'].toLowerCase().trim().split(/\s+/);

if (ICF.YEPShowParams.eqStatusMenuCol1[0] == "") ICF.YEPShowParams.eqStatusMenuCol1.shift();
if (ICF.YEPShowParams.itemMenuCol1[0] == "") ICF.YEPShowParams.itemMenuCol1.shift();
if (ICF.YEPShowParams.shopMenuCol1[0] == "") ICF.YEPShowParams.shopMenuCol1.shift();
if (ICF.YEPShowParams.partyMenuCol1[0] == "") ICF.YEPShowParams.partyMenuCol1.shift();
if (ICF.YEPShowParams.genStatusMenuCol1[0] == "") ICF.YEPShowParams.genStatusMenuCol1.shift();
if (ICF.YEPShowParams.genStatusMenuCol2[0] == "") ICF.YEPShowParams.genStatusMenuCol2.shift();
if (ICF.YEPShowParams.parStatusMenuCol1[0] == "") ICF.YEPShowParams.parStatusMenuCol1.shift();
if (ICF.YEPShowParams.parStatusMenuCol2[0] == "") ICF.YEPShowParams.parStatusMenuCol2.shift();
if (ICF.YEPShowParams.parStatusMenuCol3[0] == "") ICF.YEPShowParams.parStatusMenuCol3.shift();
if (ICF.YEPShowParams.parStatusMenuCol4[0] == "") ICF.YEPShowParams.parStatusMenuCol4.shift();

if (!ICF.Param.PParamIsPercent) ICF.Param.PParamIsPercent = [];

if (Imported.YEP_EquipCore) {
//=============================================================================
// Window_StatCompare
//=============================================================================

Window_StatCompare.prototype.lineHeight = function () {

    return ICF.YEPShowParams.eqStatusMenuFont + 8;

};

Window_StatCompare.prototype.refresh = function() {
    this.contents.fontSize = ICF.YEPShowParams.eqStatusMenuFont;
    this.contents.clear();
    if (!this._actor) return;
    for (var i = 0; i < ICF.YEPShowParams.eqStatusMenuCol1.length; ++i) {
        this.drawItem(0, this.lineHeight() * i, ICF.YEPShowParams.eqStatusMenuCol1[i]);
    }
};

Window_StatCompare.prototype.drawItem = function(x, y, paramId) {
    this.drawDarkRect(x, y, this.contents.width, this.lineHeight());
    this.drawParamName(y, paramId);
    this.drawCurrentParam(y, paramId);
    this.drawRightArrow(y);
    if (!this._tempActor) return;
    this.drawNewParam(y, paramId);
    this.drawParamDifference(y, paramId);
};

Window_StatCompare.prototype.drawParamName = function(y, paramId) {
    var x = this.textPadding();
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.param(paramId), x, y, this._paramNameWidth);
};

Window_StatCompare.prototype.drawCurrentParam = function(y, paramId) {
    var x = this.contents.width - this.textPadding();
    x -= this._paramValueWidth * 2 + this._arrowWidth + this._bonusValueWidth;
    this.resetTextColor();
    var actorparam = 0;
    if (ICF.Param.NParams.indexOf(paramId) > -1) {
	var parId = ICF.Param.NParams.indexOf(paramId);
	actorparam = this._actor.NParam(parId);
    } else if (ICF.Param.PParams.indexOf(paramId) > -1) {
	var parId = ICF.Param.PParams.indexOf(paramId);
	actorparam = this._actor.PParam(parId);
    } else if (ICF.Param.CParamsMax.indexOf(paramId) > -1) {
	var parId = ICF.Param.CParamsMax.indexOf(paramId);
	actorparam = this._actor.CParam(parId);
    } else {
	actorparam = this._actor[paramId];
    }
    this.drawText(actorparam, x, y, this._paramValueWidth, 'right');
};

Window_StatCompare.prototype.drawNewParam = function(y, paramId) {
    var x = this.contents.width - this.textPadding();
    x -= this._paramValueWidth + this._bonusValueWidth;
    var newValue = 0;
    var diffvalue = 0;
    if (ICF.Param.NParams.indexOf(paramId) > -1) {
	var parId = ICF.Param.NParams.indexOf(paramId);
	newValue = this._tempActor.NParam(parId);
	diffvalue = newValue - this._actor.NParam(parId);
    } else if (ICF.Param.PParams.indexOf(paramId) > -1) {
	var parId = ICF.Param.PParams.indexOf(paramId);
	newValue = this._tempActor.PParam(parId);
	diffvalue = newValue - this._actor.PParam(parId);
    } else if (ICF.Param.CParamsMax.indexOf(paramId) > -1) {
	var parId = ICF.Param.CParamsMax.indexOf(paramId);
	newValue = this._tempActor.CParam(parId);
	diffvalue = newValue - this._actor.CParam(parId);
    } else {
	newValue = this._tempActor[paramId];
	diffvalue = newValue - this._actor[paramId];
    }
    var actorparam = newValue;
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    this.drawText(actorparam, x, y, this._paramValueWidth, 'right');
};

Window_StatCompare.prototype.drawParamDifference = function(y, paramId) {
    var x = this.contents.width - this.textPadding();
    x -= this._bonusValueWidth;
    var newValue = 0;
    var diffvalue = 0;
    if (ICF.Param.NParams.indexOf(paramId) > -1) {
	var parId = ICF.Param.NParams.indexOf(paramId);
	newValue = this._tempActor.NParam(parId);
	diffvalue = newValue - this._actor.NParam(parId);
    } else if (ICF.Param.PParams.indexOf(paramId) > -1) {
	var parId = ICF.Param.PParams.indexOf(paramId);
	newValue = this._tempActor.PParam(parId);
	diffvalue = newValue - this._actor.PParam(parId);
    } else if (ICF.Param.CParamsMax.indexOf(paramId) > -1) {
	var parId = ICF.Param.CParamsMax.indexOf(paramId);
	newValue = this._tempActor.CParam(parId);
	diffvalue = newValue - this._actor.CParam(parId);
    } else {
	newValue = this._tempActor[paramId];
	diffvalue = newValue - this._actor[paramId];
    }
    if (diffvalue === 0) return;
    var actorparam = newValue;
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    var text = diffvalue;
    if (diffvalue > 0) {
      text = ' (+' + text + ')';
    } else {
      text = ' (' + text + ')';
    }
    this.drawText(text, x, y, this._bonusValueWidth, 'left');
};
};

if (Imported.YEP_PartySystem) {
//=============================================================================
// Window_PartyDetail
//=============================================================================

Window_PartyDetail.prototype.drawDarkRectangles = function() {
    var ww = this.contents.width / 2;
    var wy = this.lineHeight() * 4;
    if (this._linesAvailable >= 7) wy += this.lineHeight();
    if (this._linesAvailable === 4) wy += this.lineHeight();
    var max = this._linesAvailable;
    max = Math.min(this._linesAvailable, this._actor.equipSlots().length);
    for (var i = 0; i < max; ++i) {
      if (wy + this.lineHeight() > this.contents.height) break;
      this.drawDarkRect(ww, wy, ww, this.lineHeight());
      wy += this.lineHeight();
    }
    var wy = this.lineHeight() * 4;
    if (this._linesAvailable >= 7) wy += this.lineHeight();
    if (this._linesAvailable === 4) wy += this.lineHeight();
    for (var i = 0; i < ICF.YEPShowParams.partyMenuCol1.length; ++i) {
      var rect = this.paramRect(i);
      this.drawDarkRect(rect.x, rect.y, rect.width, rect.height);
    }
};

Window_PartyDetail.prototype.drawActorParams = function() {
    this.drawActorParamsTitle();
    for (var i = 0; i < ICF.YEPShowParams.partyMenuCol1.length; ++i) {
      var rect = this.paramRect(i);
      if (this._linesAvailable > 4) {
        rect.x += 8;
        rect.width -= 16;
      } else {
        rect.x += 4;
        rect.width -= 8;
      }
      var paramId = ICF.YEPShowParams.partyMenuCol1[i];
      var text = TextManager.param(paramId);
      this.changeTextColor(this.systemColor());
      this.drawText(text, rect.x, rect.y, rect.width);
      var actorparam = 0;
      if (ICF.Param.NParams.indexOf(paramId) > -1) {
	    var parId = ICF.Param.NParams.indexOf(paramId);
	    actorparam = this._actor.NParam(parId);
      } else if (ICF.Param.PParams.indexOf(paramId) > -1) {
	    var parId = ICF.Param.PParams.indexOf(paramId);
	    actorparam = this._actor.PParam(parId);
      } else if (ICF.Param.CParamsMax.indexOf(paramId) > -1) {
	    var parId = ICF.Param.CParamsMax.indexOf(paramId);
	    actorparam = this._actor.CParam(parId);
      } else {
	    actorparam = this._actor[paramId];
      }
      if (isNaN(actorparam)) actorparam = 0;
      actorparam = Yanfly.Util.toGroup(actorparam);
      this.changeTextColor(this.normalColor());
      this.drawText(actorparam, rect.x, rect.y, rect.width, 'right');
    }
};
};

if (Imported.YEP_ItemCore) {
//=============================================================================
// Window_ShopInfo
//=============================================================================

Window_ItemStatus.prototype.drawEquipInfo = function(item) {
    var rect = new Rectangle();
    if (eval(Yanfly.Param.ItemShowIcon)) {
      rect.width = (this.contents.width - Window_Base._faceWidth) / 2;
    } else {
      rect.width = this.contents.width / 2;
    }
    for (var i = 0; i < ICF.YEPShowParams.itemMenuCol1.length; ++i) {
      rect = this.getRectPosition(rect, i);
      var dx = rect.x + this.textPadding();
      var dw = rect.width - this.textPadding() * 2;
      this.changeTextColor(this.systemColor());
      this.drawText(TextManager.param(ICF.YEPShowParams.itemMenuCol1[i]), dx, rect.y, dw);
      var param = 0;
      if (ICF.Param.NParams.indexOf(ICF.YEPShowParams.itemMenuCol1[i]) > -1) {
	 var parId = ICF.Param.NParams.indexOf(ICF.YEPShowParams.itemMenuCol1[i]);
	 param = item.NParams[parId];
         if (isNaN(param)) param = 0;
	 param += item.traits.reduce(function(r, trait) {
        	if (trait.code == 24 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
      } else if (ICF.Param.PParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.PParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 param = item.PParams[parId];
         if (isNaN(param)) param = 0;
	 param += item.traits.reduce(function(r, trait) {
        	if (trait.code == 25 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
      } else if (ICF.Param.CParamsMax.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.CParamsMax.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 param = item.CParams[parId];
         if (isNaN(param)) param = 0;
	 param += item.traits.reduce(function(r, trait) {
        	if (trait.code == 26 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
      } else if (ICF.Param.BParams.indexOf(ICF.YEPShowParams.itemMenuCol1[i]) > -1) {
	 var parId = ICF.Param.BParams.indexOf(ICF.YEPShowParams.itemMenuCol1[i]);
	 param = item.params[parId];
      }
      if (isNaN(param)) param = 0;
      this.changeTextColor(this.paramchangeTextColor(param));
      var text = param;
      if (param >= 0) text = '+' + text;
      if (text === '+0') this.changePaintOpacity(false);
      this.drawText(text, dx, rect.y, dw, 'right');
      this.changePaintOpacity(true);
    }
};
};

if (Imported.YEP_ShopMenuCore) {
//=============================================================================
// Window_ShopInfo
//=============================================================================

Window_ShopInfo.prototype.drawEquipInfo = function(item) {
    var rect = new Rectangle();
    if (eval(Yanfly.Param.ItemShowIcon)) {
      rect.width = (this.contents.width - Window_Base._faceWidth) / 2;
    } else {
      rect.width = this.contents.width / 2;
    }
    for (var i = 0; i < ICF.YEPShowParams.shopMenuCol1.length; ++i) {
      rect = this.getRectPosition(rect, i);
      var dx = rect.x + this.textPadding();
      var dw = rect.width - this.textPadding() * 2;
      this.changeTextColor(this.systemColor());
      this.drawText(TextManager.param(ICF.YEPShowParams.shopMenuCol1[i]), dx, rect.y, dw);
      var param = 0;
      if (ICF.Param.NParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.NParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 param = item.NParams[parId];
         if (isNaN(param)) param = 0;
	 param += item.traits.reduce(function(r, trait) {
        	if (trait.code == 24 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
      } else if (ICF.Param.PParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.PParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 param = item.PParams[parId];
         if (isNaN(param)) param = 0;
	 param += item.traits.reduce(function(r, trait) {
        	if (trait.code == 25 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
      } else if (ICF.Param.CParamsMax.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.CParamsMax.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 param = item.CParams[parId];
         if (isNaN(param)) param = 0;
	 param += item.traits.reduce(function(r, trait) {
        	if (trait.code == 26 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
      } else if (ICF.Param.BParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.BParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 param = item.params[parId];
      }
      if (isNaN(param)) param = 0;
      this.changeTextColor(this.paramchangeTextColor(param));
      var text = param;
      if (param >= 0) text = '+' + text;
      if (text === '+0') this.changePaintOpacity(false);
      this.drawText(text, dx, rect.y, dw, 'right');
      this.changePaintOpacity(true);
    }
};

//=============================================================================
// Window_ShopStatus
//=============================================================================

Window_ShopStatus.prototype.drawDarkRectEntries = function() {
    for (var i = 0; i < 8; ++i) {
      var rect = this.getRectPosition(i);
      this.drawDarkRect(rect.x, rect.y, rect.width, rect.height);
    }
};

Window_ShopStatus.prototype.drawActorStatInfo = function(actor) {
    this.contents.fontSize = Yanfly.Param.ShopStatFontSize;
    var item1 = this.currentEquippedItem(actor, this._item.etypeId);
    var canEquip = actor.canEquip(this._item);
    for (var i = 0; i < ICF.YEPShowParams.shopMenuCol1.length; ++i) {
      this.changePaintOpacity(true);
      var rect = this.getRectPosition(i);
      rect.x += this.textPadding();
      rect.width -= this.textPadding() * 2;
      this.changeTextColor(this.systemColor());
      var text = TextManager.param(ICF.YEPShowParams.shopMenuCol1[i]);
      this.drawText(text, rect.x, rect.y, rect.width);
      if (!canEquip) this.drawActorCantEquip(actor, rect);
      if (canEquip) this.drawActorChange(actor, rect, item1, i);
    }
    this.changePaintOpacity(true);
};

Window_ShopStatus.prototype.drawActorChange = function(actor, rect, item1, i) {
    var change = 0;
    var param1 = 0;
    var param2 = 0;
    if (ICF.Param.NParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.NParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 if (item1) param1 = (item1.NParams[parId] || 0) + item1.traits.reduce(function(r, trait) {
        	if (trait.code == 24 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
	 param2 = (this._item.NParams[parId] || 0) + this._item.traits.reduce(function(r, trait) {
        	if (trait.code == 24 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
    } else if (ICF.Param.PParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.PParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 if (item1) param1 = (item1.PParams[parId] || 0) + item1.traits.reduce(function(r, trait) {
        	if (trait.code == 25 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
	 param2 = (this._item.PParams[parId] || 0) + this._item.traits.reduce(function(r, trait) {
        	if (trait.code == 25 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
    } else if (ICF.Param.CParamsMax.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.CParamsMax.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 if (item1) param1 = (item1.CParams[parId] || 0) + item1.traits.reduce(function(r, trait) {
        	if (trait.code == 26 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
	 param2 = (this._item.CParams[parId] || 0) + this._item.traits.reduce(function(r, trait) {
        	if (trait.code == 26 && trait.dataId == parId) return r + trait.value;
        	return r;
	 }, 0);
    } else if (ICF.Param.BParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]) > -1) {
	 var parId = ICF.Param.BParams.indexOf(ICF.YEPShowParams.shopMenuCol1[i]);
	 if (item1) param1 = item1.params[parId];
	 param2 = this._item.params[parId];
    }
    if (isNaN(param1)) param1 = 0;
    if (isNaN(param2)) param2 = 0;
    change = param2 - param1;
    this.changePaintOpacity(change !== 0);
    this.changeTextColor(this.paramchangeTextColor(change));
    var text = (change > 0 ? '+' : '') + Yanfly.Util.toGroup(change);
    this.drawText(text, rect.x, rect.y, rect.width, 'right');
};
};

if (Imported.YEP_ItemCore && Imported.YEP_X_AttachAugments) {
//=============================================================================
// ItemManager
//=============================================================================

ItemManager.applyAugmentDebuff = function(mainItem, text, add) {
    if (text.match(/(.*),[ ](\d+)([%%])/i)) {
      var param = String(RegExp.$1);
      var rate = parseFloat(RegExp.$2) * 0.01;
    } else if (text.match(/(.*),[ ]([\+\-]\d+)([%%])/i)) {
      var add = $gameTemp._augmentSetting === 'attach';
      var param = String(RegExp.$1);
      var rate = parseFloat(RegExp.$2) * 0.01;
      rate += 1;
    } else {
      return;
    }
    var PARAM = param.toLowerCase();
    if (ICF.Param.NParams.indexOf(PARAM) > -1) {
      var paramId = ICF.Param.NParams.indexOf(PARAM) + 10;
    } else if (ICF.Param.CParamsMax.indexOf(PARAM) > -1) {
      var paramId = ICF.Param.CParamsMax.indexOf(PARAM) + 200;
    } else if (['MAXHP', 'MHP', 'MAX HP', 'HP'].contains(param)) {
      var paramId = 0;
    } else if (['MAXMP', 'MMP', 'MAX MP', 'MP'].contains(param)) {
      var paramId = 1;
    } else if (['ATK', 'STR'].contains(param)) {
      var paramId = 2;
    } else if (['DEF'].contains(param)) {
      var paramId = 3;
    } else if (['MAT', 'INT', 'SPI'].contains(param)) {
      var paramId = 4;
    } else if (['MDF', 'RES'].contains(param)) {
      var paramId = 5;
    } else if (['AGI', 'SPD'].contains(param)) {
      var paramId = 6;
    } else if (['LUK'].contains(param)) {
      var paramId = 7;
    } else {
      return;
    }
    var code = Game_BattlerBase.TRAIT_DEBUFF_RATE;
    this.adjustItemTrait(mainItem, code, paramId, rate, add);
};

ICF.YEPShowParams.applyAugmentParamRate = ItemManager.applyAugmentParamRate;
ItemManager.applyAugmentParamRate = function(mainItem, param, value) {
    var add = $gameTemp._augmentSetting === 'attach';
    value = parseFloat(value * 0.01);
    var rate = value + 1;
    var PARAM = param.toLowerCase();
    if (ICF.Param.NParams.indexOf(PARAM) > -1) {
	var code = Game_BattlerBase.TRAIT_NPARAM;
	var id = ICF.Param.NParams.indexOf(PARAM) + 100;
	this.adjustItemTrait(mainItem, code, id, rate, add);
    } else if (ICF.Param.PParams.indexOf(PARAM) > -1) {
	var code = Game_BattlerBase.TRAIT_PPARAM;
	var id = ICF.Param.PParams.indexOf(PARAM) + 100;
	this.adjustItemTrait(mainItem, code, id, rate, add);
    } else if (ICF.Param.CParamsMax.indexOf(PARAM) > -1) {
	var code = Game_BattlerBase.TRAIT_CPARAM;
	var id = ICF.Param.CParams.indexOf(PARAM) + 100;
	this.adjustItemTrait(mainItem, code, id, rate, add);
    } else {
	ICF.YEPShowParams.applyAugmentParamRate.call(this, mainItem, param, value);
    }
};

ICF.YEPShowParams.applyAugmentParamPlus = ItemManager.applyAugmentParamPlus;
ItemManager.applyAugmentParamPlus = function(mainItem, param, value) {
    var PARAM = param.toLowerCase();
    if (ICF.Param.NParams.indexOf(PARAM) > -1) {
	var parId = ICF.Param.NParams.indexOf(PARAM);
	if (!mainItem.NParams[parId]) mainItem.NParams[parId] = 0;
	mainItem.NParams[parId] += value;
    } else if (ICF.Param.PParams.indexOf(PARAM) > -1) {
	var parId = ICF.Param.PParams.indexOf(PARAM);
	if (!mainItem.PParams[parId]) mainItem.PParams[parId] = 0;
	mainItem.PParams[parId] += value;
    } else if (ICF.Param.CParamsMax.indexOf(PARAM) > -1) {
	var parId = ICF.Param.CParamsMax.indexOf(PARAM);
	if (!mainItem.CParams[parId]) mainItem.CParams[parId] = 0;
	mainItem.CParams[parId] += value;
    } else {
	ICF.YEPShowParams.applyAugmentParamPlus.call(this, mainItem, param, value);
    }
};
};

if (Imported.YEP_StatusMenuCore) {
//=============================================================================
// Window_StatusInfo
//=============================================================================

Window_StatusInfo.prototype.findParamLimits = function() {
    var params = ICF.YEPShowParams.parStatusMenuCol1.concat(ICF.YEPShowParams.parStatusMenuCol2).concat(ICF.YEPShowParams.parStatusMenuCol3).concat(ICF.YEPShowParams.parStatusMenuCol4);
    this._largestParam = $gameParty.members()[0][params[0]];
    this._smallestParam = this._largestParam;
	for (var i = 0; i < $gameParty.members().length; ++i) {
	    var actor = $gameParty.members()[i];
	    if (!actor) continue;
	    for (var j = 0; j < params.length; ++j) {
		this._largestParam = Math.max(this._largestParam, actor[params[j]]);
		this._smallestParam = Math.min(this._smallestParam, actor[params[j]]);
	    }
	}
};

Window_StatusInfo.prototype.drawGeneralParam = function() {
    var rect = new Rectangle();
    var rect2 = new Rectangle();
    rect.width = (this.contents.width - this.standardPadding()) / 2;
    rect.y = this.lineHeight() * 2;
    rect.height = this.lineHeight();
    var dx = rect.x + this.textPadding();
    var dw = rect.width - this.textPadding() * 2;
    this.drawDarkRect(rect.x, rect.y, rect.width, rect.height);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.level, dx, rect.y, dw, 'left');
    this.changeTextColor(this.normalColor());
    text = Yanfly.Util.toGroup(this._actor.level);
    this.drawText(text, dx, rect.y, dw, 'right');
    if (ICF.YEPShowParams.genStatusMenuCol2.length > 0) {
	rect.width /= 2;
	dw = rect.width - this.textPadding() * 2;
	rect2.x = rect.width + this.textPadding();
	rect2.width = rect.width;
	rect2.y = this.lineHeight() * 2;
	rect2.height = this.lineHeight();
    }
    var a = Math.trunc(dw * 0.25);
    for (var i = 0; i < ICF.YEPShowParams.genStatusMenuCol1.length; i++) {
	rect.y += this.lineHeight();
	this.drawDarkRect(rect.x, rect.y, rect.width, rect.height);
	this.changeTextColor(this.systemColor());
	text = TextManager.param(ICF.YEPShowParams.genStatusMenuCol1[i]);
	this.drawText(text, dx, rect.y, dw - a - 4, 'left');
	this.changeTextColor(this.normalColor());
	text = Yanfly.Util.toGroup(this._actor[ICF.YEPShowParams.genStatusMenuCol1[i]]);
	this.drawText(text, dx + a * 3, rect.y, dw - a * 3, 'right');
    }
    dx = rect.width;
    for (var i = 0; i < ICF.YEPShowParams.genStatusMenuCol2.length; i++) {
	rect2.y += this.lineHeight();
	this.drawDarkRect(dx, rect2.y, rect2.width, rect2.height);
	this.changeTextColor(this.systemColor());
	text = TextManager.param(ICF.YEPShowParams.genStatusMenuCol2[i]);
	this.drawText(text, rect2.x, rect2.y, dw - a - 4, 'left');
	this.changeTextColor(this.normalColor());
	text = Yanfly.Util.toGroup(this._actor[ICF.YEPShowParams.genStatusMenuCol2[i]]);
	this.drawText(text, rect2.x + a * 2, rect2.y, dw - a * 2, 'right');
    }
};

Window_StatusInfo.prototype.drawParameters = function() {
    var dx = 0;
    var dy = this.lineHeight() / 2;
    var dw = this.contents.width;
    var dh = this.lineHeight();
    var dw2;
    var text;
    this.changeTextColor(this.systemColor());
    this.drawText(Yanfly.Param.StatusGraphText, dx, dy, dw, 'center');
    dy = this.lineHeight();
    dx = this.standardPadding();
    dw -= this.standardPadding() * 2;
    if (ICF.YEPShowParams.parStatusMenuCol2.length < 1) {
    } else if (ICF.YEPShowParams.parStatusMenuCol3.length < 1) {
	dw = dw / 2 - this.textPadding();
    } else if (ICF.YEPShowParams.parStatusMenuCol4.length < 1) {
	dw = dw / 3 - this.textPadding();
    } else {
	dw = dw / 4 - this.textPadding();
    }
    for (var i = 0; i < ICF.YEPShowParams.parStatusMenuCol1.length; i++) {
	dy += this.lineHeight();
	var rate = this.drawParamGauge(dx, dy, dw, ICF.YEPShowParams.parStatusMenuCol1[i]);
	this.changeTextColor(this.systemColor());
	text = TextManager.param(ICF.YEPShowParams.parStatusMenuCol1[i]);
	this.drawText(text, dx + 4, dy, dw - 4);
	text = Yanfly.Util.toGroup(this._actor[ICF.YEPShowParams.parStatusMenuCol1[i]]);
	this.changeTextColor(this.normalColor());
	dw2 = dw * rate;
	this.drawText(text, dx, dy, dw2 - 4, 'right');
    }
    if (ICF.YEPShowParams.parStatusMenuCol2.length < 1) return;
    dy = this.lineHeight();
    dx += dw + this.textPadding();
    for (var i = 0; i < ICF.YEPShowParams.parStatusMenuCol2.length; i++) {
	dy += this.lineHeight();
	var rate = this.drawParamGauge(dx, dy, dw, ICF.YEPShowParams.parStatusMenuCol2[i]);
	this.changeTextColor(this.systemColor());
	text = TextManager.param(ICF.YEPShowParams.parStatusMenuCol2[i]);
	this.drawText(text, dx + 4, dy, dw - 4);
	text = Yanfly.Util.toGroup(this._actor[ICF.YEPShowParams.parStatusMenuCol2[i]]);
	this.changeTextColor(this.normalColor());
	dw2 = dw * rate;
	this.drawText(text, dx, dy, dw2 - 4, 'right');
    }
    if (ICF.YEPShowParams.parStatusMenuCol3.length < 1) return;
    dy = this.lineHeight();
    dx += dw + this.textPadding();
    for (var i = 0; i < ICF.YEPShowParams.parStatusMenuCol3.length; i++) {
	dy += this.lineHeight();
	var rate = this.drawParamGauge(dx, dy, dw, ICF.YEPShowParams.parStatusMenuCol3[i]);
	this.changeTextColor(this.systemColor());
	text = TextManager.param(ICF.YEPShowParams.parStatusMenuCol3[i]);
	this.drawText(text, dx + 4, dy, dw - 4);
	text = Yanfly.Util.toGroup(this._actor[ICF.YEPShowParams.parStatusMenuCol3[i]]);
	this.changeTextColor(this.normalColor());
	dw2 = dw * rate;
	this.drawText(text, dx, dy, dw2 - 4, 'right');
    }
    if (ICF.YEPShowParams.parStatusMenuCol4.length < 1) return;
    dy = this.lineHeight();
    dx += dw + this.textPadding();
    for (var i = 0; i < ICF.YEPShowParams.parStatusMenuCol4.length; i++) {
	dy += this.lineHeight();
	var rate = this.drawParamGauge(dx, dy, dw, ICF.YEPShowParams.parStatusMenuCol4[i]);
	this.changeTextColor(this.systemColor());
	text = TextManager.param(ICF.YEPShowParams.parStatusMenuCol4[i]);
	this.drawText(text, dx + 4, dy, dw - 4);
	text = Yanfly.Util.toGroup(this._actor[ICF.YEPShowParams.parStatusMenuCol4[i]]);
	this.changeTextColor(this.normalColor());
	dw2 = dw * rate;
	this.drawText(text, dx, dy, dw2 - 4, 'right');
    }
};

Window_StatusInfo.prototype.drawParamGauge = function(dx, dy, dw, param) {
    var rate = this.calcParamRate(param);
    var array = ["rgba(0,0,0,0)","rgba(0,0,0,0)"];
    if (ICF.Param.NParams.indexOf(param) > -1) {
	var parId = ICF.Param.NParams.indexOf(param);
	array = [ICF.Param.NParamColor1[parId],ICF.Param.NParamColor1[parId]];
    } else if (ICF.Param.PParams.indexOf(param) > -1) {
	var parId = ICF.Param.PParams.indexOf(param);
	array = [ICF.Param.PParamColor1[parId],ICF.Param.PParamColor1[parId]];
    } else if (ICF.Param.CParamsMax.indexOf(param) > -1) {
	var parId = ICF.Param.CParamsMax.indexOf(param);
	array = [ICF.Param.CParamColor1[parId],ICF.Param.CParamColor2[parId]];
    } else if (ICF.Param.BParams.indexOf(param) > -1) {
	var parId = ICF.Param.BParams.indexOf(param);
	array = eval('Yanfly.Param.ColorParam' + parId + 'Gauge').split(' ');
    }
    array[0] = isNaN(array[0])? array[0] : this.textColor(array[0]);
    array[1] = isNaN(array[1])? array[1] : this.textColor(array[1]);
    this.drawGauge(dx, dy, dw, rate, array[0], array[1]);
    return rate;
};

Window_StatusInfo.prototype.calcParamRate = function(paramId) {
    if (this._largestParam === this._smallestParam) return 1.0;
    var rate = parseFloat(this._actor[paramId] - this._smallestParam) / parseFloat(this._largestParam - this._smallestParam);
    rate *= 0.7;
    rate += 0.3;
    return rate;
};

ICF.YEPShowParams.statusInfoDrawAttributeData = Window_StatusInfo.prototype.drawAttributeData;
Window_StatusInfo.prototype.drawAttributeData = function(attr, dx, dy, dw) {
    var actor = this._actor;
    this.contents.fontSize = Yanfly.Param.StatusAttrSize;
    if (ICF.Param.NParams.indexOf(attr) > -1) {
	var parId = ICF.Param.NParams.indexOf(attr);
	this.drawAttributeName(ICF.Param.NParamsFullName[parId], dx, dy, dw);
	this.changeTextColor(this.normalColor());
	this.drawAttributeValue(actor[attr], dx, dy, dw);
    } else if (ICF.Param.PParams.indexOf(attr) > -1) {
	var parId = ICF.Param.PParams.indexOf(attr);
	this.drawAttributeName(ICF.Param.PParamsFullName[parId], dx, dy, dw);
	if (ICF.Param.PParamIsPercent[parId]) {
	    this.drawAttributeRate(actor[attr], dx, dy, dw);
	} else {
	    this.changeTextColor(this.normalColor());
	    this.drawAttributeValue(actor[attr], dx, dy, dw);
	}
    } else if (ICF.Param.CParamsMax.indexOf(attr) > -1) {
	var parId = ICF.Param.CParamsMax.indexOf(attr);
	this.drawAttributeName(ICF.Param.CParamsMaxFullName[parId], dx, dy, dw);
	this.changeTextColor(this.normalColor());
	this.drawAttributeValue(actor[attr], dx, dy, dw);
    } else if (ICF.Param.BParams.indexOf(attr) > -1) {
	var parId = ICF.Param.BParams.indexOf(attr);
	this.drawAttributeName(TextManager.param(attr), dx, dy, dw);
	this.changeTextColor(this.normalColor());
	this.drawAttributeValue(actor[attr], dx, dy, dw);
    } else {
      	ICF.YEPShowParams.statusInfoDrawAttributeData.call(this, attr, dx, dy, dw);
    }
};
};

//=============================================================================
// End of File
//=============================================================================