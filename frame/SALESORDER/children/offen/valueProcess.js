if ( a.valueof("$comp.CANCELLED") != 'Y') a.rs(eMath.addDec(a.valueof("$comp.SUMME_brutto"), -a.valueof("$comp.PAYED")))
else a.rs("0");