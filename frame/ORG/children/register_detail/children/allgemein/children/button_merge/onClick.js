import("lib_history");
import("lib_duplicate");

var answer = a.askQuestion(a.translate("Wollen Sie alle Daten der ausgewählten Firma zu der aktuellen Firma übertragen\n") 
    + a.translate("und danach die Dubletten-Firma löschen ?"), a.QUESTION_YESNO, "")
if (answer == 'true')
{
    var newrelid = a.valueof("$comp.relationid");
    var oldrelid = a.valueof("$comp.Merge_RELATION_ID");

    var info = mergeOrg( oldrelid, newrelid );
 	
    var link = new Array(new Array(newrelid, "1"));
    var medium = a.sql("select keyvalue from keyword where keyname1 = 'Intern' and " + getKeyTypeSQL("HistoryMedium"));

    newHistory(a.valueof("$global.user_relationid"), medium, "i", a.translate("Firmendaten zusammengeführt und Dubletten-Firma gelöscht"), info, link);
	
    a.setValue("$comp.Merge_RELATION_ID", "");
    a.showMessage("Merger completed");
    a.refresh();
}