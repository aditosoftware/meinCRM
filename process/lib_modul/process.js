import("lib_frame");
import("lib_attr");
import("lib_keyword");
import("lib_sql");
import("lib_relation");
import("lib_addr");
import("lib_grant");
import("lib_offerorder");

/*
* Gibt eine Liste aller verknüpten Module zurück
*
* @param {String} pCondition
* @param {[String]} pModules req
* @param {[String]} pYear opt Jahr des Items
* @param {String} pRelID opt ID der Relation
*
* @return {[]}
*/
function getModule( pCondition, pModules, pYear, pRelID)
{
    var data;
    var category;
    var payterms;
    var info; 
    var title;
    var sent;        
    var list = [];
    
    if ( pCondition != "" )
    {
        var relids = "(select RELATIONID from RELATION where " + pCondition + ")";
        for ( i=0; i < pModules.length; i++)
        {
            var modul = a.decodeMS(pModules[i])
            switch(modul[0])
            {
                case "SALESPROJECT" :
                    var condition = getGrantCondition(modul[0], YearFromItem("STARTDATE") + " RELATION_ID in " + relids);
                    data = a.sql("select SALESPROJECTID, " + getKeySQL("SPPHASE", "PHASE") 
                        + ", PROJECTNUMBER, " + getKeySQL("SPSTATUS", "STATUS") + ", STARTDATE, VOLUME, PROBABILITY "
                        + " from SALESPROJECT where " + condition + " order by STARTDATE desc", a.SQL_COMPLETE);
                    
                    for (j = 0; j < data.length; j++)
                    {
                        info = a.translate("Volumen") + ": " + eMath.roundInt(data[j][5], eMath.ROUND_HALF_EVEN) + " T\€ , " + a.translate("Auftr.Wahr.") + " "+ data[j][6] + "%";
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], data[j][2], data[j][3], data[j][4], info])
                    }
                    break;
                    
                case "OFFER" :
                    condition = getGrantCondition(modul[0], YearFromItem("OFFERDATE") + " RELATION_ID in " + relids);
                    data = a.sql("select OFFERID, NET, CURRENCY, OFFERCODE, VERSNR," + getKeySQL("OFFERSTATE", "STATUS") + ", OFFERDATE, " + getKeySQL("PAYMENTTERMS", "PAYMENTTERMS") 
                        + " from OFFER where " + condition + " order by OFFERDATE desc", a.SQL_COMPLETE);
                            
                    for (j = 0; j < data.length; j++)
                    {
                        category = a.translate("netto") + " : " + eMath.roundInt(data[j][1], eMath.ROUND_HALF_EVEN) + " " + data[j][2];
                        payterms = a.translate("Zahlungsbed.") + ": " + data[j][7];
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], category, data[j][3] + "-" + data[j][4], data[j][5], data[j][6], payterms])
                    }
                    break;
                    
                case "SALESORDER" :
                    condition = getGrantCondition(modul[0], YearFromItem("ORDERDATE") + " RELATION_ID in " + relids);
                    data = a.sql("select SALESORDERID, NET, CURRENCY, ORDERCODE, SENT, ORDERDATE, " 
                        +  getKeySQL("PAYMENTTERMS", "PAYMENTTERMS") + ", " + getKeySQL("ORDERTYPE", "ORDERTYPE") 
                        + " from SALESORDER where " + condition + " order by ORDERDATE desc", a.SQL_COMPLETE);
                    
                    for (j = 0; j < data.length; j++)
                    {
                        category = "netto : " + eMath.roundInt(data[j][1], eMath.ROUND_HALF_EVEN) + " " + data[j][2];
                        if (data[j][4] == 'Y') sent = a.translate("versendet"); else sent = "";
                        payterms = data[j][7] + ", " + a.translate("Zahlungsbed.") + ": " + data[j][6];
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], category, data[j][3], sent, data[j][5], payterms])
                    }
                    break;
                        
                case "PROPERTY" :
                    condition = getGrantCondition(modul[0], YearFromItem("PROPSTART") + " RELATION_ID in " + relids);
                    data = a.sql("select PROPERTYID, " + getKeySQL("PROPTYPE", "PROPERTYTYPE") 
                        + ", PROPERTYNUMBER, " + getKeySQL("PROPSTATUS", "STATUS") + ", PROPERTY.PROPSTART, VOLUME, PROPERTY.TITLE "
                        + " from PROPERTY join PROPINV on (PROPERTYID = PROPINV.PROPERTY_ID) where " 
                        + condition + " order by PROPSTART desc", a.SQL_COMPLETE);
                    
                    for (j=0; j<data.length; j++)
                    {
                        var propno = data[j][2];
                        info = data[j][6] + ", " + a.translate("Volumen(T\€)") + ": " + eMath.roundInt(data[j][5], eMath.ROUND_HALF_EVEN)
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], propno, data[j][3], data[j][4], info])
                    }
                    break;

                case "COMPLAINT" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " RELATION_ID in " + relids);
                    data = a.sql("select COMPLAINTID, " + getKeySQL("COMPLAINTCATEGORY", "CATEGORY") 
                        + ", COMPLAINTNUMBER, " + getKeySQL("COMPLAINTSTATUS", "STATUS") + ", DATE_NEW, GROUPCODEID, SUBJECT "
                        + " from COMPLAINT where " + condition + " order by DATE_NEW desc", a.SQL_COMPLETE);
                    
                    for (j=0; j<data.length; j++)
                    {
                        info = getKeyName(data[j][5], "GroupCode") + " , " + a.translate("betrifft") + ": " + data[j][6];
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], data[j][2], data[j][3], data[j][4], info])
                    }
                    break;
                    
                case "CONTRACT" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " RELATION_ID in " + relids);
                    data = a.sql("select CONTRACTID, " + getKeySQL("CONTRACTTYPE", "CONTRACTTYPE") 
                        + ", CONTRACTCODE, " + getKeySQL("CONTRACTSTATUS", "CONTRACTSTATUS") + ", DATE_NEW, CONTRACTSTART, PAYMENT "
                        + " from CONTRACT where " + condition + " order by DATE_NEW desc", a.SQL_COMPLETE);
                    
                    for (j=0; j<data.length; j++)
                    {
                        info = a.translate("Beginn") + ": " + date.longToDate(data[j][5], "MMM.yyyy") + " , Zahlung: " + data[j][6]
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], data[j][2], data[j][3], data[j][4], info])
                    }
                    break;
                    
                case "EVENT" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " EVENTPARTICIPANT.RELATION_ID in " + relids);
                    data = a.sql("select distinct EVENTID, " + getKeySQL("EVENTCATEGORY", "CATEGORY") 
                        + ", EVENTNUMBER, " + getKeySQL("EVENTSTATUS", "EVENTSTATUS") + ", EVENT.DATE_NEW, TITLE "
                        + " from EVENT join EVENTPARTICIPANT on (EVENT.EVENTID = EVENTPARTICIPANT.EVENT_ID) where " 
                        + condition + " order by DATE_NEW desc", a.SQL_COMPLETE);
                            
                    for (j=0; j<data.length; j++)
                    {
                        title = a.translate("Titel") + ": " + data[j][5];
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], data[j][2], data[j][3], data[j][4], title])
                    }
                    break;
                    
                case "CAMPAIGN" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " CAMPAIGNPARTICIPANT.RELATION_ID in " + relids);
                    data = a.sql("select distinct CAMPAIGNID, NAME, DATE_START, DATE_END, CAMPAIGN.DATE_NEW, DESCRIPTION, "
                        + " (select count(*) from CAMPAIGNPARTICIPANT where CAMPAIGN_ID = CAMPAIGNID), "
                        + " (select count(*) from CAMPAIGNPARTICIPANT where CAMPAIGN_ID = CAMPAIGNID and RELATION_ID in " + relids + "), "
                        + " (select STEP from CAMPAIGNSTEP join CAMPAIGNPARTICIPANT on CAMPAIGNSTEPID = CAMPAIGNSTEP_ID"
                        + " where CAMPAIGNPARTICIPANT.CAMPAIGN_ID = CAMPAIGNID and RELATION_ID = '" + pRelID + "')"
                        + " from CAMPAIGN join CAMPAIGNPARTICIPANT on CAMPAIGNPARTICIPANT.CAMPAIGN_ID = CAMPAIGNID where " 
                        + condition + " order by DATE_NEW desc", a.SQL_COMPLETE);
                        
                    var today = a.valueof("$sys.today");
                    var status;
                    for (j=0; j<data.length; j++)
                    {
                        var code = "";
                        if (data[j][2] > today) status = a.translate("vor Start");
                        else
                        {
                            if (data[j][2] < today && data[j][3] > today) status = a.translate("läuft");
                            else status = a.translate("beendet");
                        }
                        var step = "";
                        if (data[j][8] != "")
                        {
                            step = ", " + a.translate("Stufe") + ": " + data[j][8];
                            code = a.translate("enthalten");
                        } 
                        title = a.translate("Teilnehmer") + ": " + data[j][7] + " (" + data[j][6] + ")" + step + ", " + data[j][5];                        
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], code, status, data[j][4], title])
                    }
                    break;
                    
                case "DISTLIST" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " DISTLISTMEMBER.RELATION_ID in " + relids);
                    data = a.sql("select distinct DISTLISTID, NAME, DISTLIST.DATE_NEW, DESCRIPTION, "
                        + " (select count(*) from DISTLISTMEMBER where DISTLIST_ID = DISTLISTID), "
                        + " (select count(*) from DISTLISTMEMBER where DISTLIST_ID = DISTLISTID and RELATION_ID in " + relids + "), "
                        + " (select count(*) from DISTLISTMEMBER where DISTLIST_ID = DISTLISTID and RELATION_ID = '" + pRelID + "') "
                        + " from DISTLIST join DISTLISTMEMBER on DISTLISTID = DISTLIST_ID where " + condition + " order by DATE_NEW desc", a.SQL_COMPLETE);
                    
                    for (j = 0; j < data.length; j++)
                    {
                        code = data[j][6] > 0 ? a.translate("enthalten") : "";
                        title = a.translate("Teilnehmer") + ": " + data[j][5] + " (" + data[j][4] + "), " + data[j][3];
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], code, "", data[j][2], title])
                    }
                    break;
                    
                case "EQUIPMENTINVENTORY" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " RELATION_ID in " + relids);
                    data = a.sql("select EQUIPMENTINVENTORYID, ORGNAME, PRODUCTNAME, SERIALNUMBER, " 
                        + getKeySQL("EQUIPMENTSTATUS", "EQUIPMENTINVENTORY.STATUS") + ", INSTALLED, EQUIPMENTINVENTORY.DATE_NEW from EQUIPMENTINVENTORY "
                        + " left join RELATION on RELATION.RELATIONID = PRODUCER_ID left join ORG on RELATION.ORG_ID = ORG.ORGID "
                        + " left join PRODUCT on PRODUCTID = PRODUCT_ID where " 
                        + condition + " order by EQUIPMENTINVENTORY.DATE_NEW desc", a.SQL_COMPLETE);
                            
                    for (j = 0; j < data.length; j++)
                    {
                        info = data[j][2] + ", " + a.translate("Erstinstallation") + " " + date.longToDate(data[j][5], "dd.MM.yyyy");
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], "Herst.: " + data[j][1], data[j][3], data[j][4], data[j][6], info])
                    }
                    break;
                    
                case "BANKACCOUNT" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " RELATION_ID in " + relids);
                    data = a.sql("select BANKACCOUNTID, BANKNAME, ROUTINGCODE, BANUMBER, " + getKeySQL("BATYPE", "BATYPE") + ", IBAN, DATE_NEW "
                        + " from BANKACCOUNT where " + condition + " order by DATE_NEW desc", a.SQL_COMPLETE);
                            
                    for (j=0; j<data.length; j++)
                    {
                        info = "IBAN " + data[j][5];
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], data[j][2], data[j][4], data[j][6], info])
                    }
                    break;
                    
                case "QUESTIONNAIRELOG" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " RELATION_ID in " + relids);
                    data = a.sql("select QUESTIONNAIRELOGID, TITLE, '', '', '', DESCRIPTION, QUESTIONNAIRELOG.DATE_NEW "
                        + " from QUESTIONNAIRELOG join QUESTIONNAIRE on QUESTIONNAIRE_ID = QUESTIONNAIREID where " 
                        + condition + " order by DATE_NEW desc", a.SQL_COMPLETE);
                           
                    for (j=0; j<data.length; j++)
                    {
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], data[j][2], data[j][4], data[j][6], data[j][5]])
                    }
                    break;
                    
                case "MACHINE" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " RELATION_ID in " + relids);
                    data = a.sql("select MACHINEID, ORGNAME, PRODUCTNAME, MANUFACTUREYEAR, " 
                        + getKeySQL("MACHINESTATUS", "MACHINESTATUS") + ", APPLICATION, MACHINE.DATE_NEW "
                        + " from MACHINE join PRODUCT on PRODUCTID = MACHINE.PRODUCT_ID join RELATION on RELATIONID = MACHINE.MANUFACTURERID "
                        + " left join ORG on ORGID = RELATION.ORG_ID where " + condition + " order by DATE_NEW desc", a.SQL_COMPLETE);
                        
                    for (j=0; j<data.length; j++)
                    {
                        info = a.translate("Baujahr") + " " + data[j][3] + ", " + a.translate("Anwendung") + ": " + data[j][5];
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], data[j][2], data[j][4], data[j][6], info])
                    }
                    break;
                    
                case "SERVICEORDER" :
                    condition = getGrantCondition(modul[0], YearFromItem("DATE_NEW") + " SERVICEORDER.RELATION_ID in " + relids);
                    data = a.sql("select SERVICEORDERID, " + getKeySQL("SERVICETYPE", "SERVICETYPE") + ", SERVICEORDERCODE, " 
                        + "SERIALNUMBER, " + getKeySQL("SERVICESTATUS", "SERVICESTATUS") 
                        + ", PRODUCTNAME, SERVICEORDER.DATE_NEW "
                        + " from SERVICEORDER left join MACHINE on MACHINEID = MACHINE_ID left join PRODUCT on PRODUCTID = MACHINE.PRODUCT_ID "
                        + " where " + condition + " order by DATE_NEW desc", a.SQL_COMPLETE);
                    
                    for (j=0; j<data.length; j++)
                    {
                        info = a.translate("Maschine") + " : " + data[j][5] + ", SNR: " + data[j][3];
                        list.push([a.encodeMS([data[j][0], modul[3], modul[2]]), modul[0], modul[1], data[j][1], data[j][2], data[j][4], data[j][6], info])
                    }
                    break;
            }
        }
    }
    
    function YearFromItem(pItem)
    {
        if ( pYear == undefined  || pYear.length == 0 ) year = ""; 
        else year = yearfromdate(modul[0] + "." + pItem) + " in (" + pYear.join(",") + ") and ";
        return  year;
    }

    if ( list.length == 0) 	list = a.createEmptyTable(7);
    return list;
}

