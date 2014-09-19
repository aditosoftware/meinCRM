//Name+Sprache müssen eindeutig sein
if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW || a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT )
{
    var name = a.valueof("$comp.NAME");
    var language = a.valueof("$comp.LANG");
    if (language == "") language = 0;
    var cnt = a.sql("select count(*) from document where UPPER(name) = '" + name.toUpperCase() + "' and LANG = " + language);

    if(cnt > 0)
    {
        a.showMessage(a.translate("Die Kombination von Name und Sprache sind bereits vergeben!\nBitte ändern Sie Namen oder Sprache für die Vorlage."));
        a.setValue("$comp.LANG", "");
    }
}