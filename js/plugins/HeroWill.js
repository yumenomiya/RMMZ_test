//=============================================================================
// HeroWill.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc HeroWill
 * @author しゃーしゃしゃん
 *
 * @help
 * HeroWill
 *
 */

(() => {
	"use strict";
	
	var _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
	Game_BattlerBase.prototype.refresh = function() {
		_Game_BattlerBase_refresh.call(this);
		if (this._hp === 0) this._hp = 1;
	}
	
})();

