var prodid = a.valueof("$comp.PRODUCTID");
var nodeid = a.valueof("$comp.Tree_Partlist");
if ( nodeid != "" )
{
    node = a.decodeMS(nodeid);
    if ( node.length > 1 ) prodid = a.sql("select SOURCE_ID from PROD2PROD where PROD2PRODID = '" + node[node.length-1] + "'");
}
a.rs(prodid);