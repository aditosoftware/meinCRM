import("lib_quickinsert");

var relorgid = a.decodeFirst(a.valueof("$comp.tbl_dublettenORG"));
var relpersid = a.decodeFirst(a.valueof("$comp.tbl_dublettenPERS"));
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

//Firma
if (framedata["ORGNAME"] != "")
{
    if(relorgid == "")
    {
        framedata = quickinsertORG(framedata); //neue Firma anlegen
    }
    else 
    {
        framedata["ORGRELID"] = relorgid; //bestehende verwenden
        framedata["ORGID"] = a.sql("select ORG_ID from RELATION where RELATIONID = '" + relorgid +"'");
        framedata["ORG_ID"] = framedata["ORGID"];
        framedata["ADDRESSID"] = a.sql("select ADDRESS_ID from RELATION where RELATIONID = '" + relorgid +"'");
        framedata["ADDRESS_ID"] = framedata["ADDRESSID"];
    }
}

//Personen
if ( framedata["LASTNAME"] != "" ) 
{
    if (relpersid != "")  framedata["PERSID"] = a.sql("select PERS_ID from RELATION where RELATIONID = '" + relpersid + "'");//bestehende verwenden
    if (framedata["ORGNAME"] != "")   framedata = quickinsertPERS(framedata);
    else framedata["PERSRELID"] = relpersid
}

// Opportunity anlegen
if( a.valueof("$comp.opportunity") == "true" ) 
{
    framedata = quickinsertSALESPROJECT(framedata);
}

// History anlegen 
framedata = quickinsertHistory(framedata);
quickinsertPROPINV( framedata);
a.imagevar("$image.dupORGids", "");
a.imagevar("$image.dupPERSids", "");
a.doAction(ACTION.FRAME_CANCEL);
a.closeCurrentTopImage();

if (framedata["ORGNAME"] != "") a.openFrame("ORG", "RELATION.RELATIONID = '" + framedata["ORGRELID"] + "'", false, a.FRAMEMODE_SHOW, null, true);
else a.openFrame("PERS", "RELATION.RELATIONID = '" + relpersid + "'", false, a.FRAMEMODE_SHOW, null, true);

