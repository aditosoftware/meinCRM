var tblid = a.valueof("$comp.TABLEID");
if(tblid != "")
{
    a.localvar("$local.TABLEID", tblid);
    a.localvar("$local.INDEXNAME", a.valueof("$comp.TABLENAME") + "_" );
    var dlg = a.askUserQuestion(a.translate("Bitte Daten eingeben") + ": ", "DLG_REPO_ADDIDX");
    if(dlg != null)
    {
        var spalten = ["AOSYS_INDEXREPOSITORYID", "INDEXNAME", "ISUNIQUE", "COLUMNLIST", "TABLE_ID"];
        var typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_INDEXREPOSITORY", spalten);
        var indexid = a.getNewUUID()
        var werte = [ indexid
        , dlg["DLG_REPO_ADDIDX.INDEXNAME"]
        , dlg["DLG_REPO_ADDIDX.ISUNIQUE"] == "true" ? "Y" : "N"
        , dlg["DLG_REPO_ADDIDX.INDEXCOLUMNS"]
        , tblid ];
        a.sqlInsert("AOSYS_INDEXREPOSITORY", spalten, typen, werte);
        a.refresh("$comp.tblIndex");
        a.refresh("$comp.listColumn");		
    }
}