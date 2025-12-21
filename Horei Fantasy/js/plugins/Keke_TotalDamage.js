//=============================================================================
//  Keke_TotalDamage - 合計ダメージ
// バージョン: 1.3.1
//=============================================================================
// Copyright (c) 2022 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 合計ダメージとヒット数を表示する
 * @author ケケー
 * @url https://kekeelabo.com
 * 
 * @help
 * 【ver.1.3.1】
 * バトラー毎に合計ダメージとヒット数を表示する
 * フォント設定や表示位置、出現アニメなど見た目も自由にデザイン可能
 * 加えて全体の合計ダメージ表示も
 * 
 * ※使用フォントを変更する場合は、
 * 　プラグイン『Keke_CommonData』であらかじめ登録しておくことが必要
 *
 * ● 利用規約 ●
 * MITライセンスのもと、自由に使ってくれて大丈夫です
 * 
 * 
 * 
 * Show total damage and number of hits per battler
 * Font settings, display position, size, etc. can be freely set for easy viewing
 *
 * ※ To change the font used,
 * It is necessary to register in advance with the plug-in "Keke_CommonData"
 *
 * ● Terms of Use ●
 * Feel free to use it under the MIT license.
 * 
 * 
 *
 * @param フォント設定
 * 
 * @param フォント
 * @parent フォント設定
 * @desc 使用するフォント。『Keke_CommonData』で登録したフォント名を書く
 * @default 
 * 
 * @param 文字サイズ
 * @parent フォント設定
 * @desc テキストの文字サイズ。空欄なら標準サイズ。+1 で標準サイズ + 1、-1 で標準サイズ - 1。基本 48
 * @default 48
 * 
 * @param 縁取り幅
 * @parent フォント設定
 * @desc テキストの縁取り幅。5 なら 5ピクセル。基本 10
 * @default 10
 * 
 * @param 文字色設定
 * 
 * @param HPダメージ色
 * @parent 文字色設定
 * @desc HPダメージの文字色設定
 * @type struct<eachCfg>
 * @default {"文字色":"255, 255, 255, 1","縁取り色":"0, 0, 0, 1","無効":""}
 * 
 * @param HP回復色
 * @parent 文字色設定
 * @desc HP回復の文字色設定
 * @type struct<eachCfg>
 * @default {"文字色":"180, 255, 180, 1","縁取り色":"0, 0, 0, 1","無効":""}
 * 
 * @param MPダメージ色
 * @parent 文字色設定
 * @desc MPダメージの文字色設定
 * @type struct<eachCfg>
 * @default {"文字色":"255, 128, 255, 1","縁取り色":"0, 0, 0, 1","無効":""}
 * 
 * @param MP回復色
 * @parent 文字色設定
 * @desc MP回復の文字色設定
 * @type struct<eachCfg>
 * @default {"文字色":"130, 180, 255, 1","縁取り色":"0, 0, 0, 1","無効":""}
 * 
 * @param 表示設定
 * 
 * @param 表示時間
 * @parent 表示設定
 * @desc 合計ダメージの表示時間。50 なら 50フレーム。基本 120
 * @default 120
 *
 * @param 表示位置-味方
 * @parent 表示設定
 * @desc 味方の合計ダメージの表示位置設定
 * @type struct<posCfg>
 * @default {"表示方向":"下","ずらしX":"0","ずらしY":"16","ダメージポップ-方向":"下","ダメージポップ-ずらしX":"0","ダメージポップ-ずらしY":"-32"}
 * 
 * @param 表示位置-敵
 * @parent 表示設定
 * @desc 敵の合計ダメージの表示位置設定
 * @type struct<posCfg>
 * @default {"表示方向":"下","ずらしX":"0","ずらしY":"16","ダメージポップ-方向":"下","ダメージポップ-ずらしX":"0","ダメージポップ-ずらしY":"-32"}
 * 
 * 
 * @param レイヤー
 * @parent 表示設定
 * @desc 合計ダメージの表示するレイヤー。ウインドウより上か下か
 * @type select
 * @option ウインドウ上
 * @option ウインドウ下
 * @default ウインドウ上
 * 
 * @param 付属設定
 * 
 * @param 出現アニメ
 * @parent 付属設定
 * @desc 出現アニメの設定
 * @type struct<appearAnime>
 * @default {"アニメ時間":"15","移動X":"","移動Y":"","スケール":"3","フェードイン":"","無効":""}
 * 
 * @param ヒット数
 * @parent 付属設定
 * @desc ヒット数の表示設定
 * @type struct<hit>
 * @default {"位置":"","表示方向":"左","ずらしX":"0","ずらしY":"0","フォント設定":"","フォント":"","文字サイズ":"30","縁取り幅":"8","文字色":"255, 255, 0, 1","縁取り色":"0, 0, 0, 1","ラべル":"","ヒット数ラベル":"Hit","文字色-ラベル":"0, 255, 192, 1","縁取り色-ラベル":"0, 0, 0, 1","ラベル幅":"32","無効":""}
 * 
 * @param ミス回避
 * @parent 付属設定
 * @desc ミス・回避の設定
 * @type struct<missEva>
 * @default {"テキスト-ミス":"ミス！","テキスト-回避":"回避！","フォント":"","文字サイズ":"30","縁取り幅":"9","文字色":"255, 255, 255, 1","縁取り色":"0, 0, 0, 1","無効":""}
 * 
 * @param 全体合計
 * 
 * @param 全体合計ダメージ
 * @parent 全体合計
 * @desc 敵全体の合計ダメージの設定
 * @type struct<totalDamageAll>
 * @default {"全体合計を表示":"true","フォント設定":"","フォント":"","文字サイズ":"48","縁取り幅":"10","文字色設定":"","HPダメージ色":"{\"文字色\":\"255, 255, 128, 1\",\"縁取り色\":\"0, 0, 0, 1\",\"無効\":\"\"}","MPダメージ色":"","HPダメージ色-味方":"{\"文字色\":\"255, 176, 176, 1\",\"縁取り色\":\"0, 0, 0, 1\",\"無効\":\"\"}","MPダメージ色-味方":"","表示設定":"","表示時間":"120","位置X":"0","位置Y":"200","位置寄せX":"右寄せ","位置寄せY":"寄せない","レイヤー":"ウインドウ上","付属設定":"","出現アニメ":"{\"アニメ時間\":\"10\",\"移動X\":\"-200\",\"移動Y\":\"\",\"スケール\":\"\",\"スケールターン\":\"\",\"フェードイン\":\"0\",\"無効\":\"\"}","ヒット数":"{\"位置\":\"\",\"表示方向\":\"左\",\"ずらしX\":\"0\",\"ずらしY\":\"0\",\"フォント設定\":\"\",\"フォント\":\"\",\"文字サイズ\":\"30\",\"縁取り幅\":\"8\",\"文字色\":\"0, 255, 128, 1\",\"縁取り色\":\"0, 0, 0, 1\",\"ラべル\":\"\",\"ヒット数ラベル\":\"Hit\",\"文字色-ラベル\":\"255, 192, 0, 1\",\"縁取り色-ラベル\":\"0, 0, 0, 1\",\"ラベル幅\":\"25\",\"無効\":\"\"}"}
 * 
 * @param その他
 * 
 * @param ダメージポップ無効
 * @parent その他
 * @desc 標準のダメージポップを表示しない。基本 false
 * @type boolean
 * @default false
 * 
 * @param オーバーキルを許可
 * @parent その他
 * @desc 連撃時に戦闘不能になって敵にも攻撃し続けることを許可する。基本 true
 * @type boolean
 * @default true
 * 
 * @param 個別合計を無効
 * @parent その他
 * @desc 個別の合計ダメージ表示を無効にする。全体合計のみ表示したい場合に。基本 false
 * @type boolean
 * @default false
 */



