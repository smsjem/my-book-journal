import { useEffect, useState } from 'react';

export type CatalogBook = { id: string; title: string; author: string; pages: number; cover?: string; source: string; isbn?: string };
type Props = { onChoose: (book: CatalogBook) => void; onManual: () => void; onClose: () => void };

function normalizeGoogle(item: any): CatalogBook {
  const info = item.volumeInfo || {};
  const isbn = (info.industryIdentifiers || []).find((x: any) => x.type === 'ISBN_13')?.identifier;
  return { id: 'google:' + item.id, title: info.title || 'Sin título', author: (info.authors || []).join(', '), pages: info.pageCount || 0, cover: info.imageLinks?.thumbnail?.replace('http:', 'https:'), source: 'Google Books', isbn };
}
function normalizeOpenLibrary(item: any): CatalogBook {
  const isbn = item.isbn?.[0];
  return { id: 'ol:' + item.key, title: item.title || 'Sin título', author: (item.author_name || []).join(', '), pages: item.number_of_pages_median || 0, cover: item.cover_i ? 'https://covers.openlibrary.org/b/id/' + item.cover_i + '-M.jpg' : undefined, source: 'Open Library', isbn };
}
export default function BookSearchModal({ onChoose, onManual, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatalogBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) { setResults([]); setSearched(false); setError(''); setLoading(false); return; }
    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true); setError('');
      const isbnOnly = term.replace(/[\s-]/g, '');
      const isISBN = /^(?:\d{10}|\d{13}|\d{9}[\dXx])$/.test(isbnOnly);
      const googleQuery = isISBN ? 'isbn:' + isbnOnly : term;
      const olQuery = isISBN ? 'isbn=' + encodeURIComponent(isbnOnly) : 'q=' + encodeURIComponent(term);
      const requests = await Promise.allSettled([
        fetch('https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(googleQuery) + '&maxResults=15', { signal: controller.signal }).then(async r => { if (!r.ok) throw Error('Google Books'); return r.json(); }),
        fetch('https://openlibrary.org/search.json?' + olQuery + '&limit=15&fields=key,title,author_name,cover_i,number_of_pages_median,isbn', { signal: controller.signal }).then(async r => { if (!r.ok) throw Error('Open Library'); return r.json(); })
      ]);
      if (cancelled) return;
      const found: CatalogBook[] = [];
      if (requests[0].status === 'fulfilled') found.push(...(requests[0].value.items || []).map(normalizeGoogle));
      if (requests[1].status === 'fulfilled') found.push(...(requests[1].value.docs || []).map(normalizeOpenLibrary));
      const unique = new Map<string, CatalogBook>();
      for (const book of found) {
        const key = book.isbn || (book.title + '|' + book.author).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (!unique.has(key)) unique.set(key, book);
      }
      setResults([...unique.values()]);
      setSearched(true);
      setLoading(false);
      if (requests.every(r => r.status === 'rejected')) setError('No se pudo conectar con los catálogos. Probá nuevamente o cargá el libro manualmente.');
    }, 450);
    return () => { cancelled = true; controller.abort(); window.clearTimeout(timeout); };
  }, [query]);
  return <div className="overlay" role="presentation"><section className="modal search-modal" role="dialog" aria-modal="true" aria-label="Buscar libros">
    <div className="modalhead"><h2>Encontrá tu próximo libro</h2><button onClick={onClose} aria-label="Cerrar">✕</button></div>
    <p>Buscá por título, autor o ISBN. Elegí un resultado para completar los datos automáticamente.</p>
    <label>Buscar en los catálogos<input autoFocus placeholder="Ej. Fourth Wing, Rebecca Yarros o ISBN" value={query} onChange={e => setQuery(e.target.value)}/></label>
    {loading && <p role="status">Buscando libros…</p>}
    {error && <p role="alert">{error}</p>}
    {!loading && searched && !error && results.length === 0 && <p>No encontramos coincidencias. Podés probar otro término o agregarlo manualmente.</p>}
    <div className="search-results">
      {results.map(book => <button className="search-result" key={book.id} onClick={() => onChoose(book)}>
        {book.cover ? <img src={book.cover} alt="" loading="lazy"/> : <div className="search-placeholder">📖</div>}
        <span><strong>{book.title}</strong><small>{book.author || 'Autor no disponible'}</small><small>{book.pages ? book.pages + ' páginas · ' : ''}{book.source}</small></span><span aria-hidden="true">＋</span>
      </button>)}
    </div>
    <button className="manual-option" onClick={onManual}>＋ No está en el catálogo: agregar manualmente</button>
  </section></div>;
}
