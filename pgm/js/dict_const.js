/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2014/05/13 */

/**
 * file dict_common.js<br />
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
  //パブタイプ
  C_PUB_TYPE_REPAIR                         : '0',
  C_PUB_TYPE_NCF                            : '1',
  C_PUB_TYPE_EWD                            : '2',
  C_PUB_TYPE_BRM                            : '3',
  C_PUB_TYPE_OM                             : '4',
  C_PUB_TYPE_DM                             : '5',
  C_PUB_TYPE_ERG                            : '6',
  C_PUB_TYPE_WEL                            : '7',
  C_PUB_TYPE_RES                            : '8',
  //マニュアル
  C_MANUAL_REPAIR                           : 'RM',
  C_MANUAL_NCF                              : 'NM',
  C_MANUAL_EWD                              : 'EM',
  C_MANUAL_BRM                              : 'BM',
  C_MANUAL_OM                               : 'OM',
  C_MANUAL_DM                               : 'DM',
  C_MANUAL_ERG                              : 'ER',
  C_MANUAL_WEL                              : 'WC',
  C_MANUAL_RES                              : 'HR',
  //検索オプション
  C_SEARCH_OPTION_CD_REPAIR                 : '00',
  C_SEARCH_OPTION_CD_LAYOUT                 : '01',
  C_SEARCH_OPTION_CD_TROUBLE                : '02',
  C_SEARCH_OPTION_CD_REMOVE                 : '03',
  C_SEARCH_OPTION_CD_MAINTENANCE            : '04',
  C_SEARCH_OPTION_CD_CUSTOM                 : '05',
  C_SEARCH_OPTION_CD_PREPARED               : '06',
  C_SEARCH_OPTION_CD_OTHER                  : '09',
  C_SEARCH_OPTION_CD_NCF                    : '10',
  C_SEARCH_OPTION_CD_EWD                    : '20',
  C_SEARCH_OPTION_CD_BRM                    : '30',
  C_SEARCH_OPTION_CD_OM                     : '40',
  C_SEARCH_OPTION_CD_DM                     : '50',
  C_SEARCH_OPTION_CD_ERG                    : '60',
  C_SEARCH_OPTION_CD_WEL                    : '70',
  C_SEARCH_OPTION_CD_RES                    : '80',
  //コンテンツ種別区分
  C_CONTENTS_TYPE_NEW                       : '10',
  C_CONTENTS_TYPE_OLD                       : '20',
  C_CONTENTS_TYPE_OLD_NOSEARCH              : '21',
  //プレースホルダー用スタイルクラス
  C_STYLE_CLASS_PLACE_HOLDER                :'deftxt',
  //索引画面
  C_INDEX_SAKUIN_INDEX_PATH                 : '../{manual_path}/pub_sys/sakuin/sakuin-index-{0}.xml',
  //TOP画面
  C_TOP_PUBBIND_XML_PATH                    : '../{manual_path}/pub_sys/pub-bind.xml',
  C_TOP_RELEASE_XML_PATH                    : '../{manual_path}/pub_sys/media-release.xml',
  C_TOP_RM_XML_PATH                         : '../{manual_path}/repair/control/pub.xml',
  C_TOP_NM_XML_PATH                         : '../{manual_path}/ncf/control/pub.xml',
  C_TOP_EM_XML_PATH                         : '../{manual_path}/ewd/control/pub.xml',
  C_TOP_BM_XML_PATH                         : '../{manual_path}/brm/control/pub.xml',
  C_TOP_OM_XML_PATH                         : '../{manual_path}/om/property.xml',
  C_TOP_WC_XML_PATH                         : '../{manual_path}/wel/property.xml',
  C_TOP_HR_XML_PATH                         : '../{manual_path}/res/property.xml',
  C_TOP_OPEN_SERVICE_PATH                   : 'service.html',
  C_TOP_OPEN_HELP_PATH                      : '../system/guide/html/guidebook.html',
  C_TOP_OPEN_HELP_PATH_FOR_LEXUS_JA         : '../system/guide/html_l/guidebook.html',
  C_TOP_OPEN_README_PATH                    : '../system/guide/readme.html',
  C_TOP_OPEN_README_PATH_FOR_LEXUS_JA       : '../system/guide/readme_l.html',
  //閲覧画面
  C_SERVICE_OPEN_HELP_WINDOW                : '../system/guide/html/guidebook.html',
  C_SERVICE_OPEN_HELP_WINDOW_FOR_LEXUS_JA   : '../system/guide/html_l/guidebook.html',
  C_SERVICE_PUBBIND_PATH                    : '../{manual_path}/pub_sys/pub-bind.xml',
  C_SERVICE_PUBBIND_XML_PATH_RM             : '../{manual_path}/repair/control/pub.xml',
  C_SERVICE_PUBBIND_XML_PATH_NM             : '../{manual_path}/ncf/control/pub.xml',
  C_SERVICE_PUBBIND_XML_PATH_EM             : '../{manual_path}/ewd/control/pub.xml',
  C_SERVICE_PUBBIND_XML_PATH_BM             : '../{manual_path}/brm/control/pub.xml',
  C_SERVICE_PUBBIND_XML_PATH_OM             : '../{manual_path}/om/property.xml',
  C_SERVICE_PUBBIND_XML_PATH_WC             : '../{manual_path}/wel/property.xml',
  C_SERVICE_PUBBIND_XML_PATH_HR             : '../{manual_path}/res/property.xml',
  C_SERVICE_PUBBIND_XML_PATH_ER             : '../{manual_path}/erg/property.xml',
  C_SERVICE_PUBBIND_XML_PATH_DM             : '../{manual_path}/dm/property.xml',
  //閲覧画面 (tree)
  C_SERVICE_REPAIR_TREE_REPAIR_ROOT_XML     : '../{manual_path}/repair/control/{teki_date}/toc-[0]root.xml',
  C_SERVICE_REPAIR_TREE_REPAIR_SECTION_XML  : '../{manual_path}/repair/control/{teki_date}/toc-[0][1].xml',
  C_SERVICE_NCF_TREE_NCF_ROOT_XML           : '../{manual_path}/ncf/control/{teki_date}/toc-[0]root.xml',
  C_SERVICE_NCF_TREE_NCF_SECTION_XML        : '../{manual_path}/ncf/control/{teki_date}/toc-[0][1].xml',
  C_SERVICE_BRM_TREE_BRM_ROOT_XML           : '../{manual_path}/brm/control/{teki_date}/toc-[0]root.xml',
  C_SERVICE_BRM_TREE_BRM_SECTION_XML        : '../{manual_path}/brm/control/{teki_date}/toc-[0][1].xml',
  //閲覧画面 (修理書)
  C_SERVICE_REPAIR_TOPPAGE_PATH             : '../system/html/repair_top.html',
  C_SERVICE_REPAIR_CONTENT_PATH             : '../{manual_path}/repair/contents/{0}.html',
  C_SERVICE_REPAIR_DIAGFLW_PATH             : '../{manual_path}/repair/contents/{0}.html',
  //閲覧画面 (新型車解説書)
  C_SERVICE_NCF_TOPPAGE_PATH                : '../system/html/ncf_top.html',
  C_SERVICE_NCF_CONTENT_PATH                : '../{manual_path}/ncf/contents/{0}.html',
  //閲覧画面 (ボデー修理書)
  C_SERVICE_BRM_TOPPAGE_PATH                : '../system/html/brm_top.html',
  C_SERVICE_BRM_CONTENT_PATH                : '../{manual_path}/brm/contents/{0}.html',
  C_SERVICE_BRM_OLDCONFIG_INDEX             : '../{manual_path}/brm/index.html',
  //閲覧画面 (取扱説明書)
  C_SERVICE_OM_PATH                         : '../{manual_path}/om/index.html',
  //閲覧画面 (ウェルキャブマニュアル)
  C_SERVICE_WEL_PATH                        : '../{manual_path}/wel/index.html',
  //閲覧画面 (ハイブリッドレスキュー)
  C_SERVICE_RES_PATH                        : '../{manual_path}/res/index.html',
  //閲覧画面 (Emergency Response Guide)
  C_SERVICE_ERG_PATH                        : '../{manual_path}/erg/index.html',
  //閲覧画面 (Hybrid Vehicle Battery Dismantling Manual)
  C_SERVICE_DM_PATH                         : '../{manual_path}/dm/index.html',
  //閲覧画面 (配線図)
  C_SERVICE_EWD_PATH                        : '../{manual_path}/ewd/ewd_index.html',
  C_SERVICE_EWD_LEGACY_INDEX                : '../{manual_path}/ewd/index.html',
  //閲覧画面 (診断フロー警告・注意画面)
  C_SERVICE_FLOW_CONTENT_IMG_PATH           : '../{manual_path}/repair/img/png/',
  C_SERVICE_FLOW_CONTENT_PATH               : '../{manual_path}/repair/contents/{0}.html',
  C_SERVICE_FLOW_CONTENT_REF_ICON_FILE_NAME   : 'reference_page.png',
  C_SERVICE_FLOW_CONTENT_REF_ICON_FILE_PATH   : '../system/img/png/reference_page.png',
  //簡易検索
  C_SERVICE_SIMPLESEARCH_SEARCH_XML_PATH    : '../{manual_path}/pub_sys/txt-search.xml',
  C_SERVICE_SIMPLESEARCH_PUB_XML_PATH_RM    : '../{manual_path}/repair/control/pub.xml',
  C_SERVICE_SIMPLESEARCH_PUB_XML_PATH_NM    : '../{manual_path}/ncf/control/pub.xml',
  C_SERVICE_SIMPLESEARCH_PUB_XML_PATH_EM    : '../{manual_path}/ewd/control/pub.xml',
  C_SERVICE_SIMPLESEARCH_PUB_XML_PATH_BM    : '../{manual_path}/brm/control/pub.xml',
  C_SERVICE_SIMPLESEARCH_TOC_XML_PATH_RM    : '../{manual_path}/repair/control/toc.xml',
  C_SERVICE_SIMPLESEARCH_TOC_XML_PATH_NM    : '../{manual_path}/ncf/control/toc.xml',
  C_SERVICE_SIMPLESEARCH_TOC_XML_PATH_EM    : '../{manual_path}/ewd/control/tmc-toc.xml',
  C_SERVICE_SIMPLESEARCH_TOC_XML_PATH_BM    : '../{manual_path}/brm/control/toc.xml',
  //コンテンツ
  C_CONTENTS_CURRENT_REFFER_PATH            : './{0}.html',
  C_CONTENTS_INDICATE_DEFAULT_PATH            : '../system/img/png/ndot.png',
  C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_H    : '../system/img/png/dot_h.png',
  C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_V    : '../system/img/png/dot_v.png',
  C_CONTENTS_INDICATE_LINE_PATH               : '../system/img/png/nline{0}x{1}_{2}.png',
  C_CONTENTS_INDICATE_LINE_WEDGE_PATH         : '../system/img/png/line{0}x{1}_{2}.png',
  //修理書へのリンクフラグ
  C_SERVICE_SIMPLE_SEARCH                   : '0',
  C_SERVICE_SIMPLE_RMSEARCH                 : '1',
  //p-type
  C_SERVICE_ORIGINAL_CD                     : '0',
  C_PRODUCT_NAME_CD                         : '1',
  // 以下は定数のみ使用する項目一覧
  C_PUB_TYPE_CONVERTER                      : {
    RM:                 '00',
    NM:                 '10',
    EM:                 '20',
    BM:                 '30',
    OM:                 '40',
    DM:                 '50',
    ER:                 '60',
    WC:                 '70',
    HR:                 '80',
    00:                 'RM',
    10:                 'NM',
    20:                 'EM',
    30:                 'BM',
    40:                 'OM',
    50:                 'DM',
    60:                 'ER',
    70:                 'WC',
    80:                 'HR',
    0:                  'RM',
    1:                  'NM',
    2:                  'EM',
    3:                  'BM',
    4:                  'OM',
    5:                  'DM',
    6:                  'ER',
    7:                  'WC',
    8:                  'HR'
  },

  C_SERVICE_MANUAL_TYPE                     : {
    RM:                 '0',
    NM:                 '1',
    EM:                 '2',
    BM:                 '3',
    OM:                 '4',
    DM:                 '5',
    ER:                 '6',
    WC:                 '7',
    HR:                 '8',
    '00':               '0',
    '10':               '1',
    '20':               '2',
    '30':               '3',
    '40':               '4',
    '50':               '5',
    '60':               '6',
    '70':               '7',
    '80':               '8'
  },

  C_BRAND_CODE                              : {
    TOYOTA:  'E1',
    LEXUS:   'E2',
    SCION:   'E3'
  },

  C_TRGT_CODE                               : {
    Japan                 : 'J',
    'Europe And General'  : 'E',
    'North America'       : 'U'
  },

  C_LANG_NAME                               : {
    ja:  "Japanese",
    en:  "English",
    de:  "Deutsch",
    fr:  "Français",
    es:  "Español"
  },

  C_PARA_CATEGORY                           : {
    '01': "K,R",
    '02': "C,J,S,T",
    '03': "A",
    '04': "G",
    '05': "W,X",
    '06': "B",
    '09': "M,N,L,F,H,D,U,V,Y"
  }
};

/**
 * 定数定義共通クラス
 * @namespace 多言語対応辞書共通キークラス
 */
