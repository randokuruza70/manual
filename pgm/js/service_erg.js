/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2011/12/16 */

/**
 * file service_erg.js<br />
 *
 * @fileoverview このファイルには、閲覧画面(ERG)制御の関数が定義されて<br />
 * います。<br />
 * file-> service_erg.js
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
 * 閲覧画面ERG
 * @class 閲覧画面ERGクラス
 */
Service.ERG = function() {
  var METHODNAME = "Service.ERG";
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
 * Service.ERG自身
 * @type Service.ERG
 */
Service.ERG.own = new Service.ERG();

/**
 * 閲覧画面ERGクラスの初期化処理
 * @param {object(連想配列)} globalInfo グローバルインフォ
 */
Service.ERG.prototype.init = function(globalInfo) {
  var METHODNAME = "Service.ERG.prototype.init";
  try {
    
    //インスタンス変数初期化
    this.paraArea = $("tab_body_erg");
    this.myGlobalInfo = globalInfo;
    this.path = Use.Util.$getContentsPath(
      "C_SERVICE_ERG_PATH", "", "", "");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 初期表示(ERGタブクリック時)
 * @param {object(連想配列)} globalInfo グローバルインフォ
 */
Service.ERG.prototype.show = function(globalInfo) {
  var METHODNAME = "Service.ERG.prototype.show";
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
    Use.Util.$openIframe("tab_body_erg", this.path, "0", "", "no",
        _callback.curry(this));
    
    Util.$enableWindow();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * コンテンツ表示処理開始処理
 */
Service.ERG.prototype.showContentsStart = function() {
  var METHODNAME = "Service.ERG.prototype.showContentsStart";
  try {
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツ表示処理終了処理
 */
Service.ERG.prototype.showContentsEnd = function() {
  var METHODNAME = "Service.ERG.prototype.showContentsEnd";
  try {
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * モーダレス画面の引継ぎ情報用の取得処理
 * @return {object(連想配列)} 引継ぎ情報
 */
Service.ERG.prototype.getModelessParam = function() {
  var METHODNAME = "Service.ERG.prototype.getModelessParam";
  try {
    
    return this.mySuccession;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * タブクローズ処理
 */
Service.ERG.prototype.close = function() {
  var METHODNAME = "Service.ERG.prototype.close";
  try {
    
    this.myGlobalInfo = null;
    this.mySuccession = null;
    Element.$addClassName(this.paraArea, "invisible");
    Util.$closeIframe("tab_body_erg");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * インスタンス取得処理
 * @return {Service.ERG} Service.ERG自身
 */
Service.ERG.$getInstance = function() {
  var METHODNAME = "Service.ERG.$getInstance";
  try {
    
    return Service.ERG.own;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}
