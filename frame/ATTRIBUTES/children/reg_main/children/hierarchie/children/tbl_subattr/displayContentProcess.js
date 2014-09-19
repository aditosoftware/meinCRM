import("lib_keyword");
var attrid = a.valueof("$comp.attrid");
var list = "";
if(attrid != "")
{
    list = a.sql("select ATTRID, ATTRNAME, " + getKeySQL("AttrType", "ATTR.ATTRCOMPONENT") 
        + ", ATTRDATADEFINITION, AOACTIVE, ATTRSORT from ATTR where ATTR_ID = '" + attrid + "' order by ATTRSORT", a.SQL_COMPLETE);
    for(i = 0; i < list.length; i++)
    {
        list[i][1] = a.translate(list[i][1]);
        list[i][2] = a.translate(list[i][2]);
    }
}
if (list.length == 0) list = a.createEmptyTable(6)
a.ro(list);