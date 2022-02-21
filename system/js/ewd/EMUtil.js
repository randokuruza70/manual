/*!----------------------------------------------------------------------------
 * Copyright(c) 2012 TOYOTA MOTOR CORPORATION. All right reserved.
 * Last Update: 2015/04/02
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
 * For details, see the Prototype web site: http:
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
 * More information: http:
 *
 */



var EMUtil = {};


EMUtil.DEBUGFLAG = true;


EMUtil.IS_LOCAL = false;


EMUtil.callbackSystemError = null;


EMUtil.$init = function(isLocal, callbackSystemError) {
  EMUtil.IS_LOCAL = isLocal;
  if(EMUtil.$isFunction(callbackSystemError)) {
    EMUtil.callbackSystemError = callbackSystemError;
  }
}


EMUtil.$try = function() {
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


function $EMA(args) {
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


EMUtil.$exec = function(text) {
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


EMUtil.$createXHR = function() {


  if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 10.0) {
    return EMUtil.$try(
        function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
        function() { return new ActiveXObject('Microsoft.XMLHTTP'); },
        function() { return new XMLHttpRequest(); }
      );
  } else if(EMUtil.IS_LOCAL && EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 7.0) {
    return EMUtil.$try(
        function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
        function() { return new ActiveXObject('Microsoft.XMLHTTP'); },
        function() { return new XMLHttpRequest(); }
      );
  } else {
    return EMUtil.$try(
      function() { return new XMLHttpRequest(); },
      function() { return new ActiveXObject('Msxml2.XMLHTTP'); },
      function() { return new ActiveXObject('Microsoft.XMLHTTP'); }
    );
  }
};


EMUtil.$createXML = function(tagName) {
  if(!tagName) {
    tagName = '';
  } else {

    var p = tagName.indexOf(':');
    if(p != -1) {
      tagName = tagName.substring(p + 1);
    }
  }

  var doc = null;
  if(EMBrowser.IE) {
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


EMUtil.$loadXML = function(url) {
  var doc = null;
  if(EMBrowser.WEBKIT) {
    var xhr = EMUtil.$createXHR();
    xhr.open('GET', url, false);
    xhr.send(null);
    doc = xhr.responseXML;
  } else {
    doc = EMUtil.$createXML();
    doc.async = false;
    try {
      doc.load(url);
    }catch(e) {


      doc = null;
    }
  }


  if(EMUtil.$isParseError(doc)) {
    doc = null;
  }
  return doc;
};


EMUtil.$parseXML = function(text) {
  var doc = null;
  if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 9.0) {
    if(EMUtil.IS_LOCAL) {
      doc = EMUtil.$createXML();
      doc.async = false;

      doc.validateOnParse = false;
      doc.resolveExternals = false;
      doc.loadXML(text);
    } else {
      doc = (new DOMParser()).parseFromString(text, 'text/xml');
    }
  } else if(EMBrowser.IE) {
    doc = EMUtil.$createXML();
    doc.async = false; 

    doc.validateOnParse = false;
    doc.resolveExternals = false;

    doc.loadXML(text);
  } else {
    doc = (new DOMParser()).parseFromString(text, 'text/xml');
  }


  if(EMUtil.$isParseError(doc)) {
    doc = null;
  }
  return doc;
};


EMUtil.$serializeXML = function(xmldoc) {
  if(typeof XMLSerializer != 'undefined') {
    try {
      return (new XMLSerializer()).serializeToString(xmldoc);
    }catch(e) {


      return '';
    }
  }
  else if(xmldoc.xml) {
    return xmldoc.xml;
  }



  return '';
};


EMUtil.$empty = function() {
};



EMUtil.$propcopy = function(src, des, deep) {
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

  var _copyValue = function(srcValue, deep) {
    var result = null;

    if(_isArray(srcValue) && deep > 1) {
      result = [];
      EMUtil.$propcopy(srcValue, result, deep - 1);

    } else if(_isHash(srcValue) && deep > 1) {
      result = {};
      EMUtil.$propcopy(srcValue, result, deep - 1);

    } else {
      result = srcValue;
    }
    return result;
  };


  if(_isUndefined(deep)) {
    deep = 1;
  }


  if(_isArray(src)) {
    var len = src.length;
    for(var i = 0; i < len; i++) {


      des[i] = _copyValue(src[i], deep);
    }

  } else {
    for(var prop in (src || {})) {
      des[prop] = _copyValue(src[prop], deep);
    }
  }

  return des;
};



EMUtil.$clone = function(obj) {
  return EMUtil.$propcopy(obj, {});
};


EMUtil.$toString = function(obj) {
  if(typeof obj === "undefined") {
    return 'undefined';
  }
  if(obj === null) {
    return 'null';
  }
  var result = [];
  var clone = EMUtil.$clone(obj);
  for(var prop in clone) {


    if(clone.hasOwnProperty(prop)) {
      result.push(prop + ':' + clone[prop]);
    }
  }
  return '[' + result.join(', ') + ']';
};


EMUtil.$toHTML = function(obj) {
  if(obj && obj.toHTML) {
    return obj.toHTML();
  }
  else if(obj == null) {
    return '';
  }
  return String(obj);
};


(function() {

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

  EMUtil.$propcopy({
    $isString : isString,
    $isArray  : isArray,
    $isNumber : isNumber
  }, EMUtil);
})();


EMUtil.$isElement = function(obj) {
  return !!(obj && obj.nodeType == 1);
};


EMUtil.$isFunction = function(obj) {
  return typeof obj === "function";
};


EMUtil.$isHash = function(obj) {
  return (typeof obj == 'object') && !EMUtil.$isFunction(obj.push);
};


EMUtil.$isUndefined = function(obj) {
  return typeof obj === "undefined";
};


EMUtil.$isXML = function(obj) {
  var documentElement = (obj ? obj.ownerDocument || obj : 0).documentElement;
  return documentElement ? documentElement.nodeName !== "HTML" : false;
};



EMUtil.$setTextBoxSelection = function(elm) {
  var range = null;
  

  if(EMBrowser.IE) {
    elm.focus();
    range = elm.createTextRange();
    range.move('character', 0);
    range.select();

  } else if(EMBrowser.GECKO) {
    elm.focus();
    elm.setSelectionRange(0, 0);

  } else if(EMBrowser.WEBKIT) {
    elm.setSelectionRange(0, 0);
  }
};



EMUtil.$toQueryParams = function(src) {

  var match = src.strip().match(/([^?#]*)(#.*)?$/);
  if(!match) {
    return {};
  }


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


      if(key in hash) {
        if(!EMUtil.$isArray(hash[key])) {

          hash[key] = [hash[key]];
        }

        hash[key].push(value);


      } else {

        hash[key] = value;
      }
    }
  }

  return hash;
};


EMUtil.$toQueryPair = function(key, value) {
  if(EMUtil.$isUndefined(value)) {
    return key;
  }
  if(value == null) {
    value = '';
  }
  return key + '=' + encodeURIComponent(value);
};


EMUtil.$toQueryString = function(hash) {
  var arrret = [];
  var encKey;
  for(var key in (hash || {})) {
    encKey = encodeURIComponent(key);
    if(EMUtil.$isArray(hash[key])) {
      for(var i = 0, length = hash[key].length; i < length; i++) {
        arrret.push(EMUtil.$toQueryPair(encKey, hash[key][i]));
      }
    } else {
      arrret.push(EMUtil.$toQueryPair(encKey, hash[key]));
    }
  }
  return arrret.join('&');
};


EMUtil.$isParseError = function(xmldoc) {

  function findParserErrorTag(xmldoc) {

    if(!xmldoc.documentElement
    || !xmldoc.documentElement.getElementsByTagName) {

      return false;
    }

    var tags = xmldoc.documentElement.getElementsByTagName('parsererror');

    return !!tags && tags.length > 0;
  }


  if(xmldoc == null) {
    return true;
  }


  if(xmldoc.parseError != null) {
    return (xmldoc.parseError.errorCode != 0);
  }








  return (xmldoc.documentElement == null) ||
         (xmldoc.documentElement.tagName == 'parsererror'
          && xmldoc.documentElement.namespaceURI ==
           'http://www.mozilla.org/newlayout/xml/parsererror.xml') ||
         (findParserErrorTag(xmldoc));
};


EMUtil.$offset = function(l, t) {
  var offset = [l, t];
  offset.left = l;
  offset.top  = t;
  return offset;
};


EMUtil.XPathExp = function(xpath) {
  this.xpath = xpath;
  this.exp   = null;






  if(typeof XPathEvaluator != 'undefined') {
    var x = new XPathEvaluator();
    this.exp = x.createExpression(xpath, null);
  }
};

EMUtil.XPathExp.prototype.getNodes = function(ctx) {
  if(this.exp) {

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

    try {
      var xmldoc = ctx.ownerDocument;
      if(xmldoc == null) {
        xmldoc = ctx;
      }
      xmldoc.setProperty('SelectionLanguage', 'XPath');
      if(xmldoc == ctx) {
        ctx = xmldoc.documentElement;
      }


      var result = ctx.selectNodes(this.xpath);
      var length = result.length;
      var a = new Array(length);
      while(length--) {
        a[length] = result[length];
      }
      return a;

    }
    catch(e) {
      throw "XPath feature not supported by this browser.";
    }
  }
};

EMUtil.XPathExp.prototype.getSingleNode = function(ctx) {
  if(this.exp) {

    var result = this.exp.evaluate(ctx,
                                   XPathResult.FIRST_ORDERED_NODE_TYPE,
                                   null);
    return result.singleNodeValue;
  } else {

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


EMUtil.$getNodes = function(ctx, xpath) {
  return (new EMUtil.XPathExp(xpath)).getNodes(ctx);
};


EMUtil.$getSingleNode = function(ctx, xpath) {
  return (new EMUtil.XPathExp(xpath)).getSingleNode(ctx);
};


EMUtil.$getNodeText = function(node) {
  var childs = node.childNodes;
  for(var i = 0, l = childs.length; i < l; i++) {

    if(childs[i].nodeType == 3) {
      return childs[i].nodeValue;
    }
  }

  return '';
};


EMUtil.$setNodeText = function(node, value) {
  var childs = node.childNodes;
  for(var i = 0, l = childs.length; i < l; i++) {

    if(childs[i].nodeType == 3) {

      childs[i].nodeValue = value;
      return;
    }
  }


  var resdoc = node.ownerDocument;
  var textNode = resdoc.createTextNode(value);
  node.appendChild(textNode);
};







EMUtil.$getAttr = function(node, attr) {
  return node.attributes.getNamedItem(attr);
};


EMUtil.$getAttrValue = function(node, attr) {
  var attrEl = EMUtil.$getAttr(node, attr);
  if(attrEl) {
    return attrEl.value;
  }
  return '';
};


EMUtil.$setAttrValue = function(node, attr, value) {
  var resdoc = node.ownerDocument;
  var attrNode = resdoc.createAttribute(attr);
  attrNode.nodeValue = value;
  node.attributes.setNamedItem(attrNode);
};






EMUtil.XSLT = function(xsldoc, paramexist) {

  if(EMUtil.$isString(xsldoc)) {

    if(EMBrowser.IE && paramexist) {
      var xsldoc_ft = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");

      xsldoc_ft.async = false;
      xsldoc_ft.resolveExternals = true;

      xsldoc_ft.load(xsldoc);
      xsldoc = xsldoc_ft;


    } else {
      xsldoc = EMUtil.$loadXML(xsldoc);
    }






  } else {

    if(EMBrowser.IE && paramexist) {
      var xsldoc_ft = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");

      xsldoc_ft.async = false;
      xsldoc_ft.resolveExternals = true;

      xsldoc_ft.loadXML(xsldoc.xml);
      xsldoc = xsldoc_ft;
    }

  }
  this.xsldoc = xsldoc;


  if(EMBrowser.IE) {

    if (paramexist) {
      var objTemp = new ActiveXObject("Msxml2.XSLTemplate");
      objTemp.stylesheet = xsldoc;
      this.processor_temp = objTemp.createProcessor();
    }





  } else {
    this.processor = new XSLTProcessor();
    this.processor.importStylesheet(this.xsldoc);
  }
};


EMUtil.XSLT.prototype.transform = function(xmldoc, element, args) {
  element = $EM(element);


  if(this.processor) {

    if(EMUtil.$isHash(args)) {
      for(var key in args) {
        this.processor.setParameter(null, key, args[key]);
      }
    }
    var fragment = this.processor.transformToFragment(xmldoc, document);
    element.innerHTML = "";
    element.appendChild(fragment);
  }

  else if(this.processor_temp) {


    if(EMUtil.$isHash(args)) {
      for(var key in args) {
        this.processor_temp.addParameter(key, args[key]);
      }
    }
    this.processor_temp.input = xmldoc;
    this.processor_temp.transform();
    element.innerHTML = this.processor_temp.output;

  }

  else if("transformNode" in xmldoc) {

    element.innerHTML = xmldoc.transformNode(this.xsldoc);
  }
  else {
    throw "XSLT is not supported in this browser.";
  }
};


EMUtil.$transformXML = function(xmldoc, xsldoc, element, args) {
  var paramexist = EMUtil.$isHash(args);
  (new EMUtil.XSLT(xsldoc, paramexist)).transform(xmldoc, element, args);
};



EMUtil.$preload = function(image) {
  var img;
  var src;

  if(EMUtil.$isString(image)) {
    img = new Image();
    img.src = image;
  }
  else if(EMUtil.$isElement(image)) {
    img = new Image();
    src = Element.$getStyle(image, 'background-image').replace(/url\((.+)\)/, '$1').unquote();
    img.src = src;
  }
};


EMUtil.$changeLang = function(lang, dict) {

  lang = lang || EMBrowser.LANG;


  if(!dict) {

    throw 'No literal dictionary specified.';

  }

  if(!dict[lang]) {

    if(!dict['en']) {

      throw 'No langage found in the dictionary: [' +  lang + ']';

    }
    lang = 'en';
  }


  var span = document.getElementsByClassName('trans');
  for(var i = 0, length = span.length; i < length; i++) {
    var element = $EM(span[i]);
    var literalKey;

    if(element._literalKey) {

      literalKey = element._literalKey;


    } else {

      literalKey = element.innerHTML;

      element._literalKey = literalKey;
    }


    if(dict[lang][literalKey]) {
      element.innerHTML = dict[lang][literalKey];
    } else {

      throw 'No literal found in the ' + lang + ' dictionary: [' + literalKey + ']';
    }
  }


  var btn = document.getElementsByClassName('trbtn');
  for(var i = 0, length = btn.length; i < length; i++) {
    var element = $EM(btn[i]);


    if(element.tagName.toLowerCase() != 'input'
    || !(/^(?:button|reset|submit)$/i.test(element.type))) {
      continue;
    }

    var literalKey;

    if(element._literalKey) {

      literalKey = element._literalKey;


    } else {

      literalKey = element.value;

      element._literalKey = literalKey;
    }


    if(dict[lang][literalKey]) {
      element.value = dict[lang][literalKey];
    } else {

      throw 'No literal found in the ' + lang + ' dictionary: [' + literalKey + ']';
    }
  }


  var img = document.getElementsByClassName('trimg');
  for(var i = 0, length = img.length; i < length; i++) {
    var element = $EM(img[i]);


    if(element.tagName.toLowerCase() != 'img') {
      continue;
    }

    var literalKeys = {};

    if(element._literalKeys) {

      literalKeys = element._literalKeys;


    } else {

      if(element.title) {
        literalKeys['title'] = element.title;
      }
      if(element.alt) {
        literalKeys['alt'] = element.alt;
      }

      element._literalKeys = literalKeys;
    }


    if(literalKeys['alt']) {
      if(dict[lang][literalKeys['alt']]) {
        element.alt = dict[lang][literalKeys['alt']];
      } else {

        throw 'No literal found in the ' + lang + ' dictionary: [' + literalKeys['alt'] + ']';
      }
    }
    if(literalKeys['title']) {
      if(dict[lang][literalKeys['title']]) {
        element.title = dict[lang][literalKeys['title']];
      } else {

        throw 'No literal found in the ' + lang + ' dictionary: [' + literalKeys['title'] + ']';
      }
    }
  }
}



EMUtil.WINDOW_SIZE_1 = 1;

EMUtil.WINDOW_SIZE_2 = 2;

EMUtil.WINDOW_SIZE_3 = 3;

EMUtil.WINDOW_SIZE_MAP = {
  WINXP : {






    IE    : [[1012,672],[810,636],[700,600]],
    IE8    : [[1012,650],[810,636],[700,600]],



    FF    : [[1016,672],[810,636],[700,600]],
    GC    : [[1016,676],[810,636],[700,600]]
  },
  WIN7  : {


    IE    : [[1004,632],[810,636],[700,600]],





    FF    : [[1008,662],[810,636],[700,600]],


    GC    : [[1008,665],[810,636],[700,600]]
  },


  OTHER : [[1012,672],[810,636],[700,600]]

};


EMUtil.CONTENTS_SIZE_MAP = {
  WINXP : {






    IE    : [483,497,497,494],
    IE8    : [461,475,475,472],



    FF    : [469,483,483,480],
    GC    : [490,504,504,501]
  },
  WIN7  : {


    IE    : [447,461,461,458],





    FF    : [471,485,482,482],


    GC    : [476,490,490,487]
  },


  OTHER : [483,497,497,494]

};



EMUtil.OTHER_CONTENTS_SIZE_MAP = {
  WINXP : {






    IE    : [464],
    IE8    : [441],



    FF    : [449],
    GC    : [470]
  },
  WIN7  : {


    IE    : [425],



    FF    : [439],

    GC    : [456]
  },


  OTHER : [464]

};


EMUtil.$setOpenUrlWindowType = function(windowSizeMap) {
  EMUtil.WINDOW_SIZE_MAP = windowSizeMap;
};

EMUtil.$createWindowOption = function(baseOption, windowSize) {
  var browserType = '';
  var osType = '';
  var ua = navigator.userAgent;
  var types = EMUtil.WINDOW_SIZE_MAP.OTHER;
  var result = baseOption;


  if(windowSize) {


    if(ua.match(/Win(dows )?NT 6\.1/)) {
      osType = 'WIN7';

    } else if(ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
      osType = 'WINXP';
    }



    if(EMBrowser.IE) {










      if (osType == 'WINXP') {
        if(EMBrowser.PRODUCT_VERSION == 8.0) {
          browserType = 'IE8';
        } else {
          browserType = 'IE';
        }
      } else {
    	browserType = 'IE';
      }



    } else if(EMBrowser.GECKO) {
      browserType = 'FF';

    } else if(EMBrowser.WEBKIT) {
      browserType = 'GC';
    }


    if(osType && browserType) {
      try {
        types = EMUtil.WINDOW_SIZE_MAP[osType][browserType];
      } catch(e) {
      }
    }


    if(result) {
      result += ',';

    } else {
      result = '';
    }

    result += 'width=' + types[windowSize - 1][0]
          + ',height=' + types[windowSize - 1][1];
  }

  return result;
};




EMUtil.$openUrl = function(url, target, option, windowSize) {
  var objwin = null;
  var isPdf = EMUtil.$isPdfUrl(url);

  var isSwf = EMUtil.$isSwfUrl(url);

  var isGif = EMUtil.$isGifUrl(url);

  if(isPdf) {
    target = '_blank';
  }
  option = EMUtil.$createWindowOption(option, windowSize);

  if(EMBrowser.IE) {
    objwin = window.open('about:blank', target, option);
    objwin.location = url;
  } else {
    objwin = window.open(url, target, option);
  }



  if(!isPdf && !isSwf && !isGif) {



    if(objwin != null) {



      if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 8.0) {
        objwin.opener = window;
      }

      objwin.blur();
      objwin.focus();
    }

  }
  return objwin;
};



EMUtil.$openForm = function(form, target, option, windowSize) {
  var form = $EM(form);
  var objwin = null;
  var isPdf = EMUtil.$isPdfUrl(form.action);

  if(isPdf) {
    target = '_blank';
  }
  option = EMUtil.$createWindowOption(option, windowSize);
  objwin = window.open('about:blank', target, option);
  form.target = target;
  form.submit();

  if(!isPdf) {


    if(objwin != null) {



      if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 8.0) {
        objwin.opener = window;
      }

      objwin.blur();
      objwin.focus();
    }

  }
  return objwin;
};





EMUtil.$setContentsSize = function(isOldBRM) {

  var browserType = '';
  var osType = '';
  var ua = navigator.userAgent;
  var types = EMUtil.CONTENTS_SIZE_MAP.OTHER;
  var myStyle = { height: "" };
 


  if(ua.match(/Win(dows )?NT 6\.1/)) {
    osType = 'WIN7';

  } else if(ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
    osType = 'WINXP';
  }


  if(EMBrowser.IE) {










    if (osType == 'WINXP') {
      if(EMBrowser.PRODUCT_VERSION == 8.0) {
        browserType = 'IE8';
      } else {
        browserType = 'IE';
      }
    } else {
  	browserType = 'IE';
    }



  } else if(EMBrowser.GECKO) {
    browserType = 'FF';

  } else if(EMBrowser.WEBKIT) {
    browserType = 'GC';
  }
  

  if(osType && browserType) {
    try {
      types = EMUtil.CONTENTS_SIZE_MAP[osType][browserType];
    } catch(e) {
    }
  }

  myStyle.height = types[0] + "px";
  Element.$setStyle($EM('tab_body_search_result'), myStyle);
  myStyle.height = types[1] + "px";
  Element.$setStyle($EM('tab_body_repair'), myStyle);
  Element.$setStyle($EM('tab_body_ncf'), myStyle);
  myStyle.height = types[2] + "px";
  Element.$setStyle($EM('tab_body_ewd'), myStyle);


  if(isOldBRM == true) {
    myStyle.height = types[3] + "px";
    Element.$setStyle($EM('tab_body_brm'), myStyle);
  } else {
    myStyle.height = types[1] + "px";
    Element.$setStyle($EM('tab_body_brm'), myStyle);
  }

  myStyle.height = types[3] + "px";



  Element.$setStyle($EM('tab_body_om'), myStyle);
  Element.$setStyle($EM('tab_body_wel'), myStyle);
  Element.$setStyle($EM('tab_body_res'), myStyle);
  Element.$setStyle($EM('tab_body_erg'), myStyle);
  Element.$setStyle($EM('tab_body_dm'), myStyle);

};



EMUtil.$setOtherContentsSize = function(elements) {
  var browserType = '';
  var osType = '';
  var ua = navigator.userAgent;
  var types = EMUtil.OTHER_CONTENTS_SIZE_MAP.OTHER;

  var Ctypes = EMUtil.CONTENTS_SIZE_MAP.OTHER;
  var myStyle = { height: "" };
  
  var elmH = 0;
  


  if(ua.match(/Win(dows )?NT 6\.1/)) {
    osType = 'WIN7';

  } else if(ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
    osType = 'WINXP';
  }


  if(EMBrowser.IE) {










    if (osType == 'WINXP') {
      if(EMBrowser.PRODUCT_VERSION == 8.0) {
        browserType = 'IE8';
      } else {
        browserType = 'IE';
      }
    } else {
  	browserType = 'IE';
    }



  } else if(EMBrowser.GECKO) {
    browserType = 'FF';

  } else if(EMBrowser.WEBKIT) {
    browserType = 'GC';
  }
  

  if(osType && browserType) {
    try {
      types = EMUtil.OTHER_CONTENTS_SIZE_MAP[osType][browserType];
      Ctypes = EMUtil.CONTENTS_SIZE_MAP[osType][browserType];
    } catch(e) {
    }
  }
  elmH = Element.$getHeight(parent.$EM(window.name));
  
  myStyle.height = (types[0] + elmH - Ctypes[3]) + "px";

  for(var i = 0; i < elements.length; i++) {
    Element.$setStyle(elements[i], myStyle);
  }

};


EMUtil.$isPdfUrl = function(url) {
  var len = 0;
  var result = false;

  if(url && EMUtil.$isString(url)) {
    len = url.length;

    if(len >= 4) {

      if(url.substring(len - 4).toLowerCase() == '.pdf') {
        result = true;
      }
    }
  }
  return result;
};



EMUtil.$isSwfUrl = function(url) {
  var len = 0;
  var result = false;

  if(url && EMUtil.$isString(url)) {
    len = url.length;

    if(len >= 4) {

      if(url.substring(len - 4).toLowerCase() == '.swf') {
        result = true;
      }
    }
  }
  return result;
};



EMUtil.$isGifUrl = function(url) {
  var len = 0;
  var result = false;

  if(url && EMUtil.$isString(url)) {
    len = url.length;

    if(len >= 4) {

      if(url.substring(len - 4).toLowerCase() == '.gif') {
        result = true;
      }
    }
  }
  return result;
};



EMUtil.$alert = function(message) {
  if(EMUtil.DEBUGFLAG) {
    alert(message);
  }
};

EMUtil.$eAlert = function(e) {

  if(e instanceof EMException) {
    EMUtil.$alert(e.message);
  }
  else if(e instanceof Error) {
    EMUtil.$alert(e.message);
  } else {
    EMUtil.$alert(e);
  }
};




EMUtil.$getClientWidth = function(isStrict) {
  if(EMBrowser.IE) {
    if (isStrict == undefined || isStrict == true){
      return document.documentElement.clientWidth;
    } else {
      return document.body.clientWidth;
    }
  } else {
  	return window.innerWidth;
  }
};


EMUtil.$getClientHeight = function(isStrict) {
  if(EMBrowser.IE) {
    if (isStrict == undefined || isStrict == true){
      return document.documentElement.clientHeight;
    } else {
      return document.body.clientHeight;
    }
  } else {
  	return window.innerHeight;
  }
};






EMUtil.$openIframe = function(targetID, srcPath, frameBorder, className, scrolling, complete) {

  var iframeObj = null;
  var target = $EM(targetID);
  var head = null;
  if(target) {
    target.innerHTML = '';
    head = document.createElement('div');
    head.id = targetID + '_head';
    target.appendChild(head);

    if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0){
      iframeObj = document.createElement('<iframe name="' + targetID + '_contents"></iframe>');

    }else{
      iframeObj = document.createElement('iframe');
      iframeObj.name = targetID + '_contents';
    }

    if(scrolling) {
      iframeObj.scrolling = scrolling;
    }

    if(frameBorder) {
      iframeObj.frameBorder = frameBorder;
    }

    if(className) {
      iframeObj.className = className;
    }
    target.appendChild(iframeObj);


    if(EMUtil.$isFunction(complete)) {
      Event.$observe(iframeObj, 'load', complete);
    }

    iframeObj.src = srcPath;
    iframeObj.id = targetID + '_contents';
    



    if(EMUtil.isStopMouseContextMenu) {
      iframeObj.oncontextmenu = (function() {return false;});

      if(EMBrowser.IE) {
        iframeObj.document.oncontextmenu = (function() {return false;});

      } else if(EMBrowser.GECKO) {
        iframeObj.contentDocument.addEventListener(
            'contextmenu',
            (function(event) {event.preventDefault();}),
            false);

      } else {
        iframeObj.contentDocument.addEventListener(
            'contextmenu',
            (function() {return false;}),
            false);
      }
    }

  }
  return iframeObj;
};


EMUtil.$closeIframe = function(targetID) {
  var target = $EM(targetID);
  if(target) {
    target.innerHTML = '';
  }
}



EMUtil.$jumpAnchor = function(targetID) {
  var aEl = null;
  var bodyEl = null;


  if($EM(targetID)) {

    if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) {
      aEl = document.createElement('a');
      aEl.href = '#' + targetID;
      aEl.style.display = 'none';
      bodyEl = $$EM("body")[0];
      bodyEl.appendChild(aEl);
      aEl.click();
      bodyEl.removeChild(aEl);
      bodyEl = null;
      aEl = null;


    } else {


      window.location.hash = null;

      window.location.hash = targetID;
    }
  }
};



EMUtil.$jumpAnchorIE = function(targetID) {

  if(EMBrowser.IE) {
    EMUtil.$jumpAnchor(targetID);
  }
};



EMUtil.$canUsePlugin = function(activeXName, pluginName) {

  if(EMBrowser.IE) {
    try {
      var obj = new ActiveXObject(activeXName);
    } catch (e) {
      return false;
    }
    return true;

  } else {
    var sample = navigator.plugins[pluginName];
    if(sample == null) {
      return false;
    }
    return true;
  }
};


EMUtil.$createPluginElement = function(activeXHTML, pluginHTML) {
  var divEl = new Element('div');

  divEl.style.width = '0px';
  divEl.style.height = '0px';


  if(EMBrowser.IE) {
    divEl.innerHTML = activeXHTML;

  } else {
    divEl.innerHTML = pluginHTML;
  }
  return divEl;
};



EMUtil.$closeWindow = function() {

  if(window.opener && window.opener != window) {
    window.close();

  } else if(window.parent && window.parent != window) {
    window.close();

  } else {

    if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) {
      window.opener = window;
      window.close();

    } else if(EMBrowser.IE) {
      window.open('', '_parent');
      window.close();

    } else if(EMBrowser.WEBKIT) {
      window.open(location.href, '_self');
      window.close();

    } else if(EMBrowser.GECKO) {
      window.open(location.href, '_self');
      window.close();

    } else {
      window.close();
    }
  }
};



EMUtil.isStopMouseContextMenu = false;


EMUtil.$stopMouseContextMenu = function() {
  var iframes = $$EM('iframe');
  var len = iframes.length;

  EMUtil.isStopMouseContextMenu = true;

  document.oncontextmenu = (function() {return false;});

  for(var i = 0; i < len; i++) {

    if(EMBrowser.IE) {
      iframes[i].document.oncontextmenu = (function() {return false;});

    } else if(EMBrowser.GECKO) {
      iframes[i].contentDocument.addEventListener(
          'contextmenu',
          (function(event) {event.preventDefault();}),
          false);

    } else {
      iframes[i].contentDocument.addEventListener(
          'contextmenu',
          (function() {return false;}),
          false);
    }
  }
};




EMUtil.isWindowDisabled = false;


EMUtil.isAreaDisabled = false;



(function() {
  
  var _windowDisabled = false;















  
  var _resizeOverlay = function() {
    var result = document.documentElement.scrollHeight >
        document.documentElement.offsetHeight ?
        document.documentElement.scrollHeight + 'px' :
        document.documentElement.offsetHeight + 'px';
    return result;
  };


  
  var _keyDownListener = function(evt) {
    Event.$stop(evt);
  };




  var OVERLAY_OPACITY = 0.0;


  
  var disableWindow = function() {
    var overlay = $EM('window_overlay');
    var overlay2 = $EM('window_overlay2');
    var body =$$EM('body')[0];
    var html = $$EM('html')[0];

    if(!_windowDisabled) {



      EMUtil.isWindowDisabled = true;

      document.body.style.cursor = 'wait';





      if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 8.0) {


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
              $EM('window_overlay').style.height = height;
              $EM('window_overlay2').style.height = height;
            });
        body.appendChild(overlay2);
        body.appendChild(overlay);

        Element.$setOpacity(overlay, OVERLAY_OPACITY);

        Element.$show(overlay);
        Element.$show(overlay2);

      } else if(EMBrowser.GECKO) {

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

        Element.$setOpacity(overlay, OVERLAY_OPACITY);

        Element.$show(overlay);

      } else {

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

        Element.$setOpacity(overlay, OVERLAY_OPACITY);

        Element.$show(overlay);
      }












      body._tabIndex = body.tabIndex;


      body.tabIndex = 1;



      Event.$observe(document, 'keydown', _keyDownListener);









































      

      _windowDisabled = true;
    }
  };

  
  var enableWindow = function() {
    var overlay = $EM('window_overlay');
    var overlay2 = $EM('window_overlay2');
    var html = $$EM('html')[0];

    if(_windowDisabled) {

      _windowDisabled = false;
      





























      Event.$stopObserving(document, 'keydown', _keyDownListener);


      var body = $$EM('body')[0];
      body.tabIndex = body._tabIndex;

      

      if(overlay) {
        Element.$hide(overlay);
      }

      if(overlay2) {
        Element.$hide(overlay2);
      }




      



      EMUtil.isWindowDisabled = false;

      if(EMUtil.isAreaDisabled == false) {

        document.body.style.cursor = 'auto';
      }

    }
  };

  EMUtil.$propcopy({
    $disableWindow  : disableWindow,
    $enableWindow   : enableWindow
  }, EMUtil);
})();


