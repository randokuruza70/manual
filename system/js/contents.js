/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2015/04/01 */

/**
 * file contents.js<br />
 *
 * @fileoverview このファイルには、コンテンツについての処理が<br />
 * 定義されています。<br />
 * file-> contents.js
 * @author 渡会
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/11/16|1.0.0|渡会|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/03/01 渡会 ・新規作成
 *---------------------------------------------------------------------------*/
/**
 * コンテンツクラス
 * @namespace Contentsクラス
 */
var Contents = {};

/**
 * フェイスボックスインスタンス
 * @type FaceBox
 */
Contents.faceBox = null;

/**
 * コンテンツの親情報
 * @type object(document)
 */
Contents.myParent = null;

/**
 * 引継ぎ情報
 * @type object(連想配列)
 */
Contents.mySuccession = {};

/**
 * 引継ぎ情報
 * @type object(連想配列)
 */
Contents.mySuccessionMode0 = {};

/**
 * 引継ぎ情報
 * @type object(連想配列)
 */
Contents.mySuccessionMode3 = {};

/**
 * 表示マニュアルのPUB_TYPE
 * @type string
 */
Contents.showPubType = "";

/**
 * 表示マニュアルの表示モード
 * @type string
 */
Contents.showMode = "";

/**
 * 手順展開・折りたたみの状態
 * @type number
 */
Contents.expandState = 0;

/**
 * 現在の画面の表示サイズ
 * @type number
 */
Contents.currHeight = 633;

/**
 * WindowOpen時のターゲット指定用時間
 */
Contents.initDate = 0;

/**
 * WindowOpen時のターゲット指定用タブ名称
 */
Contents.tabName = "";

/**
 * 新規Window表示時のオプション定数
 * @type string
 */
Contents.WINDOW_OPTION = "\
left=0,top=0,toolbar=no,menubar=no,\
directories=no,status=no,scrollbars=yes,resizable=yes";

/**
 * コンテンツクラスの初期化処理
 */
