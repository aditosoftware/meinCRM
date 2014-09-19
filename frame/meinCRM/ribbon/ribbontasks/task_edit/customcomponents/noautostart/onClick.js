var user = tools.getUser(a.valueof("$sys.user"))
user[tools.PARAMS]["autoStart_meinCRM"] = "false";
tools.updateUser(user);    
a.refresh()
