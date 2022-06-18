/**
 * データべースに接続するためのオブジェクトです。
 * データのフォーマット等も行います。
 * @export Dao
 * @class Dao
 */
export default class Dao {
  /**
   * データベースのテーブルとビューの一覧を取得します。
   * @async
   * @return {array} {カラム名：値}のオブジェクトを行数分格納した配列
   * @memberof Dao
   */
  async getSystemTablesAndView() {
    const query = 'SELECT NAME FROM SQLITE_MASTER ' +
      'WHERE TYPE IN (\'table\', \'view\');';
    const result = await window.parent.requires.sendquery(query);
    return result;
  }

  /**
   * ゲームに出題される文章を格納します。
   * クエリ該当数が規定に満たない場合は、該当クエリの中から規定を満たすまで
   *     ランダムに追加します。
   * クエリの該当数が0の場合はデータベースに存在する文章をランダムに出題します。
   * @async
   * @return {array} 文章と文章の統計を統合したオブジェクトを出題分格納した配列
   * @memberof Dao
   */
  async getSentence() {
    let result = await window.parent.requires.sendquery(this.getGameQuery());
    if (result.length === 0) {
      const query = `SELECT A.KANA, A.SENTENCE, B.* FROM SENTENCE AS A /*
      */ INNER JOIN STATS AS B ON A.ID = B.ID /*
      */  ORDER BY RANDOM() LIMIT ${window.parent.settings[0]};`;
      result = await window.parent.requires.sendquery(query);
    } else if (this.needToFill(result.length)) {
      result = result.concat(await this.fillLimit(result.length, result));
    }
    return result;
  }

  /**
   * 出題する文章を取得するための文章を作成します。
   * 無制限出題はクエリ行の上限を100に設定し、出題数がランダム設定
   *     の場合は設定数を上限としてランダムに取得します。
   * 出題設定を行わない場合は設定された上限までデータベースから
   *     ランダムに文章を取得します。
   * @return {string} 文章を取得するクエリ
   * @memberof Dao
   */
  getGameQuery() {
    const query = window.parent.settings[38];
    let limit = window.parent.settings[0];
    if (window.parent.settings[4]) {
      limit = 100;
    } else if (window.parent.settings[2]) {
      limit = Math.floor(Math.random() *
        (window.parent.settings[3] + 1 - 2)) + 2;
    }
    if (window.parent.settings[13]) {
      return `SELECT A.KANA, A.SENTENCE, B.* FROM SENTENCE AS A /*
       */ INNER JOIN STATS AS B ON A.ID = B.ID /*
       */ ORDER BY RANDOM() LIMIT ${limit};`;
    }
    return query.replace(/(LIMIT|limit) {0,}\d{1,}/, `LIMIT ${limit}`);
  }

  /**
   * 文章が規定数に満たないかを判定します。
   * @param {number} rowCount 現在のクエリの該当数
   * @return {boolean} 文章を追加する必要があるかの判定結果
   * @memberof Dao
   */
  needToFill(rowCount) {
    // 無制限出題かつ該当数が規定数100を下回る場合
    if (window.parent.settings[4] && rowCount < 100) return true;
    //  規定数未満のまま出題しない かつ 実際に規定数を下回る場合
    return window.parent.settings[14] !== 2 &&
      rowCount < window.parent.settings[0];
  }

  /**
   * 取得した文章を規定数に満たされるまで追加します。
   * 規定数は出題数からの不足分を引いた値とします（無制限出題の出題数は100）。
   * 追加する文章は取得した中からランダムに追加されますが、
   *     ランダムに抽出した文章で埋める設定の場合は再びクエリを
   *     発行して追加します。
   * @async
   * @param {number} current 現在取得した文章数
   * @param {array} addition ランダムに追加する文章の配列
   * @return {array} 不足分追加された文章の配列
   * @memberof Dao
   */
  async fillLimit(current, addition) {
    let ret = [];
    let target = window.parent.settings[0] - current;
    if (window.parent.settings[4]) target = 100 - current;
    if (window.parent.settings[14] === 0) {
      ret = await window.parent.requires.sendquery(
        `SELECT A.KANA, A.SENTENCE, B.* FROM SENTENCE AS A /*
        */INNER JOIN STATS AS B ON A.ID = B.ID /*
        */ ORDER BY RANDOM() LIMIT ${target}`);
    } else {
      while (ret.length < target) {
        ret.push(addition[Math.floor(Math.random() * addition.length)]);
      }
    }
    return ret;
  }

