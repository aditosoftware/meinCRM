import("lib_keyword");

//Auswertung Umsatz
a.imagevar("$image.groups", 
    [ ["year(ORDERDATE)", "Jahr"], ["COUNTRY", "Land"], [getKeySQL("SALESAREA", "SALESAREA"), "Gebiet"], 
    [getKeySQL("GroupCode", "GROUPCODEID"), "Warengruppe"], [" ITEMNAME", "Produkt"],["ORGNAME", "Firma"] ]);
 

var umsatz = "case when ordertype = 2 and SENT = 'Y' and CANCELLED = 'N' then sum(QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100)"
+ "  when ordertype = 3 and SENT = 'Y' and CANCELLED = 'N' then sum((QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100) * -1)  else 0 end"
a.imagevar("$image.fields",   
    [ [umsatz, "Umsatz €"], 
    ["case when ordertype = 2 and SENT = 'Y' and CANCELLED = 'N' then sum(QUANTITY) when ordertype = 3 and SENT = 'Y' and CANCELLED = 'N' then ( sum(QUANTITY) * -1) else 0 end", "Absatz St."],
    ["case when ordertype = 2 and SENT = 'Y' and CANCELLED = 'N' then (sum(QUANTITY * PRICE) - sum(QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100)) "
    + "when ordertype = 3 and SENT = 'Y' and CANCELLED = 'N' and (sum(QUANTITY * PRICE) - sum(QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100 ) >= 0 )"
    + " then (sum(QUANTITY * PRICE) - sum(QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100 )* -1) else 0 end", "Rabatt %"]
    ]);
    
a.setValue("$comp.Gruppe", a.encodeMS(["year(ORDERDATE)"]));
a.setValue("$comp.Fields", a.encodeMS([umsatz]));    

//Auswertung Umsatz über Jahre
a.imagevar("$image.ujgroups", 
    [ ["COUNTRY", "Land"], [getKeySQL("SALESAREA", "SALESAREA"), "Gebiet"], 
    [getKeySQL("GroupCode", "GROUPCODEID"), "Warengruppe"], [" ITEMNAME", "Produkt"],["ORGNAME", "Firma"] ]);
  
a.imagevar("$image.ujfields",   
 [ ["sum(QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100)", "Umsatz"], 
 [" sum(QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100)", "G. Umsatz"], 
 ["sum(QUANTITY)", "Absatz"],[" sum(QUANTITY)", "G. Absatz"]  ]);

a.setValue("$comp.UJGruppe", a.encodeMS([getKeySQL("SALESAREA", "SALESAREA")]));
a.setValue("$comp.UJFields", a.encodeMS(["sum(QUANTITY * PRICE * (100 - ORDERITEM.DISCOUNT) / 100)"]));

