var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
toDel.push(new Array("QUESTIONLOG", "QUESTIONNAIRELOG_ID = '" + id + "'"));

a.sqlDelete(toDel)