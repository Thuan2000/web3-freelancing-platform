import { NavLink } from "react-router-dom";

import { useAuth } from "@/contexts/Auth.context";
import UserAvatar from "@/components/UserAvatar";

const getNavLinkClass = (isActive) =>
  `mx-2 transition-all py-1 ${
    isActive ? "text-white bg-black rounded px-2" : "hover:underline"
  }`;

const Header = () => {
  const { userName } = useAuth();
  return (
    <header className="p-4 border-b-2 fixed top-0 left-0 w-full bg-white z-10">
      <nav className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Jobs Search
          </NavLink>

          <NavLink
            to="/in-conflicts"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            In-Conflicts
          </NavLink>
          {/* <NavLink
            to="/test"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Test Page
          </NavLink> */}
        </div>
        <div className="flex items-center space-x-4">
          {userName ? (
            <NavLink
              to="/jobs-management"
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              Jobs Management
            </NavLink>
          ) : (
            <></>
          )}
          {userName ? (
            <div className="flex flex-row justify-center items-center px-2 border border-white hover:border-slate-500 hover:rounded-lg hover:cursor-pointer">
              <span className="mr-2">{userName}</span>
              <UserAvatar userName={userName} />
            </div>
          ) : (
            <NavLink
              to="/sign-up"
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              Sign In/Sign Up
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
