import("lib_themetree");

var nodeid = a.valueof("$comp.treeThemen.context");
if (nodeid == undefined)    nodeid = "";
var theme = null;
var kind = a.valueof("$comp.cmb_ThemenTyp");

var fields = ["THEME", "DESCRIPTION", "ISACTIVE"]
var values = ["","","true"];

a.localvar("$local.showReminder", kind == "1");
do
{
    for ( i = 0; i < fields.length; i++ )   a.localvar("$local." + fields[i], values[i]);
    theme = a.askUserQuestion(a.translate("Thema bearbeiten"), "DLG_THEME");
    if ( theme != null )
    {
        for ( i = 0; i < fields.length; i++ )   values[i] = theme["DLG_THEME." + fields[i]];
        //Prüfe ob ein Thema mit gleichen Namen bereits existiert!
        if(theme != null && theme["DLG_THEME.THEME"] != "" && isExists(nodeid, theme["DLG_THEME.THEME"], undefined, kind ))
        {
            a.showMessage(a.translate("Ein Thema mit gleichen Namen existiert bereits!"));
            theme = "";
        }
    }
}
while( theme != null && theme == "") 
        
if (theme != null)
{
    var condition = nodeid == "" ? "THEME_ID is null" : "THEME_ID = '" + nodeid + "'"; //Knoten oder Unterpunkt?
    var sort = a.sql("select max(THEMESORT)+1 from THEME where KIND = " + kind + " and " + condition);
    if(sort == "") sort = 0;
    fields = fields.concat( "THEMEID" , "THEME_ID", "KIND", "THEMESORT", "USER_NEW", "DATE_NEW" );
    values = values.concat( a.getNewUUID() , nodeid, kind, sort, a.valueof("$sys.user"), a.valueof("$sys.date") );
    var types = a.getColumnTypes("THEME", fields);
    a.sqlInsert("THEME", fields, types, values);
    a.globalvar("$global.Themen", "");
    initThemenObject();
    a.refresh("$comp.treeThemen");
}
