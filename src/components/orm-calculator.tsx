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
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function ORMCalculator() {
  const [reps, setReps] = useState(2);
  const [weight, setWeight] = useState(0);
  const [calculated1RM, setCalculated1RM] = useState(0);

  const calc1RM = (reps: number, weight: number) => {
    return weight * (1 + 0.0333 * reps);
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
    <Box textAlign="center" p={5} pr={100} borderRight={"1px solid gray"}>
      <Text fontWeight={500} mb={4}>
        1RM Calculator
      </Text>

      <InputGroup mb={4}>
        <Select
          value={reps}
          onChange={(event) => {
            setReps(Number(event.target.value));
          }}
          borderColor={"black"}
          bgColor={"rgba(255, 255, 255, 0.35)"}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </Select>
        <InputRightElement pr={12}>reps</InputRightElement>
      </InputGroup>

      <InputGroup mb={4}>
        <NumberInput
          value={weight}
          onChange={(value) => {
            setWeight(Number(value));
          }}
        >
          <NumberInputField
            borderRadius={4}
            borderColor={"black"}
            bgColor={"rgba(255, 255, 255, 0.35)"}
          />
        </NumberInput>
        <InputRightElement pr={12}>lbs</InputRightElement>
      </InputGroup>

      <Tooltip label="Click to copy" aria-label="A tooltip">
        <Input
          value={`${calculated1RM} lbs`}
          onClick={handleCopyToClipboard}
          readOnly
          placeholder="Estimated 1RM"
          borderRadius={4}
          borderColor={"black"}
          bgColor={"rgba(255, 255, 255, 0.35)"}
          textAlign="center"
          cursor="pointer"
        />
      </Tooltip>
    </Box>
  );
}

export default ORMCalculator;
