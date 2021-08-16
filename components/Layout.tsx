import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';

const Layout: NextPage = ({ children }) => {
  return (
    <Box bg={'#141821'} width={'100%'} minH={'100vh'}>
      <main>
        {children}
      </main>
    </Box>
  );
};

export default Layout;
