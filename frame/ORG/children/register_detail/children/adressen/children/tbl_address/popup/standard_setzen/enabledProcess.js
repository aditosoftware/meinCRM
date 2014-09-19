var wmode = a.valueof("$sys.workingmode");

a.rs( ( wmode == a.FRAMEMODE_EDIT || wmode == a.FRAMEMODE_NEW ) && a.valueof("$comp.tbl_ADDRESS") != "" );