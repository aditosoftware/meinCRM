var rawElements = calendar.getElementPrefs()[calendar.ELEM_CATEGORIES_EVENT];

var count = rawElements.length;
var result = new Array(count);

for (var i = 0; i < count; i++)
{
    var entry = new Array(1);
    entry[0] = rawElements[i];

    result[i] = entry;
}

a.ro(result);