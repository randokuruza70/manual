/*!----------------------------------------------------------------------------
 * Copyright(c) 2012 TOYOTA MOTOR CORPORATION. All right reserved.
 * Last Update: 2013/08/19
 *
 * ---------------------------------------------------------------------------
 * This code contains some parts of Prototype and Sizzle with modification.
 * These licenses are as shown below.
 *
 * ---------------------------------------------------------------------------
 * Prototype JavaScript is Copyright (c) 2005-2009 Sam Stephenson. 
 * It is freely distributable under the terms of an MIT-style license.
 *
 * Copyright (c) 2005-2009 Sam Stephenson
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 * THE SOFTWARE. 
 *
 * For details, see the Prototype web site: http://www.prototypejs.org/
 *
 * ---------------------------------------------------------------------------
 * Sizzle is released under three licenses: MIT, BSD, and GPL. 
 * You may pick the license that best suits your development needs. 
 * The text of all three licenses are provided below.
 *
 * MIT License
 * Copyright (c) 2009 John Resig
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * More information: http://sizzlejs.com/
 *
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * アプリインフラ　共通Javascript
 * 更新履歴
 * 2010/08/09 X.Xxxxxxxx      ・新規作成
 * 2010/09/30 T.Seino         ・見直し、コメント追加
 *                            ・select(複数選択)の$setValueで、
 *                              指定値が配列の場合の要素存在チェックを修正
 *                            ・select(複数選択)のclear処理を修正
 * 2010/10/01 T.Seino         ・$toQueryParamsで同じパラメータがある場合、
 *                              2つ目のパラメータ値の格納漏れを修正
 * 2010/10/05 T.Seino         ・$removeEventListenerが動作しない障害を修正
 *                            ・$findで合致しない場合、
 *                              明示的にnullを返すように修正
 * 2010/10/06 T.Seino         ・Stringにcapitalizeメソッドを追加
 *                            ・$hasAttributeでID指定(String)可能に修正
 *                            ・$createXMLでnamespaceを削除するように変更
 *                            ・$isParseErrorでGCのパースエラーに対応
 *                              及びエラーがある場合にtrueを返すように修正
 *                            ・$serializeXMLで例外発生時、及びサポート外は
 *                              空文字を返すように変更
 *                            ・$loadXMLで例外発生時、及びXMLパースエラー時は
 *                              nullを返すように変更
 *                            ・$parseXMLでXMLパースエラー時は
 *                              nullを返すように変更
 *                            ・Util.XPathExpコンストラクタでXPathEvaluatorから
 *                              XPathExpression生成するように変更
 * 2010/10/06 T.Seino         ・$setStyleでopacity使用時の障害を修正
 *                            ・$setOpacityで指定値が異常な場合にsetしない
 *                            ・Stringのstripで全角スペースを変換対象とする
 *                              blankも同様に全角スペースを判定対象とする
 * 2010/10/06 T.Ando          ・Faceboxの利用BLK要件より機能見直し変更
 * 2010/10/08 T.Seino         ・RequestでGET送信の場合にパラメータが
 *                              送信されない障害を修正
 * 2010/10/13 T.Seino         ・$focusの戻り値をDOM要素に変更
 *                            ・ResponseでIEで再パース(parseXML)する場合、
 *                              例外発生する場合がある為、例外隠蔽し、
 *                              responseXMLにnullを返すように対応
 *                            ・$isParseError内の条件判定の順番を修正
 * 2010/10/14 T.Seino         ・$clearでselect(単一)のブラウザ毎動作を統一
 * 2010/10/19 Y.Shibata       ・コメントヘッダー部を一部変更
 * 2010/11/26 T.Seino         ・XML Nodeテキスト、及び属性操作関数追加
 *                            ・window表示関数追加
 *                            ・Facebox表示時及びclose時にtabIndex制御する
 *                            ・RequestにResponse結果を内包するように変更
 *                            ・linkタグを削除する関数を追加
 * 2010/11/29 T.Seino         ・イベント発行する関数を追加
 * 2010/12/07 T.Seino         ・Faceboxのイメージ読み込み処理を変更
 *                            ・Faceboxのrevealに第４引数(title)追加
 * 2010/12/09 T.Seino         ・FaceboxのESCキーイベント登録/削除を修正
 * 2010/12/22 T.Seino         ・Faceboxの表示位置を調整
 * 2011/02/10 清水            ・ACT0001:初期化時の例外ハンドラ機能追加
 * 2011/02/10 清水            ・ACT0002:ローカルモードフラグ追加
 * 2011/02/10 清水            ・ACT0003:リクエストのエラー処理追加
 * 2011/02/16 清水            ・ACT0004:XMLファイル以外はXML解析をしない
 * 2011/02/28 安藤            ・ACT0005:ウィンドウ描画領域取得関数追加
 * 2011/03/03 清水            ・ACT0006:nextElementSibling,
 *                              previousElementSibling拡張
 * 2011/03/03 清水            ・ACT0007:Facebox内タグのid一括書換機能追加
 * 2011/03/07 清水            ・ACT0008:iframe生成共通インタフェース追加
 * 2011/03/08 清水            ・ACT0009:Faceboxの×ボタンのalt,title多言語対応
 * 2011/03/09 清水            ・ACT0010:Faceboxの中にformがない場合
 *                              formを被せる
 * 2011/03/15 清水            ・ACT0011:アンカージャンプ共通インタフェース追加
 * 2011/03/22 清水            ・ACT0012:Util.$showで引数追加
 * 2011/03/23 清水            ・ACT0013:Array.prototype.indexOf追加
 * 2011/03/24 清水            ・ACT0014:「ture」のつづり修正
 * 2011/03/25 清水            ・ACT0015:Util.$getNodesのソート機能対応（IE6）
 * 2011/03/25 清水            ・ACT0016:キーコード取得共通化
 * 2011/03/28 清水            ・ACT0017:プラグインチェック関数追加
 * 2011/04/01 清水            ・ACT0018:windowクローズ関数追加
 * 2011/04/08 清水            ・ACT0019:Faceboxでiframeにフォーカスが
 *                              行く問題の対策
 * 2011/04/11 清水            ・ACT0020:右クリック抑止機能追加
 * 2011/04/12 Y.Shibata       ・CSSセレクタ機能の統合
 * 2011/04/13 清水            ・ACT0021:マウスのoffsetX,Y取得機能追加
 * 2011/04/13 清水            ・ACT0022:画面抑止、解除機能追加
 * 2011/04/20 清水            ・ACT0023:Faceboxのcss・画像ファイルの配置変更
 * 2011/04/25 清水            ・ACT0024:ショートカット抑止機能追加
 * 2011/05/10 清水            ・ACT0025:faceboxの「X」アイコン押下で
 *                              固有のクローズ処理を登録するインタフェース追加
 * 2011/05/10 清水            ・ACT0026:openURLのウィンドウサイズの
 *                              マルチブラウザ対応
 * 2011/05/11 清水            ・ACT0027:IEの分岐をIE6かそれ以外に変更
 * 2011/05/13 清水            ・ACT0028:iframeのスクロール制御機能追加
 * 2011/05/13 清水            ・ACT0029:IE6用のresize機能対応
 * 2011/06/10 清水            ・ACT0030:IEでDTDのエラーになる件の対応
 * 2011/06/14 清水            ・ACT0031:Google Chromeで
 *                              window.print時にresizeイベントが発生して
 *                              不正なwindowサイズが取得される問題の対策
 * 2011/06/15 清水            ・ACT0032:画面抑止の性能改善（Facebox含む）
 *                              （tabIndex制御廃止）
 * 2011/06/17 清水            ・ACT0033:FireFoxのembedタグの拡張で
 *                              セキュリティエラーになる対策
 * 2011/06/23 清水            ・ACT0034:$init処理中にalertを出すと
 *                              画面構築途中のままダイアログ表示してしまう
 *                              問題の対策。DomReady.$addを公開する。
 * 2011/06/28 清水            ・ACT0035:IE6で例外をスローするときは
 *                              Errorオブジェクトにしなくてはならない件の対策
 * 2011/06/30 清水            ・ACT0036:Request処理で
 *                              GCでファイルが存在しなくてもonSuccess件の対策
 * 2011/06/30 清水            ・ACT0037:IE6のちらつき防止対策
 * 2011/07/05 清水            ・ACT0038:システム終了用のFacebox.close実装
 * 2011/07/12 清水            ・ACT0039:openUrlでpdfファイルの場合は
 *                              focus等の制御をしないよう変更
 *                              （IE6でセキュリティエラーになる）
 * 2011/07/26 清水            ・ACT0041:通信中の画面抑止の透過度を透明に変更
 * 2011/08/01 清水            ・ACT0042:Errorの詳細取得関数追加
 * 2011/08/02 清水            ・ACT0043:Util.$propcopyをディープコピーに対応
 * 2011/08/02 柳原            ・ACT0044:Util.CONTENTS_SIZE_MAP、
 *                              $setContentsSizeの追加
 * 2011/08/03 柳原            ・ACT0045:Util.OTHER_CONTENTS_SIZE_MAP、
 *                              $setOtherContentsSizeの追加
 * 2011/08/09 佐藤            ・IE8対応:Util.$createXHRの分岐条件を変更
 * 2011/08/09 清水            ・ACT0046:iframe.contentWindowのfireEventに対応
 * 2011/08/10 渡会            ・$propcopyのArrayがある場合の再起処理を修正
 * 2011/08/10 渡会            ・ACT0047:Util.$openUrl、Util.$openFormで
 *                              window.openに失敗した場合の処理を追加
 * 2011/08/03 柳原            ・ACT0048:Util.OTHER_CONTENTS_SIZE_MAPで、
 *                              初期表示でのサイズ可変処理を追加
 * 2011/08/17 渡会            ・OSがXP時のWindowOpenのサイズを再定義
 *                              (FF、GCのﾊﾞｰｼﾞｮﾝを最新にした際の差分を吸収)
 * 2011/08/17 渡会            ・OSが7時のWindowOpenのサイズを再定義
 * 2011/08/17 清水            ・ACT0049:Field.$setValueでIE6のselectタグで
 *                              タイミング的に値セットできない場合の対策
 * 2011/08/20 柳原            ・ACT0050:WinXP下でIEのVer.を考慮しないよう変更
 * 2011/08/20 伊藤            ・ウインドウとiframeのサイズを
 *                              WCVWF900.jsに合わせる
 * 2011/08/23 清水            ・ACT0051:IE6より後の場合windowのresizeの
 *                              observeはwindowとdocument.bodyの
 *                              両方に行うよう対応（fireEventとの兼ね合い）
 * 2011/08/27 渡会            ・ACT0052:テキストボックス先頭へカーソルを移動
 *                              させるメソッドを追加
 * 2011/08/30 柳原            ・ACT0053:OSやブラウザが判別できなかった場合の
 *                              サイズを、WinXPのIEの値で統一
 * 2011/08/31 清水            ・ACT0054:フェイスボックスの表示位置をスクロール
 *                              を考慮するように変更
 * 2011/08/31 柳原            ・ACT0055:IEでの表示サイズをアドレスバーの
 *                              表示を想定したものに修正
 * 2011/09/03 柳原            ・ACT0056:WinXPでのIEの画面サイズを、
 *                              IE8とそれ以外のIEで区分分けした
 * 2011/09/03 柳原            ・ACT0057:更新詳細画面の環境毎のサイズ調整追加
 *                              (Web版のみ)
 * 2011/09/03 柳原            ・ACT0058:Win7でのFFのサイズ修正
 * 2011/09/05 伊藤            ・ACT0059:画面抑止時のスクロール抑止を削除
 * 2011/09/05 清水            ・ACT0060:画面にtabindexを指定した場合の
 *                              Facebox表示時のタブ制御を修正
 * 2011/09/05 清水            ・ACT0061:Ctrl+Fで検索したときに
 *                              IE6でエラーになる現象の対策
 * 2011/09/05 渡会            ・ACT0062:OverlayのｻｲｽﾞをCSSに任せる様に変更
 * 2011/09/06 清水            ・ACT0063:IE9で要領参照でエラーになる対策
 * 2011/09/10 渡会            ・ACT0064:Event.KEY_SPACE(32)を追加
 * 2011/09/11 渡会            ・ACT0065:Util.$OpenUrlをIEで展開時に条件分岐
 * 2011/09/12 渡会            ・ACT0066:Facebox内×アイコンのhrefを変更
 * 2011/09/13 清水            ・ACT0067:Faceboxの画像のpreloadタイミング変更
 * 2011/09/14 渡会            ・ACT0068:ｼｽﾃﾑｴﾗｰ時のｸﾛｰｽﾞ処理に条件を追加
 * 2011/09/14 清水            ・ACT0069:Faceboxのloadingのgifを削除
 * 2011/09/27 清水            ・ACT0070:IE9でキーイベントが無効にならない対策
 * 2011/09/28 清水            ・ACT0071:Faceboxで表示が崩れる対策
 * 2011/10/26 清水            ・ACT0072:画面の部分抑止機能追加
 * 2011/10/28 上野            ・ACT0073:コンテンツ表示時にツリーで別のコンテン
 *                              ツを選択した場合の対策
 * 2011/10/28 伊藤            ・ACT0074:openUrlでswfファイルの場合は
 *                              focus等の制御をしないよう変更
 * 2011/10/31 清水            ・ACT0076:IE8以上で同じwindowのopenerが
 *                              書き換わったときにセキュリティエラーになる対策
 * 2011/11/09 清水            ・ACT0077:openIFrameで完了時の処理を
 *                              登録できるよう引数追加
 * 2011/11/14 佐藤            ・ACT0078:readOnlyのtext入力エリアでBackSpaceを
 *                              押した場合にブラウザの戻る機能で戻ってしまう
 *                              対策
 * 2011/12/28 伊藤            ・ACT0079:IEの場合、設定によりアンカージャンプが
 *                              できないため、アンカージャンプ共通インタフェース
 *                              をIEのみ実行するためのメソッドを追加
 * 2012/02/01 伊藤            ・ACT0080:指定エリア抑止中、砂時計を表示
 * 2012/04/12 伊藤            ・ACT0081:FF、GCでGTSプラグインが
 *                              参照できない問題に対応
 * 2012/06/28 伊藤            ・ACT0082:IE6印刷時のフリーズ対策
 * 2012/06/28 今村            ・ACT0083:FFの印刷時、改行位置がページ毎に
 *                              短くなる不具合に対応
 * 2012/07/18 今村            ・ACT0084:印刷プレビュー機能追加
 * 2012/08/31 今村            ・ACT0085:連続して同じアンカーに
 *                              スクロールできない問題の対策
 * 2012/10/04 今村            ・ACT0086:ipad対応
 * 2012/10/04 今村            ・ACT0087:ipadの場合フェイスボックスの初回表示
 *                              位置がずれる問題に対応
 * 2012/10/19 伊藤            ・ACT0088:BRMのタブ内の高さを構成により切替え
 * 2013/01/18 伊藤            ・ACT0089:$getPositionを追加
 *                              引数のエレメントのスクロール座標を取得
 * 2013/01/18 伊藤            ・ACT0090:印刷時のC幅イラストの左寄せ
 * 2013/05/15 伊藤            ・ACT0091:IE10対応:IE10がIE6以下で
 *                              判定されてしまうため修正
 * 2013/05/15 伊藤            ・ACT0092:IE10対応:IE10でXMLHttpRequest()が
 *                              使用不可のため修正
 * 2013/05/15 伊藤            ・ACT0093:IE10対応:メトロの判定フラグ追加
 * 2013/05/15 伊藤            ・ACT0094:IE10対応:タッチ機能の有無フラグ追加
 * 2013/05/15 伊藤            ・ACT0095:IE10対応:印刷時のC幅イラストの左寄せが
 *                              メトロの場合に寄せ幅が大きすぎて、
 *                              イラストの左端が切れる
 * 2013/05/15 伊藤            ・ACT0098:FFでローカル環境で、urlが不正の場合、
 *                              onException→onFailureに飛ばしなおす
 * 2013/05/21 鈴木(TCS)       ・ACT0099:IE10対応:フェイスボックスの背景が
 *                              透過されない問題の対応
 * 2013/06/18 伊藤            ・ACT0100:IE10対応:IE10の比較条件をIE10以上に修正
 * 2013/08/19 伊藤            ・ACT0101:手順に品名コードを表示する場合、
 *                              IE10メトロで印刷時に手順と品名コードが
 *                              重ならないように対応
 * 2013/08/19 今村            ・ACT0102:ipadの場合フェイスボックスの初回表示
 *                              位置がずれる問題に対応(CD)
 *---------------------------------------------------------------------------*/

/*
 *
 */
var Util = {};

/*
 * デバッグ用フラグ
 * 例外発生時のalert表示の制御(true:表示する, false:しない)
 * ※開発時はtrue、本番運用時はfalseとする
 */
Util.DEBUGFLAG = true;

/*
 * 20110210:ACT0002
 * ローカル環境フラグ
 * 例外発生時のalert表示の制御(true:ローカル環境, false:Web環境)
 */
Util.IS_LOCAL = false;

/*
 * 20110210:ACT0001
 * システムエラー時処理
 */
Util.callbackSystemError = null;

/*
 * 20110210:ACT0001,ACT0002
 * 初期化処理
 */
Util.$init = function(isLocal, callbackSystemError) {
  Util.IS_LOCAL = isLocal;
  if(Util.$isFunction(callbackSystemError)) {
    Util.callbackSystemError = callbackSystemError;
  }
}

/*
 *
 */
Util.$try = function() {
  var value = null;
  for(var i = 0; i < arguments.length; i++) {
    try {
      value = arguments[i]();
      break;
    }
    catch(e) {
    }
  }
  return value;
};

/*
 *
 */
function $A(args) {
  if(!args) {
    return [];
  }
  var length = args.length || 0;
  var result = new Array(length);
  while(length--) {
    result[length] = args[length];
  }
  return result;
};

/*
 *
 */
Util.$exec = function(text) {
  if(!text) {
    return text;
  }
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.text = text;
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
  head.removeChild(script);
  script = null;
  return text;
};

/*
 *
 */
Util.$createXHR = function() {
  //20110210 IE9のローカルファイルアクセス問題対応:ACT0002,ACT0027
  //20110809 IE8対応で条件を7.0以上に変更
  //ACT0092 2013.05.15 start
  //if(Util.IS_LOCAL && Browser.IE && Browser.PRODUCT_VERSION >= "7.0") {
  //ACT0100 2013.06.18 start
  //if(Browser.IE && Browser.PRODUCT_VERSION ==10.0) {
  if(Browser.IE && Browser.PRODUCT_VERSION >= 10.0) {
  //ACT0100 2013.06.18 end
    return Util.$try(
        function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
        function() { return new ActiveXObject('Microsoft.XMLHTTP'); },
        function() { return new XMLHttpRequest(); }
      );
  } else if(Util.IS_LOCAL && Browser.IE && Browser.PRODUCT_VERSION >= 7.0) {
  //ACT0092 2013.05.15 end
    return Util.$try(
        function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
        function() { return new ActiveXObject('Microsoft.XMLHTTP'); },
        function() { return new XMLHttpRequest(); }
      );
  } else {
    return Util.$try(
      function() { return new XMLHttpRequest(); },
      function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
      function() { return new ActiveXObject('Microsoft.XMLHTTP'); }
    );
  }
};

/*
 *
 */
Util.$createXML = function(tagName) {
  if(!tagName) {
    tagName = '';
  } else {
    // namespaceは対応しないので、':'の前をカットする。
    var p = tagName.indexOf(':');
    if(p != -1) {
      tagName = tagName.substring(p + 1);
    }
  }

  var doc = null;
  if(Browser.IE) {
    doc = new ActiveXObject('MSXML2.DOMDocument');
    if(tagName) {
      doc.async = false;
      doc.loadXML('<' + tagName + '/>');
    }
  } else {
    doc = document.implementation.createDocument('', tagName, null);
  }
  return doc;
};

/*
 *
 */
Util.$loadXML = function(url) {
  var doc = null;
  if(Browser.WEBKIT) {
    var xhr = Util.$createXHR();
    xhr.open('GET', url, false);
    xhr.send(null);
    doc = xhr.responseXML;
  } else {
    doc = Util.$createXML();
    doc.async = false;
    try {
      doc.load(url);
    }catch(e) {
      // 例外隠蔽
      // (FFでurlが異常な場合に例外発生する為)
      doc = null;
    }
  }

  // XMLパースチェックし、エラーの場合、nullを返す
  if(Util.$isParseError(doc)) {
    doc = null;
  }
  return doc;
};

/*
 * 
 */
Util.$parseXML = function(text) {
  var doc = null;
  if(Browser.IE && Browser.PRODUCT_VERSION >= 9.0) {
    if(Util.IS_LOCAL) {
      doc = Util.$createXML();
      doc.async = false;
      //DTDのチェックをはずす
      doc.validateOnParse = false;
      doc.resolveExternals = false;
      doc.loadXML(text);
    } else {
      doc = (new DOMParser()).parseFromString(text, 'text/xml');
    }
  } else if(Browser.IE) {
    doc = Util.$createXML();
    doc.async = false; 
    //ACT0030 2011.06.10 start
    doc.validateOnParse = false;
    doc.resolveExternals = false;
    //ACT0030 2011.06.10 end
    doc.loadXML(text);
  } else {
    doc = (new DOMParser()).parseFromString(text, 'text/xml');
  }

  // XMLパースチェックし、エラーの場合、nullを返す
  if(Util.$isParseError(doc)) {
    doc = null;
  }
  return doc;
};

/*
 *  
 */
Util.$serializeXML = function(xmldoc) {
  if(typeof XMLSerializer != 'undefined') {
    try {
      return (new XMLSerializer()).serializeToString(xmldoc);
    }catch(e) {
      // 例外隠蔽
      // (FFでxmldocが異常な場合に例外発生する為)
      return '';
    }
  }
  else if(xmldoc.xml) {
    return xmldoc.xml;
  }

  // serializeサポートしない、或いは上記エラーの場合、空文字を返す
//  throw 'Util.$serializeXML: XML serialize not supported.';
  return '';
};

/*
 * 
 */
Util.$empty = function() {
};

//ACT0043 2011.08.02 start
/*
 * オブジェクトコピー
 * @param {object} src コピー元
 * @param {object} des コピー先
 * @param {number} deep コピー階層（デフォルト:1）
 */
Util.$propcopy = function(src, des, deep) {
  var value = null;
  var srcValue = null;
  var len = 0;
  var _toString = Object.prototype.toString;
  var _isUndefined = function(obj) {
    return typeof obj === "undefined";
  };
  var _isArray = function(obj) {
    return _toString.call(obj) == "[object Array]";
  };
  var _isFunction = function(obj) {
    return typeof obj === "function";
  };
  var _isHash = function(obj) {
    var result = false;
    if(obj) {
      if((typeof obj == 'object')
          && !_isFunction(obj.push)
          && _isFunction(obj.toString)) {
        if(obj.toString() == '[object Object]') {
          result = true;
        }
      }
    }
    return result;
  };
  //値コピー処理
  var _copyValue = function(srcValue, deep) {
    var result = null;
    //配列の場合
    if(_isArray(srcValue) && deep > 1) {
      result = [];
      Util.$propcopy(srcValue, result, deep - 1);
    //object(連想配列)の場合
    } else if(_isHash(srcValue) && deep > 1) {
      result = {};
      Util.$propcopy(srcValue, result, deep - 1);
    //その他の場合
    } else {
      result = srcValue;
    }
    return result;
  };

  //コピー階層デフォルト設定
  if(_isUndefined(deep)) {
    deep = 1;
  }

  //配列の場合はインデックスでループ
  if(_isArray(src)) {
    var len = src.length;
    for(var i = 0; i < len; i++) {
      // 20110810 修正
      //des[prop] = _copyValue(src[i], deep);
      des[i] = _copyValue(src[i], deep);
    }
  //配列以外の場合はfor-inでループ
  } else {
    for(var prop in (src || {})) {
      des[prop] = _copyValue(src[prop], deep);
    }
  }

  return des;
};
//ACT0043 2011.08.02 end

/*
 *
 */
Util.$clone = function(obj) {
  return Util.$propcopy(obj, {});
};

/*
 *
 */
Util.$toString = function(obj) {
  if(typeof obj === "undefined") {
    return 'undefined';
  }
  if(obj === null) {
    return 'null';
  }
  var result = [];
  var clone = Util.$clone(obj);
  for(var prop in clone) {
    //連想配列やインスタンスが持つプロパティ、メソッド値かどうか判定
    //→上記以外(文字列等)でfor～inの対象になるものを除外する。
    if(clone.hasOwnProperty(prop)) {
      result.push(prop + ':' + clone[prop]);
    }
  }
  return '[' + result.join(', ') + ']';
};

/*
 *
 */
Util.$toHTML = function(obj) {
  if(obj && obj.toHTML) {
    return obj.toHTML();
  }
  else if(obj == null) {
    return '';
  }
  return String(obj);
};

/*  
 *
 */
(function() {
  //
  var _toString = Object.prototype.toString;

  function isString(obj) {
    return _toString.call(obj) == "[object String]";
  }

  function isArray(obj) {
    return _toString.call(obj) == "[object Array]";
  }

  function isNumber(obj) {
    return _toString.call(obj) == "[object Number]";
  }

  Util.$propcopy({
    $isString : isString,
    $isArray  : isArray,
    $isNumber : isNumber
  }, Util);
})();

/*
 *
 */
Util.$isElement = function(obj) {
  return !!(obj && obj.nodeType == 1);
};

/*
 *
 */
Util.$isFunction = function(obj) {
  return typeof obj === "function";
};

/*
 *
 */
Util.$isHash = function(obj) {
  return (typeof obj == 'object') && !Util.$isFunction(obj.push);
};

/*
 *
 */
Util.$isUndefined = function(obj) {
  return typeof obj === "undefined";
};

/*
 *
 */
