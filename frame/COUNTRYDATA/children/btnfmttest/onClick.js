import("lib_addr");
import("lib_sql");

var addr;
var fmt = a.valueof("$comp.ADDRFORMAT");
var iso2 = a.valueof("$comp.ISO2");
if (fmt != '' && iso2 != '')
{
    var relid = a.sql("select RELATIONID from RELATION join ADDRESS on RELATIONID = RELATION_ID where " + trim("RELATION.ORG_ID") 
        + " <> '0' and COUNTRY = '" + iso2 + "' order by PERS_ID desc");
    if (relid == '')
    {
        relid = a.valueof("$global.user_relationid");
        addr = new AddrObject(relid).formatAddress();
        a.showMessage(a.translate("keine Firma/Person aus diesem Land verfügbar" + "\n" + "Ersatzweise wird diese Adresse verwendet:"
            + "\n\n" + "%0",[addr]));
    }
    else
    {
        addr = new AddrObject(relid).formatAddress();
        a.showMessage(addr);
    }
}