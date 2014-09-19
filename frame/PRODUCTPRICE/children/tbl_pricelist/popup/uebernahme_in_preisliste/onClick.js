import("lib_keyword");
import("lib_sql")

var res = a.askUserQuestion(a.translate("Bitte Vorgaben setzen"), "DLG_PRODUCTPRICE_INSERT");
if( res != null && res != undefined && res != "")
{
    pricelist = res["DLG_PRODUCTPRICE_INSERT.cmb_pricelist"];
    entrydate = res["DLG_PRODUCTPRICE_INSERT.edt_validfrom"];

    var pids = a.decodeMS(a.valueof("$comp.tbl_pricelist"))
    var condition = " PRODUCTPRICEID in ('" + pids.join("','") + "')";
    if (pids.length == 0)
    {
        if ( a.hasvar("$image.condition") )	condition = a.valueofObj("$image.condition");
        else condition = " 1=1";
    }

    var sql = a.sql("select BUYSELL, CURRENCY, LANGUAGE, PRODUCT_ID, VAT, FROMQUANTITY, PRICE "
        + " from PRODUCTPRICE join PRODUCT on PRODUCT.PRODUCTID = PRODUCTPRICE.PRODUCT_ID "
        + " where " + condition + " order by ENTRYDATE desc, GROUPCODEID, PRODUCTNAME", a.SQL_COMPLETE);

    var list = [];
    for (i=0;i<sql.length; i++)
    {
        list.push([a.getNewUUID(), sql[i][0], sql[i][1], sql[i][2], sql[i][3], sql[i][4], sql[i][5], sql[i][6], pricelist, entrydate, a.valueof("$sys.date"), a.valueof("$sys.user")]);
    }

    var col = ["PRODUCTPRICEID", "BUYSELL", "CURRENCY", "LANGUAGE", "PRODUCT_ID", "VAT", "FROMQUANTITY", "PRICE", "PRICELIST", "ENTRYDATE", "DATE_NEW", "USER_NEW"];
    var typ = a.getColumnTypes("PRODUCTPRICE", col)
    for (i=0; i<list.length; i++) a.sqlInsert("PRODUCTPRICE", col, typ, list[i]);
}