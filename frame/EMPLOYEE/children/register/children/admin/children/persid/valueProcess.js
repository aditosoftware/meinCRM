var relid = a.valueof("$comp.relation_id");
if (relid != "")
{
    a.rq("select pers_id from relation where relationid = '" + relid + "'");
}
else
{
    a.rs("");
}