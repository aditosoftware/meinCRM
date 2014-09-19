import("lib_frame");

var relation = a.sql("select RELATION_ID, PERS_ID from BULKMAILRCPT join RELATION on RELATIONID = RELATION_ID where BULKMAILRCPTID = '"
    + a.decodeFirst(a.valueof("$comp.tblRcpt")) + "'", a.SQL_ROW);
var type = "";
var prompts = new Array();	
prompts["ID"] =  relation[0];
prompts["comp4refresh"] = "$comp.tblRcpt";
prompts["autoclose"] =  true;

var condition = "RELATION.RELATIONID = '" + relation[0] + "'";

if ( relation[1] == "" ) type = "1"; else type = 2;
var fd = new FrameData();
var frame = fd.getData("id", type, ["name"]);

if ( a.valueof("$global.upwardLink") == "link")
    a.openLinkedFrame(frame, condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
else
    a.openFrame(frame, condition, false, a.FRAMEMODE_SHOW, null, true);