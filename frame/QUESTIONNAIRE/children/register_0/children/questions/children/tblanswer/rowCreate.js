import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "ANSWERTEXT"],
[2, "TARGETQUESTION_ID"],
[3, "QUESTIONFLOWSORT"]
];

var vkfields = [[a.decodeFirst(a.valueof("$comp.tblQuestion")), "QUESTION_ID"]];
var updanz = instable(fields, vkfields, row, "QUESTIONFLOW", "QUESTIONFLOWID");
if (updanz == -1) a.showMessage(a.translate("Eine Pflicht-Spalte wurde nicht gefüllt !"))