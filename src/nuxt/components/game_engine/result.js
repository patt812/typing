/**
 * 各文章の結果を格納するクラスです。
 * 出題された文章数の分だけ統計が作成され、再出題された文章は既にある配列に吸収されます。
 * @export Result
 * @constructor
 * @class Result
 */
export default class Result {
  /**
   * Resultインスタンスを作成します。
   * @memberof Result
   */
  constructor() {
    /**
     * 出題された文章のIDを格納します。
     * @type {array}
     */
    this.ids = [];
    /**
     * 出題された文章の平均WPMを格納します。
     * @type {array}
     */
    this.avarages = [];
    /**
     * 出題された文章の最高WPMを格納します。
     * @type {array}
     */
    this.maxes = [];
    /**
     * 出題された文章の最低WPMを格納します。
     * @type {array}
     */
    this.mins = [];
    /**
     * 出題された文章の出題回数を格納します。
     * @type {array}
     */
    this.encountereds = [];
    /**
     * 出題された文章の最後まで入力した回数を格納します。
     * @type {array}
     */
    this.finisheds = [];
    /**
     * 出題された文章の平均正答率を格納します。
     * @type {array}
     */
    this.accuracies = [];
    /**
     * 出題された文章のノーミス入力回数を格納します。
     * @type {array}
     */
    this.perfects = [];
    /**
     * 出題された文章の最大連続ミス数を格納します。
     * @type {array}
     */
    this.missStreaks = [];
    /**
     * 出題された文章の直近5回のWPMを格納します。
     * @type {array}
     */
    this.recent5WPMs = [];
    /**
     * 出題された文章の直近5回の正答率を格納します。
     * @type {array}
     */
    this.recent5ACCs = [];
    /**
     * 出題された文章のミスあるときの平均WPMを格納します。
     * @type {array}
     */
    this.aveWpmMistakes = [];
    /**
     * 出題された文章のノーミス時の平均WPMを格納します。
     * @type {array}
     */
    this.aveWpmPerfects = [];
    /**
     * クエリ出力待ちのIDを格納します。
     * @type {Set}
     */
    this.waiting = new Set();
  }

  /**
   * カンマ区切りの文章を左に新しく文字列を詰めます。
   * 最後のカンマ以降の文字列は削除されます。
   * @param {string} base 追加されていないカンマ区切りの文章
   * @param {string} concat 左に新しく詰める文章
   * @return {string} カンマ区切り追加済みの文章
   * @memberof Result
   */
  popComma(base, concat) {
    base = concat + ',' + base;
    return base.slice(0, base.lastIndexOf(','));
  }

  /**
   * 正答率の平均値を計算します。
   * 0の値が入力されている場合は母数から省略されます。
   * @param {string} val カンマ区切りの数字
   * @return {number} 平均値
   * @memberof Result
   */
  calcAverage(val) {
    val = val.split(',');
    const divisor = val.length - val.filter((item) => item === '0').length;
    return val.reduce((sum, element) => {
      return sum + parseInt(element);
    }, 0) / divisor;
  }

  /**
   * 入力結果を更新し、データベースのフォーマットに合わせます。
   * @param {number} ID 更新するID
   * @param {number} missStreak 最大連続ミス入力数
   * @param {number} wpm 今回のWPM
   * @param {number} acc 今回の正答率
   * @memberof Result
   */
  update(ID, missStreak, wpm, acc) {
    if (!window.parent.settings[11]) return;
    const i = this.ids.indexOf(ID);
    this.recent5ACCs[i] =
      this.popComma(this.recent5ACCs[i], Math.ceil(acc));
    this.recent5WPMs[i] =
      this.popComma(this.recent5WPMs[i], wpm);
    this.accuracies[i] = this.calcAverage(this.recent5ACCs[i]);
    this.avarages[i] = this.calcAverage(this.recent5WPMs[i]);
    this.finisheds[i]++;
    if (this.maxes[i] < wpm) {
      this.maxes[i] = wpm;
    }
    if (this.mins[i] === null || this.mins[i] > wpm) {
      this.mins[i] = wpm;
    }
    if (this.missStreaks[i] < missStreak) {
      this.missStreaks[i] = missStreak;
    }
    if (Math.floor(acc) === 100) {
      this.aveWpmPerfects[i] =
        (this.aveWpmPerfects[i] + wpm) / ++this.perfects[i];
    } else {
      this.aveWpmMistakes[i] = (this.aveWpmMistakes[i] + wpm) /
        (this.finisheds[i] - this.perfects[i]);
    }
  }

  /**
   * 出力待ちのIDをUPDATEクエリとして発行します。
   * 発効後出力待ちの要素数をリセットします。
   * @return {array} UPDATE文を格納した配列
   * @memberof Result
   */
  querify() {
    const queries = [];
    for (const id of this.waiting) {
      const i = this.ids.indexOf(id);
      let query = `UPDATE STATS
             SET AVARAGE = ${this.avarages[i]},
             MAX = ${this.maxes[i]},
             MIN = ${this.mins[i]},
             ENCOUNTERED = ${this.encountereds[i]},
             FINISHED = ${this.finisheds[i]},
             ACCURACY = ${this.accuracies[i]},
             LASTDATE = DATETIME(),
             PERFECT = ${this.perfects[i]},
             MISS_STREAK = ${this.missStreaks[i]},
             RECENT5_WPM = '${this.recent5WPMs[i]}',
             RECENT5_ACC = '${this.recent5ACCs[i]}',
             AVEWPM_MISTAKE = ${this.aveWpmMistakes[i]},
             AVEWPM_PERFECT = ${this.aveWpmPerfects[i]}
             WHERE ID = ${this.ids[i]};`;
      query = query.replace('↵', '');
      queries.push(query);
    }
    this.waiting = new Set();
    return queries;
  }
}
