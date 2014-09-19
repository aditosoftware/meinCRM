var ids = a.valueofObj("$local.idvalue")

var fromstr =  " from ADDRESS ";
var	fields = [ "ADDRESSID", "1", "1", "RELATION_ID", "ADDR_TYPE", "ADDRIDENTIFIER", "ADDRESS", "BUILDINGNO", "ADDRESSADDITION", "ZIP", "CITY", "DISTRICT", 
"REGION", "STATE", "COUNTRY"];
var sqlstr;

if ( ids != "undefined" )		sqlstr = "select " + fields.join(",") + fromstr + "where ADDRESSID in ('" + ids.join("','") + "')";
else
{
    var joinstr1 = " join RELATION on RELATIONID = RELATION_ID join ORG on ORGID = ORG_ID ";
    var joinstr2 = " join RELATION on ADDRESSID = ADDRESS_ID join ORG on ORGID = ORG_ID "; // Standard Address

    if ( a.valueof("$comp.AOTYPE") == "3" )
    {
        sqlstr = "select " + fields.join(", ") + fromstr + joinstr1 + " where RELATIONID = '" + a.valueof("$comp.relationid") + "'";
		
        sqlstr += " or ( PERS_ID is null and ORG_ID = '" + a.valueof("$comp.lup_orgid") + "')";
    }
    else
    {
        sqlstr = " select " + fields.join(", ") + fromstr + joinstr1 + " where ORG_ID = '0' and PERS_ID = '" + a.valueof("$comp.persid") + "'";
    }
}
a.returnobject(a.sql( sqlstr, a.SQL_COMPLETE ));