import {
  Box,
  Button,
  Flex,
  InputGroup,
  InputRightElement,
  Select,
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
import { groupColors, VALID_MUSCLE_GROUPS } from "../constants";
import { useEffect, useState } from "react";

function Program({
  months,
  setMonths,
  assistanceType,
  setAssistanceType,
  maxes,
  assistance,
}) {
  const lifts = exercises.filter((exo) => exo.category === "lift");
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
    const totalWeeks = (months / 3) * 13;
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
  }, [toggle, assistanceType, months]);

  const getWeightedCount = (muscle) => {
    const SECONDARY_INC = 0.35;
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
    const totalWeeks = (months / 3) * 13;
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
  }, [months]);

  return (
    <Box p={10}>
      <Text px={5} py={2} mb={5} borderRadius={5} bgColor={"gray.100"}>
        This program is designed with a upper body focus and follows a
        opinionated approach. It's designed for beginners to take full advantage
        of the rapid gains that come in the early stages, so it's not
        recommended for advanced lifters. For best results, I suggest choosing
        the "random weighted" option to vary your weekly routine. Select the
        duration and see your projected 1RM by the end of the program.
      </Text>

      <Flex dir="row" justifyContent={"space-evenly"} p={10} ml={16}>
        <Box w={"50%"} px={10}>
          <InputGroup w={250}>
            <Select
              value={months}
              onChange={(event) => {
                setMonths(Number(event.target.value));
              }}
              borderColor={"black"}
              bgColor={"rgba(255, 255, 255, 0.35)"}
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </Select>
            <InputRightElement pr={16}>months</InputRightElement>
          </InputGroup>

          <Table variant="simple" mt={12}>
            <Thead>
              <Tr>
                <Th>Lift</Th>
                <Th>Initial 1RM</Th>
                <Th textAlign={"center"}>After {months} Months</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lifts.map((lift, index) => (
                <Tr key={index}>
                  <Td>{lift.name}</Td>
                  <Td>{maxes[lift.name] || 0} lbs</Td>
                  <Td textAlign={"center"}>{maxes[lift.name] * 2} lbs</Td>
                  {/* todo: 3 pace options on click select */}
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
