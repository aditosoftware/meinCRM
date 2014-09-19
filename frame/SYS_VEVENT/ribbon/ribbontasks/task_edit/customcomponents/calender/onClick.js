var users = a.getTableData("$comp.tblUsers", a.ALL);

var userList = new Array();
for(var i = 0; i < users.length; i++)   
{    
    var user = a.decodeMS(users[i][0])[1];
    user = user.split("CN:");
    userList.push(user[1]);
}
calendar.open(a.WINDOW_CURRENT , calendar.SHOW_CAL | calendar.SHOW_DATE | calendar.SHOW_USER, calendar.VIEWMODE_SCHEDULE , userList);
