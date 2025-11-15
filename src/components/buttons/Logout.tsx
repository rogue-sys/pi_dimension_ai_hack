'use client'
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const Logout = () => {
  return (
    <div>
      <Button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-red-600 cursor-pointer font-medium"
      >
        Logout
      </Button>
    </div>
  );
};

export default Logout;
