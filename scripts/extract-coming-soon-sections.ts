import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  children?: FigmaNode[];
  characters?: string;
  style?: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    lineHeightPx?: number;
    letterSpacing?: number;
  };
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  fills?: any[];
}

interface FigmaNodesResponse { nodes: Record<string, { document: FigmaNode }> }

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_API_KEY || process.env.FIGMA_ACCESS_TOKEN;

function parseArgs(): { fileKey: string; nodeId: string; url?: string } {
  const DEFAULT_FILE_KEY = 'Jj89xqSTRiTU2P4qEw5zUu';
  const DEFAULT_NODE_ID = '1421:6061';
  const args = process.argv.slice(2);
  let fileKey = DEFAULT_FILE_KEY;
  let nodeId = DEFAULT_NODE_ID;
  let url: string | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--file' && args[i + 1]) fileKey = args[++i];
    else if (a === '--node' && args[i + 1]) nodeId = args[++i];
    else if (a === '--url' && args[i + 1]) url = args[++i];
  }
  if (url) {
    const fk = url.match(/design\/([A-Za-z0-9]+)\?/);
    const ni = url.match(/node-id=([^&]+)/);
    if (fk) fileKey = fk[1];
    if (ni) nodeId = decodeURIComponent(ni[1]).replace(/-/g, ':');
  }
  return { fileKey, nodeId, url };
}

async function fetchNode(fileKey: string, nodeId: string): Promise<FigmaNode> {
  if (!FIGMA_ACCESS_TOKEN) throw new Error('FIGMA_ACCESS_TOKEN env var is required');
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_ACCESS_TOKEN } });
  if (!res.ok) throw new Error(`Figma API error ${res.status}: ${res.statusText}`);
  const json = (await res.json()) as FigmaNodesResponse;
  const node = json.nodes[nodeId]?.document;
  if (!node) throw new Error(`Node ${nodeId} not found`);
  return node;
}

function collectTextNodes(node: FigmaNode, acc: FigmaNode[] = []) {
  if (node.type === 'TEXT' && node.characters) acc.push(node);
  node.children?.forEach((c) => collectTextNodes(c, acc));
  return acc;
}

function findLargestMediaNode(node: FigmaNode): FigmaNode | null {
  let best: FigmaNode | null = null;
  function walk(n: FigmaNode) {
    const isMediaCandidate = n.type === 'RECTANGLE' || n.type === 'FRAME' || n.type === 'GROUP';
    if (isMediaCandidate && n.absoluteBoundingBox) {
      if (!best) best = n; else {
        const a1 = (best.absoluteBoundingBox?.width || 0) * (best.absoluteBoundingBox?.height || 0);
        const a2 = (n.absoluteBoundingBox.width || 0) * (n.absoluteBoundingBox.height || 0);
        if (a2 > a1) best = n;
      }
    }
    n.children?.forEach(walk);
  }
  walk(node);
  return best;
}

function ensureDir(dir: string) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

async function main() {
  const { fileKey, nodeId, url } = parseArgs();
  const figmaUrl = url || `https://www.figma.com/design/${fileKey}/Bendy_BethC-Website?node-id=${encodeURIComponent(nodeId.replace(/:/g, '-'))}`;
  console.log('🔍 Extracting Coming Soon sections');
  console.log(`📁 File: ${fileKey}`);
  console.log(`🎯 Node: ${nodeId}`);
  console.log(`🔗 URL:  ${figmaUrl}`);

  const node = await fetchNode(fileKey, nodeId);

  const textNodes = collectTextNodes(node);
  const copyTexts = textNodes.map((t) => ({
    text: t.characters?.trim(),
    fontFamily: t.style?.fontFamily,
    fontWeight: t.style?.fontWeight,
    fontSize: t.style?.fontSize,
    lineHeightPx: t.style?.lineHeightPx,
    bbox: t.absoluteBoundingBox || null,
  }))
  .filter((t) => t.text && t.text.length > 0);

  const mediaNode = findLargestMediaNode(node);
  const media = mediaNode?.absoluteBoundingBox ? {
    id: mediaNode?.id,
    name: mediaNode?.name,
    type: mediaNode?.type,
    width: mediaNode.absoluteBoundingBox.width,
    height: mediaNode.absoluteBoundingBox.height,
  } : null;

  const outDir = path.join(process.cwd(), 'data', 'figma-analysis');
  ensureDir(outDir);
  const outPath = path.join(outDir, `coming-soon-${nodeId.replace(/:/g, '-')}.json`);
  const summary = { figmaUrl, nodeId, copyTexts, media };
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`📄 Saved summary → ${outPath}`);

  // Print concise summary to stdout
  console.log('\n📝 Extracted Copy:');
  copyTexts.forEach((t, i) => console.log(` ${i + 1}. ${t.text}`));
  if (media) console.log(`\n🖼 Sunflower media bbox: ${media.width} x ${media.height}`);
}

main().catch((e) => { console.error('❌ Error:', e.message || e); process.exit(1); });
