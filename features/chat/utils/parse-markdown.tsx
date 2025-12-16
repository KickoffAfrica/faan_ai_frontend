import React from "react";

/**
 * Parse markdown-style text and convert to React elements
 * Supports: **bold**, *italic*, and line breaks
 */
export function parseMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  
  // Split by line breaks first to handle paragraphs
  const lines = text.split("\n");
  
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      // Add line break between lines
      parts.push(<br key={`br-${lineIndex}`} />);
    }
    
    // Parse bold text (**text**) and italic (*text*)
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let lastIndex = 0;
    let match;
    let partIndex = 0;
    
    while ((match = regex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      
      // Check if it's bold (**) or italic (*)
      if (match[2]) {
        // Bold text
        parts.push(
          <strong key={`${lineIndex}-bold-${partIndex}`} className="font-semibold">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        // Italic text
        parts.push(
          <em key={`${lineIndex}-italic-${partIndex}`}>
            {match[3]}
          </em>
        );
      }
      
      lastIndex = match.index + match[0].length;
      partIndex++;
    }
    
    // Add remaining text after last match
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
  });
  
  return parts;
}

/**
 * Component wrapper for parsed markdown text
 */
interface MarkdownTextProps {
  children: string;
  className?: string;
}

export function MarkdownText({ children, className }: MarkdownTextProps) {
  return <span className={className}>{parseMarkdown(children)}</span>;
}

