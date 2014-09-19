var type = a.valueof("$comp.TYPE");

if ( type != "")
{
    var sql = "select distinct shorttext from textblock where aotype = " + a.valueof("$comp.TYPE");
    a.rq(sql);
}