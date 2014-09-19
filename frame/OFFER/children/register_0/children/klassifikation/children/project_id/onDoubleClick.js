var projid = a.valueof("$comp.PROJECT_ID")
if(projid != "")
    a.openFrame("SALESPROJECT", "SALESPROJECTID = '" + projid + "'", false, a.FRAMEMODE_SHOW);