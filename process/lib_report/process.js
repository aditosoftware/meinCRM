import("lib_addr");
import("lib_attr");
import("lib_table4report");
import("lib_calendar");
import("lib_keyword");
import("lib_sql");
import("lib_attr");
import("lib_user");
import("lib_frame");

/***************
Dieser Prozess dient zur Verwaltung und Aufruf der Reports aus dem Frame MyAdito heraus. 
Jede Funktion steht für den Aufruf eines Reports und um die Parameter zu Übergeben
 */

/*
 * Funktion zur Vorbereitung der Temp Tabelle und öffnen des Reports
 *
 * @return {void}
 */
function openRPT_CUSTOMER( pRelationID, pExport, pUser )
{
    var doc = [];
    if ( pExport )  clientid = 0;
    else clientid = a.valueof("$sys.clientid");
    var report = "RPT_ORG";
    if ( pRelationID == undefined )   
    {   
        //Parameter abfrage für diesen Report
        var question = a.askUserQuestion(a.translate("Bitte wählen Sie eine Firma aus."), "DLG_RPTCUSTOMER");	
        if (question != null)   pRelationID = question["DLG_RPTCUSTOMER.RELATION_ID"];		
    }
    else
    {
        var orgid = a.sql("select org_id from relation where relationid = '" + pRelationID + "'");
        var params = orgreport ( clientid, pRelationID, orgid, pUser)
        var condition = "ORG.ORGID = '" + orgid + "'";
        if ( pExport )
        {
            doc[0] = "Kundenstammblatt.pdf"
            doc[1] = a.exportReportToBytes(report, condition, a.REPORT_EXPORT_PDF, null, params, null, null);
        }
        else    a.openReport(report, false, condition, a.REPORT_OPEN , null, params);
    }	
    return doc;
}

/*
 * Report zur Umsatzanzeige
 * 
 * @return {void}
 */
function openRPT_TURNOVER_3YPIVOT()	
{
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    
    a.openReport("RPTJ_TURNOVER_3YPIVOT", false, "true", a.REPORT_OPEN, null, params);
}

/*
 * Report zur Umsatzanzeige
 *
 * @return {void}
 */
function openRPT_TURNOVER_3Y()	
{
    var rptdata = a.sql("select sum(QUANTITY * PRICE),year(ORDERDATE), month(ORDERDATE)"
        + " from ORDERITEM "
        + " join SALESORDER on ORDERITEM.SALESORDER_ID = SALESORDERID"
        + " group by year(ORDERDATE), month(ORDERDATE) ", a.SQL_COMPLETE);
    var fptfields = ["AMOUNT","YEAR", "MONTH"];
    
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

    a.openStaticLinkedReport("RPTJ_TURNOVER_3Y", false, a.REPORT_OPEN, null, params, fptfields, rptdata);
}

/*
 * Report zur Absatzanzeige
 * 
 * @return {void}
 */
function openRPT_QUANTITY_3Y( pExport )	
{
    var report = "RPTJ_QUANTITY_3Y";  
    var columnNames = ["QUANTITY", "YEAR", "MONTH"];
    var data = a.sql("select sum(ORDERITEM.QUANTITY), year(SALESORDER.ORDERDATE), month(SALESORDER.ORDERDATE) "
        + " from ORDERITEM join SALESORDER on ORDERITEM.SALESORDER_ID = SALESORDERID group by year(SALESORDER.ORDERDATE), month(SALESORDER.ORDERDATE)", a.SQL_COMPLETE);

    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    
    if ( pExport )
    {
        var doc = [];
        doc[0] = "Auswertung.pdf"
        doc[1] = a.exportReportToBytes(report, null, a.REPORT_EXPORT_PDF, null, params, null, null);
        return doc;
    }
    else    a.openStaticLinkedReport(report, false, a.REPORT_OPEN, null, params, columnNames, data); 
    return true;
}

/*
 * offene Posten Liste
 *
 * @return {void}
 */
