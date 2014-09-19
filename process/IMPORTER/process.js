// IMPORTER PROCESS 
/*
* the importer class, main object
* @param {String []} pConfig req ( Name, FunktionsArt, Details )
*
* @return {void}
*/	
function Importer(pConfig)
{
    var batchNum = 0;
    var batchStart = 0;
    var batchList;
    var idlist = [];
    var mappingtimer = [];
    var exectimer = {
        insertData: 0, 
        updateData: 0, 
        outbuffer: 0, 
        logging: 0, 
        getdata: 0
    };
    var startTime;
    var stopTime;
    var logbuffer = [];

    this.insertArray = [];
    this.updateArray = [];
	
    this.LogLevels = {
        Minimal: 0,
        Error : 1,
        Warning : 2,
        Info : 3,
        Debug : 4,
        Preview : 5
    };
	                   
    this.Cases = {
        Lower: 0,
        Upper: 1
    };
	
    this.Config = pConfig;
    this.BatchSize = 50;
    this.MaxRows = 0;
    this.Preview = false;
    this.Debug = true;
    this.Log = "";
    this.LogLevel = this.LogLevels.Info;
    this.InputRecord = new Array();
    this.OutputRecord = new Object();
    this.ImportUser = "IMPORTER";
    this.FuncBuffer = new Object();
    this.CompleteUpdate = false;
    this.ErrorLog = "";
    this.DataType = null;  
    this.KeyColumn = new Object();  // contains key info as in KeyColumn["tbl.col"] = "I" | "U" | "I+U"
    this.UseAOType = true; //default true, so that AOType will be uses (for older systems)
    this.UseUUID = true; //default false, so that a.getNewID() instead of a.getNewUUID() would be uses
    this.TableCase = this.Cases.Upper; //default is uppercase
    this.ColumnCase = this.Cases.Upper; //default is uppercase

    this.process = function()
    {
        var i;
        var t;
        var pkid;
        var c;
        var cond;
        var s;
        
        var pImporter = this;
		
        var totalCount = 0;
        var skipCount = 0;
        var updateCount = 0;
        var insertCount = 0;
        var unchangedCount = 0;
		
        var daten;
        var skip;
        var headercount = 0;
        var batchlist = [];
        var idcolumn;
        var importtype = "S";        // F,S or M for "file", "single" or "multi" batch, default to single batch
        totalCount = 0;          // number of records processed
        batchStart = 0;              // current batch start index
        var logstring = "";          // contains the log file, if not writing to server log
        var requiredTargets = new Object();   // stores the required target columns

        // prepare logging stuff
        if(this.Log != "" && this.Log != undefined && this.Log.split(".")[0] == "$global") a.globalvar(this.Log, "");	
        if(this.Preview == true) this.LogLevel = this.LogLevels.Preview;
        logbuffer = [];

        startTime = date.date();
        s = date.longToDate(startTime, "yyyy-MM-dd HH:mm:ss", "UTC");
        this.writeLog(this.LogLevels.Minimal, "Started at " + s + " (UTC)");
        log.log("[IMPORT] Start at " + s + " UTC");
        if(this.Preview) this.writeLog(this.LogLevels.Info, "======== import running in preview mode ========");

        this.writeLog(this.LogLevels.Debug, "Building mapping tables.");

        // get all column type from all tables of the target alias
        this.DataType = this.getDataTypes(this.Config.AliasTo);  

        // build an object with the data types for each column and
        // check for key fields and collect them in parmObject.KeyRecord
        for(i=0; i < this.Config.Mapping.length; i++)
        {
            mappingtimer[i] = 0;  // init mapping timer
			
            var target = this.Config.Mapping[i][1]["Target"];

            if(target != undefined && target.substr(0,4).toLowerCase() != "var.")  // exclude var storage
            {
                // collect a required target, if we find one (these columns must not be empty)
                requiredTargets[target] = (this.Config.Mapping[i][1]["Required"] == true);

                // collect all key columns in an object array
                // KeyColumn[table ][column] = action1;action2...
                var coldata = target.split(".");
				
                if(this.Config.Mapping[i][1]["Key"] != undefined)  //2009-05-13  TR  changed, because on insertcommand "insert" or "update" there can be no Action
                {
                    if(this.KeyColumn[ this.getTableCase(coldata[0]) ] == undefined) this.KeyColumn[ this.getTableCase(coldata[0]) ] = new Object();
                    if(this.KeyColumn[ this.getTableCase(coldata[0]) ][ this.getColumnCase(coldata[1]) ] == undefined) this.KeyColumn[ this.getTableCase(coldata[0]) ][ this.getColumnCase(coldata[1]) ] = "key";
					
                    this.setDefaultAction(this.Config.Mapping[i][1]);
										
                    this.KeyColumn[ this.getTableCase(coldata[0]) ][ this.getColumnCase(coldata[1]) ] = this.KeyColumn[ this.getTableCase(coldata[0]) ][ this.getColumnCase(coldata[1]) ] + ";" + this.Config.Mapping[i][1]["Action"];
                }
            }
        }
		
        idlist = this.createIDList();
        batchNum = 0;
        totalCount = 0;
        headercount = this.Config.HeaderLines;
        if(headercount == undefined) headercount = 0;

        this.writeLog(this.LogLevels.Warning, "Beginning data import.");

        // main loop
        while(daten = this.getNextBatch(this.Config), daten != null )
        {		
            this.writeLog(this.LogLevels.Info, "Processing batch #" + batchNum);
						
            // import each row of the current batch
            for(var bi=0; bi < daten.length; bi++)
            {
                // skip empty data rows
                if(daten[bi].length == 1 && daten[bi][0] == "") 
                {
                    if(this.Debug == true) {
                        this.writeLog(this.LogLevels.Debug, "Skipping empty row " + bi);
                    }
                    continue;
                }
								
                totalCount++;
                skip = false;       
				
                // skip header rows (usually file import only)
                if(bi < headercount)  
                {
                    if(this.Preview == true && this.Debug == true) 
                    {
                        this.writeLog(this.LogLevels.Debug, "Skipping header row " + bi);
                    }
                    continue;
                }
				
                this.writeLog(this.LogLevels.Debug, "Row " + bi);
				
                this.InputRecord = daten[bi];       // assign input fields for this record
                this.OutputRecord = new Object();   // clear output fields for this record		
						
                // call mapping functions
                for(i=0; i < this.Config.Mapping.length; i++)
                {
                    try
                    {
                        var fname = this.Config.Mapping[i][0].toString();
                        fname = fname.split(/\s+/);
                        fname = fname[2].split("(")[0];

                        this.writeLog(this.LogLevels.Debug, "Calling mapping function " + fname);

                        // call mapping function and time it
                        t = date.date();
                        var mapresult = this.Config.Mapping[i][0].call(this, this.Config.Mapping[i][1]);
                        t = date.date() - t;
                        mappingtimer[i] += t;

                        // if the mapping did not succeed, log function and ID value
                        if(mapresult == false)  
                        {
                            this.writeLog(this.LogLevels.Error, "Mapping function " + fname + " failed for row " + totalCount);
                            skip = true;
                        }
                    }
                    catch(ex)
                    {
                        this.writeLog(this.LogLevels.Error, "Exception in mapping function [" + fname + "] for input row " + totalCount);
                        log.log(ex);
                        skip = true;
                    }
                }                 


                if(skip == false)  // do we continue with this record?
                {
                    // if a debug callback function has been defined, call it
                    if(this.DebugCallback != null && typeof(this.DebugCallback) == "function")
                    {
                        this.DebugCallback(this.OutputRecord);
                    }
				
				
                    var tt = date.date();
					
                    var outdata = new Object();
					
                    for(var tbl in this.OutputRecord)  // loop thru all output tables
                    {
                        for(var col in this.OutputRecord[ tbl ])  // loop thru all output columns
                        {
                            if(tbl.toLowerCase() != "var")   // exclude var storage
                            {
                                for(var action in this.OutputRecord[tbl][col])
                                {
                                    if(outdata[tbl] == undefined) outdata[tbl] = "";
                                    outdata[tbl] = outdata[tbl] + ";" + action;
									
                                    // check for required data mappings and set skip again, we check this later
                                    skip = (requiredTargets[tbl + "." + col] == true && (this.OutputRecord[tbl][col][action] == undefined || this.OutputRecord[tbl][col][action] == ""));
                                }
                            }
                        }
                    }
					
                    tt = date.date() - tt;
                    exectimer["outbuffer"] += tt;
				
                    // loop thru all distinct tables, maybe we have more than one record to write
                    for(t in this.OutputRecord)
                    {
                        var spalten = [];
                        var typen = [];
                        var werte = [];
						
                        // we do insert-for-new and update-for-existing
                        if(skip == false && this.Config.ImportCommand == "insert+update")
                        {
                            pkid = "0";  // assume we do not find an existing record

                            // if no key values have been specified, there is no need to check
                            // so we do an insert
                            if(this.KeyColumn[t] != undefined ) 
                            {
                                // check for existing data row based on key values
                                cond = this.generateKeyCondition(t);
                                var sql = "select count(*) from " + t + " where " + cond;
                                this.writeLog(this.LogLevels.Debug, "Insert/Update decision for table " + t + " based on: " + cond);
                                pkid = a.sql(sql, this.Config.AliasTo);
                            }		
							
                            if(t.toLowerCase() != "var") 
                            {				
                                if(this.DataType[t] == undefined) this.writeLog(this.LogLevels.Error, "Table " + t + " not exist in database");
                                else
                                {
                                    for(c in this.OutputRecord[t])
                                    {						
                                        if(this.OutputRecord[t][c]["I+U"] != undefined && this.OutputRecord[t][c]["I+U"] != "" && this.OutputRecord[t][c]["I+U"] != null)
                                        {
                                            if(this.DataType[t][c] != undefined)
                                            {
                                                spalten.push(c);
                                                typen.push(this.DataType[t][c]);
                                                werte.push(this.OutputRecord[t][c]["I+U"]);
                                            }
                                            else
                                                this.writeLog(this.LogLevels.Error, "Column " + c + " not exist in table " + t);
                                        }
                                    }
                                }
                            }
                            if(pkid != "0")  // exists
                            {
                                if(t.toLowerCase() != "var")
                                {
                                    if(this.DataType[t] == undefined) this.writeLog(this.LogLevels.Error, "Table " + t + " not exist in database");
                                    else
                                    {
                                        for(c in this.OutputRecord[t])
                                        {
                                            if(this.OutputRecord[t][c]["U"] != undefined && this.OutputRecord[t][c]["U"] != "" && this.OutputRecord[t][c]["U"] != null 
                                                && this.OutputRecord[t][c]["I+U"] == undefined)
                                                {
                                                if(this.DataType[t][c] != undefined)
                                                {
                                                    spalten.push(c);
                                                    typen.push(this.DataType[t][c]);
                                                    werte.push(this.OutputRecord[t][c]["U"]);
                                                }
                                                else
                                                    this.writeLog(this.LogLevels.Error, "Column " + c + " not exist in table " + t);
                                            }
                                        }
                                    }
                                }
								
                                if(!this.updateData(t, spalten, typen, werte, cond, this.Config.AliasTo)) skip = true;
                            }
                            else
                            {
                                if(t.toLowerCase() != "var")
                                {
                                    if(this.DataType[t] == undefined) this.writeLog(this.LogLevels.Error, "Table " + t + " not exist in database");
                                    else
                                    {
                                        for(c in this.OutputRecord[t])
                                        {					
                                            if(this.OutputRecord[t][c]["I"] != undefined && this.OutputRecord[t][c]["I"] != "" && this.OutputRecord[t][c]["I"] != null 
                                                && this.OutputRecord[t][c]["I+U"] == undefined) 
                                                {
                                                if(this.DataType[t][c] != undefined)
                                                {
                                                    spalten.push(c);
                                                    typen.push(this.DataType[t][c]);
                                                    werte.push(this.OutputRecord[t][c]["I"]);
                                                }
                                                else
                                                    this.writeLog(this.LogLevels.Error, "Column " + c + " not exist in table " + t);
                                            }
                                        }
                                    }
                                }
								
                                if(!this.insertData(t, spalten, typen, werte, this.Config.AliasTo)) skip = true;
                            }
                        }
						
                        // we do an insert
                        if(skip == false && this.Config.ImportCommand == "insert")
                        {
                            if(t.toLowerCase() != "var")
                            {
                                if(this.DataType[t] == undefined) this.writeLog(this.LogLevels.Error, "Table " + t + " not exist in database");
                                else
                                {
                                    for(c in this.OutputRecord[t])
                                    {
                                        if(this.DataType[t][c] != undefined)
                                        {
                                            spalten.push(c);
                                            typen.push(this.DataType[t][c]);
                                            werte.push(this.OutputRecord[t][c]["I"]);
                                        }
                                        else
                                            this.writeLog(this.LogLevels.Error, "Column " + c + " not exist in table " + t);
                                    }
                                }
                            }

                            if(!this.insertData(t, spalten, typen, werte, this.Config.AliasTo)) skip = true;
                        } 
						
                        // we do an update?
                        if(skip == false && this.Config.ImportCommand == "update")
                        {
                            if(t.toLowerCase() != "var")
                            {
                                if(this.DataType[t] == undefined) this.writeLog(this.LogLevels.Error, "Table " + t + " not exist in database");
                                else
                                {
                                    for(c in this.OutputRecord[t])
                                    {
                                        if(this.DataType[t][c] != undefined)
                                        {
                                            spalten.push(c);
                                            typen.push(this.DataType[t][c]);
                                            werte.push(this.OutputRecord[t][c]["U"]);
                                        }
                                        else
                                            this.writeLog(this.LogLevels.Error, "Column " + c + " not exist in table " + t);
                                    }
                                }
                            }
							
                            // create condition by looking for key fields
                            cond = this.generateKeyCondition(t);

                            if(!this.updateData(t, spalten, typen, werte, cond, this.Config.AliasTo)) skip = true;
                        }
                    }		
                }
				
                // this is *not* the else-branch for the if above, because we may change the value for "skip"
                // even it was false when comparing in the "if" above. so we check this here in a separate
                // if to get all occurrences of skipped import rows.
                if(skip == true) skipCount++;

                //Now insert/update all Columns
                if(!skip)
                {
                    try
                    {
                        if(this.insertArray.length > 0)
                        {
                            a.sqlInsert(this.insertArray, this.Config.AliasTo);
                            insertCount++;
                        }
            
                        if(this.updateArray.length > 0)
                        {
                            a.sqlUpdate(this.updateArray, this.Config.AliasTo);
                            updateCount++;
                        }
                    }
                    catch(ex)
                    {
                        this.writeLog(this.LogLevels.Error, "Error at Insert/Update!");
                        log.log(ex);
                        skipCount++;
                    }
          
                    //Clear Arrays
                    this.insertArray = [];
                    this.updateArray = []; 
                }

                // if a progress callback function has been defined, call it
                if(this.ProgressCallback != null && typeof(this.ProgressCallback) == "function")
                {
                    this.ProgressCallback(skip);
                }			
				
                if(this.MaxRows > 0 && totalCount >= this.MaxRows)
                {
                    break;
                }
            }  // end for (row of currewarsnt batch)

            if(this.MaxRows > 0 && totalCount >= this.MaxRows)
            {
                break;
            }
        }

        this.writeLog(this.LogLevels.Minimal, "Total: " + totalCount + ", Skipped: " + skipCount + ", Inserted: " + insertCount + ", Updated: " + updateCount + ", Unchanged: " 
            + (Number(totalCount) - Number(insertCount) - Number(updateCount) - Number(skipCount)));
        log.log("Total: " + totalCount + ", Skipped: " + skipCount + ", Inserted: " + insertCount + ", Updated: " + updateCount + ", Unchanged: " 
            + (Number(totalCount) - Number(insertCount) - Number(updateCount) - Number(skipCount)));

        stopTime = date.date();

        this.showTimings();		

        s = date.longToDate(stopTime, "yyyy-MM-dd HH:mm:ss", "UTC");
        this.writeLog(this.LogLevels.Minimal, "End at " + s + " UTC");
        log.log("[IMPORT] End at " + s + " UTC");			
    }

    //	show timing information
    this.showTimings = function()
    {
        var mappingtotal = 0;
        for(var i=0; i < this.Config.Mapping.length; i++)
        {
            mappingtotal += mappingtimer[i];
        }

        this.writeLog(this.LogLevels.Warning, "Total run time: " + ((stopTime - startTime) / 1000) + " seconds.");
		
        for(var k in exectimer)
        {
            this.writeLog(this.LogLevels.Info, "Total " + k + " time: " + (exectimer[k] == "0" ? "<1" : exectimer[k]) + " ms ");
        }
		
        this.writeLog(this.LogLevels.Warning, "Total map time: " + (mappingtotal / 1000) + " seconds.");
		
        for(i=0; i < this.Config.Mapping.length; i++)
        {
            var fname = this.Config.Mapping[i][0].toString();
            fname = fname.split(/\s+/);
            fname = fname[2].split("(")[0];
            this.writeLog(this.LogLevels.Info, "Mapping #" + i + " " + fname + ": " + (mappingtimer[i] == "0" ? "<1" : mappingtimer[i]) + " ms ");
        }
    }

    //		this function yields the next batch of data to import.
    this.getNextBatch = function(pConfig)
    {
        var tt = date.date();  // exec timer
        var result;
        var bs;
        var daten;
		
        this.writeLog(this.LogLevels.Debug, "Executing getNextBatch()");
        batchNum++;
		
        var impmode;
		
        if(pConfig.DataFile != undefined)
            if(pConfig.DataFile.substr(pConfig.DataFile.length-3, pConfig.DataFile.length) == 'xml') //is the file an xml file? then use xml-mode
                impmode = "xml";
            else
                impmode = "file";
        else
        if(pConfig.XMLObject != undefined)
            impmode = "xml";
        else
        if(pConfig.DataFunction != undefined)
            impmode = "array";
        else
            impmode = "table";
				
				
        switch(impmode)
        {
            case "xml":
                if(batchNum > 1) return null;	// we read files in one sweep
            
                if(this.Debug == true) this.writeLog("Getting input xml " + pConfig.DataFile, false, 3);
                // file import, which is always a single batch operation
                importtype = "F";
                var strXML;
            
                // get xml-string directly or load from file?
                if(pConfig.DataFile != "")
                    strXML =	this.getFileContent(pConfig.DataFile, a.DATA_TEXT); //load from file
                else
                    strXML = pConfig.XMLObject; //get xml-string
            
                if(strXML != "" && strXML != undefined)
                {
                    var xmlData = new XML(strXML);
                    result = [];
                    var xmlArr = [];
							
                    //get every row-element
                    for each(xmlItem in xmlData.data.row)
                    {           
                        xmlArr = [];
	            	
                        for each(xmlItem2 in xmlItem.column)
                            xmlArr.push(xmlItem2);
		            	
                        result.push(xmlArr);
                    }
                }
                else
                    this.writeLog("XML-Data is empty or undefined!", false, 0);
            
                return result;
                break;
		
            case "file":
                if(batchNum > 1) return null;	// we read files in one sweep

                if(this.Debug == true) this.writeLog("Reading input file " + pConfig.DataFile, false, 3);
                // file import, which is always a single batch operation
                importtype = "F";
					
                // otherwise, load the file
                var filestring = this.getFileContent(pConfig.DataFile, a.DATA_TEXT);
                var rs = pConfig.RowSeparator;
                if(rs == undefined) rs = "\n";
                var cs = pConfig.ColumnSeparator;
                if(cs == undefined) cs = ",";
                var sd = pConfig.StringDelimiter;
                if(sd == undefined) sd = "";
					
                result = a.parseCSV(filestring, rs, cs, sd);
                tt = date.date() - tt;
                exectimer["getdata"] += tt;
                return result;
                break;
					
            case "array":
                bs = this.BatchSize;
                if(bs == undefined) bs = 0;
					
                result = this.Config.DataFunction(batchNum, bs);
                tt = date.date() - tt;
                exectimer["getdata"] += tt;
                return result;
                break;
					
            case "table":
                // table import
                bs = this.BatchSize;
                if(bs == undefined) bs = 0;
                if(bs > 0 && this.Config.IdQuery != undefined && this.Config.IdColumn != undefined)
                {
                    if(batchStart < idlist.length)  // as long as we got something to do
                    {
                        batchList = idlist.slice(batchStart, batchStart + bs);
                        batchStart += bs;
					
                        // get data of the next batch
                        var sql = this.Config.DataQuery.replace(/\$\$id/i, idcolumn + " IN ('" + batchList.join("','") + "')" );
                        daten = a.sql(sql, this.Config.AliasFrom, a.SQL_COMPLETE);
                    }
                    else
                    {
                        daten = null;
                    }
                }
                else
                {
                    // return complete result set
                    if(batchNum > 1) 
                        daten = null; 
                    else
                        daten = a.sql(this.Config.DataQuery, this.Config.AliasFrom, a.SQL_COMPLETE);
                }

                tt = date.date() - tt;
                exectimer["getdata"] += tt;
                return daten;
                break;
        }	
    }


    this.createIDList = function()
    {
        var tt = date.date();   // exectimer
        var result;
		
        if(pConfig.IdQuery != undefined && pConfig.DataQuery != undefined && pConfig.IdColumn != undefined)
        {
            // set the id column for the batch retrieval
            idcolumn = this.Config.IdColumn;
			
            // set multi-batch import
            importtype = "M";
			
            // get the list of primary keys
            result = a.sql(pConfig.IdQuery, pConfig.AliasFrom, a.SQL_COLUMN);
            tt = date.date() - tt;
            exectimer["getdata"] += tt;
        }
        return result;
    }
	
    //	@param String pMessage -- die Meldung, die geloggt werden soll
    //	@param String pLevel 
    this.writeLog = function(pLevel, pMessage)
    {
        var tt = date.date();
		
        // if logging has been "oursourced", just call the callback function and do nothing
        if(this.LogCallback != null && typeof(this.LogCallback) == "function")
        {
            this.LogCallback(pLevel, pMessage);
        }
        else if(pLevel <= this.LogLevel) 		// shall we output this message?
        {
            var logprefix = "[IMPORTER]@" + date.longToDate(date.date(), "yyyy-MM-dd HH:mm:ss", "UTC") + " UTC: ";
            var logline = logprefix + pMessage;
			
            logbuffer.push(logline);
			
            if(this.Log == "LOGFILE")
            {
                log.log(logline);
            }
            else
            {
                if(this.Log == "CONSOLE")
                {
                    log.log(logline);
                }
                else if(this.Log != "" && this.Log != undefined)
                {
                    // log in globalvar
                    if(this.Log.split(".")[0].toLowerCase() == "$global")
                    {
                        var s = logline + "\r\n";
                        a.globalvar(this.Log, a.valueof(this.Log) + s);
                    }
                    else
                    {
                        // log to a file
                        try
                        {
                            if(this.isClientProcess() == true)   // use doClientIntermediate
                            {
                                result = a.doClientIntermediate(a.CLIENTCMD_STOREDATA, [this.Log, logline + '\r\n', a.DATA_TEXT, true]);
                            }
                            else   // use fileIO
                            {
                                result = fileIO.storeData(this.Log, logline + '\r\n', a.DATA_TEXT, true);
                            }
                        }
                        catch(ex)
                        {
                            log.log(ex);
                            log.log("Unable to write log message: " + logline);
                        }
                    }
                }	
            }
        }
		
        tt = date.date() - tt;
        exectimer["logging"] += tt;
    }
	
	
    //	retrieve all log messages currently in log buffer
    this.getLogMessages = function()
    {
        return logbuffer;
    }

    // return true, if running in client context, false for a server context
    this.isClientProcess = function()
    {
        var result = true;
        if (a.hasvar("$sys.clientid"))
        {
            result = a.valueof("$sys.clientid") != "";
        }
        else
        {
            result = false;
        }
		
        return result;
    }
	
	
    this.getFileContent = function(pFilename, pDataType)
    {
        var result;
        var cp;
		
        if(this.isClientProcess() == true)   // use doClientIntermediate
        {
            try
            {
                result = a.doClientIntermediate(a.CLIENTCMD_GETDATA, [pFilename, pDataType]);
            }
            catch(ex)
            {
                log.show(ex)
                result = "";
            }
        }
        else   // use fileIO
        {
            try
            {
                result = fileIO.getData(pFilename, a.DATA_TEXT);
            }
            catch(ex)
            {
                log.log( ex );
                result = "";
            }
        }
        return result;
    }
	
	
    this.dumpRecord = function(pTable, pColumns, pTypes, pValues, pCondition)
    {
        var PADDING = "................................";
        var s = "";
        if(pCondition != undefined) s += "UPDATE " + pTable + " WHERE " + pCondition; else s += "INSERT " + pTable;
        s += "\n";
        for(var i=0; i < pColumns.length; i++)
        {
            s += "  " + pColumns[i] + PADDING.substr(0, 32- pColumns[i].length) + ": |" + pValues[i] + "|\n";
        }
		
        s += "\n";
		
        return s;
    }
	
	
    this.insertData = function(pTable, pColumns, pTypes, pValues, pAlias)
    {
        var tt = date.date();

        var result = true;
        if(this.Preview == false)
        {
            //better safe than sorry ...
            try
            {
                if(pTable.toLowerCase() != "var") 
                {
                    if(this.DataType[pTable] == undefined) this.writeLog("Table " + pTable + " not exist in database");
                    else
                    {
                        this.writeLog(this.LogLevels.Debug, "INSERT for [" + pAlias + "].[" + pTable + "]");
                        this.writeLog(this.LogLevels.Preview, this.dumpRecord(pTable, pColumns, pTypes, pValues));

                        //exist already "USER_NEW" and/or "DATE_NEW" in the columns resultset?
                        var uNew = false;
                        var dNew = false;

                        for(var i = 0; i < pColumns.length; i++)
                        {
                            if(uNew == false && pColumns[i].toUpperCase() == "USER_NEW")
                                uNew = true;
         
                            if(dNew == false && pColumns[i].toUpperCase() == "DATE_NEW")
                                dNew = true;
                        }

                        // process audit columns automagically				
                        if(uNew == false && this.DataType[this.getTableCase(pTable)][this.getColumnCase("USER_NEW")] != undefined) 
                        {
                            pColumns.push(this.getColumnCase("USER_NEW"));
                            pTypes.push(this.DataType[this.getTableCase(pTable)][this.getColumnCase("USER_NEW")]);
                            pValues.push(this.ImportUser);
                        }
                        if(dNew == false && this.DataType[pTable][this.getColumnCase("DATE_NEW")] != undefined) 
                        {
                            pColumns.push(this.getColumnCase("DATE_NEW"));
                            pTypes.push(this.DataType[this.getTableCase(pTable)][this.getColumnCase("DATE_NEW")]);
                            pValues.push(date.date());
                        }
        
                        this.insertArray.push([this.getTableCase(pTable), pColumns, pTypes, pValues, pAlias]);
                    }
                }
            }
            catch(ex)
            {
                this.writeLog(this.LogLevels.Error, "Exception at insertData for record: " + getRecordString(pColumns, pValues));
                log.log(ex);
                result = false;
            }
        }
        else
        {
            this.writeLog(this.LogLevels.Preview, "Insert into table " + pTable);
            this.writeLog(this.LogLevels.Preview, this.dumpRecord(pTable, pColumns, pTypes, pValues));
        }
		
        tt = date.date() - tt;
        exectimer["insertData"] += tt;
        return result;
    }
	
	
    this.updateData = function(pTable, pColumns, pTypes, pValues, pCondition, pAlias)
    {
        var tt = date.date();	

        var theCols;
        var theTypes;
        var theValues;
	
        var result = true;
        if(this.Preview == false)
        {
            try
            {
                if(pTable.toLowerCase() != "var")
                {
                    if(this.DataType[pTable] == undefined) this.writeLog("Table " + pTable + " not exist in database");
                    else
                    {
                        this.writeLog(this.LogLevels.Debug, "UPDATE for alias [" + pAlias + "].[" + pTable + "]");
                        this.writeLog(this.LogLevels.Preview, this.dumpRecord(pTable, pColumns, pTypes, pValues, pCondition));
            
                        if (this.CompleteUpdate == false)   // check for changed database values and use only changed columns for update
                        {
                            var uColumns = new Array();
                            var uValues = new Array();
                            var uTypes = new Array();
                            var oldValues = a.sql("select " + pColumns.join(", ") + " from " + pTable + " where " + pCondition, pAlias, a.SQL_ROW);

                            for (var dsi = 0; dsi < oldValues.length; dsi++)
                            {
                                if (oldValues[dsi] != pValues[dsi])
                                {
                                    //get the values from the validate target
                                    uColumns.push(pColumns[dsi]);
                                    uValues.push(pValues[dsi]);
                                    uTypes.push(pTypes[dsi]);
                                }
                            }
              
                            theCols = uColumns;
                            theTypes = uTypes;
                            theValues = uValues;
                        }
                        else   // update all columns, so use default column set
                        {
                            theCols = pColumns;
                            theTypes = pTypes;
                            theValues = pValues;
                        }
            
                        if(theCols.length > 0)
                        {
                            //show the old and the new data only if anything changed
                            this.writeLog(this.LogLevels.Preview, "Old Data: " + pValues.join("|"));
                            this.writeLog(this.LogLevels.Preview, "New Data: " + oldValues.join("|"));
                        }
            
                        var minchanges = 0;
                        var dEdit = false;
                        var uEdit = false;
            
                        for(var i = 0; i < theCols.length; i++)
                        {
                            if(uEdit == false && theCols[i].toUpperCase() == "USER_EDIT")
                                uEdit = true;
                
                            if(dEdit == false && theCols[i].toUpperCase() == "DATE_EDIT")
                                dEdit = true;
                        }
            
            
                        // process audit columns automagically				
                        if(uEdit == false && this.DataType[this.getTableCase(pTable)][this.getColumnCase("USER_EDIT")] != undefined) 
                        {
                            theCols.push(this.getColumnCase("USER_EDIT"));
                            theTypes.push(this.DataType[this.getTableCase(pTable)][this.getColumnCase("USER_EDIT")]);
                            theValues.push(this.ImportUser);
                            minchanges++;
                        }
                        if(dEdit == false && this.DataType[this.getTableCase(pTable)][this.getColumnCase("DATE_EDIT")] != undefined) 
                        {
                            theCols.push(this.getColumnCase("DATE_EDIT"));
                            theTypes.push(this.DataType[this.getTableCase(pTable)][this.getColumnCase("DATE_EDIT")]);
                            theValues.push(date.date());
                            minchanges++;
                        }

                        if(this.CompleteUpdate == false)
                        {				
                            if(theCols.length > minchanges) 
                            {
                                this.updateArray.push([this.getTableCase(pTable), theCols, theTypes, theValues, pCondition, pAlias]);
                            }
                        }				
                        else
                        { 
                            this.updateArray.push([this.getTableCase(pTable), theCols, theTypes, theValues, pCondition, pAlias]);
                        }
                    }
                }
            }
            catch(ex)
            {
                result = false;
                this.writeLog(this.LogLevels.Error, "Exception at updateData for record: " + getRecordString(pColumns, pValues));
                log.log(ex);
            }
        }
        else
        {
            this.writeLog(this.LogLevels.Preview, "Update table " + pTable);
            this.writeLog(this.LogLevels.Preview, this.dumpRecord(pTable, pColumns, pTypes, pValues, pCondition));
        }

        tt = date.date() - tt;
        exectimer["updateData"] += tt;
        return result;
    }
	
    //		set default action for a mapping call, if action has not been specified
    this.setDefaultAction = function(pObject)
    {
        if(pObject.Action == undefined)  // set reasonable defaults for Action, if not specified
        {
            if(this.Config.ImportCommand == "insert") pObject.Action = "I";
            else
            if(this.Config.ImportCommand == "update") pObject.Action = "U";
            else
            if(this.Config.ImportCommand == "insert+update") pObject.Action = "I+U"; 
        }
    }
		
    //		ATTENTION!! This is the *new* version and not the same as resolveSymbols!!
    //		
    //		resolve symbol to get import data
    //		may contain literals string and {#} and {tbl.col} symbols
    //		if undefined or empty expression is provided, return an empty string

    this.resolveSymbol = function(pObject, pExpression, pEvalScript)
    {
        var expr;
        
        if((pExpression != undefined) && (pExpression != ""))
        {
            var inp = this.InputRecord;
            var out = this.OutputRecord;
            var cCase = this.ColumnCase;
            var tCase = this.TableCase;
            var uCase = this.Cases.Upper;
			
            this.setDefaultAction(pObject);
            var obj = pObject;
			
            expr = pExpression.toString();
            expr = expr.replace(/\{([._a-zA-Z0-9]+)\}/ig, 
                function(pMatch, pNumber) 
                { 
                    if(isNaN(Number(pNumber)))
                    {
                        var varname = pNumber.split(".");
                        var result;
			                        
                        //Converts a string with the tablename in upper or lower case
                        getTableCase = function(pName)
                        {
                            if(tCase == uCase)
                                return pName.toUpperCase();
                            else
                                return pName.toLowerCase();
                        }
                        			
                        //Converts a string with the columnname in upper or lower case
                        getColumnCase = function(pName)
                        {
                            if(cCase ==uCase)
                                return pName.toUpperCase();
                            else
                                return pName.toLowerCase();
                        }
			                                    
			                        
                        // action verwenden, wenn keine da => importcommand auslesen
                        var action = obj.Action;
                        if(out[ getTableCase(varname[0]) ] != undefined && out[ getTableCase(varname[0]) ][ getColumnCase(varname[1]) ] != undefined)
                        {											
                            switch(obj.Action)
                            {
                                case "I":			
                                    result = out[ getTableCase(varname[0]) ][ getColumnCase(varname[1]) ]["I"];
                                    break;
                                case "U":			                        					                        			
                                    result = out[ getTableCase(varname[0]) ][ getColumnCase(varname[1]) ]["U"];
                                    break;
                                case "I+U":			                        	  	
			                        				
                                    result = out[ getTableCase(varname[0]) ][ getColumnCase(varname[1]) ]["U"];																					//2009-06-16  TR
                                    if(result == undefined || result == "") result = out[ getTableCase(varname[0])][ getColumnCase(varname[1]) ]["I"];  //2009-06-16  TR
				                        				
                                    break;
                            }
                        }
                        else  // varname does not exist as a property of out
                        {
                            result = undefined;
                        }

                        if(result == undefined) result = "";  // blank out NULL values
                        return result;
                    }
                    else
                    {
                        return inp[Number(pNumber)];
                    }   
                } );
            if(pEvalScript == true) expr = eval(expr);
        }
        else
        {
            expr = "";
        }

        return expr;		                  
    }
	
    //	  read column type information for all columns in all tables of the alias specified
    this.getDataTypes = function(pAlias)
    {
        var tables = a.getTables(pAlias);
        var dataTypes = new Object();

        for(var i=0; i < tables.length; i++)
        {
            var cols = a.getColumns(pAlias , tables[i]);
            var types = a.getColumnTypes(pAlias, tables[i], cols);
            dataTypes[ tables[i] ] = new Object();  // create sub-object to hold columns
            for(var j=0; j < cols.length; j++) dataTypes[tables[i]][cols[j]] = types[j];
        }

        return dataTypes;   // return object with type information
    }
	
    //		sets the output record buffer according to "Action" performed
    this.setOutput = function(pObject, pValue)
    {
        try
        {
            var target = pObject.Target.split(".");

            this.setDefaultAction(pObject);

            // make sure we do have an output buffer			
            if(this.OutputRecord[ this.getTableCase(target[0]) ] == undefined) this.OutputRecord[ this.getTableCase(target[0]) ] = new Object();
            if(this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ] == undefined) this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ] = new Object();

            switch(pObject.Action)
            {
                case "I":
                    this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ]["I"] = pValue;
                    break;
                case "U":
                    this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ]["U"] = pValue;
                    break;
                case "I+U":
                    this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ]["I"] = pValue;    //2009-06-16  TR
                    this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ]["U"] = pValue;    //2009-06-16  TR
                    this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ]["I+U"] = pValue;  //2009-06-16  TR
                    break;
            }
        }
        catch(ex)
        {
            this.writeLog(this.LogLevels.Error, "Property <Target> not set for mapping object!");
            log.log(ex);
            log.log("[IMPORTER] Property <Target> not set for mapping object!");
        }
    }

    //		get the content of the output record buffer according to "Action" performed
    this.getOutput = function(pObject, pTarget)
    {
        var target;
        var action;
		
        target = pTarget.split(".");
        if(pObject != undefined) action = pObject.Action; else action = undefined;

        if(action == undefined)  // set reasonable defaults for Action, if not specified
        {
            if(this.Config.ImportCommand == "insert") action = "I";
            else
            if(this.Config.ImportCommand == "update") action = "U";
            else
            if(this.Config.ImportCommand == "insert+update") action = "I+U";
        }

        var result;
        switch(action)
        {
            case "I":
                result = this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1])]["I"];
                break;
            case "U":
                result = this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ]["U"];
                break;
            case "I+U":
                result = this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ]["U"];
                if(result == undefined || result == "") result = this.OutputRecord[ this.getTableCase(target[0]) ][ this.getColumnCase(target[1]) ]["I"];
                break;
        }

        if(result == undefined) result = "";   // blank out undefined
        return result;
    }
	
	
    //		generates condition clause (without "WHERE") to check for existing key column values
    this.generateKeyCondition = function(pTable)
    {
        var whereclause = "";

        for(var col in this.KeyColumn[pTable])
        {
            var tmp = this.KeyColumn[pTable][col];  // contains I | I;U | I+U
            if(tmp != "") 
            {
                var value = this.OutputRecord[pTable][col]["U"];
                if(value == undefined || value == "") 
                    value = this.OutputRecord[pTable][col]["I+U"];
                if(value == undefined || value == "") 
                    value = this.OutputRecord[pTable][col]["I"];
				
                // we cannot distinguish between an empty string and NULL in Jdito, 
                // so if get an empty string for the value, we do a check for empty string OR NULL
                if(value == "")
                {
                    whereclause += " and (" + col + " = '' OR " + col + " is null)";
                }
                else
                {
                    whereclause += " and " + col + " = '" + value + "'";
                }
            }
        }

        // remove leading "and" from where clause
        if(whereclause.substr(0, 4) == " and") whereclause = whereclause.substr(4, whereclause.length);
		
        return whereclause;
    }


    /*
    * yield a string representation of the record in pColumns and pValues for logging 
    * purposes and debugging.
    *
    * @param {String[]} pColumns req columns that are represented
    * @param {String[]} pValues req values that are represented
    * 
    * @return {String} 
    */
    function getRecordString(pColumns, pValues)
    {
        var s = "";
        for(var i=0; i < pColumns.length; i++)
        {
            var v = pValues[i].toString();
            if(v.length > 40) v = v.substr(0,39) + "...";
            s += "  COL: " + pColumns[i] + ": " + v + "\n";
        }
		
        return s;
    }
  
    //Converts a string with the tablename in upper or lower case
    this.getTableCase = function(pName)
    {
        if(this.TableCase == this.Cases.Upper)
            return pName.toUpperCase();
        else
            return pName.toLowerCase();
    }
	
    //Converts a string with the columnname in upper or lower case
    this.getColumnCase = function(pName)
    {
        if(this.ColumnCase == this.Cases.Upper)
            return pName.toUpperCase();
        else
            return pName.toLowerCase();
    }
}


