/*:
 * @plugindesc v1.1 Awesome Codex Menu
 * @author TIKA
 *
 * @param ---CodexMainMenu---
 * @default
 *
 * @param CodexCategories
 * @parent ---CodexMainMenu---
 * @text CodexCategories
 * @type struct<CodexCategory>[]
 *
 * @param LoreCategories
 * @parent ---CodexMainMenu---
 * @text LoreCategories
 * @type struct<LoreCategory>[]
 *
 * @param InformationCategories
 * @parent ---CodexMainMenu---
 * @text InformationCategories
 * @type struct<InformationCategory>[]
 *
 * @param ---CodexBestiary---
 * @default
 *
 * @param BestiaryInfoWindow
 * @parent ---CodexBestiary---
 * @text BestiaryInfoWindow
 * @type struct<BestiaryWindow>
 *
 * @param ---CodexParty---
 * @default
 *
 * @param CodexPartyList
 * @parent ---CodexParty---
 * @text CodexPartyList
 * @type struct<CodexPartyList>[]
 *
 *
 *
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 * Enemy Description notetag:
 *
 *   <Description>
 *    Text
 *    Text
 *   </Description>
 *
 * This enemy description will be shown in the bestiary. <br> - Line break works here.
 *
 * ---------------------------------------------------------------------------------------------------
 *
 * Enemy Locations notetag:
 *
 *   <Locations>
 *    Location1
 *    Location2
 *        -
 *        -
 *   </Locations>
 *  NOTE: Do not put <br> (line break in here, line break is implicit with newline in the notebox)
 *
 * ---------------------------------------------------------------------------------------------------
 *
 * Enemy type notetag:
 *
 *  <Type: EnemyType>
 * Example: <Type: Snake>
 *
 * ---------------------------------------------------------------------------------------------------
 *
 * Enemy bestiary image notetag:
 *
 *  <BestiaryImage: nameOfTheImage>
 *
 * Example: <BestiaryImage: male1>
 *
 * IMPORTANT: Image has to be in folder img/pictures so that the final path is from example:
 *
 * img/pictures/male1
 *
 * Note: Do not write image extension in the notetag
 *
 * Scriptcall:
 *
 * TIKA.CM.backToPartyList(#indexOfPartyCategoryInCodex, #partyOptionSelectedIndex);
 *
 * indexOfPartyCategoryInCodex - Index of the party category in the codex menu. Index in the CodexCategory plugin param can be used
 * partyOptionSelectedIndex - index of the item that is selected before the CE was ran
 *
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Timestamp: 09.10.2020 20:40 Fixed naming of enemies encountered in the bestiary
 *
 * Timestamp: 30.03.2020 18:20 Updated scriptcall for getting back to codex party, and pushing Scene_Map on the selection of party option.
 *
 * Timestamp: 29.03.2020 15:05 Added option for party menu in codex, and to run common events menus in codex menu
 *
 * Timestamp: 25.03.2020 22:34 Added new notetag for the enemy bestiary image: <BestiaryImage: nameOfTheImage>
 *
 * Version v1.1
 * Autopopulation while browsing the menues implemented
 *
 * Version v1.0
 * Finished plugin!
 *
 *
 */
/*~struct~CodexCategory:
* @param CategoryName
* @type text
*
*
* @param MainBind
* @type text
*/

/*~struct~BestiaryWindow:
* @param FontSize
* @text Font size:
* @default 20
*
* @param Padding
* @text Padding:
* @default 22
*
* @param TitlesFontSize
* @text Title Font size:
* @default 24
*
* @param BeastInfoYoffset
* @text BeastInfoYoffset:
* @default 50
*
* @param LocationXoffset
* @text LocationXoffset:
* @default 30
*
* @param ItemsXoffset
* @text ItemsXoffset:
* @default 0
*
* @param PictureScale
* @text Picture Scale:
* @default 150
*
*/

/*~struct~LoreCategory:
* @param CategoryName
* @type text
*
* @param Entries
* @text Entries
* @type struct<LoreEntry>[]
*/

/*~struct~CodexPartyList:
* @param PartyListItemName
* @type text
*
*
* @param CommonEventToRun
* @type number
*/

/*~struct~LoreEntry:
* @param EntryID
* @type number
*
* @param EntryName
* @type text
*
* @param ---Image---
* @default
*
* @param ImageName
* @type text
* @parent ---Image---
*
* @param PictureScale
* @type number
* @default 100
* @parent ---Image---
*
* @param PictureAlign
* @type select
* @option left
* @option right
* @option center
* @default left
* @parent ---Image---
*
* @param ---Updates---
* @default
*
* @param Description
* @text DescriptionUpdates
* @type text[]
* @parent ---Updates---
*
* @param ---Params---
* @parent ---Updates---
* @default
*
* @param Param1
* @type text
* @parent ---Params---
*
* @param Param1Updates
* @text Param1Updates
* @type text[]
* @parent ---Params---
*
* @param Param2
* @type text
* @parent ---Params---
*
* @param Param2Updates
* @text Param2Updates
* @type text[]
* @parent ---Params---
*
* @param Param3
* @type text
* @parent ---Params---
*
* @param Param3Updates
* @text Param3Updates
* @type text[]
* @parent ---Params---
*
* @param Param4
* @type text
* @parent ---Params---
*
* @param Param4Updates
* @text Param4Updates
* @type text[]
* @parent ---Params---
*
* @param Param5
* @type text
* @parent ---Params---
*
* @param Param5Updates
* @text Param5Updates
* @type text[]
* @parent ---Params---
*
* @param Param6
* @type text
* @parent ---Params---
*
* @param Param6Updates
* @text Param6Updates
* @type text[]
* @parent ---Params---
*
* @param Param7
* @type text
* @parent ---Params---
*
* @param Param7Updates
* @text Param7Updates
* @type text[]
* @parent ---Params---
*
* @param Param8
* @type text
* @parent ---Params---
*
* @param Param8Updates
* @text Param8Updates
* @type text[]
* @parent ---Params---
*
* @param ParamListOrientation
* @type select
* @option horizontal
* @option vertical
* @default horizontal
* @parent ---Params---
*
*/

/*~struct~InformationCategory:
* @param CategoryName
* @type text
*
* @param Entries
* @text Entries
* @type struct<InformationEntry>[]
*/

/*~struct~InformationEntry:
*
* @param EntryName
* @type text
*
* @param Pages
* @text Pages:
* @type struct<Page>[]
*/

/*~struct~Page:
*
* @param Overview
* @type text
*
* @param ---Images---
* @default
*
* @param Image1
* @type text
* @parent ---Images---
*
* @param Image2
* @type text
* @parent ---Images---
*/

var Imported = Imported || {};
Imported.TIKA_Codex = true;
var TIKA = TIKA || {};


TIKA.version = 1.00;

TIKA.CM = TIKA.CM || {};
TIKA.CM.Param = TIKA.CM.Param || {};
TIKA.Parameters = PluginManager.parameters('TIKA_Codex');


TIKA.CM.Param.BestiaryWindow = JSON.parse(TIKA.Parameters['BestiaryInfoWindow']);

TIKA.CM.Param.CodexCategories = JSON.parse(TIKA.Parameters['CodexCategories']);
for (var i = 0; i < TIKA.CM.Param.CodexCategories.length; i++) {
    TIKA.CM.Param.CodexCategories[i] = JSON.parse(TIKA.CM.Param.CodexCategories[i]);
}

TIKA.CM.Param.LoreCategories = JSON.parse(TIKA.Parameters['LoreCategories']);
for (var i = 0; i < TIKA.CM.Param.LoreCategories.length; i++) {
    TIKA.CM.Param.LoreCategories[i] = JSON.parse(TIKA.CM.Param.LoreCategories[i]);
    if (TIKA.CM.Param.LoreCategories[i].Entries) {
        TIKA.CM.Param.LoreCategories[i].Entries = JSON.parse(TIKA.CM.Param.LoreCategories[i].Entries);
        parseLoreEntries(TIKA.CM.Param.LoreCategories[i].Entries);
    }
}

TIKA.CM.Param.PartyList = JSON.parse(TIKA.Parameters['CodexPartyList']);
for (var i = 0; i < TIKA.CM.Param.PartyList.length; i++) {
    TIKA.CM.Param.PartyList[i] = JSON.parse(TIKA.CM.Param.PartyList[i]);
}

function parseLoreEntries(entries) {
    for (var i = 0; i < entries.length; i++) {
        entries[i] = JSON.parse(entries[i]);
        if (entries[i].Description) {
            entries[i].Description = JSON.parse(entries[i].Description);
        }
        this.parseLoreEntryParams(entries[i]);
    }
}

function parseLoreEntryParams(entry) {
    // 8 - Max number of entry params
    for (var i = 1; i <= 8; i++) {
        if (entry[`Param${i}Updates`]) {
            entry[`Param${i}Updates`] = JSON.parse(entry[`Param${i}Updates`]);
        }
    }
}

TIKA.CM.Param.InformationCategories = JSON.parse(TIKA.Parameters['InformationCategories']);
for (var i = 0; i < TIKA.CM.Param.InformationCategories.length; i++) {
    TIKA.CM.Param.InformationCategories[i] = JSON.parse(TIKA.CM.Param.InformationCategories[i]);
    if (TIKA.CM.Param.InformationCategories[i].Entries) {
        TIKA.CM.Param.InformationCategories[i].Entries = JSON.parse(TIKA.CM.Param.InformationCategories[i].Entries);
        parseInformationEntries(TIKA.CM.Param.InformationCategories[i].Entries);
    }
}

function parseInformationEntries(entries) {
    for (var i = 0; i < entries.length; i++) {
        if (!entries[i]) continue; 0
        entries[i] = JSON.parse(entries[i]);
        if (entries[i].Pages) {
            entries[i].Pages = JSON.parse(entries[i].Pages);
            this.parseEntryPages(entries[i].Pages);
        }
    }
}

function parseEntryPages(pages) {
    for (var i = 0; i < pages.length; i++) {
        if (pages[i]) {
            pages[i] = JSON.parse(pages[i]);
        }
    }
}

// Information on where to go when backToPartyList function is called
var backToPartyList = null;

