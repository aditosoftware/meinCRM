var wbed = "";
if(a.valueof("$comp.cmb_prozess_tasklog") != "")
    wbed = " where prozess ='" + a.valueof("$comp.cmb_prozess_tasklog") +"'";

a.rq("select tasklogid, prozess, beschreibung, date_new, status, prio from TASKLOG" + wbed + " order by 1 desc");