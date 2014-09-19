var data = a.getTableData("$comp.Table_Items",a.ALL);
var vatsum = 0;
for ( var i = 0; i < data.length; i++ )
{
    var quantity = data[i][5] == "" || data[i][5] == null || data[i][2] != "" ? 0 : parseFloat( data[i][5] );
    var price = data[i][7] == "" || data[i][7] == null || data[i][2] != "" ? 0 : parseFloat( data[i][7] );
    var pdiscount = data[i][8] == "" || data[i][8] == null || data[i][2] != "" ? 0 : parseFloat( data[i][8] );
    var vat = data[i][10] == "" || data[i][10] == null || data[i][2] != "" ? 0 : parseFloat( data[i][10] );
    // optinal nicht summieren
    if ( data[i][11] != '1' )   vatsum += price * quantity * (100 - pdiscount) /100 * vat / 100;
}
a.rs(eMath.roundDec(vatsum, 2, eMath.ROUND_HALF_UP));