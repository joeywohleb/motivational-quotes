import { ApolloProvider } from '@apollo/client';
import { YStack } from '@tamagui/stacks';

import { apolloClient } from './graphql/client';
import { Header }  from './components';
import { Home } from './pages';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <YStack flex={1} minHeight="100vh" backgroundColor="$background">
        <Header />
        <Home />
      </YStack>
    </ApolloProvider>
  );
}

export default App;
