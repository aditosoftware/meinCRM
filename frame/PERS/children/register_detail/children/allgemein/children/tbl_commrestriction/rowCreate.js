import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "MEDIUM"],
[4, "REASON"]
];

var vkfields = [[a.valueof("$comp.idcolumn"), "RELATION_ID"]];
instable(fields, vkfields, row, "COMMRESTRICTION", "COMMRESTRICTIONID", "$comp.tbl_commrestriction");
a.refresh("$comp.lbl_commrestriction");