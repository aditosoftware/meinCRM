var row = a.valueofObj("$local.rowdata");
if	(
		row[5] == "float" || 
		row[5] == "numeric" || 
		row[5] == "char" || 
		row[5] == "varchar" || 
		row[5] == "nchar" || 
		row[5] == "nvarchar"
		)
	a.rs("$comp.COLUMNSIZE");
else
	a.rs(null);