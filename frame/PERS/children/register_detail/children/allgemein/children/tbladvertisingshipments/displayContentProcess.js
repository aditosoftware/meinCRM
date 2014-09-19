import("lib_sql");
import("lib_keyword");

var tab = a.createEmptyTable(9);
var relid = a.valueof("$comp.relationid");
//var tab;
if (relid != '')
{
    tab = a.sql(" select ADVERTISINGSHIPMENTID, " + getKeySQL("adv.shipreason", "SHIPREASON") + ", FISCALYEAR, PRODUCTNAME, QUANTITY, " 
        + " (select " + concat(["firstname", "lastname"]) + " from relation join pers on persid = pers_id where relationid = INITIATOR_ID), "
        + " (select " + concat(["firstname", "lastname"]) + " from relation join pers on persid = pers_id where relationid = SENDER_ID), "
        + " SHIPDATE, " + getKeySQL("adv.shipstatus", "SHIPSTATUS") 
        + " from ADVERTISINGSHIPMENT join PRODUCT on (PRODUCT_ID = PRODUCTID) " 
        + " where RELATION_ID = '" + relid + "' order by FISCALYEAR, SHIPREASON, INITIATOR_ID", a.SQL_COMPLETE);
}	
a.ro(tab);