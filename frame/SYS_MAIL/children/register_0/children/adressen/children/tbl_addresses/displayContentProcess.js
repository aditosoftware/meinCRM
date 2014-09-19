import("lib_sql");
import("lib_util");

var mailaddr = a.valueofObj("$image.addr");

var sql = "select "
+ concat(new Array("orgname", "'-'", "firstname", "lastname") )
+ " , relation.relationid from relation join org on (relation.org_id = org.orgid)"
+ " left join pers on (relation.pers_id = pers.persid)"
+ " left join comm on (relation.relationid = COMM.RELATION_ID)"
+ " where upper(COMM.ADDR) like upper('";

var addrcopy = "";
var list = new Array();
var listindex = 0;
for(i = 0; i < mailaddr.length; i++) 
{
    var addr = trim(mailaddr[i]);
    if ( addr != "" ) 
    {
        var relation = a.sql( sql + addr + "')", a.SQL_COLUMN );
        var showaddr = a.translate("Adrssse nicht vorhanden!");
        if ( relation.length > 0 ) showaddr = relation[0];
        list.push( [ listindex++, addr, showaddr, relation[1] ] );
        if ( addrcopy != "" ) addr = "; " + addr;
        addrcopy += addr;
    }
}
a.setValue("$comp.addrcopy", addrcopy);
a.ro(list);