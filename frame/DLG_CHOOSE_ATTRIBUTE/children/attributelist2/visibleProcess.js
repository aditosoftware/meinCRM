var attribute = a.valueof("$comp.attributelist1");
var component = "";
if (attribute != "")
{
    component = a.sql("select attrcomponent from attr where attrid = '" + attribute + "'");
}
a.rs (component == "0");