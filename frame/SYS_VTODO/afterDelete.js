if ( a.hasvar("$image.refresh") )
{
    a.refresh(a.valueof("$image.refresh"), a.valueof("$image.window"), a.valueof("$image.image"));
}
a.closeCurrentTopImage();