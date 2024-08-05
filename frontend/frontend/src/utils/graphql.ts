import { GraphQLResponse } from './types';

export const fetchGraphQLData = async <T>(query: string) => {
  const response = await fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
    body: JSON.stringify({query})
  }).then(res => res.json());

  console.log("response");
  console.log(response);
  
  return response.data;
};