//var user = a.valueof("$sys.user");
//if (user != '')
//{
//	// *** Verwendung für Unsichtbarkeit aller Tabs ausser Aufgaben &Termine und Befragung,
//	// *** unsichtbar wenn user in Rolle CallCenter und
//	// *** im ApplicationEditor unter Gruppe CallCenter eingetragen ist
//	var count = a.sql("select count(*) from loginrole where role_id = "
//		+ "(select aoroleid from aorole where rolename = 'CallCenter') and login = '"+user+"'");
//	a.rs(count);
//}