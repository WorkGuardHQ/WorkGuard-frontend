import { apiPost } from "../helpers/api";

//const DOCS_URL =  "https://workguard-docs.vercel.app";
// const DOCS_URL = "http://localhost:5174";
const DOCS_URL =
import.meta.env.VITE_DOCS_URL;

export const openDocumentation = async (isAdmin) => {
  try {

    const res = await apiPost("/docs/sso");

    const path = isAdmin
      ? "/admin/employee-management"
      : "/employee/welcome";

    window.open(
      `${DOCS_URL}/sso/${res.data.ssoToken}?redirect=${encodeURIComponent(path)}`,
      "_blank"
    );

  } catch (err) {

    console.error(
      "Failed to open documentation",
      err
    );

  }
};