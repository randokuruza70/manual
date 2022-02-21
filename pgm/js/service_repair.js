/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2015/04/08 */

/**
 * file service_repair.js<br />
 *
 * @fileoverview このファイルには、修理書画面についての処理が<br />
 * 定義されています。<br />
 * file-> service_repair.js
 * @author 渡会
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/03/01|1.0.0   |渡会|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/03/01 渡会 ・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 閲覧画面修理書
 * @class 閲覧画面修理書クラス
 */
Service.Repair = function() {
  var METHODNAME = "Service.Repair";
  try {
    
    this.treeArea       = null;
    this.treeTtlArea    = null;
    this.history        = [];
    this.isEntry        = false;
    this.isCallback     = true;
    this.isShowFlow     = true;
    this.selectInfo     = {};
    this.myGTSInfo      = {};
    this.myGlobalInfo   = {};
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
 * Service.Repair自身のインスタンス変数
 * @private
 * @type Service.Repair
 */
Service.Repair.own = new Service.Repair();

/**
 * 閲覧履歴テンプレート定数
 * @type object(連想配列)
 */
Service.Repair.HISTORY_TEMP = {
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
  URL:    ""
};

/**
 * 修理書TOP画面リンクキー定数
 * @type string
 */
Service.Repair.TOPPAGE_NAME = "REPAIR_TOP";

/**
 * 修理書TOP画面パス定数
 * @type string
 */
Service.Repair.TOPPAGE_PATH = "";

/**
 * 修理書コンテンツパス定数
 * @type string
 */
Service.Repair.CONTENT_PATH = "";

/**
 * 修理書診断フローコンテンツパス定数
 * @type string
 */
Service.Repair.DIAGFLW_PATH = "";

/**
 * 新規Window表示時のオプション定数
 * @type string
 */
Service.Repair.WINDOW_OPTION = "left=0,top=0,\
toolbar=no,menubar=no,directories=no,status=no,scrollbars=yes,\
resizable=yes";

/**
 * 修理書画面クラスの初期化処理
 * @param {object(連想配列)} globalInfo 閲覧共通情報
 * @param {object(連想配列)} gtsInfo GTS情報
 * @param {string} fromDate 適用時期
 */
Service.Repair.prototype.init = function(globalInfo, gtsInfo, fromDate) {
  var METHODNAME = "Service.Repair.prototype.init";
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
    Service.Repair.TOPPAGE_PATH = Use.Util.$getContentsPath(
      "C_SERVICE_REPAIR_TOPPAGE_PATH", fromDate, globalInfo.CAR_TYPE, "");
    Service.Repair.CONTENT_PATH = Use.Util.$getContentsPath(
      "C_SERVICE_REPAIR_CONTENT_PATH", fromDate, globalInfo.CAR_TYPE, "");
    Service.Repair.DIAGFLW_PATH = Use.Util.$getContentsPath(
      "C_SERVICE_REPAIR_DIAGFLW_PATH", fromDate, globalInfo.CAR_TYPE, "");
    
    // 変数定義の更新
    this.treeArea    = $("repair_tree");
    this.treeTtlArea = $("repair_pub_id");
    this.defFrameTree = getElmHash("div#repair_head a");
    this.defFrameRoot = getElmHash("div#repair_head > div");
    this.defBodyTree  = getElmHash("div#repair_tree_root");
    this.defBodyRoot  = getElmHash("div#repair_body_root");
    
    // イベントの登録
    Use.Util.$observe($("repair_history_back"), "click",
      (function(own) {
        return function() { own.doClickBackLnk(); };
      })(this));
    Use.Util.$observe($("repair_all_process_expand"), "click",
      (function(own) {
        return function() { own.doClickDisplayProcedureIcn(); };
      })(this));
    Use.Util.$observe($("repair_all_process_close"), "click",
      (function(own) {
        return function() { own.doClickHideProcedureIcn(); };
      })(this));
    Use.Util.$observe($("repair_tree_close"), "click",
      (function(own) {
        return function() { own.doClickHideLnk(); };
      })(this));
    Use.Util.$observe($("repair_resize_back"), "click",
      (function(own) {
        return function(evt) { own.doClickShortenPaneLnk(evt); };
      })(this));
    Use.Util.$observe($("repair_resize_enlarge"), "click",
      (function(own) {
        return function(evt) { own.doClickShortenPaneLnk(evt); };
      })(this));
    Use.Util.$observe($("repair_print"), "click",
      (function(own) {
        return function() { Service.$doClickPrintLnk(own.getHistory().URL); };
      })(this));
    //iPad用スタイル追加
    Use.Util.$setStyle_iPad($("repair_body"), "overflow: hidden;");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 修理書表示
 * @param {object(連想配列)} globalInfo 閲覧共通情報
 * @param {number} mode 起動区分
 * @param {string} linkKey リンクキー
 */
Service.Repair.prototype.show = function(globalInfo, mode, linkKey) {
  var METHODNAME = "Service.Repair.prototype.show";
  try {
    
    var newConfig = ["10", "11"];
    
    this.showContentsStart(mode);
    
    // 共通情報の保持
    this.myGlobalInfo = globalInfo;
    
    // 修理書フレームの表示
    Element.$removeClassName($("tab_body_repair"), "invisible");
    
    // コンテンツ種別区分が"10", "11"の場合は新構成として処理
    if(Util.$getIndexOfArray(
        newConfig, this.myGlobalInfo.REPAIR_CONTENTS_TYPE_GROUPS) != -1) {
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
Service.Repair.prototype.showContentsStart = function(mode, functionId) {
  var METHODNAME = "Service.Repair.prototype.showContentsStart";
  try {
    
    var aryDisableArea = [$("header"), $("repair_head")];
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
          if(history.KEY == Service.Repair.TOPPAGE_NAME) {
            isFrontCover = true;
          }
        }
      // 0:サービス情報ボタン
      } else if(mode == "0") {
        isFrontCover = true;
      }
    }
    
    if(Util.$isUndefined(functionId) == false && functionId != null) {
      // 閲覧履歴を戻る場合
      if(functionId == "MAN05") {
        history = this.getHistory();
        // 戻り先のHTMLがTOPコンテンツの場合
        if(history.KEY == Service.Repair.TOPPAGE_NAME) {
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
Service.Repair.prototype.showContentsEnd = function() {
  var METHODNAME = "Service.Repair.prototype.showContentsEnd";
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
Service.Repair.prototype.processForNewConfiguration = function(mode, linkKey) {
  var METHODNAME = "Service.Repair.prototype.processForNewConfiguration";
  try {
    
    var functionId = "";
    var newHistory = {};
    var oldHistory = {};
    
    Util.$propcopy(Service.Repair.HISTORY_TEMP, newHistory);
    Util.$propcopy(Service.Repair.HISTORY_TEMP, oldHistory);
    this.isCallback = false;
    
    // 起動区分が1の時は修理書タブ押下の処理
    if(mode == 1) {
      // １度でも開いたことがあれば履歴より取得
      if(this.getHistory()) {
        newHistory = this.getHistory();
        this.isEntry = false;
        this.isShowFlow = false;
      // １度もなければ修理書TOPページの表示
      } else {
        newHistory.KEY = Service.Repair.TOPPAGE_NAME;
        newHistory.URL = Service.Repair.TOPPAGE_PATH;
        this.isEntry = true;
      }
      functionId = "";
    // 起動区分が0の時はサービス情報押下の処理
    } else if(mode == 0) {
      newHistory.KEY = Service.Repair.TOPPAGE_NAME;
      newHistory.URL = Service.Repair.TOPPAGE_PATH;
      this.isEntry = true;
      functionId = "";
    // 起動区分が0でも1でもない時は引数のリンクキーを使用する
    } else {
      newHistory.PAR_ID = linkKey.split(",")[3];
      newHistory.KEY = linkKey;
      this.isEntry = true;
      this.isShowFlow = true;
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
        return function(linkKey, category, sbparaId, paraName) {
          own.callbackTree(linkKey, category, sbparaId, paraName);
        };
      })(this),
      this.treeArea,
      this.treeTtlArea,
      this.myFromDate,
      this.myGlobalInfo.CAR_TYPE,
      ""
    );
    
    // コンテンツ表示エリアの更新
    this.showParagraph(newHistory, "", false, functionId, "");
    
    this.exitFunction = function() {
      var setElmState = function(selector, target) {
        var elements = $$(selector);
        var len = elements.length;
        // ツリー表示エリア内のimg数分だけループ
        for(var i = 0; i < len; i++) {
          elements[i].className = target[elements[i].id];
        }
      };
      
      Util.$closeIframe("repair_body");
      this.treeArea.innerHTML = "";
      this.treeTtlArea.innerHTML = "";
      setElmState("div#repair_head a",   this.defFrameTree);
      setElmState("div#repair_head > div", this.defFrameRoot);
      setElmState("div#repair_tree_root",  this.defBodyTree);
      setElmState("div#repair_body_root",  this.defBodyRoot);
      
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
Service.Repair.prototype.processForOldConfiguration = function() {
  var METHODNAME = "Service.Repair.prototype.processForOldConfiguration";
  try {
    
    var url = Use.Util.$getContentsPath("C_SERVICE_REPAIR_OLDCONFIG_INDEX");
    var _callback = function(instance, evt) {
      instance.showContentsEnd();
    };
    
    Util.$closeIframe("tab_body_repair");
    Use.Util.$openIframe("tab_body_repair", url, "0", "no", null,
        _callback.curry(this));
    
    this.exitFunction = function() {
      // 画面の初期化
      Util.$closeIframe("tab_body_repair");
      this.myGlobalInfo = {};
    };
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * タブクローズ処理
 */
Service.Repair.prototype.close = function() {
  var METHODNAME = "Service.Repair.prototype.close";
  try {
    
    // 修理書フレームの非表示
    Element.$addClassName($("tab_body_repair"), "invisible");
    
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
 * @param {string} sbparaId サブパラID
 */
Service.Repair.prototype.showParagraph = function(
    newHistory, refId, isExpandTree, funcId, sbparaId) {
  var METHODNAME = "Service.Repair.prototype.showParagraph";
  try {
    
    var param = {};
    var nowHistory = {};
    var url = "";
    var parId = "";
    var opt = Service.Repair.WINDOW_OPTION;
    var tgt = "RMModelessWindow_" + Use.Util.$getInitDate();
    var scr = "";
    var diagCategory = ["C", "Y", "J"];
    var _callback = function(instance, evt) {
      instance.showContentsEnd();
    };
    Util.$propcopy(newHistory, nowHistory);
    
    // 現在表示ページが存在しないか、一致しない場合は表示処理を行う
    if((!this.selectInfo) ||
       (!sbparaId && this.selectInfo.KEY != nowHistory.KEY) ||
       (sbparaId)) {
      
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
        PUB_TYPE:  "RM",
        PUB_NAME:  this.myGTSInfo.PUB_NAME,
        MODE:      "",
        PAR:       nowHistory.PAR,
        PAR_ID:    nowHistory.PAR_ID,
        SBPARA_ID: sbparaId || refId || "",
        FUNC_ID:   funcId || ""
      };
      
      parId = nowHistory.PAR_ID;
      
      // サブパラIDが存在する場合はモーダレス表示処理
      if(sbparaId) {
        param.MODE = "2";
        
        url = Service.Repair.CONTENT_PATH.replace("{0}", parId);
        nowHistory.URL = url;
        
        url += "?dummyp=" + sbparaId;
        url += "&PUB_TYPE=" + Service.$getCurrentTabName();
        url += "&MODE=2";
        tgt += "TechnoMode";
        
        Util.$propcopy(param, this.mySuccessionMode2);
        
        Util.$openUrl(url, tgt, opt, Util.WINDOW_SIZE_2);
      // サブパラIDが存在しない場合はコンテンツ表示エリアへ表示
      } else {
        // ツールアイコン非活性処理
        this.enableToolIcons();
        
        // ツリー展開フラグがfalseの場合のみ処理
        if(!isExpandTree) {
          // 現在のリンクキーが修理書TOP以外の場合はツリーを展開する
          if(nowHistory.KEY != Service.Repair.TOPPAGE_NAME) {
            Service.Repair.Tree.$expandTree(nowHistory.KEY);
          // 現在のリンクキーが修理書TOPの場合はツリーの選択情報を全て削除する
          } else {
            Service.Repair.Tree.$unselectTreeNode();
          }
        }
        
        // リンクキーがTOPページ以外の場合はURLを作成する
        if(nowHistory.KEY != Service.Repair.TOPPAGE_NAME) {
          // カテゴリが"C"、"Y"、"J"のいずれかのときは診断フローと判断
          if(Util.$getIndexOfArray(diagCategory,
              Service.Repair.Tree.$getCategoryType(nowHistory.KEY)) != -1) {
            url = Service.Repair.DIAGFLW_PATH.replace("{0}", parId);
            nowHistory.URL = url;
            url += refId ? "#" + refId : "";
          // カテゴリが"C"、"Y"、"J"のいずれでも無い場合はそれ以外と判断
          } else {
            scr = "auto";
            url = Service.Repair.CONTENT_PATH.replace("{0}", parId);
            nowHistory.URL = url;
            url += refId ? "#" + refId : "";
          }
        // TOPページの場合はそのまま使用する
        } else {
          url = nowHistory.URL;
        }
        
        Util.$propcopy(param, this.mySuccession);
        
        Util.$closeIframe("repair_body");
        Use.Util.$openIframe("repair_body", url, "0", "", scr,
            _callback.curry(this));
        
        Util.$propcopy(nowHistory, this.selectInfo);
      }
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
Service.Repair.prototype.enableToolIcons = function() {
  var METHODNAME = "Service.Repair.prototype.enableToolIcons";
  try {
      
      // 活性イメージを非表示
      Element.$addClassName($("repair_attentions").parentNode,  "invisible");
      Element.$addClassName("repair_all_process_expand", "invisible");
      Element.$addClassName("repair_all_process_close", "invisible");
      Element.$addClassName("repair_print", "invisible");
      Element.$addClassName("repair_history_back", "invisible");
      
      // 非活性イメージを表示
      Element.$removeClassName("repair_all_process_expand_g", "invisible");
      Element.$removeClassName("repair_all_process_close_g", "invisible");
      Element.$removeClassName("repair_print_g", "invisible");
      Element.$removeClassName("repair_history_back_g", "invisible");
      
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツールアイコン制御
 * @private
 * @param {boolean} isExpand 展開・縮小機能利用の可否
 * @param {string} isFlow 診断フロー警告・注意画面表示の有無
 */
Service.Repair.prototype.changeToolIcons = function(isExpand, isFlow) {
  var METHODNAME = "Service.Repair.prototype.changeToolIcons";
  try {
    
    var cat = this.selectInfo.CAT;
    var ele = $("repair_attentions").parentNode;
    var diagCategory = ["C", "Y", "J"];
    
    // パラグラフカテゴリが"C"、"Y"、"J"のいずれかの場合はアイコンを表示
    if(Util.$getIndexOfArray(diagCategory, cat) != -1
      && isFlow) {
      // 注意・警告アイコン表示
      Element.$removeClassName(ele, "invisible");
      Event.$stopObserving($("repair_attentions"));
      Use.Util.$observe($("repair_attentions"), "click",
        (function(own) {
          return function(evt) {
            Service.$doClickCautionNoticeIcn(own.getSelectInfo().PAR_ID);
          }
        })(this)
      );
    // パラグラフカテゴリがいずれでもない場合はアイコンを非表示
    } else {
      // 注意・警告アイコン非表示
      Element.$addClassName(ele, "invisible");
      Event.$stopObserving($("repair_attentions"));
    }
    
    // 閲覧履歴が２件以上ある場合は戻るアイコン・印刷アイコンを活性にする
    if(this.history.length > 1) {
      // 対象履歴が修理書TOPでない場合はアイコンの表示を行う
      if(this.getHistory().KEY != Service.Repair.TOPPAGE_NAME) {
        Element.$addClassName($("repair_print_g"), "invisible");
        Element.$removeClassName($("repair_print"), "invisible");
      }
      Element.$addClassName($("repair_history_back_g"), "invisible");
      Element.$removeClassName($("repair_history_back"), "invisible");
      // 戻るアイコン押下後であればフォーカスをあてる
      if(this.backFlg){
        $("repair_history_back").focus();
        this.backFlg = false;
      }
      
    // 閲覧履歴が１件の場合は履歴の内容でアイコンの活性/非活性制御をする
    } else {
      // 対象履歴が修理書TOPでない場合はアイコンを活性にする
      if(this.getHistory().KEY != Service.Repair.TOPPAGE_NAME) {
        Element.$addClassName($("repair_print_g"), "invisible");
        Element.$removeClassName($("repair_print"), "invisible");
      // 対象履歴が修理書TOPの場合はアイコンを非活性にする
      } else {
        Element.$addClassName($("repair_print"), "invisible");
        Element.$removeClassName($("repair_print_g"), "invisible");
      }
      Element.$addClassName($("repair_history_back"), "invisible");
      Element.$removeClassName($("repair_history_back_g"), "invisible");
      // 戻るアイコン押下後であれば非活性アイコンにフォーカスをあてる
      if(this.backFlg){
        $("repair_history_back_g").focus();
        this.backFlg = false;
      }
    }
    
    // 手順が存在する場合は全手順展開・縮小アイコンを活性にする
    if(isExpand) {
      Element.$removeClassName("repair_all_process_expand_g", "invisible");
      Element.$addClassName("repair_all_process_expand", "invisible");
      Element.$addClassName("repair_all_process_close_g", "invisible");
      Element.$removeClassName("repair_all_process_close", "invisible");
    // 手順が存在しない場合は全手順展開・縮小アイコンを非活性にする
    } else {
      Element.$removeClassName("repair_all_process_expand_g", "invisible");
      Element.$addClassName("repair_all_process_expand", "invisible");
      Element.$removeClassName("repair_all_process_close_g", "invisible");
      Element.$addClassName("repair_all_process_close", "invisible");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴取得処理
 * @private
 */
Service.Repair.prototype.getHistory = function() {
  var METHODNAME = "Service.Repair.prototype.getHistory";
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
Service.Repair.prototype.addHistory = function(newHistory) {
  var METHODNAME = "Service.Repair.prototype.addHistory";
  try {
    
    this.history.push(newHistory);
    // 閲覧履歴が6件以上(現在表示分含めるため+1件)ある場合は削除処理
    if(this.history.length > 6) {
      this.history.shift();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴削除処理
 * @private
 */
Service.Repair.prototype.delHistory = function() {
  var METHODNAME = "Service.Repair.prototype.addHistory";
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
 * @param {boolean} isExpand 展開・縮小機能利用の可否
 * @param {string} isFlow 診断フロー警告・注意画面表示の有無
 */
Service.Repair.prototype.setHistory = function(paraInfo, isExpand, isFlow) {
  var METHODNAME = "Service.Repair.prototype.setHistory";
  try {
    
    var keys = this.selectInfo.KEY.split(",");
    var newHistory = {};
    var diagCategory = ["C", "Y", "J"];
    
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
    
    // カテゴリ"C", "Y", "J"のいずれかの場合は警告注意画面表示
    if(Util.$getIndexOfArray(diagCategory, paraInfo.CAT) != -1) {
      // 診断フロー警告・注意フラグがある場合は表示
      if(isFlow) {
        // 表示可能状態の場合は表示する
        if(this.isShowFlow) {
          Service.$doClickCautionNoticeIcn(keys[3]);
        }
      }
    }
    
    this.changeToolIcons(isExpand, isFlow);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 選択情報取得処理
 * @private
 */
Service.Repair.prototype.getSelectInfo = function() {
  var METHODNAME = "Service.Repair.prototype.getSelectInfo";
  try {
    
    return this.selectInfo;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴を戻る(戻るアイコンクリック時)
 */
Service.Repair.prototype.doClickBackLnk = function() {
  var METHODNAME = "Service.Repair.prototype.doClickBackLnk";
  try {
    
    var newHistory = {};
    var nowHistory = {};
    var functionId = "";
    
    // 現在履歴＋１件以上の履歴がある場合は処理
    if(this.history.length > 1) {
      Util.$disableWindow();

      nowHistory = this.getHistory();

      this.delHistory();
      this.showContentsStart(null, "MAN05");
      
      this.isEntry = false;
      this.isCallback = false;
      this.isShowFlow = false;
      newHistory = this.getHistory();
      
      // リンクキーがTOPページ以外の場合は機能IDを設定する
      if(newHistory.KEY != Service.Repair.TOPPAGE_NAME) {
        functionId = "MAN05";
      }
      
      this.showParagraph(newHistory, nowHistory.KEY.split(",")[5], false, functionId, "");
      
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
 * @param {string} category カテゴリ
 * @param {string} sbparaId サブパラID
 * @param {string} paraName パラグラフ名称
 */
Service.Repair.prototype.callbackTree = function(
    linkKey, category, sbparaId, paraName) {
  var METHODNAME = "Service.Repair.prototype.callbackTree";
  try {
    
    var newHistory = {};
    var functionId = "MAN07";
    
    // コールバックフラグがtrueの場合のみ処理
    if(this.isCallback) {
      Util.$propcopy(Service.Repair.HISTORY_TEMP, newHistory);
      newHistory.PAR = paraName;
      newHistory.PAR_ID = linkKey.split(",")[3];
      newHistory.KEY = linkKey;
      newHistory.CAT = category;
      
      // サブパラIDがない場合はIFrame内に表示処理
      if(!sbparaId) {
        this.showContentsStart();
        
        this.isEntry = true;
        this.isShowFlow = true;
        this.showParagraph(newHistory, "", true, functionId, "");
      // サブパラIDがある場合はモーダレス表示処理
      } else {
        this.isEntry = false;
        this.showParagraph(newHistory, "", false, functionId, sbparaId);
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ツールアイコン表示エリアの展開・縮小状態制御処理
 * @private
 * @param {number} state コンテンツ内の展開・縮小状態
 */
Service.Repair.prototype.setExpandState = function(state) {
  var METHODNAME = "Service.Repair.prototype.setExpandState";
  try {
    
    // 状態が全縮小の場合
    if(state == 0) {
      Element.$addClassName("repair_all_process_expand_g", "invisible");
      Element.$removeClassName("repair_all_process_expand", "invisible");
      Element.$removeClassName("repair_all_process_close_g", "invisible");
      Element.$addClassName("repair_all_process_close", "invisible");
    // 状態が全展開の場合
    } else if(state == 1) {
      Element.$removeClassName("repair_all_process_expand_g", "invisible");
      Element.$addClassName("repair_all_process_expand", "invisible");
      Element.$addClassName("repair_all_process_close_g", "invisible");
      Element.$removeClassName("repair_all_process_close", "invisible");
    // 状態が混在の場合
    } else {
      Element.$addClassName("repair_all_process_expand_g", "invisible");
      Element.$removeClassName("repair_all_process_expand", "invisible");
      Element.$addClassName("repair_all_process_close_g", "invisible");
      Element.$removeClassName("repair_all_process_close", "invisible");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * コンテンツリサイズ処理
 * @private
 */
Service.Repair.$resizeContents = function() {
  var METHODNAME = "Service.Repair.$resizeContents";
  try {

    var iWindow = $("repair_body_contents").contentWindow;
    try {
      iWindow.Event.$fireEvent(iWindow, "resize");
    } catch(e) {
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー表示エリアの非表示(ツリー表示エリア非表示アイコンクリック時)
 */
Service.Repair.prototype.doClickHideLnk = function() {
  var METHODNAME = "Service.Repair.prototype.doClickHideLnk";
  try {
    
    $("repair_tree_frame").className = "tree_view_area_none";
    $("repair_tree_root").className  = "tree_view_area_none";
    $("repair_body_frame").className = "paragraph_view_area_all";
    $("repair_body_root").className  = "paragraph_view_area_all";
    Element.$addClassName($("repair_resize_back"), "invisible");
    Element.$removeClassName($("repair_resize_enlarge"), "invisible");
    $("repair_resize_enlarge").focus();
    Service.Repair.$resizeContents();
    $("repair_body_contents").contentWindow.Contents.$doChangViewArea_iPad();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ツリー表示エリアの拡大、縮小(ツリー表示エリア拡大アイコンクリック時)
 * @param {Event} evt イベントオブジェクト
 */
Service.Repair.prototype.doClickShortenPaneLnk = function(evt) {
  var METHODNAME = "Service.Repair.prototype.doClickShortenPaneLnk";
  try {
    
    var ele = Event.$element(evt);
    // イベントのエレメントがimgの場合、親要素のaタグのエレメントを取得する
    if(ele.tagName.toLowerCase() == "img") {
      ele = ele.parentNode;
    }
    
    // 現在選択エレメントが拡大か判定
    if(ele.id == "repair_resize_enlarge") {
      // ツリー(上部)エレメントのクラス名が非表示か判定
      if($("repair_tree_frame").className == "tree_view_area_none") {
        $("repair_tree_frame").className = "tree_view_area_190px";
        $("repair_tree_root").className  = "tree_view_area_190px";
        $("repair_body_frame").className = "paragraph_view_area";
        $("repair_body_root").className  = "paragraph_view_area";
        $("repair_body_contents").contentWindow.Contents.$doChangViewArea_iPad();
      // ツリー(上部)エレメントのクラス名が非表示以外
      } else {
        $("repair_tree_frame").className = "tree_view_area_350px";
        $("repair_tree_root").className  = "tree_view_area_350px";
        $("repair_body_frame").className = "paragraph_view_area_half";
        $("repair_body_root").className  = "paragraph_view_area_half";
        $("repair_body_contents").contentWindow.Contents.$doChangViewArea_iPad();
        Element.$addClassName($("repair_resize_enlarge"), "invisible");
        Element.$removeClassName($("repair_resize_back"), "invisible");
        $("repair_resize_back").focus();
      }
    // 現在選択エレメントが縮小
    } else {
      $("repair_tree_frame").className = "tree_view_area_190px";
      $("repair_tree_root").className  = "tree_view_area_190px";
      $("repair_body_frame").className = "paragraph_view_area";
      $("repair_body_root").className  = "paragraph_view_area";
      $("repair_body_contents").contentWindow.Contents.$doChangViewArea_iPad();
      Element.$addClassName($("repair_resize_back"), "invisible");
      Element.$removeClassName($("repair_resize_enlarge"), "invisible");
      $("repair_resize_enlarge").focus();
    }
    Service.Repair.$resizeContents();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 全手順展開(展開アイコンクリック時)
 */
Service.Repair.prototype.doClickDisplayProcedureIcn = function() {
  var METHODNAME = "Service.Repair.prototype.doClickDisplayProcedureIcn";
  try {
    
    $("repair_body_contents").contentWindow.Contents.$expandAllProcess();
    
    Element.$removeClassName("repair_all_process_expand_g", "invisible");
    Element.$addClassName("repair_all_process_expand", "invisible");
    Element.$addClassName("repair_all_process_close_g", "invisible");
    Element.$removeClassName("repair_all_process_close", "invisible");
    $("repair_all_process_expand_g").focus();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 全手順折りたたみ(折りたたみアイコンクリック時)
 */
Service.Repair.prototype.doClickHideProcedureIcn = function() {
  var METHODNAME = "Service.Repair.prototype.doClickHideProcedureIcn";
  try {
    
    $("repair_body_contents").contentWindow.Contents.$closeAllProcess();
    
    Element.$addClassName("repair_all_process_expand_g", "invisible");
    Element.$removeClassName("repair_all_process_expand", "invisible");
    Element.$removeClassName("repair_all_process_close_g", "invisible");
    Element.$addClassName("repair_all_process_close", "invisible");
    $("repair_all_process_close_g").focus();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 要領参照リンク押下時の処理
 * @param {string} linkKey リンクキー
 */
Service.Repair.prototype.doClickReferenceLnk = function(linkKey) {
  var METHODNAME = "Service.Repair.prototype.doClickReferenceLnk";
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
    this.isShowFlow = true;
    
    Util.$propcopy(Service.Repair.HISTORY_TEMP, newHistory);
    keyIdx = currKey.indexOf("_");
    //アンカー情報が存在する場合
    if(keyIdx != -1) {
      refKey = currKey;
      currKey = currKey.substring(0, keyIdx);
    }
    splitKeys[3] = currKey;
    newHistory.PAR_ID = currKey;
    newHistory.KEY = splitKeys.join(",");
    
    this.showParagraph(newHistory, refKey, false, functionId, "");
    
    this.isCallback = true;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 手順詳細画面の表示
 * @param {string} paraId パラグラフID
 * @param {string} anchor アンカー
 */
Service.Repair.prototype.openProceduresWindow = function(paraId, anchor) {
  var METHODNAME = "Service.Repair.prototype.openProceduresWindow";
  try {
    
    var url = "";
    var target = "repair_body_contents" + Service.$getInitDate() + "ProcMode";
    
    url = Use.Util.$getContentsPath("C_SERVICE_FLOW_CONTENT_PATH", "", "", "");
    url = url.replace("{0}", paraId);
    url += "?PUB_TYPE=RM&MODE=3";
    if(anchor != "") {
      url += "#" + anchor;
    }
    
    Util.$openUrl(url, target, 
        Service.Repair.WINDOW_OPTION, Util.WINDOW_SIZE_2);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * タイトル選択のコールバック処理
 * @param {string} linkKey タイトル選択画面の選択リンクキー
 */
Service.Repair.prototype.doClickTitleLnk = function(linkKey) {
  var METHODNAME = "Service.Repair.prototype.doClickTitleLnk";
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
Service.Repair.prototype.getModelessParam = function(mode) {
  var METHODNAME = "Service.Repair.prototype.getModelessParam";
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
Service.Repair.prototype.setModelessParam = function(mode, key, val) {
  var METHODNAME = "Service.Repair.prototype.setModelessParam";
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
 * @return {Service.Repair} Service.Repair自身
 */
Service.Repair.$getInstance = function() {
  var METHODNAME = "Service.Repair.$getInstance";
  try {
    
    return Service.Repair.own;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}
