var status = a.valueof("$comp.STATUS");
a.rs( status != "" && ( a.valueof("$comp.tbl_orgdubletten") == "" || a.valueof("$comp.tbl_persdubletten") == "") )