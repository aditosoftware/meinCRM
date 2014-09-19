if (a.hasvar("$image.content"))
{	
    var content = a.valueof("$image.content")
    if ( content != "" )
    {
        if ( content.substr(0, 4) != "http" && content.substr(0, 4) != "ftp:" && content.substr(0, 5) != "file:")  	content = "http://" + content;
        a.rs( content )
    }
}