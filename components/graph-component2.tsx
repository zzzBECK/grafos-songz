/* eslint-disable @typescript-eslint/no-explicit-any */
// GraphComponent.tsx
"use client";

import { useDijkstra } from "@/hooks/dijkstra";
import { mockData } from "@/lib/mocks/songs";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

const GraphComponent = () => {
  const { shortestPath, allPaths } = useDijkstra();

  const graphData = mockData;

  // Create sets for nodes and links in shortest path
  const shortestPathNodeSet = new Set(shortestPath || []);
  const shortestPathLinkSet = new Set<string>();

  if (shortestPath) {
    for (let i = 0; i < shortestPath.length - 1; i++) {
      const source = shortestPath[i];
      const target = shortestPath[i + 1];
      shortestPathLinkSet.add(`${source}-${target}`);
      shortestPathLinkSet.add(`${target}-${source}`);
    }
  }

  // Create sets for nodes and links in other paths
  const otherPathsNodeSet = new Set<string>();
  const otherPathsLinkSet = new Set<string>();

  if (allPaths) {
    allPaths.forEach((path) => {
      // Skip the shortest path
      if (shortestPath && path.join() === shortestPath.join()) return;

      path.forEach((nodeId) => {
        otherPathsNodeSet.add(nodeId);
      });

      for (let i = 0; i < path.length - 1; i++) {
        const source = path[i];
        const target = path[i + 1];
        otherPathsLinkSet.add(`${source}-${target}`);
        otherPathsLinkSet.add(`${target}-${source}`);
      }
    });
  }

  // Function to determine node color
  const nodeColor = (node: any) => {
    if (shortestPathNodeSet.has(node.id)) {
      return "red"; // Nodes in shortest path
    } else if (otherPathsNodeSet.has(node.id)) {
      return "yellow"; // Nodes in other paths
    } else {
      return "gray"; // Other nodes
    }
  };

  // Function to determine link color
  const linkColor = (link: any) => {
    // Ensure we get the correct IDs from link.source and link.target
    const sourceId =
      typeof link.source === "object" ? link.source.id : link.source;
    const targetId =
      typeof link.target === "object" ? link.target.id : link.target;

    const linkId = `${sourceId}-${targetId}`;
    const reverseLinkId = `${targetId}-${sourceId}`;

    if (
      shortestPathLinkSet.has(linkId) ||
      shortestPathLinkSet.has(reverseLinkId)
    ) {
      return "red"; // Links in shortest path
    } else if (
      otherPathsLinkSet.has(linkId) ||
      otherPathsLinkSet.has(reverseLinkId)
    ) {
      return "yellow"; // Links in other paths
    } else {
      return "gray"; // Other links
    }
  };

  return (
    <div className="flex w-full justify-center overflow-hidden h-fit">
      <div className="w-2/3 flex justify-center items-center">
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={(node) => `${node.id} (${node.genre}) - ${node.artist}`}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = nodeColor(node);
            ctx.fillText(label as string, node.x as number, node.y as number);
          }}
          linkColor={linkColor}
          nodeRelSize={4}
          height={600}
          width={1200}
          linkDirectionalArrowLength={0}
          linkDirectionalArrowRelPos={0}
          enableZoomInteraction={true}
          enableNodeDrag={false}
          nodeCanvasObjectMode={() => "after"}
        />
      </div>
    </div>
  );
};

export default GraphComponent;
