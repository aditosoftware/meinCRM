var tblid = a.valueof("$comp.TABLEID");
var ix = a.valueof("$comp.tblIndex");

if((tblid != "") && (ix != ""))
{
	var ok = a.askQuestion(a.translate("Markierten Index wirklich aus dem Repository entfernen?"), a.QUESTION_YESNO, "");
	ix = a.decodeMS(ix);
	
	if(ok == "true")
	{
		for(var i=0; i < ix.length; i++)
		{
			a.sqlDelete("AOSYS_INDEXREPOSITORY", "AOSYS_INDEXREPOSITORYID = '" + ix[i] + "'");
		}
		a.refresh("$comp.tblIndex");
		a.refresh("$comp.listColumn");
	}
}