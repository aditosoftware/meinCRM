import("lib_duplicate");

var dupids = hasPersDuplicates(a.valueof("$comp.relationid"), a.valueof("$comp.persid"), getPersFramePattern());
var tabelle = [];

if (dupids.length > 0) tabelle = getDuplicates("PERS", dupids);
else tabelle = a.createEmptyTable(7);
a.ro(tabelle);