//	toolkit methods for the import handler

/*
* the skeleton code, just to document ignoring some columns 
*
* @param {Object} pObject opt the mapping line
* 
* @return {Boolean} only true is returned
*/
function iIgnore(pObject)
{
    return true;
}


/*
* move import data to target 
*
* @param {Object} pObject req the mapping line
*
* @example: [iMove, { Source: 3, Target: "RELATION.ADDRESS" } ]
*
* @return {Boolean} false, if the import of the row is not possible. otherwise true
*/
function iMove(pObject)
{
    var result = true;
	
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        if(pObject.Blobfile != undefined && pObject.Blobfile == true)  // blobfile move
        {
            var pn = pObject.Pathname;
            var fn = this.InputRecord[pObject.Source];
			
            // s will be NULL is something went wrong (no file, access error, etc)
            var s = this.getFileContent(pn.toString() + fn.toString(), a.DATA_TEXT);
			
            // if blob file could be read, assign to output buffer,
            // otherweise signal "no import for this row" by returning false as the function value
            if(s != null && s != undefined)
            {
                this.setOutput(pObject, s);
            }
            else
            {
                result = false;
            }
        }
        else  // no blob file handling, just plan old move
        {
            var expr = "";
            if(pObject.Source != undefined) expr = this.InputRecord[pObject.Source];
            if(pObject.Value != undefined) expr = this.resolveSymbol(pObject, pObject.Value, pObject.Eval);
			
            //if expr is undefined, then do no replace
            if(expr != undefined)
            {   
                // check for trimming option
                if(pObject.Trim != undefined && typeof(pObject.Trim) == "string")
                {
                    switch(pObject.Trim.toLowerCase())
                    {
                        case "left"  :
                            expr = expr.replace(/^\s+/, "");
                            break;
                        case "right" :
                            expr = expr.replace(/\s+$/, "");
                            break;
                        case "both"  :
                            expr = expr.replace(/^\s+|\s+$/g, "");
                            break;
                    }
                }
	      
                // chek for replacing option
                if(pObject.Replace != undefined && typeof(pObject.Replace) == "string" && pObject.ReplaceTo != undefined)
                    expr = expr.replace(pObject.Replace, pObject.ReplaceTo); 
	        
                // check for format conversion
                if(pObject.HTML2Text != undefined)
                {
                    expr = a.html2text(expr);
                }
            }
            else
            {
                expr = "";
            }

            this.setOutput(pObject, expr);
        }
    }
    return result;
}



