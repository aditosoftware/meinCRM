var status = a.valueof("$comp.STATUS");
a.rs( status == 1 && a.valueof("$comp.tbl_orgdubletten") != "" && a.valueof("$comp.tbl_persdubletten") != "" );