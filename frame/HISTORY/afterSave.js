import("lib_document");
import("lib_linkedFrame");
import("lib_themetree")

// Restliche HistoryLink speichern
if ( a.hasvar("$image.toLinklength") )
{
    var toLink = a.valueofObj("$image.toLink");	
    var datum = a.valueof("$sys.date");
    var historyid = a.valueof("$comp.historyid"); 
    var toLinklength = a.valueof("image.toLinklength");
    var fields = new Array("HISTORYLINKID", "HISTORY_ID", "OBJECT_ID", "ROW_ID", "DATE_EDIT", "USER_NEW");
    var ftypes = a.getColumnTypes("HISTORYLINK", fields);	
    var linkinsert = [];
    for ( var i = parseInt( toLinklength ); i < toLink.length; i++)
    {
        linkinsert.push(["HISTORYLINK", fields, ftypes, [a.getNewUUID(), historyid, toLink[i][1], toLink[i][0], datum, user]]);
    }
    a.sqlInsert( linkinsert );
} 

// speichern eines Dokument
if ( a.hasvar("$image.FileList") && a.valueof("$sys.workingmodebeforesave") == a.FRAMEMODE_NEW)
{
    var filelist = a.valueofObj("$image.FileList");
    for ( i = 0; i < filelist.length; i++ )
    {
        addHistoryDocument( a.valueof("$comp.historyid"), filelist[i] );
    }
    a.refresh();
}

// Wiedervorlage-Aufgabe setzen wenn im Themenbaum für die eingetragenen Themen ein Reminder gestezt ist !!
if ( a.hasvar("$image.pHistoryThemeIDs") )  setreminder( a.valueofObj("$image.pHistoryThemeIDs") );

// wegen Folgehistorie aktualisieren des HTML-Felds histories_html
a.refresh("$comp.histories_html");

// Schliessen, Speichern, Aktualisieren von Superframe
swreturn();