var attrid = a.valueof("$comp.attrid");
var list = "";
if(attrid != "")
{
    list = a.sql("select ATTRID, ATTRNAME, ATTR.ATTRCOMPONENT, ATTRDATADEFINITION, AOACTIVE, ATTRSORT "
        + " from ATTR where ATTR_ID = '" + attrid + "'", a.SQL_COMPLETE);
}
if (list.length == 0) list = a.createEmptyTable(6)
a.ro(list);