var table =	a.sql("select TABLEACCESSID, ROLEID, FRAME_ID, PRIV_INSERT, PRIV_EDIT, PRIV_DELETE "
    + " from TABLEACCESS where TATYPE = 'F'", a.SQL_COMPLETE);
            
a.returnobject(table);