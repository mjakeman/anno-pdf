import heroImg from '../../../assets/images/aboutpage/hero.jpg';
import benDp from '../../../assets/images/aboutpage/profiles/bl.jpeg';
import jiaDp from '../../../assets/images/aboutpage/profiles/jt.jpeg';
import jordanDp from '../../../assets/images/aboutpage/profiles/jy.jpeg';
import matthewDp from '../../../assets/images/aboutpage/profiles/mj.jpeg';
import matanDp from '../../../assets/images/aboutpage/profiles/my.jpeg';
import ojasDp from '../../../assets/images/aboutpage/profiles/om.jpeg';
import bookImg from '../../../assets/images/aboutpage/books.jpg';
import Container from "../../Container";
import AboutPageProfile from "./AboutPageProfile";

export default function About() {
    return (
        <>
            <Container>
                <section className="mt-12">
                    <p className="text-neutral-400 dark:text-white">About Us</p>
                    <h1 className="mt-2 text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500">The idea, the team, and all things in-between</h1>
                    <div className="mt-8 flex flex-row gap-12 items-center">
                        <img className="w-1/2 object-cover h-112 rounded-xl" src={heroImg} alt="Holding a light bulb"/>
                        <div className="w-1/2 text-lg dark:text-white text-justify">
                            {/*TODO: Change this text */}
                            <p>
                                Our journey began with a simple problem: quickly annotating lecture notes and slides at university was a huge headache.
                                It would either cost money, take too long, or miss features like collaborative editing. And after scouring the internet for
                                a tool that would be <b>reliable and free</b>, we discovered a hard-to-swallow truth - there was no such thing. So, the next move was clear -
                                we were going to build one.
                            </p>
                            <br />
                            <p>
                                As Software Engineering students in our final year - driven by a passion for high quality software
                                and design, the 6 of us put our heads together to develop the first iteration of Anno; which is what
                                you see here today. As we continue to iterate, design and develop, our goal is clear: to empower
                                individuals, teams, and organisations to easily collaborate on PDF documents.
                            </p>
                        </div>
                    </div>
                </section>
            </Container>
            <section className="bg-anno-space-900 dark:bg-anno-space-700 py-12 my-12">
                <Container>
                    <h1 className="text-right text-white text-4xl font-bold">Meet the team</h1>
                    <div className="mt-8 grid grid-cols-6 gap-8">
                        <AboutPageProfile name="Matthew Jakeman" imgPath={matthewDp} role="Technical Lead"/>
                        <AboutPageProfile name="Ben Lowthian" imgPath={benDp} role="Back-end Engineer"/>
                        <AboutPageProfile name="Ojas Madaan" imgPath={ojasDp} role="Back-end Lead"/>
                        <AboutPageProfile name="Jia Tee" imgPath={jiaDp} role="Front-end Engineer"/>
                        <AboutPageProfile name="Jordan York" imgPath={jordanDp} role="Front-end Engineer"/>
                        <AboutPageProfile name="Matan Yosef" imgPath={matanDp} role="Front-end Lead"/>
                    </div>
                </Container>
            </section>
            <Container>
                <section className="my-12">
                    <div className="mt-8 flex flex-row gap-12 items-center">
                        <div className="w-1/2 text-lg dark:text-white text-justify">
                            <p>
                                At the heart of Anno, lies a team of 6 engineers - and each of us are working to bring a unique
                                set of skills and expertise as we build this tool for the world to use. Broken up into backend
                                and frontend, our focus is to build a product which not only works well - but is enjoyable
                                to use.
                            </p>
                            <br />
                            <p>
                                So come along with us as we embark on this journey of revolutionised PDF editing. We hope that
                                as you use it you realise it's not just a PDF editor; it's a testament to our unwavering determination to tackle
                                real-world challenges, and continuous strive to create software which makes annotating
                                PDFs fast, easy and above all else - collaborative.
                            </p>
                        </div>
                        <img className="w-1/2 object-cover h-112 rounded-xl" src={bookImg} alt="Holding a light bulb"/>
                    </div>
                </section>
            </Container>
        </>
    );
}