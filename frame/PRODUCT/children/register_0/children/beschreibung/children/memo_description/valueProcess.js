import("lib_product");

/*var pid = a.valueof("$comp.PRODUCTID");
var retstr = "";

if (pid != "")
{
	var lang = a.valueof("$comp.cbx_Sprache");
	var condition = "TABLENAME = 'PRODUCT' and ROW_ID = '" + pid + "' and LANG = " + lang;
	retstr = a.sql("select LONG_TEXT from TEXTBLOCK where " + condition );
}
a.rs( retstr );
*/

a.rs(getTextblockField( "LONG_TEXT", a.valueof("$comp.cbx_Sprache"),  a.valueof("$comp.lbl_fetch") ) );