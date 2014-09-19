import("lib_offerorder");
import("lib_attr");

// min und max Attribute überprüfen
a.rs ( checkAttrCount() );

// Offercode nochmals prüfen wenn keine Kopie aus vorhandenem Angebot (VERSNR = 1)
if (a.valueof("$comp.VERSNR") == "1" && a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW)
{
    var maxcode = a.sql("select max(OFFERCODE) from OFFER");
    if (maxcode == '')  maxcode = 1000;
    a.setValue("$comp.OFFERCODE", eMath.addInt(maxcode, 1) );
}

a.refresh("$comp.NET");
a.refresh("$comp.VAT");
a.refresh("$comp.SUMME_brutto");