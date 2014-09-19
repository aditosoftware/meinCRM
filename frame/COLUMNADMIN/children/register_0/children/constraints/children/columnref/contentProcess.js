var tblname = a.valueof("$comp.TABLEREF");

var physnames = a.valueof("$comp.chkPhysNames");

if(tblname != "")
{
    var tblid = a.sql("select tableid from aosys_tablerepository where tablename = '" + tblname + "'");

    if(tblid != "")
    {
        if(physnames == "true")
        {
            a.rq("select columnname from aosys_columnrepository where table_id = '" + tblid + "' order by columnname");
        }
        else
        {
            a.rq("select columnname, longname from aosys_columnrepository where table_id = '" + tblid + "' order by longname");
        }

    }
}
else
{
    a.rs(null);
}