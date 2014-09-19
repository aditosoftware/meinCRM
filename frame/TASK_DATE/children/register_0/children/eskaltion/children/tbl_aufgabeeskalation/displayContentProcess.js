import("lib_calendar");

var logins = a.valueof("$comp.cmb_employee");
var overdue = a.valueof("$comp.edt_overduedays");
if ( overdue == "" )  overdue = a.valueof("$sys.date");
else overdue = a.valueof("$sys.date") - parseInt(overdue) * date.ONE_DAY;
if ( logins == "" )		logins = getUsersbyAttr([a.valueof("$sys.user")], "berichtet an");
a.ro( getTodos( { category: "", datedue: overdue, user: logins, delegated: "", 
                    needs_action: "true", in_process: "true", completed: "", cancelled: "" } ) );