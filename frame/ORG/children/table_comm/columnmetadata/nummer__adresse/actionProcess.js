import("lib_email");
import("lib_util");
import("lib_keyword");
import("lib_telephony");


var mediumType = a.valueofObj("$local.rowdata")[2];
var medium = _getMedium(mediumType);
    
var adresse = a.valueofObj("$local.rowdata")[3];
var relid = a.valueof("$comp.Label_relpers_dec");
if(relid == "") relid = a.valueof("$comp.relationid");
if (medium == "mail")
    OpenNewMail(adresse, relid, a.valueof("$comp.LANG"));

if (medium == "xing")
    openUrl(adresse);
    
if (medium == "facebook")
    openUrl("http://facebook.com/"+adresse);

if (medium == "www")
    openUrl(adresse);

if (medium == "fon" || medium == "mobil")
    call( adresse );
 
if (medium == "google")
    openUrl("http://plus.google.com/"+adresse);
    
if (medium == "twitter")
    openUrl("http://twitter.com/#!/"+adresse);
    
    
function _getMedium(commid)
{
    var key = a.valueof("$comp.Label_relpers_dec") != "" ? "PersMedium" : "OrgMedium";            
    return a.sql("select keyname2 from keyword where "+getKeyTypeSQL(key) +" and keyvalue = " + commid);
}