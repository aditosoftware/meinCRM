var pw = a.askUserQuestion(a.translate("Bitte geben Sie zweimal das neue Passwort ein!"), "DLG_PASSWORD");

if (pw != null)
{
	var pw1 = pw["DLG_PASSWORD.PW1"];
	var pw2 = pw["DLG_PASSWORD.PW2"];

	if (pw1 == pw2)
	{
		var user = tools.getUser( a.valueof("$comp.login") );
		user[tools.PASSWORD] = pw1;
		tools.updateUser(user);
	}
	else
	{
		a.showMessage(a.translate("Die beiden Eingaben sind nicht identisch.\nBitte probieren Sie es noch einmal!"));
	}
}