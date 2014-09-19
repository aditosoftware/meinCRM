import("lib_themetree");

var ids = [];
getAllChilds(a.valueof("$local.rawvalue"), ids );

var condition = "('" + ids.join("','") + "')";
switch ( a.valueof("$local.operator") )
{
    case "1":
        condition = " in " + condition;
        break;
    case "2":
        condition = " not in " + condition;
        break;       
    default:
        condition = " is not null";
    break;
}
// ["","=","!=",">","<","<=",">=","like","not like","","","is not","is"];
a.rs( "HISTORYID in (select HISTORY_ID from HISTORY_THEME where THEME_ID " + condition + ")" );


