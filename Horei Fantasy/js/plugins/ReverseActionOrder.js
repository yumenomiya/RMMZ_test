/*:
 * @target MZ
 * @plugindesc [v1.7] 即時＆ターン制限トグル式リバース＋全体ステート  
 *            OFF時／ターン切れ時にも行動順を即時復帰  
 * @command ReverseTurns
 * @arg turns   @type number @min 1    @text 継続ターン数
 * @arg stateId @type state            @text 付与/解除ステートID
 */
(() => {
  const PLUGIN   = 'ReverseActionOrder';
  let _turns     = 0;
  let _stateId   = 0;

  // 全体ステート付与
  function addAll(sid) {
    $gameParty.members().concat($gameTroop.members())
      .forEach(b => sid > 0 && !b.isStateAffected(sid) && b.addState(sid));
  }
  // 全体ステート解除
  function removeAll(sid) {
    $gameParty.members().concat($gameTroop.members())
      .forEach(b => sid > 0 && b.isStateAffected(sid) && b.removeState(sid));
  }
  // 即時リバース（または復帰）を実行
  function immediateReverse() {
    if (BattleManager._actionBattlers) {
      BattleManager._actionBattlers.reverse();
      console.log('🔄 ReverseActionOrder: Immediate reverse applied');
    }
  }

  // プラグインコマンド: トグルでON/OFF
  PluginManager.registerCommand(PLUGIN, 'ReverseTurns', args => {
    const turns = Math.max(1, parseInt(args.turns) || 1);
    const sid   = Number(args.stateId) || 0;

    if (_turns > 0) {
      // OFF → ステート解除＋行動順リバース（復帰）
      console.log('🔄 ReverseActionOrder: Toggled OFF');
      removeAll(_stateId);
      immediateReverse();
      _turns   = 0;
      _stateId = 0;
    } else {
      // ON → ステート付与＋行動順リバース（反転）
      console.log(`🔄 ReverseActionOrder: Apply ${turns} turns, state ${sid}`);
      _turns   = turns;
      _stateId = sid;
      addAll(sid);
      immediateReverse();
    }
  });

  // ターン開始時の行動順決定後に反転
  const _BM_make  = BattleManager.makeActionOrders;
  BattleManager.makeActionOrders = function() {
    _BM_make.call(this);
    if (_turns > 0) {
      console.log(`🔄 ReverseActionOrder: Reversing at turn start (${_turns} left)`);
      this._actionBattlers.reverse();
    }
  };

  // ターン終了時にカウントダウン＆ターン切れでOFF処理
  const _BM_end   = BattleManager.endTurn;
  BattleManager.endTurn = function() {
    _BM_end.call(this);
    if (_turns > 0) {
      _turns--;
      console.log(`🔄 ReverseActionOrder: Turns left → ${_turns}`);
      if (_turns <= 0) {
        console.log('🔄 ReverseActionOrder: Auto-clear');
        removeAll(_stateId);
        immediateReverse();  // ここで行動順を復帰
      }
    }
  };

  // バトル終了時にも強制クリア
  const _BM_endB  = BattleManager.endBattle;
  BattleManager.endBattle = function(result) {
    if (_turns > 0 || _stateId > 0) {
      console.log('🔄 ReverseActionOrder: Battle ended → forcing clear');
      removeAll(_stateId);
      immediateReverse();  // 念のため復帰
      _turns   = 0;
      _stateId = 0;
    }
    return _BM_endB.call(this, result);
  };
})();
