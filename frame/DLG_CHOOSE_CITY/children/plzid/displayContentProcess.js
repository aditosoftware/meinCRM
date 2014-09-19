var sqlstr = a.valueof("$image.locationsql");
sqlstr += " order by zip";
a.rq ( sqlstr );