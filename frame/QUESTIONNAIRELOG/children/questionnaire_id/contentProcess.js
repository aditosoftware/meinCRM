//import("lib_sql")
//
//var qlid = a.valueof("$comp.idcolumn");
//
//if (qlid != '')
a.rq("select QUESTIONNAIREID, TITLE from QUESTIONNAIRE ")
//	+ " where QUESTIONNAIRELOGID = '" + qlid + "'");