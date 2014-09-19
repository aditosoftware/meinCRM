var productid = a.valueof("$comp.PRODUCT_ID")

if (productid != "" )
	a.rq("SELECT PRODUCTNAME FROM PRODUCT WHERE PRODUCTID = '" + productid + "'");