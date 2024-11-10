import {
  Box,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function ORMCalculator() {
  const [reps, setReps] = useState(2);
  const [weight, setWeight] = useState(0);
  const [calculated1RM, setCalculated1RM] = useState(0);

  const calc1RM = (reps: number, weight: number) => {
    return weight * (1 + 0.0333 * reps);
  };
  const handleRepsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReps(Number(event.target.value));
  };

  const handleWeightChange = (value: string) => {
    setWeight(Number(value));
  };

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

  useEffect(() => {
    setCalculated1RM(Math.round(calc1RM(reps, weight)));
  }, [reps, weight]);

  const toast = useToast();

  return (
    <Box mx={"auto"} textAlign="center" p={5}>
      <Text fontWeight={500} mb={4}>
        1RM Calculator
      </Text>

      <InputGroup mb={4}>
        <Select
          value={reps}
          onChange={handleRepsChange}
          mx="auto"
          borderColor={"black"}
          bgColor={"rgba(255, 255, 255, 0.35)"}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </Select>
      </InputGroup>

      <InputGroup mb={4}>
        <NumberInput
          value={weight}
          onChange={(value) => handleWeightChange(value)}
        >
          <NumberInputField
            placeholder="Weight"
            borderRadius={4}
            borderColor={"black"}
            bgColor={"rgba(255, 255, 255, 0.35)"}
          />
        </NumberInput>
        <InputRightElement px={10}>lbs</InputRightElement>
      </InputGroup>

      <Input
        value={`${calculated1RM} lbs`}
        onClick={handleCopyToClipboard}
        placeholder="Estimated 1RM"
        borderRadius={4}
        borderColor={"black"}
        bgColor={"rgba(255, 255, 255, 0.35)"}
        textAlign="center"
        cursor="pointer"
      />
    </Box>
  );
}

export default ORMCalculator;
