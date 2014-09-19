import("lib_email");

var persrelid = a.valueof("$comp.RELATION_ID");
if (persrelid != "")
{
    var language = a.sql("select LANG from RELATION where RELATIONID = '" + persrelid + "'");
    var adresse = a.valueof("$comp.EMAIL");
    OpenNewMail(adresse, persrelid, language);
}