import("lib_user");

var affectedusers = [];
var actualUser =
a.decodeMS(a.valueofObj("$image.entry")[calendar.AFFECTEDUSERS]);
var event = a.valueofObj("$image.entry");

for(var k = 0; k < actualUser.length; k++) 
{
    //Exchangemultistring für ADITO aufbereiten (nur ersten zwei Elemente relevant)
    var temp = a.decodeMS(actualUser[k]);
    actualUser[k] = a.encodeMS([temp[0], temp[1]]);
    
    var color = " ";
    if(event[calendar.USER] == actualUser[k])
    {
        color = "-3407821";
    }

    var decodedUser = a.decodeMS(actualUser[k])[1].substring(3).toString();
    //Prüfen ob es sich um einen ADITO-User handelt, unbekannte User kommen aus Exchange mit der E-Mailadresse
    if(!(decodedUser.split('@').length > 1)) 
    {
        var userp = tools.getUser(a.decodeMS(actualUser[k])[1].split(":")[1])[tools.PARAMS];
        
        if (a.hasvar("$global.firstLastName") && a.valueofObj("$global.firstLastName"))
        {
            affectedusers.push([actualUser[k], color , userp[tools.LASTNAME] + " " + userp[tools.FIRSTNAME] ]);
        }
        else         
            affectedusers.push([actualUser[k], color, userp[tools.FIRSTNAME] + " " + userp[tools.LASTNAME] ]);
    }
    else
    {
        affectedusers.push([actualUser[k], color, benutzer ]);
    }
}
a.imagevar("$image.affectedusers", affectedusers);
a.imagevar("$image.treeopen", false);