var ret = false;
var tid = a.decodeFirst(a.valueof("$comp.timers"));
if (tid != "" )  ret = a.getTableData("$comp.timers", [tid])[0][4] == 0;
a.rs( ret )