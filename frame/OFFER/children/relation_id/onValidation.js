import("lib_addr");
import("lib_modul");
import("lib_offerorder");

var ret = "";
var RelID = a.valueof("$comp.RELATION_ID");
var addrid = a.valueof("$comp.cmb_address");
var language = a.sql("select LANG from RELATION where RELATIONID = '" + RelID +"'")

if( RelID != "" && language != "")
{	
    ret = new AddrObject( RelID, addrid ).formatAddress();
    a.setValue("$comp.ADDRESS", ret);
    if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW )
    {
        a.setValue("$comp.LANGUAGE",language );
        a.setValue("$comp.PAYMENTTERMS", getRelAttr( "Zahlungskondition", RelID));
        a.setValue("$comp.DELIVERYTERMS", getRelAttr( "Lieferkondition", RelID));
        a.setValue("$comp.HEADER", a.sql("select LONG_TEXT from TEXTBLOCK where SHORTTEXT = 'Standard' and AOTYPE = 11 and LANG = "	+ language));
        a.setValue("$comp.FOOTER", a.sql("select LONG_TEXT from TEXTBLOCK where SHORTTEXT = 'Standard' and AOTYPE = 12 and LANG = "	+ language));
    }
}