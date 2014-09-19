import("lib_addr");

var ret = "";
var RelID = a.valueof("$comp.relationid");

if( RelID != "" && a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW )
{
    ret = new AddrObject( RelID ).formatAddress("{rt}\n{al} {bn}\n{cc} - {zc} {ci}");
}
a.rs (ret);