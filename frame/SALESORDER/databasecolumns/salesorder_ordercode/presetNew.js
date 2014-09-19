var maxcode = a.sql("select max(ordercode) from salesorder");
if (maxcode == '')  maxcode = 1000;
a.rs( eMath.addInt(maxcode, 1) );