import("lib_sql");

var tab = a.createEmptyTable(9);
var relid = a.valueof("$comp.relationid");
//var tab;
if (relid != '')
{
    tab = a.sql(" select ADVERTISINGSHIPMENTID, SHIPREASON, FISCALYEAR, PRODUCT_ID, QUANTITY, " 
        + " INITIATOR_ID, SENDER_ID, SHIPDATE, SHIPSTATUS " 
        + " from ADVERTISINGSHIPMENT " 
        + " where RELATION_ID = '" + relid + "'", a.SQL_COMPLETE);
}	
a.ro(tab);