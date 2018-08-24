let open = document.getElementById('open');
let translationBtn = document.getElementById('translation');
let translationInput = document.getElementById('translationInput');
let translationRes = document.getElementById('res');

window.onload = function() {
    console.log("onload" + Date())
    translationInput.focus();  
    document.execCommand('paste');
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
    let url, way ;
    if(hasChinese(translationInputValue)){
        // zh -> en 
        way ="zh-en";
    } else {
        // en -> zh
        way ="en-zh"; 
    }
    translation('yandex',translationInputValue,way).then(function(res){
        translationRes.value = res;
    });

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