/*:
 * @target MZ
 * @plugindesc ステートのメモ欄で属性ダメージ補正を設定し、スキルのメモ欄で属性を追加できるプラグイン
 * @author Copilot
 *
 * @help
 * 【ステート側】
 * <ElementDamageAdjust: elementId=3 formula=value * 0.5>
 * → 炎属性ダメージを半減
 *
 * 【スキル側】
 * <ElementDamageAdjustAdd: 3>
 * → このスキルに炎属性を追加
 *
 * 複数属性追加も可能：
 * <ElementDamageAdjustAdd: 3,4,5>
 *
 * 式の変数:
 *   a = 攻撃者 (Game_Battler)
 *   b = 被攻撃者 (Game_Battler)
 *   value = 元ダメージ
 */

(() => {
    // 元のダメージ計算
    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        let value = _Game_Action_makeDamageValue.call(this, target, critical);

        const a = this.subject(); // 攻撃者
        const b = target;         // 被攻撃者

        // 攻撃側スキルの追加属性を取得
        let elementIds = [];
        if (this.item().meta.ElementDamageAdjustAdd) {
            const meta = this.item().meta.ElementDamageAdjustAdd;
            elementIds = meta.split(",").map(id => Number(id.trim()));
        } else {
            // 通常の属性
            elementIds = [this.item().damage.elementId];
        }

        // 被攻撃者のステートをチェック
        b.states().forEach(state => {
            const meta = state.meta.ElementDamageAdjust;
            if (meta) {
                const match = meta.match(/elementId=(\d+)\s+formula=(.+)/);
                if (match) {
                    const targetElementId = Number(match[1]);
                    const formula = match[2];
                    if (elementIds.includes(targetElementId)) {
                        try {
                            value = eval(formula);
                        } catch (e) {
                            console.error("ElementDamageAdjust formula error:", e);
                        }
                    }
                }
            }
        });

        return value;
    };
})();
