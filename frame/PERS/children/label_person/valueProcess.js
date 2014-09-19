a.rs( concat([a.valueof("$comp.salutation"), a.valueof("$comp.title"), a.valueof("$comp.firstname"), a.valueof("$comp.lastname")]));

function concat(pstrings)
{
    var retstr = pstrings[0];
    for ( var i = 1; i < pstrings.length; i++)
        if ( pstrings[i] != "" ) retstr += " " + pstrings[i];
    return retstr;
}