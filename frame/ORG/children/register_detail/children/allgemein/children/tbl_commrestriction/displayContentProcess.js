import("lib_keyword");

var tab = a.createEmptyTable(5);
var relid = a.valueof("$comp.idcolumn");
if (relid != '')
{
    tab = a.sql("select COMMRESTRICTIONID, " + getKeySQL("COMMRESTRICTION", "MEDIUM") + ", DATE_NEW, USER_NEW, REASON "
        + " from COMMRESTRICTION where RELATION_ID = '" + relid + "' order by MEDIUM", a.SQL_COMPLETE);
}
a.ro(tab);