/*
* Return word number "Index" from source column.
*    Values of the mapping line:
*    String Source the source column index
*    String Regex the regular expression for the split
*    Number Index the word number starting with 0
*    String Substring "right" or "left"
*    String Separator concatenation string, default is blank
*
* @param {Object} pObject req the mapping line
* 
* @return {Boolean} true
*/
function iWord(pObject)
{
    var result = true;
	
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var mode = pObject.Substring;
        var sep = pObject.Separator;
        if(sep == undefined) sep = " ";  // default concat with blank

        // split the input string with the regex and get the word number,
        // negative values will count from the end of the string (e.g. -1 for the last word in a string)
        if(pObject.Source != undefined) s = this.InputRecord[pObject.Source];
        if(pObject.Value != undefined) s = this.resolveSymbol(pObject, pObject.Value);
		
        s = s.split( pObject.Regex );
        var len = s.length;
        var num = Number(pObject.Index);
        if(num < 0) num = len - eMath.absInt(num);

        // just to be sure we are in a valid range
        if((num >= 0) && (num < len))
        {
            if(mode != undefined)
            {
                var part = "";
                // concatenate up the word
                mode = mode.toString().toLowerCase();
                if(mode == "left") 
                {
                    num++;
                    part = s.slice(0,num).join(sep);
                }
                else if(mode == "right")
                {
                    part = s.slice(pObject.Index).join(sep);
                }
                this.setOutput(pObject, part);
            }
            else
            {
                // use the single word
                this.setOutput(pObject, s[num]);
            }
        }
    }
	
    if(result == undefined) result = "";
    return result;
}


