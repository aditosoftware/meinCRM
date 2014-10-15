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
    a.showMessage("keine Dublette gefunden.");
}