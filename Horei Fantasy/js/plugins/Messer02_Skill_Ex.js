//=============================================================================
// Messer02_Skill_Ex.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Messerさんのスキル強化関連
 * @author しゃーしゃしゃん
 *
 * @help
 * めっさーさんのスキルをコントロールと強化するための総合プラグイン
 *
 */

const INIT_M_SKILL_TURN = 5;
const INIT_M_SKILL_COUNTER = 3;
const INIT_M_SKILL_SKILLNAME = "ジャイアント・バズ";
const INIT_M_SKILL_RELOAD = "フルリロード";

const INIT_M_AFFECTED_STATE = 123;

const INIT_M_ACTOR_NAME = "めっさー";



(() => {
	"use strict";
	
	let _SkillSpTurn = INIT_M_SKILL_TURN;
	let _SkillSpCounter = INIT_M_SKILL_COUNTER;
	let _StateAdded = false;
	
	let _ActorBase;
	
	const _BattleManager_update = BattleManager.update;
	BattleManager.update = function() {
		_BattleManager_update.apply(this, arguments);
		if (this._phase == "init") {
			_SkillSpCounter = INIT_M_SKILL_COUNTER;
			_SkillSpTurn = INIT_M_SKILL_TURN;
			_StateAdded = false;
		}
		else if (this._phase == "turnEnd") {
			if (_SkillSpTurn > 0 && _SkillSpCounter == 0) _SkillSpTurn = _SkillSpTurn - 1;
			
		}
		else if(this._phase == null) {
			_SkillSpCounter = INIT_M_SKILL_COUNTER;
			_SkillSpTurn = INIT_M_SKILL_TURN;
		}
		
	};
    
	const _BattleManager_startAction = BattleManager.startAction;
	BattleManager.startAction = function() {
		_BattleManager_startAction.apply(this, arguments);
		
		isDieOnAction();
		
		let isDie = false;
		let isFullReload = false;
		if (this._action.isSkill()) {
			const itemName = $dataSkills[this._action._item._itemId].name;
			
			if (itemName == INIT_M_SKILL_SKILLNAME) {
				if (_SkillSpCounter > 0) _SkillSpCounter = _SkillSpCounter - 1;
			}
			else if (itemName == INIT_M_SKILL_RELOAD) {
				isFullReload = true;
			}
			else if(itemName == "戦闘不能") {
				isDie = true;
			}
		}
		
		const actorId = this._action._subjectActorId;
		var actorName = "";
		try {
			actorName = $dataActors[actorId].name;
		}
		catch(Exception){}
		
		if (actorName == INIT_M_ACTOR_NAME) {
			
			if (_SkillSpCounter == 0 && !_StateAdded) {
				$gameActors.actor(actorId).addNewState(INIT_M_AFFECTED_STATE);
				_StateAdded = true;
			}
			if (_SkillSpTurn == 0) {
				$gameActors.actor(actorId).removeState(INIT_M_AFFECTED_STATE);
				_SkillSpTurn = INIT_M_SKILL_TURN;
				_SkillSpCounter = INIT_M_SKILL_COUNTER;
				_StateAdded = false;
			}
			
			if (isDie) {
				$gameActors.actor(actorId).addNewState(1);
				isDie = false;
			}
			
			if (isFullReload) {
				_SkillSpTurn = INIT_M_SKILL_TURN;
				_SkillSpCounter = INIT_M_SKILL_COUNTER;
				$gameActors.actor(actorId).removeState(INIT_M_AFFECTED_STATE);
				isFullReload = false;
			}
			
			console.log("SpCounter: " + _SkillSpCounter + "|SpTurn: " + _SkillSpTurn);
			console.log($gameActors.actor(actorId).states());
		}
	};
	
	function isDieOnAction() {
		$gameParty.members().forEach(member => {
			if (member.isDeathStateAffected()) {
				let _DieActorName = $dataActors[member._actorId].name;
				if (_DieActorName == INIT_M_ACTOR_NAME) {
					$gameActors.actor(member._actorId).removeState(INIT_M_AFFECTED_STATE);
					_SkillSpTurn = INIT_M_SKILL_TURN;
					_SkillSpCounter = INIT_M_SKILL_COUNTER;
				}
				return;
			}
		});
	}
})();

