var colname = a.valueof("$comp.COLUMNNAME");

var data = a.sql("select SQLID, SQLKEYWORD, DBPOSTGRESQL, DBMSSQL, DBMYSQL, DBORACLE, SQL1992, SQL1999, SQL2003, SQL2008, DBDB2, DBINFORMIX " + 
    "  from AOSYS_SQLREPOSITORY where upper('" + colname + "') = upper(SQLKEYWORD)", a.SQL_ROW);

var isKey = false;
for(var i=2; i < data.length; i++)
{
    if(data[i] == "K") isKey = true;
}

if(isKey)
{
    var s = "Der gewählte Spaltenname ist ein reserviertes Word für:\n";
	
    if(data[2] == "K") s += "  - PostgreSQL\n";
    if(data[3] == "K") s += "  - Microsoft SQL 2008\n";
    if(data[4] == "K") s += "  - MySQL 5.1\n";
    if(data[5] == "K") s += "  - Oracle 10/11\n";
    if(data[6] == "K") s += "  - SQL-92\n";
    if(data[7] == "K") s += "  - SQL-1999\n";
    if(data[8] == "K") s += "  - SQL:2003\n";
    if(data[9] == "K") s += "  - SQL:2008\n";
    if(data[10] == "K") s += "  - IBM DB2\n";
    if(data[11] == "K") s += "  - IBM Informix\n";
	

    s += "\nFalls Sie wirklich diesen Namen verwenden wollen, sollten Sie wissen, was Sie da tun.";
	
    a.showMessage(s);
	
}