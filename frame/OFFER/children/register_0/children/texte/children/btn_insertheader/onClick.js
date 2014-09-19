var text = a.sql("select long_text from textblock where shorttext = '" + a.valueof("$comp.HEADER_SHORT") 
    + "' and aotype = 11 and lang = "	+ a.valueof("$comp.LANGUAGE"));

a.setValue("$comp.HEADER", text)