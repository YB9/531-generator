import {
  Box,
  Flex,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import exercises from "../exercises.json";
import ORMCalculator from "./orm-calculator";

function OneRepMax({ maxes, setMaxes }) {
  const lifts = exercises.filter((exo) => exo.category === "lift");

  const handleChange = (value: string, lift: string) => {
    const updatedMaxes = {
      ...maxes,
      [lift]: Number(value),
    };
    setMaxes(updatedMaxes);
  };

  return (
    <Box p={10}>
      <Text px={5} py={2} borderRadius={5} bgColor={"gray.100"}>
        This program focuses on the five main compound lifts so it is important
        to track them starting with your one-rep max. A one-rep max (1RM) is the
        maximum weight you can lift for a single repetition with proper form. To
        find your 1RM, start by warming up, then choose a weight close to your
        max, and attempt a single lift. Increase gradually until you reach the
        heaviest weight you can lift once without breaking form. For a safer
        estimation, especially for beginners, you can lift a lighter weight for
        several reps (e.g., 3-5) and use the 1RM calculator to estimate your
        max. Note: Any Lift left blank will default to 0.
      </Text>

      <Flex dir="row" mt={5} pt={10} justifyContent={"space-evenly"} w={"95%"}>
        <ORMCalculator />
        <SimpleGrid columns={2} spacing={20} px={20}>
          {lifts.map((lift) => (
            <NumberInput
              w={250}
              mx={"auto"}
              defaultValue={maxes[lift.name]}
              onChange={(e) => handleChange(e, lift.name)}
            >
              <Text textAlign={"center"} fontWeight={500} mb={3}>
                {lift.name}
              </Text>
              <InputGroup>
                <NumberInputField
                  borderRadius={4}
                  maxLength={10}
                  pl={6}
                  borderColor={"black"}
                  bgColor={"rgba(255, 255, 255, 0.35)"}
                />
                <InputRightElement px={10}>lbs</InputRightElement>
              </InputGroup>
            </NumberInput>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}

export default OneRepMax;
