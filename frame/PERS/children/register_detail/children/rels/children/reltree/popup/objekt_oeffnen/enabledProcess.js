var rowid = a.decodeFirst(a.valueof("$comp.relTree"));
var relid = a.valueof("$comp.relationid");

a.rs( rowid != relid);