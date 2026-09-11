// Helper to render text with gradient highlights
export const HighlightText = ({ text }: { text: string }) => {
  const parts = text.split(/(\[.*?\])/);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          return (
            <span key={i} className="bg-gradient-to-r from-[#B597FF] to-[#38E3FF] bg-clip-text text-transparent">
              {part.slice(1, -1)}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};
