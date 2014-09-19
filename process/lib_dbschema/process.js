/*
* Abbildung einer Tabelle als Objekt
*
* @return {void}
*/
function TableObject()
{
    this.name = "";
    this.longname = "";
    this.description = "";
    this.tabletype = "U";
    this.uselongnames = "true";
    this.databasetype = -1;
    this.separator = ";";
    this.scriptprimarykey = "true";
    this.scriptindex = "true";
    this.column = new Array();
    this.index = new Array();
    this.module = "";
    this.tableid = "";  
    TableObject.prototype.getDeclaration = getTblDeclaration;
    TableObject.prototype.getIndexDeclaration = getIdxDeclaration;
    TableObject.prototype.getXmlObject = getTblXmlObj;
    TableObject.prototype.getTableID = getTableRepoID;
    TableObject.prototype.getColumnWithName = getColObjName;
    TableObject.prototype.getColumnWithIndex = getColObjIndex;
    TableObject.prototype.removeColumns = tbl_removeColumns;
    TableObject.prototype.addIndex = tbl_addIndex;
    TableObject.prototype.removeIndex = tbl_removeIndex;	
    TableObject.prototype.updateColumn = tbl_updateColumn;
    TableObject.prototype.getNonMatchingColumns = tbl_getNonMatchingColumns;
    TableObject.prototype.existsInRepo = existsInRepo;
    TableObject.prototype.transferColumnToRepository = tbl_addOrReplaceColumn;
    TableObject.prototype.transferColumnToDatabase = tbl_transferColToDb;
}
	
/*
* Abbildung einer Spalte als Objekt
*
* @param {TableObject} pTable req Tabelle zu der die Spalte gehört
*
* @return {void}
*/
function ColumnObject(pTable)
{
    this.parent = pTable;
    this.name = "";
    this.longname = "";
    this.size = "";
    this.nullability = "Y";
    this.description = "";	
    this.type = "";
    this.constraint = "";
    this.tableref = "";
    this.columnref = "";
    this.customized = "N";
    this.internal = "N";
    this.keyname = "";
    ColumnObject.prototype.getDeclaration = getColDeclaration;
    ColumnObject.prototype.getComment = getColComment;
    ColumnObject.prototype.isIndexed = col_isIndexed;
    ColumnObject.prototype.existsInDatabase = col_existsInDb;
}

/*
* Abbildung eines Index als Objekt
*
* @param {TableObject} pTable req Tabelle zu welcher der Index gehört
*
* @return {void}
*/
function IndexObject(pTable)
{
    this.parent = pTable;
    this.name = "";
    this.isunique = "N";
    this.columnlist = new Array();
}

/*
* Abbildung eines Repositories als Objekt
*
* @return {void}
*/
function RepositoryObject()
{
    this.removeTable = removeTableFromRepo;
    this.hasTable = chkRepoForTable;
    this.writeToRepository = saveToDb;
    this.tableFromRepositoryName = loadFromDb;
    this.tableFromRepositoryID = loadFromRepoID;
    this.tablenameFromID  = getTableNameForID;
    this.tableFromAlias = loadFromAlias;
    this.tableFromXml = loadFromXml;
    this.getTableID = getTableRepoID;
    this.exportRepository = exportRepo;
    this.columnFromAlias = getColumnMetadata;
    this.getDatabaseAliases = getDefinedDbAliases;
    this.getTableDifference = getTblDiff;
    this.copyTables = repo_copyTables;
    this.checkAutoIndex = repo_checkAutoIndex;
    this.getTables = repo_getTables;
    this.getCommonTables = repo_getCommonTables;
}


/*
* liefert einen zeit- und zufallswertbestimmten namensteil fuer automatisch erzeugte datenbankobjekte
* 
* @return {String} -- der zufaelig erzeugte Namensbestandteil 
*/
function getRandomName()
{
    var now = date.date();
    var rnd = 1000 + parseInt( Math.random() * ( 9999 - 1000 + 1 ));
    var res = "I" + now.toString() + rnd.toString();
    return res;
}

/*
* {[]}
*
* @author AH
*
* @return {[]}
*/
function getDefinedDbAliases()
{
    var aliases = a.getDataModels(a.DATAMODEL_KIND_ALIAS);
    var res = new Array();
    for(var i = 0; i < aliases.length; i++)
    {
        try
        {
            var alias = a.getAliasModel(aliases[i][0]);
            var dbtype = alias[a.ALIAS_PROPERTIES]["databasetype"];
            if((dbtype != "") && (dbtype != undefined))
            {
                res.push( aliases[i][0] );
            }
        }
        catch(ex)
        {
            log.log(ex);
        }
    }

    return res;
}

/*
* liefert einen String mit einem SQL-Kommentare, der den Langnamen einer tabelle enthält 
* 
* @author AH
* 
* @return {String}
*/
function getColComment()
{
    if(this.longname != "") 
    {
        return "  -- " + this.longname;
    }
    else
    {
        return "";
    }
}

/*
* Liefert eine Referenz auf eine Spalte.
* 
* @author AH
* @param {String} pColname req Spaltenname
* 
* @return {String} mit dem Namen der Spalte
*/
function getColObjName(pColname)
{
    var col;
    var wo = 0;
    var found = false;
    while(!found && (wo < this.column.length))
    {
        found = this.column[wo]["name"].toLowerCase() == pColname.toLowerCase();
        if(!found) wo++;
    }
    if(found)
        return this.column[wo];
    else
        return undefined;   
}

/*

* liefert eine Referenz auf eine Spalte
* 
* @author AH
* @param {Integer} pIndex req 
* 
* @return {String}
*/
function getColObjIndex(pIndex)
{
    if((this.column.length > pIndex) && (pIndex >= 0))
        return this.column[pIndex];
    else
        return undefined;   
}

/*
* {[]}
*
* @author AH
*
* @return {String}
*/
function getColDeclaration()
{
    var sql;
	
    if((this != undefined) && (this.name != ""))
    {
        if(this.parent.databasetype != -1)
        {
            sql = this.name + " " + getDatabaseType(this.parent.databasetype, this.type);
            if(this.size != "") sql += "(" + this.size + ") ";
            if(this.nullability == "N") sql += " NOT NULL "; // else sql += " NULL ";
        }
        else
        {
            sql = " - " + this.longname + " => " + getDatabaseType(this.parent.databasetype, this.type);
        }
    }
    else
    {
        sql = "";
    }
	
    return sql;
}

/*
* liefert die Anweisungen fuer die Erzeugung der Indices als Array
* 
* @author AH
* 
* @return {[]}
*/
function getIdxDeclaration()
{
    var stmt;
    var result = new Array();
    var dblimit = getDbLimits(this.databasetype);  // dblimit = { tblname:30, colname:30, idxname:30, idxcols:32, idxnum:32 };

	
    // alle indices fuer dieses tabellenobjekt durchlaufen
    for(var i = 0; i < this.index.length; i++)
    {
        // nur statement erzeugen, wenn wir auch spalten fuer den index definiert haben
        if(this.index[i].columnlist.length > 0)
        {
            // indexnamen bestimmen, bei bedarf auf das limit der datenbank kürzen
            var idxname = this.index[i].name;
            dblimit.idxname = Number(dblimit.idxname);
            if(idxname.length > dblimit.idxname)
            {
                // automatisch erzeugten namen verwenden, der unterhalb der maximallänge bleibt
                // wir schneiden den indexnamen von links ab, damit bei einer evtl. kollision
                // des zufallsnamens die indexnamen möglichst unterschiedlich bleiben
                idxname = getRandomName();
            }
			
            stmt = "CREATE ";
            if((this.index[i].isunique == "Y") || (this.index[i].isunique == "true")) stmt += " UNIQUE ";
            stmt += " INDEX " + idxname + " ON ";
            stmt += this.name + "(" + this.index[i].columnlist.join(",") + ") " + this.separator;
            result.push(stmt);
        }
    }	
	
    return result;
}

/*
* liefert die Anweisungen fuer die Erzeugung der Tabellen als String
*
* @author AH
*
* @return {String}
*/
function getTblDeclaration()
{
    var sql = "";
    var pkcol; // enthält eine evtl. definierten primary key
    if((this != "") && (this.name != ""))
    {
	
        if(this.databasetype != -1)
        {
            if(this.uselongnames == "true") if(this.longname != "") sql += "-- " + this.longname + "\n";
            sql += "CREATE TABLE " + this.name + "\n";
        }
        else
        {
            sql = "Struktur der Tabelle " + this.longname + " (intern: " + this.name + ")\n";
        }
		
        sql += "(\n";
		
        for(var i = 0; i < this.column.length; i++)
        {
            sql += "   " + this.column[i].getDeclaration();
            if(i < this.column.length-1) sql += ", ";
            if(this.uselongnames == "true") sql += this.column[i].getComment() 
            sql +=  "\n";
            if(this.column[i].constraint == "p") pkcol = this.column[i].name;
        }
	  
        // bei bedarf primary key anlegen
        if((this.scriptprimarykey == "true") && (pkcol != "" && pkcol != undefined))  
        {
            if ( this.databasetype == a.DBTYPE_SQLSERVER2000 )	sql += "   , PRIMARY KEY NONCLUSTERED(" + pkcol + ")\n";
            else	sql += "   , PRIMARY KEY(" + pkcol + ")\n";
        }
        // keinen default für den separator, wenn leer, dann leer
        // if((this.separator == "")|| (this.separator == undefined)) this.separator  = ";";
        sql += ")" + this.separator + "\n\n";
    }
    return sql;
}

/*
* {[]}
*
* @author AH
*
* @return {Object}
*/
function getTblXmlObj()
{
    var sxml = new XML("<table />");
    sxml.@name = this.name;
    sxml.@tabletype = this.tabletype;
    sxml.tableinfo = "";
    sxml.tableinfo.longname = this.longname;
    sxml.tableinfo.description = this.description;
    sxml.tableinfo.module = this.module; // 2008-04-28-ah
    sxml.column = "";

    for(var i = 0; i < this.column.length; i++)
    {
        sxml.column[i] = "";
        sxml.column[i].@name = this.column[i].name;
        sxml.column[i].longname = this.column[i].longname;
        sxml.column[i].size = this.column[i].size;
        sxml.column[i].datatype = this.column[i].type;
        if(this.column[i].type == "keyword") sxml.column[i].datatype.@keyname = this.column[i].keyname;   // 2008-07-11-ah
        sxml.column[i].description = this.column[i].description;
        if(this.column[i].customized == "Y") sxml.column[i].@customized = "true";  // 2008-04-30-ah
        if(this.column[i].nullability == "N")
            sxml.column[i].nullability = "false";
        else
            sxml.column[i].nullability = "true";

        if(this.column[i].constraint != "")
        {
            sxml.column[i].constraint = "";
            if(this.column[i].constraint.toLowerCase() == "p") sxml.column[i].constraint.@type = "primary";

            if(this.column[i].constraint.toLowerCase() == "f")
            {
                sxml.column[i].constraint.@type = "foreign";
                sxml.column[i].constraint.@tableref = this.column[i].tableref;
                sxml.column[i].constraint.@columnref = this.column[i].columnref;
            }
        }
    }
	
    return sxml;
}


