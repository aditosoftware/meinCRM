a.rs(a.sql("select count(*) from ORDERITEM where SALESORDER_id = '" + a.valueof("$comp.idcolumn") + "'") > 0 
    && a.valueof("$comp.SENT") == 'N')