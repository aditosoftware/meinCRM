a.rs( a.valueofObj("$image.Frame").IDColumn + " in ( select ROW_ID from TABLEACCESS where TATYPE = 'R' and FRAME_ID = " 
    + a.valueof("$image.FrameID") + " and " + a.valueof("$local.condition") + ")");