/*
* Exportiert das Repository
*
* @author AH
*
* @param {[]} pTableArray req Array mit allen Tabellen
* @param {String} pFilename req Dateiname
* @param {Boolean} pIncludeXSL req Gibt an, ob das XSL inkludiert werden soll
*
* @return {void}
*/
function exportRepo(pTableArray, pFilename, pIncludeXSL)
{
    var repxml = new XML("<project><datamodel /></project>");
	
    var tblxml;
    var tblobj;
	
    repxml.datamodel.table = "";
	
    for(var i = 0; i < pTableArray.length; i++)
    {
        tblobj = this.tableFromRepositoryID(pTableArray[i]);
        tblxml = tblobj.getXmlObject();	
		
        repxml.datamodel.table[i] = "";
        repxml.datamodel.table[i] = tblxml;
    }

    var s = "<?xml version='1.0' encoding='windows-1252' ?>\r\n";
    if(pIncludeXSL == true) 
    {
        s += '<?xml-stylesheet type="text/xsl" href="htmloverview.xsl" ?>\r\n';
    }
	
    a.doClientIntermediate(a.CLIENTCMD_STOREDATA, new Array(pFilename, s + repxml.toString(), a.DATA_TEXT, "false"));
}

/*
* liest eine tabellendefinitoin aus xml ein, liefert null, falls die tabelle bereits existiert.
*
* @author AH
*
* @param {Object} pXml
*
* @return {Object}
*/
function loadFromXml(pXml)
{
    var xmldoc = pXml;
    var tblobj = null;

    tblobj = new TableObject();
    tblobj.name = xmldoc.@name;

    if(xmldoc.tableinfo.longname.length() > 0) tblobj.longname = xmldoc.tableinfo.longname; else tblobj.longname = "";
    if(xmldoc.tableinfo.description.length() > 0) tblobj.description = xmldoc.tableinfo.description; else tblobj.description = "";
    if(xmldoc.tableinfo.module.length() > 0) tblobj.module = xmldoc.tableinfo.module;
    tblobj.uselongnames = "true";
    tblobj.tabletype = "U";	
    tblobj.tableid = "";

    // importieren der einzelnen spalten aus der xml-beschreibung
    for(var i = 0; i < xmldoc.column.length(); i++)
    {
        col = new ColumnObject();
        col.parent = tblobj;
        col.name = xmldoc.column[i].@name.toString();
        col.description = xmldoc.column[i].description.toString();
  	 	
        if(xmldoc.column[i].longname.length() > 0) col.longname = xmldoc.column[i].longname; else col.longname = "";
        col.size = xmldoc.column[i].size.toString();
        col.type = xmldoc.column[i].datatype.toString();
  	
        col.nullability = xmldoc.column[i].nullability.toString();
        col.customized = xmldoc.column[i].customized.toString();  // 2008-04-28-ah 
        col.internal = xmldoc.column[i].internal.toString(); // 2008-05-13-ah
  	
        if(col.nullability == "true") col.nullability = "Y";
        else if(col.nullability == "false") col.nullability = "N";
        if(col.customized == "true") col.customized = "Y";
        else if(col.customized == "false") col.customized = "N";
        if(col.internal == "true") col.internal = "Y";
        else if(col.internal == "false") col.internal = "N"; // 2008-05-13-ah
        if(col.type == "keyword") col.keyname = xmldoc.column[i].datatype.@keyname; // 2008-07-11-ah
  	 	
        // constraints
        col.constraint = "";
        col.tableref = "";
        col.columnref = "";
        if(xmldoc.column[i].constraint.length() > 0) 
        {
            col.constraint = xmldoc.column[i].constraint.@type;
            col.constraint = col.constraint.substr(0,1).toLowerCase();
            if(xmldoc.column[i].constraint.@tableref.length() > 0) col.tableref = xmldoc.column[i].constraint.@tableref;
            if(xmldoc.column[i].constraint.@columnref.length() > 0) col.columnref = xmldoc.column[i].constraint.@columnref;
        }
        tblobj.column.push(col);
    }
   
    return tblobj;
}

/*
* lädt ein tabellenobjekt aus dem repository 
* 
* @author AH
* 
* @param {String} pTablename req Tabellenname
* 
* @return {Object}
*/	
function loadFromDb(pTablename)
{
    var qry;
    var i;
    var tbldata = a.sql("select tablename, longname, description, tabletype, tableid, aomodule from aosys_tablerepository where tablename = '" + pTablename + "'", a.SQL_ROW);         
    if(tbldata.length > 0)
    {
        var tblobj = new TableObject();
        tblobj.name = tbldata[0];
        tblobj.longname = tbldata[1];
        tblobj.description = tbldata[2];
        tblobj.tabletype = tbldata[3];
        tblobj.tableid = tbldata[4]; // 2008-06-30-ah added id property
        tblobj.uselongnames = "true";
        pTableID = tbldata[4];
        tblobj.module = tbldata[5];
	
        qry = " select columnname, longname, columnsize, datatype, nullable, "
        + " constrainttype, tableref, columnref, internaluse, description, customized, keyname "
        + " from aosys_columnrepository "
        + " where table_id = '" + pTableID + "'";
        var coldata = a.sql(qry, a.SQL_COMPLETE);
	  
        var col;
        for(i = 0; i < coldata.length; i++)
        {
            col = new ColumnObject();
            col.name = coldata[i][0];
            col.longname = coldata[i][1];
            col.size = coldata[i][2];
            col.type = coldata[i][3];
            col.nullability = coldata[i][4];
            col.constraint = coldata[i][5];
            col.tableref = coldata[i][6];
            col.columnref = coldata[i][7];
            col.internal = coldata[i][8];
            col.description = coldata[i][9];
            col.customized = coldata[i][10];   // 2008-04-28-ah
            col.keyname = coldata[i][11];   // 2008-07-11-ah
            col.parent = tblobj;
            tblobj.column.push(col);
        }
	  
        // get index declarations, if one exists
        qry = " select indexname, isunique, columnlist "
        + " from aosys_indexrepository "
        + " where table_id = '" + pTableID + "'";
        var idxdata = a.sql(qry, a.SQL_COMPLETE);
        var idx;
        for(i = 0; i < idxdata.length; i++)
        {
            idx = new IndexObject();
            idx.name = idxdata[i][0];
            idx.isunique = idxdata[i][1];
            idx.columnlist = a.decodeMS(idxdata[i][2]);
            idx.parent = tblobj;
            tblobj.index.push(idx);
        }
	  
        return tblobj;
    }
    else
    {
        return null;
    }
}

/*
* {[]}
*
* @author AH
*
* @param {Integer} pTableID req ID des Datensatzes
* 
* @return {String}
*/	
function getTableNameForID(pTableID)
{
    return a.sql("select tablename from aosys_tablerepository where tableid = '" + pTableID + "'");
}

/*
* get column name from aosys_clumnrepository.columnid 
*
* @param {String} pColumnID req the db column id
*
* @return {String} column name as string
*/
function getColumnNameFromID(pColumnID)
{
    return a.sql("select columnname from aosys_columnrepository where columnid = '" + pColumnID + "'");
}

/*
* {[]}
*
* @author AH
*
* @param {Integer} pTableID req ID des Datensatzes
*
* @return {Object}
*/	
function loadFromRepoID(pTableID)
{
    var tblname = getTableNameForID(pTableID);
    if(tblname != "")
    {
        return loadFromDb(tblname);
    }
    else
    {
        return null;
    }
}

/*
* {[]}
*
* @author AH
*
* @param {String} pAlias req Datenbankaliasname
* @param {String} pTable req Name der Tabelle
* @param {String} pColumn req  Name der Spalte
* @param {Integer} pDbType req Datenbanktyp (a.DBTYPE_*)
* @param {String} pCasing req Umwandlung der Bezeichnerschreibweise: KEEP | UPPER | LOWER
*
* @return {Object}
*/	
function getColumnMetadata(pAlias, pTable, pColumn, pDbType, pCasing)
{
    var col;
    var dbtype = Number(pDbType);
    switch(dbtype)
    {
        case a.DBTYPE_ORACLE10_THIN :
        case a.DBTYPE_ORACLE10_OCI :
            col = getColMetaDataORACLE(pAlias, pTable, pColumn);
            break;
        case a.DBTYPE_DERBY10 :
            col = getColMetaDataDerby(pAlias, pTable, pColumn);
            break;
        case a.DBTYPE_INTERBASE7 :
            col = getColMetaDataInterbase(pAlias, pTable, pColumn);
            break;
        case a.DBTYPE_POSTGRESQL8 :
            col = getColMetaDataPOSTGRES(pAlias, pTable, pColumn);
            break;
        case a.DBTYPE_MYSQL4 :
            col = getColMetaDataMySQL(pAlias, pTable, pColumn);
            break;
        case a.DBTYPE_SQLSERVER2000 :
            col = getColMetaDataMSSQL2000(pAlias, pTable, pColumn);				
            break;
        case a.DBTYPE_SYBASE125 :
            col = null;
            break;
    }
	
    if(col != null) {
        col.internal = "N";
        col.customized = "N";
        if(pCasing == "UPPER") col.name = col.name.toUpperCase();
        else if(pCasing == "LOWER") col.name = col.name.toLowerCase();
    }
    return col;
}

/*

* laedt eine tabellendefinition aus einem bestehenden DB-Alias (reverse engineering) 
*
* @author AH
*
* @param {String} pAliasname req Datenbankalias
* @param {String} pTablename opt Name der Tabelle
* @param {String} pCasing opt Gibt Groß- und Kleinschreibung des Tabellennamens an
*
* @return {Object}
*/	
function loadFromAlias(pTablename, pAliasname, pCasing)
{
    var tblobj = new TableObject();

    var alias = a.getAliasModel(pAliasname);
    var dbtype = alias[a.ALIAS_PROPERTIES]["databasetype"];

    if(pTablename != undefined)
        if(pCasing == "UPPER") 
            pTablename = pTablename.toUpperCase(); 
        else 
        if(pCasing == "LOWER") pTablename = pTablename.toLowerCase();

    tblobj.name = pTablename;
    tblobj.longname = pTablename;
    tblobj.description = "Aus dem Datenbankalias " + pAliasname + " importiert am " + date.longToDate(date.date(), "dd.MM.yyyy HH:mm") + "\n";
	
    var spalten = a.getColumns(pAliasname, pTablename);
    var typen = a.getColumnTypes(pAliasname, pTablename, spalten);
    for(var i = 0; i < spalten.length; i++)
    {
        tblobj.column[i] = this.columnFromAlias(pAliasname, pTablename, spalten[i], dbtype, pCasing);
        tblobj.column[i].parent = tblobj;
    }
	
    return tblobj;
}

