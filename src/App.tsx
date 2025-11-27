import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './graphql/client';
import QuoteDisplay from './components/QuoteDisplay';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <QuoteDisplay />
    </ApolloProvider>
  );
}

export default App;
