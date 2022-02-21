/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2015/04/02 */

/**
 * file use.js<br />
 *
 * @fileoverview 利用共通。<br />
 * file-> use.js
 * @author 清水
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/02/10|1.0.0|清水|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/02/10 清水 ・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 利用共通
 * @namespace 利用共通クラス
 */ 
var Use = {};

//定数定義
/**
 * システムタイプ(1) "1":CD版ローカル、ネットワークアクセス(file://, D:\xx など)
 *                   "2":Web版Webサーバアクセス(http://xxx)
 *                   "3":CD版Webサーバアクセス(http://xxx)
 * @type string
 */
Use.SYSTEM_TYPE = "1";
/**
 * マニュアルフォルダ名
 * @type string
 */
Use.MANUAL_FOLDER_NAME = 'manual';

/**
 * 初期化
 * @param {Facebox} fbox Faceboxインスタンス
 */
Use.$init = function(fbox) {
  var METHODNAME = 'Use.$init';
  try {
    var isLocal = true;
    //reset無効化
    var fs = document.forms;
    var len = (fs) ? fs.length : 0;
    var _funcReset = function(){ return false; };
    //全部のformのresetを無効化
    for(var i = 0; i < len; i++) {
      fs[i].onreset = _funcReset;
    }
    
    //WEBの場合はfalseを設定
    if(Use.SYSTEM_TYPE != "1") {
      isLocal = false;
    }
    
    Use.SystemError.$init(Use.$initFacebox(fbox));
    Util.$init(isLocal, Use.$callbackSystemError);
    Use.$stopShortCut();
    Use.Util.$init();
    Dict.$init();
    var bodies = $$('.otherManualBody, .welcabManualBody, .referenceManualBody');
    var p = (window != window.parent) ? window.parent : null;
    //iframe内のindex.htmlの場合、スクロールの設定をする
    if(typeof Contents != 'undefined' && bodies.length > 0 && p) {
      Util.$setOtherContentsSize(bodies);
      Util.$setIframeScroll(1, 'auto');
    }
    Use.Util.$observe(window, "load", function() {
      Util.$startResizeAgent();
    });

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 初期化例外発生時のコールバック処理（システムエラー）
 * @param {object} err エラーオブジェクト
 */
Use.$callbackSystemError = function(err) {
  var METHODNAME = 'Use.$callbackSystemError';
  try {
    
    Use.SystemError.$show(err, METHODNAME, '', true);
    
  } catch(error) {
    Use.SystemError.$show(error, METHODNAME, '', true);
  }
};

/**
 * Facebox初期化
 * @private
 * @param {Facebox} fbox Faceboxインスタンス<br />
 * ない場合は新規にnewする
 * @return Faceboxインスタンス
 */
Use.$initFacebox = function(fbox) {
  var METHODNAME = 'Use.$initFacebox';
  try {

    //Faceboxインスタンスがない場合は新規にnewする
    if(!fbox) {
      fbox = new Facebox();
    }

    //画像の初期化
    fbox.setImage({
      caption_image: DictConst.C_FACEBOX_CAPTION_IMAGE_PATH,
      loading_image: DictConst.C_FACEBOX_LOADING_IMAGE_PATH,
      close_image  : DictConst.C_FACEBOX_CLOSE_IMAGE_PATH
    });

    return fbox;

  } catch(error) {
    Use.SystemError.$show(error, METHODNAME, '', true);
  }
};

/**
 * ショートカット機能抑止
 * @private
 */
Use.$stopShortCut = function() {
  var METHODNAME = 'Use.$stopShortCut';
  try {

    //コンテキストメニュー抑止
    //Util.$stopMouseContextMenu();

    //ショートカット機能抑止
    Util.$stopShortCut({
      openNewWindowByLink   : true,
      openNextTabByLink     : true,
      openPrevTabByLink     : true,
      cloneTab              : true,
      restorePrevTab        : true,
      restorePrevWindow     : true,
      updatePage            : true,
      updatePageForce       : true,
      cancelDownload        : false,
      nextPage              : true,
      prevPage              : true,
      contextMenu           : true,
      showFavorites         : true,
      addPageToFavorite     : true,
      addAllTabsToFavorite  : true,
      showSource            : true
    });

  } catch(error) {
    Use.SystemError.$show(error, METHODNAME, '', true);
  }
};

//-----------------------------------------------------------------------------
/**
 * 利用共通ユーティリティ
 * @namespace 利用共通ユーティリティクラス
 */
Use.Util = {};

//定数／メンバ変数定義
/**
 * システムエラーのメッセージID
 * @type string
 */
Use.Util.SYSTEM_ERROR_ID = 'MVWF0123DAE';
/**
 * 入力チェックエラーclass名
 * @type string
 */
Use.Util.CLASS_INPUT_ERROR = 'input_error';
/**
 * 月の名称（英語）
 * @type Array(string)
 */
Use.Util.MONTH_NAME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/**
 * 初期化日付（ミリ秒）
 * @type number
 */
Use.Util.INIT_DATE = 0;
/**
 * 画面表示言語
 * @type string
 */
Use.Util.VIEW_LANG = 'en';
/**
 * マニュアルパスキーワード（Web版は車両型式）
 * @type string
 */
Use.Util.MANUAL_PATH_KEYWORD = '{manual_path}';
/**
 * 適用時期キーワード
 * @type string
 */
Use.Util.TEKI_DATE_KEYWORD = '{teki_date}';

/**
 * ユーティリティ初期化（非公開）
 * @private
 */
Use.Util.$init = function() {
  var METHODNAME = 'Use.Util.$init';
  try {

    //初期化日時設定
    var d = new Date();
    Use.Util.INIT_DATE = d.getTime();
    d = null;

    //画面表示言語設定
    var lang = window.document.documentElement.lang;
    if(lang) {
      Use.Util.VIEW_LANG = lang;
    //画面表示言語が取得できない場合は'en'（英語）を設定
    } else {
      Use.Util.VIEW_LANG = 'en';
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * Ajaxのリクエスト処理
 * @param {string} url パス
 * @param {string} async 同期・非同期
 * @param {function} success onSuccess時の処理
 * @param {function} failure onFailure時の処理
 * @param {boolean} isCheckExist 存在チェックフラグ<br />
 * true:チェックする false:チェックしない（デフォルト）
 * @param {boolean} isXML XMLフラグ<br />
 * true:XMLデータ取得（デフォルト） false:XMLデータ以外
 */
Use.Util.$request = function(
    url, async, success, failure, isCheckExist, isXML) {
  var METHODNAME = 'Use.Util.$request';
  try {

    var req = null;
    //デフォルトはXML
    if(Util.$isUndefined(isXML)) {
      isXML = true;
    }
    //ファイル存在チェックする場合は引数のfailureをonFailureに設定する
    if(isCheckExist) {
      req = new Request(url, {
        asynchronous: async,
        onSuccess: (function(res) {
          try {
            success(res);
          }
          catch (e) {
            Use.SystemError.$show(e, METHODNAME, '', true);
          }
        }),
        onFailure: (function(res) {
          try {
            failure(res);
          }
          catch (e) {
            Use.SystemError.$show(e, METHODNAME, '', true);
          }
        }),
        onException:  Use.Util.$requestOnException,
        isCheckExist: true,
        isXML:        isXML
      });
      req = null;
    //ファイル存在チェックしない場合はデフォルトのエラー処理（システムエラー）
    } else {
      req = new Request(url, {
        asynchronous: async,
        onSuccess: (function(res) {
          try {
            success(res);
          }
          catch (e) {
            Use.SystemError.$show(e, METHODNAME, '', true);
          }
        }),
        onFailure:    Use.Util.$requestOnFailure,
        onException:  Use.Util.$requestOnException,
        isCheckExist: false,
        isXML:        isXML
      });
      req = null;
    }
  
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * Ajaxのリクエスト処理
 * @param {Form} form フォーム
 * @param {string} async 同期・非同期
 * @param {function} success onSuccess時の処理
 * @param {function} failure onFailure時の処理
 * @param {boolean} isCheckExist 存在チェックフラグ<br />
 * true:チェックする false:チェックしない（デフォルト）
 * @param {boolean} isXML XMLフラグ<br />
 * true:XMLデータ取得（デフォルト） false:XMLデータ以外
 */
Use.Util.$requestForm = function(form, async, success, failure, isCheckExist, isXML) {
  var METHODNAME = 'Use.Util.$requestForm';
  try {

    var req = null;
    //formが空でない場合
    if(form) {
      //デフォルトはXML
      if(arguments.length < 6) {
        isXML = true;
      }
      //ファイル存在チェックする場合は引数のfailureをonFailureに設定する
      if(isCheckExist) {
        req = Form.$request(form, {
          asynchronous: async,
          onSuccess: (function(res) {
            try {
              success(res);
            }
            catch (e) {
              Use.SystemError.$show(e, METHODNAME, '', true);
            }
          }),
          onFailure: (function(res) {
            try {
              failure(res);
            }
            catch (e) {
              Use.SystemError.$show(e, METHODNAME, '', true);
            }
          }),
          onException:  Use.Util.$requestOnException,
          isCheckExist: true,
          isXML:        isXML
        });
        req = null;
      //ファイル存在チェックしない場合はデフォルトのエラー処理（システムエラー）
      } else {
        req = Form.$request(form, {
          asynchronous: async,
          onSuccess: (function(res) {
            try {
              success(res);
            }
            catch (e) {
              Use.SystemError.$show(e, METHODNAME, '', true);
            }
          }),
          onFailure:    Use.Util.$requestOnFailure,
          onException:  Use.Util.$requestOnException,
          isCheckExist: false,
          isXML:        isXML
        });
        req = null;
      }
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * $requestの処理で通信が失敗した時の処理
 * @param {Response} res レスポンスオブジェクト
 */
Use.Util.$requestOnFailure = function(res) {
  var METHODNAME = 'Use.Util.$requestOnFailure';
  try {

    Use.SystemError.$show(null, METHODNAME, '', true);

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME, '', true);
  }
};

/**
 * $requestの処理で例外が発生した時の処理
 * @param {Request} req リクエストオブジェクト
 * @param {Error} err エラーオブジェクト
 */
Use.Util.$requestOnException = function(req, err) {
  var METHODNAME = 'Use.Util.$requestOnException';
  try {

     Use.SystemError.$show(err, METHODNAME, '', true);

  } catch(error) {
    Use.SystemError.$show(error, METHODNAME, '', true);
  }
};

/**
 * 関数を引数に与えた秒数だけ遅延して実行させる。
 * @param {function} func ファンクション
 * @param {number} timeout 自分自身を遅延実行する際の遅延時間(単位：秒）。小数も可。
 * @param {object} argN 関数実行時に arguments に引き渡される配列<br />
 *   arguments[2]:[0], arguments[3]:[1], ... arguments[N]:[N-2]
 * @return {object} 自分自身（＝関数オブジェクト）の実行を取り消すために<br />
 * clearTimeout()関数に渡せる値（＝タイムアウトID)。
 */
Use.Util.$delay = function(func, timeout) {
  var METHODNAME = 'Use.Util.$delay';
  try {

    var slice = Array.prototype.slice;
    var argsFunc = slice.call(arguments, 2);
    var argsDelay = slice.call(arguments, 1);
    var f = function() {
      try {
        func.apply(this, argsFunc);
      }
      catch (e) {
        Use.SystemError.$show(e, METHODNAME, '', true);
      }
    };
    return f.delay.apply(f, argsDelay);

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 関数を10ミリ秒遅延して実行させる。
 * @param {function} func ファンクション
 * @param {object} argN 関数実行時に arguments に引き渡される配列<br />
 *   arguments[1]:[0], arguments[2]:[1], ... arguments[N]:[N-1]
 * @return {object} 自分自身（＝関数オブジェクト）の実行を取り消すために<br />
 * clearTimeout()関数に渡せる値（＝タイムアウトID)。
 */
Use.Util.$defer = function(func) {
  var METHODNAME = 'Use.Util.$defer';
  try {

    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);
    var f = function() {
      try {
        func.apply(this, args);
      }
      catch (e) {
        Use.SystemError.$show(e, METHODNAME, '', true);
      }
    };
    return f.defer.apply(f, args);

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 画面表示言語取得
 * @return {string} 画面表示言語
 */
Use.Util.$getViewLang = function() {
  var METHODNAME = 'Use.Util.$getViewLang';
  try {

    return Use.Util.VIEW_LANG;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 画面表示言語設定
 * @param {string} lang 画面表示言語
 */
Use.Util.$setViewLang = function(lang) {
  var METHODNAME = 'Use.Util.$setViewLang';
  try {

    Use.Util.VIEW_LANG = lang;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * アラート処理
 * @param {string} message メッセージ。
 * @param {element} elements イベントトラップするDOM要素。（配列）
 * @param {Facebox} facebox 閉じたいFacebox
 * @param {boolean} isForce 強制実行フラグ<br />
 * true:強制実行する false:強制実行しない（デフォルト）
 */
Use.Util.$alert = function(message, elements, facebox, isForce) {
  var METHODNAME = 'Use.Util.$alert';
  try {

    var len = 0;

    // 初期化が済んでない場合は初期化後に実行
    if(DomReady.HANDLERS && !isForce) {
      DomReady.$add(function() {
        try {
          Use.Util.$alert(message, elements, facebox, true);
        } catch (e) {
          Use.SystemError.$show(e, METHODNAME, '', true);
        }
      });

    // 初期化が済んでる場合は即時実行
    } else {
      //elementsがある場合はすべてエラー表示にする
      if(elements) {
        len = elements.length;
        //elementsが複数の場合
        if(len) {
          //すべてエラー表示にする
          for(var i = 0; i < len; i++) {
            Element.$addClassName(elements[i], Use.Util.CLASS_INPUT_ERROR);
          }
        //elements単体の場合は1個をエラー表示にする
        } else {
          Element.$addClassName(elements, Use.Util.CLASS_INPUT_ERROR);
        }
      } 
      //アラート表示
      alert(message);
      //faceboxがある場合はフェイスボックスを閉じる
      if(facebox) {
        facebox.close();
      }
      //elementsがある場合はフォーカス制御をする
      if(elements) {
        len = elements.length;
        //elementsが複数の場合は１個目にフォーカス
        if(len) {
          try {
            elements[0].focus();
          } catch(e) {
          }
        //elements単体の場合はelementsにフォーカス
        } else {
          try {
            elements.focus();
          } catch(e) {
          }
        }
      } 
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンファーム処理
 * @param {string} message メッセージ。
 * @param {Facebox} facebox OK時に閉じたいFacebox
 * @return {boolean} true:OK false:キャンセル
 */
Use.Util.$confirm = function(message, facebox) {
  var METHODNAME = 'Use.Util.$confirm';
  try {

    var result = confirm(message);
    //faceboxがある場合はフェイスボックスを閉じる
    if(result && facebox) {
      facebox.close();
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * イベント登録
 * @param {element} element イベントトラップするDOM要素。
 * @param {string} eventName イベント名。接頭の「on～」は不要。（例： 'click'）
 * @param {function} event イベント発生時に実行するイベントハンドラ
 * @param {boolean} useCapture （無視される）
 */
Use.Util.$observe = function(element, eventName, event, useCapture) {
  var METHODNAME = 'Use.Util.$observe';
  try {

    Event.$observe(
        element,
        eventName,
        function(evt) {
          try {
            event.apply(this, [evt]);
          }
          catch (e) {
            Use.SystemError.$show(e, METHODNAME, '', true);
          }
        },
        useCapture);

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * メッセージ取得
 * @param {string} id メッセージID
 * @param {string} argN メッセージの埋込パラメータ<br />
 *   arguments[1]:{0}, arguments[2]:{1}, ... arguments[N]:{N-1}
 * @return {string} 取得メッセージ
 */
Use.Util.$getMessage = function(id) {
  var METHODNAME = 'Use.Util.$getMessage';
  try {

    var args = [];
    var slice = Array.prototype.slice;
    var params = slice.call(arguments, 1);
    args.push(id);
    args = args.concat(params);
    return Use.Util.$getMessageWithLang.apply(null, args);

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * メッセージ取得
 * @param {string} id メッセージID
 * @param {string} argN メッセージの埋込パラメータ<br />
 *   arguments[2]:{0}, arguments[3]:{1}, ... arguments[N]:{N-2}
 * @return {string} 取得メッセージ
 */
Use.Util.$getMessageWithLang = function(id) {
  var METHODNAME = 'Use.Util.$getMessageWithLang';
  try {

    var message = '';
    var len = 0;
    try {
      message = Dict[id];
      //メッセージがない場合は空文字にする
      if(!message) {
        message = '';
      }
      len = arguments.length;
      //埋め込み文字を置換する
      for(var i = 1; i < len; i++) {
        message = message.replace('{' + (i - 1) + '}', arguments[i]);
      }
    } catch(e) {
    }
    return message;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * メッセージ取得
 * @param {string} id メッセージID
 * @param {string} argN メッセージの埋込パラメータ<br />
 *   arguments[1]:{0}, arguments[2]:{1}, ... arguments[N]:{N-1}
 * @return {string} 取得メッセージ
 */
Use.Util.$getMessages = function(id) {
  var METHODNAME = 'Use.Util.$getMessages';
  try {

    var result = {};
    result[Use.Util.$getViewLang()]
           = Use.Util.$getMessage.apply(null, arguments);
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 初期化日付取得
 * @return {number} 初期化日付（ミリ秒）
 */
Use.Util.$getInitDate = function() {
  var METHODNAME = 'Use.Util.$getInitDate';
  try {

    return Use.Util.INIT_DATE;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * フォーマット日付取得
 * @param {Date} date 日付
 * @param {string} lang 言語
 * @return {string} フォーマット日付
 */
Use.Util.$getFormatDate = function(date, lang) {
  var METHODNAME = 'Use.Util.$getFormatDate';
  try {

    var result = '';
    var rightStr = function(str, len) {
      return str.substr(str.length - len, len);
    };
    //langがない場合は画面表示言語を取得
    if(!lang) {
      lang = Use.Util.$getViewLang();
    }
    //日本語の場合は「yyyy/MM/dd」
    if(lang == 'ja') {
      result = date.getFullYear()
                + '/' + rightStr('0' + (date.getMonth() + 1), 2)
                + '/' + rightStr('0' + date.getDate(), 2);
    //日本語以外の場合は「{月名}.MM,yyyy」
    } else {
      result = Use.Util.MONTH_NAME[date.getMonth()]
                + '.' + rightStr('0' + date.getDate(), 2)
                + ',' + date.getFullYear();
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツのパスを取得する
 * @param {string} id パス定義のID（dict_const.js）
 * @param {string} tekiDate 適用時期
 * @param {string} carType 車両型式（Web版）
 * @param {string} lang マニュアル言語（Web版）
 * @param {string} argN パスの埋込パラメータ<br />
 *   arguments[4]:{0}, arguments[5]:{1}, ... arguments[N]:{N-4}
 * @return {string} パス
 */
Use.Util.$getContentsPath = function(id, tekiDate, carType, lang) {
  var METHODNAME = 'Use.Util.$getContentsPath';
  try {

    var result = '';
    var args = Array.prototype.slice.call(arguments, 4);

    //辞書からパス定義を取得
    args.unshift(id);
    result = Use.Util.$getMessage.apply(null, args);

    //CD版の場合は車両型式の部分は固定（manual）
    carType = Use.MANUAL_FOLDER_NAME;
    result = result.replace(Use.Util.MANUAL_PATH_KEYWORD, carType);

    //適用時期がない場合
    if(!tekiDate) {
      //閲覧画面の場合は閲覧画面のグローバルインフォより取得
      try {
        if(typeof Service != 'undefined') {
          tekiDate = Service.$getGlobalInfo().FROM_DATE;
        }
      } catch(e) {
      }
    }

    //適用時期がある場合は適用時期の置換をする
    if(tekiDate) {
      result = result.replace(Use.Util.TEKI_DATE_KEYWORD, tekiDate);
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * Facebox表示
 * @param {Facebox} fbox Faceboxインスタンス
 * @param {string} data フェイスボックス上に表示するコンテンツ(string or Element)
 * @param {string} klass 付帯CSSクラス
 * @param {boolean} ignoreclose trueで、閉じるボタン<br />
 * （ウィンドウ右上の「x」ボタン）を非表示にする。デフォルトfalse
 * @param {string} title Faceboxのタイトル部分の文言を指定。<br />
 * 指定しない場合、"FaceBox"となる
 * @param {boolean} isChangeID ID変更フラグ
 * @param {string} prefix ID変更時に付与するプリフィックス（デフォルト："fbx_"）
 * @param {function} closeHandler クローズ時処理
 * @param {boolean} isSystemError システムエラー画面表示フラグ
 */
Use.Util.$revealFacebox = function(
    fbox, data, klass, ignoreclose, title, isChangeID, prefix, closeHandler, isSystemError) {
  var METHODNAME = 'Use.Util.$revealFacebox';
  try {

    var imageTitle = Use.Util.$getMessage('CONST_FACEBOX_IMAGE_TITLE');
    var handle = null;
    var fs = [];
    var len = 0;
    var _funcReset = function(){ return false; };

    //Faceboxがあるときのみ表示
    if(fbox) {
      //システムエラー画面が表示されてないときだけ表示する
      if(!$('fbx_system_error') || !Element.$visible($('facebox'))) {
        //クローズ処理がある場合は登録する
        if(Util.$isFunction(closeHandler)) {
          handle = function(evt) {
            try {
              closeHandler.apply(this, [evt]);
            } catch(e) {
              Use.SystemError.$show(e, METHODNAME, '', true);
            }
          };
        }
        fbox.reveal(
            data, klass, ignoreclose, title, isChangeID, prefix, 'invisible', imageTitle, handle, isSystemError);

        //reset無効化
        fs = $$('#facebox form');
        len = (fs) ? fs.length : 0;
        //全部のformのresetを無効化
        for(var i = 0; i < len; i++) {
          fs[i].onreset = _funcReset;
        }
      }
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * XPath用エスケープ処理（シングルクォーテーションで囲む）
 * @param {string} text エスケープ元文字列
 * @return {string} エスケープ済文字列
 */
Use.Util.$escapeXPathExpr = function(text) {
  var matches = text.match(/[^']+|'/g);
  var len = 0;
  var results = [];
  //シングルクォーテーションで囲む処理
  var esc = function(t) {
    return t == '\'' ? ('"' + t + '"') : ('\'' + t + '\'');
  };

  //データがある場合
  if(matches) {
    len = matches.length;
    //１件ヒットの場合はシングルクォーテーションで囲んで返す
    if(len == 1) {
      return esc(matches[0]);
    //２件以上ヒットの場合
    } else {
      //個別にシングルクォーテーションで囲んで連結して返す
      for(var i = 0; i < len; i ++) {
        results.push(esc(matches[i]));
      }
      return 'concat(' + results.join(', ') + ')';
    }
  //データがない場合は''を返す
  } else {
    return '\'\'';
  }
};

/**
 * 閲覧ログ登録
 * @param {string} kbBrowsLogType   ログ種別
 * @param {string} idBrowsFunc      機能ＩＤ
 * @param {string} mjUtlPubTypeAbbr パブ種別略称
 * @param {string} noPub            パブＮＯ
 * @param {string} mjPub            パブ名称
 * @param {string} idSec            セクションＩＤ
 * @param {string} mjSec            セクション名称
 * @param {string} idTtl            タイトルＩＤ
 * @param {string} mjTtl            タイトル名称
 * @param {string} kbParaCate       パラグラフ分類区分
 * @param {string} mjParaCate       パラグラフ分類名称
 * @param {string} idPara           パラグラフＩＤ
 * @param {string} mjPara           パラグラフ名称
 */
Use.Util.$entryServiceLog = function(
    kbBrowsLogType, idBrowsFunc, mjUtlPubTypeAbbr, noPub, mjPub, idSec, mjSec,
    idTtl, mjTtl, kbParaCate, mjParaCate, idPara, mjPara) {
  var METHODNAME = 'Use.Util.$entryServiceLog';
  try {

    //何もしない

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * iframe生成処理<br />
 * 親要素(div等)の中にiframeを生成する
 * @param {string} targetID 親要素(div等)のID
 * @param {string} srcPath src属性の設定値
 * @param {string} frameBorder frameborder属性の設定値
 * @param {string} className class属性の設定値
 * @param {string} scrolling スクロール属性の設定値（デフォルト:auto）
 * @param {function} complete iframe表示完了時処理
 * @return {Element} 生成したiframe要素<br />
 * 生成したiframe要素のname、IDは「targetID + '_contents'」になる
 */
Use.Util.$openIframe = function(targetID, srcPath, frameBorder, className, scrolling, complete) {
  var METHODNAME = 'Use.Util.$openIframe';
  try {

    Util.$openIframe(targetID, srcPath, frameBorder, className, scrolling, complete);

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * formのサブミット抑止処理<br />
 * formのonsubmit属性に抑止用の関数を登録する。<br />
 * formのsubmitイベントに登録したハンドラを全解除する。
 * @param {Element} form 対象フォームエレメント
 */
Use.Util.$stopSubmit = function(form) {
  var METHODNAME = 'Use.Util.$stopSubmit';
  try {

    var _stopSubmit = function(evt) {
      return false;
    };
    Event.$stopObserving($(form), 'submit');
    form.onsubmit = _stopSubmit;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * formのサブミット抑止解除処理<br />
 * formのonsubmit属性をクリアする。
 * @param {Element} form 対象フォームエレメント
 */
Use.Util.$releaseSubmit = function(form) {
  var METHODNAME = 'Use.Util.$releaseSubmit';
  try {

    form.onsubmit = null;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 検索結果の表示文字列省略処理<br />
 * 指定したバイト数に省略し、末尾に省略文字を付与して返却する。
 * @param {String} disptitle 表示文字列
 * @param {number} maxLenB 上限バイト数
 */
Use.Util.$abbreviatDispTitle = function(disptitle, maxLenB){
  var METHODNAME = 'Use.Util.$abbreviatDispTitle';
  try {

    var byteTbl = [0, 1, 1, 1, 2, 3, 2, 3, 4, 3];
    var replaceStr = disptitle.replace(new RegExp("&middot;", "g"), "・");
    var str = null;
    var len = disptitle.length;
    var lenB = 0;
    var abbrStr = "";
    var resultStr = "";

    for(var i = 0; i < len; i++) {
      str = replaceStr.charAt(i);

      // DTCコードの連結文字の場合
      if("・" == str) {
        // "&middot;"のバイト数を加算する
        lenB += 8;
      // 上記以外の文字の場合
      } else {
        // エンコード後の文字列長を元にバイト数を取得し、加算する
        lenB += byteTbl[encodeURIComponent(str).length];
      }

      // 上限バイト数を超えた場合、文字列を省略する
      if(lenB > maxLenB){

        // 省略文字が追加できない場合
        if(lenB > maxLenB - 3) {
          // 退避してある文字列に省略文字を追加する
          resultStr = abbrStr + "...";

        // 省略文字が追加できる場合はそのまま追加する
        } else {
          resultStr += "...";
        }
        break;
      }

      // 省略文字列が追加できる状態の文字列を退避しておく
      if(lenB <= maxLenB - 3) {
        abbrStr += str;
      }
      resultStr += str;
    }
    // DTCコードの連結文字を元の状態に戻す
    resultStr = resultStr.replace(new RegExp("・", "g"), "&middot;");

    return resultStr;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 非活性属性設定処理<br />
 * 対象エレメントに非活性属性を設定する。
 * @param {element} element 対象エレメント
 * @param {boolean} isDisabled true:非活性 / false:活性
 */
Use.Util.$setDisabled = function(element, isDisabled){
  var METHODNAME = 'Use.Util.$setDisabled';
  try {
    // isDisabledがtrueの場合
    if(isDisabled == true) {
      // 対象エレメントにdisabled属性を追加
      Util.$setAttrValue(element, "disabled", "disabled");
      Element.$addClassName(element, "button_style_disable");
    // isDisabledがfalseの場合
    } else if(isDisabled == false) {
      // 対象エレメントのdisabled属性を削除
      Element.$writeAttribute(element, "disabled", false);
      Element.$removeClassName(element, "button_style_disable");
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ipad用のスタイル追加処理<br />
 * 対象エレメントにスタイルを設定する。
 * @param {element} element 対象エレメント
 * @param {boolean} styles スタイル
 */
Use.Util.$setStyle_iPad=function(element,styles){
  var METHODNAME='Use.Util.$setStyle_iPad';
  try{

    if(element) {
      // iPadの場合のみ引数のスタイルを追加
      if(Terminal.IPAD){
        Element.$setStyle(element, styles);
      }
    }

  }catch(err){
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * iPad用クラス追加処理<br />
 * 使用している端末がiPadの場合のみ引数のクラスが追加される
 * @param {Element} element HTML要素
 * @param {String} className 追加クラス
 */
Use.Util.$addClassName_iPad = function(element, className) {
  var METHODNAME = 'Use.Util.$addClassName_iPad';
  try {

    if(element) {
      // iPadの場合のみ引数のクラスを追加
      if(Terminal.IPAD) {
        Element.$addClassName(element, className);
      }
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * iPad用クラス削除処理<br />
 * 使用している端末がiPadの場合のみ引数のクラスが削除される
 * @param {Element} element HTML要素
 * @param {String} className 削除クラス
 */
Use.Util.$removeClassName_iPad = function(element, className) {
  var METHODNAME = 'Use.Util.$removeClassName_iPad';
  try {

    if(element) {
      // iPadの場合のみ引数のクラスを削除
      if(Terminal.IPAD) {
        Element.$removeClassName(element, className);
      }
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

//-----------------------------------------------------------------------------
/**
 * 利用共通システムエラー画面
 * @namespace 利用共通システムエラー画面クラス
 */
Use.SystemError = {};

//定数定義
/**
 * システムエラー画面HTML
 * @type string
 */
Use.SystemError.PAGE = '\
<div id="system_error">\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<br>\
<h2>{CONST_SYSTEM_ERROR_TITLE}</h2>\
<br>\
<div id="system_error_text">\
<br>\
{CONST_SYSTEM_ERROR_MESSAGE}\
<br>\
<div>{CONST_SYSTEM_ERROR_TEXT}</div>\
<br>\
<div id="system_error_stack"></div>\
</div>\
</div>';

/**
 * Faceboxインスタンス
 * @type Facebox
 */
Use.SystemError.fbox = null;

/**
 * システムエラー情報
 * @type Exception
 */
Use.SystemError.exception = null;

/**
 * 初期化処理
 * @param {Facebox} fbox Faceboxインスタンス
 */
Use.SystemError.$init = function(fbox) {
  var METHODNAME = 'Use.SystemError.$init';
  try {

    Use.SystemError.fbox = fbox;
  
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * システムエラー画面表示
 * @param {object} err エラーオブジェクト
 * @param {string} methodName メソッド名
 * @param {string} id メッセージID
 * @param {boolean} isOut 出力フラグ<br />
 * true:出力する false:出力しない（デフォルト）
 * @param {string} outMessage 表示用メッセージ
 * @param {boolean} isParent 親画面フラグ<br />
 * true:親画面 false:親画面でない（デフォルト）
 */
Use.SystemError.$show = function(
    err, methodName, id, isOut, outMessage, isParent) {
  var METHODNAME = 'Use.SystemError.$show';
  try {

    var fbox = Use.SystemError.fbox;
    var target = Use.SystemError.PAGE;
    var parent = (window != window.parent) ? window.parent : null;
    var isOpened = false;
    var curError = null;
    var curID = id;
    var sysErrMsg = outMessage;

    //すでにシステムエラー登録済みの場合は処理しない
    if(Use.SystemError.exception) {
      return;
    }
    
    //親画面でない場合
    if(!isParent) {
      //Exceptionカスタマイズ処理
      var _stackException = function(exp, id, methodName) {
        //Exceptionがある場合
        if(exp) {
          //拡張済み場合はスタックに出力する
          if(exp._extended) {
            exp.addStackTrace('', methodName);
            
          //未拡張の場合は拡張してからスタックに出力する
          } else {
            exp._extended = true;
            methodName = methodName + '\n' + exp.getErrorDescription();

            //idがない場合はデフォルトを設定
            if(!id) {
              id = Use.Util.SYSTEM_ERROR_ID;
            }

            //拡張メンバを設定
            exp.id = id;
            exp.methodName = methodName;
            exp.stackTrace = [];
            exp.addStackTrace = function(message, mName) {
              var stack = '';
              //メッセージがある場合は編集する
              if(message) {
                stack += '[' + new Date().toLocaleString() + ']';
                stack += ' ' + message;
              }
              stack += ' ' + mName;
              this.stackTrace.push(stack);
            };
            exp.getStackTraceHTML = function() {
              var result = '';
              var len = this.stackTrace.length;
              var resultLen = 0;

              //メッセージを連結（<br>付加）
              for(var i = 0; i < len; i++) {
                result += this.stackTrace[i].replace(/\n/g, '<br>') + '<br>';
              }

              //最後の<br>を削除
              if(result) {
                resultLen = result.length;
                result = result.substr(0, resultLen - 4);
              }
              return result;
            };
            exp.addStackTrace(
                exp.id + ' ' + exp.getMessage(Use.Util.$getViewLang()),
                methodName);
          }
        }
        return exp;
      };
   
      //エラーがある場合
      if(err) {
        //エラーオブジェクトがExceptionの場合はカスタマイズのみ行う
        if(err.name == 'Exception') {
          curError = _stackException(
              err, id, methodName);

        //エラーオブジェクトが文字列の場合はExceptionを生成
        } else if(typeof(err) == 'string') {
          curError = _stackException(
              new Exception(err), id, methodName);

        //エラーオブジェクトの場合はメッセージを取得してExceptionを生成
        } else if(err.message) {
          curError = _stackException(
              new Exception(err.message, err), id, methodName);

        //その他の場合はtoStringを取得してExceptionを生成
        } else {
          curError = _stackException(
              new Exception(err.toString()), id, methodName);
        }
        
      //エラーがない場合はExceptionを生成
      } else {
        //idがない場合はデフォルトを設定
        if(!curID) {
          curID = Use.Util.SYSTEM_ERROR_ID;
        }
        curError = _stackException(
                    new Exception(Use.Util.$getMessages(curID)),
                    curID,
                    methodName);
      }
      err = curError;
    }

    //ここではまだ出力しない場合はスローする
    if(!isOut) {
      // 親要素がある場合はスローする
      if(parent) {
        throw curError;
      // 無い場合はその場で出力する
      } else {
        Use.SystemError.$show(err, methodName, id, true, sysErrMsg, true);
      }
      
    //出力する場合
    } else {
      //parentがいる場合はparentのシステムエラー画面を開く
      if(parent) {
        try {
          parent.Use.SystemError.$show(err, methodName, id, true, sysErrMsg, true);
          isOpened = true;
        } catch(e) {
        }
      }

      //parentのシステムエラー画面を開いてない場合は自画面で開く
      if(!isOpened) {
        //Faceboxインスタンスがない場合は新規に作成
        if(!fbox) {
          try {
            fbox = Use.$initFacebox(fbox);
          } catch(e) {
          }
        }

        //出力HTMLを編集
        target = target.replace('{methodName}', err.methodName);
        target = target.replace('{id}', err.id);
        target = target.replace('{message}', err.getMessage(Use.Util.$getViewLang()));
        target = target.replace('{CONST_SYSTEM_ERROR_TITLE}',
            Use.Util.$getMessage('MVWF0125DAE'));
        //表示用メッセージがない場合はデフォルトを設定
        if(!sysErrMsg) {
          sysErrMsg = Use.Util.$getMessage('MVWF0123DAE');
        }
        target = target.replace('{CONST_SYSTEM_ERROR_MESSAGE}', sysErrMsg);
        target = target.replace('{CONST_SYSTEM_ERROR_TEXT}',
            Use.Util.$getMessage('MVWF0124DAE'));

        // 画面抑止を解除
        Util.$enableWindow();
        Util.$enableArea();

        //Faceboxを表示
        Use.Util.$revealFacebox(fbox, target, '', true, ' ', true, '', null, true);
        //Use.Util.$revealFacebox(fbox, target, '', true, ' ', true, '');

        //エラーの詳細情報を退避
        Use.SystemError.exception = err;
        Use.Util.$observe(document, 'keydown', Use.SystemError.$showStackTrace);
      }
    }
    fbox = null;
    _stackException = null;

  } catch(exception) {
    fbox = null;
    _stackException = null;
    
    if(exception.name == 'Exception') {
      throw exception;
    } else if(exception.message) {
      throw METHODNAME + ' ' + exception.message;
    } else {
      throw METHODNAME + ' ' + exception.toString();
    }
  }
};

/**
 * システムエラー詳細表示
 * @param {Event} evt イベントオブジェクト
 */
Use.SystemError.$showStackTrace = function(evt) {
  var exception = Use.SystemError.exception;
  //Altキー押下
  if(evt.altKey) {
    //F10押下
    if(Event.$getKeyCode(evt) === 0x79) {
      //例外情報がある場合、例外の詳細を表示
      if(exception) {
        Use.SystemError.exception = null;
        $('fbx_system_error_stack').innerHTML = exception.getStackTraceHTML();
      }
    }
  }
};

//-----------------------------------------------------------------------------
/**
 * 利用共通入力チェック
 * @namespace 利用共通入力チェッククラス
 */
Use.Validator = {};

/**
 * 使用禁止文字チェック結果（正常）
 * @type number
 */
Use.Validator.RESULT_SUCCESS = -1;
/**
 * 使用禁止文字一覧（特殊文字）定義
 * @type object(連想配列)
 */
Use.Validator.NOT_PERMITTED_ZENKAKU_KANJI = {
    UX0000:0x0000,UX000E:0x000E,UX000F:0x000F,UX005C:0x005C,UX007E:0x007E,
    UX00A2:0x00A2,UX00A3:0x00A3,UX00A5:0x00A5,UX00AC:0x00AC,UX2014:0x2014,
    UX2015:0x2015,UX2016:0x2016,UX203E:0x203E,UX2026:0x2026,UX2116:0x2116,
    UX2121:0x2121,UX2160:0x2160,UX2161:0x2161,UX2162:0x2162,UX2163:0x2163,
    UX2164:0x2164,UX2165:0x2165,UX2166:0x2166,UX2167:0x2167,UX2168:0x2168,
    UX2169:0x2169,UX2170:0x2170,UX2171:0x2171,UX2172:0x2172,UX2173:0x2173,
    UX2174:0x2174,UX2175:0x2175,UX2176:0x2176,UX2177:0x2177,UX2178:0x2178,
    UX2179:0x2179,UX217A:0x217A,UX2116:0x2116,UX2121:0x2121,UX2211:0x2211,
    UX221A:0x221A,UX221F:0x221F,UX2220:0x2220,UX2225:0x2225,UX2229:0x2229,
    UX222A:0x222A,UX222B:0x222B,UX222E:0x222E,UX2235:0x2235,UX2217:0x2217,
    UX2235:0x2235,UX2252:0x2252,UX2261:0x2261,UX22A5:0x22A5,UX22BF:0x22BF,
    UX22EF:0x22EF,UX2460:0x2460,UX2461:0x2461,UX2462:0x2462,UX2463:0x2463,
    UX2464:0x2464,UX2465:0x2465,UX2466:0x2466,UX2467:0x2467,UX2468:0x2468,
    UX2469:0x2469,UX246A:0x246A,UX246B:0x246B,UX246C:0x246C,UX246D:0x246D,
    UX246E:0x246E,UX246F:0x246F,UX2470:0x2470,UX2471:0x2471,UX2472:0x2472,
    UX2473:0x2473,UX301C:0x301C,UX301D:0x301D,UX301F:0x301F,UX3231:0x3231,
    UX3232:0x3232,UX3239:0x3239,UX32A4:0x32A4,UX32A5:0x32A5,UX32A6:0x32A6,
    UX32A7:0x32A7,UX32A8:0x32A8,UX3303:0x3303,UX330D:0x330D,UX3314:0x3314,
    UX3318:0x3318,UX3322:0x3322,UX3323:0x3323,UX3326:0x3326,UX3327:0x3327,
    UX332B:0x332B,UX3336:0x3336,UX333B:0x333B,UX3349:0x3349,UX334A:0x334A,
    UX334D:0x334D,UX3351:0x3351,UX3357:0x3357,UX337B:0x337B,UX337C:0x337C,
    UX337D:0x337D,UX337E:0x337E,UX338E:0x338E,UX338F:0x338F,UX339C:0x339C,
    UX339D:0x339D,UX339E:0x339E,UX33A1:0x33A1,UX33C4:0x33C4,UX33CD:0x33CD,
    UX4E28:0x4E28,UX4EE1:0x4EE1,UX4EFC:0x4EFC,UX4F00:0x4F00,UX4F03:0x4F03,
    UX4F39:0x4F39,UX4F56:0x4F56,UX4F8A:0x4F8A,UX4F92:0x4F92,UX4F94:0x4F94,
    UX4F9A:0x4F9A,UX4FC9:0x4FC9,UX4FCD:0x4FCD,UX4FFF:0x4FFF,UX501E:0x501E,
    UX5022:0x5022,UX5040:0x5040,UX5042:0x5042,UX5046:0x5046,UX5070:0x5070,
    UX5094:0x5094,UX50D8:0x50D8,UX50F4:0x50F4,UX514A:0x514A,UX5164:0x5164,
    UX519D:0x519D,UX51BE:0x51BE,UX51EC:0x51EC,UX5215:0x5215,UX529C:0x529C,
    UX52A6:0x52A6,UX52AF:0x52AF,UX52C0:0x52C0,UX52DB:0x52DB,UX5300:0x5300,
    UX5307:0x5307,UX5324:0x5324,UX5372:0x5372,UX5393:0x5393,UX53B2:0x53B2,
    UX53DD:0x53DD,UX548A:0x548A,UX549C:0x549C,UX54A9:0x54A9,UX54FF:0x54FF,
    UX5586:0x5586,UX5759:0x5759,UX5765:0x5765,UX57AC:0x57AC,UX57C7:0x57C7,
    UX57C8:0x57C8,UX589E:0x589E,UX58B2:0x58B2,UX590B:0x590B,UX5953:0x5953,
    UX595B:0x595B,UX595D:0x595D,UX5963:0x5963,UX59A4:0x59A4,UX59BA:0x59BA,
    UX5B56:0x5B56,UX5BC0:0x5BC0,UX5BD8:0x5BD8,UX5BEC:0x5BEC,UX5C1E:0x5C1E,
    UX5CA6:0x5CA6,UX5CBA:0x5CBA,UX5CF5:0x5CF5,UX5D27:0x5D27,UX5D42:0x5D42,
    UX5D53:0x5D53,UX5D6D:0x5D6D,UX5DB8:0x5DB8,UX5DB9:0x5DB9,UX5DD0:0x5DD0,
    UX5F21:0x5F21,UX5F34:0x5F34,UX5F45:0x5F45,UX5F67:0x5F67,UX5FB7:0x5FB7,
    UX5FDE:0x5FDE,UX605D:0x605D,UX6085:0x6085,UX608A:0x608A,UX60D5:0x60D5,
    UX60DE:0x60DE,UX60F2:0x60F2,UX6111:0x6111,UX6120:0x6120,UX6130:0x6130,
    UX6137:0x6137,UX6198:0x6198,UX6213:0x6213,UX62A6:0x62A6,UX63F5:0x63F5,
    UX6460:0x6460,UX649D:0x649D,UX64CE:0x64CE,UX654E:0x654E,UX6600:0x6600,
    UX6609:0x6609,UX6615:0x6615,UX661E:0x661E,UX6624:0x6624,UX662E:0x662E,
    UX6631:0x6631,UX663B:0x663B,UX6657:0x6657,UX6659:0x6659,UX6665:0x6665,
    UX6673:0x6673,UX6699:0x6699,UX66A0:0x66A0,UX66B2:0x66B2,UX66BF:0x66BF,
    UX66FA:0x66FA,UX66FB:0x66FB,UX670E:0x670E,UX6766:0x6766,UX67BB:0x67BB,
    UX67C0:0x67C0,UX6801:0x6801,UX6844:0x6844,UX6852:0x6852,UX68C8:0x68C8,
    UX68CF:0x68CF,UX6968:0x6968,UX6998:0x6998,UX69E2:0x69E2,UX6A30:0x6A30,
    UX6A46:0x6A46,UX6A6B:0x6A6B,UX6A73:0x6A73,UX6A7E:0x6A7E,UX6AE2:0x6AE2,
    UX6AE4:0x6AE4,UX6BD6:0x6BD6,UX6C3F:0x6C3F,UX6C5C:0x6C5C,UX6C6F:0x6C6F,
    UX6C86:0x6C86,UX6CDA:0x6CDA,UX6D04:0x6D04,UX6D6F:0x6D6F,UX6D87:0x6D87,
    UX6D96:0x6D96,UX6DAC:0x6DAC,UX6DCF:0x6DCF,UX6DF2:0x6DF2,UX6DF8:0x6DF8,
    UX6DFC:0x6DFC,UX6E27:0x6E27,UX6E39:0x6E39,UX6E3C:0x6E3C,UX6E5C:0x6E5C,
    UX6EBF:0x6EBF,UX6F88:0x6F88,UX6FB5:0x6FB5,UX6FF5:0x6FF5,UX7005:0x7005,
    UX7007:0x7007,UX7028:0x7028,UX7085:0x7085,UX70AB:0x70AB,UX70BB:0x70BB,
    UX7104:0x7104,UX710F:0x710F,UX7146:0x7146,UX7147:0x7147,UX715C:0x715C,
    UX71C1:0x71C1,UX71FE:0x71FE,UX72B1:0x72B1,UX72BE:0x72BE,UX7324:0x7324,
    UX7377:0x7377,UX73BD:0x73BD,UX73C9:0x73C9,UX73D2:0x73D2,UX73D6:0x73D6,
    UX73E3:0x73E3,UX73F5:0x73F5,UX7407:0x7407,UX7426:0x7426,UX7429:0x7429,
    UX742A:0x742A,UX742E:0x742E,UX7462:0x7462,UX7489:0x7489,UX749F:0x749F,
    UX7501:0x7501,UX752F:0x752F,UX756F:0x756F,UX7682:0x7682,UX769B:0x769B,
    UX769C:0x769C,UX769E:0x769E,UX76A6:0x76A6,UX7746:0x7746,UX7821:0x7821,
    UX784E:0x784E,UX7864:0x7864,UX787A:0x787A,UX7930:0x7930,UX7994:0x7994,
    UX799B:0x799B,UX7AD1:0x7AD1,UX7AE7:0x7AE7,UX7AEB:0x7AEB,UX7B9E:0x7B9E,
    UX7D48:0x7D48,UX7D5C:0x7D5C,UX7DA0:0x7DA0,UX7DB7:0x7DB7,UX7DD6:0x7DD6,
    UX7E52:0x7E52,UX7E8A:0x7E8A,UX7F47:0x7F47,UX7FA1:0x7FA1,UX8301:0x8301,
    UX8362:0x8362,UX837F:0x837F,UX83C7:0x83C7,UX83F6:0x83F6,UX8448:0x8448,
    UX84B4:0x84B4,UX84DC:0x84DC,UX8553:0x8553,UX8559:0x8559,UX856B:0x856B,
    UX85B0:0x85B0,UX8807:0x8807,UX88F5:0x88F5,UX891C:0x891C,UX8A12:0x8A12,
    UX8A37:0x8A37,UX8A79:0x8A79,UX8AA7:0x8AA7,UX8ABE:0x8ABE,UX8ADF:0x8ADF,
    UX8AF6:0x8AF6,UX8B53:0x8B53,UX8B7F:0x8B7F,UX8CF0:0x8CF0,UX8CF4:0x8CF4,
    UX8D12:0x8D12,UX8D76:0x8D76,UX8ECF:0x8ECF,UX9067:0x9067,UX90DE:0x90DE,
    UX9115:0x9115,UX9127:0x9127,UX91D7:0x91D7,UX91DA:0x91DA,UX91DE:0x91DE,
    UX91E4:0x91E4,UX91E5:0x91E5,UX91ED:0x91ED,UX91EE:0x91EE,UX9206:0x9206,
    UX920A:0x920A,UX9210:0x9210,UX9239:0x9239,UX923A:0x923A,UX923C:0x923C,
    UX9240:0x9240,UX924E:0x924E,UX9251:0x9251,UX9259:0x9259,UX9267:0x9267,
    UX9277:0x9277,UX9278:0x9278,UX9288:0x9288,UX92A7:0x92A7,UX92D0:0x92D0,
    UX92D3:0x92D3,UX92D5:0x92D5,UX92D7:0x92D7,UX92D9:0x92D9,UX92E0:0x92E0,
    UX92E7:0x92E7,UX92F9:0x92F9,UX92FB:0x92FB,UX92FF:0x92FF,UX9302:0x9302,
    UX931D:0x931D,UX931E:0x931E,UX9321:0x9321,UX9325:0x9325,UX9348:0x9348,
    UX9357:0x9357,UX9370:0x9370,UX93A4:0x93A4,UX93C6:0x93C6,UX93DE:0x93DE,
    UX93F8:0x93F8,UX9431:0x9431,UX9445:0x9445,UX9448:0x9448,UX9592:0x9592,
    UX969D:0x969D,UX96AF:0x96AF,UX9733:0x9733,UX973B:0x973B,UX9743:0x9743,
    UX974D:0x974D,UX974F:0x974F,UX9751:0x9751,UX9755:0x9755,UX9857:0x9857,
    UX9865:0x9865,UX9927:0x9927,UX999E:0x999E,UX9A4E:0x9A4E,UX9AD9:0x9AD9,
    UX9ADC:0x9ADC,UX9B72:0x9B72,UX9B75:0x9B75,UX9B8F:0x9B8F,UX9BB1:0x9BB1,
    UX9BBB:0x9BBB,UX9C00:0x9C00,UX9D6B:0x9D6B,UX9D70:0x9D70,UX9E19:0x9E19,
    UX9ED1:0x9ED1,UXF929:0xF929,UXF9DC:0xF9DC,UXFA0E:0xFA0E,UXFA0F:0xFA0F,
    UXFA10:0xFA10,UXFA11:0xFA11,UXFA12:0xFA12,UXFA13:0xFA13,UXFA14:0xFA14,
    UXFA15:0xFA15,UXFA16:0xFA16,UXFA17:0xFA17,UXFA18:0xFA18,UXFA19:0xFA19,
    UXFA1A:0xFA1A,UXFA1B:0xFA1B,UXFA1C:0xFA1C,UXFA1D:0xFA1D,UXFA1E:0xFA1E,
    UXFA1F:0xFA1F,UXFA20:0xFA20,UXFA21:0xFA21,UXFA22:0xFA22,UXFA23:0xFA23,
    UXFA24:0xFA24,UXFA25:0xFA25,UXFA26:0xFA26,UXFA27:0xFA27,UXFA28:0xFA28,
    UXFA29:0xFA29,UXFA2A:0xFA2A,UXFA2B:0xFA2B,UXFA2C:0xFA2C,UXFA2D:0xFA2D,
    UXFF02:0xFF02,UXFF07:0xFF07,UXFF3C:0xFF3C,UXFF5E:0xFF5E,UXFFE0:0xFFE0,
    UXFFE1:0xFFE1,UXFFE2:0xFFE2,UXFFE3:0xFFE3,UXFFE4:0xFFE4,UXFFE5:0xFFE5,
    UXFFFD:0xFFFD
};
/**
 * 単語数正規表現
 * @type RegExp
 */
Use.Validator.REG_NUMBER_OF_WORDS = new RegExp('[^ 　]+', 'g');
/**
 * 非ALLブランク正規表現
 * @type RegExp
 */
Use.Validator.REG_IS_ALL_BLANK = new RegExp('^[ 　]+$');

/**
 * 必須チェック
 * @param {string} target チェック対象の文字列（NULL不許可）
 * @return {boolean} true：targetが空文字でなく、かつnullでない場合<br />
 * false：上記以外の場合
 */
Use.Validator.$isNotEmpty = function(target) {
  var METHODNAME = 'Use.Validator.$isNotEmpty';
  try {

    var result = false;
    //空の場合はfalse
    if(target) {
      //文字列でない場合はfalse
      if(typeof(target) == 'string') {
        //文字数が0より大きければtrue
        if(target.length > 0) {
          result = true;
        }
      }
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * サイズチェック
 * @param {string} target サイズをチェックする文字列（NULL不許可）
 * @param {number} length チェックするサイズ（string.length()で返却される値）
 * @return {boolean} true：制限値内 false：制限値オーバー
 */
Use.Validator.$checkSize = function(target, length) {
  var METHODNAME = 'Use.Validator.$checkSize';
  try {

    var result = false;
    //文字列でない場合はfalse
    if(typeof(target) == 'string') {
      //文字数がサイズ以下の場合はtrue
      if(target.length <= length) {
        result = true;
      }
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 正規表現チェック
 * @param {string} target サイズをチェックする文字列（NULL不許可）
 * @param {string} regex チェックする正規表現（NULL不許可）
 * @return {boolean} true：（正規表現）にマッチした場合 false：左記以外の場合
 */
Use.Validator.$isCorrectPattern = function(target, regex) {
  var METHODNAME = 'Use.Validator.$isCorrectPattern';
  try {

    var result = false;
    var r = null;
    //文字列でない場合はfalse
    if(typeof(target) == 'string') {
      r = new RegExp(regex);
      //正規表現にマッチした場合はtrue
      if(target.match(r)) {
        result = true;
      }
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 単語数チェック
 * @param {string} target サイズをチェックする文字列（NULL不許可）
 * @param {number} length チェックするサイズ（string.length()で返却される値）
 * @return {boolean} true：制限値内 false：制限値オーバー
 */
Use.Validator.$checkNumberOfWords = function(target, length) {
  var METHODNAME = 'Use.Validator.$checkNumberOfWords';
  try {

    var result = false;
    var m = null;
    //文字列でない場合はfalse
    if(typeof(target) == 'string') {
      target = Use.Validator.$trim(target);
      m = target.match(Use.Validator.REG_NUMBER_OF_WORDS)
      //単語が存在する場合
      if(m) {
        //単語数がサイズ以下であればtrue
        if(m.length <= length) {
          result = true;
        }
      } else {
        result = true;
      }
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};
 
/**
 * 禁止文字チェック
 * @param {string} target 禁止文字をチェックする文字列（NULL不許可）
 * @param {string} exStr 除外禁止文字（ここで指定した文字はチェックしない）
 * @return {number} Use.Validator.RESULT_SUCCESS：禁止文字なし<br />
 * 上記以外：禁止文字が存在する場合、<br />
 * 最初に出現した禁止文字のtargetにおける<br />
 * 最初のインデックスを返却する。
 */
Use.Validator.$checkPermissionWord = function(target, exStr) {
  var METHODNAME = 'Use.Validator.$checkPermissionWord';
  try {

    var result = Use.Validator.RESULT_SUCCESS;
    var len = target.length;
    var code = null;
    var cur = null;
    var tokushuMoji = Use.Validator.NOT_PERMITTED_ZENKAKU_KANJI;
    var ok = true;
    var i = 0;
    var _codeToHexKey = function(cd) {
      var result = cd.toString(16).toUpperCase();
      //文字コードを４桁に揃える
      while(result.length < 4) {
        result = '0' + result;
      }
      return 'UX' + result;
    };
    //１文字ずつチェック
    for(; i < len && ok; i++) {
      ok = false;
      //除外禁止文字の場合はエラーにしない
      if(exStr) {
        cur = target.charAt(i);
        if(exStr.indexOf(cur) >= 0) {
          ok = true;
        }
      }
      //禁止文字チェック
      if(!ok) {
        code = target.charCodeAt(i);
        //使用禁止文字一覧（半角カナ）の場合はエラー
        if(Use.Validator.$isHalfKanaCode(code)) {
          
        //使用禁止文字一覧（利用者定義文字（外字））の場合はエラー
        } else if(0xE000 <= code && code <= 0xF8FF) {
          
        //使用禁止文字一覧（サロゲート領域）の場合はエラー
        } else if(0xD800 <= code && code <= 0xDFFF) {
        
        //使用禁止文字一覧（特殊文字）の場合はエラー
        } else if(tokushuMoji[_codeToHexKey(code)]) {
          
        //禁止文字でない場合はOK
        } else {
          ok = true;
        }
      }
    }
    //禁止文字があった場合は禁止文字のインデックスを返す
    if(!ok) {
      result = i - 1;
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * ALLブランクチェック
 * @param {string} target チェック対象の文字列（NULL不許可）
 * @return {boolean} true：ブランク文字のみの場合<br />
 * false：上記以外の場合
 */
Use.Validator.$isAllBlank = function(target) {
  var METHODNAME = 'Use.Validator.$isAllBlank';
  try {

    var result = false;
    //値が空の場合はfalse
    if(target) {
      //文字列でない場合はfalse
      if(typeof(target) == 'string') {
        //すべて空白文字の場合はtrue
        if(target.match(Use.Validator.REG_IS_ALL_BLANK)) {
          result = true;
        }
      }
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 半角カナチェック
 * @param {string} target 半角カナをチェックする文字列（NULL不許可）
 * @return {number} Use.Validator.RESULT_SUCCESS：禁止文字なし<br />
 * 上記以外：半角カナが存在する場合、<br />
 * 最初に出現した半角カナのtargetにおける<br />
 * 最初のインデックスを返却する。
 */
Use.Validator.$searchHalfKana = function(target) {
  var METHODNAME = 'Use.Validator.$searchHalfKana';
  try {

    var result = Use.Validator.RESULT_SUCCESS;
    var len = target.length;
    var code = null;
    var ok = true;
    var i = 0;
    //１文字ずつチェック
    for(; i < len && ok; i++) {
      ok = false;
      //禁止文字チェック
      if(!ok) {
        code = target.charCodeAt(i);
        //使用禁止文字一覧（半角カナ）の場合はエラー
        if(Use.Validator.$isHalfKanaCode(code)) {
          
        //禁止文字でない場合はOK
        } else {
          ok = true;
        }
      }
    }
    //禁止文字があった場合は禁止文字のインデックスを返す
    if(!ok) {
      result = i - 1;
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 半角カナ文字コードチェック（UniCode）
 * @private
 * @param {number} code 文字コード
 * @return {boolean} true:半角カナ false:半角カナでない
 */
Use.Validator.$isHalfKanaCode = function(code) {
  var METHODNAME = 'Use.Validator.$isHalfKanaCode';
  try {

    //半角カナの場合はtrue
    if(0xFF65 <= code && code <= 0xFF9F) {
      return true;
    //半角カナでない場合はfalse
    } else {
      return false;
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * トリム処理
 * @private
 * @param {string} target 変換対象の文字列
 * @return {string} 変換後文字列（null, undefinedは空文字に変換）
 */
Use.Validator.$trim = function(target) {
  var METHODNAME = 'Use.Validator.$trim';
  try {

    var result = '';
    //文字列の場合のみ処理
    if(typeof(target) == 'string') {
      //変換対象の文字列がある場合は前後のスペースを除去
      if(target) {
        result = target.replace(/^[ 　]*/, '').replace(/[ 　]*$/, '');
      }
    }
    return result;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 利用共通GTS
 * @namespace 利用共通GTSクラス
 */
Use.GTS = {};

/**
 * GTS通信状態画面HTML
 * @type string
 */
Use.GTS.PAGE = '\
<div id="gts">\
<div>\
<p id="gts_message1"></p>\
</div>\
<div>\
<p id="gts_message2"></p>\
</div>\
<div>\
<p id="gts_message3"></p>\
</div>\
</div>';
/**
 * エラーコード
 * @type string
 */
Use.GTS.errorCode       = "";
/**
 * エラーコード(HEX)
 * @type string
 */
Use.GTS.errorHexCode    = "";
/**
 * 実行メソッド名
 * @type string
 */
Use.GTS.errorFunction   = "";
/**
 * 連携APIメソッド名
 * @type string
 */
Use.GTS.errorAPIFunction= "";
/**
 * 機能ID
 * @type string
 */
Use.GTS.errorFunctionId = "";
/**
 * 車両情報
 * @type object(連想配列)
 */
Use.GTS.vehicleInfo     = {IsError: false};
/**
 * ActiveX名
 * @type string
 */
Use.GTS.ACTIVEX_NAME = "GTSPLUGIN.GTSPluginCtrl.1";
/**
 * プラグイン名
 * @type string
 */
Use.GTS.PLUGIN_NAME = "NPGTSPlugin";
/**
 * ActiveX HTML
 * @type string
 */
Use.GTS.ACTIVEX_HTML = '\
<object id="GTSPlugin" \
CLASSID="CLSID:8271EF19-D54F-43B0-8744-53A21D9DA385" \
width="0" height="0"></object>';
/**
 * プラグインHTML
 * @type string
 */
Use.GTS.PLUGIN_HTML = '\
<embed id="GTSPlugin" type="application/x-TMC-GTSPlugin" \
width="0" height="0">';

/**
 * GTSプラグインオブジェクト取得
 * @return {object} GTSプラグインオブジェクト
 */
Use.GTS.$getPlugin = function() {
  var METHODNAME = "Use.GTS.$getPlugin";
  try {
    var gtsPlugin = null;
    //プラグイン使用可能でない場合はnullを返す
    if(!Util.$canUsePlugin(Use.GTS.ACTIVEX_NAME, Use.GTS.PLUGIN_NAME)) {
      return null;
    }
    gtsPlugin = $("GTSPlugin");
    //プラグインのタグがない場合は動的に生成する
    if(!gtsPlugin) {
      $$("body")[0].appendChild(Util.$createPluginElement(Use.GTS.ACTIVEX_HTML,
          Use.GTS.PLUGIN_HTML));
      gtsPlugin = $("GTSPlugin");
    }
    return gtsPlugin;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS連携・GTS画面表示
 * @param {Array} elements スパン配列
 * @param {Facebox} faceBox フェースボックスインスタンス
 * @param {object(連想配列)} carInfo 車種選択情報
 */
Use.GTS.$show = function(elements, faceBox, carInfo) {
  var METHODNAME = "Use.GTS.$show";
  try {
    var gtsPlugin = null;
    var gtsFunction = "";
    var gtsEcu = "";
    var gtsPid = "";
    var gtsDid = "";
    var gtsCust = "";
    var gtsUtil = "";
    var gts2ndEcu = "";
    var gts2ndPid = "";
    var gtsMultiMode = "";
    var ret = "";
    var elmLen = 0;
    var errorMsg = "";

    //GTS連携状態画面表示の初期化
    Use.GTS.$initStatus(faceBox);

    //GTS連携準備中状態表示
    Use.GTS.$showStatus("MVWF0021AAI", "", "");

    //GTS連携初期化
    gtsPlugin = Use.GTS.$getPlugin();
    //GTSプラグイン/APIのインストールが無い場合
    if(gtsPlugin == null) {
      Use.Util.$alert(
          Use.Util.$getMessage("MVWF0016AAE") + "0x80040242", null, null);
      Use.GTS.$exitGtsPlugin(faceBox);
      return;
    }

    elmLen = elements.length;
    //GTS連携画面表示パラメーターの設定
    for(var eIdx = 0; eIdx < elmLen; eIdx++) {
      //属性が"gtsFunction"の場合，値を取得する
      if (elements[eIdx].className == "gtsFunction") {
        gtsFunction = elements[eIdx].innerHTML;
      //属性が"gtsEcu"の場合，値を取得する
      } else if (elements[eIdx].className == "gtsEcu") {
        gtsEcu = elements[eIdx].innerHTML;
      //属性が"gtsPid"の場合，値を取得する
      } else if (elements[eIdx].className == "gtsPid") {
        gtsPid = elements[eIdx].innerHTML;
      //属性が"gtsDid"の場合，値を取得する
      } else if (elements[eIdx].className == "gtsDid") {
        gtsDid = elements[eIdx].innerHTML;
      //属性が"gtsCust"の場合，値を取得する
      } else if (elements[eIdx].className == "gtsCust") {
        gtsCust = elements[eIdx].innerHTML;
      //属性が"gtsUtil"の場合，値を取得する
      } else if (elements[eIdx].className == "gtsUtil") {
        gtsUtil = elements[eIdx].innerHTML;
      //属性が"gts2ndEcu"の場合，値を取得する
      } else if (elements[eIdx].className == "gts2ndEcu") {
        gts2ndEcu = elements[eIdx].innerHTML;
      //属性が"gts2ndPid"の場合，値を取得する
      } else if (elements[eIdx].className == "gts2ndPid") {
        gts2ndPid = elements[eIdx].innerHTML;
      //属性が"gtsMultiMode"の場合，値を取得する
      } else if (elements[eIdx].className == "gtsMultiMode") {
        gtsMultiMode = elements[eIdx].innerHTML;
      }
    }

    //GetStatusCallの処理
    ret = Use.GTS.$getStatusCall(gtsPlugin);
    //正常終了で無い場合
    if(ret != " ") {
      Use.GTS.$showMessage(ret, "GetStatusCall", gtsFunction);
      Use.GTS.$exitGtsPlugin(faceBox);
      return;
    }

    //GTS連携準備OK,Techstream起動中状態表示
    Use.GTS.$showStatus("MVWF0022AAI", "MVWF0023AAI", "");

    //ChkVehicleInfoCallの処理
    ret = Use.GTS.$chkVehicleInfoCall(gtsPlugin, carInfo);
    //正常終了で無い場合
    if(ret != " ") {
      Use.GTS.$showMessage(ret, "ChkVehicleInfoCall", gtsFunction);
      Use.GTS.$exitGtsPlugin(faceBox);
      return;
    }

    //GTS連携Techstream起動OK,機能起動中状態表示
    Use.GTS.$showStatus("MVWF0022AAI", "MVWF0024AAI", "MVWF0025AAI");

    //DisplayScreenCallの処理
    ret = Use.GTS.$displayScreenCall(gtsPlugin, gtsFunction, 
        gtsEcu, gtsPid, gtsDid, gtsCust, gtsUtil, 
        gts2ndEcu, gts2ndPid, gtsMultiMode, carInfo);
    //正常終了で無い場合
    if(ret != " ") {
      Use.GTS.$showMessage(ret, "DisplayScreenCall", gtsFunction);
      Use.GTS.$exitGtsPlugin(faceBox);
      return;
    }

    Use.GTS.$exitGtsPlugin(faceBox);

    //正常終了した場合
    Use.GTS.vehicleInfo.IsError = true;
    return Use.GTS.vehicleInfo;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS連携・GTSより情報取得
 * @param {Facebox} faceBox フェースボックスインスタンス
 */
Use.GTS.$getInfo = function(faceBox) {
  var METHODNAME = "Use.GTS.$getInfo";
  try {
    var gtsPlugin = null;
    var ret = "";

    //GTS連携状態画面表示の初期化
    Use.GTS.$initStatus(faceBox);

    //GTS連携準備中状態表示
    Use.GTS.$showStatus("MVWF0021AAI", "", "");

    //GTS連携初期化
    gtsPlugin = Use.GTS.$getPlugin();
    //GTSプラグイン/APIのインストールが無い場合
    if(gtsPlugin == null) {
      Use.Util.$alert(
          Use.Util.$getMessage("MVWF0016AAE") + "0x80040242", null, null);
      Use.GTS.$exitGtsPlugin(faceBox);
      return;
    }

    //GTS連携準備OK,Techstream起動中状態表示
    Use.GTS.$showStatus("MVWF0022AAI", "MVWF0023AAI", "");

    //GetStatusCallの処理
    ret = Use.GTS.$getStatusCall(gtsPlugin);
    //正常終了で無い場合
    if(ret != " ") {
      Use.GTS.$showMessage(ret, "GetStatusCall", "");
      Use.GTS.$exitGtsPlugin(faceBox);
      return;
    }

    //GTS連携Techstream起動OK,機能起動中状態表示
    Use.GTS.$showStatus("MVWF0022AAI", "MVWF0024AAI", "");

    //GetVehicleInfoCallの処理
    ret = Use.GTS.$getVehicleInfoCall(gtsPlugin);
    //正常終了で無い場合
    if(ret != " ") {
      Use.GTS.$showMessage(ret, "GetVehicleInfoCall", "");
      Use.GTS.$exitGtsPlugin(faceBox);
      return;
    }

    Use.GTS.$exitGtsPlugin(faceBox);

    //正常終了した場合
    Use.GTS.vehicleInfo.IsError = true;
    return Use.GTS.vehicleInfo;

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS連携・GetStatusCallの実行
 * @param {object} gtsPlugin GTSプラグインオブジェクト
 * @return {object} 処理結果
 */
Use.GTS.$getStatusCall = function(gtsPlugin) {
  var METHODNAME = "Use.GTS.$getStatusCall";
  try {
    var ret = " ";
    //ログ付加情報
    //gtsPlugin.PubNo           = pubNo;
    //gtsPlugin.ParagraphID     = paragraphID;
    //GetStatusCallの実行
    ret = gtsPlugin.GetStatusCall();
    //GetStatusCallのプロパティの参照
    //エラー情報
    Use.GTS.errorCode        = gtsPlugin.ErrorCode;
    Use.GTS.errorHexCode     = gtsPlugin.ErrorHexCode;
    Use.GTS.errorFunction    = gtsPlugin.ErrorFunction;
    Use.GTS.errorAPIFunction = gtsPlugin.ErrorAPIFunction;
    Use.GTS.errorFunctionId  = gtsPlugin.ErrorFunctionId;
    //処理ステータス情報
    //Cooperation  = gtsPlugin.Cooperation;
    //FunctionId   = gtsPlugin.FunctionId;
    //Status       = gtsPlugin.Status;
    //EstimateTime = gtsPlugin.EstimateTime;
    return ret;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS連携・ChkVehicleInfoCallの実行
 * @param {object} gtsPlugin GTSプラグインオブジェクト
 * @param {object(連想配列)} carInfo 車種選択情報
 * @return {object} 処理結果
 */
Use.GTS.$chkVehicleInfoCall = function(gtsPlugin, carInfo) {
  var METHODNAME = "Use.GTS.$chkVehicleInfoCall";
  try {
    var ret = " ";
    var regionIdWork = "";

    //車両情報
    gtsPlugin.VIN1            = carInfo.VIN;
    gtsPlugin.ModelCode       = carInfo.TYPE;
    gtsPlugin.EngineCode      = carInfo.ENGINE;
    //gtsPlugin.Transmission    = carInfo.Transmission;
    gtsPlugin.ModelYear       = carInfo.MY;

    //車両選択情報
    //gtsPlugin.SoftwareVersion = carInfo.SoftwareVersion;
    regionIdWork              = carInfo.FOR_LANG;
    gtsPlugin.RegionId        =
      Use.GTS.$serviceRegionIdToGTSRegionId(regionIdWork);
    gtsPlugin.VIN2            = carInfo.VIN;
    gtsPlugin.UserSelect1     = carInfo.MY;
    //gtsPlugin.UserSelect2     = carInfo.ENGINE;
    gtsPlugin.Division        = carInfo.BRAND_NAME;
    //gtsPlugin.Option1         = carInfo.Option1;
    //gtsPlugin.Option2         = carInfo.Option2;
    //gtsPlugin.Option3         = carInfo.Option3;
    //gtsPlugin.ModelName       = carInfo.ModelName;

    ////ログ付加情報
    //gtsPlugin.PubNo           = pubNo;
    //gtsPlugin.ParagraphID     = paragraphID;

    //ChkVehicleInfoCallの実行
    ret = gtsPlugin.ChkVehicleInfoCall();

    //エラー情報
    Use.GTS.errorCode        = gtsPlugin.ErrorCode;
    Use.GTS.errorHexCode     = gtsPlugin.ErrorHexCode;
    Use.GTS.errorFunction    = gtsPlugin.ErrorFunction;
    Use.GTS.errorAPIFunction = gtsPlugin.ErrorAPIFunction;
    Use.GTS.errorFunctionId  = gtsPlugin.ErrorFunctionId;
    return ret;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS連携・DisplayScreenCallの実行
 * @param {object} gtsPlugin GTSプラグインオブジェクト
 * @param {string} functionId 機能ID
 * @param {string} ecuId EUC_ID
 * @param {string} pidId PID_ID
 * @param {string} didId DID_ID
 * @param {string} customizeId カスタマイズ区分ID
 * @param {string} utilityId ユーティリティー機能ID
 * @param {string} ecu2ndId 第2ECU_ID
 * @param {string} pid2ndId 第2PID_ID
 * @param {string} multiMode マルチモード
 * @param {object(連想配列)} carInfo 車種選択情報
 * @return {object} 処理結果
 */
Use.GTS.$displayScreenCall = function(
    gtsPlugin, functionId, ecuId, pidId, didId, customizeId, utilityId,
    ecu2ndId, pid2ndId, multiMode, carInfo) {
  var METHODNAME = "Use.GTS.$displayScreenCall";
  try {
    var ret = " ";
    var regionIdWork = "";
    //車両情報
    gtsPlugin.VIN1            = carInfo.VIN;
    gtsPlugin.ModelCode       = carInfo.TYPE;
    gtsPlugin.EngineCode      = carInfo.ENGINE;
    //gtsPlugin.Transmission    = carInfo.Transmission;
    gtsPlugin.ModelYear       = carInfo.MY;

    //車両選択情報
    //gtsPlugin.SoftwareVersion = carInfo.SoftwareVersion;
    regionIdWork              = carInfo.FOR_LANG;
    gtsPlugin.RegionId        =
      Use.GTS.$serviceRegionIdToGTSRegionId(regionIdWork);
    gtsPlugin.VIN2            = carInfo.VIN;
    gtsPlugin.UserSelect1     = carInfo.MY;
    //gtsPlugin.UserSelect2     = carInfo.ENGINE;
    gtsPlugin.Division        = carInfo.BRAND_NAME;
    //gtsPlugin.Option1         = carInfo.Option1;
    //gtsPlugin.Option2         = carInfo.Option2;
    //gtsPlugin.Option3         = carInfo.Option3;
    //gtsPlugin.ModelName       = carInfo.ModelName;

    ////ログ付加情報
    //gtsPlugin.PubNo           = pubNo;
    //gtsPlugin.ParagraphID     = paragraphID;
    
    //DisplayScreenCallの実行
    if(multiMode == "") {
      ret = gtsPlugin.DisplayScreenCall(
              functionId,
              ecuId,
              pidId,
              didId,
              customizeId,
              utilityId);
    } else {
      try{
        ret = gtsPlugin.DisplayScreenCallMulti(
                functionId,
                ecuId,
                pidId,
                didId,
                customizeId,
                utilityId,
                ecu2ndId,
                pid2ndId,
                multiMode);
        if(!ret){
          ret = gtsPlugin.DisplayScreenCall(
                  functionId,
                  ecuId,
                  pidId,
                  didId,
                  customizeId,
                  utilityId);
        }
      }catch(err){
        ret = gtsPlugin.DisplayScreenCall(
                functionId,
                ecuId,
                pidId,
                didId,
                customizeId,
                utilityId);
      }
    }
    //DisplayScreenCallのプロパティ取得
    //エラー情報
    Use.GTS.errorCode        = gtsPlugin.ErrorCode;
    Use.GTS.errorHexCode     = gtsPlugin.ErrorHexCode;
    Use.GTS.errorFunction    = gtsPlugin.ErrorFunction;
    Use.GTS.errorAPIFunction = gtsPlugin.ErrorAPIFunction;
    Use.GTS.errorFunctionId  = gtsPlugin.ErrorFunctionId;

    return ret;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS連携・GetVehicleInfoCallの実行
 * @param {object} gtsPlugin GTSプラグインオブジェクト
 * @return {object} 処理結果
 */
Use.GTS.$getVehicleInfoCall = function(gtsPlugin) {
  var METHODNAME = "Use.GTS.$getVehicleInfoCall";
  try {
    var ret = " ";
    var regionIdWork = "";
    ////ログ付加情報
    //gtsPlugin.PubNo                     = pubNo;
    //gtsPlugin.ParagraphID               = paragraphID;

    //GetVehicleInfoCallの実行
    ret = gtsPlugin.GetVehicleInfoCall();

    //GetStatusCallのプロパティの参照
    //エラー情報
    Use.GTS.errorCode                   = gtsPlugin.ErrorCode;
    Use.GTS.errorHexCode                = gtsPlugin.ErrorHexCode;
    Use.GTS.errorFunction               = gtsPlugin.ErrorFunction;
    Use.GTS.errorAPIFunction            = gtsPlugin.ErrorAPIFunction;
    Use.GTS.errorFunctionId             = gtsPlugin.ErrorFunctionId;
    //車両情報
    Use.GTS.vehicleInfo.VIN1            = gtsPlugin.VIN1;
    Use.GTS.vehicleInfo.ModelCode       = gtsPlugin.ModelCode;
    Use.GTS.vehicleInfo.EngineCode      = gtsPlugin.EngineCode;
    //Use.GTS.vehicleInfo.Transmission    = gtsPlugin.Transmission;
    Use.GTS.vehicleInfo.ModelYear       = gtsPlugin.ModelYear;
    //Use.GTS.vehicleInfo.Cylinder        = gtsPlugin.Cylinder;

    //車両選択情報
    //Use.GTS.vehicleInfo.SoftwareVersion = gtsPlugin.SoftwareVersion;
    regionIdWork                        = gtsPlugin.RegionId;
    Use.GTS.vehicleInfo.RegionId        = 
      Use.GTS.$gtsRegionIdToServiceRegionId(regionIdWork);
    Use.GTS.vehicleInfo.VIN2            = gtsPlugin.VIN2;
    //Use.GTS.vehicleInfo.UserSelect1     = gtsPlugin.UserSelect1;
    //Use.GTS.vehicleInfo.UserSelect2     = gtsPlugin.UserSelect2;
    Use.GTS.vehicleInfo.Division        = gtsPlugin.Division;
    Use.GTS.vehicleInfo.Option1         = gtsPlugin.Option1;
    Use.GTS.vehicleInfo.Option2         = gtsPlugin.Option2;
    Use.GTS.vehicleInfo.Option3         = gtsPlugin.Option3;
    Use.GTS.vehicleInfo.ModelName       = gtsPlugin.ModelName;
    return ret;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS連携状態のフェースボックスを表示
 * @param {Facebox} faceBox フェースボックスインスタンス
 */
Use.GTS.$initStatus = function(faceBox) {
  var METHODNAME = "Use.GTS.$initStatus";
  try {
    var title = Use.Util.$getMessage("CONST_GTS_FACEBOX_TITLE");
    Use.Util.$revealFacebox(
        faceBox, Use.GTS.PAGE, "gts_facebox", true, title, true, "");
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS連携状態の設定
 * @param {string} messageId1 1行目のメッセージ
 * @param {string} messageId2 2行目のメッセージ
 * @param {string} messageId3 3行目のメッセージ
 */
Use.GTS.$showStatus = function(messageId1, messageId2, messageId3) {
  var METHODNAME = "Use.GTS.$showStatus";
  try {
    var message1 = "";
    var message2 = "";
    var message3 = "";
    //メッセージが設定されている場合
    if(messageId1 != "") {
      message1 = Use.Util.$getMessage(messageId1);
    }
    //メッセージが設定されている場合
    if(messageId2 != "") {
      message2 = Use.Util.$getMessage(messageId2);
    }
    //メッセージが設定されている場合
    if(messageId3 != "") {
      message3 = Use.Util.$getMessage(messageId3);
    }
    parent.$("fbx_gts_message1").innerHTML = message1;
    parent.$("fbx_gts_message2").innerHTML = message2;
    parent.$("fbx_gts_message3").innerHTML = message3;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTSからサービスへRegionIdコード変換処理
 * @param {string} regionIdWork 仕向け
 * @return {string} 仕向コード
 */
Use.GTS.$gtsRegionIdToServiceRegionId = function(regionIdWork) {
  var METHODNAME = "Use.GTS.$gtsRegionIdToServiceRegionId";
  try {
    var work = "";
    //北米の場合
    if(regionIdWork == "1") {
      work = "U";
    //欧州の場合
    } else if(regionIdWork == "2"){
      work = "E";
    //日本の場合
    } else if(regionIdWork == "3"){
      work = "J";
    //一般地の場合
    } else if(regionIdWork == "4"){
      work = "E";
    //その他の場合
    } else {
      work = "";
    }
    return work;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GTS連携の終了処理
 * @param {Facebox} faceBox フェースボックスインスタンス
 */
Use.GTS.$exitGtsPlugin = function(faceBox) {
  var METHODNAME = "Use.GTS.$exitGtsPlugin";
  try {
    
    // フェイスボックスが存在する場合は終了処理を行う
    if(faceBox != undefined && faceBox != null) {
      faceBox.close();
    }
    
    // GTS連携オブジェクトが残っている場合、DOMツリー上から削除する
    if($("GTSPlugin") != null) {
      Element.$remove("GTSPlugin");
    }
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * サービスからGTSへRegionIdコード変換処理
 * @param {string} regionIdWork 仕向け
 * @return {string} 仕向コード
 */
Use.GTS.$serviceRegionIdToGTSRegionId = function(regionIdWork) {
  var METHODNAME = "Use.GTS.$serviceRegionIdToGTSRegionId";
  try {
    var work = "";
    //北米の場合
    if(regionIdWork == "U") {
      work = "1";
    //日本の場合
    } else if(regionIdWork == "J") {
      work = "3";
    //欧州/一般地の場合
    } else if(regionIdWork == "E") {
      work = "2,4";
    //その他の場合
    } else {
      work = "";
    }
    return work;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * HRESULTからMSGID変換処理
 * @param {string} hResult 結果コード
 * @param {string} fncName 関数名
 * @param {string} fncID 機能ID
 */
Use.GTS.$showMessage = function(hResult, fncName, fncID) {
  var METHODNAME = "Use.GTS.$showMessage";
  try {
    var msgID = " ";
    var code = "";

    //引数異常
    if(hResult == "0x80040201") {
      msgID = "MVWF0015AAE";
    //リモコン機能利用不可
    }else if(hResult == "0x80040241") {
      msgID = "MVWF0017AAE";
    //GTS未インストール
    } else if(hResult == "0x80040242") {
      msgID = "MVWF0016AAE";
    //サービス情報連携不可
    } else if(hResult == "0x80040243") {
      msgID = "MVWF0013AAE";
    //サービス情報連携不可(ロック状態)
    } else if(hResult == "0x80040244") {
      msgID = "MVWF0012AAE";
    //GTS起動異常
    } else if(hResult == "0x80040245") {
      msgID = "MVWF0011AAE";
    //車両通信異常
    } else if(hResult == "0x80040246") {
      msgID = "MVWF0015AAE";
    //GTS車両情報不一致
    } else if(hResult == "0x80040247") {
      msgID = "MVWF0015AAE";
    //GTS機能ID不一致
    } else if(hResult == "0x80040248") {
      msgID = "MVWF0015AAE";
    //GTSID不一致
    } else if(hResult == "0x80040249") {
      msgID = "MVWF0015AAE";
    //ユーザによるGTS終了
    } else if(hResult == "0x8004024A") {
      msgID = " ";
    //GTS処理ステータス設定異常
    } else if(hResult == "0x8004024B") {
      msgID = "MVWF0014AAE";
    //画面表示時タイムアウト
    } else if(hResult == "0x8004024C") {
      msgID = "MVWF0015AAE";
    //関数利用不可
    } else if(hResult == "0x8004024D") {
      msgID = "MVWF0015AAE";
    //API内部処理異常
    } else if(hResult == "0x8004024E") {
      msgID = "MVWF0015AAE";
    //サポート不可
    } else if(hResult == "0x8004024F") {
      msgID = "MVWF0015AAE";
    //サポート可能で通信エラー
    } else if(hResult == "0x80040250") {
      msgID = "MVWF0015AAE";
    //GTS機能ID不一致
    } else if(hResult == "0x80040548") {
      msgID = "MVWF0015AAE";
    //関数利用不可
    } else if(hResult == "0x8004074D") {
      msgID = "MVWF0015AAE";
    //(想定外エラー)
    } else {
      msgID = "MVWF0015AAE";
    }

    if(msgID != " ") {
      //メッセージ表示
      Use.Util.$alert(Use.Util.$getMessage(msgID) +
          (fncName != "" ? fncName + "_" : "") +
          (fncID != "" ? fncID + "_" : "") + hResult, null, null);
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 利用共通修理書
 * @namespace 利用共通修理書クラス
 */
Use.Repair = {};

/**
 * 手順詳細画面表示
 * @param {string} paraId パラグラフID
 * @param {string} anchor アンカー
 * @param {string} target ターゲット
 * @param {string} option オプション
 * @param {string} windowSize ウィンドウサイズ
 * @param {boolean} isCallFlow true : 診断フロー警告注意から表示する場合
 *                             false: そのほか
 */
Use.Repair.$openUrlProcedures = function(
    paraId, anchor, target, option, windowSize, isCallFlow) {
  var METHODNAME = "Use.Repair.$openUrlProcedures";
  try {
    var url = "";
    var constPath = "";

    //IE
    if(Browser.IE) {
      constPath = "C_SERVICE_FLOW_CONTENT_PATH";
    //FireFox（FF）
    } else if(Browser.GECKO) {
      if(isCallFlow == true) {
        constPath = "C_SERVICE_FLOW_CONTENT_PATH";
      } else {
        constPath = "C_CONTENTS_FLOW_CONTENT_PATH";
      }
    //Google Chrome（GC）
    } else if(Browser.WEBKIT) {
      if(isCallFlow == true) {
        constPath = "C_SERVICE_FLOW_CONTENT_PATH";
      } else {
        constPath = "C_CONTENTS_FLOW_CONTENT_PATH";
      }
    }

    url = Use.Util.$getContentsPath(constPath, "", "", "");
    url = url.replace("{0}", paraId);
    url += "?PUB_TYPE=RM&MODE=3";
    if(anchor != "") {
      url += "#" + anchor;
    }

    Util.$openUrl(url, target, option, windowSize);

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 利用共通コンテンツ
 * @namespace 利用共通コンテンツクラス
 */
Use.Contents = {};

/**
 * ヘッダ文字列取得処理
 * @return {string} 取得文字列
 */
Use.Contents.$getFrameHeadString = function() {
  var METHODNAME = "Use.Contents.$getFrameHeadString";
  try {
    //IEでActiveXが使える場合はPrintPreviewボタンが追加された文字列を取得
    if(Browser.IE == true && Browser.ACTIVEX == true) {
      return Use.Util.$getMessage("CONST_CONTENTS_FIXED_HEAD_IE");
    //IE以外の場合は通常の文字列を取得
    } else {
      return Use.Util.$getMessage("CONST_CONTENTS_FIXED_HEAD");
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * SWFボタンイベント登録処理
 */
Use.Contents.$observeShowSWF = function() {
  var METHODNAME = "Use.Contents.$observeShowSWF";
  try {
    var elms = $$("div.swfPattern");
    var elm  = null;
    var len  = elms.length;
    var path = "";
    var pathAry = [];
    var tab = Contents.myParent.$getCurrentTabName();
    var target = tab + "SwfWindow_" + Contents.myParent.$getInitDate();
    var embedEl = null;
    var parentEl = null;
    var newEl = null;
  
    //ipad以外はボタンを活性
    if(Terminal.IPAD == false) {
      // コンテンツ内の"div.swfPattern"数分だけループする
      for(var i = 0; i < len; i++) {
        path = Use.Util.$getContentsPath("C_CONTENTS_SWF_PATH");
        embedEl = Util.Selector.$select("embed", elms[i])[0];
        pathAry = embedEl.src.split("/");
        pathAry.reverse();
        path = path.replace("{0}", pathAry[0]);
        //embedタグの透過設定をする（z-index対策）
        embedEl.outerHTML = "<embed src=\"" + embedEl.src + "\" wmode=\"transparent\">";
        
        elm = Util.Selector.$select("input.playswf", elms[i])[0];
        Use.Util.$observe(elm, "click",
          (function(url, tgt) {
            return function(evt) {
              Contents.$doClickSwfBtn(evt, url, tgt);
            };
          })(path, target)
        );
      }
    } else {
      for(var i = 0; i < len; i++) {
        elm=Util.Selector.$select("input.playswf",elms[i])[0];
        Element.$setStyle(elm, "color: #ACA899; cursor: default;");
        elm.disabled = true;
      }
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * GIFボタンイベント登録処理
 */
Use.Contents.$observeShowGIF = function() {
  var METHODNAME = "Use.Contents.$observeShowGIF";
  try {
    var elms = $$("div.gifPattern");
    var elm  = null;
    var len  = elms.length;
    var path = "";
    var pathAry = [];
    var tab = Contents.myParent.$getCurrentTabName();
    
    //SWFとGIFで別ウィンドウとならないようにウィンドウ名は"SwfWindow"とする
    var target = tab + "SwfWindow_" + Contents.myParent.$getInitDate();
    var embedEl = null;
    var parentEl = null;
    var newEl = null;

    //ipad以外はボタンを活性
    if(Terminal.IPAD == false) {
      // コンテンツ内の"div.gifPattern"数分だけループする
      for(var i = 0; i < len; i++) {
        path = Use.Util.$getContentsPath("C_CONTENTS_GIF_PATH");
        embedEl = Util.Selector.$select("img", elms[i])[0];
        pathAry = embedEl.src.split("/");
        pathAry.reverse();
        path = path.replace("{0}", pathAry[0]);

        //embedタグの透過設定をする（z-index対策）
        embedEl.outerHTML = "<img src=\"" + embedEl.src + "\" wmode=\"transparent\">";

        elm = Util.Selector.$select("input.playgif", elms[i])[0];
        Use.Util.$observe(elm, "click",
          (function(url, tgt) {
            return function(evt) {
              Contents.$doClickGifBtn(evt, url, tgt);
            };
          })(path, target)
        );
      }
    } else {
      for(var i = 0; i < len; i++) {
        elm=Util.Selector.$select("input.playgif",elms[i])[0];
        Element.$setStyle(elm, "color: #ACA899; cursor: default;");
        elm.disabled = true;
      }
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フロー全体図設定
 * @param {object} own 診断フロー
 */
Use.Contents.$setFlowNavi = function(own) {
  var METHODNAME = "Use.Contents.$setFlowNavi";
  try {
    var elmFlowNaviTitle = null;
    var elmFlowNavi = null;
    // iPad以外の場合は全体図表示
    if(Terminal.IPAD == false) {
      own.$doResizeViewSize();
    // iPadの場合は全体図非表示
    } else {
      elmFlowNaviTitle = $("flow_navi_title");
      elmFlowNavi = $("flow_navi");
      Element.$addClassName(elmFlowNaviTitle,"invisible");
      Element.$addClassName(elmFlowNavi,"invisible");
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローマウスイベント登録処理
 * @param {object} own 診断フロー
 */
Use.Contents.$observeFlow = function(own) {
  var METHODNAME = "Use.Contents.$setFlowNavi";
  try {
    var elmFlowBody = $("flow_body");
    var elmNaviTitle = Util.Selector.$select("a", $("navi_title"))[0];
    var elmNaviExpand = Util.Selector.$select("a", $("navi_expand"))[0];
    var elmNaviCover = $("navi_cover");
    // iPadの場合はマウスイベント追加
    if(Terminal.IPAD == false) {
      Use.Util.$observe(elmFlowBody, "mousedown", function(evt) {
        own.$doMousedownFlowSetMouseInfo(evt);
      });
      Use.Util.$observe(elmFlowBody, "mousemove", function(evt) {
        own.$doMousemoveFlowBody(evt);
      });
      Use.Util.$observe(elmFlowBody, "mouseup",own.$doMouseupResetMouseInfo);
      Use.Util.$observe(elmFlowBody, "mouseout",own.$doMouseupResetMouseInfo);
      
      Use.Util.$observe(elmNaviCover, "mousedown", function(evt) {
        own.$doMousedownNaviSetMouseInfo(evt);
        Event.$stop(evt);
      });
      Use.Util.$observe(elmNaviCover, "mousemove", function(evt) {
        own.$doMousemoveView(evt);
        Event.$stop(evt);
      });
      Use.Util.$observe(elmNaviCover, "mouseup",own.$doMouseupResetMouseInfo);
      Use.Util.$observe(elmNaviCover, "mouseout",own.$doMouseupResetMouseInfo);
      
      Use.Util.$observe(elmNaviTitle, "click",own.$doClickOverviewSwitchLnk);
      Use.Util.$observe(elmNaviExpand, "click",own.$doClickOverviewSwitchLnk);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 診断フローのスクロール位置指定
 * @param {number} nPosX X軸
 * @param {number] nPosY Y軸
 */
Use.Contents.$setFlowBodyPostion = function(nPosX, nPosY) {
  var METHODNAME = "Use.Contents.$setFlowBodyPostion";
  try {
    var elmFlowBody = null;
    var elmFlowFrame = null;
    // iPad以外場合
    if(Terminal.IPAD == false) {
      elmFlowBody = $("flow_body");
      Element.$setStyle(elmFlowBody, "margin-left:" + nPosX + "px;");
      Element.$setStyle(elmFlowBody, "margin-top:" + nPosY + "px;");
    // iPadの場合
    } else {
      elmFlowFrame = $("flow_frame");
      elmFlowFrame.scrollLeft = nPosX * -1;
      elmFlowFrame.scrollTop = nPosY * -1;
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * 全体図の赤枠に座標を判定
 * @param {object} own 診断フロークラス
 * @param {number} nPosX X軸
 * @param {number] nPosY Y軸
 */
Use.Contents.$setViewPostion = function(own, nPosX, nPosY) {
  var METHODNAME = "Use.Contents.$setViewPostion";
  try {
    var objPos = {};
    var elmView = null;
    
    // iPad以外の場合
    if(Terminal.IPAD == false) {
      elmView = $("view");
      objPos = own.$viewMoveRange(nPosX, nPosY);
      Element.$setStyle(elmView, "left:" + objPos.x + "px;");
      Element.$setStyle(elmView, "top:" + objPos.y + "px;");
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * flow_frameエレメントのスクロール位置リセット
 */
Use.Contents.$resetFlowFrameScroll = function() {
  var METHODNAME = "Use.Contents.$resetFlowFrameScroll";
  try {
    var elmFlowFrame = null;
    
    // iPad以外の場合
    if(Terminal.IPAD == false) {
      elmFlowFrame = $("flow_frame");
      elmFlowFrame.scrollLeft = 0;
      elmFlowFrame.scrollTop = 0;
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

/**
 * コンテンツ表示エリアのイベント設定処理
 */
Use.Contents.$setWindowResizeEvent = function() {
  var METHODNAME = "Use.Contents.$setWindowResizeEvent";
  try {
    
    var myFunc = function() {
      // 現在の画面サイズが未取得の場合は取得する
      if(Contents.currHeight === null) {
        Contents.currHeight = Util.$getClientHeight(true);
      }
      var myStyle = { height: "" };
      var elmH = 0;
      var curH = Util.$getClientHeight(true);
      var rate = curH - Contents.currHeight;
      var wrapper = null;
      
      // rateが0以外の場合はサイズ設定を行う
      if(rate) {
        wrapper = $("wrapper");
        elmH = (!Util.$isUndefined(wrapper._currHeight)) ?
            wrapper._currHeight : parseInt(
            Element.$getStyle(wrapper, "height").replace("px", ""), 10);
        // 対象エレメントのスタイルがある場合は取得高さ+差分を、無い場合は
        // 0を設定する
        elmH = !isNaN(elmH) ? elmH + rate : 0;
        // 対象エレメントのサイズを隠し属性で保持
        wrapper._currHeight = elmH;
        // 0未満になった場合は0にする
        if(elmH < 0) {
          elmH = 0;
        }
        myStyle.height = elmH + "px";
        Element.$setStyle(wrapper, myStyle)
        
        Contents.currHeight = curH;
        Element.$redraw(wrapper);
      }
    };
    Use.Util.$observe(window, "load", function() {
      if(Terminal.IPAD == true) {
        // iPadの場合、縦横のサイズを指定したクラスを追加
        Element.$addClassName($("wrapper"),"wrapper_iPad");
      }else{
        // iPad以外の場合、リサイズ処理を追加
        Use.Util.$observe(window,"resize",myFunc);
        myFunc();
      }
    });
    
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