  /**
   * テーブルに格納する文章一覧のデータを取得します。
   * @async
   * @param {function} callback 対象のテーブルへ追加を行う関数です。
   * @param {string} [query=null] テーブルを取得するためのクエリです。
   *     引数が省略された場合は250行のテーブルデータを昇順に取得します。
   * @memberof Dao
   */
  async fillSentenceTable(callback, query = null) {
    if (query === null) {
      query = `SELECT * FROM Sentence A LEFT OUTER JOIN GROUP_TAGS B 
      ON A.ID = B.SENTENCEID ORDER BY A.ID LIMIT 250;`;
    }
    const result = await window.parent.requires.sendquery(query);
    let ret = [];
    let num = 1;
    for (const row of result) {
      ret.push(num);
      ret.push(row['SENTENCE']);
      ret.push(row['KANA']);
      ret.push((!row['TAG'] || row['TAG'] === 'null') ? '' : row['TAG']);
      ret.push(row['ID']);
      ret.push(row['MODIFIED']);
      ret.push(row['INSERTED']);
      callback(ret, 4);
      ret = [];
      num++;
    }
  }

  /**
   * 変更した設定をデータベースへ記録します。
   * @async
   * @param {number} id 変更する設定のID
   * @param {number|string} value 変更する値
   * @memberof Dao
   */
  async saveSettings(id, value) {
    const query = `UPDATE SETTINGS SET VALUE = ${value} WHERE ID = ${id}`;
    await window.parent.requires.sendquery(query);
  }

  /**
   * ゲームの統計を保存します。
   * @async
   * @param {array} queries ゲームの統計を格納したクエリです。
   *     文章数分のUPDATE文の実行を想定しています。
   * @memberof Dao
   */
  async saveStats(queries) {
    if (!window.parent.settings[11]) return;
    for (const query of queries) {
      await window.parent.requires.sendquery(query);
    }
  }

  /**
   * かなの入力パターンを取得します。
   * @async
   * @return {object} かなの入力パターン。1文字以上のかなをキー、
   *     1つ以上のパターンを配列に格納したオブジェクトを返します。
   * @memberof Dao
   */
  async getKanaLibrary() {
    const dictionary = {};
    const query = 'SELECT KANA, ROMA FROM KANAPATTERN ORDER BY KANA ASC';
    const result = await window.parent.requires.sendquery(query);
    for (const key of Object.keys(result)) {
      if (dictionary[result[key]['KANA']] === undefined) {
        dictionary[result[key]['KANA']] = [result[key]['ROMA'].toUpperCase()];
      } else {
        dictionary[result[key]['KANA']].push(result[key]['ROMA'].toUpperCase());
      }
    }
    return dictionary;
  }

  /**
   * デフォルトの入力パターンを取得します。
   * @async
   * @return {object} 設定された入力パターンを、かなをキー、ローマ字パターンを
   *     一意の値として格納したオブジェクトを返します。
   * @memberof Dao
   */
  async getDefaultSelected() {
    const result = {};
    const query = 'SELECT KANA, SELECTED FROM SELECTEDPATTERN';
    const table = await window.parent.requires.sendquery(query);
    for (const key of Object.keys(table)) {
      result[table[key]['Selected']] = table[key]['Selected'];
    }
    return result;
  }

  /**
   * デフォルトの入力パターンを取得します。
   * @async
   * @return {object} 設定された入力パターンを、かなをキー、ローマ字パターンを
   *     一意の値として格納したオブジェクトを返します。
   * @memberof Dao
   */
  async getDefaultPatterns() {
    const result = {};
    const query = 'SELECT KANA, SELECTED FROM SELECTEDPATTERN';
    const table = await window.parent.requires.sendquery(query);
    for (const key of Object.keys(table)) {
      result[table[key]['Kana']] = table[key]['Selected'].toUpperCase();
    }
    return result;
  }

  /**
   * 出題設定をすべて取得します。
   * @async
   * @return {object} 出題設定のID、データ型、ターゲットタグ、
   *     値を格納した配列
   * @memberof Dao
   */
  async getAllWindowSettings() {
    const ret = {};
    const query = 'SELECT Id, Type, html as Tag, Value ' +
      'FROM Settings WHERE Window = \'Question\' OR ID = 0';
    const table = await window.parent.requires.sendquery(query);
    for (const key of Object.keys(table)) {
      ret[table[key]['Id']] = table[key];
      delete ret[table[key]['Id']].Id;
    }
    return ret;
  }

  /**
   * 文章のタグ一覧を取得します。
   * @async
   * @return {array} データベースに登録されているタグの一覧
   * @memberof Dao
   */
  async getTaglists() {
    const result = [];
    const query = 'SELECT TAG FROM TAGLISTS WHERE TAG <> \'null\'';
    const table = await window.parent.requires.sendquery(query);
    for (const key of Object.keys(table)) {
      result.push(table[key]['TAG']);
    }
    return result;
  }

