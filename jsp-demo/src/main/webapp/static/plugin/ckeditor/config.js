/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
    config.extraPlugins = 'docprops'; //html全文
    config.extraPlugins += (config.extraPlugins ? ',lineheight' : 'lineheight');//行距
    config.filebrowserImageUploadUrl = '/adjuncts/ckeditor/file_upload';
    config.filebrowserUploadUrl = '/adjuncts/ckeditor/file_upload';
    config.filebrowserFlashUploadUrl = '/adjuncts/ckeditor/file_upload';
    config.removeButtons = 'DocProps,ShowBlocks,Strike,Subscript,Superscript,advanced,Save,NewPage,Print,Cut,Copy,Paste,PasteText,CreateDiv,PasteFromWord,Replace,Find,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,BidiLtr,BidiRtl,Language,Flash,HorizontalRule,Smiley,PageBreak,Iframe,EasyImage,About';
    config.fullPage = true;
    config.allowedContent = true;
};