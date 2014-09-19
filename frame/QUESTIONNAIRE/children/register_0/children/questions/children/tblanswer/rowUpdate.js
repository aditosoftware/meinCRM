import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "ANSWERTEXT"],
[2, "TARGETQUESTION_ID"],
[3, "QUESTIONFLOWSORT"]
];

var updanz = updtable(fields, row, "QUESTIONFLOW", "QUESTIONFLOWID");
if (updanz == -1) a.showMessage(a.translate("Eine Pflicht-Spalte wurde nicht gefüllt !"))