  /**
   * 存在しないテーブルがあれば、テーブルと行を追加しデータベースを初期化します。
   * @async
   * @param {array} tables 新規作成が必要なテーブルリストです。
   * @memberof Dao
   */
  async initalizeDatabase(tables) {
    const qc = new QueryConstants();
    const createQueries = qc.getCreateTableAndView();
    const insertRows = {
      'KanaPattern': qc.getKanaPatterns(),
      'Settings': qc.getSettings(),
      'Sentence': qc.getInsertSentences(),
      'SelectedPattern': qc.insertSelectedPatterns(),
    };
    for (const key of Object.keys(createQueries)) {
      if (tables.indexOf(key) == -1) continue;
      await window.requires.sendquery(createQueries[key]);
      if (insertRows[key]) {
        await window.requires.sendquery(insertRows[key]);
      }
    }
    const limit = await window.requires.sendquery(
      'SELECT COUNT(ID) as count FROM SENTENCE;');
    let stats = 'INSERT INTO STATS VALUES ';
    let tags = 'INSERT INTO TAGS VALUES ';
    for (let i = 1; i <= limit[0].count; i++) {
      stats += `(${i}, '0', '0', null, '0', '0', '0', null,
       '0', '0', '0,0,0,0,0', '0,0,0,0,0', '0', '0'),\n`;
      tags += `(1, ${i}), `;
    }
    await window.requires.sendquery(stats.slice(0, -2));
    await window.requires.sendquery(tags.slice(0, -2));
    window.requires.sendquery('INSERT INTO TAGLISTS VALUES (1, \'デフォルト\')');
  }
}

/**
 * クエリの定数を保持するクラスです。
 * @class QueryConstants
 */
class QueryConstants {
  /**
   * アプリの設定を追加するクエリを返します。
   * @return {string} 設定のINSERT文
   * @memberof QueryConstants
   */
  getSettings() {
    return `INSERT INTO Settings 
          (Id, Window, Type, Value, html, Name) 
          VALUES (0, 'Game', 'int', '3', '', '問題数'),  
          (1, 'Game', 'int', '3', '', 'カウントダウン秒'),  
          (2, 'Game', 'bool', '0', '', '出題数をランダムにする'),  
          (3, 'Game', 'int', '3', '', 'ランダム出題の最大値'),  
          (4, 'Game', 'bool', '0', '', '出題を無制限にする'),  
          (5, 'Game', 'bool', '1', '', '出題数を表示する'),  
          (6, 'Game', 'bool', '1', '', '現在WPMを表示する'),  
          (7, 'Game', 'bool', '1', '', '合計WPMを表示する'),  
          (8, 'Game', 'bool', '1', '', '現在正答率を表示する'),  
          (9, 'Game', 'bool', '1', '', '合計正答率を表示する'),  
          (10, 'Game', 'bool', '1', '', '経過時間を表示する'),  
          (11, 'Game', 'bool', '1', '', '統計を記録する'),  
          (12, 'Keyboard', 'bool', '1', '', '省略Nを入力パターンに採用する'),  
          (13, 'Question', 'bool', '0', 'checkbox', '出題設定をしない'),  
          (14, 'Question', 'int', '1', 'select', 'キュー＜出題上限である場合の処理'),  
          (15, 'Question', 'int', '0', 'radio', 'デフォルトタブ'),  
          (16, 'Question', 'int', '0', 'radio', '未出題の文章を優先する'),  
          (17, 'Question', 'bool', '0', '', '得意な文章を優先'),  
          (18, 'Question', 'bool', '0', '', '苦手な文章を優先'),  
          (19, 'Question', 'string', '', 'li', '出題タグ'),  
          (20, 'Question', 'string', '', '', '出題しないタグ'),  
          (21, 'Question', 'bool', '0', '', '出題タグのみを出す'),  
          (22, 'Question', 'int', '', 'textbox', 'Value以上のWPM'),  
          (23, 'Question', 'int', '', 'textbox', 'Value以下のWPM'),  
          (24, 'Question', 'int', '', 'textbox', 'Value以上の正答率'),  
          (25, 'Question', 'int', '', 'textbox', 'Value以下の正答率'),  
          (26, 'Question', 'Array', '', 'table', '出題に含める文章ID'),  
          (27, 'Question', 'Array', '', 'table', '出題に含めない文章ID'),  
          (28, 'Question', 'int', '0', 'radio', '出題に含む文章の一致パターン'),  
          (29, 'Question', 'value', '', 'textbox', '出題に含む文章'),  
          (30, 'Question', 'int', '0', 'radio', '出題に含むかなの一致パターン'),  
          (31, 'Question', 'value', '', 'textbox', '出題に含むかな'),  
          (32, 'Question', 'int', '0', 'radio', '出題に含まない文章の一致パターン'),  
          (33, 'Question', 'value', '', 'textbox', '出題に含まない文章'),  
          (34, 'Question', 'int', '0', 'radio', '出題に含まないかなの一致パターン'),  
          (35, 'Question', 'value', '', 'textbox', '出題に含まないかな'),  
          (36, 'Question', 'int', '', 'textbox', 'Value以上の長さの文章'),  
          (37, 'Question', 'int', '', 'textbox', 'Value以下の長さの文章'),  
          (38, 'Question', 'string', 'SELECT * FROM SENTENCE AS A
          INNER JOIN STATS AS B ON A.ID = B.ID ORDER BY RANDOM() LIMIT 5'
          , '', '出題クエリ'),
          (39, 'Game', 'bool', '1', '', 'タイプ音を出力する'),
          (40, 'Game', 'bool', '1', '', 'ビープ音を出力する'),
          (41, 'GameScreen', 'int', '2.0', '', 'フォントサイズ'),
          (42, 'GameScreen', 'string', 'left', '', 'ゲーム画面の配置');`;
  }

