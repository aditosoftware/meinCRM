var callid = a.decodeFirst(a.valueof("$comp.tbl_calls"));
var ret = false;
if ( callid != "" )
{
    ret = ( a.sql("select RELATION_ID from CTILOG where CTILOGID = '" + callid + "'") != "" );
}
a.rs(ret);