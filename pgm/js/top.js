/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2013/10/04 */

/**
 * file top.js<br />
 *
 * @fileoverview このファイルには、TOP画面(CD版)についての処理が<br />
 * 定義されています。<br />
 * file-> top.js
 * @author 渡会
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/02/10|1.0.0   |渡会|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/02/10 渡会 ・新規作成
 *---------------------------------------------------------------------------*/
/**
 * Top画面クラス
 * @namespace Top画面クラス
 */
var Top = {};

/**
 * ファイルパスの格納定数
 * @type object(連想配列)
 */
Top.PATH_LIST = {
  "SERVICE":  "",
  "PUBBIND":  "",
  "RELEASE":  ""
};

/**
 * Xパスの格納定数
 * @type object(連想配列)
 */
Top.XPATH_LIST = {
  "PUBBIND":  "//pub-bind[@id]",
  "TRGT":     "//market-code",
  "BRAND":    "//brand",
  "MODEL":    "//model-name",
  "VTYPE":    "//model-code",
  "OPT1":     "//option1",
  "OPT2":     "//option2",
  "OPT3":     "//option3",
  "OPT4":     "//option4",
  "OPT5":     "//option5",
  "TERM":     "//term[@date]",
  "LANG":     "//media-lang[@lang]",
  "DATE":     "//media-release[@date]",
  "FLLMDL":   "//full-model-code/name",
  "MANUALS":  "//bind-manual"
};

/**
 * TOP画面保持の共通情報
 * @private
 * @type object(連想配列)
 */
Top.globalInfo = {
  "VIEW_LANG":    "",
  "PUB_BIND_ID":  "",
  "FOR_LANG_CODE":"",
  "FOR_LANG":     "",
  "BRAND":        "",
  "OPTION1":      "",
  "OPTION2":      "",
  "OPTION3":      "",
  "OPTION4":      "",
  "OPTION5":      "",
  "CAR_NAME":     "",
  "CAR_TYPE":     "",
  "TYPE":         "",
  "TEKI_DATE":    "",
  "LANG_CODE":    "",
  "LANG_NAME":    "",
  "START_TYPE":   "",
  "PARTS_CD":     "",
  "KEYWORD":      "",
  "SCH_OPT_DEF":  "",
  "SCH_OPT_SEL":  "",
  "SCH_OPT_INF":  "0",
  "CONTENT_TYPE": "01",
  "MANUALS":      ""
};

/**
 * 画面内のエラー要素配列
 * @private
 * @type array
 */
Top.errorElements = [];

/**
 * 索引画面から設定された検索キーワード
 * @private
 * @type string
 */
Top.indexKeywordTxt = "";

/**
 * 新規Window時のオプション
 * @type string
 */
Top.WINDOW_OPEN_OPTION = "\
left=0,top=0,toolbar=no,menubar=no,\
directories=no,status=yes,scrollbars=yes,resizable=yes";
/**
 * フェイスボックスインスタンス
 * @private
 * @type Facebox
 */
Top.faceBox = null;

/**
 * Top画面クラスの初期化処理
 */
