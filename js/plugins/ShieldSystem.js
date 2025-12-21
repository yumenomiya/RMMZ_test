//=============================================================================
// ShieldSystem.js
// Version: 1.0.2
// Author: Claude
//=============================================================================

(() => {
    'use strict';

    //=============================================================================
    // Plugin Parameters
    //=============================================================================
    const pluginName = 'ShieldSystem';
    const parameters = PluginManager.parameters(pluginName);
    const defaultShieldMax = parameters['Default Shield Max'] || 'a.mhp';
    const shieldGaugeColor = parameters['Shield Gauge Color'] || '#1e90ff';
    const shieldPopupColor = parameters['Shield Popup Color'] || '#1e90ff';

    //=============================================================================
    // Plugin Commands
    //=============================================================================
// プラグインコマンドの修正版
PluginManager.registerCommand(pluginName, 'setShield', args => {
    const actorId = Number(args.actorId);
    const formula = args.formula;
    const actor = $gameActors.actor(actorId);
    if (actor) {
        const value = Math.floor(evaluateFormula(formula, actor, actor));
        actor.setShield(value);
    }
});

PluginManager.registerCommand(pluginName, 'addShield', args => {
    const actorId = Number(args.actorId);
    const formula = args.formula;
    const actor = $gameActors.actor(actorId);
    if (actor) {
        const value = Math.floor(evaluateFormula(formula, actor, actor));
        actor.addShield(value);
    }
});

PluginManager.registerCommand(pluginName, 'reduceShield', args => {
    const actorId = Number(args.actorId);
    const formula = args.formula;
    const actor = $gameActors.actor(actorId);
    if (actor) {
        const value = Math.floor(evaluateFormula(formula, actor, actor));
        actor.reduceShield(value);
    }
});

    PluginManager.registerCommand(pluginName, 'getShield', args => {
        const actorId = Number(args.actorId);
        const variableId = Number(args.variableId);
        const actor = $gameActors.actor(actorId);
        if (actor) {
            $dataSystem.variables[variableId] = actor.getShield();
        }
    });

    //=============================================================================
    // Utility Functions
    //=============================================================================
    function evaluateFormula(formula, user, target) {
        try {
            const a = user;
            const b = target;
            const v = $dataSystem.variables;
            const s = $dataSystem.switches;
            return Math.max(eval(formula), 0);
        } catch (e) {
            return 0;
        }
    }

// getShieldMaxValue - 修正版
function getShieldMaxValue(battler) {
    // Priority: State > Class > Actor > Plugin Default
    let maxValue = 0;
    let baseMaxValue = 0;
    
    // Check plugin default (now supports formula)
    baseMaxValue = Math.floor(evaluateFormula(defaultShieldMax, battler, battler));
    
    // Check actor note
    if (battler.isActor() && battler.actor().note) {
        const match = battler.actor().note.match(/<ShieldMax:\s*(.+)>/i);
        if (match) {
            baseMaxValue = Math.floor(evaluateFormula(match[1], battler, battler));
        }
    }
    
    // Check class note
    if (battler.isActor() && battler.currentClass().note) {
        const match = battler.currentClass().note.match(/<ShieldMax:\s*(.+)>/i);
        if (match) {
            baseMaxValue = Math.floor(evaluateFormula(match[1], battler, battler));
        }
    }
    
    // Check states for override (highest priority)
    for (const state of battler.states()) {
        if (state.note) {
            const match = state.note.match(/<ShieldMax:\s*(.+)>/i);
            if (match) {
                baseMaxValue = Math.floor(evaluateFormula(match[1], battler, battler));
                break; // States have highest priority for override
            }
        }
    }
    
    // Apply state-based additions and subtractions
    let additionalValue = 0;
    for (const state of battler.states()) {
        if (state.note) {
            // Check for shield max addition
            const addMatch = state.note.match(/<ShieldMaxAdd:\s*(.+)>/i);
            if (addMatch) {
                additionalValue += Math.floor(evaluateFormula(addMatch[1], battler, battler));
            }
            
            // Check for shield max subtraction
            const subMatch = state.note.match(/<ShieldMaxSub:\s*(.+)>/i);
            if (subMatch) {
                additionalValue -= Math.floor(evaluateFormula(subMatch[1], battler, battler));
            }
        }
    }
    
    maxValue = baseMaxValue + additionalValue;
    
    return Math.max(maxValue, 0);
}


    //=============================================================================
    // Game_BattlerBase
    //=============================================================================
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._shield = 0;
        this._shieldNonPenetration = false; // 修正: デフォルトで貫通（false）
    };

    Game_BattlerBase.prototype.getShield = function() {
        return this._shield || 0;
    };

    Game_BattlerBase.prototype.setShield = function(value) {
       const maxShield = getShieldMaxValue(this);
       // 小数点以下切り捨て
       const intValue = Math.floor(value);
       this._shield = Math.min(Math.max(intValue, 0), maxShield);
   };

   // Game_BattlerBase.prototype.addShield - 修正版
   Game_BattlerBase.prototype.addShield = function(value) {
       // 小数点以下切り捨て
       const intValue = Math.floor(value);
       this.setShield(this.getShield() + intValue);
   };

   // Game_BattlerBase.prototype.reduceShield - 修正版
   Game_BattlerBase.prototype.reduceShield = function(value) {
       // 小数点以下切り捨て
       const intValue = Math.floor(value);
       this.setShield(this.getShield() - intValue);
   };

    Game_BattlerBase.prototype.getShieldMax = function() {
        return getShieldMaxValue(this);
    };

    Game_BattlerBase.prototype.hasShield = function() {
        return this.getShield() > 0;
    };

    // 修正: 非貫通シールドかどうかを判定
    Game_BattlerBase.prototype.isShieldNonPenetration = function() {
        return this._shieldNonPenetration || false;
    };

    // 修正: 非貫通シールドの設定
    Game_BattlerBase.prototype.setShieldNonPenetration = function(nonPenetration) {
        this._shieldNonPenetration = nonPenetration;
    };

    //=============================================================================
    // Game_Action
    //=============================================================================
// Game_Action.prototype.apply - 修正版（シールド効果処理を統一）
const _Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
    // Reset shield processing flag
    this._shieldProcessed = false;
    
    _Game_Action_apply.call(this, target);
    
    // Handle shield effects on target
    if (this.item().note) {
        const setMatch = this.item().note.match(/<SetShield:\s*(.+)>/i);
        const addMatch = this.item().note.match(/<AddShield:\s*(.+)>/i);
        const reduceMatch = this.item().note.match(/<ReduceShield:\s*(.+)>/i);
        const nonPenetrationMatch = this.item().note.match(/<ShieldNonPenetration:\s*(true|false)>/i);
        
        if (setMatch) {
            const value = Math.floor(evaluateFormula(setMatch[1], this.subject(), target));
            target.setShield(value);
        }
        if (addMatch) {
            const value = Math.floor(evaluateFormula(addMatch[1], this.subject(), target));
            target.addShield(value);
        }
        if (reduceMatch) {
            const value = Math.floor(evaluateFormula(reduceMatch[1], this.subject(), target));
            target.reduceShield(value);
        }
        if (nonPenetrationMatch) {
            target.setShieldNonPenetration(nonPenetrationMatch[1] === 'true');
        }
    }
    
    // Handle shield-based healing
    if (this.isShieldAbsorb()) {
        const result = target.result();
        const absorbRate = this.getShieldAbsorbRate();
        const totalDamage = result.hpDamage + (result.shieldDamage || 0);
        const absorbAmount = Math.floor(totalDamage * absorbRate);
        this.subject().addShield(absorbAmount);
    }
};

