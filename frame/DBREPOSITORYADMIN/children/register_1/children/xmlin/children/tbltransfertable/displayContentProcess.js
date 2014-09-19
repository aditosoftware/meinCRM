if (a.hasvar("$image.xmldirection"))
{
    var tbl = [];
    var dir = a.valueof("$image.xmldirection");
    if((dir == "imp") || (dir == "exp"))
    {
        if (a.hasvar("$image.tablearray"))
        {
            tbl = a.valueofObj("$image.tablearray");
        }
        a.ro(tbl);
    }
}