let open = document.getElementById('open');
let translation = document.getElementById('translation');
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


translation.onclick = function(element) {
    let translationInputValue = translationInput.value;
    let i = Math.floor(Math.random()*10000);
    let url, way ;
    if(hasChinese(translationInputValue)){
        // zh -> en 
        way ="zh-en";
    } else {
        // en -> zh
        way ="en-zh"; 
    }
    url = `https://translate.yandex.net/api/v1/tr.json/translate?id=75e430e4.5b7fc0b1.38ab805c-30-${i}&srv=tr-text&lang=${way}&reason=auto`
    request('post',url,{
        text:translationInputValue,
        option:4,
    }).then(function(res){
        resJson = JSON.parse(res);
        translationRes.value = resJson.text[0];
    },function(rej){
        translationRes.value = translationInputValue;
    })

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