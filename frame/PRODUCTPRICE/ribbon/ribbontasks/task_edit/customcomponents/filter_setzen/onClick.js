var filtervalues = ["","","","","","",""]; 
if ( a.hasvar("$image.FilterValues") )  filtervalues =	a.valueofObj("$image.FilterValues");

a.localvar("$local.cmb_groupcode", filtervalues[0]);
a.localvar("$local.cmb_pricelist", filtervalues[1]);
a.localvar("$local.edt_validfrom", filtervalues[2]);
a.localvar("$local.edt_validuntil", filtervalues[3]);
a.localvar("$local.edt_fromquantity", filtervalues[4]);
a.localvar("$local.edt_toquantity", filtervalues[5]);
a.localvar("$local.cmb_currency", filtervalues[6]);

var res = a.askUserQuestion(a.translate("Bitte Filterbedingungen setzen"), "DLG_PRODUCTPRICE_FILTER");
//a.showMessage(res+"\n"+res["DLG_PRODUCTPRICE_FILTER.cmb_groupcode"]+"\n"+filtervalues[0])
if( res != null && res != undefined && res != "")
{
    filtervalues[0] = res["DLG_PRODUCTPRICE_FILTER.cmb_groupcode"];
    filtervalues[1] = res["DLG_PRODUCTPRICE_FILTER.cmb_pricelist"];
    filtervalues[2] = res["DLG_PRODUCTPRICE_FILTER.edt_validfrom"];
    filtervalues[3] = res["DLG_PRODUCTPRICE_FILTER.edt_validuntil"];
    filtervalues[4] = res["DLG_PRODUCTPRICE_FILTER.edt_fromquantity"];
    filtervalues[5] = res["DLG_PRODUCTPRICE_FILTER.edt_toquantity"];
    filtervalues[6] = res["DLG_PRODUCTPRICE_FILTER.cmb_currency"];
}
//a.showMessage(filtervalues[0]+"#"+filtervalues[1])
a.imagevar("$image.FilterValues", filtervalues );
a.refresh("$comp.tbl_pricelist");