var zip = a.valueof("$comp.ZIP");

if (a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW && zip != '')
    a.rq("select SALESAREA from AOSYS_LOCATION where ZIP = '" + zip + "'");