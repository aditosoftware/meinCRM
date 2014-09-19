var ids =  a.decodeMS(a.valueof("$comp.tbl_AufgabeEskalation"));
var datenew = a.askUserQuestion(a.translate("Verschieben auf Datum?"), "DLG_DATE");
if (datenew != null )
{
	datenew = datenew["DLG_DATE.Edit_date"];
	if (datenew <= a.valueof("$sys.today")) a.showMessage("nur Verschiebung in die Zukunft erlaubt!")
	else
	{
		var Entry = "";
		for (i=0; i<ids.length; i++)
		{
			Entry = calendar.getEntry(ids[i])[0];
			Entry[calendar.DUE] = String(eMath.addInt(datenew, date.ONE_HOUR));
			Entry[calendar.DTSTART] = datenew;
			calendar.update(new Array(Entry));
		}
		a.refresh("$comp.tbl_AufgabeEskalation")
	}
}