var tblid = a.valueof("$comp.TABLEID");

if(tblid != "")
{
    var sql = " select COLUMNID, '', CONSTRAINTTYPE, LONGNAME, COLUMNNAME, DATATYPE, KEYNAME, COLUMNSIZE,"
    + " NULLABLE, LOGGING, CUSTOMIZED, DESCRIPTION "
    + " from AOSYS_COLUMNREPOSITORY where TABLE_ID = '" + tblid + "' "
    + " order by CONSTRAINTTYPE desc, LONGNAME ";
		
    var daten = a.sql(sql, a.SQL_COMPLETE);
    a.ro(daten);
}