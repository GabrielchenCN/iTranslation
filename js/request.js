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