import { Author } from "./Author";

export interface Quote {
  id: string;
  quote: string;
  permalink: string;
  author: Author;
}