DictConst.Keys = [
  //索引画面
  'C_INDEX_SAKUIN_INDEX_PATH',
  //TOP画面
  'C_TOP_PUBBIND_XML_PATH',
  'C_TOP_RELEASE_XML_PATH',
  'C_TOP_RM_XML_PATH',
  'C_TOP_NM_XML_PATH',
  'C_TOP_EM_XML_PATH',
  'C_TOP_BM_XML_PATH',
  'C_TOP_OM_XML_PATH',
  'C_TOP_WC_XML_PATH',
  'C_TOP_HR_XML_PATH',
  'C_TOP_OPEN_SERVICE_PATH',
  'C_TOP_OPEN_HELP_PATH',
  'C_TOP_OPEN_HELP_PATH_FOR_LEXUS_JA',
  'C_TOP_OPEN_README_PATH',
  'C_TOP_OPEN_README_PATH_FOR_LEXUS_JA',
  //閲覧画面
  'C_SERVICE_OPEN_HELP_WINDOW',
  'C_SERVICE_OPEN_HELP_WINDOW_FOR_LEXUS_JA',
  'C_SERVICE_PUBBIND_PATH',
  'C_SERVICE_PUBBIND_XML_PATH_RM',
  'C_SERVICE_PUBBIND_XML_PATH_NM',
  'C_SERVICE_PUBBIND_XML_PATH_EM',
  'C_SERVICE_PUBBIND_XML_PATH_BM',
  'C_SERVICE_PUBBIND_XML_PATH_OM',
  'C_SERVICE_PUBBIND_XML_PATH_WC',
  'C_SERVICE_PUBBIND_XML_PATH_HR',
  'C_SERVICE_PUBBIND_XML_PATH_ER',
  'C_SERVICE_PUBBIND_XML_PATH_DM',
  //閲覧画面 (tree)
  'C_SERVICE_REPAIR_TREE_REPAIR_ROOT_XML',
  'C_SERVICE_REPAIR_TREE_REPAIR_SECTION_XML',
  'C_SERVICE_NCF_TREE_NCF_ROOT_XML',
  'C_SERVICE_NCF_TREE_NCF_SECTION_XML',
  'C_SERVICE_BRM_TREE_BRM_ROOT_XML',
  'C_SERVICE_BRM_TREE_BRM_SECTION_XML',
  //閲覧画面 (修理書)
  'C_SERVICE_REPAIR_TOPPAGE_PATH',
  'C_SERVICE_REPAIR_CONTENT_PATH',
  'C_SERVICE_REPAIR_DIAGFLW_PATH',
  //閲覧画面 (新型車解説書)
  'C_SERVICE_NCF_TOPPAGE_PATH',
  'C_SERVICE_NCF_CONTENT_PATH',
  //閲覧画面 (ボデー修理書)
  'C_SERVICE_BRM_TOPPAGE_PATH',
  'C_SERVICE_BRM_CONTENT_PATH',
  'C_SERVICE_BRM_OLDCONFIG_INDEX',
  //閲覧画面 (取扱説明書)
  'C_SERVICE_OM_PATH',
  //閲覧画面 (ウェルキャブマニュアル)
  'C_SERVICE_WEL_PATH',
  //閲覧画面 (ハイブリッドレスキュー)
  'C_SERVICE_RES_PATH',
  //閲覧画面 (Emergency Response Guide)
  'C_SERVICE_ERG_PATH',
  //閲覧画面 (Hybrid Vehicle Battery Dismantling Manual)
  'C_SERVICE_DM_PATH',
  //閲覧画面 (配線図)
  'C_SERVICE_EWD_PATH',
  'C_SERVICE_EWD_LEGACY_INDEX',
  //閲覧画面 (診断フロー警告・注意画面)
  'C_SERVICE_FLOW_CONTENT_IMG_PATH',
  'C_SERVICE_FLOW_CONTENT_PATH',
  'C_SERVICE_FLOW_CONTENT_REF_ICON_FILE_NAME',
  'C_SERVICE_FLOW_CONTENT_REF_ICON_FILE_PATH',
  //索引画面
  'C_USE_INDEX_INITIAL_PATH',
  //簡易検索
  'C_SERVICE_SIMPLESEARCH_SEARCH_XML_PATH',
  'C_SERVICE_SIMPLESEARCH_PUB_XML_PATH_RM',
  'C_SERVICE_SIMPLESEARCH_PUB_XML_PATH_NM',
  'C_SERVICE_SIMPLESEARCH_PUB_XML_PATH_EM',
  'C_SERVICE_SIMPLESEARCH_PUB_XML_PATH_BM',
  'C_SERVICE_SIMPLESEARCH_TOC_XML_PATH_RM',
  'C_SERVICE_SIMPLESEARCH_TOC_XML_PATH_NM',
  'C_SERVICE_SIMPLESEARCH_TOC_XML_PATH_EM',
  'C_SERVICE_SIMPLESEARCH_TOC_XML_PATH_BM',
  //コンテンツ
  'C_CONTENTS_CURRENT_REFFER_PATH',
  'C_CONTENTS_INDICATE_DEFAULT_PATH',
  'C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_H',
  'C_CONTENTS_INDICATE_DEFAULT_WEDGE_PATH_V',
  'C_CONTENTS_INDICATE_LINE_PATH',
  'C_CONTENTS_INDICATE_LINE_WEDGE_PATH'
];
