var visible = a.valueof("$local.visible");
if (visible == "true")
{
   a.imagevar("$image.umsatzjahre", true);
}
else 
{
    a.imagevar("$image.umsatzjahre", false); 
}

a.refresh()