  /**
   * テーブルとビューを全て追加するクエリをテーブル名をキーとして格納したオブジェクトを返します。
   * @return {object} テーブルCREATE文のオブジェクト
   * @memberof QueryConstants
   */
  getCreateTableAndView() {
    return {
      'Settings': `CREATE TABLE "Settings" (
        "Id" INTEGER NOT NULL UNIQUE,
        "Window" TEXT NOT NULL,
        "Type" TEXT NOT NULL,
        "Value" TEXT NOT NULL,
        "html" TEXT,
        "Name" TEXT,
        CONSTRAINT "PK_Settings" PRIMARY KEY("Id","Window"))`,
      'Sentence': `CREATE TABLE "Sentence" (
        "ID" INTEGER NOT NULL UNIQUE,
        "SENTENCE" TEXT NOT NULL,
        "KANA" TEXT NOT NULL,
        "MODIFIED" TEXT,
        "INSERTED" TEXT DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_Sentence" PRIMARY KEY("ID"));`,
      'Stats': `CREATE TABLE "Stats" (
        "ID" INTEGER NOT NULL,
        "AVARAGE" bigint NOT NULL DEFAULT (0),
        "MAX" bigint NOT NULL DEFAULT (0),
        "MIN" bigint DEFAULT null,
        "ENCOUNTERED" bigint NOT NULL DEFAULT (0),
        "FINISHED" bigint NOT NULL DEFAULT (0),
        "ACCURACY" bigint NOT NULL DEFAULT (0),
        "LASTDATE" text,
        "PERFECT" bigint NOT NULL DEFAULT (0),
        "MISS_STREAK" bigint NOT NULL DEFAULT (0),
        "RECENT5_WPM" text NOT NULL DEFAULT ('0,0,0,0,0'),
        "RECENT5_ACC" text NOT NULL DEFAULT ('0,0,0,0,0'),
        "AVEWPM_MISTAKE" bigint NOT NULL DEFAULT (0),
        "AVEWPM_PERFECT" bigint NOT NULL DEFAULT (0),
        CONSTRAINT "PK_Stats" PRIMARY KEY("ID"))`,
      'SelectedPattern': `CREATE TABLE "SelectedPattern" (
        "Kana" TEXT NOT NULL UNIQUE,
        "Selected" TEXT,
        CONSTRAINT "PK_Selected" PRIMARY KEY("Kana"))`,
      'KanaPattern': `CREATE TABLE "KanaPattern" (
        "KANA" nvarchar(50) COLLATE NOCASE,
        "ROMA" nvarchar(50) NOT NULL COLLATE NOCASE,
        CONSTRAINT "PK_KanaPattern" PRIMARY KEY("ROMA"))`,
      'Taglists': `CREATE TABLE "Taglists" (
        "ID" INTEGER UNIQUE,
        "TAG" INTEGER NOT NULL UNIQUE,
        PRIMARY KEY("ID"))`,
      'Tags': `CREATE TABLE "Tags" (
        "tagID" INTEGER NOT NULL,
        "sentenceID" INTEGER NOT NULL)`,
      'GROUP_TAGS': `CREATE VIEW GROUP_TAGS AS 
        SELECT A.SENTENCEID, GROUP_CONCAT(B.TAG) AS TAG
        FROM TAGS A
        INNER JOIN TAGLISTS B
        ON A.TAGID = B.ID
        GROUP BY SENTENCEID;`};
  }

