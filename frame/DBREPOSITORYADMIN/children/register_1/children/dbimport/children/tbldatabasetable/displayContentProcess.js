var alias = a.valueof("$comp.comboAlias");

if(alias != "")
{
    var res = new Array();
    try
    {
        var tabellen = a.getTables(alias);
        for(var i = 0; i < tabellen.length; i++)
        {
            res.push( new Array(tabellen[i], tabellen[i]) );
        }
        a.ro(res);
    }
    catch(ex)
    {          
        a.showMessage(a.translate("Die Datenbankverbindung für den Alias" + " " + "%0" + "\nkonnte nicht geöffnet werden", [alias]));        
        a.setValue("$comp.comboAlias", "");
        log.log(ex);
        a.ro(null);
    }
}
else
{
    a.ro(null);
}