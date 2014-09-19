import("lib_keyword");

var followhistories;

var histid = a.valueof("$comp.HISTORY_ID");
if ( histid == "" ) histid =  a.valueof("$comp.historyid");
followhistories = a.sql("select ENTRYDATE, SUBJECT, LASTNAME, FIRSTNAME, DIRECTION, ("
    + getKeySQL( "HistoryMedium", "MEDIUM" )  + "), INFO "
    + " from HISTORY left join RELATION R on (HISTORY.RELATION_ID = R.RELATIONID) "
    + " join PERS P on (P.PERSID = R.PERS_ID) "
    + " where HISTORY_ID = '" + histid + "' or HISTORYID = '" + histid + "' order by ENTRYDATE desc", a.SQL_COMPLETE);

var htmltable = "<html><body><table border =0>";
for (i = 0; i < followhistories.length; i++ )
{	
    var direction = "";
    if (followhistories[i][4] == 'i') direction = "&lt";	else direction = "&gt";

    htmltable += "<tr>" // <font face=Verdana color=0000FF>" 
        + "<th style='margin-right: 5px; text-align:left'>" + date.longToDate(followhistories[i][0], "dd.MM.yyyy")  
        + "</th><th style='margin-right: 5px; text-align:left'>" + followhistories[i][2] + " " + followhistories[i][3] + "</th> "
        + "<th  style='margin-right: 5px; text-align:left'>" + followhistories[i][5] + " " + direction + "</th> "
        + "<th  style='margin-right: 5px;  text-align:left'>" +"Stichwort: " + followhistories[i][1] + "</th> " 
        + "</font></tr>"
        + "<tr><td></td>"
//        + "<td  style='margin-bottom: 10px;' align=left colspan=8><font size=4 face=Verdana> " + followhistories[i][6].replace( new RegExp("\r\n","g"), "<br/>") + "</font></td>"
        + "<td  style='margin-bottom: 10px;' align=left colspan=8> " + followhistories[i][6].replace( new RegExp("\r\n","g"), "<br/>") + "</td>"
        
            + "</tr>"
}
htmltable += "</table></body></html>" ;
a.rs(htmltable);