/*
* {[]}
*
* @author AH
*
* @return {Boolean}
*/	
function existsInRepo()
{
    return chkRepoForTable(this.name);
}

/*
* {[]}
*
* @author AH
*
* @param {String} pTablename req Tabellenname
*
* @return {Boolean}
*/	
function chkRepoForTable(pTablename)
{
    var tblid = a.sql("select tableid from aosys_tablerepository where tablename = '" + pTablename + "'");
    if(tblid != "")
        return true;
    else
        return false;
}

/*
* {[]}
*
* @author AH
*
* @param {String} pTableName req Name der Tabelle
*
* @return {Integer}
*/
function getTableRepoID(pTableName)
{
    var tblid = a.sql("select tableid from aosys_tablerepository where tablename = '" + pTableName + "'");
    return tblid;
}

/*
* {[]}
*
* @author AH
*
* @param {String} pTablename req 
*
* @return {String}
*/
function removeTableFromRepo(pTablename)
{
    try
    {
        a.sqlDelete("AOSYS_COLUMNREPOSITORY", "TABLE_ID = '" + sel[i] + "'");
        a.sqlDelete("AOSYS_TABLEREPOSITORY", "TABLEID = '" + sel[i] + "'");
        return "true";
    }
    catch(ex)
    {
        log.log(ex);
        return "false";
    }
}

/*
* {[]}
*
* @author AH
*
* @param {Object} pTableObj req 
*
* @return {String}
*/
function saveToDb(pTableObj)
{
    try
    {
        var spalten = ["TABLEID", "TABLENAME", "LONGNAME", "DESCRIPTION", "TABLETYPE", "AOMODULE"];
        var typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_TABLEREPOSITORY", spalten);
        var werte = new Array();
        if(this.hasTable(pTableObj.name) == true) 
            werte[0] = this.getTableID(pTableObj.name);
        else 
            werte[0] = a.getNewUUID();
			
        var tableid = werte[0];
        pTableObj.tableid = werte[0];  // 2008-06-30-ah added tableid property
		
        werte[1] = pTableObj.name;
        werte[2] = pTableObj.longname;
        // fehlende longnames durch tabellennamen ersetzen
        if(werte[2] == "") werte[2] = werte[1];
        werte[3] = pTableObj.description;
        werte[4] = pTableObj.tabletype;
        werte[5] = pTableObj.module;

        if(this.hasTable(pTableObj.name)) 
        {
            // update table header
            a.sqlUpdate("AOSYS_TABLEREPOSITORY", spalten, typen, werte, "TABLEID = '" + tableid + "'");

            // delete old columns
            a.sqlDelete("AOSYS_COLUMNREPOSITORY", "TABLE_ID = '" + werte[0] + "'");
        }
        else
        {
            a.sqlInsert("AOSYS_TABLEREPOSITORY", spalten, typen, werte);
        }

        // now write columns
        spalten = ["COLUMNID", "COLUMNNAME", "DATATYPE", "COLUMNSIZE", "NULLABLE", "LONGNAME", 
        "DESCRIPTION", "CONSTRAINTTYPE", "COLUMNREF", "TABLEREF", "TABLE_ID", "INTERNALUSE", "CUSTOMIZED", "KEYNAME", "LOGGING"];
        typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_COLUMNREPOSITORY", spalten);
        werte = new Array();
        for(var i = 0; i < pTableObj.column.length; i++)
        {
            werte[0] = a.getNewUUID();
            werte[1] = pTableObj.column[i].name;
            werte[2] = pTableObj.column[i].type;
            werte[3] = pTableObj.column[i].size;
            werte[4] = pTableObj.column[i].nullability;
            werte[5] = pTableObj.column[i].longname;
            // leere longnames durch den spaltennamen ersetzen
            if(werte[5] == "") werte[5] = werte[1];
            werte[6] = pTableObj.column[i].description;

            werte[7] = pTableObj.column[i].constraint;
            werte[8] = pTableObj.column[i].columnref;
            werte[9] = pTableObj.column[i].tableref;
            werte[10] = tableid;
            werte[11] = pTableObj.column[i].internal;
            werte[12] = pTableObj.column[i].customized;
            werte[13] = pTableObj.column[i].keyname;   
            werte[14] = "N";   // Logging ausgeschaltet

            a.sqlInsert("AOSYS_COLUMNREPOSITORY", spalten, typen, werte);
        }
		
        return "true";
	
    }
    catch(ex)
    {
        log.show(ex);
        return "false";
    }
}

/*
* liefert ein array mit den unterschiedlichen spalten der beiden tabellen jedes array-element enthält ein array mit (0) = srccol und (1) = dstcol
*
* @author AH
*
* @param {Object} pSource req 
* @param {Object} pDestination req 
* 
* @return {[]}
*/
function getTblDiff(pSource, pDestination)
{
    var src, dst;
    var result = new Array();

    // erst alle spalten der quelltabelle durchlaufen
    for(var colindex = 0; colindex < pSource.column.length; colindex++)
    {
        var isdiff = false;
        src = pSource.getColumnWithIndex(colindex);
        dst = pDestination.getColumnWithName(src.name);
        // kommt undefined zurück, dann existiert die spalte nicht in der zieltabelle
        if(dst == undefined)
        {
            isdiff = true;
        }
        else
        {
            // spalte existiert in beiden tabellen, jetzt die metadaten vergleichen
            if(src.type != dst.type) isdiff = true;
            if(src.size != dst.size) isdiff = true;
            if(src.nullability != dst.nullability) isdiff = true;
            if(src.datatype != dst.datatype) isdiff = true;
        }
        if(isdiff) result.push( new Array(src, dst) );
    }	
   
    // jetzt alle spalten der zieltabelle durchlaufen und prüfen,
    // ob eine der spalten in der quelltabelle fehlt
    for(colindex = 0; colindex < pDestination.column.length; colindex++)
    {
        // hier reicht dieser eine vergleich, denn dann fehlt die
        // spalte komplett in der quelltabelle
        dst = pDestination.getColumnWithIndex(colindex);
        src = pSource.getColumnWithName(dst.name);
        if(src == undefined) result.push( new Array(src, dst) );
    }
   
    return result;
}


/*
* {[]}
* 
* @author TM
* 
* @param {String} pAlias req 
* @param {String} pTable req 
* @param {String} pColumn req 
* 
* @return {ColumnObject}
*/
function getColMetaDataInterbase(pAlias, pTable, pColumn)
{
    var sql = "SELECT r.RDB$FIELD_NAME AS field_name, "
    + " f.RDB$FIELD_LENGTH AS field_length,"
    + " f.RDB$FIELD_PRECISION AS field_precision,"
    + " f.RDB$FIELD_SCALE AS field_scale,"
    + " case r.RDB$NULL_FLAG when 1 then 'N' else 'Y' end as nullable,"
    + " f.RDB$FIELD_TYPE "
    + " FROM RDB$RELATION_FIELDS r "
    + " LEFT JOIN RDB$FIELDS f ON r.RDB$FIELD_SOURCE = f.RDB$FIELD_NAME "
    + " LEFT JOIN RDB$COLLATIONS coll ON r.RDB$COLLATION_ID = coll.RDB$COLLATION_ID "
    + " AND f.RDB$CHARACTER_SET_ID = coll.RDB$CHARACTER_SET_ID "
    + " LEFT JOIN RDB$CHARACTER_SETS cset ON f.RDB$CHARACTER_SET_ID = cset.RDB$CHARACTER_SET_ID "
    + " WHERE r.RDB$RELATION_NAME='" + pTable + "' and r.RDB$FIELD_NAME ='" + pColumn + "'";

    var daten = a.sql(sql, pAlias, a.SQL_ROW);
    var typedata = getAditoTypeInterbase(daten[5]);
    var colobj = new ColumnObject();
    colobj.name = daten[0];

    if(typedata[1] == "L")
        colobj.size = daten[1];
    else if (typedata[1] == "S")
    {
        if(daten[2] != "") 
            colobj.size = String(daten[2]) + "," + (daten[3] * -1);
        else    
            colobj.size = 14.4;
    }
    if(typedata[0] == "")
        colobj.type = daten[1];
    else
        colobj.type = typedata[0];
    colobj.nullability = daten[4];

    return colobj;
}



/*
* {[]}
*
* @author AH
*
* @param {String} pAlias req 
* @param {String} pTable req 
* @param {String} pColumn req 
* 
* @return {Object}
*/
function getColMetaDataORACLE(pAlias, pTable, pColumn)
{
    var sql = " select column_name, data_type, data_length, data_precision, data_scale, "
    + " nullable from all_tab_columns "
    + " where column_name = '" + pColumn + "' and table_NAME = '" + pTable + "'";

    var daten = a.sql(sql, pAlias, a.SQL_ROW);
    var typedata = getAditoTypeORACLE(daten[1]);

    var colobj = new ColumnObject();
    colobj.name = daten[0];

    if(typedata[1] == "L")
        colobj.size = daten[2];
    else if (typedata[1] == "S")
        colobj.size = String(daten[3]) + "," + daten[4];
    if(typedata[0] == "")
        colobj.type = daten[1];
    else
        colobj.type = typedata[0];
    colobj.nullability = daten[5];
    return colobj;
}


/*
* {[]}
*
* @author AH
*
* @param {String} pAlias req 
* @param {String} pTable req 
* @param {String} pColumn req 
*
* @return {Object}
*/
function getColMetaDataPOSTGRES(pAlias, pTable, pColumn)
{
    var sql = " SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale, case is_nullable when 'YES' then 'Y' else 'N' end " + 
    "   FROM information_schema.columns " + 
    "  WHERE upper(column_name) = upper('" + pColumn + "') and upper(table_name) = upper('" + pTable + "') ";

    var daten = a.sql(sql, pAlias, a.SQL_ROW);

    var typedata = getAditoTypePOSTGRES(daten[1]);

    var colobj = new ColumnObject();
    colobj.name = daten[0];

    if(typedata[1] == "L")
        colobj.size = daten[2];
    else if (typedata[1] == "S")
        colobj.size = String(daten[3]) + "," + daten[4];
    if(typedata[0] == "")
        colobj.type = daten[1];
    else
        colobj.type = typedata[0];
    colobj.nullability = daten[5];
    return colobj;
}


