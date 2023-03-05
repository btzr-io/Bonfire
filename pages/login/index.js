import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

import { Jost } from "next/font/google";
const jost = Jost({ subsets: ["latin"] });

const PROJECT_URL = "https://github.com/btzr-io/Bonfire";

const Logo = (props) => {
  const { resolvedTheme } = useTheme();
  let src;
  switch (resolvedTheme) {
    case "light":
      src = "logo.svg";
      break;
    case "dark":
      src = "logo_dark.svg";
      break;
    default:
      src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      break;
  }

  return <Image src={src} alt="Bonfire" width={180} height={36} />;
};

const RATE_LIMIT_MESSAGE =
  "You have exceeded the hourly rate limit,  please try again in a few hours or minutes.";

const SIGN_IN_MESSAGE =
  "To continue your journey please log in to your account.";

export default function Home() {
  var [errorCode, setErrorCode] = useState(0);
  var [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const body = JSON.stringify(Object.fromEntries(formData));
    const method = form.method;
    const headers = { "Content-Type": "application/json" };
    const response = await fetch("/api/login", { body, method, headers });
    const responseData = await response.json();
    if (responseData.error) setErrorMessage(responseData.error);
    if (!response.ok && response.status) setErrorCode(response.status);
    if (responseData && responseData.ok) {
      router.push("/");
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login form" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div>
          <a href={PROJECT_URL}>
            <Logo />
          </a>
        </div>
      </header>
      <main>
        <form
          className="login"
          autoComplete="off"
          method="post"
          onSubmit={handleSubmit}
        >
          <div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {errorCode == 429 && <span>{RATE_LIMIT_MESSAGE}</span>}
            {errorCode != 429 && <span>{SIGN_IN_MESSAGE}</span>}
          </div>
          {errorCode != 429 && (
            <>
              <div>
                <label htmlFor="user">Username</label>
                <input type="text" id="user" name="user" />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" />
              </div>
              <div>
                <input type="submit" value="Sign in" />
                <section />
              </div>
              <div>
                <p>
                  <a href={PROJECT_URL}>Forgot your password ?</a>
                </p>
              </div>
            </>
          )}
        </form>
      </main>
    </>
  );
}
