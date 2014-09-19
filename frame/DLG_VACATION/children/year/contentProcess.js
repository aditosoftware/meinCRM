var year = date.longToDate(a.valueof("$sys.date"), "yyyy") -1
var yeararray = []
for (i=0; i<3; i++) yeararray.push([eMath.addInt(year, i)]);
a.ro(yeararray)