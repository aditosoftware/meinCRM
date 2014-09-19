import("lib_addr")

var relationid = a.valueof("$comp.relationid");
var orgpersrelation = a.valueof("$comp.Label_relpers_dec");
if (orgpersrelation != "") relationid = orgpersrelation;

if(relationid != "")
{
    var s = new AddrObject( relationid, a.decodeFirst(a.valueof("$comp.tbl_ADDRESS") ) ).getFormattedAddress();
    var details = new Array(s);
    a.doClientIntermediate(a.CLIENTCMD_TOCLIPBOARD, details);
    a.showMessage(details);
}