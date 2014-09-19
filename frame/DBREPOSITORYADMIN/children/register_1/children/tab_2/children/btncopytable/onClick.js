import("lib_dbschema")
import("lib_dbutil")

var okcount = 0;
var errcount = 0;
var repo = new RepositoryObject();
var msg = a.translate("Bitte Quell-Alias zum Kopieren der Daten auswählen");
var srcalias = a.askQuestion(msg, a.QUESTION_COMBOBOX, "|" + repo.getDatabaseAliases().join("|") );

if(srcalias != null)
{
    msg = a.translate("Bitte Ziel-Alias zum Kopieren der Daten auswählen");
    var destalias = a.askQuestion(msg, a.QUESTION_COMBOBOX, "|" + repo.getDatabaseAliases().join("|") );
}

if((srcalias != null) && (destalias != null))
{
    // frage, ob tabellen geleert werden sollen
    var truncate = a.askQuestion(a.translate("Sollen die Tabellen vor dem Kopieren geleert werden?"), a.QUESTION_YESNO, "");
	
    repo = new RepositoryObject();
	
    var liste = a.decodeMS(a.valueof("$comp.tblTablelist"));
    if (a.valueof("$comp.chk_allTables") == "true")	liste = a.sql("select TABLEID from AOSYS_TABLEREPOSITORY", a.SQL_COLUMN);

    for(var i = 0; i < liste.length; i++)
    {
        var tblobj = repo.tableFromRepositoryID(liste[i]);
        // Keine Include-Tabellen anlegen
        if ( tblobj.tabletype != 'I')
        {
            CopyDBTable(srcalias, destalias, repo.tablenameFromID(liste[i]), truncate);
            okcount++;
        }
    }	
    a.showMessage(a.translate("Die Daten wurden kopiert."));
}