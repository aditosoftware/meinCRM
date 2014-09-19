import("lib_attr");

if ( a.valueofObj("$local.idvalue") != "undefined" )
	a.ro( AttributeTable( a.valueofObj("$image.FrameID"), a.valueofObj("$local.idvalue"), true ) );
else
	a.ro( AttributeTable( a.valueofObj("$image.FrameID"), a.valueof("$comp.idcolumn"), "getkey" ) );