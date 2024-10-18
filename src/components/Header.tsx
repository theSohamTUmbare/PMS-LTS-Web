import { useContext } from "react";
import Logo from "../assets/react.svg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../utils/AuthMiddleware";

const Header = () => {
  const user: string | null = useContext(UserContext);
  return (
    <>
      <div className="bg-slate-900 py-5 gap-x-4">
        <div className="flex items-center text-white">
          <div className="flex gap-x-4 items-center">
            <img className="w-10 ml-2" src={Logo} alt="Logo" />
            <span className="text-white text-xl font-bold">
              <Link to="/">PMS-LTS</Link>
            </span>
          </div>
          <div className="flex items-center ml-9 gap-x-5">
            <span>
              <Link to="/manage">Manage Roles</Link>
            </span>
            <span>
              <Link to="">Live Map</Link>
            </span>
            <span>
              <Link to="">Communication</Link>
            </span>
            <span>
              <Link to="">Location History</Link>
            </span>
          </div>
          <div className="ml-auto px-6">
            {user ? (
              <Link to="">
                <FontAwesomeIcon className="px-3" icon={faUser} />
                <span className="text-white text-lg font-bold">{user}</span>
              </Link>
            ) : (
              <Link to="/login">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
