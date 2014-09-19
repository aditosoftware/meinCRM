import("lib_sql");

var importid = a.valueof("$comp.IMPORTDEVID");
if ( importid != "")
{
    var status = a.valueof("$comp.cbx_Status");
    var dup = a.valueof("$comp.cbx_Duplicat");
    var condition = "";
    if ( (status == "0" && dup == "1") || status.substr(0, 1) == ";")  status = "";
    if ( status != "" ) condition += " and STATUS = " + status;
    if ( dup != "" ) condition += " and DUPLICAT = " + dup;
    a.rq("SELECT LEADID, "
        + "CASE "  //  Schriftfarbe
        + " WHEN STATUS = 1 THEN -16777216 "	//  schwarz 
        + " ELSE ( CASE  WHEN STATUS = 2 THEN -16738048 "	// grün 
        + " ELSE ( CASE WHEN STATUS = 3 THEN -26368 " // orange vorher -256 	// gelb 
        + " ELSE ( CASE WHEN STATUS = 4 THEN -16776961 "	// blau
        + " ELSE ( CASE WHEN STATUS = 5 THEN -65536 "	// rot
        + " ELSE -10066330 END) END) END) END) END, "
        + " CASE "   //  Hintergrundfarbe 
        + " WHEN DUPLICAT = 1 THEN -3342337 "	//  Duplette vorhanden rosa
        + " ELSE -1  END, "	//  keine Duplette weis
        + " SALUTATION, TITLE, FIRSTNAME , LASTNAME, ORGNAME, COUNTRY, ZIP, CITY, "
        + concat(new Array("ADDRESS", "BUILDINGNO"))
        + " FROM LEAD where IMPORTDEV_ID = '"
        + importid + "'" + condition );
}
else
    a.rq(a.EMPTY_TABLE_SQL);
		
/*
Keine Dupletten vorhanden
Status
0. Organisation oder Person neu angelegt
1. ORG, PERS und REL eingefügt  
2. ORG eind.vorhanden, Pers und Rel eingefügt  
3. Org, Pers eind.vorhanden, Rel eingefügt
4. Pers eind.vorhanden,Org und Rel eingefügt
5. Org, Pers, Rel eind.vorhanden 

mögliche Duplette vorhanden
Status
1. Pers und Org mögliche Duplette vorhanden 
2. Pers mögliche Duplette vorhanden, Org eind.vorhanden, 
3. Pers mögliche Duplette vorhanden, Org eingefügt, 
4. Org mögliche Duplette vorhanden, Pers eind.vorhanden, 
5. Org mögliche Duplette vorhanden, Pers eingefügt, 
*/