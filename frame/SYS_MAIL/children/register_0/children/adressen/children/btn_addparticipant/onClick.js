import("lib_keyword");
import("lib_sql");
import("lib_relation");

var relid = a.valueof("$comp.lup_relation");
var reltype = getRelationType(relid);
var keytype = "PersMedium";
if ( reltype == "1" ) keytype = "OrgMedium";

var address = a.sql("select addr from comm join keyword on (keyword.keyvalue = comm.medium_id) where " 
    + getKeyTypeSQL(keytype) + " and keyname2 = 'mail' and comm.relation_id = '" 
    + relid + "' order by comm.standard desc");

var addresslist = a.valueofObj("$comp.addrcopy").split("; ");
if (address == "") 
{
    // kiene MailAdresse gefunden
    var name = a.sql("select " + concat(new Array("orgname", "'-'", "firstname", "lastname") )
        + " , relation.relationid from relation join org on (relation.org_id = org.orgid)"
        + " left join pers on (relation.pers_id = pers.persid) where relationid = '" + relid + "'");
    a.showMessage(a.translate("keine E-Mail-Adresse gefunden !") + "\n\n" + name);
}
else
{
    // Nur einfügen wenn Adresse noch nicht in liste
    for (var z = 0; z < addresslist.length; z++) if ( address == addresslist[z] ) break;
    if ( z == addresslist.length ) addresslist.push(address);
}
a.imagevar("$image.addr", addresslist);
a.setValue("$comp.lup_relation", "");