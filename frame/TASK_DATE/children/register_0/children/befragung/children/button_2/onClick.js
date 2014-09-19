import("lib_keyword");
import("lib_telephony");

var pid = a.decodeFirst(a.valueof("$comp.tbl_participants"));

if (pid != "")
{ 		
    var nr = a.sql(" select addr from comm join keyword on (keyword.keyvalue = comm.medium_id) join campaignparticipant on (comm.relation_id = campaignparticipant.relation_id)"
        + " where " +getKeyTypeSQL("PersMedium") + " and keyname2 = 'fon' and comm.standard = 1 and campaignparticipantid = '" + pid + "'");
    if (nr != "") call(nr);

}