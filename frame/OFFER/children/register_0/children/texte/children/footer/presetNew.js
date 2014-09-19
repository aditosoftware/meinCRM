var standard = a.sql("select long_text from textblock where aotype = 2 and lang = 1 and shorttext = 'Standard'");

a.setValue("$comp.FOOTER", standard)