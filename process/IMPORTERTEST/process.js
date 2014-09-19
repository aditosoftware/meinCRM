import("IMPORTER")

// sample configurations for imports, from "BEGIN SAMPLES" to "END SAMPLES"
// BEGIN SAMPLES

var democonfig = {
    IdQuery : "select firmaid from firma where rownum < 5",
    IdColumn: "firmaid",
    DataQuery : "select firmaid, name1, name2, strasse, region_neu, istdepotbank, web, tel, plz from firma where $$id ",
    AliasFrom : "Oracle",
    AliasTo: "AO_DATEN",
			
    ImportCommand: "insert",
		
    Mapping : [ 		
    [iNewID, {
        Target: "RELATION.RELATIONID", 
        Key: true
    } ]
    , [iNewID, {
        Target: "ORG.ORGID", 
        Key: true
    } ]
    , [iJoin, {
        Source: [1,2], 
        Delimiter: "\n", 
        Target: "ORG.ORGNAME"
    } ]
    , [iMove, {
        Source: 3, 
        Target: "ADDRESS.ADDRESS"
    } ]
    , [iKeyword, {
        Source: 4, 
        Keytype: "bundesland", 
        Target: "ADDRESS.STATE"
    } ]
    , [iCopy, {
        Source: "ORG.ORGID", 
        Target: "RELATION.ORG_ID"
    } ]
    , [iStore, {
        Value: "IMPORTER", 
        Target: "RELATION.USER_NEW"
    } ]
    , [iStore, {
        Value: "IMPORTER", 
        Target: "ORG.USER_NEW"
    } ]
    , [iStore, {
        Value: "IMPORTER", 
        Target: "ADDRESS.USER_NEW"
    } ]
    , [iStore, {
        Value: "1", 
        Target: "ADDRESS.ADDR_TYPE"
    } ]
    , [iSql, {
        Command: "select ort from firma where firmaid = {0}", 
        Alias: "Oracle", 
        Target: "ADDRESS.CITY"
    } ]
    , [iAttribute, {
        Source: 5, 
        Attribute: "betreuung.depotbank", 
        Type: 1, 
        Rowid: "RELATION.RELATIONID"
    } ] 
    , [iWord, {
        Source: 1, 
        Regex: /\s+/, 
        Target: "ADDRESS.BUILDINGNO", 
        Index: 8
    } ]
    , [iComm, {
        Source: 6, 
        Medium: 4, 
        Rowid: "RELATION.RELATIONID"
    } ]  
    , [iComm, {
        Source: 7, 
        Medium: 1, 
        Rowid: "RELATION.RELATIONID", 
        Standard: true
    } ]  
    , [iInsert, {
        Table: "regtab", 
        Alias: "AO_DATEN", 
        Columns: [ {
            Name: "REGTABID", 
            Key: true
        }
        , {
            Name: "USER_NEW", 
            Value: "IMPORTER"
        }
        , {
            Name: "AOROLE_ID", 
            Value: "42"
        }
        , {
            Name: "REGTAB", 
            Source: 8
        } ]  
    } ]
	      
    ]
};


var fileconfig = {
    AliasTo: "AO_DATEN",
    DataFile: "C:/tmp/materialien.csv",
    SkipRows: 1,
    RowSeparator: "\r\n",
    ColumnSeparator: ";",
    StringDelimiter: "'",
			
    ImportCommand: "insert",
		
    Mapping : [ 		
    [iNewID, {
        Target: "RELATION.RELATIONID", 
        Key: true
    } ]
    , [iNewID, {
        Target: "PERS.PERSID", 
        Key: true
    } ]
    , [iMove, {
        Source: 1, 
        Target: "PERS.FIRSTNAME"
    } ]
    , [iMove, {
        Source: 0, 
        Target: "RELATION.ZIP"
    } ]
    , [iMove, {
        Source: 2, 
        Target: "RELATION.CITY"
    } ]
    ]
};


