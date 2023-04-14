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
                    <h1 className="text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500">The idea, the team, and all things in-between</h1>
                    <div className="mt-8 flex flex-row gap-12 items-center">
                        <img className="w-1/2 object-cover h-112 rounded-xl" src={heroImg} alt="Holding a light bulb"/>
                        <div className="w-1/2 text-lg dark:text-white text-justify">
                            {/*TODO: Change this text */}
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam cursus ut libero a imperdiet.
                                Nunc libero metus, porttitor ac est ut, tempor consequat est. Proin nec mauris turpis.
                                Maecenas finibus sem sed purus efficitur, quis sagittis enim pharetra. Fusce eleifend
                                euismod iaculis. Donec tortor nulla, sagittis pellentesque hendrerit a, rutrum ac nisl.
                                Sed dictum molestie laoreet. Aliquam id tincidunt dui. Donec rutrum, magna in bibendum lacinia,
                                diam libero varius metus, nec egestas libero est vel tortor.
                            </p>
                            <br />
                            <p>
                                Aenean vitae tempor libero. Sed ac finibus elit. Duis ut pretium massa. Quisque varius lacus
                                a sapien lobortis, quis semper lorem vehicula. Cras erat purus, vulputate eu scelerisque non,
                                pulvinar ullamcorper urna. Nam lectus nibh, malesuada in tempor id, sagittis non turpis. Aenean
                                mattis dui luctus ornare blandit. Duis laoreet pharetra erat sit amet suscipit. Quisque et tortor
                                felis. Nam id eleifend ex. Donec vehicula sodales massa at imperdiet.
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
                            {/*TODO: Change this text */}
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam cursus ut libero a imperdiet.
                                Nunc libero metus, porttitor ac est ut, tempor consequat est. Proin nec mauris turpis.
                                Maecenas finibus sem sed purus efficitur, quis sagittis enim pharetra. Fusce eleifend
                                euismod iaculis. Donec tortor nulla, sagittis pellentesque hendrerit a, rutrum ac nisl.
                                Sed dictum molestie laoreet. Aliquam id tincidunt dui. Donec rutrum, magna in bibendum lacinia,
                                diam libero varius metus, nec egestas libero est vel tortor.
                            </p>
                            <br />
                            <p>
                                Aenean vitae tempor libero. Sed ac finibus elit. Duis ut pretium massa. Quisque varius lacus
                                a sapien lobortis, quis semper lorem vehicula. Cras erat purus, vulputate eu scelerisque non,
                                pulvinar ullamcorper urna. Nam lectus nibh, malesuada in tempor id, sagittis non turpis. Aenean
                                mattis dui luctus ornare blandit. Duis laoreet pharetra erat sit amet suscipit. Quisque et tortor
                                felis. Nam id eleifend ex. Donec vehicula sodales massa at imperdiet.
                            </p>
                        </div>
                        <img className="w-1/2 object-cover h-112 rounded-xl" src={bookImg} alt="Holding a light bulb"/>
                    </div>
                </section>
            </Container>
        </>
    );
}