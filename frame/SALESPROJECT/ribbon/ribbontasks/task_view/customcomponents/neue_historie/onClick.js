import("lib_history");

var list = [];
var relids = a.decodeMS(a.valueof("$comp.tblTeam"));
for (i=0; i<relids.length; i++)
{
	var relid = a.sql("select RELATION_ID from SPMEMBER where SPMEMBERID = '" + relids[i] + "'");
	list.push(relid)
}
list.push( [a.valueof("$comp.RELATION_ID")]);

InsertHistory( list, "", "", "", "", [ [a.valueof("$comp.idcolumn"), a.valueof("$image.FrameID")] ] );