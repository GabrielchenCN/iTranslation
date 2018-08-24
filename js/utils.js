function hasChinese(s){
    var reg=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if(!reg.exec(s)){
        return false;
    }
    else{
        return true;
    }
}

function translationByGoogle(text,way) {
    
}

function translationByYandex(text,way) {
    let i = Math.floor(Math.random()*10000);
    url = `https://translate.yandex.net/api/v1/tr.json/translate?id=75e430e4.5b7fc0b1.38ab805c-30-${i}&srv=tr-text&lang=${way}&reason=auto`
    return request('post',url,{
        text:text,
        option:4,
    }).then(function(res){
        resJson = JSON.parse(res);
        return resJson.text[0];
    },function(rej){
        return text;
    })
}

function translation(engine,text,way) {
    switch (engine) {
        case 'google':
            return translationByGoogle(text,way);  
        case 'yandex':
            return translationByYandex(text,way); 
        default:
            return translationByYandex(text,way); 
    }
}