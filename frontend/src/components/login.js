import {useEffect, useState} from "react";
import {getCookie, setCookie} from "../utils/cookies";
import {Button, Container, Input, InputGroup, Stack, Text} from "@chakra-ui/react";
import axios from "axios";
import {API_URL} from "../constants";

function LoginPage() {

    const [isLogging, setLogging] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        // W przypadku, gdy mamy cookie z username (czyli wcześniej użytkownik był zalogowany)
        // Zmieniamy pole login z pustego na ten i wyświetlamy formularz logowanie
        // funkcja działa tylko raz na początku
        const cookieUsername = getCookie("username");
        if (cookieUsername) {
            setUsername(cookieUsername);
            setLogging(true)
        }
    }, []);

    const formSubmit = async (e) => {
        e.preventDefault();
        setUsername(username.trim());
        setPassword(username.trim());
        if(isLogging){
            // check if user exists with handle-user-connection from backend
            // if true write cookie, open notes, reset form
            // else Go back to Login form and write password again

            const params = {
                login: username,
                password: password
            }

            let userExists = await axios.post(API_URL + "handle-user-connection",params);
            if(userExists) {
                alert("Jesteś zalogowany");
            }
            else{
                alert("Nie jesteś zalogowany, Spróbuj ponownie");
            }

            return;
        }

        // check if user exists with handle-user-connection from backend
        // if true create popup
        //                  #1 option: Login to that account (change to Login form)
        //                  #2 option: Create absolutely new account (back to Register form)
        // if false use create-user from backend, write cookie, open notes, reset form

        // const addUser = () => {
        //     if (newUser.username.trim() !== '' && newUser.password.trim() !== '') {
        //         axios.post(API_URL + "create-user", newUser);
        //         setUsers([...users, newUser]);
        //         setNewUser({username: "", password: ""});
        //     }
        // };
    }

    return (

        <div className="LoginContainer">
            <Container maxw={'xs'}>
                <Stack spacing={3} justifyContent={"center"}>
                    <Text as={"div"} fontSize={"2xl"}>
                        {!!isLogging ? <div>Login To Existing Account</div> : <div>Create New Account</div>}
                    </Text>
                    <InputGroup>
                        <Input
                            type="text"
                            placeholder='Login'
                            _placeholder={{opacity: 0.4, color: 'inherit'}}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </InputGroup>
                    <InputGroup>
                        <Input
                            type="password"
                            placeholder='Password'
                            _placeholder={{opacity: 0.4, color: 'inherit'}}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </InputGroup>

                    {/*// Link zmienia z logowania na rejestracje lub na odwrót */}
                    <Text id={'changeModeText'} color={"teal"} onClick={() => setLogging(prev => !prev)}>
                        {isLogging ?
                            "Register new account"
                            :
                            "Already have an account"
                        }
                    </Text>
                    <InputGroup>
                        <Button
                            colorScheme={"teal"}
                            justifyContent={"center"}
                            onClick={(e) => formSubmit(e)}
                        >
                            {isLogging ? "Log In" : "Register"}
                        </Button>

                    </InputGroup>

                </Stack>
            </Container>
        </div>

    )
}

export default LoginPage;