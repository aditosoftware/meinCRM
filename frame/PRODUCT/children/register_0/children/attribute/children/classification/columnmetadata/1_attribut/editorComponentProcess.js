import("lib_grant");

var row = a.valueofObj("$local.rowdata");
var attr1 = row[3];
var attr2 = row[4];
	
if ( getGrants( 10 , attr1 )[2] && getGrants( 10 , attr2 )[2] ) 	a.rs("$comp.attributelist1");
else	a.rs(null);