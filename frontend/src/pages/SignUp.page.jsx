import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/Auth.context";
import { useContract } from "@/contexts/Contract.context";

const SignUpPage = () => {
  const { signer, registerUser } = useContract();
  const { isLoggedIn, userName, checkLoginStatus } = useAuth();
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    checkLoginStatus();
  }, [signer, checkLoginStatus]);

  const handleRegister = async () => {
    if (nameInput) {
      await registerUser(nameInput);
      await checkLoginStatus(); // Refresh the login status after registration
    }
  };

  if (!signer || signer.length === 0) {
    return (
      <div className="flex flex-row justify-around mt-2 h-max">
        <div className="grid gap-4 py-4">
          <Label>Please log into your MetaMask wallet.</Label>
        </div>
      </div>
    );
  }

  if (isLoggedIn && userName) {
    return (
      <div className="flex flex-row justify-around mt-2 h-max">
        <div className="grid gap-4 py-4">
          <Label>Connected Wallet Address: {signer.address}</Label>
          <Label>User Name: {userName}</Label>
        </div>
      </div>
    );
  }

  if (signer && !userName) {
    return (
      <div className="flex flex-row justify-around mt-2 h-max">
        <div className="grid gap-4 py-4">
          <Label>Connected Wallet Address: {signer.address}</Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Input your Name:
            </Label>
            <Input
              id="username"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button onClick={handleRegister}>Register</Button>
        </div>
      </div>
    );
  }

  return <></>;
};

export default SignUpPage;
