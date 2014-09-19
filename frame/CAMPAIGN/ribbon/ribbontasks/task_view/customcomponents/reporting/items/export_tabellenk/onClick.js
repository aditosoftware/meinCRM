import("lib_sql");
import("lib_campaign");
import("lib_keyword");
import("lib_excelex");

/* Button "Ausführen" - Führt direkt die im Frame vorkommenden 
 * SQL-Befehle aus und übergibt die Auswertung Excel */
 
// Die nötigen Variablen.
var execIt
var campaignid = a.valueof("$comp.campaignid");
var clientlanguage = a.valueof("$sys.clientlanguage");

var sql = "select campaignparticipantid, "
+ concat(new Array("orgname", "'-'", "lastname", "firstname"))
+ ", campaignstep.step,"
+ " (select " + concat(new Array("lastname", "firstname")) + " from relation join pers on "
+ " (relation.pers_id = pers.persid) where relationid = campaignparticipant.employee_relation_id)"
+ " from campaignparticipant"	
+ " join campaignstep on (campaignstep.campaignstepid = campaignparticipant.campaignstep_id)"
+ " join relation on (relation.relationid = campaignparticipant.relation_id)"
+ " join org on (relation.org_id = org.orgid)"
+ " left join pers on (relation.pers_id = pers.persid)"
+ " where campaignparticipant.campaign_id = '" + campaignid + "'";

var headings =  new Array ("Kampagne","ID@3","Teilnehmer@4","Status@1","Zuständig@2");

// Benutzergesteuerte Variablen zum Öffnen des Programms

var startExcel = true;
var createPivot = true;
var decChang = true;

// Führt den SQL-Befehl aus
var dbAccess = a.sql(sql +  computeCondition() +  "  order by 4", a.SQL_COMPLETE);
// Fehlerprüfung. Wenn eine leere Tabelle übergeben wird, ist dbAccess[0][0] undefined, und es tritt ein Fehler auf,
// bevor die Fehlerhafte Tabelle an Microsoft Excel übergeben wird.
try
{
    var undefinedCheck = dbAccess[0][0];
    execIt = true;
} catch (ex)
{
    a.showMessage(a.translate("Es wurde eine leere Tabelle übergeben") + ".\n" + a.translate("Für den Export von Daten ist mindestens eine befüllte Spalte notwendig"));
    log.log(ex);
    execIt = false;
}

// Führt das Skript aus, sofern nicht durch das Eingabefehlerhandling oben untersagt.
if(execIt == true) exportExcel(dbAccess, headings, createPivot, startExcel, decChang, 52);