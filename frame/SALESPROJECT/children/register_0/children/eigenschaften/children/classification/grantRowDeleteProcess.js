import("lib_grant");

var attrlinkid = a.decodeFirst(a.valueof("$comp.classification"));
if ( attrlinkid != "" )
{
	var attr = a.getTableData("$comp.classification", [attrlinkid])[0];
	//  frameid ATTR = 10 , EDIT = 2
	a.rs( getGrants( 10 , attr[3] )[2] && getGrants( 10 , attr[4] )[2] );
}