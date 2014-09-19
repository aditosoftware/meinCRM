import("lib_sql");
import("lib_keyword");
import("lib_attr");

//var image = a.sql("select bindata from asys_icons where id = '21'");
//var bild = "<img src=data:image/png;base64," + image + "/>";
//a.rs("<html><head></head><body>" + bild + "	</body></html>")

var relid = a.valueof("$comp.idcolumn")
var orgid = a.valueof("$comp.orgid");
var year = date.longToDate(a.valueof("$sys.today"), "yyyy");
var year_1 = date.longToDate(a.valueof("$sys.today"), "yyyy") - 1;
var bes = 0;
var bes_1 = 0; 
var ang = 0;
var ang_1 = 0; 
var rek = 0;
var rek_1 = 0; 
var ums = 0;
var ums_1 = 0;
var bon = ""; 
var loy = "";
if (relid != '' && orgid != '')
{
    bes = a.sql("select count(*) from HISTORY join HISTORYLINK on (HISTORYID = HISTORYLINK.HISTORY_ID and ROW_ID = '" + relid + "') "
        + " where MEDIUM = " + getKeyValue( "Besuch", "HistoryMedium" ) + " and " + yearfromdate("ENTRYDATE") + " = " + year);
    bes_1 = a.sql("select count(*) from HISTORY join HISTORYLINK on (HISTORYID = HISTORYLINK.HISTORY_ID and ROW_ID = '" + relid + "') "
        + " where MEDIUM = " + getKeyValue( "Besuch", "HistoryMedium" ) + " and " + yearfromdate("ENTRYDATE") + " = " + year_1);	
    ang = a.sql("select count(*) from OFFER where RELATION_ID in (select RELATIONID from RELATION where ORG_ID = '" + orgid + "') "
        + " and " + yearfromdate("OFFERDATE") + " = " + year);
    ang_1 = a.sql("select count(*) from OFFER where RELATION_ID in (select RELATIONID from RELATION where ORG_ID = '" + orgid + "') "
        + " and " + yearfromdate("OFFERDATE") + " = " + year_1);
    rek = a.sql("select count(*) from COMPLAINT where RELATION_ID in (select RELATIONID from RELATION where ORG_ID = '" + orgid + "') "
        + " and " + yearfromdate("DATE_NEW") + " = " + year);
    rek_1 = a.sql("select count(*) from COMPLAINT where RELATION_ID in (select RELATIONID from RELATION where ORG_ID = '" + orgid + "') "
        + " and " + yearfromdate("DATE_NEW") + " = " + year_1);
    ums = a.sql("select sum(net)/1000 from SALESORDER where RELATION_ID in (select RELATIONID from RELATION where ORG_ID = '" + orgid 
        + "') and " + yearfromdate("ORDERDATE") + " = " + year + " and ORDERTYPE = " + getKeyValue( "Rechnung", "ORDERTYPE") + " and SENT = 'Y'");
    ums_1 = a.sql("select sum(net)/1000 from SALESORDER where RELATION_ID in (select RELATIONID from RELATION where ORG_ID = '" + orgid 
        + "') and " + yearfromdate("ORDERDATE") + " = " + year_1 + " and ORDERTYPE = " + getKeyValue( "Rechnung", "ORDERTYPE") + " and SENT = 'Y'");
		
    if (ums == '') ums = 0; // sonst funktioniert a.format... nicht
    if (ums_1 == '') ums_1 = 0; // sonst funktioniert a.format... nicht
    loy = GetAttribute( "Loyalität", a.valueof("$image.FrameID"), a.valueof("$comp.idcolumn"))	
    if (loy != undefined && loy != '') loy = loy[0].substr(2, loy[0].length - 2);
    bon = GetAttribute( "Bonität", a.valueof("$image.FrameID"), a.valueof("$comp.idcolumn"))	

    a.rs("<html><body><table border =0 cellpadding=1 cellspacing=1>"  
        +"    <tr><th><br></th><th><font color=0000FF>" + String(year).substr(2,2) + "</font></th><th><font color=0000FF>" + String(year_1).substr(2,2) + "<font></th></tr>"
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("Besuche") + "</td>      <td><p align=center>" + bes + "</td><td><p align=center>" + bes_1 + "</td></tr>"
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("Angebote") + "</td>     <td><p align=center>" + ang +  "</td><td><p align=center>" + ang_1 + "</td></tr>"
        +"	  <font size=11 font face=Verdana><tr><td>" + a.translate("Reklam.") + "</td>      <td><p align=center>" + rek +  "</td><td><p align=center>" + rek_1 + "</td></tr>"
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("Ums (T\€)") + "</td>     <td><p align=center>" + a.formatDouble(ums, "#,##0") +  "</td><td><p align=center>" + a.formatDouble(ums_1, "#,##0") + "</td></tr>"
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("Loyalität") + "</td>    <td><p align=center>" + loy + "</td></tr>"
        +"    <font size=11 font face=Verdana><tr><td>" + a.translate("Bonität") + "</td>      <td><p align=center>" + bon + "</td></tr>"	
        +"	</body>"
        +"</html>");
}
else
{
    a.rs("");
}