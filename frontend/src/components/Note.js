import { Card, CardBody, CardHeader } from "@chakra-ui/react"
export default function Note({noteHeader="Note Default Title",noteDescription="Note Default Desc"}){
    return(
        <>
            <Card maxW={"sm"} variant={"outline"} size={"sm"}>
                <CardHeader textAlign={"center"} fontSize={"lg"} fontWeight={"700"}>
                    {noteHeader}
                </CardHeader>
                <CardBody>
                    {noteDescription}
                </CardBody>
            </Card>
        </>
    )
}