var sel = a.valueof("$comp.tblOptions");

if(sel != "")
{
	if(a.askQuestion(a.translate("Alle markierten Optionen löschen?"), a.QUESTION_YESNO, "") == "true")
	{
		sel = a.decodeMS(sel);
		var now = date.date();
		var spalten = ["DELDATE"];
		var typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_CONFIGURATION", spalten);
		var werte = [now];
		for(var i=0; i < sel.length; i++)
		{
			a.sqlUpdate("AOSYS_CONFIGURATION", spalten, typen, werte, "OPTIONID = '" + sel[i] + "'");
		}
	}
	a.refresh();
}