function openRPT_OPENITEMLIST()	
{
    var data = a.sql("select ORGNAME, ORDERCODE, ORDERDATE, REMINDERSTEP, " + getKeySQL("PAYMENTTERMS", "PAYMENTTERMS") 
        + ", (NET + VAT), PAYED, (NET + VAT - PAYED) as UNPAYED, 0 as OSUM "
        + " from SALESORDER join RELATION on (RELATIONID = RELATION_ID) join ORG on (ORGID = ORG_ID)"
        + " where ORDERTYPE = 2 and (NET + VAT - PAYED) > 0 and ADJUSTMENT = 'N' and CANCELLED = 'N'", a.SQL_COMPLETE);
    
    var sums = [];
    var gesamt = 0;
    for (i=0; i<data.length; i++)
    {
        if(sums[data[i][0]] == undefined) sums[data[i][0]] = 0;
        
        data[i][2] = date.longToDate(data[i][2], "dd.MM.yyyy");
        data[i][5] = eMath.roundDec(data[i][5], 2, eMath.ROUND_HALF_EVEN)
        data[i][6] = eMath.roundDec(data[i][6], 2, eMath.ROUND_HALF_EVEN)
        sums[data[i][0]] += parseFloat(data[i][7]); //Summenbildung je Firma
        data[i][8] = sums[data[i][0]];
        gesamt += parseFloat(data[i][7]);
        
        data[i][5] = a.formatDouble(data[i][5], "#,##0.00 \u20ac");
        data[i][7] = a.formatDouble(data[i][7], "#,##0.00 \u20ac");  
        data[i][8] = a.formatDouble(data[i][8], "#,##0.00 \u20ac");
    }
    
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    params["Gesamt"] = gesamt;
    
    var rptfields = ["ORGNAME", "ORDERCODE", "ORDERDATE", "REMINDERSTEP", "PAYMENTTERMS", "GROSS", "PAYED", "UNPAYED", "SUM"];
    a.openStaticLinkedReport("RPTJ_OPEN_ITEM_LIST", false, a.REPORT_OPEN, null, params, rptfields, data );
}

/*
 * Report zur Verkaufschancenanalyse
 *
 * @return {void}
 */
function openRPT_OPPORTUNITY()	
{
    var columnNames = ["VOLUME", "PROJECTTITLE", "PHASE", "STARTDATE", "ENDDATE", "STATUS", "DAUER"];
    var rptdata = a.sql("select VOLUME, PROJECTTITLE, "+ getKeySQL("SPPHASE", "PHASE") + ", STARTDATE, "
        + "ENDDATE, "+ getKeySQL("SPSTATUS", "STATUS") + ", 0 as DAUER from SALESPROJECT", a.SQL_COMPLETE);
    
    for(var i = 0; i < rptdata.length; i++)
    {
        //Dauer des Projekts in Monaten berechnen:
        var startyear = date.longToDate(rptdata[i][3], "yyyy");
        var startmonth = date.longToDate(rptdata[i][3], "MM");
        var endyear = date.longToDate(rptdata[i][4], "yyyy");
        var endmonth = date.longToDate(rptdata[i][4], "MM");
        if(startyear == endyear)
        {
            rptdata[i][6] = eMath.subInt(endmonth, startmonth);
        }
        else if(startyear < endyear)
        {
            rptdata[i][6] = eMath.addInt(eMath.subInt(12,startmonth), endmonth);
        }
        else if(endyear < startyear) rptdata[i][6] = ''; //negativer Wert
        
        rptdata[i][3] = date.longToDate(rptdata[i][3],"yyyy-MMM");
        rptdata[i][0] = a.formatDouble(rptdata[i][0], "#,###");
    }
    
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    
    a.openStaticLinkedReport("RPTJ_OPPORTUNITY", false, a.REPORT_OPEN, null, params, columnNames, rptdata);
}

/*
* Report zur Wettbewerbsanalyse
* 
* @return {void}
*/
function openRPT_COMPETITION()	
{
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    params["Wettbewerbsanalyse"] = a.translate("Wettbewerbsanalyse");

    a.openReport("RPT_COMPETITION", false, "", a.REPORT_OPEN, null, params );
}


/*
* Report zur Umsatzanzeige Warengruppen über Jahr
* 
* @return {void}
*/
function openRPT_GROUPCODE_YEAR()	
{
    var rptfields = ["GROUPCODEID", "AMOUNT", "YEAR"];
    var data = a.sql("select " + getKeySQL("GroupCode", "GROUPCODEID") +" , sum(QUANTITY * PRICE), year(ORDERDATE)"
        + " from SALESORDER join ORDERITEM on SALESORDER.SALESORDERID = ORDERITEM.SALESORDER_ID"
        + " group by year(ORDERDATE), GROUPCODEID", a.SQL_COMPLETE);
    
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    
    a.openStaticLinkedReport("RPTJ_GROUPCODE_YEAR", false, a.REPORT_OPEN, null, params, rptfields, data)
}

/*
* Report zur Umsatzanzeige Warengruppen über Jahr, Monat
*
* @return {void}
*/
function openRPT_GROUPCODE_YEARMONTH()	
{
    var rptfields = ["GROUPCODEID", "AMOUNT", "YEAR", "MONTH"];
    var data = a.sql("select " + getKeySQL("GroupCode", "GROUPCODEID") +", sum(QUANTITY * PRICE), year(ORDERDATE), month(ORDERDATE)"
        + " from SALESORDER join ORDERITEM on SALESORDER.SALESORDERID = ORDERITEM.SALESORDER_ID"
        + " group by year(ORDERDATE), month(ORDERDATE), GROUPCODEID "  
        + " order by year(ORDERDATE) desc, month(ORDERDATE) asc, GROUPCODEID desc ", a.SQL_COMPLETE); 

    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    
    a.openStaticLinkedReport("RPTJ_GROUPCODE_YEARMONTH", false, a.REPORT_OPEN, null, params, rptfields, data)
}

