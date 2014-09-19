import("lib_addr");
import("lib_relation");

var relorgid = a.valueof("$comp.RELATION_ID");
if (relorgid != '' ) // keine Firma selektiert
{
    a.localvar("$local.idcolumn", a.sql("select ORG_ID from RELATION where RELATIONID = '" + relorgid + "'"));
    relpersid = a.askUserQuestion(a.translate("Person auswählen"), "DLG_PERS");
    if (relpersid != null) // Abbruch
    {
        var relid = relpersid["DLG_PERS.relpersid"];
        if (relid == '') 
            relid = relorgid // keine Person ausgewählt -> Firma verwenden
        var prompts = new Array();
        var defaultvalue = [];
        defaultvalue["$comp.PAYMENTTERMS"] = getRelAttr( "Zahlungskondition", relorgid).toString();
        defaultvalue["$comp.DELIVERYTERMS"] = getRelAttr( "Lieferkondition", relorgid).toString();
        defaultvalue["$comp.ADDRESS_INVOICE"] = new AddrObject( relid ).formatAddress();
        defaultvalue["$comp.ADDRESS_DELIVERY"] = new AddrObject( relid ).formatAddress();
        defaultvalue["$comp.PROJECT_ID"] = a.valueof("$comp.idcolumn");
        prompts["ID"] = relid;
        prompts["comp4refresh"] = "$comp.Table_offer";
        prompts["autoclose"] = false;
        prompts["DefaultValues"] = defaultvalue;
        a.openLinkedFrame("SALESORDER", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);
    }
}