import("lib_keyword");

a.rs(a.sql("select count(*) from ORDERITEM where SALESORDER_ID = '" + a.valueof("$comp.idcolumn") + "'") > 0 
    && a.valueof("$comp.ORDERTYPE") == getKeyValue("Auftragsbestätigung", "ORDERTYPE"))