/*
* Report zur Aufgabenansicht
*
* @return {void}
*/
function openRPT_CALTASKLIST()
{
    var filter = filterToDo("");
    if ( filter != "" )    
    {
        var params = new Array;
       
        params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
        params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    
        params["Aufgabenübersicht"] = a.translate("Aufgabenübersicht") + " / " + filter.user;

        var data = getTodos( filter );
        for (i=0; i<data.length; i++) data[i][4] = date.longToDate(data[i][4], "dd.MM.yyyy")

        var rptfields = ["ID", "X1", "X2", "X3", "DUE", "STATUS", "PRIO", "SUBJECT", "CREATOR", "RESPONSIBLE", "LINKS" , "CONTENT"];
        a.openStaticLinkedReport("RPTJ_CALTASKLIST", false, a.REPORT_OPEN, null, params, rptfields, data );	
    }		
}

/*
* Report zur Terminansicht
*
* @return {void}
*/
function openRPT_CALEVENTLIST()
{
    var filter = filterEvent("");
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    
    if ( filter != "" )    
    {
        params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
        params["Terminübersicht"] = a.translate("Terminübersicht") + " / " + filter.user;

        var data = getEvents( filter );

        for (i=0; i<data.length; i++)
        {
            data[i][4] = date.longToDate(data[i][4], "dd.MM.yyyy HH:mm")
            data[i][5] = date.longToDate(data[i][5], "dd.MM.yyyy HH:mm")
        }
        var rptfields = ["ID", "COLOUR", "X1", "X2", "STARTDATE", "ENDDATE", "SUBJECT", "CONTENT", "USERS", "LINKS"];
        a.openStaticLinkedReport("RPTJ_CALEVENTLIST", false, a.REPORT_OPEN, null, params, rptfields, data );
    }
}

/*
* Report zur Übersicht von Bonität und Risiko
* 
* @param {String} pSelection opt die aktuelle Selektion
* 
* @return {void}
*/
function openRPT_QUALIFICATION(pSelection)
{
    if (pSelection == undefined) pSelection = ""; 
    else pSelection = " join org on orgid = org_id join address on ADDRESS.ADDRESSID = RELATION.ADDRESS_ID "
        + "where ORG_ID is not null and PERS_ID is null and " + pSelection;

    var bonität = a.sql("select ATTRNAME, count(*) from ATTRLINK join ATTR on ATTR.ATTRID = ATTRLINK.VALUE_ID "
        + " and OBJECT_ID = 1 and ATTRLINK.ATTR_ID = (select ATTRID from ATTR where ATTRNAME = 'Bonität') "
        + " join RELATION on ROW_ID = RELATIONID "     +  pSelection
        + " group by ATTRNAME", a.SQL_COMPLETE);
    
    var risiko = a.sql("select ATTRNAME, count(*) from ATTRLINK join ATTR on ATTR.ATTRID = ATTRLINK.VALUE_ID "
        + " and OBJECT_ID = 1 and ATTRLINK.ATTR_ID = (select ATTRID from ATTR where ATTRNAME = 'Risiko') "
        + " join RELATION on ROW_ID = RELATIONID " + pSelection
        + " group by ATTRNAME", a.SQL_COMPLETE)

    var bonfields = ["BONITAET", "ANZAHL"];
    var riskfields =["RISIKO", "ANZAHL"];
    
    var subdata = getSubReportMap(bonfields, bonität);
    var subdata1 = getSubReportMap(riskfields, risiko);
    
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    params["adito.datasource.subdata"] = subdata;
    params["adito.datasource.subdata1"] = subdata1;    

    a.openStaticLinkedReport("RPTJ_QUALIFICATION", false, a.REPORT_OPEN, null, params, null, null );     
}

/*
* Report zur Übersicht von Kampagnen und Seminaren
*
* @return {void}
*/
function openRPT_EVENTVIEW()
{
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

    var data = a.sql("select 'CAMPAIGN', NAME, DATE_START, DATE_END from CAMPAIGN"/* where " 
        + getTimeCondition("DATE_START", "<", a.valueof("$sys.date"))
        + " union select 'SEMINAR', TITLE, EVENTSTART, EVENTEND from EVENT where " 
        + getTimeCondition("EVENTSTART", "<", a.valueof("$sys.date"))*/, a.SQL_COMPLETE);
    
    for (i=0; i<data.length; i++)
    {
        data[i][2] = date.longToDate(data[i][2], "dd.MM.yyyy")
        data[i][3] = date.longToDate(data[i][3], "dd.MM.yyyy")
    }
    var rptfields = ["CATEGORY", "NAME", "EVENTSTART", "EVENTEND"];

    a.openStaticLinkedReport("RPTJ_EVENTVIEW", false, a.REPORT_OPEN, null, params, rptfields, data );
}

