/*! All Rights Reserved. Copyright 2012 (C) TOYOTA  MOTOR  CORPORATION.
Last Update: 2011/12/16 */

/**
 * file dict.js<br />
 *
 * @fileoverview 多言語対応辞書クラス。（英語）<br />
 * file-> dict_message.js
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
 * 多言語対応辞書クラス（日本語）
 * @namespace 多言語対応辞書クラス（英語）
 */
var Dict = {
    //key : value,
    MVWF1001AAE : '{0} is a required item.',
    MVWF1002AAE : 'For {0}, be sure to input at least {1} or more characters, \nand to not exceed {2} characters.',
    MVWF1003AAE : 'For {0}, input exactly {1} characters.',
    MVWF1004AAE : 'For {0}, input within {1} characters.',
    MVWF1005AAE : 'For {0}, \ninput with one-byte upper-case alphabetical characters.',
    MVWF1006AAE : 'For {0}, \ninput with one-byte lower-case alphabetical characters.',
    MVWF1007AAE : 'For {0}, input with one-byte numeric characters.',
    MVWF1008AAE : '{0} contains an invalid character.\nFor further details, refer to Help.',
    MVWF1009AAE : 'One-byte spaces cannot be input into {0}.',
    MVWF1010AAE : 'For {0}, input with two-byte characters.',
    MVWF1011AAE : 'There is no inputted data in {0}.',
    MVWF1012AAE : 'For {0}, input with {1}.',
    MVWF1013AAE : 'The inputted date is incorrect. ',
    MVWF1014AAE : 'For {0}, input a date before {1}.',
    MVWF1015AAE : 'For {0}, input a date after {1}.',
    MVWF1016AAE : 'For {0}, be sure to input at least {1} or more characters, \nand to not exceed {2} characters.',
    MVWF1017AAE : 'For {0}, \ninput with alphanumeric characters and {1}.',
    MVWF1018AAE : 'For {0}, \ninput with {1} and {2}.',
    MVWF1019AAE : 'For {0}, \ninput with one-byte alphanumeric characters.',
    MVWF0001AAE : 'Input VIN/Frame No.',
    MVWF0002DAE : 'There is no vehicle information that matches your request.\nConfirm the input VIN/Frame No..\nEx. VIN: 17 alphanumeric digits\n     Frame No.: ZVW30-1234567\nOr select vehicle information from the pull-down menu.',
    MVWF0003AAE : 'Service Information cannot be opened because vehicle \ninformation has not been selected.\nSelect all required items (*) from the pull-down menus.',
    MVWF0004AAE : 'Input search keywords.',
    MVWF0005AAE : 'Input search keywords within 200 characters.',
    MVWF0006AAE : 'Input the keyword YOKOGUSHI with no spaces in between and \nwith 5 or more characters.',
    MVWF0007AAE : 'Input search keywords within 30 words.',
    MVWF0008AAE : 'There is no updated information.',
    MVWF0009AAE : 'The keyword contains an invalid character.\nRefer to {0} and input keywords again.',
    MVWF0010DAE : '{0} cannot be retrieved.',
    MVWF0011AAE : 'Techstream Boot has failed.\nConfirm that the following conditions have been met:\n- Techstream is installed.\n- Techstream can be booted independently.\nError Code: ',
    MVWF0012AAE : 'The operation failed because Techstream was processing.\nRetry after comfirming the Techstream information displayed on your screen.\nError Code: ',
    MVWF0013AAE : 'The operation failed because the following function was in operation.\nTerminate the following function and retry.\n  Utility, CARB OBD II, CUW, SUW\nError Code: ',
    MVWF0014AAE : 'The operation failed.\nIf Techstream is already booted, terminate Techstream and retry.\nError Code: ',
    MVWF0015AAE : 'The operation failed.\nError Code:',
    MVWF0016AAE : 'The operation failed.\nConfirm that the following condition has been met:\n- Techstream is installed.\nError Code: ',
    MVWF0017AAE : 'The operation failed because Techstream is running in another browser.\nClose other browser and retry.\nError Code: ',
    MVWF0021AAI : 'Preparing...',
    MVWF0022AAI : 'Preparation: OK',
    MVWF0023AAI : 'Techstream Booting...',
    MVWF0024AAI : 'Techstream Boot: OK',
    MVWF0025AAI : 'Function Booting...',
    MVWF0026AAI : '',
    MVWF0027AAI : '',
    MVWF0028AAE : '0 search results',
    MVWF0029AAE : 'The selected title does not exist.\nParts Code Name: {0}',
    MVWF0031AAE : 'Select a title.',
    MVWF0032AAE : 'The search results exceed the maximum number of records, 500.\nAdd search options to narrow your search and then retry.',
    MVWF0033AAE : 'Input a description within {0} characters.',
    MVWF0034AAE : 'Select search options.',
    MVWF0035AAE : 'Select a keyword.',
    MVWF0036DEE : 'A search error has occurred.',
    MVWF0037DAI : 'Search failed because there are no manuals that match your query.',
    MVWF0038AAI : 'Search Option cannot be opened because there are no \nmanuals that match your query.',
    MVWF0041AAI : 'There is no target feedback.',
    MVWF0042AAE : 'Select one feedback item.',
    MVWF0043AAE : 'You cannot do because the selected feedback is approved.',
    MVWF0044AAC : 'Do you want to the selected feedback?',
    MVWF0045AAE : 'You cannot reply because the selected feedback \nhas not been approved or has already been accepted.',
    MVWF0046AAC : 'Do you want to delete the reply?',
    MVWF0047AAE : 'There is no selected feedback.',
    MVWF0048AAE : '',
    MVWF0049AAE : 'The selected feedback has been updated/deleted.\nSelect the feedback from the Feedback List again.',
    MVWF0050AAC : 'Do you want to delete the attached file?\nThe attached file will be deleted when the "Register" button is pressed.',
    MVWF0051AAE : 'Input Model.',
    MVWF0052AAE : 'Select the model.',
    MVWF0053AAI : '',
    MVWF0054AAE : 'The inputted model has already been added.',
    MVWF0055AAC : 'The inputted data will be erased when the item is modified.\nDo you still want to change the item?',
    MVWF0056AAE : 'Only one file can be attached at a time.\nIf you want to attach a new file, delete the currently attached file.',
    MVWF0057AAE : 'You can not reply because you have not received authorization.',
    MVWF0058AAE : 'The dates are inverted.\nCorrect the date and search again.',
    MVWF0059AAE : 'The extension {0} cannot be registered as an attached file.',
    MVWF0060AAE : 'Accepts one file up to 2MB in size.',
    MVWF0061AAE : 'The search results exceeds 300.\nChange the criteria and search again.',
    MVWF0062AAE : 'You can not reply because TMC has not received the selected feedback.',
    MVWF0063AAE : 'Up to 50 vehicles can be added.',
    MVWF0071AAE : 'Input the company code.',
    MVWF0072AAC : 'The search result will be erased when the "Search" button is pressed.\nDo you want to search?',
    MVWF0073DAE : 'The inputted company code does not exist.',
    MVWF0074DAE : 'The search results exceeds 100.\nChange the criteria and search again.',
    MVWF0075AAE : 'Select a CSV file.',
    MVWF0076DAE : 'The CSV file cannot be opened.\nCheck the CSV file.',
    MVWF0077DAE : 'Up to 100 records can be updated at one time.\nCheck the CSV file.',
    MVWF0078DAE : 'The CSV file format is not correct.\nCheck the CSV file.',
    MVWF0079AAE : 'The red colored data is not correct.\nCorrect the CSV file and upload again.',
    MVWF0080AAE : 'There is no updated information.',
    MVWF0081DAE : 'The inputted company code for No.{0} has already been registered.',
    MVWF0082DAE : 'There is no inputted company code for No.{0}.',
    MVWF0083AAE : 'Registration has failed.\nContact the system administrator.',
    MVWF0084AAI : 'Registration is complete.',
    MVWF0085DAE : 'There is no administrator corresponding to the search conditions. ',
    MVWF0086AAE : 'Up to 10 records can be updated at one time.',
    MVWF0087AAE : 'Select an administrator.',
    MVWF0088AAE : 'There is no data to register.',
    MVWF0089DAE : 'There is no company code.',
    MVWF0090DAE : 'The user ID has already been registered.',
    MVWF0091DAE : 'There is no user ID.',
    MVWF0092DAE : 'You can not update because you have not received authorization.',
    MVWF0093DAE : 'There is no updatable data in the CSV file.Check the CSV file.',
    MVWF0094DAE : 'The company code has already been registered.\nCheck the CSV file.',
    MVWF0095DAE : 'The selected data has already been updated.',
    MVWF0096AAE : 'The file size exceeds 50KB.',
    MVWF0101AAE : 'Select the work log from the Work Log List.',
    MVWF0102AAC : 'Do you want to delete the selected work log from the Work Log List?',
    MVWF0111AAE : 'The work logs exceed 100 records.\nUp to 100 work logs can be registered per person.\nDelete work logs from the Work Log List.',
    MVWF0121DAE : 'There is no data to display.\nReconfirm the updated information.',
    MVWF0122DAE : 'You can not use the system because you have not received authorization.\nContact the system administrator.',
    MVWF0123DAE : 'An unexpected error has occurred.',
    MVWF0124DAE : 'Close the browser and retry.',
    MVWF0125DAE : 'System Error',
    CONST_SYSTEM_ERROR_MESSAGE : 'Message',
    MVWF0064AAE : 'The attached file has been updated/deleted.\nSelect the feedback from the Feedback List again.',
    MVWF0065AAC : 'The modified data will not be updated.\nDo you still want to open the Feedback List?',
    MVWF0066AAC : 'The modified data will not be updated.\nDo you want to close the window?',
    MVWF0067AAI : 'The upload has completed.',
    MVWF0068AAI : 'Close the window after the download has completed.',
    CONST_CARINFO_TITLE:              'Vehicle Information',
    CONST_DIAGNOSISMEMO_TITLE:        'Work Log',
    CONST_CONTENTS_TITLE_DIAGNOSTIC:  'Diagnostic Help - Toyota Service Inforamation',
    CONST_CONTENTS_TITLE_INSPECTION:  'Inspection Procedure - Toyota Service Inforamation',
    CONST_CONTENTS_TITLE_REFERENCE:   'Reference Page - Toyota Service Inforamation',
    CONST_CONTENTS_FLOW_NAVE_TITLE:   'Overview',
    CONST_CONTENTS_FLOW_BTN_PROC:     'Procedures',
    CONST_CONTENTS_FLOW_BTN_JUDGE:    'Criteria',
    CONST_TITLESELECT_TITLE:          'Title Selection',
    CONST_FLOW_TITLE:                 'Troubleshoot Caution/Notice/Hint',
    CONST_CONTENTS_TITLE_PRINT:       'Print-Toyota Service Inforamation',
    CONST_SEARCH_OPTION_TITLE:        'Search Option',
    CONST_INDEX_NAME:                 'Index',
    CONST_LANGARY_EN:                 'English',
    CONST_LANGARY_FR:                 'Français',
    CONST_LANGARY_DE:                 'Deutsch',
    CONST_LANGARY_JA:                 '日本語',
    CONST_LANGARY_ES:                 'Español',
    CONST_SEARCH_OPTION_RETURN_TRUE:  'Yes',
    CONST_SEARCH_OPTION_RETURN_FALSE: 'No',
    CONST_TOP_WHATSNEW_COUNT:         '{1}-{2} of {0}',
    CONST_TOP_UPDATEICN_NAME:         'Update Details',
    CONST_GTS_FACEBOX_TITLE:          'GTS Sending/Receiving...',
    CONST_CONTENTS_FIXED_OTHER_HEAD:  '<div id="header_head"><div id="banner"><img src="../img/png/toyota.png" width="113" height="24" alt="TOYOTA" title="TOYOTA"></div><div id="navigation"><p><a href="javascript:void(0);" class="link" id="lnk_close">Exit</a></p></div></div>',
    CONST_FACEBOX_IMAGE_TITLE:        'Exit',
    CONST_GLOBAL_INDEX:               '\
<div id="index_search_contents">\
<div id="index_search_body">\
<div id="initial">\
<ul id="shift_initial">\
<li>\
<a href="javascript:void(0);" id="kanaLnk" tabIndex="1002">Kana</a>\
</li>\
<li>\
<a href="javascript:void(0);" id="alphaLnk" tabIndex="1003">Alphanumeric</a>\
</li>\
</ul>\
<div id="alphanum_list" class="initial_list invisible">\
<div class="alphabet">\
<a href="javascript:void(0);" class="initial" tabIndex="1004">A</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">B</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">C</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">D</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">E</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">F</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">G</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">H</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">I</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">J</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">K</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">L</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">M</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">N</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">O</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">P</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">Q</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">R</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">S</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">T</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">U</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">V</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">W</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">X</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">Y</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">Z</a>\
</div>\
<div class="number">\
<a href="javascript:void(0);" class="initial" tabIndex="1004">1</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">2</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">3</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">4</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">5</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">6</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">7</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">8</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">9</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">0</a>\
</div>\
</div>\
<div id="katakana_list" class="initial_list invisible">\
<div class="kana">\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ア</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">イ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ウ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">エ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">オ</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">カ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">キ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ク</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ケ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">コ</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">サ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">シ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ス</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">セ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ソ</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">タ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">チ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ツ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">テ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ト</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ナ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ニ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ヌ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ネ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ノ</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ハ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ヒ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">フ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ヘ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ホ</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">マ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ミ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ム</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">メ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">モ</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ヤ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ユ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ヨ</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ラ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">リ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ル</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">レ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ロ</a>\
<br>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ワ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ヲ</a>\
<a href="javascript:void(0);" class="initial" tabIndex="1004">ン</a>\
</div>\
<div class="kanji">\
<a href="javascript:void(0);" class="initial" tabIndex="1004">漢字</a>\
</div>\
</div>\
</div>\
<div id="index_area">\
<div class="list_head">\
<div class="list_title">Index List</div>\
<div class="list_pager">\
<ul class="list_pager">\
<li class="invisible"><a id="firstPageIcn" tabIndex="1005" href="javascript:void(0);"><img src="./img/png/page_first.png" width="32" height="22" alt="<<" title="<<"></a></li>\
<li><a id="firstPageIcn_g" tabIndex="1005" href="javascript:void(0)"><img src="./img/png/page_first_g.png" width="32" height="22" alt="<<" title="<<"></a></li>\
<li class="invisible"><a id="prevPageIcn" tabIndex="1006" href="javascript:void(0);"><img src="./img/png/page_prev.png" width="32" height="22" alt="<" title="<"></a></li>\
<li><a id="prevPageIcn_g" tabIndex="1006" href="javascript:void(0)"><img src="./img/png/page_prev_g.png" width="32" height="22" alt="<" title="<"></a></li>\
<li class="invisible"><a id="nextPageIcn" tabIndex="1007" href="javascript:void(0);"><img src="./img/png/page_next.png" width="32" height="22" alt=">" title=">"></a></li>\
<li><a id="nextPageIcn_g" tabIndex="1007" href="javascript:void(0)"><img src="./img/png/page_next_g.png" width="32" height="22" alt=">" title=">"></a></li>\
<li class="invisible"><a id="lastPageIcn" tabIndex="1008" href="javascript:void(0);"><img src="./img/png/page_last.png" width="32" height="22" alt=">>" title=">>"></a></li>\
<li><a id="lastPageIcn_g" tabIndex="1008" href="javascript:void(0)"><img src="./img/png/page_last_g.png" width="32" height="22" alt=">>" title=">>"></a></li>\
</ul>\
</div>\
<div class="list_count" id="index_list_count"></div>\
</div>\
<div id="index_list"></div>\
</div>\
</div>\
<div id="index_search_foot">\
<input class="button_style" type="button" id="okBtn" tabIndex="1010" value="OK">\
<input class="button_style" type="button" id="cancelBtn" tabIndex="1011" value="Cancel">\
</div>\
</div>',
    CONST_CONTENTS_FIXED_HEAD: '\
<div id="header_head">\
<div id="head_buttons">\
<input type="button" class="button_style" id="btn_print" value="Print">\
</div>\
<div id="navigation">\
<p>\
<a href="javascript:void(0);" class="link" id="lnk_close">Exit</a>\
</p>\
</div>\
</div>',
    CONST_INDEX_COUNT:                '{1}-{2} of {0}',
    CONST_INDEX_EMPTY_COUNT:          '{0}',
    CONST_INDEX_PAGE_COUNT:           '[NUM]',
    CONST_INDEX_PAGER_FIRST:          'First',
    CONST_INDEX_PAGER_PREV:           'Prev',
    CONST_INDEX_PAGER_NEXT:           'Next',
    CONST_INDEX_PAGER_LAST:           'Last',
    CONST_SEARCH_OPTION_REPAIR:       'Repair Manual',
    CONST_SEARCH_OPTION_ALL:          'All',
    CONST_SEARCH_OPTION_LAYOUT:       'Parts Location/Components',
    CONST_SEARCH_OPTION_TROUBLE:      'Troubleshoot (DTC Chart/Problem Symptoms)',
    CONST_SEARCH_OPTION_REMOVE:       'Removal/Installation/Disassembly/Replacement/Adjustment',
    CONST_SEARCH_OPTION_MAINTENANCE:  'Inspection/ON-Vehicle Inspection',
    CONST_SEARCH_OPTION_CUSTOM:       'Customize Parameters',
    CONST_SEARCH_OPTION_PREPARED:     'Preparation',
    CONST_SEARCH_OPTION_OTHER:        'Others',
    CONST_SEARCH_OPTION_NCF:          'New Car Features',
    CONST_SEARCH_OPTION_EWD:          'Electrical Wiring Diagram',
    CONST_SEARCH_OPTION_BRM:          'Body Repair Manual',
    CONST_SEARCH_OPTION_OM:           'Owner\'s Manual',
    CONST_SEARCH_OPTION_WEL:          'Welcab Manual',
    CONST_SEARCH_OPTION_RES:          'Hybrid Rescue Manual',
    CONST_SEARCH_OPTION_ERG:          'Emergency Response Guide',
    CONST_SEARCH_OPTION_DM:           'Hybrid Vehicle Dismantling Manual',
    CONST_SEARCH_OPTION_RESET:        'Reset',
    CONST_SEARCH_OPTION_ENTRY:        'OK',
    CONST_SEARCH_OPTION_CLOSE:        'Cancel',
    CONST_CAR_INFO_DESTINATION:       'Destination',
    CONST_CAR_INFO_BRAND:             'Brand',
    CONST_CAR_INFO_MODEL:             'Model',
    CONST_CAR_INFO_GENERALCODE:       'General Code',
    CONST_CAR_INFO_OPTION:            'Option',
    CONST_CAR_INFO_PRODUCTIONDATE:    'Production Date',
    CONST_CAR_INFO_LANGUAGE:          'Language',
    CONST_TOP_BIND_MANUALS_DATE:      'Release Date : ',
    CONST_MANUAL_NAME_RM:             'Repair Manual',
    CONST_MANUAL_NAME_NM:             'New Car Features',
    CONST_MANUAL_NAME_EM:             'Electrical Wiring Diagram',
    CONST_MANUAL_NAME_BM:             'Body Repair Manual',
    CONST_MANUAL_NAME_OM:             'Owner\'s Manual',
    CONST_MANUAL_NAME_WC:             'Welcab Manual',
    CONST_MANUAL_NAME_HR:             'Hybrid Rescue Manual',
    CONST_MANUAL_NAME_ER:             'Emergency Response Guide',
    CONST_MANUAL_NAME_DM:             'Hybrid Vehicle Dismantling Manual',
    CONST_SERVICE_TAB_NAME_SR:        'Results',
    CONST_SERVICE_TAB_NAME_RM:        'Repair Manual',
    CONST_SERVICE_TAB_NAME_NM:        'New Car Features',
    CONST_SERVICE_TAB_NAME_EM:        'Electrical Wiring Diagram',
    CONST_SERVICE_TAB_NAME_BM:        'Body Repair Manual',
    CONST_SERVICE_TAB_NAME_OM:        'Owner\'s Manual',
    CONST_SERVICE_TAB_NAME_WC:        'Welcab Manual',
    CONST_SERVICE_TAB_NAME_HR:        'Hybrid Rescue Manual',
    CONST_SERVICE_TAB_NAME_ER:        'Emergency Response Guide',
    CONST_SERVICE_TAB_NAME_DM:        'Hybrid Vehicle Dismantling Manual',
    CONST_SERVICE_TAB_NAME_RF:        'Reference Information',
    CONST_RESULT_KEYWORD:             'Results For "{keyword}"',
    CONST_RESULT_KEYWORD_YOKOGUSHI:   'YOKOGUSHI Results For "{keyword}"',
    CONST_RESULT_NUMBER:              '{min}-{max} of {all}',
    CONST_RESULT_RM:                  'Repair Manual({result})',
    CONST_RESULT_NM:                  'New Car Features({result})',
    CONST_RESULT_EM:                  'Electrical Wiring Diagram({result})',
    CONST_RESULT_BM:                  'Body Repair Manual({result})',
    CONST_RESULT_OM:                  'Owner\'s Manual({result})',
    CONST_RESULT_WC:                  'Welcab Manual({result})',
    CONST_RESULT_HR:                  'Hybrid Rescue Manual({result})',
    CONST_RESULT_ER:                  'Emergency Response Guide({result})',
    CONST_RESULT_DM:                  'Hybrid Vehicle Dismantling Manual({result})',
    CONST_RESULT_KEYWORD_LEN:         '28',
    CONST_CONTENTS_FIXED_HEAD:        '<div id="header_head"><div id="head_buttons"><input type="button" class="button_style" id="btn_print" value="Print"></div><div id="navigation"><p><a href="javascript:void(0);" class="link" id="lnk_close">Exit</a></p></div></div>',
    CONST_CONTENTS_FIXED_FOOT:        '&copy; 2012 TOYOTA MOTOR CORPORATION. All Rights Reserved.',
    CONST_README_TTL:                 'Read Me First',
    CONST_DEFKEYROWD:                 'Keyword',
    CONST_KEYWORD_NM:                 'Keyword',
    CONST_LANGLIST_U:                 'North America',
    CONST_LANGLIST_J:                 'Japan',
    CONST_LANGLIST_E:                 'Europe and General'
};

/**
 * 初期化
 */
Dict.$init = function() {
  var METHODNAME = 'Dict.$init';
  try {

    var len = DictConst.Keys.length;
    //DictConstの定義を言語ごとの定義にセット
    for(var i = 0; i < len; i++) {
      var key = DictConst.Keys[i];
      Dict[key] = DictConst[key];
    }

  } catch(err) {
    Use.SystemError.$show(err, METHODNAME);
  }
};
