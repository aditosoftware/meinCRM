import("lib_tablecomp");

// bestehenden Fragebogen editieren
var qcode = a.valueof("$comp.edtQuestionCode");
var qreid = a.valueof("$comp.QUESTIONNAIREID");
//var sort = a.sql("select max(QUESTIONCODE) from QUESTION where QUESTIONNAIRE_ID = '" + qreid + "'");
//if (sort == "") sort = 0;
//else sort = parseInt(sort) + 1;

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "QUESTIONCODE"],
[2, "COMPONENTTYPE"],
[3, "QUESTIONTEXT"],
[4, "HINTTEXT"]
];
var vkfields = [[a.valueof("$comp.idcolumn"), "QUESTIONNAIRE_ID"]];
var updanz = instable(fields, vkfields, row, "QUESTION", "QUESTIONID");