  /**
   * 文章のかなパターンを追加するクエリを返します。
   * @return {string} 入力パターンのINSERT文
   * @memberof QueryConstants
   */
  getKanaPatterns() {
    return `INSERT INTO KanaPattern ("KANA", "ROMA") VALUES ('あ', 'a'),
    ('ば', 'ba'), ('べ', 'be'), ('び', 'bi'), ('ぼ', 'bo'), ('ぶ', 'bu'),
    ('びゃ', 'bya'), ('びぇ', 'bye'), ('びぃ', 'byi'), ('びょ', 'byo'), ('びゅ', 'byu'),
    ('か', 'ca'), ('せ', 'ce'), ('ちゃ', 'cha'), ('ちぇ', 'che'), ('ち', 'chi'),
    ('ちょ', 'cho'), ('ちゅ', 'chu'), ('し', 'ci'), ('こ', 'co'), ('く', 'cu'),
    ('ちゃ', 'cya'), ('ちぇ', 'cye'), ('ちぃ', 'cyi'), ('ちょ', 'cyo'),
    ('ちゅ', 'cyu'), ('だ', 'da'), ('で', 'de'), ('でゃ', 'dha'), ('でぇ', 'dhe'),
    ('でぃ', 'dhi'), ('でょ', 'dho'), ('でゅ', 'dhu'), ('ぢ', 'di'), ('ど', 'do'),
    ('づ', 'du'), ('どぁ', 'dwa'), ('どぇ', 'dwe'), ('どぃ', 'dwi'), ('どぉ', 'dwo'),
    ('どぅ', 'dwu'), ('ぢゃ', 'dya'), ('ぢぇ', 'dye'), ('ぢぃ', 'dyi'), ('ぢょ', 'dyo'),
    ('ぢゅ', 'dyu'), ('え', 'e'), ('ふぁ', 'fa'), ('ふぇ', 'fe'), ('ふぃ', 'fi'),
    ('ふぉ', 'fo'), ('ふ', 'fu'), ('ふぁ', 'fwa'), ('ふぇ', 'fwe'), ('ふぃ', 'fwi'),
    ('ふぉ', 'fwo'), ('ふぅ', 'fwu'), ('ふゃ', 'fya'), ('ふぇ', 'fye'),
    ('ふぃ', 'fyi'), ('ふょ', 'fyo'), ('ふゅ', 'fyu'), ('が', 'ga'), ('げ', 'ge'),
    ('ぎ', 'gi'), ('ご', 'go'), ('ぐ', 'gu'), ('ぐぁ', 'gwa'), ('ぐぇ', 'gwe'),
    ('ぐぃ', 'gwi'), ('ぐぉ', 'gwo'), ('ぐぅ', 'gwu'), ('ぎゃ', 'gya'), ('ぎぇ', 'gye'),
    ('ぎぃ', 'gyi'), ('ぎょ', 'gyo'), ('ぎゅ', 'gyu'), ('は', 'ha'), ('へ', 'he'),
    ('ひ', 'hi'), ('ほ', 'ho'), ('ふ', 'hu'), ('ひゃ', 'hya'), ('ひぇ', 'hye'),
    ('ひぃ', 'hyi'), ('ひょ', 'hyo'), ('ひゅ', 'hyu'), ('い', 'i'), ('じゃ', 'ja'),
    ('じぇ', 'je'), ('じ', 'ji'), ('じょ', 'jo'), ('じゅ', 'ju'), ('じゃ', 'jya'),
    ('じぇ', 'jye'), ('じぃ', 'jyi'), ('じょ', 'jyo'), ('じゅ', 'jyu'),
    ('か', 'ka'), ('け', 'ke'), ('き', 'ki'), ('こ', 'ko'), ('く', 'ku'),
    ('くぁ', 'kwa'), ('きゃ', 'kya'), ('きぇ', 'kye'), ('きぃ', 'kyi'),
    ('きょ', 'kyo'), ('きゅ', 'kyu'), ('ぁ', 'la'), ('ぇ', 'le'), ('ぃ', 'li'),
    ('ヵ', 'lka'), ('ヶ', 'lke'), ('ぉ', 'lo'), ('っ', 'ltsu'), ('っ', 'ltu'),
    ('ぅ', 'lu'), ('ゎ', 'lwa'), ('ゃ', 'lya'), ('ぇ', 'lye'), ('ぃ', 'lyi'),
    ('ょ', 'lyo'), ('ゅ', 'lyu'), ('ま', 'ma'), ('め', 'me'), ('み', 'mi'),
    ('も', 'mo'), ('む', 'mu'), ('みゃ', 'mya'), ('みぇ', 'mye'), ('みぃ', 'myi'),
    ('みょ', 'myo'), ('みゅ', 'myu'), ('ん', 'n'''), ('な', 'na'), ('ね', 'ne'),
    ('に', 'ni'), ('ん', 'nn'), ('の', 'no'), ('ぬ', 'nu'), ('にゃ', 'nya'),
    ('にぇ', 'nye'), ('にぃ', 'nyi'), ('にょ', 'nyo'), ('にゅ', 'nyu'),
    ('お', 'o'), ('ぱ', 'pa'), ('ぺ', 'pe'), ('ぴ', 'pi'), ('ぽ', 'po'),
    ('ぷ', 'pu'), ('ぴゃ', 'pya'), ('ぴぇ', 'pye'), ('ぴぃ', 'pyi'),
    ('ぴょ', 'pyo'), ('ぴゅ', 'pyu'), ('くぁ', 'qa'), ('くぇ', 'qe'),
    ('くぃ', 'qi'), ('くぉ', 'qo'), ('く', 'qu'), ('くぁ', 'qwa'), ('くぇ', 'qwe'),
    ('くぃ', 'qwi'), ('くぉ', 'qwo'), ('くぅ', 'qwu'), ('くゃ', 'qya'),
    ('くぇ', 'qye'), ('くぃ', 'qyi'), ('くょ', 'qyo'), ('くゅ', 'qyu'),
    ('ら', 'ra'), ('れ', 're'), ('り', 'ri'), ('ろ', 'ro'), ('る', 'ru'),
    ('りゃ', 'rya'), ('りぇ', 'rye'), ('りぃ', 'ryi'), ('りょ', 'ryo'),
    ('りゅ', 'ryu'), ('さ', 'sa'), ('せ', 'se'), ('しゃ', 'sha'),
    ('しぇ', 'she'), ('し', 'shi'), ('しょ', 'sho'), ('しゅ', 'shu'),
    ('し', 'si'), ('そ', 'so'), ('す', 'su'), ('すぁ', 'swa'), ('すぇ', 'swe'),
    ('すぃ', 'swi'), ('すぉ', 'swo'), ('すぅ', 'swu'), ('しゃ', 'sya'),
    ('しぇ', 'sye'), ('しぃ', 'syi'), ('しょ', 'syo'), ('しゅ', 'syu'),
    ('た', 'ta'), ('て', 'te'), ('てゃ', 'tha'), ('てぇ', 'the'),
    ('てぃ', 'thi'), ('てょ', 'tho'), ('てゅ', 'thu'), ('ち', 'ti'),
    ('と', 'to'), ('つぁ', 'tsa'), ('つぇ', 'tse'), ('つぃ', 'tsi'),
    ('つぉ', 'tso'), ('つ', 'tsu'), ('つ', 'tu'), ('とぁ', 'twa'),
    ('とぇ', 'twe'), ('とぃ', 'twi'), ('とぉ', 'two'), ('とぅ', 'twu'),
    ('ちゃ', 'tya'), ('ちぇ', 'tye'), ('ちぃ', 'tyi'), ('ちょ', 'tyo'),
    ('ちゅ', 'tyu'), ('う', 'u'), ('ヴぁ', 'va'), ('ヴぇ', 've'),
    ('ヴぃ', 'vi'), ('ヴぉ', 'vo'), ('ヴ', 'vu'), ('ヴゃ', 'vya'), ('ヴぇ', 'vye'),
    ('ヴぃ', 'vyi'), ('ヴょ', 'vyo'), ('ヴゅ', 'vyu'), ('わ', 'wa'),
    ('うぇ', 'we'), ('うぁ', 'wha'), ('うぇ', 'whe'), ('うぃ', 'whi'),
    ('うぉ', 'who'), ('う', 'whu'), ('うぃ', 'wi'), ('を', 'wo'), ('う', 'wu'),
    ('ぁ', 'xa'), ('ぇ', 'xe'), ('ぃ', 'xi'), ('ヵ', 'xka'), ('ヶ', 'xke'),
    ('ん', 'xn'), ('ぉ', 'xo'), ('っ', 'xtsu'), ('っ', 'xtu'), ('ぅ', 'xu'),
    ('ゎ', 'xwa'), ('ゃ', 'xya'), ('ぇ', 'xye'), ('ぃ', 'xyi'), ('ょ', 'xyo'),
    ('ゅ', 'xyu'), ('や', 'ya'), ('いぇ', 'ye'), ('い', 'yi'), ('よ', 'yo'),
    ('ゆ', 'yu'), ('ざ', 'za'), ('ぜ', 'ze'), ('じ', 'zi'), ('ぞ', 'zo'),
    ('ず', 'zu'), ('じゃ', 'zya'), ('じぇ', 'zye'), ('じぃ', 'zyi'),
    ('じょ', 'zyo'), ('じゅ', 'zyu'), ('ゑ', 'wye'), ('ゐ', 'wyi');`;
  }

