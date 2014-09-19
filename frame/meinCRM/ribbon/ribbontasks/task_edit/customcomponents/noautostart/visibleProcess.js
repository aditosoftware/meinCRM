var user = tools.getUser(a.valueof("$sys.user"))
var autostart = user[tools.PARAMS]["autoStart_meinCRM"] 
a.rs( autostart == undefined || autostart != "false" );