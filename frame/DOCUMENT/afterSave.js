import("lib_linkedFrame");
import("lib_document");

// Dokumente kopieren
if (a.hasvar("$image.FromID"))
{
    var fromid = a.valueof("$image.FromID");
    if ( fromid != "" )	copyAttachments( "Vorlage", fromid, a.valueof("$comp.idcolumn"));
    a.imagevar("$image.FromID", "");
    a.refresh();
}

// Schliessen, Speichern, Aktualisieren von Superframe
swreturn();