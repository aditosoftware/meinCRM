var id =  a.decodeFirst(a.valueof("$comp.tbl_indexsort"));
var data = a.getTableData("$comp.tbl_indexsort", a.ALL);
var actindex = Number(a.getTableData("$comp.tbl_indexsort", [id])[0][2]);
var columns = []

for ( var i = 0; i < data.length; i++ )
{
    if ( data[i][2] == actindex )   var oldvalue = data[i][1]		
    if ( data[i][2] == actindex-1 ) var newvalue = data[i][1];
    columns[data[i][2]] = data[i][1];
}
columns[actindex] = newvalue;
columns[actindex-1] = oldvalue;
a.setValue("$comp.listColumn", a.encodeMS( columns ))
a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");