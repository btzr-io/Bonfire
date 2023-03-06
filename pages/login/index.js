import Head from "next/head";
import Logo from "@/components/logo";
import { Jost } from "next/font/google";
import { useRouter } from "next/router";
import { detectCookies } from "@/lib/cookies";
import { useState, useEffect } from "react";

import {
  ERROR_RATE_LIMIT,
  ERROR_AUTHENTICATION,
  ERROR_COOKIES_DISABLED,
} from "@/lib/errors";

const jost = Jost({ subsets: ["latin"] });

const PROJECT_URL = "https://github.com/btzr-io/Bonfire";

const SIGN_IN_MESSAGE =
  "To continue your journey please log in to your account.";

export default function Home() {
  var [error, setError] = useState();
  var [mounted, setMounted] = useState(false);
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
    if (responseData.error) setError(responseData.error);
    if (responseData && responseData.ok) {
      router.push("/");
    }
  }

  useEffect(() => {
    if (!detectCookies()) {
      setError(ERROR_COOKIES_DISABLED);
    }
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

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
            {error && <p className="error">{error.title}</p>}
            <span>{error ? error.description : SIGN_IN_MESSAGE}</span>
          </div>
          {(!error || error.code == 400) && (
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
