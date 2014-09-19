if(a.hasvar("$image.affectedusers"))
{
    var count = a.valueofObj("$image.affectedusers").length;

    if (count <= 1)
    {
        a.rs("multi");
    }
    else
    {
        a.rs("single");
    }
}