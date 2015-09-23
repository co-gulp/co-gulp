})(this,seajs);

window.onerror = function(sMsg,sUrl,sLine,columnNumber,error){
  var str = "Error: " + sMsg + "----------";
  str+="Line: " + sLine + "-----------";
  str+="URL: " + sUrl + "---------";
  str+="columnNumber: " + columnNumber + "---------";
  str+="error: " + error + "---------";
  if (($.os.android || $.os.ios) && global.rd) {
  	alert(str)
  }
  return false;
}