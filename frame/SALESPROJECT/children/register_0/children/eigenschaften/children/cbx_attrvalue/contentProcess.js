import("lib_attr")

if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_TABLE )
{
	var selection = a.decodeMS(a.valueof("$local.selection"));
	var attr1 = selection[0];
	var attr2 = selection[1];
}
else
{
	var attr1 = a.valueof("$comp.attributelist1");
	var attr2 = a.valueof("$comp.attributelist2");
}
a.returnobject( getAttrValue( attr1, attr2, a.valueof("$comp.cbx_attrvalue") ));