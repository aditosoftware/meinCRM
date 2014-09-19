import("lib_linkedFrame");
import("lib_keyword");

var firststep = a.translate(getKeyName("1", "KampStufe"));
var countstep1 = a.sql("select count(STEP) from CAMPAIGNSTEP where CAMPAIGN_ID = '" + a.valueof("$comp.campaignid") + "' and STEP = '" + firststep + "'");
if (a.valueof("$sys.workingmodebeforesave") == a.FRAMEMODE_NEW && countstep1 == 0 )
{	
    // Erste Kampagnenstufe 'hinzugefügt' gleich mit anlegen
    var col = new Array("CAMPAIGNSTEPID", "CAMPAIGN_ID", "CODE", "STEP", "COLOUR_BACKGROUND", "COLOUR_FOREGROUND", 
        "DATE_START", "DATE_END", "USER_NEW", "DATE_NEW" );
																		
    var typ = a.getColumnTypes(a.valueof("$sys.dbalias"), "campaignstep", col);
	
    var value = new Array( a.getNewID("campaignstep", "campaignstepid"), a.valueof("$comp.campaignid"),
        "1", firststep, -1, -16777216, a.valueof("$comp.date_start"), 
        a.valueof("$comp.date_end"), a.valueof("$sys.user"), a.valueof("$sys.date"));

    a.sqlInsert("CAMPAIGNSTEP", col, typ, value);
    a.refresh("$comp.tbl_steps");
}

a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");

// Schliessen, Speichern, Aktualisieren von Superframe
swreturn();