import "../App.css";
import React, { useEffect, useState, useRef } from "react";
import { Badge, Portal, useDisclosure } from "@chakra-ui/react";
import { Fade, ScaleFade, Slide, SlideFade, Collapse } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../constants";
import Note from "../components/Note";
import { IconButton } from "@chakra-ui/react";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  Center,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  Button,
  Divider,
  Textarea,
  background,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { DeleteIcon, CheckIcon, WarningIcon } from "@chakra-ui/icons";
import { setCookie } from "../utils/cookies";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNoteDesc, setNewNote] = useState("");
  const textareaRef = useRef();
  const token = Cookies.get("token");
  const { isOpen, onToggle } = useDisclosure();
  const [userInfo, setUserInfo] = useState(null);
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const [selectedNote, setSelectedNote] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState("");


  const handleLogout = () => {
    // Remove the token cookie
    Cookies.remove('token');

    // Redirect the user to the login page
    // history.push('/auth/login');
    window.location.href = "/auth/login";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Get the options for formatting the date
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get the user's time zone
    };
  
    // Format the date according to the options
    const formattedDate = date.toLocaleString("en-US", options);
    
    return formattedDate;
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/auth/login";
    }
    fetchUserInfo().then((userInfo) => {
      // Update the state with the fetched user info
      setUserInfo(userInfo);
    });
    // console.log("fetchUserInfo:", fetchUserInfo().then(userInfo => {console.log(userInfo.username);})); // display username of current user
    fetchNotes().then((notes) => setNotes(notes));

    const storedBackgroundUrl = Cookies.get("backgroundUrl");
    if (storedBackgroundUrl) {
      setBackgroundUrl(storedBackgroundUrl);
    }
  }, []);

  const handleBackgroundUrlChange = (e) => {
    const newBackgroundUrl = e.target.value;
    setBackgroundUrl(newBackgroundUrl);
    // Save the background URL to a cookie when it changes
    Cookies.set("backgroundUrl", newBackgroundUrl);
  };
  

  const fetchNotes = async () => {
    try {
      // Send a POST request to fetch notes with the token
      const response = await axios.post(
        API_URL + "notes",
        {}, // Empty data object
        {
          headers: {
            Authorization: `Token ${token}`, // Set Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Update notes state with the received data
        return response.data;
      } else {
        console.error("Failed to fetch notes:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error accordingly
      return [];
    }
  };

  const addNote = async () => {
    // Coś takiego ma być
    const response = await axios.post(API_URL + "create-note", newNoteDesc, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (response.status === 201) {
      // dodajemy Note do listy wszystkich Note-ów
      const updatedNotes = await fetchNotes(token);
      setNotes(updatedNotes);
      //   textareaRef.current.value = "";

      //setNotes(prev => [...prev,newNoteDesc])

      // fetchNotes(token).then(notes => setNotes(notes))
    }
  };

  const updateNote = async (note) => {
    note.note_id = note.pk; // Assuming note.pk contains the note_id
    try {
      const response = await axios.post(
        `${API_URL}edit-note`,
        { note_id: note.note_id, note_text: note.note_text },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Update notes state with the updated note
        const updatedNotes = await fetchNotes(token);
        setNotes(updatedNotes);
      } else {
        console.error("Failed to update note:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error accordingly
    }
  };

  const deleteNote = async (note) => {
    note.note_id = note.pk; // Assuming note.pk contains the note_id
    try {
      const response = await axios.post(
        `${API_URL}delete-note`,
        { note_id: note.note_id },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Update notes state with the updated note
        const updatedNotes = await fetchNotes(token);
        setSelectedNote(null);
        setNotes(updatedNotes);
        if (textareaRef.current) {
          textareaRef.current.blur();
        }
      } else {
        console.error("Failed to delete note:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error accordingly
    }
  };

  const fetchCollab = async (note) => {
    try {
      // Send a POST request to fetch notes with the token
      const response = await axios.post(
        API_URL + "users",
        {}, // Empty data object
        {
          headers: {
            Authorization: `Token ${token}`, // Set Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Update notes state with the received data
        return response.data;
      } else {
        console.error("Failed to fetch users:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error accordingly
      return [];
    }
  };

  const fetchUserInfo = async () => {
    try {
      // Send a GET request to fetch notes with the token
      const response = await axios.post(API_URL + "user-info", "", {
        headers: {
          Authorization: `Token ${token}`, // Set Authorization header
        },
      });

      if (response.status === 200) {
        // Update notes state with the received data
        return response.data;
      } else {
        console.error("Failed to fetch users:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error accordingly
      return [];
    }
  };

  const addCollab = async (note, collab_id) => {
    note.note_id = note.pk; // Assuming note.pk contains the note_id
    console.log(note.note_id);
    try {
      const response = await axios.post(
        `${API_URL}add-collab`,
        { note_id: note.note_id, collaborant_id: collab_id },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Update notes state with the updated note
        const updatedNotes = await fetchNotes(token);
        setSelectedNote(null);
        setNotes(updatedNotes);
        if (textareaRef.current) {
          textareaRef.current.blur();
        }
      } else {
        console.error("Failed to delete collaborator:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error accordingly
    }
  };

  const deleteCollab = async (note, collab_id) => {
    note.note_id = note.pk; // Assuming note.pk contains the note_id
    try {
      const response = await axios.post(
        `${API_URL}delete-collab`,
        { note_id: note.note_id, collaborant_id: collab_id },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Update notes state with the updated note
        const updatedNotes = await fetchNotes(token);
        setSelectedNote(null);
        setNotes(updatedNotes);
        if (textareaRef.current) {
          textareaRef.current.blur();
        }
      } else {
        console.error("Failed to delete collaborator:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error accordingly
    }
  };

  // function changeNoteTitle(e){
  //     setNewNote((prev)=> {note_text:prev.note_text,title: e.target.value})
  // }

  return (
    <Flex
      bg={'gray.800'}
      bgImg={backgroundUrl ? `url('${backgroundUrl}')` : undefined}
      bgRepeat={"no-repeat"}
      bgSize={"cover"}
      h="100vh"
    >
      <Box
        w="25%"
        p={1}
        overflowY="auto"
        minW={"150px"}
        backdropFilter="auto"
        backdropBlur={"10px"}
        className="rightBox"
      >
        {" "}
        <Textarea
          maxH={"20%"}
          color={"white"}
          spellCheck={false}
          focusBorderColor={"teal.600"}
          borderColor={"teal.500"}
          placeholder="Add note..."
          mb={2}
          onChange={(e) =>
            setNewNote({ ...newNoteDesc, note_text: e.target.value })
          }
        />
        <Button onClick={addNote} colorScheme="teal" mb={4} mt={0}>
          Add Note
        </Button>
        <Divider />
        <VStack w={"100%"}>
          {notes.map((note, index) => (
            <Box
              w={"100%"}
              key={index}
              onClick={() => {
                setSelectedNote(note);
                onToggle(); // Call onToggle after setting the selected note
              }}
              cursor="pointer"
            >
              <Note
                // noteHeader={note.title}
                noteDescription={
                  note.note_text.length > 50
                    ? note.note_text.substring(0, 50).split("\n")[0] + "..."
                    : note.note_text.split("\n")[0]
                }
                note={note}
                noteDate={note.pub_date}
                noteCollab={note.collaborators}
                noteProtect={note.protected}
                fetchCollab={fetchCollab}
                addCollab={addCollab}
                deleteCollab={deleteCollab}
                userInfo={userInfo}
              />
            </Box>
          ))}
        </VStack>
        <Card
          // h={"8%"}
          position={"sticky"}
          bottom={0}
          left={0}
          right={0}
          bg="rgba(26, 32, 44, 0.5)"
          color="white"
          textAlign="center"
          backdropFilter="auto"
          backdropBlur={"10px"}
          rounded={"10px"}
          // onClick={onOpen2}
        >
          <Popover placement="top-start">
            <PopoverTrigger >
              <Button bg="rgba(26, 32, 44, 0.5)" color={'white'}>{userInfo?.username}</Button>
            </PopoverTrigger>
            <Portal>
            <PopoverContent max-width={'fit-content'} bg={'gray.800'} color="white">
              <PopoverHeader fontWeight="semibold">
              {userInfo?.username}
              </PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody >
                <Button onClick={onOpen2} w={'100%'} bg={'gray.800'} color="white">
                  <SettingsIcon marginRight={"2"} />
                  Settings (concept)
                </Button>
                <Button onClick={handleLogout} w={'100%'} bg={'gray.800'} color="white">
                  <WarningIcon marginRight={"2"}/>
                  Logout
                </Button>
              </PopoverBody>
            </PopoverContent>
            </Portal>
          </Popover>

          <Modal isOpen={isOpen2} onClose={onClose2} isCentered>
            <ModalOverlay />
            <ModalContent backdropFilter="auto" backdropBlur={"10px"} bg={"rgba(100, 100, 100, 0.5)"} color={'white'}>
              <ModalHeader>Settings</ModalHeader>
              <ModalCloseButton />
              <ModalBody >
                <Tabs isFitted variant="enclosed">
                  <TabList mb="1em">
                    <Tab>User</Tab>
                    <Tab>Page Settings</Tab>
                  </TabList>
                  <TabPanels >
                    <TabPanel>
                      <Stack
                        spacing={4}
                        w={"full"}
                        // maxW={"md"}
                        // bg={useColorModeValue("white", "gray.700")}
                        rounded={"xl"}
                        // boxShadow={"lg"}
                        p={6}
                        // my={12}
                      >
                        <Heading
                          lineHeight={1.1}
                          fontSize={{ base: "2xl", sm: "3xl" }}
                        >
                          User Profile Edit
                        </Heading>
                        {/* <FormControl id="userName">
                <FormLabel>User Icon</FormLabel>
                <Stack direction={["column", "row"]} spacing={6}>
                  <Center>
                    <Avatar size="xl" src="https://bit.ly/sage-adebayo">
                      <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-10px"
                        colorScheme="red"
                        aria-label="remove Image"
                        icon={<SmallCloseIcon />}
                      />
                    </Avatar>
                  </Center>
                  <Center w="full">
                    <Button w="full">Change Icon</Button>
                  </Center>
                </Stack>
              </FormControl> */}
                        <FormControl id="userName" isDisabled>
                          <FormLabel>User name</FormLabel>
                          <Input
                            placeholder={userInfo?.username}
                            // _placeholder={{ color: "gray.500" }}
                            type="text"
                          />
                        </FormControl>
                        <FormControl id="email" isDisabled>
                          <FormLabel>Email address</FormLabel>
                          <Input
                            placeholder={userInfo?.email}
                            // _placeholder={{ color: "gray.500" }}
                            type="email"
                          />
                        </FormControl>
                        <FormControl id="password" isDisabled>
                          <FormLabel>Change Password</FormLabel>
                          <Input
                            placeholder="Old password"
                            // _placeholder={{ color: "gray.500" }}
                            type="password"
                          />

                          <Input
                            placeholder="New password"
                            // _placeholder={{ color: "gray.500" }}
                            type="password"
                          />
                        </FormControl>
                        <Stack spacing={6} direction={["column", "row"]}>
                          {/* <Button
                              bg={"red.400"}
                              color={"white"}
                              w="full"
                              _hover={{
                                bg: "red.500",
                              }}
                            >
                              Cancel
                            </Button> */}
                          <Button
                          isDisabled
                            bg={"blue.400"}
                            color={"white"}
                            w="full"
                            _hover={{
                              bg: "blue.500",
                              // shadow: "0 0 10px blue",
                            }}
                          >
                            Submit
                          </Button>
                          
                        </Stack>
                        Info:
                        <Badge>
                        id: {userInfo?.id}
                        </Badge>
                        <Badge>
                        username: {userInfo?.username}
                        </Badge>
                        <Badge>
                        first name: {userInfo?.first_name}
                        </Badge>
                        <Badge>
                        last name: {userInfo?.last_name}
                        </Badge>
                        <Badge>
                        email: {userInfo?.email}
                        </Badge>
                        <Badge>
                        date joined: {formatDate(userInfo?.date_joined)}
                        </Badge>
                        <Badge>
                        last login: {formatDate(userInfo?.last_login)}
                        </Badge>
                      </Stack>
                    </TabPanel>
                    <TabPanel>
                    <FormLabel>Background image</FormLabel>
                    <Input
                      placeholder="Enter background URL"
                      value={backgroundUrl}
                      onChange={handleBackgroundUrlChange}
                    />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose2}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Card>
      </Box>

      <Box w="75%" p={4} overflowY="auto">
        {/* <SlideFade in={isOpen} offsetY='200px'> */}
        {selectedNote && (
          <>
            <Textarea
              ref={textareaRef}
              spellCheck={false}
              colorScheme={"teal"}
              value={selectedNote ? selectedNote.note_text : ""}
              onChange={(e) => {
                setSelectedNote((prevNote) => ({
                  ...prevNote,
                  note_text: e.target.value,
                }));
              }}
              maxH={"100vh"}
              height={"90vh"}
              color={"white"}
              backdropFilter="auto"
              backdropBlur={"10px"}
              focusBorderColor={"teal.600"}
              borderColor={"teal.500"}
              disabled={selectedNote.protected}
            />
            {!selectedNote.protected && (
              <Box float="right" mt={3}>
                <IconButton
                  colorScheme="red"
                  aria-label="Call Segun"
                  size="lg"
                  onClick={() => deleteNote(selectedNote)}
                  icon={<DeleteIcon />}
                />
                <IconButton
                  colorScheme="teal"
                  aria-label="Call Segun"
                  size="lg"
                  ml={3}
                  onClick={() => updateNote(selectedNote)}
                  icon={<CheckIcon />}
                />
              </Box>
            )}
          </>
        )}
        {/* </SlideFade> */}
      </Box>
    </Flex>
  );
}

export default App;
