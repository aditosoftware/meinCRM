var status = a.valueof("$comp.STATUS");
a.rs( (  status == 1 || status == 2 || status == 3 ) && a.valueof("$comp.tbl_persdubletten") != "" )