if (document.getElementById("create_customer")) {
  $("#create_customer").on("click", function(event) {
    let email = document.getElementById("user_email").value;
    let password = document.getElementById("user_password").value;
    create_customer_user(email, password, function(result) {
      if (result.data.customerCreate.customerUserErrors.length > 0) {
        alert(result.data.customerCreate.customerUserErrors[0].message);
      } else {
        window.location.href = "/ecsite/customer/login.html";
      }
    });
  });
}

if (document.getElementById("customer_login")) {
  let redirect = decodeURIComponent(get_url_parameter(window.location.href, "redirect"));
  document.getElementById("login_form").action = redirect;
  let mail = get_url_parameter(redirect, "email");
  document.getElementById("user_email").value = mail;
  if (mail) {
    document.getElementById("user_email").readOnly = true;
  }
  $("#customer_login").on("click", function(event) {
    let email = document.getElementById("user_email").value;
    let password = document.getElementById("user_password").value;
    customer_login(email, password, function(result) {
      if (result.data.customerAccessTokenCreate.customerUserErrors.length > 0) {
        alert(result.data.customerAccessTokenCreate.customerUserErrors[0].message);
      } else {
        let expiresDate = new Date(result.data.customerAccessTokenCreate.customerAccessToken.expiresAt);
        document.cookie = "shopifyuser=" + result.data.customerAccessTokenCreate.customerAccessToken.accessToken + "; Path=/; Expires=" + expiresDate.toGMTString();
        window.location.href = document.getElementById("login_form").action;
      }
    });
  });
}