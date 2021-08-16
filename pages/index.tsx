import Upload from '../components/Upload';
import Layout from '../components/Layout';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <Layout>
      <Upload />
    </Layout>
  );
};

export default Home;