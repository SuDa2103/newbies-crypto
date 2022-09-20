import cls from "classnames";
import { ReactNode } from "react";
import DarkModeToggle from "./DarkModeToggle";

export const RETAIL_PRICE = parseInt(
  process.env.NEXT_PUBLIC_RETAIL_PRICE_EUR,
  10
);

export const CURRENCIES: {
  options: Array<{
    symbol: string;
    iso: string;
    active?: boolean;
  }>;
} = {
  options: [
    { symbol: "€", iso: "eur", active: true },
    { symbol: "$", iso: "usd" }
  ]
};

type Props = {
  children: ReactNode;
  sharedParentMainClass?: string;
  isChapter?: boolean;
};

const Shared = ({ children, sharedParentMainClass, isChapter }: Props) => (
  <>
    <div className={cls("container", { "overflow-hidden": isChapter })}>
      <main className={cls("main", sharedParentMainClass)}>
        <div className="toggle-wrapper">
          <DarkModeToggle />
        </div>

        {children}
      </main>
    </div>
  </>
);

export default Shared;
