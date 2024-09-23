function hasChinese(s){
    var reg=/[\u3400-\u9FBF]/gi;
    if(!reg.exec(s)){
        return false;
    }
    else{
        return true;
    }
}

function translationByGoogle(text,way) {
    
}


function translationByYoudao(text,way) {
    let url ="https://aidemo.youdao.com/trans";
    return request('post',url,{
        q:text,
        form:"Auto",
        to:"Auto",
    },{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}).then(function(res){
        let resJson = JSON.parse(res);
        return resJson.translation[0];
    },function(rej){
        return text;
    })
}


function translationByYandex(text,way) {
    let i = Math.floor(Math.random()*10000);
    let url = `https://translate.yandex.net/api/v1/tr.json/translate?id=75e430e4.5b7fc0b1.38ab805c-30-${i}&srv=tr-text&lang=${way}&reason=auto`
    return request('post',url,{
        text:text,
        option:4,
    }).then(function(res){
        let resJson = JSON.parse(res);
        return resJson.text[0];
    },function(rej){
        return text;
    })
}