  /**
   * デフォルトの入力パターンの初期値を追加するクエリを返します。
   * @return {string} デフォルト入力パターンのINSERT文
   * @memberof QueryConstants
   */
  insertSelectedPatterns() {
    return `INSERT INTO SelectedPattern (Kana, Selected) VALUES 
    ('ぁ', 'la'),('ぃ', 'li'),('い', 'i'),('ぅ', 'lu'),('う', 'u'),('うぃ', 'wi'),
    ('うぇ', 'we'),('ぇ', 'le'),('ぉ', 'lo'),('か', 'ka'),('く', 'ku'),('くぁ', 'kwa'),
    ('くぃ', 'qi'),('くぇ', 'qe'),('くぉ', 'qo'),('こ', 'ko'),('し', 'si'),
    ('しぇ', 'sye'),('しゃ', 'sya'),('しゅ', 'syu'),('しょ', 'syo'),('じ', 'ji'),
    ('じぃ', 'jyi'),('じぇ', 'je'),('じゃ', 'ja'),('じゅ', 'ju'),('じょ', 'jo'),
    ('せ', 'se'),('ち', 'ti'),('ちぃ', 'tyi'),('ちぇ', 'tye'),('ちゃ', 'tya'),
    ('ちゅ', 'tyu'),('ちょ', 'tyo'),('っ', 'xtu'),('つ', 'tu'),('ふ', 'fu'),
    ('ふぁ', 'fa'),('ふぃ', 'fi'),('ふぇ', 'fe'),('ふぉ', 'fo'),('ゃ', 'lya'),
    ('ゅ', 'lyu'),('ょ', 'lyo'),('ゎ', 'lwa'),('ん', 'nn'),('ヴぃ', 'vi'),
    ('ヴぇ', 've'),('ヵ', 'lka'),('ヶ', 'lke');`;
  }

