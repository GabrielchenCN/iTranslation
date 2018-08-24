function hasChinese(s){
    var reg=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if(!reg.exec(s)){
        return false;
    }
    else{
        return true;
    }
}
