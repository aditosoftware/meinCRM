import("lib_attr");

var condition = getGrantCondition( a.valueof("$sys.currentimagename"), a.valueof("$sys.selection"), undefined, "EDIT" );
var rowssql = "select RELATIONID from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID"
+ " join ORG on RELATION.ORG_ID = ORG.ORGID where " + condition + " and RELATIONID ";

runAttr( rowssql, a.valueof("$image.FrameID"), true);