Top.$init = function() {
  var METHODNAME = "Top.$init";
  try {
    
    var getPath = Use.Util.$getContentsPath;
    
    Top.faceBox = new Facebox();
    
    Use.$init(Top.faceBox);
    Use.Util.$stopSubmit(document.forms[0]);
    
    Field.$setValue($("keyword"), Use.Util.$getMessage("CONST_DEFKEYROWD"));
    Element.$addClassName($("keyword"), "deftxt");
    
    // 定数の初期化処理
    Top.PATH_LIST.SERVICE = getPath("C_TOP_OPEN_SERVICE_PATH");
    Top.PATH_LIST.PUBBIND = getPath("C_TOP_PUBBIND_XML_PATH");
    Top.PATH_LIST.RELEASE = getPath("C_TOP_RELEASE_XML_PATH");
    
    // イベント登録
    Use.Util.$observe($("keyword"), "change", Top.$doBeforeChangeKeywordTxt);
    Use.Util.$observe($("keyword"), "keydown", Top.$doKeydownKeywordTxt);
    Use.Util.$observe($("keyword"), "focus", Top.$doFocusKeywordTxt);
    Use.Util.$observe($("keyword"), "blur", Top.$doBlurKeywordTxt);
    
    Use.Util.$observe($("btn_service"), "click", Top.$doBeforeClickServiceBtn);
    Use.Util.$observe($("btn_search"), "click", Top.$doBeforeClickSearchBtn);
    Use.Util.$observe($("mdl_readme"), "click", Top.$doClickHajimeLnk);
    Use.Util.$observe($("mdl_index"), "click", Top.$doClickSakuinLnk);
    Use.Util.$observe($("lnk_help"), "click", Top.$doClickHelpLnk);
    Use.Util.$observe($("teki_date"), "change", Top.$doBeforeChangePubbndTrmfrymSel);
    
    // XML読込み開始
    Top.$loadPubBindXml();
    
    Use.Util.$addClassName_iPad($$("div#navigation p")[0] ,"iPad");
    
    $("mdl_readme").focus();
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 世代絞込み用XMLの取得処理(pub-bind.xml)
 * @private
 */
Top.$loadPubBindXml = function() {
  var METHODNAME = "Top.$loadPubBindXml";
  try {
    
    Use.Util.$request(
      Top.PATH_LIST.PUBBIND,
      true,
      Top.$getPubBindOnSuccess,
      Top.$getPubBindOnFailure,
      true,
      true
    );
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 世代絞込み用XMLの取得成功処理(pub-bind.xml)
 * @param {Response} res レスポンスオブジェクト
 */
Top.$getPubBindOnSuccess = function(res) {
  var METHODNAME = "Top.$getPubBindOnSuccess";
  try {
    
    // 車種世代コードの保持
    var doc = res.responseXML;
    var ele = Util.$getSingleNode(doc, Top.XPATH_LIST.PUBBIND);
    Top.globalInfo.PUB_BIND_ID = Util.$getAttrValue(ele, "id");
    
    Top.$loadReleaseXml(res);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 世代絞込み用XMLの取得失敗処理(pub-bind.xml)
 * @param {Response} res レスポンスオブジェクト
 */
Top.$getPubBindOnFailure = function(res) {
  var METHODNAME = "Top.$getPubBindOnFailure";
  try {
    
    Use.SystemError.$show(null, METHODNAME, "MVWF0123DAE");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * メディア版リリースXMLの取得処理(media-release.xml)
 * @private
 * @param {Response} res レスポンスオブジェクト(pub-bind.xml)
 */
Top.$loadReleaseXml = function(res) {
  var METHODNAME = "Top.$loadReleaseXml";
  try {
    
    Use.Util.$request(
      Top.PATH_LIST.RELEASE,
      true,
      (function(pubbindRes) {
        return function(releaseRes) {
          Top.$getReleaseOnSuccess(pubbindRes, releaseRes)
        }
      })(res),
      Top.$getReleaseOnFailure,
      true,
      true
    );
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * メディア版リリースXMLの取得成功処理(media-release.xml)
 * @param {Response} pubbindRes レスポンスオブジェクト(pub-bind.xml)
 * @param {Response} releaseRes レスポンスオブジェクト(media-release.xml)
 */
Top.$getReleaseOnSuccess = function(pubbindRes, releaseRes) {
  var METHODNAME = "Top.$getReleaseOnSuccess";
  try {
    
    var pubbindDoc = pubbindRes.responseXML;
    var releaseDoc = releaseRes.responseXML;
    
    Top.$setCarInfo(pubbindDoc, releaseDoc);
    Top.$setBindManuals(pubbindDoc, releaseDoc);
    // はじめにお読みくださいを表示
    //Top.$doClickHajimeLnk();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * メディア版リリースXMLの取得失敗処理(media-release.xml)
 * @param {Response} res レスポンスオブジェクト
 */
Top.$getReleaseOnFailure = function(res) {
  var METHODNAME = "Top.$getReleaseOnFailure";
  try {
    
    Use.SystemError.$show(null, METHODNAME, "MVWF0123DAE");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 車両情報設定処理
 * @private
 * @param {object} pubbindDoc DOM ROOTオブジェクト(pub-bind.xml)
 * @param {object} releaseRes DOM ROOTオブジェクト(media-release.xml)
 */
Top.$setCarInfo = function(pubbindDoc, releaseDoc) {
  var METHODNAME = "Top.$setCarInfo";
  try {
    
    var trgtList = {
      "J": "Japan",
      "U": "North America",
      "E": "Europe And General"
    };
    var key = null;
    
    /* @private */
    var getSingleValue = function(doc, xpath) {
      var elm = Util.$getSingleNode(doc, xpath);
      // 取得成功時は要素内文字列を返し、失敗時は""を返す
      return elm ? Util.$getNodeText(elm) : "";
    }
    
    // 仕向け表示欄の設定
    key = getSingleValue(pubbindDoc, Top.XPATH_LIST.TRGT);
    // 値の取得に成功している場合は変換し、失敗している場合はそのまま出力
    $("for_lang_name").innerHTML = key ? trgtList[key] : key;
    Top.globalInfo.FOR_LANG_CODE = key;
    Top.globalInfo.FOR_LANG = trgtList[key];
    
    // ブランド表示欄の設定
    key = getSingleValue(pubbindDoc, Top.XPATH_LIST.BRAND);
    $("brand_name").innerHTML = key;
    Top.globalInfo.BRAND = key;
    
    // 車名表示欄の設定
    Top.$setCarName(pubbindDoc);
    
    // 型式表示欄の設定
    Top.$setModelType(pubbindDoc);
    
    // オプション１表示欄の設定
    key = getSingleValue(pubbindDoc, Top.XPATH_LIST.OPT1);
    // 文字列がある場合のみ処理
    if(key) {
      $("option1").innerHTML = key;
      Top.globalInfo.OPTION1 = key;
      Element.$removeClassName($("option1").parentNode, "invisible");
    }
    
    // オプション２表示欄の設定
    key = getSingleValue(pubbindDoc, Top.XPATH_LIST.OPT2);
    // 文字列がある場合のみ処理
    if(key) {
      $("option2").innerHTML = key;
      Top.globalInfo.OPTION2 = key;
      Element.$removeClassName($("option2").parentNode, "invisible");
    }
    
    // オプション３表示欄の設定
    key = getSingleValue(pubbindDoc, Top.XPATH_LIST.OPT3);
    // 文字列がある場合のみ処理
    if(key) {
      $("option3").innerHTML = key;
      Top.globalInfo.OPTION3 = key;
      Element.$removeClassName($("option3").parentNode, "invisible");
    }
    
    // オプション４表示欄の設定
    key = getSingleValue(pubbindDoc, Top.XPATH_LIST.OPT4);
    // 文字列がある場合のみ処理
    if(key) {
      $("option4").innerHTML = key;
      Top.globalInfo.OPTION4 = key;
      Element.$removeClassName($("option4").parentNode, "invisible");
    }
    
    // オプション５表示欄の設定
    key = getSingleValue(pubbindDoc, Top.XPATH_LIST.OPT5);
    // 文字列がある場合のみ処理
    if(key) {
      $("option5").innerHTML = key;
      Top.globalInfo.OPTION5 = key;
      Element.$removeClassName($("option5").parentNode, "invisible");
    }
    
    // 適用時期表示欄の設定
    Top.$setTekiDate(pubbindDoc);
    
    // 言語表示欄の設定
    Top.$setLang(releaseDoc);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 車名設定処理
 * @private
 * @param {object} doc DOM ROOTオブジェクト(pub-bind.xml)
 */
Top.$setCarName = function(doc) {
  var METHODNAME = "Top.$setCarName";
  try {
    
    var els = Util.$getNodes(doc, Top.XPATH_LIST.MODEL);
    var txtAry = [];
    var len = els.length;
    var pEle = null;
    var idx = 0;
    
    // ソート用配列の作成
    for(idx = 0; idx < len; idx++) {
      txtAry.push(Util.$getNodeText(els[idx]));
    }
    txtAry.sort();
    
    // 車名の数だけ画面上に表示
    for(idx = 0; idx < len; idx++) {
      pEle = document.createElement("p");
      pEle.innerHTML = txtAry[idx];
      $("car_name_list").appendChild(pEle);
      // カウンタが0の場合はカンマを付与しない
      Top.globalInfo.CAR_NAME += idx ? "," + txtAry[idx] : txtAry[idx];
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 型式設定処理
 * @private
 * @param {object} doc DOM ROOTオブジェクト(pub-bind.xml)
 */
Top.$setModelType = function(doc) {
  var METHODNAME = "Top.$setModelType";
  try {
    
    var els = Util.$getNodes(doc, Top.XPATH_LIST.VTYPE);
    var txtAry = [];
    var len = els.length;
    var pEle = document.createElement("p");
    var idx = 0;
    var current = "";
    
    // ソート用配列の作成
    for(idx = 0; idx < len; idx++) {
      current = Util.$getNodeText(els[idx]);
      if(Util.$getIndexOfArray(txtAry, current) == -1) {
        txtAry.push(current);
      }
    }
    txtAry.sort();
    
    // 型式の数だけ画面上に表示
    len = txtAry.length;
    for(idx = 0; idx < len; idx++) {
      // カウンタが0の場合はカンマを付与しない
      $("model_type").innerHTML += idx ? "," : "";
      $("model_type").innerHTML += txtAry[idx];
    }
    pEle.innerHTML = $("model_type").innerHTML.replace(/,/g, ", ");
    $("model_type_list").appendChild(pEle);
    Top.globalInfo.TYPE = $("model_type").innerHTML;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 適用時期設定処理
 * @private
 * @param {object} doc DOM ROOTオブジェクト(pub-bind.xml)
 */
Top.$setTekiDate = function(doc) {
  var METHODNAME = "Top.$setTekiDate";
  try {
    
    var els = Util.$getNodes(doc, Top.XPATH_LIST.TERM);
    var len = els.length;
    var sorts = [];
    var val = "";
    var my  = "";
    var key = "";
    var optEle = null;
    
    // 並び替え用処理
    for(var i = 0; i < len; i++) {
      sorts.push({
        "DATE": Util.$getAttrValue(els[i], "date"),
        "MY"  : Util.$getAttrValue(els[i], "model-year")
      });
    }
    
    // 適用時期をソートする
    sorts.sort(function(bef, aft) {
      return bef.DATE > aft.DATE ? -1 : 1;
    });
    
    // 最大件数が1件を超える場合、ブランク行の追加を行う
    if(len > 1) {
      optEle = document.createElement("option");
      optEle.selected = true;
      optEle.value = "";
      optEle.innerHTML = "";
      $("teki_date").appendChild(optEle);
    }
    
    // 適用時期の数だけ画面上に表示
    for(var i = 0; i < len; i++) {
      val = sorts[i].DATE;
      key = val + "/";
      my = "";
      
      // モデルイヤーがある場合は付与する
      if(sorts[i].MY.replace(/^[ 　\\t]*$/, "")) {
        my = sorts[i].MY;
        key += my;
        my = my.replace(/([0-9]{4})/, "($1MY)");
      }
      val = val.replace(/([0-9]{4})([0-9]{2})/, "$1.$2") + my;
      key += "/" + val;
      optEle = document.createElement("option");
      optEle.value = key;
      optEle.innerHTML = val;
      $("teki_date").appendChild(optEle);
    }
    
    Event.$fireEvent($("teki_date"), "change");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 言語設定処理
 * @private
 * @param {object} doc DOM ROOTオブジェクト(media-release.xml)
 */
Top.$setLang = function(doc) {
  var METHODNAME = "Top.$setLang";
  try {
    
    var ele = Util.$getSingleNode(doc, Top.XPATH_LIST.LANG);
    $("lang_cd").innerHTML = Util.$getAttrValue(ele, "lang");
    $("lang_name").innerHTML = 
        DictConst.C_LANG_NAME[Util.$getAttrValue(ele, "lang")];
    Top.globalInfo.VIEW_LANG = $("lang_cd").innerHTML;
    Top.globalInfo.LANG_CODE = $("lang_cd").innerHTML;
    Top.globalInfo.LANG_NAME = $("lang_name").innerHTML;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 適用時期選択値変更(適用時期プルダウン選択値変更)
 * @param {Event} evt イベントオブジェクト
 */
Top.$doBeforeChangePubbndTrmfrymSel = function(evt) {
  var METHODNAME = "Top.$doBeforeChangePubbndTrmfrymSel";
  try {
    
    var ele = Event.$element(evt);
    var len = Top.errorElements.length;
    
    // エラー項目の初期化
    for(var i = 0; i < len; i++) {
      Element.$removeClassName(
        Top.errorElements[i], Use.Util.CLASS_INPUT_ERROR);
    }
    Top.globalInfo.TEKI_DATE = ele.value;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 収録マニュアル情報表示エリア設定処理
 * @private
 * @param {object} pubbindDoc DOM ROOTオブジェクト(pub-bind.xml)
 * @param {object} releaseRes DOM ROOTオブジェクト(media-release.xml)
 */
Top.$setBindManuals = function(pubbindDoc, releaseDoc) {
  var METHODNAME = "Top.$setBindManuals";
  try {
    
    var els = Util.$getNodes(pubbindDoc, Top.XPATH_LIST.MANUALS);
    var elm = Util.$getSingleNode(releaseDoc, Top.XPATH_LIST.DATE);
    var len = els.length;
    var key = "";
    var idx = 0;
    var manualIdx = 0;
    var dateReg = /([0-9]{4})([0-9]{2})([0-9]{2})/;
    var prefix = "CONST_MANUAL_NAME_";
    //var prefix = "CONST_TABNAME_";
    var target = null;
    var tgtRows = Util.Selector.$select("tr", $("manual_info_table"));
    var manuals = [];
    var rowInfo = {};
    var codes = [];
    var patern = {
      "RM":1, "NM":2, "EM":3, "BM":4, "OM":5,
      "ER":6, "DM":7, "WC":8, "HR":9
    };
    var manualType = {
      "RM":"00", "NM":"10", "EM":"20", "BM":"30", "OM":"40",
      "WC":"70", "HR":"80", "ER":"60", "DM":"50"
    };
    var dt = null;
    var tmpInfo = [];
    
    // マニュアル数分ループ処理を行う
    for(idx = 0; idx < len; idx++) {
      key = Util.$getAttrValue(els[idx], "type");
      
      // 未登録の場合のみ処理を行う
      if(Util.$getIndexOfArray(tmpInfo, key) == -1) {
        rowInfo = {"TYPE": "", "NAME": "", "ORDER": 0};
        rowInfo.TYPE = key;
        rowInfo.NAME = Use.Util.$getMessage(prefix + key);
        rowInfo.ORDER = patern[key];
        
        manuals.push(rowInfo);
        tmpInfo.push(key);
        
        codes += idx ? "," + manualType[key] : manualType[key];
      }
    }
    
    Top.globalInfo.MANUALS = codes;
    Top.globalInfo.SCH_OPT_DEF = codes.replace(/(,?[4-9]{1}0)+/g, "");
    Top.globalInfo.SCH_OPT_SEL = Top.globalInfo.SCH_OPT_DEF;
    
    // 取得した項目を降順にする
    manuals.sort(function (bef, aft) {
      // befの値がaftより大きい場合は-1を、違う場合は1を返す
      return bef["ORDER"] > aft["ORDER"] ? 1 : -1;
    });
    
    len = tgtRows.length;
    
    // 収録マニュアルの行数分ループ処理を行う
    for(idx = 0; idx < len; idx++) {
      target = Util.Selector.$select("td", tgtRows[idx])[0];
      // 収録マニュアルがあまっている場合は名称を設定
      if(manuals.length > manualIdx) {
        target.innerHTML = manuals[manualIdx].NAME;
        manualIdx += 1;
      // 無い場合は行のクラス名を除去する
      } else {
        tgtRows[idx].className = "";
      }
    }

    // 日付の更新
    key = Util.$getAttrValue(elm, "date");
    dt = new Date(parseInt(key.substr(0, 4), 10),
        parseInt(key.substr(4, 2) - 1, 10),
        parseInt(key.substr(6, 2), 10));
    $("release_date").innerHTML =
        Use.Util.$getMessage("CONST_TOP_BIND_MANUALS_DATE")
        + Use.Util.$getFormatDate(dt, Top.globalInfo.VIEW_LANG);

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * TOP共通情報の取得処理
 * @return object(連想配列) グローバルインフォ
 */
Top.$getGlobalInfo = function() {
  var METHODNAME = "Top.$getGlobalInfo";
  try {
    
    var myGlobalInfo = {};
    Util.$propcopy(Top.globalInfo, myGlobalInfo);
    return myGlobalInfo;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 検索キーワードのonFocusイベント
 * @param {Event} evt イベントオブジェクト
 */
Top.$doFocusKeywordTxt = function(evt) {
  var METHODNAME = "Top.$doFocusKeywordTxt";
  try {
    
    var target = Event.$element(evt);
    
    // deftxtクラスがある場合、未入力にする
    if(Element.$hasClassName(target, "deftxt") == true) {
      Field.$setValue(target, "");
      Element.$removeClassName(target, "deftxt");
      Util.$setTextBoxSelection(target);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 検索キーワードのonBlurイベント
 * @param {Event} evt イベントオブジェクト
 */
Top.$doBlurKeywordTxt = function(evt) {
  var METHODNAME = "Top.$doBlurKeywordTxt";
  try {
    
    var target = Event.$element(evt);
    
    // 未入力の場合、デフォルト値を設定
    if(Field.$getValue(target) == "") {
      Field.$setValue(target, Use.Util.$getMessage("CONST_DEFKEYROWD"));
      Element.$addClassName(target, "deftxt");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 検索キーワード入力(検索キーワード変更時)
 */
Top.$doBeforeChangeKeywordTxt = function() {
  var METHODNAME = "Top.$doBeforeChangeKeywordTxt";
  try {
    
    Element.$removeClassName($("keyword"), Use.Util.CLASS_INPUT_ERROR);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 検索キーワード内でキー押下
 * @param {Event} evt イベントオブジェクト
 */
Top.$doKeydownKeywordTxt = function(evt) {
  var METHODNAME = "Top.$doKeydownKeywordTxt";
  try {
    
    var keyCode = Event.$getKeyCode(evt);
    
    // Enterキー押下の場合は簡易検索処理の実行
    if(keyCode == Event.KEY_RETURN) {
      Element.$removeClassName($("keyword"), Use.Util.CLASS_INPUT_ERROR);
      Top.$doBeforeClickSearchBtn();
      Event.$stop(evt);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 簡易検索(検索ボタン押下時)
 */
Top.$doBeforeClickSearchBtn = function() {
  var METHODNAME = "Top.$doBeforeClickSearchBtn";
  try {
    
    var valid = Use.Validator;
    var keywordText = Field.$getValue($("keyword"));
    var msg = "";
    var url = Top.PATH_LIST.SERVICE;
    var opt = Top.WINDOW_OPEN_OPTION;
    
    var errors = [];
    var keywordName = Use.Util.$getMessage("CONST_KEYWORD_NM");
    
    // 検索キーワードにdeftxtクラスがある場合、未入力とする
    if(Element.$hasClassName($("keyword"), "deftxt")) {
      keywordText = "";
    }
    
    // プルダウンの必須チェック
    if(!$("teki_date").value) {
      msg = "MVWF0003AAE";
      errors.push($("teki_date"));
    }
    // 検索キーワードの必須チェック
    if(!valid.$isNotEmpty(keywordText)) {
      msg = msg || "MVWF0004AAE";
      errors.push($("keyword"));
    // テキストのサイズチェック
    } else if(!valid.$checkSize(keywordText, 200)) {
      msg = msg || "MVWF0005AAE";
      errors.push($("keyword"));
    // 単語数チェック
    } else if(!valid.$checkNumberOfWords(keywordText, 30)) {
      msg = msg || "MVWF0007AAE";
      errors.push($("keyword"));
    // 禁止文字チェック
    } else if(valid.$checkPermissionWord(keywordText) != -1) {
      msg = msg || "MVWF1008AAE";
      errors.push($("keyword"));
    // 空文字チェック
    } else if(valid.$isAllBlank(keywordText)) {
      msg = msg || "MVWF1011AAE";
      errors.push($("keyword"));
    }
    
    // msgに文字列がある場合はキーワードのNG処理
    if(msg) {
      Use.Util.$alert(Use.Util.$getMessage(msg, keywordName), errors);
      Top.errorElements = errors;
    // 文字列が無ければ正常と判断
    } else {
      // 検索キーワードが、索引画面から設定された検索キーワードと異なる場合
      // 品名コードをクリアする
      if(keywordText != Top.indexKeywordTxt) {
        Top.globalInfo.PARTS_CD = "";
      }
      
      Top.globalInfo.START_TYPE = "2";
      $("start_type").innerHTML = "2";
      Top.globalInfo.KEYWORD = keywordText;
      Util.$openUrl(url, "_blank", opt, Util.WINDOW_SIZE_1)
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 閲覧画面表示(サービス情報ボタン押下時)
 */
Top.$doBeforeClickServiceBtn = function() {
  var METHODNAME = "Top.$doBeforeClickServiceBtn";
  try {
    
    var url = Top.PATH_LIST.SERVICE;
    var opt = Top.WINDOW_OPEN_OPTION;
    var keywordText = Field.$getValue($("keyword"));
    
    // プルダウンの必須チェックがNGの場合はアラート表示
    if(!$("teki_date").value) {
      Use.Util.$alert(Use.Util.$getMessage("MVWF0003AAE"), [$("teki_date")]);
      Top.errorElements = [$("teki_date")];
    // OKの場合は画面表示処理
    } else {
      // 検索キーワードにdeftxtクラスがある場合、未入力とする
      if(Element.$hasClassName($("keyword"), "deftxt")) {
        keywordText = "";
      }
      
      // 検索キーワードが、索引画面から設定された検索キーワードと異なる場合
      // 品名コードをクリアする
      if(keywordText != Top.indexKeywordTxt) {
        Top.globalInfo.PARTS_CD = "";
      }
      
      Top.globalInfo.START_TYPE = "1";
      $("start_type").innerHTML = "1";
      Top.globalInfo.KEYWORD = keywordText;
      Util.$openUrl(url, "_blank", opt, Util.WINDOW_SIZE_1);
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * ヘルプ画面表示(ヘルプリンククリック時)
 */
Top.$doClickHelpLnk = function(sw, sh) {
  var METHODNAME = "Top.$doClickHelpLnk";
  try {
    
    var url = "";
    var opt = Top.WINDOW_OPEN_OPTION;
    var tgt = "ShowGuideBook_" + Use.Util.$getInitDate();
    
    // マニュアル言語、ブランドによりヘルプを切替える
    if(!(Top.globalInfo.LANG_CODE == "ja"
        && DictConst.C_BRAND_CODE[Top.globalInfo.BRAND] == "E2")) {
      // 日本語のLEXUS以外の場合のヘルプのパスを設定する
      url = Use.Util.$getContentsPath("C_TOP_OPEN_HELP_PATH");
    } else {
      // 日本語のLEXUSの場合のヘルプのパスを設定する
      url = Use.Util.$getContentsPath("C_TOP_OPEN_HELP_PATH_FOR_LEXUS_JA");
    }
    
    Util.$openUrl(url, tgt, opt, Util.WINDOW_SIZE_1);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 索引リスト選択画面表示(索引リスト選択画面表示アイコンクリック時)
 */
Top.$doClickSakuinLnk = function() {
  var METHODNAME = "Top.$doClickSakuinLnk";
  try {
    
    Use.Index.$show(
      Top.faceBox,
      Top.$setIndexResults,
      Top.globalInfo.LANG_CODE,
      Top.globalInfo.LANG_CODE,
      $("mdl_index")
    );
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * はじめにお読みください画面表示(はじめにお読みください表示リンククリック時)
 */
Top.$doClickHajimeLnk = function() {
  var METHODNAME = "Top.$doClickHajimeLnk";
  try {
    
    var url = "";
    
    // マニュアル言語、ブランドによりreadmeを切替える
    if(!(Top.globalInfo.LANG_CODE == "ja"
        && DictConst.C_BRAND_CODE[Top.globalInfo.BRAND] == "E2")) {
      // 日本語のLEXUS以外の場合のreadmeのパスを設定する
      url = Use.Util.$getContentsPath("C_TOP_OPEN_README_PATH");
    } else {
      // 日本語のLEXUSの場合のreadmeのパスを設定する
      url = Use.Util.$getContentsPath("C_TOP_OPEN_README_PATH_FOR_LEXUS_JA");
    }
    
    Use.Util.$request(
      url,
      true,
      Top.$getReadMeOnSuccess,
      Top.$getReadMeOnFailure,
      true,
      false
    );
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * HTML取得成功時の処理(readme.html)
 * @param {Response} res レスポンスオブジェクト
 */
Top.$getReadMeOnSuccess = function(res) {
  var METHODNAME = "Top.$getReadMeOnSuccess";
  try {
    
    var root = $$("html")[0];
    var klass = root.className;
    var title = Use.Util.$getMessage("CONST_README_TTL");
    var inEle = document.createElement("div");
    
    inEle.innerHTML = res.responseText;
    inEle.innerHTML =
      Util.Selector.$select("div#contents_body", inEle)[0].innerHTML;
    $("readme_body").innerHTML = inEle.innerHTML;
    
    Use.Util.$revealFacebox(Top.faceBox, $("readme"), "", true, title, true);
    $("mdl_readme").focus();
    Use.Util.$observe($("fbx_btn_agree"), "click",
      function() { Top.$doClickYesBtn(klass) });
    Use.Util.$observe($("fbx_btn_notagree"), "click",
      function() { Top.$doClickNoBtn(klass) });
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * HTML取得失敗時の処理(readme.html)
 * @param {object} res レスポンスオブジェクト
 */
Top.$getReadMeOnFailure = function(res) {
  var METHODNAME = "Top.$getReadMeOnFailure";
  try {
    
    Use.SystemError.$show(null, METHODNAME, "MVWF0123DAE");
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 「同意する」押下時の処理
 * @param {string} klass HTMLエレメントのデフォルトクラス名
 */
Top.$doClickYesBtn = function(klass) {
  var METHODNAME = "Top.$doClickYesBtn";
  try {
    
    Top.faceBox.close();
    Element.$addClassName($$("html")[0], klass);
    $("mdl_readme").focus();
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 「同意しない」押下時の処理
 * @param {string} klass HTMLエレメントのデフォルトクラス名
 */
Top.$doClickNoBtn = function(klass) {
  var METHODNAME = "Top.$doClickNoBtn";
  try {
    
    Top.faceBox.close(true);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}

/**
 * 索引画面のコールバック処理
 * @param {element} article 選択品名行
 */
Top.$setIndexResults = function(article) {
  var METHODNAME = "Top.$setIndexResults";
  try {
    
    var target = $("keyword");
    var paragraph = null;
    var articlecd = null;
    var partsName = null;
    
    // 検索キーワードのエラーをクリア
    Element.$removeClassName(target, Use.Util.CLASS_INPUT_ERROR);
    
    paragraph = Util.Selector.$select("div.paragraph", article)[0];
    articlecd = Util.Selector.$select("div.articlecode", article)[0];
    
    partsName = Util.$getNodeText(paragraph);
    
    Field.$setValue(target, partsName);
    Top.indexKeywordTxt = partsName;
    Top.globalInfo.PARTS_CD = Util.$getNodeText(articlecd);
    
    Element.$removeClassName(target, "deftxt");
    Util.$setTextBoxSelection(target);
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}
