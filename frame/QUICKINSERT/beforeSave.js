import("lib_duplicate");
import("lib_quickinsert");

//Dublettencheck:
var hasPERSDup = new Array();
var hasORGDup = new Array();
var ret = true;
var commdata = [["fon", a.valueof("$comp.telefon")],["mail", a.valueof("$comp.email")], ["fax", a.valueof("$comp.fax")],
["fon", a.valueof("$comp.mobil")], ["www", a.valueof("$comp.url")]];

if (a.valueof("$comp.DUP_CHECK") != "1" )
{
    if (a.valueof("$comp.orgname") != "")  hasORGDup = hasOrgDuplicates("", getOrgQuickPattern(commdata));
    if (a.valueof("$comp.lastname") != "") hasPERSDup = hasPersDuplicates("", "", getPersQuickPattern(commdata));
}
if ( hasORGDup.length > 0 || hasPERSDup.length > 0) //... wenn Dubletten existieren:
{
    // das Dubletten-Register angezeigen
    a.imagevar("$image.dupORGids", hasORGDup);
    a.imagevar("$image.dupPERSids", hasPERSDup);
    a.refresh("$comp.Register_dub");
    ret = false;
}
else 
{
    a.imagevar("$image.dupORGids", "");
    a.imagevar("$image.dupPERSids", "");

    var framedata = [];

    framedata["DATE_NEW"] = a.valueof("$sys.date");
    framedata["USER_NEW"] = a.valueof("$sys.user");
    framedata["LANG"] = a.valueof("$comp.language");
    //Org:
    framedata["ORGNAME"] = a.valueof("$comp.orgname");
    framedata["ADDRESS"] = a.valueof("$comp.address");
    framedata["BUILDINGNO"] = a.valueof("$comp.buildingno");
    framedata["ZIP"] = a.valueof("$comp.zip");
    framedata["CITY"] = a.valueof("$comp.city");
    framedata["COUNTRY"] = a.valueof("$comp.country");
    // COMM:
    framedata["TELEFON"] = a.valueof("$comp.telefon");//Medium_ID = 1
    framedata["EMAIL"] = a.valueof("$comp.email"); //Medium_ID = 3
    framedata["FAX"] = a.valueof("$comp.fax");
    framedata["MOBIL"] = a.valueof("$comp.mobil");//Medium_ID = 3
    framedata["INTERNET"] = a.valueof("$comp.url");//Medium_ID = 4
    //Attr:
    framedata["ZIELGRUPPE"] = a.valueof("$comp.zielgruppe");
    framedata["BRANCHE"] = a.valueof("$comp.branche");
    framedata["SALESMANAGER"] = a.valueof("$comp.salesmanager");
    //Pers:
    framedata["LASTNAME"] = a.valueof("$comp.lastname"); 
    framedata["FIRSTNAME"] = a.valueof("$comp.firstname");
    framedata["SALUTATION"] = a.valueof("$comp.salutation");
    framedata["TITLE"] = a.valueof("$comp.title");
    framedata["DEPARTMENT"] = a.valueof("$comp.department");
    framedata["RELTITLE"] = a.valueof("$comp.funktion");
    framedata["SOURCE"] = a.valueof("$comp.source");
    framedata["SOURCEKEY"] = getKeyValue( framedata["SOURCE"], "SPSOURCE" );
    //Salesproject:
    framedata["INFO"] = a.valueof("$comp.info");
    framedata["PROJEKTART"] = a.valueof("$comp.projektart");
    //History
    framedata["SUBJECT"] = a.valueof("$comp.subject");
    framedata["MEDIUM"] = a.valueof("$comp.medium");
    framedata["DIRECTION"] = a.valueof("$comp.direction");
}
if ( ret ) 
{
    if ( framedata["ORGNAME"] != "" )   framedata = quickinsertORG(framedata);
    else framedata["ORGID"] = "0";
    if( framedata["LASTNAME"] != "" )  framedata = quickinsertPERS(framedata);
    if( a.valueof("$comp.opportunity") == "true" ) framedata = quickinsertSALESPROJECT(framedata);
    framedata = quickinsertHistory(framedata);
    quickinsertPROPINV( framedata);
}
a.rs( ret );
 
   
