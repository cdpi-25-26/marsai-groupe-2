// utils to load and parse markdown tutorial files for TutorialBox

/**
 * Reads a markdown file and extracts steps for TutorialBox
 * @param {string} filePath - Absolute path to the markdown file
 * @returns {Promise<{title: string, steps: string[]}>}
 */
export async function loadTutorialSteps(filePath) {
  // Use fetch for browser compatibility
  const response = await fetch(filePath);
  if (!response.ok) throw new Error('Failed to load tutorial file');
  const content = await response.text();
  // Extract title
  const titleMatch = content.match(/^#\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Tutoriel';
  // Extract steps: lines starting with '-' or numbered lists
  const stepLines = content.match(/^[-*]\s+.+$|^\d+\.\s+.+$/gm) || [];
  // Clean steps
  const steps = stepLines.map(line => line.replace(/^[-*\d+\.]+\s*/, '').trim());
  return { title, steps };
}
