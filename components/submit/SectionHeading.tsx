export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-[48px] max-w-[640px] text-center">
      <div className="mb-[14px] flex items-center justify-center gap-[11px]">
        <span className="h-px w-[25px] bg-[#C59B27]" />
        <span className="font-body text-[0.76rem] font-semibold uppercase tracking-[0.27em] text-[#8B6816]">
          {eyebrow}
        </span>
        <span className="h-px w-[25px] bg-[#C59B27]" />
      </div>

      <h2 className="font-display text-[2.2rem] font-normal leading-[1.08] tracking-[-0.02em] text-[#3A101A] sm:text-[2.6rem]">
        {title}
      </h2>

      <div className="mx-auto my-[20px] h-[2px] w-[58px] bg-[#C59B27]" />

      {description && (
        <p className="font-body text-[1rem] leading-[1.7] text-[#66575A]">{description}</p>
      )}
    </div>
  );
}