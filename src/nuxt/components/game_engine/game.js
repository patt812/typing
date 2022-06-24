import Statistics from './statistics.js';
import Judge from './judge.js';
import Sentence from './sentence.js';
import Result from './result.js';
/**
 * ゲームをコントロールするクラスです。
 * 文章の取得、入力判定、ゲームの開始、終了などの処理を行います。
 * ゲームに関する全てのモジュールはここに集約されます。
 * @export Game
 * @constructor
 * @class Game
 */
export default class Game {
  /**
  * Gameインスタンスを作成します。
  * @param {number} [countdown=0]
  * @memberof Game
  */
  constructor(countdown = 0) {
    /**
     * メッセージの初期値を格納します。
     * @type {boolean}
     */
    this.DEFAULT_GAME_DIALOG = "スペースキーを押してスタート";
    /**
     * ゲームがプレイ可能な状態かを記録します。
     * @type {boolean}
     */
    this.isPlayable = false;
    /**
     * ゲームが開始されたかを記録します。
     * @type {boolean}
     */
    this.isStarted = false;
    /**
     * ゲームを何回開始したかを記録します。
     * @type {number}
     */
    this.played = 0;
    /**
     * カウントダウンの秒数を指定します。
     * @type {number}
     */
    this.countdownSec = countdown;
    /**
     * 画面に表示するメッセージを格納します。
     * @type {string|number}
     */
    this.dialog = "";
    /**
     * 終了した文章の数を記録します。
     * @type {number}
     */
    this.sentencesDone = 1;
    /**
     * 文字列の判定を行うオブジェクトです。
     * @type {Judge}
     */
    this.judge = new Judge();
    /**
     * 文章、カナ、ローマ字を保存するオブジェクトです。
     * @type {Statistics}
     */
    this.sentence = new Sentence();
    /**
     * 統計を記録するオブジェクトです。
     * @type {Statistics}
     */
    this.statistics = new Statistics();
    /**
     * ゲーム結果を記録するオブジェクトです。
     * @type {Result}
     */
    this.result = new Result();
  }

  /**
   * 文章を出題数分データベースから呼び出し、入力パターンを格納します。
   * 無制限出題の場合は100文章読み込まれます。
   * @async
   * @memberof Game
   */
  async prepare(data) {
    // getdataは不要になる。ここでPushやればOK
    // もしくはSetData.
    while (data.length) {
      const datum = data.shift();
      this.sentence.kanasDisplay.push(datum.kana);
      this.sentence.sentences.push(datum.sentence);
      this.sentence.ids.push(datum.id);
    }
    // await this.getData();
    await this.sentence.setRomas();
    this.isPlayable = true;
  }

  /**
   * 文字列の判定を行い、判定結果に基づいて統計を更新します。
   * @param {string} input 入力された文字列を受け取ります。
   * @memberof Game
   */
  performJudge(input) {
    this.judge.do(input, this.sentence.romas[0]);
    this.statistics.afterJudge(this.judge.isCorrect);
  }

  /**
   * ゲームを開始します。
   * 最初の文章の出題数のカウントが追加され、時間の計測を開始します。
   * @memberof Game
   */
  async start(event) {
    if (event.code === "Space" && !this.game.isStarted && this.game.isPlayable) {
      if (this.game.countdownSec) {
        await this.game.countdown(this.game.countdownSec);
      }
      this.game.isStarted = true;
      if (!this.game.played) {
        document.addEventListener('keydown', {
          handleEvent: this.game.observe,
          game: this.game
        });
      }
      this.game.played++;
      // await countdown(window.parent.settings[1]);
      // await this.prepare();
      // this.result.encountereds[0]++;
      this.game.statistics.startTimer();
    }
  }

  observe(event) {
    if (!this.game.isStarted) return;
    if (event.key === "Escape") {
      this.game.reset();
      return;
    }
    this.game.performJudge(event.key);
    // document.getElementById('totalcorrect').textContent = game.statistics
    //   .calcAccuracy(game.statistics.totalCorrect, game.statistics.totalMistake);
    // document.getElementById('thiscorrect').textContent = game.statistics.accuracy;
    // document.getElementById('thiswpm').textContent = game.statistics.currentWPM;
    // document.getElementById('totalwpm').textContent =
    //   game.statistics.gettotalWPM();
    if (!this.game.judge.isCorrect) {
      // if (window.parent.settings[40]) {
      //   new Audio('../../assets/missbeep.mp3').play();
      // }
      return;
    }
    // if (window.parent.settings[39]) {
    //   new Audio('../../assets/keysound.mp3').play();
    // }
    if (this.game.sentence.sentences.length == this.game.sentence.current + 1 &&
      this.game.judge.goNext) {
      // game.updateResult();
      // new Dao().saveStats(game.result.querify());
      this.game.reset();

      // this.game.prepare();
      return;
    } else if (this.game.judge.goNext) {
      this.game.next();
      // if (window.parent.settings[4]) {
      //   game.fill();
      // }
      this.game.statistics.splitTimer();
      return;
    }

    this.game.sentence.displayRoma = this.game.sentence.joinRoma();
    // document.getElementById('correct').textContent =
    //   this.game.sentence.displayRoma.substring(0, game.statistics.correct);
    // document.getElementById('roma').textContent =
    //   this.game.sentence.displayRoma.substring(game.statistics.correct);

  }

