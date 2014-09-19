var calgroup = a.askUserQuestion("", "DLG_CHOOSE_GROUPROLES");

if (calgroup != null)
{
    calgroup = calgroup["DLG_CHOOSE_GROUPROLES.selection"];
    calgroup = tools.getUsersWithAnyRole(a.decodeMS(calgroup));

    //load user datamodel, to get params like "Active" (enabled: yes/no)
    var users = tools.getUsers(calgroup);

    //check users where you are allowed to read...
    var userListWithCalendarReadRights = calendar.getDisplayCalendarUsers(calendar.RIGHT_READ);

    //generate map for faster access
    var calendarUserMap = new Object();
    for(var i = 0, j = userListWithCalendarReadRights.length; i < j; i++)
        calendarUserMap[userListWithCalendarReadRights[i][1]] = true;
        
    var userTitle;
    var userList = new Array();
    for(i = 0, j = users.length; i < j; i++)
    {
        userTitle = users[i][tools.TITLE];
        //...and where users are active...
        if( users[i][tools.PARAMS][tools.IS_ENABLED] && calendarUserMap[userTitle])
            userList.push(userTitle);
    }
    
    //...because opening the calendar would failure with inactive users
    calendar.open(a.WINDOW_CURRENT , calendar.SHOW_CAL | calendar.SHOW_DATE | calendar.SHOW_USER, calendar.VIEWMODE_SCHEDULE , userList);
}
