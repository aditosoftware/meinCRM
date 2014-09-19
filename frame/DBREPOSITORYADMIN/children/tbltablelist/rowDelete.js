var count = a.sql("select COLUMNID from AOSYS_COLUMNREPOSITORY where TABLE_ID = '" + a.valueof("$local.idvalue") + "'", a.SQL_COLUMN);
if ( count.length == "0" ) a.sqlDelete("AOSYS_TABLEREPOSITORY", " TABLEID = '" + a.valueof("$local.idvalue") + "'");
else  a.showMessage("zuerst alle Spalten löschen!");