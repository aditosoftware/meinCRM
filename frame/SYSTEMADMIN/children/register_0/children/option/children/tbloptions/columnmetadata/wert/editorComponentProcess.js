import("lib_keyword");

var options = a.valueofObj("$local.rowdata");
var detail = a.sql("select KEYDETAIL from KEYWORD where KEYNAME2 = '" + options[1] + "' and  " + getKeyTypeSQL("OPTIONS"));

if( detail != "")
{
		a.rs("$comp.cmb_options_values");
}
else a.rs("$comp.edtOptionValue");