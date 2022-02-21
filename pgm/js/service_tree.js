/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2012/10/24 */

/**
 * file service_tree.js<br />
 *
 * @fileoverview このファイルには、ツリーの関数が定義されています。<br />
 * file-> service_tree.js
 * @author 原田
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/03/01|1.0.0|原田|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/03/01 1.0.0 原田 ・新規作成
 *---------------------------------------------------------------------------*/

/**
 * 修理書、ボデー修理書ツリー
 * @namespace 修理書、ボデー修理書ツリークラス
 */
Service.Repair.Tree = {};
/**
 * servcat要素へのxpath
 * @type string
 */
Service.Repair.Tree.REPAIR_SERVCAT     = "//servcat";
/**
 * pub要素へのxpath
 * @type string
 */
Service.Repair.Tree.REPAIR_PUB         = "//pub";
/**
 * サービスカテゴリのプレフィックス(修理書)
 * @type string
 */
Service.Repair.Tree.PREFIX_SERVCAT_RM  = "rmsv_";
/**
 * セクションのプレフィックス(修理書)
 * @type string
 */
Service.Repair.Tree.PREFIX_SECTION_RM  = "rmsc_";
/**
 * タイトルのプレフィックス(修理書)
 * @type string
 */
Service.Repair.Tree.PREFIX_TITLE_RM    = "rmtt_";
/**
 * パラグラフのプレフィックス(修理書)
 * @type string
 */
Service.Repair.Tree.PREFIX_PARA_RM     = "rmpr_";
/**
 * ダイアグコードフォルダのプレフィックス
 * @type string
 */
Service.Repair.Tree.PREFIX_DIAG_ROOT   = "rmdr_";
/**
 * ダイアグコードリストのプレフィックス
 * @type string
 */
Service.Repair.Tree.PREFIX_DIAG_INDEX  = "rmdi_";
/**
 * DTCパラグラフフォルダのプレフィックス
 * @type string
 */
Service.Repair.Tree.PREFIX_DTC_FOLDER  = "rmdf_";
/**
 * DTDパラグラフフォルダ配下（child）のパラグラフのプレフィックス
 * @type string
 */
Service.Repair.Tree.PREFIX_CHILD_PARA  = "rmcp_";
/**
 * DTDパラグラフフォルダ配下（child）のサブパラグラフのプレフィックス
 * @type string
 */
Service.Repair.Tree.PREFIX_CHILD_SPARA = "rmcs_";
/**
 * DTCパラグラフのプレフィックス
 * @type string
 */
Service.Repair.Tree.PREFIX_DIAG_PARA   = "rmdp_";
/**
 * サービスカテゴリのプレフィックス(ボデー修理書)
 * @type string
 */
Service.Repair.Tree.PREFIX_SERVCAT_BM  = "brmsv_";
/**
 * セクションのプレフィックス(ボデー修理書)
 * @type string
 */
Service.Repair.Tree.PREFIX_SECTION_BM  = "brmsc_";
/**
 * タイトルのプレフィックス(ボデー修理書)
 * @type string
 */
Service.Repair.Tree.PREFIX_TITLE_BM    = "brmtt_";
/**
 * パラグラフのプレフィックス(ボデー修理書)
 * @type string
 */
Service.Repair.Tree.PREFIX_PARA_BM     = "brmpr_";
/**
 * ツリー表示エリアID(修理書)
 */
Service.Repair.Tree.TREE_AREA_ID_RM    = "repair_tree_root";
/**
 * ツリー表示エリアID(ボデー修理書)
 */
Service.Repair.Tree.TREE_AREA_ID_BM    = "brm_tree_root";
/**
 * toc.xmlのルートXMLの定数(修理書)
 */
Service.Repair.Tree.TOC_ROOT_CONST_RM    = "C_SERVICE_REPAIR_TREE_REPAIR_ROOT_XML";
/**
 * toc.xmlのルートXMLの定数(ボデー修理書)
 */
Service.Repair.Tree.TOC_ROOT_CONST_BM    = "C_SERVICE_BRM_TREE_BRM_ROOT_XML";
/**
 * toc.xmlのセクションXMLの定数(修理書)
 */
Service.Repair.Tree.TOC_SECTION_CONST_RM = "C_SERVICE_REPAIR_TREE_REPAIR_SECTION_XML";
/**
 * toc.xmlのセクションXMLの定数(ボデー修理書)
 */
Service.Repair.Tree.TOC_SECTION_CONST_BM = "C_SERVICE_BRM_TREE_BRM_SECTION_XML";
/**
 * ツリー作成時使用定数
 */
Service.Repair.Tree.treeConst = {
    PREFIX_SERVCAT : "",
    PREFIX_SECTION : "",
    PREFIX_TITLE   : "",
    PREFIX_PARA    : "",
    TOC_ROOT_CONST : "",
    TOC_SECT_CONST : "",
    TREE_AREA_ID   : ""
};

/**
 * ドキュメント選択時のコールバック関数
 * @private
 * @type function
 */
Service.Repair.Tree.$openDocument      = null;
/**
 * ツリーの表示位置の要素ID
 * @private
 * @type string
 */
Service.Repair.Tree.treeRoot           = "";
/**
 * パブIDの表示位置の要素ID
 * @private
 * @type string
 */
Service.Repair.Tree.treeTitle          = "";
/**
 * 適用時期
 * @private
 * @type string
 */
Service.Repair.Tree.fromDate           = "";
/**
 * 車両型式
 * @private
 * @type string
 */
Service.Repair.Tree.carType            = "";
/**
 * リンクキー
 * @private
 * @type string
 */
Service.Repair.Tree.linkKey            = "";
/**
 * ツリー構造の保持用
 * @private
 * @type Array
 */
Service.Repair.Tree.arrService         = [];
/**
 * ツリー構造の保持用(修理書)
 * @private
 * @type Array
 */
Service.Repair.Tree.arrServiceRm       = [];
/**
 * ツリー構造の保持用(ボデー修理書)
 * @private
 * @type Array
 */
Service.Repair.Tree.arrServiceBm       = [];
/**
 * パブIDの保持用(修理書)
 * @private
 * @type string
 */
Service.Repair.Tree.pubIDRm            = "";
/**
 * パブIDの保持用(ボデー修理書)
 * @private
 * @type string
 */
Service.Repair.Tree.pubIDBm            = "";
/**
 * タイトル選択画面選択済のツリー要素
 * @private
 *  @type object
 */
Service.Repair.Tree.selectedTtl        = null;

/**
 * 初期化処理
 * @param {function} openDocument ドキュメント表示のコールバック関数
 * @param {string} treeRoot ツリー作成のエレメントID
 * @param {string} treeTitle ツリータイトル作成のエレメントID
 * @param {string} fromDate 適用時期
 * @param {string} carType 車両型式
 * @param {string} linkKey リンクキー
 */