const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
Game_Action.prototype.executeHpDamage = function(target, value) {
    // Apply shield logic before HP damage
    if (value > 0 && !this._shieldProcessed) {
        this._shieldProcessed = true;
        const result = target.result();
        let remainingDamage = value;
        
        // Check if this is a shield-ignore attack
        if (this.isShieldIgnore()) {
            // Shield ignore: damage goes directly to HP, no shield interaction
            result.shieldDamage = 0;
            // 通常のダメージ処理を呼び出してポップアップを確保
            _Game_Action_executeHpDamage.call(this, target, value);
            return;
        }
        
        // Check if this is a shield-only attack
        if (this.isShieldOnly()) {
            const shieldDamage = Math.min(remainingDamage, target.getShield());
            target.reduceShield(shieldDamage);
            result.shieldDamage = shieldDamage;
            result.hpDamage = 0;
            result.missed = false;
            result.used = true;
            return;
        }
        
        // シールドがある場合の処理
        if (target.hasShield()) {
            const currentShield = target.getShield();
            const shieldDamage = Math.min(remainingDamage, currentShield);
            target.reduceShield(shieldDamage);
            result.shieldDamage = shieldDamage;
            result.missed = false;
            result.used = true;
            remainingDamage -= shieldDamage;
            
            // 修正: 貫通・非貫通の判定を明確化
            const isNonPenetration = target.isShieldNonPenetration();
            
            if (isNonPenetration) {
                // 非貫通シールド：残りダメージはHPに通らない
                result.hpDamage = 0;
            } else {
                // 貫通シールド（デフォルト）：残りダメージがHPに通る
                if (remainingDamage > 0) {
                    // 【重要な修正】元の処理を呼び出してポップアップを確保
                    _Game_Action_executeHpDamage.call(this, target, remainingDamage);
                } else {
                    result.hpDamage = 0;
                }
            }
        } else {
            // シールドがない場合は通常のダメージ処理
            _Game_Action_executeHpDamage.call(this, target, value);
        }
    } else {
        _Game_Action_executeHpDamage.call(this, target, value);
    }
};

    Game_Action.prototype.isShieldOnly = function() {
        if (this.item().note) {
            return this.item().note.includes('<ShieldOnly>');
        }
        return false;
    };

    Game_Action.prototype.isShieldAbsorb = function() {
        if (this.item().note) {
            return this.item().note.includes('<ShieldAbsorb:');
        }
        return false;
    };

