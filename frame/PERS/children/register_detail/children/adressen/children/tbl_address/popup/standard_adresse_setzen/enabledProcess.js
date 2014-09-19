var wmode = a.valueof("$sys.workingmode");

a.rs( ( wmode == a.FRAMEMODE_EDIT || wmode == a.FRAMEMODE_NEW ) && a.valueof("$comp.tbl_ADDRESS") != "" 
    && a.decodeFirst(a.valueof("$comp.tbl_ADDRESS")).substr(0, 4) != "ZZZ#" );