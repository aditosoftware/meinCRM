if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW || a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT) 
{    
    var available = a.decodeMS(a.valueof("$comp.treeThemen"));
    var users = a.getTableData("$comp.tblUsers", a.ALL);
    var vorhanden = "false";

    for(var i = 0; i < users.length; i++)
    {
        if(available[0] == "R")
        {
            if(users[i][2] == a.sql("select THEME from THEME where THEMEID = '" + available[1] + "'"))
            {
                vorhanden = "true";
            }
        }
        else
        {
            if(available[2] == users[i][2])
            {
                vorhanden = "true";
            }
        }
    }
    a.rs(a.valueof("$comp.treeThemen") != "" && vorhanden != "true");
}
else a.rs(false);