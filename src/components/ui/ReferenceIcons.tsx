import { SVGProps } from "react";

// Unchanged glyph paths from @revolut/icons 2.8.0; see public/icons/revolut/LICENSE.txt.
export function OfficialIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <use href={`/icons/revolut/${name}.svg#glyph`} />
    </svg>
  );
}
type Props = SVGProps<SVGSVGElement>;
export const AnalyticsGlyph = (props: Props) => (
  <OfficialIcon name="bar-chart" {...props} />
);
export const CardsGlyph = (props: Props) => (
  <OfficialIcon name="card" {...props} />
);
export const BankGlyph = (props: Props) => (
  <OfficialIcon name="bank" {...props} />
);
export const InvestGlyph = (props: Props) => (
  <OfficialIcon name="invest" {...props} />
);
export const PaymentsGlyph = (props: Props) => (
  <OfficialIcon name="arrow-right-left" {...props} />
);
export const CreditGlyph = (props: Props) => (
  <OfficialIcon name="coins" {...props} />
);
export const CryptoGlyph = (props: Props) => (
  <OfficialIcon name="bitcoin" {...props} />
);
export const PointsGlyph = (props: Props) => (
  <OfficialIcon name="rev-points" {...props} />
);
export const PlusGlyph = (props: Props) => (
  <OfficialIcon name="plus" {...props} />
);
export const MoveGlyph = (props: Props) => (
  <OfficialIcon name="arrow-shuffle" {...props} />
);
export const MoreGlyph = (props: Props) => (
  <OfficialIcon name="more-i-os" {...props} />
);
export const BackGlyph = (props: Props) => (
  <OfficialIcon name="back-button-arrow" {...props} />
);
export const SendGlyph = (props: Props) => (
  <OfficialIcon name="arrow-send" {...props} />
);
export const RequestGlyph = (props: Props) => (
  <OfficialIcon name="arrow-request" {...props} />
);
export const CalendarGlyph = (props: Props) => (
  <OfficialIcon name="calendar" {...props} />
);
export const SearchGlyph = (props: Props) => (
  <OfficialIcon name="search" {...props} />
);
