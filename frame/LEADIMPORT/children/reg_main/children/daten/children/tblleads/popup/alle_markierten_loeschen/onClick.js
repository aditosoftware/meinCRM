var str = a.decodeMS(a.valueof("$comp.tblLeads")); 

if (str.length > 0)	
{
	var quest = a.askQuestion(a.translate("Wollen Sie wirklich alle markierten löschen ?"), a.QUESTION_YESNO,"");
	
	if (quest == 'true')	a.sqlDelete("LEAD", "LEADID IN ('" + str.join("','") + "')");
	a.doAction(ACTION.FRAME_UPDATE);
}