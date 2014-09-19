var pers = a.decodeFirst(a.valueof("$comp.Table_pers"));
if (pers != '')
{
    a.rq("select PERS_ID from RELATION where RELATIONID = '" + pers + "'");
}
else
{
    a.rs("");
}