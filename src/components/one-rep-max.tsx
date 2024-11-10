import {
  Box,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Text,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import exercises from "../exercises.json";
import { useEffect, useState } from "react";
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

  const calc1RM = (reps: number, weight: number) => {
    return weight * (1 + 0.0333 * reps);
  };

  // State for reps, weight, and calculated 1RM
  const [reps, setReps] = useState(2);
  const [weight, setWeight] = useState(0);
  const [calculated1RM, setCalculated1RM] = useState(0);

  const handleRepsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReps(Number(event.target.value));
  };

  const handleWeightChange = (value: string) => {
    setWeight(Number(value));
  };

  // Copy the 1RM result to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`${calculated1RM} lbs`);
    toast({
      title: "Copied to clipboard",
      description: `${calculated1RM} lbs`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Update calculated 1RM when reps or weight changes
  useEffect(() => {
    setCalculated1RM(Math.round(calc1RM(reps, weight)));
  }, [reps, weight]);

  const toast = useToast();

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

      <SimpleGrid mt={5} p={20} columns={3} spacing={24}>
        {lifts.map((lift) => (
          <NumberInput
            w={250}
            mx={"auto"}
            defaultValue={maxes[lift.name]}
            onChange={(e) => handleChange(e, lift.name)}
          >
            <Text textAlign={"center"} fontWeight={500} mb={4}>
              {lift.name}
            </Text>
            <InputGroup>
              <NumberInputField
                borderRadius={4}
                maxLength={5}
                pl={6}
                borderColor={"black"}
                bgColor={"rgba(255, 255, 255, 0.35)"}
              />
              <InputRightElement px={10}>lbs</InputRightElement>
            </InputGroup>
          </NumberInput>
        ))}
        {/* <ORMCalculator /> */}
      </SimpleGrid>
    </Box>
  );
}

export default OneRepMax;
