import {useLocation, useNavigate} from "react-router-dom";
import Container from "../../Container";

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
                  <p>It doesn't look like a page exists.</p>
              </div>

              <button onClick={navigateToHome} className="mt-12 text-blue-500 dark:text-blue-300 hover:underline underline-offset-4">Go back home</button>
            </section>

        </Container>
    )
}

