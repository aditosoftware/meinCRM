/*
 * Removes calls from the calls list
 * 04/2008 AH/FA 
 * Identical process stored in the context menu of tbl_calls
 */

var res = a.decodeMS(a.valueof("$comp.tbl_calls"));

if(res.length > 0)  // only, if we do have a selection
{
	if(a.askQuestion( res.length + " " + a.translate("Anrufe löschen ?"), a.QUESTION_YESNO, "") == "true")
	{
		var len = res.length;
		a.sqlDelete("CTILOG", "CTILOGID IN ('" + res.join("','") + "')");
		a.refresh("$comp.tbl_calls");
	}	
}