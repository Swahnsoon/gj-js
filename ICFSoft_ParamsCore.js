//=============================================================================
// ICF-Soft Plugins - Params Core
// ICFSoft_ParamsCore.js
//=============================================================================

var Imported = Imported || {};
Imported.ICFSoft_ParamCore = true;

var ICF = ICF || {};
ICF.ParamCore = ICF.ParamCore || {};
ICF.NotetagsProcessor = ICF.NotetagsProcessor || {};

ICF.ParamCore.Version = 106; // 1.06

//=============================================================================
/*:
* @plugindesc v1.06 This plugin allow to add new full custom params and 
* more basic and x/sparam control.
* @author ICF-Soft [http://icfsoft.blogspot.com.es/]
*
* @param NParams
* @desc New way to add NParams.
* @type struct<NormalParams>[]
* @default ["{\"Name\":\"\",\"Full Name\":\"\",\"Base\":\"30 15\",\"Base Eval\":\"\",\"Limits\":\"(this.isActor())? [0, 999, 1200] : [0, 999, 1200]\",\"Buff Icons\":\"\",\"Debuff Icons\":\"\"}"]
*
* @param PParams
* @desc New way to add PParams.
* @type struct<PlainParams>[]
* @default ["{\"Name\":\"\",\"Full Name\":\"\",\"Base\":\"0\",\"Limits\":\"(this.isActor())? [0, 999] : [0, 999]\"}"]
*
* @param CParams
* @desc New way to add CParams.
* @type struct<CountingParams>[]
* @default ["{\"Name Basic\":\"\",\"Full Name Basic\":\"\",\"Name Counter\":\"\",\"Full Name Counter\":\"\",\"Base\":\"30 15\",\"Base Eval\":\"\",\"Limits\":\"(this.isActor())? [0, 999, 1200] : [0, 999, 1200]\",\"Buff Icons\":\"\",\"Debuff Icons\":\"\"}"]
*
* @param BParam0 Name
* @desc Alias for this basic param. You can to redefine it.
* @default mhp
*
* @param BParam0 Base Eval
* @desc A formula to use instead of default base given in MV.
* Empty to use default.
* @default
*
* @param BParam0 Limits
* @desc Formula for min and max value for this param. See help.
* Hit points
* @default (this.isActor())? [1, 9999, 12000] : [1, 999999, 1200000]
*
* @param BParam1 Name
* @desc Alias for this basic param. You can to redefine it.
* @default mmp
*
* @param BParam1 Base Eval
* @desc A formula to use instead of default base given in MV.
* Empty to use default.
* @default
*
* @param BParam1 Limits
* @desc Formula for min and max value for this param. See help.
* Magic points
* @default (this.isActor())? [0, 9999, 12000] : [0, 9999, 12000]
*
* @param BParam2 Name
* @desc Alias for this basic param. You can to redefine it.
* @default atk
*
* @param BParam2 Base Eval
* @desc A formula to use instead of default base given in MV.
* Empty to use default.
* @default
*
* @param BParam2 Limits
* @desc Formula for min and max value for this param. See help.
* Attack
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam3 Name
* @desc Alias for this basic param. You can to redefine it.
* @default def
*
* @param BParam3 Base Eval
* @desc A formula to use instead of default base given in MV.
* Empty to use default.
* @default
*
* @param BParam3 Limits
* @desc Formula for min and max value for this param. See help.
* Defense
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam4 Name
* @desc Alias for this basic param. You can to redefine it.
* @default mat
*
* @param BParam4 Base Eval
* @desc A formula to use instead of default base given in MV.
* Empty to use default.
* @default
*
* @param BParam4 Limits
* @desc Formula for min and max value for this param. See help.
* Magic attack
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam5 Name
* @desc Alias for this basic param. You can to redefine it.
* @default mdf
*
* @param BParam5 Base Eval
* @desc A formula to use instead of default base given in MV.
* Empty to use default.
* @default
*
* @param BParam5 Limits
* @desc Formula for min and max value for this param. See help.
* Magic defense
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam6 Name
* @desc Alias for this basic param. You can to redefine it.
* @default agi
*
* @param BParam6 Base Eval
* @desc A formula to use instead of default base given in MV.
* Empty to use default.
* @default
*
* @param BParam6 Limits
* @desc Formula for min and max value for this param. See help.
* Agility
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam7 Name
* @desc Alias for this basic param. You can to redefine it.
* @default luk
*
* @param BParam7 Base Eval
* @desc A formula to use instead of default base given in MV.
* Empty to use default.
* @default
*
* @param BParam7 Limits
* @desc Formula for min and max value for this param. See help.
* Luck
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param XParam0 Full Name
* @desc Name that will be shown for this extra param.
* @default Hit rate
*
* @param XParam0 Base
* @desc Formula for base value for x param hit (HIT rate).
* @default 0
*
* @param XParam1 Full Name
* @desc Name that will be shown for this extra param.
* @default Evasion rate
*
* @param XParam1 Base
* @desc Formula for base value for x param eva (EVAsion rate).
* @default 0
*
* @param XParam2 Full Name
* @desc Name that will be shown for this extra param.
* @default Critical rate
*
* @param XParam2 Base
* @desc Formula for base value for x param cri (CRItical rate).
* @default 0
*
* @param XParam3 Full Name
* @desc Name that will be shown for this extra param.
* @default Critical evasion rate
*
* @param XParam3 Base
* @desc Formula for base value for x param cev (Critical Evasion Rate).
* @default 0
*
* @param XParam4 Full Name
* @desc Name that will be shown for this extra param.
* @default Magic evasion rate
*
* @param XParam4 Base
* @desc Formula for base value for x param mev (Magic EVasion rate).
* @default 0
*
* @param XParam5 Full Name
* @desc Name that will be shown for this extra param.
* @default Magic reflection rate
*
* @param XParam5 Base
* @desc Formula for base value for x param mrf (Magic ReFlection rate).
* @default 0
*
* @param XParam6 Full Name
* @desc Name that will be shown for this extra param.
* @default Counter-attack rate
*
* @param XParam6 Base
* @desc Formula for base value for x param cnt (CouNTer attack rate).
* @default 0
*
* @param XParam7 Full Name
* @desc Name that will be shown for this extra param.
* @default Hp-regen rate
*
* @param XParam7 Base
* @desc Formula for base value for x param hrg (Hp ReGeneration rate).
* @default 0
*
* @param XParam8 Full Name
* @desc Name that will be shown for this extra param.
* @default Mp-regen rate
*
* @param XParam8 Base
* @desc Formula for base value for x param mrg (Mp ReGeneration rate).
* @default 0
*
* @param XParam9 Full Name
* @desc Name that will be shown for this extra param.
* @default Tp-regen rate
*
* @param XParam9 Base
* @desc Formula for base value for x param trg (Tp ReGeneration rate).
* @default 0
*
* @param SParam0 Full Name
* @desc Name that will be shown for this special param.
* @default Targeted rate
*
* @param SParam0 Base
* @desc Formula for base value for x param tgr (TarGet Rate).
* @default 1
*
* @param SParam1 Full Name
* @desc Name that will be shown for this special param.
* @default Guard rate
*
* @param SParam1 Base
* @desc Formula for base value for s param grd (GuaRD effect rate).
* @default 1
*
* @param SParam2 Full Name
* @desc Name that will be shown for this special param.
* @default Recovery rate
*
* @param SParam2 Base
* @desc Formula for base value for s param rec (RECovery effect rate).
* @default 1
*
* @param SParam3 Full Name
* @desc Name that will be shown for this special param.
* @default Pharmacology
*
* @param SParam3 Base
* @desc Formula for base value for s param pha (PHArmacology).
* @default 1
*
* @param SParam4 Full Name
* @desc Name that will be shown for this special param.
* @default Mp cost rate
*
* @param SParam4 Base
* @desc Formula for base value for s param mcr (Mp Cost Rate).
* @default 1
*
* @param SParam5 Full Name
* @desc Name that will be shown for this special param.
* @default Tp cost rate
*
* @param SParam5 Base
* @desc Formula for base value for s param tcr (Tp Cost Rate).
* @default 1
*
* @param SParam6 Full Name
* @desc Name that will be shown for this special param.
* @default Phisical damage rate
*
* @param SParam6 Base
* @desc Formula for base value for s param pdr (Physical Damage Rate).
* @default 1
*
* @param SParam7 Full Name
* @desc Name that will be shown for this special param.
* @default Magical damage rate
*
* @param SParam7 Base
* @desc Formula for base value for s param mdr (Magical Damage Rate).
* @default 1
*
* @param SParam8 Full Name
* @desc Name that will be shown for this special param.
* @default Floor damage rate
*
* @param SParam8 Base
* @desc Formula for base value for s param fdr (Floor Damage Rate).
* @default 1
*
* @param SParam9 Full Name
* @desc Name that will be shown for this special param.
* @default Experience rate
*
* @param SParam9 Base
* @desc Formula for base value for s param exr (EXperience Rate).
* @default 1
*
* @param Developer HaltJS
* @desc When true it throws an error if a custom class param/nparam
* javascript doesn't work.   NO - false     YES - true
* @default false
*
* @help
* ============================================================================
* Introduction
* 
* By default there are some fixed types of params, there are usefull but
* have specified purposes and limits the way you can use them.
* 
* With this plugin you can add new params that can be used in your formulas
* and every use you can imagine.
* 
* There are 3 new param types:
*  -New/Normal Params: Level based params like the default ones,
*   with buff/debuff effects and trait modifiers.
*   Plus an option that can be used in some enemy levels plugins.
* 
*  -Plain Params: Non level based params, these work as x/sparams
*   with trait modifiers.
* 
*  -Counting Params: similar to nparams, these work as counters like hp, mp
*   and tp. There are a name for current value and a name for max value.
* 
* Now there are more customization and control for basic, x and s params.
* And a new double cap feature.
* 
* ============================================================================
* How to use
* ============================================================================
* 
* NParams, CParams and PParams are calculated with their respective formulas:
* 
* NParam = (Base + Plus) * Rate * XRate * Buff + Flat + XFlat
* CParam = (Base + Plus) * Rate * XRate * Buff + Flat + XFlat
* PParam = (Base + Plus) * Rate + Flat
* 
*   -Base is different for n and pparams. For NParams is a level based value.
*    For PParam is a fixed value used to emulate x/sparams (0 and 1).
*   -Plus is the sum of all plus traits attached to a battler. In case of
*    NParam there is an extra added by script calls and item effects.
*   -Rate is the product of all trait multipliers attached to a battler.
*   -XRate is the product of all trait x-multipliers attached to a battler.
*   -Buff is de effect of buff/debuff.
*   -Flat is the sum of all flat trais attached to a battler. It isn't affected
*    by any rate.
*   -XFlat is the sum of all x-flat trais attached to a battler. It isn't affected
*    by any rate.
* 
* XRate, XFlat and Buff can make param to pass througth first max cap.
* 
* To make XParams and SParams more customizable I've changed a little
* their formulas:
* 
* Param  = (Base + Plus) * Rate * XRate * Buff + Flat + XFlat
* XParam = (Base + Plus) * Rate + Flat
* SParam = (Base + Plus) * Rate + Flat
* 
* They still work as usual but now you can add traits to have more control.
* 
* To add traits you can use notetags inside data.
* 
* Actors, classes and enemies only:
* 
* <NPARAM: NParam Base Grow HGrow Cap>
* <CPARAM: CParam Base Grow HGrow Cap>
*    -Overrides default NParam/CParam for specified actor/class/enemy.
*     NParam can be referenced by it's name or index.
*     Base is the initial value in level 1.
*     Grow is how much is increased per level. If empty it will be fixed.
*     HGrow is similar to Grow but in an exponential way.
*     Cap is the level at wich NParam stops growing.
*     You can use decimal numbers.
*     
* 
* Weapons and armors only:
* 
* <NPARAM: NParam Value>
* <CPARAM: CParam Value>
* <PPARAM: PParam Value>
*    -Set default N/C/PParam given for specified weapon/armor.
*     NParam can be referenced by it's name or index.
*     
* 
* Actors, classes, enemies, weapons, armors and states:
* 
* <NDEBUFFRATE: NParam Rate>
* <CDEBUFFRATE: CParam Rate>
*    -This is used for nparam/cparam debuff resistance, it's the chance of
*     succes debuff.
*     0.5 means 50% debuff succes, 0.2 is 20% and so on.
* 
* 
* <NPARAMPLUS: NParam Plus>
* <NPARAMRATE: NParam Rate>
* <NPARAMXRATE: NParam XRate>
* <NPARAMFLAT: NParam Flat>
* <NPARAMXFLAT: NParam Flat>
*    -There are plus, rate, xrate and flat modifiers for nparam.
* 
* <CPARAMPLUS: CParam Plus>
* <CPARAMRATE: CParam Rate>
* <CPARAMXRATE: CParam XRate>
* <CPARAMFLAT: CParam Flat>
* <CPARAMXFLAT: CParam Flat>
*    -There are plus, rate, xrate and flat modifiers for cparam.
* 
* <PPARAMPLUS: PParam Plus>
* <PPARAMRATE: PParam Rate>
* <PPARAMFLAT: PParam Flat>
*    -There are plus, rate and flat modifiers for pparam.
* 
* <PARAMPLUS: Param Plus>
* <PARAMRATE: Param Rate>
* <PARAMXRATE: Param XRate>
* <PARAMFLAT: Param Flat>
* <PARAMXFLAT: Param Flat>
* <xPARAMPLUS: XParam Plus>
* <XPARAMRATE: XParam Rate>
* <XPARAMFLAT: XParam Flat>
* <SPARAMPLUS: SParam Plus>
* <SPARAMRATE: SParam Rate>
* <SPARAMFLAT: SParam Flat>
*    -There are plus, rate, xrate and flat modifiers for x and sparam.
*     I have included these to give more control.
* 
* 
* Skills and items only:
* 
* <NBUFF: NParam turns>
* <NDEBUFF: NParam turns>
* <REMOVE NBUFF: NParam>
* <REMOVE NDEBUFF: NParam>
* <CBUFF: CParam turns>
* <CDEBUFF: CParam turns>
* <REMOVE CBUFF: CParam>
* <REMOVE CDEBUFF: CParam>
*    -There are buff/debuff effects to attach to skills and items.
* 
* <NPARAM GROW: NParam amount>
*    -Allow to increase/decrease nparam by a specified amount.
* 
* <PPARAM GROW: PParam amount>
*    -Allow to increase/decrease pparam by a specified amount.
* 
* <CPARAM GROW: CParam amount>
*    -Allow to increase/decrease cparam by a specified amount.
* 
* ============================================================================
* CParam Commands
* ============================================================================
*
* Some commands have been added to control gain/spend/lose quantities of
* specified cparams. There are javascript functions similar to hp, mp and tp.
* 
* gain[cparam](amount)
*    -Gain (or negative to lose) a specified amount of cparam.
*     Substitute [cparam] with name of counter param with first letter in
*     uppercase.
*
* set[cparam](amount)
*    -Set specified cparam to a value.
*     Substitute [cparam] with name of counter param with first letter in
*     uppercase.
*
* [cparam]rate()
*    -Get rate of specified cparam.
*     Substitute [cparam] with name of counter param in lowercase.
* 
* ============================================================================
* Lunatic Mode
* ============================================================================
*
* Knowing javascript you can redefine specific base value for params, nparams
* and cparams for actors, classes and enemies through lunatic mode.
* 
* It also work in notetags:
*
* <CUSTOM NPARAM BASE NPARAM>
* value = 2;
* value += 25;
* </CUSTOM NPARAM BASE>
* 
* <CUSTOM CPARAM BASE CPARAM>
* value = 2;
* value += 25;
* </CUSTOM CPARAM BASE>
* 
* <CUSTOM PARAM BASE PARAM>
* value = base;
* value += 25;
* </CUSTOM PARAM BASE>
* 
* Those params defined will use their formula instead of normal base
* value calculation. You can use javascript between these tags to alter
* the final result.
* Base params also allow to use word 'base' inside formula. It takes the
* value it could have at level 1.
* 
* value - This is the value you want to alter with your own formula.
*         It starts at 0.
* 
* Equipment notetags:
* 
* <CUSTOM NPARAMS>
* javascript
* javascript
* 0 = $gameVariables.value(35)
* int = $gameSwitches.value(12)? 50 : 1
* </CUSTOM NPARAMS>
* 
* <CUSTOM PPARAMS>
* javascript
* javascript
* 0 = $gameVariables.value(35)
* int = $gameSwitches.value(12)? 50 : 1
* </CUSTOM PPARAMS>
* 
* <CUSTOM CPARAMS>
* javascript
* javascript
* 0 = $gameVariables.value(35)
* mbul = $gameSwitches.value(12)? 50 : 1
* </CUSTOM CPARAMS>
* 
* <CUSTOM PARAMS>
* javascript
* javascript
* 0 = $gameVariables.value(35)
* mhp = $gameSwitches.value(12)? 50 : 1
* </CUSTOM PARAMS>
* 
* Add evaluate values for nparams, pparams, cparams and basic params to weapons
* and armors.
* First you use the javascript code that can affect all params. Then you
* Use an identifier that can be a number or param name, an equal and the
* formula that should be evaluated for this equipment piece.
* 
* Example:
* <CUSTOM PARAMS>
* var bonus = this.level;
* var restrict = 5;
* mhp = $gameVariables.value(35) + bonus * 5 - restrict
* mmp = ($gameSwitches.value(12)? 50 : 1) + bonus / restrict
* </CUSTOM PARAMS>
* 
* ============================================================================
* Parameters
* ============================================================================
* 
* You can create up to 100 of each type with indexes from 0 to 99.
* 
* NParam/PParam/Bparam Name: internal name you give to specified nparam,
* pparam and basic param. It will be used in formulas and can be used to
* reference a notetag. Leave empty to skip.
* 
* - Note: Bparams already exist and this param allow to alias or redefine them.
* 
* NParam/PParam/XParam/SParam Full Name: the name you give to specified nparam.
* There are not used here but are usefull for plugins that need this.
* 
* CParam Name / Full Name Basic: name and full name for the parameter that
* represents max value. There are not used here but are usefull for plugins
* that need this.
* 
* CParam Name / Full Name Counter: name and full name for the parameter that
* represents current value. There are not used here but are usefull for plugins
* that need this.
* 
* NParam/PParam Color: a color to represent nparam and pparam for plugins that,
* need it. It can be a number or a html color.
* 
* CParam ColorX: colors for cparam gauge. It can be a number or a html color.
* 
* NParam/CParam Base: the default formula for classes/enemies if they haven't.
* First number is the value at level 1. Second is the amount gained
* each level. Third is a level exponential grow and fourth is the level at
* wich will stop growing.
*
* PParam/XParam/SParam Base: is a base value that allow pparams to emulate
* x/sparams, and give more control for x/sparams. 0 is used for a xparam and 1
* for a sparam. It works as a formula so you can do it param based.
* 
* NParam/CParam/BParam Base Eval: allow to use nparams and bparams as formulas
* like p/x/sparams. If defined this formula will be used instead of default
* mode given in MV for BParams and the default traditional mode for NParams I
* made. It works as a formula so you can do it param based.
* Base params also allow to use word 'base' inside formula. It takes the
* value it could have at level 1.
* 
* NParam/CParam/BParam Limits: the min and max value a param can be. It's used
* now as a formula and needs 3 values.
* First is min, second is normal max and third is X-max.
* By default (this.isActor())? [0, 999, 1200] : [0, 999, 1200]
*
* PParam Limits: same as previous but only uses 2 values (min and max).
* By default (this.isActor())? [0, 999] : [0, 999]
*
* NParam/CParam Buff Icons:
* This is an array of icons separated by spaces. When specified param is
* affected by a positive buff will be shown. Is starts with first and
* use next for each buff stack. If you don't want to use it leave Empty.
*
* NParam/CParam Debuff Icons:
* Same as previous but with debuff stack. Empty to don't use.
*
* Developer HaltJS: This is a development variable usefull to check if there
* is a wrong javascript nparam or basic param.
* When true will throw an error when it found a wrong javascript in lunatic
* mode and tell specified param.
* When false it will be ignored and game continues.
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
* 02.07.2020 22:47(by Tika) - Game_BattlerBase.prototype.NParamRate changed from 
* hardcoded 100 to actual number of NParams
*
* Version 1.06:
* - Added new CParams.
* - Removed obsolete plugin parameters and functions.
* - Minor extra improvements.
* 
* Version 1.05:
* - Evaluable params for equipment.
* - Set nparams for equipment.
* - Expanded lunatic mode to include enemy classes and actors.
* - Allow to grow pparams.
* - Allow default formulas for base params and nparams.
* - Use of 1.5.0 new plugin parameters.
* 
* Version 1.04:
* - Allow ICF-Soft Main Core.
* - Expanded lunatic mode to include enemies.
* - More nparam control.
* 
* Version 1.03:
* - Added XFlat for the double cap.
* - Increased n/pparams to 30.
* - Allow names for x/sparams.
* 
* Version 1.02:
* - Allow to aliasing or redefining MV basic params.
* 
* Version 1.01:
* - Use of ICF-Soft Main Utility.
* - Added lunatic mode for custom params and nparams.
* - Changed how min and max limits work.
* - Added double cap.
* - Added more traits.
* - Use of base params.
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
* @plugindesc v1.06 Este complemento permite añadir nuevos parámetros
* personalizables y mayor control sobre los parámetros del MV.
* @author ICF-Soft [http://icfsoft.blogspot.com.es/]
*
* @param NParams
* @desc Nuevo modo de añadir NParams.
* @type struct<NormalParams>[]
* @default ["{\"Name\":\"\",\"Full Name\":\"\",\"Base\":\"30 15\",\"Base Eval\":\"\",\"Limits\":\"(this.isActor())? [0, 999, 1200] : [0, 999, 1200]\",\"Buff Icons\":\"\",\"Debuff Icons\":\"\"}"]
*
* @param PParams
* @desc Nuevo modo de añadir PParams.
* @type struct<PlainParams>[]
* @default ["{\"Name\":\"\",\"Full Name\":\"\",\"Base\":\"0\",\"Limits\":\"(this.isActor())? [0, 999] : [0, 999]\"}"]
*
* @param CParams
* @desc New way to add CParams.
* @type struct<CountingParams>[]
* @default ["{\"Name Basic\":\"\",\"Full Name Basic\":\"\",\"Name Counter\":\"\",\"Full Name Counter\":\"\",\"Base\":\"30 15\",\"Base Eval\":\"\",\"Limits\":\"(this.isActor())? [0, 999, 1200] : [0, 999, 1200]\",\"Buff Icons\":\"\",\"Debuff Icons\":\"\"}"]
*
* @param BParam0 Name
* @desc Alias para este parámetro. Puedes redefirlo.
* @default mhp
*
* @param BParam0 Base Eval
* @desc Una fórmula para usar en lugar del modo predeterminado del MV.
* En blanco para usar el modo predeterminado.
* @default
*
* @param BParam0 Limits
* @desc Una fórmula para los valores mínimo y máximos. Ver ayuda.
* Vida
* @default (this.isActor())? [1, 9999, 12000] : [1, 999999, 1200000]
*
* @param BParam1 Name
* @desc Alias para este parámetro. Puedes redefirlo.
* @default mmp
*
* @param BParam1 Base Eval
* @desc Una fórmula para usar en lugar del modo predeterminado del MV.
* En blanco para usar el modo predeterminado.
* @default
*
* @param BParam1 Limits
* @desc Una fórmula para los valores mínimo y máximos. Ver ayuda.
* Magia
* @default (this.isActor())? [0, 9999, 12000] : [0, 9999, 12000]
*
* @param BParam2 Name
* @desc Alias para este parámetro. Puedes redefirlo.
* @default atk
*
* @param BParam2 Base Eval
* @desc Una fórmula para usar en lugar del modo predeterminado del MV.
* En blanco para usar el modo predeterminado.
* @default
*
* @param BParam2 Limits
* @desc Una fórmula para los valores mínimo y máximos. Ver ayuda.
* Ataque
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam3 Name
* @desc Alias para este parámetro. Puedes redefirlo.
* @default def
*
* @param BParam3 Base Eval
* @desc Una fórmula para usar en lugar del modo predeterminado del MV.
* En blanco para usar el modo predeterminado.
* @default
*
* @param BParam3 Limits
* @desc Una fórmula para los valores mínimo y máximos. Ver ayuda.
* Defensa
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam4 Name
* @desc Alias para este parámetro. Puedes redefirlo.
* @default mat
*
* @param BParam4 Base Eval
* @desc Una fórmula para usar en lugar del modo predeterminado del MV.
* En blanco para usar el modo predeterminado.
* @default
*
* @param BParam4 Limits
* @desc Una fórmula para los valores mínimo y máximos. Ver ayuda.
* Ataque mágico
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam5 Name
* @desc Alias para este parámetro. Puedes redefirlo.
* @default mdf
*
* @param BParam5 Base Eval
* @desc Una fórmula para usar en lugar del modo predeterminado del MV.
* En blanco para usar el modo predeterminado.
* @default
*
* @param BParam5 Limits
* @desc Una fórmula para los valores mínimo y máximos. Ver ayuda.
* Defensa mágica
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam6 Name
* @desc Alias para este parámetro. Puedes redefirlo.
* @default agi
*
* @param BParam6 Base Eval
* @desc Una fórmula para usar en lugar del modo predeterminado del MV.
* En blanco para usar el modo predeterminado.
* @default
*
* @param BParam6 Limits
* @desc Una fórmula para los valores mínimo y máximos. Ver ayuda.
* Agilidad
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param BParam7 Name
* @desc Alias para este parámetro. Puedes redefirlo.
* @default luk
*
* @param BParam7 Base Eval
* @desc Una fórmula para usar en lugar del modo predeterminado del MV.
* En blanco para usar el modo predeterminado.
* @default
*
* @param BParam7 Limits
* @desc Una fórmula para los valores mínimo y máximos. Ver ayuda.
* Suerte
* @default (this.isActor())? [1, 999, 1200]   : [1, 999, 1200]
*
* @param XParam0 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Puntería
*
* @param XParam0 Base
* @desc Fórmula para el parámetro-x hit (Puntería).
* @default 0
*
* @param XParam1 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Evasión
*
* @param XParam1 Base
* @desc Fórmula para el parámetro-x eva (EVAsión).
* @default 0
*
* @param XParam2 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Probabilidad de crítico
*
* @param XParam2 Base
* @desc Fórmula para el parámetro-x cri (probabilidad de CRÍtico).
* @default 0
*
* @param XParam3 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Evadir crítico
*
* @param XParam3 Base
* @desc Fórmula para el parámetro-x cev (evadir Crítico).
* @default 0
*
* @param XParam4 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Evasión mágica
*
* @param XParam4 Base
* @desc Fórmula para el parámetro-x param mev (evasión Mágica).
* @default 0
*
* @param XParam5 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Reflejo mágico
*
* @param XParam5 Base
* @desc Fórmula para el parámetro-x mrf (reflejar Magia).
* @default 0
*
* @param XParam6 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Contraataque
*
* @param XParam6 Base
* @desc Fórmula para el parámetro-x cnt (CoNTraataque).
* @default 0
*
* @param XParam7 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Regenerar vida
*
* @param XParam7 Base
* @desc Fórmula para el parámetro-x hrg (regeneración de vida).
* @default 0
*
* @param XParam8 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Regenerar magia
*
* @param XParam8 Base
* @desc Fórmula para el parámetro-x mrg (regeneración de magia).
* @default 0
*
* @param XParam9 Full Name
* @desc Nombre mostrado para este parámetro extra.
* @default Regenerar turbo
*
* @param XParam9 Base
* @desc Fórmula para el parámetro-x trg (regeneración de tp).
* @default 0
*
* @param SParam0 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Ser el objetivo
*
* @param SParam0 Base
* @desc Fórmula para el parámetro-s tgr (ser el objetivo).
* @default 1
*
* @param SParam1 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Efecto defensivo
*
* @param SParam1 Base
* @desc Fórmula para el parámetro-s grd (efecto de defensa).
* @default 1
*
* @param SParam2 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Efecto de recuperación
*
* @param SParam2 Base
* @desc Fórmula para el parámetro-s rec (efecto de RECuperación).
* @default 1
*
* @param SParam3 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Farmacología
*
* @param SParam3 Base
* @desc Fórmula para el parámetro-s pha (PHArmacología).
* @default 1
*
* @param SParam4 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Coste de mp
*
* @param SParam4 Base
* @desc Fórmula para el parámetro-s mcr (coste de Mp).
* @default 1
*
* @param SParam5 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Coste de tp
*
* @param SParam5 Base
* @desc Fórmula para el parámetro-s tcr (coste de Tp).
* @default 1
*
* @param SParam6 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Daño físico recibido
*
* @param SParam6 Base
* @desc Fórmula para el parámetro-s pdr (daño físico recibido).
* @default 1
*
* @param SParam7 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Daño mágico recibido
*
* @param SParam7 Base
* @desc Fórmula para el parámetro-s mdr (daño Mágico recibido).
* @default 1
*
* @param SParam8 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Daño por el terreno
*
* @param SParam8 Base
* @desc Fórmula para el parámetro-s fdr (daño por el suelo).
* @default 1
*
* @param SParam9 Full Name
* @desc Nombre mostrado para este parámetro especial.
* @default Experiencia obtenible
*
* @param SParam9 Base
* @desc Fórmula para el parámetro-s exr (EXperiencia obtenida).
* @default 1
*
* @param Developer HaltJS
* @desc Si está activado salta cuando una función personalizada
* da error.   No - false   Si - true
* @default false
*
* @help
* ============================================================================
* Introducción
* ============================================================================
* 
* El RPG Maker MV viene con unos tipos fijos de parámetros, son útiles pero
* tienen sus propósitos específicos y limita el modo en que los puedes usar.
* 
* Coneste complemento puedes añadir nuevos para usarlos en tus fórmulas
* y cualquier uso que puedas imaginar.
* 
* Existen 3 nuevos tipos de parámetros:
*  -Nuevo/Normal Params: Basados en el nivel igual que los que vienen por
*   defecto, con los efectos de fortalecer/debilitar y modificadores.
*   Además de una opción que puede servir en distintos complementos
*   de niveles de enemigos.
* 
*  -Planos Params: No basados en nivel, funcionan como los x/sparams
*   con modificadores.
* 
*  -Contador Params: similares a los nparams, funcionan como contadores como
*   son hp, mp y tp. Usan nombre para valor actual y valor máximo.
*
* Además se ha añadido personalización para los x/sparams que permite mayor
* control.
* Y una nueva característica que permite 2 topes para los params y nparams.
* 
* ============================================================================
* Uso
* ============================================================================
* 
* Los NParams, CParams y PParams son calculados mediante sus respectivas
* fórmulas:
* 
* NParam = (Base + Plus) * Rate * XRate * Buff + Flat + XFlat
* CParam = (Base + Plus) * Rate * XRate * Buff + Flat + XFlat
* PParam = (Base + Plus) * Rate + Flat
* 
*   -Base es distinto entre ambas. Para los NParams está basado en el nivel.
*    Para los PParam el valor es fijo emulando los x/sparams (0 y 1).
*   -Plus es la suma de todas las características plus que atañen al personaje.
*    En el caso de NParam existe un extra añadido mediante llamadas a script
*    y efectos de los objetos.
*   -Rate es el producto de todos los multiplicadores que atañen al personaje.
*   -XRate es el producto de todos los multiplicadores especiales que atañen
*    al personaje.
*   -Buff es el efecto de fortalecer/debilitar.
*   -Flat es la suma de todas las características flat que atañen al personaje.
*    No se ve afectado por los multiplicadores.
*   -XFlat es la suma de todas las características flat especiales que atañen
*    al personaje. No se ve afectado por los multiplicadores.
* 
* 
* XRate, XFlat y Buff permiten ir más allá del primer límite.
* 
* Para hacer los XParams y SParams más personalizables he cambiado un poco
* sus fórmulas:
* 
* Param  = (Base + Plus) * Rate * XRate * Buff + Flat + XFlat
* XParam = (Base + Plus) * Rate + Flat
* SParam = (Base + Plus) * Rate + Flat
* 
* Siguen funcionando como de costumbre pero ahora puedes añadir más
* características para tener un mayor control.
* 
* Para añadir características basta con añadir etiquetas en los cuadros de notas
* respectivos.
* 
* Héroes, clases y enemigos solo:
* 
* <NPARAM: NParam Base Grow HGrow Cap>
* <CPARAM: CParam Base Grow HGrow Cap>
*    -Cambia la base predeterminada del NParam por una específica.
*     NParam se puede referenciar por su nombre o índice.
*     Base es el valor inicial en el nivel 1.
*     Grow es cuanto se incrementa por nivel. Si está vacío cuenta como 0.
*     HGrow es similar a Grow pero de crecimiento exponencial.
*     Cap es el nivel en el cual el NParam deja de subir.
*     Puedes usar números decimales.
*     
* 
* Armas y armaduras solo:
* 
* <NPARAM: NParam Value>
* <CPARAM: CParam Value>
* <PPARAM: PParam Value>
*    -Fija un valor determinado de N/P/CParam para el arma o armadura.
*     Se puede hacer referncia por el nombre o índice.
*     
* 
* Héroes, clases, enemigos, armas, armaduras y estados alterados:
* 
* <NDEBUFFRATE: NParam Rate>
* <CDEBUFFRATE: CParam Rate>
*    -Se usa para la resistencia al debilitamiento en dicho nparam
*     o cparam, básicamente es la probabilidad de acierto.
*     0.5 significa 50% acierto, 0.2 es 20%, etc.
* 
* 
* <NPARAMPLUS: NParam Plus>
* <NPARAMRATE: NParam Rate>
* <NPARAMXRATE: NParam XRate>
* <NPARAMFLAT: NParam Flat>
* <NPARAMXFLAT: NParam XFlat>
*    -Modificadores para el nparam.
* 
* <PPARAMPLUS: PParam Plus>
* <PPARAMRATE: PParam Rate>
* <PPARAMFLAT: PParam Flat>
*    -Modificadores para el pparam.
* 
* <CPARAMPLUS: CParam Plus>
* <CPARAMRATE: CParam Rate>
* <CPARAMXRATE: CParam XRate>
* <CPARAMFLAT: CParam Flat>
* <CPARAMXFLAT: CParam Flat>
*    -Modificadores para el cparam.
* 
* <PARAMPLUS: Param Plus>
* <PARAMRATE: Param Rate>
* <PARAMXRATE: Param XRate>
* <PARAMFLAT: Param Flat>
* <PARAMXFLAT: Param XFlat>
* <xPARAMPLUS: XParam Plus>
* <XPARAMRATE: XParam Rate>
* <XPARAMFLAT: XParam Flat>
* <SPARAMPLUS: SParam Plus>
* <SPARAMRATE: SParam Rate>
* <SPARAMFLAT: SParam Flat>
*    -Modificadores para los parámetros básicos, x e y.
*     Los he incluido para dar más control.
* 
* 
* Habilidades y objetos solo:
* 
* <NBUFF: NParam turnos>
* <NDEBUFF: NParam turnos>
* <REMOVE NBUFF: NParam>
* <REMOVE NDEBUFF: NParam>
* <CBUFF: CParam turnos>
* <CDEBUFF: CParam turnos>
* <REMOVE CBUFF: CParam>
* <REMOVE CDEBUFF: CParam>
*    -Efectos de añadir y quitar fortalecimiento/debilitamiento.
* 
* <NPARAM GROW: NParam amount>
*    -Permite incrementar/decrementar el nparam una cantidad específica.
* 
* <PPARAM GROW: PParam amount>
*    -Permite incrementar/decrementar el pparam una cantidad específica.
* 
* <CPARAM GROW: CParam amount>
*    -Permite incrementar/decrementar el cparam una cantidad específica.
* 
* ============================================================================
* Comandos de CParam
* ============================================================================
*
* Se han añadido controles para el uso/gasto/pérdida de cantidades de un
* cparam específico. Se trata de funciones en javascript similares a las de
* hp, mp y tp.
* 
* gain[cparam](amount)
*    -Incrementar (o gastar si es negativo) una cantidad específica del cparam.
*     Sustituir [cparam] con el nombre del contador con la primera letra en
*     mayúsculas.
*
* set[cparam](amount)
*    -Fija el valor de un cparam.
*     Sustituir [cparam] con el nombre del contador con la primera letra en
*     mayúsculas.
*
* [cparam]rate()
*    -Obtener el ratio (desde 0 para 0% hasta 1 para 100%) del cparam.
*     Sustituir [cparam] con el nombre del contador en minúsculas.
* 
* ============================================================================
* Lunatic Mode
* ============================================================================
*
* Para aquellos que quieren utilizar un modo personalizado para calcular
* los parámetros he añadido el modo lunático.
* El modo lunático permite utilizar código javascript diréctamente.
* 
* Usa las siguientes etiquetas en las clases y enemigos:
*
* <CUSTOM NPARAM BASE NPARAM>
* value = 2;
* value += 25;
* </CUSTOM NPARAM BASE>
* 
* <CUSTOM CPARAM BASE CPARAM>
* value = 2;
* value += 25;
* </CUSTOM CPARAM BASE>
* 
* <CUSTOM PARAM BASE PARAM>
* value = base;
* value += 25;
* </CUSTOM PARAM BASE>
* 
* Dicho código se ejecutará en lugar de la fórmula predeterminada.
* Los parámetros básicos además permiten usar la variable 'base' dentro de su
* fórmula. Equivale al valor que tendría en el nivel 1.
* 
* value - Esta es la variable donde se almacena el resultado.
*         Si no se especifica será 0.
* 
* Etiquetas para equipamiento:
* 
* <CUSTOM NPARAMS>
* javascript
* javascript
* 0 = $gameVariables.value(35)
* int = $gameSwitches.value(12)? 50 : 1
* </CUSTOM NPARAMS>
* 
* <CUSTOM PPARAMS>
* javascript
* javascript
* 0 = $gameVariables.value(35)
* int = $gameSwitches.value(12)? 50 : 1
* </CUSTOM PPARAMS>
* 
* <CUSTOM CPARAMS>
* javascript
* javascript
* 0 = $gameVariables.value(35)
* mbul = $gameSwitches.value(12)? 50 : 1
* </CUSTOM CPARAMS>
* 
* <CUSTOM PARAMS>
* javascript
* javascript
* 0 = $gameVariables.value(35)
* mhp = $gameSwitches.value(12)? 50 : 1
* </CUSTOM PARAMS>
* 
* Añade valores evaluables para nparams, pparams, cparams y params básicos
* a armas y armaduras.
* Primero se añade código javascript que afecta todos los parámetros de su
* tipo. Después se utiliza un identificador que puede ser un número o el
* nombre del parámetro, un igual y la fórmula que se va a evaluar.
* 
* Ejemplo:
* <CUSTOM PARAMS>
* var bonus = this.level;
* var restrict = 5;
* mhp = $gameVariables.value(35) + bonus * 5 - restrict
* mmp = ($gameSwitches.value(12)? 50 : 1) + bonus / restrict
* </CUSTOM PARAMS>
* 
* ============================================================================
* Parámetros
* ============================================================================
* 
* Puedes crear hasta 100 parámetros de cada tipo con índices del 0 al 99.
* 
* NParam/PParam/Bparam Name: el nombre interno que le vas a dar al parámetro.
* Se utilizará en fórmulas y se puede usar como referencia en las etiquetas en
* las notas. Dejar vacío si no se quiere usar.
* 
* - Nota: Los bparams existen de por sí pero se pueden redefinir.
* 
* NParam/PParam/XParam/SParam Full Name: el nombre que quieres dar al nparam.
* Por el momento no se usa aquí pero sirve para los plugins que usen este.
* 
* CParam Name / Full Name Basic: nombre y nombre a mostrar para el parámetro
* que representa el valor máximo. Por el momento no se usa aquí pero sirve para
* los plugins que usen este.
* 
* CParam Name / Full Name Counter: nombre y nombre a mostrar para el parámetro
* que representa el valor actual. Por el momento no se usa aquí pero sirve para
* los plugins que usen este.
* 
* NParam/PParam Color: un color para representar nparam y pparam para plugins
* que lo necesiten. Puede ser un número o un color html.
* 
* CParam ColorX: colores para la barra de medición del cparam. Puede ser un
* número o un color html.
* 
* NParam/CParam Base: la fórmula predeterminada para clases y enemigos que no
* tengan. El primer númber es el valor en el nivel 1. El segundo es cuanto sube
* cada nivel. El tercero es de crecimiento exponencial y el cuarto es el nivel
* en el cual va a dejar de subir.
*
* PParam/XParam/SParam Base: es un valor básico con el que los pparam pueden
* emular los x/sparams, y dar más control a los x/sparams mediante fórmulas.
* 0 suele ser el valor de un xparam y 1 el de un sparam.
* 
* NParam/CParam/BParam Base Eval: permite el uso de formulas para los nparams y
* bparams, al igual que los p/x/sparams. Si se define una fórmula se utilizará
* en lugar del modo predeterminado del MV para los BParams o del modo
* tradicional de los NParams.
* Los parámetros básicos además permiten usar la variable 'base' dentro de su
* fórmula. Equivale al valor que tendría en el nivel 1.
* 
* NParam/CParam/BParam Limits: los valores mínimo y máximo que puede tener el
* nparam, cparam o param. Ahora se utiliza como fórmula que da 3 valores.
* El primero es el mínimo, el segundo es máximo normal y el tercero es
* el extra máximo.
* (this.isActor())? [0, 999, 1200] : [0, 999, 1200]
*
* PParam Limits: igual que el anterior pero solo usa 2 valores (mínimo y máximo).
* (this.isActor())? [0, 999] : [0, 999]
*
* NParam/CParam Buff Icons: conjunto de iconos separados por espacios.
* Cuando dicho parámetro se vea afectado por un fortalecimiento se mostrará
* el icono correspondiente al fortalecimiento acumulado.
* Si se deja en blanco no se usará.
*
* NParam/CParam Debuff Icons: igual que el anterior pero para los
* debilitamientos del parámetro.
* 
* Developer HaltJS: Esta es una variable de uso durante el desarrollo del juego
* útil cuando quieres comprobar si hay alguna función personalizada incorrecta.
* Cuando está activado al encontrar un error el juego se para y muestra
* en qué parámetro se encuentra el error.
* Cuando está desactivado ignora el error y el juego continúa.
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
* Por el momento ninguno.
* 
* ============================================================================
* Historial de versiones
* ============================================================================
* 
* Versión 1.06:
* - Se han añadido los CParams.
* - Se han eliminado funciones y parámetros obsoletos.
* - Pequeñas mejoras.
* 
* Versión 1.05:
* - Se han añadido parámetros evaluables para el equipamiento.
* - Se ha añadido el uso de nparams en el equipamiento.
* - Se ha expandido el modo lunático para incluir a los personajes y classes
*   para enemigos.
* - Permite el crecimiento de los pparams.
* - Permite fórmulas personalizadas para los parámetros básicos y los nparams.
* - Uso del sistema de parámetros del 1.5.0.
* 
* Versión 1.04:
* - Permite el ICF-Soft Main Core.
* - Se ha expandido el modo lunático para afectar enemigos.
* - Mayor control para los nparams.
* 
* Versión 1.03:
* - Se ha añadido el modificador XFlat para el doble máximo.
* - Se ha subido la cantidad de n/pparams a 30.
* - Permite nombrar los parámetros especiales y extra.
* 
* Versión 1.02:
* - Permite añadir alias o redefinir los parámetros básicos.
* 
* Versión 1.01:
* - Se empieza a utilizar el ICF-Soft Main Utility.
* - Se ha añadido el modo lunático para params y nparams.
* - Se ha cambiado el cómo funcionan los límites mínimo y máximo.
* - Se ha añadido el doble máximo.
* - Se han añadido más características.
* - Se pueden usar los base params.
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
/*~struct~NormalParams:
 * @param Name
 * @desc Name for this new param in lowercase without spaces. Empty to skip.
 * @default
 *
 * @param Full Name
 * @desc Name that will be shown for this new param.
 * @default
 *
 * @param Base
 * @desc How this new param is configured by default. See help.
 * @default 30 15
 *
 * @param Base Eval
 * @desc A formula to use instead of base.
 * @default
 *
 * @param Color
 * @desc A color for param. Can be a html code or a number.
 * @default
 *
 * @param Limits
 * @desc Formula for min and max value for this new param. See help.
 * @default (this.isActor())? [0, 999, 1200] : [0, 999, 1200]
 *
 * @param Buff Icons
 * @desc Icons for each buff stack. Empty to don't use. See help.
 * @default
 *
 * @param Debuff Icons
 * @desc Icons for each debuff stack. Empty to don't use. See help.
 * @default
 *
 */
