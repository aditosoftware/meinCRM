import("lib_report");

var id = a.valueof("$comp.idcolumn");
var user = a.valueof("$sys.user");
openRPT_Offer( id, false, user, "RPTJ_OFFER" );