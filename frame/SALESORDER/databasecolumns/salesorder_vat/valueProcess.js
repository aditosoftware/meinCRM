var data = a.getTableData("$comp.Table_Items",a.ALL);
var vatsum = 0;
for ( var i = 0; i < data.length; i++ )
{
    var quantity = data[i][3]== "" || data[i][3]== null ? 0 : parseFloat( data[i][3] );
    var price = data[i][5] == "" || data[i][5]== null ? 0 : parseFloat( data[i][5] );
    var pdiscount = data[i][6] == "" || data[i][6]== null ? 0 : parseFloat( data[i][6] );
    var vat = data[i][8] == "" || data[i][8]== null ? 0 : parseFloat( data[i][8] );

    vatsum += price * quantity * (100 - pdiscount) /100 * vat / 100;
}
a.rs(eMath.roundDec(vatsum, 2, eMath.ROUND_HALF_UP));