/*
* insert a communication entry
*    Values of the mapping line:
*    String Value the data to be iported, may contain {#} and {tbl.col}
*    Number Medium req the medium ID stored in MEDIUM_ID
*    String Rowid req the ROW_ID column in Outputrecord (usually RELATION.RELATIONID)
*    String PersID opt the PersID to use for the comm entry
*    String OrgID opt the OrgID to use for the comm entry
*    String RelationID opt the RelationID to use for the comm entry]
*
* @param {Object} pObject req the mapping line
*
* @return {Boolean} true
*/
function iComm(pObject)
{
    var cond;
    var i;
    
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var wert = "";	
        var persid = pObject.PersID;
        var orgid = pObject.OrgID;
        var relid = pObject.RelationID;
        var commid;  // for updates
        var rowid;
		
        if(pObject.Value != undefined) wert = this.resolveSymbol(pObject, pObject.Value);	
        if(pObject.Source != undefined) wert = this.InputRecord[pObject.Source];
        if(persid != undefined) persid = this.resolveSymbol(pObject, pObject.PersID);
        if(orgid != undefined) orgid = this.resolveSymbol(pObject, pObject.OrgID);
        if(relid != undefined) relid = this.resolveSymbol(pObject, pObject.RelationID);
		
        // stay compatible with old "Source: #" definitions
        if(pObject.Source != undefined) wert = this.InputRecord[pObject.Source];

        // select the correct aotype for the relation search
        var aotype = 0;
        if((this.UseAOType == true && orgid != undefined) || (this.UseAOType == false && orgid != undefined && orgid != "0")) aotype += 1;
        if(persid != undefined) aotype += 2;		
		
        if(wert.replace(/(^\s+)|(\s+$)/g,"") != "")  // continue, if we do have an address
        {
            var suchwert = wert.replace(/[^0-9]/g, "").replace(/^0+/, "");
            var std = "";  // standard communication ("1") or not
			
            // the default rowid column is RELATION.RELATIONID, but look for an override
            // also check for the "standard" flag for a comm entry
            if(pObject.Rowid != undefined) 
                rowid = this.resolveSymbol(pObject, pObject.Rowid); 
            else 
                rowid = this.getOutput(pObject, this.getTableCase("RELATION") + "." + this.getColumnCase("RELATIONID"));
				
            if((pObject.Standard != undefined) && (pObject.Standard == true)) std = "1"; 
			
            // do we have an override for the relation id?
            if(aotype > 0)  // yes, search by orgid and/or persid
            {
                var sql;
                if(orgid != undefined && persid == undefined)
                {
                    cond = "";
	        
                    //do we use aotype?
                    if (this.UseAOType == true)
                        cond = this.getColumnCase(" and aotype = 1");
                    else
                        cond = this.getColumnCase(" and pers_id is null");
	          
                    sql = "select " + this.getColumnCase("relationid") + " from " + this.getTableCase("relation") + " where " + this.getColumnCase("org_id") + " = '" + orgid + "'" + cond;
                }
                if(orgid == undefined && persid != undefined)
                {
                    cond = "";
	        
                    //do we use aotype?
                    if (this.UseAOType == true)
                        cond = this.getColumnCase(" and aotype = 2");
                    else
                        cond = this.getColumnCase(" and " + trim("ORG_ID") + " = '0'");
				
                    sql = "select " + this.getColumnCase("relationid") + " from " + this.getTableCase("relation") + " where " + this.getColumnCase("pers_id") + " = '" + persid + "'" + cond;
                }
                if(orgid != undefined && persid != undefined)
                {
                    cond = "";
	        
                    //do we use aotype?
                    if (this.UseAOType == true)
                        cond = this.getColumnCase(" and aotype = 3");
	        
                    sql = "select " + this.getColumnCase("relationid") + " from " + this.getTableColumn("relation") + " where " + this.getColumnCase("org_id") + " = '" + orgid + "' and " 
                    + this.getColumnCase("pers_id") + "= '" + persid + "'" + cond;
                }
                rowid = a.sql(sql, this.Config.AliasTo);
            }

            // the usual suspects ...
            var spalten = [ "COMMID", "ADDR", "MEDIUM_ID", "RELATION_ID", "SEARCHADDR", "STANDARD" ];
            var typen = [];
            for(i=0; i < spalten.length; i++) 
            {
                typen[i] = this.DataType[this.getTableCase("COMM")][this.getColumnCase(spalten[i])];
                spalten[i] = this.getColumnCase(spalten[i]);
            }
			
			
            var werte = [ "", wert, this.resolveSymbol(pObject, pObject.Medium).toString(), rowid, suchwert, std ];

            if(this.Preview == true)
            {
                this.writeLog(this.LogLevels.Preview, "[iComm] COMM entry data: ADDR=" + werte[1] + " / MEDIUM_ID=" + werte[2] + " / RELATION_ID=" + werte[3]);
            }
            else
            {
                // the real thing, no preview
                var action; // "insert" | "update" | undefined
							
                if(this.Config.ImportCommand == "insert+update")
                {

                    if(pObject.Action == undefined)  // set reasonable defaults for Action, if not specified
                    {
                        if(this.Config.ImportCommand == "insert") pObject.Action = "I";
                        else
                        if(this.Config.ImportCommand == "update") pObject.Action = "U";
                        else
                        if(this.Config.ImportCommand == "insert+update") pObject.Action = "U"; 
                    }
				
                    if(pObject.Action == "I")
                    {
                        action = "insert";
                    }
                    if(pObject.Action == "U" || pObject.Action == "I+U")
                    {		
                        // try to find existing comm entry
                        cond = this.getColumnCase(" MEDIUM_ID = ") + werte[2] + this.getColumnCase(" and RELATION_ID = '") + werte[3] + "' "; 
                        if(pObject.UpdateCondition != undefined) cond += " and " + pObject.UpdateCondition;
                        commid = a.sql("select " + this.getColumnCase("COMMID") + " from " + this.getTableCase("COMM") + " where " + cond, this.Config.AliasTo);

                        if(commid == "")
                        {
                            // no entry, do insert
                            action = "insert";
                        }
                        else
                        {
                            // exists, do update
                            action = "update";
                        }
                    }
                }
                else if(this.Config.ImportCommand == "update")
                {
                    action = "update";
                }
                else
                {
                    action = "insert";
                }
				
                switch(action)
                {
                    case "insert":
                        this.writeLog(this.LogLevels.Debug, "[iComm] Adding COMM entry: ADDR=" + werte[1] + " / MEDIUM_ID=" + werte[2] + " / RELATION_ID=" + werte[3]);
                        werte[0] = this.UseUUID != true ? a.getNewID(this.getTableCase("COMM"), this.getColumnCase("COMMID"), this.Config.AliasTo) : a.getNewUUID();  // we only require a new id if not previewing
                        this.insertData(this.getTableCase("COMM"), spalten, typen, werte, this.Config.AliasTo);
                        break;
							
                    case "update":
                        this.writeLog(this.LogLevels.Debug, "[iComm] Updating COMM entry: COMMID=" + commid);
                        spalten = [ "ADDR", "SEARCHADDR", "STANDARD" ];
                        typen = [];
                        for(i=0; i < spalten.length; i++) 
                        {
                            typen[i] = this.DataType[this.getTableCase("COMM")][this.getColumnCase(spalten[i])];
                            spalten[i] = this.getColumnCase(spalten[i]);
                        }
                        cond = this.getColumnCase("COMMID = '") + commid + "'";
                        werte = [ wert, suchwert, std ];
                        this.updateData(this.getTableCase("COMM"), spalten, typen, werte, cond, this.Config.AliasTo);
                        break;
                }
            }
        }
    }
	
    return true;
}


