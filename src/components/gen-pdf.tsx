import { Button } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

const GeneratePdfBtn = ({ program }) => {
  const handleGenerate = () => {
    console.log("program", program);
  };

  return (
    <Button
      rightIcon={<DownloadIcon />}
      colorScheme="blue"
      w={200}
      onClick={handleGenerate}
    >
      DOWNLOAD
    </Button>
  );
};

export default GeneratePdfBtn;
