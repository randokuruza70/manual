/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2015/04/02 */

/**
 * file dict_const.js<br />
 *
 * @fileoverview 定数定義共通クラス。<br />
 * file-> dict_const.js
 * @author Shimizu
 * @version 1.0.0
 *
 * History(date|version|name|desc)<br />
 *  2011/02/10|1.0.0|Shimizu|新規作成<br />
 */
/*-----------------------------------------------------------------------------
 * サービス情報高度化プロジェクト
 * 更新履歴
 * 2011/02/10 Shimizu ・新規作成
 *---------------------------------------------------------------------------*/
/**
 * 定数定義共通クラス
 * @namespace 定数定義共通クラス
 */
var DictConst = {
  //Facebox用
  C_FACEBOX_CAPTION_IMAGE_PATH              : '../img/png/fbx_mtrx_bg.png',
  C_FACEBOX_LOADING_IMAGE_PATH              : '../img/fbx_loading.gif',
  C_FACEBOX_CLOSE_IMAGE_PATH                : '../img/png/fbx_x.png',
  //コンテンツ用
  C_CONTENTS_CURRENT_REFFER_PATH            : './{0}.html',
  C_CONTENTS_SWF_PATH                       : '../swf/{0}',
  C_CONTENTS_PDF_PATH                       : '../pdf/{0}',
  C_CONTENTS_GIF_PATH                       : '../img/gif/{0}',
  C_CONTENTS_INDICATE_DEFAULT_PATH          : '../../../system/img/png/ndot.png',
  C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_H  : '../../../system/img/png/dot_h.png',
  C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_V  : '../../../system/img/png/dot_v.png',
  C_CONTENTS_INDICATE_LINE_PATH             : '../../../system/img/png/nline{0}x{1}_{2}.png',
  C_CONTENTS_INDICATE_LINE_WEDGE_PATH       : '../../../system/img/png/line{0}x{1}_{2}.png'
};

/**
 * 定数定義共通クラス
 * @namespace 多言語対応辞書共通キークラス
 */
DictConst.Keys = [
  'C_CONTENTS_CURRENT_REFFER_PATH',
  'C_CONTENTS_SWF_PATH',
  'C_CONTENTS_PDF_PATH',
  'C_CONTENTS_GIF_PATH',
  'C_CONTENTS_INDICATE_DEFAULT_PATH',
  'C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_H',
  'C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_V',
  'C_CONTENTS_INDICATE_LINE_PATH',
  'C_CONTENTS_INDICATE_LINE_WEDGE_PATH'
];
