import Container from "../../Container";
import PrimaryButton from "../../PrimaryButton";
import googleLogo from "../../../assets/glogo.svg";
import {useSignInWithEmailAndPassword, useSignInWithGoogle} from "react-firebase-hooks/auth";
import {auth} from "../../../firebaseAuth";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const [signInWithGoogle, googleUser] = useSignInWithGoogle(auth)
    const [signInWithEmailAndPassword, user] = useSignInWithEmailAndPassword(auth)

    const navigate = useNavigate();

    async function handleSignInWithGoogle() {
        try {
            await signInWithGoogle();

            if (googleUser) {
                var loginJsonData = {
                    "uid" : googleUser.user.uid,
                    "name" : googleUser.user.displayName?.replaceAll(" ", ""),
                    "email" : googleUser.user.email,
                }

                await fetch('/auth', {
                    method: 'POST',
                    body: JSON.stringify(loginJsonData)
                })
                    .then(response => console.log(response.text()))
                    .catch(error => console.error(error))
                navigate("/project-group-fearless-foxes/dash");
            }
        } catch (error) {
            const { code } = error as FirebaseError;
            if (code === 'auth/invalid-credential') {
                setError('Invalid credentials. Please try again.');
            } else if (parseInt(code) === 400) {
                setError('Bad request. Please try again later.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    }

    async function handleSignInWithEmailandPassword() {
        try {
            await signInWithEmailAndPassword(email, password);

            if (user) {
                var loginJsonData = {
                    "uid" : user.user.uid,
                    "name" : user.user.displayName?.replaceAll(" ", ""),
                    "email" : user.user.email,
                }

                await fetch('/auth', {
                    method: 'POST',
                    body: JSON.stringify(loginJsonData)
                })
                    .then(response => console.log(response.text()))
                    .catch(error => console.error(error))
                navigate("project-group-fearless-foxes/dash");
            }

        } catch (error) {
            const { code } = error as FirebaseError;
            if (code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (code === 'auth/wrong-password') {
                setError('Invalid password');
            } else if (code === 'auth/user-not-found') {
                setError('User not found');
            } else if (code.startsWith('auth/')) {
                setError('Authentication error');
            } else {
                setError('Unknown error');
            }
        }
    }

    return (
        <Container>
            <div className="flex flex-col items-center my-12">
                <h1 className="text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500 text-center">Log in</h1>
                <form className="my-8 px-24 py-12 flex flex-col gap-6 bg-white dark:bg-anno-space-900 drop-shadow-around border-2 dark:border-anno-space-100 rounded-xl">
                    <div className="w-96">
                        <label className="mb-2 text-neutral-400 dark:text-white" htmlFor="email-input" >Email:</label>
                        <input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email-input" placeholder="Enter your email address here..." className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white invalid:text-pink-500 focus:invalid:text-pink-500 invalid:border-pink-600 invalid:ring-pink-500 focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
                    </div>
                    <div className="w-96">
                        <label className="mb-2 text-neutral-400 dark:text-white" htmlFor="password-input" >Password:</label>
                        <input onChange={e => setPassword(e.target.value)} value={password} type="password" id="password-input" placeholder="Enter your password here..." className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white invalid:text-pink-500 focus:invalid:text-pink-500 invalid:border-pink-600 invalid:ring-pink-500 focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
                    </div>

                   <PrimaryButton onClick={handleSignInWithEmailandPassword} label="Log in"/>

                    {error && <div className="bg-anno-red-secondary bg-opacity-70 py-3 px-4 text-white flex flex-row items-center justify-center rounded-lg gap-1 text-sm transition-colors">
                        {error}
                    </div>}

                    <div className="flex flex-row gap-6 items-center text-zinc-500 dark:text-white">
                        <hr className="w-full" />
                        <span>or</span>
                        <hr className="w-full" />
                    </div>

                    {/* Continue with Google Button - TODO: add functionality or replace with package */}
                    <button type="button" onClick={handleSignInWithGoogle} className="flex flex-row items-center justify-center gap-4 bg-white border-2 p-2 rounded transition-colors hover:bg-zinc-200">
                        <img className="w-6 h-6" src={googleLogo} alt="Google logo" />
                        <span className="text-lg font-light">Continue with Google</span>
                    </button>

                    <a href="#" className="text-zinc-400 underline text-center transition-colors hover:text-anno-pink-500 dark:hover:text-anno-pink-500 dark:text-white ">Forgot password?</a>

                </form>
            </div>
        </Container>
    );
}