(function () {

    // ============================================================================
    //                       DataManager
    // ============================================================================

    var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!DataManager_isDatabaseLoaded.call(this)) return false;

        this.processEnemyNotetags();

        return true;
    };


    DataManager.processEnemyNotetags = function () {
        for (var i = 1; i < $dataEnemies.length; i++) {
            if ($dataEnemies[i].name) {
                if ($dataEnemies[i].meta.Type)
                    $dataEnemies[i]._type = $dataEnemies[i].meta.Type;
                if ($dataEnemies[i].meta.BestiaryImage)
                    $dataEnemies[i]._img = $dataEnemies[i].meta.BestiaryImage.trim();
                $dataEnemies[i]._description = this.processEnemyDescription($dataEnemies[i]);
                $dataEnemies[i]._locations = this.processEnemyLocations($dataEnemies[i]);
            }
        }
    }

    DataManager.processEnemyDescription = function (obj) {
        var description = '';
        var evalMode = 'none';
        notedata = this.convertNotedataToArray(obj.note);
        for (var i = 0; i < notedata.length; i++) {
            var line = notedata[i];
            if (line.match(/<Description>/i)) {
                evalMode = 'description';
                description = '';
            } else if (line.match(/<\/Description>/i)) {
                evalMode = 'none';
            } else if (evalMode === 'description') {
                description += line + ' ';
            }
        }
        return description;
    }

    DataManager.processEnemyLocations = function (obj) {
        var locations = [];
        var evalMode = 'none';
        notedata = this.convertNotedataToArray(obj.note);
        for (var i = 0; i < notedata.length; i++) {
            var line = notedata[i];
            if (line.match(/<Locations>/i)) {
                evalMode = 'location';
            } else if (line.match(/<\/Locations>/i)) {
                evalMode = 'none';
            } else if (evalMode === 'location') {
                locations.push(line);
            }
        }
        return locations;
    }

    DataManager.convertNotedataToArray = function (notedata) {
        var comment = '';
        var length = notedata.length;
        for (var i = 0; i < length; ++i) {
            var ev = notedata[i];
            if ([62, 59, 13].contains(ev.charCodeAt(0))) {
                comment += notedata[i] + '\n';
            } else
                comment += notedata[i];
        }
        return comment.split(/[\r\n]+/);
    };

    // ============================================================================
    //                       Scene_Menu
    // ============================================================================


    var Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('codex', this.commandCodex.bind(this));
    };

    Scene_Menu.prototype.commandCodex = function () {
        SceneManager.push(Scene_Codex);
    };

    // ============================================================================
    //                       Game_Enemy
    // ============================================================================
    var Game_Enemy_initialize = Game_Enemy.prototype.initialize;
    Game_Enemy.prototype.initialize = function (enemyId, x, y) {
        Game_Enemy_initialize.call(this, enemyId, x, y);
        if (!this.isEncountered(this))
            $gameParty._encounteredEnemies.push(this);
    };

    Game_Enemy.prototype.isEncountered = function (newEnemy) {
        var encountered = false;
        $gameParty._encounteredEnemies.find(function (enemy) {
            if (newEnemy.originalName() == enemy.originalName()) {
                encountered = true;
            }
        });
        return encountered;
    };


    var Game_Enemy_performCollapse = Game_Enemy.prototype.performCollapse;
    Game_Enemy.prototype.performCollapse = function () {
        Game_Enemy_performCollapse.call(this);
        var that = this;
        $gameParty._encounteredEnemies.forEach(function (enemy) {
            if (enemy.originalName() == that.originalName()) {
                if (enemy.enemy().defeated)
                    enemy.enemy().defeated += 1;
                else
                    enemy.enemy().defeated = 1;
            }
        });
    };

    // ============================================================================
    //                       Scene_Codex
    // ============================================================================
    Scene_Codex.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_Codex.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createInterpreter();
        this.createCommonEventMenuWindows();
        this.createCodexTitleWindow();
        this.createSelectedCategoryTitleWindow();
        this.createCategoriesWindow();
        this.createCodexSubMenu();
        this.createCategorySubMenu();
        this.createInfoPanel();
        this.createTraitsWindow();
        //options
        this.createOptionsWindow();
        this.createHelpWindow();
        //questJournal
        this.runCustomCode(Yanfly.Quest.createBefore);
        this.createDataWindow();
        this.createTitleWindow();
        this.createCategoryWindow();
        this.createListWindow();
        this.processQuestOpen();
        this.runCustomCode(Yanfly.Quest.createAfter);
        //information
        this.createPaginationWindow();

        if (backToPartyList) {
            var scene = SceneManager._scene;
            if (scene instanceof Scene_Codex && scene._codexSubMenu) {
                for (var i = 0; i < backToPartyList.codexIndex; i++) {
                    scene._codexWindow.cursorDown();
                }
                scene._codexWindow.deactivate();
                scene._codexSubMenu.select(backToPartyList.partyItemIndex);
                scene._codexSubMenu.activate();
                scene._codexSubMenu.refresh();
            }
        }
    };

    Scene_Codex.prototype.createInterpreter = function () {
        this._interpreter = new Game_Interpreter();
    };

    Scene_Codex.prototype.createCodexTitleWindow = function () {
        var wx = 0;
        var wy = 0;
        var ww = 240;
        var wh = Graphics.boxHeight;
        this._codexTitleWindow = new Window_Title(wx, wy, ww, wh);
        this._codexTitleWindow.height = this._codexTitleWindow.fittingHeight(1);
        this._codexTitleWindow.refresh();
        this.addWindow(this._codexTitleWindow);
    };

    Scene_Codex.prototype.createSelectedCategoryTitleWindow = function () {
        var wx = this._codexTitleWindow.width;
        var wy = 0;
        var ww = 240;
        var wh = Graphics.boxHeight;
        this._selectedCategotyTitleWindow = new Window_Title(wx, wy, ww, wh);
        this._selectedCategotyTitleWindow.height = this._selectedCategotyTitleWindow.fittingHeight(1);
        this._selectedCategotyTitleWindow.refresh();
        this.addWindow(this._selectedCategotyTitleWindow);
    };

    Scene_Codex.prototype.createCategoriesWindow = function () {
        var wy = this._codexTitleWindow.height;
        this._codexWindow = new Window_CodexCategories(0, wy);
        this._codexWindow.height = Graphics.boxHeight - wy;
        this._codexWindow.refresh();
        this.setCategoriesHandlers();
        this._codexWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._codexWindow);
    };

    Scene_Codex.prototype.createCodexSubMenu = function () {
        var wy = this._selectedCategotyTitleWindow.height;
        var wx = this._codexTitleWindow.width;
        this._codexSubMenu = new Window_CodexSubMenu(wx, wy);
        this._codexSubMenu.height = Graphics.boxHeight - wy;
        this._codexSubMenu.refresh();
        this._codexSubMenu.setHandler('beast', this.switchPage.bind(this));
        this._codexSubMenu.setHandler('party', this.onPartyOptionlistOk.bind(this));
        this._codexSubMenu.setHandler('loreCategory', this.onLoreCategoryOk.bind(this));
        this._codexSubMenu.setHandler('information', this.onInformationCategoryOk.bind(this));
        this._codexSubMenu.setHandler('cancel', this.backFromSubMenu.bind(this));
        this._codexSubMenu.deactivate();
        this._codexSubMenu.deselect();
    };

    Scene_Codex.prototype.createCategorySubMenu = function () {
        var wy = this._codexSubMenu.y;
        var wx = this._codexSubMenu.x;
        this._categorySubMenu = new Window_CategorySubMenu(wx, wy);
        this._categorySubMenu.height = this._codexSubMenu.height;
        this._categorySubMenu.refresh();
        this._categorySubMenu.setHandler('biography', this.showBiographyInfo.bind(this));
        this._categorySubMenu.setHandler('information', this.showInformationInfo.bind(this));
        this._categorySubMenu.setHandler('cancel', this.backFromCategorySubMenu.bind(this));
        this.addWindow(this._categorySubMenu);
        this._categorySubMenu.deselect();
        this._categorySubMenu.deactivate();
        this._categorySubMenu.hide();
        this.addWindow(this._codexSubMenu);//Hacky way to add CodexSubMenu in front of CategorySubMenu
    };

    Scene_Codex.prototype.createInfoPanel = function () {
        var wy = 0;
        var wx = this._codexWindow.width + this._codexSubMenu.width;
        var ww = Graphics.width - wx;
        var wh = Graphics.boxHeight - wy;
        this._infoPanelWindow = new Window_InfoPanel(wx, wy, ww, wh);
        this._infoPanelWindow.setHandler('ok', this.switchPage.bind(this));
        this._infoPanelWindow.setHandler('cancel', this.backToCodexSubmenu.bind(this));
        this.addWindow(this._infoPanelWindow);
    };

    Scene_Codex.prototype.createPaginationWindow = function () {
        var wy = Graphics.boxHeight;
        var wx = Graphics.boxWidth;
        this._paginationWindow = new Window_Pagination(wx, wy);
        this._paginationWindow.x = wx - this._infoPanelWindow.width / 2 - this._infoPanelWindow.padding * 2 - this._paginationWindow.width / 2;
        this._paginationWindow.y = wy - this._paginationWindow.height;
        this._paginationWindow.setHandler('increase', this.increasePage.bind(this));
        this._paginationWindow.setHandler('decrease', this.decreasePage.bind(this));
        this._paginationWindow.setHandler('cancel', this.backFromPagination.bind(this));
        this.addWindow(this._paginationWindow);
        this._paginationWindow.deactivate();
        this._paginationWindow.deselect();
        this._paginationWindow.hide();
    };

    Scene_Codex.prototype.createTraitsWindow = function () {
        this._traitsWindow = new Window_Traits();
        this._traitsWindow.x = this._infoPanelWindow.x;
        this._traitsWindow.width = this._infoPanelWindow.width;
        this._traitsWindow.refresh();
        this._traitsWindow.setHandler('ok', this.switchPage.bind(this));
        this._traitsWindow.setHandler('cancel', this.backToCodexSubmenu.bind(this));
        this._traitsWindow.refresh();
        this._traitsWindow.hide();
        this._traitsWindow.deactivate();
        this.addWindow(this._traitsWindow);
    };

    //Options
    Scene_Codex.prototype.createOptionsWindow = function () {
        var wx = this._codexWindow.width;
        var wy = 0;
        var ww = 400;
        var wh = 400;
        this._optionsWindow = new Window_Options(wx, wy, ww, wh);
        this._optionsWindow.setHandler('keyConfig', this.commandKeyConfig.bind(this));
        this._optionsWindow.setHandler('cancel', this.saveConfig.bind(this));
        this.addWindow(this._optionsWindow);
        this._optionsWindow.hide();
        this._optionsWindow.deactivate();
        this._optionsWindow.deselect();
    };

    Scene_Codex.prototype.refreshWindows = function () {
        this._configWindow.refresh();
        this._configWindow.activate();
        ConfigManager.save();
    };

    Scene_Codex.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Help();
        this.addWindow(this._helpWindow);
        this._helpWindow.hide();
    };

    //QuestJournal
    Scene_Codex.prototype.createDataWindow = function () {
        this._dataWindow = new Window_QuestData();
        this._dataWindow.y = this._codexTitleWindow.height;
        this._dataWindow.x = this._codexWindow.width + this._codexSubMenu.width + 30;
        this._dataWindow.width = Graphics.boxWidth - this._dataWindow.x;
        this._dataWindow.height = Graphics.boxHeight - this._dataWindow.y
        this._dataWindow.refresh();
        this._dataWindow.setHandler('cancel', this.onDataCancel.bind(this));
        this.addWindow(this._dataWindow);
        this._dataWindow.hide();
    };

    Scene_Codex.prototype.createTitleWindow = function () {
        this._titleWindow = new Window_QuestTitle();
        this._titleWindow.x = this._codexWindow.width;
        this._titleWindow.height = this._codexTitleWindow.height;
        this._titleWindow.width = Graphics.boxWidth - this._titleWindow.x;
        this._titleWindow.refresh();
        this.addWindow(this._titleWindow);
        this._titleWindow.hide();
    };

    Scene_Codex.prototype.createCategoryWindow = function () {
        //this._categoryWindow = new Window_QuestCategories(this._codexWindow.width, this._titleWindow.height, this._codexSubMenu.width + 30);
        this._categoryWindow = new Window_QuestCategories();
        this._categoryWindow.x = this._codexWindow.width;
        this._categoryWindow.y = this._titleWindow.height;
        this._categoryWindow.width = this._codexSubMenu.width + 30;
        this._categoryWindow.refresh();
        this._categoryWindow.setHandler('category', this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
        this.addWindow(this._categoryWindow);
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this._categoryWindow.deselect();
    };

    Scene_Codex.prototype.createListWindow = function () {
        this._listWindow = new Window_QuestList(this._categoryWindow, this._dataWindow, this._titleWindow);
        this._listWindow.x = this._categoryWindow.x;
        this._listWindow.y = this._categoryWindow.y + this._categoryWindow.height;
        this._listWindow.height = Graphics.boxHeight - this._listWindow.y;
        this._listWindow.width = this._codexSubMenu.width + 30;
        this._listWindow.refresh();
        this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
        this._listWindow.setHandler('type', this.onListTypeToggle.bind(this));
        this._listWindow.setHandler('quest', this.onListQuest.bind(this));
        this._listWindow.setHandler('readQuest', this.dataWindowActivate.bind(this));
        this.addWindow(this._listWindow);
        this._listWindow.hide();
        this._listWindow.deactivate();
    };

    Scene_Codex.prototype.runCustomCode = function (code) {
        var background = this._backgroundSprite;
        var windowLayer = this._windowLayer;
        eval(code);
    };

    Scene_Codex.prototype.onCategoryCancel = function () {
        this.runCustomCode(Yanfly.Quest.terminateMenu);
        this._categorySubMenu.deactivate();
        this._codexSubMenu.deactivate();
        this._listWindow.hide();
        this._dataWindow.hide();
        this._titleWindow.hide();
        this._categoryWindow.hide();
        this._categoryWindow.deselect();
        this._categoryWindow.deactivate();
        this._codexWindow.activate();
    };

    Scene_Codex.prototype.onCategoryOk = function () {
        this._listWindow.activate();
        if (this._listWindow.index() < 0) this._listWindow.select(0);
    };

    Scene_Codex.prototype.isQuestExtraCommand = function () {
        return false;
    };

    Scene_Codex.prototype.onListCancel = function () {
        this._listWindow.deselect();
        if (this._listWindow._mode === 'Extra') {
            this._listWindow.setMode('Quest');
        } else {
            this._categoryWindow.activate();
        }
    };

    Scene_Codex.prototype.onListTypeToggle = function () {
        this._listWindow.activate();
        this._listWindow.typeToggle(this._listWindow.currentExt());
    };

    Scene_Codex.prototype.onListQuest = function () {
        if (this.isQuestExtraCommand()) {
            this._listWindow.setMode('Extra');
        } else {
            this.dataWindowActivate();
        }
    };

    Scene_Codex.prototype.dataWindowActivate = function () {
        this._dataWindow.activate();
    };

    Scene_Codex.prototype.onDataCancel = function () {
        if (this._dataWindow._mode === 'Extra') {
            this._listWindow.setMode('Quest');
        } else {
            this._dataWindow.deactivate();
            this._listWindow.activate();
        }
    };

    Scene_Codex.prototype.processQuestOpen = function () {
        var questId = $gameTemp.getQuestOpen();
        if (questId) {
            var categoryOrder = this.getQuestOpenCategories();
            var length = categoryOrder.length;
            for (var i = 0; i < length; ++i) {
                var category = categoryOrder[i];
                var index = this._categoryWindow.findExt(category);
                if (index >= 0) break;
            }
            this._categoryWindow.selectExt(index);
            this.onCategoryOk();
            this._categoryWindow.deactivate();
            this._listWindow.selectExt(questId);
            this.onListQuest();
            this._listWindow.deactivate();
            this._listWindow.setTopRow(this._listWindow.findExt(questId));
            var scrollTimes = Math.floor(this._listWindow.getVisibleRows() / 2);
            while (scrollTimes--) {
                this._listWindow.scrollUp();
            }
            this._listWindow.ensureCursorVisible();
            this._listWindow.updateCursor();
        }
        $gameTemp.clearQuestOpen();
    };

    Scene_Codex.prototype.getQuestOpenCategories = function () {
        return ['available', 'completed', 'failed', 'all'];
    };


    Scene_Codex.prototype.centerSprite = function (sprite) {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    };

    Scene_Codex.prototype.fitScreen = function (sprite) {
        if (sprite.bitmap.width <= 0 || sprite.bitmap <= 0) {
            return setTimeout(this.fitScreen.bind(this, sprite), 5);
        }
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var ratioX = width / sprite.bitmap.width;
        var ratioY = height / sprite.bitmap.height;
        if (ratioX > 1.0) sprite.scale.x = ratioX;
        if (ratioY > 1.0) sprite.scale.y = ratioY;
        this.centerSprite(sprite);
    };

    Scene_Codex.prototype.commandDefault = function () {
        ConfigManager.keyMapper =
            JSON.parse(JSON.stringify(ConfigManager.defaultMap));
        ConfigManager.applyKeyConfig();
        this.refreshWindows();
    };

    Scene_Codex.prototype.commandWasd = function () {
        ConfigManager.keyMapper = JSON.parse(JSON.stringify(ConfigManager.wasdMap));
        ConfigManager.applyKeyConfig();
        this.refreshWindows();
    };

    Scene_Codex.prototype.commandKey = function () {
        this._actionWindow.select(0);
        this._actionWindow.open();
        this._actionWindow.activate();
    };

    Scene_Codex.prototype.onActionCancel = function () {
        this._actionWindow.close();
        this._actionWindow.deactivate();
        this._configWindow.activate();
    };

    Scene_Codex.prototype.onActionOk = function () {
        var action = this._actionWindow.currentExt();
        var name = this._configWindow.commandName(this._configWindow.index());
        var key = Window_KeyConfig._refId[name];
        if (action === 'clear') {
            ConfigManager.keyMapper[key] = undefined;
        } else {
            ConfigManager.keyMapper[key] = action;
        }
        SoundManager.playEquip();
        ConfigManager.applyKeyConfig();
        this.onActionCancel();
        this.refreshWindows();
    };

    Scene_Codex.prototype.commandExit = function () {
        if (!this.canExit()) {
            SoundManager.playBuzzer();
            this._configWindow.activate();
            return;
        }
        this._configWindow.hide();
        this._configWindow.deactivate();
        this._actionWindow.hide();
        this._helpWindow.hide();
        this._optionsWindow.activate();
    };

    Scene_Codex.prototype.canExit = function () {
        if (!Imported.YEP_ButtonCommonEvents) return true;
        for (var i = 0; i < Yanfly.KeyConfig.RequiredCommonEvents.length; ++i) {
            var commonEventId = Yanfly.KeyConfig.RequiredCommonEvents[i];
            if (!this.isCommonEventBound(commonEventId)) return false;
        }
        return true;
    };

    Scene_Codex.prototype.isCommonEventBound = function (id) {
        var length = Window_KeyConfig._keyLayout.length;
        for (var i = 0; i < length; ++i) {
            var key = Window_KeyConfig._refId[this._configWindow.commandName(i)];
            var action = Input.keyMapper[key];
            if (Yanfly.Param.BCEList[action] === id) return true;
        }
        return false;
    };

    Scene_Codex.prototype.setCategoriesHandlers = function () {
        var categories = TIKA.CM.Param.CodexCategories;
        for (var i = 0; i < categories.length; i++) {
            this._codexWindow.setHandler(categories[i].CategoryName.toLowerCase(), eval(categories[i].MainBind));
        }
    };


    Scene_Codex.prototype.commandBestiary = function () {
        var category = this._codexWindow.currentExt();
        this._codexSubMenu.setCategory(category);
        this._infoPanelWindow.setCategory(category);
        this._categorySubMenu.deactivate();
        this._codexSubMenu.makeCommandList();
        this._codexSubMenu.select(0);
        this._codexSubMenu.activate();
        this._codexSubMenu.show();
        this._codexSubMenu.refresh();
    }

    // NEW
    Scene_Codex.prototype.commandParty = function () {
        var category = this._codexWindow.currentExt();
        this._codexSubMenu.setCategory(category);
        this._categorySubMenu.deactivate();
        this._codexSubMenu.makeCommandList();
        this._codexSubMenu.select(0);
        this._codexSubMenu.activate();
        this._codexSubMenu.show();
        this._codexSubMenu.refresh();
    }

    Scene_Codex.prototype.commandLore = function () {
        var category = this._codexWindow.currentExt();
        this._codexSubMenu.setCategory(category);
        this._infoPanelWindow.setCategory(category);
        this._codexSubMenu.makeCommandList();
        this._codexSubMenu.select(0);
        this._codexSubMenu.activate();
        this._categorySubMenu.show();
        this._categorySubMenu.deactivate();
        this._codexSubMenu.show();
        this._codexSubMenu.refresh();
    }

    Scene_Codex.prototype.commandQuestJournal = function () {
        var category = this._codexWindow.currentExt();
        this._codexSubMenu.setCategory(category);
        this._listWindow.show();
        this._categoryWindow.show();
        this._dataWindow.show();
        this._titleWindow.show();
        this._codexSubMenu.deactivate();
        this._categorySubMenu.deactivate();
        this._traitsWindow.deactivate();
        this._categoryWindow.activate();
        this._categoryWindow.select(0);
    }

    Scene_Codex.prototype.previewQuestJournal = function () {
        this._listWindow.show();
        this._categoryWindow.show();
        this._categorySubMenu.deactivate();
        this._traitsWindow.deactivate();
        this._dataWindow.show();
        this._titleWindow.show();
    }

    Scene_Codex.prototype.hideQuestJournal = function () {
        this._listWindow.hide();
        this._categoryWindow.hide();
        this._dataWindow.hide();
        this._titleWindow.hide();
    }

    Scene_Codex.prototype.commandInformation = function () {
        var category = this._codexWindow.currentExt();
        this._codexSubMenu.setCategory(category);
        this._infoPanelWindow.setCategory(category);
        this._codexSubMenu.makeCommandList();
        this._codexSubMenu.select(0);
        this._codexSubMenu.activate();
        this._categorySubMenu.show();
        this._categorySubMenu.deactivate();
        this._codexSubMenu.show();
        this._codexSubMenu.refresh();
    }

    Scene_Codex.prototype.commandOptions = function () {
        this._selectedCategotyTitleWindow.width = Graphics.boxWidth - this._selectedCategotyTitleWindow.x;
        this._infoPanelWindow.hide();
        this._categorySubMenu.deactivate();
        this._optionsWindow.show();
        this._optionsWindow.activate();
        this._optionsWindow.updatePlacement();
        this._optionsWindow.select(0);
    }

    Scene_Codex.prototype.previewOptions = function () {
        if (this._optionsWindow.visible) return;
        this._selectedCategotyTitleWindow.width = Graphics.boxWidth - this._selectedCategotyTitleWindow.x;
        this._infoPanelWindow.hide();
        this._optionsWindow.show();
        this._optionsWindow.updatePlacement();
    }

    Scene_Codex.prototype.hideOptions = function () {
        if (!this._optionsWindow.visible) return;
        this._selectedCategotyTitleWindow.width = 240;
        this._infoPanelWindow.show();
        this._optionsWindow.hide();
        this._optionsWindow.updatePlacement();
    }

    Scene_Codex.prototype.increasePage = function () {
        if (this.possibleIncreasePage()) {
            this._infoPanelWindow._currentPage += 1;
            this._paginationWindow._currentPage += 1;
            this._paginationWindow.activate();
            this._infoPanelWindow.refresh();
            this._paginationWindow.refresh();
        } else
            this._paginationWindow.activate();
    }

    Scene_Codex.prototype.possibleIncreasePage = function () {
        if (this._infoPanelWindow._currentPage + 1 >= this._infoPanelWindow._totalPages)
            return false;
        else
            return true;
    }

    Scene_Codex.prototype.decreasePage = function () {
        if (this.possibleDecreasePage()) {
            this._infoPanelWindow._currentPage -= 1;
            this._paginationWindow._currentPage -= 1;
            this._paginationWindow.activate();
            this._infoPanelWindow.refresh();
            this._paginationWindow.refresh();
        } else
            this._paginationWindow.activate();
    }


    Scene_Codex.prototype.possibleDecreasePage = function () {
        if (this._infoPanelWindow._currentPage - 1 < 0)
            return false;
        else
            return true;
    }

    Scene_Codex.prototype.backFromPagination = function () {
        this._infoPanelWindow._currentPage = 0;
        this._paginationWindow.deselect();
        this._paginationWindow.deactivate();
        this._categorySubMenu.activate();
    }

    Scene_Codex.prototype.backFromSubMenu = function () {
        this._codexSubMenu.resetPlacement();
        this._codexSubMenu.deselect();
        this._codexSubMenu.deactivate();
        this._codexWindow.activate();
        this._categorySubMenu.deactivate();
        this._categorySubMenu.clearContents();
        this._infoPanelWindow.clearContents();
    }

    Scene_Codex.prototype.showBeastInfo = function () {
        var beast = $gameParty._encounteredEnemies[this._codexSubMenu.currentExt()];
        if (!beast) {
            return;
        }
        this._infoPanelWindow.setObject(beast);
        this._traitsWindow.setObject(beast);
        this._traitsWindow.refresh();
        this._categorySubMenu.deactivate();
        this._infoPanelWindow.refresh();
    }

    Scene_Codex.prototype.backToCodexSubmenu = function () {
        if (this._traitsWindow.visible)
            this._traitsWindow.hide();
        this._codexSubMenu.activate();
    }

    Scene_Codex.prototype.switchPage = function () {
        if (this._codexSubMenu._category == 'bestiary')
            if (!this._traitsWindow.visible) {
                this._traitsWindow.show();
                this._traitsWindow.activate();
            } else {
                this._traitsWindow.hide();
                this._infoPanelWindow.activate();
            }
    }

    //NEW - What to do when clicked?
    Scene_Codex.prototype.onPartyOptionlistOk = function () {
        var commonEventId = this._codexSubMenu.currentExt();
        $gameTemp.reserveCommonEvent(commonEventId);
        SceneManager.push(Scene_Map);
        // Save stack because after Scene_Map is pushed to stack, stack is cleared
        $gameTemp._stack = SceneManager._stack;
        // this._interpreter.setupReservedCommonEvent();
        // this._interpreter.update();
    }

    Scene_Codex.prototype.onLoreCategoryOk = function () {
        this._categorySubMenu.setCategory(this._codexSubMenu.currentExt());
        this._categorySubMenu.makeCommandList();
        this._categorySubMenu.activate();
        this._categorySubMenu.show();
        this._categorySubMenu.refresh();
        this._categorySubMenu.select(0);
        var categotryName = this._codexSubMenu._list[this._codexSubMenu.index()].name;
        this._selectedCategotyTitleWindow.drawTitle(categotryName);
    }

    Scene_Codex.prototype.onInformationCategoryOk = function () {
        this._categorySubMenu.setCategory(this._codexSubMenu.currentExt());
        this._categorySubMenu.makeCommandList();
        this._categorySubMenu.refresh();
        this._categorySubMenu.activate();
        this._categorySubMenu.show();
        this._categorySubMenu.select(0);
        var categotryName = this._codexSubMenu._list[this._codexSubMenu.index()].name;
        this._selectedCategotyTitleWindow.drawTitle(categotryName);
    }

    Scene_Codex.prototype.backFromCategorySubMenu = function () {
        this._categorySubMenu.setCategory('');
        this._categorySubMenu.refresh();
        this._categorySubMenu.deactivate();
        this._categorySubMenu.deselect();
        this._categorySubMenu.contents.clear();
        this._codexSubMenu.show();
        this._codexSubMenu.activate();
        this._paginationWindow.hide();
        this._infoPanelWindow.clearContents();
    }

    Scene_Codex.prototype.showBiographyInfo = function () {
        if (!this._categorySubMenu._list.length) return;
        var category = this.findCategory(TIKA.CM.Param.LoreCategories);
        var entry = this.findEntry(category.Entries);
        this._infoPanelWindow.setObject(entry);
        this._infoPanelWindow.refresh();
        this._categorySubMenu.activate();
    }

    Scene_Codex.prototype.showInformationInfo = function () {
        var category = this.findCategory(TIKA.CM.Param.InformationCategories);
        if (category)
            var entry = this.findEntry(category.Entries);
        else {
            var entry = this.findEntry();
        }
        this._infoPanelWindow.setObject(entry);
        this._infoPanelWindow.refresh();
        this._paginationWindow.show();
        this._paginationWindow.activate();
        this._paginationWindow.select(1);
    }

    Scene_Codex.prototype.previewInformationInfo = function () {
        if (!this._categorySubMenu._list.length) return;
        var category = this.findCategory(TIKA.CM.Param.InformationCategories);
        if (category)
            var entry = this.findEntry(category.Entries);
        else {
            var entry = this.findEntry();
        }
        this._infoPanelWindow.setObject(entry);
        this._infoPanelWindow.refresh();
        this._paginationWindow.show();
    }

    Scene_Codex.prototype.saveConfig = function () {
        ConfigManager.save();
        this._optionsWindow.hide();
        this._categorySubMenu.deactivate();
        this._categorySubMenu.show();
        this._infoPanelWindow.show();
        this._selectedCategotyTitleWindow.width = 240;
        this._codexWindow.activate();
        this._optionsWindow.deselect();
    }

    Scene_Codex.prototype.commandKeyConfig = function () {
        this._helpWindow.show();
        this._actionWindow.show();
        this._configWindow.show();
        this._configWindow.activate();
    };

    Scene_Codex.prototype.findCategory = function (categories) {
        var categoryName = this._codexSubMenu.commandName(this._codexSubMenu.index());
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].CategoryName == categoryName)
                return categories[i];
        }
    }

    Scene_Codex.prototype.findEntry = function (entries) {
        var entryName = this._categorySubMenu.commandName(this._categorySubMenu.index());
        if (entries) {
            return this.findEntryFromCategory(entries, entryName);
        } else {
            return this.findEntryFromAllCategory(entryName);
        }
    }

    Scene_Codex.prototype.findEntryFromCategory = function (entries, entryName) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].EntryName == entryName)
                return entries[i];
        }
    }

    Scene_Codex.prototype.findEntryFromAllCategory = function (entryName) {
        var allCategories = TIKA.CM.Param.InformationCategories;
        for (var i = 0; i < allCategories.length; i++) {
            var category = allCategories[i];
            for (var j = 0; j < category.Entries.length; j++) {
                if (category.Entries[j].EntryName == entryName)
                    return category.Entries[j];
            }
        }
    }

    var Scene_Base_commonEventMenuSetupList = Scene_Base.prototype.commonEventMenuSetupList;
    Scene_Codex.prototype.commonEventMenuSetupList = function (id) {
        if (this._interpreter) {
            $gameTemp.reserveCommonEvent(id);
            this._interpreter.setupReservedCommonEvent();
            this._interpreter.update();
        } else {
            Scene_Base_commonEventMenuSetupList.call(this);
        }
    };

    Scene_Codex.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        this.refreshTitles();
        this.ifCodexSubMenuActive();
        this.ifCategorySubMenuActive();
        this.ifQuestJournalSelected();
        this.ifOptionsSelected();
    }

    Scene_Codex.prototype.ifCodexSubMenuActive = function () {
        if (this._codexSubMenu.active || this._categorySubMenu.active) {
            if (this.isBestiarySelected() || this.isPartySelected()) {
                this._codexSubMenu.resetPlacement();
            } else {
                this._codexSubMenu.updatePlacement(this);
            }
            this._codexWindow.makeSubMenuCommandList();
            this.updateCategorySubMenuCommandList();
        }
    }

    Scene_Codex.prototype.ifCategorySubMenuActive = function () {
        if (this._categorySubMenu.active) {
            this._categorySubMenu.feedInformationToInfoPanel();
        }
    }

    Scene_Codex.prototype.updateCategorySubMenuCommandList = function () {
        this._categorySubMenu.setCategory(this._codexSubMenu.currentExt());
        this._categorySubMenu.makeCommandList();
        this._categorySubMenu.refresh();
    }

    Scene_Codex.prototype.isBestiarySelected = function () {
        return this._codexSubMenu._category == 'bestiary';
    }

    Scene_Codex.prototype.isPartySelected = function () {
        return this._codexSubMenu._category == 'management';
    }

    Scene_Codex.prototype.ifQuestJournalSelected = function () {
        if (this._codexSubMenu._category == 'quest journal')
            this.previewQuestJournal();
        else
            this.hideQuestJournal();
    }

    Scene_Codex.prototype.ifOptionsSelected = function () {
        if (this._codexSubMenu._category == 'options')
            this.previewOptions();
        else
            this.hideOptions();
    }

    Scene_Codex.prototype.refreshTitles = function () {
        if (this._codexWindow) {
            var index = this._codexWindow.index();
            if (this._codexWindow.active) {
                var categoryTitle = this._codexWindow.commandName(index);
                this._selectedCategotyTitleWindow.drawTitle(categoryTitle);
            } else if (this._codexSubMenu.active && this._codexSubMenu._list.length) {
                var categoryTitle = this._codexSubMenu._list[this._codexSubMenu.index()].name;
                this._selectedCategotyTitleWindow.drawTitle(categoryTitle);
            }
            this._codexTitleWindow.drawTitle('Codex');
        }
    }

    Scene_Codex.prototype.commandMap = function () {
        TIKA.WorldMap.openWorldMap();
    };

    Scene_Codex.prototype.commandSave = function () {
        SceneManager.push(Scene_Save);
    };

    Scene_Codex.prototype.commandDebug = function () {
        SceneManager.push(Scene_Debug);
    };

    Scene_Codex.prototype.commandGameEnd = function () {
        SceneManager.push(Scene_GameEnd);
    };

    Scene_Codex.prototype.popScene = function () {
        backToPartyList = null;
        SceneManager.pop();
    };

    // ============================================================================
    //                       Window_CodexCategories
    // ============================================================================

    function Window_CodexCategories() {
        this.initialize.apply(this, arguments);
    }

    Window_CodexCategories.prototype = Object.create(Window_Command.prototype);
    Window_CodexCategories.prototype.constructor = Window_CodexCategories;

    Window_CodexCategories.prototype.makeCommandList = function () {
        var categories = TIKA.CM.Param.CodexCategories;
        for (var i = 0; i < categories.length; i++) {
            this.addCommand(categories[i].CategoryName, categories[i].CategoryName.toLowerCase(), true, categories[i].CategoryName.toLowerCase());
        }
    };

    Window_CodexCategories.prototype.makeSubMenuCommandList = function () {
        var scene = this.parent.parent;
        var category = scene._codexWindow.currentExt();
        scene._codexSubMenu.setCategory(category);
        scene._codexSubMenu.makeCommandList();
        scene._codexSubMenu.refresh();
    };

    var Window_CodexCategories_cursorUp = Window_CodexCategories.prototype.cursorUp;
    Window_CodexCategories.prototype.cursorUp = function (wrap) {
        Window_CodexCategories_cursorUp.call(this, wrap);
        this.makeSubMenuCommandList();
    };

    var Window_CodexCategories_cursorDown = Window_CodexCategories.prototype.cursorDown;
    Window_CodexCategories.prototype.cursorDown = function (wrap) {
        Window_CodexCategories_cursorDown.call(this, wrap);
        this.makeSubMenuCommandList();
    };

    var Window_CodexCategories_processTouch = Window_CodexCategories.prototype.processTouch;
    Window_CodexCategories.prototype.processTouch = function () {
        Window_CodexCategories_processTouch.call(this);
        this.makeSubMenuCommandList();
    };



    // ============================================================================
    //                       Window_CodexSubMenu
    // ============================================================================

    function Window_CodexSubMenu() {
        this.initialize.apply(this, arguments);
    }

    Window_CodexSubMenu.prototype = Object.create(Window_Command.prototype);
    Window_CodexSubMenu.prototype.constructor = Window_CodexSubMenu;

    Window_CodexSubMenu.prototype.makeCommandList = function () {
        this.clearCommandList();
        var ext = this._category;
        //console.log(ext);
        switch (ext) {
            case 'bestiary': this.makeBestiaryCommandList(); break;
            case 'management': this.makePartyCommandList(); break;//NEW
            case 'lore': this.makeLoreCommandList(); break;
            case 'information': this.makeInformationCommandList(); break;
        }
    };

    Window_CodexSubMenu.prototype.makeBestiaryCommandList = function () {
        var encounteredEnemies = $gameParty._encounteredEnemies;
        // console.log(encounteredEnemies);
        for (var i = 0; i < encounteredEnemies.length; i++) {
            this.addCommand(encounteredEnemies[i].enemy().name, 'beast', true, i);
        }
    };

    Window_CodexSubMenu.prototype.makePartyCommandList = function () {
        var partyList = TIKA.CM.Param.PartyList;
        for (var i = 0; i < partyList.length; i++) {
            this.addCommand(partyList[i].PartyListItemName, 'party', true, partyList[i].CommonEventToRun);
        }
    };

    Window_CodexSubMenu.prototype.makeLoreCommandList = function () {
        var loreCategories = TIKA.CM.Param.LoreCategories;
        for (var i = 0; i < loreCategories.length; i++) {
            this.addCommand(loreCategories[i].CategoryName, 'loreCategory', true, loreCategories[i].CategoryName.toLowerCase());
        }
    };

    Window_CodexSubMenu.prototype.makeInformationCommandList = function () {
        var informationCategories = TIKA.CM.Param.InformationCategories;
        this.addCommand('All', 'information', true, 'all', 0);
        for (var i = 0; i < informationCategories.length; i++) {
            this.addCommand(informationCategories[i].CategoryName, 'information', true, informationCategories[i].CategoryName.toLowerCase());
        }
    };


    Window_CodexSubMenu.prototype.setCategory = function (category) {
        if (this._category == category) return;
        this._category = category;
    };

    Window_CodexSubMenu.prototype.getCategory = function () {
        return this._category;
    };

    Window_CodexSubMenu.prototype.updatePlacement = function (scene) {
        var wx = scene._codexTitleWindow.x;
        if (this.x > wx) {
            this.x -= 10;
            this.y += 10;
            this.height -= 10;
        }
    };

    Window_CodexSubMenu.prototype.resetPlacement = function () {
        var scene = this.parent.parent;
        var wy = scene._selectedCategotyTitleWindow.height;
        var wx = scene._codexTitleWindow.width;
        this.height = Graphics.boxHeight - wy;
        this.x = wx;
        this.y = wy;
        this.refresh();
    };

    Window_CodexSubMenu.prototype.drawAllItems = function () {
        this.sortListByName();
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
    };

    Window_CodexSubMenu.prototype.sortListByName = function () {
        this._list = this._list.sort(function (a, b) {
            if (a.name == 'All' || b.name == "All") return 0;
            if (a.name > b.name)
                return 1;
            else if (a.name < b.name)
                return -1;
            else
                return 0;
        });
    };

    var Window_CodexSubMenu_cursorUp = Window_CodexSubMenu.prototype.cursorUp;
    Window_CodexSubMenu.prototype.cursorUp = function (wrap) {
        Window_CodexSubMenu_cursorUp.call(this, wrap);
        var wl = this.parent.parent;
        if (this._category == 'bestiary')
            wl.showBeastInfo();
    };
    var Window_CodexSubMenu_cursorDown = Window_CodexSubMenu.prototype.cursorDown;
    Window_CodexSubMenu.prototype.cursorDown = function (wrap) {
        Window_CodexSubMenu_cursorDown.call(this, wrap);
        var wl = this.parent.parent;
        if (this._category == 'bestiary')
            wl.showBeastInfo();
    };

    var Window_CodexSubMenu_processTouch = Window_CodexSubMenu.prototype.processTouch;
    Window_CodexSubMenu.prototype.processTouch = function () {
        Window_CodexSubMenu_processTouch.call(this);
        var wl = this.parent.parent;
        if (this._category == 'bestiary')
            wl.showBeastInfo();
    };

    // ============================================================================
    //                       Window_CategorySubMenu
    // ============================================================================

    function Window_CategorySubMenu() {
        this.initialize.apply(this, arguments);
    }

    Window_CategorySubMenu.prototype = Object.create(Window_Command.prototype);
    Window_CategorySubMenu.prototype.constructor = Window_CategorySubMenu;


    Window_CategorySubMenu.prototype.makeCommandList = function () {
        if (!this.parent) return;
        this.clearCommandList();
        var scene = this.parent.parent;
        var codexCategory = scene._codexWindow.currentExt();
        var categoryEntries = this.selectedCategory(codexCategory);
        var type = this.selectedCategoryType(codexCategory);
        if (this._category == 'all') {
            this.makeAllCommandList(type);
            return;
        }
        if (!categoryEntries) return;
        this.makeStandardCommandList(categoryEntries, type, codexCategory);
    };

    Window_CategorySubMenu.prototype.makeAllCommandList = function (type) {
        var allCategories = TIKA.CM.Param.InformationCategories;
        for (var i = 0; i < allCategories.length; i++) {
            var category = allCategories[i];
            for (var j = 0; j < category.Entries.length; j++) {
                this.addCommand(category.Entries[j].EntryName, type, true, i);
            }
        }
    };

    Window_CategorySubMenu.prototype.makeStandardCommandList = function (categoryEntries, type, codexCategory) {
        for (var i = 0; i < categoryEntries.length; i++) {
            if (this.isLore(codexCategory) && this.isVisible(categoryEntries[i]))
                this.addCommand(categoryEntries[i].EntryName, type, true, i);
            else if (this.isVisible(categoryEntries[i]))
                this.addCommand(categoryEntries[i].EntryName, type, true, i);
        }
    };

    Window_CategorySubMenu.prototype.isLore = function (category) {
        return category == 'lore';
    };

    Window_CategorySubMenu.prototype.isVisible = function (entry) {
        return $gameVariables.value(entry.EntryID) > 0 || !entry.EntryID;
    };

    Window_CategorySubMenu.prototype.selectedCategory = function (codexCategory) {
        if (codexCategory == 'lore')
            var categories = TIKA.CM.Param.LoreCategories;
        else if (codexCategory == 'information')
            var categories = TIKA.CM.Param.InformationCategories;
        if (categories)
            for (var i = 0; i < categories.length; i++) {
                if (categories[i].CategoryName.toLowerCase() === this._category)
                    return categories[i].Entries;
            }
        return null;
    };

    Window_CategorySubMenu.prototype.selectedCategoryType = function (codexCategory) {
        if (codexCategory == 'lore')
            return 'biography';
        else if (codexCategory == 'information')
            return 'information';
        else
            return '';
    };

    Window_CategorySubMenu.prototype.setCategory = function (category) {
        if (this._category == category) return;
        this._category = category;
    };

    Window_CategorySubMenu.prototype.getCategory = function () {
        return this._category;
    };

    Window_CategorySubMenu.prototype.drawAllItems = function () {
        this.sortListByName();
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
    };

    Window_CategorySubMenu.prototype.sortListByName = function () {
        this._list = this._list.sort(function (a, b) {
            if (a.name == 'All' || b.name == "All") return 0;
            if (a.name > b.name)
                return 1;
            else if (a.name < b.name)
                return -1;
            else
                return 0;
        });
    };

    Window_CategorySubMenu.prototype.clearContents = function () {
        this.contents.clear();
    };

    Window_CategorySubMenu.prototype.feedInformationToInfoPanel = function () {
        var scene = this.parent.parent;
        if (scene._codexSubMenu._category == 'information') {
            scene.previewInformationInfo();
        } else {
            scene.showBiographyInfo();
        }
    };

    // ============================================================================
    //                       Window_InfoPanel
    // ============================================================================

    function Window_InfoPanel() {
        this.initialize.apply(this, arguments);
    }

    Window_InfoPanel.prototype = Object.create(Window_Selectable.prototype);
    Window_InfoPanel.prototype.constructor = Window_InfoPanel;

    Window_InfoPanel.prototype.clearContents = function () {
        this.contents.clear();
    };

    Window_InfoPanel.prototype.refresh = function () {
        this.contents.clear();
        switch (this.getCategory()) {
            case 'bestiary': this.drawBestiaryLayout(); break;
            case 'lore': this.drawBiographyLayout(); break;
            case 'information': this.drawInformationLayout(); break;
        }
    };

    Window_InfoPanel.prototype.drawBestiaryLayout = function () {
        this.contents.clear();
        this.drawBeastName();
        this.drawBeastImageAndInfo();
    };

    Window_InfoPanel.prototype.drawBiographyLayout = function () {
        this.contents.clear();
        this.drawBiographyName();
        this.drawBiographyImageAndInfo();
    };

    Window_InfoPanel.prototype.drawInformationLayout = function () {
        this.contents.clear();
        this.drawInformationName();
        this.drawInformationImagesAndInfo();
    };

    Window_InfoPanel.prototype.drawBeastName = function () {
    	// console.log('drawBeastName()')
        this.contents.fontSize = 26;
        this.drawHorzLine(this.padding, this.lineHeight() / 2, this.textWidth(this._obj.name));
        this.drawText(this._obj.name, this.padding, 0, this.width, 'left');
        this.resetFontSettings();
    };

    Window_InfoPanel.prototype.drawBiographyName = function () {
    	// console.log('drawBiographyName()')
        this.contents.fontSize = 26;
        this.drawHorzLine(this.padding, this.lineHeight() / 2 + this.textPadding(), this.textWidth(this._obj.EntryName));
        this.drawTextEx(this._obj.EntryName, this.padding, 0, this.width, 'left');
        this.resetFontSettings();
    };

    Window_InfoPanel.prototype.drawInformationName = function () {
    	// console.log('drawInformationName()')
        this.contents.fontSize = 26;
        this.drawHorzLine(this.padding, this.lineHeight() / 2 + this.textPadding(), this.textWidth(this._obj.EntryName))
        this.drawTextEx(this._obj.EntryName, this.padding, 0, this.width, 'left');
        this.resetFontSettings();
    };

    Window_InfoPanel.prototype.drawBeastImageAndInfo = function () {
    	// console.log('drawBeastImageAndInfo')
        var bitmap = undefined;
        if (this._obj._img)
            bitmap = ImageManager.loadPicture(this._obj._img, this._obj.battlerHue);
        else
            bitmap = ImageManager.loadPicture('../sv_enemies/' + this._obj.battlerName, this._obj.battlerHue);
        if (!bitmap) return;
        var that = this;
        bitmap.addLoadListener(function () {
            var width = bitmap._canvas.width * Number(TIKA.CM.Param.BestiaryWindow.PictureScale) / 100;
            var height = bitmap._canvas.height * Number(TIKA.CM.Param.BestiaryWindow.PictureScale) / 100;
            var x = 150 - width / 2;
            var y = that.padding + that.lineHeight() + 150 - height / 2;
            that.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, x, y, width, height);
            that.drawBeastInfo(that.padding, that.padding + that.lineHeight() * 2);
        });
    };

    Window_InfoPanel.prototype.drawBeastInfo = function (x, y) {
    	// console.log('drawBeastInfo()')
        var startY = y + 300 - this.lineHeight() * 2;
        var beast = this._obj;
        var dbBeast = this.findEnemy(beast.id);
        dbBeast.defeated = beast.defeated;
        var width = 200;
        var secColumnX = 300;
        var thirdColumnX = 575;
        this.drawBasicInfo(secColumnX, y);
        this.drawLocations(x, startY + this.lineHeight() * 3);
        this.drawDescription(x, startY + this.lineHeight() * 5);

        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.TitlesFontSize);
        this.drawHorzLine(thirdColumnX + Number(TIKA.CM.Param.BestiaryWindow.ItemsXoffset), y - this.lineHeight() / 2, this.textWidth('Items Dropped'), 1);
        this.drawText('Items Dropped', thirdColumnX + Number(TIKA.CM.Param.BestiaryWindow.ItemsXoffset), y - this.lineHeight(), width, 'left');
        var lineCounter = this.drawDroppedItems(thirdColumnX + Number(TIKA.CM.Param.BestiaryWindow.ItemsXoffset), y, width);
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.TitlesFontSize);
        this.drawHorzLine(thirdColumnX + Number(TIKA.CM.Param.BestiaryWindow.ItemsXoffset), y + this.lineHeight() * ++lineCounter + this.lineHeight() / 2, this.textWidth('Items Stolen'), 1);
        this.drawText('Items Stolen', thirdColumnX + Number(TIKA.CM.Param.BestiaryWindow.ItemsXoffset), y + this.lineHeight() * lineCounter, width, 'left');
        lineCounter = this.drawStolenItems(thirdColumnX + Number(TIKA.CM.Param.BestiaryWindow.ItemsXoffset), y, width, lineCounter);
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.TitlesFontSize);
        this.drawHorzLine(thirdColumnX + Number(TIKA.CM.Param.BestiaryWindow.ItemsXoffset), y + this.lineHeight() * ++lineCounter + this.lineHeight() / 2, this.textWidth('Items Poached'), 1);
        this.drawText('Items Poached', thirdColumnX + Number(TIKA.CM.Param.BestiaryWindow.ItemsXoffset), y + this.lineHeight() * lineCounter, width, 'left');
        var lineCounter = this.drawPoachedItems(thirdColumnX + Number(TIKA.CM.Param.BestiaryWindow.ItemsXoffset), y, width, lineCounter);
        this.resetFontSettings();
    };

    Window_InfoPanel.prototype.drawBasicInfo = function (x, y) {
    	// console.log('drawBasicInfo()')
        var beast = this._obj;
        var dbBeast = this.findEnemy(beast.id);
        dbBeast.defeated = beast.defeated;
        var width = 200;
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.TitlesFontSize);
        this.drawHorzLine(x, y - this.lineHeight() / 2, this.textWidth('Information'), 1);
        this.drawText('Information', x, y - this.lineHeight(), width, 'left');
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.FontSize);
        this.drawText('Challenge Rating:', x, y, width, 'left');
        this.drawText(dbBeast.meta.Exp ? dbBeast.meta.Exp.trim() : dbBeast.exp, x, y, width, 'right');
        //this.drawText('JP:', x, y + this.lineHeight(), width, 'left');
        //this.drawText(dbBeast.jp, x, y + this.lineHeight(), width, 'right');
        //this.drawText('Gold:', x, y + this.lineHeight() * 2, width, 'left');
        //this.drawText(dbBeast.gold, x, y + this.lineHeight() * 2, width, 'right');
        this.drawText('Type:', x, y + this.lineHeight(), width, 'left');
        this.drawText(dbBeast._type, x, y + this.lineHeight(), width, 'right');
        //this.drawText('Defeated:', x, y + this.lineHeight() * 2, width, 'left');
        //this.drawText(dbBeast.defeated, x, y + this.lineHeight() * 2, width, 'right');
    };

    Window_InfoPanel.prototype.drawLocations = function (x, y) {
    	// console.log('drawLocation()')
        var locations = this._obj._locations;
        var locationWidth = (this.width - 2 * this.padding) / 4;
        var rowCounter = 0;
        var columnCounter = 0;
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.TitlesFontSize);
        this.drawHorzLine(x, y - this.lineHeight() / 2, this.textWidth('Locations'), 1);
        this.drawText('Locations', x, y - this.lineHeight(), locationWidth, 'left');
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.FontSize);
        y = y + this.lineHeight() / 4;
        for (var i = 0; i < locations.length; i++) {
            this.drawText(locations[i], x + columnCounter * locationWidth, y + this.lineHeight() * rowCounter, locationWidth, 'left');
            columnCounter++;
            if (i && i % 3 == 0) {
                rowCounter++;
                columnCounter = 0;
            }
        }
    };

    Window_InfoPanel.prototype.drawDescription = function (x, y) {
    	// console.log('drawDescription()')
        y = y + Math.ceil(this._obj._locations.length / 4) * this.lineHeight();
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.TitlesFontSize);
        this.drawHorzLine(x, y + this.lineHeight() / 2, this.textWidth('Description'), 1);
        this.drawText('Description', x, y, this.width, 'left');
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.FontSize);
        this.drawTextAutoWrap(this._obj._description, x, y + this.lineHeight() + this.lineHeight() / 4);
    };

    Window_InfoPanel.prototype.findEnemy = function (enemyId) {
        var enemy = null;
        for (var i = 1; i < $dataEnemies.length; i++)
            if ($dataEnemies[i].id == enemyId)
                enemy = $dataEnemies[i];
        return enemy;
    };

    Window_InfoPanel.prototype.setObject = function (obj) {
        if (obj instanceof Game_Enemy)
            this._obj = obj.enemy();
        else
            this._obj = obj;
    };

    Window_InfoPanel.prototype.getObject = function () {
        return this._obj;
    };

    Window_InfoPanel.prototype.drawDroppedItems = function (x, y, width) {
    	// console.log('drawDroppedItems')
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.FontSize);
        var items = this._obj.dropItems;
        var lineCounter = 0;
        for (var i = 0; i < items.length; i++) {
            if (items[i].dataId && items[i].dataId > 1) {
                var item = this.itemKind(items[i]);
                this.drawText(item.name, x, y + this.lineHeight() * lineCounter, width, 'left');
                lineCounter++;
            }
        }
        if (lineCounter == 0) {
            this.drawText('-', x, y + this.lineHeight() * lineCounter, width, 'left');
            lineCounter++;
        }
        this.resetFontSettings();
        return lineCounter;
    };

    Window_InfoPanel.prototype.drawPoachedItems = function (x, y, width, lineCounter) {
    	// console.log('drawPoachedItems()')
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.FontSize);
        var items = this._obj.conditionalDropItems;
        if (!items) return;
        var counter = lineCounter + 1;
        for (var i = 0; i < items.length; i++) {
            var item = items[i][0];
            if (item.id) {
                this.drawText(item.name, x, y + this.lineHeight() * counter, width, 'left');
                counter++;
            }
        }
        if (counter == lineCounter + 1) {
            this.drawText('-', x, y + this.lineHeight() * counter, width, 'left');
            counter++;
        }
        this.resetFontSettings();
        return counter;
    };

    Window_InfoPanel.prototype.itemKind = function (item) {
        switch (item.kind) {
            case 1: return $dataItems[item.dataId];
            case 2: return $dataWeapons[item.dataId];
            case 3: return $dataArmors[item.dataId];
        }
    }

    Window_InfoPanel.prototype.drawStolenItems = function (x, y, width, lineCounter) {
    	// console.log('drawStolenItems()')
        this.contents.fontSize = Number(TIKA.CM.Param.BestiaryWindow.FontSize);
        var items = this._obj.stealableItems;
        var counter = lineCounter + 1;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id && items[i].id > 1) {
                var item = this.item(items[i]);
                if (!item) continue;
                this.drawText(item.name, x, y + this.lineHeight() * counter, width, 'left');
                counter++;
            }
        }
        if (counter == lineCounter + 1) {
            this.drawText('-', x, y + this.lineHeight() * counter, width, 'left');
            counter++;
        }
        this.resetFontSettings();
        return counter;
    };

    Window_InfoPanel.prototype.item = function (item) {
        if (item)
            if (item.type == 'weapon')
                return $dataWeapons[item.id];
            else if (item.type == 'armor')
                return $dataArmors[item.id];
            else if (item.type == 'item')
                return $dataItems[item.id];

        return null;
    };

    Window_InfoPanel.prototype.drawBiographyImageAndInfo = function () {
        var bitmap = ImageManager.loadPicture(this._obj.ImageName);
        var that = this;
        bitmap.addLoadListener(function () {
            var width = bitmap._canvas.width * Number(that._obj.PictureScale) / 100;
            var height = bitmap._canvas.height * Number(that._obj.PictureScale) / 100;
            var x = that.pictureAlign(width);
            var y = that.padding + that.lineHeight() * 2;
            that.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, x, y, width, height);
            that.drawBiographyInfo(x, y, width, height);
        });
    };

    Window_InfoPanel.prototype.drawInformationImagesAndInfo = function () {
        this.setupPagination();
        this.drawInformationImage1();
        this.drawInformationImage2();
        this.drawOverviewIfNoImages();
    };

    Window_InfoPanel.prototype.setupPagination = function () {
        var scene = this.parent.parent;
        scene._paginationWindow._currentPage = this._currentPage || 0;
        scene._paginationWindow._totalPages = this._obj.Pages.length;
        this._currentPage = this._currentPage || 0;
        this._totalPages = this._obj.Pages.length;
        scene._paginationWindow.refresh();
    };

    Window_InfoPanel.prototype.drawOverviewIfNoImages = function () {
        if (!this._obj.Pages[this._currentPage]) return;
        if (!this._obj.Pages[this._currentPage].Image1 && !this._obj.Pages[this._currentPage].Image2)
            this.drawInformationOverview();
    }

    Window_InfoPanel.prototype.drawInformationImage1 = function () {
        if (!this._obj.Pages[this._currentPage]) return;
        if (!this._obj.Pages[this._currentPage].Image1) {
            this._imageEnd = this.padding + this.lineHeight() * 2;
            return;
        }
        var bitmap = ImageManager.loadPicture(this._obj.Pages[this._currentPage].Image1);
        var that = this;
        bitmap.addLoadListener(function () {
            var width = 358;
            var height = 288;
            var x = that.getImage1XCoordinate(width);
            var y = that.padding + that.lineHeight() * 2;
            that._imageEnd = y + height;
            that.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, x, y, width, height);
            that.drawInformationOverview();
        });
    };

    Window_InfoPanel.prototype.drawInformationImage2 = function () {
        if (!this._obj.Pages[this._currentPage]) return;
        if (!this._obj.Pages[this._currentPage].Image2) {
            this._imageEnd = this.padding + this.lineHeight() * 2;
            return;
        }
        var bitmap = ImageManager.loadPicture(this._obj.Pages[this._currentPage].Image2);
        var that = this;
        bitmap.addLoadListener(function () {
            var width = 358;
            var height = 288;
            var x = that.getImage2XCoordinate(width);
            var y = that.padding + that.lineHeight() * 2;
            that._imageEnd = y + height;
            that.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, x, y, width, height);
            that.drawInformationOverview();
        });
    };

    Window_InfoPanel.prototype.getImage1XCoordinate = function (width) {
        if (!this._obj.Pages[this._currentPage].Image2) {
            return this.width / 2 - width / 2 - this.padding * 2;
        } else {
            return this.padding;
        }
    };

    Window_InfoPanel.prototype.getImage2XCoordinate = function (width) {
        if (!this._obj.Pages[this._currentPage].Image1) {
            return this.width / 2 - width / 2 - this.padding * 2;
        } else {
            return this.width - (this.padding * 2 + this.textPadding() * 2 + this.margin * 2) - width;
        }
    };

    Window_InfoPanel.prototype.drawInformationOverview = function () {
    	// console.log('drawInformationOverview()')
        var startY = this._imageEnd || 358;
        var width = 215;
        this.drawTextEx('Overview:', this.padding, startY + this.lineHeight(), width, 'left');
        this.drawTextAutoWrap(this._obj.Pages[this._currentPage].Overview, this.padding, startY + this.lineHeight() * 3);
    };

    Window_InfoPanel.prototype.pictureAlign = function (pictureWidth) {
        switch (this._obj.PictureAlign) {
            case 'left': return this.padding;
            case 'right': return this.width - this.padding * 2 - pictureWidth;
            case 'center': return this.width / 2 - pictureWidth / 2 - this.padding;
        }
    };

    Window_InfoPanel.prototype.pictureAlign = function (pictureWidth) {
        switch (this._obj.PictureAlign) {
            case 'left': return this.padding;
            case 'right': return this.width - this.padding * 2 - pictureWidth;
            case 'center': return this.width / 2 - pictureWidth / 2 - this.padding;
        }
    };

    Window_InfoPanel.prototype.drawBiographyInfo = function (x, y, imageWidth, height) {
    	// console.log('drawBiographyInfo()')
        var obj = this._obj;
        var width = 215;
        var count = 3;
        var infoX = this.infoPositioningX(x, imageWidth);
        var infoY = this.lineHeight();
        var startY = y + height;
        this.contents.fontSize = 24;
        var NUMBER_OF_PARAMS = 8;
        var countY = 1;
        var countX = 1;
        var indent = this.findLongestWord(obj) + 10;
        if (imageWidth > 180) {
            obj.ParamListOrientation = 'vertical';
        }
        for (var i = 1; i <= NUMBER_OF_PARAMS; i++) {
            if (obj.ParamListOrientation === 'vertical') {
                if (obj[`Param${i}`]) {
                    this.drawText(obj[`Param${i}`], infoX, infoY + countY * this.lineHeight(), width, 'left');
                    this.drawText(this.getLatestParam(obj, `Param${i}`), infoX + indent, infoY + countY * this.lineHeight(), width, 'left');
                    countY++;
                }
            } else {
                if (obj[`Param${i}`]) {
                    this.drawText(obj[`Param${i}`], countX * infoX, infoY + countY * this.lineHeight(), width, 'left');
                    this.drawText(this.getLatestParam(obj, `Param${i}`), countX * infoX + indent, infoY + countY * this.lineHeight(), width, 'left');
                    countX += 1;
                    if (i % 2 == 0) {
                        countX = 1;
                        countY++;
                    }
                }
            }
        }

        this.drawTextEx('Description:', this.padding, startY + this.lineHeight(), width, 'left');
        this.drawTextAutoWrap(this.getLatestDescription(obj), this.padding, startY + this.lineHeight() * count);


        this.resetFontSettings();
    };

    Window_InfoPanel.prototype.findLongestWord = function (obj) {
        var longestWord = 0;
        for (var i = 1; i <= 8; i++) {
            if (obj[`Param${i}`]) {
                var word = this.textWidth(obj[`Param${i}`]);
                if (word > longestWord)
                    longestWord = word;
            }

        }
        return longestWord;
    };

    Window_InfoPanel.prototype.getLatestParam = function (obj, param) {
        var updatePhase = $gameVariables.value(obj.EntryID) - 1;
        var paramUpdates = obj[param + 'Updates'];
        var latestParam = '';
        if (updatePhase < 0) return latestParam;
        if (paramUpdates[updatePhase]) {
            return paramUpdates[updatePhase];
        }
        for (var i = 0; i < paramUpdates.length; i++) {
            if (paramUpdates[i]) {
                latestParam = paramUpdates[i];
            }
        }

        return latestParam;
    };

    Window_InfoPanel.prototype.getLatestDescription = function (obj) {
        var updatePhase = $gameVariables.value(obj.EntryID) - 1;
        var descriptionUpdates = obj.Description;
        var latestUpdate = '';
        if (updatePhase < 0) return latestUpdate;
        if (descriptionUpdates[updatePhase]) {
            return descriptionUpdates[updatePhase];
        }
        for (var i = 0; i < descriptionUpdates.length; i++) {
            if (descriptionUpdates[i]) {
                latestUpdate = descriptionUpdates[i];
            }
        }

        return latestUpdate;
    };

    Window_InfoPanel.prototype.infoPositioningX = function (x, imageWidth) {
        var width = 215;
        switch (this._obj.PictureAlign) {
            case 'right': return this.padding;
            case 'left': return (x + imageWidth).clamp(width, 350) + this.padding;
            case 'center': return this.padding;
        }
    };

    Window_InfoPanel.prototype.infoPositioningY = function (y, height) {
        switch (this._obj.PictureAlign) {
            case 'right': return this.lineHeight();
            case 'left': return this.lineHeight();
            case 'center': return y + height;
        }
    };

    Window_InfoPanel.prototype.getBiographyAttribute = function (obj, attr) {
        if (!obj[attr]) return 0;
        var varValue = $gameVariables.value(obj.EntryID);
        var i = varValue;
        var attributeValue = obj[attr][i];
        while (i > 0 || !attributeValue) {
            attributeValue = obj[attr][i];
            i--;
        }
        return attributeValue;
    };

    Window_InfoPanel.prototype.drawTextAutoWrap = function (text, x, y) {
        if (!text) {
            return;
        }
        // console.log('drawTextAutoWrap()')
        var words = text.split(' ');
        let x2 = x;
        let y2 = y;
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (!word) continue;
            if (word === `<br>`)
                word = '\x1bn';
            else
                word = this.convertEscapeCharacters(words[i]);
            var width = this.textWidth(word + ' ');
            if (word === `\x1bn`) {
                y2 += this.lineHeight();
                x2 = x;
                continue;
            }
            if (x2 + width >= (this.width - this.textPadding() - this.padding * 2)) {
                y2 += this.lineHeight();
                x2 = x;
            }

            if (word.includes(`\x1bC`)) {
                var temp = word.split(']');
                width -= this.textWidth(temp[0] + ']');
            }

            this.drawText(word.trim() + ' ', x2, y2);
            x2 += width;
        }
    }

    Window_InfoPanel.prototype.lineHeight = function () {
        return Number(TIKA.CM.Param.BestiaryWindow.FontSize) + 4;
    };

    Window_InfoPanel.prototype.setCategory = function (category) {
        if (this._category == category) return;
        this._category = category;
    };

    Window_InfoPanel.prototype.getCategory = function () {
        return this._category;
    };

    Window_InfoPanel.prototype.drawHorzLine = function (x, y, width, height) {
        var lineY = y + this.lineHeight() / 2 - 1;
        this.contents.fillRect(x, lineY, width, height || 2, this.lineColor());
    };

    Window_InfoPanel.prototype.lineColor = function () {
        return this.normalColor();
    };

    // ============================================================================
    //                       Window_Options
    // ============================================================================


    Window_Options.prototype.initialize = function () {
        Window_Command.prototype.initialize.call(this, 0, 0);
    };

    Window_Options.prototype.updatePlacement = function () {
        var scene = this.parent.parent;
        this.x = scene._codexWindow.width;
        this.y = scene._selectedCategotyTitleWindow.height;
        this.width = Graphics.boxWidth - this.x;
        this.height = Graphics.boxHeight - this.y;
        this.refresh();
    };

    // ============================================================================
    //                       Window_Title
    // ============================================================================

    function Window_Title() {
        this.initialize.apply(this, arguments);
    }

    Window_Title.prototype = Object.create(Window_Base.prototype);
    Window_Title.prototype.constructor = Window_Title;


    Window_Title.prototype.drawTitle = function (text) {
        this.contents.clear();
        this.contents.fontSize = 26;
        this.drawTextEx(text, 0, 0, this.width - this.padding * 2, 'left');
        this.resetFontSettings();
    };

    // ============================================================================
    //                       Window_Pagination
    // ============================================================================

    function Window_Pagination() {
        this.initialize.apply(this, arguments);
    }

    Window_Pagination.prototype = Object.create(Window_HorzCommand.prototype);
    Window_Pagination.prototype.constructor = Window_Pagination;

    var Window_Selectable_refresh = Window_Selectable.prototype.refresh;
    Window_Pagination.prototype.refresh = function () {
        Window_Selectable_refresh.call(this);
        this.drawPageNumbers();
    };

    Window_Pagination.prototype.makeCommandList = function () {
        this.addCommand('\u2190', 'decrease', true);
        this.addCommand('\u2192 ', 'increase', true);
    };

    Window_Pagination.prototype.drawPageNumbers = function () {
    	// console.log('drawPageNumbers()')
        this.contents.fontSize = 26;
        var currentPage = this._totalPages == 0 ? 0 : this._currentPage + 1;
        this.drawText(currentPage + '/' + this._totalPages, 0, 0, this.width - this.textPadding() * 2 - this.padding * 2, 'center');
        this.resetFontSettings();
    };

    Window_Pagination.prototype.drawItem = function (index) {
    	// console.log('drawItem()')
        var rect = this.itemRectForText(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y - this.textPadding(), rect.width, 'center');
    };

    Window_Pagination.prototype.standardFontSize = function () {
        return 48;
    };

    Window_Pagination.prototype.itemRectForText = function (index) {
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        if (index == 1)
            rect.x += this.textPadding() * 2;
        return rect;
    };

    Window_Pagination.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        if (index == 1)
            rect.x = 2 % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };

    Window_Pagination.prototype.maxCols = function () {
        return 3;
    };

    function Window_Traits() {
        this.initialize.apply(this, arguments);
    }

    Window_Traits.prototype = Object.create(Window_Status.prototype);
    Window_Traits.prototype.constructor = Window_Traits;


    Window_Traits.prototype.windowWidth = function () {
        return Graphics.boxWidth;
    };

    Window_Traits.prototype.windowHeight = function () {
        return Graphics.boxHeight;
    };

    var Window_Traits_refresh = Window_Traits.prototype.refresh;
    Window_Traits.prototype.refresh = function () {
        Window_Traits_refresh.call(this);
        this.drawColumnTitle('State Resistance', 0, 0, this.width / 4 - this.padding);
        this.drawColumnTitle('Element Resistance', this.width / 4, 0, this.width / 4 - this.padding);
        this.drawColumnTitle('Passive Traits', this.width / 2, 0, this.width / 2 - this.padding * 2 - this.textPadding());
        var lineHeight = this.lineHeight();
        this.contents.fontSize = 20;
        this.drawResistance(0, lineHeight, this.width / 4 - this.padding, { min: 71, max: 93 });
        this.drawResistance(this.width / 4, lineHeight, this.width / 4 - this.padding, { min: 58, max: 70 });
        this.drawPassiveTraits(this.width / 2, lineHeight, this.width / 2 - this.padding * 2 - this.textPadding());
    };

    Window_Traits.prototype.setObject = function (obj) {
        if (this._obj != obj)
            this._obj = obj;
    };

    Window_Traits.prototype.getObject = function () {
        return this._obj;
    };

    Window_Traits.prototype.drawColumnTitle = function (text, x, y, width) {
    	// console.log('drawColumnTitle()')
        this.contents.fontSize = 22;
        this.drawText(text, x, y, width, 'left');
        this.resetFontSettings();
        this.drawHorzLine(x, y + this.textPadding() * 3, width);
    };

    Window_Traits.prototype.drawHorzLine = function (x, y, width) {
        var lineY = y + this.lineHeight() / 2 - 1;
        this.contents.fillRect(x, lineY, width, 2, this.lineColor());
    };

    Window_Traits.prototype.drawResistance = function (x, y, width, range) {
    	// console.log('drawResistance()')
        if (!this._obj) return;
        var counter = 0;
        for (let i = range.min; i <= range.max; i++) {
            if (this._obj.NParam(i) != 0) {
                this.drawText(TextManager.param(ICF.Param.NParams[i]), x, y + counter * this.lineHeight(), width, 'left');
                this.drawText(this._obj.NParam(i), x, y + counter * this.lineHeight(), width, 'right');
                counter++;
            }
        }
    }

    Window_Traits.prototype.getAllStateTraits = function (states, code) {
        var allTraits = [];
        for (var i = 0; i < states.length; i++) {
            var stateTraits = this.getTraitsForState(states[i], code);
            allTraits = allTraits.concat(stateTraits);
        }

        return allTraits;
    };

    Window_Traits.prototype.getTraitsForState = function (state, code) {
        if (!$dataStates[state]) return [];
        var stateTraits = $dataStates[state].traits;
        var matchingTraits = [];
        for (var i = 0; i < stateTraits.length; i++) {
            if (stateTraits[i].code == code && stateTraits[i].value != 1)
                matchingTraits.push(stateTraits[i]);
        }

        return matchingTraits;
    };

    Window_Traits.prototype.calculateTraits = function (traits) {
        var uniqueTraits = [];
        for (var i = 0; i < traits.length; i++) {
            if (traits[i].code == Game_BattlerBase.TRAIT_STATE_RESIST) {
                uniqueTraits.push(traits[i]);
                var dataId = traits[i].dataId;
                this.removeTraitsByState(traits, dataId, Game_BattlerBase.TRAIT_STATE_RATE);
                this.removeTraitsByState(uniqueTraits, dataId, Game_BattlerBase.TRAIT_STATE_RATE);
                continue;
            }
            else if (traits[i].code == Game_BattlerBase.TRAIT_STATE_RATE)
                uniqueTraits.push(this.sumTraits(traits, traits[i], i));
            else if (traits[i].code == Game_BattlerBase.TRAIT_ELEMENT_RATE)
                uniqueTraits.push(this.sumTraits(traits, traits[i], i));
        }
        return uniqueTraits;
    };

    Window_Traits.prototype.removeTraitsByState = function (traits, dataId, code) {
        for (var i = 0; i < traits.length; i++) {
            if (traits[i].dataId == dataId && traits[i].code == code) {
                traits.splice(i, 1);
                i--;
            }
        }
        return traits;
    };

    Window_Traits.prototype.sumTraits = function (traits, currTrait, index) {
        var trait;
        for (var i = ++index; i < traits.length; i++) {
            if (traits[i].code == currTrait.code && traits[i].dataId == currTrait.dataId) {
                trait = {};
                trait.code = currTrait.code;
                trait.dataId = currTrait.dataId;
                trait.value = currTrait.value - (1 - traits[i].value);
                traits.splice(i, 1);
                i--;
            }

        }
        return trait ? trait : currTrait;
    };

    Window_Traits.prototype.drawElementResistance = function (x, y, width) {
        if (!this._obj) return;
        // console.log('drawElementResistance()')
        var states = this._obj.passiveStates;
        var traits = this.getAllElementTraits(states);
        var counter = 0;
        for (var i = 0; i < traits.length; i++) {
            var element = $dataSystem.elements[traits[i].dataId];
            if (traits[i].value != 1 && traits[i].code == Game_BattlerBase.TRAIT_ELEMENT_RATE) {
                this.drawText(element, x, y + counter * this.lineHeight(), width, 'left');
                this.drawText(Math.round(traits[i].value * 100) + '%', x, y + counter * this.lineHeight(), width, 'right');
                counter++;
            }
        }
    };

    Window_Traits.prototype.getAllElementTraits = function (states) {
        var traits = this.getAllStateTraits(states, Game_BattlerBase.TRAIT_ELEMENT_RATE);
        traits = traits.concat(this._obj.traits);

        return this.calculateTraits(traits);
    };

    Window_Traits.prototype.drawPassiveTraits = function (x, y, width) {
        if (!this._obj) return;
        this._obj = this._obj.enemy();
        var states = this._obj.passiveStates;
        var traits = this._obj.traits;
        var yCount = 0;
        var counter = 0;
        for (var i = 0; i < traits.length; i++) {
            var trait = this.getTraitname(traits[i].code, traits[i].dataId);
            if (!trait) continue;
            if (counter % 2 == 0) {
                yCount = Math.floor(counter / 2);
                this.drawPassiveTrait(trait, x, y + yCount * this.lineHeight(), width - this.padding);
            } else {
                this.drawPassiveTrait(trait, x + width / 2, y + yCount * this.lineHeight(), width);
            }
            counter++;
        }
        for (var j = 0, i = i - 1; j < states.length; j++, i++) {
            var state = $dataStates[states[j]];
            if (!state) continue;
            if (state._display)
                if (counter % 2 == 0) {
                    yCount = Math.floor(counter / 2);
                    this.drawPassiveTrait(state.name, x, y + yCount * this.lineHeight(), width - this.padding);
                } else {
                    this.drawPassiveTrait(state.name, x + width / 2, y + yCount * this.lineHeight(), width);
                }
            counter++;
        }
    };

    Window_Traits.prototype.getAllClassTraits = function () {
        return this._obj.traits;
    };

    Window_Traits.prototype.drawPassiveTrait = function (name, x, y, width) {
    	// console.log('drawPassiveTrait()')
        this.drawText(name, x, y, width / 2, 'left');
    };

    Window_Traits.prototype.getTraitname = function (code, id) {
        switch (code) {
            case 31: return 'Attack Element - ' + $dataSystem.elements[id]
            case 41:
            case 42: return 'Skill Type - ' + $dataSystem.skillTypes[id];
            case 51: return 'Equip Weapon - ' + $dataSystem.weaponTypes[id];
            case 52: return 'Equip Armor - ' + $dataSystem.armorTypes[id];
        }
    };

    Window_Traits.prototype.lineHeight = function () {
        return Number(TIKA.CM.Param.BestiaryWindow.Padding);
    }

    // ============================================================================
    //                       Game_Party
    // ============================================================================

    var Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function () {
        Window_Options_makeCommandList.call(this);
        this.addClockOptions();
    };

    Window_Options.prototype.addClockOptions = function () {
        this.addCommand('Visible Clock', 'visibleClock');
    };

    Window_Options.prototype.setConfigValue = function (symbol, value) {
        if (symbol == 'visibleClock')
            $gameSystem._time_window_visible = value;
        ConfigManager[symbol] = value;
    };

    // ============================================================================
    //                       Game_Party
    // ============================================================================

    var ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        var config = ConfigManager_makeData.call(this);
        config.visibleClock = this.visibleClock;
        return config;
    };

    var ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        ConfigManager_applyData.call(this, config);
        this.visibleClock = this.readFlag(config, 'visibleClock') || 'true';
    };


    // ============================================================================
    //                       Game_Party
    // ============================================================================

    var Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function () {
        Game_Party_initialize.call(this);
        this._encounteredEnemies = [];
    };


})();

TIKA.CM.backToPartyList = function (partyIndex = 0, itemIndex = 0) {
    // Needed because when the Scene_Map is pushed, the stack is cleared therfore the movement through scenes is messed up
    SceneManager._stack = $gameTemp._stack;
    SceneManager.pop();
    // Set the value to true, because this variable controls that to do next
    backToPartyList = { codexIndex: partyIndex, partyItemIndex: itemIndex };
}
