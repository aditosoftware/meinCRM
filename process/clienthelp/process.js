//  Aufruf für die Clienthilfe

var currentimagename = a.valueof("$local.imagename");
var helpaddr = a.valueof("$global.HelpAddr");
if ( helpaddr == "" ) 	helpaddr = "file:///" + a.doClientIntermediate(a.CLIENTCMD_GETPROPERTY, ["user.dir"]) + "/help"

helpaddr += "/clienthelp_" + a.valueof("$sys.clientcountry").toLowerCase() + ".html";
if ( currentimagename != "" &&  currentimagename != null )
{
    currentimagename = currentimagename.split(".");
    helpaddr += "#" + currentimagename[currentimagename.length-1];
}
if ( a.valueof("$sys.clientos") == "mac os x" )
{
    a.doClientIntermediate(a.CLIENTCMD_OPENURL, [helpaddr])
}
else
{
    var images = a.getTopImages();
    for ( var i = 0; i < images.length; i++ )
    {
        if ( images[i][3] == "comp.ClientHelpFrame" )
        {
            a.closeTopImage(images[i][0], images[i][1]);
            break;
        }
    }
    var prompt = new Array();
    prompt["content"] = helpaddr;
    a.openFrame("ClientHelpFrame", null, false, a.FRAMEMODE_EDIT, null, false, prompt);
}