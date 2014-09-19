a.sqlDelete("COMMRESTRICTION", " COMMRESTRICTIONID = '" + a.valueof("$local.idvalue") + "'");
a.refresh("$comp.lbl_commrestriction");