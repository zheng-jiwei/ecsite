function insert_shipping_to_checkout(index){
	let data = "";
	if(index == ""){
		data = "lastName: \"" + document.getElementsByName("last_name")[0].value + "\",";
		data += "firstName: \"" + document.getElementsByName("first_name")[0].value + "\",";
		data += "zip: \"" + document.getElementsByName("user_zip_first")[0].value + "-" + document.getElementsByName("user_zip_last")[0].value + "\",";
		data += "phone: \"" +  document.getElementsByName("user_phone")[0].value + "\",";
		data += "country: \"" + document.getElementById("country_select").selectedOptions[0].text + "\",";
/*
		if(document.getElementById("province_select").selectedOptions.length > 0){
			data += "province: \"" + document.getElementById("province_select").selectedOptions[0].text + "\",";
		}else{
			data += "province: \"\",";
		}
*/
		data += "province: \"" + document.getElementById("province_select").value + "\",";
		data += "address1: \"" + document.getElementsByName("user_address1")[0].value + "\",";
		data += "address2: \"" + document.getElementsByName("user_address2")[0].value + "\",";
		data += "company: \"" + document.getElementsByName("user_company")[0].value + "\"";
		data += "city: \"" + document.getElementsByName("user_city")[0].value + "\"";
		let token = get_value_from_cookie("shopifyuser");
		if(token){
			//登録
			if(document.getElementById("save_address").checked){
				add_customer_address(token, data, function(result){
					if(result.data.customerAddressCreate.customerUserErrors.length > 0){
						alert(result.data.customerAddressCreate.customerUserErrors[0].message);
					}
				});
			}
		}
	}else{
		data = "lastName: \"" +document.getElementById("last_name_" + index).innerHTML + "\",";
		data += "firstName: \"" +document.getElementById("first_name_" + index).innerHTML + "\",";
		data += "zip: \"" + document.getElementById("zip_" + index).innerHTML+ "\",";
		data += "phone: \"" +  document.getElementById("phone_" + index).innerHTML + "\",";
		data += "country: \"" + document.getElementById("country_" + index).innerHTML + "\",";
		data += "province: \"" + document.getElementById("province_" + index).innerHTML + "\",";
		data += "address1: \"" + document.getElementById("address1_" + index).innerHTML+ "\",";
		data += "address2: \"" + document.getElementById("address2_" + index).innerHTML + "\",";
		data += "company: \"" + document.getElementById("company_" + index).innerHTML + "\"";
		data += "city: \"" + document.getElementById("city_" + index).innerHTML + "\"";
	}

	//checkoutの情報を記入
    get_checkout_id(function(checkout_id){
		add_shipping_address_to_checkout(checkout_id, data, function(result){
			if(result.data.checkoutShippingAddressUpdateV2.checkoutUserErrors.length > 0){
				alert(result.data.checkoutShippingAddressUpdateV2.checkoutUserErrors[0].message);
			}else{
				add_shipping_line(checkout_id, function(result){
					if(result.data.checkoutShippingLineUpdate.checkoutUserErrors.length >0){
						alert(result.data.checkoutShippingLineUpdate.checkoutUserErrors[0].message);
					}else{
						update_checkout_email(checkout_id, document.getElementsByName("user_email")[0].value, function(result){
							if(result.data.checkoutEmailUpdateV2.checkoutUserErrors.length >0){
								alert(result.data.checkoutEmailUpdateV2.checkoutUserErrors[0].message);
							}else{
								//window.location.href=document.getElementById("shipping_form").action;
								var now = new Date();
								var time = now.getTime();
								var expireTime = time + 30*24*1000*3600;
								now.setTime(expireTime);
								document.cookie="order_token=" + encodeURIComponent(checkout_id) + "; Path=/; Expires=" + now.toGMTString();
								window.location.href = result.data.checkoutEmailUpdateV2.checkout.webUrl;
							}
						});
					}
				});
			}
		});
	});
}

