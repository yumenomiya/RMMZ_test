//=============================================================================
//  Keke_TpCustom - TPカスタム
// バージョン: 1.2.6
//=============================================================================
// Copyright (c) 2021 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc TPを拡張する
 * @author ケケー
 * @url https://kekeelabo.com
 * 
 * @help
 * 【ver.1.2.6】
 * TPを拡張する。以下の項目を自由に設定可能
 * ◎最大TP
 * ◎初期TP
 * ◎ダメージTPチャージ量
 * ◎消費TP
 * ◎TP動作のカスタマイズ
 * ◎MP動作のTP化
 * 
 * 
 * ● 使い方 ●
 *
 * 【機能1】最大TP
 * 標準は 100。好きな値に設定できる
 *
 * ●キャラごとに最大TPを設定
 * 　アクター、職業、スキル、アイテム、装備、敵キャラ、ステート のメモ欄に
 * <最大TP: 値>
 * 例:)
 * <最大TP: 200>
 * 　最大TP 200 にする
 * ※設定が複数ある場合は最大値が適用される
 *
 *
 * 【機能2】初期TP
 * 　標準は 0〜25。好きな値に設定できる
 * 　25~50 のように書くと、25〜50 のランダム値になる
 *
 * ●キャラごとに初期TPを設定
 * 　アクター、職業、スキル、アイテム、装備、敵キャラ、ステート のメモ欄に
 * <初期TP: 値>
 * 例)
 * <初期TP: 50>
 * 　戦闘開始時のTPが最大TPの 50% になる
 * <初期TP: 25~50>
 * 　戦闘開始時のTPが 25〜50 のランダム値になる
 * ※設定が複数ある場合、最大値が適用される
 * ●同様に初期MPも設定可能
 * <初期MP: 50>
 * 　戦闘開始時のMPが最大TPの M0% になる
 *
 *
 * 【機能3】ダメージTPチャージ量
 * 　標準は ダメージ / 最大HP(小数点切り捨て)。好きな計算式に設定できる
 *
 * ●ダメージTPカスタム
 * 　js式でTPチャージ量を記述
 * 　25 * d / php* tcr  など
 *
 * ●ダメージTP固定値
 * 　固定値分だけTPチャージするようにする
 * 　5 なら 5 上昇
 * 
 * ●ダメージTP最低値
 * 　TPチャージ量の最低値を設定する
 * 　5 なら 上昇量が 5 未満でも 5 は上昇
 *
 * ※優先度は カスタム > 固定値 > 最低値
 *
 * ●キャラごとにダメージTPチャージ量を設定
 * 　アクター、職業、スキル、アイテム、装備、敵キャラ、ステート のメモ欄に
 * <ダメージTPカスタム: 式>
 * <ダメージTP固定: 値>
 * <ダメージTP最低: 値>
 * 例)
  * <ダメージTPカスタム: 25 * d / php* tcr>
 * 　ダメージTPの式が 25 * d / php* tcrになる
 * 　この式はHPが少ないほどTPが多く溜まる仕様
 * <ダメージTP固定: 5>
 * 　ダメージTPが固定値で 5 になる
 * <ダメージTP最低: 5>
 * 　ダメージTP量の最低値が 5 になる
 * ※設定が複数ある場合、最大値が適用される
 *
 *
 * 【機能4】消費TP
 * 　スキルの消費TPを 100 を超えて設定できる
 * 　スキルのメモ欄に
 * <消費TP: 値>
 * 例)
 * <消費TP: 200>
 * 　スキルの消費TPが 200 になる
 *
 *
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 *
 *
 *
 * Extend TP. The following items can be freely set
 * ◎ Maximum TP
 * ◎ Initial TP
 * ◎ Damage TP charge amount
 * ◎ Consumed TP
 * ◎ Customize TP movement
 * ◎ Convert MP movement to TP
 * 
 * 
 * ● How to use ●
 *
 * [Function 1] Maximum TP
 *   Standard is 100. can be set to any value
 *
 * ● Set maximum TP for each character
 * 　In the memo field of actors, occupations, skills, items, equipment,
 *   enemy characters, and states
 * <maxTp: value>
 * example:)
 * <maxTp: 200>
 *   Set maximum TP to 200
 * ※ If there are multiple settings, the maximum value is applied.
 *
 *
 * [Function 2] Initial TP
 *   The standard is 0-25. can be set to any value
 *   If you write like 25~50, it will be a random value between 25~50
 *
 * ● Set initial TP for each character
 * 　In the memo field of actors, occupations, skills, items, equipment,
 *   enemy characters, and states
 * <initTp: 50>
 * TP at the start of battle is 50% of maximum TP
 * <initTp: 25~50>
 *   TP at the start of battle will be a random value between 25 and 50
 * ※ If there are multiple settings, the maximum value is applied.
 * ● You can also set the initial MP in the same way
 * <initMp: 50>
 * MP at the start of battle will be M0% of maximum TP
 *
 *
 * [Function 3] Damage TP charge amount
 *   Standard is damage / maximum HP (decimal point rounded down).
 *   Can be set to any formula
 *
 * ●Damage TP custom
 *   Describe the TP charge amount with a js expression
 *   25 * d / php* tcr etc.
 *
 * ● Damage TP fixed value
 * 　Try to charge TP for a fixed amount
 *   If 5, increase by 5
 *
 * ● Minimum Damage TP
 *   Set the minimum TP charge amount
 *   If 　5, 5 will rise even if the amount of increase is less than 5
 *
 * ※ Priority is his custom>fixed value>lowest value
 *
 * ● Set the damage TP charge amount for each character
 * 　In the memo field of actors, occupations, skills, items, equipment,
 *   enemy characters, and states
 * <damageTpCustom: Formula>
 * <damageTpFix: value>
 * <damageTpMin: value>
 * example)
 * <damageTpCustom: 25 * d / php* tcr>
 *   Damage TP formula becomes 25 * d / php * tcr
 *   This formula is designed so that the less HP you have,
 *   the more TP you accumulate.
 * <damageTpFix: 5>
 * 　Damage TP becomes a fixed value of 5
 * <damageTpMin: 5>
 * 　The minimum damage TP amount will be 5
 * ※ If there are multiple settings, the maximum value is applied.
 *
 *
 * [Function 4] Consumed TP
 * 　Skill consumption TP can be set over 100
 *   In the memo field of the skill
 * <tpCost: value>
 * example)
 * <tpCost: 200>
 * 　Skill consumption TP becomes 200
 *
 *
 * ● Terms of Use ●
 * Feel free to use it under the MIT license.
 * 
 * 
 * 
 * @param 最大TP
 * @desc maxTp TP最大値。基本 100
 * @default 100
 *
 * @param 初期TP
 * @desc initTp TP初期値。50 なら最大TPの 50%。5~10 で 5〜10 のランダムになる。基本 0~25
 * @default 0~25
 * 
 * @param 初期MP
 * @desc initMp MPにもTP同様の初期値を設定。50 なら最大TPの 50%。5~10 で 5〜10 のランダムになる
 * 
 * @param ダメージTP
 * 
 * @param ダメージTPカスタム
 * @parent ダメージTP
 * @type multiline_string
 * @desc damageTpCustom ダメージTPチャージ量をjs式で記述。a:行動者 b:被弾者 v:変数 d:ダメージ量 php:ダメージ前の被弾者HP tcr:TPチャージ率
 *
 * @param ダメージTP固定値
 * @parent ダメージTP
 * @desc damageTpFix ダメージTPチャージ量の固定値
 *
 * @param ダメージTP最低値
 * @parent ダメージTP
 * @desc damageTpMin ダメージTPチャージ量の最低値
 * 
 * @param TPチャージ1回だけ
 * @parent ダメージTP
 * @desc tpChargeOnlyOnce 攻撃が複数ヒットしてもダメージTPチャージを1回分しかしないようにする
 * @type boolean
 * @default false
 * 
 * @param TP動作/バトル
 * 
 * @param 最大TP効果
 * @parent TP動作/バトル
 * @desc maxTpEffect TP回復量が最大TPに連動するようにする。最大TPが 150 なら 100 の場合の 1.5倍 回復
 * @type boolean
 * @default false
 * 
 * @param 戦闘不能時にTP0
 * @parent TP動作/バトル
 * @desc tp_0_onDeath 戦闘不能時にTPを 0 にするようにする
 * @type boolean
 * @default false
 * 
 * @param TP動作/バトル外
 * 
 * @param TPも全回復
 * @parent TP動作/バトル外
 * @desc tpRecoverAll 全回復時にTPも全回復する
 * @type boolean
 * @default false
 * 
 * @param 常にTP表示
 * @parent TP動作/バトル外
 * @desc showTpAlways メニュー画面でTP持ち越しでなくとも常にTP表示する
 * @type boolean
 * @default false
 * 
 * @param MP動作のTP化
 * 
 * @param MPチャージ
 * @parent MP動作のTP化
 * @desc mpCharge MPもTP同様にチャージされるようにする。チャージ量はTPと同じ
 * @type boolean
 * @default false
 * 
 * @param 最大MP効果
 * @parent MP動作のTP化
 * @desc maxMpEffect MP回復量が最大MPに連動するようにする。最大MPが 150 なら 100 の場合の 1.5倍 回復
 * @type boolean
 * @default false
 * 
 * @param 戦闘不能時にMP0
 * @parent MP動作のTP化
 * @desc mp_0_onDeath 戦闘不能時にMPを 0 にするようにする
 * @type boolean
 * @default false 
 */
 
 
 
