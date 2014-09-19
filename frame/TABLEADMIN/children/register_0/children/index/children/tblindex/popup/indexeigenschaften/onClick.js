var tblid = a.valueof("$comp.TABLEID");
var sel = a.decodeFirst(a.valueof("$comp.tblIndex"));

if(sel != "" && tblid != "")
{

	var data = a.sql("select COLUMNLIST, INDEXNAME, ISUNIQUE from aosys_indexrepository where AOSYS_INDEXREPOSITORYID = '"  + sel + "'", a.SQL_ROW);
	a.localvar("$local.TABLEID", tblid);
	a.localvar("$local.INDEXNAME", data[1]);
	a.localvar("$local.INDEXCOLUMNS", data[0]);
	a.localvar("$local.ISUNIQUE", data[2] == "Y" ? "true" : "false");

	var dlg = a.askUserQuestion(a.translate("Bitte Daten eingeben") + ": ", "DLG_REPO_ADDIDX");
	
	if(dlg != null)
	{
			var spalten = ["INDEXNAME", "ISUNIQUE", "COLUMNLIST", "TABLE_ID"];
			var typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_INDEXREPOSITORY", spalten);
			var werte = [ dlg["DLG_REPO_ADDIDX.INDEXNAME"]
			            , dlg["DLG_REPO_ADDIDX.ISUNIQUE"] == "true" ? "Y" : "N"
			            , dlg["DLG_REPO_ADDIDX.INDEXCOLUMNS"]
			            , tblid ];
			a.sqlUpdate("AOSYS_INDEXREPOSITORY", spalten, typen, werte, "AOSYS_INDEXREPOSITORYID = '"  + sel + "'");
			a.refresh("$comp.tblIndex");
			a.refresh("$comp.listColumn");		
	}

}