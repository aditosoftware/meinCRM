import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[2, "ACCESSDATE"],
[3, "STATUS"],
[4, "EPFUNCTION"],
[5, "DISCOUNTPART"],
[6, "CHARGEPART"],
[7, "RELATION_ID"]
];
var updanz = updtable(fields, row, "EVENTPARTICIPANT", "EVENTPARTICIPANTID");