import("lib_dbschema");

var aliastype = a.askUserQuestion(a.translate("Bitte Datenbanktyp auswählen"), "DLG_DBTYPESELECTION");

if(aliastype != null)
{
    var withdata = a.valueof("$comp.chkwithdata");
    var sel = a.decodeMS(a.valueof("$comp.tblTablelist"));
    if (a.valueof("$comp.chk_allTables") == "true")	sel = a.sql("select TABLEID from AOSYS_TABLEREPOSITORY", a.SQL_COLUMN);
    var script = "-- SQL-Script generated " + date.longToDate(date.date(), "yyyy-MM-dd") + "\n\n";
    var repo = new RepositoryObject();
	
    var file = a.askQuestion("AusgabeDatei", a.QUESTION_FILECHOOSER, "");

    for(var i = 0; i < sel.length; i++)
    {
        var tblobj = repo.tableFromRepositoryID(sel[i]);
        tblobj.uselongnames = a.valueof("$comp.chkUseLongname");
        tblobj.separator = a.valueof("$comp.edtSeparator");
        tblobj.scriptprimarykey = a.valueof("$comp.chkCreateConstraints");
        tblobj.databasetype = aliastype["DLG_DBTYPESELECTION.comboDatabase"];
        script += "-- table " + tblobj.name + "\n";
        script += tblobj.getDeclaration();
		
        if(a.valueof("$comp.chkCreateIndex") == "true")
        {
            var ix = tblobj.getIndexDeclaration();
            if(ix.length > 0)
            {
                script +="-- index script for table " + tblobj.name + "\n";	
                script += ix.join("\n");
                script += "\n";
            }
        }
        if ( withdata == "true" )
        {
            script += "\n";
            script +="-- insert script for table " + tblobj.name + "\n";	
            script += getTableData( a.valueof("$sys.dbalias"), tblobj.databasetype, tblobj.name, tblobj.separator );
            script += "\n";
        }
    }
    if ( file != null )	
    {
        a.doClientIntermediate(a.CLIENTCMD_STOREDATA, [file, script]);
        script = "SQL-Script wurde in Datei '" + file + "' gespeichert.";
    }
    a.setValue("$comp.memoOutput", script);
    a.refresh("$comp.memoOutput");
}
//**************************************
function getTableData( pFromAlias, pToAliasType, pTablename, pSeparator  )
{
    var fields = a.getColumns( pFromAlias, pTablename );
    var types = a.getColumnTypes( pFromAlias, pTablename, fields );
	
    var sqlinsert = "insert into " + pTablename + " ( " + fields.join(", ") + " ) values (";
	
    var data = a.sql("select " + fields.join(", ") + " from " + pTablename, pFromAlias, a.SQL_COMPLETE );
    var sqltext = "";
	
    for ( var i = 0; i < data.length; i++ )
    {
        var row = data[i]
        for ( var y = 0; y < row.length; y++ )
        {
            if ( row[y] == "" )     row[y] = "null";
            else
                switch(types[y])
                {
                    case SQLTYPES.BINARY:
                    case SQLTYPES.BLOB:
                        row[y] = getBlobData( row[y], pToAliasType);
                        break;
                    case SQLTYPES.DECIMAL:
                    case SQLTYPES.DOUBLE:
                    case SQLTYPES.FLOAT:
                    case SQLTYPES.INTEGER:
                    case SQLTYPES.NUMERIC:
                        break;
                    case SQLTYPES.TIME:
                    case SQLTYPES.TIMESTAMP:
                        row[y] = getTimeData( row[y], pToAliasType)
                        break;
                    case SQLTYPES.DATE:
                        row[y] = getDateData( row[y], pToAliasType)
                        break;
                    default:
                        row[y] = "'" + row[y].replace(new RegExp("'", "g"), "''") + "'";
                }
        }
        sqltext += sqlinsert + row.join (",") + ")" + pSeparator + "\n";
    }
    return sqltext;
}
//***********************************
function getBlobData(pData, pAlias)
{
    var data = "null"
    switch ( Number(pAlias) )
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
            data = "'" + getHexData(pData) + "'";
            break;
        case a.DBTYPE_DERBY10:
            data = "cast (X'" +  getHexData(pData) + "' as BLOB)"
            break
        case a.DBTYPE_SQLSERVER2000:
            data = "0x" + getHexData(pData);
            break;
        case a.DBTYPE_MYSQL4:
            data = "x'" + getHexData(pData) + "'";
            break;
    }		                                        
    return data;
}
//***********************************
function getTimeData(pData, pAlias)
{
    var data = "null"
    switch (Number(pAlias))
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
            data = "to_date('" + date.longToDate( pData, "yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd HH24:mi:ss')";
            break;
        case a.DBTYPE_SQLSERVER2000:
        case a.DBTYPE_DERBY10:
        case a.DBTYPE_MYSQL4:
            data = "'" + date.longToDate( pData, "yyyy-MM-dd HH:mm:ss") + "'";
            break;
    }		                                        
    return data;
}
//***********************************
function getDateData(pData, pAlias)
{
    var data = "null"
    switch (Number(pAlias))
    {
        case a.DBTYPE_ORACLE10_CLUSTER:
        case a.DBTYPE_ORACLE10_THIN:
        case a.DBTYPE_ORACLE10_OCI:
        case a.DBTYPE_SQLSERVER2000:
        case a.DBTYPE_DERBY10:
        case a.DBTYPE_MYSQL4:
            data = "'" + date.longToDate(pData, "yyyy-MM-dd") + "'";
            break;
    }		                                        
    return data;
}
//***********************************
function getHexData(input)
{
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    var hD='0123456789ABCDEF';
    var output = new Array();
    var hexdata = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var z = 0;
    var j = 0;
    while (z < input.length) 
    {
        enc1 = keyStr.indexOf(input.charAt(z++));
        enc2 = keyStr.indexOf(input.charAt(z++));
        enc3 = keyStr.indexOf(input.charAt(z++));
        enc4 = keyStr.indexOf(input.charAt(z++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output[j++] = chr1;
        if (enc3 != 64)	 output[j++] = chr2;
        if (enc4 != 64)  output[j++] = chr3;
    }
    for ( z = 0; z < output.length; z++ )
    { 
        hexdata += (output[z] < 16 ? "0" : "") + dec2hex(output[z]); 
    }
    return hexdata;

    function dec2hex(d) 
    {
        var h = hD.substr(d&15,1);
        while (d>15) 
        {
            d>>=4;
            h=hD.substr(d&15,1)+h;
        }
        return h;
    }
}