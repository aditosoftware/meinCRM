var standard_addressid = a.valueof("$comp.ADDRESSID");
var addressid = a.decodeFirst( a.valueof("$comp.tbl_ADDRESS") )

a.rs( addressid != standard_addressid && 
    a.sql("select count(*) from ADDRESS where ADDRESSID = '" + addressid + "' and RELATION_ID = '" + a.valueof("$comp.relationid") + "'") > 0 );