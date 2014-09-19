var data = a.getTableData("$comp.Table_Items",a.ALL);
var netto = 0;
for ( var i = 0; i < data.length; i++ )
{
	var quantity = data[i][7] == "" || data[i][7] == null || data[i][2] != "" ? 0 : parseFloat( data[i][7] );
	var price = data[i][9] == "" || data[i][9] == null || data[i][2] != "" ? 0 : parseFloat( data[i][9] );
	var pdiscount = data[i][10] == "" || data[i][10] == null || data[i][2] != "" ? 0 : parseFloat( data[i][10] );
	var optional = data[i][13] == "" || data[i][13] == null || data[i][2] != "" ? 0 : parseFloat( data[i][13] );
	netto += eMath.roundDec(price * quantity * (100 - pdiscount) * optional / 100, 2, eMath.ROUND_HALF_EVEN);
}
a.rs( netto );