import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "CATEGORY"],
[2, "NET"]
];

var vkfields = 	[[a.valueof("$comp.campaignid"), "CAMPAIGN_ID"]];
var updanz = instable(fields, vkfields, row, "CAMPAIGNCOST", "CAMPAIGNCOSTID");