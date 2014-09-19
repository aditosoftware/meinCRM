import("lib_addr");
import("lib_keyword");

var relationid = a.valueof("$comp.relationid");
var ret = "";

if(relationid != "" && a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW  )
{
    // formated Address ohne Orgname
    var addrobj = new AddrObject( relationid )
    ret = addrobj.formatAddress(addrobj.fmt.replace(/\{ON\}/gi,"")).replace(/(^\s+)|(\s+$)/g,"");
    var cnr =  a.valueof("$comp.customercode");
    if ( cnr != "" ) ret += "\n\n" + a.translate("Kundennr.:")  + " " + a.valueof("$comp.customercode");
    var salesarea =  a.valueof("$comp.SALESAREA");
    if ( salesarea != "" ) ret += "\n" + a.translate("Gebiet:")  + " " + getKeyName(a.valueof("$comp.SALESAREA"), "SALESAREA");
}
a.rs (ret);