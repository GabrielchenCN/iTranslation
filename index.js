chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log('The color is green.');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        // conditions: [new chrome.declarativeContent.PageStateMatcher({
        //   pageUrl: {hostEquals: 'developer.chrome.com'},
        // })
        // ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });

    // chrome.contextMenus.create({
    //     title: "github",
    //     onclick: function(){alert('您点击了右键菜单！');}
    // });

    // background.js
    chrome.contextMenus.create({
        id:"translateMenusSelectionItemId-1",
        title: '使用度娘搜索：%s', // %s表示选中的文字
        contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
        onclick: function(info,tabs)
        {
            // 注意不能使用location.href，因为location是属于background的window对象
            console.log('您点击了右键菜单！');
            console.log(info,tabs);
            // chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
        }
    });
  });


