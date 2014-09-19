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
var vkfields = [[a.valueof("$comp.EVENTID"), "EVENT_ID"]];
var updanz = instable(fields, vkfields, row, "EVENTPARTICIPANT", "EVENTPARTICIPANTID");