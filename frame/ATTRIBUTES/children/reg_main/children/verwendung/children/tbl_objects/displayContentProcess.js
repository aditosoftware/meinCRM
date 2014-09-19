import("lib_keyword");
import("lib_frame");

var attrid = a.valueof("$comp.attrid");
var list = "";
if (attrid != "") 
{
    var fd = new FrameData();
    list =	a.sql("select ATTROBJECTID, ATTROBJECT, MINCOUNT, MAXCOUNT, KEYVALUE from ATTROBJECT where ATTR_ID = '" + attrid + "'", a.SQL_COMPLETE);
    for ( var i=0; i < list.length; i++ )
    {		
        var keyword = fd.getData("id", list[i][1], ["title"]);
        if ( keyword != "" && list[i][4] != "" )
        {
            list[i][4] = a.translate(a.sql("select KEYNAME1 from KEYWORD where KEYVALUE = " + list[i][4] + " and " 
                + getKeyTypeSQL( fd.getData("id", list[i][1], ["keyword"]) )));
        }
        list[i][1] = keyword;
    }
}
if (list.length == 0) list = a.createEmptyTable(5)
a.returnobject( list );