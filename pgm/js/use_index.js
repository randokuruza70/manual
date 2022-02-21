/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2011/12/16 */

/**
 * file WCVWF903.js<br />
 *
 * @fileoverview このファイルには、索引リスト画面についての処理が<br />
 * 定義されています。<br />
 * file-> WCVWF903.js
 * @author 渡会
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/04/15|1.0.0   |渡会|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/04/15 渡会 ・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 索引リスト画面クラス
 * @namespace 索引リスト画面クラス
 */
Use.Index = {};
/**
 * 索引XMLのpath
 * @type string
 */
Use.Index.INITIAL_PATH = '';
/**
 * 索引XML内のxpath
 * @type string
 */
Use.Index.INITIAL_XPATH = '/tmc-service-sakuin-index/pub/index/parts';
/**
 * 頭文字UTF-8対比
 * @type object(連想配列)
 */
Use.Index.UTF8_LIST = {
  'ア':'E382A2',
  'イ':'E382A4',
  'ウ':'E382A6',
  'エ':'E382A8',
  'オ':'E382AA',
  'カ':'E382AB',
  'キ':'E382AD',
  'ク':'E382AF',
  'ケ':'E382B1',
  'コ':'E382B3',
  'サ':'E382B5',
  'シ':'E382B7',
  'ス':'E382B9',
  'セ':'E382BB',
  'ソ':'E382BD',
  'タ':'E382BF',
  'チ':'E38381',
  'ツ':'E38384',
  'テ':'E38386',
  'ト':'E38388',
  'ナ':'E3838A',
  'ニ':'E3838B',
  'ヌ':'E3838C',
  'ネ':'E3838D',
  'ノ':'E3838E',
  'ハ':'E3838F',
  'ヒ':'E38392',
  'フ':'E38395',
  'ヘ':'E38398',
  'ホ':'E3839B',
  'マ':'E3839E',
  'ミ':'E3839F',
  'ム':'E383A0',
  'メ':'E383A1',
  'モ':'E383A2',
  'ヤ':'E383A4',
  'ユ':'E383A6',
  'ヨ':'E383A8',
  'ラ':'E383A9',
  'リ':'E383AA',
  'ル':'E383AB',
  'レ':'E383AC',
  'ロ':'E383AD',
  'ワ':'E383AF',
  'ヲ':'E383B2',
  'ン':'E383B3',
  '漢字':'E6BCA2',
  'A':'41',
  'B':'42',
  'C':'43',
  'D':'44',
  'E':'45',
  'F':'46',
  'G':'47',
  'H':'48',
  'I':'49',
  'J':'4A',
  'K':'4B',
  'L':'4C',
  'M':'4D',
  'N':'4E',
  'O':'4F',
  'P':'50',
  'Q':'51',
  'R':'52',
  'S':'53',
  'T':'54',
  'U':'55',
  'V':'56',
  'W':'57',
  'X':'58',
  'Y':'59',
  'Z':'5A',
  '0':'30',
  '1':'31',
  '2':'32',
  '3':'33',
  '4':'34',
  '5':'35',
  '6':'36',
  '7':'37',
  '8':'38',
  '9':'39',
  'Ä':'C4',
  'Ö':'D6',
  'Ü':'DC',
  'ß':'DF',
  'ä':'E4',
  'ö':'F6',
  'ü':'FC',
  'À':'C0',
  'Â':'C2',
  'Æ':'C6',
  'Ç':'C7',
  'È':'C8',
  'É':'C9',
  'Ê':'CA',
  'Ë':'CB',
  'Î':'CE',
  'Ï':'CF',
  'Ô':'D4',
  'Ù':'D9',
  'Û':'DB',
  'à':'E0',
  'â':'E2',
  'æ':'E6',
  'ç':'E7',
  'è':'E8',
  'é':'E9',
  'ê':'EA',
  'ë':'EB',
  'î':'EE',
  'ï':'EF',
  'ô':'F4',
  'ù':'F9',
  'û':'FB',
  'Œ':'152',
  'œ':'153',
  'Á':'C1',
  'Í':'CD',
  'Ñ':'D1',
  'Ó':'D3',
  'Ú':'DA',
  'á':'E1',
  'í':'ED',
  'ñ':'F1',
  'ó':'F3',
  'ú':'FA'
};
/**
 * フェイスボックス
 * @private
 * @type Facebox
 */
Use.Index.myFaceBox = null;
/**
 * 処理終了時のコールバック関数
 * @private
 * @type function
 */
