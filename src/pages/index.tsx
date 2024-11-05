import { Badge, Box } from "@chakra-ui/react";
import exercises from "../exercises.json";
import { groupColors } from "../constants";

const Index = () => (
  <Box h="100vh">
    {exercises.map((exercise) => (
      <Badge key={exercise.name} colorScheme={groupColors[exercise.group[0]]} >
      {exercise.name} - {exercise.group[0]}
      </Badge>
    ))}
  </Box>
);

export default Index;
