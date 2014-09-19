var calgroup = tools.getUsersWithRole("PROJECT_Ressource");
var start = a.valueof("$comp.EVENTSTART");
var end = a.valueof("$comp.EVENTEND");
var newday = start - a.ONE_DAY;
var arr = [];
do{
    newday = eMath.addInt(newday, a.ONE_DAY)
    arr.push(newday)
}
while(newday < end)

calendar.open(false, calendar.SHOW_CAL|calendar.SHOW_DATE|calendar.SHOW_USER, calendar.VIEWMODE_DAYS , calgroup, arr);

