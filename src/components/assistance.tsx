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
  useEditableControls,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  ButtonGroup,
  Flex,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

const SplitTable = ({
  assistance,
  setAssistance,
  split,
  rows,
}: {
  assistance: any[];
  setAssistance: any;
  split: string;
  rows: string[];
}) => {
  const getFilteredExos = (split: string, muscle: string) => {
    return assistance.filter(
      (exo) => exo.split === split && exo.group[0] === muscle
    );
  };

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <CheckIcon boxSize={3} mr={3} my={"auto"} {...getSubmitButtonProps()} />
        <CloseIcon boxSize={3} mr={3} my={"auto"} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <EditIcon boxSize={3} mr={3} my={"auto"} {...getEditButtonProps()} />{" "}
      </Flex>
    );
  }

  return (
    <Box p={5} pb={10} bgColor={"rgba(255, 99, 71, 0.6)"} borderRadius={3}>
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
            {rows.map((muscle) => (
              <Tr key={muscle}>
                <Td fontWeight={500} fontSize={17}>
                  {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                </Td>
                <Td>
                  {getFilteredExos(split, muscle).map((exo, i) => (
                    <Editable
                      key={exo.name}
                      textAlign="center"
                      defaultValue={exo.name}
                      isPreviewFocusable={false}
                      display={"flex"}
                      flexDirection={"row"}
                      onSubmit={(newVal) => {
                        setAssistance((prevAssistance) =>
                          prevAssistance.map((item) =>
                            item.name === exo.name && item.split === split
                              ? { ...item, name: newVal || item.name }
                              : item
                          )
                        );
                      }}
                    >
                      <EditableControls />
                      <EditablePreview />
                      <Input as={EditableInput} size={"sm"} />
                    </Editable>
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

function Assistance({ assistance, setAssistance }) {
  return (
    <Box p={10}>
      <Text px={5} py={2} mb={14} borderRadius={5} bgColor={"gray.100"}>
        Assistance exercises follow your main compound lifts and are organized
        into a five-day split: 2 Push days, 2 Pull days, and 1 Legs day.
        Typically, assistance exercises are performed in a 3x 8-12 rep range to
        specifically target hypertrophy. Here is a pool of balanced assistance
        exercises you can plug-&-play but you can also customize the exercises
        directly on the table. If you do change the program, keep in mind that
        exercises often cross over between muscle groups so be careful not to
        overwork any particular muscle group.
      </Text>

      <SimpleGrid columns={3} spacing={10}>
        <SplitTable
          assistance={assistance}
          setAssistance={setAssistance}
          split="push"
          rows={["shoulders", "chest", "triceps"]}
        />

        <SplitTable
          assistance={assistance}
          setAssistance={setAssistance}
          split="pull"
          rows={["back", "biceps", "forearms"]}
        />

        <SplitTable
          assistance={assistance}
          setAssistance={setAssistance}
          split="legs"
          rows={["quadriceps", "hamstrings", "calves"]}
        />
      </SimpleGrid>
    </Box>
  );
}

export default Assistance;