/*
*  {[]}
*
* @author AH
*
* @param {String} pAlias req 
* @param {String} pTable req 
* @param {String} pColumn req 
*
* @return {Object}
*/
function getColMetaDataMSSQL2000(pAlias, pTable, pColumn)
{
    //	var sql = " select sc.name, systypes.name, sc.length, sc.xprec, sc.xscale, "
    //	        + " case isnullable when 1 then 'Y' when 0 then 'N' end as nullable "
    //	        + " from syscolumns sc join systypes on (sc.xtype = systypes.xtype) "
    //	        + " where sc.name = '" + pColumn + "' "
    //	        + " and id = Object_id('" + pTable + "') ";
	        
    var sql = " select column_name, data_type, character_maximum_length, numeric_precision, numeric_scale, "
    + " case is_nullable when 'YES' then 'Y' when 'NO' then 'N' end as nullable "
    + " from information_schema.columns "
    + " where table_name = '" + pTable + "' and COLUMN_NAME = '" + pColumn + "' ";
	        
    var daten = a.sql(sql, pAlias, a.SQL_ROW);
    var typedata = getAditoTypeMSSQL2000(daten[1]);
	        
    var colobj = new ColumnObject();
    colobj.name = daten[0];

    if(typedata[1] == "L")
        colobj.size = daten[2];
    else if (typedata[1] == "S")
        colobj.size = String(daten[3]) + "," + daten[4];
    if(typedata[0] == "")
        colobj.type = daten[1];
    else
        colobj.type = typedata[0];
    colobj.nullability = daten[5];
	
    var desc = "";
    //	try
    //	{
    //		// check for description by queying the extended properties
    //		var sql = "	SELECT   value "
    //		        + " FROM  ::fn_listextendedproperty (NULL, 'user', 'dbo', 'table', '" 
    //		        + pTable + "', 'column', '" + pColumn + "') "
    //		        + " WHERE name = 'MS_Description' ";
    //		desc = a.sql(sql);
    //	}
    //	catch(ex)
    //	{
    //		log.log("[REPOMGR] Reading extended column properties failed.");
    //	}
		
    if(desc != "")
    {
        colobj.description = desc;
        colobj.longname = desc.substr(0, 64);
    }
	
    return colobj;
}

/*
* {[]}
*
* @author AH
*
* @param {String} pAlias req 
* @param {String} pTable req 
* @param {String} pColumn req 
*
* @return {Object}
*/
function getColMetaDataMySQL(pAlias, pTable, pColumn)
{
    var sql = " SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, NUMERIC_PRECISION, NUMERIC_SCALE, case IS_NULLABLE when 'YES' then 'Y' else 'N' end "
    + " FROM INFORMATION_SCHEMA.COLUMNS "
    + " where COLUMN_NAME = '" + pColumn + "' and table_NAME = '" + pTable + "'";

    var daten = a.sql(sql, pAlias, a.SQL_ROW);
    var typedata = getAditoTypeMySQL(daten[1]);

    var colobj = new ColumnObject();
    colobj.name = daten[0];

    if(typedata[1] == "L")
        colobj.size = daten[2];
    else if (typedata[1] == "S")
        colobj.size = String(daten[3]) + "," + daten[4];
    if(typedata[0] == "")
        colobj.type = daten[1];
    else
        colobj.type = typedata[0];
    colobj.nullability = daten[5];
    return colobj;
}


/*
* {[]}
*
* @author AH
*
* @param {String} pAlias req 
* @param {String} pTable req 
* @param {String} pColumn req 
*
* @return {Object}
*/
function getColMetaDataDerby(pAlias, pTable, pColumn)
{
    var sql = " select columnname,cast(columndatatype as varchar(255)) from sys.systables "
    + " join sys.syscolumns on (referenceid = tableid) "
    + " where COLUMNNAME = '" + pColumn + "' and TABLENAME = '" + pTable + "'";

    var daten = a.sql(sql, pAlias, a.SQL_ROW);
    var position_parenthesis_begin = daten[1].indexOf("(");
    var position_parenthesis_end = daten[1].indexOf(")");
    var position_datatype_end = daten[1].indexOf(" ");
    var nullable = daten[1].indexOf("NOT NULL");
    var datatype;
    if(position_parenthesis_begin != -1)
        datatype	= daten[1].substring(0, position_parenthesis_begin);
    else if(position_parenthesis_begin == -1 && nullable != -1)
        datatype = daten[1].substring(0, position_datatype_end);				
    else
        datatype = daten[1];
    var dbtype_length = daten[1].substring(position_parenthesis_begin+1, position_parenthesis_end);
    var isnull;
    if(nullable == -1)
    {
        isnull = "Y";
    }
    else if(nullable != -1)
    {
        isnull = "N";
    }

    var typedata = getAditoTypeDerby(datatype);
	
    if(typedata[0] =="text" || typedata[0] =="image")
        dbtype_length = "";

    var colobj = new ColumnObject();
    colobj.name = daten[0];
    colobj.type = typedata[0];
    colobj.size = dbtype_length;
    colobj.nullability = isnull;
    return colobj;
}

/*
* {[]}
* 
* @author TM
* 
* @param {String} pNativeType req Datentyp
* 
* @return {[]} aus <repository_type>, <sizing_info> = N no size, L = length only, S = scale and precision
*/
function getAditoTypeInterbase(pNativeType)
{
    if(pNativeType != "")
    {
        pNativeType = a.strToLong(pNativeType)
        var res = new Array();
        switch(pNativeType)
        {
            // hier anpassen fuer intebase type code/name => repository typ
            case 261           :
                res = ["text", "N"];
                break;
            case 7             :
                res = ["integer", "N"];
                break;
            case 8             :
                res = ["integer", "N"];
                break;
            case 35            :
                res = ["datetime", "N"];
                break;
            case 16            :
                res = ["float", "S"];
                break;
            case 10            :
                res = ["float", "S"];
                break;
            case 27            :
                res = ["float", "S"];
                break;
            case 11            :
                res = ["float", "S"];
                break;
            case 37            :
                res = ["varchar", "L"];
                break;
            case 14            :
                res = ["char", "L"];
                break;
            // last resort, take native data type name
            default:
                res = [pNativeType, "N"];
                break;  
        }
        return res; 
    }
    else
    {
        return null;
    }   
}
 

/*
* []
* 
* @author TM
* 
* @param {String} pNativeType req Datentyp
* 
* @return {[]} aus <repository_type>, <sizing_info> = N no size, L = length only, S = scale and precision
*/
function getAditoTypePOSTGRES(pNativeType)
{
    if(pNativeType != "")
    {
        pNativeType = pNativeType.toLowerCase();
        var res = new Array();
        switch(pNativeType)
        {
            case "bigint":
            case "bigserial":
            case "serial8":
            case "int8":
                res = ["numeric", "S"];
                break;	
		
            case "character varying":
            case "varchar":
                res = ["varchar", "L"];
                break;
		
            case "character":
            case "char" :
                res = ["char", "L"];
                break;
		
            case "date":
            case "calendar date":
                res	= ["datetime", "N"];
                break;
		
            case "double precision":
            case "float8":
                res = ["float", "S"];
                break;
		
            case "money":
            case "currency amount":
                res = ["numeric", "S"];
                break;
		
            case "numeric":
            case "decimal":
                res = ["numeric", "S"];
                break;
		
            case "text":
                res = ["text", "N"];
                break;
		
            case "integer":
            case "int":
            case "int4":
                res = ["integer", "N"];
                break;
		
            case "bytea":
                res = ["image", "N"];
                break;

            // last resort, take native data type name
            default:
                res = [pNativeType, "N"];
                break;  
        }
        return res; 
    }
    else
    {
        return null;
    }   
}

 
/*
* {[]}
*
* @author AH
*
* @param {String} pNativeType req Datentyp
*
* @return {[]}
*/
function getAditoTypeMSSQL2000(pNativeType)
{
    if(pNativeType != "")
    {
        pNativeType = pNativeType.toUpperCase();
        var res = new Array();
        switch(pNativeType)
        {
            case "IMAGE"            :
                res = ["image", "N"];
                break;
            case "TEXT"             :
                res = ["text", "N"];
                break;
            case "UNIQUEIDENTIFIER" :
                res = ["", "N"];
                break;
            case "TINYINT"          :
                res = ["integer", "N"];
                break;
            case "SMALLINT"         :
                res = ["integer", "N"];
                break;
            case "INT"              :
                res = ["integer", "N"];
                break;
            case "SMALLDATETIME"    :
                res = ["datetime", "N"];
                break;
            case "REAL"             :
                res = ["float", "S"];
                break;
            case "MONEY"            :
                res = ["", "N"];
                break;
            case "DATETIME"         :
                res = ["datetime", "N"];
                break;
            case "FLOAT"            :
                res = ["float", "S"];
                break;
            case "SQL_VARIANT"      :
                res = ["", "N"];
                break;
            case "NTEXT"            :
                res = ["ntext", "N"];
                break;
            case "BIT"              :
                res = ["", "N"];
                break;
            case "DECIMAL"          :
                res = ["numeric", "S"];
                break;
            case "NUMERIC"          :
                res = ["numeric", "S"];
                break;
            case "SMALLMONEY"       :
                res = ["", "N"];
                break;
            case "BIGINT"           :
                res = ["", "N"];
                break;
            case "VARBINARY"        :
                res = ["", "L"];
                break;
            case "VARCHAR"          :
                res = ["varchar", "L"];
                break;
            case "BINARY"           :
                res = ["", "L"];
                break;
            case "CHAR"             :
                res = ["char", "L"];
                break;
            case "TIMESTAMP"        :
                res = ["", "N"];
                break;
            case "SYSNAME"          :
                res = ["", "L"];
                break;
            case "NVARCHAR"         :
                res = ["nvarchar", "L"];
                break;
            case "NCHAR"            :
                res = ["nchar", "L"];
                break;
            // last resort, take native data type name
            default:
                res = [pNativeType, "N"];
                break;  
        }
        return res; 
    }
    else
    {
        return null;
    }   
}

/*
* {[]}
*
* @author AH
*
* @param {String} pNativeType req Datentyp
*
* @return {[]}
*/
function getAditoTypeORACLE(pNativeType)
{
    if(pNativeType != "")
    {
        pNativeType = pNativeType.toUpperCase();
        var res = new Array();
        switch(pNativeType)
        {
            case "BLOB" :
                res = ["image", "N"];
                break;
            case "CHAR" :
                res = ["char", "L"];
                break;
            case "CLOB" :
                res = ["text", "N"];
                break;
            case "DATE" :
                res = ["datetime", "N"];
                break;
            case "FLOAT" :
                res = ["float", "S"];
                break;
            case "LONG" :
                res = ["", "N"];
                break;
            case "LONG RAW" :
                res = ["image", "N"];
                break;
            case "NCHAR" :
                res = ["nchar", "L"];
                break;
            case "NCLOB" :
                res = ["ntext", "N"];
                break;
            case "NUMBER" :
                res = ["numeric", "S"];
                break;
            case "NVARCHAR2" :
                res = ["nvarchar", "L"];
                break;
            case "RAW" :
                res = ["", "N"];
                break;
            case "ROWID" :
                res = ["", "N"];
                break;
            case "TIMESTAMP(0)" :
                res = ["", "N"];
                break;
            case "UNDEFINED" :
                res = ["", "N"];
                break;
            case "VARCHAR2" :
                res = ["varchar", "L"];
                break;
            case "XMLTYPE" :
                res = ["", "N"];
                break;
            // last resort, take native data type name
            default:
                res = [pNativeType, "N"];
                break;  
        }
        return res; 
    }
    else
    {
        return null;
    }   
}

