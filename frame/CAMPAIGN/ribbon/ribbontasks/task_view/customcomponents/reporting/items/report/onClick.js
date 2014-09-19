var id = a.valueof("$comp.idcolumn");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
params["CAMPAIGN"] = a.valueof("$comp.name");

var rptfields = ["CODE", "STEP"];
data = a.sql("select "+ rptfields.join(",") + " from campaignlog "
    + " join campaignstep on step_id = campaignstepid "
    + " where campaignlog.campaign_id = '" + id 
    + "' order by code", a.SQL_COMPLETE);

a.openStaticLinkedReport("RPTJ_CAMPAIGN", false, a.REPORT_OPEN, null, params, rptfields, data );