  /**
   * ゲームを終了します。
   * 統計を更新し、結果をデータベースに記録します。
   * @memberof Game
   */
  quit() {
    this.updateResult(true);
    // new Dao().saveStats(this.result.querify());
  }

  reset() {
    this.dialog = "";
    this.isStarted = false;
    this.isPlayable = false;
    this.judge = new Judge();
    this.sentence = new Sentence();
    this.statistics = new Statistics();
    this.result = new Result();
  }

  /**
   * 現在の文章の統計を格納し、次の文章を呼び出します。
   * @memberof Game
   */
  next() {
    // this.updateResult();
    this.sentence.romas.shift();
    this.judge.goNext = false;
    this.sentencesDone++;
    this.sentence.current++;
    // const nextID = this.sentence.ids[this.sentence.current];
    // this.result.encountereds[this.result.ids.indexOf(nextID)]++;
    this.statistics.next();
    this.sentence.displayRoma = this.sentence.joinRoma();
  }

  /**
   * 文章の追加や保存を行います。
   * 出題数無制限の時のみに使用されます。
   * 10文章を入力時に10文章を保存、残り15文章で文章の追加、
   *     100文章を入力時に入力済みの100文章を配列から削除します。
   * @async
   * @memberof Game
   */
  async fill() {
    if (this.sentence.current % 10 == 0) {
      // new Dao().saveStats(this.result.querify());
    }
    if (this.sentence.sentences.length == 15) {
      await this.prepare();
    }
    if (this.sentence.current == 100) {
      this.sentence.ids.splice(0, 100);
      this.sentence.current = 0;
    }
  }

  /**
   * 入力した文章をゲーム結果として記録します。
   * ゲーム途中終了の場合は入力の統計を更新せず、出題回数のみを更新します。
   * 無制限出題で途中終了の場合は全ての統計を更新しません。
   * @param {boolean} [opt_escaped=false] ゲームを途中終了する場合はここにfalseを入力します。
   * @memberof Game
   */
  // eslint-disable-next-line require-jsdoc, camelcase
  updateResult(opt_escaped = false) {
    const currentID = this.sentence.ids[this.sentence.current];
    // 途中で中止した場合は更新を行わなずクエリ登録のみの処理とする
    // eslint-disable-next-line camelcase
    if (!opt_escaped) {
      this.result.update(
        currentID,
        this.statistics.missStreak,
        this.statistics.currentWPM,
        this.statistics.accuracy,
      );
      // 無制限モードの途中放棄は統計を更新せず出題回数の追加を取りやめる
      // eslint-disable-next-line camelcase
    } else if (opt_escaped && window.parent.settings[4]) {
      this.result.encountereds[this.result.ids.indexOf(currentID)]--;
    }
    this.result.waiting.add(currentID);
  }

  async countdown(sec) {
    for (let i = sec; i > 0; i--) {
      this.dialog = i;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  /**
   * 入力されたキーがゲーム開始用のキーであるかを判定します。
   * @param {string} input 入力されたキーです。スペースキーが期待されます。
   * @return {boolean} 判定結果を返します。
   * @memberof Game
   */
  isStartKeyInput(input) {
    const totalInputs = this.statistics.totalCorrect +
      this.statistics.totalMistake;
    return totalInputs == 0 && input == 'Space';
  }

  /**
   * DBから保存された文章と前回のゲーム結果を取得します。
   * @async
   * @memberof Game
   */
  async getData() {
    this.sentence.kanasDisplay = ['てすとぶんしょう', 'つぎのぶんしょう', 'てすとぶんしょう'];
    this.sentence.sentences = ['てすと文章', '次の文章', 'てすと文章'];
    // cnst data = await new Dao().getSentence();
    // for (const row of data) {
    //   this.sentence.kanasBase.push(row['KANA']);
    //   this.sentence.sentences.push(row['SENTENCE']);
    //   this.sentence.ids.push(row['ID']);

    //   if (this.result.ids.indexOf(row['ID']) != -1) continute;
    //   this.result.ids.push(row['ID']);
    //   this.result.avarages.push(row['AVARAGE']);
    //   this.result.maxes.push(row['MAX']);
    //   this.result.mins.push(row['MIN']);
    //   this.result.encountereds.push(row['ENCOUNTERED']);
    //   this.result.finisheds.push(row['FINISHED']);
    //   this.result.accuracies.push(row['ACCURACY']);
    //   this.result.perfects.push(row['PERFECT']);
    //   this.result.missStreaks.push(row['MISS_STREAK']);
    //   this.result.recent5WPMs.push(row['RECENT5_WPM']);
    //   this.result.recent5ACCs.push(row['RECENT5_ACC']);
    //   this.result.aveWpmMistakes.push(row['AVEWPM_MISTAKE']);
    //   this.result.aveWpmPerfects.push(row['AVEWPM_PERFECT']);
    // }
  }
}
