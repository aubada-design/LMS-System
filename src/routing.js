export function routeHref(path) {
  return `#${path}`;
}

export function getCurrentRoute() {
  const hashRoute = window.location.hash.startsWith("#/")
    ? window.location.hash.slice(1)
    : "/";

  return hashRoute.split("?")[0] || "/";
}

export function navigateToRoute(path) {
  window.location.assign(routeHref(path));
}