  /**
   * デフォルトの文章を作成するクエリを返します。
   * @return {string} デフォルト文章のINSERT文
   * @memberof QueryConstants
   */
  getInsertSentences() {
    return `INSERT INTO Sentence (SENTENCE, KANA) VALUES 
    ('的を外してしまった','まとをはずしてしまった'),
    ('彼女はもう少しで遅刻するところだった','かのじょはもうすこしでちこくするところだった'),
    ('恐れるな','おそれるな'),
    ('猫は木をかけ登った','ねこはきをかけのぼった'),
    ('それはこっちのセリフですよ','それはこっちのせりふですよ'),
    ('お勘定して下さい','おかんじょうしてください'),
    ('もう手が冷たくって','もうてがつめたくって'),
    ('彼はいつも仕事をやりかけにしておく','かれはいつもしごとをやりかけにしておく'),
    ('ジョンは相手の王を逃げられなくすれば勝つゲームがうまいです','じょんはあいてのおうをにげられなくすればかつげ-むがうまいです'),
    ('トムは兄と同じくらいうまく雪の上を滑るスポーツができる','とむはあにとおなじくらいうまくゆきのうえをすべるすぽ-つができる'),
    ('そんなガツガツ食べないで、もうちょっとゆっくり食べようよ','そんながつがつたべないで,もうちょっとゆっくりたべようよ'),
    ('また近いうちにお目にかかりましょう','またちかいうちにおめにかかりましょう'),
    ('ああ、やっと終わった','ああ,やっとおわった'),
    ('誰でも間違う事はある','だれでもまちがうことはある'),
    ('キャッチボールをしよう','きゃっちぼ-るをしよう'),
    ('今日の仕事はこれまで','きょうのしごとはこれまで'),
    ('風と共に去りぬを読む','かぜとともにさりぬをよむ'),
    ('どういう風の吹き回しでこうなったのだろう','どういうかぜのふきまわしでこうなったのだろう'),
    ('明日は、朝市に行こう','あしたはあさいちにいこう'),
    ('お茶を飲みにいらっしゃい','おちゃをのみにいらっしゃい'),
    ('もうヘトヘトです','もうへとへとです'),
    ('このニュースは初耳です','このにゅ-すははつみみです'),
    ('いったいぜんたいこれは何だ','いったいぜんたいこれはなんだ'),
    ('違う、違う、違う','ちがう,ちがう,ちがう'),
    ('こんな時は、迎え酒に限ります','こんなときはむかえざけにかぎります'),
    ('それはどんな動物だ','それはどんなどうぶつだ'),
    ('今すぐ始めよう','いますぐはじめよう'),
    ('すぐに出発しよう','すぐにしゅっぱつしよう'),
    ('一朝一夕にはできない','いっちょういっせきにはできない'),
    ('十中八九ジェーンは来るだろう','じゅっちゅうはっくじぇ-んはくるだろう'),
    ('あたり一面花だった','あたりいちめんはなだった'),
    ('雨がやんだら野球をしよう','あめがやんだらやきゅうをしよう'),
    ('恐ろしく寒いな今日の夜は','おそろしくさむいなきょうのよるは'),
    ('コップは水でいっぱいだ','こっぷはみずでいっぱいだ'),
    ('やったと思った','やったとおもった'),
    ('私はやっと都会の生活に慣れてきた','わたしはやっととかいのせいかつになれてきた'),
    ('ぐっすり寝ました','ぐっすりねました'),
    ('うーんいいなあそこへ行こう','う-んいいなあそこへいこう'),
    ('泣いても笑ってもあと一日','ないてもわらってもあといちにち'),
    ('ちょっときついです','ちょっときついです'),
    ('見渡す限り海だった','みわたすかぎりうみだった'),
    ('お世話になっております','おせわになっております'),
    ('風で帽子を飛ばされた','かぜでぼうしをとばされた'),
    ('細く長く愛して','ほそくながくあいして'),
    ('ボブは正しいですか','ぼぶはただしいですか'),
    ('ん、あ、悪い','ん,あ,わるい'),
    ('こんなところで会うなんて思いもしなかった','こんなところであうなんておもいもしなかった'),
    ('彼女は彼を死ぬほど驚かせた','かのじょはかれをしぬほどおどろかせた'),
    ('決して冗談じゃない','けっしてじょうだんじゃない'),
    ('雨が降るよう祈った','あめがふるよういのった'),
    ('春はすぐそこまで来ている','はるはすぐそこまできている'),
    ('彼は若いしおまけに二枚目だ','かれはわかいしおまけににまいめだ'),
    ('ディナーに魚はどうですか','でぃな-にさかなはどうですか'),
    ('喜んで行きます','よろこんでいきます'),
    ('テレビはいつからあるの','てれびはいつからあるの'),
    ('あいにくですが彼は外出中です','あいにくですがかれはがいしゅつちゅうです'),
    ('お話の途中ですみません','おはなしのとちゅうですみません'),
    ('うん、まだどうするか決めてないんだ','うん,まだどうするかきめてないんだ'),
    ('また一日が過ぎた','またいちにちがすぎた'),
    ('酒に飲まれてはいけません','さけにのまれてはいけません'),
    ('食事をする時間はたっぷりある','しょくじをするじかんはたっぷりある'),
    ('今度はあの子は何をねらっているのか','こんどはあのこはなにをねらっているのか'),
    ('もっと町を見るためにバスで行こう','もっとまちをみるためにばすでいこう'),
    ('固いこと言うなよ','かたいこというなよ'),
    ('東京駅なう','とうきょうえきなう'),
    ('それをよくよく覚えています','それをよくよくおぼえています'),
    ('ここはうだるように暑い','ここはうだるようにあつい'),
    ('わが家にまさる所なし','わがやにまさるところなし'),
    ('今放送中です','いまほうそうちゅうです'),
    ('お手洗いをお借りしても良いですか','おてあらいをおかりしてもよいですか'),
    ('年が過ぎていきました','としがすぎていきました'),
    ('彼は決して誘惑に乗らなかった','かれはけっしてゆうわくにのらなかった'),
    ('我々は経験によって学ぶ','われわれはけいけんによってまなぶ'),
    ('風邪が抜けない','かぜがぬけない'),
    ('お礼の申し上げようもない','おれいのもうしあげようもない'),
    ('このレポートを終えたら休もうと思う','このれぽ-とをおえたらやすもうとおもう'),
    ('ああ思い出したぞ','ああおもいだしたぞ'),
    ('お塩とって','おしおとって'),
    ('バンドエイドと薬をください','ばんどえいどとくすりをください'),
    ('一番近い図書館はどこにありますか','いちばんちかいとしょかんはどこにありますか'),
    ('宿題をたくさん出します','しゅくだいをたくさんだします'),
    ('その時彼は何をたくらんでいたのか','そのときかれはなにをたくらんでいたのか'),
    ('電話をもらったときには宿題を終えていた','でんわをもらったときにはしゅくだいをおえていた'),
    ('まあ行ってみよう','まあいってみよう'),
    ('もう一杯コーヒーはいかがですか','もういっぱいこ-ひ-はいかがですか'),
    ('また始まった','またはじまった'),
    ('お知らせください','おしらせください'),
    ('今日はふざけてばかりいるんだから','きょうはふざけてばかりいるんだから'),
    ('いいえ歌いません','いいえうたいません'),
    ('ご注目下さい','ごちゅうもくください'),
    ('箱は開けてみたら空だった','はこはあけてみたらからだった'),
    ('まもなく月がでた','まもなくつきがでた'),
    ('私は歴史に弱い','わたしはれきしによわい'),
    ('ここへ看板を立てよう','ここへかんばんをたてよう'),
    ('お話の最中にすみません','おはなしのさいちゅうにすみません'),
    ('川べりをあるいてゆく','かわべりをあるいてゆく'),
    ('おもいっきりピヨピヨに混乱する','おもいっきりぴよぴよにこんらんする'),
    ('燃え尽き症候群','もえつきしょうこうぐん'),
    ('太りん坊なおぼっちゃま','ふとりんぼうなおぼっちゃま'),
    ('長袖長ズボン','ながそでながずぼん'),
    ('シュッ','しゅっ'),
    ('オートミールカレー','お-とみ-るかれ-'),
    ('猫が猫に猫じゃらし','ねこがねこにねこじゃらし'),
    ('主記憶装置','しゅきおくそうち'),
    ('軽くふらふらする','かるくふらふらする'),
    ('これを克服するには','これをこくふくするには'),
    ('最大瞬間風速','さいだいしゅんかんふうそく'),
    ('クイックフィックス','くいっくふぃっくす'),
    ('トラブルシューティングガイド','とらぶるしゅ-てぃんぐがいど'),
    ('ちょっとした好奇心','ちょっとしたこうきしん'),
    ('いいお湯を','いいおゆを'),
    ('はいよー','はいよ-'),
    ('しょっちゅうこける','しょっちゅうこける'),
    ('最大連続ミス入力数','さいだいれんぞくみすにゅうりょくすう'),
    ('クラウドコンピューティング','くらうどこんぴゅ-てぃんぐ'),
    ('しっちゃかめっちゃか','しっちゃかめっちゃか'),
    ('カフェインレスコーヒー','かふぇいんれすこ-ひ-'),
    ('ありがた迷惑','ありがためいわく'),
    ('明日は明日の風が吹く','あしたはあしたのかぜがふく'),
    ('牛乳はすぐ悪くなるのか','ぎゅうにゅうはすぐわるくなるのか');`;
  }
}
