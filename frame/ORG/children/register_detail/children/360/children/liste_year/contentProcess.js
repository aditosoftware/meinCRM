var year = parseInt(date.longToDate(a.valueof("$sys.date"), "yyyy")) + 1// Start mit kommendem Jahr
var yeararray = []
for (i=0; i < 4; i++) yeararray.push([eMath.subInt(year, i)]);
a.ro(yeararray)