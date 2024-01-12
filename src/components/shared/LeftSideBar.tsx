import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/lib/types";
const LeftSideBar = () => {
  const { user } = useUserContext(); // de structuring user from the context to use its values
  const navigate = useNavigate();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const {pathname} = useLocation();
  useEffect(() => {
    if (isSuccess) {
      navigate(0); // if our signout is successful we go back to sign in page
    }
  }, [isSuccess]);
  return (
    <section className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={120}
            height={50}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageURL || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-12 w-12 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-8">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className={`leftsidebar-link px-4 py-4 group ${isActive && "bg-primary-500"}`} >
                <NavLink to={link.route} className="flex gap-3 items-center">
                  <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive && "invert-white"}`} />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <Button
          variant="ghost"
          className="shad-button_ghost hover:opacity-50"
          onClick={() => signOut()}
        >
          <img src="assets/icons/logout.svg" alt="logout" />
          <div className="flex">
            <p className="body-bold">Logout</p>
          </div>
        </Button>
      </div>
    </section>
  );
};

export default LeftSideBar;