/*~struct~PlainParams:
 * @param Name
 * @desc Name for this plain param in lowercase without spaces. Empty to skip.
 * @default
 *
 * @param Full Name
 * @desc Name that will be shown for this plain param.
 * @default
 *
 * @param Base
 * @desc How this plain param is configured by default. See help.
 * @default 0
 *
 * @param Color
 * @desc A color for param. Can be a html code or a number.
 * @default
 *
 * @param Limits
 * @desc Formula for min and max value for this plain param. See help.
 * @default (this.isActor())? [0, 999] : [0, 999]
 *
 */
/*~struct~CountingParams:
 * @param Name Basic
 * @desc Name for this count param in lowercase without spaces. Empty to skip.
 * @default
 *
 * @param Full Name Basic
 * @desc Name that will be shown for this count param.
 * @default
 *
 * @param Name Counter
 * @desc Name for current value param in lowercase without spaces. Empty to skip.
 * @default
 *
 * @param Full Name Counter
 * @desc Name that will be shown for current value param.
 * @default
 *
 * @param Base
 * @desc How this count param max value is configured by default. See help.
 * @default 30 15
 *
 * @param Base Eval
 * @desc A formula to use instead of base.
 * @default
 *
 * @param Color1
 * @desc First color for gauge. Can be a html code or a number.
 * @default
 *
 * @param Color2
 * @desc Second color for gauge. Can be a html code or a number.
 * @default
 *
 * @param Limits
 * @desc Formula for min and max value for this count param. See help.
 * @default (this.isActor())? [0, 999, 1200] : [0, 999, 1200]
 *
 * @param Buff Icons
 * @desc Icons for each buff stack. Empty to don't use. See help.
 * @default
 *
 * @param Debuff Icons
 * @desc Icons for each debuff stack. Empty to don't use. See help.
 * @default
 *
 */
