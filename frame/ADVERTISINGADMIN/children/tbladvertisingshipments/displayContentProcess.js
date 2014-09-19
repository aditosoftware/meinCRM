import("lib_sql");
import("lib_keyword");

var filterrecipient = a.decodeFirst(a.valueof("$comp.tblFilterRecipients"));
var user = a.valueof("$sys.user");
var list;
var filterType = a.valueof("$comp.cmbTYPE");
var datefrom = a.valueof("$comp.edt_von");
var datetill = a.valueof("$comp.edt_bis");
var condition = [];
var condvalues = [];

if (filterType != "") 
{    
    condition.push("SHIPSTATUS = ?");
    condvalues.push([filterType, SQLTYPES.INTEGER])
}
if (datefrom != "")
{    
    condition.push("SHIPDATE >= ?");
    condvalues.push([String(date.clearTime(datefrom)), SQLTYPES.TIMESTAMP])
}
if (datetill != "")
{    
    condition.push("SHIPDATE <= ?");
    condvalues.push([String(date.clearTime( eMath.addInt(datetill, date.ONE_DAY))), SQLTYPES.TIMESTAMP])
}
if (filterrecipient != "") 
{    
    condition.push("RELATION_ID = ?");
    condvalues.push([filterrecipient, SQLTYPES.CHAR])
}

var sqlstr = "select ADVERTISINGSHIPMENTID, " + concat(["FIRSTNAME", "LASTNAME", "','", "ORGNAME"]) + ", " 
+ getKeySQL("adv.shipreason", "SHIPREASON") + ", ADVERTISINGSHIPMENT.DATE_NEW, PRODUCTNAME, QUANTITY, " 
+ " (select " + concat(["FIRSTNAME", "LASTNAME"]) + " from RELATION join PERS on PERSID = PERS_ID where RELATIONID = INITIATOR_ID), "
+ " (select " + concat(["FIRSTNAME", "LASTNAME"]) + " from RELATION join PERS on PERSID = PERS_ID where RELATIONID = SENDER_ID), "
+ " SHIPDATE, " + getKeySQL("adv.shipstatus", "SHIPSTATUS") 
+ " from ADVERTISINGSHIPMENT join PRODUCT on PRODUCT_id = PRODUCTID join RELATION on RELATION_ID = RELATIONID " 
+ " join PERS on PERS_ID = PERSID join ORG on RELATION.ORG_ID = ORGID " + ( condition.length > 0 ? " where " + condition.join(" and ") : "" )
+ " order by ADVERTISINGSHIPMENT.DATE_NEW desc, SHIPREASON, INITIATOR_ID"

list = a.sql([sqlstr, condvalues], a.SQL_COMPLETE);
	          
if ( list.length == 0 )  list = a.createEmptyTable(9);
a.ro(list);