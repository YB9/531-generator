import { Box, SimpleGrid, Text } from "@chakra-ui/react";

function Program() {
  return (
    <Box p={10}>
      <Text px={5} py={2} mb={10} borderRadius={5} bgColor={"gray.100"}>
        This program...
      </Text>

      <SimpleGrid pt={10} columns={5} spacing={20}>
        <Box bg={"tomato"} p={5} borderRadius={5} />
        <Box bg={"tomato"} p={5} borderRadius={5} />
        <Box bg={"tomato"} p={5} borderRadius={5} />{" "}
        <Box bg={"tomato"} p={5} borderRadius={5} />
        <Box bg={"tomato"} p={5} borderRadius={5} />
      </SimpleGrid>
    </Box>
  );
}

export default Program;
