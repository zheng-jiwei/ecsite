function delete_cookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

function logout() {
  let token = get_value_from_cookie("shopifyuser");
  delete_cookie("shopifyuser");
  customer_logout(token, function(result) {
    if (result.data.customerAccessTokenDelete.userErrors.length > 0) {
      alert(result.data.customerAccessTokenDelete.userErrors[0].message);
    } else {
      window.location.href = "/ecsite/index.html";
    }
  });
}

function get_url_parameter(url, target) {
  var regex = new RegExp("[?&]" + target + "(=([^&#]*)|&|#|$)");
  let results = regex.exec(url);
  if (!results) {
    return "";
  } else if (results[2]) {
    return results[2];
  } else {
    return "";
  }
}

function http_get(data, callback) {
  $.ajax({
    type: 'POST',
    timeout: 5000,
    url: "https://connecty-store.myshopify.com/api/2019-10/graphql.json",
    headers: {
      "X-Shopify-Storefront-Access-Token": "3485b3afb1a80078d9453337ae3f1767",
      "Content-Type": "application/graphql",
    },
    crossDomain: true,
    data: data,
    dataType: 'json',
    cache: false,
  }).done(function(result) {
    callback(result);
  }).fail(function(error) {
    callback(error)
  })
}

function http_get_2(data, callback) {
  $.ajax({
    type: 'POST',
    timeout: 5000,
    url: "https://connecty-store.myshopify.com/api/2019-10/graphql.json",
    headers: {
      "X-Shopify-Storefront-Access-Token": "3485b3afb1a80078d9453337ae3f1767",
      "Content-Type": "application/graphql",
    },
    data: data,
    crossDomain: true,
    processData: false,
    dataType: 'json',
    cache: false,
  }).done(function(result) {
    callback(result);
  }).fail(function(error) {
    callback(error)
  })
}

