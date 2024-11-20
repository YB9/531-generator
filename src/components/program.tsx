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
import { useEffect, useState } from "react";

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
}) {
  const lifts = exercises.filter((exo) => exo.category === "lift");
  const [projectedOrms, setProjectedOrms] = useState({
    [BENCH]: [maxes[BENCH]],
    [SQUAT]: [maxes[SQUAT]],
    [DEADLIFT]: [maxes[DEADLIFT]],
    [OHP]: [maxes[OHP]],
    [ROW]: [maxes[ROW]],
  });

  const [adjustedOrms, setAdjustedOrms] = useState({
    [BENCH]: 1,
    [SQUAT]: 1,
    [DEADLIFT]: 1,
    [OHP]: 1,
    [ROW]: 1,
  });

  const pushExercises = assistance.filter((e) => e.split === "push");
  const pullExercises = assistance.filter((e) => e.split === "pull");
  const legExercises = assistance.filter((e) => e.split === "legs");

  // random
  const [randomizedExos, setRandomizedExos] = useState([]);
  const [toggle, setToggle] = useState(false);
  const getRandomExos = (array) => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };
  useEffect(() => {
    const totalWeeks = Math.ceil(cycles * 1.5);
    const result = [];
    for (let i = 0; i < totalWeeks; i++) {
      let weeklyExercises = [
        ...getRandomExos(pushExercises),
        ...getRandomExos(pullExercises),
        ...getRandomExos(legExercises),
        ...getRandomExos(pushExercises),
        ...getRandomExos(pullExercises),
      ];
      result.push(...weeklyExercises);
    }
    setRandomizedExos(result);
  }, [toggle, assistanceType, cycles]);

  const getWeightedCount = (muscle) => {
    const SECONDARY_INC = 0.25;
    const count = randomizedExos.reduce((count, exo) => {
      exo.group.forEach((group, index) => {
        if (group === muscle) {
          count += index === 0 ? 1 : SECONDARY_INC;
        }
      });
      return count;
    }, 0);
    return Math.ceil(count);
  };

  // balanced
  const [balancedExos, setBalancedExos] = useState([]);
  const getBalancedExos = (array) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    const selected = [];
    const groups = new Set();
    for (let exo of shuffled) {
      const mainGroup = exo.group[0];
      if (!groups.has(mainGroup)) {
        selected.push(exo);
        groups.add(mainGroup);
      }
      if (selected.length === 3) break;
    }
    return selected;
  };

  useEffect(() => {
    const totalWeeks = Math.ceil(cycles * 1.5);
    const result = [];
    for (let i = 0; i < totalWeeks; i++) {
      let weeklyExercises = [
        ...getBalancedExos(pushExercises),
        ...getBalancedExos(pullExercises),
        ...getBalancedExos(legExercises),
        ...getBalancedExos(pushExercises),
        ...getBalancedExos(pullExercises),
      ];
      result.push(...weeklyExercises);
    }
    setBalancedExos(result);
  }, [assistanceType, cycles]);

  // 1RM projection
  useEffect(() => {
    const updatedOrms = { ...projectedOrms };
    lifts.forEach((lift) => {
      const initialORM = updatedOrms[lift.name][0] || 0;
      const newArray = [initialORM * adjustedOrms[lift.name]];
      for (let i = 1; i <= cycles; i++) {
        const prevORM = newArray[newArray.length - 1];
        if (i % 5 === 0) {
          newArray.push(prevORM - lift.deload);
        } else {
          newArray.push(prevORM + lift.overload);
        }
      }
      updatedOrms[lift.name] = newArray;
    });
    setProjectedOrms(updatedOrms);
  }, [cycles, maxes, adjustedOrms]);

  // program
  useEffect(() => {
    // todo: generate program
    // per week
  }, [projectedOrms, randomizedExos, balancedExos]);

  const getFinal1RM = (lift, difficulty) => {
    return (
      Math.round(
        ((projectedOrms[lift.name].at(-1) + lift.overload) * difficulty) / 5
      ) * 5
    );
  };

  return (
    <Box p={10}>
      <Text px={5} py={2} mb={5} borderRadius={5} bgColor={"gray.100"}>
        This program is designed with a 2:1 upper body focus and follows an
        opinionated approach for men. It's designed for beginners to take full
        advantage of the rapid gains that come in the early stages, so it's not
        recommended for advanced lifters. For best results, I suggest choosing
        the "random weighted" option to vary your weekly routine. Select the
        duration and see your projected 1RM by the end of the program.
      </Text>

      <Flex dir="row" justifyContent={"space-evenly"} p={10} ml={16}>
        <Box w={"50%"} px={10}>
          <InputGroup w={250}>
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

          <Table variant="simple" mt={12}>
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

          <Box boxSize={80} mx={"auto"} mt={30}>
            <PieChart
              style={{ opacity: 0.9 }}
              data={VALID_MUSCLE_GROUPS.map((muscle) => {
                return {
                  title: muscle,
                  value:
                    assistanceType === "random"
                      ? getWeightedCount(muscle)
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
