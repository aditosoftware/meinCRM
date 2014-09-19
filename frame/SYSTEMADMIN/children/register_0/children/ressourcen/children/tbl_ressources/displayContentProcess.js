import("lib_keyword");
import("lib_util");

//@change SK/HB 27.02.14: Inaktives Thema und Benutzer ohne Thema sollen auch farbig markiert angezeigt sein
var list = a.sql("select THEMEID, '-16724890', (select THEME from THEME K where K.THEMEID = THEME.THEME_ID), THEME, DESCRIPTION, ISACTIVE from THEME "
    + " where KIND = 4 and (select count(*) from THEME T1 where T1.THEME_ID = THEME.THEMEID) = 0", a.SQL_COMPLETE);

var users = tools.getUsersWithRole("PROJECT_Ressource");
var logins = [];

if (list == '')        
{
    list = a.createEmptyTable(5);
}

for(var i = 0; i < list.length; i++)        
{
    
    if ( !tools.existUsers(list[i][3]) )  list[i][1] = '-39322'; //rot ohne User
    else logins.push(list[i][3]);    
    if (list[i][5] != "true")  list[i][1] = '-3355444'; //grau Inaktives Thema
}

list = [].concat(list);
for( i = 0; i < users.length; i++)        
{
    if ( ! hasElement(logins, users[i], true) ) list.push( [users[i], '-8670750', '',  users[i], a.translate('kein Thema vorhanden')] )

}
a.ro(list);

