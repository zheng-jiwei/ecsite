//######  process cart ######
var currencyCode = "";

function update_items_into_checkout(callback){
	var obj = document.getElementsByName("checkout_products");
	let list = [];
	for(let i=0; i<obj.length; i++){
		let count = document.getElementById("product_variant_id_"+ i ).value;
		if(count > 0){
		let id = document.getElementById("product_variant_item_id_"+ i ).value;
		list.push("{quantity: "+count+", variantId: \""+id+"\"}");
		}
	}
	get_checkout_id(function(checkout_id){
		let input = "mutation {checkoutLineItemsReplace(lineItems: ["+ list.join("") +"], checkoutId: \""+ checkout_id+"\") {checkout {id webUrl} userErrors{message}}}";
		console.log(input);
		http_get(input, show_prodcuts_in_cart);
	});
}


function install_event(){	
    if($('input[name="checkout_products"]').length>0){
        $('input[name="checkout_products"]').change(function(e){
			update_items_into_checkout(function(result){
				if(result.data && result.data.checkoutLineItemsReplace.userErrors.length == 0){
					
				}else{
					alert("error");
				}
			});
        })
    }
}

function show_prodcuts_in_cart(){
	get_checkout_id(function(checkout_id){
		query_checkout_info(checkout_id, function(result){
			if(result.data.node.completedAt == null){
				let data = result.data.node.lineItems.edges;
				currencyCode = result.data.node.currencyCode;
				let items = [];
				for(let i=0; i<data.length; i++) {
					let title = data[i].node.variant.title;
					let options = data[i].node.variant.product.options;
					if(options.length == 1 && options[0].values.length == 1){
						title = "";
					}
					items.push("<tr>\n" +
						"        <td className=\"width20 valign-top\">\n" +
						"            <div style=\"text-align:left\"><img src=\"" + data[i].node.variant.image.originalSrc + "\" width=\"100px\"/></div>\n" +
						"        </td>\n" +
						"        <td className=\"width70 valign-top\">\n" +
						"            <input type=\"hidden\" id=\"product_variant_item_id_"+ i +"\" value=\"" + data[i].node.variant.id+ "\"/>\n" +
						"            <div style=\"text-align:left\">商品名："+ data[i].node.title +"</div>\n" +
						"            <div style=\"text-align:left\">商品オプション："+ title +"</div>\n" +
						"            <div style=\"text-align:left\">単価："+ Number(data[i].node.variant.priceV2.amount).toLocaleString('ja-JP', { style: 'currency', currency: currencyCode})+"</div>\n" +
						"            <div style=\"text-align:left\">数量：<input name=\"checkout_products\" id=\"product_variant_id_"+ i +"\" alt=\""+ data[i].node.variant.priceV2.amount +"\" value=\""+ data[i].node.quantity +"\"/></div>\n" +
						"        </td>\n" +
						"        <td className=\"width10\">\n" +
						"            <div id=\"product_variant_id_"+ i +"_price\">" + Number(data[i].node.variant.priceV2.amount * data[i].node.quantity ).toLocaleString('ja-JP', { style: 'currency', currency:currencyCode })+ "</div>\n" +
						"    </tr>");
				}
				let total_tax = result.data.node.totalTax;
				let total_price = parseInt(result.data.node.subtotalPriceV2.amount )+ (result.data.node.shippingAddress ? parseInt(total_tax) : 0);
				total_price = Number(total_price).toLocaleString('ja-JP', { style: 'currency', currency:currencyCode });
				total_tax = result.data.node.shippingAddress ? Number(total_tax).toLocaleString('ja-JP', { style: 'currency', currency:currencyCode }) : "未計算";
				items.push("<tr>\n" +
					"<td colspan=\"3\"><div style=\"border-top: solid 1px lightgray\"></div></td>\n" +
					"</tr>\n" +
					"<tr>\n" +
					"<td class=\"width20 valign-top\"><div style=\"text-align:left\"></div></td>\n" +
					"<td class=\"width80 valign-top\"></td>\n" +
					"<td>税：<span id=\"all_tax\">"+ total_tax +"</span>  </td>\n" +
					"</tr>\n" +
					"<tr>\n" +
					"<td colspan=\"3\"><div style=\"border-top: solid 1px lightgray\"></div></td>\n" +
					"</tr>\n" +
					"<tr>\n" +
					"<td></td>\n" +
					"<td><div style=\"float:right;\">合計：</div></td>\n" +
					"<td><span id=\"total_price\" style=\"font-size:18px\">"+ total_price +"</span>（税込）</td>\n" +
					"</tr>");
				document.getElementById("checkout_list").innerHTML = items.join("\n");
				install_event();
			}
		});
	});
}

show_prodcuts_in_cart();