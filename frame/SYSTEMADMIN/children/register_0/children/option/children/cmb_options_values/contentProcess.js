import("lib_keyword");

var retvalues = [];
var id = a.decodeFirst(a.valueof("$comp.tblOptions"))
if ( id != "" )
{
    var optionname = a.getTableData("$comp.tblOptions", [id])[0][1];

    var optionvalues = a.sql("select KEYDETAIL from KEYWORD where KEYNAME2 = '" + optionname + "' and  " + getKeyTypeSQL("OPTIONS")).split("\n");
    for ( var i = 0; i < optionvalues.length; i++ )   retvalues.push([optionvalues[i].replace(/(^\s+)|(\s+$)/g,"")]);
}
a.ro( retvalues );