import("lib_dbschema")

var liste = a.decodeMS(a.valueof("$comp.tblDatabaseTable"));
var alias = a.valueof("$comp.comboAlias");

var aliasmodel = a.getAliasModel(alias);
var dbtype = aliasmodel[a.ALIAS_PROPERTIES]["databasetype"];

var casing = a.valueof("$comp.comboCase");
// default ist keine Änderung der Schreibweise
if(casing == "") casing = "KEEP"; 

if(dbtype == a.DBTYPE_ORACLE10_OCI
    || dbtype == a.DBTYPE_ORACLE10_THIN 
    || dbtype == a.DBTYPE_INTERBASE7 
    || dbtype == a.DBTYPE_SQLSERVER2000 
    || dbtype == a.DBTYPE_POSTGRESQL8
    || dbtype == a.DBTYPE_DERBY10
    || dbtype == a.DBTYPE_MYSQL4)	
{
    if((alias != "") && (liste.length > 0))
    {
        var ok = a.askQuestion(a.translate("Alle markierten Tabellen ins Repository übernehmen?"), a.QUESTION_YESNO, "");
		
        if(ok == "true")
        {
            var repo = new RepositoryObject();
            for(var i = 0; i < liste.length; i++)
            {
                var cont = "true";
                var tblexists = false;
                if(repo.hasTable(liste[i]))
                {
                    tblexists = true;
                    cont = a.askQuestion(a.translate("Die Tabelle")+" "+ liste[i] +" "+a.translate("existiert bereits im Repository.\n")
                        + a.translate("Soll sie überschrieben werden?"), a.QUESTION_YESNO, "");
                }
                if(cont == "true")
                {
                    // zuerst die vorhandene tabelle aus dem repository entfernen
                    if(tblexists)
                    {
                        var tblid = a.sql( "select tableid from aosys_tablerepository where upper(tablename) = upper('" + liste[i] + "')" );
                        a.sqlDelete("AOSYS_COLUMNREPOSITORY", "TABLE_ID = '" + tblid + "'");
                        a.sqlDelete("AOSYS_INDEXREPOSITORY", "TABLE_ID = '" + tblid + "'");
                        a.sqlDelete("AOSYS_TABLEREPOSITORY", "TABLEID = '" + tblid + "'");
                    }
					
                    var tblobj = repo.tableFromAlias(liste[i], alias, casing);
                    repo.writeToRepository(tblobj);
                }
            }
			
            a.refresh();
        }
    }
}
else
{
    a.showMessage(a.translate("Derzeit wird der Import aus einem Datenbankalias\nfür diesen Datenbanktyp nicht unterstützt."));
	
}