import { Flex, Stack, Heading, Text, Input, Button, Icon, useColorModeValue, Box } from '@chakra-ui/react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import React from 'react';

export default function Upload() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = React.useState<{ res: string; ok: boolean; } | null>(null);

  const onClickHandler = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!fileInputRef.current?.files?.length) {
      return setUrl({ ok: false, res: 'Select an image!' });
    }

    setLoading(true);
    const formData = new FormData();
    Array.from(fileInputRef.current.files).forEach((file) => {
      formData.append('attachment', file);
    });

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      setUrl({ ok: true, res: data.path });
    } else {
      setUrl({ ok: false, res: 'Failed to upload!' });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLoading(false);
  };

  return (
    <Flex
      py={12}
      minH={'100vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        p={10}
        spacing={8}
        align={'center'}>
        <Icon as={FaCloudUploadAlt} w={24} h={24} />
        <Stack align={'center'} spacing={2}>
          <Heading
            textTransform={'uppercase'}
            fontSize={'3xl'}
            color={useColorModeValue('gray.800', 'gray.200')}>
            Upload
          </Heading>
          <Text fontSize={'lg'} color={'gray.500'}>
            The Maximum Payload Size is 5 MB
          </Text>

          {
            (url && !url.ok) && <Text fontSize={'lg'} color={'red'}>
              {url.res}
            </Text>
          }
          {
            (url && url.ok) && <Box as="a" href={url.res} target="_blank" color="teal.400" fontWeight="bold">
              {url.res}
            </Box>
          }
        </Stack>
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
          <Input
            ref={fileInputRef}
            type={'file'}
            border={0}
            _focus={{ outline: 'none' }}
            onChange={() => {
              setUrl(null);
            }}
            onClick={() => {
              setUrl(null);
            }}
            required={true}
          />

          <Button
            isLoading={loading}
            type={'submit'}
            bg={'#5865f2'}
            borderRadius={'0.3rem'}
            color={'white'}
            flex={'1 0 auto'}
            _hover={{ bg: 'blue.500' }}
            _focus={{ bg: 'blue.500' }}
            onClick={onClickHandler}
          >
            Upload
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

