import {useEffect, useState} from "react";
import {getCookie, setCookie} from "../utils/cookies";
import {Button, Container, Input, InputGroup, Stack, Text, Flex,Spacer} from "@chakra-ui/react";
import axios from "axios";
import {API_URL} from "../constants";
import { Link } from "react-router-dom";

function Signup() {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        // W przypadku, gdy mamy cookie z username (czyli wcześniej użytkownik był zalogowany)
        // Zmieniamy pole login z pustego na ten i wyświetlamy formularz logowanie
        // funkcja działa tylko raz na początku
        const cookieUsername = getCookie("username");
        if (cookieUsername) {
            setUsername(cookieUsername);            
        }
    }, []);

    const formSubmit = async (e) => {
        e.preventDefault();
        setUsername(username.trim());
        setPassword(password.trim());
        
        const params = {
            login: username,
            password1: password,
            password2: password,
        }

        let userExists = await axios.post(API_URL + "create-user",params);
        console.log(userExists);
        if(userExists) {
            alert("Jesteś zalogowany");
        }
        else{
            alert("Nie jesteś zalogowany, Spróbuj ponownie");
        }
                
    }

    return (

        <div className="LoginContainer" style={{height:"100vh"}}>
            <Container maxw={'xs'}>
                <Stack spacing={3} justifyContent={"center"}>
                    <Text as={"div"} fontSize={"2xl"}>
                        Create New Account
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
                                        
                    <Flex justify={"space-between"}>
                        <Link to={"/auth/Login"}>
                            <Text id={'changeModeText'} color={"teal"}>
                                Already have an account?                                         
                            </Text>
                        </Link>
                        <InputGroup maxW={"fit-content"} mr={4}>
                            <Button
                                colorScheme={"teal"}
                                justifyContent={"center"}
                                onClick={formSubmit}
                            >
                                Sign Up
                            </Button>
                        </InputGroup>
                    </Flex>
                </Stack>
            </Container>
        </div>

    )
}

export default Signup;