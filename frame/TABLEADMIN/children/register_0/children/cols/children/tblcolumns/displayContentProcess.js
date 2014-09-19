var tblid = a.valueof("$comp.TABLEID");

if(tblid != "")
{
    var sql = " select COLUMNID, '', CONSTRAINTTYPE, LONGNAME, COLUMNNAME, DATATYPE, KEYNAME, COLUMNSIZE,"
    + " NULLABLE, LOGGING, CUSTOMIZED, DESCRIPTION "
    + " from AOSYS_COLUMNREPOSITORY where TABLE_ID = '" + tblid + "' "
    + " order by CONSTRAINTTYPE desc, LONGNAME ";
		
    var daten = a.sql(sql, a.SQL_COMPLETE);
			
    for(var i=0; i < daten.length; i++)	if(daten[i][10] == "Y")	daten[i][1] = -2103305; //hellblau
    a.ro(daten);
}