Service.Repair.Tree.$initTree = function(
    openDocument, treeRoot, treeTitle, fromDate, carType, linkKey) {
  var METHODNAME = "Service.Repair.Tree.$initTree";
  try {
    var replace = "";
    var url = "";
    Service.Repair.Tree.arrService = [];
    Service.Repair.Tree.$openDocument = openDocument;
    Service.Repair.Tree.treeRoot      = treeRoot;
    Service.Repair.Tree.treeTitle     = treeTitle;
    Service.Repair.Tree.fromDate      = fromDate;
    Service.Repair.Tree.carType       = carType;
    Service.Repair.Tree.linkKey       = linkKey;
    Service.Repair.Tree.selectedTtl   = null;

    // 選択タブにより、定数の切替えをする
    if(Service.current.id == "tab_repair") {
      // 修理書の場合
      Service.Repair.Tree.treeConst.PREFIX_SERVCAT = Service.Repair.Tree.PREFIX_SERVCAT_RM;
      Service.Repair.Tree.treeConst.PREFIX_SECTION = Service.Repair.Tree.PREFIX_SECTION_RM;
      Service.Repair.Tree.treeConst.PREFIX_TITLE   = Service.Repair.Tree.PREFIX_TITLE_RM;
      Service.Repair.Tree.treeConst.PREFIX_PARA    = Service.Repair.Tree.PREFIX_PARA_RM;
      Service.Repair.Tree.treeConst.TOC_ROOT_CONST = Service.Repair.Tree.TOC_ROOT_CONST_RM;
      Service.Repair.Tree.treeConst.TOC_SECT_CONST = Service.Repair.Tree.TOC_SECTION_CONST_RM;
      Service.Repair.Tree.treeConst.TREE_AREA_ID   = Service.Repair.Tree.TREE_AREA_ID_RM;
      Util.$propcopy(Service.Repair.Tree.arrServiceRm, Service.Repair.Tree.arrService);
    } else if(Service.current.id == "tab_brm") {
      // ボデー修理書の場合
      Service.Repair.Tree.treeConst.PREFIX_SERVCAT = Service.Repair.Tree.PREFIX_SERVCAT_BM;
      Service.Repair.Tree.treeConst.PREFIX_SECTION = Service.Repair.Tree.PREFIX_SECTION_BM;
      Service.Repair.Tree.treeConst.PREFIX_TITLE   = Service.Repair.Tree.PREFIX_TITLE_BM;
      Service.Repair.Tree.treeConst.PREFIX_PARA    = Service.Repair.Tree.PREFIX_PARA_BM;
      Service.Repair.Tree.treeConst.TOC_ROOT_CONST = Service.Repair.Tree.TOC_ROOT_CONST_BM;
      Service.Repair.Tree.treeConst.TOC_SECT_CONST = Service.Repair.Tree.TOC_SECTION_CONST_BM;
      Service.Repair.Tree.treeConst.TREE_AREA_ID   = Service.Repair.Tree.TREE_AREA_ID_BM;
      Util.$propcopy(Service.Repair.Tree.arrServiceBm, Service.Repair.Tree.arrService);
    }
    //toc.xmlを未取得取得の場合
    if(Service.Repair.Tree.arrService.length == 0) {
      url = Use.Util.$getContentsPath(
        Service.Repair.Tree.treeConst.TOC_ROOT_CONST, fromDate, carType, "");
      //車両型式を取得できている場合
      if(carType != "") {
        replace = carType + "-";
      }
      Use.Util.$request(
          url.replace("[0]", replace),
          false,
          Service.Repair.Tree.$getTOCOnSuccess,
          Service.Repair.Tree.$getTOCOnFailure,
          true,
          true);
    //toc.xmlを取得済の場合
    } else {
      Service.Repair.Tree.$makeRootTree();
      //リンクキーが取得できている場合，ツリーを展開する
      if(linkKey != "") {
        Service.Repair.Tree.$expandTree(linkKey);
      }
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * tocXML読込成功時処理
 * @param {Response} res toc.xmlのDOM情報
 */
Service.Repair.Tree.$getTOCOnSuccess = function(res) {
  var METHODNAME = "Service.Repair.Tree.$getTOCOnSuccess";
  try {
    var pubNode = Util.$getSingleNode(
        res.responseXML, Service.Repair.Tree.REPAIR_PUB);
    var serviceList = Util.$getNodes(
        res.responseXML, Service.Repair.Tree.REPAIR_SERVCAT);
    var scNode = null;
    var stList = null;
    var arrSt  = [];
    var stNode = [];
    var stName = null;
    var scName = null;
    var scLen = 0;
    var stLen = 0;
    scLen = serviceList.length;
    //サービスカテゴリ一覧の処理
    for(var scIdx = 0; scIdx < scLen; scIdx++) {
      scNode = serviceList[scIdx];
      arrSt = [];

      // セクション取得
      stList = Util.$getNodes(scNode, "./section");
      stLen = stList.length
      //セクション一覧の処理
      for(var stIdx = 0; stIdx < stLen; stIdx++) {
        stNode = stList[stIdx];
        stName = Util.$getSingleNode(stNode, "./name");
        arrSt.push({name: Util.$getNodeText(stName),
                      id: Util.$getAttrValue(stNode, "id")});
      }
      scName = Util.$getSingleNode(scNode, "./name");
      Service.Repair.Tree.arrService.push(
          {name: Util.$getNodeText(scName),
           id:   Util.$getAttrValue(scNode, "id"),
           arr:  arrSt});
    }
    // 選択タブにより、ツリー構造、パブIDの保持する
    if(Service.current.id == "tab_repair") {
      // 修理書の場合
      Util.$propcopy(Service.Repair.Tree.arrService, Service.Repair.Tree.arrServiceRm);
      Service.Repair.Tree.pubIDRm = Util.$getAttrValue(pubNode, "id");
    } else if(Service.current.id == "tab_brm") {
      // ボデー修理書の場合
      Util.$propcopy(Service.Repair.Tree.arrService, Service.Repair.Tree.arrServiceBm);
      Service.Repair.Tree.pubIDBm = Util.$getAttrValue(pubNode, "id");
    }
    Service.Repair.Tree.$makeRootTree();
    //リンクキーが取得できている場合，ツリーを展開する
    if(Service.Repair.Tree.linkKey != "") {
      Service.Repair.Tree.$expandTree(Service.Repair.Tree.linkKey);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * tocツリー作成処理
 * @private
 */
Service.Repair.Tree.$makeRootTree = function() {
  var METHODNAME = "Service.Repair.Tree.$makeRootTree";
  try {
    var treeTitle = $(Service.Repair.Tree.treeTitle);
    var treeEl = null;
    var serviceList = null;
    var arrScEl = [];
    var scNode = [];
    var scEl = null;
    var stList = null;
    var arrStEl = [];
    var stNode = [];
    var stEl = null;
    var scLen = 0;
    var stLen = 0;

    // 選択タブにより、パブIDの設定をする
    if(Service.current.id == "tab_repair") {
      // 修理書の場合
      treeTitle.innerHTML = Service.Repair.Tree.pubIDRm;
    } else if(Service.current.id == "tab_brm") {
      // ボデー修理書の場合
      treeTitle.innerHTML = Service.Repair.Tree.pubIDBm;
    }

    //修理書のTree Html のルートを取得, Tree要素を削除
    treeEl = $(Service.Repair.Tree.treeRoot);
    Service.Util.Tree.$initTree(treeEl);

    serviceList = Service.Repair.Tree.arrService;
    arrScEl = [];
    scLen = serviceList.length;
    //サービスカテゴリ一覧の処理
    for(var scIdx = 0; scIdx < scLen; scIdx++) {
      scNode = [];
      scEl = null;
      arrStEl = [];

      scNode = serviceList[scIdx];
      scEl = Service.Util.Tree.$makeChild(
          {name: scNode.name,
           id:   Service.Repair.Tree.treeConst.PREFIX_SERVCAT + scNode.id});

      // セクション取得
      stList = scNode.arr;
      //セクション一覧の処理
      stLen = stList.length;
      for(var stIdx = 0; stIdx < stLen; stIdx++) {
        stNode = stList[stIdx];
        stEl = Service.Util.Tree.$makeChild(
            {name: stNode.name,
             id:   Service.Repair.Tree.treeConst.PREFIX_SECTION + stNode.id},
             (function(scId) {
               return function(evt) {
                 Service.Repair.Tree.$readTOCfile(evt, scId);
               }
             })(scNode.id));

        arrStEl.push(stEl);
      }

      Service.Util.Tree.$addChilds(scEl, arrStEl);
      arrScEl.push(scEl);
    }

    Service.Util.Tree.$addChilds(treeEl, arrScEl, true);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * Ajaxのリクエスト処理
 * @param {Element} section sectionタグのエレメント情報
 */
Service.Repair.Tree.$readTOCfile = function(section, scId) {
  var METHODNAME = "Service.Repair.Tree.$readTOCfile";
  try {
    var carType = "";
    var url = null;
    var stId = "";

    //車両型式が存在する場合,XMLを取得する為のパスに車両型式を埋め込む
    if(Service.Repair.Tree.carType != "") {
      carType = Service.Repair.Tree.carType + "-";
    }
    url = Use.Util.$getContentsPath(
      Service.Repair.Tree.treeConst.TOC_SECT_CONST,
      Service.Repair.Tree.fromDate,
      Service.Repair.Tree.carType, "");
    
    // 選択タブにより、substring位置を変更する
    if(Service.current.id == "tab_repair") {
      // 修理書の場合
      stId = section.id.substring(5);
    } else if(Service.current.id == "tab_brm") {
      // ボデー修理書の場合
      stId = section.id.substring(6);
    }
    if(stId.indexOf("_") == 0) {
      stId = stId.substring(1);
    }

    url = url.replace("[0]", carType);
    url = url.replace("[1]", stId);

    //XML読み込み
    Use.Util.$request(
        url,
        false,
        (function(scId) {
          return function(res) {
            Service.Repair.Tree.$getTOCSectionOnSuccess(res, scId);
          }
        })(scId),
        Service.Repair.Tree.$getTOCOnFailure,
        true,
        true);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * セクションXML読込成功時処理
 * @param {Response} res セクションXMLのDOM情報
 */
Service.Repair.Tree.$getTOCSectionOnSuccess = function(res, scId) {
  var METHODNAME = "Service.Repair.Tree.$getTOCSectionOnSuccess";
  try {
    Service.Repair.Tree.$makeSectionTree(res.responseXML, scId);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * sectionツリー作成処理
 * @private
 * @param {object} scXmlDoc セクションXMLのDOM情報
 */
Service.Repair.Tree.$makeSectionTree = function(scXmlDoc, scId) {
  var METHODNAME = "Service.Repair.Tree.$makeSectionTree";
  try {
    //セクションXMLからセクション要素を取得
    var stNode = Util.$getSingleNode(scXmlDoc, "//section");
    var linkKey = {
        scId: scId,
        stId: Util.$getAttrValue(stNode, "id"),
        tlId: "",
        prId: "",
        dtc:  ""};
    //タイトル(ttl:tl)取得
    var tlList = Util.$getNodes(stNode, "./ttl");
    var arrTlEl = [];
    var tlNode = null;
    var tlName = null;
    var tlId = null;
    var tlEl = null;
    var pType = null;
    var partsId = null;
    var prList = null;
    var arrPrEl = [];
    var prNode = null;
    var ctType = null;
    var prName = null;
    var prNameText = null;
    var prEl = null;
    var prId = null;
    var stEl = null;
    var splitedKey = null;
    var tlLen = 0;
    var prLen = 0;
    tlLen = tlList.length;
    //タイトル一覧の処理
    for(var tlIdx = 0; tlIdx < tlLen; tlIdx++) {
      tlNode = tlList[tlIdx];

      tlName = Util.$getSingleNode(tlNode, "./name");
      tlId = Util.$getAttrValue(tlNode, "id");
      pType = Util.$getAttrValue(tlNode, "p-type");
      // p-type属性="1"(品名コード)の場合、部品コードを取得する
      if(pType == DictConst.C_PRODUCT_NAME_CD) {
        partsId = Util.$getAttrValue(tlNode, "parts-id");
      } else {
        partsId = "";
      }

      tlEl = Service.Util.Tree.$makeChild(
        {name:    Util.$getNodeText(tlName),
         id:      Service.Repair.Tree.treeConst.PREFIX_TITLE + tlId,
         partsId: partsId});
      linkKey.tlId = tlId;
      linkKey.dtc = "";
      
      //パラグラフ取得
      prList = Util.$getNodes(tlNode, "./para");
      arrPrEl = [];
      prLen = prList.length;
      //パラグラフ一覧の処理
      for(var prIdx = 0; prIdx < prLen; prIdx++) {
        prNode = prList[prIdx];
        ctType = Util.$getAttrValue(prNode, "category");
        prName = Util.$getSingleNode(prNode, "./name");

        prEl = null;
        //パラグラフのカテゴリが"S"の場合の処理
        if(ctType == "S") {
          prEl = Service.Util.Tree.$makeChild(
            {name: Util.$getNodeText(prName),
             id:   Service.Repair.Tree.PREFIX_DIAG_ROOT
                     + Util.$getAttrValue(tlNode, "id")},
                null,
                (function(ctType) {
                  return function(evt) {
                    Service.Repair.Tree.$doClickTreePara(evt, ctType, "", "", true);
                  }
                })(ctType));

          //パラグラフのカテゴリ"S"配下の処理
          Service.Repair.Tree.$makeDTCTree(prList, prEl, prNode, linkKey);
        //パラグラフのカテゴリが"S"の下のパラグラフで,カテゴリが"C"で無い場合
        } else if(ctType != "C") {

          prId = Util.$getAttrValue(prNode, "id");
          prNameText = Util.$getNodeText(prName);
          linkKey.prId = prId;
          linkKey.dtc = "";
          prEl = Service.Util.Tree.$makeChild(
            {name:    prNameText,
             id:      Service.Repair.Tree.treeConst.PREFIX_PARA + prId,
             term:    true,
             linkKey: Service.Repair.Tree.$getLinkKey(linkKey),
             category:ctType});

          Use.Util.$observe(prEl, "click",
              (function(ctType, name) {
                return function(evt) {
                  Service.Repair.Tree.$doClickTreePara(evt, ctType, name);
                }
              })(ctType, prNameText));
        }
        //パラグラフが有る場合
        if(prEl != null) {
          arrPrEl.push(prEl);
        }
      }

      Service.Util.Tree.$addChilds(tlEl, arrPrEl);
      arrTlEl.push(tlEl);
    }

    //section id取得
    stId = Util.$getAttrValue(stNode, "id");

    //sectionの<li>取得
    stEl = Service.Util.Tree.$getOwner(
        Service.Repair.Tree.treeRoot,
        Service.Repair.Tree.treeConst.PREFIX_SECTION + stId);

    Service.Util.Tree.$addChilds(stEl, arrTlEl, true);
    //リンクキーが取得できている場合ツリーを展開する
    if(Service.Repair.Tree.linkKey != "") {
      splitedKey = Service.Repair.Tree.linkKey.split(",");
      //ツリーを展開する
      if(splitedKey[1] == stId) {
        Service.Repair.Tree.$expandTree(Service.Repair.Tree.linkKey);
      }
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * DTC要素配下の処理
 * @private
 * @param {Array} prList パラグラフリスト
 * @param {string} scEl サービスカテゴリエレメント
 * @param {string} scNode サービスカテゴリノード
 * @param {string} linkKey リンクキー
 */
Service.Repair.Tree.$makeDTCTree = 
  function(prList, scEl, scNode, linkKey) {
  var METHODNAME = "Service.Repair.Tree.$makeDTCTree";
  try {
    var arrScEl = [];
    var prId = null;
    var prName = null;
    var prNameText = null;
    var prEl = null;
    var prNode = null;
    var ctType = null;
    var dtcList = null;
    var dtcNode = null;
    var spList = null;
    var dtcName = null;
    var dtcNameText = null;
    var dtcNameConverted = null;
    var dtcEl = null;
    var arrSpEl = [];
    var spEl = null;
    var spNode = null;
    var spName = null;
    var spNameText = null;
    var spId = null;
    var dtcAllName = null;
    var prLen = 0;
    var dtcLen = 0;
    var spLen = 0;

    prId = Util.$getAttrValue(scNode, "id");
    prName = Util.$getSingleNode(scNode, "./name");
    prNameText = Util.$getNodeText(prName);

    linkKey.prId = prId;
    prEl = Service.Util.Tree.$makeChild(
        {name:    prNameText,
           id:    Service.Repair.Tree.PREFIX_DIAG_INDEX + prId,
         term:    true,
         linkKey: Service.Repair.Tree.$getLinkKey(linkKey),
         category:"S"});

    //コンテンツ表示イベント登録
    Use.Util.$observe(prEl, "click",
        (function(ctType, name) {
          return function(evt) {
            Service.Repair.Tree.$doClickTreePara(evt, ctType, name);
          }
        })("S", prNameText));
    arrScEl.push(prEl);
    prLen = prList.length
    //パラグラフ一覧の処理
    for(var prIdx = 0; prIdx < prLen; prIdx++) {
      prNode = prList[prIdx];
      prId = Util.$getAttrValue(prNode, "id");
      ctType = Util.$getAttrValue(prNode, "category");
      //パラグラフのカテゴリが"S"の下のパラグラフで,カテゴリが"C"の場合
      if(ctType == "C") {
        //(para:dtccode)取得
        dtcList = Util.$getNodes(prNode, "./dtccode");

        //DTC名を作成する
        dtcAllName = "";
        dtcLen = dtcList.length;
        //DTCコード一覧のnameを取得する
        for(var dtcIdx = 0; dtcIdx < dtcLen; dtcIdx++) {
          dtcName = Util.$getSingleNode(dtcList[dtcIdx], "./name");
          //DTCコード一覧のnameを取得できた場合
          if(dtcAllName != "") {
            dtcAllName = dtcAllName + ",";
          }
          dtcAllName = dtcAllName + Util.$getNodeText(dtcName);
        }
        dtcLen = dtcList.length;
        //カテゴリ"C"配下の処理
        for(var dtcIdx = 0; dtcIdx < dtcLen; dtcIdx++) {
          dtcNode = dtcList[dtcIdx];

          spList = Util.$getNodes(dtcNode, "./subpara");
          //サブパラグラフ一覧の処理
          if(spList.length > 0) {
            //フォルダ作成部
            dtcName = Util.$getSingleNode(dtcNode, "./name");
            dtcNameText = Util.$getNodeText(dtcName);
            dtcNameConverted = dtcNameText.replace("/", "-");
            spId = Service.Repair.Tree.PREFIX_CHILD_PARA
                + prId + "_" + dtcNameConverted;
            dtcEl = Service.Util.Tree.$makeChild(
                {name: dtcNameText,
                 id:   Service.Repair.Tree.PREFIX_DTC_FOLDER
                         + prId + "_" + dtcNameConverted},
                   null,
                   (function(ctType, spId) {
                     return function(evt) {
                       Service.Repair.Tree.$doClickTreePara(evt, ctType, "", spId, true);
                     }
                   })(ctType, spId));

            //ファイル作成部
            arrSpEl = [];
            linkKey.dtc  = dtcNameText;
            linkKey.prId = prId;
            spEl = Service.Util.Tree.$makeChild(
               {name:    Util.$getNodeText(dtcName),
                id:      spId,
                term:    true,
                linkKey: Service.Repair.Tree.$getLinkKey(linkKey),
                category:ctType});

            //コンテンツ表示イベント登録
            Use.Util.$observe(spEl, "click",
                (function(ctType, name) {
                  return function(evt) {
                    Service.Repair.Tree.$doClickTreePara(evt, ctType, name);
                  }
                })(ctType, dtcAllName));
            spLen = spList.length;
            arrSpEl.push(spEl);
            //サブパラグラフ一覧の処理
            for(var spIdx = 0; spIdx < spLen; spIdx++) {
              spNode = spList[spIdx];
              spName = Util.$getSingleNode(spNode, "./name");
              spNameText = Util.$getNodeText(spName);
              spId = Util.$getAttrValue(spNode, "id");
              spEl = Service.Util.Tree.$makeChild(
                  {name:    spNameText,
                   id:      Service.Repair.Tree.PREFIX_CHILD_SPARA
                              + spId + "_" + dtcNameConverted,
                   term:    true,
                   linkKey: Service.Repair.Tree.$getLinkKey(linkKey)});

              //コンテンツ表示イベント登録
              Use.Util.$observe(spEl, "click",
                  (function(ctType, sId, name) {
                    return function(evt) {
                      Service.Repair.Tree.$doClickTreePara(evt, ctType, name, sId);
                    }
                  })(ctType, spId, spNameText));
              arrSpEl.push(spEl);
            }
            Service.Util.Tree.$addChilds(dtcEl, arrSpEl);
            arrScEl.push(dtcEl);
          //DTCパラグラフの処理
          } else {
            dtcName = Util.$getSingleNode(dtcNode, "./name");
            dtcNameText = Util.$getNodeText(dtcName);
            dtcNameConverted = dtcNameText.replace("/", "-");
            dtcEl = Service.Util.Tree.$makeChild(
                {name:    dtcNameText,
                   id:    Service.Repair.Tree.PREFIX_DIAG_PARA + prId
                            + "_" + dtcNameConverted,
                 term:    true,
                 linkKey: Service.Repair.Tree.$getLinkKey(linkKey),
                 category:ctType});

            //コンテンツ表示イベント登録
            Use.Util.$observe(dtcEl, "click",
                (function(ctType, name) {
                  return function(evt) {
                    Service.Repair.Tree.$doClickTreePara(evt, ctType, name);
                  }
                })(ctType, dtcAllName));
            arrScEl.push(dtcEl);
          }
        }
      }
    }
    Service.Util.Tree.$addChilds(scEl, arrScEl);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * リンクキー作成処理
 * @private
 * @param {object} linkKey リンクキー
 * @return {string} linkKey リンクキー
 */
Service.Repair.Tree.$getLinkKey = function(linkKey) {
  var METHODNAME = "Service.Repair.Tree.$getLinkKey";
  try {
    return linkKey.scId + "," + linkKey.stId + "," 
            + linkKey.tlId + "," + linkKey.prId + "," + linkKey.dtc;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * XML読込処理の失敗時処理
 * @param {Response} res toc.xml,セクションXMLのDOM情報
 */
Service.Repair.Tree.$getTOCOnFailure = function(res) {
  var METHODNAME = "Service.Repair.Tree.$getTOCOnFailure";
  try {
    Use.SystemError.$show(null, METHODNAME, "MVWF0123DAE");
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリーを閉じる処理
 * @private
 */
Service.Repair.Tree.$closeTree = function() {
  var METHODNAME = "Service.Repair.Tree.$closeTree";
  try {
    Service.Util.Tree.$closeTree();
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリーの初期化をした後のツリー操作処理
 * @param {string} linkKey リンクキー
 * @param {boolean} selectTtl 呼出元画面の判別
 */
Service.Repair.Tree.$expandTree = function(linkKey, selectTtl) {
  var METHODNAME = "Service.Repair.Tree.$expandTree";
  try {
    //リンクキーを取得できた場合
    var treeEl = $(Service.Repair.Tree.treeRoot);
    var splitedKey = linkKey.split(",");
    var retId = "";
    var dtc = splitedKey[4] ? splitedKey[4].replace("/", "-") : "";
    var elmTreeArea = $(Service.Repair.Tree.treeConst.TREE_AREA_ID);

    //タイトル選択画面以外からのリンク
    //DTCが存在する場合
    if(splitedKey.length > 3 && dtc) {
      retId = Service.Util.Tree.$expandTree(
          treeEl,
          Service.Repair.Tree.treeConst.PREFIX_SERVCAT + splitedKey[0],
          Service.Repair.Tree.treeConst.PREFIX_SECTION + splitedKey[1],
          Service.Repair.Tree.treeConst.PREFIX_TITLE + splitedKey[2],
          Service.Repair.Tree.PREFIX_DIAG_ROOT + splitedKey[2],
          Service.Repair.Tree.PREFIX_DTC_FOLDER + splitedKey[3]
            + "_" + dtc,
          Service.Repair.Tree.PREFIX_CHILD_PARA + splitedKey[3]
            + "_" + dtc
        );
    //DTCが存在しない場合
    } else {
      //SectionXmlを予め取得する
      Service.Util.Tree.$expandTree(
          treeEl,
          Service.Repair.Tree.treeConst.PREFIX_SERVCAT + splitedKey[0],
          Service.Repair.Tree.treeConst.PREFIX_SECTION + splitedKey[1],
          Service.Repair.Tree.treeConst.PREFIX_TITLE + splitedKey[2],
          null
        );

      //パラグラフのカテゴリが S, C 以外のドキュメントが選択選択される場合
      if($(Service.Repair.Tree.treeConst.PREFIX_PARA + splitedKey[3])) {
        retId = Service.Util.Tree.$expandTree(
            treeEl,
            Service.Repair.Tree.treeConst.PREFIX_SERVCAT + splitedKey[0],
            Service.Repair.Tree.treeConst.PREFIX_SECTION + splitedKey[1],
            Service.Repair.Tree.treeConst.PREFIX_TITLE + splitedKey[2],
            Service.Repair.Tree.treeConst.PREFIX_PARA + splitedKey[3]
          );
      //パラグラフのカテゴリが S 直下のドキュメントが選択される場合
      } else if($(Service.Repair.Tree.PREFIX_DIAG_INDEX + splitedKey[3])) {
        retId = Service.Util.Tree.$expandTree(
            treeEl,
            Service.Repair.Tree.treeConst.PREFIX_SERVCAT + splitedKey[0],
            Service.Repair.Tree.treeConst.PREFIX_SECTION + splitedKey[1],
            Service.Repair.Tree.treeConst.PREFIX_TITLE + splitedKey[2],
            Service.Repair.Tree.PREFIX_DIAG_ROOT + splitedKey[2],
            Service.Repair.Tree.PREFIX_DIAG_INDEX + splitedKey[3]
          );
      }
    }
    //タイトル選択画面からのリンクの場合
    if(selectTtl == true) {
      //ツリー表示エリアが非表示の場合、表示する
      if(Element.$hasClassName($("repair_tree_root"), "tree_view_area_none")) {
        $("repair_tree_frame").className = "tree_view_area_190px";
        $("repair_tree_root").className  = "tree_view_area_190px";
        $("repair_body_frame").className = "paragraph_view_area";
        $("repair_body_root").className  = "paragraph_view_area";
        Element.$addClassName($("repair_resize_back"), "invisible");
        Element.$removeClassName($("repair_resize_enlarge"), "invisible");
      }
      //タイトルフォルダの背景に色を付ける
      var ttlEl = $(Service.Repair.Tree.treeConst.PREFIX_TITLE + splitedKey[2]);
      //該当タイトルが存在する場合
      if(ttlEl) {
        //前回選択されたドキュメントが有る場合，背景色を削除する
        if(Service.Repair.Tree.selectedTtl) {
          Service.Util.Tree.$unselectTreeNode(Service.Repair.Tree.selectedTtl);
        }
        Service.Util.Tree.$selectTreeNode(elmTreeArea, ttlEl);
        Service.Repair.Tree.selectedTtl = ttlEl;
      //該当タイトルが存在しない場合はシステムエラー
      } else {
        Use.SystemError.$show(null, METHODNAME);
      }
    //タイトル選択画面以外からのリンクの場合
    } else {
      //リンクキーが取得できた場合
      if(Service.Repair.Tree.linkKey != "") {
        Service.Util.Tree.$unselectTreeNode(
            Service.Repair.Tree.$getLinkkeyElement(
                Service.Repair.Tree.linkKey.split(",")));
      }
      Service.Repair.Tree.linkKey = linkKey;
      Service.Util.Tree.$selectTreeNode(elmTreeArea, 
          Service.Repair.Tree.$getLinkkeyElement(splitedKey));
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー展開の為のリンクキー取得
 * @private
 * @param {Array} splitedKey 分解されたリンクキー配列
 * @return {Element} エレメント情報 
 */
Service.Repair.Tree.$getLinkkeyElement = function(splitedKey) {
  var METHODNAME = "Service.Repair.Tree.$getLinkkeyElement";
  try {
    var linkkeyElement = null;
    var dtc = splitedKey[4] ? splitedKey[4].replace("/", "-") : "";

    //DTCが存在する場合
    if(dtc) {
      linkkeyElement = $(Service.Repair.Tree.PREFIX_DIAG_PARA + 
          splitedKey[3] + "_" + dtc);
      //パラグラフのcategoryがCの場合のドキュメントの場合
      if(linkkeyElement == null) {
        linkkeyElement = $(Service.Repair.Tree.PREFIX_CHILD_PARA +
            splitedKey[3] + "_" + dtc);
      }
    //DTCが存在しない場合
    } else {
      linkkeyElement = $(Service.Repair.Tree.treeConst.PREFIX_PARA + splitedKey[3]);
      //パラグラフのIDで要素が取得出来ない場合
      if(linkkeyElement == null) {
        linkkeyElement = $(Service.Repair.Tree.PREFIX_DIAG_INDEX + splitedKey[3]);
      }
    }
    return linkkeyElement;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー選択時の背景色の変更処理
 * @private
 * @param {Element} element クリックイベントの起きたエレメント
 */
Service.Repair.Tree.$setSelectStatus = function(element) {
  var METHODNAME = "Service.Repair.Tree.$setSelectStatus";
  try {
    var splitedKey = [];
    var elmTreeArea = $(Service.Repair.Tree.treeConst.TREE_AREA_ID);
    //リンクキーが取得できた場合
    if(Service.Repair.Tree.linkKey != "") {
      splitedKey = Service.Repair.Tree.linkKey.split(",");
      Service.Util.Tree.$unselectTreeNode(
          Service.Repair.Tree.$getLinkkeyElement(splitedKey));
    }
    Service.Util.Tree.$selectTreeNode(elmTreeArea, element);
    Service.Repair.Tree.linkKey = Service.Util.Tree.$getLinkKey(element);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー選択時の背景色の削除処理
 */
Service.Repair.Tree.$unselectTreeNode = function() {
  var METHODNAME = "Service.Repair.Tree.$unselectTreeNode";
  try {
    //タイトル選択画面からの背景色を削除する
    if(Service.Repair.Tree.selectedTtl) {
      Service.Util.Tree.$unselectTreeNode(Service.Repair.Tree.selectedTtl);
    }
    //クリックイベントからの背景色を削除する
    Service.Util.Tree.$unselectTreeNode(
        Service.Repair.Tree.$getLinkkeyElement(
            Service.Repair.Tree.linkKey.split(",")));
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * パラグラフカテゴリを取得する（ツリー構築後に実行すること）
 * @param {string} linkKey リンクキー
 * @return {string} カテゴリタイプ（取得できない場合は空文字を返す）
 */
Service.Repair.Tree.$getCategoryType = function(linkKey) {
  var METHODNAME = "Service.Repair.Tree.$getCategoryType";
  try {
    //リンクキーを取得できた場合
    var splitedKey = linkKey.split(",");
    var result = "";
    var dtc = splitedKey[4] ? splitedKey[4].replace("/", "-") : "";

    //DTCが存在する場合
    if(splitedKey.length > 3 && dtc) {
      result = Service.Util.Tree.$getCategory(
          $(Service.Repair.Tree.PREFIX_CHILD_PARA + splitedKey[3]
          + "_" + dtc));

    //DTCが存在しない場合
    } else {
      //パラグラフのカテゴリが S, C 以外のドキュメントが選択される場合
      if($(Service.Repair.Tree.treeConst.PREFIX_PARA + splitedKey[3])) {
        result = Service.Util.Tree.$getCategory(
            $(Service.Repair.Tree.treeConst.PREFIX_PARA + splitedKey[3]));

      //パラグラフのカテゴリが S 直下のドキュメントが選択される場合
      } else if($(Service.Repair.Tree.PREFIX_DIAG_INDEX + splitedKey[3])) {
        result = Service.Util.Tree.$getCategory(
            $(Service.Repair.Tree.PREFIX_DIAG_INDEX + splitedKey[3]));
      }
    }

    return result;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * パラグラフ選択処理
 * @param {Event} evt イベント
 * @param {string} category カテゴリ
 * @param {string} name パラグラフ名称
 * @param {string} spId サブパラグラフID
 * @param {boolean} isDirectory DTCディレクトリ（デフォルト:false）
 */
Service.Repair.Tree.$doClickTreePara = function(
    evt, category, name, spId, isDirectory) {
  var METHODNAME = "Service.Repair.Tree.$doClickTreePara";
  try {
    var elm = null;
    //ディレクトリの場合はカテゴリを設定
    if(isDirectory) {
      if(category == 'C') {
        elm = $(spId);
        Service.Repair.Tree.$setSelectStatus(elm);
        Service.Repair.Tree.$openDocument(
                Service.Util.Tree.$getLinkKey(elm), category, "", "");
      }
    //ディレクトリでない場合はパラグラフを開く
    } else {
      elm = Event.$element(evt);
      //サブパラグラフでない場合は選択情報を登録
      if(!spId) {
        spId = "";
        Service.Repair.Tree.$setSelectStatus(elm);
      }
      Service.Repair.Tree.$openDocument(
          Service.Util.Tree.$getLinkKey(elm), category, spId, name);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

//-----------------------------------------------------------------------------
/**
 * 解説書ツリー
 * @namespace 解説書ツリークラス
 */
Service.NCF.Tree = {};
/**
 * servcat要素へのxpath
 * @type string
 */
Service.NCF.Tree.NCF_SERVCAT        = "//servcat";
/**
 * pub要素へのxpath
 * @type string
 */
Service.NCF.Tree.NCF_PUB            = "//pub";
/**
 * サービスカテゴリのプレフィックス
 * @type string
 */
Service.NCF.Tree.PREFIX_SERVCAT     = "ncfsv_";
/**
 * セクションのプレフィックス
 * @type string
 */
Service.NCF.Tree.PREFIX_SECTION     = "ncfsc_";
/**
 * タイトルのプレフィックス
 * @type string
 */
Service.NCF.Tree.PREFIX_TITLE       = "ncftt_";
/**
 * パラグラフのプレフィックス
 * @type string
 */
Service.NCF.Tree.PREFIX_PARA        = "ncfpr_";
/**
 * サブタイトルフォルダのプレフィックス
 * @type string
 */
Service.NCF.Tree.PREFIX_SUB_FOLDER  = "ncfsf_";
/**
 * サブタイトルフォルダ配下のパラグラフのプレフィックス
 * @type string
 */
Service.NCF.Tree.PREFIX_SUB_PARA    = "ncfsp_";

/**
 * ドキュメント選択時のコールバック関数
 * @private
 * @type function
 */
Service.NCF.Tree.$openDocument      = null;
/**
 * ツリーの表示位置の要素ID
 * @private
 * @type string
 */
Service.NCF.Tree.treeRoot           = "";
/**
 * パブIDの表示位置の要素ID
 * @private
 * @type string
 */
Service.NCF.Tree.treeTitle          = "";
/**
 * 適用時期
 * @private
 * @type string
 */
Service.NCF.Tree.fromDate           = "";
/**
 * 車両型式
 * @private
 * @type string
 */
Service.NCF.Tree.carType            = "";
/**
 * リンクキー
 * @private
 * @type string
 */
Service.NCF.Tree.linkKey            = "";
/**
 * ツリー構造の保持用
 * @private
 * @type Array
 */
Service.NCF.Tree.arrService         = [];
/**
 * パブIDの保持用
 * @private
 * @type string
 */
Service.NCF.Tree.pubID              = "";
/**
 * タイトル選択画面選択済のツリー要素
 * @private
 * @type object
 */
Service.NCF.Tree.selectedTtl        = null;

/**
 * 初期化処理
 * @param {function} openDocument ドキュメント表示のコールバック関数
 * @param {string} treeRoot ツリー作成のエレメントID
 * @param {string} treeTitle ツリータイトル作成のエレメントID
 * @param {string} fromDate 適用時期
 * @param {string} carType 車両型式
 * @param {string} linkKey リンクキー
 */
Service.NCF.Tree.$initTree = function(
    openDocument, treeRoot, treeTitle, fromDate, carType, linkKey) {
  var METHODNAME = "Service.NCF.Tree.$initTree";
  try {
    var replace = "";
    var url = "";
    Service.NCF.Tree.$openDocument = openDocument;
    Service.NCF.Tree.treeRoot      = treeRoot;
    Service.NCF.Tree.treeTitle     = treeTitle;
    Service.NCF.Tree.fromDate      = fromDate;
    Service.NCF.Tree.carType       = carType;
    Service.NCF.Tree.linkKey       = linkKey;
    Service.NCF.Tree.selectedTtl   = null;

    //toc.xmlを未取得取得の場合
    if(Service.NCF.Tree.arrService.length == 0) {
      url = Use.Util.$getContentsPath(
        "C_SERVICE_NCF_TREE_NCF_ROOT_XML", fromDate, carType, "");
      
      //車両型式を取得できている場合
      if(carType != "") {
        replace = carType + "-";
      }
      Use.Util.$request(
          url.replace("[0]", replace),
          false,
          Service.NCF.Tree.$getTOCOnSuccess,
          Service.NCF.Tree.$getTOCOnFailure,
          true,
          true);
    //toc.xmlを取得済の場合
    } else {
      Service.NCF.Tree.$makeRootTree();
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * tocXML読込成功時処理
 * @param {Response} res toc.xmlのDOM情報
 */
Service.NCF.Tree.$getTOCOnSuccess = function(res) {
  var METHODNAME = "Service.NCF.Tree.$getTOCOnSuccess";
  try {
    var pubNode = Util.$getSingleNode(
        res.responseXML, Service.NCF.Tree.NCF_PUB);
    var serviceList = Util.$getNodes(
        res.responseXML, Service.NCF.Tree.NCF_SERVCAT);
    var scNode = null;
    var stList = null;
    var arrSt  = [];
    var stNode = [];
    var stName = null;
    var scName = null;
    var scLen = 0;
    var stLen = 0;
    Service.NCF.Tree.pubID = Util.$getAttrValue(pubNode, "id");
    scLen = serviceList.length;
    //サービスカテゴリ一覧の処理
    for(var scIdx = 0; scIdx < scLen; scIdx++) {
      scNode = serviceList[scIdx];
      arrSt = [];

      //セクション取得
      stList = Util.$getNodes(scNode, "./section");
      stLen = stList.length;
      //セクション一覧の処理
      for(var stIdx = 0; stIdx < stLen; stIdx++) {
        stNode = stList[stIdx];
        stName = Util.$getSingleNode(stNode, "./name");
        arrSt.push({name: Util.$getNodeText(stName),
                      id: Util.$getAttrValue(stNode, "id")});
      }
      scName = Util.$getSingleNode(scNode, "./name");
      Service.NCF.Tree.arrService.push(
          {name: Util.$getNodeText(scName),
           id:   Util.$getAttrValue(scNode, "id"),
           arr:  arrSt});
    }
    Service.NCF.Tree.$makeRootTree();
    //リンクキーが取得できている場合ツリーを展開する
    if(Service.NCF.Tree.linkKey != "") {
      Service.NCF.Tree.$expandTree(Service.NCF.Tree.linkKey);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * tocツリー作成処理
 * @private
 */
Service.NCF.Tree.$makeRootTree = function() {
  var METHODNAME = "Service.NCF.Tree.$makeRootTree";
  try {
    var treeTitle = $(Service.NCF.Tree.treeTitle);
    var serviceList = null;
    var arrScEl = [];
    var scNode = [];
    var scEl = null;
    var stList = null;
    var arrStEl = [];
    var stNode = [];
    var stEl = null;
    var scLen = 0;
    var stLen = 0;
    treeTitle.innerHTML = Service.NCF.Tree.pubID;

    //修理書のTree Html のルートを取得, Tree要素を削除
    treeEl = $(Service.NCF.Tree.treeRoot);
    Service.Util.Tree.$initTree(treeEl);

    serviceList = Service.NCF.Tree.arrService;
    arrScEl = [];
    scLen = serviceList.length;
    //サービスカテゴリ一覧の処理
    for(var scIdx = 0; scIdx < scLen; scIdx++) {
      scNode = [];
      scEl = null;
      arrStEl = [];

      scNode = serviceList[scIdx];
      scEl = Service.Util.Tree.$makeChild(
          {name: scNode.name,
           id:   Service.NCF.Tree.PREFIX_SERVCAT + scNode.id});

      //セクション取得
      stList = scNode.arr;
      arrStEl = [];
      stLen = stList.length;
      //セクション一覧の処理
      for(var stIdx = 0; stIdx < stLen; stIdx++) {
        stNode = stList[stIdx];
        stEl = Service.Util.Tree.$makeChild(
            {name: stNode.name,
             id:   Service.NCF.Tree.PREFIX_SECTION + stNode.id},
             (function(scId) {
               return function(evt) {
                 Service.NCF.Tree.$readTOCfile(evt, scId);
               }
             })(scNode.id));

        arrStEl.push(stEl);
      }
      Service.Util.Tree.$addChilds(scEl, arrStEl);
      arrScEl.push(scEl);
    }
    Service.Util.Tree.$addChilds(treeEl, arrScEl, true);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * Ajaxのリクエスト処理
 * @param {Element} section sectionタグのエレメント情報
 */
Service.NCF.Tree.$readTOCfile = function(section, scId) {
  var METHODNAME = "Service.NCF.Tree.$readTOCfile";
  try {
    var carType = "";
    var url = null;
    var stId = "";

    //車両型式が存在する場合,XMLを取得する為のパスに車両型式を埋め込む
    if(Service.NCF.Tree.carType != "") {
      carType = Service.NCF.Tree.carType + "-";
    }
    url = Use.Util.$getContentsPath(
      "C_SERVICE_NCF_TREE_NCF_SECTION_XML",
      Service.NCF.Tree.fromDate,
      Service.NCF.Tree.carType, "");

    stId = section.id.substring(6);
    if(stId.indexOf("_") == 0) {
      stId = stId.substring(1);
    }

    url = url.replace("[0]", carType);
    url = url.replace("[1]", stId);

    //XML読み込み
    Use.Util.$request(
        url,
        false,
        (function(scId) {
          return function(res) {
            Service.NCF.Tree.$getTOCSectionOnSuccess(res, scId);
          }
        })(scId),
        Service.NCF.Tree.$getTOCOnFailure,
        true,
        true);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * セクションXML読込成功時処理
 * @param {Response} res セクションXMLのDOM情報
 */
Service.NCF.Tree.$getTOCSectionOnSuccess = function(res, scId) {
  var METHODNAME = "Service.NCF.Tree.$getTOCSectionOnSuccess";
  try {
    Service.NCF.Tree.$makeSectionTree(res.responseXML, scId);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * sectionツリー作成処理
 * @private
 * @param {object} scXmlDoc セクションXMLのDOM情報
 */
Service.NCF.Tree.$makeSectionTree = function(scXmlDoc, scId) {
  var METHODNAME = "Service.NCF.Tree.$makeSectionTree";
  try {
    //セクションXMLからセクション要素を取得
    var stNode = Util.$getSingleNode(scXmlDoc, "//section");
    var linkKey = {
        scId: scId,
        stId: Util.$getAttrValue(stNode, "id"),
        tlId: "",
        cat:  "",
        prId: ""};
    //タイトル取得
    var tlList = Util.$getNodes(stNode, "./ttl");
    var arrTlEl = [];
    var tlNode = null;
    var tlName = null;
    var tlId = null;
    var tlEl = null;
    var prList = null;
    var arrPrEl = [];
    var prNode = null;
    var prName = null;
    var prNameText = null;
    var prEl = null;
    var prId = null;
    var stEl = null;
    var splitedKey = null;
    var arrCt = null;
    var ncfNode = null;
    var ncfCt = null;
    var ctEl = null;
    var ctName = null;
    var arrNcf = null;
    var tlLen = 0;
    var prLen = 0;
    var ctLen = 0;
    tlLen = tlList.length;
    //タイトル一覧の処理
    for(var tlIdx = 0; tlIdx < tlLen; tlIdx++) {
      tlNode = tlList[tlIdx];
      tlName = Util.$getSingleNode(tlNode, "./name");
      tlId = Util.$getAttrValue(tlNode, "id");

      tlEl = Service.Util.Tree.$makeChild(
        {name: Util.$getNodeText(tlName),
         id:   Service.NCF.Tree.PREFIX_TITLE + tlId});
      linkKey.tlId = tlId;

      //パラグラフ一覧の取得
      prList = Util.$getNodes(tlNode, "./para");
      arrPrEl = [];
      arrCt = [];
      prLen = prList.length;
      //パラグラフ一覧の処理
      for(var prIdx = 0; prIdx < prLen; prIdx++) {
        prNode = prList[prIdx];
        prName = Util.$getSingleNode(prNode, "./name");
        prId = Util.$getAttrValue(prNode, "id");
        ncfNode = Util.$getSingleNode(prNode, "./ncf-para");
        //サブタイトルフォルダ配下のパラグラフが有る場合
        if(ncfNode != null) {
          ctEl = null;
          ncfCt = Util.$getAttrValue(ncfNode, "ncf-para-category");
          ctLen = arrCt.length;
          //サブタイトルフォルダの検索
          for(var ctIdx = 0; ctIdx < ctLen; ctIdx++) {
            //参照したカテゴリを保存する
            if(arrCt[ctIdx].ct == ncfCt) {
              ctEl = arrCt[ctIdx].el;
              break;
            }
          }
          //サブタイトルフォルダが未作成の場合
          if(ctEl == null) {
            //サブタイトルフォルダの作成
            ctName = Util.$getSingleNode(ncfNode, "./name");
            ctEl = Service.Util.Tree.$makeChild(
                {name: Util.$getNodeText(ctName),
                 id:   Service.NCF.Tree.PREFIX_SUB_FOLDER + tlId + "_" + ncfCt});
            //サブタイトルフォルダ一覧の登録
            arrCt.push(
                {ct: ncfCt,
                 el: ctEl});
            arrPrEl.push(ctEl);
          }
          //サブタイトルフォルダ配下のパラグラフの作成
          linkKey.cat = ncfCt;
          linkKey.prId = prId;
          prNameText = Util.$getNodeText(prName);
          prEl = Service.Util.Tree.$makeChild(
              {name:    prNameText,
               id:      Service.NCF.Tree.PREFIX_SUB_PARA + prId,
               term:    true,
               linkKey: Service.NCF.Tree.$getLinkKey(linkKey)});

          //コンテンツ表示イベント登録
          Use.Util.$observe(prEl, "click",
              (function(name) {
                return function(evt) {
                  Service.NCF.doClickTreePara(evt, name);
                }
              })(prNameText));

          arrNcf = [];
          arrNcf.push(prEl);
          Service.Util.Tree.$addChilds(ctEl, arrNcf);
        //パラグラフの処理
        } else {
          linkKey.cat = "";
          linkKey.prId = prId;
          prNameText = Util.$getNodeText(prName);
          prEl = Service.Util.Tree.$makeChild(
              {name:    prNameText,
               id:      Service.NCF.Tree.PREFIX_PARA + prId,
               term:    true,
               linkKey: Service.NCF.Tree.$getLinkKey(linkKey)});

          //コンテンツ表示イベント登録
          Use.Util.$observe(prEl, "click",
              (function(name) {
                return function(evt) {
                  Service.NCF.doClickTreePara(evt, name);
                }
              })(prNameText));

          arrPrEl.push(prEl);
        }
      }
      Service.Util.Tree.$addChilds(tlEl, arrPrEl);
      arrTlEl.push(tlEl);
    }
    //section id取得
    stId = Util.$getAttrValue(stNode, "id");

    //sectionの<li>取得
    stEl = Service.Util.Tree.$getOwner(
        Service.NCF.Tree.treeRoot,
        Service.NCF.Tree.PREFIX_SECTION + stId);

    Service.Util.Tree.$addChilds(stEl, arrTlEl, true);
    //リンクキーが取得できている場合ツリーを展開する
    if(Service.NCF.Tree.linkKey != "") {
      splitedKey = Service.NCF.Tree.linkKey.split(",");
      //ツリーを展開する
      if(splitedKey[1] == stId) {
        Service.NCF.Tree.$expandTree(Service.NCF.Tree.linkKey);
      }
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * リンクキー作成処理
 * @private
 * @param {object} linkKey リンクキー
 * @return {string} linkKey リンクキー
 */
Service.NCF.Tree.$getLinkKey = function(linkKey) {
  var METHODNAME = "Service.NCF.Tree.$getLinkKey";
  try {
    return linkKey.scId + "," + linkKey.stId + ","
            + linkKey.tlId + "," + linkKey.cat + "," + linkKey.prId;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * XML読込処理の失敗時処理
 * @param {Response} res toc.xml,セクションXMLのDOM情報
 */
Service.NCF.Tree.$getTOCOnFailure = function(res) {
  var METHODNAME = "Service.NCF.Tree.$getTOCOnFailure";
  try {
    Use.SystemError.$show(null, METHODNAME, "MVWF0123DAE");
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリーを閉じる処理
 * @private
 */
Service.NCF.Tree.$closeTree = function() {
  var METHODNAME = "Service.NCF.Tree.$closeTree";
  try {
    Service.Util.Tree.$closeTree();
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリーの初期化をした後のツリー操作処理
 * @param {object} linkKey リンクキー
 * @param {boolean} selectTtl 呼出元画面の判別
 */
Service.NCF.Tree.$expandTree = function(linkKey, selectTtl) {
  var METHODNAME = "Service.NCF.Tree.$expandTree";
  try {
    //リンクキーを取得できた場合
    var treeEl = $(Service.NCF.Tree.treeRoot);
    var splitedKey = linkKey.split(",");
    var elmTreeArea = $("ncf_tree_root");

    var retId;
    //カテゴリが含まれる場合
    if(splitedKey.length > 4 && splitedKey[3]) {
      retId = Service.Util.Tree.$expandTree(
          treeEl,
          Service.NCF.Tree.PREFIX_SERVCAT + splitedKey[0],
          Service.NCF.Tree.PREFIX_SECTION + splitedKey[1],
          Service.NCF.Tree.PREFIX_TITLE + splitedKey[2],
          Service.NCF.Tree.PREFIX_SUB_FOLDER
              + splitedKey[2] + "_" + splitedKey[3],
          Service.NCF.Tree.PREFIX_SUB_PARA + splitedKey[4]
      );
    //カテゴリが含まれない場合
    } else if(splitedKey.length > 4){
      retId = Service.Util.Tree.$expandTree(
          treeEl,
          Service.NCF.Tree.PREFIX_SERVCAT + splitedKey[0],
          Service.NCF.Tree.PREFIX_SECTION + splitedKey[1],
          Service.NCF.Tree.PREFIX_TITLE + splitedKey[2],
          Service.NCF.Tree.PREFIX_PARA + splitedKey[4]);
    }
    //タイトル選択画面からのリンクの場合
    if(selectTtl == true) {
      //タイトルフォルダの背景に色を付ける
      var ttlEl = $(Service.NCF.Tree.PREFIX_TITLE + splitedKey[2]);
      //該当タイトルが存在する場合
      if(ttlEl) {
        //前回選択されたドキュメントが有る場合，背景色を削除する
        if(Service.NCF.Tree.selectedTtl) {
          Service.Util.Tree.$unselectTreeNode(Service.NCF.Tree.selectedTtl);
        }
        Service.Util.Tree.$selectTreeNode(elmTreeArea, ttlEl);
        Service.NCF.Tree.selectedTtl = ttlEl; 
      //該当タイトルが存在しない場合はシステムエラー
      } else {
        Use.SystemError.$show(null, METHODNAME);
      }
    //タイトル選択画面以外からのリンクの場合
    } else {

      //リンクキーが取得できた場合
      if(Service.NCF.Tree.linkKey != "") {
        Service.Util.Tree.$unselectTreeNode(
            Service.NCF.Tree.$getLinkkeyElement(
                Service.NCF.Tree.linkKey.split(",")));
      }
      Service.NCF.Tree.linkKey = linkKey;
      Service.Util.Tree.$selectTreeNode(elmTreeArea, 
          Service.NCF.Tree.$getLinkkeyElement(splitedKey));
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー展開の為のリンクキー取得
 * @private
 * @param {Array} splitedKey 分解されたリンクキー配列
 * @return {Element} エレメント情報 
 */
Service.NCF.Tree.$getLinkkeyElement = function(splitedKey) {
  var METHODNAME = "Service.NCF.Tree.$getLinkkeyElement";
  try {
    var linkkeyElement = null;
    //カテゴリが含まれる場合
    if(splitedKey[3] != "") {
      linkkeyElement = $(Service.NCF.Tree.PREFIX_SUB_PARA + splitedKey[4]);
    //カテゴリが含まれない場合
    } else {
      linkkeyElement = $(Service.NCF.Tree.PREFIX_PARA + splitedKey[4]);
    }
    return linkkeyElement;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー選択時の背景色の変更処理
 * @private
 * @param {Element} element クリックイベントの起きたエレメント
 */
Service.NCF.Tree.$setSelectStatus = function(element) {
  var METHODNAME = "Service.NCF.Tree.$setSelectStatus";
  try {
    var splitedKey = [];
    var elmTreeArea = $("ncf_tree_root");
    //リンクキーが取得できた場合
    if(Service.NCF.Tree.linkKey != "") {
      splitedKey = Service.NCF.Tree.linkKey.split(",");
      Service.Util.Tree.$unselectTreeNode(
          Service.NCF.Tree.$getLinkkeyElement(splitedKey));
    }
    Service.Util.Tree.$selectTreeNode(elmTreeArea, element);
    Service.NCF.Tree.linkKey = Service.Util.Tree.$getLinkKey(element);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー選択時の背景色の削除処理
 */
Service.NCF.Tree.$unselectTreeNode = function() {
  var METHODNAME = "Service.NCF.Tree.$unselectTreeNode";
  try {
    //タイトル選択画面からの背景色を削除する
    if(Service.NCF.Tree.selectedTtl) {
      Service.Util.Tree.$unselectTreeNode(Service.NCF.Tree.selectedTtl);
    }
    //クリックイベントからの背景色を削除する
    Service.Util.Tree.$unselectTreeNode(
        Service.NCF.Tree.$getLinkkeyElement(
            Service.NCF.Tree.linkKey.split(",")));
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * パラグラフ選択処理
 * @param {Event} evt イベント
 * @param {string} name パラグラフ名称
 */
Service.NCF.doClickTreePara = function(evt, name) {
  var METHODNAME = "Service.NCF.doClickTreePara";
  try {
    var elm = Event.$element(evt);
    Service.NCF.Tree.$setSelectStatus(elm);
    Service.NCF.Tree.$openDocument(Service.Util.Tree.$getLinkKey(elm), name);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

//-----------------------------------------------------------------------------
/**
 * ツリー用共通
 * @namespace ツリー用共通クラス
 */
Service.Util.Tree = {};

//展開/格納状態CSS定義
/**
 * フォルダスタイル（オープン）
 * @type string
 */
Service.Util.Tree.FOLDER_OPEN_CSS   = "folder_open";
/**
 * フォルダスタイル（クローズ）
 * @type string
 */
Service.Util.Tree.FOLDER_CLOSE_CSS  = "folder_close";
/**
 * [-]スタイル
 * @type string
 */
Service.Util.Tree.LINES_OPEN_CSS    = "lines_open";
/**
 * [+]スタイル
 * @type string
 */
Service.Util.Tree.LINES_CLOSE_CSS   = "lines_close";
/**
 * 選択状態スタイル
 * @type string
 */
Service.Util.Tree.SELECTED_CSS      = "selected";
/**
 * 閲覧画面内でのリンク表示文言のタブインデックス
 * @type string
 */
Service.Util.Tree.LINK_TABINDEX         = "99";
/**
 * ツリー元要素
 * @type Element
 */
Service.Util.Tree.rootTree          = null;

/**
 * ツリー要素生成
 * @param {object(連想配列)} childInfo 要素情報<br />
 *   {name: リンク表示文言,<br />
 *    id:   id(そのもの)→リンク要素に格納,<br />
 *    term: 末端の場合true指定(枝は指定しない),<br />
 *    open: 枝open/closeのクラス指定判定 trueでopenとする。(通常指定しない),<br />
 *    linkKey: リンクキー情報,<br />
 *    category: パラグラフカテゴリ}
 * @param {function} load_handler section以下ツリー展開が必要な場合のコールバック関数指定<br />
 *   (section以外は省略)
 * @param {function} open_handler 枝Elementをクリック時に動作させるコールバック関数指定
 */
Service.Util.Tree.$makeChild = function(childInfo, load_handler, open_handler) {
  var METHODNAME = "Service.Util.Tree.$makeChild";
  try {

    // リスト生成
    var liEl = new Element("li");
    var spanElPartsId = null;

    // リンク表示文言が空の場合、"&nbsp;"を設定する
    if(childInfo.name == "") {
      childInfo.name = "&nbsp;";
    }

    if(childInfo.term) {
      // 末端のElementの場合
      // →<li><p><a id="id">name<span>linkKey</span><span>category</span></a></p></li>
      var pEl = new Element("p");
      var linkEl = new Element("a");
      var spanEl = new Element("span");
      var spanElCat = new Element("span");
      spanEl.className = "invisible"; 
      spanElCat.className = "invisible"; 

      //名称がある場合、セットする
      if(childInfo.name) {
        // 半角スペースを"&nbsp;"に置換する
        linkEl.innerHTML = 
            (childInfo.name).replace(new RegExp(' ', 'g'), "&nbsp;");
        Element.$writeAttribute(linkEl, "title", childInfo.name);
      }
      //id指定がある場合、セットする
      if(childInfo.id) {
        linkEl.id = childInfo.id;
      }
      //linkKeyがある場合、セットする
      if(childInfo.linkKey) {
        spanEl.innerHTML = childInfo.linkKey;
      }
      //linkKeyがある場合、セットする
      if(childInfo.category) {
        spanElCat.innerHTML = childInfo.category;
      }
      Element.$writeAttribute(linkEl, "href", "javascript:void(0);");
      Element.$writeAttribute(linkEl, 
          "tabIndex", Service.Util.Tree.LINK_TABINDEX);
      Element.$insert(linkEl, spanEl);
      Element.$insert(linkEl, spanElCat);
      Element.$insert(pEl, linkEl);
      Element.$insert(liEl, pEl);

    } else {
      // 枝のElementの場合
      // →<li>
      //     <div class="lines_close"></div>
      //     <div class="folder_close"><a id="id">name</a></div>
      //   </li>
      // 格納状態生成[+]
      var lineEl = new Element("div");
      // 品名コード設定要素を作成
      spanElPartsId = new  Element("span");
      spanElPartsId.className = "invisible";
      //オープンされてる場合、クローズする
      if(childInfo.open) {
        Element.$addClassName(lineEl, Service.Util.Tree.LINES_OPEN_CSS);
      //クローズされてる場合、オープンする
      } else {
        Element.$addClassName(lineEl, Service.Util.Tree.LINES_CLOSE_CSS);
      }
      Element.$insert(liEl, lineEl);

      // 格納状態生成[本]
      var folderEl = new Element("div");
      //オープンされてる場合、クローズする
      if(childInfo.open) {
        Element.$addClassName(folderEl, Service.Util.Tree.FOLDER_OPEN_CSS);
      //クローズされてる場合、オープンする
      } else {
        Element.$addClassName(folderEl, Service.Util.Tree.FOLDER_CLOSE_CSS);
      }

      // リンク生成
      var linkEl = new Element("a");
      //名称がある場合、セットする
      if(childInfo.name) {
        // 半角スペースを"&nbsp;"に置換する
        linkEl.innerHTML = 
            (childInfo.name).replace(new RegExp(' ', 'g'), "&nbsp;");
        Element.$writeAttribute(linkEl, "title", childInfo.name);
      }
      //idがある場合、セットする
      if(childInfo.id) {
        linkEl.id = childInfo.id;
      }
      // 品名コードがある場合、セットする
      if(childInfo.partsId) {
        spanElPartsId.innerHTML = childInfo.partsId;
      }
      //ハンドラがある場合、セットする
      if(Util.$isFunction(load_handler)) {
        linkEl._funcNonChild = load_handler;
      }
      //枝Element用ハンドラがある場合、セットする
      if(Util.$isFunction(open_handler)) {
        linkEl._funcOpenBranch = open_handler;
      }
      Element.$writeAttribute(linkEl, "href", "javascript:void(0);");
      Element.$writeAttribute(linkEl, 
          "tabIndex", Service.Util.Tree.LINK_TABINDEX);
      Element.$insert(linkEl, spanElPartsId);
      Element.$insert(folderEl, linkEl);
      Element.$insert(liEl, folderEl);

      // イベント登録(展開/格納)
      // ※展開イベントで、展開情報が無い場合、load_handlerが呼び出される。
      Use.Util.$observe(lineEl, "click", Service.Util.Tree.$toggleLine);
      Use.Util.$observe(folderEl, "click", Service.Util.Tree.$openFolder);
      
      // ※link自体のイベントはfolder側(親)で検知するので不要。
      //   但し、イベント発生元要素は、クリックした要素になるので注意。
    }

    return liEl;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * [+/-]クリック時コールバック関数
 * クリック時、[+]の場合、展開処理
 * クリック時、[-]の場合、格納処理
 * @param {Event} evt イベント
 */
Service.Util.Tree.$toggleLine = function(evt) {
  var METHODNAME = "Service.Util.Tree.$toggleLine";
  try {

    var targetEl = Event.$element(evt);
    //対象の要素が存在する場合
    if(targetEl) {
      // 自<li>要素取得([+/-]の親)
      var ownerEl = targetEl.parentNode;
      // 親直下div取得(line,folder)
      var divEls = Util.Selector.$select("> div", ownerEl);
      var lineEl = targetEl;
      var folderEl = divEls[1];
      // folder直下のリンクを取得
      var linkEl = Util.Selector.$select("> a", folderEl)[0];
      // 下層ツリー取得
      var childEls = Util.Selector.$select("> ul", ownerEl);
      var childEl = null;
      //子要素がある場合、先頭をセットする
      if(childEls.length > 0) {
        childEl = childEls[0];
      }

      // [+/-]要素チェック
      if(lineEl.className == Service.Util.Tree.LINES_OPEN_CSS) {
        // [-](展開済)の場合、ツリーを閉じる
        Service.Util.Tree.$closeElement(lineEl, folderEl, linkEl, childEl);

      } else {
        // [+](未展開)の場合、ツリーを開く
        Service.Util.Tree.$openElement(lineEl, folderEl, linkEl, childEl);
      }
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * [本][リンク]クリック時コールバック関数
 * クリック時、[+]の場合、展開処理
 * クリック時、[-]の場合、スキップ
 * @param {Event} evt イベント
 */
Service.Util.Tree.$openFolder = function(evt) {
  var METHODNAME = "Service.Util.Tree.$openFolder";
  try {

    var targetEl = Event.$element(evt);
    if(targetEl) {
      var ownerEl = null;
      
      // 自<li>要素取得
      if(targetEl.tagName.toLowerCase() == "div") {
        // div(folder)の場合、親
        ownerEl = targetEl.parentNode;
      } else {
        // a(リンク)の場合、親の親
        ownerEl = targetEl.parentNode.parentNode;
      }
      // 親直下div取得(line,folder)
      var divEls = Util.Selector.$select("> div", ownerEl);
      var lineEl = divEls[0];
      var folderEl = divEls[1];
      
      //var folderEl = targetEl;
      // folder直下のリンクを取得
      var linkEl = Util.Selector.$select("> a", folderEl)[0];
      
      // 下層ツリー取得
      var childEls = Util.Selector.$select("> ul", ownerEl);
      var childEl = null;
      if(childEls.length > 0) {
        childEl = childEls[0];
      }
      
      // [+/-]要素チェック
      if(lineEl.className != Service.Util.Tree.LINES_OPEN_CSS) {
        // [+](未展開)の場合、ツリーを開く
        Service.Util.Tree.$openElement(lineEl, folderEl, linkEl, childEl);
      }
      // [-](展開済)の場合、スキップ
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * (内部関数)
 * ツリー展開処理
 * @private
 * @param {Element} lineEl [+/-]要素
 * @param {Element} folderEl [本]要素
 * @param {Element} linkEl [リンク]要素
 * @param {Element} childEl 下位ツリー要素(&lt;ul&gt;想定)
 */
Service.Util.Tree.$openElement = function(lineEl, folderEl, linkEl, childEl) {
  var METHODNAME = "Service.Util.Tree.$openElement";
  try {

    // [-]表示
    Element.$removeClassName(lineEl, Service.Util.Tree.LINES_CLOSE_CSS);
    Element.$addClassName(lineEl, Service.Util.Tree.LINES_OPEN_CSS);

    // [本]表示(開いた状態)
    Element.$removeClassName(folderEl, Service.Util.Tree.FOLDER_CLOSE_CSS);
    Element.$addClassName(folderEl, Service.Util.Tree.FOLDER_OPEN_CSS);
    
    // 下位ツリー表示
    var childList = null;
    if(childEl) {
      Element.$show(childEl);
      // 下位ツリーに要素があるかチェック
      childList = Element.$immediateDescendants(childEl);
    }
    
    // 下位ツリーの要素チェック
    if(childList == null || childList.length <= 0) {
      // 存在しない場合(section要素を想定)
      if(Util.$isFunction(linkEl._funcNonChild)) {
        // section以降取得呼び出しコールバック関数の呼び出し
        // 引数にリンク(id保持)要素を渡す。
        // ※makeChildする際、リンク要素にコールバック関数を退避している。
        linkEl._funcNonChild(linkEl);
      }
    }

    // 枝Element用ハンドラが有る場合
    if(Util.$isFunction(linkEl._funcOpenBranch)) {
      // 枝Element用コールバック関数の呼び出し
      // 引数にリンク(id保持)要素を渡す。
      // ※makeChildする際、リンク要素にコールバック関数を退避している。
      linkEl._funcOpenBranch(linkEl);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * (内部関数)
 * ツリー格納処理
 * @private
 * @param {Element} lineEl [+/-]要素
 * @param {Element} folderEl [本]要素
 * @param {Element} linkEl [リンク]要素 ※使用しない
 * @param {Element} childEl 下位ツリー要素(&lt;ul&gt;想定)
 */
Service.Util.Tree.$closeElement = function(lineEl, folderEl, linkEl, childEl) {
  var METHODNAME = "Service.Util.Tree.$closeElement";
  try {

    // [+]表示
    Element.$removeClassName(lineEl, Service.Util.Tree.LINES_OPEN_CSS);
    Element.$addClassName(lineEl, Service.Util.Tree.LINES_CLOSE_CSS);
    
    // [本]表示(閉じた状態)
    Element.$removeClassName(folderEl, Service.Util.Tree.FOLDER_OPEN_CSS);
    Element.$addClassName(folderEl, Service.Util.Tree.FOLDER_CLOSE_CSS);
    
    // 下位ツリー非表示
    if(childEl) {
      Element.$hide(childEl);
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー要素追加
 * @param {Element} parentEl booklet_tree 又は makeChild戻り値(&lt;li&gt;想定)
 * @param {Element} arrChilds 追加するElementの配列(&lt;li&gt;想定)
 * @param {Element} visible true:ツリー展開, false:ツリー非表示<br />
 *   (省略時false ※基本、servcatへ追加時のみtrue指定)
 */
Service.Util.Tree.$addChilds = function(parentEl, arrChilds, visible) {
  var METHODNAME = "Service.Util.Tree.$addChilds";
  try {

    var ulEls = null;
    var ulEl;
    var il = 0;

    // 追加対象直下の<ul>要素を取得
    parentEl = $(parentEl);
    ulEls = Util.Selector.$select("> ul", parentEl);
    if(ulEls.length <= 0) {
      // 存在しない場合、<ul>生成
      ulEl = new Element("ul");
      // ※ここで$insertしてしまえばよいが、追加時点で描画される想定の為、
      //   全て追加されてから親に追加するように対応。

    } else {
      // 存在する場合、先頭をセット
      ulEl = ulEls[0];
    }

    // 非表示状態とし$insertする。
    // ※パフォーマンス改善策 (実質、変わらないかもしれない)
    Element.$hide(ulEl);
    il = arrChilds.length;
    // 要素追加
    for(var i = 0; i < il; i++) {
      Element.$insert(ulEl, arrChilds[i]);
    }

    // <ul>生成した場合
    if(ulEls.length <= 0) {
      // 親要素に追加
      Element.$insert(parentEl, ulEl);
    }

    // 表示指定の場合表示スタイルを設定
    if(visible) {
      Element.$show(ulEl);
    // 非表示指定の場合非表示スタイルを設定
    } else {
      Element.$hide(ulEl);
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー展開
 * @param {Element} argN<br />
 *  arguments[0] ツリー元要素<br />
 *  arguments[1～] 各階層毎のID指定<br />
 *   [1]:servcat, [2]:section, [3]:ttl, [4]:para を想定<br />
 *   5階層以上も対応
 */
Service.Util.Tree.$expandTree = function() {
  var METHODNAME = "Service.Util.Tree.$expandTree";
  try {

    // ツリー元要素取得
    var lastEl = $(arguments[0]);
    var il = arguments.length - 1;
    var lastElPre = $(arguments[il]);
    // 引数で指定されたID毎に検索
    for(var i = 1; i < il; i++) {
      var linkEl = $(arguments[i]);
      if(!linkEl) {
        break;
      }
      // 取得した要素を退避
      lastEl = linkEl;
      Event.$fireEvent(lastEl, "click");
    }

    // 最後の１個手前まで行っていたら元々の最後のElementを最終Elementとする
    if(i === il && lastElPre) {
      lastEl = lastElPre;
    }

    // 最終取得した要素のIDを返す
    // ※引数指定した内、存在するIDを返す→
    //   section以下の読み込みがされていない場合、sectionのidが返る
    if(lastEl) {
      return lastEl.id;
    } else {
      return "";
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリークリア
 * @param {Element} tree ツリー元要素
 */
Service.Util.Tree.$initTree = function(tree) {
  var METHODNAME = "Service.Util.Tree.$initTree";
  try {

    // tree削除
    var treeEl = $(tree);
    var childEls = Element.$immediateDescendants(treeEl);
    var il = 0;
    var jl = 0;
    il = childEls.length;
    // ツリー配下の全ての要素を取得
    for(var i = 0; i < il; i++) {
      var posEls = Util.Selector.$select("*", childEls[i]);
      jl = posEls.length;
      // イベントを全て停止する
      for(var j = 0; j < jl; j++) {
        Event.$stopObserving(posEls[j]);
      }
      Event.$stopObserving(childEls[i]);
      Element.$remove(childEls[i]);
    }
    Service.Util.Tree.rootTree = treeEl;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 所属&lt;li&gt;取得
 * @param {Element} tree ツリー元要素
 * @param {Element} id 検索ID
 */
Service.Util.Tree.$getOwner = function(tree, id) {
  var METHODNAME = "Service.Util.Tree.$getOwner";
  try {

    // tree削除
    var treeEl = $(tree);

    // id検索(リンク取得)
    var linkEls = Util.Selector.$select("#" + id + ":first-child", treeEl);

    if(linkEls.length <= 0) {
      // idが見つからない場合、nullを返す
      return null;
    } else {
      // id指定(リンク)した要素の親(folder)→親で<li>取得
      return linkEls[0].parentNode.parentNode;
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリーを閉じる
 */
Service.Util.Tree.$closeTree = function() {
  var METHODNAME = "Service.Util.Tree.$closeTree";
  try {
    
    initTree(Service.Util.Tree.rootTree);
    Service.Util.Tree.rootTree = null;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー要素を選択状態にする
 * @param {Element} elmTreeArea ツリー表示エリア
 * @param {Element} element ツリー元要素
 */
Service.Util.Tree.$selectTreeNode = function(elmTreeArea, element) {
  var METHODNAME = "Service.Util.Tree.$selectTreeNode";
  try {
    
    var linkEl = null;
    var tagName = "";
    var display = Element.$getStyle(elmTreeArea, 'display');
    //要素が存在する場合
    if(element) {
      tagName = element.tagName.toLowerCase();
      //aタグの場合はそのまま
      if(tagName == "a") {
        linkEl = element;
      //pタグの場合は子要素を取得
      } else if(tagName == "p") {
        linkEl = element.firstChild;
      //divタグの場合
      } else {
        //子要素を取得
        linkEl = element.firstChild;
        //子要素がない場合は次の要素の子要素を取得
        if(!linkEl) {
          linkEl = Element.$nextElementSibling(element).firstChild;
        }
      }
      Element.$addClassName(linkEl, Service.Util.Tree.SELECTED_CSS);
      
      // ツリー表示エリアが表示されている場合、フォーカスを設定
      if(display != "none") {
        linkEl.focus();
      }
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ツリー要素の選択状態を解除する
 * @param {Element} element ツリー元要素
 */
Service.Util.Tree.$unselectTreeNode = function(element) {
  var METHODNAME = "Service.Util.Tree.$unselectTreeNode";
  try {
    
    var linkEl = null;
    var tagName = "";
    //要素が存在する場合
    if(element) {
      tagName = element.tagName.toLowerCase();
      //aタグの場合はそのまま
      if(tagName == "a") {
        linkEl = element;
      //pタグの場合は子要素を取得
      } else if(tagName == "p") {
        linkEl = element.firstChild;
      //divタグの場合
      } else {
        //子要素を取得
        linkEl = element.firstChild;
        //子要素がない場合は次の要素の子要素を取得
        if(!linkEl) {
          linkEl = Element.$nextElementSibling(element).firstChild;
        }
      }
      Element.$removeClassName(linkEl, Service.Util.Tree.SELECTED_CSS);
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * パラグラフ情報を取得する
 * @param {Element} paraEl パラグラフ要素
 * @return {object(連想配列)} パラグラフ情報<br />
 * {name:パラグラフ名, linkKey:リンクキー, category:パラグラフカテゴリ}
 */
Service.Util.Tree.$getParagraphInfo = function(paraEl) {
  var METHODNAME = "Service.Util.Tree.$getParagraphInfo";
  try {

    var result = {name: "", linkKey: "", category: ""};
    //パラグラフ要素がある場合はパラグラフ情報を取得する
    if(paraEl) {
      result.name = Util.$getNodeText(paraEl);
      result.linkKey = Service.Util.Tree.$getLinkKey(paraEl);
      result.category = Service.Util.Tree.$getCategory(paraEl);
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * リンクキー情報を取得する
 * @param {Element} paraEl パラグラフ要素
 * @return {string} リンクキー情報
 */
Service.Util.Tree.$getLinkKey = function(paraEl) {
  var METHODNAME = "Service.Util.Tree.$getLinkKey";
  try {

    var result = "";
    var spans = [];
    //elementがある場合nodeTextを取得する
    if(paraEl) {
      spans = paraEl.getElementsByTagName("span");
      //spanがある場合はlinkKeyを入れる
      if(spans.length > 0) {
        result = spans[0].innerHTML;
      }
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * パラグラフカテゴリ情報を取得する
 * @param {Element} paraEl パラグラフ要素
 * @return {string} パラグラフカテゴリ情報
 */
Service.Util.Tree.$getCategory = function(paraEl) {
  var METHODNAME = "Service.Util.Tree.$getCategory";
  try {

    var result = "";
    var spans = [];
    //elementがある場合nodeTextを取得する
    if(paraEl) {
      spans = paraEl.getElementsByTagName("span");
      //spanがある場合はlinkKeyを入れる
      if(spans.length > 1) {
        result = spans[1].innerHTML;
      }
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * タイトル情報を取得する
 * @param {Element} tlEl タイトル要素
 * @return {object(連想配列)} パラグラフ情報<br />
 * {name:タイトル名, partsId:品名コード}
 */
Service.Util.Tree.$getTitleInfo = function(tlEl) {
  var METHODNAME = "Service.Util.Tree.$getTitleInfo";
  try {

    var result = {name: "", partsId: ""};
    // タイトル要素がある場合、タイトル情報を取得する
    if(tlEl) {
      result.name = Util.$getNodeText(tlEl);
      result.partsId = Service.Util.Tree.$getPartsId(tlEl);
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 品名コードを取得する
 * @param {Element} tlEl タイトル要素
 * @return {string} 品名コード
 */
Service.Util.Tree.$getPartsId = function(tlEl) {
  var METHODNAME = "Service.Util.Tree.$getPartsId";
  try {

    var result = "";
    var spans = [];
    // タイトル要素がある場合、子要素のspan要素を取得
    if(tlEl) {
      spans = Util.Selector.$select("span", tlEl);
      // span要素がある場合、品名コード取得
      if(spans.length == 1) {
        result = spans[0].innerHTML;
      }
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};
