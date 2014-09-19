import("lib_wordbrf");

var relid = a.valueof("$comp.relationid");
var language = a.valueof("$comp.LANG");
if (relid != "")
{
    writeLetter( relid, a.decodeFirst(a.valueof("$comp.tbl_ADDRESS")), language );
}