EMUtil.disableAreas = null;
(function() {
  var _disableEventListener = function(evt) {
    Event.$stop(evt);
  };
  
  var _disableArea = function(elements) {
    var len = 0;

    if(EMUtil.$isArray(elements)) {

      EMUtil.$enableArea();

      EMUtil.isAreaDisabled = true;

      document.body.style.cursor = 'wait';

      EMUtil.disableAreas = elements;
      len = elements.length;

      for(var i = 0; i < len; i++) {
        Event.$observe(elements[i], 'keydown', _disableEventListener);
        Event.$observe(elements[i], 'click', _disableEventListener);
      }
      
    }
  };
  
  var _enableArea = function() {
    var elements = EMUtil.disableAreas;
    var len = 0;

    if(EMUtil.$isArray(elements)) {
      len = elements.length;

      for(var i = 0; i < len; i++) {
        Event.$stopObserving(elements[i], 'keydown', _disableEventListener);
        Event.$stopObserving(elements[i], 'click', _disableEventListener);
      }
    }
    EMUtil.disableAreas = null;
    elements = null;


    EMUtil.isAreaDisabled = false;

    if(EMUtil.isWindowDisabled == false) {

      document.body.style.cursor = 'auto';
    }

  };
  EMUtil.$propcopy({
    $disableArea    : _disableArea,
    $enableArea     : _enableArea
  }, EMUtil);
})();