var fileupdater = {
    AliasTo: "AO_DATEN",
    DataFile: "C:/tmp/ctilog.csv",
    SkipRows: 1,
    RowSeparator: "\r\n",
    ColumnSeparator: ";",
    StringDelimiter: "'",
			
    ImportCommand: "insert+update",
		
    Mapping : [ 		
    [iNewID, {
        Target: "CTILOG.CTILOGID"
    } ]
    , [iMove, {
        Source: 0, 
        Target: "CTILOG.ADDRESS"
    } ]
    , [iMove, {
        Source: 1, 
        Target: "CTILOG.ANSWERMODE", 
        Key: true
    } ]
    , [iTimestamp, {
        Source: 2, 
        Target: "CTILOG.DATE_NEW", 
        Format: "yyyy-MM-dd HH:mm:ss"
    } ]
    ]
};


var csvtestconfig = {
    AliasTo: "AO_DATEN",
    DataFile: "C:/Daten/CurrentProject/Kundenstamm-Streit.csv",
    SkipRows: 1,
    RowSeparator: "\n",
    ColumnSeparator: ";",
    StringDelimiter: "",
			
    ImportCommand: "insert",
		
    Mapping : [ 		
    [iNewID, {
        Target: "RELATION.RELATIONID", 
        Key: true
    } ]
    , [iNewID, {
        Target: "ORG.ORGID", 
        Key: true
    } ]
    , [iJoin, {
        Source: [3,4], 
        Delimiter: " ", 
        Target: "ORG.ORGNAME"
    } ]
    , [iMove, {
        Source: 9, 
        Target: "RELATION.ADDRESS"
    } ]
    , [iMove, {
        Source: 6, 
        Target: "RELATION.ZIP"
    } ]
    , [iMove, {
        Source: 5, 
        Target: "RELATION.CITY"
    } ]
    , [iMove, {
        Source: 2, 
        Target: "RELATION.COUNTRY"
    } ]
    , [iMove, {
        Source: 1, 
        Target: "ORG.CUSTOMERCODE"
    } ]
    , [iStore, {
        Value: "1", 
        Target: "RELATION.AOTYPE"
    } ]
    , [iStore, {
        Value: "IMPORTER", 
        Target: "RELATION.USER_NEW"
    } ]
    , [iStore, {
        Value: "IMPORTER", 
        Target: "ORG.USER_NEW"
    } ]
    , [iStore, {
        Value: "1", 
        Target: "RELATION.ADDR_TYPE"
    } ]
    , [iAttribute, {
        Source: 5, 
        Attribute: "betreuung.depotbank", 
        Type: 1, 
        Rowid: "RELATION.RELATIONID"
    } ] 
    ]
};


var imgconfig = {
    IdQuery : "select id from asys_binaries where containername = 'BULKMAILATTACHMENT' ",
    DataQuery : "select id, filename from asys_binaries where $$id   union select '2333939394', 'urga.poff' ",	
    IdColumn : "id",
    AliasFrom : "AO_DATEN",
    AliasTo: "AO_DATEN",
		
    ImportCommand: "insert+update",
		
    Mapping : [ 		
    [iMove,   {
        Source: 0, 
        Target: "ASYS_BINARIES.ID", 
        Key: true
    } ]
    , [iMove,   {
        Source: 1, 
        Target: "ASYS_BINARIES.FILENAME"
    } ]
    , [iPersRelation, {
        Source: 0
    } ]
    ]
};



var updconfig = {
    IdQuery : "select firmaid from firma where rownum < 5",
    DataQuery : "select firmaid, name1, name2, strasse, region_neu from firma where $$id ",
		
    AliasFrom : "Oracle",
    AliasTo: "AO_DATEN",
		
    ImportCommand: "update",
		
    Mapping : [ 		
    [iStore,   {
        Value: 8955, 
        Target: "ORG.ORGID", 
        Key: true
    } ]
    , [iStore,   {
        Value: "DEMO", 
        Target: "ORG.USER_NEW"
    } ]
    , [iStore,   {
        Value: "Hallo", 
        Target: "ORG.CUSTOMERCODE"
    } ]
    ]
};