/*
* expects to find an ORGID in the data column pointed to by pIndex,
* yields the related RELATIONID for hte org relation
* Values of the mapping line:
*                        Number pIndex req the column index for the current record	
*                        String pColumn req target column name ]
*
* @param {Object} pObject req the mapping line
*
* @return {Boolean} true
*/
function iRelFromOrg(pObject)
{
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var orgid;
        if(pObject.Value != undefined) orgid = this.resolveSymbol(pObject, pObject.Value);	
        if(pObject.Source != undefined) orgid = this.InputRecord[pObject.Source];
		
        var cond = "";
		
        //do we use AOType?
		
        if (this.UseAOType == true)
            cond = this.getColumnCase(" and aotype = 1 ");
        else
            cond = this.getColumnCase(" and pers_id is null");
	    
        var sql = "select " + this.getColumnCase("relationid") + " from " + this.getTableCase("relation") + " where " + this.getColumnCase("org_id = '") + orgid + cond;
        var res = a.sql(sql, this.Config.AliasTo);
        this.setOutput(pObject, res);
    }
	
    return true;
}


/*
* return a new ID for a key field 
*			 	Value of the mapping line:
*				String pColumn req the key column 
*
* @param {Object} pObject req the mapping line
*
* @return {Boolean} true
*/
function iNewID(pObject)
{
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var coldata = pObject.Target.split(".");	
        this.setOutput(pObject, this.UseUUID != true ? a.getNewID(this.getTableCase(coldata[0]), this.getColumnCase(coldata[1]), this.Config.AliasTo) : a.getNewUUID());
    }
	
    return true;
}


/*
* join the list of columns into the specified target column 
* Values of the mapping line:
*			Array pList req array containing result set indexes with joinable columns
*			String pDelimiter req the delimiter string
*			String pColumn req target column name 
*
* @param {Object} pObject req the mapping line
*
* @example1: [iJoin, {Source: [3, 5], Delimiter: "\n", Target: "RELATION.ADDRESS"}]
* @example2: [iJoin, {Value: ["{3}", "{5}"], Delimiter: "\n", Target: "RELATION.ADDRESS"}]
*
* @return {Boolean} true
*/
function iJoin(pObject)
{
    var s = "";
    var len;
	
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        if(pObject.Source != undefined)
            len = pObject.Source.length;
        if(pObject.Value != undefined)
            len = pObject.Value.length;
	 
        for(var i=0; i < len; i++)
        {
            if (pObject.Source != undefined)
                if(this.InputRecord[pObject.Source[i]] != "")
                {
                    if(i > 0 ) s += pObject.Delimiter;
                    s += this.InputRecord[pObject.Source[i]];
                }

            if(pObject.Value != undefined)
                if(this.resolveSymbol(pObject, pObject.Value[i]) != "")
                {
                    if(i > 0 ) s += pObject.Delimiter;
                    s += this.resolveSymbol(pObject, pObject.Value[i]);
                }
        }
		
        this.setOutput(pObject, s);
    }
	
    return true;
}


/*
* do a lookup for a keyword value to replace texte with keyword reference
* Values of the mapping line:
* Source -- the column index into the result set
* KeyType -- the keytype name (KEYNAME2) for the keyword lookup
* Target -- the target for the KEYVALUE
*
* @param {Object} pObject req the mapping line
*
* @return {Boolean} true
*/
function iKeyword(pObject)
{
    var sql;
   
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var value = this.InputRecord[pObject.Source];
        if(value == undefined) value = this.resolveSymbol(pObject, pObject.Value);

        sql = "select " + this.getColumnCase("keyvalue") + " from " + this.getTableCase("keyword") +  
        " where upper(" + this.getColumnCase("keyname1") + ") = upper('" + value + "') " +   
        " and " + this.getColumnCase("keytype") + " = (select " + this.getColumnCase("keyvalue") + " from " + this.getTableCase("keyword") +
        " where " + this.getColumnCase("keytype") + " = 0 and upper(" + this.getColumnCase("keyname2") + ") = upper('" + pObject.Keytype + "') )";
   
        // handling for AutoCreate
        if((pObject.Autocreate && pObject.Autocreate == true) && value != null && value != "")
        {
            var kv = a.sql(sql, this.Config.AliasTo);
            if(kv == undefined || kv == "")  // no entry found
            {
                var spalten = ["KEYWORDID", "AOACTIVE", "KEYTYPE", "KEYVALUE", "KEYNAME1", "KEYNAME2", "USER_NEW", "DATE_NEW"];
                var typen = [];
                for(var i=0; i < spalten.length; i++) 
                {
                    typen[i] = this.DataType[this.getTableCase("KEYWORD")][this.getColumnCase(spalten[i])];
                    spalten[i] = this.getColumnCase(spalten[i]);
                }
                // check keyword group
                var kt = a.sql("select " + this.getColumnCase("keyvalue") + " from " + this.getTableCase("keyword") + " where " + this.getColumnCase("keytype") 
                    + " = 0 and upper(" + this.getColumnCase("keyname2") + ") = upper('" + pObject.Keytype + "')");  
                      
                if(kt == undefined || kt == "")  // keyword group is missing, do insert for keytype 0
                {
                    kt = a.sql("select max(coalesce(keyvalue, 0))+1 from keyword where keytype = 0");
                    werte = [this.UseUUID != true ? a.getNewID(this.getTableCase("KEYWORD"), this.getColumnCase("KEYWORDID"), this.Config.AliasTo) : a.getNewUUID(), "1", "0", kt, pObject.Keytype, pObject.Keytype, this.ImportUser, date.date()];
                    this.insertArray.push(["KEYWORD", spalten, typen, werte, this.Config.AliasTo]);
                }
				
                // insert keyword
                kv = a.sql("select max(coalesce(keyvalue, 0))+1 from keyword where keytype = " + kt);
                werte = [this.UseUUID != true ? a.getNewID(this.getTableCase("KEYWORD"), this.getColumnCase("KEYWORDID"), this.Config.AliasTo) : a.getNewUUID(), "1", kt.toString(), kv, value, "", this.ImportUser, date.date()];
				
                this.insertArray.push([this.getTableCase("KEYWORD"), spalten, typen, werte, this.Config.AliasTo]);		
            }
        }
		
        sql = "select " + this.getColumnCase("keyvalue") + " from " + this.getTableCase("keyword") + 
        " where upper(" + this.getColumnCase("keyname1") + ") = upper('" + value + "') " + 
        " and " + this.getColumnCase("keytype") + " = (select " + this.getColumnCase("keyvalue") + " from " + this.getTableCase("keyword") +
        " where " + this.getColumnCase("keytype") + " = 0 and upper(" + this.getColumnCase("keyname2") + ") = upper('" + pObject.Keytype + "') )";
   
        this.setOutput(pObject, a.sql(sql, this.Config.AliasTo));
    }
	
    return true;
}


