var bindata = a.sql("select BINDATA, FILENAME from ASYS_BINARIES where ID = '" + a.valueof("$local.idvalue") + "'", "AO_DATEN", a.SQL_ROW);

var filename = "C:/temp/" + bindata[1];  
a.doClientIntermediate(a.CLIENTCMD_STOREDATA, [filename, bindata[0], a.DATA_BINARY ]);
a.doClientIntermediate(a.CLIENTCMD_OPENFILE, [filename]);