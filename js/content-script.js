document.addEventListener("mousedown", function(event){
    if (event.button !== 2) {
        return false;
    }
    var selected = window.getSelection().toString();
        if(event.button == 2 && selected != '') {
                //get selected text and send request to bkgd page to create menu
            chrome.extension.sendMessage({
                   'message': 'updateContextMenu', 
                   'selectText':selected,
                   'selection': true});
        } else {
        chrome.extension.sendMessage({
                   'message': 'updateContextMenu',
                   'selection': false});
        }
}, true);