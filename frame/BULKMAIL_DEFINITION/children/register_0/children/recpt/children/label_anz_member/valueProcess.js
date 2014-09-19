var participants = a.decodeMS(a.valueof("$comp.tblRcpt"));
var id = a.valueof("$comp.BULKMAILDEFID");
if (id != '' && participants != '')
{
    var total = a.sql("select count(*) from BULKMAILRCPT where BULKMAILDEF_ID = '" + id + "'");
    a.rs(a.translate("%0" + " "+ "Empfänger von" + " " + "%1" + " " + "markiert", [participants.length, total]));
	
}