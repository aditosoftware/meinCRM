import("lib_attr")

var attr1 
var attr2

if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_TABLE )
{
    var selection = a.decodeMS(a.valueof("$local.selection"));
    attr1 = selection[0];
    attr2 = selection[1];
}
else
{
    attr1 = a.valueof("$comp.attributelist1");
    attr2 = a.valueof("$comp.attributelist2");
}
a.returnobject( getAttrValue( attr1, attr2, a.valueof("$comp.cbx_attrvalue") ));