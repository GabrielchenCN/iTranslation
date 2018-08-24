const i18n ={
    title:chrome.i18n.getMessage('title'),
    menusTitle:chrome.i18n.getMessage('menusTitle'),
}

// 更新 menus title

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'updateContextMenu') {
        if (request.selection) {
            chrome.contextMenus.update("menus-translate-1",{
                title:`${i18n.menusTitle}:${request.selectText}`,
            })
        } 
    } else {
        sendResponse({});
    }
});

chrome.contextMenus.onClicked.addListener(function(info,tabs){
    console.log('用户选择：',info.selectionText);
  
    console.log(info,tabs);
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757', language:'zh'}, function() {
      console.log('init user preference');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    //   chrome.declarativeContent.onPageChanged.addRules([{
    //         conditions: [new chrome.declarativeContent.PageStateMatcher({
    //         pageUrl: {hostEquals: 'developer.chrome.com'},
    //         })
    //         ],
    //         actions: [new chrome.declarativeContent.ShowPageAction()]
    //   }]);
    });

    chrome.contextMenus.create({
        id:"menus-translate-1",
        title: i18n.menusTitle,
        contexts:["selection"]
    });
  });


