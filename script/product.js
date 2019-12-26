function change_image(el){
    document.getElementById("image-main").src = el.src;
}

function update_cart_info(count){
    document.getElementById("checkout_items_count").innerText = count;
}

function put_to_cart(){
    let id = document.getElementById("selected_product").value;
    let count = document.getElementById("selected_count").value;
    get_checkout_id(function(checkout_id){
		if(checkout_id != ""){
			query_checkout_info(checkout_id, function(result){
				if(result.data.node.completedAt==null){
					add_item_to_checkout(result, id, count, function(result){
						let new_items = result.data.checkoutLineItemsReplace.checkout.lineItems.edges;
						let new_count = 0;
						new_items.forEach(item=>{
							new_count += item.node.quantity;
						});
						update_cart_info(new_count);
					});
				}else{
					create_checkout(id, count, function(result){
						var now = new Date();
						var time = now.getTime();
						var expireTime = time + 30*24*1000*3600;
						now.setTime(expireTime);
						document.cookie="checkoutid=" + encodeURIComponent(result.data.checkoutCreate.checkout.id) + "; Path=/; Expires=" + now.toGMTString();
						update_cart_info(count);
					});
				}
			});
		}else{
			create_checkout(id, count, function(result){
				var now = new Date();
				var time = now.getTime();
				var expireTime = time + 30*24*1000*3600;
				now.setTime(expireTime);
				document.cookie="checkoutid=" + encodeURIComponent(result.data.checkoutCreate.checkout.id) + "; Path=/; Expires=" + now.toGMTString();
				update_cart_info(count);
			});
		}
	});
}

function callback_write_review(data){
	document.getElementById("review_form").innerHTML = data.form;
	$(".new-review-form").attr("action", 'javascript:write_review('+pid+')');
	$(".new-review-form").removeAttr("onsubmit");
}

function write_review(pid){
	let name = $("#review_author_" +pid).val();
	let email = $("#review_email_" +pid).val();
	let title = $("#review_title_" +pid).val();
	let text = $("#review_body_" +pid).val();
	let rate = 5 - $(".spr-form-review-rating").find(".spr-icon-star-empty").length;

	write_review_by_product_id(pid, name, email, rate, title, text, "callback_write_review");
}

let pid=get_url_parameter( window.location.href, "pid");

if(pid != ""){
    results = decodeURIComponent(pid.replace(/\+/g, " "));
    get_product_by_product_id(results, function (result) {
        let info = result.data.products.edges[0].node;
        let images = info.images.edges;
        document.getElementById("image-main").src= images[0].node.src;
        let output = [];
        for(var i=0; i<(images.length > 5 ? 5 : images.length); i++){
            output.push("<div><img src=\""+ images[i].node.src +"\" class=\"image-size-small image-link\" onClick=\"change_image(this)\"></div>");
        }
        document.getElementById("vertical_images").innerHTML = output.join("");
        output = [];
        for(var i=5; i<images.length; i++){
            output.push("<div style=\"float:left\"><img src=\""+ images[i].node.src +"\" class=\"image-size-small image-link\" onClick=\"change_image(this)\"></div>");
        }
        document.getElementById("horizontal_images").innerHTML = output.join("");

        document.getElementById("product_description").innerHTML = info.descriptionHtml;
        document.getElementById("product_title").innerHTML = info.title;

        let options = info.options;
        let output_select = [];
        if(options.length != 1 || options[0].values.length != 1){
            for(var i=0; i<options.length; i++){
                output_select.push("<lable>" + options[i].name + "</lable>");
                output_select.push("<select name='product_selector' id='"+ options[i].name +"'>");
                for(var j=0; j<options[i].values.length; j++){
                    output_select.push("<option value='"+ options[i].values[j] +"'>"+ options[i].values[j] +"</option>");
                }
                output_select.push("</select>");
            }
            document.getElementById("select-options").innerHTML = output_select.join("");
        }

        let variants = info.variants.edges;
        let currencyCode = info.priceRange.minVariantPrice.currencyCode;

        if($("[name=product_selector]").length > 0){
            $("[name=product_selector]").change(function(e){
                let obj = document.getElementsByName("product_selector");
                let selected = [];
                for(let i=0; i<obj.length; i++){
                    selected[obj[i].id] = obj[i].value;
                }
                let target = [];
                for(let i=0; i<variants.length; i++){
                    let targetOptions = variants[i].node.selectedOptions;
                    let j = 0;
                    for(j=0; j<targetOptions.length; j++){
                        if(selected[targetOptions[j].name] != targetOptions[j].value){
                            j = -10;
                            break;
                        }
                    }
                    if(j == targetOptions.length){
                        target = variants[i].node;
                        break;
                    }
                }
                document.getElementById("selected_product").value = target.id;
                let old_price = new Number(target.compareAtPrice).toLocaleString('ja-JP', { style: 'currency', currency: currencyCode });
                let new_price = new Number(target.price).toLocaleString('ja-JP', { style: 'currency', currency: currencyCode });
                document.getElementById("current_price").innerHTML = "価格：<span style='text-decoration: line-through; margin-right:20px'>" + old_price + "</span>" +  new_price;
				if(target.availableForSale){
					document.getElementById("pick-up").disabled = "";
					document.getElementById("selected_count").value = "1";
				}else{
					document.getElementById("pick-up").disabled = "disabled";
					document.getElementById("selected_count").value = "Sold out";
				}
            });
            $("[name=product_selector]")[0].dispatchEvent(new Event('change'));
        }else{
            document.getElementById("selected_product").value = variants[0].node.id;
            let old_price = Number(variants[0].node.compareAtPrice).toLocaleString('ja-JP', { style: 'currency', currency: currencyCode });
            let new_price = Number(variants[0].node.price).toLocaleString('ja-JP', { style: 'currency', currency: currencyCode });
            document.getElementById("current_price").innerHTML = "価格：<span style='text-decoration: line-through; margin-right:20px'>" + old_price + "</span>" +  new_price;
        }
    });
	/*
	get_review_by_product_id(pid, function(result){
		document.getElementById("review_info").innerHTML = result.product+ result.reviews;
		document.getElementById("review_form").innerHTML =  result.form;
		$(".spr-review-reportreview").hide();
		$(".spr-summary-actions-newreview").hide();
		$(".new-review-form").attr("action", 'javascript:write_review('+pid+')');
		$(".new-review-form").removeAttr("onsubmit");
	});
	*/
}


get_checkout_id(function(checkout_id){
	if(checkout_id != ""){
		query_checkout_info(checkout_id, function(result){
			let data = result.data.node.lineItems.edges;
			let new_count = 0;
			if(result.data.node.completedAt == null){
				console.log(result.data.node.webUrl);
				data.forEach(item=>{
				new_count += item.node.quantity;
			});
			}
			update_cart_info(new_count);
		});
	}
});