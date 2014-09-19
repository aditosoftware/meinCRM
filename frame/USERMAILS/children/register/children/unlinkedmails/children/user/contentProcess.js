var result = new Array();
var calUsers = calendar.getCalendarUser();


for (i = 0; i < calUsers.length; i++)
{
    var user = tools.getUser(calUsers[i][1]);
    var viewable = undef(user[tools.PARAMS][tools.FIRSTNAME]) + " " + undef(user[tools.PARAMS][tools.LASTNAME]);
    if (viewable.length == 1)
        viewable = calUsers[i][1];
	
    result[i] = new Array(calUsers[i][1], viewable); 
}
a.ro(result);


function undef(text)
{
    if (text == undefined)
    {
        return "";
    }
    else
    { 		
        return text;
    }
}