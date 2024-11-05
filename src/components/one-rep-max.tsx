import { Box, Text } from "@chakra-ui/react";
import exercises from "../exercises.json";

function OneRepMax() {
  const lifts = exercises.filter((exercise) => exercise.category === "lift");
  return (
    <Box>
      {lifts.map((lift) => (
        <Text key={lift.name}>
          {lift.name} - {lift.split}
        </Text>
      ))}
    </Box>
  );
}

export default OneRepMax;
