var ret = "";
var RelID = a.valueof("$comp.relationid");
if( RelID != "" && a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW)
{
    ret = a.sql("select ORGNAME from ORG join RELATION on ORG_ID = ORGID where RELATIONID = '" + RelID + "'")
}
a.rs (ret);