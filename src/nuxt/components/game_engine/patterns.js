// import Dao from '../dao.js';

/**
 * 入力パターンを作成するクラスです。
 * デフォルトの入力パターンもこのクラスで取り扱います。
 * @export Patterns
 * @class Patterns
 */
export default class Patterns {
  /**
   * 入力パターンを格納します。
   * @static
   * @type {array}
   * @memberof Patterns
   */
  static patternDictionary = {
    "あ": ["a"],
    "ぁ": ["la", "xa"],
    "い": ["i", "yi"],
    "ぃ": ["li", "lyi", "xi", "xyi"],
    "いぇ": ["ye"],
    "ぅ": ["lu", "xu"],
    "う": ["u", "whu", "wu"],
    "ヴ": ["vu"],
    "ヴぁ": ["va"],
    "うぁ": ["wha"],
    "ヴぃ": ["vi", "vyi"],
    "うぃ": ["whi", "wi"],
    "ヴぇ": ["ve", "vye"],
    "うぇ": ["we", "whe"],
    "ヴぉ": ["vo"],
    "うぉ": ["who"],
    "ヴゃ": ["vya"],
    "ヴゅ": ["vyu"],
    "ヴょ": ["vyo"],
    "え": ["e"],
    "ぇ": ["le", "lye", "xe", "xye"],
    "ぉ": ["lo", "xo"],
    "お": ["o"],
    "か": ["ca", "ka"],
    "が": ["ga"],
    "ヵ": ["lka", "xka"],
    "ぎ": ["gi"],
    "き": ["ki"],
    "ぎぃ": ["gyi"],
    "きぃ": ["kyi"],
    "ぎぇ": ["gye"],
    "きぇ": ["kye"],
    "ぎゃ": ["gya"],
    "きゃ": ["kya"],
    "ぎゅ": ["gyu"],
    "きゅ": ["kyu"],
    "ぎょ": ["gyo"],
    "きょ": ["kyo"],
    "く": ["cu", "ku", "qu"],
    "ぐ": ["gu"],
    "ぐぁ": ["gwa"],
    "くぁ": ["kwa", "qa", "qwa"],
    "ぐぃ": ["gwi"],
    "くぃ": ["qi", "qwi", "qyi"],
    "ぐぅ": ["gwu"],
    "くぅ": ["qwu"],
    "ぐぇ": ["gwe"],
    "くぇ": ["qe", "qwe", "qye"],
    "ぐぉ": ["gwo"],
    "くぉ": ["qo", "qwo"],
    "くゃ": ["qya"],
    "くゅ": ["qyu"],
    "くょ": ["qyo"],
    "げ": ["ge"],
    "け": ["ke"],
    "ヶ": ["lke", "xke"],
    "こ": ["co", "ko"],
    "ご": ["go"],
    "さ": ["sa"],
    "ざ": ["za"],
    "し": ["ci", "shi", "si"],
    "じ": ["ji", "zi"],
    "じぃ": ["jyi", "zyi"],
    "しぃ": ["syi"],
    "じぇ": ["je", "jye", "zye"],
    "しぇ": ["she", "sye"],
    "じゃ": ["ja", "jya", "zya"],
    "しゃ": ["sha", "sya"],
    "じゅ": ["ju", "jyu", "zyu"],
    "しゅ": ["shu", "syu"],
    "じょ": ["jo", "jyo", "zyo"],
    "しょ": ["sho", "syo"],
    "す": ["su"],
    "ず": ["zu"],
    "すぁ": ["swa"],
    "すぃ": ["swi"],
    "すぅ": ["swu"],
    "すぇ": ["swe"],
    "すぉ": ["swo"],
    "せ": ["ce", "se"],
    "ぜ": ["ze"],
    "そ": ["so"],
    "ぞ": ["zo"],
    "だ": ["da"],
    "た": ["ta"],
    "ち": ["chi", "ti"],
    "ぢ": ["di"],
    "ちぃ": ["cyi", "tyi"],
    "ぢぃ": ["dyi"],
    "ちぇ": ["che", "cye", "tye"],
    "ぢぇ": ["dye"],
    "ちゃ": ["cha", "cya", "tya"],
    "ぢゃ": ["dya"],
    "ちゅ": ["chu", "cyu", "tyu"],
    "ぢゅ": ["dyu"],
    "ちょ": ["cho", "cyo", "tyo"],
    "ぢょ": ["dyo"],
    "づ": ["du"],
    "っ": ["ltsu", "ltu", "xtsu", "xtu"],
    "つ": ["tsu", "tu"],
    "つぁ": ["tsa"],
    "つぃ": ["tsi"],
    "つぇ": ["tse"],
    "つぉ": ["tso"],
    "で": ["de"],
    "て": ["te"],
    "でぃ": ["dhi"],
    "てぃ": ["thi"],
    "でぇ": ["dhe"],
    "てぇ": ["the"],
    "でゃ": ["dha"],
    "てゃ": ["tha"],
    "でゅ": ["dhu"],
    "てゅ": ["thu"],
    "でょ": ["dho"],
    "てょ": ["tho"],
    "ど": ["do"],
    "と": ["to"],
    "どぁ": ["dwa"],
    "とぁ": ["twa"],
    "どぃ": ["dwi"],
    "とぃ": ["twi"],
    "どぅ": ["dwu"],
    "とぅ": ["twu"],
    "どぇ": ["dwe"],
    "とぇ": ["twe"],
    "どぉ": ["dwo"],
    "とぉ": ["two"],
    "な": ["na"],
    "に": ["ni"],
    "にぃ": ["nyi"],
    "にぇ": ["nye"],
    "にゃ": ["nya"],
    "にゅ": ["nyu"],
    "にょ": ["nyo"],
    "ぬ": ["nu"],
    "ね": ["ne"],
    "の": ["no"],
    "ば": ["ba"],
    "は": ["ha"],
    "ぱ": ["pa"],
    "び": ["bi"],
    "ひ": ["hi"],
    "ぴ": ["pi"],
    "びぃ": ["byi"],
    "ひぃ": ["hyi"],
    "ぴぃ": ["pyi"],
    "びぇ": ["bye"],
    "ひぇ": ["hye"],
    "ぴぇ": ["pye"],
    "びゃ": ["bya"],
    "ひゃ": ["hya"],
    "ぴゃ": ["pya"],
    "びゅ": ["byu"],
    "ひゅ": ["hyu"],
    "ぴゅ": ["pyu"],
    "びょ": ["byo"],
    "ひょ": ["hyo"],
    "ぴょ": ["pyo"],
    "ぶ": ["bu"],
    "ふ": ["fu", "hu"],
    "ぷ": ["pu"],
    "ふぁ": ["fa", "fwa"],
    "ふぃ": ["fi", "fwi", "fyi"],
    "ふぅ": ["fwu"],
    "ふぇ": ["fe", "fwe", "fye"],
    "ふぉ": ["fo", "fwo"],
    "ふゃ": ["fya"],
    "ふゅ": ["fyu"],
    "ふょ": ["fyo"],
    "べ": ["be"],
    "へ": ["he"],
    "ぺ": ["pe"],
    "ぼ": ["bo"],
    "ほ": ["ho"],
    "ぽ": ["po"],
    "ま": ["ma"],
    "み": ["mi"],
    "みぃ": ["myi"],
    "みぇ": ["mye"],
    "みゃ": ["mya"],
    "みゅ": ["myu"],
    "みょ": ["myo"],
    "む": ["mu"],
    "め": ["me"],
    "も": ["mo"],
    "ゃ": ["lya", "xya"],
    "や": ["ya"],
    "ゅ": ["lyu", "xyu"],
    "ゆ": ["yu"],
    "ょ": ["lyo", "xyo"],
    "よ": ["yo"],
    "ら": ["ra"],
    "り": ["ri"],
    "りぃ": ["ryi"],
    "りぇ": ["rye"],
    "りゃ": ["rya"],
    "りゅ": ["ryu"],
    "りょ": ["ryo"],
    "る": ["ru"],
    "れ": ["re"],
    "ろ": ["ro"],
    "ゎ": ["lwa", "xwa"],
    "わ": ["wa"],
    "ゐ": ["wyi"],
    "ゑ": ["wye"],
    "を": ["wo"],
    "ん": ["n'", "nn", "xn"]
  };
  /**
   * 複数パターンを持つかな文字のデフォルトの入力パターンを格納します。
   * @type {array}
   * @static
   * @memberof Patterns
   */
  static defaultPattens = {
    "ぁ": [["xa"]],
    "い": [["i"]],
    "ぃ": [["xi"]],
    "ぅ": [["xu"]],
    "う": [["u"]],
    "ヴぃ": [["vi"]],
    "うぃ": [["wi"]],
    "ヴぇ": [["ve"]],
    "うぇ": [["we"]],
    "ぇ": [["xe"]],
    "ぉ": [["xo"]],
    "か": [["ca"]],
    "ヵ": [["xka"]],
    "く": [["ku"]],
    "くぁ": [["qa"]],
    "くぃ": [["qi"]],
    "くぇ": [["qe"]],
    "くぉ": [["qo"]],
    "ヶ": [["xke"]],
    "こ": [["ko"]],
    "し": [["si"]],
    "じ": [["ji"]],
    "じぃ": [["jyi"]],
    "じぇ": [["je"]],
    "しぇ": [["she"]],
    "じゃ": [["ja"]],
    "しゃ": [["sya"]],
    "じゅ": [["ju"]],
    "しゅ": [["syu"]],
    "じょ": [["jo"]],
    "しょ": [["syo"]],
    "せ": [["se"]],
    "ち": [["ti"]],
    "ちぃ": [["tyi"]],
    "ちぇ": [["che"]],
    "ちゃ": [["cha"]],
    "ちゅ": [["chu"]],
    "ちょ": [["cho"]],
    "っ": [["xtu"]],
    "つ": [["tu"]],
    "ふ": [["fu"]],
    "ふぁ": [["fa"]],
    "ふぃ": [["fi"]],
    "ふぇ": [["fe"]],
    "ふぉ": [["fo"]],
    "ゃ": [["xya"]],
    "ゅ": [["xyu"]],
    "ょ": [["xyo"]],
    "ゎ": [["xwa"]],
    "ん": [["xn"]]
  };
  /**
   * 入力パターンが作成されたかを記録します。
   * @type {boolean}
   * @static
   * @memberof Patterns
   */
  static isInitialized = false;

