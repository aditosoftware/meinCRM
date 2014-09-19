// angehakten Eintrag nach oben schieben
var groups = a.decodeMS(a.valueof("$comp.UJGruppe"));
if (groups.length > 0)
{
    var init = a.valueofObj("$image.ujgroups");
    var setgroups = [];

    for ( var i = 0; i < groups.length; i++)  
        for ( var y = 0; y < init.length; y++)  
            if ( groups[i] == init[y][0] )   setgroups.push(init[y]);

    for ( i = 0; i < init.length; i++)
    {
        var copy = true;

        for ( y = 0; y < setgroups.length; y++)  
            if ( setgroups[y][0] == init[i][0] )  copy = false;  

        if ( copy ) setgroups.push(init[i]);
    }

    a.imagevar("$image.ujgroups", setgroups );
}