/*
* Generiert Daten und Parameter den Firmenreport
* 
* @param {String} pClientID
* @param {String} pRelID
* @param {String} pOrgID
* @param {String} pUser
* 
* @return [] Parameter für Report
* 
*/
function orgreport (pClientID, pRelID, pOrgID, pUser)
{
    var attr = GetAttribute( "", 1, pRelID, true, pUser ).join("\n") + "\n";
    var c1 = new AddrObject( pRelID ).getFormattedAddress();
    var orgcomm = "";
    var sqlorgcomm = a.sql("select " + getKeySQL("OrgMedium", "MEDIUM_ID") + ", ADDR from COMM where RELATION_ID = '" + pRelID + "'", a.SQL_COMPLETE)  
    for (j=0; j<sqlorgcomm.length; j++)
    {
        orgcomm += sqlorgcomm[j][0] + " : " + sqlorgcomm[j][1] + "\n";
    }

    var subdata = getTasks4Subreport("ORG", pRelID); //Aufgaben
    
    //Kontaktpersonen: 
    var sqlpers = a.sql("select " + concat(["SALUTATION", "TITLE", "FIRSTNAME", "LASTNAME"]) + ", RELTITLE, DEPARTMENT, '', 'clientid', 'orgid', RELATIONID "
        + "from PERS join RELATION on PERS.PERSID = RELATION.PERS_ID "
        + "where RELATION.ORG_ID = '" + pOrgID + "' and STATUS = 1", a.SQL_COMPLETE);
    var perscol = ["PERSNAMECOMPLETE", "PERSFUNCTION", "PERSDEPARTMENT", "PERSCOMM", "CLIENTID", "ORG_ID", "RELATION_ID"];
    for (i=0; i<sqlpers.length; i++)
    {
        var sqlperscomm = a.sql("select " + getKeySQL("PersMedium", "MEDIUM_ID") + ", ADDR from COMM where RELATION_ID = '" 
            + sqlpers[i][6] + "'", a.SQL_COMPLETE)  
    
        if (sqlperscomm.length > 0)
        {
            sqlpers[i][3] += sqlperscomm[0][0] + " : " + sqlperscomm[0][1];
            for (j=1; j<sqlperscomm.length; j++)
            {
                sqlpers[i][3] +=  "\n" + sqlperscomm[j][0] + " : " + sqlperscomm[j][1];
            }
        }
        sqlpers[i][4] = pClientID;
        sqlpers[i][5] = pOrgID;
    }
    var persdata = getSubReportMap(perscol, sqlpers);
    
    //Historien
    var sqlhist = a.sql("select entrydate, "+ getKeySQL("HistoryMedium", "MEDIUM") +", login, info from history "
        + "join historylink on historylink.HISTORY_ID = historyid "
        + "join relation on history.RELATION_ID = relationid "
        + "join employee on employee.RELATION_ID = relationid "
        + "where row_id = '"+pRelID+"'", a.SQL_COMPLETE);
    for(var i = 0; i < sqlhist.length; i++)
    {
        sqlhist[i][0] = date.longToDate(sqlhist[i][0], "dd.MM.yyyy");
    }
    var histcol = ["ENTRYDATE", "MEDIUM", "LOGIN", "INFO"];
    var histdata = getSubReportMap(histcol, sqlhist);     
    
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    params["Kundenstammblatt"] = a.translate("Kundenstammblatt");
    params["Kontaktpersonen"] = a.translate("Kontaktpersonen");
    params["Historie"] = a.translate("Historie");
    params["Attribute"] = a.translate("Attribute");
    params["Aufgaben"] = a.translate("Aufgaben");
    params["ORGAddr"] = c1;
    params["ORGAttr"] = attr;
    params["ORGComm"] = orgcomm;
    params["ORGID"] = pOrgID;
    params["RELID"] = pRelID;
    params["CLIENTID"] = pClientID;
    params["Name"] = a.translate("Name");
    params["Titel"] = a.translate("Titel");
    params["Abteilung"] = a.translate("Abteilung");
    params["Mitarbeiter"] = a.translate("Mitarbeiter");
    params["Position"] = a.translate("Position");
    params["Kommunikationsdaten"] = a.translate("Kommunikationsdaten");
    params["Datum"] = a.translate("Datum");
    params["Kontaktart"] = a.translate("Kontaktart");
    params["Bemerkung"] = a.translate("Bemerkung");
    params["Betreff"] = a.translate("Betreff");
    params["Beschreibung"] = a.translate("Beschreibung");
    params["Status"] = a.translate("Status");
    params["zuständig"] = a.translate("zuständig");
    params["adito.datasource.subdata"] = subdata; // Aufgaben
    params["adito.datasource.subdata2"] = persdata; // Personen
    params["adito.datasource.subdata3"] = histdata // Historien
    
    return params
}
/*
 * Öffnet den Report über Außendienstbesuche
 */
