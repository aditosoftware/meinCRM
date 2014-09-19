import("lib_loghist");

// Beachten für Logging: im Repository log anhaken, in PS audit auf on stellen, in Sequences zu loggende Tabellen auf Audit on stellen
a.rs( show_label_new_edit( ["PERS","RELATION","ADDRESS","COMM","ATTRLINK"], a.valueof("$comp.relationid"), 
    a.valueof("$comp.DATE_NEW"), a.valueof("$comp.USER_NEW") ));