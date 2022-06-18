/**
 * 判定を行うクラスです。
 * 文字列の正誤判定や、次の文章に移動してよいか等の判定を行います。
 * @export Judge
 * @constructor
 * @class Judge
 */
export default class Judge {
  /**
   * Judgeインスタンスを作成します。
   * @memberof Judge
   */
  constructor() {
    /**
     * 入力された文字が正解かを記録します。
     * @type {boolean}
     */
    this.isCorrect = false;
    /**
     * 文字列「ん」を｛n｝ではなく｛nn, n'｝と打ってよいかを記録します。
     * @type {boolean}
     */
    this.allowExtra_N = false;
    /**
     * 次の文章へ移ってよいかを記録します。
     * @type {boolean}
     */
    this.goNext = false;
    /**
     * 出題された文字列の現在位置を記録します。
     * 「ほし」という文字列の場合、「ほ」と「し」どちらを見ているのかを記録します。
     * @type {number}
     */
    this.patternIndex = 0;
    /**
     * 出題された文字列の入力パターン中の現在位置を記録します。
     * 「ほ」という文字列の場合、パターン{ho}の何文字目を見ているかを記録します。
     * @type {number}
     */
    this.charIndex = 0;
    /**
     * 正解となる入力パターンを格納します。
     * @type {array}
     */
    this.correctPatterns = [];
  }

  /**
   * 入力された文字が正解かを判定します。
   * 戻り値を持たず、判定結果はgoNextに格納されます。
   * @param {string} input 入力された文字列
   * @param {array} roma 文章の入力パターンを格納した配列
   * @memberof Judge
   */
  do(input, roma) {
    // 「N」を「NN」,「N'」と打てる場合は、正解とする
    if (this.allowExtra_N && (input === 'N' || input === '\'')) {
      this.allowExtra_N = false;
      roma[--this.patternIndex] = ['N' + input];
      this.focusNextPattern(roma);
      this.isCorrect = true;
      return;
    }

    // 入力中のかなの全パターンを参照し、現在位置のアルファベットと入力があっていれば正解
    for (const pattern of roma[this.patternIndex]) {
      if (pattern[this.charIndex] === input) {
        this.correctPatterns.push(pattern);
      }
    }

    // 正解パターンに要素がない場合は不正解
    if (this.correctPatterns.length <= 0) {
      this.isCorrect = false;
      return;
    }
    this.isCorrect = true;
    this.allowExtra_N = false;

    // 入力位置が、正解パターンのうちの最小文字数であれば、次の文章へ移ってもよい
    if (this.minimum(this.correctPatterns) - 1 === this.charIndex) {
      // 文字列が「ん」の場合は、特別処理を行う
      if (this.correctPatterns.indexOf('N') >= 0) {
        // 文末でないなら、次をNで打ってもよい
        if (roma.length !== this.patternIndex) {
          this.allowExtra_N = true;
        }
        // 「ん」を最短のnで入力した場合、必ず[N]が要素先頭に来るようにする
        if (this.correctPatterns[0] !== 'N') {
          this.correctPatterns.push(this.correctPatterns[0]);
          this.correctPatterns[0] =
            this.correctPatterns[this.correctPatterns.indexOf('N')];
          this.correctPatterns.splice(this.correctPatterns.lastIndexOf('N'), 1);
        }
      }
      // 入力結果を反映させる
      roma[this.patternIndex] = this.correctPatterns;
      this.focusNextPattern(roma);
      return;
    }
    // 正解であるが次の文字に移れない場合、次のパターンを参照するよう設定
    this.charIndex++;
    roma[this.patternIndex] = this.correctPatterns;
    this.correctPatterns = [];
  }

  /**
   * 次の入力パターンを参照するよう設定します。
   * 次のパターンがない場合は、次の文章を参照してよいと判定します。
   * @param {array} roma 文章の入力パターンを格納した配列
   * @memberof Judge
   */
  focusNextPattern(roma) {
    this.correctPatterns = [];
    this.charIndex = 0;
    this.patternIndex++;
    if (roma.length === this.patternIndex) {
      this.patternIndex = 0;
      this.goNext = true;
    }
  }

  /**
   * 配列内の全要素で、最も文字数が少ない要素の長さを返します。
   * @param {array} array 要素を比較する配列
   * @return {number} 要素中最も長さの少ない文字列 
   * @memberof Judge
   */
  minimum(array) {
    let minimum = array[0].length;
    if (array.length === 1) return minimum;
    for (const str of array) {
      if (str.length < minimum) {
        minimum = str.length;
      }
    }
    return minimum;
  }
}
