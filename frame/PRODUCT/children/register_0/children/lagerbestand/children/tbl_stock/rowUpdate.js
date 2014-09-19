import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "ENTRYDATE", false],
[2, "IN_OUT", false],
[3, "QUANTITY", false],
[4, "REFNUMBER", false]
];

var updanz = updtable(fields, row, "STOCK", "STOCKID");
if (updanz == -1) a.showMessage(a.translate("Eine Pflicht-Spalte wurde nicht gefüllt !"))