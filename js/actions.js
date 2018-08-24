let open = document.getElementById('open');
let translationBtn = document.getElementById('translation');
let translationInput = document.getElementById('translationInput');
let translationRes = document.getElementById('res');
let translationType = document.getElementById('type');
let translationPoweredBy = document.getElementById('poweredBy');
let translationPoweredByLink = document.getElementById('poweredByLink');

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
    let way ;
    if(hasChinese(translationInputValue)){
        // zh -> en 
        way ="zh-en";
    } else {
        // en -> zh
        way ="en-zh"; 
    }
    switch (translationType.value) {
        case 'youdao':
            translation('youdao',translationInputValue,way).then(function(res){
                translationRes.value = res;
            });
            break;
        case 'yandex':
            translation('yandex',translationInputValue,way).then(function(res){
                translationRes.value = res;
            });
            break;
    
        default:
            translation('youdao',translationInputValue,way).then(function(res){
                translationRes.value = res;
            });
            break;
    }
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