/*~struct~NormalParams:es
 * @param Name
 * @desc Nombre para este nuevo parámetro en minúsculas. Vacío para saltar.
 * @default
 *
 * @param Full Name
 * @desc Nombre mostrado para este nuevo parámetro.
 * @default
 *
 * @param Base
 * @desc Modo predeterminado de configuración. Ver ayuda.
 * @default 30 15
 *
 * @param Base Eval
 * @desc Una fórmula para usar en lugar del modo predeterminado.
 * @default
 *
 * @param Color
 * @desc Un color para representar el parámetro. Se puede usar un color html o un número.
 * @default
 *
 * @param Limits
 * @desc Una fórmula para los valores mínimo y máximos para este
 * nuevo parámetro. Ver ayuda.
 * @default (this.isActor())? [0, 999, 1200] : [0, 999, 1200]
 *
 * @param Buff Icons
 * @desc Iconos a mostrar para cada valor de fortalecimiento.
 * Vacío no usar ninguno. Ver ayuda.
 * @default
 *
 * @param Debuff Icons
 * @desc Iconos a mostrar para cada valor de debilitamiento.
 * Vacío no usar ninguno. Ver ayuda.
 * @default
 *
 */
/*~struct~PlainParams:es
 * @param Name
 * @desc Nombre para este parámetro plano en minúsculas. Vacío para saltar.
 * @default
 *
 * @param Full Name
 * @desc Nombre para mostrar para este parámetro plano.
 * @default
 *
 * @param Base
 * @desc Fórmula para calcular el Valor básico de este parámetro plano.
 * @default 0
 *
 * @param Color
 * @desc Un color para representar el parámetro. Se puede usar un color html o un número.
 * @default
 *
 * @param Limits
 * @desc Una fórmula para los valores mínimo y máximos para este
 * parámetro plano. Ver ayuda.
 * @default (this.isActor())? [0, 999] : [0, 999]
 *
 */
