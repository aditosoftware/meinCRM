import("lib_addrexp");

var relids = a.decodeMS(a.valueofObj("$comp.tblAdvertisingShipments"))
relids = a.sql("select RELATION_ID from ADVERTISINGSHIPMENT where ADVERTISINGSHIPMENTID in ('" + relids.join("','") + "')", a.SQL_COLUMN);
openSerialLetter(relids);