function openRPT_ADMBesuche()
{
    var quartal;
    var year;

    var ergebnis = a.askUserQuestion("Bitte geben Sie Ihr gewünschtes Quartal ein!", "DLG_CHOOSE_QUARTAL");
    if(ergebnis == null)
    {
        a.showMessage("Abgebrochen");
    }
    else
    {
        quartal = ergebnis["DLG_CHOOSE_QUARTAL.quartal"];
        year = ergebnis["DLG_CHOOSE_QUARTAL.year"];
    }
    
    var month;
    switch (quartal){
        case "1":
            month = "(1, 2, 3)";
            break;
        case "2":
            month = "(4, 5, 6)";
            break;
        case "3":
            month = "(7, 8, 9)";
            break;
        case "4":
            month = "(10, 11, 12)";
            break;
    }

    var sql = "select " + getAttrSQL( "Aussendienst", "HISTORYLINK.ROW_ID" ) +" as aussendienst" + ", " + getAttrSQL("Bonität", "HISTORYLINK.ROW_ID") + " as bonität"
    + " from HISTORY join HISTORYLINK on HISTORYID = HISTORYLINK.HISTORY_ID and OBJECT_ID = 1 where MEDIUM = 2 and DIRECTION = 'o'"
    + " and month(entrydate) in " + month + " and year(entrydate) = " + year +" order by aussendienst, bonität" ;

    var data = a.sql(sql, a.SQL_COMPLETE);

    var columnNames = ["Aussendienst", "Bonität"];

    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    
    a.openStaticLinkedReport("RPTJ_ADMBesuche", false, a.REPORT_OPEN, null, params, columnNames, data);
}

/*
* Report zur Übersicht der ADMs
* 
* @param {String} pSelection opt die aktuelle Selektion
*
* @return {void}
*/
function openRPT_SALESMANAGER(pSelection)
{
    var offer;
    var project;
    var visit;
    var call;
    if (pSelection == undefined) pSelection = ""; 
    else pSelection = " and " + pSelection;
	
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

    var year = date.longToDate(a.valueof("$sys.date"), "yyyy")// Start mit Vorjahr
    var yeararray = []
    for (i=0; i < 3; i++) yeararray.push([eMath.subInt(year, i)]);

    var adm = a.sql(getPossibleUserSQL("RELATIONID", ["PROJECT_Aussendienst"]), a.SQL_COMPLETE);

    var data = []
    for (i=0; i<adm.length; i++)
    {
        var sqladm = "(select B.ORG_ID FROM ATTRLINK join RELATION B on ROW_ID = B.RELATIONID WHERE OBJECT_ID = 1 and "//ORG
        + " ATTR_ID = '1027                                ' and  ATTRLINK.VALUE_ID = '" + adm[i][0] + "')";//Aussendienst
    
        for (j=0; j<yeararray.length; j++)
        {
            var sales = a.sql("select sum(NET)/1000, year(ORDERDATE), '" + adm[i][1] + "'"
                + " from SALESORDER where SALESORDER.RELATION_ID in (select RELATIONID from RELATION where ORG_ID in " + sqladm
                + " ) and ORDERTYPE = " + getKeyValue( "Rechnung", "ORDERTYPE") + " and year(ORDERDATE) = " + yeararray[j] + " and SENT = 'Y'"
                + " group by year(ORDERDATE)", a.SQL_COMPLETE);

            offer = a.sql("select count(OFFERID) from OFFER join RELATION A on A.RELATIONID = OFFER.RELATION_ID "
                + " where year(OFFERDATE) = " + yeararray[j]
                + " and ORG_ID in " + sqladm + " group by year(OFFERDATE)");
            if ( offer == '') offer = 0;

            project = a.sql("select count(SALESPROJECTID) from SALESPROJECT join RELATION A on A.RELATIONID = SALESPROJECT.RELATION_ID "
                + " where year(STARTDATE) = " + yeararray[j]
                + " and ORG_ID in " + sqladm + " group by year(STARTDATE)");
            if (project == '' ) project = 0;

            visit = a.sql("select count(HISTORYID) from HISTORY where year(ENTRYDATE) = " + yeararray[j] + " and MEDIUM = 2 " //Besuche
                + " and DIRECTION = 'o' and RELATION_ID = '" + adm[i][0] + "' group by year(ENTRYDATE)");
            if (visit == '' ) visit = 0;

            call = a.sql("select count(HISTORYID) from HISTORY where year(ENTRYDATE) = " + yeararray[j] + " and MEDIUM = 1 " //Anrufe
                + " and DIRECTION = 'o' and RELATION_ID = '" + adm[i][0] + "' group by year(ENTRYDATE)");
            if (call == '' ) call = 0; 
            
            for (k=0; k<sales.length; k++)
            {
                data.push ([a.formatDouble(sales[k][0], "0"), sales[k][1], sales[k][2], visit, offer, call, project])
            }
        }
    }
    var rptfields = ["TURNOVER", "SALESYEAR", "LOGIN", "VISITS", "OFFERS", "CALLS", "PROJECTS"];
    
    a.openStaticLinkedReport("RPTJ_SALESMANAGER", false, a.REPORT_OPEN, null, params, rptfields, data );
}

