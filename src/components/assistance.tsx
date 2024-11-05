import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import exercises from "../exercises.json";
import { useState } from "react";

const SplitTable = ({
  assistance,
  split,
  rows,
}: {
  assistance: any[];
  split: string;
  rows: string[];
}) => {
  const getFilteredExos = (split: string, group: string) => {
    return assistance.filter(
      (exo) => exo.split === split && exo.group[0] === group
    );
  };

  return (
    <Box p={5} pb={10} bgColor={"rgba(255, 99, 71, 0.75)"} borderRadius={3}>
      <Heading textAlign={"center"} fontFamily={"Times New Roman"} size="lg">
        {split.charAt(0).toUpperCase() + split.slice(1)}
      </Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row) => (
              <Tr key={row}>
                <Td fontWeight={500} fontSize={17}>
                  {row.charAt(0).toUpperCase() + row.slice(1)}
                </Td>
                <Td>
                  {getFilteredExos(split, row).map((exo) => (
                    <Text key={exo.name}>{exo.name}</Text>
                  ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

function Assistance() {
  const [assistance, setAssistance] = useState(
    exercises.filter((exo) => exo.category === "assistance")
  );

  return (
    <Box p={10}>
      <Text px={5} py={2} mb={20} borderRadius={5} bgColor={"gray.100"}>
        Assistance exercises follow your main compound lifts and are organized
        into a five-day split: 2 Push days, 2 Pull days, and 1 Legs day.
        Typically, assistance exercises are performed in a 3x 8-12 rep range to
        specifically target hypertrophy. You can customize the exercises
        directly on the table to fit your needs.
      </Text>

      <SimpleGrid columns={3} spacing={20}>
        <SplitTable
          assistance={assistance}
          split="push"
          rows={["shoulders", "chest", "triceps"]}
        />

        <SplitTable
          assistance={assistance}
          split="pull"
          rows={["back", "biceps", "forearms"]}
        />

        <SplitTable
          assistance={assistance}
          split="legs"
          rows={["quadriceps", "hamstrings", "calves"]}
        />
      </SimpleGrid>
    </Box>
  );
}

export default Assistance;
