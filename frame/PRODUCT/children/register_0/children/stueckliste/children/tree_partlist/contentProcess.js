import("lib_keyword");

var nodeid = a.valueof("$local.nodeid");
var prodid =  a.valueof("$comp.PRODUCTID");
var sqlstr1 = "select PROD2PRODID, PRODUCTNAME, PRODUCTCODE, KEYNAME1, QUANTITY, "
+ "OPTIONAL from PROD2PROD join PRODUCT on (SOURCE_ID = PRODUCTID) "
+ " left join KEYWORD on (KEYVALUE = GROUPCODEID) where " + getKeyTypeSQL("GroupCode") + " and DEST_ID = '";
var sqlstr2 = "' order by PRODUCTNAME";
var sector = new Array();
var sep = " / ";

if (nodeid == null && prodid != "")
{
    // Node of Product
    var prodname = a.valueof("$comp.PRODUCTCODE") + sep + a.translate(a.valueof("$comp.PRODUCTNAME"));
    sector.push([a.encodeMS([prodid]), prodname, "", null, "false", null, "true"]);
} 
if (nodeid != null)
{
    var node = a.decodeMS(nodeid);
    var nodelayer = a.valueof("$local.nodelayer");
    if ( nodelayer > 1 )	prodid = a.sql("select SOURCE_ID from PROD2PROD where PROD2PRODID = '" + node[nodelayer-1] + "'");
    var tab = a.sql(sqlstr1 + prodid + sqlstr2, a.SQL_COMPLETE);
    for ( i=0; i < tab.length; i++)
    {
        endnode = "false"; 
        // wenn keine weiteren Produkte unter dem Knoten hängen wird Endsymbol gezeigt
        if (a.sql("select count(*) from PROD2PROD A join PROD2PROD B on (A.DEST_ID = B.SOURCE_ID) where B.PROD2PRODID = '" 
            + tab[i][0] + "'") == 0) endnode = "true";
        var product = Number(tab[i][4]) + " * " + tab[i][2] + sep + a.translate(tab[i][1]);
        var altprod =  a.sql("select PRODUCTCODE, shorttext from PRODUCT join textblock on "
            + "(AOTYPE = 1 and TABLENAME = 'PRODUCT' and ROW_ID = productid) where PRODUCTID = '" + tab[i][5] + "'", a.SQL_ROW);
        // Tooltip
        var prodinfo = a.translate("Anzahl: ") + Number(tab[i][4]) + "\n";
        var icon = null; // icons für alternativ und optional werden weiter unten gesetzt
        if ( tab[i][6] == "Y" ) 
        {
            prodinfo += a.translate("optinaler ");
            icon = "36";
        }
        prodinfo += a.translate("Artikel: ") + tab[i][2] + sep + a.translate(tab[i][1]) + "\n";
        prodinfo += a.translate("Warengruppe: ") + a.translate(tab[i][3]) + "\n" +  a.translate("Beschreibung: ") ; 							 

        sector.push([a.encodeMS( node.concat([tab[i][0]])), product, prodinfo, icon, endnode, nodeid, "false"]);
    }
}  
a.ro(sector);