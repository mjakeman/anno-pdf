import Container from "../../../Container";
import Logo from "../../../Logo";
import PublicHeaderNavLink from "./PublicHeaderNavLink";
import PrimaryButton from "../../../PrimaryButton";
import {Link, useNavigate} from "react-router-dom";

export default function PublicHeader() {

    let navigate = useNavigate();

    return (
      <header className="bg-white dark:bg-anno-space-900 py-4">
          <Container>
              <div className="flex flex-row justify-between items-center">
                  <Link to={"/"} className="flex flex-row  gap-2">
                        <span className="font-halant text-3xl font-medium text-anno-red-primary dark:text-anno-pink-500">Anno</span>
                        <Logo className="w-8 h-8" />
                  </Link>
                  <div className="flex flex-row gap-12 items-center">
                      <PublicHeaderNavLink to={"/about"} label={"About"} />
                      <PublicHeaderNavLink to={"/contact"} label={"Contact"} />
                      <PublicHeaderNavLink to={"/terms"} label={"Terms"} />
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                      <PublicHeaderNavLink to={"/login"} label={"Log in"} />
                      <PrimaryButton onClick={() => navigate("/signup")} label={"Sign up"}/>
                  </div>
              </div>
          </Container>
      </header>
    );
}