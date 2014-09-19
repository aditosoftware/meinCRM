import("lib_duplicate");

var dupids = hasOrgDuplicates(a.valueof("$comp.relationid"), getOrgFramePattern() );
var tabelle = [];

if (dupids.length > 0) tabelle = getDuplicates("ORG", dupids);
else tabelle = a.createEmptyTable(6);
a.ro(tabelle);