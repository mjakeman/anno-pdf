import Container from "../../Container";
import heroImg from "../../../assets/images/aboutpage/hero.jpg";
import PrimaryButton from "../../PrimaryButton";

export default function Contact() {
    return (
      <Container>
          <section className="mt-12">
              <p className="text-neutral-400 dark:text-white">Contact</p>
              <h1 className="mt-2 text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500">Get in touch.</h1>
              <div className="text-lg dark:text-white mt-6">
                  <p>This project is still very much a work in progress, but we’d love to hear from you!</p>
                  <p>Use the form on the side to let us know what you love, what you hate, or if you want to get involved.</p>
                  <p>- The Anno Team.</p>
              </div>
          </section>
          <form className="my-12 p-12 flex flex-col gap-6 bg-white dark:bg-anno-space-900 drop-shadow-around border-2 dark:border-anno-space-100 rounded-xl">
              <div>
                  <label className="mb-2 text-neutral-400 dark:text-white" htmlFor="name-input" >Name: <span className="text-red-500">*</span></label>
                  <input type="text" id="name-input" placeholder="Enter your name here..." className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
              </div>
              <div>
                  <label className="mb-2 text-neutral-400 dark:text-white" htmlFor="message-input" >Message (max. 500 characters): <span className="text-red-500">*</span></label>
                  <textarea rows={8} maxLength={500} id="message-input" placeholder="Enter your message here..." className="resize-none bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
              </div>

              {/* TODO: add email / form submut functionality */}
              <span className="w-fit">
                   <PrimaryButton onClick={() => console.log('Submitted!')} label="Submit"/>
              </span>

          </form>
      </Container>
    );
}