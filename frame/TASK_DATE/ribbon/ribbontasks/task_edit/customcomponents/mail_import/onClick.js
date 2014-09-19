import("lib_mailbridge");

var user = tools.getUser(a.valueof("$sys.user"))
var lastPath = user[tools.PARAMS]["MailPath"];
if ( lastPath == undefined )   lastPath = "";  

var file = a.askQuestion("Bitte wählen Sie ",  a.QUESTION_DIRECTORYCHOOSER, lastPath);
var mails = [];

if( file != "" && file != null && file != undefined )
{
    mails = a.doClientIntermediate(a.CLIENTCMD_FILEIO_LISTFILES, [ file , "*.EML"])
    user[tools.PARAMS]["MailPath"] = fileIO.getAbsolute(file); 
    tools.updateUser(user); //Pfad updaten
}

for ( var i = 0; i < mails.length; i++)
{
    var email = emails.parseRFC(a.doClientIntermediate(a.CLIENTCMD_GETDATA, [file + "/" + mails[i]]));
    
    Email2History( email ); //Historien zu E-Mails erstellen.
    a.doClientIntermediate(a.CLIENTCMD_FILEIO_DELETE, [file + "/" + mails[i]]);
}