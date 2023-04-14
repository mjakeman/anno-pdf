import heroImg from '../../../assets/images/homepage/hero.jpg';
import collabImg from '../../../assets/images/homepage/collab.jpg';
import annotationImg from '../../../assets/images/homepage/annotations.jpg';
import Container from "../../Container";
import PrimaryButton from "../../PrimaryButton";
import {useNavigate} from "react-router-dom";
import {PencilSquareIcon, UsersIcon} from "@heroicons/react/24/outline";
import Logo from "../../Logo";

export default function Home() {

    let navigate = useNavigate();

    return (
        <>
            <Container>
                <section className="py-4 flex flex-col sm:flex-row items-center justify-between gap-24">
                    <div className="flex flex-col gap-6">
                        <span className=" text-5xl font-bold text-anno-red-primary dark:text-anno-pink-500">
                            <h1>Annotating PDFs?</h1>
                            <h1>Anno's got you.</h1>
                        </span>
                        <span className="text-lg text-neutral-400 dark:text-white">
                            <p>Creating high quality document notes can be tough.</p>
                            <p>But it doesn’t have to be.</p>
                       </span>
                        <span>
                            <PrimaryButton onClick={() => navigate("/project-group-fearless-foxes/signup")} label="Get started"/>
                        </span>
                    </div>
                    <img className="w-full sm:w-1/2 h-64 sm:h-112 object-cover rounded-xl" src={heroImg} alt="Laptop and coffee"/>
                </section>
            </Container>
            <section className="max-w-[104rem] mx-auto relative">
                <div className="absolute h-80 w-80 bg-anno-pink-100 dark:bg-white z-10"></div>
                <div className="relative z-20 py-12">
                    <Container>
                        <div className="flex flex-row items-center justify-between gap-32">
                            <div className="relative rounded-md basis-3/4">
                                <img className="relative z-40 w-full h-[32rem] rounded-xl object-cover" src={collabImg} alt="People pointing to screen"/>
                                <div className="absolute z-30 right-0 bottom-0 -mb-12 -mr-12 h-48 w-48 bg-anno-pink-200 dark:bg-anno-pink-700"></div>
                            </div>
                            <div className="flex flex-col gap-6 basis-1/4">
                                <div className="w-fit rounded-xl p-2 bg-anno-red-primary dark:bg-anno-red-secondary">
                                    <UsersIcon className="text-white h-8 w-8"/>
                                </div>
                                <span className="text-5xl font-bold text-anno-red-primary dark:text-anno-pink-500">
                                    <h1>Make notes collaboratively.</h1>
                                </span>
                                <span className="text-lg text-neutral-400 dark:text-white">
                                    <p>Invite your friends to a document - no more having to wait for your friend to send you a copy.</p>
                               </span>
                            </div>
                        </div>
                    </Container>
                </div>
            </section>
            <section className="max-w-[104rem] mx-auto relative my-24 ">
                <Container>
                    <div className="flex flex-row items-center justify-between gap-32">
                        <div className="flex flex-col gap-6 basis-1/3">
                            <div className="w-fit rounded-xl p-2 bg-anno-red-primary dark:bg-anno-red-secondary">
                                <PencilSquareIcon className="text-white h-8 w-8"/>
                            </div>
                            <span className="text-5xl font-bold text-anno-red-primary dark:text-anno-pink-500">
                                    <h1>All sorts of annotations.</h1>
                                </span>
                            <span className="text-lg text-neutral-400 dark:text-white">
                                    <p>Anno features many different types of annotations - including, for the first time ever, ✨<b>Math annotations</b>✨.</p>
                               </span>
                        </div>
                        <div className="relative rounded-md basis-3/4">
                            <img className="relative z-40 w-full h-[32rem] rounded-xl object-cover" src={annotationImg} alt="Laptop and coffee"/>
                            <div className="absolute z-30 left-0 top-0 -mt-12 -ml-12 h-48 w-48 bg-anno-space-100"></div>
                            <div className="absolute z-30 left-0 bottom-0 -mb-12 -ml-12 h-64 w-64 bg-anno-pink-100 dark:bg-white"></div>
                            <div className="absolute z-30 right-0 bottom-0 -mb-12 mr-36 h-48 w-48 bg-anno-pink-300"></div>
                        </div>
                    </div>
                </Container>
            </section>
            <Container>
                <div className="border-t-2 border-anno-pink-500 w-full my-12 pt-12 flex flex-col gap-8 items-center">
                    <Logo className="w-16 h-16"/>
                    <span className="flex flex-col items-center gap-4">
                        <h1 className="text-5xl font-bold text-anno-red-primary dark:text-anno-pink-500">Time to Anno</h1>
                        <p className="text-xl text-neutral-400 dark:text-white ">It's completely free.</p>
                    </span>
                    <PrimaryButton onClick={() => navigate("/project-group-fearless-foxes/signup")} label="Get started"/>

                </div>
            </Container>
        </>

    );
}