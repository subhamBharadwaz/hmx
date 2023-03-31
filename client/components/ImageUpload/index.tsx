import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Center,
  useColorModeValue,
  Icon,
  IconButton,
  Grid,
  GridItem,
  Box,
  useToast,
} from "@chakra-ui/react";
import { AiFillFileAdd, AiOutlineClose } from "react-icons/ai";
import NextImage from "next/image";

interface Props {
  isMultiple: boolean;
  files?: File[];
  defaultFiles?: string[];
  onChange: (files: File[]) => void;
}

export default function ImageUpload({
  isMultiple,
  files,
  defaultFiles,
  onChange,
  ...props
}: Props) {
  const toast = useToast();
  const [uploadedFiles, setUploadedFiles] = useState(files);

  useEffect(() => {
    setUploadedFiles(files);
  }, [files]);

  useEffect(() => {
    if (defaultFiles) {
      const fetchAndAddDefaultFiles = async () => {
        const defaultFileObjects = await Promise.all(
          defaultFiles.map(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            return new File([blob], "default-image", { type: blob.type });
          })
        );
        setUploadedFiles(defaultFileObjects);
        onChange(defaultFileObjects);
      };
      fetchAndAddDefaultFiles();
    }
  }, [defaultFiles, onChange]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (
        (!isMultiple && acceptedFiles.length !== 1) ||
        (isMultiple && uploadedFiles.length + acceptedFiles.length > 4)
      ) {
        // reject the selection
        toast({
          title: `Only ${isMultiple ? "4" : "1"} image${
            isMultiple ? "s" : ""
          } can be uploaded.`,
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      const newFiles = isMultiple
        ? [...uploadedFiles, ...acceptedFiles]
        : [...acceptedFiles.slice(0, 1)];
      setUploadedFiles(newFiles);
      onChange(newFiles);
    },
    [isMultiple, toast, uploadedFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    multiple: isMultiple,
  });

  const removeFile = (event, index: number) => {
    // to prevent opening the file manager when removing images
    event.stopPropagation();
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };

  const dropText = isDragActive
    ? "Drop your product's images here ..."
    : "Drag 'n' drop images here, or click to select images";

  const activeBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue(
    isDragActive ? "teal.300" : "gray.300",
    isDragActive ? "teal.500" : "gray.500"
  );

  return (
    <Center
      p={10}
      cursor="pointer"
      bg={isDragActive ? activeBg : "transparent"}
      _hover={{ bg: activeBg }}
      transition="background-color 0.2s ease"
      borderRadius={4}
      border="3px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {uploadedFiles?.length > 0 ? (
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          {uploadedFiles?.map((file, index) => (
            <GridItem key={file.name}>
              <Box position="relative" borderRadius={4}>
                <NextImage
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={200}
                  height={300}
                  objectFit="cover"
                  objectPosition="center"
                />
                <IconButton
                  icon={<AiOutlineClose />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  position="absolute"
                  top={0}
                  right={0}
                  aria-label="Remove"
                  onClick={(event) => removeFile(event, index)}
                />
              </Box>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <>
          <Icon as={AiFillFileAdd} mr={2} />
          <p>{dropText}</p>
        </>
      )}
    </Center>
  );
}
