import { AppHeader } from "@/components/app-header";

/** Gemeinsames Layout für Textseiten wie Datenschutz und Impressum. */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader title={title} back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-col gap-space-lg px-margin pb-space-xl pt-space-md">
          {children}
        </div>
      </main>
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-space-sm">
      <h2 className="text-headline-sm text-on-surface">{title}</h2>
      <div className="space-y-space-sm text-body-md leading-relaxed text-on-surface-variant [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-on-surface [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
