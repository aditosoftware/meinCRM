var col = ["KEYWORDID", "KEYNAME1", "KEYTYPE", "AOACTIVE", "KEYVALUE", "KEYSORT", "DATE_NEW", "USER_NEW"];
var typ = a.getColumnTypes("KEYWORD", col);

var pricelist = a.askQuestion("Preisliste: ", a.QUESTION_EDIT, "" )
if (pricelist != "" && pricelist != undefined) 
{
    var keyval = a.sql("select max(KEYVALUE) + 1 from KEYWORD where KEYTYPE = 86");
    a.sqlInsert("KEYWORD", col, typ, [a.getNewUUID(), pricelist, 86, 1, keyval, keyval, a.valueof("$sys.date"), a.valueof("$sys.user")])
}