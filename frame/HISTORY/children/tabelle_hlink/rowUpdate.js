import("lib_relation");

var row = a.valueofObj("$local.rowdata");
var object = row[1];
var rowid = row[2];
if ( rowid != "" && rowid != null)
{
    var columns = ["ROW_ID", "DATE_EDIT", "USER_EDIT"];
    var	values = [ rowid, a.valueof("$sys.date"), a.valueof("$sys.user")];
	
    if ( object != null)
    {
        columns.push("OBJECT_ID");
        values.push(object);
    }
    var condition = "HISTORYLINKID = '" + row[0] + "'";
    a.sqlUpdate("HISTORYLINK", columns, a.getColumnTypes("HISTORYLINK", columns), values, condition);
}