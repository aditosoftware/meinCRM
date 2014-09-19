var id = a.decodeFirst(a.valueof("$comp.tbl_ADDRESS"));

if ( id.substr( 0, 4) == "ZZZ#")
{
    a.openFrame("PERS", "RELATIONID = '" + id.split("#")[1] + "'", false, a.FRAMEMODE_SHOW);
}