Game_Action.prototype.isShieldIgnore = function() {
    if (this.item().note) {
        return this.item().note.includes('<ShieldIgnore>');
    }
    return false;
};

    Game_Action.prototype.getShieldAbsorbRate = function() {
        if (this.item().note) {
            const match = this.item().note.match(/<ShieldAbsorb:\s*(\d+)>/i);
            if (match) {
                return Number(match[1]) / 100;
            }
        }
        return 0;
    };

Game_Action.prototype.isShieldIgnore = function() {
    if (this.item().note) {
        return this.item().note.includes('<ShieldIgnore>');
    }
    return false;
};

    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        let damage = _Game_Action_makeDamageValue.call(this, target, critical);
        
        // Modify damage based on shield status
        if (this.item().note && target.hasShield()) {
            const match = this.item().note.match(/<ShieldPowerRate:\s*(\d+)>/i);
            if (match) {
                const rate = Number(match[1]) / 100;
                damage = Math.floor(damage * rate);
            }
        }
        
        return damage;
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

// Game_Battler.prototype.die - 修正版（戦闘不能時にシールドを0に）
const _Game_Battler_die = Game_Battler.prototype.die;
Game_Battler.prototype.die = function() {
    _Game_Battler_die.call(this);
    // 戦闘不能時にシールド値を0に初期化
    this.setShield(0);
};

// Game_Battler.prototype.useItem - 修正版（シールド効果処理を削除）
const _Game_Battler_useItem = Game_Battler.prototype.useItem;
Game_Battler.prototype.useItem = function(item) {
    _Game_Battler_useItem.call(this, item);
    
    // シールド効果の処理は Game_Action.prototype.apply で統一するため、
    // ここでは削除（重複実行を防ぐため）
};

    //=============================================================================
    // Game_ActionResult
    //=============================================================================
    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.call(this);
        this.shieldDamage = 0;
    };

