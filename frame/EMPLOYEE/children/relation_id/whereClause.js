var workingmode = a.valueof("$sys.workingmode");
var condition = "";

if (workingmode == a.FRAMEMODE_SEARCH || workingmode == a.FRAMEMODE_SHOW) condition = "RELATIONID in (select RELATION_ID from EMPLOYEE)";
else condition = "RELATIONID not in (select RELATION_ID from EMPLOYEE where RELATION_ID <> '" + a.valueof("$comp.relation_id") + "')";
a.rs(condition);