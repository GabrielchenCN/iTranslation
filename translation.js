function request(method,url,params,headers){
    console.log("starting XHR");
    let oXHR = null;
    if(window.XMLHttpRequest) {
        oXHR = new XMLHttpRequest(); 
    } else {
        return false;
    }

    if(window.Promise){
        return new Promise(function(res,rej){
            oXHR.onreadystatechange = function() {//Call a function when the state changes.
                if(oXHR.readyState == XMLHttpRequest.DONE && oXHR.status === 200) {
                    // 请求结束后,在此处写处理代码
                    res(oXHR.response);
                }else if (oXHR.readyState == XMLHttpRequest.DONE&& oXHR.status !== 200 ) {
                    rej();
                }
            }
            switch (method.toUpperCase()) {
                case 'GET':
                    oXHR.open(method,url+"?"+GenerationGetMethodParams(params));
                    setRequestHeader(oXHR,headers,method)
                    oXHR.send(); 
                    break;
                case 'POST':
                    oXHR.open(method,url);
                    setRequestHeader(oXHR,headers,method)
                    oXHR.send(GenerationGetMethodParams(params)); 
                default:
                    break;
            }
           
        });
    }
}

function setRequestHeader(oXHR,headers,method){
    const defaultHeaders ={
        "GET":{"Content-Type": "application/json"},
        "POST":{"Content-Type": "application/x-www-form-urlencoded"}
    };
    
    if(headers!== undefined){
        let resHeaders = Object.assign(defaultHeaders[method.toUpperCase()],headers);
        Object.entries(resHeaders).forEach(function(item){
            oXHR.setRequestHeader(item[0], item[1]);
        });
    }else {
        Object.entries(defaultHeaders[method.toUpperCase()]).forEach(function(item){
            oXHR.setRequestHeader(item[0], item[1]);
        });
    }
}
function GenerationGetMethodParams(params) {
    const res = Object.keys(params).map(function(key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(params[key]);
    }).join('&');

    return res;
}

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

function translation(engine,text,way) {
    switch (engine) {
        case 'google':
            return translationByGoogle(text,way);  
        case 'yandex':
            return translationByYandex(text,way); 
        case 'youdao':
            return translationByYoudao(text,way); 
        default:
            return translationByYandex(text,way); 
    }
}