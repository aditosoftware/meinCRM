var table = a.valueof("$local.table");
var id = a.valueof("$local.idvalue"); 

switch (table)
{
    case "ORG":
            a.ro(a.sql("select RELATIONID FROM ORG join RELATION on ORGID = ORG_ID where PERS_ID is not null and ORG_ID = '" + id + "'", a.SQL_COLUMN));
        break;
    case "PERS":
            a.ro(a.sql("select RELATIONID FROM RELATION where PERS_ID = '" + id + "'", a.SQL_COLUMN));
        break;
    case "ADDRESS":
            var ids = a.sql("select RELATIONID FROM RELATION WHERE ADDRESS_ID = '" + id + "'", a.SQL_COLUMN);            
            a.ro(ids.concat(a.sql("select RELATION_ID FROM ADDRESS WHERE ADDRESSID = '" + id + "'", a.SQL_COLUMN)));
        break;
    case "COMM":
            a.ro(a.sql("select RELATION_ID FROM COMM WHERE COMMID = '" + id + "'", a.SQL_COLUMN));
        break;
}
