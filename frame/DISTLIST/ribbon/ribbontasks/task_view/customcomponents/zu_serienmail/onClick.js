import("lib_distlist");
import("lib_bulkmail");

var relids = getRelationIDsDL();
if (relids.length > 0)	addRecipientsWithCondition( "", "RELATIONID in ('" + relids.join("','") + "')" );