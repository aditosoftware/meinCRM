if ( a.hasvar("$image.refresh") )
{
    a.refresh(a.valueof("$image.refresh"), a.valueof("$image.window"), a.valueof("$image.image"));
}

if (a.valueof("$image.closecurrentframe") == "true")
{
    a.closeCurrentTopImage();
}