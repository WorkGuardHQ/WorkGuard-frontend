import UAParser from "ua-parser-js";

export function getDeviceInfo() {
  const parser = new UAParser();
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown Browser";

  const os =
    result.os.name
      ? `${result.os.name}${result.os.version ? ` ${result.os.version}` : ""}`
      : "Unknown OS";

  const vendor = result.device.vendor;
  const model = result.device.model;
  const type = result.device.type;

  let deviceName;

  if (vendor && model) {
    deviceName = `${vendor} ${model}`;
  } else if (type === "mobile") {
    deviceName = "Android Phone";
  } else if (type === "tablet") {
    deviceName = "Tablet";
  } else {
    deviceName = os;
  }

  return {
    browser,
    os,
    deviceName,
    fullName: `${deviceName} • ${browser}`
  };
}