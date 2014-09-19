import("lib_campaign");
import("lib_bulkmail");

var relids = getRelationIDs();
if (relids.length > 0)	addRecipientsWithCondition( "", "RELATIONID in ('" + relids.join("','") + "')" );