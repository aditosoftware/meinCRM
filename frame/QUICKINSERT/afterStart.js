a.imagevar("$image.historyid", a.getNewUUID());
// fill data

if ( a.hasvar("$image.DefaultValues") )
{
    a.imagevar("$image.CheckAddr", false);
    a.setValues(a.valueofObj("$image.DefaultValues"));   
} 
a.imagevar("$image.CheckAddr", true);