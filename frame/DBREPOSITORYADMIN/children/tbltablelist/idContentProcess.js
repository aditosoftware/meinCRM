edit = a.valueof("$image.edit");
var sql = " select TABLEID, '" + edit + "', -1, TABLETYPE, AOMODULE, LONGNAME, TABLENAME, DESCRIPTION " + 
"	from AOSYS_TABLEREPOSITORY ";                    

var daten = a.sql(sql, a.SQL_COMPLETE);
	
a.ro(daten);