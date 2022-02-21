/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2012/12/13 */

/**
 * file common.js<br />
 *
 * @fileoverview このファイルには、指示文字についての処理が<br />
 * 定義されています。<br />
 * file-> common.js
 * @author 今村
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2012/09/19|1.0.0|今村|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2012/09/19 今村 ・新規作成
 *---------------------------------------------------------------------------*/
/**
 * コンテンツ内ユーティリティクラス
 * @namespace コンテンツ内ユーティリティクラス
 */
var Common = {};

/**
 * 指示文字クラス
 * @namespace 指示文字クラス
 */
Common.Indicator = {};

/**
 * 横線・縦線画像ファイルの固定パス情報（水平）
 * @type string
 */
Common.Indicator.CONST_PATH_H = "";

/**
 * 横線・縦線画像ファイルの固定パス情報（垂直）
 * @type string
 */
Common.Indicator.CONST_PATH_V = "";

/**
 * 画像ファイルの固定パス情報
 * @type string
 */
Common.Indicator.CONST_IMG_PATH = "";

/**
 * サイズの規定値
 * @type number
 */
Common.Indicator.CONST_SIZE = 2;

/**
 * 指示文字の描画処理
 */
Common.Indicator.$render = function() {
  var METHODNAME = "Common.Indicator.$render";
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
        Common.Indicator.$createRect(indiPar, indiEle);
        // 線描画処理の実行
        Common.Indicator.$createLine(indiPar, indiEle);
        // 文字描画処理の実行
        Common.Indicator.$createCapt(indiPar, indiEle);
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
Common.Indicator.$createLine = function(parent, indiEle) {
  var METHODNAME = "Common.Indicator.$createLine";
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
      Common.Indicator.CONST_PATH_H = edgeFlg ?
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_H") :
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_DEFAULT_PATH");
      Common.Indicator.CONST_PATH_V = edgeFlg ?
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_V") :
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_DEFAULT_PATH");
      
      // 白抜きの判定がtrueの場合は白抜き用パスを、falseの場合は
      // 通常画像用パスを使用する
      Common.Indicator.CONST_IMG_PATH = edgeFlg ?
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_LINE_WEDGE_PATH") :
          Use.Util.$getContentsPath("C_CONTENTS_INDICATE_LINE_PATH");
      
      // 線エレメント内の座標を元に、線描画を行う
      Common.Indicator.$insertLine(parent, lineEls[lineIdx]);
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
Common.Indicator.$insertLine = function(parent, lineEle) {
  var METHODNAME = "Common.Indicator.$insertLine";
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
      pointEle = Common.Indicator.$pointSplit(pointEls[pointIdx]);
      
      // 収集した情報のうち、幅が2px以下の場合は書き換える
      if(pointEle.w <= Common.Indicator.CONST_SIZE) {
        pointEle.w = Common.Indicator.CONST_SIZE;
        // 白抜きありの場合、白抜き分の幅と座標xを補正する
        if(edgeFlg) {
          pointEle.w = pointEle.w + 2;
          pointEle.x1 -= 1;
        }
        pointEle.src = Common.Indicator.CONST_PATH_V;
      // 収集した情報のうち、高さが2px以下の場合は書き換える
      } else if(pointEle.h <= Common.Indicator.CONST_SIZE) {
        pointEle.h = Common.Indicator.CONST_SIZE;
        // 白抜きありの場合、白抜き分の高さと座標yを補正する
        if(edgeFlg) {
          pointEle.h = pointEle.h + 2;
          pointEle.y1 -= 1;
        }
        pointEle.src = Common.Indicator.CONST_PATH_H;
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
        
        pointEle.src = Common.Indicator.CONST_IMG_PATH;
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
Common.Indicator.$createRect = function(parent, indiEle) {
  var METHODNAME = "Common.Indicator.$createRect";
  try {
    
    var rectEls = Util.Selector.$select(".rectangle", indiEle);
    var rectLen = rectEls.length;
    
    // 枠エレメント数分だけループ処理を行う
    for(var rectIdx = 0; rectIdx < rectLen; rectIdx++) {
      // 枠エレメント内の座標を元に、枠描画を行う
      Common.Indicator.$insertRect(parent, rectEls[rectIdx]);
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
Common.Indicator.$insertRect = function(parent, rectEle) {
  var METHODNAME = "Common.Indicator.$insertRect";
  try {
    
    var pointEls = Util.Selector.$select(".points", rectEle);
    var pointLen = pointEls.length;
    var pointEle = {};
    var newRect  = null;
    
    // 座標エレメント数分だけループ処理を行う
    for(var pointIdx = 0; pointIdx < pointLen; pointIdx++) {
      // 対象エレメント内に定義されている情報の収集処理
      pointEle = Common.Indicator.$pointSplit(pointEls[pointIdx]);
      
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
Common.Indicator.$createCapt = function(parent, indiEle) {
  var METHODNAME = "Common.Indicator.$createCapt";
  try {
    
    var captEls = Util.Selector.$select(".caption", indiEle);
    var captLen = captEls.length;
    
    // 文言エレメント数分だけループ処理を行う
    for(var captIdx = 0; captIdx < captLen; captIdx++) {
      // 文言エレメント内の座標を元に、枠描画を行う
      Common.Indicator.$insertCapt(parent, captEls[captIdx]);
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
Common.Indicator.$insertCapt = function(parent, captEle) {
  var METHODNAME = "Common.Indicator.$insertCapt";
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
      pointEle = Common.Indicator.$pointSplit(pointEls[pointIdx]);
      
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
        fontSize = fontSize.innerHTML.replace(" ", "");
        newStyle += "font-size:" +  +fontSize + "pt;";
        newStyle += "line-height:" + fontSize + "pt;";
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
Common.Indicator.$pointSplit = function(ele) {
  var METHODNAME = "Common.Indicator.$pointSplit";
  try {
    
    var point = { x1: 0, x2: 0, y1: 0, y2: 0, w: 0, h: 0, angle: 0, src: "" };
    var pEle = ele.innerHTML.split(" ");
    var stEle = pEle[0].split(",");
    var edEle = pEle[1].split(",");
    var angle = 0;
    var work  = 0;
    
    point.x1 = Common.Indicator.$convertInchToPixel(
        parseFloat(stEle[0])) - 1;
    point.y1 = Common.Indicator.$convertInchToPixel(
        parseFloat(stEle[1])) - 1;
    point.x2 = Common.Indicator.$convertInchToPixel(
        parseFloat(edEle[0])) - 1;
    point.y2 = Common.Indicator.$convertInchToPixel(
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
Common.Indicator.$convertInchToPixel = function(num) {
  var METHODNAME = "Common.Indicator.$convertInchToPixel";
  try {
    
    var ret = 0;
    ret = Math.round(num * 96);
    return ret;
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
}