/*
* {[]}
*
* @author AH
*
* @param {String} pNativeType req Datentyp
*
* @return {[]}
*/
function getAditoTypeMySQL(pNativeType)
{
    if(pNativeType != "")
    {
        pNativeType = pNativeType.toUpperCase();
        var res = new Array();
        switch(pNativeType)
        {
            case "BLOB" :
                res = ["image", "N"];
                break;
            case "VARCHAR" :
                res = ["varchar", "L"];
                break;
            case "INT" :
                res = ["integer", "L"];
                break;            
            case "CHAR" :
                res = ["char", "L"];
                break;
            case "CLOB" :
                res = ["text", "N"];
                break;
            case "LONGTEXT" :
                res = ["text", "L"];
                break;      
            case "DATE" :
                res = ["datetime", "N"];
                break;
            case "FLOAT" :
                res = ["float", "S"];
                break;
            case "LONGBLOB" :
                res = ["image", "N"];
                break;
            case "NUMBER" :
                res = ["numeric", "S"];
                break;
            case "DECIMAL" :
                res = ["numeric", "S"];
                break;      
            case "TIMESTAMP" :
                res = ["datetime", "N"];
                break;
            case "DATETIME" :
                res = ["datetime", "N"];
                break;      
            // last resort, take native data type name
            default:
                res = [pNativeType, "N"];
                break;  
        }
        return res; 
    }
    else
    {
        return null;
    }   
}

/*
* {[]}
*
* @author AH
*
* @param {String} pNativeType req Datentyp
*
* @return {[]}
*/
function getAditoTypeDerby(pNativeType)
{
    if(pNativeType != "")
    {
        pNativeType = pNativeType.toUpperCase();
        var res = new Array();
        switch(pNativeType)
        {
            case "BLOB" :
                res = ["image", "N"];
                break;
            case "VARCHAR" :
                res = ["varchar", "L"];
                break;
            case "LONGVARCHAR" :
                res = ["varchar", "L"];
                break;
            case "INTEGER" :
                res = ["integer", "L"];
                break;   
            case "BIGINT" :
                res = ["integer", "L"];
                break;           
            case "CHAR" :
                res = ["char", "L"];
                break;
            case "CLOB" :
                res = ["text", "N"];
                break;    
            case "DATE" :
                res = ["datetime", "N"];
                break;
            case "TIME" :
                res = ["datetime", "N"];
                break;
            case "FLOAT" :
                res = ["float", "S"];
                break;
            case "NUMERIC" :
                res = ["numeric", "S"];
                break;  
            case "DECIMAL" :
                res = ["numeric", "S"];
                break; 
            case "DOUBLE" :
                res = ["numeric", "S"];
                break;   
            case "TIMESTAMP" :
                res = ["datetime", "N"];
                break;
            case "DATETIME" :
                res = ["datetime", "N"];
                break;      
            // last resort, take native data type name
            default:
                res = [pNativeType, "N"];
                break;  
        }
        return res; 
    }
    else
    {
        return null;
    }   
}


/*
* {[]}
*
* @author AH
*
* @param {String} pType req Datentyp
*
* @return {String}
*/
function getDerbyTypename(pType)
{
    // default to the native type name, just in case ...
    var r = pType;
    switch(pType)
    {
        case "varchar" :
            r = "varchar";
            break;
        case "char"  :
            r = "char";
            break;
        case "nvarchar"  :
            r = "varchar";
            break;
        case "nchar"  :
            r = "char";
            break;
        case "text"  :
            r = "clob";
            break;
        case "integer"  :
            r = "integer";
            break;
        case "datetime"  :
            r = "timestamp";
            break;
        case "float"  :
            r = "float";
            break;
        case "image"  :
            r = "blob";
            break;
        case "numeric"  :
            r = "numeric";
            break;
        case "keyword" :
            r = "integer";
            break;
    }
    return r;
}

/*
* {[]}
*
* @author AH
*
* @param {String} pType req Datentyp
*
* @return {String}
*/
function getInterbaseTypename(pType)
{
    // default to the native type name, just in case ...
    var r = pType;
    switch(pType)
    {
        case "varchar" :
            r = "varchar";
            break;
        case "char"  :
            r = "char";
            break;
        case "nvarchar"  :
            r = "varchar";
            break;
        case "nchar"  :
            r = "char";
            break;
        case "text"  :
            r = "BLOB SUB_TYPE TEXT SEGMENT SIZE 2048";
            break;
        case "integer"  :
            r = "integer";
            break;
        case "datetime"  :
            r = "timestamp";
            break;
        case "float"  :
            r = "float";
            break;
        case "image"  :
            r = "BLOB SUB_TYPE 0 SEGMENT SIZE 4096";
            break;
        case "numeric"  :
            r = "NUMERIC";
            break;
        case "keyword" :
            r = "integer";
            break;
    }
    return r;
}

/*
* {[]}
*
* @author AH
*
* @param {String} pType req Datentyp
*
* @return {String}
*/
function getPostgresTypename(pType)
{
    // default to the native type name, just in case ...
    var r = pType;
    switch(pType)
    {
        case "varchar" :
            r = "varchar";
            break;
        case "char" :
            r = "char";
            break;
        case "nvarchar" :
            r = "varchar";
            break;
        case "nchar" :
            r = "char";
            break;
        case "text" :
            r = "text";
            break;
        case "integer" :
            r = "int";
            break;
        case "datetime" :
            r = "timestamp";
            break;
        case "float" :
            r = "numeric";
            break;
        case "image" :
            r = "bytea";
            break;
        case "numeric" :
            r = "numeric";
            break;
        case "keyword" :
            r = "numeric(22,0)";
            break;
    }
    return r;
}

/*
* {[]}
*
* @author AH
*
* @param {String} pType req Datentyp
*
* @return {String}
*/
function getOracleTypename(pType)
{
    // default to the native type name, just in case ...
    var r = pType;
    switch(pType)
    {
        case "varchar" :
            r = "varchar2";
            break;
        //		case "char" : r = "varchar2"; break;
        case "char" :
            r = "char";
            break;
        case "nvarchar" :
            r = "varchar2";
            break;
        case "nchar" :
            r = "char";
            break;
        case "text" :
            r = "clob";
            break;
        case "integer" :
            r = "number";
            break;
        case "datetime" :
            r = "date";
            break;
        case "float" :
            r = "number";
            break;
        case "image" :
            r = "blob";
            break;
        case "numeric" :
            r = "number";
            break;
        case "keyword" :
            r = "number";
            break;
    }
    return r;
}

/*
* {[]}
*
* @author AH
*
* @param {String} pType req Datentyp
*
* @return {String}
*/
function getMicrosoftTypename(pType)
{
    // default to the native type name, just in case ...
    var r = pType;
    switch(pType)
    {
        case "varchar" :
            r = "varchar";
            break;
        case "char" :
            r = "char";
            break;
        case "nvarchar" :
            r = "nvarchar";
            break;
        case "nchar" :
            r = "nchar";
            break;
        case "text" :
            r = "text";
            break;
        case "integer" :
            r = "int";
            break;
        case "datetime" :
            r = "datetime";
            break;
        case "float" :
            r = "decimal";
            break;
        case "image" :
            r = "image";
            break;
        case "numeric" :
            r = "numeric";
            break;
        case "keyword" :
            r = "int";
            break;
    }
    return r;
}

/*
* {[]}
*
* @author AH
*
* @param {String} pType req Datentyp
*
* @return {String}
*/
function getMySQLTypename(pType)
{
    // default to the native type name, just in case ...
    var r = pType;
    a.showMessage(pType);
    switch(pType)
    {
        case "varchar" :
            r = "varchar";
            break;
        case "char" :
            r = "char";
            break;
        case "nvarchar" :
            r = "varchar";
            break;
        case "nchar" :
            r = "char";
            break;
        case "text" :
            r = "longtext";
            break;
        case "integer" :
            r = "integer";
            break;
        case "datetime" :
            r = "datetime";
            break;
        case "float" :
            r = "decimal";
            break;
        case "image" :
            r = "longblob";
            break;
        case "numeric" :
            r = "numeric";
            break;
        case "keyword" :
            r = "integer";
            break;
    }
    return r;
}

/*
* {[]}
*
* @author AH
*
* @param {String} pType req Datentyp
*
* @return {String}
*/
function getGenericTypename(pType)
{
    // default to the native type name, just in case ...
    var r = pType;
    switch(pType)
    {
        case "varchar" :
            r = "Zeichenkette (variable Länge)";
            break;
        case "char" :
            r = "Zeichenkette (feste Länge)";
            break;
        case "nvarchar" :
            r = "Zeichenkette (Unicode, variable Länge)";
            break;
        case "nchar" :
            r = "Zeichenkette (Unicode, feste Länge)";
            break;
        case "text" :
            r = "Langtext/Memo";
            break;
        case "integer" :
            r = "Ganze Zahl";
            break;
        case "datetime" :
            r = "Datum & Zeit";
            break;
        case "float" :
            r = "Dezimalbruch";
            break;
        case "image" :
            r = "Binärdaten";
            break;
        case "numeric" :
            r = "Zahl mit Kommastellen";
            break;
        case "keyword" :
            r = "Schlüsselworteintrag";
            break;
    }
    return r;
}

/*
* {[]}
*
* @author AH
* @version 1.0
* @since 02/2007
*
* @param {Number} pDatabase req Datenbanktyp (Konstante .DBTYPE_xxx)
* @param {String} pType req Generischer Datentyp aus dem Repository
*
* @return {String} der datenbankspezifische Typ
*/
function getDatabaseType(pDatabase, pType)
{
    if((pType != "") && (pDatabase != ""))
    {
        pDatabase = Number(pDatabase);
        pType = pType.toLowerCase();
        var r;
        switch(pDatabase)
        {
            case a.DBTYPE_DERBY10 :
                r = getDerbyTypename(pType);
                break;
            case a.DBTYPE_INTERBASE7 :
                r = getInterbaseTypename(pType);
                break;
            case a.DBTYPE_ORACLE10_OCI :
                r = getOracleTypename(pType);
                break;
            case a.DBTYPE_ORACLE10_THIN :
                r = getOracleTypename(pType);
                break;
            case a.DBTYPE_POSTGRESQL8 :
                r = getPostgresTypename(pType);
                break;
            case a.DBTYPE_SQLSERVER2000 :
                r = getMicrosoftTypename(pType);
                break;
            case a.DBTYPE_MYSQL4 :
                r = getMySQLTypename(pType);
                break;
            case -1 :
                r = getGenericTypename(pType);
                break;
        }
    }
    else
    {
        r = "unknown";
    }
    return r;
}


