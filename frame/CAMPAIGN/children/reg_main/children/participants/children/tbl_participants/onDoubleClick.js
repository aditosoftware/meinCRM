var pid = a.decodeFirst(a.valueof("$comp.tbl_participants"));

var relation = a.sql("select pers_id, relationid from relation"
    + " join campaignparticipant on (campaignparticipant.relation_id = relation.relationid)"
    + " where campaignparticipantid = '" + pid + "'", a.SQL_ROW);
	
var frame = "PERS";
if ( relation[0] == "" )	frame = "ORG";
	
var condition = "RELATION.RELATIONID = '" + relation[1] + "'"
var prompts = new Array();
prompts["ID"] = relation[1];
prompts["comp4refresh"] = "$comp.tbl_participants";
prompts["autoclose"] =  true;

if ( a.valueof("$global.upwardLink") == "link")
{
    a.openLinkedFrame(frame, condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
}
else
{
    a.openFrame(frame, condition, false, a.FRAMEMODE_SHOW, null, true);  
}