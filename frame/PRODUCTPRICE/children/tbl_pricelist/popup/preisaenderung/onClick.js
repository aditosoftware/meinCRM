import("lib_keyword");
import("lib_sql")

var pids = a.decodeMS(a.valueof("$comp.tbl_pricelist"))
var condition = " PRODUCTPRICEID in ('" + pids.join("','") + "')";
if (pids.length == 0)
{
	if ( a.hasvar("$image.condition") )	condition = a.valueofObj("$image.condition");
	else condition = " 1=1";
}

var sql = a.sql("select PRODUCTPRICEID, PRICE from PRODUCTPRICE where " + condition, a.SQL_COMPLETE);

var factor = a.askQuestion("Änderung um Faktor: ", a.QUESTION_EDIT, "1")
if( factor != null && factor != undefined && factor != "")
{
	factor = factor.replace(",", ".")
	for (i=0; i<sql.length; i++) 
		a.sqlUpdate("PRODUCTPRICE", ["PRICE"], a.getColumnTypes("PRODUCTPRICE", ["PRICE"]), [sql[i][1] * factor], " PRODUCTPRICEID = '" + sql[i][0] + "'");
}
a.refresh("$comp.tbl_pricelist")