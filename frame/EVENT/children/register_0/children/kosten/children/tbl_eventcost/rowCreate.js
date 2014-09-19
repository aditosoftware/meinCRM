import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "COSTTYPE"],
[2, "COSTVALUE"]
];

var vkfields = [[a.valueof("$comp.EVENTID"), "EVENT_ID"]];
var updanz = instable(fields, vkfields, row, "EVENTCOST", "EVENTCOSTID");