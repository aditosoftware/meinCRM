var ix = a.decodeFirst(a.valueof("$comp.tblIndex"));

if(ix != "")
{
    a.rq("select columnlist from aosys_indexrepository where table_id = $comp.TABLEID and aosys_indexrepositoryid = '" + ix + "'");
}
else
{
    a.rs(null);
}