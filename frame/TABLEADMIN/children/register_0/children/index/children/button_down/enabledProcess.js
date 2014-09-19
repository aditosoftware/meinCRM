var id = a.decodeFirst(a.valueof("$comp.tbl_indexsort"))
var ret = false;

if ( id != "" )		ret = a.getTableData("$comp.tbl_indexsort", [id])[0][2] < a.getTableData("$comp.tbl_indexsort", a.ALL).length -1 ;
a.rs( ret );