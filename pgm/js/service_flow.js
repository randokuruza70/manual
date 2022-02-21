/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2013/06/26 */

/**
 * file service_flow.js<br />
 *
 * @fileoverview このファイルには、閲覧画面(診断フロー警告・注意画面)<br />
 * 制御の関数が定義されています。<br />
 * file-> service_flow.js
 * @author 原田
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/03/10|1.0.0|原田|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/03/10 1.0.0 原田・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 閲覧機能診断フロー警告・注意画面
 * @namespace 閲覧機能診断フロー警告・注意画面クラス
 */
Service.Flow = {};

//定数／メンバ変数定義
/**
 * コンテンツ表示内容の保持用
 * @type element
 */
Service.Flow.content = null;

/**
 * パラグラフIDの保持用
 * @type string
 */
Service.Flow.paraID = "";

/**
 * サブパラIDの保持用
 * @type string
 */
Service.Flow.sbParaID = "";

/**
 * 処理終了時にフォーカスを戻すエレメント
 * @private
 * @type element
 */
Service.Flow.beforeFocus = null;

/**
 * 診断フロー警告・注意画面表示
 * @param {Facebox} fbox フェイスボックスインスタンス
 * @param {string} paraID パラグラフID
 * @param {element} fcsElm 終了時のフォーカスエレメント
 */
