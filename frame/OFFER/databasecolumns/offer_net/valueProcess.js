var data = a.getTableData("$comp.Table_Items",a.ALL);
var netto = 0;
for ( var i = 0; i < data.length; i++ )
{
    var quantity = data[i][5] == "" || data[i][5] == null || data[i][2] != "" ? 0 : parseFloat( data[i][5] );
    var price = data[i][7] == "" || data[i][7] == null || data[i][2] != "" ? 0 : parseFloat( data[i][7] );
    var pdiscount = data[i][8] == "" || data[i][8] == null || data[i][2] != "" ? 0 : parseFloat( data[i][8] );
    // optinal nicht summieren
    if ( data[i][11] != 1 )   netto += eMath.roundDec(price * quantity * (100 - pdiscount) / 100, 2, eMath.ROUND_HALF_EVEN);
}
a.rs( netto );