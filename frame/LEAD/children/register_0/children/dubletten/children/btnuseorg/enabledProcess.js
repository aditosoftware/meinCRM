var status = a.valueof("$comp.STATUS");
a.rs( (  status == 1 || status == 4 || status == 5 ) && a.valueof("$comp.tbl_orgdubletten") != "" )