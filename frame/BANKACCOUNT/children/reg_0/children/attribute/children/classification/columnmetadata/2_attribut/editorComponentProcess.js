var row = a.valueofObj("$local.rowdata");

var attribute = row[3];
var component = "";

if (attribute != "" && attribute != null)
    component = a.sql("select attrcomponent from attr where attrid = '" + attribute + "'");

if (component == "0")
    a.rs("$comp.attributelist2");
else
    a.rs(null);