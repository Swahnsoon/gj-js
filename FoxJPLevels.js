//=============================================================================
// FoxJPLevels
// by Fox536
// Date: 11/28/2015  
// FoxJPLevels.js
// Version: 1.0.4
// Requires: YEP_JobPoints.js (v1.02)
//=============================================================================


/*:
 * @plugindesc v1.0.4 Adds levels to the JP system, just like Final Fantasy Tactics had
 * @author Fox536
 
 * @param JPTotalLevels
 * @desc The total amount of JP needed to reach each level, starts at level 2. (array)
 * @default [100, 250, 450, 700, 1000, 1350, 1800]
 
 * @param UsingColoredLevelString
 * @desc Use the modified Level string so colors match? (default:true)
 * @default true
 
 * @param JobLevelString
 * @desc This is the string that is shown for the Job Level
 * @default Yanfly.Param.Jp + " Lv "
 
 * @help I recommend turning "Maintain Levels" to false, otherwise 
 * this is a little redundant.
 
 * - It allows for restrictions on what skills your allowed 
 *   to buy with the SkillLearnSystem based on the current 
 *   classes' Job Level.
 * - It allows for restrictions on what class your allowed 
 *   to equip with the ClassChangeCore based on the current 
 *   classes' Job Level.
 *
 * The Job automatically gains levels just by gaining JobPoints. 
 * You can adjust how many levels, there are by changing the Plugin 
 * Parameters. I tried to replicate the system from fft as best as 
 * I can from memory, if you find any bugs or can think of a cool 
 * feature to add, let me know.
 *
 * Note: You must set YEP_SkillLearnSystem Integrate variable to false, if you're using it.
 
 *ClassChangeCore NoteTag Additions
 *-- Class NoteTags
 *  <Level Unlock Requirements>
 *   Class i: JobLevel n
 *  </Level Unlock Requirements>
 *This requires that class i must be Job level n to unlock the class, the 
 *the same way Final Fantasy Tactics required you to level up the job to 
 *unlock classes.
 
 *SkillLearnSystem NoteTags Additions
 *-- Skill NoteTags
 *  <Learn Require Eval>
 *   value = a.jpLevel() >= n
 *  </Learn Require Eval>
 *  <Learn Custom Text>
 *   Job Level: n
 *  </Learn Custom Text>
 *This would make the skill require the actor to be Job Level n, before
 *it would show
 
 *I also added a slash command 
 * \jp[actorId]
 *You can use it to display the actor's JP Level.
 
 */

var Fox 		= Fox || {};
Fox.JPLevels 	= {};

var Imported = Imported || {};

