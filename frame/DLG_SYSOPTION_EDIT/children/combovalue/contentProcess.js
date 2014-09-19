var name = a.valueof("$comp.comboName");

var sql = "select distinct optionvalue from aosys_configuration where deldate is null ";

if(name != "")
{
    sql += " AND upper(optionname) = upper('" + name + "') ";
}

a.rq(sql + " order by optionvalue");