Contents.$init = function() {
  var METHODNAME = "Contents.$init";
  try {
    
    var objQuary = {};
    var pubType = "";
    var mode = "";
    var parent = null;
    var strAnchor = "";
    
    Contents.faceBox = new Facebox();
    
    Use.$init(Contents.faceBox);
    
    objQuary = Contents.$getQuaryString();
    // クエリ文字列からPUB_TYPEを取得
    if(Util.$isUndefined(objQuary.PUB_TYPE) == false 
        && objQuary.PUB_TYPE != null) {
      pubType = objQuary.PUB_TYPE;
    }
    // クエリ文字列からMODEを取得
    if(Util.$isUndefined(objQuary.MODE) == false 
        && objQuary.MODE != null) {
      mode = objQuary.MODE;
    }
    
    // 親情報の取得元を決定する
    parent = window.opener || window.parent;
    
    // 以下の条件で親DOM情報を取得する
    // 1. Topがある場合はこれを親とする。無ければ2へ。
    // 2. Serviceがある場合はこれを親とする。無ければ3へ。
    // 3. Contentsを親とする。無ければ4へ。
    // 4. 単体起動時。自分を親とする。
    Contents.myParent = parent.Top 
        || parent.Service 
        || parent.Contents 
        || window.Contents;
    Util.$propcopy(
        Contents.myParent.$getModelessParam(pubType, mode), 
        Contents.mySuccession);
    //項目の追加
    if(Util.$isUndefined(Contents.mySuccession.CAR_NAME) 
        && !Util.$isUndefined(Contents.myParent.globalInfo)) {
      Contents.$setModelessParam("", "CAR_NAME",
          Contents.myParent.globalInfo.CAR_NAME);
      if(!Util.$isUndefined(Contents.myParent.globalInfo.RM_NO_OFR_ALT_PUB)) {
        Contents.$setModelessParam("", "RM_NO_OFR_ALT_PUB",
            Contents.myParent.globalInfo.RM_NO_OFR_ALT_PUB);
        Contents.$setModelessParam("", "NM_NO_OFR_ALT_PUB",
            Contents.myParent.globalInfo.NM_NO_OFR_ALT_PUB);
        Contents.$setModelessParam("", "EM_NO_OFR_ALT_PUB",
            Contents.myParent.globalInfo.EM_NO_OFR_ALT_PUB);
        Contents.$setModelessParam("", "BM_NO_OFR_ALT_PUB",
            Contents.myParent.globalInfo.BM_NO_OFR_ALT_PUB);
      }
    }
    // 画面表示言語の設定
    Use.Util.$setViewLang(Contents.mySuccession.VIEW_LANG);
    
    Contents.showPubType = Contents.mySuccession.PUB_TYPE;
    Contents.showMode = Contents.mySuccession.MODE;
    Contents.initDate = Contents.myParent.$getInitDate();
    
    // 処理タイプの取得
    // html内にglobalPubNoがあればtrueを設定し、無ければfalseを設定する
    Contents.operationType = $$("span.globalPubNo")[0] ? true : false;
    
    // 処理タイプがtrueの場合は修理書・解説書処理を行う
    if(Contents.operationType) {
      strAnchor = window.location.hash;
      Contents.$processForRMAndNCF();
      // アンカーがある場合、スクロール処理を呼び出す
      if(Util.$isUndefined(strAnchor) == false 
          && strAnchor != null 
          && strAnchor != "") {
        strAnchor = strAnchor.substring(1);
        // ウィンドウの高さ取得に失敗した場合
        if(Util.$getClientHeight(true) == 0) {
          // ウィンドウの高さの確定待ち
          Use.Util.$delay(function() { Util.$jumpAnchor(strAnchor); }, 0.1);
        } else {
          Use.Util.$observe(window, "load", function() {
              Util.$jumpAnchorIE(strAnchor);
          });
        }
      }
    // 処理タイプがfalseの場合は他マニュアル処理を行う
    } else {
      Contents.$processForOtherManual();
      Use.Util.$addClassName_iPad($$("div#header div.fontJa div#navigation p")[0],"iPad");
      Use.Util.$setStyle_iPad($$("div#footer div.fontJa")[0],"font-size: 13px !important;");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 修理書・解説書用処理
 */
Contents.$processForRMAndNCF = function() {
  var METHODNAME = "Contents.$processForRMAndNCF";
  try {
    
    var chgState = function(isModeless, isPrint) {
      // モーダレスフラグがtrueの場合はモーダレス時の処理
      if(isModeless) {
        $$("html")[0].className = "noscrollbar";
        $("body").className = "modeless_body";
        $("wrapper").className = "modeless_wrapper";
      // falseの時はコンテンツ内表示の処理
      } else {
        $("wrapper").className = "wrapper";
      }
      
      // 印刷用CSSが存在する場合のみ処理
      if($$("link#print_css")[0]) {
        $("print_css").disabled = isPrint;
      }
    }
    var sbparaId = Contents.mySuccession.SBPARA_ID;
    var idSec = "";
    var idTtl = "";
    var logParam = Contents.$getEntoryLogParam();
    
    Contents.tabName = window.name;
    
    Contents.$changeElementState();
    
    // 参照モード(デフォルト)
    if(Contents.showMode == "0") {
      Util.$printLayout();
      chgState(true, true);
      Contents.$setExpandElement(false);
      Contents.$visibleSubParagraph();
      Contents.$createFrame();
      Contents.$setWindowResizeEvent();
      Contents.$observeShowPDF();
      Contents.$observeShowSWF();
      Contents.$observeShowGIF();
      Contents.$observeShowGTS();
      document.title = Use.Util.$getMessage("CONST_CONTENTS_TITLE_REFERENCE");
      Use.Util.$addClassName_iPad($$("div#header div.fontJa div#navigation p")[0],"iPad");
      Use.Util.$setStyle_iPad($$("div#footer div.fontJa")[0],"font-size: 13px !important;");
    
    // 印刷モード
    } else if(Contents.showMode == "1") {
      Util.$printLayout();
      chgState(true, false);
      Contents.$createFrame();
      Contents.$setWindowResizeEvent();
      Contents.$visibleSubParagraph();
      Contents.$setHideElement();
      document.title = Use.Util.$getMessage("CONST_CONTENTS_TITLE_PRINT");
      Use.Util.$addClassName_iPad($$("div#header div.fontJa div#navigation p")[0],"iPad");
      Use.Util.$setStyle_iPad($$("div#footer div.fontJa")[0],"font-size: 13px !important;");
    
    // 技術解説モード
    } else if(Contents.showMode == "2") {
      Util.$printLayout();
      chgState(true, true);
      Contents.$setExpandElement(false);
      Contents.$visibleSubParagraph(sbparaId);
      Contents.$createFrame();
      Contents.$setWindowResizeEvent();
      Contents.$observeShowPDF();
      Contents.$observeShowSWF();
      Contents.$observeShowGIF();
      Contents.$observeShowGTS();
      document.title = Use.Util.$getMessage("CONST_CONTENTS_TITLE_DIAGNOSTIC");
      Use.Util.$addClassName_iPad($$("div#header div.fontJa div#navigation p")[0],"iPad");
      Use.Util.$setStyle_iPad($$("div#footer div.fontJa")[0],"font-size: 13px !important;");
      
    // 手順詳細モード
    } else if(Contents.showMode == "3") {
      Util.$printLayout();
      chgState(true, true);
      Contents.$setExpandElement(false);
      Contents.$visibleSubParagraph();
      Contents.$createFrame();
      Contents.$setWindowResizeEvent();
      Contents.$observeShowPDF();
      Contents.$observeShowSWF();
      Contents.$observeShowGIF();
      Contents.$observeShowGTS();
      document.title = Use.Util.$getMessage("CONST_CONTENTS_TITLE_INSPECTION");
      Use.Util.$addClassName_iPad($$("div#header div.fontJa div#navigation p")[0],"iPad");
      Use.Util.$setStyle_iPad($$("div#footer div.fontJa")[0],"font-size: 13px !important;");
      
    // コンテンツ内表示モード
    } else {
      chgState(false, true);
      // 診断フロー、手順一覧以外の場合のみ処理
      if(!(Contents.FlowHandler.$isFlow() || Contents.FlowHandler.$isList())) {
        Contents.$visibleSubParagraph();
      }
      Contents.$observeCallout();
      Contents.$observeShowPDF();
      Contents.$observeShowSWF();
      Contents.$observeShowGIF();
      Contents.$observeShowGTS();
      
      Contents.expandState = $$("p.s1").length;
      
      Contents.myParent.$callbackParagraph(
        Contents.$getGlobalInfo(),
        Contents.$setExpandElement(true),
        Contents.$getFlowAlertContentsId()
      );
      
      if(Contents.FlowHandler) {
        // 診断フローの場合は診断フロー用INITの呼び出し
        if(Contents.FlowHandler.$isFlow()) {
          // 診断フロー初期化呼び出し
          Contents.FlowHandler.$init();
        // 手順一覧の場合は手順一覧用のイベントを登録
        } else if(Contents.FlowHandler.$isList()) {
          // 手順一覧初期化呼び出し
          Contents.$observeShowProcLnk();
        }
      }
      document.title = Use.Util.$getMessage("CONST_CONTENTS_TITLE_PROC");
      Use.Util.$setStyle_iPad($("wrapper"),"overflow: auto;");
      Contents.$doChangViewArea_iPad();
    }
    
    // 指示文字描画処理
    Contents.$renderIndicator();
    // 手順名称の幅を動的に調整し、品名コードの表示領域を確保する
    Contents.$keepPartCodeArea();
    Use.Util.$observe(window, "resize", 
        function() { Contents.$keepPartCodeArea(); });
    
    // 機能IDを引き継いでいる場合のみ処理
    if(Contents.mySuccession.FUNC_ID) {
      
      // セクションID、タイトルIDを取得
      idSec = $$("span.globalSection")[0] ? 
            $$("span.globalSection")[0].innerHTML : "";
      idTtl = $$("span.globalTitle")[0] ? 
            $$("span.globalTitle")[0].innerHTML : "";
      
      // セクションID、タイトルIDの先頭"_"アンダースコアを除去
      if(idSec.indexOf("_") == 0){
        idSec = idSec.substring(1);
      }
      if(idTtl.indexOf("_") == 0){
        idTtl = idTtl.substring(1);
      }
      
      // 閲覧ログの登録処理
      Use.Util.$entryServiceLog(
        "0",
        Contents.mySuccession.FUNC_ID,
        Contents.mySuccession.PUB_TYPE,
        Contents.mySuccession.PUB_ID,
        "",
        idSec,
        "",
        idTtl,
        "",
        $$("span.globalSubTitle")[0] ? 
            $$("span.globalSubTitle")[0].innerHTML : "",
        "",
        Contents.mySuccession.PAR_ID,
        "",
        logParam.modelName,
        logParam.fromDate,
        logParam.noOfrAltPub
      );
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 他マニュアル用処理
 */
Contents.$processForOtherManual = function() {
  var METHODNAME = "Contents.$processForOtherManual";
  try {
    
    var type = {
      "Top": Util.WINDOW_SIZE_1,
      "RM":  Util.WINDOW_SIZE_2,
      "NM":  Util.WINDOW_SIZE_2,
      "EM":  Util.WINDOW_SIZE_2,
      "BM":  Util.WINDOW_SIZE_2,
      "OM":  Util.WINDOW_SIZE_2,
      "WC":  Util.WINDOW_SIZE_2,
      "HR":  Util.WINDOW_SIZE_2,
      "DM":  Util.WINDOW_SIZE_2,
      "ER":  Util.WINDOW_SIZE_2,
      "OT":  Util.WINDOW_SIZE_2
    };
    var els = $$("div#contents_body a");
    var len = 0;
    var span = null;
    var tab = Contents.myParent.$getCurrentTabName();
    var target = tab + "ModelessWindow_" + Contents.myParent.$getInitDate();
    var footEle = null;
    var option = Contents.WINDOW_OPTION;
    var path = "..";
    var windowSize = type[tab];
    Contents.tabName = tab;
    
    // Top画面から全車共通／他マニュアルのindex.htmlを表示した場合の処理
    if(tab == "Top") {
      path = "../..";
      target = "_blank";
      document.title = Use.Util.$getMessage("CONST_TOP_OTHER_MANUAL_TITLE");
      Element.$remove("footer");
      footEle = document.createElement("div");
      footEle.id = "footer";
      Element.$insert("contents_body", footEle);
      Contents.$setWindowResizeEvent();
    // 閲覧画面から全車共通／他マニュアルのindex.htmlを表示した場合の処理
    } else if(tab == "OT") {
      path = "../..";
    // ウェルキャブを選択した場合
    } else if(tab == "WC") {
      Contents.$doChangePDate(tab);
      // index.htmlの構成によって対象のエレメントを切り替える
      if($$("div#contents_body td.wmbManual a")[0]) {
        els = $$("div#contents_body td.wmbManual a");
      } else {
        els = $$("div#contents_body td.wmhManual a");
      }
    //その他のタブを選択した場合
    } else {
      Contents.$doChangePDate(tab);
      // index.htmlの構成によって対象のエレメントを切り替える
      if($$("div#contents_body td.ombManual a")[0]) {
        els = $$("div#contents_body td.ombManual a");
      } else {
        els = $$("div#contents_body td.omhManual a");
      }
    }
    len = els.length;
    
    // コンテンツ内の"a"タグ数分ループする
    for(var i = 0; i < len; i++) {
      span = Util.Selector.$select("span.invisible", els[i])[0];
      Use.Util.$observe(els[i], "click",
        (function(path, tgt, opt, winSize) {
          return function() {
              Contents.$doClickManualLnk(path, tgt, opt, winSize);
            }
        })(path + span.innerHTML, target, option, windowSize)
      );
    }
    
    //モーダレス画面として呼出し
    if(window.opener) {
      Contents.$createFrame(true);
      
      Element.$addClassName($("wrapper"), "modeless_wrapper");
      Element.$addClassName($$("body")[0], "modeless");
      Element.$addClassName($("contents"), "modeless_contents");
      Element.$addClassName($$("div.referenceManualHead")[0], "invisible");
      Element.$addClassName(
        $$("div.referenceManualBody")[0], "modelessReferenceManualBody");
      Element.$addClassName($$("html")[0], "noscrollbar");
      
    //iframeとして呼出し
    } else {
      Element.$addClassName($("wrapper"), "wrapper");
      //スクロールエリアのリサイズイベント
      Contents.$setScrollAreaResizeEvent();
      //ipadのみスタイルを追加
      Use.Util.$setStyle_iPad($("wrapper"),"overflow: hidden;");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * Faceboxインスタンス取得
 * @return {Facebox} Faceboxインスタンス
 */
Contents.$getFacebox = function() {
  var METHODNAME = "Contents.$getFacebox";
  try {
    
    return Contents.faceBox;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 親のiframe領域の縦幅
 * @private
 * @type number
 */
Contents.currIFrameHeight = null;

/**
 * コンテンツスクロールエリアのイベント設定処理
 */
Contents.$setScrollAreaResizeEvent = function() {
  var METHODNAME = "Contents.$setScrollAreaResizeEvent";
  try {

    var myFunc = function() {
      var scrollArea = Contents.currScrollArea;
      var myStyle = { height: "" };
      var elmH = 0;
      var rate = 0;

      // スクロールエリアのサイズが未取得の場合は取得する
      if(Contents.currIFrameHeight === null) {
        Contents.currIFrameHeight = Element.$getHeight(parent.$(window.name));
        elmH = Element.$getHeight(scrollArea.parentNode)
            - Element.$getHeight(Element.$previousElementSibling(scrollArea));
        // 0未満になった場合は0にする
        if(elmH < 0) {
          elmH = 0;
        }
        // 対象エレメントのサイズを隠し属性で保持
        scrollArea._currHeight = elmH;
        myStyle.height = elmH + "px";
        Element.$setStyle(scrollArea, myStyle);
        
      // スクロールエリアのサイズ取得済の場合
      } else {
        rate = Element.$getHeight(parent.$(window.name)) - Contents.currIFrameHeight;
        
        // rateが0以外の場合はサイズ設定を行う
        if(rate) {
          elmH = (!Util.$isUndefined(scrollArea._currHeight)) ?
              scrollArea._currHeight : parseInt(
              Element.$getStyle(scrollArea, "height").replace("px", ""), 10);
          // 対象エレメントのスタイルがある場合は取得高さ+差分を、無い場合は
          // 0を設定する
          elmH = !isNaN(elmH) ? elmH + rate : 0;
          // 対象エレメントのサイズを隠し属性で保持
          scrollArea._currHeight = elmH;
          // 0未満になった場合は0にする
          if(elmH < 0) {
            elmH = 0;
          }
          myStyle.height = elmH + "px";
          Element.$setStyle(scrollArea, myStyle);
          Contents.currIFrameHeight = Contents.currIFrameHeight + rate;
          Element.$redraw(scrollArea);
        }
      }
    };

    var areas = $$('.otherManualBody, .welcabManualBody, .referenceManualBody');
    //index.htmlの場合はresizeイベントを登録
    if(areas.length > 0) {
      Contents.currScrollArea = areas[0];
      Use.Util.$observe(window, "load", function() {
        Use.Util.$observe(window, "resize", myFunc);
      });
    }
    
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * マニュアル名リンククリック
 * @param {string} path パス
 * @param {string} tgt ウィンドウ名
 * @param {string} opt オプション
 * @param {number} winSize ウィンドウサイズ
 */
Contents.$doClickManualLnk = function(path, tgt, opt, winSize) {
  var METHODNAME = "Contents.$doClickManualLnk";
  try {
    var tab = Contents.tabName;
    var newConfig = ["10", "11"];
    var logParam = Contents.$getEntoryLogParam();
    
    // Top,RM,NM,EMから起動以外の場合
    if(tab != "Top" && tab != "RM" && tab != "NM" && tab != "EM") {
      // 新構成の場合は閲覧ログの登録を行う
      if(Util.$getIndexOfArray(newConfig, 
          this.myParent.globalInfo.REPAIR_CONTENTS_TYPE_GROUPS) != -1) {
        // 閲覧ログの登録処理
        Use.Util.$entryServiceLog(
          "0",
          Contents.mySuccession.FUNC_ID,
          tab,
          Contents.mySuccession.PUB_ID,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          logParam.modelName,
          logParam.fromDate,
          ""
        );
      }
    }
    
    Util.$openUrl(path, tgt, opt, winSize);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * PDF表示イベント設定
 */
Contents.$observeShowPDF = function() {
  var METHODNAME = "Contents.$observeShowPDF";
  try {
    
    var elms = $$("div.pdfPattern");
    var elm  = null;
    var len  = elms.length;
    var path = "";
    var pathAry = [];
    var target = "_blank";
    
    // コンテンツ内の"div.pdfPattern"数分だけループする
    for(var i = 0; i < len; i++) {
      path = Use.Util.$getContentsPath("C_CONTENTS_PDF_PATH");
      pathAry = Util.Selector.$select("img", elms[i])[0].src.split("/");
      pathAry.reverse();
      path = path.replace("{0}", pathAry[0].replace(".png", ".pdf"));
      
      elm = Util.Selector.$select("input.showpdf", elms[i])[0];
      Use.Util.$observe(elm, "click",
        (function(url, tgt) {
          return function(evt) {
            Contents.$doClickPdfBtn(evt, url, tgt);
          };
        })(path, target)
      );
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * PDFボタン実行処理
 * @param {Event} evt イベントオブジェクト
 * @param {string} url URL
 * @param {string} tgt ターゲット
 */
Contents.$doClickPdfBtn = function(evt, url, tgt) {
  var METHODNAME = "Contents.$doClickPdfBtn";
  try {
    var idSec = "";
    var idTtl = "";
    var logParam = Contents.$getEntoryLogParam();

    Util.$openUrl(url, tgt, Contents.WINDOW_OPTION, Util.WINDOW_SIZE_2);    

    // セクションID、タイトルIDを取得
    idSec = $$("span.globalSection")[0] ? 
          $$("span.globalSection")[0].innerHTML : "";
    idTtl = $$("span.globalTitle")[0] ? 
          $$("span.globalTitle")[0].innerHTML : "";
    
    // セクションID、タイトルIDの先頭"_"アンダースコアを除去
    if(idSec.indexOf("_") == 0){
      idSec = idSec.substring(1);
    }
    if(idTtl.indexOf("_") == 0){
      idTtl = idTtl.substring(1);
    }
    
    // 閲覧ログの登録処理
    Use.Util.$entryServiceLog(
      "0",
      "MAN14",
      Contents.mySuccession.PUB_TYPE,
      Contents.mySuccession.PUB_ID,
      "",
      idSec,
      "",
      idTtl,
      "",
      $$("span.globalSubTitle")[0] ? 
          $$("span.globalSubTitle")[0].innerHTML : "",
      "",
      Contents.mySuccession.PAR_ID,
      "",
      logParam.modelName,
      logParam.fromDate,
      logParam.noOfrAltPub
    );

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * SWF表示イベント設定
 */
Contents.$observeShowSWF = function() {
  var METHODNAME = "Contents.$observeShowSWF";
  try {
    
    Use.Contents.$observeShowSWF();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * SWFボタン実行処理
 * @param {Event} evt イベントオブジェクト
 * @param {string} url URL
 * @param {string} tgt ターゲット
 */
Contents.$doClickSwfBtn = function(evt, url, tgt) {
  var METHODNAME = "Contents.$doClickSwfBtn";
  try {
    var idSec = "";
    var idTtl = "";
    var logParam = Contents.$getEntoryLogParam();

    Util.$openUrl(url, tgt, Contents.WINDOW_OPTION, Util.WINDOW_SIZE_2);    

    // セクションID、タイトルIDを取得
    idSec = $$("span.globalSection")[0] ? 
          $$("span.globalSection")[0].innerHTML : "";
    idTtl = $$("span.globalTitle")[0] ? 
          $$("span.globalTitle")[0].innerHTML : "";
    
    // セクションID、タイトルIDの先頭"_"アンダースコアを除去
    if(idSec.indexOf("_") == 0){
      idSec = idSec.substring(1);
    }
    if(idTtl.indexOf("_") == 0){
      idTtl = idTtl.substring(1);
    }
    
    // 閲覧ログの登録処理
    Use.Util.$entryServiceLog(
      "0",
      "MAN15",
      Contents.mySuccession.PUB_TYPE,
      Contents.mySuccession.PUB_ID,
      "",
      idSec,
      "",
      idTtl,
      "",
      $$("span.globalSubTitle")[0] ? 
          $$("span.globalSubTitle")[0].innerHTML : "",
      "",
      Contents.mySuccession.PAR_ID,
      "",
      logParam.modelName,
      logParam.fromDate,
      logParam.noOfrAltPub
    );

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GIF表示イベント設定
 */
Contents.$observeShowGIF = function() {
  var METHODNAME = "Contents.$observeShowGIF";
  try {
    
    Use.Contents.$observeShowGIF();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GIFボタン実行処理
 * @param {Event} evt イベントオブジェクト
 * @param {string} url URL
 * @param {string} tgt ターゲット
 */
Contents.$doClickGifBtn = function(evt, url, tgt) {
  var METHODNAME = "Contents.$doClickGifBtn";
  try {
    var idSec = "";
    var idTtl = "";
    var logParam = Contents.$getEntoryLogParam();

    Util.$openUrl(url, tgt, Contents.WINDOW_OPTION, Util.WINDOW_SIZE_2);    

    // セクションID、タイトルIDを取得
    idSec = $$("span.globalSection")[0] ? 
          $$("span.globalSection")[0].innerHTML : "";
    idTtl = $$("span.globalTitle")[0] ? 
          $$("span.globalTitle")[0].innerHTML : "";
    
    // セクションID、タイトルIDの先頭"_"アンダースコアを除去
    if(idSec.indexOf("_") == 0){
      idSec = idSec.substring(1);
    }
    if(idTtl.indexOf("_") == 0){
      idTtl = idTtl.substring(1);
    }
    
    // 閲覧ログの登録処理
    Use.Util.$entryServiceLog(
      "0",
      "MAN15",
      Contents.mySuccession.PUB_TYPE,
      Contents.mySuccession.PUB_ID,
      "",
      idSec,
      "",
      idTtl,
      "",
      $$("span.globalSubTitle")[0] ? 
          $$("span.globalSubTitle")[0].innerHTML : "",
      "",
      Contents.mySuccession.PAR_ID,
      "",
      logParam.modelName,
      logParam.fromDate,
      logParam.noOfrAltPub
    );

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS表示イベント設定
 */
Contents.$observeShowGTS = function() {
  var METHODNAME = "Contents.$observeShowGTS";
  try {
    
    var elms = $$("dd.gtsExec input.gtsBtn");
    var len  = elms.length;
    // showModeがある場合はContentsを、ない場合はServiceをfaceBox
    // インスタンスの取得元として設定する
    var owner = Contents.showMode ? Contents : Contents.myParent;
    
    // ボタン数分だけループ
    for(var i = 0; i < len; i++) {
      Use.Util.$observe(elms[i], "click", Contents.$doClickGtsBtn);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTSボタン実行処理
 * @param {Event} evt イベントオブジェクト
 */
Contents.$doClickGtsBtn = function(evt) {
  var METHODNAME = "Contents.$doClickGtsBtn";
  try {
    
    var elm  = Event.$element(evt);
    var par  = elm.parentNode;
    var elms = Util.Selector.$select("> span", par);
    // showModeがある場合はContentsを、ない場合はServiceをfaceBox
    // インスタンスの取得元として設定する
    var owner = Contents.showMode ? Contents : Contents.myParent;
    var funcId = Util.$getNodeText(
      Util.Selector.$select("> span.gtsFunction", par)[0]);
    var idSec = $$("span.globalSection")[0] ? 
          $$("span.globalSection")[0].innerHTML : "";
    var idTtl = $$("span.globalTitle")[0] ? 
          $$("span.globalTitle")[0].innerHTML : "";
    var logParam = Contents.$getEntoryLogParam();
    
    // セクションID、タイトルIDの先頭"_"アンダースコアを除去
    if(idSec.indexOf("_") == 0){
      idSec = idSec.substring(1);
    }
    if(idTtl.indexOf("_") == 0){
      idTtl = idTtl.substring(1);
    }
    
    // 閲覧ログの登録処理
    Use.Util.$entryServiceLog(
      "1",
      funcId,
      Contents.mySuccession.PUB_TYPE,
      Contents.mySuccession.PUB_ID,
      "",
      idSec,
      "",
      idTtl,
      "",
      $$("span.globalSubTitle")[0] ? 
          $$("span.globalSubTitle")[0].innerHTML : "",
      "",
      Contents.mySuccession.PAR_ID,
      "",
      logParam.modelName,
      logParam.fromDate,
      logParam.noOfrAltPub
    );
    
    // GTS連携画面表示
    Use.GTS.$show(elms, owner.$getFacebox(), Contents.mySuccession);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 絵目次リンクイベント設定
 */
Contents.$observeCallout = function() {
  var METHODNAME = "Contents.$observeCallout";
  try {
    
    var selAry = $$("a.callout");
    var selLen = selAry.length;
    var target = [];
    var elm = null;
    
    // タイトル選択リンクのイベント設定
    for(var i = 0; i < selLen; i++) {
      elm = selAry[i];
      target = Util.Selector.$select("span.invisible", elm);
      Use.Util.$observe(elm, "click",
        (function(myTgt) {
          return function(evt) {
            Contents.myParent.$doClickTitleLnk(evt, myTgt);
          }
        })(target)
      );
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順一覧リンクイベント設定
 */
Contents.$observeShowProcLnk = function() {
  var METHODNAME = "Contents.$observeShowProcLnk";
  try {
    
    var strFuncId = "";
    var strAnchor = "";
    var elmParaId = $("para_id");
    var strParaId = elmParaId.innerHTML;
    var selAry = $$("a.lnkProc");
    var selLen = selAry.length;
    var elm = null;
    var aryElmAnchor = null;
    
    Util.$propcopy(Contents.mySuccession, Contents.mySuccessionMode3);
    Contents.$setModelessParam("3", "MODE", "3");
    Contents.$setModelessParam("3", "PAR_ID", strParaId);
    Contents.$setModelessParam("3", "PAR", "");
    Contents.$setModelessParam("3", "SBPARA_ID", "");
    
    // 手順詳細表示のイベント設定
    for(var i = 0; i < selLen; i++) {
      strFuncId = "";
      strAnchor = "";
      elm = selAry[i];
      strFuncId = "MAN08";
      aryElmAnchor = Util.Selector.$select("span.invisible", elm);
      strAnchor = aryElmAnchor[0].innerHTML;
      Use.Util.$observe(elm, "click",
          (function(funcId, paraId, anchor) {
            return function() {
              Contents.$doClickProcLink(funcId, paraId, anchor);
            };
          })(strFuncId, strParaId, strAnchor)
      );
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順詳細表示(手順一覧のリンククリック時)
 * @param {string} strFuncId 機能ID
 * @param {string} strParaId パラグラフID
 * @param {string} strAnchor アンカー
 */
Contents.$doClickProcLink = function(
    strFuncId, strParaId, strAnchor) {
  var METHODNAME = "Contents.$doClickProcLink";
  try {
    
    var param = {};
    
    Contents.$setModelessParam("3", "FUNC_ID", strFuncId);
    Util.$propcopy(Contents.mySuccessionMode3, param);
    Contents.myParent.$callbackProcedures(
        Contents.showPubType, strParaId, strAnchor, param);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツ表示エリアのイベント設定処理
 */
Contents.$setWindowResizeEvent = function() {
  var METHODNAME = "Contents.$setWindowResizeEvent";
  try {
    
    Use.Contents.$setWindowResizeEvent();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 印刷時のエレメント非活性化処理
 */
Contents.$setHideElement = function() {
  var METHODNAME = "Contents.$setHideElement";
  try {
    
    var idx = 0;
    var gtsEls = $$("dd.gtsExec input");
    var gtsLen = gtsEls.length;
    var pdfEls = $$("div.pdfPattern input");
    var pdfLen = pdfEls.length;
    var swfEls = $$("div.swfPattern input");
    var swfLen = swfEls.length;
    var gifEls = $$("div.gifPattern input");
    var gifLen = gifEls.length;
    
    // GTSボタンの非活性処理
    for(idx = 0; idx < gtsLen; idx++) {
      // エレメントのtypeが"button"の場合は非活性にする
      // そうでない場合は活性にする
      gtsEls[idx].disabled = gtsEls[idx].type == "button" ? true : false;
    }
    
    // PDFボタンの非活性処理
    for(idx = 0; idx < pdfLen; idx++) {
      // エレメントのtypeが"button"の場合は非活性にする
      // そうでない場合は活性にする
      pdfEls[idx].disabled = pdfEls[idx].type == "button" ? true : false;
    }
    
    // SWFボタンの非活性処理
    for(idx = 0; idx < swfLen; idx++) {
      // エレメントのtypeが"button"の場合は非活性にする
      // そうでない場合は活性にする
      swfEls[idx].disabled = swfEls[idx].type == "button" ? true : false;
    }
    
    // GIFボタンの非活性処理
    for(idx = 0; idx < gifLen; idx++) {
      // エレメントのtypeが"button"の場合は非活性にする
      // そうでない場合は活性にする
      gifEls[idx].disabled = gifEls[idx].type == "button" ? true : false;
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 適用時期による取得内容変更処理
 */
Contents.$changeElementState = function() {
  var METHODNAME = "Contents.$changeElementState";
  try {
    
    var linkKey  = "";
    var mlinks   = $$("a.mlink");
    var mlinkLen = mlinks.length;
    var spanEls  = null;
    var spanLen  = 0;
    var tekiList = [];
    var coutEls  = $$("a.hiddenCallout");
    var coutLen  = coutEls.length;
    var coutList = [];
    var fromDate = Contents.mySuccession.FROM_DATE;
    
    // mlink数分だけループする
    for(var i = 0; i < mlinkLen; i++) {
      spanEls = Util.Selector.$select("span", mlinks[i]);
      spanLen = spanEls.length;
      tekiList = [];
      
      // span数分だけループする
      for(var j = 0; j < spanLen; j++) {
        tekiList = Util.$getNodeText(spanEls[j]).split(",");
        
        // 取得文字列の適用時期が範囲内の場合は取得する
        if((tekiList[0] <= fromDate) && (fromDate < tekiList[1])) {
          tekiList.splice(0, 2);
          linkKey = tekiList.join(",");
          break;
        } else {
          linkKey = "";
        }
      }
      
      // 表示モードが"1"以外でリンクキーがある場合はイベント設定
      if(linkKey && (Contents.showMode != "1")) {
        Use.Util.$observe(mlinks[i], "click",
          (function(key) {
            return function() { Contents.$doClickReferenceLnk(key); };
          })(linkKey)
        );
      // リンクキーが無い場合はmlinkを非表示にする
      } else if(!linkKey) {
        Element.$addClassName(mlinks[i], "invisible");
      }
    }
    
    // 絵目次リンク数分ループする
    for(var i = 0; i < coutLen; i++) {
      coutList = coutEls[i].rel.split(",");
      
      // 適用時期が範囲内の場合はクラス名を変更する
      if((coutList[0] <= fromDate) && (fromDate < coutList[1])) {
        coutEls[i].className = "callout";
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * パラグラフ内保持の共通情報取得処理
 * @return {object(連想配列)} コンテンツ内情報
 */
Contents.$getGlobalInfo = function() {
  var METHODNAME = "Contents.$getGlobalInfo";
  try {
    
    var globalInfo = {};
    var para = "";
    globalInfo["PUB"]    = $$("span.globalPubNo")[0] ? 
        $$("span.globalPubNo")[0].innerHTML : "";
    globalInfo["CAT"]    = $$("span.globalCategory")[0] ? 
        $$("span.globalCategory")[0].innerHTML : "";
    globalInfo["SRV"]    = $$("span.globalServcatName")[0] ? 
        Util.$getNodeText($$("span.globalServcatName")[0]) : "";
    globalInfo["SRV_ID"] = $$("span.globalServcat")[0] ? 
        $$("span.globalServcat")[0].innerHTML : "";
    globalInfo["SEC"]    = $$("span.globalSectionName")[0] ? 
        Util.$getNodeText($$("span.globalSectionName")[0]) : "";
    globalInfo["SEC_ID"] = $$("span.globalSection")[0] ? 
        $$("span.globalSection")[0].innerHTML : "";
    globalInfo["TTL"]    = $$("span.globalTitleName")[0] ? 
        Util.$getNodeText($$("span.globalTitleName")[0]) : "";
    globalInfo["TTL_ID"] = $$("span.globalTitle")[0] ? 
        $$("span.globalTitle")[0].innerHTML : "";
    globalInfo["SBT"]    = $$("span.globalSubTitleName")[0] ? 
        Util.$getNodeText($$("span.globalSubTitleName")[0]) : "";
    globalInfo["SBT_ID"] = $$("span.globalSubTitle")[0] ? 
        $$("span.globalSubTitle")[0].innerHTML : "";
    // カテゴリ"C"の診断フローの場合のみパラグラフ名称をコンテンツから取得
    if(globalInfo["CAT"] == "C") {
      para = $$("h1")[0].innerHTML;
      para = para.replace(/&nbsp;&nbsp;/g, ",");
      // 末尾のカンマ(,)を削除
      if(para.charAt(para.length - 1) == ",") {
        para = para.substring(0, para.length - 1);
      }
    }
    globalInfo["PAR"] = para;
    return globalInfo;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 引継ぎ情報の取得処理
 * @param {string} pubType 表示するコンテンツのPUB_TYPE
 * @param {string} mode 表示するコンテンツのMODE
 * return {object(連想配列)} 引継ぎ情報
 */
Contents.$getModelessParam = function(pubType, mode) {
  var METHODNAME = "Contents.$getModelessParam";
  try {
    
    var objParam = {};
    // 参照モード
    if(mode == "0") {
      Util.$propcopy(Contents.mySuccessionMode0, objParam);
    // 手順詳細モード
    } else if(mode == "3") {
      Util.$propcopy(
          Contents.myParent.$getModelessParam(pubType, mode), 
          objParam);
    // 単体起動時（意見要望）
    } else {
      Util.$propcopy(Contents.$getQuaryString(), objParam);
    }
    return objParam;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * クエリ文字列取得
 * @private
 * return {object(連想配列)} 引継ぎ情報
 */
Contents.$getQuaryString = function() {
  var METHODNAME = "Contents.$getQuaryString";
  try {
    
    var objQuary = {};
    var quary = window.location.search;
    var aryParams = [];
    var nParamsLen = 0;
    var aryParam = [];
    // クエリ文字列がある場合
    if(quary != "") {
      quary = quary.substring(1);
      aryParams = quary.split("&");
      nParamsLen = aryParams.length;
      // パラメータを取得
      for(var i = 0; i < nParamsLen; i++) {
        aryParam = aryParams[i].split("=");
        objQuary[aryParam[0]] = aryParam[1];
      }
    }
    return objQuary;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * モーダレス画面の引継ぎ情報用の更新処理
 * @param {string} mode モード
 * @param {string} key 更新対象のキー
 * @param {string} val 更新対象の値
 */
Contents.$setModelessParam = function(mode, key, val) {
  var METHODNAME = "Contents.$setModelessParam";
  try {
    
    // モードなし(自身の情報を更新する場合)
    if(mode == "") {
      Contents.mySuccession[key] = val;
    // 参照モード
    } else if(mode == "0") {
      Contents.mySuccessionMode0[key] = val;
    // 手順詳細モード
    } else if(mode == "3") {
      Contents.mySuccessionMode3[key] = val;
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順展開・折りたたみアイコンのイベント設定処理
 * @param {boolean} isAllExp 全手順展開・折りたたみ制御の可否
 * return {boolean} true: 折りたたみ有り　false: 折りたたみ無し
 */
Contents.$setExpandElement = function(isAllExp) {
  var METHODNAME = "Contents.$setExpandElement";
  try {
    
    var len    = $$("p.s1").length;
    var s1mAry = $$("img.s1m");
    var s1pAry = $$("img.s1p");
    var isExpand = false;
    
    // s-1要素の展開・縮小用イベントを設定
    for(var i = 0; i < len; i++) {
      Use.Util.$observe(s1pAry[i], "click",
        function(evt) { Contents.$doClickDisplayIcn(evt, isAllExp) });
      Use.Util.$observe(s1mAry[i], "click",
        function(evt) { Contents.$doClickHideIcn(evt, isAllExp) });
    }
    
    // lenが0より大きい場合は全展開・全縮小可能に、そうでない場合は
    // 不可能に設定する
    isExpand = len > 0 ? true : false;
    return isExpand;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 警告・注意の判定処理
 * @private
 * @return string エレメントのID
 */
Contents.$getFlowAlertContentsId = function() {
  var METHODNAME = "Contents.$getFlowAlertContentsId";
  try {
    
    var targets = $$("div.category.no10");
    
    // カテゴリ10がコンテンツ内にある場合は
    // 対象のIDを返す
    if(targets[0]) {
      return targets[0].id;
    // 無い場合は空白を返す
    } else {
      return "";
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * サブパラグラフIDによる表示内容変更処理
 * @param {string} argN サブパラグラフID<br />
 *   arguments[0]:[0], arguments[1]:[1], ... arguments[N]:[N]
 */
Contents.$visibleSubParagraph = function() {
  var METHODNAME = "Contents.$visibleSubParagraph";
  try {
    
    var els = $$("div.category");
    var len = els.length;
    
    // 引数が存在する場合は対象を表示する
    if(arguments[0]) {
      Element.$show($(arguments[0]), "block");
    // 引数が存在しない場合は全サブパラグラフを表示する
    } else {
      // サブパラグラフ数分ループ
      for(var i = 0; i < len; i++) {
        Element.$show(els[i], "block");
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 要領参照リンク押下処理
 * @param {string} linkKey リンクキー
 */
Contents.$doClickReferenceLnk = function(linkKey) {
  var METHODNAME = "Contents.$doClickReferenceLnk";
  try {
    
    var keyAry = linkKey.split(",");
    var option = Contents.WINDOW_OPTION;
    var mlang = Contents.mySuccession.LANG_NAME;
    var path   = Use.Util.$getContentsPath(
      "C_CONTENTS_CURRENT_REFFER_PATH", "", "", mlang);
    var target = "_blank";
    var pId = "";
    var idx = "";
    var anc = "";

    if(Contents.mySuccession.PUB_TYPE == "RM") {
      pId = keyAry[3];
    } else {
      pId = keyAry[4];
    }
    idx = pId.indexOf("_");
    
    // パラグラフIDにアンダーバーがある場合は編集する
    if(idx >= 0) {
      anc = "#" + pId;
      pId = pId.substring(0, idx);
    }

    var parentEle = "";
    var parentId = "";

    //IE
    if(Browser.IE) {
        parentEle = window.event.srcElement.parentElement.parentElement.parentElement;
    //FireFox（FF）
    } else if(Browser.GECKO) {
        parentEle = document.activeElement.parentElement.parentElement.parentElement;
    //FireFox（FF）
    } else if(Browser.WEBKIT) {
        parentEle = window.event.srcElement.parentElement.parentElement.parentElement;
    }

    // ループする
    for( ;  ; ) {
      if(parentEle.nodeName == "DIV" &&
          parentEle.className == "s1" ) {
              parentId = "," + parentEle.id;
              break;
      }
      if(parentEle.nodeName == "BODY") {
              break;
      }
      parentEle = parentEle.parentElement;
    }
    var linkKey2 = linkKey + parentId;

    // 表示モードがコンテンツ内の場合は関数呼び出しを行う
    if(!Contents.showMode) {
      window.open(anc, "_self");
      Contents.myParent.$callbackReference(linkKey2);
    // 表示モードがモーダレスの場合は新規Windowで表示を行う
    } else {
      
      path = path.replace("{0}", pId);
      path += "?PUB_TYPE=" + Contents.showPubType;
      path += "&MODE=0";
      path += anc;
      Util.$propcopy(Contents.mySuccession, Contents.mySuccessionMode0);
      Contents.$setModelessParam("0", "MODE", "0");
      Contents.$setModelessParam("0", "FUNC_ID", "MAN12");
      Contents.$setModelessParam("0", "PAR_ID", pId);
      Contents.$setModelessParam("0", "PAR", "");
      Contents.$setModelessParam("0", "SBPARA_ID", "");
      Util.$openUrl(path, target, option, Util.WINDOW_SIZE_2);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順展開処理
 * @param {event} evt イベントオブジェクト
 * @param {boolean} isAllExp 全手順展開・折りたたみ制御の可否
 */
Contents.$doClickDisplayIcn = function(evt, isAllExp) {
  var METHODNAME = "Contents.$doClickDisplayIcn";
  try {
    
    var ele = Event.$element(evt);
    var myParent = ele.parentNode;
    var nextParent = Element.$nextElementSibling(myParent);
    var s1p = Util.Selector.$select("img.s1p", myParent)[0];
    var s1m = Util.Selector.$select("img.s1m", myParent)[0];
    var len = $$("img.s1p").length;
    
    // クラス名を基準に処理の有無を決定
    if(Element.$hasClassName(nextParent, "invisible")) {
      Element.$removeClassName(nextParent, "invisible");
      Element.$removeClassName(s1m, "invisible");
      Element.$addClassName(s1p, "invisible");
      
      Contents.expandState += 1;
      
      // trueの場合は全展開処理を行う
      if(isAllExp) {
        // 状態が全縮小の場合
        if(Contents.expandState == 0) {
          Contents.myParent.$callbackExpand(0);
        // 状態が全展開の場合
        } else if(len == Contents.expandState) {
          Contents.myParent.$callbackExpand(1);
        // 状態が混在の場合
        } else {
          Contents.myParent.$callbackExpand(2);
        }
      }
      // IFrame内のコンテンツの高さを再認識させる
      Element.$redraw($$("html")[0], true);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順折りたたみ処理
 * @param {event} evt イベントオブジェクト
 * @param {boolean} isAllExp 全手順展開・折りたたみ制御の可否
 */
Contents.$doClickHideIcn = function(evt, isAllExp) {
  var METHODNAME = "Contents.$doClickHideIcn";
  try {
    
    var ele = Event.$element(evt);
    var myParent = ele.parentNode;
    var nextParent = Element.$nextElementSibling(myParent);
    var s1p = Util.Selector.$select("img.s1p", myParent)[0];
    var s1m = Util.Selector.$select("img.s1m", myParent)[0];
    var len = $$("img.s1p").length;
    
    // クラス名を基準に処理の有無を決定
    if(!Element.$hasClassName(nextParent, "invisible")) {
      Element.$addClassName(nextParent, "invisible");
      Element.$addClassName(s1m, "invisible");
      Element.$removeClassName(s1p, "invisible");
      
      Contents.expandState -= 1;
      
      // trueの場合は全折りたたみ処理を行う
      if(isAllExp) {
        // 状態が全縮小の場合
        if(Contents.expandState == 0) {
          Contents.myParent.$callbackExpand(0);
        // 状態が全展開の場合
        } else if(len == Contents.expandState) {
          Contents.myParent.$callbackExpand(1);
        // 状態が混在の場合
        } else {
          Contents.myParent.$callbackExpand(2);
        }
      }
      // IFrame内のコンテンツの高さを再認識させる
      Element.$redraw($$("html")[0], true);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 全手順展開処理
 */
Contents.$expandAllProcess = function() {
  var METHODNAME = "Contents.$expandAllProcess";
  try {
    
    var s1pAry = $$("img.s1p");
    var s1Len  = s1pAry.length;
    
    // コンテンツ内の全ての展開画像のイベントを起動
    for(var i = 0; i < s1Len; i++) {
      Event.$fireEvent(s1pAry[i], "click");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 全手順折りたたみ処理
 */
Contents.$closeAllProcess = function() {
  var METHODNAME = "Contents.$closeAllProcess";
  try {
    
    var s1mAry = $$("img.s1m");
    var s1Len  = s1mAry.length;
    
    // コンテンツ内の全ての縮小画像のイベントを起動
    for(var i = 0; i < s1Len; i++) {
      Event.$fireEvent(s1mAry[i], "click");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ヘッダ・フッタの作成処理
 */
Contents.$createFrame = function(otherManual) {
  var METHODNAME = "Contents.$createFrame";
  try {
    
    var headStr = "";
    var footStr = "";
    var footEle = "";
    
    //他マニュアルの場合
    if(otherManual) {
      headStr = Use.Util.$getMessage("CONST_CONTENTS_FIXED_OTHER_HEAD");
    //他マニュアル以外の場合
    } else {
      headStr = Use.Contents.$getFrameHeadString();
    }
    
    footStr = Use.Util.$getMessage("CONST_CONTENTS_FIXED_FOOT");
    
    $("header").innerHTML = headStr;
    $("footer").innerHTML = footStr;
    
    Use.Util.$observe($("lnk_close"), "click", Contents.$doClickExitLnk);
    //他マニュアル以外の場合
    if(!otherManual) {
      Use.Util.$observe($("btn_print"), "click", Contents.$doClickPrintLnk);
      //PrintPreviewボタンがある場合はイベントを追加
      if($("btn_printpreview") != null) {
        Use.Util.$observe($("btn_printpreview"), "click",
          Contents.$doClickPrintPreview);
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 画面の閉じる処理
 */
Contents.$doClickExitLnk = function() {
  var METHODNAME = "Contents.$doClickExitLnk";
  try {
    
    Util.$closeWindow();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 画面の印刷処理
 */
Contents.$doClickPrintLnk = function() {
  var METHODNAME = "Contents.$doClickPrintLnk";
  try {
    
    Util.$print();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 画面の印刷プレビュー処理
 */
Contents.$doClickPrintPreview = function() {
  var METHODNAME = "Contents.$doClickPrintPreview";
  try {
    
    Util.$printPreview();
    
  } catch(err) {
  }
};

/**
 * 指示文字描画処理
 */
Contents.$renderIndicator = function() {
  var METHODNAME = "Contents.$renderIndicator";
  try {
    
    Contents.Util.Indicator.$render();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツHTML取得処理
 * return {Element} コンテンツHTMLエレメント
 */
Contents.$getContentsHTML = function() {
  var METHODNAME = "Contents.$getContentsHTML";
  try {
    
    return $$("html")[0];
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツ保持の表示時間の取得処理
 */
Contents.$getInitDate = function() {
  var METHODNAME = "Contents.$getInitDate";
  try {
    
    return Contents.initDate;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツ保持の表示タブの取得処理
 */
Contents.$getCurrentTabName = function() {
  var METHODNAME = "Contents.$getCurrentTabName";
  try {
    
    return Contents.tabName;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツ表示エリアの幅調整(iPad)
 */
Contents.$doChangViewArea_iPad  = function() {
  var METHODNAME = "Contents.$doChangViewArea_iPad";
  try {
    Use.Util.$removeClassName_iPad($("wrapper"), "wrapper_iPad_def");
    Use.Util.$removeClassName_iPad($("wrapper"), "wrapper_iPad_half");
    Use.Util.$removeClassName_iPad($("wrapper"), "wrapper_iPad_all");
    // 修理書の場合
    if (window.parent.$$("div#tabs a.selected")[0].id == "tab_repair") {
      // パラグラフ表示幅が通常の場合
      if(window.parent.$("repair_body_frame").className == "paragraph_view_area") {
        Use.Util.$addClassName_iPad($("wrapper"), "wrapper_iPad_def");
      // パラグラフ表示幅が半分表示の場合
      } else if (window.parent.$("repair_body_frame").className == "paragraph_view_area_half") {
        Use.Util.$addClassName_iPad($("wrapper"), "wrapper_iPad_half");
      // パラグラフ表示幅が全表示の場合
      } else if (window.parent.$("repair_body_frame").className == "paragraph_view_area_all") {
        Use.Util.$addClassName_iPad($("wrapper"), "wrapper_iPad_all");
      }
    // 解説書の場合
    } else if (window.parent.$$("div#tabs a.selected")[0].id == "tab_ncf") {
      // パラグラフ表示幅が通常の場合
      if(window.parent.$("ncf_body_frame").className == "paragraph_view_area") {
        Use.Util.$addClassName_iPad($("wrapper"), "wrapper_iPad_def");
      // パラグラフ表示幅が半分表示の場合
      } else if (window.parent.$("ncf_body_frame").className == "paragraph_view_area_half") {
        Use.Util.$addClassName_iPad($("wrapper"), "wrapper_iPad_half");
      // パラグラフ表示幅が全表示の場合
      } else if (window.parent.$("ncf_body_frame").className == "paragraph_view_area_all") {
        Use.Util.$addClassName_iPad($("wrapper"), "wrapper_iPad_all");
      }
    // ボデー修理書の場合
    } else if (window.parent.$$("div#tabs a.selected")[0].id == "tab_brm") {
      // パラグラフ表示幅が通常の場合
      if(window.parent.$("brm_body_frame").className == "paragraph_view_area") {
        Use.Util.$addClassName_iPad($("wrapper"), "wrapper_iPad_def");
      // パラグラフ表示幅が半分表示の場合
      } else if (window.parent.$("brm_body_frame").className == "paragraph_view_area_half") {
        Use.Util.$addClassName_iPad($("wrapper"), "wrapper_iPad_half");
      // パラグラフ表示幅が全表示の場合
      } else if (window.parent.$("brm_body_frame").className == "paragraph_view_area_all") {
        Use.Util.$addClassName_iPad($("wrapper"), "wrapper_iPad_all");
      }
    }
  } catch(err) {
      Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 手順名称の幅を動的に調整し、品名コードの表示領域を確保する<br />
 * ・手順名称の文言が品名コードに重ならないようにする<br />
 * ・手順名称の文言が品名コードの下に回り込まないようにする
 */
Contents.$keepPartCodeArea = function() {
  var METHODNAME = "Contents.$keepPartCodeArea";
  try {
    // 品名コードのエレメントの配列
    var aryElm = $$("span.partsCode");
    var len = aryElm.length;
    var elm = null;
    var objDim = null;
    // 手順名称の幅
    var w = 0;
    // タイトル部の左右のpadding
    var pdgLft = 0;
    var pdgRit = 0;
    // 品名コードの幅
    var partCodeW = 0;
    // タイトル部に設定するスタイル
    var myStyle = { width: "" };
    // タイトル部のエレメント
    var elmTitle = null;

    for(var i = 0; i < len; i++) {
      // 品名コードの幅を取得
      objDim = Element.$getDimensions(aryElm[i]);
      partCodeW = parseInt(objDim.width, 10);

      // 手順名称のエレメントを取得
      elm = aryElm[i].parentNode;
      // 手順名称の幅を取得
      objDim = Element.$getDimensions(elm);
      w = parseInt(objDim.width, 10);

      // 手順名称が非表示の場合、処理しない（ゼロ割を回避）
      if(w == 0) {
        continue;
      }

      // タイトル部のエレメントを取得
      elmTitle = Util.Selector.$select("span.titleText", elm)[0];
      // タイトル部の左右のpaddingを取得
      pdgLft = parseInt(Element.$getStyle(elmTitle, 
          "padding-left").replace("px", ""), 10);
      pdgRit = parseInt(Element.$getStyle(elmTitle, 
          "padding-right").replace("px", ""), 10);

      // タイトル部の幅を計算（％）
      w = (w - (pdgLft + pdgRit + partCodeW) - 25) / w * 100;

      // タイトル部の幅が負数になった場合、widthに負数は設定できないため、
      // ゼロを設定する
      if(w < 0) {
        w = 0;
      }

      myStyle.width = w + "%";
      // タイトル部にスタイルを設定
      Element.$setStyle(elmTitle, myStyle);
    }

    // メモリ開放
    aryElm = null;
    elm = null;
    elmTitle = null;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 閲覧ログ出力値取得処理
 */
Contents.$getEntoryLogParam = function() {
  var METHODNAME = "Contents.$getEntoryLogParam";
  try {
    var logParam = {};
    logParam["modelName"] = Contents.mySuccession.CAR_NAME;
    logParam["fromDate"] = Contents.mySuccession.FROM_DATE;
    // 提供子パブＮＯを取得
    if (!Util.$isUndefined(Contents.mySuccession.RM_NO_OFR_ALT_PUB)) {
      if (Contents.mySuccession.PUB_TYPE == "RM") {
        logParam["noOfrAltPub"] = Contents.mySuccession.RM_NO_OFR_ALT_PUB;
      } else if (Contents.mySuccession.PUB_TYPE == "NM") {
        logParam["noOfrAltPub"] = Contents.mySuccession.NM_NO_OFR_ALT_PUB;
      } else if (Contents.mySuccession.PUB_TYPE == "EM") {
        logParam["noOfrAltPub"] = Contents.mySuccession.EM_NO_OFR_ALT_PUB;
      } else if (Contents.mySuccession.PUB_TYPE == "BM") {
        logParam["noOfrAltPub"] = Contents.mySuccession.BM_NO_OFR_ALT_PUB;
      }
    } else {
      logParam["noOfrAltPub"] = "";
    }
    
    return logParam;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 旧車の公開日制御処理
 */
Contents.$doChangePDate = function (tab) {
  var METHODNAME = "Contents.$doChangePDate";
  try {
    var ele = null;
    var eleLen = 0;
    var parentEle = null;
    var pDate = null;
    var pDateNum = 0;
    var fuTekiDate = 0;
    var oldCarFlag = false;
    var changeFlag = false;
    var pDateMade = "";
    var pDateMadeNum = 0;
    var fuMadeTekiDate = 0;

    // Web版のみ存在する未来公開日の敵時期を取得し公開日制御を行う
    if (!Util.$isUndefined(Contents.myParent.globalInfo.FU_PUB_TRM_FRYM)) {
      fuTekiDate = Contents.myParent.globalInfo.FU_PUB_TRM_FRYM;
      if (Contents.myParent.globalInfo.PUB_BIND_ID.indexOf("L") == 0) {
        oldCarFlag = true;
      }
      // 未来公開日マデ時期を取得
      fuMadeTekiDate = Contents.$getFuterToDate(fuTekiDate);
      
      // 敵時期があり旧車の場合、表示制御をする
      if (!Util.$isUndefined(fuTekiDate) && fuTekiDate != 0 && oldCarFlag) {
        //index.htmlの構成によって対象のエレメントを切り替える
        if ($$("div#contents_body tbody td.omhPDate")[0]) {
          ele = $$("div#contents_body tbody td.omhPDate");
        } else if ($$("div#contents_body tbody td.ombPDate")[0]) {
          ele = $$("div#contents_body tbody td.ombPDate");
        } else if ($$("div#contents_body tbody td.wmhPDate")[0]) {
          ele = $$("div#contents_body tbody td.wmhPDate");
        } else if ($$("div#contents_body tbody td.wmbPDate")[0]) {
          ele = $$("div#contents_body tbody td.wmbPDate");
        }
        eleLen = ele.length;
        // 比較する時期を取得
        for( var i = 0; i < eleLen; i++) {
          pDateNum = 0;
          pDateMadeNum = 0;
          // 時期の値を年月に編集
          if (Util.Selector.$select("p",ele[i])[0].innerHTML.split("-")[0]) {
            pDate = Util.Selector.$select("p",ele[i])[0].innerHTML.split("-")[0].split("/");
            pDate = pDate[0] + pDate[1];
            pDateNum = parseInt(pDate);
            // マデ時期を取得
            if (Util.Selector.$select("p",ele[i])[0].innerHTML.split("-")[1]) {
              pDateMade = Util.Selector.$select("p",ele[i])[0].innerHTML.split("-")[1].split("/");
              pDateMade = pDateMade[0] + pDateMade[1];
              pDateMadeNum = parseInt(pDateMade);
            }
          }
          // ウェルキャブの場合
          if (tab == "WC") {
            // 時期より適用時期をむかえていない場合、
            if (pDateNum != 0 && pDateNum >= fuTekiDate) {
              parentEle = ele[i].parentNode;
              // htmlの構成によって切り替える
              if (Util.Selector.$select(".wmbInfo1 p",parentEle)[0]) {
                // 仕様１または仕様２に名称が入っている場合は、リストを編集
                if (Util.Selector.$select(".wmbInfo1 p",parentEle)[0].innerHTML != ""
                   || Util.Selector.$select(".wmbInfo2 p",parentEle)[0].innerHTML != "") {
                  Util.Selector.$select(".wmbManual p",parentEle)[0].innerHTML = "仕様なし";
                  Util.Selector.$select(".wmbPDate p",parentEle)[0].innerHTML = "-";
                  Util.Selector.$select(".wmbModel p",parentEle)[0].innerHTML = "-";
                  Util.Selector.$select(".wmbGCode p",parentEle)[0].innerHTML = "-";
                  Util.Selector.$select(".wmbParts p",parentEle)[0].innerHTML = "-";
                  Util.Selector.$select(".wmbRemarks p",parentEle)[0].innerHTML = "";
                // 行を非表示にする
                } else {
                  Element.$addClassName(parentEle, "invisible");
                }
              } else {
                // 仕様１または仕様２に名称が入っている場合は、リストを編集
                if (Util.Selector.$select(".wmhInfo1 p",parentEle)[0].innerHTML != ""
                   || Util.Selector.$select(".wmhInfo2 p",parentEle)[0].innerHTML != "") {
                  Util.Selector.$select(".wmhManual p",parentEle)[0].innerHTML = "仕様なし";
                  Util.Selector.$select(".wmhPDate p",parentEle)[0].innerHTML = "-";
                  Util.Selector.$select(".wmhModel p",parentEle)[0].innerHTML = "-";
                  Util.Selector.$select(".wmhGCode p",parentEle)[0].innerHTML = "-";
                  Util.Selector.$select(".wmhParts p",parentEle)[0].innerHTML = "-";
                  Util.Selector.$select(".wmhRemarks p",parentEle)[0].innerHTML = "";
                // 行を非表示にする
                } else {
                  Element.$addClassName(parentEle, "invisible");
                }
              }
            // htmlのマデ時期が未来公開日マデ時期と同じ場合は、カラ時期のみ表示
            } else if (pDateMadeNum == fuMadeTekiDate) {
              ele[i].innerHTML = Util.Selector.$select("p",ele[i])[0].innerHTML.split("-")[0] + "-";
            }
          // その他のタブを選択した場合
          } else {
            parentEle = ele[i].parentNode;
            // 時期より適用時期をむかえていない場合、行を非表示にする
            if (pDateNum != 0 && pDateNum >= fuTekiDate) {
              Element.$addClassName(parentEle, "invisible");
            // htmlのマデ時期が未来公開日マデ時期と同じ場合は、カラ時期のみ表示
            } else if (pDateMadeNum == fuMadeTekiDate) {
              ele[i].innerHTML = Util.Selector.$select("p",ele[i])[0].innerHTML.split("-")[0] + "-";
            }
          }
        }
      }
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 旧車の未来公開日マデ時期（未来公開日の１ヶ月前）取得処理
 */
Contents.$getFuterToDate = function (fuTekiDate) {
  var METHODNAME = "Contents.$getFuterToDate";
  try {
    var madeYDate = 0;
    var madeMDate = 0;
    var madeDate = 0;
    var fuYDate = 0;
    var fuMDate = 0;
    fuYDate = parseInt(fuTekiDate.substring(0,4));
    fuMDate = parseInt(fuTekiDate.substring(4,6));
    madeYDate = fuYDate;
    madeMDate = fuMDate - 1;
    if (madeMDate == 0) {
      madeMDate = 12;
      madeYDate = madeYDate - 1;
    }
    // 年月の6桁整数(年＊100＋月）
    madeDate = madeYDate *100 + madeMDate;
    return madeDate;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * コンテンツ内ユーティリティクラス
 * @namespace コンテンツ内ユーティリティクラス
 */
Contents.Util = {};

/**
 * 指示文字クラス
 * @namespace 指示文字クラス
 */
Contents.Util.Indicator = {};

/**
 * 横線・縦線画像ファイルの固定パス情報（水平）
 * @type string
 */
Contents.Util.Indicator.CONST_PATH_H = "";

/**
 * 横線・縦線画像ファイルの固定パス情報（垂直）
 * @type string
 */
Contents.Util.Indicator.CONST_PATH_V = "";

/**
 * 画像ファイルの固定パス情報
 * @type string
 */
Contents.Util.Indicator.CONST_IMG_PATH = "";

/**
 * サイズの規定値
 * @type number
 */
Contents.Util.Indicator.CONST_SIZE = 2;

/**
 * 指示文字の描画処理
 */
Contents.Util.Indicator.$render = function() {
  var METHODNAME = "Contents.Util.Indicator.$render";
  try {
    
    var indiEls = $$(".indicateinfo");
    var indiLen = indiEls.length;
    var indiPar = null;
    var indiEle = null;
    var imgSrc  = null;
    var imgArry = null;
    var imgFile = null;
    
    // 指示文字エレメント数分だけループ処理
    for(var indiIdx = 0; indiIdx < indiLen; indiIdx++) {
      indiEle = indiEls[indiIdx];
      indiPar = indiEle.parentNode;
      // イラストのフルパス
      imgSrc  = indiPar.getElementsByTagName("img")[0].src;
      // 階層ごとに分割
      imgArry = imgSrc.split("/");
      // 末尾の項目を取得
      imgFile = imgArry[imgArry.length - 1];
      
      // ファイル名が7桁の場合
      if (imgFile.split(".")[0].length == 7) {
      
        // 枠描画処理の実行
        Contents.Util.Indicator.$createRect(indiPar, indiEle);
        // 線描画処理の実行
        Contents.Util.Indicator.$createLine(indiPar, indiEle);
        // 文字描画処理の実行
        Contents.Util.Indicator.$createCapt(indiPar, indiEle);
      }
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 指示線の描画処理
 * @param {Element} parent 親エレメント
 * @param {Element} indiEle 指示文字エレメント
 */
Contents.Util.Indicator.$createLine = function(parent, indiEle) {
  var METHODNAME = "Contents.Util.Indicator.$createLine";
  try {
    
    var lineEls = Util.Selector.$select(".line", indiEle);
    var lineLen = lineEls.length;
    var edgeEls = null;
    var edgeFlg = false;
    
    // 線エレメント数分だけループ処理を行う
    for(var lineIdx = 0; lineIdx < lineLen; lineIdx++) {
      // 白抜きの判定処理
      edgeEls = Util.Selector.$select(".whiteedge", lineEls[lineIdx]);
      // １以上のエレメントがある場合はtrueを、ない場合はfalseを設定する
      edgeFlg = edgeEls.length ? edgeEls[0].innerHTML === "true" : false;
      // 白抜きの判定がtrueの場合は白抜き用パスを、falseの場合は
      // 通常画像用パスを使用する
      Contents.Util.Indicator.CONST_PATH_H = edgeFlg ?
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_H") :
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_DEFAULT_PATH");
      Contents.Util.Indicator.CONST_PATH_V = edgeFlg ?
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_V") :
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_DEFAULT_PATH");
      
      // 白抜きの判定がtrueの場合は白抜き用パスを、falseの場合は
      // 通常画像用パスを使用する
      Contents.Util.Indicator.CONST_IMG_PATH = edgeFlg ?
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_LINE_WEDGE_PATH") :
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_LINE_PATH");
      
      // 線エレメント内の座標を元に、線描画を行う
      Contents.Util.Indicator.$insertLine(parent, lineEls[lineIdx]);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 指示線の追加処理
 * @param {Element} parent 親エレメント
 * @param {Element} lineEle 対象のline要素
 */
Contents.Util.Indicator.$insertLine = function(parent, lineEle) {
  var METHODNAME = "Contents.Util.Indicator.$insertLine";
  try {
    
    var pointEls = Util.Selector.$select(".points", lineEle);
    var pointLen = pointEls.length;
    var pointEle = {};
    var linePath = "";
    var lineWidth = 2;
    var lineHeight = 2;
    var newLine = null;
    var edgeEls = null;
    var edgeFlg = false;
    
    edgeEls = Util.Selector.$select(".whiteedge", lineEle);
    // １以上のエレメントがある場合はtrueを、ない場合はfalseを設定する
    edgeFlg = edgeEls.length ? edgeEls[0].innerHTML === "true" : false;
    
    // 座標エレメント数分だけループ処理を行う
    for(var pointIdx = 0; pointIdx < pointLen; pointIdx++) {
      lineWidth = 2;
      lineHeight = 2;
      // 対象エレメント内に定義されている情報の収集処理
      pointEle = Contents.Util.Indicator.$pointSplit(pointEls[pointIdx]);
      
      // 収集した情報のうち、幅が2px以下の場合は書き換える
      if(pointEle.w <= Contents.Util.Indicator.CONST_SIZE) {
        pointEle.w = Contents.Util.Indicator.CONST_SIZE;
        // 白抜きありの場合、白抜き分の幅と座標xを補正する
        if(edgeFlg) {
          pointEle.w = pointEle.w + 2;
          pointEle.x1 -= 1;
        }
        pointEle.src = Contents.Util.Indicator.CONST_PATH_V;
      // 収集した情報のうち、高さが2px以下の場合は書き換える
      } else if(pointEle.h <= Contents.Util.Indicator.CONST_SIZE) {
        pointEle.h = Contents.Util.Indicator.CONST_SIZE;
        // 白抜きありの場合、白抜き分の高さと座標yを補正する
        if(edgeFlg) {
          pointEle.h = pointEle.h + 2;
          pointEle.y1 -= 1;
        }
        pointEle.src = Contents.Util.Indicator.CONST_PATH_H;
      // 収集した情報の幅・高さ共に2pxを上回っている場合は斜線画像と判断
      } else {
        // 幅の計算を行い、取得した座標情報に満たない場合は倍々で増やす
        while(lineWidth < pointEle.w) {
          lineWidth *= 2;
        }
        
        // 高さの計算を行い、取得した座標情報に満たない場合は倍々で増やす
        while(lineHeight < pointEle.h) {
          lineHeight *= 2;
        }
        
        // 512より大きい場合は512へ変更
        if(lineWidth > 512) {
          lineWidth = 512;
        }
        
        // 512より大きい場合は512へ変更
        if(lineHeight > 512) {
          lineHeight = 512;
        }
        
        pointEle.src = Contents.Util.Indicator.CONST_IMG_PATH;
        pointEle.src = pointEle.src.replace("{0}", lineWidth);
        pointEle.src = pointEle.src.replace("{1}", lineHeight);
        
        // アングルが1の場合は左へ傾いた画像を使用
        if(pointEle.angle == 1) {
          pointEle.src = pointEle.src.replace("{2}", "l");
        // アングルが1以外の場合は右へ傾いた画像を使用
        } else {
          pointEle.src = pointEle.src.replace("{2}", "r");
        }
      }
      
      Util.$preload(pointEle.src);
      
      newLine = document.createElement("img");
      Element.$writeAttribute(newLine, "src", pointEle.src);
      Element.$addClassName(newLine, "indiline");
      Element.$setStyle(newLine,
        "top:"    + pointEle.y1 + "px;" +
        "left:"   + pointEle.x1 + "px;" +
        "width:"  + pointEle.w  + "px;" +
        "height:" + pointEle.h  + "px;");
      Element.$insert(parent, newLine);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 枠線の描画処理
 * @param {Element} 親エレメント
 * @param {Element} 指示文字エレメント
 */
Contents.Util.Indicator.$createRect = function(parent, indiEle) {
  var METHODNAME = "Contents.Util.Indicator.$createRect";
  try {
    
    var rectEls = Util.Selector.$select(".rectangle", indiEle);
    var rectLen = rectEls.length;
    
    // 枠エレメント数分だけループ処理を行う
    for(var rectIdx = 0; rectIdx < rectLen; rectIdx++) {
      // 枠エレメント内の座標を元に、枠描画を行う
      Contents.Util.Indicator.$insertRect(parent, rectEls[rectIdx]);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 枠線の追加処理
 * @param {Element} parent 親エレメント
 * @param {Element} rectEle 対象のrectangle要素
 */
Contents.Util.Indicator.$insertRect = function(parent, rectEle) {
  var METHODNAME = "Contents.Util.Indicator.$insertRect";
  try {
    
    var pointEls = Util.Selector.$select(".points", rectEle);
    var pointLen = pointEls.length;
    var pointEle = {};
    var newRect  = null;
    
    // 座標エレメント数分だけループ処理を行う
    for(var pointIdx = 0; pointIdx < pointLen; pointIdx++) {
      // 対象エレメント内に定義されている情報の収集処理
      pointEle = Contents.Util.Indicator.$pointSplit(pointEls[pointIdx]);
      
      newRect = document.createElement("div");
      Element.$addClassName(newRect, "indirect");
      Element.$setStyle(newRect,
        "top:"    + pointEle.y1 + "px;" +
        "left:"   + pointEle.x1 + "px;" +
        "width:"  + pointEle.w  + "px;" +
        "height:" + pointEle.h  + "px;");
      Element.$insert(parent, newRect);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 文言の描画処理
 * @param {Element} 親エレメント
 * @param {Element} 指示文字エレメント
 */
Contents.Util.Indicator.$createCapt = function(parent, indiEle) {
  var METHODNAME = "Contents.Util.Indicator.$createCapt";
  try {
    
    var captEls = Util.Selector.$select(".caption", indiEle);
    var captLen = captEls.length;
    
    // 文言エレメント数分だけループ処理を行う
    for(var captIdx = 0; captIdx < captLen; captIdx++) {
      // 文言エレメント内の座標を元に、枠描画を行う
      Contents.Util.Indicator.$insertCapt(parent, captEls[captIdx]);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 文言の追加処理
 * @param {Element} parent 親エレメント
 * @param {Element} captEle 対象のcaption要素
 */
Contents.Util.Indicator.$insertCapt = function(parent, captEle) {
  var METHODNAME = "Contents.Util.Indicator.$insertCapt";
  try {
    
    var pointEls = Util.Selector.$select(".points", captEle);
    var pointLen = pointEls.length;
    var pointEle = {};
    var work = null;
    var captText = null;
    var fontSize = null;
    var filledFlag = null;
    var newCapt  = null;
    var newStyle = "";
    
    // 座標エレメント数分だけループ処理を行う
    for(var pointIdx = 0; pointIdx < pointLen; pointIdx++) {
      // 対象エレメント内に定義されている情報の収集処理
      pointEle = Contents.Util.Indicator.$pointSplit(pointEls[pointIdx]);
      
      // 文言の取得
      work = Util.Selector.$select(".captionText", captEle)[0];
      // エレメントがある場合は文字列を、ない場合は空白を設定する
      captText = work ? work.innerHTML : "";
      
      // フォントサイズ取得
      work = Util.Selector.$select(".fontsize", captEle)[0];
      // エレメントがある場合は文字列を、ない場合は空白を設定する
      fontSize = work ? work : "";
      
      //背景色判定フラグ取得
      work = Util.Selector.$select(".filled", captEle)[0];
      // エレメントがある場合は文字列を、ない場合は空白を設定する
      filledFlag = work ? work.innerHTML : "";
      
      newCapt = document.createElement("div");
      newCapt.innerHTML = captText;
      Element.$addClassName(newCapt, "indicapt");
      
      newStyle = "top:"    + pointEle.y1 + "px;" +
                 "left:"   + pointEle.x1 + "px;" +
                 "width:"  + pointEle.w  + "px;" +
                 "height:" + pointEle.h  + "px;";
      
      // フォントサイズの指定がある場合は追加
      if(fontSize) {
        newStyle += "font-size:" + fontSize.innerHTML + "pt;";
        newStyle += "line-height:" + fontSize.innerHTML + "pt;";
      }
      //背景色判定フラグがある場合は背景を白色に設定
      if(filledFlag == "true") {
        newStyle += "background-color: #FFFFFF;";
      }
      Element.$setStyle(newCapt, newStyle);
      Element.$insert(parent, newCapt);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * エレメント内の座標取得処理
 * @param {Element} ele 取得対象のエレメント
 * @return object(連想配列) 座標情報
 */
Contents.Util.Indicator.$pointSplit = function(ele) {
  var METHODNAME = "Contents.Util.Indicator.$pointSplit";
  try {
    
    var point = { x1: 0, x2: 0, y1: 0, y2: 0, w: 0, h: 0, angle: 0, src: "" };
    var pEle = ele.innerHTML.split(" ");
    var stEle = pEle[0].split(",");
    var edEle = pEle[1].split(",");
    var angle = 0;
    var work  = 0;
    
    point.x1 = Contents.Util.Indicator.$convertInchToPixel(
        parseFloat(stEle[0])) - 1;
    point.y1 = Contents.Util.Indicator.$convertInchToPixel(
        parseFloat(stEle[1])) - 1;
    point.x2 = Contents.Util.Indicator.$convertInchToPixel(
        parseFloat(edEle[0])) - 1;
    point.y2 = Contents.Util.Indicator.$convertInchToPixel(
        parseFloat(edEle[1])) - 1;
    point.w = Math.abs(point.x2 - point.x1) + 1;
    point.h = Math.abs(point.y2 - point.y1) + 1;

    // 垂直または水平の場合はangleを0とする
    if(point.x1 == point.x2 || point.y1 == point.y2) {
      point.angle = 0;
    // 傾きが正の場合はangleを1とする
    } else if((point.y2 - point.y1) / (point.x2 - point.x1) > 0) {
      point.angle = 1;
    // 傾きが負の場合はangleを2とする
    } else {
      point.angle = 2;
    }

    // x2よりx1の方が値が大きい場合はx1、x2を入れ替える
    if(point.x1 > point.x2) {
      work = point.x1;
      point.x1 = point.x2;
      point.x2 = work;
    }
    
    // y2よりy1の方が値が大きい場合はy1、y2を入れ替える
    if(point.y1 > point.y2) {
      work = point.y1;
      point.y1 = point.y2;
      point.y2 = work;
    }
    
    return point;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * インチからピクセルに変換
 * @private
 * @param {number} num インチサイズ
 * @return {number} ピクセルサイズ
 */
Contents.Util.Indicator.$convertInchToPixel = function(num) {
  var METHODNAME = "Contents.Util.Indicator.$convertInchToPixel";
  try {
    
    var ret = 0;
    ret = Math.round(num * 96);
    return ret;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 診断フロー
 * @namespace 診断フロークラス
 */
Contents.FlowHandler = {};

/**
 * aタグに設定するtabIndex
 */
Contents.FlowHandler.LINK_TABINDEX = "-1";

/**
 * 診断フローの1セルのサイズ(px)
 * @private
 * @type number
 */
Contents.FlowHandler.FLOW_CELL_SIZE = 180;

/**
 * 全体図の1辺のサイズ(px)
 * @private
 * @type number
 */
Contents.FlowHandler.FLOW_NAVI_SIZE = 200;

/**
 * 診断フローの枠上の次手順表示時の表示位置のX座標(px)
 * @private
 * @type number
 */
Contents.FlowHandler.FLOW_JUMP_PROCESS_CELLPOSITION_X = 0;

/**
 * 診断フローの枠上の次手順表示時の表示位置のY座標(px)
 * @private
 * @type number
 */
Contents.FlowHandler.FLOW_JUMP_PROCESS_CELLPOSITION_Y = 190;

/**
 * 手順名称の表示セルまでの左マージン(px)
 * @private
 * @type number
 */
Contents.FlowHandler.FLOW_ITEM_MARGIN_LEFT = 17;

/**
 * 診断フローの1辺のサイズ(px)
 * @private
 * @type number
 */
Contents.FlowHandler.nFlowBodySize = 0;

/**
 * 診断フローと全体図の幅の縮尺
 * @private
 * @type number
 */
Contents.FlowHandler.nFlowScaleW = 0;

/**
 * 診断フローと全体図の高さの縮尺
 * @private
 * @type number
 */
Contents.FlowHandler.nFlowScaleH = 0;

/**
 * ドラッグの有無
 * @private
 * @type boolean
 */
Contents.FlowHandler.isDragged = false;

/**
 * マウスダウン時のマウスカーソルのX座標
 * @private
 * @type number
 */
Contents.FlowHandler.nMouseDownPosX = 0;

/**
 * マウスダウン時のマウスカーソルのY座標
 * @private
 * @type number
 */
Contents.FlowHandler.nMouseDownPosY = 0;

/**
 * マウスダウン時の赤枠のX座標
 * @private
 * @type number
 */
Contents.FlowHandler.nMouseDownNaviPosX = 0;

/**
 * マウスダウン時の赤枠のY座標
 * @private
 * @type number
 */
Contents.FlowHandler.nMouseDownNaviPosY = 0;

/**
 * マウスダウン時の診断フローのX座標
 * @private
 * @type number
 */
Contents.FlowHandler.nMouseDownFlowPosX = 0;

/**
 * マウスダウン時の診断フローのY座標
 * @private
 * @type number
 */
Contents.FlowHandler.nMouseDownFlowPosY = 0;

/**
 * マウスムーブ時の赤枠のX座標の移動距離の小数部
 * @private
 * @type number
 */
Contents.FlowHandler.nMoveRemainderX = 0;

/**
 * マウスムーブ時の赤枠のY座標の移動距離の小数部
 * @private
 * @type number
 */
Contents.FlowHandler.nMoveRemainderY = 0;

/**
 * マウスムーブ時の赤枠のX座標の移動距離の小数部
 * @private
 * @type number
 */
Contents.FlowHandler.nLastMoveRemainderX = 0;

/**
 * マウスムーブ時の赤枠のY座標の移動距離の小数部
 * @private
 * @type number
 */
Contents.FlowHandler.nLastMoveRemainderY = 0;

/**
 * 診断フロー、全体図の初期化処理
 */
Contents.FlowHandler.$init = function() {
  var METHODNAME = "Contents.FlowHandler.$init";
  try {
    
    var own = Contents.FlowHandler;
    var nFlowMaxCell = 0;
    var elmFlowMaxCell = $("flow_max_cell");
    var elmFlowBody = $("flow_body");
    
    // 診断フローのdiv要素が無い場合、処理を終了する
    if(!own.$isFlow()) {
      return;
    }
    
    window.location.hash = "";
    
    own.$setTabIndex();
    own.$setItemName();
    
    nFlowMaxCell = parseInt(elmFlowMaxCell.innerHTML, 10);
    // 診断フローの1辺のサイズ＝
    // 診断フローの1セルのサイズ×診断フローの1辺のセル数
    own.nFlowBodySize = own.FLOW_CELL_SIZE * nFlowMaxCell;
    
    Element.$addClassName($$("html")[0], "noscrollbar");
    own.$doResizeFlow();
    
    Use.Util.$observe(window, "resize", own.$doResizeFlow);
    Use.Contents.$observeFlow(own);
    own.$observeFlowItem();
    Use.Util.$observe(elmFlowBody, "mouseover", own.$doMouseoverHideButton);
    own.$observeShowProc();
    own.$observeLnkJumpProc();
    
    own.$jumpProc(Contents.mySuccession.SBPARA_ID);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フロー判定
 * @return {boolean} true:診断フローです, false:診断フローではありません
 */
Contents.FlowHandler.$isFlow = function() {
  var METHODNAME = "Contents.FlowHandler.$isFlow";
  try {
    
    var aryFlowFrame = $$("div#flow_frame");
    var isFlow = false;
    
    // 診断フローの要素が存在すれば、trueを設定する。
    if(aryFlowFrame.length == 1) {
      isFlow = true;
    }
    
    return isFlow;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順一覧判定
 * @return {boolean} true:手順一覧です, false:手順一覧ではありません
 */
Contents.FlowHandler.$isList = function() {
  var METHODNAME = "Contents.FlowHandler.$isList";
  try {
    
    var aryFlowFrame = $$("div#list_frame");
    var isList = false;
    
    // 手順一覧の要素が存在すれば、trueを設定する。
    if(aryFlowFrame.length == 1) {
      isList = true;
    }
    
    return isList;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フロー内のタブインデックスを設定
 * @private
 */
Contents.FlowHandler.$setTabIndex = function() {
  var METHODNAME = "Contents.FlowHandler.$setTabIndex";
  try {
    var aryElm = Util.Selector.$select("a", $("div#flow_frame"));
    var len = aryElm.length;
    // 診断フロー内のすべてのaタグにフォーカス移動できないように設定
    for(var i = 0; i < len; i++) {
      Element.$writeAttribute(aryElm[i], 
          "tabIndex", Contents.FlowHandler.LINK_TABINDEX);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローの項目名設定
 * @private
 */
Contents.FlowHandler.$setItemName = function() {
  var METHODNAME = "Contents.FlowHandler.$setItemName";
  try {
    
    var elmNaviTitle = $$("div#navi_title a")[0];
    var elmNaviExpand = Util.Selector.$select("a", $("navi_expand"))[0];
    var aryBtnProcName = $$("span.btnProcName");
    var aryBtnJudgeName = $$("span.btnJudgeName");
    var nBtnProc = aryBtnProcName.length;
    var nBtnJudge = aryBtnJudgeName.length;
    var strBtnProcName = Use.Util.$getMessage("CONST_CONTENTS_FLOW_BTN_PROC");
    var strBtnJudgeName = Use.Util.$getMessage("CONST_CONTENTS_FLOW_BTN_JUDGE");
    
    elmNaviTitle.innerHTML = 
        Use.Util.$getMessage("CONST_CONTENTS_FLOW_NAVE_TITLE");
    elmNaviExpand.innerHTML = "X";
    
    // 手順詳細ボタン名を設定する。
    for(var i = 0; i < nBtnProc; i++) {
      aryBtnProcName[i].innerHTML = strBtnProcName;
    }
    
    // 判断基準ボタン名を設定する。
    for(var i = 0; i < nBtnJudge; i++) {
      aryBtnJudgeName[i].innerHTML = strBtnJudgeName;
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローのサイズを設定
 */
Contents.FlowHandler.$doResizeFlow = function() {
  var METHODNAME="Contents.FlowHandler.$doResizeFlow";
  try{
    var own=Contents.FlowHandler;
    var elmFlowNaviTitle = null;
    var elmFlowNavi = null;
    own.$doResizeFlowFrameSize();
    own.$doResizeFlowBodySize();
    Use.Contents.$setFlowNavi(own);
  }catch(err){
    Use.SystemError.$show(err,METHODNAME);
  }
};

/**
 * 診断フローの枠のサイズを設定
 */
Contents.FlowHandler.$doResizeFlowFrameSize = function() {
  var METHODNAME = "Contents.FlowHandler.$doResizeFlowFrameSize";
  try {
    
    var elmHtml = $$("html")[0];
    var elmContentsBody = $("contentsBody");
    var elmFlowFrame = $("flow_frame");
    
    var objDimHtml = Element.$getDimensions(elmHtml);
    var nHtmlW = parseInt(objDimHtml.width, 10);
    var nHtmlH = parseInt(objDimHtml.height, 10);
    var nContentsBodyML = parseInt(Element.$getStyle(elmContentsBody, 
        "margin-left").replace("px", ""), 10);
    var nContentsBodyMR = parseInt(Element.$getStyle(elmContentsBody, 
        "margin-right").replace("px", ""), 10);
    
    // 診断フローの枠の幅＝HTML要素の幅
    // －（「id="contentsBody"のdiv要素」の左のマージン＋右のマージン）
    var nFlowFrameW = nHtmlW - (nContentsBodyML + nContentsBodyMR);
    // 診断フローの枠の高さ＝HTML要素の高さ－診断フローの枠のoffsetTop
    var nFlowFrameH = nHtmlH - (elmFlowFrame.offsetTop);
    
    Element.$setStyle(elmFlowFrame, "width:" + nFlowFrameW + "px;");
    Element.$setStyle(elmFlowFrame, "height:" + nFlowFrameH + "px;");
    
    Use.Util.$setStyle_iPad(elmFlowFrame, "overflow:" + "auto;");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローのサイズを設定
 * @private
 */
Contents.FlowHandler.$doResizeFlowBodySize = function() {
  var METHODNAME = "Contents.FlowHandler.$doResizeFlowBodySize";
  try {
    
    var own = Contents.FlowHandler;
    var elmFlowFrame = $("flow_frame");
    var elmFlowBody = $("flow_body");
    var objDimFlowFrame = Element.$getDimensions(elmFlowFrame);
    var nFlowSizeW = own.nFlowBodySize;
    var nFlowSizeH = own.nFlowBodySize;
    
    // 診断フローの幅が、診断フローの枠の幅より小さい場合、
    // 診断フローの枠の幅と同じにする
    if(nFlowSizeW < objDimFlowFrame.width) {
      nFlowSizeW = objDimFlowFrame.width;
    }
    // 診断フローの高さが、診断フローの枠の高さより小さい場合、
    // 診断フローの枠の高さと同じにする
    if(nFlowSizeH < objDimFlowFrame.height) {
      nFlowSizeH = objDimFlowFrame.height;
    }
    
    Element.$setStyle(elmFlowBody, "width:" + nFlowSizeW + "px;");
    Element.$setStyle(elmFlowBody, "height:" + nFlowSizeH + "px;");
    
    // 診断フローと全体図の縮尺＝診断フローの1辺のサイズ÷全体図の1辺のサイズ
    own.nFlowScaleW = nFlowSizeW / own.FLOW_NAVI_SIZE;
    own.nFlowScaleH = nFlowSizeH / own.FLOW_NAVI_SIZE;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 全体図の赤枠のサイズを設定
 */
Contents.FlowHandler.$doResizeViewSize = function() {
  var METHODNAME = "Contents.FlowHandler.$doResizeViewSize";
  try {
    
    var own = Contents.FlowHandler;
    var elmFlowFrame = $("flow_frame");
    var elmFlowNavi = $("flow_navi");
    var elmView = $("view");
    
    var objDimFlowFrame = Element.$getDimensions(elmFlowFrame);
    var nFlowFrameW = parseInt(objDimFlowFrame.width, 10);
    var nFlowFrameH = parseInt(objDimFlowFrame.height, 10);
    // 全体図の赤枠の幅＝診断フローの枠の幅÷診断フローと全体図の縮尺
    var nViewW = Math.round(nFlowFrameW / own.nFlowScaleW);
    // 全体図の赤枠の高さ＝診断フローの枠の高さ÷診断フローと全体図の縮尺
    var nViewH = Math.round(nFlowFrameH / own.nFlowScaleH);
    var nViewTopBW = parseInt(Element.$getStyle(elmView, 
        "border-top-width").replace("px", ""), 10);
    var nViewRitBW = parseInt(Element.$getStyle(elmView, 
        "border-right-width").replace("px", ""), 10);
    var nViewBtmBW = parseInt(Element.$getStyle(elmView, 
        "border-bottom-width").replace("px", ""), 10);
    var nViewLftBW = parseInt(Element.$getStyle(elmView, 
        "border-left-width").replace("px", ""), 10);
    var nViewTop = parseInt(Element.$getStyle(elmView, 
        "top").replace("px", ""), 10);
    var nViewLft = parseInt(Element.$getStyle(elmView, 
        "left").replace("px", ""), 10);
    var nFlowNaviW = parseInt(Element.$getStyle(elmFlowNavi, 
        "width").replace("px", ""), 10);
    var nFlowNaviH = parseInt(Element.$getStyle(elmFlowNavi, 
        "height").replace("px", ""), 10);
    
    // 全体図の幅を赤枠が超える場合、全体図の幅で上書き
    if(nViewW > nFlowNaviW) {
      nViewW = nFlowNaviW;
    }
    // 全体図の高さを赤枠が超える場合、全体図の高さで上書き
    if(nViewH > nFlowNaviH) {
      nViewH = nFlowNaviH;
    }
    // 下端が枠からはみ出る場合はそれ以上大きくしない
    if((nViewTop + nViewH) > nFlowNaviH) {
      nViewH = nFlowNaviH - nViewTop;
    }
    // 右端が枠からはみ出る場合はそれ以上大きくしない
    if((nViewLft + nViewW) > nFlowNaviW) {
      nViewW = nFlowNaviW - nViewLft;
    }
    
    // 全体図の赤枠のborderを含まない幅＝
    // 全体図の赤枠の幅－（左borderの幅＋右borderの幅）
    nViewW = nViewW - (nViewLftBW + nViewRitBW);
    // 全体図の赤枠のborderを含まない高さ＝
    // 全体図の赤枠の幅－（上のborderの幅＋下のborderの幅）
    nViewH = nViewH - (nViewTopBW + nViewBtmBW);
    
    Element.$setStyle(elmView, "width:" + nViewW + "px;");
    Element.$setStyle(elmView, "height:" + nViewH + "px;");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 全体図表示切替（診断フロー全体図タイトルリンククリック時）
 */
Contents.FlowHandler.$doClickOverviewSwitchLnk = function() {
  var METHODNAME = "Contents.FlowHandler.$doClickOverviewSwitchLnk";
  try {
    
    var elmFlowNavi = $("flow_navi");
    var elmNaviExpand = Util.Selector.$select("a", $("navi_expand"))[0];
    
    // 全体図表示中の場合は非表示にする
    if(!Element.$hasClassName(elmFlowNavi, "invisible")) {
      Element.$addClassName(elmFlowNavi, "invisible");
      elmNaviExpand.innerHTML = "[]";
      
    // 全体図非表示中の場合は表示する
    } else {
      Element.$removeClassName(elmFlowNavi, "invisible");
      elmNaviExpand.innerHTML = "X";
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローのマウスダウン時の情報をセット
 * @param {Event} evt イベントオブジェクト
 */
Contents.FlowHandler.$doMousedownFlowSetMouseInfo = function(evt) {
  var METHODNAME = "Contents.FlowHandler.$doMousedownFlowSetMouseInfo";
  try {
    
    var own = Contents.FlowHandler;
    
    var objPos = own.$getMousePosition(evt);
    var elmFlowBody = $("flow_body");
    var elmView = $("view");
    
    // マウスダウン時のカーソルのX座標、Y座標を取得する
    own.nMouseDownPosX = objPos.x;
    own.nMouseDownPosY = objPos.y;
    
    // マウスダウン時の診断フローのX座標、Y座標を取得する
    own.nMouseDownFlowPosX = parseInt(Element.$getStyle(elmFlowBody, 
        "margin-left").replace("px", ""), 10);
    own.nMouseDownFlowPosY = parseInt(Element.$getStyle(elmFlowBody, 
        "margin-top").replace("px", ""), 10);
    
    // マウスダウン時の赤枠のX座標、Y座標を取得する
    own.nMouseDownNaviPosX = parseInt(Element.$getStyle(elmView, 
        "left").replace("px", ""), 10);
    own.nMouseDownNaviPosY = parseInt(Element.$getStyle(elmView, 
        "top").replace("px", ""), 10);
    
    own.nMoveRemainderX = 0;
    own.nMoveRemainderY = 0;
    own.isDragged = true;
    
    Use.Contents.$resetFlowFrameScroll();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フロー全体図のマウスダウン時の情報をセット
 * @param {Event} evt イベントオブジェクト
 */
Contents.FlowHandler.$doMousedownNaviSetMouseInfo = function(evt) {
  var METHODNAME = "Contents.FlowHandler.$doMousedownNaviSetMouseInfo";
  try {
    
    var own = Contents.FlowHandler;
    
    var objOffset = Event.$getOffset(evt);
    var elmFlowBody = $("flow_body");
    var elmView = $("view");
    
    // マウスカーソルの座標が赤枠の範囲内であるか判定する
    var isMouseOnView = own.$isMouseOnViewElement(objOffset, elmView);
    
    // 赤枠の範囲内の場合、マウスダウン時の情報をセットする
    if(isMouseOnView) {
      // マウスダウン時のカーソルのX座標、Y座標を取得する
      own.nMouseDownPosX = objOffset.x;
      own.nMouseDownPosY = objOffset.y;
      
      // マウスダウン時の診断フローのX座標、Y座標を取得する
      own.nMouseDownFlowPosX = parseInt(Element.$getStyle(elmFlowBody, 
          "margin-left").replace("px", ""), 10);
      own.nMouseDownFlowPosY = parseInt(Element.$getStyle(elmFlowBody, 
          "margin-top").replace("px", ""), 10);
      
      // マウスダウン時の赤枠のX座標、Y座標を取得する
      own.nMouseDownNaviPosX = parseInt(Element.$getStyle(elmView, 
          "left").replace("px", ""), 10);
      own.nMouseDownNaviPosY = parseInt(Element.$getStyle(elmView, 
          "top").replace("px", ""), 10);
      
      own.isDragged = true;
    }
    
    Use.Contents.$resetFlowFrameScroll();

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フロー、診断フロー全体図のマウスダウン時の情報をリセット
 */
Contents.FlowHandler.$doMouseupResetMouseInfo = function() {
  var METHODNAME = "Contents.FlowHandler.$doMouseupResetMouseInfo";
  try {
    
    var own = Contents.FlowHandler;
    
    // 直前までドラッグしていた場合はマウスダウン時の値をリセットする
    if(own.isDragged) {
      own.nMouseDownPosX = 0;
      own.nMouseDownPosY = 0;
      
      own.nMouseDownNaviPosX = 0;
      own.nMouseDownNaviPosY = 0;
      
      own.nMouseDownFlowPosX = 0;
      own.nMouseDownFlowPosY = 0;
      
      own.nLastMoveRemainderX = own.nMoveRemainderX;
      own.nLastMoveRemainderY = own.nMoveRemainderY;
      own.nMoveRemainderX = 0;
      own.nMoveRemainderY = 0;
      
      own.isDragged = false;
    }
    
    Use.Contents.$resetFlowFrameScroll();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローと診断フロー全体図の連携(診断フロー内をドラッグして移動時)
 * @param {Event} evt イベントオブジェクト
 */
Contents.FlowHandler.$doMousemoveFlowBody = function(evt) {
  var METHODNAME = "Contents.FlowHandler.$doMousemoveFlowBody";
  try {
    
    var own = Contents.FlowHandler;
    var objPos = {};
    var elmFlowBody = null;
    var elmView = null;
    var nMoveX = 0;
    var nMoveY = 0;
    var wMoveX = 0;
    var wMoveY = 0;
    var aryMoveX = [];
    var aryMoveY = [];
    
    // ドラッグしている場合は、診断フローの移動と全体図の枠の連携をする
    if(own.isDragged) {
      elmFlowBody = $("flow_body");
      elmView = $("view");
      
      objPos = own.$getMousePosition(evt);
      // マウスのX軸の移動距離＝
      // マウスの現在のX軸の座標－マウスダウン時のX軸の座標
      nMoveX = objPos.x - own.nMouseDownPosX;
      // マウスのY軸の移動距離＝
      // マウスの現在のY軸の座標－マウスダウン時のY軸の座標
      nMoveY = objPos.y - own.nMouseDownPosY;
      
      objPos = own.$flowBodyMovePosition(nMoveX, nMoveY);
      
      Element.$setStyle(elmFlowBody, "margin-left:" + objPos.x + "px;");
      Element.$setStyle(elmFlowBody, "margin-top:" + objPos.y + "px;");
      
      if(nMoveX != 0) {
        // 全体図上のX軸の移動距離＝
        // 診断フロー上のマウスのX軸の移動距離÷診断フローと全体図の縮尺×-1
        wMoveX = ((nMoveX * 1000) / (own.nFlowScaleW * 1000) * (-1 * 1000)) / 1000;
        wMoveX = ((wMoveX * 1000) + (own.nLastMoveRemainderX * 1000)) / 1000;
        // X軸の移動距離を、整数部、小数部に分割
        aryMoveX = (String(wMoveX)).split(".");
        // 整数部を設定
        nMoveX = parseInt(aryMoveX[0]);
        // 小数部を次回ドラッグ時に繰越しするために保持
        if(Util.$isUndefined(aryMoveX[1]) == false) {
          if(wMoveX > 0) {
            own.nMoveRemainderX = parseFloat("0." + aryMoveX[1]);
          } else if(nMoveX < 0) {
            own.nMoveRemainderX = parseFloat("-0." + aryMoveX[1]);
          }
        } else {
          own.nMoveRemainderX = 0;
        }
      }
      if(nMoveY != 0) {
        // 全体図上のY軸の移動距離＝
        // 診断フロー上のマウスのY軸の移動距離÷診断フローと全体図の縮尺×-1
        wMoveY = ((nMoveY * 1000) / (own.nFlowScaleH * 1000) * (-1 * 1000)) / 1000;
        wMoveY = ((wMoveY * 1000) + (own.nLastMoveRemainderY * 1000)) / 1000;
        // Y軸の移動距離を、整数部、小数部に分割
        aryMoveY = (String(wMoveY)).split(".");
        // 整数部を設定
        nMoveY = parseInt(aryMoveY[0]);
        // 小数部を次回ドラッグ時に繰越しするために保持
        if(Util.$isUndefined(aryMoveY[1]) == false) {
          if(wMoveY > 0) {
            own.nMoveRemainderY = parseFloat("0." + aryMoveY[1]);
          } else if(nMoveY < 0) {
            own.nMoveRemainderY = parseFloat("-0." + aryMoveY[1]);
          }
        } else {
          own.nMoveRemainderY = 0;
        }
      }
      
      objPos = own.$viewMovePosition(nMoveX, nMoveY);
      
      Element.$setStyle(elmView, "left:" + objPos.x + "px;");
      Element.$setStyle(elmView, "top:" + objPos.y + "px;");
    }
    
    Use.Contents.$resetFlowFrameScroll();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローと診断フロー全体図の連携(診断フロー全体図をドラッグして移動時)
 * @param {Event} evt イベントオブジェクト
 */
Contents.FlowHandler.$doMousemoveView = function(evt) {
  var METHODNAME = "Contents.FlowHandler.$doMousemoveView";
  try {
    
    var own = Contents.FlowHandler;
    var objPos = {};
    var elmFlowBody = null;
    var elmView = $("view");
    var elmNaviCover = $("navi_cover");
    var objOffset = Event.$getOffset(evt);
    var nMoveX = 0;
    var nMoveY = 0;
    
    // マウスカーソルの座標が赤枠の範囲内であるか判定する
    var isMouseOnView = own.$isMouseOnViewElement(objOffset, elmView);
    
    // 赤枠の範囲外でドラッグしていない場合のみカーソル表示をautoにする
    if(isMouseOnView == true) {
      Element.$setStyle(elmNaviCover, "cursor: move;");
    } else {
      if(own.isDragged == false) {
        Element.$setStyle(elmNaviCover, "cursor: auto;");
      }
    }
    
    // ドラッグしている場合は、全体図の枠の移動と診断フローの連携をする
    if(own.isDragged) {
      elmFlowBody = $("flow_body");
      
      // マウスのX軸の移動距離＝
      // マウスの現在のX軸の座標－マウスダウン時のX軸の座標
      nMoveX = objOffset.x - own.nMouseDownPosX;
      // マウスのY軸の移動距離＝
      // マウスの現在のY軸の座標－マウスダウン時のY軸の座標
      nMoveY = objOffset.y - own.nMouseDownPosY;
      
      objPos = own.$viewMovePosition(nMoveX, nMoveY);
      
      Element.$setStyle(elmView, "left:" + objPos.x + "px;");
      Element.$setStyle(elmView, "top:" + objPos.y + "px;");
      
      // 診断フロー上のマウスのX軸の移動距離＝
      // 全体図上のX軸の移動距離×診断フローと全体図の縮尺×-1
      nMoveX = nMoveX * own.nFlowScaleW * -1;
      // 診断フロー上のマウスのY軸の移動距離＝
      // 全体図上のY軸の移動距離×診断フローと全体図の縮尺×-1
      nMoveY = nMoveY * own.nFlowScaleH * -1;
      
      objPos = own.$flowBodyMovePosition(nMoveX, nMoveY);
      
      Element.$setStyle(elmFlowBody, "margin-left:" + objPos.x + "px;");
      Element.$setStyle(elmFlowBody, "margin-top:" + objPos.y + "px;");
    }
    
    Use.Contents.$resetFlowFrameScroll();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順名称にイベントを登録する
 * @private
 */
Contents.FlowHandler.$observeFlowItem = function() {
  var METHODNAME = "Contents.FlowHandler.$observeFlowItem";
  try {
    
    var own = Contents.FlowHandler;
    var aryElmFlowItem = $$("div.flowItem");
    var nFlowItemLen = aryElmFlowItem.length;
    
    // 手順名称数分、詳細手順ボタン、判断基準ボタンを表示するイベントを登録する
    for(var i = 0; i < nFlowItemLen; i++) {
      Use.Util.$observe(aryElmFlowItem[i], 
          "mouseover", own.$doMouseoverViewButton);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順リンクにイベントを登録する
 * @private
 */
Contents.FlowHandler.$observeLnkJumpProc = function() {
  var METHODNAME = "Contents.FlowHandler.$observeLnkJumpProc";
  try {
    
    var own = Contents.FlowHandler;
    var aryElmLnkJumpProc = $$("a.lnkJumpProc");
    var nLnkJumpProcLen = aryElmLnkJumpProc.length;
    
    // 手順リンク数分、次手順表示のイベントを登録する
    for(var i = 0; i < nLnkJumpProcLen; i++) {
      Use.Util.$observe(aryElmLnkJumpProc[i], 
          "click", own.$doClickProceduresLnk);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順詳細表示(手順詳細ボタンクリック時)、<br />
 * 判断基準表示(判断基準ボタンクリック時)、<br />
 * 手順詳細表示(診断フローの終端ボックスのリンククリック時)
 * @private
 */
Contents.FlowHandler.$observeShowProc = function() {
  var METHODNAME = "Contents.FlowHandler.$observeShowProc";
  try {
    
    var own = Contents.FlowHandler;
    var strFuncId = "";
    var strAnchor = "";
    var elmParaId = $("para_id");
    var aryElmLnkShowProc = $$("a.lnkShowProc");
    
    var strParaId = elmParaId.innerHTML;
    var nLnkShowProcLen = aryElmLnkShowProc.length;
    var elmLnkShowProc = null;
    var elmLnkShowProcPar = null;
    var aryElmAnchor = null;
    
    Util.$propcopy(Contents.mySuccession, Contents.mySuccessionMode3);
    Contents.$setModelessParam("3", "MODE", "3");
    Contents.$setModelessParam("3", "PAR_ID", strParaId);
    Contents.$setModelessParam("3", "PAR", "");
    Contents.$setModelessParam("3", "SBPARA_ID", "");
    
    // 手順詳細画面表示のリンク数分、手順詳細画面表示イベントを登録する
    for(var i = 0; i < nLnkShowProcLen; i++) {
      strFuncId = "";
      strAnchor = "";
      
      elmLnkShowProc = aryElmLnkShowProc[i];
      
      elmLnkShowProcPar = elmLnkShowProc.parentNode;
      // 手順詳細ボタンクリック時の機能IDを設定
      if(Element.$hasClassName(elmLnkShowProcPar, "btnProc")) {
        strFuncId = "MAN08";
        
      // 判断基準ボタンクリック時の機能IDを設定
      } else if(Element.$hasClassName(elmLnkShowProcPar, "btnJudge")) {
        strFuncId = "MAN09";
        
      // 終端の手順詳細リンククリック時の機能IDを設定
      } else if(Element.$hasClassName(elmLnkShowProcPar, "flowTerm")) {
        strFuncId = "MAN10";
      }
      
      aryElmAnchor = Util.Selector.$select("span.invisible", elmLnkShowProc);
      
      // アンカーを保持する要素がある場合、アンカーを取得する
      if(aryElmAnchor.length == 1) {
        strAnchor = aryElmAnchor[0].innerHTML;
      }
      
      Use.Util.$observe(elmLnkShowProc, "click",
          (function(funcId, paraId, anchor) {
            return function() {
              own.$doClickProcedures(funcId, paraId, anchor);
            };
          })(strFuncId, strParaId, strAnchor)
      );
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 詳細手順ボタン、判断基準ボタンを表示する
 * @param {Event} evt イベントオブジェクト
 */
Contents.FlowHandler.$doMouseoverViewButton = function(evt) {
  var METHODNAME = "Contents.FlowHandler.$doMouseoverViewButton";
  try {
    
    var elm = Event.$element(evt);
    var elmId = elm.id;
    var elmBtnProc = $("SP_" + elmId);
    var elmBtnJudge = $("SJ_" + elmId);
    
    // 手順名称に紐づく詳細手順ボタンを表示
    if(elmBtnProc) {
      Element.$removeClassName(elmBtnProc, "invisible");
    }
    
    // 手順名称に紐づく判断基準ボタンを表示
    if(elmBtnJudge) {
      Element.$removeClassName(elmBtnJudge, "invisible");
    }
    
    Use.Contents.$resetFlowFrameScroll();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 詳細手順ボタン、判断基準ボタンを非表示にする
 * @param {Event} evt イベントオブジェクト
 */
Contents.FlowHandler.$doMouseoverHideButton = function(evt) {
  var METHODNAME = "Contents.FlowHandler.$doMouseoverHideButton";
  try {
    
    var elm = Event.$element(evt);
    var strTagName = elm.tagName;
    var aryElmBtnProc = null;
    var aryElmBtnJudge = null;
    var nBtnProcLen = 0;
    var nBtnJudgeLen = 0;
    
    strTagName = strTagName.toLowerCase();
    
    // a要素の場合、親要素に置き換える
    if(strTagName == "a") {
      elm = elm.parentNode;
      
    // span要素の場合、親要素の親要素に置き換える
    } else if(strTagName == "span") {
      elm = elm.parentNode.parentNode;
    }
    
    // カーソルのある要素が、手順名称、詳細手順ボタン、判断基準ボタンの場合、
    // 処理を終了する
    if(Element.$hasClassName(elm, "flowItem")
        || Element.$hasClassName(elm, "btnProc")
        || Element.$hasClassName(elm, "btnJudge")
        ) {
      return;
    }
    
    aryElmBtnProc = $$("div.btnProc");
    aryElmBtnJudge = $$("div.btnJudge");
    nBtnProcLen = aryElmBtnProc.length;
    nBtnJudgeLen = aryElmBtnJudge.length;
    
    // 詳細手順ボタンを非表示にする
    for(var i = 0; i < nBtnProcLen; i++) {
      Element.$addClassName(aryElmBtnProc[i], "invisible");
    }
    
    // 判断基準ボタンを非表示にする
    for(var i = 0; i < nBtnJudgeLen; i++) {
      Element.$addClassName(aryElmBtnJudge[i], "invisible");
    }
    
    Use.Contents.$resetFlowFrameScroll();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 次手順表示(診断フローの手順リンククリック時)
 * @param {Event} evt イベントオブジェクト
 */
Contents.FlowHandler.$doClickProceduresLnk = function(evt) {
  var METHODNAME = "Contents.FlowHandler.$doClickProceduresLnk";
  try {
    
    var own = Contents.FlowHandler;
    var objPos = null;
    var elmFlowBody = $("flow_body");
    var elmView = $("view");
    
    var elm = Event.$element(evt);
    
    var strAnchor = "";
    var aryElmAnchor = Util.Selector.$select("span.invisible", elm);
    
    // アンカーを保持する要素がある場合、アンカーを取得する
    if(aryElmAnchor.length == 1) {
      strAnchor = aryElmAnchor[0].innerHTML;
    }
    
    own.$jumpProc(strAnchor);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 手順詳細表示(手順詳細ボタンクリック時)、<br />
 * 判断基準表示(判断基準ボタンクリック時)、<br />
 * 手順詳細表示(診断フローの終端ボックスのリンククリック時)
 * @param {string} strFuncId 機能ID
 * @param {string} strParaId パラグラフID
 * @param {string} strAnchor アンカー
 */
Contents.FlowHandler.$doClickProcedures = function(
    strFuncId, strParaId, strAnchor) {
  var METHODNAME = "Contents.FlowHandler.$doClickProcedures";
  try {
    
    var param = {};
    
    Contents.$setModelessParam("3", "FUNC_ID", strFuncId);
    Util.$propcopy(Contents.mySuccessionMode3, param);
    Contents.myParent.$callbackProcedures(
        Contents.showPubType, strParaId, strAnchor, param);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローの移動位置取得
 * @private
 * @param {number} nMoveX 移動距離X軸
 * @param {number} nMoveY 移動距離Y軸
 * @return {object(連想配列)} 移動位置
 */
Contents.FlowHandler.$flowBodyMovePosition = function(nMoveX, nMoveY) {
  var METHODNAME = "Contents.FlowHandler.$flowBodyMovePosition";
  try {
    
    var own = Contents.FlowHandler;
    var objPos = null;
    var elmFlowBody = $("flow_body");
    
    // 診断フローの移動後の左マージン＝
    // 診断フローのマウスダウン時の左マージン＋X軸の移動距離
    nPosX = own.nMouseDownFlowPosX + nMoveX;
    // 診断フローの移動後の上マージン＝
    // 診断フローのマウスダウン時の上マージン＋Y軸の移動距離
    nPosY = own.nMouseDownFlowPosY + nMoveY;
    
    objPos = own.$flowBodyMoveRange(nPosX, nPosY);
    
    return objPos;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 全体図の赤枠の移動位置取得
 * @private
 * @param {number} nMoveX 移動距離X軸
 * @param {number} nMoveY 移動距離Y軸
 * @return {object(連想配列)} 移動位置
 */
Contents.FlowHandler.$viewMovePosition = function(nMoveX, nMoveY) {
  var METHODNAME = "Contents.FlowHandler.$viewMovePosition";
  try {
    
    var own = Contents.FlowHandler;
    var objPos = null;
    var elmView = $("view");
    
    // 全体図の赤枠の移動後の左からの座標＝
    // 全体図の赤枠のマウスダウン時の左からの座標＋X軸の移動距離
    nPosX = own.nMouseDownNaviPosX + nMoveX;
    // 全体図の赤枠の移動後の上からの座標＝
    // 全体図の赤枠のマウスダウン時の上からの座標＋Y軸の移動距離
    nPosY = own.nMouseDownNaviPosY + nMoveY;
    
    objPos = own.$viewMoveRange(nPosX, nPosY);
    
    return objPos;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローの座標の境界値を判定
 * @private
 * @param {number} nPosX X軸
 * @param {number} nPosY Y軸
 * @return {object(連想配列)} 移動可能範囲内の移動位置
 */
Contents.FlowHandler.$flowBodyMoveRange = function(nPosX, nPosY) {
  var METHODNAME = "Contents.FlowHandler.$flowBodyMoveRange";
  try {
    
    var objPos = {
        x: 0, 
        y: 0
    };
    var elmFlowFrame = $("flow_frame");
    var elmFlowBody = $("flow_body");
    
    var objDimFlowFrame = Element.$getDimensions(elmFlowFrame);
    var objDimFlowBody = Element.$getDimensions(elmFlowBody);
    var nFlowFrameW = parseInt(objDimFlowFrame.width, 10);
    var nFlowFrameH = parseInt(objDimFlowFrame.height, 10);
    var nFlowBodyW = parseInt(objDimFlowBody.width, 10);
    var nFlowBodyH = parseInt(objDimFlowBody.height, 10);
    
    // 診断フローの移動可能領域のX軸の上限値＝
    // 診断フローの枠の幅－診断フローの幅
    var nRangeW = nFlowFrameW - nFlowBodyW;
    // 診断フローの移動可能領域のY軸の下限値＝
    // 診断フローの枠の高さ－診断フローの高さ
    var nRangeH = nFlowFrameH - nFlowBodyH;
    
    // X軸が上限値より大きい場合は上限値をX軸に設定する
    if(nPosX < nRangeW) {
      nPosX = nRangeW;
      
    // X軸が下限値未満の場合は下限値をX軸に設定する
    } else if(nPosX > 0) {
      nPosX = 0;
    }
    
    // Y軸が上限値より大きい場合は上限値をY軸に設定する
    if(nPosY < nRangeH) {
      nPosY = nRangeH;
      
    // Y軸が下限値未満の場合は下限値をY軸に設定する
    } else if(nPosY > 0) {
      nPosY = 0;
    }
    
    objPos.x = nPosX;
    objPos.y = nPosY;
    
    return objPos;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 全体図の赤枠の座標の境界値を判定
 * @private
 * @param {number} nPosX X軸
 * @param {number] nPosY Y軸
 * @return {object(連想配列)} 移動可能範囲内の移動位置
 */
Contents.FlowHandler.$viewMoveRange = function(nPosX, nPosY) {
  var METHODNAME = "Contents.FlowHandler.$viewMoveRange";
  try {
    
    var objPos = {
        x: 0, 
        y: 0
    };
    var own = Contents.FlowHandler;
    var elmView = $("view");
    
    var nViewW = parseInt(Element.$getStyle(elmView, 
        "width").replace("px", ""), 10);
    var nViewH = parseInt(Element.$getStyle(elmView, 
        "height").replace("px", ""), 10);
    var nViewTopBW = parseInt(Element.$getStyle(elmView, 
        "border-top-width").replace("px", ""), 10);
    var nViewRitBW = parseInt(Element.$getStyle(elmView, 
        "border-right-width").replace("px", ""), 10);
    var nViewBtmBW = parseInt(Element.$getStyle(elmView, 
        "border-bottom-width").replace("px", ""), 10);
    var nViewLftBW = parseInt(Element.$getStyle(elmView, 
        "border-left-width").replace("px", ""), 10);
    
    // 全体図の赤枠の移動可能領域のX軸の上限値＝
    // 全体図の幅－（全体図の赤枠の幅＋（左のborderの幅＋右のborderの幅））
    var nRangeW = own.FLOW_NAVI_SIZE - (nViewW + (nViewLftBW + nViewRitBW));
    // 全体図の赤枠の移動可能領域のY軸の上限値＝
    // 全体図の高さ－（全体図の赤枠の高さ＋（上のborderの幅＋下のborderの幅））
    var nRangeH = own.FLOW_NAVI_SIZE - (nViewH + (nViewTopBW + nViewBtmBW));
    
    // X軸が上限値より大きい場合は上限値をX軸に設定する
    if(nPosX < 0) {
      nPosX = 0;
      
    // X軸が下限値未満の場合は下限値をX軸に設定する
    } else if(nPosX > nRangeW) {
      nPosX = nRangeW;
    }
    
    // Y軸が上限値より大きい場合は上限値をY軸に設定する
    if(nPosY < 0) {
      nPosY = 0;
      
    // Y軸が下限値未満の場合は下限値をY軸に設定する
    } else if(nPosY > nRangeH) {
      nPosY = nRangeH;
    }
    
    objPos.x = nPosX;
    objPos.y = nPosY;
    
    return objPos;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 次手順表示
 * @private
 * @param {string} strAnchor アンカー
 */
Contents.FlowHandler.$jumpProc = function(strAnchor) {
  var METHODNAME = "Contents.FlowHandler.$jumpProc";
  try {
    
    var own = Contents.FlowHandler;
    var objPos = {};
    var elmFlowBody = null;
    var elmView = null;
    var elmFlowItem = null;
    var nPosX = 0;
    var nPosY = 0;
    var nMoveX = 0;
    var nMoveY = 0;
    
    // アンカーが空文字の場合、処理を終了する
    if(!strAnchor) {
      return;
    }
    
    elmFlowItem = $(strAnchor);
    // 次手順がフロー上に存在しない場合、処理を終了する
    if(elmFlowItem == null) {
      return;
    }
    
    elmFlowBody = $("flow_body");
    elmView = $("view");
    
    nPosX = parseInt(Element.$getStyle(elmFlowItem, 
        "margin-left").replace("px", ""), 10);
    nPosY = parseInt(Element.$getStyle(elmFlowItem, 
        "margin-top").replace("px", ""), 10);
    
    // 次手順の表示位置のX座標＝診断フローの枠上の次手順表示時の表示位置のX座標
    // －（次手順のX座標－次手順の表示セルまでの左マージン）
    nMoveX = own.FLOW_JUMP_PROCESS_CELLPOSITION_X 
        - (nPosX - own.FLOW_ITEM_MARGIN_LEFT);
    // 次手順の表示位置のY座標＝診断フローの枠上の次手順表示時の表示位置のY座標
    // －次手順のY座標
    nMoveY = own.FLOW_JUMP_PROCESS_CELLPOSITION_Y - nPosY;
    
    objPos = own.$flowBodyMoveRange(nMoveX, nMoveY);
    
    Use.Contents.$setFlowBodyPostion(objPos.x, objPos.y);
    
    // 全体図上のX軸の移動距離＝
    // （診断フロー上のマウスのX軸の移動距離÷診断フローと全体図の縮尺）×-1
    nMoveX = Math.round(nMoveX / own.nFlowScaleW) * -1;
    // 全体図上のY軸の移動距離＝
    // （診断フロー上のマウスのY軸の移動距離÷診断フローと全体図の縮尺）×-1
    nMoveY = Math.round(nMoveY / own.nFlowScaleH) * -1;
    
    Use.Contents.$setViewPostion(own, nMoveX, nMoveY);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * マウスカーソルの座標取得
 * @private
 * @param {Event} evt イベントオブジェクト
 */
Contents.FlowHandler.$getMousePosition = function(evt) {
  var METHODNAME = "Contents.FlowHandler.$getMousePosition";
  try {
    var pos = {
        x: 0,
        y: 0
    };
    
    pos.x = evt.screenX;
    pos.y = evt.screenY;
    
    return pos;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * マウスカーソルの座標が赤枠の内側に存在するか判定
 * @private
 * @param {Object} objOffset オフセットオブジェクト
 * @param {Element} elmView 全体図の赤枠のDOM要素
 */
Contents.FlowHandler.$isMouseOnViewElement = function(objOffset, elmView) {
  var METHODNAME = "Contents.FlowHandler.$getMousePosition";
  try {
    var isMouseOnView = false;
    var posX = objOffset.x;
    var posY = objOffset.y;
    var objDimView = Element.$getDimensions(elmView);
    
    // 赤枠のX座標、Y座標の開始、終了位置を取得する
    var viewXStart = parseInt(Element.$getStyle(elmView, 
            "left").replace("px", ""), 10);
    var viewWidth = parseInt(objDimView.width, 10);
    var viewXEnd = viewXStart + viewWidth;
    
    var viewYStart = parseInt(Element.$getStyle(elmView, 
            "top").replace("px", ""), 10);
    var viewHeight = parseInt(objDimView.height, 10);
    var viewYEnd = viewYStart + viewHeight;
    
    // マウスカーソルの座標が赤枠の範囲内である場合
    if(viewXStart <= posX && posX <= viewXEnd) {
      if(viewYStart <= posY && posY <= viewYEnd) {
        // 赤枠範囲内フラグをtrueにする
        isMouseOnView = true;
      }
    }
    
    return isMouseOnView;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};