const _Game_ActionResult_isHit = Game_ActionResult.prototype.isHit;
Game_ActionResult.prototype.isHit = function() {
    // If shield damage occurred, consider it a hit
    if (this.shieldDamage > 0) {
        return true;
    }
    // If HP damage occurred (including shield ignore), consider it a hit
    if (this.hpDamage > 0) {
        return true;
    }
    return _Game_ActionResult_isHit.call(this);
};

    //=============================================================================
    // Window_BattleLog
    //=============================================================================
const _Window_BattleLog_displayDamage = Window_BattleLog.prototype.displayDamage;
Window_BattleLog.prototype.displayDamage = function(target) {
    const result = target.result();
    
    // Shield ignore attacks - display as normal HP damage
    if (result.hpDamage > 0 && result.shieldDamage === 0) {
        target.performDamage();
        
        // Display HP damage message
        const hpText = `${result.hpDamage}のダメージを受けた！`;
        this.push('addText', hpText);
        return;
    }
    
    if (result.shieldDamage > 0) {
        target.performDamage();
        
        // Display shield damage message
        const shieldText = `${result.shieldDamage}のダメージを防いだ！`;
        this.push('addText', shieldText);
        
        // If HP damage also occurred, display HP damage message
        if (result.hpDamage > 0) {
            const hpText = `${result.hpDamage}のダメージを受けた！`;
            this.push('addText', hpText);
        }
    } else {
        // Normal damage display when no shield damage
        _Window_BattleLog_displayDamage.call(this, target);
    }
};

    const _Window_BattleLog_displayMiss = Window_BattleLog.prototype.displayMiss;
    Window_BattleLog.prototype.displayMiss = function(target) {
        const result = target.result();
        
        // Don't display miss message if shield damage occurred
        if (result.shieldDamage > 0) {
            return;
        }
        
        _Window_BattleLog_displayMiss.call(this, target);
    };

    const _Window_BattleLog_displayFailure = Window_BattleLog.prototype.displayFailure;
    Window_BattleLog.prototype.displayFailure = function(target) {
        const result = target.result();
        
        // Don't display failure message if shield damage occurred
        if (result.shieldDamage > 0) {
            return;
        }
        
        _Window_BattleLog_displayFailure.call(this, target);
    };

