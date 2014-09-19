import("lib_loghist");

var persid = a.valueof("$comp.persid");
var relid = a.valueof("$comp.idcolumn");

var condition = "( TABLENAME = 'PERS' and TABLENAMEID = '" + persid + "') "
+ " or ( TABLENAME in ('RELATION', 'COMM', 'ATTRLINK', 'ADDRESS') and TABLENAMEID = '" + relid + "')";

a.ro ( show_log_history( condition ) );