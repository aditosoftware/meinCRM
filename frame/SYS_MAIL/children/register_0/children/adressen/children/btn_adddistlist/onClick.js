import("lib_keyword");
import("lib_sql");
import("lib_relation");

var distlistid = a.valueof("$comp.lup_distlist");
var relids = a.sql("select relation_id from distlistmember where distlist_id = '" + distlistid + "'", a.SQL_COLUMN);
var addresslist = a.valueofObj("$comp.addrcopy").split("; ");
var message = "";

for (var i = 0; i < relids.length; i++)
{
    var reltype = getRelationType(relids[i]);
    var keytype = "PersMedium";
    if ( reltype == "1" ) keytype = "OrgMedium";
    var address = a.sql("select addr from comm join keyword on (keyword.keyvalue = comm.medium_id) where " 
        + getKeyTypeSQL(keytype) + " and keyname2 = 'mail' and comm.relation_id = '" 
        + relids[i] + "' order by comm.standard desc");
    // kiene MailAdresse gefunden
    if (address == "") 
    {
        var name = a.sql("select " + concat(new Array("orgname", "'-'", "firstname", "lastname") )
            + " , relation.relationid from relation join org on (relation.org_id = org.orgid)"
            + " left join pers on (relation.pers_id = pers.persid) where relationid = '" + relids[i] + "'");
        message += name + "\n";
    }
    else
    {
        // Nur einfügen wenn Adresse noch nicht in Adressliste
        for (var z = 0; z < addresslist.length; z++) if ( address == addresslist[z] ) break;
        if ( z == addresslist.length ) addresslist.push(address);
    }
}
if (message != "") 
    a.showMessage(a.translate("keine E-Mail-Adresse gefunden !") + "\n" + message);

a.imagevar("$image.addr", addresslist);
a.setValue("$comp.lup_distlist", "");