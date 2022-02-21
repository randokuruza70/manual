/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2012/10/24 */

/**
 * file service_searchsimple.js<br />
 *
 * @fileoverview このファイルには、簡易検索の関数が定義されています。<br />
 * file-> service_simplesearch.js
 * @author 原田
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/03/10|1.0.0   |原田|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/03/10 1.0.0 原田 ・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 簡易検索
 * @namespace 簡易検索クラス
 */
Service.SimpleSearch = {};
/**
 * テキスト検索XML用XPATH
 * @type string
 */
Service.SimpleSearch.SEARCH_PUB = "//pub";
/**
 * パラグラフカテゴリ絞込み用XPATH
 * @type string
 */
Service.SimpleSearch.SEARCH_PARA_CATEGORY = "./servcat/section/\
ttl/para[@category=\'{categoryId}\']";
/**
 * パラグラフ適用年月取得用XPATH
 * @type string
 */
Service.SimpleSearch.PUB_TERM_BASE = "//term-base/term";
/**
 * パラグラフ適用時期検索用XPATH
 * @type string
 */
Service.SimpleSearch.SEARCH_PARA_TEKIDATE = "//servcat/section/\
ttl[@id=\'{ttlId}\']/para[@id=\'{paraId}\']";
/**
 * タイトル適用時期検索用XPATH
 * @type string
 */
Service.SimpleSearch.SEARCH_TTL_TEKIDATE = "//servcat/section/\
ttl[@id=\'{ttlId}\']";
/**
 * 文字列置き換え用文字列
 * @type string
 */
Service.SimpleSearch.UPPER_CASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/**
 * 文字列置き換え用文字列
 * @type string
 */
Service.SimpleSearch.LOWER_CASE = "abcdefghijklmnopqrstuvwxyz";
/**
 * 検索結果のコールバック関数
 * @type function
 */
Service.SimpleSearch.$result = null;
/**
 * マニュアル言語
 * @type string
 */
Service.SimpleSearch.mlang = "";
/**
 * 車種世代コード
 * @type string
 */
Service.SimpleSearch.pubBindID = "";
/**
 * 適用時期
 * @type string
 */
Service.SimpleSearch.tekiDate = "";
/**
 * 検索対象マニュアル情報
 * @type Array
 */
Service.SimpleSearch.manuals = [];
/**
 * 車両型式
 * @type string
 */
Service.SimpleSearch.carType = "";
/**
 * 品名コード
 * @type string
 */
Service.SimpleSearch.partsCD = "";
/**
 * 検索キーワード
 * @type string
 */
Service.SimpleSearch.keyword = "";
/**
 * 開始位置
 * @type string
 */
Service.SimpleSearch.position = "";
/**
 * 取得件数
 * @type string
 */
Service.SimpleSearch.number = "";

/**
 * 簡易検索
 * @param {function} result コールバック関数
 * @param {string} mlang マニュアル言語
 * @param {string} pubBindID 車種世代コード
 * @param {string} tekiDate 適用時期
 * @param {Array} manuals 検索対象マニュアル情報
 * @param {string} carType 車両型式
 * @param {string} partsCD 品名コード
 * @param {string} keyword 検索キーワード
 * @param {string} position 開始位置
 * @param {string} number 取得件数
 * @param {string} rmLnkFlg 修理書へのリンクフラグ
 */
