function request(method,url,params){
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
                    oXHR.setRequestHeader("Content-type", "application/json");
                    oXHR.send(); 
                    break;
                case 'POST':
                    oXHR.open(method,url);
                    oXHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    oXHR.send(GenerationGetMethodParams(params)); 
                default:
                    break;
            }
           
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