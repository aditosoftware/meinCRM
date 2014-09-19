var list = a.decodeMS(a.valueof("$comp.tblTablelist"));

if(list.length > 0)
{
    var sql = " select distinct columnname from aosys_columnrepository " + 
    " where table_id in ('" + list.join("', '") + "') " + 
    " order by columnname ";
    a.rq(sql);	          
}
else
{
    a.rs(null);
}