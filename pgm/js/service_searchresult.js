/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2012/10/24 */

/**
 * file service_searchresult.js<br />
 * 
 * @fileoverview このファイルには、検索結果の関数が定義されています。<br />
 * file-> service_searchresult.js
 * @author 渡会
 * @version 1.0.0
 * 
 * History(date|version|name|desc)<br />
 * 2011/08/28|1.0.0|渡会|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/08/28 1.0.0 渡会 ・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 検索結果
 * @class 検索結果クラス
 */
Service.SearchResult = function() {
  var METHODNAME = "Service.SearchResult";
  try {
    
    this.searchType = "";
    this.globalInfo = null;
    this.showManuals = [];
    this.isShowProps = {
      "repair" : false,
      "ncf"    : false,
      "ewd"    : false,
      "brm"    : false,
      "om"     : false,
      "dm"     : false,
      "erg"    : false,
      "wel"    : false,
      "res"    : false
    };
    this.showCntProps = {
      "repair" : 0,
      "ncf"    : 0,
      "ewd"    : 0,
      "brm"    : 0,
      "om"     : 0,
      "dm"     : 0,
      "erg"    : 0,
      "wel"    : 0,
      "res"    : 0
    };
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};
/**
 * Service.SearchResult自身
 * @type Service.SearchResult
 */
Service.SearchResult.own = new Service.SearchResult();
/**
 * 応答値テンプレート
 * @type object(連想配列)
 */
Service.SearchResult.MANUAL_INFO_TEMP = {
  "id"           : "",
  "position"     : 0,
  "number"       : 0,
  "cnt"          : 0,
  "contents"     : [],
  "manualName" : 0
};
/**
 * パブ種別区分→マニュアル名称
 * @type object(連想配列)
 */
Service.SearchResult.PUBTYPE_TO_NAME = {
  "0" : "repair",
  "1" : "ncf",
  "2" : "ewd",
  "3" : "brm",
  "4" : "om",
  "5" : "dm",
  "6" : "erg",
  "7" : "wel",
  "8" : "res"
};
/**
 * 検索結果リンクのタブインデックス
 * @type object(連想配列)
 */
Service.SearchResult.RESULTLINK_TABINDEX = {
  "0" : "22",
  "1" : "29",
  "2" : "36",
  "3" : "43"
};

/**
 * 検索キーワードの末尾
 * @type string
 */
Service.SearchResult.RESULT_COMMA = "...";
/**
 * 新規Window表示時のオプション定数
 * @type string
 */
Service.SearchResult.WINDOW_OPTION = "\
left=0,top=0,toolbar=no,menubar=no,\
directories=no,status=no,scrollbars=yes,resizable=yes";

/**
 * 検索結果画面クラスの初期化処理
 * @param {object(連想配列)} globalInfo グローバルインフォ
 */
Service.SearchResult.prototype.init = function(globalInfo) {
  var METHODNAME = "Service.SearchResult.prototype.init";
  try {
    
    var targets = globalInfo.SCH_OPT_DEF.split(",");
    var manualInfo = {};
    var len = targets.length;
    var name = "";
    
    this.globalInfo = globalInfo;
    
    this.doClearShowState();
    
    // 検索オプションデフォルト値がある場合のみ処理
    if(globalInfo.SCH_OPT_DEF != "") {
      // コンテンツ種別の数だけ表示処理を行う
      for(var i = 0; i < len; i++) {
        Util.$propcopy(Service.SearchResult.MANUAL_INFO_TEMP, manualInfo);
        manualInfo.id = DictConst.C_SERVICE_MANUAL_TYPE[targets[i]];
        name = Service.SearchResult.PUBTYPE_TO_NAME[manualInfo.id];
        
        this.showManuals.push(name);
        this.showManual(manualInfo, false);
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 検索結果表示
 * @param {object(連想配列)} globalInfo 共通情報
 * @param {string} mode 処理区分
 * @param {string} linkKey リンクキー
 * @param {response} res レスポンスオブジェクト
 */
Service.SearchResult.prototype.show = function(
  globalInfo, mode, linkKey, res) {
  var METHODNAME = "Service.SearchResult.prototype.show";
  try {
    
    this.globalInfo = globalInfo;
    
    Element.$removeClassName($("tab_body_search_result"), "invisible");
    
    // 結果がない場合、タブ遷移のみされていると判断
    if(res != null) {
      // 検索区分の保持
      this.searchType = this.globalInfo.SEARCH_TYPE;
      
      // 簡易検索の場合
      if(this.searchType == Service.SEARCH_MODE.SIMPLE) {
        this.setSimpleResults(res);
      // 横串検索の場合
      } else if(this.searchType == Service.SEARCH_MODE.YOKOGUSI) {
        this.setYokogushiResults(res);
      }
    }
    
    Util.$enableWindow();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 簡易検索結果の処理
 * @private
 * @param {response} res レスポンスオブジェクト
 */
Service.SearchResult.prototype.setSimpleResults = function(res) {
  var METHODNAME = "Service.SearchResult.prototype.setSimpleResults";
  try {
    
    var len = 0;
    var len2 = 0;
    var targetManuals = [];
    var manualInfo = {};
    var isShow = false;
    var checkRes = {};
    var currKey  = "";
    
    // 簡易検索結果のステータスチェックを行う
    checkRes = this.checkSimpleResultStatus(res);
    
    // 画面作成を行う場合は作成する
    if(checkRes.isCreate) {
      this.doResetManuals();
      
      $("search_result_body").scrollTop = 0;
      
      targetManuals = Service.globalInfo.SCH_OPT_DEF.split(",");
      len = targetManuals.length;
      len2 = res.manual.length;
      
      // 表示マニュアル分ループする
      for(var i = 0; i < len; i++) {
        Util.$propcopy(Service.SearchResult.MANUAL_INFO_TEMP, manualInfo);
        
        
        manualInfo.id = DictConst.C_SERVICE_MANUAL_TYPE[targetManuals[i]];
        manualInfo.manualName = "";
        for(var j = 0; j < len2; j++) {
          // マニュアル用キーを生成する("0"→"RM"→"00")
          currKey = DictConst.C_PUB_TYPE_CONVERTER[res.manual[j].id];
          currKey = DictConst.C_PUB_TYPE_CONVERTER[currKey];
          if(targetManuals[i] == currKey) {
            manualInfo.cnt = res.manual[i].cnt;
            manualInfo.number = res.manual[i].number;
            manualInfo.position = res.manual[i].position;
            manualInfo.contents = res.manual[i].contents;
            break;
          }
        }
        
        // 総数が0件以上有り、既に展開しているマニュアルが無い場合は展開
        if(!isShow && manualInfo.cnt > 0) {
          this.showManual(manualInfo, true);
          isShow = true;
        // 総数が0件か、既に展開しているマニュアルがある場合は縮小状態で表示
        } else {
          this.showManual(manualInfo, false);
        }
      }
      
      // 表示文字列がある場合は表示する
      if(res.keyword != "") {
        this.setKeywordTxt(res.keyword);
      }
    }
    
    // メッセージ表示を行う場合は表示する
    if(checkRes.message != "") {
      Use.Util.$delay(
          (function(msg) {
            return function() {
              Use.Util.$alert(msg);
            }
          })(checkRes.message)
          , 0.1
      );
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 横串検索結果の処理
 * @private
 * @param {response} res レスポンスオブジェクト
 */
Service.SearchResult.prototype.setYokogushiResults = function(res) {
  var METHODNAME = "Service.SearchResult.prototype.setYokogushiResults";
  try {
    
    var len = 0;
    var manualInfo = {};
    var isShow = false;
    var checkRes = {};
    
    // 検索結果のステータスチェックを行う
    checkRes = this.checkResultStatus(res);
    
    // 画面作成を行う場合は作成する
    if(checkRes.isCreate) {
      this.doResetManuals();
      
      $("search_result_body").scrollTop = 0;
      
      len = res.manual.length;
      
      // 表示マニュアル分ループする
      for(var i = 0; i < len; i++) {
        Util.$propcopy(Service.SearchResult.MANUAL_INFO_TEMP, manualInfo);
        
        manualInfo.id = res.manual[i].id;
        manualInfo.cnt = res.manual[i].cnt;
        manualInfo.number = res.manual[i].number;
        manualInfo.position = res.manual[i].position;
        manualInfo.contents = res.manual[i].contents;
        manualInfo.manualName = 0;
        
        // 総数が0件以上有り、既に展開しているマニュアルが無い場合は展開
        if(!isShow && manualInfo.cnt > 0) {
          this.showManual(manualInfo, true);
          isShow = true;
        // 
        } else {
          this.showManual(manualInfo, false);
        }
      }
      
      // 表示文字列がある場合は表示する
      if(res.keyword != "") {
        this.setKeywordTxt(res.keyword);
      }
    }
    
    // メッセージ表示を行う場合は表示する
    if(checkRes.message != "") {
      Use.Util.$delay(
          (function(msg) {
            return function() {
              Use.Util.$alert(msg);
            }
          })(checkRes.message)
          , 0.1
      );
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 応答値チェック処理
 * @private
 * @param {response} res レスポンスオブジェクト
 */
Service.SearchResult.prototype.checkResultStatus = function(res) {
  var METHODNAME = "Service.SearchResult.prototype.checkResultStatus";
  try {
    
    var checkStatus = res.status;
    var message = "";
    var elmName = Use.Util.$getMessage("CONST_SERVICE_KEYWORD_NAME");
    var repHelp = Use.Util.$getMessage("CONST_TOP_SEARCH_VCHECK_ERROR");
    var returnObj = {
      "message" : "",
      "isCreate" : false
    };
    
    // 続行不能エラーの場合
    if(checkStatus == "1") {
      // 後続処理での表示文字列は有り、画面作成は行わない
      returnObj.message = Use.Util.$getMessage("MVWF0036DEE");
      returnObj.isCreate = false;
      
    // 検索されなかった場合（すべて0件、未検索）
    } else if(checkStatus == "2") {
      // 後続処理での表示文字列は無し、画面作成は行わない
      returnObj.message = "";
      returnObj.isCreate = false;
      
      // 検索キーワードの必須チェックでエラーの場合の処理
      if(res.messageid == "MVWF1001AAE") {
        message = Use.Util.$getMessage(res.messageid, elmName);
        Use.Util.$alert(message, $("keywordTxt"));
      // 検索キーワードの最大桁数チェックでエラーの場合の処理
      } else if(res.messageid == "MVWF0005AAE") {
        message = Use.Util.$getMessage(res.messageid);
        Use.Util.$alert(message, $("keywordTxt"));
      // 検索キーワードの最大単語数チェックでエラーの場合の処理
      } else if(res.messageid == "MVWF0007AAE") {
        message = Use.Util.$getMessage(res.messageid);
        Use.Util.$alert(message, $("keywordTxt"));
      // 検索キーワードの属性チェックでエラーの場合の処理
      } else if(res.messageid == "MVWF0009AAE") {
        message = Use.Util.$getMessage(res.messageid, repHelp);
        Use.Util.$alert(message, $("keywordTxt"));
      // それ以外のエラーメッセージIDの場合
      } else {
        // 後続処理での表示文字列は有り、ただし、画面作成は行う
        returnObj.message = Use.Util.$getMessage(res.messageid);
        returnObj.isCreate = true;
      }
    // 500件超のマニュアルが存在する場合
    } else if(checkStatus == "3") {
      // 後続処理での表示文字列は有り、ただし、画面作成は行う
      returnObj.message = Use.Util.$getMessage(res.messageid);
      returnObj.isCreate = true;
    // 成功の場合
    } else {
      // 後続処理での表示文字列は無し、画面作成は行う
      returnObj.message = "";
      returnObj.isCreate = true;
    }
    
    return returnObj;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 応答値チェック処理(簡易検索用)
 * @private
 * @param {response} res レスポンスオブジェクト
 */
Service.SearchResult.prototype.checkSimpleResultStatus = function(res) {
  var METHODNAME = "Service.SearchResult.prototype.checkSimpleResultStatus";
  try {
    
    var checkStatus = res.status;
    var message = "";
    var returnObj = {
      "message" : "",
      "isCreate" : false
    };
    var len = 0;
    
    var isEmpty = true;
    var isLimit = false;
    
    // 続行不能エラーの場合
    if(checkStatus == "1") {
      // 後続処理での表示文字列は有り、画面作成は行わない
      returnObj.message = Use.Util.$getMessage("MVWF0036DEE");
      returnObj.isCreate = false;
      
    // 処理続行の場合
    } else {
      len = res.manual.length;
      
      // マニュアル分ループする
      for(var i = 0; i < len; i++) {
        // 表示対象レコードが５００件を超える場合は検索上限フラグを設定
        if(res.manual[i].cnt > 500) {
          isLimit = true;
          isEmpty = false;
        // 表示対象レコードが１件でもある場合は検索失敗フラグを外す
        } else if(res.manual[i].cnt > 0) {
          isEmpty = false;
        }
      }
      
      // 検索失敗フラグがtrueの場合、全て0件と判断する
      if(isEmpty) {
        message = Use.Util.$getMessage("MVWF0028AAE");
      // 検索上限フラグがtrueの場合、５００件超えのマニュアルがあると判断する
      } else if(isLimit) {
        message = Use.Util.$getMessage("MVWF0032AAE");
      }
      
      returnObj.message = message;
      returnObj.isCreate = true;
    }
    
    return returnObj;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * キーワード文字列の設定処理
 * @private
 * @param {string} keywordTxt 検索キーワード表示文字列
 */
Service.SearchResult.prototype.setKeywordTxt = function(keywordTxt) {
  var METHODNAME = "Service.SearchResult.prototype.setKeywordTxt";
  try {
    
    var keywordMaxLen = Use.Util.$getMessage("CONST_RESULT_KEYWORD_LEN");
    var keywordTemp = Use.Util.$getMessage("CONST_RESULT_KEYWORD");
    var limitLength = parseInt(keywordMaxLen, 10);
    var displayStr = keywordTxt;
    
    // 修理書へのリンクフラグを判定し、検索結果ラベルの表示内容を決定
    if(Service.globalInfo.RM_LINK_FLAG != DictConst.C_SERVICE_SIMPLE_RMSEARCH) {
      // 検索ボタンの場合
      // 表示上限文字数を指定文字列が上回る場合、表示文字列を整形する
      if(displayStr.length > limitLength) {
        displayStr = displayStr.substring(0, limitLength);
        displayStr = displayStr + Service.SearchResult.RESULT_COMMA;
      }
      
      displayStr = keywordTemp.replace("{keyword}", displayStr);
    } else {
      // 修理書へのリンクの場合
      displayStr = "";
      Field.$setValue($("keyword"), Use.Util.$getMessage("CONST_DEFKEYROWD"));
      Element.$addClassName($("keyword"), DictConst.C_STYLE_CLASS_PLACE_HOLDER);
    }
    
    Util.$setNodeText($("search_result_label"), displayStr);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * マニュアル表示処理
 * @private
 * @param {object(連想配列)} manualInfo マニュアル内情報
 * @param {boolean} isExpand 展開フラグ(true : 展開、false : 折りたたみ)
 */
Service.SearchResult.prototype.showManual = function(manualInfo, isExpand) {
  var METHODNAME = "Service.SearchResult.prototype.showManual";
  try {
    
    var suffix = "_result";
    var myInfo = {};
    var target = null;
    
    Util.$propcopy(manualInfo, myInfo);
    myInfo.manualName = Service.SearchResult.PUBTYPE_TO_NAME[myInfo.id];
    
    // 表示対象マニュアルの場合のみ処理を行う
    if(Util.$getIndexOfArray(this.showManuals, myInfo.manualName) != -1) {
      // 総件数が500件を超える場合、500件へ変更する
      if(myInfo.cnt > 500) {
        myInfo.cnt = 500;
      }
      
      // ラベル項目の更新処理
      this.showResultStatus(myInfo, true);
      
      // コンテンツリストの表示処理
      this.showResultBlock(myInfo, isExpand);
      
      // ページャ制御
      this.doChangePager(myInfo, isExpand);
      
      // イベント登録
      target = Util.Selector.$select(
        "div.table_expander", $(myInfo.manualName + suffix))[0];
      Event.$stopObserving(target);
      Use.Util.$observe(target, "click", (function(own, info) {
        return function(evt) {
          var elm = Event.$element(evt);
          var myInfo = {};
          Util.$propcopy(info, myInfo);
          own.doBeforeClickSwitchLnk(elm, myInfo);
        }
      })(this, myInfo));
      Use.Util.$observe(target, "keydown", (function(own, info) {
        return function(evt) {
          var keyCode = Event.$getKeyCode(evt);
          // エンターキーの場合のみ実行
          if(keyCode == Event.KEY_RETURN) {
            var elm = Event.$element(evt);
            var myInfo = {};
            Util.$propcopy(info, myInfo);
            own.doBeforeClickSwitchLnk(elm, myInfo);
          }
        }
      })(this, myInfo));
      
      target = Util.Selector.$select(
        "div.table_title a", $(myInfo.manualName + suffix))[0];
      Event.$stopObserving(target);
      Use.Util.$observe(target, "click", (function(own, info) {
        return function(evt) {
          var elm = Event.$element(evt);
          var myInfo = {};
          Util.$propcopy(info, myInfo);
          own.doBeforeClickSwitchLnk(elm.parentNode, myInfo);
        }
      })(this, myInfo));
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 状態表示部分の加工処理
 * @private
 * @param {object(連想配列)} manualInfo マニュアル内情報
 * @param {boolean} isShow 表示フラグ(true : 表示、false : 非表示)
 */
Service.SearchResult.prototype.showResultStatus = function(
  manualInfo, isShow) {
  var METHODNAME = "Service.SearchResult.prototype.showResultStatus";
  try {
    
    var prefix = "label_";
    var target = $(prefix + manualInfo.manualName);
    
    // trueの場合は表示する
    if(isShow) {
      Element.$removeClassName(target, "invisible");
    // falseの場合は非表示にする
    } else {
      Element.$addClassName(target, "invisible");
    }
    
    // 検索結果が1件以上ある場合は青くする
    if(manualInfo.cnt > 0) {
      Element.$removeClassName(target, "manual_noexist");
      Element.$addClassName(target, "manual_exists");
    // 検索結果が0件の場合は青色を削除する
    } else {
      Element.$removeClassName(target, "manual_exists");
      Element.$addClassName(target, "manual_noexist");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * マニュアル名加工処理
 * @private
 * @param {object(連想配列)} manualInfo マニュアル内情報
 * @param {boolean} isExpand 展開フラグ(true : 展開、false : 折りたたみ)
 */
Service.SearchResult.prototype.showResultBlock = function(
  manualInfo, isExpand) {
  var METHODNAME = "Service.SearchResult.prototype.showResultBlock";
  try {
    
    var suffix = "_result";
    var target = $(manualInfo.manualName + suffix);
    var title  = Util.Selector.$select("div.table_title a", target)[0];
    var expandIcn = Util.Selector.$select("div.table_expander", target)[0];
    var message = "";
    
    Element.$removeClassName(target, "invisible");
    
    // 検索結果が1件以上ある場合は下線を付与する
    if(parseInt(manualInfo.cnt, 10) > 0) {
      // 展開済みフラグがtrueの場合は件数を登録する
      if(isExpand) {
        this.setTableCount(target, manualInfo);
      }
      
      Element.$removeClassName(title, "manual_noexist");
      Element.$addClassName(title, "manual_exists");
      
      Element.$removeClassName(expandIcn, "manual_noexist");
      Element.$addClassName(expandIcn, "manual_exists");
      
      this.doCreateList(manualInfo, isExpand);
      this.isShowProps[manualInfo.manualName] = isExpand;
      this.showCntProps[manualInfo.manualName] = manualInfo.cnt;
      
    // 検索結果が0件の場合は下線を外す
    } else {
      this.setTableCount(target);
      
      Element.$removeClassName(title, "manual_exists");
      Element.$addClassName(title, "manual_noexist");
      
      Element.$removeClassName(expandIcn, "manual_exists");
      Element.$addClassName(expandIcn, "manual_noexist");
      
      this.doCreateList(manualInfo, false);
      this.isShowProps[manualInfo.manualName] = isExpand;
      this.showCntProps[manualInfo.manualName] = 0;
    }
    
    title.innerHTML = this.getBlockTitle(manualInfo.id, manualInfo.cnt)
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 表内件数文字列の設定処理
 * @private
 * @param {element} root ルートオブジェクト
 * @param {object(連想配列)} info マニュアル情報
 */
Service.SearchResult.prototype.setTableCount = function(root, info) {
  var METHODNAME = "Service.SearchResult.prototype.setTableCount";
  try {
    
    var count  = Util.Selector.$select("div.table_count", root)[0];
    var myInfo = {};
    var message = "";
    
    var pos = 0;
    var num = 0;
    
    // マニュアル情報がある場合のみ処理を行う
    if(info != undefined) {
      Util.$propcopy(info, myInfo);
      
      pos = parseInt(myInfo.position, 10);
      num = parseInt(myInfo.number, 10);
      
      message = Use.Util.$getMessage("CONST_RESULT_NUMBER");
      message = message.replace("{all}", myInfo.cnt);
      message = message.replace("{min}", myInfo.position);
      message = message.replace("{max}", (pos + num - 1).toString());
      count.innerHTML = message;
      Element.$removeClassName(count, "invisible");
      
    // ない場合は非表示にする
    } else {
      count.innerHTML = message;
      Element.$addClassName(count, "invisible");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ページャ制御処理
 * @private
 * @param {object(連想配列)} manualInfo マニュアル内情報
 * @param {boolean} isExpand 展開フラグ(true : 展開、false : 折りたたみ)
 */
Service.SearchResult.prototype.doChangePager = function(manualInfo, isExpand) {
  var METHODNAME = "Service.SearchResult.prototype.doChangePager";
  try {
    
    var suffix = "_list_pager";
    var rootElm = $(manualInfo.manualName + suffix);
    var tabRoot = rootElm.parentNode.parentNode;
    
    var fstSuf = "_pager_first";
    var prvSuf = "_pager_prev";
    var nxtSuf = "_pager_next";
    var lstSuf = "_pager_last";
    
    var showLen = Util.Selector.$select("table tr", tabRoot).length;
    
    var pos = parseInt(manualInfo.position, 10);
    var cnt = parseInt(manualInfo.cnt, 10);
    
    var isPrev = false;
    var isNext = false;
    
    var changeState = function(key, isDisable) {
      var target = manualInfo.manualName + key;
      var elmDis = $(target).parentNode;
      var elmEna = $(target + "_g").parentNode;
      // Disable(有効)にする
      if(isDisable) {
        Element.$removeClassName(elmDis, "invisible");
        Element.$addClassName(elmEna, "invisible");
      // Enable(無効)にする
      } else {
        Element.$addClassName(elmDis, "invisible");
        Element.$removeClassName(elmEna, "invisible");
      }
    };
    
    // 20件を上回る場合のみ判定する
    if(cnt > 20) {
      isPrev = (pos > 20);
      isNext = ((pos + showLen - 1) < cnt);
    }
    
    // 展開済みフラグがtrueの場合のみ活性・非活性制御を行う
    if(isExpand) {
      targets = Util.Selector.$select("ul li img", rootElm);
      
      // パターン1の場合は現在位置が20件以下なので、first・prevを無効化
      changeState(fstSuf, isPrev);
      changeState(prvSuf, isPrev);
      
      // パターン2の場合は現在位置 + 表示件数が最大件数以下の場合
      changeState(nxtSuf, isNext);
      changeState(lstSuf, isNext);
      
      Element.$removeClassName(rootElm, "invisible");
      
    // 展開済みフラグがfalseの場合は非表示にする
    } else {
      Element.$addClassName(rootElm, "invisible");
    }
    
    // イベントの削除
    Event.$stopObserving($(manualInfo.manualName + fstSuf));
    Event.$stopObserving($(manualInfo.manualName + prvSuf));
    Event.$stopObserving($(manualInfo.manualName + nxtSuf));
    Event.$stopObserving($(manualInfo.manualName + lstSuf));
    
    // イベント登録
    Use.Util.$observe($(manualInfo.manualName + fstSuf), "click",
      (function(mInfo, own) {
        return function(evt) { own.doBeforeChangePage(evt, mInfo, own) };
      })(manualInfo, this));
    Use.Util.$observe($(manualInfo.manualName + prvSuf), "click",
      (function(mInfo, own) {
        return function(evt) { own.doBeforeChangePage(evt, mInfo, own) };
      })(manualInfo, this));
    Use.Util.$observe($(manualInfo.manualName + nxtSuf), "click",
      (function(mInfo, own) {
        return function(evt) { own.doBeforeChangePage(evt, mInfo, own) };
      })(manualInfo, this));
    Use.Util.$observe($(manualInfo.manualName + lstSuf), "click",
      (function(mInfo, own) {
        return function(evt) { own.doBeforeChangePage(evt, mInfo, own) };
      })(manualInfo, this));
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * リスト制御処理
 * @private
 * @param {object(連想配列)} manualInfo マニュアル内情報
 * @param {boolean} isExpand 展開フラグ(true : 展開、false : 折りたたみ)
 */
Service.SearchResult.prototype.doCreateList = function(manualInfo, isExpand) {
  var METHODNAME = "Service.SearchResult.prototype.doCreateList";
  try {
    
    var listSuf  = "_list";
    var listRoot = $(manualInfo.manualName + listSuf);
    var listElm  = Util.Selector.$select("table.result tbody", listRoot)[0];
    
    var expSuf  = "_result";
    var expRoot = $(manualInfo.manualName + expSuf);
    var expElm  = Util.Selector.$select("div.table_expander", expRoot)[0];
    
    // マニュアル毎のリンクに該当するタブインデックス
    var tabIdx = Service.SearchResult.RESULTLINK_TABINDEX[manualInfo.id];
    
    var currRow = {};
    var disptitle = null;
    
    var trElm = null;
    var tdElm = null;
    var ancElm = null;
    
    var len = manualInfo.contents.length;
    
    // 行数分ループし、作成・付与する
    for(var i = 0; i < len; i++) {
      Util.$propcopy(manualInfo.contents[i], currRow);
      
      // 行の作成
      trElm = document.createElement("tr")
      
      // 項番の作成・設定処理
      tdElm = document.createElement("td");
      tdElm.innerHTML = currRow.id + ".";
      tdElm.className = "number";
      trElm.appendChild(tdElm);
      
      // 表示文字の作成・設定処理
      tdElm = document.createElement("td");
      
      ancElm = document.createElement("a");
      ancElm.href = "javascript:void(0);";
      
      // パブ種別区分が修理書、かつ、パラグラフカテゴリが"C"の場合
      if("0" == manualInfo.id && "C" == currRow.category) {
        // 表示文字列を2000バイトで省略する
        disptitle = Use.Util.$abbreviatDispTitle(currRow.disptitle, 2000);
      } else {
        disptitle = currRow.disptitle;
      }
      ancElm.innerHTML = disptitle;
      
      // マニュアル毎のリンクに該当するタブインデックスを追加
      Element.$writeAttribute(ancElm, "tabIndex", tabIdx);
      
      tdElm.appendChild(ancElm);
      tdElm.className = "result_manual";
      
      trElm.appendChild(tdElm);
      
      // 偶数の場合のクラス付与
      if((i + 1) % 2 != 0) {
        trElm.className = "color_row_set1";
      // 奇数の場合のクラス付与
      } else {
        trElm.className = "color_row_set2";
      }
      
      // リンククリックイベントの設定
      Use.Util.$observe(ancElm, "click",
        (function(own, id, type, linkKey, partsCd) {
          return function() {
            own.doClickResultLnk(type, id, linkKey, partsCd);
          }
        })(this, manualInfo.id, currRow.type, currRow.linkkey, currRow.parts)
      );
      
      listElm.appendChild(trElm);
    }
    
    // 展開フラグがtrueの場合はデータ部を展開表示し、アイコンを変更する
    if(isExpand) {
      Element.$removeClassName(expElm, "expander_icon_close");
      Element.$addClassName(expElm, "expander_icon_expanded");
      
      Element.$removeClassName(listRoot, "invisible");
      
    // 展開フラグがfalseの場合はデータ部は表示せず、アイコンを変更する
    } else {
      Element.$removeClassName(expElm, "expander_icon_expanded");
      Element.$addClassName(expElm, "expander_icon_close");
      
      Element.$addClassName(listRoot, "invisible");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * リンク押下処理
 * @param {string} type コンテンツ種別区分
 * @param {string} id パブ種別区分
 * @param {string} linkKey リンクキー
 * @param {string} partsCd 品名コード
 */
Service.SearchResult.prototype.doClickResultLnk = function(
    type, id, linkKey, partsCd) {
  var METHODNAME = "Service.SearchResult.prototype.doClickResultLnk";
  try {
    
    var oldTypeUrl = Use.Util.$getContentsPath(
      "C_SERVICE_SEARCH_RESULT_CONTENT_PATH_PREFIX");
    var optTemplate = Service.SearchResult.WINDOW_OPTION;
    var opt = Util.WINDOW_SIZE_2;
    var srvLogExt = ["RM", "NM", "EM"];
    var shortTabName = "";
    
    // コンテンツ種別区分が新構成の時のみタブ移動する
    if(type == "10") {
      Util.$disableWindow();
      
      Service.$callbackBridgingSearchResult(id, linkKey, partsCd, this.searchType);
      
    // それ以外は直接展開する
    } else {
      oldTypeUrl = oldTypeUrl + linkKey;
      shortTabName = DictConst.C_PUB_TYPE_CONVERTER[id];
      
      Util.$openUrl(oldTypeUrl, "_blank", optTemplate, opt);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * データ削除処理
 * @private
 * @param {object(連想配列)} manualInfo マニュアル内情報
 */
Service.SearchResult.prototype.doRemoveList = function(manualInfo) {
  var METHODNAME = "Service.SearchResult.prototype.doRemoveList";
  try {
    
    var redrawVar = null;
    var suffix = "_list";
    var rootElm = $(manualInfo.manualName + suffix);
    var target = Util.Selector.$select("table.result tbody", rootElm)[0];
    
    // 未完成のままDOM操作が終了するため、
    // 以下の処理を行いIE6でDOM操作を完了させた後に次の処理を行う
    redrawVar = Element.$getDimensions(target);
    
    // 対象の子要素全てを削除する
    while(target.firstChild) {
      target.removeChild(target.firstChild);
    }
    
    // 未完成のままDOM操作が終了するため、
    // 以下の処理を行いIE6でDOM操作を完了させた後に次の処理を行う
    redrawVar = Element.$getDimensions(target);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 件数表示文言の取得処理
 * @private
 * @param {string} id パブ種別区分
 * @param {string} count 件数
 */
Service.SearchResult.prototype.getBlockTitle = function(id, count) {
  var METHODNAME = "Service.SearchResult.prototype.getBlockTitle";
  try {
    
    var prefix = "CONST_RESULT_";
    var shortKey = DictConst.C_PUB_TYPE_CONVERTER[id];
    var message = Use.Util.$getMessage(prefix + shortKey);
    
    return message.replace("{result}", count.toString());
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ページャ押下処理
 * @param {Event} evt イベントオブジェクト
 * @param {object(連想配列)} manualInfo マニュアル内情報
 * @param {Service.SearchResult} own 検索結果インスタンス
 */
Service.SearchResult.prototype.doBeforeChangePage = function(
  evt, manualInfo, own) {
  var METHODNAME = "Service.SearchResult.prototype.doBeforeChangePage";
  try {
    
    var schOptVal = "";
    var schOptSelVal = [];
    var manuals = [];
    var elm = Event.$element(evt);
    var rate = 0;
    var myInfo = {};
    var nScrollTop = $("search_result_body").scrollTop;
    
    // イベントのエレメントがimgの場合、親要素のaタグのエレメントを取得する
    if(elm.tagName.toLowerCase() == "img") {
      elm = elm.parentNode;
    }
    
    Util.$propcopy(manualInfo, myInfo);
    
    // 「最初へ」アイコン押下の場合
    if(elm.id.indexOf("_pager_first") != -1) {
      myInfo.position = "1";
    // 「前へ」アイコン押下の場合
    } else if(elm.id.indexOf("_pager_prev") != -1) {
      myInfo.position = (parseInt(myInfo.position, 10) - 20).toString();
    // 「次へ」アイコン押下の場合
    } else if(elm.id.indexOf("_pager_next") != -1) {
      myInfo.position = (parseInt(myInfo.position, 10) + 20).toString();
    // 「最後へ」アイコン押下の場合
    } else if(elm.id.indexOf("_pager_last") != -1) {
      // 最大件数 / 表示最大件数の余りを計算
      rate = myInfo.cnt % 20;
      // 余りがある場合は最大件数から余りを引き、1を足す
      if(rate != 0) {
        myInfo.position = (myInfo.cnt - rate + 1).toString();
      // 余りが無い場合は最大件数から表示最大件数を引き、1を足す
      } else {
        myInfo.position = (myInfo.cnt - 20 + 1).toString();
      }
    }
    
    // 簡易検索処理
    if(own.searchType == "1") {
      // 検索オプション選択値を全て配列化
      schOptSelVal = this.globalInfo.SCH_OPT_RES;
      // 対象マニュアルを選択値より取得
      for(var i = 0; i < schOptSelVal.length; i++) {
        // 先頭1バイトが対象マニュアルと一致した場合は保持
        if(schOptSelVal[i].substring(0, 1) == myInfo.id) {
          manuals.push(schOptSelVal[i]);
        }
      }
      
      Service.SimpleSearch.$search(
        own.doAfterSimplePage.curry(own, myInfo, elm.id, nScrollTop),
        own.globalInfo.LANG_CODE,
        own.globalInfo.PUB_BIND_ID,
        own.globalInfo.FROM_DATE,
        manuals,
        own.globalInfo.CAR_TYPE,
        own.globalInfo.PARTS_CD,
        own.globalInfo.KEYWORD,
        myInfo.position,
        Service.SEARCH_COUNT,
        own.globalInfo.RM_LINK_FLAG
      );
    // 横串検索処理
    } else if(own.searchType == "3") {
      // パブ種別区分からタブ略称に変換("0"→"RM"など)
      schOptVal = DictConst.C_PUB_TYPE_CONVERTER[myInfo.id];
      // タブ略称から検索オプション値に変換("RM"→"00"など)
      schOptVal = DictConst.C_PUB_TYPE_CONVERTER[schOptVal];
      
      Service.YokogushiSearch.$search(
        own.doAfterYokogushiPage.curry(own, myInfo, elm.id, nScrollTop),
        own.globalInfo.LANG_CODE,
        own.globalInfo.PUB_BIND_ID,
        own.globalInfo.FROM_DATE,
        schOptVal,
        own.globalInfo.CAR_TYPE,
        own.globalInfo.PARTS_CD,
        own.globalInfo.KEYWORD,
        myInfo.position,
        Service.SEARCH_COUNT
      );
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ページャ押下処理 簡易検索用コールバック関数
 * @param {Service.SearchResult} own 検索結果インスタンス
 * @param {object(連想配列)} oldInfo ページャ押下前のマニュアル情報
 * @param {string} elmId ページャのエレメントID
 * @param {number} nScrollTop スクロール位置
 * @param {response} res レスポンスオブジェクト
 */
Service.SearchResult.prototype.doAfterSimplePage = function(
    own, oldInfo, elmId, nScrollTop, res) {
  var METHODNAME = "Service.SearchResult.prototype.doAfterSimplePage";
  try {
    
    var manualInfo = {};
    var message = "";
    var resultBlock = null;
    
    Util.$propcopy(res.manual[0], manualInfo);
    
    // 検索結果内にIDが無い場合、引数のIDを設定する
    if(manualInfo.id == "") {
      manualInfo.id = oldInfo.id;
    }
    
    // 結果が1の場合は続行不能エラーとする
    if(res.status == "1") {
      Use.Util.$alert(Use.Util.$getMessage("MVWF0036DEE"));
    // 結果が1以外の場合は処理をする
    } else {
      // リスト内要素を削除する
      own.doRemoveList(oldInfo);
      
      // 対象マニュアルの件数が0を上回る場合、展開状態で出力する
      if(manualInfo.cnt > 0) {
        own.showManual(manualInfo, true);
      // 対象マニュアルの件数が0件の場合、縮小状態で出力する
      } else {
        own.showManual(manualInfo, false);
      }
    }
    
    // ページャのエレメントIDがある場合
    if(elmId != "") {
      // 指定ﾍﾟｰｼﾞｬｱｲｺﾝの親要素が非表示の場合は非活性ｱｲｺﾝへｶｰｿﾙを当てる
      if(Element.$hasClassName($(elmId).parentNode, "invisible")) {
        $(elmId + "_g").focus();
      }
      // スクロール位置指定
      if(Util.$isUndefined(nScrollTop) == false && nScrollTop != null) {
        $("search_result_body").scrollTop = nScrollTop;
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ページャ押下処理 横串検索用コールバック関数
 * @param {Service.SearchResult} own 検索結果インスタンス
 * @param {object(連想配列)} oldInfo ページャ押下前のマニュアル情報
 * @param {string} elmId ページャのエレメントID
 * @param {number} nScrollTop スクロール位置
 * @param {response} res レスポンスオブジェクト
 */
Service.SearchResult.prototype.doAfterYokogushiPage = function(
    own, oldInfo, elmId, nScrollTop, res) {
  var METHODNAME = "Service.SearchResult.prototype.doAfterYokogushiPage";
  try {
    
    var manualInfo = {};
    var message = "";
    var resultBlock = null;
    
    Util.$propcopy(res.manual[0], manualInfo);
    
    // 検索結果内にIDが無い場合、引数のIDを設定する
    if(manualInfo.id == "") {
      manualInfo.id = oldInfo.id;
    }
    
    // 結果が1の場合は続行不能エラーとする
    if(res.status == "1") {
      Use.Util.$alert(Use.Util.$getMessage("MVWF0036DEE"));
    // 結果が1以外の場合は処理をする
    } else {
      // リスト内要素を削除する
      own.doRemoveList(oldInfo);
      
      // 対象マニュアルの件数が0を上回る場合、展開状態で出力する
      if(manualInfo.cnt > 0) {
        own.showManual(manualInfo, true);
      // 対象マニュアルの件数が0件の場合、縮小状態で出力する
      } else {
        own.showManual(manualInfo, false);
      }
    }
    
    // ページャのエレメントIDがある場合
    if(elmId != "") {
      // 指定ﾍﾟｰｼﾞｬｱｲｺﾝの親要素が非表示の場合は非活性ｱｲｺﾝへｶｰｿﾙを当てる
      if(Element.$hasClassName($(elmId).parentNode, "invisible")) {
        $(elmId + "_g").focus();
      }
      // スクロール位置指定
      if(Util.$isUndefined(nScrollTop) == false && nScrollTop != null) {
        $("search_result_body").scrollTop = nScrollTop;
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 展開／折りたたみ処理
 * @param {element} elm 対象のオブジェクト
 * @param {object(連想配列)} info マニュアル情報
 */
Service.SearchResult.prototype.doBeforeClickSwitchLnk = function(elm, info) {
  var METHODNAME = "Service.SearchResult.prototype.doBeforeClickSwitchLnk";
  try {
    
    var target = elm.parentNode.parentNode;
    var myInfo = {};
    var expElm = Util.Selector.$select("div.table_expander", target)[0];
    var isExpand = false;
    
    Util.$propcopy(info, myInfo, 10);
    
    // 展開・縮小の判断を行う
    if(Element.$hasClassName(expElm, "expander_icon_expanded")) {
      isExpand = false;
    } else {
      isExpand = true;
    }
    
    // 全文検索処理
    if(this.searchType == "2") {
      // 展開済みフラグがfalseの場合は検索結果を取得する
      if(!this.isShowProps[myInfo.manualName] &&
          this.showCntProps[myInfo.manualName] > 0) {
        // リスト内要素を削除する
        this.doRemoveList(myInfo);
        
        // パブ種別区分からタブ略称に変換("0"→"RM"など)
        schOptVal = DictConst.C_PUB_TYPE_CONVERTER[myInfo.id];
        // タブ略称から検索オプション値に変換("RM"→"00"など)
        schOptVal = DictConst.C_PUB_TYPE_CONVERTER[schOptVal];
        
        // 全文検索処理の実行
        Service.Search.$search(
          "005",
          this.doAfterChangePage.curry(this, myInfo.id, ""),
          DictConst.C_LANGUAGE_CONV[this.globalInfo.LANG_CODE],
          this.globalInfo.PUB_BIND_ID,
          this.globalInfo.FROM_DATE,
          [schOptVal],
          this.globalInfo.CAR_TYPE,
          this.globalInfo.PARTS_CD,
          this.globalInfo.KEYWORD,
          "1",
          Service.SEARCH_COUNT
        );
      } else {
        // 表示対象マニュアルのみ処理を行う
        if(Util.$getIndexOfArray(this.showManuals, myInfo.manualName) != -1) {
          // 表示済みマニュアルの件数が0を上回る場合のみ処理
          if(this.showCntProps[myInfo.manualName] > 0) {
            // 件数の設定
            this.setTableCount(target, myInfo);
            // ページャの制御
            this.doChangePager(myInfo, isExpand);
            // 展開・折りたたみアイコンの変更
            this.doChangeExpandIcon(target, myInfo);
            // データ部の変更
            this.doChangeListBody(target);
          }
        }
      }
      
    // 横串検索処理
    } else {
      // 表示対象マニュアルのみ処理を行う
      if(Util.$getIndexOfArray(this.showManuals, myInfo.manualName) != -1) {
        // 表示済みマニュアルの件数が0を上回る場合のみ処理
        if(this.showCntProps[myInfo.manualName] > 0) {
          // 件数の設定
          this.setTableCount(target, myInfo);
          // ページャの制御
          this.doChangePager(myInfo, isExpand);
          // 展開・折りたたみアイコンの変更
          this.doChangeExpandIcon(target, myInfo);
          // データ部の変更
          this.doChangeListBody(target);
        }
      }
    }
    
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * アイコンの変更処理
 * @private
 * @param {element} root 対象のルートオブジェクト
 * @param {object(連想配列)} info マニュアル情報
 */
Service.SearchResult.prototype.doChangeExpandIcon = function(root, info) {
  var METHODNAME = "Service.SearchResult.prototype.doChangeExpandIcon";
  try {
    
    var expandIcn = Util.Selector.$select("div.table_expander", root)[0];
    
    // アイコンが閉じている場合は表示する
    if(Element.$hasClassName(expandIcn, "expander_icon_close")) {
      Element.$removeClassName(expandIcn, "expander_icon_close");
      Element.$addClassName(expandIcn, "expander_icon_expanded");
      
    // アイコンが閉じている場合は表示する
    } else {
      Element.$addClassName(expandIcn, "expander_icon_close");
      Element.$removeClassName(expandIcn, "expander_icon_expanded");
      
    }
    
    // 件数が1件以上ある場合はカーソルを変更する
    if(info.cnt > 0) {
      Element.$removeClassName(expandIcn, "manual_noexist");
      Element.$addClassName(expandIcn, "manual_exists");
    } else {
      Element.$removeClassName(expandIcn, "manual_exists");
      Element.$addClassName(expandIcn, "manual_noexist");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * タイトル文言の変更処理
 * @private
 * @param {element} root 対象のルートオブジェクト
 */
Service.SearchResult.prototype.doChangeTitleDecoration = function(root) {
  var METHODNAME = "Service.SearchResult.prototype.doChangeExpandIcon";
  try {
    
    var tableTitle = Util.Selector.$select("div.table_title a", root)[0];
    
    // 
    if(Element.$hasClassName(tableTitle, "manual_exists")) {
      Element.$removeClassName(tableTitle, "manual_exists");
      Element.$addClassName(tableTitle, "manual_noexist");
      
    // 
    } else {
      Element.$addClassName(tableTitle, "manual_exists");
      Element.$removeClassName(tableTitle, "manual_noexist");
      
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ページャアイコンの変更処理
 * @private
 * @param {element} root 対象のルートオブジェクト
 */
Service.SearchResult.prototype.doChangePagerIcon = function(root) {
  var METHODNAME = "Service.SearchResult.prototype.doChangePagerIcon";
  try {
    
    var tablePager = Util.Selector.$select("div.table_pager", root)[0];
    
    // 
    if(Element.$hasClassName(tablePager, "invisible")) {
      Element.$removeClassName(tablePager, "invisible");
      
    // 
    } else {
      Element.$addClassName(tablePager, "invisible");
      
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * データ表示部の変更処理
 * @private
 * @param {element} root 対象のルートオブジェクト
 */
Service.SearchResult.prototype.doChangeListBody = function(root) {
  var METHODNAME = "Service.SearchResult.prototype.doChangePagerIcon";
  try {
    
    var listBody = Util.Selector.$select("div.list_body", root)[0];
    var tableCount = Util.Selector.$select("div.table_count", root)[0];
    
    // 
    if(Element.$hasClassName(listBody, "invisible")) {
      Element.$removeClassName(listBody, "invisible");
      Element.$removeClassName(tableCount, "invisible");
    // 
    } else {
      Element.$addClassName(listBody, "invisible");
      Element.$addClassName(tableCount, "invisible");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 状態の初期化処理
 * @private
 */
Service.SearchResult.prototype.doClearShowState = function() {
  var METHODNAME = "Service.SearchResult.prototype.close";
  try {
    
    this.isShowProps = {
      "repair" : false,
      "ncf"    : false,
      "ewd"    : false,
      "brm"    : false,
      "om"     : false,
      "dm"     : false,
      "erg"    : false,
      "wel"    : false,
      "res"    : false
    };
    this.showCntProps = {
      "repair" : 0,
      "ncf"    : 0,
      "ewd"    : 0,
      "brm"    : 0,
      "om"     : 0,
      "dm"     : 0,
      "erg"    : 0,
      "wel"    : 0,
      "res"    : 0
    };
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 検索結果の初期化処理
 * @private
 */
Service.SearchResult.prototype.doResetManuals = function() {
  var METHODNAME = "Service.SearchResult.prototype.doResetManuals";
  try {
    
    var targets = this.globalInfo.SCH_OPT_DEF.split(",");
    var target = "";
    var len = targets.length;
    var manualInfo = {};
    
    this.doClearShowState();
    
    // 対象マニュアルを全て初期化
    for(var i = 0; i < len; i++) {
      Util.$propcopy(Service.SearchResult.MANUAL_INFO_TEMP, manualInfo);
      
      target = DictConst.C_SERVICE_MANUAL_TYPE[targets[i]];
      
      manualInfo.id = target;
      manualInfo.manualName = Service.SearchResult.PUBTYPE_TO_NAME[target];
      
      // リストの削除
      this.doRemoveList(manualInfo);
      
      // マニュアルの初期化
      this.showManual(manualInfo, false);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 検索結果の終了処理
 */
Service.SearchResult.prototype.close = function() {
  var METHODNAME = "Service.SearchResult.prototype.close";
  try {
    
    Element.$addClassName($("tab_body_search_result"), "invisible");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * インスタンス取得処理
 * @return {Service.SearchResult} Service.SearchResult自身
 */
Service.SearchResult.$getInstance = function() {
  var METHODNAME = "Service.SearchResult.$getInstance";
  try {
    
    return Service.SearchResult.own;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};
