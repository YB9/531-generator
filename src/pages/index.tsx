import { Box, Button, Flex } from "@chakra-ui/react";
import Steps from "../components/stepper";
import { useState } from "react";
import OneRepMax from "../components/one-rep-max";
import Assistance from "../components/assistance";
import Program from "../components/program";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const Index = () => {
  const [step, setStep] = useState(0);
  const handleNextStep = () => {
    setStep(Math.min(step + 1, 2));
  };
  const handlePrevStep = () => {
    setStep(Math.max(step - 1, 0));
  };

  return (
    <Box h="100vh" px={"5%"} pt={"1%"}>
      <Steps step={step} />
      <Box mt={5} h={"85%"} bgColor={"blue.100"}>
        {step === 0 && <OneRepMax />}
        {step === 1 && <Assistance />}
        {step === 2 && <Program />}
      </Box>
      <Flex mt={3} justifyContent={"space-between"}>
        {step > 0 ? (
          <Button
            leftIcon={<ArrowBackIcon />}
            colorScheme="blue"
            w={200}
            onClick={handlePrevStep}
          >
            BACK
          </Button>
        ) : (
          <div></div>
        )}
        {step < 2 && (
          <Button
            rightIcon={<ArrowForwardIcon />}
            colorScheme="blue"
            w={200}
            onClick={handleNextStep}
          >
            NEXT
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Index;
