import { useEffect, useState } from "react";
import { setCookie } from "../utils/cookies";
import { Button, Container, Input, InputGroup, Stack, Text, Flex, Box } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../constants";
import { Link, useNavigate } from "react-router-dom";


function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const formSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to authenticate the user
            const response = await axios.post(API_URL + "handle-user-connection", {
                login: username,
                password: password
            });

            // Check if authentication was successful
            if (response.status === 200 && response.data.token) {
                // Store the token in a cookie or local storage
                setCookie("token", response.data.token); // Use your preferred method to store the token

                // Redirect the user to the dashboard or another page
                // Example: history.push("/dashboard");
                // alert("You are logged in!");
                navigate("/");
            } else {
                // Handle authentication failure
                alert("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle the error accordingly
            alert("An error occurred. Please try again later.");
        }
    }

    return (
        <Box color={'white'} bg={'gray.800'}>
            <div className="LoginContainer" style={{ height: "100vh"}} >
                <Container 
                    as="form" // Use form tag
                    maxw={'xs'} 
                    border='solid 3px' 
                    padding={'10px'}
                    focusBorderColor={'teal.600'}
                    borderColor={'teal.500'}
                    borderRadius={10}
                    onSubmit={formSubmit} // Call formSubmit function on form submission
                >
                    <Stack spacing={3} justifyContent={"center"}>
                        <Text as={"div"} fontSize={"4xl"}>
                            Login To Existing Account
                        </Text>
                        <InputGroup>
                            <Input
                                spellCheck={false}
                                focusBorderColor={'teal.600'}
                                borderColor={'teal.500'}
                                type="text"
                                placeholder='Login'
                                _placeholder={{ opacity: 0.4, color: 'inherit' }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Input
                                focusBorderColor={'teal.600'}
                                borderColor={'teal.500'}
                                type="password"
                                placeholder='Password'
                                _placeholder={{ opacity: 0.4, color: 'inherit' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </InputGroup>

                        <Flex justify={"space-between"}>
                            <Link to={"/auth/Signup"}>
                                <Text id={'changeModeText'} color={"teal.500"}>
                                    Register new account
                                </Text>
                            </Link>
                            <InputGroup maxW={"fit-content"} mr={4}>
                                <Button
                                    colorScheme="teal"
                                    justifyContent={"center"}
                                    type="submit" // Submit button inside form
                                >
                                    Log In
                                </Button>
                            </InputGroup>
                        </Flex>
                    </Stack>
                </Container>
            </div>
        </Box>
    )
}

export default Login;