Service.Flow.$show = function(fbox, paraID, fcsElm) {
  var METHODNAME = "Service.Flow.$show";
  try {
    
    var title = Use.Util.$getMessage("CONST_FLOW_TITLE");
    var htmlEl = null;
    var categories = [];
    var len = 0;
    var divEl = null;
    var imgEls = null;
    var imgLen = 0;
    var imgSrc = "";
    var aryImgSrc = [];
    var pathPrefix = "";
    var target = $("flow_alert_body");
    
    target.innerHTML = "";
    Service.Flow.beforeFocus = fcsElm;
    //コンテンツ存在する場合、コンテンツ表示設定の処理を行う。
    if($("repair_body_contents").contentWindow.Contents) {
      //前回表示したparaIDと違う場合、警告・注意・参考コンテンツエリアに表示。
      if(paraID != Service.Flow.paraID) {
        Service.Flow.sbParaID = "";
        pathPrefix = Use.Util.$getContentsPath(
            "C_SERVICE_FLOW_CONTENT_IMG_PATH", "", "", "");
        htmlEl = $("repair_body_contents").contentWindow.
          Contents.$getContentsHTML();
        categories = Util.Selector.$select("div.category", htmlEl); 
        len = categories.length;
        //categories分ループを行い、クラス名no10をさがす。
        for(var i = 0; i < len; i++) {
          //クラス名category no10の場合、表示エリアに追加
          if(Element.$hasClassName(categories[i], "no10")) {
            //サブパラIDが空の場合は設定する
            if(!Service.Flow.sbParaID) {
              Service.Flow.sbParaID = categories[i].id;
            }
            divEl = document.createElement("div");
            divEl.innerHTML = categories[i].innerHTML;
            imgEls = Util.Selector.$select("img", divEl);
            imgLen = imgEls.length;
            //イメージファイルのパスを閲覧画面からの相対パスに変更
            for(var j = 0; j < imgLen; j++) {
              imgSrc = imgEls[j].src;
              aryImgSrc = imgSrc.split("/", -1);

              // IMGが要領参照リンクアイコン以外の場合
              if(DictConst.C_SERVICE_FLOW_CONTENT_REF_ICON_FILE_NAME != 
                  aryImgSrc[aryImgSrc.length - 1]) {
                imgEls[j].src = 
                    pathPrefix + aryImgSrc[aryImgSrc.length - 1];
              } else {
                // 要領参照リンクアイコンのパスを再設定
                imgEls[j].src = Use.Util.$getContentsPath(
                    "C_SERVICE_FLOW_CONTENT_REF_ICON_FILE_PATH", "", "", "");
              }

            }
            target.appendChild(divEl);
          }
        }
        
        Service.Flow.paraID = paraID;
        Service.Flow.content = target.innerHTML;
        
      //前回と同じparaIDを表示する場合、同じ内容を再表示。
      } else {
        target.innerHTML = Service.Flow.content;
      }
      //項目表示設定、ボタン設定
      Use.Util.$revealFacebox(fbox,
          $("flow_alert"), "", false, title, true, "", 
              (function(myFBox) {
                return function() { Service.Flow.$doClickOkBtn(myFBox); };
              })(fbox));
      
      //表示データの編集
      var gtsEls =  Util.Selector.$select("dd.gtsExec input",
        $("fbx_flow_alert_body"));
      var gtsLen = gtsEls.length;
      var pdfEls = Util.Selector.$select("div.pdfPattern input",
        $("fbx_flow_alert_body"));
      var pdfLen = pdfEls.length;
      var swfEls = Util.Selector.$select("div.swfPattern input",
        $("fbx_flow_alert_body"));
      var swfLen = swfEls.length;
      
      //GTSボタンの非活性処理
      for(var i = 0; i < gtsLen; i++) {
        // エレメントのtypeが"button"の場合は非活性にする
        // そうでない場合は活性にする
        gtsEls[i].disabled = gtsEls[i].type == "button" ? true : false;
      }
      
      //PDFボタンの非活性処理
      for(var i = 0; i < pdfLen; i++) {
        // エレメントのtypeが"button"の場合は非活性にする
        // そうでない場合は活性にする
        pdfEls[i].disabled = pdfEls[i].type == "button" ? true : false;
      }
      
      // SWFボタンの非活性処理
      for(var i = 0; i < swfLen; i++) {
        // エレメントのtypeが"button"の場合は非活性にする
        // そうでない場合は活性にする
        swfEls[i].disabled = swfEls[i].type == "button" ? true : false;
      }
      
      // 指示文字描画処理
      Common.Indicator.$render();
      
      Use.Util.$observe($("fbx_btn_flow_alert_entry"), "click",
        function() { Service.Flow.$doClickOkBtn(fbox) });
      Use.Util.$observe($("fbx_btn_flow_alert_show_process"), "click",
        function() { Service.Flow.$doClickProceduresBtn(paraID) });
      //OKボタンにフォーカスを当てる。
      $("fbx_btn_flow_alert_entry").focus();
    //コンテンツ存在しない場合、業務共通エラー処理(続行不可)へ
    } else {
      Use.SystemError.$show(null, METHODNAME, "MVWF0123DAE");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 診断フロー警告・注意画面閉じる
 * @param {Facebox} fbox フェイスボックスインスタンス
 */
Service.Flow.$doClickOkBtn = function(fbox) {
  var METHODNAME = "Service.Flow.$doClickOkBtn";
  try {
    
    //閲覧機能（修理書（診断フロー警告・注意））画面を非表示にする。
    fbox.close();
    //フォーカスを戻すエレメントがある場合
    if(Service.Flow.beforeFocus != null) {
      Service.Flow.beforeFocus.focus();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 手順詳細画面の表示
 * @param {string} paraID パラグラフID
 */
Service.Flow.$doClickProceduresBtn = function(paraID) {
  var METHODNAME = "Service.Flow.$doClickProceduresBtn";
  try {
    
    var tabKey = Service.TAB_CONV[Service.current.id];
    
    Util.$propcopy(
        Service.tabInfo[tabKey].FACT.mySuccession, 
        Service.tabInfo[tabKey].FACT.mySuccessionMode3
    );
    
    Service.$setModelessParam("3", "MODE", "3");
    Service.$setModelessParam("3", "FUNC_ID", "MAN13");
    Service.$callbackProcedures(
        tabKey, paraID, Service.Flow.sbParaID, null, true);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}
