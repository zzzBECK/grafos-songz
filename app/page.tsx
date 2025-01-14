"use client";

import GraphComponent from "@/components/graph-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGraph } from "@/hooks";
import { mockData } from "@/lib/mocks/songs";
import { useRef, useState } from "react";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const { findRelatedNodes, matchingNodes } = useGraph();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [layeredRecommendations, setLayeredRecommendations] = useState<{
    [layer: number]: string[];
  }>({});

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setAutocompleteOptions([]);
    if (searchInputRef.current && searchInputRef.current.value.trim() !== "") {
      const layers = findRelatedNodes(searchInputRef.current.value);
      console.log("Layers returned:", layers); // Verifique se `layers` está preenchido
      setLayeredRecommendations(layers);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.trim() === "") {
      setAutocompleteOptions([]);
    } else {
      const filteredOptions = mockData.nodes
        .filter((node) => node.id.toLowerCase().includes(value.toLowerCase()))
        .map((node) => node.id);
      setAutocompleteOptions(filteredOptions);
    }
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setAutocompleteOptions([]);
    if (searchInputRef.current) {
      searchInputRef.current.value = option;
    }
    findRelatedNodes(option);
    handleSearch(new Event("submit") as unknown as React.FormEvent);
  };

  return (
    <main className="min-h-svh w-[100vw] overflow-x-hidden">
      <div className="flex flex-col container min-h-20 items-center gap-10">
        <h1 className="text-4xl font-bold">Entrega 1</h1>
        <form
          onSubmit={handleSearch}
          ref={formRef}
          className="flex gap-2 relative"
        >
          <Input
            className="w-96"
            ref={searchInputRef}
            placeholder="Digite o nome da música"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button variant="default" type="submit">
            Buscar
          </Button>
          {autocompleteOptions.length > 0 && (
            <ul className="absolute top-full mt-1 w-full bg-card border border-gray-300 z-10 max-h-[70vh] overflow-auto">
              {autocompleteOptions.map((option) => (
                <li
                  key={option}
                  className="px-4 py-2 hover:bg-gray-900 cursor-pointer"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
      {matchingNodes.length === 0 ? (
        <div className="text-center">
          <p className="mt-10">
            Digite o nome de uma música para começar, não precisa ser o nome
            completo
          </p>
          <h2 className="text-3xl font-bold mt-10">
            Nenhuma música encontrada
          </h2>
        </div>
      ) : (
        <div className="flex w-full container mt-10">
          <div className="flex flex-col w-1/3 gap-10 ">
            <h2 className="text-3xl font-bold">Resultado da pesquisa</h2>
            <ul className="max-h-[30vh] overflow-auto">
              {matchingNodes.map((node) => (
                <li key={node.id}>{node.id}</li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold 0">Recomendações</h2>
            <div className="max-h-[30vh] overflow-auto">
              {Object.entries(layeredRecommendations).map(([layer, nodes]) =>
                layer === "0" ? null : (
                  <div key={layer}>
                    <h3 className="text-2xl font-semibold my-4">
                      Camada {layer}
                    </h3>
                    <ul>
                      {nodes.map((node) => (
                        <li key={node}>{node}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="w-2/3">
            <GraphComponent />
          </div>
        </div>
      )}
    </main>
  );
}
