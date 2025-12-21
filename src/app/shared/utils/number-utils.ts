export function coerceNumber( v: any ): number {
  if ( v == null ) return 0;
  if ( typeof v === 'number' ) return v;
  if ( typeof v === 'string' ) {
    const cleaned = v.replace( /[^0-9.\-]/g, '' );
    const parsed = parseFloat( cleaned );
    return Number.isFinite( parsed ) ? parsed : 0;
  }
  return 0;
}

export default coerceNumber;
