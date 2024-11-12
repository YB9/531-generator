import { Box, Button, Flex } from "@chakra-ui/react";
import Steps from "../components/stepper";
import { useState } from "react";
import OneRepMax from "../components/one-rep-max";
import Assistance from "../components/assistance";
import Program from "../components/program";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import { BENCH, SQUAT, DEADLIFT, OHP, ROW } from "../constants";
import exercises from "../exercises.json";

const Index = () => {
  // step
  const [step, setStep] = useState(0);
  const handleNextStep = () => {
    setStep(Math.min(step + 1, 2));
  };
  const handlePrevStep = () => {
    setStep(Math.max(step - 1, 0));
  };

  // 1RM
  const [maxes, setMaxes] = useState({
    [BENCH]: "",
    [SQUAT]: "",
    [DEADLIFT]: "",
    [OHP]: "",
    [ROW]: "",
  });

  // assistance
  const [assistance, setAssistance] = useState(
    exercises.filter((exo) => exo.category === "assistance")
  );

  // program
  const [months, setMonths] = useState(6);
  const [assistanceType, setAssistanceType] = useState("random");

  const handleGenerate = () => {
    console.log("generate");
  };

  return (
    <Box h="100vh" px={"5%"} pt={"1%"}>
      <Steps step={step} />
      <Box
        mt={5}
        h={"80%"}
        bgColor={"rgba(200, 230, 250, 0.8)"}
        borderRadius={5}
      >
        {step === 0 && <OneRepMax maxes={maxes} setMaxes={setMaxes} />}
        {step === 1 && (
          <Assistance assistance={assistance} setAssistance={setAssistance} />
        )}
        {step === 2 && (
          <Program
            months={months}
            setMonths={setMonths}
            assistanceType={assistanceType}
            setAssistanceType={setAssistanceType}
            maxes={maxes}
          />
        )}
      </Box>
      <Flex mt={5} justifyContent={"space-between"}>
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
        {step === 2 && (
          <Button
            rightIcon={<DownloadIcon />}
            colorScheme="blue"
            w={200}
            onClick={handleGenerate}
          >
            GENERATE
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Index;
