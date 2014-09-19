import("lib_table4report")

var pids = a.decodeMS(a.valueof("$sys.tableselection"));
//	wegen Sichtbarkeitsformel kann es nur einen Fragebogen geben, deshalb Einschränkung bei 'aktiv'

if (pids.length > 1)	var condition = "QUESTIONNAIRELOGID in ('" + pids.join("','") + "')";
else	condition = a.valueof("$sys.selection");

var rpt = PrintQuest(condition);
var data = rpt[0];
var fields = rpt[1];

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

a.openStaticReport("RPTJ_QUESTIONNAIRELOG", false, a.REPORT_OPEN, null, params, fields, data);