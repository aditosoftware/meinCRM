var qid = a.valueof("$comp.cmb_fragebogen");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
var data = a.sql("select QUESTIONTEXT from QUESTION where QUESTION.QUESTIONNAIRE_ID = '" + qid + "'", a.SQL_COMPLETE);

a.openStaticReport("RPTJ_EVENTFEEDBACK", false, a.REPORT_OPEN, null, params, ["QUESTIONTEXT"], data );