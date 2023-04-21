import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import LoginForm from '@/components/Login&SignUp/loginForm';
import HomeMain from '@/components/Home';
import LoginWSteam from '@/components/Login&SignUp/loginWSteam';
import Image from 'next/image';
import Auth from '@/components/Login&SignUp/AuthButton';
import { useRouter } from 'next/router';

export default function Home(){
    const [token, setToken] = useState(null);
    const [signUp, setSignUp] = useState(false);

    // check if user is logged 
    // TODO: should modify after session established
    if(typeof window !== 'undefined'&&localStorage.getItem('token')){
        setToken(localStorage.getItem('token'))
    }
    const handleLogin = (token) => {
        console.log(`Logged in with token ${token}`);
        setToken(token);
        if (typeof window !== 'undefined')
        {localStorage.setItem("token",token);}
      };

     const Post =async()=>{
        const router = useRouter()
        if(Object.keys(router.query).length!==0&&token===null)
        {
            console.log(router.query,'=======')
            const JSONdata = JSON.stringify(router.query)
        
            // API endpoint where we send form data.
            const endpoint = '/processSteamLogin'
        
            // Form the request for sending data to the server.
            const options = {
                // The method is POST because we are sending data.
                method: 'POST',
                // Tell the server we're sending JSON.
                headers: {
                'Content-Type': 'application/json',
                },
                // Body of the request is the JSON data we created above.
                body: JSONdata,
            }
        
            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint, options)
            
            const data = await response.json();
            handleLogin(data.token)
        }
        else{
            console.log("NULL")
        }
    }
    Post()
    return(
        <div>
            <Head>
                <title>Login to GamesGram</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main >
                {!token ? <LoginForm onLogin={handleLogin} />: <HomeMain/>}
                <HomeMain />
                <LoginWSteam />
            </main>
        </div>
    )

}
//<LoginWSteam />