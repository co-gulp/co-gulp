})(this, seajs);
if (($.os.android || $.os.ios) && window.rd) {
	window.onerror = function(sMsg, sUrl, sLine, columnNumber, error) {
		var str = "Error: " + sMsg + "----------";
		str += "Line: " + sLine + "-----------";
		str += "URL: " + sUrl + "---------";
		str += "columnNumber: " + columnNumber + "---------";
		str += "error: " + error + "---------";
		alert(str)
		return false;
	}
}