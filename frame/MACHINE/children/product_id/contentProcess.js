a.rq("select PRODUCTID, PRODUCTNAME from PRODUCT join ATTRLINK on PRODUCTID = ROW_ID "
    + " where value_id = (select ATTRID from ATTR where ATTRNAME = 'Gerät/Maschine')");