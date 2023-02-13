import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Container } from "./Container";

function LoggedOutBanner() {
  const { data: session } = useSession();

  if (session) return;

  return (
    <div className="fixed bottom-0 w-full bg-primary p-4">
      <Container classNames="bg-transparent flex justify-between">
        <p className="text-white">Do not miss out</p>
        <button className="p-4 text-white shadow-md" onClick={() => signIn()}>
          Login
        </button>
      </Container>
    </div>
  );
}

export default LoggedOutBanner;
