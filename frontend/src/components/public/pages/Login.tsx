import Container from "../../Container";
import PrimaryButton from "../../PrimaryButton";
import googleLogo from "../../../assets/glogo.svg";
import {useSignInWithEmailAndPassword, useSignInWithGoogle} from "react-firebase-hooks/auth";
import {auth} from "../../../firebaseAuth";
import {useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {signOut} from "firebase/auth";
import {AuthContext} from "../../../contexts/AuthContextProvider";

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const [signInWithGoogle, _googleUser, _googleLoading, _googleError] = useSignInWithGoogle(auth)
    const [signInWithEmailAndPassword, _user, _loading, _emailError] = useSignInWithEmailAndPassword(auth)

    const navigate = useNavigate();

    const location = useLocation();
    const {currentUser, setCurrentUser} = useContext(AuthContext);

    useEffect(() => {
        if (currentUser) {
            console.log(location)
            if(location.state){
                navigate(location.state.redirect ? location.state.redirect : "/dash");
            }else{
                navigate("/dash");
            }
        }
    }, []);

    async function validateWithBackend(token: string, displayName: string|null = null) {
        console.log("Performing common sign up method");

        let bodyParams = null;
        if (displayName) {
            // Only occurs for Google Sign in, otherwise should be null
            bodyParams = {
                "name": displayName
            }
        }
        axios.post(import.meta.env.VITE_BACKEND_URL + '/user', bodyParams, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(function (response) {
            if (response.status == 200 || response.status == 201) {
                setCurrentUser(
                    {
                        uid: response.data.uid,
                        name: response.data.name,
                        email: response.data.email,
                    },
                    auth.currentUser!,
                );
                //navigate(location.state.redirect ? location.state.redirect:"/dash");
            }
        }).catch(async function (error) {
            setError(`Error: ${error.name} (${error.code})`);
            await signOut(auth);
        });
    }

    async function handleSignInWithGoogle() {
        signInWithGoogle()
            .then(async (emailUser) => {
                const user = emailUser?.user!;
                const token = await user?.getIdToken();
                await validateWithBackend(token, user.displayName!);
            }).catch(error => {
                console.log(error)
            setError(`Error signing in: ${error.message}`);
        });
    }

    async function handleSignInWithEmailAndPassword() {
        signInWithEmailAndPassword(email, password).then(
            async (emailUser) => {
                const user = emailUser?.user!;
                const token = await user.getIdToken();
                await validateWithBackend(token);
            }
        ).catch(error => {
            setError(`Error signing in: ${error.message}`);
        });
    }

    return (
        <Container>
            <div className="flex flex-col items-center my-12">
                <h1 className="text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500 text-center">Log in</h1>
                <form
                    className="my-8 px-24 py-12 flex flex-col gap-6 bg-white dark:bg-anno-space-900 drop-shadow-around border-2 dark:border-anno-space-100 rounded-xl">
                    <div className="w-96">
                        <label className="mb-2 text-neutral-400 dark:text-white" htmlFor="email-input">Email:</label>
                        <input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email-input"
                               placeholder="Enter your email address here..."
                               className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white invalid:text-pink-500 focus:invalid:text-pink-500 invalid:border-pink-600 invalid:ring-pink-500 focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
                    </div>
                    <div className="w-96">
                        <label className="mb-2 text-neutral-400 dark:text-white"
                               htmlFor="password-input">Password:</label>
                        <input onChange={e => setPassword(e.target.value)} value={password} type="password"
                               id="password-input" placeholder="Enter your password here..."
                               className="bg-white dark:bg-anno-space-700 px-2 py-1 border-2 border-zinc-300 rounded-lg placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-blue-500 w-full rounded-md focus:ring-1 dark:focus:invalid:bg-pink-200 dark:text-white invalid:text-pink-500 focus:invalid:text-pink-500 invalid:border-pink-600 invalid:ring-pink-500 focus:invalid:border-pink-600 focus:invalid:ring-pink-500"/>
                    </div>

                    <PrimaryButton onClick={handleSignInWithEmailAndPassword} label="Log in"/>

                    {error !== '' && <div
                        className="bg-anno-red-secondary bg-opacity-70 py-3 px-4 text-white flex flex-row items-center justify-center gap-1 text-sm">
                        {error}
                    </div>}

                    <div className="flex flex-row gap-6 items-center text-zinc-500 dark:text-white">
                        <hr className="w-full"/>
                        <span>or</span>
                        <hr className="w-full"/>
                    </div>

                    <button type="button" onClick={handleSignInWithGoogle}
                            className="flex flex-row items-center justify-center gap-4 bg-white border-2 p-2 rounded transition-colors hover:bg-zinc-200">
                        <img className="w-6 h-6" src={googleLogo} alt="Google logo"/>
                        <span className="text-lg font-light">Continue with Google</span>
                    </button>

                    <a href="#"
                       className="text-zinc-400 underline text-center transition-colors hover:text-anno-pink-500 dark:hover:text-anno-pink-500 dark:text-white ">Forgot
                        password?</a>

                </form>
            </div>
        </Container>
    );
}