/*~struct~CountingParams:es
 * @param Name Basic
 * @desc Nombre para este parámetro máximo en minúsculas. Vacío para saltar.
 * @default
 *
 * @param Full Name Basic
 * @desc Nombre para mostrar para este parámetro máximo.
 * @default
 *
 * @param Name Counter
 * @desc Nombre para este parámetro contador en minúsculas. Vacío para saltar.
 * @default
 *
 * @param Full Name Counter
 * @desc Nombre para mostrar para este parámetro contador.
 * @default
 *
 * @param Base
 * @desc Modo predeterminado de configuración. Ver ayuda.
 * @default 30 15
 *
 * @param Base Eval
 * @desc Una fórmula para usar en lugar del modo predeterminado.
 * @default
 *
 * @param Color1
 * @desc Primer color de la barra. Se puede usar un color html o un número.
 * @default
 *
 * @param Color2
 * @desc Segundo color de la barra. Se puede usar un color html o un número.
 * @default
 *
 * @param Limits
 * @desc Una fórmula para los valores mínimo y máximos para este
 * nuevo parámetro. Ver ayuda.
 * @default (this.isActor())? [0, 999, 1200] : [0, 999, 1200]
 *
 * @param Buff Icons
 * @desc Iconos a mostrar para cada valor de fortalecimiento.
 * Vacío no usar ninguno. Ver ayuda.
 * @default
 *
 * @param Debuff Icons
 * @desc Iconos a mostrar para cada valor de debilitamiento.
 * Vacío no usar ninguno. Ver ayuda.
 * @default
 *
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

ICF.Parameters = PluginManager.parameters('ICFSoft_ParamsCore');
ICF.Param = ICF.Param || {};

ICF.Param.NParams = [];
ICF.Param.NParamsFullName = [];
ICF.Param.NParamBase = [];
ICF.Param.NParamLimit = [];
ICF.Param.NParamBuffIcons = [];
ICF.Param.NParamDebuffIcons = [];
ICF.Param.NParamColor = [];
ICF.Param.PParams = [];
ICF.Param.PParamsFullName = [];
ICF.Param.PParamBase = [];
ICF.Param.PParamLimit = [];
ICF.Param.PParamColor = [];
ICF.Param.CParams = [];
ICF.Param.CParamsFullName = [];
ICF.Param.CParamsMax = [];
ICF.Param.CParamsMaxFullName = [];
ICF.Param.CParamBase = [];
ICF.Param.CParamLimit = [];
ICF.Param.CParamBuffIcons = [];
ICF.Param.CParamDebuffIcons = [];
ICF.Param.CParamColor1 = [];
ICF.Param.CParamColor2 = [];
ICF.Param.BParamLimit = [];
ICF.Param.BParamBase = [];
ICF.Param.XParamsFullName = [];
ICF.Param.XParamBase = [];
ICF.Param.SParamsFullName = [];
ICF.Param.SParamBase = [];

ICF.Param.BParams = ["mhp", "mmp", "atk", "def", "mat", "mdf", "agi", "luk"];
ICF.Param.XParams = ["hit", "eva", "cri", "cev", "mev", "mrf", "cnt", "hrg", "mrg", "trg"];
ICF.Param.SParams = ["tgr", "grd", "rec", "pha", "mcr", "tcr", "pdr", "mdr", "fdr", "exr"];

ICF.temp = JSON.parse(ICF.Parameters['NParams']);
for (var i = 0; i < ICF.temp.length; i++) {
	ICF.temp[i] = JSON.parse(ICF.temp[i]);
	ICF.Param.NParams[i] = ICF.temp[i]['Name'];
	ICF.Param.NParamsFullName[i] = ICF.temp[i]['Full Name'];
	ICF.Param.NParamBase[i] = ICF.temp[i]['Base'].split(/\s+/).leaveNumbers();
	if (ICF.temp[i]['Base Eval'].trim().length > 0) ICF.Param.NParamBase[i] = ICF.temp[i]['Base Eval'];
	ICF.Param.NParamLimit[i] = ICF.temp[i]['Limits'];
	ICF.Param.NParamBuffIcons[i] = ICF.temp[i]['Buff Icons'].split(/\s+/).leaveNumbers();
	ICF.Param.NParamDebuffIcons[i] = ICF.temp[i]['Debuff Icons'].split(/\s+/).leaveNumbers();
	ICF.Param.NParamColor[i] = isNaN(ICF.temp[i]['Color']) ? ICF.temp[i]['Color'] : Number(ICF.temp[i]['Color']);
}
ICF.temp = JSON.parse(ICF.Parameters['PParams']);
for (var i = 0; i < ICF.temp.length; i++) {
	ICF.temp[i] = JSON.parse(ICF.temp[i]);
	ICF.Param.PParams[i] = ICF.temp[i]['Name'];
	ICF.Param.PParamsFullName[i] = ICF.temp[i]['Full Name'];
	ICF.Param.PParamBase[i] = ICF.temp[i]['Base'];
	ICF.Param.PParamLimit[i] = ICF.temp[i]['Limits'];
	ICF.Param.PParamColor[i] = isNaN(ICF.temp[i]['Color']) ? ICF.temp[i]['Color'] : Number(ICF.temp[i]['Color']);
}

ICF.temp = JSON.parse(ICF.Parameters['CParams']);
for (var i = 0; i < ICF.temp.length; i++) {
	ICF.temp[i] = JSON.parse(ICF.temp[i]);
	ICF.Param.CParamsMax[i] = ICF.temp[i]['Name Basic'];
	ICF.Param.CParamsMaxFullName[i] = ICF.temp[i]['Full Name Basic'];
	ICF.Param.CParams[i] = ICF.temp[i]['Name Counter'];
	ICF.Param.CParamsFullName[i] = ICF.temp[i]['Full Name Counter'];
	ICF.Param.CParamBase[i] = ICF.temp[i]['Base'].split(/\s+/).leaveNumbers();
	if (ICF.temp[i]['Base Eval'].trim().length > 0) ICF.Param.CParamBase[i] = ICF.temp[i]['Base Eval'];
	ICF.Param.CParamLimit[i] = ICF.temp[i]['Limits'];
	ICF.Param.CParamBuffIcons[i] = ICF.temp[i]['Buff Icons'].split(/\s+/).leaveNumbers();
	ICF.Param.CParamDebuffIcons[i] = ICF.temp[i]['Debuff Icons'].split(/\s+/).leaveNumbers();
	ICF.Param.CParamColor1[i] = isNaN(ICF.temp[i]['Color1']) ? ICF.temp[i]['Color1'] : Number(ICF.temp[i]['Color1']);
	ICF.Param.CParamColor2[i] = isNaN(ICF.temp[i]['Color2']) ? ICF.temp[i]['Color2'] : Number(ICF.temp[i]['Color2']);
}

for (var i = 0; i < 10; i++) {
	ICF.Param.XParamsFullName[i] = String(ICF.Parameters['XParam' + i + ' Full Name']);
	ICF.Param.XParamBase[i] = String(ICF.Parameters['XParam' + i + ' Base']);
	ICF.Param.SParamsFullName[i] = String(ICF.Parameters['SParam' + i + ' Full Name']);
	ICF.Param.SParamBase[i] = String(ICF.Parameters['SParam' + i + ' Base']);
}

for (var i = 0; i < 8; i++) {
	ICF.Param.BParams[i] = String(ICF.Parameters['BParam' + i + ' Name']);
	ICF.Param.BParamBase[i] = String(ICF.Parameters['BParam' + i + ' Base Eval']).trim();
	ICF.Param.BParamLimit[i] = String(ICF.Parameters['BParam' + i + ' Limits']);
}

ICF.Param.ParamCoreHalt = ICF.Parameters['Developer HaltJS'].toLowerCase() === "true";

if (!Imported.ICFSoft_MainUtility) { throw new Error('This plugin requires ICF-Soft Main Utility plugin version 1.01 to work.\nYou can download it at icfsoft.blogspot.com inside plugins section.'); }
if (ICF.MainUtility.Version < 101) { throw new Error('This plugin requires ICF-Soft Main Utility plugin version 1.01 to work.\nYou can download it at icfsoft.blogspot.com inside plugins section.'); }

//=============================================================================
// Constants
//=============================================================================

Game_BattlerBase.TRAIT_NPARAM = 24;
Game_BattlerBase.TRAIT_PPARAM = 25;
Game_BattlerBase.TRAIT_CPARAM = 26;
Game_BattlerBase.TRAIT_TPPARAM = 27;
Game_Action.EFFECT_ADD_NBUFF = 35;
Game_Action.EFFECT_ADD_NDEBUFF = 36;
Game_Action.EFFECT_REMOVE_NBUFF = 37;
Game_Action.EFFECT_REMOVE_NDEBUFF = 38;
Game_Action.EFFECT_NGROW = 45;
Game_Action.EFFECT_PGROW = 46;
Game_Action.EFFECT_CGROW = 47;

//=============================================================================
// TextManager
//=============================================================================

ICF.ParamCore.TextManager_param = TextManager.param;
TextManager.param = function (paramId) {
	if (ICF.Param.NParams.indexOf(paramId) > -1) {
		var parId = ICF.Param.NParams.indexOf(paramId);
		return ICF.Param.NParamsFullName[parId];
	} else if (ICF.Param.PParams.indexOf(paramId) > -1) {
		var parId = ICF.Param.PParams.indexOf(paramId);
		return ICF.Param.PParamsFullName[parId];
	} else if (ICF.Param.CParams.indexOf(paramId) > -1) {
		var parId = ICF.Param.CParams.indexOf(paramId);
		return ICF.Param.CParamsFullName[parId];
	} else if (ICF.Param.CParamsMax.indexOf(paramId) > -1) {
		var parId = ICF.Param.CParamsMax.indexOf(paramId);
		return ICF.Param.CParamsMaxFullName[parId];
	} else if (ICF.Param.BParams.indexOf(paramId) > -1) {
		var parId = ICF.Param.BParams.indexOf(paramId);
		return ICF.ParamCore.TextManager_param.call(this, parId);
	} else if (ICF.Param.XParams.indexOf(paramId) > -1) {
		var parId = ICF.Param.XParams.indexOf(paramId);
		return ICF.Param.XParamsFullName[parId];
	} else if (ICF.Param.SParams.indexOf(paramId) > -1) {
		var parId = ICF.Param.SParams.indexOf(paramId);
		return ICF.Param.SParamsFullName[parId];
	} else {
		return ICF.ParamCore.TextManager_param.call(this, paramId);
	}
};

//=============================================================================
// DataManager
//=============================================================================

ICF.ParamCore.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
	if (!ICF.ParamCore.DataManager_isDatabaseLoaded.call(this)) return false;
	if (!ICF.ParamCore.Procesed) {
		ICF.NotetagsProcessor.ParamCoreB($dataActors);
		ICF.NotetagsProcessor.ParamCoreB($dataClasses);
		ICF.NotetagsProcessor.ParamCoreB($dataEnemies);
		ICF.NotetagsProcessor.ParamCoreC($dataWeapons);
		ICF.NotetagsProcessor.ParamCoreC($dataArmors);
		ICF.NotetagsProcessor.ParamCore($dataStates);
		ICF.NotetagsProcessor.ParamCoreD($dataSkills);
		ICF.NotetagsProcessor.ParamCoreD($dataItems);
		ICF.ParamCore.Procesed = true;
	}
	return true;
};

ICF.NotetagsProcessor.ParamCore = function (group) {
	var note1 = /<(?:NPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note1b = /<(?:NPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note1c = /<(?:NPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note1d = /<(?:NPARAMXRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note1e = /<(?:NPARAMXFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note2 = /<(?:PPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note2b = /<(?:PPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note2c = /<(?:PPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note3 = /<(?:xPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note3b = /<(?:XPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note3c = /<(?:XPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note4 = /<(?:SPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note4b = /<(?:SPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note4c = /<(?:SPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5 = /<(?:PARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5b = /<(?:PARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note5c = /<(?:PARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5d = /<(?:PARAMXRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note5e = /<(?:PARAMXFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note6 = /<(?:CPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note6b = /<(?:CPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note6c = /<(?:CPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note6d = /<(?:CPARAMXRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note6e = /<(?:CPARAMXFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note7 = /<(?:NDEBUFFRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note7b = /<(?:CDEBUFFRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;

	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(note1)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note1b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 100, value: Number(RegExp.$2) });
			}
			else if (line.match(note1c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (line.match(note1d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 300, value: Number(RegExp.$2) });
			}
			else if (line.match(note1e)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 400, value: Number(RegExp.$2) });
			}
			else if (line.match(note2)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 25, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note2b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 25, dataId: indx + 100, value: Number(RegExp.$2) });
			}
			else if (line.match(note2c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 25, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (line.match(note3)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.XParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_XPARAM, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note3b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.XParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_XPARAM, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note3c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.XParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_XPARAM, dataId: indx + 20, value: Number(RegExp.$2) });
			}
			else if (line.match(note4)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.SParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_SPARAM, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note4b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.SParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_SPARAM, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note4c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.SParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_SPARAM, dataId: indx + 20, value: Number(RegExp.$2) });
			}
			else if (line.match(note5)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note5b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note5c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 20, value: Number(RegExp.$2) });
			}
			else if (line.match(note5d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 30, value: Number(RegExp.$2) });
			}
			else if (line.match(note5e)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 40, value: Number(RegExp.$2) });
			}
			else if (line.match(note6)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note6b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 100, value: Number(RegExp.$2) });
			}
			else if (line.match(note6c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (line.match(note6d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 300, value: Number(RegExp.$2) });
			}
			else if (line.match(note6e)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 400, value: Number(RegExp.$2) });
			}
			else if (line.match(note7)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_DEBUFF_RATE, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note7b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_DEBUFF_RATE, dataId: indx + 200, value: Number(RegExp.$2) });
			}
		}
	}
};

ICF.NotetagsProcessor.ParamCoreB = function (group) {
	var grouparray = [];
	var note1 = /<(?:NPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note1b = /<(?:NPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note1c = /<(?:NPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note1d = /<(?:NPARAMXRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note1e = /<(?:NPARAMXFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note1x = /<(?:NPARAM):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)(?:[ ]+(\d+(?:\.\d+)?))?(?:[ ]+(\d+(?:\.\d+)?))?(?:[ ]+(\d+(?:\.\d+)?))?>/i;
	var note1y = /<(?:CUSTOM NPARAM BASE)[ ]+(\w+)>/i;
	var note1z = /<\/(?:CUSTOM NPARAM BASE)>/i;
	var note2 = /<(?:PPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note2b = /<(?:PPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note2c = /<(?:PPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note3 = /<(?:xPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note3b = /<(?:XPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note3c = /<(?:XPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note4 = /<(?:SPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note4b = /<(?:SPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note4c = /<(?:SPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5 = /<(?:PARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5b = /<(?:PARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note5c = /<(?:PARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5d = /<(?:PARAMXRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note5e = /<(?:PARAMXFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5y = /<(?:CUSTOM PARAM BASE)[ ]+(\w+)>/i;
	var note5z = /<\/(?:CUSTOM PARAM BASE)>/i;
	var note6 = /<(?:CPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note6b = /<(?:CPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note6c = /<(?:CPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note6d = /<(?:CPARAMXRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note6e = /<(?:CPARAMXFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note6x = /<(?:CPARAM):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)(?:[ ]+(\d+(?:\.\d+)?))?(?:[ ]+(\d+(?:\.\d+)?))?(?:[ ]+(\d+(?:\.\d+)?))?>/i;
	var note6y = /<(?:CUSTOM CPARAM BASE)[ ]+(\w+)>/i;
	var note6z = /<\/(?:CUSTOM CPARAM BASE)>/i;
	var note7 = /<(?:NDEBUFFRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note7b = /<(?:CDEBUFFRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;

	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

		obj.basicNParam = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
		obj.basicCParam = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
		obj.customNParam = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
		obj.customCParam = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
		obj.customBParam = ['', '', '', '', '', '', '', '', '', ''];

		var nFlag = false;
		var bFlag = false;
		var cFlag = false;
		var nIndex = -1;
		var bIndex = -1;
		var cIndex = -1;

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(note1)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note1b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 100, value: Number(RegExp.$2) });
			}
			else if (line.match(note1c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (line.match(note1d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 300, value: Number(RegExp.$2) });
			}
			else if (line.match(note1e)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 400, value: Number(RegExp.$2) });
			}
			else if (line.match(note1x)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				obj.basicNParam[indx] = [Number(RegExp.$2)];
				if (!isNaN(Number(RegExp.$3))) obj.basicNParam[indx] = obj.basicNParam[indx].concat([Number(RegExp.$3)]);
				if (!isNaN(Number(RegExp.$4))) obj.basicNParam[indx] = obj.basicNParam[indx].concat([Number(RegExp.$4)]);
				if (!isNaN(Number(RegExp.$5))) obj.basicNParam[indx] = obj.basicNParam[indx].concat([Number(RegExp.$5)]);
			}
			else if (line.match(note1y)) {
				nFlag = true;
				nIndex = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
			}
			else if (line.match(note1z)) {
				nFlag = false;
			}
			else if (line.match(note2)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 25, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note2b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 25, dataId: indx + 100, value: Number(RegExp.$2) });
			}
			else if (line.match(note2c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 25, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (line.match(note3)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.XParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_XPARAM, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note3b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.XParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_XPARAM, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note3c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.XParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_XPARAM, dataId: indx + 20, value: Number(RegExp.$2) });
			}
			else if (line.match(note4)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.SParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_SPARAM, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note4b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.SParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_SPARAM, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note4c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.SParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_SPARAM, dataId: indx + 20, value: Number(RegExp.$2) });
			}
			else if (line.match(note5)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note5b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note5c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 20, value: Number(RegExp.$2) });
			}
			else if (line.match(note5d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 30, value: Number(RegExp.$2) });
			}
			else if (line.match(note5e)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 40, value: Number(RegExp.$2) });
			}
			else if (line.match(note5y)) {
				bFlag = true;
				bIndex = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
			}
			else if (line.match(note5z)) {
				bFlag = false;
			}
			else if (line.match(note6)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note6b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 100, value: Number(RegExp.$2) });
			}
			else if (line.match(note6c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (line.match(note6d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 300, value: Number(RegExp.$2) });
			}
			else if (line.match(note6e)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 400, value: Number(RegExp.$2) });
			}
			else if (line.match(note6x)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				obj.basicCParam[indx] = [Number(RegExp.$2)];
				if (!isNaN(Number(RegExp.$3))) obj.basicCParam[indx] = obj.basicCParam[indx].concat([Number(RegExp.$3)]);
				if (!isNaN(Number(RegExp.$4))) obj.basicCParam[indx] = obj.basicCParam[indx].concat([Number(RegExp.$4)]);
				if (!isNaN(Number(RegExp.$5))) obj.basicCParam[indx] = obj.basicCParam[indx].concat([Number(RegExp.$5)]);
			}
			else if (line.match(note6y)) {
				cFlag = true;
				cIndex = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
			}
			else if (line.match(note6z)) {
				cFlag = false;
			}
			else if (line.match(note7)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_DEBUFF_RATE, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note7b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_DEBUFF_RATE, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (nFlag && nIndex > -1) {
				obj.customNParam[nIndex] = obj.customNParam[nIndex] + line + '\n';
			}
			else if (bFlag && bIndex > -1) {
				obj.customBParam[bIndex] = obj.customBParam[bIndex] + line + '\n';
			}
			else if (cFlag && cIndex > -1) {
				obj.customCParam[cIndex] = obj.customCParam[cIndex] + line + '\n';
			}
		}
	}
};

ICF.NotetagsProcessor.ParamCoreC = function (group) {
	var grouparray = [];
	var note1 = /<(?:NPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note1b = /<(?:NPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note1c = /<(?:NPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note1d = /<(?:NPARAMXRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note1e = /<(?:NPARAMXFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note1x = /<(?:NPARAM):[ ]*(\w+)[ ]+(\d+)>/i;
	var note1y = /<(?:CUSTOM NPARAMS)>/i;
	var note1z = /<\/(?:CUSTOM NPARAMS)>/i;
	var note2 = /<(?:PPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note2b = /<(?:PPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note2c = /<(?:PPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note2x = /<(?:PPARAM):[ ]*(\w+)[ ]+(\d+)>/i;
	var note2y = /<(?:CUSTOM PPARAMS)>/i;
	var note2z = /<\/(?:CUSTOM PPARAMS)>/i;
	var note3 = /<(?:xPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note3b = /<(?:XPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note3c = /<(?:XPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note4 = /<(?:SPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note4b = /<(?:SPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note4c = /<(?:SPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5 = /<(?:PARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5b = /<(?:PARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note5c = /<(?:PARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5d = /<(?:PARAMXRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note5e = /<(?:PARAMXFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note5y = /<(?:CUSTOM PARAMS)>/i;
	var note5z = /<\/(?:CUSTOM PARAMS)>/i;
	var note6 = /<(?:NPARAMPLUS):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note6b = /<(?:NPARAMRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note6c = /<(?:NPARAMFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note6d = /<(?:NPARAMXRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;
	var note6e = /<(?:NPARAMXFLAT):[ ]*(\w+)[ ]+((?:\-)?\d+(?:\.\d+)?)>/i;
	var note6x = /<(?:NPARAM):[ ]*(\w+)[ ]+(\d+)>/i;
	var note6y = /<(?:CUSTOM NPARAMS)>/i;
	var note6z = /<\/(?:CUSTOM NPARAMS)>/i;
	var note7 = /<(?:NDEBUFFRATE):[ ]*(\w+)[ ]+(\d+(?:\.\d+)?)>/i;

	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

		obj.NParams = [];
		obj.PParams = [];
		obj.CParams = [];

		obj.NParamEval = [];
		obj.PParamEval = [];
		obj.CParamEval = [];
		obj.BParamEval = [];

		obj.NParamEvalAll = '';
		obj.PParamEvalAll = '';
		obj.CParamEvalAll = '';
		obj.BParamEvalAll = '';

		var nFlag = false;
		var pFlag = false;
		var cFlag = false;
		var bFlag = false;

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(note1)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note1b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 100, value: Number(RegExp.$2) });
			}
			else if (line.match(note1c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (line.match(note1d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 300, value: Number(RegExp.$2) });
			}
			else if (line.match(note1e)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 24, dataId: indx + 400, value: Number(RegExp.$2) });
			}
			else if (line.match(note1x)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.NParams[indx] = Number(RegExp.$2);
			}
			else if (line.match(note1y)) {
				nFlag = true;
			}
			else if (line.match(note1z)) {
				nFlag = false;
			}
			else if (line.match(note2)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 25, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note2b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 25, dataId: indx + 100, value: Number(RegExp.$2) });
			}
			else if (line.match(note2c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 25, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (line.match(note2x)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.PParams[indx] = Number(RegExp.$2);
			}
			else if (line.match(note2y)) {
				pFlag = true;
			}
			else if (line.match(note2z)) {
				pFlag = false;
			}
			else if (line.match(note3)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.XParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_XPARAM, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note3b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.XParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_XPARAM, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note3c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.XParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_XPARAM, dataId: indx + 20, value: Number(RegExp.$2) });
			}
			else if (line.match(note4)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.SParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_SPARAM, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note4b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.SParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_SPARAM, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note4c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.SParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_SPARAM, dataId: indx + 20, value: Number(RegExp.$2) });
			}
			else if (line.match(note5)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (line.match(note5b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note5c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 20, value: Number(RegExp.$2) });
			}
			else if (line.match(note5d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 30, value: Number(RegExp.$2) });
			}
			else if (line.match(note5e)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.BParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 21, dataId: indx + 40, value: Number(RegExp.$2) });
			}
			else if (line.match(note5y)) {
				bFlag = true;
			}
			else if (line.match(note5z)) {
				bFlag = false;
			}
			else if (line.match(note6)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx, value: Number(RegExp.$2) });
			}
			else if (line.match(note6b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 100, value: Number(RegExp.$2) });
			}
			else if (line.match(note6c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 200, value: Number(RegExp.$2) });
			}
			else if (line.match(note6d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 300, value: Number(RegExp.$2) });
			}
			else if (line.match(note6e)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: 26, dataId: indx + 400, value: Number(RegExp.$2) });
			}
			else if (line.match(note6x)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.CParams[indx] = Number(RegExp.$2);
			}
			else if (line.match(note6y)) {
				cFlag = true;
			}
			else if (line.match(note6z)) {
				cFlag = false;
			}
			else if (line.match(note7)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.traits.push({ code: Game_BattlerBase.TRAIT_DEBUFF_RATE, dataId: indx + 10, value: Number(RegExp.$2) });
			}
			else if (nFlag) {
				if (line.match(/(\w+) = (.*)/i)) {
					var indx = RegExp.$1;
					if (isNaN(Number(indx))) indx = ICF.Param.NParams.indexOf(indx.toLowerCase());
					indx = (Number(indx));
					if (Number(indx) > -1) obj.NParamEval[indx] = RegExp.$2;
					else obj.NParamEvalAll = obj.NParamEvalAll + line + '\n';
				} else obj.NParamEvalAll = obj.NParamEvalAll + line + '\n';
			}
			else if (pFlag) {
				if (line.match(/(\w+) = (.*)/i)) {
					var indx = RegExp.$1;
					if (isNaN(Number(indx))) indx = ICF.Param.PParams.indexOf(indx.toLowerCase());
					indx = (Number(indx));
					if (Number(indx) > -1) obj.PParamEval[indx] = RegExp.$2;
					else obj.PParamEvalAll = obj.PParamEvalAll + line + '\n';
				} else obj.PParamEvalAll = obj.PParamEvalAll + line + '\n';
			}
			else if (cFlag) {
				if (line.match(/(\w+) = (.*)/i)) {
					var indx = RegExp.$1;
					if (isNaN(Number(indx))) indx = ICF.Param.CParamsMax.indexOf(indx.toLowerCase());
					indx = (Number(indx));
					if (Number(indx) > -1) obj.CParamEval[indx] = RegExp.$2;
					else obj.CParamEvalAll = obj.CParamEvalAll + line + '\n';
				} else obj.CParamEvalAll = obj.CParamEvalAll + line + '\n';
			}
			else if (bFlag) {
				if (line.match(/(\w+) = (.*)/i)) {
					var indx = RegExp.$1;
					if (isNaN(Number(indx))) indx = ICF.Param.BParams.indexOf(indx.toLowerCase());
					indx = (Number(indx));
					if (Number(indx) > -1) obj.BParamEval[indx] = RegExp.$2;
					else obj.NParamEvalAll = obj.BParamEvalAll + line + '\n';
				} else obj.NParamEvalAll = obj.BParamEvalAll + line + '\n';
			}
		}
	}
};

ICF.NotetagsProcessor.ParamCoreD = function (group) {
	var note1 = /<(?:NBUFF):[ ]*(\w+)[ ]+(\d+)>/i;
	var note1b = /<(?:NDEBUFF):[ ]*(\w+)[ ]+(\d+)>/i;
	var note1c = /<(?:REMOVE NBUFF):[ ]*(\w+)[ ]+>/i;
	var note1d = /<(?:REMOVE NDEBUFF):[ ]*(\w+)[ ]+>/i;
	var note2 = /<(?:CBUFF):[ ]*(\w+)[ ]+(\d+)>/i;
	var note2b = /<(?:CDEBUFF):[ ]*(\w+)[ ]+(\d+)>/i;
	var note2c = /<(?:REMOVE CBUFF):[ ]*(\w+)[ ]+>/i;
	var note2d = /<(?:REMOVE CDEBUFF):[ ]*(\w+)[ ]+>/i;
	var note3 = /<(?:NPARAM GROW):[ ]*(\w+)[ ]+((?:\-)?\d+)>/i;
	var note3b = /<(?:PPARAM GROW):[ ]*(\w+)[ ]+((?:\-)?\d+)>/i;
	var note3c = /<(?:CPARAM GROW):[ ]*(\w+)[ ]+((?:\-)?\d+)>/i;

	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(note1)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 35, dataId: indx, value1: Number(RegExp.$2) });
			}
			else if (line.match(note1b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 36, dataId: indx, value1: Number(RegExp.$2) });
			}
			else if (line.match(note1c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 37, dataId: indx, value1: 0 });
			}
			else if (line.match(note1d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 38, dataId: indx, value1: 0 });
			}
			else if (line.match(note2)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 35, dataId: indx + 100, value1: Number(RegExp.$2) });
			}
			else if (line.match(note2b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 36, dataId: indx + 100, value1: Number(RegExp.$2) });
			}
			else if (line.match(note2c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 37, dataId: indx + 100, value1: 0 });
			}
			else if (line.match(note2d)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 38, dataId: indx + 100, value1: 0 });
			}
			else if (line.match(note3)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.NParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 45, dataId: indx, value1: Number(RegExp.$2) });
			}
			else if (line.match(note3b)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.PParams.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 46, dataId: indx, value1: Number(RegExp.$2) });
			}
			else if (line.match(note3c)) {
				var indx = (isNaN(Number(RegExp.$1))) ? ICF.Param.CParamsMax.indexOf(RegExp.$1.toLowerCase()) : Number(RegExp.$1);
				if (indx > -1) obj.effects.push({ code: 47, dataId: indx, value1: Number(RegExp.$2) });
			}
		}
	}
};

//=============================================================================
// Game_BattlerBase
//=============================================================================

if (ICF.Param.BParams[0].length > 0) Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.BParams[0], { get: function () { return this.param(0); }, configurable: true });
if (ICF.Param.BParams[1].length > 0) Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.BParams[1], { get: function () { return this.param(1); }, configurable: true });
if (ICF.Param.BParams[2].length > 0) Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.BParams[2], { get: function () { return this.param(2); }, configurable: true });
if (ICF.Param.BParams[3].length > 0) Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.BParams[3], { get: function () { return this.param(3); }, configurable: true });
if (ICF.Param.BParams[4].length > 0) Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.BParams[4], { get: function () { return this.param(4); }, configurable: true });
if (ICF.Param.BParams[5].length > 0) Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.BParams[5], { get: function () { return this.param(5); }, configurable: true });
if (ICF.Param.BParams[6].length > 0) Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.BParams[6], { get: function () { return this.param(6); }, configurable: true });
if (ICF.Param.BParams[7].length > 0) Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.BParams[7], { get: function () { return this.param(7); }, configurable: true });

for (var i = 0; i < ICF.Param.NParams.length; i++) {
	if (ICF.Param.NParams[i].length > 0) {
		eval("Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.NParams[" + i + "], { get: function() { return this.NParam(" + i + "); }, configurable: true });");
	}
}
for (var i = 0; i < ICF.Param.PParams.length; i++) {
	if (ICF.Param.PParams[i].length > 0) {
		eval("Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.PParams[" + i + "], { get: function() { return this.PParam(" + i + "); }, configurable: true });");
	}
}
for (var i = 0; i < ICF.Param.CParamsMax.length; i++) {
	if (ICF.Param.CParamsMax[i].length > 0) {
		eval("Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.CParamsMax[" + i + "], { get: function() { return this.CParam(" + i + "); }, configurable: true });");
	}
	if (ICF.Param.CParams[i].length > 0) {
		eval("Object.defineProperty(Game_BattlerBase.prototype, ICF.Param.CParams[" + i + "], { get: function() { return this.CParamValue(" + i + "); }, configurable: true });");
	}
}

Object.defineProperty(Game_BattlerBase.prototype, 'level', { value: 1, configurable: true });

if (!Game_BattlerBase.prototype.equips) Game_BattlerBase.prototype.equips = function () { return []; };
if (!Game_BattlerBase.prototype.currentClass) Game_BattlerBase.prototype.currentClass = function () { return null; };

ICF.ParamCore.clearParamPlus = Game_BattlerBase.prototype.clearParamPlus;
Game_BattlerBase.prototype.clearParamPlus = function () {
	ICF.ParamCore.clearParamPlus.call(this);
	this._NParamPlus = this.clearParamArray('NParams');
	this._PParamPlus = this.clearParamArray('PParams');
	this._CParamPlus = this.clearParamArray('CParams');
};

ICF.ParamCore.clearBuffs = Game_BattlerBase.prototype.clearBuffs;
Game_BattlerBase.prototype.clearBuffs = function () {
	ICF.ParamCore.clearBuffs.call(this);
	this._NBuffs = this.clearParamArray('NParams');
	this._NBuffTurns = this.clearParamArray('NParams');
	this._CBuffs = this.clearParamArray('CParams');
	this._CBuffTurns = this.clearParamArray('CParams');
};

Game_BattlerBase.prototype.clearParamArray = function (params) {
	var arr = [];
	var length = ICF.Param[params].length;
	for (var i = 0; i < length; i++)
		arr.push(0);
	return arr;
}

ICF.ParamCore.battlerRefresh = Game_BattlerBase.prototype.refresh;
Game_BattlerBase.prototype.refresh = function () {
	ICF.ParamCore.battlerRefresh.call(this);
	if (!this._CParamValues) this._CParamValues = [];
	for (var i = 0; i < ICF.Param.CParamsMax.length; i++) {
		if (this._CParamValues[i] === undefined) this._CParamValues[i] = this.CParam(i);
		this._CParamValues[i] = this._CParamValues[i].clamp(0, this.CParam(i));
	}
};

ICF.ParamCore.battlerRecoverAll = Game_BattlerBase.prototype.recoverAll;
Game_BattlerBase.prototype.recoverAll = function () {
	ICF.ParamCore.battlerRecoverAll.call(this);
	if (!this._CParamValues) this._CParamValues = [];
	for (var i = 0; i < ICF.Param.CParamsMax.length; i++) {
		if (this._CParamValues[i] === undefined) this._CParamValues[i] = this.CParam(i);
		this._CParamValues[i] = this.CParam(i);
	}
};

Game_BattlerBase.prototype.eraseNBuff = function (paramId) {
	this._NBuffs[paramId] = 0;
	this._NBuffTurns[paramId] = 0;
};

Game_BattlerBase.prototype.NBuffLength = function () {
	return this._NBuffs.length;
};

Game_BattlerBase.prototype.NBuff = function (paramId) {
	if (!this._NBuffs[paramId]) this._NBuffs[paramId] = 0;
	return this._NBuffs[paramId];
};

Game_BattlerBase.prototype.isNBuffAffected = function (paramId) {
	if (!this._NBuffs[paramId]) this._NBuffs[paramId] = 0;
	return this._NBuffs[paramId] > 0;
};

Game_BattlerBase.prototype.isNDebuffAffected = function (paramId) {
	if (!this._NBuffs[paramId]) this._NBuffs[paramId] = 0;
	return this._NBuffs[paramId] < 0;
};

Game_BattlerBase.prototype.isNBuffOrDebuffAffected = function (paramId) {
	if (!this._NBuffs[paramId]) this._NBuffs[paramId] = 0;
	return this._NBuffs[paramId] !== 0;
};

Game_BattlerBase.prototype.isMaxNBuffAffected = function (paramId) {
	if (!this._NBuffs[paramId]) this._NBuffs[paramId] = 0;
	return this._NBuffs[paramId] >= 2;
};

Game_BattlerBase.prototype.isMaxNDebuffAffected = function (paramId) {
	if (!this._NBuffs[paramId]) this._NBuffs[paramId] = 0;
	return this._NBuffs[paramId] <= -2;
};

Game_BattlerBase.prototype.increaseNBuff = function (paramId) {
	if (!this._NBuffs[paramId]) this._NBuffs[paramId] = 0;
	if (!this.isMaxNBuffAffected(paramId)) {
		this._NBuffs[paramId]++;
	}
};

Game_BattlerBase.prototype.decreaseNBuff = function (paramId) {
	if (!this._NBuffs[paramId]) this._NBuffs[paramId] = 0;
	if (!this.isMaxNDebuffAffected(paramId)) {
		this._NBuffs[paramId]--;
	}
};

Game_BattlerBase.prototype.overwriteNBuffTurns = function (paramId, turns) {
	if (!this._NBuffTurns[paramId]) this._NBuffTurns[paramId] = 0;
	if (this._NBuffTurns[paramId] < turns) {
		this._NBuffTurns[paramId] = turns;
	}
};

Game_BattlerBase.prototype.isNBuffExpired = function (paramId) {
	if (!this._NBuffTurns[paramId]) this._NBuffTurns[paramId] = 0;
	return this._NBuffTurns[paramId] === 0;
};

Game_BattlerBase.prototype.eraseCBuff = function (paramId) {
	this._CBuffs[paramId] = 0;
	this._CBuffTurns[paramId] = 0;
};

Game_BattlerBase.prototype.CBuffLength = function () {
	return this._CBuffs.length;
};

Game_BattlerBase.prototype.CBuff = function (paramId) {
	if (!this._CBuffs[paramId]) this._CBuffs[paramId] = 0;
	return this._CBuffs[paramId];
};

Game_BattlerBase.prototype.isCBuffAffected = function (paramId) {
	if (!this._CBuffs[paramId]) this._CBuffs[paramId] = 0;
	return this._CBuffs[paramId] > 0;
};

Game_BattlerBase.prototype.isCDebuffAffected = function (paramId) {
	if (!this._CBuffs[paramId]) this._CBuffs[paramId] = 0;
	return this._CBuffs[paramId] < 0;
};

Game_BattlerBase.prototype.isCBuffOrDebuffAffected = function (paramId) {
	if (!this._CBuffs[paramId]) this._CBuffs[paramId] = 0;
	return this._CBuffs[paramId] !== 0;
};

Game_BattlerBase.prototype.isMaxCBuffAffected = function (paramId) {
	if (!this._CBuffs[paramId]) this._CBuffs[paramId] = 0;
	return this._CBuffs[paramId] >= 2;
};

Game_BattlerBase.prototype.isMaxCDebuffAffected = function (paramId) {
	if (!this._CBuffs[paramId]) this._CBuffs[paramId] = 0;
	return this._CBuffs[paramId] <= -2;
};

Game_BattlerBase.prototype.increaseCBuff = function (paramId) {
	if (!this._CBuffs[paramId]) this._CBuffs[paramId] = 0;
	if (!this.isMaxCBuffAffected(paramId)) {
		this._CBuffs[paramId]++;
	}
};

Game_BattlerBase.prototype.decreaseCBuff = function (paramId) {
	if (!this._CBuffs[paramId]) this._CBuffs[paramId] = 0;
	if (!this.isMaxCDebuffAffected(paramId)) {
		this._CBuffs[paramId]--;
	}
};

Game_BattlerBase.prototype.overwriteCBuffTurns = function (paramId, turns) {
	if (!this._CBuffTurns[paramId]) this._CBuffTurns[paramId] = 0;
	if (this._CBuffTurns[paramId] < turns) {
		this._CBuffTurns[paramId] = turns;
	}
};

Game_BattlerBase.prototype.isCBuffExpired = function (paramId) {
	if (!this._CBuffTurns[paramId]) this._CBuffTurns[paramId] = 0;
	return this._CBuffTurns[paramId] === 0;
};

ICF.ParamCore.updateBuffTurns = Game_BattlerBase.prototype.updateBuffTurns;
Game_BattlerBase.prototype.updateBuffTurns = function () {
	ICF.ParamCore.updateBuffTurns.call(this);
	for (var i = 0; i < this._NBuffTurns.length; i++) {
		if (this._NBuffTurns[i] > 0) {
			this._NBuffTurns[i]--;
		}
	}
	for (var i = 0; i < this._CBuffTurns.length; i++) {
		if (this._CBuffTurns[i] > 0) {
			this._CBuffTurns[i]--;
		}
	}
};

ICF.ParamCore.buffIcons = Game_BattlerBase.prototype.buffIcons;
Game_BattlerBase.prototype.buffIcons = function () {
	var icons = ICF.ParamCore.buffIcons.call(this);
	for (var i = 0; i < this._NBuffs.length; i++) {
		if ((this._NBuffs[i] > 0) && (ICF.Param.NParamBuffIcons[i].length > 0)) {
			icons.push(ICF.Param.NParamBuffIcons[i][Math.min(ICF.Param.NParamBuffIcons[i].length, this._NBuffs[i]) - 1]);
		} else if ((this._NBuffs[i] < 0) && (ICF.Param.NParamDebuffIcons[i].length > 0)) {
			icons.push(ICF.Param.NParamDebuffIcons[i][Math.min(ICF.Param.NParamDebuffIcons[i].length, Math.abs(this._NBuffs[i])) - 1]);
		}
	}
	for (var i = 0; i < this._CBuffs.length; i++) {
		if ((this._CBuffs[i] > 0) && (ICF.Param.CParamBuffIcons[i].length > 0)) {
			icons.push(ICF.Param.CParamBuffIcons[i][Math.min(ICF.Param.CParamBuffIcons[i].length, this._CBuffs[i]) - 1]);
		} else if ((this._CBuffs[i] < 0) && (ICF.Param.CParamDebuffIcons[i].length > 0)) {
			icons.push(ICF.Param.CParamDebuffIcons[i][Math.min(ICF.Param.CParamDebuffIcons[i].length, Math.abs(this._CBuffs[i])) - 1]);
		}
	}
	return icons;
};

Game_BattlerBase.prototype.NParamBasic = function (array, level) {
	if (array.length == 1) {
		return Number(array[0]);
	} else if (array.length == 2) {
		return Number(array[0]) + Number(array[1] * (level - 1));
	} else if (array.length == 3 || array[3] > level) {
		return Number(array[0]) + Number(array[1] * (level - 1)) + Number(array[2] * Math.pow(level - 1, 1.2));
	} else if (array.length > 3) {
		return Number(array[0]) + Number(array[1] * (array[3] - 1)) + Number(array[2] * Math.pow(array[3] - 1, 1.2));
	} else {
		return 0;
	}
};

Game_BattlerBase.prototype.NParamBase = function (paramId) {
	var array = ICF.Param.NParamBase[paramId];
	if (!Array.isArray(array)) return (array != '') ? eval(array) : 0;
	if (array.length < 1) {
		return 0;
	} else {
		return this.NParamBasic(array, this.level);
	}
};

Game_BattlerBase.prototype.NParamPlus = function (paramId) {
	return this._NParamPlus[paramId] + this.traitsSum(Game_BattlerBase.TRAIT_NPARAM, paramId) + this.NParamEquips(paramId);
};

Game_BattlerBase.prototype.NParamEquips = function (paramId) {
	var value = 0;
	var equips = this.equips();
	for (var i = 0; i < equips.length; i++) {
		var item = equips[i];
		if (item && item.NParams[paramId]) value += item.NParams[paramId];
		if (item && item.NParamEval[paramId]) {
			try {
				value += eval(item.NParamEvalAll + ';' + item.NParamEval[paramId]);
			}
			catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom NParam Base #' + paramId + ($dataWeapons[item.id] == item ? ' in weapon #' : ' in equip #') + item.id); } }
		}
	}
	return value;
};

Game_BattlerBase.prototype.NParamEval = function (paramId) {
	return 0;
};

Game_BattlerBase.prototype.NParamLimits = function (paramId) {
	var array = eval(ICF.Param.NParamLimit[paramId]);
	if (!Array.isArray(array)) return (!isNaN(Number(array))) ? [array] : [];
	return array;
};

Game_BattlerBase.prototype.NParamRate = function (paramId) {
	// Commented out is the original one
	// return this.traitsPi(Game_BattlerBase.TRAIT_NPARAM, paramId + 100);
	// Tika modification below
	return this.traitsPi(Game_BattlerBase.TRAIT_NPARAM, paramId + this._NParamPlus.length);
};

Game_BattlerBase.prototype.NParamXRate = function (paramId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_NPARAM, paramId + 300);
};

Game_BattlerBase.prototype.NParamBuffRate = function (paramId) {
	return this._NBuffs[paramId] * 0.25 + 1.0;
};

Game_BattlerBase.prototype.NParamFlat = function (paramId) {
	return this.traitsSum(Game_BattlerBase.TRAIT_NPARAM, paramId + 200);
};

Game_BattlerBase.prototype.NParamXFlat = function (paramId) {
	return this.traitsSum(Game_BattlerBase.TRAIT_NPARAM, paramId + 400);
};

Game_BattlerBase.prototype.NParam = function (paramId) {
	var value = this.NParamBase(paramId) + this.NParamEval(paramId) + this.NParamPlus(paramId);
	value += this.NParamPlusExt(paramId);
	value *= this.NParamRate(paramId);
	var limits = this.NParamLimits(paramId);
	var buff = this.NParamXRate(paramId) * this.NParamBuffRate(paramId);
	if (limits.length > 1) value = Math.min(value, limits[1]);
	var flat = 0;
	if (limits.length > 1) flat = (buff > 1) ? Math.min(this.NParamFlat(paramId), limits[1] - value) : Math.min(this.NParamFlat(paramId), limits[1] - value * buff);
	else flat = this.NParamFlat(paramId);
	value *= buff;
	value += flat + this.NParamXFlat(paramId);
	if (limits.length < 1) return Math.round(value);
	if (limits.length < 3) return Math.round(Math.max(value, limits[0]));
	return Math.round(value.clamp(limits[0], limits[2]));
};

Game_BattlerBase.prototype.CParamBase = function (paramId) {
	var array = ICF.Param.CParamBase[paramId];
	if (!Array.isArray(array)) return (array != '') ? eval(array) : 0;
	if (array.length < 1) {
		return 0;
	} else {
		return this.NParamBasic(array, this.level);
	}
};

Game_BattlerBase.prototype.CParamPlus = function (paramId) {
	return this._CParamPlus[paramId] + this.traitsSum(Game_BattlerBase.TRAIT_CPARAM, paramId) + this.CParamEquips(paramId);
};

Game_BattlerBase.prototype.CParamEquips = function (paramId) {
	var value = 0;
	var equips = this.equips();
	for (var i = 0; i < equips.length; i++) {
		var item = equips[i];
		if (item && item.CParams[paramId]) value += item.CParams[paramId];
		if (item && item.CParamEval[paramId]) {
			try {
				value += eval(item.CParamEvalAll + ';' + item.CParamEval[paramId]);
			}
			catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom CParam Base #' + paramId + ($dataWeapons[item.id] == item ? ' in weapon #' : ' in equip #') + item.id); } }
		}
	}
	return value;
};

Game_BattlerBase.prototype.CParamEval = function (paramId) {
	return 0;
};

Game_BattlerBase.prototype.CParamLimits = function (paramId) {
	var array = eval(ICF.Param.CParamLimit[paramId]);
	if (!Array.isArray(array)) return (!isNaN(Number(array))) ? [array] : [];
	return array;
};

Game_BattlerBase.prototype.CParamRate = function (paramId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_CPARAM, paramId + 100);
};

Game_BattlerBase.prototype.CParamXRate = function (paramId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_CPARAM, paramId + 300);
};

Game_BattlerBase.prototype.CParamBuffRate = function (paramId) {
	return this._CBuffs[paramId] * 0.25 + 1.0;
};

Game_BattlerBase.prototype.CParamFlat = function (paramId) {
	return this.traitsSum(Game_BattlerBase.TRAIT_CPARAM, paramId + 200);
};

Game_BattlerBase.prototype.CParamXFlat = function (paramId) {
	return this.traitsSum(Game_BattlerBase.TRAIT_CPARAM, paramId + 400);
};

Game_BattlerBase.prototype.CParam = function (paramId) {
	var value = this.CParamBase(paramId) + this.CParamEval(paramId) + this.CParamPlus(paramId);
	value *= this.CParamRate(paramId);
	var limits = this.CParamLimits(paramId);
	var buff = this.CParamXRate(paramId) * this.CParamBuffRate(paramId);
	if (limits.length > 1) value = Math.min(value, limits[1]);
	var flat = 0;
	if (limits.length > 1) flat = (buff > 1) ? Math.min(this.CParamFlat(paramId), limits[1] - value) : Math.min(this.CParamFlat(paramId), limits[1] - value * buff);
	else flat = this.CParamFlat(paramId);
	value *= buff;
	value += flat + this.CParamXFlat(paramId);
	if (limits.length < 1) return Math.round(value);
	if (limits.length < 3) return Math.round(Math.max(value, limits[0]));
	return Math.round(value.clamp(limits[0], limits[2]));
};

Game_BattlerBase.prototype.CParamValue = function (paramId) {
	if (!this._CParamValues) this._CParamValues = [];
	if (this._CParamValues[paramId] === undefined) this._CParamValues[paramId] = this.CParam(paramId);
	return this._CParamValues[paramId];
};

Game_BattlerBase.prototype.setCParamValue = function (paramId, amount) {
	if (!this._CParamValues) this._CParamValues = [];
	this._CParamValues[paramId] = amount;
	this._CParamValues[paramId] = this._CParamValues[paramId].clamp(0, this.CParam(paramId));
};

Game_BattlerBase.prototype.gainCParamValue = function (paramId, amount) {
	if (!this._CParamValues) this._CParamValues = [];
	if (this._CParamValues[paramId] === undefined) this._CParamValues[paramId] = this.CParam(paramId);
	this._CParamValues[paramId] += amount;
	this._CParamValues[paramId] = this._CParamValues[paramId].clamp(0, this.CParam(paramId));
};

for (var i = 0; i < ICF.Param.CParams.length; i++) {
	if (ICF.Param.CParams[i].length > 0) {
		var param = "gain" + ICF.Param.CParams[i].substr(0, 1).toUpperCase() + (ICF.Param.CParams[i].substr(1).toLowerCase());
		eval('Game_BattlerBase.prototype.' + param + ' = function(amount) { this.gainCParamValue(' + i + ', amount); };')
		param = "set" + ICF.Param.CParams[i].substr(0, 1).toUpperCase() + (ICF.Param.CParams[i].substr(1).toLowerCase());
		eval('Game_BattlerBase.prototype.' + param + ' = function(amount) { this.setCParamValue(' + i + ', amount); };')
		eval('Game_BattlerBase.prototype.' + ICF.Param.CParams[i] + 'Rate = function(amount) { return (this.CParamValue(' + i + ') / this.CParam(' + i + ')).clamp(0, 1); };')
	}
}

Game_BattlerBase.prototype.PParamBase = function (pparamId) {
	return eval(ICF.Param.PParamBase[pparamId]) || 0;
}

Game_BattlerBase.prototype.PParamEquips = function (paramId) {
	var value = 0;
	var equips = this.equips();
	for (var i = 0; i < equips.length; i++) {
		var item = equips[i];
		if (item && item.PParams[paramId]) value += item.PParams[paramId];
		if (item && item.PParamEval[paramId]) {
			try {
				value += eval(item.PParamEvalAll + ';' + item.PParamEval[paramId]);
			}
			catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom PParam Base #' + paramId + ($dataWeapons[item.id] == item ? ' in weapon #' : ' in equip #') + item.id); } }
		}
	}
	return value;
};

Game_BattlerBase.prototype.PParamLimits = function (paramId) {
	var array = eval(ICF.Param.PParamLimit[paramId]);
	if (!Array.isArray(array)) return (!isNaN(Number(array))) ? [array] : [];
	return array;
};

Game_BattlerBase.prototype.PParamPlus = function (pparamId) {
	if (!this._PParamPlus) this._PParamPlus = [];
	if (isNaN(this._PParamPlus[pparamId])) this._PParamPlus[pparamId] = 0;
	return this._PParamPlus[pparamId];
};

Game_BattlerBase.prototype.PParam = function (pparamId) {
	var value = this.PParamBase(pparamId) + this.traitsSum(Game_BattlerBase.TRAIT_PPARAM, pparamId);
	var limits = this.PParamLimits(pparamId);
	value += this.PParamEquips(pparamId) + this.PParamPlus(pparamId);
	value *= this.traitsPi(Game_BattlerBase.TRAIT_PPARAM, pparamId + 100);
	value += this.traitsSum(Game_BattlerBase.TRAIT_PPARAM, pparamId + 200);
	if (limits.length > 1) return value.clamp(limits[0], limits[1]);
	if (limits.length > 0) return Math.max(value, limits[0]);
	return value;
};

ICF.ParamCore.paramplus = Game_BattlerBase.prototype.paramPlus;
Game_BattlerBase.prototype.paramPlus = function (paramId) {
	return ICF.ParamCore.paramplus.call(this, paramId) + this.traitsSum(Game_BattlerBase.TRAIT_PARAM, paramId + 10);
};

Game_BattlerBase.prototype.paramFlat = function (paramId) {
	return this.traitsSum(Game_BattlerBase.TRAIT_PARAM, paramId + 20);
};

Game_BattlerBase.prototype.paramXFlat = function (paramId) {
	return this.traitsSum(Game_BattlerBase.TRAIT_PARAM, paramId + 40);
};

Game_BattlerBase.prototype.paramXRate = function (paramId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId + 30);
};

Game_BattlerBase.prototype.paramLimits = function (paramId) {
	var array = eval(ICF.Param.BParamLimit[paramId]);
	if (!Array.isArray(array)) return (!isNaN(Number(array))) ? [array] : [];
	return array;
};

Game_BattlerBase.prototype.paramEquips = function (paramId) {
	var value = 0;
	var equips = this.equips();
	for (var i = 0; i < equips.length; i++) {
		var item = equips[i];
		if (item && item.BParamEval[paramId]) {
			try {
				value += eval(item.BParamEval[paramId]);
			}
			catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom param Base #' + paramId + ($dataWeapons[item.id] == item ? ' in weapon #' : ' in equip #') + item.id); } }
		}
	}
	return value;
};

Game_BattlerBase.prototype.paramEval = function (paramId) {
	return 0;
};

Game_BattlerBase.prototype.param = function (paramId) {
	var value = this.paramBase(paramId) + this.paramPlus(paramId) + this.paramEquips(paramId) + this.paramEval(paramId);
	value *= this.paramRate(paramId);
	var limits = this.paramLimits(paramId);
	var buff = this.paramXRate(paramId) * this.paramBuffRate(paramId);
	if (limits.length > 1) value = Math.min(value, limits[1]);
	var flat = 0;
	if (limits.length > 1) flat = (buff > 1) ? Math.min(this.paramFlat(paramId), limits[1] - value) : Math.min(this.paramFlat(paramId), limits[1] - value * buff);
	else flat = this.paramFlat(paramId);
	value *= buff;
	value += flat + this.paramXFlat(paramId);
	if (limits.length < 1) return Math.round(value);
	if (limits.length < 3) return Math.round(Math.max(value, limits[0]));
	return Math.round(value.clamp(limits[0], limits[2]));
};

Game_BattlerBase.prototype.xparamBase = function (xparamId) {
	return eval(ICF.Param.XParamBase[xparamId]) || 0;
}

Game_BattlerBase.prototype.xparam = function (xparamId) {
	return (this.xparamBase(xparamId) + this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId)) * this.traitsPi(Game_BattlerBase.TRAIT_XPARAM, xparamId + 10) + this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId + 20);
};

Game_BattlerBase.prototype.sparamBase = function (sparamId) {
	return eval(ICF.Param.SParamBase[sparamId]) || 1;
}

Game_BattlerBase.prototype.sparam = function (sparamId) {
	return (this.sparamBase(sparamId) + this.traitsSum(Game_BattlerBase.TRAIT_SPARAM, sparamId + 10)) * this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId) + this.traitsSum(Game_BattlerBase.TRAIT_SPARAM, sparamId + 20);
};

Game_BattlerBase.prototype.NDebuffRate = function (paramId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId + 10);
};

Game_BattlerBase.prototype.CDebuffRate = function (paramId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId + 200);
};

Game_BattlerBase.prototype.addNParam = function (paramId, value) {
	if (!this._NParamPlus) this._NParamPlus = [];
	if (!this._NParamPlus[paramId]) this._NParamPlus[paramId] = 0;
	this._NParamPlus[paramId] += value;
	this.refresh();
};

Game_BattlerBase.prototype.addPParam = function (paramId, value) {
	if (!this._PParamPlus) this._PParamPlus = [];
	if (!this._PParamPlus[paramId]) this._PParamPlus[paramId] = 0;
	this._PParamPlus[paramId] += value;
	this.refresh();
};

Game_BattlerBase.prototype.addCParam = function (paramId, value) {
	if (!this._CParamPlus) this._CParamPlus = [];
	if (!this._CParamPlus[paramId]) this._CParamPlus[paramId] = 0;
	this._CParamPlus[paramId] += value;
	this.refresh();
};

//=============================================================================
// Game_Battler
//=============================================================================

Game_Battler.prototype.addNBuff = function (paramId, turns) {
	if (this.isAlive()) {
		this.increaseNBuff(paramId);
		if (this.isNBuffAffected(paramId)) {
			this.overwriteNBuffTurns(paramId, turns);
		}
		this._result.pushAddedNBuff(paramId);
		this.refresh();
	}
};

Game_Battler.prototype.addNDebuff = function (paramId, turns) {
	if (this.isAlive()) {
		this.decreaseNBuff(paramId);
		if (this.isNDebuffAffected(paramId)) {
			this.overwriteNBuffTurns(paramId, turns);
		}
		this._result.pushAddedNDebuff(paramId);
		this.refresh();
	}
};

Game_Battler.prototype.removeNBuff = function (paramId) {
	if (this.isAlive() && this.isNBuffOrDebuffAffected(paramId)) {
		this.eraseNBuff(paramId);
		this._result.pushRemovedNBuff(paramId);
		this.refresh();
	}
};

Game_Battler.prototype.addCBuff = function (paramId, turns) {
	if (this.isAlive()) {
		this.increaseCBuff(paramId);
		if (this.isCBuffAffected(paramId)) {
			this.overwriteCBuffTurns(paramId, turns);
		}
		this._result.pushAddedCBuff(paramId);
		this.refresh();
	}
};

Game_Battler.prototype.addCDebuff = function (paramId, turns) {
	if (this.isAlive()) {
		this.decreaseCBuff(paramId);
		if (this.isCDebuffAffected(paramId)) {
			this.overwriteCBuffTurns(paramId, turns);
		}
		this._result.pushAddedCDebuff(paramId);
		this.refresh();
	}
};

Game_Battler.prototype.removeCBuff = function (paramId) {
	if (this.isAlive() && this.isCBuffOrDebuffAffected(paramId)) {
		this.eraseCBuff(paramId);
		this._result.pushRemovedCBuff(paramId);
		this.refresh();
	}
};

ICF.ParamCore.removeAllBuffs = Game_Battler.prototype.removeAllBuffs;
Game_Battler.prototype.removeAllBuffs = function () {
	ICF.ParamCore.removeAllBuffs.call(this);
	for (var i = 0; i < this.NBuffLength(); i++) {
		this.removeNBuff(i);
	}
	for (var i = 0; i < this.CBuffLength(); i++) {
		this.removeCBuff(i);
	}
};

ICF.ParamCore.removeBuffsAuto = Game_Battler.prototype.removeBuffsAuto;
Game_Battler.prototype.removeBuffsAuto = function () {
	ICF.ParamCore.removeBuffsAuto.call(this);
	for (var i = 0; i < this.NBuffLength(); i++) {
		if (this.isNBuffExpired(i)) {
			this.removeNBuff(i);
		}
	}
	for (var i = 0; i < this.CBuffLength(); i++) {
		if (this.isCBuffExpired(i)) {
			this.removeCBuff(i);
		}
	}
};

//=============================================================================
// Game_Actor
//=============================================================================

Game_Actor.prototype.NParamBase = function (paramId) {
	if ($dataActors[this._actorId].customNParam[paramId] != '') {
		try {
			var value = 0;
			eval($dataActors[this._actorId].customNParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom NParam Base #' + paramId + ' in actor #' + this._actorId); } }
	}
	if ($dataClasses[this._classId].customNParam[paramId] != '') {
		try {
			var value = 0;
			eval($dataClasses[this._classId].customNParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom NParam Base #' + paramId + ' in actor class #' + this._classId); } }
	}

	var array = $dataActors[this._actorId].basicNParam[paramId];
	if (!array || array.length < 1) array = $dataClasses[this._classId].basicNParam[paramId];

	if (!array || array.length < 1) return Game_BattlerBase.prototype.NParamBase.call(this, paramId);
	return this.NParamBasic(array, this.level);
};

Game_Actor.prototype.CParamBase = function (paramId) {
	if ($dataActors[this._actorId].customCParam[paramId] != '') {
		try {
			var value = 0;
			eval($dataActors[this._actorId].customCParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom CParam Base #' + paramId + ' in actor #' + this._actorId); } }
	}
	if ($dataClasses[this._classId].customCParam[paramId] != '') {
		try {
			var value = 0;
			eval($dataClasses[this._classId].customCParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom CParam Base #' + paramId + ' in actor class #' + this._classId); } }
	}

	var array = $dataActors[this._actorId].basicNParam[paramId];
	if (!array || array.length < 1) array = $dataClasses[this._classId].basicNParam[paramId];

	if (!array || array.length < 1) return Game_BattlerBase.prototype.NParamBase.call(this, paramId);
	return this.NParamBasic(array, this.level);
};

ICF.ParamCore.actorparambase = Game_Actor.prototype.paramBase;
Game_Actor.prototype.paramBase = function (paramId) {
	if ($dataActors[this._actorId].customBParam[paramId] != '') {
		try {
			var value = 0;
			var base = this.currentClass().params[paramId][1];
			eval($dataActors[this._actorId].customBParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom Param Base #' + paramId + ' in actor #' + this._actorId); } }
	}
	if ($dataClasses[this._classId].customBParam[paramId] != '') {
		try {
			var value = 0;
			var base = this.currentClass().params[paramId][1];
			eval($dataClasses[this._classId].customBParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom Param Base #' + paramId + ' in actor class #' + this._classId); } }
	}

	if (ICF.Param.BParamBase[paramId].length > 0) {
		try {
			var base = this.currentClass().params[paramId][1];
			return eval(ICF.Param.BParamBase[paramId]);
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in default Param Base #' + paramId); } }
	}
	return ICF.ParamCore.actorparambase.call(this, paramId);
};

//=============================================================================
// Game_Enemy
//=============================================================================

Game_Enemy.prototype.NParamBase = function (paramId) {
	if ($dataEnemies[this._enemyId].customNParam[paramId] != '') {
		try {
			var value = 0;
			eval($dataEnemies[this._enemyId].customNParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom NParam Base #' + paramId + ' in enemy #' + this._enemyId); } }
	}
	var currentClass = this.currentClass();
	if (currentClass && currentClass.customNParam[paramId] != '') {
		try {
			var value = 0;
			eval(currentClass.customNParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom NParam Base #' + paramId + ' in enemy class #' + this._classId); } }
	}


	var array = $dataEnemies[this._enemyId].basicNParam[paramId];
	if ((!array || array.length < 1) && currentClass) array = currentClass.basicNParam[paramId];

	if (!array || array.length < 1) return Game_BattlerBase.prototype.NParamBase.call(this, paramId);
	return this.NParamBasic(array, this.level);
};

Game_Enemy.prototype.CParamBase = function (paramId) {
	if ($dataEnemies[this._enemyId].customCParam[paramId] != '') {
		try {
			var value = 0;
			eval($dataEnemies[this._enemyId].customCParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom CParam Base #' + paramId + ' in enemy #' + this._enemyId); } }
	}
	var currentClass = this.currentClass();
	if (currentClass && currentClass.customCParam[paramId] != '') {
		try {
			var value = 0;
			eval(currentClass.customCParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom CParam Base #' + paramId + ' in enemy class #' + this._classId); } }
	}


	var array = $dataEnemies[this._enemyId].basicCParam[paramId];
	if ((!array || array.length < 1) && currentClass) array = currentClass.basicCParam[paramId];

	if (!array || array.length < 1) return Game_BattlerBase.prototype.CParamBase.call(this, paramId);
	return this.NParamBasic(array, this.level);
};

ICF.ParamCore.enemyparambase = Game_Enemy.prototype.paramBase;
Game_Enemy.prototype.paramBase = function (paramId) {
	if ($dataEnemies[this._enemyId].customBParam[paramId] != '') {
		try {
			var value = 0;
			var base = (this.currentClass()) ? this.currentClass().params[paramId][1] : this.enemy().params[paramId];
			eval($dataEnemies[this._enemyId].customBParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom Param Base #' + paramId + ' in enemy #' + this._enemyId); } }
	}
	var currentClass = this.currentClass();
	if (currentClass && currentClass.customBParam[paramId] != '') {
		try {
			var value = 0;
			var base = (this.currentClass()) ? this.currentClass().params[paramId][1] : this.enemy().params[paramId];
			eval(currentClass.customBParam[paramId]);
			return value;
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in custom Param Base #' + paramId + ' in enemy class #' + this._classId); } }
	}

	if (ICF.Param.BParamBase[paramId].length > 0) {
		try {
			var base = (this.currentClass()) ? this.currentClass().params[paramId][1] : this.enemy().params[paramId];
			return eval(ICF.Param.BParamBase[paramId]);
		}
		catch (e) { if (ICF.Param.ParamCoreHalt) { throw new Error('Error in default Param Base #' + paramId); } }
	}
	return ICF.ParamCore.enemyparambase.call(this, paramId);
};

//=============================================================================
// Game_Action
//=============================================================================

ICF.ParamCore.testItemEffect = Game_Action.prototype.testItemEffect;
Game_Action.prototype.testItemEffect = function (target, effect) {
	switch (effect.code) {
		case Game_Action.EFFECT_ADD_NBUFF:
			if (effect.dataId >= 100) return !target.isMaxCBuffAffected(effect.dataId - 100);
			return !target.isMaxNBuffAffected(effect.dataId);
		case Game_Action.EFFECT_ADD_NDEBUFF:
			if (effect.dataId >= 100) return !target.isMaxCDebuffAffected(effect.dataId - 100);
			return !target.isMaxNDebuffAffected(effect.dataId);
		case Game_Action.REMOVE_NBUFF:
			if (effect.dataId >= 100) return !target.isCBuffAffected(effect.dataId - 100);
			return target.isNBuffAffected(effect.dataId);
		case Game_Action.REMOVE_NDEBUFF:
			if (effect.dataId >= 100) return !target.isCDebuffAffected(effect.dataId - 100);
			return target.isNDebuffAffected(effect.dataId);
		default:
			return ICF.ParamCore.testItemEffect.call(this, target, effect);
	}
};

ICF.ParamCore.applyItemEffect = Game_Action.prototype.applyItemEffect;
Game_Action.prototype.applyItemEffect = function (target, effect) {
	switch (effect.code) {
		case Game_Action.EFFECT_ADD_NBUFF:
			if (effect.dataId >= 100) {
				effect.dataId -= 100;
				this.itemEffectAddCBuff(target, effect);
				effect.dataId += 100;
			} else this.itemEffectAddNBuff(target, effect);
			break;
		case Game_Action.EFFECT_ADD_NDEBUFF:
			if (effect.dataId >= 100) {
				effect.dataId -= 100;
				this.itemEffectAddCDebuff(target, effect);
				effect.dataId += 100;
			} else this.itemEffectAddNDebuff(target, effect);
			break;
		case Game_Action.EFFECT_REMOVE_NBUFF:
			if (effect.dataId >= 100) {
				effect.dataId -= 100;
				this.itemEffectRemoveCBuff(target, effect);
				effect.dataId += 100;
			} else this.itemEffectRemoveNBuff(target, effect);
			break;
		case Game_Action.EFFECT_REMOVE_NDEBUFF:
			if (effect.dataId >= 100) {
				effect.dataId -= 100;
				this.itemEffectRemoveCDebuff(target, effect);
				effect.dataId += 100;
			} else this.itemEffectRemoveNDebuff(target, effect);
			break;
		case Game_Action.EFFECT_NGROW:
			this.itemEffectGrowNParam(target, effect);
			break;
		case Game_Action.EFFECT_PGROW:
			this.itemEffectGrowPParam(target, effect);
			break;
		case Game_Action.EFFECT_CGROW:
			this.itemEffectGrowCParam(target, effect);
			break;
		default:
			ICF.ParamCore.applyItemEffect.call(this, target, effect);
	}
};

Game_Action.prototype.itemEffectAddNBuff = function (target, effect) {
	target.addNBuff(effect.dataId, effect.value1);
	this.makeSuccess(target);
};

Game_Action.prototype.itemEffectAddNDebuff = function (target, effect) {
	var chance = target.NDebuffRate(effect.dataId) * this.lukEffectRate(target);
	if (Math.random() < chance) {
		target.addNDebuff(effect.dataId, effect.value1);
		this.makeSuccess(target);
	}
};

Game_Action.prototype.itemEffectRemoveNBuff = function (target, effect) {
	if (target.isNBuffAffected(effect.dataId)) {
		target.removeNBuff(effect.dataId);
		this.makeSuccess(target);
	}
};

Game_Action.prototype.itemEffectRemoveNDebuff = function (target, effect) {
	if (target.isNDebuffAffected(effect.dataId)) {
		target.removeNBuff(effect.dataId);
		this.makeSuccess(target);
	}
};

Game_Action.prototype.itemEffectAddCBuff = function (target, effect) {
	target.addCBuff(effect.dataId, effect.value1);
	this.makeSuccess(target);
};

Game_Action.prototype.itemEffectAddCDebuff = function (target, effect) {
	var chance = target.CDebuffRate(effect.dataId) * this.lukEffectRate(target);
	if (Math.random() < chance) {
		target.addCDebuff(effect.dataId, effect.value1);
		this.makeSuccess(target);
	}
};

Game_Action.prototype.itemEffectRemoveCBuff = function (target, effect) {
	if (target.isCBuffAffected(effect.dataId)) {
		target.removeCBuff(effect.dataId);
		this.makeSuccess(target);
	}
};

Game_Action.prototype.itemEffectRemoveCDebuff = function (target, effect) {
	if (target.isCDebuffAffected(effect.dataId)) {
		target.removeCBuff(effect.dataId);
		this.makeSuccess(target);
	}
};

Game_Action.prototype.itemEffectGrowNParam = function (target, effect) {
	target.addNParam(effect.dataId, Math.floor(effect.value1));
	this.makeSuccess(target);
};

Game_Action.prototype.itemEffectGrowPParam = function (target, effect) {
	target.addPParam(effect.dataId, Math.floor(effect.value1));
	this.makeSuccess(target);
};

Game_Action.prototype.itemEffectGrowCParam = function (target, effect) {
	target.addCParam(effect.dataId, Math.floor(effect.value1));
	this.makeSuccess(target);
};

//=============================================================================
// Game_ActionResult
//=============================================================================

ICF.ParamCore.GARClear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function () {
	ICF.ParamCore.GARClear.call(this);
	this.addedNBuffs = [];
	this.addedNDebuffs = [];
	this.removedNBuffs = [];
};

Game_ActionResult.prototype.isNBuffAdded = function (paramId) {
	return this.addedNBuffs.contains(paramId);
};

Game_ActionResult.prototype.pushAddedNBuff = function (paramId) {
	if (!this.isNBuffAdded(paramId)) {
		this.addedNBuffs.push(paramId);
	}
};

Game_ActionResult.prototype.isNDebuffAdded = function (paramId) {
	return this.addedNDebuffs.contains(paramId);
};

Game_ActionResult.prototype.pushAddedNDebuff = function (paramId) {
	if (!this.isNDebuffAdded(paramId)) {
		this.addedNDebuffs.push(paramId);
	}
};

Game_ActionResult.prototype.isNBuffRemoved = function (paramId) {
	return this.removedNBuffs.contains(paramId);
};

Game_ActionResult.prototype.pushnRemovedBuff = function (paramId) {
	if (!this.isNBuffRemoved(paramId)) {
		this.removedNBuffs.push(paramId);
	}
};

//=============================================================================
// Game_Item
//=============================================================================

Game_Item.prototype.nparamTypes = function () {
	return this.traitDataTypesMod(24, 100);
};

Game_Item.prototype.pparamTypes = function () {
	return this.traitDataTypesMod(25, 100);
};

Game_Item.prototype.cparamTypes = function () {
	return this.traitDataTypesMod(26, 100);
};

Game_Item.prototype.paramTypes = function () {
	return this.traitDataTypesMod(21, 10);
};

Game_Item.prototype.xparamTypes = function () {
	return this.traitDataTypesMod(22, 10);
};

Game_Item.prototype.sparamTypes = function () {
	return this.traitDataTypesMod(23, 10);
};

//=============================================================================
// End of File
//=============================================================================
