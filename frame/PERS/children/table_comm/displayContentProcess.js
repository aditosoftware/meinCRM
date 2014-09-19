import("lib_keyword");

//Kommunikationsdaten der Person
var relationid = a.valueof("$comp.relationid");
var list = [];

if (relationid != "") 
{
    list = a.sql("select COMMID, case when STANDARD = 1 then -51 else -1 end, "
        + " KEYNAME1, ADDR from COMM join KEYWORD on KEYVALUE = COMM.MEDIUM_ID "
        + " where " + getKeyTypeSQL("PersMedium") + " and RELATION_ID = '" + relationid 
        + "' order by KEYSORT ", a.SQL_COMPLETE);

    for (i = 0; i < list.length; i++) 
    {
        list[i][2] = a.translate(list[i][2])
    }
}
if ( list.length == 0 )    a.createEmptyTable(4);
a.ro(list);