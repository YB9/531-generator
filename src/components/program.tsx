import {
  Box,
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

function Program({
  months,
  setMonths,
  assistanceType,
  setAssistanceType,
  maxes,
}) {
  const lifts = exercises.filter((exo) => exo.category === "lift");

  return (
    <Box p={10}>
      <Text px={5} py={2} mb={10} borderRadius={5} bgColor={"gray.100"}>
        This program...
      </Text>

      <Flex dir="row" justifyContent={"space-evenly"} p={10}>
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
                <Th>Initial</Th>
                <Th textAlign={"center"}>After {months} Months</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lifts.map((lift, index) => (
                <Tr key={index}>
                  <Td>{lift.name}</Td>
                  <Td>{maxes[lift.name] || 0} lbs</Td>
                  <Td textAlign={"center"}>{maxes[lift.name] * 2} lbs</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box w={"50%"} px={10}>
          <InputGroup w={250}>
            <Select
              value={assistanceType}
              onChange={(event) => {
                setAssistanceType(event.target.value);
              }}
              borderColor={"black"}
              bgColor={"rgba(255, 255, 255, 0.35)"}
            >
              <option value={"random"}>random</option>
              <option value={"balanced"}>balanced</option>
            </Select>
            <InputRightElement pr={20}>assistance</InputRightElement>
          </InputGroup>

          <Box boxSize={80} mx={"auto"} mt={62}>
            <PieChart
              data={VALID_MUSCLE_GROUPS.map((muscle) => {
                return {
                  title: muscle,
                  value: 12,
                  color: groupColors[muscle],
                };
              })}
              label={({ dataEntry }) =>
                `${dataEntry.title} ${Math.round(dataEntry.percentage)} %`
              }
              labelPosition={70}
              labelStyle={{
                fontSize: "4px",
                fontFamily: "sans-serif",
              }}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default Program;
