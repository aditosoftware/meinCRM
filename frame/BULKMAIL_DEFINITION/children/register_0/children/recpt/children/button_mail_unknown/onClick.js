var dlist = a.valueof("$comp.comboDistlist");
var bmid = a.valueof("$comp.BULKMAILDEFID");

var ok = a.askQuestion(a.translate("Markierte Empfänger als nicht zugestellt markieren?"), a.QUESTION_YESNO, "")
if((bmid != "") && (ok == "true"))
{
    var res = a.decodeMS(a.valueof("$comp.tblRcpt"));
    var column = new Array("sentdate", "lastresult");
    var type = a.getColumnTypes( "bulkmailrcpt", column);
    var value = new Array( "", "UND");
    a.sqlUpdate("bulkmailrcpt", column, type, value, "bulkmailrcptid IN ('" + res.join("','") + "')");
    a.refresh("$comp.tblRcpt");
}