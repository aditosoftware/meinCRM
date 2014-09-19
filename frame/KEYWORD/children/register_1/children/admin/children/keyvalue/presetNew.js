var id = a.sql("select max(KEYVALUE) from KEYWORD where KEYTYPE = 0");

if ( id == "")
		a.rs(1);
else
		a.rs( parseInt(id) + 1);