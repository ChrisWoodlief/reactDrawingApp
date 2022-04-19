import { NextPageContext } from "next";
import { getCsrfToken } from "next-auth/react";
import NextImage from "next/image";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

const Login = ({ csrfToken }) => {
  const { query } = useRouter();
  return (
    <>
      <div className="boxed-content login-page">
        {query.error && <p className="danger-zone">Failed to login.</p>}
        <form action="/api/auth/callback/credentials/" method="POST">
          <label>
            Username
            <input name="username" type="text" />
          </label>
          <label>
            Password
            <input name="password" type="password" />
          </label>
          {/* <p>Remember me: form.remember_me </p> */}
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <button type="submit">Login</button>
        </form>
      </div>
      <div
        style={{ position: "absolute", bottom: 0, width: "100%" }}
        className="footer-colors"
      >
        <div className="col-1"></div>
        <div className="col-2"></div>
        <div className="col-3"></div>
      </div>
    </>
  );
};

export default Login;