/*
* executes an sql statement with the data from input result set column in pIndex
* Values of the mapping line:
* Number pIndex req the index into the input result set
* String Command req the sql command (use {0}..{n} to specify source indexes)
* String Alias req the alias name
* String Target req the target column 
*
* @param {Object} pObject req the mapping line
*
* @return {Boolean} true
*/
function iSql(pObject)
{
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var sql = this.resolveSymbol(pObject, pObject.Command);
		
        if (pObject.Target != undefined)
            this.setOutput(pObject, a.sql(sql, pObject.Alias));
        else
            a.sql(sql, pObject.Alias);
    }
		
    return true;
}



/*
* create an attribute entry from an input column
* Values of the mapping line: 
* Number Source opt the source index for the input array (if missing, Value must be specified)
* String Value opt the value expression, may contain place holders (if missing, Source must be specified)
* String Attribute req the fully qualified attribute name (e.g. "INFO.FOUNDINGYEAR")
* String Rowid req the column specifier for the ROW_ID column
* Number Type req the object type for the attribute as defined in ATTROBJECT
* Boolean ListEncoding opt if true, input data is a string-encoded array of values, will result in multiple entries in ATTRLINK 
				
@param {Object} pObject req the mapping line			

@example [ iAttribute, { Source: 2, Attribute: "Betreuung.Zielgruppe", Rowid: "RELATION.RELATIONID", Type: 1 } ]

@return {Boolean} true
*/
function iAttribute(pObject)
{
    var attrdata;
    var sql;
    var i;
    var spalten;
    var typen;
    var werte;
    
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var go = true;
        attrdata = [];
        var rowid = "asrg";
		
        if (this.FuncBuffer[pObject.Attribute] == undefined)
        {
            var attrname = pObject.Attribute.split("|");  // split on pipe symbol
            sql = " select " + this.getColumnCase("attrid, attrname, attrcomponent, attrobject ") +  
            "	  from " + this.getTableCase("attr join attrobject") + " on " + this.getColumnCase("attrid") +
            " = " + this.getTableCase("attrobject") + "." + this.getColumnCase("attr_id") +  
            "  where upper(" + this.getColumnCase("attrname") + ") = upper('" + attrname[attrname.length - 1] + "') " + 
            "        and " + this.getColumnCase("attrobject") + " = " + pObject.Type; 
			          
            if(attrname.length == 2)
            {
                var parent = a.sql("select " + this.getColumnCase("attrid") + " from " + this.getTableCase("attr") + " where upper(" + this.getColumnCase("attrname") + ") = upper('" + attrname[0] + "')",  this.Config.AliasTo, a.SQL_COLUMN); 
				
                if(parent.length == 1)
                {	
                    sql += " AND " + this.getTableCase("attr") + "." + this.getColumnCase("attr_id") + " = '" + parent[0] + "'";
                    go = true;
                }
                else if(parent.length > 1)
                {
                    go = false;
                    this.writeLog(this.LogLevels.Error, '[iAttribute] Parent Attribute "' + attrname[0] + '" is defined more than once! Only one instance allowed.');
                }
                else if(parent == "" || parent.length == 0)
                {
                    go = false;
                    this.writeLog(this.LogLevels.Error, '[iAttribute] Parent Attribute "' + attrname[0] + '" specified in mapping could not be found.');
                }
            }
				
            if(go)  // only read attrbiute data, if we do have a "go" from the check above ...
            {
                attrdata = a.sql(sql, this.Config.AliasTo, a.SQL_ROW);
                this.FuncBuffer[pObject.Attribute] = attrdata;
            }
        }
        else
        {
            attrdata = this.FuncBuffer[pObject.Attribute];
        }
		
        // proceed only, if we did find the attribute definition
        if(attrdata.length > 0)
        {
            var value;
			
            // get the value to import into an attribute
            if(pObject.Source != undefined) value = this.InputRecord[pObject.Source];
            if(pObject.Value != undefined) value = this.resolveSymbol(pObject, pObject.Value);
            if(value == undefined) value = "";
			
            var colname;
			
            // get the row id
            rowid = this.resolveSymbol(pObject, pObject.Rowid);
						 		  
            // if we have to process an encoded list, loop thru the values
            if(pObject.ListEncoding == "true" || pObject.ListEncoding == true)
            {
                // bette safe than sorry, make sure, we have a well-formed string-encoding
                // by trimming trailing blanks and adding one space again ...
                value = value.replace(/\s+$/g, "");
                if(value.length > 1 && value[value.length-1] != " ") value += " ";		
                value = a.decodeMS(value);
            }
            else
            {
                // trick to get an array even for a single value, so we can use a loop for both formats
                value = [value];
            }

            // get the column name to hold the attribute value and do some minor remapping
            switch (Number(attrdata[2]))
            {
                case 1: // Combo
                    // get the combobox value for every element of the value array. in most cases, this will only
                    // have one element, because ListEncoding is missing or set to false
                    for(i=0; i < value.length; i++)
                    {
                        var attrValue = a.sql("select " + this.getColumnCase("attrid") + " from " + this.getTableCase("attr") + " where " + this.getColumnCase("attr_id") + " = '" +   //"select attrid from attr where attr_id = '"
                            attrdata[0] + "' and upper(" + this.getColumnCase("attrname") + ") = upper('" + value[i] + "') ", this.Config.AliasTo);  //ttrdata[0] + "' and upper(attrname) = upper('" + value[i] + "') "
						                 
                        if(value[i] != "" && (attrValue == "" || attrValue == undefined) && (pObject.Autocreate && pObject.Autocreate == true))
                        {
                            var newAttrID = this.UseUUID != true ? a.getNewID(this.getTableCase("ATTR"), this.getColumnCase("ATTRID"), this.Config.AliasTo) : a.getNewUUID();
                            var spaltenAttr = ["ATTRID", "ATTR_ID", "ATTRNAME", "AOACTIVE"];
                            var werteAttr = [newAttrID, attrdata[0], value[i], "1"];
                            var typenAttr = [];
                            for(var k=0; k < spaltenAttr.length; k++) typenAttr[k] = this.DataType[this.getTableCase("ATTR")][this.getColumnCase(spaltenAttr[k])];

                            this.insertArray.push([this.getTableCase("ATTR"), spaltenAttr, typenAttr, werteAttr, this.Config.AliasTo]);
	            
                            value[i] = newAttrID;
                        }         
                        else
                            value[i] = attrValue; 
	            
                    }
                    colname = "VALUE_ID";
                    break;
                case 7: // SelectCombo
                    colname = "VALUE_ID";
                    break;
                case 2: // String
                    colname = "VALUE_CHAR";
                    break;
                case 3:  // Checkbox
                    colname  = "VALUE_CHAR";
                    break;
                case 4: // Date
                    colname = "VALUE_DATE";
                    break;
                case 5: // Integer
                    colname = "VALUE_INT";
                    break;			
                case 6: // Float
                    colname = "VALUE_FLOAT";
                    break;
            }
				
            // is the attribute value already set for this ID?
            sql = " select " + this.getColumnCase("attrlinkid") + " from " + this.getTableCase("attrlink") + 
            " where " + this.getColumnCase("attr_id") + " = '" + attrdata[0] + "' and " + this.getColumnCase("row_id") + " = '" + rowid + "' "; 
			          
            var attrlinkid = a.sql(sql, this.Config.AliasTo);
			
            // now we have to decide what to do based on the importer command
            // if we are inserting, always add the new attribute value		
            // if we are updating, update an existing attribute value or create a new one
            var action;
			
            if(this.Config.ImportCommand == "insert+update")
            {
                if(pObject.Action == undefined)  // set reasonable defaults for Action, if not specified
                {
                    if(this.Config.ImportCommand == "insert") pObject.Action = "I";
                    else
                    if(this.Config.ImportCommand == "update") pObject.Action = "U";
                    else
                    if(this.Config.ImportCommand == "insert+update") pObject.Action = "U"; 
                }
				
                if(pObject.Action == "I")
                {
                    action = "insert";
                }
				
                if(pObject.Action == "U" || pObject.Action == "I+U")
                {
                    //try, to find an existing attrlink entry
                    attrlinkid = a.sql("select " + this.getColumnCase("attrlinkid") + " from " + this.getTableCase("attrlink") + 
                        " where " + this.getColumnCase("attr_id") + " = '" + attrdata[0] + "' and " + this.getColumnCase("row_id") + " = '" + rowid + "' and " + this.getColumnCase("object_id") + " = '" + pObject.Type + "' ", this.Config.AliasTo); 
							         			 
                    if (attrlinkid == "")
                    {
                        //no entry, do insert
                        action = "insert";
                    }
                    else
                    {
                        //excist, do update
                        action = "update";
                    }
                }
            }
            else if (this.Config.ImportCommand == "update")
            {
                action = "update";
            }
            else
            {
                action = "insert";
            }		
			
            switch(action)
            {
                case "insert":
                    spalten = ["ATTRLINKID", "ATTR_ID", "OBJECT_ID", "ROW_ID", colname];
                    typen = [];
                    for(i=0; i < spalten.length; i++) 
                    {
                        typen[i] = this.DataType[this.getTableCase("ATTRLINK")][this.getColumnCase(spalten[i])];
                        spalten[i] = this.getColumnCase(spalten[i]);
                    }

                    // now loop thru all values (without "ListEncoding: true" there will be only one element)
                    // and insert the new attribute links
                    for(i=0; i < value.length; i++)
                    {
                        werte = ["", attrdata[0], pObject.Type.toString(), rowid, value[i] ];
											
                        if(value[i] != "" && value[i] != null)  // only insert if the value is not empty
                        {
                            this.writeLog(this.LogLevels.Debug, "[iAttribute] Inserting link: ATTRID = " + werte[1] + ", RowID = " + werte[3]+ ", Value = " + value[i]);
									
                            if(this.Preview == false)
                            {
                                // only require a new ID if not previewing
                                werte[0] = this.UseUUID != true ? a.getNewID(this.getTableCase("ATTRLINK"), this.getColumnCase("ATTRLINKID"), this.Config.AliasTo) : a.getNewUUID();
                                this.insertData(this.getTableCase("ATTRLINK"), spalten, typen, werte, this.Config.AliasTo);
                                this.writeLog(this.LogLevels.Preview, "[iAttribute] " + this.dumpRecord("ATTRLINK", spalten, typen, werte));
                            }
                        }
                    }
                    break;
                case "update":
                    spalten = [ colname ];
                    typen = [ this.DataType[this.getTableCase("ATTRLINK")][this.getColumnCase(colname)] ];
                    var cond = this.getColumnCase("attr_id") + " = '" + attrdata[0] + "' and " + this.getColumnCase("row_id") + " = '" + rowid + "' and " + this.getColumnCase("object_id") + " = '" + pObject.Type + "' "; 
							
                    // now loop thru all values (without "ListEncoding: true" there will be only one element)
                    // and insert the new attribute links
                    for(i=0; i < value.length; i++)
                    {
                        werte = [ value[i] ];
											
                        if(value[i] != "" && value[i] != null)  // only insert if the value is not empty
                        {
                            this.writeLog(this.LogLevels.Debug, "[iAttribute] Updating link: ATTRID = " + attrdata[0] + ", RowID = " + rowid + ", Value = " + value[i]);
									
                            if(this.Preview == false)
                            {
                                this.updateData(this.getTableCase("ATTRLINK"), spalten, typen, werte, cond, this.Config.AliasTo);
                                this.writeLog(this.LogLevels.Preview, "[iAttribute] " + this.dumpRecord("ATTRLINK", spalten, typen, werte, cond));
                            }
                        }
                    }					
                    break;
            }
        }  // end if
        else
        {
            // return false, if no attribute definition was found
            this.writeLog(this.LogLevels.Debug, "[iAttribute] No attribute definition found for " + pObject.Attribute);
            result = false;
        }
    }
	
    return true;
}


