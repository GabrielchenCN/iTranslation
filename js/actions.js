let open = document.getElementById('open');
let translationBtn = document.getElementById('translation');
let translationInput = document.getElementById('translationInput');
let translationRes = document.getElementById('res');
let translationType = document.getElementById('type');
let translationPoweredBy = document.getElementById('poweredBy');
let translationPoweredByLink = document.getElementById('poweredByLink');
let translationEnabledCheckbox = document.getElementById('cb1');
let translationAppid = document.getElementById('appid');
let translationAppkey = document.getElementById('appkey');
let translationEditAppBtn = document.getElementById('editappp');
let translationAppDetails = document.getElementById('appdetail');

window.onload = function() {
    console.log("onload" + Date())
    translationInput.focus();  
    document.execCommand('paste');
    translationRes.value = chrome.i18n.getMessage('search');
    if(translationInput.value){
        translationBtn.click();
    };

    translationType.addEventListener('change',function(e){
        console.log(e);
        let PoweredObj ={
            "youdao":{
                "text":"Youdao",
                "link":"http://ai.youdao.com/product-fanyi.s",
            },
            "yandex":{
                "text":"Yandex.Translate",
                "link":"http://translate.yandex.com/",
            }
        };
        translationPoweredByLink.setAttribute("href",PoweredObj[e.target.value].link);
        translationPoweredByLink.innerHTML=PoweredObj[e.target.value].text;
    });


    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.msg == "getDisabled") {
            sendResponse({disabled: global.disabled});
            return true;
        }
    });

    // 检查取词翻译状态
    chrome.storage.sync.get(['disabled'], function(obj) {
        if(obj && obj.disabled){
            translationEnabledCheckbox.checked = false
        }else {
            translationEnabledCheckbox.checked = true;
        }
    });
    //appid和key 本地存储
    // 检查有道翻译的api配置
    chrome.storage.local.get(['appid'], function(obj) {
        if(obj && obj.appid){
            translationAppid.value = obj.appid
        }else {
            translationAppid.value = '';
        }
    });

    chrome.storage.local.get(['appkey'], function(obj) {
        if(obj && obj.appkey){
            translationAppkey.value = obj.appkey
        }else {
            translationAppid.value = '';
        }
    });
}

// 取词翻译控制

translationEnabledCheckbox.onchange = function(e) {
    console.log(e.target.checked);
    chrome.storage.sync.set({disabled: !e.target.checked}, function() {
        console.log('disable the extension in the content script');
     });
}
// app信息编辑开关
translationEditAppBtn.onclick=function(e) {
    translationAppDetails.open=!translationAppDetails.open;
    translationAppid.disabled = !translationAppid.disabled;
    translationAppkey.disabled = !translationAppkey.disabled;
}
//appid和key 本地存储
translationAppid.onblur = function(e) {
    console.log('translationAppid',e.target.value);
    chrome.storage.local.set({appid: e.target.value}, function() {
        console.log('disable the extension in the content script');
     });
}
translationAppkey.onblur = function(e) {
    console.log('translationAppkey',e.target.value);
    chrome.storage.local.set({appkey: e.target.value}, function() {
        console.log('disable the extension in the content script');
     });
}


open.onclick = function(element) {
    let translationInputValue = translationInput.value;
    // temp
    if(hasChinese(translationInputValue)){
        // zh -> en 
        chrome.tabs.create({url: 'https://translate.google.cn/#zh-CN/en/' + encodeURI(translationInputValue)});
    } else {
        // en -> zh
        chrome.tabs.create({url: 'https://translate.google.cn/#en/zh-CN/' + encodeURI(translationInputValue)});
    }
    
};



translationBtn.onclick = function(element) {
    let translationInputValue = translationInput.value;
    // 交给background脚本请求
    chrome.extension.sendMessage({
        'message': 'translate', 
        'selectText':translationInputValue,
        'type':translationType.value,
        'way':null,
        'origin':'popup',
        'selection': true});
    // request('get','https://translate.google.cn/translate_a/single',{
    //     client:"t",
    //     sl:"en",
    //     tl:"zh-CN",
    //     hl:"en",
    //     dt:"at",
    //     ie:"UTF-8",
    //     oe:"UTF-8",
    //     source:"btn",
    //     tk:"643942.1004232",
    //     q:"hello",
    // }).then(function(res){
    //     translationRes.value = res;
    // },function(rej){
    //     translationRes.value = translationInputValue;
    // })

    
};

// 监听background脚本返回数据
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'translateResult') {
        if (request.selection) {
            translationRes.value=request.selectText;
        } 
    }  else {
        sendResponse({});
    }
});