const _Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    const result = target.result();
    
    // If shield damage occurred, handle it specially
    if (result.shieldDamage > 0) {
        if (result.used) {
            this.displayDamage(target);
        }
        // Don't override miss/failure display when shield damage occurred
        return;
    } else {
        // Normal action results display when no shield damage
        _Window_BattleLog_displayActionResults.call(this, subject, target);
    }
};

    //=============================================================================
    // Sprite_Battler
    //=============================================================================
    const _Sprite_Battler_initMembers = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        _Sprite_Battler_initMembers.call(this);
        this._shieldGaugeSprite = null;
        this._shieldValueSprite = null;
        this._shieldGaugeCreated = false;
    };

    const _Sprite_Battler_setBattler = Sprite_Battler.prototype.setBattler;
    Sprite_Battler.prototype.setBattler = function(battler) {
        _Sprite_Battler_setBattler.call(this, battler);
        if (!this._shieldGaugeCreated) {
            this.createShieldGauge();
        }
    };

    Sprite_Battler.prototype.createShieldGauge = function() {
        if (!$dataSystem.optSideView || this._shieldGaugeCreated) return;
        
        // Remove existing gauges if any
        if (this._shieldGaugeSprite) {
            this.removeChild(this._shieldGaugeSprite);
            this._shieldGaugeSprite = null;
        }
        if (this._shieldValueSprite) {
            this.removeChild(this._shieldValueSprite);
            this._shieldValueSprite = null;
        }
        
        this._shieldGaugeSprite = new Sprite();
        this._shieldGaugeSprite.bitmap = new Bitmap(80, 8);
        this._shieldValueSprite = new Sprite();
        this._shieldValueSprite.bitmap = new Bitmap(80, 20);
        
        this.addChild(this._shieldGaugeSprite);
        this.addChild(this._shieldValueSprite);
        
        this._shieldGaugeCreated = true;
    };

    const _Sprite_Battler_update = Sprite_Battler.prototype.update;
    Sprite_Battler.prototype.update = function() {
        _Sprite_Battler_update.call(this);
        if (this._shieldGaugeCreated && !this._updatingShieldGauge) {
            this._updatingShieldGauge = true;
            this.updateShieldGauge();
            this._updatingShieldGauge = false;
        }
    };

    Sprite_Battler.prototype.updateShieldGauge = function() {
        if (!this._shieldGaugeSprite || !this._battler) return;
        
        const shield = this._battler.getShield();
        const maxShield = this._battler.getShieldMax();
        
        if (shield > 0) {
            this._shieldGaugeSprite.visible = true;
            this._shieldValueSprite.visible = true;
            
            // Position at right-top of character to avoid overlap
            const offsetX = this.width * 0.6; // Right side
            const offsetY = -this.height * 0.8; // Top side
            
            this._shieldGaugeSprite.x = offsetX;
            this._shieldGaugeSprite.y = offsetY;
            this._shieldValueSprite.x = offsetX;
            this._shieldValueSprite.y = offsetY - 20;
            
            // Draw gauge
            const bitmap = this._shieldGaugeSprite.bitmap;
            bitmap.clear();
            bitmap.fillRect(0, 0, 80, 8, '#000000');
            bitmap.fillRect(1, 1, 78, 6, '#333333');
            
            const rate = shield / maxShield;
            const gaugeWidth = Math.floor(76 * rate);
            bitmap.fillRect(2, 2, gaugeWidth, 4, shieldGaugeColor);
            
            // Draw value
            const valueBitmap = this._shieldValueSprite.bitmap;
            valueBitmap.clear();
            valueBitmap.textColor = shieldGaugeColor;
            valueBitmap.fontSize = 14;
            valueBitmap.drawText(shield.toString(), 0, 0, 80, 20, 'center');
        } else {
            this._shieldGaugeSprite.visible = false;
            this._shieldValueSprite.visible = false;
        }
    };

    const _Sprite_Battler_destroy = Sprite_Battler.prototype.destroy;
    Sprite_Battler.prototype.destroy = function() {
        if (this._shieldGaugeSprite) {
            this.removeChild(this._shieldGaugeSprite);
            this._shieldGaugeSprite = null;
        }
        if (this._shieldValueSprite) {
            this.removeChild(this._shieldValueSprite);
            this._shieldValueSprite = null;
        }
        this._shieldGaugeCreated = false;
        _Sprite_Battler_destroy.call(this);
    };

})();



//=============================================================================
// BattleManager
//=============================================================================

// BattleManager.endBattle - 修正版（戦闘終了時にアクター全員のシールドを0に）
const _BattleManager_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    // 戦闘終了時にアクター全員のシールド値を0に初期化
    $gameParty.allMembers().forEach(actor => {
        if (actor) {
            actor.setShield(0);
        }
    });
    
    _BattleManager_endBattle.call(this, result);
};


