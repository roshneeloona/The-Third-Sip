function parseCookies(cookieHeader) {
  return cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((cookies, entry) => {
      const [rawKey, ...rawValue] = entry.split("=");
      const key = rawKey ? rawKey.trim() : "";
      if (!key) {
        return cookies;
      }

      cookies[key] = decodeURIComponent(rawValue.join("=").trim());
      return cookies;
    }, {});
}

module.exports = { parseCookies };