(function() {

	//----------------------------------------
	//{ System Variables
	//----------------------------------------
	var parameters 				= PluginManager.parameters('FoxJPLevels');
	var JPTotalLevels 			= eval(parameters.JPTotalLevels);
	var usingColoredLevelString = parameters.usingColoredLevelString;
	var JobLevelString 			= parameters.JobLevelString;
	
	//}
	//----------------------------------------
	
	//----------------------------------------
	//{ System Methods
	//----------------------------------------
	var JPTotalMax = function() {
		return JPTotalLevels[JPTotalLevels.length-1];
	}
	var JPMaxLevel = function() {
		return JPTotalLevels.length+1;
	}
	//}
	//----------------------------------------
	
	//----------------------------------------
	//{ Game_Actor - Additions
	//----------------------------------------
	Game_Actor.prototype.setJpTotal = function(value, classId) {
		value = parseInt(value);
		if (value === NaN) {
			value = 0;
		}
		classId = classId || this.currentClass().id;
		if (!this._jpTotal) {
			this._jpTotal = {};
		}
		if (!this._jpTotal[classId]) {
			this._jpTotal[classId] = 0;
		}
		this._jpTotal[classId] = Math.max(0, value);
		if (JPTotalMax() > 0) {
		  this._jpTotal[classId] = Math.min(JPTotalMax(), value);
		}
	}
	Game_Actor.prototype.jpLevel = function(classId) {
		var jpTotal = this.jpTotal(classId);
		for (var i = 0; i < JPTotalLevels.length; i++) {
			if (jpTotal < JPTotalLevels[i]) {
				return i + 1;
			}
		}
		return JPTotalLevels.length + 1;
	}
	Game_Actor.prototype.jpTotal = function(classId) {
		if (!this._jpTotal) {
			this.initJpTotal();
		}
		if (!this._jpTotal)  {
			return 0;
		}
		if (classId === undefined) {
			classId = this.currentClass().id;
		}
		if (!this._jpTotal[classId]) {
			this._jpTotal[classId] = 0;
		}
		return this._jpTotal[classId];
	}
	Game_Actor.prototype.initJpTotal = function() {
		var actor = this.actor();
		for (var i = 0; i < $dataClasses.length; i++) {
				if (actor.startingJp) {
					var jp = actor.startingJp[i] || 0;
					this.setJpTotal(jp, i);
				}
		}
	}
	//}
	//----------------------------------------
	
	//----------------------------------------
	//{ YEP_JobPoints - Additions
	//----------------------------------------
	var Game_Actor_gainJp = Game_Actor.prototype.gainJp;
	Game_Actor.prototype.gainJp = function(value, classId) {
		Game_Actor_gainJp.call(this, value, classId);
		value = parseInt(value);
		if (value === NaN) {
			value = 0;
		}
		classId = classId || this.currentClass().id;
		value = Math.floor(value * this.jpRate());
		this.setJpTotal(this.jpTotal(classId) + value, classId)
	}
	//}
	//----------------------------------------
	
	//----------------------------------------
	//{ Window_Base - Additions
	//----------------------------------------
	Window_Base.prototype.drawActorJp2 = function(actor, id, wx, wy, ww, align, opposite) {
		var jp = actor.jp(id);
		ww = ww || 70;
		var icon = '\\i[' + Yanfly.Icon.Jp + ']';
		var fmt = "%1\\c[16]%2\\c[0]%3"; //Yanfly.Param.JpMenuFormat;
		var text = fmt.format(Yanfly.Util.toGroup(jp), Yanfly.Param.Jp, icon);
		if (Yanfly.Icon.Jp == 0) {
			text = fmt.format("", Yanfly.Param.Jp, " "+Yanfly.Util.toGroup(jp));
		}
		
		var x = 0;
		if (align === 'left') {
		  x = 0;
		} else if (align === 'center') {
		  x += (ww - this.textWidthEx(text)) / 2;
		} else {
		  x += ww - this.textWidthEx(text);
		}
		
		if (opposite) {
			this.changeTextColor(this.systemColor());
			this.drawText(Yanfly.Param.Jp, wx + x, wy);
			this.resetTextColor();
			this.drawText(Yanfly.Util.toGroup(jp), wx + x + 42, wy, ww, "right");
		} else {
			this.resetTextColor();
			this.drawText(Yanfly.Util.toGroup(jp), wx + x, wy, ww, "right");
			this.changeTextColor(this.systemColor());
			this.drawText(Yanfly.Param.Jp, wx + x + ww, wy);
		}
	};
	Window_Base.prototype.GetActorJpLevelString = function(actor, useMax, classId) {
		var jpLevel = actor.jpLevel(classId);
		var str = eval(JobLevelString); //Yanfly.Param.Jp + " Lv ";
		if (useMax) { 
			str += "Max";
		} else {
			str += jpLevel;
		}
		return str;
	}
	Window_Base.prototype.drawActorJpLevel = function(actor, id, x, y, useMax, next, useAlt) {
		console.log(useMax, next, useAlt)
		var jpLevel = actor.jpLevel(id);
		if (useAlt) {
			this.changeTextColor(this.systemColor());
			var jpLevelStr = eval(JobLevelString);
			var width = this.textWidth(jpLevelStr)
			this.drawText(jpLevelStr, x, y);
			this.resetTextColor();
			if (useMax && jpLevel == JPMaxLevel()) {
				var width2 = this.textWidth(" Max")
				this.drawText("Max", x + width, y, width2, "right");
			} else {
				var width2 = this.textWidth(" " + jpLevel)
				this.drawText(jpLevel, x + width, y, width2, "right");
			}
		} else {
			var jpLevelStr = eval(JobLevelString);
			this.changeTextColor(this.systemColor());
			this.drawText(jpLevelStr, x, y);
			
			this.resetTextColor();
			if (useMax && jpLevel == JPMaxLevel()) {
				this.drawText("Max", x + 84, y, 42, "right");
			} else {
				this.drawText(jpLevel, x + 84, y, 42, "right");
				if (next) {
					this.changeTextColor(this.systemColor());
					this.drawText("Next", x, y + this.lineHeight() * 1);
					this.resetTextColor();
					var value = JPTotalLevels[jpLevel-1] - actor.jpTotal();
					this.drawText(value, x + 84, y + this.lineHeight() * 1, 42, "right");
					return true;
				}
			}
		}
		return false;
	}
	//}
	//----------------------------------------
	
	//----------------------------------------
	//{ Window_Base - Slash Commands
	//----------------------------------------
	var Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
	Window_Base.prototype.processEscapeCharacter = function(code, textState) {
		Window_Base_processEscapeCharacter.call(this, code, textState);
		switch (code) {
			case 'JP':
			if (SceneManager._scene._statusWindow) {
				if (SceneManager._scene._statusWindow._actor) {
					var actor = SceneManager._scene._statusWindow._actor;
					this.drawText(actor.jpLevel(), textState.x, textState.y);
					//textState.x += Window_Base._iconWidth + 4;
					textState.x += this.textWidth(actor.jpLevel());
					
				} 
			} else {
				var actorId = this.obtainEscapeParam(textState);
				var actor = $gameActors.actor(actorId);
				this.drawText(actor.jpLevel(), textState.x, textState.y);
				//textState.x += Window_Base._iconWidth + 4;
				textState.x += this.textWidth(actor.jpLevel());
			}
			break;
		}
	}
	//}
	//----------------------------------------
	
	//----------------------------------------
	//{ YEP_ClassChangeCore - Additions
	//----------------------------------------
	if (Imported.YEP_ClassChangeCore) {
		//var Game_Actor_classUnlockLevelRequirementsMet = Game_Actor.prototype.classUnlockLevelRequirementsMet;
		/*
		var Game_Actor_checkLevelUnlockedClasses = Game_Actor.prototype.checkLevelUnlockedClasses
		Game_Actor.prototype.checkLevelUnlockedClasses = function() {
			Game_Actor_checkLevelUnlockedClasses.call(this);
			loop1:
			for (var i = 0; i < $dataClasses.length; ++i) {
				var item = $dataClasses[i];
				if (item == null || typeof item == 'undefined') {
					continue;
				} else {
					for (var classId in item.levelUnlockRequirements2) {
						var level = item.levelUnlockRequirements2[classId];
						if (this.jpLevel(classId) >= level) {
							this.unlockClass(item.id);
							continue loop1;
						} else {
							this.removeClass(item.id);
							continue loop1;
						}
					}
				}	
			}
		};
		*/
		//Fox.JPLevels.checkLevelUnlockedClasses = function(item) {
		Game_Actor.prototype.checkLevelUnlockedClasses = function() {
			for (var i = 0; i < $dataClasses.length; ++i) {
				var item = $dataClasses[i];
				if (this.checkLevelUnlockedClass(item)) {
					this.unlockClass(item.id);
				}
			}
		}
		
		Game_Actor.prototype.checkLevelUnlockedClass = function(item) {
			if (!item) return false;
			
			if (this._unlockedClasses.contains(item.id)) {
				return true;
			} else if (Yanfly.Util.isEmptyObj(item.levelUnlockRequirements)) {
				if (Yanfly.Util.isEmptyObj(item.levelUnlockRequirements2)) {
					return false;
				} else if (this.checkJobLevelUnlockedClass(item)) {
					return true;
				} else {
					return false;
				}
				
			} else if (this.classUnlockLevelRequirementsMet(item)) {
				if (Yanfly.Util.isEmptyObj(item.levelUnlockRequirements2)) {
					return true;
				} else if (this.checkJobLevelUnlockedClass(item)) {
					return true;
				} else {
					return false;
				}
			}
		}
		Game_Actor.prototype.checkJobLevelUnlockedClass = function(item) {
			for (var classId in item.levelUnlockRequirements2) {
				var level = item.levelUnlockRequirements2[classId];
				if (this.jpLevel(classId) >= level) {
					//console.log("item.id: " + item.id, "level: " + level,  "returning true;")
					return true;
				} else {
					//console.log("item.id: " + item.id, "level: " + level,  "returning false;")
					return false;
				}
			}
			return true;
		}
		

		var Window_ClassList_drawItem = Window_ClassList.prototype.drawItem;
		Window_ClassList.prototype.drawItem = function(index) {
			var item = $dataClasses[this._data[index]];
			if (!item) return;
			if (!eval(Yanfly.Param.CCCMaintainLv)) {
				Window_ClassList_drawItem.call(this, index);
				this.changePaintOpacity(this.isEnabled(this._data[index]));
				this.resetFontSettings();
				this.contents.fontSize = Yanfly.Param.CCCLvFontSize;
				var width = this.textWidth("LV" + this._actor.level + " ") + this.textWidth(this.GetActorJpLevelString(this._actor, true, item.id));
				var rect = this.itemRectForText(index);
				this.drawActorJpLevel(this._actor, item.id, rect.width - width, rect.y, true, false, true);
				this.changePaintOpacity(true);
			} else {
				var rect = this.itemRect(index);
				this.changePaintOpacity(this.isEnabled(this._data[index]));
				this.drawClassName(item, rect.x, rect.y, rect.width);
				var rect = this.itemRectForText(index);
				this.resetFontSettings();
				this.contents.fontSize = Yanfly.Param.CCCLvFontSize;
				var width = this.textWidth(this.GetActorJpLevelString(this._actor, true, item.id));
				this.drawActorJpLevel(this._actor, item.id, rect.width - width, rect.y, true, false, true);
				this.changePaintOpacity(true);
			}
			
		};

		var Window_ClassList_drawClassLevel = Window_ClassList.prototype.drawClassLevel;
		Window_ClassList.prototype.drawClassLevel = function(item, x, y, width) {
			if (!usingColoredLevelString) {
				Window_ClassList_drawClassLevel.call(this, item, x, y, width);
				return;
			}
			var level = this._actor.classLevel(item.id) // Yanfly.Util.toGroup(this._actor.classLevel(item.id));
			var fmt = Yanfly.Param.CCCLvFmt;
			var text = fmt.format("");
			this.resetFontSettings();
			this.contents.fontSize = Yanfly.Param.CCCLvFontSize;
			
			var offset = this.textWidth(level);
			this.changeTextColor(this.systemColor());
			this.drawText(text, x-offset, y, width, 'right');
			this.changeTextColor(this.normalColor());
			this.drawText(level, x, y, width, 'right');
		};
		
		var DataManager_processCCCNotetags3 = DataManager.processCCCNotetags3
		DataManager.processCCCNotetags3 = function(group) {
			DataManager_processCCCNotetags3.call(this, group);
			
			for (var n = 1; n < group.length; n++) {
				var obj = group[n];
				var notedata = obj.note.split(/[\r\n]+/);
				// Add Hash Table
				obj.levelUnlockRequirements2 = {};
				var evalMode = 'none';
				for (var i = 0; i < notedata.length; i++) {
					var line = notedata[i];
					if (line.match(/<(?:LEVEL UNLOCK REQUIREMENTS)>/i)) {
						evalMode = 'level unlock requirements';
					} else if (line.match(/<\/(?:LEVEL UNLOCK REQUIREMENTS)>/i)) {
						evalMode = 'none';
					} else if (evalMode === 'level unlock requirements') {
						if (line.match(/CLASS[ ](\d+):[ ]JOBLEVEL[ ](\d+)/i)) {
							var classId = parseInt(RegExp.$1);
							var level = parseInt(RegExp.$2);
							obj.levelUnlockRequirements2[classId] = level;
						}
					}
				}
			}
		}
	}
	//}
	//----------------------------------------
	
	//----------------------------------------
	//{ Yep_SkillLearnSystem - Job Level Window
	//----------------------------------------
	if (Imported.YEP_SkillLearnSystem) {
	var Scene_LearnSkill_createSkillLearnWindow = Scene_LearnSkill.prototype.createSkillLearnWindow;
	Scene_LearnSkill.prototype.createSkillLearnWindow = function() {
		Scene_LearnSkill_createSkillLearnWindow.call(this);
		CreateJobLevelWindow.call(this);
		this._JobLevelWindow.refresh();
	}
	var CreateJobLevelWindow = function() {
		var width 	= Graphics.boxWidth / 2;
		var height 	= 70;
		this._JobLevelWindow = this._JobLevelWindow = new Window_Base(0, 0, width, height);
		SceneManager._scene.addWindow(this._JobLevelWindow);
		this._JobLevelWindow.move(0, Graphics.boxHeight - height, width, height);
		this._JobLevelWindow.createContents();
		
		this._skillLearnWindow.height -= this._JobLevelWindow.height;
		
		this._JobLevelWindow.refresh = Window_JobLevel_refresh;
	}
	var Window_JobLevel_refresh = function() {
		this.contents.clear();
		
		var statusWindow = this.parent.parent._statusWindow;
		var commandWindow = this.parent.parent._commandWindow;
		if (statusWindow._actor) {
			var classId = commandWindow._list[commandWindow.index()].ext;
			var jpLevel = statusWindow._actor.jpLevel(classId);
			this.drawText("Job Level:", 0, 0);
			this.drawText(jpLevel, 0, 0, this.contents.width, "right");
		}
	}
	Scene_LearnSkill_refreshActor = Scene_LearnSkill.prototype.refreshActor;
	Scene_LearnSkill.prototype.refreshActor = function() {
		Scene_LearnSkill_refreshActor.call(this);
		this._JobLevelWindow.refresh();
	}
	
	Window_SkillLearnCommand_select = Window_SkillLearnCommand.prototype.select
	Window_SkillLearnCommand.prototype.select = function(index) {
		Window_SkillLearnCommand_select.call(this, index);
		
		if (this.parent) {
			this.parent.parent._JobLevelWindow.refresh();
		}
	}
	}
	//}
	//----------------------------------------

})();