/*
* create a history link for the current history import.
* if you know RELATIONID, specifiy the column index containing it in "Source",
* otherwise specify PersID and OrgID source indexes in "PersID" and "OrgID" 
*
* Values of the mapping line:
*        Number Source opt the source index for the input array containing the relationid
*        Number Type opt the object type for the history link
*        String PersID opt the persid key value source index
*        String OrgID opt the orgkey value source index
*        String HistoryID opt the column specifier (tbl.col) holding the history_id column name 
*
* @param {Object} pObject req the mapping line
*
* @example  [ iHistoryLink, { Source: 3, Type: 11  } 
* iHistoryLink, { PersID: 3, OrgID: 5  } ]
*
* @return {Boolean} true
*/
function iHistoryLink(pObject)
{
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var spalten = [ "HISTORYLINKID", "HISTORY_ID", "ROW_ID", "OBJECT_ID" ];
        var typen = [];
        for(var i=0; i < spalten.length; i++) 
        {
            typen[i] = this.DataType[this.getTableCase("HISTORYLINK")][this.getColumnCase(spalten[i])];
            spalten[i] = this.getColumnCase(spalten[i]);
        }
    
        var werte;
        var result = true;
        var src = pObject.Source;
        var persid;
        var orgid;

        // get the history ID value. 
        // if not set, use HISTORY.HISTORYID as the default (has to be set earlier in a mapping line)
        if(pObject.HistoryID == undefined) pObject.HistoryID = "{" + this.getTableCase("HISTORY") + "." + this.getColumnCase("HISTORYID") + "}";
        var histid = this.resolveSymbol(pObject, pObject["HistoryID"]);

        var value;
        var typ = pObject.Type;
        if(pObject.Source != undefined) value = this.InputRecord[pObject.Source];
        if(pObject.Value != undefined) value = this.resolveSymbol(pObject, pObject.Value);

        // if neither Source nor Value are specified, look for PersID and/or OrgID
        if(value == undefined)
        {
            var prefix = "select " + this.getColumnCase("relationid") + " from " + this.getTableCase("relation") + " where ";
            var sql = "";
			
            if(pObject.PersID != undefined) persid = this.resolveSymbol(pObject, pObject.PersID);
            if(pObject.OrgID != undefined) orgid = this.resolveSymbol(pObject, pObject.OrgID);

            if(typ == undefined)
            {
                typ = 0;
                if(orgid != undefined) typ += 1;
                if(persid != undefined) typ += 2;
            }		
			
            if((typ & 1) == 1) 
                if (this.UseAOType == true)
                    sql += this.getColumnCase("org_id = '") + orgid + "' "; 
                else
                    sql += this.getColumnCase("org_id = '") + orgid + "' " + ((typ & 2) < 2 ? this.getColumnCase(" and pers_id is null ") : "");

            if((typ & 2) == 2) 
            {
                if(sql != "") sql += " AND ";
				
                if (this.UseAOType == true)
                    sql +=  this.getColumnCase("pers_id = '") + persid + "' ";
                else
                    sql +=  this.getColumnCase("pers_id = '") + persid + "'" + ((typ & 1) < 1 ? this.getColumnCase(" and " + trim("ORG_ID") + " = '0' ") : ""); 
            }
			
            var cond = "";
			
            if (this.UseAOType == true)
                cond = this.getColumnCase(" and aotype = ") + typ;
	      
            sql = prefix + sql + cond;
            value = a.sql(sql, this.Config.AliasTo);			
        }	
		
        werte = [ 0, histid, value, typ.toString() ];
		
        this.writeLog(this.LogLevels.Debug, "[iHistoryLink] Inserting history link for HISTORYID " + werte[1]);
        if(this.Preview == false)
        {
            // insert only if we do have data for historyid and row_id
            if(werte.length > 0 && werte[1] != "" && werte[2] != "")  
            {
                werte[0] = this.UseUUID != true ? a.getNewID(this.getTableCase("HISTORYLINK"), this.getColumnCase("HISTORYLINKID"), this.Config.AliasTo) : a.getNewUUID();
                this.insertData(this.getTableCase("HISTORYLINK"), spalten, typen, werte, this.Config.AliasTo);
            }
            else
            {
                var msg = "[iHistoryLink] skipping HistoryLink. Value=" + value + " ";
                if(werte[1] == "" || werte[1] == undefined) msg += "HISTORYID empty! ";
                if(werte[2] == "" || werte[2] == undefined) msg += "ROW_ID empty! ";
                if(orgid != undefined || persid != undefined)
                {
                    if(typ == "1" || typ == "2" || typ == "3") msg += " ORGID[" + orgid + "], PERSID[" + persid + "]";
                }
                this.writeLog(this.LogLevels.Debug, msg);
            }
        }
    }
	
    return result;	
}



/*
* inserts or updates an relation entry 
*
* @param {Object} pObject req the mapping line
* 
* @example: [iInsertUpdate, { Table: "RELATION", Alias: "AO_DATEN", 
*                      			Columns: ( {Name: "RELATIONID", Source: 4, Required: true }, 
*                            			     {Name: "AOTYPE", Value: "2" }, 
*                                 			 {Name: "PERS_ID", Column: "PERS.PERSID" })  } ]
*                                 
* @return {Boolean} true, if insert and update are successful, otherwise false
*/
function iInsertUpdate(pObject)
{
    var result = true;
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        this.setDefaultAction(pObject);
		
        try
        {
            var spalten = [];
            var typen = [];
            var werte = [];
            var coldef;
            var data_ok = true; // be optimistic ...
            var alias = pObject.Alias;
            if(alias == undefined) alias = a.getCurrentAlias();
            var condition = this.resolveSymbol(pObject, pObject.Condition);
			
            if(this.Config.ImportCommand == "insert+update")
            {
                if(pObject.Action == undefined)  // set reasonable defaults for Action, if not specified
                {
                    if(this.Config.ImportCommand == "insert") pObject.Action = "I";
                    else
                    if(this.Config.ImportCommand == "update") pObject.Action = "U";
                    else
                    if(this.Config.ImportCommand == "insert+update") pObject.Action = "U"; 
                }
				
                if(pObject.Action == "I+U")
                    pObject.Action = "U";
					
                if(pObject.Action == "I")
                {
                    action = "insert";
                }
				
                if(pObject.Action == "U")
                {
                    //try to find an existing entry
                    var entryid = a.sql("select count(*) from " + pObject.Table + " where " + condition, alias);
					
                    if(Number(entryid) > 0)
                    {
                        //exist, do update
                        action = "update";
                    }
                    else
                    {
                        //no entry, do insert
                        action = "insert";
                    }
                }
            }
            else if (this.Config.ImportCommand == "update")
            {
                action = "update";
            }
            else
            {
                action = "insert";
            }		
						
            // loop thru the column definitions
            for(var i=0; i < pObject.Columns.length; i++)
            {
                var value = undefined;
                coldef = pObject.Columns[i];
				
                //be sure, that no keycolumn is pushed in the array, when action like insert
                if(coldef.Key != true || (coldef.Key == true && action == "insert")) spalten.push(coldef.Name);
                if(coldef.Key != true || (coldef.Key == true && action == "insert")) typen.push( this.DataType[pObject.Table][coldef.Name] );
				
                if(value == undefined && coldef.Source != undefined) value = this.InputRecord[coldef.Source];
                if(value == undefined && coldef.Value != undefined) value = this.resolveSymbol(coldef, coldef.Value, coldef.Eval); 
                if(value == undefined && coldef.Key == true && action == "insert") value = this.UseUUID != true ? a.getNewID(pObject.Table, coldef.Name, alias) : a.getNewUUID();
			
                //value undefined should not be pushed
                if(value != undefined) werte.push(value);
				
                // do not update data if any required field is empty
                if(coldef.Required == true && (value == undefined || value == "")) data_ok = false;
            }
		
            if(data_ok == true) 
            {
                switch(action)
                {
                    case "insert":
                        this.insertData(pObject.Table, spalten, typen, werte, alias);
                        break;
                    case "update":
                        this.updateData(pObject.Table, spalten, typen, werte, condition, alias);
                        break;
                }
            }
        }
        catch(ex)
        {
            log.log(ex);
            result = false;
        }
    }
	
    return result;
}