Service.SimpleSearch.$search = function(result, mlang, pubBindID,
    tekiDate, manuals, carType, partsCD, keyword, position, number, rmLnkFlg) {
  var METHODNAME = "Service.SimpleSearch.$search";
  try {
    var url = null;
    Service.SimpleSearch.$result = result;
    Service.SimpleSearch.mlang = mlang;
    Service.SimpleSearch.pubBindID = pubBindID;
    Service.SimpleSearch.tekiDate = tekiDate;
    Service.SimpleSearch.manuals = manuals;
    Service.SimpleSearch.carType = carType;
    Service.SimpleSearch.partsCD = partsCD;
    //Service.SimpleSearch.partsCD = partsCD.toLowerCase();
    Service.SimpleSearch.keyword = keyword;
    Service.SimpleSearch.position = position;
    Service.SimpleSearch.number = number;

    //XML読み込み
    url = Use.Util.$getContentsPath("C_SERVICE_SIMPLESEARCH_SEARCH_XML_PATH",
        "", carType, "");
    Use.Util.$request(url, true, Service.SimpleSearch.$doAfterClickSearchBtn.curry(rmLnkFlg),
      Service.SimpleSearch.$getSearchOnFailure, true, true);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * テキスト検索XML読込成功時処理
 * @param {string} rmLnkFlg 修理書へのリンクフラグ
 * @param {Response} res レスポンスオブジェクト
 */
Service.SimpleSearch.$doAfterClickSearchBtn = function(rmLnkFlg, res) {
  var METHODNAME = "Service.SimpleSearch.$doAfterClickSearchBtn";
  try {
    var textSearchXml = res.responseXML;
    var pubList = null;
    var pubNode = null;
    var pubType = null;
    var matchFlg = false;
    var manualType = null;
    var url = null;
    var arrTerm = [];
    var result = {};
    var arrManual = [];
    var manual = {};
    var pubLen = 0;
    var manualLen = Service.SimpleSearch.manuals.length;
    var pubListLen = 0;
    var arrContentsAll = [];
    var searchManuals = [];
    var searchManualsLen = 0;
    var searchRmTypes = [];
    var rmFlg = false;
    var rmTypeFlg = false;
    var rmTypes = [DictConst.C_SEARCH_OPTION_CD_LAYOUT, 
                   DictConst.C_SEARCH_OPTION_CD_TROUBLE, 
                   DictConst.C_SEARCH_OPTION_CD_REMOVE, 
                   DictConst.C_SEARCH_OPTION_CD_MAINTENANCE, 
                   DictConst.C_SEARCH_OPTION_CD_CUSTOM, 
                   DictConst.C_SEARCH_OPTION_CD_PREPARED, 
                   DictConst.C_SEARCH_OPTION_CD_OTHER];
    var rmTypesLen = 0;
    var delCategorys = "";
    var delCateArr = [];
    var delCateLen = 0;
    var paraXPath = null;
    var paraList = null;
    var paraLen = 0;
    var paraNode = null;

    // 検索対象マニュアル情報から、修理書区分を分離
    for(var i = 0; i < manualLen; i++) {
      if(Util.$getIndexOfArray(rmTypes, Service.SimpleSearch.manuals[i]) != -1) {
        searchRmTypes.push(Service.SimpleSearch.manuals[i]);
        rmTypeFlg = true;
      } else {
        searchManuals.push(Service.SimpleSearch.manuals[i]);
      }
    }
    searchManualsLen = searchManuals.length;

    result["status"] = "0";
    result["keyword"] = Service.SimpleSearch.keyword;

    //pub一覧を取得
    pubList = Util.$getNodes(textSearchXml, Service.SimpleSearch.SEARCH_PUB);

    pubLen = pubList.length;
    //pub要素を全て参照する
    for(var pubIdx = 0; pubIdx < pubLen; pubIdx++) {

      pubNode = pubList[pubIdx];
      //pubの属性を取得
      pubType = Util.$getAttrValue(pubNode, "type");
      matchFlg = false;

      //引数で受け取ったマニュアル情報と一致しないpubTypeは,
      //そのノードを削除する
      for(var mIdx = 0; mIdx < searchManualsLen; mIdx++) {

        manualType = parseInt(searchManuals[mIdx], 10);
        //検索対象マニュアル情報と一致するタイプの場合,matchFlgをtrueにする
        if(DictConst.C_PUB_TYPE_CONVERTER[manualType] == pubType) {
          // 修理書であればrmFlgをtrueにする
          if(pubType == DictConst.C_MANUAL_REPAIR) {
            rmFlg = true;
          }
          matchFlg = true;
          break;
        }
      }
      //マニュアル情報と一致するタイプが無かった場合要素を削除する
      if(matchFlg == false) {
        pubNode.parentNode.removeChild(pubNode);
        continue;
      }

      //修理書にて検索オプション指定がある場合、検索対象外のカテゴリ要素を削除
      if(rmFlg == true && rmTypeFlg == true) {
        
        rmTypesLen = rmTypes.length;
        for(var tgtIdx = 0; tgtIdx < rmTypesLen; tgtIdx++) {
          if(Util.$getIndexOfArray(searchRmTypes, rmTypes[tgtIdx]) == -1) {
            delCategorys += DictConst.C_PARA_CATEGORY[rmTypes[tgtIdx]] + ",";
          }
        }
        delCategorys = delCategorys.substring(0, delCategorys.length - 1);
        delCateArr = delCategorys.split(",");
        delCateLen = delCateArr.length;
        // 検索対象外項目に該当するカテゴリを確認
        for(var delIdx = 0; delIdx < delCateLen; delIdx++) {
          paraXPath = Service.SimpleSearch.SEARCH_PARA_CATEGORY
                                .replace("{categoryId}", delCateArr[delIdx]);
          paraList = Util.$getNodes(pubNode, paraXPath);
          paraLen = paraList.length;
          // ノードが検索対象外カテゴリを所持している場合,削除
          for(var paraIdx = 0; paraIdx < paraLen; paraIdx++) {
            paraNode = paraList[paraIdx];
            paraNode.parentNode.removeChild(paraNode);
          }
        }
        rmFlg = false;
        rmTypeFlg = false;
      }

      //適用時期一覧の取得処理
      url = Use.Util.$getContentsPath(
          "C_SERVICE_SIMPLESEARCH_PUB_XML_PATH_" + pubType, 
          Service.SimpleSearch.tekiDate, Service.SimpleSearch.carType, "");

      //パブXML読み込み
      Use.Util.$request(url, false, function(res) {
        arrTerm = Service.SimpleSearch.$getPubOnSuccess(res);
      }, function(res) {}, true, true);
      //適用時期の絞り込み処理
      if(Service.SimpleSearch.$selectTekiDate(
          arrTerm, pubType, pubNode) != true) {
        Service.SimpleSearch.$getSearchOnFailure();
        return;
      }
    }

    pubList = Util.$getNodes(textSearchXml, Service.SimpleSearch.SEARCH_PUB);
    //初期化時に取得した検索対象マニュアル分ループする
    for(var mIdx = 0; mIdx < searchManualsLen; mIdx++) {
      pubNode = null;
      pubListLen = pubList.length;
      //検索済の検索対象マニュアルを調べる
      for(var pubIdx = 0; pubIdx < pubListLen; pubIdx++) {
        //pubの属性を取得
        pubType = Util.$getAttrValue(pubList[pubIdx], "type");
        manualType = parseInt(searchManuals[mIdx], 10);
        //検索対象マニュアル情報と一致するタイプの場合,matchFlgをtrueにする
        if(DictConst.C_PUB_TYPE_CONVERTER[manualType]
                                                    == pubType) {
          pubNode = pubList[pubIdx];
          break;
        }
      }
      //検索対象のノードが存在する場合
      if(pubNode != null) {
        // 修理書へのリンクで、検索キーワードと品名コードがある場合
        if(rmLnkFlg == DictConst.C_SERVICE_SIMPLE_RMSEARCH 
            && Use.Validator.$isNotEmpty(Service.SimpleSearch.keyword) == true
            && Use.Validator.$isNotEmpty(Service.SimpleSearch.partsCD) == true) {
          arrContentsAll = Service.SimpleSearch.$searchKeyword(pubNode.cloneNode(true), pubType)
                   .concat(Service.SimpleSearch.$searchPartsCD(pubNode.cloneNode(true), pubType));
        //簡易検索 キーワード検索をする場合
        } else if(Service.SimpleSearch.partsCD == "") {
          arrContentsAll = Service.SimpleSearch.$searchKeyword(pubNode, pubType);
        //簡易検索 品名コードで検索をする場合
        } else {
          arrContentsAll = Service.SimpleSearch.$searchPartsCD(pubNode, pubType);
        }
        // 検索結果から1ページ分を抽出
        manual = Service.SimpleSearch.$getResultOnePage(pubType, arrContentsAll);
      //検索対象のノードが存在しない場合
      } else {
        manual = {};
        manual["id"] = DictConst.C_SERVICE_MANUAL_TYPE[
            searchManuals[mIdx]];
        manual["position"] = 0;
        manual["number"] = 0;
        manual["cnt"] = 0;
        manual["contents"] = [];
      }
      arrManual.push(manual);
    }
    result["manual"] = arrManual;
    Service.SimpleSearch.$result(result);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * パブXML読込成功時処理
 * @param {Response} res レスポンスオブジェクト
 * @param {Array} 適用連番・年月対応情報
 * @return {object(連想配列)} 適用時期
 */
Service.SimpleSearch.$getPubOnSuccess = function(res) {
  var METHODNAME = "Service.SimpleSearch.$getPubOnSuccess";
  try {
    var result = {};
    var termList = Util.$getNodes(res.responseXML,
        Service.SimpleSearch.PUB_TERM_BASE);
    var termListLen = termList.length;

    //タイトル一覧の処理
    for(var tIdx = 0; tIdx < termListLen; tIdx++) {
      result[Util.$getAttrValue(termList[tIdx], "term-id-from")] = Util
          .$getAttrValue(termList[tIdx], "date");
    }
    return result;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 適用時期の絞込み処理
 * @param {object} term termリスト
 * @param {string} pubType パブタイプ
 * @param {object} pubNode テキスト検索XMLのノードオブジェクト
 * @return {boolean} 処理結果フラグ
 */
Service.SimpleSearch.$selectTekiDate = function(
    term, pubType, pubNode) {
  var METHODNAME = "Service.SimpleSearch.$selectTekiDate";
  try {
    var tocXml = null;
    var scId = null;
    var stList = null;
    var stId = null;
    var tlList = null;
    var tlId = null;
    var query = null;
    var tlNode = null;
    var tlVisible = null;
    var prId = null;
    var prNode = null;
    var scList = null;
    var prList = null;
    var fromDate = null;
    var toDate = null;
    var termIdTo = null;
    var scListLen = 0;
    var stListLen = 0;
    var tlListLen = 0;
    var prListLen = 0;

    //termリストが取得できない場合、処理を中断する
    if(term.length == 0) {
      return false;
    }
    //セクションXMLを取得
    tocXml = Service.SimpleSearch.$getTOCXml(pubType);
    //セクションXMLが取得できない場合，処理を中断する
    if(tocXml == null) {
       return false;
    }

    scList = Util.$getNodes(pubNode, "./servcat");
    scListLen = scList.length;
    //サービスカテゴリ一覧の処理
    for(var scIdx = 0; scIdx < scListLen; scIdx++) {

      scId = Util.$getAttrValue(scList[scIdx], "id");
      stList = Util.$getNodes(scList[scIdx], "./section");
      stListLen = stList.length;
      //セクション一覧の処理
      for(var stIdx = 0; stIdx < stListLen; stIdx++) {

        stId = Util.$getAttrValue(stList[stIdx], "id");
        tlList = Util.$getNodes(stList[stIdx], "./ttl");
        tlListLen = tlList.length;
        //タイトル一覧の処理
        for(var tlIdx = 0; tlIdx < tlListLen; tlIdx++) {

          tlId = Util.$getAttrValue(tlList[tlIdx], "id");

          prList = Util.$getNodes(tlList[tlIdx], ".//para");
          prListLen = prList.length;
          //パラグラフ一覧の処理
          for(var prIdx = 0; prIdx < prListLen; prIdx++) {

            prId = Util.$getAttrValue(prList[prIdx], "id");

            query = Service.SimpleSearch.SEARCH_PARA_TEKIDATE;
            query = query.replace("{ttlId}", tlId);
            query = query.replace("{paraId}", prId);

            prNode = Util.$getSingleNode(tocXml, query);

            //該当のパラグラフが存在しない場合、ノードを削除する
            if(prNode == null) {
              prList[prIdx].parentNode.removeChild(prList[prIdx]);
              continue;
            }

            //Section.xmlから適用連番を取得し，
            //pub.xmlから取得した連番/年月に対応させて適用年月を取得する
            fromDate = term[Util.$getAttrValue(prNode, "term-id-from")];

            termIdTo = Util.$getAttrValue(prNode, "term-id-to");
            //"term-id-to"属性を持っている場合
            if(termIdTo != "") {
              toDate = term[termIdTo];
            //"term-id-to"属性を持っていない場合，
            //日付に最大値を設定して検索をする
            } else {
              toDate = "999999";
            }

            //適用年月の範囲内に無い要素を削除する
            if(fromDate > Service.SimpleSearch.tekiDate
                || Service.SimpleSearch.tekiDate >= toDate) {
              prList[prIdx].parentNode.removeChild(prList[prIdx]);
            }
          }
          
          //配線図の場合のみ処理を行う
          if("EM" == pubType) {
            
            query = Service.SimpleSearch.SEARCH_TTL_TEKIDATE;
            query = query.replace("{ttlId}", tlId);

            tlNode = Util.$getSingleNode(tocXml, query);

            //該当のタイトルが存在しない場合、ノードを削除する
            if(tlNode == null) {
              tlList[tlIdx].parentNode.removeChild(tlList[tlIdx]);
              continue;
            }
            
            //emlink要素が存在する場合のみ処理を行う
            if(Util.$getNodes(tlList[tlIdx], "./emlink").length != 0) {
              
              //Section.xmlから適用連番を取得し，
              //pub.xmlから取得した連番/年月に対応させて適用年月を取得する
              fromDate = term[Util.$getAttrValue(tlNode, "term-id-from")];

              termIdTo = Util.$getAttrValue(tlNode, "term-id-to");
              //"term-id-to"属性を持っている場合
              if(termIdTo != "") {
                toDate = term[termIdTo];
              //"term-id-to"属性を持っていない場合，
              //日付に最大値を設定して検索をする
              } else {
                toDate = "999999";
              }

              //適用年月の範囲内に無い要素を削除する
              if(fromDate > Service.SimpleSearch.tekiDate
                  || Service.SimpleSearch.tekiDate >= toDate) {
                tlList[tlIdx].parentNode.removeChild(tlList[tlIdx]);
              }
            } else {
              // 子Nodeが全て消えていたら、削除する
              if(Util.$getNodes(tlList[tlIdx], ".//para").length == 0){
                tlList[tlIdx].parentNode.removeChild(tlList[tlIdx]);
              }
            }
          } else {
            // 子Nodeが全て消えていたら、削除する
            if(Util.$getNodes(tlList[tlIdx], ".//para").length == 0){
              tlList[tlIdx].parentNode.removeChild(tlList[tlIdx]);
            }
          }
        }
        // 子Nodeが全て消えていたら、削除する
        if(Util.$getNodes(stList[stIdx], "./ttl").length == 0){
          stList[stIdx].parentNode.removeChild(stList[stIdx]);
        }
      }
      // 子Nodeが全て消えていたら、削除する
      if(Util.$getNodes(scList[scIdx], "./section").length == 0){
        scList[scIdx].parentNode.removeChild(scList[scIdx]);
      }
    }
    return true;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * TOCXML読込処理
 * @param {string} pubType パブタイプ
 * @return {object} 文書構成XML
 */
Service.SimpleSearch.$getTOCXml = function(pubType) {
  var METHODNAME = "Service.SimpleSearch.$getTOCXml";
  try {
    var tocXml = null;
    var url = "";

    //車両型式が存在する場合,XMLを取得する為のパスに車両型式を埋め込む
    if(Service.SimpleSearch.carType != "") {
      carType = Service.SimpleSearch.carType + "-";
    }

    url = Use.Util.$getContentsPath(
        "C_SERVICE_SIMPLESEARCH_TOC_XML_PATH_" + pubType,
        "", "", "");

    Use.Util.$request(
        url,
        false,
        function(res) {
          tocXml = res.responseXML;
        },
        function(res) {},
        true,
        true);
    
    return tocXml;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 簡易検索 キーワード検索処理
 * @param {object} pubNode パブノードオブジェクト
 * @param {string} pubType パブ種別区分
 * @return {object(連想配列)} マニュアル情報リスト
 */
Service.SimpleSearch.$searchKeyword = function(pubNode, pubType) {
  var METHODNAME = "Service.SimpleSearch.$searchKeyword";
  try {
    var keyword = "";
    var arrKeyword = [];
    var query = ".//*[{condition}]";
    var queryForName = ".//para/name[{condition}]";
    var condition = "";
    var searchList = null;
    var name = null;
    var arrName = [];
    var match = false;
    var arrContentsAll = [];
    var score = 0;
    var w = null;
    var s = null;
    var arrKeywordLen = 0;
    var serListLen = 0;
    var arrNameLen = 0;
    var workNode = null;

    //検索文字列を小文字に変換する
    keyword = Service.SimpleSearch.keyword.toLowerCase();
    arrKeyword = keyword.replace("　", " ").split(" ");

    arrKeywordLen = arrKeyword.length;
    //xPath式を作成する
    for(var kwIdx = 0; kwIdx < arrKeywordLen; kwIdx++) {
      //xPath式を作成する
      condition = "contains(translate(@t,\'"
          + Service.SimpleSearch.UPPER_CASE + "\',\'"
          + Service.SimpleSearch.LOWER_CASE + "\'),"
          + Use.Util.$escapeXPathExpr(arrKeyword[kwIdx])
          + ")";
      
      searchList = Util.$getNodes(
          pubNode, query.replace("{condition}", condition));
      
      score = 0;
      serListLen = searchList.length;
      //検索結果一覧の処理
      for(var slIdx = 0; slIdx < serListLen; slIdx++) {
        //前方一致の確認処理
        match = false;
        name = Util.$getAttrValue(searchList[slIdx], "t");
        name = name.toLowerCase();
        arrName = name.replace("　", " ").split(" ");
        arrNameLen = arrName.length;
        //検索対象の文字列を単語毎に比較する
        for(var nmIdx = 0; match == false && nmIdx < arrNameLen;
            nmIdx++) {
          //検索キーワードにヒットした場合
          if(arrName[nmIdx].indexOf(arrKeyword[kwIdx]) == 0) {
            match = true;
          }
        }
        //検索にヒットしなかった場合
        if(match == false) {
          continue;
        }
        Service.SimpleSearch.$setParaNodePoints(searchList[slIdx]);
        //配線図の場合はタイトルに重要度、スコアを付与する
        if("EM" == pubType) {
          Service.SimpleSearch.$setTtlNodePoints(searchList[slIdx]);
        }
      }

      //para/mame の処理
      condition = "";
      //xPath式を作成する
      condition = "contains(translate(./text(),\'"
          + Service.SimpleSearch.UPPER_CASE + "\',\'"
          + Service.SimpleSearch.LOWER_CASE + "\'),"
          + Use.Util.$escapeXPathExpr(arrKeyword[kwIdx])
          + ")";
      
      searchList = Util.$getNodes(pubNode,
          queryForName.replace("{condition}", condition));

      serListLen = searchList.length;
      //para/mame の検索語の重要度，スコアの処理
      for(var slIdx = 0; slIdx < serListLen; slIdx++) {
        //前方一致の確認処理
        match = false;
        name = Util.$getNodeText(searchList[slIdx]);
        name = name.toLowerCase();
        arrName = name.replace("　", " ").split(" ");
        arrNameLen = arrName.length;
        //検索対象の文字列を単語毎に比較する
        for(var nmIdx = 0; match == false && nmIdx < arrNameLen;
            nmIdx++) {
          //検索キーワードにヒットした場合
          if(arrName[nmIdx].indexOf(arrKeyword[kwIdx]) == 0) {
            match = true;
          }
        }
        //検索にヒットしなかった場合
        if(match == false) {
          continue;
        }
        Service.SimpleSearch.$setParaNodePoints(searchList[slIdx]);
        //配線図の場合はタイトルに重要度、スコアを付与する
        if("EM" == pubType) {
          Service.SimpleSearch.$setTtlNodePoints(searchList[slIdx]);
        }
      }
      
      //検索にヒットしないパラグラフの削除処理
      searchList = Util.$getNodes(pubNode, ".//para");
      serListLen = searchList.length;
      //重要度，スコアの付いていないparaを削除する
      for(var slIdx = 0; slIdx < serListLen; slIdx++) {
        w = Util.$getAttrValue(searchList[slIdx], "w");
        s = Util.$getAttrValue(searchList[slIdx], "s");
        //重要度，スコアの付いていないparaを削除する
        if(w == "" || w == "0" || s == "" || s == "0") {
          searchList[slIdx].parentNode.removeChild(searchList[slIdx]);
        //ソート用の重要度、スコアを設定する
        }else{
          Service.SimpleSearch.$calcNodeSortPoints(searchList[slIdx], 
              w, s);
          //重要度、スコア属性を削除する
          searchList[slIdx].removeAttribute("w");
          searchList[slIdx].removeAttribute("s");
        }
      }
      //検索にヒットしないタイトルの削除処理
      if("EM" == pubType) {
        //配線図の場合のみ処理を行う
        searchList = Util.$getNodes(pubNode, ".//ttl");
        serListLen = searchList.length;
        //重要度，スコアの付いていないttlを削除する
        for(var slIdx = 0; slIdx < serListLen; slIdx++) {
          //emlink要素が存在する場合のみ処理を行う
          if(Util.$getNodes(searchList[slIdx], "./emlink").length == 0) {
            continue;
          }
          w = Util.$getAttrValue(searchList[slIdx], "w");
          s = Util.$getAttrValue(searchList[slIdx], "s");
          //重要度，スコアの付いていないttlを削除する
          if(w == "" || w == "0" || s == "" || s == "0") {
            searchList[slIdx].parentNode.removeChild(searchList[slIdx]);
          //ソート用の重要度、スコアを設定する
          }else{
            Service.SimpleSearch.$calcNodeSortPoints(searchList[slIdx], 
                w, s);
            //重要度、スコア属性を削除する
            searchList[slIdx].removeAttribute("w");
            searchList[slIdx].removeAttribute("s");
          }
        }
      }
    }
    
    //タイトルの検索結果を作成する
    if("EM" == pubType) {
      //配線図の場合のみ処理を行う
      searchList = Util.$getNodes(pubNode, ".//ttl");
      serListLen = searchList.length;
      for(var slIdx = 0; slIdx < serListLen; slIdx++) {
        // emlink要素がない場合は対象外
        if(Util.$getNodes(searchList[slIdx], "./emlink").length == 0) {
          continue;
        }
        arrContentsAll.push(
            Service.SimpleSearch.$makeTtlContent(
                searchList[slIdx], pubType, slIdx));
      }
    }
    
    //パラグラフの検索結果を作成する
    searchList = Util.$getNodes(pubNode, ".//para");
    serListLen = searchList.length;
    for(var slIdx = 0; slIdx < serListLen; slIdx++) {
      workNode = searchList[slIdx].parentNode;
      // 親要素がttlで、かつttlの子要素にemlinkがある場合は対象外
      if(workNode.tagName == "ttl"
          && Util.$getNodes(workNode, "./emlink").length >= 1) {
        continue;
      }
      arrContentsAll.push(
          Service.SimpleSearch.$makeParaContent(
              searchList[slIdx], pubType, slIdx));
    }
    
    return arrContentsAll;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * パラグラフの重要度/スコア設定処理
 * @param {object} node 検索されたノード
 */
Service.SimpleSearch.$setParaNodePoints = function(node) {
  var METHODNAME = "Service.SimpleSearch.$setParaNodePoints";
  try {
    var tagName = null;
    var prList = null;
    var prListLen = 0;

    tagName = node.tagName;
    //タグ名が"servcat"の場合
    if(tagName == "servcat") {
      prList = Util.$getNodes(node, ".//para");
      prListLen = prList.length;
      //サービスカテゴリの検索語の重要度，スコアの処理
      for(var prIdx = 0; prIdx < prListLen; prIdx++) {
        Service.SimpleSearch.$calcNodePoints(prList[prIdx], "1", "1");
      }
    //タグ名が"section"の場合
    } else if(tagName == "section") {
      prList = Util.$getNodes(node, ".//para");
      prListLen = prList.length;
      //セクションの検索語の重要度，スコアの処理
      for(var prIdx = 0; prIdx < prListLen; prIdx++) {
        Service.SimpleSearch.$calcNodePoints(prList[prIdx], "2", "2");
      }
    //タグ名が"ttl"の場合
    } else if(tagName == "ttl") {
      prList = Util.$getNodes(node, ".//para");
      prListLen = prList.length;
      //タイトルの検索語の重要度，スコアの処理
      for(var prIdx = 0; prIdx < prListLen; prIdx++) {
        Service.SimpleSearch.$calcNodePoints(prList[prIdx], "3", "4");
      }
    //タグ名が"ncf-para"の場合
    } else if(tagName == "ncf-para") {
      prList = Util.$getNodes(node, ".//para");
      prListLen = prList.length;
      //タイトルの検索語の重要度，スコアの処理
      for(var prIdx = 0; prIdx < prListLen; prIdx++) {
        Service.SimpleSearch.$calcNodePoints(prList[prIdx], "3", "4");
      }
    //パラグラフ名称の検索語の重要度，スコアの処理
    } else if(tagName == "name") {
      Service.SimpleSearch.$calcNodePoints(node.parentNode, "4", "8");
    //パーツの検索語の重要度，スコアの処理
    } else if(tagName == "parts") {
      Service.SimpleSearch.$calcNodePoints(node.parentNode, "4", "8");
    //手順の検索語の重要度，スコアの処理
    } else if(tagName == "p") {
      Service.SimpleSearch.$calcNodePoints(node.parentNode, "5", "16");
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * タイトルの重要度/スコア設定処理
 * @param {object} node 検索されたノード
 */
Service.SimpleSearch.$setTtlNodePoints = function(node) {
  var METHODNAME = "Service.SimpleSearch.$setTtlNodePoints";
  try {
    var tagName = null;
    var tlList = null;
    var tlListLen = 0;
    var workNode = null;

    tagName = node.tagName;
    //タグ名が"servcat"の場合
    if(tagName == "servcat") {
      tlList = Util.$getNodes(node, "./section/ttl");
      tlListLen = tlList.length;
      //サービスカテゴリの検索語の重要度，スコアの処理
      for(var tlIdx = 0; tlIdx < tlListLen; tlIdx++) {
        //emlink要素が存在する場合のみ処理を行う
        if(Util.$getNodes(tlList[tlIdx], "./emlink").length != 0) {
          Service.SimpleSearch.$calcNodePoints(tlList[tlIdx], "1", "1");
        }
      }
    //タグ名が"section"の場合
    } else if(tagName == "section") {
      tlList = Util.$getNodes(node, "./ttl");
      tlListLen = tlList.length;
      //セクションの検索語の重要度，スコアの処理
      for(var tlIdx = 0; tlIdx < tlListLen; tlIdx++) {
        //emlink要素が存在する場合のみ処理を行う
        if(Util.$getNodes(tlList[tlIdx], "./emlink").length != 0) {
          Service.SimpleSearch.$calcNodePoints(tlList[tlIdx], "2", "2");
        }
      }
    //タグ名が"ttl"の場合
    } else if(tagName == "ttl") {
      //タイトルの検索語の重要度，スコアの処理
      //emlink要素が存在する場合のみ処理を行う
      if(Util.$getNodes(node, "./emlink").length != 0) {
        Service.SimpleSearch.$calcNodePoints(node, "3", "4");
      }
    //パラグラフ名称の検索語の重要度，スコアの処理
    } else if(tagName == "name") {
      workNode = node.parentNode.parentNode;
      // 親の親がttlで、かつttlの子要素にemlinkがある場合のみ
      // ttlに重要度/スコアを設定
      if(workNode.tagName == "ttl" 
          && Util.$getNodes(workNode, "./emlink").length != 0) {
        Service.SimpleSearch.$calcNodePoints(workNode, "4", "8");
      }
    //パーツの検索語の重要度，スコアの処理
    } else if(tagName == "parts") {
      workNode = node.parentNode.parentNode;
      // 親の親がttlで、かつttlの子要素にemlinkがある場合のみ
      // ttlに重要度/スコアを設定
      if(workNode.tagName == "ttl" 
          && Util.$getNodes(workNode, "./emlink").length != 0) {
        Service.SimpleSearch.$calcNodePoints(workNode, "4", "8");
      }
    //手順の検索語の重要度，スコアの処理
    } else if(tagName == "p") {
      workNode = node.parentNode.parentNode;
      // 親の親がttlで、かつttlの子要素にemlinkがある場合のみ
      // ttlに重要度/スコアを設定
      if(workNode.tagName == "ttl" 
          && Util.$getNodes(workNode, "./emlink").length != 0) {
        Service.SimpleSearch.$calcNodePoints(workNode, "5", "16");
      }
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 重要度/スコアの計算処理
 * @param {object} node DOM要素
 * @param {string} w 重要度
 * @param {string} s スコア
 */
Service.SimpleSearch.$calcNodePoints = function(node, w, s) {
  var METHODNAME = "Service.SimpleSearch.$calcNodePoints";
  try {
    var score = 0;
    var weight = 0;
    //既に重要度が設定されている場合は値を比較する
    if(Util.$getAttrValue(node, "w") != "") {
      weight = parseInt(Util.$getAttrValue(node, "w"), 10);
      //より高い値を重要度に設定する
      if(weight < parseInt(w, 10)){
        Util.$setAttrValue(node, "w", w);
      }
    //重要度属性を追加する
    } else {
      Util.$setAttrValue(node, "w", w);
    }
    //既にスコアが設定されている場合は値を足す
    if(Util.$getAttrValue(node, "s") != "") {
      score = parseInt(Util.$getAttrValue(node, "s"), 10);
      score += parseInt(s, 10);
      Util.$setAttrValue(node, "s", score.toString());
    //スコア属性を追加する
    } else {
      Util.$setAttrValue(node, "s", s);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ソート用の重要度/スコアの計算処理
 * @param {object} node DOM要素
 * @param {string} w 重要度
 * @param {string} s スコア
 */
Service.SimpleSearch.$calcNodeSortPoints = function(node, w, s) {
  var METHODNAME = "Service.SimpleSearch.$calcNodeSortPoints";
  try {
    var score = 0;
    var weight = 0;
    //既にソート用重要度が設定されている場合は値を比較する
    if(Util.$getAttrValue(node, "wSort") != "") {
      weight = parseInt(Util.$getAttrValue(node, "wSort"), 10);
      //より高い値をソート用重要度に設定する
      if(weight < parseInt(w, 10)){
        Util.$setAttrValue(node, "wSort", w);
      }
    //ソート用重要度属性を追加する
    } else {
      Util.$setAttrValue(node, "wSort", w);
    }
    //既にソート用スコアが設定されている場合は値を足す
    if(Util.$getAttrValue(node, "sSort") != "") {
      score = parseInt(Util.$getAttrValue(node, "sSort"), 10);
      score += parseInt(s, 10);
      Util.$setAttrValue(node, "sSort", score.toString());
    //ソート用スコア属性を追加する
    } else {
      Util.$setAttrValue(node, "sSort", s);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * パラグラフのコンテンツ情報を作成
 * @param {object} prNode パラグラフ要素
 * @param {string} pubType パブタイプ
 * @param {string} sId 検索結果連番
 * @return {object(連想配列)} コンテンツ情報
 */
Service.SimpleSearch.$makeParaContent = function(prNode, pubType, sId) {
  var METHODNAME = "Service.SimpleSearch.$makeParaContent";
  try {
    var id = sId.toString();
    var category = Util.$getAttrValue(prNode, "category");
    var type = "10";
    var disptitle = "";
    var linkkey = "";
    var w = Util.$getAttrValue(prNode, "wSort");
    var s = Util.$getAttrValue(prNode, "sSort");
    var node = null;

    var nameList = Util.$getNodes(prNode, "./name");
    var nameListLen = nameList.length;
    //画面表示情報の作成
    for(var nmIdx = 0; nmIdx < nameListLen; nmIdx++) {
      //画面表示情報の作成
      if(disptitle != "") {
        disptitle = disptitle + "&middot;";
      }
      disptitle = disptitle + Util.$getNodeText(nameList[nmIdx]);
      //修理書且つカテゴリ"C"以外の場合は，パラグラフ名称は単数個
      if(pubType != "RM" || category != "C") {
        break;
      }
    }
    node = prNode.parentNode;
    //画面表示情報 解説書の場合
    if(node.tagName == "ncf-para") {
      disptitle = Util.$getAttrValue(
          node, "t") + "&nbsp;&gt;&nbsp;" + disptitle;
      node = node.parentNode;
    }
    //修理書，解説書の処理
    disptitle = Util.$getAttrValue(
        node, "t") + "&nbsp;&gt;&nbsp;" + disptitle;
    node = node.parentNode;
    disptitle = Util.$getAttrValue(
        node, "t") + "&nbsp;&gt;&nbsp;" + disptitle;
    node = node.parentNode;
    disptitle = Util.$getAttrValue(
        node, "t") + "&nbsp;&gt;&nbsp;" + disptitle;

    //配線図以外の場合の処理
    if(pubType != "EM") {
      //画面遷移情報の修理書且つカテゴリ"C"以外の場合は，パラグラフ名称は単数個
      if(pubType == "RM" && category == "C") {
        //パラグラフ名称を取得
        if(nameList.length > 0) {
          linkkey = Util.$getNodeText(nameList[0]);
        }
      }
      node = prNode;
      if(pubType == "RM") {
          linkkey = "," + linkkey;
      }
      linkkey = Util.$getAttrValue(node, "id") + linkkey;
      node = node.parentNode;
      //画面遷移情報，解説書の場合
      if(pubType == "NM") {
          if(node.tagName == "ncf-para") {
              linkkey = Util.$getAttrValue(node, "ncf-para-category") + "," + linkkey;
              node = node.parentNode;
          } else {
              linkkey = "," + linkkey;
          }
      }
      //修理書，解説書の処理
      linkkey = Util.$getAttrValue(node, "id") + "," + linkkey;
      node = node.parentNode;
      linkkey = Util.$getAttrValue(node, "id") + "," + linkkey;
      node = node.parentNode;
      linkkey = Util.$getAttrValue(node, "id") + "," + linkkey;
    //配線図の場合の処理
    } else {
      node = Util.$getSingleNode(prNode, "./emlink");
      linkkey = Util.$getAttrValue(node, "code");
    }

    return {
      id:        id,
      category:  category,
      type:      type,
      disptitle: disptitle,
      linkkey:   linkkey,
      w:         w,
      s:         s
    };
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * タイトルのコンテンツ情報を作成
 * @param {object} tlNode タイトル要素
 * @param {string} pubType パブタイプ
 * @param {string} sId 検索結果連番
 * @return {object(連想配列)} コンテンツ情報
 */
Service.SimpleSearch.$makeTtlContent = function(tlNode, pubType, sId) {
  var METHODNAME = "Service.SimpleSearch.$makeTtlContent";
  try {
    var id = sId.toString();
    var category = "";
    var type = "10";
    var disptitle = "";
    var linkkey = "";
    var w = Util.$getAttrValue(tlNode, "wSort");
    var s = Util.$getAttrValue(tlNode, "sSort");
    var node = null;
    var stName = "";

    //画面表示情報の作成
    disptitle = Util.$getAttrValue(tlNode, "t");
    node = tlNode.parentNode;
    stName = Util.$getAttrValue(node, "t");
    if("" != stName) {
      disptitle = stName + "&nbsp;&gt;&nbsp;" + disptitle;
    } else {
      disptitle = "&gt;&nbsp;" + disptitle;
    }
    node = node.parentNode;
    disptitle = Util.$getAttrValue(
        node, "t") + "&nbsp;&gt;&nbsp;" + disptitle;
    
    //画面遷移情報の作成
    node = Util.$getSingleNode(tlNode, "./emlink");
    linkkey = Util.$getAttrValue(node, "code");

    return {
      id:        id,
      category:  category,
      type:      type,
      disptitle: disptitle,
      linkkey:   linkkey,
      w:         w,
      s:         s
    };
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 抽出処理（検索結果から1ページ分を抽出）
 * @param {string} pubType パブタイプ
 * @param {object[]} arrContentsAll 検索結果
 */
Service.SimpleSearch.$getResultOnePage = function(pubType, arrContentsAll) {
  var METHODNAME = "Service.SimpleSearch.$getResultOnePage";
  try {
    var manual = {};
    var min = 0;
    var max = 0;
    var arrContents = [];
    var arrContentsLen = 0;
    //検索結果をソートする
    var comparator = function(contents1, contents2) {
      var w1 = parseInt(contents1["w"], 10);
      var s1 = parseInt(contents1["s"], 10);
      var w2 = parseInt(contents2["w"], 10);
      var s2 = parseInt(contents2["s"], 10);
      if(w1 != w2) {
        return(w2 - w1);
      }
      return(s2 - s1);
    }
    arrContentsAll.sort(comparator);
    
    //検索結果が有る場合
    if(arrContentsAll.length > 0) {
      min = parseInt(Service.SimpleSearch.position, 10);
      max = min + parseInt(Service.SimpleSearch.number, 10) - 1;
      //検索結果の件数が最大件数より少ない場合、最大件数を再設定する
      if(max > arrContentsAll.length) {
        max = arrContentsAll.length;
      }
    }
    //検索結果から取得分を抽出する
    arrContents = arrContentsAll.slice(min - 1, max);
    
    //検索順位を再設定する
    arrContentsLen = arrContents.length;
    for(var acIdx = 0; acIdx < arrContentsLen; acIdx++) {
      arrContents[acIdx]["id"] = min + acIdx;
    }
    
    manual["id"] = DictConst.C_SERVICE_MANUAL_TYPE[pubType];
    manual["position"] = min.toString();
    manual["number"] = (max - min + 1).toString();
    manual["cnt"] = arrContentsAll.length;
    manual["contents"] = arrContents;
    return manual;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 簡易検索 品名コード検索処理
 * @param {object} pubNode パブノードオブジェクト
 * @param {string} pubType パブタイプ
 * @return {object(連想配列)} マニュアル情報リスト
 */
Service.SimpleSearch.$searchPartsCD = function(pubNode, pubType) {
  var METHODNAME = "Service.SimpleSearch.$searchPartsCD";
  try {
    var query = ".//para[./parts[@parts-id='{parts-id}']]";
    var condition = "";
    var searchList = null;
    var arrContentsAll = [];
    var serListLen = 0;
    var workNode = null;

    searchList = Util.$getNodes(
        pubNode, query.replace("{parts-id}", Service.SimpleSearch.partsCD));

    serListLen = searchList.length;
    //パーツの検索語の重要度，スコアの処理
    for(var slIdx = 0; slIdx < serListLen; slIdx++) {
      workNode = searchList[slIdx].parentNode;
      // 親要素がttlで、かつttl要素にemlink要素がある場合は、
      // ttl要素に重要度/スコアの計算をする
      if(workNode.tagName == "ttl"
          && Util.$getNodes(workNode, "./emlink").length >= 1) {
        Service.SimpleSearch.$calcNodePoints(workNode, "4", "8");
      } else {
        Service.SimpleSearch.$calcNodePoints(searchList[slIdx], "4", "8");
      }
    }

    searchList = Util.$getNodes(pubNode, ".//para");
    serListLen = searchList.length;
    //重要度，スコアの付いていないparaを削除する
    for(var slIdx = 0; slIdx < serListLen; slIdx++) {
      w = Util.$getAttrValue(searchList[slIdx], "w");
      s = Util.$getAttrValue(searchList[slIdx], "s");
      //重要度，スコアの付いていないparaを削除する
      if(w == "" || w == "0" || s == "" || s == "0") {
        searchList[slIdx].parentNode.removeChild(searchList[slIdx]);
      //ソート用の重要度、スコアを設定する
      }else{
        Service.SimpleSearch.$calcNodeSortPoints(searchList[slIdx], 
            w, s);
        //重要度、スコア属性を削除する
        searchList[slIdx].removeAttribute("w");
        searchList[slIdx].removeAttribute("s");
      }
    }

    //検索にヒットしないタイトルの削除処理
    if("EM" == pubType) {
      searchList = Util.$getNodes(pubNode, ".//ttl");
      serListLen = searchList.length;
      //重要度，スコアの付いていないttlを削除する
      for(var slIdx = 0; slIdx < serListLen; slIdx++) {
        //emlink要素が存在する場合のみ処理を行う
        if(Util.$getNodes(searchList[slIdx], "./emlink").length == 0) {
          continue;
        }
        w = Util.$getAttrValue(searchList[slIdx], "w");
        s = Util.$getAttrValue(searchList[slIdx], "s");
        //重要度，スコアの付いていないttlを削除する
        if(w == "" || w == "0" || s == "" || s == "0") {
          searchList[slIdx].parentNode.removeChild(searchList[slIdx]);
        //ソート用の重要度、スコアを設定する
        }else{
          Service.SimpleSearch.$calcNodeSortPoints(searchList[slIdx], 
              w, s);
          //重要度、スコア属性を削除する
          searchList[slIdx].removeAttribute("w");
          searchList[slIdx].removeAttribute("s");
        }
      }
    }

    //タイトルの検索結果を作成する
    if("EM" == pubType) {
      searchList = Util.$getNodes(pubNode, ".//ttl");
      serListLen = searchList.length;
      for(var slIdx = 0; slIdx < serListLen; slIdx++) {
        // emlink要素がない場合は対象外
        if(Util.$getNodes(searchList[slIdx], "./emlink").length == 0) {
          continue;
        }
        arrContentsAll.push(
            Service.SimpleSearch.$makeTtlContent(
                searchList[slIdx], pubType, slIdx));
      }
    }

    searchList = Util.$getNodes(pubNode, ".//para");
    serListLen = searchList.length;
    for(var slIdx = 0; slIdx < serListLen; slIdx++) {
      workNode = searchList[slIdx].parentNode;
      // 親要素がttlで、かつttlの子要素にemlinkがある場合は対象外
      if(workNode.tagName == "ttl"
          && Util.$getNodes(workNode, "./emlink").length >= 1) {
        continue;
      }
      arrContentsAll.push(
          Service.SimpleSearch.$makeParaContent(
              searchList[slIdx], pubType, slIdx));
    }
    
    return arrContentsAll;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * テキスト検索XML読込処理の失敗時処理
 * @param {Response} res XMLのDOM情報
 */
Service.SimpleSearch.$getSearchOnFailure = function(res) {
  var METHODNAME = "Service.SimpleSearch.$getSearchOnFailure";
  try {
    var result = {};
    result["status"] = "1";
    result["keyword"] = "";
    result["manual"] = [];
    Service.SimpleSearch.$result(result);
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};