EMUtil.$getIndexOfArray = function(ary, obj) {
  var len = 0;

  if(ary) {

    if(EMUtil.$isArray(ary)) {

      if(EMBrowser.IE) {

        for(var i = 0, len = ary.length; i < len; i++) {

          if(ary[i] === obj) {
            return i;
          }
        }

      } else {
        return ary.indexOf(obj);
      }
    }
  }
  return -1;
};


(function() {

  var _isShortCutOptionsSet = false;


  var _shortCutOptions = {};

  
  var _stopKeyEvent = function(evt) {
    Event.$stop(evt);




  };

  
  var _keyDownHandler = function(evt) {
    var keyCode = 0;

    if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 8.0) {
      evt = window.event ? window.event : evt;
    }
    keyCode = Event.$getKeyCode(evt);


    if(_shortCutOptions.openNewWindowByLink) {

      if(!evt.ctrlKey && evt.shiftKey && keyCode === Event.KEY_RETURN) {
        _stopKeyEvent(evt);
        return false;
      }
    }

    if(_shortCutOptions.openNextTabByLink) {
      if((EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 8.0)
          || EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if(evt.ctrlKey && !evt.shiftKey && keyCode === Event.KEY_RETURN) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.openPrevTabByLink) {
      if((EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 8.0)
          || EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if(evt.ctrlKey && evt.shiftKey && keyCode === Event.KEY_RETURN) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.cloneTab) {
      if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 8.0) {

        if(evt.ctrlKey && keyCode === 75) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.restorePrevTab) {
      if(EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if(evt.ctrlKey && evt.shiftKey && keyCode === 84) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.restorePrevWindow) {
      if(EMBrowser.GECKO) {

        if(evt.ctrlKey && evt.shiftKey && keyCode === 78) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.updatePage) {

      if(keyCode === 116 || (evt.ctrlKey && keyCode === 82)) {
        _stopKeyEvent(evt);
        return false;
      }
    }


    if(_shortCutOptions.updatePageForce) {
      if(EMBrowser.IE) {

        if(evt.ctrlKey && keyCode === 116) {
          _stopKeyEvent(evt);
          return false;
        }
      } else if(EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if((evt.ctrlKey && evt.shiftKey && keyCode === 82)
            || (evt.ctrlKey && keyCode === 116)) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.cancelDownload) {

      if(keyCode === 27) {
        _stopKeyEvent(evt);
        return false;
      }
    }

    if(_shortCutOptions.nextPage) {
      if(EMBrowser.IE) {

        if(evt.altKey && keyCode === 39) {
          _stopKeyEvent(evt);
          return false;
        }
      } else if(EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if((evt.altKey && keyCode === 39)
            || (evt.shiftKey && keyCode === Event.KEY_BACKSPACE)) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.prevPage) {

      if(evt.altKey && keyCode === 37) {
        _stopKeyEvent(evt);
        return false;
        

      } else if(keyCode === Event.KEY_BACKSPACE) {
        var srcEl = evt.srcElement ? evt.srcElement : evt.originalTarget;
        var isTextBox = false;
        var tagName = srcEl.tagName.toLowerCase();

        var isReadOnly = srcEl.readOnly;

        if(tagName == 'textarea' && isReadOnly == false) {
          isTextBox = true;

        } else if(tagName == 'input') {
          var type = srcEl.type.toLowerCase();

          if(!type) {
            isTextBox = true;

          } else if(type == 'text' && isReadOnly == false) {
            isTextBox = true;
          }
        }


        if(!isTextBox) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.contextMenu) {

      if(evt.shiftKey && keyCode === 121) {
        _stopKeyEvent(evt);
        return false;
      }
    }

    if(_shortCutOptions.showFavorites) {
      if(EMBrowser.IE) {

        if(evt.ctrlKey && keyCode === 73) {
          _stopKeyEvent(evt);
          return false;
        }
      } else if(EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if((evt.ctrlKey && keyCode === 66)
            || (evt.ctrlKey && keyCode === 73)) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.addPageToFavorite) {

      if(evt.ctrlKey && keyCode === 68) {
        _stopKeyEvent(evt);
        return false;
      }
    }

    if(_shortCutOptions.addAllTabsToFavorite) {
      if(EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if(evt.ctrlKey && evt.shiftKey && keyCode === 68) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.showSource) {
      if(EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if(evt.ctrlKey && keyCode === 85) {
          _stopKeyEvent(evt);
          return false;
        }
      }
    }

    return true;
  };

  
  var _mouseWheelHandler = function(evt) {
    var delta = 0;

    if(EMBrowser.IE) {
      evt = window.event ? window.event : evt;
    }

    if(evt.wheelDelta) {
      delta = evt.wheelDelta / 120;

    } else if(evt.detail) {
      delta = -evt.detail;
    }

    if(_shortCutOptions.nextPage) {

      if(evt.shiftKey && delta > 0) {
        Event.$stop(evt);
        return false;
      }
    }

    if(_shortCutOptions.prevPage) {
      if(evt.shiftKey && delta < 0) {
        Event.$stop(evt);
        return false;
      }
    }

    return true;
  };

  
  var _mouseClickHandler = function(evt) {

    if(EMBrowser.IE) {
      evt = window.event ? window.event : evt;
    }

    if(_shortCutOptions.openNewWindowByLink) {

      if(!evt.ctrlKey && evt.shiftKey) {
        Event.$stop(evt);
        return false;
      }
    }

    if(_shortCutOptions.openNextTabByLink) {
      if((EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 8.0)
          || EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if(evt.ctrlKey && !evt.shiftKey) {
          Event.$stop(evt);
          return false;
        }
      }
    }

    if(_shortCutOptions.openPrevTabByLink) {
      if((EMBrowser.IE && EMBrowser.PRODUCT_VERSION >= 8.0)
          || EMBrowser.WEBKIT || EMBrowser.GECKO) {

        if(evt.ctrlKey && evt.shiftKey) {
          Event.$stop(evt);
          return false;
        }
      }
    }

    return true;
  };

  
  var stopShortCut = function(options) {

    if(options) {
      _shortCutOptions = options;

      if(!_isShortCutOptionsSet) {
        var _keyDownFunc = null;
        var _mouseWheelFunc = null;
        var _mouseClickFunc = null;


        if(EMUtil.$isFunction(EMUtil.callbackSystemError)) {
          _keyDownFunc = (function(evt) {
            try {
              return _keyDownHandler.apply(this, [evt]);
            } catch(e) {
              EMUtil.callbackSystemError(e);
            }
          });
          _mouseWheelFunc = (function(evt) {
            try {
              return _mouseWheelHandler.apply(this, [evt]);
            } catch(e) {
              EMUtil.callbackSystemError(e);
            }
          });
          _mouseClickFunc = (function(evt) {
            try {
              return _mouseClickHandler.apply(this, [evt]);
            } catch(e) {
              EMUtil.callbackSystemError(e);
            }
          });

        } else {
          _keyDownFunc = _keyDownHandler;
          _mouseWheelFunc = _mouseWheelHandler;
          _mouseClickFunc = _mouseClickHandler;
        }
        

        Event.$observe(document, 'keydown', _keyDownFunc);
        


        if(EMBrowser.GECKO) {
          window.addEventListener('DOMMouseScroll', _mouseWheelFunc, false);

        } else if(EMBrowser.IE) {
          Event.$observe(document, 'mousewheel', _mouseWheelFunc);

        } else {
          Event.$observe(window, 'mousewheel', _mouseWheelFunc);
        }


        Event.$observe(document, 'click', _mouseClickFunc);

        _isShortCutOptionsSet = true;
      }
    }
  };

  
  var handleShortCut = function(eventName, evt) {
    var result = true;
    var _keyDownFunc = null;
    var _mouseWheelFunc = null;
    var _mouseClickFunc = null;


    if(EMUtil.$isFunction(EMUtil.callbackSystemError)) {
      _keyDownFunc = (function(evt) {
        try {
          return _keyDownHandler.apply(this, [evt]);
        } catch(e) {
          EMUtil.callbackSystemError(e);
        }
      });
      _mouseWheelFunc = (function(evt) {
        try {
          return _mouseWheelHandler.apply(this, [evt]);
        } catch(e) {
          EMUtil.callbackSystemError(e);
        }
      });
      _mouseClickFunc = (function(evt) {
        try {
          return _mouseClickHandler.apply(this, [evt]);
        } catch(e) {
          EMUtil.callbackSystemError(e);
        }
      });

    } else {
      _keyDownFunc = _keyDownHandler;
      _mouseWheelFunc = _mouseWheelHandler;
      _mouseClickFunc = _mouseClickHandler;
    }


    if(eventName == 'keydown') {
      result = _keyDownFunc(evt);


    } else if(eventName == 'mousewheel') {
      result = _mouseWheelFunc(evt);


    } else if(eventName == 'click') {
      result = _mouseClickFunc(evt);
    }

    return result;
  };

  EMUtil.$propcopy({
    $stopShortCut : stopShortCut,
    $handleShortCut : handleShortCut
  }, EMUtil);
})();



EMUtil.$setIframeScroll = function(scrollStatus, overflowValue) {
  var scrollStyle = {};

  if(scrollStatus == 0) {
    scrollStyle.overflow = overflowValue;
    scrollStyle.overflowX = 'hidden';
    scrollStyle.overflowY = 'hidden';

    if(EMBrowser.WEBKIT) {
      scrollStyle.overflow = 'visible';
      scrollStyle.overflowX = 'visible';
      scrollStyle.overflowY = 'visible';
    }
    Element.$setStyle($$EM('html')[0], scrollStyle);

  } else if(scrollStatus == 1) {
    scrollStyle.overflow = overflowValue;
    scrollStyle.overflowX = 'hidden';

    if(EMBrowser.WEBKIT) {
      scrollStyle.overflow = 'visible';
      scrollStyle.overflowX = 'visible';
      scrollStyle.overflowY = 'visible';
    }
    Element.$setStyle($$EM('html')[0], scrollStyle);

  } else if(scrollStatus == 2) {
    scrollStyle.overflow = overflowValue;
    scrollStyle.overflowY = 'hidden';

    if(EMBrowser.WEBKIT) {
      scrollStyle.overflow = 'visible';
      scrollStyle.overflowX = 'visible';
      scrollStyle.overflowY = 'visible';
    }
    Element.$setStyle($$EM('html')[0], scrollStyle);

  } else if(scrollStatus == 3) {
    scrollStyle.overflow = overflowValue;

    if(EMBrowser.WEBKIT) {
      scrollStyle.overflow = 'visible';
      scrollStyle.overflowX = 'visible';
      scrollStyle.overflowY = 'visible';
    }
    Element.$setStyle($$EM('html')[0], scrollStyle);

  } else {

  }
};


(function() {
  var _globalLock = 0;
  var _size = { width: 0, height: 0 };
  var _useResizeAgent = false;
  
  
  var _loop = function() {

    if(!_globalLock++) {
      var _getBaseWindow = function(curWin) {

        if(curWin !== curWin.parent) {
          return _getBaseWindow(curWin.parent);

        } else {
          return curWin;
        }
      };
      var baseWindow = _getBaseWindow(window);
      var size = Element.$getDimensions(baseWindow.document.body);

      if(_size.width !== size.width || _size.height !== size.height) {
        _size = size;
        Event.$fireEvent(document.body, 'resize');
      }

      setTimeout(function() {
        _globalLock = 0;
      }, 0);
    }

    if(_useResizeAgent) {
      setTimeout(_loop, 100);
    }
  };
  
  
  var _startResizeAgent = function() {
    _globalLock = 0;
    _useResizeAgent = true;

    if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) {
      setTimeout(_loop, 100);
    }
  };
  
  
  var _stopResizeAgent = function() {
    _useResizeAgent = false;
  };
  
  EMUtil.$propcopy({
    $startResizeAgent : _startResizeAgent,
    $stopResizeAgent  : _stopResizeAgent
  }, EMUtil);
})();



EMUtil.isPrinting = false;

EMUtil.$print = function() {
  EMUtil.isPrinting = true;


  if(EMBrowser.GECKO == true) {

    Element.$addClassName($EM("wrapper"), "modeless_wrapper_print");
  }

  window.print();
  EMUtil.isPrinting = false;
};




EMUtil.$printPreview = function() {
  var sWebBrowserCode = '';
  var objWebBrowser = null;


  if(EMBrowser.ACTIVEX == false || document.body.insertAdjacentHTML == null) {
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




EMUtil.$printLayout = function() {


  Use.EMUtil.$delay(
      function() {

        EMUtil.$insertElementStyle(EMUtil.$illustForPrint(), true);

        if(EMBrowser.GECKO == true) {
          EMUtil.$insertElementStyle(EMUtil.$cPtnTableForFF(), true);
        }

        EMUtil.$insertElementStyle(EMUtil.$cPtnFloatLeftForEndActBox(false), true);
        


        if(EMBrowser.METRO == true) {
          EMUtil.$insertElementStyle(
              {"1":"p.s1 span.titleText{width:550px!important;)}"}, true);
        }



        EMUtil.$insertElementStyle(EMUtil.$cPtnFloatLeft(), false);

        EMUtil.$cPtnFloatLeftForEndActBox(true);
        var myFunc = function() {
          EMUtil.$cPtnFloatLeftForEndActBox(true);
        }


        Use.EMUtil.$observe(window, "resize", myFunc);
      }, 
      0.2);

  

  if(!(EMBrowser.IE == true && EMBrowser.PRODUCT_VERSION <= 6.0)) {
    return;
  }
  
  var elmContents = $EM("contents");
  var elmContentsBody = $EM("contentsBody");
  var elmContentsBodyNew = null;
  var doc = EMUtil.Selector.$select("> *", elmContentsBody);
  var cnt = doc.length;
  
  var elmTable = document.createElement("table");
  var elmTbody = document.createElement("tbody");
  var elmTr = document.createElement("tr");
  var elmTd = document.createElement("td");
  
  Element.$setStyle(elmTable, "width: 100%; margin: 0px 0px 0px -1px;");
  Element.$setStyle(elmTd, "border-color: #F7F9F9; padding: 0px; vertical-align: top;");
  

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




EMUtil.$getErrorDescription = function(err) {
  var result = '';
  var _appendMessage = function(result, name, value) {

    if(!EMUtil.$isUndefined(value)) {
      result = result + '\n' + name + ':' + value;
    }
    return result;
  };

  if(err) {
    result = _appendMessage(result, 'name', err.name);
    result = _appendMessage(result, 'message', err.message);
    result = _appendMessage(result, 'number', err.number);
    result = _appendMessage(result, 'description', err.description);
    result = _appendMessage(result, 'filename', err.filename);
    result = _appendMessage(result, 'lineNumber', err.lineNumber);
    result = _appendMessage(result, 'stack', err.stack);

    if(result.length > 0) {
      result = result.substring(1);
    }
  }
  return result;
};



var Terminal={};

Terminal = (function(ua) {




  return{
    IPAD   : /iPad/.test(ua),
    TOUCH  : ua.indexOf('Touch') > -1
  };

})(window.navigator.userAgent);





var EMBrowser = {};

EMBrowser = (function(ua) {
  return {



    IE     : (!!window.ActiveXObject || (ua.indexOf('Trident')  > -1) ) && !window.opera,
    GECKO  : ua.indexOf('Gecko')  > -1 && ua.indexOf('KHTML') === -1 && ua.indexOf('Trident')  === -1,

    WEBKIT : ua.indexOf('WebKit') > -1
  };
})(window.navigator.userAgent);

(function(ua) {
  var b = null;
  var c = null;

  if(EMBrowser.IE) {


    if(ua.indexOf('MSIE')  > -1) {
      b = c = /MSIE\s+([^\);]+)(\)|;)/;
    }else {
      b = c = /rv\:([^\);]+)(\)|;)/;
    }

  }
  else if(EMBrowser.GECKO) {
    b = /rv\:([^\);]+)(\)|;)/;
    c = /Firefox\/(\S+)/
  }
  else if(EMBrowser.WEBKIT) {
    b = /WebKit\/(\S+)/;
    c = /Chrome\/(\S+)/;
  }

  if(b) {
    b = b.exec(ua);
    EMBrowser.ENGINE_VERSION = b ? b[1] : "";
  }
  if(c) {
    c = c.exec(ua);
    EMBrowser.PRODUCT_VERSION = c ? c[1] : "";

    EMBrowser.PRODUCT_VERSION = parseFloat(EMBrowser.PRODUCT_VERSION);

  }
  

  var isActiveX = false;
  try {

    isActiveX = !!new ActiveXObject("htmlfile");
  } catch(e) {
    isActiveX = false;
  }
  EMBrowser.ACTIVEX = isActiveX;







  if(EMBrowser.IE == true 
      && EMBrowser.PRODUCT_VERSION >= 10.0 
      && EMBrowser.ACTIVEX == false) {

    EMBrowser.METRO = true;
  } else {
    EMBrowser.METRO = false;
  }

})(window.navigator.userAgent);

(function(a, b, c) {
  EMBrowser.LANG = a ? a.substring(0,2) :
                 b ? b.substring(0,2) :
                 c ? c.substring(0,2) : 'en';

})(window.navigator.language,
   window.navigator.browserLanguage,
   window.navigator.systemLanguage);


(function() {
  if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) {
    try {
      document.execCommand('BackgroundImageCache', false, true);
    } catch(e) {
    }
  }
})();



function $EM(element) {
  if(arguments.length > 1) { 
    for(var i = 0, elements = [], length = arguments.length; i < length; i++) {
      elements.push($EM(arguments[i]));
    }
    return elements;
  }
  if(EMUtil.$isString(element)) {
    element = document.getElementById(element);
  }
  return Element.$extend(element);
}


var EMDomReady = {
  DOMREADY : false,
  HANDLED  : false,
  HANDLERS : [],
  TIMER    : null
};


EMDomReady.$add = function(handler) {


  if(EMDomReady.HANDLERS == null) {

    try {
      return handler.call();
    } catch(e) {
      if(EMUtil.$isFunction(EMUtil.callbackSystemError)) {
        EMUtil.callbackSystemError(e);
      } else {
        EMUtil.$eAlert(e);

        if(EMUtil.$isString(e)) {
          e = new Error(e);
        } else if(e instanceof EMException) {
          e = new Error(e.getMessage());
        }

        throw e;
      }
    }
  } else {
    EMDomReady.HANDLERS.push(function() {
        try {
          return handler.call();
        } catch(e) {
          if(EMUtil.$isFunction(EMUtil.callbackSystemError)) {
            EMUtil.callbackSystemError(e);
          } else {
            EMUtil.$eAlert(e);

            if(EMUtil.$isString(e)) {
              e = new Error(e);
            } else if(e instanceof EMException) {
              e = new Error(e.getMessage());
            }

            throw e;
          }
        }
      });
  }

};


(function() {
  function handle() {
    if(EMDomReady.HANDLED) {
      return;
    }
    if(EMDomReady.TIMER) {
      window.clearTimeout(EMDomReady.TIMER);
    }
    EMDomReady.HANDLED = true;

    if(EMDomReady.HANDLERS) {






      var handlers = EMDomReady.HANDLERS;
      for(var i = 0; EMUtil.$isFunction(handlers[i]); i++) {
        handlers[i].call();
      }
      EMDomReady.HANDLERS = null;


      for(; EMUtil.$isFunction(handlers[i]); i++) {
        handlers[i].call();
      }

    }
    EMDomReady.HANDLERS = null;
  }

  function detect() {
    if(EMDomReady.DOMREADY) {
      return;
    }
    EMDomReady.DOMREADY = true;




    if(document.addEventListener) {




      document.addEventListener('DOMContentLoaded', function() {
        document._removeEventListener('DOMContentLoaded', arguments.callee, false);
        handle();
      }, false);
    }
    else if(document.attachEvent) {

      document.attachEvent('onreadystatechange', function() {
        if(document.readyState === 'complete') {
          document.detachEvent('onreadystatechange', arguments.callee);
          handle();
        }
      });

      if(document.documentElement.doScroll && window == window.top) {
        (function() {
          if(EMDomReady.HANDLED) {
            return;
          }

          try {
            document.documentElement.doScroll('left');
          }
          catch(e) {
            EMDomReady.TIMER = setTimeout(arguments.callee, 0);
            return;
          }
          handle();
        })();
      }
    }
  }

  detect();
})();


(function() {
  var js = /EMUtil\.js(\?.*)?$/;
  var scripts = document.getElementsByTagName('script');
  for(var i = 0, l = scripts.length; i < l; i++) {
    var src = scripts[i].src;
    if(src.match(js)) {


      var includes = src.match(/\?.*cntl=([a-zA-Z][\w]*)/);
      if(includes) {

















        EMDomReady.$add(function() { 

          var obj = null;
          try {
            obj = eval(includes[1]);
          } catch(e) {
            obj = null;
          }

          if(obj != null) {
            eval(includes[1] + '.$init();');
          }
        });


      }
    }
  }
})();


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
    if(arguments.length < 2 && EMUtil.$isUndefined(arguments[0])) {
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

  EMUtil.$propcopy({
    bind                : bind,
    bindAsEventListener : bindAsEventListener,
    curry               : curry,
    delay               : delay,
    defer               : defer,
    methodize           : methodize
  }, Function.prototype);
})();



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

  EMUtil.$propcopy(element || {}, global.Element);
  if(element) {
    global.Element.prototype = element.prototype;
  }
})(this);


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













