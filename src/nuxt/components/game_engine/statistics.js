/**
 * 文章の統計を計算や保持します。
 * @export Statistics
 * @constructor
 * @class Statistics
 */
export default class Statistics {
  /**
   * Statisticsインスタンスを作成します。
   * @memberof Statistics
   */
  constructor() {
    /**
     * 出題中の正答率を記録します。
     * @type {number}
     */
    this.accuracy = 0;
    /**
     * 出題中のWPMを記録します。
     * @type {number}
     */
    this.currentWPM = 0;
    /**
     * ゲームの総合経過時間を記録します。
     * @type {number}
     */
    this.time = 0;
    /**
     * 前回の文章入力完了時の時間を記録します。
     * @type {number}
     */
    this.previousTime = 0;
    /**
     * 出題中の文章が出題された時間を記録します。
     * @type {number}
     */
    this.thisStarttime = 0;
    /**
     * ゲームの経過時間を記録する処理を格納します。
     * @type {number}
     */
    this.gameTime;
    /**
     * 出題中の正答率を記録します。
     * @type {number}
     */
    this.correct = 0;
    /**
     * 出題されたすべての文章の正答数を記録します。
     * @type {number}
     */
    this.totalCorrect = 0;
    /**
     * 出題中の文章のミスタイプ数を記録します。
     * @type {number}
     */
    this.mistake = 0;
    /**
     * 出題されたすべての文章のミスタイプ数を記録します。
     * @type {number}
     */
    this.totalMistake = 0;
    /**
     * 出題中の文章の現在の連続ミス数を記録します。
     * @type {number}
     */
    this.missStreak = 0;
    /**
     * 出題中の文章の最大連続ミス数を記録します。
     * @type {number}
     */
    this.maxMissStreak = 0;
  }

  /**
   * 前の文章の正答数と誤答数を記録し、統計を初期化します。
   * @memberof Statistics
   */
  next() {
    this.missStreak = 0;
    this.PrevCorrect = this.correct;
    this.PrevMistake = this.mistake;
    this.mistake = 0;
    this.correct = 0;
    this.currentAccuracy = 0;
    this.accuracy = 0;
    this.currentWPM = 0;
  }

  /**
   * ゲーム時間の記録を開始します。
   * @param {string} documentID 更新先のhtmlタグIDです。
   *     更新されるタグはtextContentのプロパティを持つ必要があります。
   * @memberof Statistics
   */
  startTimer() {
    this.previousTime = performance.now();
    this.gameTime = setInterval(() => {
      this.time = ((performance.now() - this.previousTime) / 1000).toFixed(3);
      // document.getElementById(documentID).textContent = this.time;
    }, 50);
  }

  /**
   * 次の文章の開始時間のタイムスタンプを記録します。
   * @memberof Statistics
   */
  splitTimer() {
    this.thisStarttime = this.time;
  }

  /**
   * 総合WPMを記録します。
   * <br>総合WPM = 総合正答数 / (総合経過秒数 / 60) の式で評価されます。
   * @return {number} 総合WPMを返します。最大小数点第2位まで記録されますが、
   *     小数点以下最小位において0は省略されます。結果がInfinityである場合は
   *     最大WPMとして6000の定数を返します。
   * @memberof Statistics
   */
  gettotalWPM() {
    const result = this.totalCorrect / (this.time / 60);
    if (isNaN(result)) {
      console.error(`NaN: correct:${this.totalCorrect}
     time:${this.time - this.thisStarttime}`);
    }
    if (!isFinite(result)) return 6000;
    return Number(result.toFixed(2));
  }

  // WPM = 区間正答数 / (区間経過秒数 / 60)
  /**
   * 1文章間のWPMを記録します。
   * <br>区間WPM = 区間正答数 / (区間経過秒数 / 60) の式で評価されます。
   * @return {number} 区間WPMを返します。最大小数点第2位まで記録されますが、
   *     小数点以下最小位において0は省略されます。結果がInfinityである場合は
   *     最大WPMとして6000の定数を返します。
   * @memberof Statistics
   */
  getcurrentWPM() {
    const result = this.correct / ((this.time - this.thisStarttime) / 60);
    if (isNaN(result)) {
      console.error(`NaN: correct:${this.correct}
     time:${this.time - this.thisStarttime}`);
    }
    if (!isFinite(result)) return 6000;
    return Number(result.toFixed(2));
  }

  /**
   * 正答率を計算します。
   * <br>((正答数 - ミス) * 100) / 正答数 の式で評価されます。
   * @param {number} correct 正答数
   * @param {number} mistake 誤答数
   * @return {number} 正答率を返します。最大小数点第2位まで記録されますが、
   *     小数点以下最小位において0は省略されます。
   *     ミス数＞正答数の場合は定数0が返されます。
   * @memberof Statistics
   */
  calcAccuracy(correct, mistake) {
    if (correct === 0 || correct <= mistake) return 0;
    const accuracy = (((correct - mistake) * 100) / correct).toFixed(2);
    return Number(accuracy);
  }

  /**
   * 判定後の統計の更新を行います。
   * @param {boolean} isCorrect 判定が正答であったかを入力します。
   * @memberof Statistics
   */
  afterJudge(isCorrect) {
    if (isCorrect) {
      this.totalCorrect++;
      this.accuracy = this.calcAccuracy(++this.correct, this.mistake);
      this.currentWPM = this.getcurrentWPM(this.correct, this.mistake);
    } else {
      this.mistake++;
      this.totalMistake++;
      this.missStreak++;
      if (this.maxMissStreak < this.missStreak) {
        this.maxMissStreak = this.missStreak;
      }
    }
  }
}