var testconfig = {
    IdQuery : "select top 1 orgid from org ",
    IdColumn : "orgid",
    DataQuery : "select 'Das ist die Hausnummer 42' from org where $$id",
		
    AliasFrom : "AO_DATEN",
    AliasTo: "AO_DATEN",
		
    ImportCommand: "insert",
		
    Mapping : [ 		
    [iWord, {
        Source: 0, 
        Target: "ORG.ORGNAME", 
        Regex: " ", 
        Index: -2, 
        Substring: "left"
    } ]
    , [iWord, {
        Source: 0, 
        Target: "ORG.ORGNAME", 
        Regex: " ", 
        Index: -2, 
        Substring: "right"
    } ]
    , [iWord, {
        Source: 0, 
        Target: "ORG.ORGNAME", 
        Regex: " ", 
        Index: 3, 
        Substring: "left"
    } ]
    , [iWord, {
        Source: 0, 
        Target: "ORG.ORGNAME", 
        Regex: " ", 
        Index: 3, 
        Substring: "right"
    } ]
    ]
		
};
		
		
var arrayconfig = {
    DataFunction : function (pBatchNum, pBatchSize) 
    { 
        if(pBatchNum > 1) 
            return null; 
        else 
            return [ ["0", "Rabenweg 6a", 42, date.date() ]
            , ["0", "Von-Beckers-Str. 1", 42, date.date() ] ]; 
    } ,

    AliasTo: "AO_DATEN",
			
    ImportCommand: "insert",
		
    Mapping : [ 		
    [iMove, {
        Value: "Hallo, Welt!!", 
        Target: "RELATION.CITY"
    } ]
    , [iMove, {
        Value: "{1}", 
        Target: "RELATION.AOTYPE"
    } ]
    , [iDecode, {
        Value: "deutschland", 
        List: "frankreich;FR;deutschland;DE;italien;IT", 
        Target: "RELATION.RELTITLE"
    } ]
 
    , [iWord, {
        Source: 1, 
        Target: "RELATION.ADDRESS", 
        Index: -2, 
        Regex: " ", 
        Substring: "left"
    } ] 
    , [iWord, {
        Source: 1, 
        Target: "RELATION.BUILDINGNO", 
        Index: -1, 
        Regex: /\s+/
    } ]  
    
    , [iWord, {
        Value: "Demel Strasse 23", 
        Index: -1, 
        Regex: /\s+/, 
        Target: "VAR.ZEUG"
    } ]
    , [iInsert, {
        Alias: "AO_DATEN", 
        Table: "COMM",
        Columns: [ {
            Name: "COMMID", 
            Key: true
        }
        , {
            Name: "ADDR", 
            Required: true, 
            Value: "{VAR.ZEUG}"
        }
        , {
            Name: "MEDIUM_ID", 
            Source: 2
        } ]
    } ]

    ]
};




// ======== main import code ========

log.log("\n\n\n");

// create new importer instance
var imp = new Importer( arrayconfig );  

// set log output, default (undefined or empty string) is server console
imp.Log = "";  

// set the username for imported records
imp.ImportUser = "SYSTEM";

// set processing options
// default for preview is FALSE, set to TRUE for what-if output
imp.Preview = true;  

// more verbose output, default is FALSE
imp.Debug = true;   
imp.DebugCallback = mydebugFunction;


// set batch size for import, adjust this for your system
imp.BatchSize = 50;

// process import configuration!
imp.process();


/*
* Debug-Funktion, welche die Debug-Ausgaben ins Debug-Log schreibt.
*
* @param {[]} pOutputBuffer req Debug-Ausgaben
*
* @return {void}
*/
function mydebugFunction(pOutputBuffer)
{
    log.log("=====================================================");
    for(var k in pOutputBuffer)
    {
        log.log(k + ": " + pOutputBuffer[k]);
    }
    log.log("=====================================================");
}

/*
* Zeigt das Vorankommen des Programms an indem ein Log-Eintrag erstellt wird.
* 
* @return {void}
*/
function myprogressFunction()
{
    log.log("\nPling!\n");
}


// end