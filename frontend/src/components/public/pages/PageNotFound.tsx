import {useLocation, useNavigate} from "react-router-dom";
import Container from "../../Container";
import PrimaryButton from "../../PrimaryButton";

export default function PageNotFound(){
    const navigate = useNavigate();
    const location = useLocation();

    function navigateToHome(){
        navigate("/");
    }

    return(
        <Container>
          <section className="mt-12 flex flex-col items-center gap-1">
              <h1 className="mt-2 text-4xl">🔎 👎</h1>
              <h1 className="mt-2 text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500">404 Not Found </h1>
              <div className="text-lg dark:text-white mt-6">
                  <p>It doesn't look like a page exists at <span className="font-mono px-2 py-1 bg-zinc-200 rounded text-red-500">'{import.meta.env.VITE_FRONTEND_URL}{location.pathname}'</span>.</p>
              </div>

              <button onClick={navigateToHome} className="mt-12 text-blue-500 dark:text-blue-300 hover:underline underline-offset-4">Go back home</button>
            </section>

        </Container>
    )
}

