import("lib_event");
import("lib_history");

var relids = getRelationIDsEvent();
if ( relids.length > 0 )
{
	InsertHistory( relids );
}