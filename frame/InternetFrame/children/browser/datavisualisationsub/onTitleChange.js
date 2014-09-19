var value = a.valueofObj("$local.value") ;
if (a.valueof("$image.uid") == value[0])
{
    a.imagevar("$image.title", value[1]);
    a.refresh();
}