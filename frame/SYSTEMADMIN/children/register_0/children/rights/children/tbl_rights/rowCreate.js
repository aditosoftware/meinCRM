import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
for ( var i = 3; i < 6; i++)  if ( row[i] == "" )	row[i] = "0";

var fields = [
[1, "ROLEID"],
[2, "FRAME_ID"],
[3, "PRIV_INSERT"],
[4, "PRIV_EDIT"],
[5, "PRIV_DELETE"]
];
instable(fields, [[ "F", "TATYPE"]], row, "TABLEACCESS", "TABLEACCESSID");