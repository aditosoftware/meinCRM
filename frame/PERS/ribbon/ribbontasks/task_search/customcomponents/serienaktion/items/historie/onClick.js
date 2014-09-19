import("lib_history");
import("lib_relation");

var relids = GetPersRelIDs(a.valueof("$sys.selection"));
if ( relids.length > 0 )
{
    InsertHistory( relids );
}