/*
* newModule
* Erstellt ein neues Modul
*
* @author HB
* @version 1.0
* @date 07/2006
*
* @param {String} pRelationID req die ID der Relation
*
* @return {void}
*/
function newModule( pRelationID )
{
    var reltype = getRelationType(pRelationID);
    if ( reltype == 1 )
        var notnew = "CAMPAIGN, DISTLIST, EVENT, PROPERTY";
    else 
    {
        reltype = 2;
        notnew = "CAMPAIGN, DISTLIST, EVENT, PROPERTY, SALESPROJECT, MACHINE, SERVICEORDER";
    }
    var fd = new FrameData();
    var moduls = fd.getData("modul", true, ["name", "title"]);
    var modul = [];
	
    for ( var i = 0; i < moduls.length; i++) if( notnew.indexOf(moduls[i][0]) == -1 ) modul.push(moduls[i]);

    a.localvar("$local.modul", modul);
    modul = a.askUserQuestion(a.translate("Modul"), "DLG_CHOOSE_MODUL");
    if (modul != null) // Abfrage Abbruch
    {
        modul = a.decodeFirst(modul["DLG_CHOOSE_MODUL.tbl_modul"]);
        var prompts = [];
        var defaultvalue = [];
        prompts["comp4refresh"] = "$comp.Tabelle_modul";
        prompts["autoclose"] = false;
        var lang = a.valueof("$comp.LANG"); //Sprache der Person/Firma übergeben
        switch(modul)
        {
            case "OFFER" :
                pRelationID = selectPers( pRelationID );
                if(pRelationID != null)
                {
                    defaultvalue["$comp.PAYMENTTERMS"] = getRelAttr( "Zahlungskondition", pRelationID).toString();
                    defaultvalue["$comp.DELIVERYTERMS"] = getRelAttr( "Lieferkondition", pRelationID).toString();
                    defaultvalue["$comp.ADDRESS"] = new AddrObject( pRelationID ).formatAddress();
                    defaultvalue["$comp.LANGUAGE"] = lang;
                }
                break;
            case "SALESORDER" :
                pRelationID = selectPers( pRelationID );
                if(pRelationID != null)
                {
                    defaultvalue["$comp.PAYMENTTERMS"] = getRelAttr( "Zahlungskondition", pRelationID).toString();
                    defaultvalue["$comp.DELIVERYTERMS"] = getRelAttr( "Lieferkondition", pRelationID).toString();
                    defaultvalue["$comp.ADDRESS_INVOICE"] = getOrderAddress( pRelationID, "Rechnungsadresse" ); //new AddrObject( pRelationID ).formatAddress();
                    defaultvalue["$comp.ADDRESS_DELIVERY"] = getOrderAddress( pRelationID, "Lieferadresse" ); //new AddrObject( pRelationID ).formatAddress();
                    defaultvalue["$comp.LANGUAGE"] = lang;
                }
                break;
            case "COMPLAINT" :
            case "CONTRACT" :
            case "QUESTIONNAIRELOG" :
            case "SERVICEORDER" :
                pRelationID= selectPers( pRelationID );
                defaultvalue["$comp.RELATION_ID"] = pRelationID;
                break;
        }
        if ( pRelationID != null )
        {
            prompts["DefaultValues"] = defaultvalue;
            prompts["ID"] = pRelationID;
            a.openLinkedFrame(modul, null, false, a.FRAMEMODE_NEW, "", null, false, prompts);
        }
    }

    /*
    * selectPers
    * Wählt eine Person aus und liefert deren ID zurück
    *
    * @param {String} pRelationID req die ID der Relation
    *
    * @return {String} RelationID
    */
    function selectPers( pRelationID )
    {
        var relid = pRelationID;
        var orgid = a.sql("select ORG_ID from RELATION where RELATIONID = '" + relid + "'");
        if ( getRelationType(relid) == 1)
        {
            a.localvar("$local.idcolumn", orgid)
            relid = a.askUserQuestion(a.translate("Person"), "DLG_PERS");
            if (relid != null) 
            {
                relid = relid["DLG_PERS.relpersid"];
                if (relid == "") relid = pRelationID; // wenn Person ausgewählt
            }
        }
        return relid;
    }
}

