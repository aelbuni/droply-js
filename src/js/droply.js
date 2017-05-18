/*
 * jQuery droply Plugin; v2017FEB12
 * https://www.itechflare.com/
 * Copyright (c) 2015-2017 iTechFlare; Licensed: GPL + MIT
 * Version : v1.7.1
 * Developer: (mindsquare)
 */

jQuery.noConflict();

(function($) {

    // The Droply plugin
    $.fn.droply = function(options) {

        var mainNode = this;
        var gIndex = 0;
        var mimeImage;
        // The module pattern
        var droply = {
            init: function() {
                droply.config = $.extend({
                    allowedFileSize: 1024 * 1024 * 10, // (10 MB)
                    delay: 5000,
                    progressSpeed: 10,
                    multi: true,
                    request: [],
                    url: "processMultipleUploads.php",
                    dataType: "json",
                    limitNumberofFiles: 10,
                    required: "false",
                    formRequired: "false",
                    enforceInfo: false,
                    enterTitleLbl: 'Enter Upload Title',
                    enterDescLbl: 'Enter Upload Description',
                    enterEmailLbl: 'Enter your email',
                    enterName: 'Enter your name',
                    label: 'Allowed file types are gif, jpg, and png.',
                    dropBox: { title: 'Drop files here', height: 100, fontSize: 26 },
                    stableUploadLbl: 'Everything going well so far!',
                    uploadBtnLbl: 'Upload',
                    previewBtnLbl: 'Preview',
                    deleteBtnLbl: 'Delete',
                    deleteConfirmLbl: 'Are you sure you want to delete the file?',
                    backgroundIcon: '',
                    chunkSize: 1024 * 1024 * 5,
                    maxUploadSize: 1024 * 1024 * 16,
                    chunkUpload: true,
                    debug: false,
                    dragDrop: true,
                    circularDropbox: false,
                    theme: 'simplex',
                    targetOutput: '.output',
                    type: "post",
                    devDebug: false,
                    nonce: '',
                    disablePreview: false,
                    disablePostProgressAnimation: true,
                    disableRemovingItems: true,
                    backgroundColor: '',
                    logoColor: 'rgb(150, 155, 255)',
                    textColor: '#DADADA',
                    borderColor: '#DADADA',
                    labelColor: 'rgb(90, 90, 90)',
                    progressBarColor: 'orange',
                    action: 'itech_droply_submission',
                    beforeSubmit: droply.beforeSubmit,
                    successfulUpload: droply.successfulUpload,
                    failedUpload: droply.failedUpload,
                    fileDeleted: droply.fileDeleted,
                    injectPostData: droply.injectPostData
                }, options);

                droply.Setup();
                $(droply.config.targetOutput).hide();
            },
            Setup: function() {
                var multiElm = '';
                var hiddenInputStyle = '';
                var circularDropboxClass = '';
                var formRequired = '';
                // These variables are for background image icon
                var background = '',
                    backgroundSpn = '',
                    backgroundPadding = '';
                if (droply.config.backgroundIcon != '') {
                    background = '; background-image: url(' + droply.config.backgroundIcon + '); background-size: auto; background-position: 50% 20%; background-repeat: no-repeat;';
                    backgroundPadding = ";padding-top:" + droply.config.dropBox.height + "px;";
                } else {
                    backgroundSpn = '<span class="droply-showcase droply-icon droply-icon-cloud-storage" style="color:' + droply.config.logoColor + '"></span>';
                }
                if (droply.config.multi) {
                    multiElm = 'multiple';
                }
                if (droply.config.dragDrop != 'false') {
                    hiddenInputStyle = 'opacity:0';
                }
                if (droply.config.circularDropbox == 'true') {
                    circularDropboxClass = 'droply-circular-dropbox';
                }
                if (droply.config.formRequired == "true") {
                    formRequired = 'required';
                }

                var wpSecurity = '';
                var label = '<p class="droply-label" style="color:' + droply.config.labelColor + '">' + droply.config.label + '</p>';
                var uploadHiddenInput = '<input class="droply-multi-file-input" type="file" style="' + hiddenInputStyle + '" name="files[]" id="' + mainNode.attr("id") + '-droply-files" ' + multiElm + ' ' + formRequired + '>';
                var uploadInputs = '<div><div id="droply-filedrag-' + mainNode.attr("id") + '" class="droply-filedrag ' + circularDropboxClass + '" style="color: ' + droply.config.textColor + ';border: 5px dashed ' + droply.config.borderColor + ';' + background + '">' + backgroundSpn + '<br/><div style="' + backgroundPadding + ';font-size:' + droply.config.dropBox.fontSize + 'px" class="droply-box-label" id="box-label-' + mainNode.attr("id") + '" >' + droply.config.dropBox.title + '</div>' + uploadHiddenInput + '</div><br/>' + label + '</div>';
                var shiftDown = '<br/>';
                var droplyListItem = '<div id="' + mainNode.attr('id') + '-ListItem" class="droply-multi-images"></div>';
                mainNode.addClass('droply-multiple-upload');

                if (droply.config.dragDrop != 'false') {
                    mainNode.html(wpSecurity + uploadInputs + droplyListItem);
                } else {
                    mainNode.html(wpSecurity + uploadHiddenInput + droplyListItem);
                }
            },
            bytesToSize: function(bytes) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return '0 Bytes';
                var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
            },
            bytesToSizeClass: function(bytes) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return '0 Bytes';
                var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

                var sizeClass = {
                    size: Math.round(bytes / Math.pow(1024, i), 2),
                    type: sizes[i]
                };

                return sizeClass;
            },
            successfulUpload: function(result) { // Handle event
            },
            failedUpload: function(result) { // Handle event
            },
            injectPostData: function() { // Handle event
            },
            fileDeleted: function(data) {
                var indx = data.fileIdx;
                // Send delete request
                $.ajax({
                    url: droply.config.url,
                    type: "POST",
                    data: data,
                    success: function(data) {
                        // Handle successful delete
                        outputMessage(data);
                    }
                });
            },
            beforeSubmit: function(file, indx) {
                var data = [];
                var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
                var is_safari = navigator.userAgent.indexOf("Safari") > -1;
                if ((is_chrome) && (is_safari)) { is_safari = false; }

                //check whether browser fully supports all File API
                if (window.File && window.FileReader && window.FileList && window.Blob) {
                    var fsize = file.size; //get file size
                    var ftype = file.type; // get file type

                    //allow only valid MIME file types 
                    switch (ftype) {
                        case 'application/octet-stream':
                        case 'application/postscript':
                        case 'image/png':
                        case 'image/gif':
                        case 'image/jpeg':
                        case 'image/pjpeg':
                        case 'image/x-png':
                        case 'image/jpg':
                        case 'image/x-windows-bmp':
                        case 'image/bmp':
                        case 'image/tiff':
                        case 'image/x-tiff':
                        case 'image/svg+xml': // images
                            mimeImage = "droply-icon-photo";
                            break;
                        case 'audio/aac':
                        case 'audio/mp4':
                        case 'audio/mp3':
                        case 'audio/ogg':
                        case 'audio/wav':
                        case 'audio/webm': // Audio
                            mimeImage = "droply-icon-music";
                            break;
                        case 'video/mp4':
                        case 'video/ogg':
                        case 'video/webm':
                        case 'video/avi':
                        case 'video/mkv':
                        case 'video/x-matroska': // Video
                            mimeImage = "droply-icon-video2";
                            break;
                        case 'application/x-zip-compressed':
                        case 'application/zip':
                        case 'application/x-rar-compressed':
                            mimeImage = "droply-icon-wallet";
                            break;
                        default:
                            mimeImage = "droply-icon-file";
                    }

                    //Allowed file size is less than 1 MB (1048576)
                    if (fsize > droply.config.allowedFileSize) {
                        data.status = false;
                        data.responseText = droply.bytesToSize(fsize) + ": The file size has exceeded the limit (" + droply.config.allowedFileSize / 1024 / 1024 + "MB) !";

                        return data;
                    }

                    data.status = true;
                    return data;
                } else {
                    //Output error to older unsupported browsers that doesn't support HTML5 File API
                    data.status = false;
                    data.responseText = "Please upgrade your browser, because your current browser lacks some new features we need!";
                    return data;
                }

                data.status = true;
                return data;
            },
            deleteItem: function(indx) {
                var data = {
                    'droply-id': mainNode.attr('id'),
                    'command': 'delete',
                    'droplyfn': window.btoa(mainNode.find('#' + indx + '-fileName').text()),
                    'fileIndx': indx,
                    'action': droply.config.action,
                    'nonce': droply.config.nonce,
                    'raqmkh': window.btoa(mainNode.find('#file-' + indx + '-' + mainNode.attr("id")).val())
                };

                // Trigger delete event
                droply.config.fileDeleted(data);

                $('#uploadItem-' + mainNode.attr("id") + '-' + indx).addClass("droply-animated bounceOutRight");
                setTimeout(function(e) {
                    $("#uploadItem-" + mainNode.attr("id") + '-' + indx).remove();
                }, 600);
            },
            addFileItem: function(fileName, indx) {
                var required = '';
                var previewElement = '';
                var previewInput = '';
                if (!droply.config.disablePreview) {
                    previewElement = '<a rel="external" link="" id="preview-' + mainNode.attr("id") + '-' + indx + '" index="' + indx + '" class="droply-preview"><span class="droply-icon droply-icon-earth" title="' + droply.config.previewBtnLbl + '"></span></a>';
                    previewInput = '<a class="droply-button droply-preview" index="' + indx + '" >' + droply.config.previewBtnLbl + '</a>';
                }
                if (droply.config.required == 'true') {
                    required = 'required';
                }

                var hiddenInput = '<input type="hidden" id="file-' + indx + '-' + mainNode.attr("id") + '" name="image-id[]" value="" />';
                var infoBox = '<div id="droply-info-box-' + indx + '" class="droply-info-box"><div class="droply-info-p"><a class="droply-close" index="' + indx + '"><span class="droply-info-close droply-icon droply-icon-delete"></span></a><div class="droply-info-internal-content">' + droply.config.stableUploadLbl + '</div></div><div class="droply-pointer"></div></div>';
                var infoForm = '<div class="clearfix droply-form-container"><input class="droply-input" type="text" name="droply-title" placeholder="' + droply.config.enterTitleLbl + '" ' + required + '/><br>' +
                    '<textarea rows="2" class="droply-input" type="textarea" name="droply-desc" placeholder="' + droply.config.enterDescLbl + '" ' + required + '/>' +
                    '<a class="droply-button droply-upload noselect" id="upload-button-' + indx + '-' + mainNode.attr("id") + '" index="' + indx + '">' + droply.config.uploadBtnLbl + '</a>' +
                    '<a class="droply-button droply-delete noselect" id="' + indx + '">' + droply.config.deleteBtnLbl + '</a>' +
                    previewInput + '</div>';

                if (!droply.config.enforceInfo) {
                    infoForm = '';
                }

                var infoIconTri =
                    '<a class="info-icon" index="' + indx + '">' +
                    '<span class="droply-info-icon droply-icon droply-icon-info" ></span>' +
                    '</a>';
                var infoIconPlain =
                    '<a class="info-icon" index="' + indx + '" title="Information Button">' +
                    '<span class="droply-icon droply-icon-info-large"></span>' +
                    '</a>';

                // Theme-1
                var uploadListItemDefault =
                    '<div id="uploadItem-' + mainNode.attr("id") + '-' + indx + '" class="droply-default-theme">' +
                    '<div class="droply-oval">' +
                    '<span class="droply-ready droply-icon droply-icon-plus" style="margin-top:35px;"></span>' +
                    '<span class="droply-loading droply-icon droply-icon-spinner"></span>' +
                    '<div id="mass-item-success-' + mainNode.attr("id") + '-' + indx + '" class="notification-oval">' +
                    '<ul class="droply-oval-list-info" id="mass-item-oval-info-' + mainNode.attr("id") + '-' + indx + '">' +
                    '<li class="droply-tick-text"  id="mass-item-success-text-' + mainNode.attr("id") + '-' + indx + '" style=";color:white;font-family:cursive;font-size:10px;color:white;list-style:none"></li>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '<div class="droply-list-div noselect" style="background-color:' + droply.config.backgroundColor + '" >' + hiddenInput +
                    '<div>' +
                    '<div class="droply-list-icon droply-left">' +
                    '<span id="mimePicture" class="droply-icon" style="font-size:40px"></span>' +
                    '</div>' +
                    '<div class="progress-container droply-right">' +
                    '<div id="progress-style-' + mainNode.attr("id") + '-' + indx + '" class="droply-meter ' + droply.config.progressBarColor + ' droply-right">' +
                    '<span id="massUploadProgress-' + mainNode.attr("id") + '-' + indx + '" style="width: 0%;" class="droply-span-progress"></span>' +
                    '</div>' +
                    '<div id="' + indx + '-fileName" class="droply-filename">' + fileName + '</div>' +
                    '<div class="droply-list-menu droply-right">' +
                    '<ul>' +
                    '<li>' +
                    '<a class="droply-delete" id="' + indx + '">' +
                    '<span class="droply-icon droply-icon-remove" title="' + droply.config.deleteBtnLbl + '"></span>' +
                    '</a>&nbsp;' +
                    previewElement +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' + infoIconTri +
                    '</div>' +
                    '</div>' + infoForm +
                    '</div>';

                // Theme-2
                var uploadListItemSimplex = '<div id="uploadItem-' + mainNode.attr("id") + '-' + indx + '" class="theme-1">' +
                    '<div class="droply-list-div noselect" style="background-color:' + droply.config.backgroundColor + '">' +
                    hiddenInput +
                    '<div>' +
                    '<div class="progress-container droply-left">' +
                    '<div id="progress-style-' + mainNode.attr("id") + '-' + indx + '" class="droply-meter ' + droply.config.progressBarColor + ' droply-left">' +
                    '<span id="massUploadProgress-' + mainNode.attr("id") + '-' + indx + '" style="width: 0%;" class="droply-span-progress"></span>' +
                    '</div>' +
                    '<div id="' + indx + '-fileName" class="droply-filename">' + fileName + '</div>' +
                    '</div>' +
                    '<div class="droply-list-menu droply-right">' +
                    '<ul>' +
                    '<li>' +
                    '<a class="droply-delete" id="' + indx + '"><span class="droply-icon droply-icon-remove" title="' + droply.config.deleteBtnLbl + '"></span></a>&nbsp;' +
                    previewElement + '&nbsp;' +
                    infoIconPlain +
                    '<div class="droply-oval">' +
                    '<span class="droply-ready droply-icon droply-icon-plus"></span>' +
                    '<span class="droply-loading droply-icon droply-icon-spinner" style="display: none;"></span>' +
                    '<div id="mass-item-success-' + mainNode.attr("id") + '-' + indx + '" class="notification-oval" style="margin-top: 1px">' +
                    '<ul class="droply-oval-list-info" id="mass-item-oval-info-' + mainNode.attr("id") + '-' + indx + '">' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="droply-list-icon droply-right">' +
                    '<span id="mimePicture" class="droply-icon" style="font-size:40px"></span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' + infoForm +
                    '</div>';

                // Theme-3
                var uploadListItemSuperSimple = '<div id="uploadItem-' + mainNode.attr("id") + '-' + indx + '" class="theme-2">' +
                    '<div class="droply-list-div noselect" style="background-color:' + droply.config.backgroundColor + '">' +
                    hiddenInput +
                    '<div>' +
                    '<div class="progress-container droply-left">' +
                    '<div id="progress-style-' + mainNode.attr("id") + '-' + indx + '" class="droply-meter ' + droply.config.progressBarColor + ' droply-right">' +
                    '<span id="massUploadProgress-' + mainNode.attr("id") + '-' + indx + '" style="width: 0%;" class="droply-span-progress"></span>' +
                    '</div>' +
                    '<div id="' + indx + '-fileName" class="droply-filename">' + fileName + '</div>' +
                    '</div>' +
                    '<div class="droply-list-menu droply-right">' +
                    '<ul>' +
                    '<li>' +
                    '<a class="droply-delete" id="' + indx + '"><span class="droply-icon droply-icon-remove" title="' + droply.config.deleteBtnLbl + '"></span></a>&nbsp;' +
                    previewElement +
                    '<a class="info-icon" index="' + indx + '" title="Information Button"><span class="droply-icon droply-icon-info-large"></span></a>' +
                    '<div class="droply-oval">' +
                    '<span class="droply-ready droply-icon droply-icon-plus"></span>' +
                    '<span class="droply-loading droply-icon droply-icon-spinner" style="display: none;"></span>' +
                    '<div id="mass-item-success-' + mainNode.attr("id") + '-' + indx + '" class="notification-oval">' +
                    '<ul class="droply-oval-list-info" id="mass-item-oval-info-' + mainNode.attr("id") + '-' + indx + '">' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>' + infoForm +
                    '</div>';

                var selectedTheme = uploadListItemSimplex;

                // Switch theme
                switch (droply.config.theme) {
                    case 'default':
                        selectedTheme = uploadListItemDefault;
                        break;
                    case 'simplex':
                        selectedTheme = uploadListItemSimplex;
                        break;
                    case 'super-simplex':
                        selectedTheme = uploadListItemSuperSimple;
                        break;
                    default:
                        selectedTheme = uploadListItemSimplex;
                }

                $('#' + mainNode.attr('id') + '-ListItem').prepend(selectedTheme);

                // Insert infoBox right after body
                jQuery('body').prepend(infoBox);

                // Disable plus sign if info form is not forced
                if (!droply.config.enforceInfo) {
                    $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('.droply-loading').css('display', 'block');
                    $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('.droply-ready').hide();
                }

                var diff = $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('.droply-oval').height() - $('#mass-item-success-' + mainNode.attr("id") + '-' + indx).height();
                $('#mass-item-success-' + mainNode.attr("id") + '-' + indx).css('margin-top', (diff / 2) + 'px');

                // Click delete handler
                $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('a.droply-delete').click(function() {
                    var confirmation = confirm(droply.config.deleteConfirmLbl);
                    if (confirmation) {
                        var indx = $(this).attr('id');
                        droply.deleteItem(indx);
                    }
                });

                var xOffset, yOffset;
                if (droply.config.theme == 'default') {
                    yOffset = -35;
                    xOffset = +25;
                } else {
                    yOffset = +25;
                    xOffset = -100;
                }

                // Info icon click event handler
                $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('a.info-icon').click(function(e) {
                    $('#droply-info-box-' + indx).css('top', e.pageY + yOffset);
                    $('#droply-info-box-' + indx).css('left', e.pageX + xOffset);
                    $('#droply-info-box-' + indx).slideDown();
                });

                // Info-box close click event handler
                $('#droply-info-box-' + indx).find('a.droply-close').click(function(e) {
                    var indx = $(this).attr('index');
                    $('#droply-info-box-' + indx).slideUp();
                });
                $(document).mouseup(function(e) {
                    var container = $('.droply-info-box');

                    if (!container.is(e.target) // if the target of the click isn't the container...
                        &&
                        container.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        container.hide();
                    }
                });

                // Click preview handler
                $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('a.droply-preview').click(function() {
                    var indx = $(this).attr('index');
                    if ($('#preview-' + mainNode.attr("id") + '-' + indx).attr('link') != "") {
                        window.open($('#preview-' + mainNode.attr("id") + '-' + indx).attr('link'), '_blank');
                    }
                });

                if (droply.config.enforceInfo) {
                    $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('a.droply-upload').click(function() {
                        if (droply.config.devDebug == true) {
                            console.log('Upload[' + indx + '] initiated by upload click');
                            console.log(droply.config.request);
                        }

                        var indx = $(this).attr('index');
                        var titleObj = $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('input[name="droply-title"]');
                        var descObj = $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('textarea[name="droply-desc"]');

                        var title = titleObj.val();
                        var desc = descObj.val();

                        if (typeof title === "undefined" || title == '' && droply.config.required == "true") {
                            $(titleObj).focus();
                            // break
                            return false;
                        }
                        if (typeof desc === "undefined" || desc == '' && droply.config.required == "true") {
                            $(descObj).focus();
                            // break
                            return false;
                        }

                        if (droply.config.request[indx] != null) {
                            // Start uploading
                            if (droply.config.devDebug == true)
                                console.log('Upload[' + indx + '] started');
                            sendRequest(indx, title, desc);
                        } else {
                            // Already uploaded
                            if (droply.config.devDebug == true)
                                console.log('droply.config.request[' + indx + '] already uploaded');
                        }

                    });
                }
                // Fixed iOS problem				
                $('div.droply-list-div').click(function(e) {
                    e.preventDefault();
                });
            },
            tagItemSuccess: function(indx, success, msg) {
                $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('.droply-loading').hide();

                if (droply.config.devDebug == true) {
                    console.log('Success tag = [' + success + ']');
                }

                // When output an error make sure the ready-icon is removed
                if (!success) {
                    $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('.droply-ready').hide();
                }

                var successTag;
                if (!success) {
                    successTag = '<li class="droply-icon droply-icon-times center-icon" style="font-size:18px;color:white"></li>';
                    CatchError(indx, msg);
                } else {
                    $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('.droply-preview').fadeIn();
                    $('#uploadItem-' + mainNode.attr("id") + '-' + indx).find('.droply-delete').fadeIn();
                    successTag = '<li class="droply-icon droply-icon-tick center-icon" style="font-size:18px;color:white"></li>';
                }

                if ($("#mass-item-success-" + mainNode.attr("id") + '-' + indx).attr('updated') != "true") {
                    $("#mass-item-oval-info-" + mainNode.attr("id") + '-' + indx).prepend(successTag);
                    $("#mass-item-success-" + mainNode.attr("id") + '-' + indx).attr("title", msg);
                    $('#uploadItem-' + mainNode.attr("id") + '-' + indx).attr("title", msg);
                    $("#mass-item-success-" + mainNode.attr("id") + '-' + indx).addClass('droply-animated ' + (success ? 'flipNotificationSuccess' : 'flipNotificationError'));
                    $("#mass-item-success-text-" + mainNode.attr("id") + '-' + indx).html((success ? 'Succeed' : 'Failed'));
                    $("#mass-item-success-" + mainNode.attr("id") + '-' + indx).attr('updated', 'true');
                    outputMessage(msg);
                }
            },
            fileDragHover: function(e) {
                e.stopPropagation();
                e.preventDefault();

                mainNode.find("#droply-filedrag-" + mainNode.attr("id")).removeClass("hover").addClass((e.type == "dragover" ? "hover" : ""));
            }
        };

        // Initialization
        droply.init();

        var filedrag = mainNode.find("#droply-filedrag-" + mainNode.attr("id"));

        // file drop
        filedrag.on('dragover', droply.fileDragHover);
        filedrag.on('dragleave', droply.fileDragHover);
        filedrag.on('drop', fileSelectHandler);
        filedrag.css('display', 'block');

        function CatchError(indx, msg) {
            $('#droply-info-box-' + indx).find('.droply-info-internal-content').html(msg);
        }

        // Check if the dropbox of Droply has been clicked
        filedrag.click(function(e) {
            var Elem = e.target.id;
            if (Elem == "droply-filedrag-" + mainNode.attr("id")) {
                $("input[id=" + mainNode.attr("id") + "-droply-files]").click();
            }
        });

        function outputMessage(str) {
            if (droply.config.debug) {
                if ($(droply.config.targetOutput).is(":visible")) {
                    $(".output-list-" + mainNode.attr("id")).append('<li>' + str + '</li>');
                } else {
                    $(droply.config.targetOutput).html('<br><ol class="output-list-' + mainNode.attr("id") + '"><li>' + str + '</li></ol>');
                    $(droply.config.targetOutput).delay(300).slideDown();
                }
            }
        }

        function fileSelectHandler(e) {
            e.stopPropagation();
            e.preventDefault();

            mainNode.find("#droply-filedrag-" + mainNode.attr("id")).removeClass('hover').addClass('');

            // fetch FileList object
            var files = e.target.files || e.originalEvent.dataTransfer.files;

            // process all File objects
            if (droply.config.chunkUpload)
                processFilesChunk(files);
            else
                processFilesNormal(files);
        }

        function processFilesNormal(inputFiles) {
            var files = inputFiles;

            for (j = 0; j < files.length; j++) {
                if (gIndex >= droply.config.limitNumberofFiles) {
                    outputMessage('You have exceed upload limit (' + gIndex + ') !');
                    return false;
                }

                if (files[j].length == 0) {
                    continue;
                }

                var data = new FormData();
                data.append('SelectedFile', files[j]);
                data.append('action', droply.config.action);
                data.append('closify-id', mainNode.attr('closify-id'));
                data.append('closify-idx', mainNode.attr('closify-idx'));
                data.append('fileIndx', gIndex);
                data.append('nonce', droply.config.nonce);

                // Let user inject their own Post Information
                var postDataExt = droply.config.injectPostData;
                for (var key in postDataExt) {
                    data.append('droplyPostDataExt[' + key + ']', postDataExt[key]);
                }

                droply.addFileItem(files[j].name, gIndex);
                var sanitizeFile = droply.beforeSubmit(files[j], gIndex);

                // Update mime picture
                if (mimeImage == null) {
                    $('#uploadItem-' + mainNode.attr("id") + '-' + gIndex).find('#mimePicture').addClass('droply-icon-file');
                } else {
                    $('#uploadItem-' + mainNode.attr("id") + '-' + gIndex).find('#mimePicture').addClass(mimeImage);
                }

                if (sanitizeFile.status != true) {
                    // Catch errors
                    droply.tagItemSuccess(gIndex, false, sanitizeFile.responseText);
                    gIndex++;
                    continue;
                }

                var requestTemp = new XMLHttpRequest();
                droply.config.request[gIndex] = requestTemp;
                droply.config.request[gIndex].index = gIndex;
                droply.config.request[gIndex].cachedData = data;
                droply.config.request[gIndex].onreadystatechange = function() {
                    if (this.readyState == 4) {
                        // Disable loading
                        $('#uploadItem-' + mainNode.attr("id") + '-' + this.index).find('.droply-loading').css('display', 'block');
                        $('#uploadItem-' + mainNode.attr("id") + '-' + this.index).find('.droply-ready').hide();
                        try {
                            var resp = JSON.parse(this.response);

                            if (resp.status == "true") {
                                if (resp.attid) {
                                    mainNode.find('#file-' + this.index + '-' + mainNode.attr("id")).val(resp.attid);
                                }

                                droply.tagItemSuccess(this.index, true, resp.data);

                                if (resp.newFileName != null) {
                                    // Update filename
                                    $('#' + this.index + '-fileName').text(resp.newFileName);
                                }
                                if (resp.fullPath != null) {
                                    // Update preview path
                                    $('#preview-' + mainNode.attr("id") + '-' + this.index).attr('link', resp.fullPath);
                                }
                                if (droply.config.disablePostProgressAnimation == true) {
                                    if (droply.config.disablePostProgressAnimation == true) {
                                        mainNode.find('#progress-style-' + mainNode.attr("id") + '-' + this.index).addClass('droply-nostripes');
                                    }
                                    mainNode.find('#progress-style-' + mainNode.attr("id") + '-' + this.index).addClass('droply-nostripes');
                                }
                                // Trigger a successful upload event
                                droply.config.successfulUpload(resp);
                            } else {
                                droply.tagItemSuccess(this.index, false, resp.error);

                                // Trigger a failed upload event
                                droply.config.failedUpload(resp);
                                CatchError(this.index, resp.error);
                            }
                        } catch (e) {
                            // Handle errors 
                            resp = {
                                status: 'error',
                                msg: 'Response string format is not a valid JSON: [' + this.responseText + ']'
                            };
                            // Uploading failed
                            droply.tagItemSuccess(this.index, false, resp.msg);
                        }
                    }
                };

                droply.config.request[gIndex].upload.index = gIndex;

                // Progress event listener
                droply.config.request[gIndex].upload.addEventListener('progress', function(e) {
                    var progress = e.loaded / e.total * 100;
                    var index = this.index;

                    $("#massUploadProgress-" + mainNode.attr("id") + '-' + this.index).css("width", progress + '%');
                    if (progress >= 100 && !droply.config.disableRemovingItems) {
                        setTimeout(function() {
                            droply.deleteItem(index);
                        }, droply.config.delay);
                    }
                }, false);

                if (!droply.config.enforceInfo) {
                    droply.config.request[gIndex].open(droply.config.type, droply.config.url);
                    droply.config.request[gIndex].send(data);
                }
                gIndex++;
            }
            return 0;
        }

        function smartUpdateChunkSize(fileSize) {
            var sizeType = droply.bytesToSizeClass(fileSize);
            var chunkSize = droply.config.maxUploadSize;

            var ratio = Math.ceil(sizeType.size / 100);

            if (sizeType.type == "bytes") {
                chunkSize = sizeType.size / 2;
            } else if (sizeType.type == "KB") {
                chunkSize = sizeType.size / 5;
                chunkSize = chunkSize * 1024;
            } else if (sizeType.type == "MB" && sizeType.size < 60) {
                chunkSize = sizeType.size / 5 / ratio;
                chunkSize = chunkSize * 1024 * 1024;
            } else if (sizeType.type == "GB") {
                chunkSize = droply.config.maxUploadSize;
            } else if (sizeType.type == "TB") {
                chunkSize = droply.config.maxUploadSize;
            }

            return Math.ceil(chunkSize);
        }

        function processFilesChunk(inputFiles) {
            var files = inputFiles;
            // Notice: [j] index is used for files all the way, and gIndex is a global index that allow
            // request set to maintain discrete file selction and uploads from users
            for (j = 0; j < files.length; j++) {
                if (gIndex >= droply.config.limitNumberofFiles) {
                    outputMessage('You have exceed upload limit (' + gIndex + ') !');
                    return false;
                }

                if (files[j].length == 0) {
                    continue;
                }

                droply.addFileItem(files[j].name, gIndex);
                var sanitizeFile = droply.beforeSubmit(files[j], gIndex);

                // Update mime picture
                if (mimeImage == null) {
                    $('#uploadItem-' + mainNode.attr("id") + '-' + gIndex).find('#mimePicture').addClass('droply-icon-file');
                } else {
                    $('#uploadItem-' + mainNode.attr("id") + '-' + gIndex).find('#mimePicture').addClass(mimeImage);
                }

                if (sanitizeFile.status != true) {
                    // Catch errors
                    droply.tagItemSuccess(gIndex, false, sanitizeFile.responseText);
                    gIndex++;
                    continue;
                }

                var requestTemp = new XMLHttpRequest();
                droply.config.request[gIndex] = requestTemp;

                chunkSize = smartUpdateChunkSize(files[j].size);

                // Only if chunk upload is enabled
                droply.config.request[gIndex] = requestTemp;
                droply.config.request[gIndex].file = files[j];
                droply.config.request[gIndex].file_size = files[j].size;
                droply.config.request[gIndex].chunk_size = chunkSize; // 100KB
                droply.config.request[gIndex].range_start = 0;
                droply.config.request[gIndex].range_end = droply.config.request[gIndex].chunk_size;
                droply.config.request[gIndex].is_paused = false;
                droply.config.request[gIndex].chunks = Math.ceil(files[j].size / chunkSize);
                droply.config.request[gIndex].counter = 1;

                if ('mozSlice' in files[j]) {
                    droply.config.request[gIndex].slice_method = 'mozSlice';
                } else if ('webkitSlice' in files[j]) {
                    droply.config.request[gIndex].slice_method = 'webkitSlice';
                } else {
                    droply.config.request[gIndex].slice_method = 'slice';
                }

                droply.config.request[gIndex].index = gIndex;
                droply.config.request[gIndex].onreadystatechange = function() {
                    if (this.readyState == 4) {
                        // Disable loading
                        $('#uploadItem-' + mainNode.attr("id") + '-' + this.index).find('.droply-loading').css('display', 'block');
                        $('#uploadItem-' + mainNode.attr("id") + '-' + this.index).find('.droply-ready').hide();
                        try {

                            /* Handle progress bar update */
                            /*============================*/
                            var progress = this.counter / this.chunks * 100;
                            var index = this.index;

                            if (progress > 100) progress = 100;

                            // Slow down progress after 20 %
                            if (progress < 30) {
                                $("#massUploadProgress-" + mainNode.attr("id") + '-' + this.index).animate({ width: progress + '%' }, droply.config.progressSpeed);
                            } else {
                                $("#massUploadProgress-" + mainNode.attr("id") + '-' + this.index).animate({ width: progress + '%' }, droply.config.progressSpeed);
                            }

                            if (progress >= 100 && !droply.config.disableRemovingItems) {
                                setTimeout(function(e) {
                                    droply.deleteItem(index);
                                }, droply.config.delay);
                            }
                            /*============================*/

                            // Check if response is going smooth, and otherwise just terminate
                            var resp = JSON.parse(this.response);

                            if (this.range_end !== this.file_size && resp.status == "true") {
                                // Update our ranges
                                this.range_start = this.range_end;
                                this.range_end = this.range_start + this.chunk_size;

                                // Continue as long as we aren't paused
                                if (!this.is_paused) {
                                    _upload(this, '', '');
                                    return;
                                }
                            }

                            // Stop progress animation if there was an error detected
                            if (resp.status != "true") {
                                mainNode.find('#progress-style-' + mainNode.attr("id") + '-' + this.index).addClass('droply-nostripes');
                            }

                            // Enter this section either when there is an error or the file has been uploaded
                            if ((this.range_end === this.file_size) || resp.status != "true") {
                                // This will be executed once, only at the end of successful chunk upload

                                if (resp.status == "true") {
                                    if (resp.attid) {
                                        mainNode.find('#file-' + this.index + '-' + mainNode.attr("id")).val(resp.attid);
                                    }

                                    droply.tagItemSuccess(this.index, true, resp.data);

                                    if (resp.newFileName != null) {
                                        // Update filename
                                        $('#' + this.index + '-fileName').text(resp.newFileName);
                                    }
                                    if (resp.fullPath != null) {
                                        // Update preview path
                                        $('#preview-' + mainNode.attr("id") + '-' + this.index).attr('link', resp.fullPath);
                                    }
                                    if (droply.config.disablePostProgressAnimation == true) {
                                        if (droply.config.disablePostProgressAnimation == true) {
                                            mainNode.find('#progress-style-' + mainNode.attr("id") + '-' + this.index).addClass('droply-nostripes');
                                        }
                                        mainNode.find('#progress-style-' + mainNode.attr("id") + '-' + this.index).addClass('droply-nostripes');
                                    }

                                    // Remove upload button if enforced information is enabled
                                    if (droply.config.enforceInfo == "true") {
                                        mainNode.find('#upload-button-' + this.index + '-' + mainNode.attr("id")).remove();
                                    }

                                    // Trigger a successful upload event
                                    droply.config.successfulUpload(resp);
                                } else {
                                    droply.tagItemSuccess(this.index, false, resp.error);

                                    // Trigger a failed upload event
                                    droply.config.failedUpload(resp);
                                    CatchError(this.index, resp.error);
                                }
                            } else {
                                // Read if there was an error in the middle of chunk upload process
                                // This line will be repeatedly called except when the upload is finished

                                if (resp.status == "false") {
                                    droply.tagItemSuccess(this.index, false, resp.error);

                                    // Trigger a failed upload event
                                    droply.config.failedUpload(resp);
                                    CatchError(this.index, resp.error);
                                }
                            }
                        } catch (e) {
                            // Handle errors 
                            resp = {
                                status: 'error',
                                msg: 'Response string format is not a valid JSON: [' + this.responseText + ']'
                            };
                            // Uploading failed
                            droply.tagItemSuccess(this.index, false, resp.msg);
                        }
                    }
                };

                droply.config.request[gIndex].upload.index = gIndex;

                // If we are not waiting for information to be submitted, commence with uploading
                // Otherwise wait for user prompt
                if (!droply.config.enforceInfo) {
                    // Kick start to show progress
                    $("#massUploadProgress-" + mainNode.attr("id") + '-' + gIndex).animate({ width: '1%' }, droply.config.progressSpeed);
                    _upload(droply.config.request[gIndex], '', '');
                }

                gIndex++;
            }
            return 0;
        }

        function sendRequest(index, title, desc) {
            if (droply.config.devDebug == true)
                console.log('Request[' + index + '] has started');

            if (!droply.config.chunkUpload) {
                droply.config.request[index].open(droply.config.type, droply.config.url);
                droply.config.request[index].send(droply.config.request[index].cachedData);
                droply.config.request[index] = 'invalid';
            } else {
                // Kick start to show progress
                $("#massUploadProgress-" + mainNode.attr("id") + '-' + index).animate({ width: '10%' }, droply.config.progressSpeed);
                _upload(droply.config.request[index], title, desc);
            }
        }

        function _upload(request, title, desc) {
            var _this = request;
            // Timer to send chunks repeatedly
            _this.timerLoop = setTimeout(function() {
                if (droply.config.enforceInfo != "true") {
                    // Prevent range overflow
                    send_droplygold_chunk(_this, '', '');
                } else {
                    send_droplygold_chunk(_this, title, desc);
                }
            }, 20);
        }

        // Send single chunk function
        function send_droplygold_chunk(self, title, desc) {
            if (self.range_end > self.file_size) {
                self.range_end = self.file_size;
            }

            var chunk = self.file[self.slice_method](self.range_start, self.range_end);

            var data = new FormData();
            data.append('action', droply.config.action);
            data.append('closify-id', mainNode.attr('closify-id'));
            data.append('closify-idx', mainNode.attr('closify-idx'));
            data.append('fileIndx', self.index);
            data.append('nonce', droply.config.nonce);
            data.append('file-name', self.index + "_" + self.file.name);
            data.append('file-type', self.file.type);
            data.append('file-size', self.file.size);
            data.append('chunk-upload', 'true');
            data.append('chunk', self.counter);
            data.append('chunks', self.chunks);
            data.append('file', chunk);

            if (self.counter == self.chunks) {
                // Let user inject their own Post Information
                var postDataExt = droply.config.injectPostData;
                for (var key in postDataExt) {
                    data.append('droplyPostDataExt[' + key + ']', postDataExt[key]);
                }
            }

            if (droply.config.enforceInfo == "true") {
                var titleObj = $('#uploadItem-' + mainNode.attr("id") + '-' + self.index).find('input[name="droply-title"]');
                var descObj = $('#uploadItem-' + mainNode.attr("id") + '-' + self.index).find('textarea[name="droply-desc"]');

                var title = titleObj.val();
                var desc = descObj.val();

                data.append('title', title);
                data.append('desc', desc);
            }

            self.open(droply.config.type, droply.config.url, true);
            self.overrideMimeType('application/octet-stream');

            if (self.range_start !== 0) {
                self.setRequestHeader('Content-Range', 'bytes ' + self.range_start + '-' + self.range_end + '/' + self.file_size);
            }

            self.send(data);
            self.counter++;
        }

        // File choosen - event
        this.find("input[type=file]").change(function() {
            // process all File objects
            if (droply.config.chunkUpload)
                processFilesChunk(this.files);
            else
                processFilesNormal(this.files);
        });

    };

})(jQuery);
