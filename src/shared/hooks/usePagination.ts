import { useSearchParams } from 'react-router-dom';

export function usePagination(defaultSize = 20) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? '0');
  const size = Number(searchParams.get('size') ?? String(defaultSize));

  const setPage = (next: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', String(next));
      return params;
    });
  };

  return { page, size, setPage };
}
