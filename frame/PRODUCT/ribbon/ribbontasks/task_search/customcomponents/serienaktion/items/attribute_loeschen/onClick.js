import("lib_attr");

var condition = getGrantCondition( a.valueof("$sys.currentimagename"), a.valueof("$sys.selection"), undefined, "EDIT" );
var rowssql = "select PRODUCTID from PRODUCT where " + condition + " and PRODUCTID ";

runAttr( rowssql, a.valueof("$image.FrameID"), true);