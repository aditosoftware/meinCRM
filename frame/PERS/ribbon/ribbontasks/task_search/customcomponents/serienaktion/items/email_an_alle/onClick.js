import("lib_email");
import("lib_relation");

var addressen = getCommAddresses( a.valueof("$sys.selection") );
if ( addressen.length > 0 )		OpenNewMail( addressen, a.valueof("$global.user_relationid") );