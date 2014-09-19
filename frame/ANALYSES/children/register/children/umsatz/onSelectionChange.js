var visible = a.valueof("$local.visible");
if (visible == "true")
{
   a.imagevar("$image.umsatz", true);
}
else 
{
    a.imagevar("$image.umsatz", false); 
}

a.refresh()