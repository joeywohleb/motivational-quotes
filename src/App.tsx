import { ApolloProvider } from '@apollo/client';
import { YStack } from '@tamagui/stacks';

import { apolloClient } from './graphql/client';
import Header from './components/Header';
import QuoteDisplay from './components/QuoteDisplay';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <YStack flex={1} minHeight="100vh" backgroundColor="$background">
        <Header />
        <QuoteDisplay />
      </YStack>
    </ApolloProvider>
  );
}

export default App;
