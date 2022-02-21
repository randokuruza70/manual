/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2014/05/13 */

/**
 * file service_ewd.js<br />
 *
 * @fileoverview このファイルには、閲覧画面(配線図)制御の関数が定義さ<br />
 * れています。<br />
 * file-> service_ewd.js
 * @author 原田
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/03/08|1.0.0|原田|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/03/08 1.0.0 原田・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 閲覧画面配線図
 * @class 閲覧画面配線図クラス
 */
Service.EWD = function() {
  var METHODNAME = "Service.EWD";
  try {
    
    this.paraArea     = null;
    this.treeTtlArea  = null;
    this.myGlobalInfo = null;
    this.history      = [];
    this.path         = "";
    this.selectInfo   = {};
    this.backFlg        = false;
    this.exitFunction   = null;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * Service.EWD自身
 * @type Service.EWD
 */
Service.EWD.own = new Service.EWD();
/**
 * 閲覧履歴テンプレート定数
 * @type object(連想配列)
 */
Service.EWD.HISTORY_TEMP = {
  "SELECT_PUB_TYPE"   : "",
  "SELECT_PUB"        : "",
  "SELECT_PUB_NO"     : "",
  "SELECT_SERVCAT"    : "",
  "SELECT_SERVCAT_ID" : "",
  "SELECT_SEC"        : "",
  "SELECT_SEC_ID"     : "",
  "SELECT_TTL"        : "",
  "SELECT_TTL_ID"     : "",
  "SELECT_SBTTL"      : "",
  "SELECT_SBTTL_ID"   : "",
  "SELECT_PARA"       : "",
  "SELECT_PARA_ID"    : "",
  "SELECT_LINK_KEY"   : "",
  "SELECT_LINK_PATH"  : ""
};

/**
 * 閲覧画面配線図クラスの初期化処理
 * @param {object(連想配列)} globalInfo グローバルインフォ
 */
Service.EWD.prototype.init = function(globalInfo) {
  var METHODNAME = "Service.EWD.prototype.init";
  try {
    
    //インスタンス変数初期化
    this.paraArea = $("tab_body_ewd");
    this.treeTtlArea = $("ewd_pub_id");
    
    this.myGlobalInfo = globalInfo;
    this.path = Use.Util.$getContentsPath(
      "C_SERVICE_EWD_PATH", "", "", "");
    
    // イベントの登録
    Use.Util.$observe($("ewd_history_back"), "click",
      (function(own) {
        return function() { own.doClickBackLnk(); };
      })(this)
    );
    Use.Util.$observe($("ewd_tree_close"), "click",
      (function(own) {
        return function() { own.doClickHideLnk(); };
      })(this)
    );
    Use.Util.$observe($("ewd_resize_back"), "click",
      (function(own) {
        return function(evt) { own.doClickShortenPaneLnk(evt); };
      })(this)
    );
    Use.Util.$observe($("ewd_resize_enlarge"), "click",
      (function(own) {
        return function(evt) { own.doClickShortenPaneLnk(evt); };
      })(this)
    );
    Use.Util.$observe($("ewd_print"), "click",
      (function(own) {
        return function() { own.doClickPrintLnk(); };
      })(this)
    );
    //iPad用スタイル追加
    Use.Util.$setStyle_iPad($("ewd_body"), "overflow: hidden;");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 初期表示(EWDタブクリック時)
 * @param {object(連想配列)} globalInfo グローバルインフォ
 */
Service.EWD.prototype.show = function(globalInfo, mode, linkKey) {
  var METHODNAME = "Service.EWD.prototype.show";
  try {
    
    var myKey = linkKey == "0" ? "" : linkKey;
    
    Util.$propcopy(Service.EWD.HISTORY_TEMP, this.selectInfo);
    
    Service.$setEWDProperty(myKey, mode);
    
    // 共通情報の保持
    this.myGlobalInfo = globalInfo;
    
    //コンテンツ表示設定
    Element.$removeClassName(this.paraArea, "invisible");
    // コンテンツ種別区分が"10"の場合は新構成として処理
    if(this.myGlobalInfo.EWD_CONTENTS_TYPE_GROUPS == DictConst.C_CONTENTS_TYPE_NEW) {
      this.processForNewConfiguration();
    // コンテンツ種別区分が"10"以外の場合は旧構成として処理
    } else {
      this.processForOldConfiguration();
    }
    
    Util.$enableWindow();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 新構成用処理
 * @private
 */
Service.EWD.prototype.processForNewConfiguration = function() {
  var METHODNAME = "Service.EWD.prototype.processForNewConfiguration";
  try {
    var _callback = function(instance, evt) {
      instance.showContentsEnd();
    };
    
    this.exitFunction = function() {
      this.addHistory(this.getSelectInfo());
      
      $("ewd_tree_frame").className = "tree_view_area_190px";
      $("ewd_body_frame").className = "paragraph_view_area";
      Element.$removeClassName($("ewd_resize_enlarge"), "invisible");
      Element.$addClassName($("ewd_resize_back"), "invisible");
      
      Util.$closeIframe("ewd_body");
      
      this.treeTtlArea.innerHTML = "";
    };
    
    Use.Util.$openIframe("ewd_body", this.path, "0", "", "no",
        _callback.curry(this));
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 旧構成用処理（レガシー配線図のみ対応）
 * @private
 */
Service.EWD.prototype.processForOldConfiguration = function() {
  var METHODNAME = "Service.EWD.prototype.processForOldConfiguration";
  try {
    
    var url = Use.Util.$getContentsPath("C_SERVICE_EWD_LEGACY_INDEX");
    var _callback = function(instance, evt) {
      instance.showContentsEnd();
    };
    
    Util.$closeIframe("tab_body_ewd");
    Use.Util.$openIframe("tab_body_ewd", url, "0", "", "no",
        _callback.curry(this));
    
    Service.EWD.exitFunction = function() {
      // 画面の初期化
      Util.$closeIframe("tab_body_ewd");
      this.myGlobalInfo = {};
    };
    
    this.exitFunction = function() {
      // 画面の初期化
      Util.$closeIframe("tab_body_ewd");
      this.myGlobalInfo = {};
    };
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * タブクローズ処理
 */
Service.EWD.prototype.close = function() {
  var METHODNAME = "Service.EWD.prototype.close";
  try {
    
    Element.$addClassName(this.paraArea, "invisible");
    
    this.exitFunction();
    this.exitFunction = null;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴を戻る(戻るアイコンクリック時)
 */
Service.EWD.prototype.doClickBackLnk = function() {
  var METHODNAME = "Service.EWD.prototype.doClickBackLnk";
  try {
    
    $("ewd_body_contents").contentWindow.VWEWDContents.$previous();
    this.backFlg = true;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 印刷イメージ表示画面表示
 */
Service.EWD.prototype.doClickPrintLnk = function() {
  var METHODNAME = "Service.EWD.prototype.doClickPrintLnk";
  try {
    
    $("ewd_body_contents").contentWindow.VWEWDContents.$showPrintWindow();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ツリー表示エリアの非表示(ツリー表示エリア非表示アイコンクリック時)
 */
Service.EWD.prototype.doClickHideLnk = function() {
  var METHODNAME = "Service.EWD.prototype.doClickHideLnk";
  try {
    
    $("ewd_tree_frame").className = "tree_view_area_none";
    $("ewd_body_frame").className = "paragraph_view_area_all";
    Element.$addClassName($("ewd_resize_back"), "invisible");
    Element.$removeClassName($("ewd_resize_enlarge"), "invisible");
    $("ewd_resize_enlarge").focus();
    
    $("ewd_body_contents").contentWindow.VWEWDContents.$minimizeTreeArea();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ツリー表示エリアの拡大、縮小(ツリー表示エリア拡大アイコンクリック時)
 * @param {Event} evt イベントオブジェクト
 */
Service.EWD.prototype.doClickShortenPaneLnk = function(evt) {
  var METHODNAME = "Service.EWD.prototype.doClickShortenPaneLnk";
  try {
    
    var ele = Event.$element(evt);
    // イベントのエレメントがimgの場合、親要素のaタグのエレメントを取得する
    if(ele.tagName.toLowerCase() == "img") {
      ele = ele.parentNode;
    }
    
    // 現在選択エレメントが拡大か判定
    if(ele.id == "ewd_resize_enlarge") {
      // ツリー(上部)エレメントのクラス名が非表示か判定
      if($("ewd_tree_frame").className == "tree_view_area_none") {
        $("ewd_tree_frame").className = "tree_view_area_190px";
        $("ewd_body_frame").className = "paragraph_view_area";
        
        $("ewd_body_contents").contentWindow.VWEWDContents.$resetTreeArea();
      // ツリー(上部)エレメントのクラス名が非表示以外
      } else {
        $("ewd_tree_frame").className = "tree_view_area_350px";
        $("ewd_body_frame").className = "paragraph_view_area_half";
        Element.$addClassName($("ewd_resize_enlarge"), "invisible");
        Element.$removeClassName($("ewd_resize_back"), "invisible");
        $("ewd_resize_back").focus();
        
        $("ewd_body_contents").contentWindow.VWEWDContents.$maximizeTreeArea();
      }
      
    // 現在選択エレメントが縮小
    } else {
      $("ewd_tree_frame").className = "tree_view_area_190px";
      $("ewd_body_frame").className = "paragraph_view_area";
      Element.$addClassName($("ewd_resize_back"), "invisible");
      Element.$removeClassName($("ewd_resize_enlarge"), "invisible");
      $("ewd_resize_enlarge").focus();
      
      $("ewd_body_contents").contentWindow.VWEWDContents.$resetTreeArea();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ツールアイコンの状態制御処理
 */
Service.EWD.prototype.doChangeToolIconState = function() {
  var METHODNAME = "Service.EWD.prototype.doChangeToolIconState";
  try {
    
    var len = this.getHistoryLength();
    
    // 閲覧履歴がある場合は戻るボタンの活性処理
    if(len > 0) {
      Element.$removeClassName($("ewd_history_back"), "invisible");
      Element.$addClassName($("ewd_history_back_g"), "invisible");
      // 戻るボタンの押下後であれば戻るボタンにフォーカスを合わせる
      if(this.backFlg){
        $("ewd_history_back").focus();
        this.backFlg = false;
      }
      
    // 閲覧履歴が無い場合は戻るボタンの非活性処理
    } else {
      Element.$addClassName($("ewd_history_back"), "invisible");
      Element.$removeClassName($("ewd_history_back_g"), "invisible");
      // 戻るボタンの押下後であれば非活性戻るボタンにフォーカスを合わせる
      if(this.backFlg){
        $("ewd_history_back_g").focus();
        this.backFlg = false;
      }
      
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * モーダレス画面の引継ぎ情報用の取得処理
 * @param {string} mode モード
 * @return {object(連想配列)} 引継ぎ情報
 */
Service.EWD.prototype.getModelessParam = function(mode) {
  var METHODNAME = "Service.EWD.prototype.getModelessParam";
  try {
    
    // 何もしない
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * インスタンス取得処理
 * @return {Service.EWD} Service.EWD自身
 */
Service.EWD.$getInstance = function() {
  var METHODNAME = "Service.EWD.$getInstance";
  try {
    
    return Service.EWD.own;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

// ---------- 配線図要求API対応 ----------

/**
 * コンテンツ表示処理開始処理 (外部呼び出し用)
 */
Service.EWD.$showContentsStart = function() {
  var METHODNAME = "Service.EWD.$showContentsStart";
  try {
    
    Service.EWD.own.showContentsStart();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, "", true);
  }
};

/**
 * コンテンツ表示処理開始処理
 */
Service.EWD.prototype.showContentsStart = function() {
  var METHODNAME = "Service.EWD.prototype.showContentsStart";
  try {
    
    var aryDisableArea = [$("header"), $("ewd_head")];
    Util.$disableArea(aryDisableArea);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツ表示処理終了処理 (外部呼び出し用)
 */
Service.EWD.$showContentsEnd = function() {
  var METHODNAME = "Service.EWD.$showContentsEnd";
  try {
    
    Service.EWD.own.showContentsEnd();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, "", true);
  }
};

/**
 * コンテンツ表示処理終了処理
 */
Service.EWD.prototype.showContentsEnd = function() {
  var METHODNAME = "Service.EWD.prototype.showContentsEnd";
  try {
    
    Util.$enableArea();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー上部 パブNo設定処理 (外部呼び出し用)
 * @param {string} pubNo パブNo
 */
Service.EWD.$setPubNo = function(pubNo) {
  var METHODNAME = "Service.EWD.$setPubNo";
  try {
    
    Service.EWD.own.setPubNo(pubNo);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, "", true);
  }
}

/**
 * ツリー上部 パブNo設定処理
 * @param {string} pubNo パブNo
 */
Service.EWD.prototype.setPubNo = function(pubNo) {
  var METHODNAME = "Service.EWD.prototype.setPubNo";
  try {
    
    this.treeTtlArea.innerHTML = pubNo;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 選択情報設定処理 (外部呼び出し用)
 * @param {object(連想配列)} selInfo 選択情報
 */
Service.EWD.$setSelectInfo = function(selInfo) {
  var METHODNAME = "Service.EWD.$setSelectInfo";
  try {
    
    Service.EWD.own.setSelectInfo(selInfo);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, "", true);
  }
}

/**
 * 選択情報設定処理
 * @param {object(連想配列)} selInfo 選択情報
 */
Service.EWD.prototype.setSelectInfo = function(selInfo) {
  var METHODNAME = "Service.EWD.prototype.setSelectInfo";
  try {
    
    this.selectInfo = {};
    
    Util.$propcopy(Service.EWD.HISTORY_TEMP, this.selectInfo);
    Util.$propcopy(selInfo, this.selectInfo);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 選択情報取得処理 (外部呼び出し用)
 * @return {object(連想配列)} 選択情報
 */
Service.EWD.$getSelectInfo = function() {
  var METHODNAME = "Service.EWD.$getSelectInfo";
  try {
    
    return Service.EWD.own.getSelectInfo();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, "", true);
  }
};

/**
 * 選択情報取得処理
 * @return {object(連想配列)} 選択情報
 */
Service.EWD.prototype.getSelectInfo = function() {
  var METHODNAME = "Service.EWD.prototype.setSelectInfo";
  try {
    
    var mySelectInfo = {};
    Util.$propcopy(this.selectInfo, mySelectInfo);
    return mySelectInfo;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 閲覧履歴登録処理 (外部呼び出し用)
 * @param {object(連想配列)} hisInfo 閲覧履歴
 */
Service.EWD.$addHistory = function(hisInfo) {
  var METHODNAME = "Service.EWD.$addHistory";
  try {
    
    Service.EWD.own.addHistory(hisInfo);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, "", true);
  }
}

/**
 * 閲覧履歴登録処理
 * @param {object(連想配列)} hisInfo 閲覧履歴
 */
Service.EWD.prototype.addHistory = function(hisInfo) {
  var METHODNAME = "Service.EWD.prototype.addHistory";
  try {
    
    var idx = 0;
    var prevHistory = {};
    
    // 対象の履歴にプロパティがある場合のみ追加
    if(hisInfo.SELECT_LINK_KEY != undefined &&
       hisInfo.SELECT_LINK_KEY != "") {
      
      // 履歴が1件以上ある場合、1つ前の履歴と比較
      if(this.history.length > 0) {
        idx = this.history.length - 1;
        Util.$propcopy(this.history[idx], prevHistory);
        
        // 最新履歴と現在履歴が違う場合のみ、追加処理を行う
        if(prevHistory.SELECT_LINK_KEY != hisInfo.SELECT_LINK_KEY) {
          this.history.push(hisInfo);
          //最大履歴数を超えた場合は最古の閲覧履歴を削除
          if(this.history.length > 5) {
            this.history.shift();
          }
        }
      // 履歴が1件も無い場合、そのまま登録
      } else {
        this.history.push(hisInfo);
      }
      
      // ツールアイコンの状態制御
      this.doChangeToolIconState();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴取得処理 (外部呼び出し用)
 * @return object(連想配列) 閲覧履歴
 */
Service.EWD.$getHistory = function() {
  var METHODNAME = "Service.EWD.$getHistory";
  try {
    
    return Service.EWD.own.getHistory();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, "", true);
  }
}

/**
 * 閲覧履歴取得処理
 * @return object(連想配列) 閲覧履歴
 */
Service.EWD.prototype.getHistory = function() {
  var METHODNAME = "Service.EWD.prototype.getHistory";
  try {
    
    var idx = 0;
    var ret = null;
    
    // 閲覧履歴が存在する場合は最新の閲覧履歴を取得
    if(this.history.length) {
      ret = {};
      idx = this.history.length - 1;
      Util.$propcopy(this.history[idx], ret);
      
      // 最新の閲覧履歴を削除する
      this.history.pop();
    }
    
    // ツールアイコンの状態制御
    this.doChangeToolIconState();
    
    return ret;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧履歴数取得処理 (外部呼び出し用)
 * @return number 閲覧履歴数
 */
Service.EWD.$getHistoryLength = function() {
  var METHODNAME = "Service.EWD.$getHistoryLength";
  try {
    
    return Service.EWD.own.getHistoryLength();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, "", true);
  }
}

/**
 * 閲覧履歴数取得処理
 * @return number 閲覧履歴数
 */
Service.EWD.prototype.getHistoryLength = function() {
  var METHODNAME = "Service.EWD.prototype.getHistoryLength";
  try {
    
    return this.history.length;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 
 */
Service.EWD.$showSystemError = function(errObj, methodName) {
  var METHODNAME = "Service.EWD.$showSystemError";
  try {
    
    Use.SystemError.$show(errObj, methodName, "", true);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, "", true);
  }
}
