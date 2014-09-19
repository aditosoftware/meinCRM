var maxcode = a.sql("select max(OFFERCODE) from OFFER");
if (maxcode == '')  maxcode = 1000;
a.rs( eMath.addInt(maxcode, 1) );