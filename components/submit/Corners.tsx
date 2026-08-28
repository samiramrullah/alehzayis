export default function Corners() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[5px] top-[5px] z-30 h-[13px] w-[13px] border-l border-t border-[#C59B27]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[5px] top-[5px] z-30 h-[13px] w-[13px] border-r border-t border-[#C59B27]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[5px] left-[5px] z-30 h-[13px] w-[13px] border-b border-l border-[#C59B27]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[5px] right-[5px] z-30 h-[13px] w-[13px] border-b border-r border-[#C59B27]"
      />
    </>
  );
}