import Patterns from './patterns.js';

/**
 * 出題される文章を管理するクラスです。
 * @export Sentence
 * @constructor
 * @class Sentence
 */
export default class Sentence {
  /**
   * Sentenceインスタンスを作成します。
   * @memberof Sentence
   */
  constructor() {
    /**
     * 文章のIDを格納します。
     * @type {array}
     */
    this.ids = [];
    /**
     * 文章を格納します。
     * @type {array}
     */
    this.sentences = [];
    /**
     * パターン対応済みのかなを格納します。
     * @type {array}
     */
    this.kanas = [];
    /**
     * パターン未対応のかなを格納します。
     * @type {array}
     */
    this.kanasDisplay = [];
    /**
     * パターン対応済みのローマ字を格納します。
     * @type {array}
     */
    this.romas = [];
    /**
     * 表示用のローマ字を格納します。
     * @type {string}
     */
    this.displayRoma = "";
    /**
     * 配列メンバの現在のインデックスです。
     * @type {number}
     */
    this.current = 0;
  }

  /**
   * 生成した文章をパターンと対応させ、{@link romas}へ格納します。
   * @async
   * @memberof Sentence
   */
  async setRomas() {
    await Patterns.initialize();
    for (const kana of this.kanasDisplay) {
      this.getPatterns(kana);
    }
    this.displayRoma = this.joinRoma();
  }

  /**
   * かなとローマ文章を入力パターンが対応した文字列に格納します。
   * 「ちょうちょ」という文章の場合、かなが{ちょ, う, ちょ}の3パターンに分割され、
   *     ローマはそれに対応する入力パターンを格納します。
   * @param {string} chunk パターン未生成のかな文章
   * @memberof Sentence
   */
  getPatterns(chunk) {
    const roma = [];
    const kana = [];
    while (chunk.length > 0) {
      let cutLength = 1;
      if (chunk.length >= 3 &&
        Patterns.containsKey(chunk.substring(0, 3))) {
        cutLength = 3;
      } else if (chunk.length >= 2 &&
        Patterns.containsKey(chunk.substring(0, 2))) {
        cutLength = 2;
      }
      kana.push(chunk.substring(0, cutLength));
      roma.push(Patterns
        .patternDictionary[chunk.substring(0, cutLength)].concat());
      chunk = chunk.slice(cutLength);
    }
    this.kanas.push(kana);
    this.romas.push(this.checkN(kana, roma));
  }

  /**
   * 「ん」を「N」だけで入力していいかを判定します。
   * 入力できる文字列がある場合は「ん」に「N」のパターンを追加します。
   * また、「N」がデフォルトパターンである場合、配列の先頭に「N」を追加します。
   * @param {array} kana パターン生成済みのかな配列
   * @param {array} roma パターン生成済みのローマ配列
   * @return {array} 判定済みのローマ配列
   * @memberof Sentence
   */
  checkN(kana, roma) {
    if (kana.indexOf('ん') === -1) {
      return roma;
    }
    // 末尾の「ん」は省略できないのでlength-1
    for (let i = 0; i < kana.length - 1; i++) {
      // 文字列が「ん」かつ 次の要素1文字目があ行、な行、や行または「ん」ではない
      if (kana[i] === 'ん' && kana[i + 1][0].match(/[^あ-おな-のや-よん]/)) {
        if (false && window.parent.settings[12]) {
          roma[i].unshift('N');
        } else {
          roma[i].push('N');
        }
      }
    }
    return roma;
  }

  /**
   * ローマ字パターンの先頭要素のみを全て連結して返します。
   * @return {string} 文章のローマ字文字列
   * @memberof Sentence
   */
  joinRoma() {
    const ret = [];
    const roma = this.romas[0];
    for (let i = 0; i < roma.length; i++) {
      ret.push(roma[i][0]);
    }
    return ret.join('');
  }
}
