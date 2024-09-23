const i18n ={
    title:chrome.i18n.getMessage('title'),
    menusTitle:chrome.i18n.getMessage('menusTitle'),
}


// 消息总线
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    // 更新 menus title
    if (request.message == 'updateContextMenu') {
        if (request.selection) {
            chrome.contextMenus.update("menus-translate-1",{
                title:`${i18n.menusTitle}:${request.selectText}`,
            })
        } 
    // 翻译消息处理
    } else if (request.message == 'translate') {
        if (request.selection) {
            let autoWay;
            if(hasChinese(request.selectText)){
                // zh -> en 
                autoWay ="zh-en";
            } else {
                // en -> zh
                autoWay ="en-zh"; 
            }    
            let way = request.way || autoWay;   
            switch (request.origin) {
                case 'popup':
                    translation(request.type,request.selectText,way).then(function(res){
                        chrome.runtime.sendMessage({
                            message:"translateResult",
                            selectText:res,
                            selection:true
                        });
           
                    })
                    break;
                case 'content':
                    translation(request.type,request.selectText,way).then(function(res){
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                            chrome.tabs.sendMessage(tabs[0].id, {
                                message:"contentTranslateResult",
                                selectText:res,
                                selection:true
                            }, function(response) {});  
                        });
                    })
                    break;
                default:
                    break;
            }  
        } 
    } else {
        sendResponse({});
    }
});


// 右键菜单操作
chrome.contextMenus.onClicked.addListener(function(info,tabs){
    console.log('用户选择：',info.selectionText);
    let way ;
    if(hasChinese(request.selectText)){
        // zh -> en 
        way ="zh-en";
    } else {
        // en -> zh
        way ="en-zh"; 
    }    
    translation('youdao',info.selectionText,way).then(function(res){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {
                message:"menusClickTranslateResult",
                selectText:res,
                selection:true
            }, function(response) {});  
        });
    })
    console.log(info,tabs);
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757', language:'zh'}, function() {
      console.log('init user preference');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {

    });

    chrome.contextMenus.create({
        id:"menus-translate-1",
        title: i18n.menusTitle,
        contexts:["selection"]
    });
  });


