import("lib_distlist");
import("lib_addrexp");

var relids = getRelationIDsDL();
if ( relids.length > 0 )	openSerialLetter( relids );