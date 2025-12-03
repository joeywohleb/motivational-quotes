import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { YStack } from '@tamagui/stacks';

import { apolloClient } from './graphql/client';
import { Header } from './components';
import { Home, ViewQuote, NotFound } from './pages';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <YStack flex={1} minHeight="100vh" backgroundColor="$background">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/:authorPermalink/:quotePermalink"
              element={<ViewQuote />}
            />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </YStack>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
