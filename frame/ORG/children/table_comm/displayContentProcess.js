import("lib_keyword");

var list = [];
var medium = "PersMedium";
var relationid = a.valueof("$comp.Label_relpers_dec");
if (relationid == "")
{
    relationid = a.valueof("$comp.relationid");
    medium = "OrgMedium";
}
if (relationid != "") 
{
    list = a.sql("select COMMID, case when STANDARD = 1 then -51 else -1 end, "
        + " KEYNAME1, ADDR from COMM join KEYWORD on KEYVALUE = COMM.MEDIUM_ID "
        + " where " + getKeyTypeSQL( medium ) + " and RELATION_ID = '" + relationid 
        + "' order by KEYSORT ", a.SQL_COMPLETE);
    for (i = 0; i < list.length; i++) 
    {
        list[i][2] = a.translate(list[i][2])
    }
}
if (list.length == 0) 	list = a.createEmptyTable(4);
a.ro(list);