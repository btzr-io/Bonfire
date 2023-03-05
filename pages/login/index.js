import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useTheme } from "next-themes";
const inter = Inter({ subsets: ["latin"] });

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

const SIGN_IN_MESSAGE =
  "To continue your journey please log in to your account.";

function signIn(e) {
  e.preventDefault();
  // Read the form data
  const form = e.target;
  const formData = new FormData(form);
  const method = form.method;
  const body = JSON.stringify(Object.fromEntries(formData));

  const headers = new Headers({ "Content-Type": "application/json" });

  fetch("/api/login", { body, method, headers })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.info(data);
    })
    .catch((error) => console.info(error));
}

export default function Home() {
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
          onSubmit={signIn}
        >
          <div>
            <span>{SIGN_IN_MESSAGE}</span>
          </div>
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
        </form>
      </main>
    </>
  );
}
