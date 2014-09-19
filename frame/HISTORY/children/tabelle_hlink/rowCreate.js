import("lib_relation");
import("lib_sql");

var id = a.valueof("$comp.idcolumn");
var row = a.valueofObj("$local.rowdata");
var object = row[1];
var rowid = row[2];

if ( object != "" && object != null && rowid != "" && rowid != null)
{
    var table = "HISTORYLINK";
    var columns = new Array("HISTORYLINKID", "HISTORY_ID", "OBJECT_ID", "ROW_ID", "DATE_EDIT", "USER_NEW");
    var types = a.getColumnTypes(table, columns);
    if ( object == 3 )
    {
        object = getRelationType(rowid);
        if (object == 3) // Bei Auswahl der Funktion wird zusätzlich die Firma verknüpft
        {
            var relorgid = a.sql("select RELATIONID from RELATION where ORG_ID = (select ORG_ID from RELATION where RELATIONID = '" + rowid + "') and PERS_ID is null");
            var values = [a.getNewUUID(), id, "1", relorgid, a.valueof("$sys.date"), a.valueof("$sys.user")];
            if ( !isDuplicat(table, columns, types, values ))   a.sqlInsert(table, columns, types, values);
        }
    }
    values = [a.getNewUUID(), id, object, rowid, a.valueof("$sys.date"), a.valueof("$sys.user")];
    if ( !isDuplicat(table, columns, types, values ))   a.sqlInsert(table, columns, types, values);
}