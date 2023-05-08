import Container from "../../Container";
import PrimaryButton from "../../PrimaryButton";
import googleLogo from "../../../assets/glogo.svg";
import {auth} from "../../../firebaseAuth";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useSignInWithGoogle, useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";
import {signOut} from "firebase/auth";
import {AuthContext} from "../../../contexts/AuthContextProvider";

export default function SignUp() {

    const [signUpForm, setSignUpForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState('');

    const [signInWithGoogle, googleUser] = useSignInWithGoogle(auth);
    const [createUserWithEmailAndPassword, user] = useCreateUserWithEmailAndPassword(auth);

    const {currentUser, setCurrentUser} = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (currentUser) {
            navigate(location.state?.redirect ? location.state.redirect : "/dash");
        }
    }, []);

    const handleSignUpFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({
            ...signUpForm,
            [event.target.name]: event.target.value,
        });
    };

    async function createBackendRecord(token: string, displayName: string) {
        console.log("Performing common sign up method");

        const bodyParams = {
            "name": displayName
        };

        axios.post(import.meta.env.VITE_BACKEND_URL + '/user', bodyParams, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(function (response) {
            if (response.status == 200 || response.status == 201) {
                setCurrentUser({
                    uid: response.data.uid,
                    name: response.data.name,
                    email: response.data.email,
                    firebaseUserRef: auth.currentUser!
                });
                navigate(location.state.redirect ? location.state.redirect:"/dash");
            }
        }).catch(async function (error) {
            setError(`Error: ${error.name} (${error.code})`);
            await signOut(auth);
        });
    }

    async function handleSignUpWithGoogle() {
        signInWithGoogle()
        .then(async (emailUser) => {
            const user = emailUser?.user!;
            const token = await user.getIdToken();
            await createBackendRecord(token, user.displayName!);
        }).catch(error => {
            setError(`Error signing up: ${error.message}`);
        });
    }

    async function handleDefaultSignUpSubmit() {
        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password).then(
            async (emailUser) => {
                const user = emailUser?.user!;
                const token = await user.getIdToken();
                await createBackendRecord(token, `${signUpForm.firstName} ${signUpForm.lastName}`);
            }
        ).catch(error => {
            setError(`Error signing up: ${error.message}`);
        });
    }

    return (
        <Container>
            <div className="flex flex-col items-center my-12">
                <h1 className="text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500 text-center">Sign
                    up</h1>
                <form
                    className="my-8 px-24 py-12 flex flex-col gap-6 bg-white dark:bg-anno-space-900 drop-shadow-around border-2 dark:border-anno-space-100 rounded-xl">
                    <div className="w-96 flex flex-row gap-4">
                        <span>
                            <label className="mb-2 text-neutral-400 dark:text-white"
                                   htmlFor="fname-input">First Name:</label>
                            <input onChange={handleSignUpFormChange} value={signUpForm.firstName} type="text"
                                   id="fname-input" name="firstName" placeholder="Enter your first name here..."
                                   className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
                        </span>
                        <span>
                            <label className="mb-2 text-neutral-400 dark:text-white"
                                   htmlFor="jname-input">Last Name:</label>
                            <input onChange={handleSignUpFormChange} value={signUpForm.lastName} type="text"
                                   id="lname-input" name="lastName" placeholder="Enter your last name here..."
                                   className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
                        </span>
                    </div>
                    <div className="w-96">
                        <label className="mb-2 text-neutral-400 dark:text-white" htmlFor="email-input">Email:</label>
                        <input onChange={handleSignUpFormChange} value={signUpForm.email} type="email" id="email-input"
                               name="email" placeholder="Enter your email address here..."
                               className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white invalid:text-pink-500 focus:invalid:text-pink-500 invalid:border-pink-600 invalid:ring-pink-500 focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
                    </div>
                    <div className="w-96">
                        <label className="mb-2 text-neutral-400 dark:text-white"
                               htmlFor="password-input">Password:</label>
                        <input onChange={handleSignUpFormChange} value={signUpForm.password} type="password"
                               id="password-input" name="password" placeholder="Enter your password here..."
                               className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white invalid:text-pink-500 focus:invalid:text-pink-500 invalid:border-pink-600 invalid:ring-pink-500 focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
                    </div>

                    <PrimaryButton onClick={handleDefaultSignUpSubmit} label="Sign up"/>

                    {error && <div
                        className="bg-anno-red-secondary bg-opacity-70 py-3 px-4 text-white flex flex-row items-center justify-center gap-1 text-sm">
                        {error}
                    </div>}

                    <div className="flex flex-row gap-6 items-center text-zinc-500 dark:text-white">
                        <hr className="w-full"/>
                        <span>or</span>
                        <hr className="w-full"/>
                    </div>

                    <button onClick={() => handleSignUpWithGoogle()} type="button"
                            className="flex flex-row items-center justify-center gap-4 bg-white border-2 p-2 rounded transition-colors hover:bg-zinc-200">
                        <img className="w-6 h-6" src={googleLogo} alt="Google logo"/>
                        <span className="text-lg font-light">Continue with Google</span>
                    </button>

                </form>
            </div>
        </Container>
    );
}