/*
* inserts a new relation entry
*
* @param {Object} pObject req the mapping line
*
* @example: [iRelation, { Table: "RELATION", Target: "tbl.col", Alias: "AO_DATEN", orgid: persid: address: .... } ]
*
* @return {Boolean} true, if insert was successful, otherwise false
*/
function iRelation(pObject)
{
    var result = true;
    var id;
	
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        try
        {
            var typen = [];
            var werte = [];
            var coldef;
            var alias = pObject.Alias;
            var relid;
			
            if(alias == undefined) alias = a.getCurrentAlias();

            var collist = ["ORG_ID", "PERS_ID", "DEPARTMENT", "RELTITLE", "RELPOSITION", "LANGUAGE", "LETTERSALUTATION"];		                

            //do we use AOType?
            if (this.UseAOType == true)
                collist.push("AOTYPE");
	      
            for(var index=0; index < collist.length; index++)
            {
                typen[index] = this.DataType[this.getTableCase("RELATION")][this.getColumnCase(collist[index])];
                var colname = collist[index].toLowerCase();
				
				
                // special handling for core properties that have to be specified in the mapping object
                switch(colname)
                {
                    case "aotype":
                        werte.push(pObject.AoType);
                        break;
							
                    default:
                        werte.push( this.resolveSymbol(pObject, pObject[colname]) );
                        break;
                }
            }
				
            this.setDefaultAction(pObject);
			
            switch(pObject.Action)
            {
                case "I+U":
                    // check first, not not there, insert it
                    relid = this.resolveSymbol(pObject, pObject.relationid);
                    id = a.sql("select " + this.getColumnCase("relationid") + " from " + this.getTableCase("relation") + " where " + this.getColumnCase("relationid") + " = '" + relid + "'", alias); 
                    if(id != "") 
                    {
                        this.updateData(this.getTableCase("RELATION"), spalten, typen, werte, alias);
                    }
                    else
                    {
                        relid = this.UseUUID != true ? a.getNewID(this.getTableCase("RELATION"), this.getColumnCase("RELATIONID"), alias) : a.getNewUUID();
                        spalten.push(this.getColumnCase("RELATIONID"));
                        werte.push(relid);
                        typen.push(this.DataType[this.getTableCase("RELATION")][this.getColumnCase("RELATIONID")]);
                        this.insertData(this.getTableCase("RELATION"), spalten, typen, werte, alias);
                    }	
                    break;
                case "I":
                    relid = this.UseUUID != true ? a.getNewID(this.getTableCase("RELATION"), this.getColumnCase("RELATIONID"), alias) : a.getNewUUID();
                    spalten.push(this.getColumnCase("RELATIONID"));
                    werte.push(relid);
                    typen.push(this.DataType[this.getTableCase("RELATION")][this.getColumnCase("RELATIONID")]);
                    this.insertData(this.getTableCase("RELATION"), spalten, typen, werte, alias);
                    break;
                case "U":
                    relid = this.resolveSymbol(pObject, pObject.relationid);
                    id = a.sql("select " + this.getColumnCase("relationid") + " from " + this.getTableCase("relation") + " where " + this.getColumnCase("relationid") + " = '" + relid + "'", alias); 
                    if(id != "") this.updateData(this.getTableCase("RELATION"), spalten, typen, werte, alias);
                    break;
            }
			
            // store the new record ID into an output column, if desired
            if(pObject.Target != undefined) this.setOutput(pObject, relid);
        }
        catch(ex)
        {
            log.log(ex);
            result = false;
        }
    }
	
    return result;
}


/*
* create a pers relation for the private entry (AOTYPE 2) 
* creates only if the relation does not exist yet 
*        
* @param {Object} pObject req the mapping line
*
* @example [ iPersRelation, { Source: 3 } ]
* @example [ iPersRelation, { PersID: "RELATION.PERS_ID", Target: "LINK.RELATION_ID" } ]
*
* @return {Boolean} true
*/
function iPersRelation(pObject)
{
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var spalten = ["RELATIONID", "ORG_ID", "PERS_ID" ];
		
        var werte;
        var pid;
        var relid;
		
        // PersID: "TBL.COL" -> we get the output column's content as the persid
        if(pObject.PersID != undefined) pid = this.getOutput(pObject, "PersID");
		
        // Source: 3 -> we get input set column 3 as the persid
        if(pObject.Source != undefined) pid = this.InputRecord[pObject.Source];
		
        //do we use aotype? -- was missing MJ
        var cond = "";
        if (this.UseAOType == true)
            cond = this.getColumnCase(" and aotype = 2");
        else
            cond = this.getColumnCase(" and " + trim("ORG_ID") + " = '0'");

        relid = a.sql("select " + this.getColumnCase("relationid") + " from " + this.getTableCase("relation") + " where " + this.getColumnCase("pers_id") + " = '" + pid + "' " + cond, this.Config.AliasTo);  
       
		
        if(relid == "")  // if it does not exist, create it
        {
            if(this.Preview == true)
            {
                this.writeLog(this.LogLevels.Preview, "[iPersRelation] Inserting pers relation entry (AOTYPE 2) for PERSID " + pid);
            }	
            else
            {
                relid = this.UseUUID != true ? a.getNewID(this.getTableCase("RELATION"), this.getColumnCase("RELATIONID"), this.Config.AliasTo) : a.getNewUUID();
                werte = [relid, "2", "0", pid];
				
                //do we use AOType? 
                if (this.UseAOType == true)
                {
                    spalten.push(this.getColumnCase("AOTYPE"));
                    werte.push("2");
                }			
				
                var typen = [];
                for(var i=0; i < spalten.length; i++) 
                {
                    typen[i] = this.DataType[this.getTableCase("RELATION")][this.getColumnCase(spalten[i])];
                    spalten[i] = this.getColumnCase(spalten[i]);
                }
				
                this.insertData(this.getTableCase("RELATION"), spalten, typen, werte, this.Config.AliasTo);
            }
        }
		
        // Target: "TBL.COL" -> if output column is specified, yield the RELATIONID
        if(pObject.Target != undefined) this.setOutput(pObject, relid);
    }
	
    return true;
}


/*
* imports an document
* draft: Container: "string", Row: "TBL.COLID", Source: index, Filename: index, Tablename: "string", 
* Description: "string", Keywords: "string"
*
* @param {Object} pObject req the mapping line
*
* @return {Boolean} true, if import of the data was successful, otherwise false
*/
function iDocument(pObject)
{
    var result = true;
	
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        // iDocument is insert-only
        this.setDefaultAction(pObject);
        if(pObject.Action != "I") return result;
		
        try
        {
            var spalten = ["ID", "CONTAINERNAME", "BINDATA", "FILENAME", "DESCRIPTION", "KEYWORD", "ROW_ID", "TABLENAME" ];
            var typen = [];
            for(var i=0; i < spalten.length; i++) 
            {
                typen[i] = this.DataType[this.getTableCase("ASYS_BINARIES")][this.getColumnCase(spalten[i])];
                spalten[i] = this.getColumnCase(spalten[i]);
            }

            var desc = "";
            if(pObject.Description != undefined) desc = this.InputRecord[pObject.Description];
            var keyw = "";
            if(pObject.Keywords != undefined) desc = this.InputRecord[pObject.Keywords];
            var werte = [ "" , 
            pObject.Container, 
            this.InputRecord[pObject.Source], 
            this.InputRecord[pObject.Filename], 
            desc, 
            keyw, 
            this.getOutput(pObject, "Rowid"),
            pObject.Tablename ];	

            werte[0] = this.UseUUID != true ? a.getNewID(this.getTableCase("ASYS_BINARIES"), this.getColumnCase("ID"), this.Config.AliasTo) : a.getNewUUID();
			
            if(pObject.Rowid != "" && pObject.Filename != "") this.insertData(pObject.Table, spalten, typen, werte, this.Config.AliasTo);
        }
        catch(ex)
        {
            log.log(ex);
            result = false;
        }
    }
	
    return result;
}


/*
* import a timestamp string in a specified format into a date field 
*    Values of the mapping line:
*    String Source req the column index for the current record
*    String Target req target column name
*    String Format opt The timestamp format, default is YYYY-MM-DD HH:MI:SS
*    String Timezone opt The timezone string, default is Europe/Berlin (CET/CEDST) 
*
* @param {Object} pObject req the mapping line
*
* @return {Boolean} true, if the import of the timestamp was successfull, otherwise false
*/
function iTimestamp(pObject)
{
    var result = true;
	
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var fmt = pObject.Format;
        var tz = pObject.Timezone;
        if(fmt == undefined || fmt == "") fmt = "yyyy-MM-dd HH:mm:ss";
        if(tz == undefined || tz == "") tz = "Europe/Berlin";
        try
        {
            this.setOutput(pObject, date.dateToLong(this.InputRecord[pObject.Source], fmt, tz));
        }
        catch(ex)
        {
            log.log(ex);
            result = false;
        }
    }
	
    return result;
}


/*
* decode an input entry by searching thru a translation list 
*    Values of the mapping line:
*    String Value -- the input data
*    String Target -- the target column
*    String List -- the decode list, format: data;replacement;data;replacement.....
*
* @param {Object} pObject req the mapping line
*
* @return {Boolean} true, if the the decoding was successfull, otherwise false
*/
function iDecode(pObject)
{
    var result = true;
	
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var wert = "";
        if(pObject.Source != undefined) wert = this.InputRecord[pObject.Source];
        if(pObject.Value != undefined) wert = this.resolveSymbol(pObject, pObject.Value);
		
        var list = pObject.List;
        var map = new Object();
        if(list != undefined)
        {
            // convert decode list into map
            list = list.split(";");
			
            //is the list complete?
            if(list.length % 2 == 0)
            {
                for(var i=0; i < list.length; i=i+2)
                {
                    map[list[i]] = list[i+1];
                }
				
                // use map entry to decode
                if(wert != "") wert = map[wert];
				
                //if not found, set default to empty
                if(wert == undefined) wert = "";
            }
            else
            {
                //list is not correct, so wert = "" and log error message
                wert = "";
                this.writeLog(this.LogLevels.Error, "[iDecode] List is not correct!");
            }
			
            // write to output buffer
            this.setOutput(pObject, wert);
        }
        else
        {
            result = false;
        }
    }
	
    return result;
}


/*
* save an input in a globalvar 
*    Values of the mapping line:
*    String Value -- the input data
*    String Name -- the name for the globalvar
*
* @param {Object} pObject req the mapping line
*
* @example [(iGlobalVar {Value: "{3}", Name: "importLogin"} )     -->  $global.importLogin]
*
* @return {void}
*/
function iGlobalVar(pObject)
{
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {
        var value = "";
        var name = "";
        if(pObject.Source != undefined) value = this.InputRecord[pObject.Source];
        if(pObject.Value != undefined) value = this.resolveSymbol(pObject, pObject.Value);
        if(pObject.Name != undefined) name = pObject.Name;
        a.globalvar("$global." + name, value);  
    }
}



/*
* do character set translation.
* basically works like iMove, but allows to specify a conversion map
* that will be used to process the input data.
* conversion map is a map (directionary, associative array, whatever you call it).
* declare a varaible like theMap = new Array(); theMap("a") = "X"; theMap("b") = "z"; etc. ...
* and specify this a sthe value for the Parameter "Map"
*
* Important! Usage of "Method" parameter value "replaceall" requires ADITO online 3.0.3 or above!
*
* Values of the mapping line:
* String Value -- the input data
* String Target -- the target column
* String Map -- the decode map 
* String Method -- which Method to use: "js", "replaceall" (default to "js")]
*
* @param {Object} pObject req the mapping line
*
* @return {Boolean} 
*/
function iCharMap(pObject)
{
    var result = true;
	
    //is any DoIf-condition set?
    if(pObject.DoIf == undefined || (pObject.DoIf != undefined && eval(this.resolveSymbol(pObject, pObject.DoIf)) == true))
    {	
        var wert = "";
        if(pObject.Source != undefined) wert = this.InputRecord[pObject.Source];
        if(pObject.Value != undefined) wert = this.resolveSymbol(pObject, pObject.Value);
		
        var map = pObject.Map;
		
        if(map != undefined)
        {
            if(pObject.Method == undefined) pObject.Method = "js";  // default to JavaScript
            this.writeLog(this.LogLevels.Debug, "[iCharMap] Using mapping method '" + pObject.Method + "' for mapping in iCharMap");
			
            switch(pObject.Method)
            {
                case "js" :
                    for (var i in map)
                    {
                        wert = wert.replace(new RegExp(i, "gi"), map[i]);
                    }
                    break;
						
                case "replaceall" :
                    wert = a.replaceAll(wert, map);
                    break;
            }
			
            // write to output buffer
            this.setOutput(pObject, wert);
			
        }
        else
        {
            this.writeLog(this.LogLevels.Warning, "[iCharMap] Map for iCharMap missing or undefined/empty");
            result = false;
        }
    }
	
    return result;
}


// ende