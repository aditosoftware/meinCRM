import("lib_frame");

var relation = a.sql("select RELATION_ID, PERS_ID from DISTLISTMEMBER join RELATION on RELATION_ID = RELATIONID where DISTLISTMEMBERID = '" 
    + a.decodeFirst(a.valueof("$comp.tbl_distlistmember")) + "'", a.SQL_ROW);

var prompts = new Array();	
prompts["ID"] =  relation[0];
prompts["comp4refresh"] = "$comp.tbl_distlistmember";
prompts["autoclose"] =  true;

var condition = "RELATION.RELATIONID = '" +  relation[0] + "'";
var fd = new FrameData();
var frame = fd.getData("id", relation[1] == "" ? 1 : 2, ["name"]);

if ( a.valueof("$global.upwardLink") == "link")
    a.openLinkedFrame(frame, condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
else
    a.openFrame(frame, condition, false, a.FRAMEMODE_SHOW, null, true);