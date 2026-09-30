import React from 'react';

type Props = {className?:string};
export const AnalyticsGlyph = ({className}:Props) => <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><rect x="3" y="20" width="6" height="9" rx="3"/><rect x="13" y="3" width="6" height="26" rx="3"/><rect x="23" y="12" width="6" height="17" rx="3"/></svg>;
export const CardsGlyph = ({className}:Props) => <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M5 6h22a3 3 0 0 1 3 3v2H2V9a3 3 0 0 1 3-3Zm-3 8h28v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3Zm5 6v3h11v-3Z" fillRule="evenodd"/></svg>;
export const BankGlyph = ({className}:Props) => <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="m16 2 14 7v4H2V9Zm-12 13h5v12H4Zm10 0h4v12h-4Zm9 0h5v12h-5ZM2 27h28v4H2Z"/></svg>;
export const InvestGlyph = ({className}:Props) => <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 14c7-15 13 8 26-10M4 22v7m10-11v11m10-15v15"/></svg>;
export const PaymentsGlyph = ({className}:Props) => <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M18 3a2 2 0 0 1 3-1l8 6a2 2 0 0 1 0 3l-8 6a2 2 0 0 1-3-1v-4H6a3 3 0 0 1 0-6h12ZM14 16a2 2 0 0 0-3-1l-8 6a2 2 0 0 0 0 3l8 6a2 2 0 0 0 3-1v-4h12a3 3 0 0 0 0-6H14Z"/></svg>;
export const PointsGlyph = ({className}:Props) => <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="m16 1 14 8v15l-14 8L2 24V9Zm0 7-2 7-7 2 7 2 2 7 2-7 7-2-7-2Z" fillRule="evenodd"/></svg>;
