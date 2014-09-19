import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
[1, "DESCRIPTION"],
[2, "ICON_TYPE"],
[3, "BINDATA"]
];

var updanz = instable(fields, [], row, "ASYS_ICONS", "ID");