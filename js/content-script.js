
function iTranslation_getSelected() {
    if (window.getSelection) {
        return window.getSelection();
    }
    else if (document.getSelection) {
        return document.getSelection();
    }
    else {
        var selection = document.selection && document.selection.createRange();
        if (selection.text) {
            return selection.text;
        }
        return false;
    }
}

function escapeHTML (unsafe_str) {
    return unsafe_str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;')
      .replace(/\//g, '&#x2F;')
}

document.addEventListener("mousedown", function(event){
    if (event.button !== 2) {
        return false;
    }
    var selected = iTranslation_getSelected().toString();
        if(event.button == 2 && selected != '') {
            //get selected text and send request to bkgd page to create menu
            chrome.extension.sendMessage({
                    'message': 'updateContextMenu', 
                    'selectText':selected,
                    'selection': true});
        } else {
        chrome.extension.sendMessage({
                    'message': 'updateContextMenu',
                    'selection': false});
        }
}, true);

// 划词翻译
var iTranslation_popup = document.createElement("span");
iTranslation_popup.setAttribute("class","iTranslation-popup-tag");
iTranslation_popup.setAttribute("id","iTranslation-popup-tag-id");
document.querySelector("html").appendChild(iTranslation_popup);
document.addEventListener("mouseup", function(event){
     chrome.storage.sync.get(['disabled'],function(obj) {
        if(obj && obj.disabled){
            iTranslation_popup.style.display='none';
            iTranslation_popup.style.top=event.pageY+"px";
            iTranslation_popup.style.left=event.pageX+"px";
            return false;
        }
        if (event.button !== 0) {
            return false;
        }
        var selected = iTranslation_getSelected().toString();
            if(event.button ==0 && selected != '') {
                //get selected text and send request to bkgd page to create menu
                iTranslation_popup.style.display='block';
                iTranslation_popup.style.top=event.pageY+"px";
                iTranslation_popup.style.left=event.pageX+"px";
                chrome.extension.sendMessage({
                    'message': 'translate', 
                    'selectText':selected,
                    'type':'youdao-api',
                    'way':null,
                    'origin':'content',
                    'selection': true});
                iTranslation_popup.innerHTML=chrome.i18n.getMessage('search');
            } else {
                iTranslation_popup.style.display='none';
            }
    });
}, true);


// 接受翻译字段
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'contentTranslateResult') {
        if (request.selection) {
            iTranslation_popup.style.display='block';
            iTranslation_popup.style["z-index"]=1200;
            iTranslation_popup.innerHTML=escapeHTML(request.selectText);
        } 
    }  else if (request.message == 'menusClickTranslateResult') {
        if (request.selection) {
            iTranslation_popup.style.display='block';
            iTranslation_popup.style["z-index"]=1200;
            iTranslation_popup.innerHTML=escapeHTML(request.selectText);
        } 
    } else {
        sendResponse({});
    }
});