if(EMBrowser.IE) {
  Element._attributeTranslations.has = {};
  var arrattr = ['colSpan', 'rowSpan', 'vAlign', 'dateTime', 'accessKey',
                 'tabIndex', 'encType', 'maxLength', 'readOnly', 'longDesc',
                 'frameBorder'];
  var len = arrattr.length;
  for (var i = 0; i < len; i++) {
    Element._attributeTranslations.has[arrattr[i].toLowerCase()] = arrattr[i];
  }
}



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
    return $EMA(div.childNodes);
  }

  function getDimensions(element) { 
    element = $EM(element);

    var display = Element.$getStyle(element, 'display');


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
    element = $EM(element);
    if(!element) {
      return;
    }
    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  }

  function addClassName(element, className) {
    element = $EM(element);
    if(!element) {
      return;
    }
    if(!Element.$hasClassName(element, className)) {
      element.className += (element.className ? ' ' : '') + className;
    }
    return element;
  }

  function removeClassName(element, className) {
    element = $EM(element);
    if(!element) {
      return;
    }
    element.className = element.className.replace(
      new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
    return element;
  }

  function insert(element, insertions) {
    element = $EM(element);

    if(EMUtil.$isString(insertions)  ||
       EMUtil.$isNumber(insertions)  ||
       EMUtil.$isElement(insertions) ||
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

      if(EMUtil.$isElement(content)) {
        insert(element, content);
      } else {





        content = EMUtil.$toHTML(content);

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




      }
    }

    return element;
  }

  function writeAttribute(element, name, value) {
    element = $EM(element);
    var attributes = {};
    var t = Element._attributeTranslations.write;

    if(typeof name == 'object') {
      attributes = name;
    } else {
      attributes[name] = EMUtil.$isUndefined(value) ? true  : value;
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
    element = $EM(element);
    var elementStyle = element.style;
    if(EMUtil.$isString(styles)) {
      element.style.cssText += ';' + styles;
      return element;
    }
    for(var prop in styles) {
      if(prop == 'opacity') {
        Element.$setOpacity(element, styles[prop]);
      } else {



        elementStyle[(prop == 'float' || prop == 'cssFloat') ?
          (EMUtil.$isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') :
            prop] = styles[prop];
      }
    }
    return element;
  }

  function getStyle(element, style) {

    element = $EM(element);

    style = (style == 'float' ? 'cssFloat' : style.camelize());


    var value = element.style[style];


    if(!value || value == 'auto') {

      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }

    if(style == 'opacity') {
      return value ? parseFloat(value) : 1.0;
    }

    return value == 'auto' ? null : value;
  }

  function getStyle_IE(element, style) {

    element = $EM(element);

    style = (style == 'float' || style == 'cssFloat') ? 'styleFloat'
                                                      : style.camelize();


    var value = element.style[style];


    if(!value && element.currentStyle) {


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
    return Element.$getStyle($EM(element), 'opacity');
  }

  function setOpacity(element, value) {
    element = $EM(element);
    if(EMUtil.$isUndefined(value)) {
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
    element = $EM(element);
    if(EMUtil.$isUndefined(value)) {
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

    element = $EM(element);
    if(EMUtil.$isUndefined(value)) {
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


    if(EMBrowser.PRODUCT_VERSION <=9.0) {
      var filter = Element.$getStyle(element, 'filter'); 

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


    return element;
  }

  function visible(element) {
    return $EM(element).style.display != 'none';
  }

  function toggle(element) {
    element = $EM(element);
    Element[Element.$visible(element) ? '$hide' : '$show'](element);
    return element;
  }

  function hide(element) {
    element = $EM(element);
    element.style.display = 'none';
    return element;
  }


  function show(element, option) {
    element = $EM(element);
    if(option) {
      element.style.display = option;
    } else {
      element.style.display = '';
    }
    return element;
  }


  function remove(element) {
    element = $EM(element);
    element.parentNode.removeChild(element);
    return element;
  }

  function recursivelyCollect(element, property) {
    element = $EM(element);
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
    if(!(element = $EM(element).firstChild)) {
      return [];
    }
    while(element && element.nodeType != 1) {
      element = element.nextSibling;
    }
    if(element) {
      var a = [element];
      var b = Element.$nextSiblings($EM(element)); 
      for(var i = 0, l = b.length; i < l; i++) {
        a.push(b[i]);
      }
      return a;
    }
    return [];
  } 

  function descendantOf(element, ancestor) {
    element  = $EM(element);
    ancestor = $EM(ancestor);

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
      element = $EM(element);
      var n = document.createTextNode(' ');
      element.appendChild(n);
      element.removeChild(n);
    }
    catch(e) {
    }
  }

  function hasAttribute(element, attribute) {
    element = $EM(element);

    if(element.hasAttribute) {

      return element.hasAttribute(attribute);
    }



    attribute = Element._attributeTranslations.has[attribute] || attribute;
    var node = $EM(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  };


  function getPosition(el) {
    var __doc__ = document;

    var pos = el.getBoundingClientRect();
    var html = __doc__.documentElement;
    var body = __doc__.body;
    return { x:(pos.left + (body.scrollLeft || html.scrollLeft) - html.clientLeft)
           , y:(pos.top + (body.scrollTop || html.scrollTop) - html.clientTop) };
  };


  EMUtil.$propcopy({
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
    $getStyle             : EMBrowser.IE ? getStyle_IE : getStyle,
    $setOpacity           : EMBrowser.IE ? setOpacity_IE : 
                            (EMBrowser.WEBKIT ? setOpacity_WEBKIT : setOpacity),
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

    $getPosition          : getPosition

  }, Element);
})();

Element.$extend = (function() {

  function extendElementWith(element, methods, override) {
    override = !!override;
    for(var prop in methods) {
      var value = methods[prop];
      if(EMUtil.$isFunction(value) && (override || !(prop in element))) {
        element[prop] = value.methodize();
      }
    }
  }

  var extend = function(element) {




    if(!element
    || typeof element._extended != 'undefined'
    || element.nodeType != 1
    || element == window) {
      return element;
    }


    if(element.addEventListener) {

      element._addEventListener = element.addEventListener;
      element._removeEventListener = element.removeEventListener;


      if(!EMBrowser.GECKO || element.tagName != 'EMBED') {

        extendElementWith(
          element,
          {
            addEventListener    : Element.WrapListener.$addEventListener,
            removeEventListener : Element.WrapListener.$removeEventListener
          }, true);
      }

    }
    else if(element.attachEvent) {




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


    element._extended = EMUtil.$empty;

    return element;
  };

  return extend;
})();



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




Element.$redraw = function(element, isForce) {
  if((EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) || isForce) {
    element = $EM(element);
    var n = document.createTextNode(' ');
    var _redraw = function(dummy) {
      dummy.parentNode.removeChild(dummy);
    };
    var _curry = _redraw.curry(n);
    element.appendChild(n);
    _curry.defer();
  }
};



if(!document.getElementsByClassName) {
  Element.$getElementsByClassName = (function() {
    function blank(str) {

      return /^[\s　]*$/.test(str);
    }
    function iter(name) {

      return blank(name) ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
    }
    function spaceSplit(str) {

      if(!EMUtil.$isString(str)) {
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

          var cond = /\s/.test(className) ? makeCond(spaceSplit(className)) : iter(className);
          return cond ?
            function(expression, parentElement) {
              var results = [];
              var query = document.evaluate(
                expression,
                $EM(parentElement) || document,
                null,
                window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null);
              for(var i = 0, length = query.snapshotLength; i < length; i++) {


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


            var nodes = $EM(element).getElementsByTagName('*');
            className = ' ' + className + ' ';

            for (var i = 0, ccn, child; child = nodes[i]; i++) {

              if(child.className && (ccn = ' ' + child.className + ' ')
              && (ccn.indexOf(className) > -1 || (classNames && allCheck(classNames, ccn)))) {



                elements.push(child);
              }
            }
            return elements;
          };

    return function(parentElement, className) {
      return _getElementsByClassName($EM(parentElement), className);
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

        for(var i = 0, length = respondersForEvent.length; i < length; i++) {

          if(respondersForEvent[i].handler === handler) {

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


    if(f) {
      responder = function(event) {


        if(typeof Event !== "undefined") {

          if(EMBrowser.IE) {
            event = window.event ? window.event : event;
          }

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
            EMUtil.$eAlert(e);
            throw e;
          }
        }

      };
    } else {
      responder = function(event) {


        if(typeof Event !== "undefined") {

          if(EMBrowser.IE) {
            event = window.event ? window.event : event;
          }

          Event.$extend(event, element);
          try {
            handler.call(element, event);
          }
          catch(e) {
            EMUtil.$eAlert(e);
            throw e;
          }
        }

      };
    }


    responder.handler = handler;
    respondersForEvent.push(responder);

    return responder;
  }

  function addEventListener(element, eventName, handler, useCapture) {
    element = $EM(element);

    var responder = _createResponder(element, eventName, handler);


    if(!responder) {

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
    element = $EM(element);

    var eventRegistry = element.eventRegistry;
    if(!eventRegistry) {
      return element;
    }


    var _isSameFunction = function(current, target) {
      var result = false;
      if(EMUtil.$isFunction(current) && EMUtil.$isFunction(target)) {
        if(current === target) {
          result = true;
        } else {
          result = _isSameFunction(current._baseFunc, target);
        }
      }
      return result;
    };



    for(var keyEventName in eventRegistry) {


      if(!eventName || keyEventName == eventName) {
        var respondersForEvent = eventRegistry[keyEventName];




        for(var i = respondersForEvent.length - 1; i >= 0; i--) {





          if(!handler || _isSameFunction(respondersForEvent[i].handler, handler)) {

            var responder = respondersForEvent[i];
            var actualEventName = _getDOMEventName(keyEventName);
            if(element._removeEventListener) {
              element._removeEventListener(actualEventName, responder, false);
            } else {
              element.detachEvent("on" + actualEventName, responder);
            }


            if(handler) {
              if(respondersForEvent.length >= 2) {


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


                delete eventRegistry[keyEventName];
              }


              return element;
            }
          }
        }


        if(!handler) {

          delete eventRegistry[keyEventName];
        }
      }
    }

    return element;
  }

  EMUtil.$propcopy({
    $addEventListener    : addEventListener,
    $removeEventListener : removeEventListener
  }, Element.WrapListener);
})();

(function() {
  if(document.addEventListener) {
    document._addEventListener = document.addEventListener;
    document._removeEventListener = document.removeEventListener;
  }
  EMUtil.$propcopy({
    addEventListener    : Element.WrapListener.$addEventListener.methodize(),
    removeEventListener : Element.WrapListener.$removeEventListener.methodize()
  }, document);

  if(window.addEventListener) {
    window._addEventListener = window.addEventListener;
    window._removeEventListener = window.removeEventListener;
  }
  EMUtil.$propcopy({
    addEventListener    : Element.WrapListener.$addEventListener.methodize(),
    removeEventListener : Element.WrapListener.$removeEventListener.methodize()
  }, window);
})();



var EMForm = {};
(function() {
  
  function serializeElements(elements, options) {

    if(typeof options != 'object') {
      options = { hash: !!options };
    }

    else if(EMUtil.$isUndefined(options.hash)) {
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

      if(!element.disabled && element.name) {
        key = element.name;
        value = EMField.$getValue(element);







        if(value != null && element.type != 'file'
        && (element.type != 'submit'
         || (!submitted && submit !== false && (!submit || key == submit)
          && (submitted = true)))) {

          if(key in data) {

            if(!EMUtil.$isArray(data[key])) {
              data[key] = [data[key]];
            }
            data[key].push(value);

          } else {
            data[key] = value;
          }
        }
      }
    }

    return options.hash ? data : EMUtil.$toQueryString(data);
  }

  
  function serialize(form, options) {
    return serializeElements(getElements(form), options);
  }

  
  function getElements(form) {

    var elements = $EM(form).getElementsByTagName('*');
    var element;
    var arr = [];
    var serializers = EMField.Serializers;

    for(var i = 0; element = elements[i]; i++) {

      if(serializers[element.tagName.toLowerCase()]) {
        arr.push(Element.$extend(element));
      }
    }
    return arr;
  }

  
  function getInputs(form, typeName, name) {
    form = $EM(form);

    var inputs = form.getElementsByTagName('input');

    var matchingInputs = [];
    for(var i = 0, length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if(typeName || name) {

        if((typeName && input.type != typeName)
        || (name     && input.name != name)) {
          continue;
        }
      }

      matchingInputs.push(Element.$extend(input));
    }

    return matchingInputs;
  }

  
  function getSelectedValue(form, name) {
    form = $EM(form);
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

  
  function disable(form) {
    form = $EM(form);
    var elements = getElements(form);
    for(var i = 0, length = elements.length; i < length; i++) {
      EMField.$disable(elements[i]);
    }
    return form;
  }

  
  function enable(form) {
    form = $EM(form);
    var elements = getElements(form);
    for(var i = 0, length = elements.length; i < length; i++) {
      EMField.$enable(elements[i]);
    }
    return form;
  }

  
  function request(form, options) {
    form = $EM(form);
    var options = EMUtil.$clone(options || { });

    var params = options.parameters;



    var action = form.action || '';

    if(action.blank()) {
      action = window.location.href;
    }


    options.parameters = serialize(form, { hash: true });

    if(params) {
      if(EMUtil.$isString(params)) {
        params = EMUtil.$toQueryParams(params);
      }
      EMUtil.$propcopy(params, options.parameters);
    }






    if(!options.method && form.method) {

      options.method = form.method;
    }

    return new EMRequest(action, options);
  }

  EMUtil.$propcopy({
    $serializeElements : serializeElements,
    $serialize         : serialize,
    $getElements       : getElements,
    $getInputs         : getInputs,
    $getSelectedValue  : getSelectedValue,
    $disable           : disable,
    $enable            : enable,
    $request           : request
  }, EMForm);
})();



var EMField = {};
(function() {
  
  function focus(element) {
    element = $EM(element)
    element.focus();
    return element;
  }

  
  function serialize(element) {
    element = $EM(element);
    if(!element.disabled && element.name) {
      var value = getValue(element);
      if(value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return EMUtil.$toQueryString(pair);
      }
    }
    return '';
  }

  
  function getValue(element) {




    element = $EM(element);
    var method = element.tagName.toLowerCase();
    return EMField.Serializers[method](element);
  }

  
  function setValue(element, value) {



    element = $EM(element);
    var method = element.tagName.toLowerCase();
    EMField.Serializers[method](element, value);
    return element;
  }

  
  function clear(element) {
    element = $EM(element);


    if(element.tagName.toLowerCase() == 'select') {
      if(element.type == 'select-one') {

      } else {


        setValue(element, []);
      }
      return element;
    }

    return setValue(element, '');
  }

  
  function present(element) {
    return $EM(element).value != '';
  }

  
  function activate(element) {
    element = $EM(element);
    try {

      focus(element);



      if(element.select
      && (element.tagName.toLowerCase() != 'input'
       || !(/^(?:button|reset|submit)$/i.test(element.type)))) {
        element.select();
      }
    } catch (e) { }
    return element;
  }

  
  function disable(element) {
    element = $EM(element);
    element.disabled = true;
    return element;
  }

  
  function enable(element) {
    element = $EM(element);
    element.disabled = false;
    return element;
  }

  EMUtil.$propcopy({
    $focus     : focus,
    $serialize : serialize,
    $getValue  : getValue,
    $setValue  : setValue,
    $clear     : clear,
    $present   : present,
    $activate  : activate,
    $disable   : disable,
    $enable    : enable
  }, EMField);
})();


EMField.Serializers = {
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
    if(EMUtil.$isUndefined(value)) {
      return element.checked ? element.value : null;
    } else {


      element.checked = !!value;
    }
  },

  textarea: function(element, value) {
    if(EMUtil.$isUndefined(value)) {
      return element.value;
    } else {
      element.value = value;
    }
  },

  select: function(element, value) {
    if(EMUtil.$isUndefined(value)) {
      return this[element.type == 'select-one' ?
        'selectOne' : 'selectMany'](element);
    } else {
      var opt;
      var currentValue;
      var single = !EMUtil.$isArray(value);



      var dim = null;
      if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) {
        dim = Element.$getDimensions(element);
      }


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


    return Element.$hasAttribute(opt, 'value') ? opt.value : opt.text;
  }
};

var $EMF = EMField.$getValue;




(function() {

  var scriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script>';
  var styleFragment  = '<link[^>]*>';



  function strip() {






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


    return /^[\s　]*$/.test(this);
  }

  EMUtil.$propcopy({
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
    return EMUtil.$offset(
      window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    );
  }

};

(function(viewport) {
  var element  = null;
  var property = {};

  function getRootElement() {
    if(EMBrowser.WEBKIT && !document.evaluate) {
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


(function() {




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

    KEY_SPACE:    32,

    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT:   45


  };

  var _isButton;
  if (EMBrowser.IE) {
    var buttonMap = { 0: 1, 1: 4, 2: 2 };
    _isButton = function(event, code) {
      return event.button === buttonMap[code];
    };
  }
  else if (EMBrowser.WEBKIT) {
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

  if(EMBrowser.IE) {
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


      if(event._extended) {
        return event;
      }
      event._extended = EMUtil.$empty;


      EMUtil.$propcopy({
        target          : event.srcElement || element,
        pageX           : _pointerX(event),
        pageY           : _pointerY(event),
        stopPropagation : function() { this.cancelBubble = true; },
        preventDefault  : function() { this.returnValue = false; }
      }, event);


      EMUtil.$propcopy({
        relatedTarget   : _relatedTarget(event)
      }, event);
      
      return event;
    };

  } else {
    Event.$extend = function(x) {
      return x;
    }
  }










  if(EMBrowser.GECKO) {
    window.addEventListener('unload', EMUtil.$empty, false);
  }

  function observe(element, eventName, handler) {


    var _extendFunc = function(curryFunc, baseFunc, args) {
      var curry = curryFunc.curry.apply(curryFunc, args);
      curry._baseFunc = baseFunc;
      return curry;
    };



    if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0
        && element === window && eventName === 'resize') {

      element = element.parent.window;
    }


    else if(EMBrowser.IE && element === window && eventName === 'resize') {
      var body = $EM(document.body);
      body.addEventListener(eventName, handler, false);
    }




    else if(EMBrowser.WEBKIT
        && element === window && eventName === 'resize') {
      var _handler = function(hdl, evt) {

        if(!EMUtil.isPrinting) {
          hdl.call(window, evt);

        } else {
          Event.$stop(evt);
        }
      };


      handler = _extendFunc(_handler, handler, [handler]);

    }



    var _handleShortCut = function(evtName, hdl, evt) {

      var elm = Event.$element(evt);
      var areas = EMUtil.disableAreas;
      var area = null;
      var len = 0;
      var node = null;

      if(areas && (evtName === 'keydown' || evtName === 'click')) {
        len = areas.length;
        for(var i = 0; i < len; i++) {
          node = elm;
          area = areas[i];

          while(node) {

            if(area === node) {
              Event.$stop(evt);
              return false;
            }
            node = node.parentNode;
          }
        }
      }


      if(EMUtil.$handleShortCut(evtName, evt)) {
        hdl.call(Event.$element(evt), evt);
      } else {
        return false;
      }
    };
    handler = _extendFunc(_handleShortCut, handler, [eventName, handler]);


    element = $EM(element);
    return element.addEventListener(eventName, handler, false);
  }

  
  function fireEvent(element, eventName) {
    element = $EM(element);

    if(element == document
    && document.createEvent
    && !element.dispatchEvent) {
      element = document.documentElement;
    }

    var event;
    if(document.createEvent) {






      event = document.createEvent('HTMLEvents');
      event.initEvent(eventName, true, true);

    } else {

      event = document.createEventObject();
      event.eventType = 'on' + eventName;
    }

    event.eventName = eventName;

    event.fireflag = true;

    if(document.createEvent) {

      element.dispatchEvent(event);

    } else {



      var _isHTMLDom = function(obj) {
        var documentElement = (obj ? obj.ownerDocument || obj : 0).documentElement;
        return documentElement ? documentElement.nodeName === "HTML" : false;
      };

      var _isWindow = function(elm) {
        var result = false;

        if(elm) {

          if(window === elm) {
            result = true;


          } else if(EMUtil.$isUndefined(elm.nodeType)) {
            result = _isHTMLDom(elm.document);
          }
        }
        return result;
      };

      if(_isWindow(element)) {
        element = element.document.body;
      }

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


    if (node.nodeType == 3) {

      node = node.parentNode;
    }

    return Element.$extend(node);
  }

  function stop(event) {


    if(!EMUtil.$isUndefined(Event.$getKeyCode(event))) {

      if(EMBrowser.IE) {

        if(EMBrowser.PRODUCT_VERSION >= 8.0) {
          event = window.event ? window.event : event;
          try {
            event.keyCode = 0;
          } catch(e) {
          }

        } else if(EMBrowser.PRODUCT_VERSION <= 6.0) {
          if(!event.altKey) {

            try {
              event.keyCode = 0;
            } catch(e) {
            }

          }
        }
      }
    }

    Event.$extend(event);
    event.preventDefault();
    event.stopPropagation();
    event.stopped = true;
  }

  function stopObserving(element, eventName, handler) {
    element = $EM(element);
    return element.removeEventListener(eventName, handler, false);
  }


  
  function getKeyCode(event) {
    if(event.keyCode) {
      return event.keyCode;
    } else if(event.charCode) {
      return event.charCode;
    } else {
      event.whitch;
    }
  }


  
  function getOffset(event) {
    var result = {x : 0, y : 0};
    var elm = null;
    var position = "";

    if(event) {
      if(EMBrowser.GECKO) {
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

  EMUtil.$propcopy({
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



  if(window.Event) {
    EMUtil.$propcopy(Event, window.Event);
  } else {
    window.Event = Event;
  }
})();


var EMRequest = function(url, options) {
  this.response = null;
  this._complete = false;
  this.transport = EMUtil.$createXHR();


  if(EMBrowser.IE) {
    var opt = {};
    opt = EMUtil.$propcopy(options, opt);

    if(opt.isCheckExist) {
      if(!url) {


        opt.onException = (function(opt){
          return function(req, e) {
            var res = new EMResponse(req);
            opt.onFailure(res);
            res = null;
          }
        }
        )(opt);
      } else {



        opt.onException = (function(req, e){});
      }
    }
    this.request(url, opt);



  } else if(EMBrowser.WEBKIT && EMUtil.IS_LOCAL) {
    var opt = {};
    opt = EMUtil.$propcopy(options, opt);

    if(opt.isCheckExist) {
      opt.onSuccess = (function(success, failure) {
        return function(res) {

          if(!res.responseXML && res.request.options.isXML) {
            failure(res);

          } else {
            success(res);
          }
        }
      })(opt.onSuccess, opt.onFailure);
    }
    this.request(url, opt);



  } else if(EMBrowser.GECKO && EMUtil.IS_LOCAL) {
    var opt = {};
    opt = EMUtil.$propcopy(options, opt);

    if(opt.isCheckExist) {


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

  } else {
    this.request(url, options);
  }

};

EMRequest.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

EMRequest.prototype.request = function(url, options) {
  this._complete = false;
  this.transport.abort();

  this.options = {
    method:       'get',
    asynchronous: true,
    contentType:  'application/x-www-form-urlencoded',
    encoding:     'UTF-8',
    parameters:   ''
  };
  this.options = EMUtil.$propcopy(options, this.options);

  this.url = url;
  this.method = this.options.method.toLowerCase();

  if(EMUtil.$isString(this.options.parameters)) {

    this.options.parameters = EMUtil.$toQueryParams(this.options.parameters);
  }



  if('get' != this.method && 'post' != this.method) {

    this.options.parameters['_method'] = this.method;
    this.method = 'get';
  }
  var param = '';
  if(EMUtil.$isHash(this.options.parameters)) {
    param = EMUtil.$toQueryString(this.options.parameters);
  }

  if(param) {
    if(this.method == 'get') {
      this.url += (this.url.indexOf('?') > -1 ? '&' : '?') + param;
    }
  }

  this.transport.onreadystatechange = this.onStateChange.bind(this);

  try {

    this.transport.open(this.method, this.url, this.options.asynchronous);
    if(this.options.asynchronous) {

      this.respondToReadyState.bind(this).defer(1);
    }

    this.setRequestHeaders();

    this.body = this.method == 'post' ? (this.options.postBody || param) : null;
    this.transport.send(this.body);

    


    if(!this.options.asynchronous && this.transport.overrideMimeType) {
      this.onStateChange();
    }

  }
  catch(e) {
    this.dispatchException(e);
  }
};

EMRequest.prototype.setRequestHeaders = function() {
  var headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
  };

  if(this.method == 'post') {
    headers['Content-type'] = this.options.contentType +
      (this.options.encoding ? '; charset=' + this.options.encoding : '');


    

    if(this.transport.overrideMimeType
    && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005) {
      headers['Connection'] = 'close';
    }
  }

  if(typeof this.options.requestHeaders == 'object') {
    var extras = this.options.requestHeaders;



    if(EMUtil.$isFunction(extras.push)) {
      for(var i = 0, length = extras.length; i < length; i += 2) {
        headers[extras[i]] = extras[i + 1];
      }
    } else {
      headers = EMUtil.$propcopy(extras, headers);
    }
  }

  for(var name in headers) {
    this.transport.setRequestHeader(name, headers[name]);
  }
};

EMRequest.prototype.onStateChange = function() {
  var readyState = this.transport.readyState;
  if (readyState > 1 && !((readyState == 4) && this._complete)) {
    this.respondToReadyState(readyState);
  }
};

EMRequest.prototype.respondToReadyState = function(readyState) {
  var stateEvent = EMRequest.Events[readyState];
  var response = new EMResponse(this);
  this.response = response;

  if(stateEvent == 'Complete') {







    try {
      this._complete = true;



      (this.options['on' + (response.success() ? 'Success' : 'Failure')]
      || EMUtil.$empty)(response);
    }
    catch (e) {
      this.dispatchException(e);
    }
  }

  try {
    (this.options['on' + stateEvent] || EMUtil.$empty)(response);
  }
  catch (e) {
    this.dispatchException(e);
  }

  if(stateEvent == 'Complete') {
    this.transport.onreadystatechange = EMUtil.$empty;
  }
};

EMRequest.prototype.dispatchException = function(exception) {
  function _defaultException(req, e) {
    EMUtil.$eAlert(e);
  }



  (this.options.onException || _defaultException)(this, exception);

};

EMRequest.prototype.getStatus = function() {
  try {
    return this.transport.status || 0;
  }
  catch (e) {
    return 0;
  }
};


var EMResponse = function(request) {
  this.request = request;
  this.transport  = request.transport;

  var transport   = request.transport;
  this.readyState = transport.readyState;

  var readyState  = transport.readyState;
  this.status = 0;


  if((readyState > 2 && !EMBrowser.IE) || readyState == 4) {
    this.status       = request.getStatus();
    this.responseText = transport.responseText;
  }

  if(readyState == 4) {

    if(!request.options.isXML) {
      this.responseXML = null;
    } else {

      var xml = transport.responseXML;
      if(xml == null || EMUtil.$isUndefined(xml)) {
        this.responseXML = null;
      }
      else if(xml.documentElement == null) {






        try {
          this.responseXML = EMUtil.$parseXML(this.responseText);
        }catch(e) {
          this.responseXML = null;
        }
      } else {
        this.responseXML = xml;
      }


    }

  }
};

EMResponse.prototype.success = function() {



  return !this.status || (this.status >= 200 && this.status < 300);
};


var EMFacebox = function(extra_set) {



  var links = $$EM('link');
  var len = links.length;
  var position = 0;
  var basePath = '';
  var curHref = '';
  var _endsWith = function(str, suffix) {
    var sub = str.length - suffix.length;
    return (sub >= 0) && (str.lastIndexOf(suffix) === sub);
  };

  var FACEBOX_CSS_NAME = 'facebox.css';


  for(var i = 0; i < len; i++) {
    curHref = links[i].href;


    if(_endsWith(curHref, FACEBOX_CSS_NAME)) {
      position = curHref.lastIndexOf(FACEBOX_CSS_NAME)


      if(position == 0) {
        break;

      } else if(position > 0) {


        if(curHref.charAt(position - 1) === '/') {
          basePath = curHref.substring(0, position);
          break;
        }
      }
    }
  }







  var default_caption_image = basePath + 'fbx_mtrx_bg.png';
  var default_close_image = basePath + 'fbx_x.png';












  var default_suffix = ['png', 'jpg', 'jpeg', 'gif'];


  var default_opacity = 0.35;

  this.settings = {




    caption_image : default_caption_image,
    close_image   : default_close_image,

    image_types   : new RegExp('\.(' + default_suffix.join('|') + ')$', 'i'),
    opacity       : default_opacity,
    


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


  };

  this.settings.base_path = basePath;










  if(extra_set) {
    EMUtil.$propcopy(extra_set, this.settings);
  }


  if($EM('facebox')) {


    throw 'A new instance cannot be made.';
    return;
  }



  if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) {
    Element.$insert($EM(document.body), {
      bottom: '<iframe id="facebox_overlay2" style="display:none;"/>'
    });
  }
  Element.$insert($EM(document.body), {
    bottom: '<div id="facebox_overlay" style="display:none;"/>'
  });
  Element.$insert($EM(document.body), {
    bottom: this.settings.facebox_html
  });







  this.facebox = $EM('facebox');
  this.facebox_overlay = $EM('facebox_overlay');

  if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) {
    this.facebox_overlay2 = $EM('facebox_overlay2');
  }

  var rels = $$EM('a[rel^="facebox"]');
  for(var i = 0, l = rels.length; i < l; i++) {
    var elem = rels[i];
    Event.$observe(elem, 'click', this.watchRelClick.bindAsEventListener(this, elem));
  }

  this.closeClickListener = this.watchCloseClick.bindAsEventListener(this);

  Event.$observe($$EM('#facebox .close')[0], 'click', this.closeClickListener);

  this.keyDownListener = this.watchKeyDown.bindAsEventListener(this);

  this.closeHandler = null;


  this.focusListener = this.watchFocus.bindAsEventListener(this);


  this.rootElement = $$EM("html")[0];
  this.scrollPosition = null;


  this.lastElement = new Element('div');
  this.lastElement.tabIndex = 0;


  this.isSystemError = false;

};


EMFacebox.START_TABINDEX = 1001;




EMFacebox.prototype.watchRelClick = function(event, element) {
  Event.$stop(event);
  this.click_handler(event, element);
};


EMFacebox.prototype.watchCloseClick = function(event) {

  if(EMUtil.$isFunction(this.closeHandler)) {
    this.closeHandler(event);
    this.closeHandler = null;
    Event.$stop(event);
  } else {
    Event.$stop(event);
    this.close();
  }

};



EMFacebox.prototype.watchKeyDown = function(event) {
  var code = Event.$getKeyCode(event);
  var elem = Event.$element(event);

  if(code == Event.KEY_ESC) {




    if(Element.$getStyle('facebox_close', 'visibility') !== 'hidden') {


      if(EMUtil.$isFunction(this.closeHandler)) {
        this.closeHandler(event);
        this.closeHandler = null;
      } else {
        this.close();
      }

    }



  } else if(code == Event.KEY_TAB
      && !event.ctrlKey
      && !event.altKey) {

    if(Element.$descendantOf(elem, $EM('facebox'))) {

      if(event.shiftKey && this.topElement === elem) {
        Event.$stop(event);
      }

    } else {

      Event.$stop(event);
      if(this.topElement) {
        this.topElement.focus();
      }
    }

  } else {

    if(!Element.$descendantOf(elem, $EM('facebox'))) {
      Event.$stop(event);
    }
  }

};



EMFacebox.prototype.watchFocus = function(event) {


  if(this.topElement) {
    this.topElement.focus();
  }
};



EMFacebox.prototype.watchImageLoaded = function(event, image, klass) {
  this.reveal('<div class="image"><img src="' + image.src + '"/></div>', klass);
};

EMFacebox.prototype.click_handler = function(event, element) {

  this.clearContent();













  var klass = element.rel.match(/facebox\[\.(\w+)\]/);
  if(klass) {
    klass = klass[1];
  }

  if(element.href.match(/#/)) {
    var url    = window.location.href.split('#')[0];
    var target = element.href.replace(url+'#', '');
    var d      = $EM(target);
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

  }
};






























EMFacebox.prototype.clearContent = function() {

  var contentWrapper = $$EM('#facebox .content')[0];
  var descendants = Element.$immediateDescendants(contentWrapper);
  for(var i = 0, l = descendants.length; i < l; i++) {
    Element.$remove(descendants[i]);
  }
};




EMFacebox.prototype.reveal = function(data, klass, ignoreclose, title, isChangeID, prefix, invisible, imageTitle, closeHandler, isSystemError) {






  this.scrollPosition = this.getScrPos();
  Element.$addClassName(this.rootElement, 'facebox_noscrollbar');



  this.clearContent();
















  if(EMUtil.$isFunction(closeHandler)) {
    this.closeHandler = closeHandler;
  } else {
    this.closeHandler = null;
  }



  var contentWrapper = $$EM('#facebox .content')[0];



  this.facebox.className = '';
  if(klass) {

    Element.$addClassName(this.facebox, klass);
  }



  if(imageTitle) {
    var closeImage = $$EM('#facebox_close img')[0];
    closeImage.title = imageTitle;
    closeImage.alt = imageTitle;
  }



  this.isSystemError = !!isSystemError;




  var isStringData = false;
  var cloneData = null;

  var _outerHTML = function(element) {
    var result = '';
    try {

      if(element.outerHTML) {
        result = element.outerHTML;

      } else {
        result = EMUtil.$serializeXML(element);
      }
    } catch(e) {
    }
    return result;
  }
  cloneData = Element.$extend(document.createElement('form'));
  cloneData.id = 'form_facebox';
  cloneData.method = 'post';
  cloneData.action = '';

  if(typeof(data) == 'string') {
    isStringData = true;
    cloneData.innerHTML = data;

  } else {
    cloneData.innerHTML = _outerHTML(data);

    if(invisible) {
      Element.$removeClassName(cloneData.firstChild, invisible)
    }
  }


  if(isChangeID) {
    var _convertID = function(element) {
      if(element) {
        var nodes = element.childNodes;
        var len = nodes.length;
        var node = null;

        if(element.id) {
          element.id = prefix + element.id;
        }

        for(var i = 0; i < len; i++) {
          node = nodes[i];

          if(node.nodeType == 1) {
            _convertID(node);
          }
        }
      }
    };

    if(!prefix) {
      prefix = 'fbx_';
    }
    _convertID(cloneData);
  }


  if(isStringData) {

    if(cloneData.getElementsByTagName('form').length > 0) {
      data = cloneData.innerHTML;

    } else {
      data = _outerHTML(cloneData);
    }

  } else {

    if(cloneData.getElementsByTagName('form').length > 0) {
      data = cloneData.firstChild;

    } else {
      data = cloneData;
    }
  }
  cloneData = null;




  Element.$insert(contentWrapper, { bottom: data });


  var elems = Element.$immediateDescendants($$EM('#facebox .body')[0]);
  for(var i = 0, l = elems.length; i < l; i++) {
    Element.$show(elems[i]);
  }


  if(!title) {

    title = 'FaceBox';
  }
  $EM("facebox_name").innerHTML = title;




  if(ignoreclose) {


    Element.$setStyle('facebox_close', {visibility: 'hidden'})

  } else {


    Element.$setStyle('facebox_close', {visibility: 'visible'})



  }


  this.show();





  if(Terminal.IPAD == true) {

    Element.$setStyle(this.facebox, {
      margin: (0 - Element.$getHeight(this.facebox)) / 2 + 'px 0px 0px ' + (0 - Element.$getWidth(this.facebox)) / 2 + 'px'
    });
  }


  var scrPos = this.getScrPos();
  var winSize = this.getWindowSize();
  Element.$setStyle(this.facebox, {
    top: (winSize.my + scrPos.y) + 'px'
  });
  Element.$setStyle(this.facebox, {
    left: (winSize.mx + scrPos.x) + 'px'
  });

  if(Terminal.IPAD == false) {
　  Element.$setStyle(this.facebox, {
      margin: (0 - Element.$getHeight(this.facebox)) / 2 + 'px 0px 0px ' + (0 - Element.$getWidth(this.facebox)) / 2 + 'px'
    });
  }


  
  
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
  


};


EMFacebox.prototype.getScrPos = function() {
  var obj = {};
  
  obj.x = document.documentElement.scrollLeft || document.body.scrollLeft;
  obj.y = document.documentElement.scrollTop  || document.body.scrollTop;
  
  return obj;
};

EMFacebox.prototype.getWindowSize = function() {
  var obj = {};
  
  obj.x = document.documentElement.clientWidth  || document.body.clientWidth  || document.body.scrollWidth;
  obj.y = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
  obj.mx = parseInt((obj.x) / 2);
  obj.my = parseInt((obj.y) / 2);
  
  return obj;
};


EMFacebox.prototype.show = function() {

  EMUtil.$preload(this.settings.caption_image);
  EMUtil.$preload(this.settings.close_image);
  $$EM('#facebox_close img')[0].src = this.settings.close_image;





  if(!Element.$visible(this.facebox_overlay)) {
    Element.$addClassName(this.facebox_overlay, 'facebox_overlayBG');
    Element.$setOpacity(this.facebox_overlay, this.settings.opacity);
    Element.$show(this.facebox_overlay);

    if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) {
      Element.$show(this.facebox_overlay2);
    }
  }
  if(!Element.$visible(this.facebox)) {
    Element.$show(this.facebox);
  }









  this.topElement = null;



  if(Element.$getStyle('facebox_close', 'visibility') !== 'hidden') {

    this.topElement = $$EM('#facebox_close a')[0];

    this.topElement.tabIndex = EMFacebox.START_TABINDEX;



  } else {
    var elms = $$EM('#facebox .content *');
    var len = elms.length;
    var elm = null;
    var formTags = ['A', 'AREA', 'BUTTON', 'INPUT', 'OBJECT', 'SELECT', 'TEXTAREA', 'LABEL'];

    var CONTENTS_START_TABINDEX = EMFacebox.START_TABINDEX + 1;


    if(len > 0) {

      for(var i = 0; i < len; i++) {
        elm = elms[i];


        if(elm.tabIndex == CONTENTS_START_TABINDEX) {
          this.topElement = elm;
          break;
        }

        if(!this.topElement) {

          if(elm.tabIndex != -1 && EMUtil.$getIndexOfArray(formTags, elm.tagName) >= 0) {
            this.topElement = elm;

          }
        }

      }
    }
  }


  var body = $$EM('body')[0];
  body._tabIndex = body.tabIndex;


  body.tabIndex = 1;

  Event.$observe(body, 'focus', this.focusListener);


  Event.$observe(document, 'keydown', this.keyDownListener);


  Element.$insert(body, {top : this.lastElement});
  Event.$observe(this.lastElement, 'focus', this.focusListener);



































  




























};

EMFacebox.prototype.close = function(isSystemEnd) {


  if(this.isSystemError) {

    



  } else if(isSystemEnd) {
    var body = $$EM('body')[0];
    body.focus();
    this.topElement = body;
    Element.$hide($EM('facebox'));
    

  } else {

































    Event.$stopObserving(document, 'keydown', this.keyDownListener);


    var body = $$EM('body')[0];
    body.tabIndex = body._tabIndex;
    Event.$stopObserving(body, 'focus', this.focusListener);



    Event.$stopObserving(this.lastElement, 'focus', this.focusListener);
    if(this.lastElement.parentNode === body) {
      body.removeChild(this.lastElement);
    }


    Element.$removeClassName(this.facebox_overlay, 'facebox_overlayBG');
    Element.$hide(this.facebox);
    Element.$hide(this.facebox_overlay);

    if(EMBrowser.IE && EMBrowser.PRODUCT_VERSION <= 6.0) {
      Element.$hide(this.facebox_overlay2);
    }

    if(this.scrollPosition) {
      Element.$removeClassName(this.rootElement, 'facebox_noscrollbar');
      if(EMBrowser.GECKO) {
        document.documentElement.scrollTop = this.scrollPosition.y;
      }
      this.scrollPosition = null;
    }

  }

};



EMFacebox.prototype.setImage = function(images) {
  var caption_image = '';



  var close_image = '';




  if(images) {

    if(images.caption_image) {
      caption_image = this.settings.base_path + images.caption_image;
      EMUtil.$preload(caption_image);

      this.settings.caption_image = caption_image;

      Element.$setStyle($$EM('#facebox .tname')[0],
          {"backgroundImage":"url('" + caption_image + "')"});
      Element.$setStyle($$EM('#facebox .title')[0],
          {"backgroundImage":"url('" + caption_image + "')"});
    }














    if(images.close_image) {
      close_image = this.settings.base_path + images.close_image;
      EMUtil.$preload(close_image);

      this.settings.close_image = close_image;

      $$EM('#facebox_close img')[0].src = close_image;
    }
  }
};




var EMException = function(messages, err) {
  this.name = 'EMException';
  this.messages = messages;
  this.message = this.getMessage();
  if(err) {
    this.error = err;
  } else {
    this.error = new Error(this.message);
  }
};



EMException.prototype.toString = function() {
  return this.name + ': ' + this.getMessage();
};
EMException.prototype.getMessage = function(lang) {

  if(!EMUtil.$isHash(this.messages)) {

    return this.messages;
  }


  if(EMUtil.$isUndefined(lang)) {

    lang = EMBrowser.LANG;
  }


  if(!(lang in this.messages)) {

    lang = 'en';
  }


  return this.messages[lang];
};

EMException.prototype.getErrorDescription = function() {
  return EMUtil.$getErrorDescription(this.error);
};









EMUtil.Selector = (function() {

  function __checkClassEnabled() {

    var div = new Element("div");

    div.innerHTML = "<div class='test e'></div><div class='test'></div>";


    if(!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
      return false;
    }

    div.lastChild.className = "e";


    if(div.getElementsByClassName("e").length === 1) {
      return false;
    }


    div = null;

    return true;
  }

  function __checkTagNameBug() {

    var div = new Element('div');


    div.appendChild(document.createComment(''));


    return div.getElementsByTagName("*").length > 0;
  }

  function __checkHrefAttr() {

    var div = new Element("div");

    div.innerHTML = "<a href='#'></a>";


    var ret = div.firstChild &&
              typeof div.firstChild.getAttribute !== "undefined" &&
              div.firstChild.getAttribute("href") !== "#";


    div = null;

    return ret;
  }








  function __find_ID(match, context) {
    if(typeof context.getElementById !== "undefined") {
      var m = context.getElementById(match[1]);
      return m && m.parentNode ? [m] : [];
    }
  }

  function __find_CLASS(match, context) {
    if(context.nodeType == 1) {
      context = $EM(context);
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

      if(EMUtil.$isArray(array)) {
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
    var msg = $EMA(arguments).join(' ');
    throw 'Un-supported syntax: ' + msg;
  }













  function __preFilter_CLASS(match, curLoop, inplace, result) {




    match = match[1].replace(/\\/g, "");

    for(var i = 0, elem; (elem = curLoop[i]) != null; i++) {

      if(!elem) {
        continue;
      }


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


  function __preFilter_ID(match) {
    return match[1].replace(/\\/g, "");
  }


  function __preFilter_TAG(match, curLoop) {
    return match[1].replace(/\\/g, "").toLowerCase();
  }



  function __preFilter_ATTR(match, curLoop, inplace, result) {

    var name = match[1] = match[1].replace(/\\/g, "");


    var attrMap = {
      "class" : "className",
      "for"   : "htmlFor"
    };


    if(attrMap[name]) {
      match[1] = attrMap[name];
    }


    match[4] = (match[4] || match[5] || "").replace(/\\/g, "");



    if(match[2] === "~=") {
      match[4] = " " + match[4] + " ";
    }

    return match;
  }


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








  function __filter_ID(elem, match) {
    return elem.nodeType === 1 && elem.getAttribute("id") === match;
  }




  function __filter_CLASS(elem, match) {
    return Element.$hasClassName(elem, match);
  }




  function __filter_TAG(elem, match) {

    var a = (match === "*" && elem.nodeType === 1);


    var b = (elem.nodeName.toLowerCase() === match);

    return  a || b;
  }




  function __filter_ATTR(elem, match) {

    var name = match[1];     


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


    var value = result + "";

    var type  = match[2];
    var check = match[4];

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


  function __filter_CHILD(elem, match) {
    var type = match[1];
    var node = elem;

    switch(type) {
      case "first":

        while((node = node.previousSibling)) {

          if(node.nodeType === 1) {
            return false;
          }
        }


        return true;
    }


    __notSupported("filter: CHILD: " + type);
  }




  function __relative_DEFAULT(checkSet, part) {
    var nodeCheck;
    var doneName = done++;
    var checkFn  = __dirCheck;

    if(EMUtil.$isString(part) && !/\W/.test(part)) {
      part = part.toLowerCase();
      nodeCheck = part;
      checkFn = __dirNodeCheck;
    }

    checkFn("parentNode", part, doneName, checkSet, nodeCheck);
  }




  function __relative_CHILD(checkSet, part) {
    var elem;
    var isPartStr = EMUtil.$isString(part);
    var i = 0;
    var l = checkSet.length;
    
    if(isPartStr && !/\W/.test(part)) {
      part = part.toLowerCase();

      for( ; i < l; i++) {
        elem = checkSet[i];
        if(!elem) {
          continue;
        } 
        var parent = elem.parentNode;
        checkSet[i] = ((parent.nodeName.toLowerCase() === part) ? parent : false);
      }
    } else {
      for( ; i < l; i++) {
        elem = checkSet[i];
        if(!elem) {
          continue;
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









  function __dirCheck(dir, cur, doneName, checkSet, nodeCheck) {
    for(var i = 0, l = checkSet.length; i < l; i++) {
      if(!checkSet[i]) {
        continue;
      }

      var elem  = checkSet[i];
      var match = false;

      elem = elem[dir];




      while(elem) {

        if(elem.cacheid === doneName) {
          match = checkSet[elem.setindex]; 
          break;
        }

        if(elem.nodeType == 1) {

          elem.cacheid  = doneName;
          elem.setindex = i;

          if(!EMUtil.$isString(cur)) {
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


        elem = elem[dir];
      }



      checkSet[i] = match;
    }
  }









  function __dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck) {
    for(var i = 0, l = checkSet.length; i < l; i++) {
      if(!checkSet[i]) {
        continue;
      }

      var elem  = checkSet[i];
      var match = false;

      elem = elem[dir];




      


      while(elem) {

        if(elem.cacheid === doneName) {
          match = checkSet[elem.setindex]; 
          break;
        }


        if(elem.nodeType === 1) {
          elem.cacheid  = doneName;
          elem.setindex = i;
        }


        if(elem.nodeName.toLowerCase() === cur) {
          match = elem;
          break;
        }


        elem = elem[dir];
      }



      checkSet[i] = match;
    }
  }


  var done = 0;



  var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;


  var Expr = {

    order: [ "ID", "NAME", "TAG" ],


    find: {
      ID    : __find_ID,
      CLASS : __find_CLASS,
      NAME  : __find_NAME,
      TAG   :(__checkTagNameBug() ? __find_TAG2 : __find_TAG)
    },


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


    leftMatch: {

    },


    preFilter : {
      ID     : __preFilter_ID,
      CLASS  : __preFilter_CLASS,
      ATTR   : __preFilter_ATTR,
      TAG    : __preFilter_TAG,
      CHILD  : __preFilter_CHILD,
      POS    : __notSupported.curry('pre-filter for POS syntax:'),
      PSEUDO : __notSupported.curry('pre-filter for PSEUDO syntax:')
    },


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




  if(__checkClassEnabled()) {
    Expr.order.splice(1, 0, "CLASS");
  }


  var origPOS = Expr.match.POS;


  for(var type in Expr.match) {

    Expr.match[type] = 
      new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));


    Expr.leftMatch[type] = 



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




  var hasDuplicate = false;

  function __sortOrder_Native(a, b) {
    if(a === b) {
      hasDuplicate = true;
      return 0;
    }

    if(!a.compareDocumentPosition || !b.compareDocumentPosition) {
      return a.compareDocumentPosition ? -1 : 1;
    }


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

      hasDuplicate = true;
      return 0;
    } 
    else if(aup === bup) {

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


  var sortOrder = document.documentElement.compareDocumentPosition ?
                  __sortOrder_Native :
                  __sortOrder;

  function __uniqueSort(results) {

    hasDuplicate = false;


    results.sort(sortOrder);


    if(hasDuplicate) {


      for(var i = 0; i < results.length; i++) {
        if(results[i] === results[i-1]) {
          results.splice(i--, 1);
        }
      }
    }

    return results;
  }



  function __parseFirstSelector(selector) {
    var soFar = selector;
    var m;
    var parts = [];
    var extra;
    
    do {

      chunker.exec("");


      m = chunker.exec(soFar);

      if(m) {
        parts.push(m[1]);
        soFar = m[3];
        if(m[2]) {
          extra = m[3];
          break;
        }
      }
    } 
    while (m);

    return {
      parts : parts,
      extra : extra
    };
  }










  function __findCandidates(expr, context) {
    var set;

    if(!expr) {
      return [];
    }

    for(var i = 0, l = Expr.order.length; i < l; i++ ) {

      var type = Expr.order[i];









      var match = Expr.leftMatch[type].exec(expr);

      if(!match) {
        continue;
      }

      var left = match[1];
      match.splice(1, 1);

      if(left.substr(left.length - 1) !== "\\") {

        match[1] = (match[1] || "").replace(/\\/g, "");

        set = Expr.find[type](match, context);

        if(set != null) {




          expr = expr.replace(Expr.match[type], "");
          break;

        }
      }
    }


    if(!set) {
      set = typeof context.getElementsByTagName !== "undefined" 
              ? context.getElementsByTagName("*") 
              : [];
    }

    return { 
      set  : set,
      expr : expr
    };
  }






  function __filterCandidates(expr, set, inplace) {
    var old = expr;



    var curLoop = set;
    var result  = [];

    var match;

    var anyFound;



    while(expr && set.length) {


      for(var type in Expr.filter) {


        match = Expr.leftMatch[type].exec(expr);

        if(match != null && match[2]) {

          var filter = Expr.filter[type];

          var left = match[1];
          match.splice(1,1);

          var item;
          var found;

          anyFound = false;

          if(left.substr(left.length - 1) === "\\") {
            continue;
          }

          if(curLoop === result) {
            result = [];
          }



          if(Expr.preFilter[type]) {



            match = Expr.preFilter[type](match, curLoop, inplace, result);

            if(!match) {

              anyFound = true;
              found    = true;
            }
            else if(match === true) {

              continue;
            }
          }


          if(match) {
            for(var i = 0; (item = curLoop[i]) != null; i++) {
              if(item) {

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

              curLoop = result;
            }


            expr = expr.replace(Expr.match[type], "");

            if(!anyFound) {
              return [];
            }
            break;
          }
        }
      }


      if(expr === old) {
        if(anyFound == null) {
          throw "Error: unrecognized expression: " + expr;
        } else {
          break;
        }
      }

      old = expr;

    }

    return curLoop;
  }





  function __engine(selector, context, results) {
    context = context || document;
    results = results || [];


    var origContext = context;


    if(context.nodeType != 1 && context.nodeType != 9) {
      return [];
    }


    if(!selector || !EMUtil.$isString(selector)) {
      return results;
    }

    var c;

    var b;
    var i;

    var set;

    var checkSet;
    var prune = true;

    var cur;
    var pop;




    var r = __parseFirstSelector(selector);





    if(r.parts.length > 1 && context.nodeType === 9 &&
       Expr.match.ID.test(r.parts[0]) && !Expr.match.ID.test(r.parts[r.parts.length-1])) {


      c = __findCandidates(r.parts.shift(), context);


      if(c.expr) {



        context = __filterCandidates(c.expr, c.set)[0];
      } else {

        context = c.set[0];
      }
    }

    if(context) {





      b =  r.parts.length === 1 && 
          (r.parts[0] === "~" || r.parts[0] === "+") && 
          context.parentNode;



      c = __findCandidates(r.parts.pop(), 
                           b ? context.parentNode : context); 

      if(c.expr) {



        set = __filterCandidates(c.expr, c.set);
      } else {

        set = c.set;
      }




      if(r.parts.length > 0) {
        checkSet = __makeArray(set);
      } else {
        prune = false; 
      }

      while(r.parts.length) {




        cur = r.parts.pop();
        pop = cur;

        if(!Expr.relative[cur]) {


          cur = "";
        } else {

          pop = r.parts.pop();
        }

        if(pop == null) {


          pop = context;
        }


        Expr.relative[cur](checkSet, pop);
      }
    }  else {

      checkSet = r.parts = [];
    }

    if(!checkSet) {
      checkSet = set;
    }
    if(!checkSet) {
      throw "Syntax error, unrecognized expression: " + ( cur || selector );
    }




    if(EMUtil.$isArray(checkSet)) {
      if(!prune) {

        results.push.apply(results, checkSet);
      }
      else if(context && context.nodeType === 1) {

        for(i = 0; checkSet[i] != null; i++) {
          if(checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Element.$descendantOf(checkSet[i], context)) ) {
            results.push(set[i]);
          }
        }
      }
      else {

        for(i = 0; checkSet[i] != null; i++) {
          if(checkSet[i] && checkSet[i].nodeType === 1) {
            results.push( set[i] );
          }
        }
      }
    } else {

      __makeArray(checkSet, results);
    }




    if(r.extra) {
      engine(r.extra, origContext, results);
      __uniqueSort(results);
    }

    return results;
  }







  function __engine_Native(selector, context, results) {
    context = context || document;


    if(context.nodeType === 9) {
      try { 
        return __makeArray(context.querySelectorAll(selector), results);
      }
      catch(e) {
      }
    }


    return __engine(selector, context, results);
  }


  var engine = document.querySelectorAll ? __engine_Native
                                         : __engine;

  function select(selector, scope) {

    var elems = engine(selector, scope || document);


    for(var i = 0, l = elems.length; i < l; i++) {
      Element.$extend(elems[i]);
    }

    return elems;
  }


  return {
    $select : select
  }; 
})();


function $$EM() {

  var exp = $EMA(arguments).join(', ');


  return EMUtil.Selector.$select(exp, document);
}



EMUtil.$illustForPrint = function() {
  var METHODNAME = "EMUtil.$illustForPrint";
  try {
    var myStyle = {};
    myStyle["0"] = "div#footer{display:table!important;}";
    if(EMBrowser.GECKO == true) {

      myStyle["1"] = "div.figure div.cPattern{-moz-transform:scale(0.88,0.88)translate(-41.28px,0px)!important;}";
    } else if(EMBrowser.WEBKIT == true) {

      myStyle["1"] = "div.figure,td>div.sstPattern{zoom:88%!important;}";
    }
    return myStyle;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};


EMUtil.$cPtnFloatLeft = function() {
  var METHODNAME = "EMUtil.$cPtnFloatLeft";
  try {
    var myStyle = {};
    var cb = $EM("contentsBody");
    var cPtnElms = EMUtil.Selector.$select("div.cPattern", cb);
    var len = cPtnElms.length;
    var figureElm = null;
    var tableElm = null;
    var sizeMap_cPtn = null;
    var sizeMap_cb = Element.$getPosition(cb);
    var cbLeftMargin = sizeMap_cb.x;
    var cPtnClassName = "";
    

    for(var i = 0; i < len; i++) {
      figureElm = cPtnElms[i].parentNode;
      

      tableElm = figureElm.parentNode.parentNode.parentNode.parentNode;
      if(tableElm != null 
          && tableElm.tagName.toLowerCase() == "table" 
          && tableElm.id == "") {
        continue;
      }
      

      if(figureElm.className.indexOf("cPtnForEndAct") != -1) {
        continue;
      }
      
      sizeMap_cPtn = Element.$getPosition(figureElm);
      

      if(sizeMap_cPtn.x - cbLeftMargin == 0) {
        continue;
      }
      
      cPtnClassName = "cPtn" + i;
      
      Element.$addClassName(figureElm, cPtnClassName);

      myStyle[i] = "div." + cPtnClassName + "{margin-left:" + (sizeMap_cPtn.x - cbLeftMargin) * -1 + "px!important;}";
    }
    return myStyle;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};


var PRINT_WINDOW_SIZE_WIDTH_FOR_METRO = 600;

var cPtnForEndActIndentSizeMap = {};


EMUtil.$cPtnFloatLeftForEndActBox = function(isResize) {
  var METHODNAME = "EMUtil.$cPtnFloatLeftForEndActBox";
  try {
    var myStyle = {};
    var cb = $EM("contentsBody");
    var targets = $$EM("div.endActBox div.content6");
    var targetsLen = targets.length;
    var cPtnElms = null;
    var len = 0;
    var figureElm = null;
    var tableElm = null;
    var dim = Element.$getDimensions(cb);

    var leftW = dim.width / 100 * 15;


    if(EMBrowser.METRO == true && isResize == false) {
      leftW = PRINT_WINDOW_SIZE_WIDTH_FOR_METRO / 100 * 15;
    }

    var sizeMap_con6 = null;
    var con6LeftMargin = null;
    var cPtnForEndActIndentSize = 0;
    var cPtnClassName = "";
    

    for(var i = 0; i < targetsLen; i++) {
      cPtnElms = EMUtil.Selector.$select("div.cPattern", targets[i]);
      len = cPtnElms.length;
      sizeMap_con6 = Element.$getPosition(targets[i]);
      con6LeftMargin = sizeMap_con6.x;
      

      for(var j = 0; j < len; j++) {
        figureElm = cPtnElms[j].parentNode;
        

        tableElm = figureElm.parentNode.parentNode.parentNode.parentNode;
        if(tableElm != null 
            && tableElm.tagName.toLowerCase() == "table" 
            && tableElm.id == "") {
          continue;
        }
        
        cPtnClassName = "cPtnForEndAct" + i + "_" + j;
        
        if(isResize == true) {

          Element.$setStyle(figureElm, "margin-left: " 
              + (leftW + cPtnForEndActIndentSizeMap[cPtnClassName]) * -1 + "px;");
        } else {
          sizeMap_cPtn = Element.$getPosition(figureElm);

          cPtnForEndActIndentSize = sizeMap_cPtn.x - con6LeftMargin;
          cPtnForEndActIndentSizeMap[cPtnClassName] = cPtnForEndActIndentSize;
          leftW = leftW + cPtnForEndActIndentSize;
          
          Element.$addClassName(figureElm, cPtnClassName);

          myStyle[i + "_" + j] = "div." + cPtnClassName + "{margin-left:" + leftW * -1 + "px!important;}";
        }
      }
    }
    return myStyle;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};


EMUtil.$cPtnTableForFF = function() {
  var METHODNAME = "EMUtil.$cPtnTableForFF";
  try {
    var myStyle = {};
    var cb = $EM("contentsBody");
    var sPtnElms = EMUtil.Selector.$select("div.sstPattern", cb);
    var len = sPtnElms.length;
    var sPtnElm = null;
    var dim = null;
    var cPtnClassName = "";
    

    for(var i = 0; i < len; i++) {
      sPtnElm = sPtnElms[i];
      dim = Element.$getDimensions(sPtnElm);

      if(dim.width < 688) {
        continue;
      }
      cPtnClassName = "cPtnT" + i;
      
      Element.$addClassName(sPtnElm, cPtnClassName);

      myStyle[i] = "div." + cPtnClassName + "{-moz-transform:scale(0.88,0.88)translate(-41.28px,0px)!important;}";
    }
    return myStyle;
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};


EMUtil.$insertElementStyle = function(myStyle, isPrint) {
  var METHODNAME = "EMUtil.$insertElementStyle";
  try {

    var elmStyle = document.createElement("style");
    var wrap = null;
    var strStyle = "";
    Element.$writeAttribute(elmStyle, "type", "text/css");
    var printIE6 = "";

    if(isPrint == true) {
      Element.$writeAttribute(elmStyle, "media", "print");
      printIE6 = " media='print'";
    }

    if(EMBrowser.IE == true && EMBrowser.PRODUCT_VERSION == 6.0) {

      for(var key in myStyle) {
        strStyle += myStyle[key];
      }
      wrap = document.createElement("div");
      wrap.innerHTML = "a<style type='text\/css'" + printIE6 + ">" + strStyle + "<\/style>";

      Element.$insert($$EM("head")[0], wrap.lastChild);


    } else if(EMBrowser.IE == true && EMBrowser.PRODUCT_VERSION > 6.0 && EMBrowser.PRODUCT_VERSION < 11.0) {


      for(var key in myStyle) {
        elmStyle.styleSheet.cssText += myStyle[key];
      }

      Element.$insert($$EM("head")[0], elmStyle);
      

    } else if(EMBrowser.IE == true && EMBrowser.PRODUCT_VERSION >= 11.0) {

      for(var key in myStyle) {
        elmStyle.innerHTML += myStyle[key];
      }

      Element.$insert($$EM("head")[0], elmStyle);

    } else {

      for(var key in myStyle) {
        elmStyle.innerHTML += myStyle[key];
      }

      Element.$insert($$EM("head")[0], elmStyle);
    }
  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};

