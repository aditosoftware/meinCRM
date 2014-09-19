import("lib_tablecomp");

var id = a.valueof("$comp.idcolumn");
var row = a.valueofObj("$local.rowdata");

var fields = [
							[2, "ORGNAME"],
							[3, "STATUS"],
							[4, "DATECANCELLED"],
							[5, "REASON"],
							[6, "INFO"]
						 ];

var updanz = updtable(fields, row, "SPCOMPETITION", "SPCOMPETITIONID");