//==================================================
/*~struct~totalDamageAll:
//==================================================
 * @param 全体合計を表示
 * @desc 敵全体の全体合計ダメージを表示する
 * @type boolean
 * @default true
 * 
 * @param フォント設定
 * 
 * @param フォント
 * @parent フォント設定
 * @desc 使用するフォント。『Keke_CommonData』で登録したフォント名を書く
 * @default 
 * 
 * @param 文字サイズ
 * @parent フォント設定
 * @desc テキストの文字サイズ。空欄なら標準サイズ。+1 で標準サイズ + 1、-1 で標準サイズ - 1。基本 48
 * @default 48
 * 
 * @param 縁取り幅
 * @parent フォント設定
 * @desc テキストの縁取り幅。5 なら 5ピクセル。基本 10
 * @default 10
 * 
 * @param 文字色設定
 * 
 * @param HPダメージ色
 * @parent 文字色設定
 * @desc 全体HPダメージの文字色設定
 * @type struct<eachCfg>
 * @default {"文字色":"255, 255, 128, 1","縁取り色":"0, 0, 0, 1","無効":""}
 * 
 * @param MPダメージ色
 * @parent 文字色設定
 * @desc 全体MPダメージの文字色設定
 * @type struct<eachCfg>
 * @default 
 * 
 * @param HPダメージ色-味方
 * @parent 文字色設定
 * @desc 味方の全体HPダメージの文字色設定。空欄なら通常のHPダメージ色と同じ
 * @type struct<eachCfg>
 * @default {"文字色":"255, 176, 176, 1","縁取り色":"0, 0, 0, 1","無効":""}
 * 
 * @param MPダメージ色-味方
 * @parent 文字色設定
 * @desc 味方の全体HPダメージの文字色設定。空欄なら通常のMPダメージ色と同じ
 * @default 
 * 
 * @param 表示設定
 * 
 * @param 表示時間
 * @parent 表示設定
 * @desc 全体合計ダメージの表示時間。50 なら 50フレーム。基本 120
 * @default 120
 *
 * @param 位置X
 * @parent 表示設定
 * @desc 全体合計ダメージのX位置。50 なら 画面左端(寄せがあったら寄せた位置)から 50ピクセル。基本 0
 * @default 0
 * 
 * @param 位置Y
 * @parent 表示設定
 * @desc 全体合計ダメージのY位置。50 なら 画面上端(寄せがあったら寄せた位置)から 50ピクセル。基本 200
 * @default 200
 *
 * @param 位置寄せX
 * @parent 表示設定
 * @desc X位置を画面左寄せか、画面中央寄せか、画面右寄せにする。基本 右寄せ
 * @type select
 * @option 寄せない
 * @option 左寄せ
 * @option 中央寄せ
 * @option 右寄せ
 * @default 右寄せ
 * 
 * @param 位置寄せY
 * @parent 表示設定
 * @desc Y位置を画面上寄せか、画面中央寄せか、画面下寄せにする。基本 寄せない
 * @type select
 * @option 寄せない
 * @option 上寄せ
 * @option 中央寄せ
 * @option 下寄せ
 * @default 寄せない
 * 
 * @param レイヤー
 * @parent 表示設定
 * @desc 全体合計ダメージを表示するレイヤー。ウインドウより上か下か。基本 ウインドウ上
 * @type select
 * @option ウインドウ上
 * @option ウインドウ下
 * @default ウインドウ上
 * 
 * @param 付属設定
 * 
 * @param 出現アニメ
 * @parent 付属設定
 * @desc 出現アニメの設定
 * @type struct<appearAnime>
 * @default {"アニメ時間":"15","移動X":"","移動Y":"","スケール":"3","フェードイン":"","無効":""}
 * 
 * @param ヒット数
 * @parent 付属設定
 * @desc ヒット数の表示設定
 * @type struct<hit>
 * @default {"位置":"","表示方向":"左","ずらしX":"0","ずらしY":"0","フォント設定":"","フォント":"","文字サイズ":"26","縁取り幅":"7","文字色":"255, 255, 0, 1","縁取り色":"0, 0, 0, 1","ラべル":"","ヒット数ラベル":"Hit","文字色-ラベル":"0, 255, 192, 1","縁取り色-ラベル":"0, 0, 0, 1","ラベル幅":"25","無効":""}
 */



//==================================================
/*~struct~eachCfg:
//==================================================
 * @param 文字色
 * @desc テキストの文字色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 *
 * @param 縁取り色
 * @desc テキストの縁取り色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 * 
 * @param 無効
 * @desc 合計ダメージを表示しない
 * @type boolean
 * @default
 */



//==================================================
/*~struct~posCfg:
//==================================================
 * @param 表示方向
 * @desc 合計ダメージの表示方向。下or中央or上。基本 下
 * @type select
 * @option 上
 * @option 中央
 * @option 下
 * @default 下
 * 
 * @param ずらしX
 * @desc 合計ダメージのX位置ずらし。5 なら 5ピクセル 右へ。基本 0
 * @default 0
 * 
 * @param ずらしY
 * @desc 合計ダメージのY位置ずらし。5 なら 5ピクセル 下へ。基本 0
 * @default 0
 * 
 * @param ダメージポップ-方向
 * @desc 標準のダメージポップの表示方向。下or中央or上。基本 下
 * @type select
 * @option 上
 * @option 中央
 * @option 下
 * @default 下
 * 
 * @param ダメージポップ-ずらしX
 * @desc 標準のダメージポップのX位置ずらし。5 なら 5ピクセル 右へ。基本 0
 * @default 0
 * 
 * @param ダメージポップ-ずらしY
 * @desc 標準のダメージポップのY位置ずらし。5 なら 5ピクセル 下へ。基本 0
 * @default 0
 */



//==================================================
/*~struct~appearAnime:
//==================================================
 * @param アニメ時間
 * @desc アニメの実行時間。5 なら 5フレーム
 * @default 
 * 
 * @param 移動X
 * @desc X移動量。5 なら 5ピクセル分 右へ移動
 * @default
 * 
 * @param 移動Y
 * @desc Y移動量。5 なら 5ピクセル分 跳ねる
 * @default
 * 
 * @param スケール
 * @desc 拡縮アニメ。5 なら サイズ5倍→1倍、0.5 なら サイズ0.5倍→1倍
 * @default 
 * 
 * @param スケールターン
 * @desc 拡縮アニメ-往復。2 なら サイズ1倍→2倍→1倍。0.5 なら サイズ1倍→0.5倍→1倍
 * @default 
 * 
 * @param フェードイン
 * @desc 不透明度アニメ。50 なら 不透明度50→255
 * @default
 * 
 * @param 無効
 * @desc 出現アニメを実行しない
 * @type boolean
 * @default
 */


//==================================================
/*~struct~hit:
//==================================================
 * @param 位置
 *
 * @param 表示方向
 * @parent 位置
 * @desc ヒット数の表示方向。合計ダメージの上or下or左or右。基本 左
 * @type select
 * @option 上
 * @option 下
 * @option 左
 * @option 右
 * @default 左
 * 
 * @param ずらしX
 * @parent 位置
 * @desc ヒット数のX位置ずらし。5 なら 5ピクセル 右へ
 * @default 
 * 
 * @param ずらしY
 * @parent 位置
 * @desc ヒット数のY位置ずらし。5 なら 5ピクセル 下へ
 * @default 
 * 
 * @param フォント設定
 * 
 * @param フォント
 * @parent フォント設定
 * @desc 使用するフォント。『Keke_CommonData』でフォント登録した名を書く
 * @default 
 * 
 * @param 文字サイズ
 * @parent フォント設定
 * @desc ヒット数の文字サイズ。空欄なら標準サイズ。+1 で標準サイズ + 1、-1 で標準サイズ - 1
 * @default 
 * 
 * @param 縁取り幅
 * @parent フォント設定
 * @desc ヒット数の縁取り幅。5 なら 5ピクセル
 * @default 
 * 
 * @param 文字色
 * @parent フォント設定
 * @desc ヒット数の文字色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 *
 * @param 縁取り色
 * @parent フォント設定
 * @desc ヒット数の縁取り色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 * 
 * @param ラべル
 * 
 * @param ヒット数ラベル
 * @parent ラべル
 * @desc ヒット数の表示ラベル
 * @default 
 * 
 * @param 文字色-ラベル
 * @parent ラべル
 * @desc ラベルの文字色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 *
 * @param 縁取り色-ラベル
 * @parent ラべル
 * @desc ラベルの縁取り色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 * 
 * @param ラベル幅
 * @parent ラべル
 * @desc ラベルの横幅。空欄ならラベル内容から幅を測定
 * @default 
 * 
 * @param 無効
 * @desc ヒット数を表示しない
 * @type boolean
 * @default
 */



