resetfilter()

function resetfilter()
{
    var filtervalues = ["","","","","","",""];
    a.imagevar("$image.FilterValues", filtervalues );
    a.refresh("$comp.tbl_pricelist");
}