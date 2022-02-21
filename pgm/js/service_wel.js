/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2011/12/16 */

/**
 * file service_wel.js<br />
 *
 * @fileoverview このファイルには、閲覧画面(ウェルキャブ)制御の関数が<br />
 * 定義されています。<br />
 * file-> service_wel.js
 * @author 原田
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/03/04|1.0.0|原田|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/03/04 1.0.0 原田・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 閲覧画面ウェルキャブ
 * @class 閲覧画面ウェルキャブクラス
 */
Service.WEL = function() {
  var METHODNAME = "Service.WEL";
  try {
    
    this.paraArea     = null;
    this.myGlobalInfo = null;
    this.mySuccession = null;
    this.path         = "";
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * Service.WEL自身
 * @type Service.WEL
 */
Service.WEL.own = new Service.WEL();

/**
 * 閲覧画面ウェルキャブクラスの初期化処理
 * @param {object(連想配列)} globalInfo グローバルインフォ
 */
Service.WEL.prototype.init = function(globalInfo) {
  var METHODNAME = "Service.WEL.prototype.init";
  try {
    
    //インスタンス変数初期化
    this.paraArea = $("tab_body_wel");
    this.myGlobalInfo = globalInfo;
    this.path = Use.Util.$getContentsPath(
      "C_SERVICE_WEL_PATH", "", "", "");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 初期表示(WELタブクリック時)
 * @param {object(連想配列)} globalInfo グローバルインフォ
 */
Service.WEL.prototype.show = function(globalInfo) {
  var METHODNAME = "Service.WEL.prototype.show";
  try {

    var _callback = function(instance, evt) {
      instance.showContentsEnd();
    };
    this.showContentsStart();
    
    this.myGlobalInfo = globalInfo;
    this.mySuccession = {
      VIEW_LANG: this.myGlobalInfo.VIEW_LANG,
      LANG_CODE: this.myGlobalInfo.LANG_CODE,
      FROM_DATE: this.myGlobalInfo.FROM_DATE,
      CAR_TYPE:  this.myGlobalInfo.CAR_TYPE,
      FOR_LANG:  this.myGlobalInfo.FOR_LANG,
      BRAND:     this.myGlobalInfo.BRAND,
      TYPE:      this.myGlobalInfo.TYPE,
      ENGINE:    "",
      VIN:       "",
      MY:        "",
      PUB_ID:    "",
      PUB_TYPE:  "",
      PUB_NAME:  "",
      MODE:      "",
      PAR:       "",
      PAR_ID:    "",
      SBPARA_ID: "",
      FUNC_ID:   "MAN04"
    };
    
    //コンテンツ表示設定
    Element.$removeClassName(this.paraArea, "invisible");
    Use.Util.$openIframe("tab_body_wel", this.path, "0", "", "no",
        _callback.curry(this));
    
    Util.$enableWindow();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * コンテンツ表示処理開始処理
 */
Service.WEL.prototype.showContentsStart = function() {
  var METHODNAME = "Service.WEL.prototype.showContentsStart";
  try {
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツ表示処理終了処理
 */
Service.WEL.prototype.showContentsEnd = function() {
  var METHODNAME = "Service.WEL.prototype.showContentsEnd";
  try {
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * モーダレス画面の引継ぎ情報用の取得処理
 * @return {object(連想配列)} 引継ぎ情報
 */
Service.WEL.prototype.getModelessParam = function() {
  var METHODNAME = "Service.WEL.prototype.getModelessParam";
  try {
    
    return this.mySuccession;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * タブクローズ処理
 */
Service.WEL.prototype.close = function() {
  var METHODNAME = "Service.WEL.prototype.close";
  try {
    
    this.myGlobalInfo = null;
    this.mySuccession = null;
    Element.$addClassName(this.paraArea, "invisible");
    Util.$closeIframe("tab_body_wel");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * インスタンス取得処理
 * @return {Service.WEL} Service.WEL自身
 */
Service.WEL.$getInstance = function() {
  var METHODNAME = "Service.WEL.$getInstance";
  try {
    
    return Service.WEL.own;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}
