import("lib_sql");
import("lib_keyword");

var id = a.valueof("$comp.SALESPROJECTID");
if (id != "") 
{
	a.rq("select OFFERID, " + concat([cast("OFFERCODE", "char", 10), "'-'", cast("VERSNR", "char", 10)]) 
		+ ", OFFERDATE, " + getKeySQL("OFFERSTATE", "STATUS") + ", (select sum(QUANTITY * PRICE * (100 - DISCOUNT) / 100) from OFFERITEM where OFFER_ID = OFFER.OFFERID ), CURRENCY "
		+ " from OFFER where PROJECT_ID = '" + id + "'");
}	
else
	a.rq(a.EMPTY_TABLE_SQL);