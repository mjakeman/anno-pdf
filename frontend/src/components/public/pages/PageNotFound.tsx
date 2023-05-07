import Container from "../../Container";

export default function PageNotFound(){
    return(
        <Container>
          <section className="mt-12">
              <h1 className="mt-2 text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500">404</h1>
              <div className="text-lg dark:text-white mt-6">
                  <p>Page not found</p>
              </div>
            </section>

        </Container>
    )
}