/*
* Export der Umsätze
* 
* @return {void}
*/
function openExcel_SALES()
{
    var execIt;
    var sql = a.sql("select ORDERITEMID, " + getKeySQL("GroupCode", "GROUPCODEID") + ", ITEMNAME, SALESORDER.RELATION_ID, COUNTRY "
        + " from SALESORDER join ORDERITEM on SALESORDERID = ORDERITEM.SALESORDER_ID join RELATION on RELATIONID = SALESORDER.RELATION_ID join ADDRESS on RELATIONID = ADDRESS.RELATION_ID"
        + " where QUANTITY > 10 and ITEMNAME <> '' order by 4", a.SQL_COMPLETE);

    var dbAccess = [];

    for (var j=0; j < sql.length; j++)
    {
        adm = GetAttribute("Aussendienst", "1", sql[j][3] ); // Setzen des im SQL mit 'ADM' belegten Wertes
        dbAccess.push([sql[j][0], sql[j][1], sql[j][2], adm, sql[j][4]])
    }

    var headings =  new Array ("Umsatz","ID@3","Warengruppe@4","Produkt@1","Zustaendig@2","Land@5");

    // Benutzergesteuerte Variablen zum Öffnen des Programms
    var startExcel = true;
    var createPivot = true;
    var decChang = true;

    // Fehlerprüfung. Wenn eine leere Tabelle übergeben wird, ist dbAccess[0][0] undefined, und es tritt ein Fehler auf,
    // bevor die Fehlerhafte Tabelle an Microsoft Excel übergeben wird.
    try
    {
        var undefinedCheck = dbAccess[0][0];
        execIt = true;
    } catch (ex)
{
        a.showMessage(a.translate("Es wurde eine leere Tabelle übergeben") + ".\n" + a.translate("Für den Export von Daten ist mindestens eine befüllte Spalte notwendig"));
        execIt = false;
    }

    // Führt das Skript aus, sofern nicht durch das Eingabefehlerhandling oben untersagt.
    if(execIt == true) exportExcel(dbAccess, headings, createPivot, startExcel, decChang, 52);
}

