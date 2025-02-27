import { useEffect, useState } from "react";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();

async function getter() {
  const data = await axios.get("https://jsonplaceholder.typicode.com/posts/");
  const response = await data.json();
  return response;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getter,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <div>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
