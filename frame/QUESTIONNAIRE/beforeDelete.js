var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
toDel.push(new Array("QUESTION", "QUESTIONNAIRE_ID = '" + id + "'"));

a.sqlDelete(toDel)