// Produkt des Knotens ausschließen
var prodid =  a.valueof("$comp.lbl_partlist_prodid");
a.rs( "PRODUCTID not in (select SOURCE_ID from PROD2PROD where DEST_ID = '" + prodid + "')" );