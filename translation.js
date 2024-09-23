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

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function sha256(message) {
    // 将字符串转换为ArrayBuffer
    const msgBuffer = new TextEncoder().encode(message);
    // 使用SHA-256计算哈希
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    // 将ArrayBuffer转换为16进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function translateByYoudaoApi(text,way) {
    return new Promise((reslove)=>{
        chrome.storage.local.get(['appid','appkey'], function(obj) {
            console.log('app',obj)
            if(obj && obj.appid && obj.appkey){
                var appKey = obj.appid
                var key = obj.appkey
                var salt = uuidv4();
                var curtime = Math.round(new Date().getTime()/1000);
                var query = text;
                // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
                var from = 'auto';
                var to = 'auto';
                var str1 = appKey + truncate(query) + salt + curtime + key;
                var url = 'https://openapi.youdao.com/api';
                return sha256(str1).then(function(sign){
                    return request('post',url,{
                        q: query,
                        appKey: appKey,
                        salt: salt,
                        from: from,
                        to: to,
                        sign: sign,
                        signType: "v3",
                        curtime: curtime,
                    },{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}).then(function(res){
                        let resJson = JSON.parse(res);
                        reslove(resJson.translation[0]);
                    },function(rej){
                        console.log('rej',rej);
                        reslove(query);
                    })
                });
            }else {
                reslove('appid and secret is required')
            }
        });
    })
   


    
    
    function truncate(q){
        var len = q.length;
        if(len<=20) return q;
        return q.substring(0, 10) + len + q.substring(len-10, len);
    }
}


function translation(engine,text,way) {
    console.log('translation',engine,text,way)
    switch (engine) {
        case 'google':
            return translationByGoogle(text,way);  
        case 'yandex':
            return translationByYandex(text,way); 
        case 'youdao':
            return translationByYoudao(text,way); 
        case 'youdao-api':
            return translateByYoudaoApi(text,way);
        default:
            return translateByYoudaoApi(text,way); 
    }
}