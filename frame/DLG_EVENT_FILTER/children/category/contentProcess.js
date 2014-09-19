import("lib_attr")
import("lib_frame");

// frameid von EMPLOYEE und LOGINs der Vorgesetzten auslesen
var fd = new FrameData();
var frameid = String(fd.getData("name", "EMPLOYEE", ["id"]));
var	empl = a.valueof("$sys.user");
var emplid = a.sql("select EMPLOYEEID from EMPLOYEE where LOGIN = '" + empl + "'");
var users = GetAttribute( "berichtet an", frameid, emplid )

var res = false;
for (i=0; i<users.length; i++)
    if ( empl == users[i]) res = true;

// Combobox der Kategorien füllen
var rawElements = calendar.getElementPrefs()[calendar.ELEM_CATEGORIES_TODO];

var count = rawElements.length;
var result = new Array(count);

for (var i = 0; i < count; i++)
{
    var entry = new Array(1);
    entry[0] = rawElements[i];

    result[i] = entry;
}

// Wenn Vorgesetzter
if (res == true)
{
    result.push([ "Urlaub beantragt" ]);
    result.push([ "Urlaub genehmigt" ]);
}

a.ro(result);