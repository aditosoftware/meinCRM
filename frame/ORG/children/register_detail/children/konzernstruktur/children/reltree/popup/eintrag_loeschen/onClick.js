a.sqlDelete( "OBJECTRELATION", "OBJECTRELATIONID = '" + a.decodeMS(a.valueof("$comp.relTree"))[1] + "'");
a.refresh("$comp.relTree");