import("lib_grant");

var row = a.valueofObj("$local.rowdata");
var attr1 = row[3];
var attr2 = row[4];
var component = "";

if (attr1 != "" && attr1 != null)
	component = a.sql("select attrcomponent from attr where attrid = '" + attr1 + "'");

if (component == "0" && getGrants( 10 , attr1 )[2] && getGrants( 10 , attr2 )[2] )
	a.rs("$comp.attributelist2");
else
{
	a.setValue("$comp.attributelist2", "");
	a.rs(null);
}