/*
* Report für Angebot
* 
* @param {String} pOfferID
* @param {Boolean} pExport
* @param {String} pUser
* @param {String} pRPT req Name des Reports 
*
* @return {[]}
*/
function openRPT_Offer( pOfferID, pExport, pUser, pRPT )
{    
    var fields = ["OFFER.ADDRESS", "OFFER.RELATION_ID", "OFFER.LANGUAGE", "OFFER.PAYMENTTERMS", //0 - 3
    "OFFER.DELIVERYTERMS", "OFFER.OFFERCODE", "OFFER.CURRENCY", "OFFER.OFFERDATE", //   4 - 7
    "OFFER.OFFERID", "OFFERITEM.OFFER_ID", "OFFERITEM.DESCRIPTION", "OFFERITEM.ASSIGNEDTO", // 11
    "OFFERITEM.PRODUCT_ID","OFFERITEM.ITEMNAME" , // 13
    "OFFERITEM.OPTIONAL", "OFFERITEM.ITEMPOSITION", // 15
    "PRODUCT.PRODUCTCODE", "PRODUCT.PRODUCTID", "OFFER.FOOTER", "OFFER.HEADER", "OFFERITEM.UNIT", "OFFER.VAT", // 21
    "COALESCE(OFFERITEM.QUANTITY,0)","COALESCE(OFFERITEM.PRICE,0)", "COALESCE(OFFERITEM.DISCOUNT,0)", // 24
    "COALESCE(OFFER.VERSNR, 0)", "COALESCE(OFFER.OFFERCODE,0)", "COALESCE(OFFERITEM.VAT, 0)", "0", "''", "PROJECT_ID" ]; // 30
        
    var rptdata = a.sql("select " + fields.join(", ") + "  from PRODUCT inner join OFFERITEM on PRODUCT.PRODUCTID = OFFERITEM.PRODUCT_ID "
        + "inner join OFFER on OFFERITEM.OFFER_ID = OFFER.OFFERID "
        + "where OFFER.OFFERID = '" + pOfferID + "'", a.SQL_COMPLETE);
    
    var sprache = getKeyName(rptdata[0][2], "SPRACHE", "keyname2");
    var doc = [];
    var relid = rptdata[0][1];
    var addrobj = new AddrObject( relid );
    var orgrelid = a.sql("select RELATIONID from RELATION where PERS_ID is null and ORG_ID = (select ORG_ID from RELATION where RELATIONID = '" + relid + "')");
    
    var preisMenge= 0;
    var itemSum = 0;
    var sumItemSum = 0;
    var total = 0;
    var sums = new Array();
    var vatsum = 0;
    var offset = 22;

    for(var i = 0; i < rptdata.length; i++)
    {                
        //Berechnungen durchführen:
        //"OFFERITEM_QUANTITY" * "OFFERITEM_PRICE"
        preisMenge = eMath.mulDec(parseFloat(rptdata[i][22]), parseFloat(rptdata[i][23]) );
        //( preisMenge * ( 100 - "OFFERITEM_DISCOUNT" ) ) / 100
        itemSum = eMath.roundDec(eMath.divDec(eMath.mulDec(preisMenge, eMath.subDec(100, rptdata[i][24]) ), 100), 2, eMath.ROUND_HALF_EVEN); //Summe je Artikel
        sumItemSum += itemSum; //Gesamtsumme aller Artikel      
        // itemSum * "OFFERITEM_VAT" / 100
        vatsum = (eMath.divDec(eMath.mulDec(itemSum, rptdata[i][27] ), 100)); //Steuerbetrag in Euro je Artikel
        if(rptdata[i][27] > 0) sums.push([rptdata[i][27], vatsum]); //MWSteuerwerte für Map vorbereiten
        // sumItemSum + "OFFER_VAT"
        total = eMath.addDec(sumItemSum, rptdata[i][21]); //Gesamtsumme zzgl. MwSt.
        total = a.formatDouble(total, "#,##0.00")
        //Datum formatieren
        rptdata[i][7] = date.longToDate(rptdata[i][7], "dd.MM.yyyy");
        //Zahlen formatieren:
        rptdata[i][23] = a.formatDouble(rptdata[i][23], "#,##0.00");
        rptdata[i][24] = a.formatDouble(rptdata[i][24], "0.00");
        rptdata[i][22] = a.formatDouble(rptdata[i][22], "#,##0");
        rptdata[i][27] = a.formatDouble(rptdata[i][27], "#,##0.00");   
        rptdata[i][28] = a.formatDouble(itemSum, "#,##0.00"); //Immer zwei Nachkommastellen und ',' statt '.' 
        rptdata[i][29] = getKeyName(rptdata[i][20], "Einheiten", "KEYNAME1", sprache);      
    }
       
    var subdata = getSubReportMap(["VAT","WERT"], sums);
    
    var params = new Array;
    params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
    params["Pos"] = a.translate("Pos.", sprache);
    params["Artikelbezeichnung"] = a.translate("Artikelbezeichnung", sprache);
    params["Artikel-Nr"] = a.translate("Artikel-Nr", sprache);
    params["Einzelpreis"] = a.translate("Einzelpreis", sprache);
    params["Menge"] = a.translate("Menge", sprache);
    params["UMSt"] = a.translate("UMSt", sprache);
    params["Datum"] = 	a.translate("Datum", sprache);
    params["Nummer"] = a.translate("Nummer", sprache);
    params["Zahlungsbedingung"] = a.translate("Zahlungsbedingung", sprache);
    params["Lieferbedingung"] = a.translate("Lieferbedingung", sprache);
    params["Rabatt"] = a.translate("Rabatt", sprache);
    params["Gesamt"] =  a.translate("Gesamt", sprache);
    params["Summe"] = 	a.translate("Summe", sprache);
    params["zzglUMST"] = a.translate("zzgl. Summe UmSt", sprache);
    params["OFFERAddr"] = rptdata[0][0];
    params["OFFERPers"] = addrobj.formatAddress("{ls},");
    params["OFFERPay"] = getKeyName(rptdata[0][3] , "PAYMENTTERMS", "KEYNAME1", sprache);
    params["OFFERDel"] = getKeyName(rptdata[0][4] , "DELIVERYTERMS", "KEYNAME1", sprache);
    var adm = getAddressData( [GetAttributeKey( "Aussendienst", "1", orgrelid, pUser )[0]],
        [["Person","function", "concat( ['SALUTATION', 'TITLE', 'FIRSTNAME','LASTNAME'])"],
        ["Telefon Büro", "function", "getCommAddrSQL('Pers', 'Telefon Büro', 'RELATION.RELATIONID')"],
        ["Email Büro", "function", "getCommAddrSQL('Pers', 'E-Mail Büro', 'RELATION.RELATIONID')"]
        ] );
    var adma = "";
    if (adm[1] != undefined)  adma = adm[1].join("\n");
    params["AD_Name"] = adma;
    params["adito.datasource.subdata"] = subdata;
    params["SUMITEMSUM"] = sumItemSum;
    params["TOTAL"] = total;
    
    //für den report werden nicht alle oben abgefragten felder benötigt:
    var rptfields = ["OFFER_CURRENCY", "OFFER_OFFERDATE", "OFFER_OFFERID",  "OFFERITEM_DESCRIPTION", "OFFERITEM_ASSIGNEDTO", 
    "OFFERITEM_ITEMNAME" , "OFFERITEM_OPTIONAL", "OFFERITEM_ITEMPOSITION", "PRODUCT_PRODUCTCODE", "OFFER_FOOTER", "OFFER_HEADER", //10
    "OFFERITEM_QUANTITY", "OFFERITEM_PRICE", "OFFERITEM_DISCOUNT", "OFFER_VERSNR", "OFFER_OFFERCODE", "OFFERITEM_VAT", "ITEMSUM",
    "OFFERITEM_UNITTEXT"]; //19 elem
    var data = [];
    for( i = 0; i < rptdata.length; i++)
    {
        data[i] = [rptdata[i][6], rptdata[i][7], rptdata[i][8], rptdata[i][10], rptdata[i][11], rptdata[i][13], 
        rptdata[i][14], rptdata[i][15], rptdata[i][16], rptdata[i][18], rptdata[i][19], //10
        rptdata[i][22], rptdata[i][23], 
        rptdata[i][24], rptdata[i][25], rptdata[i][26], rptdata[i][27], rptdata[i][28], rptdata[i][29]];
    }
    
    if ( pExport ) 
    {
        doc[0] = "Angebot.pdf"
        doc[1] = a.exportReportToBytes(pRPT, "", a.REPORT_EXPORT_PDF, null, params, rptfields, data);
        return doc;
    }
    else
    {
        a.openStaticLinkedReport(pRPT, false, a.REPORT_OPEN, null, params, rptfields, data);
        // Angebot als PDF erzeugen, wird über eigenen Button aufgerufen
        var offercode = data[0][15] + "-" + data[0][14];
        var splink = "#" + new FrameData().getData("id", "16", ["title"] ) + ":" 
        + a.sql("select PROJECTNUMBER from SALESPROJECT where SALESPROJECTID = '" + rptdata[0][30] + "'") + "#";
        var pdfpath =  a.valueof("$sys.clienttemp") + "/" + a.translate("Angebot", sprache) + " " + offercode + ".pdf";
        a.globalvar("$global.RptOfferOrderDetails", [offercode, relid, pdfpath, a.translate("Angebot", sprache), "Email_Angebot", "AGB", splink]);
        a.openStaticReport(pRPT, false, a.REPORT_EXPORT, [a.REPORT_EXPORT_PDF, pdfpath], params, rptfields, data);
        return [];       
    }   
}

