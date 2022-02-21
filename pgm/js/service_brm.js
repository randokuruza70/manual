/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2013/08/19 */

/**
 * file service_brm.js<br />
 *
 * @fileoverview このファイルには、閲覧画面(ボデー修理書)制御の関数が<br />
 * が定義されています。<br />
 * file-> service_brm.js
 * @author 原田
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/03/01|1.0.0|原田|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/03/01 1.0.0 原田・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 閲覧画面ボデー修理書
 * @class 閲覧画面ボデー修理書クラス
 */
Service.BRM = function() {
  var METHODNAME = "Service.BRM";
  try {
    
    this.treeArea       = null;
    this.treeTtlArea    = null;
    this.history        = [];
    this.isEntry        = false;
    this.isCallback     = true;
    this.selectInfo     = {};
    this.myGlobalInfo   = {};
    this.myGTSInfo      = {};
    this.mySuccession   = {};
    this.mySuccessionMode0 = {};
    this.mySuccessionMode1 = {};
    this.mySuccessionMode2 = {};
    this.mySuccessionMode3 = {};
    this.defBodyTree    = {};
    this.defBodyRoot    = {};
    this.defFrameTree   = {};
    this.defFrameRoot   = {};
    this.exitFunction   = null;
    
    this.myFromDate     = "";
    this.backFlg        = false;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * Service.BRM自身のインスタンス変数
 * @private
 * @type Service.BRM
 */
Service.BRM.own = new Service.BRM();

/**
 * 閲覧履歴テンプレート定数
 * @type object(連想配列)
 */
Service.BRM.HISTORY_TEMP = {
  SRV:    "",
  SRV_ID: "",
  SEC:    "",
  SEC_ID: "",
  TTL:    "",
  TTL_ID: "",
  SBT:    "",
  SBT_ID: "",
  PAR:    "",
  PAR_ID: "",
  CAT:    "",
  KEY:    "",
  URL:    "",
  SELECT_KEYWORD:  "",
  PSELECT_ARTS_CD: ""
};

/**
 * ボデー修理書TOP画面リンクキー定数
 * @type string
 */
Service.BRM.TOPPAGE_NAME = "BRM_TOP";

/**
 * ボデー修理書TOP画面パス定数
 * @type string
 */
Service.BRM.TOPPAGE_PATH = "";

/**
 * ボデー修理書コンテンツパス定数
 * @type string
 */
Service.BRM.CONTENT_PATH = "";

/**
 * 新規Window表示時のオプション定数
 * @type string
 */
Service.BRM.WINDOW_OPTION = "width={0},height={1},left=0,top=0,\
fullscreen=no,toolbar=no,menubar=no,directories=no,status=no,scrollbars=yes,\
resizable=yes";

/**
 * ボデー修理書画面クラスの初期化処理
 * @param {object(連想配列)} globalInfo 閲覧共通情報
 * @param {object(連想配列)} gtsInfo GTS情報
 * @param {string} fromDate 適用時期
 */
Service.BRM.prototype.init = function(globalInfo, gtsInfo, fromDate) {
  var METHODNAME = "Service.BRM.prototype.init";
  try {
    
    /* @private */
    var getElmHash = function(selector) {
      var elements = $$(selector);
      var len = elements.length;
      var result = {};
      
      // ツリー表示エリア内のimg数分だけループ
      for(var i = 0; i < len; i++) {
        result[elements[i].id] = elements[i].className;
      }
      return result;
    };
    
    // 引数の保持
    this.myGTSInfo = gtsInfo;
    this.myGlobalInfo = globalInfo;
    
    this.myFromDate = fromDate;
    
    // 定数定義の更新
    Service.BRM.TOPPAGE_PATH = Use.Util.$getContentsPath(
      "C_SERVICE_BRM_TOPPAGE_PATH", this.myFromDate, globalInfo.CAR_TYPE, "");
    Service.BRM.CONTENT_PATH = Use.Util.$getContentsPath(
      "C_SERVICE_BRM_CONTENT_PATH", this.myFromDate, globalInfo.CAR_TYPE, "");
    
    // 変数定義の更新
    this.treeArea    = $("brm_tree");
    this.treeTtlArea = $("brm_pub_id");
    this.defFrameTree = getElmHash("div#brm_head a");
    this.defFrameRoot = getElmHash("div#brm_head > div");
    this.defBodyTree  = getElmHash("div#brm_tree_root");
    this.defBodyRoot  = getElmHash("div#brm_body_root");
    
    // イベントの登録
    Use.Util.$observe($("brm_history_back"), "click",
      (function(own) {
        return function() { own.doClickBackLnk(); };
      })(this));
    Use.Util.$observe($("brm_tree_close"), "click",
      (function(own) {
        return function() { own.doClickHideLnk(); };
      })(this));
    Use.Util.$observe($("brm_resize_back"), "click",
      (function(own) {
        return function(evt) { own.doClickShortenPaneLnk(evt); };
      })(this));
    Use.Util.$observe($("brm_resize_enlarge"), "click",
      (function(own) {
        return function(evt) { own.doClickShortenPaneLnk(evt); };
      })(this));
    Use.Util.$observe($("brm_print"), "click",
      (function(own) {
        return function() { Service.$doClickPrintLnk(own.getHistory().URL); };
      })(this));
    //iPad用スタイル追加
    Use.Util.$setStyle_iPad($("brm_body"), "overflow: hidden;");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ボデー修理書表示
 * @param {object(連想配列)} globalInfo 閲覧共通情報
 * @param {number} mode 起動区分
 * @param {string} linkKey リンクキー
 */
Service.BRM.prototype.show = function(globalInfo, mode, linkKey) {
  var METHODNAME = "Service.BRM.prototype.show";
  try {

    var newConfig = ["10", "11"];
    
    this.showContentsStart(mode);
    
    // 共通情報の保持
    this.myGlobalInfo = globalInfo;
    
    // ボデー修理書フレームの表示
    Element.$removeClassName($("tab_body_brm"), "invisible");
    
    // コンテンツ種別区分が"10", "11"の場合は新構成として処理
    if(Util.$getIndexOfArray(
        newConfig, this.myGlobalInfo.BRM_CONTENTS_TYPE_GROUPS) != -1) {
      this.processForNewConfiguration(mode, linkKey);
    // コンテンツ種別区分が"10", "11"以外の場合は旧構成として処理
    } else {
      this.processForOldConfiguration();
    }
    
    Util.$enableWindow();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * コンテンツ表示処理開始処理
 * @param {number} mode 処理区分
 * @param {string} functionId 機能ID
 */
Service.BRM.prototype.showContentsStart = function(mode, functionId) {
  var METHODNAME = "Service.BRM.prototype.showContentsStart";
  try {
    
    var aryDisableArea = [$("header"), $("brm_head")];
    var history = {};
    var isFrontCover = false;
    
    if(Util.$isUndefined(mode) == false && mode != null) {
      // 1:タブクリック
      if(mode == "1") {
        history = this.getHistory();
        // タブ初回表示
        if(history == null) {
          isFrontCover = true;
        } else {
          // タブ内で最後に表示したHTMLがTOPコンテンツの場合
          if(history.KEY == Service.BRM.TOPPAGE_NAME) {
            isFrontCover = true;
          }
        }
      }
    }
    
    if(Util.$isUndefined(functionId) == false && functionId != null) {
      // 閲覧履歴を戻る場合
      if(functionId == "MAN05") {
        history = this.getHistory();
        // 戻り先のHTMLがTOPコンテンツの場合
        if(history.KEY == Service.BRM.TOPPAGE_NAME) {
          isFrontCover = true;
        }
      }
    }
    
    // TOPコンテンツの場合は抑止しない
    if(isFrontCover == true) {
      return;
    }
    
    Util.$disableArea(aryDisableArea);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツ表示処理終了処理
 */
Service.BRM.prototype.showContentsEnd = function() {
  var METHODNAME = "Service.BRM.prototype.showContentsEnd";
  try {
    
    Util.$enableArea();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 新構成用処理
 * @private
 * @param {number} mode 起動区分
 * @param {string} linkKey リンクキー
 */
Service.BRM.prototype.processForNewConfiguration = function(mode, linkKey) {
  var METHODNAME = "Service.BRM.prototype.processForNewConfiguration";
  try {
    
    var functionId = "";
    var newHistory = {};
    var oldHistory = {};
    
    Util.$propcopy(Service.BRM.HISTORY_TEMP, newHistory);
    Util.$propcopy(Service.BRM.HISTORY_TEMP, oldHistory);
    this.isCallback = false;
    
    // 起動区分が1の時は修理書タブ押下の処理
    if(mode == 1) {
      // １度でも開いたことがあれば履歴より取得
      if(this.getHistory()) {
        newHistory = this.getHistory();
        this.isEntry = false;
      // １度もなければ修理書TOPページの表示
      } else {
        newHistory.KEY = Service.BRM.TOPPAGE_NAME;
        newHistory.URL = Service.BRM.TOPPAGE_PATH;
        this.isEntry = true;
      }
    // 起動区分が1ではない時は引数のリンクキーを使用する
    } else {
      newHistory.PAR_ID = linkKey.split(",")[3];
      newHistory.KEY = linkKey;
      this.isEntry = true;
      // 起動区分が3の時は検索結果リンククリック時の処理
      if(mode == 3) {
        oldHistory = this.getHistory();
        // 最後に開いたコンテンツとリンクキーが同じ場合は履歴を登録しない
        if(oldHistory != null && oldHistory.KEY == newHistory.KEY) {
          this.isEntry = false;
        }
        functionId = "MAN01";
      // 起動区分が4の時は更新詳細画面内の本文リンククリック時の処理
      } else if(mode == 4) {
        functionId = "MAN02";
      // 起動区分が3の時は診断メモ一覧内の本文リンククリック時の処理
      } else if(mode == 5) {
        functionId = "MAN03";
      }
    }
    
    // ツリー表示エリアの更新
    Service.Repair.Tree.$initTree(
      (function(own) {
        return function(linkKey, paraName) {
          own.callbackTree(linkKey, paraName);
        };
      })(this),
      this.treeArea,
      this.treeTtlArea,
      this.myFromDate,
      this.myGlobalInfo.CAR_TYPE,
      ""
    );
    
    // コンテンツ表示エリアの更新
    this.showParagraph(newHistory, "", false, functionId);
    
    this.exitFunction = function() {
      var setElmState = function(selector, target) {
        var elements = $$(selector);
        var len = elements.length;
        // ツリー表示エリア内のimg数分だけループ
        for(var i = 0; i < len; i++) {
          elements[i].className = target[elements[i].id];
        }
      };
      
      Element.$addClassName($("tab_body_brm"), "invisible");
      Util.$closeIframe("brm_body");
      
      this.treeArea.innerHTML = "";
      this.treeTtlArea.innerHTML = "";
      setElmState("div#brm_head a",   this.defFrameTree);
      setElmState("div#brm_head > div", this.defFrameRoot);
      setElmState("div#brm_tree_root",  this.defBodyTree);
      setElmState("div#brm_body_root",  this.defBodyRoot);
      
      this.selectInfo = {};
      this.myGlobalInfo = {};
    };
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 旧構成用処理
 * @private
 */
Service.BRM.prototype.processForOldConfiguration = function() {
  var METHODNAME = "Service.BRM.prototype.processForOldConfiguration";
  try {
    
    var url = Use.Util.$getContentsPath("C_SERVICE_BRM_OLDCONFIG_INDEX");
    var _callback = function(instance, evt) {
      instance.showContentsEnd();
    };
    
    Util.$closeIframe("tab_body_brm");
    Use.Util.$openIframe("tab_body_brm", url, "0", "", "no",
        _callback.curry(this));
    
    Service.BRM.exitFunction = function() {
      // 画面の初期化
      Util.$closeIframe("tab_body_brm");
      this.myGlobalInfo = {};
    };
    
    this.exitFunction = function() {
      // 画面の初期化
      Util.$closeIframe("tab_body_brm");
      this.myGlobalInfo = {};
    };
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * タブクローズ処理
 */
Service.BRM.prototype.close = function() {
  var METHODNAME = "Service.BRM.prototype.close";
  try {
    
    // ボデー修理書フレームの非表示
    Element.$addClassName($("tab_body_brm"), "invisible");
    
    this.exitFunction();
    this.exitFunction = null;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * パラグラフを表示
 * @private
 * @param {object(連想配列)} newHistory 表示対象の履歴
 * @param {string} refId アンカー用ID
 * @param {boolean} isExpandTree false: ツリー展開 true: ツリー非展開
 * @param {string} funcId 機能ID
 */
Service.BRM.prototype.showParagraph = function(
    newHistory, refId, isExpandTree, funcId) {
  var METHODNAME = "Service.BRM.prototype.showParagraph";
  try {
    
    var param = {};
    var nowHistory = {};
    var url = "";
    var parId = "";
    var opt = Service.BRM.WINDOW_OPTION;
    var ary = [];
    var tlId = "";
    var titleInfo = {};
    var _callback = function(instance, evt) {
      instance.showContentsEnd();
    };
    Util.$propcopy(newHistory, nowHistory);

    // 現在表示ページが存在しないか、一致しない場合は表示処理を行う
    if((!this.selectInfo) || (this.selectInfo.KEY != nowHistory.KEY)) {
      
      param = {
        VIEW_LANG: this.myGlobalInfo.VIEW_LANG,
        LANG_CODE: this.myGlobalInfo.LANG_CODE,
        FROM_DATE: this.myFromDate,
        CAR_TYPE:  this.myGlobalInfo.CAR_TYPE,
        FOR_LANG:  this.myGlobalInfo.FOR_LANG,
        BRAND:     this.myGlobalInfo.BRAND,
        BRAND_NAME:this.myGlobalInfo.BRAND_NAME,
        TYPE:      this.myGlobalInfo.TYPE,
        ENGINE:    this.myGTSInfo.ENGINE,
        VIN:       this.myGTSInfo.VIN,
        MY:        this.myGTSInfo.MY,
        PUB_ID:    this.myGTSInfo.PUB_ID,
        PUB_TYPE:  "NM",
        PUB_NAME:  this.myGTSInfo.PUB_NAME,
        MODE:      "",
        PAR:       nowHistory.PAR,
        PAR_ID:    nowHistory.PAR_ID,
        SBPARA_ID: "",
        FUNC_ID:   funcId || ""
      };
      
      parId = nowHistory.PAR_ID;
      
      // ツールアイコン非活性処理
      this.enableToolIcons();
      
      // ツリー展開フラグがfalseの場合のみ処理
      if(!isExpandTree) {
        // ボデー修理書TOP以外の場合はツリーを展開する
        if(nowHistory.KEY != Service.BRM.TOPPAGE_NAME) {
          Service.Repair.Tree.$expandTree(nowHistory.KEY);
        // ボデー修理書TOPの場合はツリー内の選択情報を全て削除する
        } else {
          Service.Repair.Tree.$unselectTreeNode();
        }
      }
      
      ary = nowHistory.KEY.split(",");
      tlId = Service.Repair.Tree.PREFIX_TITLE_BM + ary[2];
      titleInfo = Service.Util.Tree.$getTitleInfo($(tlId));
      if(funcId != "MAN05") {
        nowHistory.SELECT_KEYWORD = Service.$makeRmLinkKeyword(titleInfo.name);
        nowHistory.SELECT_PARTS_CD = titleInfo.partsId;
      }
      
      // リンクキーがTOPページ以外の場合はURLを作成する
      if(nowHistory.KEY != Service.BRM.TOPPAGE_NAME) {
        url = Service.BRM.CONTENT_PATH.replace("{0}", parId);
        nowHistory.URL = url;
        url += refId ? "#" + refId : "";
      } else {
        url = nowHistory.URL;
      }
      
      Util.$propcopy(param, this.mySuccession);
      
      Util.$closeIframe("brm_body");
      Use.Util.$openIframe("brm_body", url, "0", "", "auto",
          _callback.curry(this));
      
      Util.$propcopy(nowHistory, this.selectInfo);
    } else {
      // パラグラフ表示エリアを更新しない場合、部分抑止を解除
      this.showContentsEnd();
    }
    this.isCallback = true;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ツールアイコン非活性処理
 * @private
 */
Service.BRM.prototype.enableToolIcons = function() {
  var METHODNAME = "Service.Repair.prototype.enableToolIcons";
  try {
      
      // 活性イメージを非表示
      Element.$addClassName($("brm_rmlink").parentNode, "invisible");
      Element.$addClassName("brm_print", "invisible");
      Element.$addClassName("brm_history_back", "invisible");
      
      // 非活性イメージを表示
      Element.$removeClassName("brm_print_g", "invisible");
      Element.$removeClassName("brm_history_back_g", "invisible");
      
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツールアイコン制御
 * @private
 */
Service.BRM.prototype.changeToolIcons = function() {
  var METHODNAME = "Service.BRM.prototype.changeToolIcons";
  try {
    
    var elmRmLink = $("brm_rmlink");
    // 修理書が存在し、検索キーワード（タイトル名称）、品名コードの
    // いずれかが存在する場合に、修理書へのリンクアイコンを表示する
    if(this.myGlobalInfo.SCH_OPT_DEF.indexOf(DictConst.C_SEARCH_OPTION_CD_REPAIR) != -1
        && (Use.Validator.$isNotEmpty(this.selectInfo.SELECT_KEYWORD) == true
        || Use.Validator.$isNotEmpty(this.selectInfo.SELECT_PARTS_CD) == true)) {
      Element.$removeClassName(elmRmLink.parentNode, "invisible");
      Event.$stopObserving(elmRmLink);
      Use.Util.$observe(elmRmLink, "click", 
          Service.$doBeforeClickSearchBtn.curry(
              DictConst.C_SERVICE_SIMPLE_RMSEARCH, 
              this.selectInfo.SELECT_KEYWORD, 
              this.selectInfo.SELECT_PARTS_CD));
    }
    
    // 閲覧履歴が２件以上ある場合は戻るアイコン・印刷アイコンを活性にする
    if(this.history.length > 1) {
      // 対象履歴が修理書TOPでない場合はアイコンの表示を行う
      if(this.getHistory().KEY != Service.BRM.TOPPAGE_NAME) {
        Element.$addClassName($("brm_print_g"), "invisible");
        Element.$removeClassName($("brm_print"), "invisible");
      }
      Element.$addClassName($("brm_history_back_g"), "invisible");
      Element.$removeClassName($("brm_history_back"), "invisible");
      // 戻るアイコン押下後であればフォーカスをあてる
      if(this.backFlg){
        $("brm_history_back").focus();
        this.backFlg = false;
      }
      
    // 閲覧履歴が１件の場合は履歴の内容でアイコンの活性/非活性制御をする
    } else {
      // 対象履歴がボデー修理書TOPでない場合はアイコンを活性にする
      if(this.getHistory().KEY != Service.BRM.TOPPAGE_NAME) {
        Element.$addClassName($("brm_print_g"), "invisible");
        Element.$removeClassName($("brm_print"), "invisible");
      // 対象履歴がボデー修理書TOPの場合はアイコンを非活性にする
      } else {
        Element.$addClassName($("brm_print"), "invisible");
        Element.$removeClassName($("brm_print_g"), "invisible");
      }
      Element.$addClassName($("brm_history_back"), "invisible");
      Element.$removeClassName($("brm_history_back_g"), "invisible");
      // 戻るアイコン押下後であれば非活性アイコンにフォーカスをあてる
      if(this.backFlg){
        $("brm_history_back_g").focus();
        this.backFlg = false;
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴取得処理
 * @private
 */
Service.BRM.prototype.getHistory = function() {
  var METHODNAME = "Service.BRM.prototype.getHistory";
  try {
    
    var idx = 0;
    var ret = null;
    
    // 閲覧履歴が存在する場合は最新の閲覧履歴を取得
    if(this.history.length) {
      idx = this.history.length - 1;
      ret = this.history[idx];
    }
    return ret;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴登録処理
 * @private
 * @param {string} newHistory 登録対象の履歴
 */
Service.BRM.prototype.addHistory = function(newHistory) {
  var METHODNAME = "Service.BRM.prototype.addHistory";
  try {
    
    var idx = 0;
    var prevHistory = {};
    
    // 対象の履歴にプロパティがある場合のみ追加
    if(newHistory.KEY != undefined && newHistory.KEY != "") {
      // 履歴が1件以上ある場合、1つ前の履歴と比較
      if(this.history.length > 0) {
        idx = this.history.length - 1;
        Util.$propcopy(this.history[idx], prevHistory);
        
        // 最新履歴と現在履歴が違う場合のみ、追加処理を行う
        if(prevHistory.KEY != newHistory.KEY) {
          this.history.push(newHistory);
          //最大履歴数を超えた場合は最古の閲覧履歴を削除
          if(this.history.length > 6) {
            this.history.shift();
          }
        }
      // 履歴が1件も無い場合、そのまま登録
      } else {
        this.history.push(newHistory);
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴削除処理
 * @private
 */
Service.BRM.prototype.delHistory = function() {
  var METHODNAME = "Service.BRM.prototype.delHistory";
  try {
    
    // 閲覧履歴が存在する場合は最新の閲覧履歴を削除
    if(this.history.length) {
      this.history.pop();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * コンテンツ表示成功時の履歴更新・登録処理
 * @param {object} paraInfo コンテンツ内情報
 */
Service.BRM.prototype.setHistory = function(paraInfo) {
  var METHODNAME = "Service.BRM.prototype.setHistory";
  try {
    
    var keys = this.selectInfo.KEY.split(",");
    var newHistory = {};

    this.selectInfo.PUB = paraInfo.PUB;
    this.selectInfo.CAT = paraInfo.CAT;
    this.selectInfo.SRV = paraInfo.SRV;
    this.selectInfo.SRV_ID = paraInfo.SRV_ID;
    this.selectInfo.SEC = paraInfo.SEC;
    this.selectInfo.SEC_ID = paraInfo.SEC_ID;
    this.selectInfo.TTL = paraInfo.TTL;
    this.selectInfo.TTL_ID = paraInfo.TTL_ID;
    this.selectInfo.SBT = paraInfo.SBT;
    this.selectInfo.SBT_ID = paraInfo.SBT_ID;
    this.selectInfo.PAR_ID = keys[3];
    
    Util.$propcopy(this.selectInfo, newHistory);
    
    // trueの場合は閲覧履歴の登録
    if(this.isEntry) {
      this.addHistory(newHistory);
    }
    
    this.changeToolIcons();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 選択情報取得処理
 * @private
 */
Service.BRM.prototype.getSelectInfo = function() {
  var METHODNAME = "Service.BRM.prototype.getSelectInfo";
  try {
    
    return this.selectInfo;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴を戻る(戻るアイコンクリック時)
 */
Service.BRM.prototype.doClickBackLnk = function() {
  var METHODNAME = "Service.BRM.prototype.doClickBackLnk";
  try {
    
    var newHistory = {};
    var functionId = "";
    
    // 現在履歴＋１件以上の履歴がある場合は表示処理
    if(this.history.length > 1) {
      Util.$disableWindow();
      this.delHistory();
      this.showContentsStart(null, "MAN05");
      
      this.isEntry = false;
      this.isCallback = false;
      newHistory = this.getHistory();
      
      // リンクキーがTOPページ以外の場合は機能IDを設定する
      if(newHistory.KEY != Service.BRM.TOPPAGE_NAME) {
        functionId = "MAN05";
      }
      
      this.showParagraph(newHistory, "", false, functionId);
      
      Util.$enableWindow();
    }
    this.backFlg = true;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ツリー内パラグラフ押下時のコールバック処理
 * @param {string} linkKey リンクキー
 * @param {string} paraName パラグラフ名称
 */
Service.BRM.prototype.callbackTree = function(linkKey, paraName) {
  var METHODNAME = "Service.BRM.prototype.callbackTree";
  try {
    
    var newHistory = {};
    var functionId = "MAN07";
    
    this.showContentsStart();
    
    // コールバックフラグがtrueの場合のみ処理
    if(this.isCallback) {
      Util.$propcopy(Service.BRM.HISTORY_TEMP, newHistory);
      newHistory.PAR = paraName;
      newHistory.PAR_ID = linkKey.split(",")[3];
      newHistory.KEY = linkKey;
      newHistory.URL = Service.BRM.CONTENT_PATH;
      newHistory.URL = newHistory.URL.replace("{0}", linkKey.split(",")[3]);
      
      this.isEntry = true;
      this.isCallback = true;
      this.showParagraph(newHistory, "", true, functionId);
    }
    
    this.isCallback = true;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ツリー表示エリアの非表示(ツリー表示エリア非表示アイコンクリック時)
 */
Service.BRM.prototype.doClickHideLnk = function() {
  var METHODNAME = "Service.BRM.prototype.doClickHideLnk";
  try {
    
    $("brm_tree_frame").className = "tree_view_area_none";
    $("brm_tree_root").className  = "tree_view_area_none";
    $("brm_body_frame").className = "paragraph_view_area_all";
    $("brm_body_root").className  = "paragraph_view_area_all";
    $("brm_body_contents").contentWindow.Contents.$doChangViewArea_iPad();
    Element.$addClassName($("brm_resize_back"), "invisible");
    Element.$removeClassName($("brm_resize_enlarge"), "invisible");
    $("brm_resize_enlarge").focus();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ツリー表示エリアの拡大、縮小(ツリー表示エリア拡大アイコンクリック時)
 * @param {Event} evt イベントオブジェクト
 */
Service.BRM.prototype.doClickShortenPaneLnk = function(evt) {
  var METHODNAME = "Service.BRM.prototype.doClickShortenPaneLnk";
  try {
    
    var ele = Event.$element(evt);
    // イベントのエレメントがimgの場合、親要素のaタグのエレメントを取得する
    if(ele.tagName.toLowerCase() == "img") {
      ele = ele.parentNode;
    }
    
    // 現在選択エレメントが拡大か判定
    if(ele.id == "brm_resize_enlarge") {
      // ツリー(上部)エレメントのクラス名が非表示か判定
      if($("brm_tree_frame").className == "tree_view_area_none") {
        $("brm_tree_frame").className = "tree_view_area_190px";
        $("brm_tree_root").className  = "tree_view_area_190px";
        $("brm_body_frame").className = "paragraph_view_area";
        $("brm_body_root").className  = "paragraph_view_area";
        $("brm_body_contents").contentWindow.Contents.$doChangViewArea_iPad();
      // ツリー(上部)エレメントのクラス名が非表示以外
      } else {
        $("brm_tree_frame").className = "tree_view_area_350px";
        $("brm_tree_root").className  = "tree_view_area_350px";
        $("brm_body_frame").className = "paragraph_view_area_half";
        $("brm_body_root").className  = "paragraph_view_area_half";
        $("brm_body_contents").contentWindow.Contents.$doChangViewArea_iPad();
        Element.$addClassName($("brm_resize_enlarge"), "invisible");
        Element.$removeClassName($("brm_resize_back"), "invisible");
        $("brm_resize_back").focus();
      }
    // 現在選択エレメントが縮小
    } else {
      $("brm_tree_frame").className = "tree_view_area_190px";
      $("brm_tree_root").className  = "tree_view_area_190px";
      $("brm_body_frame").className = "paragraph_view_area";
      $("brm_body_root").className  = "paragraph_view_area";
      $("brm_body_contents").contentWindow.Contents.$doChangViewArea_iPad();
      Element.$addClassName($("brm_resize_back"), "invisible");
      Element.$removeClassName($("brm_resize_enlarge"), "invisible");
      $("brm_resize_enlarge").focus();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 要領参照リンク押下時の処理
 * @param {string} linkKey リンクキー
 */
Service.BRM.prototype.doClickReferenceLnk = function(linkKey) {
  var METHODNAME = "Service.BRM.prototype.doClickReferenceLnk";
  try {
    
    var splitKeys  = linkKey.split(",");
    var keyIdx     = 0;
    var currKey    = splitKeys[3];
    var refKey     = "";
    var functionId = "MAN11";
    var newHistory = {};
    
    this.showContentsStart();
    
    this.isEntry = true;
    this.isCallback = false;
    
    Util.$propcopy(Service.BRM.HISTORY_TEMP, newHistory);
    keyIdx = currKey.indexOf("_");
    //アンカー情報が存在する場合
    if(keyIdx != -1) {
      refKey = currKey;
      currKey = currKey.substring(0, keyIdx);
    }
    splitKeys[3] = currKey;
    newHistory.PAR_ID = currKey;
    newHistory.KEY = splitKeys.join(",");
    
    this.showParagraph(newHistory, refKey, false, functionId);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * タイトル選択のコールバック処理
 * @param {string} linkKey タイトル選択画面の選択リンクキー
 */
Service.BRM.prototype.doClickTitleLnk = function(linkKey) {
  var METHODNAME = "Service.BRM.prototype.doClickTitleLnk";
  try {
    
    Service.Repair.Tree.$expandTree(linkKey, true);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * モーダレス画面の引継ぎ情報用の取得処理
 * @param {string} mode モード
 * @return {object(連想配列)} 引継ぎ情報
 */
Service.BRM.prototype.getModelessParam = function(mode) {
  var METHODNAME = "Service.BRM.prototype.getModelessParam";
  try {
    
    var param = {};
    
    // モードなし
    if(mode == "") {
      Util.$propcopy(this.mySuccession, param);
    // 参照モード
    } else if(mode == "0") {
      Util.$propcopy(this.mySuccessionMode0, param);
    // 印刷モード
    } else if(mode == "1") {
      Util.$propcopy(this.mySuccessionMode1, param);
    // 技術解説モード
    } else if(mode == "2") {
      Util.$propcopy(this.mySuccessionMode2, param);
    // 手順詳細モード
    } else if(mode == "3") {
      Util.$propcopy(this.mySuccessionMode3, param);
    }
    
    return param;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * モーダレス画面の引継ぎ情報用の設定処理
 * @param {string} mode モード
 * @param {string} key 追加するKEY
 * @param {string} val 設定する値
 */
Service.BRM.prototype.setModelessParam = function(mode, key, val) {
  var METHODNAME = "Service.BRM.prototype.setModelessParam";
  try {
    
    // モードなし
    if(mode == "") {
      this.mySuccession[key] = val;
    // 参照モード
    } else if(mode == "0") {
      this.mySuccessionMode0[key] = val;
    // 印刷モード
    } else if(mode == "1") {
      this.mySuccessionMode1[key] = val;
    // 技術解説モード
    } else if(mode == "2") {
      this.mySuccessionMode2[key] = val;
    // 手順詳細モード
    } else if(mode == "3") {
      this.mySuccessionMode3[key] = val;
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * インスタンス取得処理
 * @return {Service.BRM} Service.BRM自身
 */
Service.BRM.$getInstance = function() {
  var METHODNAME = "Service.BRM.$getInstance";
  try {
    
    return Service.BRM.own;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}