  /**
   * 入力パターンとデフォルトパターンを作成します。
   * 入力パターンはデフォルトパターンの設定に合わせてソートされます。
   * 既にパターンが作成済みの場合は処理を行いません。
   * @async
   * @static
   * @memberof Patterns
   */
  static async initialize() {
    if (this.isInitialized) return;
    // await this.createBaselist();
    this.addLittle_tsu(this.patternDictionary);
    this.concatPatterns(this.patternDictionary);
    this.addSymbol(this.patternDictionary);
    // this.defaultPattens = await new Dao().getDefaultPatterns();
    this.sort(this.defaultPattens, this.patternDictionary);
    this.isInitialized = true;
  }

  /**
   * データベースから入力パターンを格納し、「っ」を連結した
   *     文字列を格納します。
   * 記号や2文字以上の文字列を連結されていないパターンを必要
   *     とする場合は、initializeではなく、こちらを選択して
   *     ください。
   * @async
   * @static
   * @memberof Patterns
   */
  static async createBaselist() {
    // this.patternDictionary = await new Dao().getKanaLibrary();
    this.addLittle_tsu(this.patternDictionary);
  }

  /**
   * 文字列「っ」を連結します。
   * 「あ、え、な行、っ」の全パターンは「っ」を連結できないため、
   *     パターンに追加しません。「い、う、ん」の一部パターンは
   *     追加されないものがあります。
   * @static
   * @param {array} list 「っ」が追加されていない入力パターン
   * @memberof Patterns
   */
  static addLittle_tsu(list) {
    for (const key of Object.keys(list)) {
      // 「あ、え、な行、っ」の全パターンは「っ」を前に連結できないので省く
      if (key.match(/^[^あえおな-のっ]/) !== null) {
        list['っ' + key] = []; for (const value of list[key]) {
          //  「い、う、ん」の一部パターンは「っ」を前に連結できないので省く    
          if (value.match(/(^I$|^U$|^NN$|^N'$)/) === null) {
            list['っ' + key].push(value[0] + value);
          }
        }
      }
    }
  }

  /**
   * 複数のかなパターンを連結させます。
   * 例えば「っ」と「うぇ」を組み合わせの場合、ローマ字も
   *     全パターンを合成し入力パターン「っうぇ」を追加します。
   * @static
   * @param {array} list 入力パターン
   * @memberof Patterns
   */
  static concatPatterns(list) {
    for (const key of Object.keys(list)) {
      if (key.length == 2) {
        list[key] = list[key].concat(this.concatTwo(list[key[0]], list[key[1]]));
      }
      else if (key.length == 3) {
        list[key] = list[key]
          .concat(this.concatTwo(list[key[0]], list[key[1] + key[2]]));
        for (const firstchar of list[key[0]]) {
          for (const secondchar of list[key[1]]) {
            for (const thirdchar of list[key[2]]) {
              list[key].push(firstchar + secondchar + thirdchar);
            }
          }
        }
      }
    }
  }

  /**
   * 2つの入力パターンを合成します。
   * 「ち」と「ゃ」等を合成して「ちゃ」といったパターンを作成します。
   * @static
   * @param {array} first 1文字目の入力パターン
   * @param {array} second 2文字目の入力パターン
   * @return {array} 
   * @memberof Patterns
   */
  static concatTwo(first, second) {
    const result = [];
    for (const firstchar of first) {
      for (const secondchar of second) { result.push(firstchar + secondchar); }
    }
    return result;
  }

  /**
   * 入力パターンを選択したパターンが先頭に来るようにソートします。
   * @static
   * @param {array} target ソートを行う元の入力パターン
   * @param {array} patterns 入力設定を格納したデフォルトパターン
   * @memberof Patterns
   */
  static sort(target, patterns) {
    let tmp;
    for (const key of Object.keys(patterns)) {
      if (target[key] !== undefined && target[key] !== patterns[key][0]) {
        tmp = patterns[key][0]; patterns[key][0] = target[key];
        patterns[key][patterns[key].lastIndexOf(target[key])] = tmp;
      }
    }
  }

  /**
   * 入力パターンに記号と0-9までの数字を配列として格納します。
   * @static
   * @param {array} list 記号を追加する入力パターン
   * @memberof Patterns
   */
  static addSymbol(list) {
    const SYMBOL_LIST = [',', '.', '/', '-', '!', '?', '[', ']', '(', ')', '~'];
    for (let i = 0; i < 10; i++) list[i.toString()] = [i.toString()];
    for (const symbol of SYMBOL_LIST) list[symbol] = [symbol];
  }

  /**
   * 渡された文字列のキーが入力パターンに存在するかを判定します。
   * @static
   * @param {string} target 存在するかを確かめるキー
   * @return {boolean} 存在するかの判定結果 
   * @memberof Patterns
   */
  static containsKey(target) {
    return this.patternDictionary[target] !== undefined;
  }
}
