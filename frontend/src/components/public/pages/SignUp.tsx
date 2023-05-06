import Container from "../../Container";
import PrimaryButton from "../../PrimaryButton";
import googleLogo from "../../../assets/glogo.svg";
import {auth} from "../../../firebaseAuth";
import {useSignInWithGoogle, useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth';
import {ChangeEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {updateProfile} from "firebase/auth";

export default function SignUp() {

    const [signInWithGoogle, googleUser] = useSignInWithGoogle(auth);
    const [createUserWithEmailAndPassword, user] = useCreateUserWithEmailAndPassword(auth);

    const [signUpForm, setSignUpForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState('');

    const errorMessage = 'Error whilst signing up. Please try again';

    const navigate = useNavigate();

    useEffect(() => {
        // If we're logged in, redirect to the dashboard
        if (user) {
            navigate("/dash")
        }
    }, [user]);

    const handleSignUpFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({
            ...signUpForm,
            [event.target.name]: event.target.value,
        });
    };

    async function handleSignUpWithGoogle() {
        await signInWithGoogle();

        if (googleUser) {

            var loginJsonData = {
                "uid": googleUser.user.uid,
                "name": googleUser.user.displayName?.replaceAll(" ", ""),
                "email": googleUser.user.email,
            }

            let token = await googleUser?.user.getIdToken();
            axios.post('http://localhost:8080/user', loginJsonData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(function (response) {
                if (response.status == 200) {
                    navigate("/dash");
                }
            }).catch(function (error) {
                if (error.response.status == 422) {
                    setError('User already exists. Please login instead.');
                } else {
                    setError(errorMessage);
                }
            });
        } else {
            setError(errorMessage);
        }
    }

    async function handleDefaultSignUpSubmit(event: MouseEvent) {

        await createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);

        if (user) {

            var loginJsonData = {
                "uid": user.user.uid,
                "name": signUpForm.firstName + signUpForm.lastName,
                "email": signUpForm.email,
            }

            let token = await googleUser?.user.getIdToken();
            axios.post('http://localhost:8080/user', loginJsonData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(function (response) {
                if (response.status == 200) {
                    navigate("/dash");
                }
            }).catch(function (error) {
                if (error.code == 422) {
                    setError('User already exists. Please login instead.')
                } else {
                    setError(errorMessage);
                }
            });

            await updateProfile(user.user, {
                displayName: signUpForm.firstName + signUpForm.lastName
            });
        } else {
            setError(errorMessage);
        }
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