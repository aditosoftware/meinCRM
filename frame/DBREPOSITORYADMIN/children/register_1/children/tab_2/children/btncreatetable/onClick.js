import("lib_dbschema");

/*
	diese routine legt alle tabellen im ausgewaehlten zielalias an, die in der liste der
	im repository vorhandenen tabellen ausgewählt sind.
	
	2007-04-17-ah erste version
	2007-04-20-ah aenderung bei der fehlerbehandlung
*/

var repo = new RepositoryObject();
var msg = a.translate("Bitte Alias zur Erzeugung der Tabellen auswählen");
var result = a.askQuestion(msg, a.QUESTION_COMBOBOX, "|" + repo.getDatabaseAliases().join("|") );

if(result != null) // kein abbruch
{
    // initialisierung
    var okcount = 0;
    var errcount = 0;
    var errlist = new Array();
	
    var sel = a.decodeMS(a.valueof("$comp.tblTablelist")); // die auswahl der tabellen
    if (a.valueof("$comp.chk_allTables") == 'true')	sel = a.sql("select TABLEID from AOSYS_TABLEREPOSITORY", a.SQL_COLUMN);
    var aliasname = result;
    // alias laden und datenbanktyp feststellen
    var aliasmodel = a.getAliasModel(aliasname);
    var dbtype = aliasmodel[a.ALIAS_PROPERTIES]["databasetype"];

    // jetzt der reihe nach alle tabellen anlegen	
    for(var i = 0; i < sel.length; i++)
    {
        var tblobj = repo.tableFromRepositoryID(sel[i]);
        // Keine Include-Tabellen anlegen
        if ( tblobj.tabletype != 'I')
        {
            tblobj.databasetype = dbtype;
            tblobj.uselongnames = false;
            // beim anlegen immer den primary key erzeugen, unabhaengig von der auswahl im GUI
            tblobj.scriptprimarykey = "true"; 
            tblobj.separator = "";

            var sqlstmt = new Array();
            sqlstmt[0] = tblobj.getDeclaration();
            sqlstmt = sqlstmt.concat(tblobj.getIndexDeclaration());
            try
            {
                a.sql(sqlstmt, aliasname);
                okcount++;
            }
            catch(ex)
            {
                errcount++;
                // den tabellennamen in die liste der problemfaelle aufnehmen
                errlist.push( tblobj.name );
                log.log(ex);
            }
        }
    }

    // abschliessende meldung
    msg = a.translate("Tabellen angelegt")+": "+ okcount + "\n";
    if(errlist.length > 0)
    {
        msg += a.translate( " %0 Tabellen konnten nicht angelegt werden:\n", new Array(errcount ));
        //		msg += a.translate(errcount + " " + "Tabellen konnten nicht angelegt werden:\n");
        msg += errlist.join(", ");
    }
    a.showMessage(msg);
}
else
{
    a.showMessage(a.translate("Keine Tabellen wurden erzeugt."));
}