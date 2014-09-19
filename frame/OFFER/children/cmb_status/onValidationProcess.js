import("lib_calendar");
import("lib_attr");


if(a.valueof("$comp.cmb_Status") == 2)
{
    // Aufgabe beim zuständigen ADM eintragen
    var orgrelid = a.sql("select RELATIONID from RELATION where ORG_ID = (select ORG_ID from RELATION where RELATIONID = '" 
        + a.valueof("$comp.RELATION_ID") + "') and PERS_ID is null");
    var adm = GetAttribute( "Aussendienst", 1,  orgrelid, false ); 
    if (adm == '') adm = a.valueof("$sys.user");
    newSilentTodo( a.translate("%0 nachfassen (Nr.%1)", ["Angebot", a.valueof("$comp.OFFERCODE_VERSNR")]), null, true, adm )
}