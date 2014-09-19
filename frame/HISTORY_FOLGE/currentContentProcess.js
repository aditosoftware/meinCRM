import("lib_keyword");

var medium = a.valueof("$comp.MEDIUM")
var string = a.translate("Folge-Datum") + ": " + a.longToDate(a.valueof("$comp.ENTRYDATE"), "dd.MM.yyyy") + " \n"
if (medium != "")
{
    string += a.translate("Medium") + ": " + a.translate(a.sql("select keyname1 from keyword where" 
        + getKeyTypeSQL("HistoryMedium") + " and keyvalue = " + a.valueof("$comp.MEDIUM")))
}
string += " \n" + a.translate("Betreff") + ": " + a.valueof("$comp.SUBJECT");
a.rs(string);