if(document.getElementById("registered_shipping_address")){
	let token = get_value_from_cookie("shopifyuser");
    if(token){
		query_customer_info(token, function(result){
			let addresses = result.data.customer.addresses.edges;
			let defaultAddr = result.data.customer.defaultAddress;
			let email = result.data.customer.email;
			let list = [];
			for(let i=0; i<addresses.length; i++){
				list.push("<div id=\"saved_address_"+i+"\" style=\"text-align:left; border:solid 1px lightgray; padding:10px; margin-bottom:10px; width: 450px\">\n" +
            "<div><span id=\"last_name_"+i+"\">"+ addresses[i].node.lastName +"</span><span id=\"first_name_"+i+"\">"+ addresses[i].node.firstName +"</span><input type=\"button\" name=\"delete_address\" alt=\""+i+"\" value=\"X\" height=\"20px\" style=\"float:right\"/></div>\n" +
            "<div id=\"zip_"+i+"\">"+ addresses[i].node.zip +"</div>\n" +
            "<div id=\"country_"+i+"\">"+ addresses[i].node.country +"</div>\n" +
            "<div id=\"province_"+i+"\">"+ addresses[i].node.province +"</div>\n" +
            "<div id=\"city_"+i+"\">"+ addresses[i].node.city +"</div>\n" +
            "<div id=\"address1_"+i+"\">"+ addresses[i].node.address1 +"</div>\n" +
            "<div id=\"address2_"+i+"\">"+ addresses[i].node.address2 +"</div>\n" +
            "<div id=\"company_"+i+"\">"+addresses[i].node.company+"</div>\n" +
            "<div id=\"phone_"+i+"\">"+addresses[i].node.phone+"</div>\n" +
            "<div id=\"addressId_"+i+"\" style=\"display:none\">"+addresses[i].node.id+"</div>\n" +
            "<input type=\"button\" name=\"saved_address\" id=\"delivery_"+i+"\" class=\"checkout-button\" value=\"この住所に届く\" />\n" +
            "</div>\n");
			}
	        document.getElementById("registered_shipping_address").innerHTML= list.join("\n");

			document.getElementsByName("user_email")[0].value = email;
			document.getElementsByName("user_email")[0].readOnly = true;

			if($('input[name="saved_address"]').length>0){
				$('input[name="saved_address"]').click(function(e){
					let index = e.target.id.split("_")[1];
					insert_shipping_to_checkout(index);
				})
			}

			if($('input[name="delete_address"]').length>0){
				$('input[name="delete_address"]').click(function(e){
					let index =e.target.alt;
					delete_customer_address(token, document.getElementById("addressId_"+index).innerHTML, function(result){
						if(result.data.customerAddressDelete.customerUserErrors.length > 0){
							alert(result.data.customerAddressDelete.customerUserErrors[0].message);
						}else{
							document.getElementById("saved_address_" + index).style.display = "none";
						}
					});
				})
			}
		});
        document.getElementById("div_save_address").style.display="block";
	}
}

if(document.getElementById("country_select")){
	/*
    $("#country_select").on('change', function(event){
        document.getElementById("province_select").innerHTML = "";
        let target = event.target.options;
        let id = target[target.selectedIndex].id;
		get_provinces_list(id, function(result){
		    if(result.country.provinces.length > 0){
                let provinces = result.country.provinces;
                let list = [];
                for(let i=0; i< provinces.length; i++){
					list.push("<option id=\"" + provinces[i].id + "\" value=\""+ provinces[i].code +"\">"+provinces[i].name +"</option>");
                }
                document.getElementById("province_select").innerHTML = list.join("\n");
                document.getElementById("province_select").disabled = "";
            }else{
                document.getElementById("province_select").disabled = "disabled";
            }
		});
    });
*/
	get_countries_list(function(result){
		if(result.data.__type){
			let items = result.data.__type.states;
			let list = [];
			items.forEach(item=>{
				let country_name = item.description.replace(".", "");
					list.push("<option value=\""+ item.name +"\">"+ country_name +"</option>");
			});
		   document.getElementById("country_select").innerHTML = list.join("\n");
		}else{
			alert(result.data);
		}
/*		
        if(result.countries.length > 0){
            let list = [];
            for(let i =0; i< result.countries.length; i++){
				if(result.countries[i].code != "*"){
					list.push("<option id=\"" +  result.countries[i].id + "\" value=\""+ result.countries[i].code +"\">"+result.countries[i].name +"</option>");
				}
            }
            document.getElementById("country_select").innerHTML = list.join("\n");
            document.getElementById("country_select").dispatchEvent(new Event('change'));
        }
		*/
    });
}