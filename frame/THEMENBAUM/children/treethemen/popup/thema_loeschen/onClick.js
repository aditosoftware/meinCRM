import("lib_themetree")

var nodeid = a.valueof("$comp.treeThemen.context");

if (nodeid != undefined && nodeid != "")
{
    var childsToDelete = new Array();
    //holle alle untergeordneten Themen inkl. zu löschendes Thema.
    childsToDelete =  getAllChilds(nodeid, childsToDelete) 
 
    //Zuerst prüfen, ob das Thema bereits in einer Historie eingetragen wurde... wenn JA, darf dieses nicht mehr gelöscht werden!
    if(!isInUsage(childsToDelete))
    {
        if (a.askQuestion(a.translate("Soll das Thema und alle untergeordneten Themen wirklich gelöscht werden?"), a.QUESTION_YESNO, "") == "true")
        {		
            deleteChilds(childsToDelete);
            a.globalvar("$global.Themen", "");
            initThemenObject();
            a.refresh("$comp.treeThemen");
        }
    }
    else
        a.showMessage(a.translate("Thema kann nicht gelöscht werden, da dies oder ein untergeordnetes Thema in einem Kundenkontakt verwendet wird."));
}