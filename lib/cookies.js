export function detectCookies() {
  try {
    // Create cookie
    document.cookie = "cookietest=1; SameSite=Lax";
    var ret = document.cookie.indexOf("cookietest=") !== -1;
    // Delete cookie
    document.cookie =
      "cookietest=1; SameSite=Lax; expires=Thu, 01-Jan-1970 00:00:01 GMT";
    return ret;
  } catch (e) {
    return false;
  }
}
