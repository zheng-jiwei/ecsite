get_checkout_id(function(checkout_id){
	query_checkout_info(checkout_id, function(result){
		if(result.data.node.completedAt==null){
			checkout_info = result.data.node;
			let address = result.data.node.shippingAddress;
			let strAddress =  "<div><span>氏名：</span>"+ address.firstName +"&nbsp"+ address.lastName +"</div>";
			strAddress += "<div><span>Email："+ result.data.node.email +"</div>";
			strAddress += "<div><span>会社名："+ address.company +"</div>";
			strAddress += "<div><span>住所：</span>";
			strAddress += address.address2=="" ?  "" : address.address2+",&nbsp";
			strAddress += address.address1=="" ?  "" : address.address1+",&nbsp";
			strAddress += address.city + ",&nbsp" + address.province+",&nbsp"+address.country +"</div>";
			strAddress +="<div>"+ address.zip +"</div>";
			strAddress +="<div><span>電話番号：</span>"+ address.phone +"</div>";
			strAddress += "<input type=\"hidden\" id=\"web_url\" value=\"" + result.data.node.webUrl + "\"/>";
			document.getElementById("shipping_address").innerHTML =strAddress;
			let items = result.data.node.lineItems.edges;
			let list = [];
			for(let i=0; i<items.length; i++){
				list.push("<img src=\""+ items[i].node.variant.image.originalSrc +"\" width=\"50px\"><span>x"+ items[i].node.quantity +"</span>");
			}
			document.getElementById("all_order_products").innerHTML = list.join("<span style=\"margin:10px\">+</span>") + "=" + Number(result.data.node.subtotalPriceV2.amount).toLocaleString('ja-JP', { style: 'currency', currency: result.data.node.currencyCode});
			document.getElementById("shipping_fee").innerHTML = "<img src=\"https://icooon-mono.com/i/icon_16219/icon_162190_256.png\" width=\"50px\">（送料）"+ Number(result.data.node.shippingLine.priceV2.amount).toLocaleString('ja-JP', { style: 'currency', currency: result.data.node.currencyCode});
			document.getElementById("products_tax").innerHTML = "税金：" + Number(result.data.node.totalTax).toLocaleString('ja-JP', { style: 'currency', currency: result.data.node.currencyCode});
			document.getElementById("total_price").innerHTML = "合計："+ Number(result.data.node.totalPriceV2.amount).toLocaleString('ja-JP', { style: 'currency', currency: result.data.node.currencyCode});
		}
	});
});

if(document.getElementById('card_expires_year')){
    var select = document.getElementById('card_expires_year');
    var year = parseInt(new Date().getFullYear());
    for(var i=0; i < 20; i ++){
        var option = document.createElement("option");
        option.text = year + i;
        option.value = year + i;
		if(i == 2){
			option.selected = "selected";
		}
        select.appendChild(option);
    }
}

function add_payment_info(){
	if(true){
		let card = {
			"card[cvc]":document.getElementById("card_code").value, 
			"card[exp_month]":document.getElementById("card_expires_month").value, 
			"card[exp_year]": document.getElementById("card_expires_year").value, 
			"card[number]":document.getElementById("card_number").value
		};
		get_checkout_id(function(checkout_id){
			add_payment(checkout_id, card, checkout_info, function(result){
				if(result.data.checkoutCompleteWithTokenizedPaymentV2.checkoutUserErrors.length > 0){
					alert(result.data.checkoutCompleteWithTokenizedPaymentV2.checkoutUserErrors[0].message);
				}else{
					console.log(result.data.checkoutCompleteWithTokenizedPaymentV2.payment);
					delete_cookie("checkoutid");
				}
			});
		});
	}else{
		window.location.href=document.getElementById("web_url").value;
	}
}