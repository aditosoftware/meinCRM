import("lib_sql")

var groupcode = a.valueof("$comp.GROUPCODEID");
var relid = a.valueof("$comp.RELATION_ID");
if (groupcode != '' && relid != '')
{
    var relorgid = a.sql("select RELATIONID from RELATION  join ADDRESS on RELATIONID = ADDRESS.RELATION_ID where ORG_ID = "
        + " (select ORG_ID from RELATION where RELATIONID = '" + relid + "')  and ADDRESS.ADDR_TYPE = 1 and PERS_ID is NULL ");
    a.rq("select MACHINEID, " + concat(["PRODUCTNAME", "SERIALNUMBER"], "/") 
        + " from MACHINE join PRODUCT on PRODUCTID = PRODUCT_ID where RELATION_ID = '" + relorgid + "' and GROUPCODEID = " + groupcode );
}