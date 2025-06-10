import {
  Box,
  Button,
  Flex,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import exercises from "../exercises.json";
import { PieChart } from "react-minimal-pie-chart";
import {
  BENCH,
  DEADLIFT,
  groupColors,
  OHP,
  ROW,
  SQUAT,
  VALID_MUSCLE_GROUPS,
} from "../constants";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  balancedSchedule,
  weightedRandomSchedule,
  getWeightedCount,
  projectOrms,
} from "../lib/program";
import { AssistanceExercise, Lift, Maxes } from "../types";

const cyclesMap = {
  3: 9,
  6: 18,
  9: 26,
  12: 35,
};

const OrmText = ({ value, onClick, isSelected = false }) => {
  return (
    <Text
      cursor={"pointer"}
      w={53}
      onClick={onClick}
      {...(isSelected && {
        ml: -1,
        py: 1,
        mt: -1,
        bgColor: "blue.200",
        fontWeight: 500,
        cursor: "default",
      })}
    >
      {value}
    </Text>
  );
};

function Program({
  cycles,
  setCycles,
  assistanceType,
  setAssistanceType,
  maxes,
  assistance,
  setProgram,
}: {
  cycles: number;
  setCycles: Dispatch<SetStateAction<number>>;
  assistanceType: string;
  setAssistanceType: Dispatch<SetStateAction<string>>;
  maxes: Maxes;
  assistance: AssistanceExercise[];
  setProgram: Dispatch<SetStateAction<any>>;
}) {
  const lifts: Lift[] = exercises.filter((exo) => exo.category === "lift") as Lift[];
  const [projectedOrms, setProjectedOrms] = useState<Record<string, number[]>>({
    [BENCH]: [maxes[BENCH] || 0],
    [SQUAT]: [maxes[SQUAT] || 0],
    [DEADLIFT]: [maxes[DEADLIFT] || 0],
    [OHP]: [maxes[OHP] || 0],
    [ROW]: [maxes[ROW] || 0],
  });

  const [adjustedOrms, setAdjustedOrms] = useState({
    [BENCH]: 1,
    [SQUAT]: 1,
    [DEADLIFT]: 1,
    [OHP]: 1,
    [ROW]: 1,
  });

  // assistance scheduling
  const [randomizedExos, setRandomizedExos] = useState<AssistanceExercise[]>([]);
  const [balancedExos, setBalancedExos] = useState<AssistanceExercise[]>([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setRandomizedExos(weightedRandomSchedule(assistance, cycles));
  }, [toggle, assistance, cycles]);

  useEffect(() => {
    setBalancedExos(balancedSchedule(assistance, cycles));
  }, [assistance, cycles]);

  // 1RM projection
  useEffect(() => {
    setProjectedOrms(projectOrms(lifts, maxes, cycles, adjustedOrms));
  }, [cycles, maxes, adjustedOrms]);

  // program
  useEffect(() => {
    // todo: setProgram(program)
    // const program = ...
  }, [projectedOrms, randomizedExos, balancedExos]);

  const getFinal1RM = (lift, difficulty) => {
    return (
      Math.round(
        ((projectedOrms[lift.name].at(-1) + lift.overload) * difficulty) / 5
      ) * 5
    );
  };

  return (
    <Box p={10} pt={5} pb={0}>
      <Text px={5} py={2} mb={2} borderRadius={5} bgColor={"gray.100"}>
        On the left, pick the duration and select between the 3 paces for each lift. On the right,
        choose the muscle group distribution to customize your program and visualize it with the 
        pie chart. Finally, generate & download the pdf. Good luck!
      </Text>

      <Flex dir="row" justifyContent={"space-evenly"} p={5}>
        <Box w={"50%"} px={5}>
          <InputGroup w={200}>
            <Select
              value={cycles}
              onChange={(event) => {
                setCycles(Number(event.target.value));
              }}
              borderColor={"black"}
              bgColor={"rgba(255, 255, 255, 0.35)"}
            >
              <option value={cyclesMap[3]}>3</option>
              <option value={cyclesMap[6]}>6</option>
              <option value={cyclesMap[9]}>9</option>
              <option value={cyclesMap[12]}>12</option>
            </Select>
            <InputRightElement pr={16}>months</InputRightElement>
          </InputGroup>

          <Table variant="simple" mt={8}>
            <Thead>
              <Tr>
                <Th>Lift</Th>
                <Th>Initial 1RM</Th>
                <Th textAlign={"center"}>
                  After
                  {" " +
                    Object.keys(cyclesMap).find(
                      (key) => cyclesMap[key] === cycles
                    ) +
                    " "}
                  Months
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {lifts.map((lift, index) => (
                <Tr key={index}>
                  <Td>{lift.name}</Td>
                  <Td>{maxes[lift.name] || 0} lbs</Td>
                  <Td textAlign={"center"}>
                    <SimpleGrid columns={3}>
                      <OrmText
                        isSelected={adjustedOrms[lift.name] === 0.8}
                        value={getFinal1RM(lift, 0.8)}
                        onClick={() =>
                          setAdjustedOrms({
                            ...adjustedOrms,
                            [lift.name]: 0.8,
                          })
                        }
                      />
                      <OrmText
                        isSelected={adjustedOrms[lift.name] === 1}
                        value={getFinal1RM(lift, 1)}
                        onClick={() =>
                          setAdjustedOrms({
                            ...adjustedOrms,
                            [lift.name]: 1,
                          })
                        }
                      />
                      <OrmText
                        isSelected={adjustedOrms[lift.name] === 1.2}
                        value={getFinal1RM(lift, 1.2)}
                        onClick={() =>
                          setAdjustedOrms({
                            ...adjustedOrms,
                            [lift.name]: 1.2,
                          })
                        }
                      />
                    </SimpleGrid>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box w={"50%"} px={10} ml={10}>
          <InputGroup w={300}>
            <Select
              value={assistanceType}
              onChange={(event) => {
                setAssistanceType(event.target.value);
              }}
              borderColor={"black"}
              bgColor={"rgba(255, 255, 255, 0.35)"}
            >
              <option value={"random"}>weighted random</option>
              <option value={"balanced"}>balanced</option>
            </Select>
            <InputRightElement pr={20}>assistance</InputRightElement>
          </InputGroup>
          <Button
            ml={10}
            variant={"ghost"}
            w={200}
            onClick={() => setToggle(!toggle)}
          >
            {assistanceType === "random" ? "Re-randomize" : ""}
          </Button>

          <Box boxSize={72} mx={"auto"} mt={25}>
            <PieChart
              style={{ opacity: 0.9 }}
              data={VALID_MUSCLE_GROUPS.map((muscle) => {
                return {
                  title: muscle,
                  value:
                    assistanceType === "random"
                      ? getWeightedCount(randomizedExos, muscle)
                      : balancedExos.filter((exo) => exo.group[0] === muscle)
                          .length,
                  color: groupColors[muscle],
                };
              })}
              label={({ dataEntry }) =>
                assistanceType === "random"
                  ? `${dataEntry.title} ${Math.round(dataEntry.percentage)} %`
                  : dataEntry.title
              }
              labelPosition={70}
              labelStyle={{
                fontSize: assistanceType === "random" ? "3px" : "4px",
                fontWeight: "bold",
              }}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default Program;