/*
* Map für Subreportdaten
* 
* @param {[String-Array]} pFieldNames Namen der Felder
* @param {[String-Array]} pData Wert der Felder
* 
* @return {[]} Array von Objekten
*/

function getSubReportMap(pFieldNames, pData )
{
    var maps = [];
    for (var z = 0; z < pData.length; z++) 
    {
        maps.push(_element(pFieldNames, pData[z]))
    }
    return maps;

    function _element(pFieldNames, pValues)
    {
        var data = {};
        for (var i = 0; i< pFieldNames.length; i++)        
        {
            data[pFieldNames[i]] = pValues[i];  
        }
        return data;
    }
}
/*
* Aufgaben für Subreports
* 
* @param {String} pFrameName Name des Frames, der die Aufgaben enthält
* @param {String} pID ID des aktuellen Datensatzes
* 
* @return {Function} getSubReportMap
* 
*/
function getTasks4Subreport(pFrameName, pID)
{
    var tab = getLinkedToDos(pFrameName, pID);
    var data = [];
    for(var i = 0; i < tab.length; i++)
    {
        data.push(tab[i].slice(4))
    }
    var col = new Array ("DUE", "STATUS", "SUBJECT", "CREATEDBY", "RESPONSIBLE", "INFOTEXT");
    return getSubReportMap(col, data);
}
