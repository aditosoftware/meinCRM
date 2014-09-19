var typ = a.valueofObj("$comp.rec_type")
if ( typ[0] == 'T' ||  typ[0] == 'W' || typ[0] == 'M' || typ[0] == 'J' )
    a.rs(true);
else
    a.rs(false);