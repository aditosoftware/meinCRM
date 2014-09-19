import("lib_attr");

var condition = getGrantCondition( a.valueof("$sys.currentimagename"), a.valueof("$sys.selection"), undefined, "EDIT" );
var rowssql = "select RELATIONID from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID join PERS on RELATION.PERS_ID = PERS.PERSID where " + condition + " and RELATIONID ";

runAttr( rowssql, a.valueof("$image.FrameID"), true);