function get_normal_collection(count, callback) {
  http_get("{ collections(first: " + count + ") { edges {  node { id image {src} } } }} ", callback);
}

function show_login_page() {
  let currentURL = window.location.href;
  window.location.href = "/ecsite/customer/login.html?redirect=" + currentURL;
}

function set_left_product_list() {
  if (document.getElementById("left_product_list")) {
    let list = [];
    get_product_by_product_id("4283175665769", function(result) {
      let url = result.data.products.edges[0].node.images.edges[0].node.src;
      let pid = atob(result.data.products.edges[0].node.id).split("/")[4];
      list.push("<div><a href=\"/ecsite/products/product.html?pid=" + pid + "\"><img src=\"" + url + "\" height='160px' width='160px'></a></div>");
      get_product_by_product_id("4362608541801", function(result) {
        let url = result.data.products.edges[0].node.images.edges[0].node.src;
        let pid = atob(result.data.products.edges[0].node.id).split("/")[4];
        list.push("<div><a href=\"/ecsite/products/product.html?pid=" + pid + "\"><img src=\"" + url + "\" height='160px' width='160px'></a></div>");
        document.getElementById("left_product_list").innerHTML = list.join("");
      });
    });
  }
}

function set_home_page_products() {
  if (document.getElementById('home_collection')) {
    get_products_by_collection_id("156766470249", function(result) {
      let data = result.data.collections.edges[0].node.products.edges;
      let output = [];
      for (let i = 0; i < data.length; i++) {
        let pid = atob(data[i].node.id).split("/")[4];
        output.push('<div style="float:left;margin-right:20px"><a href="/ecsite/products/product.html?pid=' + pid + '"><img src="' + data[i].node.images.edges[0].node.src + '" width="260px" height="260px"></a></div>');
      }
      document.getElementById('home_collection').innerHTML = output.join("");
    })
  }
}


if ($("#page-header").length > 0) {
  $("#page-header").load("/ecsite/page_header.html", function() {
    get_normal_collection(9, function(result) {
      let td_array = [];
      let obj = result.data.collections.edges;
      for (var i = 0; i < 8; i++) {
        let cid = atob(obj[i].node.id).split("/")[4];
        td_array.push("<td><a href=\"/ecsite/collections/collection_one.html?cid=" + cid + "\"><img src=\"" + obj[i].node.image.src + "\" width=\"285px\" height=\"100px\"></a></td>");
      }
      let str_html = "<table><tr>" + td_array[0] + td_array[1] + td_array[2] + td_array[3] + "</tr><tr>" + td_array[4] + td_array[5] + td_array[6] + td_array[7] + "</tr></table>";
      if (document.getElementById("normal_collections")) {
        document.getElementById("normal_collections").innerHTML = str_html;
        if (document.getElementById("sales_collection")) {
          let cid = atob(obj[8].node.id).split("/")[4];
          document.getElementById("sales_collection").innerHTML = "<div><a href=\"/ecsite/collections/collection_one.html?cid=" + cid + "\"><img src=\"" + obj[8].node.image.src + "\"></a></div>";
        }
        if (document.getElementById("login")) {
          let token = get_value_from_cookie("shopifyuser");
          if (token) {
            document.getElementById("login").innerHTML = "ログアウト";
            document.getElementById("login_link").href = "javascript:logout();";
            document.getElementById("order_list").style.display = "inline";
          }
        }
      };
    });
  });
}

if ($("#page-left").length > 0) {
  $("#page-left").load("/ecsite/page_left.html", function() {
    set_left_product_list();
  });
}

if ($("#page-footer").length > 0) {
  $("#page-footer").load("/ecsite/page_footer.html");
}

set_home_page_products();