//==================================================
/*~struct~missEva:
//==================================================
 * @param テキスト-ミス
 * @desc ミスの表示テキスト
 * @default 
 * 
 * @param テキスト-回避
 * @desc 回避の表示テキスト
 * @default 
 * 
 * @param フォント
 * @desc 使用するフォント。『Keke_CommonData』でフォント登録した名を書く
 * @default 
 * 
 * @param 文字サイズ
 * @desc ヒット数の文字サイズ。空欄なら標準サイズ。+1 で標準サイズ + 1、-1 で標準サイズ - 1
 * @default 
 * 
 * @param 縁取り幅
 * @desc ヒット数の縁取り幅。5 なら 5ピクセル
 * @default 
 * 
 * @param 文字色
 * @desc ヒット数の文字色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 *
 * @param 縁取り色
 * @desc ヒット数の縁取り色。赤, 緑, 青, 濃度。色0〜255、濃度0〜1
 * @default 
 * 
 * @param 無効
 * @desc ヒット数を表示しない
 * @type boolean
 * @default
 */
 
 
 
(() => {
    //- プラグイン名
    const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];



    //==================================================
    //--  他プラグインとの連携メソッド
    //==================================================

    //- フルアニメステータスASIの取得
    function getFullAnimeStatusAsi(battler) {
        // サイドビュー時はバトグラに表示
        if ($gameSystem.isSideView()) { return null; }
        if (!$gameTemp._fullAnimeStatusKe) { return null; }
        const asi = $gameTemp.getFullAnimeStatusAsiKe(battler);
        // 顔アイコンがなければバトグラに表示
        //if (!asi || !asi.faceBaseSprite || !asi.faceBaseSprite.visible) { return null; }
        return asi;
    };
    
    
    
    //==================================================
    //--  スプライト追加 /ベーシック
    //==================================================
    
    //- 破棄付きスプライト
    function SpriteKeTtdm() {
        this.initialize(...arguments);
    }

    SpriteKeTtdm.prototype = Object.create(Sprite.prototype);
    SpriteKeTtdm.prototype.constructor = SpriteKeTtdm;

    SpriteKeTtdm.prototype.destroy = function() {
        if (this.bitmap && !this.bitmap._url) { this.bitmap.destroy(); }
        Sprite.prototype.destroy.call(this);
    };


    
    //==================================================
    //--  文字列オート変換 /ベーシック
    //==================================================
    
    // 文字列のハッシュ化
    function strToHash(str) {
        if (!str || !str.length) { return {}; }
        let hash = {};
        const strs = JSON.parse(str);
        let val = null;
        let val2 = null;
        for (let key in strs) {
            val = strs[key];
            if (!key || !val) { continue; }
            val2 = strToAuto(val, key);
            hash[key] = val2;
        }
        return hash;
    };
    
    // 文字列のリスト化
    function strToList(str) {
        if (!str || !str.length) { return []; }
        let array = JSON.parse(str);
        return array.map((val, i) => {
            return strToAuto(val);
        });
    };
    
    // 文字列の自動処理
    function strToAuto(val, key = "") {
        let val2 = null;
        let match = null;
        let end = false;
        if (!end) {
            if (val[0] == "{") {
                val2 = strToHash(val);
                end = true;
            }
        }
        if (!end) {
            if (val[0] == "[") {
                val2 = strToList(val);
                end = true;
            }
        }
        if (!end) { val = val + ","; }
        if (!end) {
            match = val.match(/^\s*(-?\d+,\s*-?\d+,\s*-?\d+,?\s*-?\d*\.?\d*)\s*,$/);
            if (match && !val.match(/[^\d\.\-,\s]/)) {
                if (key.match(/(カラー|色|塗り)/) && !key.includes("トーン") && !key.includes("ブレンド") && !key.includes("配色") && !key.includes("着色") &&  !key.includes("フラッシュ") && !key.includes("チェンジ") &&  !key.includes("選択")) {
                    val2 = "rgba(" +  match[1] + ")";
                } else {
                    val2 = JSON.parse("[" +  match[1] + "]");
                }
                end = true;
            }
        }
        if (!end) {
            match = val.match(/(-?\d+\.?\d*),\s*/g);
            if (match && match.length >= 2 && !val.match(/[^\d\.\-,\s]/)) {
                val2 = JSON.parse("[" + match.reduce((r, s) => r + s).replace(/,$/, "") + "]");
                end = true;
            }
        }
        if (!end) {
            match = val.match(/^(true|false)\s*,/);
            if (match) {
                val2 = match[1] == "true" ? true : false;
                end = true;
            }
        }
        if (!end) {
            match = val.match(/^(-?\d+\.?\d*)\s*,/);
            if (match && !val.match(/[^\d\.\-,\s]/)) {
                val2 = Number(match[1]); end = true;
                end = true;
            }
        }
        if (!end) {
            match = val.match(/^.+,\n?.+/);
            if (match) {
                val2 = val.replace(/\s/g, "").split(",").filter(v => v);
                end = true;
            }
        }
        if (!end) {
            if (val[0] == "\"") { val = val.slice(1); }
            val2 = val.slice(0, -1);
        }
        return val2;
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

    const parameters = PluginManager.parameters(pluginName);
    
    //- フォント設定
    const keke_fontFace = parameters["フォント"];
    const keke_fontSize = parameters["文字サイズ"];
    const keke_outWidth = Number(parameters["縁取り幅"]);

    //- 文字色設定
    const keke_eachCfg = {};
    keke_eachCfg.hpDamage = strToHash(parameters["HPダメージ色"]);
    keke_eachCfg.hpHeal = strToHash(parameters["HP回復色"]);
    keke_eachCfg.mpDamage = strToHash(parameters["MPダメージ色"]);
    keke_eachCfg.mpHeal = strToHash(parameters["MP回復色"]);

    //- 表示設定
    const keke_viewTime = Number(parameters["表示時間"]);
    const keke_posCfgFrd = strToHash(parameters["表示位置-味方"]);
    const keke_posCfgOpp = strToHash(parameters["表示位置-敵"]);
    const keke_layer = parameters["レイヤー"];

    //- 付属設定
    const keke_appearAnime = strToHash(parameters["出現アニメ"]);
    const keke_hitCfg = strToHash(parameters["ヒット数"]);
    const keke_missEva = strToHash(parameters["ミス回避"]);

    //- 全体合計
    const keke_totalDamageAllCfg = strToHash(parameters["全体合計ダメージ"]);

    //- その他
    const keke_noDamagePop = toBoolean(parameters["ダメージポップ無効"]);
    const keke_permitOverKill = toBoolean(parameters["オーバーキルを許可"]);
    const keke_noEachTotal = toBoolean(parameters["個別合計を無効"]);


    
    //==================================================
    //--  共通終了
    //==================================================

    //- スプライトの破棄
    function destroySprite(sprite) {
        if (!sprite) { return; }
        sprite.children.forEach(s => destroySprite(s));
        if (sprite.bitmap && !sprite.bitmap._url) { sprite.bitmap.destroy(); }
        if (sprite._texture) { sprite.destroy(); }
    };



    //==================================================
    //--  共通処理
    //==================================================

    //- ゲームアクション/生死のテスト(処理追加)
    const _Game_Action_testLifeAndDeath = Game_Action.prototype.testLifeAndDeath;
    Game_Action.prototype.testLifeAndDeath = function(target) {
        let result = _Game_Action_testLifeAndDeath.apply(this, arguments);
        // オーバーキルを許可
        if (keke_permitOverKill) {
            if (this.isForOpponent()) { result = true; } 
        }
        return result;
    };

    

    //==================================================
    //--  合計ダメージの測定
    //==================================================

    //- ゲームアクション/HPダメージの実行(処理追加)
    const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        // 純粋HPダメージ量を追加保存
        if (!target._result.hpDamagePureKe) { target._result.hpDamagePureKe = 0; }
        target._result.hpDamagePureKe += value;
        _Game_Action_executeHpDamage.apply(this, arguments);
    };

    //- ゲームアクション/MPダメージの実行(処理追加)
    const _Game_Action_executeMpDamage = Game_Action.prototype.executeMpDamage;
    Game_Action.prototype.executeMpDamage = function(target, value) {
        // 純粋HPダメージ量を追加保存
        if (!target._result.mpDamagePureKe) { target._result.mpDamagePureKe = 0; }
        target._result.mpDamagePureKe += value;
        _Game_Action_executeMpDamage.apply(this, arguments);
    };

    //- ゲームアクション/クリア(処理追加)
    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this);
        // 純粋ダメージ量のクリアを追加
        this.hpDamagePureKe = null;
        this.mpDamagePureKe = null;
    };

    //- ゲームバトラー/ダメージポップの条件
    const _Game_Battler_shouldPopupDamage =  Game_Battler.prototype.shouldPopupDamage;
    Game_Battler.prototype.shouldPopupDamage = function() {
        let result = _Game_Battler_shouldPopupDamage.apply(this);
        // 条件に純粋ダメージを追加
        result = result || this._result.hpDamagePureKe || this._result.mpDamagePureKe;
        return result;
    };

    //- ゲームアクション/ダメージポップの開始(処理追加)
    const _Game_Battler_startDamagePopup = Game_Battler.prototype.startDamagePopup;
    Game_Battler.prototype.startDamagePopup = function() {
        // 合計ダメージの測定
        measureTotalDamage(this);
        // 標準のダメージポップの無効
        if (keke_noDamagePop) { return; }
        _Game_Battler_startDamagePopup.apply(this);
    };

    //- ゲームバトラー/自動回復(処理追加)
    const _Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
    Game_Battler.prototype.regenerateAll = function() {
        const preAlive = this.isAlive();
        _Game_Battler_regenerateAll.apply(this);
        if (preAlive) {
            // 合計ダメージの測定
            measureTotalDamage(this);
        }
    };

    //- 合計ダメージの測定
    function measureTotalDamage(battler) {
        const result = battler.result();
        // リザルト測定済みならリターン
        if (result._totalMeasuredKe) { return; }
        // 合計ダメージ変数を初期化
        if (!battler._totalDamagesKe) { battler._totalDamagesKe = { hp:0, mp:0, order:false, start:true, hit:0, showText:null, preHpDamage:null, preMpDamage:null }; }
        if (!BattleManager._totalDamagesAllKe) { BattleManager._totalDamagesAllKe = { hp:0, mp:0, order:false, start:true, hit:0, showText:null, isActor:null }; }
        // ダメージ量を取得
        const total = battler._totalDamagesKe;
        const totalAll = BattleManager._totalDamagesAllKe;
        // 個別合計を表示するか
        const showEach = !keke_noEachTotal;
        // 全体合計を表示するか
        const showAll = keke_totalDamageAllCfg && keke_totalDamageAllCfg["全体合計を表示"];
        // 純粋ダメージがある場合はそちらを取得、ない場合は通常のダメージを取得
        let changeHp = result.hpDamagePureKe != null ? result.hpDamagePureKe : result.hpDamage;
        let changeMp = result.mpDamagePureKe != null ? result.mpDamagePureKe : result.mpDamage;
        // ミス・回避
        if (result.missed || result.evaded) {
            if (showEach) {
                if (result.missed) { total.missed = true; }
                if (result.evaded) { total.evaded = true; }
                total.order = true;
            }
        // HPダメージ
        } else if (changeHp) {
            // ダメージ/回復が切り替わったらHP合計を初期化
            if (total.preHpDamage && (total.preHpDamage * changeHp < 0)) { total.hp = 0; }
            total.preHpDamage = changeHp;
            // 個別
            if (showEach && changeHp) {
                total.hp += changeHp;
                total.hit++;
                total.order = true;
            }
            // 全体合計からはリジェネ分を除外
            changeHp -= (result.hpRegeneKe || 0);
            // 全体
            if (showAll && result.hpDamage > 0 && changeHp) {
                totalAll.hp += changeHp;
                totalAll.hit++;
                if (totalAll.isActor == null) { totalAll.isActor = battler._actorId ? true : false; }
                totalAll.order = true;
            }
        // MPダメージ
        } else if (changeMp) {
            // ダメージ/回復が切り替わったらMP合計を初期化
            if (total.preMpDamage && (total.preMpDamage * changeMp < 0)) { total.mp = 0; }
            total.preMpDamage = changeMp;
            // 個別
            if (showEach && changeMp) {
                total.mp += changeMp;
                total.hit++;
                total.order = true;
            }
            // 全体合計からはリジェネ分を除外
            changeMp -= (result.mpRegeneKe || 0);
            // 全体
            if (showAll && result.mpDamage > 0 && changeMp) {
                totalAll.mp += changeMp;
                totalAll.hit++;
                if (totalAll.isActor == null) { totalAll.isActor = battler._actorId ? true : false; }
                totalAll.order = true;
            }
        }
        // リザルト測定済みフラグをオン
        result._totalMeasuredKe = true;
    };


    //- ゲームバトラー/リザルトクリア(処理追加)
    const _Game_Battler_clearResult = Game_Battler.prototype.clearResult;
    Game_Battler.prototype.clearResult = function() {
        _Game_Battler_clearResult.apply(this);
        // 測定済みフラグを消去
        this.result()._totalMeasuredKe = null;
    };

    //- ゲームアクション/リザルトクリア
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        // 測定済みフラグを消去
        target.result()._totalMeasuredKe = null; 
        _Game_Action_apply.apply(this, arguments);
    };


    //- ゲームバトラー/HPの自動回復(処理追加)
    /*const _Game_Battler_regenerateHp = Game_Battler.prototype.regenerateHp;
    Game_Battler.prototype.regenerateHp = function() {
        const preHp = this.hp;
        _Game_Battler_regenerateHp.apply(this);
        // 自動回復量を保存
        if (this.hp != preHp) {
            const result = this.result();
            if (result) {
                if (!result.hpRegeneKe) { result.hpRegeneKe = 0; }
                result.hpRegeneKe += -(this.hp - preHp);
            }
        }
    };

    //- ゲームバトラー/MPの自動回復(処理追加)
    const _Game_Battler_regenerateMp = Game_Battler.prototype.regenerateMp;
    Game_Battler.prototype.regenerateMp = function() {
        const preMp = this.mp;
        _Game_Battler_regenerateMp.apply(this);
        // 自動回復量を保存
        if (this.mp != preMp) {
            const result = this.result();
            if (result) {
                if (!result.mpRegeneKe) { result.mpRegeneKe = 0; }
                result.mpRegeneKe += -(this.mp - preMp);
            }
        }
    };

    //- ゲーム・アクションリザルト/クリア(処理追加)
    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this);
        //- 自動回復量をクリア
        this.hpRegeneKe = 0;
        this.mpRegeneKe = 0;
    };*/



    //==================================================
    //--  合計ダメージの進行処理
    //==================================================

    //- ゲームアクション/アクションの準備(処理追加)
    const _Game_Action_prepare = Game_Action.prototype.prepare;
    Game_Action.prototype.prepare = function() {
        // 合計ダメージの初期化
        initTotalDamage(this.subject());
        _Game_Action_prepare.apply(this);
    };
    
    //- 合計ダメージの初期化
    function initTotalDamage(battler) {
        // 全てのバトラーに対して処理
        const members = [...$gameParty.members(), ...$gameTroop.members()];
        let inited = false;
        members.forEach(battler => {
            // 表示オーダー中はリターン
            const total = battler._totalDamagesKe;
            if (total && total.order) { return; }
            // ポップウェイト中はリターン
            if (battler._inPopWaitKe) { return; }
            // 個別合計ダメージを初期化
            battler._totalDamagesKe = null;
            battler.clearResult();
            inited = true;
        });
        // 全体合計ダメージを初期化
        if (inited) {
            BattleManager._totalDamagesAllKe = null;
        }
    };
    


    //==================================================
    //--  合計ダメージの更新
    //==================================================

    //- スプライトバトラー・ダメージポップ/更新(処理追加)
    const _Sprite_Battler_updateDamagePopup = Sprite_Battler.prototype.updateDamagePopup;
    Sprite_Battler.prototype.updateDamagePopup = function() {
        _Sprite_Battler_updateDamagePopup.apply(this);
        // 合計ダメージの更新
        updateTotalDamage(this);
    };
    
    //- スプライトセット・バトル/更新(処理追加)
    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.apply(this);
        // 全体合計ダメージの更新
        updateTotalDamage(this, true);
    };

    // 合計ダメージの更新
    function updateTotalDamage(bodySprite, isAll) {
        // 全体合計ダメージ設定を取得
        const allCfg = isAll ? keke_totalDamageAllCfg : {};
        // 合計ダメージスプライトの開始
        startTotalDamageSprite(bodySprite, allCfg);
        // 合計ダメージスプライトの更新
        updateTotalDamageSprite(bodySprite, allCfg)
    };

    // 合計ダメージスプライトの更新
    function updateTotalDamageSprite(bodySprite, allCfg) {
        const tdSprite = bodySprite._totalDamageSpriteKe;
        if (!tdSprite) { return; }
        // 全体合計ダメージの位置更新
        if (isAll(allCfg)) {
            updateTotalDamagePosAll(tdSprite, bodySprite, allCfg);
        // 合計ダメージの位置更新
        } else {
            updateTotalDamagePos(tdSprite, bodySprite);
        }
        // 合計ダメージアニメの更新
        updateAppearAnime(tdSprite);
        // 合計ダメージスプライトの消去
        delTotalDamageSprite(tdSprite);
        // 合計ダメージスプライト消去の更新
        updateTotalDamageSpriteDel(tdSprite, bodySprite);
    };

    //- 全体合計か
    function isAll(allCfg) {
        return Object.keys(allCfg).length;
    }



    //==================================================
    //--  合計ダメージスブライトの形成
    //==================================================

    // 合計ダメージスプライトの開始
    function startTotalDamageSprite(bodySprite, allCfg) {
        const total = isAll(allCfg) ? BattleManager._totalDamagesAllKe : (bodySprite._battler ? bodySprite._battler._totalDamagesKe : null);
        if (!total || !total.order) { return; }
        if (total.hp) {
            if (isAll(allCfg) && total.hp < 0) { return; }
            // 合計ダメージスプライトの形成-HP
            createTotalDamageSprite(bodySprite, total.hp, total.hit, "hp", total.start, allCfg, total.isActor);
        } else if (total.mp) {
            if (isAll(allCfg) && total.mp < 0) { return; }
            // 合計ダメージスプライトの形成-MP
            createTotalDamageSprite(bodySprite, total.mp, total.hit, "mp", total.start, allCfg, total.isActor);
        } else if (total.missed || total.evaded) {
            // ミス回避の作成
            makeMissEva(bodySprite, total);
        }
        total.order = false;
        total.start = false;
    };


    //- 合計ダメージスプライトの形成
    function createTotalDamageSprite(bodySprite, value, hitNum, type, isStart, allCfg, isActor) {
        // フォント設定を取得
        const fontSize = getFontSize(allCfg["文字サイズ"] || keke_fontSize);
        const ow = allCfg["縁取り幅"] || keke_outWidth || 9;
        // 文字色設定を取得
        const word = type + (value < 0 ? "Heal" : "Damage");
        const type2 = type == "hp" ? "HP" : "MP";
        const actorWord = isActor ? "-味方" : "";
        const colorCfg = allCfg[type2 + "ダメージ色" + actorWord] || keke_eachCfg[word];
        if (colorCfg["無効"]) { return; }
        // サイズを取得
        const valueStr = value.toString().replace("-", "");;
        const width = measureTextWidth(valueStr, fontSize, allCfg["フォント"] || keke_fontFace, bodySprite.bitmap);
        const height = fontSize;
        // 描画の前準備
        const d = prepareDraw(bodySprite, hitNum, width, height, ow, allCfg);
        // ビットマップ形成
        const bitmap = new Bitmap(d.bitmapW, d.bitmapH);
        // フォント設定の適用
        applyFontCfg(bitmap, colorCfg);
        // ダメージ数を描画
        bitmap.drawText(abbreviationValue(valueStr), d.damageX, d.damageY, d.damageW, d.damageH, fontSize);
        // ヒット数の描画
        drawHitNum(bitmap, d);
        // スプライトの形成2
        createSprite2(bitmap, d, isStart, bodySprite, allCfg);
    };

    //- 丸め数値
    function abbreviationValue(val) {
        const str = val.toString();
        const length = str.length;
        if (length >= 13) {
            const cutEnd = length - 12;
            let head = str.slice(0, cutEnd);
            let rest = Number(str.slice(cutEnd, cutEnd + 4));
            if (rest) { rest += "億"; } else { rest = ""; }
            return `${head}兆${rest}`
        } else if (length >= 9) {
            const cutEnd = length - 8;
            let head = str.slice(0, cutEnd);
            let rest = Number(str.slice(cutEnd, cutEnd + 4));
            if (rest) { rest += "万"; } else { rest = ""; }
            return `${head}億${rest}`
        } else if (length >= 7) {
            const cutEnd = length - 4;
            let head = str.slice(0, cutEnd);
            let rest = Number(str.slice(cutEnd, cutEnd + 4));
            if (!rest) { rest = ""; }
            return `${head}万${rest}`
        }
        return `${val}`;
    };

    //- 描画の前準備
    function prepareDraw(bodySprite, hitNum, width, height, ow, allCfg) {
        const d = {};
        d.cfg = allCfg["ヒット数"] || keke_hitCfg;
        if (d.cfg["無効"]) { return { height:0, ow:0 }; }
        // フォント設定の適用
        let f = applyFontCfg({}, d.cfg);
        // テキストを取得
        d.hitStr = hitNum.toString() + "";
        d.label = d.cfg["ヒット数ラベル"] || "";
        d.allText = d.hitStr + d.label;
        // フォント設定を取得
        let fontSize = f.fontSize
        const fontFace = d["フォント"] || keke_fontFace;
        const hitOw = f.outW
        // 表示方向を取得
        const hitDire = d.cfg["表示方向"];
        // ずらしを取得
        const hitOffsetX = d.cfg["ずらしX"] || 0;
        const hitOffsetY = d.cfg["ずらしY"] || 0;
        // サイズを取得
        const hitH = fontSize;
        const hitNumW = measureTextWidth(d.hitStr, fontSize, fontFace, bodySprite.bitmap);
        const hitLabelW = d.cfg["ラベル幅"] || measureTextWidth(d.label, fontSize, fontFace, bodySprite.bitmap);
        const hitW = hitNumW + hitLabelW + hitOw / 2 + 2;
        // 表示方向ごとに位置サイズデータを取得
        if (hitDire == "上") {
            d.bitmapW = Math.max(width + ow * 2, hitW + hitOw * 2.5 + hitOffsetX);
            d.bitmapH = height + ow * 2 + hitH + hitOffsetY;
            d.hitX = ow / 2 + hitOffsetX;
            d.hitY = ow / 2 + hitOffsetY + Math.floor(((height - hitH) / 2));
            d.damageX = ow / 2;
            d.damageY = d.hitY + hitH + ow / 2;
            d.damageW = width;
            d.damageH = height;
        } else if (hitDire == "下") {
            d.bitmapW = Math.max(width + ow * 2, hitW + hitOw * 2.5 + hitOffsetX);
            d.bitmapH = height + ow * 2 + hitH + hitOffsetY;
            d.damageX = ow / 2;
            d.damageY = ow / 2;
            d.damageW = width;
            d.damageH = height;
            d.hitX = ow / 2 + hitOffsetX;
            d.hitY = d.damageY + d.damageH + ow / 2 + hitOffsetY + Math.floor(((height - hitH) / 2));
        } else if (hitDire == "左") {
            d.bitmapW = width + ow * 2 + hitW + hitOffsetX;
            d.bitmapH = Math.max(height + ow * 2, hitH + hitOw * 2 + hitOffsetY);
            d.hitX = hitOw / 2 + hitOffsetX;
            d.hitY = ow + hitOffsetY + Math.floor(((height - hitH) / 2));
            d.damageX = d.hitX + hitW + 2;
            d.damageY = ow / 2 
            ;
            d.damageW = width;
            d.damageH = height;
            d.damageCenterX = -hitW / 2;
        } else if (hitDire == "右") {
            d.bitmapW = width + ow * 2 + hitW + hitOffsetX;
            d.bitmapH = Math.max(height + ow * 2, hitH + hitOw * 2 + hitOffsetY);
            d.damageX = ow / 2;
            d.damageY = ow / 2;
            d.damageW = width;
            d.damageH = height;
            d.hitX = d.damageX + d.damageW + hitOw / 2 + hitOffsetX;
            d.hitY = ow + hitOffsetY + Math.floor(((height - hitH) / 2));
            d.damageCenterX = hitW / 2;
        }
        d.hitW = hitW;
        d.hitH = hitH;
        d.hitNumW = hitNumW;
        d.hitLabelW = hitLabelW;
        d.hitOw = hitOw;
        return d;
    };

     //- ヒット数の描画
     function drawHitNum(bitmap, d) {
        if (!d.allText) { return; }
        // フォント設定の適用-ラベル
        applyFontCfg(bitmap, d.cfg, "-ラベル");
        // ラベルの描画
        bitmap.drawText(d.label, d.hitX + d.hitNumW + 2, d.hitY, d.hitLabelW, d.hitH);
        // フォント設定の適用
        applyFontCfg(bitmap, d.cfg);
        // ヒット数の描画
        bitmap.drawText(d.hitStr, d.hitX, d.hitY, d.hitNumW, d.hitH);
    };

    //- スプライトの形成2
    function createSprite2(bitmap, d, isStart, bodySprite, allCfg = {}) {
        // スプライトがあったらビットマップを差し替えて終了
        const tdSprite = bodySprite._totalDamageSpriteKe;
        if (tdSprite) {
            tdSprite.bitmap.destroy();
            tdSprite.bitmap = bitmap;
            // スプライトの形成3
            createSprite3(tdSprite, d, isStart, null, allCfg);
            return;
        };
        // スプライト形成
        const sprite = new SpriteKeTtdm(bitmap);
        // アンカー
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        // プラグイン『MPP_Pseudo3DBattle』対応
        sprite._pseudo3dType = "excl";
        // チルド
        const scene = SceneManager._scene;
        const layerWord = allCfg["レイヤー"] || keke_layer;
        const layer = layerWord == "ウインドウ下" ? scene._spriteset._battleField : scene._windowLayer;
        layer.addChild(sprite);
        // 変数にセット
        bodySprite._totalDamageSpriteKe = sprite;
        // スプライトの形成3
        createSprite3(sprite, d, isStart, bodySprite, allCfg);
    };

    //- スプライトの形成3
    function createSprite3(sprite, d, isStart, bodySprite, allCfg) {
        // 表示時間
        sprite._viewTimeKe = Math.floor((allCfg["表示時間"] || keke_viewTime) / 2);
        // 消去アニメを停止
        sprite._delAnimeKe = null;
        // ダメージを中央化
        sprite._damageCenterXKe = d.damageCenterX ? d.damageCenterX : 0;
        // 出現アニメの開始
        if (isStart) { startAppearAnime(sprite, allCfg); }
        // 位置更新フラグ
        sprite._updatesPosKe = true;
        // フロントビュー対応時はアクターステータス位置を取得
        if (bodySprite && isFrontViewAdapt(bodySprite)) {
            const statusWindow = SceneManager._scene._statusWindow;
            const rect = statusWindow.faceRect(0);
            sprite._frontActorYKe = rect.height;
        }
        // 消去アニメを停止
        sprite._delAnimeKe = null;
        sprite.opacity = 255;
        // 全体合計フラグ
        if (isAll(allCfg)) { sprite._isAllKe = true; }
    };


    //- ミス回避の作成
    function makeMissEva(bodySprite, total) {
        const cfg = keke_missEva;
        if (cfg["無効"]) { return; }
        const text = total.missed ? cfg["テキスト-ミス"] : cfg["テキスト-回避"];
        // テキストの形成
        createText(bodySprite, text, cfg, total.start);
    };

    //- テキストの形成
    function createText(bodySprite, text, cfg, isStart) {
        // フォント設定を取得
        const fontSize = getFontSize(cfg["文字サイズ"] || keke_fontSize);
        const ow = cfg["縁取り幅"] || keke_outWidth || 9;
        // サイズを取得
        const width = measureTextWidth(text, fontSize, cfg["フォント"] || keke_fontFace, bodySprite.bitmap);
        const height = fontSize;
        // ビットマップ形成
        const bitmap = new Bitmap(width + ow * 2, height + ow * 2);
        // フォント設定の適用
        applyFontCfg(bitmap, cfg);
        // テキストを描画
        bitmap.drawText(text, ow / 2, ow / 2, width, height, fontSize);
        // スプライトの形成2
        createSprite2(bitmap, {}, isStart, bodySprite);
    };



    //==================================================
    //--  合計ダメージの位置・移動
    //==================================================

    //- 合計ダメージの位置更新
    function updateTotalDamagePos(sprite, battlerSprite) {
        if (!sprite._frame.width) { return; }
        // フルアニメステータスASIの取得
        const asi = getFullAnimeStatusAsi(battlerSprite._battler);
        // 位置設定を取得
        const posCfg = battlerSprite._enemy ? keke_posCfgOpp : keke_posCfgFrd;
        // レイヤーがウインドウ下の時のY補正
        const layerOffsetY = keke_layer == "ウインドウ下" ? 24 : 0;
        const offsetX = (posCfg["ずらしX"] || 0) + (sprite._movedXKe || 0);
        const offsetY = (posCfg["ずらしY"] || 0) + (sprite._movedYKe || 0) + layerOffsetY;
        // フルアニメ時の位置
        if (asi) {
            const pos = posCfg["表示方向"] == "上" ? -0.5 : posCfg["表示方向"] == "中央" ? 0 : 0.5;
            // 位置
            sprite.x = (asi.faceSprite ? asi.faceHomeX + asi.faceOffsetX : battlerSprite._homeX + battlerSprite._offsetX) + offsetX + (sprite._damageCenterXKe || 0);
            sprite.y = asi.faceHomeY + asi.faceOffsetY + asi.faceFrame.height * pos + offsetY + (sprite._frontActorYKe || 0);
        // 通常時の位置
        } else if (battlerSprite && battlerSprite.parent) {
            const pos = posCfg["表示方向"] == "上" ? -1 : posCfg["表示方向"] == "中央" ? -0.5 : 0;
            // サイドビューアクターのX補正
            const svActorOffsetX = $gameSystem.isSideView() && battlerSprite._actor ? -32 : 0;
            // 表示方向下の時のY補正
            const underOffsetY = pos == 0 && battlerSprite._frame.height ? -sprite._frame.height / 2 : 0;
            // 位置
            sprite.x = battlerSprite._homeX + battlerSprite._offsetX + offsetX + (sprite._damageCenterXKe || 0) + svActorOffsetX
            sprite.y = battlerSprite._homeY + battlerSprite._offsetY + battlerSprite._frame.height * battlerSprite.scale.y * pos + offsetY + (sprite._frontActorYKe || 0) + underOffsetY;
        }
        // 画面外に出さない
        noOutScreen(sprite, sprite._frame.width || 0, sprite._frame.height);
    };

    //- 画面外に出さない
    function noOutScreen(sprite, w, h) {
        const overL = sprite.x - w / 2;
        const overR = sprite.x + w/ 2 - Graphics.width;
        const overU = sprite.y - h / 2;
        const overD = sprite.y + h / 2 - Graphics.height;
        if (overL < 0) { sprite.x -= overL; } else
        if (overR > 0) { sprite.x -= overR; }
        if (overU < 0) { sprite.y -= overU; } else
        if (overD > 0) { sprite.y -= overD; }
    };


    //- 全体合計ダメージの位置更新
    function updateTotalDamagePosAll(sprite, spriteset, allCfg) {
        if (!sprite._frame.width) { return; }
        // 位置設定を取得
        const posX = allCfg["位置X"] || 0;
        const posY = allCfg["位置Y"] || 0;
        const alignX = allCfg["位置寄せX"];
        const alignY = allCfg["位置寄せY"];
        // 位置寄せを適用
        const width = sprite._frame.width;
        const height = sprite._frame.height;
        const gw = Graphics.width;
        const gh = Graphics.height;
        let x = 0;
        let y = 0;
        if (alignX && alignX != "寄せない") {
            x = alignX == "左寄せ" ? width / 2 : alignX == "中央寄せ" ? gw / 2 : gw - width / 2;
        }
        if (alignY && alignY != "寄せない") {
            y = alignY == "上寄せ" ? height / 2 : alignY == "中央寄せ" ? gh / 2 : gh - height / 2;
        }
        // レイヤーがウインドウ下の時のY補正
        const layerOffsetY = allCfg["レイヤー"] == "ウインドウ下" ? 24 : 0;
        // 位置
        sprite.x = x + posX + (sprite._movedXKe || 0);
        sprite.y = y + posY + (sprite._movedKYe || 0) + layerOffsetY;
    };


    //- スブライトバトラー/ダメージポップのずらしX(処理追加)
    const _Sprite_Battler_damageOffsetX = Sprite_Battler.prototype.damageOffsetX;
    Sprite_Battler.prototype.damageOffsetX = function() {
        let result = _Sprite_Battler_damageOffsetX.apply(this);
        const posCfg = this._enemy ? keke_posCfgOpp : keke_posCfgFrd;
        result += posCfg["ダメージポップ-ずらしX"] || 0;
        return result;
    };

    //- スブライトバトラー/ダメージポップのずらしY(処理追加)
    const _Sprite_Battler_damageOffsetY = Sprite_Battler.prototype.damageOffsetY;
    Sprite_Battler.prototype.damageOffsetY = function() {
        let result = _Sprite_Battler_damageOffsetY.apply(this);
        const posCfg = this._enemy ? keke_posCfgOpp : keke_posCfgFrd;
        // 表示方向の処理
        const dire = posCfg["ダメージポップ-方向"] || "下";
        if (dire != "下") {
            const height = this._frame.height * this.scale.y;
            result += dire == "中央" ? -height / 2 : -height;
        }
        // ずらしの処理
        result += posCfg["ダメージポップ-ずらしY"] || 0;
        return result;
    };


    //- フロントビュー対応か
    function isFrontViewAdapt(sprite) {
        const statusWindow = SceneManager._scene._statusWindow;
        return !$gameSystem.isSideView() && sprite._actor && (statusWindow && statusWindow.visible);
    };



    //==================================================
    //--  出現アニメ
    //==================================================

    //- 出現アニメの開始
    function startAppearAnime(sprite, allCfg) {
        const drift = {};
        // パラメータ
        const d = allCfg["出現アニメ"] || keke_appearAnime || {};
        if (d["無効"]) { return; }
        const timeMax = d["アニメ時間"] || 0;
        if (!timeMax) { return; }
        const moveX = d["移動X"];
        const moveY = d["移動Y"];;
        const scale = d["スケール"];
        const scaleT = d["スケールターン"];
        const opacity = d["フェードイン"];
        const easing = "EO";
        // アニメ時間
        drift.timeMax = timeMax;
        drift.duration = timeMax;
        // 移動X
        if (moveX != null && moveX) {
            drift.posXs = makeDrift([{ val:0, easing:easing }], -moveX, timeMax, "移動X");
            sprite._movedXKe = -moveX;
        }
        // 移動Y
        if (moveY != null && moveY) {
            drift.posYs = makeDrift([{ val:-moveY, easing:"TN" }], 0, timeMax, "移動Y");
            sprite._movedYKe = 0;
        }
        // スケール
        if (scale != null && scale != 1) {
            // スケールX
            drift.scaleXs = makeDrift([{ val:1, easing:easing }], scale, timeMax, "スケールX");
            sprite.scale.x = scale;
            // スケールY
            drift.scaleYs = makeDrift([{ val:1, easing:easing }], scale, timeMax, "スケールY");
            sprite.scale.y = scale;
        }
        // スケールターン
        if (scaleT != null && scaleT != 1) {
            // スケールXターン
            drift.scaleXTs = makeDrift([{ val:scaleT, easing:"TN" }], 1, timeMax, "スケールXターン");
            // スケールYターン
            drift.scaleYTs = makeDrift([{ val:scaleT, easing:"TN" }], 1, timeMax, "スケールYターン");
        }
        // 不透明度
        if (opacity != null && opacity != 255) {
            drift.opacities = makeDrift([{ val:255, easing:easing }], opacity, timeMax, "不透明度");
            sprite.opacity = opacity;
        }
        // 不透明度
        if (opacity != null && opacity != 255) {
            drift.opacities = makeDrift([{ val:255, easing:easing }], opacity, timeMax, "不透明度");
            sprite.opacity = opacity;
        }
        // 変数にセット
        sprite._driftKe = drift;
    };

    //- 変動の作成
    function makeDrift(datas, current, time, word) {
        if (!datas || !datas.length) { return; }
        if (word == "回転角") { current %= 360; }
        let ds = [];
        // データの数だけ処理
        datas.forEach(data => {
            if (data.val == null) { return; }
            const d = {};
            d.num = data.num || 1;
            d.datas = data.datas || ["", ""];
            const extra = data.extra || "";
            d.break = extra.includes("B");
            d.jump = extra.includes("J");
            d.direction = extra.includes("D");
            d.isCos = extra.includes("C");
            d.isRandom = d.datas[1].includes("~");
            d.easing = data.easing || "E";
            d.easingRate = data.easingRate || 1;
            d.timeMax = time / d.num;
            d.duration = d.timeMax;
            d.start = roundDecimal(current, 1000000);
            d.target = Number(data.val);
            d.vol = d.target - d.start;
            d.current = d.start;
            d.end = 0;
            // 終点
            if (d.easing == "TN" || d.easing == "RD") {
                d.end = d.start;
            } else {
                d.end = d.target;
            }
            ds.push(d);
        });
        return ds;
    };


    //- 出現アニメの更新
    function updateAppearAnime(sprite) {
        if (!sprite._driftKe) { return; }
        const drift = sprite._driftKe;
        // 位置X
        if (drift.posXs && drift.posXs.length) {
            let moveXs = updateDrift(drift.posXs, "位置X");
            moveXs.forEach(v => sprite._movedXKe += v);
        }
        // 位置Y
        if (drift.posYs && drift.posYs.length) {
            let moveYs = updateDrift(drift.posYs, "位置Y");
            moveYs.forEach(v => sprite._movedYKe += v);
        }
        // スケールX
        if (drift.scaleXs && drift.scaleXs.length) {
            let scaleXs = updateDrift(drift.scaleXs, "スケールX");
            scaleXs.forEach(v => sprite.scale.x += v);
        }
        // スケールY
        if (drift.scaleYs && drift.scaleYs.length) {
            let scaleYs = updateDrift(drift.scaleYs, "スケールY");
            scaleYs.forEach(v => sprite.scale.y += v);
        }
        // スケールXターン
        if (drift.scaleXTs && drift.scaleXTs.length) {
            let scaleXTs = updateDrift(drift.scaleXTs, "スケールXターン");
            scaleXTs.forEach(v => sprite.scale.x += v);
        }
        // スケールYターン
        if (drift.scaleYTs && drift.scaleYTs.length) {
            let scaleYTs = updateDrift(drift.scaleYTs, "スケールYターン");
            scaleYTs.forEach(v => sprite.scale.y += v);
        }
        // 不透明度
        if (drift.opacities && drift.opacities.length) {
            let opacities = updateDrift(drift.opacities, "不透明度");
            opacities.forEach(v => sprite.opacity += v);
        }
        // カウントを減らす
        drift.duration--;
        // 終了
        if (!drift.duration) {
            sprite._driftKe = null;
        }
    };

    //- 変動の更新
    function updateDrift(ds, word) {
        let rs= []
        // データの数だけ処理
        ds.forEach(d => {
            // カウントを減らす
            d.duration--;
            let r = 0;
            next = applyEasing(d.current, d.start, d.target, d.duration, d.timeMax, d.easing, d.easingRate);
            r = next - d.current;
            d.current = next;
            // 終了
            if (d.duration <= 0) {
                // 終了値に合わせる
                r += roundDecimal(d.end - next, 1000000);
                d.num--;
                d.duration = d.timeMax;
            }
            if (r) { rs.push(r); }
        });
        return rs;
    };



    //==================================================
    //--  合計ダメージの消去
    //==================================================

    // 合計ダメージスプライトの消去
    function delTotalDamageSprite(sprite) {
        if (!sprite || !sprite._viewTimeKe) { return; }
        let del = false;
        // カウントを減らす
        sprite._viewTimeKe--;
        // バトル終了時 && メッセージ中はすぐ消す
        const messageWindow = SceneManager._scene._messageWindow;
        const inMessage = messageWindow && messageWindow.isOpen() && keke_layer == "ウインドウ上";
        if (BattleManager._phase == "battleEnd" || inMessage) {
            sprite._viewTimeKe = 0;
        }
        // 終了
        if (sprite._viewTimeKe <= 0) {
            // 消去アニメをセット
            const d = {};
            d.timeMax = 10;
            d.duration = d.timeMax;
            d.start = sprite.opacity;
            d.target = 0;
            d.easing = "E";
            sprite._delAnimeKe = d;
        }
        return del;
    };


    // 合計ダメージスプライト消去の更新
    function updateTotalDamageSpriteDel(sprite, bodySprite) {
        if (!sprite._delAnimeKe) { return; }
        const d = sprite._delAnimeKe;
        // カウントを減らす
        d.duration--;
        // 不透明度を変動
        sprite.opacity = applyEasing(sprite.opacity, d.start, d.target, d.duration, d.timeMax, d.easing);
        // 終了
        if (d.duration <= 0) {
            destroySprite(sprite);
            bodySprite._totalDamageSpriteKe = null;
        }
    };



    //==================================================
    //--  テキスト基本 /ベーシック
    //==================================================

    //- テキスト横幅の測定
    function measureTextWidth(text, fontSize, fontFace, bitmap) {
        let useExistingBitmap = false;
        let oriFontFace = null;
        let oriFontSize = null;
        if (bitmap) {
            useExistingBitmap = true;
            oriFontFace = bitmap.fontFace;
            oriFontSize = bitmap.fontSize;
        } else {
            bitmap = new Bitmap(1, 1);
        }
        bitmap.fontSize = fontSize || $gameSystem.mainFontSize();
        bitmap.fontFace = fontFace || $gameSystem.mainFontFace();
        const width = bitmap.measureTextWidth(text);
        if (useExistingBitmap) {
            bitmap.fontFace = oriFontFace;
            bitmap.fontSize = oriFontSize;
        } else {
            bitmap.destroy();
        }
        return width;
    };
    
    //- テキストバイト数
    function textBytes(text) {
        let byte = 0;
        for (var i = 0; i < text.length; i++) {
            var c = text.charCodeAt(i);
            if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
                byte += 1;
            } else {
                byte += 2;
            }
        }
        return byte;
    };

    
    //- フォント設定の適用
    function applyFontCfg(bitmap, cfg, word = "") {
        bitmap.fontFace = cfg["フォント"] || keke_fontFace || $gameSystem.numberFontFace();
        bitmap.fontSize = getFontSize(cfg["文字サイズ"] || keke_fontSize);
        bitmap.textColor = cfg["文字色" + word] || "rgba(255, 255, 255, 1)";
        bitmap.outlineWidth = cfg["縁取り幅"] || keke_outWidth || 10;
        bitmap.outlineColor = cfg["縁取り色" + word] || "rgba(0, 0, 0, 1)";
        return { fontFace:bitmap.fontFace, fontSize:bitmap.fontSize, outW:bitmap.outlineWidth};
    };


    //- フォントサイズの取得
    function getFontSize(size) {
        const mainSize = $gameSystem.mainFontSize();
        if (!size) { return mainSize; }
        const sizeStr = size.toString();
        if (sizeStr.includes("+")) {
            const plus = Number(sizeStr.replace("+", ""));
            size = mainSize + plus;
        } else if (sizeStr.includes("-")) {
            const minus = Number(sizeStr.replace("-", ""));
            size = mainSize - minus;
        }
        return Number(size);
    };


    //- 小数点を丸める
    function roundDecimal(val, rate) {
        const newVal = Math.floor(val* rate) / rate
        return newVal;
    };



    //==================================================
    //--  イージング
    //==================================================

    //- イージングの適用
    function applyEasing(current, start, target, duration, timeMax, easing, easingRate = 1) {
        // イージングの処理
        if (easing.match(/ei|eo|e/i)) {
            return processEasing(current, target, duration + 1, timeMax, easing, easingRate);
        }
        // カービング
        if (easing.match(/tn|cg|fk|cf|rd|bk/i)) {
            return processCurving(current, start, target, duration + 1, timeMax, easing, easingRate);
        }
    };
    
    //- イージングの処理
    function processEasing(current, target, duration, timeMax, easing, easingRate = 1) {
        const lt = calcEasing((timeMax - duration) / timeMax, easing, easingRate);
        const t = calcEasing((timeMax - duration + 1) / timeMax, easing, easingRate);
        const start = (current - target * lt) / (1 - lt);
        return start + (target - start) * t;
    };
    
    //- イージングの計算
    function calcEasing(t, easing, easingRate = 1) {
        const exponent = 2 * easingRate;
        switch (easing.toUpperCase()) {
            case "EI":
                return easeIn(t, exponent);
            case "EO":
                return easeOut(t, exponent);
            case "E":
                return easeInOut(t, exponent);
            default:
                return t;
        }
    };

    //- 各イージング処理
    function easeIn(t, exponent) {
        return Math.pow(t, exponent) || 0.001;
    };
    
    function easeOut(t, exponent) {;
        return 1 - (Math.pow(1 - t, exponent) || 0.001);
    };
    
    function easeInOut(t, exponent) {
        if (t < 0.5) {
            return easeIn(t * 2, exponent) / 2;
        } else {
            return easeOut(t * 2 - 1, exponent) / 2 + 0.5;
        }
    };
    
    //- カービングの処理
    function processCurving(current, start, target, duration, timeMax, easing, easingRate = 1) {
        // 0 の時の処理
        if (duration <= 0) { return easing.match(/tn|rd|bk/i) ? start : target; }
        let result = 0;
        // ターン
        if (easing.toUpperCase() == "TN") {
            result = processTurn(current, start, target, duration, timeMax, easingRate);
        // チャージ
        } else if (easing.toUpperCase() == "CG") {
            result = processCharge(current, start, target, duration, timeMax, easingRate);
        // フック
        } else if (easing.toUpperCase() == "FK") {
            result = processFook(current, start, target, duration, timeMax, easingRate);
        // チャージフック
        } else if (easing.toUpperCase() == "CF") {
            result = processChargeFook(current, start, target, duration, timeMax, easingRate);
        // ラウンド
        } else if (easing.toUpperCase() == "RD") {
            result = processRound(current, start, target, duration, timeMax, easingRate);
        // バック
        }  else if (easing.toUpperCase() == "BK") {
            result = processBack(current, start, target, duration, timeMax, easingRate);
        }
        return result;
    };
    
    //- ターンの処理
    function processTurn(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax / 2);
        const d2 = timeMax - d1;
        if (duration > d2) {
            result = processEasing(current, target, duration - d2, d1, "eo", easingRate);
        } else {
            result = processEasing(current, start, duration, d2, "ei", easingRate);
        }
        return result;
    };
    
    //- チャージの処理
    function processCharge(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax / 3);
        const d2 = timeMax - d1;
        if (duration > d2) {
            result = processEasing(current, start + (start - target) * easingRate, duration - d2, d1, "e");
        } else {
            result = processEasing(current, target, duration, d2, "e");
        }
        return result;
    };
    
    //- フックの処理
    function processFook(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax * 2 / 3);
        const d2 = timeMax - d1;
        if (duration > d2) {
            result = processEasing(current, target + (target - start) * easingRate, duration - d2, d1, "e");
        } else {
            result = processEasing(current, target, duration, d2, "e");
        }
        return result;
    };
    
    //- チャージフックの処理
    function processChargeFook(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax / 4);
        const d3 = Math.round(timeMax / 4);
        const d2 = timeMax - d1 - d3;
        if (duration > (d2 + d3)) {
            result = processEasing(current, start + (start - target) * easingRate, duration - d2 - d3, d1, "e");
        } else if (duration > d3) {
            result = processEasing(current, target + (target - start) * easingRate, duration - d3, d2, "e");
        } else {
            result = processEasing(current, target, duration, d3, "e");
        }
        return result;
    };
    
    //- ラウンドの処理
    function processRound(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = Math.round(timeMax / 4);
        const d2 = Math.round(timeMax / 2);
        const d3 = timeMax - d1 - d2;
        if (duration > (d2 + d3)) {
            result = processEasing(current, target, duration - d2 - d3, d1, "eo");
        } else if (duration > d3) {
            result = processEasing(current, start + (start - target) * easingRate, duration - d3, d2, "e");
        } else {
            result = processEasing(current, start, duration, d3, "ei");
        }
        return result;
    };
    
    //- バックの処理
    function processBack(current, start, target, duration, timeMax, easingRate) {
        let result = 0;
        const d1 = 1;
        const d2 = timeMax - d1;
        if (duration > d2) {
            result = processEasing(current, target, duration - d2, d1, "e", easingRate);
        } else {
            result = processEasing(current, start, duration, d2, "e", easingRate);
        }
        return result;
    };
    
})();