/*:
 * @target MZ
 * @plugindesc バリア機能拡張：吸収・貫通・上限・係数・上書き対応＋サイドビュー表示（#1e90ff）
 * @author Copilot
 * @version 1.0.1
 *
 * @param DefaultBarrierLimit
 * @text デフォルトのバリア上限式
 * @type string
 * @default a.mhp
 * @desc ステート／職業／アクターに BarrierLimit がない場合に使われる式（a = 対象）
 *
 * @command SetBarrier
 * @text バリア値設定
 * @desc 指定した対象のバリア値を設定します
 *
 * @arg battlerType
 * @text 対象タイプ
 * @type select
 * @option アクター
 * @value actor
 * @option エネミー
 * @value enemy
 * @default actor
 * @desc 設定する対象のタイプを選択
 *
 * @arg battlerId
 * @text 対象ID
 * @type number
 * @min 1
 * @default 1
 * @desc 設定する対象のID（アクターIDまたはエネミーの番号）
 *
 * @arg value
 * @text バリア値
 * @type number
 * @min 0
 * @default 100
 * @desc 設定するバリア値
 *
 * @arg pierce
 * @text 貫通設定
 * @type boolean
 * @default false
 * @desc バリアの貫通設定（true=貫通、false=非貫通）
 *
 * @command GetBarrier
 * @text バリア値取得
 * @desc 指定した対象のバリア値を変数に取得します
 *
 * @arg battlerType
 * @text 対象タイプ
 * @type select
 * @option アクター
 * @value actor
 * @option エネミー
 * @value enemy
 * @default actor
 * @desc 取得する対象のタイプを選択
 *
 * @arg battlerId
 * @text 対象ID
 * @type number
 * @min 1
 * @default 1
 * @desc 取得する対象のID（アクターIDまたはエネミーの番号）
 *
 * @arg varId
 * @text 変数ID
 * @type variable
 * @default 1
 * @desc バリア値を格納する変数ID
 *
 * @command ShowBarrier
 * @text バリア値表示
 * @desc 指定した対象のバリア値をメッセージで表示します
 *
 * @arg battlerType
 * @text 対象タイプ
 * @type select
 * @option アクター
 * @value actor
 * @option エネミー
 * @value enemy
 * @default actor
 * @desc 表示する対象のタイプを選択
 *
 * @arg battlerId
 * @text 対象ID
 * @type number
 * @min 1
 * @default 1
 * @desc 表示する対象のID（アクターIDまたはエネミーの番号）
 *
 * @command AddBarrier
 * @text バリア値加算
 * @desc 指定した対象のバリア値を加算します
 *
 * @arg battlerType
 * @text 対象タイプ
 * @type select
 * @option アクター
 * @value actor
 * @option エネミー
 * @value enemy
 * @default actor
 * @desc 加算する対象のタイプを選択
 *
 * @arg battlerId
 * @text 対象ID
 * @type number
 * @min 1
 * @default 1
 * @desc 加算する対象のID（アクターIDまたはエネミーの番号）
 *
 * @arg value
 * @text 加算値
 * @type number
 * @min 0
 * @default 50
 * @desc 加算するバリア値
 *
 * @arg pierce
 * @text 貫通設定
 * @type boolean
 * @default false
 * @desc バリアの貫通設定（true=貫通、false=非貫通）
 *
 * @help
 * ■ メモタグ一覧（スキル／アイテム）
 *
 * <BarrierFormula:式[,貫通]>
 *   → バリアを加算で付与（例：<BarrierFormula:Math.floor(a.mhp*0.5),false>）
 *
 * <BarrierFormulaSet:式[,貫通]>
 *   → バリアを上書きで付与（例：<BarrierFormulaSet:Math.floor(a.def*2),true>）
 *
 * <BarrierFromDamage:倍率[,貫通][,対象][,最大式]>
 *   → 与ダメージに応じてバリアを吸収（例：<BarrierFromDamage:1.0,true,all,a.def*2>）
 *
 * <AbsorbBarrier:true/false>
 *   → 相手のバリアを奪って自分に付与（例：<AbsorbBarrier:false>）
 *
 * <BarrierOnly>
 *   → バリアを持つ相手にしかダメージを与えない
 *
 * <BarrierDamageRate:1.5>
 *   → バリアを持つ相手にだけダメージ倍率をかける
 *
 * ■ メモタグ（アクター／職業／ステート）
 *
 * <BarrierLimit:式>
 *   → バリアの最大値を制限（例：<BarrierLimit:a.mhp * 0.5>）
 */

