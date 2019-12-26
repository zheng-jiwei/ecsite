//#### collection

let cid = get_url_parameter(window.location.href, "cid");
if (cid != "") {
  results = decodeURIComponent(cid.replace(/\+/g, " "));
  get_products_by_collection_id(results, function(result) {
    if (result.data) {
      document.getElementById("topic_image").src = result.data.collections.edges[0].node.image.src;
      let data = result.data.collections.edges[0].node.products.edges;
      let output = [];
      for (let i = 0; i < data.length; i++) {
        let pid = atob(data[i].node.id).split("/")[4];
        output.push("<div style=\"float:left\"><a href=\"/ecsite/products/product.html?pid=" + pid + "\"><img src=\"" + data[i].node.images.edges[0].node.src + "\" class=\"image-size\"><div><span>" + data[i].node.priceRange.minVariantPrice.currencyCode + "</span><span>" + data[i].node.priceRange.minVariantPrice.amount + "</span></div></a></div>");
      }
      document.getElementById("home_page_prodcuts").innerHTML = output.join("");
    } else {
      alert("error");
    }
  });
}