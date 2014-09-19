/*
   verwendung des objekts mit den framedaten
   =========================================
   
   jeder einzelne frame innerhalb des frameobjekts verfügt über die
   folgenden eigenschaften:
     - name: der name des frames wie im designer, z.B. "UNLINKEDMAILS",
     - title: der titel des frames wie im designer, z.B. "Unverknüpfte Emails",
     - id: die intern vergebene frame-id (muss eindeutig sein!), z.B. "37",
     - table: die mit dem frame verknüpfte tabelle, z.B. "UNLINKEDMAIL",
     - idcolumn: die PK-Spalte für die tabelle, z.B. "MAILID",
     - rights: falls der frame für die rechtevergabe in frage kommt, true, sonst false
     - history: falls der frame für die history in frage kommt, true, sonst false
     - attribute: falls der frame attribute besitzt, true, sonst false
     - selection: falls der frame in der expertenselektion auftauchen kann, true, sonst false
     - keyword: schlüsselwort für die gesteuerte attributevergabe (details bei HB)

   nach dem erzeugen des objekts über einen aufruf von "var x = new FrameData();"
   wird auf Daten von Frames über die methode "getData()" zugegriffen.

   diese methode besitzt drei parameter:
   - der erste parameter gibt eine der eigenschaften aus der liste an
   - der zweite parameter gibt den gesuchten inhalt für die eigenschaft an
   - der dritte parameter ist entweder undefined (wird nicht angegeben) oder enthält
     ein array mit einer liste von eigenschaftsnamen als string-array
     
   das ergebnis der methode hängt davon ab, ob ein array mit eigenschaftsnamen angegeben
   wurde oder nicht.
   
   - falls ja, dann ist das ergebnis ein mehrdimondesionaler array mit den daten aus dem
     array für alle frames, welche die in den ersten beiden parametern angegebene 
     bedingung erfuellen

   - falls nein, dann ist das ergebnis ein array aus einzelnen frame-objekten
     für alle frames, welche die in den ersten beiden parametern angegebene
     bedingung erfuellen
     
   details auch in den beispielen unten
*/
function FrameData()
{

    this.frameData = [
    {
        id: "1",  
        name: "ORG",                    
        title: "Firma",               
        table: "RELATION",                   
        idcolumn: "RELATIONID",                    
        rights: true,  
        history: false, 
        attribute: true,  
        selection: true,  
        modul: false,         
        keyword: ""
    }
    , {
        id: "2",  
        name: "PERS",                   
        title: "Person",              
        table: "RELATION",                   
        idcolumn: "RELATIONID",                    
        rights: true,  
        history: false, 
        attribute: true,  
        selection: true,  
        modul: false, 
        keyword: ""
    }   
    , {
        id: "3",  
        name: "REL",                    
        title: "Funktion",            
        table: "RELATION",                   
        idcolumn: "RELATIONID",                    
        rights: true,  
        history: false, 
        attribute: false,  
        selection: false,  
        modul: false, 
        keyword: ""
    }                  
    , {
        id: "4",  
        name: "HISTORY",                
        title: "Historie",            
        table: "HISTORY",                    
        idcolumn: "HISTORYID",                     
        rights: true,  
        history: false, 
        attribute: true,  
        selection: true,  
        modul: false, 
        keyword: ""
    }
    , {
        id: "5",  
        name: "DISTLIST",      					
        title: "Verteiler",           
        table: "DISTLIST",                   
        idcolumn: "DISTLISTID",                    
        rights: true,  
        history: false, 
        attribute: false, 
        selection: false, 
        modul: true,  
        keyword: ""
    }
    , {
        id: "6",  
        name: "CAMPAIGN",               
        title: "Kampagne",            
        table: "CAMPAIGN",                   
        idcolumn: "CAMPAIGNID",                    
        rights: true,  
        history: true,  
        attribute: true,  
        selection: false, 
        modul: true,  
        keyword: ""
    }
    , {
        id: "7",  
        name: "SELECTION",              
        title: "Expertenselektion",   
        table: "SELECTION",                  
        idcolumn: "SELECTIONID",                   
        rights: true,  
        history: false, 
        attribute: false, 
        selection: false, 
        modul: false, 
        keyword: ""
    }

    , {
        id: "9",  
        name: "DOCUMENT",               
        title: "Doku Vorlagen",       
        table: "DOCUMENT",                   
        idcolumn: "DOCUMENTID",                    
        rights: true,  
        history: false, 
        attribute: true,  
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "10", 
        name: "ATTRIBUTES",             
        title: "Attribute",           
        table: "ATTR",                       
        idcolumn: "ATTRID",                        
        rights: true,  
        history: false, 
        attribute: false, 
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "11", 
        name: "KEYWORD",                
        title: "Keyword",             
        table: "KEYWORD",                    
        idcolumn: "KEYWORDID",                     
        rights: true,  
        history: false, 
        attribute: false, 
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "12", 
        name: "EMPLOYEE",               
        title: "Mitarbeiter",         
        table: "EMPLOYEE",                   
        idcolumn: "EMPLOYEEID",                    
        rights: true,  
        history: false, 
        attribute: true,  
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "13", 
        name: "COMPLAINT",              
        title: "Reklamation",         
        table: "COMPLAINT",                  
        idcolumn: "COMPLAINTID",                   
        rights: true,  
        history: true,  
        attribute: true,  
        selection: true,  
        modul: true,  
        keyword: ""
    }
    , {
        id: "14", 
        name: "OFFER",                  
        title: "Angebot",             
        table: "OFFER",                      
        idcolumn: "OFFERID",                       
        rights: true,  
        history: false, 
        attribute: true,  
        selection: true,  
        modul: true,  
        keyword: ""
    }
    , {
        id: "15", 
        name: "SALESORDER",             
        title: "Beleg",               
        table: "SALESORDER",                 
        idcolumn: "SALESORDERID",                  
        rights: true,  
        history: false, 
        attribute: true,  
        selection: true,  
        modul: true,  
        keyword: ""
    }
    , {
        id: "16", 
        name: "SALESPROJECT",           
        title: "Vertriebsprojekt",    					
        table: "SALESPROJECT",               
        idcolumn: "SALESPROJECTID",                
        rights: true,  
        history: true,  
        attribute: true,  
        selection: true,  
        modul: true,  
        keyword: ""
    }
    , {
        id: "17", 
        name: "LEADIMPORT",             
        title: "Leadimport",          
        table: "IMPORTDEV",                  
        idcolumn: "IMPORTDEVID",                   
        rights: true,  
        history: false, 
        attribute: true,  
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "18", 
        name: "BULKMAIL_DEFINITION",    
        title: "Serienmail",          
        table: "BULKMAILDEF",                
        idcolumn: "BULKMAILDEFID",                 
        rights: true,  
        history: true, 
        attribute: false, 
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "19", 
        name: "TASK_DATE",              
        title: "myADITO",             
        table: "",                           
        idcolumn: "",                              
        rights: false, 
        history: false, 
        attribute: false, 
        selection: false, 
        modul: false, 
          
        keyword: ""
    }
    , {
        id: "23", 
        name: "DBREPOSITORYADMIN",      
        title: "Repository-Manager",  
        table: "",                           
        idcolumn: "",                              
        rights: true,  
        history: false, 
        attribute: false,  
        selection: false, 
        modul: false, 
        keyword: ""
    }             
    , {
        id: "25", 
        name: "TABLEADMIN",             
        title: "Tabellenverwaltung",  
        table: "AOSYS_TABLEREPOSITORY",      
        idcolumn: "TABLEID",                       
        rights: true,  
        history: false, 
        attribute: false, 
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "29", 
        name: "COLUMNADMIN",            
        title: "Tabellenspalten",     
        table: "AOSYS_COLUMNREPOSITORY",     
        idcolumn: "COLUMNID",                      
        rights: true,  
        history: false, 
        attribute: false,  
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "30", 
        name: "OFFERITEM",              
        title: "Angebotsposten",      
        table: "OFFERITEM",                  
        idcolumn: "OFFERITEMID",                   
        rights: true,  
        history: false, 
        attribute: false,  
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "31", 
        name: "EVENT",                  
        title: "Veranstaltung",       
        table: "EVENT",                      
        idcolumn: "EVENTID",                       
        rights: true,  
        history: true,  
        attribute: true,  
        selection: false, 
        modul: true,  
        keyword: ""
    }
    , {
        id: "33", 
        name: "CONTRACT",               
        title: "Vertrag",    					
        table: "CONTRACT",                   
        idcolumn: "CONTRACTID",                    
        rights: true,  
        history: true,  
        attribute: true,  
        selection: true,  
        modul: true,  
        keyword: ""
    }
    , {
        id: "37", 
        name: "UNLINKEDMAILS",          
        title: "Unverknüpfte E-Mails", 
        table: "UNLINKEDMAIL",               
        idcolumn: "MAILID",                        
        rights: false, 
        history: false, 
        attribute: false, 
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "38", 
        name: "QUESTIONNAIRE",          
        title: "Interviewdefinition", 
        table: "QUESTIONNAIRE",              
        idcolumn: "QUESTIONNAIREID",               
        rights: true,  
        history: false, 
        attribute: false, 
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "40", 
        name: "PRODUCT",                
        title: "Produkt",             
        table: "PRODUCT",                    
        idcolumn: "PRODUCTID",                     
        rights: true,  
        history: false, 
        attribute: true,  
        selection: false, 
        modul: false, 
        keyword: ""
    } 
    , {
        id: "42", 
        name: "QUESTIONNAIRELOG",       
        title: "Interview",           
        table: "QUESTIONNAIRELOG",           
        idcolumn: "QUESTIONNAIRELOGID",            
        rights: true,  
        history: false, 
        attribute: false, 
        selection: true,  
        modul: true,  
        keyword: ""
    }
    , {
        id: "44", 
        name: "REPORT_ADMINISTRATION",  
        title: "Report Verwaltung",   
        table: "AOSYS_REPORTADMINISTRATION", 
        idcolumn: "AOSYS_REPORTADMINISTRATIONID",  
        rights: true,  
        history: false, 
        attribute: false, 
        selection: false, 
        modul: false, 
        keyword: ""
    }
    , {
        id: "47", 
        name: "EQUIPMENTINVENTORY",     
        title: "Ausrüstung",          
        table: "EQUIPMENTINVENTORY",         
        idcolumn: "EQUIPMENTINVENTORYID",          
        rights: true,  
        history: false, 
        attribute: true,  
        selection: true,  
        modul: true,  
        keyword: ""
    }                      
    , {
        id: "48", 
        name: "BANKACCOUNT",            
        title: "Bankdaten",           
        table: "BANKACCOUNT",                
        idcolumn: "BANKACCOUNTID",                 
        rights: true,  
        history: false, 
        attribute: true,  
        selection: true,  
        modul: true,  
        keyword: ""
    }                      
    , {
        id: "51", 
        name: "MACHINE",                
        title: "Maschine",            
        table: "MACHINE",                    
        idcolumn: "MACHINEID",                     
        rights: true,  
        history: true,  
        attribute: true,  
        selection: true,  
        modul: true,  
        keyword: ""
    }                      
    , {
        id: "52", 
        name: "SERVICEORDER",           
        title: "Serviceauftrag",      
        table: "SERVICEORDER",               
        idcolumn: "SERVICEORDERID",                
        rights: true,  
        history: true,  
        attribute: true,  
        selection: true,  
        modul: true,  
        keyword: ""
    } 

    // Achtung! Bei Anpassungen fuer Projekte mit kundenspezifischen Frames ID-Nummbern ab 101 aufwaerts vergeben! 
    // Alle Nummern von 0-100 einkl. sind fuer ADITO-interne Standardframes reserviert!
    ];

  
    //        access method to retrieve properties of frame objects
    //        or complete frame objects by using a simple filter
    this.getData = function(pProperty, pValue, pFields)
    {
        var list = [];   // the result set array
        var fl = pFields && pFields.length;  // did we specify pFields or not

        for(var i = 0; i < this.frameData.length; i++)   // go search our frames
        {
            if(this.frameData[i][pProperty] == pValue)   // if we have a match
            {
                var res = [];   // result set array for inner loop

                if(fl > 0)   // pFields was specified, so create value list
                {
                    for(j=0; j < pFields.length; j++)
                    {
                        if ( pFields[j] == "title" ) 	res.push( a.translate(this.frameData[i][pFields[j]] ) );
                        else	res.push( this.frameData[i][pFields[j]] );
                    }
                }
                else   // no pFields, yield the complete frame object
                {
                    res = this.frameData[i];
                }

                list.push( res );   // push onto result array
            }
        }		
        return list;  // return resulting array or empty array
    }

    //        synonym wrapper to load the complete frame object,
    //        works exactly as getData() without the third parameter]

    this.getFrame = function(pProperty, pValue)
    {
        return this.getData(pProperty, pValue);
    }
    /*
        return the framname 
   */
    this.getFrameName = function(pID)
    {
        return this.getData("id", pID, ["name"]);
    }
    /*
        return the frameid 
   */
    this.getFrameID = function(pName)
    {
        return this.getData("name", pName, ["id"]);
    }
}

/*
* Prüft die Anzahl der Datensätze. 
*   Bei Null Datensätzen wird der Frame geschlossen. 
*   Wird in der Regel im Prozess nach Start in den Frames verwendet.
* 
* @return {void}
*/
function checkRowCount()
{
    var wm = a.valueof("$sys.workingmode");
    if(wm != a.FRAMEMODE_EDIT && wm != a.FRAMEMODE_NEW && a.valueof("$sys.datarowcount") == "0")
    {
        a.showMessage(a.translate("Datensatz konnte nicht geladen werden.\n\nSie haben keine Berechtigung für diesen Datensatz oder die Bedingung ist ungültig."));
        a.closeCurrentTopImage();
    }
}