/*
* {[]}
* 
* @author AH
* @version 1.0
* @since 02/2007
*
* @param {Number} pDatabase req Datenbanktyp (Konstante .DBTYPE_xxx)
* @param {Object} pColumn req Objekt mit der Spaltendefinition
* @param {String} pUseComma opt Gibt an, ob ein Komma am Ende der Zeile steht oder nicht ("true"|"false")
* @param {String} pUseLongname opt
*
* @return {String} SQL für die Erzeugung der Spalte mit einem CREATE TABLE
*/
function getColumnDeclaration(pDatabase, pColumn, pUseComma, pUseLongname)
{
    var sql;
	
    if((pColumn != undefined) && (pColumn != ""))
    {
        if(pDatabase != -1)
        {
            sql = pColumn["name"] + " " + getDatabaseType(pDatabase, pColumn["type"]);
            if(pColumn["size"] != "") sql += "(" + pColumn["size"] + ") ";
            if(pColumn["nullability"] == "N") sql += " NOT NULL ";
            if(pUseComma == "true") sql += ",";

            if(pUseLongname == "true") if(pColumn["longname"] != "") sql += "  -- " + pColumn["longname"];
        }
        else
        {
            sql = " - " + pColumn["longname"] + " => " + getDatabaseType(pDatabase, pColumn["type"]);
        }
    }
    else
    {
        sql = "";
    }
	
    return sql;
}

/*
* {[]}
*
* @author AH
* @version 1.0
* @since 02/2007
*
* @param {Number} pDatabase req Datenbanktyp (Konstante .DBTYPE_xxx)
* @param {Number} pTableID req Verweis auf AOSYS.TABLEREPOSITORY.TABLEID
* @param {String} pSeparator opt Trenner bzw. Endezeichen der Deklaration (falls nicht angegeben, ";")
* @param {String} pUseLongname opt Gib an, ob die beschreibenden Namen als Kommentar ausgegeben werden ("true"|"false")
*
* @return {String} SQL für die Erzeugung der Tabelle mit einem CREATE TABLE
*/
function getTableDeclaration(pDatabase, pTableID, pSeparator, pUseLongname)
{
    var sql = "";
    if((pDatabase != "") && (pTableID != ""))
    {
        var tbldata = a.sql("select tablename, longname, description from aosys_tablerepository where tableid = '" + pTableID + "'", a.SQL_ROW);                      
		
        if(pDatabase != -1)
        {
            if(pUseLongname == "true") if(tbldata[1] != "") sql += "-- " + tbldata[1] + "\n";
            sql += "CREATE TABLE " + tbldata[0] + "\n";
        }
        else
        {
            sql = "Struktur der Tabelle " + tbldata[1] + " (intern: " + tbldata[0] + ")\n";
        }
		
        sql += "(\n";
		
        var qry = " select columnname, longname, columnsize, datatype, nullable "
        + " from aosys_columnrepository "
        + " where table_id = '" + pTableID + "'";
        var coldata = a.sql(qry, a.SQL_COMPLETE);
	  
        for(var i = 0; i < coldata.length; i++)
        {
            var col = new Object();
            var comma = "true";
            col["name"] = coldata[i][0];
            col["longname"] = coldata[i][1];
            col["size"] = coldata[i][2];
            col["type"] = coldata[i][3];
            col["nullability"] = coldata[i][4];
            if(i == coldata.length-1) comma = "false";
            sql += "   " + getColumnDeclaration(pDatabase, col, comma, pUseLongname);
            sql += "\n";
        }
	
        if((pSeparator == "")|| (pSeparator == undefined)) pSeparator = ";";
        sql += ")" + pSeparator + "\n\n";
    }
    return sql;
}

/*
* Liefert die Limits eines bestimmten Datenbanktyps zurück
*
* @param {Integer} pDatabaseType req Typ der Datenbank
*
* @return {Object}
*/
function getDbLimits(pDatabaseType)
{
    pDatabaseType = Number(pDatabaseType);
    var dblimit = null;
	
    // initialize limit object for checks
    switch(pDatabaseType)
    {
        case a.DBTYPE_ORACLE10_OCI :
        case a.DBTYPE_ORACLE10_THIN :
            dblimit = {
                tblname:30, 
                colname:30, 
                idxname:30, 
                idxcols:32, 
                idxnum:32
            };
            break;
        case a.DBTYPE_SQLSERVER2000 :
            dblimit = {
                tblname:128, 
                colname:128, 
                idxname:128, 
                idxcols:16, 
                idxnum:249
            };
            break;
        case a.DBTYPE_DERBY10 :
            dblimit = {
                tblname:30, 
                colname:30, 
                idxname:18, 
                idxcols:16, 
                idxnum:32
            };
            break;
        case a.DBTYPE_INTERBASE7 :
            dblimit = {
                tblname:30, 
                colname:30, 
                idxname:30, 
                idxcols:99, 
                idxnum:32
            };
            break;
        case a.DBTYPE_MYSQL4 :
            dblimit = {
                tblname:64, 
                colname:64, 
                idxname:64, 
                idxcols:16, 
                idxnum:32
            };
            break;
        case a.DBTYPE_POSTGRESQL8 :
            dblimit = {
                tblname:512, 
                colname:512, 
                idxname:512, 
                idxcols:16, 
                idxnum:64
            };
            break;
        case a.DBTYPE_SYBASE125 :
            dblimit = {
                tblname:30, 
                colname:30, 
                idxname:30, 
                idxcols:16, 
                idxnum:32
            };
            break;
    }	

    return dblimit;	
}

/*
* Überprüft die Länge der Tabellen-, Spalten- und Indexnamen auf Überschreitung des Limits
*
* @param {Integer} pDatabaseType req Typ der Datenbank
* @param {[]} pTableList req Liste der zu überprüfenden Tabellen
*
* @return {String[]}
*/
function checkDatabaseNamingLimits(pDatabaseType, pTableList)
{
    pDatabaseType = Number(pDatabaseType);
	
    var res = new Array();
    var dblimit = getDbLimits(pDatabaseType);
    var j;
	
    var repo = new RepositoryObject();
	
    // check table names first
    for(var i = 0; i < pTableList.length; i++)
    {
        // 
        var tbl = repo.tableFromRepositoryID(pTableList[i]);
		
        // check table name length
        if(tbl.name.length > dblimit.tblname) res.push( ["tablenamelength", tbl.name, "--", dblimit.tblname] );
		
        // check column name length
        if(tbl.column.length > 0)
        {
            for(j = 0; j < tbl.column.length; j++)
            {
                if(tbl.column[j].name.length > dblimit.colname) res.push( ["columnnamelength", tbl.name, tbl.column[j].name, dblimit.colname] );
            }
        }
		
        // check index name length
        if(tbl.index.length > 0)
        {
            for(j = 0; j < tbl.index.length; j++)
            {
                if(tbl.index[j].name.length > dblimit.idxname) res.push( ["indexnamelength", tbl.name, tbl.index[j].name, dblimit.idxname] );
                var colcount = tbl.index[j].columnlist.length;
                if(colcount > dblimit.idxcols) res.push( ["indexcolumncount", tbl.name, tbl.index[j].name, dblimit.idxcols] );
            }
        }
		
        // check index count
        if(tbl.index.length > 0)
        {
            if(tbl.index.length > dblimit.idxnum) res.push( ["indexcount", tbl.name, "--", dblimit.idxnum] );
        }
		
    }
    return res;
}

/*
* Ändert die Spaltendefinition der übergebenen Tabellen
*
* @param {Object} pDialog req der Dialog
* @param {[]} pTableList req Liste der Tabellen
*
* @return {void}
*/
function setColumn(pDialog, pTableList)
{
    var k;
    if(pDialog != null)
    {
        var data = {
            "COLUMNNAME" : dlg["DLG_REPO_ADDCOL.COLUMNNAME"],
            "COLUMNREF" : dlg["DLG_REPO_ADDCOL.COLUMNREF"], 
            "COLUMNSIZE" : dlg["DLG_REPO_ADDCOL.COLUMNSIZE"], 
            "CONSTRAINTTYPE" : dlg["DLG_REPO_ADDCOL.CONSTRAINTTYPE"], 
            "CUSTOMIZED" : dlg["DLG_REPO_ADDCOL.CUSTOMIZED"],
            "DATATYPE" : dlg["DLG_REPO_ADDCOL.DATATYPE"], 
            "KEYNAME" : dlg["DLG_REPO_ADDCOL.KEYNAME"],   // 2008-07-11-ah
            "DATE_EDIT" : date.date(),
            "DESCRIPTION" : dlg["DLG_REPO_ADDCOL.DESCRIPTION"], 
            "INTERNALUSE" : dlg["DLG_REPO_ADDCOL.INTERNALUSE"], 
            "LONGNAME" : dlg["DLG_REPO_ADDCOL.LONGNAME"], 
            "NULLABLE" : dlg["DLG_REPO_ADDCOL.NULLABLE"], 
            "TABLEREF" : dlg["DLG_REPO_ADDCOL.TABLEREF"], 
            "USER_EDIT" : a.valueof("$sys.user")
        };

        var cols = [];
        for(k in data) cols.push(k);
        var typs = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_COLUMNREPOSITORY", cols);
		
        var errtable = [];
		
        for(var i=0; i < pTableList.length; i++)
        {
            var condition = "TABLE_ID = '" + pTableList[i] + "' and COLUMNNAME = '" + colname + "'";			
            var vals =  [];
            for(k in data) vals.push(data[k]);			
            try
            {
                a.sqlUpdate("AOSYS_COLUMNREPOSITORY", cols, typs, vals, condition);
            }
            catch(ex)
            {
                errtable.push(a.sql("select tablename from aosys_tablerepository where tableid = '" + pTableList[i] + "'"));
                log.log(ex);
            }
        }
		
        var s = "Spaltendefinition geändert.";
        if(errtable.length > 0) s+= "\nFolgende Tabellen konnten nicht geändert werden:\n" + errtable.join("\n");
        a.showMessage(s);

    }			
}

