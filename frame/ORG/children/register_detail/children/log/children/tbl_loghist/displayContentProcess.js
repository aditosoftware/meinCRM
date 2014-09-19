import("lib_loghist");

var orgid = a.valueof("$comp.orgid");
var relid = a.valueof("$comp.idcolumn");

var condition = "( TABLENAME = 'ORG' and TABLENAMEID = '" + orgid + "' )"
+ " or ( TABLENAME in ('RELATION','COMM', 'ATTRLINK', 'ADDRESS') and TABLENAMEID = '" + relid + "')";

a.ro ( show_log_history( condition ) );