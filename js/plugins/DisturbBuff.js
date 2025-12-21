//=============================================================================
// Plugin for RPG Maker MZ
// DisturbBuff.js
//=============================================================================
// [Update History]
// 2021.May.22 Ver1.0.0 First Release
// 2021.May.23 Ver1.0.1 BugFix: When set rate again, old rates were remain.

/*:
 * @target MZ
 * @plugindesc [Ver1.0.1]Enables to change buff success rate
 * @author Sasuke KANNAZUKI
 *
 * @command buffRate
 * @text Set Buff Rate
 * @desc Set Buff Success Percentage(default=100)
 *
 * @arg targetType
 * @text Target Type
 * @desc Target to Change Rate. Select from State, Equipment or Battler
 * @type select
 * @option State
 * @value state
 * @option Weapon
 * @value weapon
 * @option Armor
 * @value armor
 * @option Actor
 * @value actor
 * @option Enemy
 * @value enemy
 * @default state
 *
 * @arg targetState
 * @parent targetType
 * @text Target State ID
 * @desc Set only if you select State.
 * @type state
 * @min 0
 * @default 0
 *
 * @arg targetWeapon
 * @parent targetType
 * @text Target Weapon ID
 * @desc Set only if you select Weapon.
 * @type weapon
 * @min 0
 * @default 0
 *
 * @arg targetArmor
 * @parent targetType
 * @text Target Armor ID
 * @desc Set only if you select Armor.
 * @type armor
 * @min 0
 * @default 0
 *
 * @arg targetActor
 * @parent targetType
 * @text Target Actor ID
 * @desc Set only if you select Actor.
 * @type actor
 * @min 0
 * @default 0
 *
 * @arg targetEnemy
 * @parent targetType
 * @text Target Enemy ID
 * @desc Set only if you select Enemy.
 * @type enemy
 * @min 0
 * @default 0
 *
 * @arg param
 * @text Parameter
 * @desc Parameter to change buff rate
 * @type select
 * @option Max HP(0)
 * @value 0
 * @option Max MP(1)
 * @value 1
 * @option Attack(2)
 * @value 2
 * @option Defense(3)
 * @value 3
 * @option M.Attack(4)
 * @value 4
 * @option M.Defence(5)
 * @value 5
 * @option Agility(6)
 * @value 6
 * @option Luck(7)
 * @value 7
 * @option All of Above
 * @value all
 * @option All but Max HpMp
 * @value allButHpMp
 * @default all
 *
 * @arg rate
 * @text Percentage
 * @desc Set buff success rate at percentage
 * @type number
 * @min 0
 * @default 100
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 * This plugin enables Set Buff Rate like Debuff Rate.
 * Generally, buff rate is always 100%, and this plugin
 * change the rate.
 *
 * [Summary]
 * Call Plugin Command to set buff success rate.
 * You can set the rate at state, equipment or battler.
 * If you set plural setting(ex. weapon and state),
 * The rate will be multiplied.
 *
 * [Example Usage]
 * - An enemy disturb actor's buff.
 * - Disturb enemy's buff by making such state and casts the enemy.
 * - Make very strong weapon but as side effect, buff become invalid
 *  during equipping the weapon.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

 /*:ja
 * @target MZ
 * @plugindesc [Ver1.0.1]強化有効度の設定
 *
 * @command buffRate
 * @text 強化有効度の設定
 * @desc 強化の成功率を設定します。
 *
 * @arg targetType
 * @text 対象タイプ
 * @desc ステート、装備、バトラーのいずれかを設定します
 * @type select
 * @option ステート
 * @value state
 * @option 武器
 * @value weapon
 * @option 防具
 * @value armor
 * @option アクター
 * @value actor
 * @option 敵キャラ
 * @value enemy
 * @default state
 *
 * @arg targetState
 * @parent targetType
 * @text 対象ステートID
 * @desc ステート以外を選択した場合無視されます。
 * @type state
 * @min 0
 * @default 0
 *
 * @arg targetWeapon
 * @parent targetType
 * @text 対象武器ID
 * @desc 武器以外を選択した場合無視されます。
 * @type weapon
 * @min 0
 * @default 0
 *
 * @arg targetArmor
 * @parent targetType
 * @text 対象防具ID
 * @desc 防具以外を選択した場合無視されます。
 * @type armor
 * @min 0
 * @default 0
 *
 * @arg targetActor
 * @parent targetType
 * @text 対象アクターID
 * @desc アクター以外を選択した場合無視されます。
 * @type actor
 * @min 0
 * @default 0
 *
 * @arg targetEnemy
 * @parent targetType
 * @text 対象敵キャラID
 * @desc 敵キャラ以外を選択した場合無視されます。
 * @type enemy
 * @min 0
 * @default 0
 *
 * @arg param
 * @text パラメータ
 * @desc 強化有効度％を変更するパラメータです
 * @type select
 * @option 最大HP(0)
 * @value 0
 * @option 最大MP(1)
 * @value 1
 * @option 攻撃力(2)
 * @value 2
 * @option 防御力(3)
 * @value 3
 * @option 魔法力(4)
 * @value 4
 * @option 魔法防御(5)
 * @value 5
 * @option 敏捷性(6)
 * @value 6
 * @option 運(7)
 * @value 7
 * @option 上記全て一括
 * @value all
 * @option 最大HPMP除く全て
 * @value allButHpMp
 * @default all
 *
 * @arg rate
 * @text 変更倍率％
 * @desc 強化有効度の値を％で設定します
 * @type number
 * @min 0
 * @default 100
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、弱体有効度のように、強化有効度を設定可能にします。
 * (強化有効度は、通常は常に100％です)
 *
 * ■概要
 * このプラグインでは、プラグインコマンドで以下のことが可能です。
 * - ステート、装備またはアクター、敵キャラの強化有効度のセット
 *   重複してセットすると、それだけ掛け合わせた値になります。
 * - ステートや装備は、対象のバトラーがその状態、装備中のみ有効です。
 *
 * ■活用例
 * - 敵キャラがパーティーの強化有効度を0にして強化を妨害
 * - 敵キャラに強化有効度を0にするステートをかけて強化を妨害
 * - 強力だが装備中は強化が無効になる副作用を持つ装備の作成
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'DisturbBuff';

  // NOTE: 103 is a magic number that doesn't mean anything.
  // if this value conflicts another plugin, change another value.
  Game_BattlerBase.TRAIT_BUFF_RATE = 103;

  //
  // define buff rate
  //
  Game_BattlerBase.prototype.buffRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_BUFF_RATE, paramId);
  };

  const _Game_Action_itemEffectAddBuff =
    Game_Action.prototype.itemEffectAddBuff;
  Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
    let chance = target.buffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
      _Game_Action_itemEffectAddBuff.call(this, target, effect);
    }
  };

  //
  // proces plugin command
  //
  const setToTrait = (target, param, rate) => {
    const code = Game_BattlerBase.TRAIT_BUFF_RATE;
    target.traits = deleteOldTrait(code, target.traits, +param);
    target.traits.push({code:code, dataId:+param, value:+rate / 100.0});
  };

  const deleteOldTrait = (code, traits, param) => {
    return traits.filter(t => t.code !== code || t.dataId !== param);
  };

  const addBuffRate = (target, args) => {
    if (target) {
      switch (args.param) {
      case 'all':
        for (let i = 0; i <= 7; i++) {
          setToTrait(target, i, args.rate);
        }
        break;
      case 'allButHpMp':
        for (let i = 2; i <= 7; i++) {
          setToTrait(target, i, args.rate);
        }
        break;
      default: // (text 0to7)
        setToTrait(target, args.param, args.rate);
      }
    }
  };

  const getTargetForBuffRate = args => {
    let target;
    switch (args.targetType) {
    case 'state':
      target = $dataStates[+args.targetState];
      break;
    case 'weapon':
      target = $dataWeapons[+args.targetWeapon];
      break;
    case 'armor':
      target = $dataArmors[+args.targetArmor];
      break;
    case 'actor':
      target = $dataActors[+args.targetActor];
      break;
    case 'enemy':
     target = $dataEnemies[+args.targetEnemy];
      break;
    }
    return target;
  };

  PluginManager.registerCommand(pluginName, 'buffRate', args => {
    const target = getTargetForBuffRate(args);
    addBuffRate(target, args);
    $gameSystem.memorizeBuffRate(args);
  });

  //
  // Memorize added traits, and process it when it's load the game.
  //
  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
    this.buffRates = null;
  };

  Game_System.prototype.memorizeBuffRate = function(args) {
    this.buffRates = this.buffRates || [];
    this.buffRates.push(args);
  };

  _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    this.resumeBuffRates(this.buffRates);
    _Game_System_onAfterLoad.call(this);
  };

  Game_System.prototype.resumeBuffRates = function(buffRates) {
    if (buffRates) {
      for (args of buffRates) {
        const target = getTargetForBuffRate(args);
        addBuffRate(target, args);
      }
    }
  };

})();
