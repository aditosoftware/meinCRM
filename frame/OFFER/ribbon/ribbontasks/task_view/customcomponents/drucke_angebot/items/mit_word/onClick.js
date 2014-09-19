import("lib_wordbrf");
import("lib_keyword");
import("lib_sql");

var relid = a.valueof("$comp.RELATION_ID");
var offerid = a.valueof("$comp.OFFERID");
var language = "1"; // Deutsch
if (relid != "")
{
    //  UStd. brechnen
    var umstddata = a.sql("select VAT, OPTIONAL, PRICE, QUANTITY, DISCOUNT from OFFERITEM where OFFER_ID = '" + offerid + "'", a.SQL_COMPLETE);
    var umstd = [];
    for ( var i = 0; i < umstddata.length; i++ )  
    {
        if ( (umstddata[i][1] == "" || umstddata[i][1] == "0") && umstddata[i][0] != "" )   // keine Option
        {
            if ( umstd[ String(umstddata[i][0]) ] == undefined )   umstd[ String(umstddata[i][0]) ] = 0;
            umstd[ String(umstddata[i][0]) ] += umstddata[i][2] * umstddata[i][3] * (100 - umstddata[i][4]) / 10000 * umstddata[i][0];
        }
    }
    umstddata = [];
    for ( element in umstd )    umstddata.push([relid, element, umstd[element]]);
    
    var tabledata = [{
        Table: "Table", 
        Fields: ["RELID", "Pos","ArtNr", "ArtBez", "Menge",["Rabatt", "double", "0.0"],["EPreis", "double", "#,##0.00"], ["UMSt", "double", "#,##0.00"],["Summe", "double", "#,##0.00"]],
        SQLStr: "select '" + relid + "', ITEMPOSITION, PRODUCTCODE, PRODUCTNAME, " 
        + concat(["cast(cast(OFFERITEM.QUANTITY as integer) as char(5))", getKeySQL("Einheiten", "PRODUCT.UNIT")]) 
        + ", case when OFFERITEM.DISCOUNT = 0 then null else OFFERITEM.DISCOUNT end, PRICE, OFFERITEM.VAT, "
        + " case when OFFERITEM.OPTIONAL = '0' or OFFERITEM.OPTIONAL is null then OFFERITEM.QUANTITY * PRICE * (100 - COALESCE(OFFERITEM.DISCOUNT,0)) / 100 else null end "
        + " from OFFERITEM join OFFER on OFFERID = OFFER_ID join PRODUCT on PRODUCTID = PRODUCT_ID "
        + " where OFFERID = '" + offerid + "' order by ITEMSORT"
    }
    ,{
        Table: "UMST", 
        Fields: ["RELID", ["UMSTSatz", "double", "#,##0.00"], ["UMSTWert", "double", "#,##0.00"]],
        Data: umstddata
    }];
    var net = Number(a.valueof("$comp.NET"));
    var vatval = Number(a.valueof("$comp.VAT"));
    var AdditionalData =  
    {
        Fields: ["RELID", "AngNr",["Angdatum","date","dd.MM.yyyy"], "HEADER", "FOOTER", "PAYMENTTERMS", "DELIVERYTERMS",
        "CURRENCY", ["NET", "double", "#,##0.00"], ["GROSS", "double", "#,##0.00"], "ADDRESS"],
        Data: [[relid, a.valueof("$comp.OFFERCODE") + '-' + a.valueof("$comp.VERSNR"), 
        a.valueof("$comp.OFFERDATE"), a.valueof("$comp.HEADER"), a.valueof("$comp.FOOTER"), 
        getKeyName(a.valueof("$comp.PAYMENTTERMS"), "PAYMENTTERMS"), getKeyName(a.valueof("$comp.DELIVERYTERMS"), "DELIVERYTERMS"),
        a.valueof("$comp.CURRENCY"), net, eMath.addDec(net, vatval), a.valueof("$comp.ADDRESS") ]]
    };	
    writeLetter( relid, undefined, language, 5, AdditionalData, tabledata );
}
