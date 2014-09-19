var relid = a.valueof("$comp.idcolumn");
var tab = a.createEmptyTable(5);

if (relid != '')
{
    tab = a.sql("select COMMRESTRICTIONID, MEDIUM, DATE_NEW, USER_NEW, REASON "
        + " from COMMRESTRICTION where RELATION_ID = '" + relid + "' order by MEDIUM", a.SQL_COMPLETE);
}
a.ro(tab);