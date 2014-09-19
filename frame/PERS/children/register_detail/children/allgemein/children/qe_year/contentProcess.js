import("lib_sql");
var year = date.longToDate(a.valueof("$sys.date"), "yyyy") - 1 // Start mit Vorjahr
var yeararray = []
for (i=0; i<5; i++) yeararray.push([eMath.addInt(year, i)]);
a.ro(yeararray)