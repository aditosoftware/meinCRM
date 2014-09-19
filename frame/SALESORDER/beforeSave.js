import("lib_attr");

a.refresh("$comp.NET");
a.refresh("$comp.SUMME_UMST");
a.refresh("$comp.SUMME_brutto");
a.refresh("$comp.zahlungsziel");

// Ordercode bei Neuanlage nochmals prüfen
if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW)
{
    var maxcode = a.sql("select max(ordercode) from salesorder");
    if (maxcode == '')  maxcode = 1000;
    a.setValue("$comp.ORDERCODE", eMath.addInt(maxcode, 1) );
}

// min und max Attribute überprüfen
a.rs ( checkAttrCount() );