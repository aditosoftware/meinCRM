var text = a.sql("select long_text from textblock where shorttext = '" + a.valueof("$comp.FOOTER_SHORT") 
    + "' and aotype = 12 and lang = "	+ a.valueof("$comp.LANGUAGE"));

a.setValue("$comp.FOOTER", text)