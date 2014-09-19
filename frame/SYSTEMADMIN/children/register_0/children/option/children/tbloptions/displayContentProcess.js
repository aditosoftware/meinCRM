import("lib_keyword");

var keytype = a.sql("select KEYVALUE from KEYWORD where KEYNAME2 = 'OPTIONS' and KEYTYPE = 0");
if ( keytype == "" ) keytype = 0;
var options = a.sql("select OPTIONID, OPTIONNAME, OPTIONVALUE, ROLEID, KEYDESCRIPTION, KEYNAME1  from AOSYS_CONFIGURATION "
    + " left join KEYWORD on KEYNAME2 = OPTIONNAME and KEYTYPE = " + keytype + " order by OPTIONNAME", a.SQL_COMPLETE);
if (options.length > 0)
{
    var roles = tools.getAllRoles([]);
    var type = new Object();
    type["USER"] = a.translate("User");
    type["PROJECT"] = a.translate("Rolle");

    for ( var i = 0; i < options.length; i++ )		
    {
        if ( options[i][3] != "" )  options[i][3] = roles[options[i][3]][0] + " / " + type[roles[options[i][3]][1]];
        if ( options[i][5] != "" )  options[i][1] = a.translate( options[i][5] );
    }
    a.ro( options );
}
else	a.ro( a.createEmptyTable(4) );