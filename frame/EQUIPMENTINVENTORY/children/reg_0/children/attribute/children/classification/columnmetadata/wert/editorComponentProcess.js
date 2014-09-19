import("lib_attr");

var row = a.valueofObj("$local.rowdata");
var attr1 = row[3];
var attr2 = row[4];
var type = GetComponent(attr1, attr2);
var comp = ["$comp.cbx_attrvalue","$comp.string_attrvalue","$comp.chk_attrvalue","$comp.date_attrvalue","$comp.int_attrvalue","$comp.float_attrvalue","$comp.cbx_attrvalue"];
if ( type == "" || type == undefined || type == null) 
    type = "1"; 
	
if (type == "0")
{

    a.rs(null);
}
else
{
    a.rs ( comp[  parseInt( type ) - 1 ] );
}