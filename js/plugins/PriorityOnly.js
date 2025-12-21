/*:
 * @target MZ
 * @plugindesc [v1.0] ステータス無視！タグ優先度だけで行動順をソートします
 * @help
 * メモ欄に `<Priority: n>` を書くと、n の大きい順に行動します。
 * ステータス（AGI 等）は完全無視。
 * 同じ優先度同士は元の行動順（プラグイン未導入時の並び順）を維持します。
 *
 * ──使い方──
 * 1. 本ファイルを「PriorityOnly.js」として保存
 * 2. プロジェクトの js/plugins フォルダに入れ、ON にする
 * 3. スキル／アイテムのメモ欄に `<Priority: 30>` などを記述
 * 4. タグ値が大きい順に行動します
 *
 * 利用規約：改変・再配布自由
 */

(() => {
  const pluginName = 'PriorityOnly';

  // makeActionOrders をラップ
  const _BM_makeActionOrders = BattleManager.makeActionOrders;
  BattleManager.makeActionOrders = function() {
    // ① まずは元の並び（ステータスソート）を作る
    _BM_makeActionOrders.call(this);

    // ② メモタグだけを見て再ソート
    //    → n が大きいほど前に来る
    this._actionBattlers.sort((a, b) => {
      // 各バトラーが選択したアクション（先頭のみ）
      const actA = a._actions[0];
      const actB = b._actions[0];
      // タグから優先度取得（なければ 0）
      const prioA = actA && actA.item().meta.Priority
        ? Number(actA.item().meta.Priority)
        : 0;
      const prioB = actB && actB.item().meta.Priority
        ? Number(actB.item().meta.Priority)
        : 0;
      // 大きいものを先に
      if (prioB !== prioA) return prioB - prioA;
      // 同じ優先度なら、元の順序を壊さない（安定ソート）
      return 0;
    });
  };
})();
