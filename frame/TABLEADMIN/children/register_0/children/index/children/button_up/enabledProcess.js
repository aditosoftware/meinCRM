var id = a.decodeFirst(a.valueof("$comp.tbl_indexsort"))
var ret = false;

if ( id != "" )		ret = a.getTableData("$comp.tbl_indexsort", [id])[0][2] > 0;
a.rs( ret );