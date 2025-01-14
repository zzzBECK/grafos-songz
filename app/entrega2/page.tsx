// Entrega2.tsx
"use client";

import GraphComponent2 from "@/components/graph-component2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDijkstra } from "@/hooks/dijkstra";
import { mockData } from "@/lib/mocks/songs";
import { useState } from "react";

export default function Entrega2() {
  const { findShortestPath, findAllPaths, shortestPath, allPaths } =
    useDijkstra();
  const [startSong, setStartSong] = useState("");
  const [endSong, setEndSong] = useState("");
  const [autocompleteOptionsStart, setAutocompleteOptionsStart] = useState<
    string[]
  >([]);
  const [autocompleteOptionsEnd, setAutocompleteOptionsEnd] = useState<
    string[]
  >([]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (startSong.trim() !== "" && endSong.trim() !== "") {
      findAllPaths(startSong, endSong);
      findShortestPath(startSong, endSong);
    }
  };

  const handleStartInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setStartSong(value);
    if (value.trim() === "") {
      setAutocompleteOptionsStart([]);
    } else {
      const filteredOptions = mockData.nodes
        .filter((node) => node.id.toLowerCase().includes(value.toLowerCase()))
        .map((node) => node.id);
      setAutocompleteOptionsStart(filteredOptions);
    }
  };

  const handleEndInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEndSong(value);
    if (value.trim() === "") {
      setAutocompleteOptionsEnd([]);
    } else {
      const filteredOptions = mockData.nodes
        .filter((node) => node.id.toLowerCase().includes(value.toLowerCase()))
        .map((node) => node.id);
      setAutocompleteOptionsEnd(filteredOptions);
    }
  };

  const handleOptionClickStart = (option: string) => {
    setStartSong(option);
    setAutocompleteOptionsStart([]);
  };

  const handleOptionClickEnd = (option: string) => {
    setEndSong(option);
    setAutocompleteOptionsEnd([]);
  };

  return (
    <main className="min-h-svh w-[100vw] overflow-x-hidden">
      <div className="flex flex-col container min-h-20 items-center gap-10">
        <h1 className="text-4xl font-bold">Entrega 2</h1>
        <form onSubmit={handleSearch} className="flex flex-col gap-4 relative">
          <div className="flex gap-2">
            <Input
              className="w-96"
              placeholder="Digite a música de início"
              value={startSong}
              onChange={handleStartInputChange}
            />
            {autocompleteOptionsStart.length > 0 && (
              <ul className="absolute top-full mt-1 w-full bg-card border border-gray-300 z-10 max-h-[70vh] overflow-auto">
                {autocompleteOptionsStart.map((option) => (
                  <li
                    key={option}
                    className="px-4 py-2 hover:bg-gray-900 cursor-pointer"
                    onClick={() => handleOptionClickStart(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              className="w-96"
              placeholder="Digite a música de destino"
              value={endSong}
              onChange={handleEndInputChange}
            />
            {autocompleteOptionsEnd.length > 0 && (
              <ul className="absolute top-full mt-1 w-full bg-card border border-gray-300 z-10 max-h-[70vh] overflow-auto">
                {autocompleteOptionsEnd.map((option) => (
                  <li
                    key={option}
                    className="px-4 py-2 hover:bg-gray-900 cursor-pointer"
                    onClick={() => handleOptionClickEnd(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button variant="default" type="submit">
            Buscar
          </Button>
        </form>
      </div>
      {allPaths.length > 0 && (
        <div className="flex flex-col items-center mt-10">
          <h2 className="text-3xl font-bold">Todos os Caminhos Encontrados</h2>
          <ul className="mt-4 list-disc">
            {allPaths.map((path, index) => (
              <li key={index}>{path.join(" -> ")}</li>
            ))}
          </ul>
        </div>
      )}
      {shortestPath && (
        <div className="flex flex-col items-center mt-10 mb-20">
          <h2 className="text-3xl font-bold">Menor Caminho Encontrado</h2>
          <p>{shortestPath.join(" -> ")}</p>
        </div>
      )}
      <GraphComponent2 />
    </main>
  );
}