function http_get_payment_token(data, account_id, callback) {
  $.ajax({
    type: 'POST',
    timeout: 5000,
    url: "https://api.stripe.com/v1/tokens",
    headers: {
      "Stripe-Account": account_id,
      "Authorization": "Bearer sk_test_IENOkAEYLJP5avJFzHgKr2wg00YNXgpSVx",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
    crossDomain: true,
    dataType: 'json',
    cache: false,
  }).done(function(result) {
    callback(result);
  }).fail(function(error) {
    callback(error)
  });
}


function http_get_common(url, data, callback) {
  $.ajax({
    type: 'POST',
    timeout: 5000,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    crossDomain: true,
    data: data,
    dataType: 'json',
    cache: false,
  }).done(function(result) {
    callback(result);
  }).fail(function(error) {
    callback(error)
  })
}
/*
// /shopify/channel/query -> add payment
// /shopify/channel/query  -> get country/ province
// reviews
function http_get_by_server(url, input, callback){
		$.ajax({type: 'POST',
            url: url,
            data: input,
            dataType: 'json',
            timeout: 2000,
            cache: false,
            async:false
	   }).done(function(result, status, xhr){
            callback(result);
        }).fail(function(result, status, xhr){
            console.log(result);
        });
}

function http_get_by_server_2(url, input){
		$.ajax({type: 'POST',
            url: url,
            data: input,
            dataType: 'script',
            timeout: 2000,
            cache: false,
	   }).done(function(result){
            console.log(result);
        }).fail(function(error){
            console.log(error);
        });
}
*/
function get_product_by_product_id(id, callback) {
  http_get("{\n" +
    "  products(query: \"id:'" + id + "'\", first: 1) {\n" +
    "    edges {\n" +
    "      node {\n" +
    "        images(first: 10) {\n" +
    "          edges {\n" +
    "            node {\n" +
    "              src\n" +
    "            }\n" +
    "          }\n" +
    "        }\n" +
    "        id\n" +
    "        priceRange {\n" +
    "          minVariantPrice {\n" +
    "            currencyCode\n" +
    "          }\n" +
    "        }\n" +
    "        descriptionHtml\n" +
    "        title\n" +
    "        options {\n" +
    "          name\n" +
    "          values\n" +
    "        }\n" +
    "        variants(first:50) {\n" +
    "          edges {\n" +
    "            node {\n" +
    "              id\n" +
    "              availableForSale\n" +
    "              compareAtPrice\n" +
    "              price\n" +
    "              sku\n" +
    "              title\n" +
    "              selectedOptions {\n" +
    "                name\n" +
    "                value\n" +
    "              }\n" +
    "            }\n" +
    "          }\n" +
    "        }\n" +
    "      }\n" +
    "    }\n" +
    "  }\n" +
    "}", callback);
}

function get_products_by_collection_id(id, callback) {
  http_get("{\n" +
    "  collections(query: \"id:'" + id + "'\", first: 1) {\n" +
    "    edges {\n" +
    "      node {\n" +
    "        image {\n" +
    "          src}\n" +
    "        products(first: 20) {\n" +
    "          edges {\n" +
    "            node {\n" +
    "              id \n" +
    "              priceRange {\n" +
    "                minVariantPrice {\n" +
    "                  amount\n" +
    "                  currencyCode\n" +
    "                }\n" +
    "              }\n" +
    "              variants(first: 1) {\n" +
    "                edges {\n" +
    "                  node {\n" +
    "                    compareAtPrice\n" +
    "                  }\n" +
    "                }\n" +
    "              }\n" +
    "              images(first: 1) {\n" +
    "                edges {\n" +
    "                  node {\n" +
    "                    src\n" +
    "                  }\n" +
    "                }\n" +
    "              }\n" +
    "            }\n" +
    "          }\n" +
    "        }\n" +
    "      }\n" +
    "    }\n" +
    "  }\n" +
    "}\n", callback);
}

function create_checkout(id, count, callback) {
  http_get("mutation {checkoutCreate(input: {lineItems: [{quantity: " + count + ", variantId: \"" + id + "\"}]}) {checkout {id webUrl}}}", callback);
}

function query_checkout_info(checkout_id, callback) {
  let input = "query { node(id: \"" + checkout_id + "\") { ... on Checkout {id email webUrl completedAt currencyCode taxesIncluded shippingAddress{country province city address1 address2 company zip phone firstName lastName } totalTax subtotalPriceV2{amount}  totalPriceV2{amount} totalTaxV2{amount} shippingLine{priceV2{amount}}  lineItems(first:50){edges{node{discountAllocations{allocatedAmount{amount}} title quantity variant{product{options{values}} image{originalSrc} id title priceV2{amount currencyCode}}}}} order{name}}}}";
  http_get(input, callback);
}

function add_item_to_checkout(result, id, count, callback) {
  let data = result.data.node.lineItems.edges;
  let items = "";
  for (let i = 0; i < data.length; i++) {
    items += "{quantity: " + data[i].node.quantity + ", variantId: \"" + data[i].node.variant.id + "\"}"
  }
  items += "{quantity: " + count + ", variantId: \"" + id + "\"}";
  let input = "mutation {checkoutLineItemsReplace(lineItems: [" + items + "], checkoutId: \"" + result.data.node.id + "\") {checkout {id webUrl lineItems(first:10){edges{node{quantity}}}}}}";
  http_get(input, callback);
}

function add_shipping_address_to_checkout(checkout_id, data, callback) {
  let input = "mutation {checkoutShippingAddressUpdateV2(shippingAddress: {" + data + "}";
  input += ", checkoutId: \"" + checkout_id + "\")  {checkout {ready requiresShipping email id} checkoutUserErrors {code field message}}}";
  http_get(input, callback);
}

function add_shipping_line(checkout_id, callback) {
  let input = "query { node(id: \"" + checkout_id + "\") { ... on Checkout { id webUrl availableShippingRates { ready shippingRates { handle priceV2 { amount } title } } } }}"
  http_get(input, function(result) {
    input = 'mutation {checkoutShippingLineUpdate(checkoutId: "' + checkout_id + '", shippingRateHandle: "' + result.data.node.availableShippingRates.shippingRates[0].handle + '") {checkout {ready requiresShipping id webUrl} checkoutUserErrors {code field message}}}';
    console.log(input);
    http_get_2(input, callback);
  });
}

function get_countries_list(callback) {
  http_get('query { __type(name: "CountryCode") { states: enumValues {name description } }}', callback);
  //http_get_by_server('/shopify/channel/query', {'url': "countries.json", 'method': "get"}, callback);
}

function get_provinces_list(country_id, callback) {
  http_get_by_server('/shopify/channel/query', {
    'url': "countries/" + country_id + ".json",
    'method': "get"
  }, callback);
}

function update_checkout_email(checkout_id, email, callback) {
  let input = "mutation {checkoutEmailUpdateV2(checkoutId:\"" + checkout_id + "\", email: \"" + email + "\") {checkout { id, webUrl } checkoutUserErrors {code field  message}}}";
  http_get(input, callback);
}

function add_payment(checkout_id, input_data, checkout_info, callback) {
  http_get_payment_token(input_data, checkout_info.shopifyPaymentsAccountId, function(result) {
    if (result.status) {
      alert(result.responseText);
    } else {
      let shippingAddress = checkout_info.shippingAddress;
      let str_query = 'mutation {checkoutCompleteWithTokenizedPaymentV2(checkoutId: "' + checkout_id + '", payment:{paymentAmount:{amount: "' + checkout_info.totalPriceV2.amount + '", currencyCode: ' + checkout_info.currencyCode + '},idempotencyKey: "' + btoa('gid://uuid-' + new Date().getTime()) + '", billingAddress: {firstName: "' + shippingAddress.firstName + '", lastName: "' + shippingAddress.lastName + '", address1: "' + shippingAddress.address1 + '", province: "' + shippingAddress.province + '",country: "' + shippingAddress.country + '",  city: "' + shippingAddress.city + '", zip: "' + shippingAddress.zip + '"}, paymentData: "' + result.id + '", type:"card"}) { checkout { id } checkoutUserErrors { code field message } payment { id ready errorMessage transaction{statusV2}} }}';
      console.log(str_query);
      http_get(str_query, callback);
    }
  });
}

function query_customer_info(token, callback) {
  let input = 'query {customer(customerAccessToken:"' + token + '") {... on Customer{id email phone addresses(first: 10) {edges{node{id country countryCode province provinceCode city zip address1 address2 company firstName lastName phone}}} defaultAddress{country countryCode province provinceCode city zip address1 address2 company firstName lastName phone}}}}'
  http_get(input, callback);
}

function query_customer_orders(token, str_query, callback) {
  let input = 'query {customer(customerAccessToken:"' + token + '") {... on Customer{ orders(' + str_query + ",reverse:true" + ') {pageInfo {hasNextPage hasPreviousPage} edges {cursor node {currencyCode processedAt totalPrice email id lineItems(first: 10) { edges { node {quantity title variant{image{src} priceV2{amount}}} } } } } } }}}'
  http_get(input, callback);
}

function query_customer_order(token, str_query, callback) {
  let input = 'query {customer(customerAccessToken:"' + token + '") {... on Customer{ orders(' + str_query + ') {pageInfo {hasNextPage hasPreviousPage} edges {cursor node {name currencyCode processedAt totalPrice email id shippingAddress{country province city address1 address2 company zip phone firstName lastName } totalPriceV2{amount} totalShippingPriceV2{amount} totalTaxV2{amount}  lineItems(first: 10) { edges { node {quantity title variant{image{src} priceV2{amount} title product{options{name values}}  }} } } } } } }}}'
  http_get(input, callback);
}

function query_customer_checkout(token, callback) {
  let input = 'query {customer(customerAccessToken:"' + token + '") {... on Customer{lastIncompleteCheckout {id email}}}}'
  http_get(input, callback);
}

function add_customer_address(token, data, callback) {
  let input = "mutation {customerAddressCreate(customerAccessToken: \"" + token + "\", address: {" + data + "}) {customerAddress {  id } customerUserErrors {  code field message}}}";
  http_get(input, callback);
}

function delete_customer_address(token, id, callback) {
  let input = "mutation {customerAddressDelete(id: \"" + id + "\", customerAccessToken: \"" + token + "\") {customerUserErrors { code field message } deletedCustomerAddressId}}";
  http_get(input, callback);
}

function customer_login(email, password, callback) {
  let input = "mutation {customerAccessTokenCreate (input: {email: \"" + email + "\", password:\"" + password + "\"}) {customerAccessToken {accessToken  expiresAt } customerUserErrors {code field message }}}";
  http_get(input, callback);
}

function customer_logout(token, callback) {
  let input = "mutation {customerAccessTokenDelete(customerAccessToken: \"" + token + "\") {deletedAccessToken deletedCustomerAccessTokenId userErrors {  field message}}}";
  http_get(input, callback);
}

function create_customer_user(email, password, callback) {
  let input = "mutation {customerCreate(input: {email: \"" + email + "\", password:\"" + password + "\"}) {customer { id }  customerUserErrors { code field message}}}";
  http_get(input, callback);
}

//**** order ****
/*
function get_orders_by_querystring(str_query, callback){
	let input = "{ orders("+ str_query +") { edges {cursor node { email id currencyCode name createdAt totalPrice totalTax shippingLine {price} shippingAddress{country province city zip address1 address2 company lastName firstName phone} lineItems(first: 10) { edges { node { image { src } title quantity variantTitle  name  originalUnitPrice} } } } }  pageInfo {hasNextPage hasPreviousPage} } }"
	console.log(input);
	http_get_by_server("/shopify/channel/query", {"url": "", "method": "post", "data": input}, callback);
}

function get_checkout_by_token(token, callback){
	//get image by token in Order
	http_get_by_server("/shopify/channel/query", {"url": "checkouts/"+token +".json", "method": "get", "data": null}, callback);
}
*/
//***** review *****
function get_review_by_product_id(id, callback) {
  http_get_by_server("/shopify/client/query", {
    "url": "https://productreviews.shopifycdn.com/proxy/v4/reviews/product?product_id=" + id + "&version=v4&shop=connecty-store.myshopify.com",
    "method": "get"
  }, callback);
}

//write_review("4384615170153", "name-01", "aaa@b.com", "3", "title-03", "text-03", function(result){console.log(result)})
function write_review_by_product_id(product_id, name, email, rate, title, text, callbackName) {
  let params = "callback=" + callbackName;
  params += "&product_id=" + product_id;
  params += "&shop=connecty-store.myshopify.com";
  params += "&review%5Brating%5D=" + rate;
  params += "&review%5Bauthor%5D=" + encodeURI(name);
  params += "&review%5Bemail%5D=" + encodeURI(email);
  params += "&review%5Btitle%5D=" + encodeURI(title);
  params += "&review%5Bbody%5D=" + encodeURI(text);
  params += "&prdocut_ids%5B%5D=" + product_id;
  params += "&_=" + new Date().getTime();

  //get_orders_by_querystring("query: \"email:"+email + "\", first:10")
  http_get_by_server_2("/shopify/client/query", {
    "url": "https://productreviews.shopifycdn.com/proxy/v4/reviews/create?" + params,
    "method": "get"
  });
  //?callback=jQuery1102009694952547238422_1527532788735&review%5Brating%5D=1&product_id=4283175665769&review%5Bauthor%5D=Testing&review%5Bemail%5D=tester%40test.com&review%5Btitle%5D=testtitle&review%5Bbody%5D=This+was+bad&shop=connecty-store.myshopify.com&_=1527532788738
}

function get_value_from_cookie(key) {
  let checkouts = document.cookie.split(";");
  let checkout_id = "";
  checkouts.forEach(item => {
    item = item.trim();
    let currentCookie = item.split("=");
    if (currentCookie[0] == key) {
      checkout_id = currentCookie[1];
    }
  });
  return decodeURIComponent(checkout_id);
}

function get_checkout_id(callback) {
  callback(get_value_from_cookie("checkoutid"));
  /*
  	let token = get_value_from_cookie("shopifyuser");
  	if(token == ""){
  		 callback(get_value_from_cookie("checkoutid"));
  	}else{
  		query_customer_checkout(token, function(result){
  			if(result.data.customer.lastIncompleteCheckout){
  				callback(result.data.customer.lastIncompleteCheckout.id);
  			}else{
  				callback("");
  			}
  		});
  	}
  */
}