import { useRef, useEffect, DependencyList } from 'react';
import * as d3 from 'd3';

export const useD3 = <T extends SVGElement = SVGElement>(
  renderChartFn: (svg: d3.Selection<T, unknown, null, undefined>) => void,
  dependencies: DependencyList
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
        renderChartFn(d3.select(ref.current));
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
};