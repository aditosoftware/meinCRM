var id = a.valueof("$comp.idcolumn");

var sql = a.sql("select ANSWERTEXT from QUESTIONLOG where QUESTIONNAIRELOG_ID = '" + id + "'", a.SQL_COLUMN);
var toDel = new Array();
var z = ""
for (i=0; i<sql.length; i++)
	if (sql[i] != "" ) z += i

// wenn keine Antwort geschrieben wurde dann löschen
if (z == "")
{
	toDel.push(new Array("QUESTIONLOG", "QUESTIONNAIRELOG_ID = '" + id + "'"));
	toDel.push(new Array("QUESTIONNAIRELOG", "QUESTIONNAIRELOGID = '" + id + "'"));
	a.sqlDelete(toDel)
}