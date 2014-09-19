import("lib_history");
import("lib_duplicate");

var answer = a.askQuestion(a.translate("Wollen Sie alle Daten der markierten Person auf die aktuelle Person übernehmen\nund danach löschen ?"), a.QUESTION_YESNO, "");
if (answer == "true")
{
    var newrelid = a.valueof("$comp.relationid");
    var oldrelid = a.decodeFirst(a.valueof("$comp.tbl_dubletten_pers"));

    var info = mergePers( oldrelid, newrelid );
			
    var link = [[newrelid, a.valueof("$comp.AOTYPE")]];
    var medium = a.sql("select keyvalue from keyword where keyname1 = 'Intern' and " + getKeyTypeSQL("HistoryMedium"));

    newHistory(a.valueof("$global.user_relationid"), medium, "i", a.translate("Personendaten zusammengeführt und die Dublette gelöscht"), info, link);

    a.showMessage("Merger completed");
    a.refresh();
}