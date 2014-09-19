import("lib_addr");
import("lib_modul");
import("lib_offerorder");

var ret = "";
var RelID = a.valueof("$comp.RELATION_ID");
var ordertype = a.valueof("$comp.ORDERTYPE");
var language = a.sql("select LANG from RELATION where RELATIONID = '" + RelID +"'");
var aotype;

if( RelID != "" && ordertype != "" && language != "" )
{	
    a.setValue("$comp.ADDRESS_INVOICE", getOrderAddress( RelID, "Rechnungsadresse" ))
    a.setValue("$comp.ADDRESS_DELIVERY", getOrderAddress( RelID, "Lieferadresse" ));
    
    if (ordertype != "" && a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW )
    {
        a.setValue("$comp.LANGUAGE", language );
        if ( !( a.hasvar("$image.DefaultValues") && a.valueofObj("$image.DefaultValues")["$comp.PAYMENTTERMS"] != undefined) )
        {
            a.setValue("$comp.PAYMENTTERMS", getRelAttr( "Zahlungskondition", RelID));
        }
        if ( !( a.hasvar("$image.DefaultValues") && a.valueofObj("$image.DefaultValues")["$comp.DELIVERYTERMS"] != undefined) )
            a.setValue("$comp.DELIVERYTERMS", getRelAttr( "Lieferkondition", RelID));
	
        var sqlstr = "select LONG_TEXT from TEXTBLOCK where SHORTTEXT = 'Standard' and LANG = " + language ;
        aotype = getAOType ("Kopf", ordertype);
        if (aotype != '' && !(a.hasvar("$image.DefaultValues") && a.valueofObj("$image.DefaultValues")["$comp.HEADER"] != undefined))
        {
            a.setValue("$comp.HEADER", a.sql( sqlstr + " and AOTYPE = " + aotype))
        }

        aotype = getAOType ("Fuss", ordertype);
        if (aotype != '') a.setValue("$comp.FOOTER", a.sql( sqlstr + " and AOTYPE = " + aotype))
    }
}