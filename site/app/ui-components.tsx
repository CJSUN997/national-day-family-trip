import type { ReactNode } from "react";

export function MobileNavIcon({
  name,
}: {
  name: "home" | "calendar" | "pin" | "ticket" | "check";
}) {
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4m8-4v4M4 10h16" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  if (name === "ticket") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4Z" />
        <path d="M12 7v2m0 2v2m0 2v2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16.5 9" />
    </svg>
  );
}

export function Heading({
  index,
  title,
  text,
  light = false,
}: {
  index: string;
  title: ReactNode;
  text: string;
  light?: boolean;
}) {
  return (
    <header className={`heading ${light ? "light" : ""}`}>
      <div>
        <small>{index}</small>
        <h2>{title}</h2>
      </div>
      <p>{text}</p>
    </header>
  );
}
export function FlightCard({
  urgent = false,
  status,
  date,
  code,
  title,
  items,
}: {
  urgent?: boolean;
  status?: string;
  date: string;
  code: string;
  title: string;
  items: string[];
}) {
  return (
    <article className={`flight-card ${urgent ? "urgent" : ""}`}>
      <header>
        <span>{status || (urgent ? "最高优先级" : "同步锁定")}</span>
        <small>{date}</small>
      </header>
      <p>{code}</p>
      <h3>{title}</h3>
      <ul>
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      {!status && (
        <a href="https://www.google.com/travel/flights" target="_blank">
          打开航班搜索 ↗
        </a>
      )}
    </article>
  );
}

