var row = a.valueofObj("$local.rowdata");
if (row[5] == "keyword")
	a.rs("$comp.KEYNAME");
else
	a.rs(null);