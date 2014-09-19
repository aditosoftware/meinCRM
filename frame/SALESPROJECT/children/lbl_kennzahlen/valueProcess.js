import("lib_sql");
import("lib_keyword");
import("lib_attr");

var id = a.valueof("$comp.idcolumn");
var cycle = [];
var estimation = "";
var fontestimation = ""; 
var green = "32cd32";
var yellow = "ffd700";
var red = "ff0000";
if (id != '' && a.valueof("$sys.workingmode") != a.FRAMEMODE_NEW)
{
    var estimationsum = a.decodeMS(a.valueof("$comp.ESTIMATION")); 
    var rating = 0;
    if (estimationsum.length == 0) {
        estimation = " ??";
    }
    else
    {
        rating = 0;
        for (i=0; i<estimationsum.length; i++) rating = rating + parseInt(a.sql("select KEYDETAIL from KEYWORD where " + getKeyTypeSQL("SPESTIMATION") + " and KEYVALUE = " + estimationsum[i]));
        if (rating < 6 ) {
            estimation = " gering";
            fontestimation = "<font size=11 font face=Verdana color="+red+">";
        }
        if (rating >= 6 && rating < 13 ) {
            estimation = " mittel";
            fontestimation = "<font size=11 font face=Verdana color="+yellow+">";
        }
        if (rating >= 13 ) {
            estimation = " hoch";
            fontestimation = "<font size=11 font face=Verdana color="+green+">";
        }
    }
    var volume = a.valueof("$comp.VOLUME");
    if (volume == undefined) volume = 0;
    var probability = a.valueof("$comp.PROBABILITY");
    var running = a.sql("select sum(DAYS)/30 from SPCYCLE where SALESPROJECT_ID = '" + id + "'");
    running = eMath.roundDec(running, 1, eMath.ROUND_HALF_EVEN);
    var workingtime = eMath.roundDec(a.sql("select sum(MINUTES) from TIMETRACKING where ROW_ID = '" + id + "'") / 60, 1, eMath.ROUND_HALF_EVEN);
    if (workingtime == '') workingtime = 0;
    a.rs("<html><body><table border =0 cellpadding=1 cellspacing=1>"  
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("Status: ") + "</td>      <td><p align=left>" + getKeyName(a.valueof("$comp.STATUS"), "SPSTATUS") + "</td></tr>"
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("Phase: ") + "</td>     <td><p align=left>" + getKeyName(a.valueof("$comp.PHASE"), "SPPHASE") +  "</td></tr>"
        + fontestimation + a.translate("Einschätzung: ") + "</td>     <td><p align=left>" + estimation +  "</td></tr>"
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("inaktiv: ") + "</td>     <td><p align=left>" + a.valueof("$comp.Edit_active_contact") 
        + a.translate(" Tage") + a.translate(" / gesamt: ") + running + a.translate(" Monate") + "</td></tr>"
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("Volumen: ") + "</td>     <td><p align=left>" + a.formatDouble(volume, "#,##0") + " T€" 
        + a.translate(" / Wahrsch.:") + probability + a.translate(" % / gew.: ") + a.formatDouble(volume * probability / 100, "#,##0") + " T€"  + "</td></tr>"
        //		+ a.translate(" / Auftragswahrsch.: ") + probability + a.translate(" %") + "</td></tr>"
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("Aufwand: ") + "</td>     <td><p align=left>" + a.formatDouble(workingtime, "#,##0.0") + a.translate(" Stunden") + "</td></tr>"
        +"	</body>"
        +"</html>");
}
else
{
    a.rs("");
}