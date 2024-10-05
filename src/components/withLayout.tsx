// src/components/withLayout.tsx

import Layout from './Layout';

const withLayout = (PageComponent) => {
  const WrappedComponent = (props) => {
    return (
      <Layout>
        <PageComponent {...props} />
      </Layout>
    );
  };

  return WrappedComponent;
};

export default withLayout;
