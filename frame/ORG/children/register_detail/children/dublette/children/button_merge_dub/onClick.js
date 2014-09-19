import("lib_history");
import("lib_duplicate");

var answer = a.askQuestion(a.translate("Wollen Sie alle Daten der markierten Firma zu der aktuellen Firma übertragen\n") 
    + a.translate("und danach die markierte Firma löschen ?"), a.QUESTION_YESNO, "")
if (answer == 'true')
{
    var newrelid = a.valueof("$comp.relationid");
    var oldrelid = a.decodeFirst(a.valueof("$comp.tbl_dubletten_org"));

    var info = mergeOrg( oldrelid, newrelid );
 	
    var link = new Array(new Array(newrelid, "1"));
    var medium = a.sql("select keyvalue from keyword where keyname1 = 'Intern' and " + getKeyTypeSQL("HistoryMedium"));

    newHistory(a.valueof("$global.user_relationid"), medium, "i", a.translate("Firmendaten zusammengeführt und Dubletten-Firma gelöscht"), info, link);

    a.showMessage("Merger completed");
    a.refresh();
}