import("lib_grant");

a.rs(a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW && a.valueof("$comp.Combobox_Search") != "" 
    && isgranted("insert", a.valueof("$comp.idcolumn")) && a.valueof("$comp.EVENTSTATUS") < 3);