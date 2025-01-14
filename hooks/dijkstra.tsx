"use client";

import React, { createContext, useContext, useState } from "react";
import { Graph, Link, Node } from "../types/graph";

interface GraphContextType {
  findShortestPath: (startId: string, endId: string) => string[] | null;
  findAllPaths: (startId: string, endId: string) => string[][];
  path: { nodes: Node[]; links: Link[] };
  shortestPath: string[] | null;
  allPaths: string[][];
}

class MinHeap {
  private heap: { id: string; distance: number }[] = [];

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private bubbleUp(index: number) {
    const parentIndex = Math.floor((index - 1) / 2);
    if (
      parentIndex >= 0 &&
      this.heap[parentIndex].distance > this.heap[index].distance
    ) {
      this.swap(parentIndex, index);
      this.bubbleUp(parentIndex);
    }
  }

  private bubbleDown(index: number) {
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    let smallest = index;

    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex].distance < this.heap[smallest].distance
    ) {
      smallest = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex].distance < this.heap[smallest].distance
    ) {
      smallest = rightChildIndex;
    }

    if (smallest !== index) {
      this.swap(smallest, index);
      this.bubbleDown(smallest);
    }
  }

  public insert(id: string, distance: number) {
    this.heap.push({ id, distance });
    this.bubbleUp(this.heap.length - 1);
  }

  public extractMin(): { id: string; distance: number } | null {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }
    return min;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

const DijkstraContext = createContext<GraphContextType | undefined>(undefined);

export const DijkstraProvider: React.FC<{
  graph: Graph;
  children: React.ReactNode;
}> = ({ graph, children }) => {
  const [path, setPath] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });
  const [shortestPath, setShortestPath] = useState<string[] | null>(null);
  const [allPaths, setAllPaths] = useState<string[][]>([]);

  const buildAdjacencyList = (graph: Graph) => {
    const adjacencyList = new Map<string, { node: Node; weight: number }[]>();

    graph.links.forEach((link) => {
      if (!adjacencyList.has(link.source)) {
        adjacencyList.set(link.source, []);
      }
      if (!adjacencyList.has(link.target)) {
        adjacencyList.set(link.target, []);
      }
      adjacencyList.get(link.source)!.push({
        node: graph.nodes.find((n) => n.id === link.target)!,
        weight: link.weight || 1,
      });
      adjacencyList.get(link.target)!.push({
        node: graph.nodes.find((n) => n.id === link.source)!,
        weight: link.weight || 1,
      });
    });

    return adjacencyList;
  };

  // Dijkstra's algorithm using a Min-Heap for shortest path
  const dijkstra = (
    graph: Graph,
    startId: string,
    endId: string
  ): string[] | null => {
    const adjacencyList = buildAdjacencyList(graph);
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const heap = new MinHeap();

    graph.nodes.forEach((node) => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      heap.insert(node.id, distances[node.id]);
    });

    distances[startId] = 0;
    heap.insert(startId, 0);

    while (!heap.isEmpty()) {
      const current = heap.extractMin();
      if (!current) break;

      const currentNodeId = current.id;
      if (currentNodeId === endId) {
        const path = [];
        let curr = endId;
        while (curr) {
          path.unshift(curr);
          curr = previous[curr]!;
        }
        return path;
      }

      const neighbors = adjacencyList.get(currentNodeId) || [];
      for (const neighbor of neighbors) {
        const alt = distances[currentNodeId] + neighbor.weight;
        if (alt < distances[neighbor.node.id]) {
          distances[neighbor.node.id] = alt;
          previous[neighbor.node.id] = currentNodeId;
          heap.insert(neighbor.node.id, alt);
        }
      }
    }

    return null;
  };

  const findShortestPath = (
    startId: string,
    endId: string
  ): string[] | null => {
    const pathIds = dijkstra(graph, startId, endId);
    setShortestPath(pathIds);

    if (pathIds) {
      // Build nodes and links in the path
      const pathNodes = pathIds.map(
        (id) => graph.nodes.find((n) => n.id === id)!
      );
      const pathLinks: Link[] = [];
      for (let i = 0; i < pathIds.length - 1; i++) {
        const source = pathIds[i];
        const target = pathIds[i + 1];
        const link = graph.links.find(
          (l) =>
            (l.source === source && l.target === target) ||
            (l.source === target && l.target === source)
        );
        if (link) {
          pathLinks.push(link);
        }
      }
      setPath({ nodes: pathNodes, links: pathLinks });
    }
    return pathIds;
  };

  // Function to find all paths between two nodes using DFS
  const findAllPaths = (startId: string, endId: string): string[][] => {
    const adjacencyList = buildAdjacencyList(graph);
    const paths: string[][] = [];
    const visited = new Set<string>();

    const dfs = (currentNode: string, pathSoFar: string[]) => {
      visited.add(currentNode);
      pathSoFar.push(currentNode);

      if (currentNode === endId) {
        paths.push([...pathSoFar]);
      } else {
        const neighbors = adjacencyList.get(currentNode) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.node.id)) {
            dfs(neighbor.node.id, pathSoFar);
          }
        }
      }

      pathSoFar.pop();
      visited.delete(currentNode);
    };

    dfs(startId, []);
    setAllPaths(paths);
    return paths;
  };

  return (
    <DijkstraContext.Provider
      value={{ findShortestPath, findAllPaths, path, shortestPath, allPaths }}
    >
      {children}
    </DijkstraContext.Provider>
  );
};

export const useDijkstra = () => {
  const context = useContext(DijkstraContext);
  if (!context) {
    throw new Error("useGraph must be used within a GraphProvider");
  }
  return context;
};