(() => {
    //- プラグイン名
    const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
    
    
    
    //==================================================
    //--  動的関数 /ベーシック
    //==================================================

    let funcs = {};

    //- ニューファンク
    function newFunc(str, a, b, v, tcr, d, php) {
        if (!funcs[str]) {
            funcs[str] = new Function("a", "b", "v", "tcr", "d", "php", "return " + str);
            return funcs[str](a, b, v, tcr, d, php);
        } else {
            return funcs[str](a, b, v, tcr, d, php);
        }
    };



    //==================================================
    //--  パラメータ受け取り
    //==================================================
    
    //- 真偽化
    function toBoolean(str) {
        if (!str) { return false; }
        const str2 = str.toString().toLowerCase();
        if (str2 == "true" || str2 == "on") { return true; }
        if (str2 == "false" || str2 == "off") { return false; }
        return Number(str);
    };

    let parameters = PluginManager.parameters(pluginName);
    
    const keke_maxTp = parameters["最大TP"];
    const keke_initTp = parameters["初期TP"];
    const keke_initMp = parameters["初期MP"];

    // ダメージTP
    const keke_damageTpCustom = parameters["ダメージTPカスタム"];
    const keke_damageTpFix = parameters["ダメージTP固定値"];
    const keke_damageTpMin = parameters["ダメージTP最低値"];
    const keke_tpChargeOnlyOnce = toBoolean(parameters["TPチャージ1回だけ"]);

    // TP動作(バトル)
    const keke_maxTpEffect = toBoolean(parameters["最大TP効果"]);
    const keke_tp_0_onDeath = toBoolean(parameters["戦闘不能時にTP0"]);
    

    // TP動作(バトル外)
    const keke_tpRecoverAll = toBoolean(parameters["TPも全回復"]);
    const keke_showTpAlways = toBoolean(parameters["常にTP表示"]);

    // MP動作
    const keke_mpCharge = toBoolean(parameters["MPチャージ"]);
    const keke_maxMpEffect = toBoolean(parameters["最大MP効果"]);
    const keke_mp_0_onDeath = toBoolean(parameters["戦闘不能時にMP0"]);

    parameters = null;
    
    
    
    //==================================================
    //-- 最大TP/初期TP
    //==================================================
    
    //- ゲーム・バトラーベース/最大TP(処理追加)
    const _Game_BattlerBase_maxTp = Game_BattlerBase.prototype.maxTp;
    Game_BattlerBase.prototype.maxTp = function() {
        let val = keke_maxTp;
        const metas = totalAllMetaArray(this, ["最大TP", "maxTp"]);
        val = metas.length ? arrayMax(metas) : val;
        if (val) {
            return Number(val);
        }
        return _Game_BattlerBase_maxTp.apply(this);
    };
    
    
    //- ゲーム・バトラーベース/初期TP(処理追加)
    const _Game_Battler_initTp = Game_Battler.prototype.initTp;
    Game_Battler.prototype.initTp = function() {
        // 初期MP
        initMp(this);
        // 初期TP
        let val = keke_initTp;
        const metas = totalAllMetaArray(this, ["初期TP", "initTp"]);
        val = metas.length ? arrayMax(metas) : val;
        if (val) {
            // 二点間ランダム
            val = betweenRandom(val);
            // 最大TPに対する割合化
            const valRate = Math.floor(this.maxTp() * Number(val) / 100)
            this.setTp(valRate);
            return;
        }
        _Game_Battler_initTp.apply(this);
    };



    //==================================================
    //-- ダメージTP
    //==================================================

    // ダメージ量
    let d = null;
    // ダメージ前のHP
    let php = null;
    
    //- ゲームバトラー/ダメージ時の処理(処理追加)
    const _Game_Battler_onDamage = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function(value) {
        // ダメージ量を保存
        d = value;
        _Game_Battler_onDamage.apply(this, arguments);
        d = null;
    };

    //- ゲームアクション/HPダメージの実行(処理追加)
    const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        // ダメージ前のHPを保存
        php = target.hp || 1;
        _Game_Action_executeHpDamage.apply(this, arguments);
        php = null;
    };
    
    //- ゲームバトラー/ダメージTPチャージ(処理追加)
    const _Game_Battler_chargeTpByDamage = Game_Battler.prototype.chargeTpByDamage;
    Game_Battler.prototype.chargeTpByDamage = function(dr) {
        // カスタム
        if (keke_damageTpCustom) {
            let metas = totalAllMetaArray(this, ["ダメージTPカスタム", "damageTpCustom"]);
            const text = metas.length ? metas[metas.length - 1] : keke_damageTpCustom;
            const a = BattleManager._subject;
            const b = this;
            const v = $gameVariables._data;
            const tcr = b.tcr;
            const result = Math.floor(newFunc(text, a, b, v, tcr, d, php));
            this.gainSilentTp(result);
            return result;
        }
        // 固定値
        let metas = totalAllMetaArray(this, ["ダメージTP固定", "damageTpFix"]);
        const fix = metas.length ? arrayMax(metas) : keke_damageTpFix;
        if (fix) {
            this.gainSilentTp(Number(fix) * this.tcr);
            return;
        }
        // 最低値
        metas = totalAllMetaArray(this, ["ダメージTP最低", "damageTpMin"]);
        const min = metas.length ? arrayMax(metas) : keke_damageTpMin;
        if (min) {
            const result = Math.floor(50 * dr * this.tcr);
            this.gainSilentTp(Math.max(result, Number(min)));
            return;
        }
        _Game_Battler_chargeTpByDamage.apply(this, arguments);
    };


    //- ゲームアクション/行動使用者効果の適用(処理追加)
    const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(/*target*/) {
        // TPチャージ1回だけ(連撃時にTPチャージを1回だけにする)
        if (this.subject()._tpChargeOnlyOnceKe) { return; }
        _Game_Action_applyItemUserEffect.apply(this);
        // TPチャージ1回だけフラグをオン
        if (keke_tpChargeOnlyOnce) {
            this.subject()._tpChargeOnlyOnceKe = true;
        }
    };

    //- ゲームバトラー/全アクション終了時の処理(処理追加)
    const _Game_Battler_onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
        _Game_Battler_onAllActionsEnd.apply(this);
        // TPチャージ1回だけフラグをオフ
        this._tpChargeOnlyOnceKe = null;
    };



    //==================================================
    //-- TP動作(バトル)
    //==================================================

    //- ゲームバトラー/TP増減(処理追加)
    const _Game_Battler_gainTp = Game_Battler.prototype.gainTp;
    Game_Battler.prototype.gainTp = function(value) {
        // 最大TP効果(最大TPに応じてTP増減量を増やす)
        if (keke_maxTpEffect) {
            value = Math.floor(value * this.maxTp() / 100);
        }
        _Game_Battler_gainTp.call(this, value);
    };

    //- ゲームバトラー/裏でのTP増減(処理追加)
    const _Game_Battler_gainSilentTp = Game_Battler.prototype.gainSilentTp;
    Game_Battler.prototype.gainSilentTp = function(value) {
        // 最大TP効果(最大TPに応じてTP増減量を増やす)
        let valueEx = null;
        if (keke_maxTpEffect) {
            valueEx = Math.floor(value * this.maxTp() / 100);
        }
        _Game_Battler_gainSilentTp.call(this, valueEx || value);
        // MPチャージ
        mpCharge(this, value);
    };


    //- ゲーム・バトラーベース/スキルのTPコスト(処理追加)
    const _Game_BattlerBase_skillTpCost = Game_BattlerBase.prototype.skillTpCost;
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        // メモ欄のTPコストを適用
        const meta = skill.meta["消費TP"] || skill.meta["tpCost"];
        if (meta) {
            return Number(meta);
        }
        return _Game_BattlerBase_skillTpCost.apply(this, arguments);
    };


    //- ゲーム・バトラーベース/戦闘不能(処理追加)
    const _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        _Game_BattlerBase_die.apply(this);
        // 戦闘不能時にTP0
        if (keke_tp_0_onDeath) {
            setTimeout(tp_0, 0, this);
        }
        // 戦闘不能時にMP0
        if (keke_mp_0_onDeath) {
            setTimeout(mp_0, 0, this);
        }
    };

    //- TP0
    function tp_0(battler) {
        if (!battler) { return; }
        battler._tp = 0;
    };

    //- MP0
    function mp_0(battler) {
        if (!battler) { return; }
        battler._mp = 0;
    };



    //==================================================
    //-- TP動作(バトル外)
    //==================================================

    //- ゲーム・バトラーベース/全回復(処理追加)
    const _Game_BattlerBase_recoverAll = Game_BattlerBase.prototype.recoverAll;
    Game_BattlerBase.prototype.recoverAll = function() {
        _Game_BattlerBase_recoverAll.apply(this);
        // 全回復時にTPも全回復
        if (keke_tpRecoverAll) {
            this._tp = this.maxTp();
        }
    };


    //- スブライトゲージ/有効か(処理追加)
    const _Sprite_Gauge_isValid = Sprite_Gauge.prototype.isValid;
    Sprite_Gauge.prototype.isValid = function() {
        // 常にTP表示
        if (this._battler && this._statusType == "tp" && keke_showTpAlways) {
            return true;
        }
        return _Sprite_Gauge_isValid.apply(this);
    };



    //==================================================
    //--  MP動作のTP化
    //==================================================

    //- 初期MP
    function initMp(battler) {
        if (!keke_initMp) { return; }
        let val = keke_initMp;
        const metas = totalAllMetaArray(battler, ["初期MP", "initMp"]);
        val = metas.length ? arrayMax(metas) : val;
        if (val) {
            // 二点間ランダム
            val = betweenRandom(val);
            // 最大MPに対する割合化
            const valRate = Math.floor(battler.mmp * Number(val) / 100)
            battler.setMp(valRate);
        }
    };


    //- MPチャージ
    function mpCharge(battler, value) {
        if (!keke_mpCharge) { return; }
        let valueEx = null;
        // 最大MP効果
        if (keke_maxMpEffect) {
            valueEx = Math.floor(value * battler.mmp / 100);
        }
        battler.setMp(battler.mp + (valueEx || value));
    };


    //- ゲームバトラー/MP増減(処理追加)
    const _Game_Battler_gainMp = Game_Battler.prototype.gainMp;
    Game_Battler.prototype.gainMp = function(value) {
        // 最大MP効果(最大MPに応じてMP増減量を増やす)
        if (keke_maxMpEffect) {
            value = Math.floor(value * this.mmp / 100);
        }
        _Game_Battler_gainMp.call(this, value);
    };
    
    
    
    //==================================================
    //--  計算基本 /ベーシック
    //==================================================
    
    //- 二点間ランダム
    function betweenRandom(val) {
        val = val.toString();
        let vals = val.split("~");
        if (vals.length >= 2) {
            vals = vals.map(v => Number(v));
            vals.sort((a, b) => a - b);
            val = vals[0];
            val += Math.randomInt(vals[1] - vals[0]) + 1;
        }
        return val;
    };
    
    //- 配列最大値
    function arrayMax(array) {
        let max = null;
        let maxIndex = null;
        array.forEach((v, i) => {
            const vs = v.split("~");
            if (vs.length >= 2) {
                v = (Number(vs[0]) + Number(vs[1])) / 2;
            }
            v = Number(v);
            if (!max || v > max) {
                max = v;
                maxIndex = i;
            }
        });
        return array[maxIndex];
    };
    
    
    
    //==================================================
    //--  メタ配列 /ベーシック
    //==================================================
     
    //- 全てのメタ配列を合算
    function totalAllMetaArray(battler, words, action) {
        // イニット
        let data = null
        let array = [];
        // バトラー値
        data = battler.actorId ? battler.actor() : battler.enemy();
        if (data) { metaAll(data.note, words).forEach(e => array.push(e)); }
        if (battler._actorId) {
            // 職業値
            data = battler.currentClass();
            if (data) { metaAll(data.note, words).forEach(e => array.push(e)); }
            // 装備値
            battler._equips.forEach(equip => {
                data = equip.object();
                if (data) { metaAll(data.note, words).forEach(e => array.push(e)); }
            });
        }
        // ステート値
        battler._states.forEach(stateId => {
            data = $dataStates[stateId];
            if (data) { metaAll(data.note, words).forEach(e => array.push(e)); }
        }, battler);
        // アクション値
        if (action) {
            data = action.item();
            if (data) { metaAll(data.note, words).forEach(e => array.push(e)); }
        }
        // スペースを削除
        array = array.map(e => e.replace(/\s/g, ""));
        // 空の要素は削除
        array = array.filter(e => e);
        return array;
    };
    
    //- 全取得メタ
    function metaAll(note, words) {
        var result = [];
        words.forEach(word => {
            var regText = '\<' + word + ':([^\>]*)\>';
            var regExp_g = new RegExp(regText, 'g');
            var regExp = new RegExp(regText);
            var matches = note.match(regExp_g);
            var match = null;
            if (matches) {
                matches.forEach(function(line) {
                    result.push(line.match(regExp)[1]);
                });
            }
        });
        return result;
    };
      
})();