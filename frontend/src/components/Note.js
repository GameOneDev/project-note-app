import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Button,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { LockIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Stack,
  Tooltip,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import '../App.css'

export default function Note({
  note,
  noteDescription = "Note Default Desc",
  noteDate = "",
  noteCollab,
  noteProtect = false,
  fetchCollab,
  addCollab,
  deleteCollab,
  userInfo,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const [collaborators, setCollaborators] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

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
    const formattedDate = date.toLocaleString("pl-PL", options);
    
    return formattedDate;
  };


  useEffect(() => {
    if (isOpen2) {
      // Fetch collaborators when the drawer is opened
      fetchCollab().then((data) => {
        setCollaborators(data);
      });
    }
  }, [isOpen2, fetchCollab, noteCollab]);

  const filteredCollaborators = collaborators.filter((collab) =>
    collab.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card
      variant={"outline"}
      size={"sm"}
      bg={noteProtect ? "red.300" : "teal.500"} // Change background color based on noteProtect value
      color={"white"}
      margin={"5px"}
      border={"none"}
      borderRadius={"md"}
      mt={2}
      _hover={{ bg: "teal.600" }}
      _active={{ bg: "teal.700" }}
      position="relative" // Ensure the lock icon is positioned correctly
    >
      {noteProtect && (
        <LockIcon
          color="gray.500"
          position="absolute"
          top={0}
          right={0}
          transform="translate(-10%, 10%)"
          fontSize="2xl"
          // zIndex={1} // Ensure the lock icon is above the content
        />
      )}
      <CardBody>{noteDescription}</CardBody>
      <CardFooter color={"gray.200"} fontSize={"xs"} pt={0}>
        <Tooltip
        hasArrow
        label={note.edit_date === null ? "": "Created: "+formatDate(note.pub_date)}
        bg="teal.400">
        {note.edit_date === null ? "Created: "+formatDate(note.pub_date): "Edited: "+formatDate(note.edit_date)}
        </Tooltip>
      </CardFooter>
      <CardFooter color={"gray.200"} fontSize={"xs"} pt={0} alignItems='baseline'>
          
        <Stack direction="row" overflow={'hidden'} onClick={onOpen}>
          {note.owner !== (userInfo?.username || note.owner) && (
            <Tooltip hasArrow label="Owner" bg="yellow.300">
              <Badge colorScheme="yellow">{note.owner}</Badge>
            </Tooltip>
          )}
          {noteCollab.map((collab, index) => (
            <Tooltip
              key={collab.id}
              hasArrow
              label={
                collab.username === userInfo?.username ? "You" : "Collaborant"
              }
              bg={
                collab.username === userInfo?.username ? "blue.600" : "green.600"
              }
            >
              <Badge
                colorScheme={
                  collab.username === userInfo?.username ? "blue" : "green"
                }
              >
                {index > 0}
                {collab.username}
              </Badge>
            </Tooltip>
          ))}
        </Stack>

        <IconButton
          onClick={onOpen}
          colorScheme="teal"
          aria-label="Call Segun"
          size={3}
          p={2}
          
          ml={2}
          icon={<EditIcon />}
        />
      </CardFooter>
        <Modal isOpen={isOpen} onClose={onClose} isLazy>
          <ModalOverlay />
          <ModalContent
            backdropFilter="auto"
            backdropBlur={"10px"}
            bg={"rgba(255, 255, 255, 0.1)"}
          >
            <ModalHeader color={'white'}>Collaborators</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {noteCollab.map((collab) => (
                <Tooltip
                  key={collab.id}
                  hasArrow
                  label={note.owner !== userInfo?.username && collab.username !== userInfo?.username ? "You can't do this": "Delete collaborant"}
                  bg="red.600"
                >
                  <Button
                    isDisabled={note.owner !== userInfo?.username && collab.username !== userInfo?.username}
                    colorScheme={
                      collab.username === userInfo?.username ? "blue" : "green"
                    }
                    // _hover={{ bg: "red.600" }}
                    mr={2}
                    mt={2}
                    mb={2}
                    key={collab.id}
                    onClick={() => deleteCollab(note, collab.id)}
                  >
                    {collab.username}
                  </Button>
                </Tooltip>
              ))}
              <Box>
                <IconButton
                  isDisabled={note.owner !== userInfo?.username}
                  onClick={onOpen2}
                  colorScheme="teal"
                  aria-label="Call Segun"
                  size="lg"
                  //   ml={3}
                  icon={<AddIcon />}
                />
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Drawer placement="left" onClose={onClose2} isOpen={isOpen2}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              Add collaborator
            </DrawerHeader>
            <Input
              placeholder="Search collaborators"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <DrawerBody>
              {userInfo &&
                filteredCollaborators
                  .filter((collab) => {
                    // Check if the collaborator's username is not the same as the current user's username
                    // Also, check if the collaborator's username is not the same as the note owner's username
                    return (
                      collab.username !== userInfo.username &&
                      collab.username !== note.owner &&
                      !noteCollab.some(
                        (noteCollab) => noteCollab.username === collab.username
                      )
                    );
                  })
                  .map((collab) => (
                    <div key={collab.id}>
                      <Button
                        key={collab.id}
                        onClick={() => addCollab(note, collab.id)}
                        margin={"2px"}
                      >
                        {collab.username}
                      </Button>
                    </div>
                  ))}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      
    </Card>
  );
}