/*
* Benennt eine Spalte um
*
* @param {String} pColumnName req Name der Spalte, die geändert werden soll
* @param {String} pNewName req Neuer Name der zu ändernden Spalte
* @param {[]} pTableList req Liste der Tabellen
*
* @return {void}
*/
function renColumn(pColumnName, pNewName, pTableList)
{
    var cols = ["COLUMNNAME"];
    var typs = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_COLUMNREPOSITORY", cols);
    var vals = [pNewName];
    var errtable = [];
	
    for(var i=0; i < pTableList.length; i++)
    {
        try
        {
            var condition = "TABLE_ID = '" + pTableList[i] + "' and COLUMNNAME = '" + pColumnName + "'";			
            var id = a.sql("select columnid where " + condition);
			
            // nur ändern, wenn eine spalte mit diesem namen vorhanden
            if(id != "") a.sqlUpdate("AOSYS_COLUMNREPOSITORY", cols, typs, vals, condition); 			
        }
        catch(ex)
        {
            errtable.push(a.sql("select tablename from aosys_tablerepository where tableid = '" + pTableList[i] + "'"));
            log.log(ex);
        }
    }
	
    var s = "Spalten umbenannt.";
    if(errtable.length > 0) s+= "\nFolgende Tabellen konnten nicht geändert werden:\n" + errtable.join("\n");
    a.showMessage(s);
}

/*
* Fügt eine neue Spaltendefinition zu Tabellen hinzu
*
* @param {Object} pDialog req der Dialog
* @param {[]} pTableList req Liste der Tabellen
*
* @return {void}
*/
function addColumn(pDialog, pTableList)
{
    var k;
    if(pDialog != null)
    {
        var data = {
            "COLUMNID" : "",
            "COLUMNNAME" : pDialog["DLG_REPO_ADDCOL.COLUMNNAME"],
            "COLUMNREF" : pDialog["DLG_REPO_ADDCOL.COLUMNREF"], 
            "COLUMNSIZE" : pDialog["DLG_REPO_ADDCOL.COLUMNSIZE"], 
            "CONSTRAINTTYPE" : pDialog["DLG_REPO_ADDCOL.CONSTRAINTTYPE"], 
            "CUSTOMIZED" : pDialog["DLG_REPO_ADDCOL.CUSTOMIZED"],
            "DATATYPE" : pDialog["DLG_REPO_ADDCOL.DATATYPE"], 
            "KEYNAME" : pDialog["DLG_REPO_ADDCOL.KEYNAME"],   // 2008-07-11-ah
            "DATE_EDIT" : "",
            "DATE_NEW" : date.date(), 
            "DESCRIPTION" : pDialog["DLG_REPO_ADDCOL.DESCRIPTION"], 
            "INTERNALUSE" : pDialog["DLG_REPO_ADDCOL.INTERNALUSE"], 
            "LONGNAME" : pDialog["DLG_REPO_ADDCOL.LONGNAME"], 
            "NULLABLE" : pDialog["DLG_REPO_ADDCOL.NULLABLE"], 
            "TABLEREF" : pDialog["DLG_REPO_ADDCOL.TABLEREF"], 
            "TABLE_ID" : pDialog["DLG_REPO_ADDCOL.TABLE_ID"], 
            "USER_EDIT" : "", 
            "USER_NEW" : a.valueof("$sys.user")
        };

        var cols = [];
        for(k in data) cols.push(k);
        var typs = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_COLUMNREPOSITORY", cols);
		
        var errtable = [];

        for(var i=0; i < pTableList.length; i++)
        {
            data["COLUMNID"] = a.getNewID("AOSYS_COLUMNREPOSITORY", "COLUMNID");
            data["TABLE_ID"] = pTableList[i];

            var vals =  [];
            for(k in data) vals.push(data[k]);			

            try
            {
                var sql = " select columnid from aosys_columnrepository " + 
                " where table_id = '" + pTableList[i] + "' and columnname = '" + data["COLUMNNAME"] + "'";
                var id = a.sql(sql);
				
                // nur hinzufügen, wenn noch keine spalte mit diesem namen vorhanden
                if(id == "") a.sqlInsert("AOSYS_COLUMNREPOSITORY", cols, typs, vals); 			
            }
            catch(ex)
            {
                errtable.push(a.sql("select tablename from aosys_tablerepository where tableid = '" + pTableList[i] + "'"));
                log.log(ex);
            }
        }
		
        var s = "Spaltendefinition hinzugefügt.";
        if(errtable.length > 0) s+= "\nFolgende Tabellen konnten nicht geändert werden:\n" + errtable.join("\n");
        a.showMessage(s);
		
    }				
}


/*
* instance method "updateColumn" of the table object 
* 
* @param {Object} pColObj req column object with name set to name of existing column
* 
* @return {void}
*/
function tbl_updateColumn(pColObj)
{
    var cname = pColObj.name.toLowerCase();
    var len = this.column.length;
	
    for(var index=0; index < len; index++)
    {
        if(this.column[i].name.toLowerCase() == cname)
        {
            pColObj.parent = this.column[i].parent;
            this.column[i] = pColObj;
            break;
        }
    }	
}


/*
* instance method "removeColumns" of the table object 
*
* @param {[]} pColumns req Array of column names to be removed from the table
*
* @return {void}
*/
function tbl_removeColumns(pColumns)
{
    for(var index=0; index < pColumns.length; index++)
    {
        var cond = "TABLE_ID = '" + this.tableid + "' and columnname = '" + pColumns[index] + "'";
        a.sqlDelete("AOSYS_COLUMNREPOSITORY", cond);
		
        for(var c=this.column.length-1; c >= 0; c--)
        {
            if(this.column[c].name.toLowerCase() == pColumns[index].toLowerCase())
            {
                this.column.splice(c, 1);
            }
        }
    }
}


/*
* erzeugt für eine tabelle einen neuen index
*
* @param {String} pIndexname req - der Name des Index
* @param {[]} pColumns req - ein array mit den Spaltennamen für den Index
* @param {Boolean} pUnique opt - gibt an, ob der Index eindeutig ist oder nicht (falls undefined => false)
*
* @return {Boolean} true oder false, je nachdem ob das anlegen des index erfolgreich war
*/
function tbl_addIndex(pIndexname, pColumns, pUnique)
{
    // falls wir keine gültige TABLE_ID haben, sofort false zurückliefern
    if(this.tableid == "") return false;
	
    try
    {
        if(pUnique == undefined) pUnique = false;
        var spalten = ["AOSYS_INDEXREPOSITORYID", "TABLE_ID", "INDEXNAME", "COLUMNLIST", "ISUNIQUE", "DATE_NEW", "USER_NEW"];
        var typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_INDEXREPOSITORY", spalten);
        var werte = [ a.getNewID("AOSYS_INDEXREPOSITORY", "AOSYS_INDEXREPOSITORYID")
        , this.tableid
        , pIndexname
        , a.encodeMS(pColumns)
        , pUnique == false ? "N" : "Y"
        , date.date()
        , a.valueof("$sys.user") ];
        a.sqlInsert("AOSYS_INDEXREPOSITORY", spalten, typen, werte);
    }
    catch(ex)
    {
        log.log("[REPOMGR] index creation failed, exception below.");
        log.log(ex);
        return false;
    }
    return true;
}

/*
* entfernt einen index für eine tabelle
* 
* @param {String} pIndexname req - der Name des Index
* 
* @return {void}
*/
function tbl_removeIndex(pIndexname)
{
    a.sqlDelete("AOSYS_INDEXREPODITORY", "UPPER(INDEXNAME) = UPPER('" + pIndexname + "')");
}

/*
* liefert true, falls die spalte in mindestens einem index der tabelle enthalten ist
* 
* @return {Boolean} true oder false
*/
function col_isIndexed()
{
    if(this.parent == undefined || this.parent == "") return false;
    if(this.parent.tableid == undefined || this.parent.tableid == "") return false;
	
    var sql = " select aosys_indexrepositoryid from aosys_indexrepository " + 
    " where table_id = '" + this.parent.tableid + "' " + 
    " and UPPER(columnlist) like UPPER('%" + this.name + "%') ";
    var res = a.sql(sql);
	
    return res != "";	          
}

/*
* Prüft, ob eine Spalte in der Datenbanktabelle enthalten ist
*
* @param {String} pAlias req Alias der Tabelle
*
* @return {Boolean} true, wenn Spalte in der Datenbanktabelle existiert, sonst false
*/
function col_existsInDb(pAlias)
{
    var cols = a.getColumns(pAlias, this.parent.name);
    var found = false;
    for(var i=0; i < cols.length; i++)
    {
        if(cols[i].toLowerCase() == this.name.toLowerCase()) 
        {
            found = true;
            break;
        }
    }
	
    return found;
}

/*
* copy a repository table definition (including columns) from one alias to another 
* 
* @param {String} pTableID req the repository ID for the source table
* @param {String} pFromAlias req the source alias name
* @param {String} pToAlias req the desitnation alias name
* 
* @return {String} the log message for the operation (empty on success)
*/
function copyRepoTable(pTableID, pFromAlias, pToAlias)
{
    var pLogString = "";
    var spalten = [ "TABLEID", "TABLENAME", "TABLETYPE", "AOMODULE", "DESCRIPTION", "LONGNAME", "LASTSYNC", 
    "DATE_NEW", "USER_NEW", "DATE_EDIT", "USER_EDIT" ];
    var typen = a.getColumnTypes(pToAlias, "AOSYS_TABLEREPOSITORY", spalten);
    var werte = a.sql("SELECT " + spalten.join(", ") + " FROM AOSYS_TABLEREPOSITORY where TABLEID = '" + pTableID + "'", a.SQL_ROW);
    var theID = a.sql("select tableid from aosys_tablerepository where upper(tablename) = upper('" + werte[1] + "')", pToAlias);

    // bail out, if we find an old repository table structure
    if((typen[3] != SQLTYPES.VARCHAR) || (type[0] != SQLTYPES.VARCHAR))
    {
        pLogString += a.translate("Alte Repositoryversion gefunden, " + werte[1] + " wurde nicht übertragen.\n");
        return pLogString;
    }
	
    werte[7] = date.date();
    werte[8] = "REPOMGR";
	
    if(theID == "")
    {
        // insert the new table definition
        werte[0] = a.getNewUUID();
        a.sqlInsert("aosys_tablerepository", spalten, typen, werte, pToAlias);
    }
    else
    {
        // update existing table definition and clear out all existing columns
        werte[0] = theID;
        a.sqlUpdate("aosys_tablerepository", spalten, typen, werte, "TABLEID = '" + theID + "'", pToAlias);
        a.sqlDelete("aosys_columnrepository", "TABLE_ID = '" + theID + "'", pToAlias);
        pLogString += werte[1] + " " + a.translate("überschrieben.\n");
    }
	
    // now insert the column definitions
    spalten = ["COLUMNID", "COLUMNNAME", "COLUMNREF", "COLUMNSIZE", "CONSTRAINTTYPE", "CUSTOMIZED",
    "DATATYPE", "DESCRIPTION", "INTERNALUSE", "LONGNAME", "NULLABLE", "TABLEREF", "TABLE_ID",
    "USER_NEW", "DATE_NEW", "USER_EDIT", "DATE_EDIT", "KEYNAME" ];
    typen = a.getColumnTypes(a.getCurrentAlias(), "AOSYS_COLUMNREPOSITORY", spalten);
    var sql = " select " + spalten.join(", ") + 
    " from aosys_columnrepository " + 
    " where table_id = '" + pTableID + "'";
    werte = a.sql(sql, a.SQL_COMPLETE);
				
    for(var i=0; i < werte.length; i++)
    {
        werte[i][0] = a.getNewID("AOSYS_COLUMNREPOSITORY", "COLUMNID", pToAlias);
        werte[i][12] = tables[tblindex];
        werte[i][13] = a.valueof("$sys.user");
        werte[i][14] = date.date();
        werte[i][15] = a.valueof("$sys.user");
        werte[i][16] = date.date();
        a.sqlInsert("AOSYS_COLUMNREPOSITORY", spalten, typen, werte[i], pToAlias);
    }

    return pLogString;
}


