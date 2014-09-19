var data = a.getTableData("$comp.tbl_forecast",a.ALL);
var vol = 0;
for ( var i = 0; i < data.length; i++ ) vol = eMath.addInt(vol, data[i][3])
a.setValue("$comp.VOLUME", vol );