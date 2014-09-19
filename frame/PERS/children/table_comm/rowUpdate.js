import("lib_telephony");

var row = a.valueofObj("$local.rowdata");
var mediumChanged = row[2];
var adresse = row[3];

// Medium immer aus Tabelle, da auch der alte Wert benötigt wird
var	medium = a.getTableData("$comp.Table_comm", [row[0]])[0][2];
	 
if (adresse != "" && adresse != null)
{
    var searchaddr = getSearchAddr(medium, adresse);
		
    var spalten = ["ADDR", "SEARCHADDR", "DATE_EDIT", "USER_EDIT"] 
    var werte = [adresse, searchaddr, a.valueof("$sys.date"), a.valueof("$sys.user")];
    if (mediumChanged != null)
    {
        spalten.push("MEDIUM_ID");
        werte.push(medium);
    }		
	
    var condition = "COMMID = '" + row[0] + "'";
    a.sqlUpdate("COMM", spalten, a.getColumnTypes("COMM", spalten),werte, condition);
}