Use.Index.myCallback = null;
/**
 * 処理終了時にフォーカスを戻すエレメント
 * @private
 * @type element
 */
Use.Index.beforeFocus = null;
/**
 * 索引画面内情報
 * @private
 * @type object(連想配列)
 */
Use.Index.sakuinInfo = {
  'VLANG': '',
  'MLANG': '',
  'CURR_TAB': null,
  'CURR_INI': null,
  'CURR_ROW': null,
  'LMT_COUNT': 500,
  'LMT_PAGE': 100
};
/**
 * 索引画面内ページャ情報
 * @private
 * @type object(連想配列)
 */
Use.Index.rowInfo = {
  'MIN_COUNT': '',
  'MAX_COUNT': ''
};

/**
 * 利用共通索引クラスクラスの初期化処理
 * @param {Facebox} fbox フェイスボックスインスタンス
 * @param {function} output コールバック関数
 * @param {string} vlang 画面表示言語
 * @param {string} mlang マニュアル言語
 * @param {element} fcsElm 終了時のフォーカスエレメント
 */
Use.Index.$show = function(fbox, output, vlang, mlang, fcsElm) {
  var METHODNAME = 'Use.Index.$show';
  try {
    
    var innerStr = Use.Util.$getMessageWithLang('CONST_GLOBAL_INDEX', mlang);
    var funcName = Use.Util.$getMessage('CONST_INDEX_NAME');
    
    // 索引情報を初期化する
    Use.Index.myFaceBox = fbox;
    Use.Index.myCallback = output;
    Use.Index.sakuinInfo.VLANG = vlang;
    Use.Index.sakuinInfo.MLANG = mlang;
    Use.Index.beforeFocus = fcsElm;
    
    Use.Index.INITIAL_PATH = Use.Util.$getContentsPath(
      'C_INDEX_SAKUIN_INDEX_PATH', '', '', mlang);
    
    Use.Util.$revealFacebox(
      fbox, innerStr, '', false, funcName, true, '',
      Use.Index.$doClickCancelBtn
    );
    
    // イベント登録
    Use.Index.$observeElements();
    
    // 初期状態制御
    Use.Index.$setIndexState();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 索引画面内のイベント登録処理
 * @private
 */
Use.Index.$observeElements = function() {
  var METHODNAME = 'Use.Index.$InitialInit';
  try {
    
    /** @private */
    var setObserve = function(selector, func) {
      var root = $('fbx_index_search_contents');
      var els = Util.Selector.$select(selector, root);
      var len = els.length;
      // 該当要素すべてに対してイベントの付与を行う
      for(var i = 0; i < len; i++) {
        Use.Util.$observe(els[i], 'click', func);
      }
    }
    
    // タブ選択のイベント登録
    setObserve('ul#fbx_shift_initial a', Use.Index.$doClickTabLnk);
    
    // 頭文字のイベント登録
    setObserve('div.initial_list a', Use.Index.$doClickInitialLnk);
    
    // ページャアイコンのイベント登録
    Use.Util.$observe($('fbx_firstPageIcn'), 'click', Use.Index.$doChangePage);
    Use.Util.$observe($('fbx_prevPageIcn'), 'click', Use.Index.$doChangePage);
    Use.Util.$observe($('fbx_nextPageIcn'), 'click', Use.Index.$doChangePage);
    Use.Util.$observe($('fbx_lastPageIcn'), 'click', Use.Index.$doChangePage);
    
    // ボタンのイベント登録
    Use.Util.$observe($('fbx_okBtn'), 'click', Use.Index.$doClickOkBtn);
    Use.Util.$observe($('fbx_cancelBtn'), 'click',
      Use.Index.$doClickCancelBtn);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 索引画面内の初期状態制御処理
 * @private
 */
Use.Index.$setIndexState = function() {
  var METHODNAME = 'Use.Index.$setIndexState';
  try {
    
    /** @private */
    var setPagerAttr = function(target, msgKey) {
      var msg = Use.Util.$getMessage(msgKey);
      Util.$setAttrValue($(target).firstChild, 'alt', msg);
      Util.$setAttrValue($(target).firstChild, 'title', msg);
      Util.$setAttrValue($(target + '_g').firstChild, 'alt', msg);
      Util.$setAttrValue($(target + '_g').firstChild, 'title', msg);
    }
    
    // ページャアイコンを非活性化する
    Element.$addClassName($('fbx_firstPageIcn'), 'invisible');
    Element.$addClassName($('fbx_prevPageIcn'), 'invisible');
    Element.$addClassName($('fbx_nextPageIcn'), 'invisible');
    Element.$addClassName($('fbx_lastPageIcn'), 'invisible');
    
    // ページャアイコンの言語別設定
    setPagerAttr('fbx_firstPageIcn', 'CONST_INDEX_PAGER_FIRST');
    setPagerAttr('fbx_prevPageIcn', 'CONST_INDEX_PAGER_PREV');
    setPagerAttr('fbx_nextPageIcn', 'CONST_INDEX_PAGER_NEXT');
    setPagerAttr('fbx_lastPageIcn', 'CONST_INDEX_PAGER_LAST');
    
    // マニュアル言語が日本語の場合は全タブを表示する
    if(Use.Index.sakuinInfo.MLANG == 'ja') {
      Element.$addClassName($('fbx_katakana_list'), 'selected');
      Element.$addClassName($('fbx_alphanum_list'), 'invisible');
      Element.$removeClassName($('fbx_katakana_list'), 'invisible');
      Event.$fireEvent($('fbx_kanaLnk'), 'click');
    // マニュアル言語が日本語以外の場合はカタカナタブを非表示にする
    } else {
      Element.$addClassName($('fbx_katakana_list'), 'invisible');
      Element.$addClassName($('fbx_alphanum_list'), 'selected');
      Element.$removeClassName($('fbx_alphanum_list'), 'invisible');
      Element.$addClassName($('fbx_kanaLnk'), 'invisible');
      Event.$fireEvent($('fbx_alphaLnk'), 'click');
    }

    // キャンセルボタンにフォーカス設定する
    $('fbx_cancelBtn').focus();

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 品名指定決定(OKボタン押下時)
 */
Use.Index.$doClickOkBtn = function() {
  var METHODNAME = 'Use.Index.$doClickOkBtn';
  try {
    
    var sInfo = Use.Index.sakuinInfo;
    var errMsg = '';
    
    // 行選択が行われていない場合はエラー
    if(!sInfo.CURR_ROW) {
      errMsg = Use.Util.$getMessage('MVWF0035AAE');
      Use.Util.$alert(errMsg);
    // 行選択が行われている場合はコールバック関数に値を渡し、画面を閉じる
    } else {
      Use.Index.myCallback(sInfo.CURR_ROW);
      Use.Index.myFaceBox.close();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 品名指定キャンセル(キャンセルボタン押下時)
 */
Use.Index.$doClickCancelBtn = function() {
  var METHODNAME = 'Use.Index.$doClickCancelBtn';
  try {
    
    var htmlEle = $$('html')[0];
    var sInfo = Use.Index.sakuinInfo;
    
    sInfo.CURR_TAB = null;
    sInfo.CURR_INI = null;
    sInfo.CURR_ROW = null;
    Use.Index.myFaceBox.close();
    
    // 直前のフォーカス位置がある場合はフォーカスを戻す
    if(Use.Index.beforeFocus != undefined) {
      Use.Index.beforeFocus.focus();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * タブ選択(タブ選択時)
 * @param {Event} evt イベントオブジェクト
 */
Use.Index.$doClickTabLnk = function(evt) {
  var METHODNAME = 'Use.Index.$doClickTabLnk';
  try {
    
    var ele = Event.$element(evt);
    var sInfo = Use.Index.sakuinInfo;
    var rInfo = Use.Index.rowInfo;
    var list = {
      'fbx_kanaLnk':  $('fbx_katakana_list'),
      'fbx_alphaLnk': $('fbx_alphanum_list')
    };
    
    // 現在選択タブと押下タブが違う場合のみ処理
    if(sInfo.CURR_TAB != ele) {
      sInfo.CURR_ROW = null;
      $('fbx_index_list').innerHTML = '';
      $('fbx_index_list_count').innerHTML = '';
      
      // 現在選択タブがある場合は状態を戻す
      if(sInfo.CURR_TAB) {
        Element.$removeClassName(sInfo.CURR_TAB, 'selected');
        Element.$addClassName(list[sInfo.CURR_TAB.id], 'invisible');
        // 現在選択頭文字がある場合、選択頭文字を非選択状態にする。
        if(sInfo.CURR_INI) {
          Element.$removeClassName(sInfo.CURR_INI, 'selected');
          sInfo.CURR_INI = null;
        }
        
        rInfo.MIN_COUNT = 0;
        rInfo.MAX_COUNT = 0;
        
        Use.Index.$currPager();
      }
      
      // 現在選択タブを押下タブへ変更する
      sInfo.CURR_TAB = ele;
      
      // 押下タブの状態を選択状態にする
      Element.$addClassName(sInfo.CURR_TAB, 'selected');
      Element.$removeClassName(list[sInfo.CURR_TAB.id], 'invisible');
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 先頭文字選択(先頭文字リンククリック時)
 * @param {Event} evt イベントオブジェクト
 */
Use.Index.$doClickInitialLnk = function(evt) {
  var METHODNAME = 'Use.Index.$doClickInitialLnk';
  try {
    
    var ele = Event.$element(evt);
    var info = Use.Index.sakuinInfo;
    
    // 現在選択頭文字と押下頭文字が違う場合のみ処理
    if(info.CURR_INI != ele) {
      // 現在選択頭文字がある場合のみ処理
      if(info.CURR_INI) {
        // 索引情報を初期化する
        Element.$removeClassName(info.CURR_ROW, 'selected');
        info.CURR_ROW = null;
        $('fbx_index_list').innerHTML = '';
        
        // 現在選択頭文字の状態を戻す
        Element.$removeClassName(info.CURR_INI, 'selected');
      }
      
      // 現在選択頭文字を押下頭文字へ変更する
      info.CURR_INI = ele;
      
      // 押下頭文字の状態を選択状態にする
      Element.$addClassName(info.CURR_INI, 'selected');
      
      // 初期開始インデックスの指定
      Use.Index.rowInfo.MIN_COUNT = 0;
      
      // 対応するXMLより行の作成を行う
      Use.Index.$createRows();
      
      ele.focus();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 品名選択(品名行エンター押下時)
 * @param {Event} evt イベントオブジェクト
 */
Use.Index.$doKeyDownRowLnk = function(evt) {
  var METHODNAME = 'Use.Index.$doClickRowLnk';
  try {
    
    var ele = Event.$element(evt);
    var keyCode = Event.$getKeyCode(evt);
    
    // エンターキー押下の場合は品名選択処理
    if(keyCode == Event.KEY_RETURN) {
      Use.Index.$doClickRowLnk(evt);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 品名選択(品名行クリック時)
 * @param {Event} evt イベントオブジェクト
 */
Use.Index.$doClickRowLnk = function(evt) {
  var METHODNAME = 'Use.Index.$doClickRowLnk';
  try {
    
    var ele = Event.$element(evt);
    var info = Use.Index.sakuinInfo;
    
    // 行エレメントではない場合は親を指定する
    if(!Element.$hasClassName(ele, 'article')) {
      ele = ele.parentNode;
    }
    
    // 現在選択行と違う場合のみ処理
    if(info.CURR_ROW != ele) {
      // 現在選択行がある場合は現在選択行の選択を解除する
      if(info.CURR_ROW) {
        Element.$removeClassName(info.CURR_ROW, 'selected');
      }
      Element.$addClassName(ele, 'selected');
      info.CURR_ROW = ele;
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 索引リスト情報ページャ押下処理
 * @param {Event} evt イベントオブジェクト
 */
Use.Index.$doChangePage = function(evt) {
  var METHODNAME = 'Use.Index.$doChangePage';
  try {
    
    var ele = Event.$element(evt);
    var sInfo = Use.Index.sakuinInfo;
    var rInfo = Use.Index.rowInfo;
    var rate = 0;
    
    // 索引情報を初期化する
    Element.$removeClassName(sInfo.CURR_ROW, 'selected');
    sInfo.CURR_ROW = null;
    
    // 対象がAタグ以外の場合は上位層のAタグを見るように変更する
    if(ele.tagName.toLowerCase() != "a") {
      ele = ele.parentNode;
    }
    
    // イベントオブジェクトの発生元が「先頭へ」アイコンの場合
    if(ele.id == 'fbx_firstPageIcn') {
      rInfo.MIN_COUNT = 0;
    // イベントオブジェクトの発生元が「前へ」アイコンの場合
    } else if(ele.id == 'fbx_prevPageIcn') {
      rInfo.MIN_COUNT -= sInfo.LMT_PAGE;
    // イベントオブジェクトの発生元が「次へ」アイコンの場合
    } else if(ele.id == 'fbx_nextPageIcn') {
      rInfo.MIN_COUNT += sInfo.LMT_PAGE;
    // イベントオブジェクトの発生元が「末尾へ」アイコンの場合
    } else if(ele.id == 'fbx_lastPageIcn') {
      rate = rInfo.MAX_COUNT % sInfo.LMT_PAGE;
      // 余りが0以外の場合は上限から余りを引いた値を下限とし、
      // 0の場合は上限から1ページ辺りの最大値を引いた値を下限とする
      rInfo.MIN_COUNT = rate ?
        rInfo.MAX_COUNT - rate : rInfo.MAX_COUNT - sInfo.LMT_PAGE;
    }
    
    Use.Index.$createRows(ele.id);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 行作成処理
 * @private
 * @param {string} key ページャ時の対応ＩＤ
 */
Use.Index.$createRows = function(key) {
  var METHODNAME = 'Use.Index.$createRows';
  try {
    
    var info = Use.Index.sakuinInfo;
    var path = Use.Index.INITIAL_PATH;
    var after = Use.Index.UTF8_LIST[info.CURR_INI.innerHTML];
    var callback = Use.Index.$getIndexOnSuccess;
    
    path = path.replace('{0}', after);
    
    // キーの指定がある場合はコールバックにカーソル移動処理を追加する
    if(key != undefined) {
      callback = (function(id) {
        return function(res) {
          Use.Index.$getIndexOnSuccess(res);
          // 
          if(Element.$hasClassName($(id).parentNode, 'invisible')) {
            $(id + '_g').focus();
          } else {
            $(id).focus();
          }
        };
      })(key);
    }
    
    Use.Util.$request(
      path,
      false,
      callback,
      Use.Index.$getIndexOnFailure,
      true,
      true
    );
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * XML取得成功時の処理(sakuin_index.xml)
 * @param {response} res レスポンスオブジェクト
 */
Use.Index.$getIndexOnSuccess = function(res) {
  var METHODNAME = 'Use.Index.$getIndexOnSuccess';
  try {
    
    var sInfo = Use.Index.sakuinInfo;
    var rInfo = Use.Index.rowInfo;
    var target = $('fbx_index_list');
    var xPath = Use.Index.INITIAL_XPATH;
    var parts = null;
    var doc = res.responseXML;
    var len = 0;
    var idx = 0;
    var ele = null;
    var msg = null;
    
    /** @private */
    var createEle = function(num, part) {
      var getAtr = Util.$getAttrValue;
      var name = null;
      var article = document.createElement('div');
      var semiarticle = document.createElement('div');
      var paragraph = document.createElement('div');
      var articleCode = document.createElement('div');
      
      Element.$addClassName(articleCode, 'articlecode');
      Element.$addClassName(paragraph, 'paragraph');
      Element.$addClassName(semiarticle, 'semiarticle');
      Element.$addClassName(article, 'article');
      
      // 奇数の場合はcolor_row_set2を付与する
      if(num % 2) {
        Element.$addClassName(article, 'color_row_set2');
      // 偶数の場合はcolor_row_set1を付与する
      } else {
        Element.$addClassName(article, 'color_row_set1');
      }
      
      name = Util.$getSingleNode(part, './name');
      paragraph.innerHTML = Util.$getNodeText(name);
      articleCode.innerHTML = '';
      
      // p-typeが1(品名コード)の場合はidの表示を行う
      if(getAtr(part, 'p-type') == '1') {
        articleCode.innerHTML = Util.$getAttrValue(part, 'parts-id');
      }
      
      semiarticle.appendChild(paragraph);
      semiarticle.appendChild(articleCode);
      article.appendChild(semiarticle);
      
      return article;
    }
    
    target.innerHTML = '';
    
    // XML取得失敗時はgetIndexOnFailureへ
    if(!doc) {
      Use.Index.$getIndexOnFailure(res);
    }
    
    parts = Util.$getNodes(doc, xPath);
    len = parts.length;
    
    // 0件以上の場合のみ初期件数を設定し、そうでない場合はそのまま
    idx = idx <= rInfo.MIN_COUNT ? rInfo.MIN_COUNT : idx;
    // 最大件数を上回っている場合は最大件数を設定し、そうでない場合はそのまま
    len = len > sInfo.LMT_COUNT ? sInfo.LMT_COUNT : len;
    
    rInfo.MAX_COUNT = len;

    // 開始インデックスが最大件数を超えた場合は0にする
    idx = idx >= rInfo.MAX_COUNT ? 0 : idx;

    if(rInfo.MAX_COUNT == 0) {
      msg = Use.Util.$getMessage('CONST_INDEX_EMPTY_COUNT');
    } else {
      msg = Use.Util.$getMessage('CONST_INDEX_COUNT');
    }
    
    // 1ページ辺りの最大件数を上回っている場合は+100件を設定する
    len = (idx + sInfo.LMT_PAGE) < len ? (idx + sInfo.LMT_PAGE) : len;
    
    msg = msg.replace('{0}', rInfo.MAX_COUNT);
    msg = msg.replace('{1}', idx + 1);
    msg = msg.replace('{2}', len);
    $('fbx_index_list_count').innerHTML = msg;
    
    // XML内のparts要素分だけループ処理
    for(var i = idx; i < len; i++) {
      ele = createEle(i, parts[i]);
      ele.tabIndex = "1009";
      
      
      target.appendChild(ele);
      
      Use.Util.$observe(ele, 'click', Use.Index.$doClickRowLnk);
      Use.Util.$observe(ele, 'keydown', Use.Index.$doKeyDownRowLnk);
      
      // カウンタが初回の場合はカーソルを当てる
      if(i == idx) {
        ele.focus();
      }
    }
    
    // 情報の更新
    rInfo.MIN_COUNT = idx;
    
    Use.Index.$currPager();
    
    doc = null;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * XML取得失敗時の処理(sakuin_index.xml)
 * @param {response} res レスポンスオブジェクト
 */
Use.Index.$getIndexOnFailure = function(res) {
  var METHODNAME = 'Use.Index.$getIndexOnFailure';
  try {
    
    var sInfo = Use.Index.sakuinInfo;
    var rInfo = Use.Index.rowInfo;
    var target = $('fbx_index_list');
    var showMsg = Use.Util.$getMessage('CONST_INDEX_EMPTY_COUNT');
    
    target.innerHTML = '';
    
    showMsg = showMsg.replace('{0}', 0);
    $('fbx_index_list_count').innerHTML = showMsg;
    $('fbx_index_list').innerHTML = '';
    
    rInfo.MIN_COUNT = 0;
    rInfo.MAX_COUNT = 0;
    Use.Index.$currPager();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ページャの状態制御処理
 * @private
 */
Use.Index.$currPager = function() {
  var METHODNAME = 'Use.Index.$currPager';
  try {
    
    var sInfo = Use.Index.sakuinInfo;
    var rInfo = Use.Index.rowInfo;
    /** @private */
    var setAct = function() {
      var els = Array.prototype.slice.call(arguments, 0);
      var len = els.length;
      var showElm = null;
      var hideElm = null;
      
      // 引数の数だけループ処理し、それぞれ活性にする
      for(var i = 0; i < len; i++) {
        showElm = $(els[i]).parentNode;
        hideElm = $(els[i] + '_g').parentNode;
        Element.$addClassName(hideElm, 'invisible');
        Element.$removeClassName(showElm, 'invisible');
      }
    }
    /** @private */
    var setInAct = function() {
      var els = Array.prototype.slice.call(arguments, 0);
      var len = els.length;
      var showElm = null;
      var hideElm = null;
      
      // 引数の数だけループ処理し、それぞれ非活性にする
      for(var i = 0; i < len; i++) {
        showElm = $(els[i]).parentNode;
        hideElm = $(els[i] + '_g').parentNode;
        Element.$addClassName(showElm, 'invisible');
        Element.$removeClassName(hideElm, 'invisible');
      }
    }
    
    // 前ページが無い場合は「先頭へ」「前へ」を非活性にする
    if((rInfo.MIN_COUNT - sInfo.LMT_PAGE) < 0) {
      setInAct('fbx_firstPageIcn', 'fbx_prevPageIcn');
    // 前ページがある場合は「先頭へ」「次へ」を活性にする
    } else {
      setAct('fbx_firstPageIcn', 'fbx_prevPageIcn');
    }
    
    // 次ページが無い場合は「末尾へ」「次へ」を非活性にする
    if((rInfo.MIN_COUNT + sInfo.LMT_PAGE) >= rInfo.MAX_COUNT) {
      setInAct('fbx_nextPageIcn', 'fbx_lastPageIcn');
    // 次ページがある場合は「末尾へ」「次へ」を活性にする
    } else {
      setAct('fbx_nextPageIcn', 'fbx_lastPageIcn');
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}
