import("lib_table4report");
import("lib_document");

var pids = a.decodeMS(a.valueof("$sys.tableselection"));
//	wegen Sichtbarkeitsformel kann es nur einen Fragebogen geben, deshalb Einschränkung bei 'aktiv'

if (pids.length > 1)	var condition = "QUESTIONNAIRELOGID in ('" + pids.join("','") + "')";
else	condition = a.valueof("$sys.selection");

PrintQuest(condition);

var tabelle = []
var sql = a.sql("select RPT_QUESTIONNAIRE.TITLE, QUESTIONCODE, QUESTIONTEXT, ANSWERCOUNT, ANSWERTEXT "
    + " from RPT_QUESTIONNAIRE "
    + " order by QUESTIONCODE desc", a.SQL_COMPLETE);
	
tabelle = "Titel;FrageNr.;Frage;AnzahlAntworten;Antwort;\r\n";
tabelle += a.toCSV(sql, "\r\n", ";", '"');
var fname = a.askQuestion("Bitte Datei auswählen", a.QUESTION_FILECHOOSER, "");
if(fname != null && fname != "")
{
    fname = fname + ".csv";
    if ( ! FileIOwithError(a.CLIENTCMD_STOREDATA, [fname, tabelle, a.DATA_TEXT, false]) )
        FileIOwithError(a.CLIENTCMD_OPENFILE, new Array(fname));
}