(() => {
  const PLUGIN_NAME = "BarrierFormula";
  const parameters = PluginManager.parameters(PLUGIN_NAME);
  const defaultBarrierLimit = parameters.DefaultBarrierLimit || "a.mhp";

  //==============================
  // Game_Battler: バリア管理
  //==============================
  const _init = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    _init.call(this);
    this._barrier = 0;
    this._barrierPierce = false;
  };
  Game_Battler.prototype.barrier = function() {
    return this._barrier || 0;
  };
  Game_Battler.prototype.barrierPierce = function() {
    return !!this._barrierPierce;
  };
  Game_Battler.prototype.maxBarrier = function() {
    const a = this;
    const sources = [...this.states(), this.currentClass?.(), this.actor?.()];
    for (const obj of sources) {
      if (obj?.meta?.BarrierLimit) {
        try {
          return Math.floor(eval(obj.meta.BarrierLimit));
        } catch (e) {
          console.error("BarrierLimit eval error", e);
        }
      }
    }
    try {
      return Math.floor(eval(defaultBarrierLimit));
    } catch (e) {
      console.error("DefaultBarrierLimit eval error", e);
      return Infinity;
    }
  };
  Game_Battler.prototype.setBarrier = function(value, pierce = false) {
    const newVal = Math.min(Math.max(0, value), this.maxBarrier());
    const wasZero = this._barrier <= 0;
    this._barrier = newVal;
    if (newVal <= 0) {
      this._barrierPierce = false;
    } else if (wasZero) {
      this._barrierPierce = pierce;
    }
  };
  Game_Battler.prototype.gainBarrier = function(value, pierce = false) {
    const total = this.barrier() + value;
    this.setBarrier(total, pierce);
  };

  //==============================
  // Game_Action: バリア処理
  //==============================
  const _makeDamageValue = Game_Action.prototype.makeDamageValue;
  Game_Action.prototype.makeDamageValue = function(target, critical) {
    let value = _makeDamageValue.call(this, target, critical);
    const rate = parseFloat(this.item().meta.BarrierDamageRate);
    if (rate && target.barrier() > 0) {
      value = Math.floor(value * rate);
    }
    return value;
  };

  const _apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function(target) {
    const item = this.item();
    const result = target.result();
    result._barrierDamage = 0;

    // BarrierOnly
    if (item.meta.BarrierOnly) {
      const damage = this.makeDamageValue(target, false);
      const br = target.barrier();
      const pierce = target.barrierPierce();
      if (br > 0) {
        const absorb = Math.min(damage, br);
        target.setBarrier(br - absorb, pierce);
        result.hpDamage = absorb;
        result._barrierDamage = absorb;
        target.startDamagePopup();
      } else {
        result.hpDamage = 0;
      }
      this.applyBarrierFormula?.(target);
      return;
    }

    _apply.call(this, target);

    // BarrierFromDamage
    if (item.meta.BarrierFromDamage) {
      const parts = item.meta.BarrierFromDamage.split(",");
      const ratio = parseFloat(parts[0]);
      const pierce = parts[1]?.trim() !== "false";
      const mode = parts[2]?.trim() || "all";
      const maxFormula = parts[3]?.trim();
      const a = this.subject();
      const b = target;
      const hp = target.result().hpDamage || 0;
      const bd = target.result()._barrierDamage || 0;
      let absorb = 0;
      if (mode === "all") absorb = hp + bd;
      else if (mode === "hp") absorb = hp;
      else if (mode === "barrier") absorb = bd;
      absorb = Math.floor(absorb * ratio);
      if (maxFormula) {
        try {
          const max = Math.floor(eval(maxFormula));
          absorb = Math.min(absorb, max);
        } catch (e) {
          console.error("BarrierFromDamage maxFormula error", e);
        }
      }
      if (absorb > 0) a.gainBarrier(absorb, pierce);
    }

    // AbsorbBarrier
    if (item.meta.AbsorbBarrier !== undefined) {
      const pierce = item.meta.AbsorbBarrier.trim() !== "false";
      const value = target.barrier();
      if (value > 0) {
        target.setBarrier(0);
        this.subject().gainBarrier(value, pierce);
      }
    }

    this.applyBarrierFormula?.(target);
  };

  Game_Action.prototype.applyBarrierFormula = function(target) {
    const item = this.item();
    const tagSet = item.meta.BarrierFormulaSet;
    const tagAdd = item.meta.BarrierFormula;
    const a = this.subject();
    const b = target;

    if (tagSet) {
      const parts = tagSet.split(",");
      const formula = parts[0]?.trim();
      const pierce = parts[1]?.trim() !== "false";
      try {
        const val = Math.floor(eval(formula));
        if (val > 0) target.setBarrier(val, pierce);
      } catch (e) {
        console.error("BarrierFormulaSet eval error", e);
      }
    } else if (tagAdd) {
      const parts = tagAdd.split(",");
      const formula = parts[0]?.trim();
      const pierce = parts[1]?.trim() !== "false";
      try {
        const val = Math.floor(eval(formula));
        if (val > 0) target.gainBarrier(val, pierce);
      } catch (e) {
        console.error("BarrierFormula eval error", e);
      }
    }
  };

  //==============================
  // Game_Battler: バリア処理
  //==============================
  const _gainHp = Game_Battler.prototype.gainHp;
  Game_Battler.prototype.gainHp = function(value) {
    const result = this.result();
    
    // ダメージ処理（負の値）でバリアがある場合
    if (value < 0 && this.barrier() > 0) {
      const damage = -value;
      const br = this.barrier();
      const pierce = this.barrierPierce();
      let hpLoss = 0;
      let barrierLoss = 0;

      if (br >= damage) {
        // バリアで完全に防げる場合
        barrierLoss = damage;
        this.setBarrier(br - damage, pierce);
        hpLoss = 0;
      } else {
        // バリアを突破する場合
        barrierLoss = br;
        hpLoss = damage - br;
        this.setBarrier(0);
      }

      // 結果を設定
      result._barrierDamage = barrierLoss;
      
      // 貫通の場合は実際のHPダメージを適用
      if (pierce && hpLoss > 0) {
        _gainHp.call(this, -hpLoss);
      }

      // バリアダメージポップアップを表示
      if (barrierLoss > 0) {
        this.startBarrierDamagePopup(barrierLoss);
      }
      
      return;
    }

    // 通常の処理
    _gainHp.call(this, value);
  };

  // バリアダメージポップアップ用メソッド
  Game_Battler.prototype.startBarrierDamagePopup = function(value) {
    if ($gameSystem.isSideView()) {
      if (this.shouldPopupDamage()) {
        this.setupBarrierDamagePopup(value);
      }
    }
  };

  Game_Battler.prototype.setupBarrierDamagePopup = function(value) {
    if (this._damages.length >= 4) return;
    
    const sprite = new Sprite_Damage();
    sprite.x = this.spritePosX();
    sprite.y = this.spritePosY();
    sprite.setupBarrierDamage(value);
    this._damages.push(sprite);
    
    if (this._battlerContainer) {
      this._battlerContainer.addChild(sprite);
    }
  };

  // スプライト位置取得メソッド
  Game_Battler.prototype.spritePosX = function() {
    return 0;
  };

  Game_Battler.prototype.spritePosY = function() {
    return 0;
  };

  // アクター用のスプライト位置
  Game_Actor.prototype.spritePosX = function() {
    const sprite = this.getSprite();
    return sprite ? sprite.x : 0;
  };

  Game_Actor.prototype.spritePosY = function() {
    const sprite = this.getSprite();
    return sprite ? sprite.y : 0;
  };

  Game_Actor.prototype.getSprite = function() {
    if ($gameSystem.isSideView() && BattleManager._spriteset) {
      return BattleManager._spriteset._actorSprites.find(sprite => sprite._battler === this);
    }
    return null;
  };

  // 敵用のスプライト位置
  Game_Enemy.prototype.spritePosX = function() {
    const sprite = this.getSprite();
    return sprite ? sprite.x : 0;
  };

  Game_Enemy.prototype.spritePosY = function() {
    const sprite = this.getSprite();
    return sprite ? sprite.y : 0;
  };

  Game_Enemy.prototype.getSprite = function() {
    if (BattleManager._spriteset) {
      return BattleManager._spriteset._enemySprites.find(sprite => sprite._battler === this);
    }
    return null;
  };

  //==============================
  // Sprite_Damage: バリアダメージ表示
  //==============================
  const _setupDamage = Sprite_Damage.prototype.setup;
  Sprite_Damage.prototype.setup = function(target) {
    _setupDamage.call(this, target);
  };

  Sprite_Damage.prototype.setupBarrierDamage = function(value) {
    const result = { barrierDamage: value };
    this._duration = 120;
    this._flashColor = [255, 255, 255, 160];
    this._flashDuration = 10;
    this._damageBitmap = this.createBarrierDamageBitmap(value);
    this.bitmap = this._damageBitmap;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.x = this.x + this.damageOffsetX();
    this.y = this.y + this.damageOffsetY();
    this.setupAnimation();
  };

  Sprite_Damage.prototype.createBarrierDamageBitmap = function(value) {
    // 固定値を使用してdigitWidthとdigitHeightの問題を回避
    const digitWidth = 28;
    const digitHeight = 32;
    const w = digitWidth * Math.max(value.toString().length, 3);
    const h = digitHeight;
    const bitmap = new Bitmap(w, h);
    bitmap.fontFace = this.fontFace();
    bitmap.fontSize = this.fontSize();
    bitmap.textColor = "#00BFFF"; // 水色
    bitmap.strokeColor = "#000000";
    bitmap.strokeWidth = 4;
    bitmap.drawText(value.toString(), 0, 0, w, h, "center");
    return bitmap;
  };

  // 必要なメソッドが存在しない場合のフォールバック
  Sprite_Damage.prototype.fontFace = function() {
    return $dataSystem.advanced.fallbackFonts || "sans-serif";
  };

  Sprite_Damage.prototype.fontSize = function() {
    return 28;
  };

  Sprite_Damage.prototype.damageOffsetX = function() {
    return 0;
  };

  Sprite_Damage.prototype.damageOffsetY = function() {
    return 0;
  };

  Sprite_Damage.prototype.setupAnimation = function() {
    this._wholeDuration = 120;
    this._duration = 120;
    this.dy = 0;
  };

  const _updateSpriteDamage = Sprite_Damage.prototype.update;
  Sprite_Damage.prototype.update = function() {
    if (_updateSpriteDamage) {
      _updateSpriteDamage.call(this);
    } else {
      Sprite.prototype.update.call(this);
      if (this._duration > 0) {
        this._duration--;
        if (this._duration <= 0) {
          this.visible = false;
        }
        this.dy -= 1;
        this.y += this.dy;
        if (this._flashDuration > 0) {
          this._flashDuration--;
          this.setBlendColor(this._flashColor);
        } else {
          this.setBlendColor([0, 0, 0, 0]);
        }
      }
    }
  };

  Sprite_Damage.prototype.isPlaying = function() {
    return this._duration <= 0;
  };

  //==============================
  // Game_Battler: ダメージ管理拡張
  //==============================
  const _initMembers = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    _initMembers.call(this);
    this._damages = [];
  };

  const _updateDamagePopup = Game_Battler.prototype.updateDamagePopup;
  Game_Battler.prototype.updateDamagePopup = function() {
    if (_updateDamagePopup) {
      _updateDamagePopup.call(this);
    }
    this.setupDamagePopup();
    if (this._damages.length > 0) {
      for (let i = this._damages.length - 1; i >= 0; i--) {
        this._damages[i].update();
        if (this._damages[i].isPlaying()) {
          this._damages.splice(i, 1);
        }
      }
    }
  };

  Game_Battler.prototype.setupDamagePopup = function() {
    if (this._damages.length >= 4) return;
    
    const result = this.result();
    if (result._barrierDamage > 0) {
      this.createBarrierDamageSprite(result._barrierDamage);
      result._barrierDamage = 0;
    }
  };

  Game_Battler.prototype.createBarrierDamageSprite = function(value) {
    const sprite = new Sprite_Damage();
    sprite.setupBarrierDamage(value);
    this._damages.push(sprite);
    
    // スプライトセットに追加
    if (BattleManager._spriteset) {
      if (this.isActor()) {
        const battlerSprite = BattleManager._spriteset._actorSprites.find(s => s._battler === this);
        if (battlerSprite) {
          battlerSprite.parent.addChild(sprite);
          sprite.x = battlerSprite.x;
          sprite.y = battlerSprite.y;
        }
      } else {
        const battlerSprite = BattleManager._spriteset._enemySprites.find(s => s._battler === this);
        if (battlerSprite) {
          battlerSprite.parent.addChild(sprite);
          sprite.x = battlerSprite.x;
          sprite.y = battlerSprite.y;
        }
      }
    }
  };

  const _updateMain = Sprite_Battler.prototype.updateMain;
  Sprite_Battler.prototype.updateMain = function() {
    _updateMain.call(this);
    this._updateBarrierSprite();
  };

  Sprite_Battler.prototype._updateBarrierSprite = function() {
    const battler = this._battler;
    if (!battler || battler.barrier() <= 0 || battler.mhp <= 0) {
      if (this._barrierSprite) this._barrierSprite.visible = false;
      return;
    }

    const gaugeW = 40;
    const gaugeH = 6;
    const textH = 14;
    const rate = battler.barrier() / battler.mhp;

    if (!this._barrierSprite) {
      const bmp = new Bitmap(gaugeW, gaugeH + textH);
      this._barrierSprite = new Sprite(bmp);
      this._barrierSprite.anchor.set(0.5, 1.0);
      this.addChild(this._barrierSprite);
    }

    const sprite = this._barrierSprite;
    const bmp = sprite.bitmap;
    bmp.clear();

    bmp.fillRect(0, 0, gaugeW, gaugeH, "#000000");
    bmp.fillRect(0, 0, Math.floor(gaugeW * rate), gaugeH, "#1e90ff");
    bmp.fontSize = textH;
    bmp.textColor = "#ffffff";
    bmp.drawText(battler.barrier().toString(), 0, gaugeH, gaugeW, textH, 'center');

    sprite.x = this.width / 2;
    sprite.y = -this.height / 2 - 4;
    sprite.visible = true;
  };

  //==============================
  // プラグインコマンド
  //==============================
  function getBattler(type, id) {
    if (type === "actor") {
      return $gameActors.actor(id);
    } else if (type === "enemy") {
      if ($gameTroop && $gameTroop.members()) {
        return $gameTroop.members()[id - 1];
      }
    }
    return null;
  }

  // バリア値設定
  PluginManager.registerCommand(PLUGIN_NAME, "SetBarrier", args => {
    const battler = getBattler(args.battlerType, parseInt(args.battlerId));
    if (battler) {
      const value = parseInt(args.value);
      const pierce = args.pierce === "true";
      battler.setBarrier(value, pierce);
      console.log(`${battler.name()} のバリアを ${value} に設定しました（貫通: ${pierce}）`);
    } else {
      console.warn("対象のバトラーが見つかりません");
    }
  });

  // バリア値取得
  PluginManager.registerCommand(PLUGIN_NAME, "GetBarrier", args => {
    const battler = getBattler(args.battlerType, parseInt(args.battlerId));
    const varId = parseInt(args.varId);
    if (battler && varId > 0) {
      const barrierValue = battler.barrier();
      $gameVariables.setValue(varId, barrierValue);
      console.log(`${battler.name()} のバリア値 ${barrierValue} を変数${varId}に格納しました`);
    } else {
      console.warn("対象のバトラーまたは変数IDが無効です");
    }
  });

  // バリア値表示
  PluginManager.registerCommand(PLUGIN_NAME, "ShowBarrier", args => {
    const battler = getBattler(args.battlerType, parseInt(args.battlerId));
    if (battler) {
      const name = battler.name();
      const value = battler.barrier();
      const pierce = battler.barrierPierce();
      const pierceText = pierce ? "（貫通）" : "";
      $gameMessage.add(`${name} のバリア耐久値：${value}${pierceText}`);
    } else {
      $gameMessage.add("対象が見つかりません");
    }
  });

  // バリア値加算
  PluginManager.registerCommand(PLUGIN_NAME, "AddBarrier", args => {
    const battler = getBattler(args.battlerType, parseInt(args.battlerId));
    if (battler) {
      const value = parseInt(args.value);
      const pierce = args.pierce === "true";
      battler.gainBarrier(value, pierce);
      console.log(`${battler.name()} のバリアに ${value} を加算しました（貫通: ${pierce}）`);
    } else {
      console.warn("対象のバトラーが見つかりません");
    }
  });

  console.log("BarrierFormula plugin loaded");
})();