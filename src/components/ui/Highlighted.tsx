/* ---------------------------------------------------------------------------
   Highlighted
   Renders a string where anything wrapped in *asterisks* gets the pink
   accent treatment. Lets Kate emphasise words straight from the content
   files without touching markup:

     headline: "Video that is *impossible to scroll past*."
   --------------------------------------------------------------------------- */

export function Highlighted({ text }: { text: string }) {
  const parts = text.split(/\*(.+?)\*/g);

  return (
    <>
      {parts.map((part, index) =>
        // Odd-numbered parts are the ones that were wrapped in asterisks.
        index % 2 === 1 ? (
          <span key={index} className="relative whitespace-normal text-blush-600 italic">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
