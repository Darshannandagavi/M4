export function getSocketUrl() {
  if (typeof window === "undefined") return "http://localhost:4000";
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${window.location.hostname}:4000`;
}

export function getNetworkControllerUrl() {
  if (typeof window === "undefined") return "";
  const { hostname, port, protocol } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ""}/?controller=1`;
}

export function getScreenAngle() {
  if (
    typeof window !== "undefined" &&
    window.screen?.orientation?.angle !== undefined
  ) {
    return window.screen.orientation.angle;
  }
  return typeof window !== "undefined" ? window.orientation || 0 : 0;
}

export function extractTiltDegrees(event, isForcedLandscape) {
  const beta = event.beta ?? 0;
  const gamma = event.gamma ?? 0;
  const angle = getScreenAngle();

  if (angle === 90) return beta;
  if (angle === -90 || angle === 270) return -beta;
  if (isForcedLandscape) return beta;
  return gamma;
}
