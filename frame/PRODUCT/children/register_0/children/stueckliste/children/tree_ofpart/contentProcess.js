import("lib_keyword");

var nodeid = a.valueof("$local.nodeid");
var prodid =  a.valueof("$comp.PRODUCTID");
var sqlstr1 = "select PROD2PRODID, PRODUCTNAME, PRODUCTCODE, KEYNAME1 from PROD2PROD join PRODUCT on (DEST_ID = "
+ " PRODUCTID) left join KEYWORD on (KEYVALUE = GROUPCODEID) where " + getKeyTypeSQL("GroupCode") + " and SOURCE_ID = '";
var sqlstr2 = "' order by PRODUCTNAME";
var sector = new Array();

if (nodeid == null && prodid != "")
{
    // Node of Product
    var prodname = a.valueof("$comp.PRODUCTCODE") + " / " + a.translate(a.valueof("$comp.PRODUCTNAME"));
    sector.push([a.encodeMS([prodid]), prodname, "", null, "false", null, "true"]);
} 
if (nodeid != null)
{
    var node = a.decodeMS(nodeid);
    var nodelayer = a.valueof("$local.nodelayer");
    if ( nodelayer > 1 )	prodid = a.sql("select DEST_ID from PROD2PROD where PROD2PRODID = '" + node[nodelayer-1] + "'");
    var tab = a.sql(sqlstr1 + prodid + sqlstr2, a.SQL_COMPLETE);
    for ( i=0; i < tab.length; i++)
    {
        endnode = "false"; 
        // wenn keine weiteren Produkte unter dem Knoten hängen wird Endsymbol gezeigt
        if (a.sql("select count(*) from PROD2PROD A join PROD2PROD B on (A.DEST_ID = B.SOURCE_ID) where A.PROD2PRODID = '" 
            + tab[i][0] + "'") == 0) endnode = "true";
        var product = tab[i][2] + " / " + a.translate(tab[i][1]);
        var prodinfo = a.translate("Warengruppe: ") + a.translate(tab[i][4]) + "\n" + tab[i][3];										 
        sector.push([a.encodeMS( node.concat([tab[i][0]])), product, prodinfo, null, endnode, nodeid, "false"]);
    }
}  
a.ro(sector);