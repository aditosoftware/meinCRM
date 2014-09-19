import("lib_distlist");
import("lib_history");

var relids = getRelationIDsDL();
if ( relids.length > 0 )
{
    InsertHistory( relids );
}