Util.$isXML = function(obj) {
  var documentElement = (obj ? obj.ownerDocument || obj : 0).documentElement;
  return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// ACT0052 2011.08.24 start
/*
 *
 */
Util.$setTextBoxSelection = function(elm) {
  var range = null;
  
  //Internet Explorer（IE）
  if(Browser.IE) {
    elm.focus();
    range = elm.createTextRange();
    range.move('character', 0);
    range.select();
  //FireFox（FF）
  } else if(Browser.GECKO) {
    elm.focus();
    elm.setSelectionRange(0, 0);
  //Google Chrome（GC）
  } else if(Browser.WEBKIT) {
    elm.setSelectionRange(0, 0);
  }
};
// ACT0052 2011.08.24 end

/*
 *
 */
Util.$toQueryParams = function(src) {
  // "#"(位置名指定)で切り分け
  var match = src.strip().match(/([^?#]*)(#.*)?$/);
  if(!match) {
    return {};
  }

  // "#"前の内容を"&"(URLパラメータ連結文字)で分解する
  var arrparam = match[1].split('&');
  var arrret = [];
  var hash = {};

  for(var i = 0; i < arrparam.length; i++) {
    var pair = arrparam[i].split('=')
    if(pair[0]) {
      var key = decodeURIComponent(pair.shift());
      var value = pair.length > 1 ? pair.join('=') : pair[0];
      if(value != undefined) {
        value = decodeURIComponent(value);
      }

      // すでにキー登録されている場合
      if(key in hash) {
        if(!Util.$isArray(hash[key])) {
          // 配列になっていなければ、配列化する
          hash[key] = [hash[key]];
        }
        // 配列に追加
        hash[key].push(value);

      // キー登録されていない場合
      } else {
        // 連想配列に登録する
        hash[key] = value;
      }
    }
  }

  return hash;
};

/*
 *
 */
Util.$toQueryPair = function(key, value) {
  if(Util.$isUndefined(value)) {
    return key;
  }
  if(value == null) {
    value = '';
  }
  return key + '=' + encodeURIComponent(value);
};

/*
 *
 */
Util.$toQueryString = function(hash) {
  var arrret = [];
  var encKey;
  for(var key in (hash || {})) {
    encKey = encodeURIComponent(key);
    if(Util.$isArray(hash[key])) {
      for(var i = 0, length = hash[key].length; i < length; i++) {
        arrret.push(Util.$toQueryPair(encKey, hash[key][i]));
      }
    } else {
      arrret.push(Util.$toQueryPair(encKey, hash[key]));
    }
  }
  return arrret.join('&');
};

/*
 * 戻り値: true:正常, false:異常(パースエラー等)
 */
Util.$isParseError = function(xmldoc) {
  // GCのparsererror判定
  function findParserErrorTag(xmldoc) {
    // 機能があるかチェック
    if(!xmldoc.documentElement
    || !xmldoc.documentElement.getElementsByTagName) {
      // 無ければ解析不可の為、falseを返す
      return false;
    }
    // parsererrorタグ検索
    var tags = xmldoc.documentElement.getElementsByTagName('parsererror');
    // 見つかった場合、trueを返す
    return !!tags && tags.length > 0;
  }

  // GCの場合、パースエラーがあると(Requestクラス使用時)、responseXMLはnull
  if(xmldoc == null) {
    return true;
  }

  // IE(XMLHTTP)の場合、parseErrorで判定する。
  if(xmldoc.parseError != null) {
    return (xmldoc.parseError.errorCode != 0);
  }

  // FF,GCの場合、parseErrorが無い。エラー用のxmlが定義される。
  // FFの場合、<parsererror>～～</parsererror>
  // GCの場合、<text><parsererror>～～</parsererror></text>
  //  ※属性は略
  // parsererrorタグを検索し、存在する場合はエラーとみなす。
  // ★使用するxmlにparsererrorタグは存在しないものとする。
  //   存在する場合、正常終了であってもエラーありとみなす。
  return (xmldoc.documentElement == null) ||
         (xmldoc.documentElement.tagName == 'parsererror'
          && xmldoc.documentElement.namespaceURI ==
           'http://www.mozilla.org/newlayout/xml/parsererror.xml') ||
         (findParserErrorTag(xmldoc));
};

/*
 *
 */
Util.$offset = function(l, t) {
  var offset = [l, t];
  offset.left = l;
  offset.top  = t;
  return offset;
};

/*
 *
 */
Util.XPathExp = function(xpath) {
  this.xpath = xpath;
  this.exp   = null;

  // FFで外部xmlのevaluateを行うと例外発生する為、
  // XPathEvaluatorのcreateExpressionで生成したXPathExpressionを使用する
//  if(document.createExpression) {
//    this.exp = document.createExpression(xpath, null);
//  }
  if(typeof XPathEvaluator != 'undefined') {
    var x = new XPathEvaluator();
    this.exp = x.createExpression(xpath, null);
  }
};

Util.XPathExp.prototype.getNodes = function(ctx) {
  if(this.exp) {
    // for WEBKIT, GECKO
    var result = this.exp.evaluate(ctx,
                                   XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                   null);
    var length = result.snapshotLength;
    var a = new Array(length);
    while(length--) {
      a[length] = result.snapshotItem(length);
    }
    return a;
  } else {
    // for IE
    try {
      var xmldoc = ctx.ownerDocument;
      if(xmldoc == null) {
        xmldoc = ctx;
      }
      xmldoc.setProperty('SelectionLanguage', 'XPath');
      if(xmldoc == ctx) {
        ctx = xmldoc.documentElement;
      }
      //ACT0015 2011.03.25 start
      //return ctx.selectNodes(this.xpath);
      var result = ctx.selectNodes(this.xpath);
      var length = result.length;
      var a = new Array(length);
      while(length--) {
        a[length] = result[length];
      }
      return a;
      //ACT0015 2011.03.25 end
    }
    catch(e) {
      throw "XPath feature not supported by this browser.";
    }
  }
};

Util.XPathExp.prototype.getSingleNode = function(ctx) {
  if(this.exp) {
    // for WEBKIT, GECKO
    var result = this.exp.evaluate(ctx,
                                   XPathResult.FIRST_ORDERED_NODE_TYPE,
                                   null);
    return result.singleNodeValue;
  } else {
    // for IE
    try {
      var xmldoc = ctx.ownerDocument;
      if(xmldoc == null) {
        xmldoc = ctx;
      }
      xmldoc.setProperty('SelectionLanguage', 'XPath');
      if(xmldoc == ctx) {
        ctx = xmldoc.documentElement;
      }
      return ctx.selectSingleNode(this.xpath);
    }
    catch(e) {
      throw "XPath feature not supported by this browser.";
    }
  }
};

/*
 *
 */
Util.$getNodes = function(ctx, xpath) {
  return (new Util.XPathExp(xpath)).getNodes(ctx);
};

/*
 *
 */
Util.$getSingleNode = function(ctx, xpath) {
  return (new Util.XPathExp(xpath)).getSingleNode(ctx);
};

/*
 * XML Nodeテキスト取得
 * node: XML Node
 */
Util.$getNodeText = function(node) {
  var childs = node.childNodes;
  for(var i = 0, l = childs.length; i < l; i++) {
    // nodeTypeが3:TEXT_NODE(コンテンツの文字面)の場合
    if(childs[i].nodeType == 3) {
      return childs[i].nodeValue;
    }
  }

  return '';
};

/*
 * XML Nodeテキストセット
 * node: XML Node
 * value: セット値
 */
Util.$setNodeText = function(node, value) {
  var childs = node.childNodes;
  for(var i = 0, l = childs.length; i < l; i++) {
    // nodeTypeが3:TEXT_NODE(コンテンツの文字面)の場合
    if(childs[i].nodeType == 3) {
      // 上書き
      childs[i].nodeValue = value;
      return;
    }
  }

  // TEXT_NODEが存在しない場合、TEXT_NODE生成
  var resdoc = node.ownerDocument;
  var textNode = resdoc.createTextNode(value);
  node.appendChild(textNode);
};

/* DOM3(& IE6対応)版 */
/* [TODO]getNodeText,setNodeTextについては、今後、対象ブラウザが調整され、
         DOM Level3で問題ない状態になった場合、下記処理に変更する。
   ※textContentプロパティはDOM Level3で定義されている。
      動作 FF:○,GC:○,IE(6):×
     IE6については独自にtextプロパティがある為、判定して切り替える。
*/
/****************************
Util.$getNodeText = function(node) {
  // マルチブラウザ対応
  return node.textContent || node.text;
};
Util.$setNodeText = function(node, value) {
  // マルチブラウザ対応
  if(Util.$isUndefined(node.textContent)) {
    node.text = value;
  } else {
    node.textContent = value;
  }
};
*****************************/

/* Node版 */
/*
 * XML Node属性(属性object)取得
 * node: XML Node
 * attr: 属性名
 */
Util.$getAttr = function(node, attr) {
  return node.attributes.getNamedItem(attr);
};

/*
 * XML Node属性(属性値)取得
 * node: XML Node
 * attr: 属性名
 */
Util.$getAttrValue = function(node, attr) {
  var attrEl = Util.$getAttr(node, attr);
  if(attrEl) {
    return attrEl.value;
  }
  return '';
};

/*
 * XML Node属性値セット
 * node: XML Node
 * attr: 属性名
 * value: セットする属性値
 */
Util.$setAttrValue = function(node, attr, value) {
  var resdoc = node.ownerDocument;
  var attrNode = resdoc.createAttribute(attr);
  attrNode.nodeValue = value;
  node.attributes.setNamedItem(attrNode);
};

/* Element版 */
/* [TODO]属性取得/設定は上記のメソッド(抽象クラス:Node)としてのI/Fとして
         定義している。ElementでのI/Fとする場合、下記対応に切り替える。
*/
/****************************
Util.$getAttr = function(element, attr) {
  return element.getAttributeNode(attr);
};
Util.$getAttrValue = function(element, attr) {
  return element.getAttribute(attr) || '';
};
Util.$setAttrValue = function(element, attr, value) {
  element.setAttribute(attr, value);
};
*****************************/

/*
 * xsldoc: XMLDocument or XMLの所在URL
 * paramexist: XSLTへ渡すパラメータの存在フラグ(true:あり, false:なし)
 */
Util.XSLT = function(xsldoc, paramexist) {
  // 引数がStringの場合(URL) ※ここではXML文字列はI/Fされない前提。
  if(Util.$isString(xsldoc)) {
    // IEで且つXSLTに渡すパラメータがある場合
    if(window.ActiveXObject && paramexist) {
      var xsldoc_ft = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
      // async = false:同期
      xsldoc_ft.async = false;
      xsldoc_ft.resolveExternals = true;
      // FreeThreadedDOMDocumentにてURL指定でロードし、パースする。
      xsldoc_ft.load(xsldoc);
      xsldoc = xsldoc_ft;

    // FF,GCの場合、またはパラメータが無い場合
    } else {
      xsldoc = Util.$loadXML(xsldoc);
    }

  // 引数がString以外(パース済みXMLDocumentオブジェクト)
  // ※DOMDocumentなのか、FreeThreadedDOMDocumentなのかは判別が付かない。
  // [TODO]IEでAjax(サーバ通信)結果のresponseXMLがFreeThreadedDOMDocumentか
  //       objTemp.stylesheetにセットしてみて確認する。
  //       上記踏まえ、createXML等、他のDOMDocumentをFreeThreaded化するか検討
  } else {
    // IEで且つXSLTに渡すパラメータがある場合
    if(window.ActiveXObject && paramexist) {
      var xsldoc_ft = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
      // async = false:同期
      xsldoc_ft.async = false;
      xsldoc_ft.resolveExternals = true;
      // XML文字列を取得し、FreeThreadedDOMDocumentで再度パース
      xsldoc_ft.loadXML(xsldoc.xml);
      xsldoc = xsldoc_ft;
    }
    // FF,GCの場合、またはパラメータが無い場合、そのままxsldocを使用
  }
  this.xsldoc = xsldoc;

  // IEの場合
  if(window.ActiveXObject) {
    // XSLTに渡すパラメータがある場合
    if (paramexist) {
      var objTemp = new ActiveXObject("Msxml2.XSLTemplate");
      objTemp.stylesheet = xsldoc;
      this.processor_temp = objTemp.createProcessor();
    }
    // パラメータが無い場合、そのまま
    // (Util.XSLT.prototype.transformでxmldoc.transformNodeを使用する)
    // ※補足：パラメータあり/なしに関わらず、上記processorで解釈は可能。

  // FF,GCの場合
  } else {
    this.processor = new XSLTProcessor();
    this.processor.importStylesheet(this.xsldoc);
  }
};

/*
 *
 */
Util.XSLT.prototype.transform = function(xmldoc, element, args) {
  element = $(element);

  // for WEBKIT, GECKO
  if(this.processor) {
    // xsl:paramセット
    if(Util.$isHash(args)) {
      for(var key in args) {
        this.processor.setParameter(null, key, args[key]);
      }
    }
    var fragment = this.processor.transformToFragment(xmldoc, document);
    element.innerHTML = "";
    element.appendChild(fragment);
  }
  // for IE XSLTパラメータセット付き
  else if(this.processor_temp) {
    // IE用のprocessorで処理する。
    // xsl:paramセット
    if(Util.$isHash(args)) {
      for(var key in args) {
        this.processor_temp.addParameter(key, args[key]);
      }
    }
    this.processor_temp.input = xmldoc;
    this.processor_temp.transform();
    element.innerHTML = this.processor_temp.output;

  }
  // for IE XSLTパラメータセットなし
  else if("transformNode" in xmldoc) {
    // transformNodeで処理する。
    element.innerHTML = xmldoc.transformNode(this.xsldoc);
  }
  else {
    throw "XSLT is not supported in this browser.";
  }
};

/*
 * args: XSLTに渡すパラメータ(連想配列) ※不要の場合、引数省略
 */
Util.$transformXML = function(xmldoc, xsldoc, element, args) {
  var paramexist = Util.$isHash(args);
  (new Util.XSLT(xsldoc, paramexist)).transform(xmldoc, element, args);
};


/*
 * 注：$preloadの実行回数(イメージ数、箇所数)が20を超えるような場合は、
 *     インフラチームと相談。
 */
Util.$preload = function(image) {
  var img;
  var src;
  // [TODO]最適化の余地あり
  if(Util.$isString(image)) {
    img = new Image();
    img.src = image;
  }
  else if(Util.$isElement(image)) {
    img = new Image();
    src = Element.$getStyle(image, 'background-image').replace(/url\((.+)\)/, '$1').unquote();
    img.src = src;
  }
};

/*
 * 言語切り替え表示加工
 *  lang 言語
 *  dict 文言管理クラス 言語/リテラル群 {リテラルキー/文言} の連想配列
 */
Util.$changeLang = function(lang, dict) {
  // 言語確定
  lang = lang || Browser.LANG;

  // 文言管理クラスがない場合
  if(!dict) {
    //[TODO]エラー時の文言調整
    throw 'No literal dictionary specified.';
    //return;
  }
  // 指定言語の文言がない場合
  if(!dict[lang]) {
    // 英語をデフォルトとする
    if(!dict['en']) {
      //[TODO]エラー時の文言調整
      throw 'No langage found in the dictionary: [' +  lang + ']';
      //return;
    }
    lang = 'en';
  }

  // span等 表示切り替え(innerHTML置き換え)抽出
  var span = document.getElementsByClassName('trans');
  for(var i = 0, length = span.length; i < length; i++) {
    var element = $(span[i]);
    var literalKey;
    // 変換済みの場合
    if(element._literalKey) {
      // 退避したリテラルキーを取得
      literalKey = element._literalKey;

    // 未変換の場合
    } else {
      // innerHTMLをリテラルキーとして取得
      literalKey = element.innerHTML;
      // リテラルキー退避
      element._literalKey = literalKey;
    }

    // 言語毎のリテラルキー指定の文言をinnerHTMLに展開
    if(dict[lang][literalKey]) {
      element.innerHTML = dict[lang][literalKey];
    } else {
      //[TODO]エラー時の文言調整
      throw 'No literal found in the ' + lang + ' dictionary: [' + literalKey + ']';
    }
  }

  // button専用 表示切り替え(value置き換え)抽出
  var btn = document.getElementsByClassName('trbtn');
  for(var i = 0, length = btn.length; i < length; i++) {
    var element = $(btn[i]);
    // 型チェック
    //  inputタグでない、又はtypeがbutton関連でない場合、スキップ
    if(element.tagName.toLowerCase() != 'input'
    || !(/^(?:button|reset|submit)$/i.test(element.type))) {
      continue;
    }

    var literalKey;
    // 変換済みの場合
    if(element._literalKey) {
      // 退避したリテラルキーを取得
      literalKey = element._literalKey;

    // 未変換の場合
    } else {
      // valueをリテラルキーとして取得
      literalKey = element.value;
      // リテラルキー退避
      element._literalKey = literalKey;
    }

    // 言語毎のリテラルキー指定の文言をvalueに展開
    if(dict[lang][literalKey]) {
      element.value = dict[lang][literalKey];
    } else {
      //[TODO]エラー時の文言調整
      throw 'No literal found in the ' + lang + ' dictionary: [' + literalKey + ']';
    }
  }

  // img専用 表示切り替え(title,alt置き換え)抽出
  var img = document.getElementsByClassName('trimg');
  for(var i = 0, length = img.length; i < length; i++) {
    var element = $(img[i]);
    // 型チェック
    //  imgタグでない場合、スキップ
    if(element.tagName.toLowerCase() != 'img') {
      continue;
    }

    var literalKeys = {};
    // 変換済みの場合
    if(element._literalKeys) {
      // 退避したリテラルキー(title,alt)を取得
      literalKeys = element._literalKeys;

    // 未変換の場合
    } else {
      // title,altをリテラルキーとして取得
      if(element.title) {
        literalKeys['title'] = element.title;
      }
      if(element.alt) {
        literalKeys['alt'] = element.alt;
      }
      // リテラルキー退避
      element._literalKeys = literalKeys;
    }

    // 言語毎のリテラルキー指定の文言をtitle,altに展開
    if(literalKeys['alt']) {
      if(dict[lang][literalKeys['alt']]) {
        element.alt = dict[lang][literalKeys['alt']];
      } else {
        //[TODO]エラー時の文言調整
        throw 'No literal found in the ' + lang + ' dictionary: [' + literalKeys['alt'] + ']';
      }
    }
    if(literalKeys['title']) {
      if(dict[lang][literalKeys['title']]) {
        element.title = dict[lang][literalKeys['title']];
      } else {
        //[TODO]エラー時の文言調整
        throw 'No literal found in the ' + lang + ' dictionary: [' + literalKeys['title'] + ']';
      }
    }
  }
}

//ACT0026 2011.05.10 start
/**
 * Windowサイズ１（1024,768）
 */
Util.WINDOW_SIZE_1 = 1;
/**
 * Windowサイズ２（810,636）
 */
Util.WINDOW_SIZE_2 = 2;
/**
 * Windowサイズ３（700,600）
 */
Util.WINDOW_SIZE_3 = 3;
/**
 * Windowサイズ定義
 */
Util.WINDOW_SIZE_MAP = {
  WINXP : {
    //ACT0050 2011.08.20 start
    //IE6   : [[1012,672],[810,636],[700,600]],
    //ACT0055 2011.08.31 start
    //IE    : [[1012,672],[810,636],[700,600]],
	  //ACT0056 2011.09.03 start
    //IE    : [[1012,650],[810,636],[700,600]],
    IE    : [[1012,672],[810,636],[700,600]],
    IE8    : [[1012,650],[810,636],[700,600]],
    //ACT0056 2011.09.03 end
    //ACT0055 2011.08.31 end
    //ACT0050 2011.08.20 end
    FF    : [[1016,672],[810,636],[700,600]],
    GC    : [[1016,676],[810,636],[700,600]]
  },
  WIN7  : {
    //ACT0055 2011.08.31 start
    //IE    : [[1004,662],[810,636],[700,600]],
    IE    : [[1004,632],[810,636],[700,600]],
    //ACT0055 2011.08.31 end
    //2011.08.20 start
    //FF    : [[1008,633],[810,636],[700,600]],
	  //ACT0058 2011.09.03 start
    //FF    : [[1008,652],[810,636],[700,600]],
    FF    : [[1008,662],[810,636],[700,600]],
  	//ACT0058 2011.09.03 end
    //2011.08.20 end
    GC    : [[1008,665],[810,636],[700,600]]
  },
  //ACT0053 2011.08.30 start
  //OTHER : [[1024,768],[810,636],[700,600]]
  OTHER : [[1012,672],[810,636],[700,600]]
  //ACT0053 2011.08.30 end
};
//ACT0044 2011.08.02 start
/**
 * コンテンツサイズ定義
 */
Util.CONTENTS_SIZE_MAP = {
  WINXP : {
    //ACT0050 2011.08.20 start
    //IE6   : [483,497,497,494],
    //ACT0055 2011.08.31 start
    //IE    : [483,497,497,494],
    //ACT0056 2011.09.03 start
    //IE    : [461,475,475,472],
    IE    : [483,497,497,494],
    IE8    : [461,475,475,472],
    //ACT0056 2011.09.03 end
    //ACT0055 2011.08.31 end
    //ACT0050 2011.08.20 end
    FF    : [469,483,483,480],
    GC    : [490,504,504,501]
  },
  WIN7  : {
    //ACT0055 2011.08.31 start
    //IE    : [471,485,485,482],
    IE    : [447,461,461,458],
    //ACT0055 2011.08.31 end
    //2011.08.20 start
    //FF    : [444,458,458,455],
	  //ACT0058 2011.09.03 start
    //FF    : [456,470,470,467],
    FF    : [471,485,482,482],
  	//ACT0058 2011.09.03 end
    //2011.08.20 end
    GC    : [476,490,490,487]
  },
  //ACT0053 2011.08.30 start
  //OTHER : [453,467,467,464]
  OTHER : [483,497,497,494]
  //ACT0053 2011.08.30 end
};
//ACT0044 2011.08.02 end
//ACT0045 2011.08.03 start
/**
 * コンテンツHTMLサイズ定義
 */
Util.OTHER_CONTENTS_SIZE_MAP = {
  WINXP : {
    //ACT0050 2011.08.20 start
    //IE6   : [464],
    //ACT0055 2011.08.31 start
    //IE    : [464],
    //ACT0056 2011.09.03 start
    //IE    : [463],
    IE    : [464],
    IE8    : [441],
    //ACT0056 2011.09.03 end
    //ACT0055 2011.08.31 end
    //ACT0050 2011.08.20 end
    FF    : [449],
    GC    : [470]
  },
  WIN7  : {
    //ACT0055 2011.08.31 start
    //IE    : [451],
    IE    : [425],
    //ACT0055 2011.08.31 end
  	//ACT0058 2011.09.03 start
    //FF    : [424],
    FF    : [439],
  	//ACT0058 2011.09.03 end
    GC    : [456]
  },
  //ACT0053 2011.08.30 start
  //OTHER : [434]
  OTHER : [464]
  //ACT0053 2011.08.30 end
};
//ACT0045 2011.08.03 end
/**
 * Util.$openUrl用のウィンドウタイプ定義設定
 * @param {object(連想配列)} windowSizeMap ウィンドウサイズ定義
 */
Util.$setOpenUrlWindowType = function(windowSizeMap) {
  Util.WINDOW_SIZE_MAP = windowSizeMap;
};
/**
 * Util.$openUrl用のオプション作成
 * @private
 * @param {string} baseOption ベースオプション
 * @param {number} windowSize ウィンドウサイズ
 */
Util.$createWindowOption = function(baseOption, windowSize) {
  var browserType = '';
  var osType = '';
  var ua = navigator.userAgent;
  var types = Util.WINDOW_SIZE_MAP.OTHER;
  var result = baseOption;

  //ウィンドウサイズの指定がある場合
  if(windowSize) {
    //OSタイプの取得
    //Windows 7（WIN7）（どこにも合致しない場合は空文字）
    if(ua.match(/Win(dows )?NT 6\.1/)) {
      osType = 'WIN7';
    //Windows XP（WINXP）
    } else if(ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
      osType = 'WINXP';
    }

    //ブラウザタイプの取得（どこにも合致しない場合は空文字）
    //IE
    if(Browser.IE) {
      //ACT0050 2011.08.20 start
      ////IE6（IE6）
      //if(Browser.PRODUCT_VERSION <= 6.0) {
      //  browserType = 'IE6';
      ////IE（IE9～）
      //} else {
      //  browserType = 'IE';
      //}
      //ACT0056 2011.09.03 start
      //browserType = 'IE';
      if (osType == 'WINXP') {
        if(Browser.PRODUCT_VERSION == 8.0) {
          browserType = 'IE8';
        } else {
          browserType = 'IE';
        }
      } else {
    	browserType = 'IE';
      }
      //ACT0056 2011.09.03 end
      //ACT0050 2011.08.20 end
    //FireFox（FF）
    } else if(Browser.GECKO) {
      browserType = 'FF';
    //Google Chrome（GC）
    } else if(Browser.WEBKIT) {
      browserType = 'GC';
    }

    //OSタイプとブラウザタイプがある場合はウィンドウタイプを取得
    if(osType && browserType) {
      try {
        types = Util.WINDOW_SIZE_MAP[osType][browserType];
      } catch(e) {
      }
    }

    //optionが空でない場合はカンマを付ける
    if(result) {
      result += ',';
    //optionが空の場合は空文字を設定
    } else {
      result = '';
    }
    //option文字列にwidth,hrightを追加
    result += 'width=' + types[windowSize - 1][0]
          + ',height=' + types[windowSize - 1][1];
  }

  return result;
};

//ACT0039 2011.07.12 start
/*
 * window表示(URL指定)
 * 注：
 *  ・使用意図は、別windowを開きアクティブにする。
 *    この時、target,optionについては必ず指定する事。
 *    (指定しない場合、別windowが開かない場合がある為)
 *  ・IEでブラウザを二重に立ち上げ、それぞれから同一targetを指定した場合、
 *    指定windowはアクティブにならない。
 *    (タスクバー点滅する状態。Windowsの制御・制限)
 */
//Util.$openUrl = function(url, target, option) {
Util.$openUrl = function(url, target, option, windowSize) {
  var objwin = null;
  var isPdf = Util.$isPdfUrl(url);
//ACT0074 2011.10.28 start
  var isSwf = Util.$isSwfUrl(url);
//ACT0074 2011.10.28 end
  //Pdfの場合は常に別画面表示
  if(isPdf) {
    target = '_blank';
  }
  option = Util.$createWindowOption(option, windowSize);
  // ACT0065 2011.09.11 start
  if(Browser.IE) {
    objwin = window.open('about:blank', target, option);
    objwin.location = url;
  } else {
    objwin = window.open(url, target, option);
  }
  // ACT0065 2011.09.11 end
  //ACT0074 2011.10.28 start
  //Pdf,またはSwfの場合はフォーカス制御しない
  if(!isPdf && !isSwf) {
  //ACT0074 2011.10.28 end
    //ACT0047 2011.08.10 start
    // windowオブジェクトがある場合のみ処理
    if(objwin != null) {
      //ACT0076 2011.10.31 start
      //IE8以上でwindowがオープンできた場合、子ウィンドウのopenerを
      //現在のwindowに設定する(window上書きで問題あるため)
      if(Browser.IE && Browser.PRODUCT_VERSION >= 8.0) {
        objwin.opener = window;
      }
      //ACT0076 2011.10.31 end
      objwin.blur();
      objwin.focus();
    }
    //ACT0047 2011.08.10 end
  }
  return objwin;
};

/*
 * window表示(Form指定)
 * 注：
 *  ・使用意図は、別windowを開きアクティブにする。
 *    この時、target,optionについては必ず指定する事。
 *    (指定しない場合、別windowが開かない場合がある為)
 *  ・targetはwindowを識別できるように指定すること。"_blank"等は使用しない。
 *    (window.openで開いたwindowと別のwindowが開く可能性がある為。)
 *  ・IEでブラウザを二重に立ち上げ、それぞれから同一targetを指定した場合、
 *    指定windowはアクティブにならない。
 *    (タスクバー点滅する状態。Windowsの制御・制限)
 */
//Util.$openForm = function(form, target, option) {
Util.$openForm = function(form, target, option, windowSize) {
  var form = $(form);
  var objwin = null;
  var isPdf = Util.$isPdfUrl(form.action);
  //Pdfの場合は常に別画面表示
  if(isPdf) {
    target = '_blank';
  }
  option = Util.$createWindowOption(option, windowSize);
  objwin = window.open('about:blank', target, option);
  form.target = target;
  form.submit();
  //Pdfの場合はフォーカス制御しない
  if(!isPdf) {
    //ACT0047 2011.08.10 start
    // windowオブジェクトがある場合のみ処理
    if(objwin != null) {
      //ACT0076 2011.10.31 start
      //IE8以上でwindowがオープンできた場合、子ウィンドウのopenerを
      //現在のwindowに設定する(window上書きで問題あるため)
      if(Browser.IE && Browser.PRODUCT_VERSION >= 8.0) {
        objwin.opener = window;
      }
      //ACT0076 2011.10.31 end
      objwin.blur();
      objwin.focus();
    }
    //ACT0047 2011.08.10 end
  }
  return objwin;
};
//ACT0026 2011.05.10 end
//ACT0044 2011.08.02 start
/**
 * コンテンツエリアサイズ指定
 */
//ACT0088 2012.10.19 start
//Util.$setContentsSize = function() {
Util.$setContentsSize = function(isOldBRM) {
//ACT0088 2012.10.19 end
  var browserType = '';
  var osType = '';
  var ua = navigator.userAgent;
  var types = Util.CONTENTS_SIZE_MAP.OTHER;
  var myStyle = { height: "" };
 
  //OSタイプの取得
  //Windows 7（WIN7）（どこにも合致しない場合は空文字）
  if(ua.match(/Win(dows )?NT 6\.1/)) {
    osType = 'WIN7';
  //Windows XP（WINXP）
  } else if(ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
    osType = 'WINXP';
  }
  //ブラウザタイプの取得（どこにも合致しない場合は空文字）
  //IE
  if(Browser.IE) {
    //ACT0050 2011.08.20 start
    ////IE6（IE6）
    //if(Browser.PRODUCT_VERSION <= 6.0) {
    //  browserType = 'IE6';
    ////IE（IE9～）
    //} else {
    //  browserType = 'IE';
    //}
    //ACT0056 2011.09.03 start
    //browserType = 'IE';
    if (osType == 'WINXP') {
      if(Browser.PRODUCT_VERSION == 8.0) {
        browserType = 'IE8';
      } else {
        browserType = 'IE';
      }
    } else {
  	browserType = 'IE';
    }
    //ACT0056 2011.09.03 end
    //ACT0050 2011.08.20 end
  //FireFox（FF）
  } else if(Browser.GECKO) {
    browserType = 'FF';
  //Google Chrome（GC）
  } else if(Browser.WEBKIT) {
    browserType = 'GC';
  }
  
  //OSタイプとブラウザタイプがある場合はウィンドウタイプを取得
  if(osType && browserType) {
    try {
      types = Util.CONTENTS_SIZE_MAP[osType][browserType];
    } catch(e) {
    }
  }

  myStyle.height = types[0] + "px";
  Element.$setStyle($('tab_body_search_result'), myStyle);
  myStyle.height = types[1] + "px";
  Element.$setStyle($('tab_body_repair'), myStyle);
  Element.$setStyle($('tab_body_ncf'), myStyle);
  myStyle.height = types[2] + "px";
  Element.$setStyle($('tab_body_ewd'), myStyle);
  //ACT0088 2012.10.19 start
  // ボデー修理書の構成により、heightを切替える
  if(isOldBRM == true) {
    myStyle.height = types[3] + "px";
    Element.$setStyle($('tab_body_brm'), myStyle);
  } else {
    myStyle.height = types[1] + "px";
    Element.$setStyle($('tab_body_brm'), myStyle);
  }
  //ACT0088 2012.10.19 end
  myStyle.height = types[3] + "px";
  //ACT0088 2012.10.19 start
  //Element.$setStyle($('tab_body_brm'), myStyle);
  //ACT0088 2012.10.19 end
  Element.$setStyle($('tab_body_om'), myStyle);
  Element.$setStyle($('tab_body_wel'), myStyle);
  Element.$setStyle($('tab_body_res'), myStyle);
  Element.$setStyle($('tab_body_erg'), myStyle);
  Element.$setStyle($('tab_body_dm'), myStyle);

};
//ACT0044 2011.08.02 end
//ACT0045 2011.08.03 start
/**
 * コンテンツエリアサイズ指定
 * @param {element[]} elements その他コンテンツの配列要素
 */
Util.$setOtherContentsSize = function(elements) {
  var browserType = '';
  var osType = '';
  var ua = navigator.userAgent;
  var types = Util.OTHER_CONTENTS_SIZE_MAP.OTHER;
  //ACT0048 2011.08.16 start
  var Ctypes = Util.CONTENTS_SIZE_MAP.OTHER;
  var myStyle = { height: "" };
  
  var elmH = 0;
  
  //OSタイプの取得
  //Windows 7（WIN7）（どこにも合致しない場合は空文字）
  if(ua.match(/Win(dows )?NT 6\.1/)) {
    osType = 'WIN7';
  //Windows XP（WINXP）
  } else if(ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
    osType = 'WINXP';
  }
  //ブラウザタイプの取得（どこにも合致しない場合は空文字）
  //IE
  if(Browser.IE) {
    //ACT0050 2011.08.20 start
    ////IE6（IE6）
    //if(Browser.PRODUCT_VERSION <= 6.0) {
    //  browserType = 'IE6';
    ////IE（IE9～）
    //} else {
    //  browserType = 'IE';
    //}
    //ACT0056 2011.09.03 start
    //browserType = 'IE';
    if (osType == 'WINXP') {
      if(Browser.PRODUCT_VERSION == 8.0) {
        browserType = 'IE8';
      } else {
        browserType = 'IE';
      }
    } else {
  	browserType = 'IE';
    }
    //ACT0056 2011.09.03 end
    //ACT0050 2011.08.20 end
  //FireFox（FF）
  } else if(Browser.GECKO) {
    browserType = 'FF';
  //Google Chrome（GC）
  } else if(Browser.WEBKIT) {
    browserType = 'GC';
  }
  
  //OSタイプとブラウザタイプがある場合はウィンドウタイプを取得
  if(osType && browserType) {
    try {
      types = Util.OTHER_CONTENTS_SIZE_MAP[osType][browserType];
      Ctypes = Util.CONTENTS_SIZE_MAP[osType][browserType];
    } catch(e) {
    }
  }
  elmH = Element.$getHeight(parent.$(window.name));
  
  myStyle.height = (types[0] + elmH - Ctypes[3]) + "px";
  //ACT0048 2011.08.16 end
  for(var i = 0; i < elements.length; i++) {
    Element.$setStyle(elements[i], myStyle);
  }

};
//ACT0045 2011.08.03 end
/**
 * Pdf-Url判定
 * @private
 * @param {string} url Pdfの可能性のあるURL
 * @return {boolean} true:PdfのURL,false:PdfのURLでない
 */
Util.$isPdfUrl = function(url) {
  var len = 0;
  var result = false;
  //空でなく文字列の場合
  if(url && Util.$isString(url)) {
    len = url.length;
    //長さが４文字以上の場合
    if(len >= 4) {
      //拡張子が.pdfの場合はtrue
      if(url.substring(len - 4).toLowerCase() == '.pdf') {
        result = true;
      }
    }
  }
  return result;
};
//ACT0039 2011.07.12 end
//ACT0074 2011.10.28 start
/**
 * Swf-Url判定
 * @private
 * @param {string} url Swfの可能性のあるURL
 * @return {boolean} true:SwfのURL,false:SwfのURLでない
 */
Util.$isSwfUrl = function(url) {
  var len = 0;
  var result = false;
  //空でなく文字列の場合
  if(url && Util.$isString(url)) {
    len = url.length;
    //長さが４文字以上の場合
    if(len >= 4) {
      //拡張子が.swfの場合はtrue
      if(url.substring(len - 4).toLowerCase() == '.swf') {
        result = true;
      }
    }
  }
  return result;
};
//ACT0074 2011.10.28 end


/*
 * 内部alert表示
 */
Util.$alert = function(message) {
  if(Util.DEBUGFLAG) {
    alert(message);
  }
};
/*
 * 例外内部alert表示
 */
Util.$eAlert = function(e) {
  // [TODO]メッセージの表現方法は後日再考
  if(e instanceof Exception) {
    Util.$alert(e.message);
  }
  else if(e instanceof Error) {
    Util.$alert(e.message);
  } else {
    Util.$alert(e);
  }
};

//ACT0005 2011.02.28 start
/*
 * Windowクライアント領域の幅/高さ取得
 * in : isStrict :  true/false DOCTYPEがStrictか否か(省略時true)
 * 注意：DOMDocumentReadyイベント(init関数呼び出しタイミング)の時点では
 *       Window未構築の場合があるため正しい値が取得できないことがある
 *       load,resizeイベント内で使用すること
 */
// 幅取得
Util.$getClientWidth = function(isStrict) {
  if(Browser.IE) {
    if (isStrict == undefined || isStrict == true){
      return document.documentElement.clientWidth;
    } else {
      return document.body.clientWidth;
    }
  } else {
  	return window.innerWidth;
  }
};

// 高さ取得
Util.$getClientHeight = function(isStrict) {
  if(Browser.IE) {
    if (isStrict == undefined || isStrict == true){
      return document.documentElement.clientHeight;
    } else {
      return document.body.clientHeight;
    }
  } else {
  	return window.innerHeight;
  }
};
//ACT0005 2011.02.28 end

//ACT0008 2011.03.07 start
/**
 * iframe生成処理<br />
 * 親要素(div等)の中にiframeを生成する
 * @param {string} targetID 親要素(div等)のID
 * @param {string} srcPath src属性の設定値
 * @param {string} frameBorder frameborder属性の設定値
 * @param {string} className class属性の設定値
 * @param {string} scrolling スクロール属性の設定値
 * @param {function} complete iframe表示完了時処理
 * @return {Element} 生成したiframe要素<br />
 * 生成したiframe要素のname、IDは「targetID + '_contents'」になる
 */
//ACT0077 2011.11.09 start
//Util.$openIframe = function(targetID, srcPath, frameBorder, className, scrolling) {
Util.$openIframe = function(targetID, srcPath, frameBorder, className, scrolling, complete) {
//ACT0077 2011.11.09 end
  var iframeObj = null;
  var target = $(targetID);
  var head = null;
  if(target) {
    target.innerHTML = '';
    head = document.createElement('div');
    head.id = targetID + '_head';
    target.appendChild(head);
    //IE6の場合はcreateElementでnameを指定
    if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0){
      iframeObj = document.createElement('<iframe name="' + targetID + '_contents"></iframe>');
    //IE6以外はプロパティでnameを指定
    }else{
      iframeObj = document.createElement('iframe');
      iframeObj.name = targetID + '_contents';
    }
    //スクロール設定をする（デフォルト：auto）
    if(scrolling) {
      iframeObj.scrolling = scrolling;
    }
    //frameborderの指定がある場合は設定する
    if(frameBorder) {
      iframeObj.frameBorder = frameBorder;
    }
    //classの指定がある場合は設定する
    if(className) {
      iframeObj.className = className;
    }
    target.appendChild(iframeObj);
    //ACT0077 2011.11.09 start
    //完了時処理があれば登録
    if(Util.$isFunction(complete)) {
      Event.$observe(iframeObj, 'load', complete);
    }
    //ACT0077 2011.11.09 end
    iframeObj.src = srcPath;
    iframeObj.id = targetID + '_contents';
    
    //ACT0020 2011.04.11 start
    //右クリック抑止フラグがONの場合は新たにiframeを生成したときに
    //iframe内のコンテキストメニューも抑止する
    if(Util.isStopMouseContextMenu) {
      iframeObj.oncontextmenu = (function() {return false;});
      //IEの場合
      if(Browser.IE) {
        iframeObj.document.oncontextmenu = (function() {return false;});
      //FFの場合
      } else if(Browser.GECKO) {
        iframeObj.contentDocument.addEventListener(
            'contextmenu',
            (function(event) {event.preventDefault();}),
            false);
      //GCの場合
      } else {
        iframeObj.contentDocument.addEventListener(
            'contextmenu',
            (function() {return false;}),
            false);
      }
    }
    //ACT0020 2011.04.11 end
  }
  return iframeObj;
};

/**
 * iframeクローズ処理<br />
 * 親要素(div等)の中のiframeを削除する
 * @param {string} targetID 親要素(div等)のID
 */
Util.$closeIframe = function(targetID) {
  var target = $(targetID);
  if(target) {
    target.innerHTML = '';
  }
}
//ACT0008 2011.03.07 end
//ACT0011 2011.03.15 start
/**
 * アンカージャンプ共通機能
 * @param {string} targetID ターゲットID
 */
Util.$jumpAnchor = function(targetID) {
  var aEl = null;
  var bodyEl = null;

  //対象がある場合のみ動作
  if($(targetID)) {
    //IE6の場合はダミーのアンカーを作ってジャンプする
    if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
      aEl = document.createElement('a');
      aEl.href = '#' + targetID;
      aEl.style.display = 'none';
      bodyEl = $$("body")[0];
      bodyEl.appendChild(aEl);
      aEl.click();
      bodyEl.removeChild(aEl);
      bodyEl = null;
      aEl = null;

    //IE6以外はlocation.hashでジャンプする
    } else {
      //ACT0085 2012.08.31 start
      // 同じアンカーは連続して使えないため、一度クリアする
      window.location.hash = null;
      //ACT0085 2012.08.31 end
      window.location.hash = targetID;
    }
  }
};
//ACT0011 2011.03.15 end
//ACT0079 2011.12.28 start
/**
 * アンカージャンプ共通機能をIEのみ実行
 * @param {string} targetID ターゲットID
 */
Util.$jumpAnchorIE = function(targetID) {
  //IEの場合はアンカージャンプ共通機能を実行
  if(Browser.IE) {
    Util.$jumpAnchor(targetID);
  }
};
//ACT0079 2011.12.28 end
//ACT0017 2011.03.28 start
/**
 * ActiveX／プラグインの使用可能チェック
 * @param {string} activeXName ActiveX名
 * @param {string} pluginName プラグイン名
 * @return {boolean} true:使用可能、false:使用不可能
 */
Util.$canUsePlugin = function(activeXName, pluginName) {
  //IEの場合はActiveXObjectを使う
  if(Browser.IE) {
    try {
      var obj = new ActiveXObject(activeXName);
    } catch (e) {
      return false;
    }
    return true;
  //IEの以外の場合はnavigatorのプラグインを使う
  } else {
    var sample = navigator.plugins[pluginName];
    if(sample == null) {
      return false;
    }
    return true;
  }
};

/**
 * ActiveX／プラグイン要素生成処理
 * @param {string} activeXHTML ActiveXHTML(object)
 * @param {string} pluginHTML プラグインHTML(embed)
 * @return {Element} プラグインのタグを含んだdiv要素
 */
Util.$createPluginElement = function(activeXHTML, pluginHTML) {
  var divEl = new Element('div');
  //ACT0081 2012.04.12 start
  divEl.style.width = '0px';
  divEl.style.height = '0px';
  //ACT0081 2012.04.12 end
  //IEの場合はActiveXのHTMLを使う
  if(Browser.IE) {
    divEl.innerHTML = activeXHTML;
  //IEの以外の場合はembedのHTMLを使う
  } else {
    divEl.innerHTML = pluginHTML;
  }
  return divEl;
};
//ACT0017 2011.03.28 end
//ACT0018 2011.04.01 start
/**
 * Windowクローズ処理
 */
Util.$closeWindow = function() {
  //openerがある場合は通常にクローズ
  if(window.opener && window.opener != window) {
    window.close();
  //parentがある場合は通常にクローズ
  } else if(window.parent && window.parent != window) {
    window.close();
  //それ以外の場合（単体で起動）
  } else {
    //IE6の場合は警告ダイアログ抑止のため固有のクローズ処理を行う
    if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
      window.opener = window;
      window.close();
    //IE9の場合は警告ダイアログ抑止のため固有のクローズ処理を行う,ACT0027
    } else if(Browser.IE) {
      window.open('', '_parent');
      window.close();
    //Chromeの場合は固有のクローズ処理を行う
    } else if(Browser.WEBKIT) {
      window.open(location.href, '_self');
      window.close();
    //FireFoxの場合は固有のクローズ処理を行う（FireFox3以降は無効）
    } else if(Browser.GECKO) {
      window.open(location.href, '_self');
      window.close();
    //それ以外は標準のクローズ処理を行う
    } else {
      window.close();
    }
  }
};
//ACT0018 2011.04.01 end
//ACT0020 2011.04.11 start
/**
 * 右クリック抑止フラグ
 */
Util.isStopMouseContextMenu = false;

/**
 * 右クリック抑止
 */
Util.$stopMouseContextMenu = function() {
  var iframes = $$('iframe');
  var len = iframes.length;
  //右クリック抑止フラグをON
  Util.isStopMouseContextMenu = true;
  //コンテキストメニューを抑止
  document.oncontextmenu = (function() {return false;});
  //全てのiframe内のコンテキストメニューも抑止
  for(var i = 0; i < len; i++) {
    //IEの場合
    if(Browser.IE) {
      iframes[i].document.oncontextmenu = (function() {return false;});
    //FFの場合
    } else if(Browser.GECKO) {
      iframes[i].contentDocument.addEventListener(
          'contextmenu',
          (function(event) {event.preventDefault();}),
          false);
    //GCの場合
    } else {
      iframes[i].contentDocument.addEventListener(
          'contextmenu',
          (function() {return false;}),
          false);
    }
  }
};
//ACT0020 2011.04.11 end

//ACT0080 2012.02.01 start
/**
 * 画面抑止フラグ
 */
Util.isWindowDisabled = false;

/**
 * 指定エリア抑止フラグ
 */
Util.isAreaDisabled = false;
//ACT0080 2012.02.01 end

//ACT0022 2011.04.13 start
(function() {
  /**
   * 画面スクロールスタイル
   */
  var _windowDisabled = false;

  //ACT0059 2011.09.05 start
  ///**
  // * 画面スクロールスタイル
  // */
  //var _preWindowOverflowStyle = '';
  //ACT0059 2011.09.05 end

  //ACT0080 2012.02.01 start
  ///**
  // * マウスカーソルスタイル
  // */
  //var _preMouseCursorStyle = '';
  //ACT0080 2012.02.01 end

  /**
   * リサイズ処理（IE6用）
   */
  var _resizeOverlay = function() {
    var result = document.documentElement.scrollHeight >
        document.documentElement.offsetHeight ?
        document.documentElement.scrollHeight + 'px' :
        document.documentElement.offsetHeight + 'px';
    return result;
  };

  //ACT0032 2011.06.15 start
  /**
   * キーダウン監視
   * @private
   * @param {Event} evt イベントオブジェクト
   */
  var _keyDownListener = function(evt) {
    Event.$stop(evt);
  };
  //ACT0032 2011.06.15 end

  //ACT0041 2011.07.26 start
  //透過率の設定(0.0は透明)
  var OVERLAY_OPACITY = 0.0;
  //ACT0041 2011.07.26 end

  /**
   * 画面抑止
   */
  var disableWindow = function() {
    var overlay = $('window_overlay');
    var overlay2 = $('window_overlay2');
    var body =$$('body')[0];
    var html = $$('html')[0];
    //すでに抑止されている場合は処理をしない
    if(!_windowDisabled) {
      //カーソルを砂時計にする
      //ACT0080 2012.02.01 start
      //_preMouseCursorStyle = document.body.style.cursor;
      Util.isWindowDisabled = true;
      //ACT0080 2012.02.01 end
      document.body.style.cursor = 'wait';

      //IE6の場合
      //ACT0072 2011.10.26 start
      //IE6の場合
      //if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
      if(Browser.IE && Browser.PRODUCT_VERSION <= 8.0) {
      //ACT0072 2011.10.26 end
        //抑止用divタグがなければ生成
        if(!overlay) {
          overlay = new Element('div');
          overlay.id = 'window_overlay';
          Element.$setStyle(overlay, {
            'position'          : 'absolute',
            'top'               : '0px',
            'left'              : '0px',
            'height'            : _resizeOverlay(),
            'width'             : '100%',
            'display'           : 'none',
            'backgroundColor'   : '#000000',
            'zIndex'            : '99'
          });
        }
        //抑止用iframeタグがなければ生成
        if(!overlay2) {
          overlay2 = new Element('<iframe id="window_overlay2" />');
          Element.$setStyle(overlay2, {
            'position'          : 'absolute',
            'top'               : '0px',
            'left'              : '0px',
            'height'            : _resizeOverlay(),
            'width'             : '100%',
            'display'           : 'none',
            'background'        : 'none',
            'zIndex'            : '98',
            'opacity'           : '0.0',
            'filter'            : 'Alpha(opacity=0)'
          });
        }
        Event.$observe(window, 'resize',
            function() {
              var height = _resizeOverlay();
              $('window_overlay').style.height = height;
              $('window_overlay2').style.height = height;
            });
        body.appendChild(overlay2);
        body.appendChild(overlay);
        //ACT0041 2011.07.26 start
        Element.$setOpacity(overlay, OVERLAY_OPACITY);
        //ACT0041 2011.07.26 end
        Element.$show(overlay);
        Element.$show(overlay2);
      //FireFoxの場合
      } else if(Browser.GECKO) {
        //抑止用divタグがなければ生成
        if(!overlay) {
          overlay = new Element('div');
          overlay.id = 'window_overlay';
          Element.$setStyle(overlay, {
            'position'          : 'fixed',
            'top'               : '0px',
            'left'              : '0px',
            'height'            : '100%',
            'width'             : '100%',
            'display'           : 'none',
            'backgroundColor'   : '#000000',
            'zIndex'            : '99'
          });
        }
        body.appendChild(overlay);
        //ACT0041 2011.07.26 start
        Element.$setOpacity(overlay, OVERLAY_OPACITY);
        //ACT0041 2011.07.26 end
        Element.$show(overlay);
      //その他のブラウザの場合
      } else {
        //抑止用divタグがなければ生成
        if(!overlay) {
          overlay = new Element('div');
          overlay.id = 'window_overlay';
          Element.$setStyle(overlay, {
            'position'          : 'fixed',
            'top'               : '0px',
            'left'              : '0px',
            'height'            : '100%',
            'width'             : '100%',
            'display'           : 'none',
            'background-color'  : '#000000',
            'z-index'           : '99'
          });
        }
        body.appendChild(overlay);
        //ACT0041 2011.07.26 start
        Element.$setOpacity(overlay, OVERLAY_OPACITY);
        //ACT0041 2011.07.26 end
        Element.$show(overlay);
      }
      //ACT0059 2011.09.05 start
      ////htmlのスクロールを抑止（FireFox以外）
      ////FireFoxでこの処理をするとIMEの動作に問題があるため
      ////実行しない（FireFoxではスクロールは出ないため問題なし）
      //if(!Browser.GECKO) {
      //  _preWindowOverflowStyle = html.style.overflow;
      //  html.style.overflow = 'hidden';
      //}
      //ACT0059 2011.09.05 end

      //ACT0032 2011.06.15 start
      // bodyタグをフォーカス可能にする
      body._tabIndex = body.tabIndex;
      //ACT0060 2011.09.05 start
      //body.tabIndex = 0;
      body.tabIndex = 1;
      //ACT0060 2011.09.05 end

      // キーイベント登録
      Event.$observe(document, 'keydown', _keyDownListener);

      //// フォーカス遷移制御(accessKey:アクセラレータキーは対象外)
      //// tabIndex退避＆セット
      //// [TODO]IE6で<object>タグの場合、_tabIndexが追加できない。
      ////       close時に復帰出来ない。
      ////       <object>タグを使用する場合、再度調整する。
      //var els = $$('a', 'area', 'button', 'input', 'object', 'select', 'textarea', 'iframe');
      //for(var i = 0, il = els.length; i < il; i++) {
      //  //tabIndexが-1でない場合はtab移動が有効なので
      //  //tabIndexを-1にする
      //  if(els[i].tabIndex != -1) {
      //    els[i]._tabIndex = els[i].tabIndex;
      //    els[i].tabIndex = -1;
      //  }
      //}
      ////iframeの中のタグの抑止。iframeの中にiframeがあるケースはないものとする
      //var iframes = $$('iframe');
      //var TAGS = ['a', 'area', 'button', 'input', 'object', 'select', 'textarea'];
      //var childEls = [];
      ////すべてのiframeを処理する
      //for(var i = 0, il = iframes.length; i < il; i++) {
      //  //すべてのフォーカスの当たるタグを対象
      //  for(var j = 0, jl = TAGS.length; j < jl; j++) {
      //    //ブラウザによってiframe内のアクセス禁止されることがあるので
      //    //その場合は除外
      //    try {
      //      childEls = iframes[i].contentWindow.document.getElementsByTagName(TAGS[j]);
      //      //すべてのタグのtabIndexを設定する
      //      for(var k = 0, kl = childEls.length; k < kl; k++) {
      //        //tabIndexが-1でない場合はtab移動が有効なので
      //        //tabIndexを-1にする
      //        if(childEls[k].tabIndex != -1) {
      //          childEls[k]._tabIndex = childEls[k].tabIndex;
      //          childEls[k].tabIndex = -1;
      //        }
      //      }
      //    } catch(e) {
      //    }
      //  }
      //}
      //ACT0032 2011.06.15 end
      
      //画面抑止中フラグON
      _windowDisabled = true;
    }
  };

  /**
   * 画面抑止解除
   */
  var enableWindow = function() {
    var overlay = $('window_overlay');
    var overlay2 = $('window_overlay2');
    var html = $$('html')[0];
    //画面抑止中のみ動作
    if(_windowDisabled) {
      //画面抑止中フラグOFF
      _windowDisabled = false;
      
      //ACT0032 2011.06.15 start
      //// フォーカス遷移制御 tabIndex復帰
      //var els = $$('a', 'area', 'button', 'input', 'object', 'select', 'textarea', 'iframe');
      //for(var i = 0, il = els.length; i < il; i++) {
      //  if(!Util.$isUndefined(els[i]._tabIndex)) {
      //    els[i].tabIndex = els[i]._tabIndex;
      //  }
      //}

      ////iframe内のtabIndexの復帰
      //var iframes = $$('iframe');
      //var TAGS = ['a', 'area', 'button', 'input', 'object', 'select', 'textarea'];
      //var childEls = [];
      ////すべてのiframeに対して処理
      //for(var i = 0, il = iframes.length; i < il; i++) {
      //  //すべてのフォーカスの当たるタグに対して処理
      //  for(var j = 0, jl = TAGS.length; j < jl; j++) {
      //    //すべてのタグに対して処理
      //    for(var k = 0, kl = childEls.length; k < kl; k++) {
      //      //退避したtabIndexを元に戻す
      //      if(!Util.$isUndefined(childEls[k]._tabIndex)) {
      //        childEls[k].tabIndex = childEls[k]._tabIndex;
      //      }
      //    }
      //  }
      //}

      // キーイベント削除
      // ※イベント登録していない場合、stopObserving内部でスキップされる。
      Event.$stopObserving(document, 'keydown', _keyDownListener);

      // bodyタグのtabIndexを復帰
      var body = $$('body')[0];
      body.tabIndex = body._tabIndex;
      //ACT0032 2011.06.15 end
      
      //抑止用divタグを隠す（あれば）
      if(overlay) {
        Element.$hide(overlay);
      }
      //抑止用iframeタグを隠す（あれば）
      if(overlay2) {
        Element.$hide(overlay2);
      }
      //ACT0059 2011.09.05 start
      ////htmlのスクロールスタイルを復帰
      //html.style.overflow = _preWindowOverflowStyle;
      //ACT0059 2011.09.05 end
      
      //ACT0080 2012.02.01 start
      ////カーソルを復帰
      //document.body.style.cursor = _preMouseCursorStyle;
      Util.isWindowDisabled = false;
      //指定エリア抑止が無効の場合
      if(Util.isAreaDisabled == false) {
        //カーソルを復帰
        document.body.style.cursor = 'auto';
      }
      //ACT0080 2012.02.01 end
    }
  };

  Util.$propcopy({
    $disableWindow  : disableWindow,
    $enableWindow   : enableWindow
  }, Util);
})();
//ACT0022 2011.04.13 end
//ACT0072 2011.10.26 start
Util.disableAreas = null;
(function() {
  var _disableEventListener = function(evt) {
    Event.$stop(evt);
  };
  /**
   * 指定エリアの抑止
   * @param Array(Element) elements 抑止エリアElement（配列）
   */
  var _disableArea = function(elements) {
    var len = 0;
    //引数が配列のときのみ処理
    if(Util.$isArray(elements)) {
      //一旦解除
      Util.$enableArea();
      //ACT0080 2012.02.01 start
      Util.isAreaDisabled = true;
      //カーソルを砂時計にする
      document.body.style.cursor = 'wait';
      //ACT0080 2012.02.01 end
      Util.disableAreas = elements;
      len = elements.length;
      //リスナを割付ける
      for(var i = 0; i < len; i++) {
        Event.$observe(elements[i], 'keydown', _disableEventListener);
        Event.$observe(elements[i], 'click', _disableEventListener);
      }
      
    }
  };
  /**
   * 指定エリアの抑止解除
   */
  var _enableArea = function() {
    var elements = Util.disableAreas;
    var len = 0;
    //抑止中のときのみ処理
    if(Util.$isArray(elements)) {
      len = elements.length;
      //リスナを全解放
      for(var i = 0; i < len; i++) {
        Event.$stopObserving(elements[i], 'keydown', _disableEventListener);
        Event.$stopObserving(elements[i], 'click', _disableEventListener);
      }
    }
    Util.disableAreas = null;
    elements = null;

    //ACT0080 2012.02.01 start
    Util.isAreaDisabled = false;
    //画面抑止が無効の場合
    if(Util.isWindowDisabled == false) {
      //カーソルを復帰
      document.body.style.cursor = 'auto';
    }
    //ACT0080 2012.02.01 end
  };
  Util.$propcopy({
    $disableArea    : _disableArea,
    $enableArea     : _enableArea
  }, Util);
})();
//ACT0072 2011.10.26 end
//ACT0013 2011.04.15 start
/**
 * インデックス取得処理
 * @param {Array} ary 配列
 * @param {object} obj 配列の要素
 * @return {number} 要素のインデックス<br />
 * 配列に要素がない場合は-1を返す
 */
Util.$getIndexOfArray = function(ary, obj) {
  var len = 0;
  //配列がある場合
  if(ary) {
    //配列である場合
    if(Util.$isArray(ary)) {
      //IEの場合
      if(Browser.IE) {
        //配列の要素をループ
        for(var i = 0, len = ary.length; i < len; i++) {
          //等しい場合そのインデックスを返す
          if(ary[i] === obj) {
            return i;
          }
        }
      //IE以外は標準のindexOfを返す
      } else {
        return ary.indexOf(obj);
      }
    }
  }
  return -1;
};
//ACT0013 2011.04.15 end
//ACT0024 2011.04.25 start
(function() {
  //ショートカット抑止機能設定フラグ
  var _isShortCutOptionsSet = false;

  //ショートカット抑止機能情報
  var _shortCutOptions = {};

  /**
   * キーイベント停止処理
   * @private
   * @param {Event} evt イベントオブジェクト
   */
  var _stopKeyEvent = function(evt) {
    Event.$stop(evt);
    //IE6の場合はkeyCodeも無効にする
    //if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
    //  evt.keyCode = 0;
    //}
  };

  /**
   * ショートカットキーイベント処理
   * @private
   * @param {Event} evt イベントオブジェクト
   */
  var _keyDownHandler = function(evt) {
    var keyCode = 0;
    //IE9の場合はグローバルのイベントにアクセスする,ACT0027
    if(Browser.IE && Browser.PRODUCT_VERSION >= 8.0) {
      evt = window.event ? window.event : evt;
    }
    keyCode = Event.$getKeyCode(evt);

    //新しいウィンドウでリンクを開く
    if(_shortCutOptions.openNewWindowByLink) {
      //SHIFT+ENTER
      if(!evt.ctrlKey && evt.shiftKey && keyCode === Event.KEY_RETURN) {
        _stopKeyEvent(evt);
        return false;
      }
    }
    //後ろに新しいタブを作成してリンクを開く,ACT0027
    if(_shortCutOptions.openNextTabByLink) {
      if((Browser.IE && Browser.PRODUCT_VERSION >= 8.0)
          || Browser.WEBKIT || Browser.GECKO) {
        //CTRL+ENTER
        if(evt.ctrlKey && !evt.shiftKey && keyCode === Event.KEY_RETURN) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //前面に新しいタブを作成してリンクを開く,ACT0027
    if(_shortCutOptions.openPrevTabByLink) {
      if((Browser.IE && Browser.PRODUCT_VERSION >= 8.0)
          || Browser.WEBKIT || Browser.GECKO) {
        //CTRL+SHIFT+ENTER
        if(evt.ctrlKey && evt.shiftKey && keyCode === Event.KEY_RETURN) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //タブを複製する(現在のタブを新しいタブで開く),ACT0027
    if(_shortCutOptions.cloneTab) {
      if(Browser.IE && Browser.PRODUCT_VERSION >= 8.0) {
        //CTRL+K
        if(evt.ctrlKey && keyCode === 75) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //直前に閉じたタブを復元
    if(_shortCutOptions.restorePrevTab) {
      if(Browser.WEBKIT || Browser.GECKO) {
        //CTRL+SHIFT+T
        if(evt.ctrlKey && evt.shiftKey && keyCode === 84) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //直前に閉じたウィンドウを復元
    if(_shortCutOptions.restorePrevWindow) {
      if(Browser.GECKO) {
        //CTRL+SHIFT+N
        if(evt.ctrlKey && evt.shiftKey && keyCode === 78) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //現在のWeb ページを更新
    if(_shortCutOptions.updatePage) {
      //F5 または Ctrl + R
      if(keyCode === 116 || (evt.ctrlKey && keyCode === 82)) {
        _stopKeyEvent(evt);
        return false;
      }
    }
    //Web 上と自分のコンピュータ上でページのタイムスタンプが同じ場合も
    //現在の Web ページを更新する(キャッシュを含めて強制更新)
    if(_shortCutOptions.updatePageForce) {
      if(Browser.IE) {
        //Ctrl + F5
        if(evt.ctrlKey && keyCode === 116) {
          _stopKeyEvent(evt);
          return false;
        }
      } else if(Browser.WEBKIT || Browser.GECKO) {
        //Ctrl + Shift + R または Ctrl + F5
        if((evt.ctrlKey && evt.shiftKey && keyCode === 82)
            || (evt.ctrlKey && keyCode === 116)) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //ページのダウンロードを中止
    if(_shortCutOptions.cancelDownload) {
      //ESC
      if(keyCode === 27) {
        _stopKeyEvent(evt);
        return false;
      }
    }
    //次のページに移動「進む」
    if(_shortCutOptions.nextPage) {
      if(Browser.IE) {
        //Alt + →
        if(evt.altKey && keyCode === 39) {
          _stopKeyEvent(evt);
          return false;
        }
      } else if(Browser.WEBKIT || Browser.GECKO) {
        //Alt + →または Shift + BackSpace
        if((evt.altKey && keyCode === 39)
            || (evt.shiftKey && keyCode === Event.KEY_BACKSPACE)) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //前のページに移動「戻る」
    if(_shortCutOptions.prevPage) {
      //Alt + ←
      if(evt.altKey && keyCode === 37) {
        _stopKeyEvent(evt);
        return false;
        
      //BackSpace
      } else if(keyCode === Event.KEY_BACKSPACE) {
        var srcEl = evt.srcElement ? evt.srcElement : evt.originalTarget;
        var isTextBox = false;
        var tagName = srcEl.tagName.toLowerCase();
        //ACT0078 2011.11.14 start
        var isReadOnly = srcEl.readOnly;
        //テキストエリアの場合は除外
        if(tagName == 'textarea' && isReadOnly == false) {
          isTextBox = true;
        //inputタグの場合
        } else if(tagName == 'input') {
          var type = srcEl.type.toLowerCase();
          //typeがない場合はテキストボックス（除外）
          if(!type) {
            isTextBox = true;
          //typeが'text'の場合はテキストボックス（除外）
          } else if(type == 'text' && isReadOnly == false) {
            isTextBox = true;
          }
        }
        //ACT0078 2011.11.14 end
        //テキストボックス以外の場合は抑止する
        if(!isTextBox) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //リンクのショートカット メニューを表示(右クリックメニューと同じ)
    if(_shortCutOptions.contextMenu) {
      //Shift + F10
      if(evt.shiftKey && keyCode === 121) {
        _stopKeyEvent(evt);
        return false;
      }
    }
    //お気に入りバーを表示
    if(_shortCutOptions.showFavorites) {
      if(Browser.IE) {
        //Ctrl + I
        if(evt.ctrlKey && keyCode === 73) {
          _stopKeyEvent(evt);
          return false;
        }
      } else if(Browser.WEBKIT || Browser.GECKO) {
        //Ctrl + B または Ctrl + I
        if((evt.ctrlKey && keyCode === 66)
            || (evt.ctrlKey && keyCode === 73)) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //現在のページをお気に入りに追加
    if(_shortCutOptions.addPageToFavorite) {
      //Ctrl + D
      if(evt.ctrlKey && keyCode === 68) {
        _stopKeyEvent(evt);
        return false;
      }
    }
    //すべてのタブをお気に入りに追加
    if(_shortCutOptions.addAllTabsToFavorite) {
      if(Browser.WEBKIT || Browser.GECKO) {
        //Ctrl + Shift + D
        if(evt.ctrlKey && evt.shiftKey && keyCode === 68) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }
    //ソースを表示
    if(_shortCutOptions.showSource) {
      if(Browser.WEBKIT || Browser.GECKO) {
        //Ctrl + U
        if(evt.ctrlKey && keyCode === 85) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    return true;
  };

  /**
   * マウスホイールイベント処理
   * @param {Event} evt イベントオブジェクト
   */
  var _mouseWheelHandler = function(evt) {
    var delta = 0;
    //IEの場合はグローバルのイベントにアクセスする
    if(Browser.IE) {
      evt = window.event ? window.event : evt;
    }
    //マウスのホイールの回転量を取得(FF以外)
    if(evt.wheelDelta) {
      delta = evt.wheelDelta / 120;
    //マウスのホイールの回転量を取得(FF)
    } else if(evt.detail) {
      delta = -evt.detail;
    }
    //次のページに移動「進む」
    if(_shortCutOptions.nextPage) {
      //Shift + マウスホイール回転↑
      if(evt.shiftKey && delta > 0) {
        Event.$stop(evt);
        return false;
      }
    }
    //前のページに移動「戻る」
    if(_shortCutOptions.prevPage) {
      if(evt.shiftKey && delta < 0) {
        Event.$stop(evt);
        return false;
      }
    }

    return true;
  };

  /**
   * マウスクリックイベント処理
   * @param {Event} evt イベントオブジェクト
   */
  var _mouseClickHandler = function(evt) {
    //IEの場合はグローバルのイベントにアクセスする
    if(Browser.IE) {
      evt = window.event ? window.event : evt;
    }
    //新しいウィンドウでリンクを開く
    if(_shortCutOptions.openNewWindowByLink) {
      //SHIFT+クリック
      if(!evt.ctrlKey && evt.shiftKey) {
        Event.$stop(evt);
        return false;
      }
    }
    //後ろに新しいタブを作成してリンクを開く
    if(_shortCutOptions.openNextTabByLink) {
      if((Browser.IE && Browser.PRODUCT_VERSION >= 8.0)
          || Browser.WEBKIT || Browser.GECKO) {
        //CTRL+クリック
        if(evt.ctrlKey && !evt.shiftKey) {
          Event.$stop(evt);
          return false;
        }
      }
    }
    //前面に新しいタブを作成してリンクを開く
    if(_shortCutOptions.openPrevTabByLink) {
      if((Browser.IE && Browser.PRODUCT_VERSION >= 8.0)
          || Browser.WEBKIT || Browser.GECKO) {
        //CTRL+SHIFT+クリック
        if(evt.ctrlKey && evt.shiftKey) {
          Event.$stop(evt);
          return false;
        }
      }
    }

    return true;
  };

  /**
   * ショートカット抑止
   * @param {object(連想配列)} options 抑止するショートカット機能<br />
   * {<br />
   * openNewWindowByLink   : true/false(デフォルト) 新しいウィンドウでリンクを開く,<br />
   * openNextTabByLink     : true/false(デフォルト) 後ろに新しいタブを作成してリンクを開く,<br />
   * openPrevTabByLink     : true/false(デフォルト) 前面に新しいタブを作成してリンクを開く,<br />
   * cloneTab              : true/false(デフォルト) タブを複製する(現在のタブを新しいタブで開く),<br />
   * restorePrevTab        : true/false(デフォルト) Tab直前に閉じたタブを復元,<br />
   * restorePrevWindow     : true/false(デフォルト) 直前に閉じたウィンドウを復元,<br />
   * updatePage            : true/false(デフォルト) 現在のWeb ページを更新,<br />
   * updatePageForce       : true/false(デフォルト) Web 上と自分のコンピュータ上でページのタイムスタンプが同じ場合も現在の Web ページを更新する(キャッシュを含めて強制更新),<br />
   * cancelDownload        : true/false(デフォルト) ページのダウンロードを中止,<br />
   * nextPage              : true/false(デフォルト) 次のページに移動「進む」,<br />
   * prevPage              : true/false(デフォルト) 前のページに移動「戻る」,<br />
   * contextMenu           : true/false(デフォルト) リンクのショートカット メニューを表示(右クリックメニューと同じ),<br />
   * showFavorites         : true/false(デフォルト) お気に入りバーを表示,<br />
   * addPageToFavorite     : true/false(デフォルト) 現在のページをお気に入りに追加,<br />
   * addAllTabsToFavorite  : true/false(デフォルト) すべてのタブをお気に入りに追加,<br />
   * showSource            : true/false(デフォルト) ソースを表示<br />
   * }
   */
  var stopShortCut = function(options) {
    //オプション指定がある場合は設定する
    if(options) {
      _shortCutOptions = options;
      //ショートカットオプションイベント未設定の場合は設定する
      if(!_isShortCutOptionsSet) {
        var _keyDownFunc = null;
        var _mouseWheelFunc = null;
        var _mouseClickFunc = null;
        //システムエラーのコールバックが登録されてる場合は例外発生時に
        //コールバックする
        if(Util.$isFunction(Util.callbackSystemError)) {
          _keyDownFunc = (function(evt) {
            try {
              return _keyDownHandler.apply(this, [evt]);
            } catch(e) {
              Util.callbackSystemError(e);
            }
          });
          _mouseWheelFunc = (function(evt) {
            try {
              return _mouseWheelHandler.apply(this, [evt]);
            } catch(e) {
              Util.callbackSystemError(e);
            }
          });
          _mouseClickFunc = (function(evt) {
            try {
              return _mouseClickHandler.apply(this, [evt]);
            } catch(e) {
              Util.callbackSystemError(e);
            }
          });
        //システムエラーのコールバックが登録されない場合は標準動作
        } else {
          _keyDownFunc = _keyDownHandler;
          _mouseWheelFunc = _mouseWheelHandler;
          _mouseClickFunc = _mouseClickHandler;
        }
        
        //ショートカットキーイベント登録
        Event.$observe(document, 'keydown', _keyDownFunc);
        
        //マウスホイールイベント登録
        //FFの場合
        if(Browser.GECKO) {
          window.addEventListener('DOMMouseScroll', _mouseWheelFunc, false);
        //IEの場合
        } else if(Browser.IE) {
          Event.$observe(document, 'mousewheel', _mouseWheelFunc);
        //GCの場合
        } else {
          Event.$observe(window, 'mousewheel', _mouseWheelFunc);
        }

        //マウスクリックイベント登録
        Event.$observe(document, 'click', _mouseClickFunc);

        _isShortCutOptionsSet = true;
      }
    }
  };

  /**
   * observeの割込み処理
   * @param {string} eventName イベント名
   * @param {Event} evt イベントオブジェクト
   */
  var handleShortCut = function(eventName, evt) {
    var result = true;
    var _keyDownFunc = null;
    var _mouseWheelFunc = null;
    var _mouseClickFunc = null;
    //システムエラーのコールバックが登録されてる場合は例外発生時に
    //コールバックする
    if(Util.$isFunction(Util.callbackSystemError)) {
      _keyDownFunc = (function(evt) {
        try {
          return _keyDownHandler.apply(this, [evt]);
        } catch(e) {
          Util.callbackSystemError(e);
        }
      });
      _mouseWheelFunc = (function(evt) {
        try {
          return _mouseWheelHandler.apply(this, [evt]);
        } catch(e) {
          Util.callbackSystemError(e);
        }
      });
      _mouseClickFunc = (function(evt) {
        try {
          return _mouseClickHandler.apply(this, [evt]);
        } catch(e) {
          Util.callbackSystemError(e);
        }
      });
    //システムエラーのコールバックが登録されない場合は標準動作
    } else {
      _keyDownFunc = _keyDownHandler;
      _mouseWheelFunc = _mouseWheelHandler;
      _mouseClickFunc = _mouseClickHandler;
    }

    //キーダウンイベントの場合
    if(eventName == 'keydown') {
      result = _keyDownFunc(evt);

    //マウスホイールイベントの場合
    } else if(eventName == 'mousewheel') {
      result = _mouseWheelFunc(evt);

    //マウスクリックイベントの場合
    } else if(eventName == 'click') {
      result = _mouseClickFunc(evt);
    }

    return result;
  };

  Util.$propcopy({
    $stopShortCut : stopShortCut,
    $handleShortCut : handleShortCut
  }, Util);
})();
//ACT0024 2011.04.25 end
//ACT0028 2011.05.13 start
/**
 * iframe内のコンテンツのスクロール制御機能
 * @param {number} scrollStatus スクロール設定<br />
 * 0:スクロールしない<br />
 * 1:yスクロールのみ<br />
 * 2:xスクロールのみ<br />
 * 3:x,yスクロール
 * @param {string} overflowValue  overflowの設定値<br />
 * 「visible」「scroll」「hidden」「auto」
 */
Util.$setIframeScroll = function(scrollStatus, overflowValue) {
  var scrollStyle = {};
  //スクロールしない場合
  if(scrollStatus == 0) {
    scrollStyle.overflow = overflowValue;
    scrollStyle.overflowX = 'hidden';
    scrollStyle.overflowY = 'hidden';
    //GCの場合はスクロールの設定をしない（規定値）
    if(Browser.WEBKIT) {
      scrollStyle.overflow = 'visible';
      scrollStyle.overflowX = 'visible';
      scrollStyle.overflowY = 'visible';
    }
    Element.$setStyle($$('html')[0], scrollStyle);
  //yスクロールのみ
  } else if(scrollStatus == 1) {
    scrollStyle.overflow = overflowValue;
    scrollStyle.overflowX = 'hidden';
    //GCの場合はスクロールの設定をしない（規定値）
    if(Browser.WEBKIT) {
      scrollStyle.overflow = 'visible';
      scrollStyle.overflowX = 'visible';
      scrollStyle.overflowY = 'visible';
    }
    Element.$setStyle($$('html')[0], scrollStyle);
  //xスクロールのみ
  } else if(scrollStatus == 2) {
    scrollStyle.overflow = overflowValue;
    scrollStyle.overflowY = 'hidden';
    //GCの場合はスクロールの設定をしない（規定値）
    if(Browser.WEBKIT) {
      scrollStyle.overflow = 'visible';
      scrollStyle.overflowX = 'visible';
      scrollStyle.overflowY = 'visible';
    }
    Element.$setStyle($$('html')[0], scrollStyle);
  //x,yスクロール
  } else if(scrollStatus == 3) {
    scrollStyle.overflow = overflowValue;
    //GCの場合はスクロールの設定をしない（規定値）
    if(Browser.WEBKIT) {
      scrollStyle.overflow = 'visible';
      scrollStyle.overflowX = 'visible';
      scrollStyle.overflowY = 'visible';
    }
    Element.$setStyle($$('html')[0], scrollStyle);
  //その他
  } else {
    //何もしない
  }
};
//ACT0028 2011.05.13 end
//ACT0029 2011.06.13 start
(function() {
  var _globalLock = 0;
  var _size = { width: 0, height: 0 };
  var _useResizeAgent = false;
  
  /**
   * 周回監視処理（100ミリ秒）
   * @private
   */
  var _loop = function() {
    //ロックがかかってない場合
    if(!_globalLock++) {
      var _getBaseWindow = function(curWin) {
        //親がいる場合はさらに親をさかのぼる
        if(curWin !== curWin.parent) {
          return _getBaseWindow(curWin.parent);
        //親がいない場合は現在のwindowがベース
        } else {
          return curWin;
        }
      };
      var baseWindow = _getBaseWindow(window);
      var size = Element.$getDimensions(baseWindow.document.body);
      //サイズが変わっていたらresizeイベントを呼ぶ
      if(_size.width !== size.width || _size.height !== size.height) {
        _size = size;
        Event.$fireEvent(document.body, 'resize');
      }
      //ロック解除
      setTimeout(function() {
        _globalLock = 0;
      }, 0);
    }
    //タイマー再送
    if(_useResizeAgent) {
      setTimeout(_loop, 100);
    }
  };
  
  /**
   * リサイズ監視エージェント起動(IE6のみ動作)
   */
  var _startResizeAgent = function() {
    _globalLock = 0;
    _useResizeAgent = true;
    //IE6の場合タイマー監視を開始
    if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
      setTimeout(_loop, 100);
    }
  };
  
  /**
   * リサイズ監視エージェント停止
   */
  var _stopResizeAgent = function() {
    _useResizeAgent = false;
  };
  
  Util.$propcopy({
    $startResizeAgent : _startResizeAgent,
    $stopResizeAgent  : _stopResizeAgent
  }, Util);
})();
//ACT0029 2011.06.13 end
//ACT0031 2011.06.14 start
/**
 * 印刷中フラグ(true:印刷中、false:印刷中でない）
 * @private
 * @type boolean
 */
Util.isPrinting = false;
/**
 * 印刷実行処理
 */
Util.$print = function() {
  Util.isPrinting = true;
  //ACT0083 2012.06.28 start
  // FFの場合
  if(Browser.GECKO == true) {
    // 印刷用のスタイルを適用
    Element.$addClassName($("wrapper"), "modeless_wrapper_print");
  }
  //ACT0083 2012.06.28 end
  window.print();
  Util.isPrinting = false;
};
//ACT0031 2011.06.14 end

//ACT0084 2012.07.18 start
/**
 * 印刷プレビュー実行処理
 */
Util.$printPreview = function() {
  var sWebBrowserCode = '';
  var objWebBrowser = null;
  if(window.ActiveXObject == null || document.body.insertAdjacentHTML == null) {
    return;
  }
  sWebBrowserCode = '<object width="0" height="0" classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></object>'; 
  document.body.insertAdjacentHTML('beforeEnd', sWebBrowserCode); 
  objWebBrowser = document.body.lastChild;
  if(objWebBrowser == null) {
    return;
  }
  objWebBrowser.ExecWB(7, 1);
  document.body.removeChild(objWebBrowser);
};
//ACT0084 2012.07.18 end

//ACT0082 2012.06.28 start
/**
 * 印刷用レイアウト追加
 * IE6の場合、コンテンツの表示内容をテーブルで囲う
 */
Util.$printLayout = function() {
  // ACT0090 2013.01.18 start
  // C幅イラストの左寄せ処理
  Use.Util.$delay(
      function() {
        // 印刷用イラストスタイル作成処理
        Util.$insertElementStyle(Util.$illustForPrint(), true);
        // FFの場合のみ、テーブル内のC幅イラストを縮小する
        if(Browser.GECKO == true) {
          Util.$insertElementStyle(Util.$cPtnTableForFF(), true);
        }
        // div.endActBox配下の、C幅イラスト左寄せスタイル作成処理（印刷）
        Util.$insertElementStyle(Util.$cPtnFloatLeftForEndActBox(false), true);

//ACT0101 2013.08.19 start
        // IE10メトロで、印刷時の手順名称の幅を固定値で設定
        if(Browser.METRO == true) {
          Util.$insertElementStyle(
              {"1":"p.s1 span.titleText{width:550px!important;)}"}, true);
        }
//ACT0101 2013.08.19 end

        // div.endActBox配下以外の、C幅イラスト左寄せスタイル作成処理（印刷/リサイズ兼用）
        Util.$insertElementStyle(Util.$cPtnFloatLeft(), false);
        // div.endActBox配下の、C幅イラスト左寄せスタイル作成処理（リサイズ）
        Util.$cPtnFloatLeftForEndActBox(true);
        var myFunc = function() {
          Util.$cPtnFloatLeftForEndActBox(true);
        }
        // リサイズイベントに、div.endActBox配下の、
        // C幅イラスト左寄せスタイル作成処理（リサイズ）を登録
        Use.Util.$observe(window, "resize", myFunc);
      }, 
      0.2);
  // ACT0090 2013.01.18 end
  
  // IE6以外の場合は処理を終了する
  if(!(Browser.IE == true && Browser.PRODUCT_VERSION <= 6.0)) {
    return;
  }
  
  var elmContents = $("contents");
  var elmContentsBody = $("contentsBody");
  var elmContentsBodyNew = null;
  var doc = Util.Selector.$select("> *", elmContentsBody);
  var cnt = doc.length;
  
  var elmTable = document.createElement("table");
  var elmTbody = document.createElement("tbody");
  var elmTr = document.createElement("tr");
  var elmTd = document.createElement("td");
  
  Element.$setStyle(elmTable, "width: 100%; margin: 0px 0px 0px -1px;");
  Element.$setStyle(elmTd, "border-color: #F7F9F9; padding: 0px; vertical-align: top;");
  
  // contentsBodyの子要素をテーブルに移す
  for(var i = 0; i < cnt; i++) {
    Element.$insert(elmTd, doc[i]);
  }
  
  Element.$remove(elmContentsBody);
  
  elmContentsBodyNew = new Element("div");
  Element.$writeAttribute(elmContentsBodyNew, "id", "contentsBody");
  Element.$addClassName(elmContentsBodyNew, elmContentsBody.className);
  
  Element.$insert(elmTr, elmTd);
  Element.$insert(elmTbody, elmTr);
  Element.$insert(elmTable, elmTbody);
  Element.$insert(elmContentsBodyNew, elmTable);
  Element.$insert(elmContents, elmContentsBodyNew);
};
//ACT0082 2012.06.28 end

//ACT0042 2011.08.01 start
/**
 * Error詳細情報取得
 * @param {Error} err エラーオブジェクト
 * @retrurn {string} エラー詳細情報文字列
 */
Util.$getErrorDescription = function(err) {
  var result = '';
  var _appendMessage = function(result, name, value) {
    //属性がある場合は追加
    if(!Util.$isUndefined(value)) {
      result = result + '\n' + name + ':' + value;
    }
    return result;
  };
  //エラーがある場合
  if(err) {
    result = _appendMessage(result, 'name', err.name);
    result = _appendMessage(result, 'message', err.message);
    result = _appendMessage(result, 'number', err.number);
    result = _appendMessage(result, 'description', err.description);
    result = _appendMessage(result, 'filename', err.filename);
    result = _appendMessage(result, 'lineNumber', err.lineNumber);
    result = _appendMessage(result, 'stack', err.stack);
    //先頭の'\n'を削除する
    if(result.length > 0) {
      result = result.substring(1);
    }
  }
  return result;
};

//ACT0086 2012.10.04 start
/**
 *端末の種類
 */
var Terminal={};

Terminal = (function(ua) {
  //ACT0094 2013.05.15 start
  //return{
  //  IPAD   : /iPad/.test(ua)
  //};
  return{
    IPAD   : /iPad/.test(ua),
    TOUCH  : ua.indexOf('Touch') > -1
  };
  //ACT0094 2013.05.15 end
})(window.navigator.userAgent);
//ACT0086 2012.10.04 end

//ACT0042 2011.08.01 end

/*
 *
 */
var Browser = {};

Browser = (function(ua) {
  return {
    IE     : !!window.ActiveXObject && !window.opera,
    GECKO  : ua.indexOf('Gecko')  > -1 && ua.indexOf('KHTML') === -1,
    WEBKIT : ua.indexOf('WebKit') > -1
  };
})(window.navigator.userAgent);

(function(ua) {
  var b = null;
  var c = null;

  if(Browser.IE) {
    b = c = /MSIE\s+([^\);]+)(\)|;)/;
  }
  else if(Browser.GECKO) {
    b = /rv\:([^\);]+)(\)|;)/;
    c = /Firefox\/(\S+)/
  }
  else if(Browser.WEBKIT) {
    b = /WebKit\/(\S+)/;
    c = /Chrome\/(\S+)/;
  }

  if(b) {
    b = b.exec(ua);
    Browser.ENGINE_VERSION = b ? b[1] : "";
  }
  if(c) {
    c = c.exec(ua);
    Browser.PRODUCT_VERSION = c ? c[1] : "";
    //ACT0091 2013.05.15 start
    Browser.PRODUCT_VERSION = parseFloat(Browser.PRODUCT_VERSION);
    //ACT0091 2013.05.15 end
  }

  //ACT0093 2013.05.15 start
  var isActiveX = false;
  try {
    // メトロ以外のIEでtrueになる
    isActiveX = !!new ActiveXObject("htmlfile");
  } catch(e) {
    isActiveX = false;
  }
  Browser.ACTIVEX = isActiveX;
  //ACT0100 2013.06.18 start
  //// IE10(METRO)
  //if(Browser.IE == true 
  //    && Browser.PRODUCT_VERSION == 10.0 
  //    && Browser.ACTIVEX == false) {

  // IE10(METRO)
  if(Browser.IE == true 
      && Browser.PRODUCT_VERSION >= 10.0 
      && Browser.ACTIVEX == false) {
  //ACT0100 2013.06.18 end
    Browser.METRO = true;
  } else {
    Browser.METRO = false;
  }
  //ACT0093 2013.05.15 end
})(window.navigator.userAgent);

(function(a, b, c) {
  Browser.LANG = a ? a.substring(0,2) :
                 b ? b.substring(0,2) :
                 c ? c.substring(0,2) : 'en';

})(window.navigator.language,
   window.navigator.browserLanguage,
   window.navigator.systemLanguage);

//ACT0037 2011.06.30 start
(function() {
  if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
    try {
      document.execCommand('BackgroundImageCache', false, true);
    } catch(e) {
    }
  }
})();
//ACT0037 2011.06.30 end

/*
 *
 */
function $(element) {
  if(arguments.length > 1) { 
    for(var i = 0, elements = [], length = arguments.length; i < length; i++) {
      elements.push($(arguments[i]));
    }
    return elements;
  }
  if(Util.$isString(element)) {
    element = document.getElementById(element);
  }
  return Element.$extend(element);
}

/*
 *
 */
var DomReady = {
  DOMREADY : false,
  HANDLED  : false,
  HANDLERS : [],
  TIMER    : null
};

/*
 *
 */
DomReady.$add = function(handler) {
  //ACT0034 2011.06.24 start
  //if(DomReady.HANDLED) {
  if(DomReady.HANDLERS == null) {
    //handler.call();
    try {
      return handler.call();
    } catch(e) {
      if(Util.$isFunction(Util.callbackSystemError)) {
        Util.callbackSystemError(e);
      } else {
        Util.$eAlert(e);
        //ACT0035 2011.06.28 start
        if(Util.$isString(e)) {
          e = new Error(e);
        } else if(e instanceof Exception) {
          e = new Error(e.getMessage());
        }
        //ACT0035 2011.06.28 end
        throw e;
      }
    }
  } else {
    DomReady.HANDLERS.push(function() {
        try {
          return handler.call();
        } catch(e) {
          if(Util.$isFunction(Util.callbackSystemError)) {
            Util.callbackSystemError(e);
          } else {
            Util.$eAlert(e);
            //ACT0035 2011.06.28 start
            if(Util.$isString(e)) {
              e = new Error(e);
            } else if(e instanceof Exception) {
              e = new Error(e.getMessage());
            }
            //ACT0035 2011.06.28 end
            throw e;
          }
        }
      });
  }
  //ACT0034 2011.06.24 end
};

/*
 *
 */
(function() {
  function handle() {
    if(DomReady.HANDLED) {
      return;
    }
    if(DomReady.TIMER) {
      window.clearTimeout(DomReady.TIMER);
    }
    DomReady.HANDLED = true;

    if(DomReady.HANDLERS) {
      //ACT0034 2011.06.23 start
      //var length = DomReady.HANDLERS.length;
      //while(length--) {
      //  DomReady.HANDLERS[length].call();
      //}
      //DomReadyに登録された関数をFIFOで実行する
      var handlers = DomReady.HANDLERS;
      for(var i = 0; Util.$isFunction(handlers[i]); i++) {
        handlers[i].call();
      }
      DomReady.HANDLERS = null;
      //DomReady.HANDLERSをnullにする前の
      //絶妙なタイミングに割込まれた場合の対策
      for(; Util.$isFunction(handlers[i]); i++) {
        handlers[i].call();
      }
      //ACT0034 2011.06.23 end
    }
    DomReady.HANDLERS = null;
  }

  function detect() {
    if(DomReady.DOMREADY) {
      return;
    }
    DomReady.DOMREADY = true;

    // ※document.addEventListenerの拡張の前に実行される
    // [TODO]拡張タイミングが後方の為、nativeメソッドを呼び出す処理が煩雑。
    //       処理タイミング、及びクロスブラウザ対応の調整の余地あり。
    if(document.addEventListener) {
      // for WEBKIT, GECKO
      // ※この時点ではaddEventListenerは拡張前(native code)
      // DOMContentLoaded発生時点ではremoveEventListener付け替えされているので
      // _removeEventListener(native code)を呼び出す。
      document.addEventListener('DOMContentLoaded', function() {
        document._removeEventListener('DOMContentLoaded', arguments.callee, false);
        handle();
      }, false);
    }
    else if(document.attachEvent) {
      // for IE
      document.attachEvent('onreadystatechange', function() {
        if(document.readyState === 'complete') {
          document.detachEvent('onreadystatechange', arguments.callee);
          handle();
        }
      });

      if(document.documentElement.doScroll && window == window.top) {
        (function() {
          if(DomReady.HANDLED) {
            return;
          }

          try {
            document.documentElement.doScroll('left');
          }
          catch(e) {
            DomReady.TIMER = setTimeout(arguments.callee, 0);
            return;
          }
          handle();
        })();
      }
    }
  }

  detect();
})();

/*
 *
 */
(function() {
  var js = /util\.js(\?.*)?$/;
  var scripts = document.getElementsByTagName('script');
  for(var i = 0, l = scripts.length; i < l; i++) {
    var src = scripts[i].src;
    if(src.match(js)) {
      //画面IDを抜き出し (画面ID命名規約によっては調整必要)
      // 頭文字 英字([a-zA-Z]), 以降 英数字+"_"([\w])
      var includes = src.match(/\?.*cntl=([a-zA-Z][\w]*)/);
      if(includes) {
        //ACT0034 2011.06.24 start
        //DomReady.$add(function() {
        //  try {
        //    eval(includes[1] + '.$init();');
        //  }
        //  catch(e) {
        //    //20110210 初期化処理中に例外が発生した場合:ACT0001
        //    if(Util.$isFunction(Util.callbackSystemError)) {
        //      Util.callbackSystemError(e);
        //    } else {
        //      Util.$eAlert(e);
        //      throw e;
        //    }
        //  }
        //});
        //ACT0073 2011.10.28 start
        //DomReady.$add(function() { eval(includes[1] + '.$init();') });
        DomReady.$add(function() { 
          // 初期化処理が実行可能か確認する
          var obj = null;
          try {
            obj = eval(includes[1]);
          } catch(e) {
            obj = null;
          }
          // 初期化処理が実行可能な場合のみ、初期化処理を実行する
          if(obj != null) {
            eval(includes[1] + '.$init();');
          }
        });
        //ACT0073 2011.10.28 end
        //ACT0034 2011.06.24 end
      }
    }
  }
})();

/*
 * Function
 */
(function() {
  var slice = Array.prototype.slice;

  function update(a1, a2) {
    var l1 = a1.length;
    var l2 = a2.length;
    while(l2--) {
      a1[l1 + l2] = a2[l2];
    }
    return a1;
  }

  function merge(a1, a2) {
    a1 = slice.call(a1, 0);
    return update(a1, a2);
  }

  function bind(ctx) {
    if(arguments.length < 2 && Util.$isUndefined(arguments[0])) {
      return this;
    }
    var __function  = this;
    var __arguments = slice.call(arguments, 1);
    return function() {
      var a = merge(__arguments, arguments);
      return __function.apply(ctx, a);
    };
  }

  function bindAsEventListener(ctx) {
    var __function  = this;
    var __arguments = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], __arguments);
      return __function.apply(ctx, a);
    };
  }

  function curry() {
    if(!arguments.length) {
      return this;
    }
    var __function  = this;
    var __arguments = slice.call(arguments, 0);
    return function() {
      var a = merge(__arguments, arguments);
      return __function.apply(this, a);
    };
  }

  function delay(timeout) {
    var __function  = this;
    var __arguments = slice.call(arguments, 1);
    timeout = timeout * 1000; 
    return window.setTimeout(function() {
      return __function.apply(__function, __arguments);
    }, timeout);
  }

  function defer() {
    var __arguments = update([0.01], arguments);
    return this.delay.apply(this, __arguments);
  }

  function methodize() {
    if(this._methodized) {
      return this._methodized;
    }
    var __function = this;
    return this._methodized = function() {
      var a = update([this], arguments);
      return __function.apply(null, a); 
    };
  }

  Util.$propcopy({
    bind                : bind,
    bindAsEventListener : bindAsEventListener,
    curry               : curry,
    delay               : delay,
    defer               : defer,
    methodize           : methodize
  }, Function.prototype);
})();


/*
 * Element constructor
 */
(function(global) {
  var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function() {
    try {
      var el = document.createElement('<input name="x">');
      return el.tagName.toLowerCase() === 'input' && el.name === 'x';
    }
    catch(err) {
      return false;
    }
  })();

  var element = global.Element;

  global.Element = function(tagName, attributes) {
    tagName    = tagName.toLowerCase();
    attributes = attributes || {};
    var cache  = Element._cache;
    if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
      tagName = '<' + tagName + ' name="' + attributes.name + '">';
      delete attributes.name; 
      return Element.$writeAttribute(document.createElement(tagName),
                                     attributes);
    }
    if(!cache[tagName]) {
      cache[tagName] = Element.$extend(document.createElement(tagName));
    }
    return Element.$writeAttribute(cache[tagName].cloneNode(false),
                                   attributes);
  };

  Util.$propcopy(element || {}, global.Element);
  if(element) {
    global.Element.prototype = element.prototype;
  }
})(this);

/*
 * Element
 */
Element._cache = {};

Element._attributeTranslations = {
  write: {
    names: {
      className: 'class',
      htmlFor:   'for'
    },
    values: {
    }
  }
};

//ACT0061 2011.09.05 start
//if(Browser.IE) {
//  Element._attributeTranslations.has = {};
//  var arrattr = ['colSpan', 'rowSpan', 'vAlign ', 'dateTime', 'accessKey',
//                 'tabIndex', 'encType', 'maxLength', 'readOnly', 'longDesc',
//                 'frameBorder'];
//  for (var i = 0, length = arrattr.length; i < length; i++) {
////    Element._attributeTranslations.write.names[arrattr[i].toLowerCase()] =
////      arrattr[i];
//    Element._attributeTranslations.has[arrattr[i].toLowerCase()] = arrattr[i];
//  }
//}
if(Browser.IE) {
  Element._attributeTranslations.has = {};
  var arrattr = ['colSpan', 'rowSpan', 'vAlign', 'dateTime', 'accessKey',
                 'tabIndex', 'encType', 'maxLength', 'readOnly', 'longDesc',
                 'frameBorder'];
  var len = arrattr.length;
  for (var i = 0; i < len; i++) {
    Element._attributeTranslations.has[arrattr[i].toLowerCase()] = arrattr[i];
  }
}
//ACT0061 2011.09.05 end

/*
 * Element
 */
(function() {
  var _insertImpl = {
    before: function(element, node) {
      element.parentNode.insertBefore(node, element);
    },
    top: function(element, node) {
      element.insertBefore(node, element.firstChild);
    },
    bottom: function(element, node) {
      element.appendChild(node);
    },
    after: function(element, node) {
      element.parentNode.insertBefore(node, element.nextSibling);
    }
  };

  var _getContentFromAnonymousElement = function(tagName, html) {
    var div = new Element('div');
    var t = {
      TABLE  : ['<table>',                '</table>',                   1],
      TBODY  : ['<table><tbody>',         '</tbody></table>',           2],
      TR     : ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
      TD     : ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
      SELECT : ['<select>',               '</select>',                  1],
      THEAD  : ['<table><tbody>',         '</tbody></table>',           2],
      TFOOT  : ['<table><tbody>',         '</tbody></table>',           2],
      TH     : ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4]
    }[tagName];

    if(t) {
      div.innerHTML = t[0] + html + t[1];
      for(var i = t[2]; i--; ) {
        div = div.firstChild;
      }
    } else {
      div.innerHTML = html;
    }
    return $A(div.childNodes);
  }

  function getDimensions(element) { 
    element = $(element);

    var display = Element.$getStyle(element, 'display');

    // for Safari bug
    if (display != 'none' && display != null)  {
      return {
        width  : element.offsetWidth, 
        height : element.offsetHeight
      };
    }

    var els = element.style;

    var originalVisibility = els.visibility;
    var originalPosition   = els.position;
    var originalDisplay    = els.display;

    els.visibility = 'hidden';
    // for Safari bug
    if (originalPosition != 'fixed') { 
      els.position = 'absolute';
    }
    els.display = 'block';

    var originalWidth  = element.clientWidth;
    var originalHeight = element.clientHeight;

    els.display    = originalDisplay;
    els.position   = originalPosition;
    els.visibility = originalVisibility;

    return {
      width  : originalWidth,
      height : originalHeight
    };
  }

  function getWidth(element) {
    return Element.$getDimensions(element).width;
  }

  function getHeight(element) {
    return Element.$getDimensions(element).height;
  }

  function hasClassName(element, className) {
    element = $(element);
    if(!element) {
      return;
    }
    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  }

  function addClassName(element, className) {
    element = $(element);
    if(!element) {
      return;
    }
    if(!Element.$hasClassName(element, className)) {
      element.className += (element.className ? ' ' : '') + className;
    }
    return element;
  }

  function removeClassName(element, className) {
    element = $(element);
    if(!element) {
      return;
    }
    element.className = element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
    return element;
  }

  function insert(element, insertions) {
    element = $(element);

    if(Util.$isString(insertions)  ||
       Util.$isNumber(insertions)  ||
       Util.$isElement(insertions) ||
       (insertions && (insertions.toElement || insertions.toHTML))) {
      insertions = {
        bottom: insertions
      };
    }

    var content, insert, tagName, childNodes;

    for(var position in insertions) {
      content  = insertions[position]; 
      position = position.toLowerCase();
      insert   = _insertImpl[position];

      if(content && content.toElement) {
        content = content.toElement();
      }

      if(Util.$isElement(content)) {
        insert(element, content);
      } else {
        //注：contentはinsertする位置に対し、
        //    正しいHTML定義(タグ記述)となっていること。
        //    _getContentFromAnonymousElement内でnode変換されるが、
        //    ブラウザによって解釈の仕方が変わる為、
        //    指定するcontentの整合性(チェック)までは保証しない。
        content = Util.$toHTML(content);

        insert = insert.curry(element);

        tagName = ((position == 'before' || position == 'after') 
                  ? element.parentNode : element).tagName.toUpperCase();

        childNodes = _getContentFromAnonymousElement(tagName, 
                                                     content.stripScripts());

        if(position == 'top' || position == 'after') {
           childNodes.reverse();
        }

        for(var i = 0, l = childNodes.length; i < l; i++) {
          insert(childNodes[i]);
        }

        // eval scripts in 'content' string
        // ※動的Javascriptは方針として禁止している為、下記処理はしない。
        //content.evalScripts.bind(content).defer();
      }
    }

    return element;
  }

  function writeAttribute(element, name, value) {
    element = $(element);
    var attributes = {};
    var t = Element._attributeTranslations.write;

    if(typeof name == 'object') {
      attributes = name;
    } else {
      attributes[name] = Util.$isUndefined(value) ? true  : value;
    }

    for(var attr in attributes) {
      name  = t.names[attr] || attr;
      value = attributes[attr];
      if(t.values[attr]) {
        name = t.values[attr](element, value);
      }
      if(value === false || value === null) {
        element.removeAttribute(name);
      }
      else if(value === true) {
        element.setAttribute(name, name);
      }
      else {
        element.setAttribute(name, value);
      }
    }

    return element;
  }

  function setStyle(element, styles) {
    element = $(element);
    var elementStyle = element.style;
    if(Util.$isString(styles)) {
      element.style.cssText += ';' + styles;
      return element;
    }
    for(var prop in styles) {
      if(prop == 'opacity') {
        Element.$setOpacity(element, styles[prop]);
      } else {
        //float指定のブラウザ間機能吸収
        // cssのfloatはJavascriptからは別のプロパティで取得、セットする必要がある
        // IE:styleFloat, FF,GC:cssFloat
        elementStyle[(prop == 'float' || prop == 'cssFloat') ?
          (Util.$isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
            prop] = styles[prop];
      }
    }
    return element;
  }

  function getStyle(element, style) {
    // for FF, GC
    element = $(element);

    style = (style == 'float' ? 'cssFloat' : style.camelize());

    //DOM要素自体に指定されているスタイルの値を取得
    var value = element.style[style];

    //上記取得できない(DOM要素自体にスタイル指定していない)場合
    if(!value || value == 'auto') {
      //DOM要素に反映されているスタイルを取得
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }

    if(style == 'opacity') {
      return value ? parseFloat(value) : 1.0;
    }

    return value == 'auto' ? null : value;
  }

  function getStyle_IE(element, style) {
    // for IE
    element = $(element);

    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat'
                                                      : style.camelize();

    //DOM要素自体に指定されているスタイルの値を取得
    var value = element.style[style];

    //上記取得できない(DOM要素自体にスタイル指定していない)場合
    if(!value && element.currentStyle) {
      //DOM要素に反映されているスタイルを取得
      // currentStyle is IE specific
      value = element.currentStyle[style];
    }

    if(style == 'opacity') {
      if(value = (Element.$getStyle(element, 'filter') || '').match(/alpha\(opacity=(.*)\)/)) {
        if(value[1]) {
          return parseFloat(value[1]) / 100;
        } 
      }
      return 1.0;
    }

    if(value == 'auto') {
      if((style == 'width' || style == 'height') && 
         (Element.$getStyle(element, 'display') != 'none')) {
            return element['offset' + style.capitalize()] + 'px';
      }
      return null;
    }

    return value;
  }

  function getOpacity(element) {
    return Element.$getStyle($(element), 'opacity');
  }

  function setOpacity(element, value) {
    element = $(element);
    if(Util.$isUndefined(value)) {
      return element;
    }
    if(value !== '') {
      value = parseFloat(value);
      if(isNaN(value)) {
        return element;
      }
    }

    element.style.opacity = (value == 1 || value === '') ? '' : 
      (0.00001 > value) ? 0 : value;
    return element;
  }

  function setOpacity_WEBKIT(element, value) {
    element = $(element);
    if(Util.$isUndefined(value)) {
      return element;
    }
    if(value !== '') {
      value = parseFloat(value);
      if(isNaN(value)) {
        return element;
      }
    }

    element.style.opacity = (value == 1 || value === '') ? '' : 
      (0.00001 > value) ? 0 : value;

    if(value == 1) {
      if(element.tagName.toUpperCase() == 'IMG' && element.width) {
        element.width++;
        element.width--;
      } else {
        Element.$forceRerendering(element);
      }
    }

    return element;
  }

  function setOpacity_IE(element, value) {
    function stripAlpha(filter) {
      return filter.replace(/alpha\([^\)]*\)/gi, '');
    }

    element = $(element);
    if(Util.$isUndefined(value)) {
      return element;
    }
    if(value !== '') {
      value = parseFloat(value);
      if(isNaN(value)) {
        return element;
      }
    }

    var currentStyle = element.currentStyle;
    if(( currentStyle && !currentStyle.hasLayout) ||
       (!currentStyle &&  element.style.zoom == 'normal')) {
      element.style.zoom = 1;
    }

    //ACT0099 2013.05.21 start
    if(Browser.PRODUCT_VERSION <=9.0) {
      var filter = Element.$getStyle(element, 'filter'); 
      // styleは、CSS2Propertiesオブジェクト
      var style  = element.style;
      if(value == 1 || value === '') {
        if(filter = stripAlpha(filter)) {
          style.filter = filter; 
        } else { 
          style.removeAttribute('filter');
        }
        return element;
      } 
      else if(value < 0.00001) {
        value = 0;
      }
      style.filter = 
        stripAlpha(filter) + 'alpha(opacity=' + (value * 100) + ')';
    } else {
      if(value == 1 || value === '') {
        element.style.opacity = ''; 
      } else if(value < 0.00001) {
        element.style.opacity = 0; 
      } else {
        element.style.opacity = value; 
      }
    }
    //ACT0099 2013.05.21 end

    return element;
  }

  function visible(element) {
    return $(element).style.display != 'none';
  }

  function toggle(element) {
    element = $(element);
    Element[Element.$visible(element) ? '$hide' : '$show'](element);
    return element;
  }

  function hide(element) {
    element = $(element);
    element.style.display = 'none';
    return element;
  }

  //ACT0012 2011.03.22 start
  function show(element, option) {
    element = $(element);
    if(option) {
      element.style.display = option;
    } else {
      element.style.display = '';
    }
    return element;
  }
  //ACT0012 2011.03.22 end

  function remove(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  }

  function recursivelyCollect(element, property) {
    element = $(element);
    var elements = [];
    while(element = element[property]) {
      if(element.nodeType == 1) {
        elements.push(Element.$extend(element));
      }
    }
    return elements;
  }

  function nextSiblings(element) {
    return recursivelyCollect(element, 'nextSibling');
  }

  function immediateDescendants(element) {
    if(!(element = $(element).firstChild)) {
      return [];
    }
    while(element && element.nodeType != 1) {
      element = element.nextSibling;
    }
    if(element) {
      var a = [element];
      var b = Element.$nextSiblings($(element)); 
      for(var i = 0, l = b.length; i < l; i++) {
        a.push(b[i]);
      }
      return a;
    }
    return [];
  } 

  function descendantOf(element, ancestor) {
    element  = $(element);
    ancestor = $(ancestor);

    if(element.compareDocumentPosition) {
      return (element.compareDocumentPosition(ancestor) & 8) === 8;
    }

    if(ancestor.contains) {
      return ancestor.contains(element) && ancestor !== element;
    }

    while(element = element.parentNode) {
      if(element == ancestor) {
        return true;
      }
    }

    return false;
  }

  function forceRerendering(element) {
    try {
      element = $(element);
      var n = document.createTextNode(' ');
      element.appendChild(n);
      element.removeChild(n);
    }
    catch(e) {
    }
  }

  function hasAttribute(element, attribute) {
    element = $(element);
    // インスタンスメソッドが実装済み(FF,GC)の場合
    if(element.hasAttribute) {
      // 該当メソッド呼出
      return element.hasAttribute(attribute);
    }

    // ブラウザ依存のattributeの大文字小文字変換対応
    // ※インスタンスメソッド化する場合は、このクラスをextendする。
    attribute = Element._attributeTranslations.has[attribute] || attribute;
    var node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  };

  //ACT0089 2013.01.18 start
  function getPosition(el) {
    var __doc__ = document;
    // getBoundingClientRectでの座標取得
    var pos = el.getBoundingClientRect();
    var html = __doc__.documentElement;
    var body = __doc__.body;
    return { x:(pos.left + (body.scrollLeft || html.scrollLeft) - html.clientLeft)
           , y:(pos.top + (body.scrollTop || html.scrollTop) - html.clientTop) };
  };
  //ACT0089 2013.01.18 end

  Util.$propcopy({
    $descendantOf         : descendantOf,
    $getDimensions        : getDimensions,
    $getWidth             : getWidth,
    $getHeight            : getHeight,
    $visible              : visible,
    $toggle               : toggle,
    $hide                 : hide,
    $show                 : show,
    $remove               : remove,
    $setStyle             : setStyle,
    $getStyle             : Browser.IE ? getStyle_IE : getStyle,
    $setOpacity           : Browser.IE ? setOpacity_IE : 
                            (Browser.WEBKIT ? setOpacity_WEBKIT : setOpacity),
    $getOpacity           : getOpacity,
    $hasClassName         : hasClassName,
    $addClassName         : addClassName,
    $removeClassName      : removeClassName,
    $insert               : insert,
    $nextSiblings         : nextSiblings,
    $immediateDescendants : immediateDescendants,
    $writeAttribute       : writeAttribute,
    $forceRerendering     : forceRerendering,
    $hasAttribute         : hasAttribute,
    //ACT0089 2013.01.18 start
    $getPosition          : getPosition
    //ACT0089 2013.01.18 end
  }, Element);
})();

Element.$extend = (function() {

  function extendElementWith(element, methods, override) {
    override = !!override;
    for(var prop in methods) {
      var value = methods[prop];
      if(Util.$isFunction(value) && (override || !(prop in element))) {
        element[prop] = value.methodize();
      }
    }
  }

  var extend = function(element) {
    // 通常elementのみ拡張する
    // ・document(nodeType=9)
    // ・window
    // は処理を抜ける。
    if(!element
    || typeof element._extended != 'undefined'
    || element.nodeType != 1
    || element == window) {
      return element;
    }

    // addEventListener,removeEventListener拡張処理
    if(element.addEventListener) {
      // nativeメソッド退避(addEventListener,removeEventListenerで使用)
      element._addEventListener = element.addEventListener;
      element._removeEventListener = element.removeEventListener;
      //ACT0033 2011.06.17 start
      //FFのEMBEDタグはセキュリティの問題のためoverrideしない
      if(!Browser.GECKO || element.tagName != 'EMBED') {
        // method extend(override)
        extendElementWith(
          element,
          {
            addEventListener    : Element.WrapListener.$addEventListener,
            removeEventListener : Element.WrapListener.$removeEventListener
          }, true);
      }
      //ACT0033 2011.06.17 end
    }
    else if(element.attachEvent) {
      // nativeメソッドはメソッド名が違うので退避不要
      //element._addEventListener = element.attachEvent;
      //element._removeEventListener = element.detachEvent;
      // method extend
      extendElementWith(
        element,
        {
          addEventListener    : Element.WrapListener.$addEventListener,
          removeEventListener : Element.WrapListener.$removeEventListener
        });
    }

    if(!element.getElementsByClassName) {
      extendElementWith(element, { getElementsByClassName: Element.$getElementsByClassName });
    }

    // 二重拡張抑制フラグセット
    element._extended = Util.$empty;

    return element;
  };

  return extend;
})();

//ACT0006 2011.03.03 start
/*
 * 次のElementノードを取得する
 */
Element.$nextElementSibling = function(element) {
  var result = null;
  while(element = element.nextSibling) {
    if(element.nodeType == 1) {
      result = element;
      break;
    }
  }
  return Element.$extend(result);
}

/*
 * 前のElementノードを取得する
 */
Element.$previousElementSibling = function(element) {
  var result = null;
  while(element = element.previousSibling) {
    if(element.nodeType == 1) {
      result = element;
      break;
    }
  }
  return Element.$extend(result);
}
//ACT0006 2011.03.03 end

//ACT0029 2011.06.13 start
/**
 * Element再描画処理（IE6のみ）
 * @param {Element} element 対象Element
 * @param {boolean} isForce 強制実行（デフォルト:false 全ブラウザで強制実行）
 */
Element.$redraw = function(element, isForce) {
  if((Browser.IE && Browser.PRODUCT_VERSION <= 6.0) || isForce) {
    element = $(element);
    var n = document.createTextNode(' ');
    var _redraw = function(dummy) {
      dummy.parentNode.removeChild(dummy);
    };
    var _curry = _redraw.curry(n);
    element.appendChild(n);
    _curry.defer();
  }
};
//ACT0029 2011.06.13 end

/*
 * getElementsByClassName拡張(IEのみ)
 */
if(!document.getElementsByClassName) {
  Element.$getElementsByClassName = (function() {
    function blank(str) {
//      return /^\s*$/.test(str);
      return /^[\s　]*$/.test(str);
    }
    function iter(name) {
      // className検索用のXpath文字列(document.evaluate)を生成する
      return blank(name) ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
    }
    function spaceSplit(str) {
      // スペースで区切って配列を返す
      if(!Util.$isString(str)) {
        return [];
      }
      str = str.strip();
      return str ? str.split(/\s+/) : [];
    }
    function makeCond(arrstr) {
      for(var i = 0, length = arrstr.length; i < length; i++) {
        arrstr[i] = iter(arrstr[i]);
      }
      return arrstr.join();
    }
    function allCheck(arrstr, cn) {
      // arrstrの要素がすべてcnの場合、trueを返す
      var result = true;
      for(var i = 0, length = arrstr.length; i < length; i++) {
        if(!blank(arrstr[i].toString())) {
          result = false;
          break;
        }
        if(cn.indexOf(' ' + arrstr[i] + ' ') < 0) {
          result = false;
          break;
        }
      }
      return result;
    }

    var _getElementsByClassName =
      !!document.evaluate ?
        function(element, className) {
          className = className.toString().strip();
          // 指定elementの子孫でclassName定義が合致するノードのリストを返す
          var cond = /\s/.test(className) ? makeCond(spaceSplit(className)) : iter(className);
          return cond ?
            function(expression, parentElement) {
              var results = [];
              var query = document.evaluate(
                expression,
                $(parentElement) || document,
                null,
                window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null);
              for(var i = 0, length = query.snapshotLength; i < length; i++) {
                // ※extendsしない(nativeメソッド呼び出しのI/Fと合わせる)
//                results.push(Element.$extend(query.snapshotItem(i)));
                results.push(query.snapshotItem(i));
              }
              return results;
           }('.//*' + cond, element) : [];

        } :
          function(element, className) {
            className = className.toString().strip();
            var elements = [];
            var classNames = (/\s/.test(className) ? spaceSplit(className) : null);
            if (!classNames && !className) {
              return elements;
            }

            // 指定elementの全要素(*)をフラットに取得
            var nodes = $(element).getElementsByTagName('*');
            className = ' ' + className + ' ';

            for (var i = 0, ccn, child; child = nodes[i]; i++) {
              // nodeのclassNameが検索classNameと同じか、検索classNamesに含まれているか判定
              if(child.className && (ccn = ' ' + child.className + ' ')
              && (ccn.indexOf(className) > -1 || (classNames && allCheck(classNames, ccn)))) {
                // 合致したら、退避
                //elements.push(Element.$extend(child));
                // ※extendsしない(nativeメソッド呼び出しのI/Fと合わせる)
                elements.push(child);
              }
            }
            return elements;
          };

    return function(parentElement, className) {
      return _getElementsByClassName($(parentElement), className);
    };
  })();

  document.getElementsByClassName = function(className) {
    return Element.$getElementsByClassName(document.body, className);
  }
}

Element.WrapListener = {};
(function() {
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED =
    ('onmouseenter' in document.documentElement &&
     'onmouseleave' in document.documentElement);

  function _getDOMEventName(eventName) {
    if(MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED) {
      return eventName; 
    }
    var translations = { 
      mouseenter : "mouseover",
      mouseleave : "mouseout"
    };
    return (translations[eventName] || eventName);
  }

  function _createResponder(element, eventName, handler) {
    var eventRegistry = element.eventRegistry;
    var respondersForEvent;
    var responder;

    if(eventRegistry) {
      respondersForEvent = eventRegistry[eventName];
      if(respondersForEvent) {
        // 登録済みハンドラ検索
        for(var i = 0, length = respondersForEvent.length; i < length; i++) {
          // 同一イベント、同一ハンドラで既に登録済みの場合
          if(respondersForEvent[i].handler === handler) {
            // 処理を抜ける(リスナー登録しない)
            return null;
          }
        }

      } else {
        respondersForEvent = [];
        eventRegistry[eventName] = respondersForEvent;
      }

    } else {
      eventRegistry = {};
      element.eventRegistry = eventRegistry;
      respondersForEvent = [];
      eventRegistry[eventName] = respondersForEvent;
    }

    var f = (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
      (eventName === "mouseenter" || eventName === "mouseleave"));

    // responder生成
    if(f) {
      responder = function(event) {
        //ACT0063 2011.09.06 start
        //Eventが未定義の場合はIE9で画面遷移中なので処理しない
        if(typeof Event !== "undefined") {
          //ACT0070 2011.09.27 start
          if(Browser.IE) {
            event = window.event ? window.event : event;
          }
          //ACT0070 2011.09.27 end
          Event.$extend(event, element);
  
          var parent = event.relatedTarget;
          while(parent && parent !== element) {
            try { 
              parent = parent.parentNode;
            }
            catch(e) {
              parent = element;
            }
          }
          if(parent === element) {
            return;
          }
  
          try {
            handler.call(element, event);
          }
          catch(e) {
            Util.$eAlert(e);
            throw e;
          }
        }
        //ACT0063 2011.09.06 end
      };
    } else {
      responder = function(event) {
        //ACT0063 2011.09.06 start
        //Eventが未定義の場合はIE9で画面遷移中なので処理しない
        if(typeof Event !== "undefined") {
          //ACT0070 2011.09.27 start
          if(Browser.IE) {
            event = window.event ? window.event : event;
          }
          //ACT0070 2011.09.27 end
          Event.$extend(event, element);
          try {
            handler.call(element, event);
          }
          catch(e) {
            Util.$eAlert(e);
            throw e;
          }
        }
        //ACT0063 2011.09.06 end
      };
    }

    // イベントハンドラ保存
    responder.handler = handler;
    respondersForEvent.push(responder);

    return responder;
  }

  function addEventListener(element, eventName, handler, useCapture) {
    element = $(element);

    var responder = _createResponder(element, eventName, handler);

    // handlerが登録済みの場合
    if(!responder) {
      // 処理を抜ける
      return element;
    }

    var actualEventName = _getDOMEventName(eventName);

    if(element._addEventListener) {
      element._addEventListener(actualEventName, responder, false);
    } else {
      element.attachEvent("on" + actualEventName, responder);
    }

    return element;
  }


  function removeEventListener(element, eventName, handler, useCapture) {
    element = $(element);

    var eventRegistry = element.eventRegistry;
    if(!eventRegistry) {
      return element;
    }

    //ACT0024 2011.08.30 start
    var _isSameFunction = function(current, target) {
      var result = false;
      if(Util.$isFunction(current) && Util.$isFunction(target)) {
        if(current === target) {
          result = true;
        } else {
          result = _isSameFunction(current._baseFunc, target);
        }
      }
      return result;
    };
    //ACT0024 2011.08.30 end

    // 登録されているイベント毎に繰り返し処理
    for(var keyEventName in eventRegistry) {
      // 引数のイベント指定がない場合、elementに紐付くハンドラをすべて開放する。
      // 引数のイベント指定がある場合、イベント名で検索する。
      if(!eventName || keyEventName == eventName) {
        var respondersForEvent = eventRegistry[keyEventName];

        // 登録されているresponder(ハンドラ)毎に繰り返し処理
        // ※配列要素の削除処理があるので一応逆順としておく。
        //   削除時点で処理を抜けるので、逆順でなくても問題は無い。
        for(var i = respondersForEvent.length - 1; i >= 0; i--) {
          // 引数のハンドラ指定がない場合、イベントに紐付くハンドラを
          // すべて開放する。
          // 引数のハンドラ指定がある場合、ハンドラ検索する。
          //ACT0024 2011.08.30 start
          //if(!handler || respondersForEvent[i].handler === handler) {
          if(!handler || _isSameFunction(respondersForEvent[i].handler, handler)) {
          //ACT0024 2011.08.30 end
            var responder = respondersForEvent[i];
            var actualEventName = _getDOMEventName(keyEventName);
            if(element._removeEventListener) {
              element._removeEventListener(actualEventName, responder, false);
            } else {
              element.detachEvent("on" + actualEventName, responder);
            }

            // 引数のハンドラ指定がある場合
            if(handler) {
              if(respondersForEvent.length >= 2) {
                // 対象ハンドラ(responder)を削除し、再セット
                // ※配列の削除機能はないので、対象以外の要素をコピーする。
                var arrdst = new Array(respondersForEvent.length - 1);
                var arr1 = respondersForEvent.slice(0, i);
                var arr2 = respondersForEvent.slice(i + 1);
                var len1 = arr1.length;
                var len2 = arr2.length;
                for(var j = 0; j < len1; j++) {
                  arrdst[j] = arr1[j];
                }
                for(var j = 0; j < len2; j++) {
                  arrdst[len1 + j] = arr2[j];
                }

                eventRegistry[keyEventName] = arrdst;

              } else {
                // ハンドラが1つ以下の場合、配列削除すると0件になるので、
                // ハンドラ要素の加工はせず、イベント情報を丸ごと削除する。
                delete eventRegistry[keyEventName];
              }

              // 処理を抜ける
              return element;
            }
          }
        }

        // 引数のハンドラ指定がない場合
        if(!handler) {
          // イベント情報を丸ごと削除
          delete eventRegistry[keyEventName];
        }
      }
    }

    return element;
  }

  Util.$propcopy({
    $addEventListener    : addEventListener,
    $removeEventListener : removeEventListener
  }, Element.WrapListener);
})();

(function() {
  if(document.addEventListener) {
    document._addEventListener = document.addEventListener;
    document._removeEventListener = document.removeEventListener;
  }
  Util.$propcopy({
    addEventListener    : Element.WrapListener.$addEventListener.methodize(),
    removeEventListener : Element.WrapListener.$removeEventListener.methodize()
  }, document);

  if(window.addEventListener) {
    window._addEventListener = window.addEventListener;
    window._removeEventListener = window.removeEventListener;
  }
  Util.$propcopy({
    addEventListener    : Element.WrapListener.$addEventListener.methodize(),
    removeEventListener : Element.WrapListener.$removeEventListener.methodize()
  }, window);
})();

/*--------------------------------------------------------------------------*/
/*
 * Formに対する機能群
 */
var Form = {};
(function() {
  /*
   * elements 要素群
   * options 連想配列
   *   hash 戻り値の型指定(true:連想配列, false:QueryString化, 指定なし=false)
   *   submit submit対象点検(submitボタンのname)
   */
  function serializeElements(elements, options) {
    // 旧バージョンI/F(optionsにtrue|falseセットされる場合)
    if(typeof options != 'object') {
      options = { hash: !!options };
    }
    // hash指定なしの場合
    else if(Util.$isUndefined(options.hash)) {
      options.hash = false;
    }

    var element;
    var key;
    var value;
    var submitted = false;
    var submit = options.submit;
    var data = { };

    for(var i = 0, length = elements.length; i < length; i++) {
      element = elements[i];
      // 活性状態、且つname指定ありのelementを対象とする。
      if(!element.disabled && element.name) {
        key = element.name;
        value = Field.$getValue(element);
        // 入力値がある場合、情報退避する。
        // ・file参照(upload)コントロールは除外
        // ・submitボタンは最初に出現した内容のみ送信(情報退避)対象とする。
        //   但しoptions.submitにsubmitボタン(name)がセットされている場合は、
        //   セットされているnameのsubmitボタンを送信(情報退避)対象とする。
        //   →原則、使用しない事
        //     submitのvalueは言語対応で可変になる為、判定等に使用出来ない。
        if(value != null && element.type != 'file'
        && (element.type != 'submit'
         || (!submitted && submit !== false && (!submit || key == submit)
          && (submitted = true)))) {
          // 退避中のkeyと被る(同一nameで複数送信対象がある)場合
          if(key in data) {
            // 配列化して退避する。
            if(!Util.$isArray(data[key])) {
              data[key] = [data[key]];
            }
            data[key].push(value);

          } else {
            data[key] = value;
          }
        }
      }
    }

    return options.hash ? data : Util.$toQueryString(data);
  }

  /*
   * formの入力要素を連想配列かURLパラメータ化した文字列を返す。
   */
  function serialize(form, options) {
    return serializeElements(getElements(form), options);
  }

  /*
   * formの入力要素を配列で返す。(input,select,textarea)
   */
  function getElements(form) {
    // form配下のelementを全取得(form内のdiv等もまとめて取得)
    var elements = $(form).getElementsByTagName('*');
    var element;
    var arr = [];
    var serializers = Field.Serializers;

    for(var i = 0; element = elements[i]; i++) {
      // 入力関連のelementのみ退避
      if(serializers[element.tagName.toLowerCase()]) {
        arr.push(Element.$extend(element));
      }
    }
    return arr;
  }

  /*
   * formのinputタグ要素を配列で返す。(select,textareaは含まれない。)
   * typeName指定した場合、typeで絞込みを行なう。
   * name指定した場合、nameで絞込みを行なう。
   */
  function getInputs(form, typeName, name) {
    form = $(form);
    // form配下のinputタグのelementを取得
    var inputs = form.getElementsByTagName('input');

    var matchingInputs = [];
    for(var i = 0, length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if(typeName || name) {
        // tagName、nameが一致しないものをスキップする。
        if((typeName && input.type != typeName)
        || (name     && input.name != name)) {
          continue;
        }
      }
      // 情報退避
      matchingInputs.push(Element.$extend(input));
    }

    return matchingInputs;
  }

  /*
   * formのinputタグ要素の内、radioの選択値を返す。
   * ※radio限定の同一nameグループ内選択値
   */
  function getSelectedValue(form, name) {
    form = $(form);
    if(!name) {
      return null;
    }

    var checkValue = null;
    var inputs = getInputs(form, 'radio', name);
    for(var i = 0, length = inputs.length; i < length; i++) {
      checkValue = $F(inputs[i]);
      if(checkValue) {
        return checkValue;
      }
    }

    return null;
  }

  /*
   * formを非活性化。
   */
  function disable(form) {
    form = $(form);
    var elements = getElements(form);
    for(var i = 0, length = elements.length; i < length; i++) {
      Field.$disable(elements[i]);
    }
    return form;
  }

  /*
   * formを活性化。
   */
  function enable(form) {
    form = $(form);
    var elements = getElements(form);
    for(var i = 0, length = elements.length; i < length; i++) {
      Field.$enable(elements[i]);
    }
    return form;
  }

  /*
   * 対象formを使用し、Ajax通信する。
   * options 連想配列(Request参照)
   */
  function request(form, options) {
    form = $(form);
    var options = Util.$clone(options || { });

    var params = options.parameters;
    // ※form.actionで取得する場合、FireFoxでは相対指定でもフルパスで取得される。
    // [TODO]フルパスでurl定義された場合、DNS解釈等でオーバーヘッドが発生しないか
    //       確認する。オーバーヘッドがある場合、相対取得する対応が必要。
    var action = form.action || '';
//    var action = form.getAttribute('action') || '';
    if(action.blank()) {
      action = window.location.href;
    }

    // formで入力した内容をhashで取得
    options.parameters = serialize(form, { hash: true });
    // 引数のoptions.parametersをマージ
    if(params) {
      if(Util.$isString(params)) {
        params = Util.$toQueryParams(params);
      }
      Util.$propcopy(params, options.parameters);
    }

    // 送信する際のmethod指定
    // options.methodが優先。options.methodの指定が無い場合、form.methodとする。
    // options.method、form.methodの指定が無い場合、Requestのデフォルト(get)
    // ※IEではform.method指定が無い場合、form.methodは'get'が取得される。
    //   method指定なしの場合、'get'で処理するのでIE対応はしない。
    if(!options.method && form.method) {
//    if(!options.method && form.hasAttribute('method')) {
      options.method = form.method;
    }

    return new Request(action, options);
  }

  Util.$propcopy({
    $serializeElements : serializeElements,
    $serialize         : serialize,
    $getElements       : getElements,
    $getInputs         : getInputs,
    $getSelectedValue  : getSelectedValue,
    $disable           : disable,
    $enable            : enable,
    $request           : request
  }, Form);
})();

/*--------------------------------------------------------------------------*/
/*
 * Formのelementに対する機能群
 */
var Field = {};
(function() {
  /*
   * focusセット。
   */
  function focus(element) {
    element = $(element)
    element.focus();
    return element;
  }

  /*
   * 1要素に対し、URLパラメータを生成する。
   */
  function serialize(element) {
    element = $(element);
    if(!element.disabled && element.name) {
      var value = getValue(element);
      if(value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Util.$toQueryString(pair);
      }
    }
    return '';
  }

  /*
   * 要素の入力値、選択値を取得する。
   */
  function getValue(element) {
    // input type="file"の場合
    //  IE:テキストに入力された文字列がそのまま取得される
    //  IE以外:[参照]で選択したファイルのファイル名(パスなし)
    // が取得される。
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Field.Serializers[method](element);
  }

  /*
   * 要素の入力値、選択値をセットする。
   */
  function setValue(element, value) {
    // input type="checkbox", "radio"の場合、チェック状態の変更のみ可能。
    // input type="file"の場合、valueはreadonlyとなっており、
    // 例外発生するので使用しないこと。
    element = $(element);
    var method = element.tagName.toLowerCase();
    Field.Serializers[method](element, value);
    return element;
  }

  /*
   * 要素の入力値をクリアする。
   * checkbox,radioの場合、チェック状態を解除する。
   * selectの場合、選択状態を解除する。
   */
  function clear(element) {
    element = $(element);

    // setValueの前にselectタグのみ個別で判定
    if(element.tagName.toLowerCase() == 'select') {
      if(element.type == 'select-one') {
        // 単一選択の場合、選択状態は変わらないようにする
      } else {
        // 複数選択の場合、
        // valueに空配列をセットすることで、選択状態を解除する
        setValue(element, []);
      }
      return element;
    }

    return setValue(element, '');
  }

  /*
   * 入力チェック。
   */
  function present(element) {
    return $(element).value != '';
  }

  /*
   * フォーカスセット＆文字選択。
   */
  function activate(element) {
    element = $(element);
    try {
      // フォーカスセット
      focus(element);

      // 入力値選択
      // select機能があり、inputタグの内、ボタン関連以外の場合、実施
      if(element.select
      && (element.tagName.toLowerCase() != 'input'
       || !(/^(?:button|reset|submit)$/i.test(element.type)))) {
        element.select();
      }
    } catch (e) { }
    return element;
  }

  /*
   * 入力elementを非活性化。
   */
  function disable(element) {
    element = $(element);
    element.disabled = true;
    return element;
  }

  /*
   * 入力elementを活性化。
   */
  function enable(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }

  Util.$propcopy({
    $focus     : focus,
    $serialize : serialize,
    $getValue  : getValue,
    $setValue  : setValue,
    $clear     : clear,
    $present   : present,
    $activate  : activate,
    $disable   : disable,
    $enable    : enable
  }, Field);
})();

/*
 * Formのelementの値取得/値セットに対する機能群
 */
Field.Serializers = {
  input: function(element, value) {
    switch(element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return this.inputSelector(element, value);
      default:
        return this.textarea(element, value);
    }
  },

  inputSelector: function(element, value) {
    if(Util.$isUndefined(value)) {
      return element.checked ? element.value : null;
    } else {
      // checkbox,radioの場合、セットはtrue/falseのみ
      // value値の変更は不可とする。
      element.checked = !!value;
    }
  },

  textarea: function(element, value) {
    if(Util.$isUndefined(value)) {
      return element.value;
    } else {
      element.value = value;
    }
  },

  select: function(element, value) {
    if(Util.$isUndefined(value)) {
      return this[element.type == 'select-one' ?
        'selectOne' : 'selectMany'](element);
    } else {
      var opt;
      var currentValue;
      var single = !Util.$isArray(value);
      //ACT0049 2011.08.17 start
      //IE6の場合DOM構築中に値セットしようとすると
      //例外になることがあるのでダミーでElementサイズを取得する
      var dim = null;
      if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
        dim = Element.$getDimensions(element);
      }
      //ACT0049 2011.08.17 end

      for(var i = 0, length = element.length; i < length; i++) {
        opt = element.options[i];
        currentValue = this.optionValue(opt);
        if(single) {
          if(currentValue == value) {
            opt.selected = true;
            return;
          }
        } else {
          var exist = false;
          for(j = 0, vlength = value.length; j < vlength; j++) {
            if(value[j] == currentValue) {
              exist = true;
              break;
            }
          }
          opt.selected = exist;

          // [TODO]Array.indexOfのnative実装が確定したら、下記の対応とする。
          //opt.selected = value.indexOf(currentValue) > -1;
        }
      }
    }
  },

  selectOne: function(element) {
    var index = element.selectedIndex;
    return index >= 0 ? this.optionValue(element.options[index]) : null;
  },

  selectMany: function(element) {
    var values, length = element.length;
    if(!length) {
      return null;
    }

    for(var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if(opt.selected) {
        values.push(this.optionValue(opt));
      }
    }
    return values;
  },

  optionValue: function(opt) {
    // ※optionはvalue指定が無い場合、IEは空、FF,GCはtextが取得される為、
    //   attributeの存在チェックを行なって、取得先を変更する。
    return Element.$hasAttribute(opt, 'value') ? opt.value : opt.text;
  }
};

var $F = Field.$getValue;

/*--------------------------------------------------------------------------*/

/*
 * String
 */
(function() {

  var scriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script>';
  var styleFragment  = '<link[^>]*>';
//  var styleFragmentSb = '<style[^>]*>([\\S\\s]*?)<\/style>';
// →styleタグは記述しない前提の為、削除処理は行わない。

  function strip() {
    // 正規表現\sについて
    // IEの場合、全角スペース含まない
    // FF,GCの場合、全角スペースを含む
    // →全角スペースを含む文字列の場合、ブラウザにより結果が変わる為、
    //   全角スペースを置換対象に含む
//    return this.replace(/^\s+/, '').replace(/\s+$/, '');
    return this.replace(/^[\s　]+/, '').replace(/[\s　]+$/, '');
  }

  function unquote() {
    return this.replace(/^['"]+/, '').replace(/['"]+$/, '');
  }

  function camelize() {
    var parts  = this.split('-');
    var length = parts.length;

    if(length == 1) {
      return parts[0];
    }
    var camelized = this.charAt(0) == '-'
       ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
       : parts[0];
    for(var i = 1; i < length; i++) {
      camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
    }
    return camelized;
  }

  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  }

  function stripScripts() {
    return this.replace(new RegExp(scriptFragment, 'img'), '');
  }

  function stripStyles() {
    return this.replace(new RegExp(styleFragment, 'img'), '');
  }

  function extractScripts() {
    var matchAll = new RegExp(scriptFragment, 'img');
    var matchOne = new RegExp(scriptFragment, 'im');
    var results  = [];
    var scripts  = this.match(matchAll) || [];
    for(var i = 0, l = scripts.length; i < l; i++) {
      results.push((scripts[i].match(matchOne) || ['', ''])[1]);
    }
    return results;
  }

  function evalScripts() {
    var scripts = this.extractScripts();
    var results = [];
    for(var i = 0, l = scripts.length; i < l; i++) {
      results.push(eval(scripts[i]));
    }
    return results;
  }

  function blank() {
    // 正規表現\s ブラウザ間動作吸収対応(strip参照)
//    return /^\s*$/.test(this);
    return /^[\s　]*$/.test(this);
  }

  Util.$propcopy({
    camelize       : camelize,
    capitalize     : capitalize,
    strip          : strip,
    unquote        : unquote,
    stripScripts   : stripScripts,
    stripStyles    : stripStyles,
    extractScripts : extractScripts,
    evalScripts    : evalScripts,
    blank          : blank
  }, String.prototype);
})();

document.viewport = {

  getDimensions: function() {
    return { 
      width  : this.getWidth(),
      height : this.getHeight()
    };
  },

  getScrollOffsets: function() {
    return Util.$offset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    );
  }

};

(function(viewport) {
  var element  = null;
  var property = {};

  function getRootElement() {
    if(Browser.WEBKIT && !document.evaluate) {
      return document;
    }
    return document.documentElement;
  }

  function define(D) {
    if(!element) {
      element = getRootElement();
    }

    property[D] = 'client' + D;

    viewport['get' + D] = function() { 
      return element[property[D]];
    };

    return viewport['get' + D]();
  }

  viewport.getWidth  = define.curry('Width');
  viewport.getHeight = define.curry('Height');

})(document.viewport);

/*
 * Event
 */
(function() {
  // possibly...
  //   IE8 : true
  //   FF  : false
  //   GC  : false
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED =
    ('onmouseenter' in document.documentElement &&
     'onmouseleave' in document.documentElement);

  var Event = {
    KEY_BACKSPACE: 8,
    KEY_TAB:       9,
    KEY_RETURN:   13,
    KEY_ESC:      27,
    KEY_LEFT:     37,
    KEY_UP:       38,
    KEY_RIGHT:    39,
    KEY_DOWN:     40,
    KEY_DELETE:   46,
    KEY_HOME:     36,
    KEY_END:      35,
// ACT0064 2011.09.10 start
    KEY_SPACE:    32,
// ACT0064 2011.09.10 end
    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT:   45
//
//    cache: {}
  };

  var _isButton;
  if (Browser.IE) {
    var buttonMap = { 0: 1, 1: 4, 2: 2 };
    _isButton = function(event, code) {
      return event.button === buttonMap[code];
    };
  }
  else if (Browser.WEBKIT) {
    _isButton = function(event, code) {
      switch (code) {
        case 0: return event.which == 1 && !event.metaKey;
        case 1: return event.which == 2 && !event.metaKey;
        case 2: return event.which == 3 && !event.metaKey;
        default: return false;
      }
    };
  } else {
    _isButton = function(event, code) {
      return event.which ? (event.which === code + 1) : (event.button === code);
    };
  }
  function isLeftClick(event) {
    return _isButton(event, 0);
  }
  function isMiddleClick(event) {
    return _isButton(event, 1);
  }
  function isRightClick(event) {
    return _isButton(event, 2);
  }

  if(Browser.IE) {
    function _relatedTarget(event) {
      var element;
      switch (event.type) {
        case 'mouseover':
          element = event.fromElement;
          break;
        case 'mouseout':
          element = event.toElement;
          break;
        default:
          return null;
      }
      return Element.$extend(element);
    }
    function _pointerX(event) {
      var docElement = document.documentElement;
      var body = document.body || { scrollLeft: 0 };

      return event.pageX ||
        (event.clientX +
          (docElement.scrollLeft || body.scrollLeft) -
          (docElement.clientLeft || 0)
        );
    }
    function _pointerY(event) {
      var docElement = document.documentElement;
      var body = document.body || { scrollTop: 0 };

      return event.pageY ||
        (event.clientY +
          (docElement.scrollTop || body.scrollTop) -
          (docElement.clientTop || 0)
        );
    }

    Event.$extend = function(event, element) {
      if(!event) {
        return false;
      }

      //拡張済みの場合、処理を抜ける
      if(event._extended) {
        return event;
      }
      event._extended = Util.$empty;

      //IE時にEventインスタンスで不足しているW3Cのメソッド・プロパティの拡張
      Util.$propcopy({
        target          : event.srcElement || element,
        pageX           : _pointerX(event),
        pageY           : _pointerY(event),
        stopPropagation : function() { this.cancelBubble = true; },
        preventDefault  : function() { this.returnValue = false; }
      }, event);

      //IE時にEventインスタンスで不足している他ブラウザのメソッド・プロパティの拡張
      Util.$propcopy({
        relatedTarget   : _relatedTarget(event)
      }, event);
      
      return event;
    };

  } else {
    Event.$extend = function(x) {
      return x;
    }
  }

  // FireFoxの場合、ブラウザの[戻る]で操作されると、window.onloadが発生しない。
  // onunloadに空関数をセットして、戻った際にonloadが発生するように対応する。
  // ※prototype.js(1.6.0.3参照)ではBrowser.WEBKITで対応→Safari不具合対応
  //   とされている。
  //   FireFoxで対応されていない理由は不明(単なるバグかもしれない？)
  //   但し、FireFoxで下記対応が無い場合でも、onloadで登録した別の
  //   イベントリスナーが復帰しているので、ページ遷移直前の状態に
  //   復帰していると思われる。
  //   最終的に下記対応が必要かどうか検証する必要がある。
  if(Browser.GECKO) {
    window.addEventListener('unload', Util.$empty, false);
  }

  function observe(element, eventName, handler) {
    //ACT0024 2011.08.30 start
    //handler拡張関数
    var _extendFunc = function(curryFunc, baseFunc, args) {
      var curry = curryFunc.curry.apply(curryFunc, args);
      curry._baseFunc = baseFunc;
      return curry;
    };
    //ACT0024 2011.08.30 end
    //ACT0029 2011.05.13 start
    //IE6のwindowのresizeイベントの場合はdocument.bodyにイベントをセットする
    if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0
        && element === window && eventName === 'resize') {
      element = document.body;
    }
    //ACT0051 2011.08.23 start
    //IEのwindowのresizeイベントの場合はdocument.bodyにもイベントをセットする
    else if(Browser.IE && element === window && eventName === 'resize') {
      var body = $(document.body);
      body.addEventListener(eventName, handler, false);
    }
    //ACT0051 2011.08.23 end
    //ACT0029 2011.05.13 end
    //ACT0031 2011.06.14 start
    //Google Chromeの場合、印刷中に不正なresizeが発生するため抑止する
    else if(Browser.WEBKIT
        && element === window && eventName === 'resize') {
      var _handler = function(hdl, evt) {
        //印刷中でない場合のみ処理を実行
        if(!Util.isPrinting) {
          hdl.call(window, evt);
        //印刷中の場合はイベントを停止
        } else {
          Event.$stop(evt);
        }
      };
      //ACT0024 2011.08.30 start
      //handler = _handler.curry(handler);
      handler = _extendFunc(_handler, handler, [handler]);
      //ACT0024 2011.08.30 end
    }
    //ACT0031 2011.06.14 end

    //ACT0024 2011.08.30 start
    var _handleShortCut = function(evtName, hdl, evt) {
      //ACT0072 2011.10.26 start
      var elm = Event.$element(evt);
      var areas = Util.disableAreas;
      var area = null;
      var len = 0;
      var node = null;
      //指定エリア抑止中の場合
      if(areas && (evtName === 'keydown' || evtName === 'click')) {
        len = areas.length;
        for(var i = 0; i < len; i++) {
          node = elm;
          area = areas[i];
          //親Elementをたどる
          while(node) {
            //抑止領域内の場合はイベントを停止
            if(area === node) {
              Event.$stop(evt);
              return false;
            }
            node = node.parentNode;
          }
        }
      }
      //ACT0072 2011.10.26 end
      //ショートカット抑止判定
      if(Util.$handleShortCut(evtName, evt)) {
        hdl.call(Event.$element(evt), evt);
      } else {
        return false;
      }
    };
    handler = _extendFunc(_handleShortCut, handler, [eventName, handler]);
    //ACT0024 2011.08.30 end

    element = $(element);
    return element.addEventListener(eventName, handler, false);
  }

  /*
   * イベント発行。
   * element: イベント発生させるDOM要素
   * eventName: イベント名(observeと同。'on'は付かない。)
   * 注：
   *   fireEventでイベント発生させる場合、イベントの詳細が不明な為、
   *   イベントハンドラに渡されるイベントオブジェクトは抽象的な情報のみ持つ。
   *   (マウスのイベントの場合、カーソル座標等は指定できない。
   *    Event.$elementでハンドラ登録元のDOM要素の取得は可能。)
   *   fireEventで呼び出される想定のイベントハンドラ内では、操作関連の情報は
   *   使用しないこと。
   */
  function fireEvent(element, eventName) {
    element = $(element);

    if(element == document
    && document.createEvent
    && !element.dispatchEvent) {
      element = document.documentElement;
    }

    var event;
    if(document.createEvent) {
      // FF,GC
      // ※本来、イベントのタイプによって、createEventの引数、
      //   及び初期化メソッドは異なる。
      //   マウスイベントの場合、createEvent('MouseEvents') / initMouseEvent
      //   イベント手動発行する為、イベントの各要素が定義出来ない。
      //   大元のEvent型(HTMLEvents)で処理を行うこととする。
      event = document.createEvent('HTMLEvents');
      event.initEvent(eventName, true, true);

    } else {
      // IE
      event = document.createEventObject();
      event.eventType = 'on' + eventName;
    }

    event.eventName = eventName;
    // fireEventから呼び出した際のマーク(fireflag)をセット
    event.fireflag = true;

    if(document.createEvent) {
      // FF,GC
      element.dispatchEvent(event);

    } else {
      // IE
      //ACT0046 2011.08.09 start
      //HTML-DOM判定処理
      var _isHTMLDom = function(obj) {
        var documentElement = (obj ? obj.ownerDocument || obj : 0).documentElement;
        return documentElement ? documentElement.nodeName === "HTML" : false;
      };
      //windowオブジェクト判定処理
      var _isWindow = function(elm) {
        var result = false;
        //elmがある場合
        if(elm) {
          //windowと等しい場合はtrue
          if(window === elm) {
            result = true;
          //そうでない場合はdocument属性がHTML-DOMだったら
          //windowオブジェクトと見なす
          } else if(Util.$isUndefined(elm.nodeType)) {
            result = _isHTMLDom(elm.document);
          }
        }
        return result;
      };
      //IEでwindowオブジェクトだったらbodyを代わりにfireする
      if(_isWindow(element)) {
        element = element.document.body;
      }
      //ACT0046 2011.08.09 end
      element.fireEvent(event.eventType, event);
    }
  }

  function element(event) {
    var node          = event.target;
    var type          = event.type;
    var currentTarget = event.currentTarget;

    if(currentTarget && currentTarget.tagName) {
      if (type === 'load' || type === 'error' ||
          (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
         && currentTarget.type === 'radio')) {
           node = currentTarget;
      }
    }

    // nodeTypeが3:TEXT_NODE(コンテンツの文字面)の場合
    if (node.nodeType == 3) {
      // parentNodeで元のHTMLタグ定義されているnodeを取得
      node = node.parentNode;
    }

    return Element.$extend(node);
  }

  function stop(event) {
    //ACT0032 2011.06.15 start
    //keyEventの場合
    if(!Util.$isUndefined(Event.$getKeyCode(event))) {
      //IEの場合
      if(Browser.IE) {
        //IE9の場合はnativeのイベントを無効にする必要がある
        if(Browser.PRODUCT_VERSION >= 8.0) {
          event = window.event ? window.event : event;
          try {
            event.keyCode = 0;
          } catch(e) {
          }
        //IE6の場合はkeyCodeを無効にする
        } else if(Browser.PRODUCT_VERSION <= 6.0) {
          if(!event.altKey) {
            //ACT0038 2011.07.05 start
            try {
              event.keyCode = 0;
            } catch(e) {
            }
            //ACT0038 2011.07.05 end
          }
        }
      }
    }
    //ACT0032 2011.06.15 end
    Event.$extend(event);
    event.preventDefault();
    event.stopPropagation();
    event.stopped = true;
  }

  function stopObserving(element, eventName, handler) {
    element = $(element);
    return element.removeEventListener(eventName, handler, false);
  }

  //ACT0016 2011.03.25 start
  /**
   * キーコード取得
   * @param {Event} event キーイベント
   * @return {number} キーコード
   */
  function getKeyCode(event) {
    if(event.keyCode) {
      return event.keyCode;
    } else if(event.charCode) {
      return event.charCode;
    } else {
      event.whitch;
    }
  }

  //ACT0021 2011.04.13 start
  /**
   * オフセット取得
   * @param {Event} event マウスイベント
   * @return {object(連想配列)} オフセット<br />
   * {x : offsetX, y : offsetY}
   */
  function getOffset(event) {
    var result = {x : 0, y : 0};
    var elm = null;
    var position = "";
    //イベントがある場合
    if(event) {
      if(Browser.GECKO) {
        elm = element(event);
        position = Element.$getStyle(elm, 'position');
        if(position == "absolute"
            || position == "relative"
            || position == "fixed") {
          result.x = event.layerX;
          result.y = event.layerY;
        } else {
          result.x = event.layerX - elm.offsetLeft;
          result.y = event.layerY - elm.offsetTop;
        }
      } else {
        result.x = event.offsetX;
        result.y = event.offsetY;
      }
    }
    return result;
  }

  Util.$propcopy({
    $element       : element,
    $observe       : observe,
    $fireEvent     : fireEvent,
    $stop          : stop,
    $stopObserving : stopObserving,
    $isLeftClick   : isLeftClick,
    $isMiddleClick : isMiddleClick,
    $isRightClick  : isRightClick,
    $getKeyCode    : getKeyCode,
    $getOffset     : getOffset
  }, Event);
  //ACT0021 2011.04.13 end
  //ACT0016 2011.03.25 end

  if(window.Event) {
    Util.$propcopy(Event, window.Event);
  } else {
    window.Event = Event;
  }
})();

/*
 * Request
 */
var Request = function(url, options) {
  this.response = null;
  this._complete = false;
  this.transport = Util.$createXHR();

  //20110210 start:ACT0003
  if(Browser.IE) {
    var opt = {};
    opt = Util.$propcopy(options, opt);
    //URLの存在チェックをする場合
    if(opt.isCheckExist) {
      if(!url) {
        //IEではurlが空の場合、onExceptionが来るので
        //onFailureに飛ばしなおす
        opt.onException = (function(opt){
          return function(req, e) {
            var res = new Response(req);
            opt.onFailure(res);
            res = null;
          }
        }
        )(opt);
      } else {
        //IEではurlが不正の場合、
        //onFailureの他にonExceptionも来るので
        //onExceptionを無効化する
        opt.onException = (function(req, e){});
      }
    }
    this.request(url, opt);

  //ACT0036 2011.06.30 start
  //GCでローカル環境の場合
  } else if(Browser.WEBKIT && Util.IS_LOCAL) {
    var opt = {};
    opt = Util.$propcopy(options, opt);
    //URLの存在チェックをする場合
    if(opt.isCheckExist) {
      opt.onSuccess = (function(success, failure) {
        return function(res) {
          //XMLがない場合は存在しない
          if(!res.responseXML && res.request.options.isXML) {
            failure(res);
          //XMLがある場合は存在する
          } else {
            success(res);
          }
        }
      })(opt.onSuccess, opt.onFailure);
    }
    this.request(url, opt);
    //ACT0036 2011.06.30 end
  //ACT0098 2013.05.15 start
  //FFでローカル環境の場合
  } else if(Browser.GECKO && Util.IS_LOCAL) {
    var opt = {};
    opt = Util.$propcopy(options, opt);
    //URLの存在チェックをする場合
    if(opt.isCheckExist) {
      //FFではurlが不正の場合、onExceptionが来るので
      //onFailureに飛ばしなおす
      opt.onException = (function(opt){
        return function(req, e) {
          var res = new Response(req);
          opt.onFailure(res);
          res = null;
        }
      }
      )(opt);
    }
    this.request(url, opt);
  //ACT0098 2013.05.15 end
  } else {
    this.request(url, options);
  }
  //20110210 end
};

Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Request.prototype.request = function(url, options) {
  this._complete = false;
  this.transport.abort();

  this.options = {
    method:       'get',
    asynchronous: true,
    contentType:  'application/x-www-form-urlencoded',
    encoding:     'UTF-8',
    parameters:   ''
  };
  this.options = Util.$propcopy(options, this.options);

  this.url = url;
  this.method = this.options.method.toLowerCase();

  if(Util.$isString(this.options.parameters)) {
    // hash化
    this.options.parameters = Util.$toQueryParams(this.options.parameters);
  }
//  else if(Util.$isHash(this.options.parameters)) {
//    this.options.parameters = Util.$toQueryString(this.options.parameters);
//  }
  if('get' != this.method && 'post' != this.method) {
    //methodの設定がおかしい場合、'_method'として値を送信対象とする
    this.options.parameters['_method'] = this.method;
    this.method = 'get';
  }
  var param = '';
  if(Util.$isHash(this.options.parameters)) {
    param = Util.$toQueryString(this.options.parameters);
  }

  if(param) {
    if(this.method == 'get') {
      this.url += (this.url.indexOf('?') > -1 ? '&' : '?') + param;
    }
  }

  this.transport.onreadystatechange = this.onStateChange.bind(this);

  try {
    // 上記でパラメータ結合したurlを指定
    this.transport.open(this.method, this.url, this.options.asynchronous);
    if(this.options.asynchronous) {
      //非同期の場合、時間を置いて'Loading'状態が発生するように仕掛けておく
      this.respondToReadyState.bind(this).defer(1);
    }

    this.setRequestHeaders();

    this.body = this.method == 'post' ? (this.options.postBody || param) : null;
    this.transport.send(this.body);

    /* Force Firefox to handle ready state 4 for synchronous requests */
    //Mozilla仕様では非同期の場合のみonstatechangeを発生させるとなっている為、
    //挙動を統一
    if(!this.options.asynchronous && this.transport.overrideMimeType) {
      this.onStateChange();
    }

  }
  catch(e) {
    this.dispatchException(e);
  }
};

Request.prototype.setRequestHeaders = function() {
  var headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
  };

  if(this.method == 'post') {
    headers['Content-type'] = this.options.contentType +
      (this.options.encoding ? '; charset=' + this.options.encoding : '');

    //[TODO]運用ブラウザが確定した場合、下記処理不要な為、削除する
    /* Force "Connection: close" for older Mozilla browsers to work
     * around a bug where XMLHttpRequest sends an incorrect
     * Content-length header. See Mozilla Bugzilla #246651.
     */
    //古いMozilla系ブラウザのバグ対応
    if(this.transport.overrideMimeType
    && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005) {
      headers['Connection'] = 'close';
    }
  }

  if(typeof this.options.requestHeaders == 'object') {
    var extras = this.options.requestHeaders;

    // Arrayの場合(=pushが関数定義されている場合)
    // 偶数要素(0含む):key, 奇数要素:value
    if(Util.$isFunction(extras.push)) {
      for(var i = 0, length = extras.length; i < length; i += 2) {
        headers[extras[i]] = extras[i + 1];
      }
    } else {
      headers = Util.$propcopy(extras, headers);
    }
  }

  for(var name in headers) {
    this.transport.setRequestHeader(name, headers[name]);
  }
};

Request.prototype.onStateChange = function() {
  var readyState = this.transport.readyState;
  if (readyState > 1 && !((readyState == 4) && this._complete)) {
    this.respondToReadyState(readyState);
  }
};

Request.prototype.respondToReadyState = function(readyState) {
  var stateEvent = Request.Events[readyState];
  var response = new Response(this);
  this.response = response;

  if(stateEvent == 'Complete') {
//[TODO]ローカルファイル取得の判定については、
//      サーバ通信して検証した結果で実装決定する。
//    var h = this.transport.getAllResponseHeaders();
//    if(h == null) {
//      //ローカルファイル使用に判定可？
//    }
//}
    try {
      this._complete = true;
      //this.options['on' + response.status]
      //HTTPステータスで処理判定はアプリ層で不要の為、削除
      //判定必要であればonFailureでstatus判定すること
      (this.options['on' + (response.success() ? 'Success' : 'Failure')]
      || Util.$empty)(response);
    }
    catch (e) {
      this.dispatchException(e);
    }
  }

  try {
    (this.options['on' + stateEvent] || Util.$empty)(response);
  }
  catch (e) {
    this.dispatchException(e);
  }

  if(stateEvent == 'Complete') {
    this.transport.onreadystatechange = Util.$empty;
  }
};

Request.prototype.dispatchException = function(exception) {
  function _defaultException(req, e) {
    Util.$eAlert(e);
  }

  // options(onException)でコールバック関数が定義されていない場合、
  // デフォルトの例外処理(alert表示)を行う
  (this.options.onException || _defaultException)(this, exception);
//  (this.options.onException || Util.$empty)(this, exception);
};

Request.prototype.getStatus = function() {
  try {
    return this.transport.status || 0;
  }
  catch (e) {
    return 0;
  }
};

/*
 * Response
 */
var Response = function(request) {
  this.request = request;
  this.transport  = request.transport;
  //※参照回数削減の為、変数定義
  var transport   = request.transport;
  this.readyState = transport.readyState;
  //※参照回数削減の為、変数定義
  var readyState  = transport.readyState;
  this.status = 0;

  //IEの場合、readyState=3の状態では、プロパティ値取得できない為、判定
  if((readyState > 2 && !Browser.IE) || readyState == 4) {
    this.status       = request.getStatus();
    this.responseText = transport.responseText;
  }

  if(readyState == 4) {
    //ACT0004 2011.02.16 start
    if(!request.options.isXML) {
      this.responseXML = null;
    } else {
    //ACT0004 2011.02.16 end
      var xml = transport.responseXML;
      if(xml == null || Util.$isUndefined(xml)) {
        this.responseXML = null;
      }
      else if(xml.documentElement == null) {
  //[TODO]ローカルファイル取得の判定については、
//        サーバ通信して検証した結果で実装決定する。
        //ローカルファイル(xml)をIEので取得した場合、
        //正しくパースされない為、DOMDocumentを使用して解析する。
        //再パースして例外発生する場合はresponseXMLをnullとする。
        //※例外発生せずパース失敗する場合は、parseXMLがnullを返す。
        try {
          this.responseXML = Util.$parseXML(this.responseText);
        }catch(e) {
          this.responseXML = null;
        }
      } else {
        this.responseXML = xml;
      }
      //this.responseXML = Util.$isUndefined(xml) ? null : xml;
    //ACT0004 2011.02.16 start
    }
    //ACT0004 2011.02.16 end
  }
};

Response.prototype.success = function() {
  //HTTPステータス200～299(206) 正常で扱うステータス
  //ローカルファイル読み込みした場合は0
  //※指定ファイルが無い場合、IEでは2がセットされている
  return !this.status || (this.status >= 200 && this.status < 300);
};

/*
 * Facebox
 */
var Facebox = function(extra_set) {

  //ACT0023 2011.04.20 start
  //CSSのリンクのパスからfaceboxのベースのパスを取得
  var links = $$('link');
  var len = links.length;
  var position = 0;
  var basePath = '';
  var curHref = '';
  var _endsWith = function(str, suffix) {
    var sub = str.length - suffix.length;
    return (sub >= 0) && (str.lastIndexOf(suffix) === sub);
  };
  //ACT0067 2011.09.13 start
  var FACEBOX_CSS_NAME = 'facebox.css';
  //ACT0067 2011.09.13 end
  //linkタグを走査
  for(var i = 0; i < len; i++) {
    curHref = links[i].href;
    //ACT0067 2011.09.13 start
    //hrefが「facebox.css」で終わっている場合
    if(_endsWith(curHref, FACEBOX_CSS_NAME)) {
      position = curHref.lastIndexOf(FACEBOX_CSS_NAME)
      //ACT0067 2011.09.13 end
      //facebox.cssのみ記述の場合はベースは空文字
      if(position == 0) {
        break;
      //facebox.cssの前にパスがある場合
      } else if(position > 0) {
        //facebox.cssの直前に「/」がある場合はfacebox.cssと見なし
        //facebox.cssのフォルダのパスをベースのパスとする
        if(curHref.charAt(position - 1) === '/') {
          basePath = curHref.substring(0, position);
          break;
        }
      }
    }
  }
  //ACT0023 2011.04.20 end

  // Facebox使用イメージ(タイトル、閉じるボタン)
  //ACT0023 2011.04.20 start
  //デフォルトはfacebox.cssと同じフォルダにあるという設定（既存と同じ動作）
  //var default_caption_image = './facebox/mtrx-bg.png';
  //var default_close_image   = './facebox/x.png';
  var default_caption_image = basePath + 'fbx_mtrx_bg.png';
  var default_close_image = basePath + 'fbx_x.png';
  //ACT0023 2011.04.20 end

  // Facebox使用イメージ 読み込み中デフォルトイメージ
  //ACT0023 2011.04.20 start
  //デフォルトはfacebox.cssと同じフォルダにあるという設定（既存と同じ動作）
  //var default_loading_image = './facebox/loading.gif';
  //ACT0069 2011.09.14 start
  //var default_loading_image = basePath + 'fbx_loading.gif';
  //ACT0069 2011.09.14 end
  //ACT0023 2011.04.20 end

  // Faceboxに表示可能なイメージのファイルフォーマット(拡張子)
  var default_suffix = ['png', 'jpg', 'jpeg', 'gif'];

  // 背景(グレーシェード)の表示濃度
  var default_opacity = 0.35;

  this.settings = {
    //ACT0069 2011.09.14 start
    //loading_image : default_loading_image,
    //ACT0069 2011.09.14 end
    //ACT0067 2011.09.13 start
    caption_image : default_caption_image,
    close_image   : default_close_image,
    //ACT0067 2011.09.13 end
    image_types   : new RegExp('\.(' + default_suffix.join('|') + ')$', 'i'),
    opacity       : default_opacity,
    /* ACT0066 2011.09.12 start
    facebox_html  : '\
      <div id="facebox" style="display:none;"> \
        <div class="popup"> \
          <table id="facebox_table"> \
            <tbody> \
              <tr> \
                <td id="facebox_name" class="tname"> \
                  FaceBox \
                </td> \
                <td id="facebox_close"> \
                  <div class="title"> \
                    <a href="#" class="close"> \
                      <img src="./facebox/x.png" title="close" class="close_image"/> \
                    </a> \
                  </div> \
                </td> \
              </tr> \
              <tr> \
                <td class="body" colspan="2"> \
                  <div class="content"> \
                  </div> \
                </td> \
              </tr> \
            </tbody> \
          </table> \
        </div> \
      </div> \
'
*/
    //ACT0067 2011.09.14 start
    //ACT0071 2011.09.28 start
    facebox_html  : '\
      <div id="facebox" style="display:none;"> \
        <div class="popup"> \
          <table id="facebox_table"> \
            <tbody> \
              <tr> \
                <td id="facebox_name" class="tname"> \
                  FaceBox \
                </td> \
                <td> \
                  <div class="title"> \
                    <div id="facebox_close"> \
                      <a href="javascript:void(0);" class="close"> \
                        <img title="close" class="close_image"/> \
                      </a> \
                    </div> \
                  </div> \
                </td> \
              </tr> \
              <tr> \
                <td class="body" colspan="2"> \
                  <div class="content"> \
                  </div> \
                </td> \
              </tr> \
            </tbody> \
          </table> \
        </div> \
      </div> \
' // ACT0066 2011.09.12 end
  //ACT0071 2011.09.28 end
  //ACT0067 2011.09.14 end
  };
  //ACT0023 2011.04.20 start
  this.settings.base_path = basePath;
  //ACT0067 2011.09.13 start
  //this.settings.facebox_html = this.settings.facebox_html.replace('"./facebox/x.png"',
  //    '"' + default_close_image + '"');
  //imgのsrc属性は画像がロードされてしまうのでとりあえずダミーのパスを入れておく
  //（facebox.css自身のパス）
  //this.settings.facebox_html = this.settings.facebox_html.replace('"./facebox/x.png"',
  //    '"' + this.settings.base_path + '/' + FACEBOX_CSS_NAME + '"');
  //ACT0067 2011.09.13 end
  //ACT0023 2011.04.20 end

  if(extra_set) {
    Util.$propcopy(extra_set, this.settings);
  }

  // Faceboxの要素の存在チェック
  if($('facebox')) {
    // 存在する場合、例外発生
    //[TODO]エラー時の文言調整
    throw 'A new instance cannot be made.';
    return;
  }

  // Facebox要素追加
  // IE6暫定措置
  if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
    Element.$insert($(document.body), {
      bottom: '<iframe id="facebox_overlay2" style="display:none;"/>'
    });
  }
  Element.$insert($(document.body), {
    bottom: '<div id="facebox_overlay" style="display:none;"/>'
  });
  Element.$insert($(document.body), {
    bottom: this.settings.facebox_html
  });

  //ACT0067 2011.09.13 start
  //Util.$preload(default_caption_image);
  //Util.$preload(default_close_image);
  //Util.$preload(this.settings.loading_image);
  //ACT0067 2011.09.13 end

  this.facebox = $('facebox');
  this.facebox_overlay = $('facebox_overlay');
  // IE6暫定措置
  if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
    this.facebox_overlay2 = $('facebox_overlay2');
  }

  var rels = $$('a[rel^="facebox"]');
  for(var i = 0, l = rels.length; i < l; i++) {
    var elem = rels[i];
    Event.$observe(elem, 'click', this.watchRelClick.bindAsEventListener(this, elem));
  }

  this.closeClickListener = this.watchCloseClick.bindAsEventListener(this);

  Event.$observe($$('#facebox .close')[0], 'click', this.closeClickListener);

  this.keyDownListener = this.watchKeyDown.bindAsEventListener(this);
  //ACT0025 2011.05.10 start
  this.closeHandler = null;
  //ACT0025 2011.05.10 end
  //ACT0032 2011.06.15 start
  this.focusListener = this.watchFocus.bindAsEventListener(this);
  //ACT0032 2011.06.15 end
  //ACT0054 2011.08.31 start
  this.rootElement = $$("html")[0];
  this.scrollPosition = null;
  //ACT0054 2011.08.31 end
  //ACT0060 2011.09.05 start
  this.lastElement = new Element('div');
  this.lastElement.tabIndex = 0;
  //ACT0060 2011.09.05 end
  //ACT0068 2011.09.14 start
  this.isSystemError = false;
  //ACT0068 2011.09.14 end
};

//ACT0060 2011.09.05 start
Facebox.START_TABINDEX = 1001;
//ACT0060 2011.09.05 end

// Facebox表示指定しているaタグのクリックイベントハンドラ
// ※Faceboxの外側
Facebox.prototype.watchRelClick = function(event, element) {
  Event.$stop(event);
  this.click_handler(event, element);
};

// Faceboxの閉じるボタンクリックイベントハンドラ
Facebox.prototype.watchCloseClick = function(event) {
  //ACT0025 2011.05.10 start
  if(Util.$isFunction(this.closeHandler)) {
    this.closeHandler(event);
    this.closeHandler = null;
    Event.$stop(event);
  } else {
    Event.$stop(event);
    this.close();
  }
  //ACT0025 2011.05.10 end
};

// Facebox表示時のキーダウンイベントハンドラ
// (ESCキーで閉じる対応)
Facebox.prototype.watchKeyDown = function(event) {
  var code = Event.$getKeyCode(event);
  var elem = Event.$element(event);
  // ESCキー押下時は閉じる
  if(code == Event.KEY_ESC) {
    //ACT0032 2011.06.15 start
    //閉じるボタン表示中のみ実行
    //ACT0071 2011.09.28 start
    //if(Element.$visible('facebox_close')) {
    if(Element.$getStyle('facebox_close', 'visibility') !== 'hidden') {
    //ACT0071 2011.09.28 end
      //ACT0025 2011.05.10 start
      if(Util.$isFunction(this.closeHandler)) {
        this.closeHandler(event);
        this.closeHandler = null;
      } else {
        this.close();
      }
      //ACT0025 2011.05.10 end
    }
    //ACT0032 2011.06.15 end
  //ACT0032 2011.06.15 start
  // TABキー押下時はタブ移動の制御を行う
  } else if(code == Event.KEY_TAB
      && !event.ctrlKey
      && !event.altKey) {
    // Facebox内のElementは標準動作
    if(Element.$descendantOf(elem, $('facebox'))) {
      // 先頭Elementでshift+TABの場合は動かさない
      if(event.shiftKey && this.topElement === elem) {
        Event.$stop(event);
      }
    // Facebox外の場合はFacebox内の先頭Elementにfocusを移動する
    } else {
      // 先頭Elementが存在する場合のみfocusを移動する
      Event.$stop(event);
      if(this.topElement) {
        this.topElement.focus();
      }
    }
  // その他のキーの場合
  } else {
    // Facebox内でないキーイベントは全て抑止
    if(!Element.$descendantOf(elem, $('facebox'))) {
      Event.$stop(event);
    }
  }
  //ACT0032 2011.06.15 end
};

//ACT0032 2011.06.15 start
/**
 * フォーカス監視処理(bodyタグ)
 * @private
 */
Facebox.prototype.watchFocus = function(event) {
  // 先頭Elementが存在する場合focusを移動する
  // （ブラウザのメニューからdocumentにfocusが移動してきた場合）
  if(this.topElement) {
    this.topElement.focus();
  }
};
//ACT0032 2011.06.15 end

// Faceboxイメージ表示 イメージ読み込み完了イベントハンドラ
Facebox.prototype.watchImageLoaded = function(event, image, klass) {
  this.reveal('<div class="image"><img src="' + image.src + '"/></div>', klass);
};

Facebox.prototype.click_handler = function(event, element) {
  //ACT0069 2011.09.14 start
  this.clearContent();
  //// 一旦コンテント部を削除し、読み込み中イメージ表示する
  //// ※イメージ表示しても、Faceboxの親要素が非表示の為、
  ////   読み込み中イメージは表示されない。
  //// [TODO]読み込み中表示対応について
  //// 親要素表示して対応を行う場合、ESCキー等による中断を考慮する必要があるが、
  //// 制御が難しいと思われる。
  //// 読み込み中表示はイメージ単独表示する際の対応だが、イメージ単独表示自体が
  //// 現時点(2010/12/08)で必要かどうか判定できない。
  //// (※利用Ｂにはそういう要件はない)
  //// 一旦現状維持とし、機能的に必要な場合、再検討する。
  //this.loading();
  //ACT0069 2011.09.14 end

  var klass = element.rel.match(/facebox\[\.(\w+)\]/);
  if(klass) {
    klass = klass[1];
  }

  if(element.href.match(/#/)) {
    var url    = window.location.href.split('#')[0];
    var target = element.href.replace(url+'#', '');
    var d      = $(target);
    var data   = new Element(d.tagName);

    data.innerHTML = d.innerHTML;

    this.reveal(data, klass);
  }
  else if(element.href.match(this.settings.image_types)) {
    var img = new Image();
    img.onload = this.watchImageLoaded.bindAsEventListener(this, img, klass);
    img.src    = element.href;
  }
  else {
    // do nothing
  }
};

//ACT0069 2011.09.14 start
//Facebox.prototype.loading = function() {
//// ロードイメージ表示中であれば、なにもしない
//if($$('#facebox .loading').length == 1) {
//  return;
//}
//
//// コンテント部を全て削除
//var contentWrapper = $$('#facebox .content')[0];
//var descendants = Element.$immediateDescendants(contentWrapper);
//for(var i = 0, l = descendants.length; i < l; i++) {
//  Element.$remove(descendants[i]);
//}
//
//// コンテント部にロードイメージを表示
//Element.$insert(contentWrapper, {
//  bottom: '<div class="loading"><img src="' + this.settings.loading_image + '"/></div>'
//});
//
//// 表示位置調整（画面中央に）
//Element.$setStyle(this.facebox, {
////  margin: (-26 - Element.$getHeight(this.facebox)) / 2 + 'px 0px 0px ' + (0 - Element.$getWidth(this.facebox)) / 2 + 'px'
//  margin: (-Element.$getHeight(this.facebox)) / 2 + 'px 0px 0px ' + (0 - Element.$getWidth(this.facebox)) / 2 + 'px'
//});
//};
//ACT0069 2011.09.14 end

//ACT0069 2011.09.14 start
/**
 * コンテント領域クリア処理
 * @private
 */
Facebox.prototype.clearContent = function() {
  // コンテント部を全て削除
  var contentWrapper = $$('#facebox .content')[0];
  var descendants = Element.$immediateDescendants(contentWrapper);
  for(var i = 0, l = descendants.length; i < l; i++) {
    Element.$remove(descendants[i]);
  }
};
//ACT0069 2011.09.14 end

//ACT0007 2011.03.03 start
//Facebox.prototype.reveal = function(data, klass, ignoreclose, title) {
Facebox.prototype.reveal = function(data, klass, ignoreclose, title, isChangeID, prefix, invisible, imageTitle, closeHandler, isSystemError) {
  //isChangeID true:id書換する false:id書換しない（デフォルト）（dataがElementの場合のみ）
  //prefix id書換時に付加するプリフィックス（デフォルト：「fbox_」）
  //invisible Facebox表示HTMLで消したいクラス名（非表示用クラス名）
  //imageTitle ×ボタンのtitle,alt
//ACT0007 2011.03.03 end
  // ACT0054 2011.08.31 start
  this.scrollPosition = this.getScrPos();
  Element.$addClassName(this.rootElement, 'facebox_noscrollbar');
  // ACT0054 2011.08.31 end

  //ACT0069 2011.09.14 start
  this.clearContent();
  //// 一旦コンテント部を削除し、読み込み中イメージ表示する
  //// ※HTML文書表示(イメージ表示のケースでない)の場合、
  ////   読み込み中イメージが表示されても、すぐに指定HTML表示に切り替わる為、
  ////   読み込み中イメージは見えない。
  //this.loading();
  //ACT0069 2011.09.14 end

  //ACT0069 2011.09.14 start
  //// 読み込み中イメージを削除
  //var load = $$('#facebox .loading')[0];
  //if(load) {
  //  Element.$remove(load);
  //}
  //ACT0069 2011.09.14 end

  //ACT0025 2011.05.10 start
  if(Util.$isFunction(closeHandler)) {
    this.closeHandler = closeHandler;
  } else {
    this.closeHandler = null;
  }
  //ACT0025 2011.05.10 end

  // コンテント部にCSSクラスを付与
  var contentWrapper = $$('#facebox .content')[0];
  // this.settings.facebox_htmlのclassに初期化する。
  // (当たっている前回klassの削除)
//  contentWrapper.className = 'content';
  this.facebox.className = '';
  if(klass) {
//    Element.$addClassName(contentWrapper, klass);
    Element.$addClassName(this.facebox, klass);
  }

  //ACT0009 2011.03.08 start
  //クローズボタンのtitle指定がある場合は設定する
  if(imageTitle) {
    var closeImage = $$('#facebox_close img')[0];
    closeImage.title = imageTitle;
    closeImage.alt = imageTitle;
  }
  //ACT0009 2011.03.08 end

  //ACT0068 2011.09.14 start
  this.isSystemError = !!isSystemError;
  //ACT0068 2011.09.14 end

  //ACT0010 2011.03.08 start
  //ACT0007 2011.03.03 start
  var isStringData = false;
  var cloneData = null;
  //outerHTML取得処理
  var _outerHTML = function(element) {
    var result = '';
    try {
      //outerHTMLがある場合はそれを使う
      if(element.outerHTML) {
        result = element.outerHTML;
      //outerHTMLがない場合はXMLSerializerを利用
      } else {
        result = Util.$serializeXML(element);
      }
    } catch(e) {
    }
    return result;
  }
  cloneData = Element.$extend(document.createElement('form'));
  cloneData.id = 'form_facebox';
  cloneData.method = 'post';
  cloneData.action = '';
  //文字列データの場合はinnerHTMLでダミーのフォームに入れる
  if(typeof(data) == 'string') {
    isStringData = true;
    cloneData.innerHTML = data;
  //Elementデータの場合はクローンしてダミーのフォームに入れる
  } else {
    cloneData.innerHTML = _outerHTML(data);
    //invisibleの指定がある場合は該当クラスを除去
    if(invisible) {
      Element.$removeClassName(cloneData.firstChild, invisible)
    }
  }

  //ID書換フラグがtrueの場合はID書換を実行
  if(isChangeID) {
    var _convertID = function(element) {
      if(element) {
        var nodes = element.childNodes;
        var len = nodes.length;
        var node = null;
        //IDがある場合はプリフィックスを付加する
        if(element.id) {
          element.id = prefix + element.id;
        }
        //子ノードループ
        for(var i = 0; i < len; i++) {
          node = nodes[i];
          //Elementの場合はその子ノードを見に行く
          if(node.nodeType == 1) {
            _convertID(node);
          }
        }
      }
    };
    //プリフィックスがない場合はデフォルトのプリフィックス「fbx_」を設定
    if(!prefix) {
      prefix = 'fbx_';
    }
    _convertID(cloneData);
  }

  //文字列データの場合
  if(isStringData) {
    //formがある場合はそのままの文字列をFaceboxに入れる
    if(cloneData.getElementsByTagName('form').length > 0) {
      data = cloneData.innerHTML;
    //formがない場合はformを追加した文字列をFaceboxに入れる
    } else {
      data = _outerHTML(cloneData);
    }
  //Elementの場合
  } else {
    //formがある場合はそのままのElementをFaceboxに入れる
    if(cloneData.getElementsByTagName('form').length > 0) {
      data = cloneData.firstChild;
    //formがない場合はformを追加したElementをFaceboxに入れる
    } else {
      data = cloneData;
    }
  }
  cloneData = null;
  //ACT0007 2011.03.03 end
  //ACT0010 2011.03.08 end

  // コンテント部にコンテンツを挿入
  Element.$insert(contentWrapper, { bottom: data });

  // ボディ部（コンテント部）を全て表示
  var elems = Element.$immediateDescendants($$('#facebox .body')[0]);
  for(var i = 0, l = elems.length; i < l; i++) {
    Element.$show(elems[i]);
  }

  // タイトル指定が無い場合
  if(!title) {
    // デフォルト 'FaceBox'
    title = 'FaceBox';
  }
  $("facebox_name").innerHTML = title;

  // 閉じるボタン表示/非表示
  // ※show()で閉じるボタンの表示/非表示を判定してイベント登録するので、
  //   下記this.show()より前に処理を行うこと。
  if(ignoreclose) {
    //ACT0071 2011.09.28 start
    //Element.$hide('facebox_close');
    Element.$setStyle('facebox_close', {visibility: 'hidden'})
    //ACT0071 2011.09.28 end
  } else {
    //ACT0071 2011.09.28 start
    //Element.$show('facebox_close');
    Element.$setStyle('facebox_close', {visibility: 'visible'})
    //ACT0071 2011.09.28 end
//    Event.$observe(document, 'keydown', this.keyDownListener);
// →show()で制御
  }

  // フェイスボックス部を全て表示
  this.show();

  // 表示位置調整（画面中央に）
  //ACT0087 2012.10.04 start
//  if(Terminal.IPAD == false) {
  //ACT0102 2013.08.19 start
  if(Terminal.IPAD == true) {
  //ACT0102 2013.08.19 end
　  Element.$setStyle(this.facebox, {
      margin: (0 - Element.$getHeight(this.facebox)) / 2 + 'px 0px 0px ' + (0 - Element.$getWidth(this.facebox)) / 2 + 'px'
    });
  }
  //ACT0087 2012.10.04 end
  // ACT0054 2011.08.31 start
  var scrPos = this.getScrPos();
  var winSize = this.getWindowSize();
  Element.$setStyle(this.facebox, {
    top: (winSize.my + scrPos.y) + 'px'
  });
  Element.$setStyle(this.facebox, {
    left: (winSize.mx + scrPos.x) + 'px'
  });
  //ACT0087 2012.10.04 start
  if(Terminal.IPAD == false) {
　  Element.$setStyle(this.facebox, {
      margin: (0 - Element.$getHeight(this.facebox)) / 2 + 'px 0px 0px ' + (0 - Element.$getWidth(this.facebox)) / 2 + 'px'
    });
  }
  //ACT0087 2012.10.04 end
  // ACT0062 2011.09.05 start
  /*
  Element.$setStyle(this.facebox_overlay, {
    height: (document.documentElement.scrollHeight || document.body.scrollHeight) + 'px'
  });
  */
  
  Event.$observe(window, "resize",
    (function(own) {
      return function() {
        var scrPos = own.getScrPos();
        var winSize = own.getWindowSize();
        Element.$setStyle(own.facebox, {
          top: (winSize.my + scrPos.y) + 'px'
        });
        Element.$setStyle(own.facebox, {
          left: (winSize.mx + scrPos.x) + 'px'
        });
        Element.$setStyle(own.facebox, {
          margin: (0 - Element.$getHeight(own.facebox)) / 2 + 'px 0px 0px ' + (0 - Element.$getWidth(own.facebox)) / 2 + 'px'
        });
      };
    })(this)
  );
  
  // ACT0062 2011.09.05 end
  // ACT0054 2011.08.31 end
};

// ACT0054 2011.08.31 start
Facebox.prototype.getScrPos = function() {
  var obj = {};
  
  obj.x = document.documentElement.scrollLeft || document.body.scrollLeft;
  obj.y = document.documentElement.scrollTop  || document.body.scrollTop;
  
  return obj;
};

Facebox.prototype.getWindowSize = function() {
  var obj = {};
  
  obj.x = document.documentElement.clientWidth  || document.body.clientWidth  || document.body.scrollWidth;
  obj.y = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
  obj.mx = parseInt((obj.x) / 2);
  obj.my = parseInt((obj.y) / 2);
  
  return obj;
};
// ACT0054 2011.08.31 end

Facebox.prototype.show = function() {
  //ACT0067 2011.09.13 start
  Util.$preload(this.settings.caption_image);
  Util.$preload(this.settings.close_image);
  $$('#facebox_close img')[0].src = this.settings.close_image;
  //ACT0069 2011.09.14 start
  //Util.$preload(this.settings.loading_image);
  //ACT0069 2011.09.14 end
  //ACT0067 2011.09.13 end

  if(!Element.$visible(this.facebox_overlay)) {
    Element.$addClassName(this.facebox_overlay, 'facebox_overlayBG');
    Element.$setOpacity(this.facebox_overlay, this.settings.opacity);
    Element.$show(this.facebox_overlay);
    // IE6暫定措置
    if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
      Element.$show(this.facebox_overlay2);
    }
  }
  if(!Element.$visible(this.facebox)) {
    Element.$show(this.facebox);
  }

  //ACT0032 2011.06.15 start
  // ESCキーイベント登録
  //if(Element.$visible('facebox_close')) {
  //  // 閉じるボタン表示中は、keydownイベント登録する
  //  //Event.$observe(document, 'keydown', this.keyDownListener);
  //}

  // facebox内の先頭Element設定
  this.topElement = null;
  // 閉じるボタン表示時は閉じるボタンが先頭
  //ACT0069 2011.09.28 start
  //if(Element.$visible('facebox_close')) {
  if(Element.$getStyle('facebox_close', 'visibility') !== 'hidden') {
  //ACT0069 2011.09.28 start
    this.topElement = $$('#facebox_close a')[0];
    //ACT0060 2011.09.05 start
    this.topElement.tabIndex = Facebox.START_TABINDEX;
    //ACT0060 2011.09.05 end

  // 閉じるボタン非表示時はcontentの中から探す
  } else {
    var elms = $$('#facebox .content *');
    var len = elms.length;
    var elm = null;
    var formTags = ['A', 'AREA', 'BUTTON', 'INPUT', 'OBJECT', 'SELECT', 'TEXTAREA', 'LABEL'];
    //ACT0060 2011.09.05 start
    var CONTENTS_START_TABINDEX = Facebox.START_TABINDEX + 1;
    //ACT0060 2011.09.05 end
    // Elementが存在する場合
    if(len > 0) {
      // Elementをループ
      for(var i = 0; i < len; i++) {
        elm = elms[i];
        //ACT0060 2011.09.05 start
        // 開始Elementが見つかった場合は処理を抜ける
        if(elm.tabIndex == CONTENTS_START_TABINDEX) {
          this.topElement = elm;
          break;
        }
        // 開始Elementが未登録の場合は仮の開始Elementを設定する
        if(!this.topElement) {
          // フォーカス可能な最初のElementを先頭に設定
          if(elm.tabIndex != -1 && Util.$getIndexOfArray(formTags, elm.tagName) >= 0) {
            this.topElement = elm;
            //break;
          }
        }
        //ACT0060 2011.09.05 end
      }
    }
  }

  // bodyタグをフォーカス可能にしてフォーカスイベント登録
  var body = $$('body')[0];
  body._tabIndex = body.tabIndex;
  //ACT0060 2011.09.05 start
  //body.tabIndex = 0;
  body.tabIndex = 1;
  //ACT0060 2011.09.05 end
  Event.$observe(body, 'focus', this.focusListener);

  // キーイベント登録
  Event.$observe(document, 'keydown', this.keyDownListener);

  //ACT0060 2011.09.05 start
  Element.$insert(body, {top : this.lastElement});
  Event.$observe(this.lastElement, 'focus', this.focusListener);
  //ACT0060 2011.09.05 end

  //// フォーカス遷移制御(accessKey:アクセラレータキーは対象外)
  //// tabIndex退避＆セット
  //// [TODO]IE6で<object>タグの場合、_tabIndexが追加できない。
  ////       close時に復帰出来ない。
  ////       <object>タグを使用、及びFacebox表示する場合、再度調整する。
  ////ACT0019 2011.04.08 start
  //var els = $$('a', 'area', 'button', 'input', 'object', 'select', 'textarea', 'iframe');
  ////ACT0019 2011.04.08 end
  //var facebox = $$('#facebox');

  //for(var i = 0, il = els.length; i < il; i++) {
  //  var childFlag = false;
  //  // Faceboxの子孫Elementかチェック
  //  // →子孫の場合、tabIndex制御対象外
  //  for(var j = 0, jl = facebox.length; j < jl; j++) {
  //    if(Element.$descendantOf(els[i], facebox[j])) {
  //      childFlag = true;
  //      break;
  //    }
  //  }

  //  if(!childFlag) {
  //    //ACT0019 2011.04.08 start
  //    //if(els[i].tabIndex >= 0) {
  //    //tabIndexが-1でない場合はtab移動が有効なので
  //    //tabIndexを-1にする
  //    if(els[i].tabIndex != -1) {
  //    //ACT0019 2011.04.08 end
  //      els[i]._tabIndex = els[i].tabIndex;
  //      els[i].tabIndex = -1;
  //    }
  //  }
  //}
  
  ////ACT0019 2011.04.08 start
  ////iframeの中のタグの抑止。iframeの中にiframeがあるケースはないものとする
  //var iframes = $$('iframe');
  //var TAGS = ['a', 'area', 'button', 'input', 'object', 'select', 'textarea'];
  //var childEls = [];
  ////すべてのiframeを処理する
  //for(var i = 0, il = iframes.length; i < il; i++) {
  //  //すべてのフォーカスの当たるタグを対象
  //  for(var j = 0, jl = TAGS.length; j < jl; j++) {
  //    //ブラウザによってiframe内のアクセス禁止されることがあるので
  //    //その場合は除外
  //    try {
  //      childEls = iframes[i].contentWindow.document.getElementsByTagName(TAGS[j]);
  //      //すべてのタグのtabIndexを設定する
  //      for(var k = 0, kl = childEls.length; k < kl; k++) {
  //        //tabIndexが-1でない場合はtab移動が有効なので
  //        //tabIndexを-1にする
  //        if(childEls[k].tabIndex != -1) {
  //          childEls[k]._tabIndex = childEls[k].tabIndex;
  //          childEls[k].tabIndex = -1;
  //        }
  //      }
  //    } catch(e) {
  //    }
  //  }
  //}
  ////ACT0019 2011.04.08 end
  //ACT0032 2011.06.15 end
};

Facebox.prototype.close = function(isSystemEnd) {
  //ACT0068 2011.09.14 start
  // システムエラー表示の場合
  if(this.isSystemError) {
    // 何もしない
    
  //ACT0068 2011.09.14 end
  //ACT0038 2011.07.05 start
  //システム終了の場合
  } else if(isSystemEnd) {
    var body = $$('body')[0];
    body.focus();
    this.topElement = body;
    Element.$hide($('facebox'));
    
  //通常の場合
  } else {
    //ACT0032 2011.06.15 start
    //// フォーカス遷移制御 tabIndex復帰
    ////ACT0019 2011.04.08 start
    //var els = $$('a', 'area', 'button', 'input', 'object', 'select', 'textarea', 'iframe');
    ////ACT0019 2011.04.08 end
    //for(var i = 0, il = els.length; i < il; i++) {
    //  if(!Util.$isUndefined(els[i]._tabIndex)) {
    //    els[i].tabIndex = els[i]._tabIndex;
    //  }
    //}

    ////ACT0019 2011.04.08 start
    ////iframe内のtabIndexの復帰
    //var iframes = $$('iframe');
    //var TAGS = ['a', 'area', 'button', 'input', 'object', 'select', 'textarea'];
    //var childEls = [];
    ////すべてのiframeに対して処理
    //for(var i = 0, il = iframes.length; i < il; i++) {
    //  //すべてのフォーカスの当たるタグに対して処理
    //  for(var j = 0, jl = TAGS.length; j < jl; j++) {
    //    //すべてのタグに対して処理
    //    for(var k = 0, kl = childEls.length; k < kl; k++) {
    //      //退避したtabIndexを元に戻す
    //      if(!Util.$isUndefined(childEls[k]._tabIndex)) {
    //        childEls[k].tabIndex = childEls[k]._tabIndex;
    //      }
    //    }
    //  }
    //}
    ////ACT0019 2011.04.08 end

    // キーイベント削除
    // ※イベント登録していない場合、stopObserving内部でスキップされる。
    Event.$stopObserving(document, 'keydown', this.keyDownListener);

    // bodyタグのtabIndexを復帰してフォーカスイベント削除
    var body = $$('body')[0];
    body.tabIndex = body._tabIndex;
    Event.$stopObserving(body, 'focus', this.focusListener);
    //ACT0032 2011.06.15 end

    //ACT0062 2011.09.05 start
    Event.$stopObserving(this.lastElement, 'focus', this.focusListener);
    if(this.lastElement.parentNode === body) {
      body.removeChild(this.lastElement);
    }
    //ACT0062 2011.09.05 end

    Element.$removeClassName(this.facebox_overlay, 'facebox_overlayBG');
    Element.$hide(this.facebox);
    Element.$hide(this.facebox_overlay);
    // IE6暫定措置
    if(Browser.IE && Browser.PRODUCT_VERSION <= 6.0) {
      Element.$hide(this.facebox_overlay2);
    }
    // ACT0054 2011.08.31 start
    if(this.scrollPosition) {
      Element.$removeClassName(this.rootElement, 'facebox_noscrollbar');
      if(Browser.GECKO) {
        document.documentElement.scrollTop = this.scrollPosition.y;
      }
      this.scrollPosition = null;
    }
    // ACT0054 2011.08.31 end
  }
  //ACT0038 2011.07.05 end
};

//ACT0023 2011.04.21 start
/**
 * Facebox用イメージ設定
 * @param {object(連想配列)} images イメージファイルパス<br />
 * （facebox.cssからの相対パスで記述）<br />
 * { caption_image: タイトル部分の背景画像<br />
 *   loading_image: 読込み中画像<br />
 *   close_image  : 閉じるボタン画像 }
 */
Facebox.prototype.setImage = function(images) {
  var caption_image = '';
  //ACT0069 2011.09.14 start
  //var loading_image = '';
  //ACT0069 2011.09.14 end
  var close_image = '';
  //ACT0069 2011.09.14 start
  //var loadingEls = null;
  //ACT0069 2011.09.14 end
  //引数ありの場合
  if(images) {
    //タイトル部分の背景画像更新
    if(images.caption_image) {
      caption_image = this.settings.base_path + images.caption_image;
      Util.$preload(caption_image);
      //ACT0067 2011.09.13 start
      this.settings.caption_image = caption_image;
      //ACT0067 2011.09.13 end
      Element.$setStyle($$('#facebox .tname')[0],
          {"backgroundImage":"url('" + caption_image + "')"});
      Element.$setStyle($$('#facebox .title')[0],
          {"backgroundImage":"url('" + caption_image + "')"});
    }
    //ACT0069 2011.09.14 start
    ////読込み中画像更新
    //if(images.loading_image) {
    //  loading_image = this.settings.base_path + images.loading_image;
    //  Util.$preload(loading_image);
    //  this.settings.loading_image = loading_image;
    //  loadingEls = $$('#facebox .loading img');
    //  //ちょうど読込み中だった場合は画像を差し替える
    //  if(loadingEls.length > 0) {
    //    loadingEls[0].src = loading_image;
    //  }
    //}
    //ACT0069 2011.09.14 end
    //閉じるボタン画像更新
    if(images.close_image) {
      close_image = this.settings.base_path + images.close_image;
      Util.$preload(close_image);
      //ACT0067 2011.09.13 start
      this.settings.close_image = close_image;
      //ACT0067 2011.09.13 end
      $$('#facebox_close img')[0].src = close_image;
    }
  }
};
//ACT0023 2011.04.21 end

//ACT0042 2011.08.01 start
/*
 * Exception
 */
var Exception = function(messages, err) {
  this.name = 'Exception';
  this.messages = messages;
  this.message = this.getMessage();
  if(err) {
    this.error = err;
  } else {
    this.error = new Error(this.message);
  }
};
//ACT0042 2011.08.01 end
/**************************************************************
//[TODO]Exceptionをアプリ層で拡張していくような場合、
//      下記対応で差し替える。
//      また、inherit共通化を行なう。
var Exception = function(messages) {
  // メッセージ群(連想配列)退避
  this.messages = messages;
  // デフォルトメッセージ取得
  var message = this.getMessage();

  // Errorインスタンスとしての初期化
  Error.call(this, message);

  // プロパティセット
  this.name = 'Exception';
  this.messages = messages;
  this.message  = message;
};
(function (){
  // 継承処理
  function inherit(extsrc, baseClass) {
    // ダミーコンストラクタ作成
    var DummyClass = function() {};
    // DummyClassに対し、baseClass.prototypeをプロトタイプとして参照する。
    DummyClass.prototype = baseClass.prototype;

    // DummyClassインスタンスをプロトタイプとして、チェーンに追加する。
    extsrc.prototype = new DummyClass();
    extsrc.prototype.constructor = extsrc;
  }

  // ExceptionをError継承する。
  inherit(Exception, Error);
})();
**************************************************************/

Exception.prototype.toString = function() {
  return this.name + ': ' + this.getMessage();
};
Exception.prototype.getMessage = function(lang) {
  // 設定されたメッセージ群が連想配列で無い場合
  if(!Util.$isHash(this.messages)) {
    // メッセージ群をそのまま返す
    return this.messages;
  }

  // 引数に言語指定がない場合
  if(Util.$isUndefined(lang)) {
    // ブラウザの言語指定をデフォルトで指定
    lang = Browser.LANG;
  }

  // 指定言語がメッセージ群に存在しない場合
  if(!(lang in this.messages)) {
    // 英語を指定
    lang = 'en';
  }

  // メッセージ群から指定言語のメッセージを返す
  return this.messages[lang];
};
//ACT0042 2011.08.01 start
Exception.prototype.getErrorDescription = function() {
  return Util.$getErrorDescription(this.error);
};
//ACT0042 2011.08.01 end

//ACT0013 2011.03.23 start
/*
 * Array
 */
//Web版フレームワークとバッティングするため廃止
/*
(function() {
  if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(o) {
      for(var i in this) {
        if(this[i] === o) {
          return i;
        }
      }
      return -1;
    };
    Array.prototype.indexOf.DontEnum = true;
  }
})();
*/
//ACT0013 2011.03.23 end

/*
 * CSSセレクタ機能
 */
Util.Selector = (function() {

  function __checkClassEnabled() {
    // dummy element
    var div = new Element("div");

    div.innerHTML = "<div class='test e'></div><div class='test'></div>";

    // getElementsByClassNameでclass=eが「１つ」取得できない場合は脱落
    if(!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
      return false;
    }

    div.lastChild.className = "e";

    // getElementsByClassNameでclass=eが「２つ」取得できない場合は脱落
    if(div.getElementsByClassName("e").length === 1) {
      return false;
    }

    // release memory in IE
    div = null;

    return true;
  }

  function __checkTagNameBug() {
    // dummy element
    var div = new Element('div');

    // コメントを追加する
    div.appendChild(document.createComment(''));

    // コメントはタグではないので、本来「０」が返る
    return div.getElementsByTagName("*").length > 0;
  }

  function __checkHrefAttr() {
    // dummy element
    var div = new Element("div");

    div.innerHTML = "<a href='#'></a>";

    // 
    var ret = div.firstChild &&
              typeof div.firstChild.getAttribute !== "undefined" &&
              div.firstChild.getAttribute("href") !== "#";

    // release memory in IE
    div = null;

    return ret;
  }


  //===================================================================================
  // __find_XXXX 関数群 : 指定のコンテキストから該当するElement(DOM要素)を取得する
  //   match      : 検索条件(配列状態)
  //   context    : Element(DOM要素)検索対象コンテキスト
  //===================================================================================

  function __find_ID(match, context) {
    if(typeof context.getElementById !== "undefined") {
      var m = context.getElementById(match[1]);
      return m && m.parentNode ? [m] : [];
    }
  }

  function __find_CLASS(match, context) {
    if(context.nodeType == 1) {
      context = $(context);
    }
    if(typeof context.getElementsByClassName !== "undefined") {
      return context.getElementsByClassName(match[1]);
    }
  }

  function __find_NAME(match, context) {
    if(typeof context.getElementsByName !== "undefined") {
      var ret = [];
      var results = context.getElementsByName(match[1]);

      for(var i = 0, l = results.length; i < l; i++) {
        if(results[i].getAttribute("name") === match[1]) {
          ret.push(results[i]);
        }
      }
      return ret.length === 0 ? null : ret;
    }
  }

  function __find_TAG(match, context) {
    if(typeof context.getElementsByTagName !== "undefined") {
      return context.getElementsByTagName(match[1]);
    }
  }

  function __find_TAG2(match, context) {
    var results = context.getElementsByTagName(match[1]);

    if(match[1] === "*") {
      var tmp = [];
      for(var i = 0; results[i]; i++) {
        if(results[i].nodeType === 1) {
          tmp.push(results[i]);
        }
      }
      results = tmp; 
    }

    return results;
  }

  var __makeArray = function(array, results) {
    array = Array.prototype.slice.call(array, 0);

    if(results) {
      results.push.apply(results, array);
      return results;
    }
	
    return array;
  };
  try {
    Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;
  }
  catch(e) {
    __makeArray = function(array, results) {
      var ret = results || [];
      var i = 0;

      if(Util.$isArray(array)) {
        Array.prototype.push.apply(ret, array);
      } else {
        if(typeof array.length === "number") {
          for(var l = array.length; i < l; i++) {
            ret.push(array[i]);
          }
        } else {
          for(; array[i]; i++) {
            ret.push(array[i]);
          }
        }
      }

      return ret;
    };
  }

  function __notSupported() {
    var msg = $A(arguments).join(' ');
    throw 'Un-supported syntax: ' + msg;
  }


  //===================================================================================
  // __preFilter_XXXX 関数群 : フィルター前処理（プレフィルター）
  //   返値
  //     true     : continueされて(＝フィルター本体はスルー)、次のフィルターに進む
  //     false    : 後続のフィルター処理本体がスルーされる
  //     上記以外 : フィルター本体処理の第2引数に使用される
  //===================================================================================

  // CLASS用 プレフィルター
  // 必ず false を返す
  //   inplace : __relative_CHILD内部からの呼び出し時のみ、true
  function __preFilter_CLASS(match, curLoop, inplace, result) {
    // match 
    // CLASS: [0]: div.foobar2, [1]: foobar2

    // classNameを抽出
    match = match[1].replace(/\\/g, "");

    for(var i = 0, elem; (elem = curLoop[i]) != null; i++) {
      // 
      if(!elem) {
        continue;
      }

      // 
      if(Element.$hasClassName(elem, match)) {
        if(!inplace) {
          result.push(elem);
        }
      }
      else if(inplace) {
        curLoop[i] = false;
      }
    }

    return false;
  }

  // ID用 プレフィルター
  function __preFilter_ID(match) {
    return match[1].replace(/\\/g, "");
  }

  // TAG用 プレフィルター
  function __preFilter_TAG(match, curLoop) {
    return match[1].replace(/\\/g, "").toLowerCase();
  }

  // ATTR用 プレフィルター
  // match 例: [rel^="facebox"],rel,^=,",facebox,
  function __preFilter_ATTR(match, curLoop, inplace, result) {
    //
    var name = match[1] = match[1].replace(/\\/g, "");

    // 
    var attrMap = {
      "class" : "className",
      "for"   : "htmlFor"
    };

    // 
    if(attrMap[name]) {
      match[1] = attrMap[name];
    }

    // 非クォート文字列対応
    match[4] = (match[4] || match[5] || "").replace(/\\/g, "");

    // "~=" は、ホワイトスペースで区切られた属性値に指定したものがあるもの、の意
    // class属性に複数の値が指定されているようなケースに相当
    if(match[2] === "~=") {
      match[4] = " " + match[4] + " ";
    }

    return match;
  }

  // CHILD用 プレフィルター
  function __preFilter_CHILD(match) {
    if(match[1] === "nth") {
      __notSupported("preFilter: CHILD: nth");
    }
    else if(match[2]) {
      __notSupported("preFilter: CHILD: " + match[0]);
    }

    match[0] = done++;

    return match;
  }

  //===================================================================================
  // __filter_XXXX 関数群 : フィルター処理本体
  //===================================================================================

  // ID用 フィルター 
  // elem  : 候補 Elementのうちの一つ
  // match : preFilter後の残要素 
  function __filter_ID(elem, match) {
    return elem.nodeType === 1 && elem.getAttribute("id") === match;
  }

  // CLASS用 フィルター 
  // elem  : 候補 Elementのうちの一つ
  // match : preFilter後の残要素 
  function __filter_CLASS(elem, match) {
    return Element.$hasClassName(elem, match);
  }

  // TAG用 フィルター 
  // elem  : 候補 Elementのうちの一つ
  // match : preFilter後の残要素 
  function __filter_TAG(elem, match) {
    // 要素が "*" なら、ElementであればOK
    var a = (match === "*" && elem.nodeType === 1);

    // Elementのノード名と条件（タグ名）が同じであればOK
    var b = (elem.nodeName.toLowerCase() === match);

    return  a || b;
  }

  // ATTR用 フィルター 
  // elem  : 候補 Elementのうちの一つ
  // match : preFilter後の残要素 (例: [rel^="facebox"],rel,^=,",facebox,)
  function __filter_ATTR(elem, match) {
    // 左辺値 (=属性名)
    var name = match[1];     

    // DOM取得した属性値 (ハンドラ済み)
    var result;
    if(Expr.attrHandle[name]) {
      result = Expr.attrHandle[name](elem);
    }
    else if(elem[name] != null) {
      result = elem[name];
    }
    else {
      result = elem.getAttribute(name);
    }

    // DOM取得した属性値(文字列化)
    var value = result + "";

    var type  = match[2];    // 演算子( =,!=,*=,~=,^=,$=,|= )
    var check = match[4];    // 右辺値

    return result == null  ?
            type === "!=" :
            type === "="  ?
             value === check :
             type === "*="   ?
              value.indexOf(check) >= 0 :
              type === "~="             ?
               (" " + value + " ").indexOf(check) >= 0 :
               !check ?
                value && result !== false :
                type === "!=" ?
                 value !== check :
                 type === "^=" ?
                  value.indexOf(check) === 0 :
                  type === "$=" ?
                   value.substr(value.length - check.length) === check :
                   type === "|=" ?
                    value === check || value.substr(0, check.length + 1) === check + "-" :
                    false;
  }

  // CHILD用 フィルター 
  function __filter_CHILD(elem, match) {
    var type = match[1];
    var node = elem;

    switch(type) {
      case "first":
        // 兄弟を兄側方向へトラバース
        while((node = node.previousSibling)) {
          // 自分以外に Element であれば　first-child ではない
          if(node.nodeType === 1) {
            return false;
          }
        }

        // 自分が親にとって最初の子が確定
        return true;
    }

    // サポートしていない表現
    __notSupported("filter: CHILD: " + type);
  }

  // 接続子 "" (default)
  //  checkSet : 候補集合（配列）
  //  part     : 現在の検索文字
  function __relative_DEFAULT(checkSet, part) {
    var nodeCheck;
    var doneName = done++;
    var checkFn  = __dirCheck;

    if(Util.$isString(part) && !/\W/.test(part)) {
      part = part.toLowerCase();
      nodeCheck = part;
      checkFn = __dirNodeCheck;
    }

    checkFn("parentNode", part, doneName, checkSet, nodeCheck);
  }

  // 接続子 ">" (child selector)
  //  checkSet : 
  //  part     : 現在の検索文字、または、検索対象コンテキスト(終端の場合)
  function __relative_CHILD(checkSet, part) {
    var elem;
    var isPartStr = Util.$isString(part);
    var i = 0;
    var l = checkSet.length;
    
    if(isPartStr && !/\W/.test(part)) {
      part = part.toLowerCase();

      for( ; i < l; i++) {
        elem = checkSet[i];
        if(!elem) {
          continue;  // 既に false は無視
        } 
        var parent = elem.parentNode;  // 直系の親
        checkSet[i] = ((parent.nodeName.toLowerCase() === part) ? parent : false);
      }
    } else {
      for( ; i < l; i++) {
        elem = checkSet[i];
        if(!elem) {
          continue; // 既に false は無視
        }
        checkSet[i] = isPartStr ?
                      elem.parentNode :
                      elem.parentNode === part;
      }
      if(isPartStr) {
        __filterCandidates(part, checkSet, true);
      }
    }
  }

  // 
  // (default接続子から実行される)
  //  dir       : プロパティ文字列／検索方向 ("parentNode"など)
  //  cur       : partsの現在のpart位置。小文字変換済み
  //  doneName  : doneカウンタ（キャッシュID）
  //  checkSet  : Element候補の集合（配列）
  //  nodeCheck : unll または curの小文字 (使用していない)
  //
  function __dirCheck(dir, cur, doneName, checkSet, nodeCheck) {
    for(var i = 0, l = checkSet.length; i < l; i++) {
      if(!checkSet[i]) {
        continue;
      }

      var elem  = checkSet[i];
      var match = false;

      elem = elem[dir];

      // 処理高速化のため、Element(elem)に独自プロパティを設定する
      //   elem.cacheid  : 検索ID (=checkSet集合のID)
      //   elem.setindex : checkSet内の添字
      while(elem) {
        // 該当 Element が既に捜索済みの場合、結果をコピー
        if(elem.cacheid === doneName) {
          match = checkSet[elem.setindex]; 
          break;
        }

        if(elem.nodeType == 1) {
          // 検索済みという情報を Element にセット
          elem.cacheid  = doneName;
          elem.setindex = i;

          if(!Util.$isString(cur)) {
            if(elem === cur) {
              match = true;
              break;
            }
          }
          else if(__filterCandidates(cur, [elem]).length > 0) {
            match = elem;
            break;
          }
        }

        // 検索方向へ進む
        elem = elem[dir];
      }

      // 見つからない場合 -> false
      // 見つかった場合   -> 該当 Element
      checkSet[i] = match;
    }
  }

  // 
  // (default接続子から実行される)
  //  dir       : プロパティ文字列／検索方向 ("parentNode"など)
  //  cur       : partsの現在のpart位置。小文字変換済み
  //  doneName  : doneカウンタ（キャッシュID）
  //  checkSet  : Element候補の集合（配列）
  //  nodeCheck : unll または curの小文字 (使用していない)
  //
  function __dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck) {
    for(var i = 0, l = checkSet.length; i < l; i++) {
      if(!checkSet[i]) {
        continue;
      }

      var elem  = checkSet[i];
      var match = false;

      elem = elem[dir];

      // 処理高速化のため、Element(elem)に独自プロパティを設定する
      //   elem.cacheid  : 検索ID (=checkSet集合のID)
      //   elem.setindex : checkSet内の添字
      
      // 検索方向に対して Element を捜索し続ける
      // 「全く見つからない」か「見つかった時点でbreak」
      while(elem) {
        // 該当 Element が既に捜索済みの場合、結果をコピー
        if(elem.cacheid === doneName) {
          match = checkSet[elem.setindex]; 
          break;
        }

        // 検索済みという情報を Element にセット
        if(elem.nodeType === 1) {
          elem.cacheid  = doneName;
          elem.setindex = i;
        }

        // 
        if(elem.nodeName.toLowerCase() === cur) {
          match = elem;
          break;
        }

        // 検索方向へ進む
        elem = elem[dir];
      }

      // 見つからない場合 -> false
      // 見つかった場合   -> 該当 Element
      checkSet[i] = match;
    }
  }

  // キャッシュID(内部利用)
  var done = 0;

  // 与えられたCSSセレクタ文字列を、先頭セレクタを要素分解した配列と、
  // 残りのセレクタ部分とにパースするための正規表現
  var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;

  //  
  var Expr = {
    // タグ捜索 適用優先順序 (左から)
    order: [ "ID", "NAME", "TAG" ],

    // タグ捜索 実装関数
    find: {
      ID    : __find_ID,
      CLASS : __find_CLASS,
      NAME  : __find_NAME,
      TAG   :(__checkTagNameBug() ? __find_TAG2 : __find_TAG)
    },

    // 要素判別用 正規表現
    match: {
      ID    : /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
      CLASS : /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
      NAME  : /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
      ATTR  : /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
      TAG   : /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
      CHILD : /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
      POS   : /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
      PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
    },

    // 
    leftMatch: {
      // 後続処理で match をベースに生成される
    },

    // 候補 Element へのフィルター処理 
    preFilter : {
      ID     : __preFilter_ID,
      CLASS  : __preFilter_CLASS,
      ATTR   : __preFilter_ATTR,
      TAG    : __preFilter_TAG,
      CHILD  : __preFilter_CHILD,
      POS    : __notSupported.curry('pre-filter for POS syntax:'),
      PSEUDO : __notSupported.curry('pre-filter for PSEUDO syntax:')
    },

    // 候補 Element へのフィルター処理 
    filter : {
      ID     : __filter_ID,
      CLASS  : __filter_CLASS,
      ATTR   : __filter_ATTR,
      TAG    : __filter_TAG,
      CHILD  : __filter_CHILD,
      POS    : __notSupported.curry('filter for POS syntax:'),
      PSEUDO : __notSupported.curry('filter for PSEUDO syntax:')
    },

    relative: {
      ""  : __relative_DEFAULT,
      ">" : __relative_CHILD
    },

    attrHandle: {
      href: function(elem) {
        return elem.getAttribute("href");
      },
      type: function(elem) {
        return elem.getAttribute("type");
      }
    }

  };

  //-------------- Expr再構成 ここから ---------------------

  // タグ捜索に CLASS を追加
  if(__checkClassEnabled()) {
    Expr.order.splice(1, 0, "CLASS");
  }

  // 位置パターン(再作成前)
  var origPOS = Expr.match.POS;

  // パターン再作成
  for(var type in Expr.match) {
    // 
    Expr.match[type] = 
      new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));

    // 
    Expr.leftMatch[type] = 
      // replaceの第2引数に与える無名関数
      //   all : 正規表現にマッチした全体
      //   num : 正規表現内のカッコにマッチした部分
      new RegExp(/(^(?:.|\r|\n)*?)/.source + 
                 Expr.match[type].source.replace(/\\(\d+)/g, function(all, num) {
                   return "\\" + (num - 0 + 1);
                 })
      );
  }

  if(__checkHrefAttr()) {
    Expr.attrHandle.href = function(elem) {
      return elem.getAttribute("href", 2);
    };
  }

  //-------------- Expr再構成 ここまで --------------------

  // 重複フラグ
  var hasDuplicate = false;

  function __sortOrder_Native(a, b) {
    if(a === b) {
      hasDuplicate = true;
      return 0;
    }

    if(!a.compareDocumentPosition || !b.compareDocumentPosition) {
      return a.compareDocumentPosition ? -1 : 1;
    }

    // 4 -> Node a precedes Node b.
    return a.compareDocumentPosition(b) & 4 ? -1 : 1;
  }

  function __sortOrder(a, b) {
    var al; 
    var bl;
    var ap  = [];
    var bp  = [];
    var aup = a.parentNode;
    var bup = b.parentNode;
    var cur = aup;

    if(a === b) {
      // 完全同一の場合
      hasDuplicate = true;
      return 0;
    } 
    else if(aup === bup) {
      // 親が同一（互いに兄弟）の場合
      return __siblingCheck(a, b);
    } 
    else if(!aup) {
      return -1;
    } 
    else if(!bup) {
      return 1;
    }

    while(cur) {
      ap.unshift(cur);
      cur = cur.parentNode;
    }

    cur = bup;

    while(cur) {
      bp.unshift(cur);
      cur = cur.parentNode;
    }

    al = ap.length;
    bl = bp.length;

    for(var i = 0; i < al && i < bl; i++) {
      if(ap[i] !== bp[i]) {
        return __siblingCheck(ap[i], bp[i]);
      }
    }

    return i === al ?
      __siblingCheck( a, bp[i], -1 ) :
      __siblingCheck( ap[i], b, 1 );
  }

  function __siblingCheck(a, b, ret) {
    if(a === b) {
      return ret;
    }

    var cur = a.nextSibling;

    while(cur) {
      if(cur === b) {
        return -1;
      }
      cur = cur.nextSibling;
    }

    return 1;
  }

  // 
  var sortOrder = document.documentElement.compareDocumentPosition ?
                  __sortOrder_Native :
                  __sortOrder;

  function __uniqueSort(results) {
    // 重複フラグ リセット
    hasDuplicate = false;

    // ソート処理(重複チェックも同時に)
    results.sort(sortOrder);

    // 重複が1つでも存在する場合
    if(hasDuplicate) {
      // 配列を前方から見て、同じものが並んでいる箇所を詰める
      //  -> 配列の長さが実行中に縮むので注意
      for(var i = 0; i < results.length; i++) {
        if(results[i] === results[i-1]) {
          results.splice(i--, 1);
        }
      }
    }

    return results;
  }

  // CSSセレクタ文字列から最初の項目をパースする
  //
  function __parseFirstSelector(selector) {
    var soFar = selector;
    var m;
    var parts = [];
    var extra;
    
    do {
      // リセット
      chunker.exec("");

      // パターン
      m = chunker.exec(soFar);

      if(m) {
        parts.push(m[1]);
        soFar = m[3];
        if(m[2]) {     // セレクタの区切りに到達した場合
          extra = m[3];
          break;
        }
      }
    } 
    while (m);

    return {
      parts : parts,     // <- 最初の項目を要素分解した状態
      extra : extra      // <- 未パース分
    };
  }

  // CSSセレクタ要素で、第１候補 Element を抽出する
  // findは下記の捜索手段を用いて、Eelementの集合(set)を返す
  // ID -> (CLASS -> ) NAME -> TAG     (Expr.order順)
  // どの手段を用いるかはleftMatchで判断
  // Elementの集合が見つからない場合は、より下位の手段を用いる
  // ファーストヒット時点で処理を抜ける
  //   返値set  : 候補 Element 配列
  //   返値expr : 引数のexprで絞り条件未使用部分が再セットされる
  //
  function __findCandidates(expr, context) {
    var set;

    if(!expr) {
      return [];
    }

    for(var i = 0, l = Expr.order.length; i < l; i++ ) {
      // ID -> CLASS -> NAME -> TAGのいずれか
      var type = Expr.order[i];

      // ID
      // p#s1 -> [0]: p#s1, [1]: p,  [2]: s1 
      //  #s1 -> [0]:  #s1, [1]: '', [2]: s1 
      // CLASS
      // p.s1 -> [0]: p.s1, [1]: p,  [2]: s1 
      //  .s1 -> [0]:  .s1, [1]: '', [2]: s1
      // TAG
      // div  -> [0]: div,  [1]: '', [2]: div
      var match = Expr.leftMatch[type].exec(expr);

      if(!match) {
        continue;
      }

      var left = match[1];     // 配列の2番目を退避
      match.splice(1, 1);      // 配列の2番目を詰める([0][1][2] -> [0][2])

      if(left.substr(left.length - 1) !== "\\") {
        // バックスラッシュの除去
        match[1] = (match[1] || "").replace(/\\/g, "");

        set = Expr.find[type](match, context);

        if(set != null) {
          // 既に絞込みに使用した条件を除去する
          //   ID    : div#repair_body -> div   (=ID部が除去される)
          //   CLASS : p.s1            -> p     (=CLASS部が除去される)
          //   TAG   : div             -> ''    (=TAG部が除去される)
          expr = expr.replace(Expr.match[type], "");
          break;  // ファーストヒット時点で処理を抜ける
                  // 検索順(Expr.order)の絞込み条件が[強い -> 弱い]の順
        }
      }
    }

    // 全検索手段(ID,CLASS,NAME,TAG)で見つからない場合、コンテキスト以下全要素を返す
    if(!set) {
      set = typeof context.getElementsByTagName !== "undefined" 
              ? context.getElementsByTagName("*") 
              : [];
    }

    return { 
      set  : set,     // <- 第１候補 Element(配列)
      expr : expr     // <- 要素内の未使用部分(=後続のfilter処理で利用される)
    };
  }

  // 引数に与えられた第１候補 Element から、条件に合致しないものを除去する
  // 通常、__findCandidates の後続処理として実行される、他、relative処理より実行される
  //   expr    : フィルター未使用部分
  //   set     : Element 候補集合(配列)
  //   inplace : __relative_CHILD内部からの呼び出し時のみ、true
  function __filterCandidates(expr, set, inplace) {
    var old = expr;      // フィルター未使用部分
                         // ループ毎に適用部分が削除＆短縮される
                         // ループ後に短縮されてない場合を検出する変数

    var curLoop = set;   // フィルター前の候補 及び この関数の返値
    var result  = [];    // curLoop入替用 一時配列

    var match;

    var anyFound;

    // フィルター未使用部分あり、且つ、候補集合がまだ０でない場合
    // 
    while(expr && set.length) {
      // フィルター未使用部分ごとに、全フィルターを適用する 
      //
      for(var type in Expr.filter) {
        // CLASS: [0]: div.foobar2, [1]: div, [2]: foobar2 
        // CHILD: [0]: first-child, [1]: '',  [2]: first
        match = Expr.leftMatch[type].exec(expr);

        if(match != null && match[2]) {
          // TYPE別フィルタ関数
          var filter = Expr.filter[type];

          var left = match[1];   // 配列の2番目(要素の左側)を退避(nullの場合あり)
          match.splice(1,1);     // 配列の2番目を詰める([0][1][2] -> [0][2])

          var item;              // curLoop配列内 トラバース用変数
          var found;             // 

          anyFound = false;      // 

          if(left.substr(left.length - 1) === "\\") {
            continue;
          }

          if(curLoop === result) {
            result = [];
          }

          // preFilter存在時、matchをpreFilter実行結果で置き換え
          // preFilter自体は、「絞込み処理」ではない
          if(Expr.preFilter[type]) {
            // TAG   例: div,div 
            // CHILD 例: :first-child,first 
            // ATTR  例: [rel^="facebox"],rel,^=,",facebox,
            match = Expr.preFilter[type](match, curLoop, inplace, result);

            if(!match) {
              // この時点で後続の filter 処理スルー確定
              anyFound = true;
              found    = true;
            }
            else if(match === true) {
              // boolean trueの場合は、スルー
              continue;
            }
          }

          // CLASSの場合、preFilterで必ず false になるので、本体処理には入らない
          if(match) {
            for(var i = 0; (item = curLoop[i]) != null; i++) {
              if(item) {
                // フィルター本体を実行 -> booleanが返る
                found = filter(item, match, i, curLoop);

                var pass = !!found;

                if(inplace && found != null) {
                  if(pass) {
		    anyFound = true;
                  } else {
	            curLoop[i] = false;
		  }
                } 
                else if(pass) {
                  result.push(item);
	          anyFound = true;
	        }
              }
            }
          }

          if(found !== undefined) {
            if(!inplace) {
              // 作業配列で差替え
              curLoop = result;
            }

            // 処理済み要素を削除 -> 残部分で変数上書き
            expr = expr.replace(Expr.match[type], "");

            if(!anyFound) {
              return [];
            }
            break;
          }
        }
      }

      // improper expression
      if(expr === old) {
        if(anyFound == null) {
          throw "Error: unrecognized expression: " + expr;
        } else {
          break;
        }
      }

      old = expr;

    } // end while

    return curLoop;
  }

  //================================================================================
  // CSSセレクタ 処理本体 (pure-JavaScript版)
  // (resultsは再起実行用)
  //================================================================================
  function __engine(selector, context, results) {
    context = context || document;
    results = results || [];        // 検索結果を格納する返値用配列

    // 検索コンテキスト（ショートカット用に退避）
    var origContext = context;

    // 
    if(context.nodeType != 1 && context.nodeType != 9) {
      return [];
    }

    // 
    if(!selector || !Util.$isString(selector)) {
      return results;
    }

    var c;     // __findCandidates結果

    var b;     // boolean結果
    var i;     // ループ変数

    var set;

    var checkSet;
    var prune = true;

    var cur;    //  
    var pop;    // 

    //================================================================================
    // Phase 1: CSSセレクタ文字列から最初の項目をパースする
    //================================================================================
    var r = __parseFirstSelector(selector);

    //================================================================================
    // Phase 2: 要素数が2以上で、最初の要素がID指定で、最後の要素がID指定でない場合のみ
    //          検索対象コンテキストをより絞ることで、後続の処理を高速化する
    //================================================================================
    if(r.parts.length > 1 && context.nodeType === 9 &&
       Expr.match.ID.test(r.parts[0]) && !Expr.match.ID.test(r.parts[r.parts.length-1])) {

      // 最初の要素(ID指定アリ)で、候補 Element を抽出
      c = __findCandidates(r.parts.shift(), context);

      // ID指定の候補は、特定Element配下に候補が限定されるので、コンテキストを下位へ移動
      if(c.expr) {
        //================================================================================
        // Phase 3: 要素内の未使用部分が存在する場合、追加でフィルター処理実施
        //================================================================================
        context = __filterCandidates(c.expr, c.set)[0];
      } else {
        // ID指定なので、候補は１つのハズ
        context = c.set[0];
      }
    }

    if(context) {
      //================================================================================
      // Phase 4: 
      //================================================================================

      // 兄弟(+)や隣接(~)の場合、検索対象コンテキストを補正する（親に移動）
      b =  r.parts.length === 1 && 
          (r.parts[0] === "~" || r.parts[0] === "+") && 
          context.parentNode;

      // 末端の要素で、候補 Element を抽出
      // （以降、要素は後方から pop() で取得していく)
      c = __findCandidates(r.parts.pop(), 
                           b ? context.parentNode : context); 

      if(c.expr) {
        //================================================================================
        // Phase 5: 要素内の未使用部分が存在する場合、追加でフィルター処理実施
        //================================================================================
        set = __filterCandidates(c.expr, c.set);
      } else {
        // 
        set = c.set;
      }

      //================================================================================
      // Phase 6: 
      //================================================================================
      if(r.parts.length > 0) {
        checkSet = __makeArray(set);
      } else {
        prune = false; 
      }

      while(r.parts.length) {
        //================================================================================
        // Phase 7: 
        //================================================================================

        cur = r.parts.pop();  // 要素の後方より取得
        pop = cur;

        if(!Expr.relative[cur]) {
          // relativeに登録されてない要素の場合、デフォルト処理("")を採用
          // （またはの通常タブなど)
          cur = "";
        } else {
          // relativeに登録されている要素の場合、次の要素へ
          pop = r.parts.pop();
        }

        if(pop == null) {
          // (phase2で移動している場合あり)
          // 要素文字列 -> Element で変数の型が異なるので注意
          pop = context;
        }

        // popは、次の要素、または、コンテキストの場合あり
        Expr.relative[cur](checkSet, pop);
      }
    }  else {
      // コンテキストが存在しない場合、空にする
      checkSet = r.parts = [];
    }

    if(!checkSet) {
      checkSet = set;
    }
    if(!checkSet) {
      throw "Syntax error, unrecognized expression: " + ( cur || selector );
    }

    //================================================================================
    // Phase 8: 
    //================================================================================
    if(Util.$isArray(checkSet)) {
      if(!prune) {
        // alert('Phase8-1');
        results.push.apply(results, checkSet);
      }
      else if(context && context.nodeType === 1) {
        // alert('Phase8-2');
        for(i = 0; checkSet[i] != null; i++) {
          if(checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Element.$descendantOf(checkSet[i], context)) ) {
            results.push(set[i]);
          }
        }
      }
      else {
        // alert('Phase8-3');
        for(i = 0; checkSet[i] != null; i++) {
          if(checkSet[i] && checkSet[i].nodeType === 1) {
            results.push( set[i] );
          }
        }
      }
    } else {
      // alert('Phase8-4');
      __makeArray(checkSet, results);
    }

    //===========================================================
    // Phase 9: 複数セレクタによる再帰実行
    //===========================================================
    if(r.extra) {
      engine(r.extra, origContext, results);
      __uniqueSort(results);
    }

    return results;
  }

  //================================================================================
  // CSSセレクタ 処理本体 (ブラウザNative版)
  // Native版は、ブラウザにCSSセレクターAPIが搭載されていて、且つ、
  // 検索対象コンテキストが document の場合のみ。
  // 検索対象コンテキストが Element の場合は、pure-JavaScript版を使用する
  //================================================================================
  function __engine_Native(selector, context, results) {
    context = context || document;

    // コンテキストがdocumentの場合、ブラウザ機能Nativeを利用
    if(context.nodeType === 9) {
      try { 
        return __makeArray(context.querySelectorAll(selector), results);
      }
      catch(e) {
      }
    }

    // document以外は、pure-JavaScriptで処理
    return __engine(selector, context, results);
  }

  // ブラウザのCSSセレクタAPI対応状況でエンジンを変更
  var engine = document.querySelectorAll ? __engine_Native
                                         : __engine;

  function select(selector, scope) {
    // エンジンによるElement抽出
    var elems = engine(selector, scope || document);

    // Element拡張を実行
    for(var i = 0, l = elems.length; i < l; i++) {
      Element.$extend(elems[i]);
    }

    return elems;
  }

  // expose
  return {
    $select : select
  }; 
})();

/*
 * documentより、引数のCSSセレクタ文字列に該当するElementを配列で返す
 */
function $$() {
  // 引数が配列の場合、CSSの複数セレクタ（カンマ連結）に変換
  var exp = $A(arguments).join(', ');

  // コンテキストは document で抽出実施
  return Util.Selector.$select(exp, document);
}

// ACT0090 2013.01.18 start
/**
 * 印刷用イラストスタイル作成処理
 */
Util.$illustForPrint = function() {
  var METHODNAME = "Util.$illustForPrint";
  try {
    var myStyle = {};
    myStyle["0"] = "div#footer{display:table!important;}";
    if(Browser.GECKO == true) {
      // FFの場合
      myStyle["1"] = "div.figure div.cPattern{-moz-transform:scale(0.88,0.88)translate(-41.28px,0px)!important;}";
    } else if(Browser.WEBKIT == true) {
      // GCの場合
      myStyle["1"] = "div.figure,td>div.sstPattern{zoom:88%!important;}";
    }
    return myStyle;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * C幅イラスト左寄せスタイル作成処理（div.endActBox配下以外用）
 */
Util.$cPtnFloatLeft = function() {
  var METHODNAME = "Util.$cPtnFloatLeft";
  try {
    var myStyle = {};
    var cb = $("contentsBody");
    var cPtnElms = Util.Selector.$select("div.cPattern", cb);
    var len = cPtnElms.length;
    var figureElm = null;
    var tableElm = null;
    var sizeMap_cPtn = null;
    var sizeMap_cb = Element.$getPosition(cb);
    var cbLeftMargin = sizeMap_cb.x;
    var cPtnClassName = "";
    
    // C幅イラスト毎にループ
    for(var i = 0; i < len; i++) {
      figureElm = cPtnElms[i].parentNode;
      
      // テーブル内イラストの場合、次のC幅イラストへ
      tableElm = figureElm.parentNode.parentNode.parentNode.parentNode;
      if(tableElm != null 
          && tableElm.tagName.toLowerCase() == "table" 
          && tableElm.id == "") {
        continue;
      }
      
      // div.endActBox配下のC幅イラストの場合、次のC幅イラストへ
      if(figureElm.className.indexOf("cPtnForEndAct") != -1) {
        continue;
      }
      
      sizeMap_cPtn = Element.$getPosition(figureElm);
      
      // インデントが0pxで左寄不要のため、次のイラストへ
      if(sizeMap_cPtn.x - cbLeftMargin == 0) {
        continue;
      }
      
      cPtnClassName = "cPtn" + i;
      
      Element.$addClassName(figureElm, cPtnClassName);
      // 画面の端からC幅イラストまでのインデントを削除
      myStyle[i] = "div." + cPtnClassName + "{margin-left:" + (sizeMap_cPtn.x - cbLeftMargin) * -1 + "px!important;}";
    }
    return myStyle;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

//ACT0095 2013.05.15 start
/**
 * コンテンツ表示エリアで、15%インデントしているC幅イラストを、
 * 印刷画面は、15%左寄せしている。リサイズにも対応。
 * 印刷時（印刷物）は、印刷画面の初期表示時の画面サイズの15%を左寄せしている。
 * 
 * IE10メトロ版の場合、画面が常に全画面表示のため、
 * 印刷時（印刷物）に初期表示時の画面サイズの15%を左寄せしてしまうと、
 * C幅イラストの左端が印刷物から切れてしまう。
 * そのためIE10メトロ版の場合、初期表示時の画面サイズを固定値として定数化しておく。
 * ※IE10メトロ版のみとするのは、マルチブラウザの影響を最小限にするため。
 */
var PRINT_WINDOW_SIZE_WIDTH_FOR_METRO = 600;
//ACT0095 2013.05.15 end
var cPtnForEndActIndentSizeMap = {};

/**
 * C幅イラスト左寄せスタイル作成処理（div.endActBox配下用）
 * @param {boolean} isResize true:リサイズ用スタイル / false:印刷用スタイル
 */
Util.$cPtnFloatLeftForEndActBox = function(isResize) {
  var METHODNAME = "Util.$cPtnFloatLeftForEndActBox";
  try {
    var myStyle = {};
    var cb = $("contentsBody");
    var targets = $$("div.endActBox div.content6");
    var targetsLen = targets.length;
    var cPtnElms = null;
    var len = 0;
    var figureElm = null;
    var tableElm = null;
    var dim = Element.$getDimensions(cb);
    // 画面の幅の15%をpx単位に換算
    var leftW = dim.width / 100 * 15;
    //ACT0095 2013.05.15 start
    // メトロ版の印刷用スタイルを設定する場合
    if(Browser.METRO == true && isResize == false) {
      leftW = PRINT_WINDOW_SIZE_WIDTH_FOR_METRO / 100 * 15;
    }
    //ACT0095 2013.05.15 end
    var sizeMap_con6 = null;
    var con6LeftMargin = null;
    var cPtnForEndActIndentSize = 0;
    var cPtnClassName = "";
    
    // div.endActBox毎にループ
    for(var i = 0; i < targetsLen; i++) {
      cPtnElms = Util.Selector.$select("div.cPattern", targets[i]);
      len = cPtnElms.length;
      sizeMap_con6 = Element.$getPosition(targets[i]);
      con6LeftMargin = sizeMap_con6.x;
      
      // C幅イラスト毎にループ
      for(var j = 0; j < len; j++) {
        figureElm = cPtnElms[j].parentNode;
        
        // テーブル内イラストの場合、次のC幅イラストへ
        tableElm = figureElm.parentNode.parentNode.parentNode.parentNode;
        if(tableElm != null 
            && tableElm.tagName.toLowerCase() == "table" 
            && tableElm.id == "") {
          continue;
        }
        
        cPtnClassName = "cPtnForEndAct" + i + "_" + j;
        
        if(isResize == true) {
          // リサイズ用スタイルを要素に追加
          Element.$setStyle(figureElm, "margin-left: " 
              + (leftW + cPtnForEndActIndentSizeMap[cPtnClassName]) * -1 + "px;");
        } else {
          sizeMap_cPtn = Element.$getPosition(figureElm);
          // div.content6からC幅イラストまでのインデントサイズ
          cPtnForEndActIndentSize = sizeMap_cPtn.x - con6LeftMargin;
          cPtnForEndActIndentSizeMap[cPtnClassName] = cPtnForEndActIndentSize;
          leftW = leftW + cPtnForEndActIndentSize;
          
          Element.$addClassName(figureElm, cPtnClassName);
          // 印刷用スタイルを戻り値に追加
          myStyle[i + "_" + j] = "div." + cPtnClassName + "{margin-left:" + leftW * -1 + "px!important;}";
        }
      }
    }
    return myStyle;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * テーブル配下のC幅イラストの縮小スタイル作成処理（FF用）
 */
Util.$cPtnTableForFF = function() {
  var METHODNAME = "Util.$cPtnTableForFF";
  try {
    var myStyle = {};
    var cb = $("contentsBody");
    var sPtnElms = Util.Selector.$select("div.sstPattern", cb);
    var len = sPtnElms.length;
    var sPtnElm = null;
    var dim = null;
    var cPtnClassName = "";
    
    // SSTイラスト毎にループ
    for(var i = 0; i < len; i++) {
      sPtnElm = sPtnElms[i];
      dim = Element.$getDimensions(sPtnElm);
      // C幅ではない場合
      if(dim.width < 688) {
        continue;
      }
      cPtnClassName = "cPtnT" + i;
      
      Element.$addClassName(sPtnElm, cPtnClassName);
      // テーブル配下のC幅イラストの縮小
      myStyle[i] = "div." + cPtnClassName + "{-moz-transform:scale(0.88,0.88)translate(-41.28px,0px)!important;}";
    }
    return myStyle;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * STYLE要素作成処理
 */
Util.$insertElementStyle = function(myStyle, isPrint) {
  var METHODNAME = "Util.$insertElementStyle";
  try {
    // STYLE要素作成
    var elmStyle = document.createElement("style");
    var wrap = null;
    var strStyle = "";
    Element.$writeAttribute(elmStyle, "type", "text/css");
    var printIE6 = "";
    // 印刷用スタイルの場合
    if(isPrint == true) {
      Element.$writeAttribute(elmStyle, "media", "print");
      printIE6 = " media='print'";
    }
    // スタイル設定
    if(Browser.IE == true && Browser.PRODUCT_VERSION == 6.0) {
      // IE6
      for(var key in myStyle) {
        strStyle += myStyle[key];
      }
      wrap = document.createElement("div");
      wrap.innerHTML = "a<style type='text\/css'" + printIE6 + ">" + strStyle + "<\/style>";
      // 印刷用STYLE要素追加
      Element.$insert($$("head")[0], wrap.lastChild);
    } else if(Browser.IE == true && Browser.PRODUCT_VERSION > 6.0) {
      // IE8, IE9
      for(var key in myStyle) {
        elmStyle.styleSheet.cssText += myStyle[key];
      }
      // 印刷用STYLE要素追加
      Element.$insert($$("head")[0], elmStyle);
    } else {
      // IE以外
      for(var key in myStyle) {
        elmStyle.innerHTML += myStyle[key];
      }
      // 印刷用STYLE要素追加
      Element.$insert($$("head")[0], elmStyle);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};
// ACT0090 2013.01.18 end
