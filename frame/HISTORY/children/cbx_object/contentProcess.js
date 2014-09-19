import("lib_frame");

var res = new Array(["3",a.translate("Kontakt")]);
var fd = new FrameData().getData("history", true, ["id", "title"]);
for ( var i = 0; i < fd.length; i++ )  
{
    // Kein Serienmail
    if ( fd[i][0] != "18" )  res.push(fd[i]);
}
a.ro(res);