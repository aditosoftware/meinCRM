import("lib_attr");

var condition = getGrantCondition( a.valueof("$sys.currentimagename"), a.valueof("$sys.selection"), undefined, "EDIT" );
var rowssql = "select EMPLOYEEID from EMPLOYEE where " + condition + " and EMPLOYEEID ";

runAttr( rowssql, a.valueof("$image.FrameID"));