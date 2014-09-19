var physnames = a.valueof("$comp.chkPhysNames");

if(physnames == "true")
{
    a.rq("select tablename, tablename as tn from aosys_tablerepository order by tablename");
}
else
{
    a.rq("select tablename, longname from aosys_tablerepository order by longname");
}