/*:
 * @target MZ
 * @plugindesc Shield System v1.0.2
 * @author Claude
 * @version 1.0.2
 * @description シールドシステムを実装するプラグイン
 *
 * @param Default Shield Max
 * @text デフォルトシールド最大値
 * @desc シールドの初期最大値（ダメージ計算式と同じ形式）
 * @type string
 * @default a.mhp
 *
 * @param Shield Gauge Color
 * @text シールドゲージ色
 * @desc シールドゲージの色
 * @type string
 * @default #1e90ff
 *
 * @param Shield Popup Color
 * @text シールドポップアップ色
 * @desc シールドダメージポップアップの色
 * @type string
 * @default #1e90ff
 *
 * @command setShield
 * @text シールド設定
 * @desc アクターのシールド値を設定
 *
 * @arg actorId
 * @text アクターID
 * @type actor
 * @default 1
 *
 * @arg formula
 * @text 計算式
 * @desc ダメージ計算式と同じ形式
 * @type string
 * @default 100
 *
 * @command addShield
 * @text シールド加算
 * @desc アクターのシールド値を加算
 *
 * @arg actorId
 * @text アクターID
 * @type actor
 * @default 1
 *
 * @arg formula
 * @text 計算式
 * @desc ダメージ計算式と同じ形式
 * @type string
 * @default 50
 *
 * @command reduceShield
 * @text シールド減算
 * @desc アクターのシールド値を減算
 *
 * @arg actorId
 * @text アクターID
 * @type actor
 * @default 1
 *
 * @arg formula
 * @text 計算式
 * @desc ダメージ計算式と同じ形式
 * @type string
 * @default 25
 *
 * @command getShield
 * @text シールド取得
 * @desc アクターのシールド値を変数に格納
 *
 * @arg actorId
 * @text アクターID
 * @type actor
 * @default 1
 *
 * @arg variableId
 * @text 変数ID
 * @type variable
 * @default 1
 *
 * @help ShieldSystem.js
 * 
 * ■概要
 * シールドシステムを実装するプラグインです。
 * 
 * ■バージョン履歴
 * v1.0.2 - シールド効果の重複実行を修正
 * v1.0.1 - 初期リリース
 * 
 * ■使用方法
 * 
 * 1. スキル・アイテムのメモ欄に以下を記述：
 *    <SetShield: a.atk>            - シールド値を設定
 *    <AddShield: 100>              - シールド値を加算
 *    <ReduceShield: 50>            - シールド値を減算
 *    <ShieldNonPenetration: true>  - 非貫通シールドに設定
 * 
 * 2. アクター・職業・ステートのメモ欄に以下を記述：
 *    <ShieldMax: a.mhp>            - シールド最大値を設定
 *    <ShieldMaxAdd: 100>           - シールド最大値を加算（ステートのみ）
 *    <ShieldMaxSub: 50>            - シールド最大値を減算（ステートのみ）
 * 
 * 3. スキル・アイテムの特殊効果：
 *    <ShieldOnly>                  - シールドのみ削る攻撃
 *    <ShieldPowerRate: 150>        - シールド持ちに威力変更（150%）
 *    <ShieldAbsorb: 20>            - 与ダメージの20%を自分のシールドに
 * 
 * ■優先順位
 * シールド最大値: ステート＞職業＞アクター＞プラグイン設定
 * 
 * ■シールドの種類
 * デフォルト: 貫通シールド（シールド値を超えるダメージはHPに通る）
 * 非貫通シールド: <ShieldNonPenetration: true>で設定
 *                （シールド値を超えるダメージでもHPに通らない）
 * 
 * ■デフォルトシールド最大値
 * プラグインパラメータの「デフォルトシールド最大値」では、
 * ダメージ計算式と同じ形式で設定できます：
 * 
 * 例：
 * a.mhp              - アクターの最大HP
 * a.atk * 2          - アクターの攻撃力×2
 * a.def + 50         - アクターの防御力＋50
 * a.level * 10       - アクターのレベル×10
 * 200                - 固定値200
 * v[1]               - 変数1の値
 * a.mhp + a.level*5  - 最大HP＋レベル×5
 * 
 * ■サイドビュー表示
 * サイドビューモードでキャラクターの上にシールドゲージと数値を表示
 * 
 * ■プラグインコマンド
 * シールドの設定・加算・減算・取得が可能
 * 
 * ■ダメージ計算式について
 * a: 使用者, b: 対象, v: 変数, s: スイッチ
 * 例: a.atk * 2, b.def + 50, v[1] * 3
 * 
 * ■修正内容（v1.0.2）
 * - シールド効果の重複実行を修正
 * - Game_Action.prototype.applyでシールド効果を統一処理
 * - Game_Battler.prototype.useItemからシールド効果処理を削除
 */