/*
* instance method "copyTables" for the repository object 
*
* @param {[]} pTables req String array with repository IDs for tables
* @param {String} pDestAlias req the destination alias name
*
* @return {String} the log message for the operation (empty on success)
*/
function repo_copyTables(pTables, pDestAlias)
{
    var pLogString = "";
    var currAlias = a.getCurrentAlias();
    for(var tblindex=0; tblindex < pTables.length; tblindex++)
    {
        pLogString += copyRepoTable(pTables[tblindex], currAlias, pDestAlias, pLogString);
    }
	
    return pLogString;
}


/*
* prüft vorhandene indices auf foreign keys und legt dieses ggf. an 
* 
* @param {String} pTable req - Name der Tabelle, die geprüft werden soll
* @param {Boolean} pAutoCreate opt - gibt an, ob die Indexdefiniion sofort erzeugt werden soll, default TRUE!
* 
* @return {[]} bei fehler => null, sonst Array mit den Indexdaten
*/
function repo_checkAutoIndex(pTable, pAutoCreate)
{
    try
    {
        if(pAutoCreate == undefined) pAutoCreate = true;
        var table = this.tableFromRepositoryName(pTable);
        var result = [];
		
        for(var i=0; i < table.column.length; i++)
        {
            // falls wir einen foreign key constraint haben, wird dafür automatisch ein Index erzeugt
            if(table.column[i].constraint.toLowerCase() == "f")
            {
                // spaltenname feststellen
                var colname = table.column[i].name;
				
                if(!table.column[i].isIndexed())  // wenn noch kein index besteht ...
                {
                    // ... dann einen index erzeugen
                    var ixname = pTable.toUpperCase() + "_" + colname.toUpperCase();
                    if(pAutoCreate)
                    {
                        table.addIndex(ixname, [colname]);
                        log.log("[REPOMGR] created index " + ixname + " for table " + pTable);
                    }
                    else
                    {
                        result.push( [ixname, colname] );
                    }
                }
            }
        }
        return result;
    }
    catch(ex)
    {
        log.log("[REPOMGR] index auto-check failed for table " + pTable + ", exception below.");
        log.log(ex);
        return null;
    }
}

/*
* liefert eine liste von tabellennamen im repository.
* wird pIDL nicht angegeben, werden alle tabellennamen im repository geliefert,
* wird pIDL als Array von TABLEIDs angegeben, dann werden nur die namen zu diesen IDs geliefert 
* 
* @param {String []} pIDL opt -- ein array mit den TabellenIDs (guid)
* 
* @return {String()} mit den Namen der Tabellen
*/
function repo_getTables(pIDL)
{
    var sql = " select tablename from aosys_tablerepository ";
	
    if(pIDL != undefined)
    {
        sql += " where 2=1 ";
        for(var i=0; i < pIDL.length; i++)
        {
            sql += " or tableid = '" + pIDL[i] + "' ";
        }
    }
    sql += " order by tablename ";
	
    return a.sql(sql, a.SQL_COLUMN);
}


/*
* @param {String} pAlias req -- der Aliasname für die Datenbank
* 
* @return {String()} mit den Tabellennamen, die sowohl im Repository als auch der Datenbank vorhanden sind
*/
function repo_getCommonTables(pAlias)
{
    var databasetables = a.getTables(pAlias);
    var repotables = a.sql("select tablename from aosys_tablerepository", a.SQL_COLUMN);
    var commontables = new Array();
	
    for(var i=0; i < repotables.length; i++)
    {
        for(var j=0; j < databasetables.length; j++)
        {
            if(databasetables[j] == repotables[i]) commontables.push(repotables[i]);
        }
    }
		
    return commontables;
}


/*
* []
* 
* @param {String} pAlias req -- der Aliasname
* 
* @return {String []} aus  tbl.col, tblname, coldecl_repo, coldecl_db 
*/
function tbl_getNonMatchingColumns(pAlias)
{
    var result = new Array();
    var colindex;
    var srctable = this;
    var rep = new RepositoryObject();
    var dsttable = rep.tableFromAlias(this.name, pAlias, "");
	
    var src;
    var dst;
	
    srctable.databasetype =	a.getDatabaseType(pAlias);
    dsttable.databasetype = a.getDatabaseType(pAlias);
	
    srctable.uselongnames = false;
    dsttable.uselongnames = false;
	
    srctable.separator = "";
    dsttable.separator = "";
	
    srctable.scriptprimarykey = false;
    dsttable.scriptprimarykey = false;
	
    // erst alle spalten der quelltabelle durchlaufen
    for(colindex = 0; colindex < srctable.column.length; colindex++)
    {
        try
        {
            var isdiff = false;
            src = srctable.getColumnWithIndex(colindex);
            dst = dsttable.getColumnWithName(src.name);
            // kommt undefined zurück, dann existiert die spalte nicht in der zieltabelle
            if(dst == undefined)
            {
                isdiff = true;
                result.push( [ this.name + '.' + src.name, this.name, src.getDeclaration(), '(missing)' ] );
            }
            else
            {
                var s1 = src.getDeclaration().toLowerCase();
                var s2 = dst.getDeclaration().toLowerCase();
	     		
                if(s1 != s2)
                {
                    result.push( [ this.name + '.' + src.name, this.name, s1, s2 ] );
                    isdiff = true;
                }
            }
        }
        catch(ex) 
        {
            log.log(ex);
            isdiff = true;
            result.push( [ this.name + '.' + src.name, this.name, '', '(exception reading column)'] );
        }
    }	
  
    // jetzt alle spalten der zieltabelle durchlaufen und prüfen,
    // ob eine der spalten in der quelltabelle fehlt
    for(colindex = 0; colindex < dsttable.column.length; colindex++)
    {
        // hier reicht dieser eine vergleich, denn dann fehlt die
        // spalte komplett in der quelltabelle
        dst = dsttable.getColumnWithIndex(colindex);
        src = srctable.getColumnWithName(dst.name);
        if(src == undefined) 
        {
            result.push( [ srctable.name + '.' + dst.name, this.name, '(missing)', dst.getDeclaration() ] );
        }
    }
  
    return result;	
}


/*
* lädt eine spalte im repository aus der datenbank und ersetzt diese, falls bereits im repository vorhanden 
* 
* @param {String} pAlias req -- der Aliasname
* @param {String} pColumn req -- name der spalte
* 
* @return {Boolean} true = geklappt, false = nicht geklappt
*/
function tbl_addOrReplaceColumn(pAlias, pColumn)
{
    var alias = a.getAliasModel(pAlias);
    var dbtype = alias[a.ALIAS_PROPERTIES]["databasetype"];	
    var colobj = getColumnMetadata(pAlias, this.name, pColumn, dbtype);
	
    if(colobj != undefined)
    {
        colobj.description = "Importiert aus [" + pAlias + "] " + pColumn + " am " + date.longToDate(date.date(), "yyyy-MM-dd HH:mm:ss", "UTC") + " UTC";
        var wo = 0;
        var found = false;

        while(!found && (wo < this.column.length))
        {
            found = this.column[wo]["name"].toLowerCase() == pColumn.toLowerCase();
            if(!found) wo++;
        }
        if(found)
        {
            if(this.column[wo].description != "") colobj.description = this.column[wo].description + "\n" + colobj.description;
            this.column[wo] = colobj;
        }
        else
        {
            this.column.push(colobj);
        }
		
        return true;
    }
    else
    {
        return false;
    }
}


/*
* schreibt eine spalte aus dem repository in die datenbanktabelle, ändert diese ggf. in der tabelleendefinition 
* 
* @param {String} pAlias req -- der Aliasname
* @param {String} pColumn req -- name der spalte
* 
* @return {Boolean} true = geklappt, false = nicht geklappt
*/
function tbl_transferColToDb(pAlias, pColumn)
{
    var alias = a.getAliasModel(pAlias);
    this.databasetype = alias[a.ALIAS_PROPERTIES]["databasetype"];	
    var colobj = this.getColumnWithName(pColumn);
    var result = true;
	
    if(colobj != undefined)
    {
        if( colobj.existsInDatabase(pAlias) )   // spalte existiert => ALTER
        {
        }
        else  // spalte fehlt noch, anlegen
        {
            var sql = "ALTER TABLE " + this.name + " ADD " + colobj.getDeclaration();
            a.sql(sql);
        }
        return result;
    }
    else
    {
        return false;
    }
}


/*
* vergleicht mehrere tabellen mit dem repository und der datenbank 
*
* @param {String} pAlias req -- der Aliasname
* @param {String[]} pTables req -- die Liste der Tabellennamen
*
* @return {String []} aus ( tbl.col, tblname, coldecl_repo, coldecl_db )
*/
function compareRepoWithDatabase(pAlias, pTables)
{
    var result = new Array();
    var diffcols;
    if(pTables != "")
    {
        // tabelle holen und unterschiede suchen
        var repo = new RepositoryObject();
		
        for(var i=0; i < pTables.length; i++)
        {
            try
            {
                var tblobj = repo.tableFromRepositoryID(pTables[i]);		
                diffcols = tblobj.getNonMatchingColumns( pAlias );	
                result = result.concat(diffcols);
            }
            catch(ex)
            {
                log.log(ex);
                diffcols = [ [ 'ERR', tblobj.name, '(exception reading table)', '' ] ];
                result = result.concat(diffcols);
            }
        }
		
        if(result.length == 0) result = null;
    }
    return result;    
}



// ende lib_dbschema