/*:
 * @target MZ
 * @plugindesc 戦闘進行を止めずにアクターへアニメーションを再生する
 * @author Claude
 *
 * @command playAnimation
 * @text アニメーション再生（待機なし）
 * @desc 戦闘進行を止めずに指定アクターへアニメーションを再生する
 *
 * @arg actorIdVariable
 * @text アクターID変数番号
 * @desc アクターIDが格納されているゲーム変数の番号
 * @type variable
 * @default 1
 *
 * @arg animationIdVariable
 * @text アニメーションID変数番号
 * @desc アニメーションIDが格納されているゲーム変数の番号
 * @type variable
 * @default 2
 */

(() => {
    const pluginName = "SilentBattleAnimation";

    // サイレント再生中フラグ
    let _silentPlaying = false;

    // Spriteset_Battle.isBusyを上書き
    // サイレント再生中はisAnimationPlayingをスキップする
    const _Spriteset_Battle_isBusy = Spriteset_Battle.prototype.isBusy;
    Spriteset_Battle.prototype.isBusy = function() {
        if (_silentPlaying) {
            // アニメーション待機をスキップしてキャラ移動待機のみ見る
            return this.isAnyoneMoving();
        }
        return _Spriteset_Battle_isBusy.call(this);
    };

    // アニメーション再生の共通処理
    function playSilentAnimationCore(actorIdVarId, animationIdVarId) {
        const actorId     = $gameVariables.value(actorIdVarId);
        const animationId = $gameVariables.value(animationIdVarId);
        const actor = $gameActors.actor(actorId);
        if (!actor) return;

        _silentPlaying = true;
        $gameTemp.requestAnimation([actor], animationId, false);

        // 次フレームでフラグを戻す
        setTimeout(() => {
            _silentPlaying = false;
        }, 0);
    }

    // プラグインコマンド登録
    PluginManager.registerCommand(pluginName, "playAnimation", args => {
        playSilentAnimationCore(
            Number(args.actorIdVariable),
            Number(args.animationIdVariable)
        );
    });

    // スクリプトから直接呼び出す用のグローバル関数
    window.playSilentAnimation = function(actorIdVarId, animationIdVarId) {
        playSilentAnimationCore(actorIdVarId, animationIdVarId);
    };

})();
