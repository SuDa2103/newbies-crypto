import { NextApiResponse } from "next";

export async function fetchGetJSON(url: string) {
  try {
    const data = await fetch(url).then((res) => res.json());
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function fetchPostJSON(url: string, data?: {}) {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data || {}) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Wrapping any erroneous api call
 */
export const endWithError = ({
  res,
  code,
  msg,
  ...kwargs
}: {
  res: NextApiResponse;
  code: number;
  msg?: string | string[];
  formErrors?: { [key: string]: any };
  [key: string]: any;
}) => {
  return res.status(code).json({
    code,
    ok: code >= 200 && code <= 299,
    errors:
      typeof msg !== "undefined" ? (Array.isArray(msg) ? msg : [msg]) : null,
    ...(kwargs ? kwargs : {})
  });
};

/**
 * Wrapping any successful api call
 */
export const endWithSuccess = ({
  res,
  statusCode,
  ...kwargs
}: {
  statusCode: number;
  res: NextApiResponse;
} & { [key: string]: any }) => {
  return res.status(statusCode).json({
    ...kwargs
  });
};
