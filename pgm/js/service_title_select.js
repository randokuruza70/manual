/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2011/12/16 */

/**
 * file service_title_select.js<br />
 *
 * @fileoverview このファイルには、タイトル選択画面についての処理が<br />
 * 定義されています。<br />
 * file> service_title_select.js
 * @author 原田
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/02/25|1.0.0|原田|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/02/25 原田・新規作成
 *---------------------------------------------------------------------------*/
/**
 * タイトル選択画面
 * @namespace タイトル選択画面クラス
 */
Service.TitleSelect = {};

//定数／メンバ変数定義
/**
 * 部品名リンクのタブインデックス
 * @type string
 */
Service.TitleSelect.LINK_TABINDEX  = "1002";

/**
 * 処理終了時にフォーカスを戻すエレメント
 * @private
 * @type element
 */
Service.TitleSelect.beforeFocus = null;

/**
 * 選択部品名行 (隠し項目)
 * @type element
 */
Service.TitleSelect.curr_rows = null;

/**
 * 初期表示
 * @param {Facebox} fbox フェイスボックスインスタンス
 * @param {function} output selectPartsInfo実行後に処理を行うfunction
 * @param {array(Element)} spans 引継ぎ項目
 * @param {element} fcsElm 終了時のフォーカスエレメント
 */
Service.TitleSelect.$show = function(fbox, output, spans, fcsElm) {
  var METHODNAME = "Service.TitleSelect.$show";
  try {
    
    var len = spans.length;
    var span = null;
    var spanInfo = "";
    var values = [];
    var divEl = null;
    var aEl = null;
    var spanEl = null;
    var target = null;
    var title = Use.Util.$getMessage("CONST_TITLESELECT_TITLE");
    Service.TitleSelect.curr_rows = null;
    Service.TitleSelect.beforeFocus = fcsElm;
    
    //項目表示設定
    Use.Util.$revealFacebox(fbox, 
        $("title_select"), "", false, title, true, "", 
            (function(myFBox) {
              return function() { 
                  Service.TitleSelect.$doClickCancelBtn(myFBox); };
            })(fbox));
    target = $("fbx_title_select_list_body");
    target.innerHTML = "";
    
    //部品名の取得
    for(var i = 0; i < len; i++) {
      span = spans[i];
      spanInfo = Util.$getNodeText(span);
      values = spanInfo.split(",");
      
      divEl = document.createElement("div");
      //奇数行の場合、スタイルcolor_row_set2をつける。
      if(i % 2 == 0) {
        divEl.className = "color_row_set1";
      //偶数行の場合、スタイルcolor_row_set1をつける。
      } else {
        divEl.className = "color_row_set2";
      }
      
      aEl = document.createElement("a");
      aEl.href = "javascript:void(0);";
      Element.$writeAttribute(aEl, 
          "tabIndex", Service.TitleSelect.LINK_TABINDEX);
      Util.$setNodeText(aEl, values[3]);
      
      spanEl = document.createElement("span");
      spanEl.className = "invisible";
      Util.$setNodeText(spanEl, values[0] + "," + values[1] + "," + values[2]);
      
      aEl.appendChild(spanEl);
      divEl.appendChild(aEl);
      target.appendChild(divEl);
      
      Use.Util.$observe(aEl, "click",
        Service.TitleSelect.$doClickPartsLnk);
    }
    
    //ボタン設定
    Event.$stopObserving($("fbx_btn_title_select_entry"));
    Use.Util.$observe($("fbx_btn_title_select_entry"), "click",
      function() { Service.TitleSelect.$doClickOkBtn(fbox, output) });
    
    Event.$stopObserving($("fbx_btn_title_select_close"));
    Use.Util.$observe($("fbx_btn_title_select_close"), "click",
      function() { Service.TitleSelect.$doClickCancelBtn(fbox) });
    
    //フォーカスをキャンセルボタンに当てる。
    $("fbx_btn_title_select_close").focus();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 部品選択(部品名クリック時)
 * @param {Event} evt イベントオブジェクト
 */
Service.TitleSelect.$doClickPartsLnk = function(evt) {
  var METHODNAME = "Service.TitleSelect.$doClickPartsLnk";
  try {
    
    var aEl = Event.$element(evt);
    var divEl = aEl.parentNode;
    //選択部品名行（隠し項目）が選択状態の場合、
    //選択部品名行のselectedをはずす。
    if (Service.TitleSelect.curr_rows != null) {
      Element.$removeClassName(Service.TitleSelect.curr_rows, "selected");
    }
    //選択部品名行（隠し項目）にselectedをつける。
    Service.TitleSelect.curr_rows = divEl;
    Element.$addClassName(divEl, "selected");
  
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 選択部品検索(OKボタン押下時)
 * @param {Facebox} fbox フェイスボックスインスタンス
 * @param {function} output selectPartsInfo実行後に処理を行うfunction
 */
Service.TitleSelect.$doClickOkBtn = function(fbox, output) {
  var METHODNAME = "Service.TitleSelect.$doClickOkBtn";
  try {
    
    var span = null;
    var spanInfo = "";
    
    //部品名行の選択状態のチェックを行う。
    if (Service.TitleSelect.curr_rows != null) {
      
      //遷移元画面への引継ぎ項目(親画面の項目へ直接設定)
      span = Service.TitleSelect.curr_rows.getElementsByTagName("span")[0];
      spanInfo = Util.$getNodeText(span);
      output(spanInfo);
      //閲覧機能（修理書（タイトル選択））画面を非表示にする。
      fbox.close();
      
    //エラーの場合、メッセージボックスを表示し、以降の処理を行わない。
    } else {
      Use.Util.$alert(Use.Util.$getMessage("MVWF0031AAE"));
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * キャンセルボタン押下時の処理
 * @param {Facebox} fbox フェイスボックスインスタンス
 */
Service.TitleSelect.$doClickCancelBtn = function(fbox) {
  var METHODNAME = "Service.TitleSelect.$doClickCancelBtn";
  try {
    
    //閲覧機能（修理書（タイトル選択））画面を非表示にする。
    fbox.close();
    //フォーカスを戻すエレメントがある場合
    if(Service.TitleSelect.beforeFocus != null) {
      Service.TitleSelect.beforeFocus.focus();
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}
