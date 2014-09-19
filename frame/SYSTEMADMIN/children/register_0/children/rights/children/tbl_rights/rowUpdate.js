import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "ROLEID",true],
[2, "FRAME_ID",true],
[3, "PRIV_INSERT"],
[4, "PRIV_EDIT"],
[5, "PRIV_DELETE"]
];
updtable(fields, row, "TABLEACCESS", "TABLEACCESSID");