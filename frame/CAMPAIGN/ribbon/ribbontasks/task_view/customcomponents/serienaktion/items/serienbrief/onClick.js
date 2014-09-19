import("lib_addrexp");
import("lib_campaign");

var relids = getRelationIDs();
if (relids.length > 0 )	openSerialLetter( relids );